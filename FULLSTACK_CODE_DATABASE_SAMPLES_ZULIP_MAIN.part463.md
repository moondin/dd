---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 463
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 463 of 1290)

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

---[FILE: generate-integration-url.mdx]---
Location: zulip-main/starlight_help/src/content/docs/generate-integration-url.mdx

```text
---
title: Generate URL for an integration
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";

import LinkIcon from "~icons/zulip-icon/link-2";
import UserCogIcon from "~icons/zulip-icon/user-cog";

Many [Zulip integrations](/integrations/) are webhooks. An incoming webhook
integration allows a third-party service, such as an [issue
tracker](/integrations/github) or an [alerting
tool](/integrations/pagerduty), to post updates to Zulip. To configure
where these updates will be posted, you need to generate a special Zulip
integration URL.

<Tabs>
  <TabItem label="Your bots">
    <FlattenedSteps>
      <NavigationSteps target="settings/your-bots" />

      1. In the **Actions** column, click the **link** (<LinkIcon />) icon for
         the **Incoming webhook** bot.
      1. Select the desired integration from the **Integration** dropdown.
      1. *(optional)* Select the destination channel from the
         **Where to send notifications** dropdown.
      1. *(optional)* Select **Send all notifications to a single topic**, and
         enter the topic name.
      1. *(optional)* Select **Filter events that will trigger notifications?**,
         and select which supported events should trigger notifications.
      1. Click **Copy URL** to add the URL to your clipboard.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="All bots">
    <AdminOnly />

    <FlattenedSteps>
      <NavigationSteps target="settings/bots" />

      1. In the **Actions** column, click the **link** (<LinkIcon />) icon for
         the **Incoming webhook** bot.
      1. Select the desired integration from the **Integration** dropdown.
      1. *(optional)* Select the destination channel from the
         **Where to send notifications** dropdown.
      1. *(optional)* Select **Send all notifications to a single topic**, and
         enter the topic name.
      1. *(optional)* Select **Filter events that will trigger notifications?**,
         and select which supported events should trigger notifications.
      1. Click **Copy URL** to add the URL to your clipboard.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Integrations overview](/help/integrations-overview)
* [Bots overview](/help/bots-overview)
* [Add a bot or integration](/help/add-a-bot-or-integration)
* [View all bots in your organization](/help/view-all-bots-in-your-organization)
* [Request an integration](/help/request-an-integration)
```

--------------------------------------------------------------------------------

---[FILE: getting-started-with-zulip.mdx]---
Location: zulip-main/starlight_help/src/content/docs/getting-started-with-zulip.mdx

```text
---
title: Getting started with Zulip
---

import HowToStartANewTopic from "../include/_HowToStartANewTopic.mdx";
import MessagingTips from "../include/_MessagingTips.mdx";
import ReadingConversations from "../include/_ReadingConversations.mdx";
import ReplyingToMessages from "../include/_ReplyingToMessages.mdx";
import SetUpYourAccount from "../include/_SetUpYourAccount.mdx";
import StartingANewDirectMessage from "../include/_StartingANewDirectMessage.mdx";
import TopicsIntro from "../include/_TopicsIntro.mdx";
import WhenToStartANewTopic from "../include/_WhenToStartANewTopic.mdx";

Welcome to Zulip! This page guides you through getting started using
Zulip. If you are setting up a new organization, you may also want to
check out our [guide for moving to Zulip](/help/moving-to-zulip).

You can learn where to find everything you need to get started with this
[2-minute video
tour](https://static.zulipchat.com/static/navigation-tour-video/zulip-10.mp4).
Mastering Zulip can take a bit of time, but once you get the hang of
it, you'll never want to use a different team chat app!

## Set up your account

<SetUpYourAccount />

## Learn about Zulip topics

<TopicsIntro />

## Reading your messages

<ReadingConversations>
  ### Finding a conversation to read from the Inbox view

  ### Finding a conversation to read from Recent conversations

  ### Finding a conversation to read from the left sidebar

  ### Reading conversations
</ReadingConversations>

## Sending messages

### When to start a new topic

<WhenToStartANewTopic />

### How to start a new topic

<HowToStartANewTopic />

### Starting a new direct message

<StartingANewDirectMessage />

### Responding to an existing thread

<ReplyingToMessages />

### Messaging tips & tricks

<MessagingTips />

## Related articles

* [Moving to Zulip](/help/moving-to-zulip)
```

--------------------------------------------------------------------------------

---[FILE: global-times.mdx]---
Location: zulip-main/starlight_help/src/content/docs/global-times.mdx

```text
---
title: Global times
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import GlobalTimesExamples from "../include/_GlobalTimesExamples.mdx";
import GlobalTimesIntro from "../include/_GlobalTimesIntro.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import TimeIcon from "~icons/zulip-icon/time";

<GlobalTimesIntro />

## Insert a time

<Tabs>
  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. Click the **Add global time** (<TimeIcon />)
         icon at the bottom of the compose box to open the date picker.
      1. Select the desired time by clicking with your mouse, or using the arrow
         keys + <kbd>Enter</kbd>.
      1. Click **Confirm** to insert the selected time.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via Markdown">
    <FlattenedSteps>
      <StartComposing />

      1. Type `<time`, and click **Mention a time-zone-aware time**, or press
         <kbd>Enter</kbd> to open the date picker.
      1. Select the desired time by clicking with your mouse, or using the arrow
         keys + <kbd>Enter</kbd>.
      1. Click **Confirm** to insert the selected time.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Examples

<GlobalTimesExamples />

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Resize the compose box](/help/resize-the-compose-box)
```

--------------------------------------------------------------------------------

---[FILE: guest-users.mdx]---
Location: zulip-main/starlight_help/src/content/docs/guest-users.mdx

```text
---
title: Guest users
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import CloudPlusOnly from "../include/_CloudPlusOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

You can add users who should have restricted access to your organization as
**guests**. For example, this may be a good choice for contractors or customers
invited to a company's Zulip chat.

Guest users **can**:

* View and send messages in channels they have been subscribed to, including
  viewing message history in the same way as other channel subscribers.

Guest users **cannot**:

* See private or public channels, unless they have been specifically subscribed
  to the channel.
* Create new channels or user groups.
* Add or manage bots.
* Add custom emoji.
* Invite users to join the organization.

You can also **configure** other permissions for guest users, such as whether they
can:

* [Move](/help/restrict-moving-messages) or
  [edit](/help/restrict-message-editing-and-deletion) messages.
* Notify a large number of users [with a wildcard
  mention](/help/restrict-wildcard-mentions).

Zulip Cloud plans have [special discounted
pricing](/help/zulip-cloud-billing#temporary-users-and-guests) for guest users.

## Configure guest indicator

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/organization-permissions" />

      1. Under **Guests**, toggle **Display “(guest)” after names of guest users**.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Configure warning when composing a DM to a guest

Zulip can display a warning to let users know when recipients for a direct
message they are composing are guests in your organization. The warning will be
shown as a banner in the compose box on the web and desktop apps.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/organization-permissions" />

      1. Under **Guests**, toggle **Warn when composing a DM to a guest**.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Configure whether guests can see all other users

<CloudPlusOnly />

You can restrict guests' ability to see other users in the organization. If you
do so, guests will be able to see information about other users only in the
following cases:

* The user belongs to a [direct message](/help/direct-messages) thread with the
  guest.
* The user is subscribed to one or more [channels](/help/introduction-to-channels) with
  the guest.

When a guest cannot see information about a user, the guest's experience will be
that:

* The user does not appear in the right sidebar.
* The user does not appear in typeahead suggestions, e.g., in the compose box
  and search.
* Otherwise, such a user will be displayed as an **Unknown user** in the Zulip
  app. For example, messages and reactions from a former subscriber of a channel
  will be shown as from an **Unknown user**.
* An **Unknown user**'s [user card](/help/user-cards) will not display
  information about that user. However, the guest can still search from all
  messages send by a particular **Unknown user** from that user's card.

In practice, guests should rarely encounter content from an **Unknown user**,
unless users in your organization frequently change their channel subscriptions
or are [deactivated](/help/deactivate-or-reactivate-a-user).

The only information guests can access about unknown users via the [API](/api/)
is which user IDs exist, and
[availability](/help/status-and-availability) updates for each user ID.

<ZulipTip>
  Self-hosted organizations can disable API access to availability updates
  by [configuring](https://zulip.readthedocs.io/en/stable/production/settings.html)
  `CAN_ACCESS_ALL_USERS_GROUP_LIMITS_PRESENCE = True`. For performance reasons,
  this is recommended only for organizations with up to \~100 users.
</ZulipTip>

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/organization-permissions" />

      1. Under **Guests**, configure **Who can view all other users in the
         organization**.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [User roles](/help/user-roles)
* [Invite new users](/help/invite-new-users)
* [Change a user's role](/help/user-roles#change-a-users-role)
* [Zulip Cloud billing](/help/zulip-cloud-billing)
```

--------------------------------------------------------------------------------

---[FILE: hide-message-content-in-emails.mdx]---
Location: zulip-main/starlight_help/src/content/docs/hide-message-content-in-emails.mdx

```text
---
title: Hide message content in emails
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";

<AdminOnly />

For security or compliance reasons, you may want to prevent Zulip message
content from being sent through your email system. The only place Zulip
currently sends message content is in message notification emails.

This setting also blocks message topics, channel names, and user names from
being sent through the email system.

### Hide message content in emails

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Notifications security**, toggle
     **Allow message content in message notification emails**.
</FlattenedSteps>

## Related articles

* [Hide message content in emails](/help/email-notifications#hide-message-content),
  as an individual.
* [End-to-end encryption (E2EE) for mobile push notifications](/help/mobile-notifications#end-to-end-encryption-e2ee-for-mobile-push-notifications)
```

--------------------------------------------------------------------------------

---[FILE: high-contrast-mode.mdx]---
Location: zulip-main/starlight_help/src/content/docs/high-contrast-mode.mdx

```text
---
title: High contrast mode
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

By default, some visual elements in Zulip (such as date/time stamps, certain
buttons, links and unread counts) are intentionally light. **High contrast mode**
increases the contrast of these elements to meet the AA level of the
W3C's Web Content Accessibility Guidelines.

<FlattenedSteps>
  <NavigationSteps target="settings/preferences" />

  1. Under **Preferences**, select **High contrast mode**.
</FlattenedSteps>

## Related articles

* [Accessibility in Zulip](https://zulip.readthedocs.io/en/stable/subsystems/accessibility.html)
```

--------------------------------------------------------------------------------

---[FILE: image-video-and-website-previews.mdx]---
Location: zulip-main/starlight_help/src/content/docs/image-video-and-website-previews.mdx

```text
---
title: Image, video and website previews
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

Zulip displays previews of images, videos and websites in your message feed. To
avoid disrupting the flow of conversation, these previews are small. You can
configure how animated images are previewed, and organization administrators can
also disable previews altogether.

## Configure how animated images are played

In the desktop and web apps, you can configure previews of animated images to
always show the animation, show it when you hover over the image with your
mouse, or not show it at all. For large animated images, only the first part of
the animation will be shown in the preview.

You can always see the full animated image by opening it in the [image
viewer](/help/view-images-and-videos).

<ZulipNote>
  This configuration applies only to images uploaded since July 21, 2024 on
  Zulip Cloud, or on Zulip Server [9.0+](/help/view-zulip-version) in
  self-hosted organizations. Previews of images uploaded earlier are always
  animated.
</ZulipNote>

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/preferences" />

      1. Under **Information**, select the desired option from the **Play animated
         images** dropdown.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Configure whether image and video previews are shown

<AdminOnly />

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Message feeed settings**, toggle **Show previews of uploaded and
     linked images and videos**.

  <SaveChanges />
</FlattenedSteps>

## Configure whether website previews are shown

<AdminOnly />

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Message feed settings**, toggle **Show previews of linked websites**.

  <SaveChanges />
</FlattenedSteps>

## Security

To prevent images from being used to track Zulip users, Zulip proxies all
external images in messages through the server.

## Related articles

* [Manage your uploaded files](/help/manage-your-uploaded-files)
* [Share and upload files](/help/share-and-upload-files)
* [View images and videos](/help/view-images-and-videos)
* [Animated GIFs](/help/animated-gifs)
```

--------------------------------------------------------------------------------

---[FILE: import-from-mattermost.mdx]---
Location: zulip-main/starlight_help/src/content/docs/import-from-mattermost.mdx

```text
---
title: Import from Mattermost
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ImportGetYourOrganizationStarted from "../include/_ImportGetYourOrganizationStarted.mdx";
import ImportHowUsersWillLogIn from "../include/_ImportHowUsersWillLogIn.mdx";
import ImportIntoASelfHostedServerDescription from "../include/_ImportIntoASelfHostedServerDescription.mdx";
import ImportIntoASelfHostedServerInstructions from "../include/_ImportIntoASelfHostedServerInstructions.mdx";
import ImportIntoAZulipCloudOrganization from "../include/_ImportIntoAZulipCloudOrganization.mdx";
import ImportSelfHostedServerTips from "../include/_ImportSelfHostedServerTips.mdx";
import ImportWorkspaceToZulip from "../include/_ImportWorkspaceToZulip.mdx";
import ImportYourDataIntoZulip from "../include/_ImportYourDataIntoZulip.mdx";
import ImportZulipCloudOrganizationWarning from "../include/_ImportZulipCloudOrganizationWarning.mdx";

<ImportWorkspaceToZulip />

## Import process overview

To import your Mattermost organization into Zulip, you will need to take the
following steps, which are described in more detail below:

<Steps>
  1. [Export your Mattermost data](#export-your-mattermost-data).
  1. [Import your Mattermost data into Zulip](#import-your-data-into-zulip).
  1. [Get your organization started with Zulip](#get-your-organization-started-with-zulip)!
</Steps>

## Import your organization from Mattermost into Zulip

### Export your Mattermost data

Mattermost's [bulk export tool](https://docs.mattermost.com/manage/bulk-export-tool.html)
allows you to export all public and private channel messages.

The instructions below correspond to various common ways Mattermost is installed; if
yours isn't covered, [contact us](/help/contact-support) and we'll help you out.

Replace `<username>` and `<server_ip>` with the appropriate values below.

<Tabs>
  <TabItem label="Default installation">
    <Steps>
      1. SSH into your Mattermost production server.
         ```bash "<username>" "<server_ip>"
         ssh <username>@<server_ip>
         ```
      1. Navigate to the directory which contains the Mattermost executable.
         On a default install of Mattermost, the directory is `/opt/mattermost/bin`.
         ```bash
         cd /opt/mattermost/bin
         ```
      1. Create an export of all your Mattermost teams, as a tar file.
         ```bash
         sudo ./mattermost export bulk export.json --all-teams --attachments
         mkdir -p exported_emoji
         tar --transform 's|^|mattermost/|' -czf export.tar.gz \
             data/ exported_emoji/ export.json
         ```
      1. Exit your shell on the Mattermost server.
         ```bash
         exit
         ```
      1. Finally, copy the exported tar file from the server to your local
         computer.  You may need to replace `/opt/mattermost/bin/` with the
         path to your Mattermost installation.
         ```bash "<username>" "<server_ip>"
         scp <username>@<server_ip>:/opt/mattermost/bin/export.tar.gz .
         ```
    </Steps>
  </TabItem>

  <TabItem label="Cloud instance">
    <Steps>
      1. Make sure you have [mmctl](https://github.com/mattermost/mmctl) installed - these
         instructions assume your version is `7.5.1` or higher.
      1. Log into your Mattermost Cloud instance using your administrator credentials.
         ```bash "yourdomain"
         mmctl auth login https://yourdomain.cloud.mattermost.com
         ```
      1. Create a full export of the server, including attached files.
         ```bash
         mmctl export create
         ```
      1. List all of the exports on the server, and copy the name of the
         latest one to your clipboard.
         ```bash
         mmctl export list
         ```
      1. Download the export to your local computer, replacing
         `latest_export` with the actual file name from the previous step.
         ```bash
         mmctl export download latest_export.zip
         ```
    </Steps>
  </TabItem>

  <TabItem label="Docker">
    <Steps>
      1. SSH into the server hosting your Mattermost docker container.
         ```bash "<username>" "<server_ip>"
         ssh <username>@<server_ip>
         ```
      1. Navigate to the Mattermost docker directory. On most installs, the
         directory should be `mattermost-docker`.
         ```bash
         cd mattermost-docker/
         ```
      1. Create an export of all your Mattermost teams, as a tar file.
         ```bash
         docker exec -it mattermost-docker_app_1 mattermost \
             export bulk data/export.json --all-teams --attachments
         cd volumes/app/mattermost/data/
         mkdir -p exported_emoji
         tar --transform 's|^|mattermost/|' -czf export.tar.gz \
             data/ exported_emoji/ export.json
         ```
      1. Exit your shell on the Mattermost server.
         ```bash
         exit
         ```
      1. Finally, copy the exported tar file from the server to your local
         computer. You may need to replace `mattermost-docker` with the
         appropriate path for your installation.
         ```bash "<username>" "<server_ip>"
         scp <username>@<server_ip>:mattermost-docker/volumes/app/mattermost/data/export.tar.gz .
         ```
    </Steps>
  </TabItem>

  <TabItem label="GitLab Omnibus">
    <Steps>
      1. SSH into your GitLab Omnibus server.
         ```bash "<username>" "<server_ip>"
         ssh <username>@<server_ip>
         ```
      1. Create an export of all your Mattermost teams, as a tar file.
         ```bash
         cd /opt/gitlab/embedded/service/mattermost
         sudo -u \
             mattermost /opt/gitlab/embedded/bin/mattermost \
             --config=/var/opt/gitlab/mattermost/config.json \
             export bulk export.json --all-teams --attachments
         mkdir -p exported_emoji
         tar --transform 's|^|mattermost/|' -czf export.tar.gz \
             data/ exported_emoji/ export.json
         ```
      1. Exit your shell on the GitLab Omnibus server.
         ```bash
         exit
         ```
      1. Finally, copy the exported tar file from GitLab Omnibus to your local computer.
         ```bash "<username>" "<server_ip>"
         scp <username>@<server_ip>:/opt/gitlab/embedded/bin/mattermost/export.tar.gz .
         ```
    </Steps>
  </TabItem>
</Tabs>

### Import your data into Zulip

<ImportYourDataIntoZulip />

<Tabs>
  <TabItem label="Zulip Cloud">
    <ImportIntoAZulipCloudOrganization />

    <ImportZulipCloudOrganizationWarning />
  </TabItem>

  <TabItem label="Self hosting">
    <ImportIntoASelfHostedServerDescription />

    <FlattenedSteps>
      <ImportIntoASelfHostedServerInstructions />

      1. To import into an organization hosted on the root domain
         (`EXTERNAL_HOST`) of the Zulip installation, run the following commands,
         replacing `<team-name>` with the name of the Mattermost team you want to import.
         <ImportSelfHostedServerTips />
         ```bash "<team-name>"
         cd /tmp
         tar -xf mattermost_data.tar.gz
         cd /home/zulip/deployments/current
         ./scripts/stop-server
         ./manage.py convert_mattermost_data /tmp/mattermost_data --output /tmp/converted_mattermost_data
         ./manage.py import '' /tmp/converted_mattermost_data/<team-name>
         ./scripts/start-server
         ```
         Alternatively, to import into a custom subdomain, run:
         ```bash "<team-name>" "<subdomain>"
         cd /tmp
         tar -xf mattermost_data.tar.gz
         cd /home/zulip/deployments/current
         ./scripts/stop-server
         ./manage.py convert_mattermost_data /tmp/mattermost_data --output /tmp/converted_mattermost_data
         ./manage.py import <subdomain> /tmp/converted_mattermost_data/<team-name>
         ./scripts/start-server
         ```
      1. Follow [step 4](https://zulip.readthedocs.io/en/stable/production/install.html#step-4-configure-and-use)
         of the guide for [installing a new Zulip
         server](https://zulip.readthedocs.io/en/stable/production/install.html).
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Self hosting (cloud export)">
    <ImportIntoASelfHostedServerDescription />

    <FlattenedSteps>
      <ImportIntoASelfHostedServerInstructions />

      1. To import into an organization hosted on the root domain
         (`EXTERNAL_HOST`) of the Zulip installation, run the following commands,
         replacing `<team-name>` with the name of the Mattermost team you want to import.
         <ImportSelfHostedServerTips />
         ```bash "<team-name>"
         unzip latest_export.zip -d /tmp/my_mattermost_export
         mv /tmp/my_mattermost_export/import.jsonl /tmp/my_mattermost_export/export.json
         cd /home/zulip/deployments/current
         ./scripts/stop-server
         ./manage.py convert_mattermost_data /tmp/my_mattermost_export --output /tmp/converted_mattermost_data
         ./manage.py import '' /tmp/converted_mattermost_data/<team-name>
         ./scripts/start-server
         ```
         Alternatively, to import into a custom subdomain, run:
         ```bash "<team-name>" "<subdomain>"
         unzip latest_export.zip -d /tmp/my_mattermost_export
         mv /tmp/my_mattermost_export/import.jsonl /tmp/my_mattermost_export/export.json
         cd /home/zulip/deployments/current
         ./scripts/stop-server
         ./manage.py convert_mattermost_data /tmp/my_mattermost_export --output /tmp/converted_mattermost_data
         ./manage.py import <subdomain> /tmp/converted_mattermost_data/<team-name>
         ./scripts/start-server
         ```
      1. Follow [step 4](https://zulip.readthedocs.io/en/stable/production/install.html#step-4-configure-and-use)
         of the guide for [installing a new Zulip
         server](https://zulip.readthedocs.io/en/stable/production/install.html).
    </FlattenedSteps>
  </TabItem>
</Tabs>

#### Import details

Whether you are using Zulip Cloud or self-hosting Zulip, here are a few notes to
keep in mind about the import process:

* Mattermost does not export workspace settings, so you will need to [configure
  the settings for your Zulip organization](/help/customize-organization-settings).
  This includes settings like [email
  visibility](/help/configure-email-visibility),
  [message editing permissions](/help/restrict-message-editing-and-deletion),
  and [how users can join your organization](/help/restrict-account-creation).
* Mattermost's user roles are mapped to Zulip's [user
  roles](/help/user-roles) in the following way:
  | Mattermost role    | Zulip role |
  | ------------------ | ---------- |
  | Team administrator | Owner      |
  | Member             | Member     |
* Mattermost's export tool does not support exporting user avatars or message
  edit history.
* Direct messages will only be imported from Mattermost workspaces containing
  a single team. This is because Mattermost's data exports do not associate
  direct messages with a specific Mattermost team.
* Messages in threads are imported, but they are not explicitly marked as
  being in a thread.

## Get your organization started with Zulip

<ImportGetYourOrganizationStarted />

## Decide how users will log in

<ImportHowUsersWillLogIn>
  ### Allow users to log in with non-password authentication

  ### Send password reset emails to all users

  ### Manual password resets
</ImportHowUsersWillLogIn>

## Related articles

* [Choosing between Zulip Cloud and self-hosting](/help/zulip-cloud-or-self-hosting)
* [Moving to Zulip](/help/moving-to-zulip)
* [Getting started with Zulip](/help/getting-started-with-zulip)
```

--------------------------------------------------------------------------------

````
