---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 533
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 533 of 1290)

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

---[FILE: support.html]---
Location: zulip-main/templates/corporate/support/support.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "support" %}

{# User activity. #}

{% block title %}
<title>Support panel | Zulip</title>
{% endblock %}

{% block content %}
<div class="container">
    <form class="support-search-form">
        <center>
            <input type="text" name="q" class="input-xxlarge search-query" placeholder="full names, emails, string_ids, organization URLs separated by commas" value="{{ request.GET.get('q', '') }}" autofocus />
            <button type="submit" class="support-search-button">Search</button>
        </center>
    </form>

    {% if error_message %}
    <div class="alert alert-danger">
        <center>
            {{ error_message }}
        </center>
    </div>
    {% elif success_message %}
    <div class="alert alert-success">
        <center>
            {{ success_message }}
        </center>
    </div>
    {% endif %}

    <div id="query-results">
        {% for user in users %}
        {% set realm = user.realm %}
        <div class="support-query-result user-support-container">
            <div class="user-information-section">
                <span class="cloud-label">Cloud {% if user.is_bot%}bot{% else %}user{% endif %}</span>
                <h3>{{ user.full_name }}</h3>
                <b>Email</b>: {{ user.delivery_email }}<br />
                <b>Date joined</b>: {{ user.date_joined|timesince }} ago<br />
                <b>Is active</b>: {{ user.is_active }}<br />
                <b>Role</b>: {{ user.get_role_name() }}<br />
                {% if user.is_bot and user.bot_owner %}
                <b>Bot owner</b>: {{ user.bot_owner.delivery_email }}<br />
                {% endif %}
                <form method="POST" class="delete-user-form">
                    {{ csrf_input }}
                    <input type="hidden" name="realm_id" value="{{ realm.id }}" />
                    <input type="hidden" name="delete_user_by_id" value="{{ user.id }}" />
                    <button data-email="{{ user.delivery_email }}" data-string-id="{{ realm.string_id }}" class="delete-user-button">Delete user (danger)</button>
                </form>
            </div>
            <div class="user-realm-information-section">
                {% with %}
                    {% set dollar_amount = dollar_amount %}
                    {% include "corporate/support/realm_details.html" %}
                {% endwith %}
            </div>
        </div>
        {% endfor %}

        {% for realm in realms %}
        <div class="support-query-result">
            {% with %}
                {% set dollar_amount = dollar_amount %}
                {% include "corporate/support/realm_details.html" %}
            {% endwith %}
        </div>
        {% endfor %}

        {% for confirmation in confirmations %}
        {% set object = confirmation.object %}
        <div class="support-query-result confirmation-container">
            <div class="confirmation-information-section">
                <span class="cloud-label">Cloud confirmation</span>
                {% if confirmation.type == Confirmation.USER_REGISTRATION %}
                <h3>Pre-registration user</h3>
                {% set email = object.email %}
                {% set realm = object.realm %}
                {% set show_realm_details = True %}
                {% elif confirmation.type == Confirmation.NEW_REALM_USER_REGISTRATION %}
                <h3>Realm creation</h3>
                {% set email = object.email %}
                {% set show_realm_details = False %}
                {% elif confirmation.type == Confirmation.INVITATION %}
                <h3>Invite</h3>
                {% set email = object.email %}
                {% set realm = object.realm %}
                {% set show_realm_details = True %}
                {% elif confirmation.type == Confirmation.MULTIUSE_INVITE %}
                <h3>Multiuse invite</h3>
                {% set realm = object.realm %}
                {% set show_realm_details = False %}
                {% elif confirmation.type == Confirmation.REALM_REACTIVATION %}
                <h3>Realm reactivation</h3>
                {% set realm = object.realm %}
                {% set show_realm_details = False %}
                {% endif %}
                {% if email %}
                <b>Email</b>: {{ email }}<br />
                {% endif %}
                <b>Link</b>: {{ confirmation.url }}
                <a title="Copy link" class="copy-button" data-clipboard-text="{{ confirmation.url }}">
                    <i class="fa fa-copy"></i>
                </a><br />
                <b>Expires in</b>: {{ confirmation.expires_in }}<br />
                {% if confirmation.link_status %}
                <b>Status</b>: {{ confirmation.link_status  }}<br />
                {% endif %}
            </div>
            <div class="confirmation-realm-section">
                {% if show_realm_details %}
                    {% with %}
                        {% set dollar_amount = dollar_amount %}
                        {% include "corporate/support/realm_details.html" %}
                    {% endwith %}
                {% elif realm %}
                    <span class="cloud-label">Cloud realm</span>
                    <h3><img src="{{ realm_icon_url(realm) }}" class="support-realm-icon" /> {{ realm.name }}</h3>
                    <b>Realm subdomain</b>: {{ realm.subdomain }}
                {% else %}
                    <span class="cloud-label">Cloud realm</span>
                    <h3>N/A</h3>
                {% endif %}
            </div>
        </div>
        {% endfor %}
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: support_request.html]---
Location: zulip-main/templates/corporate/support/support_request.html

```text
{% extends "zerver/portico_signup.html" %}

{% set PAGE_TITLE = "Contact support | Zulip" %}

{% block portico_content %}
<div class="register-account flex full-page">
    <div class="center-block new-style">
        <div class="pitch">
            <h1>{{ _('Contact support') }}</h1>
        </div>

        <form method="post" class="white-box" id="registration">
            {{ csrf_input }}

            <fieldset class="support-request">
                <div class="input-box support-form-field">
                    <label for="support_from" class="inline-block label-title">{{ _('From') }}</label>
                    <div id="support_from">{{ email }}</div>
                </div>
                <div class="input-box support-form-field">
                    <label for="support_realm" class="inline-block label-title">{{ _('Organization') }}</label>
                    <div id="support_realm">{{ realm_name }}</div>
                </div>
                <div class="input-box support-form-field">
                    <label for="request_subject" class="inline-block label-title">{{ _('Subject') }}</label>
                    <input id="request_subject" class="required" type="text" name="request_subject" maxlength="{{ MAX_SUBJECT_LENGTH }}" required />
                </div>
                <div class="input-box support-form-field">
                    <label for="request_message" class="inline-block label-title">{{ _('Message') }}</label>
                    <textarea id="request_message" name="request_message" cols="100" rows="5" required></textarea>
                </div>

                <div class="register-button-box">
                    <button class="register-button support-submit-button" type="submit">
                        <span>{{ _('Submit') }}</span>
                        <object class="loader" type="image/svg+xml" data="{{ static('images/loading/loader-white.svg') }}"></object>
                    </button>
                </div>
            </fieldset>
        </form>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: support_request_thanks.html]---
Location: zulip-main/templates/corporate/support/support_request_thanks.html

```text
{% extends "zerver/portico.html" %}

{% block title %}
<title>{{ _("Thanks for contacting us") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="flex full-page thanks-page">
    <div class="center-block new-style white-box">
        <h1>{{ _("Thanks for contacting us!") }}</h1>
        <p>{{ _("We will be in touch with you soon.") }}</p>
        <p>
            {% trans %}
            You can find answers to frequently asked questions in the
            <a href="/help/">Zulip help center</a>.
            {% endtrans %}
        </p>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: test_markdown.html]---
Location: zulip-main/templates/tests/test_markdown.html

```text
header

{{ render_markdown_path(markdown_test_file) }}

footer
```

--------------------------------------------------------------------------------

---[FILE: _wizard_forms.html]---
Location: zulip-main/templates/two_factor/_wizard_forms.html

```text
{% if wizard.steps.current == 'token' %}
    {% if device.method == 'call' %}
    <p>We are calling your phone right now, please enter the
    digits you hear.</p>
    {% elif device.method == 'sms' %}
    <p>We sent you a text message, please enter the token in the text message.</p>
    {% else %}
    <p>Please enter the 6-digit number from your token generator.</p>
    {% endif %}
{% elif wizard.steps.current == 'backup' %}
    <p>
        Use this form for entering backup tokens for logging in.
        These tokens have been generated for you to print and keep safe. Please
        enter one of these backup tokens to log in to your account.
    </p>
{% endif %}

{% for field in wizard.form %}
<div class="input-box">
    {{ field }}
    <label for="{{ field.id_for_label }}">{{ field.label }}</label>
</div>
{% endfor %}

{% if other_devices %}
<p>{{ _("Or, alternatively, use one of your backup phones:") }}</p>
<p>
    {% for other in other_devices %}
    <button name="challenge_device" value="{{ other.persistent_id }}"
      class="two-factor-button" type="submit">
        {{ other|device_action }}
    </button>
    {% endfor %}
</p>
{% endif %}
{% if backup_tokens %}
<p>{{ _("As a last resort, you can use a backup token:") }}</p>
<p>
    <button name="wizard_goto_step" type="submit" value="backup"
      class="two-factor-button">
        {{ _("Use backup token") }}
    </button>
</p>
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: accounts_accept_terms.html]---
Location: zulip-main/templates/zerver/accounts_accept_terms.html

```text
{% extends "zerver/portico_signup.html" %}

{% block title %}
<title>{{ _("Accept the Terms of Service") }} | Zulip</title>
{% endblock %}

{#
Allow the user to accept a TOS, creating an email record of that fact.
Users only hit this page if they are coming from a migration or other update of the TOS;
the registration flow has its own (nearly identical) copy of the fields below in register.html.
#}

{% block portico_content %}

<div class="account-accept-terms-page flex full-page">
    <div class="center-block new-style">
        <div class="pitch">
            <h1 class="get-started">{{ _("Welcome to Zulip") }}</h1>
        </div>

        <div class="white-box">
            <form method="post" id="registration" action="{{ url('accept_terms') }}">
                {{ csrf_input }}
                <div id="registration-email">
                    <label for="id_email">{{ _("Email") }}</label>
                    <div class="controls fakecontrol">{{ email }}</div>
                    {% if first_time_login %}
                    {% include 'zerver/create_user/new_user_email_address_visibility.html' %}
                    {% endif %}
                </div>

                {% if first_time_terms_of_service_message_template %}
                {% include first_time_terms_of_service_message_template %}
                {% elif terms_of_service_message %}
                <div class="description">
                    <p>{{ terms_of_service_message |safe }}</p>
                </div>
                {% endif %}

                {% if terms_of_service %}
                {% include 'zerver/create_user/terms_of_service_form_field.html' %}
                {% if first_time_terms_of_service_message_template %}
                <div class="input-group">
                    <label for="id_enable_marketing_emails_first_login" class="inline-block checkbox marketing_emails_checkbox">
                        <input id="id_enable_marketing_emails_first_login" type="checkbox" name="enable_marketing_emails"
                          checked="checked" />
                        <span class="rendered-checkbox"></span>
                        {% trans %}Subscribe me to Zulip's low-traffic newsletter (a few emails a year).{% endtrans %}
                    </label>
                </div>
                {% endif %}
                {% endif %}
                <div class="controls">
                    <button id="accept_tos_button" type="submit">{{ _('Continue') }}</button>
                    <input type="hidden" name="next" value="{{ next }}" />
                </div>
            </form>
        </div>
    </div>
</div>

{% if first_time_login %}
{% include 'zerver/create_user/change_email_address_visibility_modal.html' %}
{% endif %}

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: accounts_send_confirm.html]---
Location: zulip-main/templates/zerver/accounts_send_confirm.html

```text
{% extends "zerver/portico_signup.html" %}
{# Displayed after a user attempts to sign up. #}

{% block title %}
<title>{{ _("Confirm your email address") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<!-- The following empty tag has unique data-page-id so that this
page can be easily identified in it's respective JavaScript file -->
<div data-page-id="accounts-send-confirm"></div>
<div class="app portico-page">
    <div class="app-main portico-page-container center-block flex full-page account-creation account-email-confirm-container new-style">
        <div class="inline-block">

            <div class="get-started">
                <h1>{{ _("Confirm your email address") }}</h1>
            </div>

            <div class="white-box">
                <p>{% trans %}To complete your registration, check your email account (<span class="user_email semi-bold">{{ email }}</span>) for a confirmation email from Zulip.{% endtrans %}</p>

                {% include 'zerver/dev_env_email_access_details.html' %}

                <p>{% trans %}If you don't see a confirmation email in your Inbox or Spam folder, we can <a href="#" id="resend_email_link">resend it</a>.{% endtrans %}
                </p>
                {% if realm_creation %}
                <form class="resend_confirm" action="/new/" method="post" style="position: absolute;">
                    {{ csrf_input }}
                    <input type="hidden" class="email" id="email" value="{{ email }}" name="email"/>&nbsp;
                    <input type="hidden" class="realm_name" value="{{ new_realm_name }}" name="realm_name"/>&nbsp;
                    <input type="hidden" class="realm_type" value="{{ realm_type }}" name="realm_type"/>&nbsp;
                    <input type="hidden" class="realm_default_language" value="{{ realm_default_language }}" name="realm_default_language"/>&nbsp;
                    <input type="hidden" class="realm_subdomain" value="{{ realm_subdomain }}" name="realm_subdomain"/>&nbsp;
                </form>
                {% else %}
                <form class="resend_confirm" action="/accounts/home/" method="post" style="position: absolute;">
                    {{ csrf_input }}
                    <input type="hidden" class="email" id="email" value="{{ email }}" name="email"/>&nbsp;
                </form>
                {% endif %}
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

---[FILE: base.html]---
Location: zulip-main/templates/zerver/base.html

```text
<!DOCTYPE html>
<html lang='{{LANGUAGE_CODE}}' {% if color_scheme == 1 %} class="color-scheme-automatic" {% elif color_scheme == 2 %} class="dark-theme" {% endif %}>

    {# Base template for the whole site. #}

    <head>
        <meta charset="UTF-8" />
        {% block title %}
            {% if user_profile and user_profile.realm.name %}
                <title>{{user_profile.realm.name}} - Zulip</title>
            {% else %}
                {% if PAGE_TITLE %}
                <title>{{ PAGE_TITLE }}</title>
                {% endif %}
            {% endif %}
        {% endblock %}
        <link id="favicon" rel="icon" href="{{ static('images/favicon.svg') }}?v=4" />
        <link rel="alternate icon" href="{{ static('images/favicon.png') }}?v=4" />
        {% block meta_viewport %}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {% endblock %}
        {% if not user_profile %}
        {% include 'zerver/meta_tags.html' %}
        {% endif %}

        {% if sentry_params is defined %}
        <script id="sentry-params" type="text/json">{{ sentry_params|tojson }}</script>
        {% endif %}

        {% block webpack %}
            {% for filename in webpack_entry(entrypoint) -%}
                {% if filename.endswith(".css") -%}
                    <link href="{{ filename }}" rel="stylesheet" {% if csp_nonce %}nonce="{{ csp_nonce }}"{% endif %} />
                {% elif filename.endswith(".js") -%}
                    <script src="{{ filename }}" defer crossorigin="anonymous" {% if csp_nonce %}nonce="{{ csp_nonce }}"{% endif %}></script>
                {% endif -%}
            {% endfor %}
        {% endblock %}

        {% block customhead %}
        {% endblock %}
    </head>

    <body>
        {% block content %}
        {% endblock %}

        {% set all_page_params = default_page_params.copy() %}
        {% set _ = all_page_params.update(page_params|default({})) %}
        <div hidden id="page-params" data-params='{{ all_page_params|tojson }}'></div>
    </body>

</html>

{% set entrypoint = entrypoint|default("common") %}
```

--------------------------------------------------------------------------------

---[FILE: close_window.html]---
Location: zulip-main/templates/zerver/close_window.html

```text
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>{{ _("Video call ended") }} | Zulip</title>
        <script>
            window.close();
            // Why doesn’t this work in Firefox?  See
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1353466
        </script>
    </head>
    <body>
        <p>{{ _("You may now close this window.") }}</p>
    </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: confirm_continue_registration.html]---
Location: zulip-main/templates/zerver/confirm_continue_registration.html

```text
{% extends "zerver/portico_signup.html" %}

{% block title %}
<title>{{ _("Account not found") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="app register-page">
    <div class="app-main confirm-continue-page-container">
        <div class="center-container">
            <div class="center-block">
                <div class="register-form new-style">
                    <div class="lead">
                        <h1 class="get-started">{{ _("Zulip account not found.") }}</h1>
                    </div>
                    <div class="white-box">
                        <p>
                            {% trans %}
                            No account found for {{ email }}.
                            {% endtrans %}
                        </p>
                        <div style="text-align: center;">
                            <form class="form-inline" id="send_confirm" name="send_confirm"
                              action="/login/" method="get">
                                <input type="hidden"
                                  id="email"
                                  name="email"
                                  value="{{ email }}" />
                                <button>
                                    {{ _("Log in with another account") }}
                                </button>
                            </form>
                            <br />
                            <form class="form-inline" id="send_confirm" name="send_confirm"
                              action="{{ continue_link }}" method="get">
                                <button class="outline">
                                    {{ _("Continue to registration") }}
                                </button>
                                {% if full_name %}
                                <input type="hidden" name="full_name" value="{{ full_name }}" />
                                {% endif %}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-padder"></div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: deactivated.html]---
Location: zulip-main/templates/zerver/deactivated.html

```text
{% extends "zerver/portico_signup.html" %}

{% block title %}
<title>{{ _("Deactivated organization") }} | Zulip</title>
{% endblock %}

{% block customhead %}
{{ super() }}
<meta http-equiv="refresh" content="60;URL='/'" />
{% endblock %}

{% block portico_content %}

<div class="app portico-page">
    <div class="app-main portico-page-container center-block flex full-page account-creation new-style">
        <div class="inline-block">

            <div class="get-started">
                {% if deactivated_redirect %}
                    <h1>{{ _("Organization moved") }}</h1>
                {% else %}
                    <h1>{{ _("Deactivated organization") }}</h1>
                {% endif %}
            </div>

            <div class="white-box deactivated-realm-container">
                <p>
                    {% if deactivated_redirect %}
                        {% trans %}
                        This organization has moved to <a href="{{ deactivated_redirect }}">{{ deactivated_redirect }}</a>.
                        {% endtrans %}
                        {% if auto_redirect_to %}
                        {% trans %}
                            This page will automatically redirect to the <a href="{{ auto_redirect_to }}" id="deactivated-org-auto-redirect">new URL</a> in <span id="deactivated-org-auto-redirect-countdown">5</span> seconds.
                        {% endtrans %}
                        {% endif %}
                    {% elif realm_data_deleted %}
                        {{ _("This organization has been deactivated, and all organization data has been deleted.") }}
                        {% if corporate_enabled %}
                            {% trans %}
                            You can <a href="mailto:{{ support_email }}">contact Zulip support</a> to inquire about reusing this URL for a new organization.
                            {% endtrans %}
                        {% else %}
                            {% trans %}
                            You can <a href="mailto:{{ support_email }}">contact this Zulip server's administrators</a> to inquire about reusing this URL for a new organization.
                            {% endtrans %}
                        {% endif %}
                    {% else %}
                        {{ _("This organization has been deactivated.") }}
                        {% if corporate_enabled %}
                            {% trans %}
                            If you are an owner of this organization, you can <a href="mailto:{{ support_email }}">contact Zulip support</a> to reactivate it.
                            {% endtrans %}
                            <br /><br />
                            {% trans %}
                            If you're a member of the organization and want information about why it has been deactivated, please reach out to the organization's administrators directly.
                            {% endtrans %}
                        {% else %}
                            {% trans %}
                            If you are an owner of this organization, you can <a href="mailto:{{ support_email }}">contact this Zulip server's administrators</a> to reactivate it.
                            {% endtrans %}
                        {% endif %}
                    {% endif %}
                </p>
            </div>

        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: desktop_login.html]---
Location: zulip-main/templates/zerver/desktop_login.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "desktop-login" %}

{% block title %}
<title>{{ _("Finish desktop app login") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="flex new-style">
    <div class="desktop-redirect-box">
        <h1>{% trans %}Finish desktop login{% endtrans %}</h1>

        <div class="white-box">
            <p class="copy-token-info">{% trans %}Use your web browser to finish logging in, then come back here to paste in your login token.{% endtrans %}</p>

            <form id="form" action="blob:">
                <span class="input-box">
                    <input id="token" placeholder="{% trans %}Paste token here{% endtrans %}" type="text"/>
                </span>
                <button id="submit" disabled>{% trans %}Finish{% endtrans %}</button>
            </form>

            <p id="bad-token" hidden>
                {% trans %}Incorrect token.{% endtrans %}
            </p>

            <p id="done" hidden>
                {% trans %}Token accepted.  Logging you in…{% endtrans %}
            </p>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: desktop_redirect.html]---
Location: zulip-main/templates/zerver/desktop_redirect.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "desktop-redirect" %}

{% block title %}
<title>{{ _("Log in to desktop app") }} | Zulip</title>
{% endblock %}

{% block content %}
<div class="flex new-style">
    <div class="desktop-redirect-box white-box">
        <img class="avatar desktop-redirect-image" src="{{ realm_icon_url }}" alt=""/><br />
        <p class="copy-token-info">{% trans %}Copy this login token and return to your Zulip app to finish logging in:{% endtrans %}</p>
        <p>
            <span class="input-box">
                <input id="desktop-data" value="{{ desktop_data }}" type="text" readonly />
            </span>
            <button id="copy" tabindex="0" data-clipboard-target="#desktop-data">{% trans %}Copy{% endtrans %}</button>
        </p>
        <p>{% trans %}You may then close this window.{% endtrans %}</p>
        <p><a href="{{ browser_url }}">{% trans %}Or, continue in your browser.{% endtrans %}</a></p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: dev_env_email_access_details.html]---
Location: zulip-main/templates/zerver/dev_env_email_access_details.html

```text
{% if development_environment %}
<div class="alert alert-info" style="display:inline-block;">
    In the development environment, outgoing emails are logged to
    <a href="/emails">/emails</a>.
</div>
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: digest_base.html]---
Location: zulip-main/templates/zerver/digest_base.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "digest" %}

{% block title %}
<title>{{ _("Digest") }} | Zulip</title>
{% endblock %}

{% block content %}
    <div class="portico-wrap">
        {% include 'zerver/portico-header.html' %}
    </div>
    <div class="digest-container">
        <div class="digest-email-container">
            <div class="portico-page digest-page-title">
                <h1> Zulip digest </h1>
            </div>
            <div class="digest-email-html">
                {{ inlined_digest_content|safe }}
                <img id="digest-footer" src="{{ static('images/emails/footer.png') }}"/>
            </div>
            <br />
            <br />
            <h2 class="digest-page-title">Plain text version</h2>
            <pre>{% include 'zerver/emails/digest.txt' %}</pre>
            <div class="digest-address-link"> {{physical_address}}</div>
        </div>
        {% include 'zerver/footer.html' %}
    </div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: documentation_main.html]---
Location: zulip-main/templates/zerver/documentation_main.html

```text
{% extends "zerver/portico-help.html" %}
{% set entrypoint = "help" %}

{# Zulip user and API documentation. #}
{% block title %}
<title>{{ PAGE_TITLE }}</title>
{% endblock %}

{% block portico_content %}
<div class="app help terms-page inline-block{% if page_is_api_center %} api-center{% endif %}">
    <div class="sidebar">
        <div class="content">
            {% if not page_is_policy_center %}
            <h1><a href="https://zulip.com" class="no-underline">Zulip homepage</a></h1>
            {% endif %}

            {{ sidebar_html }}

            {% if not page_is_policy_center %}
            <h1 class="home-link"><a href="/" class="no-underline">Back to Zulip</a></h1>
            {% endif %}
        </div>
    </div>

    <svg height="32px" class="hamburger" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"></path>
    </svg>

    <div class="markdown">
        <div class="content" id="main-content">
            {% if page_is_policy_center %}
            {{ render_markdown_path(article) }}
            {% else %}
            {{ render_markdown_path(article, context=api_url_context) }}
            {% endif %}

            <div class="documentation-footer">
                <hr />
                {% if corporate_enabled %}
                    {% if page_is_policy_center %}
                    <p>Please contact {{ support_email_html_tag }} with any questions about Zulip's policies.</p>
                    {% else %}
                    <p>Your feedback helps us make Zulip better for everyone! Please <a href="/help/contact-support">contact us</a> with questions, suggestions, and feature requests.</p>
                    {% endif %}
                {% else %}
                    <p>Don't see an answer to your question? <a href="mailto:{{ support_email }}">Contact this Zulip server's administrators</a> for support.</p>
                {% endif %}
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: email.html]---
Location: zulip-main/templates/zerver/email.html

```text
{% if from_email != envelope_from %}
<h4>Envelope-From: {{ envelope_from }}</h4>
{% endif %}
<h4>From: {{ from_email }}</h4>
<h4>Date: {{ date }}</h4>
{% if reply_to %}
<h4>Reply to:
    {% for email in reply_to %}
    {{ email }}&nbsp;
    {% endfor %}
</h4>
{% endif %}
<h4>To:
    {% for recipient in recipients %}
    {{ recipient }}&nbsp;
    {% endfor %}
</h4>
<h4>Subject: {{subject}}</h4>
<div class="email-html" style="display: block;">
    {% autoescape off %}
    {{ html_message }}
    {% endautoescape %}
</div>
<div class="email-text" style="display: none;">
    <pre>{{ body }}</pre>
</div>
<hr />
```

--------------------------------------------------------------------------------

---[FILE: find_account.html]---
Location: zulip-main/templates/zerver/find_account.html

```text
{% extends "zerver/portico.html" %}

{% block title %}
<title>{{ _("Find your accounts") }} | Zulip</title>
{% endblock %}

{% block portico_content %}

<div class="app find-account-page flex full-page">
    <div class="inline-block new-style">
        <div class="lead">
            <h1 class="get-started">{{ _("Find your Zulip accounts") }}</h1>
        </div>

        <div class="app-main find-account-page-container white-box">
            {% if emails %}
            <div id="results">
                <p>
                    {% trans %}
                    Emails sent! The addresses entered on the previous page are listed below:
                    {% endtrans %}
                </p>

                <ul>
                    {% for email in emails %}
                    <li>{{ email }}</li>
                    {% endfor %}
                </ul>

                {% trans %}
                If you don't receive an email, you can
                <a href="{{ current_url }}">find accounts for another email address</a>.
                {% endtrans %}

                {% include 'zerver/dev_env_email_access_details.html' %}

            </div>
            {% else %}
            <div class="find-account-form">
                <p>
                    {% if corporate_enabled %}
                        {% trans %}Enter your email address to receive an email with the URLs for all the Zulip Cloud organizations in which you have active accounts.{% endtrans %}
                    {% else %}
                        {% trans %}Enter your email address to receive an email with the URLs for all the Zulip organizations on this server in which you have active accounts.{% endtrans %}
                    {% endif %}
                    {% trans %}If you have also forgotten your password, you can <a href="/help/change-your-password">reset it</a>.{% endtrans %}
                </p>
                <form class="form-inline" id="find_account" name="email_form"
                  action="{{ current_url }}" method="post">
                    {{ csrf_input }}
                    <div class="input-box moving-label horizontal">
                        <div class="inline-block relative">
                            <input type="text" autofocus id="emails" name="emails" required />
                            <label for="emails">{{ _('Email address') }}</label>
                        </div>
                        <button type="submit">{{ _('Find accounts') }}</button>
                    </div>
                    <div class="find-account-form-tip"><i>{{ form.emails.help_text }}</i></div>
                </form>
                <div id="errors"></div>
                {% if form.emails.errors %}
                    {% for error in form.emails.errors %}
                    <div class="alert alert-error">{{ error }}</div>
                    {% endfor %}
                {% endif %}
            </div>
            {% endif %}
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

````
