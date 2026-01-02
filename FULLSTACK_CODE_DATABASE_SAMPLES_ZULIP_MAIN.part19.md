---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 19
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 19 of 1290)

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

---[FILE: non-webhook-integrations.md]---
Location: zulip-main/api_docs/non-webhook-integrations.md

```text
# Non-webhook integrations

[Incoming webhook integrations](/api/incoming-webhooks-overview) are the
fastest to write, but sometimes a third-party product just doesn't support
them. Zulip supports several other types of integrations.

* **Python script integrations**
   (examples: SVN, Git), where we can get the service to call our integration
   (by shelling out or otherwise), passing in the required data.  Our preferred
   model for these is to ship these integrations in the
   [Zulip Python API distribution](https://github.com/zulip/python-zulip-api/tree/main/zulip),
   within the `integrations` directory there.

* **Plugin integrations** (examples:
   Jenkins, Hubot, Trac) where the user needs to install a plugin into their
   existing software.  These are often more work, but for some products are the
   only way to integrate with the product at all.

    For plugin integrations, usually you will need to consult the
    documentation for the third party software in order to learn how to
    write the integration.

* **Interactive bots**. See [Writing bots](/api/writing-bots).

A few notes on how to do these:

* You should always send messages by POSTing to URLs of the form
`https://zulip.example.com/v1/messages/`.

* We usually build Python script integrations with (at least) 2 files:
`zulip_foo_config.py` containing the configuration for the
integration including the bots' API keys, plus a script that reads
from this configuration to actually do the work (that way, it's
possible to update the script without breaking users' configurations).

* Be sure to test your integration carefully and
  [document](https://zulip.readthedocs.io/en/latest/documentation/integrations.html)
  how to install it.

* You should specify a clear HTTP User-Agent for your integration. The
user agent should at a minimum identify the integration and version
number, separated by a slash. If possible, you should collect platform
information and include that in `()`s after the version number. Some
examples of ideal UAs are:

    ```
    ZulipDesktop/0.7.0 (Ubuntu; 14.04)
    ZulipJenkins/0.1.0 (Windows; 7.2)
    ZulipMobile/0.5.4 (Android; 4.2; maguro)
    ```

* The [general advice](/api/incoming-webhooks-overview#general-advice) for
  webhook integrations applies here as well.

## Related articles

* [Running bots](/api/running-bots)
* [Deploying bots](/api/deploying-bots)
* [Writing bots](/api/writing-bots)
```

--------------------------------------------------------------------------------

---[FILE: outgoing-webhook-payload.md]---
Location: zulip-main/api_docs/outgoing-webhook-payload.md

```text
# Outgoing webhook payloads

Zulip supports [outgoing webhooks](/api/outgoing-webhooks) in a clean,
native [Zulip format](#zulip-format), as well as in a [Slack-compatible
format](#slack-compatible-format).

## Zulip format

{generate_code_example|/zulip-outgoing-webhook:post|fixture}

### Fields documentation

{generate_return_values_table|zulip.yaml|/zulip-outgoing-webhook:post}

## Slack-compatible format

This webhook format is compatible with [Slack's outgoing webhook
API](https://api.slack.com/custom-integrations/outgoing-webhooks),
which can help with porting an existing Slack integration to work with
Zulip, and allows immediate integration with many third-party systems
that already support Slack outgoing webhooks.

The following table details how the Zulip server translates a Zulip
message into the Slack-compatible webhook format.

<table class="table">
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>token</code></td>
            <td>A string of alphanumeric characters you can use to
            authenticate the webhook request (each bot user uses a fixed token)</td>
        </tr>
        <tr>
            <td><code>team_id</code></td>
            <td>ID of the Zulip organization prefixed by "T".</td>
        </tr>
        <tr>
            <td><code>team_domain</code></td>
            <td>Hostname of the Zulip organization</td>
        </tr>
        <tr>
            <td><code>channel_id</code></td>
            <td>Channel ID prefixed by "C"</td>
        </tr>
        <tr>
            <td><code>channel_name</code></td>
            <td>Channel name</td>
        </tr>
        <tr>
            <td><code>thread_ts</code></td>
            <td>Timestamp for when message was sent</td>
        </tr>
        <tr>
            <td><code>timestamp</code></td>
            <td>Timestamp for when message was sent</td>
        </tr>
        <tr>
            <td><code>user_id</code></td>
            <td>ID of the user who sent the message prefixed by "U"</td>
        </tr>
        <tr>
            <td><code>user_name</code></td>
            <td>Full name of sender</td>
        </tr>
        <tr>
            <td><code>text</code></td>
            <td>The content of the message (in Markdown)</td>
        </tr>
        <tr>
            <td><code>trigger_word</code></td>
            <td>Trigger method</td>
        </tr>
        <tr>
            <td><code>service_id</code></td>
            <td>ID of the bot user</td>
        </tr>
    </tbody>
</table>

The above data is posted as list of tuples (not JSON), here's an example:

```
[('token', 'v9fpCdldZIej2bco3uoUvGp06PowKFOf'),
 ('team_id', 'T1512'),
 ('team_domain', 'zulip.example.com'),
 ('channel_id', 'C123'),
 ('channel_name', 'integrations'),
 ('thread_ts', 1532078950),
 ('timestamp', 1532078950),
 ('user_id', 'U21'),
 ('user_name', 'Full Name'),
 ('text', '@**test**'),
 ('trigger_word', 'mention'),
 ('service_id', 27)]
```

* For successful requests, if data is returned, it returns that data,
  else it returns a blank response.
* For failed requests, it returns the reason of failure, as returned by
  the server, or the exception message.
```

--------------------------------------------------------------------------------

---[FILE: outgoing-webhooks.md]---
Location: zulip-main/api_docs/outgoing-webhooks.md

```text
# Outgoing webhooks

Outgoing webhooks allow you to build or set up Zulip integrations
which are notified when certain types of messages are sent in Zulip
When one of those events is [triggered](#triggering), the Zulip server
will send an HTTP POST [payload](/api/outgoing-webhook-payload) to the
webhook's configured URL.

Outgoing webhooks can be used to power a wide range of Zulip
integrations. For example, the [Zulip Botserver](/api/deploying-bots#zulip-botserver)
is built on top of this API.

## Create an outgoing webhook bot user

{start_tabs}

{tab|desktop-web}

{settings_tab|your-bots}

1. Click **Add a new bot**.

1. Set **Bot type** to **Outgoing webhook**.

1. Fill out the fields, with **Endpoint URL** set to the URL you'd like
   Zulip to post to, and the outgoing webhook [format](/api/outgoing-webhook-payload)
   you plan on using.

1. Click **Add**.

{end_tabs}

## Triggering

There are currently two ways to trigger an outgoing webhook:

*  **@-mention** the bot user in a channel.  If the bot
   [replies](#replying-with-a-message), its reply will be sent to that
   channel and topic.
*  **Send a direct message** with the bot user as one of the recipients.
    If the bot [replies](#replying-with-a-message), its reply will be
    sent to that direct message conversation.

## Timeouts

The remote server must respond to a `POST` request in a timely manner.
The default timeout for outgoing webhooks is 10 seconds, though this
can be configured by the administrator of the Zulip server by setting
`OUTGOING_WEBHOOKS_TIMEOUT_SECONDS` in the [server's
settings](https://zulip.readthedocs.io/en/latest/subsystems/settings.html#server-settings).

## Replying with a message

Many bots implemented using this outgoing webhook API will want to
send a reply message into Zulip.  Zulip's outgoing webhook API
provides a convenient way to do that by simply returning an
appropriate HTTP response to the Zulip server.

A correctly implemented bot will return a JSON object containing one
of two possible formats, described below.

### Example response payloads

If the bot code wants to opt out of responding, it can explicitly
encode a JSON dictionary that contains `response_not_required` set
to `True`, so that no response message is sent to the user.  (This
is helpful to distinguish deliberate non-responses from bugs.)

Here's an example of the JSON your server should respond with if
you would not like to send a response message:

```json
{
    "response_not_required": true
}
```

Here's an example of the JSON your server should respond with if
you would like to send a response message:

```json
{
    "content": "Hey, we just received **something** from Zulip!"
}
```

The `content` field should contain [Zulip-flavored Markdown](/help/format-your-message-using-markdown).

Note that an outgoing webhook bot can use the [Zulip REST
API](/api/rest) with its API key in case your bot needs to do
something else, like add an emoji reaction or upload a file.
```

--------------------------------------------------------------------------------

---[FILE: real-time-events.md]---
Location: zulip-main/api_docs/real-time-events.md

```text
# Real-time events API

Zulip's real-time events API lets you write software that reacts
immediately to events happening in Zulip.  This API is what powers the
real-time updates in the Zulip web and mobile apps.  As a result, the
events available via this API cover all changes to data displayed in
the Zulip product, from new messages to channel descriptions to
emoji reactions to changes in user or organization-level settings.

## Using the events API

The simplest way to use Zulip's real-time events API is by using
`call_on_each_event` from our Python bindings.  You just need to write
a Python function (in the examples below, the `lambda`s) and pass it
into `call_on_each_event`; your function will be called whenever a new
event matching the specified parameters (`event_types`, `narrow`,
etc.) occurs in Zulip.

`call_on_each_event` takes care of all the potentially tricky details
of long-polling, error handling, exponential backoff in retries, etc.
It's cousin, `call_on_each_message`, provides an even simpler
interface for processing Zulip messages.

More complex applications (like a Zulip terminal client) may need to
instead use the raw [register](/api/register-queue) and
[events](/api/get-events) endpoints.

## Usage examples

{start_tabs}
{tab|python}

```
#!/usr/bin/env python

import sys
import zulip

# Pass the path to your zuliprc file here.
client = zulip.Client(config_file="~/zuliprc")

# Print every message the current user would receive
# This is a blocking call that will run forever
client.call_on_each_message(lambda msg: sys.stdout.write(str(msg) + "\n"))

# Print every event relevant to the user
# This is a blocking call that will run forever
client.call_on_each_event(lambda event: sys.stdout.write(str(event) + "\n"))
```

{end_tabs}

## Parameters

You may also pass in the following keyword arguments to `call_on_each_event`:

{generate_api_arguments_table|zulip.yaml|/real-time:post}

See the [GET /events](/api/get-events) documentation for
more details on the format of individual events.
```

--------------------------------------------------------------------------------

---[FILE: rest-error-handling.md]---
Location: zulip-main/api_docs/rest-error-handling.md

```text
# Error handling

Zulip's API will always return a JSON format response.
The HTTP status code indicates whether the request was successful
(200 = success, 4xx = user error, 5xx = server error).

Every response, both success and error responses, will contain at least
two keys:

- `msg`: an internationalized, human-readable error message string.

- `result`: either `"error"` or `"success"`, which is redundant with the
  HTTP status code, but is convenient when print debugging.

Every error response will also contain an additional key:

- `code`: a machine-readable error string, with a default value of
  `"BAD_REQUEST"` for general errors.

Clients should always check `code`, rather than `msg`, when looking for
specific error conditions. The string values for `msg` are
internationalized (e.g., the server will send the error message
translated into French if the user has a French locale), so checking
those strings will result in buggy code.

!!! tip ""

     If a client needs information that is only present in the string value
     of `msg` for a particular error response, then the developers
     implementing the client should [start a conversation here][api-design]
     in order to discuss getting a specific error `code` and/or relevant
     additional key/value pairs for that error response.

In addition to the keys described above, some error responses will
contain other keys with further details that are useful for clients. The
specific keys present depend on the error `code`, and are documented at
the API endpoints where these particular errors appear.

**Changes**: Before Zulip 5.0 (feature level 76), all error responses
did not contain a `code` key, and its absence indicated that no specific
error `code` had been allocated for that error.

## Common error responses

Documented below are some error responses that are common to many
endpoints:

{generate_code_example|/rest-error-handling:post|fixture}

## Ignored Parameters

In JSON success responses, all Zulip REST API endpoints may return
an array of parameters sent in the request that are not supported
by that specific endpoint.

While this can be expected, e.g., when sending both current and legacy
names for a parameter to a Zulip server of unknown version, this often
indicates either a bug in the client implementation or an attempt to
configure a new feature while connected to an older Zulip server that
does not support said feature.

{generate_code_example|/settings:patch|fixture}

[api-design]: https://chat.zulip.org/#narrow/channel/378-api-design
```

--------------------------------------------------------------------------------

---[FILE: rest.md]---
Location: zulip-main/api_docs/rest.md

```text
# The Zulip REST API

The Zulip REST API powers the Zulip web and mobile apps, so anything
you can do in Zulip, you can do with Zulip's REST API.  To use this API:

* You'll need to [get an API key](/api/api-keys).  You will likely
  want to [create a bot](/help/add-a-bot-or-integration), unless you're
  using the API to interact with
  your own account (e.g., exporting your personal message history).
* Choose what language you'd like to use.  You can download the
  [Python or JavaScript bindings](/api/installation-instructions), projects in
  [other languages](/api/client-libraries), or
  just make HTTP requests with your favorite programming language.
* If you're making your own HTTP requests, you'll want to send the
  appropriate [HTTP basic authentication headers](/api/http-headers).
* The Zulip API has a standard
  [system for reporting errors](/api/rest-error-handling).

Most other details are covered in the documentation for the individual
endpoints:

!!! tip ""

    You may use the `client.call_endpoint` method of our Python API
    bindings to call an endpoint that isn't documented here. For an
    example, see [Upload a custom emoji](/api/upload-custom-emoji).

{!rest-endpoints.md!}

Since Zulip is open source, you can also consult the
[Zulip server source code](https://github.com/zulip/zulip/) as a
workaround for how to do anything not documented here.
```

--------------------------------------------------------------------------------

---[FILE: roles-and-permissions.md]---
Location: zulip-main/api_docs/roles-and-permissions.md

```text
# Roles and permissions

Zulip offers several levels of permissions based on a
[user's role](/help/user-roles) in a Zulip organization.

Here are some important details to note when working with these
roles and permissions in Zulip's API:

## A user's role

A user's account data include a `role` property, which contains the
user's role in the Zulip organization. These roles are encoded as:

* Organization owner: 100

* Organization administrator: 200

* Organization moderator: 300

* Member: 400

* Guest: 600

User account data also include these boolean properties that duplicate
the related roles above:

* `is_owner` specifying whether the user is an organization owner.

* `is_admin` specifying whether the user is an organization administrator.

* `is_guest` specifying whether the user is a guest user.

These are intended as conveniences for simple clients, and clients
should prefer using the `role` field, since only that one is updated
by the [events API](/api/get-events).

Note that [`POST /register`](/api/register-queue) also returns an
`is_moderator` boolean property specifying whether the current user is
at least an organization moderator. The property will be true for admins
and owners too.

Additionally, user account data include an `is_billing_admin` property
specifying whether the user is a billing administrator for the Zulip
organization, which is not related to one of the roles listed above,
but rather allows for specific permissions related to billing
administration in [paid Zulip Cloud plans](https://zulip.com/plans/).

### User account data in the API

Endpoints that return the user account data / properties mentioned
above are:

* [`GET /users`](/api/get-users)

* [`GET /users/{user_id}`](/api/get-user)

* [`GET /users/{email}`](/api/get-user-by-email)

* [`GET /users/me`](/api/get-own-user)

* [`GET /events`](/api/get-events)

* [`POST /register`](/api/register-queue)

Note that the [`POST /register` endpoint](/api/register-queue) returns
the above boolean properties to describe the role of the current user,
when `realm_user` is present in `fetch_event_types`.

Additionally, the specific events returned by the
[`GET /events` endpoint](/api/get-events) containing data related
to user accounts and roles are the [`realm_user` add
event](/api/get-events#realm_user-add), and the
[`realm_user` update event](/api/get-events#realm_user-update).

## Permission levels

Many areas of Zulip are customizable by the roles
above, such as (but not limited to) [restricting message editing and
deletion](/help/restrict-message-editing-and-deletion) and various
permissions for different [channel types](/help/channel-permissions).
The potential permission levels are:

* Everyone / Any user including Guests (least restrictive)

* Members

* Full members

* Moderators

* Administrators

* Owners

* Nobody (most restrictive)

These permission levels and policies in the API are designed to be
cutoffs in that users with the specified role and above have the
specified ability or access. For example, a permission level documented
as 'moderators only' includes organization moderators, administrators,
and owners.

Note that specific settings and policies in the Zulip API that use these
permission levels will likely support a subset of those listed above.

## Group-based permissions

Some settings have been migrated to a more flexible system based on
[user groups](/api/group-setting-values).

## Determining if a user is a full member

When a Zulip organization has set up a [waiting period before new members
turn into full members](/help/restrict-permissions-of-new-members),
clients will need to determine if a user's account has aged past the
organization's waiting period threshold.

The `realm_waiting_period_threshold`, which is the number of days until
a user's account is treated as a full member, is returned by the
[`POST /register` endpoint](/api/register-queue) when `realm` is present
in `fetch_event_types`.

Clients can compare the `realm_waiting_period_threshold` to a user
accounts's `date_joined` property, which is the time the user account
was created, to determine if a user has the permissions of a full
member or a new member.
```

--------------------------------------------------------------------------------

---[FILE: running-bots.md]---
Location: zulip-main/api_docs/running-bots.md

```text
# Running interactive bots

Zulip's API has a powerful framework for interactive bots that react to messages
in Zulip. You can [write your own interactive bot](/api/writing-bots), or run a
Zulip bot from [zulip_bots/bots](
https://github.com/zulip/python-zulip-api/tree/main/zulip_bots/zulip_bots/bots).

## Running a bot

This guide will show you how to run an existing Zulip bot
found in [zulip_bots/bots](
https://github.com/zulip/python-zulip-api/tree/main/zulip_bots/zulip_bots/bots).

You'll need:

* An account in a Zulip organization
  (e.g., [the Zulip development community](https://zulip.com/development-community/),
  `{{ display_host }}`, or a Zulip organization on your own
  [development](https://zulip.readthedocs.io/en/latest/development/overview.html) or
  [production](https://zulip.readthedocs.io/en/latest/production/install.html) server).
* A computer where you're running the bot from.

**Note: Please be considerate when testing experimental bots on public servers such as chat.zulip.org.**

{start_tabs}

1. [Create a bot](/help/add-a-bot-or-integration), making sure to select
   **Generic bot** as the **Bot type**.

1. [Download the bot's `zuliprc` file](/api/configuring-python-bindings#download-a-zuliprc-file).

1. Use the following command to install the
   [`zulip_bots` Python package](https://pypi.org/project/zulip-bots/):

        pip3 install zulip_bots

1. Use the following command to start the bot process *(replacing
   `~/path/to/zuliprc` with the path to the `zuliprc` file you downloaded above)*:

        zulip-run-bot <bot-name> --config-file ~/path/to/zuliprc

1. Check the output of the command above to make sure your bot is running.
   It should include the following line:

        INFO:root:starting message handling...

1. Test your setup by [starting a new direct message](/help/starting-a-new-direct-message)
   with the bot or [mentioning](/help/mention-a-user-or-group) the bot on a channel.

!!! tip ""

    To use the latest development version of the `zulip_bots` package, follow
    [these steps](writing-bots#installing-a-development-version-of-the-zulip-bots-package).

{end_tabs}

You can now play around with the bot and get it configured the way you
like.  Eventually, you'll probably want to run it in a production
environment where it'll stay up, by [deploying](/api/deploying-bots) it on a
server using the Zulip Botserver.

## Related articles

* [Non-webhook integrations](/api/non-webhook-integrations)
* [Deploying bots](/api/deploying-bots)
* [Writing bots](/api/writing-bots)
```

--------------------------------------------------------------------------------

---[FILE: send-message.md]---
Location: zulip-main/api_docs/send-message.md

```text
{generate_api_header(/messages:post)}

## Usage examples

{start_tabs}

{generate_code_example(python)|/messages:post|example}

{generate_code_example(javascript)|/messages:post|example}

{tab|curl}

``` curl
# For channel messages
curl -X POST {{ api_url }}/v1/messages \
    -u BOT_EMAIL_ADDRESS:BOT_API_KEY \
    --data-urlencode type=stream \
    --data-urlencode 'to="Denmark"' \
    --data-urlencode topic=Castle \
    --data-urlencode 'content=I come not, friends, to steal away your hearts.'

# For direct messages
curl -X POST {{ api_url }}/v1/messages \
    -u BOT_EMAIL_ADDRESS:BOT_API_KEY \
    --data-urlencode type=direct \
    --data-urlencode 'to=[9]' \
    --data-urlencode 'content=With mirth and laughter let old wrinkles come.'
```

{tab|zulip-send}

You can use `zulip-send`
(available after you `pip install zulip`) to easily send Zulips from
the command-line, providing the message content via STDIN.

```bash
# For channel messages
zulip-send --stream Denmark --subject Castle \
    --user othello-bot@example.com --api-key a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5

# For direct messages
zulip-send hamlet@example.com \
    --user othello-bot@example.com --api-key a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5
```

#### Passing in the message on the command-line

If you'd like, you can also provide the message on the command-line with the
`-m` or `--message` flag, as follows:


```bash
zulip-send --stream Denmark --subject Castle \
    --message 'I come not, friends, to steal away your hearts.' \
    --user othello-bot@example.com --api-key a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5
```

You can omit the `user` and `api-key` parameters if you have a `~/.zuliprc`
file.

{end_tabs}

## Parameters

{generate_api_arguments_table|zulip.yaml|/messages:post}

{generate_parameter_description(/messages:post)}

## Response

{generate_return_values_table|zulip.yaml|/messages:post}

{generate_response_description(/messages:post)}

#### Example response(s)

{generate_code_example|/messages:post|fixture}
```

--------------------------------------------------------------------------------

---[FILE: sidebar_index.md]---
Location: zulip-main/api_docs/sidebar_index.md

```text
## Integrations

* [Overview](/api/integrations-overview)
* [Incoming webhook integrations](/api/incoming-webhooks-overview)
* [Hello world walkthrough](/api/incoming-webhooks-walkthrough)
* [Non-webhook integrations](/api/non-webhook-integrations)

## Interactive bots

* [Writing bots](/api/writing-bots)
* [Interactive bots API](/api/interactive-bots-api)
* [Writing tests for bots](/api/writing-tests-for-interactive-bots)
* [Running bots](/api/running-bots)
* [Deploying bots](/api/deploying-bots)
* [Outgoing webhooks](/api/outgoing-webhooks)

## REST API

* [Overview](/api/rest)
* [Installation instructions](/api/installation-instructions)
* [API keys](/api/api-keys)
* [Configuring the Python bindings](/api/configuring-python-bindings)
* [HTTP headers](/api/http-headers)
* [Error handling](/api/rest-error-handling)
* [Roles and permissions](/api/roles-and-permissions)
* [Group-setting values](/api/group-setting-values)
* [Message formatting](/api/message-formatting)
* [Zulip URLs](/api/zulip-urls)
* [Client libraries](/api/client-libraries)
* [API changelog](/api/changelog)

{!rest-endpoints.md!}
```

--------------------------------------------------------------------------------

---[FILE: writing-bots.md]---
Location: zulip-main/api_docs/writing-bots.md

```text
# Writing interactive bots

Zulip's API has a powerful framework for interactive bots that react to messages
in Zulip. This page will guide you through writing your own interactive bot.

- [Installing a development version of the Zulip bots package](#installing-a-development-version-of-the-zulip-bots-package)
- [Bot template](#bot-template)
- [Testing a bot's output](#testing-a-bots-output)
- [Troubleshooting](#troubleshooting)

## Installing a development version of the Zulip bots package

This will provide convenient tooling for developing and testing your bot.

{start_tabs}

1. Clone the [python-zulip-api](https://github.com/zulip/python-zulip-api)
   repository:

    ```
    git clone https://github.com/zulip/python-zulip-api.git
    ```

1. Navigate into your cloned repository:

    ```
    cd python-zulip-api
    ```

1. Install all requirements in a Python virtualenv:

    ```
    python3 ./tools/provision
    ```

1. Run the command provided in the final output of the `provision` process to
   enter the new virtualenv. The command will be of the form `source .../activate`.

1. You should now see the name of your virtualenv preceding your prompt (e.g.,
   `(zulip-api-py3-venv)`).

!!! tip ""

    `provision` installs the `zulip`, `zulip_bots`, and
    `zulip_botserver` packages in developer mode. This enables you to
    modify these packages and then run your modified code without
    having to first re-install the packages or re-provision.

{end_tabs}

## Bot template

The only file required for a new bot is `<my-bot>.py`. It has the following
structure:

```python
class MyBotHandler(object):
    '''
    A docstring documenting this bot.
    '''

    def usage(self):
        return '''Your description of the bot'''

    def handle_message(self, message, bot_handler):
        # add your code here

handler_class = MyBotHandler
```

The class name (in this case *MyBotHandler*) can be defined by you
and should match the name of your bot. To register your bot's class,
adjust the last line `handler_class = MyBotHandler` to match your
class name.

Every bot must implement the `usage(self)` and `handle_message(self, message,
bot_handler)` functions. They are described in detail in the
[interactive bots API documentation](/api/interactive-bots-api).

All the files associated with a bot (e.g., tests, documentation, etc.) should be
placed in the same directory as `<my-bot>.py`.

## Testing a bot's output

You can see how a bot reacts to a message without setting it up on a server,
using the `zulip-bot-shell` tool.

{start_tabs}

1. [Install all requirements](#installing-a-development-version-of-the-zulip-bots-package).
1.  Run `zulip-bot-shell` to test one of the bots in
  [`zulip_bots/bots`](https://github.com/zulip/python-zulip-api/tree/main/zulip_bots/zulip_bots/bots).

{end_tabs}

Example invocations:

```
> zulip-bot-shell converter

Enter your message: "12 meter yard"
Response: 12.0 meter = 13.12336 yard

> zulip-bot-shell -b ~/followup.conf followup

Enter your message: "Task completed"
Response: stream: followup topic: foo_sender@zulip.com
          from foo_sender@zulip.com: Task completed

```

Note that the `-b` (aka `--bot-config-file`) argument is for an optional third party
config file (e.g., ~/giphy.conf), which only applies to certain types of bots.

## Troubleshooting

### I modified my bot's code, yet the changes don't seem to have an effect.

Ensure that you restarted the `zulip-run-bot` script.

### My bot won't start.

* Ensure that your API config file is correct (download the config file from the server).
* Ensure that you bot script is located in `zulip_bots/bots/<my-bot>/`
* Are you using your own Zulip development server? Ensure that you run your bot outside
  the Vagrant environment.

## Related articles

* [Interactive bots API](/api/interactive-bots-api)
* [Writing tests for bots](/api/writing-tests-for-interactive-bots)
* [Running bots](/api/running-bots)
* [Deploying bots](/api/deploying-bots)
* [Configuring the Python bindings](/api/configuring-python-bindings)
* [Non-webhook integrations](/api/non-webhook-integrations)
```

--------------------------------------------------------------------------------

---[FILE: writing-tests-for-interactive-bots.md]---
Location: zulip-main/api_docs/writing-tests-for-interactive-bots.md

```text
# Writing tests for interactive bots

This page gives an overview of the unit testing framework for interactive bots.
Bots in the main
[`python-zulip-api`](https://github.com/zulip/python-zulip-api/tree/main/zulip_bots/zulip_bots/bots)
repository are required to include a reasonable set of unit tests, so that
future developers can easily refactor them.

*Unit tests for bots make heavy use of mocking. If you want to get comfortable with mocking,
 mocking strategies, etc. you should check out our [mocking guide](
 https://zulip.readthedocs.io/en/latest/testing/testing-with-django.html#testing-with-mocks).*

## A simple example

 Let's have a look at a simple test suite for the [`helloworld`](
 https://github.com/zulip/python-zulip-api/tree/main/zulip_bots/zulip_bots/bots/helloworld)
 bot.

```python
from zulip_bots.test_lib import StubBotTestCase

class TestHelpBot(StubBotTestCase):
    bot_name: str = "helloworld"

    def test_bot(self) -> None:
        dialog = [
            ('', 'beep boop'),
            ('help', 'beep boop'),
            ('foo', 'beep boop'),
        ]

        self.verify_dialog(dialog)

```

The `helloworld` bot replies with "beep boop" to every message @-mentioning it.  We
want our test to verify that the bot **actually** does that.

Note that our helper method `verify_dialog` simulates the conversation for us, and
we just need to set up a list of tuples with expected results.

The best way to learn about bot tests is to read all the existing tests in the
`bots` subdirectories.

## Testing your test

Once you have written a test suite, you want to verify that everything works as expected.

* To test a bot in [Zulip's bot directory](
  https://github.com/zulip/python-zulip-api/tree/main/zulip_bots/zulip_bots/bots):
  `tools/test-bots <botname>`

* To run all bot tests: `tools/test-bots`

## Advanced testing

This section shows advanced testing techniques for more complicated bots that have
configuration files or interact with third-party APIs.
*The code for the bot testing library can be found [here](
 https://github.com/zulip/python-zulip-api/blob/main/zulip_bots/zulip_bots/test_lib.py).*


### Testing bots with config files

Some bots, such as [Giphy](
https://github.com/zulip/python-zulip-api/tree/main/zulip_bots/zulip_bots/bots/giphy),
support or require user configuration options to control how the bot works.

To test such a bot, you can use the following pattern:

    with self.mock_config_info(dict(api_key=12345)):
        # self.verify_reply(...)

`mock_config_info()` replaces the actual step of reading configuration from the file
system and gives your test "dummy data" instead.

### Testing bots with internet access

Some bots, such as [Giphy](
https://github.com/zulip/python-zulip-api/tree/main/zulip_bots/zulip_bots/bots/giphy),
depend on a third-party service, such as the Giphy web app, in order to work. Because
we want our test suite to be reliable and not add load to these third-party APIs, tests
for these services need to have "test fixtures": sample HTTP request/response pairs to
be used by the tests. You can specify which one to use in your test code using the
following helper method:

    with self.mock_http_conversation('test_fixture_name'):
        # self.assert_bot_response(...)

`mock_http_conversation(fixture_name)` patches `requests.get` and returns the data specified
in the file `fixtures/{fixture_name}.json`. Use the following JSON code as a skeleton for new
fixtures:
```json
{
  "request": {
    "api_url": "http://api.example.com/",
    "params": {
    }
  },
  "response": {
  },
  "response-headers": {
  }
}
```
For an example, check out the [giphy bot](
https://github.com/zulip/python-zulip-api/tree/main/zulip_bots/zulip_bots/bots/giphy).

*Tip: You can use [requestbin](https://requestbin.com/) or a similar
tool to capture payloads from the service your bot is interacting
with.*

### Examples

Check out our [bots](https://github.com/zulip/python-zulip-api/tree/main/zulip_bots/zulip_bots/bots)
to see examples of bot tests.

## Related articles

* [Writing bots](/api/writing-bots)
* [Interactive bots API](/api/interactive-bots-api)
```

--------------------------------------------------------------------------------

---[FILE: zulip-urls.md]---
Location: zulip-main/api_docs/zulip-urls.md

```text
# Zulip URLs

This page details how to properly construct and parse the URLs that
the Zulip web app uses for various types of views.

Because other clients needs to be able to resolve and process these
links in order to implement equivalent behavior that navigates
directly in say the mobile apps, it's important to have a clear
specification of exactly how these URLs work.

Essentially all of the data is encoded in the URL fragment (`#`) part
of a URL; the protocol, host and path will just be the canonical URL
for the Zulip server (In these examples,
`https://zulip.example.com/`).

## Message feed views

Most links in Zulip are to message feed views, and for that reason
these have the most developed syntax and legacy behavior.

Message feed URLs always start with `#narrow/`, follow by one or more
[search operator/operand pairs](/api/construct-narrow), separated by
`/`s. The operator may be negated by putting a `-` at the start of
it. For example:

`https://zulip.example.com/#narrow/is/starred/sender/17/-channel/14`

is the feed of starred messages sent by user ID to everywhere but
channel 14. The search documentation covers the valid operators and
their meaning.

See also the relevant [message formatting
documentation](/api/message-formatting) for details on Markdown
representations of Zulip-internal links that will be translated into
HTML containing links that use these URLs.

Here, we describe some special encoding rules.

### Operand encoding and decoding

Strings in operands are URL-encoded, and then additional substitution
rules are applied to avoid over-zealous browser handling of certain
characters in the URL fragment:

- `%` => `.`
- `(` => `.28`
- `)` => `.29`
- `.` => `.2E`

They can decoded by applying the reverse transformation: Replace all
`.` characters with `%`, and then do standard URL-decoding.

### Encoding channels

Channel operands must be encoded in one of the two modern fully
supported formats:

- `42`: Just the ID of the channel. Clients should simply parse the
  channel ID to look up the channel, which is of course not guaranteed
  to be accessible to the acting user or even exist.
- `42-channel-name`. The ID of the channel, with a human-readable hint
  of the channel name. Clients generating Zulip URLs are recommended
  to include channel name hints where there is a readable URL-encoding
  of the channel name, but to skip doing so for channel names written
  in non-ascii languages or where otherwise the slug would not make
  the URL nicer for humans. Clients must parse this format by
  discarding everything after the `-` and treating it identically to
  the simpler integer-only format. Note that means nothing enforces
  that the string have anything to do with the channel name;
  functionally, it just an optional hint.

These two formats allow Zulip URLs to stably refer to a specific
channel, even though channels can be renamed, while still allowing the
URLs to have user-friendly name hints most of the time.

There is an additional legacy format that was used prior to 2018 that
clients are required to support:

- `channel-name`: Legacy format of just the channel name, URL-encoded
  and with spaces replaced with dashes. The legacy format should never
  take precedence over the modern format, so a link with
  `2016-election` as the slug must be parsed as the channel with ID
  2016, even if theoretically it could have been originally intended
  as referring to a channel named `2016 election`.

Clients are not recommended to ever generate this legacy format.

## zulip:// links for mobile login

Zulip's single-sign on login process for the mobile app ends with a
redirect to `zulip://login` with the following query parameters:

- `email`: The email address for the authenticated account.
- `otp_encrypted_api_key`: The API key for the client, encrypted using
  the `mobile_flow_otp` that the client provided when initiating the
  login attempt.
- `realm`: The full URL of the Zulip organization.
- `user_id`: The Zulip user ID for the authenticated account.

**Changes**: The `user_id` field was added to the set of included
query parameters in Zulip 5.0 (feature level 128).

## Related articles

* [Message formatting API](/api/message-formatting)
* [Construct a narrow](/api/construct-narrow) for search.
* [Markdown formatting help](/help/format-your-message-using-markdown)
* [Send a message](/api/send-message)
```

--------------------------------------------------------------------------------

---[FILE: api-admin-only.md]---
Location: zulip-main/api_docs/include/api-admin-only.md

```text
!!! warn ""

    This endpoint is only available to organization administrators.
```

--------------------------------------------------------------------------------

````
