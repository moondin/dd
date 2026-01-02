---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 471
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 471 of 1290)

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

---[FILE: restrict-account-creation.mdx]---
Location: zulip-main/starlight_help/src/content/docs/restrict-account-creation.mdx

```text
---
title: Restrict account creation
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import OwnerOnly from "../include/_OwnerOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

<OwnerOnly />

Each Zulip account is associated with an email address. If your organization
allows multiple authentication methods, it doesn't matter which one is used to
create an account. All authentication methods will work for all users in your
organization, provided that they are associated with the account email. To log
in with email, users are required to verify their email account by clicking on a
validation link.

Zulip provides a number of configuration options to control who can create a new
account and how users access their accounts:

* You can [require an invitation](#set-whether-invitations-are-required-to-join)
  to sign up (default), or you can [allow anyone to
  join](#set-whether-invitations-are-required-to-join) without an invitation.
* You can [restrict the ability to invite new
  users](#change-who-can-send-invitations) to any combination of
  [roles](/help/user-roles), [groups](/help/user-groups), and individual
  [users](/help/introduction-to-users).

Regardless of whether invitations are required, you can:

* [Configure allowed authentication
  methods](/help/configure-authentication-methods).
* [Restrict sign-ups to a fixed list of allowed
  domains](#restrict-sign-ups-to-a-list-of-domains)
  (including subdomains). For example, you can require users to sign up with
  the email domain for your business or university.
* Disallow signups with known [disposable email
  address](https://en.wikipedia.org/wiki/Disposable_email_address). This
  is recommended for open organizations to help protect against abuse.

## Set whether invitations are required to join

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Joining the organization**, toggle **Invitations are required for
     joining this organization**.

  <SaveChanges />
</FlattenedSteps>

## Change who can send invitations

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Joining the organization**, configure
     **Who can send email invitations to new users** and
     **Who can create reusable invitation links**.

  <SaveChanges />
</FlattenedSteps>

## Configuring email domain restrictions

Email domain restrictions apply to both new user accounts and [email
changes](/help/change-your-email-address).

### Restrict sign-ups to a list of domains

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Set **Restrict email domains of new users** to
     **Restrict to a list of domains**.
  1. Click **Configure** to add any number of domains. For each domain, you can
     toggle **Allow subdomains**.
  1. When you are done adding domains, click **Close**.

  <SaveChanges />
</FlattenedSteps>

### Don't allow disposable domains

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Set **Restrict email domains of new users** to
     **Don't allow disposable emails**.

  <SaveChanges />
</FlattenedSteps>

### Allow all email domains

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Set **Restrict email domains of new users** to
     **No restrictions**.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [Configure authentication methods](/help/configure-authentication-methods)
* [Invite new users](/help/invite-new-users)
* [Set default channels for new users](/help/set-default-channels-for-new-users)
* [Configure default new user settings](/help/configure-default-new-user-settings)
```

--------------------------------------------------------------------------------

---[FILE: restrict-bot-creation.mdx]---
Location: zulip-main/starlight_help/src/content/docs/restrict-bot-creation.mdx

```text
---
title: Configure who can add bots
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

<AdminOnly />

Zulip lets you create three types of [bots](/help/bots-overview):

* **Incoming webhook bots**, which are limited to only sending messages into Zulip.
* **Generic bots**, which act like a normal user account.
* **Outgoing webhook bots**, which are generic bots that also receive
  new messages via HTTPS POST requests.

You can configure who can create incoming webhook bots (which are more limited
in what they can do), and who can create any bot. Both permissions can be
assigned to any combination of [roles](/help/user-roles), [groups](/help/user-groups), and
individual [users](/help/introduction-to-users).

<ZulipNote>
  These settings only affect new bots. Existing bots will not be
  deactivated.
</ZulipNote>

## Configure who can create bots that can only send messages (incoming webhook bots)

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Other permissions**, configure **Who can create bots that send messages into Zulip**.

  <SaveChanges />
</FlattenedSteps>

## Configure who can create any type of bot

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Other permissions**, configure **Who can create any bot**.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [Bots overview](/help/bots-overview)
* [Integrations overview](/help/integrations-overview)
* [Add a bot or integration](/help/add-a-bot-or-integration)
* [Deactivate or reactivate a bot](/help/deactivate-or-reactivate-a-bot)
* [Incoming webhooks](/api/incoming-webhooks-overview)
* [Outgoing webhooks](/api/outgoing-webhooks)
* [Non-webhook integrations](/api/non-webhook-integrations)
```

--------------------------------------------------------------------------------

---[FILE: restrict-direct-messages.mdx]---
Location: zulip-main/starlight_help/src/content/docs/restrict-direct-messages.mdx

```text
---
title: Restrict direct messages
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

<AdminOnly />

Organization administrators can configure two types of permissions for [direct
messages](/help/direct-messages):

* Who can **authorize** a direct message conversation. To send a DM, the recipients
  must include at least one user who can authorize the conversation (the sender
  or someone else).
* Who can **start** a direct message conversation.

These permissions can be granted to any combination of
[roles](/help/user-roles), [groups](/help/user-groups), and individual
[users](/help/introduction-to-users). They are designed so that users can always
respond to a direct message they've received (unless organization permissions
change). They also provide a lot of flexibility for managing DMs in your
organization. For example, you can:

* Prevent 1:1 DMs between [guest users](/help/guest-users).
* Allow members to respond to DMs from an admin or moderator, but not to start
  DM conversations.
* Disable direct messages altogether.

Regardless of how these settings are configured, users can always send direct messages
to bots and to themselves.

<ZulipTip>
  When restricting direct messages, consider also [restricting who can create
  private channels](/help/configure-who-can-create-channels).
</ZulipTip>

## Configure who can authorize a direct message conversation

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Direct message permissions**, configure **Who can authorize a direct
     message conversation**.

  <SaveChanges />
</FlattenedSteps>

## Configure who can start a direct message conversation

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Direct message permissions**, configure **Who can start a direct
     message conversation**.

  <SaveChanges />
</FlattenedSteps>

## Disable direct messages

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Direct message permissions**, set **Who can authorize a direct
     message conversation** to **Direct messages disabled**.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [Direct messages](/help/direct-messages)
* [Restrict channel creation](/help/configure-who-can-create-channels)
```

--------------------------------------------------------------------------------

---[FILE: restrict-message-edit-history-access.mdx]---
Location: zulip-main/starlight_help/src/content/docs/restrict-message-edit-history-access.mdx

```text
---
title: Restrict message edit history access
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import MessageEditHistoryIntro from "../include/_MessageEditHistoryIntro.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

<AdminOnly />

<MessageEditHistoryIntro />

<ZulipTip>
  You can remove the edit history of a single message by
  [deleting it](/help/delete-a-message#delete-a-message-completely).
</ZulipTip>

## Restrict message edit history access

You can restrict message edit history access to only show moves, or disable it
altogether.

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Message editing**, configure **Allow viewing the history of a
     message?**.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [Restrict message editing and deletion](/help/restrict-message-editing-and-deletion)
* [Restrict moving messages](/help/restrict-moving-messages)
* [Edit a message](/help/edit-a-message)
* [Delete a message](/help/delete-a-message)
* [Move content to another topic](/help/move-content-to-another-topic)
* [Move content to another channel](/help/move-content-to-another-channel)
```

--------------------------------------------------------------------------------

---[FILE: restrict-message-editing-and-deletion.mdx]---
Location: zulip-main/starlight_help/src/content/docs/restrict-message-editing-and-deletion.mdx

```text
---
title: Restrict message editing and deletion
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewPermissions from "../include/_SelectChannelViewPermissions.mdx";

<AdminOnly />

Zulip lets you separately configure permissions for editing and deleting
messages, and you can set time limits for both actions. Regardless of the
configuration you select, message content can only ever be modified by the
original author.

Note that if a user can edit a message, they can also “delete” it by removing
all the message content. This is different from proper message deletion in two
ways: the original content will still show up in [message edit
history](/help/view-a-messages-edit-history), and will be included in
[data exports](/help/export-your-organization). Deletion permanently (and
irretrievably) removes the message from Zulip.

## Configure message editing permissions

<ZulipTip>
  Users can only edit their own messages.
</ZulipTip>

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Message editing**:
     * Toggle **Allow message editing**.
     * Configure **Time limit for editing messages**.

  <SaveChanges />
</FlattenedSteps>

## Configure message deletion permissions

These permissions can be granted to any combination of
[roles](/help/user-roles), [groups](/help/user-groups), and individual
[users](/help/introduction-to-users).

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Message deletion**:
     * Configure **Who can delete any message**.
     * Configure **Who can delete their own messages everywhere**.
     * Configure **Time limit for deleting messages**. This time limit does not
       apply to users who can delete any message.
     * Configure **Who can allow users to delete messages in channels they
       administer**.

  <SaveChanges />
</FlattenedSteps>

<ZulipTip>
  A user can delete messages sent by [bots that they
  own](/help/view-your-bots) just like messages they sent themself.
</ZulipTip>

## Configure who can delete messages in a specific channel

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewPermissions />

      1. Under **Moderation permissions**, configure **Who can delete any message in
         this channel** and **Who can delete their own messages in this channel**.

      <SaveChanges />
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>
</Tabs>

## Related articles

* [Edit a message](/help/edit-a-message)
* [Delete a message](/help/delete-a-message)
* [Delete a topic](/help/delete-a-topic)
* [Restrict message edit history access](/help/restrict-message-edit-history-access)
* [Configure message retention policy](/help/message-retention-policy)
* [Restrict moving messages](/help/restrict-moving-messages)
```

--------------------------------------------------------------------------------

---[FILE: restrict-moving-messages.mdx]---
Location: zulip-main/starlight_help/src/content/docs/restrict-moving-messages.mdx

```text
---
title: Restrict moving messages
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewPermissions from "../include/_SelectChannelViewPermissions.mdx";

Zulip lets you configure who can edit message topics and move topics between
channels. These permissions can be granted to any combination of
[roles](/help/user-roles), [groups](/help/user-groups), and individual
[users](/help/introduction-to-users).

In addition to granting organization-wide permissions, you can configure
permissions for each channel. For example, you could allow the "engineering"
group to move messages just in the #engineering channel.

In general, allowing all organization members to edit message topics is highly
recommended because:

* It allows the community to keep conversations organized, even if some members
  are still learning how to use topics effectively.
* It makes it possible to fix a typo in the topic of a message you just sent.

You can let users edit topics without a time limit, or prohibit topic editing on
older messages to avoid potential abuse. The time limit will never apply to
administrators and moderators.

Permissions for moving messages between channels can be configured separately.

## Configure who can edit topics in any channel

<AdminOnly />

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Moving messages**, configure **Who can edit topics in any channel**.

  <SaveChanges />
</FlattenedSteps>

## Configure who can edit topics in a specific channel

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewPermissions />

      1. Under **Moderation permissions**, configure **Who can move messages inside this
         channel**.

      <SaveChanges />
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>
</Tabs>

## Set a time limit for editing topics

<ZulipTip>
  The time limit you set will not apply to administrators and moderators.
</ZulipTip>

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Moving messages**, configure **Time limit for editing topics**.

  <SaveChanges />
</FlattenedSteps>

## Configure who can move messages out of any channel

<AdminOnly />

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Moving messages**, configure **Who can move messages out of any channel**.

  <SaveChanges />
</FlattenedSteps>

## Configure who can move messages to another channel from a specific channel

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewPermissions />

      1. Under **Moderation permissions**, configure **Who can move messages out of this
         channel**.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Set a time limit for moving messages between channels

<ZulipTip>
  The time limit you set will not apply to administrators and moderators.
</ZulipTip>

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Moving messages**, configure **Time limit for  moving messages
     between channels**.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [Rename a topic](/help/rename-a-topic)
* [Resolve a topic](/help/resolve-a-topic)
* [Move content to another topic](/help/move-content-to-another-topic)
* [Move content to another channel](/help/move-content-to-another-channel)
* [Restrict message editing and deletion](/help/restrict-message-editing-and-deletion)
* [Restrict resolving topics](/help/restrict-resolving-topics)
* [Restrict message edit history access](/help/restrict-message-edit-history-access)
* [User roles](/help/user-roles)
```

--------------------------------------------------------------------------------

---[FILE: restrict-name-and-email-changes.mdx]---
Location: zulip-main/starlight_help/src/content/docs/restrict-name-and-email-changes.mdx

```text
---
title: Restrict name and email changes
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

<AdminOnly />

## Restrict name changes

By default, any user can [change their name](/help/change-your-name).
You can instead prevent users from changing their name. This setting is
especially useful if user names are managed via an external source, and
synced into Zulip via the [Zulip API](/api/), [LDAP][ldap-sync-data] or
another method.

<ZulipTip>
  Organization administrators can always [change anyone's
  name](/help/change-a-users-name).
</ZulipTip>

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **User identity**, select **Prevent users from changing their
     name**.

  <SaveChanges />
</FlattenedSteps>

## Restrict email changes

By default, any user can [change their email address][change-email].
However, you can instead prevent users from changing their email
address. This setting is especially useful for organizations that
are using [LDAP][ldap-sync-data] or another single sign-on solution
to manage user emails.

<ZulipTip>
  Organization administrators can always change their own email
  address.
</ZulipTip>

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **User identity**, select **Prevent users from changing their
     email address**.

  <SaveChanges />
</FlattenedSteps>

## Require unique names

You can require users to choose unique names when joining your organization, or
changing their name. This helps prevent accidental creation of duplicate
accounts, and makes it harder to impersonate other users.

When you turn on this setting, users who already have non-unique names are not
required to change their name.

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **User identity**, select **Require unique names**.

  <SaveChanges />
</FlattenedSteps>

[change-email]: /help/change-your-email-address

[ldap-sync-data]: https://zulip.readthedocs.io/en/stable/production/authentication-methods.html#synchronizing-data
```

--------------------------------------------------------------------------------

---[FILE: restrict-permissions-of-new-members.mdx]---
Location: zulip-main/starlight_help/src/content/docs/restrict-permissions-of-new-members.mdx

```text
---
title: Restrict permissions of new members
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import OwnerOnly from "../include/_OwnerOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

<OwnerOnly />

In large Zulip organizations where
[anyone can join](/help/restrict-account-creation#set-whether-invitations-are-required-to-join), it can
be useful to restrict what new members can do, to make it easier to cope
with spammers and confused users.

Members are **new members** from when they join till when their account ages
past a certain **waiting period** threshold. After that they are **full members**.
You can configure how long the waiting period is, as well as which actions require
being a full member.

For some features, Zulip supports restricting access to only full members. These
features include [creating channels](/help/configure-who-can-create-channels),
[inviting users to the organization](/help/invite-new-users),
[adding custom emoji](/help/custom-emoji#change-who-can-add-custom-emoji),
and many more.

## Set waiting period for new members

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Joining the organization**, configure
     **Waiting period before new members turn into full members**.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [User roles](/help/user-roles)
```

--------------------------------------------------------------------------------

---[FILE: restrict-profile-picture-changes.mdx]---
Location: zulip-main/starlight_help/src/content/docs/restrict-profile-picture-changes.mdx

```text
---
title: Restrict profile picture changes
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

<AdminOnly />

By default, any user can [change their profile picture][change-avatar].
You can instead prevent users from changing their profile picture. This
setting is primarily useful in organizations that are [synchronizing
profile pictures from LDAP][ldap-sync-avatars] or a similar directory.

<ZulipTip>
  Organization administrators can always change their own profile
  picture.
</ZulipTip>

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **User identity**, select **Prevent users from changing their
     avatar**.

  <SaveChanges />
</FlattenedSteps>

[change-avatar]: /help/change-your-profile-picture

[ldap-sync-avatars]: https://zulip.readthedocs.io/en/stable/production/authentication-methods.html#synchronizing-avatars
```

--------------------------------------------------------------------------------

---[FILE: restrict-resolving-topics.mdx]---
Location: zulip-main/starlight_help/src/content/docs/restrict-resolving-topics.mdx

```text
---
title: Restrict resolving topics
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewPermissions from "../include/_SelectChannelViewPermissions.mdx";

Zulip lets you configure who can [mark topics as resolved](/help/resolve-a-topic). This
permission can be granted to any combination of [roles](/help/user-roles),
[groups](/help/user-groups), and individual
[users](/help/introduction-to-users).

## Configure who can resolve topics in any channel

<AdminOnly />

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/organization-permissions" />

      1. Under **Moving messages**, configure **Who can resolve topics**.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Configure who can resolve topics in a specific channel

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewPermissions />

      1. Under **Moderation permissions**, configure **Who can resolve topics in this
         channel**.

      <SaveChanges />
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>
</Tabs>

## Related articles

* [Restrict moving messages](/help/restrict-moving-messages)
* [Resolve a topic](/help/resolve-a-topic)
* [Rename a topic](/help/rename-a-topic)
* [Move content to another topic](/help/move-content-to-another-topic)
* [Move content to another channel](/help/move-content-to-another-channel)
```

--------------------------------------------------------------------------------

---[FILE: restrict-wildcard-mentions.mdx]---
Location: zulip-main/starlight_help/src/content/docs/restrict-wildcard-mentions.mdx

```text
---
title: Restrict wildcard mentions
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

<AdminOnly />

Organization administrators can configure who is allowed to use [wildcard
mentions](/help/dm-mention-alert-notifications#wildcard-mentions) that affect a
large number of users. In particular, an organization can restrict who is
allowed to use `@all` (and, equivalently, `@everyone` and `@channel`) in channels
with more than 15 subscribers, and `@topic` in topics with more than 15
participants.

This permission can be granted to any combination of [roles](/help/user-roles),
[groups](/help/user-groups), and individual [users](/help/introduction-to-users).

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Channel permissions**, configure **Who can notify a large number of
     users with a wildcard mention**.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [DMs, mentions, and alerts](/help/dm-mention-alert-notifications)
```

--------------------------------------------------------------------------------

---[FILE: review-your-settings.mdx]---
Location: zulip-main/starlight_help/src/content/docs/review-your-settings.mdx

```text
---
title: Review your settings
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

We recommend reviewing all of your settings when you start using Zulip, and
then once again a few weeks later once you've gotten a better feel for how
you use Zulip.

## Review your settings

<FlattenedSteps>
  <NavigationSteps target="relative/gear/settings" />

  1. Click on each tab on the left.
</FlattenedSteps>

## Review your preferences

<FlattenedSteps>
  <NavigationSteps target="relative/gear/settings" />

  1. Click on the **Preferences** tab on the left.
</FlattenedSteps>

## Review your privacy settings

<FlattenedSteps>
  <NavigationSteps target="relative/gear/settings" />

  1. Click on the **Account & privacy** tab on the left.
</FlattenedSteps>

## Review your notification settings

<FlattenedSteps>
  <NavigationSteps target="relative/gear/settings" />

  1. Click on the **Notifications** tab on the left.
</FlattenedSteps>

## Related articles

* [Import your settings](/help/import-your-settings)
```

--------------------------------------------------------------------------------

````
