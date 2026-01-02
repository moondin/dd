---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 464
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 464 of 1290)

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

---[FILE: import-from-microsoft-teams.mdx]---
Location: zulip-main/starlight_help/src/content/docs/import-from-microsoft-teams.mdx

```text
---
title: Import from Microsoft Teams
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ImportHowUsersWillLogIn from "../include/_ImportHowUsersWillLogIn.mdx";
import ImportIntoASelfHostedServerDescription from "../include/_ImportIntoASelfHostedServerDescription.mdx";
import ImportIntoASelfHostedServerInstructions from "../include/_ImportIntoASelfHostedServerInstructions.mdx";
import ImportIntoAZulipCloudOrganization from "../include/_ImportIntoAZulipCloudOrganization.mdx";
import ImportSelfHostedServerTips from "../include/_ImportSelfHostedServerTips.mdx";
import ImportYourDataIntoZulip from "../include/_ImportYourDataIntoZulip.mdx";
import ImportZulipCloudOrganizationWarning from "../include/_ImportZulipCloudOrganizationWarning.mdx";

You can import your current workspace into a Zulip organization. It's a great way
to preserve your workspace history when you migrate to Zulip, and to
make the transition easy for the members of your organization.

The import will include your organization's:

* **Name**
* **Users**, including names, emails, roles
* **Teams** as Zulip channels, including all user subscriptions

## Import process overview

To import your Microsoft Teams data into Zulip, you will need to take the following
steps, which are described in more detail below:

<Steps>
  1. [Export your Microsoft Teams data](#export-your-microsoft-teams-data).
  1. [Authorize a Microsoft Graph API token](#authorize-a-microsoft-graph-api-token).
  1. [Import your Microsoft Teams data into Zulip](#import-your-data-into-zulip).
  1. [Clean up after the Microsoft Teams export](#clean-up-after-the-microsoft-teams-export).
  1. [Get your organization started with Zulip](#get-your-organization-started-with-zulip)!
</Steps>

When planning to migrate from Microsoft Teams to Zulip, make sure your Microsoft tenant
is active and still has access to Microsoft services for at least a couple of months.
The process to gain access to the Teams data export tool can take around a month, and
Zulip's import tool for Microsoft Teams requires an active Microsoft Entra ID application.
Additionally, since the imported users' email addresses will be their Microsoft tenant
emails, they will still need access to those accounts to [update their Zulip email
addresses](/help/change-your-email-address).

## Import your organization from Microsoft Teams into Zulip

### Export your Microsoft Teams data

The [Teams data export
tool](https://learn.microsoft.com/en-us/microsoftteams/migration-from-teams#steps-to-access-the-teams-data-export-tool) supports
the export of data for tenants of up to 500 users. If your organization has more than
500 users, you can try the [Teams export
APIs](https://learn.microsoft.com/en-us/microsoftteams/migration-from-teams#steps-to-access-the-teams-export-apis).

#### Export message history using Teams data export tool

<Steps>
  1. Make sure that you are an admin of your Microsoft organization. If you are one,
     go to this [link](https://aka.ms/AccessTeamsDataExportTool) and contact support
     through the Teams admin center.
  1. File a ticket using the predefined title. In the description, provide an
     estimate of the size of your tenant and confirmation that you are accessing
     the tool for the purpose of switching from Teams.
  1. Once your request is approved, go to the [Microsoft Teams admin
     center](https://admin.teams.microsoft.com/) as the **global administrator**.
  1. In the **dashboard**, find the user interface for the **Teams data export**.
  1. Select the date range and export your data. You should be able to download a
     `zip` file with your data a few minutes after you start the export process.
</Steps>

### Authorize a Microsoft Graph API token

Some organization data are not exported by the Teams data export tool. The Zulip import
tool will call several Microsoft Graph APIs to collect the following data:

* **User roles**. The [import details](#import-details) section details how  Microsoft
  Teams users roles and user types are mapped to Zulip user roles.

To access those APIs, the following instructions will guide you through creating a Microsoft Entra ID application
with the required permissions and [authorizing an access
token](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow):

<Steps>
  1. Log in to the [Microsoft Entra ID](https://entra.microsoft.com/) portal as
     the **global administrator**.
  1. Navigate to the sidebar → **Entra ID** → **App registrations** and click **New
     registration**.
  1. In the **Register an application** menu, enter the application's name, it can be
     anything.
  1. In the **Supported accounts types** section, select **Accounts in this organizational
     directory only**.
  1. In the **Redirect URI** section, select **Web** as the platform type and enter
     `"https://chat.zulip.org/"`.
  1. In the app's menu, navigate to the **API permissions** menu.
  1. Click **Add a permission** and select **Microsoft Graph**.
  1. Select the **Application permissions** as the permission type.
  1. Search and add these permissions:

     * `User.Read.All`
     * `RoleManagement.Read.Directory`

     See the [required token permissions](#required-token-permissions) section for more
     details about these tokens and the endpoints that the import tool calls.
  1. Click the **Grant admin consent for *org\_name*** button in the **API
     permissions** menu to grant admin consent to all scopes.
  1. Take note of the application's `redirect_uri`, `tenant_id`, `client_id`, and
     `client_secret`.
  1. To gain administrator permission, make the following HTTP request using
     the details from your Microsoft Entra ID application:
     ```bash "<client_id>" "<tenant_id>" "<redirect_uri>"
     https://login.microsoftonline.com/<tenant_id>/adminconsent?
     client_id=<client_id>
     &redirect_uri=<redirect_uri>
     ```
  1. You will be redirected to the Microsoft sign in page. Log in using a
     **global administrator** account and approve all the application permissions
     that you have requested. If successful, you will be redirected to your
     application's `redirect_uri` with the following parameters:
     ```bash "<redirect_uri>" "<tenant_id>"
     GET <redirect_uri>?tenant=<tenant_id>&admin_consent=True
     ```
  1. To get the access token, make the following request:
     ```bash "<redirect_uri>" "<tenant_id>" "<client_id>" "<client_secret>"
     curl --location --request POST 'https://login.microsoftonline.com/<tenant_id>/oauth2/v2.0/token' \
       --header 'Content-Type: application/x-www-form-urlencoded' \
       --data-urlencode 'client_id=<client_id>' \
       --data-urlencode 'scope=https://graph.microsoft.com/.default' \
       --data-urlencode 'client_secret=<client_secret>' \
       --data-urlencode 'grant_type=client_credentials'
     ```
     A successful response looks like this:
     ```bash
       {
         "token_type": "Bearer",
         "expires_in": 3599,
         "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBP..."
       }
     ```
  1. Take note of the `access_token`.
</Steps>

<ZulipNote>
  If the token expires and you need a new one, you can just repeat step 14.
</ZulipNote>

#### Required token permissions

The following Microsoft Graph API endpoints are used by the Zulip import
tool:

| Endpoint                                                                                                                            | Uses                                                   | Least-privileged permission     |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------- |
| [directory role list member](https://learn.microsoft.com/en-us/graph/api/directoryrole-list-members?view=graph-rest-1.0\&tabs=http) | Used to find users who are global administrators.      | `User.Read.All`                 |
| [list directory role](https://learn.microsoft.com/en-us/graph/api/directoryrole-list?view=graph-rest-1.0\&tabs=http)                | Used to find the ID for the global administrator role. | `RoleManagement.Read.Directory` |
| [list user](https://learn.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0\&tabs=http)                                   | Used to find guest accounts.                           | `User.Read.All`                 |

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
         (`EXTERNAL_HOST`) of the Zulip installation, run the following
         commands, replacing `<token>` with your Microsoft Graph API access token.
         <ImportSelfHostedServerTips />
         ```bash "<token>"
         cd /home/zulip/deployments/current
         ./scripts/stop-server
         ./manage.py convert_microsoft_teams_data /tmp/TeamsData/ --token <token> --output /tmp/converted_microsoft_teams_data
         ./manage.py import '' /tmp/converted_microsoft_teams_data
         ./scripts/start-server
         ```
         Alternatively, to import into a custom subdomain, run:
         ```bash "<token>" "<subdomain>"
         cd /home/zulip/deployments/current
         ./scripts/stop-server
         ./manage.py convert_microsoft_teams_data /tmp/TeamsData/ --token <token> --output /tmp/converted_microsoft_teams_data
         ./manage.py import <subdomain> /tmp/converted_microsoft_teams_data
         ./scripts/start-server
         ```
      1. Follow [step 4](https://zulip.readthedocs.io/en/stable/production/install.html#step-4-configure-and-use)
         of the guide for [installing a new Zulip
         server](https://zulip.readthedocs.io/en/stable/production/install.html).
    </FlattenedSteps>
  </TabItem>
</Tabs>

#### Import details

Whether you are using Zulip Cloud or self-hosting Zulip, here are few notes to keep
in mind about the import process:

* Custom emojis are not imported.
* Meeting chats and recordings are not imported.
* Message attachments are not imported.
* Message history are not imported.
* Message reactions are not imported.
* Microsoft tenant's user roles are mapped to Zulip's [user
  roles](/help/user-roles) in the following way:
  | Microsoft Teams role | Zulip role |
  | -------------------- | ---------- |
  | Global Administrator | Owner      |
  | Member               | Member     |
  | Guest                | Guest      |
* The Teams export tool does not export organization settings, so you will need to
  [configure the settings for your Zulip
  organization](/help/customize-organization-settings).
  This includes settings like [email visibility](/help/configure-email-visibility),
  [message editing permissions](/help/restrict-message-editing-and-deletion),
  and [how users can join your organization](/help/restrict-account-creation).
* The Teams export tool does not export the full user settings, so users in your
  organization may want to [customize their account
  settings](/help/getting-started-with-zulip).
* User avatars are not imported.

## Clean up after the Microsoft Teams export

Once your organization has been successfully imported in to Zulip, you should
delete [the Microsoft Entra ID
application](https://entra.microsoft.com/#view/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/~/AppAppsPreview) that you created in order to
export your Microsoft Teams data.

## Get your organization started with Zulip

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
     in](/help/import-from-microsoft-teams#decide-how-users-will-log-in) for the first time.
  1. Share the URL for your new Zulip organization, and (recommended) the [Getting
     started with Zulip guide](/help/getting-started-with-zulip).
  1. **Important**, make sure all users [change their Zulip
     email addresses](/help/change-your-email-address) from their Microsoft tenant
     emails to ones they can continue to access before your organization's Microsoft
     subscription expires.
  1. Migrate any [integrations](/integrations/).
</Steps>

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
* [Change your email address](/help/change-your-email-address)
```

--------------------------------------------------------------------------------

---[FILE: import-from-rocketchat.mdx]---
Location: zulip-main/starlight_help/src/content/docs/import-from-rocketchat.mdx

```text
---
title: Import from Rocket.Chat
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ImportGetYourOrganizationStarted from "../include/_ImportGetYourOrganizationStarted.mdx";
import ImportHowUsersWillLogIn from "../include/_ImportHowUsersWillLogIn.mdx";
import ImportIntoASelfHostedServerDescription from "../include/_ImportIntoASelfHostedServerDescription.mdx";
import ImportIntoASelfHostedServerInstructions from "../include/_ImportIntoASelfHostedServerInstructions.mdx";
import ImportIntoAZulipCloudOrganization from "../include/_ImportIntoAZulipCloudOrganization.mdx";
import ImportSelfHostedServerTips from "../include/_ImportSelfHostedServerTips.mdx";
import ImportYourDataIntoZulip from "../include/_ImportYourDataIntoZulip.mdx";
import ImportZulipCloudOrganizationWarning from "../include/_ImportZulipCloudOrganizationWarning.mdx";

You can import your current workspace into a Zulip organization. It's a great
way to preserve your workspace history when you migrate to Zulip, and to make
the transition easy for the members of your organization.

The import will include your organization's:

* **Name**
* **Message history**, including attachments and emoji reactions
* **Users**, including names, emails, roles, and teams
* **Channels**, including discussions and all user subscriptions
* **Custom emoji**

## Import process overview

To import your Rocket.Chat organization into Zulip, you will need to take the
following steps, which are described in more detail below:

<Steps>
  1. [Export your Rocket.Chat data](#export-your-rocketchat-data).
  1. [Import your Rocket.Chat data into Zulip](#import-your-data-into-zulip).
  1. [Get your organization started with Zulip](#get-your-organization-started-with-zulip)!
</Steps>

## Import your organization from Rocket.Chat into Zulip

### Export your Rocket.Chat data

Rocket.Chat does not provide an official data export feature, so the Zulip
import tool works by importing data from a Rocket.Chat database dump.

If you're self-hosting your Rocket.Chat instance, you can create a
database dump using the `mongodump` utility. Make sure your Rocket.Chat
server is **NOT** shut down while creating database dump using `mongodump`.

If your organization is hosted on Rocket.Chat Cloud or another hosting
provider that doesn't provide you with database access, you will need
to request a database dump by contacting their
[support](https://docs.rocket.chat/resources/frequently-asked-questions/cloud-faqs#data-export).

In either case, you should end up with a directory containing many
`.bson` files.

### Import your data into Zulip

<ImportYourDataIntoZulip />

At this point, you should go to the directory containing all the `.bson` files
from your database dump and rename it to `rocketchat_data`. This directory will
be your **exported data** file in the instructions below.

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
         (`EXTERNAL_HOST`) of the Zulip installation, run the following
         commands.
         <ImportSelfHostedServerTips />
         ```bash
         cd /home/zulip/deployments/current
         ./scripts/stop-server
         ./manage.py convert_rocketchat_data /tmp/rocketchat_data --output /tmp/converted_rocketchat_data
         ./manage.py import '' /tmp/converted_rocketchat_data
         ./scripts/start-server
         ```
         Alternatively, to import into a custom subdomain, run:
         ```bash "<subdomain>"
         cd /home/zulip/deployments/current
         ./scripts/stop-server
         ./manage.py convert_rocketchat_data /tmp/rocketchat_data --output /tmp/converted_rocketchat_data
         ./manage.py import <subdomain> /tmp/converted_rocketchat_data
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

* Rocket.Chat does not export workspace settings, so you will need to [configure
  the settings for your Zulip organization](/help/customize-organization-settings).
  This includes settings like [email
  visibility](/help/configure-email-visibility),
  [message editing permissions](/help/restrict-message-editing-and-deletion),
  and [how users can join your organization](/help/restrict-account-creation).
* Rocket.Chat does not export user settings, so users in your organization may
  want to [customize their account settings](/help/getting-started-with-zulip).
* Rocket.Chat user roles are mapped to Zulip's [user
  roles](/help/user-roles) in the following way:
  | Rocket.Chat role | Zulip role |
  | ---------------- | ---------- |
  | Admin            | Owner      |
  | User             | Member     |
  | Guest            | Guest      |
* User avatars are not imported.
* Default channels for new users are not imported.
* Starred messages are not imported.
* Messages longer than Zulip's limit of 10,000 characters are not
  imported.
* Livechat channels/messages are not imported.
* Messages from Rocket.Chat Discussions are imported as topics
  inside the Zulip channel corresponding to the parent channel of the
  Rocket.Chat Discussion.
* Messages from Rocket.Chat Discussions having direct channels
  (i.e. direct messages) as their parent are imported as normal
  direct messages in Zulip.
* While Rocket.Chat Threads are in general imported as separate
  topics, Rocket.Chat Threads within Rocket.Chat Discussions are
  imported as normal messages within the topic containing that
  Discussion, and Threads in Direct Messages are imported as normal
  Zulip direct messages.

Additionally, because Rocket.Chat does not provide a documented or
stable data export API, the import tool may require small changes from
time to time to account for changes in the Rocket.Chat database
format.  Please [contact us](/help/contact-support) if you encounter
any problems using this tool.

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

---[FILE: import-from-slack.mdx]---
Location: zulip-main/starlight_help/src/content/docs/import-from-slack.mdx

```text
---
title: Import from Slack
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
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

To import your Slack organization into Zulip, you will need to take the
following steps, which are described in more detail below:

<Steps>
  1. [Export your Slack data](#export-your-slack-data).
  1. [Import your Slack data into Zulip](#import-your-data-into-zulip).
  1. [Clean up](#clean-up-after-the-slack-export) after the Slack export.
  1. [Decide how users will log in](#decide-how-users-will-log-in)!
</Steps>

Be sure to check out the [guide on moving from Slack](/help/moving-from-slack) for
a walkthrough of the transition process.

## Import your organization from Slack into Zulip

{/* Update link in slack_import.html when changing title below. */}

### Export your Slack data

Slack's [data export
service](https://slack.com/services/export) allows you to
export all public channel messages, **including older messages that may no
longer be searchable** under your Slack plan.

Unfortunately, Slack [only
allows](https://slack.com/help/articles/201658943-Export-your-workspace-data)
workspaces that are on the **Business+** or **Enterprise Grid** plans
to export private channels and direct messages. Slack's support has
confirmed this policy as of August 2022.

Owners of **Business+** or **Enterprise Grid** workspaces can [request
special
access](https://slack.com/help/articles/204897248-Guide-to-Slack-import-and-export-tools#options-by-plan)
in order to export direct message data.

#### Export message history

<Steps>
  1. Make sure that you are an owner or admin of your Slack
     workspace. If you are one, the Slack web application will display
     that in your profile, in a banner covering the bottom of your
     avatar.
  1. [Export your Slack message history](https://my.slack.com/services/export).
     You should be able to download a `zip` file with your data a few minutes
     after you start the export process.
</Steps>

#### Export user data and custom emoji

<Steps>
  1. Make sure that you are an owner or admin of your Slack
     workspace. If you are one, the Slack web application will display
     that in your profile, in a banner covering the bottom of your
     avatar.
  1. [Create a new Slack app](https://api.slack.com/apps). Choose the **From
     scratch** creation option.
  1. [Create a
     bot user](https://docs.slack.dev/app-management/quickstart-app-settings/#creating),
     following the instructions to add the following OAuth scopes to your bot:
     * `emoji:read`
     * `users:read`
     * `users:read.email`
     * `team:read`
  1. In **OAuth & Permissions**, under **OAuth Tokens**, click **Install to
     Workspace**. Grant the app permission to access your workspace by
     clicking **Allow** when prompted.
  1. You will immediately see a **Bot User OAuth Token**, which is a long
     string of numbers and characters starting with `xoxb-`. Copy this token. It
     grants access to download user and emoji data from your Slack workspace.
</Steps>

<ZulipNote>
  You may also come across a token starting with `xoxe-`. This token cannot
  be used for the Slack export process.
</ZulipNote>

### Import your data into Zulip

<ImportYourDataIntoZulip />

<Tabs>
  <TabItem label="Zulip Cloud">
    <ImportIntoAZulipCloudOrganization />

    <Steps>
      1. Your Slack **Bot User OAuth Token**, which will be a long
         string of numbers and characters starting with `xoxb-`.
    </Steps>

    <ImportZulipCloudOrganizationWarning />
  </TabItem>

  <TabItem label="Self hosting">
    <ImportIntoASelfHostedServerDescription />

    <FlattenedSteps>
      <ImportIntoASelfHostedServerInstructions />

      1. To import into an organization hosted on the root domain
         (`EXTERNAL_HOST`) of the Zulip installation, run the following
         commands, replacing `<token>` with your Slack **Bot User OAuth Token**.
         <ImportSelfHostedServerTips />
         ```bash "<token>"
         cd /home/zulip/deployments/current
         ./scripts/stop-server
         ./manage.py convert_slack_data /tmp/slack_data.zip --token <token> --output /tmp/converted_slack_data
         ./manage.py import '' /tmp/converted_slack_data
         ./scripts/start-server
         ```
         Alternatively, to import into a custom subdomain, run:
         ```bash "<token>" "<subdomain>"
         cd /home/zulip/deployments/current
         ./scripts/stop-server
         ./manage.py convert_slack_data /tmp/slack_data.zip --token <token> --output /tmp/converted_slack_data
         ./manage.py import <subdomain> /tmp/converted_slack_data
         ./scripts/start-server
         ```
      1. Follow [step 4](https://zulip.readthedocs.io/en/stable/production/install.html#step-4-configure-and-use)
         of the guide for [installing a new Zulip
         server](https://zulip.readthedocs.io/en/stable/production/install.html).
    </FlattenedSteps>
  </TabItem>
</Tabs>

#### Import details

Whether you are using Zulip Cloud or self-hosting Zulip, here are few notes to keep
in mind about the import process:

* Slack does not export workspace settings, so you will need to [configure
  the settings for your Zulip organization](/help/customize-organization-settings).
  This includes settings like [email
  visibility](/help/configure-email-visibility),
  [message editing permissions](/help/restrict-message-editing-and-deletion),
  and [how users can join your organization](/help/restrict-account-creation).
* Slack does not export user settings, so users in your organization may want to
  [customize their account settings](/help/getting-started-with-zulip).
* Slack's user roles are mapped to Zulip's [user
  roles](/help/user-roles) in the following way:
  | Slack role              | Zulip role    |
  | ----------------------- | ------------- |
  | Workspace Primary Owner | Owner         |
  | Workspace Owner         | Owner         |
  | Workspace Admin         | Administrator |
  | Member                  | Member        |
  | Single Channel Guest    | Guest         |
  | Multi Channel Guest     | Guest         |
  | Channel creator         | none          |
* Slack threads are imported as topics with names that include snippets of the
  original message, such as "2023-05-30 Hi, can anyone reply if you're o…".
* Message edit history and `@user joined #channel_name` messages are not imported.

## Clean up after the Slack export

Once your organization has been successfully imported in to Zulip, you should
delete [the Slack app](https://api.slack.com/apps) that you created in order to
[export your Slack data](#export-your-slack-data).  This will prevent the OAuth
token from being used to access your Slack workspace in the future.

## Decide how users will log in

<ImportHowUsersWillLogIn>
  ### Allow users to log in with non-password authentication

  ### Send password reset emails to all users

  ### Manual password resets
</ImportHowUsersWillLogIn>

To prepare your organization for transitioning to Zulip, follow the [guide on
moving from Slack](/help/moving-from-slack).

## Related articles

* [Choosing between Zulip Cloud and self-hosting](/help/zulip-cloud-or-self-hosting)
* [Moving from Slack](/help/moving-from-slack)
* [Slack-compatible incoming webhook](/integrations/slack_incoming)
* [Getting started with Zulip](/help/getting-started-with-zulip)
```

--------------------------------------------------------------------------------

---[FILE: import-your-settings.mdx]---
Location: zulip-main/starlight_help/src/content/docs/import-your-settings.mdx

```text
---
title: Import your settings
---

import {Steps} from "@astrojs/starlight/components";

import ZulipTip from "../../components/ZulipTip.astro";

When you create a Zulip account using an email address already associated with
an account in another Zulip organization, on Zulip Cloud or the same self-hosted
Zulip installation, you can import your user settings from an existing account.
It's a convenient way to preserve the user settings that you've already customized.

<ZulipTip>
  Settings that may not apply to all organizations, such as custom profile
  fields, will not be imported.
</ZulipTip>

The import will include your:

* [Name](/help/change-your-name) and [profile picture](/help/change-your-profile-picture).
* [Preferences](/help/review-your-settings#review-your-preferences), such as the
  [theme](/help/dark-theme), [font size](/help/font-size),
  [emoji set](/help/emoji-and-emoticons#change-your-emoji-set), and
  [language](/help/change-your-language) you have configured.
* [Privacy settings](/help/review-your-settings#review-your-privacy-settings),
  which include whether you let others see [when you are typing][send-typing-notifications]
  or [if you have read a message][share-read-receipts].
* [Notification settings](/help/review-your-settings#review-your-notification-settings),
  which include [default notifications for channels](/help/channel-notifications),
  [notifications for topics you follow](/help/topic-notifications), and
  [the sound used for audible desktop notifications](/help/desktop-notifications#notification-sound).

### Import your settings

<Steps>
  1. Follow the instructions for [joining a Zulip organization](/help/join-a-zulip-organization).
  1. From the dropdown list under **Import settings from an existing Zulip account**,
     select the account from which you would like to import your settings.
  1. Complete the registration form, and click **Sign up**.
  1. *(recommended)* [Review your settings](/help/review-your-settings).
</Steps>

## Related articles

* [Joining a Zulip organization](/help/join-a-zulip-organization)
* [Review your settings](/help/review-your-settings)

[send-typing-notifications]: /help/typing-notifications#disable-sending-typing-notifications

[share-read-receipts]: /help/read-receipts#configure-whether-zulip-lets-others-see-when-youve-read-messages
```

--------------------------------------------------------------------------------

---[FILE: inbox.mdx]---
Location: zulip-main/starlight_help/src/content/docs/inbox.mdx

```text
---
title: Inbox
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ConversationDefinition from "../include/_ConversationDefinition.mdx";
import GoToInbox from "../include/_GoToInbox.mdx";
import InboxInstructions from "../include/_InboxInstructions.mdx";
import InboxIntro from "../include/_InboxIntro.mdx";

<ConversationDefinition />

<InboxIntro />

Inbox is a convenient [home view](/help/configure-home-view) if you
regularly clear all unread messages in your subscribed channels.

<ZulipTip>
  To find recent conversations with no unread messages, use the [recent
  conversations](/help/recent-conversations) view instead.
</ZulipTip>

## Use your inbox

<InboxInstructions />

<KeyboardTip>
  The arrow keys and vim navigation keys (<kbd>J</kbd>, <kbd>K</kbd>,
  <kbd>L</kbd>, <kbd>H</kbd>) can be used to move between elements.
</KeyboardTip>

## Filter conversations

### Filter by topic status

In the web app, you can control whether the **Inbox** includes all topics, just
[unmuted](/help/mute-a-topic) topics, or only topics you
[follow](/help/follow-a-topic).

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToInbox />

      1. Select **All topics**, **Standard view**, or **Followed topics** from
         the dropdown in the upper left of the **inbox** view.
    </FlattenedSteps>
  </TabItem>
</Tabs>

### Filter by keyword

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToInbox />

      1. Use the **Filter** box at the top to find a conversation.
         You can filter by channel, topic, or direct message participants.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Reading strategies](/help/reading-strategies)
* [Recent conversations](/help/recent-conversations)
* [List of topics in a channel](/help/list-of-topics)
* [Combined feed](/help/combined-feed)
* [Mute or unmute a channel](/help/mute-a-channel)
* [Mute or unmute a topic](/help/mute-a-topic)
* [Introduction to channels](/help/introduction-to-channels)
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: zulip-main/starlight_help/src/content/docs/index.mdx

```text
---
title: Zulip help center
---

Welcome to the help center for [Zulip organized team chat](https://zulip.com)!
Here, you'll find up-to-date information on how to use Zulip, or administer a
Zulip organization. These pages are designed to guide you as you learn your way
around Zulip. They'll also be your go-to if you're ever unsure how something
works, or if you need to explain it to someone else.

## Guides for new users

The following guides will help you get started, and more can be found in the
left sidebar.

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Choosing a team chat app](https://blog.zulip.com/2024/11/04/choosing-a-team-chat-app/)
* [Why Zulip](https://zulip.com/why-zulip/)
* [Trying out Zulip](/help/trying-out-zulip)
* [Zulip Cloud or self-hosting?](/help/zulip-cloud-or-self-hosting)
* [Moving to Zulip](/help/moving-to-zulip)

## Mastering Zulip

If you're using Zulip a lot, it's worthwhile to learn workflows that will help you
spend that time efficiently. Check out:

* [Keyboard shortcuts](/help/keyboard-shortcuts): Mastering a few keyboard
  shortcuts (like <kbd>N</kbd> to go to the next unread topic) can speed up your
  workflows.
* [Reading strategies](/help/reading-strategies): Learn different ways to
  find what you want to read.
* [Mastering the compose box](/help/mastering-the-compose-box): Learn about
  everything Zulip’s compose box lets you do.
* [Message formatting](/help/format-your-message-using-markdown): Learn about
  quotes, spoilers, global times, and more.
* [Search filters](/help/search-for-messages/#search-filters): Learn how to find
  messages based on where they were sent, whether they contain links or
  attachments, and other details.

## Other resources

You may also want to check out:

* [An overview](https://zulip.com/features/) of the features available in Zulip.
* [Installation
  instructions](https://zulip.readthedocs.io/en/stable/production/install.html)
  for setting up a self-hosted Zulip server, and documentation on [running Zulip
  in production](https://zulip.readthedocs.io/en/stable/production/index.html).
* [API documentation](https://zulip.com/api/) for writing integrations or bots
  using the Zulip API.
* [Contributing
  guide](https://zulip.readthedocs.io/en/stable/contributing/contributing.html),
  with step-by-step instructions on how to get started contributing code to
  Zulip.

If you have any questions that aren't answered here, [let us
know](/help/contact-support)!

We work hard to make Zulip's help center comprehensive and easy to follow.
Please drop by the
[#documentation](https://chat.zulip.org/#narrow/channel/19-documentation)
channel in the [Zulip development
community](https://zulip.com/development-community/) to share ideas for how to
make it better.
```

--------------------------------------------------------------------------------

---[FILE: insert-a-link.mdx]---
Location: zulip-main/starlight_help/src/content/docs/insert-a-link.mdx

```text
---
title: Insert a link
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import LinksExamples from "../include/_LinksExamples.mdx";
import LinksIntro from "../include/_LinksIntro.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import LinkIcon from "~icons/zulip-icon/link";

<LinksIntro />

## Insert a link

<Tabs>
  <TabItem label="Via paste">
    <FlattenedSteps>
      <StartComposing />

      1. Select the text you want to linkify.
      1. Paste a URL to turn the selected text into a named link.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd>
      to insert link formatting.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Via compose box button">
    <FlattenedSteps>
      <StartComposing />

      1. Select the text you want to linkify.
      1. Click the **link** (<LinkIcon />) icon at the
         bottom of the compose box.
      1. Replace `url` with a valid URL.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd>
      to insert link formatting.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Via Markdown">
    <FlattenedSteps>
      <StartComposing />

      1. To create a named link, use `[ ]` around the link text, and `( )` around the
         URL: `[Link text](URL)`.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd>
      to insert link formatting.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Examples

<LinksExamples />

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Resize the compose box](/help/resize-the-compose-box)
* [Animated GIFs](/help/animated-gifs)
* [Video calls](/help/start-a-call)
```

--------------------------------------------------------------------------------

````
