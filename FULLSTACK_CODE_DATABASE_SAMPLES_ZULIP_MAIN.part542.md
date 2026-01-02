---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 542
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 542 of 1290)

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

---[FILE: remote_realm_billing_confirm_login.html]---
Location: zulip-main/templates/zerver/emails/remote_realm_billing_confirm_login.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/registration_confirmation.png" alt=""/>
{% endblock %}

{% block content %}
<p>
    {% trans %}
    Click the button below to confirm your email and log in to Zulip plan management for <b>{{ remote_realm_host }}</b>.
    {% endtrans %}
</p>
<p>
    <a class="button" href="{{ confirmation_url }}">{{ _("Confirm and log in") }}</a>
</p>
<p>
    {% trans billing_contact_email=macros.email_tag(billing_contact_email) %}Questions? <a href="{{ billing_help_link }}">Learn more</a> or contact {{ billing_contact_email }}.{% endtrans %}
</p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_realm_billing_confirm_login.subject.txt]---
Location: zulip-main/templates/zerver/emails/remote_realm_billing_confirm_login.subject.txt

```text
{% trans %}Confirm email for Zulip plan management{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: remote_realm_billing_confirm_login.txt]---
Location: zulip-main/templates/zerver/emails/remote_realm_billing_confirm_login.txt

```text
{% trans %}Click the link below to confirm your email and log in to Zulip plan management for {{remote_realm_host}}.{% endtrans %}


{{ _("Confirm and log in") }}: {{ confirmation_url }}

{% trans %}Questions? Learn more at {{ billing_help_link }} or contact {{ billing_contact_email }}.{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: sales_support_request.html]---
Location: zulip-main/templates/zerver/emails/sales_support_request.html

```text
{% extends "zerver/emails/email_base_messages.html" %}

{% block content %}
<b>Subject</b>: Sales support request for {{ organization_name }}
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
<b>Message</b>: {{ message }}
<br />
<b>Support link</b>: {{ support_link }}
<br />

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: sales_support_request.subject.txt]---
Location: zulip-main/templates/zerver/emails/sales_support_request.subject.txt

```text
Sales support request for {{organization_name}}
```

--------------------------------------------------------------------------------

---[FILE: sales_support_request.txt]---
Location: zulip-main/templates/zerver/emails/sales_support_request.txt

```text
Subject: Sales support request for {{ organization_name }}

Full name: {{ full_name }}

Email: {{ email }}

Role: {{ role }}

Organization type: {{ organization_type }}

Organization website: {{ organization_website }}

Expected user count: {{ expected_user_count }}

Message: {{ message }}

Support link: {{ support_link }}
```

--------------------------------------------------------------------------------

---[FILE: sponsorship_approved_community_plan.html]---
Location: zulip-main/templates/zerver/emails/sponsorship_approved_community_plan.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}
<p>
    {% trans %}Your request for Zulip sponsorship has been approved! Your organization has been upgraded to the <a href="{{ plans_link }}">Zulip Community plan</a>.{% endtrans %}
</p>
<p>
    {% trans %}If you could <a href="{{ link_to_zulip }}">list Zulip as a sponsor on your website</a>, we would really appreciate it!{% endtrans %}
</p>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: sponsorship_approved_community_plan.subject.txt]---
Location: zulip-main/templates/zerver/emails/sponsorship_approved_community_plan.subject.txt

```text
{% trans %}Community plan sponsorship approved for {{ billing_entity }}!{% endtrans %}
```

--------------------------------------------------------------------------------

---[FILE: sponsorship_approved_community_plan.txt]---
Location: zulip-main/templates/zerver/emails/sponsorship_approved_community_plan.txt

```text
{{ _("Your request for Zulip sponsorship has been approved! Your organization has been upgraded to the Zulip Community plan.") }}
{{ plans_link }}

{{ _("If you could list Zulip as a sponsor on your website, we would really appreciate it!") }}
{{ link_to_zulip }}
```

--------------------------------------------------------------------------------

---[FILE: sponsorship_request.html]---
Location: zulip-main/templates/zerver/emails/sponsorship_request.html

```text
{% extends "zerver/emails/email_base_messages.html" %}

{% block content %}
<br />

{% if is_cloud_organization %}
<b>Zulip Cloud</b>
{% else %}
<b>Self-hosted</b>
{% endif %}

<br /><br />

<b>Support URL</b>: <a class="sponsorship_request_link" href="{{ support_url }}">{{ support_url }}</a>

<br /><br />

<b>Website</b>: <a class="sponsorship_request_link" href="{{ website }}">{{ website }}</a>

<br /><br />

<b>Organization type</b>: {{ organization_type }}

<br /><br />

<b>Description</b>:
<br />
{{ description }}

<br /><br />

<b>How do you plan to use Zulip?</b>
<br />
{{ plan_to_use_zulip }}

<br /><br />

<b>Expected users</b>: {{ expected_total_users }}

<br /><br />

<b>Paid staff</b>: {{ paid_users_count }}
<br />
<b>Description of paid staff</b>:
<br />
{{ paid_users_description }}

<br /><br />

<b>Requested by</b>: {{ requested_by }} ({{ user_role }})

{% if requested_plan %}
<br /><br />
<b>Requested plan</b>: {{ requested_plan }}
{% endif %}

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: sponsorship_request.subject.txt]---
Location: zulip-main/templates/zerver/emails/sponsorship_request.subject.txt

```text
Sponsorship request for {{ billing_entity }}
```

--------------------------------------------------------------------------------

---[FILE: sponsorship_request.txt]---
Location: zulip-main/templates/zerver/emails/sponsorship_request.txt

```text
Support URL: {{ support_url }}

Website: {{ website }}

Organization type: {{ organization_type }}

Description:
{{ description }}

How do you plan to use Zulip?
{{ plan_to_use_zulip }}

Expected users:
- Total: {{ expected_total_users }}
- Paid: {{ paid_users_count }}

Description of paid users:
{{ paid_users_description }}

Requested by: {{ requested_by }} ({{ user_role }})
```

--------------------------------------------------------------------------------

---[FILE: stylelint.config.js]---
Location: zulip-main/templates/zerver/emails/stylelint.config.js

```javascript
// @ts-check

/** @type {import("stylelint").Config} */
export default {
    extends: ["../../../stylelint.config"],
    rules: {
        // Add some exceptions for recommended rules
        "property-no-unknown": [true, {ignoreProperties: [/^mso-/]}],

        // We don't run autoprefixer on email CSS
        "at-rule-no-vendor-prefix": null,
        "media-feature-name-no-vendor-prefix": null,
        "property-no-vendor-prefix": null,
        "selector-no-vendor-prefix": null,
        "value-no-vendor-prefix": null,
    },
};
```

--------------------------------------------------------------------------------

---[FILE: support_request.html]---
Location: zulip-main/templates/zerver/emails/support_request.html

```text
{% extends "zerver/emails/email_base_messages.html" %}

{% block content %}
<b>Support URL</b>: <a class="support_request_link" href="{{ support_url }}">{{ support_url }}</a>

<br /><br />

<b>Subject</b>: {{ request_subject }}

<br /><br />

<b>Message</b>:
<br />
{{ request_message }}

<br /><br />

<b>Requested by</b>: {{ requested_by }} ({{ user_role }})

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: support_request.subject.txt]---
Location: zulip-main/templates/zerver/emails/support_request.subject.txt

```text
Support request for {{ realm_string_id }}
```

--------------------------------------------------------------------------------

---[FILE: support_request.txt]---
Location: zulip-main/templates/zerver/emails/support_request.txt

```text
Support URL: {{ support_url }}

Subject: {{ request_subject }}

Message:
{{ request_message }}

Requested by: {{ requested_by }} ({{ user_role }})
```

--------------------------------------------------------------------------------

---[FILE: back_to_login_component.html]---
Location: zulip-main/templates/zerver/include/back_to_login_component.html

```text
<div class="back-to-login-wrapper if-zulip-electron"><!-- only show if on `ZulipElectron` -->
    <a class="back-to-login" href="{{login_url}}"><i class="fa fa-arrow-left"></i> Back to the login page</a>
</div>
```

--------------------------------------------------------------------------------

---[FILE: asana.md]---
Location: zulip-main/templates/zerver/integrations/asana.md

```text
# Zulip Asana integration

Get Zulip notifications for your Asana projects via Zapier!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. Continue with step 3 of the [Zapier documentation][1] to finish
   integrating Zulip with Asana.

!!! tip ""

    You can repeat the above process and create Zaps for different projects
    and/or different kinds of Asana events that you'd like to be notified
    about in Zulip.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/asana/001.png)

[1]: ./zapier
```

--------------------------------------------------------------------------------

---[FILE: big-blue-button.md]---
Location: zulip-main/templates/zerver/integrations/big-blue-button.md

```text
# Use BigBlueButton as your call provider in Zulip

You can configure BigBlueButton as the call provider for your organization.
Users will be able to start a BigBlueButton call and invite others using the
**add video call** (<i class="zulip-icon zulip-icon-video-call"></i>) or
**add voice call** (<i class="zulip-icon zulip-icon-voice-call"></i>) button
[in the compose box](/help/start-a-call).

!!! warn ""

    **Note:** This is currently only possible on self-hosted Zulip
    installations, and you'll need a BigBlueButton server.

## Configure BigBlueButton as your call provider

By default, Zulip integrates with
[Jitsi Meet](https://jitsi.org/jitsi-meet/), a fully-encrypted, 100% open
source video conferencing solution. You can configure Zulip to use BigBlueButton
as your call provider instead.

{start_tabs}

1. Run `bbb-conf --secret` on your BigBlueButton server to get
   the hostname and shared secret for your BigBlueButton server.

1. In `/etc/zulip/zulip-secrets.conf`, set `big_blue_button_secret` to your
   BigBlueButton server's shared secret.

1. In `/etc/zulip/settings.py`, set `BIG_BLUE_BUTTON_URL` to your
   BigBlueButton server's hostname.

1. Restart the Zulip server with
   `/home/zulip/deployments/current/scripts/restart-server`.

{settings_tab|organization-settings}

1. Under **Compose settings**, select BigBlueButton from the **Call provider**
   dropdown.

1. Click **Save changes**.

{end_tabs}

### Related documentation

- [How to start a call](/help/start-a-call)
- [Jitsi Meet integration](/integrations/jitsi)
- [Zoom integration](/integrations/zoom)
* [BigBlueButton server configuration](https://docs.bigbluebutton.org/administration/customize/#other-configuration-changes)
```

--------------------------------------------------------------------------------

---[FILE: capistrano.md]---
Location: zulip-main/templates/zerver/integrations/capistrano.md

```text
# Zulip Capistrano Integration

Get Zulip notifications for your Capistrano deploys!

{start_tabs}

1.  {!create-an-incoming-webhook.md!}

1.  {!download-python-bindings.md!}

1.  You can now send Zulip messages by calling the `zulip-send`
    utility from your `deploy.rb` config file.

1. Here's some example code for sending a Zulip notification when a
   deployment has completed:

        after 'deploy', 'notify:humbug'

        namespace :notify do
          desc "Post a message to Zulip after deploy"
          task :humbug do
            run_locally "echo 'I just deployed to #{stage}! :tada:' | zulip-send \
            --user capistrano-bot@{{ display_host }} --api-key a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5 \
            --site={{ zulip_url }} \
            --stream commits --subject deployments || true"
          end
        end

    Use your bot's email address and [API key][3] for `--user` and
    `--api-key` respectively.

{end_tabs}

{!congrats.md!}

![Capistrano bot message](/static/images/integrations/capistrano/001.png)

### Configuration Options

* Customize the notification trigger by replacing `deploy` in the above
  example with [any stage][1] of your deployment process.

### Related documentation

* [Capistrano's Before/After Hooks][1]
* [Configuring the Python bindings][2]

[1]: https://capistranorb.com/documentation/getting-started/before-after/
[2]: https://zulip.com/api/configuring-python-bindings
[3]: https://zulip.com/api/api-keys#get-a-bots-api-key
```

--------------------------------------------------------------------------------

---[FILE: catalog.html]---
Location: zulip-main/templates/zerver/integrations/catalog.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "integrations" %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block hello_page_container %} hello-main{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}
{% include 'zerver/gradients.html' %}
{% import 'zerver/integrations/macros.html' as integration_macros %}

<div class="portico-landing integrations">
    <div class="main">
        <div class="padded-content">
            <div class="inner-content">
                <div class="integration-main-text">
                    <header>
                        <h1 class="portico-page-heading">
                            {% trans %}Over {{integrations_count_display}} native integrations.{% endtrans %}
                        </h1>
                    </header>
                    <h2 class="portico-page-subheading">
                        {% trans %}
                        And hundreds more through
                        <a href="/integrations/zapier">Zapier</a>
                        and
                        <a href="/integrations/ifttt">IFTTT</a>.
                        {% endtrans %}
                    </h2>
                </div>

                <div id="integration-search">
                    <div class="searchbar">
                        <div class="searchbar-reset">
                            <i class="fa fa-search" aria-hidden="true"></i>
                            <input type="text" class="search_input" placeholder="{{ _('Search integrations') }}"/>
                        </div>
                    </div>
                </div>

                {% set dropdown_label = _('Filter by category') %}
                {% if selected_category_slug != 'all' %}
                {% set dropdown_label = categories_dict.get(selected_category_slug, dropdown_label) %}
                {% endif %}
                <div class="integration-categories-dropdown">
                    <div class="integration-toggle-categories-dropdown">
                        <h3 class="dropdown-category-label">{{ dropdown_label }}</h3>
                        <i class="fa fa-angle-down" aria-hidden="true"></i>
                    </div>
                    <div class="dropdown-list">
                        <a href="/integrations/">
                            <h4 class="integration-category {% if selected_category_slug == 'all' %}selected{% endif %}" data-category="all">All</h4>
                        </a>
                        {% for category in categories_dict.keys() %}
                        <a href="/integrations/category/{{ category }}">
                            <h4 class="integration-category {% if selected_category_slug == category %}selected{% endif %}" data-category="{{ category }}">
                                {{ categories_dict[category] }}
                            </h4>
                        </a>
                        {% endfor %}
                        <h4 class="heading">{% trans %}Custom integrations{% endtrans %}</h4>
                        <a href="/api/incoming-webhooks-overview">
                            <h4>{% trans %}Incoming webhooks{% endtrans %}</h4>
                        </a>
                        <a href="/api/writing-bots">
                            <h4>{% trans %}Interactive bots{% endtrans %}</h4>
                        </a>
                        <a href="/api/rest">
                            <h4>{% trans %}REST API{% endtrans %}</h4>
                        </a>
                    </div>
                </div>

                <div class="catalog">
                    <div class="integration-categories-sidebar">
                        <h3>{% trans %}Categories{% endtrans %}</h3>
                        <a href="/integrations/">
                            <h4 data-category="all" class="integration-category {% if selected_category_slug == 'all' %}selected{% endif %}">{% trans %}All{% endtrans %}</h4>
                        </a>
                        {% for category in categories_dict.keys() %}
                        <a href="/integrations/category/{{ category }}">
                            <h4 data-category="{{ category }}" class="integration-category {% if selected_category_slug == category %}selected{% endif %}">
                                {{ categories_dict[category] }}
                            </h4>
                        </a>
                        {% endfor %}
                        <hr />
                        <h3>{% trans %}Custom integrations{% endtrans %}</h3>
                        <a href="/api/incoming-webhooks-overview">
                            <h4>{% trans %}Incoming webhooks{% endtrans %}</h4>
                        </a>
                        <a href="/api/writing-bots">
                            <h4>{% trans %}Interactive bots{% endtrans %}</h4>
                        </a>
                        <a href="/api/rest">
                            <h4>{% trans %}REST API{% endtrans %}</h4>
                        </a>
                    </div>

                    <div class="integration-lozenges">
                        {% for integration in visible_integrations %}
                        <a href="/integrations/{{ integration.name }}{% if selected_category_slug != 'all' %}?category={{ selected_category_slug }}{% endif %}">
                            {{ integration_macros.render_integration_lozenge(integration) }}
                        </a>
                        {% endfor %}
                        <hr />
                        <div class="integration-request center">
                            <p>Don't see an integration you need? We'd love to help.</p>
                            <a href="/api/integrations-overview" class="button green">
                                Create your own
                            </a>
                            <span class="integration-divider">
                                or
                            </span>
                            <a href="/help/request-an-integration" class="button green">
                                Request an integration
                            </a>
                        </div>
                    </div>
                </div>
            </div> <!-- .inner-content -->
        </div> <!-- .padded-content -->
    </div> <!-- .main -->
</div> <!-- .portico-landing -->

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: discourse.md]---
Location: zulip-main/templates/zerver/integrations/discourse.md

```text
# Zulip Discourse integration

Forward new Discourse posts to Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. Install the Discourse [Chat Integration][chat-integration].

1. In your **Discourse site settings**, toggle
   `chat_integration_zulip_enabled`, and fill in the following information:

    * `chat_integration_zulip_server`: {{ zulip_url }}
    * `chat_integration_zulip_bot_api_key`: your bot's API key
    * `chat_integration_zulip_bot_email_address`: your bot's email

1. Go to the **Plugins** tab, click on **Chat Integration**. Select
   **Zulip**, and click **Add Channel**.

1. Set **Stream** to the [channel](/help/create-a-channel) name that you'd
   like to receive notifications in, set **Subject** to the topic name, and
   click **Save Channel**.

1. To filter the posts you'd like to forward to Zulip,
   [configure the rules][configuring-rules] in your Discourse forum's
   **Chat Integrations** panel.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/discourse/001.png)

### Related documentation

- [Discourse Chat Integration][chat-integration]
- [Discourse's documentation on the Zulip integration][setup-instructions]

[setup-instructions]: https://meta.discourse.org/t/68501
[chat-integration]: https://meta.discourse.org/t/discourse-chat-integration/66522
[configuring-rules]: https://meta.discourse.org/t/discourse-chat-integration/66522#configuring-rules-4
```

--------------------------------------------------------------------------------

---[FILE: doc.html]---
Location: zulip-main/templates/zerver/integrations/doc.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "integrations" %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block hello_page_container %} hello-main{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}
{% include 'zerver/gradients.html' %}
{% import 'zerver/integrations/macros.html' as integration_macros %}

<div class="portico-landing integrations">
    <div class="main">
        <div class="padded-content">
            <div class="inner-content">
                <div id="integration-instructions-group">
                    <div id="integration-instruction-block" class="integration-instruction-block">
                        {% if integration_categories %}
                        <div class="categories">
                            {% for slug, display_name in integration_categories %}
                            <a href="/integrations/category/{{ slug }}">
                                <h3 class="integration-category" data-category="{{ slug }}">
                                    {{ display_name }}
                                </h3>
                            </a>
                            {% endfor %}
                        </div>
                        {% endif %}
                        {{ integration_macros.render_integration_lozenge(selected_integration, is_doc_view=true) }}
                        <a href="/integrations/{% if return_category_slug != 'all' %}category/{{ return_category_slug }}{% endif %}" id="integration-list-link" class="no-underline">
                            <i class="fa fa-arrow-circle-left" aria-hidden="true"></i><span class="integrations-back-to-list-label">Back to list</span>
                        </a>
                    </div>

                    <div id="{{ selected_integration.name }}" class="integration-instructions markdown show">
                        <div class="help-content">{{ integration_doc_html|safe }}</div>
                        {{ integration_macros.render_logos_disclaimer() }}
                    </div>
                </div>
            </div> <!-- .inner-content -->
        </div> <!-- .padded-content -->
    </div> <!-- .main -->
</div> <!-- .portico-landing -->

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: email.md]---
Location: zulip-main/templates/zerver/integrations/email.md

```text
<!-- Any changes to this file should be reflected in
     starlight_help/src/content/docs/using-zulip-via-email.mdx
     and vice versa. This file used to be a symlink to that file
     before we converted it to mdx. -->
# Using Zulip via email

With Zulip, it is possible for some members of your organization to participate
from their email client, without opening the Zulip app after the initial
setup is complete.

## Subscribe a Zulip channel to a mailing list

{start_tabs}

1. Create a mailing list to use with Zulip, or use an existing one.

1. Create a Zulip channel that will receive mailing list traffic, or
   use an existing one.

1. [Generate an email
   address](/help/message-a-channel-by-email#message-a-channel-by-email_1) for
   the channel you created.

1. Add the email address for the channel to the mailing list.

{end_tabs}

New emails sent to the email list will now be mirrored to the channel.

## Setup instructions for email users

If you want to interact with Zulip primarily (or entirely) via your email client:

{start_tabs}

1. [Subscribe](/help/introduction-to-channels#browse-and-subscribe-to-channels) to any channels you are
   interested in.

{settings_tab|notifications}

1.  In the **Notification triggers** table, make sure both of the checkboxes
    under **Email** are checked.

1. Close the Zulip window. Zulip does not send email notifications
   while you are actively engaging with the web application.

{end_tabs}

New Zulip messages will now be delivered to your email account. You
can reply directly to the emails coming from Zulip, and your replies
will be posted in the appropriate topic or direct message
conversation on Zulip.

## Related articles

* [Message a channel by email](/help/message-a-channel-by-email)
```

--------------------------------------------------------------------------------

---[FILE: errbot.md]---
Location: zulip-main/templates/zerver/integrations/errbot.md

```text
# Zulip Errbot integration

Run your favorite chatbot in Zulip!

{start_tabs}

1. [Install errbot][install-errbot], and follow the instructions to set up a
   `config.py`.

1. Clone the [Errbot integration package for Zulip][errbot-package]
   repository somewhere convenient, and install the requirements listed in
   `errbot-backend-zulip/requirements.txt`.

1. {!create-a-generic-bot.md!}

1. Edit your ErrBot's `config.py`. Use the following template for a minimal
   configuration:

        import logging

        BACKEND = 'Zulip'

        BOT_EXTRA_BACKEND_DIR = r'<path/to/errbot-backend-zulip>'
        BOT_DATA_DIR = r'<path/to/your/errbot/data/directory>'
        BOT_EXTRA_PLUGIN_DIR = r'<path/to/your/errbot/plugin/directory>'

        BOT_LOG_FILE = r'<path/to/your/errbot/logfile.log>'
        BOT_LOG_LEVEL = logging.INFO

        BOT_IDENTITY = {
          'email': '<your-bot@email.address>',
          'key': '<api-key-of-your-bot>',
          'site': '<your-zulip-organization-url>'
        }
        BOT_ADMINS = ('<your@email.address>',)
        CHATROOM_PRESENCE = ()
        BOT_PREFIX = '@**<your-bot-name>**'

    Sections you need to edit are marked with `<>`. Replace the `<...>`
    placeholders with your own values, removing the `<` and `>` brackets.

    Use the details of the Zulip bot created above for the `BOT_IDENTITY`
    and `BOT_PREFIX` sections.

1. [Start ErrBot][start-errbot].

!!! tip ""

    ErrBot uses the term "Rooms" for Zulip channels.

{end_tabs}

{!congrats.md!}

![Errbot message](/static/images/integrations/errbot/000.png)

### Related documentation

- [Errbot Documentation](https://errbot.readthedocs.io/en/latest/)
- [Errbot integration package for Zulip][errbot-package]
- [Python bindings Configuration][config-python-bindings]

[install-errbot]: https://errbot.readthedocs.io/en/latest/user_guide/setup.html
[errbot-package]: https://github.com/zulip/errbot-backend-zulip
[start-errbot]: https://errbot.readthedocs.io/en/latest/user_guide/setup.html#starting-the-daemon
[config-python-bindings]: https://zulip.com/api/configuring-python-bindings
```

--------------------------------------------------------------------------------

---[FILE: giphy.md]---
Location: zulip-main/templates/zerver/integrations/giphy.md

```text
# Zulip GIPHY GIF integration

Send animated GIFs with your message using GIPHY.

GIPHY is enabled by default in Zulip Cloud. Follow
[these instructions][configure-giphy] to configure GIPHY on a
**self-hosted** Zulip server.

### Related documentation

* [Using GIFs in Zulip][help-center-gifs]

[help-center-gifs]: /help/animated-gifs
[configure-giphy]: https://zulip.readthedocs.io/en/latest/production/gif-picker-integrations.html#giphy
```

--------------------------------------------------------------------------------

---[FILE: github-actions.md]---
Location: zulip-main/templates/zerver/integrations/github-actions.md

```text
# Zulip GitHub Actions integration

Get Zulip notifications from GitHub Actions workflow runs!

{start_tabs}

{tab|send-channel-message}

1.  {!create-a-generic-bot.md!}

1.  Add the `zulip/github-actions-zulip/send-message@v1` action to your GitHub
    Actions [workflow file][workflows]. The `content` template parameter supports Markdown
    and [GitHub Actions expressions][expressions].

      ```
      {% raw %}- name: Send a channel message
      if: steps.backup.outcome == 'failure'
      uses: zulip/github-actions-zulip/send-message@v1
      with:
         # Your bot's API key and email
         api-key: ${{ secrets.ZULIP_API_KEY }}
         email: "github-actions-generic-bot@example.com"
         organization-url: "https://your-org.zulipchat.com"
         type: "stream"
         # Notification channel
         to: "github-actions updates"
         topic: "scheduled backups"
         # Example: Notify if a previous GitHub Actions step with the ID "backup" fails.
         content: "Backup [failed](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}) at <time:${{ steps.backup.outputs.time }}>.\n>${{ steps.backup.outputs.error }}"{% endraw %}
      ```

{tab|send-dm}

1.  {!create-a-generic-bot.md!}

1.  Look up the ID of the recipient for DM notifications in their
    [profile](https://zulip.com/help/view-someones-profile).

1. Add the `zulip/github-actions-zulip/send-message@v1` action to your GitHub
    Actions [workflow file][workflows]. The `content` template parameter
    supports Markdown and [GitHub Actions expressions][expressions].

      ```
      {% raw %}- name: Send a channel message
      if: steps.backup.outcome == 'failure'
      uses: zulip/github-actions-zulip/send-message@v1
      with:
         # Your bot's API key and email
         api-key: ${{ secrets.ZULIP_API_KEY }}
         email: "github-actions-generic-bot@example.com"
         organization-url: "https://your-org.zulipchat.com"
         type: "private"
         # Recipient's user ID
         to: "295"
         # Example: Notify if a previous GitHub Actions step with the ID "backup" fails.
         content: "Backup [failed](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}) at <time:${{ steps.backup.outputs.time }}>.\n>${{ steps.backup.outputs.error }}"{% endraw %}
      ```

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/github-actions/001.png)

### Related documentation

* [Configuring the Send Message Action][README]

* [Zulip GitHub Actions repository][repo]

* [GitHub integration](/integrations/github)

[README]: https://github.com/zulip/github-actions-zulip/blob/main/send-message/README.md
[repo]: https://github.com/zulip/github-actions-zulip
[expressions]: https://docs.github.com/en/actions/reference/evaluate-expressions-in-workflows-and-actions
[workflows]: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
```

--------------------------------------------------------------------------------

---[FILE: hubot.md]---
Location: zulip-main/templates/zerver/integrations/hubot.md

```text
# Zulip Hubot Integration

Use Hubot to execute scripts and commands within Zulip!

{start_tabs}

1. Follow the [**Getting Started with Hubot**][getting-started] guide
   to create your Hubot. You'll have a new directory from which `bin/hubot`
   starts a vanilla Hubot instance with the shell backend.

1. In your Hubot's directory, install the Zulip adapter by running:

      `npm install --save hubot-zulip`

1. {!create-a-generic-bot.md!}

1. Hubot uses the following environment variables, set them using the
   information of the bot you created, by running:

    ```
    export HUBOT_ZULIP_SITE="{{ zulip_url }}"
    export HUBOT_ZULIP_BOT="hubot-bot@{{ zulip_url }}"
    export HUBOT_ZULIP_API_KEY="0123456789abcdef0123456789abcdef"
    ```

1. Run Hubot:

    `bin/hubot --adapter zulip --name "<bot username>"`

!!! tip ""

    Hubot automatically listens for commands on all public channels. Private
    channels require an invitation. Hubot's access can be
    [configured](#configuration-options).

{end_tabs}

To test your Hubot installation, send it an @-notification with a
basic command, e.g., `@Hubot pug me`, which should produce a
result like this:

![Hubot message](/static/images/integrations/hubot/001.png)

### Configuration options

* To make Hubot listen only on the channels that it is subscribed to, run:

     `export HUBOT_ZULIP_ONLY_SUBSCRIBED_STREAMS`

### Related documentation

* [GitHub repository for Zulip Hubot adapter][hubot-zulip]

* Zulip Integrations using Hubot: [Assembla](/integrations/assembla) |
  [Bonusly](/integrations/bonusly) |
  [Chartbeat](/integrations/chartbeat) |
  [Dark Sky](/integrations/darksky) |
  [Instagram](/integrations/instagram) |
  [Google Translate](/integrations/google-translate) |
  [MailChimp](/integrations/mailchimp) |
  [YouTube](/integrations/youtube)

* [Other Hubot adapters][other-adapters]

[hubot-zulip]: https://github.com/zulip/hubot-zulip
[getting-started]: https://hubot.github.com/docs/#getting-started-with-hubot
[other-adapters]: https://github.com/search?q=topic%3Ahubot-adapter&type=Repositories
```

--------------------------------------------------------------------------------

---[FILE: hubot_common.md]---
Location: zulip-main/templates/zerver/integrations/hubot_common.md

```text
# Zulip {{ integration_display_name }} integration

Get Zulip notifications from {{ integration_display_name }} via Hubot!

{start_tabs}

1.  [Install Hubot](hubot), and test it to make sure it is working.

1.  Follow [these instructions]({{ hubot_docs_url }}) to set up
the integration with {{ integration_display_name }}!

{end_tabs}
```

--------------------------------------------------------------------------------

---[FILE: jenkins.md]---
Location: zulip-main/templates/zerver/integrations/jenkins.md

```text
1. {!create-channel.md!}

1. {!create-an-incoming-webhook.md!}

1. Install the "Zulip" plugin by going to
   **Manage Jenkins > Manage Plugins > Available**,
   typing in **Zulip**, and clicking **Install without Restart**.

      ![Plugin installation](/static/images/integrations/jenkins/001.png)

1. Once the plugin is installed, configure it by going to
   **Manage Jenkins > Configure System**. Scroll to the section
   labeled **Zulip Notification Settings**, and specify your
   Zulip server address, bot's email address and API key.
   Optionally, you may configure a default stream or topic. You can also enable
   smart notifications (i.e. only receive notifications when a build fails or
   recovers from a failed state).

      (If you don't see this option, you may first need to restart
      Jenkins.)

      ![Plugin configuration](/static/images/integrations/jenkins/002.png)

1. Once you've done that, it's time to configure one of your
   freestyle projects to use the Zulip notification plugin. On your
   Jenkins project page, click **Configure** on the left sidebar. Scroll to
   the bottom until you find the section labeled **Post-build
   Actions**. Click the dropdown and select **Zulip Notification**.
   It should look as shown below. If you'd rather not use the defaults from
   the global configuration, you can set a custom stream and topic.
   If you don't specify a custom topic, the project name will be used as the
   topic instead. Then click **Save**.

    ![Post-build action configuration](/static/images/integrations/jenkins/003.png)

    When your builds fail or succeed, you'll see a message as shown below.

{!congrats.md!}

![Jenkins bot message](/static/images/integrations/jenkins/004.png)

### Advanced use cases

Besides the **Zulip Notification** post-build action, this plugin
also supports the **Zulip Send** action.
To learn more, see the [plugin's README](https://github.com/jenkinsci/zulip-plugin).

### Troubleshooting

1. Did you set up a post-build action for your project?

1. Does the stream you picked (e.g., `jenkins`) already exist?
   If not, create the stream and make sure you're subscribed to it.

1. Are your API key and email address correct? Test them
   using [our curl API](/api/).

1. Configure a Jenkins log recorder for **jenkins.plugins.zulip**
   and check why your messages fail to send.
```

--------------------------------------------------------------------------------

---[FILE: jitsi.md]---
Location: zulip-main/templates/zerver/integrations/jitsi.md

```text
# Use Jitsi Meet as your call provider in Zulip

By default, Zulip integrates with [Jitsi Meet](https://jitsi.org/jitsi-meet/),
a fully-encrypted, 100% open source video conferencing solution. Users will be
able to start a Jitsi Meet call and invite others using the **add video call**
(<i class="zulip-icon zulip-icon-video-call"></i>) or **add voice call**
(<i class="zulip-icon zulip-icon-voice-call"></i>) button [in the compose
box](/help/start-a-call).

## Configure a self-hosted instance of Jitsi Meet

Zulip uses the [cloud version of Jitsi Meet](https://meet.jit.si/)
as its default video call provider. You can also use a self-hosted
instance of Jitsi Meet.

{start_tabs}

{settings_tab|organization-settings}

1. Under **Compose settings**, confirm **Jitsi Meet** is selected in the
   **Call provider** dropdown.

1. Select **Custom URL** from the **Jitsi server URL** dropdown, and enter
   the URL of your self-hosted Jitsi Meet server.

1. Click **Save changes**.

{end_tabs}

## Related documentation

- [How to start a call](/help/start-a-call)
- [Zoom integration](/integrations/zoom)
- [BigBlueButton integration](/integrations/big-blue-button)
```

--------------------------------------------------------------------------------

---[FILE: macros.html]---
Location: zulip-main/templates/zerver/integrations/macros.html

```text
{% macro render_integration_lozenge(integration, is_doc_view=false) -%}
    <div
      class="integration-lozenge{% if is_doc_view %} without-category{% endif %} integration-{{ integration.name }}"
      data-categories='{{ integration.get_translated_categories()|tojson }}'
      data-name="{{ integration.name }}">
        <img class="integration-logo" src="{{ integration.logo_url }}"
          alt="{{ integration.display_name }} logo"/>
        {% if integration.secondary_line_text %}
        <h3 class="integration-name with-secondary">{{ integration.display_name }}</h3>
        <h4 class="integration-secondary-line-text">
            {{ integration.secondary_line_text }}
        </h4>
        {% else %}
        <h3 class="integration-name">{{ integration.display_name }}</h3>
        {% endif %}
        <h4 class="integration-category">{{ integration.categories[0] }}</h4>
    </div>
{%- endmacro %}

{% macro render_logos_disclaimer() -%}
    <p class="logos_disclaimer">
        Logos are trademarks of their respective owners.
        None of the integrations on this page are created by,
        affiliated with, or supported by the companies
        represented by the logos.
    </p>
{%- endmacro %}
```

--------------------------------------------------------------------------------

````
