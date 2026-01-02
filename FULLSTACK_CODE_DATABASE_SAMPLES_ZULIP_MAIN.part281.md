---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 281
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 281 of 1290)

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

---[FILE: schema-migrations.md]---
Location: zulip-main/docs/subsystems/schema-migrations.md

```text
# Schema migrations

Zulip uses the [standard Django system for doing schema
migrations](https://docs.djangoproject.com/en/5.0/topics/migrations/).
There is some example usage in the [new feature
tutorial](../tutorials/new-feature-tutorial.md).

This page documents some important issues related to writing schema
migrations.

- If your database migration is just to reflect new fields in
  `models/*.py`, you'll typically want to just:
  - Rebase your branch before you start (this may save work later).
  - Update the model class definitions in `zerver/models/*.py`.
  - Run `./manage.py makemigrations` to generate a migration file
  - Rename the migration file to have a descriptive name if Django
    generated used a date-based name like `0089_auto_20170710_1353.py`
    (which happens when the changes are to multiple models and Django).
  - `git add` the new migration file
  - Run `tools/provision` to update your local database to apply the
    migrations.
  - Commit your changes.
- For more complicated migrations where you need to run custom Python
  code as part of the migration, it's best to read past migrations to
  understand how to write them well.
  `git grep RunPython zerver/migrations/02*` will find many good
  examples. Before writing migrations of this form, you should read
  Django's docs and the sections below.
- **Numbering conflicts across branches**: If you've done your schema
  change in a branch, and meanwhile another schema change has taken
  place, Django will now have two migrations with the same
  number. There are two easy way to fix this:
  - If your migrations were automatically generated using
    `manage.py makemigrations`, a good option is to just remove your
    migration and rerun the command after rebasing. Remember to
    `git rebase` to do this in the commit that changed `models/*.py`
    if you have a multi-commit branch.
  - If you wrote code as part of preparing your migrations, or prefer
    this workflow, you can use run `./tools/renumber-migrations`,
    which renumbers your migration(s) and fixes up the "dependencies"
    entries in your migration(s). The tool could use a bit of work to
    prompt unnecessarily less, but it will update the working tree for
    you automatically (you still need to do all the `git add`
    commands, etc.).
- **Release branches**: When a release branch needs a migration, but
  `main` already has new migrations, the migration graph must fork.
  The migration should be named and numbered in `main` to follow in
  usual sequence, but its dependency should be set to the last
  migration that exists on the release branch. This should be
  followed, on `main`, by a migration which merges the two resulting
  tips; you can make such a merge with `manage.py makemigrations --merge`.
- **Large tables**: For our very largest tables (e.g., Message and
  UserMessage), we often need to take precautions when adding columns
  to the table, performing data backfills, or building indexes. We
  have a `zerver/lib/migrate.py` library to help with adding columns
  and backfilling data.
- **Adding indexes**. Django's regular `AddIndex` operation (corresponding
  to `CREATE INDEX` in SQL) locks writes to the affected table. This can be
  problematic when dealing with larger tables in particular and we've
  generally preferred to use `AddIndexConcurrently` (corresponding to
  `CREATE INDEX CONCURRENTLY`) to allow the index to be built while
  the server is active.
- **Atomicity**. By default, each Django migration is run atomically
  inside a transaction. This can be problematic if one wants to do
  something in a migration that touches a lot of data and would best
  be done in batches of, for example, 1000 objects (e.g., a `Message` or
  `UserMessage` table change). There is a [useful Django
  feature][migrations-non-atomic] that makes it possible to add
  `atomic=False` at the top of a `Migration` class and thus not have
  the entire migration in a transaction. This should make it possible
  to use the batch update tools in `zerver/lib/migrate.py` (originally
  written to work with South) for doing larger database migrations.
- **No-op migrations**. Django detects model changes that does not
  necessarily lead to a schema change in the database.
  For example, field validators are a part of the Django ORM, but they
  are not stored in the database. When removing such validators from
  an existing model, nothing gets dropped from the database, but Django
  would still generate a migration for that. We prefer to avoid adding
  this kind of no-op migrations. Instead of generating a new migration,
  you'll want to modify the latest migration affecting the field.

- **Accessing code and models in RunPython migrations**. When writing
  a migration that includes custom python code (aka `RunPython`), you
  almost never want to import code from `zerver` or anywhere else in
  the codebase. If you imagine the process of upgrading a Zulip
  server, it goes as follows: first a server admin checks out a recent
  version of the code, and then runs any migrations that were added
  between the last time they upgraded and the current check out. Note
  that for each migration, this means the migration is run using the
  code in the server admin's check out, and not the code that was there at the
  time the migration was written. This can be a difference of
  thousands of commits for installations that are only upgraded
  occasionally. It is hard to reason about the effect of a code change
  on a migration that imported it so long ago, so we recommend just
  copying any code you're tempted to import into the migration file
  directly, and have a linter rule enforcing this.

  There is one special case where this doesn't work: you can't copy
  the definition of a model (like `Realm`) into a migration, and you
  can't import it from `zerver.models` for the reasons above. In this
  situation you should use Django's `apps.get_model` to get access to
  a model as it is at the time of a migration. Note that this will
  work for doing something like `Realm.objects.filter(..)`, but
  shouldn't be used for accessing properties like `Realm.subdomain` or
  anything not related to the Django ORM.

  Another important note is that making changes to the data in a table
  via `RunPython` code and `ALTER TABLE` operations within a single,
  atomic migration don't mix well. If you encounter an error such as

  ```text
  django.db.utils.OperationalError: cannot ALTER TABLE "table_name" because it has pending trigger events
  ```

  when testing the migration, the reason is:

  PostgreSQL prohibits schema changes (e.g., `ALTER TABLE`)
  if there are deferred trigger events still pending.
  Now most Zulip constraints are `DEFERRABLE INITIALLY DEFERRED` which means
  the constraint will not be checked until the transaction is committed,
  and You are not allowed to update, insert, alter or any other query
  that will modify the table without executing all pending triggers which would be
  constraint checking in this case.

  To resolve this, consider making the migration
  non-atomic, splitting it into two migration files (recommended), or replacing the
  `RunPython` logic with pure SQL (though this can generally be difficult).

- **Making large migrations work**. Major migrations should have a
  few properties:

  - **Unit tests**. You'll want to carefully test these, so you might
    as well write some unit tests to verify the migration works
    correctly, rather than doing everything by hand. This often saves
    a lot of time in re-testing the migration process as we make
    adjustments to the plan.
  - **Run in batches**. Updating more than 1K-10K rows (depending on
    type) in a single transaction can lock up a database. It's best
    to do lots of small batches, potentially with a brief sleep in
    between, so that we don't block other operations from finishing.
  - **Rerunnability/idempotency**. Good migrations are ones where if
    operational concerns (e.g., it taking down the Zulip server for
    users) interfere with it finishing, it's easy to restart the
    migration without doing a bunch of hand investigation. Ideally,
    the migration can even continue where it left off, without needing
    to redo work.
  - **Multi-step migrations**. For really big migrations, one wants
    to split the transition into several commits that are each
    individually correct, and can each be deployed independently:

    1. First, do a migration to add the new column to the Message table
       and start writing to that column (but don't use it for anything)
    2. Second, do a migration to copy values from the old column to
       the new column, to ensure that the two data stores agree.
    3. Third, a commit that stops writing to the old field.
    4. Any cleanup work, e.g., if the old field were a column, we'd do
       a migration to remove it entirely here.

    This multi-step process is how most migrations on large database
    tables are done in large-scale systems, since it ensures that the
    system can continue running happily during the migration.

## Automated testing for migrations

Zulip has support for writing automated tests for your database
migrations, using the `MigrationsTestCase` test class. This system is
inspired by [a great blog post][django-migration-test-blog-post] on
the subject.

We have integrated this system with our test framework so that if you
use the `use_db_models` decorator, you can use some helper methods
from `test_classes.py` and friends from inside the tests (which is
normally not possible in Django's migrations framework).

If you find yourself writing logic in a `RunPython` migration, we
highly recommend adding a test using this framework. We may end up
deleting the test later (they can get slow once they are many
migrations away from current), but it can help prevent disaster where
an incorrect migration messes up a database in a way that's impossible
to undo without going to backups.

[django-migration-test-blog-post]: https://www.caktusgroup.com/blog/2016/02/02/writing-unit-tests-django-migrations/
[migrations-non-atomic]: https://docs.djangoproject.com/en/5.0/howto/writing-migrations/#non-atomic-migrations

## Schema and initial data changes

If you follow the processes described above, `tools/provision` and
`tools/test-backend` should detect any changes to the declared
migrations and run migrations on (`./manage.py migrate`) or rebuild
the relevant database automatically as appropriate.

Notably, both `manage.py migrate` (`git grep post_migrate.connect` for
details) and restarting `tools/run-dev` will flush `memcached`, so you
shouldn't have to worry about cached objects from a previous database
schema.

While developing migrations, you may accidentally corrupt your
databases while debugging your new code. You can always rebuild these
databases from scratch:

- Use `tools/rebuild-test-database` to rebuild the database
  used for `test-backend` and other automated tests.

- Use `tools/rebuild-dev-database` to rebuild the database
  used in [manual testing](../development/using.md).
```

--------------------------------------------------------------------------------

---[FILE: sending-messages.md]---
Location: zulip-main/docs/subsystems/sending-messages.md

```text
# Sending messages

While sending a message in a chat product might seem simple, there's a
lot of underlying complexity required to make a professional-quality
experience.

This document aims to explain conceptually what happens when a message
is sent in Zulip, and why that is correct behavior. It assumes the
reader is familiar with our
[real-time sync system](events-system.md) for
server-to-client communication and
[new application feature tutorial](../tutorials/new-feature-tutorial.md),
and we generally don't repeat the content discussed there.

## Message lists

This is just a bit of terminology: A "message list" is what Zulip
calls the frontend concept of a (potentially narrowed) message feed.
There are 3 related structures:

- A `message_list_data` just has the sequencing data of which message
  IDs go in what order.
- A `message_list` is built on top of `message_list_data` and
  additionally contains the data for a visible-to-the-user message list
  (e.g., where trailing bookends should appear, a selected message,
  etc.).
- A `message_list_view` is built on top of `message_list` and
  additionally contains rendering details like a window of up to 400
  messages that is present in the DOM at the time, scroll position
  controls, etc.

(This should later be expanded into a full article on message lists
and narrowing).

## Compose area

The compose box does a lot of fancy things that are out of scope for
this article. But it also does a decent amount of client-side
validation before sending a message off to the server, especially
around mentions (e.g., checking the channel name is a valid channel,
displaying a warning about the number of recipients before a user can
use `@**all**` or mention a user who is not subscribed to the current
channel, etc.).

## Backend implementation

The backend flow for sending messages is similar in many ways to the
process described in our
[new application feature tutorial](../tutorials/new-feature-tutorial.md).
This section details the ways in which it is different:

- There is significant custom code inside the `process_message_event`
  function in `zerver/tornado/event_queue.py`. This custom code has a
  number of purposes:
  - Triggering [email and mobile push
    notifications](notifications.md) for any users who
    do not have active clients and have settings of the form "push
    notifications when offline". In order to avoid doing any real
    computational work inside the Tornado codebase, this logic aims
    to just do the check for whether a notification should be
    generated, and then put an event into an appropriate
    [queue](queuing.md) to actually send the message.
    See `maybe_enqueue_notifications` and `zerver/lib/notification_data.py` for
    this part of the logic.
  - Splicing user-dependent data (e.g., `flags` such as when the user
    was `mentioned`) into the events.
  - Handling the [local echo details](#local-echo).
  - Handling certain client configuration options that affect
    messages. E.g., determining whether to send the
    plaintext/Markdown raw content or the rendered HTML (e.g., the
    `apply_markdown` and `client_gravatar` features in our
    [events API docs](https://zulip.com/api/register-queue)).
- Following our standard naming convention, input validation is done
  inside the `check_message` function in `zerver/actions/message_send.py`, which is responsible for
  validating the user can send to the recipient,
  [rendering the Markdown](markdown.md), etc. --
  basically everything that can fail due to bad user input.
- The core `do_send_messages` function (which handles actually sending
  the message) in `zerver/actions/message_send.py` is one of the most optimized and thus complex parts of
  the system. But in short, its job is to atomically do a few key
  things:
  - Store a `Message` row in the database.
  - Store one `UserMessage` row in the database for each user who is
    a recipient of the message (including the sender), with
    appropriate `flags` for whether the user was mentioned, an alert
    word appears, etc. See
    [the section on soft deactivation](#soft-deactivation) for
    a clever optimization we use here that is important for large
    open organizations.
  - Do all the database queries to fetch relevant data for and then
    send a `message` event to the
    [events system](events-system.md) containing the
    data it will need for the calculations described above. This
    step adds a lot of complexity, because the events system cannot
    make queries to the database directly.
  - Trigger any other deferred work caused by the current message,
    e.g., [outgoing webhooks](https://zulip.com/api/outgoing-webhooks)
    or embedded bots.
  - Every query is designed to be a bulk query; we carefully
    unit-test this system for how many database and memcached queries
    it makes when sending messages with large numbers of recipients,
    to ensure its performance.

## Local echo

An essential feature for a good chat experience is local echo
(i.e. having the message appear in the feed the moment the user hits
send, before the network round trip to the server). This is essential
both for freeing up the compose box (for the user to send more
messages) as well as for the experience to feel snappy.

A sloppy local echo experience (like Google Chat had for over a decade
for emoji) would just render the raw text the user entered in the
browser, and then replace it with data from the server when it
changes.

Zulip aims for a near-perfect local echo experience, which is
why our [Markdown system](markdown.md) requires both
an authoritative (backend) Markdown implementation and a secondary
(frontend) Markdown implementation, the latter used only for the local
echo feature. Read our Markdown documentation for all the tricky
details on how that works and is tested.

The rest of this section details how Zulip manages locally echoed
messages.

- The core function in the frontend codebase
  `echo.try_deliver_locally`. This checks whether correct local echo
  is possible (via `markdown.contains_backend_only_syntax`) and useful
  (whether the message would appear in the current view), and if so,
  causes Zulip to insert the message into the relevant feed(s).
- Since the message hasn't been confirmed by the server yet, it
  doesn't have a message ID. The frontend makes one up, via
  `local_message.get_next_id_float`, by taking the highest message ID it
  has seen and adding the decimal `0.01`. The use of a floating point
  value is critical, because it means the message should sort
  correctly with other messages (at the bottom) and also won't be
  duplicated by a real confirmed-by-the-backend message ID. We choose
  just above the `max_message_id`, because we want any new messages
  that other users send to the current view to be placed after it in
  the feed (this decision is somewhat arbitrary; in any case we'll
  resort it to its proper place once it is confirmed by the server.
  We do it this way to minimize messages jumping around/reordering
  visually).
- The `POST /messages` API request to the server to send the message
  is passed two special parameters that clients not implementing local
  echo don't use: `queue_id` and `local_id`. The `queue_id` is the ID
  of the client's event queue; here, it is used just as a unique
  identifier for the specific client (e.g., a browser tab) that sent
  the message. And the `local_id` is, by the construction above, a
  unique value within that namespace identifying the message.
- The `do_send_messages` backend code path includes the `queue_id` and
  `local_id` in the data it passes to the
  [events system](events-system.md). The events
  system will extend the `message` event dictionary it delivers to
  the client containing the `queue_id` with `local_message_id` field,
  containing the `local_id` that the relevant client used when sending
  the message. This allows the client to know that the `message`
  event it is receiving is the same message it itself had sent.
- Using that information, rather than adding the "new message" to the
  relevant message feed, it updates the (locally echoed) message's
  properties (at the very least, message ID and timestamp) and
  rerenders it in any message lists where it appears. This is
  primarily done in the `process_from_server` function in
  `web/src/echo.ts`.

### Local echo in message editing

Zulip also supports local echo in the message editing code path for
edits to just the content of a message. The approach is analogous
(using `markdown.contains_backend_only_syntax`, etc.), except we
don't need any of the `local_id` tracking logic, because the message
already has a permanent message id; as a result, the whole
implementation was under 150 lines of code.

## Putting it all together

This section just has a brief review of the sequence of steps all in
one place:

- User hits send in the compose box.
- Compose box validation runs; if it passes, the browser locally
  echoes the message and then sends a request to the `POST /messages`
  API endpoint.
- The Django URL routes and middleware run, and eventually call the
  `send_message_backend` view function in `zerver/views/message_send.py`.
  (Alternatively, for an API request to send a message via Zulip's
  REST API, things start here).
- `send_message_backend` does some validation before triggering the
  `check_message` + `do_send_messages` backend flow.
- That backend flow saves the data to the database and triggers a
  `message` event in the `notify_tornado` queue (part of the events
  system).
- The events system processes, and dispatches that event to all
  clients subscribed to receive notifications for users who should
  receive the message (including the sender). As a side effect, it
  adds queue items to the email and push notification queues (which,
  in turn, may trigger those notifications).
  - Other clients receive the event and display the new message.
  - For the client that sent the message, it instead replaces its
    locally echoed message with the final message it received back
    from the server (it indicates this to the sender by adding a
    display timestamp to the message).
- The `send_message_backend` view function returns
  a 200 `HTTP` response; the client receives that response and mostly
  does nothing with it other than update some logging details. (This
  may happen before or after the client receives the event notifying
  it about the new message via its event queue.)

## Message editing

Message editing uses a very similar principle to how sending messages
works. A few details are worth mentioning:

- `maybe_enqueue_notifications_for_message_update` is an analogue of
  `maybe_enqueue_notifications`, and exists to handle cases like a
  user was newly mentioned after the message is edited (since that
  should trigger email/push notifications, even if the original
  message didn't have one).
- We use a similar technique to what's described in the local echo
  section for doing client-side rerendering to update the message feed.
- In the default configuration, Zulip stores the message edit history
  (which is useful for forensics but also exposed in the UI), in the
  `message.edit_history` attribute.
- We support topic editing, including bulk-updates moving several
  messages between topics.

### Inline URL previews

Zulip's inline URL previews feature (`zerver/lib/url_preview/`) uses
variant of the message editing/local echo behavior. The reason is
that for inline URL previews, the backend needs to fetch the content
from the target URL, and for slow websites, this could result in a
significant delay in rendering the message and delivering it to other
users.

- For this case, Zulip's backend Markdown processor will render the
  message without including the URL embeds/previews, but it will add a
  deferred work item into the `embed_links` queue.

- The [queue processor](queuing.md) for the
  `embed_links` queue will fetch the URLs, and then if they return
  results, rerun the Markdown processor and notify clients of the
  updated message `rendered_content`.

- We reuse the `update_message` framework (used for
  Zulip's message editing feature) in order to avoid needing custom code
  to implement the notification-and-rerender part of this implementation.

## Soft deactivation

This section details a somewhat subtle issue: How Zulip uses a
user-invisible technique called "soft deactivation" to handle
scalability to communities with many thousands of inactive users.

For background, Zulip’s threading model requires tracking which
individual messages each user has received and read (in other chat
products, the system either doesn’t track what the user has read at
all, or just needs to store a pointer for “how far the user has read”
in each room or channel).

We track these data in the backend in the `UserMessage` table, storing
rows `(message_id, user_id, flags)`, where `flags` is 32 bits of space
for boolean data like whether the user has read or starred the
message. All the key queries needed for accessing message history,
full-text search, and other key features can be done efficiently with
the database indexes on this table (with joins to the `Message` table
containing the actual message content where required).

The downside of this design is that when a new message is sent to a
channel with `N` recipients, we need to write `N` rows to the
`UserMessage` table to record those users receiving those messages.
Each row is just 3 integers in size, but even with modern databases
and SSDs, writing thousands of rows to a database starts to take a few
seconds.

This isn’t a problem for most Zulip servers, but is a major problem
for communities like chat.zulip.org, where there might be 10,000s of
inactive users who only stopped by briefly to check out the product or
ask a single question, but are subscribed to whatever the default
channels in the organization are.

The total amount of work being done here was acceptable (a few seconds
of total CPU work per message to large public channels), but the
latency was unacceptable: The server backend was introducing a latency
of about 1 second per 2000 users subscribed to receive the message.
While these delays may not be immediately obvious to users (Zulip,
like many other chat applications,
[local echoes](markdown.md) messages that a user sends
as soon as the user hits “Send”), latency beyond a second or two
significantly impacts the feeling of interactivity in a chat
experience (i.e. it feels like everyone takes a long time to reply to
even simple questions).

A key insight for addressing this problem is that there isn’t much of
a use case for long chat discussions among 1000s of users who are all
continuously online and actively participating. Channels with a very
large number of active users are likely to only be used for occasional
announcements, where some latency before everyone sees the message is
fine. Even in giant organizations, almost all messages are sent to
smaller channels with dozens or hundreds of active users, representing
some organizational unit within the community or company.

However, large, active channels are common in open source projects,
standards bodies, professional development groups, and other large
communities with the rough structure of the Zulip development
community. These communities usually have thousands of user accounts
subscribed to all the default channels, even if they only have dozens
or hundreds of those users active in any given month. Many of the
other accounts may be from people who signed up just to check the
community out, or who signed up to ask a few questions and may never
be seen again.

The key technical insight is that if we can make the latency scale
with the number of users who actually participate in the community,
not the total size of the community, then our database write limited
send latency of 1 second per 2000 users is totally fine. But we need
to do this in a way that doesn’t create problems if any of the
thousands of “inactive” users come back (or one of the active users
sends a direct message to one of the inactive users), since it’s
impossible for the software to know which users are eventually coming
back or will eventually be interacted with by an existing user.

We solved this problem with a solution we call “soft deactivation”;
users that are soft-deactivated consume less resources from Zulip in a
way that is designed to be invisible both to other users and to the
user themself. If a user hasn’t logged into a given Zulip
organization for a few weeks, they are tagged as soft-deactivated.

The way this works internally is:

- We (usually) skip creating UserMessage rows for soft-deactivated
  users when a message is sent to a channel where they are subscribed.

- If/when the user ever returns to Zulip, we can at that time
  reconstruct the UserMessage rows that they missed, and create the rows
  at that time (or, to avoid a latency spike if/when the user returns to
  Zulip, this work can be done in a nightly cron job). We can construct
  those rows later because we already have the data for when the user
  might have been subscribed or unsubscribed from channels by other
  users, and, importantly, we also know that the user didn’t interact
  with the UI since the message was sent (and thus we can safely assume
  that the messages have not been marked as read by the user). This is
  done in the `add_missing_messages` function, which is the core of the
  soft-deactivation implementation.

- The “usually” above is because there are a few flags that result
  from content in the message (e.g., a message that mentions a user
  results in a “mentioned” flag in the UserMessage row), that we need to
  keep track of. Since parsing a message can be expensive (>10ms of
  work, depending on message content), it would be too inefficient to
  need to re-parse every message when a soft-deactivated user comes back
  to Zulip. Conveniently, those messages are rare, and so we can just
  create UserMessage rows which would have “interesting” flags at the
  time they were sent without any material performance impact. And then
  `add_missing_messages` skips any messages that already have a
  `UserMessage` row for that user when doing its backfill.

The end result is the best of both worlds:

- Nobody's view of the world is different because the user was
  soft-deactivated (resulting in no visible user-experience impact), at
  least if one is running the cron job. If one does not run the cron
  job, then users returning after being away for a very long time will
  potentially have a (very) slow loading experience as potentially
  100,000s of UserMessage rows might need to be reconstructed at once.
- On the latency-sensitive message sending and fanout code path, the
  server only needs to do work for users who are currently interacting
  with Zulip.

Empirically, we've found this technique completely resolved the "send
latency" scaling problem. The latency of sending a message to a channel
now scales only with the number of active subscribers, so one can send
a message to a channel with 5K subscribers of which 500 are active, and
it’ll arrive in the couple hundred milliseconds one would expect if
the extra 4500 inactive subscribers didn’t exist.

There are a few details that require special care with this system:

- [Email and mobile push
  notifications](notifications.md). We need to make
  sure these are still correctly delivered to soft-deactivated users;
  making this work required careful work for those code paths that
  assumed a `UserMessage` row would always exist for a message that
  triggers a notification to a given user.
- Digest emails, which use the `UserMessage` table extensively to
  determine what has happened in channels the user can see. We can use
  the user's subscriptions to construct what messages they should have
  access to for this feature.
- Soft-deactivated users experience high loading latency when
  returning after being idle for months. We optimize this by
  triggering a soft reactivation for users who receive email or push
  notification for direct messages or personal mentions, or who
  request a password reset, since these are good leading indicators
  that a user is likely to return to Zulip.
```

--------------------------------------------------------------------------------

---[FILE: settings.md]---
Location: zulip-main/docs/subsystems/settings.md

```text
# Settings system

The page documents the Zulip settings system, and hopefully should
help you decide how to correctly implement new settings you're adding
to Zulip.

We have two types of administrative settings in Zulip:

- **Server settings** are set via configuration files, and apply to
  the whole Zulip installation.
- **Realm settings** (or **organization settings**) are usually
  set via the /#organization page in the Zulip web application, and
  apply to a single Zulip realm/organization. (Which, for most Zulip
  servers, is the only realm on the server).

Philosophically, the goals of the settings system are to make it
convenient for:

- Zulip server administrators to configure
  Zulip's feature set for their server without needing to patch Zulip
- Realm administrators to configure settings for their organization
  independently without needing to talk with the server administrator.
- Secrets (passwords, API keys, etc.) to be stored in a separate place
  from shareable configuration.

## Server settings

Zulip uses the [Django settings
system](https://docs.djangoproject.com/en/5.0/topics/settings/), which
means that the settings files are Python programs that set a lot of
variables with all-capital names like `EMAIL_GATEWAY_PATTERN`. You can
access these anywhere in the Zulip Django code using, for example:

```python
from django.conf import settings
print(settings.EMAIL_GATEWAY_PATTERN)
```

Additionally, if you need to access a Django setting in a shell
script (or just on the command line for debugging), you can use, for
example:

```console
$ ./scripts/get-django-setting EMAIL_GATEWAY_PATTERN
%s@localhost:9991
```

The `DJANGO_SETTINGS_MODULE` environment variable is set to
`zproject.settings`, which is what tells Django to effectively import
`zproject.settings.*` into `django.conf.settings` to make them
accessible there.

However, Zulip has separated those settings that we expect a system
administrator to change (with nice documentation) from the ~1000 lines
of settings needed by the Zulip Django app. As a result, there are a
few files involved in the Zulip settings for server administrators.
In a production environment, we have:

- `/etc/zulip/settings.py` (the template is in the Zulip repo at
  `zproject/prod_settings_template.py`) is the main system
  administrator-facing settings file for Zulip. It contains all the
  server-specific settings, such as how to send outgoing email, the
  hostname of the PostgreSQL database, etc., but does not contain any
  secrets (e.g., passwords, secret API keys, cryptographic keys, etc.).
  The way we generally do settings that can be controlled with shell
  access to a Zulip server is to put a default in
  `zproject/default_settings.py`, and then override it here. As this
  is the main documentation for Zulip settings, we recommend that
  production installations [carefully update `/etc/zulip/settings.py`
  every major
  release](../production/upgrade.md#updating-settingspy-inline-documentation)
  to pick up new inline documentation.

- `/etc/zulip/zulip-secrets.conf` (generated by
  `scripts/setup/generate_secrets.py` as part of installation)
  contains secrets used by the Zulip installation. These are read
  using the [standard Python
  `RawConfigParser`](https://docs.python.org/3/library/configparser.html#configparser.RawConfigParser),
  and accessed in `zproject/computed_settings.py` by the `get_secret`
  or `get_mandatory_secret` function defined in `zproject/config.py`.
  All secrets/API keys/etc. used by the Zulip Django application should
  be stored here. The secrets mandatory to start the Zulip Django app
  are read using `get_mandatory_secret` and the others are read with
  `get_secret`. If any of the mandatory secrets is missing, a
  `ZulipSettingsError` is raised.

- `zproject/settings.py` is the main Django settings file for Zulip.
  It imports everything from `zproject/configured_settings.py` and
  `zproject/computed_settings.py`.

- `zproject/configured_settings.py` imports everything from
  `zproject/default_settings.py`, then in a prod environment imports
  `/etc/zulip/settings.py` via a symlink.

- `zproject/default_settings.py` has the default values for the settings the
  user would set in `/etc/zulip/settings.py`.

- `zproject/computed_settings.py` contains all the settings that are
  constant for all Zulip installations or computed as a function of
  `zproject/configured_settings.py` (e.g., configuration for logging,
  static assets, middleware, etc.).

In a development environment, we have `zproject/settings.py`, and
additionally:

- `zproject/dev_settings.py` has the custom settings for the Zulip development
  environment; these are set after importing `prod_settings_template.py`.

- `zproject/dev-secrets.conf` replaces
  `/etc/zulip/zulip-secrets.conf`, and is not tracked by Git. This
  allows you to configure your development environment to support
  features like [authentication
  options](../development/authentication.md) that require secrets to
  work. It is also used to set certain settings that in production
  belong in `/etc/zulip/settings.py`, e.g., `SOCIAL_AUTH_GITHUB_KEY`.
  You can see a full list with `git grep development_only=True`, or
  add additional settings of this form if needed.

- If you need to override a setting in your development environment,
  you can do so by creating a `zproject/custom_dev_settings.py`
  setting the values you'd like to override (the test suites ignore
  this file). This optional file is processed just after
  `dev_settings.py` in `configured_settings.py`, so
  `zproject/computed_settings.py` will correctly use your custom
  settings when calculating any computed settings that depend on them.

- `zproject/test_settings.py` imports everything from
  `zproject/settings.py` and `zproject/test_extra_settings.py`.

- `zproject/test_extra_settings.py` has the (default) settings used
  for the Zulip tests (both backend and Puppeteer), which are applied on
  top of the development environment settings.

When adding a new server setting to Zulip, you will typically add it
in two or three places:

- `zproject/default_settings.py`, with a default value
  for production environments.

- If the settings has a secret key,
  you'll add a `get_secret` or `get_mandatory_secret` call in
  `zproject/computed_settings.py` (and the
  user will add the value when they configure the feature).

- In an appropriate section of `zproject/prod_settings_template.py`,
  with documentation in the comments explaining the setting's
  purpose and effect.

- Possibly also `zproject/dev_settings.py` and/or
  `zproject/test_settings.py`, if the desired value of the setting for
  Zulip development and/or test environments is different from the
  default for production.

Most settings should be enabled in the development environment, to
maximize convenience of testing all of Zulip's features; they should
be enabled by default in production if we expect most Zulip sites to
want those settings.

### Testing non-default settings

You can write tests for settings using, for example,
`with self.settings(TERMS_OF_SERVICE=None)`. However, this only works
for settings which are checked at runtime, not settings which are only
accessed in initialization of Django (or Zulip) internals
(e.g., `DATABASES`). See the [Django docs on overriding settings in
tests][django-test-settings] for more details.

[django-test-settings]: https://docs.djangoproject.com/en/5.0/topics/testing/tools/#overriding-settings

## Realm settings

Realm settings are preferred for any configuration that is a matter of
organizational policy (as opposed to technical capabilities of the
server). As a result, configuration options for user-facing
functionality is almost always added as a new realm setting, not a
server setting. The [new feature tutorial][doc-newfeat] documents the
process for adding a new realm setting to Zulip.

So for example, the following server settings will eventually be
replaced with realm settings:

- `NAME_CHANGES_DISABLED`
- `INLINE_IMAGE_PREVIEW`
- `ENABLE_GRAVATAR`
- Which authentication methods are allowed should probably appear in
  both places; in server settings indicating the capabilities of the
  server, and in the realm settings indicating which methods the realm
  administrator wants to allow users to log in with.

[doc-newfeat]: ../tutorials/new-feature-tutorial.md
```

--------------------------------------------------------------------------------

````
