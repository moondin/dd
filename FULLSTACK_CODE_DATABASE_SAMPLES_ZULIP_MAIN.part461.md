---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 461
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 461 of 1290)

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

---[FILE: desktop-notifications.mdx]---
Location: zulip-main/starlight_help/src/content/docs/desktop-notifications.mdx

```text
---
title: Desktop notifications
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";

import PlayCircleIcon from "~icons/fa/play-circle";

Zulip can be configured to send visual and audible desktop notifications for
[DMs, mentions, and alerts](/help/dm-mention-alert-notifications), as well as
[channel messages](/help/channel-notifications) and [followed
topics](/help/follow-a-topic#configure-notifications-for-followed-topics).

<FlattenedSteps>
  <NavigationSteps target="settings/notifications" />

  1. Toggle the checkboxes in the **Desktop** column of the **Notification
     triggers** table.
</FlattenedSteps>

## Notification sound

You can select the sound Zulip uses for audible desktop notifications. Choosing
**None** disables all audible desktop notifications.

### Change notification sound

<FlattenedSteps>
  <NavigationSteps target="settings/notifications" />

  1. Under **Desktop message notifications**, configure
     **Notification sound**.
</FlattenedSteps>

<ZulipTip>
  To hear the selected sound, click the <PlayCircleIcon /> to the right of your selection.
</ZulipTip>

## Unread count badge

By default, Zulip displays a count of your unmuted unread messages on the
[desktop app](https://zulip.com/apps/) sidebar and on the browser tab icon. You
can configure the badge to only count [direct messages](/help/direct-messages)
and [mentions](/help/mention-a-user-or-group), or to include messages in
[followed topics](/help/follow-a-topic) but not other
[channel](/help/introduction-to-channels) messages.

### Configure unread count badge

<FlattenedSteps>
  <NavigationSteps target="settings/notifications" />

  1. Under **Desktop message notifications**, configure
     **Unread count badge**.
</FlattenedSteps>

### Disable unread count badge

<FlattenedSteps>
  <NavigationSteps target="settings/notifications" />

  1. Under **Desktop message notifications**, select **None** from the
     **Unread count badge** dropdown.
</FlattenedSteps>

## Testing desktop notifications

<ZulipNote>
  This does not make an unread count badge appear.
</ZulipNote>

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/notifications" />

      1. Under **Desktop message notifications**, click **Send a test notification**.
         If notifications are working, you will receive a test notification.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Troubleshooting desktop notifications

Desktop notifications are triggered when a message arrives, and Zulip is not
in focus or the message is offscreen. You must have Zulip open in a browser
tab or in the Zulip desktop app to receive desktop notifications.

**Visual desktop notifications** appear in the corner of your main monitor.
**Audible desktop notifications** make a sound.

To receive notifications in the desktop app, make sure that [Do Not Disturb
mode](/help/do-not-disturb) is turned off.

### Check notification settings for DMs or channels

If you have successfully received a [test
notification](#testing-desktop-notifications), but you aren't seeing desktop
notifications for new messages, check your Zulip notification settings. Make
sure you have enabled desktop notifications [for
DMs](/help/dm-mention-alert-notifications) or [for the
channel](/help/channel-notifications) you are testing. Messages in [muted
topics](/help/mute-a-topic) will not trigger notifications.

### Check platform settings

The most common issue is that your browser or system settings are blocking
notifications from Zulip. Before checking Zulip-specific settings, make sure
that **Do Not Disturb mode** is not enabled on your computer.

<Tabs>
  <TabItem label="Chrome">
    <Steps>
      1. Click on the site information menu to the left of the URL for your Zulip
         organization.
      1. Toggle **Notifications** and **Sound**. If you don't see those options,
         click on **Site settings**, and set **Notifications** and **Sound** to
         **Allow**.
    </Steps>

    Alternate instructions:

    <Steps>
      1. Select the Chrome menu at the top right of the browser, and select
         **Settings**.
      1. Select **Privacy and security**, **Site Settings**, and then
         **Notifications**.
      1. Next to **Allowed to send notifications**, select **Add**.
      1. Paste the Zulip URL for your organization into the site field, and
         click **Add**.
    </Steps>
  </TabItem>

  <TabItem label="Firefox">
    <Steps>
      1. Select the Firefox menu at the top right of the browser, and select
         **Settings**.
      1. On the left, select **Privacy & Security**. Scroll to the **Permissions**
         section and select the **Settings** button next to **Notifications**.
      1. Find the URL for your Zulip organization, and adjust the **Status**
         selector to **Allow**.
    </Steps>
  </TabItem>

  <TabItem label="Desktop app">
    **Windows**

    <Steps>
      1. Click the **Start** button and select **Settings**. Select **System**,
         and then **Notifications & actions**.
      1. Select **Zulip** from the list of apps.
      1. Configure the notification style that you would like Zulip to use.
    </Steps>

    **macOS**

    <Steps>
      1. Open your Mac **System Preferences** and select **Notifications**.
      1. Select **Zulip** from the list of apps.
      1. Configure the notification style that you would like Zulip to use.
    </Steps>
  </TabItem>
</Tabs>

## Related articles

* [Channel notifications](/help/channel-notifications)
* [DMs, mentions, and alerts](/help/dm-mention-alert-notifications)
* [Email notifications](/help/email-notifications)
* [Mobile notifications](/help/mobile-notifications)
* [Do not disturb](/help/do-not-disturb)
```

--------------------------------------------------------------------------------

---[FILE: digest-emails.mdx]---
Location: zulip-main/starlight_help/src/content/docs/digest-emails.mdx

```text
---
title: Weekly digest emails
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";

<AdminOnly />

Zulip has a beta feature to send weekly emails to users who haven't
been active for 5 or more days.  These emails include details on new
channels created and highlights of traffic (of subscribed channels) that
can intrigue users.

This feature is disabled by default, but an organization administrator
can enable it for their organization.  Individual users can opt-out in
organizations that have enabled it.

You can view a sample digest email for your account in HTML and
plain-text formats by visiting `https://zulip.example.com/digest/`,
if `https://zulip.example.com` is your Zulip server URL.

## Enable digest emails for an organization

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Automated messages and emails**, toggle
     **Send weekly digest emails to inactive users**.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: direct-messages.mdx]---
Location: zulip-main/starlight_help/src/content/docs/direct-messages.mdx

```text
---
title: Direct messages
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import DmFeedInstructions from "../include/_DmFeedInstructions.mdx";
import FindDmConversationLeftSidebar from "../include/_FindDmConversationLeftSidebar.mdx";
import MobileDirectMessages from "../include/_MobileDirectMessages.mdx";
import SearchNoteForDmConversations from "../include/_SearchNoteForDmConversations.mdx";
import SendDm from "../include/_SendDm.mdx";
import ViewDmsLeftSidebar from "../include/_ViewDmsLeftSidebar.mdx";

import ChevronRightIcon from "~icons/zulip-icon/chevron-right";
import SearchIcon from "~icons/zulip-icon/search";
import UserListIcon from "~icons/zulip-icon/user-list";

**Direct messages (DMs)** are conversations with other users that happen outside
of a [channel](/help/introduction-to-channels). They are convenient for 1:1 and
small group conversations. Direct messages are private to conversation participants. Administrators may be
able to [export](/help/export-your-organization) your DMs in a corporate
organization, or [with your
permission](/help/export-your-organization#configure-whether-administrators-can-export-your-private-data).

If you find yourself frequently conversing with the same person or group, it
often works best to [create a private channel](/help/create-a-channel) for your
conversations. This lets you organize your discussion into topics, and subscribe
or unsubscribe people as needed.

## Send a DM

<SendDm />

## View your direct message conversations

There are a few different ways to view your DM conversations.

<Tabs>
  <TabItem label="Via left sidebar">
    <FlattenedSteps>
      <ViewDmsLeftSidebar />
    </FlattenedSteps>

    <ZulipTip>
      To return to the channel list in the left sidebar, click the **back to
      channels** link above the search box.
    </ZulipTip>
  </TabItem>

  <TabItem label="Via right sidebar">
    <Steps>
      1. If the [user list](/help/user-list) in the right sidebar is hidden, click the
         **user list** (<UserListIcon />) icon in
         the upper right to show it.
      1. Click on any user to view your 1:1 DM conversation.
    </Steps>

    <ZulipTip>
      You can find a user by typing their name in the **Filter users** box at the
      top of the right sidebar.
    </ZulipTip>
  </TabItem>

  <TabItem label="Via compose box">
    <Steps>
      1. Click the **New direct message** button at the bottom of the app, or use the
         <kbd>X</kbd> keyboard shortcut to [open the compose box](/help/open-the-compose-box).
      1. Start typing a user's name in the recipient bar, and select their name from
         the list of suggestions. Continue to add users for a group DM conversation.
      1. Click the highlighted **Go to conversation** (<ChevronRightIcon />) button at the top of the compose box, or use
         the <kbd>Ctrl</kbd> + <kbd>.</kbd> keyboard shortcut to view that DM
         conversation.
    </Steps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileDirectMessages />

      1. Tap a recent DM conversation to view it.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Find a direct message conversation

<Tabs>
  <TabItem label="Via left sidebar">
    <SearchNoteForDmConversations />

    <FindDmConversationLeftSidebar />
  </TabItem>

  <TabItem label="Via search box">
    <Steps>
      1. Click the **search** (<SearchIcon />) icon in the top bar to open the [search
         box](/help/search-for-messages).
      1. Start typing a user's name. You'll be able to select DMs with that user
         from the list of suggestions.
      1. *(optional)* Continue to add users via the search box for a group DM
         conversation.
    </Steps>

    <ZulipTip>
      You can also type `dm-including` in the search box to find all 1:1 and group
      DM conversations that include a particular user.
    </ZulipTip>
  </TabItem>
</Tabs>

## Go to direct message feed

You can see all your direct messages in one place.

<DmFeedInstructions />

## Related articles

* [Typing notifications](/help/typing-notifications)
* [Open the compose box](/help/open-the-compose-box)
```

--------------------------------------------------------------------------------

---[FILE: disable-welcome-emails.mdx]---
Location: zulip-main/starlight_help/src/content/docs/disable-welcome-emails.mdx

```text
---
title: Disable welcome emails
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";

<AdminOnly />

Zulip sends a handful of emails to new users, introducing them to the Zulip
app, when they join an organization. If these emails don't make sense for
your organization, you can disable them.

Note that regardless of this setting, users will receive an initial account
email notifying them about their new Zulip account and how to log in.

## Disable welcome emails

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Onboarding**, toggle
     **Send emails introducing Zulip to new users**.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: dm-mention-alert-notifications.mdx]---
Location: zulip-main/starlight_help/src/content/docs/dm-mention-alert-notifications.mdx

```text
---
title: DMs, mentions, and alerts
---

import {Steps} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";

import TrashIcon from "~icons/zulip-icon/trash";

You can configure desktop, mobile, and email notifications for
[direct messages (DMs)](/help/direct-messages),
[mentions](/help/mention-a-user-or-group), and [alert
words](#alert-words).

## Configure notifications

These settings will affect notifications for direct messages, group
direct messages, mentions, and alert words.

<FlattenedSteps>
  <NavigationSteps target="settings/notifications" />

  1. In the **Notification triggers** table, toggle the settings for **DMs, mentions, and alerts**.
</FlattenedSteps>

You can also hide the content of direct messages (and group direct
messages) from desktop notifications.

<Steps>
  1. Under **Desktop message notifications**, toggle
     **Include content of direct messages in desktop notifications**.
</Steps>

## Wildcard mentions

You can configure which types of notifications you want to receive for wildcard
mentions (**@all**, **@everyone**, **@channel**) and **@topic** mentions
separately from personal @-mentions.

<ZulipTip>
  These mentions don't trigger notifications in muted channels or topics,
  unlike personal mentions.
</ZulipTip>

<FlattenedSteps>
  <NavigationSteps target="settings/notifications" />

  1. In the **Notification triggers** table, toggle the **@all** checkbox for
     **Channels** or **Followed topics**.
</FlattenedSteps>

Additionally, you can override this configuration for individual
channels in your [Channel settings](/help/channel-notifications), and
administrators can [restrict use of wildcard
mentions](/help/restrict-wildcard-mentions) in large channels.

## Alert words

Zulip lets you to specify **alert words or phrases** that send you a desktop
notification whenever the alert word is included in a message. Alert words are
case-insensitive.

<ZulipTip>
  Alert words in messages you receive while the alert is enabled will be highlighted.
</ZulipTip>

### Add an alert word or phrase

<FlattenedSteps>
  <NavigationSteps target="settings/alert-words" />

  1. Click **Add alert word**.
  1. Type a word or phrase, and click **Add**.
</FlattenedSteps>

### Remove an alert word or phrase

<FlattenedSteps>
  <NavigationSteps target="settings/alert-words" />

  1. Click the **delete** (<TrashIcon />) icon next to the
     alert word that you would like to remove.
</FlattenedSteps>

## Related articles

* [Desktop notifications](/help/desktop-notifications)
* [Email notifications](/help/email-notifications)
* [Mobile notifications](/help/mobile-notifications)
* [Restrict wildcard mentions](/help/restrict-wildcard-mentions)
* [Channel notifications](/help/channel-notifications)
* [View your mentions](/help/view-your-mentions)
* [Do not disturb](/help/do-not-disturb)
```

--------------------------------------------------------------------------------

---[FILE: do-not-disturb.mdx]---
Location: zulip-main/starlight_help/src/content/docs/do-not-disturb.mdx

```text
---
title: Do Not Disturb
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import ZulipNote from "../../components/ZulipNote.astro";
import DesktopToggleSidebarTip from "../include/_DesktopToggleSidebarTip.mdx";

import BellIcon from "~icons/fa/bell";
import BellSlashIcon from "~icons/fa/bell-slash";

The Zulip desktop app offers a **Do Not Disturb (DND)** mode. Turning on **Do Not
Disturb** mode disables [desktop notifications](/help/desktop-notifications)
across all the organizations you have
[added](/help/logging-in#log-in-to-a-new-organization) to the Zulip desktop app.
This can be convenient for avoiding interruptions during a meeting, or when you need
time to focus on your work.

<ZulipNote>
  Other types of notifications will not be affected, including [mobile
  notifications](/help/mobile-notifications), [email
  notifications](/help/email-notifications), and [desktop
  notifications](/help/desktop-notifications) in the Zulip web app.
</ZulipNote>

## Toggle Do Not Disturb

<Tabs>
  <TabItem label="Desktop">
    <Steps>
      1. Click the **bell** (<BellIcon />) or **bell with a slash** (<BellSlashIcon />) icon in the **organizations sidebar** on the
         left. You can also select **Toggle Do Not Disturb** from the **Zulip** menu in
         the top menu bar.
    </Steps>

    <DesktopToggleSidebarTip />
  </TabItem>
</Tabs>

## Check whether Do Not Disturb is enabled

<Tabs>
  <TabItem label="Desktop">
    <Steps>
      1. If the **organizations sidebar** on the left shows a **bell** (<BellIcon />) icon, **Do Not Disturb** is disabled. If the **organizations
         sidebar** on the left shows a **bell with a slash** (<BellSlashIcon />) icon, **Do Not Disturb** is enabled, and you are not
         receiving desktop notifications.
    </Steps>

    <DesktopToggleSidebarTip />
  </TabItem>
</Tabs>

## Related articles

* [Desktop notifications](/help/desktop-notifications)
* [DMs, mentions, and alerts](/help/dm-mention-alert-notifications)
* [Channel notifications](/help/channel-notifications)
* [Email notifications](/help/email-notifications)
* [Mobile notifications](/help/mobile-notifications)
```

--------------------------------------------------------------------------------

---[FILE: edit-a-message.mdx]---
Location: zulip-main/starlight_help/src/content/docs/edit-a-message.mdx

```text
---
title: Edit a message
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import MessageActions from "../include/_MessageActions.mdx";
import MessageLongPressMenu from "../include/_MessageLongPressMenu.mdx";

import EditIcon from "~icons/zulip-icon/edit";

Zulip makes it possible to edit the content of your messages, letting you fix
typos, clarify your thoughts, etc. Organization administrators can
[configure](/help/restrict-message-editing-and-deletion) who can edit messages,
and set time limits for this action. However, even organization owners cannot
edit the content of a message sent by another user.

<ZulipTip>
  You can also [edit message topics](/help/rename-a-topic).
</ZulipTip>

## Edit a message

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActions />

      1. Click the **pencil** (<EditIcon />) icon. If you do not see
         the **pencil** (<EditIcon />) icon, you do not have
         permission to edit this message.
      1. Edit the content of the message.
      1. Click **Save**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />

      1. Tap **Edit message**. If you do not see the **Edit message** option, you do
         not have permission to edit this message.
      1. Edit the content of the message.
      1. Tap **Save**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

<ZulipTip>
  When you edit a message, everyone will see it labeled as **edited**. You
  can [view a message's edit history](/help/view-a-messages-edit-history)
  if it is [allowed](/help/restrict-message-edit-history-access) in your
  organization.
</ZulipTip>

## Message notifications

If you edit a message to [mention a user or group](/help/mention-a-user-or-group),
the newly mentioned users will receive notifications just as if they had been
mentioned in the original message.

If you edit a message soon after sending it, the edit will be reflected in any
[email notifications that have not yet been sent](/help/email-notifications#configure-delay-for-message-notification-emails).
This includes canceling notifications for users whose
[mention](/help/format-your-message-using-markdown#mention-a-user-or-group) was
removed or changed from a regular mention to a
[silent mention](/help/mention-a-user-or-group#silently-mention-a-user).

If you [delete the content of a message](/help/delete-a-message#delete-message-content),
any pending email notifications for that message will be canceled, including
[mentions and alerts](/help/dm-mention-alert-notifications).

## Related articles

* [View, copy, and share message content as Markdown](/help/view-the-markdown-source-of-a-message)
* [Restrict message editing and deletion](/help/restrict-message-editing-and-deletion)
* [Delete a message](/help/delete-a-message)
```

--------------------------------------------------------------------------------

---[FILE: edit-your-profile.mdx]---
Location: zulip-main/starlight_help/src/content/docs/edit-your-profile.mdx

```text
---
title: Edit your profile
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

By default, your profile includes your name, email, the date you joined, and
when you were last active.

Organization administrators can also
[add custom profile fields](/help/custom-profile-fields#add-a-custom-profile-field). Custom profile
fields are always optional, and will not appear in your profile unless you
fill them out.

### Edit your profile

<FlattenedSteps>
  <NavigationSteps target="settings/profile" />

  1. Edit the fields under **Profile**.
</FlattenedSteps>

## Related articles

* [Set up your account](/help/set-up-your-account)
* [Change your name](/help/change-your-name)
* [Change your email address](/help/change-your-email-address)
* [Change your profile picture](/help/change-your-profile-picture)
* [View someone's profile](/help/view-someones-profile)
```

--------------------------------------------------------------------------------

---[FILE: email-notifications.mdx]---
Location: zulip-main/starlight_help/src/content/docs/email-notifications.mdx

```text
---
title: Email notifications
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";

## Message notification emails

Zulip can be configured to send message notification emails for [DMs, mentions,
and alerts](/help/dm-mention-alert-notifications), as well as [channel
messages](/help/channel-notifications) and [followed
topics](/help/follow-a-topic#configure-notifications-for-followed-topics).

You will receive email notifications only for messages sent when you were not
[active](/help/status-and-availability#availability) on Zulip. Messages sent to
the same conversation within a [configurable time
period](#configure-delay-for-message-notification-emails) (e.g., a few minutes)
will be combined into a single email.

You can reply to Zulip messages by replying to message notification emails.

<ZulipNote>
  To enable replies via email on a self-hosted server, the [incoming email
  gateway][incoming-email-gateway] must be configured by the system
  administrator.
</ZulipNote>

### Configure triggers for message notification emails

<FlattenedSteps>
  <NavigationSteps target="settings/notifications" />

  1. Toggle the checkboxes in the **Email** column of the **Notification
     triggers** table.
</FlattenedSteps>

[incoming-email-gateway]: https://zulip.readthedocs.io/en/stable/production/email-gateway.html

### Include organization name in subject line

You can configure whether the name of your Zulip organization is included in the
subject of message notification emails.

Zulip offers a convenient **Automatic** configuration option, which includes the
name of the organization in the subject only if you have accounts in multiple
Zulip Cloud organizations, or in multiple organizations on the same Zulip server.

<FlattenedSteps>
  <NavigationSteps target="settings/notifications" />

  1. Under **Email message notifications**, configure
     **Include organization name in subject of message notification emails**.
</FlattenedSteps>

### Configure delay for message notification emails

To reduce the number of emails you receive, Zulip
delays sending message notification emails for a configurable period
of time. The delay helps in a few ways:

* No email is sent if you return to Zulip and read the message before
  the email would go out.
* Edits made by the sender soon after sending a message will be
  reflected in the email.
* Multiple messages in the same Zulip [conversation](/help/reading-conversations)
  are combined into a single email. Different conversations will always be in
  separate emails, so that you can respond directly from your
  email.

<FlattenedSteps>
  <NavigationSteps target="settings/notifications" />

  1. Under **Email message notifications**, select the desired time period from the
     **Delay before sending message notification emails** dropdown.
</FlattenedSteps>

### Hide message content

For security or compliance reasons, you may want to hide the content of your
Zulip messages from your email. Organization administrators can do this at an
[organization-wide level](/help/hide-message-content-in-emails), but you can
also do this just for the messages you receive.

This setting also blocks message topics, channel names, and user names from
being sent through your email.

<FlattenedSteps>
  <NavigationSteps target="settings/notifications" />

  1. Under **Email message notifications**, toggle
     **Include message content in message notification emails**.
</FlattenedSteps>

## New login emails

By default, Zulip sends an email whenever you log in to Zulip. These emails
help you protect your account; if you see a login email at a time or from a
device you don't recognize, you should
[change your password](/help/change-your-password) right away.

In typical usage, these emails are sent infrequently, since all Zulip apps
(web, mobile, desktop, and terminal) keep you logged in to any organization
you've interacted with in the last 1-2 weeks.

However, there are situations (usually due to corporate security policy) in
which you may have to log in every day, and where getting login emails can
feel excessive.

### Disable new login emails

<FlattenedSteps>
  <NavigationSteps target="settings/notifications" />

  1. Under **Other emails**, toggle
     **Send email notifications for new logins to my account**.
</FlattenedSteps>

## Low-traffic newsletter

<ZulipNote>
  This feature is only available on Zulip Cloud.
</ZulipNote>

Zulip sends out a low-traffic newsletter (expect 2-4 emails a year)
to Zulip Cloud users announcing major changes in Zulip.

### Managing your newsletter subscription

<Tabs>
  <TabItem label="Zulip Cloud">
    <FlattenedSteps>
      <NavigationSteps target="settings/notifications" />

      1. Under **Other emails**, toggle
         **Send me Zulip's low-traffic newsletter (a few emails a year)**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Using Zulip via email](/help/using-zulip-via-email)
* [Message a channel by email](/help/message-a-channel-by-email)
* [DMs mentions, and alerts](/help/dm-mention-alert-notifications)
* [Channel notifications](/help/channel-notifications)
* [Follow a topic](/help/follow-a-topic)
* [Hide message content in emails (for organizations)](/help/hide-message-content-in-emails)
```

--------------------------------------------------------------------------------

---[FILE: emoji-and-emoticons.mdx]---
Location: zulip-main/starlight_help/src/content/docs/emoji-and-emoticons.mdx

```text
---
title: Emoji and emoticons
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import EmojiAndEmoticonsExamples from "../include/_EmojiAndEmoticonsExamples.mdx";
import EmojiAndEmoticonsIntro from "../include/_EmojiAndEmoticonsIntro.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import SmileBiggerIcon from "~icons/zulip-icon/smile-bigger";

<EmojiAndEmoticonsIntro />

<ZulipTip>
  You can also quickly respond to a message by using [emoji reactions](/help/emoji-reactions).
</ZulipTip>

## Use an emoji in your message

<Tabs>
  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. Click the **smiley face** (<SmileBiggerIcon />)
         icon at the bottom of the compose box.
      1. Select an emoji. You can type to search, use the arrow keys, or click on
         an emoji with your mouse.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via Markdown">
    <FlattenedSteps>
      <StartComposing />

      1. Type `:`, followed by a few letters from the emoji name, to see autocomplete
         suggestions. The letters don't have to be at the beginning of the emoji name.
         For example, `:app` will match both `:apple:` and `:pineapple:`.
      1. Type the full emoji name followed by `:`, or select an emoji from the list of
         suggestions.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via paste">
    <FlattenedSteps>
      <StartComposing />

      1. Paste an emoji copied from outside of Zulip directly into the compose box.
    </FlattenedSteps>
  </TabItem>
</Tabs>

<ZulipTip>
  You can hover over an emoji in the emoji picker, a message, or an [emoji
  reaction](/help/emoji-reactions) to learn its name.
</ZulipTip>

### Use an emoticon

You can configure Zulip to convert emoticons into emoji, so that, e.g., `:)`
will be displayed as 🙂 .

<FlattenedSteps>
  <NavigationSteps target="settings/preferences" />

  1. Under **Emoji settings**, select **Convert emoticons before sending**.
</FlattenedSteps>

The list of supported emoticons is available
[here](/help/configure-emoticon-translations).

## Examples

<EmojiAndEmoticonsExamples />

## Use an emoji in a topic name

You can use unicode characters in topic names, including unicode
emoji. Each platform has a different way to enter unicode
emoji. [Custom emoji](/help/custom-emoji) cannot be used in topic
names.

<Tabs>
  <TabItem label="macOS">
    <Steps>
      1. [Start a new topic](/help/introduction-to-topics#how-to-start-a-new-topic).
      1. Press <kbd>Command ⌘</kbd> + <kbd>Control</kbd> + <kbd>Space</kbd>
         to open the **Character Viewer**. See the
         [macOS documentation](https://support.apple.com/guide/mac-help/use-emoji-and-symbols-on-mac-mchlp1560/mac)
         to learn more.
      1. Select an emoji. You can type to search, use the arrow keys, or click on
         an emoji with your mouse.
    </Steps>
  </TabItem>

  <TabItem label="Windows">
    <Steps>
      1. [Start a new topic](/help/introduction-to-topics#how-to-start-a-new-topic).
      1. Press <kbd>Windows</kbd> + <kbd>.</kbd>
         to open the **emoji keyboard**. See the
         [Windows documentation](https://support.microsoft.com/en-us/windows/windows-keyboard-tips-and-tricks-588e0b72-0fff-6d3f-aeee-6e5116097942)
         to learn more.
      1. Select an emoji. You can type to search, use the arrow keys, or click on
         an emoji with your mouse.
    </Steps>
  </TabItem>

  <TabItem label="Linux">
    <Steps>
      1. [Start a new topic](/help/introduction-to-topics#how-to-start-a-new-topic).
      1. Open the [Characters app for GNOME](https://apps.gnome.org/en/Characters/).
      1. Select an emoji. You can type to search, use the arrow keys, or click on
         an emoji with your mouse.
    </Steps>
  </TabItem>

  <TabItem label="Chrome">
    <Steps>
      1. [Start a new topic](/help/introduction-to-topics#how-to-start-a-new-topic).
      1. Right-click on the text input box.
      1. Select **Emoji** or **Emoji & Symbols**. You will only see this option if
         supported by your operating system.
      1. Select an emoji. You can type to search, use the arrow keys, or click on
         an emoji with your mouse.
    </Steps>
  </TabItem>

  <TabItem label="Via paste">
    <Steps>
      1. [Start a new topic](/help/introduction-to-topics#how-to-start-a-new-topic).
      1. Paste an emoji copied from outside of Zulip directly into the text input box.
    </Steps>

    <ZulipTip>
      [https://emojipedia.org/](https://emojipedia.org/) may be a helpful resource.
    </ZulipTip>
  </TabItem>
</Tabs>

## Change your emoji set

Your emoji set determines how you see emoji. It has no effect on the emoji
you send. Zulip emoji are compatible with screen readers and other accessibility tools.

<FlattenedSteps>
  <NavigationSteps target="settings/preferences" />

  1. Under **Emoji**, select **Google**,
     **Twitter**, or **Plain text** for the emoji theme.
</FlattenedSteps>

## Related articles

* [Add custom emoji](/help/custom-emoji)
* [Emoji reactions](/help/emoji-reactions)
* [Configure emoticon translations](/help/configure-emoticon-translations)
```

--------------------------------------------------------------------------------

---[FILE: emoji-reactions.mdx]---
Location: zulip-main/starlight_help/src/content/docs/emoji-reactions.mdx

```text
---
title: Emoji reactions
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import MessageActions from "../include/_MessageActions.mdx";
import MessageLongPressMenu from "../include/_MessageLongPressMenu.mdx";
import ViewEmojiReactions from "../include/_ViewEmojiReactions.mdx";

import ChevronRightIcon from "~icons/zulip-icon/chevron-right";
import MoreVerticalSpreadIcon from "~icons/zulip-icon/more-vertical-spread";
import SmileIcon from "~icons/zulip-icon/smile";

Emoji reactions let you quickly respond to a message. For example, 👍 is
commonly used to express agreement or confirm that you've [read the
message](/help/read-receipts). Any emoji can be used as a reaction, including
[custom emoji](/help/custom-emoji). Reactions appear at the bottom of the
message.

## Add a new reaction

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActions />

      1. Click the **Add emoji reaction** (<SmileIcon />) icon. On messages that you sent, click on the
         **ellipsis** (<MoreVerticalSpreadIcon />),
         then **Add emoji reaction**.
      1. Select an emoji. Type to search, use the arrow keys, or click on an emoji
         with your mouse.
    </FlattenedSteps>

    <ZulipTip>
      To add multiple reactions without closing the emoji picker, hold the
      <kbd>Shift</kbd> key while selecting emoji.
    </ZulipTip>

    <KeyboardTip>
      Use <kbd>:</kbd> to add any reaction, <kbd>=</kbd> to add the first
      emoji reaction added by others, or <kbd>+</kbd> to react with 👍.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />

      1. Select one of the emojis at the top of the menu, or tap **more**
         (<ChevronRightIcon />).
      1. Start typing the name of the emoji you want to use, and select an emoji from
         the list of suggestions.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Add or remove an existing reaction

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click on an existing emoji reaction to add or remove your reaction.
    </Steps>

    <ZulipTip>
      To make it easy to see which reactions you have added, they are
      highlighted in a different color.
    </ZulipTip>

    <KeyboardTip>
      You can also toggle the first emoji reaction on the selected message by
      using the <kbd>=</kbd> shortcut.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Mobile">
    <Steps>
      1. Tap on an existing emoji reaction to add or remove your reaction.
    </Steps>

    <ZulipTip>
      To make it easy to see which reactions you have added, they are
      highlighted in a different color.
    </ZulipTip>
  </TabItem>
</Tabs>

## Viewing who reacted to a message

For messages where few users have reacted, the names of users who have reacted
are displayed directly on the message if the [option to do
so](#toggle-whether-names-of-reacting-users-are-displayed) is enabled.

### View who reacted to a message

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Hover over an emoji reaction to see who reacted with that emoji.
    </Steps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />

      1. Tap **See who reacted**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

### Toggle whether names of reacting users are displayed

<FlattenedSteps>
  <NavigationSteps target="settings/preferences" />

  1. Under **Emoji**, toggle **Display names of reacting users when few users have
     reacted to a message**.
</FlattenedSteps>

## View your messages with reactions

<ViewEmojiReactions />

## Related articles

* [Add custom emoji](/help/custom-emoji)
* [Emoji in messages](/help/emoji-and-emoticons)
```

--------------------------------------------------------------------------------

---[FILE: enable-full-width-display.mdx]---
Location: zulip-main/starlight_help/src/content/docs/enable-full-width-display.mdx

```text
---
title: Enable full width display
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

By default, Zulip limits the width of the center message pane, because it's
easier and faster to read paragraphs that don't have long lines. This is
also why many news sites, blogs, and social media platforms limit their
paragraph width.

You can instead configure Zulip to use the full width of wide screens.

### Enable full width display

<FlattenedSteps>
  <NavigationSteps target="settings/preferences" />

  1. Under **Information**, select **Use full width on wide screens**.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

````
