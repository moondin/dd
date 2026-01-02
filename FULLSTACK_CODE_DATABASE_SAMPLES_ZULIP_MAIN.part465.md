---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 465
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 465 of 1290)

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

---[FILE: integrations-overview.mdx]---
Location: zulip-main/starlight_help/src/content/docs/integrations-overview.mdx

```text
---
title: Integrations overview
---

import {Steps} from "@astrojs/starlight/components";

import ZulipNote from "../../components/ZulipNote.astro";

Integrations let you connect Zulip with other products. For example, you can get
notification messages in Zulip when an issue in your tracker is updated, or for
alerts from your monitoring tool.

Zulip offers [over 120 native integrations](/integrations/), which take
advantage of Zulip's [topics](/help/introduction-to-topics) to organize
notification messages. Additionally, thousands of integrations are available
through [Zapier](https://zapier.com/apps) and [IFTTT](https://ifttt.com/search).
You can also [connect any webhook designed to work with
Slack](/integrations/slack_incoming) to Zulip.

If you don't find an integration you need, you can:

* [Write your own integration](#write-your-own-integration). You can [submit a
  pull
  request](https://zulip.readthedocs.io/en/latest/contributing/reviewable-prs.html)
  to get your integration merged into the main Zulip repository.
* [File an issue](https://github.com/zulip/zulip/issues/new/choose) to request
  an integration (if it's a nice-to-have).
* [Contact Zulip Sales](mailto:sales@zulip.com) to inquire about a custom
  development contract.

## Set up an integration

### Native integrations

<Steps>
  1. [Search Zulip's integrations](/integrations/) for the product you'd like to
     connect to Zulip.
  1. Click on the card for the product, and follow the instructions on the page.
</Steps>

### Integrate via Zapier or IFTTT

If you don't see a native Zulip integration, you can access thousands of
additional integrations through [Zapier](https://zapier.com/apps) and
[IFTTT](https://ifttt.com/search).

<Steps>
  1. Search [Zapier](https://zapier.com/apps) or [IFTTT](https://ifttt.com/search)
     for the product you'd like to connect to Zulip.
  1. Follow the integration instructions for [Zapier](/integrations/zapier) or
     [IFTTT](/integrations/ifttt).
</Steps>

### Integrate via Slack-compatible webhook API

Zulip can process incoming webhook messages written to work with [Slack's
webhook API](https://api.slack.com/messaging/webhooks). This makes it easy to
quickly move your integrations when [migrating your
organization](/help/import-from-slack) from Slack to Zulip, or integrate any
product that has a Slack webhook integration with Zulip .

<ZulipNote>
  **Note:** In the long term, the recommended approach is to use
  Zulip's native integrations, which take advantage of Zulip's topics.
  There may also be some quirks when Slack's formatting system is
  translated into Zulip's.
</ZulipNote>

<Steps>
  1. [Create a bot](/help/add-a-bot-or-integration) for the Slack-compatible
     webhook. Make sure that you select **Incoming webhook** as the **Bot type**.
  1. Decide where to send Slack-compatible webhook notifications, and [generate
     the integration URL](/help/generate-integration-url).
  1. Use the generated URL anywhere you would use a Slack webhook.
</Steps>

### Integrate via email

If the product you'd like to integrate can send email notifications, you can
[send those emails to a Zulip channel](/help/message-a-channel-by-email). The
email subject will become the Zulip topic, and the email body will become the
Zulip message.

For example, you can configure your personal GitHub notifications to go to a
Zulip channel rather than your email inbox. Notifications for each issue or pull
request will be grouped into a single topic.

## Write your own integration

You can write your own Zulip integrations using the well-documented APIs below.
For example, if your company develops software, you can create a custom
integration to connect your product to Zulip.

If you need help, best-effort community support is available in the [Zulip
development community](https://zulip.com/development-community/). To inquire
about options for custom development, [contact Zulip
Sales](mailto:sales@zulip.com).

### Sending content into Zulip

* If the third-party service supports outgoing webhooks, you likely want to
  build an [incoming webhook integration](/api/incoming-webhooks-overview).
* If it doesn't, you may want to write a
  [script or plugin integration](/api/non-webhook-integrations).
* The [`zulip-send` tool](/api/send-message) makes it easy to send Zulip
  messages from shell scripts.
* Finally, you can
  [send messages using Zulip's API](/api/send-message), with bindings for
  Python, JavaScript and [other languages](/api/client-libraries).

### Sending and receiving content

* To react to activity inside Zulip, look at Zulip's
  [Python framework for interactive bots](/api/running-bots) or
  [Zulip's real-time events API](/api/get-events).
* If what you want isn't covered by the above, check out the full
  [REST API](/api/rest). The web, mobile, desktop, and terminal apps are
  built on top of this API, so it can do anything a human user can do. Most
  but not all of the endpoints are documented on this site; if you need
  something that isn't there check out Zulip's
  [REST endpoints](https://github.com/zulip/zulip/blob/main/zproject/urls.py).

## Related articles

* [Bots overview](/help/bots-overview)
* [Add a bot or integration](/help/add-a-bot-or-integration)
* [Generate integration URL](/help/generate-integration-url)
* [Request an integration](/help/request-an-integration)
```

--------------------------------------------------------------------------------

---[FILE: introduction-to-channels.mdx]---
Location: zulip-main/starlight_help/src/content/docs/introduction-to-channels.mdx

```text
---
title: Introduction to channels
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ChannelsIntro from "../include/_ChannelsIntro.mdx";
import MobileChannels from "../include/_MobileChannels.mdx";

import BarChartIcon from "~icons/fa/bar-chart";
import SortAlphaAscIcon from "~icons/fa/sort-alpha-asc";
import UserOIcon from "~icons/fa/user-o";
import SubscriberPlusIcon from "~icons/zulip-icon/subscriber-plus";

<ChannelsIntro />

## Browse and subscribe to channels

Everyone other than [guests](/help/guest-users) can subscribe to any
[public](/help/channel-permissions#public-channels) or
[web-public](/help/channel-permissions#web-public-channels) channel. Channel
administrators can [configure](/help/configure-who-can-subscribe) who can
subscribe to [private](/help/channel-permissions#private-channels) channels.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/available" />

      1. Scroll through the list of channels. You can use the **search box** near the
         top of the menu to filter the list by channel name or description.
      1. Click the **subscribe to channel**
         (<SubscriberPlusIcon class="zulip-unplugin-icon subscriber-plus-icon" />)
         icon to the left of a channel to subscribe to it.
    </FlattenedSteps>

    <ZulipTip>
      You can click on the icons in the upper right to sort the list of channels
      **by name** (<SortAlphaAscIcon />),
      **by number of subscribers** (<UserOIcon />), or
      **by estimated weekly traffic** (<BarChartIcon />).
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileChannels />

      1. Scroll to the bottom of the list of subscribed channels.
      1. Tap **All Channels**.
      1. Scroll through the list of channels.
      1. Use the toggle to the right of the channel name to subscribe to it.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Introduction to topics](/help/introduction-to-topics)
* [Create channels](/help/create-channels)
* [Channel permissions](/help/channel-permissions)
* [View channel information](/help/view-channel-information)
```

--------------------------------------------------------------------------------

---[FILE: introduction-to-topics.mdx]---
Location: zulip-main/starlight_help/src/content/docs/introduction-to-topics.mdx

```text
---
title: Introduction to topics
---

import HowToReplyIntro from "../include/_HowToReplyIntro.mdx";
import HowToStartANewTopic from "../include/_HowToStartANewTopic.mdx";
import TopicsIntro from "../include/_TopicsIntro.mdx";
import WhenToStartANewTopic from "../include/_WhenToStartANewTopic.mdx";

<TopicsIntro />

## When to start a new topic

<WhenToStartANewTopic />

## How to start a new topic

Zulip lets you start a new conversation in any channel, no matter where you are.

<HowToStartANewTopic />

## What about threads?

Topics in Zulip fill the role of threads in other chat apps. This
section will help you understand how concepts you might be familiar
with from other applications show up in Zulip.

### Where are the threads?

In other team chat applications, you might be used to seeing threads
in a small panel on the side of the app. In busy organizations, that
cramped panel is where you may read most of the substantive
discussions.

In Zulip, you won't see a threads sidebar, because threads appear in the main
message view instead. Threads help keep conversations organized, so Zulip puts
them front and center.

### How do I find threads?

In other apps, threads generally start from a message in the main channel feed.
That message becomes the key to finding a thread (which can often be tricky to
do).

In Zulip, there's nothing special about the first message in a thread. Instead,
each thread is labeled with a topic. This makes threads in Zulip easy to find.
You can:

* See recent threads in each channel you're subscribed to in the [left
  sidebar](/help/left-sidebar).
* See a list of threads where you have unread messages in your
  [inbox](/help/inbox).
* Get an overview of all threads with recent messages in [recent
  conversations](/help/recent-conversations).

### How do I reply?

<HowToReplyIntro />

## Further reading

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Introduction to channels](/help/introduction-to-channels)
* [Finding a conversation to read](/help/finding-a-conversation-to-read)
* [Reading conversations](/help/reading-conversations)
* [Replying to messages](/help/replying-to-messages)
```

--------------------------------------------------------------------------------

---[FILE: introduction-to-users.mdx]---
Location: zulip-main/starlight_help/src/content/docs/introduction-to-users.mdx

```text
---
title: Introduction to users
---

A **user** is an individual's account within a Zulip
[organization](/help/join-a-zulip-organization). Administrators can
[configure](/help/restrict-account-creation) how accounts are created in their
organization, and [how users will log
in](/help/configure-authentication-methods).

Zulip lets users and organization administrators configure the following
details. This information is summarized in a user's [card](/help/user-cards),
and presented in detail in their [profile](/help/view-someones-profile).

* [Profile picture](/help/change-your-profile-picture)
* [Name](/help/change-your-name)
* [Role](/help/user-roles) in the organization
* [Status and availability](/help/status-and-availability), and whether
  the account has been [deactivated](/help/deactivate-or-reactivate-a-user)
* Current [local time](/help/change-your-timezone)
* Email address, with configurable [permissions to view it](/help/configure-email-visibility)
* [Custom profile fields](/help/custom-profile-fields)

Users can also be members of [groups](/help/user-groups), and subscribe to
[channels](/help/introduction-to-channels).

## Related articles

* [User list](/help/user-list)
* [Status and availability](/help/status-and-availability)
* [User cards](/help/user-cards)
* [View someone's profile](/help/view-someones-profile)
* [Manage a user](/help/manage-a-user)
* [Bots overview](/help/bots-overview)
```

--------------------------------------------------------------------------------

---[FILE: invite-new-users.mdx]---
Location: zulip-main/starlight_help/src/content/docs/invite-new-users.mdx

```text
---
title: Invite new users
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import InviteUsers from "../include/_InviteUsers.mdx";

import SendDmIcon from "~icons/zulip-icon/send-dm";
import TrashIcon from "~icons/zulip-icon/trash";

You can invite users to join your organization by sending out email invitations,
or creating reusable invitation links to share.

Prior to inviting users to your organization, it is recommended that administrators:

* Configure [default settings](/help/configure-default-new-user-settings) for
  new users.
* Configure a [custom welcome message](/help/configure-a-custom-welcome-message)
  for new users.
* Configure the [organization language for automated messages and invitation
  emails][org-lang] for your organization.

When you invite users, you can:

* Set the [role](/help/user-roles) that they will have when
  they join.
* Configure which [channels](/help/introduction-to-channels) they will be
  subscribed to. The organization's [default
  channels](/help/set-default-channels-for-new-users) will be preselected.
* Configure which [groups](/help/user-groups) they will be added to.
* [Customize](/help/configure-a-custom-welcome-message#customize-the-welcome-message-when-sending-an-invitation)
  the welcome message.

Organization administrators can
[configure](/help/restrict-account-creation#change-who-can-send-invitations) who
is allowed to invite users to the organization. You will only see an **Invite
users** menu option if you have permission to invite users.

## Send email invitations

<FlattenedSteps>
  <InviteUsers />

  1. Enter a list of email addresses.
  1. Toggle **Send me a direct message when my invitation is accepted**,
     to receive a notification when an invitation is accepted.
  1. Select when the invitations will expire.
  1. Select what [role](/help/user-roles) the users will join as.
  1. Configure which [channels](/help/introduction-to-channels) they will be subscribed
     to.
  1. Configure which [groups](/help/user-groups) they will be added to.
  1. *(optional; administrators only)* Customize the [welcome
     message](/help/configure-a-custom-welcome-message).
  1. Click **Invite**.
</FlattenedSteps>

<ZulipNote>
  **Note**: As an anti-spam measure, the number of email invitations
  you can send in a day is limited on the Zulip Cloud Free plan. If
  you hit the limit and need to invite more users, consider creating an
  [invitation link](#create-a-reusable-invitation-link) and sharing it
  with your users directly, or [contact support](/help/contact-support)
  to ask for a higher limit.
</ZulipNote>

<ZulipNote>
  **Warning**: When an account is created by accepting an email
  invitation, the user is immediately logged in to their new account.
  Any restrictions on [allowed authentication
  methods](/help/configure-authentication-methods) are not applied.
</ZulipNote>

## Example email invitation

![Email invitation](../../images/example-invitation-email.png)

## Create a reusable invitation link

<FlattenedSteps>
  <InviteUsers />

  1. Select **Invitation link**.
  1. Select when the invitation will expire.
  1. Select what [role](/help/user-roles) the users will join as.
  1. Configure which [channels](/help/introduction-to-channels) they will be subscribed
     to.
  1. Configure which [groups](/help/user-groups) they will be added to.
  1. *(optional; administrators only)* Customize the [welcome
     message](/help/configure-a-custom-welcome-message).
  1. Click **Create link**.
  1. Copy the link, and send it to anyone you'd like to invite.
</FlattenedSteps>

## Manage pending invitations

Organization owners can revoke or resend any invitation or reusable
invitation link. Organization administrators can do the same except
for invitations for the organization owners role.

### Revoke an invitation

<FlattenedSteps>
  <NavigationSteps target="settings/invitations" />

  1. Select the **Invitations** tab.
  1. Find the invitation you want to revoke.
  1. Click the **Revoke** (<TrashIcon />) icon next to the invitation.
</FlattenedSteps>

### Resend an invitation

<FlattenedSteps>
  <NavigationSteps target="settings/invitations" />

  1. Select the **Invitations** tab.
  1. Find the invitation you want to resend.
  1. Click the **Resend** (<SendDmIcon />) icon next to the invitation.
</FlattenedSteps>

<ZulipNote>
  **Note:** You can **revoke** both email invitations and invitation links,
  but you can **resend** only email invitations.
</ZulipNote>

## Related articles

* [Restrict account creation](/help/restrict-account-creation)
* [Set default channels for new users](/help/set-default-channels-for-new-users)
* [Configure default new user settings](/help/configure-default-new-user-settings)
* [Configure a custom welcome message](/help/configure-a-custom-welcome-message)
* [Configure organization language for automated messages and invitation emails][org-lang]
* [User roles](/help/user-roles)
* [User groups](/help/user-groups)
* [Joining a Zulip organization](/help/join-a-zulip-organization)

[org-lang]: /help/configure-organization-language
```

--------------------------------------------------------------------------------

---[FILE: invite-users-to-join.mdx]---
Location: zulip-main/starlight_help/src/content/docs/invite-users-to-join.mdx

```text
---
title: Invite users to join
---

import {Tabs} from "@astrojs/starlight/components";

import ZulipTip from "../../components/ZulipTip.astro";
import HowToInviteUsersToJoinImport from "../include/_HowToInviteUsersToJoinImport.mdx";
import HowToInviteUsersToJoinNoImport from "../include/_HowToInviteUsersToJoinNoImport.mdx";

<ZulipTip>
  Before inviting users, you may want to [delete any test messages][delete-message]
  or [topics](/help/delete-a-topic).
</ZulipTip>

[delete-message]: /help/delete-a-message#delete-a-message-completely

## How to invite users to join

<Tabs>
  <HowToInviteUsersToJoinNoImport />

  <HowToInviteUsersToJoinImport />
</Tabs>

To get everyone off to a good start, you may wish to share the guide
to [Getting started with Zulip](/help/getting-started-with-zulip).

<ZulipTip>
  You can link to your Zulip organization with a [nice badge](/help/linking-to-zulip).
</ZulipTip>

## Related articles

* [Moving to Zulip](/help/moving-to-zulip)
* [Invite new users](/help/invite-new-users)
* [Restrict account creation](/help/restrict-account-creation)
* [Set default channels for new users](/help/set-default-channels-for-new-users)
* [Customize settings for new users](/help/customize-settings-for-new-users)
* [Getting started with Zulip](/help/getting-started-with-zulip)
```

--------------------------------------------------------------------------------

---[FILE: join-a-zulip-organization.mdx]---
Location: zulip-main/starlight_help/src/content/docs/join-a-zulip-organization.mdx

```text
---
title: Joining a Zulip organization
---

import {Steps} from "@astrojs/starlight/components";

By default, Zulip organizations require an invitation to join.

Organization owners can also allow anyone to join without an
invitation, and/or restrict user email addresses to a company domain. See
[inviting new users](/help/invite-new-users).

## Check if you need an invitation to join

<Steps>
  1. Go to the Zulip URL of the organization.
  1. Click **Sign up** in the top right corner of the page.
  1. If you see a sign-up form, invitations are not required! Otherwise, the
     page will say that you need an invitation to join.
</Steps>

## Check if you need an email from a specific domain

<Steps>
  1. Go to the Zulip URL of the organization.
  1. Click **Sign up** in the top right corner of the page.
  1. Try to create an account with your desired email address.
  1. If your email address is not from an allowed domain, you will get an
     error message to that effect.
</Steps>

## Accept an invitation

Invitations to Zulip organizations often come by email. Look for an email
from Zulip. It may take a few minutes for the invitation email to reach your
inbox.

Alternatively, an organization administrator may have sent you an invitation
link via another method.

## Tips

* If you are joining multiple Zulip organizations, we recommend
  using the [Zulip Desktop app](/apps/). The desktop app makes it easy to
  [switch between different organizations](/help/switching-between-organizations).
* If your company uses single sign-on (SSO) authentication for Zulip,
  these instructions may not apply. Try going to your company's Zulip URL
  to see if there are instructions there; otherwise contact your manager
  or IT department for company-specific instructions.

## Related articles

* [Invite new users](/help/invite-new-users)
* [Switching between organizations](/help/switching-between-organizations)
* [Import your settings](/help/import-your-settings)
```

--------------------------------------------------------------------------------

---[FILE: keyboard-shortcuts.mdx]---
Location: zulip-main/starlight_help/src/content/docs/keyboard-shortcuts.mdx

```text
---
title: Keyboard shortcuts
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";

Everything in Zulip can be done with the mouse, but mastering a few keyboard
shortcuts will change your experience of the app. Start with the basics below,
and use the convenient [**keyboard shortcuts**](#keyboard-shortcuts-reference)
reference in the Zulip app to add more to your repertoire as needed.

* [The basics](#the-basics)
* [Search](#search)
* [Scrolling](#scrolling)
* [Navigation](#navigation)
* [Composing messages](#composing-messages)
* [Message actions](#message-actions)
* [Drafts](#drafts)
* [Menus](#menus)
* [Channel settings](#channel-settings)

## The basics

* **Reply to message**: <kbd>R</kbd> or <kbd>Enter</kbd> — Reply to the
  selected message (outlined in blue).
* **New channel message**: <kbd>C</kbd> — Start a new topic in the current
  channel.
* **New direct message**: <kbd>X</kbd>
* **Paste formatted text**: <kbd>Ctrl</kbd> + <kbd>V</kbd>
* **Paste as plain text**: <kbd data-mac-following-key="⌥">Ctrl</kbd> +
  <kbd>Shift</kbd> + <kbd>V</kbd>. You can also paste formatted text with
  <kbd>Ctrl</kbd> + <kbd>V</kbd>, and press <kbd>Ctrl</kbd> + <kbd>Z</kbd> to
  remove formatting.
* **Cancel compose and save draft**: <kbd>Esc</kbd> or
  <kbd data-mac-key="Ctrl">Ctrl</kbd> + <kbd>\[</kbd> — Close the compose box
  and save the unsent message as a draft.
* **View drafts**: <kbd>D</kbd> — Use the arrow keys and <kbd>Enter</kbd>
  to restore a draft. Press <kbd>D</kbd> again to close.
* **Next message**: <kbd class="arrow-key">↓</kbd> or <kbd>J</kbd>
* **Last message**: <kbd>End</kbd> or <kbd>Shift</kbd> + <kbd>G</kbd> —
  Also marks all messages in the current view as read.
* **Next unread topic**: <kbd>N</kbd>
* **Next unread followed topic**: <kbd>Shift</kbd> + <kbd>N</kbd>
* **Next unread direct message**: <kbd>P</kbd>
* **Search messages**: <kbd>/</kbd>
* **Toggle keyboard shortcuts view**: <kbd>?</kbd>
* **Go to your home view**: <kbd data-mac-key="Ctrl">Ctrl</kbd> + <kbd>\[</kbd>
  (or <kbd>Esc</kbd>, [if enabled][disable-escape])
  until you are in your [home view](/help/configure-home-view).

[disable-escape]: /help/configure-home-view#configure-whether-esc-navigates-to-the-home-view

## Search

* **Search messages**: <kbd>/</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd>
* **Filter left sidebar**: <kbd>Q</kbd>
* **Filter users**: <kbd>W</kbd>

## Scrolling

* **Last message**: <kbd>End</kbd> or <kbd>Fn</kbd> + <kbd class="arrow-key">→</kbd>
  or <kbd>Shift</kbd> + <kbd>G</kbd> — Also marks all messages in the current view
  as read.
* **First message**: <kbd>Home</kbd> or <kbd>Fn</kbd> + <kbd class="arrow-key">←</kbd>
* **Previous message**: <kbd class="arrow-key">↑</kbd> or <kbd>K</kbd>
* **Next message**: <kbd class="arrow-key">↓</kbd> or <kbd>J</kbd>
* **Scroll up**: <kbd>PgUp</kbd> or <kbd>Fn</kbd> + <kbd class="arrow-key">↑</kbd>
  or <kbd>Shift</kbd> + <kbd>K</kbd>
* **Scroll down**: <kbd>PgDn</kbd> or <kbd>Fn</kbd> + <kbd class="arrow-key">↓</kbd>
  or <kbd>Shift</kbd> + <kbd>J</kbd> or <kbd>Spacebar</kbd>

## Navigation

* **Go back through viewing history**: <kbd data-mac-key="⌘">Alt</kbd> +
  <kbd class="arrow-key">←</kbd>
* **Go forward through viewing history**: <kbd data-mac-key="⌘">Alt</kbd> +
  <kbd class="arrow-key">→</kbd>
* **Go to next unread topic**: <kbd>N</kbd>
* **Go to next unread followed topic**: <kbd>Shift</kbd> + <kbd>N</kbd>
* **Go to next unread direct message**: <kbd>P</kbd>
* **Go to topic or DM conversation**: <kbd>S</kbd>
* **Go to channel feed from topic view**: <kbd>S</kbd>
* **Go to direct message feed**: <kbd>Shift</kbd> + <kbd>P</kbd>
* **Go to list of topics for the current channel**: <kbd>Y</kbd>
* **Zoom to message in conversation context**: <kbd>Z</kbd> — This view does not mark messages as read.
* **Cycle between channel views**: <kbd>Shift</kbd> + <kbd>A</kbd>
  (previous) and <kbd>Shift</kbd> + <kbd>D</kbd> (next)
* **Go to inbox**: <kbd>Shift</kbd> + <kbd>I</kbd> — Shows conversations with unread messages.
* **Go to recent conversations**: <kbd>T</kbd>
* **Go to combined feed**: <kbd>A</kbd> — Shows all unmuted messages.
* **Go to starred messages**: <kbd>\*</kbd>
* **Go to the conversation you are composing to**: <kbd>Ctrl</kbd> + <kbd>.</kbd>

## Composing messages

* **New channel message**: <kbd>C</kbd> — For starting a new topic in a
  channel.
* **New direct message**: <kbd>X</kbd>
* **Reply to message**: <kbd>R</kbd> or <kbd>Enter</kbd> — Reply to the
  selected message (outlined in blue). Same behavior as clicking on the
  message.
* **Quote message**: <kbd>></kbd>
* **Forward message**: <kbd>\<</kbd>
* **Reply directly to sender**: <kbd>Shift</kbd> + <kbd>R</kbd>
* **Reply @-mentioning sender**: <kbd>@</kbd>

[toggle-enter-to-send]: /help/configure-send-message-keys

### In the compose box

* **Send message**: <kbd>Tab</kbd> then <kbd>Enter</kbd>, or either
  <kbd>Enter</kbd> or <kbd>Ctrl</kbd> + <kbd>Enter</kbd> based on
  [your settings][toggle-enter-to-send]

* **Insert new line**: <kbd>Shift</kbd> + <kbd>Enter</kbd>, or either
  <kbd>Enter</kbd> or <kbd>Ctrl</kbd> + <kbd>Enter</kbd> based on
  [your settings][toggle-enter-to-send]

* **Insert italic text**: `*italic*` or <kbd>Ctrl</kbd> + <kbd>I</kbd>

* **Insert bold text**: `**bold**` or <kbd>Ctrl</kbd> + <kbd>B</kbd>

* **Insert link**: `[Zulip website](https://zulip.org)` or <kbd>Ctrl</kbd> +
  <kbd>Shift</kbd> + <kbd>L</kbd>

* **Insert or create a [saved snippet](/help/saved-snippets)**:
  <kbd>Ctrl</kbd> + <kbd>'</kbd>

* **Insert code formatting**: `` `code` `` or ` ```code``` ` or <kbd>Ctrl</kbd> +
  <kbd>Shift</kbd> + <kbd>C</kbd>.
  See [contextually appropriate code formatting](/help/code-blocks#insert-code-formatting).

* **Toggle preview mode**: <kbd>Alt</kbd> + <kbd>P</kbd>

* **Cancel compose and save draft**: <kbd>Esc</kbd> or
  <kbd data-mac-key="Ctrl">Ctrl</kbd> + <kbd>\[</kbd> — Close the compose box
  and save the unsent message as a draft.

## Message actions

* **Edit your last message**: <kbd class="arrow-key">←</kbd> — Scroll to the
  most recent message you are allowed to edit in the current view, and open it
  for editing. If there are no messages you can edit, nothing happens.

### For a selected message (outlined in blue)

* **Toggle message actions menu**: <kbd>I</kbd>
* **Edit message or view original message**: <kbd>E</kbd>
* **Show message sender's user card**: <kbd>U</kbd>
* **View read receipts**: <kbd>Shift</kbd> + <kbd>V</kbd> — Same shortcut
  also closes the read receipts menu (if open).
* **View image**: <kbd>V</kbd>
* **Move message and (optionally) other messages in the same topic**: <kbd>M</kbd>
* **View message edit and move history**: <kbd>Shift</kbd> +
  <kbd>H</kbd>. Viewing message edit history [must be
  allowed](/help/restrict-message-edit-history-access).
* **Star message**: <kbd>Ctrl</kbd> + <kbd>S</kbd>
* **Add emoji reaction**: <kbd>:</kbd>
* **Toggle first emoji reaction**: <kbd>=</kbd>
* **React with 👍**: <kbd>+</kbd>
* **Mark as unread from selected message**: <kbd>Shift</kbd> + <kbd>U</kbd>
* **Collapse/show message**: <kbd>-</kbd>
* **Toggle topic mute**: <kbd>Shift</kbd> + <kbd>M</kbd>. This works in both
  message views and views that list topics (e.g., [inbox](/help/inbox), [recent
  conversations](/help/recent-conversations)). Learn about [muted
  topics](/help/mute-a-topic).
* **Copy link to message**: <kbd>L</kbd>

## Recent conversations

* **View recent conversations**: <kbd>T</kbd>
* **Search recent conversations**: <kbd>T</kbd>
* **Escape from recent conversations search**: <kbd>Esc</kbd> or arrow keys
* **Navigate recent conversations**: Use arrow keys or vim keys
  (<kbd>J</kbd>, <kbd>K</kbd>, <kbd>L</kbd>, <kbd>H</kbd>).

Use <kbd>Enter</kbd> to engage with elements.

## Drafts

* **Toggle drafts view**: <kbd>D</kbd>

### Within the drafts view

* **Edit selected draft**: <kbd>Enter</kbd>
* **Delete selected draft**: <kbd>Backspace</kbd>

Keyboard navigation (e.g., arrow keys) works as expected.

## Menus

* **Toggle shortcuts help**: <kbd>?</kbd>
* **Toggle gear menu**: <kbd>G</kbd>
* **Open personal menu**: <kbd>G</kbd> + <kbd class="arrow-key">→</kbd>
* **Open help menu**: <kbd>G</kbd> + <kbd class="arrow-key">←</kbd>
* **Toggle message actions menu** for a selected message (outlined in blue):
  <kbd>I</kbd>

## Channel settings

* **Scroll through channels**: <kbd class="arrow-key">↑</kbd> and
  <kbd class="arrow-key">↓</kbd>
  <ZulipTip>
    Pressing <kbd class="arrow-key">↑</kbd> from the first channel
    in the list moves you to the **Filter channels** input.
  </ZulipTip>
* **Switch between tabs**: <kbd class="arrow-key">←</kbd> and
  <kbd class="arrow-key">→</kbd> — Switch between the **Subscribed**
  and **All channels** tabs.
* **Create new channel**: <kbd>N</kbd>

### For a selected channel

* **View channel messages**: <kbd>Shift</kbd> + <kbd>V</kbd>
* **Toggle subscription**: <kbd>Shift</kbd> + <kbd>S</kbd>

## Keyboard shortcuts reference

A summary of the keyboard shortcuts above is available in the Zulip app.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/help/keyboard-shortcuts" />
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>?</kbd> to open the keyboard shortcuts reference.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Related articles

* [Reading strategies](/help/reading-strategies)
```

--------------------------------------------------------------------------------

---[FILE: latex.mdx]---
Location: zulip-main/starlight_help/src/content/docs/latex.mdx

```text
---
title: LaTeX
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import LatexExamples from "../include/_LatexExamples.mdx";
import LatexIntro from "../include/_LatexIntro.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import MathIcon from "~icons/zulip-icon/math";

<LatexIntro />

## Insert LaTeX formatting

Zulip's compose box has a smart **Math (LaTeX)** (<MathIcon />) button, which inserts contextually appropriate LaTeX
formatting:

* If no text is selected, the button inserts displayed LaTeX (` ```math `) formatting.
* If selected text is on one line, the button inserts inline LaTeX (`$$`)
  formatting.
* If selected text is on multiple lines, the button inserts displayed LaTeX
  (` ```math `) formatting.

<Tabs>
  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. *(optional)* Select the text you want to format.
      1. Click the **Math (LaTeX)** (<MathIcon />) icon at the
         bottom of the compose box to insert LaTeX formatting.
    </FlattenedSteps>

    <ZulipTip>
      You can also use the **Math (LaTeX)** (<MathIcon />)
      icon to remove existing LaTeX formatting from the selected text.
    </ZulipTip>
  </TabItem>

  <TabItem label="Via Markdown">
    <FlattenedSteps>
      <StartComposing />

      1. To use inline LaTeX, use double dollar signs (`$$`) around the text:

         ```
         $$O(n^2)$$
         ```

         To use displayed LaTeX, use triple backticks and the word math
         (` ```math `) followed by some text and triple backticks at the end:

         ````
         ```math
         \int_a^b f(t)\, dt = F(b) - F(a)
         ```
         ````
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Examples

<LatexExamples />

## Copy and paste formatted LaTeX

### Copy LateX from a message in Zulip

Zulip supports [quoting](/help/quote-or-forward-a-message#quote-a-message),
[forwarding](/help/quote-or-forward-a-message#forward-a-message), or copying
math expressions, and pasting them into the compose box.

<ZulipTip>
  If you select part of a math expression to copy, Zulip will automatically
  expand your selection to copy the full expression.
</ZulipTip>

### Copy LaTeX from an external website

You can copy LaTeX from many third-party sites that use KaTeX, and paste it into
Zulip.

<ZulipTip>
  If copy-pasting math from a website isn't working, consider contacting the
  website's administrators with the information below, as it may be an easy fix.
</ZulipTip>

This feature is powered by KaTeX's MathML annotations, which embed the original
LaTeX source in the HTML for a math expression. For it to work, the website
needs to:

* Generate math expressions using KaTeX in the default `htmlAndMathml` [output
  mode](https://katex.org/docs/options.html).
* Allow MathML annotations to be included in HTML copied by the browser (for
  Zulip, this was [a couple lines of
  CSS](https://github.com/zulip/zulip/commit/353f57e518b88333615911f12a031177c46d7fbe)).

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Resize the compose box](/help/resize-the-compose-box)
```

--------------------------------------------------------------------------------

````
