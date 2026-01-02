---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 467
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 467 of 1290)

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

---[FILE: manage-permissions.mdx]---
Location: zulip-main/starlight_help/src/content/docs/manage-permissions.mdx

```text
---
title: Manage permissions
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import SaveChanges from "../include/_SaveChanges.mdx";
import UserRolesIntro from "../include/_UserRolesIntro.mdx";

<UserRolesIntro />

User groups offer a flexible way to manage permissions.

<ZulipTip>
  Learn about channel [types and permissions](/help/channel-permissions),
  including **public** and **private** channels.
</ZulipTip>

## Manage organization permissions

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Review organization permissions, and modify as needed.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [Change a user's role](/help/user-roles#change-a-users-role)
* [User groups](/help/user-groups)
* [Channel permissions](/help/channel-permissions)
* [Inviting new users](/help/invite-new-users)
* [Zulip Cloud billing](/help/zulip-cloud-billing)
* [Guest users](/help/guest-users)
```

--------------------------------------------------------------------------------

---[FILE: manage-user-channel-subscriptions.mdx]---
Location: zulip-main/starlight_help/src/content/docs/manage-user-channel-subscriptions.mdx

```text
---
title: Manage a user's channel subscriptions
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import RightSidebarViewProfile from "../include/_RightSidebarViewProfile.mdx";
import SubscribeUserToChannel from "../include/_SubscribeUserToChannel.mdx";
import UnsubscribeUserFromChannel from "../include/_UnsubscribeUserFromChannel.mdx";

## View a user's channel subscriptions

<ZulipNote>
  **Note**: The list of a user's **Subscribed channels** will be limited to
  [channels you can see](/help/channel-permissions).
</ZulipNote>

<FlattenedSteps>
  <RightSidebarViewProfile />

  1. Select the **Channels** tab.
</FlattenedSteps>

## Subscribe a user to a channel

<SubscribeUserToChannel />

## Unsubscribe a user from a channel

<UnsubscribeUserFromChannel />

## Related articles

* [Channel permissions](/help/channel-permissions)
* [User roles](/help/user-roles)
* [Subscribe users to a channel](/help/subscribe-users-to-a-channel)
* [Unsubscribe users from a channel](/help/unsubscribe-users-from-a-channel)
* [Unsubscribe from a channel](/help/unsubscribe-from-a-channel)
* [View channel subscribers](/help/view-channel-subscribers)
```

--------------------------------------------------------------------------------

---[FILE: manage-user-group-membership.mdx]---
Location: zulip-main/starlight_help/src/content/docs/manage-user-group-membership.mdx

```text
---
title: Manage a user's group membership
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AddUsersToAGroup from "../include/_AddUsersToAGroup.mdx";
import DependsOnPermissions from "../include/_DependsOnPermissions.mdx";
import RemoveUsersFromAGroup from "../include/_RemoveUsersFromAGroup.mdx";
import RightSidebarViewProfile from "../include/_RightSidebarViewProfile.mdx";

## View a user's group membership

<FlattenedSteps>
  <RightSidebarViewProfile />

  1. Select the **User groups** tab.
</FlattenedSteps>

## Add a user to a group

<AddUsersToAGroup />

## Remove user or group from a group

<RemoveUsersFromAGroup />

## Related articles

* [User groups](/help/user-groups)
* [Manage user groups](/help/user-groups)
* [Mention a user or group](/help/mention-a-user-or-group)
* [Create user groups](/help/create-user-groups)
* [User roles](/help/user-roles)

[configure-invites]: /help/configure-who-can-invite-to-channels
```

--------------------------------------------------------------------------------

---[FILE: manage-user-groups.mdx]---
Location: zulip-main/starlight_help/src/content/docs/manage-user-groups.mdx

```text
---
title: Manage user groups
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AddUsersToAGroup from "../include/_AddUsersToAGroup.mdx";
import AdminOnly from "../include/_AdminOnly.mdx";
import CloudPaidPlansOnly from "../include/_CloudPaidPlansOnly.mdx";
import HowToCreateAUserGroup from "../include/_HowToCreateAUserGroup.mdx";
import RemoveUsersFromAGroup from "../include/_RemoveUsersFromAGroup.mdx";
import RightSidebarViewProfile from "../include/_RightSidebarViewProfile.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import UserGroupsApplications from "../include/_UserGroupsApplications.mdx";
import UserGroupsIntro from "../include/_UserGroupsIntro.mdx";
import UserSubgroupsIntro from "../include/_UserSubgroupsIntro.mdx";

import ExpandBothDiagonalsIcon from "~icons/zulip-icon/expand-both-diagonals";
import UserGroupEditIcon from "~icons/zulip-icon/user-group-edit";

<CloudPaidPlansOnly />

<UserGroupsIntro />

<UserGroupsApplications />

## Create a user group

<ZulipTip>
  You can modify the group's name, description, and other settings after it
  has been created.
</ZulipTip>

<HowToCreateAUserGroup />

## Change a user group's name or description

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/group/all" />

      1. Select a user group.
      1. Select the **General** tab on the right.
      1. Click the **change group info** (<UserGroupEditIcon />)
         icon to the right of the user group, and enter a new name or description.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Configure group permissions

<ZulipNote>
  Guests can never administer user groups, add anyone else to a group, or remove
  anyone else from a group, even if they belong to a group that has permissions
  to do so.
</ZulipNote>

<ZulipTip>
  Users who can add members to a group can always join the group.
</ZulipTip>

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/group/all" />

      1. Select a user group.
      1. Select the **General** tab on the right.
      1. Under **Group permissions**, configure **Who can administer this group**, **Who
         can mention this group**, **Who can add members to this group**, **Who can remove
         members from this group**, **Who can join this group**, and **Who can leave this group**.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Add users to a group

<AddUsersToAGroup />

## Add user groups to a group

<UserSubgroupsIntro />

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/group/all" />

      1. Select a user group.
      1. Select the **Members** tab on the right.
      1. Under **Add members**, enter groups you want to add.
      1. Click **Add**.
    </FlattenedSteps>

    <ZulipTip>
      Click the <ExpandBothDiagonalsIcon /> icon
      on a user group pill to add all the members of the group, rather than the
      group itself.
    </ZulipTip>
  </TabItem>
</Tabs>

## Remove user or group from a group

<RemoveUsersFromAGroup />

## Review and remove permissions assigned to a group

You can review which permissions are assigned to a group, and remove permissions
as needed.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/group/all" />

      1. Select a user group.
      1. Select the **Permissions** tab on the right.
      1. Toggle the checkboxes next to any permissions you'd like to remove.
      1. Click **Save changes**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Configure who can create user groups

<AdminOnly />

You can configure who can create groups in your organization. Guests can never
create user groups, even if they belong to a group that has permissions to do
so.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/organization-permissions" />

      1. Under **Group permissions**, configure **Who can create user groups**.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Configure who can administer all user groups

<AdminOnly />

You can configure who can administer all user groups in your
organization. Guests can never administer user groups, even if they
belong to a group that has permissions to do so.

In addition, you can [give users
permission](#configure-group-permissions) to administer a specific
group.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/organization-permissions" />

      1. Under **Group permissions**, configure **Who can administer all user groups**.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [User groups](/help/user-groups)
* [View group members](/help/view-group-members)
* [Mention a user or group](/help/mention-a-user-or-group)
* [Create user groups](/help/create-user-groups)
* [Deactivate a user group](/help/deactivate-a-user-group)
* [Moving to Zulip](/help/moving-to-zulip)
* [User roles](/help/user-roles)
```

--------------------------------------------------------------------------------

---[FILE: manage-your-uploaded-files.mdx]---
Location: zulip-main/starlight_help/src/content/docs/manage-your-uploaded-files.mdx

```text
---
title: Manage your uploaded files
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";

import DownloadIcon from "~icons/zulip-icon/download";
import TrashIcon from "~icons/zulip-icon/trash";

Zulip lets you view, sort, filter, download, and delete any files that you have
uploaded.

## View a file

<FlattenedSteps>
  <NavigationSteps target="settings/uploaded-files" />

  1. Click on the name of a file in the **File** column.
</FlattenedSteps>

<ZulipTip>
  You can also view a file in the context of the
  [conversations](/help/recent-conversations) where it was
  mentioned by clicking on a message ID in the **Mentioned in** column.
</ZulipTip>

## Sort your files

You can sort your uploaded files by name, upload date, message ID, and size.

<FlattenedSteps>
  <NavigationSteps target="settings/uploaded-files" />

  1. Click on the name of a column to toggle between ascending and descending order.
</FlattenedSteps>

<ZulipTip>
  You can filter your current view by using the **search box** near the top
  right corner of the menu.
</ZulipTip>

## Download a file

<FlattenedSteps>
  <NavigationSteps target="settings/uploaded-files" />

  1. In the **Actions** column, click the **download**
     (<DownloadIcon />) icon for the file you want to download.
</FlattenedSteps>

## Delete a file

<FlattenedSteps>
  <NavigationSteps target="settings/uploaded-files" />

  1. In the **Actions** column, click the **delete**
     (<TrashIcon />) icon for the file you want to remove.
  1. Approve by clicking **Delete**. If you delete a file, your message will still
     contain a file link, but the link will no longer work.
</FlattenedSteps>

## Related articles

* [Share and upload files](/help/share-and-upload-files)
* [View images and videos](/help/view-images-and-videos)
* [Image, video and website previews](/help/image-video-and-website-previews)
```

--------------------------------------------------------------------------------

---[FILE: marking-messages-as-read.mdx]---
Location: zulip-main/starlight_help/src/content/docs/marking-messages-as-read.mdx

```text
---
title: Marking messages as read
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ConfigureResolvedNoticesMarkedAsRead from "../include/_ConfigureResolvedNoticesMarkedAsRead.mdx";
import GoToInbox from "../include/_GoToInbox.mdx";
import GoToRecentConversations from "../include/_GoToRecentConversations.mdx";
import MobileSettings from "../include/_MobileSettings.mdx";

import ChevronDownIcon from "~icons/fa/chevron-down";
import AllMessagesIcon from "~icons/zulip-icon/all-messages";
import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";

Zulip automatically keeps track of which messages you have and haven't read.
Unread messages have a line along the left side, which fades when the message
gets marked as read.

Zulip offers tools to manually mark one or more messages as read, and you can
configure whether messages are marked as read automatically when you scroll.

## Configure whether messages are automatically marked as read

You can choose how messages are automatically marked as read in the Zulip web
and mobile apps. You can configure the mobile app differently from the
web/desktop app.

* **Always**: Messages are marked as read whenever you scroll through them in
  the app. You may be used to this from other chat applications.
* **Only in conversation views**: In Zulip, a **conversation** is a [direct
  message](/help/direct-messages) thread (one-on-one or with a group), or a
  [topic in a channel](/help/introduction-to-topics). This option makes it
  convenient to preview new messages in a channel, or skim [Combined
  feed](/help/combined-feed), and later read each topic in detail.
* **Never**: Messages are marked as read only manually. For example,
  if you often need to follow up on messages at your computer after
  reading them in the mobile app, you can choose this option for the
  mobile app.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/preferences" />

      1. Under **Navigation**, click on the **Automatically mark messages as
         read** dropdown, and select **Always**, **Never** or **Only in
         [conversation](/help/reading-conversations) views**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileSettings />

      1. Tap **Mark messages as read on scroll**.
      1. Select **Always**, **Never** or **Only in
         [conversation](/help/reading-conversations) views**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Configure whether resolved topic notices are marked as read

<ConfigureResolvedNoticesMarkedAsRead />

## Mark a message as read

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Select the message using the **blue box** to mark it as read. You can scroll
         the **blue box** using the mouse, or with [keyboard navigation
         shortcuts](/help/keyboard-shortcuts#navigation).
    </Steps>
  </TabItem>
</Tabs>

## Mark all messages in a channel or topic as read

<Tabs>
  <TabItem label="Via left sidebar">
    <Steps>
      1. Hover over a channel or topic in the left sidebar.
      1. Click on the **ellipsis** (<MoreVerticalIcon />).
      1. Click **Mark all messages as read**.
    </Steps>

    <ZulipTip>
      You can also mark all messages in your current view as read by
      jumping to the bottom with the **Scroll to bottom**
      (<ChevronDownIcon />) button or the <kbd>End</kbd> shortcut.
    </ZulipTip>
  </TabItem>

  <TabItem label="Via inbox view">
    <FlattenedSteps>
      <GoToInbox />

      1. Click on an unread messages counter to mark all messages in that topic or
         channel as read.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via recent conversations">
    <FlattenedSteps>
      <GoToRecentConversations />

      1. Click on an unread messages counter in the **Topic** column to mark all
         messages in that topic as read.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <Steps>
      1. Press and hold a channel or topic until the long-press menu appears.
      1. Tap **Mark channel as read** or **Mark topic as read**.
    </Steps>

    <ZulipTip>
      You can also scroll down to the bottom of a message view, and tap **Mark
      all messages as read**.
    </ZulipTip>
  </TabItem>
</Tabs>

## Mark messages in multiple topics and channels as read

In the web and desktop apps, you can mark all messages as read, or just messages
in muted topics or topics you don't follow.

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Hover over your [home view](/help/configure-home-view) in the left sidebar.
      1. Click on the **ellipsis** (<MoreVerticalIcon />).
      1. Select the desired option from the dropdown, and click **Confirm**.
    </Steps>

    <ZulipTip>
      You can also mark all messages in your current view as read by
      jumping to the bottom with the **Scroll to bottom**
      (<ChevronDownIcon />) button or the <kbd>End</kbd> shortcut.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <Steps>
      1. Tap the **Combined feed**
         (<AllMessagesIcon />) tab.
      1. Scroll down to the bottom of the message view, and tap **Mark all messages
         as read**.
    </Steps>
  </TabItem>
</Tabs>

## Related articles

* [Marking messages as unread](/help/marking-messages-as-unread)
* [Configure where you land in message feeds](/help/configure-where-you-land)
* [Reading strategies](/help/reading-strategies)
* [Read receipts](/help/read-receipts)
```

--------------------------------------------------------------------------------

---[FILE: marking-messages-as-unread.mdx]---
Location: zulip-main/starlight_help/src/content/docs/marking-messages-as-unread.mdx

```text
---
title: Marking messages as unread
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import GoToRecentConversations from "../include/_GoToRecentConversations.mdx";
import MessageActionsMenu from "../include/_MessageActionsMenu.mdx";
import MessageLongPressMenu from "../include/_MessageLongPressMenu.mdx";

import FollowIcon from "~icons/zulip-icon/follow";
import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";
import MuteIcon from "~icons/zulip-icon/mute";

Zulip lets you manually mark messages as unread. Specifically, Zulip offers a
**Mark as unread from here** option, which lets you mark the selected message
and all newer messages in your current view as unread.

There are many ways to use this feature, including:

* When you don't have time to read a conversation carefully, or to follow up on
  action items, mark messages as unread to return to them later.
* You can mark messages as unread when you [subscribe to a
  channel](/help/introduction-to-channels#browse-and-subscribe-to-channels). This makes it
  [convenient](/help/reading-strategies) to review all the recent
  conversations in that channel.
* Mark the results of your [search](/help/search-for-messages) as unread to
  review them at leisure.

## Mark as unread from selected message

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActionsMenu />

      1. Click **Mark as unread from here**.
    </FlattenedSteps>

    <KeyboardTip>
      You can also mark messages as unread by selecting a message, and using the
      <kbd>Shift</kbd> + <kbd>U</kbd> shortcut.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />

      1. Tap **Mark as unread from here**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Mark all messages in a topic or channel as unread

<Tabs>
  <TabItem label="Via left sidebar">
    <Steps>
      1. Hover over a topic or channel in the left sidebar.
      1. Click on the **ellipsis** (<MoreVerticalIcon />).
      1. Click **Mark all messages as unread**. This option will appear only if all
         messages in the topic or channel are currently marked as read.
    </Steps>

    <ZulipTip>
      You can also mark all messages in your current view as unread by
      jumping to the top with the <kbd>Home</kbd> key, and marking as unread
      [from the first message](#mark-as-unread-from-selected-message).
    </ZulipTip>
  </TabItem>

  <TabItem label="Via recent conversations">
    <FlattenedSteps>
      <GoToRecentConversations />

      1. Hover over a topic.
      1. Click on the **ellipsis** (<MoreVerticalIcon />) next to the unread messages counter. You may
         need to hover over the indicator icon for a followed (<FollowIcon />) or muted (<MuteIcon />) topic in order to see it.
      1. Click **Mark all messages as unread**. This option will appear only if all
         messages in the topic are currently marked as read.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Reading strategies](/help/reading-strategies)
* [Marking messages as read](/help/marking-messages-as-read)
* [Star a message](/help/star-a-message)
* [Read receipts](/help/read-receipts)
```

--------------------------------------------------------------------------------

---[FILE: mastering-the-compose-box.mdx]---
Location: zulip-main/starlight_help/src/content/docs/mastering-the-compose-box.mdx

```text
---
title: Mastering the compose box
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import StartComposing from "../include/_StartComposing.mdx";

import ChevronRightIcon from "~icons/zulip-icon/chevron-right";

Here is an overview of all the information and actions you can take in Zulip's
compose box.

![Compose box information and actions](../../images/compose-actions.png)

## Composing to a different conversation

When composing a message, Zulip lets you view a different
[conversation](/help/reading-conversations) from the one you are composing to.
For example, you can start a new topic without changing your view, send a
direct message about the topic you're viewing, or look up a related discussion.

In this context, the parts of the message view that are outside of the
conversation you are composing to are faded for clarity.

### Change where you are composing to

No matter where you start composing your message, it's easy to change where it
will be sent.

<Tabs>
  <TabItem label="Compose to a channel">
    <FlattenedSteps>
      <StartComposing />

      1. Select any channel from the dropdown in the top left of the compose box. You can
         start typing to filter channels.
      1. Enter a topic name. Auto-complete will provide suggestions for previously
         used topics.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Compose a DM">
    <FlattenedSteps>
      <StartComposing />

      1. Select **Direct message** from the dropdown in the top left of the compose
         box.
      1. Start typing the name of the person you want to message, and
         select their name from the list of suggestions. You can continue
         adding as many message recipients as you like.
    </FlattenedSteps>
  </TabItem>
</Tabs>

### Go to conversation

Zulip lets you jump to the [conversation](/help/reading-conversations) you're
currently composing to.

<Steps>
  1. [Open the compose box](/help/open-the-compose-box).
  1. Click the highlighted **Go to conversation** (<ChevronRightIcon />) button at the top of the compose box. It will
     be clickable only if you're viewing a different conversation from the one you
     are composing to.
</Steps>

<KeyboardTip>
  Use <kbd>Ctrl</kbd> + <kbd>.</kbd> to go to the conversation you're
  composing to.
</KeyboardTip>

### Automatically go to conversation where you sent a message

<FlattenedSteps>
  <NavigationSteps target="settings/preferences" />

  1. Under **Navigation**, toggle **Automatically go to conversation
     where you sent a message**, as desired.
</FlattenedSteps>

## Related articles

* [Resize the compose box](/help/resize-the-compose-box)
* [Message formatting](/help/format-your-message-using-markdown)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Configure send message keys](/help/configure-send-message-keys)
* [Messaging tips and tricks](/help/messaging-tips)
```

--------------------------------------------------------------------------------

---[FILE: me-action-messages.mdx]---
Location: zulip-main/starlight_help/src/content/docs/me-action-messages.mdx

```text
---
title: /me action messages
---

import MeActionMessagesExamples from "../include/_MeActionMessagesExamples.mdx";
import MeActionMessagesIntro from "../include/_MeActionMessagesIntro.mdx";

<MeActionMessagesIntro />

## Examples

<MeActionMessagesExamples />

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Resize the compose box](/help/resize-the-compose-box)
```

--------------------------------------------------------------------------------

---[FILE: mention-a-user-or-group.mdx]---
Location: zulip-main/starlight_help/src/content/docs/mention-a-user-or-group.mdx

```text
---
title: Mention a user or group
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import MentionsExamples from "../include/_MentionsExamples.mdx";
import MentionsIntro from "../include/_MentionsIntro.mdx";
import RightSidebarUserCard from "../include/_RightSidebarUserCard.mdx";
import StartComposing from "../include/_StartComposing.mdx";

<MentionsIntro />

<ZulipTip>
  If you edit a message, adding or removing mentions will update message
  notifications. [Learn more](/help/edit-a-message#message-notifications).
</ZulipTip>

## Mention a user or group

### From the compose box

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <StartComposing />

      1. Type `@` followed by a few letters from a name or email address.
      1. Pick the appropriate user or user group from the autocomplete.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <Steps>
      1. Tap the compose box at the bottom of the app.
      1. Type `@` followed by a few letters from a name.
      1. Pick the appropriate user or user group from the autocomplete.
    </Steps>
  </TabItem>
</Tabs>

### From the user list

<FlattenedSteps>
  <RightSidebarUserCard />

  1. Select **Copy mention syntax** to add it to your clipboard.
  1. Paste the user's mention syntax in the compose box.
</FlattenedSteps>

### Via a message

<Steps>
  1. Click on a user's profile picture or name on a message they sent
     to open their **user card**.
  1. Select **Reply mentioning user** to start a reply to the conversation
     with a mention inserted into the compose box.
</Steps>

## Silently mention a user

A silent mention allows you to refer to a user without triggering a
notification. Silent mentions start with `@_` instead of `@`.

<FlattenedSteps>
  <StartComposing />

  1. Type `@_` followed by a few letters from a name or email address.
  1. Pick the appropriate user or user group from the autocomplete.
</FlattenedSteps>

## Mention all topic participants

Using the `@**topic**` mention, you can mention everyone who has previously
participated in the topic by sending a message or
[reacting](/help/emoji-reactions) with an emoji. This lets you notify just those
who have already engaged in the conversation.

Users can disable notifications for `@**topic**` mentions by:

* Disabling notifications for wildcard mentions
  [globally](/help/dm-mention-alert-notifications) or for [individual
  channels](/help/channel-notifications).
* Muting the [topic](/help/mute-a-topic) or [channel](/help/mute-a-channel).

## Mention everyone on a channel

You can mention everyone on a channel with the `@**all**` mention (or,
equivalently, `@**everyone**` or `@**channel**`). It's best to use these mentions
only when your message requires timely attention from many channel subscribers.
An organization can be configured to
[restrict](/help/restrict-wildcard-mentions) wildcard mentions in large channels.

Users can disable notifications for `@**all**`, `@**everyone**`, and
`@**channel**` mentions by:

* Disabling notifications for wildcard mentions
  [globally](/help/dm-mention-alert-notifications) or for [individual
  channels](/help/channel-notifications).
* Muting the [topic](/help/mute-a-topic) or [channel](/help/mute-a-channel).

## Examples

<MentionsExamples />

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Restrict wildcard mentions](/help/restrict-wildcard-mentions)
* [Quote message](/help/quote-or-forward-a-message)
* [View your mentions](/help/view-your-mentions)
```

--------------------------------------------------------------------------------

---[FILE: message-a-channel-by-email.mdx]---
Location: zulip-main/starlight_help/src/content/docs/message-a-channel-by-email.mdx

```text
---
title: Message a channel by email
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SelectChannelViewGeneral from "../include/_SelectChannelViewGeneral.mdx";

<ZulipTip>
  This feature is not available on self-hosted Zulip servers where
  the [incoming email gateway][email-gateway] has not been
  configured by a system administrator.
</ZulipTip>

[email-gateway]: https://zulip.readthedocs.io/en/stable/production/email-gateway.html

You can send emails to Zulip channels. This can be useful:

* If you have an email that you want to discuss on Zulip
* For mirroring mailing list traffic
* For integrating a third-party app that can send emails, but which does not
  easily lend itself to a more direct integration

If you're planning on doing this in an automated way, and have some
programming experience, another option is to use our [send message
API](/api/send-message).

### Message a channel by email

<FlattenedSteps>
  <NavigationSteps target="relative/gear/channel-settings" />

  1. Select a channel.

  <SelectChannelViewGeneral />

  1. Under **Settings**, click **Generate email address**.
  1. Select **Who should be the sender of the Zulip messages for this email
     address**.
  1. Toggle the configuration options as desired.
  1. Click **Copy address** to add the channel email address to your clipboard.
  1. Send an email to that address.
</FlattenedSteps>

<ChannelSettingsNavbarTip />

The email subject will become the Zulip topic, and the email body will
become the Zulip message.

Note that it may take up to one minute for the message to show
up in Zulip.

## Configuration options

You can configure **who should be the sender of the Zulip messages** for the
generated email address, with the following options:

* **Email Gateway bot**: This option makes it easy to see that the message
  was sent via email.
* **You**: Messages will look the same as messages you send from the Zulip UI.
* [Any bot you own](/help/view-your-bots)

The following options control which parts of the email are included in the
Zulip message.

* **The sender's email address**: Adds `From: <Sender email address>` to
  the top of the Zulip message.
* **Email footers**: By default, Zulip tries to automatically remove some footer
  text (like signatures). With this option enabled, Zulip will include all footers.
* **Quoted original email**: In many email clients, when you reply to a message
  (e.g., a message notification email), a copy of the original message is
  automatically added to the bottom of your reply. By default, Zulip tries
  to remove that copied message. With this option enabled, Zulip will include it.
* **Use html encoding**: The body of an email is typically encoded using
  one or both of two common formats: plain text (`text/plain`) and
  HTML (`text/html`).  Zulip supports constructing the Zulip message
  content using either (converting HTML to Markdown for the HTML
  format).  By default, Zulip will prefer using the plain text version
  of an email over the converted HTML version if both are present.
  Enabling this option overrides that behavior to prefer the HTML version
  instead.

## Related articles

* [Using Zulip via email](/help/using-zulip-via-email)
* [Bots overview](/help/bots-overview)
```

--------------------------------------------------------------------------------

---[FILE: message-actions.mdx]---
Location: zulip-main/starlight_help/src/content/docs/message-actions.mdx

```text
---
title: Message actions
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import MessageActionsMenu from "../include/_MessageActionsMenu.mdx";
import MessageLongPressMenu from "../include/_MessageLongPressMenu.mdx";

There are many ways to interact with a Zulip message. Here's an overview of the
message actions in the web and desktop apps:

![Message actions](../../images/message-actions.png)

In the mobile app, the message actions menu lets you:

* Add a [reaction](/help/emoji-reactions).
* [Star](/help/star-a-message) the message.
* [Quote](/help/quote-or-forward-a-message) the message.
* [Copy message
  content](/help/view-the-markdown-source-of-a-message#copy-message-content-as-markdown) in
  Markdown, or [share
  it](/help/view-the-markdown-source-of-a-message#share-message-content) to
  other apps.
* Copy a [link to the
  message](/help/link-to-a-message-or-conversation#get-a-link-to-a-specific-message).

## Open the message actions menu

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActionsMenu />
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [User cards](/help/user-cards)
* [Emoji reactions](/help/emoji-reactions)
* [Star a message](/help/star-a-message)
* [View a message's edit history](/help/view-a-messages-edit-history)
* [Link to a message or conversation](/help/link-to-a-message-or-conversation)
* [Report a message](/help/report-a-message)
```

--------------------------------------------------------------------------------

---[FILE: message-retention-policy.mdx]---
Location: zulip-main/starlight_help/src/content/docs/message-retention-policy.mdx

```text
---
title: Message retention policy
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import OwnerOnly from "../include/_OwnerOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewPermissions from "../include/_SelectChannelViewPermissions.mdx";

<OwnerOnly />

By default, Zulip stores messages indefinitely, allowing full-text
search of your complete history.

Zulip supports configuring both a global organization-level message
retention policy, as well as retention policies for individual
channels.  These policies control how many days a message is stored
before being automatically deleted (the default being forever).
Zulip's system supports:

* Setting an organization-level retention policy, which applies to
  all direct messages and all channels without a specific policy.
* Setting a retention policy for individual channels, which overrides
  the organization-level policy for that channel.  This can be used to
  just delete messages on specific channels, to only retain messages
  forever on specific channels, or just to have a different retention
  period.

In Zulip Cloud, message retention policies are available on the Zulip
Cloud Standard and Zulip Cloud Plus [plans](https://zulip.com/plans/),
as well as for the hundreds of communities with sponsored Cloud
Standard hosting.

### Configure message retention policy for organization

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Message retention period**, configure **Message retention
     period**.

  <SaveChanges />
</FlattenedSteps>

### Configure message retention policy for individual channels

<FlattenedSteps>
  <NavigationSteps target="relative/channel/all" />

  1. Select a channel.

  <SelectChannelViewPermissions />

  1. Under **Administrative permissions**, configure the
     **Message retention period**.

  <SaveChanges />
</FlattenedSteps>

<ChannelSettingsNavbarTip />

## Important details

* Retention policies are processed in a daily job; so changes in the
  policy won't have any effect until the next time the daily job runs.
* Deleted messages are preserved temporarily in a special archive.  So
  if you discover a misconfiguration accidentally deleted content you
  meant to preserve, contact Zulip support promptly for assistance with
  restoration.  See the [deletion
  documentation](/help/delete-a-message#delete-a-message-completely) for
  more details on precisely how message deletion works in Zulip.

## Related articles

* [Edit a message](/help/edit-a-message)
* [Delete a message](/help/delete-a-message)
* [Delete a topic](/help/delete-a-topic)
* [Archive a channel](/help/archive-a-channel)
* [Configure automated notices for channel events](/help/configure-automated-notices#channel-events)
```

--------------------------------------------------------------------------------

---[FILE: messaging-tips.mdx]---
Location: zulip-main/starlight_help/src/content/docs/messaging-tips.mdx

```text
---
title: Messaging tips & tricks
---

import MessagingTips from "../include/_MessagingTips.mdx";

<MessagingTips />

## Related articles

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Introduction to topics](/help/introduction-to-topics)
* [Starting a new direct message](/help/starting-a-new-direct-message)
* [Replying to messages](/help/replying-to-messages)
```

--------------------------------------------------------------------------------

---[FILE: migrating-from-other-chat-tools.mdx]---
Location: zulip-main/starlight_help/src/content/docs/migrating-from-other-chat-tools.mdx

```text
---
title: Migrating from other chat tools
---

import ZulipNote from "../../components/ZulipNote.astro";

If your organization is moving to Zulip from another chat tool, follow the
dedicated guide to get started.

* [Moving from **Slack**](/help/moving-from-slack). You can [import your Slack
  workspace](/help/import-from-slack). Zulip's [Slack-compatible incoming
  webhook](https://zulip.com/integrations/slack_incoming) also makes it easy
  to migrate any integrations.
* [Moving from **Microsoft Teams**](/help/moving-from-teams).
* [Moving from **Discord**](/help/moving-from-discord).
* [Import from **Mattermost**](/help/import-from-mattermost), then follow the
  general [guide on moving to Zulip](/help/moving-to-zulip).
* [Import from **Rocket.Chat**](/help/import-from-rocketchat), then follow the
  general [guide on moving to Zulip](/help/moving-to-zulip).
* For all other tools, follow the general [guide on moving to
  Zulip](/help/moving-to-zulip).

<ZulipNote>
  You can import data from Slack, Mattermost, and Rocket.Chat. **You can only
  import a workspace as a new Zulip organization.** Your imported message history
  cannot be added into an existing Zulip organization.
</ZulipNote>

## Related articles

* [Zulip Cloud or self-hosting?](/help/zulip-cloud-or-self-hosting)
* [Trying out Zulip](/help/trying-out-zulip)
* [Self-hosting Zulip](https://zulip.com/self-hosting/)
* [Installing a Zulip server](https://zulip.readthedocs.io/en/stable/production/install.html)
* [Moving to Zulip](/help/moving-to-zulip)
* [Getting started with Zulip](/help/getting-started-with-zulip)
```

--------------------------------------------------------------------------------

````
