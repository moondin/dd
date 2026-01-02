---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 458
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 458 of 1290)

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

---[FILE: configure-a-custom-welcome-message.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-a-custom-welcome-message.mdx

```text
---
title: Configure a custom welcome message
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import InviteUsers from "../include/_InviteUsers.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

You can configure a custom welcome message to be sent to new users in your
organization, along with standard onboarding messages from Welcome Bot. For
example, you can describe the purpose of important channels, and link to your
organization's guidelines for using Zulip.

Administrators can also customize the message each time they [create an
invitation](/help/invite-new-users). Invitations sent by other users will always
use the default custom welcome message configured by your organization's
administrators.

<ZulipTip>
  You can compose the welcome message in the compose box to benefit from
  buttons and typeahead suggestions for message formatting, and copy it over.
</ZulipTip>

## Configure a default custom welcome message

<AdminOnly />

Users will receive the message that's configured at the time when they accept
the invitation, so there's no need to update or revoke invitations when you
change the welcome message.

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Onboarding**, enable **Send a custom Welcome Bot message to
     new users**.
  1. Under **Message text**, enter a custom welcome message using Zulip's standard
     [Markdown formatting](/help/format-your-message-using-markdown).
  1. *(optional)* Click **Send me a test message**, followed by **View message**,
     to see how the message will look. Follow the instructions above to return to
     the panel where this setting can be configured.

  <SaveChanges />
</FlattenedSteps>

## Customize the welcome message when sending an invitation

<AdminOnly />

<FlattenedSteps>
  <InviteUsers />

  1. If there is no custom message configured in your organization, enable **Send
     a custom Welcome Bot message**. Otherwise, disable **Send the default Welcome
     Bot message configured for this organization**.
  1. Under **Message text**, enter the welcome message to use for this
     invitation using Zulip's standard [Markdown
     formatting](/help/format-your-message-using-markdown).
  1. Configure other invitation details as desired, and click **Invite** or
     **Create link**.
</FlattenedSteps>

## Related articles

* [Invite new users](/help/invite-new-users)
* [Set default channels for new users](/help/set-default-channels-for-new-users)
* [Configure default new user settings](/help/configure-default-new-user-settings)
* [Joining a Zulip organization](/help/join-a-zulip-organization)
```

--------------------------------------------------------------------------------

---[FILE: configure-authentication-methods.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-authentication-methods.mdx

```text
---
title: Configure authentication methods
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import OwnerOnly from "../include/_OwnerOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

<OwnerOnly />

You can choose which authentication methods to enable for users to log in to
your organization. The following options are available on all
[plans](https://zulip.com/plans/):

* Email and password
* Social authentication: Google, GitHub, GitLab, Apple

The following options are available for organizations on Zulip Cloud Standard,
Zulip Cloud Plus, and all self-hosted Zulip servers:

* Oauth2 with Microsoft Entra ID (AzureAD)

The following options are available for organizations on Zulip Cloud Plus, and all self-hosted Zulip servers:

* [SAML authentication](/help/saml-authentication), including Okta, OneLogin, Entra ID (AzureAD), Keycloak, Auth0
* [SCIM provisioning](/help/scim)

The following authentication and identity management options are available for
all self-hosted servers. If you are interested in one of these options for a
Zulip Cloud organization, contact [support@zulip.com](mailto:support@zulip.com)
to inquire.

* [AD/LDAP user
  sync](https://zulip.readthedocs.io/en/stable/production/authentication-methods.html#ldap-including-active-directory)
* [AD/LDAP group
  sync](https://zulip.readthedocs.io/en/stable/production/authentication-methods.html#ldap-including-active-directory)
* [OpenID
  Connect](https://zulip.readthedocs.io/en/stable/production/authentication-methods.html#openid-connect)
* [Custom authentication
  options](https://python-social-auth.readthedocs.io/en/latest/backends/index.html#social-backends)
  with python-social-auth

### Configure authentication methods

<ZulipNote>
  For self-hosted organizations, some authentication options require
  that you first [configure your
  server](https://zulip.readthedocs.io/en/stable/production/authentication-methods.html)
  to support the option.
</ZulipNote>

<ZulipTip>
  Before disabling an authentication method, test that you can
  successfully log in with one of the remaining authentication methods.
  The [`change_auth_backends` management
  command](https://zulip.readthedocs.io/en/stable/production/management-commands.html)
  can help if you accidentally lock out all administrators.
</ZulipTip>

<FlattenedSteps>
  <NavigationSteps target="settings/auth-methods" />

  1. To use SAML authentication or SCIM provisioning, Zulip Cloud organizations
     must upgrade to [Zulip Cloud Plus](https://zulip.com/plans/), and contact
     [support@zulip.com](mailto:support@zulip.com) to enable these methods.
  1. Toggle the checkboxes next to the available login options.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [Configuring authentication methods](https://zulip.readthedocs.io/en/stable/production/authentication-methods.html)
  for server administrators (self-hosted only)
* [SAML authentication](/help/saml-authentication)
* [SCIM provisioning](/help/scim)
```

--------------------------------------------------------------------------------

---[FILE: configure-automated-notices.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-automated-notices.mdx

```text
---
title: Configure automated notices
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

The Zulip sends automated notices via Notification Bot to notify users about
changes in their organization or account. Some types of notices can be
configured, or disabled altogether.

Notices sent to channels are translated into the language that the organization
has configured as the [language for automated messages and invitation
emails](/help/configure-organization-language). The topic name is also
translated. Notices sent directly to users will use [their preferred
language](/help/change-your-language).

## Notices about channels

### New channel announcements

<AdminOnly />

When creating a new [public](/help/channel-permissions#public-channels) or
[web-public](/help/channel-permissions#web-public-channels) channel, the channel
creator can choose to advertise the new channel via an automated notice. You can
configure what channel Zulip uses for these notices, or disable these notices
entirely. The topic for these messages is “new channels”.

New [private](/help/channel-permissions#private-channels) channels are never
announced.

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Automated messages and emails**, configure **New channel
     announcements**.

  <SaveChanges />
</FlattenedSteps>

### Channel events

You can configure whether Zulip will send an automated message when a channel's
settings are updated. If enabled, Notification Bot will send messages about
updates to settings such as the channel [name](/help/rename-a-channel),
[description](/help/change-the-channel-description),
[privacy](/help/change-the-privacy-of-a-channel) and [posting
policy](/help/channel-posting-policy). Messages will be sent to the “channel
events” topic in the modified channel.

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Automated messages and emails**, configure **Send automated
     messages for channel events**.

  <SaveChanges />
</FlattenedSteps>

## Notices about topics

A notice is sent when a topic is [resolved or
unresolved](/help/resolve-a-topic). Users can
[configure](/help/marking-messages-as-read#configure-whether-resolved-topic-notices-are-marked-as-read)
whether these notices are automatically marked as read.

Additionally, when moving messages to another
[channel](/help/move-content-to-another-channel) or
[topic](/help/move-content-to-another-topic), users can decide whether to send
automated notices to help others understand how content was moved.

## Notices about users

You will be notified if someone [subscribes you to a
channel](/help/subscribe-users-to-a-channel), or changes your
[group](/help/user-groups) membership.

### New user announcements

<AdminOnly />

You can configure where Notification Bot will post an announcement when new
users join your organization, or disable new user announcement messages
entirely. The topic for these messages is “signups”.

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Automated messages and emails**, configure **New user
     announcements**.

  <SaveChanges />
</FlattenedSteps>

## Zulip update announcements

Zulip announces new features and other important product changes via automated
messages. This is designed to help users discover new features they may find
useful, including new configuration options.

These announcements are posted to the “Zulip updates” topic in the
channel selected by organization administrators (usually 1-2x a month
on Zulip Cloud). You can read update messages whenever it's
convenient, or [mute](/help/mute-a-topic) the topic if you are not
interested. If you organization does not want to receive these
announcements, they can be disabled.

On self-hosted Zulip servers, announcement messages are shipped with the Zulip
server version that includes the new feature or product change. You may thus
receive several announcement messages when your server is upgraded.

Unlike other notices, Zulip update announcements are not translated.

### Configure Zulip update announcements

<AdminOnly />

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Automated messages and emails**, configure **Zulip update
     announcements**.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [Organization language for automated messages and invitation emails](/help/configure-organization-language)
* [Moderating open organizations](/help/moderating-open-organizations)
* [Zulip Cloud newsletter](/help/email-notifications#low-traffic-newsletter)
```

--------------------------------------------------------------------------------

---[FILE: configure-call-provider.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-call-provider.mdx

```text
---
title: Configure call provider
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

<AdminOnly />

By default, Zulip integrates with
[Jitsi Meet](https://jitsi.org/jitsi-meet/), a fully-encrypted, 100% open
source video conferencing solution. Organization administrators can also
change the organization's call provider. The call providers
supported by Zulip are:

* [Jitsi Meet](/integrations/jitsi)
* [Zoom integration](/integrations/zoom)
* [BigBlueButton integration](/integrations/big-blue-button)

<ZulipTip>
  You can disable the video and voice call buttons for your organization
  by setting the **call provider** to "None".
</ZulipTip>

## Configure your organization's call provider

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Compose settings**, select the desired provider from the
     **Call provider** dropdown.

  <SaveChanges />
</FlattenedSteps>

## Use a self-hosted instance of Jitsi Meet

Zulip uses the [cloud version of Jitsi Meet](https://meet.jit.si/)
as its default call provider. You can also use a self-hosted
instance of Jitsi Meet.

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Compose settings**, select **Custom URL** from the
     **Jitsi server URL** dropdown.
  1. Enter the URL of your self-hosted Jitsi Meet server.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [Start a call](/help/start-a-call)
* [Jitsi Meet integration](/integrations/jitsi)
* [Zoom integration](/integrations/zoom)
* [BigBlueButton integration](/integrations/big-blue-button)
```

--------------------------------------------------------------------------------

---[FILE: configure-default-new-user-settings.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-default-new-user-settings.mdx

```text
---
title: Configure default settings for new users
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

<AdminOnly />

Organization administrators can configure the default values of
personal preference settings for new users joining the
organization. This can help seamlessly customize the Zulip experience
to match how the organization in question is using Zulip.

Existing users' preferences cannot be modified by administrators, and
users will be able to customize their own settings once they
join. Administrators can customize defaults for all personal
preference settings, including the following:

* Privacy settings:
  * Displaying [availability](/help/status-and-availability) to other users
  * Allowing others to see when the user has [read
    messages](/help/read-receipts)
  * Allowing others to see when the user is [typing a
    message](/help/typing-notifications)
* Preferences:
  * [Language](/help/change-your-language)
  * [Time format](/help/change-the-time-format)
  * [Light theme vs. dark theme](/help/dark-theme)
  * [Font size](/help/font-size)
  * [Line spacing](/help/line-spacing)
  * [Emoji theme](/help/emoji-and-emoticons#change-your-emoji-set)
  * [Home view](/help/configure-home-view)
    ([**Inbox**](/help/inbox) vs.
    [**Recent conversations**](/help/recent-conversations) vs.
    [**Combined feed**](/help/reading-strategies#combined-feed))
* Notification settings:
  * What types of messages [trigger notifications][default-notifications]
  * Which topics users will [automatically follow](/help/follow-a-topic). This
    minimizes the need to [mention](/help/mention-a-user-or-group) other users
    to get their attention.

[default-notifications]: /help/channel-notifications#configure-default-notifications-for-all-channels

## Configure default settings for new users

Users will have the initial settings that are configured at the time when they
accept the invitation, so there's no need to update or revoke invitations when
you change default settings.

<FlattenedSteps>
  <NavigationSteps target="settings/default-user-settings" />

  1. Review all settings and adjust as needed.
</FlattenedSteps>

## Configure default language for new users

Your organization's [language](/help/configure-organization-language) will be
the default language for new users when Zulip cannot detect their language
preferences from their browser, including all users [created via the Zulip
API](/api/create-user).

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Automated messages and emails**, change the **Language for
     automated messages and invitation emails**.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [Moving to Zulip](/help/moving-to-zulip)
* [Customize settings for new users](/help/customize-settings-for-new-users)
* [Set default channels for new users](/help/set-default-channels-for-new-users)
* [Invite users to join](/help/invite-users-to-join)
```

--------------------------------------------------------------------------------

---[FILE: configure-email-visibility.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-email-visibility.mdx

```text
---
title: Configure email visibility
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";

With privacy in mind, Zulip lets you control which
[roles](/help/user-roles) in the organization can view your email
address. Administrators can set the default email visibility configuration
for new users in the organization.

## Configure who can access your email address

<Tabs>
  <TabItem label="On sign-up">
    <Steps>
      1. After confirming your email, click **Change** below your email address.
      1. Configure **Who can access your email address**.
      1. Click **Confirm** to apply your changes, and continue the account registration
         process.
    </Steps>
  </TabItem>

  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/account-and-privacy" />

      1. Under **Privacy**, configure **Who can access your email address**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Configure default email visibility for new users

<AdminOnly />

<FlattenedSteps>
  <NavigationSteps target="settings/default-user-settings" />

  1. Under **Privacy settings**, configure **Who can access user's email address**.
</FlattenedSteps>

## Related articles

* [Moderating open organizations](/help/moderating-open-organizations)
* [Restrict name and email changes](/help/restrict-name-and-email-changes)
```

--------------------------------------------------------------------------------

---[FILE: configure-emoticon-translations.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-emoticon-translations.mdx

```text
---
title: Configure emoticon translations
---

import EmoticonTranslations from "../../components/EmoticonTranslations.astro";
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

You can configure whether emoticons like `:)` or `:(` will be automatically
translated into emoji equivalents like 🙂 or 🙁 by Zulip.

## Configure emoticon translations

<FlattenedSteps>
  <NavigationSteps target="settings/preferences" />

  1. Under **Emoji**, toggle **Convert emoticons before sending**.
</FlattenedSteps>

## List of emoticon translations

<EmoticonTranslations />

## Related articles

* [Emoji and emoticons](/help/emoji-and-emoticons)
* [Add custom emoji](/help/custom-emoji)
* [Emoji reactions](/help/emoji-reactions)
```

--------------------------------------------------------------------------------

---[FILE: configure-home-view.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-home-view.mdx

```text
---
title: Configure home view
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";

import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";

The home view in Zulip is the view you reach after logging in
to the Zulip web app. You can also navigate to the home view via
keyboard shortcuts.

The home views available in Zulip are
[**Inbox**](/help/inbox),
[**Recent conversations**](/help/recent-conversations), and
[**Combined feed**](/help/combined-feed). See
[Reading strategies](/help/reading-strategies) for recommendations
on how to use these views.

You can configure which view is set as your home view, and whether
the <kbd>Esc</kbd> key navigates to the home view. Also, you can
always reach the home view by using the
<kbd data-mac-key="Ctrl">Ctrl</kbd> + <kbd>\[</kbd> shortcut.

## Change home view

Organization administrators can [configure the home view for their
organization](/help/configure-default-new-user-settings) to
[**Inbox**](/help/inbox),
[**Recent conversations**](/help/recent-conversations), or
[**Combined feed**](/help/combined-feed).

* The **Inbox** view works best if you regularly clear all unread messages in
  channels you follow.
* **Recent conversations** works well for getting an overview of recent activity.
* **Combined feed** is convenient for low-traffic organizations, or for skimming
  messages as they come in.

You can customize your personal home view regardless of
organization settings:

<FlattenedSteps>
  <NavigationSteps target="settings/preferences" />

  1. Under **Navigation**, click on the **Home view** dropdown
     and select a view.
  1. To see your changes in action, open a new Zulip tab, or use a keyboard
     shortcut twice to exit the settings and navigate to your home view
     (<kbd data-mac-key="Ctrl">Ctrl</kbd> + <kbd>\[</kbd> or <kbd>Esc</kbd>
     if enabled).
</FlattenedSteps>

<ZulipTip>
  You can also hover over your desired home view in the left sidebar, and
  choose the option to **make it your home view** in the **ellipsis**
  (<MoreVerticalIcon />) menu.
</ZulipTip>

## Configure whether <kbd>Esc</kbd> navigates to the home view

Zulip has a number of [keyboard shortcuts](/help/keyboard-shortcuts)
designed to enhance the user experience in the app.

By default, the <kbd>Esc</kbd> key shortcut will ultimately navigate to
your home view. You can disable this key binding if you would prefer.
This will not disable other <kbd>Esc</kbd> key shortcuts used in Zulip,
and will not affect the behavior of the
<kbd data-mac-key="Ctrl">Ctrl</kbd> + <kbd>\[</kbd> shortcut.

### Toggle whether <kbd>Esc</kbd> navigates to the home view

<FlattenedSteps>
  <NavigationSteps target="settings/preferences" />

  1. Under **Navigation**, toggle **Escape key navigates to
     home view**, as desired.
</FlattenedSteps>

## Related articles

* [Reading strategies](/help/reading-strategies)
* [Recent conversations](/help/recent-conversations)
* [Combined feed](/help/combined-feed)
* [Keyboard shortcuts](/help/keyboard-shortcuts)
```

--------------------------------------------------------------------------------

---[FILE: configure-how-links-open.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-how-links-open.mdx

```text
---
title: Configure how links open in mobile apps
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import MobileSettings from "../include/_MobileSettings.mdx";

You can configure whether website links will open directly in the Zulip app, or
in your device's default browser.

## Configure whether to open links within the app

<Tabs>
  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileSettings />

      1. Toggle **Open links with in-app browser**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Link to a message or conversation](/help/link-to-a-message-or-conversation)
```

--------------------------------------------------------------------------------

---[FILE: configure-multi-language-search.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-multi-language-search.mdx

```text
---
title: Configure multi-language search
---

Zulip supports [full-text search](/help/search-for-messages), which can be
combined arbitrarily with Zulip's full suite of [search
filters](/help/search-for-messages#search-filters). By default, Zulip search
only supports English text, using [PostgreSQL's built-in full-text search
feature](https://www.postgresql.org/docs/current/textsearch.html), with a custom
set of English stop words to improve the quality of the search results.

Self-hosted Zulip organizations can instead set up an experimental
[PGroonga](https://pgroonga.github.io/) integration that provides full-text
search for all languages simultaneously, including Japanese and Chinese. See
[here](https://zulip.readthedocs.io/en/stable/subsystems/full-text-search.html#multi-language-full-text-search)
for setup instructions.

## Related articles

* [Configure organization language for automated messages and invitation emails][org-lang]
* [Searching for messages](/help/search-for-messages)

[org-lang]: /help/configure-organization-language
```

--------------------------------------------------------------------------------

---[FILE: configure-organization-language.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-organization-language.mdx

```text
---
title: Organization language for automated messages and invitation emails
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import TranslationProjectInfo from "../include/_TranslationProjectInfo.mdx";

<AdminOnly />

<TranslationProjectInfo />

Each user can use Zulip with [their preferred language][user-lang].
Additionally, if your organization has a primary language other than
American English, you can set the language used for the organization's
automated messages and invitation emails. This setting:

* Determines the language used for [automated
  notices](/help/configure-automated-notices) that are sent to channels, including
  both the topic name and message content. (Automated messages sent to a single
  user will use that user's preferred language).
* Determines the language used for outgoing
  [invitation emails](/help/invite-new-users).
* Is used as the default language for new user accounts when Zulip
  cannot detect their language preferences from their browser,
  including all users [created via the Zulip API][api-create-user].

## Configure the organization language

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Automated messages and emails**, change the **Language for
     automated messages and invitation emails**.

  <SaveChanges />
</FlattenedSteps>

## Related articles

* [Change your language][user-lang]
* [Configure multi-language search](/help/configure-multi-language-search)
* [Configure default settings for new users](/help/configure-default-new-user-settings)
* [Configure automated notices](/help/configure-automated-notices)

[api-create-user]: https://zulip.com/api/create-user

[user-lang]: /help/change-your-language
```

--------------------------------------------------------------------------------

---[FILE: configure-send-message-keys.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-send-message-keys.mdx

```text
---
title: Configure send message keys
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import StartComposing from "../include/_StartComposing.mdx";

import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";
import SendIcon from "~icons/zulip-icon/send";

By default, the <kbd>Enter</kbd> key adds a new line to your message,
and <kbd>Ctrl</kbd> + <kbd>Enter</kbd> sends your message.

This is convenient for typing multi-line messages, which are more common in
Zulip than in most other chat products. However, you can also configure
Zulip so that the <kbd>Enter</kbd> key sends your message.

<ZulipTip>
  <kbd>Shift</kbd> + <kbd>Enter</kbd> always adds a new line, regardless
  of whether **<kbd>Enter</kbd> to send** is enabled.
</ZulipTip>

## Configure send message keys

<Tabs>
  <TabItem label="Via compose box">
    <FlattenedSteps>
      <StartComposing />

      1. Click on the **ellipsis** (<MoreVerticalIcon />)
         in the bottom right corner of the compose box, next to the **Send**
         (<SendIcon />) button.
      1. Toggle your preferred option for **Press ... to send**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via personal settings">
    <FlattenedSteps>
      <NavigationSteps target="settings/preferences" />

      1. Under **General**, toggle **<kbd>Enter</kbd> sends when composing a message**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Mastering the compose box](/help/mastering-the-compose-box)
```

--------------------------------------------------------------------------------

---[FILE: configure-unread-message-counters.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-unread-message-counters.mdx

```text
---
title: Configure unread message counters
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";

To provide information about unread messages, Zulip can show unread message
counters next to channel names in the left sidebar. This is likely to be helpful
if you generally read (or otherwise [mark as read](/help/marking-messages-as-read))
all the messages in a channel, but may otherwise feel unnecessary.

## Configure unread message counters

Zulip offers an option to display a dot instead of an unread counter for channels
in the left sidebar. You can use a dot for all channels, or just for channels you
have [muted](/help/mute-a-channel). You will still be able to see the number of
unread messages in a channel by moving your mouse over it in the left sidebar or
opening it.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="settings/preferences" />

      1. Under **Left sidebar**, select your preferred option from the
         **Show unread counts for** dropdown.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Configure unread summary counters

You can configure whether Zulip displays unread count summaries on your home
view in the left sidebar. You will still be able to see the
summary counts by moving your mouse over them in the left sidebar. The counter
on your home view will also be shown when you're in that view.

<Tabs>
  <TabItem label="Via left sidebar">
    <Steps>
      1. Hover over your configured [home view](/help/configure-home-view) in the
         **views** section of the left sidebar.
      1. Click on the **ellipsis** (<MoreVerticalIcon />).
      1. Click the option to hide or show the unread counter.
    </Steps>
  </TabItem>

  <TabItem label="Via personal settings">
    <FlattenedSteps>
      <NavigationSteps target="settings/preferences" />

      1. Under **Left sidebar**, toggle **Show unread count total on home view**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Reading strategies](/help/reading-strategies)
* [Marking messages as read](/help/marking-messages-as-read)
* [Marking messages as unread](/help/marking-messages-as-unread)
* [Star a message](/help/star-a-message)
* [Desktop notifications](/help/desktop-notifications)
```

--------------------------------------------------------------------------------

---[FILE: configure-where-you-land.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-where-you-land.mdx

```text
---
title: Configure where you land in message feeds
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import MobileSettings from "../include/_MobileSettings.mdx";

When you go to a message feed in the Zulip web or desktop app, you'll generally
land at your oldest unread message in that view.
[Searches](/help/search-for-messages) and [starred
messages](/help/star-a-message) put you at the newest message instead.

In the mobile app, you can choose where message feeds will open:

* **First unread message**: Recommended if you like to clear your inbox of
  unread messages.
* **First unread message in conversation views, newest message elsewhere**: In
  Zulip, a **conversation** is a [direct message](/help/direct-messages) thread
  (one-on-one or with a group), or a [topic in a
  channel](/help/introduction-to-topics). This option works well if you have old
  unread messages, and don't want to navigate there in your [Combined
  feed](/help/combined-feed) and [channel feeds](/help/channel-feed).
* **Newest message**: You may be used to this behavior from other chat
  applications. To avoid accidentally marking messages as read,
  consider setting [Mark messages as read on
  scroll](/help/marking-messages-as-read#configure-whether-messages-are-automatically-marked-as-read)
  to **Never** when using this setting.

<Tabs>
  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileSettings />

      1. Tap **Open message feeds at**.
      1. Select the desired configuration.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Marking messages as read](/help/marking-messages-as-read)
* [Reading strategies](/help/reading-strategies)
```

--------------------------------------------------------------------------------

---[FILE: configure-who-can-administer-a-channel.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-who-can-administer-a-channel.mdx

```text
---
title: Configure who can administer a channel
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ChannelAdminPermissions from "../include/_ChannelAdminPermissions.mdx";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewPermissions from "../include/_SelectChannelViewPermissions.mdx";

<ZulipNote>
  Organization administrators can automatically administer all channels.
</ZulipNote>

<ChannelAdminPermissions />

## Configure who can administer a channel

<FlattenedSteps>
  <NavigationSteps target="relative/channel/all" />

  1. Select a channel.

  <SelectChannelViewPermissions />

  1. Under **Administrative permissions**, configure **Who can administer
     this channel**.

  <SaveChanges />
</FlattenedSteps>

<ChannelSettingsNavbarTip />

## Related articles

* [Channel permissions](/help/channel-permissions)
* [User roles](/help/user-roles)
* [User groups](/help/user-groups)
* [Channel posting policy](/help/channel-posting-policy)
* [Configure who can unsubscribe anyone from a channel](/help/configure-who-can-unsubscribe-others)
* [Archive a channel](/help/archive-a-channel)
```

--------------------------------------------------------------------------------

---[FILE: configure-who-can-create-channels.mdx]---
Location: zulip-main/starlight_help/src/content/docs/configure-who-can-create-channels.mdx

```text
---
title: Restrict channel creation
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

<AdminOnly />

Zulip allows you to separately control [permissions](/help/manage-permissions)
for creating [web-public](/help/public-access-option), public and private
channels.

For corporations and other organizations with controlled access, we
recommend keeping channel creation open to make it easy for users to
self-organize.

Only users in trusted roles (moderators and administrators) can be
given permission to create web-public channels. This is intended
[to help manage abuse](/help/public-access-option#managing-abuse) by
making it hard for an attacker to host malicious content in an
unadvertised web-public channel in a legitimate organization.

### Manage who can create channels

<Tabs>
  <TabItem label="Public channels">
    <FlattenedSteps>
      <NavigationSteps target="settings/organization-permissions" />

      1. Under **Channel permissions**, configure **Who can create public channels**.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Private channels">
    <FlattenedSteps>
      <NavigationSteps target="settings/organization-permissions" />

      1. Under **Channel permissions**, configure **Who can create private channels**.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Web-public channels">
    <FlattenedSteps>
      <NavigationSteps target="settings/organization-permissions" />

      1. Under **Channel permissions**, configure **Who can create web-public channels**.

      <SaveChanges />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Channel permissions](/help/channel-permissions)
* [User roles](/help/user-roles)
* [Create a channel](/help/create-a-channel)
* [Introduction to channels](/help/introduction-to-channels)
```

--------------------------------------------------------------------------------

````
