---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 466
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 466 of 1290)

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

---[FILE: left-sidebar.mdx]---
Location: zulip-main/starlight_help/src/content/docs/left-sidebar.mdx

```text
---
title: Left sidebar
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ComposeAndSendMessage from "../include/_ComposeAndSendMessage.mdx";
import ConfigureChannelLinks from "../include/_ConfigureChannelLinks.mdx";
import FilterChannels from "../include/_FilterChannels.mdx";
import FilterResolvedLeftSidebar from "../include/_FilterResolvedLeftSidebar.mdx";
import FindDmConversationLeftSidebar from "../include/_FindDmConversationLeftSidebar.mdx";
import SearchNoteForDmConversations from "../include/_SearchNoteForDmConversations.mdx";
import StartTopicViaLeftSidebar from "../include/_StartTopicViaLeftSidebar.mdx";
import ViewDmsLeftSidebar from "../include/_ViewDmsLeftSidebar.mdx";

import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";
import PanelLeftIcon from "~icons/zulip-icon/panel-left";
import PanelLeftDashedIcon from "~icons/zulip-icon/panel-left-dashed";
import SquarePlusIcon from "~icons/zulip-icon/square-plus";

The left sidebar in the Zulip web and desktop apps helps you navigate your
conversations, and [start new
ones](#start-a-new-conversation-from-the-left-sidebar). It's divided into
sections:

* **Views** provide various ways to get an overview of your messages.
* The **direct messages** section shows your [direct
  message](/help/direct-messages) conversations.
* [Channels](/help/introduction-to-channels) you are subscribed to are shown
  organized into sections by [folder](/help/channel-folders).

You can customize how channels are organized within the **channels**
section by:

* [Pinning channels](/help/pin-a-channel) so that they appear in a dedicated
  section at the top of the list of channels.
* [Changing channel colors](/help/change-the-color-of-a-channel).
* [Configuring](/help/channel-folders#configure-whether-channels-are-grouped-by-folder-in-the-left-sidebar)
  whether channels are grouped by folder.
* [Configuring](/help/manage-inactive-channels) whether inactive channels are
  hidden.

You can also [configure](#configure-where-channel-links-in-the-left-sidebar-go)
where clicking on channel links in the left sidebar takes you.

## Find a direct message conversation

<SearchNoteForDmConversations />

<Tabs>
  <TabItem label="Desktop/Web">
    <FindDmConversationLeftSidebar />
  </TabItem>
</Tabs>

## Find a channel you're subscribed to

<FilterChannels />

## Adjust what information is shown

There are many ways you can adjust the left sidebar to help you focus on the
information you need in the moment.

### Expand or collapse sections

<Tabs>
  <TabItem label="One section">
    <Steps>
      1. Click the section heading, such as **views**, **direct messages**,
         **pinned channels**, etc., in the left sidebar.
    </Steps>
  </TabItem>

  <TabItem label="All sections">
    <Steps>
      1. Click the **ellipsis** (<MoreVerticalIcon />)
         to the right of the **Filter left sidebar** box in the upper left.
      1. Click **Expand all sections** or **Collapse all sections**, as
         desired.
    </Steps>
  </TabItem>
</Tabs>

### Show more direct message conversations

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <ViewDmsLeftSidebar />
    </FlattenedSteps>

    <ZulipTip>
      To return to the channel list in the left sidebar, click the **back to
      channels** link above the search box.
    </ZulipTip>
  </TabItem>
</Tabs>

### Show all topics in a channel

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click on a channel in the left sidebar.
      1. Click **show all topics** at the bottom of the list of recent topics in the
         selected channel.
    </Steps>

    <ZulipTip>
      To return to the channel list in the left sidebar, click the **back to
      channels** link above the search box.
    </ZulipTip>
  </TabItem>
</Tabs>

### Filter by whether topics are resolved

<FilterResolvedLeftSidebar />

### Show the left sidebar

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. At the top left corner, click the <PanelLeftIcon /> icon.
    </Steps>
  </TabItem>
</Tabs>

### Hide the left sidebar

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. At the top left corner, click the <PanelLeftDashedIcon /> icon.
    </Steps>
  </TabItem>
</Tabs>

## Configure where channel links in the left sidebar go

<ConfigureChannelLinks />

## Start a new conversation from the left sidebar

You can start any new conversation from the left sidebar, regardless of what
you’re currently viewing.

### Start a new direct message conversation

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      1. Click the **new direct message** (<SquarePlusIcon />)
         button next to the **direct messages** heading in the left sidebar.
      1. Start typing the name of the person or [group](/help/user-groups) you want to
         message, and select their name from the list of suggestions. You can continue
         adding as many message recipients as you like.

      <ComposeAndSendMessage />
    </FlattenedSteps>

    <KeyboardTip>
      You can also use the <kbd>X</kbd> keyboard shortcut to start a new direct
      message conversation.
    </KeyboardTip>
  </TabItem>
</Tabs>

### Start a new topic

<Tabs>
  <TabItem label="Via left sidebar">
    <FlattenedSteps>
      <StartTopicViaLeftSidebar />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Reading strategies](/help/reading-strategies)
* [Configuring unread message counters](/help/configure-unread-message-counters)
* [Inbox](/help/inbox)
* [Recent conversations](/help/recent-conversations)
* [Combined feed](/help/combined-feed)
* [Channel feed](/help/channel-feed)
* [List of topics in a channel](/help/list-of-topics)
* [View your mentions](/help/view-your-mentions)
* [Star a message](/help/star-a-message)
```

--------------------------------------------------------------------------------

---[FILE: line-spacing.mdx]---
Location: zulip-main/starlight_help/src/content/docs/line-spacing.mdx

```text
---
title: Line spacing
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import PersonalMenu from "../include/_PersonalMenu.mdx";

import LineHeightBigIcon from "~icons/zulip-icon/line-height-big";
import MinusIcon from "~icons/zulip-icon/minus";
import PlusIcon from "~icons/zulip-icon/plus";

Zulip lets you adjust line spacing in the web and desktop apps, to
make the Zulip interface feel most comfortable for you. Most
importantly, this setting modifies how much space there is between
lines of text in multi-line messages. You can experiment to see what
configuration makes reading most pleasant for you.

Reducing line spacing and [font size](/help/font-size) may be helpful on small
screens, so that you can see more content at a time.

## Change line spacing

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <PersonalMenu />

      1. Click <PlusIcon /> to increase the line
         spacing, <MinusIcon /> to decrease it, and <LineHeightBigIcon /> to reset to the default.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Review your settings](/help/review-your-settings)
* [Configure default new user settings](/help/configure-default-new-user-settings)
* [Font size](/help/font-size)
* [Dark theme](/help/dark-theme)
```

--------------------------------------------------------------------------------

---[FILE: link-to-a-message-or-conversation.mdx]---
Location: zulip-main/starlight_help/src/content/docs/link-to-a-message-or-conversation.mdx

```text
---
title: Link to a message or conversation
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ChannelActions from "../include/_ChannelActions.mdx";
import ChannelLongPressMenu from "../include/_ChannelLongPressMenu.mdx";
import MessageActionsMenu from "../include/_MessageActionsMenu.mdx";
import MessageLongPressMenu from "../include/_MessageLongPressMenu.mdx";
import StartComposing from "../include/_StartComposing.mdx";
import TopicActions from "../include/_TopicActions.mdx";
import TopicLongPressMenu from "../include/_TopicLongPressMenu.mdx";

Zulip makes it easy to share links to messages, topics, and channels. You can
link from one Zulip [conversation](/help/reading-conversations) to another, or
share links to Zulip conversations in issue trackers, emails, or other external
tools.

## Link to a channel within Zulip

Channel links are automatically formatted as [#channel name](#link-to-a-channel-within-zulip).

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <StartComposing />

      1. Type `#` followed by a few letters from the channel name.
      1. Pick the desired channel from the autocomplete.
      1. Pick the top option from the autocomplete to link to the channel without
         selecting a topic.
    </FlattenedSteps>

    <ZulipTip>
      To link to the channel you're composing to, type `#>`, and pick the
      top option from the autocomplete.
    </ZulipTip>
  </TabItem>
</Tabs>

In the web and desktop apps, when you paste a channel link into Zulip,
it's automatically formatted as `#**channel name**`. You can use
<kbd data-mac-following-key="⌥">Ctrl</kbd> + <kbd>Shift</kbd> +
<kbd>V</kbd> to paste as plain text if you prefer.

You can create a channel link manually by typing `#**channel name**`.

## Link to a topic within Zulip

Topic links are automatically formatted as [#channel > topic](#link-to-a-topic-within-zulip).

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <StartComposing />

      1. Type `#` followed by a few letters from the channel name.
      1. Pick the desired channel from the autocomplete.
      1. Type a few letters from the topic name.
      1. Pick the desired topic from the autocomplete.
    </FlattenedSteps>

    <ZulipTip>
      To link to a topic in the channel you're composing to, type `#>`
      followed by a few letters from the topic name, and pick the desired
      topic from the autocomplete.
    </ZulipTip>
  </TabItem>
</Tabs>

In the web and desktop apps, when you paste a topic link into Zulip, it's
automatically formatted as `#**channel name>topic name**`. You can use
<kbd data-mac-following-key="⌥">Ctrl</kbd> + <kbd>Shift</kbd> +
<kbd>V</kbd> to paste as plain text if you prefer.

You can create a topic link manually by typing `#**channel name>topic name**`.

## Link to Zulip from anywhere

All URLs in Zulip are designed to be **shareable**, including:

* Links to messages, topics, and channels.
* Search URLs, though note that personal
  [filters](/help/search-for-messages#search-filters) (e.g., `is:followed`) will
  be applied according to the user who's viewing the URL.

In addition, links to messages, topics, and channels are **permanent**:

* [Message links](#get-a-link-to-a-specific-message) will still work even when
  the message is [moved to another topic](/help/move-content-to-another-topic)
  or [channel](/help/move-content-to-another-channel), or if its [topic is
  resolved](/help/resolve-a-topic). Zulip uses the same permanent link syntax
  when [quoting a message](/help/quote-or-forward-a-message).
* [Topic links](#get-a-link-to-a-specific-topic) will still work even when the
  topic is [renamed](/help/rename-a-topic), [moved to another
  channel](/help/move-content-to-another-channel), or
  [resolved](/help/resolve-a-topic).
  <ZulipTip>
    When some messages are [moved out of a
    topic](/help/move-content-to-another-topic) and others are left in place,
    links to that topic will follow the location of the message whose ID is
    encoded in the topic URL (usually the first or last message in the topic).
  </ZulipTip>
* [Channel links](#get-a-link-to-a-specific-channel) will still work even when a
  channel is [renamed](/help/rename-a-channel) or
  [archived](/help/archive-a-channel).

When you copy a Zulip link in the web and desktop apps, and paste it anywhere that
accepts HTML formatting (e.g., your email, GitHub, docs, etc.), the link will be
formatted as it would be in Zulip (e.g., [#channel > topic](#link-to-a-topic-within-zulip)).
To paste the plain URL, you can paste without formatting (likely <kbd>Ctrl</kbd> +
<kbd>Shift</kbd> + <kbd>V</kbd> in your browser).

<ZulipNote>
  Due to a Safari quirk, pasting Zulip links from Safari into GitHub
  and some other apps may result in incorrect formatting. You can
  paste without formatting, or use a different browser.
</ZulipNote>

### Get a link to a specific message

This copies to your clipboard a permanent link to the message, displayed in the
context of its conversation. To preserve your reading status, messages won't be
automatically marked as read when you view a conversation via a message link.

In the web and desktop apps, when you paste a message link into the compose box,
it gets automatically formatted to be easy to read:

```
#**channel name>topic name@message ID**
```

When you send your message, the link will appear as
[#channel > topic @ 💬](#get-a-link-to-a-specific-message).

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActionsMenu />

      1. Click **Copy link to message**.
    </FlattenedSteps>

    <ZulipTip>
      If using Zulip in a browser, you can also click on the timestamp
      of a message, and copy the URL from your browser's address bar.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />

      1. Tap **Copy link to message**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

In the web and desktop apps, when you paste a message link into Zulip,
it is automatically formatted for you. You can use
<kbd data-mac-following-key="⌥">Ctrl</kbd> + <kbd>Shift</kbd> +
<kbd>V</kbd> to paste as plain text if you prefer.

### Get a link to a specific topic

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <TopicActions />

      1. Click **Copy link to topic**.
    </FlattenedSteps>

    <ZulipTip>
      If using Zulip in a browser, you can also click on a topic name,
      and copy the URL from your browser's address bar.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <TopicLongPressMenu />

      1. Tap **Copy link to topic**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

### Get a link to a specific channel

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <ChannelActions />

      1. Click **Copy link to channel**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <ChannelLongPressMenu />

      1. Tap **Copy link to channel**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Add a custom linkifier](/help/add-a-custom-linkifier)
* [Message formatting](/help/format-your-message-using-markdown)
* [Linking to your organization](/help/linking-to-zulip)
* [Pin information](/help/pin-information)
```

--------------------------------------------------------------------------------

---[FILE: linking-to-zulip-website.mdx]---
Location: zulip-main/starlight_help/src/content/docs/linking-to-zulip-website.mdx

```text
---
title: Linking to the Zulip website
---

import {Steps} from "@astrojs/starlight/components";

import SupportingZulipMotivation from "../include/_SupportingZulipMotivation.mdx";

<SupportingZulipMotivation />

If your organization is sponsored by Zulip, or wishes to express appreciation
for the Zulip project, please help others find out about Zulip. To do so, follow the
guidelines below to list Zulip in the appropriate section of your organization's
website (e.g., **Sponsors** or **Acknowledgements**).

## Link to the Zulip website

<Steps>
  1. Select a [Zulip
     logo](https://github.com/zulip/zulip/tree/main/static/images/logo),
     preferably a **round Zulip icon** (available in `.png` and `.svg` formats).
  1. Link to [https://zulip.com/](https://zulip.com/).
  1. If appropriate, add a brief description:
     > Zulip is an organized team chat app designed for efficient communication.
</Steps>

## Related articles

* [Support the Zulip project](/help/support-zulip-project)
* [Linking to your Zulip organization](/help/linking-to-zulip)
* [Zulip communities directory](/help/communities-directory)
```

--------------------------------------------------------------------------------

---[FILE: linking-to-zulip.mdx]---
Location: zulip-main/starlight_help/src/content/docs/linking-to-zulip.mdx

```text
---
title: Linking to your organization
---

You can link to your Zulip organization from the web with a Zulip
[shields.io](https://github.com/badges/shields) badge:

[![Zulip chat](https://img.shields.io/badge/zulip-join_chat-brightgreen.svg)](https://chat.zulip.org)

Good places for the badge include your project's landing page, support
pages, and/or GitHub homepage.

To embed a Zulip badge, copy and paste the following, replacing
`https://chat.zulip.org` with the URL of your Zulip organization:

Markdown

```md "chat.zulip.org"
[![project chat](https://img.shields.io/badge/zulip-join_chat-brightgreen.svg)](https://chat.zulip.org)
```

HTML

```html "chat.zulip.org"
<a href="https://chat.zulip.org"><img src="https://img.shields.io/badge/zulip-join_chat-brightgreen.svg" /></a>
```

## Related articles

* [Link to a message or conversation](/help/link-to-a-message-or-conversation)
* [Linking to the Zulip website](/help/linking-to-zulip-website)
```

--------------------------------------------------------------------------------

---[FILE: list-of-topics.mdx]---
Location: zulip-main/starlight_help/src/content/docs/list-of-topics.mdx

```text
---
title: List of topics in a channel
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ChannelActions from "../include/_ChannelActions.mdx";
import ConfigureChannelLinks from "../include/_ConfigureChannelLinks.mdx";
import MobileChannels from "../include/_MobileChannels.mdx";

import TopicListIcon from "~icons/zulip-icon/topic-list";

You can view a list of recent topics any channel. It's a great way to get an
overview if you like reading your messages one channel at a time.

## Use the list of topics in a subscribed channel

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <ChannelActions />

      1. Click **Go to list of topics**. If you do not see this option, Zulip is
         [configured](#configure-where-channel-links-in-the-left-sidebar-go) so that
         clicking on the channel name in the left sidebar will take you directly to
         the list of topics.
      1. Click on a conversation you're interested in to view it. You can return to
         the list of topics when done (e.g., by using the **back** button in your
         browser or desktop app) to select the next conversation.
    </FlattenedSteps>

    <KeyboardTip>
      Use <kbd>Y</kbd> to go to the list of topics for the current channel.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileChannels />

      1. Select a channel.
      1. Tap **topics** (<TopicListIcon />)
         in the upper right corner of the app.
      1. Tap on a conversation you're interested in to view it. You can return to
         the list of topics when done (e.g., by using the **back** button) to select
         the next conversation.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Configure where channel links in the left sidebar go

<ConfigureChannelLinks />

## Filter conversations

### Filter by topic status

In the web app, you can control whether the list of topics includes all topics,
just topics you haven't [muted](/help/mute-a-topic), or only topics you
[follow](/help/follow-a-topic).

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. In the list of topics for a channel, select **All topics**, **Standard
         view**, or **Followed topics** from the dropdown in the upper left.
    </Steps>
  </TabItem>
</Tabs>

In muted channels, the **Standard view** includes all topics you haven't
explicitly muted.

### Filter by keyword

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. In the list of topics for a channel, use the **Filter** box at the top to
         find a conversation.
    </Steps>
  </TabItem>
</Tabs>

## Related articles

* [Channel feed](/help/channel-feed)
* [Inbox](/help/inbox)
* [Recent conversations](/help/recent-conversations)
* [Left sidebar](/help/left-sidebar)
* [Reading strategies](/help/reading-strategies)
* [Reading conversations](/help/reading-conversations)
```

--------------------------------------------------------------------------------

---[FILE: logging-in.mdx]---
Location: zulip-main/starlight_help/src/content/docs/logging-in.mdx

```text
---
title: Logging in
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ChangePasswordViaEmailConfirmation from "../include/_ChangePasswordViaEmailConfirmation.mdx";
import DesktopToggleSidebarTip from "../include/_DesktopToggleSidebarTip.mdx";
import MobileSwitchAccount from "../include/_MobileSwitchAccount.mdx";
import SwitchingBetweenOrganizations from "../include/_SwitchingBetweenOrganizations.mdx";

import PlusIcon from "~icons/fa/plus";
import GearIcon from "~icons/zulip-icon/gear";

By default, Zulip allows logging in via email/password as well as
various social authentication providers like Google, GitHub, GitLab,
and Apple.

Organization administrators can
[add other authentication methods](/help/configure-authentication-methods),
including the SAML and LDAP integrations, or disable any of the methods above.

You can log in with any method allowed by your organization, regardless of
how you signed up. For example, if you originally signed up using your Google
account, you can later log in using GitHub, as long as your Google account
and GitHub account use the same email address.

## Find the Zulip log in URL

Here are some ways to find the URL for your Zulip organization.

<Tabs>
  <TabItem label="If you are logged out">
    * If your organization is hosted on [Zulip Cloud](https://zulip.com/zulip-cloud/)
      (usually at `*.zulipchat.com`), go to the [**Find your
      accounts**](https://zulip.com/accounts/find/) page and enter the email address
      that you signed up with. You will receive an email with the sign-in
      information for any Zulip organizations associated with your email address.
    * Search your email account for a registration email from Zulip. The subject
      line will include `Zulip: Your new account details` or `Zulip: Your new
      organization details`. This email provides your organization's log in URL.
    * If you have visited your organization's log in page in the past, try reviewing
      your browser's history. Searching for `zulipchat.com` should find the right
      page if your Zulip organization is hosted on [Zulip
      Cloud](https://zulip.com/zulip-cloud/).
    * You can ask your organization administrators for your Zulip URL.
  </TabItem>

  <TabItem label="If you are logged in">
    * If using Zulip in the browser, your organization's Zulip log in URL is the first part
      of what you see in the URL bar (e.g., `<organization-name>.zulipchat.com` for
      [Zulip Cloud](https://zulip.com/zulip-cloud/) organizations).
    * In the Desktop app, select **Copy Zulip URL** from the **Zulip** menu to
      copy the URL of the currently active organization. You can also access the
      **Copy Zulip URL** option by right-clicking on an organization logo in the
      **organizations sidebar** on the left.
    * In the Mobile app, tap your **profile picture** in the bottom right corner of
      the app, then tap **switch account** to see the URLs for all the organizations
      you are logged in to.
    * On [Zulip Cloud](https://zulip.com/zulip-cloud/) and other Zulip servers updated to
      [Zulip 6.0 or
      higher](https://zulip.readthedocs.io/en/stable/overview/changelog.html#zulip-6-x-series),
      click the **gear** (<GearIcon />) icon in the upper right
      corner of the web or desktop app. Your organization's log in URL is shown in the top
      section of the menu.
  </TabItem>
</Tabs>

## Log in to a new organization

<Tabs>
  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileSwitchAccount />

      1. Tap **Add new account**.
      1. Enter the Zulip URL of the organization, and tap **Continue**.
      1. Follow the on-screen instructions.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Desktop">
    <ZulipNote>
      If you are having trouble connecting, you may need to set your
      [proxy settings](/help/connect-through-a-proxy) or add a
      [custom certificate](/help/custom-certificates).
    </ZulipNote>

    <Steps>
      1. Click the **add organization** (<PlusIcon />) icon in the
         **organizations sidebar** on the left. You can also select **Add Organization**
         from the **Zulip** menu in the top menu bar.
      1. Enter the Zulip URL of the organization, and click **Connect**.
      1. Follow the on-screen instructions.
    </Steps>

    <DesktopToggleSidebarTip />
  </TabItem>

  <TabItem label="Web">
    <Steps>
      1. Go to the Zulip URL of the organization.
      1. Follow the on-screen instructions.
    </Steps>
  </TabItem>
</Tabs>

## Switch between organizations

<SwitchingBetweenOrganizations />

## Set or reset your password

If you signed up using passwordless authentication and want to start logging in
via email/password, you will need to create a password by following the instructions below. You can also reset a
forgotten password.

<ChangePasswordViaEmailConfirmation />

## Related articles

* [Logging out](/help/logging-out)
* [Switching between organizations](/help/switching-between-organizations)
* [Change your email address](/help/change-your-email-address)
* [Change your password](/help/change-your-password)
* [Deactivate your account](/help/deactivate-your-account)
```

--------------------------------------------------------------------------------

---[FILE: logging-out.mdx]---
Location: zulip-main/starlight_help/src/content/docs/logging-out.mdx

```text
---
title: Logging out
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ChangePasswordAndAPIKey from "../include/_ChangePasswordAndAPIKey.mdx";
import MobileSwitchAccount from "../include/_MobileSwitchAccount.mdx";

import GearIcon from "~icons/zulip-icon/gear";
import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";

## Log out of a Zulip account on one device

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click the **gear** (<GearIcon />) icon in the top
         right corner of the app.
      1. Click **Log out**.
    </Steps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileSwitchAccount />

      1. Tap the **ellipsis** (<MoreVerticalIcon />)
         to the right of the Zulip organization you want to log out of.
      1. Tap **Log out**.
      1. Approve by tapping **Log out**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

<ZulipTip>
  Logging out doesn't affect any other organizations you may be logged in
  to. To log out of all your Zulip organizations, repeat the steps above
  for each one.
</ZulipTip>

## Log out of a Zulip account on all devices

Resetting the [API key](/api/api-keys) for a Zulip account will immediately log
you out of that account on all mobile devices. Resetting your password will log
you out of all browsers and desktop apps.

### Change your password and API key

<ChangePasswordAndAPIKey />

## Related articles

* [Logging in](/help/logging-in)
* [Switching between organizations](/help/switching-between-organizations)
* [Change your password](/help/change-your-password)
* [Protect your account](/help/protect-your-account)
* [Deactivate your account](/help/deactivate-your-account)
```

--------------------------------------------------------------------------------

---[FILE: manage-a-bot.mdx]---
Location: zulip-main/starlight_help/src/content/docs/manage-a-bot.mdx

```text
---
title: Manage a bot
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";

import CopyIcon from "~icons/zulip-icon/copy";
import DownloadIcon from "~icons/zulip-icon/download";
import RefreshIcon from "~icons/zulip-icon/refresh-cw";
import UserCogIcon from "~icons/zulip-icon/user-cog";

Zulip lets you manage the properties of any bot for which you are the owner.
Organization [administrators](/help/user-roles) can also manage any
active bot in the organization.

## Manage a bot

<Tabs>
  <TabItem label="Your bots">
    <FlattenedSteps>
      <NavigationSteps target="settings/your-bots" />

      1. In the **Actions** column, click the **manage bot** (<UserCogIcon />)
         icon for the bot you want to manage.
      1. Update bot information as desired, and click **Save changes**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="All bots">
    <AdminOnly />

    <FlattenedSteps>
      <NavigationSteps target="settings/bots" />

      1. In the **Actions** column, click the **manage bot** (<UserCogIcon />)
         icon for the bot you want to manage.
      1. Update bot information as desired, and click **Save changes**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Download `zuliprc` configuration file

### Generic bots

<Tabs>
  <TabItem label="Your bots">
    <FlattenedSteps>
      <NavigationSteps target="settings/your-bots" />

      1. In the **Actions** column, click the **download** (<DownloadIcon />)
         icon for the bot.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="All bots">
    <AdminOnly />

    <FlattenedSteps>
      <NavigationSteps target="settings/bots" />

      1. In the **Actions** column, click the **download** (<DownloadIcon />)
         icon for the bot.
    </FlattenedSteps>
  </TabItem>
</Tabs>

### Outgoing and incoming webhook bots

Only the owner of an outgoing or incoming webhook bot has access to its `zuliprc`
configuration file.

<FlattenedSteps>
  <NavigationSteps target="settings/your-bots" />

  1. In the **Actions** column, click the **manage bot** (<UserCogIcon />) icon,
     and scroll down to **Zuliprc configuration**.
  1. Click the **download** (<DownloadIcon />) icon to download the configuration
     file, or click **copy** <CopyIcon /> icon to copy the file contents to your
     clipboard.
</FlattenedSteps>

<ZulipTip>
  You can also click the **download** (<DownloadIcon />) icon above the **Bots**
  table to download a single configuration file for all of your active **outgoing
  webhook** bots.
</ZulipTip>

## Get a bot's API key

Only a bot's owner has access to its API key.

<FlattenedSteps>
  <NavigationSteps target="settings/your-bots" />

  1. In the **Actions** column, click the **manage bot** (<UserCogIcon />) icon,
     and scroll down to **API key**.
  1. Click the **copy** <CopyIcon /> icon to copy the bot's API key to your clipboard.

  <ZulipTip>
    To generate a new API key, click the **generate new API key** (<RefreshIcon />)
    icon.
  </ZulipTip>
</FlattenedSteps>

## Related articles

* [Bots overview](/help/bots-overview)
* [Integrations overview](/help/integrations-overview)
* [Add a bot or integration](/help/add-a-bot-or-integration)
* [Deactivate or reactivate a bot](/help/deactivate-or-reactivate-a-bot)
* [View all bots in your organization](/help/view-all-bots-in-your-organization)
```

--------------------------------------------------------------------------------

---[FILE: manage-a-user.mdx]---
Location: zulip-main/starlight_help/src/content/docs/manage-a-user.mdx

```text
---
title: Manage a user
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import ManageThisUser from "../include/_ManageThisUser.mdx";
import ManageUserTabTip from "../include/_ManageUserTabTip.mdx";

import UserCogIcon from "~icons/zulip-icon/user-cog";

<AdminOnly />

<Tabs>
  <TabItem label="Via user profile">
    <FlattenedSteps>
      <ManageThisUser />
    </FlattenedSteps>

    <ManageUserTabTip />
  </TabItem>

  <TabItem label="Via organization settings">
    <FlattenedSteps>
      <NavigationSteps target="settings/users" />

      1. Find the user you would like to manage. Click the **manage user**
         (<UserCogIcon />) icon to the right
         of their name.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Deactivate or reactivate a user](/help/deactivate-or-reactivate-a-user)
* [Change a user's role](/help/user-roles#change-a-users-role)
* [Change a user's name](/help/change-a-users-name)
```

--------------------------------------------------------------------------------

---[FILE: manage-channel-folders.mdx]---
Location: zulip-main/starlight_help/src/content/docs/manage-channel-folders.mdx

```text
---
title: Manage channel folders
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import ChannelFoldersIntro from "../include/_ChannelFoldersIntro.mdx";
import MoveChannelToFolder from "../include/_MoveChannelToFolder.mdx";
import SelectChannelViewGeneral from "../include/_SelectChannelViewGeneral.mdx";

import FolderCogIcon from "~icons/zulip-icon/folder-cog";
import TrashIcon from "~icons/zulip-icon/trash";

<ChannelFoldersIntro />

## Move a channel to a folder

<MoveChannelToFolder />

## Create a new channel folder

<AdminOnly />

<Tabs>
  <TabItem label="Via organization settings">
    <FlattenedSteps>
      <NavigationSteps target="settings/channel-folder-settings" />

      1. Click **Add a new channel folder**.
      1. Fill out channel folder information as desired, and click **Create**.
      1. In the **Name** column, click and drag the vertical dots to reorder channel
         folders.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via channel settings">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select any channel.

      <SelectChannelViewGeneral />

      1. Under **Settings**, click the **Create new folder** button to the right
         of the folder selection dropdown.
      1. Fill out the requested information, and click **Create**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Manage a channel folder

<AdminOnly />

<Tabs>
  <TabItem label="Via organization settings">
    <FlattenedSteps>
      <NavigationSteps target="settings/channel-folder-settings" />

      1. In the **Actions** column, click the **manage folder** (<FolderCogIcon />)
         icon for the channel folder you want to manage.
      1. Edit channel folder information as desired, and click **Save changes**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via channel settings">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select any channel.

      <SelectChannelViewGeneral />

      1. Under **Settings**, click the **manage folder** (<FolderCogIcon />) icon
         for the channel folder you want to edit in the **Channel folder** dropdown.
      1. Edit channel folder information as desired, and click **Save changes**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Delete a channel folder

<AdminOnly />

<Tabs>
  <TabItem label="Via organization settings">
    <FlattenedSteps>
      <NavigationSteps target="settings/channel-folder-settings" />

      1. In the **Actions** column, click the **delete** (<TrashIcon />) icon
         for the channel folder you want to delete.
      1. Approve by clicking **Confirm**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via channel settings">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select any channel.

      <SelectChannelViewGeneral />

      1. Under **Settings**, click the **delete** (<TrashIcon />) icon for the
         channel folder you want to delete in the **Channel folder** dropdown.
      1. Approve by clicking **Confirm**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Reorder channel folders

<AdminOnly />

Users will see channel folders in the specified order.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/channel-folder-settings" />

      1. In the **Name** column, click and drag the vertical dots to reorder channel
         folders.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Channel folders](/help/channel-folders)
* [Introduction to channels](/help/introduction-to-channels)
* [Pin a channel](/help/pin-a-channel)
* [Mute or unmute a channel](/help/mute-a-channel)
* [Hide or reveal inactive channels](/help/manage-inactive-channels)
* [Manage user groups](/help/manage-user-groups)
```

--------------------------------------------------------------------------------

---[FILE: manage-inactive-channels.mdx]---
Location: zulip-main/starlight_help/src/content/docs/manage-inactive-channels.mdx

```text
---
title: Hide or reveal inactive channels
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import FilterChannels from "../include/_FilterChannels.mdx";

To avoid clutter in the [left sidebar](/help/left-sidebar), Zulip automatically
hides channels with no recent messages if you're subscribed to 20+ channels. You
can [configure](#configure-hiding-inactive-channels) Zulip to show or hide
inactive channels regardless of how many you're subscribed to.

It's easy to [reveal](#reveal-or-hide-inactive-channels) or
[find](#find-inactive-channels) hidden inactive channels if you need to access
them.

## Reveal or hide inactive channels

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. In the left sidebar, scroll to the bottom of the list of channels in the
         [folder](/help/channel-folders) you're viewing.
      1. Click **inactive or muted** or **inactive** to toggle whether inactive
         channels are hidden. If you don't see this button, there are no
         inactive channels, or inactive channels are
         [configured](#configure-hiding-inactive-channels) to always be shown.
    </Steps>
  </TabItem>
</Tabs>

## Find inactive channels

<FilterChannels />

## Configure hiding inactive channels

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/preferences" />

      1. Under **Left sidebar**, configure **Hide inactive channels**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Introduction to channels](/help/introduction-to-channels)
* [Pin a channel](/help/pin-a-channel)
* [Mute or unmute a channel](/help/mute-a-channel)
* [Channel folders](/help/channel-folders)
```

--------------------------------------------------------------------------------

````
