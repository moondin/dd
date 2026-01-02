---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 460
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 460 of 1290)

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

---[FILE: customize-organization-settings.mdx]---
Location: zulip-main/starlight_help/src/content/docs/customize-organization-settings.mdx

```text
---
title: Customize organization settings
---

import ReviewOrganizationSettingsInstructions from "../include/_ReviewOrganizationSettingsInstructions.mdx";

<ReviewOrganizationSettingsInstructions />

A few settings to highlight:

* Decide [who can invite new users][who-can-invite], or whether
  [anyone can join without an invitation][who-can-join].
* [Set visibility for users' email addresses][email-address-visibility].
* If your organization uses a programming language, set the [default
  language for code blocks][default-code-block-language]. Also
  consider setting up [code playgrounds][code-playgrounds].
* If your organization uses code repositories, [set up
  linkifiers](/help/add-a-custom-linkifier) to make it easy to link to
  issues (e.g., just by typing #1234 for issue 1234).
* [Add custom emoji](/help/custom-emoji), including your organization's logo.

For many other settings, e.g., [message][message-editing-permissions] and
[topic][topic-editing-permissions] editing permissions, you can experience how
Zulip works for your organization before deciding what settings are best for
you.

[message-editing-permissions]: /help/restrict-message-editing-and-deletion

[topic-editing-permissions]: /help/restrict-moving-messages

[default-code-block-language]: /help/code-blocks#default-code-block-language

[code-playgrounds]: /help/code-blocks#code-playgrounds

[email-address-visibility]: /help/configure-email-visibility

[who-can-invite]: /help/restrict-account-creation#change-who-can-send-invitations

[who-can-join]: /help/restrict-account-creation#set-whether-invitations-are-required-to-join

## Related articles

* [Moving to Zulip](/help/moving-to-zulip)
* [Create your organization profile](/help/create-your-organization-profile)
* [Create channels](/help/create-channels)
* [Getting started with Zulip](/help/getting-started-with-zulip)
```

--------------------------------------------------------------------------------

---[FILE: customize-settings-for-new-users.mdx]---
Location: zulip-main/starlight_help/src/content/docs/customize-settings-for-new-users.mdx

```text
---
title: Customize settings for new users
---

import CustomizeSettingsForNewUsers from "../include/_CustomizeSettingsForNewUsers.mdx";

<CustomizeSettingsForNewUsers />

## Related articles

* [Moving to Zulip](/help/moving-to-zulip)
* [Invite users to join](/help/invite-users-to-join)
* [Getting started with Zulip](/help/getting-started-with-zulip)
```

--------------------------------------------------------------------------------

---[FILE: dark-theme.mdx]---
Location: zulip-main/starlight_help/src/content/docs/dark-theme.mdx

```text
---
title: Dark theme
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import MobileSettings from "../include/_MobileSettings.mdx";
import PersonalMenu from "../include/_PersonalMenu.mdx";

Zulip provides both a light theme and a dark theme, which is great
for working in a dark space.

## Manage color theme

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <PersonalMenu />

      1. Select the desired theme using the row of icons in the middle of the menu.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileSettings />

      1. Select the desired theme.
    </FlattenedSteps>
  </TabItem>
</Tabs>

The default is **Automatic** (for the desktop and web apps) or **System** (for the
mobile apps). This setting detects which theme to use based on the color scheme
used by your device's operating system.

You can also specify **Light** or **Dark** if you'd like Zulip to use the same
color scheme regardless of your operating system configuration.

## Related articles

* [Set up your account](/help/set-up-your-account)
* [Review your settings](/help/review-your-settings)
* [Configure default new user settings](/help/configure-default-new-user-settings)
* [Font size](/help/font-size)
* [Line spacing](/help/line-spacing)
```

--------------------------------------------------------------------------------

---[FILE: deactivate-a-user-group.mdx]---
Location: zulip-main/starlight_help/src/content/docs/deactivate-a-user-group.mdx

```text
---
title: Deactivate a user group
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

import UserGroupPlusIcon from "~icons/zulip-icon/user-group-plus";
import UserGroupXIcon from "~icons/zulip-icon/user-group-x";

You can deactivate groups you no longer plan to use. Deactivated groups cannot be [mentioned](/help/mention-a-user-or-group), or used for any [permissions](/help/manage-permissions).

## Deactivate a user group

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/group/all" />

      1. Select a user group.
      1. Select the **Permissions** tab on the right.
      1. Remove all permissions.
      1. Click the **Deactivate group** (<UserGroupXIcon />) button in the
         upper right corner of the user group settings panel.
      1. Click **Confirm**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## View deactivated user groups

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/group/all" />

      1. Select **Deactivated groups** from the dropdown next to the **Filter** box
         above the list of groups.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Reactivate a user group

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/group/all" />

      1. Select **Deactivated groups** from the dropdown next to the **Filter** box
         above the list of groups.
      1. Select a user group.
      1. Click the **Reactivate group** (<UserGroupPlusIcon />) button in the
         upper right corner of the user group settings panel.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [User groups](/help/user-groups)
* [Create user groups](/help/create-user-groups)
* [Manage user groups](/help/manage-user-groups)
```

--------------------------------------------------------------------------------

---[FILE: deactivate-or-reactivate-a-bot.mdx]---
Location: zulip-main/starlight_help/src/content/docs/deactivate-or-reactivate-a-bot.mdx

```text
---
title: Deactivate or reactivate a bot
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";

import UserCogIcon from "~icons/zulip-icon/user-cog";
import UserPlusIcon from "~icons/zulip-icon/user-plus";
import UserXIcon from "~icons/zulip-icon/user-x";

By default, users can deactivate and reactivate the bots that they
add. Organization admins can prevent users from reactivating bots by
[restricting bot creation](/help/restrict-bot-creation).

Organization administrators can also deactivate or reactivate any existing
bot, regardless of who owns them.

## Deactivate a bot

<Tabs>
  <TabItem label="Your bots">
    <FlattenedSteps>
      <NavigationSteps target="settings/your-bots" />

      1. In the **Actions** column, click the **deactivate bot** (<UserXIcon />)
         icon for the bot you want to deactivate.
      1. Approve by clicking **Deactivate**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="All bots">
    <AdminOnly />

    <FlattenedSteps>
      <NavigationSteps target="settings/bots" />

      1. In the **Actions** column, click the **deactivate bot** (<UserXIcon />)
         icon for the bot you want to deactivate.
      1. Approve by clicking **Deactivate**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Reactivate a bot

<Tabs>
  <TabItem label="Your bots">
    <FlattenedSteps>
      <NavigationSteps target="settings/your-bots" />

      1. Select **Deactivated** from the dropdown above the **Bots** table.
      1. In the **Actions** column, click the **reactivate bot** (<UserPlusIcon />)
         icon for the bot you want to reactivate.
      1. Approve by clicking **Confirm**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="All bots">
    <AdminOnly />

    <FlattenedSteps>
      <NavigationSteps target="settings/bots" />

      1. Select **Deactivated** from the dropdown above the **Bots** table.
      1. In the **Actions** column, click the **reactivate bot** (<UserPlusIcon />)
         icon for the bot you want to reactivate.
      1. Approve by clicking **Confirm**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Bots overview](/help/bots-overview)
* [Integrations overview](/help/integrations-overview)
* [Add a bot or integration](/help/add-a-bot-or-integration)
* [Manage a bot](/help/manage-a-bot)
* [Restrict bot creation](/help/restrict-bot-creation)
* [View all bots in your organization](/help/view-all-bots-in-your-organization)
```

--------------------------------------------------------------------------------

---[FILE: deactivate-or-reactivate-a-user.mdx]---
Location: zulip-main/starlight_help/src/content/docs/deactivate-or-reactivate-a-user.mdx

```text
---
title: Deactivate or reactivate a user
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import ManageThisUser from "../include/_ManageThisUser.mdx";
import ManageUserTabTip from "../include/_ManageUserTabTip.mdx";

import UserCircleDeactivatedIcon from "~icons/zulip-icon/user-circle-deactivated";
import UserPlusIcon from "~icons/zulip-icon/user-plus";
import UserXIcon from "~icons/zulip-icon/user-x";

## Deactivating a user

<AdminOnly />

When you deactivate a user:

* The user will be immediately logged out of all Zulip sessions, including
  desktop, web and mobile apps.
* The user's credentials for logging in will no longer work, including password
  login and [any other login options](/help/configure-authentication-methods)
  enabled in your organization.
* The user's [bots](/help/bots-overview) will be deactivated.
* [Email invitations and invite links](/help/invite-new-users) created by the
  user will be disabled.
* Other users will be able to see that the user has been deactivated (e.g., on
  their [user card](/help/user-cards)). In sidebars and elsewhere, a user's
  [availability](/help/status-and-availability) will be replaced with a
  deactivated icon
  (<UserCircleDeactivatedIcon />).
* Even if your organization [allows users to join without an
  invitation](/help/restrict-account-creation#set-whether-invitations-are-required-to-join),
  this user will not be able to rejoin with the same email account.

<ZulipNote>
  You must go through the deactivation process below to fully remove a user's
  access to your Zulip organization. Changing a user's password or removing
  their single sign-on account will not log them out of their open Zulip
  sessions, or disable their API keys.
</ZulipNote>

### Deactivate a user

<Tabs>
  <TabItem label="Via user profile">
    <FlattenedSteps>
      <ManageThisUser />

      1. Click **Deactivate user** at the bottom of the **Manage user** menu.
      1. *(optional)* Select **Notify this user by email?** if desired, and enter a
         custom comment to include in the notification email.
      1. Approve by clicking **Deactivate**.
    </FlattenedSteps>

    <ManageUserTabTip />
  </TabItem>

  <TabItem label="Via organization settings">
    <FlattenedSteps>
      <NavigationSteps target="settings/users" />

      1. In the **Actions** column, click the **deactivate user** (<UserXIcon />) icon for the user you want to deactivate.
      1. *(optional)* Select **Notify this user by email?** if desired, and enter a
         custom comment to include in the notification email.
      1. Approve by clicking **Deactivate**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

<ZulipTip>
  Organization administrators cannot deactivate organization owners.
</ZulipTip>

## Reactivating a user

<AdminOnly />

A reactivated user will have the same role, channel subscriptions, user group
memberships, and other settings and permissions as they did prior to
deactivation. They will also have the same API key and bot API keys, but their
bots will be deactivated until the user manually
[reactivates](/help/deactivate-or-reactivate-a-bot) them again.

### Reactivate a user

<Tabs>
  <TabItem label="Via organization settings">
    <FlattenedSteps>
      <NavigationSteps target="settings/deactivated" />

      1. Select the **Deactivated** tab.
      1. In the **Actions** column, click the **reactivate user** (<UserPlusIcon />) icon for the user you want to reactivate.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via user profile">
    <Steps>
      1. Click on a user's profile picture or name on a message they sent
         to open their **user card**.
      1. Click **View profile**.
      1. Select the **Manage user** tab.
      1. Click **Reactivate user** at the bottom of the **Manage user** menu.
      1. Approve by clicking **Confirm**.
    </Steps>

    <ManageUserTabTip />
  </TabItem>
</Tabs>

<ZulipTip>
  You may want to [review and adjust](/help/manage-user-channel-subscriptions)
  the reactivated user's channel subscriptions.
</ZulipTip>

## Related articles

* [Mute a user](/help/mute-a-user)
* [Change a user's role](/help/user-roles#change-a-users-role)
* [Change a user's name](/help/change-a-users-name)
* [Deactivate your account](/help/deactivate-your-account)
* [Manage a user](/help/manage-a-user)
```

--------------------------------------------------------------------------------

---[FILE: deactivate-your-account.mdx]---
Location: zulip-main/starlight_help/src/content/docs/deactivate-your-account.mdx

```text
---
title: Deactivate your account
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";

In Zulip, you have a dedicated account for each organization you belong to.
Deactivating your Zulip account in one organization will have no effect on any
other Zulip accounts you may have.

Once you deactivate your account, you cannot register in the same organization
with the email address you used before. If you are re-joining an organization,
ask an organization administrator to
[reactivate](/help/deactivate-or-reactivate-a-user#reactivate-a-user) your
account.

<ZulipTip>
  You can find all the Zulip Cloud accounts associated with your email address
  with the [**Find your accounts**](https://zulip.com/accounts/find/) tool.
  If you have forgotten your account password, you can
  [reset it](/help/change-your-password).
</ZulipTip>

## Deactivate your account

<ZulipNote>
  If you are the only owner in the organization, you cannot
  deactivate your account. You will need to
  [add another owner](/help/user-roles#change-a-users-role) first.
</ZulipNote>

<FlattenedSteps>
  <NavigationSteps target="settings/account-and-privacy" />

  1. Under **Account**, click **Deactivate account**.
  1. Approve by clicking **Confirm**.
</FlattenedSteps>

## What happens when you deactivate an account

* Your [user card](/help/user-cards) will have a notice indicating that your
  account has been deactivated.
* Deactivating your account won't delete messages you've sent or files
  you've shared. If permitted in your organization, delete content you'd
  like to remove before deactivating your account.
* Any bots that you maintain will be disabled.

## Related articles

* [Logging in](/help/logging-in)
* [Logging out](/help/logging-out)
* [Change your password](/help/change-your-password)
* [Switching between organizations](/help/switching-between-organizations)
* [Deactivate or reactivate a user](/help/deactivate-or-reactivate-a-user)
* [Deactivate your organization](/help/deactivate-your-organization)
```

--------------------------------------------------------------------------------

---[FILE: deactivate-your-organization.mdx]---
Location: zulip-main/starlight_help/src/content/docs/deactivate-your-organization.mdx

```text
---
title: Deactivate your organization
---

import {SUPPORT_EMAIL} from "astro:env/client";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import OwnerOnly from "../include/_OwnerOnly.mdx";

If you are no longer using a Zulip organization, you can deactivate it. When you
deactivate an organization, you can specify the time period after which the
organization's data will be permanently deleted.

## Deactivate an organization

<OwnerOnly />

<FlattenedSteps>
  <NavigationSteps target="settings/organization-profile" />

  1. Under **Deactivate organization**, click **Deactivate organization**.
  1. Select when the organization's data (users, channels, messages, etc.)
     should be permanently deleted.
  1. Approve by clicking **Confirm**.
</FlattenedSteps>

## Restore a deactivated organization

A deactivated organization can be restored until its data is deleted.
If you deactivated your organization by accident, please contact
<a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> as soon as possible.

## Related articles

* [Deactivate your account](/help/deactivate-your-account)
```

--------------------------------------------------------------------------------

---[FILE: delete-a-message.mdx]---
Location: zulip-main/starlight_help/src/content/docs/delete-a-message.mdx

```text
---
title: Delete a message
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import MessageActions from "../include/_MessageActions.mdx";
import MessageActionsMenu from "../include/_MessageActionsMenu.mdx";
import MessageLongPressMenu from "../include/_MessageLongPressMenu.mdx";

import EditIcon from "~icons/zulip-icon/edit";

Zulip lets you delete the content of your messages or delete messages completely
if these actions are allowed in your organization. Only server administrators
can restore deleted messages.

Organization administrators can
[configure](/help/restrict-message-editing-and-deletion) who can edit and delete
their own messages, and who can delete any message. They can also set time
limits on message editing and deletion.

## Delete message content

Editing a message to delete its content will cause the message to be displayed
as **(deleted)**.  The original sender and timestamp of the message will still
be displayed, and the original content of the message is still accessible via
Zulip's [edit history](/help/view-a-messages-edit-history) feature.  This can be
the best option for avoiding confusion if other users have already responded to
your message.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActions />

      1. Click the **pencil** (<EditIcon />) icon. If you do not see
         the **pencil** (<EditIcon />) icon, you do not have
         permission to delete the content of this message.
      1. Delete the content of the message.
      1. Click **Save**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />

      1. Tap **Edit message**. If you do not see the **Edit message** option,
         you do not have permission to change the content of this message.
      1. Delete the content of the message.
      1. Tap **Save**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Delete a message completely

In some cases, such as when a message accidentally shares secret information, or
contains spam or abuse, it makes sense to delete a message completely. Deleted
messages will immediately disappear from the UI in all official Zulip clients.

Any uploaded files referenced only by deleted messages will be immediately
inaccessible. Note that an uploaded file shared in multiple messages will be
deleted only when *all* of those messages are deleted.

It's important to understand that anyone who received the message
before you deleted it could have made a copy of its content. Even if
no one is online when you send the message, users may have received
the message via email or mobile notifications. So if you
accidentally shared secret information that you can change, like a
password, you may want to change that password regardless of whether
you also delete the message.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActionsMenu />

      1. Select **Delete message**. If you do not see the **Delete message** option,
         you do not have permission to delete this message completely.
      1. Approve by clicking **Confirm**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />

      1. Tap **Delete message**. If you do not see the **Delete message** option,
         you do not have permission to delete this message completely.
      1. Approve by tapping **Delete**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

<ZulipTip>
  You can delete messages sent by [bots that you
  own](/help/view-your-bots) just like messages you sent yourself.
</ZulipTip>

## Restoring deleted messages

For protection against accidental or immediately regretted
deletions, messages deleted directly or via a [message retention
policy](/help/message-retention-policy) are archived for 30 days in a
format that can be restored by a server administrator.  After that
time, they are permanently and irrecoverably deleted from the Zulip
server.  Server administrators can adjust the archival time using
the `ARCHIVED_DATA_VACUUMING_DELAY_DAYS` setting.

## Message notifications

When a message is deleted, any [pending email
notifications](/help/email-notifications#configure-delay-for-message-notification-emails)
for that message will be canceled, and
[mobile](/help/mobile-notifications) and
[desktop](/help/desktop-notifications) notifications will be removed,
including [mentions and alerts](/help/dm-mention-alert-notifications).

## Related articles

* [Delete a topic](/help/delete-a-topic)
* [Archive a channel](/help/archive-a-channel)
* [Message retention policy](/help/message-retention-policy)
* [Edit a message](/help/edit-a-message)
* [Restrict message editing and deletion](/help/restrict-message-editing-and-deletion)
```

--------------------------------------------------------------------------------

---[FILE: delete-a-topic.mdx]---
Location: zulip-main/starlight_help/src/content/docs/delete-a-topic.mdx

```text
---
title: Delete a topic
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import TopicActions from "../include/_TopicActions.mdx";

<AdminOnly />

We generally recommend against deleting topics, but there are a few
situations in which it can be useful:

* Clearing out test messages after setting up an organization.
* Clearing out messages from an overly enthusiastic bot.
* Managing abuse.

In most other cases, [renaming a topic](/help/rename-a-topic) is often a
better idea, or just leaving the topic as is. Deleting a topic can confuse
users who come to the topic later via an email notification.

Note that deleting a topic also deletes every message with that topic,
whereas [archiving a channel](/help/archive-a-channel) does not.

### Delete a topic

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <TopicActions />

      1. Click **Delete topic**.
      1. Approve by clicking **Confirm**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    Access this feature by following the web app instructions in your
    mobile device browser.

    Implementation of this feature in the mobile app is tracked [on
    GitHub](https://github.com/zulip/zulip-flutter/issues/1549). If
    you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>

Note that deleting all of the individual messages within a particular
topic also deletes that topic. Structurally, topics are simply an
attribute of messages in Zulip.

## Related articles

* [Edit a message](/help/edit-a-message)
* [Delete a message](/help/delete-a-message)
* [Archive a channel](/help/archive-a-channel)
* [Message retention policy](/help/message-retention-policy)
```

--------------------------------------------------------------------------------

---[FILE: demo-organizations.mdx]---
Location: zulip-main/starlight_help/src/content/docs/demo-organizations.mdx

```text
---
title: Demo organizations
---

import {Steps} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import OwnerOnly from "../include/_OwnerOnly.mdx";

<ZulipNote>
  **Note:** The ability to create demo organizations is an upcoming
  feature. It is not available yet.
</ZulipNote>

If you would like to try out Zulip without having to make any
decisions (like how to name your organization or whether to import
data from an existing chat tool), you can create a Zulip demo
organization.

Demo organizations differ from a regular Zulip organization in a few
ways:

* A demo organization will be automatically deleted 30 days after
  creation. You can [convert a demo organization into a regular
  organization](#convert-a-demo-organization-to-a-permanent-organization)
  if you'd prefer to keep its history.
* You do not need to choose a URL or when creating a demo organization;
  one will be generated automatically for you.
* A demo organization cannot be directly upgraded to a paid Zulip
  Cloud plan without first converting to a regular organization.

Other than those limitations, they work exactly like a normal Zulip
organization; you can invite additional users, connect the mobile
apps, etc.

## Create a demo organization

<Steps>
  1. Go to zulip.com and click **New organization** in the top-right corner.
</Steps>

## Configure email for demo organization owner

To convert a demo organization to a permanent organization, and to access
certain features like [inviting other users](/help/invite-new-users) and
[configuring authentication methods](/help/configure-authentication-methods),
the creator of the demo organization will need to add an email address
and set a password for their account.

<FlattenedSteps>
  <NavigationSteps target="settings/account-and-privacy" />

  1. Under **Account**, click **Add email**.
  1. Enter your email address.
  1. *(optional)* If the name on the account is still a placeholder,
     edit the **Name** field.
  1. Click **Add**.
  1. You will receive a confirmation email within a few minutes. Open
     it and click **Confirm and set password**.
</FlattenedSteps>

## Convert a demo organization to a permanent organization

<OwnerOnly />

If you'd like to keep your demo organization user and message history,
you can convert it to a permanent Zulip organization. You'll need to
choose a new subdomain for your new permanent organization URL.

Also, as part of the process of converting a demo organization to a
permanent organization:

* Users will be logged out of existing sessions on the web, mobile and
  desktop apps and need to log in again.
* Any [API clients](/api/) or [integrations](/integrations/) will need
  to be updated to point to the new organization URL.

<FlattenedSteps>
  <NavigationSteps target="settings/organization-profile" />

  1. Click the **Convert to make it permanent** link at the end of the
     "This demo organization will be automatically deleted ..." notice.
  1. Enter the subdomain you would like to use for the new organization
     URL and click  **Convert**.
</FlattenedSteps>

<ZulipNote>
  **Note:** You will be logged out when the demo organization is
  successfully converted to a permanent Zulip organization and be
  redirected to new organization URL log-in page.
</ZulipNote>

## Related articles

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Moving to Zulip](/help/moving-to-zulip)
* [Invite users to join](/help/invite-users-to-join)
```

--------------------------------------------------------------------------------

---[FILE: desktop-app-install-guide.mdx]---
Location: zulip-main/starlight_help/src/content/docs/desktop-app-install-guide.mdx

```text
---
title: Installing the Zulip desktop app
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AppWillUpdateTip from "../include/_AppWillUpdateTip.mdx";

The Zulip desktop app comes with native desktop notifications, support for
multiple Zulip accounts, and a dedicated tray icon.

Installing the latest stable release is recommended for most users. For an early
look at the newest features, consider the [beta
releases](#install-a-beta-release).

## Install the latest release

<Tabs>
  <TabItem label="macOS">
    <AppWillUpdateTip />

    #### Disk image *(recommended)*

    <Steps>
      1. Download [Zulip for macOS](https://zulip.com/apps/mac).
      1. Open the file, and drag the app into the **Applications** folder.
    </Steps>

    #### Homebrew

    <Steps>
      1. Run the command `brew install --cask zulip` from a terminal.
      1. Run Zulip from **Applications**.
    </Steps>

    You can run the command `brew upgrade zulip` to immediately upgrade the app.
  </TabItem>

  <TabItem label="Windows">
    #### Web installer *(recommended)*

    <AppWillUpdateTip />

    <Steps>
      1. Download and run [Zulip for Windows](https://zulip.com/apps/windows).
      1. Run Zulip from the **Start** menu.
    </Steps>

    #### Offline installer *(for isolated networks)*

    <ZulipNote>
      The app will not update automatically. You can repeat these steps to upgrade
      to future versions.
    </ZulipNote>

    <Steps>
      1. Download [zulip-x.x.x-x64.msi][latest] for 64-bit desktops
         (common), or [zulip-x.x.x-ia32.msi][latest] for 32-bit (rare).
      1. Copy the installer file to the machine you want to install the app
         on, and open it there.
      1. Run Zulip from the **Start** menu.
    </Steps>
  </TabItem>

  <TabItem label="Linux">
    #### APT *(Ubuntu or Debian)*

    <ZulipTip>
      The app will be updated automatically to future versions when you do a
      regular software update on your system, e.g., with
      `sudo apt update && sudo apt upgrade`.
    </ZulipTip>

    <Steps>
      1. Enter the following commands into a terminal:
         ```bash
         sudo apt install curl
         sudo curl -fL -o /etc/apt/trusted.gpg.d/zulip-desktop.asc \
             https://download.zulip.com/desktop/apt/zulip-desktop.asc
         echo "deb https://download.zulip.com/desktop/apt stable main" | \
             sudo tee /etc/apt/sources.list.d/zulip-desktop.list
         sudo apt update
         sudo apt install zulip
         ```
         These commands set up the Zulip Desktop APT repository and its signing
         key, and then install the Zulip client.
      1. Run Zulip from your app launcher, or with `zulip` from a terminal.
    </Steps>

    #### AppImage *(recommended for all other distros)*

    <AppWillUpdateTip />

    <Steps>
      1. Download [Zulip for Linux](https://zulip.com/apps/linux).
      1. Make the file executable, with
         `chmod a+x Zulip-x.x.x-x86_64.AppImage` from a terminal (replace
         `x.x.x` with the actual app version of the downloaded file).
      1. Run the file from your app launcher, or from a terminal. This file is the
         Zulip app, so no installation is required.
    </Steps>

    #### Snap

    <Steps>
      1. Make sure [snapd](https://docs.snapcraft.io/core/install) is installed.
      1. Execute following command to install Zulip:
         ```bash
         sudo snap install zulip
         ```
      1. Run Zulip from your app launcher, or with `zulip` from a terminal.
    </Steps>

    #### Flathub

    <Steps>
      1. Make sure you have [Flatpak](https://flathub.org/setup) installed on your
         system.
      1. Use the following command from the official
         [Flathub page](https://flathub.org/apps/org.zulip.Zulip) to install Zulip:
         ```bash
         flatpak install flathub org.zulip.Zulip
         ```
      1. After the installation is complete, you can run Zulip using the following
         command:
         ```bash
         flatpak run org.zulip.Zulip
         ```
    </Steps>
  </TabItem>
</Tabs>

## Install a beta release

Get a peek at new features before they're released!

<Tabs>
  <TabItem label="Most systems">
    <AppWillUpdateTip />

    <Steps>
      1. Go to the [Zulip releases][release-list] page on GitHub, and find the latest
         version tagged with the “Pre-release” label.
      1. If there's a **Pre-release** that's more recent than the [latest release][latest],
         download the appropriate Zulip beta installer or app for your system.
      1. To install and run Zulip, refer to the instructions for your operating
         system in the [Install the latest release](#install-the-latest-release)
         section above.
    </Steps>
  </TabItem>

  <TabItem label="Linux with APT">
    <ZulipTip>
      The app will be updated automatically to future versions when you do a
      regular software update on your system, e.g., with
      `sudo apt update && sudo apt upgrade`.
    </ZulipTip>

    #### You don't have the Zulip app installed

    <Steps>
      1. Enter the following commands into a terminal:
         ```bash
         sudo curl -fL -o /etc/apt/trusted.gpg.d/zulip-desktop.asc \
             https://download.zulip.com/desktop/apt/zulip-desktop.asc
         echo "deb https://download.zulip.com/desktop/apt beta main" | \
             sudo tee /etc/apt/sources.list.d/zulip-desktop.list
         sudo apt update
         sudo apt install zulip
         ```
         These commands set up the Zulip Desktop beta APT repository and its signing
         key, and then install the Zulip beta client.
      1. Run Zulip from your app launcher, or with `zulip` from a terminal.
    </Steps>

    #### You already have the Zulip app installed

    <Steps>
      1. Enter the following commands into a terminal:
         ```bash
         sudo sed -i s/stable/beta/ /etc/apt/sources.list.d/zulip-desktop.list
         sudo apt update
         sudo apt install zulip
         ```
         These commands set up the Zulip Desktop beta APT repository, and then
         install the Zulip beta client.
      1. Run Zulip from your app launcher, or with `zulip` from a terminal.
    </Steps>
  </TabItem>
</Tabs>

[latest]: https://github.com/zulip/zulip-desktop/releases/latest

[release-list]: https://github.com/zulip/zulip-desktop/releases

## Related articles

* [Connect through a proxy](/help/connect-through-a-proxy)
* [Use a custom certificate](/help/custom-certificates)
* [View Zulip version](/help/view-zulip-version)
```

--------------------------------------------------------------------------------

````
