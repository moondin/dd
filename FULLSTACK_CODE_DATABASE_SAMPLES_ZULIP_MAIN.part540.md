---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 540
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 540 of 1290)

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

---[FILE: confirm_demo_organization_email.txt]---
Location: zulip-main/templates/zerver/emails/confirm_demo_organization_email.txt

```text
{% trans -%}
Hi,
{%- endtrans %}


{% trans -%}
We received a request to add the email address {{ new_email }} to your Zulip demo organization account on {{ realm_url }}. To confirm this update and set a password for this account, please click below:
{%- endtrans %}


{{ activate_url }}

{% trans -%}
If you did not request this change, please contact us immediately at <{{ support_email }}>.
{%- endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: confirm_new_email.html]---
Location: zulip-main/templates/zerver/emails/confirm_new_email.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}
<p>{% trans %}Hi,{% endtrans %}</p>

<p>{% trans realm_url=macros.link_tag(realm_url), old_email=macros.email_tag(old_email), new_email=macros.email_tag(new_email) %}We received a request to change the email address for the Zulip account on {{ realm_url }} from {{ old_email }} to {{ new_email }}. To confirm this change, please click below:{% endtrans %}
    <a class="button" href="{{ activate_url }}">{{_('Confirm email change') }}</a></p>

<p>{% trans support_email=macros.email_tag(support_email) %}If you did not request this change, please contact us immediately at {{ support_email }}.{% endtrans %}</p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: confirm_new_email.subject.txt]---
Location: zulip-main/templates/zerver/emails/confirm_new_email.subject.txt

```text
{% trans %}Verify your new email address for {{ organization_host }}{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: confirm_new_email.txt]---
Location: zulip-main/templates/zerver/emails/confirm_new_email.txt

```text
{% trans -%}
Hi,
{%- endtrans %}


{% trans -%}
We received a request to change the email address for the Zulip account on {{ realm_url }} from {{ old_email }} to {{ new_email }}. To confirm this change, please click below:
{%- endtrans %}


{{ activate_url }}

{% trans -%}
If you did not request this change, please contact us immediately at <{{ support_email }}>.
{%- endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: confirm_registration.html]---
Location: zulip-main/templates/zerver/emails/confirm_registration.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/registration_confirmation.png" alt=""/>
{% endblock %}

{% block content %}
    {% if create_realm %}
        <p>
            {{ _("You have requested a new Zulip organization:") }}
        </p>
        <ul>
            <li>{% trans %}Organization URL: {{ organization_url }}{% endtrans %}</li>
            <li>{% trans %}Organization type: {{ organization_type }}{% endtrans %}</li>
        </ul>
    {% else %}
        <p>
            {{ _("You recently signed up for Zulip. Awesome!") }}
        </p>
    {% endif %}
    <p>
        {% if create_realm %}
        {{ _("Click the button below to create the organization and register your account. You'll be able to update the information above if you like.") }}
        {% else %}
        {{ _("Click the button below to complete registration.") }}
        {% endif %}
        <a class="button" href="{{ activate_url }}">{{ _("Complete registration") }}</a>
    </p>
    <p>
        {% if corporate_enabled %}
            {{macros.contact_us_zulip_cloud(support_email)}}
        {% else %}
            {{macros.contact_us_self_hosted(support_email)}}
        {% endif %}
    </p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: confirm_registration.subject.txt]---
Location: zulip-main/templates/zerver/emails/confirm_registration.subject.txt

```text
{% if create_realm %}
{{ _("Create your Zulip organization") }}
{% else %}
{{ _("Activate your Zulip account") }}
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: confirm_registration.txt]---
Location: zulip-main/templates/zerver/emails/confirm_registration.txt

```text
{% if create_realm %}
{{ _("You have requested a new Zulip organization:") }}
* {% trans %}Organization URL: {{ organization_url }}{% endtrans %}

* {% trans %}Organization type: {{ organization_type }}{% endtrans %}
{% else %}
{{ _("You recently signed up for Zulip. Awesome!") }}
{% endif %}


{% if create_realm %}
{{ _("Click the button below to create the organization and register your account. You'll be able to update the information above if you like.") }}
{% else %}
{{ _("Click the link below to complete registration.") }}
{% endif %}
    <{{ activate_url }}>

{% if corporate_enabled %}
    {% trans %}Do you have questions or feedback to share? Contact us at {{ support_email }} — we'd love to help!{% endtrans %}
{% else %}
    {% trans %}If you have any questions, please contact this Zulip server's administrators at {{ support_email }}.{% endtrans %}
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: custom_email_base.pre.html]---
Location: zulip-main/templates/zerver/emails/custom_email_base.pre.html

```text
{% extends "zerver/emails/email_base_marketing.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}

{# Note: The below code is substituted by `manage.py send_custom_email` #}
{{ rendered_input }}

{% endblock %}

{% block manage_preferences %}
    {% if remote_server_email %}
        {% if released_version %}
        <p>You are receiving this email because you opted into release notifications.</p>
        {% else %}
        <p>You are receiving this email to update you about important changes to Zulip's Terms of Service.</p>
        <a href="{{ unsubscribe_link }}">Unsubscribe</a>
        {% endif %}
    {% elif unsubscribe_link %}
        <p><a href="{{ realm_url }}/#settings/notifications">{{ _("Manage email preferences") }}</a> | <a href="{{ unsubscribe_link }}">{{ _("Unsubscribe from marketing emails") }}</a></p>
    {% endif %}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: custom_email_base.pre.manage_preferences_block.txt]---
Location: zulip-main/templates/zerver/emails/custom_email_base.pre.manage_preferences_block.txt

```text

---
{% if remote_server_email %}
{% if released_version %}
You are receiving this email because you opted into release notifications.
{% else %}
You are receiving this email to update you about important changes to Zulip's Terms of Service.

Unsubscribe: {{ unsubscribe_link }}
{% endif %}
{% elif unsubscribe_link %}
{{ _("Manage email preferences") }}:

{{ realm_url }}/#settings/notifications

{{ _("Unsubscribe from marketing emails") }}:

{{ unsubscribe_link }}
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: deactivate.html]---
Location: zulip-main/templates/zerver/emails/deactivate.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}
{% trans %}
Your Zulip account on <a href="{{ realm_url }}">{{ realm_url }}</a> has been deactivated, and you will no longer be able to log in.
{% endtrans %}

<br/><br/>

{% if deactivation_notification_comment %}
{{ _("The administrators provided the following comment:") }}

<pre class="deactivated-user-text">{{ deactivation_notification_comment }}</pre>
{% endif %}

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: deactivate.subject.txt]---
Location: zulip-main/templates/zerver/emails/deactivate.subject.txt

```text
{% trans %}Notification of account deactivation on {{ realm_name }}{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: deactivate.txt]---
Location: zulip-main/templates/zerver/emails/deactivate.txt

```text
{% trans %}
Your Zulip account on {{ realm_url }} has been deactivated, and you will no longer be able to log in.
{% endtrans %}

{% if deactivation_notification_comment %}
{{ _("The administrators provided the following comment:") }}

{{ deactivation_notification_comment }}
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: demo_request.html]---
Location: zulip-main/templates/zerver/emails/demo_request.html

```text
{% extends "zerver/emails/email_base_messages.html" %}

{% block content %}
<b>Subject</b>: Demo request for {{ organization_name }}
<br />
<b>Full name</b>: {{ full_name }}
<br />
<b>Email</b>: {{ email }}
<br />
<b>Role</b>: {{ role }}
<br />
<b>Organization type</b>: {{ organization_type }}
<br />
<b>Organization website</b>: {{ organization_website }}
<br />
<b>Expected user count</b>: {{ expected_user_count }}
<br />
<b>Cloud or self-hosting?</b>: {{ type_of_hosting }}
<br />
<b>Message</b>: {{ message }}
<br />

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: demo_request.subject.txt]---
Location: zulip-main/templates/zerver/emails/demo_request.subject.txt

```text
Demo request for {{organization_name}}
```

--------------------------------------------------------------------------------

---[FILE: demo_request.txt]---
Location: zulip-main/templates/zerver/emails/demo_request.txt

```text
Subject: Demo request for {{ organization_name }}

Full name: {{ full_name }}

Email: {{ email }}

Role: {{ role }}

Organization type: {{ organization_type }}

Organization website: {{ organization_website }}

Expected user count: {{ expected_user_count }}

Cloud or self-hosting?: {{ type_of_hosting }}

Message: {{ message }}
```

--------------------------------------------------------------------------------

---[FILE: digest.html]---
Location: zulip-main/templates/zerver/emails/digest.html

```text
{% extends "zerver/emails/email_base_messages.html" %}

{% block content %}
    {% if show_message_content %}
    {% if hot_conversations %}
        {% for convo in hot_conversations %}
        <div class='messages'>
            {% with recipient_block=convo.first_few_messages %}
                <div class='hot_convo_recipient_block'>
                    <div class='hot_convo_recipient_header'>{{ recipient_block.header.html|safe }}</div>
                    <div class='hot_convo_message_content'>
                        {% for sender_block in recipient_block.senders %}
                            {% for message_block in sender_block.content %}
                            <div class='hot_convo_message_content_block'>
                                {{ message_block.html|safe }}
                            </div>
                            {% endfor %}
                        {% endfor %}
                    </div>
                </div>
                {% if convo.count > 0 %}<p class="digest_paragraph">+ {{ convo.count }} more message{{ convo.count|pluralize }} by {{ convo.participants|display_list(4) }}.</p>{% endif %}
            {% endwith %}
        </div>
        {% endfor %}
    {% endif %}

    {% if new_channels.html %}
    <p class="digest_paragraph"><b>{% trans %}New channels{% endtrans %}</b></p>

    <p class="digest_paragraph">{{ new_channels.html|display_list(1000)|safe }}.</p>
    {% endif %}
    {% else %}
    <p class="digest_paragraph">
        {% if new_messages_count > 0 and new_streams_count > 0 %}
            {% trans %}You have {{ new_messages_count }} new messages, and there are {{ new_streams_count }} new channels in <a href="{{ realm_url }}">{{ realm_name }}</a>.{% endtrans %}
        {% elif new_messages_count > 0 and new_streams_count == 0 %}
            {% trans %}You have {{ new_messages_count }} new messages in <a href="{{ realm_url }}">{{ realm_name }}</a>.{% endtrans %}
        {% else  %}
            {% trans %}There are {{ new_streams_count }} new channels in <a href="{{ realm_url }}">{{ realm_name }}</a>.{% endtrans %}
        {% endif %}
    </p>
    <p class="digest_paragraph">
        {% if message_content_disabled_by_realm %}
        {% trans help_url=realm_url + "/help/hide-message-content-in-emails" %}This email does not include message content because your organization <a class="content_disabled_help_link" href="{{ help_url }}">hides message content</a> in email notifications.{% endtrans %}
        {% elif message_content_disabled_by_user %}
        {% trans help_url=realm_url + "/help/email-notifications#hide-message-content" %}This email does not include message content because you have chosen to <a class="content_disabled_help_link" href="{{ help_url }}">hide message content</a> in email notifications.{% endtrans %}
        {% endif %}
    </p>
    {% endif %}
    <p class="digest_paragraph">{% trans %}<a href="{{ realm_url }}">Log in</a> to Zulip to catch up.{% endtrans %}</p>
{% endblock %}

{% block manage_preferences %}
<p class="digest_paragraph">
    <a href="{{ realm_url }}/#settings/notifications">{% trans %}Manage email preferences{% endtrans %}</a> |
    <a href="{{ unsubscribe_link }}">{% trans %}Unsubscribe from digest emails{% endtrans %}</a>
</p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: digest.subject.txt]---
Location: zulip-main/templates/zerver/emails/digest.subject.txt

```text
{% trans %}Zulip digest for {{ realm_name }}{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: digest.txt]---
Location: zulip-main/templates/zerver/emails/digest.txt

```text
{% if show_message_content %}
{% if hot_conversations %}
{% for convo in hot_conversations %}{% with recipient_block=convo.first_few_messages %}{{ recipient_block.header.plain }}
{% for sender_block in recipient_block.senders %}
{% for message_block in sender_block.content %}{{ message_block.plain }}
{% endfor %}{% endfor %}
{% if convo.count > 0 %}+ {{ convo.count }} more message{{ convo.count|pluralize }} by {{ convo.participants|display_list(4) }}.{% endif %}{% endwith %}{% endfor %}{% endif %}

{% if new_channels.plain %}** {% trans %}New channels{% endtrans %} **
    {{ new_channels.plain|display_list(1000) }}.
{% endif %}
{% else %}
{% if new_messages_count > 0 and new_streams_count > 0 %}
{% trans %}You have {{ new_messages_count }} new messages, and there are {{ new_streams_count }} new channels in {{ realm_name }}.{% endtrans %}
{% elif new_messages_count > 0 and new_streams_count == 0 %}
{% trans %}You have {{ new_messages_count }} new messages in {{ realm_name }}.{% endtrans %}
{% else %}
{% trans %}There are {{ new_streams_count }} new channels in {{ realm_name }}.{% endtrans %}
{% endif %}

{% if message_content_disabled_by_realm %}
{% trans hide_content_url=realm_url + "/help/hide-message-content-in-emails" %}
This email does not include message content because your organization hides message content in email notifications. See {{ hide_content_url }} for more details.
{% endtrans %}
{% elif message_content_disabled_by_user %}
{% trans help_url=realm_url + "/help/email-notifications#hide-message-content" %}
This email does not include message content because you have chosen to hide message content in email notifications. See {{ help_url }} for more details.
{% endtrans %}
{% endif %}
{% endif %}

{% trans organization_url=realm_url %}Log in to Zulip to catch up: {{ organization_url }}.{% endtrans %}

--
{% trans %}Manage email preferences:{% endtrans %}

{{ realm_url }}/#settings/notifications

{% trans %}Unsubscribe from digest emails:{% endtrans %}

{{ unsubscribe_link }}
```

--------------------------------------------------------------------------------

---[FILE: email.css]---
Location: zulip-main/templates/zerver/emails/email.css

```text
/* stylelint-disable color-no-hex, media-feature-range-notation */

/* Hex color codes are used instead of our standard of hsl colors,
   because hex color codes are rendered by all email clients
   consistently; HSL colors aren't supported by Hotmail. */

.illustration img,
img.bottom-illustration {
    border: none;
    -ms-interpolation-mode: bicubic;
    max-width: 100%;
    vertical-align: bottom;
}

body.default-email-font-settings {
    font-family: sans-serif;
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
    padding: 0;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}

/* These .layout tables are used to create sections within the email;
   see for example: https://templates.mailchimp.com/development/html/
*/
table.layout {
    border-collapse: separate;
    mso-table-lspace: 0;
    mso-table-rspace: 0;
    width: 100%;
}

table.layout > tbody > tr > td {
    font-family: sans-serif;
    font-size: 14px;
    vertical-align: top;
}

/* After email clients strip the actual body tag out of the email, the
   .body element will be the equivalent of our outer element. */
.body {
    width: 100%;
    background-color: #f5f9f8;
}

.container {
    display: block;
    margin: 0 auto !important;
    max-width: 500px;
    padding: 10px;
}

/* This class is used to ensure that the images' width
   does not exceed the actual email layout width. */
img.responsive-width {
    max-width: 100%;
}

/* Our newsletters/marketing emails use a wider content width, to
   support more complex content with text to the side of images. */
.container.wide-container {
    max-width: 700px;
}

/* Mystery: .container contains .content, but the max-widths for this
   element are 80px wider than those for .container. */
.content {
    box-sizing: border-box;
    display: block;
    margin: 20px auto 0;
    max-width: 580px;
    padding: 10px;
}

.content.wide-content {
    max-width: 780px;
}

/*
    The main content region for the email; excludes the preheader and footer.
*/
.main {
    background-color: #fff;
    border-radius: 3px;
    width: 100%;
}

/* Right/left padding to keep content away from edges of email client winder. */
.wrapper {
    box-sizing: border-box;
    padding: 0 20px 20px;
}

/* Footer section, containing unsubscribe links and the like. */
.footer {
    clear: both;
    padding-top: 10px;
    text-align: center;
    width: 100%;
    margin-top: 20px;
}

/*
  Apple mail and other popular email clients will convert the physical
  address into a link, so we set link color on it.
*/
.footer-content-block,
.physical-address {
    color: #5f5ec7;
    font-size: 12px;
    text-align: center;
}

/*
  Styles for the content section of Zulip newsletters and other custom emails.
*/
.custom-email-content h1 {
    font-size: 1.6em;
    margin-top: 25px;
    margin-bottom: 5px;
}

.content ul,
.content ol {
    /* Override excessive indentation seen in Gmail. */
    padding-left: 5px;
}

.body p,
p.digest_paragraph,
.content ul,
.content ol {
    font-family: sans-serif;
    font-size: 14px;
    font-weight: normal;
    margin: 10px 0;
}

.messages p.digest_paragraph {
    line-height: normal;
    margin: 4px 0 0;
}

.body p li,
.content ul li,
.content ol li {
    list-style-position: outside;
    margin-left: 15px;
}

/* Link color styling carefully tuned to not apply to user content
   inside missed-message emails. */
.body a,
.digest_paragraph a,
.sponsorship_request_link,
.support_request_link,
.email-preferences a,
.missed_message.no-content-explanation a {
    color: #5f5ec7;
    text-decoration: underline;
}

.body a:hover,
.digest_paragraph a:hover,
.sponsorship_request_link:hover,
.support_request_link:hover,
.email-preferences a:hover,
.missed_message.no-content-explanation a:hover {
    color: #434388 !important;
}

.body .button {
    display: block;
    padding: 10px 0;
    margin: 20px auto;
    width: 200px;
    color: #5f5ec7;
    border: 2px solid #5f5ec7;
    background-color: #fff;
    border-radius: 4px;
    font-size: 16px;
    outline: none;
    font-family: sans-serif;
    text-decoration: none;
    text-align: center;
    text-shadow: none;
}

.body a.button:hover {
    background-color: #5f5ec7;
    color: #fff;
    text-decoration: none;
}

/* The preheader is an invisible region that is used to control what
   email clients display as the textual preview of the email's content
   in inbox views. */
.preheader {
    color: transparent;
    display: none;
    height: 0;
    max-height: 0;
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    mso-hide: all;
    visibility: hidden;
    width: 0;
}

/* Illustrations appear over the top of the boundary between the
   blank space at the top of the email and the content box; for
   that reason they need a high z-index. */
.illustration {
    pointer-events: none;
    cursor: default !important;
    z-index: 100;
}

/* CSS for digest email content. */
.messages {
    width: 600px;
    font-size: 12px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    overflow-y: auto;
    margin-bottom: 12px;
}

.hot_convo_recipient_block {
    border: 1px solid #000;
}

.hot_convo_recipient_header {
    background-color: #9ec9ff;
    border-bottom: 1px solid #000;
    font-weight: bold;
    padding: 2px;
}

.hot_convo_message_content {
    margin-left: 1px;
    margin-right: 2px;
}

.hot_convo_message_content_block {
    padding-left: 6px;
    font-weight: normal;
}

/* Text and link colors for missed-message emails. */
.email-preferences {
    color: #666;
}

.email-preferences a {
    color: #15c;
}

.missed_message {
    padding-bottom: 10px;
}

.content_disabled_help_link {
    color: #15c;
}

/* Quoted block for text written by an organization administrator to
   explain to the end user why their account got deactivated. */
.deactivated-user-text {
    padding: 0 0 0 15px;
    margin: 0 0 20px;
    border-left: 5px solid #eee;
    white-space: pre-line;
    font-family: sans-serif;
    font-size: 14px;
}

@media only screen and (max-width: 620px) {
    table[class="body"] h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
    }

    table[class="body"] p,
    table[class="body"] ul,
    table[class="body"] ol,
    table[class="body"] td,
    table[class="body"] span,
    table[class="body"] a {
        font-size: 16px !important;
    }

    table[class="body"] .wrapper {
        padding: 0 10px 10px;
    }

    table[class="body"] .content {
        padding: 0 !important;
    }

    table[class="body"] .container {
        padding: 0 !important;
        width: 100% !important;
    }

    table[class="body"] .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
    }
}

@media all {
    /* See https://templates.mailchimp.com/development/css/client-specific-styles/;
       ExternalClass is something Microsoft Outlook adds to emails. */
    .ExternalClass {
        width: 100%;
    }

    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
        line-height: 100%;
    }

    /* iOS converts physical addresses in emails to links automatically,
       so this CSS has an effect on iOS even though we don't actually
       have a link inside the .physical-address element. */
    .physical-address a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
    }
}

/* Mechanism for images alongside content, mainly for use in newsletters. */
.float-right-image {
    float: right;
}

/* The 450px cutoff was determined by testing in Gmail as a point
   where an image looks good in either state. Logically it makes sense
   since then the text still has the majority of the space in the
   side-by-side view. */
@media only screen and (min-width: 450px) {
    .float-right-image {
        max-width: 200px;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: email_base_default.html]---
Location: zulip-main/templates/zerver/emails/email_base_default.html

```text
{% import 'zerver/emails/macros.html' as  macros %}
{% import 'zerver/emails/email.css' as css_styles %}
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width" />
        <meta charset="UTF-8" />
        <title>Zulip</title>
        <style>{{css_styles}}</style>
    </head>
    <body class="default-email-font-settings">
        <table border="0" cellpadding="0" cellspacing="0" class="body layout">
            <tr>
                <td>&nbsp;</td>
                <td class="container">
                    <div class="content">
                        <a href="#" class="illustration">
                            {% block illustration %}{% endblock %}
                        </a>
                        <span class="preheader">
                            {% block preheader %}{% endblock %}
                        </span>
                        <table class="main layout">
                            <tr>
                                <td class="wrapper">
                                    <table border="0" cellpadding="0" cellspacing="0" class="layout">
                                        <tr>
                                            <td>
                                                {% block content %}{% endblock %}
                                            </td>
                                        </tr>
                                    </table>
                                    <img class="bottom-illustration" src="{{ email_images_base_url }}/footer.png" alt="{{ _('Swimming fish') }}"/>
                                </td>
                            </tr>
                        </table>
                        <div class="footer">
                            <table border="0" cellpadding="0" cellspacing="0" class="layout">
                                <tr>
                                    <td class="footer-content-block">
                                        <span class="physical-address">{{physical_address}}</span>
                                        {% block manage_preferences %}{% endblock %}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </td>
                <td>&nbsp;</td>
            </tr>
        </table>
    </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: email_base_marketing.html]---
Location: zulip-main/templates/zerver/emails/email_base_marketing.html

```text
{% import 'zerver/emails/macros.html' as  macros %}
{% import 'zerver/emails/email.css' as css_styles %}
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width" />
        <meta charset="UTF-8" />
        <title>Zulip</title>
        <style>{{css_styles}}</style>
    </head>
    <body class="default-email-font-settings">
        <table border="0" cellpadding="0" cellspacing="0" class="body layout">
            <tr>
                <td>&nbsp;</td>
                <td class="container wide-container">
                    <div class="content wide-content">
                        <a href="#" class="illustration">
                            {% block illustration %}{% endblock %}
                        </a>
                        <span class="preheader">
                            {% block preheader %}{% endblock %}
                        </span>
                        <table class="main layout">
                            <tr>
                                <td class="wrapper">
                                    <table border="0" cellpadding="0" cellspacing="0" class="layout">
                                        <tr>
                                            <td class="custom-email-content">
                                                {% block content %}{% endblock %}
                                            </td>
                                        </tr>
                                    </table>
                                    <img src="{{ email_images_base_url }}/footer.png" alt="{{ _('Swimming fish') }}"/>
                                </td>
                            </tr>
                        </table>
                        <div class="footer">
                            <table border="0" cellpadding="0" cellspacing="0" class="layout">
                                <tr>
                                    <td class="footer-content-block">
                                        <span class="physical-address">{{physical_address}}</span>
                                        {% block manage_preferences %}{% endblock %}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </td>
                <td>&nbsp;</td>
            </tr>
        </table>
    </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: email_base_messages.html]---
Location: zulip-main/templates/zerver/emails/email_base_messages.html

```text
{% import 'zerver/emails/email.css' as css_styles %}
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Zulip</title>
        <style>{{css_styles}}</style>
    </head>
    <body>
        {% if has_preheader %}
        <span style="display:none !important;
          visibility:hidden;
          color:transparent;
          mso-hide:all;
          font-size:1px;
          color:hsl(0, 0%, 100%);
          line-height:1px;
          max-height:0px;
          height:0px;
          max-width:0px;
          width:0px;
          opacity:0;
          overflow:hidden;">
            {% block preheader %}{% endblock %}
        </span>
        {% endif %}
        {% block content %}{% endblock %}
        {% block manage_preferences %}{% endblock %}
    </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: error_processing_invoice.html]---
Location: zulip-main/templates/zerver/emails/error_processing_invoice.html

```text
{% extends "zerver/emails/email_base_messages.html" %}

{% block content %}

{{ message }}

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: error_processing_invoice.subject.txt]---
Location: zulip-main/templates/zerver/emails/error_processing_invoice.subject.txt

```text
Error processing paid customer invoice
```

--------------------------------------------------------------------------------

---[FILE: error_processing_invoice.txt]---
Location: zulip-main/templates/zerver/emails/error_processing_invoice.txt

```text
{{ message }}
```

--------------------------------------------------------------------------------

---[FILE: find_team.html]---
Location: zulip-main/templates/zerver/emails/find_team.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}
{% if account_found %}
<p>{{ _("Thanks for your request!") }}</p>

{% if corporate_enabled %}
<p>{% trans %}Your email address {{ email }} has accounts with the following Zulip Cloud organizations:{% endtrans %}</p>
{% else %}
<p>{% trans %}Your email address {{ email }} has accounts with the following Zulip organizations hosted by {{ external_host }}:{% endtrans %}</p>
{% endif %}

<ul>
    {% for realm_data in realms %}
    <li><a href="{{ realm_data.url }}">{{ realm_data.name }} ({{ realm_data.host }})</a></li>
    {% endfor %}
</ul>

<p>
    {% trans %}If you have trouble logging in, you can <a href="{{ help_reset_password_link }}">reset your password</a>.{% endtrans %}
</p>
{% else %}
<p>
    {{ _("You have requested a list of Zulip accounts for this email address.") }}
    {% if corporate_enabled %}
    {{ _("Unfortunately, no Zulip Cloud accounts were found.") }}
    {% else %}
    {% trans%}Unfortunately, no accounts were found in Zulip organizations hosted by {{external_host}}.{% endtrans %}
    {% endif %}
</p>

<p>
    {% trans %}You can <a href = "{{ find_accounts_link }}" >check for accounts</a> with another email, or <a href ="{{ help_logging_in_link }}">try another way</a> to find your account.{% endtrans %}
    {{ _("If you do not recognize this request, you can safely ignore this email.") }}
</p>
{% endif %}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: find_team.subject.txt]---
Location: zulip-main/templates/zerver/emails/find_team.subject.txt

```text
{% if account_found %}
    {{ _("Your Zulip accounts") }}
{% else %}
    {{ _("No Zulip accounts found") }}
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: find_team.txt]---
Location: zulip-main/templates/zerver/emails/find_team.txt

```text
{% if account_found %}
{{ _("Thanks for your request!") }}

{% if corporate_enabled %}
{% trans %}Your email address {{ email }} has accounts with the following Zulip Cloud organizations:{% endtrans %}
{% else %}
{% trans %}Your email address {{ email }} has accounts with the following Zulip organizations hosted by {{ external_host }}:{% endtrans %}
{% endif %}


{% for realm_data in realms %}
* {{ realm_data.name }}: {{ realm_data.url }}
{% endfor %}

{% trans %}If you have trouble logging in, you can reset your password.{% endtrans %}

{{ help_reset_password_link }}

{% else %}
{% if corporate_enabled %}
{{ _("You have requested a list of Zulip accounts for this email address.") }} {{ _("Unfortunately, no Zulip Cloud accounts were found.") }}

{% trans %}You can check for accounts with another email ({{ find_accounts_link }}), or try another way to find your account ({{ help_logging_in_link }}).{% endtrans %}


{{ _("If you do not recognize this request, you can safely ignore this email.") }}
{% else %}
{{ _("You have requested a list of Zulip accounts for this email address.") }} {% trans%}Unfortunately, no accounts were found in Zulip organizations hosted by {{external_host}}.{% endtrans %}


{% trans %}You can check for accounts with another email ({{ find_accounts_link }}), or try another way to find your account ({{ help_logging_in_link }}).{% endtrans %}


{{ _("If you do not recognize this request, you can safely ignore this email.") }}
{% endif %}
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: internal_billing_notice.html]---
Location: zulip-main/templates/zerver/emails/internal_billing_notice.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block content %}

<p>Internal billing notice for {{ billing_entity }}.</p>

{% if notice_reason == "fixed_price_plan_ends_soon" %}
<p>Reminder to re-evaluate the pricing and configure a new fixed-price plan accordingly.</p>
{% elif notice_reason == "stale_audit_log_data" %}
{% if fixed_price_plan %}
<p>Unable to verify current licenses in use, but invoicing not delayed because customer has a fixed-price plan.</p>
{% else %}
<p>Unable to verify current licenses in use, which delays invoicing for this customer.</p>
{% endif %}
<b>Last data upload</b>: {{ last_audit_log_update }}
{% elif notice_reason == "locally_deleted_realm_on_paid_plan" %}
<p>Investigate why remote realm is marked as locally deleted when it's on a paid plan.</p>
{% elif notice_reason == "license_discrepancy" %}
<p>Discrepancy in licenses when upgraded to current plan.</p>
<b>Licenses paid for</b>: {{ paid_licenses }}.
<b>Reported licenses in use</b>: {{ current_licenses }}.
{% endif %}

<br /><br />

<b>Support URL</b>: <a href="{{ support_url }}">{{ support_url }}</a>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: internal_billing_notice.subject.txt]---
Location: zulip-main/templates/zerver/emails/internal_billing_notice.subject.txt

```text
{% if notice_reason == "fixed_price_plan_ends_soon" %}
Fixed-price plan for {{ billing_entity }} ends on {{ end_date }}
{% elif notice_reason == "stale_audit_log_data" %}
Stale audit log data for {{ billing_entity }}'s plan
{% elif notice_reason == "locally_deleted_realm_on_paid_plan" %}
{{ billing_entity }} on paid plan marked as locally deleted
{% elif notice_reason == "license_discrepancy" %}
Check initial licenses invoiced for {{ billing_entity }}
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: internal_billing_notice.txt]---
Location: zulip-main/templates/zerver/emails/internal_billing_notice.txt

```text
Internal billing notice for {{ billing_entity }}.

{% if notice_reason == "fixed_price_plan_ends_soon" %}
Reminder to re-evaluate the pricing and configure a new fixed-price plan accordingly.
{% elif notice_reason == "stale_audit_log_data" %}
{% if fixed_price_plan %}
Unable to verify current licenses in use, but invoicing not delayed because customer has a fixed-price plan.

Last data upload: {{ last_audit_log_update }}
{% else %}
Unable to verify current licenses in use, which delays invoicing for this customer.

Last data upload: {{ last_audit_log_update }}
{% endif %}
{% elif notice_reason == "locally_deleted_realm_on_paid_plan" %}
Investigate why remote realm is marked as locally deleted when it's on a paid plan.
{% elif notice_reason == "license_discrepancy" %}
Discrepancy in licenses when upgraded to current plan.

Licenses paid for: {{ paid_licenses }}.
Reported licenses in use: {{ current_licenses }}.
{% endif %}

Support URL: {{ support_url }}
```

--------------------------------------------------------------------------------

---[FILE: invitation.html]---
Location: zulip-main/templates/zerver/emails/invitation.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/registration_confirmation.png" alt=""/>
{% endblock %}

{% block content %}

<p>{{ _("Hi there,") }}</p>

<p>
    {% trans referrer_name=macros.referrer_email_tag(referrer_email, referrer_full_name) %}{{ referrer_name }} wants you to join them on Zulip &mdash; the team communication tool designed for productivity.{% endtrans %}
</p>
<p>
    {{ _("To get started, click the button below.") }}
    <a class="button" href="{{ activate_url }}">{{ _("Complete registration") }}</a>
</p>
<p>
    {% if corporate_enabled %}
        {{macros.contact_us_zulip_cloud(support_email)}}
    {% else %}
        {{macros.contact_us_self_hosted(support_email)}}
    {% endif %}
</p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: invitation.subject.txt]---
Location: zulip-main/templates/zerver/emails/invitation.subject.txt

```text
{% trans %}{{referrer_full_name}} has invited you to join {{ referrer_realm_name }}{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: invitation.txt]---
Location: zulip-main/templates/zerver/emails/invitation.txt

```text
{{ _("Hi there,") }}

{% trans %}{{ referrer_full_name }} ({{ referrer_email }}) wants you to join them on Zulip -- the team communication tool designed for productivity.{% endtrans %}

{{ _("To get started, click the link below.") }}
    <{{ activate_url }}>

{% if corporate_enabled %}
    {% trans %}Do you have questions or feedback to share? Contact us at {{ support_email }} — we'd love to help!{% endtrans %}
{% else %}
    {% trans %}If you have any questions, please contact this Zulip server's administrators at {{ support_email }}.{% endtrans %}
{% endif %}
```

--------------------------------------------------------------------------------

````
