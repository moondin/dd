---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 514
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 514 of 1290)

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

---[FILE: plans.html]---
Location: zulip-main/templates/corporate/plans.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "plans-page" %}

{% set PAGE_TITLE = "Plans and pricing | Zulip" %}

{% set PAGE_DESCRIPTION = "Sign up for a managed cloud solution, or self-host our 100\x25 open-source software. Get started for free." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block content %}

{% if not is_self_hosted_realm %}
{% include 'zerver/landing_nav.html' %}
{% endif %}

<div class="portico-pricing plans {% if is_self_hosted_realm %} showing-self-hosted {% else %} showing-cloud {% endif %}">
    <div class="body-bg">
        <div class="body-bg__layer"></div>
    </div>
    <div class="main">
        {% include "corporate/pricing_model.html" %}
    </div>

    <!-- This is the subsection that displays with cloud plans. -->

    <div class="additional-pricing-information cloud-additional-pricing">
        <div id="cloud-sponsorships" class="discounts-section">
            <header>
                <h2>Sponsorship and discounts</h2>
                <p>
                    We sponsor over 1500 organizations.
                </p>
            </header>
            <div class="text-content">
                <div class="discounted-community-plan">
                    <h3>Free Standard plan <a href="/help/zulip-cloud-billing#free-and-discounted-zulip-cloud-standard">eligibility</a>
                    </h3>
                    <ul>
                        <li>
                            <span><a href="/for/open-source/">Open-source projects</a></span>
                        </li>
                        <li>
                            <span><a href="/for/research/">Research</a> in an academic setting</span>
                        </li>
                        <li>
                            <span>Academic conferences and other non-profit <a href="/for/events/">events</a></span>
                        </li>
                        <li>
                            <span>Most small non-profit organizations</span>
                        </li>
                        <li>
                            <span>Most <a href="/for/communities/">communities</a> when the Free plan is not an option</span>
                        </li>
                    </ul>
                </div>
                <div class="discounted-business-plan">
                    <h3>Special <a href="/help/zulip-cloud-billing#free-and-discounted-zulip-cloud-standard">discounted pricing</a></h3>
                    <ul>
                        <li>
                            <span><a href="/for/education/#feature-pricing">Education</a></span>
                        </li>
                        <li>
                            <span>Organizations based in the developing world</span>
                        </li>
                        <li>
                            <span>Most large non-profit organizations</span>
                        </li>
                        <li>
                            <span>Many organizations with special circumstances that make regular pricing unaffordable</span>
                        </li>
                    </ul>
                    <a href="{{ sponsorship_url }}" class="button sponsorship-button">Apply here</a>
                    <p class="contact-note">
                        Wondering if your organization will qualify, but not
                        ready to request sponsorship yet? E-mail us at <a
                        href="mailto:sales@zulip.com">sales@zulip.com</a>.
                    </p>
                </div>
            </div>
        </div>

        <div class="questions-section">
            <header>
                <h2>Other questions?</h2>
                <p>
                    See our <a href="/help/zulip-cloud-billing">billing help page</a> for
                    additional details.
                </p>
            </header>
            <div class="text-content">
                <ul>
                    <li>
                        <span><a href="/help/trying-out-zulip">How can I try out Zulip for free?</a></span>
                    </li>
                    <li>
                        <span><a href="/help/zulip-cloud-or-self-hosting">How do I choose between Zulip Cloud and self-hosting?</a></span>
                    </li>
                    <li>
                        <span><a href="/help/migrating-from-other-chat-tools">Can I import data from other chat tools?</a></span>
                    </li>
                    <li>
                        <span><a href="/help/zulip-cloud-billing#temporary-users-and-guests">Are there discounts for guest users?</a></span>
                    </li>
                    <li>
                        <span><a
                          href="/help/zulip-cloud-billing#how-does-having-10000-messages-of-search-history-on-zulip-cloud-free-work">How does limited search history on the Free plan work?</a></span>
                    </li>
                </ul>
                <p>
                    To discuss <b>enterprise pricing and services</b>, or for
                    any other questions, contact
                    <a href="mailto:sales@zulip.com">sales@zulip.com</a>.
                </p>
            </div>
        </div>
    </div>

    <!-- This is the subsection that displays with self-hosted plans. -->

    <div class="additional-pricing-information self-hosted-additional-pricing">
        <div id="self-hosted-sponsorships" class="discounts-section">
            <header>
                <h2>Sponsorship and discounts</h2>
                <p>
                    Contact <a href="mailto:sales@zulip.com">sales@zulip.com</a>
                    with any questions.
                </p>
            </header>
            <div class="text-content">
                <div class="discounted-community-plan">
                    <h3>Community plan <a href="/help/self-hosted-billing#free-community-plan">eligibility</a></h3>
                    <ul>
                        <li>
                            <span><a href="/for/open-source/">Open-source projects</a></span>
                        </li>
                        <li>
                            <span><a href="/for/research/">Research</a> in an academic setting</span>
                        </li>
                        <li>
                            <span>Academic conferences and other non-profit <a href="/for/events/">events</a></span>
                        </li>
                        <li>
                            <span>Many <a href="/for/education/">education</a> and non-profit organizations</span>
                        </li>
                        <li>
                            <span><a href="/for/communities/">Communities</a>
                                and personal organizations (clubs, groups of
                                friends, volunteer groups, etc.)</span>
                        </li>
                    </ul>
                    <div class="discounted-business-plan">
                        <h3>Special <a href="/help/self-hosted-billing#paid-plan-discounts">discounted pricing</a></h3>
                        <ul>
                            <li>
                                <span>Special <a href="/help/self-hosted-billing#education-pricing">education</a> and <a href="/help/self-hosted-billing#non-profit-pricing">non-profit</a> pricing</span>
                            </li>
                            <li>
                                <span>Organizations based in the developing world</span>
                            </li>
                            <li>
                                <span>Organizations where many users are not paid staff</span>
                            </li>
                            <li>
                                <span>Many organizations with special circumstances that make regular pricing unaffordable</span>
                            </li>
                        </ul>
                        {% if is_self_hosted_realm %}
                        <a href="{{ sponsorship_url }}" class="button sponsorship-button">Apply here</a>
                        {% else %}
                        <a href="/help/self-hosted-billing#free-community-plan" class="button sponsorship-button">
                            Log in to apply
                        </a>
                        {% endif %}
                    </div>
                </div>
            </div>
        </div>

        <div class="questions-section">
            <header>
                <h2>Other questions?</h2>
                <p>
                    See our <a href="/help/self-hosted-billing">billing help page</a> for
                    additional details.
                </p>
            </header>
            <div class="text-content">
                <ul>
                    <li>
                        <span><a href="/help/trying-out-zulip">How can I try out Zulip for free?</a></span>
                    </li>
                    <li>
                        <span><a href="/help/zulip-cloud-or-self-hosting">How do I choose between Zulip Cloud and self-hosting?</a></span>
                    </li>
                    <li>
                        <span><a href="/help/self-hosted-billing#paid-plan-details-and-upgrades">How
                        do I upgrade to a paid plan?</a></span>
                    </li>
                    <li>
                        <span><a
                        href="/help/self-hosted-billing#free-community-plan">How do I apply for the Community plan?</a></span>
                    </li>
                    <li>
                        <span><a href="/help/migrating-from-other-chat-tools">Can I import data from other chat tools?</a></span>
                    </li>
                </ul>
                <p>
                    Contact <a href="mailto:sales@zulip.com">sales@zulip.com</a>
                    with further questions or to discuss Enterprise pricing.
                </p>
            </div>
        </div>
    </div>

    <div id="feature-comparison-table">
        {% include "corporate/comparison_table_integrated.html" %}
    </div>

</div>

{% if not is_self_hosted_realm %}
{% include 'zerver/footer.html' %}
{% endif %}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: pricing_model.html]---
Location: zulip-main/templates/corporate/pricing_model.html

```text
<div id="plans-and-pricing" class="pricing-model {% if is_self_hosted_realm %}is-self-hosted-realm{% endif %}">
    <div class="padded-content">
        {% if is_self_hosted_realm %}
        <h1>Choose a plan</h1>
        {% else %}
        <h1>Zulip plans and pricing</h1>
        <div class="h1-subheader">
            You can <a href="https://zulip.com/help/zulip-cloud-or-self-hosting">move
                freely</a> between <a href="/zulip-cloud/">Zulip Cloud</a>
            hosting and your own servers with our high quality <a
                href="/help/export-your-organization">export</a> and
            <a href="https://zulip.readthedocs.io/en/stable/production/export-and-import.html">import
            </a> tools.
        </div>
        {% endif %}
        <div class="pricing-container">
            {% if is_self_hosted_realm %}
            <div class="cloud-plan-title inactive-pricing-tab">
                <h2>Zulip Cloud</h2>
                <p>
                    <a href="https://zulip.com/plans/">View Zulip Cloud plans and pricing</a>.
                </p>
            </div>
            {% else %}
            <div id="cloud" class="cloud-plan-title pricing-tab">
                <h2>Zulip Cloud</h2>
                <p>
                    Simple managed solution.<br />Always up to date.
                </p>
            </div>
            {% endif %}

            <div class="pricing-pane-scroll-container cloud-scroll">
                <div class="cloud-plan-pricing pricing-pane">
                    <div class="price-box" tabindex="-1">
                        <div class="text-content">
                            <h2>Free</h2>
                            <ul class="feature-list">
                                <li><span>10,000 messages of search history</span></li>
                                <li><span>File storage up to 5 GB total</span></li>
                                <li><span><a href="{{ billing_base_url }}/plans/#cloud-plan-comparison">Complete</a> team chat solution</span></li>
                                <li><span><a href="/integrations/">Hundreds of integrations</a></span></li>
                                <li><span>Advanced <a href="/help/user-roles">roles</a> and <a href="/help/manage-permissions">permissions</a></span></li>
                                <li><span><a href="/help/guest-users">Guest</a>
                                accounts</span></li>
                                <li><span>Many organizations are eligible for a <a href="{{ billing_base_url }}/plans/#cloud-sponsorships">free Standard plan</a></span></li>
                            </ul>
                        </div>
                        <div class="bottom">
                            <div class="text-content">
                                {% if is_cloud_realm and on_free_tier %}
                                <div class="pricing-details"></div>
                                <a href='/upgrade/' class="button current-plan-button" type="button">
                                    <i class="icon current-plan-icon"></i>
                                    Current plan
                                </a>
                                {% elif not is_cloud_realm or is_new_customer %}
                                <a href="/new/" class="button get-started-button">
                                    Create organization
                                </a>
                                {% endif %}
                            </div>
                        </div>
                    </div>
                    <div class="price-box" tabindex="-1">
                        <div class="text-content">
                            <h2>Standard</h2>
                            <ul class="feature-list">
                                <li><span>Unlimited search history</span></li>
                                <li><span>File storage up to 5 GB per user</span></li>
                                <li><span>Flexible permissions with <a href="/help/user-groups">custom groups</a></span></li>
                                <li><span><a href="/help/message-retention-policy">Message retention policies</a></span></li>
                                <li><span>Brand Zulip with your logo</span></li>
                                <li><span>Priority commercial support</span></li>
                                <li><span><a href="/help/public-access-option">Public access option</a></span></li>
                            </ul>
                        </div>
                        <div class="bottom">
                            <div class="text-content">
                                <div class="standard-price-box">
                                    <div class="price"><span class="currency-symbol">$</span>6.67</div>
                                    <div class="details">
                                        <p>
                                            /user/month billed annually
                                            or&nbsp;<b>$8</b>&nbsp;billed monthly
                                        </p>
                                    </div>
                                </div>
                                {% if is_cloud_realm and on_free_tier and not sponsorship_pending %}
                                <a href="/upgrade/?tier={{ tier_cloud_standard }}" class="button upgrade-button">
                                    {% if free_trial_days %}
                                    Start {{ free_trial_days }}-day free trial
                                    {% else %}
                                    Upgrade to Standard
                                    {% endif %}
                                </a>
                                <!-- Sponsored realm may not have customer plan. -->
                                {% elif (is_cloud_realm and is_sponsored) or (customer_plan and customer_plan.tier == customer_plan.TIER_CLOUD_STANDARD) %}
                                <a href='/billing' class="button current-plan-button" type="button">
                                    <i class="icon current-plan-icon"></i>
                                    {% if on_free_trial %}
                                    Current plan (free trial)
                                    {% else %}
                                    Current plan
                                    {% endif %}
                                </a>
                                {% elif is_cloud_realm and sponsorship_pending %}
                                <a href="/billing/" class="button current-plan-button" type="button">
                                    Sponsorship requested
                                </a>
                                {% elif customer_plan and customer_plan.tier != customer_plan.TIER_CLOUD_STANDARD %}
                                <a href="mailto:sales@zulip.com" target="_blank" rel="noopener noreferrer" class="button upgrade-button">
                                    Contact sales
                                </a>
                                {% else %}
                                <a href="/upgrade/?tier={{ tier_cloud_standard }}" class="button upgrade-button">
                                    {% if free_trial_days %}
                                    Start {{ free_trial_days }}-day free trial
                                    {% else %}
                                    Upgrade to Standard
                                    {% endif %}
                                </a>
                                {% endif %}
                            </div>
                        </div>
                    </div>
                    <div class="price-box" tabindex="-1">
                        <div class="text-content">
                            <h2 class="with-fine-print">Plus <small>10 users minimum</small></h2>
                            <ul class="feature-list">
                                <li><span>All Standard plan features</span></li>
                                <li><span>File storage up to 25 GB per user</span></li>
                                <li><span><a href="/help/saml-authentication">SSO with SAML</a> (Okta, OneLogIn, etc.)</span></li>
                                <li><span><a href="/help/scim">SCIM user and group sync</a></span></li>
                                <li><span><a href="/help/change-organization-url">Custom domain</a></span></li>
                                <li><span>Limit user list access for <a href="/help/guest-users">guests</a></span></li>
                                <li><span>Priority commercial support</span></li>
                            </ul>
                        </div>
                        <div class="bottom">
                            <div class="text-content">
                                <div class="standard-price-box">
                                    <div class="price"><span class="currency-symbol">$</span>10</div>
                                    <div class="details">
                                        <p>
                                            /user/month billed annually
                                            <br />
                                            or&nbsp;<b>$12</b>&nbsp;billed monthly
                                        </p>
                                    </div>
                                </div>
                                {% if customer_plan and customer_plan.tier == customer_plan.TIER_CLOUD_PLUS %}
                                <a href='/billing' class="button current-plan-button" type="button">
                                    <i class="icon current-plan-icon"></i>
                                    Current plan
                                </a>
                                {% elif customer_plan and customer_plan.tier != customer_plan.TIER_CLOUD_PLUS %}
                                <a href="mailto:sales@zulip.com" target="_blank" rel="noopener noreferrer" class="button upgrade-button">
                                    Contact sales
                                </a>
                                {% else %}
                                <a href="/upgrade/?tier={{ tier_cloud_plus }}" class="button upgrade-button">
                                    Upgrade to Plus
                                </a>
                                {% endif %}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="self-hosted" class="self-hosted-plan-title pricing-tab">
                <h2>Self-hosted</h2>
                <p>
                    Retain full control over your data.<br />100% open-source software.
                </p>
            </div>

            <div class="pricing-pane-scroll-container self-hosted-scroll">
                <div class="self-hosted-plan-pricing pricing-pane">
                    <div class="price-box" tabindex="-1">
                        <div class="text-content">
                            <h2>Free</h2>
                            <ul class="feature-list">
                                <li><span>Complete team chat solution, with <a href="{{ billing_base_url }}/plans/#self-hosted-plan-comparison">all Zulip features</a> included</span></li>
                                <li><span><a href="https://zulip.readthedocs.io/en/stable/production/mobile-push-notifications.html">Mobile notifications</a> for organizations with up to 10&nbsp;users</span></li>
                                <li><span>Many organizations are eligible for unlimited mobile notifications on the <a href="{{ billing_base_url }}/plans/#self-hosted-sponsorships">free Community plan</a></span></li>
                            </ul>
                        </div>
                        <div class="bottom">
                            <div class="text-content">
                                <div class="standard-price-box">
                                    <div class="price">Free</div>
                                </div>
                                {% if is_self_hosted_realm and customer_plan and customer_plan.tier == customer_plan.TIER_SELF_HOSTED_LEGACY %}
                                <span class="button current-plan-descriptor" type="button">
                                    <i class="icon current-plan-icon"></i>
                                    Unlimited push notifications<br />until {{ customer_plan.end_date.strftime('%d %B, %Y') }}
                                </span>
                                {% elif not is_self_hosted_realm %}
                                {% if rendering_page == 'self_hosting' %}
                                <a href="https://zulip.readthedocs.io/en/stable/production/install.html" class="button get-started-button">
                                    Install a Zulip server
                                </a>
                                {% else %}
                                <a href="/self-hosting/" class="button get-started-button">
                                    Self-host Zulip
                                </a>
                                {% endif %}
                                {% else %}
                                <div class="button-placeholder"></div>
                                {% endif %}
                            </div>
                        </div>
                    </div>

                    <div class="price-box" tabindex="-1">
                        <div class="text-content">
                            <h2>Basic</h2>
                            <ul class="feature-list">
                                <li><span>Complete team chat solution, with <a href="{{ billing_base_url }}/plans/#self-hosted-plan-comparison">all Zulip features</a> included</span></li>
                                <li><span>Unlimited <a href="https://zulip.readthedocs.io/en/stable/production/mobile-push-notifications.html">mobile notifications</a></span></li>
                                <li><span><a href="/help/self-hosted-billing#how-paid-plans-support-the-zulip-project">Support</a> Zulip's open-source development</span></li>
                            </ul>
                        </div>
                        <div class="bottom">
                            <div class="text-content">
                                <div class="standard-price-box">
                                    {% if (has_scheduled_upgrade and scheduled_upgrade_plan.tier == scheduled_upgrade_plan.TIER_SELF_HOSTED_BASIC)
                                      or (is_self_hosted_realm and sponsorship_pending and requested_sponsorship_plan == "Basic")
                                      or (is_self_hosted_realm and customer_plan and customer_plan.tier != customer_plan.TIER_SELF_HOSTED_LEGACY)%}
                                    <div class="price"><span class="currency-symbol">$</span>3.50</div>
                                    <div class="details">
                                        <p>
                                            /user/month billed monthly
                                        </p>
                                    </div>
                                    {% else %}
                                    <div class="price"><span class="currency-symbol">$</span>3.50</div>
                                    <div class="details">
                                        <p>
                                            /user/month billed monthly
                                        </p>
                                    </div>
                                    <div class="discount">
                                        <b>$20/month off</b> for the first year!
                                    </div>
                                    {% endif %}
                                </div>
                                {% if has_scheduled_upgrade and scheduled_upgrade_plan.tier == scheduled_upgrade_plan.TIER_SELF_HOSTED_BASIC %}
                                <a href="{{ billing_base_url }}/billing/" class="button current-plan-button">
                                    Upgrade is scheduled
                                </a>
                                {% elif is_self_hosted_realm and sponsorship_pending and requested_sponsorship_plan == "Business" %}
                                <a href="{{ billing_base_url }}/upgrade/?tier={{ tier_self_hosted_basic }}" class="button current-plan-button" type="button">
                                    Sponsorship requested
                                </a>
                                {% elif is_self_hosted_realm and on_free_tier and not sponsorship_pending %}
                                <a href="{{ billing_base_url }}/upgrade/?tier={{ tier_self_hosted_basic }}" class="button upgrade-button">
                                    {% if free_trial_days %}
                                    Start {{ free_trial_days }}-day free trial
                                    {% else %}
                                    Upgrade to Basic
                                    {% endif %}
                                </a>
                                {% elif is_self_hosted_realm and customer_plan and customer_plan.tier == customer_plan.TIER_SELF_HOSTED_BASIC %}
                                <a href='{{ billing_base_url }}/billing' class="button current-plan-button" type="button">
                                    <i class="icon current-plan-icon"></i>
                                    {% if on_free_trial %}
                                    Current plan (free trial)
                                    {% else %}
                                    Current plan
                                    {% endif %}
                                </a>
                                {% elif is_self_hosted_realm and customer_plan and customer_plan.tier != customer_plan.TIER_SELF_HOSTED_LEGACY %}
                                <a href="mailto:sales@zulip.com" target="_blank" rel="noopener noreferrer" class="button upgrade-button">
                                    Contact sales
                                </a>
                                {% elif is_self_hosted_realm %}
                                <a href="{{ billing_base_url }}/upgrade/?tier={{ tier_self_hosted_basic }}" class="button upgrade-button">
                                    {% if free_trial_days %}
                                    Start {{ free_trial_days }}-day free trial
                                    {% else %}
                                    Upgrade to Basic
                                    {% endif %}
                                </a>
                                {% else %}
                                <a href="/help/self-hosted-billing" target="_blank" rel="noopener noreferrer" class="button upgrade-button">
                                    Log in to upgrade
                                </a>
                                {% endif %}
                            </div>
                        </div>
                    </div>

                    <div class="price-box" tabindex="-1">
                        <div class="text-content">
                            <h2 class="with-fine-print">Business <small>25 users minimum</small></h2>
                            <ul class="feature-list">
                                <li><span>Complete team chat solution, with <a href="{{ billing_base_url }}/plans/#self-hosted-plan-comparison">all Zulip features</a> included</span></li>
                                <li><span>Unlimited <a href="https://zulip.readthedocs.io/en/stable/production/mobile-push-notifications.html">mobile notifications</a></span></li>
                                <li class="support-note"><span>Email and chat support for:</span></li>
                                <li><span><a href="/help/saml-authentication">SSO with SAML, Microsoft Entra ID</a></span></li>
                                <li><span><a href="https://zulip.readthedocs.io/en/stable/production/authentication-methods.html">AD/LDAP user sync </a></span></li>
                                <li><span><a href="/help/guest-users">Guests</a> with configurable access</span></li>
                                <li><span><a href="/help/export-your-organization">Full</a> and <a href="https://zulip.readthedocs.io/en/stable/production/export-and-import.html#compliance-exports">compliance</a> data exports</span></li>
                                <li><span><a href="/help/message-retention-policy">Data retention policies</a></span></li>
                                <li class="comparison-table-pointer"><span>And <a href="{{ billing_base_url }}/plans/#self-hosted-plan-comparison">much more</a>!</span></li>
                            </ul>
                        </div>
                        <div class="bottom">
                            <div class="text-content">
                                <div class="standard-price-box">
                                    {% if (has_scheduled_upgrade and scheduled_upgrade_plan.tier == scheduled_upgrade_plan.TIER_SELF_HOSTED_BUSINESS)
                                      or (is_self_hosted_realm and sponsorship_pending and requested_sponsorship_plan == "Business")
                                      or (is_self_hosted_realm and customer_plan and customer_plan.tier != customer_plan.TIER_SELF_HOSTED_LEGACY)%}
                                    <div class="price"><span class="currency-symbol">$</span>6.67</div>
                                    <div class="details">
                                        <p>
                                            /user/month billed annually
                                            or&nbsp;<b>$8</b>&nbsp;billed monthly
                                        </p>
                                    </div>
                                    {% else %}
                                    <div class="price"><span class="currency-symbol">$</span>6.67</div>
                                    <div class="details">
                                        <p>
                                            /user/month billed annually
                                            or&nbsp;<b>$8</b>&nbsp;billed monthly
                                        </p>
                                    </div>
                                    <div class="discount">
                                        <b>$20/month off</b> for the first year!
                                    </div>
                                    {% endif %}
                                </div>
                                {% if has_scheduled_upgrade and scheduled_upgrade_plan.tier == scheduled_upgrade_plan.TIER_SELF_HOSTED_BUSINESS %}
                                <a href="{{ billing_base_url }}/billing/" class="button current-plan-button">
                                    Upgrade is scheduled
                                </a>
                                {% elif is_self_hosted_realm and sponsorship_pending and requested_sponsorship_plan == "Business" %}
                                <a href="{{ billing_base_url }}/upgrade/?tier={{ tier_self_hosted_business }}" class="button current-plan-button" type="button">
                                    Sponsorship requested
                                </a>
                                {% elif is_self_hosted_realm and on_free_tier and not sponsorship_pending %}
                                <a href="{{ billing_base_url }}/upgrade/?tier={{ tier_self_hosted_business }}" class="button upgrade-button">
                                    Upgrade to Business
                                </a>
                                {% elif is_self_hosted_realm and customer_plan and customer_plan.tier == customer_plan.TIER_SELF_HOSTED_BUSINESS %}
                                <a href='{{ billing_base_url }}/billing' class="button current-plan-button" type="button">
                                    <i class="icon current-plan-icon"></i>
                                    {% if on_free_trial %}
                                    Current plan (free trial)
                                    {% else %}
                                    Current plan
                                    {% endif %}
                                </a>
                                {% elif is_self_hosted_realm and customer_plan and customer_plan.tier != customer_plan.TIER_SELF_HOSTED_LEGACY %}
                                <a href="mailto:sales@zulip.com" target="_blank" rel="noopener noreferrer" class="button upgrade-button">
                                    Contact sales
                                </a>
                                {% elif is_self_hosted_realm %}
                                <a href="{{ billing_base_url }}/upgrade/?tier={{ tier_self_hosted_business }}" class="button upgrade-button">
                                    Upgrade to Business
                                </a>
                                {% else %}
                                <a href="/help/self-hosted-billing" target="_blank" rel="noopener noreferrer" class="button upgrade-button">
                                    Log in to upgrade
                                </a>
                                {% endif %}
                            </div>
                        </div>
                    </div>

                    <div class="price-box" tabindex="-1">
                        <div class="text-content">
                            <h2>Enterprise</h2>
                            <ul class="feature-list">
                                <li><span>Complete team chat solution, with <a href="{{ billing_base_url }}/plans/#self-hosted-plan-comparison">all Zulip features</a> included</span></li>
                                <li><span>Unlimited <a href="https://zulip.readthedocs.io/en/stable/production/mobile-push-notifications.html">mobile notifications</a></span></li>
                                <li class="support-note"><span>Email, chat and phone support for:</span></li>
                                <li><span><a href="https://zulip.readthedocs.io/en/stable/production/authentication-methods.html#openid-connect">SSO with OpenID Connect</a></span></li>
                                <li><span><a href="https://zulip.readthedocs.io/en/stable/production/authentication-methods.html">AD/LDAP</a> and <a href="https://zulip.readthedocs.io/en/latest/production/authentication-methods.html#synchronizing-group-membership-with-saml">SAML</a> group sync</span></li>
                                <li><span><a href="/help/scim">SCIM user and group sync</a></span></li>
                                <li><span>Implementation consulting</span></li>
                                <li><span>Custom feature development</span></li>
                                <li><span>Advanced deployment options</span></li>
                                <li class="comparison-table-pointer"><span>And <a href="{{ billing_base_url }}/plans/#self-hosted-plan-comparison">much more!</a></span></li>
                            </ul>
                        </div>
                        <div class="bottom">
                            <div class="text-content">
                                {% if has_scheduled_upgrade and scheduled_upgrade_plan.tier == scheduled_upgrade_plan.TIER_SELF_HOSTED_ENTERPRISE %}
                                <a href="{{ billing_base_url }}/billing/" class="button current-plan-button">
                                    Upgrade is scheduled
                                </a>
                                {% elif is_self_hosted_realm and customer_plan and customer_plan.tier == customer_plan.TIER_SELF_HOSTED_ENTERPRISE %}
                                <a href='{{ billing_base_url }}/billing' class="button current-plan-button" type="button">
                                    <i class="icon current-plan-icon"></i>
                                    Current plan
                                </a>
                                {% else %}
                                <a href="mailto:sales@zulip.com" target="_blank" rel="noopener noreferrer" class="button upgrade-button">
                                    Contact sales
                                </a>
                                {% endif %}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: security.html]---
Location: zulip-main/templates/corporate/security.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Security | Zulip" %}

{% set PAGE_DESCRIPTION = "Making sure your information stays protected is our
  highest priority. Learn how Zulip’s security strategy covers all aspects of our
  product and business." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page">
    <div class="hero bg-pycon security">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Zulip security</h1>
            <p></p>
        </div>
    </div>

    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/security.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

````
