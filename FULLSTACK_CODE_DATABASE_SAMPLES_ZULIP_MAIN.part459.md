---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 459
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 459 of 1290)

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

---[FILE: configure-who-can-invite-to-channels.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-who-can-invite-to-channels.mdx

```text
---
title: Configure who can subscribe other users to channels
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import ContentAccessDefinition from "../include/_ContentAccessDefinition.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewPermissions from "../include/_SelectChannelViewPermissions.mdx";

You can configure who can subscribe other users to channels. If you have
permission to subscribe users [to a specific
channel](#configure-who-can-subscribe-anyone-to-a-specific-channel), you can
always do so, whether or not you're subscribed yourself.

There is also a [general
permission](#configure-who-can-subscribe-others-to-channels-in-general), which
allows subscribing others to all [public
channels](/help/channel-permissions#public-channels). For [private
channels](/help/channel-permissions#private-channels), you additionally need to
have content access to the channel in order to use this permission. Users have
content access if:

<ContentAccessDefinition />

[Guests](/help/guest-users) are never permitted to subscribe others.

## Configure who can subscribe others to channels in general

<AdminOnly />

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Channel permissions**, configure **Who can subscribe others to channels**.

  <SaveChanges />
</FlattenedSteps>

## Configure who can subscribe anyone to a specific channel

If you have permission to administer a public channel, you can configure who can
subscribe anyone to it. For [private
channels](/help/channel-permissions#private-channels), you additionally need to
have content access in order to change this configuration.

<FlattenedSteps>
  <NavigationSteps target="relative/channel/all" />

  1. Select a channel.

  <SelectChannelViewPermissions />

  1. Under **Subscription permissions**, configure **Who can subscribe anyone to
     this channel**.

  <SaveChanges />
</FlattenedSteps>

<ChannelSettingsNavbarTip />

## Related articles

* [Channel permissions](/help/channel-permissions)
* [User roles](/help/user-roles)
* [User groups](/help/user-groups)
* [Configure who can subscribe to a channel](/help/configure-who-can-subscribe)
* [Configure who can unsubscribe anyone from a channel](/help/configure-who-can-unsubscribe-others)
* [Subscribe users to a channel](/help/subscribe-users-to-a-channel)
* [Unsubscribe users from a channel](/help/unsubscribe-users-from-a-channel)
```

--------------------------------------------------------------------------------

---[FILE: configure-who-can-start-new-topics.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-who-can-start-new-topics.mdx

```text
---
title: Configure who can start new topics
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewPermissions from "../include/_SelectChannelViewPermissions.mdx";

You can restrict who can start new topics in a channel. For example, you can set
up:

* A channel where only some users can post new announcements, but
  everyone can discuss them.
* A channel with just a handful of topics everyone is expected to use.
* A channel for mirroring another messaging app, where each topic corresponds to
  a channel in the other app.

<ZulipTip>
  You can also [configure who can send messages](/help/channel-posting-policy)
  to a channel.
</ZulipTip>

<FlattenedSteps>
  <NavigationSteps target="relative/channel/all" />

  1. Select a channel.

  <SelectChannelViewPermissions />

  1. Under **Messaging permissions**, configure **Who can start new topics**.

  <SaveChanges />
</FlattenedSteps>

<ChannelSettingsNavbarTip />

## Related articles

* [Channel permissions](/help/channel-permissions)
* [Channel posting policy](/help/channel-posting-policy)
* [Configure whether topics are required](/help/require-topics)
```

--------------------------------------------------------------------------------

---[FILE: configure-who-can-subscribe.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-who-can-subscribe.mdx

```text
---
title: Configure who can subscribe to a channel
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewPermissions from "../include/_SelectChannelViewPermissions.mdx";

You can give users permission to subscribe to a channel. Everyone other than
[guests](/help/guest-users) can subscribe to any
[public](/help/channel-permissions#public-channels) or
[web-public](/help/channel-permissions#web-public-channels) channel, so this
feature is intended for use with [private
channels](/help/channel-permissions#private-channels). Guests can never
subscribe themselves to a channel.

This permission grants access to channel content: users who are allowed to
subscribe to a channel will also be able to read messages in it without
subscribing.

<ZulipTip>
  For example, you can give your team's [user group](/help/user-groups) permission
  to subscribe to each of your team's channels. A designer on the team could then
  follow a [link to a
  conversation](/help/link-to-a-message-or-conversation#link-to-a-topic-within-zulip)
  in the private engineering channel, and read it without subscribing. They could
  subscribe if they need to send a message there, without asking for help.
</ZulipTip>

If you have permission to administer a public channel, you can configure who can
subscribe to it. For [private
channels](/help/channel-permissions#private-channels), you additionally need to
have content access in order to change this configuration.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewPermissions />

      1. Under **Subscription permissions**, configure **Who can subscribe to this
         channel**.

      <SaveChanges />
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>
</Tabs>

## Related articles

* [Subscribe to a channel](/help/introduction-to-channels#browse-and-subscribe-to-channels)
* [Channel permissions](/help/channel-permissions)
* [User roles](/help/user-roles)
* [User groups](/help/user-groups)
* [Configure who can subscribe other users to channels](/help/configure-who-can-invite-to-channels)
* [Configure who can unsubscribe anyone from a channel](/help/configure-who-can-unsubscribe-others)
* [Subscribe users to a channel](/help/subscribe-users-to-a-channel)
* [Unsubscribe users from a channel](/help/unsubscribe-users-from-a-channel)
```

--------------------------------------------------------------------------------

---[FILE: configure-who-can-unsubscribe-others.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-who-can-unsubscribe-others.mdx

```text
---
title: Configure who can unsubscribe anyone from a channel
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewPermissions from "../include/_SelectChannelViewPermissions.mdx";

Organization administrators and [channel
administrators](/help/configure-who-can-administer-a-channel) can automatically
unsubscribe anyone from a channel.

<FlattenedSteps>
  <NavigationSteps target="relative/channel/all" />

  1. Select a channel.

  <SelectChannelViewPermissions />

  1. Under **Subscription permissions**, configure **Who can unsubscribe anyone
     from this channel**.

  <SaveChanges />
</FlattenedSteps>

<ChannelSettingsNavbarTip />

## Related articles

* [Channel permissions](/help/channel-permissions)
* [User roles](/help/user-roles)
* [User groups](/help/user-groups)
* [Configure who can administer a channel](/help/configure-who-can-administer-a-channel)
* [Restrict who can subscribe other users to channels](/help/configure-who-can-invite-to-channels)
* [Unsubscribe users from a channel](/help/unsubscribe-users-from-a-channel)
* [Subscribe users to a channel](/help/subscribe-users-to-a-channel)
```

--------------------------------------------------------------------------------

---[FILE: connect-through-a-proxy.mdx]---
Location: zulip-main/starlight_help/src/content/docs/connect-through-a-proxy.mdx

```text
---
title: Connect through a proxy
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import DesktopSidebarSettingsMenu from "../include/_DesktopSidebarSettingsMenu.mdx";

Some corporate and university networks may require you to connect to Zulip
via a proxy.

## Web

Zulip uses your browser's default proxy settings. To set a custom proxy just
for Zulip, check your browser's instructions for setting a custom proxy for
a single website.

## Desktop

<Tabs>
  <TabItem label="System proxy settings">
    <FlattenedSteps>
      <DesktopSidebarSettingsMenu />

      1. Select the **Network** tab.
      1. Click **Use system proxy settings**.
      1. Restart the Zulip desktop app.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Custom proxy settings">
    <FlattenedSteps>
      <DesktopSidebarSettingsMenu />

      1. Select the **Network** tab.
      1. Click **Manual proxy configuration**.
      1. Either enter a URL for **PAC script**, or fill out **Proxy rules** and
         **Proxy bypass rules**.
      1. Click **Save changes**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Additional tips for custom proxy settings

In most corporate environments, your network administrator will provide a
URL for the **PAC script**.

The second most common configuration is that your network administrator has
set up a proxy server for accessing the public internet, but URLs on the
local network must be accessed directly. In that case set **Proxy rules** to
the URL of the proxy server (it may look something like
`http://proxy.example.edu:port`), and **Proxy bypass rules** to cover local URLs
(it may look something like `*.example.edu,10.0.0.0/8`).

If either of those apply, you can skip the rest of this guide. If not, we
document the syntax for **Proxy rules** and **Proxy bypass rules** below.

### Proxy rules

A semicolon-separated list of `protocolRule`s.

```
protocolRule -> [<protocol>"="]<URLList>
protocol -> "http" | "https" | "ftp" | "socks"
URLList -> comma-separated list of URLs, ["direct://"]
```

Some examples:

* `http=http://foo:80;ftp=http://bar:1080` - Use proxy `http://foo:80`
  for `http://` URLs, and proxy `http://bar:1080` for `ftp://` URLs.
* `http://foo:80` - Use proxy `http://foo:80` for all URLs.
* `http://foo:80,socks5://bar,direct://` - Use proxy `http://foo:80` for
  all URLs, failing over to `socks5://bar` if `http://foo:80` is
  unavailable, and after that using no proxy.
* `http=http://foo;socks5://bar` -  Use proxy `http://foo` for `http://` URLs,
  and use `socks5://bar` for all other URLs.

### Proxy bypass rules

A comma-separated list of URIs. The URIs can be hostnames, IP address
literals, or IP ranges in CIDR notation. Hostnames can use the `*`
wildcard. Use `<local>` to match any of `127.0.0.1`, `::1`, or `localhost`.
```

--------------------------------------------------------------------------------

---[FILE: contact-support.mdx]---
Location: zulip-main/starlight_help/src/content/docs/contact-support.mdx

```text
---
title: Contact support
---

We're here to help! This page will guide you to the best way to reach us.

## Zulip community

The primary communication forum for the Zulip community is the Zulip server
hosted at chat.zulip.org. Users and administrators of Zulip organizations stop
by to ask questions, offer feedback, and participate in product design
discussions.

Everyone is welcome to sign up and participate — we love hearing from our users!
Please see the [Zulip development community][development-community] guide for
detailed instructions on how to join the community, [community norms][community-norms]
and [where][development-community-channels] to ask your questions or give
feedback.

## Support requests

* For support requests regarding your Zulip Cloud organization, you can request
  interactive chat support in the [Zulip development
  community](#zulip-community), or [email Zulip
  support](mailto:support@zulip.com).
  * Response time: Usually within 1-3 business days, or within one business
    day for paid customers.
* For support requests regarding your **self-hosted server**:

  * **Business** and **Enterprise** plan customers can request interactive
    chat support in the [Zulip development community](#zulip-community),
    or [email Zulip support](mailto:support@zulip.com). Phone support is
    available for Enterprise customers upon request.
    * Response time: Usually within one business day.
  * **Free** and **Community** plan customers can ask for help in the
    [Zulip development community](#zulip-community). You will usually get a
    friendly reply within 1-3 business days.

## Sales, billing, and partnerships

For **sales**, **billing**, **partnerships**, and **other commercial
questions**, contact [sales@zulip.com](mailto:sales@zulip.com). Response time:
Usually within one business day.

## Product feedback

Your feedback helps us make Zulip better for everyone! Please reach out if you
have questions, suggestions, or just want to brainstorm how to make Zulip work
for your organization.

* There are [several
  ways](https://zulip.readthedocs.io/en/latest/contributing/reporting-bugs.html)
  to **report possible bugs**.
  * Response time: Usually within 1-3 business days in the [Zulip development
    community](#zulip-community) or by email, or within one week [on
    GitHub](https://github.com/zulip).
* You can [**request
  features**](https://zulip.readthedocs.io/en/latest/contributing/suggesting-features.html)
  or [**share
  feedback**](https://zulip.readthedocs.io/en/latest/contributing/suggesting-features.html#evaluation-and-onboarding-feedback).
  Many improvements to the Zulip app start with a user's suggestion.
  * Response time: Usually within 1-3 business days in the [Zulip development
    community](#zulip-community) or by email, or within one week [on
    GitHub](https://github.com/zulip).
* To **report issues or share feedback privately**, contact
  [feedback@zulip.com](mailto:feedback@zulip.com). This works well if you'd like
  to include details about your organization that shouldn't be posted in public.
  * Response time: Usually within 1-3 business days.

[development-community]: https://zulip.com/development-community/

[community-norms]: https://zulip.com/development-community/#community-norms

[development-community-channels]: https://zulip.com/development-community/#channels-for-zulip-users-and-administrators

## Security

If you believe you've identified a security issue, please report it to Zulip's
security team at [security@zulip.com](mailto:security@zulip.com) as soon as
possible, so that we can address it and make a responsible disclosure.

## Related articles

* [Zulip Cloud billing](/help/zulip-cloud-billing)
* [View Zulip version](/help/view-zulip-version)
```

--------------------------------------------------------------------------------

---[FILE: create-a-channel.mdx]---
Location: zulip-main/starlight_help/src/content/docs/create-a-channel.mdx

```text
---
title: Create a channel
---

import CreateAChannelInstructions from "../include/_CreateAChannelInstructions.mdx";
import DependsOnPermissions from "../include/_DependsOnPermissions.mdx";

<DependsOnPermissions />

If you are an administrator setting up channels for the first time, check out our
[guide to setting up channels for a new organization](/help/create-channels).

<CreateAChannelInstructions />

## Related articles

* [Create channels for a new organization](/help/create-channels)
* [Channel permissions](/help/channel-permissions)
* [Set default channels for new users](/help/set-default-channels-for-new-users)
* [Introduction to channels](/help/introduction-to-channels)
* [Restrict channel creation](/help/configure-who-can-create-channels)
```

--------------------------------------------------------------------------------

---[FILE: create-a-poll.mdx]---
Location: zulip-main/starlight_help/src/content/docs/create-a-poll.mdx

```text
---
title: Polls
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import PollsExamples from "../include/_PollsExamples.mdx";
import PollsIntro from "../include/_PollsIntro.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import CheckIcon from "~icons/fa/check";
import PencilIcon from "~icons/fa/pencil";
import RemoveIcon from "~icons/fa/remove";
import GripVerticalIcon from "~icons/zulip-icon/grip-vertical";
import PollIcon from "~icons/zulip-icon/poll";
import SendIcon from "~icons/zulip-icon/send";
import TrashIcon from "~icons/zulip-icon/trash";

<PollsIntro />

## Create a poll

<Tabs>
  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. Make sure the compose box is empty.
      1. Click the **Add poll** (<PollIcon />) icon at
         the bottom of the compose box.
      1. Fill out poll information as desired, and click **Add poll** to insert poll
         formatting.
      1. Click the **Send** (<SendIcon />) button, or
         use a [keyboard shortcut](/help/configure-send-message-keys) to send your
         message.
    </FlattenedSteps>

    <ZulipTip>
      To reorder the list of options, click and drag the **vertical dots**
      (<GripVerticalIcon />) to the left of each
      option. To delete an option, click the **delete**
      (<TrashIcon />) icon to the right of it.
    </ZulipTip>
  </TabItem>

  <TabItem label="Via Markdown">
    <FlattenedSteps>
      <StartComposing />

      1. Make sure the compose box is empty.
      1. Type `/poll` followed by a space, and the question you want to ask.
      1. *(optional)* Type each option on a new line.
      1. Click the **Send** (<SendIcon />) button, or
         use a [keyboard shortcut](/help/configure-send-message-keys) to send your
         message.
    </FlattenedSteps>

    <ZulipTip>
      You will be able to add options after the poll is created.
    </ZulipTip>
  </TabItem>
</Tabs>

## Add options to a poll

<ZulipNote>
  To preserve the meaning of votes in the poll, existing poll options cannot
  be modified.
</ZulipNote>

<Steps>
  1. Fill out the **New option** field at the bottom of the poll.
  1. Click **Add option** or press <kbd>Enter</kbd> to add the new option to
     the poll.
</Steps>

## Edit the question

<ZulipNote>
  Only the creator of a poll can edit the question.
</ZulipNote>

<Steps>
  1. Click the **pencil** (<PencilIcon />) icon
     to the right of the question.
  1. Edit the question as desired.
  1. Click the **checkmark** (<CheckIcon />) icon or press
     <kbd>Enter</kbd> to save your changes.
</Steps>

<ZulipTip>
  You can click the <RemoveIcon /> icon or press
  <kbd>Esc</kbd> to discard your changes.
</ZulipTip>

## Examples

<PollsExamples />

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Collaborative to-do lists](/help/collaborative-to-do-lists)
```

--------------------------------------------------------------------------------

---[FILE: create-channels.mdx]---
Location: zulip-main/starlight_help/src/content/docs/create-channels.mdx

```text
---
title: Create channels
---

import CreateAChannelInstructions from "../include/_CreateAChannelInstructions.mdx";
import CreateChannelsIntro from "../include/_CreateChannelsIntro.mdx";

<CreateChannelsIntro />

## How to create a channel

<CreateAChannelInstructions />

## Tips for creating channels

* It's often best to start with just a few channels, and add more as
  needed. For small teams, you can start with the default channels
  and go from there.
* A channel's name can be in any language, and can include spaces, punctuation,
  and Unicode emoji. For large organizations, we recommend using a consistent naming
  scheme, like `#marketing/<name>` or `#mk/<name>` for all channels
  pertaining to the marketing team, `#help/<team name>` for
  `<team name>`'s internal support channel, etc.
* You can [pin reference information](/help/pin-information), such as important
  messages or topics, and external references, in the
  [description](/help/view-channel-information#view-channel-description) for a
  channel.
* For open source projects or other volunteer organizations, consider
  adding default channels like **#announce** for announcements, **#new
  members** for new members to introduce themselves and be welcomed,
  and **#help** so that there's a clear place users stopping by with
  just a single question can post.

## Related articles

* [Moving to Zulip](/help/moving-to-zulip)
* [Channel permissions](/help/channel-permissions)
* [Set default channels for new users](/help/set-default-channels-for-new-users)
* [Getting started with Zulip](/help/getting-started-with-zulip)
```

--------------------------------------------------------------------------------

---[FILE: create-user-groups.mdx]---
Location: zulip-main/starlight_help/src/content/docs/create-user-groups.mdx

```text
---
title: Create user groups
---

import CloudPaidPlansOnly from "../include/_CloudPaidPlansOnly.mdx";
import HowToCreateAUserGroup from "../include/_HowToCreateAUserGroup.mdx";
import UserGroupsApplications from "../include/_UserGroupsApplications.mdx";
import UserGroupsIntro from "../include/_UserGroupsIntro.mdx";
import UserSubgroupsIntro from "../include/_UserSubgroupsIntro.mdx";

<CloudPaidPlansOnly />

<UserGroupsIntro />

Many organizations find it helpful to create groups for:

* Each team, e.g., “mobile”, “design”, or “IT”.
* Leadership roles, e.g., “managers”, “engineering-managers”.

<UserSubgroupsIntro />

<UserGroupsApplications />

## How to create a user group

<HowToCreateAUserGroup />

## Related articles

* [Moving to Zulip](/help/moving-to-zulip)
* [User groups](/help/user-groups)
* [Manage user groups](/help/manage-user-groups)
* [Invite users to join](/help/invite-users-to-join)
* [Getting started with Zulip](/help/getting-started-with-zulip)
```

--------------------------------------------------------------------------------

---[FILE: create-your-organization-profile.mdx]---
Location: zulip-main/starlight_help/src/content/docs/create-your-organization-profile.mdx

```text
---
title: Create your organization profile
---

import AddAWideLogo from "../include/_AddAWideLogo.mdx";
import AdminOnly from "../include/_AdminOnly.mdx";
import CommunitiesDirectoryInstructions from "../include/_CommunitiesDirectoryInstructions.mdx";
import CommunitiesDirectoryIntro from "../include/_CommunitiesDirectoryIntro.mdx";
import EditOrganizationProfile from "../include/_EditOrganizationProfile.mdx";

<AdminOnly />

Your organization's profile includes its **name**,
[**type**](/help/organization-type), **description**, **profile picture**, and
**logo**. The name, description and profile picture appear on the registration
and login pages for your organization, and (optionally) in the [communities
directory](/help/communities-directory).

* The **organization name** also appears in the title of your Zulip browser tab
  or Desktop app, and in email and desktop notifications. It's best to keep it
  short.
* The **organization type** is used to customize the experience for users
  in your organization, including initial organization settings and
  Welcome Bot messages received by new users.
* The **organization description** supports [full Markdown
  formatting](/help/format-your-message-using-markdown), including
  **bold**/*italic*, links, lists, and more.
* The **organization profile picture** is a square image that is also used for
  [switching between organizations](/help/switching-between-organizations) in
  the desktop app. It will be displayed at 100×100 pixels, or more on
  high-resolution displays.
* The [**organization logo**](#add-a-wide-logo) replaces the Zulip logo in the
  upper left corner of the web and desktop apps.

## Edit organization profile

<EditOrganizationProfile />

## Zulip communities directory

<CommunitiesDirectoryIntro />

### Change whether your organization may be listed in the Zulip communities directory

<CommunitiesDirectoryInstructions />

For more details, see [Communities directory](/help/communities-directory).

## Add a wide logo

<AddAWideLogo />

## Related articles

* [Moving to Zulip](/help/moving-to-zulip)
* [Customize organization settings](/help/customize-organization-settings)
* [Create channels](/help/create-channels)
* [Communities directory](/help/communities-directory)
* [Getting started with Zulip](/help/getting-started-with-zulip)
```

--------------------------------------------------------------------------------

---[FILE: custom-certificates.mdx]---
Location: zulip-main/starlight_help/src/content/docs/custom-certificates.mdx

```text
---
title: Use a custom certificate
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import DesktopSidebarSettingsMenu from "../include/_DesktopSidebarSettingsMenu.mdx";

By default, Zulip requests a generally-accepted certificate during the
server install process, for the server's public hostname. In some
cases, a server administrator may choose not to use that feature, in
which case your Zulip server may be using a self-signed
certificate. This is most common for Zulip servers not connected to
the public internet.

## Web

Most browsers will show a warning if you try to connect to a Zulip server
with a self-signed certificate.

If you are absolutely, 100% sure that the Zulip server you are connecting to
is supposed to have a self-signed certificate, click through the warnings
and follow the instructions on-screen.

If you are less than 100% sure, contact your server
administrator. Accepting a malicious self-signed certificate would
give a stranger full access to your Zulip account, including your
username and password.

## Desktop

Zulip Desktop uses the operating system's certificate store, like your web
browser.

<Tabs>
  <TabItem label="macOS">
    <Steps>
      1. Hit `Cmd` + `Space` to bring up Spotlight Search, type **Keychain
         Access**, and press Enter.
      1. From the **File** menu, choose **Import Items...**
      1. Navigate to the certificate file, then click **Open**.
      1. Right-click the newly-added certificate, and click **Get Info** from
         the context menu.
      1. Expand the **Trust** section.
      1. Select **Always Trust** for the **Secure Sockets Layer (SSL)** option.
      1. Close the window.  You will be prompted for your password to verify
         the change.
      1. Restart the Zulip Desktop application.
    </Steps>
  </TabItem>

  <TabItem label="Windows">
    On Windows, Zulip Desktop shares the certificate store with
    Google Chrome, so you can add certificates to it from inside
    Chrome.

    <Steps>
      1. Open Google Chrome.
      1. From the Chrome menu (⋮) in the top-right, select **Settings**.
      1. In the **Privacy and Security** section, click **Security**.
      1. Scroll down to and click **Manage Certificates**.
      1. Select the **Trusted Root Certification Authorities** tab.
      1. Select **Import...**
      1. Navigate to the certificate file, then click **Open**.
      1. Select **Done**.
      1. Restart the Zulip Desktop application.
    </Steps>
  </TabItem>

  <TabItem label="Linux">
    The required packages and steps vary by distribution; see the Chromium
    documentation for [detailed documentation][linux].  On most systems,
    once the `nss` tools are installed, the command to trust the
    certificate is:

    ```bash "path/to/certificate.pem"
    certutil -d sql:$HOME/.pki/nssdb -A -t "P,," -n zulip \
      -i path/to/certificate.pem
    ```

    You will need to restart the Zulip Desktop application to pick up the
    new certificate.
  </TabItem>
</Tabs>

[linux]: https://chromium.googlesource.com/chromium/src.git/+/main/docs/linux/cert_management.md

## Related articles

* [Installing SSL certificates](https://zulip.readthedocs.io/en/stable/production/ssl-certificates.html)
```

--------------------------------------------------------------------------------

---[FILE: custom-emoji.mdx]---
Location: zulip-main/starlight_help/src/content/docs/custom-emoji.mdx

```text
---
title: Custom emoji
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

import TrashIcon from "~icons/zulip-icon/trash";

Custom emoji can be used by all users in an organization (including
bots).  They are supported everywhere that Zulip supports emoji,
including [emoji reactions][emoji-reactions],
[messages][emoji-messages], [channel descriptions][emoji-channels] and
[user statuses][emoji-status].

[emoji-reactions]: /help/emoji-reactions

[emoji-messages]: /help/format-your-message-using-markdown#emoji-and-emoticons

[emoji-channels]: /help/change-the-channel-description

[emoji-status]: /help/status-and-availability

## Add custom emoji

<FlattenedSteps>
  <NavigationSteps target="settings/emoji-settings" />

  1. Click **Add a new emoji**.
  1. Click **Upload image or GIF**, and add a file in the PNG, JPG, or
     GIF file format. Zulip will automatically scale the image down to
     25x25 pixels.
  1. Enter an **Emoji name**, and click **Confirm**.
</FlattenedSteps>

**Emoji names** can only contain `a-z`, `0-9`, dashes (`-`), and spaces.
Upper and lower case letters are treated the same, and underscores (`_`)
are treated the same as spaces.

### Bulk add emoji

We expose a [REST API endpoint](/api/upload-custom-emoji) for bulk uploading
emoji. Using REST API endpoints requires some technical expertise;
[contact us](/help/contact-support) if you get stuck.

## Replace a default emoji

You can replace a default emoji by adding a custom emoji of the same
name. If an emoji has several names, you must use the emoji's primary name
to replace it. You can find the primary name of an emoji by hovering over it
in the [emoji picker](/help/emoji-and-emoticons#use-an-emoji-in-your-message),
while the search box is empty (you may have to scroll down a bit to find it).

## Deactivate custom emoji

<FlattenedSteps>
  <NavigationSteps target="settings/emoji-settings" />

  1. Click the **deactivate** (<TrashIcon />) icon next to the
     emoji that you would like to deactivate.
</FlattenedSteps>

Deactivating an emoji will not affect any existing messages or emoji
reactions. Anyone can deactivate custom emoji they added, and organization
administrators can deactivate anyone's custom emoji.

## Change who can add custom emoji

<AdminOnly />

You can configure who can add custom emoji. This permission can be granted to
any combination of [roles](/help/user-roles), [groups](/help/user-groups), and
individual [users](/help/introduction-to-users).

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Other permissions**, configure **Who can add custom emoji**.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [Emoji and emoticons](/help/emoji-and-emoticons)
* [Emoji reactions](/help/emoji-reactions)
```

--------------------------------------------------------------------------------

---[FILE: custom-profile-fields.mdx]---
Location: zulip-main/starlight_help/src/content/docs/custom-profile-fields.mdx

```text
---
title: Custom profile fields
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";

import EditIcon from "~icons/zulip-icon/edit";
import TrashIcon from "~icons/zulip-icon/trash";

<AdminOnly />

[User cards](/help/user-cards) show basic information about a user, and [user
profiles](/help/view-someones-profile) provide additional details. You can add
custom profile fields to user cards and user profiles, making it easy for users
to share information, such as their pronouns, job title, or team.

Zulip supports many types of profile fields, such as dates, lists of options,
GitHub account links, and [more](#profile-field-types). You can choose which
custom profile fields to [display](#display-custom-fields-on-user-card) on user
cards. Custom profile fields can be optional or
[required](#make-a-custom-profile-field-required).

Zulip supports synchronizing custom profile fields from an external
user database such as LDAP or SAML. See the [authentication
methods][authentication-production] documentation for details.

## Add a custom profile field

<FlattenedSteps>
  <NavigationSteps target="settings/profile-field-settings" />

  1. Click **Add a new profile field**.
  1. Fill out profile field information as desired, and click **Add**.
  1. In the **Labels** column, click and drag the vertical dots to reorder the
     list of custom profile fields.
</FlattenedSteps>

## Edit a custom profile field

<FlattenedSteps>
  <NavigationSteps target="settings/profile-field-settings" />

  1. In the **Actions** column, click the **edit** (<EditIcon />)
     icon for the profile field you want to edit.
  1. Edit profile field information as desired, and click **Save changes**.
</FlattenedSteps>

## Delete a custom profile field

<FlattenedSteps>
  <NavigationSteps target="settings/profile-field-settings" />

  1. In the **Actions** column, click the **delete** (<TrashIcon />) icon for the profile field you want to delete.
  1. Approve by clicking **Confirm**.
</FlattenedSteps>

## Reorder custom profile fields

Users will see custom profile fields in the specified order.

<FlattenedSteps>
  <NavigationSteps target="settings/profile-field-settings" />

  1. In the **Labels** column, click and drag the vertical dots to reorder the
     list of custom profile fields.
</FlattenedSteps>

## Display custom fields on user card

Organizations may find it useful to display additional fields on the
user card, such as pronouns, GitHub username, job title, team, etc.

All field types other than "Long text" or "Person" have a checkbox option
that controls whether to display a custom field on the user card.
There's a limit to the number of custom profile fields that can be displayed
at a time. If the maximum number of fields is already selected, all unselected
checkboxes will be disabled.

<FlattenedSteps>
  <NavigationSteps target="settings/profile-field-settings" />

  1. In the **Actions** column, click the **edit** (<EditIcon />)
     icon for the profile field you want to edit.
  1. Toggle **Display on user card**.
  1. Click **Save changes**.
</FlattenedSteps>

<ZulipTip>
  You can also choose which custom profile fields will be displayed by toggling
  the checkboxes in the **Card** column of the **Custom profile fields** table.
</ZulipTip>

## Make a custom profile field required

If a custom profile field is required, users who have left it blank will see a
banner every time they open the Zulip web or desktop app prompting them to fill
it out.

<FlattenedSteps>
  <NavigationSteps target="settings/profile-field-settings" />

  1. In the **Actions** column, click the **edit** (<EditIcon />)
     icon for the profile field you want to edit.
  1. Toggle **Required field**.
  1. Click **Save changes**.
</FlattenedSteps>

<ZulipTip>
  You can also choose which custom profile fields are required by toggling the
  checkboxes in the **Required** column of the **Custom profile fields** table.
</ZulipTip>

## Configure whether users can edit custom profile fields

<AdminOnly />

You can configure whether users in your organization can edit custom profile
fields for their own account. For example, you may want to restrict editing if
syncing profile fields from an employee directory.

<FlattenedSteps>
  <NavigationSteps target="settings/profile-field-settings" />

  1. In the **Actions** column, click the **edit** (<EditIcon />)
     icon for the profile field you want to configure.
  1. Toggle **Users can edit this field for their own account**.
  1. Click **Save changes**.
</FlattenedSteps>

## Profile field types

Choose the profile field type that's most appropriate for the requested information.

* **Date**: For dates (e.g., birthdays or work anniversaries).
* **Link**: For links to websites, including company-internal pages.
* **External account**: For linking to an account on GitHub, X (Twitter), etc.
* **List of options**: A dropdown with a list of predefined options (e.g.,
  office location).
* **Pronouns**: What pronouns should people use to refer to the user? Pronouns
  are displayed in [user mention](/help/mention-a-user-or-group) autocomplete
  suggestions.
* **Text (long)**: For multiline responses (e.g., a user's intro message).
* **Text (short)**: For one-line responses up to 50 characters (e.g., team
  name or role in your organization).
* **Users**: For selecting one or more users (e.g., manager or direct reports).

## Related articles

* [Edit your profile](/help/edit-your-profile)
* [User cards](/help/user-cards)
* [View someone's profile](/help/view-someones-profile)

[authentication-production]: https://zulip.readthedocs.io/en/stable/production/authentication-methods.html
```

--------------------------------------------------------------------------------

````
