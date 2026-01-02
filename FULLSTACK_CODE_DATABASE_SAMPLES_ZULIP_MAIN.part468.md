---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 468
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 468 of 1290)

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

---[FILE: missing.mdx]---
Location: zulip-main/starlight_help/src/content/docs/missing.mdx

```text
---
title: No such article.
---

No such article.
```

--------------------------------------------------------------------------------

---[FILE: mobile-app-install-guide.mdx]---
Location: zulip-main/starlight_help/src/content/docs/mobile-app-install-guide.mdx

```text
---
title: Installing the Zulip mobile apps
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

Zulip's native Android and iOS apps make it easy to keep up while on the go,
with fully customizable [mobile notifications](/help/mobile-notifications).

Installing the latest stable release is recommended for most users.
For an early look at the newest features, consider the [beta
releases](#install-a-beta-release).

## Install the latest release

<Tabs>
  <TabItem label="Android">
    **Google Play**

    <Steps>
      1. Download [Zulip for Android](https://zulip.com/apps/android).
      1. Open the app on your device.
    </Steps>

    **Download an APK**

    <Steps>
      1. Download [the latest release](https://github.com/zulip/zulip-flutter/releases/latest).
      1. Open the app on your device.
    </Steps>
  </TabItem>

  <TabItem label="iOS">
    <Steps>
      1. Download [Zulip for iOS](https://zulip.com/apps/ios).
      1. Open the app on your device.
    </Steps>
  </TabItem>
</Tabs>

## Install a beta release

Get a peek at new features before they're released!

<Tabs>
  <TabItem label="Android">
    <Steps>
      1. Follow the Google Play instructions above to
         [install the latest release](#install-the-latest-release).
      1. [Join the testing program](https://play.google.com/apps/testing/com.zulipmobile/)
         on Google Play.
    </Steps>
  </TabItem>

  <TabItem label="iOS">
    <Steps>
      1. Install [TestFlight](https://testflight.apple.com/) on your device.
      1. Open [this public invitation link](https://testflight.apple.com/join/ZuzqwXGf)
         on your device.
    </Steps>
  </TabItem>
</Tabs>

## Install the legacy app

Zulip replaced the legacy mobile app with a [new mobile
app](https://blog.zulip.com/2025/06/17/flutter-mobile-app-launched/) in
June 2025. Android users can still install the legacy app, which will
not be updated with bug fixes or new features.

<Tabs>
  <TabItem label="Android">
    **Download an APK**

    <Steps>
      1. Uninstall the Zulip app, if it's already installed.
      1. Download [the legacy app](https://github.com/zulip/zulip-mobile/releases/latest)
         APK file.
      1. Open the APK file, and follow prompts to install it.
    </Steps>
  </TabItem>
</Tabs>

## Related articles

* [Mobile notifications](/help/mobile-notifications)
```

--------------------------------------------------------------------------------

---[FILE: mobile-notifications.mdx]---
Location: zulip-main/starlight_help/src/content/docs/mobile-notifications.mdx

```text
---
title: Mobile notifications
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import AdminOnly from "../include/_AdminOnly.mdx";

Zulip can be configured to send [mobile](/help/mobile-app-install-guide)
notifications for [DMs, mentions, and
alerts](/help/dm-mention-alert-notifications), as well as [channel
messages](/help/channel-notifications) and [followed
topics](/help/follow-a-topic#configure-notifications-for-followed-topics).

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/notifications" />

      1. Toggle the checkboxes in the **Mobile** column of the **Notification
         triggers** table.
    </FlattenedSteps>
  </TabItem>
</Tabs>

[notifications-wildcard-mentions]: /help/dm-mention-alert-notifications#wildcard-mentions

## End-to-end encryption (E2EE) for mobile push notifications

Zulip Server 11.0+ and Zulip Cloud support end-to-end encryption for mobile push
notifications. Support is [coming soon][e2ee-flutter-issue] to the Zulip mobile
app. Once implemented, all push notifications sent from an up-to-date version of
the server to an updated version of the app will be end-to-end encrypted.

[e2ee-flutter-issue]: https://github.com/zulip/zulip-flutter/issues/1764

Organization administrators can require end-to-end encryption for
message content in mobile push notifications. When this setting is
enabled, message content will be omitted when sending notifications to
an app that doesn't support end-to-end encryption. Users will see “New
message” in place of message text. See [technical
documentation](https://zulip.readthedocs.io/en/latest/production/mobile-push-notifications.html#security-and-privacy)
for details.

### Require end-to-end encryption for mobile push notifications

<AdminOnly />

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Notifications security**, toggle
     **Require end-to-end encryption for push notification content**.
</FlattenedSteps>

## Mobile notifications while online

You can customize whether or not Zulip will send mobile push
notifications while you are actively using one of the Zulip apps.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/notifications" />

      1. Under **Mobile message notifications**, toggle
         **Send mobile notifications even if I'm online**, as desired.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Testing mobile notifications

Start by configuring your notifications settings to make it easy to trigger a
notification.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/notifications" />

      1. In the **Mobile** column of the **Notification triggers** table, make sure
         the **DMs, mentions, and alerts** checkbox is checked.
      1. Under **Mobile message notifications**, make sure the **Send mobile
         notifications even if I'm online** checkbox is checked.
    </FlattenedSteps>
  </TabItem>
</Tabs>

Next, test Zulip push notifications on your mobile device.

<Tabs>
  <TabItem label="Mobile">
    <Steps>
      1. [Download](https://zulip.com/apps/) and install the Zulip mobile app if you
         have not done so already.
      1. If your Zulip organization is self-hosted (not at `*.zulipchat.com`),
         [check](/help/mobile-notifications#enabling-push-notifications-for-self-hosted-servers)
         whether push notifications have been set up. If they were set up recently,
         you will need to [log out](/help/logging-out) of your account.
      1. [Log in](/help/logging-in) to the account you want to test.
      1. Ask *another* user (not yourself) to [send you a direct
         message](/help/starting-a-new-direct-message). You should see a Zulip message
         notification in the **notifications area** on your device.
    </Steps>
  </TabItem>
</Tabs>

## Troubleshooting mobile notifications

### Checking your device settings

Some Android vendors have added extra device-level settings that can impact the
delivery of mobile notifications to apps like Zulip. If you're having issues
with Zulip notifications on your Android phone, we recommend Signal's excellent
[troubleshooting guide](https://support.signal.org/hc/en-us/articles/360007318711-Troubleshooting-Notifications#android_notifications_troubleshooting),
which explains the notification settings for many popular Android vendors.

Android users using microG: we have heard reports of notifications working
if microG's "Cloud Messaging" setting is enabled.

### Enabling push notifications for self-hosted servers

<ZulipNote>
  These instructions do not apply to Zulip Cloud organizations (`*.zulipchat.com`).
</ZulipNote>

To enable push notifications for your organization:

<Steps>
  1. Your server administrator needs to register your Zulip server with the
     [Zulip Mobile Push Notification
     Service](https://zulip.readthedocs.io/en/stable/production/mobile-push-notifications.html).
  1. For organizations with more than 10 users, an
     [owner](/help/user-roles) or billing administrator needs to sign
     up for a [plan](https://zulip.com/plans/#self-hosted) for your organization.
</Steps>

## Related articles

* [Mobile app installation guides](/help/mobile-app-install-guide)
* [Channel notifications](/help/channel-notifications)
* [DMs, mentions, and alerts](/help/dm-mention-alert-notifications)
* [Email notifications](/help/email-notifications)
* [Desktop notifications](/help/desktop-notifications)
* [Do not disturb](/help/do-not-disturb)
* [Hide message content in emails](/help/hide-message-content-in-emails)
```

--------------------------------------------------------------------------------

---[FILE: moderating-open-organizations.mdx]---
Location: zulip-main/starlight_help/src/content/docs/moderating-open-organizations.mdx

```text
---
title: Community moderation toolkit
---

import CommunitiesDirectoryIntro from "../include/_CommunitiesDirectoryIntro.mdx";
import WebPublicChannelsIntro from "../include/_WebPublicChannelsIntro.mdx";

Zulip offers a comprehensive toolkit for moderating communities.

## Prevention

Zulip has many features designed to simplify moderation by preventing
problematic behavior.

### Manage new users

* Decide whether to [allow anyone to create an
  account](/help/restrict-account-creation#set-whether-invitations-are-required-to-join),
  or require invitations to join.
* Link to a code of conduct in your [organization
  description](/help/create-your-organization-profile) (displayed on the
  registration page) and [custom welcome
  message](/help/configure-a-custom-welcome-message).
* [Disallow disposable email
  addresses](/help/restrict-account-creation#dont-allow-disposable-domains)
  or [limit authentication
  methods](/help/configure-authentication-methods) to increase the
  effort for a bad actor to replace a banned account.
* Add a [waiting period](/help/restrict-permissions-of-new-members) before
  new users can take disruptive actions.
* Monitor new users by enabling [new user
  announcements](/help/configure-automated-notices#new-user-announcements).

### Restrict permissions for making changes

* Restrict who can [create channels](/help/configure-who-can-create-channels), or
  monitor new channels by enabling [new channel
  announcements](/help/configure-automated-notices#new-channel-announcements).
* Restrict who can [add custom emoji](/help/custom-emoji#change-who-can-add-custom-emoji).
* Restrict who can [move messages to another
  channel](/help/restrict-moving-messages#configure-who-can-move-messages-out-of-any-channel),
  and set a [time
  limit](/help/restrict-moving-messages#set-a-time-limit-for-editing-topics) for
  editing topics.
* Restrict who can
  [edit](/help/restrict-message-editing-and-deletion#configure-message-editing-permissions)
  and
  [delete](/help/restrict-message-editing-and-deletion#configure-message-deletion-permissions)
  messages, and set time limits on message editing and deletion.
* If you are concerned about impersonation, you can [prevent users from changing
  their name](/help/restrict-name-and-email-changes#restrict-name-changes), or
  [require unique
  names](/help/restrict-name-and-email-changes#require-unique-names).

### Minimize spam

* [Configure email visibility](/help/configure-email-visibility)
  to prevent off-platform spam.
* [Restrict wildcard mentions](/help/restrict-wildcard-mentions)
  so only [moderators](/help/user-roles) can mention everyone in your organization.
* Create a [default channel](/help/set-default-channels-for-new-users)
  for announcements where [only admins can
  post](/help/channel-posting-policy).
* Configure who can [authorize and start](/help/restrict-direct-messages) direct
  message conversations.

## Response

The following features are an important part of an organization's
playbook when responding to abuse or spam that is not prevented by the
organization's policy choices.

* [Enable moderation requests](/help/enable-moderation-requests) to make it easy
  to [report](/help/report-a-message) problematic messages to community
  moderators.
* Individual users can [mute abusive users](/help/mute-a-user) to stop
  harassment that moderators have not yet addressed, or [collapse
  individual messages](/help/collapse-a-message) that they don't want
  to see.
* [Ban (deactivate) users](/help/deactivate-or-reactivate-a-user) acting in bad
  faith. They will not be able to rejoin using the same email address, unless
  their account is reactivated by an administrator.
* Investigate behavior by [viewing messages sent by a
  user](/help/view-messages-sent-by-a-user).
* [Delete messages](/help/delete-a-message#delete-a-message-completely),
  [archive channels](/help/archive-a-channel), and
  [unsubscribe users from channels](/help/unsubscribe-users-from-a-channel).
* [Move topics](/help/rename-a-topic), including between channels, when
  users start conversations in the wrong place.
* [Change users' names](/help/change-a-users-name) (e.g., to "Name (Spammer)")
  for users who sent spam direct messages to many community members.
* [Deactivate bots](/help/deactivate-or-reactivate-a-bot) or
  [deactivate custom emoji](/help/custom-emoji#deactivate-custom-emoji).

## Public access option

<WebPublicChannelsIntro />

## Zulip communities directory

<CommunitiesDirectoryIntro />

For details on how to get your community listed, see [Communities
directory](/help/communities-directory).

## Related articles

* [Moving to Zulip](/help/moving-to-zulip)
* [Moving from Discord](/help/moving-from-discord)
* [Public access option](/help/public-access-option)
* [Communities directory](/help/communities-directory)
```

--------------------------------------------------------------------------------

---[FILE: move-content-to-another-channel.mdx]---
Location: zulip-main/starlight_help/src/content/docs/move-content-to-another-channel.mdx

```text
---
title: Move content to another channel
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import MessageActionsMenu from "../include/_MessageActionsMenu.mdx";
import TopicActions from "../include/_TopicActions.mdx";

Zulip makes it possible to move messages, or an entire topic, to another
channel. Organization administrators can
[configure](/help/restrict-moving-messages) who can move messages between
channels.

To help others find moved content, you can have Notification Bot send
automated notices to the source topic, the destination topic, or both.
These notices include:

* A link to the source or destination topic.
* How many messages were moved, or whether the whole topic was moved.
* Who moved the content.

## Move a topic to another channel

<FlattenedSteps>
  <TopicActions />

  1. Select **Move topic**. If you do not see this option, you do not have permission
     to move this topic.
  1. Select the destination channel for the topic from the channels dropdown list.
  1. *(optional)* Change the topic name.
  1. Toggle whether automated notices should be sent.
  1. Click **Confirm** to move the topic to another channel.
</FlattenedSteps>

<ZulipNote>
  **Note**: When a topic is moved to a private channel with protected history,
  messages in the topic will be visible to all the subscribers.
</ZulipNote>

## Move messages to another channel

<FlattenedSteps>
  <MessageActionsMenu />

  1. Select **Move messages**. If you do not see this option, you do not have permission
     to move this message.
  1. Select the destination channel from the channels dropdown list. If
     the channel input is disabled, you do not have permission to move
     this message to a different channel.
  1. *(optional)* Change the topic name.
  1. From the dropdown menu, select which messages to move.
  1. Toggle whether automated notices should be sent.
  1. Click **Confirm** to move the selected content to another channel.
</FlattenedSteps>

<ZulipNote>
  **Note**: You cannot edit content of a message while changing its channel.
</ZulipNote>

## Moving content to private channels

Access to messages moved to another channel will immediately be controlled by the
access policies for the destination channel. Content moved to a private channel will
thus appear to be deleted to users who are not subscribers of the destination channel.

Content moved to a [private channel with protected
history](/help/channel-permissions#private-channels) will only be accessible to
users who both:

* Were subscribed to the *original* channel when the content was *sent*.
* Are subscribed to the *destination* channel when the content is *moved*.

## Moving content out of private channels

In [private channels with protected
history](/help/channel-permissions#private-channels), Zulip determines whether
to treat the entire topic as moved using the access permissions of the user
requesting the topic move. This means that the automated notices sent by
Notification Bot will report that the entire topic was moved if the requesting
user moved every message in the topic that they can access, regardless of
whether older messages exist that they cannot access.

Similarly, [muted topics](/help/mute-a-topic) will be migrated to the
new channel and topic if the requesting user moved every message in the
topic that they can access.

This model ensures that the topic editing feature cannot be abused to
determine any information about the existence of messages or topics
that one does not have permission to access.

## Related articles

* [Rename a topic](/help/rename-a-topic)
* [Move content to another topic](/help/move-content-to-another-topic)
* [Restrict moving messages](/help/restrict-moving-messages)
```

--------------------------------------------------------------------------------

---[FILE: move-content-to-another-topic.mdx]---
Location: zulip-main/starlight_help/src/content/docs/move-content-to-another-topic.mdx

```text
---
title: Move content to another topic
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import MessageActionsMenu from "../include/_MessageActionsMenu.mdx";

Zulip makes it possible to move messages between topics. This is
useful for keeping messages organized when there is a digression, or
the discussion shifts from the original topic. You can also [rename a
topic](/help/rename-a-topic).

When messages are moved, Zulip's [permanent links to messages in
context](/help/link-to-a-message-or-conversation#get-a-link-to-a-specific-message)
will automatically redirect to the new location of the message. [Muted
topics](/help/mute-a-topic) are automatically migrated when an entire
topic is moved.

Organization administrators can [configure](/help/restrict-moving-messages) who
is allowed to move messages.

## Move messages to another topic

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActionsMenu />

      1. Select **Move messages**. If you do not see this option, you do not have permission
         to move this message.
      1. Set the destination topic.
      1. From the dropdown menu, select which messages to move.
      1. Toggle whether automated notices should be sent.
      1. Click **Confirm** to move the selected content to another topic.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Rename a topic](/help/rename-a-topic)
* [Move content to another channel](/help/move-content-to-another-channel)
* [Restrict moving messages](/help/restrict-moving-messages)
```

--------------------------------------------------------------------------------

---[FILE: move-to-zulip-cloud.mdx]---
Location: zulip-main/starlight_help/src/content/docs/move-to-zulip-cloud.mdx

```text
---
title: Move from self-hosting to Zulip Cloud
---

import {Steps} from "@astrojs/starlight/components";

import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdvantagesOfZulipCloud from "../include/_AdvantagesOfZulipCloud.mdx";

With Zulip's high quality import and export tools, you can always
move from self-hosting your own Zulip server to using the Zulip
Cloud service (and [back](/help/cloud-to-self-hosting)).

## Process overview

To move your Zulip organization from a self-hosted server to Zulip
Cloud, you will need to take the following steps, which are described
in more detail below:

<Steps>
  1. [Plan the process and coordinate with Zulip support](#plan-the-process-and-coordinate-with-zulip-support).
  1. [Upgrade your self-hosted server](#upgrade-your-self-hosted-server).
  1. [Export organization data](#export-organization-data).
  1. [Decide how users will log in](#decide-how-users-will-log-in).
</Steps>

## Plan the process and coordinate with Zulip support

To import your self-hosted organization into Zulip Cloud, your server will need
to have the same database format as Zulip Cloud. Zulip Cloud is updated every
couple of weeks, so it's important to coordinate the timing with Zulip's support
team.

<Steps>
  1. Review the process described on this page, and decide when you will be ready
     to make the transition.
  1. Email [support@zulip.com](mailto:support@zulip.com) with the following information:
     * URL of the organization you plan to migrate
     * Your estimated timeline for generating a data export
     * Any other timing considerations for the transition (e.g., time of day)
     * If you're planning to purchase the [Zulip Cloud Plus
       plan](https://zulip.com/plans), details on the Plus plan features (e.g.,
       authentication methods) you intend to use. These features will be
       configured for your organization as part of the import process.
</Steps>

Zulip's support team will coordinate with you to make the transition with
minimal disruption for your team.

## Upgrade your self-hosted server

You will need to upgrade your server to use the same database format
as Zulip Cloud, using the published `zulip-cloud-current` branch.

<Steps>
  1. [Check](/help/view-zulip-version#view-zulip-server-and-web-app-version) your
     Zulip server version.
  1. [Upgrade to the latest maintenance
     release](https://zulip.readthedocs.io/en/stable/production/upgrade.html#upgrading-to-a-release)
     if you are running an older version of the Zulip server.
  1. [Upgrade](https://zulip.readthedocs.io/en/stable/production/upgrade.html#upgrading-from-a-git-repository)
     to the `zulip-cloud-current` branch.
</Steps>

For additional support with upgrading from an older version of Zulip, contact
[sales@zulip.com](mailto:sales@zulip.com) for paid support options.

## Export organization data

<Steps>
  1. Make sure you [have a
     plan](#plan-the-process-and-coordinate-with-zulip-support) for when the
     import into Zulip Cloud will take place.
  1. Announce the migration and schedule Zulip downtime for your team.
  1. [Follow these instructions](https://zulip.readthedocs.io/en/stable/production/export-and-import.html#data-export)
     to export your Zulip data.
  1. Send an email to [support@zulip.com](mailto:support@zulip.com) with:
     * Your data export file (`.tar.gz` format).
     * The subdomain you would like to use for your organization. Your Zulip
       Cloud organization will be hosted at `<subdomain>.zulipchat.com`.
</Steps>

Zulip's support team will let you know when the data import process is complete.

## Decide how users will log in

When user accounts are imported, users initially do not have passwords
configured. There are a few options for how users can log in for the first time.

<ZulipTip>
  For security reasons, passwords are never exported.
</ZulipTip>

### Allow users to log in with non-password authentication

Users will immediately be able to log in with [authentication
methods](/help/configure-authentication-methods) that do not require a password,
if these [authentication methods](/help/configure-authentication-methods) are
enabled.

### Send password reset emails to all users

You can ask [support@zulip.com](mailto:support@zulip.com) to send password reset
emails to all users in your organization, which will allow them to set an
initial password.

<ZulipNote>
  To avoid confusion, first make sure that the users in your
  organization are aware that their account has been moved,
  and are expecting to receive a password reset email.
</ZulipNote>

### Manual password resets

Alternatively, users can reset their own passwords by following the instructions
on your Zulip organization's login page.

## Advantages of Zulip Cloud

<AdvantagesOfZulipCloud />

## Related articles

* [Choosing between Zulip Cloud and self-hosting](/help/zulip-cloud-or-self-hosting)
* [Zulip Cloud billing](/help/zulip-cloud-billing)
* [Upgrade Zulip server](https://zulip.readthedocs.io/en/stable/production/upgrade.html)
* [Export your organization](/help/export-your-organization)
* [Zulip data export tool][data-export]
* [Move from Zulip Cloud to self-hosting](/help/cloud-to-self-hosting)

[data-export]: https://zulip.readthedocs.io/en/stable/production/export-and-import.html#data-export
```

--------------------------------------------------------------------------------

---[FILE: moving-from-discord.mdx]---
Location: zulip-main/starlight_help/src/content/docs/moving-from-discord.mdx

```text
---
title: Moving from Discord
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

<MovingToZulipIntro />

The following steps are described in more detail below:

<Steps>
  1. [Create your organization](#create-your-organization).
  1. [Sign up for a plan](#sign-up-for-a-plan).
  1. [Configure your organization](#configure-your-organization).
  1. [Review and update communication
     policies](#review-and-update-communication-policies).
  1. [Prepare users for the transition](#prepare-users-for-the-transition).
  1. [Invite users to join](#invite-users-to-join).
</Steps>

Each organization is unique, but we hope these common practices will help you
think through the transition process in your own context.

## Create your organization

<CreateOrgNoImport />

## Sign up for a plan

<SignUpForAPlan />

## Configure your organization

<Steps>
  1. [Create your organization profile](/help/create-your-organization-profile),
     which is displayed on your organization's registration and login pages.
  1. [Create user groups](/help/create-user-groups) corresponding to roles in
     your Discord.
  1. Review [organization permissions](/help/manage-permissions), such as who
     can invite users, create channels, etc. Use groups to recreate role-based
     permissions.
  1. If your organization uses an issue tracker (e.g., GitHub, Salesforce,
     Zendesk, Jira, etc.), configure [linkifiers](/help/add-a-custom-linkifier) to
     automatically turn issue numbers (e.g., #2468) into links.
  1. Set up [custom profile fields](/help/custom-profile-fields), which make it
     easy for users to share information, such as their pronouns, job title, or
     team.
  1. Review [default user settings](/help/configure-default-new-user-settings),
     including language, [default visibility for email
     addresses](/help/configure-email-visibility), and notification preferences.
  1. [Create channels](/help/create-channels). Zulip's
     [topics](/help/introduction-to-topics) give each conversation its own
     space, so you likely need fewer channels than in Discord.
  1. To recreate your Discord bots in Zulip, check out Zulip's [native
     integrations](/integrations), and the [guide](/api/writing-bots) on writing
     your own interactive bots.
</Steps>

## Review and update communication policies

<CommunicationPoliciesIntro />

<FlattenedList>
  <CommunicationPoliciesList />

  * If you've been maintaining a forum in addition to your Discord server, it's
    common to discontinue it when moving to Zulip. Conversations in Zulip are
    organized enough to fulfill the role of a forum, and can be
    [configured](/help/public-access-option) for public access if desired.
  * Zulip makes it easy to find conversations and follow up, so you may be able to
    reduce your reliance on @-mentions. [Silent
    mentions](/help/mention-a-user-or-group#silently-mention-a-user) make it easy
    to refer to someone without calling for their attention.
  * Because in Zulip messages are organized by topic, it’ll generally be clear
    what you’re responding to when you send a message. Consider encouraging users
    to simply send messages to the appropriate topic, rather than
    [replying](/help/replying-to-messages) as in Discord.
  * If moving a community, be sure to check out Zulip's [community moderation
    toolkit](/help/moderating-open-organizations).
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

* [Trying out Zulip](/help/trying-out-zulip)
* [Zulip Cloud or self-hosting?](/help/zulip-cloud-or-self-hosting)
* [Moving to Zulip](/help/moving-to-zulip)
* [Migrating from other chat tools](/help/migrating-from-other-chat-tools)
* [Getting started with Zulip](/help/getting-started-with-zulip)
```

--------------------------------------------------------------------------------

---[FILE: moving-from-slack.mdx]---
Location: zulip-main/starlight_help/src/content/docs/moving-from-slack.mdx

```text
---
title: Moving from Slack
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedList from "../../components/FlattenedList.astro";
import FlattenedSteps from "../../components/FlattenedSteps.astro";
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

You can import your organization's Slack data, including message history, users,
channels, and custom emoji. Data is imported into Zulip as a new organization,
so the best time to import is when your team is about to start using Zulip for
day-to-day work. This may be part of your evaluation process, or after you've
made the decision to move to Zulip.

<Tabs>
  <TabItem label="Import from Slack">
    <Steps>
      1. If you plan to self-host, [set up your Zulip
         server](https://zulip.readthedocs.io/en/stable/production/install.html). You
         can self-host Zulip directly on Ubuntu or Debian Linux, in
         [Docker](https://github.com/zulip/docker-zulip), or with prebuilt images for
         [Digital Ocean](https://marketplace.digitalocean.com/apps/zulip) and
         [Render](https://render.com/docs/deploy-zulip).
      1. Follow the steps in the [Slack import guide](/help/import-from-slack).
    </Steps>
  </TabItem>

  <TabItem label="Create a new organization">
    <Steps>
      1. If you plan to self-host, [set up your Zulip
         server](https://zulip.readthedocs.io/en/stable/production/install.html). You
         can self-host Zulip directly on Ubuntu or Debian Linux, in
         [Docker](https://github.com/zulip/docker-zulip), or with prebuilt images for
         [Digital Ocean](https://marketplace.digitalocean.com/apps/zulip) and
         [Render](https://render.com/docs/deploy-zulip).
      1. Create a Zulip organization [on Zulip Cloud](https://zulip.com/new/) or
         [on your self-hosted
         server](https://zulip.readthedocs.io/en/stable/production/install.html#step-3-create-a-zulip-organization-and-log-in).
         You can create a new Zulip Cloud organization in less than two minutes.
         Setting up a self-hosted server will take a bit longer, but is easy to
         do with Zulip's [robust
         installer](https://zulip.readthedocs.io/en/stable/production/install.html).
    </Steps>
  </TabItem>
</Tabs>

## Sign up for a plan

<SignUpForAPlan />

## Configure your organization

<FlattenedSteps>
  <ConfigureYourOrganization />

  1. [Create channels](/help/create-channels) if you decided not to import your
     Slack workspace. Zulip's [topics](/help/introduction-to-topics) give each
     conversation its own space, so one channel per team should be enough to get
     you started.
  1. Move your integrations using Zulip's [Slack-compatible incoming
     webhook](/integrations/slack_incoming). You can transition to
     Zulip-native [integrations](/integrations) over time.
</FlattenedSteps>

## Review and update communication policies

<CommunicationPoliciesIntro />

<FlattenedList>
  <CommunicationPoliciesList />

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
     guide](/help/getting-started-with-zulip), and [the guide on how threading
     works in Zulip](/help/introduction-to-topics#what-about-threads) for folks
     who are used to Slack's threads.

  <PrepareForTransition2 />
</FlattenedSteps>

## Invite users to join

If you imported your organization from Slack, [decide how users will log
in](/help/import-from-slack#decide-how-users-will-log-in) for the first time.
Otherwise:

<Tabs>
  <HowToInviteUsersToJoinImport />

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
* [Slack-compatible incoming webhook](/integrations/slack_incoming)
* [Trying out Zulip](/help/trying-out-zulip)
* [Zulip Cloud or self-hosting?](/help/zulip-cloud-or-self-hosting)
* [Moving to Zulip](/help/moving-to-zulip)
* [Migrating from other chat tools](/help/migrating-from-other-chat-tools)
* [Getting started with Zulip](/help/getting-started-with-zulip)
```

--------------------------------------------------------------------------------

````
