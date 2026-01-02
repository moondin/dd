---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 474
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 474 of 1290)

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

---[FILE: share-and-upload-files.mdx]---
Location: zulip-main/starlight_help/src/content/docs/share-and-upload-files.mdx

```text
---
title: Share and upload files
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ModifyLinkText from "../include/_ModifyLinkText.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import AttachmentIcon from "~icons/zulip-icon/attachment";
import MobileCameraIcon from "~icons/zulip-icon/mobile-camera";
import MobileImageIcon from "~icons/zulip-icon/mobile-image";

Zulip supports attaching multiple files to messages, including images,
documents, sound, and video. You can edit the names of the files others see
after you [upload](#uploading-files) or
[share](#sharing-files-from-other-mobile-apps) them.

For images and videos, a small preview will be shown directly in the message, if
there are up to 24 attachments. People reading the message can click on the
preview to [view the full-size image or video](/help/view-images-and-videos).

## Uploading files

<Tabs>
  <TabItem label="Via drag-and-drop">
    <FlattenedSteps>
      1. Drag and drop one or more files anywhere in the Zulip app,
         whether or not the compose box is open.
         Zulip will upload the files, and insert named links using
         [Markdown formatting](/help/format-your-message-using-markdown#links):
         `[Link text](URL)`.

      <ModifyLinkText />
    </FlattenedSteps>

    <ZulipTip>
      You can [preview the message](/help/preview-your-message-before-sending)
      before sending to see what your uploaded files will look like.
    </ZulipTip>
  </TabItem>

  <TabItem label="Via paste">
    <FlattenedSteps>
      <StartComposing />

      1. Copy and paste one or more files into the compose box.
         Zulip will upload the files, and insert named links using
         [Markdown formatting](/help/format-your-message-using-markdown#links):
         `[Link text](URL)`.

      <ModifyLinkText />
    </FlattenedSteps>

    <ZulipTip>
      You can [preview the message](/help/preview-your-message-before-sending)
      before sending to see what your uploaded files will look like.
    </ZulipTip>
  </TabItem>

  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. Click the **paperclip** (<AttachmentIcon />)
         icon at the bottom of the compose box to select one or more files.
         Zulip will upload the files, and insert named links using
         [Markdown formatting](/help/format-your-message-using-markdown#links):
         `[Link text](URL)`.

      <ModifyLinkText />
    </FlattenedSteps>

    <ZulipTip>
      You can [preview the message](/help/preview-your-message-before-sending)
      before sending to see what your uploaded files will look like.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      1. Navigate to a channel, topic, or direct message view.
      1. Tap the
         **paperclip** (<AttachmentIcon />),
         **image** (<MobileImageIcon />),
         or **camera** (<MobileCameraIcon />)
         button at the bottom of the app to select one or more files. Zulip will
         upload the files, and insert named links using
         [Markdown formatting](/help/format-your-message-using-markdown#links):
         `[Link text](URL)`.

      <ModifyLinkText />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Sharing files from other mobile apps

<Tabs>
  <TabItem label="Android">
    <Steps>
      1. In another mobile app, select text or one or more files, and tap the
         **share** button.
      1. Tap the **Zulip** (<img src="/static/images/logo/zulip-icon-circle.svg" alt="logo" class="help-center-icon" />) logo to share to Zulip.
      1. To send a channel message, select a channel and type a topic name.
         To send a direct message, tap the **Direct message** tab, and choose
         an existing direct message conversation or tap the **New DM** button
         at the bottom of the screen and select message recipients.
      1. *(optional)* Write a message.
      1. Tap the **Send** button.
    </Steps>
  </TabItem>

  <TabItem label="iOS">
    Implementation of this feature for the IOS version of the mobile app is
    tracked [on GitHub](https://github.com/zulip/zulip-flutter/issues/54).
    If you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>

## Convert pasted to text to a file

When pasting a large amount of text, you can convert it to a text file upload.

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Paste a large amount of text into the compose box (2,000+ characters).
      1. In the banner above the compose box, click **Convert** to convert the
         pasted text to a file.
    </Steps>
  </TabItem>
</Tabs>

## Named file example

### What you type

```
[A whale of a good time](/user_uploads/1/46/IPvysqXEtiTG1ZdNBrwAZODi/whale-time.png)
```

### What it looks like

![Markdown image](../../images/markdown-image.png)

## File upload limits

The Zulip Cloud Standard and Zulip Cloud Plus
[plans](https://zulip.com/plans/#cloud) include 5 GB of file storage per user.
Each uploaded file can be up to 1 GB.

The Zulip Cloud Free [plan](https://zulip.com/plans/#cloud) includes a total of
5 GB of file storage. Each uploaded file can be up to 10 MB.

In organizations on a self-hosted server, server administrators can configure
the maximum size for uploaded files via the `MAX_FILE_UPLOAD_SIZE`
[server setting][system-settings]. Setting it to 0 disables file uploads, and
hides the UI for uploading files from the web and desktop apps.

[system-settings]: https://zulip.readthedocs.io/en/stable/production/settings.html

## Related articles

* [Manage your uploaded files](/help/manage-your-uploaded-files)
* [View images and videos](/help/view-images-and-videos)
* [Image, video and website previews](/help/image-video-and-website-previews)
* [Animated GIFs](/help/animated-gifs)
```

--------------------------------------------------------------------------------

---[FILE: spoilers.mdx]---
Location: zulip-main/starlight_help/src/content/docs/spoilers.mdx

```text
---
title: Spoilers
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import SpoilersExamples from "../include/_SpoilersExamples.mdx";
import SpoilersIntro from "../include/_SpoilersIntro.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import SpoilerIcon from "~icons/zulip-icon/spoiler";

<SpoilersIntro />

## Insert spoiler formatting

<Tabs>
  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. *(optional)* Select the text you want to hide inside the spoiler.
      1. Click the **Spoiler** (<SpoilerIcon />)
         icon at the bottom of the compose box to insert spoiler formatting.
      1. Replace `Header` with the desired heading text.
    </FlattenedSteps>

    <ZulipTip>
      You can also use the **Spoiler**
      (<SpoilerIcon />) icon
      to remove existing spoiler formatting from the selected text.
    </ZulipTip>
  </TabItem>

  <TabItem label="Via Markdown">
    <FlattenedSteps>
      <StartComposing />

      1. To create a spoiler section, use triple backticks and the word spoiler
         (` ```spoiler `) followed by an optional spoiler heading, some text, and triple
         backticks at the end:

         ````
         ```spoiler The spoiler heading
         This content is initially hidden.
         ```
         ````
    </FlattenedSteps>

    <ZulipTip>
      A message can contain both spoilers and other content, and you can combine
      spoilers with other formatting.
    </ZulipTip>
  </TabItem>
</Tabs>

## Examples

<SpoilersExamples />

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Resize the compose box](/help/resize-the-compose-box)
```

--------------------------------------------------------------------------------

---[FILE: star-a-message.mdx]---
Location: zulip-main/starlight_help/src/content/docs/star-a-message.mdx

```text
---
title: Star a message
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import MessageActions from "../include/_MessageActions.mdx";
import MessageLongPressMenu from "../include/_MessageLongPressMenu.mdx";
import TopicActions from "../include/_TopicActions.mdx";
import ViewStarredMessages from "../include/_ViewStarredMessages.mdx";

import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";
import StarIcon from "~icons/zulip-icon/star";
import StarFilledIcon from "~icons/zulip-icon/star-filled";

Starring messages is a good way to keep track of important messages, such as
tasks you need to go back to or documents you reference often.

## Star a message

Starred messages have a filled in star (<StarFilledIcon />)
to their right.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActions />

      1. Click the **star** (<StarIcon />) icon.
    </FlattenedSteps>

    <ZulipTip>
      You can unstar a message using the same instructions used to star it.
    </ZulipTip>

    <KeyboardTip>
      You can use <kbd>Ctrl</kbd> + <kbd>S</kbd> to star or unstar the selected
      message.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />

      1. Tap **Star message**.
    </FlattenedSteps>

    <ZulipTip>
      You can unstar a message by tapping **Unstar message** in the
      long-press menu.
    </ZulipTip>
  </TabItem>
</Tabs>

## View your starred messages

<ViewStarredMessages />

## Unstar all messages in a topic

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <TopicActions />

      1. Click **Unstar all messages in topic**. If you don't see this option,
         then you have no starred messages in the selected topic.
      1. Approve by clicking **Confirm**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Unstar all messages

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Hover over <StarIcon /> **Starred messages**
         in the **views** section of the left sidebar.
      1. Click on the **ellipsis** (<MoreVerticalIcon />).
      1. Click **Unstar all messages**. If you don't see this option,
         then you have no starred messages.
      1. Approve by clicking **Confirm**.
    </Steps>

    <ZulipTip>
      If the **views** section in the left sidebar is collapsed, click the
      triangle to the left of **views** to uncollapse it.
    </ZulipTip>
  </TabItem>
</Tabs>

## Toggle starred messages counter

By default, Zulip displays the number of starred messages in the left
sidebar; this allows you to use them as an inbox of messages you'd
like to come back to. If you are using starred messages for something
else and would prefer not to see the count in your left sidebar, you
can disable that feature.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/preferences" />

      1. Under **Left sidebar**, toggle **Show counts for starred messages**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Marking messages as unread](/help/marking-messages-as-unread)
* [Reading strategies](/help/reading-strategies)
* [Searching for messages](/help/search-for-messages)
```

--------------------------------------------------------------------------------

---[FILE: start-a-call.mdx]---
Location: zulip-main/starlight_help/src/content/docs/start-a-call.mdx

```text
---
title: Start a call
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import StartComposing from "../include/_StartComposing.mdx";

import VideoCallIcon from "~icons/zulip-icon/video-call";
import VoiceCallIcon from "~icons/zulip-icon/voice-call";

Zulip makes it convenient to add a video or voice call link to any message,
using the call provider (Jitsi, Zoom, etc.)
[configured](/help/configure-call-provider) by your organization's
administrators.

## Start a video call

<ZulipNote>
  When you join a call, you may need to log in to a separate account for the
  call provider (Jitsi, Zoom, etc.).
</ZulipNote>

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <StartComposing />

      1. Click the **Add video call** (<VideoCallIcon />)
         icon at the bottom of the compose box. This will insert a **Join video call.**
         link into your message.
      1. Send the message.
      1. Click on the link in the message to start or join the call.
    </FlattenedSteps>

    <ZulipTip>
      You can replace the "Join video call." label for the link with any text you
      like.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    Access this feature by following the web app instructions in your
    mobile device browser.

    Implementation of this feature in the mobile app is tracked [on
    GitHub](https://github.com/zulip/zulip-flutter/issues/1000). If
    you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>

## Start a voice call

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <StartComposing />

      1. Click the **Add voice call** (<VoiceCallIcon />) icon at the bottom of the compose box. This
         will insert a **Join voice call.** link into your message.
      1. Send the message.
      1. Click on the link in the message to start or join the call.
    </FlattenedSteps>

    <ZulipTip>
      You can replace the "Join voice call." label for the link with any text you
      like.
    </ZulipTip>
  </TabItem>
</Tabs>

## Unlink your Zoom account from Zulip

If you linked your Zoom account to Zulip, and no longer want it to be connected,
you can unlink it.

<Steps>
  1. Log in to the [Zoom App Marketplace](https://marketplace.zoom.us/), and
     select **Manage**.
  1. Select **Added Apps** and click the **Remove** button next to the Zulip app.
  1. Click **Confirm**.
</Steps>

[big-blue-button-configuration]: https://zulip.readthedocs.io/en/stable/production/video-calls.html#bigbluebutton

[zoom-configuration]: https://zulip.readthedocs.io/en/stable/production/video-calls.html#zoom

## Related articles

* [Configure call provider](/help/configure-call-provider)
* [Jitsi Meet integration](/integrations/jitsi)
* [Zoom integration](/integrations/zoom)
* [BigBlueButton integration](/integrations/big-blue-button)
* [Insert a link](/help/insert-a-link)
```

--------------------------------------------------------------------------------

---[FILE: starting-a-new-direct-message.mdx]---
Location: zulip-main/starlight_help/src/content/docs/starting-a-new-direct-message.mdx

```text
---
title: Starting a new direct message
---

import StartingANewDirectMessage from "../include/_StartingANewDirectMessage.mdx";

<StartingANewDirectMessage />

## Related articles

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Introduction to topics](/help/introduction-to-topics)
* [Replying to messages](/help/replying-to-messages)
* [Messaging tips & tricks](/help/messaging-tips)
```

--------------------------------------------------------------------------------

---[FILE: status-and-availability.mdx]---
Location: zulip-main/starlight_help/src/content/docs/status-and-availability.mdx

```text
---
title: Status and availability
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ClearStatus from "../include/_ClearStatus.mdx";
import MobileMenu from "../include/_MobileMenu.mdx";
import PersonalMenu from "../include/_PersonalMenu.mdx";
import SelfUserCard from "../include/_SelfUserCard.mdx";
import SetStatus from "../include/_SetStatus.mdx";

import UserCircleActiveIcon from "~icons/zulip-icon/user-circle-active";
import UserCircleIdleIcon from "~icons/zulip-icon/user-circle-idle";
import UserCircleOfflineIcon from "~icons/zulip-icon/user-circle-offline";

Status and availability let everyone know roughly how quickly you'll be
responding to messages.

A **status** is a customizable emoji, along with a short message. A typical
status might be "📅 In a meeting" or "🏠 Working remotely". To make it easy to
notice, the status emoji is shown next to your name in the sidebars, message
feed, and compose box.

Your **availability** is a colored dot (like <UserCircleActiveIcon />) that indicates if you're currently active on Zulip, idle,
or offline. You can also [go invisible](#invisible-mode) to appear offline
to other users.

## Statuses

### Set a status

You can set a status emoji, status message, or both.

<Tabs>
  <TabItem label="Via user card">
    <FlattenedSteps>
      <SelfUserCard />

      <SetStatus />
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via personal settings">
    <FlattenedSteps>
      <PersonalMenu />

      <SetStatus />
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileMenu />

      1. Tap **My profile**.
      1. Tap **Set status** or **Status**.
      1. Select one of the common statuses, or choose any emoji and/or write
         a short message.
      1. Tap **Save**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

### Clear a status

<Tabs>
  <TabItem label="Via user card">
    <FlattenedSteps>
      <SelfUserCard />

      <ClearStatus />
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via personal settings">
    <FlattenedSteps>
      <PersonalMenu />

      <ClearStatus />
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileMenu />

      1. Tap **My profile**.
      1. Tap **Status**.
      1. Tap **Clear**, and then **Save** in the top right corner of the app.
    </FlattenedSteps>
  </TabItem>
</Tabs>

### View a status

Status emoji are shown next to a user's name in the sidebars, message feed,
and compose box in the web and desktop apps, and next to the user's profile
picture and name in the mobile app.

Status emoji and status messages are also shown on [user cards](/help/user-cards)
in the web and desktop apps.

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Hover over a user's name in the right sidebar, or in the **Direct messages**
         section in the left sidebar, to view their status message if they have one
         set.
    </Steps>

    <ZulipTip>
      You can also click on a user's profile picture or name on a message they
      sent to view their status in their **user card**, or configure status text
      to always be shown in the right sidebar.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <Steps>
      1. Tap on a user's profile picture or name to view their status message.
      1. If they have one set, it will appear under their name on their profile.
    </Steps>
  </TabItem>
</Tabs>

### Configure how statuses are displayed

You can choose whether or not status text is displayed in the right sidebar.
With the compact option, only status emoji are shown.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/preferences" />

      1. Under **Information**, select **Compact** or **Show status and text** for the
         user list style.
    </FlattenedSteps>

    <ZulipTip>
      You can always hover over a user's name in the right sidebar to view their
      status message if they have one set.
    </ZulipTip>
  </TabItem>
</Tabs>

## Availability

There are three availability states:

* **Active** (<UserCircleActiveIcon />): Zulip is open and in focus on web,
  desktop or mobile, or was in the last 140 seconds.
* **Idle** (<UserCircleIdleIcon />): Zulip is open on your computer (either
  desktop or web), but you are not active.
* **Offline** (<UserCircleOfflineIcon />): Zulip is not open on your computer,
  or you have turned on invisible mode.

### View availability

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. View a user's availability on the [user list](/help/user-list) in the right
         sidebar, the [direct messages](/help/direct-messages) list in the left
         sidebar, or their [user card](/help/user-cards). If there is no availability
         indicator, the user is offline.
    </Steps>

    <ZulipTip>
      You can see when someone offline was last active by hovering over their
      name in the left or right sidebar.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <Steps>
      1. Tap on a user's profile picture or name. Their availability appears to the
         left of their name on their profile.
    </Steps>
  </TabItem>
</Tabs>

### Invisible mode

Zulip supports the privacy option of never updating the availability
information for your account. The result is that you will always
appear to other users as **Offline**, regardless of your activity in
Zulip.

With this setting, your "Last active" time displayed to other users in
the UI will be frozen as the approximate time you enabled this setting.
Your activity will still be included in your organization's [statistics](/help/analytics).

<ZulipTip>
  Consider also [not
  allowing](/help/read-receipts#configure-whether-zulip-lets-others-see-when-youve-read-messages)
  other users to see when you have read messages.
</ZulipTip>

### Toggle invisible mode

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <SelfUserCard />

      1. To enable, you'll select **Go invisible**.
      1. To disable, you'll select **Turn off invisible mode**.
    </FlattenedSteps>

    <ZulipTip>
      You can also toggle this setting in the **Account & privacy**
      tab of your **Personal settings** menu.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileMenu />

      1. Tap **My profile**.
      1. Toggle **Invisible mode**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Typing notifications](/help/typing-notifications)
* [Read receipts](/help/read-receipts)
```

--------------------------------------------------------------------------------

---[FILE: subscribe-users-to-a-channel.mdx]---
Location: zulip-main/starlight_help/src/content/docs/subscribe-users-to-a-channel.mdx

```text
---
title: Subscribe users to a channel
---

import SubscribeUserToChannel from "../include/_SubscribeUserToChannel.mdx";

Organization [administrators](/help/user-roles) can
[configure](/help/configure-who-can-invite-to-channels#configure-who-can-subscribe-others-to-channels-in-general)
who can subscribe other users to channels. Channel administrators can
configure who can
[subscribe](/help/configure-who-can-invite-to-channels#configure-who-can-subscribe-anyone-to-a-specific-channel)
anyone to a particular channel.

<SubscribeUserToChannel />

## Related articles

* [Introduction to channels](/help/introduction-to-channels)
* [Unsubscribe users from a channel](/help/unsubscribe-users-from-a-channel)
* [Manage a user's channel subscriptions](/help/manage-user-channel-subscriptions)
* [Configure who can subscribe other users to channels](/help/configure-who-can-invite-to-channels)
* [Set default channels for new users](/help/set-default-channels-for-new-users)
* [User roles](/help/user-roles)
* [Mention a user or group](/help/mention-a-user-or-group)
* [View channel subscribers](/help/view-channel-subscribers)
```

--------------------------------------------------------------------------------

---[FILE: support-zulip-project.mdx]---
Location: zulip-main/starlight_help/src/content/docs/support-zulip-project.mdx

```text
---
title: Support the Zulip project
---

import SupportingZulipMotivation from "../include/_SupportingZulipMotivation.mdx";

<SupportingZulipMotivation />

The Zulip community (which includes you!) is a huge part of what makes Zulip
successful. If you appreciate Zulip, there are many different ways you can
support the project. Some of these will only take a few minutes of your
time, but still make a big difference.

* [Support Zulip financially](#support-zulip-financially): Sponsoring Zulip
  helps fund free [Zulip Cloud Standard](https://zulip.com/plans/) hosting for
  hundreds of open source projects, research communities, and other worthy
  organizations.
* [Help others find Zulip](#help-others-find-zulip): As a business that's
  [growing sustainably](https://zulip.com/values/) without venture capital
  funding, Zulip cannot afford splashy ad campaigns to compete with giant
  corporations like Salesforce (Slack) and Microsoft (Teams). Zulip depends
  on users and other members of the community to spread the word about the
  difference that using Zulip's organized team chat has made for you or your
  organization.
* [Help improve Zulip](#help-improve-zulip): Zulip is developed by a [vibrant
  open-source community](https://zulip.com/team/), and there are many ways to
  contribute even without writing a single line of code.

## Support Zulip financially

You can sponsor Zulip through the [GitHub sponsors
program](https://github.com/sponsors/zulip) (preferred), on
[Patreon](https://patreon.com/zulip), or on [Open
Collective](https://opencollective.com/zulip).

## Help others find Zulip

* [**Link to Zulip**](/help/linking-to-zulip-website) from your organization's
  website. In addition to providing information for anyone browsing your
  website, this helps people find Zulip in Google and other search engines.
* [**List your organization**](/help/communities-directory) in the [Zulip
  communities directory](https://zulip.com/communities/). Browsing open
  communities helps folks see how others are using Zulip, and learn best
  practices.
* **Star** Zulip on GitHub. There are four main repositories:
  [server/web](https://github.com/zulip/zulip),
  [mobile](https://github.com/zulip/zulip-flutter),
  [desktop](https://github.com/zulip/zulip-desktop), and
  [Python API](https://github.com/zulip/python-zulip-api).
* **Review** Zulip on product comparison websites, such as
  [G2](https://www.g2.com/products/zulip/reviews/start) and [Software
  Advice](https://reviews.softwareadvice.com/new/316022). Organizations rely on
  review sites more and more when choosing software for their team, and sharing
  your experience with Zulip (good or bad) helps them evaluate whether Zulip
  might work for their needs.
* **Subscribe** to [our blog](https://blog.zulip.org/), and share our posts.
* **Mention** Zulip on social media, or like and retweet [Zulip's
  tweets](https://twitter.com/zulip), or retoot [Zulip's
  toots](https://fosstodon.org/@zulip).
* **Share** your Zulip story on your blog, or get it posted [on the Zulip
  website](https://zulip.com/use-cases/#customer-stories) (contact
  [support@zulip.com](mailto:support@zulip.com) to learn more).
* **Tell** your friends and colleagues about your Zulip experience.

## Help improve Zulip

* **Report issues**, including both [feature
  requests](https://zulip.readthedocs.io/en/latest/contributing/suggesting-features.html)
  and [bug
  reports](https://zulip.readthedocs.io/en/latest/contributing/reporting-bugs.html).
  Many improvements to the Zulip app start with a user's suggestion.
* [**Give
  feedback**](https://zulip.readthedocs.io/en/latest/contributing/suggesting-features.html#evaluation-and-onboarding-feedback)
  if you are evaluating or using Zulip.
* [**Translate**](https://zulip.readthedocs.io/en/latest/translating/translating.html)
  Zulip into your language. Zulip has been translated into over 25 languages by
  an amazing group of volunteers, and you can help expand, improve, and
  maintain the translation for your language, or start working on a language
  that hasn't been covered yet.
* [**Contribute
  code**](https://zulip.readthedocs.io/en/latest/contributing/contributing.html)
  to the Zulip open-source project. To make it easy for contributors from a
  variety of backgrounds to get started, we have invested into making Zulip’s
  code uniquely readable, well tested, and easy to modify.

## Related articles

* [Zulip project values](https://zulip.com/values/)
* [Linking to Zulip](/help/linking-to-zulip-website)
* [Zulip communities directory](/help/communities-directory)
* [Contact Zulip](/help/contact-support)
```

--------------------------------------------------------------------------------

---[FILE: supported-browsers.mdx]---
Location: zulip-main/starlight_help/src/content/docs/supported-browsers.mdx

```text
---
title: Supported browsers
---

import ZulipTip from "../../components/ZulipTip.astro";

In addition to the [mobile and desktop apps](https://zulip.com/apps/),
Zulip works great in all major modern web browsers. We recommend
pinning the Zulip tab in your favorite browser, so that it's always
easy to find.

For the best user experience, the latest stable versions of the
browsers below are recommended.

* [Chrome](https://www.google.com/chrome/)
* [Firefox](https://mozilla.org/en-US/firefox/browsers/)
* [Edge](https://microsoft.com/en-us/edge/)
* [Safari](https://apple.com/safari/)

## Multi protocol chat apps

Zulip is supported by most browser-based multi protocol desktop chat apps like
[Rambox](https://rambox.pro) and [Ferdium](https://ferdium.org/).

<ZulipTip>
  Choose an app that releases regular security updates. Running
  an out-of-date app is a major security risk for your computer.
</ZulipTip>

## Related articles

* [Desktop installation guides](/help/desktop-app-install-guide)
```

--------------------------------------------------------------------------------

---[FILE: switching-between-organizations.mdx]---
Location: zulip-main/starlight_help/src/content/docs/switching-between-organizations.mdx

```text
---
title: Switching between organizations
---

import SwitchingBetweenOrganizations from "../include/_SwitchingBetweenOrganizations.mdx";

This article assumes you've [logged in](/help/logging-in) to each organization at least once.

<SwitchingBetweenOrganizations />

## Related articles

* [Logging in](/help/logging-in)
* [Logging out](/help/logging-out)
* [Deactivate your account](/help/deactivate-your-account)
* [Create your organization profile](/help/create-your-organization-profile)
* [Joining a Zulip organization](/help/join-a-zulip-organization)
```

--------------------------------------------------------------------------------

---[FILE: tables.mdx]---
Location: zulip-main/starlight_help/src/content/docs/tables.mdx

```text
---
title: Tables
---

import TablesExamples from "../include/_TablesExamples.mdx";
import TablesIntro from "../include/_TablesIntro.mdx";

<TablesIntro />

## Examples

<TablesExamples />

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Resize the compose box](/help/resize-the-compose-box)
```

--------------------------------------------------------------------------------

---[FILE: text-emphasis.mdx]---
Location: zulip-main/starlight_help/src/content/docs/text-emphasis.mdx

```text
---
title: Text emphasis
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import EmphasisExamples from "../include/_EmphasisExamples.mdx";
import EmphasisIntro from "../include/_EmphasisIntro.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import BoldIcon from "~icons/zulip-icon/bold";
import ItalicIcon from "~icons/zulip-icon/italic";
import StrikethroughIcon from "~icons/zulip-icon/strikethrough";

<EmphasisIntro />

## Making text bold

<Tabs>
  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. Select the text you want to format.
      1. Click the **Bold** (<BoldIcon />) icon at the
         bottom of the compose box.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Ctrl</kbd> + <kbd>B</kbd> to insert bold formatting.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Via Markdown">
    <FlattenedSteps>
      <StartComposing />

      1. To make text bold, use double asterisks (`**`) around the text: `**text**`.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Ctrl</kbd> + <kbd>B</kbd> to insert bold formatting.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Making text italic

<Tabs>
  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. Select the text you want to format.
      1. Click the **Italic** (<ItalicIcon />) icon at
         the bottom of the compose box.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Ctrl</kbd> + <kbd>I</kbd> to insert italic formatting.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Via Markdown">
    <FlattenedSteps>
      <StartComposing />

      1. To make text italic, use single asterisks (`*`) around the text: `*text*`.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Ctrl</kbd> + <kbd>I</kbd> to insert italic formatting.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Applying strikethrough formatting

<Tabs>
  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. Select the text you want to format.
      1. Click the **Strikethrough**
         (<StrikethroughIcon />) icon at the
         bottom of the compose box.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via Markdown">
    <FlattenedSteps>
      <StartComposing />

      1. To apply strikethrough formatting, use two tildes (`~~`) around the text:
         `~~text~~`.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Examples

<EmphasisExamples />

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Resize the compose box](/help/resize-the-compose-box)
```

--------------------------------------------------------------------------------

---[FILE: topic-notifications.mdx]---
Location: zulip-main/starlight_help/src/content/docs/topic-notifications.mdx

```text
---
title: Topic notifications
---

import AutomaticallyFollowTopics from "../include/_AutomaticallyFollowTopics.mdx";
import AutomaticallyUnmuteTopicsInMutedChannels from "../include/_AutomaticallyUnmuteTopicsInMutedChannels.mdx";
import ConfigureNotificationsForFollowedTopics from "../include/_ConfigureNotificationsForFollowedTopics.mdx";

In Zulip, you can configure how you get notified about new messages for topics
you follow.

In muted channels, topics you follow are automatically treated as
[unmuted](/help/mute-a-topic), and you can configure when to automatically
unmute topics.

## Configure notifications for followed topics

<ConfigureNotificationsForFollowedTopics />

## Automatically follow topics

<AutomaticallyFollowTopics>
  ### Follow topics you start or participate in

  ### Follow topics where you are mentioned
</AutomaticallyFollowTopics>

## Automatically unmute topics in muted channels

<AutomaticallyUnmuteTopicsInMutedChannels />

## Related articles

* [Follow a topic](/help/follow-a-topic)
* [Channel notifications](/help/channel-notifications)
* [Mute or unmute a topic](/help/mute-a-topic)
* [Mute or unmute a channel](/help/mute-a-channel)
```

--------------------------------------------------------------------------------

---[FILE: trying-out-zulip.mdx]---
Location: zulip-main/starlight_help/src/content/docs/trying-out-zulip.mdx

```text
---
title: Trying out Zulip
---

import {Steps} from "@astrojs/starlight/components";

You can start by reading about how [Zulip’s](https://zulip.com/)
unique topic-based threading [combines the best of email and
chat](https://zulip.com/why-zulip/) to make [remote
work](https://zulip.com/for/business/) productive and delightful.

It's also easy to try out Zulip for yourself.

<Steps>
  1. **Check out the Zulip app**. You can:
     * [View the Zulip development community](https://chat.zulip.org/?show_try_zulip_modal),
       where hundreds of participants collaborate to improve Zulip. Many parts of
       the community are open for [public access](/help/public-access-option), so
       you can start exploring without creating an account.
     * [See how Zulip is being used](https://zulip.com/communities/) in open
       organizations that have opted in to be listed in the [Zulip communities
       directory](/help/communities-directory).
  1. [Create a Zulip Cloud organization](https://zulip.com/new/) for free in just
     a few minutes. This is a great way to explore Zulip even if you plan to
     [self-host](https://zulip.com/self-hosting/).
  1. [Invite your teammates](/help/invite-users-to-join) to explore Zulip with you.
     They will have a variety of perspectives on what's important in a chat app.
  1. **Run a week-long Zulip trial** with your team, without using any other chat tools. This
     is the only way to truly experience how a new chat app will help your team
     communicate. You can:
     * Customize [organization settings](/help/customize-organization-settings)
       and [settings for new users](/help/customize-settings-for-new-users), but
       plan to adjust the details as you go.
     * [Create](/help/create-channels) your initial
       [channels](/help/introduction-to-channels), including a dedicated channel for
       questions and feedback about using Zulip.
     * Educate others about how to use Zulip's [topics](/help/introduction-to-topics),
       and how to [move](/help/move-content-to-another-topic) any messages that
       belong elsewhere.
     * Set up [integrations](/help/integrations-overview) so that your team can
       experience all their regular workflows inside the Zulip app.
</Steps>

## Related articles

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Moving to Zulip](/help/moving-to-zulip)
* [Zulip Cloud or self-hosting?](/help/zulip-cloud-or-self-hosting)
* [Migrating from other chat tools](/help/migrating-from-other-chat-tools)
* [Introduction to topics](/help/introduction-to-topics)
```

--------------------------------------------------------------------------------

````
