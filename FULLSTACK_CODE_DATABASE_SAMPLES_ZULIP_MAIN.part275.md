---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 275
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 275 of 1290)

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

---[FILE: api-release-checklist.md]---
Location: zulip-main/docs/subsystems/api-release-checklist.md

```text
# Zulip PyPI packages release checklist

Zulip manages the following three PyPI packages from the
[zulip/python-zulip-api][python-zulip-api] repository:

- [zulip][zulip-package]: The package containing the
  [Zulip API](https://zulip.com/api/) Python bindings.
- [zulip_bots][zulip-bots-package]: The package containing
  [Zulip's interactive bots](https://zulip.com/api/running-bots).
- [zulip_botserver][zulip-botserver-package]: The package for Zulip's Botserver.

The `python-zulip-api` packages are often released all together. Here is a
checklist of things one must do before making a PyPI release:

1. Increment `__version__` in `zulip/__init__.py`, `ZULIP_BOTS_VERSION` in
   `zulip_bots/setup.py`, and `ZULIP_BOTSERVER_VERSION` in
   `zulip_botserver/setup.py`. They should all be set to the same version
   number.

2. Set `IS_PYPA_PACKAGE` to `True` in `zulip_bots/setup.py`. **Note**:
   Setting this constant to `True` prevents `setup.py` from including content
   that should not be a part of the official PyPI release, such as logos,
   assets and documentation files. However, this content is required by the
   [Zulip server repo][zulip-repo] to render the interactive bots on
   [Zulip's integrations page](https://zulip.com/integrations/). The server
   repo installs the `zulip_bots` package
   directly from the GitHub repository so that this extra
   content is included in its installation of the package.

3. Follow PyPI's instructions in
   [Generating distribution archives][generating-dist-archives] to generate the
   archives for each package. It is recommended to manually inspect the build output
   for the `zulip_bots` package to make sure that the extra files mentioned above
   are not included in the archives.

4. Follow PyPI's instructions in [Uploading distribution archives][upload-dist-archives]
   to upload each package's archives to TestPyPI, which is a separate instance of the
   package index intended for testing and experimentation. **Note**: You need to
   [create a TestPyPI](https://test.pypi.org/account/register/) account for this step.

5. Follow PyPI's instructions in [Installing your newly uploaded package][install-pkg]
   to test installing all three packages from TestPyPI.

6. If everything goes well in step 5, you may repeat step 4, except this time, upload
   the packages to the actual Python Package Index.

7. Once the packages are uploaded successfully, set `IS_PYPA_PACKAGE` to `False` in
   `zulip_bots/setup.py` and commit your changes with the version increments. Push
   your commit to `python-zulip-api`. Create a release tag and push the tag as well.
   See [the tag][example-tag] and [the commit][example-commit] for the 0.8.1 release
   to see an example.

Now it is time to [update the dependencies](dependencies) in the
[Zulip server repository][zulip-repo]:

1. Increment `PROVISION_VERSION` in `version.py`. A minor version bump should suffice in
   most cases.

2. Update the release tags in the Git URLs for `zulip` and `zulip_bots` in
   `pyproject.toml`.

3. Run `uv lock` to update the Python lock file.

4. Commit your changes and submit a PR! **Note**: See
   [this example commit][example-zulip-commit] to get an idea of what the final change
   looks like.

## Other PyPI packages maintained by Zulip

Zulip also maintains two additional PyPI packages:

- [fakeldap][fakeldap]: A simple package for mocking LDAP backend servers
  for testing.
- [virtualenv-clone][virtualenvclone]: A package for cloning a non-relocatable
  virtualenv.

The release process for these two packages mirrors the release process for the
`python-zulip-api` packages, minus the steps specific to `zulip_bots` and the
update to dependencies required in the [Zulip server repo][zulip-repo].

[zulip-repo]: https://github.com/zulip/zulip
[python-zulip-api]: https://github.com/zulip/python-zulip-api
[zulip-package]: https://github.com/zulip/python-zulip-api/tree/main/zulip
[zulip-bots-package]: https://github.com/zulip/python-zulip-api/tree/main/zulip_bots
[zulip-botserver-package]: https://github.com/zulip/python-zulip-api/tree/main/zulip_botserver
[generating-dist-archives]: https://packaging.python.org/en/latest/tutorials/packaging-projects/#generating-distribution-archives
[upload-dist-archives]: https://packaging.python.org/en/latest/tutorials/packaging-projects/#uploading-the-distribution-archives
[install-pkg]: https://packaging.python.org/en/latest/tutorials/packaging-projects/#installing-your-newly-uploaded-package
[example-tag]: https://github.com/zulip/python-zulip-api/releases/tag/0.8.1
[example-commit]: https://github.com/zulip/python-zulip-api/commit/fec8cc50c42f04c678a0318f60a780d55e8f382b
[example-zulip-commit]: https://github.com/zulip/zulip/commit/0485aece4e58a093cf45163edabe55c6353a0b3a#
[fakeldap]: https://github.com/zulip/fakeldap
[virtualenvclone]: https://pypi.org/project/virtualenv-clone/
```

--------------------------------------------------------------------------------

---[FILE: billing.md]---
Location: zulip-main/docs/subsystems/billing.md

```text
# Billing (Development)

This section deals with developing and testing the billing system.

## Common setup

- Create a Stripe account
  - Make sure that the country of your Stripe account is set to USA when
    you create the account.
  - You might need to use a VPN for this.
- Ensure that the [API version](https://stripe.com/docs/api/versioning) of
  your Stripe account is same as `STRIPE_API_VERSION` defined in
  `corporate/lib/stripe.py`. You can upgrade to a higher version from
  the Stripe dashboard.
- Set the private API key.
  - Go to <https://dashboard.stripe.com/test/apikeys>
  - Double-check that you're viewing test API keys (not live keys) to avoid
    actual charges while testing code.
  - Add `stripe_secret_key` to `zproject/dev-secrets.conf`.

## Manual testing

Manual testing involves testing the various flows like upgrade, card change,
etc. through the browser. This is the bare minimum testing that you need to
do when you review a billing PR or when you are working on adding a new
feature to billing.

### Setup

Apart from the common setup mentioned above, you also need to set up your
development environment to receive webhook events from Stripe.

- Install the Stripe CLI locally by following the instructions
  [here](https://stripe.com/docs/stripe-cli).
- Log in to Stripe CLI using the command `stripe login`.
- You can get Stripe CLI to forward all Stripe webhook events to our local
  webhook endpoint using the following command:
  `stripe listen --forward-to http://localhost:9991/stripe/webhook/`
- Note that the webhook secret key needs to be updated every 90 days following
  the steps [here](https://stripe.com/docs/stripe-cli#install).
- Wait for the `stripe listen` command in the previous step to output the
  webhook signing secret.
  - The signing secret would be used by our billing system to verify that
    the events received by our webhook endpoint are sent by Stripe and not
    by an intruder. In production, there is no Stripe CLI, so the step for
    configuring this is a bit different. See Stripe's documentation on
    [taking webhooks live](https://stripe.com/docs/webhooks/go-live) for
    more details.
- Copy the webhook signing secret and set it as `stripe_webhook_endpoint_secret`
  in `zproject/dev-secrets.conf`.
- Your development environment is now all set to receive webhook events from
  Stripe.
- With `tools/run-dev` stopped, you can run `./manage.py
populate_billing_realms` to populate different billing states, both
  Cloud and Self-hosted, with various initial plans and billing schedules.
- Feel free to modify `populate_billing_realms` to add more states if they
  seem useful in your testing. After running the command, you will see a list of
  populated organizations.
- Populated Cloud-style `Realms` can be accessed as follows:
  - Logout and go to `localhost:9991/devlogin`.
  - Select the realm from the `Realms` dropdown you wist to test.
  - Login as the only available user.
  - Go to `/billing`.
- Populated `RemoteZulipServer` customers can be accessed by going to
  `http://selfhosting.localhost:9991/serverlogin/` and providing the
  credentials in the login form for the server state you wish to
  test. The credentials are printed in the terminal by `./manage.py
populate_billing_realms`.
- Populated `RemoteRealm` customers can be accessed simply by follow
  their links printed in the terminal in the `./manage.py
populate_billing_realms` output.

### Test card numbers

Stripe provides various card numbers to test for specific responses from Stripe.
The most commonly used ones are mentioned in below wherever appropriate. The full
list is available [here](https://stripe.com/docs/testing#cards).

### Flows to test

There are various flows that you can test manually from the browser. Here are
a few things to keep in mind while conducting these tests manually:

- The flows work from start to end as expected.
- We show appropriate success and error messages to users.
- Charges are made or not made (free trial) as expected. You can verify this
  through the Stripe dashboard. However, this is not super important since
  our automated tests take care of such granular testing for us.
- Renewals can be tested by calling `./manage.py invoice_plans --date
2024-04-30T08:12:53` -- this will run invoicing, including
  end-of-cycle updates, as though the current date is as specified.

#### Upgrading a Zulip Cloud organization

Here are some flows to test when upgrading a Zulip Cloud organization:

- When free trials are not enabled, i.e. `CLOUD_FREE_TRIAL_DAYS` is not set
  to any value in `dev_settings.py` (aka the default). You can
  double-check that the setting is disabled by verifying
  `./scripts/get-django-setting CLOUD_FREE_TRIAL_DAYS` returns 0.

  - Using a valid card number like `4242 4242 4242 4242`, the
    official Visa example credit card number.
  - Using an invalid card number like `4000000000000341`, which will add the card
    to the customer account but the charge will fail.
    - Retry the upgrade after adding a new card by clicking on the retry upgrade
      link.
    - Retry the upgrade from scratch.

- Upgrade an organization when free trials are enabled. The free
  trials setting has been (possibly permanently) disabled in
  production for some time now, so testing this code path is not a
  priority. You can set `CLOUD_FREE_TRIAL_DAYS` to any number greater than
  `0` in `dev_settings.py` to enable free trials. There are two
  different flows to test here:
  - Right after the organization is created by following the instructions in the
    onboarding page.
    - Make sure that after the upgrade is complete the billing page shows a link to
      go to the organization.
  - By manually going to the `/billing` page and upgrading the organization.

#### Upgrading a remote Zulip organization

Here are some flows to test when upgrading a remote Zulip organization:

- Free trial for remote organizations is enabled by default by setting
  `SELF_HOSTING_FREE_TRIAL_DAYS` to `30` days. You can change this
  value and other settings for your development environment only in
  `zproject/custom_dev_settings.py`, or secrets in
  `zproject/dev-secrets.conf`. Note that this only provides free trail
  for the basic plan.

  - Using a valid card number like `4242 4242 4242 4242`, the
    official Visa example credit card number.
  - Using an invalid card number like `4000000000000341`, which will add the card
    to the customer account but the charge will fail.
    - Retry the upgrade after adding a new card by clicking on the retry upgrade
      link.
    - Retry the upgrade from scratch.

- Try upgrading to Zulip Business using `Pay by card` as described above or
  `Pay by Invoice`.

#### Changing the card

The following flow should be tested when updating cards in our billing system:

- Go to the `/billing` page of an organization that has already been upgraded
  using a card. Try changing the card to another valid card such as
  `5555555555554444`.
  - Make sure that the flow completes without any errors and that the new card
    details are now shown on the billing page instead of the older card.
- You can also try adding a card number that results in it getting attached to
  the customer's account but charges fail. However, to test this, you need pending
  invoices since we try to charge for pending invoices when the card is updated.
  This is tested in our automated tests so it is not strictly necessary to test this
  manually.

## Upgrading Stripe API versions

Stripe makes pretty regular updates to their API. The process for upgrading
our code is:

- Go to the [Stripe Dashboard](https://dashboard.stripe.com/developers) in
  your Stripe account.
- Upgrade the API version.
- Run `tools/test-backend --generate-stripe-fixtures --parallel=1 corporate/`.
- Fix any failing tests, and manually look through `git diff` to understand
  the changes. Ensure that there are no material changes.
- Update the value of `STRIPE_API_VERSION` in `corporate/lib/stripe.py`.
- Commit the changes, and open a PR.
- Ask Tim Abbott to upgrade the API version on the
  [Stripe Dashboard](https://dashboard.stripe.com/developers) for Zulip's official
  Stripe account.

We currently aren't set up to do version upgrades where there are breaking
changes, though breaking changes should be unlikely given the parts of the
product we use. The main remaining work for handling breaking version upgrades
is ensuring that we set the stripe version in our API calls.
Stripe's documentation for
[Upgrading your API version](https://stripe.com/docs/upgrades#how-can-i-upgrade-my-api)
has some additional information.

## Writing tests

Writing new tests is fairly easy. Most of the tests are placed in
`test_stripe`. If you need do API calls to stripe, wrap the test
function in `@mock_stripe` and run `tools/test-backend TEST_NAME
--generate-stripe-fixtures`. It will run all your calls and generate
fixtures for any API calls to stripe, so that they can be used to
consistently run that test offline. You can then commit the new test
fixtures along with your code changes.

Regenerating the fixtures for all of our existing billing tests is
expensive, in that it creates extremely large diffs from editing
dates/IDs that grow the zulip/zulip Git repository and make PRs harder
to read, both visually and by making the GitHub UI very slow.

So you should generally aim to only (re)generate fixtures where it's
necessary, such as when we change how we're calling some Stripe APIs
or adding new tests.

So you'll usually want to pass `--generate-stripe-fixtures` only when
running the tests for a specific set of tests whose behavior you know
that you changed. Once you've committed those changes, you can verify
that everything would pass if new fixtures were generated as follows:

- Run `tools/test-backend corporate/ --generate-stripe-fixtures`.
- If it passes, you can just run `git reset --hard` to drop the
  unnecessary fixture updates.
- If it fails, you can do the same, but then rerun the tests that
  failed with `--generate-stripe-fixtures` as you debug them.
- In either case, you can skip the diffs for any unexpected changes in
  payloads before dropping them, though it's pretty painful to do so
  given how many files have IDs change.
```

--------------------------------------------------------------------------------

---[FILE: caching.md]---
Location: zulip-main/docs/subsystems/caching.md

```text
# Caching in Zulip

Like any product with good performance characteristics, Zulip makes
extensive use of caching. This article talks about our caching
strategy, focusing on how we use `memcached` (since it's the thing
people generally think about when they ask about how a server does
caching).

## Backend caching with memcached

On the backend, Zulip uses `memcached`, a popular key-value store, for
caching. Our `memcached` caching helps let us optimize Zulip's
performance and scalability, since we often avoid overhead related
to database requests. With Django a typical trivial query can
often take 3-10x as long as a memcached fetch.

We use Django's built-in caching integration to manage talking to
memcached, and then a small application-layer library
(`zerver/lib/cache.py`).

It's common for projects using a caching system like `memcached` to
either have the codebase littered with explicit requests to interact
with the cache (or flush data from a cache), or (worse) be littered
with weird bugs that disappear after you flush memcached.

Caching bugs are a pain to track down, because they generally require
an extra and difficult-to-guess step to reproduce (namely, putting the
wrong data into the cache).

So we've designed our backend to ensure that if we write a small
amount of Zulip's core caching code correctly, then the code most developers
naturally write will both benefit from caching and not create any cache
consistency problems.

The overall result of this design is that for many places in the
Zulip's Django codebase, all one needs to do is call the standard
accessor functions for data (like `get_user` to fetch
user objects, or, for view code, functions like
`access_stream_by_id`, which checks permissions), and everything will
work great. The data fetches automatically benefit from `memcached`
caching, since those accessor methods have already been written to
transparently use Zulip's memcached caching system, and the developer
doesn't need to worry about whether the data returned is up-to-date:
it is. In the following sections, we'll talk about how we make this
work.

As a side note, the policy of using these accessor functions wherever
possible is a good idea, regardless of caching, because the functions
also generally take care of details you might not think about
(e.g., case-insensitive matching of channel names or email addresses).
It's amazing how slightly tricky logic that's duplicated in several
places invariably ends up buggy in some of those places, and in
aggregate we call these accessor functions hundreds of times in
Zulip. But the caching is certainly a nice bonus.

### The core implementation

The `get_user` function is a pretty typical piece of code using this
framework; as you can see, it's very little code on top of our
`cache_with_key` decorator:

```python
def user_profile_by_email_realm_id_cache_key(email: str, realm_id: int) -> str:
    return f"user_profile:{hashlib.sha1(email.strip().encode()).hexdigest()}:{realm_id}"

def user_profile_by_email_realm_cache_key(email: str, realm: "Realm") -> str:
    return user_profile_by_email_realm_id_cache_key(email, realm.id)

@cache_with_key(user_profile_by_email_realm_cache_key, timeout=3600 * 24 * 7)
def get_user(email: str, realm: Realm) -> UserProfile:
    # A small amount of complexity, of prefetching additional relationd objects,
    # has been trimmed here
    return UserProfile.objects.get(email__iexact=email.strip(), realm=realm)
```

This decorator implements a pretty classic caching paradigm:

- The `user_profile_by_email_realm_id_cache_key` function defines a
  unique map from a canonical form of its arguments to a string. These
  strings are namespaced (the `user_profile:` part) so that they won't
  overlap with other caches, and encode the arguments so that two uses
  of this cache won't overlap. In this case, a hash of the email
  address and realm ID are those canonicalized arguments. (The
  `make_safe_digest` is important to ensure we don't send special
  characters to memcached). And we have two versions, depending
  whether the caller has access to a `Realm` or just a `realm_id`.
- When `get_user` is called, `cache_with_key` will compute the key,
  and do a Django `cache_get` query for the key (which goes to
  memcached). If the key is in the cache, it just returns the value.
  Otherwise, it fetches the value from the database (using the actual
  code in the body of `get_user`), and then stores the value back to
  that memcached key before returning the result to the caller.
- Cache entries expire after the timeout; in this case, a week.
  Though in frequently deployed environments like chat.zulip.org,
  often cache entries will stop being used long before that, because
  `KEY_PREFIX` is rotated every time we deploy to production; see
  below for details.

We use this decorator in about 30 places in Zulip, and it saves a
huge amount of otherwise very self-similar caching code.

### Cautions

The one thing to be really careful with in using `cache_with_key` is
that if an item is in the cache, the body of `get_user` (above) is
never called. This means some things that might seem like clever code
reuse are actually a really bad idea. For example:

- Don't add a `get_active_user` function that uses the same cache key
  function as `get_user` (but with a different query that filters our
  deactivated users). If one called `get_active_user` to access a
  deactivated user, the right thing would happen, but if you called
  `get_user` to access that user first, then the `get_active_user`
  function would happily return the user from the cache, without ever
  doing your more restrictive query.

So remember: Use separate cache key functions for different data sets,
even if they feature the same objects.

### Cache invalidation after writes

The caching strategy described above works pretty well for anything
where the state it's storing is immutable (i.e. never changes). With
mutable state, one needs to do something to ensure that the Python
processes don't end up fetching stale data from the cache after a
write to the database.

We handle this using Django's longstanding
[post_save signals][post-save-signals] feature. Django signals let
you configure some code to run every time Django does something (for
`post_save`, right after any write to the database using Django's
`.save()`).

There's a handful of lines in `zerver/models/*.py` like these that
configure this:

```python
post_save.connect(flush_realm, sender=Realm)
post_save.connect(flush_user_profile, sender=UserProfile)
```

Once this `post_save` hook is registered, whenever one calls
`user_profile.save(...)` with a UserProfile object in our Django
project, Django will call the `flush_user_profile` function. Zulip is
systematic about using the standard Django `.save()` function for
modifying `user_profile` objects (and passing the `update_fields`
argument to `.save()` consistently, which encodes which fields on an
object changed). This means that all we have to do is write those
cache-flushing functions correctly, and people writing Zulip code
won't need to think about (or even know about!) the caching.

Each of those flush functions basically just computes the list of
cache keys that might contain data that was modified by the
`.save(...)` call (based on the object changed and the `update_fields`
data), and then sends a bulk delete request to `memcached` to remove
those keys from the cache (if present).

Maintaining these flush functions requires some care (every time we
add a new cache, we need to look through them), but overall it's a
pretty simple algorithm: If the changed data appears in any form in a
given cache key, that cache key needs to be cleared. E.g., the
`active_user_ids_cache_key` cache for a realm needs to be flushed
whenever a new user is created in that realm, or user is
deactivated/reactivated, even though it's just a list of IDs and thus
doesn't explicitly contain the `is_active` flag.

Once you understand how that works, it's pretty easy to reason about
when a particular flush function should clear a particular cache; so
the main thing that requires care is making sure we remember to reason
about that when changing cache semantics.

But the overall benefit of this cache system is that almost all the
code in Zulip just needs to modify Django model objects and call
`.save()`, and the caching system will do the right thing.

### Production deployments and database migrations

When upgrading a Zulip server, it's important to avoid having one
version of the code interact with cached objects from another version
that has a different data layout. In Zulip, we avoid this through
some clever caching strategies. Each "deployment directory" for Zulip
in production has inside it a `var/remote_cache_prefix` file,
containing a cache prefix (`KEY_PREFIX` in the code) that is
automatically appended to the start of any cache keys accessed by that
deployment directory (this is all handled internally by
`zerver/lib/cache.py`).

This completely solves the problem of potentially having contamination
from inconsistent versions of the source code / data formats in the cache.

### Automated testing and memcached

For Zulip's `test-backend` unit tests, we use the same strategy. In
particular, we just edit `KEY_PREFIX` before each unit test; this
means each of the thousands of test cases in Zulip has its own
independent memcached key namespace on each run of the unit tests. As
a result, we never have to worry about memcached caching causing
problems across multiple tests.

This is a really important detail. It makes it possible for us to do
assertions in our tests on the number of database queries or memcached
queries that are done as part of a particular function/route, and have
those checks consistently get the same result (those tests are great
for catching bugs where we accidentally do database queries in a
loop). And it means one can debug failures in the test suite without
having to consider the possibility that memcached is somehow confusing
the situation.

Further, this `KEY_PREFIX` model means that running the backend tests
won't potentially conflict with whatever you're doing in a Zulip
development environment on the same machine, which also saves a ton of
time when debugging, since developers don't need to think about things
like whether some test changed Hamlet's email address and that's why
login is broken.

More full-stack test suites like `test-js-with-puppeteer` or `test-api`
use a similar strategy (set a random `KEY_PREFIX` at the start of the
test run).

### Manual testing and memcached

Zulip's development environment will automatically flush (delete all
keys in) `memcached` when provisioning and when starting `run-dev`.
You can run the server with that behavior disabled using
`tools/run-dev --no-clear-memcached`.

### Performance

One thing be careful about with memcached queries is to avoid doing
them in loops (the same applies for database queries!). Instead, one
should use a bulk query. We have a fancy function,
`generate_bulk_cached_fetch`, which is super magical and handles this
for us, with support for a bunch of fancy features like marshalling
data before/after going into the cache (e.g., to compress `message`
objects to minimize data transfer between Django and memcached).

## In-process caching in Django

We generally try to avoid in-process backend caching in Zulip's Django
codebase, because every Zulip production installation involves
multiple servers. We do have a few, however:

- `@return_same_value_during_entire_request`: We use this decorator to
  cache values in memory during the lifetime of a request. We use this
  for linkifiers and display recipients. The middleware knows how to
  flush the relevant in-memory caches at the start of a request.
- Caches of various data, like the `SourceMap` object, that are
  expensive to construct, not needed for most requests, and don't
  change once a Zulip server has been deployed in production.

## Browser caching of state

Zulip makes extensive use of caching of data in the browser and mobile
apps; details like which users exist, with metadata like names and
avatars, similar details for channels, recent message history, etc.

This data is fetched in the `/register` endpoint (or `page_params`
for the web app), and kept correct over time. The key to keeping these
state up to date is Zulip's
[real-time events system](events-system.md), which
allows the server to notify clients whenever state that might be
cached by clients is changed. Clients are responsible for handling
the events, updating their state, and rerendering any UI components
that might display the modified state.

[post-save-signals]: https://docs.djangoproject.com/en/5.0/ref/signals/#post-save
```

--------------------------------------------------------------------------------

---[FILE: client.md]---
Location: zulip-main/docs/subsystems/client.md

```text
# Clients in Zulip

`zerver.models.Client` is Zulip's analogue of the HTTP User-Agent
header (and is populated from User-Agent). It exists for use in
analytics and other places to provide human-readable summary data
about "which Zulip client" was used for an operation (e.g., was it the
Android app, the desktop app, or a bot?).

In general, it shouldn't be used for anything controlling the behavior
of Zulip; it's primarily intended to assist debugging.

## Analytics

A `Client` is used to sort messages into client categories such as
`ZulipElectron` on the `/stats` page. For more information see,
[Analytics](analytics.md).

## Integrations

Generally, integrations in Zulip should declare a unique User-Agent,
so that it's easy to figure out which integration is involved when
debugging an issue. For incoming webhook integrations, we do that
conveniently via the auth decorators (as we will describe shortly);
other integrations generally should set the first User-Agent element
on their HTTP requests to something of the form
ZulipIntegrationName/1.2 so that they are categorized properly.

The `webhook_view` auth decorator, used for most incoming
webhooks, accepts the name of the integration as an argument and uses
it to generate a client name that it adds to the `request_notes`
object that can be accessed with the `request` (Django
[HttpRequest](https://docs.djangoproject.com/en/5.0/ref/request-response/#django.http.HttpRequest))
object via `zerver.lib.request.get_request_notes(request)`.

In most integrations, `request_notes.client` is then passed to
`check_send_webhook_message`, where it is used to keep track of which client
sent the message (which in turn is used by analytics). For more
information, see [the incoming webhook walkthrough](https://zulip.com/api/incoming-webhooks-walkthrough).
```

--------------------------------------------------------------------------------

````
