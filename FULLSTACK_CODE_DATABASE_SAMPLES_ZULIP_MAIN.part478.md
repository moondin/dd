---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 478
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 478 of 1290)

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

---[FILE: _GoToReminders.mdx]---
Location: zulip-main/starlight_help/src/content/include/_GoToReminders.mdx

```text
import AlarmClockIcon from "~icons/zulip-icon/alarm-clock";
import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";

1. Click on <AlarmClockIcon /> **Reminders**
   in the left sidebar. If the **views** section is collapsed, click on
   the **ellipsis** (<MoreVerticalIcon />), and
   select <AlarmClockIcon /> **Reminders**.
```

--------------------------------------------------------------------------------

---[FILE: _GoToScheduledMessages.mdx]---
Location: zulip-main/starlight_help/src/content/include/_GoToScheduledMessages.mdx

```text
import CalendarDaysIcon from "~icons/zulip-icon/calendar-days";
import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";

1. Click on <CalendarDaysIcon /> **Scheduled messages**
   in the left sidebar. If the **views** section is collapsed, click on
   the **ellipsis** (<MoreVerticalIcon />), and
   select <CalendarDaysIcon /> **Scheduled messages**.
```

--------------------------------------------------------------------------------

---[FILE: _HowToCreateAUserGroup.mdx]---
Location: zulip-main/starlight_help/src/content/include/_HowToCreateAUserGroup.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";

import UserGroupPlusIcon from "~icons/zulip-icon/user-group-plus";

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/gear/group-settings" />

      1. Click **Create user group** on the right, or click the
         **create new user group** (<UserGroupPlusIcon />)
         icon in the upper right.
      1. Fill out the requested information, and click **Continue to add
         members**.
      1. Under **Add members**, enter groups and users you want to add. You can enter
         a `#channel` to add all subscribers to the group. Click **Add**.
      1. Click **Create** to create the group.
    </FlattenedSteps>

    <ZulipNote>
      **Note**: You will only see the **Create user group** button if you have
      permission to create user groups.
    </ZulipNote>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _HowToInviteUsersToJoinImport.mdx]---
Location: zulip-main/starlight_help/src/content/include/_HowToInviteUsersToJoinImport.mdx

```text
import { Steps, TabItem } from "@astrojs/starlight/components";

<TabItem label="Imported organizations">
  <Steps>
    1. [Configure allowed authentication
       methods](/help/configure-authentication-methods). Zulip offers a
       variety of authentication methods, including email/password, Google,
       GitHub, GitLab, Apple, LDAP and [SAML](/help/saml-authentication).
       Users can immediately [log in][logging-in] with any allowed
       authentication method that does not require a password.
    1. Share a link to your Zulip organization, which is
       `https://your-org.zulipchat.com` on Zulip Cloud.
    1. *(optional)* To log in with an email/password, users will need to set their
       initial password. You can:
       * Automatically send password reset emails to all users in your
         organization. If you imported your organization into Zulip Cloud, simply
         email [support@zulip.com](mailto:support@zulip.com) to request this. Server
         administrators for self-hosted organizations should follow [these
         instructions](/help/import-from-slack#send-password-reset-emails-to-all-users).
       * Let users know that they can [request a password
         reset](/help/change-your-password#if-youve-forgotten-or-never-had-a-password)
         on your organization's login page.
  </Steps>
</TabItem>

[logging-in]: /help/logging-in
```

--------------------------------------------------------------------------------

---[FILE: _HowToInviteUsersToJoinNoImport.mdx]---
Location: zulip-main/starlight_help/src/content/include/_HowToInviteUsersToJoinNoImport.mdx

```text
import { Steps, TabItem } from "@astrojs/starlight/components";

<TabItem label="Require invitations">
  <Steps>
    1. [Configure allowed authentication
       methods](/help/configure-authentication-methods). Zulip offers a variety of
       authentication methods, including email/password, Google, GitHub, GitLab,
       Apple, LDAP and [SAML](/help/saml-authentication). Users can [log
       in][logging-in] with any allowed authentication method, regardless of how
       they signed up.
    1. Invite users by [sending email invitations][email-invitations] or
       sharing a [reusable invitation link][invitation-links].
  </Steps>
</TabItem>

<TabItem label="Allow anyone to join">
  <Steps>
    1. Allow users to [join without an invitation][set-if-invitations-required].
    1. Configure the appropriate [email domain restrictions][restrict-email-domain]
       for your organization.
    1. Share a link to your registration page, which is
       [https://your-org.zulipchat.com](https://your-org.zulipchat.com) for Zulip Cloud organizations.
  </Steps>
</TabItem>

[email-invitations]: /help/invite-new-users#send-email-invitations

[invitation-links]: /help/invite-new-users#create-a-reusable-invitation-link

[set-if-invitations-required]: /help/restrict-account-creation#set-whether-invitations-are-required-to-join

[restrict-email-domain]: /help/restrict-account-creation#configuring-email-domain-restrictions

[logging-in]: /help/logging-in
```

--------------------------------------------------------------------------------

---[FILE: _HowToReplyIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_HowToReplyIntro.mdx

```text
Many chat apps have prominent “reply” or “reply in thread” buttons. These
buttons are necessary, because it's often hard to figure out what conversation
messages belong to if you don't use them.

When you [start composing](/help/replying-to-messages) a message in Zulip, it
will automatically be addressed to the conversation thread you're reading
(unless you are [starting a new
thread](/help/introduction-to-topics#how-to-start-a-new-topic)). Because
everything is organized into threads, it'll almost always be clear what you're
responding to. This means there is no need to repeat what has already been said
when you reply.

You can still [quote](/help/quote-or-forward-a-message#quote-a-message) part of
an older message for reference, or
[forward](/help/quote-or-forward-a-message#forward-a-message) a message to
another thread.
```

--------------------------------------------------------------------------------

---[FILE: _HowToStartANewTopic.mdx]---
Location: zulip-main/starlight_help/src/content/include/_HowToStartANewTopic.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ComposeAndSendMessage from "../include/_ComposeAndSendMessage.mdx";
import MobileChannels from "../include/_MobileChannels.mdx";
import StartTopicViaLeftSidebar from "../include/_StartTopicViaLeftSidebar.mdx";

import SendIcon from "~icons/zulip-icon/send";

<Tabs>
  <TabItem label="Via left sidebar">
    <FlattenedSteps>
      <StartTopicViaLeftSidebar />
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Via compose box">
    <FlattenedSteps>
      1. Click the **Start new conversation** button at the bottom of the app.
      1. *(optional)* You can change the destination channel for your message using
         the dropdown in the top left of the compose box. Start typing to filter
         channels.
      1. Enter a topic name. Think about finishing the sentence: “Hey, can we chat
         about… ?”

      <ComposeAndSendMessage />
    </FlattenedSteps>

    <KeyboardTip>
      You can also use the <kbd>C</kbd> keyboard shortcut to start a new topic in
      the channel you're viewing.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileChannels />

      1. Tap on the desired channel.
      1. Tap the compose box at the bottom of the app.
      1. Enter a topic name. Auto-complete will provide suggestions for previously
         used topics.
      1. Compose your message, and tap the **send**
         (<SendIcon />) button in the
         bottom right corner of the app.
    </FlattenedSteps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _ImportGetYourOrganizationStarted.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ImportGetYourOrganizationStarted.mdx

```text
import {Steps} from "@astrojs/starlight/components";

Once the import process is completed, you will need to:

<Steps>
  1. [Configure the settings for your organization](/help/customize-organization-settings),
     which are not exported. This includes settings like [email
     visibility](/help/configure-email-visibility), [message editing
     permissions](/help/restrict-message-editing-and-deletion),
     and [how users can join your organization](/help/restrict-account-creation).
  1. All users from your previous workspace will have accounts in your new Zulip
     organization. However, you will need to let users know about their new
     accounts, and [decide how they will log
     in](/help/import-from-slack#decide-how-users-will-log-in) for the first time.
  1. Share the URL for your new Zulip organization, and (recommended) the [Getting
     started with Zulip guide](/help/getting-started-with-zulip).
  1. Migrate any [integrations](/integrations/).
</Steps>
```

--------------------------------------------------------------------------------

---[FILE: _ImportHowUsersWillLogIn.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ImportHowUsersWillLogIn.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";

When user accounts are imported, users initially do not have passwords
configured. There are a few options for how users can log in for the first time.

<ZulipTip>
  For security reasons, passwords are never exported.
</ZulipTip>

### Allow users to log in with non-password authentication

When you create your organization, users will immediately be able to log in with
[authentication methods](/help/configure-authentication-methods) that do not
require a password. Zulip offers a variety of authentication methods, including
Google, GitHub, GitLab, Apple, LDAP and [SAML](/help/saml-authentication).

### Send password reset emails to all users

You can send password reset emails to all users in your organization, which
will allow them to set an initial password.

If you imported your organization into Zulip Cloud, simply email
[support@zulip.com](mailto:support@zulip.com) to request this.

<ZulipNote>
  To avoid confusion, first make sure that the users in your
  organization are aware that their account has been moved to
  Zulip, and are expecting to receive a password reset email.
</ZulipNote>

#### Send password reset emails (self-hosted organization)

<Tabs>
  <TabItem label="Default subdomain">
    <Steps>
      1. To test the process, start by sending yourself a password reset email by
         using the following command:
         ```bash "username@example.com"
         ./manage.py send_password_reset_email -u username@example.com
         ```
      1. When ready, send password reset emails to all users by
         using the following command:
         ```bash
         ./manage.py send_password_reset_email -r '' --all-users
         ```
    </Steps>
  </TabItem>

  <TabItem label="Custom subdomain">
    <Steps>
      1. To test the process, start by sending yourself a password reset email by
         using the following command:
         ```bash "username@example.com"
         ./manage.py send_password_reset_email -u username@example.com
         ```
      1. When ready, send password reset emails to all users by
         using the following command:
         ```bash "<subdomain>"
         ./manage.py send_password_reset_email -r <subdomain> --all-users
         ```
         If you would like to only send emails to users who have not logged in yet,
         you can use the following variant instead:
         ```bash "<subdomain>"
         ./manage.py send_password_reset_email -r <subdomain> --all-users --only-never-logged-in
         ```
    </Steps>
  </TabItem>
</Tabs>

### Manual password resets

Alternatively, users can reset their own passwords by following the instructions
on your Zulip organization's login page.
```

--------------------------------------------------------------------------------

---[FILE: _ImportIntoASelfHostedServerDescription.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ImportIntoASelfHostedServerDescription.mdx

```text
#### Import into a self-hosted Zulip server

Zulip's import tools are robust, and have been used to import workspaces
with 10,000 members and millions of messages. If you're planning on doing
an import much larger than that, or run into performance issues when
importing, [contact us](/help/contact-support) for help.
```

--------------------------------------------------------------------------------

---[FILE: _ImportIntoASelfHostedServerInstructions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ImportIntoASelfHostedServerInstructions.mdx

```text
1. Follow steps
   [1](https://zulip.readthedocs.io/en/stable/production/install.html#step-1-download-the-latest-release)
   and
   [2](https://zulip.readthedocs.io/en/stable/production/install.html#step-2-install-zulip)
   of the guide for [installing a new Zulip
   server](https://zulip.readthedocs.io/en/stable/production/install.html).
1. Copy the **exported data** file containing your workspace message
   history export onto your Zulip server, and put it in `/tmp/`.
1. Log in to a shell on your Zulip server as the `zulip` user.
```

--------------------------------------------------------------------------------

---[FILE: _ImportIntoAZulipCloudOrganization.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ImportIntoAZulipCloudOrganization.mdx

```text
import {Steps} from "@astrojs/starlight/components";

import SendUsInfo from "../include/_SendUsInfo.mdx";

#### Import into a Zulip Cloud organization

<SendUsInfo />

<Steps>
  1. The subdomain you would like to use for your organization. Your Zulip chat will
     be hosted at `<subdomain>.zulipchat.com`.
  1. The **exported data** file containing your workspace message history export.
</Steps>
```

--------------------------------------------------------------------------------

---[FILE: _ImportSelfHostedServerTips.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ImportSelfHostedServerTips.mdx

```text
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";

<ZulipNote>
  The import could take several minutes to run,
  depending on how much data you're importing.
</ZulipNote>

<ZulipTip>
  The server stop/restart commands are only
  necessary when importing on a server with minimal
  RAM, where an OOM kill might otherwise occur.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _ImportWorkspaceToZulip.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ImportWorkspaceToZulip.mdx

```text
You can import your current workspace into a Zulip organization. It's a great way
to preserve your workspace history when you migrate to Zulip, and to
make the transition easy for the members of your organization.

The import will include your organization's:

* **Name** and **Logo**
* **Message history**, including attachments and emoji reactions
* **Users**, including names, emails, roles, avatars, time zones, and custom profile fields
* **Channels**, including all user subscriptions
* **Custom emoji**
```

--------------------------------------------------------------------------------

---[FILE: _ImportYourDataIntoZulip.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ImportYourDataIntoZulip.mdx

```text
import ZulipNote from "../../components/ZulipNote.astro";

To start using Zulip, you will need to choose between Zulip Cloud and
self-hosting Zulip. For a simple managed solution, with no setup or
maintenance overhead, you can [sign up](https://zulip.com/new/) for
[Zulip Cloud](https://zulip.com/zulip-cloud) with just a few clicks.
Alternatively, you can [self-host](https://zulip.com/self-hosting/)
your Zulip organization. See [here](/help/zulip-cloud-or-self-hosting)
to learn more.

<ZulipNote>
  **You can only import a workspace as a new Zulip organization.** Your imported
  message history cannot be added into an existing Zulip organization.
</ZulipNote>
```

--------------------------------------------------------------------------------

---[FILE: _ImportZulipCloudOrganizationWarning.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ImportZulipCloudOrganizationWarning.mdx

```text
import ZulipNote from "../../components/ZulipNote.astro";

<ZulipNote>
  If the organization already exists, the import process will overwrite all
  data that's already there. If needed, we're happy to preserve your
  data by moving an organization you've already created to a new
  subdomain prior to running the import process.
</ZulipNote>
```

--------------------------------------------------------------------------------

---[FILE: _InboxInstructions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_InboxInstructions.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import GoToInbox from "../include/_GoToInbox.mdx";

import ArrowDownIcon from "~icons/zulip-icon/arrow-down";
import InboxIcon from "~icons/zulip-icon/inbox";

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToInbox />

      1. Click on a conversation you're interested in to view it. You can return to
         your **inbox** when done (e.g., by using the **back** button in your browser
         or desktop app) to select the next conversation.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    <Steps>
      1. Tap the **Inbox** (<InboxIcon />)
         tab in the bottom left corner of the app.
      1. Tap on a conversation you're interested in to view it. You can return to
         your **inbox**  when done (e.g., by using the **back** button) to select
         the next conversation.
    </Steps>
  </TabItem>
</Tabs>

<ZulipTip>
  You can collapse or expand the list of topics in a channel by clicking the
  **collapse**
  (<ArrowDownIcon />)
  or **expand**
  (<ArrowDownIcon />)
  icon to the left of a channel name.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _InboxIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_InboxIntro.mdx

```text
**Inbox** provides an overview of your conversations with unread messages.
Conversations are shown in the same order as in the left sidebar in the web app,
and you can collapse any channels you are not currently interested in.
```

--------------------------------------------------------------------------------

---[FILE: _InternationalWireTransfers.mdx]---
Location: zulip-main/starlight_help/src/content/include/_InternationalWireTransfers.mdx

```text
If you choose to pay via a bank transfer from a bank outside of the United
States, your payment will likely incur a transfer charge. When asked which side
will pay the transfer charge, please be sure to **select “OUR”** from the menu
of options. Otherwise, third party banking fees will be deducted from the amount
you transfer, and the resulting total will be insufficient to pay the full
amount of your invoice.
```

--------------------------------------------------------------------------------

---[FILE: _InviteUsers.mdx]---
Location: zulip-main/starlight_help/src/content/include/_InviteUsers.mdx

```text
import GearIcon from "~icons/zulip-icon/gear";
import UserPlusIcon from "~icons/zulip-icon/user-plus";

1. Click on the **gear** (<GearIcon />) icon in the upper
   right corner of the web or desktop app.
1. Select <UserPlusIcon /> **Invite users**.
```

--------------------------------------------------------------------------------

---[FILE: _LatexExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_LatexExamples.mdx

```text
### What you type

 ````
Inline: $$O(n^2)$$

Displayed:
``` math
\int_a^b f(t)\, dt = F(b) - F(a)
```
 ````

### What it looks like

![Markdown LaTeX](../../images/markdown-latex.png)
```

--------------------------------------------------------------------------------

---[FILE: _LatexIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_LatexIntro.mdx

```text
Zulip supports math typesetting powered by [KaTeX](https://katex.org).
Their [support table](https://katex.org/docs/support_table.html) is a
helpful resource for checking what's supported or how to express
something.
```

--------------------------------------------------------------------------------

---[FILE: _LeftSidebarConversations.mdx]---
Location: zulip-main/starlight_help/src/content/include/_LeftSidebarConversations.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import ZulipTip from "../../components/ZulipTip.astro";

In the web app, the left sidebar provides quick access to your direct messages,
and the channels you are subscribed to.

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click on **direct messages** or the name of a channel in the left sidebar. You
         will see a list of the most recent unread conversations that you have not [muted](/help/mute-a-topic).
      1. Click on the conversation you are interested in.
    </Steps>

    <ZulipTip>
      To see all conversations, click on **more conversations** (in direct messages) or **show all topics**
      (in a channel).
    </ZulipTip>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _LinksExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_LinksExamples.mdx

```text
### What you type

```
Named link: [Zulip homepage](zulip.com)
A URL (links automatically): zulip.com
Channel link: #**channel name**
Topic link: #**channel name>topic name**
Message link: #**channel name>topic name@123**
Custom linkifier: For example, #2468 can automatically link to an issue in your tracker.
```

### What it looks like

![Markdown links](../../images/markdown-links.png)
```

--------------------------------------------------------------------------------

---[FILE: _LinksIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_LinksIntro.mdx

```text
In Zulip, you can insert a named link using Markdown formatting. In addition, Zulip
automatically creates links for you when you enter:

* A URL
* A reference to a channel, topic, or specific message (see also [Link to a
  message or conversation](/help/link-to-a-message-or-conversation))
* Text that matches a [custom linkifier](/help/add-a-custom-linkifier) set up by your organization
```

--------------------------------------------------------------------------------

---[FILE: _ManageBillingIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ManageBillingIntro.mdx

```text
On the billing page for an active paid plan you can:

* View your past invoices.
* View and update the billing details displayed on invoices and receipts
  for future payments.
* If you pay for your plan by credit card, update your card's payment
  details.
* Change your billing frequency to be monthly or annual.
* If you opted for [manual license
  management](#how-does-manual-license-management-work), you can [update
  the number of licenses](#manually-update-number-of-licenses)
  for the current billing period or the next billing period.
```

--------------------------------------------------------------------------------

---[FILE: _ManageConfiguredTopicsDesktopWeb.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ManageConfiguredTopicsDesktopWeb.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

<FlattenedSteps>
  <NavigationSteps target="settings/topics" />

  1. Configure notifications for each topic by selecting the desired option from
     the dropdown in the **Status** column.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: _ManageConfiguredTopicsMobile.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ManageConfiguredTopicsMobile.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import MobileChannels from "../include/_MobileChannels.mdx";
import TopicLongPressMenu from "../include/_TopicLongPressMenu.mdx";

import TopicListIcon from "~icons/zulip-icon/topic-list";

<FlattenedSteps>
  <MobileChannels />

  1. Select a channel containing topics you want to configure.
  1. Tap **topics** (<TopicListIcon />)
     in the upper right corner of the app.

  <TopicLongPressMenu />

  1. Tap **Mute topic**, **Unmute topic**, or **Follow topic**.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: _ManageThisUser.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ManageThisUser.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import UserCardThreeDotMenu from "../include/_UserCardThreeDotMenu.mdx";

<FlattenedSteps>
  <UserCardThreeDotMenu />

  1. Click **Manage this user**.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: _ManageThisUserViaUserProfile.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ManageThisUserViaUserProfile.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import RightSidebarViewProfile from "../include/_RightSidebarViewProfile.mdx";

import EditIcon from "~icons/zulip-icon/edit";

<FlattenedSteps>
  <RightSidebarViewProfile />

  1. Select the **Manage user** tab, or click the **pencil and paper**
     (<EditIcon />) icon next to the user's name.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: _ManageUserTabTip.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ManageUserTabTip.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

import EditIcon from "~icons/zulip-icon/edit";

<ZulipTip>
  You can also access the **Manage user** tab by clicking the **pencil and
  paper** (<EditIcon />) icon at the top of the [user
  profile](/help/view-someones-profile).
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _ManualAddLicenseInstructions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ManualAddLicenseInstructions.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

1. Modify **Number of licenses for current billing period** or **Number of
   licenses for next billing period**, and click **Update**.

<ZulipTip>
  Modifying the number of licenses for the current billing period also
  automatically updates the number of licenses for the next
  billing period.
</ZulipTip>
```

--------------------------------------------------------------------------------

---[FILE: _MeActionMessagesExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MeActionMessagesExamples.mdx

```text
For example, if you are **Ada Starr**:

### What you type

```
/me is away
```

### What it looks like

![Markdown status](../../images/markdown-status.png)
```

--------------------------------------------------------------------------------

---[FILE: _MeActionMessagesIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MeActionMessagesIntro.mdx

```text
You can send messages that display your profile picture and name as the
beginning of the message content by beginning a message with `/me`. You can
use this feature in conversations when you want to describe actions you've
taken or things that are happening around you using a third-person voice.
```

--------------------------------------------------------------------------------

---[FILE: _MentionsExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MentionsExamples.mdx

```text
import ZulipTip from "../../components/ZulipTip.astro";

### What you type

```
Users: @**Bo Lin** or @**Ariella Drake|26** (two `*`)
User group: @*support team* (one `*`)
Silent mention: @_**Bo Lin** or @_**Ariella Drake|26** (`@_` instead of `@`)
Wildcard mentions: @**all**, @**everyone**, @**channel**, @**topic** (two `*`)
```

<ZulipTip>
  A `|` followed by a user ID is inserted automatically when you select a
  user from the typeahead suggestions, if there are two users with the same
  name in the organization.
</ZulipTip>

### What it looks like

![Markdown mentions](../../images/markdown-mentions.png)
```

--------------------------------------------------------------------------------

---[FILE: _MentionsIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MentionsIntro.mdx

```text
You can mention a team member or [user group](/help/user-groups) to call their
attention to a message. Mentions follow the same [notification
settings](/help/dm-mention-alert-notifications) as direct messages and alert
words. A [silent mention](/help/mention-a-user-or-group#silently-mention-a-user)
allows you to refer to a user without triggering a notification. A wildcard
mention allows you to
[mention everyone on a channel](/help/mention-a-user-or-group#mention-everyone-on-a-channel),
or [mention all topic participants](/help/mention-a-user-or-group#mention-all-topic-participants).
```

--------------------------------------------------------------------------------

---[FILE: _MessageActions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MessageActions.mdx

```text
1. Hover over a message to reveal three icons on the right.
```

--------------------------------------------------------------------------------

---[FILE: _MessageActionsMenu.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MessageActionsMenu.mdx

```text
import MoreVerticalSpreadIcon from "~icons/zulip-icon/more-vertical-spread";

1. Hover over a message to reveal three icons on the right.
1. Click on the **ellipsis** (<MoreVerticalSpreadIcon />).
```

--------------------------------------------------------------------------------

---[FILE: _MessageEditHistoryIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MessageEditHistoryIntro.mdx

```text
In Zulip, users who have the appropriate permissions can
[edit](/help/edit-a-message) the content of a message they sent, or move
messages to a different [channel](/help/move-content-to-another-channel)
or [topic](/help/move-content-to-another-topic).

Modified messages are tagged as **edited** or **moved**, with the **edited**
indicator taking priority. You can view the history of how a message was
edited and moved, if this is allowed in your organization.
```

--------------------------------------------------------------------------------

---[FILE: _MessageLongPressMenu.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MessageLongPressMenu.mdx

```text
1. Press and hold a message until the long-press menu appears.
```

--------------------------------------------------------------------------------

---[FILE: _MessagingTips.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MessagingTips.mdx

```text
* Learn all about [message formatting](/help/format-your-message-using-markdown).
* Use [emoji reactions](/help/emoji-reactions) for lightweight interactions.
* Embed [code blocks](/help/code-blocks) with syntax highlighting for over 250
  languages, and integrated [code playgrounds](/help/code-blocks#code-playgrounds).
* [Type LaTeX](/help/format-your-message-using-markdown#latex) directly into
  your Zulip message, and see it beautifully rendered.
* [Start a video call](/help/start-a-call) with the click of a button.
* Make plans for later without worrying about time zones using
  [global times](/help/format-your-message-using-markdown#global-times).
* Share files or images with [drag-and-drop uploads](/help/share-and-upload-files).
* Enjoy animated GIFs with Zulip's native
  [GIPHY integration](/help/animated-gifs).
* [Preview your message](/help/preview-your-message-before-sending) to make sure
  it looks just how you want it.
```

--------------------------------------------------------------------------------

---[FILE: _MobileChannels.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MobileChannels.mdx

```text
import HashIcon from "~icons/zulip-icon/hash";

1. Tap the **Channels** (<HashIcon />)
   tab at the bottom of the app.
```

--------------------------------------------------------------------------------

---[FILE: _MobileDirectMessages.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MobileDirectMessages.mdx

```text
import UserIcon from "~icons/zulip-icon/user";

1. Tap the **Direct messages**
   (<UserIcon />) tab at the
   bottom of the app.
```

--------------------------------------------------------------------------------

---[FILE: _MobileMenu.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MobileMenu.mdx

```text
import MobileMenuIcon from "~icons/zulip-icon/mobile-menu";

1. Tap the **Menu** (<MobileMenuIcon />)
   tab in the bottom right corner of the app.
```

--------------------------------------------------------------------------------

---[FILE: _MobileSettings.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MobileSettings.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import MobileMenu from "../include/_MobileMenu.mdx";

import GearIcon from "~icons/zulip-icon/gear";

<FlattenedSteps>
  <MobileMenu />

  1. Tap <GearIcon /> **Settings**.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: _MobileSwitchAccount.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MobileSwitchAccount.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import MobileMenu from "../include/_MobileMenu.mdx";

import MobileArrowLeftRightIcon from "~icons/zulip-icon/mobile-arrow-left-right";

<FlattenedSteps>
  <MobileMenu />

  1. Tap <MobileArrowLeftRightIcon />
     **Switch account**.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: _ModifyLinkText.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ModifyLinkText.mdx

```text
1. *(optional)* Modify the link text as desired. Link text will default to the
   name of the uploaded file.
```

--------------------------------------------------------------------------------

---[FILE: _MoveChannelToFolder.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MoveChannelToFolder.mdx

```text
import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewGeneral from "../include/_SelectChannelViewGeneral.mdx";

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewGeneral />

      1. *(optional)* [Create a new channel folder](/help/manage-channel-folders#create-a-new-channel-folder).
      1. Under **Settings**, select the desired folder from the **Channel folder**
         dropdown.

      <SaveChanges />
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _MovingToZulipIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MovingToZulipIntro.mdx

```text
Welcome to Zulip! This page will guide you through the process of transitioning
your organization to Zulip. It assumes that you have [completed your initial
evaluation](/help/trying-out-zulip) of Zulip, decided [whether to use Zulip
Cloud or self-host](/help/zulip-cloud-or-self-hosting), and are ready to
introduce Zulip to your organization.
```

--------------------------------------------------------------------------------

---[FILE: _MuteUnmuteIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_MuteUnmuteIntro.mdx

```text
import ZulipNote from "../../components/ZulipNote.astro";

Zulip lets you mute topics and channels to avoid receiving notifications for messages
you are not interested in. Muting a channel effectively mutes all topics in
that channel. You can also manually **mute** a topic in an unmuted channel, or
**unmute** a topic in a muted channel.

Muting has the following effects:

* Messages in muted topics do not generate notifications (including [alert
  word](/help/dm-mention-alert-notifications#alert-words) notifications), unless
  you are [mentioned](/help/mention-a-user-or-group).
* Messages in muted topics do not appear in the [**Combined
  feed**](/help/combined-feed) view or the mobile **Inbox** view.
* Muted topics appear in the [**Recent conversations**](/help/recent-conversations)
  view only if the **Include muted** filter is enabled.
* Unread messages in muted topics do not contribute to channel unread counts.
* Muted topics and channels are grayed out in the left sidebar of the desktop/web
  app, and in the mobile app.
* In the desktop/web app, muted topics are sorted to the bottom of their
  channel, and muted channels appear in a collapsible section at the bottom of
  their channel folder in the left sidebar.

You can search muted messages using the `is:muted` [search
filter](/help/search-for-messages#search-by-message-status), or exclude them
from search results with `-is:muted`.

<ZulipNote>
  **Note**: Some parts of the Zulip experience may start to degrade
  if you receive more than a few hundred muted messages a day.
</ZulipNote>
```

--------------------------------------------------------------------------------

---[FILE: _NotHumanExportFormat.mdx]---
Location: zulip-main/starlight_help/src/content/include/_NotHumanExportFormat.mdx

```text
import ZulipNote from "../../components/ZulipNote.astro";

<ZulipNote>
  This export is formatted for importing into Zulip Cloud or a self-hosted
  installation of Zulip. It is not designed to be human-readable.
</ZulipNote>
```

--------------------------------------------------------------------------------

---[FILE: _NumberedListsExamples.mdx]---
Location: zulip-main/starlight_help/src/content/include/_NumberedListsExamples.mdx

```text
import {Steps} from "@astrojs/starlight/components";

### What you type

```
1. numbered lists
1. increment automatically
   1. use nested lists if you like
   3. delete or reorder lines without fixing the numbering
1. one more
   17. lists can start at any number
   18. so you can continue a list after some other text
```

### What it looks like

![Markdown numbered lists](../../images/markdown-numbered-lists.png)
```

--------------------------------------------------------------------------------

---[FILE: _NumberedListsIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_NumberedListsIntro.mdx

```text
Zulip supports Markdown formatting for numbered lists.
You can create numbered lists by putting a number followed by a `.` at the start
of each line. Lists are numbered automatically, so you can reorder list items
while editing your message without having to update the numbers. Add two spaces
before the number to create a nested list.
```

--------------------------------------------------------------------------------

````
