---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 472
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 472 of 1290)

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

---[FILE: saml-authentication.mdx]---
Location: zulip-main/starlight_help/src/content/docs/saml-authentication.mdx

```text
---
title: SAML authentication
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedList from "../../components/FlattenedList.astro";
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import CloudPlusOnly from "../include/_CloudPlusOnly.mdx";
import SamlLoginButton from "../include/_SamlLoginButton.mdx";
import SendUsInfo from "../include/_SendUsInfo.mdx";
import UpgradeToPlusIfNeeded from "../include/_UpgradeToPlusIfNeeded.mdx";

<AdminOnly />

Zulip supports using SAML authentication for single sign-on, both for Zulip
Cloud and self-hosted Zulip servers. SAML Single Logout is also supported.

This page describes how to configure SAML authentication with several common providers:

* Okta
* OneLogin
* Entra ID (AzureAD)
* Keycloak
* Auth0

Other SAML providers are supported as well.

If you are [self-hosting](https://zulip.com/self-hosting/) Zulip, please follow the
detailed setup instructions in the [SAML configuration for self-hosting][saml-readthedocs].
The documentation on this page may be a useful reference for how to set up specific
SAML providers.

<CloudPlusOnly />

## Configure SAML

<Tabs>
  <TabItem label="Okta">
    <FlattenedSteps>
      <UpgradeToPlusIfNeeded />

      1. Set up SAML authentication by following
         [Okta's documentation](https://developer.okta.com/docs/guides/saml-application-setup/overview/).
         Specify the following fields, skipping **Default RelayState** and **Name ID format**:
         * **Single sign on URL**: `https://auth.zulipchat.com/complete/saml/`
         * **Audience URI (SP Entity ID)**: `https://zulipchat.com`
         * **Application username format**: `Email`
         * **Attribute statements**:
           * `email` to `user.email`
           * `first_name` to `user.firstName`
           * `last_name` to `user.lastName`
      1. Assign the appropriate accounts in the **Assignments** tab. These are the users
         that will be able to log in to your Zulip organization.
      1. <SendUsInfo />

         <FlattenedList>
           * Your organization's URL
           * The **Identity Provider metadata** provided by Okta for the application.
             To get the data, click the **View SAML setup instructions button** in
             the right sidebar in the **Sign on** tab.
             Copy the IdP metadata shown at the bottom of the page.

           <SamlLoginButton />
         </FlattenedList>
    </FlattenedSteps>
  </TabItem>

  <TabItem label="OneLogin">
    <FlattenedSteps>
      <UpgradeToPlusIfNeeded />

      1. Navigate to the OneLogin **Applications** page, and click **Add App**.
      1. Search for the **SAML Custom Connector (Advanced)** app and select it.
      1. Set a name and logo and click **Save**. This doesn't affect anything in Zulip,
         but will be shown on your OneLogin **Applications** page.
      1. In the **Configuration** section, specify the following fields. Leave the
         remaining fields as they are, including blank fields.
         * **Audience**: `https://zulipchat.com`
         * **Recipient**: `https://auth.zulipchat.com/complete/saml/`
         * **ACS URL**: `https://auth.zulipchat.com/complete/saml/`
         * **ACS URL Validator**: `https://auth.zulipchat.com/complete/saml/`
      1. In the **Parameters** section, add the following custom parameters. Set the
         **Include in SAML assertion** flag on each parameter.
         | Field name  | Value      |
         | ----------- | ---------- |
         | email       | Email      |
         | first\_name | First Name |
         | last\_name  | Last Name  |
         | username    | Email      |
      1. <SendUsInfo />

         <FlattenedList>
           * Your organization's URL
           * The **issuer URL** from the **SSO** section. It contains required **Identity Provider** metadata.

           <SamlLoginButton />
         </FlattenedList>
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Entra ID (AzureAD)">
    <FlattenedSteps>
      <UpgradeToPlusIfNeeded />

      1. From your Entra ID Dashboard, navigate to **Enterprise applications**,
         click **New application**, followed by **Create your own application**.
      1. Enter a name (e.g., `Zulip Cloud`) for the new Entra ID application,
         choose **Integrate any other application you don't find in the
         gallery (Non-gallery)**, and click **Create**.
      1. From your new Entra ID application's **Overview** page that opens, go to
         **Single sign-on**, and select **SAML**.
      1. In the **Basic SAML Configuration** section, specify the following fields:
         * **Identifier (Entity ID)**: `https://zulipchat.com`
         * **Default**: *checked* (This is required for enabling IdP-initiated sign on.)
         * **Reply URL (Assertion Consumer Service URL)**: `https://auth.zulipchat.com/complete/saml/`
      1. If you want to set up IdP-initiated sign on, in the **Basic SAML
         Configuration** section, also specify:
         * **RelayState**: `{"subdomain": "<your organization's zulipchat.com subdomain>"}`
      1. Check the **User Attributes & Claims** configuration, which should already be
         set to the following. If the configuration is different, please
         indicate this when contacting [support@zulip.com](mailto:support@zulip.com)
         (see next step).
         * **givenname**: `user.givenname`
         * **surname**: `user.surname`
         * **emailaddress**: `user.mail`
         * **name**: `user.principalname`
         * **Unique User Identifier**: `user.principalname`
      1. <SendUsInfo />

         <FlattenedList>
           * Your organization's URL
           * From the **SAML Signing Certificate** section:
             * **App Federation Metadata Url**
             * Certificate downloaded from **Certificate (Base64)**
           * From the **Set up** section
             * **Login URL**
             * **Microsoft Entra Identifier**

           <SamlLoginButton />
         </FlattenedList>
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Keycloak">
    <FlattenedSteps>
      <UpgradeToPlusIfNeeded />

      1. Make sure your Keycloak server is up and running.
      1. In Keycloak, register a new Client for your Zulip organization:
         * **Client-ID**: `https://zulipchat.com`
         * **Client Protocol**: `saml`
         * **Client SAML Endpoint**: *(empty)*
      1. In the **Settings** tab for your new Keycloak client, set the following properties:
         * **Valid Redirect URIs**: `https://auth.zulipchat.com/*`
         * **Base URL**: `https://auth.zulipchat.com/complete/saml/`
         * **Client Signature Required**: `Disable`
      1. In the **Mappers** tab for your new Keycloak client:
         * Create a Mapper for the first name:
           * **Property**: `firstName`
           * **Friendly Name**: `first_name`
           * **SAML Attribute Name**: `first_name`
           * **SAML Attribute Name Format**: `Basic`
         * Create a Mapper for the last name:
           * **Property**: `lastName`
           * **Friendly Name**: `last_name`
           * **SAML Attribute Name**: `last_name`
           * **SAML Attribute Name Format**: `Basic`
         * Create a Mapper for the email address:
           * **Property**: `email`
           * **Friendly Name**: `email`
           * **SAML Attribute Name**: `email`
           * **SAML Attribute Name Format**: `Basic`
      1. <SendUsInfo />

         <FlattenedList>
           * Your organization's URL
           * The URL of your Keycloak realm.

           <SamlLoginButton />
         </FlattenedList>
    </FlattenedSteps>

    <ZulipTip>
      Your Keycloak realm URL will look something like this: `https://keycloak.example.com/auth/realms/yourrealm`.
    </ZulipTip>
  </TabItem>

  <TabItem label="Auth0">
    <FlattenedSteps>
      <UpgradeToPlusIfNeeded />

      1. Set up SAML authentication by following [Auth0's documentation](https://auth0.com/docs/authenticate/protocols/saml/saml-sso-integrations/configure-auth0-saml-identity-provider#configure-saml-sso-in-auth0)
         to create a new application. You don't need to save the certificates or other information detailed.
         All you will need is the **SAML Metadata URL**.
      1. In the **Addon: SAML2 Web App** **Settings** tab, set the **Application Callback URL** to
         `https://auth.zulipchat.com/complete/saml/`.
      1. Edit the **Settings** section to match:
         ```json
         {
           "audience": "https://zulipchat.com",
           "mappings": {
             "email": "email",
             "given_name": "first_name",
             "family_name": "last_name"
           },
           "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
         }
         ```
      1. <SendUsInfo />

         <FlattenedList>
           * Your organization's URL
           * The **SAML Metadata URL** value mentioned above. It contains required **Identity Provider** metadata.

           <SamlLoginButton />
         </FlattenedList>
    </FlattenedSteps>
  </TabItem>
</Tabs>

<ZulipTip>
  Once SAML has been configured, consider also [configuring SCIM](/help/scim).
</ZulipTip>

## Synchronizing group membership with SAML

You can configure each Zulip user's [groups](/help/user-groups) to be updated based
on their groups in your Identity Provider's (IdP's) directory every time they
log in.

Your IdP directory's group names don't have to match the associated Zulip group
names (e.g., membership in your IdP's group **finance** can be synced to
membership in the Zulip group **finance-department**). See the [technical
documentation][saml-group-sync-readthedocs] on how your IdP's groups are mapped
to Zulip groups for details.

<ZulipTip>
  It should be possible to set this up with any provider. If you're interested
  in using this functionality with a provider other than Okta, reach out to
  [support@zulip.com](mailto:support@zulip.com).
</ZulipTip>

<Tabs>
  <TabItem label="Okta">
    <Steps>
      1. Follow the instructions [above](#configure-saml) to configure SAML, and go to
         the application you created for using SAML with Zulip in your
         **Applications** menu.
      1. Select the **General** tab, and **Edit** the **SAML Settings** section.
      1. Proceed through the prompts until the main **Configure SAML** prompt.
      1. Scroll down below the **Attribute Statements** section (which you configured
         when creating the app) to **Group Attribute Statements**.
      1. Add the following attribute:
         * **Name**: `zulip_groups`
         * **Name format**: `Unspecified`
         * **Filter**: `Matches regex: .*`
           When a user signs in to Zulip via SAML, Okta will now include a list of the
           user's groups in its response to the Zulip server.
      1. To enable this feature, please email
         [support@zulip.com](mailto:support@zulip.com) with the following information:
         * Your Zulip organization URL.
         * Which groups should be synced from your IdP's directory.
         * Which groups should have a different name in Zulip (if any).
    </Steps>
  </TabItem>
</Tabs>

## Related articles

* [SAML configuration for self-hosting][saml-readthedocs]
* [SCIM provisioning](/help/scim)
* [Moving to Zulip](/help/moving-to-zulip)

[saml-readthedocs]: https://zulip.readthedocs.io/en/stable/production/authentication-methods.html#saml

[saml-group-sync-readthedocs]: https://zulip.readthedocs.io/en/latest/production/authentication-methods.html#synchronizing-group-membership-with-saml
```

--------------------------------------------------------------------------------

---[FILE: saved-snippets.mdx]---
Location: zulip-main/starlight_help/src/content/docs/saved-snippets.mdx

```text
---
title: Saved snippets
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import StartComposing from "../include/_StartComposing.mdx";

import EditIcon from "~icons/zulip-icon/edit";
import MessageSquareTextIcon from "~icons/zulip-icon/message-square-text";
import TrashIcon from "~icons/zulip-icon/trash";

You can save snippets of message content, and quickly insert them into the
message you're composing.

## Insert a saved snippet

<FlattenedSteps>
  <StartComposing />

  1. Click the **Add saved snippet** (<MessageSquareTextIcon />) icon at the bottom of the compose box to
     open the saved snippets menu.
  1. Start typing to filter saved snippets by title. Select a saved snippet to
     insert it into the compose box.
</FlattenedSteps>

<KeyboardTip>
  You can also use <kbd>Ctrl</kbd> + <kbd>'</kbd> to open the saved
  snippets menu.
</KeyboardTip>

## Create a saved snippet

<FlattenedSteps>
  <StartComposing />

  1. *(optional)* Write the text you'd like to use as save as a snippet in the
     compose box. You can [preview](/help/preview-your-message-before-sending) what
     it will look like once sent.
  1. Click the **Add saved snippet** (<MessageSquareTextIcon />) icon at the bottom of the compose box to
     open the saved snippets menu.
  1. Select **Create a new saved snippet**.
  1. Enter a **Title** for the saved snippet, which will be used for finding saved
     snippets.
  1. Enter the **Content** you'd like to save as a snippet, or modify the content
     from the compose box as needed.
  1. Click **Save**.
</FlattenedSteps>

<KeyboardTip>
  You can also use <kbd>Ctrl</kbd> + <kbd>'</kbd> to open the saved
  snippets menu.
</KeyboardTip>

## Edit a saved snippet

<FlattenedSteps>
  <StartComposing />

  1. Click the **Add saved snippet** (<MessageSquareTextIcon />) icon at the bottom of the compose box to
     open the saved snippets menu.
  1. Hover over the saved snippet you'd like to edit, and click the **Edit
     snippet** (<EditIcon />) icon on the right.
  1. Edit the **Title** and **Content** as desired.
  1. Click **Save**.
</FlattenedSteps>

<KeyboardTip>
  You can also use <kbd>Ctrl</kbd> + <kbd>'</kbd> to open the saved
  snippets menu.
</KeyboardTip>

## Delete a saved snippet

<FlattenedSteps>
  <StartComposing />

  1. Click the **Add saved snippet** (<MessageSquareTextIcon />) icon at the bottom of the compose box to
     open the saved snippets menu.
  1. Hover over the saved snippet you'd like to delete, and click the **Delete
     snippet** (<TrashIcon />) icon on the right.
</FlattenedSteps>

<KeyboardTip>
  You can also use <kbd>Ctrl</kbd> + <kbd>'</kbd> to open the saved
  snippets menu.
</KeyboardTip>

## Related articles

* [Message formatting](/help/format-your-message-using-markdown)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Mastering the compose box](/help/mastering-the-compose-box)
* [Keyboard shortcuts](/help/keyboard-shortcuts)
```

--------------------------------------------------------------------------------

---[FILE: schedule-a-message.mdx]---
Location: zulip-main/starlight_help/src/content/docs/schedule-a-message.mdx

```text
---
title: Schedule a message
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import GoToScheduledMessages from "../include/_GoToScheduledMessages.mdx";
import StartComposing from "../include/_StartComposing.mdx";

import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";
import SendIcon from "~icons/zulip-icon/send";
import TrashIcon from "~icons/zulip-icon/trash";

Zulip lets you schedule a message to be sent at a later time. For example, if
you are working outside of regular business hours for your organization, you can
schedule a message for next morning to avoid disturbing others. You can also
[schedule a message reminder](/help/schedule-a-reminder) for yourself.

## Schedule a message

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <StartComposing />

      1. Write a message.
      1. Click on the **ellipsis** (<MoreVerticalIcon />) next to the **Send**
         (<SendIcon />) button.
      1. Click **Schedule message**.
      1. Select one of the suggested scheduling options, or pick a custom time.
    </FlattenedSteps>

    <KeyboardTip>
      From the compose box, you can use <kbd>Tab</kbd>, <kbd>Tab</kbd>,
      <kbd>Enter</kbd> to open the compose menu and start scheduling a message.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Edit or reschedule a message

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToScheduledMessages />

      1. Click on the message you want to edit or reschedule.
      1. *(optional)* Edit the message.
      1. Click the **ellipsis** (<MoreVerticalIcon />) next to the **Send**
         (<SendIcon />) button.
      1. Select the previously scheduled time, or click **Schedule message** to pick a
         new time.
    </FlattenedSteps>

    <ZulipTip>
      You can also click **Undo** in the confirmation banner shown immediately
      after a message is scheduled.
    </ZulipTip>
  </TabItem>
</Tabs>

## Send a scheduled message now

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToScheduledMessages />

      1. Click on the message you want to send now.
      1. *(optional)* Edit the message.
      1. Click the **Send** (<SendIcon />) button.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Enter</kbd> within the scheduled messages view to
      edit or reschedule the selected message.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Delete a scheduled message

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToScheduledMessages />

      1. Click the **delete** (<TrashIcon />) icon on the message you
         want to delete.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Backspace</kbd> within the scheduled messages view to
      delete the selected message.
    </KeyboardTip>
  </TabItem>
</Tabs>

## View scheduled messages

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToScheduledMessages />
    </FlattenedSteps>

    <ZulipTip>
      You can also view scheduled messages by clicking on the **ellipsis**
      (<MoreVerticalIcon />) next to the **Send**
      (<SendIcon />) button in the compose
      box, and selecting **View scheduled messages**.
    </ZulipTip>
  </TabItem>
</Tabs>

## Related articles

* [Schedule a reminder](/help/schedule-a-reminder)
* [Message drafts](/help/view-and-edit-your-message-drafts)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Verify a message was sent](/help/verify-your-message-was-successfully-sent)
* [Edit a message](/help/edit-a-message)
* [Delete a message](/help/delete-a-message)
```

--------------------------------------------------------------------------------

---[FILE: schedule-a-reminder.mdx]---
Location: zulip-main/starlight_help/src/content/docs/schedule-a-reminder.mdx

```text
---
title: Schedule a reminder
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import GoToReminders from "../include/_GoToReminders.mdx";
import MessageActions from "../include/_MessageActions.mdx";

import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";
import TrashIcon from "~icons/zulip-icon/trash";

Zulip allows you to schedule a reminder for a message at a later time. The
reminder is delivered to you as a [direct message](/help/direct-messages) by
Notification Bot at the scheduled time. For example, you might schedule a
reminder for a message to reply to when you have more time, or one about a task
to take care of.

You can also [schedule a message](/help/schedule-a-message) to be sent to any
conversation at a later time.

## Schedule a reminder

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActions />

      1. Click on the **ellipsis** (<MoreVerticalIcon />).
      1. Click **Remind me about this**.
      1. *(optional)* Add a note for yourself. You can use Zulip's standard [Markdown
         formatting](/help/format-your-message-using-markdown).
      1. Select one of the suggested scheduling options, or pick a custom time.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Delete a reminder

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToReminders />

      1. Click the **delete** (<TrashIcon />)
         icon on the reminder that you want to delete.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Backspace</kbd> within the reminders view to
      delete the selected reminder.
    </KeyboardTip>
  </TabItem>
</Tabs>

## View reminders

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToReminders />
    </FlattenedSteps>

    <ZulipTip>
      A note on the message will indicate that you have a reminder scheduled.
    </ZulipTip>
  </TabItem>
</Tabs>

## Related articles

* [Star a message](/help/star-a-message)
* [Marking messages as unread](/help/marking-messages-as-unread)
* [Schedule a message](/help/schedule-a-message)
```

--------------------------------------------------------------------------------

---[FILE: scim.mdx]---
Location: zulip-main/starlight_help/src/content/docs/scim.mdx

```text
---
title: SCIM provisioning
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import CloudPlusOnly from "../include/_CloudPlusOnly.mdx";
import UpgradeToPlusIfNeeded from "../include/_UpgradeToPlusIfNeeded.mdx";

<AdminOnly />

SCIM (System for Cross-domain Identity Management) is a standard
protocol used by Single Sign-On (SSO) services and identity providers
to provision/deprovision user accounts and [groups](/help/user-groups).
Zulip supports SCIM integration, both in [Zulip Cloud](https://zulip.com/zulip-cloud/)
and for [self-hosted](https://zulip.com/self-hosting/) Zulip servers.
This page describes how to configure SCIM provisioning for Zulip.

<CloudPlusOnly />

<ZulipTip>
  While Zulip's SCIM integration is generic, we've only fully
  documented the setup process with the Okta and Microsoft EntraID
  SCIM providers. [Zulip support](/help/contact-support) is happy to
  help customers configure this integration with SCIM providers that
  do not yet have detailed self-service documentation on this page.
</ZulipTip>

## Configure SCIM

<Tabs>
  <TabItem label="Okta">
    <FlattenedSteps>
      <UpgradeToPlusIfNeeded />

      1. Contact [support@zulip.com](mailto:support@zulip.com) to request the
         **Bearer token** that Okta will use to authenticate to your SCIM API.
      1. In your Okta Dashboard, go to **Applications**, and select
         **Browse App Catalog**.
      1. Search for **SCIM** and select **SCIM 2.0 Test App (Header Auth)**.
      1. Click **Add** and choose your **Application label**. For example, you can
         name it "Zulip SCIM".
      1. Continue to **Sign-On Options**. Leave the **SAML** options as they are.
         This type of Okta application doesn't actually support SAML authentication,
         and you'll need to set up a separate Okta app to activate SAML for your Zulip
         organization.
      1. In **Credentials Details**, specify the following fields:
         * **Application username format**: `Email`
         * **Update application username on**: `Create and update`
      1. In the **Provisioning** tab, click **Configure API Integration**, check the
         **Enable API integration** checkbox, and specify the following fields:
         * **Base URL for Zulip Cloud**: `https://your-org.zulipchat.com/scim/v2`
         * **Base URL for self-hosting**: `https://zulip.example.com/scim/v2`
         * **API token**: `Bearer <token>` (given to you by Zulip support)
           When you proceed to the next step, Okta will verify that these details are
           correct by making a SCIM request to the Zulip server.
      1. Enable the following **Provisioning to App** settings:
         * **Create Users**
         * **Update User Attributes**
         * **Deactivate Users**
      1. Remove all attributes in **Attribute Mappings**, *except* for the following:
         * **userName**
         * **givenName**
         * **familyName**
      1. **Optional:** If you'd like to also sync [user role](/help/user-roles),
         you can do it by adding a custom attribute in Okta. Go to the **Profile Editor**,
         click into the entry of the SCIM app you've just set up and **Add Attribute**.
         Configure the following:
         * **Data type**: `string`
         * **Variable name**: `role`
         * **External name**: `role`
         * **External namespace**: `urn:ietf:params:scim:schemas:core:2.0:User`
           With the attribute added, you will now be able to set it for your users directly
           or configure an appropriate **Attribute mapping** in the app's **Provisioning**
           section.
           The valid values are: **owner**, **administrator**, **moderator**, **member**, **guest**.
      1. Now that the integration is ready to manage Zulip user accounts, **assign**
         users to the SCIM app.
         * When you assign a user, Okta will check if the account exists in your
           Zulip organization. If it doesn't, the account will be created.
         * Changes to the user's email or name in Okta will automatically cause the
           Zulip account to be updated accordingly.
         * Unassigning a user from the app will deactivate their Zulip account.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Microsoft Entra ID">
    <FlattenedSteps>
      <UpgradeToPlusIfNeeded />

      1. Contact [support@zulip.com](mailto:support@zulip.com) to request the
         **Secret Token** that Entra will use to authenticate to your SCIM API.
      1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).
      1. Go to **Identity** -> **Applications** -> **Enterprise applications**.
      1. Select **New application** -> **Create your own application**.
      1. Complete the form:
         * Enter a name for your application.
         * Select the option **Integrate any other application you don't find in the gallery**.
         * Click **Add** to create the new app. It will be added to your **Enterprise applications**.
      1. Continue to the app's management screen and click **Provisioning** in the left panel.
      1. In the **Provisioning Mode** menu, select **Automatic**  and specify the following fields:
         * **Tenant URL for Zulip Cloud**: `https://your-org.zulipchat.com/scim/v2/?aadOptscim062020`.
         * **Tenant URL for self-hosting**: `https://zulip.example.com/scim/v2/?aadOptscim062020`.
           The `?aadOptscim062020` part of it is a [feature flag][feature-flag]
           that needs to be added to ensure SCIM compliance by Entra ID.
         * **Secret Token**: `<token>` (given to you by Zulip support)
      1. Click **Test Connection.**
      1. In the **Mappings** section, there are two sets of [attribute
         mappings][attribute-mappings]: one for Users and one for
         Groups. Make sure to set **Provision Microsoft Entra ID Groups** to
         be disabled. Provisioning of Groups is currently not supported in
         Zulip.
      1. In **Provision Microsoft Entra ID Users**, configure the necessary mappings:
         * Change **userName** to map to **mail**. **Important**: You need
           **mail** to be set for all your users or trying to assign them
           to the app will fail.
         * Delete the other default entries leaving only the **active** and
           **name.formatted** mappings, until your list looks like the
           image below.
           ![Attribute Mappings](../../images/entraid-scim-mappings.png)
      1. Once your configuration is complete, set the **Provisioning
         Status** to **On** and then click **Save** to start the Microsoft
         Entra provisioning service.
      1. Now you can proceed to the **Users and groups** tab, where you can
         assign users to be provisioned via this integration.
      1. Wait for the initial provisioning cycle to be started by
         Entra. This might take up to 40 minutes. This delay is entirely
         inside Entra, and not under Zulip’s control. You can also use
         [**Provision on demand**][provision-on-demand] in Entra to cause
         immediate SCIM provisioning for specific users, which is handy when
         testing the integration.
    </FlattenedSteps>
  </TabItem>
</Tabs>

[attribute-mappings]: https://learn.microsoft.com/en-us/entra/identity/app-provisioning/customize-application-attributes

[feature-flag]: https://learn.microsoft.com/en-us/entra/identity/app-provisioning/application-provisioning-config-problem-scim-compatibility#flags-to-alter-the-scim-behavior

[provision-on-demand]: https://learn.microsoft.com/en-us/entra/identity/app-provisioning/provision-on-demand

<ZulipTip>
  Once SCIM has been configured, consider also [configuring SAML](/help/saml-authentication).
</ZulipTip>

## Synchronizing group membership with SCIM

You can enable group sync for any of your SCIM provider's groups. When you do,
the SCIM integration will create a user group in Zulip with the matching name
and user memberships. When you add or remove users from the group in your SCIM
provider, these changes will immediately be reflected in group memberships in
Zulip.

In order to ensure consistent state, do not modify the **name** or **user
memberships** of SCIM-managed groups inside of Zulip. Such groups are meant to
be managed in your SCIM provider. Changes made on the Zulip side will not be
reflected in your SCIM provider, and instead will cause the state of the Zulip
group to become inconsistent with the state of the SCIM provider's group.

Zulip supports [adding user groups to other
groups](/help/manage-user-groups#add-user-groups-to-a-group), but some SCIM
providers (including Okta) do not. As a result, this concept is also not
supported in Zulip's SCIM integration. If you want to use nested groups, you can
add groups to other groups in Zulip and manage the individual members of each
subgroup in your SCIM provider.

<Tabs>
  <TabItem label="Okta">
    <Steps>
      1. Follow the instructions [above](#configure-scim) to configure SCIM.
      1. [Rename](/help/manage-user-groups#change-a-user-groups-name-or-description)
         any Zulip groups that have the same names as groups that you want to sync. If
         you push a group whose name matches an existing Zulip group, the request will
         fail.
      1. Open the **Application** you set up above for the Zulip SCIM integration, and
         go to the **Push groups** tab. This menu allows you to choose the Okta groups
         which should be synchronized with Zulip's user groups.
    </Steps>

    <ZulipNote>
      SCIM `DELETE` requests are not supported for groups. To **Unlink** a group in
      Okta from the Zulip SCIM integration, select **Leave the group in the target
      app**. The **Delete the group in the target app** option is not supported.
    </ZulipNote>
  </TabItem>
</Tabs>

## Related articles

* [SAML authentication](/help/saml-authentication)
* [Moving to Zulip](/help/moving-to-zulip)
```

--------------------------------------------------------------------------------

---[FILE: search-for-messages.mdx]---
Location: zulip-main/starlight_help/src/content/docs/search-for-messages.mdx

```text
---
title: Searching for messages
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import MobileMenu from "../include/_MobileMenu.mdx";

import SearchIcon from "~icons/zulip-icon/search";

It's easy to find the right conversation with Zulip's powerful search. When you
find the message you were looking for, go directly to its topic for full context.

Whenever you need a reminder of the search filters that Zulip offers, check out
the convenient [**search filters**](#search-filters-reference) reference
in the Zulip web and desktop apps.

## Search for messages

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click the **search** (<SearchIcon />) icon in the top bar to open the search box.
      1. Type your query, and press <kbd>Enter</kbd>.
    </Steps>

    <KeyboardTip>
      You can also use the <kbd>/</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd>
      keyboard shortcut to start searching messages.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileMenu />

      1. Tap <SearchIcon /> **Search**.
      1. Type your query, and tap **search** or
         <SearchIcon /> on your device's
         keyboard.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Keyword search

Zulip lets you search messages and topics by keyword. For example:

* `new logo`: Search for messages with both `new` and `logo` in the message or
  its topic.
* `"new logo"`: Search for messages with the phrase "`new logo`" in the message
  or its topic.

Some details to keep in mind:

* Keywords are case-insensitive, so `wave` will also match `Wave`.
* Zulip will find messages containing similar keywords (keywords with the same
  stem), so, e.g., `wave` will match `waves` and `waving`.
* Zulip search ignores very common words like `a`, `the`, and about 100 others.
* [Emoji](/help/emoji-and-emoticons) in messages (but not [emoji
  reactions](/help/emoji-reactions)) are included in searches, so if you search
  for `thumbs_up`, your results will include messages with the `:thumbs_up:` emoji (👍).

## Search filters

Zulip also offers a wide array of search filters, which can be used on their
own, or in combination with keywords. For example:

* `channel:design`: Navigate to **#design**.
* `channel:design logo`: Search for the keyword `logo` within **#design**.
* `channel:design has:image new logo`: Search for messages in **#design** that
  include an image and contain the keywords `new` and `logo`. The keywords can
  appear in the message itself or its topic.

<ZulipTip>
  As you start typing into the search box, Zulip will suggest search filters
  you can use.
</ZulipTip>

### Search by location

Sometimes you know approximately where the message you are looking for was sent.
Zulip offers the following filters based on the location of the message.

* `channel:design`: Search within the channel **#design**.
* `channel:design topic:new+logo`: Search within the topic "new logo" in
  **#design**.
* `is:dm`: Search all your direct messages.
* `dm:Bo Lin`: Search 1-on-1 direct messages between you and Bo.
* `dm:Bo Lin, Elena García`: Search group direct messages
  between you, Bo, and Elena.
* `dm-including:Bo Lin`: Search all direct message conversations
  (1-on-1 and group) that include you and Bo, as well as any other users.

### Search shared history

To avoid cluttering your search results, by default, Zulip searches just the
messages you received. You can use `channels:` or `channel:` filters to search
additional messages.

* `channels:public`: Search messages in all
  [public](/help/channel-permissions#public-channels) and
  [web-public](/help/channel-permissions#web-public-channels) channels.
* `channels:web-public`: Search messages in all
  [web-public](/help/change-the-privacy-of-a-channel) channels in the organization,
  including channels you are not subscribed to.
* `channel:design`: Search all messages in **#design**, including messages sent
  before you were a subscriber.

### Search by sender

* `sender:Elena García`: Search messages sent by Elena.
* `sender:me`: Search messages you've sent.

<ZulipTip>
  You can also access all messages someone has sent [via their **user
  card**](/help/view-messages-sent-by-a-user).
</ZulipTip>

### Search for attachments or links

* `has:link`: Search messages that contain URLs.
* `has:attachment`: Search messages that contain an [uploaded
  file](/help/share-and-upload-files).
* `has:image`: Search messages that contain uploaded or linked images or videos.

<ZulipTip>
  You can also [view](/help/manage-your-uploaded-files) all the files you
  have uploaded or [browse](/help/view-images-and-videos) all the images and
  videos in the current view.
</ZulipTip>

### Search your important messages

* `is:alerted`: Search messages that contain your [alert
  words](/help/dm-mention-alert-notifications#alert-words). Messages are
  included in the search results based on the alerts you had configured when you
  received the message.
* `is:mentioned`: Search messages where you were
  [mentioned](/help/mention-a-user-or-group).
* `is:starred`: Search your [starred messages](/help/star-a-message).

### Search by message status

* `is:followed`: Search messages in [followed topics](/help/follow-a-topic).
* `is:resolved`: Search messages in [resolved topics](/help/resolve-a-topic).
* `-is:resolved`: Search messages in [unresolved topics](/help/resolve-a-topic).
* `is:unread`: Search your unread messages.
* `is:muted`: Search [muted](/help/mute-a-topic) messages.
* `-is:muted`: Search only [unmuted](/help/mute-a-topic) messages. By default,
  both muted and unmuted messages are included in keyword search results.
* `has:reaction`: Search messages with [emoji reactions](/help/emoji-reactions).

### Search by message ID

Each message in Zulip has a unique ID, which is used for [linking to a specific
message](/help/link-to-a-message-or-conversation#link-to-zulip-from-anywhere).
You can use the search bar to navigate to a message by its ID.

* `near:12345`: Show messages around the message with ID `12345`.
* `id:12345`: Show only message `12345`.
* `channel:design near:1` Show the oldest messages in the **#design** channel.

### Exclude filters

All of Zulip's search filters can be negated to **exclude** messages matching
the specified rule. For example:

* `channel:design -is:resolved -has:image`: Search messages in [unresolved
  topics](/help/resolve-a-topic) in the **#design** channel that don't contain
  images.

## Linking to search results

When you search Zulip, the URL shown in the address bar of the Zulip web app is a
permanent link to your search. You can share this link with others, and they
will see *their own* search results for your query.

## Search filters reference

A summary of the search filters above is available in the Zulip app.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/help/search-filters" />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Configure multi-language search](/help/configure-multi-language-search)
* [Filter users](/help/user-list#filter-users)
* [Link to a message or
  conversation](/help/link-to-a-message-or-conversation#link-to-zulip-from-anywhere)
```

--------------------------------------------------------------------------------

````
