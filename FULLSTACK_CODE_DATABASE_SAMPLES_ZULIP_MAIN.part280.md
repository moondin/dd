---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 280
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 280 of 1290)

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

---[FILE: onboarding-steps.md]---
Location: zulip-main/docs/subsystems/onboarding-steps.md

```text
# Onboarding Steps

Onboarding steps introduce users to important UI elements. They are an
effective means of providing context where Zulip's UI may not be self-evident.

Currently, an onboarding step is a one-time notice in the form of a banner or modal.
Previously, hotspots were another type of onboarding step available.

## Configuring a New Onboarding Step

...is easy! If you think highlighting a certain UI element would improve
Zulip's user experience, we welcome you to [open an issue](https://github.com/zulip/zulip/issues/new?title=onboarding_step_request:) for discussion.

### Step 1: Add the Onboarding Step Name

In `zerver/lib/onboarding_steps.py`, add the new onboarding step name to the
`ONE_TIME_NOTICES` list:

```python
ONE_TIME_NOTICES: List[OneTimeNotice] = [
    ...
    OneTimeNotice(
        name="Provide a concise name",
    ),
]
```

### Step 2: Display the Onboarding Step

When the UI element that is not self-evident appears, use the
`ONE_TIME_NOTICES_TO_DISPLAY` data structure from `web/src/onboarding_steps.ts`
and the onboarding step name added in **Step 1** to determine if the
one-time notice should be displayed. Display the notice.

### Step 3: Mark the Onboarding Step as Read

Once the notice is displayed, use the `post_onboarding_step_as_read` function
from `web/src/onboarding_steps.ts` to mark the onboarding step as read.
This will update `ONE_TIME_NOTICES_TO_DISPLAY` so that the user will not see
the notice again.
```

--------------------------------------------------------------------------------

---[FILE: performance.md]---
Location: zulip-main/docs/subsystems/performance.md

```text
# Performance and scalability

This page aims to give some background to help prioritize work on the
Zulip's server's performance and scalability. By scalability, we mean
the ability of the Zulip server on given hardware to handle a certain
workload of usage without performance materially degrading.

First, a few notes on philosophy.

- We consider it an important technical goal for Zulip to be fast,
  because that's an important part of user experience for a real-time
  collaboration tool like Zulip. Many UI features in the Zulip web app
  are designed to load instantly, because all the data required for
  them is present in the initial HTTP response, and both the Zulip
  API and web app are architected around that strategy.
- The Zulip database model and server implementation are carefully
  designed to ensure that every common operation is efficient, with
  automated tests designed to prevent the accidental introductions of
  inefficient or excessive database queries. We much prefer doing
  design/implementation work to make requests fast over the operational
  work of running 2-5x as much hardware to handle the same load.

See also [scalability for production users](../production/requirements.md#scalability).

## Load profiles

When thinking about scalability and performance, it's
important to understand the load profiles for production uses.

Zulip servers typically involve a mixture of two very different types
of load profiles:

- Open communities like open source projects, online classes,
  etc. have large numbers of users, many of whom are idle. (Many of
  the others likely stopped by to ask a question, got it answered, and
  then didn't need the community again for the next year). Our own
  [Zulip development community](https://zulip.com/development-community/) is a good
  example for this, with more than 15K total user accounts, of which
  only several hundred have logged in during the last few weeks.
  Zulip has many important optimizations, including [soft
  deactivation](sending-messages.md#soft-deactivation)
  to ensure idle users have minimal impact on both server-side
  scalability and request latency.
- Fulltime teams, like your typical corporate Zulip installation,
  have users who are mostly active for multiple hours a day and sending a
  high volume of messages each. This load profile is most important
  for self-hosted servers, since many of those are used exclusively by
  the employees of the organization running the server.

The zulip.com load profile is effectively the sum of thousands of
organizations from each of those two load profiles.

## Major Zulip endpoints

It's important to understand that Zulip has a handful of endpoints
that result in the vast majority of all server load, and essentially
every other endpoint is not important for scalability. We still put
effort into making sure those other endpoints are fast for latency
reasons, but were they to be 10x faster (a huge optimization!), it
wouldn't materially improve Zulip's scalability.

For that reason, we organize this discussion of Zulip's scalability
around the several specific endpoints that have a combination of
request volume and cost that makes them important.

That said, it is important to distinguish the load associated with an
API endpoint from the load associated with a feature. Almost any
significant new feature is likely to result in its data being sent to
the client in `page_params` or `GET /messages`, i.e. one of the
endpoints important to scalability here. As a result, it is important
to thoughtfully implement the data fetch code path for every feature.

Furthermore, a snappy user interface is one of Zulip's design goals, and
so we care about the performance of any user-facing code path, even
though many of them are not material to scalability of the server.
But when an optimization only saves a few milliseconds that would be
invisible to the end user, and carries any cost in code readability,
the optimization is worth considering only if it applies to
the major endpoints listed below.

In Zulip's documentation, our general rule is to primarily write facts
that are likely to remain true for a long time. While the numbers
presented here vary with hardware, usage patterns, and time (there's
substantial oscillation within a 24 hour period), we expect the rough
sense of them (as well as the list of important endpoints) is not
likely to vary dramatically over time.

| Endpoint                | Average time | Request volume | Average impact |
| ----------------------- | ------------ | -------------- | -------------- |
| POST /users/me/presence | 25ms         | 36%            | 9000           |
| GET /messages           | 70ms         | 3%             | 2100           |
| GET /                   | 300ms        | 0.3%           | 900            |
| GET /events             | 2ms          | 44%            | 880            |
| GET /user_uploads/\*    | 12ms         | 5%             | 600            |
| POST /messages/flags    | 25ms         | 1.5%           | 375            |
| POST /messages          | 40ms         | 0.5%           | 200            |
| POST /users/me/\*       | 50ms         | 0.04%          | 20             |

The "Average impact" above is computed by multiplying request volume
by average time; this tells you roughly that endpoint's **relative**
contribution to the steady-state total CPU load of the system. It's
not precise -- waiting for a network request is counted the same as
active CPU time, but it's extremely useful for providing intuition for
what code paths are most important to optimize, especially since
network wait is in practice largely waiting for PostgreSQL or
memcached to do work.

As one can see, there are two categories of endpoints that are
important for scalability: those with extremely high request volumes,
and those with moderately high request volumes that are also
expensive. It doesn't matter how expensive, for example,
`POST /users/me/subscriptions` is for scalability, because the volume
is negligible.

### Tornado

Zulip's Tornado-based [real-time push
system](events-system.md), and in particular
`GET /events`, accounts for something like 50% of all HTTP requests to
a production Zulip server. Despite `GET /events` being extremely
high-volume, the typical request takes 1-3ms to process, and doesn't
use the database at all (though it will access `memcached` and
`redis`), so they aren't a huge contributor to the overall CPU usage
of the server.

Because these requests are so efficient from a total CPU usage
perspective, Tornado is significantly less important than other
services like Presence and fetching message history for overall CPU
usage of a Zulip installation.

It's worth noting that most (~80%) Tornado requests end the
longpolling via a `heartbeat` event, which are issued to idle
connections after about a minute. These `heartbeat` events are
useless aside from avoiding problems with networks/proxies/NATs that
are configured poorly and might kill HTTP connections that have been
idle for a minute. It's likely that with some strategy for detecting
such situations, we could reduce their volume (and thus overall
Tornado load) dramatically.

Currently, Tornado is sharded by realm, and optionally by user-id
within each realm. Sharding by realm is sufficient for arbitrary
scaling of the number of organizations on a multi-tenant system like
zulip.com. Sharding by user-id is necessary for very large
organizations with multiple thousands of active users at once.

### Presence

`POST /users/me/presence` requests, which submit the current user's
presence information and return the information for all other active
users in the organization, account for about 36% of all HTTP requests
on production Zulip servers. See the [presence API
documentation](https://zulip.com/api/update-presence) for details on
this system and how it's optimized. For this article, it's important
to know that presence is one of the most important scalability
concerns for any chat system, because it cannot be cached long, and is
structurally a quadratic problem.

Because typical presence requests consume 10-50ms of server-side
processing time (to fetch and send back live data on all other active
users in the organization), and are such a high volume, presence is
the single most important source of steady-state load for a Zulip
server. This is true for most other chat server implementations as
well.

There is an ongoing [effort to rewrite the data model for
presence](https://github.com/zulip/zulip/pull/16381) that we expect to
result in a substantial improvement in the per-request and thus total
load resulting from presence requests.

### Fetching page_params

The request to generate the `page_params` portion of `GET /`
(equivalent to the response from [GET
/api/v1/register](https://zulip.com/api/register-queue) used by
mobile/terminal apps) is one of Zulip's most complex and expensive.

Zulip is somewhat unusual among web apps in sending essentially all of the
data required for the entire Zulip web app in this single request,
which is part of why the Zulip web app loads very quickly -- one only
needs a single round trip aside from cacheable assets (avatars, images, JS,
CSS). Data on other users in the organization, channels, supported
emoji, custom profile fields, etc., is all included. The nice thing
about this model is that essentially every UI element in the Zulip
client can be rendered immediately without paying latency to the
server; this is critical to Zulip feeling performant even for users
who have a lot of latency to the server.

There are only a few exceptions where we fetch data in a separate AJAX
request after page load:

- Message history is managed separately; this is why the Zulip web app will
  first render the entire site except for the middle panel, and then a
  moment later render the middle panel (showing the message history).
- A few very rarely accessed data sets like [message edit
  history](https://zulip.com/help/view-a-messages-edit-history) are
  only fetched on demand.
- A few data sets that are only required for administrative settings
  pages are fetched only when loading those parts of the UI.

Requests to `GET /` and `/api/v1/register` that fetch `page_params`
are pretty rare -- something like 0.3% of total requests, but are
important for scalability because (1) they are the most expensive read
requests the Zulip API supports and (2) they can come in a thundering
herd around server restarts (as discussed in [fetching message
history](#fetching-message-history).

The cost for fetching `page_params` varies dramatically based
primarily on the organization's size, varying from 90ms-300ms for a
typical organization but potentially multiple seconds for large open
organizations with 10,000s of users. There is also smaller
variability based on a individual user's personal data state,
primarily in that having 10,000s of unread messages results in a
somewhat expensive query to find which channels/topics those are in.

We consider any organization having normal `page_params` fetch times
greater than a second to be a bug, and there is ongoing work to fix that.

It can help when thinking about this to imagine `page_params` as what
in another web app would have been 25 or so HTTP GET requests, each
fetching data of a given type (users, channels, custom emoji, etc.); in
Zulip, we just do all of those in a single API request. In the
future, we will likely move to a design that does much of the database
fetching work for different features in parallel to improve latency.

For organizations with 10K+ users and many default channels, the
majority of time spent constructing `page_params` is spent marshalling
data on which users are subscribed to which channels, which is an area
of active optimization work.

### Fetching message history

Bulk requests for message content and metadata
([`GET /messages`](https://zulip.com/api/get-messages)) account for
~3% of total HTTP requests. The zulip web app has a few major reasons
it does a large number of these requests:

- Most of these requests are from users clicking into different views
  -- to avoid certain subtle bugs, Zulip's web app currently fetches
  content from the server even when it has the history for the
  relevant channel/topic cached locally.
- When a browser opens the Zulip web app, it will eventually fetch and
  cache in the browser all messages newer than the oldest unread
  message in a non-muted context. This can be in total extremely
  expensive for users with 10,000s of unread messages, resulting in a
  single browser doing 100 of these requests.
- When a new version of the Zulip server is deployed, every browser
  will reload within 30 minutes to ensure they are running the latest
  code. For installations that deploy often like chat.zulip.org and
  zulip.com, this can result in a thundering herd effect for both `/`
  and `GET /messages`. A great deal of care has been taking in
  designing this [auto-reload
  system](hashchange-system.md#server-initiated-reloads)
  to spread most of that herd over several minutes.

Typical requests consume 20-100ms to process, much of which is waiting
to fetch message IDs from the database and then their content from
memcached. While not large in an absolute sense, these requests are
expensive relative to most other Zulip endpoints.

Some requests, like full-text search for commonly used words, can be
more expensive, but they are sufficiently rare in an absolute sense so
as to be immaterial to the overall scalability of the system.

This server-side code path is already heavily optimized on a
per-request basis. However, we have technical designs for optimizing
the overall frequency with which clients need to make these requests
in two major ways:

- Improving [client-side
  caching](https://github.com/zulip/zulip/issues/15131) to allow
  caching of narrows that the user has viewed in the current session,
  avoiding repeat fetches of message content during a given session.
- Adjusting the behavior for clients with 10,000s of unread messages
  to not fetch as much old message history into the cache. See [this
  issue](https://github.com/zulip/zulip/issues/16697) for relevant
  design work.

Together, it is likely that these changes will reduce the total
scalability cost of fetching message history dramatically.

### User uploads

Requests to fetch uploaded files (including user avatars) account for
about 5% of total HTTP requests. Zulip spends consistently ~10-15ms
processing one of these requests (mostly authorization logic), before
handing off delivery of the file to `nginx` (which may itself fetch
from S3, depending on the configured [upload
backend](../production/upload-backends.md)).

### Sending and editing messages

[Sending new messages](sending-messages.md) (including
incoming webhooks) represents less than 0.5% of total request volume.
That this number is small should not be surprising even though sending
messages is intuitively the main feature of a chat service: a message
sent to 50 users triggers ~50 `GET /events` requests.

A typical message-send request takes 20-70ms, with more expensive
requests typically resulting from [Markdown
rendering](markdown.md) of more complex syntax. As a
result, these requests are not material to Zulip's scalability.
Editing messages and adding emoji reactions are very similar to
sending them for the purposes of performance and scalability, since
the same clients need to be notified, and these requests are lower in volume.

That said, we consider the performance of these endpoints to be some
of the most important for Zulip's user experience, since even with
local echo, these are some of the places where any request processing
latency is highly user-visible.

Typing notifications are slightly higher volume than sending messages,
but are also extremely cheap (~3ms).

### Other endpoints

Other API actions, like subscribing to a channel, editing settings,
registering an account, etc., are vanishingly rare compared to the
requests detailed above, fundamentally because almost nobody changes
these things more than a few dozen times over the lifetime of their
account, whereas everything above are things that a given user might
do thousands of times.

As a result, performance work on those requests is generally only
important for latency reasons, not for optimizing the overall
scalability of a Zulip server.

## Queue processors and cron jobs

The above doesn't cover all of the work that a production Zulip server
does; various tasks like sending outgoing emails or recording the data
that powers [/stats](https://zulip.com/help/analytics) are run by
[queue processors](queuing.md) and cron jobs, not in
response to incoming HTTP requests. In practice, all of these have
been written such that they are immaterial to total load and thus
architectural scalability, though we do from time to time need to do
operational work to add additional queue processors for particularly
high-traffic queues. For all of our queue processors, any
serialization requirements are at most per-user, and thus it would be
straightforward to shard by `user_id` or `realm_id` if required.

## Service scalability

In addition to the above, which just focuses on the total amount of
CPU work, it's also relevant to think about load on infrastructure
services (memcached, redis, rabbitmq, and most importantly postgres),
as well as queue processors (which might get backlogged).

In practice, efforts to make an individual endpoint faster will very
likely reduce the load on these services as well. But it is worth
considering that database time is a more precious resource than
Python/CPU time (being harder to scale horizontally).

Most optimizations to make an endpoint cheaper will start with
optimizing the database queries and/or employing
[caching](caching.md), and then continue as needed with
profiling of the Python code and any memcached queries.

For a handful of the critical code paths listed above, we further
optimize by skipping the Django ORM (which has substantial overhead)
for narrow sections; typically this is sufficient to result in the
database query time dominating that spent by the Python application
server process.

Zulip's [server logs](logging.md) are designed to
provide insight when a request consumes significant database or
memcached resources, which is useful both in development and in
production.
```

--------------------------------------------------------------------------------

---[FILE: pointer.md]---
Location: zulip-main/docs/subsystems/pointer.md

```text
# Unread counts and the pointer

When you're using Zulip and you reload, or narrow to a channel, how
does Zulip decide where to place you?

Conceptually, Zulip takes you to the place where you left off
(e.g., the first unread message), not the most recent messages, to
facilitate reviewing all the discussions that happened while you were
away from your computer. The scroll position is then set to keep that
message in view and away from both the top and bottom of the visible
section of messages.

But there a lot of details around doing this right, and around
counting unread messages. Here's how Zulip currently decides which
message to select, along with some notes on improvements we'd like to
make to the model.

First a bit of terminology:

- "Narrowing" is the process of filtering to a particular subset of
  the messages the user has access to.

- The blue cursor box (the "pointer") is around is called the
  "selected" message. Zulip ensures that the currently selected
  message is always in-view.

## Pointer logic

### Recipient bar: message you clicked

If you enter a narrow by clicking on a message group's _recipient bar_
(channel/topic or direct message recipient list at the top of a group
of messages), Zulip will select the message you clicked on. This
provides a nice user experience where you get to see the stuff near
what you clicked on, and in fact the message you clicked on stays at
exactly the same scroll position in the window after the narrowing as
it was at before.

### Search, sidebar click, or new tab: unread/recent matching narrow

If you instead narrow by clicking on something in the left sidebar,
typing some terms into the search box, reloading the browser, or any
other method that doesn't encode a specific message to visit, Zulip
will instead select the first unread message matching that narrow, or
if there are none, the most recent messages matching that narrow.

This provides the nice user experience of taking you to the start of
the new stuff (with enough messages you've seen before still in view
at the top to provide you with context), which is usually what you
want. (When finding the "first unread message", Zulip ignores unread
messages in muted channels or in muted topics within non-muted
channels.)

### Unnarrow: previous sequence

When you unnarrow using, for example, the `a` key, you will automatically be
taken to the same message that was selected in the Combined feed view before
you narrowed, unless in the narrow you read new messages, in which
case you will be jumped forward to the first unread and non-muted
message in the Combined feed view (or the bottom of the feed if there is
none). This makes for a nice experience reading threads via the Combined feed
view in sequence.

### Forced reload: state preservation

When the server forces a reload of a browser that's otherwise caught
up (which happens within 30 minutes when a new version of the server
is deployed, usually at a type when the user isn't looking at the
browser), Zulip will preserve the state -- what (if any) narrow the
user was in, the selected message, and even exact scroll position!

For more on the user experience philosophy guiding these decisions,
see [the architectural overview](../overview/architecture-overview.md).

## Unread count logic

How does Zulip decide whether a message has been read by the user?
The algorithm needs to correctly handle a range of ways people might
use the product. The algorithm is as follows:

- Any message which is selected or above a message which is selected
  is marked as read. So messages are marked as read as you scroll
  down the keyboard when the pointer passes over them.

- If the whitespace at the very bottom of the feed is in view, all
  messages in view are marked as read.

These two simple rules, combined with the pointer logic above, end up
matching user expectations well for whether the product should treat
them as having read a set of messages (or not).

One key detail to highlight is that we only mark messages as read
through these processes in views that contain all messages in a
thread; search views will never mark messages as read.

## Testing and development

In a Zulip development environment, you can use
`manage.py mark_all_messages_unread` to set every user's pointer to 0
and all messages as unread, for convenience in testing unread count
related logic.

It can be useful to combine this with `manage.py populate_db -n 3000`
(which rebuilds the database with 3000 initial messages) to ensure a
large number of messages are present.
```

--------------------------------------------------------------------------------

---[FILE: queuing.md]---
Location: zulip-main/docs/subsystems/queuing.md

```text
# Queue processors

Zulip uses RabbitMQ to manage a system of internal queues. These are
used for a variety of purposes:

- Asynchronously doing expensive operations like sending email
  notifications which can take seconds per email and thus would
  otherwise time out when 100s are triggered at once (e.g., inviting a
  lot of new users to a realm).

- Asynchronously doing non-time-critical somewhat expensive operations
  like updating analytics tables (e.g., UserActivityInternal) which
  don't have any immediate runtime effect.

- Communicating events to push to clients (browsers, etc.) from the
  main Zulip Django application process to the Tornado-based events
  system. Example events might be that a new message was sent, a user
  has changed their subscriptions, etc.

- Processing mobile push notifications and email mirroring system
  messages.

- Processing various errors, frontend tracebacks, and slow database
  queries in a batched fashion.

Needless to say, the RabbitMQ-based queuing system is an important
part of the overall Zulip architecture, since it's in critical code
paths for everything from signing up for account, to rendering
messages, to delivering updates to clients.

We use the `pika` library to interface with RabbitMQ, using a simple
custom integration defined in `zerver/lib/queue.py`.

### Adding a new queue processor

To add a new queue processor:

- Define the processor in `zerver/worker/` using the `@assign_queue` decorator;
  it's pretty easy to get the template for an existing similar queue
  processor. This suffices to test your queue worker in the Zulip development
  environment (`tools/run-dev` will automatically restart the queue processors
  and start running your new queue processor code). You can also run a single
  queue processor manually using, for example,
  `./manage.py process_queue --queue=user_activity`.

- So that supervisord will know to run the queue processor in
  production, you will need to add to the `queues` variable in
  `puppet/zulip/manifests/app_frontend_base.pp`; the list there is
  used to generate `/etc/supervisor/conf.d/zulip.conf`.

The queue will automatically be added to the list of queues tracked by
`scripts/nagios/check-rabbitmq-consumers`, so Nagios can properly
check whether a queue processor is running for your queue. You still
need to update the sample Nagios configuration in `puppet/kandra`
manually.

### Publishing events into a queue

You can publish events to a RabbitMQ queue using the
`queue_event_on_commit` function defined in `zerver/lib/queue.py`.

An interesting challenge with queue processors is what should happen
when queued events in Zulip's backend tests. Our current solution is
that in the tests, `queue_event_on_commit` will (by default) simple call
the `consume` method for the relevant queue processor. However,
`queue_event_on_commit` also supports being passed a function that should
be called in the tests instead of the queue processor's `consume`
method. Where possible, we prefer the model of calling `consume` in
tests since that's more predictable and automatically covers the queue
processor's code path, but it isn't always possible.

### Clearing a RabbitMQ queue

If you need to clear a queue (delete all the events in it), run
`./manage.py purge_queue <queue_name>`, for example:

```bash
./manage.py purge_queue user_activity
```

You can also use the amqp tools directly. Install `amqp-tools` from
apt and then run:

```bash
amqp-delete-queue --username=zulip --password='...' --server=localhost \
   --queue=user_activity
```

with the RabbitMQ password from `/etc/zulip/zulip-secrets.conf`.
```

--------------------------------------------------------------------------------

---[FILE: realms.md]---
Location: zulip-main/docs/subsystems/realms.md

```text
# Realms in Zulip

Zulip allows multiple _realms_ to be hosted on a single instance.
Realms are the Zulip codebase's internal name for what we refer to in
user-facing documentation as an organization (the name "realm" comes
from [Kerberos](https://web.mit.edu/kerberos/)).

Wherever possible, we avoid using the term `realm` in any user-facing
string or documentation; "Organization" is the equivalent term used in
those contexts (and we have linters that attempt to enforce this rule
in translatable strings). We may in the future modify Zulip's
internals to use `organization` instead.

The
[production docs on multiple realms](../production/multiple-organizations.md)
are also relevant reading.

## Creating realms

There are two main methods for creating realms.

- Using unique link generator
- Enabling open realm creation

#### Using unique link generator

```bash
./manage.py generate_realm_creation_link
```

The above command will output a URL which can be used for creating a
new realm and an administrator user for that realm. The link expires
after the creation of the realm. The link also expires if not used
within 7 days. The expiration period can be changed by modifying
`CAN_CREATE_REALM_LINK_VALIDITY_DAYS` in settings.py.

## Subdomains

One can host multiple realms in a Zulip server by giving each realm a
unique subdomain of the main Zulip server's domain. For example, if
the Zulip instance is hosted at zulip.example.com, and the subdomain
of your organization is acme you can would acme.zulip.example.com for
accessing the organization.

For subdomains to work properly, you also have to change your DNS
records so that the subdomains point to your Zulip installation IP. An
`A` record with host name value `*` pointing to your IP should do the
job.

We also recommend upgrading to at least Zulip 1.7, since older Zulip
releases had much less nice handling for subdomains. See our
[docs on using subdomains](../production/multiple-organizations.md) for
user-facing documentation on this.

### Working with subdomains in development environment

Zulip's development environment is designed to make it convenient to
test the various Zulip configurations for different subdomains:

- Realms are subdomains on `*.zulipdev.com`, just like `*.zulipchat.com`.
- The root domain (like `zulip.com` itself) is `zulipdev.com` itself.
- The default realm is hosted on `localhost:9991` rather than
  `zulip.zulipdev.com`, using the [`REALM_HOSTS`
  feature](../production/multiple-organizations.md) feature.

Details are below.

By default, Linux does not provide a convenient way to use subdomains
in your local development environment. To solve this problem, we use
the **zulipdev.com** domain, which has a wildcard A record pointing to
127.0.0.1. You can use zulipdev.com to connect to your Zulip
development server instead of localhost. The default realm with the
Shakespeare users has the subdomain `zulip` and can be accessed by
visiting **zulip.zulipdev.com**.

If you are behind a **proxy server**, this method won't work. When you
make a request to load zulipdev.com in your browser, the proxy server
will try to get the page on your behalf. Since zulipdev.com points
to 127.0.0.1 the proxy server is likely to give you a 503 error. The
workaround is to disable your proxy for `*.zulipdev.com`. The DNS
lookup should still work even if you disable proxy for
\*.zulipdev.com. If it doesn't you can add zulipdev.com records in
`/etc/hosts` file. The file should look something like this.

```text
127.0.0.1    localhost

127.0.0.1    zulipdev.com

127.0.0.1    zulip.zulipdev.com

127.0.0.1    testsubdomain.zulipdev.com
```

These records are also useful if you want to, for example, run the
Puppeteer tests when you are not connected to the Internet.
```

--------------------------------------------------------------------------------

---[FILE: release-checklist.md]---
Location: zulip-main/docs/subsystems/release-checklist.md

```text
# Zulip server release checklist

This document has reminders of things one might forget to do when
preparing a new release.

### A week before the release

- _Major releases only (e.g., 4.0):_
  - Upgrade all Python dependencies in
    `requirements` to latest upstream versions so they can burn in (use
    `pip list --outdated`).
  - Upgrade all puppet dependencies in `puppet/deps.yaml`
  - Upgrade all puppet-installed dependencies (e.g., Smokescreen, go,
    etc) in `puppet/zulip/manifests/common.pp`
  - [Post a message to
    Weblate](https://hosted.weblate.org/projects/zulip/#announcement)
    inviting translators to translate new strings.
  - Merge draft updates to the [changelog](../overview/changelog.md)
    with changes since the last release. While doing so, take notes on
    things that might need follow-up work or documentation before we
    can happily advertise them in a release blog post.
- Create a burn-down list of issues that need to be fixed before we can
  release, and make sure all of them are being worked on.
- Draft the release blog post (a.k.a. the release notes) in Paper. In
  it, list the important changes in the release, from most to least
  notable.

### Final release preparation

- Update the Paper blog post draft with any new commits.
- Merge updated translations from Weblate (using the appropriate
  branch for the release).
- Use `build-release-tarball` to generate a pre-release tarball.
- Test the new tarball extensively, both new install and upgrade from last
  release, on Ubuntu 22.04.
- Repeat until release is ready.
- Send around the Paper blog post draft for review.
- Move the blog post draft to Astro:
  - Use "··· > Export > Markdown" to get a pretty good Markdown
    conversion, and save it in `src/posts` with a filename appropriate
    for a URL slug.
  - Add the needed YAML frontmatter.
  - Move any images into `public` and update their references.
  - Proofread, especially for formatting.
  - If the draft post should remain secret until release, avoid using
    a guessable Git branch name for the pull request (the deployment
    preview URL is based on the branch name).
- _Major releases only (e.g., 4.0):_ Schedule team members to provide
  extra responsive #production help support following the release.

### Executing the release

- Create the release commit, on `main` (for major releases) or on the
  release branch (for minor releases):
  - Copy the Markdown release notes for the release into
    `docs/overview/changelog.md`.
  - Verify the changelog passes lint, and has the right release date.
  - _Major releases only:_ Adjust the `changelog.md` heading to have
    the stable release series boilerplate.
  - Update `ZULIP_VERSION` and `LATEST_RELEASE_VERSION` in `version.py`.
  - _Major releases only:_ Update `API_FEATURE_LEVEL` to a feature
    level for the final release, and document a reserved range.
- Run `tools/release` with the release version.
- Update the [Docker image](https://github.com/zulip/docker-zulip):
  - Commit the Docker updates:
    - Update `ZULIP_GIT_REF` in `Dockerfile`
    - Update `README.md`
    - Update the image in `docker-compose.yml`, as well as the `ZULIP_GIT_REF`
  - Commit the Helm updates:
    - Add a new entry to `kubernetes/chart/zulip/CHANGELOG.md`
    - Update the `appVersion` in `kubernetes/chart/zulip/Chart.yaml`
    - Update the `tag` in `kubernetes/chart/zulip/values.yaml`
    - Update the docs by running `helm-docs`
    - Update the `image` in `kubernetes/manual/zulip-rc.yml`
  - Build the image: `docker build --pull . -t zulip/docker-zulip:4.11-0 --no-cache`
  - Also tag it with `latest`: `docker build . -t zulip/docker-zulip:latest`
  - Push those tags: `docker push zulip/docker-zulip:4.11-0; docker push zulip/docker-zulip:latest`
  - Push the commits to `main`.
- Merge the blog post PR.
- Announce the release, pointing to the blog post, via:
  - Email to [zulip-announce](https://groups.google.com/g/zulip-announce)
  - Email to [zulip-blog-announce](https://groups.google.com/a/zulip.com/g/zulip-blog-announce)
  - Message in [#announce](https://chat.zulip.org/#narrow/channel/1-announce)
  - Tweet from [@zulip](https://x.com/zulip).
  - Toot from [fosstodon.org/@zulip](https://fosstodon.org/@zulip)

### Post-release

- The DigitalOcean one-click image will report in an internal channel
  once it is built, and how to test it. Verify it, then publish it to
  DigitalOcean marketplace.
- _Major releases only:_
  - Create a release branch (e.g., `4.x`).
  - On the release branch, update `ZULIP_VERSION` in `version.py` to
    the present release with a `+git` suffix, e.g., `4.0+git`.
  - On `main`, update `ZULIP_VERSION` to the future major release with
    a `-dev+git` suffix, e.g., `5.0-dev+git`. Make a Git tag for this
    update commit with a `-dev` suffix, e.g., `5.0-dev`. Push the tag
    to both zulip.git and zulip-internal.git to get a correct version
    number for future Cloud deployments.
  - Add the new release to `.github/ISSUE_TEMPLATE/2_bug_report.md`.
  - Consider removing a few old releases from the issue template and
    ReadTheDocs; we keep about two years of back-versions.
  - Update Weblate to add a component on the release branch for
    Django; then add a parallel Frontend component by using "Duplicate
    this component" on the Django release branch component.
  - In Weblate, remove the previous stable components.
  - Add a new CI production upgrade target:
    - Build a docker image: `cd tools/ci && docker build --pull . -f Dockerfile.prod --build-arg=BASE_IMAGE=zulip/ci:bookworm --build-arg=VERSION=7.0 --tag=zulip/ci:bookworm-7.0 && docker push zulip/ci:bookworm-7.0`
    - Add a new line to the `production_upgrade` matrix in
      `.github/workflows/production-suite.yml`.
  - Update /history page in `templates/corporate/history.md`.
  - Inspect all `TODO/compatibility` comments for whether we can
    remove any backwards-compatibility code following this release.
  - Review possible improvements to API bindings to better match the
    defaults and features of the new release.
- _Minor releases only (e.g., 3.2):_
  - On the release branch, update `ZULIP_VERSION` to the present
    release with a `+git` suffix, e.g., `3.2+git`.
  - On main, update `LATEST_RELEASE_VERSION` with the released
    version, as well as the changelog changes from the release branch.
- _Prereleases only (e.g., 7.0-beta3):_
  - Atop the prerelease commit (e.g., `7.0-beta3`), make a commit
    updating `ZULIP_VERSION` to the prerelease version with a `+git`
    suffix, e.g., `7.0-beta3+git`. Push this to `main`. (If `main` has
    already diverged from the prerelease, a merge commit will be
    needed here.)
  - Delete the prerelease branch (e.g., `7.0-beta3-branch`); it's now
    an ancestor of `main` and thus unnecessary.
```

--------------------------------------------------------------------------------

````
