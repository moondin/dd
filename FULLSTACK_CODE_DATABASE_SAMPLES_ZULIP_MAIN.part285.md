---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 285
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 285 of 1290)

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

---[FILE: testing-with-django.md]---
Location: zulip-main/docs/testing/testing-with-django.md

```text
# Backend Django tests

## Overview

Zulip uses the Django framework for its Python backend. We
use the testing framework from
[django.test](https://docs.djangoproject.com/en/5.0/topics/testing/)
to test our code. We have thousands of automated tests that verify that
our backend works as expected.

All changes to the Zulip backend code should be supported by tests. We
enforce our testing culture during code review, and we also use
coverage tools to measure how well we test our code. We mostly use
tests to prevent regressions in our code, but the tests can have
ancillary benefits such as documenting interfaces and influencing
the design of our software.

If you have worked on other Django projects that use unit testing, you
will probably find familiar patterns in Zulip's code. This document
describes how to write tests for the Zulip backend, with a particular
emphasis on areas where we have either wrapped Django's test framework
or just done things that are kind of unique in Zulip.

## Running tests

Our tests live in `zerver/tests/`. You can run them with
`./tools/test-backend`. The tests run in parallel using multiple
threads in your development environment, and can finish in under 30s
on a fast machine. When you are in iterative mode, you can run
individual tests or individual modules, following the dotted.test.name
convention below:

```bash
cd /srv/zulip
./tools/test-backend zerver.tests.test_queue_worker.WorkerTest
```

There are many command line options for running Zulip tests, such
as a `--verbose` option. The
best way to learn the options is to use the online help:

```bash
./tools/test-backend --help
```

We also have ways to instrument our tests for finding code coverage,
URL coverage, and slow tests. Use the `-h` option to discover these
features. We also have a `--profile` option to facilitate profiling
tests.

By default, `test-backend` will run all requested tests, and report
all failures at the end. You can configure it to stop after the first
error with the `--stop` option (or `-x`).

Another useful option is `--rerun`, which will rerun just the tests
that failed in the last test run.

**Webhook integrations**. For performance, `test-backend` with no
arguments will not run webhook integration tests (`zerver/webhooks/`),
which would otherwise account for about 25% of the total runtime.
When working on webhooks, we recommend instead running
`test-backend zerver/webhooks` manually (or better, the direction for
the specific webhooks you're working on). And of course our CI is
configured to always use `test-backend --include-webhooks` and run all
of the tests.

## Writing tests

Before you write your first tests of Zulip, it is worthwhile to read
the rest of this document.

To get a hang of commonly used testing techniques, read
[zerver/tests/test_example.py](https://github.com/zulip/zulip/blob/main/zerver/tests/test_example.py).
You can also read some of the existing tests in `zerver/tests`
to get a feel for other patterns we use.

A good practice is to get a "failing test" before you start to implement
your feature. First, it is a useful exercise to understand what needs to happen
in your tests before you write the code, as it can help drive out simple
design or help you make incremental progress on a large feature. Second,
you want to avoid introducing tests that give false positives. Ensuring
that a test fails before you implement the feature ensures that if somebody
accidentally regresses the feature in the future, the test will catch
the regression.

Another important files to skim are
[zerver/lib/test_helpers.py](https://github.com/zulip/zulip/blob/main/zerver/lib/test_helpers.py),
which contains test helpers.
[zerver/lib/test_classes.py](https://github.com/zulip/zulip/blob/main/zerver/lib/test_classes.py),
which contains our `ZulipTestCase` and `WebhookTestCase` classes.

### Setting up data for tests

All tests start with the same fixture data. (The tests themselves
update the database, but they do so inside a transaction that gets
rolled back after each of the tests complete. For more details on how the
fixture data gets set up, refer to `tools/setup/generate-fixtures`.)

The fixture data includes a few users that are named after
Shakesepeare characters, and they are part of the "zulip.com" realm.

Generally, you will also do some explicit data setup of your own. Here
are a couple useful methods in ZulipTestCase:

- make_stream
- subscribe
- unsubscribe
- send_stream_message
- send_personal_message

More typically, you will use methods directly from the backend code.
(This ensures more end-to-end testing, and avoids false positives from
tests that might not consider ancillary parts of data setup that could
influence tests results.)

Here are some example action methods that tests may use for data setup:

- check_send_message
- do_change_user_role
- do_create_user
- do_make_stream_private

### Testing code that accesses the filesystem

Some tests need to access the filesystem (e.g., `test_upload.py` tests
for `LocalUploadBackend` and the data import tests). Doing
this correctly requires care to avoid problems like:

- Leaking files after every test (which are clutter and can eventually
  run the development environment out of disk) or
- Interacting with other parallel processes of this `test-backend` run
  (or another `test-backend` run), or with later tests run by this
  process.

To avoid these problems, you can do the following:

- Use a subdirectory of `settings.TEST_WORKER_DIR`; this is a
  subdirectory of `/var/<uuid>/test-backend` that is unique to the
  test worker thread and will be automatically deleted when the
  relevant `test-backend` process finishes.
- Delete any files created by the test in the test class's `tearDown`
  method (which runs even if the test fails); this is valuable to
  avoid conflicts with other tests run later by the same test process.

Our common testing infrastructure handles some of this for you,
e.g., it replaces `settings.LOCAL_UPLOADS_DIR` for each test process
with a unique path under `/var/<uuid>/test-backend`. And
`UploadSerializeMixin` manages some of the cleanup work for
`test_upload.py`.

### Testing with mocks

This section is a beginner's guide to mocking with Python's
`unittest.mock` library. It will give you answers to the most common
questions around mocking, and a selection of commonly used mocking
techniques.

#### What is mocking?

When writing tests, _mocks allow you to replace methods or objects with fake entities
suiting your testing requirements_. Once an object is mocked, **its original code does not
get executed anymore**.

Rather, you can think of a mocked object as an initially empty shell:
Calling it won't do anything, but you can fill your shell with custom code, return values, etc.
Additionally, you can observe any calls made to your mocked object.

#### Why is mocking useful?

When writing tests, it often occurs that you make calls to functions
taking complex arguments. Creating a real instance of such an argument
would require the use of various different libraries, a lot of
boilerplate code, etc. Another scenario is that the tested code
accesses files or objects that don't exist at testing time. Finally,
it is good practice to keep tests independent from others. Mocks help
you to isolate test cases by simulating objects and methods irrelevant
to a test's goal.

In all of these cases, you can "mock out" the function calls / objects
and replace them with fake instances that only implement a limited
interface. On top of that, these fake instances can be easily
analyzed.

Say you have a module `greetings` defining the following functions:

```python
def fetch_database(key: str) -> str:
    # ...
    # Do some look-ups in a database
    return data

def greet(name_key: str) -> str:
    name = fetch_database(name_key)
    return "Hello" + name
```

- You want to test `greet()`.

- In your test, you want to call `greet("Mario")` and verify that it returns the correct greeting:

  ```python
  from greetings import greet

  def test_greet() -> str:
      greeting = greet("Mario")
      assert greeting == "Hello Mr. Mario Mario"
  ```

-> **You have a problem**: `greet()` calls `fetch_database()`. `fetch_database()` does some look-ups in
a database. _You haven't created that database for your tests, so your test would fail, even though
the code is correct._

- Luckily, you know that `fetch_database("Mario")` should return "Mr. Mario Mario".

  - _Hint_: Sometimes, you might not know the exact return value, but one that is equally valid and works
    with the rest of the code. In that case, just use this one.

-> **Solution**: You mock `fetch_database()`. This is also referred to as "mocking out" `fetch_database()`.

```python
from unittest.mock import patch

def test_greet() -> None:
    # Mock `fetch_database()` with an object that acts like a shell: It still accepts calls like `fetch_database()`,
    # but doesn't do any database lookup. We "fill" the shell with a return value; This value will be returned on every
    # call to `fetch_database()`.
    with patch("greetings.fetch_database", return_value="Mr. Mario Mario"):
        greeting = greetings.greet("Mario")
        assert greeting == "Hello Mr. Mario Mario"
```

That's all. Note that **this mock is suitable for testing `greet()`, but not for testing `fetch_database()`**.
More generally, you should only mock those functions you explicitly don't want to test.

#### How does mocking work under the hood?

Since Python 3.3, the standard mocking library is `unittest.mock`. `unittest.mock` implements the basic mocking class `Mock`.
It also implements `MagicMock`, which is the same as `Mock`, but contains many default magic methods (in Python,
those are the ones starting with with a dunder `__`). From the docs:

> In most of these examples the Mock and MagicMock classes are interchangeable. As the MagicMock is the more capable class
> it makes a sensible one to use by default.

`Mock` itself is a class that principally accepts and records any and all calls. A piece of code like

```python
from unittest import mock

foo = mock.Mock()
foo.bar('quux')
foo.baz
foo.qux = 42
```

is _not_ going to throw any errors. Our mock silently accepts all these calls and records them.
`Mock` also implements methods for us to access and assert its records, e.g.,

```python
foo.bar.assert_called_with('quux')
```

Finally, `unittest.mock` also provides a method to mock objects only within a scope: `patch()`. We can use `patch()` either
as a decorator or as a context manager. In both cases, the mock created by `patch()` will apply for the scope of the decorator /
context manager. `patch()` takes only one required argument `target`. `target` is a string in dot notation that _refers to
the name of the object you want to mock_. It will then assign a `MagicMock()` to that object.
As an example, look at the following code:

```python
from unittest import mock
from os import urandom

with mock.patch('__main__.urandom', return_value=42):
    print(urandom(1))
    print(urandom(1)) # No matter what value we plug in for urandom, it will always return 42.
print(urandom(1)) # We exited the context manager, so the mock doesn't apply anymore. Will return a random byte.
```

_Note that calling `mock.patch('os.urandom', return_value=42)` wouldn't work here_: `os.urandom` would be the name of our patched
object. However, we imported `urandom` with `from os import urandom`; hence, we bound the `urandom` name to our current module
`__main__`.

On the other hand, if we had used `import os.urandom`, we would need to call `mock.patch('os.urandom', return_value=42)` instead.

#### Boilerplate code

- Including the Python mocking library:

  ```python
  from unittest import mock
  ```

- Mocking a class with a context manager:

  ```python
  with mock.patch('module.ClassName', foo=42, return_value='I am a mock') as my_mock:
    # In here, 'module.ClassName' is mocked with a MagicMock() object my_mock.
    # my_mock has an attribute named foo with the value 42.
    # var = module.ClassName() will assign 'I am a mock' to var.
  ```

- Mocking a class with a decorator:

  ```python
  @mock.patch('module.ClassName', foo=42, return_value='I am a mock')
  def my_function(my_mock):
      # ...
      # In here, 'module.ClassName' will behave as in the previous example.
  ```

- Mocking a class attribute:

  ```python
  with mock.patch.object(module.ClassName, 'class_method', return_value=42)
    # In here, 'module.ClassName' has the same properties as before, except for 'class_method'
    # Calling module.ClassName.class_method() will now return 42.
  ```

  Note the missing quotes around module.ClassName in the patch.object() call.

#### Zulip mocking practices

For mocking we generally use the "mock" library and use `mock.patch` as
a context manager or decorator. We also take advantage of some context managers
from Django as well as our own custom helpers. Here is an example:

```python
with self.settings(RATE_LIMITING=True):
    with mock.patch('zerver.decorator.rate_limit_user') as rate_limit_mock:
        api_result = my_webhook(request)

self.assertTrue(rate_limit_mock.called)
```

Follow [this link](../subsystems/settings.md#testing-non-default-settings) for more
information on the "settings" context manager.

Zulip has several features, like outgoing webhooks or social
authentication, that made outgoing HTTP requests to external
servers. We test those features using the excellent
[responses](https://pypi.org/project/responses/) library, which has a
nice interface for mocking `requests` calls to return whatever HTTP
response from the external server we need for the test. you can find
examples with `git grep responses.add`. Zulip's own `HostRequestMock`
class should be used only for low-level tests for code that expects to
receive Django HttpRequest object.

## Zulip testing philosophy

If there is one word to describe Zulip's philosophy for writing tests,
it is probably "flexible." (Hopefully "thorough" goes without saying.)

When in doubt, unless speed concerns are prohibitive,
you usually want your tests to be somewhat end-to-end, particularly
for testing endpoints.

These are some of the testing strategies that you will see in the Zulip
test suite...

### Endpoint tests

We strive to test all of our URL endpoints. The vast majority of Zulip
endpoints support a JSON interface. Regardless of the interface, an
endpoint test generally follows this pattern:

- Set up the data.
- Log in with `self.login()` or set up an API key.
- Use a Zulip test helper to hit the endpoint.
- Assert that the result was either a success or failure.
- Check the data that comes back from the endpoint.

Generally, if you are doing endpoint tests, you will want to create a
test class that is a subclass of `ZulipTestCase`, which will provide
you helper methods like the following:

- api_auth
- assert_json_error
- assert_json_success
- client_get
- client_post
- get_api_key
- get_streams
- login
- send_message

### Library tests

For certain Zulip library functions, especially the ones that are
not intrinsically tied to Django, we use a classic unit testing
approach of calling the function and inspecting the results.

For these types of tests, you will often use methods like
`self.assertEqual()`, `self.assertTrue()`, etc., which come with
[unittest](https://docs.python.org/3/library/unittest.html#unittest.TestCase)
via Django.

### Fixture-driven tests

Particularly for testing Zulip's integrations with third party systems,
we strive to have a highly data-driven approach to testing. To give a
specific example, when we test our GitHub integration, the test code
reads a bunch of sample inputs from a JSON fixture file, feeds them
to our GitHub integration code, and then verifies the output against
expected values from the same JSON fixture file.

Our fixtures live in `zerver/tests/fixtures`.

### Mocks and stubs

We use mocks and stubs for all the typical reasons:

- to more precisely test the target code
- to stub out calls to third-party services
- to make it so that you can [run the Zulip tests on the airplane without wifi][no-internet]

[no-internet]: testing.md#internet-access-inside-test-suites

A detailed description of mocks, along with useful coded snippets, can be found in the section
[Testing with mocks](#testing-with-mocks).

### Template tests

In [zerver/tests/test_templates.py](https://github.com/zulip/zulip/blob/main/zerver/tests/test_templates.py)
we have a test that renders all of our backend templates with
a "dummy" context, to make sure the templates don't have obvious
errors. (These tests won't catch all types of errors; they are
just a first line of defense.)

### SQL performance tests

A common class of bug with Django systems is to handle bulk data in
an inefficient way, where the backend populates objects for join tables
with a series of individual queries that give O(N) latency. (The
remedy is often just to call `select_related()`, but sometimes it
requires a more subtle restructuring of the code.)

We try to prevent these bugs in our tests by using a context manager
called `queries_captured()` that captures the SQL queries used by
the backend during a particular operation. We make assertions about
those queries, often simply by using the `assert_database_query_count`
that checks the number of queries.

### Event-based tests

The Zulip backend has a mechanism where it will fetch initial data
for a client from the database, and then it will subsequently apply
some queued up events to that data to the data structure before notifying
the client. The `BaseAction.do_test()` helper helps tests
verify that the application of those events via apply_events() produces
the same data structure as performing an action that generates said event.

This is a bit esoteric, but if you read the tests, you will see some of
the patterns. You can also learn more about our event system in the
[new feature tutorial](../tutorials/new-feature-tutorial.md#handle-database-interactions).

### Negative tests

It is important to verify error handling paths for endpoints, particularly
situations where we need to ensure that we don't return results to clients
with improper authentication or with limited authorization. A typical test
will call the endpoint with either a non-logged in client, an invalid API
key, or missing input fields. Then the test will call `assert_json_error()`
to verify that the endpoint is properly failing.

## Testing considerations

Here are some things to consider when writing new tests:

- **Duplication** We try to avoid excessive duplication in tests.
  If you have several tests repeating the same type of test setup,
  consider making a setUp() method or a test helper.

- **Network independence** Our tests should still work if you don't
  have an internet connection. For third party clients, you can simulate
  their behavior using fixture data. For third party servers, you can
  typically simulate their behavior using mocks.

- **Coverage** We have 100% line coverage on several of our backend
  modules. You can use the `--coverage` option to generate coverage
  reports, and new code should have 100% coverage, which generally
  requires testing not only the "happy path" but also error handling
  code and edge cases. It will generate a nice HTML report that you can
  view right from your browser (the tool prints the URL where the report
  is exposed in your development environment).

  The HTML report also displays which tests executed each line, which
  can be handy for finding existing tests for a code path you're
  working on.

- **Console output** A properly written test should print nothing to
  the console; use `with self.assertLogs` to capture and verify any
  logging output. Note that we reconfigure various loggers in
  `zproject/test_extra_settings.py` where the output is unlikely to be
  interesting when running our test suite.
  `test-backend --ban-console-output` checks for stray print statements.

Note that `test-backend --coverage` will assert that
various specific files in the project have 100% test coverage and
throw an error if their coverage has fallen. One of our project goals
is to expand that checking to ever-larger parts of the codebase.
```

--------------------------------------------------------------------------------

---[FILE: testing-with-node.md]---
Location: zulip-main/docs/testing/testing-with-node.md

```text
# JavaScript/TypeScript unit tests

Our node-based unit tests system is the preferred way to test
JavaScript/TypeScript code in Zulip. We prefer it over the [Puppeteer
black-box whole-app testing](testing-with-puppeteer.md),
system since it is much (>100x) faster and also easier to do correctly
than the Puppeteer system.

You can run this test suite as follows:

```bash
tools/test-js-with-node
```

See `test-js-with-node --help` for useful options; even though the
whole suite is quite fast, it still saves time to run a single test by
name when debugging something.

The JS unit tests are written to work with node. You can find them
in `web/tests`. Here is an example test from
`web/tests/stream_data.test.cjs`:

```js
(function test_get_by_id() {
    stream_data.clear_subscriptions();
    var id = 42;
    var sub = {
        name: 'Denmark',
        subscribed: true,
        color: 'red',
        stream_id: id
    };
    stream_data.add_sub_for_tests('Denmark', sub);
    sub = stream_data.get_sub('Denmark');
    assert.equal(sub.color, 'red');
    sub = sub_store.get(id);
    assert.equal(sub.color, 'red');
}());
```

The names of the node tests generally align with the names of the
modules they test. If you modify a JS module in `web/src` you should
see if there are corresponding test in `web/tests`. If
there are, you should strive to follow the patterns of the existing tests
and add your own tests.

A good first test to read is
[example1.test.cjs](https://github.com/zulip/zulip/blob/main/web/tests/example1.test.cjs).
(And then there are several other example files.)

## How the node tests work

Unlike the [Puppeteer unit tests](testing-with-puppeteer.md),
which use a headless Chromium browser connected to a running Zulip
development server, our node unit tests don't have a browser, don't
talk to a server, and generally don't use a complete virtual DOM (a
handful of tests use the `jsdom` library for this purpose) because
those slow down the tests a lot, and often don't add much value.

Instead, the preferred model for our unit tests is to mock DOM
manipulations (which in Zulip are almost exclusively done via
`jQuery`) using a custom library
[zjquery](https://github.com/zulip/zulip/blob/main/web/tests/lib/zjquery.cjs).

The
[unit test file](https://github.com/zulip/zulip/blob/main/web/tests/zjquery.test.cjs)
for `zjquery` is designed to be also serve as nice documentation for
how to use `zjquery`, and is **highly recommended reading** for anyone
working on or debugging the Zulip node tests.

Conceptually, the `zjquery` library provides minimal versions of most
`jQuery` DOM manipulation functions, and has a convenient system for
letting you set up return values for more complex functions. For
example, if the code you'd like to test calls `$obj.find()`, you can
use `$obj.set_find_results(selector, $value)` to set up `zjquery` so
that calls to `$obj.find(selector)` will return `$value`. See the unit
test file for details.

This process of substituting `jQuery` functions with our own code for
testing purposes is known as "stubbing". `zjquery` does not stub all
possible interactions with the dom, as such, you may need to write out
the stub for a function you're calling in your patch. Typically the stub
is just placed in the test file, to prevent bloating of `zjquery`
with functions that are only used in a single test.

If you need to stub, you will see an error of this form:
`Error: You must create a stub for $("#foo").bar`

The `zjquery` library itself is only about 500 lines of code, and can
also be a useful resource if you're having trouble debugging DOM
access in the unit tests.

It is typically a good idea to figure out how to stub a given function
based on how other functions have been stubbed in the same file.

## Handling dependencies in unit tests

The other big challenge with doing unit tests for a JavaScript project
is that often one wants to limit the scope the production code being
run, just to avoid doing extra setup work that isn't relevant to the
code you're trying to test. For that reason, each unit test file
explicitly declares all of the modules it depends on, with a few
different types of declarations depending on whether we want to:

- Exercise the module's real code for deeper, more realistic testing?
- Stub out the module's interface for more control, speed, and
  isolation?
- Do some combination of the above?

For all the modules where you want to run actual code, add statements
like the following toward the top of your test file:

```js
zrequire('util');
zrequire('stream_data');
zrequire('Filter', 'js/filter');
```

For modules that you want to completely stub out, use a pattern like
this:

```js
const reminder = mock_esm("../../web/src/reminder", {
    is_deferred_delivery: noop,
});

// then maybe further down
reminder.is_deferred_delivery = () => true;
```

One can similarly stub out functions in a module's exported interface
with either `noop` functions or actual code.

Finally, there's the hybrid situation, where you want to borrow some
of a module's real functionality but stub out other pieces. Obviously,
this is a pretty strong code smell that the other module might be
lacking in cohesion, but sometimes it's not worth going down the
rabbit hole of trying to improve that. The pattern here is this:

```js
// Import real code.
zrequire('narrow_state');

// And later...
narrow_state.stream = function () {
    return 'office';
};
```

## Creating new test modules

The test runner (`index.cjs`) automatically runs all .test.cjs files in the
`web/tests` directory, so you can simply start editing a file
in that directory to create a new test.

## Verifying HTML templates with `mock_template`

As a project, we prefer [end-to-end
testing][testing-philosophy-end-to-end] where possible, since those
tests are usually both more effective at catching bugs and cheaper to
maintain than tests that make heavy use of mocks.

One place where mocks can often be useful is when testing logic for
rendering an HTML template in Zulip. The interesting logic that one
wants to verify can be split between two places:

- Computing the **context data** object passed into the HTML template.
- Conditional logic in the HTML template itself.

It can work well to write tests that verify properties of the computed
HTML template, for example, is a given CSS class present in the
result.

But often, one can write a more readable test by instead verifying
the values of parameters in the context passed into the template
rendering. The `mock_template` function in Zulip's testing library
is designed to support this this.

We use `mock_template` in our unit tests to verify that the JS code is
calling the template with the expected context data. And then we use
the results of mock_template to supply the JS code with either the
actual HTML from the template or some kind of zjquery stub.

The `mock_template` function accepts 3 parameters:

- The path within `web/templates` to the [Handlebars
  template](../subsystems/html-css.md) that you'd like to mock.
- Whether to call the actual template rendering function so that you
  can verify the HTML generated by this specific template. Since
  Handlebars rendering in tests takes time and rarely catches bugs, we
  recommend using `false` if you're only planning to check the context
  data.
- A callback function that you can use to include assertions about
  what parameters were passed into the template. This function
  receives a `data` parameter, with the context data, and an `html`
  parameter if the real template was rendered.

The following illustrates the two common patterns for using this method.

```js
run_test("test something calling template", ({mock_template}) => {
    mock_template("path/to/template.hbs", false, (data) => {
        assert.deepEqual(data, {...};
        // or assert.deepEqual(data.foo, {...});
        return "stub-for-zjquery";
    });

    mock_template("path/to/template.hbs", true, (data, html) => {
        assert.deepEqual(data, {...};
        assert.ok(html.startWith(...));
        return html;
    });
});
```

[testing-philosophy-end-to-end]: https://zulip.readthedocs.io/en/stable/testing/philosophy.html#integration-testing-or-unit-testing

## Coverage reports

You can automatically generate coverage reports for the JavaScript unit
tests like this:

```bash
tools/test-js-with-node --coverage
```

If tests pass, you will get instructions to view coverage reports
in your browser.

Note that modules that we don't test _at all_ aren't listed in the
report, so this tends to overstate how good our overall coverage is,
but it's accurate for individual files. You can also click a filename
to see the specific statements and branches not tested. 100% branch
coverage isn't necessarily possible, but getting to at least 80%
branch coverage is a good goal.

The overall project goal is to get to 100% node test coverage on all
data/logic modules (UI modules are lower priority for unit testing).

## Editor debugger integration

Our node test system is pretty simple, and it's possible to configure
the native debugger features of popular editors to allow stepping
through the code. Below we document the editors where someone has put
together detailed instructions for how to do so. Contributions of
notes for other editors are welcome!

## Webstorm integration setup

These instructions assume you're using the Vagrant development environment.

1. Set up [Vagrant in WebStorm][vagrant-webstorm].

2. In WebStorm, navigate to `Preferences -> Tools -> Vagrant` and
   configure the following:

   - `Instance folder` should be the root of the `zulip` repository on
     your host (where the Vagrantfile is located).
   - `Provider` should be `virtualbox` on macOS and Docker on Linux
   - In `Boxes`, choose the one used for Zulip (unless you use
     Virtualbox for other things, there should only be one option).

   You shouldn't need to set these additional settings:

   - `Vagrant executable` should already be correctly `vagrant`.
   - `Environment Variables` is not needed.

3. You'll now need to set up a WebStorm "Debug Configuration". Open
   the `Run/Debug Configuration` menu and create a new `Node.js` config:
   1. Under `Node interpreter:` click the 3 dots to the right side and
      click on the little plus in the bottom left of the
      `Node.js Interpreters` window.
   1. Select `Add Remote...`.
      1. In the `Configure Node.js Remote Interpreter`, window select `Vagrant`
      1. Wait for WebStorm to connect to Vagrant. This will be displayed
         by the `Vagrant Host URL` section updating to contain the Vagrant
         SSH URL, e.g., `ssh://vagrant@127.0.0.1:2222`.
      1. **Set the `Node.js interpreter path` to `/usr/local/bin/node`**
      1. Hit `OK` 2 times to get back to the `Run/Debug Configurations` window.
   1. Under `Working Directory` select the root `zulip` directory.
   1. Under `JavaScript file`, enter `web/tests/lib/index.cjs`
      -- this is the root script for Zulip's node unit tests.

Congratulations! You've now set up the integration.

## Running tests with the debugger

To use Webstorm to debug a given node test file, do the following:

1. Under `Application parameters` choose the node test file that you
   are trying to test (e.g., `web/tests/message_store.test.cjs`).
1. Under `Path Mappings`, set `Project Root` to `/srv/zulip`
   (i.e. where the `zulip` Git repository is mounted in the Vagrant guest).
1. Use the WebStorm debugger; see [this overview][webstorm-debugging]
   for details on how to use it.

[webstorm-debugging]: https://blog.jetbrains.com/webstorm/2018/01/how-to-debug-with-webstorm/
[vagrant-webstorm]: https://www.jetbrains.com/help/webstorm/vagrant-support.html?section=Windows%20or%20Linux
```

--------------------------------------------------------------------------------

---[FILE: testing-with-puppeteer.md]---
Location: zulip-main/docs/testing/testing-with-puppeteer.md

```text
# Web frontend black-box Puppeteer tests

While our [node test suite](testing-with-node.md) is the
preferred way to test most frontend code because they are easy to
write and maintain, some code is best tested in a real browser, either
because of navigation (e.g., login) or because we want to verify the
interaction between Zulip logic and browser behavior (e.g., copy/paste,
keyboard shortcuts, etc.).

## Running tests

You can run this test suite as follows:

```bash
tools/test-js-with-puppeteer
```

See `tools/test-js-with-puppeteer --help` for useful options,
especially running specific subsets of the tests to save time when
debugging.

The test files live in `web/e2e-tests` and make use
of various useful helper functions defined in
`web/e2e-tests/lib/common.ts`.

## How Puppeteer tests work

The Puppeteer tests use a real Chromium browser (powered by
[puppeteer](https://github.com/puppeteer/puppeteer)), connected to a
real Zulip development server. These are black-box tests: Steps in a
Puppeteer test are largely things one might do as a user of the Zulip
web app, like "Type this key", "Wait until this HTML element
appears/disappears", or "Click on this HTML element".

For example, this function might test the `x` keyboard shortcut to
open the compose box for a new direct message:

```js
async function test_private_message_compose_shortcut(page) {
    await page.keyboard.press("KeyX");
    await page.waitForSelector("#private_message_recipient", {visible: true});
    await common.pm_recipient.expect(page, "");
    await close_compose_box(page);
}
```

The test function presses the `x` key, waits for the
`#private_message_recipient` input element to appear, verifies its
content is empty, and then closes the compose box. The
`waitForSelector` step here (and in most tests) is critical; tests
that don't wait properly often fail nonderministically, because the
test will work or not depending on whether the browser updates the UI
before or after executing the next step in the test.

Black-box tests are fantastic for ensuring the overall health of the
project, but are also slow, costly to maintain, and require care to
avoid nondeterministic failures, so we usually prefer to write a Node
test instead when both are options.

They also can be a bit tricky to understand for contributors not
familiar with [async/await][learn-async-await].

## Debugging Puppeteer tests

The following questions are useful when debugging Puppeteer test
failures you might see in [continuous
integration](continuous-integration.md):

- Does the flow being tested work properly in the Zulip browser UI?
  Test failures can reflect real bugs, and often it's easier and more
  interactive to debug an issue in the normal Zulip development
  environment than in the Puppeteer test suite.
- Does the change being tested adjust the HTML structure in a way that
  affects any of the selectors used in the tests? If so, the test may
  just need to be updated for your changes.
- Does the test fail deterministically when you run it locally using
  e.g., `./tools/test-js-with-puppeteer compose.ts`? If so, you can
  iteratively debug to see the failure.
- Does the test fail nondeterministically? If so, the problem is
  likely that a `waitForSelector` statement is either missing or not
  waiting for the right thing. Tests fail nondeterministically much
  more often on very slow systems like those used for Continuous
  Integration (CI) services because small races are amplified in those
  environments; this often explains failures in CI that cannot be
  easily reproduced locally.
- Does the test fail when you are typing (filling the form) on a modal
  or other just-opened UI widget? Puppeteer starts typing after focusing on
  the text field, sending keystrokes one after another. So, if
  application code explicitly focuses the modal after it
  appears/animates, this could cause the text field that Puppeteer is
  trying to type into to lose focus, resulting in partially typed data.
  The recommended fix for this is to wait until the modal is focused before
  starting typing, like this:
  ```JavaScript
  await page.waitForFunction(":focus").attr("id") === modal_id);
  ```

These tools/features are often useful when debugging:

- You can use `console.log` statements both in Puppeteer tests and the
  code being tested to print-debug.
- Zulip's Puppeteer tests are configured to generate screenshots of
  the state of the test browser when an assert statement fails; these
  are stored under `var/puppeteer/*.png` and are extremely helpful for
  debugging test failures.
- TODO: Mention how to access Puppeteer screenshots in CI.
- TODO: Add an option for using the `headless: false` debugging mode
  of Puppeteer so you can watch what's happening, and document how to
  make that work with Vagrant.
- TODO: Document `--interactive`.
- TODO: Document how to run 100x in CI to check for nondeterministic
  failures.
- TODO: Document any other techniques/ideas that were helpful when porting
  the Casper suite.
- The Zulip server powering these tests is just `run-dev` with some
  extra [Django settings](../subsystems/settings.md) from
  `zproject/test_extra_settings.py` to configure an isolated database
  so that the tests will not interfere/interact with a normal
  development environment. The console output while running the tests
  includes the console output for the server; any Python exceptions
  are likely actual bugs in the changes being tested.

See also [Puppeteer upstream's debugging
tips](https://github.com/puppeteer/puppeteer#debugging-tips); some
tips may require temporary patches to functions like `run_test` or
`ensure_browser` in `web/e2e-tests/lib/common.ts`.

## Writing Puppeteer tests

Probably the easiest way to learn how to write Puppeteer tests is to
study some of the existing test files. There are a few tips that can
be useful for writing Puppeteer tests in addition to the debugging
notes above:

- Run just the file containing your new tests as described above to
  have a fast debugging cycle.
- When you're done writing a test, run it 100 times in a loop to
  verify it does not fail nondeterministically (see above for notes on
  how to get CI to do it for you); this is important to avoid
  introducing extremely annoying nondeterministic failures into
  `main`.
- With black-box browser tests like these, it's very important to write your code
  to wait for browser's UI to update before taking any action that
  assumes the last step was processed by the browser (e.g., after you
  click on a user's avatar, you need an explicit wait for the profile
  popover to appear before you can try to click on a menu item in that
  popover). This means that before essentially every action in your
  Puppeteer tests, you'll want to use `waitForSelector` or similar
  wait function to make sure the page or element is ready before you
  interact with it. The [puppeteer docs site](https://pptr.dev/) is a
  useful reference for the available wait functions.
- When using `waitForSelector`, you always want to use the
  `{visible: true}` option; otherwise the test will stop waiting as
  soon as the target selector is present in the DOM even if it's
  hidden. For the common UI pattern of having an element always be
  present in the DOM whose presence is managed via show/hide rather
  than adding/removing it from the DOM, `waitForSelector` without
  `visible: true` won't wait at all.
- The test suite uses a smaller set of default user accounts and other
  data initialized in the database than the normal development
  environment; specifically, it uses the same setup as the [backend
  tests](testing-with-django.md). To see what differs from
  the development environment, check out the conditions on
  `options["test_suite"]` in
  `zilencer/management/commands/populate_db.py`.

[learn-async-await]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
```

--------------------------------------------------------------------------------

````
