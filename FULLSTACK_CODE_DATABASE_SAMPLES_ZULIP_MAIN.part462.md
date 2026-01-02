---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 462
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 462 of 1290)

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

---[FILE: enable-moderation-requests.mdx]---
Location: zulip-main/starlight_help/src/content/docs/enable-moderation-requests.mdx

```text
---
title: Enable moderation requests
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";

<AdminOnly />

When moderation requests are enabled, users can report problematic messages.
This sends a message to a private channel, where moderators can review the
report. To make it easy to see all reports about someone's behavior and discuss
them, there will be a dedicated topic for each user whose messages are reported.

If no channel for moderation requests is configured, users won't see the option
to report a message.

## Enable moderation requests

<FlattenedSteps>
  1. [Create](/help/create-channels) a
     [private](/help/channel-permissions#private-channels) channel for
     receiving moderation requests.

  <NavigationSteps target="settings/organization-settings" />

  1. Under **Automated messages and emails**, configure **Moderation requests**.
</FlattenedSteps>

## Disable moderation requests

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Automated messages and emails**, select **Disable** from the
     **Moderation requests** dropdown.
</FlattenedSteps>

## Configure where moderation requests are sent

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Automated messages and emails**, configure **Moderation requests**.
</FlattenedSteps>

## Related articles

* [Report a message](/help/report-a-message)
* [Delete a message](/help/delete-a-message)
* [Mute a user](/help/mute-a-user)
* [Deactivate or reactivate a user](/help/deactivate-or-reactivate-a-user)
* [Customize organization settings](/help/customize-organization-settings)
* [Community moderation toolkit](/help/moderating-open-organizations)
```

--------------------------------------------------------------------------------

---[FILE: export-your-organization.mdx]---
Location: zulip-main/starlight_help/src/content/docs/export-your-organization.mdx

```text
---
title: Export your organization
---

import {Steps} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import ExportWithoutConsentRequirements from "../include/_ExportWithoutConsentRequirements.mdx";
import NotHumanExportFormat from "../include/_NotHumanExportFormat.mdx";
import OwnerOnly from "../include/_OwnerOnly.mdx";

<ZulipNote>
  If you're self-hosting Zulip, you may want to check out the
  documentation on [server export and import][export-and-import] or
  [server backups][production-backups].
</ZulipNote>

Zulip has high quality export tools that can be used to migrate between the
hosted Zulip Cloud service and your own servers. Two types of data exports are
available for all Zulip organizations:

* [**Export of public
  data**](#export-for-migrating-to-zulip-cloud-or-a-self-hosted-server):
  Complete data for your organization *other than* [private
  channel](/help/channel-permissions#private-channels) messages and [direct
  messages](/help/direct-messages). This export includes user settings and
  channel subscriptions.
* [**Standard
  export**](#export-for-migrating-to-zulip-cloud-or-a-self-hosted-server):
  Everything in the export of public data, plus all the [private
  channel](/help/channel-permissions#private-channels) messages and [direct
  messages](/help/direct-messages) that members who have
  [allowed](#configure-whether-administrators-can-export-your-private-data)
  administrators to export their private data can access.

Two additional types of data exports are available to **corporate** [Zulip Cloud
Standard][plans] and [Zulip Cloud Plus][plans] customers:

[plans]: https://zulip.com/plans/

* [**Full export without member consent**](#full-export-without-member-consent):
  All the data in the organization.
* [**Compliance export**](#compliance-export): A targeted, human-readable export
  of messages matching some combination of criteria (e.g., sender, recipient,
  message keyword, or timestamp).

## Export for migrating to Zulip Cloud or a self-hosted server

<AdminOnly />

<NotHumanExportFormat />

<FlattenedSteps>
  <NavigationSteps target="settings/data-exports-admin" />

  1. Click **Start export**.
  1. Select the desired **Export type**.
  1. Click **Start export** to begin the export process. After a few minutes,
     you'll be able to download the exported data from the list of
     data exports.
  1. Use [Zulip's logical data import tool][import-only] to import your data into
     a self-hosted server. For Zulip Cloud imports, contact
     [support@zulip.com](mailto:support@zulip.com).
</FlattenedSteps>

<ZulipNote>
  Generating the export can take up to an hour for organizations
  with a large number of messages or uploaded files.
</ZulipNote>

## Full export without member consent

<OwnerOnly />

<NotHumanExportFormat />

<ExportWithoutConsentRequirements />

<Steps>
  1. Email [support@zulip.com](mailto:support@zulip.com) with your
     organization's `zulipchat.com` URL, asking for a **full export without
     member consent**. Please send the email from the same address
     that you use to sign in to Zulip, so that Zulip Support can verify
     that you are an owner of the organization.
  1. Once your authority to request the export has been verified, you will receive
     an archive in the `.tar.gz` format containing all the information for your
     organization.
  1. Import the tarball using [Zulip's logical data import tool][import-only].
</Steps>

If you self-host Zulip, a full export without member consent can be performed
[by your server's administrator][export-and-import].

## Compliance export

<OwnerOnly />

This type of export is recommended if you plan to work with the exported data
directly (e.g., reading messages or processing them with a script), rather than
importing the export into a new Zulip organization.

<ExportWithoutConsentRequirements />

<Steps>
  1. Email [support@zulip.com](mailto:support@zulip.com) asking for a **compliance
     export**. Please send the email from the same address that you use to sign in
     to Zulip, so that Zulip Support can verify that you are an owner of the
     organization. You will need to specify:
     1. The `zulipchat.com` URL for your organization
     1. What limits you would like on the export.  Currently, compliance
        exports can apply any combination of the following filters:
        * Message sender
        * Message recipient
        * Message contents, by specific keywords
        * Sent timestamp before, after, or between dates
          If you need other limits, please ask.
     1. Your preferred format for the export: CSV or JSON.
     1. Whether or not you want to receive copies of all attachments referenced in
        the exported messages.
  1. You will receive the requested information once your authority to request the
     export has been verified.
</Steps>

If you self-host Zulip, a compliance export can be performed [by your server's
administrator][compliance-exports-self-hosted].

## Configure whether administrators can export your private data

<FlattenedSteps>
  <NavigationSteps target="settings/account-and-privacy" />

  1. Under **Privacy**, toggle **Let administrators export my private data**.
</FlattenedSteps>

## Related articles

* [Move from Zulip Cloud to self-hosting](/help/cloud-to-self-hosting)
* [Move from self-hosting to Zulip Cloud](/help/move-to-zulip-cloud)
* [Change organization URL](/help/change-organization-url)
* [Deactivate your organization](/help/deactivate-your-organization)
* [Import organization into a self-hosted Zulip server][import-only]
* [Data export for self-hosted organizations][export-and-import]
* [Compliance exports for self-hosted organizations][compliance-exports-self-hosted]

[production-backups]: https://zulip.readthedocs.io/en/stable/production/export-and-import.html#backups

[export-and-import]: https://zulip.readthedocs.io/en/stable/production/export-and-import.html#data-export

[import-only]: https://zulip.readthedocs.io/en/stable/production/export-and-import.html#import-into-a-new-zulip-server

[compliance-exports-self-hosted]: https://zulip.readthedocs.io/en/stable/production/export-and-import.html#compliance-exports
```

--------------------------------------------------------------------------------

---[FILE: find-administrators.mdx]---
Location: zulip-main/starlight_help/src/content/docs/find-administrators.mdx

```text
---
title: Find administrators
---

import ZulipTip from "../../components/ZulipTip.astro";
import ViewUsersByRole from "../include/_ViewUsersByRole.mdx";

[Administrators](/help/user-roles) can take actions other users are
not permitted to, such as managing your organization's permissions settings.

<ZulipTip>
  Organization owners can do anything that an organization administrator can do.
</ZulipTip>

<ViewUsersByRole />

## Related articles

* [User roles](/help/user-roles)
* [Customize organization settings](/help/customize-organization-settings)
```

--------------------------------------------------------------------------------

---[FILE: finding-a-conversation-to-read.mdx]---
Location: zulip-main/starlight_help/src/content/docs/finding-a-conversation-to-read.mdx

```text
---
title: Finding a conversation to read
---

import ConversationDefinition from "../include/_ConversationDefinition.mdx";
import ConversationRecommendation from "../include/_ConversationRecommendation.mdx";
import InboxInstructions from "../include/_InboxInstructions.mdx";
import InboxIntro from "../include/_InboxIntro.mdx";
import LeftSidebarConversations from "../include/_LeftSidebarConversations.mdx";
import RecentConversations from "../include/_RecentConversations.mdx";

<ConversationDefinition />

<ConversationRecommendation />

## From the Inbox view

<InboxIntro />

<InboxInstructions />

## From Recent conversations

<RecentConversations />

## From the left sidebar

<LeftSidebarConversations />

## Related articles

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Reading strategies](/help/reading-strategies)
* [Reading conversations](/help/reading-conversations)
```

--------------------------------------------------------------------------------

---[FILE: follow-a-topic.mdx]---
Location: zulip-main/starlight_help/src/content/docs/follow-a-topic.mdx

```text
---
title: Follow a topic
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AutomaticallyFollowTopics from "../include/_AutomaticallyFollowTopics.mdx";
import ConfigureNotificationsForFollowedTopics from "../include/_ConfigureNotificationsForFollowedTopics.mdx";
import ConfigureTopicNotificationsDesktopWeb from "../include/_ConfigureTopicNotificationsDesktopWeb.mdx";
import FollowedTopicWorkflows from "../include/_FollowedTopicWorkflows.mdx";
import GoToInbox from "../include/_GoToInbox.mdx";
import ManageConfiguredTopicsDesktopWeb from "../include/_ManageConfiguredTopicsDesktopWeb.mdx";
import ManageConfiguredTopicsMobile from "../include/_ManageConfiguredTopicsMobile.mdx";
import TopicLongPressMenu from "../include/_TopicLongPressMenu.mdx";

import SearchIcon from "~icons/zulip-icon/search";

Zulip lets you follow topics you are interested in. You can follow or unfollow
any topic. You can also configure Zulip to automatically follow topics you start
or participate in. Participating in a topic means sending a message,
[reacting](/help/emoji-reactions) with an emoji, or participating in a
[poll](/help/create-a-poll). You can also automatically follow topics where you
are [mentioned](/help/mention-a-user-or-group).

It's easy to prioritize catching up on followed topics. You can:

* [Configure](/help/follow-a-topic#configure-notifications-for-followed-topics)
  how you get notified about new messages for topics you follow.
* Use the <kbd>Shift</kbd> + <kbd>N</kbd> [keyboard
  shortcut](/help/keyboard-shortcuts) to go to the next unread followed topic.
* Filter the [**Inbox**](/help/inbox) and [**Recent
  conversations**](/help/recent-conversations) views to only show followed
  topics.
* See which topics you are following in the **left sidebar**.

You can use followed topics for a variety of workflows:

<FollowedTopicWorkflows />

## Follow or unfollow a topic

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <ConfigureTopicNotificationsDesktopWeb />
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <TopicLongPressMenu />

      1. Tap **Follow topic** or **Unfollow topic**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Catch up on followed topics

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToInbox />

      1. Filter the view to the topics you follow by selecting **Followed topics**
         from the dropdown in the upper left of the **inbox** view.
      1. Click on a conversation you're interested in to view it. You can also use
         the arrow keys to select a conversation, and press <kbd>Enter</kbd>.
      1. Return to **Inbox** when done to select the next conversation. You can use
         the **back** button in your browser or the desktop app, <kbd>Shift</kbd> +
         <kbd>I</kbd>, or <kbd>Esc</kbd> if **Inbox** is configured as you [home
         view](/help/configure-home-view).
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Shift</kbd> + <kbd>N</kbd> from any location to go
      to the next unread followed topic.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Search for messages in followed topics

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click the **search** (<SearchIcon />) icon in the top bar to open the search box.
      1. Type `is:followed`, or start typing and select **Followed topics** from the
         typeahead.
      1. *(optional)* Enter additional search terms or
         [filters](/help/search-for-messages).
      1. Press <kbd>Enter</kbd>.
    </Steps>

    <KeyboardTip>
      You can also use the <kbd>/</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd>
      keyboard shortcut to start searching messages.
    </KeyboardTip>
  </TabItem>
</Tabs>

<ZulipTip>
  To get a feed of unread messages in all the topics you follow, search for
  `is:followed is:unread`.
</ZulipTip>

## Configure notifications for followed topics

You can configure custom notifications for followed topics. You can also
[configure the unread count
badge](/help/desktop-notifications#unread-count-badge) to include unread
messages just in followed topics, without counting other channel messages.

<ConfigureNotificationsForFollowedTopics />

## Automatically follow topics

<AutomaticallyFollowTopics>
  ### Follow topics you start or participate in

  ### Follow topics where you are mentioned
</AutomaticallyFollowTopics>

## Manage configured topics

<Tabs>
  <TabItem label="Desktop/Web">
    <ManageConfiguredTopicsDesktopWeb />
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <ManageConfiguredTopicsMobile />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Reading strategies](/help/reading-strategies)
* [Topic notifications](/help/topic-notifications)
* [Channel notifications](/help/channel-notifications)
* [Mute or unmute a topic](/help/mute-a-topic)
* [Mute or unmute a channel](/help/mute-a-channel)
```

--------------------------------------------------------------------------------

---[FILE: font-size.mdx]---
Location: zulip-main/starlight_help/src/content/docs/font-size.mdx

```text
---
title: Font size
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import PersonalMenu from "../include/_PersonalMenu.mdx";

import MinusIcon from "~icons/zulip-icon/minus";
import PlusIcon from "~icons/zulip-icon/plus";
import TypeBigIcon from "~icons/zulip-icon/type-big";

Zulip offers a range of font size options, from 12 to 20, to make the UI
feel comfortable on any screen.

## Change font size

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <PersonalMenu />

      1. Click <PlusIcon /> to increase the font size, <MinusIcon /> to decrease it, and <TypeBigIcon /> to reset to the default.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Zoom in or out

You can further adjust the font size by zooming in or out in your browser, or in
the Zulip desktop app.

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Use <kbd>Ctrl</kbd> + <kbd>+</kbd> to zoom in, <kbd>Ctrl</kbd> + <kbd>-</kbd>
         to zoom out, or <kbd>Ctrl</kbd> + <kbd>0</kbd> to reset to default zoom.
    </Steps>

    <ZulipTip>
      In the Zulip desktop app and most browsers, you can also open the **View**
      menu in the top menu bar, and click **Zoom In**, **Zoom Out**, or **Actual
      Size**.
    </ZulipTip>
  </TabItem>
</Tabs>

## Related articles

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Review your settings](/help/review-your-settings)
* [Configure default new user settings](/help/configure-default-new-user-settings)
* [Line spacing](/help/line-spacing)
* [Dark theme](/help/dark-theme)
```

--------------------------------------------------------------------------------

---[FILE: format-a-quote.mdx]---
Location: zulip-main/starlight_help/src/content/docs/format-a-quote.mdx

```text
---
title: Format a quote
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import QuotesExamples from "../include/_QuotesExamples.mdx";
import QuotesIntro from "../include/_QuotesIntro.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import QuoteIcon from "~icons/zulip-icon/quote";

<QuotesIntro />

## Insert quote formatting

<Tabs>
  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. *(optional)* Select the text you want to format.
      1. Click the **Quote** (<QuoteIcon />) icon at the
         bottom of the compose box to insert quote block formatting.
    </FlattenedSteps>

    <ZulipTip>
      You can also use the **Quote** (<QuoteIcon />)
      icon to remove existing quote formatting from the selected text.
    </ZulipTip>
  </TabItem>

  <TabItem label="Via Markdown">
    <FlattenedSteps>
      <StartComposing />

      1. To create a multi-line quote, type `>` followed by a space and some text:

         ```
         > a multi-line
         quote on two lines
         ```

         To create a multi-paragraph quote, use triple backticks and the word quote
         (` ```quote `) followed by some text and triple backticks at the end:

         ````
         ```quote
         A multi-paragraph

         quote in two paragraphs
         ```
         ````
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Examples

<QuotesExamples />

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Quote message](/help/quote-or-forward-a-message)
```

--------------------------------------------------------------------------------

---[FILE: format-your-message-using-markdown.mdx]---
Location: zulip-main/starlight_help/src/content/docs/format-your-message-using-markdown.mdx

```text
---
title: Message formatting
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import BulletedListsExamples from "../include/_BulletedListsExamples.mdx";
import BulletedListsIntro from "../include/_BulletedListsIntro.mdx";
import CodeBlocksExamples from "../include/_CodeBlocksExamples.mdx";
import CodeBlocksIntro from "../include/_CodeBlocksIntro.mdx";
import EmojiAndEmoticonsExamples from "../include/_EmojiAndEmoticonsExamples.mdx";
import EmojiAndEmoticonsIntro from "../include/_EmojiAndEmoticonsIntro.mdx";
import EmphasisExamples from "../include/_EmphasisExamples.mdx";
import EmphasisIntro from "../include/_EmphasisIntro.mdx";
import GlobalTimesExamples from "../include/_GlobalTimesExamples.mdx";
import GlobalTimesIntro from "../include/_GlobalTimesIntro.mdx";
import LatexExamples from "../include/_LatexExamples.mdx";
import LatexIntro from "../include/_LatexIntro.mdx";
import LinksExamples from "../include/_LinksExamples.mdx";
import LinksIntro from "../include/_LinksIntro.mdx";
import MeActionMessagesExamples from "../include/_MeActionMessagesExamples.mdx";
import MeActionMessagesIntro from "../include/_MeActionMessagesIntro.mdx";
import MentionsExamples from "../include/_MentionsExamples.mdx";
import MentionsIntro from "../include/_MentionsIntro.mdx";
import NumberedListsExamples from "../include/_NumberedListsExamples.mdx";
import NumberedListsIntro from "../include/_NumberedListsIntro.mdx";
import ParagraphsAndSectionsExamples from "../include/_ParagraphsAndSectionsExamples.mdx";
import ParagraphsAndSectionsIntro from "../include/_ParagraphsAndSectionsIntro.mdx";
import PollsExamples from "../include/_PollsExamples.mdx";
import PollsIntro from "../include/_PollsIntro.mdx";
import QuotesExamples from "../include/_QuotesExamples.mdx";
import QuotesIntro from "../include/_QuotesIntro.mdx";
import SpoilersExamples from "../include/_SpoilersExamples.mdx";
import SpoilersIntro from "../include/_SpoilersIntro.mdx";
import TablesExamples from "../include/_TablesExamples.mdx";
import TablesIntro from "../include/_TablesIntro.mdx";
import ToDoListsExamples from "../include/_ToDoListsExamples.mdx";
import ToDoListsIntro from "../include/_ToDoListsIntro.mdx";

import CodeIcon from "~icons/zulip-icon/code";
import LinkIcon from "~icons/zulip-icon/link";
import MathIcon from "~icons/zulip-icon/math";
import OrderedListIcon from "~icons/zulip-icon/ordered-list";
import PollIcon from "~icons/zulip-icon/poll";
import QuestionIcon from "~icons/zulip-icon/question";
import QuoteIcon from "~icons/zulip-icon/quote";
import SpoilerIcon from "~icons/zulip-icon/spoiler";
import TimeIcon from "~icons/zulip-icon/time";
import TodoListIcon from "~icons/zulip-icon/todo-list";
import UnorderedListIcon from "~icons/zulip-icon/unordered-list";

{/*
  - All screenshots here require line-height: 22px and font-size: 16px in .message-content.
  - Requires some additional fiddling for the LaTeX picture, inline code span, and maybe a few others.
  */}

Zulip uses Markdown to allow you to easily format your messages. Even if you've
never heard of Markdown, you are probably familiar with basic Markdown
formatting, such as using `*` at the start of a line in a bulleted list, or
around text to indicate emphasis.

Formatting buttons in the compose box make it easy to format your message. For
those who prefer to type the formatting they need, this page provides an
overview of all the formatting available in Zulip. There is a convenient
[message formatting reference](#message-formatting-reference) in the Zulip
app that you can use whenever you need a reminder of the formatting syntax
below.

* [Text emphasis](#text-emphasis)
* [Bulleted lists](#bulleted-lists)
* [Numbered lists](#numbered-lists)
* [Links](#links)
* [Code blocks](#code-blocks)
* [LaTeX](#latex)
* [Quotes](#quotes)
* [Spoilers](#spoilers)
* [Emoji and emoticons](#emoji-and-emoticons)
* [Mention a user or group](#mention-a-user-or-group)
* [/me action messages](#me-action-messages)
* [Global times](#global-times)
* [Tables](#tables)
* [Polls](#polls)
* [Collaborative to-do lists](#collaborative-to-do-lists)
* [Paragraph and section formatting](#paragraph-and-section-formatting)

## Text emphasis

<EmphasisIntro />

<EmphasisExamples />

<ZulipTip>
  You can also use buttons or keyboard shortcuts (<kbd>Ctrl</kbd> +
  <kbd>B</kbd> or <kbd>Ctrl</kbd> + <kbd>I</kbd>) to make text bold or italic.
  [Learn more](/help/text-emphasis).
</ZulipTip>

## Bulleted lists

<BulletedListsIntro />

<BulletedListsExamples />

<ZulipTip>
  You can also use the **Bulleted list**
  (<UnorderedListIcon />)
  button in the compose box to insert bulleted list formatting.
  [Learn more](/help/bulleted-lists).
</ZulipTip>

## Numbered lists

<NumberedListsIntro />

<NumberedListsExamples />

<ZulipTip>
  You can also use the **Numbered list**
  (<OrderedListIcon />)
  button in the compose box to insert numbered list formatting.
  [Learn more](/help/numbered-lists).
</ZulipTip>

## Links

<LinksIntro />

<LinksExamples />

<ZulipTip>
  You can also use the **Link**
  (<LinkIcon />)
  button or a keyboard shortcut (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> +
  <kbd>L</kbd>) to insert a link. [Learn more](/help/insert-a-link).
</ZulipTip>

## Code blocks

<CodeBlocksIntro />

<CodeBlocksExamples />

<ZulipTip>
  You can also use the **Code** (<CodeIcon />)
  button in the compose box to insert code formatting.
  [Learn more](/help/code-blocks).
</ZulipTip>

<KeyboardTip>
  You can also use <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>
  to insert code formatting.
</KeyboardTip>

## LaTeX

<LatexIntro />

<LatexExamples />

<ZulipTip>
  You can also use the **LaTeX** (<MathIcon />)
  button in the compose box to insert LaTeX formatting.
  [Learn more](/help/latex).
</ZulipTip>

## Quotes

<QuotesIntro />

<QuotesExamples />

<ZulipTip>
  There is a handy option to [quote message](/help/quote-or-forward-a-message) to a
  message in Zulip.
  You can also use the **Quote** (<QuoteIcon />)
  button in the compose box to insert quote formatting.
  [Learn more](/help/format-a-quote).
</ZulipTip>

## Spoilers

<SpoilersIntro />

<SpoilersExamples />

<ZulipTip>
  You can also use the **Spoiler**
  (<SpoilerIcon />) button in the compose
  box to insert spoiler formatting. [Learn more](/help/spoilers).
</ZulipTip>

## Emoji and emoticons

<EmojiAndEmoticonsIntro />

<EmojiAndEmoticonsExamples />

## Mention a user or group

<MentionsIntro />

<MentionsExamples />

## /me action messages

<MeActionMessagesIntro />

<MeActionMessagesExamples />

## Global times

<GlobalTimesIntro />

<GlobalTimesExamples />

<ZulipTip>
  You can also use the **Add global time**
  (<TimeIcon />) button in the compose
  box to select a time from the date picker. [Learn more](/help/global-times).
</ZulipTip>

## Tables

<TablesIntro />

<TablesExamples />

## Polls

<PollsIntro />

<PollsExamples />

<ZulipTip>
  You can also use the **Add poll** (<PollIcon />) button in the compose box to create a
  poll. [Learn more](/help/create-a-poll).
</ZulipTip>

## Collaborative to-do lists

<ToDoListsIntro />

<ToDoListsExamples />

<ZulipTip>
  You can also use the **Add to-do list** (<TodoListIcon />) button in the compose box to create a
  shared to-do list. [Learn more](/help/collaborative-to-do-lists).
</ZulipTip>

## Paragraph and section formatting

<ParagraphsAndSectionsIntro />

<ParagraphsAndSectionsExamples />

## Message formatting reference

A summary of the formatting syntax above is available in the Zulip app.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/help/message-formatting" />
    </FlattenedSteps>

    <ZulipTip>
      You can also [open the compose box](/help/open-the-compose-box), and click
      the **question mark** (<QuestionIcon />) icon
      at the bottom of the compose box.
    </ZulipTip>
  </TabItem>
</Tabs>

## Related articles

* [Create a poll](/help/create-a-poll)
* [Mention a user or group](/help/mention-a-user-or-group)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Resize the compose box](/help/resize-the-compose-box)
* [Messaging tips & tricks](/help/messaging-tips)
```

--------------------------------------------------------------------------------

---[FILE: gdpr-compliance.mdx]---
Location: zulip-main/starlight_help/src/content/docs/gdpr-compliance.mdx

```text
---
title: GDPR compliance
---

This page covers how Zulip interacts with the EU's landmark GDPR
legislation; you can read the
[Zulip Cloud privacy policy](https://zulip.com/policies/privacy) for our
general privacy policies.

## What is GDPR?

The General Data Protection Regulation (GDPR) is a wide-ranging law designed
to protect the privacy of individuals in the European Union (EU) and
give them control over how their personal data is collected,
processed, and used.  The law applies to any company that collects or
processes the data of European consumers.

## How Zulip supports GDPR compliance

GDPR compliance is supported [for Zulip
Cloud](#gdpr-compliance-with-zulip-cloud) and [for self-hosted Zulip
installations](#gdpr-compliance-for-self-hosted-installations).

A [Data Processing Addendum
(DPA)](https://zulip.com/static/images/policies/Zulip-Data-Processing-Addendum.pdf)
is incorporated into Zulip's [Terms of
Service](https://zulip.com/policies/terms).

## GDPR compliance with Zulip Cloud

The Zulip Cloud service is operated by Kandra Labs, Inc. To deliver the Zulip
Cloud service, Kandra Labs, Inc. acts as a compliant data
[processor](#background-on-controllers-and-processors), with each of our
customers acting as the data
[controller](#background-on-controllers-and-processors).  Kandra Labs receives
personal data from our customers in the context of providing our Zulip Cloud
team chat services to the customer.

Zulip makes it easy for organizations to comply with GDPR-related requests from
users:

* Zulip users can [edit their profile
  information](/help/edit-your-profile#edit-your-profile), [configure privacy
  settings](/help/review-your-settings#review-your-privacy-settings), and
  [delete their own
  messages](/help/delete-a-message#delete-a-message-completely) and [uploaded
  files](/help/manage-your-uploaded-files#delete-a-file), if permissions to do
  so are enabled by your organization.
* Organization administrators can also [edit or remove any user's profile
  information](/help/manage-a-user), or [deactivate a user](/help/deactivate-or-reactivate-a-user).
* You can [export](/help/export-your-organization) all the data related to a
  Zulip user or organization.
* The [Zulip REST API](/api/rest) lets you automate your processes for handling
  GDPR requests.

Contact [support@zulip.com](mailto:support@zulip.com) for
any assistance with GDPR compliance with Zulip Cloud.

## GDPR compliance for self-hosted installations

Compliance is often simpler when running software on-premises, since
you can have complete control over how your organization uses the data
you collect.

The Zulip [Mobile Push Notification Service][mobile-push] is operated by Kandra
Labs, Inc. Kandra Labs acts as a data processor to deliver the service, which
uses the same hosting infrastructure and [terms of
service](https://zulip.com/policies/terms) as Zulip Cloud.

[mobile-push]: https://zulip.readthedocs.io/en/stable/production/mobile-push-notifications.html

In addition to the features [described
above](#gdpr-compliance-with-zulip-cloud), the following tools help self-hosted
Zulip installations comply with GDPR-related requests from users:

* The Zulip server comes with a [command-line tool][management-commands],
  `manage.py export_single_user`, which is a variant of the main server
  [export tool][export-and-import-tool], that exports a single Zulip
  user's account details, preferences, channel subscriptions, and message
  history in a structured JSON format.
* The Django management shell (`manage.py shell`) and database shell
  (`manage.py dbshell`) allows you to query, access, edit, and delete
  data directly.

There's a lot more that goes into GDPR compliance, including securing your
server infrastructure responsibly, internal policies around access, logging, and
backups, etc. [Zulip Business](https://zulip.com/plans/#self-hosted) and [Zulip
Enterprise](https://zulip.com/plans/#self-hosted) customers can contact
[support@zulip.com](mailto:support@zulip.com) for assistance with GDPR
compliance with Zulip.

[management-commands]: https://zulip.readthedocs.io/en/stable/production/management-commands.html

[export-and-import-tool]: https://zulip.readthedocs.io/en/stable/production/export-and-import.html

## Background on controllers and processors

There are two key relationships that are defined in the GDPR. As a
customer of Zulip Cloud, you operate as the controller when using our
products and services. You have the responsibility for ensuring that
the personal data you are collecting is being processed in a lawful
manner as described above and that you are using processors, such as
Zulip Cloud, that are committed to handling the data in a compliant
manner.

Zulip Cloud is considered a **data processor**. We act on the
instructions of the controller (you). Similar to controllers,
processors are expected to enumerate how they handle personal data,
which we have outlined in this document and the legal documents listed
below. As a processor, we rely on our customers to ensure that there
is a lawful basis for processing.

Processors may leverage other third-parties in the processing of
personal data. These entities are commonly referred to as
sub-processors. For example, Kandra Labs leverages cloud service
providers like Amazon Web Services and Stripe to host Zulip Cloud.
See [full list of subprocessors for Zulip
Cloud](https://zulip.com/policies/subprocessors).

## Related articles

* [Zulip Cloud privacy policy](https://zulip.com/policies/privacy)
* [Terms of Service](https://zulip.com/policies/terms)
* [Data Processing Addendum
  (DPA)](https://zulip.com/static/images/policies/Zulip-Data-Processing-Addendum.pdf)
* [Subprocessors for Zulip Cloud](https://zulip.com/policies/subprocessors)
```

--------------------------------------------------------------------------------

---[FILE: general-chat-channels.mdx]---
Location: zulip-main/starlight_help/src/content/docs/general-chat-channels.mdx

```text
---
title: “General chat” channels
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewPermissions from "../include/_SelectChannelViewPermissions.mdx";

Zulip's [topics](/help/introduction-to-topics) help you keep conversations
organized, but you may not need topics in some channels (e.g., a social channel,
or one with a narrow purpose).

If you have permission to administer a channel, you can configure it to only
have the special “*general chat*” topic. The name of this topic is shown in
italics, and is translated into [your language](/help/change-your-language).

Users won't need to enter a topic when sending a message to a “*general chat*”
channel.

<ZulipTip>
  You can also allow topics, but [configure who can start new
  ones](/help/configure-who-can-start-new-topics).
</ZulipTip>

## Configure a channel to have only the “*general chat*” topic

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewPermissions />

      1. Under **Messaging permissions**, set **Allow posting to the *general chat*
         topic?** to **Only “general chat” topic allowed**.

      <SaveChanges />
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>
</Tabs>

## Related articles

* [Introduction to topics](/help/introduction-to-topics)
* [“*General chat*” topic](/help/general-chat-topic)
* [Require topics in channel messages](/help/require-topics)
* [Configure who can start new ones](/help/configure-who-can-start-new-topics)
```

--------------------------------------------------------------------------------

---[FILE: general-chat-topic.mdx]---
Location: zulip-main/starlight_help/src/content/docs/general-chat-topic.mdx

```text
---
title: “General chat” topic
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ComposeAndSendMessage from "../include/_ComposeAndSendMessage.mdx";
import GeneralChatIntro from "../include/_GeneralChatIntro.mdx";

import SquarePlusIcon from "~icons/zulip-icon/square-plus";

Zulip's [topics](/help/introduction-to-topics) help you keep conversations
organized, but you may sometimes want to send a message without a topic. For
example, this could be appropriate for social chatter, or for a one-off request
(e.g., “Is anyone around to help me out?”).

<GeneralChatIntro />

The “*general chat*” topic can be used only if [allowed](/help/require-topics)
by your organization's administrators, and channels can be
[configured](/help/general-chat-channels) to only allow the “*general chat*”
topic.

## Sending a message to the “*general chat*” topic

You can [reply](/help/replying-to-messages) to a message in the “*general chat*”
topic, or follow the instructions below.

<Tabs>
  <TabItem label="Via left sidebar">
    <FlattenedSteps>
      1. Click the **new topic** (<SquarePlusIcon />)
         button next to the name of the channel where you'd like to send a message.

      <ComposeAndSendMessage />
    </FlattenedSteps>

    <KeyboardTip>
      You can also use the <kbd>C</kbd> keyboard shortcut to send a message to
      the channel you're viewing.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Via compose box">
    <FlattenedSteps>
      1. Click the **Start new conversation** button at the bottom of the app.
      1. *(optional)* You can change the destination channel for your message using
         the dropdown in the top left of the compose box. Start typing to filter
         channels.

      <ComposeAndSendMessage />
    </FlattenedSteps>

    <KeyboardTip>
      You can also use the <kbd>C</kbd> keyboard shortcut to send a message to
      the channel you're viewing.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Related articles

* [Introduction to topics](/help/introduction-to-topics)
* [“*General chat*” channels](/help/general-chat-channels)
* [Require topics in channel messages](/help/require-topics)
```

--------------------------------------------------------------------------------

````
