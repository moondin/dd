---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 475
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 475 of 1290)

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

---[FILE: typing-notifications.mdx]---
Location: zulip-main/starlight_help/src/content/docs/typing-notifications.mdx

```text
---
title: Typing notifications
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

The Zulip web app displays typing notifications in [conversation
views](/help/reading-conversations) and the [direct message
feed](/help/direct-messages#go-to-direct-message-feed). Typing notifications are
not shown in channels with more than 100 subscribers. The mobile app displays
typing notifications in direct message conversations.

Typing notifications are only sent while one is actively editing text in the
compose box or the [message editing](/help/edit-a-message) box. They disappear
if typing is paused for several seconds, if all the content of the message is
erased, or if the message is [saved as a
draft](/help/view-and-edit-your-message-drafts#save-a-draft). Just having the
compose box or message editing box open will not send a typing notification.

## Disable sending typing notifications

If you'd prefer that others not know whether you're typing, you can
configure Zulip to not send typing notifications.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/account-and-privacy" />

      1. Under **Privacy**, toggle **Let recipients see when I'm typing direct
         messages** and **Let recipients see when I'm typing messages in channels**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Disable seeing typing notifications

If you'd prefer not to see notifications when others type, you can disable them.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/preferences" />

      1. Under **Information**, toggle **Show when other users are typing**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Direct messages](/help/direct-messages)
* [Status and availability](/help/status-and-availability)
* [Read receipts](/help/read-receipts)
```

--------------------------------------------------------------------------------

---[FILE: unsubscribe-from-a-channel.mdx]---
Location: zulip-main/starlight_help/src/content/docs/unsubscribe-from-a-channel.mdx

```text
---
title: Unsubscribe from a channel
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ChannelActions from "../include/_ChannelActions.mdx";
import ChannelLongPressMenu from "../include/_ChannelLongPressMenu.mdx";
import MobileChannels from "../include/_MobileChannels.mdx";

import SubscriberCheckIcon from "~icons/zulip-icon/subscriber-check";

You can always unsubscribe from any channel in Zulip.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <ChannelActions />

      1. Click **Unsubscribe**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileChannels />

      <ChannelLongPressMenu />

      1. Tap **Unsubscribe**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Alternate methods to unsubscribe from a channel

### Via subscribed channels

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/gear/channel-settings" />

      1. Click the **unsubscribe from channel**
         (<SubscriberCheckIcon class="zulip-unplugin-icon subscriber-check-icon" />)
         icon to the left of a channel to unsubscribe from it.
    </FlattenedSteps>
  </TabItem>
</Tabs>

### Via channel settings

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <ChannelActions />

      1. Click **Channel settings**.
      1. Click **Unsubscribe** near the top right corner of the channel settings panel.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Shift</kbd> + <kbd>S</kbd> to unsubscribe from the
      selected channel.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Related articles

* [Manage a user's channel subscriptions](/help/manage-user-channel-subscriptions)
```

--------------------------------------------------------------------------------

---[FILE: unsubscribe-users-from-a-channel.mdx]---
Location: zulip-main/starlight_help/src/content/docs/unsubscribe-users-from-a-channel.mdx

```text
---
title: Unsubscribe users from a channel
---

import UnsubscribeUserFromChannel from "../include/_UnsubscribeUserFromChannel.mdx";

Organization [administrators](/help/user-roles) can
unsubscribe users from any channel. Channel administrators can
configure who can
[unsubscribe](/help/configure-who-can-unsubscribe-others) anyone
from a particular channel.

<UnsubscribeUserFromChannel />

## Related articles

* [Introduction to channels](/help/introduction-to-channels)
* [Unsubscribe from a channel](/help/unsubscribe-from-a-channel)
* [Subscribe users to a channel](/help/subscribe-users-to-a-channel)
* [Manage a user's channel subscriptions](/help/manage-user-channel-subscriptions)
* [User roles](/help/user-roles)
* [View channel subscribers](/help/view-channel-subscribers)
```

--------------------------------------------------------------------------------

---[FILE: user-cards.mdx]---
Location: zulip-main/starlight_help/src/content/docs/user-cards.mdx

```text
---
title: User cards
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import RightSidebarUserCard from "../include/_RightSidebarUserCard.mdx";

In the web and desktop apps, user cards contain basic information about a user
or bot. User cards are also a handy starting point for actions such as a [viewing a
user's profile](/help/view-someones-profile) or [viewing the messages they've
sent](/help/view-messages-sent-by-a-user).

## Information in a user's card

<Tabs>
  <TabItem label="User">
    * Their profile picture.
    * Their name.
    * Their [role](/help/user-roles) in the organization.
    * Their [status and availability](/help/status-and-availability), and whether
      the account has been [deactivated](/help/deactivate-or-reactivate-a-user).
    * Their current [local time](/help/change-your-timezone).
    * Their email address, if you [have
      permission](/help/configure-email-visibility) to view it.
    * The custom profile fields
      [selected](/help/custom-profile-fields#display-custom-fields-on-user-card) by
      administrators to be featured on user cards.
  </TabItem>

  <TabItem label="Bot">
    * Its profile picture.
    * Its name.
    * Its owner's name.
    * Its email address, if you [have
      permission](/help/configure-email-visibility) to view it.
    * Whether the bot has been [deactivated](/help/deactivate-or-reactivate-a-bot).
  </TabItem>
</Tabs>

## View someone's user card

<Tabs>
  <TabItem label="User">
    <FlattenedSteps>
      <RightSidebarUserCard />
    </FlattenedSteps>

    <ZulipTip>
      You can also click on a user's profile picture or name on a message they sent.
    </ZulipTip>

    <KeyboardTip>
      Alternatively, open someone's **user card** by selecting a message they sent, and
      using the <kbd>U</kbd> shortcut.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Bot">
    <FlattenedSteps>
      <NavigationSteps target="settings/bots" />

      1. Click on the name of a bot in the **Name** column to open its **user card**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Introduction to users](/help/introduction-to-users)
* [View someone's profile](/help/view-someones-profile)
* [Message actions](/help/message-actions)
```

--------------------------------------------------------------------------------

---[FILE: user-groups.mdx]---
Location: zulip-main/starlight_help/src/content/docs/user-groups.mdx

```text
---
title: User groups
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import CloudPaidPlansOnly from "../include/_CloudPaidPlansOnly.mdx";
import UserGroupsApplications from "../include/_UserGroupsApplications.mdx";
import UserGroupsIntro from "../include/_UserGroupsIntro.mdx";

import SubscriberCheckIcon from "~icons/zulip-icon/subscriber-check";
import SubscriberPlusIcon from "~icons/zulip-icon/subscriber-plus";

<CloudPaidPlansOnly />

<UserGroupsIntro />

<UserGroupsApplications />

You can add a group to another user group, making it easy to express your
organization's structure in Zulip's permissions system.

## Browse and join user groups

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/group/all" />

      1. Scroll through the list of user groups. You can use the **search box** near
         the top of the menu to filter the list by group name or description.
      1. Click the **join group** (<SubscriberPlusIcon class="zulip-unplugin-icon subscriber-plus-icon" />) icon to the left of a user group to
         join the group, if you have
         [permission](/help/manage-user-groups#configure-group-permissions) to do so.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Leave a group

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/gear/group-settings" />

      1. Click the **leave group** (<SubscriberCheckIcon class="zulip-unplugin-icon subscriber-check-icon" />) icon to the left of a user group to leave the
         group, if you have
         [permission](/help/manage-user-groups#configure-group-permissions) to do so.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## View a group's card

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click on a user group mention in a message to open the **group card**.
    </Steps>
  </TabItem>
</Tabs>

## Related articles

* [Mention a user or group](/help/mention-a-user-or-group)
* [View group members](/help/view-group-members)
* [Create user groups](/help/create-user-groups)
* [Manage user groups](/help/manage-user-groups)
* [Moving to Zulip](/help/moving-to-zulip)
* [User roles](/help/user-roles)
```

--------------------------------------------------------------------------------

---[FILE: user-list.mdx]---
Location: zulip-main/starlight_help/src/content/docs/user-list.mdx

```text
---
title: User list
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";
import UserListIcon from "~icons/zulip-icon/user-list";

In the Zulip web and desktop app, the right sidebar shows a list of users in
your organization. The user list has up to three section:

* **This conversation**: Recent participants in the conversation you're viewing.
* **This channel**: Subscribers to the channel you're viewing.
* **Others**: Everyone else.

In organizations with up to 600 users, everyone is shown. In larger
organizations, only users who have been active in the last two weeks are shown,
but everyone is included when you [search](#filter-users).
[Deactivated users](/help/deactivate-or-reactivate-a-user) and
[bots](/help/bots-overview) are not listed.

You can choose to have each user's name appear with their
[avatar](/help/change-your-profile-picture), or select a one of the more compact
user list styles. To avoid distraction, you can
[hide](#show-or-hide-the-user-list) the user list any time.

Here is an overview of all the information and actions you can take in Zulip's
user list.

![User list information and actions](../../images/user-list-actions.png)

## Filter users

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. If the user list is hidden, click the **user list** (<UserListIcon />) icon in the upper right to show it.
      1. Type the name of the user you are looking for in the **Filter users** box at
         the top of the right sidebar.
    </Steps>

    <KeyboardTip>
      You can also use the <kbd>W</kbd> keyboard shortcut to start searching for
      a person.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Configure user list style

<Tabs>
  <TabItem label="Via right sidebar">
    <Steps>
      1. If the user list is hidden, click the **user list** (<UserListIcon />) icon in the upper right to show it.
      1. Click the **ellipsis** (<MoreVerticalIcon />)
         to the right of the **Filter users** box.
      1. Toggle your preferred option for **User list style**.
    </Steps>
  </TabItem>

  <TabItem label="Via personal settings">
    <FlattenedSteps>
      <NavigationSteps target="settings/preferences" />

      1. Under **Information**, toggle your preferred option for **User list style**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Show or hide the user list

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click the **user list** (<UserListIcon />)
         icon in the upper right.
    </Steps>

    <KeyboardTip>
      The <kbd>W</kbd> keyboard shortcut to filter users reveals the user list if
      it is hidden.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Related articles

* [Introduction to users](/help/introduction-to-users)
* [View someone's profile](/help/view-someones-profile)
* [Status and availability](/help/status-and-availability)
* [Searching for messages](/help/search-for-messages)
* [Find administrators](/help/find-administrators)
```

--------------------------------------------------------------------------------

---[FILE: user-roles.mdx]---
Location: zulip-main/starlight_help/src/content/docs/user-roles.mdx

```text
---
title: User roles
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import ManageThisUser from "../include/_ManageThisUser.mdx";
import ManageUserTabTip from "../include/_ManageUserTabTip.mdx";
import UserRolesIntro from "../include/_UserRolesIntro.mdx";
import ViewUsersByRole from "../include/_ViewUsersByRole.mdx";

import UserCogIcon from "~icons/zulip-icon/user-cog";

<UserRolesIntro />

You can also manage permissions with [custom user groups](/help/user-groups).

## Roles

* **Organization owner**: Can manage users, public channels, organization
  settings, and billing. Organization owners can do anything that an
  organization administrator can do.
* **Organization administrator**: Can manage users, public channels, and
  organization settings. Cannot make someone an owner, or change an existing
  owner's role.
* **Moderator**: Can do anything that members can do, plus additional
  permissions [configured](/help/manage-permissions) by
  your organization.
* **Member**: This is the default role for most users. Members have access to
  all public channels. You can [configure different
  permissions](/help/restrict-permissions-of-new-members) for **new members**
  and **full members**, which is especially useful for [moderating open
  organizations](/help/moderating-open-organizations). New members automatically
  become full members after a configurable waiting period.
* **Guest**: Can view and send messages in channels they have been subscribed to.
  Guests cannot see other channels, unless they have been specifically subscribed
  to the channel. See [guest users documentation](/help/guest-users) for additional
  details and configuration options.
* **Billing administrator**: The user who upgrades the organization to
  a paid plan is, in addition to their normal role, a billing
  administrator.  Billing administrators can manage billing for the organization.
  For example, someone from your billing department can be a **billing
  administrator**, but not an **administrator** for the organization.

## View users by role

<ViewUsersByRole />

## Change a user's role

<AdminOnly />

An organization owner can change the role of any user. You can make yourself no
longer an owner only if there is at least one other owner for your organization.
An organization administrator cannot make someone an owner, or change an
existing owner's role.

<Tabs>
  <TabItem label="Via user profile">
    <FlattenedSteps>
      <ManageThisUser />

      1. Under **User role**, select a [role](#roles).
      1. Click **Save changes**. The new permissions will take effect immediately.
    </FlattenedSteps>

    <ManageUserTabTip />
  </TabItem>

  <TabItem label="Via organization settings">
    <FlattenedSteps>
      <NavigationSteps target="settings/users" />

      1. Find the user you would like to manage. Click the **manage bot**
         (<UserCogIcon />) icon to the right
         of their name.
      1. Under **User role**, select a [role](#roles).
      1. Click **Save changes**. The new permissions will take effect immediately.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Change your role

<AdminOnly />

Organization owners and administrators can change their own roles, with the
restriction that administrators cannot make themselves owners.

<FlattenedSteps>
  <NavigationSteps target="settings/account-and-privacy" />

  1. Under **Account**, select a [role](#roles) from the **Roles** dropdown.
</FlattenedSteps>

## Related articles

* [Guest users](/help/guest-users)
* [User groups](/help/user-groups)
* [Manage permissions](/help/manage-permissions)
* [Manage a user](/help/manage-a-user)
* [Deactivate or reactivate a user](/help/deactivate-or-reactivate-a-user)
```

--------------------------------------------------------------------------------

---[FILE: using-zulip-for-a-class.mdx]---
Location: zulip-main/starlight_help/src/content/docs/using-zulip-for-a-class.mdx

```text
---
title: Using Zulip for a class
---

import ZulipTip from "../../components/ZulipTip.astro";

Welcome to Zulip! This pages offers some tips for [using Zulip for a
class](https://zulip.com/for/education/).  If this is your first time using Zulip, we
recommend checking out [Getting started with
Zulip](/help/getting-started-with-zulip) to get oriented.

Zulip works great as the communication hub for your class, providing a
single place for:

* [Posting lecture notes and announcements](#posting-lecture-notes-and-announcements)
* [Answering students’ questions](#answering-students-questions)
* Collecting feedback from students
* [Coordination among teaching staff](#coordination-among-teaching-staff)
* [Virtual office hours](#virtual-office-hours)

## Posting lecture notes and announcements

<ZulipTip>
  [Subscribe to email notifications](/help/channel-notifications) for
  channels such as **#announcements** to make sure you never miss an important message.
</ZulipTip>

Many classes use a dedicated channel to post general announcements, for example:

* **#announcements** > **office hours**: My office hours this week
  will be rescheduled from `Mon, Oct 11 2021, 1:00 PM` to `Thu, Oct 14 2021, 3:30 PM`.

Share lecture notes and reading materials with [drag-and-drop file
uploads](/help/share-and-upload-files), for example:

* **#Unit 3: Sorting algorithms** > **lecture notes**: Here are the notes
  from today’s lecture. [lecture notes 10/2.pdf](/help/using-zulip-for-a-class) You can view a recording of the lecture [here](/help/using-zulip-for-a-class).

### Formatting tips

* You can [post a time](/help/format-your-message-using-markdown#global-times)
  that everyone will see in their own time zone.
* Share URLs as [named links](/help/format-your-message-using-markdown#links).

## Answering students’ questions

In Zulip, channels determine who receives a message. Topics are
light-weight subjects for individual conversations. You can more about
[channels](/help/introduction-to-channels) and [topics](/help/introduction-to-topics).

Zulip works best when each conversation has its own topic. When you
have a question to ask, simply start a new topic! For example, one
might see the following topics in a channel where a lecture and the
corresponding assignment are being discussed:

* problem 2a clarification
* question about slide 7
* code not compiling
* LaTeX diagram help

Zulip will show auto-complete suggestions for existing topics as you
type, which helps surface relevant previous conversations. You can
also use the search bar to check whether a question has already
been addressed.

You can [mention](/help/mention-a-user-or-group) the person who asked
a question to make sure they see timely answers.

### Resolving topics

When a question has been answered, you can [mark a topic as
resolved](/help/resolve-a-topic). This makes it easy for course
staff to see which conversations still require their attention.

## Coordination among teaching staff

Use private channels to coordinate among course staff, for example:

* **#staff** > **homework 2 exercise 3b**: How many points should I
  take off for this? The assignment says clearly to use Python 3 syntax.

  ```
  print result
  ```

## Virtual office hours

Zulip works great for virtual office hours! With a dedicated thread
for each question, it's easy to have several discussions at once.

* Course staff can respond to multiple questions in parallel, making
  efficient use of their time.
* Students can participate in real time, or learn by reading the
  conversations afterwards.

## Related articles

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Moving to Zulip](/help/moving-to-zulip)
* [Message formatting](/help/format-your-message-using-markdown)
```

--------------------------------------------------------------------------------

---[FILE: using-zulip-via-email.mdx]---
Location: zulip-main/starlight_help/src/content/docs/using-zulip-via-email.mdx

```text
---
title: Using Zulip via email
---

import {Steps} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

{/* 
  Any changes to this file should be reflected in 
  templates/zerver/integrations/email.md and vice versa.
  That file used to be a symlink to the current file before we converted
  it to mdx.
  */}

With Zulip, it is possible for some members of your organization to participate
from their email client, without opening the Zulip app after the initial
setup is complete.

## Subscribe a Zulip channel to a mailing list

<Steps>
  1. Create a mailing list to use with Zulip, or use an existing one.
  1. Create a Zulip channel that will receive mailing list traffic, or
     use an existing one.
  1. [Generate an email
     address](/help/message-a-channel-by-email) for
     the channel you created.
  1. Add the email address for the channel to the mailing list.
</Steps>

New emails sent to the email list will now be mirrored to the channel.

## Setup instructions for email users

If you want to interact with Zulip primarily (or entirely) via your email client:

<FlattenedSteps>
  1. [Subscribe](/help/introduction-to-channels#browse-and-subscribe-to-channels) to any channels you are
     interested in.

  <NavigationSteps target="settings/notifications" />

  1. In the **Notification triggers** table, make sure both of the checkboxes
     under **Email** are checked.
  1. Close the Zulip window. Zulip does not send email notifications
     while you are actively engaging with the web application.
</FlattenedSteps>

New Zulip messages will now be delivered to your email account. You
can reply directly to the emails coming from Zulip, and your replies
will be posted in the appropriate topic or direct message
conversation on Zulip.

## Related articles

* [Message a channel by email](/help/message-a-channel-by-email)
```

--------------------------------------------------------------------------------

---[FILE: verify-your-message-was-successfully-sent.mdx]---
Location: zulip-main/starlight_help/src/content/docs/verify-your-message-was-successfully-sent.mdx

```text
---
title: Verify your message was successfully sent
---

import RefreshIcon from "~icons/fa/refresh";
import TimesCircleIcon from "~icons/fa/times-circle";

When you send a message, it first goes to a Zulip server, and then the Zulip
server sends it out to all the recipients.

Sometimes there can be delays if your device is on a poor network
connection. Zulip lets you know when your message successfully reaches the
server.

## Verify that a message reached the Zulip server

Look for a **timestamp** (like `4:53`) on the right side of the message. If
you see a timestamp, the message successfully reached the server.

You can see what a message without a timestamp looks like by disconnecting
your computer from the internet, and sending a message.

## When to resend

By default, Zulip will try to resend the message when it is re-connected to
the internet.

If Zulip gives up (or if the Zulip server returns an error), it will
add two **red icons** (<RefreshIcon /> <TimesCircleIcon />) to the right side of
the message. If you don't see the red icons, there is no need to resend.

If you do see the red icons, you can either

* Click **resend** (<RefreshIcon />)
  to attempt a resend.
* Click **cancel** (<TimesCircleIcon />)
  to delete the message.
* Reload the page to cancel all the messages with red icons.
```

--------------------------------------------------------------------------------

---[FILE: view-a-messages-edit-history.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-a-messages-edit-history.mdx

```text
---
title: View a message's edit history
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import KeyboardTip from "../../components/KeyboardTip.astro";
import MessageEditHistoryIntro from "../include/_MessageEditHistoryIntro.mdx";

<MessageEditHistoryIntro />

## View a message's edit history

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Choose a message in the message feed.
      1. Click on the message's **edited** or **moved** label shown next to the
         sender's name, or to the left of the message, to open the edit history. If
         you don't see such a label, the message has not been edited or moved.
    </Steps>

    <KeyboardTip>
      You can use <kbd>Shift</kbd> + <kbd>H</kbd> to view the edit history of the
      selected message.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Related articles

* [Edit a message](/help/edit-a-message)
* [Delete a message](/help/delete-a-message)
* [Move content to another topic](/help/move-content-to-another-topic)
* [Move content to another channel](/help/move-content-to-another-channel)
* [Restrict message editing and deletion](/help/restrict-message-editing-and-deletion)
* [Restrict message edit history access](/help/restrict-message-edit-history-access)
```

--------------------------------------------------------------------------------

---[FILE: view-all-bots-in-your-organization.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-all-bots-in-your-organization.mdx

```text
---
title: View all bots in your organization
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

You can view a list of all bots in your organization, including deactivated bots.

Organization [administrators](/help/user-roles) can also
[deactivate](/help/deactivate-or-reactivate-a-bot),
[reactivate](/help/deactivate-or-reactivate-a-bot), or
[manage](/help/manage-a-bot) any bot on the list.

<FlattenedSteps>
  <NavigationSteps target="settings/bots" />
</FlattenedSteps>

## Related articles

* [Bots overview](/help/bots-overview)
* [Add a bot or integration](/help/add-a-bot-or-integration)
* [Manage a bot](/help/manage-a-bot)
* [Deactivate or reactivate a bot](/help/deactivate-or-reactivate-a-bot)
* [View your bots](/help/view-your-bots)
```

--------------------------------------------------------------------------------

---[FILE: view-and-edit-your-message-drafts.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-and-edit-your-message-drafts.mdx

```text
---
title: Draft messages
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import GoToDraftMessages from "../include/_GoToDraftMessages.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import CloseIcon from "~icons/zulip-icon/close";
import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";
import SendIcon from "~icons/zulip-icon/send";
import TrashIcon from "~icons/zulip-icon/trash";

Zulip automatically saves the content of your message as a draft when you close
the compose box, ensuring that you never lose your work. When you start
composing, the most recently edited draft for the conversation you are composing
to automatically appears in the compose box.

<ZulipNote>
  **Note**: Drafts are local to your client, and are not synced to
  other devices and browsers.
</ZulipNote>

## Save a draft

### Save a draft and stop composing

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <StartComposing />

      1. Type at least 3 characters of text into the compose box.
      1. Close the compose box. For example, you can click the
         **close** (<CloseIcon />) icon in the top right
         corner of the compose box, or click on an empty area of the app to close the
         compose box and save your message as a draft.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Esc</kbd> to close the compose box and save your
      message as a draft.
    </KeyboardTip>
  </TabItem>
</Tabs>

### Save a draft and start a new message

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <StartComposing />

      1. Click on the **ellipsis** (<MoreVerticalIcon />)
         in the bottom right corner of the compose box, next to the **Send**
         (<SendIcon />) button.
      1. Select **Save draft and start a new message**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Restore a draft

To make it easier to find the draft you are looking for, drafts for the
conversation you are composing to are shown at the top of the drafts list in the
web and desktop apps. If you have saved drafts for the current conversation, the
counter next to the **Drafts** button in the compose box shows how many there are.

<Tabs>
  <TabItem label="Via left sidebar">
    <FlattenedSteps>
      <GoToDraftMessages />

      1. Click on the draft you want to restore.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>D</kbd> to bring up your list of saved drafts, and
      <kbd>Enter</kbd> within the drafts view to restore the selected draft.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. Click the **Drafts** button on the right side of the compose box.
      1. Click on the draft you want to restore.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>D</kbd> to bring up your list of saved drafts, and
      <kbd>Enter</kbd> within the drafts view to restore the selected draft.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Delete drafts

### Delete a draft

<Tabs>
  <TabItem label="Via left sidebar">
    <FlattenedSteps>
      <GoToDraftMessages />

      1. Click the **delete** (<TrashIcon />) icon on the draft you
         want to delete.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>D</kbd> to bring up your list of saved drafts, and
      <kbd>Backspace</kbd> within the drafts view to delete the selected draft.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. Click the **Drafts** button on the right side of the compose box.
      1. Click the **delete** (<TrashIcon />) icon on the draft you
         want to delete.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>D</kbd> to bring up your list of saved drafts, and
      <kbd>Backspace</kbd> within the drafts view to delete the selected draft.
    </KeyboardTip>
  </TabItem>
</Tabs>

### Delete multiple drafts

<Tabs>
  <TabItem label="Via left sidebar">
    <FlattenedSteps>
      <GoToDraftMessages />

      1. Click **Select all drafts** in the upper right corner of
         the drafts view, or select the drafts you want to delete
         by toggling the checkboxes on the right.
      1. Click the **delete** (<TrashIcon />) icon in the
         upper right corner of the drafts view to delete all selected drafts.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>D</kbd> to bring up your list of saved drafts.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. Click the **Drafts** button on the right side of the compose box.
      1. Click **Select all drafts** in the upper right corner of
         the drafts view, or select the drafts you want to delete
         by toggling the checkboxes on the right.
      1. Click the **delete** (<TrashIcon />) icon in the
         upper right corner of the drafts view to delete all selected drafts.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>D</kbd> to bring up your list of saved drafts.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Related articles

* [Schedule a message](/help/schedule-a-message)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Verify a message was sent](/help/verify-your-message-was-successfully-sent)
* [Edit a message](/help/edit-a-message)
* [Delete a message](/help/delete-a-message)
```

--------------------------------------------------------------------------------

---[FILE: view-channel-information.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-channel-information.mdx

```text
---
title: View channel information
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import GoToChannel from "../include/_GoToChannel.mdx";

When viewing a [topic](/help/introduction-to-topics) or a [channel
feed](/help/channel-feed), you can find the name, description and subscriber
count for the current channel directly in your message view.

## View channel name

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToChannel />

      1. The channel's name appears in the navigation bar at the top of the app.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## View channel description

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToChannel />

      1. The channel's description appears in the navigation bar at the top of the app.
         If the description doesn't fit in the navigation bar, hover over it with the
         mouse to view it in full.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## View channel subscriber count

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToChannel />

      1. Hover over the channel's name in the navigation bar at the top of the app
         with the mouse to see the subscriber count.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Introduction to channels](/help/introduction-to-channels)
* [View channel subscribers](/help/view-channel-subscribers)
* [Pin information](/help/pin-information)
* [Rename a channel](/help/rename-a-channel)
* [Change a channel's description](/help/change-the-channel-description)
```

--------------------------------------------------------------------------------

---[FILE: view-channel-subscribers.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-channel-subscribers.mdx

```text
---
title: View channel subscribers
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SelectChannelViewSubscribers from "../include/_SelectChannelViewSubscribers.mdx";

Who is subscribed to a channel determines who receives the messages sent there.
All non-[guest](/help/guest-users) users can view public channels and subscribe
themselves. Organization administrators can
[configure](/help/configure-who-can-invite-to-channels) who can subscribe and
unsubscribe other users to channels.

## View channel subscribers

<Tabs>
  <TabItem label="Via channel settings">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewSubscribers />
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>

  <TabItem label="Via left sidebar">
    <Steps>
      1. Click on a channel in the left sidebar.
      1. View subscribers in the **In this channel** section in the right sidebar. If
         the section is collapsed, click **In this channel** to reveal it.
    </Steps>

    <ZulipTip>
      To see the full list of subscribers for a channel that has more than 600
      people subscribed, scroll to the bottom of the **In this channel** section,
      and click **View all subscribers**.
    </ZulipTip>
  </TabItem>
</Tabs>

## Related articles

* [Introduction to channels](/help/introduction-to-channels)
* [View channel information](/help/view-channel-information)
* [Unsubscribe from a channel](/help/unsubscribe-from-a-channel)
* [Manage a user's channel subscriptions](/help/manage-user-channel-subscriptions)
* [Subscribe users to a channel](/help/subscribe-users-to-a-channel)
* [Unsubscribe users from a channel](/help/unsubscribe-users-from-a-channel)
* [Set default channels for new users](/help/set-default-channels-for-new-users)
```

--------------------------------------------------------------------------------

---[FILE: view-group-members.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-group-members.mdx

```text
---
title: View group members
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

User groups can have other [groups](/help/user-groups),
[roles](/help/user-roles), and individual [users](/help/introduction-to-users)
as members.

<Tabs>
  <TabItem label="Via group card">
    <Steps>
      1. Click on a user group mention in a message to open the **group card**. The
         group's members will be listed on the card.
      1. If the group has a large number of members, click the **view all** link to
         see the rest of the list.
    </Steps>
  </TabItem>

  <TabItem label="Via group settings">
    <FlattenedSteps>
      <NavigationSteps target="relative/group/all" />

      1. Select a user group.
      1. Select the **Members** tab on the right.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [User groups](/help/user-groups)
* [Manage user groups](/help/manage-user-groups)
* [User roles](/help/user-roles)
```

--------------------------------------------------------------------------------

````
