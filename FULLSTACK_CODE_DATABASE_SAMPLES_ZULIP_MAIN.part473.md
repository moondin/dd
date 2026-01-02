---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 473
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 473 of 1290)

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

---[FILE: self-hosted-billing.mdx]---
Location: zulip-main/starlight_help/src/content/docs/self-hosted-billing.mdx

```text
---
title: Self-hosted Zulip billing
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
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
import SelfHostedBillingLogInStep from "../include/_SelfHostedBillingLogInStep.mdx";

import GearIcon from "~icons/zulip-icon/gear";
import RocketIcon from "~icons/zulip-icon/rocket";

This page describes how to manage your self-hosted plan, and answers some common
questions about plans and billing for self-hosted organizations. Please refer to
[Self-hosted Zulip plans and pricing](https://zulip.com/plans/#self-hosted) for plan
details.

The topics covered include:

* [Self-hosted plans overview](#self-hosted-plans-overview)
* [Logging in to manage billing](#log-in-to-billing-management)
* [Upgrading to a paid plan](#upgrade-to-a-paid-plan)
* [Managing billing](#manage-billing)
* [Canceling a paid plan](#cancel-paid-plan)
* [Applying for a free Community plan](#apply-for-community-plan)
* [Applying for a paid plan discount](#apply-for-a-paid-plan-discount)
* [Payment methods](#payment-methods)
* [License management options](#license-management-options)

If you have any questions not answered here, please don't hesitate to
reach out at [sales@zulip.com](mailto:sales@zulip.com).

## Self-hosted plans overview

Organizations that self-host Zulip can take advantage of the following plan
options:

* **Free**: Includes free access to Zulip's [Mobile Push Notification
  Service][push-notifications] for up to 10 users.
* **Basic**: Includes unlimited access to Zulip's [Mobile Push Notification
  Service][push-notifications] for organizations with more than 10 users.
* **Business**: Includes commercial support, in addition to push notifications
  access. Zulip's support team can answer questions about installation and
  upgrades, provide guidance in tricky situations, and help avoid painful
  complications before they happen. You can also get guidance on how best to use
  dozens of Zulip features and configuration options.
* **Enterprise**: If your organization requires hands-on support, such as
  real-time assistance during installation and upgrades, help with advanced
  deployment options, development of custom features or integrations, etc.,
  please contact [sales@zulip.com](mailto:sales@zulip.com) to discuss pricing.
* **Community**: This free plan includes unlimited push notifications access,
  and is available for many non-commercial organizations with more than 10 users
  (details [below](#free-community-plan)).

For full plan details, please take a look at [self-hosted Zulip plans and
pricing](https://zulip.com/plans/#self-hosted).

There is no option to combine multiple plans (e.g., Free and Basic) within a
single organization. Pricing is [based on](#license-management-options) the
number of non-deactivated users, not on which features each user is taking
advantage of. However, paid plan discounts are available in a variety of
situations; see [below](#paid-plan-discounts) for details.

### Organization plan or server plan?

You can purchase self-hosted plans for a Zulip organization, or for your entire
server.

If your server hosts a single Zulip organization, follow the
[instructions](#log-in-to-billing-management) for organization-level billing
(available on Zulip Server 8.0+). This will provide a more convenient plan
management experience.

If your server hosts multiple organizations, you can manage plans individually
for each organization, or purchase a single plan to cover your entire server.
Commercial support for any server-wide configurations requires upgrading the
organization with the largest number of users.

## Log in to billing management

Once you are logged in, you can [upgrade to a paid
plan](#upgrade-to-a-paid-plan), [manage billing](#manage-billing), [cancel a
paid plan](#cancel-paid-plan), or [apply for a free Community
plan](#apply-for-community-plan) or a [paid plan
discount](#apply-for-a-paid-plan-discount).

<Tabs>
  <TabItem label="Organization-level billing">
    <ZulipNote>
      This feature is only available to organization [owners](/help/user-roles) and billing administrators.
    </ZulipNote>

    <Steps>
      1. Your Zulip server administrator should register the server with Zulip's
         Mobile Push Notification Service, following [these
         instructions](https://zulip.readthedocs.io/en/latest/production/mobile-push-notifications.html).
         The Zulip Server 10.0+ installer includes a `--push-notifications` flag that
         automates this registration process.
      1. Click on the **gear** (<GearIcon />) icon in
         the upper right corner of the web or desktop app.
      1. Select <RocketIcon /> **Plan management**.
      1. *(first-time log in)* Enter the email address you want to use for plan
         management, and click **Continue**.
      1. *(first-time log in)* In your email account, open the email you received
         (Subject: Confirm email for Zulip plan management), and click **Confirm and
         log in**.
      1. *(first-time log in)* Enter your name, configure your email preferences, and
         accept the [Terms of Service](https://zulip.com/policies/terms).
      1. Verify your information, and click **Continue**.
    </Steps>
  </TabItem>

  <TabItem label="Server-level billing">
    <ZulipTip>
      A **server administrator** is anyone who sets up and manages your Zulip
      installation. A **billing administrator** is anyone responsible for managing
      your Zulip plan.
    </ZulipTip>

    **Server administrator steps:**

    <Steps>
      1. Register the server with Zulip's Mobile Push Notification Service, following
         [these
         instructions](https://zulip.readthedocs.io/en/latest/production/mobile-push-notifications.html).
         The Zulip Server 10.0+ installer includes a `--push-notifications` flag that
         automates this registration process.
      1. Go to [https://selfhosting.zulip.com/serverlogin/](https://selfhosting.zulip.com/serverlogin/).
      1. Fill out the requested server information, and click **Continue**.
      1. Enter the email address of the billing contact for your organization,
         and click **Confirm email**.
    </Steps>

    **Billing administrator steps:**

    <Steps>
      1. In your email account, open the email you received
         (Subject: Log in to Zulip plan management), and click **Log in**.
      1. Verify your information, and click **Continue**. If you are logging in for
         the first time, you will need to enter your name and accept the [Terms of
         Service](https://zulip.com/policies/terms).
    </Steps>
  </TabItem>
</Tabs>

## Upgrade to a paid plan

### Start a free trial

**New customers** are eligible for a free 30-day trial of the **Basic** plan.
An organization is considered to be a new customer if:

* It was not registered for Zulip's [Mobile Push Notification
  Service][push-notifications] prior to December 12, 2023, and
* It has never previously signed up for a self-hosted Zulip plan (Basic,
  Business, Community or Enterprise).

<Tabs>
  <TabItem label="Pay by credit card">
    <FlattenedSteps>
      <SelfHostedBillingLogInStep />

      1. On the page listing Zulip's self-hosted plans, click the **Start
         30-day trial** button at the bottom of the **Basic** plan.
      1. Click **Add card** to enter your payment details.
      1. *(optional)* Update the billing details included on receipts so that
         they are different from the information entered for the payment method,
         e.g., in case you would prefer that the company's name be on receipts
         instead of the card holder's name.
      1. Click **Start 30-day trial** to start your free trial.
    </FlattenedSteps>

    <ZulipTip>
      Once you start the trial, you can switch between monthly and annual
      billing on your organization's billing page. You can
      [cancel](#cancel-paid-plan) any time during your trial to avoid any charges.
    </ZulipTip>
  </TabItem>

  <TabItem label="Pay by invoice">
    <PayByInvoiceWarning />

    <FlattenedSteps>
      <SelfHostedBillingLogInStep />

      1. On the page listing Zulip's self-hosted plans, click the **Start
         30-day trial** button at the bottom of the **Basic** plan.
      1. Select **pay by invoice**.
      1. Select your preferred option from the **Payment schedule** dropdown.
      1. Select the **Number of licenses** you would like to purchase for your
         organization. You can adjust this number to update your initial invoice any
         time during your trial.
      1. Click **Update billing information** to enter your billing details, which
         will be included on invoices and receipts.
      1. Click **Start 30-day trial** to start your free trial.
    </FlattenedSteps>
  </TabItem>
</Tabs>

### Upgrade directly to a paid plan

<Tabs>
  <TabItem label="Pay by credit card">
    <FlattenedSteps>
      <SelfHostedBillingLogInStep />

      1. On the page listing Zulip's self-hosted plans, click the button at the bottom
         of the plan you would like to purchase.

      <PlanUpgradeSteps />
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Pay by invoice">
    <PayByInvoiceWarning />

    <FlattenedSteps>
      <SelfHostedBillingLogInStep />

      1. On the page listing Zulip's self-hosted plans, click the button at the bottom
         of the plan you would like to purchase.

      <PayByInvoiceSteps />
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Manage billing

<ManageBillingIntro />

### Manage billing

<FlattenedSteps>
  <SelfHostedBillingLogInStep />
</FlattenedSteps>

### Configure who can manage plans and billing

<ConfigureWhoCanManagePlans />

## Cancel paid plan

If you cancel your plan, your organization will be downgraded to the
**Free** plan at the end of the current billing period.

<FlattenedSteps>
  <SelfHostedBillingLogInStep />

  1. At the bottom of the page, click **Cancel plan**.
  1. Click **Downgrade** to confirm.
</FlattenedSteps>

## Free Community plan

Zulip sponsors free plans for over 1000 worthy organizations. The following
types of organizations are generally eligible for the **Community** plan.

* Open-source projects, including projects with a small paid team.
* Research in an academic setting, such as research groups, cross-institutional
  collaborations, etc.
* Organizations operated by individual educators, such as a professor teaching
  one or more classes.
* Non-profits with no paid staff.
* Communities and personal organizations (clubs, groups of
  friends, volunteer groups, etc.).

Organizations that have up to 10 users, or do not require mobile push
notifications, will likely find the **Free** plan to be the most convenient
option. Larger organizations are encouraged to apply for the **Community**
plan, which includes unlimited push notifications and support for many Zulip
features.

If you aren't sure whether your organization qualifies, submitting a sponsorship
form describing your situation is a great starting point. Many organizations
that don't qualify for the **Community** plan can still receive [discounted paid
plan pricing](#paid-plan-discounts).

### Apply for Community plan

These instructions describe the **Community** plan application process for an
existing Zulip server. If you would like to inquire about eligibility prior to
setting up a self-hosted server, contact [sales@zulip.com](mailto:sales@zulip.com).

<FlattenedSteps>
  <SelfHostedBillingLogInStep />

  1. On the page listing Zulip's self-hosted plans, scroll down to the
     **Sponsorship and discounts** area, and click **Apply here**.
  1. Fill out the requested information, and click **Submit**. Your application
     will be reviewed for **Community** plan eligibility.
</FlattenedSteps>

<ZulipTip>
  Organizations that do not qualify for a **Community** plan may be offered a
  discount for the **Basic** plan.
</ZulipTip>

## Paid plan discounts

The following types of organizations are generally eligible for significant
discounts on paid plans. You can also contact
[sales@zulip.com](mailto:sales@zulip.com) to discuss bulk discount pricing for a
large organization.

* [Education organizations](#education-pricing) and [non-profit
  organizations](#non-profit-pricing).
* Discounts are available for organizations based in the **developing world**.
* Any organization where many users are **not paid staff** is likely eligible
  for a discount.

If there are any circumstances that make regular pricing unaffordable for your
organization, contact [sales@zulip.com](mailto:sales@zulip.com) to discuss your
situation.

### Education pricing

Organizations operated by individual educators (for example, a professor
teaching one or more classes) are generally eligible for [the Community
plan](#free-community-plan).

Departments and other institutions using Zulip with students are eligible for
discounted education pricing. Other educational uses (e.g., by teaching staff or
university IT) may qualify for [non-profit pricing](#non-profit-pricing).

* **For-profit education pricing**:
  * **Basic plan**: $0.50 per user per month
  * **Business plan**: $1 per user per month with annual billing
    ($1.20/month billed monthly) with a minimum purchase of 100 licenses.
* **Non-profit education pricing**: The non-profit discount applies to
  online purchases only (no additional legal agreements) for use at registered
  non-profit institutions (e.g., colleges and universities).
  * **Basic plan**: $0.35 per user per month
  * **Business plan**: $0.67 per user per month with annual billing
    ($0.80/month billed monthly) with a minimum purchase of 100 licenses.

### Non-profit pricing

Non-profits with no paid staff are eligible for [the Community
plan](#free-community-plan).

For non-profits with paid staff, volunteers and other unpaid participants in
your community are eligible for free Zulip accounts. Additionally, discounts are
available for paid staff accounts. Contact
[sales@zulip.com](mailto:sales@zulip.com) to arrange discounted pricing for your
organization.

### Guest user discounts

There is no automatic discount for guest users. However, organizations with a
large number of guest users are very likely to be eligible for a discount. If
this is your situation, please apply for a discount or email
[sales@zulip.com](mailto:sales@zulip.com).

### Duplicate accounts

Some servers host multiple organizations, with some individuals having accounts in
several of these organizations. If you have this setup, the ability to
[configure whether guests can see other
users](/help/guest-users#configure-whether-guests-can-see-all-other-users)
(introduced in Zulip 8.0) may allow you to consolidate into a single Zulip
organization.

If you want to maintain a multi-organization setup with duplicate accounts, you
may contact [sales@zulip.com](mailto:sales@zulip.com) to arrange a discounted rate.

### Apply for a paid plan discount

These instructions describe the paid plan discount application process for an
existing Zulip server. If you would like to inquire about paid plan discount
eligibility prior to setting up a self-hosted server, contact
[sales@zulip.com](mailto:sales@zulip.com).

<FlattenedSteps>
  <SelfHostedBillingLogInStep />

  1. On the page listing Zulip's self-hosted plans, scroll down to the
     **Sponsorship and discounts** area, and click **Apply here**.
  1. Select your preferred option from the **Plan** dropdown.
  1. Fill out the requested information, and click **Submit**. Your application
     will be reviewed for discount eligibility.
</FlattenedSteps>

## Payment methods

### What are my payment options?

<PaymentOptions />

### International SWIFT transfers

<InternationalWireTransfers />

## License management options

### How does automatic license management work?

<AutomaticBilling />

### How does manual license management work?

With manual license management, you choose and pay for a fixed number of
licenses for your organization or server. [Deactivating a
user](/help/deactivate-or-reactivate-a-user) frees up their license for reuse.

If the number of active users exceeds the number of licenses you've purchased,
any paid services included in your plan will be paused until this is addressed.
For example, you will lose access to the [Mobile Push Notification
Service][push-notifications] until you have purchased more licenses or
deactivated enough users.

#### Manually update number of licenses

<FlattenedSteps>
  <SelfHostedBillingLogInStep />

  <ManualAddLicenseInstructions />
</FlattenedSteps>

## How paid plans support the Zulip project

Zulip is proudly independent, with [no venture capital funding][sustainable-growth],
which means that revenue strongly impacts the pace of Zulip’s development. Paid
plans for self-hosted customers help fund improvements in Zulip's self-hosting
experience, and overall product development. Zulip needs the support of
businesses that self-host Zulip in order to thrive as an independent, [100%
open-source](https://github.com/zulip/zulip#readme) project.

You can also learn about [other ways](/help/support-zulip-project) to support
the Zulip project.

## Self-hosting Zulip for free

Zulip is 100% open-source. Organizations that do not require support with their
installation can always use Zulip for free with no limitations. Additionally,
the [Mobile Push Notification Service][push-notifications] is provided free of
charge for organizations with up to 10 users.

You can self-manage your Zulip installation without signing up for a plan. Get
started with the [installation guide][production-install].

## Related articles

* [Trying out Zulip](/help/trying-out-zulip)
* [Zulip Cloud or self-hosting?](/help/zulip-cloud-or-self-hosting)
* [Migrating from other chat tools](/help/migrating-from-other-chat-tools)
* [Contact support](/help/contact-support)

[basic-metadata]: https://zulip.readthedocs.io/en/latest/production/mobile-push-notifications.html#uploading-basic-metadata

[usage-statistics]: https://zulip.readthedocs.io/en/latest/production/mobile-push-notifications.html#uploading-usage-statistics

[push-notifications]: https://zulip.readthedocs.io/en/stable/production/mobile-push-notifications.html

[production-install]: https://zulip.readthedocs.io/en/stable/production/install.html

[sustainable-growth]: https://zulip.com/values/#building-a-sustainable-business-aligned-with-our-values
```

--------------------------------------------------------------------------------

---[FILE: self-hosting-to-cloud.mdx]---
Location: zulip-main/starlight_help/src/content/docs/self-hosting-to-cloud.mdx

```text
---
title: Move from self-hosting to Zulip Cloud
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

If you no longer want to manage your own server, you can always move your
organization to [Zulip Cloud](https://zulip.com/zulip-cloud/).

## Move from self-hosting to Zulip Cloud

<Steps>
  1. [Export](/help/export-your-organization) your organization's data with user
     consent, or follow [these instructions][data-export] to get a full export
     without member consent.
  1. Email [support@zulip.com](mailto:support@zulip.com) with the following
     information:
     * The subdomain you would like to use for your organization. Your Zulip chat will
       be hosted at `<subdomain>.zulipchat.com`.
     * Your **exported data** file (`.tar.gz` format).
</Steps>

## Related articles

* [Export your organization](/help/export-your-organization)
* [Full data export][data-export]
* [Import organization into a self-hosted Zulip server][import-only]
* [Move from Zulip Cloud to self-hosting](/help/cloud-to-self-hosting)

[import-only]: https://zulip.readthedocs.io/en/stable/production/export-and-import.html#import-into-a-new-zulip-server

[data-export]: https://zulip.readthedocs.io/en/stable/production/export-and-import.html#data-export
```

--------------------------------------------------------------------------------

---[FILE: set-default-channels-for-new-users.mdx]---
Location: zulip-main/starlight_help/src/content/docs/set-default-channels-for-new-users.mdx

```text
---
title: Set default channels for new users
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";

import CloseIcon from "~icons/zulip-icon/close";

<AdminOnly />

You can configure a default set of channels that users will be subscribed to
when they join your organization. Default channels must be [public or
web-public](/help/channel-permissions). Users will be
subscribed to the default channels configured at the time when they
accept the invitation, so there's no need to update or revoke invitations when
you change the default channels.

When you [send an email
invitation](/help/invite-new-users#send-email-invitations) or [create a reusable
invitation link](/help/invite-new-users#create-a-reusable-invitation-link), you
can customize which channels the invited users are subscribed to. Note that
subscribing new users to a channel generally requires having
[permissions](/help/channel-permissions) to do so, but anyone with
[permissions](/help/restrict-account-creation#change-who-can-send-invitations)
to invite new users can subscribe them to any combination of default channels.

## Add a default channel

<FlattenedSteps>
  <NavigationSteps target="settings/default-channels-list" />

  1. Click **Add channel**.
  1. Select one or more channels, and click **Add**.
</FlattenedSteps>

## Remove a default channel

<FlattenedSteps>
  <NavigationSteps target="settings/default-channels-list" />

  1. Find the channel you would like to remove, and click **Remove from default** (<CloseIcon />) icon.
</FlattenedSteps>

## Related articles

* [User roles](/help/user-roles)
* [User groups](/help/user-groups)
* [Channel permissions](/help/channel-permissions)
* [Create channels for a new organization](/help/create-channels)
```

--------------------------------------------------------------------------------

---[FILE: set-up-your-account.mdx]---
Location: zulip-main/starlight_help/src/content/docs/set-up-your-account.mdx

```text
---
title: Set up your account
---

import SetUpYourAccount from "../include/_SetUpYourAccount.mdx";

<SetUpYourAccount />

## Related articles

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Review your settings](/help/review-your-settings)
```

--------------------------------------------------------------------------------

---[FILE: setting-up-zulip-for-a-class.mdx]---
Location: zulip-main/starlight_help/src/content/docs/setting-up-zulip-for-a-class.mdx

```text
---
title: Setting up Zulip for a class
---

import {Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AddAWideLogo from "../include/_AddAWideLogo.mdx";
import CreateChannelsIntro from "../include/_CreateChannelsIntro.mdx";
import CustomizeSettingsForNewUsers from "../include/_CustomizeSettingsForNewUsers.mdx";
import EditOrganizationProfile from "../include/_EditOrganizationProfile.mdx";
import HowToCreateAUserGroup from "../include/_HowToCreateAUserGroup.mdx";
import HowToInviteUsersToJoinNoImport from "../include/_HowToInviteUsersToJoinNoImport.mdx";
import ReviewOrganizationSettingsInstructions from "../include/_ReviewOrganizationSettingsInstructions.mdx";

Welcome to Zulip! This page will guide you through setting everything
up for [teaching with Zulip](https://zulip.com/for/education/). If you
are using Zulip for a different purpose, we recommend checking out the
[moving to Zulip](/help/moving-to-zulip) guide instead.

If you are a student, or if your Zulip organization is already set up,
you can proceed to the [Using Zulip for a
class](/help/using-zulip-for-a-class) guide.

If you encounter any problems as you're getting started, please drop
by our [friendly development community](https://zulip.com/development-community/)
and let us know!

## Trying out Zulip

You can start by reading about [Zulip for Education](https://zulip.com/for/education/),
and how Zulip can become the communication hub for your class. Zulip
is the only [modern team chat app](https://zulip.com/features/) that is
[ideal](https://zulip.com/why-zulip/) for both live and asynchronous
conversations. Post lecture notes and announcements, answer students’
questions, and coordinate with teaching staff all in one place.

We also highly recommend trying Zulip for yourself! You can:

* [Create a Zulip Cloud organization](https://zulip.com/new/) for free
  with just a few clicks.
* [Join the Zulip development community](https://zulip.com/development-community/)
  to see Zulip in action. Feel free to introduce yourself and ask questions!

## Choosing between Zulip Cloud and self-hosting

Follow the [guide](/help/zulip-cloud-or-self-hosting) on choosing between Zulip
Cloud and self-hosting to pick the best option for you. If your needs change,
you can always [move to a self-hosted installation](/help/cloud-to-self-hosting)
or [to Zulip Cloud](/help/move-to-zulip-cloud).

Anyone can [start with Zulip Cloud Free](https://zulip.com/new/), which works
well for a typical class. For large classes and departments, we offer [special
Zulip for Education pricing](https://zulip.com/for/education/#feature-pricing),
with the same features as Zulip Cloud Standard. You can always get started with
Zulip Cloud Free, and upgrade down the line if needed.

## Do I need a separate Zulip organization for each class?

There are a few ways to set up Zulip, and different ones may be convenient for your needs:

* If your **school or department already has a Zulip organization**,
  you will probably find it easiest to just add your class to
  it. Advantages:
  * Students and staff can use a single Zulip account for all classes.
  * You can create department-wide channels, e.g., for announcing talks or other events.
  * You don’t need to set up a separate server if you’re self-hosting Zulip.
* You can **set up a separate Zulip organization for each class**
  you’re teaching. Advantages:
  * This makes it simple to manage permissions, e.g., if you want to
    make sure TAs from one class cannot moderate discussion from a
    different class.
  * Students can’t see who is in channels for other classes.
  * You can easily switch between multiple Zulip organizations in
    the [Zulip desktop apps](/apps/).
* You can **use a single Zulip organization for several classes**
  you’re teaching, perhaps re-purposing a Zulip organization from a
  prior term. Advantages:
  * Information from your classes is all in one place, e.g., if you
    want to re-post a response to a question that was also asked
    last time you taught the class.

If you change your mind down the line, you can rename your Zulip
organization by sending a request to
[support@zulip.com](mailto:support@zulip.com).

## Create your organization profile

The information in your organization profile is displayed on the
registration and login page for your organization, and in the Zulip app.

### Edit organization profile

<EditOrganizationProfile />

### Add a wide logo

<AddAWideLogo />

## Customize organization settings

<ReviewOrganizationSettingsInstructions />

A few settings to highlight:

* If your class uses a programming language, set the [default
  language for code blocks][default-code-block-language]. Also
  consider setting up [code playgrounds][code-playgrounds].
* If your class uses code repositories, [set up
  linkifiers](/help/add-a-custom-linkifier) to make it easy to link to
  issues (e.g., just by typing #1234 for issue 1234).
* [Add custom emoji](/help/custom-emoji) that your class will enjoy.

[default-code-block-language]: /help/code-blocks#default-code-block-language

[code-playgrounds]: /help/code-blocks#code-playgrounds

### Roles and permissions

Zulip offers [several levels of permissions based on user
roles](/help/user-roles). Here are some recommendations for
how to assign roles and permissions for a class.

#### Recommended roles and permissions for a single-class Zulip organization

| Who                                 | Role                                           |
| ----------------------------------- | ---------------------------------------------- |
| Lead instructor, IT                 | Owner (also has all Administrator permissions) |
| Other instructors, head TA          | Administrator                                  |
| Teaching assistants, lab assistants | Moderator                                      |
| Students                            | Member                                         |

##### Settings

<ZulipNote>
  These are the default permissions for new **Education
  (non-profit)** and **Education (for-profit)** organizations.
</ZulipNote>

* Set [who can invite new users](/help/restrict-account-creation#change-who-can-send-invitations).
  (Recommended: Admins)
* Set [who can access user email addresses](/help/configure-email-visibility).
  (Recommended: Admins only)
* Set [who can create channels](/help/configure-who-can-create-channels).
  (Recommended: Admins for public channels; Admins, moderators and members for private channels)
* Set [who can subscribe other users to channels](/help/configure-who-can-invite-to-channels).
  (Recommended: Admins and moderators)
* Set [who can edit the topic of any message](/help/restrict-moving-messages).
  (Recommended: (default) Members for small classes;
  Admins and moderators for large classes)
* Set [who can move messages between channels][move-between-channels].
  (Recommended: Admins and moderators)
* Set [who can create and manage user groups][user-group-permissions].
  (Recommended: Admins and moderators)

[user-group-permissions]: /help/manage-user-groups#configure-who-can-create-user-groups

[move-between-channels]: /help/restrict-moving-messages#configure-who-can-move-messages-out-of-any-channel

#### Recommended roles and permissions for a department

| Who                                           | Role                                           |
| --------------------------------------------- | ---------------------------------------------- |
| IT                                            | Owner (also has all Administrator permissions) |
| IT, department leadership                     | Administrator                                  |
| Professors, Lecturers, head TAs               | Moderator                                      |
| Teaching assistants, lab assistants, students | Member                                         |

##### Settings

* Set [who can invite new users](/help/restrict-account-creation#change-who-can-send-invitations).
  (Recommended: Admins and moderators)
* Set [who can access user email addresses](/help/configure-email-visibility).
  (Recommended: Admins only)
* Set [who can create channels](/help/configure-who-can-create-channels).
  (Recommended: Admins and moderators for public channels;
  Admins, moderators and members for private channels)
* Set [who can subscribe other users to channels](/help/configure-who-can-invite-to-channels).
  (Recommended: Admins and moderators)
* Set [who can edit the topic of any message](/help/restrict-moving-messages).
  (Recommended: Admins and moderators)
* Set [who can move messages between channels][move-between-channels].
  (Recommended: Admins and moderators)
* Set [who can create and manage user groups][user-group-permissions].
  (Recommended: Admins and moderators)

## Create channels

<CreateChannelsIntro />

### How to create a channel

<FlattenedSteps>
  <NavigationSteps target="relative/channel/all" />

  1. Click **Create channel** on the right.
  1. Fill out the requested info, and click **Create**.
</FlattenedSteps>

### Tips for creating channels

For most classes, the following channels are recommended:

* **#announcements**: For general announcements about the class. When
  creating this channel, [restrict posting
  permissions](/help/channel-posting-policy) so that only course staff
  ([administrators and moderators](/help/user-roles)) are
  allowed to post.
* **#staff (private)**: For discussions among course staff.
* **#general**: For random topics, e.g., students forming study groups.
* A channel for each **lecture** or **unit**, e.g., “Lecture 1: Course
  intro” or “Unit 3: Sorting algorithms”.
* A channel for each **section**/**tutorial group** (e.g., “Section 1”)

<ZulipTip>
  You can start by creating channels for just the first few
  lectures/units at this point. When you create a new channel,
  you will be able to copy channel membership from existing channels.
</ZulipTip>

A few notes:

* Small classes may need just one discussion channel for all lectures.
* If you are [using a single Zulip organization][separate-orgs] for
  more than one class, all channel names should be prefixed with the
  name of the class, e.g., “CS101 > Lecture 1: Course intro”.

[separate-orgs]: /help/setting-up-zulip-for-a-class#do-i-need-a-separate-zulip-organization-for-each-class

## Customize settings for new users

<CustomizeSettingsForNewUsers />

<ZulipTip>
  If using your Zulip organization for a single class, set default
  channels for new users to include **#announcements**, **#general**,
  and all lecture/unit channels.
</ZulipTip>

## Invite users to join

<ZulipTip>
  Before inviting users, you may want to [delete any test
  messages][delete-message] or [topics](/help/delete-a-topic).
</ZulipTip>

[delete-message]: /help/delete-a-message#delete-a-message-completely

### How to invite users to join

To simplify subscription management, be sure to set the channels
students and staff should be subscribed to when you create the
invitations. You may choose to send invitations to course staff
separately, so that they can immediately be subscribed to private
channels for your class.

<Tabs>
  <HowToInviteUsersToJoinNoImport />
</Tabs>

To get everyone off to a good start, you may wish to share the guide
to [Getting started with Zulip][getting-started] and the guide to
[Using Zulip for a class](/help/using-zulip-for-a-class).

<ZulipTip>
  If you create new channels later on, you can subscribe users
  [by group][create-user-groups] or copy membership from another
  channel (e.g., from Lecture 5 to Lecture 6).
</ZulipTip>

[create-user-groups]: /help/setting-up-zulip-for-a-class#create-user-groups

## Create user groups

User groups allow you to [mention](/help/mention-a-user-or-group)
multiple users at once,
[notifying](/help/dm-mention-alert-notifications) them about a
message. For example, you may find it useful to set up the following
user groups:

* @staff
* @TAs
* @graders
* @students
* @section1, @section2, etc.

### How to create a user group

<HowToCreateAUserGroup />

## Set up integrations

Zulip integrates directly with dozens of products, and with hundreds
more through [Zapier](/integrations/zapier) and
[IFTTT](/integrations/ifttt).  Popular Zulip integrations include
[GitHub](/integrations/github) and
[GitLab](/integrations/gitlab). The [integrations
page](/integrations/) has instructions for integrating with each
product.

## Cleaning up at the end of a class

If you plan to use the same Zulip organization in future terms (either
for your own classes or for your department), you will likely want to:

* Rename all channels to indicate the class and term in which they were used, for
  example:
  * **#announcements** → **#FA21 - CS101 - announcements**
  * **#CS101 > Lecture 1: Course intro** → **#FA21 - CS101 > Lecture 1: Course
    intro**
* If you do *not* want students from future classes to see messages
  from the prior term (e.g., because you posted homework solutions),
  [make all the channels from the class private][make-private]. You’ll
  be able to find and reuse content yourself, and [invite course
  staff][subscribe-to-channel] to these private channels as needed.
* You may choose to [deactivate students’ Zulip
  accounts][deactivate-user] when the class is over.
* [Unpin channels](/help/pin-a-channel) from the class from your
  personal view.

If you do not plan to reuse the Zulip organization, you can instead:

* [Export the organization](/help/export-your-organization) or [generate a static
  HTML archive](https://github.com/zulip/zulip-archive) to archive the information.
* [Deactivate the organization](/help/deactivate-your-organization).

## Further reading

* [Using Zulip for a class](/help/using-zulip-for-a-class)
* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Introduction to topics](/help/introduction-to-topics)
* [Moderating open organizations](/help/moderating-open-organizations)

[make-private]: /help/change-the-privacy-of-a-channel

[subscribe-to-channel]: /help/subscribe-users-to-a-channel

[deactivate-user]: /help/deactivate-or-reactivate-a-user#deactivate-a-user

[getting-started]: /help/getting-started-with-zulip
```

--------------------------------------------------------------------------------

````
