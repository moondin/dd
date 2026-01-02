---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 456
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 456 of 1290)

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

---[FILE: add-a-custom-linkifier.mdx]---
Location: zulip-main/starlight_help/src/content/docs/add-a-custom-linkifier.mdx

```text
---
title: Add a custom linkifier
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";

import EditIcon from "~icons/zulip-icon/edit";
import ExternalLinkIcon from "~icons/zulip-icon/external-link";
import TrashIcon from "~icons/zulip-icon/trash";

<AdminOnly />

Linkifiers make it easy to refer to issues or tickets in third
party issue trackers, like GitHub, Salesforce, Zendesk, and others.
For instance, you can add a linkifier that automatically turns `#2468`
into a link to `https://github.com/zulip/zulip/issues/2468`.

If the pattern appears in a topic, Zulip adds an
**Open** (<ExternalLinkIcon />) button
to the right of the topic in the message recipient bar that links to
the appropriate URL.

If you have any trouble creating the linkifiers you want, please [contact Zulip
support](/help/contact-support) with details on what you're trying to do.

## Add a custom linkifier

<FlattenedSteps>
  <NavigationSteps target="settings/linkifier-settings" />

  1. Under **Add a new linkifier**, enter a **Pattern** and
     **URL template**.
  1. Click **Add linkifier**.
</FlattenedSteps>

## Edit a custom linkifier

<FlattenedSteps>
  <NavigationSteps target="settings/linkifier-settings" />

  1. In the **Actions** column, click the **edit** (<EditIcon />)
     icon for the linkifier you want to edit.
  1. Edit linkifier information as desired, and click **Save changes**.
</FlattenedSteps>

## Delete a custom linkifier

<FlattenedSteps>
  <NavigationSteps target="settings/linkifier-settings" />

  1. In the **Actions** column, click the **delete** (<TrashIcon />) icon for the linkifier you want to delete.
  1. Approve by clicking **Confirm**.
</FlattenedSteps>

## Reorder linkifiers

Linkifiers are processed in order, and will not apply to text that
is already linkified. You can therefore choose which linkifiers to prioritize
when more than one linkifier applies. See the
[overlapping patterns section](#overlapping-patterns) for examples.

<FlattenedSteps>
  <NavigationSteps target="settings/linkifier-settings" />

  1. In the **Pattern** column under **Linkifiers**, click and drag the vertical
     dots to reorder the list of linkifiers.
</FlattenedSteps>

## Common linkifier patterns

The following examples cover the most common types of linkifiers, with a focus
on linkifiers for issues or tickets.

### Link to an issue or ticket

This is a pattern that turns a `#` followed by a number into a link. It is often
used to link to issues or tickets in third party issue trackers, like GitHub,
Salesforce, Zendesk, and others.

* Pattern: `#(?P<id>[0-9]+)`
* URL template: `https://github.com/zulip/zulip/issues/{id}`
* Original text: `#2468`
* Automatically links to: `https://github.com/zulip/zulip/issues/2468`

### Link to issues or tickets in multiple projects or apps

To set up linkifiers for issues or tickets in multiple projects,
consider extending the `#2468` format with project-specific
variants. For example, the Zulip development community
[uses](https://zulip.com/development-community/#linking-to-github-issues-and-pull-requests)
`#M2468` for an issue in the repository for the Zulip mobile app,
`#D2468` and issue in the desktop app repository, etc.

* Pattern: `#F(?P<id>[0-9]+)`
* URL template: `https://github.com/zulip/zulip-flutter/issues/{id}`
* Original text: `#F245`
* Automatically links to: `https://github.com/zulip/zulip-flutter/issues/245`

### Link to issues or tickets in multiple repositories

For organizations that commonly link to multiple GitHub repositories, this
linkfier pattern turns `org/repo#ID` into an issue or pull request link.

* Pattern: `(?P<org>[a-zA-Z0-9_-]+)/(?P<repo>[a-zA-Z0-9_-]+)#(?P<id>[0-9]+)`
* URL template: `https://github.com/{org}/{repo}/issues/{id}`
* Original text: `zulip/zulip#2468`
* Automatically links to: `https://github.com/zulip/zulip/issues/2468`

### Link to a hexadecimal issue or ticket number

The following pattern linkfies a string of hexadecimal digits between 7 and 40
characters long, such as a Git commit ID.

* Pattern: `(?P<id>[0-9a-f]{7,40})`
* URL template: `https://github.com/zulip/zulip/commit/{id}`
* Original text: `abdc123`
* Automatically links to: `https://github.com/zulip/zulip/commit/abcd123`

## Advanced linkifier patterns

Linkifiers are a flexible system that can be used to construct rules for a wide
variety of situations. Linkifier patterns are regular expressions, using the
[re2](https://github.com/google/re2/wiki/Syntax) regular expression
engine.

Linkifiers use [RFC 6570](https://www.rfc-editor.org/rfc/rfc6570.html) compliant
URL templates to describe how links should be generated. These templates support
several expression types. The default expression type (`{var}`) will URL-encode
special characters like `/` and `&`; this behavior is desired for the vast
majority of linkifiers. Fancier URL template expression types can allow you to
get the exact behavior you want in corner cases like optional URL query
parameters. For example:

* Use `{+var}` when you want URL delimiter characters to not be URL-encoded.
* Use `{?var}` and `{&var}` for variables in URL query parameters.
* Use `{#var}` when generating `#` fragments in URLs.

The URL template specification has [brief
examples](https://www.rfc-editor.org/rfc/rfc6570.html#section-1.2) and [detailed
examples](https://www.rfc-editor.org/rfc/rfc6570.html#section-3.2) explaining
the precise behavior of URL templates.

### Linking to documentation pages

This example pattern is a shorthand for linking to pages on Zulip's ReadTheDocs
site.

* Pattern: `RTD/(?P<article>[a-zA-Z0-9_/.#-]+)`
* URL template: `https://zulip.readthedocs.io/en/latest/{+article}`
* Original text: `RTD/overview/changelog.html`
* Automatically links to: `https://zulip.readthedocs.io/en/latest/overview/changelog.html`

<ZulipTip>
  This pattern uses the `{+var}` expression type. With the
  default expression type (`{article}`), the `/` between `overview` and
  `changelog` would incorrectly be URL-encoded.
</ZulipTip>

### Linking to Google search results

This example pattern allows linking to Google searches.

* Pattern: `google:(?P<q>\w+)?`
* URL template: `https://google.com/search{?q}`
* Original text: `google:foo` or `google:`
* Automatically links to: `https://google.com/search?q=foo` or `https://google.com/search`

<ZulipTip>
  This pattern uses the `{?var}` expression type. With the default expression
  type (`{q}`), there would be no way to only include the `?` in the URL
  if the optional `q` is present.
</ZulipTip>

### Overlapping patterns

In this example, a general linkifier is configured to make GitHub
repository references like `zulip-desktop#123` link to issues in that
repository within the `zulip` GitHub organization. A more specific
linkifier overrides that linkifier for a specific repository of
interest (`django/django`) that is in a different organization.

* Specific linkifier (ordered before the general linkifier)
  * Pattern: `django#(?P<id>[0-9]+)`
  * URL template: `https://github.com/django/django/pull/{id}`
* General linkifier
  * Pattern: `(?P<repo>[a-zA-Z0-9_-]+)#(?P<id>[0-9]+)`
  * URL template: `https://github.com/zulip/{repo}/pull/{id}`
* Example matching both linkifiers; specific linkifier takes precedence:
  * Original text: `django#123`
  * Automatically links to: `https://github.com/django/django/pull/123`
* Example matching only the general linkifier:
  * Original text: `zulip-desktop#123`
  * Automatically links to: `https://github.com/zulip/zulip-desktop/pull/123`

<ZulipTip>
  This set of patterns has overlapping regular expressions. Note that
  the general linkifier pattern would match `lorem#123` too. The specific
  linkifier will only get prioritized over the general linkifier if it is
  ordered before the more general pattern. This can be customized by
  dragging and dropping existing linkifiers into the desired order. New
  linkifiers will automatically be ordered last.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: analytics.mdx]---
Location: zulip-main/starlight_help/src/content/docs/analytics.mdx

```text
---
title: Usage statistics
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

Zulip provides detailed analytics to help you see how you and your team are
using Zulip. The **Organization summary** section of the usage statistics page
includes your organization's overall usage information such as the total number
of users, guests, messages, and storage in use.

You will also find interactive graphs that provide a detailed breakdown of
your organization's number of active users, messages sent, messages received,
and how these statistics have changed over time.

## View organization statistics

<FlattenedSteps>
  <NavigationSteps target="relative/gear/stats" />
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: animated-gifs.mdx]---
Location: zulip-main/starlight_help/src/content/docs/animated-gifs.mdx

```text
---
title: Animated GIFs
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import GifIcon from "~icons/zulip-icon/gif";

<ZulipNote>
  On self-hosted servers, this feature need to be
  [configured][configure-gifs] by a server administrator.
</ZulipNote>

Zulip integrates with [GIPHY](https://giphy.com) and [Tenor](https://tenor.com/), allowing you to
conveniently search for animated GIFs and include them in your
messages.

Organization administrators can [disable previews of linked
images](/help/image-video-and-website-previews#configure-whether-image-and-video-previews-are-shown),
including GIFs. When previews are enabled, everyone can
[customize](/help/image-video-and-website-previews#configure-how-animated-images-are-played)
how animated images are played.

## Insert a GIF

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click the **add GIF** (<GifIcon />) icon at
         the bottom of the compose box.
      1. Find a GIF you'd like to use.
      1. Click on an image to insert it in the compose box.
    </Steps>

    <ZulipTip>
      You can [preview your message](/help/preview-your-message-before-sending)
      before sending.
    </ZulipTip>
  </TabItem>
</Tabs>

## Restrict maximum rating of GIFs retrieved

<AdminOnly />

By default, the GIPHY and Tenor integrations are configured to only retrieve GIFs
that they categorize as rated G (General audience). You can change
this rating configuration or disable your GIF integration entirely:

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Compose settings**, select a rating for **GIF integration**.

  <SaveChanges />
</FlattenedSteps>

## Privacy

Zulip’s GIF picker supports third-party services, currently GIPHY
and Tenor. Any text you enter into the GIF search box will be
sent from your browser directly to the corresponding service’s API.
Because these requests are made client-side, the service you are
querying (GIPHY or Tenor) will be able to see your IP address
and may use that data for tracking, similar to if you visited their
website and performed the same search there.

Zulip proxies all external images in messages through the server,
including those from GIPHY and Tenor, to prevent images from being used to track
recipients of GIFs from both the integrations.

[configure-gifs]: https://zulip.readthedocs.io/en/latest/production/gif-picker-integrations.html

## Related articles

* [Image, video and website previews](/help/image-video-and-website-previews)
* [Share and upload files](/help/share-and-upload-files)
* [Insert a link](/help/insert-a-link)
```

--------------------------------------------------------------------------------

---[FILE: archive-a-channel.mdx]---
Location: zulip-main/starlight_help/src/content/docs/archive-a-channel.mdx

```text
---
title: Archive a channel
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SelectChannelViewGeneral from "../include/_SelectChannelViewGeneral.mdx";

import ArchiveIcon from "~icons/zulip-icon/archive";
import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";
import UnarchiveIcon from "~icons/zulip-icon/unarchive";

You can archive channels you no longer plan to use. Archiving a channel:

* Removes it from the left sidebar for all users.
* Prevents new messages from being sent to the channel.
* Prevents messages in the channel from being edited, deleted, or moved.

Archiving a channel does not unsubscribe users, or change who can access it.
Messages in archived channels still appear in [search
results](/help/search-for-messages), the [combined feed](/help/combined-feed),
and [recent conversations](/help/recent-conversations). If you prefer, you can
configure an archived channel to [hide its
content](#hide-content-in-an-archived-channel).

## Archive a channel

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.
      1. Click the **archive** (<ArchiveIcon />) icon
         in the upper right corner of the channel settings panel.
      1. Click **Confirm**.
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>
</Tabs>

## View archived channels

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select **Archived channels** from the dropdown next to the **Filter** box
         above the list of channels.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Hide content in an archived channel

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select **Archived channels** from the dropdown next to the **Filter** box
         above the list of channels.
      1. Select a channel.
      1. Select the **Subscribers** tab on the right.
      1. Remove all subscribers.

      <SelectChannelViewGeneral />

      1. Under **Channel permissions**, [make the channel
         private](/help/change-the-privacy-of-a-channel).
      1. Click **Advanced configuration** to view advanced configuration options.
      1. Under **Subscription permissions**, remove everyone from **Who can subscribe
         to this channel**, and **Who can subscribe anyone to this channel**. These
         permissions give users content access to the channel.
    </FlattenedSteps>
  </TabItem>
</Tabs>

You can also make these configuration changes prior to archiving a channel.

## Unarchive a channel

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select **Archived channels** from the dropdown in the upper left.
      1. Select a channel.
      1. Click the **unarchive** (<UnarchiveIcon />)
         icon in the upper right corner of the channel settings panel.
      1. Click **Confirm**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Edit a message](/help/edit-a-message)
* [Delete a message](/help/delete-a-message)
* [Delete a topic](/help/delete-a-topic)
* [Message retention policy](/help/message-retention-policy)
* [Channel permissions](/help/channel-permissions)
```

--------------------------------------------------------------------------------

---[FILE: bots-overview.mdx]---
Location: zulip-main/starlight_help/src/content/docs/bots-overview.mdx

```text
---
title: Bots overview
---

Bots allow you to

* Send content into and out of Zulip.
* Send content to and from another product.
* Automate tasks a human user could do.

A bot that sends content to or from another product is often called an
[integration](/help/integrations-overview).

## Pre-made bots

Zulip natively supports integrations with over one hundred products, and with
almost a thousand more through Zapier and IFTTT. If you're looking to add an
integration with an existing product, see our
[list of integrations](/integrations/), along with those of
[Zapier](https://zapier.com/apps) and [IFTTT](https://ifttt.com/search).

## Anatomy of a bot

You can think of a bot as a special kind of user, with limited permissions.
Each bot has a **name**, **profile picture**, **email**, **bot type** and **API key**.

* The **name** and **profile picture** play the same role they do for human users. They
  are the most visible attributes of a bot.
* The **email** is not used for anything, and will likely be removed in a
  future version of Zulip.
* The **bot type** determines what the bot can and can't do (see below).
* The **API key** is how the bot identifies itself to Zulip. Anyone with the
  bot's API key can impersonate the bot.

## Bot type

The **bot type** determines what the bot can do.

| Bot type         | Permissions                                                        | Common uses                                                     |
| ---------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Generic          | Like a normal user account                                         | Automating tasks, bots that listen to all messages on a channel |
| Incoming webhook | Limited to only sending messages into Zulip                        | Automated notifications into Zulip                              |
| Outgoing webhook | Generic bot that also receives new messages via HTTP post requests | Third party integrations, most custom bots                      |

A **generic** bot acts like a normal Zulip user that can only access Zulip via
the API. There's a handful of actions bots can't take, including creating other
bots.

An **outgoing webhook** bot can read direct messages where the bot
is a participant, and channel messages where the bot is
[mentioned](/help/mention-a-user-or-group). When the bot is DM'd or
mentioned, it POSTs the message content to a URL of your choice. The
POST request format can be in a Zulip format or a Slack-compatible
format. This is the preferred bot type for interactive bots built on
top of Zulip Botserver.

Use the most limited bot type that supports your integration. Anyone with the
bot's API key can do anything the bot can, so giving bots unnecessary
permissions can expose your organization to unnecessary risk.

## Channel permissions for bots

Bots can be subscribed to channels, and assigned [channel
permissions](/help/channel-permissions) just like human users. In private
channels with protected history, a bot can only access messages sent after it
was subscribed to the channel.

Bots can send messages to any channel that their owner can, inheriting their
owner's [sending permissions](/help/channel-posting-policy). You can give a bot
channel management permissions, just like you would for a human user.

## Adding bots

By default, anyone other than guests can [add a bot](/help/add-a-bot-or-integration) to a
Zulip organization, but administrators can
[restrict bot creation](/help/restrict-bot-creation). Any bot that is added
is visible and available for anyone to use.

## Integrations that act on behalf of users

If you want an integration to impersonate you (e.g., write messages that come
from your Zulip account), use your [personal API key](/api/api-keys), rather
than a bot's API key. You won't need to create a bot.

If you need a bot to send messages on behalf of multiple users, ask [Zulip
support](mailto:support@zulip.com) or your server administrator to run the
`manage.py change_user_role can_forge_sender` command to give a bot
permission to send messages as users in your organization. Bots with the
`can_forge_sender` permission can also see the names of all channels,
including private channels. This is important for implementing integrations
like the Jabber and IRC mirrors.

## Related articles

* [Integrations overview](/help/integrations-overview)
* [Add a bot or integration](/help/add-a-bot-or-integration)
* [Manage a bot](/help/manage-a-bot)
* [Request an integration](/help/request-an-integration)
* [Deactivate or reactivate a bot](/help/deactivate-or-reactivate-a-bot)
* [Restrict bot creation](/help/restrict-bot-creation)
* [View all bots in your organization](/help/view-all-bots-in-your-organization)
* [Generate URL for an integration](/help/generate-integration-url)
```

--------------------------------------------------------------------------------

---[FILE: bulleted-lists.mdx]---
Location: zulip-main/starlight_help/src/content/docs/bulleted-lists.mdx

```text
---
title: Bulleted lists
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import BulletedListsExamples from "../include/_BulletedListsExamples.mdx";
import BulletedListsIntro from "../include/_BulletedListsIntro.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import UnorderedListIcon from "~icons/zulip-icon/unordered-list";

<BulletedListsIntro />

## Create a bulleted list

<Tabs>
  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. *(optional)* Select the text you want to format.
      1. Click the **Bulleted list**
         (<UnorderedListIcon />) icon at the
         bottom of the compose box to insert list formatting.
      1. Press <kbd>Enter</kbd> to automatically add a new bullet to the list.
      1. When your list is done, press <kbd>Enter</kbd> a second time to remove the
         bullet.
    </FlattenedSteps>

    <ZulipTip>
      You can also use the **Bulleted list**
      (<UnorderedListIcon />) icon
      to remove existing list formatting from the current line or selected text.
    </ZulipTip>
  </TabItem>

  <TabItem label="Via Markdown">
    <FlattenedSteps>
      <StartComposing />

      1. Type `*`, `-`, or `+` followed by a space and some text to start a bulleted
         list.
      1. Press <kbd>Enter</kbd> to automatically add a new bullet to the list.
      1. When your list is done, press <kbd>Enter</kbd> a second time to remove the
         bullet.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Examples

<BulletedListsExamples />

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Resize the compose box](/help/resize-the-compose-box)
* [Numbered lists](/help/numbered-lists)
```

--------------------------------------------------------------------------------

---[FILE: change-a-users-name.mdx]---
Location: zulip-main/starlight_help/src/content/docs/change-a-users-name.mdx

```text
---
title: Change a user's name
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import ManageThisUser from "../include/_ManageThisUser.mdx";
import ManageUserTabTip from "../include/_ManageUserTabTip.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

import UserCogIcon from "~icons/zulip-icon/user-cog";

<AdminOnly />

By default, users can [change their name](/help/change-your-name), though
organization administrators can
[restrict name changes](/help/restrict-name-and-email-changes).

Organization administrators can always change any user's name.

## Change a user's name

<Tabs>
  <TabItem label="Via user profile">
    <FlattenedSteps>
      <ManageThisUser />

      1. Under **Name**, enter a new name.

      <SaveChanges />
    </FlattenedSteps>

    <ManageUserTabTip />
  </TabItem>

  <TabItem label="Via organization settings">
    <FlattenedSteps>
      <NavigationSteps target="settings/users" />

      1. Find the user you would like to manage. Click the
         **manage user** (<UserCogIcon />) icon
         to the right of their name.
      1. Under **Name**, enter a new name.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Change a user's role](/help/user-roles#change-a-users-role)
* [Deactivate or reactivate a user](/help/deactivate-or-reactivate-a-user)
* [Manage a user](/help/manage-a-user)
```

--------------------------------------------------------------------------------

---[FILE: change-organization-url.mdx]---
Location: zulip-main/starlight_help/src/content/docs/change-organization-url.mdx

```text
---
title: Change organization URL
---

import {Steps} from "@astrojs/starlight/components";

import ZulipTip from "../../components/ZulipTip.astro";
import CloudPlusOnly from "../include/_CloudPlusOnly.mdx";
import OwnerOnly from "../include/_OwnerOnly.mdx";

<OwnerOnly />

Zulip supports changing the URL for an organization. Users who navigate to the
old URL in the browser will see a notice about the organization being moved,
prior to being redirected to the new URL. [Links to channels, topics and
messages](/help/link-to-a-message-or-conversation) will thus continue to work.

When you change the URL:

* All users will be logged out of the web, mobile and desktop apps.
* Any [API clients](/api/) or [integrations](/integrations/) will need
  to be updated to point to the new organization URL.

<ZulipTip>
  Consider using a [wildcard
  mention](/help/mention-a-user-or-group#mention-everyone-on-a-channel)
  in an announcement channel to let users know about an upcoming change.
</ZulipTip>

## Change your Zulip Cloud subdomain

Zulip Cloud organizations are generally hosted at `<subdomain>.zulipchat.com`,
with the subdomain chosen when the organization was created. Organization
[owners](/help/user-roles) can request to change the subdomain.

Please email [support@zulip.com](mailto:support@zulip.com) with the following
information:

<Steps>
  1. Your organization's current subdomain.
  1. The subdomain you would like to move your organization to.
  1. Whether you want links to the old subdomain to redirect to the new one for an
     extended period of time. By default, the old subdomain may be freed up for
     reuse after 3 months.
</Steps>

## Move to a custom URL on Zulip Cloud

<CloudPlusOnly />

Because maintaining custom URLs requires effort from our operational team,
this feature is available only for organizations with 25+ [Zulip Cloud
Plus](https://zulip.com/plans/#cloud) licenses.

Please email [support@zulip.com](mailto:support@zulip.com) with the following
information:

<Steps>
  1. Your organization's current URL.
  1. The URL you would like to move your organization to.
</Steps>

## Change the URL for your self-hosted server

If you're self-hosting, you can change the root domain of your Zulip
server by changing the `EXTERNAL_HOST` [setting][zulip-settings].  If
you're [hosting multiple organizations][zulip-multiple-organizations]
and want to change the subdomain for one of them, you can do this
using the `change_realm_subdomain` [management command][management-commands].

In addition to configuring Zulip as detailed here, you also need to
generate [SSL certificates][ssl-certificates] for your new domain.

[ssl-certificates]: https://zulip.readthedocs.io/en/stable/production/ssl-certificates.html

[zulip-settings]: https://zulip.readthedocs.io/en/stable/production/settings.html

[zulip-multiple-organizations]: https://zulip.readthedocs.io/en/stable/production/multiple-organizations.html

[management-commands]: https://zulip.readthedocs.io/en/stable/production/management-commands.html#other-useful-manage-py-commands
```

--------------------------------------------------------------------------------

---[FILE: change-the-channel-description.mdx]---
Location: zulip-main/starlight_help/src/content/docs/change-the-channel-description.mdx

```text
---
title: Change a channel's description
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewGeneral from "../include/_SelectChannelViewGeneral.mdx";

import EditIcon from "~icons/zulip-icon/edit";

Channel descriptions can be used to explain the purpose of a channel, and link
to usage guidelines, resources, or related channels. They appear in the
navigation bar at the top of the web and desktop apps when you view the channel.
You can hover over long channel descriptions with the mouse to view them in
full.

Channel descriptions support Zulip's standard [Markdown
formatting][markdown-formatting], with the exception that image previews are
disabled. Use Markdown formatting to include a link to a website, Zulip
[message][message-link], or [topic][topic-link] in the channel description:
`[link text](URL)`.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewGeneral />

      1. Click the **edit channel name and description**
         (<EditIcon />) icon to the right of the
         channel name, and enter a new description.

      <SaveChanges />
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>

  <TabItem label="Mobile">
    Access this feature by following the web app instructions in your
    mobile device browser.

    Implementation of this feature in the mobile app is tracked [on
    GitHub](https://github.com/zulip/zulip-flutter/issues/1102). If
    you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>

## Related articles

* [Pin information](/help/pin-information)
* [View channel information](/help/view-channel-information)
* [Rename a channel](/help/rename-a-channel)
* [Markdown formatting][markdown-formatting]
* [Configure automated notices for channel events](/help/configure-automated-notices#channel-events)
* [Channel permissions](/help/channel-permissions)

[markdown-formatting]: /help/format-your-message-using-markdown

[message-link]: /help/link-to-a-message-or-conversation#get-a-link-to-a-specific-message

[topic-link]: /help/link-to-a-message-or-conversation#get-a-link-to-a-specific-topic
```

--------------------------------------------------------------------------------

---[FILE: change-the-color-of-a-channel.mdx]---
Location: zulip-main/starlight_help/src/content/docs/change-the-color-of-a-channel.mdx

```text
---
title: Change the color of a channel
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ChannelActions from "../include/_ChannelActions.mdx";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SelectChannelViewPersonal from "../include/_SelectChannelViewPersonal.mdx";

Zulip assigns each of your channels a color when you subscribe to the
channel. Changing a channel's color does not change it for anyone else.

<Tabs>
  <TabItem label="Via left sidebar">
    <FlattenedSteps>
      <ChannelActions />

      1. Click **Change color**.
      1. Select a color from the grid, use the color picker, or enter a hex code.
      1. Click **Confirm** to save and apply the color change.
      1. Click outside the box to close the menu.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via channel settings">
    <FlattenedSteps>
      <NavigationSteps target="relative/gear/channel-settings" />

      1. Select a channel.

      <SelectChannelViewPersonal />

      1. Under **Personal settings**, click on the colored square below **Channel color**.
      1. Select a color from the grid, use the color picker, or enter a hex code.
      1. Click **Choose** to save and apply the color change.
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>
</Tabs>

## Related articles

* [Introduction to channels](/help/introduction-to-channels)
* [Channel folders](/help/channel-folders)
* [Pin a channel](/help/pin-a-channel)
* [Mute or unmute a channel](/help/mute-a-channel)
* [Hide or reveal inactive channels](/help/manage-inactive-channels)
```

--------------------------------------------------------------------------------

---[FILE: change-the-privacy-of-a-channel.mdx]---
Location: zulip-main/starlight_help/src/content/docs/change-the-privacy-of-a-channel.mdx

```text
---
title: Change the privacy of a channel
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ChannelPrivacyTypes from "../include/_ChannelPrivacyTypes.mdx";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import ContentAccessDefinition from "../include/_ContentAccessDefinition.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewPermissions from "../include/_SelectChannelViewPermissions.mdx";

<ChannelPrivacyTypes />

Organization administrators and [channel
administrators](/help/configure-who-can-administer-a-channel) can always make a
channel private. However, they can only make a private channel public or
web-public if they have content access to it:

<ContentAccessDefinition />

<ZulipNote>
  **Warning**: Be careful making a private channel public. All past messages
  will become accessible, even if the channel previously had protected history.
</ZulipNote>

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewPermissions />

      1. Under **Subscription permissions**, configure **Who can access this channel**.

      <SaveChanges />
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>

  <TabItem label="Mobile">
    Access this feature by following the web app instructions in your
    mobile device browser.

    Implementation of this feature in the mobile app is tracked [on
    GitHub](https://github.com/zulip/zulip-flutter/issues/1102). If
    you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>

## Related articles

* [Channel permissions](/help/channel-permissions)
* [Channel posting policy](/help/channel-posting-policy)
* [Configure who can administer a channel](/help/configure-who-can-administer-a-channel)
* [Configure automated notices for channel events](/help/configure-automated-notices#channel-events)
```

--------------------------------------------------------------------------------

---[FILE: change-the-time-format.mdx]---
Location: zulip-main/starlight_help/src/content/docs/change-the-time-format.mdx

```text
---
title: Change the time format
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

Based on your preference, Zulip can display times either in a 12-hour
format (e.g., 5:00 PM) or a 24-hour format (e.g., 17:00).

### Change the time format

<FlattenedSteps>
  <NavigationSteps target="settings/preferences" />

  1. Under **General**, select your preferred option from the
     **Time format** dropdown.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: change-your-email-address.mdx]---
Location: zulip-main/starlight_help/src/content/docs/change-your-email-address.mdx

```text
---
title: Change your email address
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

import EditIcon from "~icons/zulip-icon/edit";

By default, anyone can change their email address at any time.

Organization administrators can
[restrict users to certain email domains](/help/restrict-account-creation#configuring-email-domain-restrictions), or
[prevent users from changing their email](/help/restrict-name-and-email-changes).

## Change your email address

<FlattenedSteps>
  <NavigationSteps target="settings/account-and-privacy" />

  1. Under **Account**, click on the
     **change your email** (<EditIcon />) icon
     to the right of your current email. If you do not see the
     **change your email** (<EditIcon />) icon,
     you do not have permission to change your email address.
  1. Enter your new email, and click **Change**.
  1. You will receive a confirmation email within a few minutes. Open it,
     and click **Confirm email change**.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: change-your-language.mdx]---
Location: zulip-main/starlight_help/src/content/docs/change-your-language.mdx

```text
---
title: Change your language
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import TranslationProjectInfo from "../include/_TranslationProjectInfo.mdx";

<TranslationProjectInfo />

## Change the language of the Zulip app

Note that this will not change channel names, topic names (other than [*general
chat*](/help/general-chat-topic)), or the language of messages you receive.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/preferences" />

      1. Under **General**, select a language from the dropdown under **Language**.
         Languages are marked as 100% translated only if every string
         in the web, desktop, and mobile apps is translated, including
         administrative UI and all error messages that the API can return.
      1. Click **Reload**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    Access this feature by following the web app instructions in your
    mobile device browser.

    Implementation of this feature in the mobile app is tracked [on
    GitHub](https://github.com/zulip/zulip-flutter/issues/1139). If
    you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>

## Font configuration for unsupported languages

Zulip uses the Source Sans 3 font, which [supports over 30 languages][adobe-docs].
If Source Sans 3 does not support your language, you may need to configure your
browser to use a different font or adjust the default font size to properly
display all the characters. See the documentation for [Chrome][chrome-docs],
[Firefox][firefox-docs], or [Edge][edge-docs] for more information on how to
configure your browser's default font.

[adobe-docs]: https://fonts.adobe.com/fonts/source-sans-3#details-section

[chrome-docs]: https://support.google.com/chrome/answer/96810

[firefox-docs]: https://support.mozilla.org/en-US/kb/change-fonts-and-colors-websites-use#w_custom-fonts

[edge-docs]: https://support.microsoft.com/en-us/microsoft-edge/increase-default-text-size-in-microsoft-edge-c62f80af-381d-0716-25a3-c4856dd3806c

## Related articles

* [Configure organization language for automated messages and invitation emails][org-lang]

[org-lang]: /help/configure-organization-language
```

--------------------------------------------------------------------------------

````
