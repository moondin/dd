---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 543
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 543 of 1290)

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

---[FILE: mastodon.md]---
Location: zulip-main/templates/zerver/integrations/mastodon.md

```text
# Zulip Mastodon integration

Fetch public posts (sometimes called “toots”) of individual accounts or
federated hashtags from Mastodon in Zulip!

While Zulip doesn't integrate directly with ActivityPub or the overall
Fediverse, some ActivityPub servers, like
[Mastodon](https://joinmastodon.org/), publish RSS feeds that can be
followed in Zulip using the [Zapier][1] or [RSS][2] integrations.

!!! warn ""

    Due to the complexities of Mastodon federation, following a hashtag on
    one homeserver does not guarantee that all posts in the entire Fediverse
    will be included in the feed. Rather, all public posts that have
    federated to the instance in question will be included. This means you
    may get different results for the same hashtag, depending on which
    homeserver you choose to subscribe through.

{start_tabs}

1. Find the RSS feed for the account or hashtag you'd like to follow. Usually,
   this means appending `.rss` to its Mastodon URL. For example:

    - To follow Zulip's Mastodon account at `https://fosstodon.org/@zulip`,
    you would use `https://fosstodon.org/@zulip.rss`.
    - To follow the **#zulip** hashtag at `https://fosstodon.org/tags/zulip`,
    you would use `https://fosstodon.org/tags/zulip.rss`.

1. Follow the [Zapier][1] integration guide (recommended) or the [plain RSS][2]
   integration guide using this feed URL.

{end_tabs}

{!congrats.md!}

![Mastodon posts in Zulip via Zapier](/static/images/integrations/mastodon/001.png)

[1]: ./zapier
[2]: ./rss
```

--------------------------------------------------------------------------------

---[FILE: notion.md]---
Location: zulip-main/templates/zerver/integrations/notion.md

```text
# Zulip Notion integration

Get Zulip notifications for your Notion pages and databases via Zapier!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. Continue with step 3 of the [Zapier documentation][1] to finish
   integrating Zulip with Notion.

!!! tip ""

    You can repeat the above process and create Zaps for different projects
    and/or different kinds of Notion events that you'd like to be notified
    about in Zulip.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/notion/001.png)

[1]: ./zapier
```

--------------------------------------------------------------------------------

---[FILE: onyx.md]---
Location: zulip-main/templates/zerver/integrations/onyx.md

```text
# Zulip Onyx Integration

Export discussions from Zulip channels and topics to your Onyx knowledge
base!

{start_tabs}

1. {!create-a-generic-bot.md!}

1. [Subscribe the bot][subscribe-channels] to the Zulip channels that you
   want to export.

1. Copy the bot's credentials by clicking the **copy**
   (<i class="zulip-icon zulip-icon-copy"></i>) icon under the bot's name.

1. In Onyx, open the **Admin Dashboard** and select the **Zulip Connector**.

1. Under **Provide Credentials**, paste the credentials that you copied
   above, and click **Update**.

1. Set **Realm name** to the name of your Zulip organization, set
   **Realm URL** to `{{ zulip_url }}`, and click **Connect**.

{end_tabs}

Congrats, you're done! You should be able to index Zulip from your Onyx
**Connectors Dashboard**!

### Related documentation

* [Zulip Connector documentation](https://docs.onyx.app/connectors/zulip)
* [About Onyx Connectors](https://docs.onyx.app/connectors/overview)

[subscribe-channels]: /help/manage-user-channel-subscriptions#subscribe-a-user-to-a-channel
```

--------------------------------------------------------------------------------

---[FILE: puppet.md]---
Location: zulip-main/templates/zerver/integrations/puppet.md

```text
Zulip supports Puppet integration and can notify you when Puppet
runs fail (or when they happen at all).

1.  Follow the instructions
    [here](https://forge.puppetlabs.com/mbarr/puppet_zulip)
    to get it set up.

{!congrats.md!}

![](/static/images/integrations/puppet/001.png)
```

--------------------------------------------------------------------------------

---[FILE: redmine.md]---
Location: zulip-main/templates/zerver/integrations/redmine.md

```text
Get information on new or updated Redmine issues right in
Zulip with our Zulip Redmine plugin!

_Note: this setup must be done by a Redmine Administrator._

### Installing

Following the [Redmine plugin installation guide][1]:

1. Start by changing to the Redmine instance root directory:
  `cd /path/to/redmine/instance`

1. Clone the [Zulip Redmine plugin repository][2] into the `plugins` subdirectory
   of your Redmine instance.
   `git clone https://github.com/zulip/zulip-redmine-plugin plugins/redmine_zulip`

1. Update the Redmine database by running (for Rake 2.X, see
   the guide for instructions for older versions):
   `rake redmine:plugins:migrate RAILS_ENV=production`

1. Restart your Redmine instance.

The Zulip plugin is now registered with Redmine!

### Global settings

1. {!create-an-incoming-webhook.md!}

2. Log in to your Redmine instance, click on **Administration** in the top-left
corner, then click on **Plugins**.

3. Find the **Redmine Zulip** plugin, and click **Configure**. Fill
out the following fields:

    * Zulip URL (e.g `{{ zulip_url }}`)
    * Zulip Bot E-mail
    * Zulip Bot API key
    * Stream name __*__
    * Issue updates subject __*__
    * Version updates subject __*__

    _* You can use the following variables in these fields:_

    * ${issue_id}
    * ${issue_subject}
    * ${project_name}
    * ${version_name}

### Project settings

To override the global settings for a specific project, go to the
project's **Settings** page, and select the **Zulip** tab.

{!congrats.md!}

![Redmine bot message](/static/images/integrations/redmine/001.png)

[1]: https://www.redmine.org/projects/redmine/wiki/Plugins
[2]: https://github.com/zulip/zulip-redmine-plugin
```

--------------------------------------------------------------------------------

---[FILE: tenor.md]---
Location: zulip-main/templates/zerver/integrations/tenor.md

```text
# Zulip Tenor GIF integration

Send animated GIFs with your message using Tenor.

Follow [these instructions][configure-tenor] to configure Tenor on a
**self-hosted** Zulip server.

### Related documentation

* [Using GIFs in Zulip][help-center-gifs]

[help-center-gifs]: /help/animated-gifs
[configure-tenor]: https://zulip.readthedocs.io/en/latest/production/gif-picker-integrations.html#tenor
```

--------------------------------------------------------------------------------

---[FILE: twitter.md]---
Location: zulip-main/templates/zerver/integrations/twitter.md

```text
Fetch tweets from Twitter in Zulip! This is great for seeing and
discussing who is talking about you, friends, competitors, or
important topics in real time.

1.  {!create-channel.md!}

1.  {!create-an-incoming-webhook.md!}

    The API keys for "Incoming webhook" bots are limited to only
    sending messages via webhooks. Thus, this bot type lessens
    the security risks associated with exposing the bot's API
    key to third-party services.

1.  Download your new bot's `zuliprc` configuration file.

1.  {!download-python-bindings.md!}

1.  The Twitter bot should be set up on a trusted machine, because your API
    key is visible to local users through the command line or config
    file.

1.  Next, install **version 1.0 or later** of the `python-twitter`
    library. If your operating system distribution doesn’t package a new
    enough version, you can install the library from source from
    [the GitHub repository](https://github.com/bear/python-twitter).

1.  Next, set up Twitter authentication. This bot uses OAuth to
    authenticate with Twitter, and in order to obtain a consumer key &
    secret, you must register a new application under your Twitter
    account:

1.  Log in to <https://apps.twitter.com/>.

1.  Click on `Create New App` and fill out the form.

1.  Click on the application you created and click **create my access
    token**. Fill in the requested values.

1.  Create a `~/.zulip_twitterrc` with the following contents:

    ```
    [twitter]
    consumer_key =
    consumer_secret =
    access_token_key =
    access_token_secret =
    ```

1.  Place your bot's `zuliprc` in a directory of your choice (for the next step,
    `~/zuliprc` is used).

1.  Test the script by running it manually:

        /usr/local/share/zulip/integrations/twitter/twitter-bot --search="@nprnews,quantum
        physics" --config-file=~/zuliprc

        /usr/local/share/zulip/integrations/twitter/twitter-bot --twitter-name="<@your-
        twitter-handle>" --config-file=~/zuliprc

    Note: `twitter-bot` may install to a different location on
    your operating system distribution.

1.  Configure a crontab entry for this script. A sample crontab entry
    that will process tweets every minute is:

    ```
    * * * * * /usr/local/share/zulip/integrations/twitter/twitter-bot --search="@nprnews,
    quantum physics" --config-file=~/zuliprc
    ```

1.  When someone tweets a message containing one of your search terms,
    get a Zulip on your specified stream, with the search term as
    the topic.

{!congrats.md!}

![Twitter bot message](/static/images/integrations/twitter/001.png)

Note that the Twitter search bot integration **just sends links to
tweets**; the pretty inline previews of tweets are generated by the
Twitter card rendering integration configured in
`/etc/zulip/settings.py` on the Zulip server.
```

--------------------------------------------------------------------------------

---[FILE: zoom.md]---
Location: zulip-main/templates/zerver/integrations/zoom.md

```text
# Use Zoom as your call provider in Zulip

You can configure Zoom as the call provider for your organization. Users will be
able to start a Zoom call and invite others using the **add video call** (<i
class="zulip-icon zulip-icon-video-call"></i>) or **add voice call** (<i
class="zulip-icon zulip-icon-voice-call"></i>) button [in the compose
box](/help/start-a-call).

## Configure Zoom as your call provider

By default, Zulip integrates with
[Jitsi Meet](https://jitsi.org/jitsi-meet/), a fully-encrypted, 100% open
source video conferencing solution. You can configure Zulip to use Zoom as your
call provider instead.

### Configure Zoom on Zulip Cloud

{start_tabs}

{settings_tab|organization-settings}

1. Under **Compose settings**, select Zoom from the **Call provider** dropdown.

1. Click **Save changes**.

{end_tabs}

Users will be prompted to log in to their Zoom account the first time they
join a call.

## Configure Zoom for a self-hosted organization

If you are self-hosting, you will need to [create a Zoom
application](https://zulip.readthedocs.io/en/latest/production/video-calls.html#zoom)
in order to use this integration.

## Related documentation

- [How to start a call](/help/start-a-call)
- [Jitsi Meet integration](/integrations/jitsi)
- [BigBlueButton integration](/integrations/big-blue-button)
```

--------------------------------------------------------------------------------

---[FILE: change-zulip-config-file.md]---
Location: zulip-main/templates/zerver/integrations/include/change-zulip-config-file.md

```text
Open `{{ config_file_path}}` with your favorite editor, and change the
following lines to specify the email address and API key for your
{{ integration_display_name }} bot:

```
ZULIP_USER = "{{ integration_name }}-bot@{{ display_host }}"
ZULIP_API_KEY = "0123456789abcdef0123456789abcdef"
ZULIP_SITE = "{{ zulip_url }}"
```
```

--------------------------------------------------------------------------------

---[FILE: congrats.md]---
Location: zulip-main/templates/zerver/integrations/include/congrats.md

```text
You're done! Your {{ integration_display_name }} notifications may look like
this:
```

--------------------------------------------------------------------------------

---[FILE: create-a-generic-bot.md]---
Location: zulip-main/templates/zerver/integrations/include/create-a-generic-bot.md

```text
[Create a bot](/help/add-a-bot-or-integration) for
{{ integration_display_name }}. Make sure that you select
**Generic bot** as the **Bot type**.
```

--------------------------------------------------------------------------------

---[FILE: create-an-incoming-webhook.md]---
Location: zulip-main/templates/zerver/integrations/include/create-an-incoming-webhook.md

```text
[Create a bot](/help/add-a-bot-or-integration) for
{{ integration_display_name }}. Make sure that you select
**Incoming webhook** as the **Bot type**.
```

--------------------------------------------------------------------------------

---[FILE: create-channel.md]---
Location: zulip-main/templates/zerver/integrations/include/create-channel.md

```text
[Create the channel](/help/create-a-channel) you'd like to use for
{{ integration_display_name }} notifications.
```

--------------------------------------------------------------------------------

---[FILE: download-python-bindings.md]---
Location: zulip-main/templates/zerver/integrations/include/download-python-bindings.md

```text
Download and install our
[Python bindings and example scripts](/api/installation-instructions)
on the system where the {{ integration_display_name }} integration script
will be run from.
```

--------------------------------------------------------------------------------

---[FILE: event-filtering-additional-feature.md]---
Location: zulip-main/templates/zerver/integrations/include/event-filtering-additional-feature.md

```text
### Filtering incoming events

The {{ integration_display_name }} integration supports
[filtering][event-filters] for the following events:

{% set comma = joiner(", ") %}

{% for event_type in all_event_types -%} {{- comma() -}} `{{ event_type }}` {%- endfor %}

[event-filters]: /api/incoming-webhooks-overview#only_events-exclude_events
```

--------------------------------------------------------------------------------

---[FILE: event-filtering-instruction.md]---
Location: zulip-main/templates/zerver/integrations/include/event-filtering-instruction.md

```text
You will be able to configure which of the following
{{ integration_display_name }} events trigger notifications:

{% set comma = joiner(", ") %}

{% for event_type in all_event_types -%} {{- comma() -}} `{{ event_type }}` {%- endfor %}
```

--------------------------------------------------------------------------------

---[FILE: generate-webhook-url-basic.md]---
Location: zulip-main/templates/zerver/integrations/include/generate-webhook-url-basic.md

```text
Decide where to send {{ integration_display_name }} notifications, and
[generate the integration URL](/help/generate-integration-url).
```

--------------------------------------------------------------------------------

---[FILE: generate-webhook-url-with-branch-filtering.md]---
Location: zulip-main/templates/zerver/integrations/include/generate-webhook-url-with-branch-filtering.md

```text
Decide where to send {{ integration_display_name }} notifications, and
[generate the integration URL](/help/generate-integration-url). You'll be
able to configure which branches you'll receive notifications from.
```

--------------------------------------------------------------------------------

---[FILE: install-requirements.md]---
Location: zulip-main/templates/zerver/integrations/include/install-requirements.md

```text
Install the dependencies for the integration with:

`pip install -r {{ integration_path }}/requirements.txt`
```

--------------------------------------------------------------------------------

---[FILE: webhook-url-with-bot-email.md]---
Location: zulip-main/templates/zerver/integrations/include/webhook-url-with-bot-email.md

```text
Construct the URL for the {{ integration_display_name }}
bot using the bot's API key and email address:

`{{ external_url_scheme }}bot_email:bot_api_key@{{ api_url_scheme_relative }}{{ integration_url }}`

Modify the parameters of the URL above, where `bot_email` is
the bot's URL-encoded email address and `bot_api_key` is the
bot's API key.  To URL-encode the email address, you just need
to replace `@` in the bot's email address with `%40`.

You can also limit the branches you receive notifications for by
specifying them in a comma-separated list appended to the end of the
URL, e.g., `&branches=main,development`.
```

--------------------------------------------------------------------------------

---[FILE: webhooks-url-specification.md]---
Location: zulip-main/templates/zerver/integrations/include/webhooks-url-specification.md

```text
* [Webhook URLs specification][incoming-webhook-urls]

[incoming-webhook-urls]: /api/incoming-webhooks-overview#url-specification
```

--------------------------------------------------------------------------------

---[FILE: missing.md]---
Location: zulip-main/templates/zerver/policies_absent/missing.md

```text
This server is an installation of [Zulip](https://zulip.com), open
source software for team collaboration.

This installation of Zulip has not been configured to display its
policies. You can contact its administrators using the email address
displayed below.
```

--------------------------------------------------------------------------------

---[FILE: sidebar_index.md]---
Location: zulip-main/templates/zerver/policies_absent/sidebar_index.md

```text
## No policies configured
```

--------------------------------------------------------------------------------

---[FILE: privacy.md]---
Location: zulip-main/templates/zerver/policies_minimal/privacy.md

```text
This is the custom privacy policy.
```

--------------------------------------------------------------------------------

---[FILE: terms.md]---
Location: zulip-main/templates/zerver/policies_minimal/terms.md

```text
These are the custom terms and conditions.
```

--------------------------------------------------------------------------------

---[FILE: auth_subdomain.html]---
Location: zulip-main/templates/zerver/portico_error_pages/auth_subdomain.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Authentication subdomain error") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img src="{{ static('images/errors/500art.svg') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        <h1 class="lead">{{ _("Authentication subdomain") }}</h1>
        <p>
            {% trans %}
            It appears you ended up here by accident. This site
            is meant to be an intermediate step in the authentication process
            and shouldn't be accessed manually. If you came here directly,
            you probably got the address wrong. If you got stuck here while trying
            to log in, this is most likely a server bug or misconfiguration.
            {% endtrans %}
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: demo_creation_disabled.html]---
Location: zulip-main/templates/zerver/portico_error_pages/demo_creation_disabled.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Demo organizations disabled") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img src="{{ static('images/errors/500art.svg') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        {#
        Content is not marked for translation intentionally;
        most users will not encounter this page.
        #}
        <h1 class="lead">Demo organization creation disabled</h1>
        <p>Demo organizations are not enabled on this server.</p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: insecure_desktop_app.html]---
Location: zulip-main/templates/zerver/portico_error_pages/insecure_desktop_app.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Update required") }} | Zulip</title>
{% endblock %}

{% block error_page_content%}
<img src="{{ static('images/errors/400art.svg') }}" alt=""/>
<div class="errorbox config-error">
    <div class="errorcontent">
        <h1 class="lead">{{ _('Update required') }}</h1>
        <p>
            {% trans %}
            You are using old version of the Zulip desktop
            app that is no longer supported.
            {% endtrans %}
        </p>

        {% if auto_update_broken %}
        <p>
            {% trans %}
            The auto-update feature in this old version of
            Zulip desktop app no longer works.
            {% endtrans %}
        </p>
        {% endif %}

        <p>
            <a href="https://zulip.com/apps/" target="_blank" rel="noopener noreferrer">
                {{ _("Download the latest release.") }}
            </a>
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: portico_error_page.html]---
Location: zulip-main/templates/zerver/portico_error_pages/portico_error_page.html

```text
{% extends "zerver/portico.html" %}

{% block portico_class_name %}error{% endblock %}

{% block portico_content %}
<div class="error_page">
    {% block error_page_content %}
    {% endblock %}
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: rate_limit_exceeded.html]---
Location: zulip-main/templates/zerver/portico_error_pages/rate_limit_exceeded.html

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
            {% trans %}You have exceeded the limit for how
            often a user can perform this action.{% endtrans %}
            {% trans %}You can try again in {{retry_after}} seconds.{% endtrans %}
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: realm_creation_disabled.html]---
Location: zulip-main/templates/zerver/portico_error_pages/realm_creation_disabled.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Organization creation link required") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img src="{{ static('images/errors/500art.svg') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        <h1 class="lead">{{ _("Organization creation link required") }}</h1>
        <p>
            {% trans %}
            Creating a new organization on this server requires a valid organization creation link.
            Please see <a href="https://zulip.readthedocs.io/en/stable/production/multiple-organizations.html">documentation</a> on creating a new organization for more information.
            {% endtrans %}
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: realm_creation_link_invalid.html]---
Location: zulip-main/templates/zerver/portico_error_pages/realm_creation_link_invalid.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Organization creation link expired or invalid") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img class="hourglass-img" src="{{ static('images/errors/timeout_hourglass.png') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        <h1 class="lead">{{ _("Organization creation link expired or invalid") }}</h1>
        <p>
            {% trans %}
            Unfortunately, this is not a valid link for creating an organization. Please <a href="/new/">obtain a new link</a> and try again.
            {% endtrans %}
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: remote_realm_server_mismatch_error.html]---
Location: zulip-main/templates/zerver/portico_error_pages/remote_realm_server_mismatch_error.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Error") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img src="{{ static('images/errors/400art.svg') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        <h1 class="lead">{{ _("Unexpected Zulip server registration") }}</h1>
        <p>
            {% trans %}
            Your Zulip organization is registered as associated with a
            different Zulip server installation.

            Please <a href="mailto:{{ support_email }}">contact Zulip support</a>
            for assistance in resolving this issue.
            {% endtrans %}
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: unsupported_browser.html]---
Location: zulip-main/templates/zerver/portico_error_pages/unsupported_browser.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Unsupported browser") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img src="{{ static('images/errors/400art.svg') }}" alt=""/>
<div class="errorbox config-error">
    <div class="errorcontent">
        <h1 class="lead">{{ _('Unsupported browser') }}</h1>
        <p>
            {% trans %}
            {{ browser_name }} is not supported by Zulip.
            {% endtrans %}
        </p>
        <p>
            {% trans supported_browsers_page_link="/help/supported-browsers" %}
            Zulip supports <a href="{{ supported_browsers_page_link }}">modern browsers</a>
            like Firefox, Chrome, and Edge.
            {% endtrans %}
        </p>
        <p>
            {% trans apps_page_link="https://zulip.com/apps/" %}
            You can also use the <a href="{{ apps_page_link }}">Zulip desktop app</a>.
            {% endtrans %}
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: user_deactivated.html]---
Location: zulip-main/templates/zerver/portico_error_pages/user_deactivated.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Account is deactivated") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img src="{{ static('images/errors/400art.svg') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        <h1 class="lead">{{ _("Account is deactivated") }}</h1>
        <p>
            {% trans %}
            Your Zulip account on <a href="{{ realm_url }}">{{ realm_url }}</a>
            has been deactivated, and you will no longer be able to log in.
            {% endtrans %}
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: test_custom_include_extension.md]---
Location: zulip-main/templates/zerver/tests/markdown/test_custom_include_extension.md

```text
{!nonexistent-macro.md!}
```

--------------------------------------------------------------------------------

---[FILE: test_custom_include_extension_empty.md]---
Location: zulip-main/templates/zerver/tests/markdown/test_custom_include_extension_empty.md

```text
{!empty.md!}
```

--------------------------------------------------------------------------------

---[FILE: test_markdown.md]---
Location: zulip-main/templates/zerver/tests/markdown/test_markdown.md

```text
# Hello!


This is some *bold text*.
```

--------------------------------------------------------------------------------

---[FILE: test_nested_code_blocks.md]---
Location: zulip-main/templates/zerver/tests/markdown/test_nested_code_blocks.md

```text
# This is a heading.

1. A list item with an indented code block:

    ```
    indented code block
    with multiple lines
    ```

```
non-indented code block
with multiple lines
```
```

--------------------------------------------------------------------------------

---[FILE: test_tabbed_sections.md]---
Location: zulip-main/templates/zerver/tests/markdown/test_tabbed_sections.md

```text
# Heading

{start_tabs}
{tab|ios}
iOS instructions

{tab|desktop-web}

Desktop/browser instructions

{end_tabs}

## Heading 2

{start_tabs}

{tab|desktop-web}

Desktop/browser instructions
{tab|android}
Android instructions
{end_tabs}

## Heading 3

{start_tabs}
Instructions for all platforms
{end_tabs}
```

--------------------------------------------------------------------------------

---[FILE: test_tabbed_sections_missing_tabs.md]---
Location: zulip-main/templates/zerver/tests/markdown/test_tabbed_sections_missing_tabs.md

```text
# Heading

{start_tabs}
{tab|ios}
iOS instructions

{tab|minix}

Minix instructions. We expect an exception because the minix tab doesn't have a declared label.

{end_tabs}
```

--------------------------------------------------------------------------------

---[FILE: enterprise_tos_accept_body.txt]---
Location: zulip-main/templates/zilencer/enterprise_tos_accept_body.txt

```text
{#
Mail sent to us when a company accepts the ToS for Zulip Enterprise
edition.
#}

Hello,

{{ name }} just accepted the Zulip Enterprise Terms of Service for {{ company }}.

Cheers,

Zulip Legal Bot
```

--------------------------------------------------------------------------------

---[FILE: backport-all-prs]---
Location: zulip-main/tools/backport-all-prs

```text
#!/usr/bin/env -S uv run --script --frozen --only-group release-tools  # -*-python-*-

import re
import subprocess
import time
from typing import Annotated

import typer
from github import Auth, Github
from github.PullRequest import PullRequest
from github.Repository import Repository
from rich.console import Console
from rich.progress import track


def prs_to_backport(repo: Repository, console: Console, skip: set[int]) -> list[int]:
    backport_prs = []
    with console.status("Getting list of closed backport candidate PRs..."):
        issues = list(repo.get_issues(labels=["backport candidate"], state="closed"))
    for issue in track(issues, console=console, description="Fetching PR metadata..."):
        if issue.number in skip:
            continue
        if issue.pull_request is None:
            continue
        pr = repo.get_pull(issue.number)

        if pr.merged_at is None:
            print(f"PR {pr.number} does not have a merged_at time!")
            continue

        backport_prs.append((pr.number, pr.merged_at))

    backport_prs.sort(key=lambda x: x[1])
    return [pr[0] for pr in backport_prs]


def wait_for_complete(repo: Repository, pr: PullRequest, console: Console) -> None:
    commit = repo.get_commit(pr.head.sha)
    with console.status("Waiting for tests to pass..."):
        while True:
            time.sleep(10)
            check_runs = commit.get_check_runs()
            if check_runs.totalCount == 0:
                continue
            all_completed = True
            for check in check_runs:
                if check.status != "completed":
                    all_completed = False
                    break
                elif check.conclusion not in ["success", "neutral", "skipped"]:
                    raise Exception(f"{check.name} failed!")
            if all_completed:
                break
    pr.merge(merge_method="rebase")


def mark_as_backported(repo: Repository, backport_pr: int, pr_number: int, commit: str) -> None:
    pr = repo.get_pull(pr_number)
    pr.create_issue_comment(f"Backported in #{backport_pr} ({commit})")
    pr.remove_from_labels("backport candidate")


def validate_github_token(value: str) -> str:
    # https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github#githubs-token-formats
    if value.startswith("github_"):
        return value
    if re.match(r"gh[pousr]_", value):
        return value
    raise typer.BadParameter("Github access tokens start with `github_`, or `gh`")


def main(
    token: Annotated[
        str,
        typer.Option(
            metavar="TOKEN",
            envvar="GITHUB_TOKEN",
            show_envvar=True,
            callback=validate_github_token,
            help="Github access token",
        ),
    ],
    skip: Annotated[list[int], typer.Option(default_factory=list)],
) -> int:
    """Make a backport PR"""

    console = Console(stderr=True, log_path=False)

    latest_tag = subprocess.check_output(
        ["git", "tag", "-l", "--sort=-committerdate"],
        text=True,
    ).splitlines()[0]
    target_branch = latest_tag.split(".")[0] + ".x"

    gh = Github(auth=Auth.Token(token))
    repo = gh.get_repo("zulip/zulip")
    pr_ids = prs_to_backport(repo, console, set(skip))

    branchname = f"backports-{target_branch}"
    subprocess.check_call(["git", "fetch", "upstream"])
    subprocess.check_call(
        [
            "git",
            "checkout",
            "-b",
            branchname,
            "--track",
            f"upstream/{target_branch}",
        ]
    )
    successful_pr_id_commits = []
    for pr_number in track(pr_ids, console=console, description="Backporting..."):
        try:
            subprocess.check_call(
                ["./tools/backport-pull-request", str(pr_number)],
                stderr=subprocess.DEVNULL,
                stdout=subprocess.DEVNULL,
            )
            current_commit = subprocess.check_output(
                ["git", "rev-parse", "HEAD"], text=True
            ).strip()
            successful_pr_id_commits.append((pr_number, current_commit))
        except subprocess.CalledProcessError:
            subprocess.check_call(["git", "cherry-pick", "--abort"])

    if not successful_pr_id_commits:
        print("No PRs successfully backported!")
        return 1

    body = f"Backport to {target_branch}:\n"
    for pr_number, _ in successful_pr_id_commits:
        body += f"- #{pr_number}\n"

    subprocess.check_call(["git", "push", "origin", f"HEAD:{branchname}"])
    backport_pr = repo.create_pull(
        title=f"{target_branch} backports",
        body=body,
        head=f"{gh.get_user().login}:{branchname}",
        base=target_branch,
    )
    wait_for_complete(repo, backport_pr, console)

    for pr_number, commit in track(
        successful_pr_id_commits, console=console, description="Commenting on backported PRs..."
    ):
        mark_as_backported(repo, backport_pr.number, pr_number, commit)

    subprocess.check_call(["git", "push", "origin", "--delete", branchname])
    subprocess.check_call(["git", "checkout", target_branch])
    subprocess.check_call(["git", "branch", "--delete", "--force", branchname])
    subprocess.check_call(["git", "pull"])
    return 0


if __name__ == "__main__":
    typer.run(main)
```

--------------------------------------------------------------------------------

---[FILE: backport-pull-request]---
Location: zulip-main/tools/backport-pull-request

```text
#!/usr/bin/env bash

set -e

usage() {
    cat >&2 <<EOF
usage: $0 PULL_REQUEST_ID COMMIT_COUNT [REMOTE]

Fetch the given GitHub pull request branch and backport it to
the current branch using 'git cherry-pick -x'.

Typical usage is:
  git fetch upstream
  git checkout -b 8.x upstream/8.x
  $0 FIRST_PR_ID
  $0 SECOND_PR_ID
  git push origin +HEAD:backport-changes
EOF
    exit 1
}

pr_id="$1"

if [ -z "$pr_id" ]; then
    usage
fi

fail() {
    echo "$1"
    exit 1
}

type gh >/dev/null 2>&1 \
    || fail "The 'gh' CLI tool is not installed; see https://cli.github.com/"
gh auth status 2>/dev/null || fail "Not authenticated to github"

# Find the last commit that was merged.  We will look back in `main`
# for other commits from the same PR.
# shellcheck disable=SC2016
merge_commit="$(
    gh api graphql \
        -q '.data.repository.pullRequest.timelineItems.nodes[0].commit.oid' \
        -F pr_id="$1" \
        -f query='
query($pr_id:Int!) {
  repository(name: "zulip", owner: "zulip") {
    pullRequest(number:$pr_id) {
      timelineItems(last:1, itemTypes: [MERGED_EVENT]) {
        nodes {
          ... on MergedEvent {
            commit {
              oid
            }
          }
        }
      }
    }
  }
}
'
)"

# We cannot trust the "commits" count on the PR, since only part of it
# may get merged, or it may have commits squashed during the merge.
# Walk backwards on `main` from the merge commit we found, checking
# that each of those commits is still associated with the same PR.
commit_id="$merge_commit"
while true; do
    # shellcheck disable=SC2016
    this_pr="$(gh api graphql -F "commit_id=$commit_id 0" \
        --jq '.data.repository.ref.target.history.edges[].node.associatedPullRequests.nodes[].number' \
        -f query='
query($commit_id: String!) {
  repository(owner: "zulip", name:"zulip") {
    ref(qualifiedName:"main") {
      target {
        ... on Commit {
          history(first:1, after: $commit_id) {
            edges {
              node {
                oid
                associatedPullRequests(first: 1) {
                  nodes {
                    number
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}')"
    if [ "$this_pr" != "$pr_id" ]; then
        break
    fi
    commit_id="$(git rev-parse "$commit_id"~)"
done

set -x
git cherry-pick -x "$commit_id~..$merge_commit"
```

--------------------------------------------------------------------------------

---[FILE: build-demo-organization-wordlist]---
Location: zulip-main/tools/build-demo-organization-wordlist

```text
#!/usr/bin/env python3
import re

import orjson
import requests

EXCLUDED_NOUNS = [
    "Fightings",
    "Followings",
    "Harassments",
    "Injustices",
    "Insults",
    "Outrages",
    "Pleas",
    "Poisons",
    "Prejudices",
    "Punishments",
    "Robberies",
    "Sins",
    "Softwares",
    "Steams",
    "Theses",
]

EXCLUDED_ADVERBS = [
    "Obnoxiously",
    "Rudely",
    "Ruthlessly",
    "Scornfully",
    "Selfishly",
]

EXCLUDED_ADJECTIVES = [
    "Cruel",
    "Destructive",
    "Dishonest",
    "Illegal",
    "Infamous",
    "Shocking",
]


def clean_word(word: str) -> str:
    return word.replace("\\n", "").replace("'", "").replace("]", "").replace("[", "").strip()


def run() -> None:
    url = "https://raw.githubusercontent.com/jitsi/js-utils/refs/heads/master/random/roomNameGenerator.ts"
    response = requests.get(url)
    content = str(response.content)

    raw_plural_nouns = re.findall(r"const _PLURALNOUN_.*?=\s*(.*?);", content)
    plural_nouns = raw_plural_nouns[0].split(",")
    cleaned_nouns: list[str] = [
        clean_word(noun).lower() for noun in plural_nouns if clean_word(noun) not in EXCLUDED_NOUNS
    ]

    raw_adverbs = re.findall(r"const _ADVERB_.*?=\s*(.*?);", content)
    adverbs = raw_adverbs[0].split(",")
    cleaned_adverbs: list[str] = [
        clean_word(adverb).lower()
        for adverb in adverbs
        if clean_word(adverb) not in EXCLUDED_ADVERBS
    ]

    raw_adjectives = re.findall(r"const _ADJECTIVE_.*?=\s*(.*?);", content)
    adjectives = raw_adjectives[0].split(",")
    cleaned_adjectives: list[str] = [
        clean_word(adjective).lower()
        for adjective in adjectives
        if clean_word(adjective) not in EXCLUDED_ADJECTIVES
    ]

    word_map = {
        "nouns": cleaned_nouns,
        "adverbs": cleaned_adverbs,
        "adjectives": cleaned_adjectives,
    }

    file_path = "zerver/lib/demo_organization_words.json"
    with open(file_path, "wb+") as f:
        f.write(
            orjson.dumps(
                word_map,
                option=orjson.OPT_APPEND_NEWLINE | orjson.OPT_INDENT_2 | orjson.OPT_SORT_KEYS,
            )
        )


if __name__ == "__main__":
    run()
```

--------------------------------------------------------------------------------

````
