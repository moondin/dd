---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 282
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 282 of 1290)

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

---[FILE: slash-commands.md]---
Location: zulip-main/docs/subsystems/slash-commands.md

```text
# Slash commands

Slash commands are commands (mainly for power users) to quickly do
some stuff from the compose box. The codebase refers to these as "zcommand"s,
and both these terms are often user interchangeably.

Currently supported slash commands are:

- `/light` and `/dark` to change the UI theme
- `/ping` to ping to server and get back the time for the round
  trip. Mainly for testing.
- `/fluid-width` and `/fixed-width` to toggle that setting

It is important to distinguish slash commands from the
[widget system](/subsystems/widgets.md). Slash commands essentially
**do not send** messages (and could have very well had their
own "command prompt" (but don't), since they have nothing to do with
message sending), while widgets are special kinds of messages.

### Data flow

These commands have client-side support in `zcommands.js`.
They send commands to the server using the `/json/command`
endpoint.

In the case of "/ping", the server code in `zcommand.py`
basically just acks the client. The client then computes
the round trip time and shows a little message above
the compose box that the user can see and then dismiss.

For commands like "/light" and "/dark", the server does
a little bit of logic to toggle the user's dark theme
setting, and this is largely done inside `zcommand.py`.
The server sends a very basic response, and then
the client actually changes the display colors. The
client also shows the user a little message above
the compose box instructing them how to reverse the
change.

(It's possible that we don't really need a general
`/json/zcommand` endpoint for these, and we
may decide later to just use custom
API endpoints for each command. There's some logic
in having a central API for these, though, since they
are typically things that only UI-based clients will
invoke, and they may share validation code.)

It is the client's responsibility to correctly detect and
process when a user uses a slash command, and not instead
send a message with the raw content.

## Typeahead

Typeahead for both slash commands (and widgets) is implemented
via the `slash_commands` object in `web/src/composebox_typeahead.ts`.
```

--------------------------------------------------------------------------------

---[FILE: thumbnailing.md]---
Location: zulip-main/docs/subsystems/thumbnailing.md

```text
# Thumbnailing

## libvips

Zulip uses the [`libvips`](https://www.libvips.org/) image processing toolkit
for thumbnailing, as a low-memory and high-performance image processing
library. Some smaller images are thumbnailed synchronously inside the Django
process, but the majority of the work is offloaded to one or more `thumbnail`
worker processes.

Thumbnailing is a notoriously high-risk surface from a security standpoint,
since it parses arbitrary binary user input with often complex grammars. On
versions of `libvips` which support it (>= 8.13, on or after Ubuntu 24.04 or
Debian 12), Zulip limits `libvips` to only the image parsers and libraries whose
image formats we expect to parse, all of which are fuzz-tested by
[`oss-fuzz`](https://google.github.io/oss-fuzz/).

## Avatars

Avatar images are served at two of potential resolutions (100x100 and 500x500,
the latter of which is called "medium"), and always as PNGs. These are served
from a "dumb" endpoint -- that is, if S3 is used, we provide a direct link to
the content in the S3 bucket (or a Cloudfront distribution in front of it), and
the request does not pass through the Zulip server. This is because avatars are
referenced in emails, and thus their URLs need to be permanent and
publicly-accessible. This also means that any choice of resolution and file
format needs to be entirely done by the client.

Avatars are thumbnailed synchronously upon upload into 100x100 and 500x500 PNGs;
the originals are not preserved. The smallest dimension is scaled to fit, and
the largest dimension is cropped centered; the image may be scaled _up_ to fit
the 100x100 or 500x500 dimensions. To generate the filename, the server hashes
the avatar salt (a server-side secret), the user-id, and a per-user sequence
(the "version") to produce a filename which is not enumerable, and can only be
determined by the server. Hashing the version means that avatars can be served
with long-lasting caching headers.

The original avatar image is stored adjacent to the thumbnailed versions,
enabling later re-thumbnailing to other dimensions or formats without requiring
users to re-upload it.

## Emoji

Emoji URLs are hard-coded into emails, and as such their URLs need to be
permanent and publicly-accessible. They are served at a consistent 1:1 aspect
ratio, and while they may be rendered at different scales based on the
line-height of the client, we only need to store them at one resolution.

Emoji are thumbnailed synchronously into 64x64 images, and they are saved in
the same file format that they were uploaded in. Transparent pixels are added
to the smaller dimension to make the image square after resizing. The filename
of the emoji is based on a hash of the avatar salt (a server-side secret) and
the emoji's id -- but because the filename is stored in the database, it can be
anything with sufficient entropy to not be enumerable or have collisions.

For animated emoji, a separate "still" version of the emoji is generated from
the first frame, as a 64x64 PNG image. This is currently mostly unused, but is
intended to be part of a user preference to disable emoji animations (see
[#13434](https://github.com/zulip/zulip/issues/13434)). Current use is limited
to [user status](https://zulip.com/help/status-and-availability) display in
the the buddy list. When a user uses an animated emoji as their status, the
"still" version is used.

The original emoji is stored adjacent to the thumbnailed version, enabling later
re-thumbnailing to other dimensions or formats without requiring users to
re-upload it.

There is no technical reason that we preserve the uploader's choice of file
format, or that we use PNGs as the file format for the "still" version. Both of
these would plausibly benefit from being WebP images.

## Realm logos

Realm logos are converted to PNGs, thumbnailed down to fit within 800x100; a
1000x10 pixel image will end up as 800x8, and a 10x20 will end up 10x20. The
original is stored adjacent to the converted thumbnail.

## Realm icons

Realm icons are converted to PNGs, and treated identical to avatars, albeit only
producing the 100x100 size.

## File uploads

### Images

When an image file (as determined by the browser-supplied content-type) is
uploaded, we immediately upload the original content into S3 or onto disk. Its
headers are then examined, and used to create an ImageAttachment row, with
properties determined from the image; `thumbnail_metadata` is left empty. A
task is dispatched to the `thumbnail` worker to generate thumbnails in all of
the format/size combinations that the server currently has configured.

Because we parse the image headers enough to extract size information at upload
time, this also serves as a check that the upload is indeed a valid image. If
the image is determined to be invalid at this stage, the file upload returns
200, but the message content is left with a link to the uploaded content, not an
inline image.

When a message is sent, it checks the ImageAttachment rows for each referenced
image; if they have a non-empty `thumbnail_metadata`, then it writes out an
`img` tag pointing to one of them (see below); otherwise, it writes out a
specially-tagged "spinner" image, which indicates the server is still processing
the upload. The image tag encodes the original dimensions and if the image is
animated into the rendered content so clients can reserve the appropriate space
in the viewport.

If a message is rendered with a spinner, it also inserts the image into the
`thumbnail` worker's queue. This is generally redundant -- the image was
inserted into the queue when the image was uploaded. The exception is if the
image was uploaded prior to the existence of thumbnailing support, in which case
the additional queue insertion is required to have the spinner ever resolve.
Since the worker takes no action if all necessary thumbnails already exist,
this has little cost in general.

The `thumbnail` worker generates the thumbnails, uploads them to S3 or disk, and
then updates the `thumbnail_metadata` of the ImageAttachment row to contain a
list of formats/sizes which thumbnails were generated in. At the time of commit,
if there are already messages which reference the attachment row, then we do a
"silent" update of all of them to remove the "spinner" and insert an image.

In either case, the image which is inserted into the message body is at a
"reasonable" scale and format, as decided by the server. The paths to all the
generated thumbnails are not specified in the message content -- instead, the
client is told at registration time the set of formats/sizes which the server
supports, and knows how to transform any single thumbnailed path into any of the
other supported thumbnail variants. The client is responsible for choosing the
most appropriate format/size based on viewport size and format support, and
rewriting the URL accordingly.

All requests for images go through `/user_uploads`, which is processed by
Django. Any request for an ImageAttachment URL is first determined to be a valid
format/size for the server's current configuration; if is not valid, the server
may return any other thumbnail of its choosing (preferring similar sizes, and
accepted formats based on the client's `Accepts` header).

If the request is for a thumbnail format/size which is supported by the server,
but not in the ImageAttachment's `thumbnail_metadata` (as would happen if the
server's supported set is added to over time) then the server should generate,
store, and return the requested format/size on-demand.

### Migrations

Historical image uploads have ImageAttachment rows generated for them, but not
thumbnails. If the message content is re-rendered (for instance, due to being
edited) then it will trigger the image to be thumbnailed.

### Videos and PDFs

The thumbnailing system only processes images; it does not transcode videos or produce
image renderings of documents (e.g., PDFs), though those are natural potential
extensions.
```

--------------------------------------------------------------------------------

---[FILE: typing-indicators.md]---
Location: zulip-main/docs/subsystems/typing-indicators.md

```text
# Typing indicators

Zulip supports a feature called "typing indicators."

Typing indicators are status messages (or visual indicators) that
tell you when another user is writing a message to you. Zulip's
typing UI is similar to what you see in other chat/text systems.

This document describes how we have implemented the feature in
the Zulip web app, and our main audience is developers who want to
understand the system and possibly improve it. Any client should
be able follow the protocol documented here.

Typing indicators are implemented for both direct message conversations
and channel conversations in the web app.

There are two major roles for users in this system:

- The "writing user" is composing a message.
- The "receiving user" is waiting to receive a message (or possibly
  ready to shift their attention elsewhere).

Any Zulip user can play either one of these roles, and sometimes
they can be playing both roles at once. Having said that, you
can generally understand the system in terms of a single message
being composed by the "writing user."

On a high level the typing indicators system works like this:

- The client for the "writing user" sends requests to the server.
- The server broadcasts events to other users.
- The clients for "receiving users" receive events and conditionally
  show typing indicators, depending on where the clients are narrowed.

## Privacy settings

Note that there is a user-level privacy setting to disable sending
typing notifications that a client should check when implementing
the "writing user" protocol below. See `send_private_typing_notifications`
in the `UserBaseSettings` model in `zerver/models/users.py` and in the
`user_settings` object in the `POST /register` response.

## Writing user

When a "writing user" starts to compose a message, the client
sends a request to `POST /typing` with an `op` of `start` and
a list of potential message recipients. The web app function
that facilitates this is called `send_typing_notification_ajax`.

If the "writing user" is composing a long message, we want to send
repeated updates to the server so that downstream clients know the
user is still typing. Zulip messages tend to be longer than
messages in other chat/text clients, so this detail is important.

We have a small state machine in `web/src/typing_status.ts`
that makes sure subsequent "start" requests get sent out. The
frequency of these requests is determined by
`server_typing_started_wait_period_milliseconds` in the
`POST /register` response.

If the "writing user" goes for a while without any text input,
then we send a request to `POST /typing` with an `op` of `stop`.
The time period a client should wait before sending the request
is determined by `server_typing_stopped_wait_period_milliseconds`
in the `POST /register` response. We also immediately send "stop"
notification when the user explicitly aborts composing a message
by closing the compose box (or other actions).

A common scenario is that a user is just pausing to think for a few
seconds, but they still intend to finish the message. Of course,
that's hard to distinguish from the scenario of the user got pulled
away from their desk. For the former case, where the "writing user"
completes the message with lots of pauses for thinking, a series of
"start" and "stop" messages may be sent over time. Timeout values
reflect tradeoffs, where we have to guess how quickly people type,
how long they pause to think, and how frequently they get interrupted.

## Server

The server piece of typing notifications is currently pretty
straightforward, since we take advantage of Zulip's
[events system](events-system.md).

We deliberately designed the server piece to be stateless,
which minimizes the possibility of backend bugs and gives clients
more control over the user experience.

As such, the server piece here is basically a single Django view
function with a small bit of library support to send out events
to clients.

Requests come in to `send_notification_backend`, which is in
`zerver/views/typing.py`. For direct message typing notifications,
the call to `check_send_typing_notification` does the heavy lifting.

One of the main things that the server does is to validate that
the user IDs in the `to` parameter are for valid, active users in
the realm.

Once the request has been validated, the server sends events to
potential recipients of the message. The event type for that
payload is `typing`. See the function `do_send_typing_notification`
in `zerver/actions/typing.py` for more details.

For channel typing notifications, the server also handles the logic
for determining which users should receive the typing events based
on channel subscribers.

## Receiving user

When a user plays the role of a "receiving user," the client handles
incoming "typing" events from the server, and the client will
display a typing indicator only when both of these conditions are
true:

- The "writing user" is still likely typing.
- The "receiving user" is in a view where they'd see the eventual
  message.

The client code starts by processing events, and it maintains data
structures, and then it eventually shows or hides status messages.

We'll describe the flow of data through the web app
as a concrete example.

The events will come in to `web/src/server_events_dispatch.js`.
The `stop` and `start` operations get further handled by
`web/src/typing_events.ts`.

The main goal is then to triage which events should lead to
display changes.

The web app client maintains a list of incoming "typists" using
code in `web/src/typing_data.ts`. The API here has functions
like the following:

- `add_typist`
- `remove_typist`
- `get_group_typists`
- `get_all_direct_message_typists`

One subtle thing that the client has to do here is to maintain
timers for typing notifications. The value of
`server_typing_started_expiry_period_milliseconds` in the
`POST /register` response is used to determine when the
"writing user" has abandoned the message. Of course, the
"writing user" will also explicitly send us `stop` notifications
at certain times.

When it finally comes to displaying the notification, the web
app eventually calls `render_notifications_for_narrow`.

## Ecosystem

Even though the server is stateless, any developer working on
a client needs to be mindful of timing/network considerations
that affect the overall system.

In general, client developers should agree on timeout parameters
for how frequently we "kickstart" typing notifications for users
sending long messages. This means standardizing the "writing
user" piece of the system. It's possible that certain clients
will have slightly different mechanisms for detecting that users
have abandoned messages, but the re-transmit frequency should be
similar.

When implementing the "receiving user" piece, it's important to
realize how clients behave on the other end of the protocol. It's
possible, for example, to never receive a "stop" notification
from a client that was shut down abruptly. You should allow
reasonable amounts of time for the other side to send notifications,
allowing for network delays and server delays, but you should
not let the notifications become too "sticky" either.

## Roadmap

An area for refinement is to tune the timing values a bit.
Right now, we are possibly too aggressive about sending `stop`
messages when users are just pausing to think. It's possible
to better account for typing speed or other heuristic things
like how much of the message has already been typed.
```

--------------------------------------------------------------------------------

---[FILE: unread_messages.md]---
Location: zulip-main/docs/subsystems/unread_messages.md

```text
# Unread message synchronization

In general displaying unread counts for all channels and topics may require
downloading an unbounded number of messages. Consider a user who has a muted
channel or topic and has not read the backlog in a month; to have an accurate
unread count we would need to load all messages this user has received in the
past month. This is inefficient for web clients and even more for mobile
devices.

We work around this by including a list of unread message ids in the initial
state grouped by relevant conversation keys. This data is included in the
`unread_msgs` key if both `update_message_flags` and `message` are required
in the register call.

```json
{
    "count": 4,
    "huddles": [
        {
            "user_ids_string": "3,4,6",
            "unread_message_ids": [
                34
            ]
        }
    ],
    "streams": [
        {
            "stream_id": 1,
            "topic": "test",
            "unread_message_ids": [
                33
            ]
        }
    ],
    "pms": [
        {
            "sender_id": 3,
            "unread_message_ids": [
                31,
                32
            ]
        }
    ],
    "mentions": [31, 34]
}
```

Three event types are required to correctly maintain the `unread_msgs`. New
messages can be created without the unread flag by the `message` event type.
The unread flag can be added and removed by the `update_message_flags` event,
and the topic of unread messages can be updated by the `update_message` event
type.
```

--------------------------------------------------------------------------------

---[FILE: widgets.md]---
Location: zulip-main/docs/subsystems/widgets.md

```text
# Widgets

## What is a widget?

Widgets are special kinds of messages. These include:

- polls
- TODO lists
- `/me` messages
- Trivia bot

Some widgets are used with a leading `/` (like `/poll Tea or coffee?`), similar
to [slash commands](/subsystems/slash-commands.md), but these two concepts
are very different. Slash commands have nothing to do with message sending.

The trivia_quiz_bot does not use `/`'s. Instead, it sends "extra_data"
in messages to invoke **zforms** (which enable button-based UIs in the
messages).

## `/me` messages

These are the least complex. We use our markdown processors to
detect if a message is a `/me` message, plumb the flag through
the message object (as `is_me_message`) and have the clients
format it correctly. Related code (for the web app) lies in
`message_list_view.ts` in `_maybe_get_me_message`.

## Polls, todo lists, and games

The most interactive widgets that we built during
2018 are for polls, todo lists, and games. You
launch widgets by sending one of the following messages:

- /poll
- /todo

The web app client provides the "widget experience" by
default. Other clients just show raw messages like
"/poll", and should be adding support
for widgets soon.

Our customers have long requested a poll/survey widget.
See [this issue](https://github.com/zulip/zulip/issues/9736).
There are workaround ways to do polls using things like
emoji reactions, but our poll widget provides a more
interactive experience.

### Data flow

Some important code entities for the widget implementation are:

- `SubMessage` database table
- `/json/submessage` API endpoint
- `web/src/submessage.js`
- `web/src/poll_widget.js`
- `web/src/widgetize.ts`
- `web/src/zform.ts`
- `web/templates/widgets/`
- `zerver/lib/widget.py`
- `zerver/views/submessage.py`

Both **poll** and **todo** widgets use the "submessage" architecture.
We'll use the poll widget as an example.

The `SubMessage` table, as the name indicates, allows
you to associate multiple submessages to any given
`Message` row. When a message gets sent, there's a
hook inside of `widget.py` that will detect widgets
like "/poll". If a message needs to be
widgetized, an initial `SubMessage` row will be
created with an appropriate `msg_type` (and persisted
to the database). This data will also be included
in the normal Zulip message event payload. Clients
can choose to ignore the submessage-related data, in
which case they'll gracefully degrade to seeing "/poll".
Of course, the web app client actually recognizes the
appropriate widgets.

The web app client will next collect poll options and votes
from users. The web app client has
code in `submessage.js` that dispatches events
to `widgetize.ts`, which in turn sends events to
individual widgets. The widgets know how to render
themselves and set up click/input handlers to collect
data. They can then post back to `/json/submessage`
to attach more data to the message (and the
details are encapsulated with a callback). The server
will continue to persist `SubMessage` rows in the
database. These rows are encoded as JSON, and the
schema of the messages is driven by the individual widgets.
Most of the logic is in the client; things are fairly opaque
to the server at this point.

If a client joins Zulip after a message has accumulated
several submessage events, it will see all of those
events the first time it sees the parent message. Clients
need to know how to build/rebuild their state as each
submessage comes in. They also need to tolerate
misformatted data, ideally just dropping data on the floor.
If a widget throws an exception, it's caught before the
rest of the message feed is affected.

As far as rendering is concerned, each widget module
is given a parent `elem` when its `activate` function
is called. This is just a `<div>` inside of the parent
message in the message pane. The widget has access to
jQuery and template.render, and the developer can create
new templates in `web/templates/widgets/`.

A good way to learn the system is to read the code
in `web/src/poll_widget.js`. It is worth noting that
writing a new widget requires only minor backend
changes in the current architecture. This could change
in the future, but for now, a frontend developer mostly
needs to know JS, CSS, and HTML.

It may be useful to think of widgets in terms of a
bunch of clients exchanging peer-to-peer messages. The
server's only real role is to decide who gets delivered
which submessages. It's a lot like a "subchat" system.

### Backward compatibility

Our "submessage" widgets are still evolving, and we want
to have a plan for allowing future progress without
breaking old messages.

Widget developers can revise code to improve a
widget's visual polish without too much concern
for breaking how old messages get widgetized. They will need to
be more cautious if they change the actual data
structures passed around in the submessage payloads.

For significant schema changes, it would be worthwhile to add
some kind of versioning scheme inside of `SubMessages`, either
at the DB level or more at the JSON level within fields.
This has yet to be designed. One thing to consider is that
most widgets are somewhat ephemeral in nature, so it's not
the end of the world if upgrades cause some older messages
to be obsolete, as long as the code degrades gracefully.

Mission-critical widgets should have a deprecation strategy.
For example, you could add optional features for one version
bump and then only make them mandatory for the next version,
as long as you don't radically change the data model. And
if you're truly making radical changes, you can always
write a Django migration for the `SubMessage` data.

### Adding widgets

Right now we don't have a plugin model for the above widgets;
they are served up by the core Zulip server implementation.
Of course, anybody who wishes to build their own widget
has the option of forking the server code and self-hosting,
but we want to encourage folks to submit widget
code to our codebase in PRs. If we get to a critical mass
of contributed widgets, we will want to explore a more
dynamic mechanism for "plugging in" code from outside sources,
but that is not in our immediate roadmap.

This is sort of a segue to the next section of this document.
Suppose you want to write your own custom bot, and you
want to allow users to click buttons to respond to options,
but you don't want to have to modify the Zulip server codebase
to turn on those features. This is where our "zform"
architecture comes to the rescue.

## zform (trivia quiz bot)

This section will describe our "zform" architecture.

For context, imagine a naive trivia bot. The trivia bot
sends a question with the answers labeled as A, B, C,
and D. Folks who want to answer the bot send back an
answer have to send an actual Zulip message with something
like `@trivia_bot answer A to Q01`, which is kind of
tedious to type. Wouldn't it be nice if the bot could
serve up some kind of buttons with canned replies, so
that the user just hits a button?

That is where zforms come in. Zulip's trivia bot sends
the Zulip server a JSON representation of a form it
wants rendered, and then the client renders a generic
"**zform**" with buttons corresponding to `short_name` fields
inside a `choices` list inside of the JSON payload.

Here is what an example payload looks like:

```json
{
    "extra_data": {
        "type": "choices",
        "heading": "05: What color is a blueberry?",
        "choices": [
            {
                "type": "multiple_choice",
                "reply": "answer 05 A",
                "long_name": "red",
                "short_name": "A"
            },
            {
                "type": "multiple_choice",
                "reply": "answer 05 B",
                "long_name": "blue",
                "short_name": "B"
            },
            {
                "type": "multiple_choice",
                "reply": "answer 05 C",
                "long_name": "yellow",
                "short_name": "C"
            },
            {
                "type": "multiple_choice",
                "reply": "answer 05 D",
                "long_name": "orange",
                "short_name": "D"
            }
        ]
    },
    "widget_type": "zform"
}
```

When users click on the buttons, **generic** click
handlers automatically simulate a client reply using
a field called `reply` (in `choices`) as the content
of the message reply. Then the bot sees the reply
and grades the answer using ordinary chat-bot coding.

The beautiful thing is that any third party developer
can enhance bots that are similar to the **trivia_quiz**
bot without touching any Zulip code, because **zforms**
are completely generic.

## Data flow

We can walk through the steps from the bot generating
the **zform** to the client rendering it.

First,
[here](https://github.com/zulip/python-zulip-api/blob/main/zulip_bots/zulip_bots/bots/trivia_quiz/trivia_quiz.py)
is the code that produces the JSON.

```py
def format_quiz_for_widget(quiz_id: str, quiz: Dict[str, Any]) -> str:
    widget_type = 'zform'
    question = quiz['question']
    answers = quiz['answers']

    heading = quiz_id + ': ' + question

    def get_choice(letter: str) -> Dict[str, str]:
        answer = answers[letter]
        reply = 'answer ' + quiz_id + ' ' + letter

        return dict(
            type='multiple_choice',
            short_name=letter,
            long_name=answer,
            reply=reply,
        )

    choices = [get_choice(letter) for letter in 'ABCD']

    extra_data = dict(
        type='choices',
        heading=heading,
        choices=choices,
    )

    widget_content = dict(
        widget_type=widget_type,
        extra_data=extra_data,
    )
    payload = json.dumps(widget_content)
    return payload
```

The above code processes data that is specific to a trivia
quiz, but it follows a generic schema.

The bot sends the JSON payload to the server using the
`send_reply` callback.

The bot framework looks for the optional `widget_content`
parameter in `send_reply` and includes that in the
message payload it sends to the server.

The server validates the schema of `widget_content` using
`check_widget_content`.

Then code inside of `zerver/lib/widget.py` builds a single
`SubMessage` row to contain the **zform** payload, and the
server also sends this payload to all clients who are
recipients of the parent message.

When the message gets to the client, the codepath for **zform**
is actually quite similar to what happens with a more
customized widget like **poll**. (In fact, **zform** is a
sibling of **poll** and **zform** just has a somewhat more
generic job to do.) In `web/src/widgetize.ts` you will see
where this code converges, with snippets like this:

```js
widgets.poll = poll_widget;
widgets.todo = todo_widget;
widgets.zform = zform;
```

The code in `web/src/zform.ts` renders the form (not
shown here) and then sets up a click handler like below:

```js
    $elem.find('button').on('click', function (e) {
        e.stopPropagation();

        // Grab our index from the markup.
        var idx = $(e.target).attr('data-idx');

        // Use the index from the markup to dereference our
        // data structure.
        var reply_content = data.choices[idx].reply;

        transmit.reply_message(
            opts.message,
            reply_content,
        );
    });
```

And then we are basically done!
```

--------------------------------------------------------------------------------

---[FILE: continuous-integration.md]---
Location: zulip-main/docs/testing/continuous-integration.md

```text
# Continuous integration (CI)

The Zulip server uses [GitHub Actions](https://docs.github.com/en/actions) for continuous
integration. GitHub Actions runs frontend, backend and end-to-end production
installer tests. This page documents useful tools and tips when using
GitHub Actions and debugging issues with it.

## Goals

The overall goal of our CI is to avoid regressions and minimize the
total time spent debugging Zulip. We do that by trying to catch as
many possible future bugs as possible, while minimizing both latency
and false positives, both of which can waste a lot of developer time.
There are a few implications of this overall goal:

- If a test is failing nondeterministically in CI, we consider that to
  be an urgent problem.
- If the tests become a lot slower, that is also an urgent problem.
- Everything we do in CI should also have a way to run it quickly
  (under 1 minute, preferably under 3 seconds), in order to iterate fast
  in development. Except when working on the CI configuration itself, a
  developer should never have to repeatedly wait 10 minutes for a full CI
  run to iteratively debug something.

## GitHub Actions

### Useful debugging tips and tools

- GitHub Actions stores timestamps for every line in the logs. They
  are hidden by default; you can see them by toggling the
  `Show timestamps` option in the menu on any job's log page. (You can
  get this sort of timestamp in a development environment by piping
  output to `ts`).

- GitHub Actions runs on every branch you push on your Zulip fork.
  This is helpful when debugging something complicated.

- You can also ssh into a container to debug failures. SSHing into
  the containers can be helpful, especially in rare cases where the
  tests are passing in your computer but failing in the CI. There are
  various
  [Actions](https://github.com/marketplace?type=actions&query=debug+ssh)
  available on GitHub Marketplace to help you SSH into a container. Use
  whichever you find easiest to set up.

### Suites

We run multiple jobs during a GitHub Actions build to efficiently run
Zulip's various test suites, some of them multiple times because we
support multiple versions of the base OS. See the [Actions
tabs](https://github.com/zulip/zulip/actions) for full list of Actions
that we run.

Files which define GitHub workflows live in `.github/workflows` directory.
`zulip-ci.yml` is the main file where most of the tests are run.
`production-suite.yml` builds a Zulip release tarball, which is
then installed in a fresh container. Various Nagios and other
checks are run to confirm the installation worked.

`zulip-ci.yml` is designed to run our main test suites on all of our
supported platforms. Out of them, only one of them runs the frontend
tests, since `puppeteer` is slow and unlikely to catch issues that
depend on the version of the base OS and/or Python. Similarly, only a
(different) one runs the documentation tests.

Our code for running the tests in CI lives under `tools/ci`; but that
logic is mostly thin wrappers around [Zulip's test
suites](testing.md) or production installer.

The `Legacy OS` tests are designed to ensure we give good error
messages when trying to upgrade Zulip servers running on very old base
OS versions with EOL Python versions that Zulip no longer supports.

### Configuration

The remaining details in this section are primarily relevant for doing
development on our CI system and/or provisioning process.

The first key of the job section is `docker`. The docker key specifies
the image GitHub Actions should get from [Docker Hub][docker-hub] for running
the job. Once GitHub Actions fetches the image from Docker Hub, it will spin
up a docker container. See [images](#images) section to know more about
the images we use in GitHub Actions for testing.

[docker-hub]: https://hub.docker.com/r/zulip/ci

After booting the container from the configured image, GitHub Actions will
create the directory mentioned in `working_directory` and all the
steps will be run from here.

The `steps` section describes everything: fetching the Zulip
code, provisioning, fetching caught data, running tests and uploading
coverage reports. The steps with prefix `*` reference aliases, which
are defined in the `aliases` section at the top of the file.

### Images

GitHub Actions tests are run in containers that are spun off from the
images maintained by Zulip team. The Docker images can be generated by
running `tools/ci/build-docker-images`; see instructions at the top of
`tools/ci/Dockerfile` for more information.

### Performance optimizations

#### Caching

An important element of making GitHub Actions perform effectively is caching
between jobs the various caches that live under `/srv/` in a Zulip
development or production environment. In particular, we cache the
following:

- Python virtualenvs
- node_modules directories

This has a huge impact on the performance of running tests in GitHub Actions
CI; without these caches, the average test time would be several times
longer.

We have designed these caches carefully (they are also used in
production and the Zulip development environment) to ensure that each
is named by a hash of its dependencies and ubuntu distribution name,
so Zulip should always be using the same version of dependencies it
would have used had the cache not existed. In practice, bugs are
always possible, so be mindful of this possibility.

A consequence of this caching is that test jobs for branches which
modify `package.json`, `pyproject.toml`, and other key dependencies
will be significantly slower than normal, because they won't get to
benefit from the cache.
```

--------------------------------------------------------------------------------

---[FILE: index.md]---
Location: zulip-main/docs/testing/index.md

```text
# Code testing

```{toctree}
---
maxdepth: 3
---

testing
linters
testing-with-django
testing-with-node
testing-with-puppeteer
mypy
typescript
continuous-integration
manual-testing
philosophy
```
```

--------------------------------------------------------------------------------

````
