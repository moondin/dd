---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 518
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 518 of 1290)

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

---[FILE: event_status.html]---
Location: zulip-main/templates/corporate/billing/event_status.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "billing-event-status" %}

{% block title %}
<title>{{ _("Billing status") }} | Zulip</title>
{% endblock %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block content %}

<div class="app portico-page">
    <div class="billing-upgrade-page">
        <div class="hero small-hero"></div>

        <div class="page-content">
            <div class="main">
                <br />
                <div id="data" data-stripe-session-id="{{ stripe_session_id}}" data-stripe-invoice-id="{{ stripe_invoice_id }}" data-billing-base-url="{{ billing_base_url }}"></div>
                <div class="alert alert-success" id="webhook-success"></div>
                <div class="alert alert-danger" id="webhook-error"></div>
                <div id="webhook-loading">
                    <div class="zulip-loading-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 773.12 773.12">
                            <circle cx="386.56" cy="386.56" r="386.56"/>
                            <path d="M566.66 527.25c0 33.03-24.23 60.05-53.84 60.05H260.29c-29.61 0-53.84-27.02-53.84-60.05 0-20.22 9.09-38.2 22.93-49.09l134.37-120c2.5-2.14 5.74 1.31 3.94 4.19l-49.29 98.69c-1.38 2.76.41 6.16 3.25 6.16h191.18c29.61 0 53.83 27.03 53.83 60.05zm0-281.39c0 20.22-9.09 38.2-22.93 49.09l-134.37 120c-2.5 2.14-5.74-1.31-3.94-4.19l49.29-98.69c1.38-2.76-.41-6.16-3.25-6.16H260.29c-29.61 0-53.84-27.02-53.84-60.05s24.23-60.05 53.84-60.05h252.54c29.61 0 53.83 27.02 53.83 60.05z"/>
                        </svg>
                    </div>
                    <div id="webhook_loading_indicator"></div>
                </div>

                <form id="restartsession-form">
                    <input type="hidden" name="stripe_invoice_id" value="{{ stripe_invoice_id }}" />
                    <input type="hidden" name="csrfmiddlewaretoken" value="{{ csrf_token }}" />
                </form>
                <div class="alert alert-success" id="restartsession-success">Redirecting to Stripe Checkout</div>
                <div class="alert alert-danger" id="restartsession-error"></div>
                <div id="restartsession-loading">
                    <div class="zulip-loading-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 773.12 773.12">
                            <circle cx="386.56" cy="386.56" r="386.56"/>
                            <path d="M566.66 527.25c0 33.03-24.23 60.05-53.84 60.05H260.29c-29.61 0-53.84-27.02-53.84-60.05 0-20.22 9.09-38.2 22.93-49.09l134.37-120c2.5-2.14 5.74 1.31 3.94 4.19l-49.29 98.69c-1.38 2.76.41 6.16 3.25 6.16h191.18c29.61 0 53.83 27.03 53.83 60.05zm0-281.39c0 20.22-9.09 38.2-22.93 49.09l-134.37 120c-2.5 2.14-5.74-1.31-3.94-4.19l49.29-98.69c1.38-2.76-.41-6.16-3.25-6.16H260.29c-29.61 0-53.84-27.02-53.84-60.05s24.23-60.05 53.84-60.05h252.54c29.61 0 53.83 27.02 53.83 60.05z"/>
                        </svg>
                    </div>
                    <div id="restartsession_loading_indicator"></div>
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: legacy_server_login.html]---
Location: zulip-main/templates/corporate/billing/legacy_server_login.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "billing_auth" %}

{% set PAGE_TITLE = "Authenticate server for Zulip plan management" %}

{% block portico_content %}

<div id="server-login-page" class="register-account flex full-page">
    <div class="center-block new-style">
        <div class="pitch">
            <h1>Authenticate server<br/>for Zulip plan management</h1>
        </div>
        <div class="white-box">
            <div id="server-login-page-details">
                {% if error_message %}
                <div id="server-login-error" class="alert alert-danger">{{ error_message }}</div>
                {% endif %}
                <div id="server-login-input-section">
                    <form id="server-login-form" method="post" action="/serverlogin/">
                        {{ csrf_input }}
                        {% if next_page %}
                        <input type="hidden" name="next_page" value="{{ next_page }}" />
                        {% endif %}
                        <div id="server-login-form-title" class="input-box server-login-form">
                            <div class="not-editable-realm-field">
                                To access plan management for a Zulip
                                server, first enter <a href="https://zulip.readthedocs.io/en/stable/production/mobile-push-notifications.html#plan-management-for-an-entire-zulip-server">your server's credentials</a>.
                            </div>
                        </div>
                        <div class="input-box server-login-form-field">
                            <label for="zulip-org-id" class="inline-block label-title">
                                zulip_org_id
                            </label>
                            <input id="zulip-org-id" name="zulip_org_id" class="required" type="text"/>
                            <div class="alert alert-danger server-login-form-field-error zulip_org_id-error"></div>
                        </div>
                        <div class="input-box server-login-form-field">
                            <label for="password" class="inline-block label-title">zulip_org_key</label>
                            <input id="password" name="zulip_org_key" class="required" type="password"/>
                            <div class="alert alert-danger server-login-form-field-error zulip_org_key-error"></div>
                        </div>
                        <div id="server-login-page-button-container">
                            <button type="submit" id="server-login-button" class="stripe-button-el invoice-button">
                                <span class="server-login-button-text">Continue</span>
                                <img class="loader remote-billing-button-loader" src="{{ static('images/loading/loader-white.svg') }}" alt="" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_billing_confirm_email_form.html]---
Location: zulip-main/templates/corporate/billing/remote_billing_confirm_email_form.html

```text
{% extends "zerver/portico_signup.html" %}
{% set entrypoint = "billing_auth" %}

{% block title %}
{% if remote_server_hostname %}
<title>Enter log in email | Zulip</title>
{% else %}
<title>Enter email | Zulip</title>
{% endif %}
{% endblock %}

{% block portico_content %}
<div class="register-account flex full-page" id="remote-billing-confirm-email">
    <div class="center-block new-style">
        <div class="pitch">
            {% if remote_server_hostname %}
            <h1>Enter log in email</h1>
            {% else %}
            <h1>Enter email</h1>
            {% endif %}
        </div>
        <div class="white-box">
            <form id="remote-billing-confirm-email-form" method="post" action="{{ action_url }}">
                {{ csrf_input }}
                {% if next_page %}
                <input type="hidden" name="next_page" value="{{ next_page }}" />
                {% endif %}
                <div class="input-box server-login-form-field" id="remote-billing-confirm-email-intro">
                    <div class="not-editable-realm-field">
                        {% if remote_server_hostname %}
                            Enter the email address of the person who is logging in to manage plans and billing for this server (yourself or someone else). They will receive an email from Zulip with a log in link.
                        {% else %}
                            Enter the email address you want to use for Zulip plan management. You will receive a one-time confirmation email.
                        {% endif %}
                    </div>
                </div>
                <div class="input-box server-login-form-field">
                    <label for="email" class="inline-block label-title">Email</label>
                    <input id="email" name="email" type="email" class="required" {% if email %}value="{{ email }}"{% endif %} />
                    <div id="server-login-form-email-error" class="alert alert-danger server-login-form-field-error email-error"></div>
                </div>
                <div class="upgrade-button-container">
                    <button type="submit" id="remote-billing-confirm-email-button" class="stripe-button-el invoice-button">
                        <span class="server-login-button-text">Continue</span>
                        <img class="loader remote-billing-button-loader" src="{{ static('images/loading/loader-white.svg') }}" alt="" />
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_billing_email_confirmation_sent.html]---
Location: zulip-main/templates/corporate/billing/remote_billing_email_confirmation_sent.html

```text
{% extends "zerver/portico_signup.html" %}
{% set entrypoint = "billing_auth" %}

{% block title %}
{% if remote_server_hostname %}
<title>Log in link sent | Zulip</title>
{% else %}
<title>Confirm your email address | Zulip</title>
{% endif %}
{% endblock %}

{% block portico_content %}
<div class="app portico-page">
    <div class="app-main portico-page-container center-block flex full-page account-creation account-email-confirm-container new-style">
        <div class="inline-block">

            <div class="get-started">
                {% if remote_server_hostname %}
                <h1>Log in link sent</h1>
                {% else %}
                <h1>Confirm your email address</h1>
                {% endif %}
            </div>

            <div class="white-box">
                {% if remote_server_hostname %}
                <p>We have sent <span class="user_email semi-bold">{{ email }}</span> a log in link for Zulip plan management. This link will expire in 24 hours.</p>
                {% else %}
                <p>To finish logging in, check your email account (<span class="user_email semi-bold">{{ email }}</span>) for a confirmation email from Zulip.</p>
                {% endif %}

                {% include 'zerver/dev_env_email_access_details.html' %}
            </div>
        </div>
    </div>
</div>
{% endblock %}

{% block customhead %}
{{ super() }}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_billing_finalize_login_confirmation.html]---
Location: zulip-main/templates/corporate/billing/remote_billing_finalize_login_confirmation.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "billing_auth" %}

{% block title %}
<title>
    {% if next_page and next_page == "deactivate" %}
    Log in to deactivate registration for {{ host }} | Zulip
    {% else %}
    Log in to Zulip plan management for {{ host }} | Zulip
    {% endif %}
</title>
{% endblock %}

{% block portico_content %}
<div id="remote-billing-confirm-login-page" class="register-account flex full-page">
    <div class="center-block new-style">
        <div class="pitch">
            {% if next_page and next_page == "deactivate" %}
            <h1>Log in to deactivate registration for<br/>{{ host }}</h1>
            {% else %}
            <h1>Log in to Zulip plan management for<br/>{{ host }}</h1>
            {% endif %}
        </div>
        <div class="white-box">
            <form id="remote-billing-confirm-login-form" method="post" action="{{ action_url }}">
                {{ csrf_input }}
                <div class="input-box remote-billing-confirm-login-form-field">
                    <label for="full_name" class="inline-block label-title">Name</label>
                    {% if not user_full_name %}
                    <input id="full_name" name="full_name" class="required" type="text" />
                    <div id="remote-billing-confirm-login-form-full_name-error" class="alert alert-danger remote-billing-confirm-login-form-field-error full_name-error"></div>
                    {% else %}
                    <div class="not-editable-realm-field">
                        {{ user_full_name }}
                    </div>
                    {% endif %}
                </div>
                <div class="input-box remote-billing-confirm-login-form-field">
                    <label for="user-email" class="inline-block label-title">
                        Email
                    </label>
                    <div id="user-email" class="not-editable-realm-field">
                        {{ user_email }}
                    </div>
                </div>
                <!-- user_full_name is not present only when user first logs in which also perfect to set email preferences  -->
                {% if (not user_full_name) and (not (next_page and next_page == "deactivate")) %}
                <div class="input-group remote-billing-confirm-email-subscription-form-field">
                    <label for="enable-major-release-emails" class="checkbox">
                        <input id="enable-major-release-emails" name="enable_major_release_emails" type="checkbox" value="true" checked="checked" />
                        <span class="rendered-checkbox"></span>
                        Sign me up for emails about <strong>major Zulip releases</strong> and other big announcements (a few times a year)
                    </label>
                    <label for="enable-maintenance-release-emails" class="checkbox">
                        <input id="enable-maintenance-release-emails" name="enable_maintenance_release_emails" type="checkbox" value="true" checked="checked" />
                        <span class="rendered-checkbox"></span>
                        Sign me up for emails about <strong>all Zulip releases</strong>, including security and maintenance releases (recommended for server administrators)
                    </label>
                </div>
                {% endif %}
                {% if tos_consent_needed %}
                <div class="input-group terms-of-service remote-billing-confirm-login-form-field" id="remote-billing-confirm-login-tos-wrapper">
                    <label for="remote-billing-confirm-login-tos" class="checkbox">
                        <input id="remote-billing-confirm-login-tos" name="tos_consent" class="required" type="checkbox" value="true" />
                        <span class="rendered-checkbox"></span>
                        I agree to the <a href="{{ root_domain_url }}/policies/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>.
                    </label>
                    <div id="remote-billing-confirm-login-form-tos_consent-error" class="alert alert-danger remote-billing-confirm-login-form-field-error tos_consent-error"></div>
                </div>
                {% endif %}
                <div class="upgrade-button-container">
                    <button type="submit" id="remote-billing-confirm-login-button" class="stripe-button-el invoice-button">
                        <span class="remote-billing-confirm-login-button-text">Continue</span>
                        <img class="loader remote-billing-button-loader" src="{{ static('images/loading/loader-white.svg') }}" alt="" />
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_billing_server_deactivate.html]---
Location: zulip-main/templates/corporate/billing/remote_billing_server_deactivate.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "billing_auth" %}

{% block title %}
<title>{{ _("Deactivate server registration?") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div id="server-deactivate-page" class="register-account account-deactivation flex full-page">
    <div class="new-style">
        <div class="pitch">
            <h1>
                Deactivate registration for<br />{{ server_hostname }}?
            </h1>
        </div>
        <div class="white-box">
            <div id="server-deactivate-details">
                {% if show_existing_plan_error %}
                <div id="server-deactivate-error" class="alert alert-danger">
                    Could not deactivate registration. You must first
                    <a href="https://zulip.com/help/self-hosted-billing#cancel-paid-plan">cancel</a>
                    all paid plans associated with this server, including scheduled plan upgrades.
                </div>
                {% endif %}
                <form id="server-deactivate-form" method="post" action="{{ action_url }}">
                    {{ csrf_input }}
                    <div id="server-deactivate-form-top-description" class="input-box server-deactivate-form-field">
                        <div class="not-editable-realm-field">
                            You are about to deactivate this server's
                            registration with
                            the <a href="https://zulip.readthedocs.io/en/stable/production/mobile-push-notifications.html">Zulip
                        Mobile Push Notification Service</a>. This
                        will disable delivery of mobile push
                        notifications for all organizations hosted
                        on <b>{{ server_hostname }}</b>.
                        </div>
                    </div>
                    <input type="hidden" name="confirmed" value="true" />
                    <div class="upgrade-button-container">
                        <button type="submit" id="server-deactivate-button" class="stripe-button-el invoice-button">
                            <span class="server-deactivate-button-text">Deactivate registration</span>
                            <img class="loader remote-billing-button-loader" src="{{ static('images/loading/loader-white.svg') }}" alt="" />
                        </button>
                    </div>
                </form>
                <div class="input-box upgrade-page-field">
                    <div class="support-link not-editable-realm-field">
                        Questions? Contact <a href="mailto:support@zulip.com">support@zulip.com</a>.
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_billing_server_deactivated_success.html]---
Location: zulip-main/templates/corporate/billing/remote_billing_server_deactivated_success.html

```text
{% extends "zerver/portico_signup.html" %}
{% set entrypoint = "billing_auth" %}

{% block title %}
<title>Server registration deactivated | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="register-account flex full-page" id="account-deactivated-success-page">
    <div class="center-block new-style">
        <div class="pitch">
            <h1>
                Registration deactivated for<br />{{ server_hostname }}
            </h1>
        </div>
        <div class="white-box">
            <div id="account-deactivated-success-page-details">
                <div class="input-box account-deactivated-success-page-field" id="account-deactivated-success-page-top-message">
                    <div class="not-editable-realm-field">
                        Your server's registration has been deactivated.
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

{% endblock %}

{% block customhead %}
{{ super() }}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_realm_login_error_for_server_on_active_plan.html]---
Location: zulip-main/templates/corporate/billing/remote_realm_login_error_for_server_on_active_plan.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Plan management not available") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img src="{{ static('images/errors/400art.svg') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        <h1 class="lead">{{ _("Plan management not available") }}</h1>
        <p>
            {% trans %} Plan management is not available for this
            organization, because your Zulip server is already on a
            {{ server_plan_name }} plan, which covers all
            organizations on this server. See the <b>Server-level billing</b> tab of the
            <a href="https://zulip.com/help/self-hosted-billing#log-in-to-billing-management">log
            in instructions</a> to administer the plan for your
            Zulip server.
            {% endtrans %}
        </p>
        <p>
            {% trans %} To move the plan from the server to this
            organization, or for other questions, <a href="mailto:{{
            support_email }}">contact support</a>.
            {% endtrans %}
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_server_login_error_for_any_realm_on_active_plan.html]---
Location: zulip-main/templates/corporate/billing/remote_server_login_error_for_any_realm_on_active_plan.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Plan management not available") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img src="{{ static('images/errors/400art.svg') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        <h1 class="lead">{{ _("Plan management not available") }}</h1>
        <p>
            {% trans %}
            Plan management for this server is not available because at least one organization
            hosted on this server already has an active plan.
            {% endtrans %}
        </p>
        <p>
            {% trans %}
            <a href="https://zulip.com/help/self-hosted-billing#manage-billing">Log in</a> to plan management for your
            organization instead, or <a href='mailto:{{ support_email }}'>contact support</a> with any questions.
            {% endtrans %}
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_server_rate_limit_exceeded.html]---
Location: zulip-main/templates/corporate/billing/remote_server_rate_limit_exceeded.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Rate limit exceeded") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img src="{{ static('images/errors/500art.svg') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        <h1 class="lead">{{ _("Rate limit exceeded.") }}</h1>
        <p>
            {% trans %}Your server has exceeded the limit for how
            often this action can be performed.{% endtrans %}
            {% trans %}You can try again in {{retry_after}} seconds.{% endtrans %}
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: server_not_uploading_data.html]---
Location: zulip-main/templates/corporate/billing/server_not_uploading_data.html

```text
{% extends "zerver/portico.html" %}

{% block title %}
<title>Required metadata missing | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="center-block flex full-page account-creation new-style">
    <div class="inline-block">
        <div class="get-started">
            <h1>Error: Server not uploading basic metadata</h1>
        </div>
        <div class="white-box">
            <p>
                Managing your Zulip plan requires your server to upload
                up-to-date
                <a
                  href="https://zulip.readthedocs.io/en/latest/production/mobile-push-notifications.html#uploading-basic-metadata">basic
                metadata</a>. This data is not being uploaded successfully.
            </p>
            {% if remote_realm_session %}
            <p>
                If your Zulip server's administrator is not able to fix this, <a
                href="mailto:support@zulip.com">contact Zulip support</a>.
            </p>
            {% elif supports_remote_realms %}
            <p>
                If your Zulip server's administrator is not able to fix this, <a
                href="mailto:support@zulip.com">contact Zulip support</a>.
            </p>
            {% else %}
            <p>
                Your Zulip server's administrator can fix this issue by <a
                href="https://zulip.readthedocs.io/en/stable/production/upgrade.html">upgrading</a>
                the server to Zulip 8.0+, or <a href="https://zulip.readthedocs.io/en/stable/production/mobile-push-notifications.html#uploading-usage-statistics">enabling the
                <code>SUBMIT_USAGE_STATISTICS</code> setting</a>.
            </p>
            {% endif %}
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: sponsorship.html]---
Location: zulip-main/templates/corporate/billing/sponsorship.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "sponsorship" %}

{% block title %}
<title>
    {% if is_sponsored or is_sponsorship_pending %}
        Zulip
        {% if is_remotely_hosted %}
        {% else %}
        Cloud
        {% endif %}
        billing for {{ org_name }}
    {% else %}
        Request Zulip
        {% if is_remotely_hosted %}
        {% else %}
        Cloud
        {% endif %} sponsorship
    {% endif %}
</title>
{% endblock %}

{% block portico_content %}

{% if is_sponsored or is_sponsorship_pending %}

<div class="register-account flex full-page sponsorship-status-page">
    <div class="center-block new-style">
        <div class="alert alert-success sponsorship-page-success" id="sponsorship-status-success-message-top">
            {% if is_sponsored %}
            Zulip is sponsoring a free <a href="{{ billing_base_url }}/plans/">{{ sponsorship_plan_name }}</a> plan for this organization. 🎉
            {% else %}
            This organization has requested sponsorship for a
            {% if is_remotely_hosted and sponsorship_plan_name != "Community" %}
            discounted
            {% endif %}
            <a href="{{ billing_base_url }}/plans/">{{ sponsorship_plan_name }}</a> plan.<br/><a href="mailto:support@zulip.com">Contact Zulip support</a> with any questions or updates.
            {% endif %}
        </div>
        <div class="pitch">
            <h1>
                Zulip
                {% if is_remotely_hosted %}
                {% else %}
                Cloud
                {% endif %}
                billing for {{ org_name }}
            </h1>
        </div>
        <div class="white-box">
            <div id="sponsorship-status-page-details">
                <div class="input-box sponsorship-form-field">
                    <label for="sponsored-org-current-plan" class="inline-block label-title">Your plan</label>
                    <div id="sponsored-org-current-plan" class="not-editable-realm-field">
                        {% if is_sponsored %}
                        <a href="{{ billing_base_url }}/plans/">{{ sponsorship_plan_name }}</a>
                        {% elif complimentary_access %}
                        <a href="{{ billing_base_url }}/plans/">Zulip Basic</a> <i>(complimentary access)</i>
                        {% else %}
                        <a href="{{ billing_base_url }}/plans/">{{ plan_name }}</a>
                        {% endif %}
                    </div>
                </div>
            </div>
        </div>
        {% if is_sponsored %}
        <hr />
        <div class="support-link">
            <p>
                To make changes to your plan or view your billing history <a href="mailto:support@zulip.com">contact Zulip support</a>.
            </p>
        </div>
        {% endif %}
    </div>
</div>

{% else %}

<div class="register-account flex full-page sponsorship-page">
    <div class="center-block new-style">
        <div class="pitch">
            <h1>
                Request Zulip
                {% if is_remotely_hosted %}
                {% else %}
                Cloud
                {% endif %} sponsorship
            </h1>
        </div>
        <div class="white-box">
            <div id="sponsorship-error" class="alert alert-danger"></div>
            <div id="sponsorship-input-section">
                <form id="sponsorship-form" method="post" data-billing-base-url="{{ billing_base_url }}" data-is-remotely-hosted="{{ is_remotely_hosted }}">
                    <input type="hidden" name="csrfmiddlewaretoken" value="{{ csrf_token }}" />
                    <div class="input-box sponsorship-form-field">
                        <label for="org-name" class="inline-block label-title">Organization</label>
                        <div id="org-name" class="not-editable-realm-field">{{ org_name }}</div>
                    </div>
                    <div class="input-box sponsorship-form-field">
                        <div class="inline-block relative">
                            <select name="organization_type" id="organization-type" class="sponsorship-form-select">
                                {% for org_type in sorted_org_types %}
                                    {% if not org_type[1].hidden %}
                                    <option data-string-value="{{ org_type[0] }}"
                                      {% if org_type[1].id == realm_org_type %}selected{% endif %}
                                      value="{{ org_type[1].id }}">
                                        {{ _(org_type[1].name) }}
                                    </option>
                                    {% endif %}
                                {% endfor %}
                            </select>
                        </div>
                        <label for="organization_type" class="inline-block label-title">
                            Organization type
                            {% if is_remotely_hosted %}
                            <a href="/help/self-hosted-billing#free-community-plan" target="_blank" rel="noopener noreferrer">
                                <i class="fa fa-question-circle-o" aria-hidden="true"></i>
                            </a>
                            {% endif %}
                        </label>
                    </div>
                    <p id="sponsorship-discount-details"></p>
                    {% if is_remotely_hosted %}
                    <div class="input-box sponsorship-form-field">
                        <div class="inline-block relative">
                            <select name="requested_plan" id="organization-requested-plan" class="sponsorship-form-select">
                                <option value="Community" selected>
                                    Community
                                </option>
                                <option value="Basic">
                                    Basic (discounted)
                                </option>
                                <option value="Business">
                                    Business (discounted)
                                </option>
                            </select>
                        </div>
                        <label for="organization-requested-plan" class="inline-block label-title">Requested plan</label>
                    </div>
                    {% endif %}
                    <div class="input-box sponsorship-form-field">
                        <label for="org-website" class="inline-block
                          label-title">Organization website (if any)</label>
                        <input id="org-website" name="website" type="text"/>
                        <div id="sponsorship-org-website-error" class="alert alert-danger sponsorship-field-error"></div>
                    </div>
                    <div class="input-box sponsorship-form-field">
                        <label for="description" class="inline-block
                          label-title">Description of your organization</label>
                        <textarea id="description" name="description" cols="100" rows="5"></textarea>
                        <div id="sponsorship-description-error" class="alert alert-danger sponsorship-field-error"></div>
                    </div>
                    <div class="input-box sponsorship-form-field">
                        <label for="plan-to-use-zulip" class="inline-block
                          label-title">How do you plan to use Zulip?</label>
                        <textarea id="plan-to-use-zulip" name="plan_to_use_zulip" cols="100" rows="2"></textarea>
                        <div id="sponsorship-plan-to-use-zulip-error" class="alert alert-danger sponsorship-field-error"></div>
                    </div>
                    <div class="input-box sponsorship-form-field">
                        <label for="expected-total-users" class="inline-block label-title">Expected number of users (approximate range)</label>
                        <input id="expected-total-users" name="expected_total_users" type="text" />
                        <div id="sponsorship-expected-total-users-error" class="alert alert-danger sponsorship-field-error"></div>
                    </div>
                    <div class="input-box sponsorship-form-field">
                        <label for="paid-users-count" class="inline-block label-title">How many paid staff does your organization have?</label>
                        <input id="paid-users-count" name="paid_users_count" type="text"/>
                        <div id="sponsorship-paid-users-count-error" class="alert alert-danger sponsorship-field-error"></div>
                    </div>
                    <div class="input-box sponsorship-form-field">
                        <label for="paid-users-description" class="inline-block
                          label-title">Description of paid staff (if any)</label>
                        <textarea id="paid-users-description" name="paid_users_description" cols="100" rows="2"></textarea>
                        <div id="sponsorship-paid-users-description-error" class="alert alert-danger sponsorship-field-error"></div>
                    </div>
                    <div class="upgrade-button-container">
                        <button type="submit" id="sponsorship-button" class="stripe-button-el invoice-button">
                            <span class="sponsorship-button-text">Submit</span>
                            <object class="loader sponsorship-button-loader" type="image/svg+xml" data="{{ static('images/loading/loader-white.svg') }}"></object>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
{% endif %}

{% endblock %}
```

--------------------------------------------------------------------------------

````
