---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 477
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 477 of 1290)

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

---[FILE: _ChangePasswordAndAPIKey.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ChangePasswordAndAPIKey.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";

<FlattenedSteps>
  <NavigationSteps target="settings/account-and-privacy" />

  1. Under **Account**, click **Change your password**.
  1. Enter your old password and your new password, and click **Change**.
  1. Under **API key**, click **Manage your API key**.
  1. Enter your new password, and click **Get API key**.
  1. Click **Generate new API key**.
</FlattenedSteps>

<ZulipTip>
  If you've forgotten your password, you can [reset
  it](/help/change-your-password#if-youve-forgotten-or-never-had-a-password)
  using your email account.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _ChangePasswordViaEmailConfirmation.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ChangePasswordViaEmailConfirmation.mdx

```text
import {Steps} from "@astrojs/starlight/components";

<Steps>
  1. If you are logged in, start by [logging out](/help/logging-out).
  1. Go to your organization's login page at `https://<organization-url>/login/`.
  1. Click the **Forgot your password?** link below the **Log in** button or
     buttons.
  1. Enter your email address, and click **Send reset link**.
  1. You will receive a confirmation email within a few minutes. Open it and click
     **Reset password**.
</Steps>
```

--------------------------------------------------------------------------------

---[FILE: _ChannelActions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ChannelActions.mdx

```text
import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";

1. Hover over a channel in the left sidebar.
1. Click on the **ellipsis** (<MoreVerticalIcon />).
```

--------------------------------------------------------------------------------

---[FILE: _ChannelAdminPermissions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ChannelAdminPermissions.mdx

```text
Organization administrators and [channel
administrators](/help/configure-who-can-administer-a-channel) can see and manage
metadata for private channels. However, if they aren't subscribed to a private
channel, they cannot gain access to its content, or grant access to others,
unless specifically permitted to do so.

This means organization administrators and [channel
administrators](/help/configure-who-can-administer-a-channel) can:

* See and modify the channel's [name](/help/rename-a-channel) and [description](/help/change-the-channel-description).
* See who is subscribed to the channel, and
  [unsubscribe](/help/unsubscribe-users-from-a-channel) them.
* Move the channel to another [folder](/help/channel-folders).
* See the channel's permissions settings, and modify settings that do not affect
  content access (e.g., [who can post](/help/channel-posting-policy) or [message
  retention policy](/help/message-retention-policy)).
* See how much message traffic the channel gets (but not its contents).
* [Archive](/help/archive-a-channel) the channel.

However, the following actions require specific permissions.

* **Seeing messages and topics**: Restricted to channel subscribers, and user
  who are allowed to subscribe themselves or any user.
* Subscribing [yourself](/help/configure-who-can-subscribe) or [other
  users](/help/configure-who-can-invite-to-channels)
* Modifying settings that affect content access (e.g., making a channel
  public, or changing who can add subscribers).
```

--------------------------------------------------------------------------------

---[FILE: _ChannelFoldersIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ChannelFoldersIntro.mdx

```text
Organizations can sort channels into folders. For example, you can put all the
channels associated with a team into a dedicated folder. Users can decide
whether to group channels by folder in the [**Inbox**](/help/inbox) view and
the [left sidebar](/help/left-sidebar).

Everyone can [pin channels](/help/pin-a-channel) they personally want to pay
close attention to. Pinned channels appear in a dedicated **pinned channels**
section above channel folders.

Folders that only contain [inactive](/help/manage-inactive-channels) and
[muted](/help/mute-a-channel) channels are sorted at the bottom.
```

--------------------------------------------------------------------------------

---[FILE: _ChannelLongPressMenu.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ChannelLongPressMenu.mdx

```text
1. Press and hold a channel until the long-press menu appears.
```

--------------------------------------------------------------------------------

---[FILE: _ChannelLongPressMenuTip.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ChannelLongPressMenuTip.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

<ZulipTip>
  If you are in a channel view, you can access the long-press
  menu from the bar at the top of the app.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _ChannelNameLongPressMenu.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ChannelNameLongPressMenu.mdx

```text
1. Press and hold a channel name until the long-press menu appears.
```

--------------------------------------------------------------------------------

---[FILE: _ChannelNameLongPressMenuTip.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ChannelNameLongPressMenuTip.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

<ZulipTip>
  You can also press and hold the name of a channel in Inbox and channel views
  to access the long-press menu.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _ChannelPrivacyTypes.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ChannelPrivacyTypes.mdx

```text
import GlobeIcon from "~icons/zulip-icon/globe";
import HashtagIcon from "~icons/zulip-icon/hashtag";
import LockIcon from "~icons/zulip-icon/lock";

There are three types of channels in Zulip:

* [Private channels](/help/channel-permissions#private-channels)
  (indicated by <LockIcon />), where
  joining and viewing messages requires being invited. You can choose
  whether new subscribers can see messages sent before they were
  subscribed.
* [Public channels](/help/channel-permissions#public-channels)
  (indicated by <HashtagIcon />), which
  are open to everyone in your organization other than guests.
* [Web-public channels](/help/channel-permissions#web-public-channels)
  (indicated by <GlobeIcon />), where
  anyone on the Internet can see messages without creating an account.
```

--------------------------------------------------------------------------------

---[FILE: _ChannelSettingsNavbarTip.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ChannelSettingsNavbarTip.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";

<ZulipTip>
  You can also click on a channel name in the navigation bar at the top of the
  app to access its settings, or use the **ellipsis** (<MoreVerticalIcon />)
  next to the channel name in the left sidebar.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _ChannelsIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ChannelsIntro.mdx

```text
Channels organize conversations based on who needs to see them. For example,
it's common to have a channel for each team in an organization. Because Zulip
further organizes messages into conversations labeled with
[topics](/help/introduction-to-topics), there is generally no need to create
dedicated channels for specific projects.
```

--------------------------------------------------------------------------------

---[FILE: _ClearStatus.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ClearStatus.mdx

```text
import XCircleIcon from "~icons/zulip-icon/x-circle";

1. Click on the <XCircleIcon /> to the
   right of your current status.
```

--------------------------------------------------------------------------------

---[FILE: _CloudPaidPlansOnly.mdx]---
Location: zulip-main/starlight_help/src/content/include/_CloudPaidPlansOnly.mdx

```text
import ZulipNote from "../../components/ZulipNote.astro";

<ZulipNote>
  Zulip Cloud customers who wish to use this feature must upgrade to
  [Zulip Cloud Standard](https://zulip.com/plans/) or [Zulip Cloud
  Plus](https://zulip.com/plans/).
</ZulipNote>
```

--------------------------------------------------------------------------------

---[FILE: _CloudPlusOnly.mdx]---
Location: zulip-main/starlight_help/src/content/include/_CloudPlusOnly.mdx

```text
import ZulipNote from "../../components/ZulipNote.astro";

<ZulipNote>
  Zulip Cloud customers who wish to use this feature must upgrade to
  the [Zulip Cloud Plus](https://zulip.com/plans/) plan.
</ZulipNote>
```

--------------------------------------------------------------------------------

---[FILE: _CodeBlocksExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_CodeBlocksExamples.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

### What you type

 ````
Inline code span: `let x = 5`

Code block:
```
def f(x):
   return x+1
```

Syntax highlighting:
```python
def fib(n):
    # TODO: base case
    return fib(n-1) + fib(n-2)
```
 ````

<ZulipTip>
  You can also use `~~~` to start code blocks, or just indent the code 4 or more
  spaces.
</ZulipTip>

### What it looks like

![Markdown code](../../images/markdown-code.png)

A widget in the top right corner of code blocks allows you to easily
copy code to your clipboard.
```

--------------------------------------------------------------------------------

---[FILE: _CodeBlocksIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_CodeBlocksIntro.mdx

```text
You can write snippets of code, code blocks, and other text in a fixed-width
font using standard Markdown formatting. Zulip also has [syntax
highlighting](/help/code-blocks#language-tagging) and supports configuring
custom [code playgrounds](/help/code-blocks#code-playgrounds).
```

--------------------------------------------------------------------------------

---[FILE: _CombinedFeed.mdx]---
Location: zulip-main/starlight_help/src/content/include/_CombinedFeed.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import GoToCombinedFeed from "../include/_GoToCombinedFeed.mdx";

import AllMessagesIcon from "~icons/zulip-icon/all-messages";

The **Combined feed** view is a feed of all the unmuted messages you have
received, which combines channel messages and direct messages. It's a great way
to see new messages as they come in.

You can configure **Combined feed** to be the [home
view](/help/configure-home-view) for the Zulip web app.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToCombinedFeed />
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <Steps>
      1. Tap the **Combined feed**
         (<AllMessagesIcon />)
         tab at the bottom of the app.
    </Steps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _CommunicationPoliciesIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_CommunicationPoliciesIntro.mdx

```text
Consider updating your organization's communication policies and practices to
take advantage of Zulip's organized conversations:
```

--------------------------------------------------------------------------------

---[FILE: _CommunicationPoliciesList.mdx]---
Location: zulip-main/starlight_help/src/content/include/_CommunicationPoliciesList.mdx

```text
* Many organizations find that with Zulip, there’s no longer a reason to use
  email for internal communications. You get the organization of an email
  [inbox](/help/inbox) together with all the features of a modern chat app,
  like instant delivery of messages, emoji reactions, typing notifications,
  @-mentions, and more.
* Because Zulip further organizes messages into conversations labeled with
  [topics](/help/introduction-to-topics), there is generally no need to create
  dedicated channels for specific projects.
* With conversations organized by topic, you can review prior discussions to
  understand past work, explanations, and decisions — your chat history
  becomes a knowledge base. Should it be standard practice to link to Zulip
  conversations from docs, issue trackers, etc. for additional context?
* Using Zulip, you can discuss complex topics and make decisions with input
  from all stakeholders, without the overhead of scheduling meeting. Are
  there standing meetings you might not need? For example, stand-ups can be
  replaced with dedicated check-in topics for each team member.
```

--------------------------------------------------------------------------------

---[FILE: _CommunitiesDirectoryInstructions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_CommunitiesDirectoryInstructions.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import SaveChanges from "../include/_SaveChanges.mdx";

<FlattenedSteps>
  <NavigationSteps target="settings/organization-profile" />

  1. To be listed in the appropriate category, under **Organization type**, select
     the option that best fits your organization.
  1. Toggle **Advertise organization in the Zulip communities
     directory**.

  <SaveChanges />
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: _CommunitiesDirectoryIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_CommunitiesDirectoryIntro.mdx

```text
The [Zulip communities directory](https://zulip.com/communities/) offers
publicly accessible [Zulip Cloud][zulip-cloud] organizations an opportunity to
be listed on the [Zulip website](https://zulip.com). It's a way for [open-source
projects](https://zulip.com/for/open-source/), [research
communities](https://zulip.com/for/research/), and
[others](https://zulip.com/for/communities/) to advertise their Zulip community
and support the Zulip project.

The directory will display your community's name, logo, and a link to you Zulip
chat. Other information from your [organization
profile](/help/create-your-organization-profile) and the size of your
organization may be included as well.

[zulip-cloud]: https://zulip.com/zulip-cloud/
```

--------------------------------------------------------------------------------

---[FILE: _ComposeAndSendMessage.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ComposeAndSendMessage.mdx

```text
import SendIcon from "~icons/zulip-icon/send";

1. Click on the compose box, or press <kbd>Tab</kbd> to compose your message. You
   can [preview your message](/help/preview-your-message-before-sending) before
   sending.
1. Click the **Send** (<SendIcon />) button, or
   use a [keyboard shortcut](/help/configure-send-message-keys) to send your
   message.
```

--------------------------------------------------------------------------------

---[FILE: _ConfigureChannelLinks.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ConfigureChannelLinks.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

You can configure whether channel links in the [left
sidebar](/help/left-sidebar) go to the channel feed, a list of topics in the
channel, the top topic, or the top unread topic.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/preferences" />

      1. Under **Navigation**, select your preferred option from the
         **Channel links in the left sidebar go to** dropdown.
    </FlattenedSteps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _ConfigureNotificationsForFollowedTopics.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ConfigureNotificationsForFollowedTopics.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/notifications" />

      1. In the **Notification triggers** table,
         toggle the settings for **Followed topics**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

<ZulipTip>
  You will receive both followed topics notifications and
  [channel notifications](/help/channel-notifications) in
  topics you follow.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _ConfigureResolvedNoticesMarkedAsRead.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ConfigureResolvedNoticesMarkedAsRead.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

Zulip lets you automatically mark as read Notification Bot notices
indicating that someone [resolved or unresolved](/help/resolve-a-topic)
a topic, or do so just for topics you don't follow.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/notifications" />

      1. Under **Topic notifications**, configure **Automatically mark resolved topic
         notices as read**.
    </FlattenedSteps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _ConfigureTopicNotificationsDesktopWeb.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ConfigureTopicNotificationsDesktopWeb.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import TopicActions from "../include/_TopicActions.mdx";

import FollowIcon from "~icons/zulip-icon/follow";
import InheritIcon from "~icons/zulip-icon/inherit";
import MuteIcon from "~icons/zulip-icon/mute";
import UnmuteIcon from "~icons/zulip-icon/unmute";

<FlattenedSteps>
  <TopicActions />

  1. Configure topic notifications using the row of icons at the top of the menu.
</FlattenedSteps>

<ZulipTip>
  You can also configure notifications by clicking the topic notifications
  status icon (<MuteIcon />,
  <InheritIcon />,
  <UnmuteIcon />, or
  <FollowIcon />) wherever it appears.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _ConfigureWhoCanManagePlans.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ConfigureWhoCanManagePlans.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import SaveChanges from "../include/_SaveChanges.mdx";

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/organization-permissions" />

      1. Under **Other permissions**, configure **Who can manage plans and billing**.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _ConfigureYourOrganization.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ConfigureYourOrganization.mdx

```text
1. [Create your organization profile](/help/create-your-organization-profile),
   which is displayed on your organization's registration and login pages.
1. [Create user groups](/help/create-user-groups), which offer a flexible way to
   manage permissions.
1. Review [organization permissions](/help/manage-permissions), such as who
   can invite users, create channels, etc.
1. If your organization uses an issue tracker (e.g., GitHub, Salesforce,
   Zendesk, Jira, etc.), configure [linkifiers](/help/add-a-custom-linkifier) to
   automatically turn issue numbers (e.g., #2468) into links.
1. Set up [custom profile fields](/help/custom-profile-fields), which make it
   easy for users to share information, such as their pronouns, job title, or
   team.
1. Review [default user settings](/help/configure-default-new-user-settings),
   including language, [default visibility for email
   addresses](/help/configure-email-visibility), and notification preferences.
```

--------------------------------------------------------------------------------

---[FILE: _ContentAccessDefinition.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ContentAccessDefinition.mdx

```text
* They are subscribed to the channel, or
* They have the permission to add subscribers
  ([themselves](/help/configure-who-can-subscribe) or
  [others](/help/configure-who-can-invite-to-channels#configure-who-can-subscribe-anyone-to-a-specific-channel))
  to the channel.
```

--------------------------------------------------------------------------------

---[FILE: _ConversationDefinition.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ConversationDefinition.mdx

```text
In Zulip, a **conversation** is a [direct message](/help/direct-messages) thread
(one-on-one or with a group), or a [topic in a
channel](/help/introduction-to-topics).
```

--------------------------------------------------------------------------------

---[FILE: _ConversationRecommendation.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ConversationRecommendation.mdx

```text
It generally works best to read your messages organized by conversation.
```

--------------------------------------------------------------------------------

---[FILE: _CreateAChannelInstructions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_CreateAChannelInstructions.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";

import SquarePlusIcon from "~icons/zulip-icon/square-plus";

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/gear/channel-settings" />

      1. Click **Create channel** on the right, or click the
         **create new channel** (<SquarePlusIcon />)
         icon in the upper right.
      1. Fill out the requested information.
      1. *(optional)* Click on **Advanced configuration** to review and update
         additional channel settings.
      1. Click **Continue to add subscribers**.
      1. Add users who will be subscribed to the channel, and click **Create**.
    </FlattenedSteps>

    <ZulipNote>
      **Note**: You will only see the **Create channel** button if you have
      permission to create channels.
    </ZulipNote>
  </TabItem>

  <TabItem label="Mobile">
    Access this feature by following the web app instructions in your
    mobile device browser.

    Implementation of this feature in the mobile app is tracked [on
    GitHub](https://github.com/zulip/zulip-flutter/issues/1572). If
    you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _CreateChannelsIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_CreateChannelsIntro.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";
import ChannelsIntro from "../include/_ChannelsIntro.mdx";

<ChannelsIntro />

We recommend setting up some channels before inviting other users to
join Zulip, so that you can [automatically subscribe
everyone](/help/set-default-channels-for-new-users) to the right set of
channels.

If you later create additional channels, no worries! You can always subscribe
a group of users, or all the subscribers of another channel, to a new channel.

<ZulipTip>
  Add clear descriptions to your channels, especially public channels.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _CreateOrgNoImport.mdx]---
Location: zulip-main/starlight_help/src/content/include/_CreateOrgNoImport.mdx

```text
import {Steps} from "@astrojs/starlight/components";

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
```

--------------------------------------------------------------------------------

---[FILE: _CustomizeSettingsForNewUsers.mdx]---
Location: zulip-main/starlight_help/src/content/include/_CustomizeSettingsForNewUsers.mdx

```text
Customize settings for new users to get them off to a great start.

* [Add custom profile fields](/help/custom-profile-fields#add-a-custom-profile-field), such as pronouns
  or job title.
* [Configure default new user settings][default-user-settings].
* [Set default channels for new users](/help/set-default-channels-for-new-users).
* [Set organization language for automated messages and invitation emails][org-lang],
  if it should be something other than American English.

[org-lang]: /help/configure-organization-language

[default-user-settings]: /help/configure-default-new-user-settings
```

--------------------------------------------------------------------------------

---[FILE: _DependsOnPermissions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_DependsOnPermissions.mdx

```text
import ZulipNote from "../../components/ZulipNote.astro";

<ZulipNote>
  You will see the options described only if you have permission
  to take this action.
</ZulipNote>
```

--------------------------------------------------------------------------------

---[FILE: _DesktopSidebarSettingsMenu.mdx]---
Location: zulip-main/starlight_help/src/content/include/_DesktopSidebarSettingsMenu.mdx

```text
import CogIcon from "~icons/fa/cog";

1. Click the **gear** (<CogIcon />) icon in the bottom left corner of the app.
```

--------------------------------------------------------------------------------

---[FILE: _DesktopToggleSidebarTip.mdx]---
Location: zulip-main/starlight_help/src/content/include/_DesktopToggleSidebarTip.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

<ZulipTip>
  To show or hide the **organizations sidebar** on the left, select
  **Toggle Sidebar** from the **View** menu in the top menu bar.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _DmFeedInstructions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_DmFeedInstructions.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import ZulipTip from "../../components/ZulipTip.astro";

import AllMessagesIcon from "~icons/zulip-icon/all-messages";

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. In the left sidebar, click the **Direct message feed**
         (<AllMessagesIcon />) icon to the right of the
         **direct messages** heading, or use the <kbd>Shift</kbd> + <kbd>P</kbd>
         keyboard shortcut.
      1. Read your direct messages, starting from your first unread message. You can
         scroll using your mouse, the arrow keys, <kbd>End</kbd>, or page up/down.
    </Steps>

    <ZulipTip>
      You can click on a conversation in the left sidebar or a message recipient
      bar to view that conversation.
    </ZulipTip>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _EditOrganizationProfile.mdx]---
Location: zulip-main/starlight_help/src/content/include/_EditOrganizationProfile.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import SaveChanges from "../include/_SaveChanges.mdx";

<FlattenedSteps>
  <NavigationSteps target="settings/organization-profile" />

  1. Edit your organization **name**, **type**, **description**, and
     **profile picture**.
  1. *(optional)* Click **Preview organization profile** to see a preview of your
     organization's login page in a new browser tab.

  <SaveChanges />
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: _EmojiAndEmoticonsExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_EmojiAndEmoticonsExamples.mdx

```text
### What you type

```
:octopus: :heart: :zulip: :)
```

### What it looks like

![Markdown emoji](../../images/markdown-emoji.png)
```

--------------------------------------------------------------------------------

---[FILE: _EmojiAndEmoticonsIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_EmojiAndEmoticonsIntro.mdx

```text
You can use emoji in Zulip messages and [topics](/help/introduction-to-topics).
There are several ways to use an emoji in your message:

* [Enter an emoji name](/help/emoji-and-emoticons#use-an-emoji-in-your-message)
  surrounded by `:`, with help from autocomplete suggestions.
* [Select an emoji from the emoji
  picker](/help/emoji-and-emoticons#use-an-emoji-in-your-message)
* [Use an emoticon](/help/emoji-and-emoticons#use-an-emoticon)
* [Paste an emoji](/help/emoji-and-emoticons#use-an-emoji-in-your-message)

You can [add custom emoji](/help/custom-emoji) for your organization. Like
default emoji, custom emoji can be entered into the compose box by name, or
selected from the emoji picker.
```

--------------------------------------------------------------------------------

---[FILE: _EmphasisExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_EmphasisExamples.mdx

```text
### What you type

```
**bold**, *italic*, and ~~strikethrough~~ text
***~~All three at once~~***
```

### What it looks like

![Markdown emphasis](../../images/markdown-emphasis.png)
```

--------------------------------------------------------------------------------

---[FILE: _EmphasisIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_EmphasisIntro.mdx

```text
In Zulip, you can make text bold or italic, or cross it out with strikethrough.
```

--------------------------------------------------------------------------------

---[FILE: _ExportWithoutConsentRequirements.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ExportWithoutConsentRequirements.mdx

```text
To perform this export, your organization must meet the following requirements:

* You are a paid [Zulip Cloud Standard](https://zulip.com/plans/) or [Zulip
  Cloud Plus](https://zulip.com/plans/) customer. In rare cases, exceptions may
  be made in case of due legal process.
* You have authority to read members' [direct messages](/help/direct-messages).
  Typically, this will be because your Zulip organization is administered by a
  corporation, and you are an official representative of that corporation.

By requesting and approving this export, you will assume full legal
responsibility that the appropriate employment agreements and corporate policy
for this type of export are in place. Note that many countries have laws that
require employers to notify employees of their use of such an export.
```

--------------------------------------------------------------------------------

---[FILE: _FilterChannels.mdx]---
Location: zulip-main/starlight_help/src/content/include/_FilterChannels.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import KeyboardTip from "../../components/KeyboardTip.astro";

Channels in collapsed sections will be included in your search.

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Type the name of the channel you are looking for in the **Filter left
         sidebar** box at the top of the left sidebar.
    </Steps>

    <KeyboardTip>
      You can also use the <kbd>Q</kbd> keyboard shortcut to start searching for
      a channel.
    </KeyboardTip>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _FilterResolvedLeftSidebar.mdx]---
Location: zulip-main/starlight_help/src/content/include/_FilterResolvedLeftSidebar.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click on a channel in the left sidebar.
      1. Click **show all topics** at the bottom of the list of recent topics in the
         selected channel.
      1. In the search box at the top of the list of topics, type `is:`.
      1. Choose **Unresolved topics** or **Resolved topics** from the typeahead
         suggestions.
    </Steps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _FindDmConversationLeftSidebar.mdx]---
Location: zulip-main/starlight_help/src/content/include/_FindDmConversationLeftSidebar.mdx

```text
import {Steps} from "@astrojs/starlight/components";

import KeyboardTip from "../../components/KeyboardTip.astro";

<Steps>
  1. Type the name of a participant in the conversation you're looking for in the
     **Filter left sidebar** box at the top of the left sidebar.
</Steps>

<KeyboardTip>
  You can also use the <kbd>Q</kbd> keyboard shortcut to start searching for
  a conversation.
</KeyboardTip>
```

--------------------------------------------------------------------------------

---[FILE: _FollowedTopicWorkflows.mdx]---
Location: zulip-main/starlight_help/src/content/include/_FollowedTopicWorkflows.mdx

```text
* [Catch up](/help/follow-a-topic#catch-up-on-followed-topics) on
  followed topics at the start of the day, and whenever you want to
  spend a few minutes checking on on the conversations that need
  your attention.
* No more stressing about missing a reply to your message in channels
  you don't regularly read. You can [automatically
  follow](/help/follow-a-topic#automatically-follow-topics) topics you
  start or participate in.
* You can also [mute](/help/mute-a-channel) the channels you don't
  regularly read, and [automatically follow or
  unmute](/help/follow-a-topic#automatically-follow-topics) topics you
  start or participate in. In muted channels, topics you follow are
  automatically treated as [unmuted](/help/mute-a-topic), so it will
  be easy to see when someone responds to your message.
* If you like, follow just the topics where your prompt attention is
  needed, and [enable desktop and mobile
  notifications](/help/follow-a-topic#configure-notifications-for-followed-topics)
  for followed topics.
```

--------------------------------------------------------------------------------

---[FILE: _GeneralChatIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_GeneralChatIntro.mdx

```text
Messages sent without a topic go to the special “*general chat*” topic. The name
of this topic is shown in italics, and is translated into [your
language](/help/change-your-language).
```

--------------------------------------------------------------------------------

---[FILE: _GlobalTimesExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_GlobalTimesExamples.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

### What you type

A date picker will appear once you type `<time`.

```
Our next meeting is scheduled for <time:2024-08-06T17:00:00+01:00>.
```

<ZulipTip>
  You can also use other formats such as UNIX timestamps or human readable
  dates, for example, `<time:August 06 2024, 5:00 PM BST>`.
</ZulipTip>

### What it looks like

A person in San Francisco will see:

![Global time San Francisco example](../../images/global-time-example-sf.png)

While someone in London will see:

![Global time London example](../../images/global-time-example-london.png)
```

--------------------------------------------------------------------------------

---[FILE: _GlobalTimesIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_GlobalTimesIntro.mdx

```text
When collaborating with people in different time zones, you often need to
express a specific time clearly. In Zulip, rather than typing out your time
zone and having everyone translate the time in their heads, you can insert
a time, and it will be displayed to each user in their own time zone (just
like timestamps on Zulip messages).
```

--------------------------------------------------------------------------------

---[FILE: _GoToChannel.mdx]---
Location: zulip-main/starlight_help/src/content/include/_GoToChannel.mdx

```text
1. Click on a channel in the left sidebar, or otherwise navigate to the channel
   you're interested in.
```

--------------------------------------------------------------------------------

---[FILE: _GoToCombinedFeed.mdx]---
Location: zulip-main/starlight_help/src/content/include/_GoToCombinedFeed.mdx

```text
import AllMessagesIcon from "~icons/zulip-icon/all-messages";

1. Click on <AllMessagesIcon /> **Combined feed**
   (or <AllMessagesIcon /> if the **views**
   section is collapsed) in the left sidebar,
   or use the <kbd>A</kbd> keyboard shortcut.
```

--------------------------------------------------------------------------------

---[FILE: _GoToDraftMessages.mdx]---
Location: zulip-main/starlight_help/src/content/include/_GoToDraftMessages.mdx

```text
import DraftsIcon from "~icons/zulip-icon/drafts";
import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";

1. Click on <DraftsIcon /> **Drafts**
   in the left sidebar. If the **views** section is collapsed, click on
   the **ellipsis** (<MoreVerticalIcon />),
   and select <DraftsIcon /> **Drafts**.
```

--------------------------------------------------------------------------------

---[FILE: _GoToInbox.mdx]---
Location: zulip-main/starlight_help/src/content/include/_GoToInbox.mdx

```text
import InboxIcon from "~icons/zulip-icon/inbox";

1. Click on <InboxIcon /> **Inbox**
   (or <InboxIcon /> if the **views**
   section is collapsed) in the left sidebar,
   or use the <kbd>Shift</kbd> + <kbd>I</kbd> keyboard shortcut.
```

--------------------------------------------------------------------------------

---[FILE: _GoToRecentConversations.mdx]---
Location: zulip-main/starlight_help/src/content/include/_GoToRecentConversations.mdx

```text
import RecentIcon from "~icons/zulip-icon/recent";

1. Click on <RecentIcon /> **Recent conversations**
   (or <RecentIcon /> if the **views**
   section is collapsed) in the left sidebar,
   or use the <kbd>T</kbd> keyboard shortcut.
```

--------------------------------------------------------------------------------

````
