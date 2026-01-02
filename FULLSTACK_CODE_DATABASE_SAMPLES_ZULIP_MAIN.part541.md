---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 541
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 541 of 1290)

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

---[FILE: invitation_reminder.html]---
Location: zulip-main/templates/zerver/emails/invitation_reminder.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/invitation_reminder.png" alt=""/>
{% endblock %}

{% block content %}
<p>{{ _("Hi again,") }}</p>

<p>{% trans referrer_name=macros.referrer_email_tag(referrer_email, referrer_name) %}This is a friendly reminder that {{ referrer_name }} wants you to join them on Zulip &mdash; the team communication tool designed for productivity.{% endtrans %}</p>

<p>
    {{ _("To get started, click the button below.") }}
    <a class="button" href="{{ activate_url }}">{{ _("Complete registration") }}</a>
</p>

<p>
    {{ _("This is the last reminder you'll receive for this invitation.") }}
</p>

<p>
    {% trans referrer_name=macros.email_tag(referrer_email, referrer_name) %}
    This invitation expires in two days. If the invitation expires,
    you'll need to ask {{ referrer_name }} for another one.
    {% endtrans %}
</p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: invitation_reminder.subject.txt]---
Location: zulip-main/templates/zerver/emails/invitation_reminder.subject.txt

```text
{% trans %}Reminder: Join {{referrer_name}} at {{ referrer_realm_name }}{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: invitation_reminder.txt]---
Location: zulip-main/templates/zerver/emails/invitation_reminder.txt

```text
{{ _("Hi again,") }}

{% trans %}This is a friendly reminder that {{ referrer_name }} ({{ referrer_email }}) wants you to join them on Zulip -- the team communication tool designed for productivity.{% endtrans %}

{{ _("To get started, click the link below.") }}
    <{{ activate_url }}>

{{ _("This is the last reminder you'll receive for this invitation.") }}

{% trans %}This invitation expires in two days. If the invitation expires, you'll need to ask {{ referrer_name }} for another one.{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: macros.html]---
Location: zulip-main/templates/zerver/emails/macros.html

```text
{% macro email_tag(email, text) -%}
    <a href="mailto:{{ email }}">{{ text | default(email) }}</a>
{%- endmacro %}

{% macro referrer_email_tag(referrer_email, referrer_name) -%}
    <a href="mailto:{{ referrer_email }}">{{ referrer_name }} ({{ referrer_email }})</a>
{%- endmacro %}

{% macro link_tag(url, text) -%}
    <a href="{{ url }}">{{ text | default(url) }}</a>
{%- endmacro %}

{% macro contact_us_self_hosted(email) -%}
    {% trans %}If you have any questions, please contact this Zulip server's administrators at <a href="mailto:{{ email }}">{{ email }}</a>.{% endtrans %}
{%- endmacro %}

{% macro contact_us_zulip_cloud(email) -%}
    {% trans %}Do you have questions or feedback to share? <a href="mailto:{{ email }}">Contact us</a> — we'd love to help!{% endtrans %}
{%- endmacro %}
```

--------------------------------------------------------------------------------

---[FILE: missed_message.html]---
Location: zulip-main/templates/zerver/emails/missed_message.html

```text
{% extends "zerver/emails/email_base_messages.html" %}

{% block content %}
    {% if show_message_content %}
        {% with recipient_block=messages %}
            {% for sender_block in recipient_block.senders %}
                <div class="missed_message">
                    {% for message_block in sender_block.content %}
                        {{ message_block.html|safe }}
                    {% endfor %}
                </div>
            {% endfor %}
        {% endwith %}
    {% else %}
    <div class="missed_message no-content-explanation">
    {% if message_content_disabled_by_realm %}
    {% trans help_url=realm_url + "/help/hide-message-content-in-emails" %}This email does not include message content because your organization <a class="content_disabled_help_link" href="{{ help_url }}">hides message content</a> in email notifications.{% endtrans %}
    {% elif message_content_disabled_by_user %}
    {% trans help_url=realm_url + "/help/email-notifications#hide-message-content" %}This email does not include message content because you have chosen to <a class="content_disabled_help_link" href="{{ help_url }}">hide message content</a> in email notifications.{% endtrans %}
    {% endif %}
    </div>
    {% endif %}
{% endblock %}

{% block manage_preferences %}
<div class="email-preferences">
    &mdash;<br />
    {% if personal_mentioned %}
    {% trans %}You are receiving this because you were personally mentioned.{% endtrans %}<br />
    {% elif mentioned_user_group_name %}
    {% trans %}You are receiving this because @{{ mentioned_user_group_name }} was mentioned.{% endtrans %}<br />
    {% elif topic_wildcard_mentioned_in_followed_topic %}
    {% trans %}You are receiving this because all topic participants were mentioned in #{{ channel_name }} > {{ topic_name }}.{% endtrans %}<br />
    {% elif stream_wildcard_mentioned_in_followed_topic %}
    {% trans %}You are receiving this because you have wildcard mention notifications enabled for topics you follow.{% endtrans %}<br />
    {% elif topic_wildcard_mentioned %}
    {% trans %}You are receiving this because all topic participants were mentioned in #{{ channel_name }} > {{ topic_name }}.{% endtrans %}<br />
    {% elif stream_wildcard_mentioned %}
    {% trans %}You are receiving this because everyone was mentioned in #{{ channel_name }}.{% endtrans %}<br />
    {% elif followed_topic_email_notify %}
    {% trans %}You are receiving this because you have email notifications enabled for topics you follow.{% endtrans %}<br />
    {% elif stream_email_notify %}
    {% trans %}You are receiving this because you have email notifications enabled for #{{ channel_name }}.{% endtrans %}<br />
    {% endif %}
    {% if reply_to_zulip %}
    {% trans notif_url=realm_url + "/#settings/notifications" %}Reply to this email directly, <a href="{{ narrow_url }}">view it in {{ realm_name }} Zulip</a>, or <a href="{{ notif_url }}">manage email preferences</a>.{% endtrans %}
    {% elif not show_message_content %}
    {% trans notif_url=realm_url + "/#settings/notifications" %}<a href="{{ narrow_url }}">View or reply in {{ realm_name }} Zulip</a>, or <a href="{{ notif_url }}">manage email preferences</a>.{% endtrans %} <br />
    {% else %}
    {% trans notif_url=realm_url + "/#settings/notifications" %}<a href="{{ narrow_url }}">Reply in {{ realm_name }} Zulip</a>, or <a href="{{ notif_url }}">manage email preferences</a>.{% endtrans %} <br />
    <br />
    {% trans url="https://zulip.readthedocs.io/en/latest/production/email-gateway.html" %}
    Do not reply to this email. This Zulip server is not configured to accept incoming emails (<a href="{{ url }}">help</a>).
    {% endtrans %}

    {% endif %}
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: missed_message.subject.txt]---
Location: zulip-main/templates/zerver/emails/missed_message.subject.txt

```text
{% if show_message_content %}
    {% if group_pm %} {% trans %}Group DMs with {{ direct_message_group_display_name }}{% endtrans %}
    {% elif private_message %} {% trans %}DMs with {{ sender_str }}{% endtrans %}
    {% elif stream_email_notify or mention or followed_topic_email_notify %}
        {#
        Some email clients, like Gmail Web (as of 2022), will auto-thread
        emails that share a subject and recipients, but will disregard
        [Bracketed Prefixes] in the style of old-school mailing lists. We take
        advantage of this to retain thread continuity in email notifications
        even after a topic is resolved.
        #}
        {% if topic_resolved %}{% trans %}[resolved] #{{ channel_name }} > {{ topic_name }}{% endtrans %}
        {% else %}#{{ channel_name }} > {{ topic_name }}
        {% endif %}
    {% endif %}
{% else %}
    {% trans %}New messages{% endtrans %}
{% endif %}
{% if include_realm_name_in_missedmessage_emails_subject %} [{{ realm_str }}]
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: missed_message.txt]---
Location: zulip-main/templates/zerver/emails/missed_message.txt

```text
{% if show_message_content %}
{% with recipient_block=messages %}
{% for sender_block in recipient_block.senders %}
{% for message_block in sender_block.content %}
{{ message_block.plain }}
{% endfor %}
{% endfor %}
{% endwith %}
{% else %}
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

--
{% if personal_mentioned %}
{% trans %}You are receiving this because you were personally mentioned.{% endtrans %}
{% elif mentioned_user_group_name %}
{% trans %}You are receiving this because @{{ mentioned_user_group_name }} was mentioned.{% endtrans %}
{% elif topic_wildcard_mentioned_in_followed_topic %}
{% trans %}You are receiving this because all topic participants were mentioned in #{{ channel_name }} > {{ topic_name }}.{% endtrans %}
{% elif stream_wildcard_mentioned_in_followed_topic %}
{% trans %}You are receiving this because you have wildcard mention notifications enabled for topics you follow.{% endtrans %}
{% elif topic_wildcard_mentioned %}
{% trans %}You are receiving this because all topic participants were mentioned in #{{ channel_name }} > {{ topic_name }}.{% endtrans %}
{% elif stream_wildcard_mentioned %}
{% trans %}You are receiving this because everyone was mentioned in #{{ channel_name }}.{% endtrans %}
{% elif followed_topic_email_notify %}
{% trans %}You are receiving this because you have email notifications enabled for topics you follow.{% endtrans %}
{% elif stream_email_notify %}
{% trans %}You are receiving this because you have email notifications enabled for #{{ channel_name }}.{% endtrans %}
{% endif %}

{% if reply_to_zulip  %}
{% trans %}Reply to this email directly, or view it in {{ realm_name }} Zulip:{% endtrans %}

{{ narrow_url }}
{% elif not show_message_content %}
{% trans %}View or reply in {{ realm_name }} Zulip:{% endtrans %}

{{ narrow_url }}
{% else %}
{% trans %}Reply in {{ realm_name }} Zulip:{% endtrans %}

{{ narrow_url }}

{% trans %}
Do not reply to this email. This Zulip server is not configured to accept
incoming emails. Help:
{% endtrans %}
https://zulip.readthedocs.io/en/latest/production/email-gateway.html
{% endif %}

{% trans %}Manage email preferences:{% endtrans %}

{{ realm_url }}/#settings/notifications
```

--------------------------------------------------------------------------------

---[FILE: notify_change_in_email.html]---
Location: zulip-main/templates/zerver/emails/notify_change_in_email.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}
<p>{{ _("Hi,") }}</p>
<p>
    {% trans new_email=macros.email_tag(new_email), support_email=macros.email_tag(support_email) %}The email associated with your Zulip account was recently changed to {{ new_email }}. If you did not request this change, please contact us immediately at {{ support_email }}.{% endtrans %}
</p>
<p>
    {{ _("Best,") }}<br />
    {{ _("Team Zulip") }}
</p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: notify_change_in_email.subject.txt]---
Location: zulip-main/templates/zerver/emails/notify_change_in_email.subject.txt

```text
{% trans %}Zulip email changed for {{ realm_name }}{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: notify_change_in_email.txt]---
Location: zulip-main/templates/zerver/emails/notify_change_in_email.txt

```text
{{ _("Hi,") }}

{% trans %}The email associated with your Zulip account was recently changed to {{ new_email }}. If you did not request this change, please contact us immediately at <{{ support_email }}>.{% endtrans %}


{{ _("Best,") }}
{{ _("Team Zulip") }}
```

--------------------------------------------------------------------------------

---[FILE: notify_new_login.html]---
Location: zulip-main/templates/zerver/emails/notify_new_login.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block preheader %}
    {% trans organization_url=realm_url %}Organization: {{ organization_url }} Time: {{ login_time }} Email: {{ user_email }}{% endtrans %}
{% endblock %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}
<p>{{ _("We noticed a recent login for the following Zulip account.") }}</p>
<ul>
    <li>
        {% trans organization_link=macros.link_tag(realm_url) %}Organization: {{ organization_link }}{% endtrans %}
    </li>
    <li>
        {% trans user_email=macros.email_tag(user_email) %}Email: {{ user_email }}{% endtrans %}
    </li>
    <li>
        {% trans %}Time: {{ login_time }}{% endtrans %}
    </li>
    <li>
        {% trans %}Device: {{ device_browser }} on {{ device_os }}.{% endtrans %}
    </li>
    <li>
        {% trans %}IP address: {{ device_ip }}{% endtrans %}
    </li>
</ul>

<p>{{ _("If this was you, great! There's nothing else you need to do.") }}</p>

<p>
    {% trans support_email=macros.email_tag(support_email), reset_link=realm_url + "/accounts/password/reset/" %}If you do not recognize this login, or think your account may have been compromised, please <a href="{{ reset_link }}">reset your password</a> or contact us immediately at {{ support_email }}.{% endtrans %}
</p>

<p>
    {{ _("Thanks,") }}<br />
    {{ _("Zulip Security") }}
</p>
{% endblock %}

{% block manage_preferences %}
<p><a href="{{ realm_url }}/#settings/notifications">{{ _("Manage email preferences") }}</a> | <a href="{{ unsubscribe_link }}">{{ _("Unsubscribe from login notifications") }}</a></p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: notify_new_login.subject.txt]---
Location: zulip-main/templates/zerver/emails/notify_new_login.subject.txt

```text
{% trans %}New login from {{ device_browser }} on {{ device_os }}{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: notify_new_login.txt]---
Location: zulip-main/templates/zerver/emails/notify_new_login.txt

```text
{{ _("We noticed a recent login for the following Zulip account.") }}

{% trans organization_url=realm_url %}Organization: {{ organization_url }}{% endtrans %}

{% trans %}Email: {{ user_email }}{% endtrans %}

{% trans %}Time: {{ login_time }}{% endtrans %}

{% trans %}Device: {{ device_browser }} on {{ device_os }}.{% endtrans %}

{% trans %}IP address: {{ device_ip }}{% endtrans %}


{{ _("If this was you, great! There's nothing else you need to do.") }}

{% trans reset_link=realm_url + "/accounts/password/reset/" %}
If you do not recognize this login, or think your account may have been compromised, please reset your password at {{ reset_link }} or contact us immediately at {{ support_email }}.
{%- endtrans %}


{{ _("Thanks,") }}
{{ _("Zulip Security") }}
```

--------------------------------------------------------------------------------

---[FILE: onboarding_team_to_zulip.html]---
Location: zulip-main/templates/zerver/emails/onboarding_team_to_zulip.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}

<p>
    {% trans %}If you've already decided to use Zulip for your organization, welcome! You can use our <a href="{{ get_organization_started }}">guide for moving to Zulip</a> to get started.{% endtrans %}
</p>
<p>
    {% trans %}Otherwise, here is some advice we often hear from customers for evaluating <i>any</i> team chat product:{% endtrans %}
</p>
<ol>
    <li>{% trans %}<a href="{{ invite_users }}"><b>Invite your teammates</b></a> to explore with you and share their unique perspectives.{% endtrans %}
        {% trans %}Use the app itself to chat about your impressions.{% endtrans %}
    </li>
    <li>{% trans %}<a href="{{ trying_out_zulip}}"><b>Run a week-long trial</b></a> with your team, without using any other chat tools. This is the only way to truly experience how a new chat app will help your team communicate.{% endtrans %}
    </li>
</ol>
<p>
    {% trans %}Zulip is designed to <a href="{{ why_zulip }}">enable efficient communication</a>, and we hope these tips help your team experience it in action.{% endtrans %}
</p>

<p>
    {% if corporate_enabled %}
        {{macros.contact_us_zulip_cloud(support_email)}}
    {% else %}
        {{macros.contact_us_self_hosted(support_email)}}
    {% endif %}
</p>

{% endblock %}

{% block manage_preferences %}

<p><a href="{{ unsubscribe_link }}">{% trans %}Unsubscribe from welcome emails for {{ realm_name }}{% endtrans %}</a></p>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: onboarding_team_to_zulip.subject.txt]---
Location: zulip-main/templates/zerver/emails/onboarding_team_to_zulip.subject.txt

```text
{{ _("Choosing the chat app for your team") }}
```

--------------------------------------------------------------------------------

---[FILE: onboarding_team_to_zulip.txt]---
Location: zulip-main/templates/zerver/emails/onboarding_team_to_zulip.txt

```text
{% trans %}If you've already decided to use Zulip for your organization, welcome! You can use our guide for moving to Zulip to get started.{% endtrans %} [ {{ get_organization_started }} ]

{% trans %}Otherwise, here is some advice we often hear from customers for evaluating any team chat product:{% endtrans %}


1. {% trans %}Invite your teammates to explore with you and share their unique perspectives.{% endtrans %} [ {{ invite_users }} ] {% trans %}Use the app itself to chat about your impressions.{% endtrans %}

2. {% trans %}Run a week-long trial with your team, without using any other chat tools. This is the only way to truly experience how a new chat app will help your team communicate.{% endtrans %} [ {{ trying_out_zulip }} ]

{% trans %}Zulip is designed to enable efficient communication, and we hope these tips help your team experience it in action.{% endtrans %} [ {{ why_zulip }} ]

{% if corporate_enabled %}
    {% trans %}Do you have questions or feedback to share? Contact us at {{ support_email }} — we'd love to help!{% endtrans %}
{% else %}
    {% trans %}If you have any questions, please contact this Zulip server's administrators at {{ support_email }}.{% endtrans %}
{% endif %}

----
{% trans %}Unsubscribe from welcome emails for {{ realm_name }}{% endtrans %}: {{ unsubscribe_link }}
```

--------------------------------------------------------------------------------

---[FILE: onboarding_zulip_guide.html]---
Location: zulip-main/templates/zerver/emails/onboarding_zulip_guide.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}

<p>{{ _("As you are getting started with Zulip, we'd love to help you discover how it can work best for your needs. Check out this guide to key Zulip features for organizations like yours!") }}</p>


{% if organization_type == "business" %}
<a class="button" href="{{ zulip_guide_link }}">{{ _("View Zulip guide for businesses") }}</a>
{% elif organization_type == "opensource" %}
<a class="button" href="{{ zulip_guide_link }}">{{ _("View Zulip guide for open-source projects") }}</a>
{% elif organization_type == "education" %}
<a class="button" href="{{ zulip_guide_link }}">{{ _("View Zulip guide for education") }}</a>
{% elif organization_type == "research" %}
<a class="button" href="{{ zulip_guide_link }}">{{ _("View Zulip guide for research") }}</a>
{% elif organization_type == "event" %}
<a class="button" href="{{ zulip_guide_link }}">{{ _("View Zulip guide for events and conferences") }}</a>
{% elif organization_type == "nonprofit" %}
<a class="button" href="{{ zulip_guide_link }}">{{ _("View Zulip guide for non-profits") }}</a>
{% elif organization_type == "community" %}
<a class="button" href="{{ zulip_guide_link }}">{{ _("View Zulip guide for communities") }}</a>
{% endif %}

<p>
    {% if corporate_enabled %}
        {{macros.contact_us_zulip_cloud(support_email)}}
    {% else %}
        {{macros.contact_us_self_hosted(support_email)}}
    {% endif %}
</p>

{% endblock %}

{% block manage_preferences %}

<p><a href="{{ unsubscribe_link }}">{% trans %}Unsubscribe from welcome emails for {{ realm_name }}{% endtrans %}</a></p>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: onboarding_zulip_guide.subject.txt]---
Location: zulip-main/templates/zerver/emails/onboarding_zulip_guide.subject.txt

```text
{% if organization_type == "business" %}
{{ _("Zulip guide for businesses") }}
{% elif organization_type == "opensource" %}
{{ _("Zulip guide for open-source projects") }}
{% elif organization_type == "education" %}
{{ _("Zulip guide for education") }}
{% elif organization_type == "research" %}
{{ _("Zulip guide for research") }}
{% elif organization_type == "event" %}
{{ _("Zulip guide for events and conferences") }}
{% elif organization_type == "nonprofit" %}
{{ _("Zulip guide for non-profits") }}
{% elif organization_type == "community" %}
{{ _("Zulip guide for communities") }}
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: onboarding_zulip_guide.txt]---
Location: zulip-main/templates/zerver/emails/onboarding_zulip_guide.txt

```text
{{ _("As you are getting started with Zulip, we'd love to help you discover how it can work best for your needs. Check out this guide to key Zulip features for organizations like yours!") }}

{% if organization_type == "business" %}
{{ _("View Zulip guide for businesses") }}:
{% elif organization_type == "opensource" %}
{{ _("View Zulip guide for open-source projects") }}:
{% elif organization_type == "education" %}
{{ _("View Zulip guide for education") }}:
{% elif organization_type == "research" %}
{{ _("View Zulip guide for research") }}:
{% elif organization_type == "event" %}
{{ _("View Zulip guide for events and conferences") }}:
{% elif organization_type == "nonprofit" %}
{{ _("View Zulip guide for non-profits") }}:
{% elif organization_type == "community" %}
{{ _("View Zulip guide for communities") }}:
{% endif %}
<{{ zulip_guide_link }}>

{% if corporate_enabled %}
    {% trans %}Do you have questions or feedback to share? Contact us at {{ support_email }} — we'd love to help!{% endtrans %}
{% else %}
    {% trans %}If you have any questions, please contact this Zulip server's administrators at {{ support_email }}.{% endtrans %}
{% endif %}

----
{% trans %}Unsubscribe from welcome emails for {{ realm_name }}{% endtrans %}:
{{ unsubscribe_link }}
```

--------------------------------------------------------------------------------

---[FILE: onboarding_zulip_topics.html]---
Location: zulip-main/templates/zerver/emails/onboarding_zulip_topics.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/day2_1.png" alt=""/>
{% endblock %}

{% block content %}
<p>
    {{ _("Here are some tips for keeping your Zulip conversations organized with topics.") }}
</p>

<p>
    {{ _("In Zulip, <b>channels</b> determine who gets a message. <b>Topics</b> tell you what the message is about.")}} {{ _("Using topics, you can read Zulip one conversation at a time. You'll see each message in context, no matter how many different discussions are going on.") }}
</p>

<img class="responsive-width" src="{{ email_images_base_url }}/channels-and-topics.png" alt="{{ _('Channels and topics in the Zulip app') }}"/>

<p>
    {{ _("To kick off a new conversation, just pick a channel and start a new topic. This way, the new conversation thread won't interrupt ongoing discussions. For a good topic name, think about finishing the sentence: “Hey, can we chat about…?”") }}
</p>

<img class="responsive-width" src="{{ email_images_base_url }}/day2_2.png" alt="{{ _('Examples of short topics') }}"/>

<p>
    {% trans %}Don't stress about picking the perfect name for your topic. If anything is out of place, it's easy to <a href="{{ move_messages_link }}">move messages</a>, <a href="{{ rename_topics_link }}">rename topics</a>, or even <a href="{{ move_channels_link }}">move a topic to a different channel</a>.{% endtrans %}
</p>

<a class="button" href="{{ realm_url }}">{{ _("Go to Zulip") }}</a>

{% endblock %}

{% block manage_preferences %}

<p><a href="{{ unsubscribe_link }}">{% trans %}Unsubscribe from welcome emails for {{ realm_name }}{% endtrans %}</a></p>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: onboarding_zulip_topics.subject.txt]---
Location: zulip-main/templates/zerver/emails/onboarding_zulip_topics.subject.txt

```text
{{ _("Keep your conversations organized with topics") }}
```

--------------------------------------------------------------------------------

---[FILE: onboarding_zulip_topics.txt]---
Location: zulip-main/templates/zerver/emails/onboarding_zulip_topics.txt

```text
{{ _("Here are some tips for keeping your Zulip conversations organized with topics.") }}

{{ _("In Zulip, channels determine who gets a message. Topics tell you what the message is about.") }} {{ _("Using topics, you can read Zulip one conversation at a time. You'll see each message in context, no matter how many different discussions are going on.") }}

{{ _("To kick off a new conversation, just pick a channel and start a new topic. This way, the new conversation thread won't interrupt ongoing discussions. For a good topic name, think about finishing the sentence: “Hey, can we chat about…?”") }}

{% trans %}Don't stress about picking the perfect name for your topic. If anything is out of place, it's easy to move messages ({{ move_messages_link }}), rename topics ({{ rename_topics_link }}), or even move a topic to a different channel ({{ move_channels_link }}).{% endtrans %}


{{ _("Go to Zulip") }}:
<{{ realm_url }}>

----
{% trans %}Unsubscribe from welcome emails for {{ realm_name }}{% endtrans %}:
{{ unsubscribe_link }}
```

--------------------------------------------------------------------------------

---[FILE: password_reset.html]---
Location: zulip-main/templates/zerver/emails/password_reset.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}
    <p>
        {% trans email=macros.email_tag(email), realm_url=macros.link_tag(realm_url) %}Somebody (possibly you) requested a new password for the Zulip account {{ email }} on {{ realm_url }}.{% endtrans %}
    </p>
    {% if active_account_in_realm %}
        <p>
            {{ _('Click the button below to reset your password.') }}
            <a class="button" href="{{ reset_url }}">{{ _("Reset password") }}</a>
        </p>
    {% else %}
        <p>
            {% if user_deactivated %}
                {% trans organization_url=macros.link_tag(realm_url), help_link=realm_url + "/help/deactivate-or-reactivate-a-user" %}You previously had an account on {{ organization_url }}, but it has been deactivated. You can contact an organization administrator to <a href="{{ help_link }}">reactivate your account</a>.{% endtrans %}
            {% else %}
                {% trans %}You do not have an account in that Zulip organization.{% endtrans %}
            {% endif %}
        </p>
        {% if other_realm_urls %}
            <p>
                {{ _("You do have active accounts in the following organization(s).") }}
            </p>
            <ul>
                {% for realm_url in other_realm_urls %}
                <li>{{ realm_url }}</li>
                {% endfor %}
            </ul>
            <p>
                {% trans %}You can try logging in or resetting your password in the organization(s) above.{% endtrans %}
            </p>
        {% endif %}
    {% endif %}

    <p>
        {% trans %}If you do not recognize this activity, you can safely ignore this email.{% endtrans %}
    </p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: password_reset.subject.txt]---
Location: zulip-main/templates/zerver/emails/password_reset.subject.txt

```text
{% trans %}Password reset request for {{ realm_name }}{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: password_reset.txt]---
Location: zulip-main/templates/zerver/emails/password_reset.txt

```text
{% trans -%}
Somebody (possibly you) requested a new password for the Zulip account {{ email }} on {{ realm_url }}.
{%- endtrans %}

{% if active_account_in_realm %}
{{ _('Click the link below to reset your password.') }}
{{ reset_url }}
{% else %}
{% if user_deactivated %}
{% trans -%}
You previously had an account on {{ realm_url }}, but it has been deactivated. You can contact an organization administrator to reactivate your account.
{%- endtrans %}
{{ realm_url }}/help/deactivate-or-reactivate-a-user
{% else %}
{% trans -%}
You do not have an account in that Zulip organization.
{%- endtrans %}
{% endif %}

{% if other_realm_urls %}

{{ _("You do have active accounts in the following organization(s).") }}
{% for realm_url in other_realm_urls %}
{{ realm_url }}
{% endfor %}

{% trans -%}
You can try logging in or resetting your password in the organization(s) above.
{%- endtrans %}
{% endif %}
{% endif %}

{% trans -%}
If you do not recognize this activity, you can safely ignore this email.
{%- endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: realm_auto_downgraded.html]---
Location: zulip-main/templates/zerver/emails/realm_auto_downgraded.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}
    {% trans organization_name_with_link=macros.link_tag(realm_url, string_id) %}
    Your organization, {{ organization_name_with_link }}, has been downgraded to the Zulip Cloud
    Free plan because of unpaid invoices. The unpaid invoices have been voided.
    {% endtrans %}
    <br/>
    <br/>

    {% trans upgrade_url=macros.link_tag(upgrade_url) %}
    To continue on the Zulip Cloud Standard plan, please upgrade again by going to {{ upgrade_url }}.
    {% endtrans %}

    <br/>
    <br/>

    {% trans support_email=macros.email_tag(support_email) %}
    If you think this was a mistake or need more details, please reach out to us at {{ support_email }}.
    {% endtrans %}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: realm_auto_downgraded.subject.txt]---
Location: zulip-main/templates/zerver/emails/realm_auto_downgraded.subject.txt

```text
{{ string_id }}: Your organization has been downgraded to Zulip Cloud Free
```

--------------------------------------------------------------------------------

---[FILE: realm_auto_downgraded.txt]---
Location: zulip-main/templates/zerver/emails/realm_auto_downgraded.txt

```text
Your organization, {{ realm_url }}, has been downgraded to the Zulip Cloud
Free plan because of unpaid invoices. The unpaid invoices have been voided.

To continue on the Zulip Cloud Standard plan, please upgrade again by going
to {{ upgrade_url }}.

If you think this was a mistake or need more details, please reach out
to us at support@zulip.com.
```

--------------------------------------------------------------------------------

---[FILE: realm_deactivated.html]---
Location: zulip-main/templates/zerver/emails/realm_deactivated.html

```text
{% extends "zerver/emails/email_base_default.html" %}
{% set localized_date = event_date|localize %}
{% if scheduled_deletion_date %}
{% set deletion_date = scheduled_deletion_date|localize %}
{% endif %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}
<p>
    {% if acting_user and initiated_deactivation %}
        {% trans %}You have deactivated your Zulip organization, {{ realm_name }}, on {{ localized_date }}.{% endtrans %}
    {% elif acting_user %}
        {% trans %}Your Zulip organization, {{ realm_name }}, was deactivated by {{ deactivating_owner }} on {{ localized_date }}.{% endtrans %}
    {% else %}
        {% trans %}Your Zulip organization, {{ realm_name }}, was deactivated on {{ localized_date }}.{% endtrans %}
    {% endif %}
    {% if data_already_deleted %}
        {% trans %}All data associated with this organization has been permanently deleted.{% endtrans %}
    {% elif scheduled_deletion_date %}
        {% trans %}All data associated with this organization will be permanently deleted on {{ deletion_date }}.{% endtrans %}
    {% endif %}
</p>
<p>
    {% trans %}If you have any questions or concerns, please reply to this email as soon as possible.{% endtrans %}
</p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: realm_deactivated.subject.txt]---
Location: zulip-main/templates/zerver/emails/realm_deactivated.subject.txt

```text
{% trans %}Your Zulip organization {{ realm_name }} has been deactivated{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: realm_deactivated.txt]---
Location: zulip-main/templates/zerver/emails/realm_deactivated.txt

```text
{% set localized_date = event_date|localize %}
{% if scheduled_deletion_date %}
{% set deletion_date = scheduled_deletion_date|localize %}
{% endif %}
{% if acting_user and initiated_deactivation %}
    {% trans %}You have deactivated your Zulip organization, {{ realm_name }}, on {{ localized_date }}. {% endtrans %}
{% elif acting_user %}
    {% trans %}Your Zulip organization, {{ realm_name }}, was deactivated by {{ deactivating_owner }} on {{ localized_date }}. {% endtrans %}
{% else %}
    {% trans %}Your Zulip organization, {{ realm_name }}, was deactivated on {{ localized_date }}. {% endtrans %}
{% endif %}
{% if data_already_deleted %}
    {% trans %}All data associated with this organization has been permanently deleted.{% endtrans %}
{% elif scheduled_deletion_date %}
    {% trans %}All data associated with this organization will be permanently deleted on {{ deletion_date }}.{% endtrans %}
{% endif %}


{% trans%}If you have any questions or concerns, please reply to this email as soon as possible.{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: realm_reactivation.html]---
Location: zulip-main/templates/zerver/emails/realm_reactivation.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/registration_confirmation.png" alt=""/>
{% endblock %}

{% block content %}
<p>{% trans %}Dear former administrators of {{ realm_name }},{% endtrans %}</p>

<p>{% trans realm_url=macros.link_tag(realm_url) %}One of your administrators requested reactivation of the previously deactivated Zulip organization hosted at {{ realm_url }}.{% endtrans %}</p>

<p>
    {{ _('Click the button below to reactivate your organization.') }}
    <a class="button" href="{{ confirmation_url }}">{{ _('Reactivate organization') }}</a>
</p>

<p>{% trans %}If the request was in error, you can take no action and this link will expire in 24 hours.{% endtrans %}</p>

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

---[FILE: realm_reactivation.subject.txt]---
Location: zulip-main/templates/zerver/emails/realm_reactivation.subject.txt

```text
{% trans %}Reactivate your Zulip organization{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: realm_reactivation.txt]---
Location: zulip-main/templates/zerver/emails/realm_reactivation.txt

```text
{% trans %}Dear former administrators of {{ realm_name }},{% endtrans %}


{% trans %}One of your administrators requested reactivation of the previously deactivated Zulip organization hosted at {{ realm_url }}.{% endtrans %}


{{ _('Click the link below to reactivate your organization.') }}
    <{{ confirmation_url }}>

{% trans %}If the request was in error, you can take no action and this link will expire in 24 hours.{% endtrans %}


{% if corporate_enabled %}
    {% trans %}Do you have questions or feedback to share? Contact us at {{ support_email }} — we'd love to help!{% endtrans %}
{% else %}
    {% trans %}If you have any questions, please contact this Zulip server's administrators at {{ support_email }}.{% endtrans %}
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: remote_billing_legacy_server_confirm_login.html]---
Location: zulip-main/templates/zerver/emails/remote_billing_legacy_server_confirm_login.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/registration_confirmation.png" alt=""/>
{% endblock %}

{% block content %}
<p>
    {% trans %}Either you, or someone on your behalf, has requested a log in link to manage the Zulip plan for <b>{{ remote_server_hostname }}</b>.{% endtrans %}
</p>
<p>
    {% trans %}
    Click the button below to log in.
    {% endtrans %}

    {% trans %}
    This link will expire in {{ validity_in_hours }} hours.
    {% endtrans %}
</p>
<p>
    <a class="button" href="{{ confirmation_url }}">{{ _("Log in") }}</a>
</p>
<p>
    {% trans billing_contact_email=macros.email_tag(billing_contact_email) %}Questions? <a href="{{ billing_help_link }}">Learn more</a> or contact {{ billing_contact_email }}.{% endtrans %}
</p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_billing_legacy_server_confirm_login.subject.txt]---
Location: zulip-main/templates/zerver/emails/remote_billing_legacy_server_confirm_login.subject.txt

```text
{% trans %}Log in to Zulip plan management{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: remote_billing_legacy_server_confirm_login.txt]---
Location: zulip-main/templates/zerver/emails/remote_billing_legacy_server_confirm_login.txt

```text
{% trans %}Either you, or someone on your behalf, has requested a log in link to manage the Zulip plan for {{ remote_server_hostname }}.{% endtrans %}


{% trans %}Click the link below to log in.{% endtrans %} {% trans %}This link will expire in {{ validity_in_hours }} hours.{% endtrans %}

{{ _("Log in") }}: {{ confirmation_url }}

{% trans %}Questions? Learn more at {{ billing_help_link }} or contact {{ billing_contact_email }}.{% endtrans %}
```

--------------------------------------------------------------------------------

````
