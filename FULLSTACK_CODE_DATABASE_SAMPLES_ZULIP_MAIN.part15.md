---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 15
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 15 of 1290)

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

---[FILE: client-libraries.md]---
Location: zulip-main/api_docs/client-libraries.md

```text
# Client libraries

These API client libraries make it easy to work with Zulip's REST API
in your favorite language.

## Official libraries

These libraries are maintained by members of the Zulip core team.  The
Python library is the most complete and best documented.

* [Python](https://github.com/zulip/python-zulip-api)
* [JavaScript](https://github.com/zulip/zulip-js)

## User maintained libraries

The Zulip core team doesn't have the resources to maintain
high-quality libraries for every programming language.  We've
collected a list of user-maintained libraries for popular languages:

* [Clojure](https://github.com/thieman/clojure-zulip)
* [C#](https://github.com/zulip/zulip-csharp)
* [Go](https://github.com/ifo/gozulipbot)
* [Java](https://github.com/taliox/zulip-java-rest)
* [Kotlin](https://gitlab.com/ppiag/kzulip)
* [PHP](https://github.com/mrferos/zulip-php-client)
* [Ruby](https://github.com/raws/wonder-llama)
* [Swift](https://github.com/zulip/swift-zulip-api)

### Contributing

Contributing to improve language libraries is appreciated, as is
writing new ones.  If you actively maintain a Zulip language binding
and would like it to be listed here (or would like to collaborate with
us in making it an official library), post in [this
topic][integrations-thread] in
[the Zulip development community](https://zulip.com/development-community/)
or submit a pull request [updating this
page](https://zulip.readthedocs.io/en/latest/documentation/api.html).

[integrations-thread]: https://chat.zulip.org/#narrow/channel/127-integrations/topic/API.20client.20libraries/

### Outdated

!!! tip ""

    The following projects are not actively maintained.  Since
    Zulip's core APIs have been stable for 5 years, even very
    old libraries can be useful.

* [Lua](https://github.com/deckycoss/zulua)
* [Erlang](https://github.com/femnad/tuplre)
* [PHP](https://github.com/federicoq/zulip-php)
* [Go](https://github.com/decached/go-zulip)
* [Haskell](https://github.com/yamadapc/hzulip)
* [Chicken Scheme](https://github.com/yamadapc/zulip-scheme)
* [Scala](https://github.com/cqfd/zulip-scala)
* [EventMachine](https://github.com/cqfd/zulip_machine)
* [Ruby](https://github.com/verg/zulip-rb)
* [Perl](https://github.com/Stantheman/WebService-Zulip)
* [.Net](https://github.com/Shayan-To/ZulipClientApi)
```

--------------------------------------------------------------------------------

---[FILE: configuring-python-bindings.md]---
Location: zulip-main/api_docs/configuring-python-bindings.md

```text
# Configuring the Python bindings

Zulip provides a set of tools that allows interacting with its API more
easily, called the [Python bindings](https://pypi.python.org/pypi/zulip/).
One of the most notable use cases for these bindings are bots developed
using Zulip's [bot framework](/api/writing-bots).

In order to use them, you need to configure them with your identity
(account, API key, and Zulip server URL). There are a few ways to
achieve that:

- Using a `zuliprc` file, referenced via the `--config-file` option or
  the `config_file` option to the `zulip.Client` constructor
  (recommended for bots).
- Using a `zuliprc` file in your home directory at `~/.zuliprc`
  (recommended for your own API key).
- Using the [environment
  variables](https://en.wikipedia.org/wiki/Environment_variable)
  documented below.
- Using the `--api-key`, `--email`, and `--site` variables as command
  line parameters.
- Using the `api_key`, `email`, and `site` parameters to the
  `zulip.Client` constructor.

## Download a `zuliprc` file

{start_tabs}

{tab|for-a-bot}

{settings_tab|your-bots}

1. In the **Actions** column, click the **manage bot**
   (<i class="zulip-icon zulip-icon-user-cog"></i>) icon,
   and scroll down to **Zuliprc configuration**.

1. Click the **download**
   (<i class="zulip-icon zulip-icon-download"></i>) icon
   to download the bot's `zuliprc` file, or the **copy**
   (<i class="zulip-icon zulip-icon-copy"></i>) icon to
   copy the file's content to your clipboard.

!!! warn ""

    Anyone with a bot's API key can impersonate the bot, so be careful with it!

{tab|for-yourself}

{settings_tab|account-and-privacy}

1. Under **API key**, click **Manage your API key**.

1. Enter your password, and click **Get API key**. If you don't know your
   password, click **reset it** and follow the
   instructions from there.

1. Click **Download zuliprc** to download your `zuliprc` file.

1. (optional) If you'd like your credentials to be used by default
   when using the Zulip API on your computer, move the `zuliprc` file
   to `~/.zuliprc` in your home directory.

!!! warn ""

    Anyone with your API key can impersonate you, so be doubly careful with it.

{end_tabs}

## Configuration keys and environment variables

`zuliprc` is a configuration file written in the
[INI file format](https://en.wikipedia.org/wiki/INI_file),
which contains key-value pairs as shown in the following example:

```
[api]
key=<API key from the web interface>
email=<your email address>
site=<your Zulip server's URI>
...
```

The keys you can use in this file (and their equivalent environment variables)
can be found in the following table:

<table class="table">
    <thead>
        <tr>
            <th><code>zuliprc</code> key</th>
            <th>Environment variable</th>
            <th>Required</th>
            <th>Description</th>
        </tr>
    </thead>
    <tr>
        <td><code>key</code></td>
        <td><code>ZULIP_API_KEY</code></td>
        <td>Yes</td>
        <td>
            <a href="/api/api-keys">API key</a>, which you can get through
            Zulip's web interface.
        </td>
    </tr>
    <tr>
        <td><code>email</code></td>
        <td><code>ZULIP_EMAIL</code></td>
        <td>Yes</td>
        <td>
            The email address of the user who owns the API key mentioned
            above.
        </td>
    </tr>
    <tr>
        <td><code>site</code></td>
        <td><code>ZULIP_SITE</code></td>
        <td>No</td>
        <td>
            URL where your Zulip server is located.
        </td>
    </tr>
    <tr>
        <td><code>client_cert_key</code></td>
        <td><code>ZULIP_CERT_KEY</code></td>
        <td>No</td>
        <td>
            Path to the SSL/TLS private key that the binding should use to
            connect to the server.
        </td>
    </tr>
    <tr>
        <td><code>client_cert</code></td>
        <td><code>ZULIP_CERT</code></td>
        <td>No*</td>
        <td>
            The public counterpart of <code>client_cert_key</code>/
            <code>ZULIP_CERT_KEY</code>. <i>This setting is required if a cert
            key has been set.</i>
        </td>
    </tr>
    <tr>
        <td><code>client_bundle</code></td>
        <td><code>ZULIP_CERT_BUNDLE</code></td>
        <td>No</td>
        <td>
            Path where the server's PEM-encoded certificate is located. CA
            certificates are also accepted, in case those CA's have issued the
            server's certificate. Defaults to the built-in CA bundle trusted
            by Python.
        </td>
    </tr>
    <tr>
        <td><code>insecure</code></td>
        <td><code>ZULIP_ALLOW_INSECURE</code></td>
        <td>No</td>
        <td>
            Allows connecting to Zulip servers with an invalid SSL/TLS
            certificate. Please note that enabling this will make the HTTPS
            connection insecure. Defaults to <code>false</code>.
        </td>
    </tr>
</table>

## Related articles

* [Installation instructions](/api/installation-instructions)
* [API keys](/api/api-keys)
* [Running bots](/api/running-bots)
* [Deploying bots](/api/deploying-bots)
```

--------------------------------------------------------------------------------

---[FILE: construct-narrow.md]---
Location: zulip-main/api_docs/construct-narrow.md

```text
# Construct a narrow

A **narrow** is a set of filters for Zulip messages, that can be based
on many different factors (like sender, channel, topic, search
keywords, etc.). Narrows are used in various places in the Zulip
API (most importantly, in the API for fetching messages).

It is simplest to explain the algorithm for encoding a search as a
narrow using a single example. Consider the following search query
(written as it would be entered in the Zulip web app's search box).
It filters for messages sent to channel `announce`, not sent by
`iago@zulip.com`, and containing the words `cool` and `sunglasses`:

```
channel:announce -sender:iago@zulip.com cool sunglasses
```

This query would be JSON-encoded for use in the Zulip API using JSON
as a list of simple objects, as follows:

```json
[
    {
        "operator": "channel",
        "operand": "announce"
    },
    {
        "operator": "sender",
        "operand": "iago@zulip.com",
        "negated": true
    },
    {
        "operator": "search",
        "operand": "cool sunglasses"
    }
]
```

The Zulip help center article on [searching for messages](/help/search-for-messages)
documents the majority of the search/narrow options supported by the
Zulip API.

Note that many narrows, including all that lack a `channel` or `channels`
operator, search the current user's personal message history. See
[searching shared history](/help/search-for-messages#search-shared-history)
for details.

Clients should note that the `is:unread` filter takes advantage of the
fact that there is a database index for unread messages, which can be an
important optimization when fetching messages in certain cases (e.g.,
when [adding the `read` flag to a user's personal
messages](/api/update-message-flags-for-narrow)).

Note: When the value of `realm_empty_topic_display_name` found in
the [POST /register](/api/register-queue) response is used as an operand
for the `"topic"` operator in the narrow, it is interpreted
as an empty string.

## Changes

* In Zulip 10.0 (feature level 366), support was added for a new
  `is:muted` operator combination, matching messages in topics and
  channels that the user has [muted](/help/mute-a-topic).

* Before Zulip 10.0 (feature level 334), empty string was not a valid
  topic name for channel messages.

* In Zulip 9.0 (feature level 271), support was added for a new filter
  operator, `with`, which uses a [message ID](#message-ids) for its
  operand, and is designed for creating permanent links to topics.

* In Zulip 9.0 (feature level 265), support was added for a new
  `is:followed` filter, matching messages in topics that the current
  user is [following](/help/follow-a-topic).

* In Zulip 9.0 (feature level 250), support was added for two filters
  related to stream messages: `channel` and `channels`. The `channel`
  operator is an alias for the `stream` operator. The `channels`
  operator is an alias for the `streams` operator. Both `channel` and
  `channels` return the same exact results as `stream` and `streams`
  respectively.

* In Zulip 9.0 (feature level 249), support was added for a new filter,
  `has:reaction`, which returns messages that have at least one [emoji
  reaction](/help/emoji-reactions).

* In Zulip 7.0 (feature level 177), support was added for three filters
  related to direct messages: `is:dm`, `dm` and `dm-including`. The
  `dm` operator replaced and deprecated the `pm-with` operator. The
  `is:dm` filter replaced and deprecated the `is:private` filter. The
  `dm-including` operator replaced and deprecated the `group-pm-with`
  operator.

    * The `dm-including` and `group-pm-with` operators return slightly
      different results. For example, `dm-including:1234` returns all
      direct messages (1-on-1 and group) that include the current user
      and the user with the unique user ID of `1234`. On the other hand,
      `group-pm-with:1234` returned only group direct messages that
      included the current user and the user with the unique user ID of
      `1234`.

    * Both `dm` and `is:dm` are aliases of `pm-with` and `is:private`
      respectively, and return the same exact results that the
      deprecated filters did.

## Narrows that use IDs

### Message IDs

The `id` and `with` operators use message IDs for their operands. The
message ID operand for these two operators may be encoded as either a
number or a string.

* `id:12345`: Search for only the message with ID `12345`.
* `with:12345`: Search for the conversation that contains the message
  with ID `12345`.

The `id` operator returns the message with the specified ID if it exists,
and if it can be accessed by the user.

The `with` operator is designed to be used for permanent links to
topics, which means they should continue to work when the topic is
[moved](/help/move-content-to-another-topic) or
[resolved](/help/resolve-a-topic). If the message with the specified
ID exists, and can be accessed by the user, then it will return
messages with the `channel`/`topic`/`dm` operators corresponding to
the current conversation containing that message, replacing any such
operators included in the original narrow query.

If no such message exists, or the message ID represents a message that
is inaccessible to the user, this operator will be ignored (rather
than throwing an error) if the remaining operators uniquely identify a
conversation (i.e., they contain `channel` and `topic` terms or `dm`
term). This behavior is intended to provide the best possible
experience for links to private channels with protected history.

The [help center](/help/search-for-messages#search-by-message-id) also
documents the `near` operator for searching for messages by ID, but
this narrow operator has no effect on filtering messages when sent to
the server. In practice, when the `near` operator is used to search for
messages, or is part of a URL fragment, the value of its operand should
instead be used for the value of the `anchor` parameter in endpoints
that also accept a `narrow` parameter; see
[GET /messages][anchor-get-messages] and
[POST /messages/flags/narrow][anchor-post-flags].

**Changes**: Prior to Zulip 8.0 (feature level 194), the message ID
operand for the `id` operator needed to be encoded as a string.


```json
[
    {
        "operator": "id",
        "operand": 12345
    }
]
```

### Channel and user IDs

There are a few additional narrow/search options (new in Zulip 2.1)
that use either channel IDs or user IDs that are not documented in the
help center because they are primarily useful to API clients:

* `channel:1234`: Search messages sent to the channel with ID `1234`.
* `sender:1234`: Search messages sent by user ID `1234`.
* `dm:1234`: Search the direct message conversation between
  you and user ID `1234`.
* `dm:1234,5678`: Search the direct message conversation between
  you, user ID `1234`, and user ID `5678`.
* `dm-including:1234`: Search all direct messages (1-on-1 and group)
  that include you and user ID `1234`.

!!! tip ""

    A user ID can be found by [viewing a user's profile][view-profile]
    in the web or desktop apps. A channel ID can be found when [browsing
    channels][browse-channels] in the web or desktop apps.

The operands for these search options must be encoded either as an
integer ID or a JSON list of integer IDs. For example, to query
messages sent by a user 1234 to a direct message thread with yourself,
user 1234, and user 5678, the correct JSON-encoded query is:

```json
[
    {
        "operator": "dm",
        "operand": [1234, 5678]
    },
    {
        "operator": "sender",
        "operand": 1234
    }
]
```

[view-profile]: /help/view-someones-profile
[browse-channels]: /help/introduction-to-channels#browse-and-subscribe-to-channels
[anchor-get-messages]: /api/get-messages#parameter-anchor
[anchor-post-flags]: /api/update-message-flags-for-narrow#parameter-anchor
```

--------------------------------------------------------------------------------

---[FILE: create-scheduled-message.md]---
Location: zulip-main/api_docs/create-scheduled-message.md

```text
{generate_api_header(/scheduled_messages:post)}

## Usage examples

{start_tabs}

{generate_code_example(python)|/scheduled_messages:post|example}

{generate_code_example(javascript)|/scheduled_messages:post|example}

{tab|curl}

``` curl
# Create a scheduled channel message
curl -X POST {{ api_url }}/v1/scheduled_messages \
    -u BOT_EMAIL_ADDRESS:BOT_API_KEY \
    --data-urlencode type=stream \
    --data-urlencode to=9 \
    --data-urlencode topic=Hello \
    --data-urlencode 'content=Nice to meet everyone!' \
    --data-urlencode scheduled_delivery_timestamp=3165826990

# Create a scheduled direct message
curl -X POST {{ api_url }}/v1/messages \
    -u BOT_EMAIL_ADDRESS:BOT_API_KEY \
    --data-urlencode type=direct \
    --data-urlencode 'to=[9, 10]' \
    --data-urlencode 'content=Can we meet on Monday?' \
    --data-urlencode scheduled_delivery_timestamp=3165826990

```

{end_tabs}

## Parameters

{generate_api_arguments_table|zulip.yaml|/scheduled_messages:post}

{generate_parameter_description(/scheduled_messages:post)}

## Response

{generate_return_values_table|zulip.yaml|/scheduled_messages:post}

{generate_response_description(/scheduled_messages:post)}

#### Example response(s)

{generate_code_example|/scheduled_messages:post|fixture}
```

--------------------------------------------------------------------------------

---[FILE: create-stream.md]---
Location: zulip-main/api_docs/create-stream.md

```text
# Create a channel

You can create a channel using Zulip's REST API by submitting a
[subscribe](/api/subscribe) request with a channel name that
doesn't yet exist and passing appropriate parameters to define
the initial configuration of the new channel.
```

--------------------------------------------------------------------------------

---[FILE: deploying-bots.md]---
Location: zulip-main/api_docs/deploying-bots.md

```text
# Deploying bots in production

Usually, work on a bot starts on a laptop.  At some point, you'll want
to deploy your bot in a production environment, so that it'll stay up
regardless of what's happening with your laptop.  There are several
options for doing so:

* The simplest is running `zulip-run-bot` inside a `screen` session on
  a server.  This works, but if your server reboots, you'll need to
  manually restart it, so we don't recommend it.
* Using `supervisord` or a similar tool for managing a production
  process with `zulip-run-bot`.  This consumes a bit of resources
  (since you need a persistent process running), but otherwise works
  great.
* Using the Zulip Botserver, which is a simple Flask server for
  running a bot in production, and connecting that to Zulip's outgoing
  webhooks feature.  This can be deployed in environments like
  Heroku's free tier without running a persistent process.

## Zulip Botserver

The Zulip Botserver is for people who want to

* run bots in production.
* run multiple bots at once.

The Zulip Botserver is a Python (Flask) server that implements Zulip's
outgoing webhooks API.  You can of course write your own servers using
the outgoing webhooks API, but the Botserver is designed to make it
easy for a novice Python programmer to write a new bot and deploy it
in production.

### How Botserver works

Zulip Botserver starts a web server that listens to incoming messages
from your main Zulip server. The sequence of events in a successful
Botserver interaction are:

1. Your bot user is mentioned or receives a direct message:

    ```
    @**My Bot User** hello world
    ```

1. The Zulip server sends a POST request to your Botserver endpoint URL:

    ```
    {
      "message":{
        "content":"@**My Bot User** hello world",
      },
      "bot_email":"myuserbot-bot@example.com",
      "trigger":"mention",
      "token":"XXXX"
    }
    ```

    This URL is configured in the Zulip web-app in your Bot User's settings.

1. The Botserver searches for a bot to handle the message, and executes your
   bot's `handle_message` code.

Your bot's code should work just like it does with `zulip-run-bot`.

### Installing the Zulip Botserver

Install the `zulip_botserver` package:

```
pip3 install zulip_botserver
```

### Create a bot in your Zulip organization

{start_tabs}

1. Navigate to the **Bots** tab of the **Personal settings** menu, and click
   **Add a new bot**.

1. Set the **Bot type** to **Outgoing webhook**.

1. Set the **endpoint URL** to `https://<host>:<port>` where `host` is the
   hostname of the server you'll be running the Botserver on, and `port` is
   the port number. The default port is `5002`.

1. Click **Create bot**. You should see the new bot user in the
   **Active bots** panel.

{end_tabs}

### Running a bot using the Zulip Botserver

{start_tabs}

1. [Create your bot](#create-a-bot-in-your-zulip-organization) in your Zulip
   organization.

1. Download the `zuliprc` file for the bot created above from the
   **Bots** tab of the **Personal settings** menu, by clicking the download
   (<i class="fa fa-download"></i>) icon under the bot's name.

1. Run the Botserver, where `helloworld` is the name of the bot you
   want to run:

    `zulip-botserver --config-file <path_to_zuliprc> --bot-name=helloworld`

    You can specify the port number and various other options; run
    `zulip-botserver --help` to see how to do this.

{end_tabs}

Congrats, everything is set up! Test your Botserver like you would
test a normal bot.

### Running multiple bots using the Zulip Botserver

The Zulip Botserver also supports running multiple bots from a single
Botserver process.

{start_tabs}

1. [Create your bots](#create-a-bot-in-your-zulip-organization)
   in your Zulip organization.

1. Download the `botserverrc` file from the **Bots** tab of the
   **Personal settings** menu, using the **Download config of all active
   outgoing webhook bots in Zulip Botserver format** option.

1. Open the `botserverrc`. It should contain one or more sections that look
   like this:

    ```
    [helloworld]
    email=foo-bot@hostname
    key=dOHHlyqgpt5g0tVuVl6NHxDLlc9eFRX4
    site=http://hostname
    token=aQVQmSd6j6IHphJ9m1jhgHdbnhl5ZcsY
    bot-config-file=~/path/to/helloworld.conf
    ```

    Each section contains the configuration for an outgoing webhook bot.

1. For each bot, enter the name of the bot you want to run in the square
   brackets `[]`, e.g., the above example applies to the `helloworld` bot.
   To run an external bot, enter the path to the bot's python file instead,
   e.g., `[~/Documents/my_bot_script.py]`.

    !!! tip ""

        The `bot-config-file` setting is needed only for bots that
        use a config file.

1.  Run the Zulip Botserver by passing the `botserverrc` to it.

     ```
     zulip-botserver --config-file <path-to-botserverrc> --hostname <address> --port <port>
     ```

     If omitted, `hostname` defaults to `127.0.0.1` and `port` to `5002`.

{end_tabs}

### Running Zulip Botserver with supervisord

[supervisord](http://supervisord.org/) is a popular tool for running
services in production.  It helps ensure the service starts on boot,
manages log files, restarts the service if it crashes, etc.  This
section documents how to run the Zulip Botserver using *supervisord*.

Running the Zulip Botserver with *supervisord* works almost like
running it manually.

{start_tabs}

1.  Install *supervisord* via your package manager; e.g., on Debian/Ubuntu:

     ```
     sudo apt-get install supervisor
     ```

1.  Configure *supervisord*.  *supervisord* stores its configuration in
    `/etc/supervisor/conf.d`.
    * Do **one** of the following:
      * Download the [sample config file][supervisord-config-file]
        and store it in `/etc/supervisor/conf.d/zulip-botserver.conf`.
      * Copy the following section into your existing supervisord config file.

            [program:zulip-botserver]
            command=zulip-botserver --config-file=<path/to/your/botserverrc>
            --hostname <address> --port <port>
            startsecs=3
            stdout_logfile=/var/log/zulip-botserver.log ; all output of your Botserver will be logged here
            redirect_stderr=true

    * Edit the `<>` sections according to your preferences.

[supervisord-config-file]: https://raw.githubusercontent.com/zulip/python-zulip-api/main/zulip_botserver/zulip-botserver-supervisord.conf

1. Update *supervisord* to read the configuration file:

    ```
    supervisorctl reread
    supervisorctl update
    ```

    (or you can use `/etc/init.d/supervisord restart`, but this is less
    disruptive if you're using *supervisord* for other services as well).

1. Test if your setup is successful:

    ```
    supervisorctl status
    ```

    The output should include a line similar to this:
    > zulip-botserver                 RUNNING   pid 28154, uptime 0:00:27

    The standard output of the Botserver will be logged to the path in
    your *supervisord* configuration.

{end_tabs}

If you are hosting the Botserver yourself (as opposed to using a
hosting service that provides SSL), we recommend securing your
Botserver with SSL using an `nginx` or `Apache` reverse proxy and
[Certbot](https://certbot.eff.org/).

### Troubleshooting

- Make sure the API key you're using is for an [outgoing webhook
  bot](/api/outgoing-webhooks) and you've
  correctly configured the URL for your Botserver.

- Your Botserver needs to be accessible from your Zulip server over
  HTTP(S).  Make sure any firewall allows the connection.  We
  recommend using [zulip-run-bot](running-bots) instead for
  development/testing on a laptop or other non-server system.
  If your Zulip server is self-hosted, you can test by running `curl
  http://zulipbotserver.example.com:5002` from your Zulip server;
  the output should be:

    ```
    $ curl http://zulipbotserver.example.com:5002/
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
    <title>405 Method Not Allowed</title>
    <h1>Method Not Allowed</h1>
    <p>The method is not allowed for the requested URL.</p>
    ```

## Related articles

* [Non-webhook integrations](/api/non-webhook-integrations)
* [Running bots](/api/running-bots)
* [Writing bots](/api/writing-bots)
```

--------------------------------------------------------------------------------

---[FILE: group-setting-values.md]---
Location: zulip-main/api_docs/group-setting-values.md

```text
# Group-setting values

Settings defining permissions in Zulip are increasingly represented
using [user groups](/help/user-groups), which offer much more flexible
configuration than the older [roles](/api/roles-and-permissions) system.

!!! warn ""

    **Note**: Many group-valued settings are configured to require
    a single system group for their value via
    `server_supported_permission_settings`, pending web app UI
    changes to fully support group-setting values.

    **Changes**: Before Zulip 10.0 (feature level 309), only system
    groups were permitted values for group-setting values in
    production environments, regardless of the values in
    `server_supported_permission_settings`.

In the API, these settings are represented using a **group-setting
value**, which can take two forms:

- An integer user group ID, which can be either a named user group
  visible in the UI or a [role-based system group](#system-groups).
- An object with fields `direct_members`, containing a list of
  integer user IDs, and `direct_subgroups`, containing a list of
  integer group IDs. The setting's value is the union of the
  identified collection of users and groups.

Group-setting values in the object form can be thought of as an
anonymous group. They function very much like a named user group
object, and remove the naming and UI overhead involved in creating
a visible user group just to store the value of a single setting.

The server will canonicalize an object with an empty `direct_members`
list and a `direct_subgroups` list that contains just a single group
ID to the integer format.

## System groups

The Zulip server maintains a collection of system groups that
correspond to the users with a given role; this makes it convenient to
store concepts like "all administrators" in a group-setting
value. These use a special naming convention and can be recognized by
the `is_system_group` property on their group object.

The following system groups are maintained by the Zulip server:

- `role:internet`: Everyone on the Internet has this permission; this
  is used to configure the [public access
  option](/help/public-access-option).
- `role:everyone`: All users, including guests.
- `role:members`: All users, excluding guests.
- `role:fullmembers`: All [full
  members](https://zulip.com/api/roles-and-permissions#determining-if-a-user-is-a-full-member)
  of the organization.
- `role:moderators`: All users with at least the moderator role.
- `role:administrators`: All users with at least the administrator
  role.
- `role:owners`: All users with the owner role.
- `role:nobody`: The formal empty group. Used in the API to represent
  disabling a feature.

Client UI for setting a permission or displaying a group (when
silently mentioned, for example) is encouraged to display system
groups using their description, rather than using their `role:}`
names, which are chosen to be unique and clear in the API.

System groups should generally not be displayed in UI for
administering an organization's user groups, since they are not
directly mutable.

## Updating group-setting values

The Zulip API uses a special format for modifying an existing setting
using a group-setting value.

A **group-setting update** is an object with a `new` field and an
optional `old` field, each containing a group-setting value. The
setting's value will be set to the membership expressed by the `new`
field.

The `old` field expresses the client's understanding of the current
value of the setting. If the `old` field is present and does not match
the actual current value of the setting, then the request will fail
with error code `EXPECTATION_MISMATCH` and no changes will be applied.

When a user edits the setting in a UI, the resulting API request
should generally always include the `old` field, giving the value
the list had when the user started editing. This accurately expresses
the user's intent, and if two users edit the same list around the
same time, it prevents a situation where the second change
accidentally reverts the first one without either user noticing.

Omitting `old` is appropriate where the intent really is a new complete
list rather than an edit, for example in an integration that syncs the
list from an external source of truth.

## Permitted values

Not every possible group-setting value is a valid configuration for a
given group-based setting. For example, as a security hardening
measure, some administrative permissions should never be exercised by
guest users, and the system group for all users, including guests,
should not be offered to users as an option for those settings.

Others have restrictions to only permit system groups due to UI
components not yet having been migrated to support a broader set of
values. In order to avoid this configuration ending up hardcoded in
clients, every permission setting using this framework has an entry in
the `server_supported_permission_settings` section of the [`POST
/register`](/api/register-queue) response.

Clients that support mutating group-settings values must parse that
part of the `register` payload in order to compute the set of
permitted values to offer to the user and avoid server-side errors
when trying to save a value.

Note specifically that the `allow_everyone_group` field, which
determines whether the setting can have the value of "all user
accounts, including guests" also controls whether guests users can
exercise the permission regardless of their membership in the
group-setting value.
```

--------------------------------------------------------------------------------

---[FILE: http-headers.md]---
Location: zulip-main/api_docs/http-headers.md

```text
# HTTP headers

This page documents the HTTP headers used by the Zulip API.

Most important is that API clients authenticate to the server using
HTTP Basic authentication. If you're using the official [Python or
JavaScript bindings](/api/installation-instructions), this is taken
care of when you configure said bindings.

Otherwise, see the `curl` example on each endpoint's documentation
page, which details the request format.

Documented below are additional HTTP headers and header conventions
generally used by Zulip:

## The `User-Agent` header

Clients are not required to pass a `User-Agent` HTTP header, but we
highly recommend doing so when writing an integration. It's easy to do
and it can help save time when debugging issues related to an API
client.

If provided, the Zulip server will parse the `User-Agent` HTTP header
in order to identify specific clients and integrations. This
information is used by the server for logging, [usage
statistics](/help/analytics), and on rare occasions, for
backwards-compatibility logic to preserve support for older versions
of official clients.

Official Zulip clients and integrations use a `User-Agent` that starts
with something like `ZulipMobile/20.0.103 `, encoding the name of the
application and it's version.

Zulip's official API bindings have reasonable defaults for
`User-Agent`. For example, the official Zulip Python bindings have a
default `User-Agent` starting with `ZulipPython/{version}`, where
`version` is the version of the library.

You can give your bot/integration its own name by passing the `client`
parameter when initializing the Python bindings. For example, the
official Zulip Nagios integration is initialized like this:

``` python
client = zulip.Client(
    config_file=opts.config, client=f"ZulipNagios/{VERSION}"
)
```

If you are working on an integration that you plan to share outside
your organization, you can get help picking a good name in
[#integrations][integrations-channel] in the [Zulip development
community](https://zulip.com/development-community/).

## Rate-limiting response headers

To help clients avoid exceeding rate limits, Zulip sets the following
HTTP headers in all API responses:

* `X-RateLimit-Remaining`: The number of additional requests of this
  type that the client can send before exceeding its limit.
* `X-RateLimit-Limit`: The limit that would be applicable to a client
  that had not made any recent requests of this type. This is useful
  for designing a client's burst behavior so as to avoid ever reaching
  a rate limit.
* `X-RateLimit-Reset`: The time at which the client will no longer
  have any rate limits applied to it (and thus could do a burst of
  `X-RateLimit-Limit` requests).

[Zulip's rate limiting rules are configurable][rate-limiting-rules],
and can vary by server and over time. The default configuration
currently limits:

* Every user is limited to 200 total API requests per minute, and 2000
  total API requests per hour.
* Separate, much lower limits for authentication/login attempts.

When the Zulip server has configured multiple rate limits that apply
to a given request, the values returned will be for the strictest
limit.

[rate-limiting-rules]: https://zulip.readthedocs.io/en/latest/production/securing-your-zulip-server.html#rate-limiting
[integrations-channel]: https://chat.zulip.org/#narrow/channel/127-integrations/
```

--------------------------------------------------------------------------------

````
