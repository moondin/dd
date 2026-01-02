---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 279
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 279 of 1290)

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

---[FILE: logging.md]---
Location: zulip-main/docs/subsystems/logging.md

```text
# Logging and error reporting

Having a good system for logging error reporting is essential to
making a large project like Zulip successful. Without reliable error
reporting, one has to rely solely on bug reports from users in order
to produce a working product.

Our goal as a project is to have zero known 500 errors on the backend
and zero known JavaScript exceptions on the frontend. While there
will always be new bugs being introduced, that goal is impossible
without an efficient and effective error reporting framework.

We provide integration with [Sentry][sentry] to make it easier for
very large installations like zulip.com to manage their exceptions and
ensure they are all tracked down, but our default email-based system
is great for small installations.

## Backend error reporting

The [Django][django-errors] framework provides much of the
infrastructure needed by our error reporting system:

- The ability to send emails to the server's administrators with any
  500 errors, using `django.utils.log.AdminEmailHandler`.
- The ability to rate-limit certain errors to avoid sending hundreds
  of emails in an outage (see `_RateLimitFilter` in
  `zerver/lib/logging_util.py`)
- A nice framework for filtering passwords and other important user
  data from the exception details, which we use in
  `zerver/filters.py`.
- Middleware for handling `JsonableError`, which is our standard
  system for API code to return a JSON-format HTTP error response.

Since 500 errors in any Zulip server are usually a problem the server
administrator should investigate and/or report upstream, we have this
email reporting system configured to report errors by default.

[django-errors]: https://docs.djangoproject.com/en/5.0/howto/error-reporting/

### Sentry error logging

Zulip's optional backend [Sentry][sentry] integration will aggregate
errors to show which users and realms are affected, any logging which
happened prior to the exception, local variables in each frame of the
exception, and the full request headers which triggered it.

You can enable it by:

1.  Create a [project][sentry-project] in your Sentry organization
    with a platform of "Django."
2.  Copy your [Sentry DSN][sentry-dsn] into `/etc/zulip/settings.py`
    as `SENTRY_DSN`:
    ```python3
    ## Controls the DSN used to report errors to Sentry.io
    SENTRY_DSN = "https://bbb@bbb.ingest.sentry.io/1234"
    ```
3.  As the `zulip` user, restart Zulip by running:
    ```shell
    /home/zulip/deployments/current/scripts/restart-server
    ```

You may also want to enable Zulip's [Sentry deploy
hook][sentry-deploy-hook].

[sentry-project]: https://docs.sentry.io/product/projects/
[sentry-dsn]: https://docs.sentry.io/product/sentry-basics/dsn-explainer/
[sentry-deploy-hook]: ../production/deployment.md#sentry-deploy-hook

### Backend logging

[Django's logging system][django-logging] uses the standard
[Python logging infrastructure][python-logging]. We have configured
them so that `logging.exception` and `logging.error` get emailed to
the server maintainer, while `logging.warning` will just appear in
`/var/log/zulip/errors.log`. Lower log levels just appear in the main
server log (as well as in the log for corresponding process, be it
`django.log` for the main Django processes or the appropriate
`events_*` log file for a queue worker).

#### Backend logging format

The main Zulip server log contains a line for each backend request.
It also contains warnings, errors, and the full tracebacks for any
Python exceptions. In production, it goes to
`/var/log/zulip/server.log`; in development, it goes to the terminal
where you run `run-dev`.

In development, it's good to keep an eye on the `run-dev` console
as you work on backend changes, since it's a great way to notice bugs
you just introduced.

In production, one usually wants to look at `errors.log` for errors
since the main server log can be very verbose, but the main server log
can be extremely valuable for investigating performance problems.

```text
2016-05-20 14:50:22.056 INFO [zr] 127.0.0.1       GET     302 528ms (db: 1ms/1q) (+start: 123ms) / (unauth@zulip via ?)
[20/May/2016 14:50:22]"GET / HTTP/1.0" 302 0
2016-05-20 14:50:22.272 INFO [zr] 127.0.0.1       GET     200 124ms (db: 3ms/2q) /login/ (unauth@zulip via ?)
2016-05-20 14:50:26.333 INFO [zr] 127.0.0.1       POST    302  37ms (db: 6ms/7q) /accounts/login/local/ (unauth@zulip via ?)
[20/May/2016 14:50:26]"POST /accounts/login/local/ HTTP/1.0" 302 0
2016-05-20 14:50:26.538 INFO [zr] 127.0.0.1       POST    200  12ms (db: 1ms/2q) (+start: 53ms) /api/v1/events/internal [1463769771:0/0] (8@zulip via internal)
2016-05-20 14:50:26.657 INFO [zr] 127.0.0.1       POST    200  10ms (+start: 8ms) /api/v1/events/internal [1463769771:0/0] (8@zulip via internal)
2016-05-20 14:50:26.959 INFO [zr] 127.0.0.1       GET     200 588ms (db: 26ms/21q) / [1463769771:0] (8@zulip via website)
```

The format of this output is:

- Timestamp
- Log level
- Logger name, abbreviated as "zr" for these Zulip request logs
- IP address
- HTTP method
- HTTP status code
- Time to process
- (Optional perf data details, e.g., database time/queries, memcached
  time/queries, Django process startup time, Markdown processing time,
  etc.)
- Endpoint/URL from zproject/urls.py
- "email via client" showing user account involved (if logged in) and
  the type of client they used ("web", "Android", etc.).

The performance data details are particularly useful for investigating
performance problems, since one can see at a glance whether a slow
request was caused by delays in the database, in the Markdown
processor, in memcached, or in other Python code.

One useful thing to note, however, is that the database time is only
the time spent connecting to and receiving a response from the
database. Especially when response are large, there can often be a
great deal of Python processing overhead to marshall the data from the
database into Django objects that is not accounted for in these
numbers.

#### Searching backend log files

Zulip comes with a tool, `./scripts/log-search`, to quickly search
through the main `server.log` log file based on a number of different
axes -- including client IP address, client user-id, request path,
response code. It can also search the NGINX logs, which provide
similar information.

Because often the requests to static resources, or to things like user
avatars, are not as important, they are also filtered out of the
output by default.

The output shows timestamp, request duration, client IP address,
response code, and request method, hostname, and path; any property
which is limited by the tool is not displayed, for conciseness:

```
zulip@example-prod:~/deployments/current$ ./scripts/log-search realm-name
22:30:36.593     1ms         2606:2800:220:1:248:1893:25c8:1946       302 GET    /
22:30:42.508   366ms         2606:2800:220:1:248:1893:25c8:1946       200 GET    /login/
23:18:30.977     1ms         93.184.216.34                            302 GET    /
23:18:31.286   132ms         93.184.216.34                            200 GET    /login/
23:18:48.094    20ms         93.184.216.34                            200 GET    /accounts/password/reset/
23:18:51.520   149ms         93.184.216.34                            200 GET    /login/
23:18:59.420    20ms         93.184.216.34                            200 GET    /accounts/password/reset/
23:19:02.929  1300ms         93.184.216.34                            302 POST   /accounts/password/reset/
23:19:03.056    93ms         93.184.216.34                            200 GET    /accounts/password/reset/done/
23:19:08.911    26ms         93.184.216.34                            302 GET    /accounts/password/reset/OA/b56jfp-bd80ee99b98e703456b3bdcd91892be2/
23:19:09.189   116ms         93.184.216.34                            200 GET    /accounts/password/reset/OA/set-password/
23:19:18.743   215ms         93.184.216.34                            302 POST   /accounts/password/reset/OA/set-password/
23:19:18.779    12ms         93.184.216.34                            200 GET    /accounts/password/done/
23:19:20.796    12ms         93.184.216.34                            200 GET    /accounts/login/
23:19:29.323   295ms 8@      93.184.216.34                            302 POST   /accounts/login/
23:19:29.704   362ms 8@      93.184.216.34                            200 GET    /
23:20:04.980   110ms 8@      93.184.216.34                            200 DELETE /json/users/me/subscriptions

zulip@example-prod:~/deployments/current$ ./scripts/log-search 2606:2800:220:1:248:1893:25c8:1946
22:30:36.593     1ms          302 GET    https://realm-one.example-prod.example.com/
22:30:42.508   366ms          200 GET    https://realm-one.example-prod.example.com/login/
```

See `./scripts/log-search --help` for complete documentation.

## Blueslip frontend error reporting

We have a custom library, called `blueslip` (named after the form used at MIT to
report problems with the facilities), that logs and reports JavaScript errors in
the browser. In production, this uses Sentry (if configured) to report and
aggregate errors. In development, this means displaying a highly visible overlay
over the message view area, to make exceptions in testing a new feature hard to
miss.

- Blueslip is implemented in `web/src/blueslip.ts`.
- In order to capture essentially any error occurring in the browser, in
  development mode Blueslip listens for the `error` event on `window`.
- It also has methods for being manually triggered by Zulip JavaScript code for
  warnings and assertion failures. Explicit `blueslip.error` calls are sent to
  Sentry, if configured.
- Blueslip keeps a log of all the notices it has received during a browser
  session, so that one can see cases where exceptions chained together. You can
  print this log from the browser console using
  `blueslip = require("./src/blueslip"); blueslip.get_log()`.

Blueslip supports several error levels:

- `throw new Error(…)`: For fatal errors that cannot be easily recovered
  from. We try to avoid using it, since it kills the current JS thread, rather
  than returning execution to the caller.
- `blueslip.error`: For logging of events that are definitely caused by a bug
  and thus sufficiently important to be reported, but where we can handle the
  error without creating major user-facing problems (e.g., an exception when
  handling a presence update).
- `blueslip.warn`: For logging of events that are a problem but not important
  enough to log an error to Sentry in production. They are, however, highlighted
  in the JS console in development, and appear as breadcrumb logs in Sentry in
  production.
- `blueslip.log` (and `blueslip.info`): Logged to the JS console in development
  and also in the Sentry breadcrumb log in production. Useful for data that
  might help discern what state the browser was in during an error (e.g., whether
  the user was in a narrow).
- `blueslip.debug`: Similar to `blueslip.log`, but are not printed to
  the JS console in development.

### Sentry JavaScript error logging

Zulip's optional JavaScript [Sentry][sentry] integration will aggregate errors
to show which users and realms are affected, any logging which happened prior to
the exception, and any DOM interactions which happened prior to the error.

You can enable it by:

1.  Create a [project][sentry-project] in your Sentry organization
    with a platform of "JavaScript."
2.  Copy your [Sentry DSN][sentry-dsn] into `/etc/zulip/settings.py`
    as `SENTRY_FRONTEND_DSN`:
    ```python3
    ## Controls the DSN used to report JavaScript errors to Sentry.io
    SENTRY_FRONTEND_DSN = "https://bbb@bbb.ingest.sentry.io/1234"
    ```
3.  If you wish to [sample][sentry-sample] some fraction of the errors, you
    should adjust `SENTRY_FRONTEND_SAMPLE_RATE` down from `1.0`.
4.  As the `zulip` user, restart Zulip by running:
    ```shell
    /home/zulip/deployments/current/scripts/restart-server
    ```

You may also want to enable Zulip's [Sentry deploy
hook][sentry-deploy-hook].

[sentry-sample]: https://docs.sentry.io/platforms/javascript/configuration/sampling/

## Frontend performance reporting

In order to make it easier to debug potential performance problems in
the critically latency-sensitive message sending code pathway, we log
and report to the server the following whenever a message is sent:

- The time the user triggered the message (aka the start time).
- The time the `send_message` response returned from the server.
- The time the message was received by the browser from the
  `get_events` protocol (these last two race with each other).
- Whether the message was locally echoed.
- If so, whether there was a disparity between the echoed content and
  the server-rendered content, which can be used for statistics on how
  effective our [local echo system](markdown.md) is.

The code is all in `zerver/lib/report.py` and `web/src/sent_messages.ts`.

We have similar reporting for the time it takes to narrow / switch to
a new view:

- The time the action was initiated
- The time when the updated message feed was visible to the user
- The time when the browser was idle again after switching views
  (intended to catch issues where we generate a lot of deferred work).

[python-logging]: https://docs.python.org/3/library/logging.html
[django-logging]: https://docs.djangoproject.com/en/5.0/topics/logging/
[sentry]: https://sentry.io
```

--------------------------------------------------------------------------------

---[FILE: management-commands.md]---
Location: zulip-main/docs/subsystems/management-commands.md

```text
# Management commands

Zulip has a number of [Django management commands][django-docs] that
live under `{zerver,zilencer,analytics}/management/commands/`.

If you need some Python code to run with a Zulip context (access to
the database, etc.) in a script, it should probably go in a management
command. The key thing distinguishing these from production scripts
(`scripts/`) and development scripts (`tools/`) is that management
commands can access the database.

While Zulip takes advantage of built-in Django management commands for
things like managing Django migrations, we also have dozens that we've
written for a range of purposes:

- Cron jobs to do regular updates, e.g., `update_analytics_counts.py`,
  `sync_ldap_user_data`, etc.
- Useful parts of provisioning or upgrading a Zulip development
  environment or server, e.g., `makemessages`, `compilemessages`,
  `populate_db`, `fill_memcached_caches`, etc.
- The actual scripts run by supervisord to run the persistent
  processes in a Zulip server, e.g., `runtornado` and `process_queue`.
- For a sysadmin to verify a Zulip server's configuration during
  installation, e.g., `send_test_email`.
- As the interface for doing those rare operations that don't have a
  UI yet, e.g., `deactivate_realm`, `reactivate_realm`,
  `change_user_email` (for the case where the user doesn't control the
  old email address).
- For a sysadmin to easily interact with and script common possible
  changes they might want to make to the database on a Zulip server.
  E.g., `send_password_reset_email`, `export`, `purge_queue`.

## Writing management commands

It's generally pretty easy to template off an existing management
command to write a new one. Some good examples are
`change_user_email` and `deactivate_realm`. The Django documentation
is good, but we have a few pieces advice specific to the Zulip
project.

- Inherit from the `ZulipBaseCommand` class in
  `zerver/lib/management.py`; this will add some helpful general
  flags, as well as tools for adding and parsing `--realm` and
  `--user` flags, so you don't need to write the tedious code of
  looking those objects up. This is especially important for users,
  since the library handles the issues around looking up users by
  email well (if there's a unique user with that email, just modify it
  without requiring the user to specify the realm as well, but if
  there's a collision, throw a nice error).
- Avoid writing a lot of code in management commands; management
  commands are annoying to unit test, and thus easier to maintain if
  all the interesting logic is in a nice function that is unit tested
  (and ideally, also used in Zulip's existing code). Look for code in
  `zerver/lib/` that already does what you need. For most actions,
  you can just call a `do_change_foo` type function from
  `zerver/actions/` to do all the work; this is usually far
  better than manipulating the database directly, since the library
  functions used by the UI are maintained to correctly live-update the
  UI if needed.

Management commands are essentially independent Python scripts with
access to the Zulip server's database and libraries; so you don't need
to do anything special like restart the server when iteratively
testing one, even if testing in a Zulip production environment where
the server doesn't normally restart whenever a file is edited.

[django-docs]: https://docs.djangoproject.com/en/5.0/howto/custom-management-commands/
```

--------------------------------------------------------------------------------

---[FILE: markdown.md]---
Location: zulip-main/docs/subsystems/markdown.md

```text
# Markdown implementation

Zulip uses a special flavor of Markdown/CommonMark for its message
formatting. Our Markdown flavor is unique primarily to add important
extensions, such as quote blocks and math blocks, and also to do
previews and correct issues specific to the chat context. Beyond
that, it has a number of minor historical variations resulting from
its history predating CommonMark (and thus Zulip choosing different
solutions to some problems) and based in part on Python-Markdown,
which is proudly a classic Markdown implementation. We reduce these
variations with every major Zulip release.

Zulip has two implementations of Markdown. The backend implementation
at `zerver/lib/markdown/` is based on
[Python-Markdown](https://pypi.python.org/pypi/Markdown) and is used to
authoritatively render messages to HTML (and implements
slow/expensive/complex features like querying the Twitter API to
render tweets nicely). The frontend implementation is in JavaScript,
based on [marked.js](https://github.com/chjj/marked)
(`web/src/echo.ts`), and is used to preview and locally echo
messages the moment the sender hits Enter, without waiting for round
trip from the server. Those frontend renderings are only shown to the
sender of a message, and they are (ideally) identical to the backend
rendering.

The JavaScript Markdown implementation has a function,
`markdown.contains_backend_only_syntax`, that is used to check whether a message
contains any syntax that needs to be rendered to HTML on the backend.
If `markdown.contains_backend_only_syntax` returns true, the frontend simply won't
echo the message for the sender until it receives the rendered HTML
from the backend. If there is a bug where `markdown.contains_backend_only_syntax`
returns false incorrectly, the frontend will discover this when the
backend returns the newly sent message, and will update the HTML based
on the authoritative backend rendering (which would cause a change in
the rendering that is visible only to the sender shortly after a
message is sent). As a result, we try to make sure that
`markdown.contains_backend_only_syntax` is always correct.

## Testing

The Python-Markdown implementation is tested by
`zerver/tests/test_markdown.py`, and the marked.js implementation and
`markdown.contains_backend_only_syntax` are tested by
`web/tests/markdown.test.cjs`.

A shared set of fixed test data ("test fixtures") is present in
`zerver/tests/fixtures/markdown_test_cases.json`, and is automatically used
by both test suites; as a result, it is the preferred place to add new
tests for Zulip's Markdown system. Some important notes on reading
this file:

- `expected_output` is the expected output for the backend Markdown
  processor.
- When the frontend processor doesn't support a feature and it should
  just be rendered on the backend, we set `backend_only_rendering` to
  `true` in the fixtures; this will automatically verify that
  `markdown.contains_backend_only_syntax` rejects the syntax, ensuring
  it will be rendered only by the backend processor.
- When the two processors disagree, we set `marked_expected_output` in
  the fixtures; this will ensure that the syntax stays that way. If
  the differences are important (i.e. not just whitespace), we should
  also open an issue on GitHub to track the problem.
- For mobile push notifications, we need a text version of the
  rendered content, since the APNS and GCM push notification systems
  don't support richer markup. Mostly, this involves stripping HTML,
  but there's some syntax we take special care with. Tests for what
  this plain-text version of content should be stored in the
  `text_content` field.

If you're going to manually test some changes in the frontend Markdown
implementation, the easiest way to do this is as follows:

1. Log in to your development server.
2. Stop your Zulip server with Ctrl-C, leaving the browser open.
3. Compose and send the messages you'd like to test. They will be
   locally echoed using the frontend rendering.

This procedure prevents any server-side rendering. If you don't do
this, backend will likely render the Markdown you're testing and swap
it in before you can see the frontend's rendering.

If you are working on a feature that breaks multiple testcases, and want
to debug the testcases one by one, you can add `"ignore": true` to any
testcases in `markdown_test_cases.json` that you want to ignore. This
is a workaround due to lack of comments support in JSON. Revert your
"ignore" changes before committing. After this, you can run the frontend
tests with `tools/test-js-with-node markdown` and backend tests with
`tools/test-backend zerver.tests.test_markdown.MarkdownFixtureTest.test_markdown_fixtures`.

## Changing Zulip's Markdown processor

First, you will likely find these third-party resources helpful:

- **[Python-Markdown](https://pypi.python.org/pypi/Markdown)** is the Markdown
  library used by Zulip as a base to build our custom Markdown syntax upon.
- **[Python's XML ElementTree](https://docs.python.org/3/library/xml.etree.elementtree.html)**
  is the part of the Python standard library used by Python Markdown
  and any custom extensions to generate and modify the output HTML.

When changing Zulip's Markdown syntax, you need to update several
places:

- The backend Markdown processor (`zerver/lib/markdown/__init__.py`).
- The frontend Markdown processor (`web/src/markdown.ts` and sometimes
  `web/third/marked/lib/marked.cjs`), or `markdown.contains_backend_only_syntax` if
  your changes won't be supported in the frontend processor.
- If desired, the typeahead logic in `web/src/composebox_typeahead.ts`.
- The test suite, probably via adding entries to `zerver/tests/fixtures/markdown_test_cases.json`.
- The in-app Markdown documentation (`markdown_help_rows` in `web/src/info_overlay.ts`).
- The list of changes to Markdown at the end of this document.

Important considerations for any changes are:

- Security: A bug in the Markdown processor can lead to XSS issues.
  For example, we should not insert unsanitized HTML from a
  third-party web application into a Zulip message.
- Uniqueness: We want to avoid users having a bad experience due to
  accidentally triggering Markdown syntax or typeahead that isn't
  related to what they are trying to express.
- Performance: Zulip can render a lot of messages very quickly, and
  we'd like to keep it that way. New regular expressions similar to
  the ones already present are unlikely to be a problem, but we need
  to be thoughtful about expensive computations or third-party API
  requests.
- Database: The backend Markdown processor runs inside a Python thread
  (as part of how we implement timeouts for third-party API queries),
  and for that reason we currently should avoid making database
  queries inside the Markdown processor. This is a technical
  implementation detail that could be changed with a few days of work,
  but is an important detail to know about until we do that work.
- Testing: Every new feature should have both positive and negative
  tests; they're easy to write and give us the flexibility to refactor
  frequently.

## Per-realm features

Zulip's Markdown processor's rendering supports a number of features
that depend on realm-specific or user-specific data. For example, the
realm could have
[linkifiers](https://zulip.com/help/add-a-custom-linkifier)
or [custom emoji](https://zulip.com/help/custom-emoji)
configured, and Zulip supports mentions for channels, users, and user
groups (which depend on data like users' names, IDs, etc.).

At a backend code level, these are controlled by the `message_realm`
object and other arguments passed into `do_convert` (`sent_by_bot`,
`translate_emoticons`, `mention_data`, etc.). Because
Python-Markdown doesn't support directly passing arguments into the
Markdown processor, our logic attaches the data to the Markdown
processor object via, for example, `_md_engine.zulip_db_data`, and
then individual Markdown rules can access the data from there.

For non-message contexts (e.g., an organization's profile (aka the
thing on the right-hand side of the login page), channel descriptions,
or rendering custom profile fields), one needs to just pass in a
`message_realm` (see, for example, `zulip_default_context` for the
organization profile code for this). But for messages, we need to
pass in attributes like `sent_by_bot` and `translate_emoticons` that
indicate details about how the user sending the message is configured.

## Zulip's Markdown philosophy

Note that this discussion is based on a comparison with the original
Markdown, not newer Markdown variants like CommonMark.

Markdown is great for group chat for the same reason it's been
successful in products ranging from blogs to wikis to bug trackers:
it's close enough to how people try to express themselves when writing
plain text (e.g., emails) that it helps more than getting in the way.

The main issue for using Markdown in instant messaging is that the
Markdown standard syntax used in a lot of wikis/blogs has nontrivial
error rates, where the author needs to go back and edit the post to
fix the formatting after typing it the first time. While that's
basically fine when writing a blog, it gets annoying very fast in a
chat product; even though you can edit messages to fix formatting
mistakes, you don't want to be doing that often. There are basically
2 types of error rates that are important for a product like Zulip:

- What fraction of the time, if you pasted a short technical email
  that you wrote to your team and passed it through your Markdown
  implementation, would you need to change the text of your email for it
  to render in a reasonable way? This is the "accidental Markdown
  syntax" problem, common with Markdown syntax like the italics syntax
  interacting with talking about `char *`s.

- What fraction of the time do users attempting to use a particular
  Markdown syntax actually succeed at doing so correctly? Syntax like
  required a blank line between text and the start of a bulleted list
  raise this figure substantially.

Both of these are minor issues for most products using Markdown, but
they are major problems in the instant messaging context, because one
can't edit a message that has already been sent before others read it
and users are generally writing quickly. Zulip's Markdown strategy is
based on the principles of giving users the power they need to express
complicated ideas in a chat context while minimizing those two error rates.

## Zulip's changes to Markdown

Below, we document the changes that Zulip has against stock
Python-Markdown; some of the features we modify / disable may already
be non-standard.

**Note** This section has not been updated in a few years and is not
accurate.

### Basic syntax

- Enable `nl2br` extension: this means one newline creates a line
  break (not paragraph break).

- Allow only `*` syntax for italics, not `_`. This resolves an issue where
  people were using `_` and hitting it by mistake too often. Asterisks
  surrounded by spaces won't trigger italics, either (e.g., with stock Markdown
  `You should use char * instead of void * there` would produce undesired
  results).

- Allow only `**` syntax for bold, not `__` (easy to hit by mistake if
  discussing Python `__init__` or something).

- Add `~~` syntax for strikethrough.

- Disable special use of `\` to escape other syntax. Rendering `\\` as
  `\` was hugely controversial, but having no escape syntax is also
  controversial. We may revisit this. For now you can always put
  things in code blocks.

### Lists

- Allow tacking a bulleted list or block quote onto the end of a
  paragraph, i.e. without a blank line before it.

- Allow only `*` for bulleted lists, not `+` or `-` (previously
  created confusion with diff-style text sloppily not included in a
  code block).

- Disable ordered list syntax: stock Markdown automatically renumbers, which
  can be really confusing when sending a numbered list across multiple
  messages.

### Links

- Enable auto-linkification, both for `http://...` and guessing at
  things like `t.co/foo`.

- Force links to be absolute. `[foo](google.com)` will go to
  `http://google.com`, and not `https://zulip.com/google.com` which
  is the default behavior.

- Set `title=`(the URL) on every link tag.

- Disable link-by-reference syntax,
  `[foo][bar]` ... `[bar]: https://google.com`.

- Enable linking to other channels using `#**channelName**`.

### Code

- Enable fenced code block extension, with syntax highlighting.

- Disable line-numbering within fenced code blocks -- the `<table>`
  output confused our web client code.

### Headings

- Enable headings with syntax `# foo` (syntax `== foo ==` is unsupported).

### Other

- Disabled images with `![]()` (images from links are shown as an inline
  preview).

- We added the `~~~ quote` block quote syntax.
```

--------------------------------------------------------------------------------

---[FILE: notifications.md]---
Location: zulip-main/docs/subsystems/notifications.md

```text
# Notifications in Zulip

This is a design document aiming to provide context for developers
working on Zulip's email notifications and mobile push notifications
code paths. We recommend first becoming familiar with [sending
messages](sending-messages.md); this document expands on
the details of the email/mobile push notifications code path.

## Important corner cases

Here we name a few corner cases worth understanding in designing this
sort of notifications system:

- The **idle desktop problem**: We don't want the presence of a
  desktop computer at the office to eat all notifications because the
  user has an "online" client that they may not have used in 3 days.
- The **hard disconnect problem**: A client can lose its connection to
  the Internet (or be suspended, or whatever) at any time, and this
  happens routinely. We want to ensure that races where a user closes
  their laptop shortly after a notifiable message is sent does not
  result in the user never receiving a notification about a message
  (due to the system thinking that client received it).

## The mobile/email notifications flow

As a reminder, the relevant part of the flow for sending messages is
as follows:

- `do_send_messages` is the synchronous message-sending code path,
  and passing the following data in its `send_event_on_commit` call:
  - Data about the message's content (e.g., mentions, wildcard
    mentions, and alert words) and encodes it into the `UserMessage`
    table's `flags` structure, which is in turn passed into
    `send_event_on_commit` for each user receiving the message.
  - Data about user configuration relevant to the message, such as
    `online_push_user_ids` and `stream_notify_user_ids`, are included
    in the main event dictionary.
  - The `presence_idle_user_ids` set, containing the subset of
    recipient users who can potentially receive notifications, but have not
    interacted with a Zulip client in the last few minutes. (Users who
    have generally will not receive a notification unless the
    `enable_online_push_notifications` flag is enabled). This data
    structure ignores users for whom the message is not notifiable,
    which is important to avoid this being thousands of `user_ids` for
    messages to large channels with few currently active users.
- The Tornado [event queue system](events-system.md)
  processes that data, as well as data about each user's active event
  queues, to (1) push an event to each queue needing that message and
  (2) for notifiable messages, pushing an event onto the
  `missedmessage_mobile_notifications` and/or `missedmessage_emails`
  queues. This important message-processing logic has notable extra
  logic not present when processing normal events, both for details
  like splicing `flags` to customize event payloads per-user, as well.
  - The Tornado system determines whether the user is "offline/idle".
    Zulip's email notifications are designed to not fire when the user
    is actively using Zulip to avoid spam, and this is where those
    checks are implemented.
  - Users in `presence_idle_user_ids` are always considered idle:
    the variable name means "users who are idle because of
    presence". This is how we solve the idle desktop problem; users
    with an idle desktop are treated the same as users who aren't
    logged in for this check.
  - However, that check does not handle the hard disconnect problem:
    if a user was present 1 minute before a message was sent, and then
    closed their laptop, the user will not be in
    `presence_idle_user_ids` (because it takes a
    [few minutes](https://zulip.com/api/update-presence) of being idle for Zulip
    clients to declare to the server that the user is actually idle),
    and so without an additional mechanism, messages sent shortly after
    a user leaves would never trigger a notification (!).
  - We solve that problem by also notifying if
    `receiver_is_off_zulip` returns `True`, which checks whether the user has any
    current events system clients registered to receive `message`
    events. This check is done immediately (handling soft disconnects,
    for example, where the user closes their last Zulip tab and we get
    the `DELETE /events/{queue_id}` request).
  - The `receiver_is_off_zulip` check is effectively repeated when
    event queues are garbage-collected (in `missedmessage_hook`) by
    looking for whether the queue being garbage-collected was the only
    one; this second check solves the hard disconnect problem, resulting in
    notifications for these hard-disconnect cases usually coming 10
    minutes late.
  - We try to contain the "when to notify" business logic in the
    `zerver/lib/notification_data.py` class methods. The module has
    unit tests for all possible situations in
    `test_notification_data.py`.
  - The message-edit code path has parallel logic in
    `maybe_enqueue_notifications_for_message_update` for triggering
    notifications in cases like a mention added during message
    editing.
  - The notification sending logic for message edits
    inside Tornado has extensive automated test suites; e.g.,
    `test_message_edit_notifications.py` covers all the cases around
    editing a message to add/remove a mention.
  - We may in the future want to add some sort of system for letting
    users see past notifications, to help with explaining and
    debugging this system, since it has so much complexity.
- Desktop notifications are the simplest; they are implemented
  client-side by the web/desktop app's logic
  (`web/src/notifications.js`) inspecting the `flags` fields that
  were spliced into `message` events by the Tornado system, as well as
  the user's notification settings.
- The queue processors for those queues make the final determination
  for whether to send a notification, and do the work to generate an
  email (`zerver/lib/email_notifications.py`) or mobile
  (`zerver/lib/push_notifications.py`) notification. We'll detail
  this process in more detail for each system below, but it's
  important to know that it's normal for a message to sit in these
  queues for minutes (and in the future, possibly hours).
- Both queue processor code paths do additional filtering before
  sending a notification:
  - Messages that have already been marked as read by the user before
    the queue processor runs never trigger a notification.
  - Messages that were already deleted never trigger a notification.
  - The user-level settings for whether email/mobile notifications are
    disabled are rechecked, as the user may have disabled one of these
    settings during the queuing period.
  - The **Email notifications queue processor**, `MissedMessageWorker`,
    takes care to wait for 2 minutes (hopefully in the future this will be a
    configuration setting) and starts a thread to batch together multiple
    messages into a single email. These features are unnecessary
    for mobile push notifications, because we can live-update those
    details with a future notification, whereas emails cannot be readily
    updated once sent. Zulip's email notifications are styled similarly
    to GitHub's email notifications, with a clean, simple design that
    makes replying from an email client possible (using the [incoming
    email integration](../production/email-gateway.md)).
  - The **Push notifications queue processor**,
    `PushNotificationsWorker`, is a simple wrapper around the
    `push_notifications.py` code that actually sends the
    notification. This logic is somewhat complicated by having to track
    the number of unread push notifications to display on the mobile
    apps' badges, as well as using the [mobile push notifications
    service](../production/mobile-push-notifications.md) for self-hosted
    systems.

The following important constraints are worth understanding about the
structure of the system, when thinking about changes to it:

- **Bulk database queries** are much more efficient for checking
  details from the database like "which users receiving this message
  are online".
- **Thousands of users**. Zulip supports thousands of users, and we
  want to avoid `send_event_on_commit()` pushing large amounts of
  per-user data to Tornado via RabbitMQ for scalability reasons.
- **Tornado doesn't do database queries**. Because the Tornado system
  is an asynchronous event-driven framework, and our Django database
  library is synchronous, database queries are very expensive. So
  these queries need to be done in either `do_send_messages` or the
  queue processor logic. (For example, this means `presence` data
  should be checked in either `do_send_messages` or the queue
  processors, not in Tornado).
- **Future configuration**. Notification settings are an area that we
  expect to only expand with time, with upcoming features like
  following a topic (to get notifications for messages only within
  that topic in a channel). There are a lot of different workflows
  possible with Zulip's threading, and it's important to make it easy
  for users to set up Zulip's notification to fit as many of those
  workflows as possible.
- **Message editing**. Zulip supports editing messages, and that
  interacts with notifications in ways that require careful handling:
  Notifications should have
  the latest edited content (users often fix typos 30 seconds after
  sending a message), adding a mention when editing a message should
  send a notification to the newly mentioned user(s), and deleting a
  message should cancel any unsent notifications for it.
```

--------------------------------------------------------------------------------

````
