---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 469
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 469 of 1290)

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

---[FILE: moving-from-teams.mdx]---
Location: zulip-main/starlight_help/src/content/docs/moving-from-teams.mdx

```text
---
title: Moving from Microsoft Teams
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedList from "../../components/FlattenedList.astro";
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import CommunicationPoliciesIntro from "../include/_CommunicationPoliciesIntro.mdx";
import CommunicationPoliciesList from "../include/_CommunicationPoliciesList.mdx";
import ConfigureYourOrganization from "../include/_ConfigureYourOrganization.mdx";
import CreateOrgNoImport from "../include/_CreateOrgNoImport.mdx";
import HowToInviteUsersToJoinNoImport from "../include/_HowToInviteUsersToJoinNoImport.mdx";
import MovingToZulipIntro from "../include/_MovingToZulipIntro.mdx";
import PrepareForTransition1 from "../include/_PrepareForTransition1.mdx"
import PrepareForTransition2 from "../include/_PrepareForTransition2.mdx"
import SignUpForAPlan from "../include/_SignUpForAPlan.mdx";
import TopicsIntro from "../include/_TopicsIntro.mdx";

<MovingToZulipIntro />

If you're moving from other communication tools, check out the [general
guide on moving to Zulip](/help/moving-to-zulip).

The following steps are described in more detail below:

<Steps>
  1. [Import or create your organization](#import-or-create-your-organization).
  1. [Sign up for a plan](#sign-up-for-a-plan).
  1. [Configure your organization](#configure-your-organization).
  1. [Review and update communication
     policies](#review-and-update-communication-policies).
  1. [Prepare users for the transition](#prepare-users-for-the-transition).
  1. [Invite users to join](#invite-users-to-join).
</Steps>

Each organization is unique, but we hope these common practices will help you
think through the transition process in your own context.

## Import or create your organization

<CreateOrgNoImport />

## Sign up for a plan

<SignUpForAPlan />

## Configure your organization

<FlattenedSteps>
  <ConfigureYourOrganization />

  1. [Create channels](/help/create-channels). Zulip's
     [topics](/help/introduction-to-topics) give each conversation its own
     space, so one channel per team should be enough to get you started.
  1. Take advantage of Zulip's [native integrations ecosystem](/integrations) by
     connecting Zulip with the tools you use.
</FlattenedSteps>

## Review and update communication policies

<CommunicationPoliciesIntro />

<FlattenedList>
  <CommunicationPoliciesList />

  * In Zulip, it's easy to have many conversations in parallel without losing
    track of anything. Consider adjusting your communication guidelines to
    recommend having substantive discussions in channels, with less reliance on
    DMs.
  * Zulip allows users to fine-tune their notification settings. Make sure you're
    happy with the [defaults](/help/configure-default-new-user-settings) for your
    organization, and encourage users to adjust from there.
  * Zulip makes it easy to find conversations and follow up. To avoid disrupting
    focus work, @-mentions in Zulip should generally be reserved for
    time-sensitive messages. [Silent
    mentions](/help/mention-a-user-or-group#silently-mention-a-user) make it easy
    to refer to someone without calling for their attention.
</FlattenedList>

## Prepare users for the transition

Prepare an introduction to Zulip for your organization. It often works well to
combine a written announcement with a live presentation. Recommended topics to
cover include:

<FlattenedSteps>
  <PrepareForTransition1 />

  1. Pointers to additional resources, such as Zulip's [getting started
     guide](/help/getting-started-with-zulip).

  <PrepareForTransition2 />
</FlattenedSteps>

## Invite users to join

<Tabs>
  <HowToInviteUsersToJoinNoImport />
</Tabs>

<ZulipTip>
  Remember to update links and login instructions to point to Zulip.
</ZulipTip>

Congratulations on making the move! If you have any questions or feedback
throughout this process, please [reach out](/help/contact-support) to the Zulip
team.

## Related articles

* [Import from Slack](/help/import-from-slack)
* [Slack-compatible incoming webhook](/integrations/doc/slack_incoming)
* [Trying out Zulip](/help/trying-out-zulip)
* [Zulip Cloud or self-hosting?](/help/zulip-cloud-or-self-hosting)
* [Moving to Zulip](/help/moving-to-zulip)
* [Migrating from other chat tools](/help/migrating-from-other-chat-tools)
* [Getting started with Zulip](/help/getting-started-with-zulip)
```

--------------------------------------------------------------------------------

---[FILE: moving-to-zulip.mdx]---
Location: zulip-main/starlight_help/src/content/docs/moving-to-zulip.mdx

```text
---
title: Moving to Zulip
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import CommunicationPoliciesIntro from "../include/_CommunicationPoliciesIntro.mdx";
import CommunicationPoliciesList from "../include/_CommunicationPoliciesList.mdx";
import ConfigureYourOrganization from "../include/_ConfigureYourOrganization.mdx";
import HowToInviteUsersToJoinImport from "../include/_HowToInviteUsersToJoinImport.mdx";
import HowToInviteUsersToJoinNoImport from "../include/_HowToInviteUsersToJoinNoImport.mdx";
import MovingToZulipIntro from "../include/_MovingToZulipIntro.mdx";
import PrepareForTransition1 from "../include/_PrepareForTransition1.mdx"
import PrepareForTransition2 from "../include/_PrepareForTransition2.mdx"
import SignUpForAPlan from "../include/_SignUpForAPlan.mdx";

<ZulipNote>
  Check out the dedicated guides for moving to Zulip from
  [Slack](/help/moving-from-slack), [Microsoft Teams](/help/moving-from-teams),
  [Discord](/help/moving-from-discord), and
  [more](/help/migrating-from-other-chat-tools).
</ZulipNote>

<MovingToZulipIntro />

The following steps are described in more detail below:

<Steps>
  1. [Create your organization](#create-your-organization).
  1. [Sign up for a plan](#sign-up-for-a-plan).
  1. [Configure your organization](#configure-your-organization).
  1. [Review and update communication policies](#review-and-update-communication-policies).
  1. [Prepare users for the transition](#prepare-users-for-the-transition).
  1. [Invite users to join](#invite-users-to-join).
</Steps>

Each organization is unique, but we hope these common practices will help you
think through the transition process in your own context.

## Create your organization

You can create a new Zulip Cloud organization in less than two minutes. Setting
up a self-hosted server will take a bit longer, but is easy to do with Zulip's
[robust
installer](https://zulip.readthedocs.io/en/stable/production/install.html).

Zulip has import tools for [Slack](/help/import-from-slack),
[Mattermost](/help/import-from-mattermost) and
[Rocket.Chat](/help/import-from-rocketchat). You can import your organization's
chat data, including message history, users, channels, and custom emoji. To
inquire about importing data from another product, [contact Zulip
support](/help/contact-support).

Data is imported into Zulip as a new organization, so the best time to import is
when your team is about to start using Zulip for day-to-day work. This may be
part of your evaluation process, or after you've made the decision to move to
Zulip.

<Tabs>
  <TabItem label="New organizations">
    <Steps>
      1. If you plan to self-host, [set up your Zulip
         server](https://zulip.readthedocs.io/en/stable/production/install.html). You
         can self-host Zulip directly on Ubuntu or Debian Linux, in
         [Docker](https://github.com/zulip/docker-zulip), or with prebuilt images for
         [Digital Ocean](https://marketplace.digitalocean.com/apps/zulip) and
         [Render](https://render.com/docs/deploy-zulip).
      1. Create a Zulip organization [on Zulip Cloud](https://zulip.com/new/) or [on
         your self-hosted
         server](https://zulip.readthedocs.io/en/stable/production/install.html#step-3-create-a-zulip-organization-and-log-in).
    </Steps>
  </TabItem>

  <TabItem label="Imported organizations">
    <Steps>
      1. If you plan to self-host, [set up your Zulip
         server](https://zulip.readthedocs.io/en/stable/production/install.html). You
         can self-host Zulip directly on Ubuntu or Debian Linux, in
         [Docker](https://github.com/zulip/docker-zulip), or with prebuilt images for
         [Digital Ocean](https://marketplace.digitalocean.com/apps/zulip) and
         [Render](https://render.com/docs/deploy-zulip).
      1. To import data, follow the steps in the detailed import guides:
         * [Import from Slack](/help/import-from-slack)
         * [Import from Mattermost](/help/import-from-mattermost)
         * [Import from Rocket.Chat](/help/import-from-rocketchat)
    </Steps>
  </TabItem>
</Tabs>

## Sign up for a plan

<SignUpForAPlan />

## Configure your organization

<FlattenedSteps>
  <ConfigureYourOrganization />

  1. [Create channels](/help/create-channels), unless you've imported
     channels from another app. Zulip's [topics](/help/introduction-to-topics)
     give each conversation its own space, so one channel per team should be
     enough to get you started.
  1. Set up [integrations](/help/integrations-overview) so that your
     team can experience all their regular workflows inside the Zulip app.
</FlattenedSteps>

## Review and update communication policies

<CommunicationPoliciesIntro />

<CommunicationPoliciesList />

## Prepare users for the transition

Prepare an introduction to Zulip for your organization. It's often effective to
combine a written announcement with a live presentation. Recommended topics to
cover include:

<FlattenedSteps>
  <PrepareForTransition1 />

  1. Pointers to additional resources, such as Zulip's [getting started
     guide](/help/getting-started-with-zulip).

  <PrepareForTransition2 />
</FlattenedSteps>

## Invite users to join

<Tabs>
  <HowToInviteUsersToJoinNoImport />

  <HowToInviteUsersToJoinImport />
</Tabs>

<ZulipTip>
  Remember to update links and login instructions to point to Zulip.
</ZulipTip>

Congratulations on making the move! If you have any questions or feedback
throughout this process, please [reach out](/help/contact-support) to the Zulip
team.

## Related articles

* [Trying out Zulip](/help/trying-out-zulip)
* [Zulip Cloud or self-hosting?](/help/zulip-cloud-or-self-hosting)
* [Migrating from other chat tools](/help/migrating-from-other-chat-tools)
* [Moving from Slack](/help/moving-from-slack)
* [Getting started with Zulip](/help/getting-started-with-zulip)
```

--------------------------------------------------------------------------------

---[FILE: mute-a-channel.mdx]---
Location: zulip-main/starlight_help/src/content/docs/mute-a-channel.mdx

```text
---
title: Mute or unmute a channel
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ChannelActions from "../include/_ChannelActions.mdx";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import MuteUnmuteIntro from "../include/_MuteUnmuteIntro.mdx";
import SelectChannelViewPersonal from "../include/_SelectChannelViewPersonal.mdx";

<MuteUnmuteIntro />

## Mute a channel

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <ChannelActions />

      1. Click **Mute channel**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    Access this feature by following the web app instructions in your
    mobile device browser.

    Implementation of this feature in the mobile app is tracked [on
    GitHub](https://github.com/zulip/zulip-flutter/issues/347). If
    you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>

## Unmute a channel

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <ChannelActions />

      1. Click **Unmute channel**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    Access this feature by following the web app instructions in your
    mobile device browser.

    Implementation of this feature in the mobile app is tracked [on
    GitHub](https://github.com/zulip/zulip-flutter/issues/347). If
    you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>

## Alternate method to mute or unmute a channel

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/gear/channel-settings" />

      1. Select a channel.

      <SelectChannelViewPersonal />

      1. Under **Notification settings**, toggle **Mute channel**.
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>
</Tabs>

## Reveal or hide muted channels

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. In the left sidebar, scroll to the bottom of the list of channels in the
         [folder](/help/channel-folders) you're viewing.
      1. Click **inactive or muted** or **muted** to toggle whether muted
         channels are hidden. If you don't see this button, there are no muted
         channels.
    </Steps>
  </TabItem>
</Tabs>

## Managing muted channels

Zulip works best when most of the messages you receive are not muted. If you
find yourself muting a lot of channels, consider
[unsubscribing](/help/unsubscribe-from-a-channel) from public channels you've
muted. You can always
[re-subscribe](/help/introduction-to-channels#browse-and-subscribe-to-channels)
if you need to, [view the channel
feed](/help/channel-feed#go-to-channel-feed-for-an-unsubscribed-channel) without
subscribing, or search for messages [in all public
channels](/help/search-for-messages#search-by-location).

## Related articles

* [Mute or unmute a topic](/help/mute-a-topic)
* [Mute a user](/help/mute-a-user)
```

--------------------------------------------------------------------------------

---[FILE: mute-a-topic.mdx]---
Location: zulip-main/starlight_help/src/content/docs/mute-a-topic.mdx

```text
---
title: Mute or unmute a topic
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AutomaticallyUnmuteTopicsInMutedChannels from "../include/_AutomaticallyUnmuteTopicsInMutedChannels.mdx";
import ConfigureTopicNotificationsDesktopWeb from "../include/_ConfigureTopicNotificationsDesktopWeb.mdx";
import ManageConfiguredTopicsDesktopWeb from "../include/_ManageConfiguredTopicsDesktopWeb.mdx";
import ManageConfiguredTopicsMobile from "../include/_ManageConfiguredTopicsMobile.mdx";
import MuteUnmuteIntro from "../include/_MuteUnmuteIntro.mdx";
import TopicLongPressMenu from "../include/_TopicLongPressMenu.mdx";
import TopicLongPressMenuTip from "../include/_TopicLongPressMenuTip.mdx";

<MuteUnmuteIntro />

## Mute or unmute a topic

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <ConfigureTopicNotificationsDesktopWeb />
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <TopicLongPressMenu />

      1. Tap **Mute topic** or **Unmute topic**.
    </FlattenedSteps>

    <TopicLongPressMenuTip />
  </TabItem>
</Tabs>

<KeyboardTip>
  You can also use the <kbd>Shift</kbd> + <kbd>M</kbd> [keyboard
  shortcut](/help/keyboard-shortcuts) to mute or unmute a topic.
</KeyboardTip>

## Automatically unmute topics in muted channels

<AutomaticallyUnmuteTopicsInMutedChannels />

## Manage configured topics

<Tabs>
  <TabItem label="Desktop/Web">
    <ManageConfiguredTopicsDesktopWeb />
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <ManageConfiguredTopicsMobile />
    </FlattenedSteps>

    <ZulipTip>
      Muted topics are grayed out in the topics list.
    </ZulipTip>
  </TabItem>
</Tabs>

## Related articles

* [Mute or unmute a channel](/help/mute-a-channel)
* [Follow a topic](/help/follow-a-topic)
* [Topic notifications](/help/topic-notifications)
* [Mute a user](/help/mute-a-user)
```

--------------------------------------------------------------------------------

---[FILE: mute-a-user.mdx]---
Location: zulip-main/starlight_help/src/content/docs/mute-a-user.mdx

```text
---
title: Mute a user
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import MessageActionsMenu from "../include/_MessageActionsMenu.mdx";
import UserCardThreeDotMenu from "../include/_UserCardThreeDotMenu.mdx";

<ZulipTip>
  This feature mutes a user from your personal perspective, and does not
  automatically notify anyone. To notify moderators about problematic behavior,
  [report a message](/help/report-a-message).
</ZulipTip>

You can mute any user you do not wish to interact with. Muting someone will
have the following effects:

* Combined feed sent by a muted user will automatically be [marked as
  read](/help/marking-messages-as-read) for you, and will never
  generate any desktop, email, or mobile push notifications.
* Combined feed sent by muted users, including the name, profile
  picture, and message content, are hidden behind a **Click here to
  reveal** banner. A revealed message can later be
  [re-hidden](/help/mute-a-user#re-hide-a-message-that-has-been-revealed).
* Muted users are hidden from [**direct messages**](/help/direct-messages)
  in the left sidebar and the list of users in the right sidebar. Direct
  messages between you and a muted user are excluded from all views,
  including search, unless you
  [explicitly search](/help/search-for-messages) for `dm-with:<that
  user>`.
* Muted users have their name displayed as "Muted user" for [emoji
  reactions][view-emoji-reactions], [polls](/help/create-a-poll), and
  when displaying the recipients of group direct messages.
* Muted users are excluded from the autocomplete for composing a
  direct message or [mentioning a user](/help/mention-a-user-or-group).
* Muted users are excluded from [read receipts](/help/read-receipts)
  for all messages. Zulip never shares whether or not you have read
  a message with a user you've muted.
* **Recent conversations** and other features that display avatars will
  show a generic user symbol in place of a muted user's profile picture.
* To avoid interfering with administration tasks, channel and
  organization settings display muted users' names and other details.

<ZulipTip>
  Muting someone does not affect their Zulip experience in any way.
</ZulipTip>

[view-emoji-reactions]: /help/emoji-reactions#view-who-reacted-to-a-message

## Mute a user

<FlattenedSteps>
  <UserCardThreeDotMenu />

  1. Click **Mute this user**.
  1. On the confirmation popup, click **Confirm**.
</FlattenedSteps>

<ZulipTip>
  You can also click on a user's profile picture or name on a
  message they sent to open their **user card**, and skip to
  step 3.
</ZulipTip>

## Re-hide a message that has been revealed

<FlattenedSteps>
  <MessageActionsMenu />

  1. Click **Hide muted message again**.
</FlattenedSteps>

## See your list of muted users

<FlattenedSteps>
  <NavigationSteps target="settings/muted-users" />
</FlattenedSteps>

From there, you can also search for and **unmute** users.

## Related articles

* [Report a message](/help/report-a-message)
* [Deactivate a user](/help/deactivate-or-reactivate-a-user)
* [Moderating open organizations](/help/moderating-open-organizations)
* [Mute or unmute a channel](/help/mute-a-channel)
* [Mute or unmute a topic](/help/mute-a-topic)
```

--------------------------------------------------------------------------------

---[FILE: numbered-lists.mdx]---
Location: zulip-main/starlight_help/src/content/docs/numbered-lists.mdx

```text
---
title: Numbered lists
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import NumberedListsExamples from "../include/_NumberedListsExamples.mdx";
import NumberedListsIntro from "../include/_NumberedListsIntro.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import OrderedListIcon from "~icons/zulip-icon/ordered-list";

<NumberedListsIntro />

## Create a numbered list

<Tabs>
  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. *(optional)* Select the text you want to format.
      1. Click the **Numbered list**
         (<OrderedListIcon />) icon at the
         bottom of the compose box to insert list formatting.
      1. Press <kbd>Enter</kbd> to automatically add a new number to the list.
      1. When your list is done, press <kbd>Enter</kbd> a second time to remove the
         number.
    </FlattenedSteps>

    <ZulipTip>
      You can also use the **Numbered list**
      (<OrderedListIcon />) icon
      to remove existing list formatting from the current line or selected text.
    </ZulipTip>
  </TabItem>

  <TabItem label="Via Markdown">
    <FlattenedSteps>
      <StartComposing />

      1. Type a number followed by a `.` and some text to start a numbered list.
      1. Press <kbd>Enter</kbd> to automatically add a new number to the list.
      1. When your list is done, press <kbd>Enter</kbd> a second time to remove the
         number.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Examples

<NumberedListsExamples />

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Resize the compose box](/help/resize-the-compose-box)
* [Bulleted lists](/help/bulleted-lists)
```

--------------------------------------------------------------------------------

---[FILE: open-the-compose-box.mdx]---
Location: zulip-main/starlight_help/src/content/docs/open-the-compose-box.mdx

```text
---
title: Open the compose box
---

import ZulipTip from "../../components/ZulipTip.astro";

The Zulip compose box starts off closed by default, leaving more vertical
space for the message feed. There are a number of ways to open the compose box.

## Using the mouse

* Click on any message.
* Click on **Start new conversation**, or **New direct message** at the
  bottom of the app.

## Using the keyboard

All replies are to the message in the **blue box**.

* **Reply**: <kbd>R</kbd> or <kbd>Enter</kbd>
* **New topic**: <kbd>C</kbd>
* **New direct message**: <kbd>X</kbd>

You can move the blue box around using the **arrow keys**, <kbd>J</kbd>, or
<kbd>K</kbd>. You can close the compose box using <kbd>Esc</kbd>, or up/down
arrow if the box is empty.

<ZulipTip>
  Zulip offers handy one-character
  [keyboard shortcuts](/help/keyboard-shortcuts) for
  [reading messages](/help/reading-strategies). With the compose
  box closed, there is no need to use the <kbd>Ctrl</kbd> key all the time.
</ZulipTip>

## Related articles

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Introduction to topics](/help/introduction-to-topics)
* [Starting a new direct message](/help/starting-a-new-direct-message)
* [Replying to messages](/help/replying-to-messages)
* [Messaging tips & tricks](/help/messaging-tips)
* [Keyboard shortcuts](/help/keyboard-shortcuts)
* [Resize the compose box](/help/resize-the-compose-box)
```

--------------------------------------------------------------------------------

---[FILE: organization-type.mdx]---
Location: zulip-main/starlight_help/src/content/docs/organization-type.mdx

```text
---
title: Organization type
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

The **organization type** is used to customize the experience for users
in your organization, including initial organization settings and
Welcome Bot messages received by new users.

## Set organization type

<AdminOnly />

<FlattenedSteps>
  <NavigationSteps target="settings/organization-profile" />

  1. Under **Organization type**, select the option that best fits
     your organization.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [Configure default new user settings](/help/configure-default-new-user-settings)
* [Communities directory](/help/communities-directory)
```

--------------------------------------------------------------------------------

---[FILE: paragraph-and-section-formatting.mdx]---
Location: zulip-main/starlight_help/src/content/docs/paragraph-and-section-formatting.mdx

```text
---
title: Paragraph and section formatting
---

import ParagraphsAndSectionsExamples from "../include/_ParagraphsAndSectionsExamples.mdx";
import ParagraphsAndSectionsIntro from "../include/_ParagraphsAndSectionsIntro.mdx";

<ParagraphsAndSectionsIntro />

## Examples

<ParagraphsAndSectionsExamples />

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Resize the compose box](/help/resize-the-compose-box)
```

--------------------------------------------------------------------------------

---[FILE: pin-a-channel.mdx]---
Location: zulip-main/starlight_help/src/content/docs/pin-a-channel.mdx

```text
---
title: Pin a channel
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ChannelActions from "../include/_ChannelActions.mdx";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SelectChannelViewPersonal from "../include/_SelectChannelViewPersonal.mdx";

You can [pin channels](/help/pin-a-channel) that you want to pay close attention
to. Pinned channels appear in a dedicated **pinned channels** section above
[channel folders](/help/channel-folders) in the [left
sidebar](/help/left-sidebar) and the [**Inbox**](/help/inbox) view.

## Pin a channel

<Tabs>
  <TabItem label="Via left sidebar">
    <FlattenedSteps>
      <ChannelActions />

      1. Click **Pin channel to top**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via channel settings">
    <FlattenedSteps>
      <NavigationSteps target="relative/gear/channel-settings" />

      1. Select a channel.

      <SelectChannelViewPersonal />

      1. Under **Personal settings**, toggle **Pin channel to top of left sidebar**.
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>

  <TabItem label="Mobile">
    Access this feature by following the web app instructions in your
    mobile device browser.

    Implementation of this feature in the mobile app is tracked [on
    GitHub](https://github.com/zulip/zulip-flutter/issues/1223). If
    you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>

## Unpin a channel

<Tabs>
  <TabItem label="Via left sidebar">
    <FlattenedSteps>
      <ChannelActions />

      1. Click **Unpin channel from top**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via channel settings">
    <FlattenedSteps>
      <NavigationSteps target="relative/gear/channel-settings" />

      1. Select a channel.

      <SelectChannelViewPersonal />

      1. Under **Personal settings**, toggle **Pin channel to top of left sidebar**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    Access this feature by following the web app instructions in your
    mobile device browser.

    Implementation of this feature in the mobile app is tracked [on
    GitHub](https://github.com/zulip/zulip-flutter/issues/1223). If
    you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>

## Related articles

* [Introduction to channels](/help/introduction-to-channels)
* [Mute or unmute a channel](/help/mute-a-channel)
* [Channel folders](/help/channel-folders)
```

--------------------------------------------------------------------------------

---[FILE: pin-information.mdx]---
Location: zulip-main/starlight_help/src/content/docs/pin-information.mdx

```text
---
title: Pin information
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewGeneral from "../include/_SelectChannelViewGeneral.mdx";

import EditIcon from "~icons/zulip-icon/edit";

You can use [channel
descriptions](/help/view-channel-information#view-channel-description) to pin
reference information, such as:

* Related channels
* Important topics or messages
* Documentation and other external references

Channel descriptions appear in the navigation bar at the top of the web and
desktop apps when you view the channel. You can hover over long channel
descriptions with the mouse to view them in full.

You can also pin messages for yourself by [starring](/help/star-a-message) them.

## Pin information in a channel description

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewGeneral />

      1. Click the **edit channel name and description**
         (<EditIcon />) icon to the right of the
         channel name to edit the description.
      1. Add any number of links, which you can separate with `|` or another symbol.
         * Channel links: `#**channel name**`
         * Topic links: `#**channel name>topic name**`
         * Message links: `#**channel name>topic name@message ID**`
         * External references: `[link text](URL)`

      <SaveChanges />
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />

    <ZulipTip>
      If you aren't sure how to format a link, copy it from the compose box.
      [Learn more about linking to content in
      Zulip.](/help/link-to-a-message-or-conversation)
    </ZulipTip>
  </TabItem>
</Tabs>

## Related articles

* [Link to a channel, topic, or message](/help/link-to-a-message-or-conversation)
* [Change a channel's description](/help/change-the-channel-description)
* [Starred messages](/help/star-a-message)
```

--------------------------------------------------------------------------------

---[FILE: preview-your-message-before-sending.mdx]---
Location: zulip-main/starlight_help/src/content/docs/preview-your-message-before-sending.mdx

```text
---
title: Preview your message before sending
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import StartComposing from "../include/_StartComposing.mdx";

import EditIcon from "~icons/zulip-icon/edit";
import PreviewIcon from "~icons/zulip-icon/preview";

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <StartComposing />

      1. Write a message.
      1. Click the **preview mode** (<PreviewIcon />)
         icon at the bottom of the compose box.
      1. *(optional)* Click the **exit preview mode** (<EditIcon />) icon to edit your message.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Alt</kbd> + <kbd>P</kbd> to toggle between previewing
      and editing your message.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Resize the compose box](/help/resize-the-compose-box)
* [Mastering the compose box](/help/mastering-the-compose-box)
```

--------------------------------------------------------------------------------

---[FILE: printing-messages.mdx]---
Location: zulip-main/starlight_help/src/content/docs/printing-messages.mdx

```text
---
title: Printing messages
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import ZulipTip from "../../components/ZulipTip.astro";

Zulip lets you print the messages in any view, including
[conversations](/help/reading-conversations) and
[searches](/help/search-for-messages).

Printouts include just the content you need, without sidebars and buttons.
Messages will be printed with black text on a white background, regardless of
whether you're using [light or dark theme](/help/dark-theme).

<Tabs>
  <TabItem label="Web">
    <Steps>
      1. Navigate to any message view.
      1. Scroll up through message history until you can see the oldest message that
         you wish to print.
      1. Use your browser's print feature (e.g., **File** > **Print**) to preview
         and print your messages.
    </Steps>

    <ZulipTip>
      If the print preview includes more messages than you need, select which
      pages you want from the printing menu.
    </ZulipTip>
  </TabItem>
</Tabs>

## Related articles

* [Reading conversations](/help/reading-conversations)
* [Dark theme](/help/dark-theme)
* [Supported browsers](/help/supported-browsers)
```

--------------------------------------------------------------------------------

---[FILE: protect-your-account.mdx]---
Location: zulip-main/starlight_help/src/content/docs/protect-your-account.mdx

```text
---
title: Protect your account
---

import {Steps} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ChangePasswordAndAPIKey from "../include/_ChangePasswordAndAPIKey.mdx";

Every Zulip user has an API key, which can be used to do essentially everything
that you can do when you're logged in. You should treat your Zulip API key as
carefully as you treat your password. Integrations should use a [bot's API
key](/api/api-keys) rather than your own whenever possible.

Be sure to change both your password and API key immediately in the following
situations:

* Accidentally sharing your password or API key with someone else.
* Losing a device where you're logged in to Zulip (e.g., a cell phone or laptop).
* Losing a device that has a downloaded copy of your [`zuliprc`
  file](/api/configuring-python-bindings#download-a-zuliprc-file), which
  includes your API key.

Changing your API key will immediately log you out of Zulip on all devices.

## Change your password and API key

<ChangePasswordAndAPIKey />

## Related articles

* [Change your password](/help/change-your-password)
* [Logging in](/help/logging-in)
* [Logging out](/help/logging-out)
* [Deactivate your account](/help/deactivate-your-account)
```

--------------------------------------------------------------------------------

````
