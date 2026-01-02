---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 269
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 269 of 1290)

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

---[FILE: modify.md]---
Location: zulip-main/docs/production/modify.md

```text
# Modify Zulip

Zulip is 100% free and open source software, and you're welcome to
modify it! This section explains how to make and maintain
modifications in a safe and convenient fashion.

If you do modify Zulip and then report an issue you see in your
modified version of Zulip, please be responsible about communicating
that fact:

- Ideally, you'd reproduce the issue in an unmodified version (e.g., in
  [the Zulip development community](https://zulip.com/development-community/) or on
  [zulip.com](https://zulip.com)).
- Where that is difficult or you think it's very unlikely your changes
  are related to the issue, just mention your changes in the issue report.

If you're looking to modify Zulip by applying changes developed by the
Zulip core team and merged into `main`, skip to [this
section](#applying-changes-from-main).

## Making changes

One way to modify Zulip is to just edit files under
`/home/zulip/deployments/current` and then restart the server. This
can work OK for testing small changes to Python code or shell scripts.
But we don't recommend this approach for maintaining changes because:

- You cannot modify JavaScript, CSS, or other frontend files this way,
  because we don't include them in editable form in our production
  release tarballs (doing so would make our release tarballs much
  larger without any runtime benefit).
- You will need to redo your changes after you next upgrade your Zulip
  server (or they will be lost).
- You need to remember to restart the server or your changes won't
  have effect.
- Your changes aren't tracked, so mistakes can be hard to debug.

Instead, we recommend the following GitHub-based workflow (see [our
Git guide][git-guide] if you need a primer):

- Decide where you're going to edit Zulip's code. We recommend [using
  the Zulip development environment](../development/overview.md) on
  a desktop or laptop as it will make it extremely convenient for you
  to test your changes without deploying them in production. But if
  your changes are small or you're OK with risking downtime, you don't
  strictly need it; you just need an environment with Git installed.
- **Important**. Determine what Zulip version you're running on your
  server. You can check by inspecting `ZULIP_VERSION` in
  `/home/zulip/deployments/current/version.py` (we'll use `2.0.4`
  below). If you apply your changes to the wrong version of Zulip,
  it's likely to fail and potentially cause downtime.
- [Fork and clone][fork-clone] the [zulip/zulip][] repository on
  [GitHub](https://github.com).
- Create a branch (named `acme-branch` below) containing your changes:

```bash
cd zulip
git checkout -b acme-branch 2.0.4
```

- Use your favorite code editor to modify Zulip.
- Commit your changes and push them to GitHub:

```bash
git commit -a

# Use `git diff` to verify your changes are what you expect
git diff 2.0.4 acme-branch

# Push the changes to your GitHub fork
git push origin +acme-branch
```

- Log in to your Zulip server and configure and use
  [upgrade-zulip-from-git][] to install the changes; remember to
  configure `git_repo_url` to point to your fork on GitHub and run it as
  `upgrade-zulip-from-git acme-branch`.

This workflow solves all of the problems described above: your change
will be compiled and installed correctly (restarting the server), and
your changes will be tracked so that it's convenient to maintain them
across future Zulip releases.

### Upgrading to future releases

Eventually, you'll want to upgrade to a new Zulip release. If your
changes were integrated into that Zulip release or are otherwise no
longer needed, you can just [upgrade as
usual](upgrade.md#upgrading-to-a-release). If you [upgraded to
`main`](#upgrading-to-main); review that section again; new
maintenance releases are likely "older" than your current installation
and you might need to upgrade to `main` again rather than to the
new maintenance release.

Otherwise, you'll need to update your branch by rebasing your changes
(starting from a [clone][fork-clone] of the [zulip/zulip][]
repository). The example below assumes you have a branch off of 2.0.4
and want to upgrade to 2.1.0.

```bash
cd zulip
git fetch --tags upstream
git checkout acme-branch
git rebase --onto 2.1.0 2.0.4
# Fix any errors or merge conflicts; see Zulip's Git guide for advice

# Use `git diff` to verify your changes are what you expect
git diff 2.1.0 acme-branch

git push origin +acme-branch
```

And then use [upgrade-zulip-from-git][] to install your updated
branch, as before.

### Making changes with docker-zulip

If you are using [docker-zulip][], there are two things that are
different from the above:

- Because of how container images work, editing files directly is even
  more precarious, because Docker is designed for working with
  container images and may lose your changes.
- Instead of running `upgrade-zulip-from-git`, you will need to use
  the [docker upgrade workflow][docker-zulip-upgrade] to build a
  container image based on your modified version of Zulip.

[docker-zulip]: https://github.com/zulip/docker-zulip
[docker-zulip-upgrade]: https://github.com/zulip/docker-zulip#upgrading-from-a-git-repository

## Applying changes from `main`

If you are experiencing an issue that has already been fixed by the
Zulip development community, and you'd like to get the fix now, you
have a few options. There are two possible ways you might get those
fixes on your local Zulip server without waiting for an official release.

### Applying a small change

Many bugs have small/simple fixes. In this case, you can use the Git
workflow [described above](#making-changes), using:

```bash
git fetch upstream
git cherry-pick abcd1234
```

instead of "making changes locally" (where `abcd1234` is the commit ID
of the change you'd like).

In general, we can't provide unpaid support for issues caused by
cherry-picking arbitrary commits if the issues don't also affect
`main` or an official release.

The exception to this rule is when we ask or encourage a user to apply
a change to their production system to help verify the fix resolves
the issue for them. You can expect the Zulip community to be
responsive in debugging any problems caused by a patch we asked
you to apply.

Also, consider asking whether a small fix that is important to you can
be added to the current stable release branch (e.g., `2.1.x`). In
addition to scheduling that change for Zulip's next bug fix release,
we support changes in stable release branches as though they were
released.

### Upgrading to `main`

Many Zulip servers (including chat.zulip.org and zulip.com) upgrade to
`main` on a regular basis to get the latest features. Before doing
so, it's important to understand how to happily run a server based on
`main`.

For background, backporting arbitrary patches from `main` to an older
version requires some care. Common issues include:

- Changes containing database migrations (new files under
  `*/migrations/`), which includes most new features. We
  don't support applying database migrations out of order.
- Changes that are stacked on top of other changes to the same system.
- Essentially any patch with hundreds of lines of changes will have
  merge conflicts and require extra work to apply.

While it's possible to backport these sorts of changes, you're
unlikely to succeed without help from the core team via a support
contract.

If you need an unreleased feature, the best path is usually to
upgrade to Zulip `main` using [upgrade-zulip-from-git][]. Before
upgrading to `main`, make sure you understand:

- In Zulip's version numbering scheme, `main` will always be "newer"
  than the latest maintenance release (e.g., `3.1` or `2.1.6`) and
  "older" than the next major release (e.g., `3.0` or `4.0`).
- The `main` branch is under very active development; dozens of new
  changes are integrated into it on most days. The `main` branch
  can have thousands of changes not present in the latest release (all
  of which will be included in our next major release). On average
  `main` usually has fewer total bugs than the latest release
  (because we fix hundreds of bugs in every major release) but it
  might have some bugs that are more severe than we would consider
  acceptable for a release.
- We deploy `main` to chat.zulip.org and zulip.com on a regular
  basis (often daily), so it's very important to the project that it
  be stable. Most regressions will be minor UX issues or be fixed
  quickly, because we need them to be fixed for Zulip Cloud.
- The development community is very interested in helping debug issues
  that arise when upgrading from the latest release to `main`, since
  they provide us an opportunity to fix that category of issue before
  our next major release. (Much more so than we are in helping folks
  debug other custom changes). That said, we cannot make any
  guarantees about how quickly we'll resolve an issue to folks without
  a formal support contract.
- We do not support downgrading from `main` to earlier versions, so
  if downtime for your Zulip server is unacceptable, make sure you
  have a current
  [backup](export-and-import.md#backups) in case the
  upgrade fails.
- Our changelog contains [draft release
  notes](../overview/changelog.md) available listing major changes
  since the last release. The **Upgrade notes** section will always
  be current, even if some new features aren't documented.
- Whenever we push a security or maintenance release, the changes in
  that release will always be merged to `main`; so you can get the
  security fixes by upgrading to `main`.
- You can always upgrade from `main` to the next major release when it
  comes out, using either [upgrade-zulip-from-git][] or the release
  tarball. So there's no risk of upgrading to `main` resulting in
  a system that's not upgradeable back to a normal release.

## Contributing patches

Zulip contains thousands of changes submitted by volunteer
contributors like you. If your changes are likely to be of useful to
other organizations, consider [contributing
them](../contributing/contributing.md).

[fork-clone]: ../git/cloning.md#get-zulip-code
[upgrade-zulip-from-git]: ./upgrade.md#upgrading-from-a-git-repository
[git-guide]: ../git/index.md
[zulip/zulip]: https://github.com/zulip/zulip/
```

--------------------------------------------------------------------------------

---[FILE: multiple-organizations.md]---
Location: zulip-main/docs/production/multiple-organizations.md

```text
# Hosting multiple organizations

The vast majority of Zulip servers host just a single organization (or
"realm", as the Zulip code calls organizations). This article
documents what's involved in hosting multiple Zulip organizations on a
single server.

Throughout this article, we'll assume you're working on a Zulip server
with hostname `zulip.example.com`. You may also find the more
[technically focused article on realms](../subsystems/realms.md) to be useful
reading.

## Subdomains

Zulip's approach for supporting multiple organizations on a single
Zulip server is for each organization to be hosted on its own
subdomain. E.g., you'd have `org1.zulip.example.com` and
`org2.zulip.example.com`.

Web security standards mean that one subdomain per organization is
required to support a user logging into multiple organizations on a
server at the same time.

When you want to create a new organization, you need to do a few
things:

- Make sure you have SSL certificates for all of the subdomains you're
  going to use. If you're using
  [our Let's Encrypt instructions](ssl-certificates.md), it's easy to
  just specify multiple subdomains in your certificate request.
- If necessary, modify your `nginx` configuration to use your new
  certificates.
- Use `./manage.py generate_realm_creation_link` again to create your
  new organization. Review
  [the install instructions](install.md) if you need a
  refresher on how this works.
- If you're planning on using GitHub auth or another social
  authentication method, review
  [the notes on `SOCIAL_AUTH_SUBDOMAIN` below](#authentication).

### SSL certificates

You'll need to install an SSL certificate valid for all the
(sub)domains you're using your Zulip server with. You can get an SSL
certificate covering several domains for free by using
[our Certbot wrapper tool](ssl-certificates.md#after-zulip-is-already-installed),
though if you're going to host a large number of organizations, you
may want to get a wildcard certificate. You can also get a wildcard
certificate for
[free using Certbot](https://community.letsencrypt.org/t/getting-wildcard-certificates-with-certbot/56285),
but because of the stricter security checks for acquiring a wildcard
cert, it isn't possible for a generic script like `setup-certbot` to
create it for you; you'll have to do some manual steps with your DNS
provider.

### Other hostnames

If you'd like to use hostnames that are not subdomains of each other,
you can set the `REALM_HOSTS` setting in `/etc/zulip/settings.py` to a
Python dictionary, like this:

```python
REALM_HOSTS = {
    "mysubdomain": "hostname.example.com",
}
```

This will make `hostname.example.com` the hostname for the realm that
would, without this configuration, have been
`mysubdomain.zulip.example.com`. To create your new realm on
`hostname.example.com`, one should enter `mysubdomain` as the
"subdomain" for the new realm.

The value you choose for `mysubdomain` will not be displayed to users;
the main constraint is that it will be impossible to create a
different realm on `mysubdomain.zulip.example.com`.

In a future version of Zulip, we expect to move this configuration
into the database.

### The root domain

Most Zulip servers host a single Zulip organization on the root domain
(e.g., `zulip.example.com`). The way this is implemented internally
involves the organization having the empty string (`''`) as its
"subdomain".

You can mix having an organization on the root domain and some others
on subdomains (e.g., `subdivision.zulip.example.com`), but this only
works well if there are no users in common between the two
organizations, because the auth cookies for the root domain are
visible to the subdomain (so it's not possible for a single
browser/client to be logged into both). So we don't recommend that
configuration.

### Changing subdomains

You can [change the subdomain][help-center-change-url] for an existing
organization using a [management command][management-commands]. Be
sure you understand the implications of changing the organization URL
before doing so, as it can be disruptive to users.

[management-commands]: ../production/management-commands.md
[help-center-change-url]: https://zulip.com/help/change-organization-url

### Authentication

Many of Zulip's supported authentication methods (Google, GitHub,
SAML, etc.) can require providing the third-party authentication
provider with a whitelist of callback URLs to your Zulip server (or
even a single URL). For those vendors that support a whitelist, you
can provide the callback URLs for each of your Zulip organizations.

The cleaner solution is to register a special subdomain, e.g.,
`auth.zulip.example.com` with the third-party provider, and then set
`SOCIAL_AUTH_SUBDOMAIN = 'auth'` in `/etc/zulip/settings.py`, so that
Zulip knows to use that subdomain for these authentication callbacks.

### The system bot realm

This is very much an implementation detail, but worth documenting to
avoid confusion as to why there's an extra realm when inspecting the
Zulip database.

Every Zulip server comes with 1 realm that isn't created by users: the
`zulipinternal` realm. By default, this realm only contains the Zulip "system
bots". You can get a list of these on your system via
`./scripts/get-django-setting INTERNAL_BOTS`, but this is where bots
like "Notification Bot", "Welcome Bot", etc. exist. In the future,
we're considering moving these bots to exist in every realm, so that
we wouldn't need the system realm anymore.

### Migrating / troubleshooting

If you're migrating from a configuration using the root domain to one
with realms hosted on subdomains, be sure to clear cookies in any
browsers that were logged in on the root domain; otherwise, those
browsers will experience weird/confusing redirects.

## Open realm creation

Installations like [Zulip Cloud](https://zulip.com/plans/) that wish to
allow anyone on the Internet to create new Zulip organizations can do
so by setting `OPEN_REALM_CREATION = True` in
`/etc/zulip/settings.py`. Note that offering Zulip hosting to anyone
on the Internet entails significant responsibility around security,
abuse/spam, legal issues like GDPR/CCPA compliance, and more.
```

--------------------------------------------------------------------------------

---[FILE: password-strength.md]---
Location: zulip-main/docs/production/password-strength.md

```text
---
orphan: true
---

# Password strength

When a user tries to set a password, we use [zxcvbn][zxcvbn] to check
that it isn't a weak one.

See discussion in [our main docs for server
admins](authentication-methods.md#email-and-password). This doc explains in
more detail how we set the default threshold (`PASSWORD_MIN_GUESSES`) we use.

First, read the doc section there. (It's short.)

Then, the CACM article ["Passwords and the Evolution of Imperfect
Authentication"][bhos15] is comprehensive, educational, and readable,
and is especially recommended.

The CACM article is convincing that password requirements should be
set to make passwords withstand an online attack, but not an offline
one. Offline attacks are much less common, and there is a wide gap in
the level of password strength required to beat them vs that for
online attacks -- and therefore in the level of user frustration that
such a requirement would cause.

On top of that, estimating strength rapidly becomes more expensive
at high levels, in both space (for lists of tokens to try) and time.
As a result, in order to fit in a few MB of download and a few ms of
check time, zxcvbn focuses on the range of online attacks, for the
upper limit of which it uses 10^6 (apparently based on the offhand
estimate of "perhaps one million guesses" in the CACM article.)

Figure 3 of [the zxcvbn paper][zxcvbn-paper] shows that in fact
overestimation (allowing a weak password) sharply degrades at 100k
guesses, while underestimation (rejecting a strong password) jumps up
just after 10k guesses, and grows steadily thereafter.

Moreover, the [Yahoo study][bon12] shows that resistance to even 1M
guesses is more than nearly half of users accomplish with a freely
chosen password, and 100k is too much for about 20%. (See Figure 6.)
It doesn't make sense for a Zulip server to try to educate or push so
many users far beyond the security practices they're accustomed to; in
the few environments where users can be expected to work much harder
for security, local server admins can raise the threshold accordingly.
Or, more likely, they already have a single-sign-on system in use for
most everything else in their organization, and will disable password
auth in Zulip entirely in favor of using that.

Our threshold of 10k guesses provides significant protection against
online attacks, and quite strong protection with appropriate
rate-limiting. On the other hand it stays within the range where
zxcvbn rarely underestimates the strength of a password too severely,
and only about 10% of users do worse than this without prompting.

[zxcvbn]: https://github.com/dropbox/zxcvbn
[bhos15]: https://www.cl.cam.ac.uk/~fms27/papers/2015-BonneauHerOorSta-passwords.pdf
[zxcvbn-paper]: https://www.usenix.org/system/files/conference/usenixsecurity16/sec16_paper_wheeler.pdf
[bon12]: https://ieeexplore.ieee.org/document/6234435
```

--------------------------------------------------------------------------------

---[FILE: postgresql-support-table.md]---
Location: zulip-main/docs/production/postgresql-support-table.md

```text
| Zulip Server version | Supported versions of PostgreSQL |
| -------------------- | -------------------------------- |
| 7.x                  | 12, 13, 14, 15                   |
| 8.x                  | 12, 13, 14, 15, 16               |
| 9.x                  | 12, 13, 14, 15, 16               |
| 10.x                 | 13, 14, 15, 16, 17               |
| 11.x                 | 14, 15, 16, 17                   |
| 12.x (unreleased)    | 14, 15, 16, 17, 18               |
```

--------------------------------------------------------------------------------

---[FILE: postgresql.md]---
Location: zulip-main/docs/production/postgresql.md

```text
# PostgreSQL database details

Zulip supports a range of PostgreSQL versions:

```{include} postgresql-support-table.md

```

We recommend that installations [upgrade to the latest
PostgreSQL][upgrade-postgresql] supported by their version of Zulip.

[upgrade-postgresql]: upgrade.md#upgrading-postgresql

## Separate PostgreSQL database

It is possible to run Zulip against a PostgreSQL database which is not on the
primary application server. There are two possible flavors of this -- using a
managed PostgreSQL instance from a cloud provider, or separating the PostgreSQL
server onto a separate (but still Zulip-managed) server for scaling purposes.

### Cloud-provider-managed PostgreSQL (e.g., Amazon RDS)

You can use a database-as-a-service like Amazon RDS for the Zulip database. The
experience is slightly degraded, in that most providers don't include useful
dictionary files in their installations, and don't provide a way to provide them
yourself. [Full-text search][fts] will be less useful, due to the inferior
stemming rules that the built-in dictionaries provide.

[fts]: ../subsystems/full-text-search.md

#### Step 1: Choose database name and username

Zulip defaults to a database user named `zulip` and a database named `zulip`.
It does support alternate values for those -- for instance, if required by
convention of your central database server.

#### Step 1: Set up Zulip

Follow the [standard install instructions](install.md), with modified `install`
arguments -- providing an updated `--puppet-classes`, as well as the database
and user names, and the version of the remote PostgreSQL server.

```bash
./zulip-server-*/scripts/setup/install --certbot \
    --email=YOUR_EMAIL --hostname=YOUR_HOSTNAME \
    --puppet-classes=zulip::profile::standalone_nodb,zulip::process_fts_updates \
    --postgresql-database-name=zulip \
    --postgresql-database-user=zulip \
    --postgresql-version=YOUR_SERVERS_POSTGRESQL_VERSION
```

#### Step 3: Create the PostgreSQL database

Access an administrative `psql` shell on your PostgreSQL database, and
run the commands in `scripts/setup/create-db.sql`. This will:

- Create a database called `zulip` with `C.UTF-8` collation.
- Create a user called `zulip` with full rights on that database.

If you cannot run that SQL directly, or need to use different database
or usernames, you should perform the equivalent actions.

Depending on how authentication works for your PostgreSQL installation, you may
also need to set a password for the Zulip user, generate a client certificate,
or similar; consult the documentation for your database provider for the
available options.

#### Step 4: Configure Zulip to use the PostgreSQL database

In `/etc/zulip/settings.py` on your Zulip server, configure the
following settings with details for how to connect to your PostgreSQL
server. Your database provider should provide these details.

- `REMOTE_POSTGRES_HOST`: Name or IP address of the PostgreSQL server.
- `REMOTE_POSTGRES_PORT`: Port on the PostgreSQL server.
- `REMOTE_POSTGRES_SSLMODE`: [SSL Mode][ssl-mode] used to connect to the server.

[ssl-mode]: https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-PROTECTION

If you're using password authentication, you should specify the
password of the `zulip` user in /etc/zulip/zulip-secrets.conf as
follows:

```ini
postgres_password = abcd1234
```

Now complete the installation by running the following commands.

```bash
# Ask Zulip installer to initialize the PostgreSQL database.
su zulip -c '/home/zulip/deployments/current/scripts/setup/initialize-database'

# And then generate a realm creation link:
su zulip -c '/home/zulip/deployments/current/manage.py generate_realm_creation_link'
```

### Remote PostgreSQL database

This assumes two servers; one hosting the PostgreSQL database, and one hosting
the remainder of the Zulip services.

#### Step 1: Set up Zulip

Follow the [standard install instructions](install.md), with modified `install`
arguments:

```bash
./zulip-server-*/scripts/setup/install --certbot \
    --email=YOUR_EMAIL --hostname=YOUR_HOSTNAME \
    --puppet-classes=zulip::profile::standalone_nodb
```

#### Step 2: Create the PostgreSQL database server

On the host that will run PostgreSQL, download the Zulip tarball and install
just the PostgreSQL server part:

```bash
./zulip-server-*/scripts/setup/install \
    --puppet-classes=zulip::profile::postgresql

./zulip-server-*/scripts/setup/create-database
```

You will need to [configure `/etc/postgresql/*/main/pg_hba.conf`][pg-hba] to
allow connections to the `zulip` database as the `zulip` user from the
application frontend host. How you configure this is up to you (i.e. password
authentication, certificates, etc), and is outside the scope of this document.

[pg-hba]: https://www.postgresql.org/docs/current/auth-pg-hba-conf.html

#### Step 3: Configure Zulip to use the PostgreSQL database

In `/etc/zulip/settings.py` on your Zulip server, configure the following
settings with details for how to connect to your PostgreSQL server.

- `REMOTE_POSTGRES_HOST`: Name or IP address of the PostgreSQL server.
- `REMOTE_POSTGRES_PORT`: Port on the PostgreSQL server; this is likely `5432`
- `REMOTE_POSTGRES_SSLMODE`: [SSL Mode][ssl-mode] used to connect to the server.

If you're using password authentication, you should specify the
password of the `zulip` user in /etc/zulip/zulip-secrets.conf as
follows:

```ini
postgres_password = abcd1234
```

Set the remote server's PostgreSQL version in `/etc/zulip/zulip.conf`:

```ini
[postgresql]
# Set this to match the version running on your remote PostgreSQL server
version = 18
```

Now complete the installation by running the following commands.

```bash
# Ask Zulip installer to initialize the PostgreSQL database.
su zulip -c '/home/zulip/deployments/current/scripts/setup/initialize-database'

# And then generate a realm creation link:
su zulip -c '/home/zulip/deployments/current/manage.py generate_realm_creation_link'
```

## PostgreSQL warm standby

Zulip's configuration allows for [warm standby database replicas][warm-standby]
as a disaster recovery solution; see the linked PostgreSQL documentation for
details on this type of deployment. Zulip's configuration can, but is not
required to, build on top of `wal-g`, our [streaming database backup
solution][wal-g], for ease of establishing base images without incurring load on
the primary.

Warm standby replicas should configure the hostname of their primary replica,
and username to use for replication, in `/etc/zulip/zulip.conf`:

```ini
[postgresql]
replication_user = replicator
replication_primary = hostname-of-primary.example.com
```

The `postgres` user on the replica will need to be able to authenticate as the
`replication_user` user, which may require further configuration of
`pg_hba.conf` and client certificates on the replica. If you are using password
authentication, you can set a `postgresql_replication_password` secret in
`/etc/zulip/zulip-secrets.conf`.

Use `zulip-puppet-apply` to rebuild the PostgreSQL configuration with those
values. If [wal-g][wal-g] is used, use `env-wal-g backup-fetch` to fetch the
latest copy of the base backup; otherwise, use [`pg_basebackup`][pg_basebackup].
The PostgreSQL replica should then begin live-replicating from the primary.

In the event of a primary failure, use [`pg_ctl promote`][promote] on the warm
standby to promote it to primary. As with all database promotions, care should
be taken to ensure that the old primary cannot come back online, and leave the
cluster with two diverging timelines.

To make fail-over to the warm-standby faster, without requiring a restart of
Zulip services, you can configure Zulip with a comma-separated list of remote
PostgreSQL servers to connect to; it will choose the first which accepts writes
(i.e. is not a read-only replica). In the event that the primary fails, it will
repeatedly retry the list, in order, until the replica is promoted and becomes
writable. To configure this, in `/etc/zulip/settings.py`, set:

```python3
REMOTE_POSTGRES_HOST = 'primary-database-host,warm-standby-host'
```

[warm-standby]: https://www.postgresql.org/docs/current/warm-standby.html
[wal-g]: export-and-import.md#database-only-backup-tools
[pg_basebackup]: https://www.postgresql.org/docs/current/app-pgbasebackup.html
[promote]: https://www.postgresql.org/docs/current/app-pg-ctl.html

## PostgreSQL vacuuming alerts

The `autovac_freeze` PostgreSQL alert from `check_postgres` is particularly
important. This alert indicates that the age (in terms of number of
transactions) of the oldest transaction id (XID) is getting close to the
`autovacuum_freeze_max_age` setting. When the oldest XID hits that age,
PostgreSQL will force a VACUUM operation, which can often lead to sudden
downtime until the operation finishes. If it did not do this and the age of the
oldest XID reached 2 billion, transaction id wraparound would occur and there
would be data loss. To clear the nagios alert, perform a `VACUUM` in each
indicated database as a database superuser (i.e. `postgres`).

See [the PostgreSQL documentation][vacuum] for more details on PostgreSQL
vacuuming.

[vacuum]: http://www.postgresql.org/docs/current/static/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND
```

--------------------------------------------------------------------------------

````
