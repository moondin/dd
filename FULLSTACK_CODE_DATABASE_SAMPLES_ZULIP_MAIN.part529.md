---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 529
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 529 of 1290)

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

---[FILE: rules.md]---
Location: zulip-main/templates/corporate/policies/rules.md

```text
# Zulip Rules of Use

**Last updated: December 13, 2021.** View [change history][changes-rules].

[changes-rules]: https://github.com/zulip/zulip/commits/main/templates/corporate/policies/rules.md

Zulip is designed to help thoughtful people work on difficult problems together,
whether they work from a shared office or from all over the world. Zulip offers
an ideal platform for businesses, as well as communities of all types, including
open-source projects, research collaborations, volunteer organizations, and
other groups of people who share a common pursuit.

This document lays out rules of appropriate behavior that apply to all Zulip
organizations. Owners of Zulip organizations are expected to manage their
organizations to help avoid problematic behavior. Open organizations are
additionally encouraged to write a Code of Conduct and link to it from their
[organization profile](/help/create-your-organization-profile), to provide
further guidance on expected behavior in their communities.

If you encounter a Zulip message or behavior by a Zulip user that appears to
violate these rules, please [report it to us](/support/). We aim to be thoughtful
and judicious in handling reported content. Depending on the severity and scope
of the problem, our response may include issuing a warning, removing the
content, deactivating user accounts or organizations, and/or reporting the
behavior to law enforcement. Capitalized terms used below but not defined in
these rules have the meaning set forth in the [Terms of Service](/policies/terms).

## Safety

You may not engage in, promote, organize, incite, induce, encourage, or support
any of the following:

- **Violence, including terrorism, violent extremism, animal cruelty,
  suicide, and self-harm**.
- **Bullying, abuse, or harassment** of any individual or group of people. This
  includes threatening anyone or wishing or hoping that someone experiences
  physical harm.
- **Distribution of content that violates the privacy rights of any other
  person.** This includes personal information about any other person that you
  do not have permission to share (“doxxing”).
- **Hateful content.** You may not attack, threaten, or harass any individual or
  group on the basis of attributes such as their race, ethnicity, national
  origin, caste, religious affiliation, sexual orientation, gender or gender
  identity, age, disability, or disease.
- **Harmful misinformation.** This includes misinformation that has the
  potential to cause imminent physical harm, or that is defamatory. Deceptively
  sharing synthetic or manipulated media is also prohibited.
- **Human trafficking and exploitation, including child sexual exploitation.**
  This includes sharing content or links which depict minors in a pornographic,
  sexually suggestive, or violent manner, and includes illustrated or digitally
  altered pornography that depicts minors. If we become aware of apparent child
  exploitation, we will report it to the National Center for Missing and
  Exploited Children (NCMEC).
- **Sexually explicit content and pornography as well as commercial sexual
  services.**  This includes requesting, offering, or asking for rates for
  sexual or escort services.
- **Fraud and deception**, including financial scams such as fake loans,
  multi-level marketing schemes, get-rich-quick schemes, money-laundering
  schemes, gambling scams, insurance scams, and “money mule” businesses.
- **Distribution of content that violates the intellectual property rights,
  privacy rights, or other rights of anyone else (including Zulip).**
- **Cybercrime, hacking, cracking, or distribution of pirated software or stolen
  accounts.**
- **The sale of banned or dangerous goods** such as weapons, drugs, or other
  illegal substances. Attempting to provide material support or resources (or to
  conceal or disguise the nature, location, source, or ownership of material
  support or resources) to any organization(s) designated by the United States
  government as a foreign terrorist organization pursuant to section 219 of the
  Immigration and Nationality Act or other laws and regulations concerning
  national security, defense or terrorism is strictly prohibited.
- **Any other illegal behavior.** Activities that violate any applicable law,
  including, but not limited to, all intellectual property, data, privacy, and
  export control laws and regulations promulgated by any government agencies,
  including, but not limited to, the U.S. Securities and Exchange Commission,
  and any rules of any national and other securities exchanges, are prohibited.

## Security

- **Do not attempt to compromise the security of other users of the Services,**
  such as attempting to obtain the password or other security information of any
  other user, or to gain access to their account**.**
- **Do not attempt to compromise the security of the Services themselves.** This
  includes violating the security of any computer network or system, cracking
  any passwords or encrypted communications, or compromising, breaking, or
  circumventing any of the technical processes or security measures associated
  with the Services. Do not attempt to test for vulnerabilities in our systems
  or networks without explicit prior consent.
- **Do not exceed or circumvent rate limits,** run automated processes that
  interfere with the proper working of the Services, place an unreasonable load
  on the Services’ infrastructure, or otherwise cause excess or abusive usage.
- **Do not permit any third party to access your account** or the authentication
  credentials you use to access the Services. This includes selling, reselling,
  sublicensing, or time-sharing Zulip accounts.
- **Do not share viruses or malware**, or attempt to hack, phish, or DDoS
  others.
- **Do not automatically create or access accounts** for the Services (a.k.a.
  “scraping”) by means other than our publicly supported interfaces. If you wish
  to embed Zulip as the chat backend for your own product, you must self-host
  your own Zulip server, rather than using Zulip Cloud.

## Spam and deception

- **Do not send spam**, including unsolicited communications, promotions, or
  advertisements.
- **Do not target other accounts with notification spam** by mentioning someone
  or sending them direct messages that they do not want.
- **Do not use other accounts to contact a user who has muted you** or create a
  new account in an organization that has deactivated your account for abusive
  behavior**.** Do not circumvent features we offer to enable users to protect
  themselves from abusive behavior.
- **Do not impersonate someone else** (individuals, groups, organizations, Zulip
  staff or organization administrators, or other users) in a manner that is
  intended to or does mislead, confuse, or deceive anyone, such as “spoofing” or
  “phishing”.
- **Do not submit false reports** of abusive behavior by other users.
- **Do not contact users outside of the Services** using contact information
  obtained from the Services (including email addresses) without their consent.
  Do not create or distribute mailing lists or other collections of contact or
  user profile information for use outside of the Services.

## Third-party clients

Zulip is 100% open-source software, and we welcome third-party clients that work
with Zulip’s API or that allow Zulip users to connect to Zulip as well as other
chat services from a single client. Developers of third-party clients marketed
as working with the Zulip Cloud service are required to follow these additional
rules to protect our users:

- **Third-party clients must comply with global privacy laws**, including GDPR and
  CCPA, in their processing of any user data, including telemetry and
  error-reporting data.
- **Use security best practices** to protect Zulip users who use your client. For
  example, if your client uses the Electron browser framework, you should
  implement the [Electron Security
  guidelines](https://www.electronjs.org/docs/latest/tutorial/security).
  Projects that are early in development and potentially not yet secure must be
  advertised as insecure and not intended for general use.
- **Do not sell data** collected from Zulip users to third parties.
- **Do not sell third-party advertisements** for display within a Zulip client.

If you have any questions about the Zulip Rules of Use or would like to report a
violation, please contact us at [support@zulip.com](mailto:support@zulip.com).
```

--------------------------------------------------------------------------------

---[FILE: sidebar_index.md]---
Location: zulip-main/templates/corporate/policies/sidebar_index.md

```text
# Policies

* [Index](/policies/)
* [Terms of Service](/policies/terms)
* [Privacy Policy](/policies/privacy)
* [Rules of Use](/policies/rules)
* [Age of consent](/policies/age-of-consent)
* [Data Processing Addendum](/static/images/policies/Zulip-Data-Processing-Addendum.pdf)
* [Subprocessors for Zulip Cloud](/policies/subprocessors)

## Archive
* [Terms of Service in 2021](/policies/terms-before-2022)
* [Privacy Policy in 2021](/policies/privacy-before-2022)
```

--------------------------------------------------------------------------------

---[FILE: subprocessors.md]---
Location: zulip-main/templates/corporate/policies/subprocessors.md

```text
# Subprocessors for Zulip Cloud

[Learn about GDPR compliance with Zulip.](/help/gdpr-compliance)

To support delivery of our Services, Kandra Labs, Inc. may engage and
use data processors with access to certain Customer Data (each, a
"Subprocessor").  This section provides important information about
the identity, location and role of each Subprocessor.  Terms used on
this page but not defined have the meaning set forth in Zulip's Terms
of Service or superseding written agreement between Customer and
Kandra Labs (the "Agreement").

### Third parties

Zulip currently uses third party Subprocessors to provide
infrastructure services, and to help us provide customer support and
email notifications. Prior to engaging any third party Subprocessor,
we perform diligence to evaluate their privacy, security and
confidentiality practices.

**Subprocessors**

Zulip Cloud may use the following Subprocessors to host Customer Data
or provide infrastructure that helps with delivery and operation of
our Services:

* [Amazon Web Services, Inc.](https://aws.amazon.com/compliance/gdpr-center/)
  for cloud infrastructure.
* [DigitalOcean, LLC](https://www.digitalocean.com/security/gdpr/)
  for cloud infrastructure.
* [FrontApp, Inc.](https://community.frontapp.com/t/x1p4mw/is-front-compliant-with-gdpr)
  for customer support.
* [Functional Software, Inc. d/b/a Sentry](https://blog.sentry.io/2018/03/14/gdpr-sentry-and-you)
  for error tracking.
* [Google LLC](https://privacy.google.com/businesses/compliance/) for
  cloud infrastructure and services.
* [Mailgun Technologies, Inc.](https://www.mailgun.com/gdpr) for email processing.
* [Stripe, Inc.](https://stripe.com/guides/general-data-protection-regulation) for payment processing.
```

--------------------------------------------------------------------------------

---[FILE: terms-before-2022.md]---
Location: zulip-main/templates/corporate/policies/terms-before-2022.md

```text
# Terms of Service for the Zulip service by Kandra Labs (prior to 2022)

!!! warn ""
    Starting January 1, 2022, these terms are replaced by the updated
    [Terms of Service](/policies/terms).

### Welcome to Zulip!

Thanks for using our products and services ("Services"). The Services are
provided by Kandra Labs, Inc. ("Kandra Labs"), located at
450 Townsend Street, San Francisco, CA 94107, United States.

By using our Services, you are agreeing to these terms. Please read them
carefully.

The Services are not intended for use by you if you are under 13 years of
age. By agreeing to these terms, you are representing to us that you are over
13.

### Using our Services

You must follow any policies made available to you within the Services.

Don't misuse our Services. For example, don't interfere with our Services or
try to access them using a method other than the interface and the instructions
that we provide. You may use our Services only as permitted by law, including
applicable export and re-export control laws and regulations. We may suspend or
stop providing our Services to you if you do not comply with our terms or
policies or if we are investigating suspected misconduct.

Using our Services does not give you ownership of any intellectual property
rights in our Services or the content you access. You may not use content from
our Services unless you obtain permission from its owner or are otherwise
permitted by law. These terms do not grant you the right to use any branding or
logos used in our Services. Don't remove, obscure, or alter any legal notices
displayed in or along with our Services.

Our Services display some content that does not belong to Kandra Labs. This content is the
sole responsibility of the entity that makes it available. We may review
content to determine whether it is illegal or violates our policies, and we may
remove or refuse to display content that we reasonably believe violates our
policies or the law. But that does not necessarily mean that we review content,
so please don't assume that we do.

In connection with your use of the Services, we may send you service
announcements, administrative messages, and other information. You may opt out
of some of those communications.

### Your Kandra Labs Zulip Account

You may need a Kandra Labs Zulip Account ("Account") in order to use some of our Services. You may
create your own Account, or your Account may be assigned to you
by an administrator, such as your employer or educational institution. If you
are using an Account assigned to you by an administrator, different or
additional terms may apply and your administrator may be able to access or
disable your account.

If you learn of any unauthorized use of your password or account, contact
[support@zulipchat.com](mailto:support@zulipchat.com).

### Privacy and Copyright Protection

The Kandra Labs [privacy policy](/policies/privacy) explains how we treat your
personal data and protect your privacy when you use our Services. By using our
Services, you agree that Kandra Labs can use such data in accordance with our
privacy policy.

We respond to notices of alleged copyright infringement and terminate
accounts of repeat infringers according to the process set out in the U.S.
Digital Millennium Copyright Act.

Our designated agent for notice of alleged copyright infringement on the
Services is:

> Copyright Agent
> Kandra Labs, Inc.
> 450 Townsend Street
> San Francisco, CA 94107

> [copyright@zulipchat.com](mailto:copyright@zulipchat.com)

### Your Content in our Services

Some of our Services allow you to submit content. You retain ownership of
any intellectual property rights that you hold in that content. In short, what
belongs to you stays yours.

When you upload or otherwise submit content to our Services, you give Kandra Labs
(and those we work with) a worldwide license to use, host, store, reproduce,
modify, create derivative works (such as those resulting from translations,
adaptations or other changes we make so that your content works better with our
Services), communicate, publish, perform, display and distribute such content.
The rights you grant in this license are for the limited purpose of operating
and improving our Services, and to develop new ones. This license continues
even if you stop using our Services (for example, so that we can deliver a
message that you sent to another Account before you stopped using our
Services). Some Services may offer you ways to access and remove content that
has been provided to that Service. Also, in some of our Services, there may be
terms or settings that narrow the scope of our use of the content submitted in
those Services. Make sure you have the necessary rights to grant us this
license for any content that you submit to our Services. If you use the
Services to share content with others, anyone you've shared content with
(including the general public, in certain circumstances) may have access to the
content.

In order to provide the Services, our servers save a record of the messages
received by each Account (the "Received Message Information" for the
account). If you are using our Services on behalf of a business and a
representative of that business sends [data@zulipchat.com](mailto:data@zulipchat.com)
a request to delete all of your business' accounts with us, then within a
commercially reasonable period of time, we will close all of your business'
accounts with us and delete the Received Message Information for each such
account by removing pointers to the information on our active servers and
overwriting it over time. Notwithstanding the foregoing, deleting the Received
Message Information for your business' accounts will not require deleting any
information about messages that were sent or received by any Accounts that
are not one of your business' accounts with us (such as system-wide announcement
messages or any messages corresponding with the Kandra Labs support team).

You can find more information about how Kandra Labs uses and stores content in
the privacy policy. If you submit feedback or suggestions about our Services,
we may use your feedback or suggestions without obligation to you.


### About Software in our Services

When a Service requires or includes downloadable software, this software may
update automatically on your device once a new version or feature is available.
Some Services may let you adjust your automatic update settings.

Kandra Labs gives you a personal, worldwide, royalty-free, non-assignable and
non-exclusive license to use the software provided to you by Kandra Labs as part of
the Services. This license is for the sole purpose of enabling you to use and
enjoy the benefit of the Services as provided by Kandra Labs, in the manner
permitted by these terms. You may not copy, modify, distribute, sell, or lease
any part of our Services or included software, nor may you reverse engineer or
attempt to extract the source code of that software, unless laws prohibit those
restrictions or you have our written permission.

Some software used in our Services may be offered under an open source
license that we will make available to you.  There may be provisions in the
open source license that expressly override some of these terms.


### Modifying and Terminating our Services

We are constantly changing and improving our Services. We may add or remove
functionalities or features, and we may suspend or stop a Service
altogether.

You can stop using our Services at any time, although we'll be sorry to see
you go. Kandra Labs may also stop providing Services to you, or add or create new
limits to our Services at any time.

We believe that you own your data and preserving your access to such data is
important. If we discontinue a Service, we will, if it is practical in our sole
discretion, give you reasonable advance notice and a chance to get information
out of that Service.


### Our Warranties and Disclaimers

We hope that you will enjoy using our Services, but there are certain things
that we don't promise about our Services.

OTHER THAN AS EXPRESSLY SET OUT IN THESE TERMS, NEITHER KANDRA LABS NOR ITS
SUPPLIERS OR DISTRIBUTORS MAKE ANY SPECIFIC PROMISES ABOUT THE SERVICES.  FOR
EXAMPLE, WE DON'T MAKE ANY COMMITMENTS ABOUT THE CONTENT WITHIN THE SERVICES,
THE SPECIFIC FUNCTION OF THE SERVICES, OR THEIR RELIABILITY, AVAILABILITY, OR
ABILITY TO MEET YOUR NEEDS. WE PROVIDE THE SERVICES "AS IS".

SOME JURISDICTIONS PROVIDE FOR CERTAIN WARRANTIES, LIKE THE IMPLIED WARRANTY
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. TO
THE EXTENT PERMITTED BY LAW, WE EXCLUDE ALL WARRANTIES.


### Liability for our Services

WHEN PERMITTED BY LAW, KANDRA LABS, AND KANDRA LABS'S SUPPLIERS AND DISTRIBUTORS, WILL
NOT BE RESPONSIBLE FOR LOST PROFITS, REVENUES, OR DATA, FINANCIAL LOSSES OR
INDIRECT, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES.

TO THE EXTENT PERMITTED BY LAW, THE TOTAL LIABILITY OF KANDRA LABS, AND ITS
SUPPLIERS AND DISTRIBUTORS, FOR ANY CLAIM UNDER THESE TERMS, INCLUDING FOR ANY
IMPLIED WARRANTIES, IS LIMITED TO THE GREATER OF FIVE DOLLARS ($5) OR THE
AMOUNT PAID BY YOU TO KANDRA LABS FOR THE PAST THREE MONTHS OF THE SERVICES IN
QUESTION.

IN ALL CASES, KANDRA LABS, AND ITS SUPPLIERS AND DISTRIBUTORS, WILL NOT BE LIABLE
FOR ANY LOSS OR DAMAGE THAT IS NOT REASONABLY FORESEEABLE.


### Business uses of our Services

If you are using our Services on behalf of a business, that business accepts
these terms. It will hold harmless and indemnify Kandra Labs and its affiliates,
officers, agents, and employees from any claim, suit or action arising from or
related to the use of the Services or violation of these terms, including any
liability or expense arising from claims, losses, damages, suits, judgments,
litigation costs and attorneys' fees.

You agree that we, in our sole discretion, may use your trade names,
trademarks, service marks, logos, domain names and other distinctive brand
features in presentations, marketing materials, customer lists, financial
reports and Web site listings (including links to your website) for the purpose
of advertising or publicizing your use of our products or services.

### Export Compliance

If you are located outside of the United States or are not a U.S. person,
you certify that you do not reside in Cuba, Iran, North Korea, Sudan, or Syria,
and you certify the following: "We certify that this beta test software will
only be used for beta testing purposes, and will not be rented, leased, sold,
sublicensed, assigned, or otherwise transferred. Further, we certify that we
will not transfer or export any product, process, or service that is the direct
product of the beta test software."


### About these Terms

If it turns out that a particular term is not enforceable, this will not
affect any other terms.

If you do not comply with these terms, and we don't take action right away,
this doesn't mean that we are giving up any rights that we may have (such as
taking action in the future).

These terms control the relationship between Kandra Labs and you. They do not
create any third party beneficiary rights.

The laws of California, U.S.A., excluding California's conflict of
laws rules, will apply to any disputes arising out of or relating to these
terms or the Services. All claims arising out of or relating to these terms or
the Services will be litigated exclusively in the applicable federal or state
courts of California, and you and Kandra Labs consent to personal jurisdiction in
those courts.

Kandra Labs reserves the right to amend or modify these terms at any time and in
any manner by providing reasonable notice to you. You agree that reasonable
notice may be provided by posting on Kandra Labs's web site, email, or other written
notice.   By continuing to access or use the Services after revisions become
effective, you agree to be bound by the revised terms. If you do not agree to
the new terms, please stop using the Services.

These terms constitute the whole legal agreement between you and Kandra Labs, and
completely replace any prior agreements between you and Kandra Labs in relation to
the Services.

Last modified: May 7, 2021
```

--------------------------------------------------------------------------------

````
