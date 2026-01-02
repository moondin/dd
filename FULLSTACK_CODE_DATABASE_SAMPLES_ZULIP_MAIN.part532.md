---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 532
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 532 of 1290)

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

---[FILE: realm_details.html]---
Location: zulip-main/templates/corporate/support/realm_details.html

```text
<div class="realm-support-information">
    <span class="cloud-label">Cloud realm</span>
    {% if realm.deactivated %}
    <span class="deactivated-label">DEACTIVATED</span>
    {% endif %}
    <h3><img src="{{ realm_icon_url(realm) }}" class="support-realm-icon" /> {{ realm.name }}</h3>
    {% if realm.plan_type == SPONSORED_PLAN_TYPE %}
        <p class="support-section-header">On 100% sponsored Zulip Standard Free 🎉</p>
    {% endif %}
    {% if realm_support_data[realm.id].sponsorship_data.has_discount %}
        <p class="support-section-header">Has a discount 💸</p>
    {% endif %}
    {% set realm_is_scrubbed = realm_support_data[realm.id].is_scrubbed %}
    {% if realm_is_scrubbed %}
    <b>Realm has been scrubbed</b>
    {% elif realm.deactivated_redirect %}
    <b>Placeholder realm</b><br />
    <b>Redirects to</b>: {{ realm.deactivated_redirect }}
    <a title="Copy URL" class="copy-button" data-clipboard-text="{{ realm.deactivated_redirect }}">
        <i class="fa fa-copy"></i>
    </a>
    {% else %}
    <b>URL</b>: <a target="_blank" rel="noopener noreferrer" href="{{ realm.url }}">{{ realm.url }}</a> |
    <a target="_blank" rel="noopener noreferrer" href="/stats/realm/{{ realm.string_id }}/">stats</a> |
    <a target="_blank" rel="noopener noreferrer" href="/realm_activity/{{ realm.string_id }}/">activity</a><br />
    <b>Date created</b>: {{ realm.date_created|timesince }} ago<br />
    {% set owner_emails_string = get_realm_owner_emails_as_string(realm) %}
    <b>Owners</b>: {{ owner_emails_string }}
    {% if owner_emails_string %}
    <a title="Copy emails" class="copy-button" data-clipboard-text="{{ owner_emails_string }}">
        <i class="fa fa-copy"></i>
    </a>
    {% endif %}
    <br />
    {% set admin_emails_string = get_realm_admin_emails_as_string(realm) %}
    <b>Admins</b>: {{ admin_emails_string }}
    {% if admin_emails_string %}
    <a title="Copy emails" class="copy-button" data-clipboard-text="{{ admin_emails_string }}">
        <i class="fa fa-copy"></i>
    </a>
    {% endif %}
    <br />
    {% set first_human_user = realm.get_first_human_user() %}
    {% if first_human_user %}
    <b>First human user</b>: {{ first_human_user.delivery_email  }}
    <a title="Copy emails" class="copy-button" data-clipboard-text="{{ first_human_user.delivery_email }}">
        <i class="fa fa-copy"></i>
    </a>
    <br />
    {% else %}
    <b>First human user</b>:
    <br />
    {% endif %}
    {% set billing_admins = realm.get_billing_admins_delivery_email() %}
    {% if billing_admins %}
    <b>Billing admins</b>: {{ billing_admins  }}
    <a title="Copy emails" class="copy-button" data-clipboard-text="{{ billing_admins }}">
        <i class="fa fa-copy"></i>
    </a>
    <br />
    {% else %}
    <b>Billing admins</b>:
    <br />
    {% endif %}
    <br />
    {% with %}
        {% set realm = realm %}
        {% set user_data = realm_support_data[realm.id].user_data %}
        {% include 'corporate/support/basic_realm_data.html' %}
    {% endwith %}
    <br />
    <b>File upload usage</b>: {{ realm_support_data[realm.id].file_upload_usage }}<br />
    {% endif %}
</div>
{% if realm_is_scrubbed %}
{% elif not realm.deactivated_redirect %}
<div>
    <div class="realm-management-actions">
        <p class="support-section-header">🛠️ Realm management:</p>
        <form method="POST" class="support-form">
            <b>Status</b>:<br />
            {{ csrf_input }}
            <input type="hidden" name="realm_id" value="{{ realm.id }}" />
            <select name="status">
                <option value="active" {% if not realm.deactivated %}selected{% endif %}>Active</option>
                <option value="deactivated" {% if realm.deactivated %}selected{% endif %}>Deactivated</option>
            </select>
            <button type="submit" class="support-submit-button">Update</button>
        </form>
        {% if not realm.deactivated %}
        <form method="POST" class="support-form">
            <b>New subdomain</b>:<br />
            {{ csrf_input }}
            <input type="hidden" name="realm_id" value="{{ realm.id }}" />
            <input type="text" name="new_subdomain" required />
            <button type="submit" class="support-submit-button">Update</button>
        </form>
        <form method="POST" class="support-form">
            <b>Organization type</b>:<br />
            {{ csrf_input }}
            <input type="hidden" name="realm_id" value="{{ realm.id }}" />
            <select name="org_type" id="org_type">
                {% for organization_type in ORGANIZATION_TYPES %}
                    {% if realm.org_type == organization_type.id %}
                        <option value="{{ organization_type.id }}" selected>{{ organization_type.name }}</option>
                    {% else %}
                        <option value="{{ organization_type.id }}">{{ organization_type.name }}</option>
                    {% endif %}
                {% endfor %}
            </select>
            <button type="submit" class="support-submit-button">Update</button>
        </form>
        <form method="POST" class="support-form">
            <b>Plan type</b>: <i class="fa fa-question-circle-o" data-tippy-content="
            Will also update maximum daily invitations to be the default value for the new plan type.
            " data-tippy-maxWidth="auto"></i><br />
            {{ csrf_input }}
            <input type="hidden" name="realm_id" value="{{ realm.id }}" />
            <select name="plan_type">
                {% for plan_type in REALM_PLAN_TYPES %}
                    {% if realm.plan_type == plan_type.value %}
                        <option value="{{ plan_type.value }}" selected>{{ plan_type.name }}</option>
                    {% else %}
                        <option value="{{ plan_type.value }}">{{ plan_type.name }}</option>
                    {% endif %}
                {% endfor %}
            </select>
            <button type="submit" class="support-submit-button">Update</button>
        </form>
        <form method="POST" class="support-form">
            <b>Maximum daily invitations</b>: <i class="fa fa-question-circle-o" data-tippy-content="
            Setting to zero will attempt to reset this to the default maximum for the current plan type.
            " data-tippy-maxWidth="auto"></i><br />
            {{ csrf_input }}
            <input type="hidden" name="realm_id" value="{{ realm.id }}" />
            <input type="number" name="max_invites" value="{{ realm.max_invites }}" min="0" required />
            <button type="submit" class="support-submit-button">Update</button>
        </form>
        {% endif %}
    </div>
    {% if realm.deactivated %}
    <div class="support-sponsorship-container">
        {% with %}
            {% set sponsorship_data = realm_support_data[realm.id].sponsorship_data %}
            {% set dollar_amount = dollar_amount %}
            {% include 'corporate/support/sponsorship_details.html' %}
        {% endwith %}
    </div>
    {% elif realm.plan_type != SPONSORED_PLAN_TYPE %}
    <div class="support-sponsorship-container">
        {% with %}
            {% set sponsorship_data = realm_support_data[realm.id].sponsorship_data %}
            {% set PLAN_TYPES = REALM_PLAN_TYPES_FOR_DISCOUNT %}
            {% set remote_id = realm.id %}
            {% set remote_type = "realm_id" %}
            {% include 'corporate/support/sponsorship_forms_support.html' %}
        {% endwith %}
    </div>
    {% endif %}
    {% if realm_support_data[realm.id].plan_data.current_plan %}
    <div class="current-plan-container">
        {% with %}
            {% set plan_data = realm_support_data[realm.id].plan_data %}
            {% set dollar_amount = dollar_amount %}
            {% include 'corporate/support/current_plan_details.html' %}
        {% endwith %}

        {% with %}
            {% set current_plan = realm_support_data[realm.id].plan_data.current_plan %}
            {% set remote_id = realm.id %}
            {% set remote_type = "realm_id" %}
            {% include 'corporate/support/current_plan_forms_support.html' %}
        {% endwith %}
    </div>
    {% endif %}

    {% if realm_support_data[realm.id].plan_data.next_plan %}
    <div class="next-plan-container">
        {% with %}
            {% set plan_data = realm_support_data[realm.id].plan_data %}
            {% set dollar_amount = dollar_amount %}
            {% set remote_id = realm.id %}
            {% set remote_type = "realm_id" %}
            {% include 'corporate/support/next_plan_details.html' %}
        {% endwith %}
    </div>
    {% elif not realm.deactivated %}
    <div class="next-plan-container">
        {% with %}
            {% set plan_data = realm_support_data[realm.id].plan_data %}
            {% set remote_id = realm.id %}
            {% set remote_type = "realm_id" %}
            {% include 'corporate/support/next_plan_forms_support.html' %}
        {% endwith %}
    </div>
    {% endif %}
    {% if realm.deactivated %}
    <form method="POST" class="scrub-realm-form support-form">
        <h3>❌ Scrub realm</h3>
        {{ csrf_input }}
        <input type="hidden" name="realm_id" value="{{ realm.id }}" />
        <input type="hidden" name="scrub_realm" value="true" />
        <button data-string-id="{{realm.string_id}}" class="scrub-realm-button">Scrub realm (danger)</button>
    </form>
    {% endif %}
</div>
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: remote_realm_details.html]---
Location: zulip-main/templates/corporate/support/remote_realm_details.html

```text
<div class="remote-realm-container">
    <div class="remote-realm-information">
        <span class="remote-label">Remote realm</span>
        <h3>{{ remote_realm.name }}</h3>
        {% if remote_realm.realm_locally_deleted %}
            <p class="support-section-header">Remote realm is locally deleted 🛑</p>
        {% endif %}
        {% if remote_realm.registration_deactivated %}
            <p class="support-section-header">Remote realm registration deactivated 🛑</p>
        {% endif %}
        {% if remote_realm.realm_deactivated %}
            <p class="support-section-header">Remote realm is deactivated on remote server 🛑</p>
        {% endif %}
        {% if remote_realm.plan_type == SPONSORED_PLAN_TYPE %}
            <p class="support-section-header">On 100% sponsored Zulip Community plan 🎉</p>
        {% endif %}
        {% if support_data[remote_realm.id].sponsorship_data.has_discount %}
            <p class="support-section-header">Has a discount 💸</p>
        {% endif %}
        <b>Remote realm host:</b> {{ remote_realm.host }}<br />
        {% set billing_emails_string = get_remote_realm_billing_user_emails(remote_realm) %}
        <b>Billing users</b>: {{ billing_emails_string }}
        {% if billing_emails_string %}
        <a title="Copy emails" class="copy-button" data-clipboard-text="{{ billing_emails_string }}">
            <i class="fa fa-copy"></i>
        </a>
        {% endif %}
        <br />
        <b>Date created</b>: {{ support_data[remote_realm.id].date_created.strftime('%d %B %Y') }}<br />
        <b>UUID</b>: {{ remote_realm.uuid }}<br />
        <br />
        {% with %}
            {% set realm = remote_realm %}
            {% set user_data = support_data[remote_realm.id].user_data %}
            {% include 'corporate/support/basic_realm_data.html' %}
        {% endwith %}
        <br />
        <b>Mobile user count</b>: {{ support_data[remote_realm.id].mobile_push_data.total_mobile_users }}<br />
        <b>7-day mobile pushes count</b>: {{ support_data[remote_realm.id].mobile_push_data.mobile_pushes_forwarded }}<br />
        <b>Last push notification date</b>: {{ support_data[remote_realm.id].mobile_push_data.last_mobile_push_sent }}<br />
    </div>

    {% with %}
        {% set status = support_data[remote_realm.id].mobile_push_data.push_notification_status %}
        {% include 'corporate/support/push_status_details.html' %}
    {% endwith %}

    {% if remote_server_deactivated %}
    <div class="support-sponsorship-container">
        {% with %}
            {% set sponsorship_data = support_data[remote_realm.id].sponsorship_data %}
            {% set dollar_amount = dollar_amount %}
            {% include 'corporate/support/sponsorship_details.html' %}
        {% endwith %}
    </div>
    {% elif remote_realm.plan_type != SPONSORED_PLAN_TYPE %}
    <div class="support-sponsorship-container">
        {% with %}
            {% set sponsorship_data = support_data[remote_realm.id].sponsorship_data %}
            {% set PLAN_TYPES = REMOTE_PLAN_TIERS %}
            {% set remote_id = remote_realm.id %}
            {% set remote_type = "remote_realm_id" %}
            {% set has_fixed_price = support_data[remote_realm.id].plan_data.has_fixed_price %}
            {% include 'corporate/support/sponsorship_forms_support.html' %}
        {% endwith %}
    </div>
    {% endif %}

    {% if support_data[remote_realm.id].plan_data.current_plan %}
    <div class="current-plan-container">
        {% with %}
            {% set plan_data = support_data[remote_realm.id].plan_data %}
            {% set dollar_amount = dollar_amount %}
            {% include 'corporate/support/current_plan_details.html' %}
        {% endwith %}

        {% with %}
            {% set current_plan = support_data[remote_realm.id].plan_data.current_plan %}
            {% set remote_id = remote_realm.id %}
            {% set remote_type = "remote_realm_id" %}
            {% include 'corporate/support/current_plan_forms_support.html' %}
        {% endwith %}
    </div>
    {% endif %}

    {% if support_data[remote_realm.id].plan_data.next_plan %}
    <div class="next-plan-container">
        {% with %}
            {% set plan_data = support_data[remote_realm.id].plan_data %}
            {% set dollar_amount = dollar_amount %}
            {% set remote_id = remote_realm.id %}
            {% set remote_type = "remote_realm_id" %}
            {% include 'corporate/support/next_plan_details.html' %}
        {% endwith %}
    </div>
    {% elif not remote_server_deactivated %}
    <div class="next-plan-container">
        {% with %}
            {% set plan_data = support_data[remote_realm.id].plan_data %}
            {% set remote_id = remote_realm.id %}
            {% set remote_type = "remote_realm_id" %}
            {% include 'corporate/support/next_plan_forms_support.html' %}
        {% endwith %}
    </div>
    {% endif %}
</div>
```

--------------------------------------------------------------------------------

---[FILE: remote_server_support.html]---
Location: zulip-main/templates/corporate/support/remote_server_support.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "support" %}

{# Remote servers. #}

{% block title %}
<title>Remote servers</title>
{% endblock %}


{% block content %}
<div class="container">
    <form class="support-search-form">
        <center>
            <input type="text" name="q" class="input-xxlarge search-query" placeholder="hostname, UUID or contact email" value="{{ request.GET.get('q', '') }}" autofocus />
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

    <div id="remote-server-query-results">
        {% for remote_server in remote_servers %}
        {% if remote_server.deactivated %}
        {% set remote_server_query_result_class = "remote-support-query-result remote-server-deactivated" %}
        {% else %}
        {% set remote_server_query_result_class = "remote-support-query-result" %}
        {% endif %}
        <div class="{{ remote_server_query_result_class }}">
            <div class="remote-server-section">
                <div class="remote-server-information">
                    <span class="remote-label">Remote server{% if remote_server.deactivated %}: deactivated{% endif %}</span>
                    <h3>{{ remote_server.hostname }} {{ server_analytics_link(remote_server.id ) }}</h3>
                    {% if remote_server.plan_type == SPONSORED_PLAN_TYPE %}
                        <p class="support-section-header">On 100% sponsored Zulip Community plan 🎉</p>
                    {% endif %}
                    {% if remote_servers_support_data[remote_server.id].sponsorship_data.has_discount %}
                        <p class="support-section-header">Has a discount 💸</p>
                    {% endif %}
                    <b>Contact email</b>: {{ remote_server.contact_email }}
                    <a title="Copy email" class="copy-button" data-clipboard-text="{{ remote_server.contact_email }}">
                        <i class="fa fa-copy"></i>
                    </a>
                    <br />
                    {% set billing_emails_string = get_remote_server_billing_user_emails(remote_server) %}
                    <b>Billing users</b>: {{ billing_emails_string }}
                    {% if billing_emails_string %}
                    <a title="Copy emails" class="copy-button" data-clipboard-text="{{ billing_emails_string }}">
                        <i class="fa fa-copy"></i>
                    </a>
                    {% endif %}
                    <br />
                    <b>UUID</b>: {{ remote_server.uuid }}<br />
                    <b>Date created</b>: {{ remote_servers_support_data[remote_server.id].date_created.strftime('%d %B %Y') }}<br />
                    <b>Zulip version</b>: {{ remote_server.last_version }}<br />
                    <b>Has remote realms</b>: {{ remote_realms[remote_server.id] != [] }}<br />
                    <br />
                    <b>Max monthly messages</b>: {{ remote_server_to_max_monthly_messages[remote_server.id] }}<br />
                    {% if remote_servers_support_data[remote_server.id].has_stale_audit_log %}
                        <span class="stale-audit-log"><b>Last audit log update (UTC)</b>: {{ format_optional_datetime(remote_server.last_audit_log_update, True) }}</span><br />
                    {% else %}
                        <span class="current-audit-log"><b>Last audit log update (UTC)</b>: {{ format_optional_datetime(remote_server.last_audit_log_update, True) }}</span><br />
                    {% endif %}
                    <b>Plan type</b>: {{ get_plan_type_name(remote_server.plan_type) }}<br />
                    <b>Non-guest user count</b>: {{ remote_servers_support_data[remote_server.id].user_data.non_guest_user_count }}<br />
                    <b>Guest user count</b>: {{ remote_servers_support_data[remote_server.id].user_data.guest_user_count }}<br />
                    <a target="_blank" rel="noopener noreferrer" href="/activity/remote/logs/server/{{ remote_server.uuid }}/">View audit logs</a><br />
                    <br />
                    <b>Total mobile user count</b>: {{ remote_servers_support_data[remote_server.id].mobile_push_data.total_mobile_users }}<br />
                    {% if remote_realms[remote_server.id] != [] %}
                        <b>Uncategorized mobile user count:</b> {{ remote_servers_support_data[remote_server.id].mobile_push_data.uncategorized_mobile_users }}<br />
                    {% endif %}
                    <b>7-day mobile pushes count</b>: {{ remote_servers_support_data[remote_server.id].mobile_push_data.mobile_pushes_forwarded }}<br />
                    <b>Last push notification date</b>: {{ remote_servers_support_data[remote_server.id].mobile_push_data.last_mobile_push_sent }}<br />
                </div>

                {% with %}
                    {% set status = remote_servers_support_data[remote_server.id].mobile_push_data.push_notification_status %}
                    {% include 'corporate/support/push_status_details.html' %}
                {% endwith %}

                {% if remote_server.deactivated %}
                <div class="support-sponsorship-container">
                    {% with %}
                        {% set sponsorship_data = remote_servers_support_data[remote_server.id].sponsorship_data %}
                        {% include 'corporate/support/sponsorship_details.html' %}
                    {% endwith %}
                </div>
                {% elif remote_server.plan_type != SPONSORED_PLAN_TYPE %}
                <div class="support-sponsorship-container">
                    {% with %}
                        {% set sponsorship_data = remote_servers_support_data[remote_server.id].sponsorship_data %}
                        {% set PLAN_TYPES = REMOTE_PLAN_TIERS %}
                        {% set remote_id = remote_server.id %}
                        {% set remote_type = "remote_server_id" %}
                        {% set has_fixed_price = remote_servers_support_data[remote_server.id].plan_data.has_fixed_price %}
                        {% include 'corporate/support/sponsorship_forms_support.html' %}
                    {% endwith %}
                </div>
                {% endif %}

                {% if remote_servers_support_data[remote_server.id].plan_data.current_plan %}
                <div class="current-plan-container">
                    {% with %}
                        {% set plan_data = remote_servers_support_data[remote_server.id].plan_data %}
                        {% set dollar_amount = dollar_amount %}
                        {% include 'corporate/support/current_plan_details.html' %}
                    {% endwith %}

                    {% with %}
                        {% set current_plan = remote_servers_support_data[remote_server.id].plan_data.current_plan %}
                        {% set remote_id = remote_server.id %}
                        {% set remote_type = "remote_server_id" %}
                        {% include 'corporate/support/current_plan_forms_support.html' %}
                    {% endwith %}
                </div>
                {% endif %}

                {% if remote_servers_support_data[remote_server.id].plan_data.next_plan %}
                <div class="next-plan-container">
                    {% with %}
                        {% set plan_data = remote_servers_support_data[remote_server.id].plan_data %}
                        {% set dollar_amount = dollar_amount %}
                        {% set remote_id = remote_server.id %}
                        {% set remote_type = "remote_server_id" %}
                        {% include 'corporate/support/next_plan_details.html' %}
                    {% endwith %}
                </div>
                {% elif not remote_server.deactivated %}
                <div class="next-plan-container">
                    {% with %}
                        {% set plan_data = remote_servers_support_data[remote_server.id].plan_data %}
                        {% set remote_id = remote_server.id %}
                        {% set remote_type = "remote_server_id" %}
                        {% include 'corporate/support/next_plan_forms_support.html' %}
                    {% endwith %}
                </div>
                {% endif %}

                {% if remote_server.deactivated %}
                <form method="POST" class="reactivate-remote-server-form">
                    {{ csrf_input }}
                    <input type="hidden" name="remote_server_id" value="{{ remote_server.id }}" />
                    <input type="hidden" name="remote_server_status" value="active" />
                    <button class="reactivate-remote-server-button"><b>Reactivate</b>: {{ remote_server.hostname }}</button>
                </form>
                {% else %}
                <form method="POST" class="deactivate-remote-server-form">
                    {{ csrf_input }}
                    <input type="hidden" name="remote_server_id" value="{{ remote_server.id }}" />
                    <input type="hidden" name="remote_server_status" value="deactivated" />
                    <button class="deactivate-remote-server-button"><b>Deactivate</b>: {{ remote_server.hostname }}</button>
                </form>
                {% endif %}
            </div>
            <div class="remote-realms-section">
                {% if remote_realms[remote_server.id] == [] %}
                <div>
                    <span class="remote-label">Remote realm</span>
                    <h3>None</h3>
                </div>
                {% else %}
                {% for remote_realm in remote_realms[remote_server.id] %}
                <div>
                    {% with %}
                        {% set remote_server_deactivated = remote_server.deactivated %}
                        {% set support_data = remote_realms_support_data %}
                        {% set get_plan_type_name = get_plan_type_name %}
                        {% set format_optional_datetime = format_optional_datetime %}
                        {% set dollar_amount = dollar_amount %}
                        {% include "corporate/support/remote_realm_details.html" %}
                    {% endwith %}
                </div>
                {% endfor %}
                {% endif %}
            </div>
        </div>
        {% endfor %}
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: sales_support_request.html]---
Location: zulip-main/templates/corporate/support/sales_support_request.html

```text
{% extends "zerver/portico_signup.html" %}

{% set PAGE_TITLE = "Contact sales | Zulip" %}

{% block portico_content %}
<div class="register-account flex full-page">
    <div class="center-block new-style">
        <div class="pitch">
            <h1>Contact sales</h1>
        </div>

        <form method="post" class="white-box" id="registration">
            {{ csrf_input }}

            <fieldset class="support-request">
                <div class="input-box support-form-field">
                    <label for="contact_sales_from" class="inline-block label-title">From</label>
                    <div id="contact_sales_from" class="not-editable-realm-field">
                        {{ user_full_name }} ({{ user_email }})
                    </div>
                </div>
                <div class="input-box support-form-field">
                    <label for="sales_support_request_form_organization_website" class="inline-block label-title">Organization website</label>
                    <input id="sales_support_request_form_organization_website" class="required" type="url" name="organization_website" required />
                </div>
                <div class="input-box support-form-field">
                    <label for="sales_support_request_form_expected_user_count" class="inline-block label-title">Expected number of users (approximate range)</label>
                    <input id="sales_support_request_form_expected_user_count" class="required" type="text" name="expected_user_count" maxlength="{{ MAX_INPUT_LENGTH }}" required />
                </div>
                <div class="input-box support-form-field">
                    <label for="sales_support_request_form_message" class="inline-block label-title">Please tell us about your organization and how we can help.</label>
                    <textarea id="sales_support_request_form_message" name="message" cols="100" rows="5" required></textarea>
                </div>

                <div class="register-button-box">
                    <button class="register-button support-submit-button" type="submit">
                        <span>Submit</span>
                        <object class="loader" type="image/svg+xml" data="{{ static('images/loading/loader-white.svg') }}"></object>
                    </button>
                </div>
                <div class="input-box" id="sales-support-form-bottom-info">
                    <div class="not-editable-realm-field">
                        Your message will be sent to <a href="mailto:sales@zulip.com">Zulip Sales</a>.
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: sponsorship_details.html]---
Location: zulip-main/templates/corporate/support/sponsorship_details.html

```text
<div class="remote-sponsorship-details">
    <p class="support-section-header">💸 Discounts and sponsorship information:</p>
    <b>Sponsorship pending</b>: {{ sponsorship_data.sponsorship_pending }}<br />
    {% if sponsorship_data.has_discount %}
        {% if sponsorship_data.monthly_discounted_price %}
            <b>Discounted price (monthly)</b>: {{ dollar_amount(sponsorship_data.monthly_discounted_price) }}%<br />
        {% endif %}
        {% if sponsorship_data.annual_discounted_price %}
            <b>Discounted price (annual)</b>: {{ dollar_amount(sponsorship_data.monthly_discounted_price) }}%<br />
        {% endif %}
    {% else %}
        <b>Discounted price</b>: None<br />
    {% endif %}
    <b>Minimum licenses</b>: {{ sponsorship_data.minimum_licenses }}<br />
    {% if sponsorship_data.required_plan_tier %}
        {% for plan_tier in REMOTE_PLAN_TIERS %}
            {% if sponsorship_data.required_plan_tier == plan_tier.value %}
                <b>Required plan tier</b>: {{ plan_tier.name }}<br />
            {% endif %}
        {% endfor %}
    {% else %}
        <b>Required plan tier</b>: None<br />
    {% endif %}
</div>

{% if sponsorship_data.sponsorship_pending %}
    {% with %}
        {% set latest_sponsorship_request = sponsorship_data.latest_sponsorship_request %}
        {% include 'corporate/support/sponsorship_request_details.html' %}
    {% endwith %}
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: sponsorship_discount_forms.html]---
Location: zulip-main/templates/corporate/support/sponsorship_discount_forms.html

```text
<form method="POST" class="support-form">
    <b>Required plan tier for discounts and fixed prices</b>:<br />
    <i>Updates will not change any pre-existing plans or scheduled upgrades.</i><br />
    {{ csrf_input }}
    <input type="hidden" name="{{ remote_type }}" value="{{ remote_id }}" />
    <select name="required_plan_tier">
        {% for plan_tier in PLAN_TYPES %}
            {% if sponsorship_data.required_plan_tier == plan_tier.value %}
                <option value="{{ plan_tier.value }}" selected>{{ plan_tier.name }}</option>
            {% else %}
                <option value="{{ plan_tier.value }}">{{ plan_tier.name }}</option>
            {% endif %}
        {% endfor %}
    </select>
    <button type="submit" class="support-submit-button">Update</button>
</form>

<form method="POST" class="discounted-price-form support-form">
    <b>Discounted price <i class="fa fa-question-circle-o" data-tippy-content="
        Needs required plan tier to be set.<br />
        Default price for tier will be used if discounted price for the schedule is not specified or is 0.<br />
        Updates will change pre-existing plans and scheduled upgrades.<br />
        Any prorated licenses for the current billing cycle will be billed at the updated discounted rate.<br />
        Customer will lose flat discounted months regardless of value specified.<br />
        " data-tippy-allowHTML="true" data-tippy-maxWidth="auto"></i></b>
    {{ csrf_input }}
    <input type="hidden" name="{{ remote_type }}" value="{{ remote_id }}" />
    {% if has_fixed_price %}
    <input type="number" value="{{ sponsorship_data.monthly_discounted_price }}" placeholder="Monthly discounted price" disabled />
    <input type="number" value="{{ sponsorship_data.annual_discounted_price }}" placeholder="Annual discounted price" disabled />
    <button type="submit" class="support-submit-button" disabled>Update</button>
    {% else %}
    <span>Monthly (cents)</span>
    <input type="number" name="monthly_discounted_price" value="{{ sponsorship_data.monthly_discounted_price }}" placeholder="Monthly discounted price" data-original-monthly-price="{{ sponsorship_data.original_monthly_plan_price }}"
      {% if sponsorship_data.required_plan_tier %}
      required
      {% else %}
      disabled
      {% endif %}
      />
    <span>Annual (cents)</span>
    <input type="number" name="annual_discounted_price" value="{{ sponsorship_data.annual_discounted_price }}" placeholder="Annual discounted price" data-original-annual-price="{{ sponsorship_data.original_annual_plan_price }}"
      {% if sponsorship_data.required_plan_tier %}
      required
      {% else %}
      disabled
      {% endif %}
      />
    <button type="submit" class="support-submit-button">Update</button>
    {% endif %}
</form>

{% if not has_fixed_price and (sponsorship_data.monthly_discounted_price or sponsorship_data.annual_discounted_price or sponsorship_data.minimum_licenses) %}
<form method="POST" class="support-form">
    <b>Minimum licenses</b>:<br />
    {{ csrf_input }}
    <input type="hidden" name="{{ remote_type }}" value="{{ remote_id }}" />
    <input type="number" name="minimum_licenses" value="{{ sponsorship_data.minimum_licenses }}" required />
    <button type="submit" class="support-submit-button">Update</button>
</form>
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: sponsorship_forms_support.html]---
Location: zulip-main/templates/corporate/support/sponsorship_forms_support.html

```text
<p class="support-section-header">💸 Discounts and sponsorship:</p>
<form method="POST" class="support-form">
    <b>Sponsorship pending</b>:<br />
    {{ csrf_input }}
    <input type="hidden" name="{{ remote_type }}" value="{{ remote_id }}" />
    <select name="sponsorship_pending">
        <option value="true" {% if sponsorship_data.sponsorship_pending %}selected{% endif %}>Yes</option>
        <option value="false" {% if not sponsorship_data.sponsorship_pending %}selected{% endif %}>No</option>
    </select>
    <button type="submit" class="support-submit-button">Update</button>
</form>

{% if sponsorship_data.sponsorship_pending %}
<form method="POST" class="support-form">
    {{ csrf_input }}
    <input type="hidden" name="{{ remote_type }}" value="{{ remote_id }}" />
    <input type="hidden" name="approve_sponsorship" value="true" />
    <button class="approve-sponsorship-button">
        Approve full sponsorship
    </button>
</form>
{% endif %}

{% with %}
    {% set PLAN_TYPES = PLAN_TYPES %}
    {% include 'corporate/support/sponsorship_discount_forms.html' %}
{% endwith %}

{% if sponsorship_data.sponsorship_pending %}
    {% with %}
        {% set latest_sponsorship_request = sponsorship_data.latest_sponsorship_request %}
        {% include 'corporate/support/sponsorship_request_details.html' %}
    {% endwith %}
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: sponsorship_request_details.html]---
Location: zulip-main/templates/corporate/support/sponsorship_request_details.html

```text
<div class="remote-sponsorship-details">
    <p class="support-section-header">Sponsorship request information:</p>
    {% if latest_sponsorship_request %}
        <ul>
            <li><b>Organization type</b>: {{ latest_sponsorship_request.org_type }}</li>
            <li><b>Organization website</b>: {{ latest_sponsorship_request.org_website }}</li>
            <li><b>Organization description</b>: {{ latest_sponsorship_request.org_description }}</li>
            <li><b>Estimated total users</b>: {{ latest_sponsorship_request.total_users }}</li>
            <li><b>Paid staff</b>: {{ latest_sponsorship_request.paid_users }}</li>
            <li><b>Description of paid staff</b>: {{ latest_sponsorship_request.paid_users_description }}</li>
            {% if latest_sponsorship_request.requested_plan != "" %}
            <li><b>Requested plan</b>: {{ latest_sponsorship_request.requested_plan }}</li>
            {% endif %}
        </ul>
    {% else %}
        <b>No sponsorship requests have been submitted.</b>
    {% endif %}
</div>
```

--------------------------------------------------------------------------------

````
