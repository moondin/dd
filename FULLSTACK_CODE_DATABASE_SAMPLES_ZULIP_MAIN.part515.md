---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 515
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 515 of 1290)

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

---[FILE: security.md]---
Location: zulip-main/templates/corporate/security.md

```text
We take the trust our users put in Zulip extremely seriously. Our security model
is designed to be:

- **Secure by default**: Your data is protected out-of-the-box.
- **Well-documented** and **easy to understand**, so that you’re never caught by
  surprise.
- **Flexible**, so that you can configure Zulip according to your organization’s
  needs.

This page will walk you Zulip's security tools and practices:

- [Compliance support](#zulip-serves-your-compliance-needs)
- [Data encryption](#data-is-encrypted-for-your-protection)
- [Tools to protect your data when you self-host](#self-hosting-we-give-you-the-tools-to-protect-your-data)
- [How we keep your organization secure on Zulip Cloud](#zulip-cloud-we-keep-your-organization-secure)
- [Zulip's robust 100% open-source system](#robust-100-open-source-system)
- [Highly configurable access controls](#highly-configurable-access-controls)
- [Our responsible vulnerability disclosure program](#responsible-disclosure-program)

---

## Zulip serves your compliance needs

- [GDPR and CCPA compliant](https://zulip.com/help/gdpr-compliance)
- Self-hosting facilitates HIPAA and FERPA compliance
- [Message editing and deletion policies](/help/restrict-message-editing-and-deletion)
- [Global and per-channel data retention policies](/help/message-retention-policy)
- Detailed audit log of administrative actions
- [Complete data exports](/help/export-your-organization)
- [Compliance exports](https://zulip.readthedocs.io/en/stable/production/export-and-import.html#compliance-exports)

---

## Data is encrypted for your protection

### Secure data transmission

All Zulip clients require [TLS
encryption](https://zulip.readthedocs.io/en/stable/production/ssl-certificates.html)
and authentication over HTTPS for data transmission to and from the server, both
on LAN and the Internet.

### End-to-end encryption for push notification content

You can [require end-to-end
encryption](https://zulip.com/help/mobile-notifications#end-to-end-encryption-e2ee-for-mobile-push-notifications)
for message content in mobile push notifications. If you do, content will be
omitted when sending notifications to an app that doesn't support end-to-end
encryption.

### Secure integrations
[Integrations](/integrations/) use TLS encryption and authentication over HTTPS
for data transmission. Administrators can browse,
[manage](https://zulip.com/help/manage-a-bot), and
[deactivate](https://zulip.com/help/deactivate-or-reactivate-a-bot)
integrations.

---

## Self-hosting: We give you the tools to protect your data

### Support for encryption in transit and at rest

Encrypt your database, uploads, and backups at rest on infrastructure you
control. All connections between parts of the Zulip system are secured
out-of-the-box with encryption, a protected network like a local socket, or
both. All of the inter-service connections are also authenticated, to provide a
defensive-by-default security posture, and prevent SSRF attacks.

### Firewalled and air-gapped deployments

Zulip can be hosted entirely behind your firewall, or on an air-gapped network.

### Custom security policies

- [Configurable](https://zulip.readthedocs.io/en/stable/production/authentication-methods.html#email-and-password)
  password strength requirements.
- Administrators can revoke and reset any user’s credentials.
- Configurable [session
  length](https://github.com/zulip/zulip/search?q=SESSION_COOKIE_AGE&type=code)
  and [idle
  timeouts](https://github.com/zulip/zulip/search?q=SESSION_EXPIRE_AT_BROWSER_CLOSE&type=code).
- Configurable log rotation policies.
- [Configurable rate
  limits](https://zulip.readthedocs.io/en/stable/production/securing-your-zulip-server.html#understand-zulip-s-rate-limiting-system)
  for API endpoints and authentication attempts.

---

## Zulip Cloud: We keep your organization secure

- All customer data is encrypted in transit and at rest.
- [Strong
  passwords](https://zulip.readthedocs.io/en/stable/production/password-strength.html)
  are required with the zxcvbn password strength checker.
- Users can [rotate](https://zulip.com/help/protect-your-account) their account
  credentials.
- To protect your privacy, error handling systems exclude user message content
  in reports.
- Data and server access is limited to a very small number of staff.

---

## Robust 100% open-source system

Your security team and independent security researchers have access to [Zulip’s
entire codebase](https://github.com/zulip), and can thus fully audit the system
for security issues. We are proud of our industry-leading efforts to prevent
security issues from being introduced in Zulip.

### Development process

- **Comprehensive automated testing**: The Zulip server has an remarkably
  complete automated test suite, including [complete test
  coverage](https://app.codecov.io/gh/zulip/zulip/tree/main/zerver) in
  security-sensitive code paths.
- **Stable, carefully audited APIs**: All clients share a common, highly stable
  [API](https://zulip.com/api/). API changes are carefully reviewed for security
  and necessity, and documented in a [readable API
  changelog](https://zulip.com/api/changelog).
- **Disciplined code review:** Zulip is known for its unusually disciplined
  [code review
  process](https://zulip.readthedocs.io/en/latest/contributing/review-process.html),
  ensuring that all changes are carefully verified by our maintainer team.

### System design

- **Static typing**: The Zulip server
  [pioneered](https://blog.zulip.org/2016/10/13/static-types-in-python-oh-mypy/)
  statically typed Python. Extensive use of both standard and custom linters
  helps prevent several classes of common security bugs.
- **Access control**: Access to user data (messages, channels, uploaded files,
  etc.) in the Zulip server is mediated through carefully-audited core libraries
  that consistently validate access controls.
- **Minimizing supply chain risk:** Dependencies are evaluated for quality,
  maintainability, and necessity before being integrated into the system.

---

## Highly configurable access controls

### Identity management your way

- [Email authentication](/help/invite-users-to-join), with option to [restrict
  email
  domains](/help/restrict-account-creation#configuring-email-domain-restrictions)
- [OAuth social logins](/help/configure-authentication-methods) (Google, GitHub,
  GitLab, Apple)
- SSO with [SAML](/help/saml-authentication) (Including Okta and OneLogin),
  [Microsoft Entra
  ID](https://zulip.readthedocs.io/en/stable/production/authentication-methods.html#microsoft-entra-id),
  [OpenID
  Connect](https://zulip.readthedocs.io/en/stable/production/authentication-methods.html#openid-connect)
- [AD/LDAP user and group
  sync](https://zulip.readthedocs.io/en/stable/production/authentication-methods.html#ldap-including-active-directory)
- [SAML user and group sync](/help/saml-authentication)
- [SCIM user and group sync](/help/scim)
- Configure whether users can change their
  [names](/help/restrict-name-and-email-changes), [email
  addresses](/help/restrict-name-and-email-changes), and
  [avatars](/help/restrict-profile-picture-changes)
- [Minimum app
  version](https://zulip.readthedocs.io/en/latest/overview/release-lifecycle.html#desktop-app)
  for the desktop app
- [100+ authentication
  options](https://python-social-auth.readthedocs.io/en/latest/backends/index.html#social-backends)
  with python-social-auth (self-hosted)

### Configure data access and messaging policies

- [Private channels with shared history](/help/channel-permissions#private-channels)
- [Private channels with private history](/help/channel-permissions#private-channels)
- [Channel posting permissions](/help/channel-posting-policy)
- [Direct messaging permissions](/help/restrict-direct-messages)
- [Customize permissions by channel](/help/channel-permissions)
- Authenticated access to uploaded files
- [Custom terms of service and privacy
  policy](https://zulip.readthedocs.io/en/stable/production/settings.html#terms-of-service-and-privacy-policy)
- [Configurable waiting period](/help/restrict-permissions-of-new-members) for new users

### Custom permissions with comprehensive audit log

- [Role-based access control](/help/user-roles)
- Control access by [roles](/help/user-roles), [custom
  groups](/help/user-groups), and user accounts
- Grant [permissions](/help/manage-permissions) to roles, custom groups, and
  individual users
- [Control](/help/manage-permissions) who can create channels, subscribe and
  unsubscribe users, add custom emoji and integrations, and more
- Permissions for [editing](/help/restrict-message-editing-and-deletion),
  [deleting](/help/restrict-message-editing-and-deletion) and
  [moving](/help/restrict-moving-messages) messages, and an audit history of
  these actions
- Permanent long-term audit log of important actions (e.g., changes to
  passwords, email addresses, and channel subscriptions)

### Tightly controlled guest accounts for vendors, partners, and customers

[Guest users](/help/guest-users) cannot see any channels, unless they have been
specifically subscribed, and can never invite new users. You can limit guests’
ability to see other users, and warn users when they are DMing a guest to
prevent accidental disclosures.

---

## Responsible disclosure program

- We operate a private HackerOne vulnerability disclosure program, and credit
  reporters for issues that were not discovered internally. See the [Zulip
  security reporting policy](https://github.com/zulip/zulip/security/policy).
- We publish security releases for all security vulnerabilities, and publicly
  disclose them [on our blog](https://blog.zulip.com/tag/security/) with CVE
  numbers for tracking.
- Zulip Server security and maintenance releases are carefully engineered to
  minimize the inherent risks of upgrading software, so there is never a reason
  to run an insecure version. Announcements of serious vulnerabilities
  [include](https://blog.zulip.com/2025/07/02/zulip-server-10-4-security-release/)
  applicable mitigation guidance.
- We responsibly report vulnerabilities we discover in our upstream
  dependencies.

---

## Learn more

For more information, check out our [guide on securing your Zulip
server](https://zulip.readthedocs.io/en/stable/production/securing-your-zulip-server.html).
```

--------------------------------------------------------------------------------

---[FILE: self-hosting.html]---
Location: zulip-main/templates/corporate/self-hosting.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Self-host Zulip" %}

{% set PAGE_DESCRIPTION = "Open-source team chat with enterprise-grade
  reliability and security. Take charge of your mission-critical communication
  platform." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page self-hosting-page">
    <div class="hero bg-pycon security">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Self-host Zulip today.</h1>
            <p>Open-source team chat with enterprise-grade reliability and security.</p>
        </div>
        <div class="hero-buttons center">
            <a href="/request-demo/" class="button">
                {{ _('Get a demo') }}
            </a>
            <a href="https://zulip.readthedocs.io/en/stable/production/install.html" class="button">
                Install Zulip Server {{ latest_release_version }}
            </a>
            <a href="/for/business/" class="button">
                {{ _('Zulip for business') }}
            </a>
        </div>
    </div>

    <div class="alternative-features">
        <div class="feature-container">
            <div class="feature-half">
                <div class="feature-text">
                    <h1>
                        100% open-source software.
                    </h1>
                    <p>
                        When you self-host Zulip, you get <a href="https://github.com/zulip/zulip#readme">
                        the same software</a> as our <a href="/plans/">Zulip Cloud</a> customers.
                    </p>
                    <p>
                        Unlike the competition, you don't pay for
                        <a href="https://zulip.readthedocs.io/en/stable/production/authentication-methods.html">SAML
                            authentication</a>, <a href="https://zulip.readthedocs.io/en/stable/production/authentication-methods.html#synchronizing-data">LDAP
                        sync</a>, or advanced <a href="/help/user-roles">roles</a> and <a href="/help/manage-permissions">permissions</a>. There
                        is no “open core” catch — just freely available world-class software.
                    </p>
                </div>
            </div>
            <div class="feature-half">
                <div class="feature-icon">
                    <img alt="" src="{{ static('images/landing-page/open_source/build_inclusive_communities.svg') }}" />
                </div>
            </div>
        </div>

        <div class="feature-container alternate-grid">
            <div class="feature-half md-hide">
                <div class="feature-icon">
                    <img class="mirror-image" alt="" src="{{ static('images/landing-page/education/privacy.svg') }}" />
                </div>
            </div>
            <div class="feature-half">
                <div class="feature-text">
                    <h1>
                        Enterprise-grade security and compliance.
                    </h1>
                    <p>
                        Protect your sensitive conversations and simplify
                        compliance by self-hosting Zulip behind your
                        firewall.
                    </p>
                    <p>
                        Zulip's <a
                        href="/help/configure-authentication-methods">authentication</a>
                        and <a
                        href="/help/manage-permissions">permissions</a>
                        systems are designed to flexibly support every
                        organization's security tools and policies.
                    </p>
                    <p>Making sure your information stays protected is <a href="https://zulip.com/security/">our highest priority</a>.</p>
                </div>
            </div>
            <div class="feature-half md-display">
                <div class="feature-icon">
                    <img class="mirror-image" alt="" src="{{ static('images/landing-page/education/privacy.svg') }}" />
                </div>
            </div>
        </div>

        <div class="feature-container">
            <div class="feature-half">
                <div class="feature-text">
                    <h1>
                        Take charge of your mission-critical communication platform.
                    </h1>
                    <p>
                        Keep full control of your data and avoid <a
                        href="https://www.theverge.com/2021/9/30/22702876/slack-is-down-outage-morning-disruption-work-chat">
                        unpredictable downtime</a>
                        from <a
                        href="https://www.theverge.com/2021/4/27/22405300/microsoft-teams-down-outage-worldwide-issues">SaaS
                        team chat vendors</a> by hosting Zulip on
                        your own infrastructure.
                    </p>
                    <p>
                        Our extensive <a
                        href="https://zulip.readthedocs.io/en/stable/production/settings.html">
                        configuration options</a> let you set up Zulip
                        to suit the needs of your organization.
                        Zulip offers <a
                        href="/integrations/">over one hundred native
                        integrations</a>, and hundreds more via third-party
                        extensions.
                    </p>
                </div>
            </div>
            <div class="feature-half">
                <div class="feature-icon">
                    <img class="mirror-image" alt="" src="{{ static('images/landing-page/education/mobile.svg') }}" />
                </div>
            </div>
        </div>

        <div class="feature-container alternate-grid">
            <div class="feature-half md-hide">
                <div class="feature-icon">
                    <img alt="" src="{{ static('images/landing-page/education/flexible-administration.svg') }}" />
                </div>
            </div>
            <div class="feature-half">
                <div class="feature-text">
                    <h1>
                        Installation and upgrades that Just Work.
                    </h1>
                    <p>
                        Our well-documented scripts help you
                        <a href="https://zulip.readthedocs.io/en/stable/production/install.html">setup</a>,
                        <a href="https://zulip.readthedocs.io/en/stable/production/export-and-import.html#backups">backup</a>, and
                        <a href="https://zulip.readthedocs.io/en/stable/production/upgrade.html">upgrade</a>
                        your self-hosted Zulip installation. Migrate your
                        <a href="/help/migrating-from-other-chat-tools">data</a>
                        and <a href="/integrations/slack_incoming">integrations</a>
                        from other chat tools for a smooth transition.
                    </p>
                    <p>
                        Self-host Zulip directly on Ubuntu or Debian Linux,
                        in <a href="https://github.com/zulip/docker-zulip">Docker</a>,
                        or with prebuilt images for <a href="https://marketplace.digitalocean.com/apps/zulip">Digital Ocean</a>
                        and <a href="https://render.com/docs/deploy-zulip">Render</a>.
                    </p>
                    <div class="intro_quote quote-in-feature-text">
                        <blockquote>
                            Zulip was quite easy to set up, and worked instantly. 1000 people — no problem.
                            <div class="author">
                                &mdash;  Erik Dittert, Head of IT at <a href="/case-studies/gut-contact/">GUT contact</a>
                            </div>
                        </blockquote>
                    </div>
                </div>
            </div>
            <div class="feature-half md-display">
                <div class="feature-icon">
                    <img alt="" src="{{ static('images/landing-page/education/flexible-administration.svg') }}" />
                </div>
            </div>
        </div>
    </div>

    <div class="quote">
        <div class="triangle"></div>
        <blockquote>
            Zulip has been extremely stable and requires no maintenance beyond installing updates.
            <div class="author">
                &mdash;  Robert Imschweiler, <a href="/case-studies/tum/">Technical University of Munich</a>
            </div>
        </blockquote>
    </div>

    <div class="feature-grid">
        <div class="feature-row">
            <div class="feature-box">
                <div class="feature-icon">
                    <img alt="" src="{{ static('images/landing-page/self-hosting/growth.png') }}" />
                </div>
                <div class="feature-text">
                    <h1>
                        Rock-solid reliability at scale.
                    </h1>
                    <p>
                        Zulip is engineered to make every interaction snappy and
                        efficient, even for organizations with 10,000s of users,
                        with a simple deployment on
                        <a href="https://zulip.readthedocs.io/en/stable/production/requirements.html#scalability">
                        modest hardware</a>.
                    </p>
                    <p>
                        With a user experience designed to work great at any
                        size, organizations that send <a
                        href="/case-studies/rust/">thousands</a> of <a
                        href="/case-studies/tum/">messages</a> per week <a
                        href="/case-studies/lean/">thrive on Zulip</a>.
                    </p>
                </div>
            </div>
            <div class="feature-box">
                <div class="feature-icon">
                    <img alt="" src="{{ static('images/landing-page/self-hosting/database.png') }}" />
                </div>
                <div class="feature-text">
                    <h1>
                        No lock-in.
                    </h1>
                    <p>
                        You can <a href="https://zulip.com/help/zulip-cloud-or-self-hosting">move
                        freely</a> between <a href="/plans/">Zulip Cloud</a>
                        hosting and your own servers with our high quality <a
                        href="/help/export-your-organization">export</a> and
                        <a href="https://zulip.readthedocs.io/en/stable/production/export-and-import.html">import
                        </a> tools.
                    </p>
                    <p>
                        Zulip also supports exporting your organization's
                        message history to a <a
                        href="https://github.com/zulip/zulip-archive">static
                        HTML archive</a>.
                    </p>
                </div>
            </div>
        </div>
        <div class="feature-row">
            <div class="feature-box">
                <div class="feature-icon">
                    <img alt="" src="{{ static('images/landing-page/self-hosting/fork.png') }}" />
                </div>
                <div class="feature-text">
                    <h1>
                        Yours to customize.
                    </h1>
                    <p>
                        <a href="/api/incoming-webhooks-overview">Creating custom integrations</a> is a breeze with
                        our well-documented <a href="/api/">REST API</a>.
                    </p>
                    <p>
                        Zulip makes it easy to
                        <a href="https://zulip.readthedocs.io/en/stable/production/modify.html">
                        maintain a fork</a> with customized features, with 225,000 words of documentation for
                        system administrators and developers.
                    </p>
                </div>
            </div>
            <div class="feature-box">
                <div class="feature-icon">
                    <img alt="" src="{{ static('images/landing-page/self-hosting/help.png') }}" />
                </div>
                <div class="feature-text">
                    <h1>
                        Amazing support experience.
                    </h1>
                    <p>
                        We love getting feedback! Stop by <a href="/development-community/">our friendly
                        development community</a> to ask for help or suggest
                        improvements.
                    </p>
                    <p>
                        A variety of support services are available for Zulip
                        Business and Zulip Enterprise customers. Contact <a
                        href="mailto:sales@zulip.com">sales@zulip.com</a> with
                        any questions.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="portico-pricing showing-self-hosted">
        {% with %}
        {% set rendering_page="self_hosting" %}
        {% include "corporate/pricing_model.html" %}
        {% endwith %}
    </div>

</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: team.html]---
Location: zulip-main/templates/corporate/team.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "The Zulip team" %}

{% set PAGE_DESCRIPTION = "Zulip has the most active open-source
development community of any team chat software, with over 1,500 code
contributors, and 97+ people with 100+ commits." %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page">
    <div class="hero bg-pycon drone">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">The Zulip team</h1>
            <p>Learn about the people behind Zulip!</p>
        </div>
    </div>

    <div class="main">
        <div class="padded-content markdown">
            <div class="inner-content team">
                <p>
                    Over 1,500 people have contributed to the Zulip
                    codebase, from high school students to 30 year
                    industry veterans, from people launching new careers
                    to people looking for community. Meet the team
                    below!
                </p>

                <h1 id="the-core-team">The core team at Kandra Labs</h1>
                <div class="team-profiles">
                    <!-- Tim -->
                    <div class="profile bdfl">
                        <div class="profile-picture">
                            <img src="{{ static('images/landing-page/team/tim.png') }}" alt="" />
                        </div>
                        <div class="profile-information">
                            <div class="profile-name">Tim Abbott</div>
                            <div class="profile-role">Founder and project leader</div>
                            <div class="profile-description">
                                <p>
                                    Before Zulip, Tim was a founder and CTO of
                                    Ksplice, which provided rebootless linux
                                    kernel updates (a feat many previously thought
                                    impossible) to over 100,000 production
                                    servers. He was also the youngest ever
                                    Architect at Oracle, one of the most senior
                                    engineers at Dropbox and has been active in
                                    the open source community for over a
                                    decade. Tim has three degrees from MIT, and
                                    lives in San Francisco with his wife and
                                    three daughters.
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
                <p>
                    Kandra Labs provides commercial Zulip hosting and on-premises support
                    at <a href="https://zulip.com/plans/">https://zulip.com</a>,
                    and employs the core developers of the project. It was
                    started in June 2016 to help sustain the growth of the Zulip
                    project. Kandra Labs is funded by
                    an <a href="https://seedfund.nsf.gov/">SBIR grant</a> from
                    the US National Science Foundation.
                </p>

                <!-- Contributors -->
                <h1 id="our-amazing-community">Our amazing community</h1>
                <p>
                    While the team at Kandra Labs provides important
                    leadership, Zulip is built by an incredible
                    distributed community of developers from all
                    around the world.  You can read about
                    the <a href="/history/">project's history</a> if
                    you want to learn more about Zulip's origins.
                </p>
                <p>
                    Here, we recognize the top contributors to the
                    Zulip project on GitHub.  Zulip's community
                    is unusual in how many people outside the core
                    team have made major contributions to the project.
                </p>

                <div class="contributors-list">
                    <input id="total" type="radio" name="tabs" checked />
                    <label for="total"><i class="zulip-icon zulip-icon-globe" aria-hidden="true"></i>&nbsp; Total</label>

                    <input id="server" type="radio" name="tabs" />
                    <label for="server"><i class="fa fa-server" aria-hidden="true"></i>&nbsp; Server & Web</label>

                    <input id="desktop" type="radio" name="tabs" />
                    <label for="desktop"><i class="fa fa-desktop" aria-hidden="true"></i>&nbsp; Desktop</label>

                    <input id="mobile" type="radio" name="tabs" />
                    <label for="mobile"><i class="fa fa-mobile" aria-hidden="true"></i>&nbsp; Mobile</label>

                    <input id="terminal" type="radio" name="tabs" />
                    <label for="terminal"><i class="fa fa-terminal" aria-hidden="true"></i>&nbsp; Terminal</label>

                    <input id="api-clients" type="radio" name="tabs" />
                    <label for="api-clients"><i class="fa fa-code" aria-hidden="true"></i>&nbsp; Integrations</label>

                    <input id="devtools" type="radio" name="tabs" />
                    <label for="devtools"><i class="fa fa-at" aria-hidden="true"></i>&nbsp; Devtools</label>
                    <div id="tab-total" class="contributors">
                        <div class="contributors-grid"></div>
                    </div>
                    <div id="tab-server" class="contributors">
                        <div class="contributors-grid"></div>
                    </div>
                    <div id="tab-desktop" class="contributors">
                        <div class="contributors-grid"></div>
                    </div>
                    <div id="tab-mobile" class="contributors">
                        <div class="contributors-grid"></div>
                    </div>
                    <div id="tab-terminal" class="contributors">
                        <div class="contributors-grid"></div>
                    </div>
                    <div id="tab-api-clients" class="contributors">
                        <div class="contributors-grid"></div>
                    </div>
                    <div id="tab-devtools" class="contributors">
                        <div class="contributors-grid"></div>
                    </div>
                </div>

                <!-- Compiled using lodash -->
                <script type="text/template" id="contributors-template">
                    <div class="person">
                        <a href="<%= profile_url %>" target="_blank" rel="noopener noreferrer" class="no-underline">
                            <div class="avatar">
                                <img class="avatar_img" src="<%= avatar %>" alt="{{ _('Avatar') }}" />
                            </div>
                            <div class='info'>
                                <b><%= name %></b><br />
                                <%= commits %> <%= commits === 1 ? 'commit' : 'commits' %>
                            </div>
                        </a>
                    </div>
                </script>

                <script type="text/template" id="loading-template">
                    <p class="tab-loading">
                        Loading…
                    </p>
                </script>

                <script type="text/template" id="total-count-template">
                    <p class="contributor-count">
                        <%= contributor_count %> total contributors
                        (<%= hundred_plus_contributor_count %> with 100+ commits;
                         <%= twenty_plus_contributor_count %> with 20+ commits)
                    </p>
                </script>

                <script type="text/template" id="count-template">
                    <p class="contributor-count">
                        <%= contributor_count %> contributors
                        (<%= hundred_plus_contributor_count %> with 100+ commits) to
                        <% repo_list.forEach(function(repo_name, index) { %>
                        <a href="<%= repo_url_list[index] %>" target="_blank" rel="noopener noreferrer">
                            zulip/<%= repo_name %><% if (index < repo_list.length - 1) { %>, <% } %>
                        </a>
                            <% }); %>
                    </p>
                </script>

                <p class="last-updated">
                    Last updated: {{ date }}. <a href="https://zulip.readthedocs.io/en/latest/contributing/counting-contributions.html" target="_blank" rel="noopener noreferrer">Methodology</a>.
                </p>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: try-zulip-part1.md]---
Location: zulip-main/templates/corporate/try-zulip-part1.md

```text
You can check out the Zulip app by viewing the [Zulip development
community](https://chat.zulip.org/), where hundreds of participants collaborate
to improve Zulip. Many parts of the community are open for [public
access](/help/public-access-option), so you can start exploring without creating
an account.

You can:

- **Browse recent conversations**. You’ll see a list as soon as you open the
  app, and you can always get back to it by clicking on “Recent conversations”
  in the upper left.
- **Click on the name of a**
  [**channel**](/help/introduction-to-channels) on the left to open a
  list of recent conversation topics. For example, you can explore discussions
  of changes to the design of the Zulip app in
  [#design](https://chat.zulip.org/#narrow/channel/101-design), or see ongoing
  issue investigations in
  [#issues](https://chat.zulip.org/#narrow/channel/9-issues).
- **Click on each topic** in a channel to view conversations one at a time.
  Notice how Zulip makes it easy to have many conversations at once, without
  them getting in each other’s way.
```

--------------------------------------------------------------------------------

---[FILE: try-zulip-part2.md]---
Location: zulip-main/templates/corporate/try-zulip-part2.md

```text
To fully experience the Zulip app, we invite you to [create an
account](https://chat.zulip.org/join/t5crtoe62bpcxyisiyglmtvb/) in the
development community. You’ll be able to send messages, experience the
convenience of going through your unread messages, and much more.  Please be
sure to follow [community guidelines](/development-community/), and send any
test messages to the [#test
here](https://chat.zulip.org/#narrow/channel/7-test-here) channel.

You can also view <a href="/plans/">plans and pricing</a>, or create a <a
href="/new/">new organization</a>.
```

--------------------------------------------------------------------------------

---[FILE: values.html]---
Location: zulip-main/templates/corporate/values.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Zulip project values" %}

{% set PAGE_DESCRIPTION = "Learn about the values that are behind everything we
  do as we work to build the world’s best organized team chat software." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page">
    <div class="hero">
        <div class="content">
            <h1 class="center">Zulip project values</h1>
            <p>
                These values are behind everything we do as we <br />
                work to build the world’s best organized team chat.
            </p>
        </div>
    </div>
    <div class="main">
        <div class="padded-content">

            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/values.md') }}
            </div>

        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

````
