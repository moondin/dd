---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 476
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 476 of 1290)

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

---[FILE: view-images-and-videos.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-images-and-videos.mdx

```text
---
title: View images and videos
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipTip from "../../components/ZulipTip.astro";

import CopyIcon from "~icons/zulip-icon/copy";

Zulip shows previews of attached images and videos, unless previews are
[disabled](/help/image-video-and-website-previews) in your organization.
You can click on a preview to view an image in more detail, or to play a
video. Zulip also makes it convenient to browse all images and videos
attached to messages in your current view.

## Use the image viewer

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click an image preview to open the **image viewer**.
      1. You can interact with the image.
         * Zoom in and out of the image
         * Click and drag the image
         * **Reset zoom** so that the image is recentered and back to its original size
         * **Open** the image in a new browser tab
         * **Download** the image
      1. Click anywhere outside the image to close the image viewer once you are done.
    </Steps>

    <ZulipTip>
      You can click on the file name to download an image rather than viewing it
      in the Zulip app.
    </ZulipTip>

    <KeyboardTip>
      Use <kbd>V</kbd> to **open** the image viewer. Use <kbd>Shift</kbd> +
      <kbd>Z</kbd> and <kbd>Z</kbd> to zoom in and out of the image. Use
      <kbd>V</kbd> or <kbd>Esc</kbd> to **close** the image viewer.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Mobile">
    <Steps>
      1. Tap an image preview or file name to open the **image viewer**.
      1. You can interact with the image.
         * Zoom in and out of the image
         * Pan the image if you are zoomed in
         * Tap the **copy** (<CopyIcon />)
           icon in the bottom left corner of the app to copy a link to the image
      1. Tap the **X** in the upper left corner of the app to close the image viewer
         once you are done.
    </Steps>
  </TabItem>
</Tabs>

## Use the video player

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click a video thumbnail to open the **video player**.
      1. You can interact with the video.
         * **Play** the video
         * Adjust the **volume**
         * Watch in **full screen** mode
         * **Open** the video in a new browser tab
         * **Download** the video if it was uploaded to Zulip
         * Adjust **playback speed**
         * Turn on **picture-in-picture**
      1. Click anywhere outside the video to close the video player once you are done.
    </Steps>

    <ZulipTip>
      You can click on the file name to open the video in a new browser tab
      rather than viewing it in the Zulip app.
    </ZulipTip>

    <KeyboardTip>
      Use <kbd>V</kbd> to **open** the video player.
      Use <kbd class="arrow-key">↑</kbd> and <kbd class="arrow-key">↓</kbd>
      to increase or decrease the volume.
      Use <kbd>V</kbd> or <kbd>Esc</kbd> to **close** the video player.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Mobile">
    <Steps>
      1. Tap a video thumbnail, link, or file name to open the video in your device's
         default browser.
      1. You can switch back to the Zulip app once you are done.
    </Steps>
  </TabItem>
</Tabs>

## Browse images and videos

In the Zulip desktop or web app, you can browse the images and videos in
the current view. For example, if you're in a channel view, you'll be able
to browse through all the images and videos in that channel. If you do a
[search](/help/search-for-messages), the **viewer** will display all the
images and videos in messages matching that search.

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click an image preview or video thumbnail to open the viewer.
      1. Browse by using the left and right arrow buttons at the bottom of the viewer.
      1. Click any image or video to display it.
    </Steps>

    <KeyboardTip>
      Use <kbd>V</kbd> to **open** the viewer. Use
      <kbd class="arrow-key">←</kbd> and <kbd class="arrow-key">→</kbd>
      to scroll through the collection of images and videos.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Related articles

* [Manage your uploaded files](/help/manage-your-uploaded-files)
* [Share and upload files](/help/share-and-upload-files)
* [Image, video and website previews](/help/image-video-and-website-previews)
```

--------------------------------------------------------------------------------

---[FILE: view-messages-sent-by-a-user.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-messages-sent-by-a-user.mdx

```text
---
title: View messages sent by a user
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import RightSidebarUserCard from "../include/_RightSidebarUserCard.mdx";
import SelfUserCard from "../include/_SelfUserCard.mdx";

Zulip offers a convenient feature to search all messages sent by any user
including yourself.

## View messages sent by a user

<FlattenedSteps>
  <RightSidebarUserCard />

  1. Select **View messages sent** to view all messages sent by this user.
</FlattenedSteps>

## View messages you've sent

<FlattenedSteps>
  <SelfUserCard />

  1. Select **View messages sent** to view all the messages you've sent.
</FlattenedSteps>

<ZulipTip>
  You can also search your messages by typing `sender:me` in the
  search bar at the top of the app and pressing <kbd>Enter</kbd>.
</ZulipTip>

## View direct messages with yourself

<FlattenedSteps>
  <SelfUserCard />

  1. Select **View messages with yourself** to view messages you sent to
     yourself.
</FlattenedSteps>

## Related articles

* [Searching for messages](/help/search-for-messages)
```

--------------------------------------------------------------------------------

---[FILE: view-someones-profile.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-someones-profile.mdx

```text
---
title: View someone's profile
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import RightSidebarViewProfile from "../include/_RightSidebarViewProfile.mdx";

import LinkIcon from "~icons/zulip-icon/link";

A user's profile displays key information about the user.

## Information in a user's profile

<Tabs>
  <TabItem label="Desktop/Web">
    * Their name.
    * Their [availability](/help/status-and-availability#availability).
    * Their profile picture.
    * Their email address, if you [have
      permission](/help/configure-email-visibility) to view it.
    * Their user ID.
    * Their [role](/help/user-roles) in the organization.
    * The date they joined the organization.
    * Their current [local time](/help/change-your-timezone).
    * Any [custom profile fields](/help/custom-profile-fields) they've filled out.

    Additional tabs showing:

    * The channels that the user is subscribed to. Note that the list is limited to
      channels for which you have [permission to see all
      subscribers](/help/channel-permissions).
    * The [user groups](/help/user-groups) to which they belong.
  </TabItem>

  <TabItem label="Mobile">
    * Their name.
    * Their [availability](/help/status-and-availability#availability) and
      [status](/help/status-and-availability#statuses).
    * Their email address, if you [have
      permission](/help/configure-email-visibility) to view it.
    * Their [role](/help/user-roles) in the organization.
    * Any [custom profile fields](/help/custom-profile-fields) they've filled out.
  </TabItem>
</Tabs>

## View someone's profile

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <RightSidebarViewProfile />
    </FlattenedSteps>

    <ZulipTip>
      You can also click on a user's profile picture or name on a
      message they sent to open their **user card**, and skip to
      the last step.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <Steps>
      1. Tap on a user's profile picture or name.
    </Steps>
  </TabItem>
</Tabs>

## Share someone's profile

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <RightSidebarViewProfile />

      1. Click on the **link** (<LinkIcon />)
         icon to the right of their name to copy the URL for their profile.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Introduction to users](/help/introduction-to-users)
* [Edit your profile](/help/edit-your-profile)
* [Custom profile fields](/help/custom-profile-fields)
* [User cards](/help/user-cards)
```

--------------------------------------------------------------------------------

---[FILE: view-the-exact-time-a-message-was-sent.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-the-exact-time-a-message-was-sent.mdx

```text
---
title: View the exact time a message was sent
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import MessageLongPressMenu from "../include/_MessageLongPressMenu.mdx";

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Hover over the timestamp to the right of the message.
    </Steps>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />

      1. The timestamp will be at the top right of the menu.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Change the time format](/help/change-the-time-format)
* [Message actions](/help/message-actions)
```

--------------------------------------------------------------------------------

---[FILE: view-the-markdown-source-of-a-message.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-the-markdown-source-of-a-message.mdx

```text
---
title: View, copy, and share message content as Markdown
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import MessageActionsMenu from "../include/_MessageActionsMenu.mdx";
import MessageLongPressMenu from "../include/_MessageLongPressMenu.mdx";

import CopyIcon from "~icons/zulip-icon/copy";

Zulip messages are [formatted using
Markdown](/help/format-your-message-using-markdown). You can
[quote](/help/quote-or-forward-a-message#quote-a-message) or
[forward](/help/quote-or-forward-a-message#forward-a-message) a message, or
simply view, copy and share its content as Markdown.

## View message content as Markdown

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActionsMenu />

      1. Click **View original message**. You will not see the **View original message**
         menu option for editable messages that you have sent.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use the <kbd>E</kbd> shortcut to view the content of the
      selected message as Markdown.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Copy message content as Markdown

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActionsMenu />

      1. Click **View original message**. You will not see the **View original message**
         menu option for editable messages that you have sent.
      1. Click the **Copy and close**
         (<CopyIcon />)
         widget in the upper right corner of the message.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use the <kbd>E</kbd> shortcut to view the content of the
      selected message as Markdown.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />

      1. Tap **Copy message text**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Share message content

<Tabs>
  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />

      1. Tap **Share**, and choose the app to which you want to share message content.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Printing messages](/help/printing-messages)
* [Edit a message](/help/edit-a-message)
* [Delete a message](/help/delete-a-message)
* [Message actions](/help/message-actions)
```

--------------------------------------------------------------------------------

---[FILE: view-your-bots.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-your-bots.mdx

```text
---
title: View your bots
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

You can view the bots that you own, including deactivated bots.

You can also [deactivate](/help/deactivate-or-reactivate-a-bot#deactivate-a-bot),
[reactivate](/help/deactivate-or-reactivate-a-bot#reactivate-a-bot), or
[manage](/help/manage-a-bot) any of your bots.

<FlattenedSteps>
  <NavigationSteps target="settings/your-bots" />
</FlattenedSteps>

## Related articles

* [Bots overview](/help/bots-overview)
* [Integrations overview](/help/integrations-overview)
* [Add a bot or integration](/help/add-a-bot-or-integration)
* [Manage a bot](/help/manage-a-bot)
* [Deactivate or reactivate a bot](/help/deactivate-or-reactivate-a-bot)
* [View all bots in your organization](/help/view-all-bots-in-your-organization)
```

--------------------------------------------------------------------------------

---[FILE: view-your-mentions.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-your-mentions.mdx

```text
---
title: View your mentions
---

import ZulipNote from "../../components/ZulipNote.astro";
import ViewMentions from "../include/_ViewMentions.mdx";

You can [mention a user or a group](/help/mention-a-user-or-group) to call their
attention to a message. To make such messages easy to find, Zulip lets you view
the messages where you were mentioned from a dedicated tab.

<ZulipNote>
  Because [silent mentions](/help/mention-a-user-or-group#silently-mention-a-user)
  are designed not to attract attention, they are excluded from the
  **Mentions** tab.
</ZulipNote>

## View your mentions

<ViewMentions />

Topics with unread @-mentions are marked with an **@** indicator next to the
number of unread messages.

## Related articles

* [Mention a user or group](/help/mention-a-user-or-group)
* [DMs, mentions, and alerts](/help/dm-mention-alert-notifications)
* [Reading strategies](/help/reading-strategies)
```

--------------------------------------------------------------------------------

---[FILE: view-zulip-version.mdx]---
Location: zulip-main/starlight_help/src/content/docs/view-zulip-version.mdx

```text
---
title: View Zulip version
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import MobileMenu from "../include/_MobileMenu.mdx";

import GearIcon from "~icons/zulip-icon/gear";
import InfoIcon from "~icons/zulip-icon/info";

## Zulip server and web app version

If your organization self-hosts Zulip, the server administrator will need to
[upgrade Zulip][upgrade-zulip] in order for you to experience the latest
improvements. You can check which [version][changelog] of the Zulip server and
web app your organization is using.

Zulip Cloud organizations are always updated to the latest version of Zulip.

[upgrade-zulip]: https://zulip.readthedocs.io/en/stable/production/upgrade.html

[changelog]: https://zulip.readthedocs.io/en/latest/overview/changelog.html

### View Zulip server and web app version

<Tabs>
  <TabItem label="Zulip Server 6.0+">
    <Steps>
      1. Click on the **gear** (<GearIcon />) icon in the upper
         right corner of the web or desktop app.
      1. View the version number or Zulip Cloud plan in the top section of the menu.
      1. *(optional)* Click on the version number or Zulip Cloud plan for additional
         details.
    </Steps>
  </TabItem>

  <TabItem label="Zulip Server 4.0+">
    <FlattenedSteps>
      <NavigationSteps target="relative/gear/about-zulip" />

      1. View the version number under **Zulip Server**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

<ZulipTip>
  If the Zulip server is running a custom branch, the **merge base**
  will also be shown. It indicates which official version of Zulip
  the custom branch is based on.
</ZulipTip>

## Zulip desktop app version

The [Zulip desktop app](/apps/) has an independent version from the server and
web app.

### View Zulip desktop app version

<Steps>
  1. Click on the **Help** menu in the desktop app. The app version is shown in the
     dropdown: **Zulip Desktop v...**
</Steps>

## Zulip mobile app version

The [Zulip mobile apps](/apps/) have an independent version from the server and
web app.

### View Zulip mobile app version

<FlattenedSteps>
  <MobileMenu />

  1. Tap <InfoIcon /> **About Zulip**.
</FlattenedSteps>

## Related articles

* [Desktop app installation guides](/help/desktop-app-install-guide)
* [Mobile app installation guides](/help/mobile-app-install-guide)
* [Upgrading Zulip][upgrade-zulip]
* [Zulip release lifecycle](https://zulip.readthedocs.io/en/stable/overview/release-lifecycle.html)
```

--------------------------------------------------------------------------------

---[FILE: zulip-cloud-billing.mdx]---
Location: zulip-main/starlight_help/src/content/docs/zulip-cloud-billing.mdx

```text
---
title: Zulip Cloud billing
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AutomaticBilling from "../include/_AutomaticBilling.mdx";
import ConfigureWhoCanManagePlans from "../include/_ConfigureWhoCanManagePlans.mdx";
import InternationalWireTransfers from "../include/_InternationalWireTransfers.mdx";
import ManageBillingIntro from "../include/_ManageBillingIntro.mdx";
import ManualAddLicenseInstructions from "../include/_ManualAddLicenseInstructions.mdx";
import PayByInvoiceSteps from "../include/_PayByInvoiceSteps.mdx";
import PayByInvoiceWarning from "../include/_PayByInvoiceWarning.mdx";
import PaymentOptions from "../include/_PaymentOptions.mdx";
import PlanUpgradeSteps from "../include/_PlanUpgradeSteps.mdx";

import GearIcon from "~icons/zulip-icon/gear";

This page answers some frequently asked questions about [Zulip Cloud plans and
pricing](https://zulip.com/plans/). If you have any other questions, please
don't hesitate to reach out at [sales@zulip.com](mailto:sales@zulip.com).

## Upgrade to a Zulip Cloud Standard or Plus plan

<Tabs>
  <TabItem label="Pay by credit card">
    <FlattenedSteps>
      <NavigationSteps target="relative/gear-billing/plans" />

      1. On the page listing Zulip Cloud plans, click the button at the bottom
         of the plan you would like to purchase.

      <PlanUpgradeSteps />
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Pay by invoice">
    <PayByInvoiceWarning />

    <FlattenedSteps>
      <NavigationSteps target="relative/gear-billing/plans" />

      1. On the page listing Zulip Cloud plans, click the button at the bottom
         of the plan you would like to purchase.

      <PayByInvoiceSteps />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Manage billing

<ManageBillingIntro />

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/gear-billing/billing" />
    </FlattenedSteps>
  </TabItem>
</Tabs>

### Configure who can manage plans and billing

<ConfigureWhoCanManagePlans />

## Cancel paid plan

If you cancel your plan, your organization will be downgraded to **Zulip Cloud
Free** at the end of the current billing period.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/gear-billing/billing" />

      1. At the bottom of the page, click **Cancel plan**.
      1. Click **Downgrade** to confirm.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Free and discounted Zulip Cloud Standard

Zulip sponsors free plans for over 1000 worthy organizations. The following
types of organizations are generally eligible for a free **Zulip Cloud Standard** plan.

* Open-source projects, including projects with a small paid team.
* Research in an academic setting, such as research groups, cross-institutional
  collaborations, etc.
* Academic conferences and other non-profit events.
* Non-profits with no paid staff.
* Most communities that need features beyond the Free plan in order to use Zulip.

The following types of organizations are generally eligible for significant
discounts on **Zulip Cloud Standard**.

* Education organizations are eligible for [education
  pricing](https://zulip.com/for/education/#feature-pricing).
* Discounts are available for organizations based in the **developing world**.
* Non-profits and other organizations where many users are **not paid staff**
  are generally eligible for a discount.

If there are any circumstances that make regular pricing unaffordable for your
organization, contact [sales@zulip.com](mailto:sales@zulip.com) to discuss your
situation.

### Education pricing

Educators using Zulip with students are eligible for discounted [education
pricing](https://zulip.com/for/education/#feature-pricing). Other educational
uses (e.g., by teaching staff or university IT) may qualify for a non-profit
discount instead.

<ZulipTip>
  Organizations operated by individual educators (for example, a professor
  teaching one or more classes) usually find that the [Zulip Cloud Free
  plan](https://zulip.com/plans/#cloud) suits their needs.
</ZulipTip>

Non-profit educational pricing applies to online purchases with no additional
legal agreements, for use at registered non-profit institutions (e.g., colleges
and universities).

To arrange discounted pricing for your organization, please [apply for
sponosorship](#apply-for-sponsorship). Contact
[sales@zulip.com](mailto:sales@zulip.com) with any questions.

### Apply for sponsorship

Submit a sponsorship request to apply for a free or discounted **Zulip Cloud
Standard** plan. If you do not have a Zulip organization yet, contact
[sales@zulip.com](mailto:sales@zulip.com) to inquire about sponsorship
eligibility.

<Tabs>
  <TabItem label="Request sponsorship">
    <Steps>
      1. Click on the **gear** (<GearIcon />) icon in
         the upper right corner of the web or desktop app.
      1. Click the **Request sponsorship** link at the top of the gear menu.
      1. Fill out the requested information, and click **Submit**.
    </Steps>

    <ZulipTip>
      If you don't see the **Request sponsorship** link in the gear menu,
      update your [organization type](/help/organization-type) to one of
      the eligible types of organizations [listed
      above](#free-and-discounted-zulip-cloud-standard) that best fits
      your organization.
    </ZulipTip>
  </TabItem>

  <TabItem label="Request education pricing">
    <Steps>
      1. Click on the **gear** (<GearIcon />) icon in
         the upper right corner of the web or desktop app.
      1. Click the **Request education pricing** link at the top of the gear menu.
      1. Fill out the requested information, and click **Submit**.
    </Steps>

    <ZulipTip>
      If you don't see the **Request education pricing** link in the gear menu,
      update your [organization type](/help/organization-type) to either
      **Education (non-profit)** or **Education (for-profit)**.
    </ZulipTip>
  </TabItem>
</Tabs>

## Differences between Zulip Cloud plans

### How does having 10,000 messages of search history on Zulip Cloud Free work?

Only the most recent 10,000 messages can be viewed and searched on the Zulip
Cloud Free plan. Older messages are still stored and will become available
again if the organization is upgraded to **Zulip Cloud Standard**.

### Will you switch to limiting Zulip Cloud Free history to messages sent in the last 90 days (like Slack has)?

**No.** As discussed in [this blog
post](https://blog.zulip.com/2022/08/26/why-slacks-free-plan-change-is-causing-an-exodus/),
a time-based limit to message history is simply a bad model for a collaboration
tool.

## Payment methods

### What are my payment options?

<PaymentOptions />

### International SWIFT transfers

<InternationalWireTransfers />

### How does automatic license management work?

<AutomaticBilling />

### How does manual license management work?

With manual license management, you choose and pay for a fixed number of
licenses, which limits the number of users in your organization.

* If the limit is reached, unlike [automatic license
  management](#how-does-automatic-license-management-work), new users
  cannot join and existing users cannot be reactivated until licenses
  are manually added (or freed up by [deactivating existing
  users](/help/deactivate-or-reactivate-a-user)).
* When you add a license for the current billing period, you will be
  charged only for the remaining part of the billing period.
* If you have an annual billing period, each month, you will see a
  single charge for all licenses added the previous month. If you have
  a monthly billing period, the charge for licenses added during the
  previous month will be combined with your monthly renewal charge.

#### Manually update number of licenses

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/gear-billing/billing" />

      <ManualAddLicenseInstructions />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Temporary users and guests

### How will I be charged for temporary users (e.g., limited-time clients)?

Users [can be deactivated](/help/deactivate-or-reactivate-a-user) any time.
Deactivating a user frees up their license for reuse.

### How are guest accounts billed? Is there special pricing?

For an organization with N other users, 5\*N [guest users](/help/guest-users)
are included at no extra charge. After that, you will need to purchase an
extra license for every 5 additional guest users.

## Related articles

* [Trying out Zulip](/help/trying-out-zulip)
* [Zulip Cloud or self-hosting?](/help/zulip-cloud-or-self-hosting)
* [Self-hosted billing](/help/self-hosted-billing)
* [Migrating from other chat tools](/help/migrating-from-other-chat-tools)
* [Contact support](/help/contact-support)
```

--------------------------------------------------------------------------------

---[FILE: zulip-cloud-or-self-hosting.mdx]---
Location: zulip-main/starlight_help/src/content/docs/zulip-cloud-or-self-hosting.mdx

```text
---
title: Choosing between Zulip Cloud and self-hosting
---

import ZulipTip from "../../components/ZulipTip.astro";
import AdvantagesOfZulipCloud from "../include/_AdvantagesOfZulipCloud.mdx";

This page will help you decide whether [signing up for Zulip
Cloud](https://zulip.com/zulip-cloud/) or [self-hosting
Zulip](https://zulip.com/self-hosting/) best fits the needs of your
organization. For additional guidance, reach out to
[sales@zulip.com](mailto:sales@zulip.com).

<ZulipTip>
  If your needs change, you can always [move to a self-hosted
  installation](/help/cloud-to-self-hosting) or [to Zulip
  Cloud](/help/move-to-zulip-cloud).
</ZulipTip>

## Advantages of Zulip Cloud

<AdvantagesOfZulipCloud />

[Sign up](https://zulip.com/new/) with just a few clicks.

## Advantages of self-hosting Zulip

* **Under your control**: Retain full control over your data and simplify
  compliance by self-hosting Zulip behind your firewall.
* **Access to all of Zulip's features**: All [self-hosted
  plans](https://zulip.com/plans/#self-hosted) offer the same [100% open-source
  software][zulip-github]. Organizations that do not require support with their
  installation can always use Zulip for free with no limitations.
* **Simple set-up process**: It's easy to [install][install-zulip] Zulip
  directly on Ubuntu or Debian Linux, in <a href="https://github.com/zulip/docker-zulip">Docker</a>, or with prebuilt
  images for <a href="https://marketplace.digitalocean.com/apps/zulip">Digital
  Ocean</a> and <a href="https://render.com/docs/deploy-zulip">Render</a>.
* **Easy to maintain**: Zulip offers convenient tools for [backing
  up][back-up-zulip], and [maintaining][maintain-zulip] a self-hosted Zulip
  server.
* **Customizable**: Customize Zulip for all your needs. It's easy to develop and
  maintain [custom integrations](/api/incoming-webhooks-overview) and
  [features][modify-zulip].
* **Budget option**: For organizations with expertise in self-hosting their
  tools and a tight budget, the [Zulip Basic
  plan](https://zulip.com/plans/#self-hosted) can be a great choice.

Learn more about [self-hosting Zulip](https://zulip.com/self-hosting/).

[zulip-github]: https://github.com/zulip/zulip#readme

[install-zulip]: https://zulip.readthedocs.io/en/stable/production/install.html

[back-up-zulip]: https://zulip.readthedocs.io/en/stable/production/export-and-import.html#backups

[maintain-zulip]: https://zulip.readthedocs.io/en/stable/production/upgrade.html

[modify-zulip]: https://zulip.readthedocs.io/en/stable/production/modify.html

## Plans and pricing

Compare [Zulip Cloud](https://zulip.com/plans/#cloud) and [self-hosted
Zulip](https://zulip.com/plans/#self-hosted) pricing.

Free or heavily discounted pricing is available for most non-business uses.
Learn how to apply for a sponsored
[Cloud](https://zulip.com/help/zulip-cloud-billing#free-and-discounted-zulip-cloud-standard) or
[self-hosted](https://zulip.com/help/self-hosted-billing#apply-for-community-plan) plan.

## Related resources

* [Sign up for Zulip Cloud](https://zulip.com/new/)
* [Self-hosting Zulip](https://zulip.com/self-hosting/)
* [Trying out Zulip](/help/trying-out-zulip)
* [Plans and pricing](https://zulip.com/plans/)
* [Zulip Cloud billing](/help/zulip-cloud-billing)
* [Self-hosted billing](/help/self-hosted-billing)
```

--------------------------------------------------------------------------------

---[FILE: _AddAWideLogo.mdx]---
Location: zulip-main/starlight_help/src/content/include/_AddAWideLogo.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import CloudPaidPlansOnly from "../include/_CloudPaidPlansOnly.mdx";

<CloudPaidPlansOnly />

You can customize the logo users see in the top left corner
of the Zulip app. For best results:

* The logo should be a wide rectangle image with an 8:1 width to height ratio.
  It will be displayed at 200×25 pixels, or more on high-resolution displays.
* Make sure your logo has a transparent background, and trim any bordering
  whitespace.

To upload a logo:

<FlattenedSteps>
  <NavigationSteps target="settings/organization-profile" />

  1. Under **Organization logo**, click the image under **Light theme logo** or
     **Dark theme logo**, and choose a replacement image to upload.
  1. Crop the image as desired, and click **Save changes**.
</FlattenedSteps>

Make sure to test the logo in both light theme and [dark theme](/help/dark-theme).
```

--------------------------------------------------------------------------------

---[FILE: _AddUsersToAGroup.mdx]---
Location: zulip-main/starlight_help/src/content/include/_AddUsersToAGroup.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import DependsOnPermissions from "../include/_DependsOnPermissions.mdx";
import RightSidebarViewProfile from "../include/_RightSidebarViewProfile.mdx";

<DependsOnPermissions />

<Tabs>
  <TabItem label="Via group settings">
    <FlattenedSteps>
      <NavigationSteps target="relative/group/all" />

      1. Select a user group.
      1. Select the **Members** tab on the right.
      1. Under **Add members**, enter users you want to add. You can enter a
         `#channel` to add all subscribers to the group.
      1. Click **Add**. Zulip will notify everyone who is added to the group.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via user profile">
    <FlattenedSteps>
      <RightSidebarViewProfile />

      1. Select the **User groups** tab.
      1. Under **Add user to groups**, enter the groups you want to add the
         user to. You can start typing to filter suggestions.
      1. Click the **Add** button. Zulip will notify the user about the groups
         they've been added to.
    </FlattenedSteps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _AdminOnly.mdx]---
Location: zulip-main/starlight_help/src/content/include/_AdminOnly.mdx

```text
import ZulipNote from "../../components/ZulipNote.astro";

<ZulipNote>
  This feature is only available to organization owners and administrators.
</ZulipNote>
```

--------------------------------------------------------------------------------

---[FILE: _AdvantagesOfZulipCloud.mdx]---
Location: zulip-main/starlight_help/src/content/include/_AdvantagesOfZulipCloud.mdx

```text
* **No setup or maintenance overhead:** Zulip Cloud is a simple SaaS solution,
  so you don't need to set up your own server. It only take a minute to [sign
  up](https://zulip.com/new/).
* **Always up to date:** Zulip Cloud is updated every couple of weeks with the
  latest version of Zulip. In contrast, new features are
  [released](https://blog.zulip.com/tag/major-releases/) for self-hosted
  installations twice a year (with [maintenance
  releases](https://blog.zulip.com/tag/release-announcements/) in between).
* **Operated by experts:** Zulip Cloud is operated by the core team developing
  Zulip, with deep expertise in running your mission-critical chat software with
  [minimal downtime](https://status.zulip.com/).
* **Free to get started:** [Zulip Cloud Free](https://zulip.com/plans/#cloud)
  makes it easy to get started, and has all the features you need for casual
  use.
```

--------------------------------------------------------------------------------

---[FILE: _AppWillUpdateTip.mdx]---
Location: zulip-main/starlight_help/src/content/include/_AppWillUpdateTip.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

<ZulipTip>
  The app will update automatically to future versions.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _AutomatedDmChannelSubscription.mdx]---
Location: zulip-main/starlight_help/src/content/include/_AutomatedDmChannelSubscription.mdx

```text
import ZulipNote from "../../components/ZulipNote.astro";

<ZulipNote>
  **Note**: Subscribing someone else to a channel sends them an
  automated direct message from Notification Bot.
</ZulipNote>
```

--------------------------------------------------------------------------------

---[FILE: _AutomaticallyFollowTopics.mdx]---
Location: zulip-main/starlight_help/src/content/include/_AutomaticallyFollowTopics.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

### Follow topics you start or participate in

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/notifications" />

      1. Under **Topic notifications**, select the desired option from the
         **Automatically follow topics based on my participation** dropdown.
    </FlattenedSteps>
  </TabItem>
</Tabs>

### Follow topics where you are mentioned

You can automatically follow topics where you are personally
[mentioned](/help/mention-a-user-or-group). If this setting is enabled:

* You will automatically follow topics where you are personally mentioned, but
  group mentions and wildcard mentions (**@all**, **@topic**, etc.) will not
  affect topic status.
* You will automatically follow topics in [muted channels](/help/mute-a-channel)
  when you are mentioned.
* Mentions will *not* cause you to automatically follow topics you have
  explicitly [muted](/help/mute-a-topic).

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/notifications" />

      1. Under **Topic notifications**, toggle **Automatically follow topics where I'm
         mentioned**.
    </FlattenedSteps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _AutomaticallyUnmuteTopicsInMutedChannels.mdx]---
Location: zulip-main/starlight_help/src/content/include/_AutomaticallyUnmuteTopicsInMutedChannels.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/notifications" />

      1. Under **Topic notifications**, select the desired option from the
         **Automatically unmute topics in muted channels** dropdown.
    </FlattenedSteps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _AutomaticBilling.mdx]---
Location: zulip-main/starlight_help/src/content/include/_AutomaticBilling.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

<ZulipTip>
  Automatic license management is recommended unless you have a
  specific reason to choose manual license management.
</ZulipTip>

With automatic license management, you automatically purchase a Zulip
license for each user in your organization at the start of each billing
period (month or year), and whenever you need additional licenses.

* [Deactivating a user](/help/deactivate-or-reactivate-a-user) frees up
  their license for reuse. No refunds are given for unused licenses you
  have purchased for the current billing period. For example if you start
  an annual billing period with 10 users, and deactivate 4 users halfway
  through the year, then you will receive no refund, even if those licenses
  are not used in the remaining 6 months of the year.
* If you have no free licenses when a new user joins or an existing user
  is reactivated, you will be automatically billed for an additional
  license. You will be charged only for the remaining part of the
  billing period. For example, if you are on a $8/user/month monthly
  plan, you will be billed $4 for a user added halfway through the month.
* If you have an annual billing period, each month, you will see a
  single charge for all licenses added the previous month. If you have
  a monthly billing period, the charge for licenses added during the
  previous month will be combined with your monthly renewal charge.
```

--------------------------------------------------------------------------------

---[FILE: _BulletedListsExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_BulletedListsExamples.mdx

```text
### What you type

```
* bulleted lists
  * with sub-bullets too
  * sub-bullets start with 2 spaces
    * start sub-sub-bullets with 4 spaces
* multi
line
bullet
- dashes and
+ pluses are ok too
```

### What it looks like

![Markdown bullets](../../images/markdown-bullets.png)
```

--------------------------------------------------------------------------------

---[FILE: _BulletedListsIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_BulletedListsIntro.mdx

```text
Zulip supports Markdown formatting for bulleted lists.
You can create bulleted lists using `*`, `-`, or `+` at the start of each line.
Add two spaces before the bullet to create a nested list.
```

--------------------------------------------------------------------------------

````
