---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 479
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 479 of 1290)

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

---[FILE: _OwnerOnly.mdx]---
Location: zulip-main/starlight_help/src/content/include/_OwnerOnly.mdx

```text
import ZulipNote from "../../components/ZulipNote.astro";

<ZulipNote>
  This feature is only available to organization owners.
</ZulipNote>
```

--------------------------------------------------------------------------------

---[FILE: _ParagraphsAndSectionsExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ParagraphsAndSectionsExamples.mdx

```text
### What you type

```
One blank space for a new paragraph
New line, same paragraph

New paragraph

---, ***, or ___ for a horizontal line
Over the line

---

Under the line
```

### What it looks like

![Markdown paragraph](../../images/markdown-paragraph.png)
```

--------------------------------------------------------------------------------

---[FILE: _ParagraphsAndSectionsIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ParagraphsAndSectionsIntro.mdx

```text
Zulip supports Markdown formatting for paragraphs and visual section breaks,
which you can use to control the layout of your text and to visually separate
different sections of content.
```

--------------------------------------------------------------------------------

---[FILE: _PayByInvoiceSteps.mdx]---
Location: zulip-main/starlight_help/src/content/include/_PayByInvoiceSteps.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

1. Select **pay by invoice**.
1. Select your preferred option from the **Payment schedule** dropdown.
1. Select the **Number of licenses** you would like to purchase for your
   organization; see details about [manual license
   management](#how-does-manual-license-management-work).
1. Click **Update billing information** to enter your billing details,
   which will be included on invoices and receipts.
1. Click the **Send invoice** button, and an email with an initial
   invoice will be sent to the email address you used to sign in.
1. Your plan will be upgraded when the initial invoice is paid.

<ZulipTip>
  Until the initial invoice is paid, logging in to manage your billing
  will show a page with a link to the outstanding invoice. You'll be able
  to manage your plan once your first invoice is paid.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _PayByInvoiceWarning.mdx]---
Location: zulip-main/starlight_help/src/content/include/_PayByInvoiceWarning.mdx

```text
import ZulipNote from "../../components/ZulipNote.astro";

<ZulipNote>
  Only [manual license management](#how-does-manual-license-management-work) is available
  when paying by invoice. If you are using a non-US bank, please see
  [details](#international-swift-transfers) on making sure your payment covers
  the full amount of the invoice.
</ZulipNote>
```

--------------------------------------------------------------------------------

---[FILE: _PaymentOptions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_PaymentOptions.mdx

```text
You can pay by credit card or by invoice. If you choose to pay by
invoice, your organization will be upgraded to the plan you selected
once the initial invoice is paid.

Note that automatic license management is only available if you pay by
credit card. Paying by invoice requires manual license management.
```

--------------------------------------------------------------------------------

---[FILE: _PersonalMenu.mdx]---
Location: zulip-main/starlight_help/src/content/include/_PersonalMenu.mdx

```text
1. Click on your **profile picture** in the upper right
   corner of the web or desktop app.
```

--------------------------------------------------------------------------------

---[FILE: _PlanUpgradeSteps.mdx]---
Location: zulip-main/starlight_help/src/content/include/_PlanUpgradeSteps.mdx

```text
1. Select your preferred option from the **Payment schedule** dropdown.
1. Click **Add card** to enter your payment details.
1. *(optional)* **View and update** billing information included on
   receipts so that they are different from the information entered for
   the payment method, e.g., in case you would prefer that the company's
   name be on receipts instead of the card holder's name.
1. Click the **Purchase** button to complete your purchase.
```

--------------------------------------------------------------------------------

---[FILE: _PollsExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_PollsExamples.mdx

```text
### What you type

```
/poll What did you drink this morning?
Milk
Tea
Coffee
```

### What it looks like

![Markdown polls](../../images/markdown-polls.png)
```

--------------------------------------------------------------------------------

---[FILE: _PollsIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_PollsIntro.mdx

```text
Zulip makes it easy to create a poll. Polls in Zulip are collaborative, so
anyone can add new options to a poll. However, only the creator of the poll can
edit the question.
```

--------------------------------------------------------------------------------

---[FILE: _PrepareForTransition1.mdx]---
Location: zulip-main/starlight_help/src/content/include/_PrepareForTransition1.mdx

```text
1. Brief introduction to Zulip.
1. Why you're making this change. How do you expect it to improve communication
   in your organization?
1. Accompanying changes to your communication policies. Are there any changes
   to common workflows?
```

--------------------------------------------------------------------------------

---[FILE: _PrepareForTransition2.mdx]---
Location: zulip-main/starlight_help/src/content/include/_PrepareForTransition2.mdx

```text
1. Transition timeline.
1. How users will be supported during the transition.
```

--------------------------------------------------------------------------------

---[FILE: _QuotesExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_QuotesExamples.mdx

```text
### What you type

 ````
> a multi-line
quote on two lines

normal text

```quote
A multi-paragraph

quote in two paragraphs
```
 ````

### What it looks like

![Markdown quotes](../../images/markdown-quotes.png)
```

--------------------------------------------------------------------------------

---[FILE: _QuotesIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_QuotesIntro.mdx

```text
You can format quotes one line at a time, or create a block of text that will be
formatted as a quote.
```

--------------------------------------------------------------------------------

---[FILE: _ReadingConversations.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ReadingConversations.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import KeyboardTip from "../../components/KeyboardTip.astro";
import ConversationDefinition from "../include/_ConversationDefinition.mdx";
import ConversationRecommendation from "../include/_ConversationRecommendation.mdx";
import InboxInstructions from "../include/_InboxInstructions.mdx";
import InboxIntro from "../include/_InboxIntro.mdx";
import LeftSidebarConversations from "../include/_LeftSidebarConversations.mdx";
import RecentConversations from "../include/_RecentConversations.mdx";

import ChevronDownIcon from "~icons/fa/chevron-down";

<ConversationDefinition />

<ConversationRecommendation />

### Finding a conversation to read from the Inbox view

<InboxIntro />

<InboxInstructions />

### Finding a conversation to read from Recent conversations

<RecentConversations />

### Finding a conversation to read from the left sidebar

<LeftSidebarConversations />

### Reading conversations

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. [Find](/help/finding-a-conversation-to-read) a conversation to read.
      1. Read the conversation, scrolling down with the mouse or by pressing
         <kbd>PgDn</kbd>.
      1. If the conversation is not of interest, you can
         [mark all messages as read](/help/marking-messages-as-read) by
         jumping to the bottom with the **Scroll to bottom**
         (<ChevronDownIcon />) button or the <kbd>End</kbd> shortcut.
    </Steps>

    <KeyboardTip>
      Use the <kbd>N</kbd> key to go to the next unread topic, or <kbd>Shift</kbd> + <kbd>N</kbd>
      for the next unread [followed](/help/follow-a-topic) topic, or <kbd>P</kbd> for the next
      unread direct message conversation.
    </KeyboardTip>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _RecentConversations.mdx]---
Location: zulip-main/starlight_help/src/content/include/_RecentConversations.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import GoToRecentConversations from "../include/_GoToRecentConversations.mdx";

Use the **recent conversations** view to get
an overview of all the ongoing conversations. This view is particularly useful
for catching up on messages sent while you were away.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToRecentConversations />

      1. The filters at the top help you quickly find relevant conversations.
         For example, select **Participated** to filter to the conversations you
         have sent messages to.
      1. Click on a topic or DM conversation you're interested in to view it. You can
         return to **recent conversations** when done (e.g., by using the **back**
         button in your browser or desktop app) to select the next conversation.
    </FlattenedSteps>
  </TabItem>
</Tabs>

<ZulipTip>
  The **Participants** column shows which users recently sent a message (newest on the left).
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _RemoveUsersFromAGroup.mdx]---
Location: zulip-main/starlight_help/src/content/include/_RemoveUsersFromAGroup.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import DependsOnPermissions from "../include/_DependsOnPermissions.mdx";
import RightSidebarViewProfile from "../include/_RightSidebarViewProfile.mdx";

import CloseIcon from "~icons/zulip-icon/close";

<DependsOnPermissions />

<Tabs>
  <TabItem label="Via group settings">
    <FlattenedSteps>
      <NavigationSteps target="relative/group/all" />

      1. Select a user group.
      1. Select the **Members** tab on the right.
      1. Under **Members**, find the user or group you would like to remove.
      1. Click the **remove** (<CloseIcon />) icon in that row. Zulip will notify
         everyone who is removed from the group.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via user profile">
    <FlattenedSteps>
      <RightSidebarViewProfile />

      1. Select the **User groups** tab.
      1. Find the group you would like to remove the user from.
      1. Click the **remove** (<CloseIcon />) icon in that row. Zulip will notify
         the user about the groups they've been removed from.
    </FlattenedSteps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _ReplyingToMessages.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ReplyingToMessages.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import ZulipTip from "../../components/ZulipTip.astro";

import SendIcon from "~icons/zulip-icon/send";

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click the **Message...** button at the bottom of the app.
      1. Compose your message. You
         can [preview your message](/help/preview-your-message-before-sending) before
         sending.
      1. Click the **Send** (<SendIcon />) button, or
         use a [keyboard shortcut](/help/configure-send-message-keys) to send your
         message.
    </Steps>

    <ZulipTip>
      You can also reply by clicking on a message, or using the <kbd>R</kbd> or
      <kbd>Enter</kbd> keyboard shortcuts to reply to the message in the blue box.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <Steps>
      1. Tap the **Message ...** text in the compose box at the bottom of the app.
      1. Compose your message, and tap the **Send**
         (<SendIcon />) button in the
         bottom right corner of the app.
    </Steps>

    <ZulipTip>
      If you're reading messages in a [channel feed](/help/channel-feed),
      or the [combined feed](/help/combined-feed), navigate to the conversation
      view by tapping the message recipient bar of the conversation you want to
      reply to.
    </ZulipTip>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _ReviewOrganizationSettingsInstructions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ReviewOrganizationSettingsInstructions.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import UserGroupsIntro from "../include/_UserGroupsIntro.mdx";

Review the settings for your organization to set everything up how you want it
to be.

<UserGroupsIntro />

<FlattenedSteps>
  <NavigationSteps target="relative/gear/organization-settings" />

  1. Click on the **Organization settings** and **Organization
     permissions** tabs, as well as any others that are of interest.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: _RightSidebarUserCard.mdx]---
Location: zulip-main/starlight_help/src/content/include/_RightSidebarUserCard.mdx

```text
import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";

1. Hover over a user's name in the right sidebar.
1. Click on their avatar or the **ellipsis** (<MoreVerticalIcon />) to the right of their name to open their
   **user card**.
```

--------------------------------------------------------------------------------

---[FILE: _RightSidebarViewProfile.mdx]---
Location: zulip-main/starlight_help/src/content/include/_RightSidebarViewProfile.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import RightSidebarUserCard from "../include/_RightSidebarUserCard.mdx";

<FlattenedSteps>
  <RightSidebarUserCard />

  1. Click **View profile**.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: _SamlLoginButton.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SamlLoginButton.mdx

```text
* How you would like the Zulip log in button to be labeled: “Log in with...”
* *(optional)* An icon to use on the log in button
```

--------------------------------------------------------------------------------

---[FILE: _SaveChanges.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SaveChanges.mdx

```text
1. Click **Save changes**.
```

--------------------------------------------------------------------------------

---[FILE: _SearchNoteForDmConversations.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SearchNoteForDmConversations.mdx

```text
DM conversations hidden under **more conversations** will be included in your
search.
```

--------------------------------------------------------------------------------

---[FILE: _SelectChannelViewGeneral.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SelectChannelViewGeneral.mdx

```text
1. Select the **General** tab on the right.
```

--------------------------------------------------------------------------------

---[FILE: _SelectChannelViewPermissions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SelectChannelViewPermissions.mdx

```text
1. Select the **Permissions** tab on the right.
```

--------------------------------------------------------------------------------

---[FILE: _SelectChannelViewPersonal.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SelectChannelViewPersonal.mdx

```text
1. Select the **Personal** tab on the right.
```

--------------------------------------------------------------------------------

---[FILE: _SelectChannelViewSubscribers.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SelectChannelViewSubscribers.mdx

```text
1. Select the **Subscribers** tab on the right.
```

--------------------------------------------------------------------------------

---[FILE: _SelfHostedBillingLogInStep.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SelfHostedBillingLogInStep.mdx

```text
1. [Log in to billing management](#log-in-to-billing-management).
```

--------------------------------------------------------------------------------

---[FILE: _SelfUserCard.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SelfUserCard.mdx

```text
import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";

1. Hover over your name in the right sidebar.
1. Click on the **ellipsis** (<MoreVerticalIcon />)
   to open your [**user card**](/help/user-cards).
```

--------------------------------------------------------------------------------

---[FILE: _SendDm.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SendDm.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ComposeAndSendMessage from "../include/_ComposeAndSendMessage.mdx";
import MobileDirectMessages from "../include/_MobileDirectMessages.mdx";

import SendIcon from "~icons/zulip-icon/send";
import SquarePlusIcon from "~icons/zulip-icon/square-plus";

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      1. Click the **new direct message** (<SquarePlusIcon />)
         button next to the **direct messages** heading in the left sidebar, or
         the **New direct message** button at the bottom of the app.
      1. Start typing the name of the person or [group](/help/user-groups) you want to
         message, and select their name from the list of suggestions. You can continue
         adding as many message recipients as you like.

      <ComposeAndSendMessage />
    </FlattenedSteps>

    <KeyboardTip>
      You can also use the <kbd>X</kbd> keyboard shortcut to start a new direct
      message conversation.
    </KeyboardTip>

    <ZulipTip>
      You can also click on any user in the right sidebar to start composing
      a direct message to them. Or open their **user card** by clicking on
      their profile picture or name, and select **Send direct message**.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileDirectMessages />

      1. Tap the **New DM** button.
      1. Start typing the name of the person you want to message, and
         select their name from the list of suggestions. You can continue
         adding as many message recipients as you like.
      1. Approve by tapping the **Compose** button in the top right corner of the app.
      1. Compose your message, and tap the **Send**
         (<SendIcon />) button in the
         bottom right corner of the app.
    </FlattenedSteps>

    <ZulipTip>
      You can also tap on a user's profile picture or name, and tap the
      **Send direct message** button at the bottom of the app.
    </ZulipTip>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _SendUsInfo.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SendUsInfo.mdx

```text
If you are using Zulip Cloud, we'll take it from here! Please email
[support@zulip.com](mailto:support@zulip.com) with the following information:
```

--------------------------------------------------------------------------------

---[FILE: _SetStatus.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SetStatus.mdx

```text
1. Click **Set status** or **Edit status**.
1. Click to select one of the common statuses, *or* choose any emoji and/or
   write a short message.
1. Click **Save**.
```

--------------------------------------------------------------------------------

---[FILE: _SetUpYourAccount.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SetUpYourAccount.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

<ZulipTip>
  If this is your first time using Zulip, we recommend starting with the web
  or desktop experience to set up your account and get oriented.
</ZulipTip>

* Get the [mobile and desktop apps](/apps/). Zulip also works great in a
  [browser](/help/supported-browsers).
* [Add a profile picture](/help/change-your-profile-picture) and
  [edit your profile information](/help/edit-your-profile) to tell others
  about yourself.
* [Review your preferences](/help/review-your-settings#review-your-preferences).
  You can [switch between light and dark theme](/help/dark-theme), [customize
  the font size](/help/font-size), [pick your favorite emoji
  theme](/help/emoji-and-emoticons#change-your-emoji-set), [change your
  language](/help/change-your-language), and make other tweaks to your Zulip
  experience.
* [Browse and subscribe to channels](/help/introduction-to-channels#browse-and-subscribe-to-channels).
* Decide whether you want <kbd>Enter</kbd> [to send your message or add a
  new line](/help/configure-send-message-keys).
* [Configure your notifications](/help/review-your-settings#review-your-notification-settings)
  to work the way you do. If you're joining a low traffic organization and
  aren't using the desktop app, consider sending all messages to email.
```

--------------------------------------------------------------------------------

---[FILE: _SignUpForAPlan.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SignUpForAPlan.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

If you require features that are not available on [Zulip Cloud
Free](https://zulip.com/plans/#cloud) or the [Zulip
Free](https://zulip.com/plans/#self-hosted) plan for self-hosted organizations,
you will need to upgrade your plan.

<Tabs>
  <TabItem label="Zulip Cloud">
    <Steps>
      1. Follow the
         [instructions](/help/zulip-cloud-billing#upgrade-to-a-zulip-cloud-standard-or-plus-plan)
         to upgrade to a Zulip Cloud Standard or Plus plan. If your organization may
         be
         [eligible](/help/zulip-cloud-billing#free-and-discounted-zulip-cloud-standard)
         for a free or discounted plan, you can [apply for
         sponsorship](/help/zulip-cloud-billing#apply-for-sponsorship).
    </Steps>
  </TabItem>

  <TabItem label="Self hosting">
    <Steps>
      1. Follow the [instructions](/help/self-hosted-billing#upgrade-to-a-paid-plan)
         to upgrade to a Zulip Basic or Zulip Business plan. If your organization may
         be [eligible](/help/self-hosted-billing#free-community-plan) for a free or
         discounted plan, you can [apply for
         sponsorship](/help/self-hosted-billing#apply-for-community-plan). To inquire
         about Zulip Enterprise, please reach out to
         [sales@zulip.com](mailto:sales@zulip.com).
    </Steps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _SpoilersExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SpoilersExamples.mdx

```text
### What you type

 ````

```spoiler The spoiler heading might summarize what's inside
This content is initially hidden.

> You can combine spoilers with other formatting.

```

A message can contain both spoilers and other content.

```spoiler
Leave the heading blank if you like.
```

 ````

### What it looks like

Collapsed spoilers:

![Spoiler collapsed](../../images/spoiler-collapsed.png)

Expanded spoilers:

![Spoiler expanded](../../images/spoiler-expanded.png)
```

--------------------------------------------------------------------------------

---[FILE: _SpoilersIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SpoilersIntro.mdx

```text
Zulip lets you temporarily hide content in a collapsible **spoiler** section,
with only the header initially shown. Clicking on the header reveals the hidden
content.
```

--------------------------------------------------------------------------------

---[FILE: _StartComposing.mdx]---
Location: zulip-main/starlight_help/src/content/include/_StartComposing.mdx

```text
1. [Open the compose box](/help/open-the-compose-box).
```

--------------------------------------------------------------------------------

---[FILE: _StartingANewDirectMessage.mdx]---
Location: zulip-main/starlight_help/src/content/include/_StartingANewDirectMessage.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";
import SendDm from "../include/_SendDm.mdx";

<SendDm />

<ZulipTip>
  Rather than kicking off a group direct message, consider starting the
  conversation in a new topic to make it easier to browse later on.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _StartTopicViaLeftSidebar.mdx]---
Location: zulip-main/starlight_help/src/content/include/_StartTopicViaLeftSidebar.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ComposeAndSendMessage from "../include/_ComposeAndSendMessage.mdx";

import SquarePlusIcon from "~icons/zulip-icon/square-plus";

<FlattenedSteps>
  1. Click the **new topic** (<SquarePlusIcon />) button
     next to the name of the channel where you'd like to start a conversation.
  1. Enter a topic name. Think about finishing the sentence: “Hey, can we chat about… ?”

  <ComposeAndSendMessage />
</FlattenedSteps>

<KeyboardTip>
  You can also use the <kbd>C</kbd> keyboard shortcut to start a new topic in
  the channel you're viewing.
</KeyboardTip>
```

--------------------------------------------------------------------------------

---[FILE: _SubscribeUserToChannel.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SubscribeUserToChannel.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AutomatedDmChannelSubscription from "../include/_AutomatedDmChannelSubscription.mdx";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import DependsOnPermissions from "../include/_DependsOnPermissions.mdx";
import RightSidebarViewProfile from "../include/_RightSidebarViewProfile.mdx";
import SelectChannelViewSubscribers from "../include/_SelectChannelViewSubscribers.mdx";

<DependsOnPermissions />

<Tabs>
  <TabItem label="Via channel settings">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewSubscribers />

      1. Under **Add subscribers**, enter the user's name or email address. To
         subscribe users in bulk, you can copy members from an existing channel or
         [user group](/help/user-groups). The typeahead will only include users who
         aren't already subscribed to the channel.
      1. Configure **Send notification message to newly subscribed users** as desired.
      1. Click **Add**.
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>

  <TabItem label="Via user profile">
    <FlattenedSteps>
      <RightSidebarViewProfile />

      1. Select the **Channels** tab.
      1. Under **Subscribe user to channels**, select a channel from the
         dropdown list. You can start typing to filter channels.
      1. Click the **Subscribe** button.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via compose box">
    <Steps>
      1. Start a message in the channel you want to subscribe someone to, in a
         [new](/help/introduction-to-topics#how-to-start-a-new-topic) or
         [existing](/help/replying-to-messages) conversation.
      1. [Mention](/help/mention-a-user-or-group#from-the-compose-box) the user you
         want to subscribe.
      1. Click the **Subscribe them** button on the banner that appears above the
         compose box.
    </Steps>

    <ZulipTip>
      You don't have to send the message you started composing.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    Access this feature by following the web app instructions in your
    mobile device browser.

    Implementation of this feature in the mobile app is tracked [on
    GitHub](https://github.com/zulip/zulip-flutter/issues/1222). If
    you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>

<AutomatedDmChannelSubscription />
```

--------------------------------------------------------------------------------

---[FILE: _SupportingZulipMotivation.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SupportingZulipMotivation.mdx

```text
Zulip sponsors free [Zulip Cloud Standard](https://zulip.com/plans/) hosting for
hundreds of worthy organizations. Zulip has also invested into making it as easy
as possible to [self-host](https://zulip.com/self-hosting/) its [100%
open-source](https://github.com/zulip/zulip#readme) software. Read about the
[Zulip project values](https://zulip.com/values/) to learn more.
```

--------------------------------------------------------------------------------

---[FILE: _SwitchingBetweenOrganizations.mdx]---
Location: zulip-main/starlight_help/src/content/include/_SwitchingBetweenOrganizations.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import DesktopToggleSidebarTip from "../include/_DesktopToggleSidebarTip.mdx";
import MobileSwitchAccount from "../include/_MobileSwitchAccount.mdx";

<Tabs>
  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileSwitchAccount />

      1. Tap on the desired Zulip organization.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Desktop">
    <Steps>
      1. Click on a logo in the **organizations sidebar** on the left, or choose
         an organization from the **Window** menu in the top menu bar.
    </Steps>

    <DesktopToggleSidebarTip />
  </TabItem>

  <TabItem label="Web">
    You can log in to multiple Zulip organizations by opening multiple tabs, and
    logging into one Zulip organization in each tab. To switch Zulip organizations,
    just switch tabs.
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _TablesExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_TablesExamples.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

### What you type

```
|| yes | no | maybe
|---|---|:---:|------:
| A | left-aligned | centered | right-aligned
| B |     extra      spaces      |  are |  ok
| C | **bold** *italic* ~~strikethrough~~  :smile:  ||
```

<ZulipTip>
  The initial pipes (`|`) are optional if every entry in the first column is
  non-empty.
  The header separators (`---`) must be at least three dashes long.
</ZulipTip>

### What it looks like

![Markdown table](../../images/markdown-table.png)
```

--------------------------------------------------------------------------------

---[FILE: _TablesIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_TablesIntro.mdx

```text
Zulip supports Markdown formatting for tables.
```

--------------------------------------------------------------------------------

---[FILE: _ToDoListsExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ToDoListsExamples.mdx

```text
### What you type

```
/todo Today's tasks
Task 1: This is the first task.
Task 2: This is the second task.
Last task
```

### What it looks like

Tasks are marked (and unmarked) as completed by clicking the checkboxes
on the left.

![Markdown todo-lists](../../images/markdown-todo.png)
```

--------------------------------------------------------------------------------

---[FILE: _ToDoListsIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ToDoListsIntro.mdx

```text
Zulip supports creating shared to-do lists where any user who can access the
message can add tasks by entering the task's title and description, and clicking
**Add task**. Once created, task titles and descriptions cannot be edited. The task
list title can be edited any time by the to-do list's creator.
```

--------------------------------------------------------------------------------

---[FILE: _TopicActions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_TopicActions.mdx

```text
import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";

1. Hover over a topic in the left sidebar.
1. Click on the **ellipsis** (<MoreVerticalIcon />).
```

--------------------------------------------------------------------------------

---[FILE: _TopicLongPressMenu.mdx]---
Location: zulip-main/starlight_help/src/content/include/_TopicLongPressMenu.mdx

```text
1. Press and hold a topic until the long-press menu appears.
```

--------------------------------------------------------------------------------

---[FILE: _TopicLongPressMenuTip.mdx]---
Location: zulip-main/starlight_help/src/content/include/_TopicLongPressMenuTip.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

<ZulipTip>
  If you are viewing a single topic, you can access the long-press
  menu from the bar at the top of the app.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _TopicsIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_TopicsIntro.mdx

```text
Zulip is designed around conversations that are labeled with **topics**, to make
communication organized and efficient. It’s easy to get an overview of what
conversations are happening, and to read one conversation at a time.

Here is what topics look like in Zulip.

![Channels and topics](../../images/channels-and-topics.png)

Topics are one of the most wonderful aspects of using Zulip:

* Lots of conversations can happen in the same channel at the same time, each in
  its own topic. You never have to worry about interrupting — each conversation
  has its own space.
* Conversations can last many hours or days, letting everyone respond in their
  own time. Don't worry about replying long after a message is sent —
  everyone will see your reply in context.

[Learn more](https://zulip.com/why-zulip) about how Zulip's topic model helps
transform how your organization communicates.
```

--------------------------------------------------------------------------------

---[FILE: _TranslationProjectInfo.mdx]---
Location: zulip-main/starlight_help/src/content/include/_TranslationProjectInfo.mdx

```text
Zulip has been translated or partially translated into dozens of
languages by Zulip's amazing community of volunteer translators.
You can see which languages Zulip supports [on Weblate][weblate-zulip].

If you'd like to help by contributing as a translator, see the
[Zulip translation guidelines][translating-zulip] to get started.

[weblate-zulip]: https://hosted.weblate.org/projects/zulip/

[translating-zulip]: https://zulip.readthedocs.io/en/stable/translating/translating.html
```

--------------------------------------------------------------------------------

---[FILE: _UnsubscribeUserFromChannel.mdx]---
Location: zulip-main/starlight_help/src/content/include/_UnsubscribeUserFromChannel.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import DependsOnPermissions from "../include/_DependsOnPermissions.mdx";
import RightSidebarViewProfile from "../include/_RightSidebarViewProfile.mdx";
import SelectChannelViewSubscribers from "../include/_SelectChannelViewSubscribers.mdx";

import CloseIcon from "~icons/zulip-icon/close";

<DependsOnPermissions />

<Tabs>
  <TabItem label="Via channel settings">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewSubscribers />

      1. Under **Subscribers**, find the user you would like
         to unsubscribe from the channel.
      1. Click the **unsubscribe** (<CloseIcon />) icon in that row.
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>

  <TabItem label="Via user profile">
    <FlattenedSteps>
      <RightSidebarViewProfile />

      1. Select the **Channels** tab.
      1. Under **Subscribed channels**, find the channel you would like
         to unsubscribe the user from.
      1. Click the **unsubscribe** (<CloseIcon />) icon in that row.
    </FlattenedSteps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _UpgradeToPlusIfNeeded.mdx]---
Location: zulip-main/starlight_help/src/content/include/_UpgradeToPlusIfNeeded.mdx

```text
1. Make sure your Zulip Cloud organization is on the [Zulip Cloud
   Plus](https://zulip.com/plans/) plan.
```

--------------------------------------------------------------------------------

---[FILE: _UserCardThreeDotMenu.mdx]---
Location: zulip-main/starlight_help/src/content/include/_UserCardThreeDotMenu.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import RightSidebarUserCard from "../include/_RightSidebarUserCard.mdx";

import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";

<FlattenedSteps>
  <RightSidebarUserCard />

  1. Click on the **ellipsis** (<MoreVerticalIcon />) in the user card.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: _UserGroupsApplications.mdx]---
Location: zulip-main/starlight_help/src/content/include/_UserGroupsApplications.mdx

```text
Groups provide an easy way to refer to multiple users at once. You can:

* [Mention](/help/mention-a-user-or-group) a group of users,
  [notifying](/help/dm-mention-alert-notifications) everyone in the group as if
  they were personally mentioned.
* Compose a [direct message](/help/direct-messages) to a user group. This
  automatically puts all the users in the group into the addressee field.
* Subscribe a user group to a channel. This individually subscribes all the users
  in the group.
```

--------------------------------------------------------------------------------

---[FILE: _UserGroupsIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_UserGroupsIntro.mdx

```text
User groups offer a flexible way to manage permissions in your organization.
Most permissions in Zulip can be granted to any combination of
[roles](/help/user-roles), [groups](/help/user-groups), and
individual [users](/help/introduction-to-users).
```

--------------------------------------------------------------------------------

---[FILE: _UserRolesIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_UserRolesIntro.mdx

```text
Permissions in Zulip can be granted to any combination of
[roles](/help/user-roles), [groups](/help/user-groups), and
individual [users](/help/introduction-to-users).

User roles make it convenient to configure permissions for your organization.
You can decide what role a user will have when you [send them an
invitation](/help/invite-new-users), and later [change a user's
role](/help/user-roles#change-a-users-role) if needed.
```

--------------------------------------------------------------------------------

````
