---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 536
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 536 of 1290)

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

---[FILE: slack_import.html]---
Location: zulip-main/templates/zerver/slack_import.html

```text
{% extends "zerver/portico_signup.html" %}
{% set entrypoint = "slack-import" %}

{% block title %}
<title>{{ _("Import from Slack") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="app register-page">
    <div class="app-main register-page-container new-style flex full-page center">
        <div class="register-form left" id="realm-creation-form-slack-import">
            <div class="lead">
                <h1 class="get-started">{{ _("Import from Slack") }}</h1>
            </div>
            <div class="white-box">
                {% if poll_for_import_completion %}
                {% if import_poll_error_message %}
                <p class="text-error">{{ import_poll_error_message }}</p>
                {% endif %}
                <input type='hidden' name='key' value='{{ key }}' id="auth_key_for_polling" />
                <div class="input-box">
                    <label for="uploaded-file-info">{{ _("Import progress") }}</label>
                    <div id="slack-import-poll-status" class="not-editable-realm-field">
                        {{ _("Checking import status…") }}
                    </div>
                </div>
                {% else %}
                <form method="post" class="form-inline" action="{{ url('import_realm_from_slack') }}">
                    {{ csrf_input }}
                    <div class="input-box no-validation">
                        <input type='hidden' name='key' value='{{ key }}' id="auth_key_for_file_upload"/>
                    </div>
                    <div class="input-box slack-import-extra-info">
                        <div class="not-editable-realm-field">
                            {% trans %}
                            Follow <a href="https://zulip.com/help//import-from-slack#export-your-slack-data:~:text=Export%20user%20data%20and%20custom%20emoji" rel="noopener noreferrer" target="_blank">these instructions</a> to obtain a <strong>Bot User OAuth Token</strong>.
                            {% endtrans %}
                        </div>
                    </div>
                    <div class="input-box">
                        <label for="slack_access_token" class="inline-block label-title">{{ _('Slack bot user OAuth token') }}</label>
                        <textarea id="slack-access-token"
                          placeholder="xoxb-…"
                          rows="3"
                          maxlength="100" name="slack_access_token">
                            {%- if slack_access_token -%}
                                {{ slack_access_token }}
                            {%- endif -%}
                        </textarea>
                        {% if slack_access_token_validation_error %}
                        <p id="slack-access-token-validation-error" class="help-inline text-error">{{ slack_access_token_validation_error }}</p>
                        {% endif %}
                    </div>
                    <div class="input-box">
                        <button type="submit" class="register-button" {% if slack_access_token %} id="update-slack-access-token"{% endif %}>
                            {% if slack_access_token %}
                            {{ _("Update") }}
                            {% else %}
                            {{ _("Submit") }}
                            {% endif %}
                        </button>
                    </div>
                </form>
                {% if slack_access_token %}
                <div class="input-box{% if uploaded_import_file_name %} hidden{% else %}{% endif %}" id="slack-import-dashboard-wrapper">
                    <label for="slack-import-dashboard" class="inline-block label-title">{{ _('Upload your Slack export file') }}</label>
                    <div class="not-editable-realm-field">
                        {% trans %}
                        Follow <a href="https://zulip.com/help/import-from-slack#export-your-slack-data" target="_blank" rel="noopener noreferrer">these instructions</a> to obtain your Slack message history export.
                        {% endtrans %}
                        {% include "zerver/slack_import_file_upload_instruction.html" %}
                    </div>
                    <button class="slack-import-upload-file full-width">{{ _('Start upload') }}</button>
                </div>
                <form id="slack-import-start-upload-wrapper" method="post" class="form-inline {% if uploaded_import_file_name %}{% else %}hidden{% endif %}" action="{{ url('import_realm_from_slack') }}">
                    {{ csrf_input }}
                    <div class="input-box no-validation">
                        <input type='hidden' name='key' value='{{ key }}' />
                        <input type='hidden' name='start_slack_import' value="true" />
                    </div>
                    <div class="input-box">
                        <label for="uploaded-file-info">{{ _("Uploaded export file") }}</label>
                        <div class="not-editable-realm-field">
                            <span id="slack-import-uploaded-file-name">{{ uploaded_import_file_name }}</span>
                            &nbsp;<a href="#" type="button" class="slack-import-upload-file">Upload a different file</a>
                        </div>
                        <p id="slack-import-file-upload-error" class="help-inline text-error">{{ invalid_file_error_message }}</p>
                    </div>
                    <div class="input-group input-box" id="email-address-visibility-select-wrapper">
                        <label for="email-address-visibility-select">
                            {{ _("Who will be allowed to see other users' email addresses?") }}
                            <br />
                            <span id="email-address-visibility-help-text">
                                {% trans %}
                                Users can <a href="https://zulip.com/help/configure-email-visibility" target="_blank">change</a> their email visibility configuration when they log in.
                                {% endtrans %}
                            </span>
                        </label>
                        <select id="email-address-visibility-select" name="email_address_visibility" class="required">
                            {% for value, label in email_address_visibility_options %}
                            <option value="{{ value }}" {% if value == email_address_visibility_default %}selected{% endif %}>{{ _(label) }}</option>
                            {% endfor %}
                        </select>
                    </div>
                    <div class="input-box">
                        <button type="submit" class="register-button"{% if invalid_file_error_message %} disabled{% endif %}>
                            {{ _("Start import") }}
                        </button>
                    </div>
                </form>
                {% endif %}
                {% endif %}
            </div>
            {% if poll_for_import_completion %}
            <div id="bottom-hint-slack-import-page">
                <span class="bottom-text">
                    {% trans %}
                    Feel free to step away. You can always come back to this page
                    <br />
                    by clicking the <b>Complete registration</b> button in your email.
                    {% endtrans %}
                </span>
            </div>
            {% else %}
            <form method="post" class="hidden" id="cancel-slack-import-form" action="{{ url('import_realm_from_slack') }}">
                {{ csrf_input }}
                <input type='hidden' name='key' value="{{ key }}" />
                <input type='hidden' name='cancel_import' value='true'/>
            </form>
            <div class="bottom-text">
                {% trans %}
                Or <span id="cancel-slack-import" tabindex="0">create organization</span> without importing data.
                {% endtrans %}
            </div>
            {% endif %}
        </div>
    </div>
</div>
<!-- We don't want our CSS to override styles provided by uppy, hence we keep it outside
the `.app` tree. -->
<div id="slack-import-dashboard" data-max-file-size="{{max_file_size}}"></div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: slack_import_file_upload_instruction.html]---
Location: zulip-main/templates/zerver/slack_import_file_upload_instruction.html

```text
<p class="slack-import-file-upload-instruction">
    {% if corporate_enabled %}
    {% trans %}
    Maximum size: {{max_file_size}} MiB. For larger exports, follow the <a href="/help/import-from-slack#import-your-data-into-zulip" rel="noopener noreferrer" target="_blank">process</a> for imports via support.
    {% endtrans %}
    {% else %}
    {% trans %}
    Maximum size: {{max_file_size}} MiB. For larger exports, follow the <a href="/help/import-from-slack#import-your-data-into-zulip" rel="noopener noreferrer" target="_blank">process</a> for self-hosted imports.
    {% endtrans %}
    {% endif %}
</p>
```

--------------------------------------------------------------------------------

---[FILE: social_auth_select_email.html]---
Location: zulip-main/templates/zerver/social_auth_select_email.html

```text
{% extends "zerver/portico_signup.html" %}

{% block title %}
<title>{{ _("Select account for authentication") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="register-account flex full-page new-style" id="choose_email">
    <div class="lead">
        {% trans %}
        <h1 class="get-started">Select account</h1>
        {% endtrans %}
    </div>

    <div class="white-box">
        <form method="post" class="select-email-form" action="/complete/{{ backend }}/" tabindex="0">
            <div class="choose-email-box">
                <input type="hidden" name="email" value="{{ primary_email }}" />
                {% if avatar_urls[primary_email] %}
                <img src="{{ avatar_urls[primary_email] }}" alt=""/>
                {% else %}
                <i class="fa fa-plus" aria-hidden="true"></i>
                {% endif %}
                <div>
                    <p class="email">
                        {{ primary_email }}
                    </p>
                    <p>
                        GitHub primary
                        {% if avatar_urls[primary_email] %}
                        - Log in
                        {% else %}
                        - Create new account
                        {% endif %}
                    </p>
                </div>
            </div>
        </form>
        {% for email in verified_non_primary_emails %}
        <form method="post" class="select-email-form" action="/complete/{{ backend }}/" tabindex="0">
            <div class="choose-email-box">
                <input type="hidden" name="email" value="{{ email }}" />
                {% if avatar_urls[email] %}
                <img src="{{ avatar_urls[email] }}" alt="" class="no-drag"/>
                {% else %}
                <i class="fa fa-plus" aria-hidden="true"></i>
                {% endif %}
                <div>
                    <p class="email">
                        {{ email }}
                    </p>
                    <p>
                        {% if avatar_urls[email] %}
                        Log in
                        {% else %}
                        Create new account
                        {% endif %}
                    </p>
                </div>
            </div>
        </form>
        {% endfor %}
    </div>
    {% if unverified_emails %}
    <div class="bottom-text">
        <p>
            {% trans %}
            Your GitHub account also has unverified email addresses
            associated with it.
            {% endtrans %}
        </p>
        <p>
            {% trans %}
            To use one of these to log in to Zulip, you must first
            <a href="https://github.com/settings/emails">verify it with GitHub.</a>
            {% endtrans %}
        </p>
    </div>
    {% endif %}
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: unsubscribe_link_error.html]---
Location: zulip-main/templates/zerver/unsubscribe_link_error.html

```text
{% extends "zerver/portico.html" %}

{% block title %}
<title>{{ _("Error unsubscribing email") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="app portico-page">
    <div class="app-main portico-page-container center-block flex full-page account-creation new-style">
        <div class="inline-block">
            <div class="get-started">
                <h1>{{ _("Unknown email unsubscribe request") }}</h1>
            </div>
            <div class="white-box">
                <p>
                    {{ _("Hi there! It looks like you tried to unsubscribe from something, but we don't recognize the URL.") }}
                </p>
                <p>
                    {% trans %}Please double-check that you have the full URL and try again, or <a href="mailto:{{ support_email }}">email us</a> and we'll get this squared away!{% endtrans %}
                </p>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: unsubscribe_success.html]---
Location: zulip-main/templates/zerver/unsubscribe_success.html

```text
{% extends "zerver/portico.html" %}

{% block title %}
<title>{{ _("Email settings updated") }} | Zulip</title>
{% endblock %}

{% block portico_content %}

<div class="app portico-page">
    <div class="app-main portico-page-container center-block flex full-page account-creation new-style">
        <div class="inline-block">

            <div class="get-started">
                <h1>{{ _("Email settings updated") }}</h1>
            </div>

            <div class="white-box">
                <p>
                    {% trans %}
                    You've successfully unsubscribed from Zulip {{ subscription_type }} emails for
                    <a href="{{ realm_url }}">{{ realm_name }}</a>.
                    {% endtrans %}
                </p>

                {% if subscription_type != "welcome" %}
                <p>
                    {% trans %}
                    You can undo this change or review your preferences in your
                    <a href="{{ realm_url }}/#settings/notifications">notification settings</a>.
                    {% endtrans %}
                </p>
                {% endif %}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: index.html]---
Location: zulip-main/templates/zerver/app/index.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "app" %}
{# The app itself. #}
{# Includes some other templates as tabs. #}

{% set PAGE_TITLE = _("Public view of {org_name} | Zulip team chat").format(org_name=realm_name) %}
{% set PAGE_DESCRIPTION = _("Browse the publicly accessible channels in {org_name} without logging in.").format(org_name=realm_name)  %}

{% block meta_viewport %}
<!--
From version 132, Firefox now defaults to not resize the viewport
content but only the visual viewport. While this works well in
Chrome Android, it creates a buggy experience in Firefox Android
where the compose box is hidden under keyboard. To fix it, we rollback
to resizing content when keyboard is shown on Firefox Android.
TODO: Remove this when Firefox Android fixes the bug -
https://bugzilla.mozilla.org/show_bug.cgi?id=1943053 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no{% if is_firefox_android %}, interactive-widget=resizes-content{% endif %}" />
{% endblock %}

{% block customhead %}
{% if enable_gravatar %}<link rel="dns-prefetch" href="https://secure.gravatar.com" />
{% endif -%}
{% if s3_avatar_public_url_prefix %}<link rel="dns-prefetch" href="{{ s3_avatar_public_url_prefix }}" />
{% endif -%}
<meta name="mobile-web-app-capable" content="yes" />
<link href="{{ static('images/logo/apple-touch-icon-precomposed.png') }}" rel="apple-touch-icon-precomposed" />
<style>
    #app-loading {
    font-size: 16px;
    background-color: hsl(0, 0%, 94%);
    position: fixed;
    height: 100%;
    width: 100%;
    padding: 10px;
    top: 0px;
    left: 0px;
    z-index: 200;
    }
    #app-loading-middle-content, #app-loading-bottom-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    }
    #app-loading-middle-content h3 {
    text-align: center;
    }
    @keyframes showAtEnd {
    99% {
    visibility: hidden;
    }
    100% {
    visibility: visible;
    }
    }
    #app-loading-bottom-content {
    top: unset;
    bottom: 20px;
    animation: 7s showAtEnd;
    animation-fill-mode: forwards;
    visibility: hidden;
    }
    #app-loading-error {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    visibility: hidden;
    }
    :root.dark-theme #app-loading {
    background-color: hsl(0, 0%, 11%);
    color: hsl(236, 33%, 90%);
    }
    @media (prefers-color-scheme: dark) {
    :root.color-scheme-automatic #app-loading {
    background-color: hsl(0, 0%, 11%);
    color: hsl(236, 33%, 90%);
    }
    }

    .app-loading-spinner-container {
    position: relative;
    margin: auto;
    display: flex;
    justify-content: center;
    }
    .app-loading-logo {
    height: 64px;
    padding: 10px;
    }
    @keyframes zspinner {
    to {transform: rotate(360deg);}
    }
    .app-loading-spinner:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    width: 84px;
    height: 84px;
    border-radius: 50%;
    border: 4px solid hsl(0,0%,94%);
    border-top-color: hsl(0,0%,52%);
    animation: zspinner 1s linear infinite;
    }
</style>
{% endblock %}

{% block content %}
<div id="feedback_container">
</div>

<div id="app-loading">
    <div id="app-loading-middle-content">
        <div class="app-loading-spinner-container">
            <div class="app-loading-spinner"></div>
            <svg class="app-loading-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 773.12 773.12"><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#50adff"/><stop offset="1" stop-color="#7877fc"/></linearGradient><circle cx="386.56" cy="386.56" r="386.56" fill="url(#a)"/><path d="M566.66 527.25c0 33.03-24.23 60.05-53.84 60.05H260.29c-29.61 0-53.84-27.02-53.84-60.05 0-20.22 9.09-38.2 22.93-49.09l134.37-120c2.5-2.14 5.74 1.31 3.94 4.19l-49.29 98.69c-1.38 2.76.41 6.16 3.25 6.16h191.18c29.61 0 53.83 27.03 53.83 60.05zm0-281.39c0 20.22-9.09 38.2-22.93 49.09l-134.37 120c-2.5 2.14-5.74-1.31-3.94-4.19l49.29-98.69c1.38-2.76-.41-6.16-3.25-6.16H260.29c-29.61 0-53.84-27.02-53.84-60.05s24.23-60.05 53.84-60.05h252.54c29.61 0 53.83 27.02 53.83 60.05z" fill="#fff"/></svg>
        </div>
    </div>
    <div id="app-loading-bottom-content">
        <p>{% trans %}If this message does not go away, try <a class="reload-lnk">reloading</a> the page.{% endtrans %}</p>
    </div>
    <div id="app-loading-error">
        <p>{% trans %}Error loading Zulip. Try <a class="reload-lnk">reloading</a> the page.{% endtrans %}</p>
    </div>
    <script nonce="{{ csp_nonce }}">
        document.addEventListener('DOMContentLoaded', function () {
            function reload() {
                window.location.reload(true);
            }
            document.querySelectorAll('.reload-lnk').forEach(lnk => lnk.addEventListener('click', reload));
        });
    </script>
</div>

<div id="tooltip-templates-container"></div>
<div id="channels_overlay_container"></div>
<div id="groups_overlay_container"></div>
<div id="drafts_table"></div>
<div id="scheduled_messages_overlay_container"></div>
<div id="reminders-overlay-container"></div>
<div id="settings_overlay_container" class="overlay" data-overlay="settings" aria-hidden="true">
</div>
<div id="message-edit-history-overlay-container"></div>
<div class="informational-overlays overlay" data-overlay="informationalOverlays" aria-hidden="true">
    <div class="overlay-content overlay-container">
        <div class="overlay-tabs">
            <span class="exit">&times;</span>
        </div>
        <div class="overlay-body">
        </div>
    </div>
</div>

<div id="user-profile-modal-holder"></div>

<div id="about-zulip-modal-container"></div>

<div id="read-receipts-modal-container"></div>

<audio id="user-notification-sound-audio">
    <source class="notification-sound-source-ogg" type="audio/ogg" />
    <source class="notification-sound-source-mp3" type="audio/mpeg" />
</audio>
<audio id="realm-default-notification-sound-audio">
    <source class="notification-sound-source-ogg" type="audio/ogg" />
    <source class="notification-sound-source-mp3" type="audio/mpeg" />
</audio>

<div id="alert-popup-container">
    <div id="popup_banners_wrapper" class="banner-wrapper alert-box">
        <div class="alert alert_sidebar alert-error home-error-bar" id="home-error"></div>
        <div class="alert alert_sidebar" id="request-progress-status-banner">
            <div class="alert-zulip-logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 773.12 773.12">
                    <circle cx="386.56" cy="386.56" r="386.56"></circle>
                    <path d="M566.66 527.25c0 33.03-24.23 60.05-53.84 60.05H260.29c-29.61 0-53.84-27.02-53.84-60.05 0-20.22 9.09-38.2 22.93-49.09l134.37-120c2.5-2.14 5.74 1.31 3.94 4.19l-49.29 98.69c-1.38 2.76.41 6.16 3.25 6.16h191.18c29.61 0 53.83 27.03 53.83 60.05zm0-281.39c0 20.22-9.09 38.2-22.93 49.09l-134.37 120c-2.5 2.14-5.74-1.31-3.94-4.19l49.29-98.69c1.38-2.76-.41-6.16-3.25-6.16H260.29c-29.61 0-53.84-27.02-53.84-60.05s24.23-60.05 53.84-60.05h252.54c29.61 0 53.83 27.02 53.83 60.05z"></path>
                </svg>
            </div>
            <div class="loading-indicator"></div>
            <div class="success-indicator">
                <i class="fa fa-check"></i>
            </div>
            <div class="alert-content"></div>
            <div class="exit"></div>
        </div>
    </div>
</div>

<div class="blueslip-error-container"></div>

<div id="navbar-fixed-container">
    <div id="navbar_alerts_wrapper" class="banner-wrapper"></div>
    <div id="header-container"></div>
</div>

<div class="app">
    <div class="app-main">
        <div class="column-left" id="left-sidebar-container">
        </div>
        <div class="column-middle">
            <div class="column-middle-inner">
                <div id="recent_view">
                    <div class="recent_view_container">
                        <div id="recent_view_table"></div>
                    </div>
                    <table id="recent-view-content-table">
                        <tbody data-empty="{{ _('No conversations match your filters.') }}" id="recent-view-content-tbody"></tbody>
                    </table>
                    <div id="recent_view_bottom_whitespace">
                        <div class="bottom-messages-logo">
                            <svg class="messages-logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 773.12 773.12">
                                <circle cx="386.56" cy="386.56" r="386.56"/>
                                <path d="M566.66 527.25c0 33.03-24.23 60.05-53.84 60.05H260.29c-29.61 0-53.84-27.02-53.84-60.05 0-20.22 9.09-38.2 22.93-49.09l134.37-120c2.5-2.14 5.74 1.31 3.94 4.19l-49.29 98.69c-1.38 2.76.41 6.16 3.25 6.16h191.18c29.61 0 53.83 27.03 53.83 60.05zm0-281.39c0 20.22-9.09 38.2-22.93 49.09l-134.37 120c-2.5 2.14-5.74-1.31-3.94-4.19l49.29-98.69c1.38-2.76-.41-6.16-3.25-6.16H260.29c-29.61 0-53.84-27.02-53.84-60.05s24.23-60.05 53.84-60.05h252.54c29.61 0 53.83 27.02 53.83 60.05z"/>
                            </svg>
                        </div>
                        <div id="recent_view_loading_messages_indicator"></div>
                    </div>
                    <!-- Don't show the banner until we have some messages loaded. -->
                    <div class="recent-view-load-more-container main-view-banner info notvisible">
                        <div class="last-fetched-message banner_content">{{ _('This view is still loading messages.') }}</div>
                        <button class="fetch-messages-button main-view-banner-action-button right_edge notvisible">
                            <span class="loading-indicator"></span>
                            <span class="button-label">{{ _('Load more') }}</span>
                        </button>
                    </div>
                </div>
                <div id="inbox-view" class="no-visible-focus-outlines">
                    <div class="inbox-container">
                        <div id="inbox-pane"></div>
                    </div>
                </div>
                <div id="message_feed_container">
                    <div class="message-feed" id="main_div">
                        <div class="top-messages-logo">
                            <svg class="messages-logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 773.12 773.12">
                                <circle cx="386.56" cy="386.56" r="386.56"/>
                                <path d="M566.66 527.25c0 33.03-24.23 60.05-53.84 60.05H260.29c-29.61 0-53.84-27.02-53.84-60.05 0-20.22 9.09-38.2 22.93-49.09l134.37-120c2.5-2.14 5.74 1.31 3.94 4.19l-49.29 98.69c-1.38 2.76.41 6.16 3.25 6.16h191.18c29.61 0 53.83 27.03 53.83 60.05zm0-281.39c0 20.22-9.09 38.2-22.93 49.09l-134.37 120c-2.5 2.14-5.74-1.31-3.94-4.19l49.29-98.69c1.38-2.76-.41-6.16-3.25-6.16H260.29c-29.61 0-53.84-27.02-53.84-60.05s24.23-60.05 53.84-60.05h252.54c29.61 0 53.83 27.02 53.83 60.05z"/>
                            </svg>
                        </div>
                        <div id="loading_older_messages_indicator"></div>
                        <div id="page_loading_indicator"></div>
                        <div id="message_feed_errors_container"></div>
                        <div id="message-lists-container"></div>
                        <div id="scheduled_message_indicator">
                        </div>
                        <div id="mark_read_on_scroll_state_banner">
                        </div>
                        <div id="typing_notifications">
                        </div>
                        <div id="mark_read_on_scroll_state_banner_place_holder">
                        </div>
                        <div id="bottom_whitespace">
                        </div>
                    </div>
                </div>
                <div id="compose" {% if embedded %}data-embedded{% endif %}>
                    <div id="compose-container"></div>
                </div>
            </div>
        </div>
        <div class="column-right" id="right-sidebar-container">
        </div><!--/right sidebar-->
    </div>
</div>

<div class="hidden">
    <form id="logout_form" action="/accounts/logout/" method="POST">{{ csrf_input }}
    </form>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: apple.html]---
Location: zulip-main/templates/zerver/config_error/apple.html

```text
{% extends "zerver/config_error/social-container.html" %}

{% block error_content %}
    <p>
        You are attempting to use the <strong>Apple auth backend</strong>, but it is
        not properly configured. To configure, please check the following:
    </p>
    <ul>
        <li>
            You have registered
            <code>{{ root_domain_url }}/complete/apple/</code> as the callback URL
            for your Services ID in Apple’s developer console. You can enable “Sign
            in with Apple” for an app at
            <a href="https://developer.apple.com/account/resources/">Certificates,
            Identifiers &amp; Profiles</a>.
        </li>
        <li>
            You have set <code>SOCIAL_AUTH_APPLE_SERVICES_ID</code>,
            <code>SOCIAL_AUTH_APPLE_APP_ID</code>,
            <code>SOCIAL_AUTH_APPLE_TEAM</code>, and
            <code>SOCIAL_AUTH_APPLE_KEY</code> in
            <code>{{ auth_settings_path }}</code>
            and stored the private key provided by Apple at
            <code>/etc/zulip/apple-auth-key.p8</code> on the Zulip server, with
            proper permissions set.
        </li>
        <li>
            Navigate back to the login page and attempt the “Sign in with Apple”
            flow again.
        </li>
    </ul>
    {{ super() }}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: container.html]---
Location: zulip-main/templates/zerver/config_error/container.html

```text
{% extends "zerver/portico.html" %}

{% block title %}
<title>{{ _("Configuration error") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div id="config_error_page" class="flex full-page">
    <div class="new-style">
        <div class="pitch">
            <h1>
                {{ _("Configuration error") }}
            </h1>
        </div>
        <div class="white-box">
            <div class="errorbox config-error">
                <div class="errorcontent">
                    {% block error_body %}
                    <p>
                        {% block error_content %}
                        {% endblock %}
                    </p>

                    <p>After making your changes, remember to restart the Zulip server.</p>

                    <p><a href="">Refresh</a> to try again or
                        <a href="{{ go_back_to_url }}">go back to {{ go_back_to_url_name }}</a>.</p>
                    {% endblock %}
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: dev_not_supported.html]---
Location: zulip-main/templates/zerver/config_error/dev_not_supported.html

```text
{% extends "zerver/config_error/container.html" %}

{% block error_content %}
    <p>
        You attempted to use the <code>DevAuthBackend</code> authentication method,
        which is used for logging in without a password in the Zulip development
        environment.
    </p>
    <p>This backend is not available for this realm, either because:</p>
    <ul>
        <li>This Zulip server is configured as a production server.</li>
        <li>
            <code>DevAuthBackend</code> is disabled in
            <code>AUTHENTICATION_BACKENDS</code> in
            <code>{{ auth_settings_path }}</code>.
        </li>
        <li>
            You disabled this authentication backend in
            <a href="/help/configure-authentication-methods">this realm’s
            authentication settings</a>.
        </li>
    </ul>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: github.html]---
Location: zulip-main/templates/zerver/config_error/github.html

```text
{% extends "zerver/config_error/social-container.html" %}

{% block error_content %}
    <p>
        You are attempting to use the <strong>GitHub auth backend</strong>, but it
        is not properly configured. To configure, please check the following:
    </p>
    <ul>
        <li>
            You have added
            <code>{{ root_domain_url }}/complete/github/</code> as the callback URL
            in the OAuth application in GitHub. You can create OAuth apps from
            <a href="https://github.com/settings/developers">GitHub’s developer
            site</a>.
        </li>
        <li>
            You have set <code>{{ client_id_key_name }}</code> in
            <code>{{ auth_settings_path }}</code> and
            <code>social_auth_github_secret</code> in
            <code>{{ secrets_path }}</code> with the values from your OAuth
            application.
        </li>
        <li>
            Navigate back to the login page and attempt the GitHub auth flow again.
        </li>
    </ul>
    {{ super() }}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: gitlab.html]---
Location: zulip-main/templates/zerver/config_error/gitlab.html

```text
{% extends "zerver/config_error/social-container.html" %}

{% block error_content %}
    <p>
        You are attempting to use the <strong>GitLab auth backend</strong>, but it
        is not properly configured. To configure, please check the following:
    </p>
    <ul>
        <li>
            You have added
            <code>{{ root_domain_url }}/complete/gitlab/</code> as the callback URL
            in the OAuth application in GitLab. You can register OAuth apps at
            <a href="https://gitlab.com/profile/applications">GitLab
            applications</a>.
        </li>
        <li>
            You have set <code>{{ client_id_key_name }}</code> in
            <code>{{ auth_settings_path }}</code> and
            <code>social_auth_gitlab_secret</code> in
            <code>{{ secrets_path }}</code> with the values from your OAuth
            application.
        </li>
        <li>
            Navigate back to the login page and attempt the GitLab auth flow again.
        </li>
    </ul>
    {{ super() }}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: google.html]---
Location: zulip-main/templates/zerver/config_error/google.html

```text
{% extends "zerver/config_error/social-container.html" %}

{% block error_content %}
    <p>
        You are attempting to use the <strong>Google auth backend</strong>, but it
        is not properly configured. To configure, please check the following:
    </p>
    <ul>
        <li>
            You have created a Google OAuth2 client and enabled the Identity Toolkit
            API. You can create OAuth2 apps at
            <a href="https://console.developers.google.com">the Google developer
            console</a>.
        </li>
        <li>
            You have configured your OAuth2 client to allow redirects to your
            server’s Google auth URL:
            <code>{{ root_domain_url }}/complete/google/</code>.
        </li>
        <li>
            You have set <code>{{ client_id_key_name }}</code> in
            <code>{{ auth_settings_path }}</code> and
            <code>social_auth_google_secret</code> in
            <code>{{ secrets_path }}</code>.
        </li>
        <li>
            Navigate back to the login page and attempt the Google auth flow again.
        </li>
    </ul>
    {{ super() }}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: ldap.html]---
Location: zulip-main/templates/zerver/config_error/ldap.html

```text
{% extends "zerver/config_error/container.html" %}

{% block error_content %}
    {% trans %}
        You are trying to log in using LDAP without creating an
        organization first. Please use EmailAuthBackend to create
        your organization and then try again.
    {% endtrans %}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: oidc.html]---
Location: zulip-main/templates/zerver/config_error/oidc.html

```text
{% extends "zerver/config_error/container.html" %}

{% block error_content %}
    {# TODO: Improve the config error page for OIDC #}
    <p>
        The OpenID Connect backend is not configured correctly.
    </p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: proxy.html]---
Location: zulip-main/templates/zerver/config_error/proxy.html

```text
{% extends "zerver/config_error/container.html" %}
{% macro setting() -%}
    {%- if docker_config -%}
        <code>LOADBALANCER_IPS</code> in your Docker image's environment
    {%- else -%}
        <code>ips</code> in the <code>loadbalancers</code> section of <code>/etc/zulip/zulip.conf</code>
    {%- endif -%}
{%- endmacro %}

{% block error_body %}

{% if not current_proxies and not x_forwarded_for %}

<p>
    You have not configured any reverse proxies in {{ setting() }},
    and an HTTP request was received without any reverse proxy
    headers.  Zulip requires that all client traffic to it be over
    HTTPS.  Since you have configured Zulip itself to be served over
    HTTP, it must be placed behind a proxy which does TLS termination.
</p>

<p>
    You must configure a reverse proxy in front of Zulip which serves
    traffic over HTTPS, and configure Zulip to trust that proxy, by
    adding its IP to {{ setting() }}.  See our <a href="https://zulip.readthedocs.io/en/stable/production/reverse-proxies.html"
    >documentation about deploying behind reverse proxies</a> for more
    details.
</p>

{% elif not current_proxies %}

<p>
    You have not configured any reverse proxies in {{ setting() }},
    but reverse proxy headers were detected in a request from
    <code>{{ remote_addr }}</code>.
</p>

<p>
    Add <code>{{ remote_addr }}</code> to {{ setting() }} and restart
    your Zulip server.  See
    our <a href="https://zulip.readthedocs.io/en/stable/production/reverse-proxies.html"
    >documentation about deploying behind reverse proxies</a> for more
    details.
</p>

{% elif not x_forwarded_proto %}

<p>
    You have configured reverse proxies (<code>{{ current_proxies }}</code>),
    and traffic is being served through them, but the remote proxy did
    not send an <code>X-Forwarded-Proto</code> header.
</p>

<p>
    Please read our <a href="https://zulip.readthedocs.io/en/stable/production/reverse-proxies.html"
    >documentation about configuring your reverse proxy</a>, and
    configure your proxy to send an <code>X-Forwarded-Proto</code>
    header.
</p>

{% else %}

<p>
    You have configured reverse proxies (<code>{{ current_proxies }}</code>),
    but this request did not come from a matching IP address -- it
    came from <code>{{ remote_addr }}</code>.
</p>

<p>
    You should update {{ setting() }} to include <code>{{ remote_addr }}</code>,
    and restart your Zulip server.  See our <a href="https://zulip.readthedocs.io/en/stable/production/reverse-proxies.html"
    >documentation about deploying behind reverse proxies</a> for more
    details.
</p>

{% endif %}

<hr />

<h2>Request headers:</h2>

<pre>
{% for item in all_headers -%}
{% if item[1] != "" -%}
{{ item[0] }}: {{ item[1] }}
{% endif -%}
{% endfor -%}
</pre>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_billing_bouncer_not_configured.html]---
Location: zulip-main/templates/zerver/config_error/remote_billing_bouncer_not_configured.html

```text
{% extends "zerver/config_error/container.html" %}

{% block error_content %}
    {% trans doc_url="https://zulip.readthedocs.io/en/latest/production/mobile-push-notifications.html" %}
        This server is not configured to use push notifications. For instructions on how to
        configure push notifications, please see the
        <a href="{{ doc_url }}">documentation</a>.
    {% endtrans %}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_user_backend_disabled.html]---
Location: zulip-main/templates/zerver/config_error/remote_user_backend_disabled.html

```text
{% extends "zerver/config_error/container.html" %}

{% block error_content %}
    <p>
        Authentication via the REMOTE_USER header is
        disabled in `/etc/zulip/settings.py`.
    </p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_user_header_missing.html]---
Location: zulip-main/templates/zerver/config_error/remote_user_header_missing.html

```text
{% extends "zerver/config_error/container.html" %}

{% block error_content %}
    <p>
        The REMOTE_USER header is not set.
    </p>
{% endblock %}
```

--------------------------------------------------------------------------------

````
