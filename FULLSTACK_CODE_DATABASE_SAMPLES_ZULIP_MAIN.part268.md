---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 268
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 268 of 1290)

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

---[FILE: install.md]---
Location: zulip-main/docs/production/install.md

```text
# Install a Zulip server

You can choose from several convenient options for hosting Zulip:

- Follow these instructions to **install a self-hosted Zulip server on a system
  of your choice**.
- Use Zulip's [Docker image](deployment.md#zulip-in-docker).
- Use a preconfigured
  [DigitalOcean droplet](https://marketplace.digitalocean.com/apps/zulip?refcode=3ee45da8ee26)
- Use [Zulip Cloud](https://zulip.com/plans/) hosting. Read our [guide to choosing between Zulip Cloud and
  self-hosting](https://zulip.com/help/zulip-cloud-or-self-hosting).

To **import data** from [Slack][slack-import], [Mattermost][mattermost-import], [Rocket.Chat][rocketchat-import], [Zulip Cloud][zulip-cloud-import], or [another Zulip
server][zulip-server-import], follow the linked instructions.

You can **try out Zulip** before setting up your own server by [checking
it out](https://chat.zulip.org/?show_try_zulip_modal) in the Zulip development community,
or [creating a free test organization](https://zulip.com/new/) on Zulip Cloud.

:::{note}
These instructions are for self-hosting Zulip. To
[contribute](../contributing/contributing.md) to the project, set up the
[development environment](../development/overview.md).
:::

## Installation process overview

0. [Set up a base server](#step-0-set-up-a-base-server)
1. [Download the latest release](#step-1-download-the-latest-release)
1. [Install Zulip](#step-2-install-zulip)
1. [Create a Zulip organization, and log in](#step-3-create-a-zulip-organization-and-log-in)

That's it! Once installation is complete, you can
[configure](settings.md) Zulip to suit your needs.

## Step 0: Set up a base server

Provision and log in to a fresh Ubuntu or Debian system in your preferred
hosting environment that satisfies the [installation
requirements](requirements.md) for your expected usage level.

## Step 1: Download the latest release

Download and unpack [the latest server
release](https://download.zulip.com/server/zulip-server-latest.tar.gz)
(**Zulip Server {{ LATEST_RELEASE_VERSION }}**) with the following commands:

```bash
cd $(mktemp -d)
curl -fLO https://download.zulip.com/server/zulip-server-latest.tar.gz
tar -xf zulip-server-latest.tar.gz
```

To verify the download, see [the sha256sums of our release
tarballs](https://download.zulip.com/server/SHA256SUMS.txt).

## Step 2: Install Zulip

To set up Zulip with the most common configuration, first become the
`root` user, if you are not already:

```bash
[ "$(whoami)" != "root" ] && sudo -s
```

Then, run the installer, providing your email address and the public
hostname that users will be able to access your server with:

```bash
./zulip-server-*/scripts/setup/install --push-notifications --certbot \
    --email=YOUR_EMAIL --hostname=YOUR_HOSTNAME
```

This command will immediately prompt you to agree to Zulip's [Terms of
Service][terms], so that your server can be registered for the [Mobile Push
Notification Service](mobile-push-notifications.md). To skip registering for
access to push notifications at this time, remove the `--push-notifications`
flag.

:::{note}
When registering for push notifications, you can configure whether your server
will submit aggregate usage statistics. See `--no-submit-usage-statistics`
[installer option](#installer-options) for details.
:::

The installer takes a few minutes to run, as it installs Zulip's dependencies. It is
designed to be idempotent: if the script fails, once you've corrected the cause
of the failure, you can just rerun the script. For more information, see
[installer details](deployment.md#zulip-installer-details) and
[troubleshooting](troubleshooting.md#troubleshooting-the-zulip-installer).

#### Installer options

- `--email=it-team@example.com`: A **real email address for the person
  or team who maintains the Zulip installation**. Zulip users on your
  server will see this as the contact email in automated emails, on
  help pages, on error pages, etc. If you use the [Mobile Push
  Notification Service](mobile-push-notifications.md), this is used as
  a point of contact. You can later configure a display name for your
  contact email with the `ZULIP_ADMINISTRATOR`
  [setting][doc-settings].

- `--hostname=zulip.example.com`: The user-accessible domain name for this Zulip
  server, i.e., what users will type in their web browser. This becomes
  `EXTERNAL_HOST` in the Zulip [settings][doc-settings].

- `--certbot`: With this option, the Zulip installer automatically obtains an
  SSL certificate for the server [using Certbot][doc-certbot], and configures a
  cron job to renew the certificate automatically. If you prefer to acquire an
  SSL certificate another way, it's easy to [provide it to
  Zulip][doc-ssl-manual].

- `--push-notifications`/`--no-push-notifications`: With this option, the Zulip
  installer registers your server for the [Mobile Push Notification
  Service](mobile-push-notifications.md), and sets up the initial default
  configuration. You will be immediately prompted to agree to the [Terms of
  Service][terms], and your server will be registered at the end of the
  installation process. You can learn more [about the
  service](mobile-push-notifications.md) and why it's [necessary for push
  notifications](mobile-push-notifications.md#why-a-push-notification-service-is-necessary).

- `--no-submit-usage-statistics`: If you enable push notifications, by default
  your server will submit [basic
  metadata](mobile-push-notifications.md#uploading-basic-metadata) (required for
  billing and for determining free plan eligibility), as well as [aggregate
  usage statistics](mobile-push-notifications.md#uploading-usage-statistics).
  You can disable submitting usage statistics by passing this flag. If push
  notifications are not enabled, no data will be submitted, so this flag is
  redundant.

- `--agree-to-terms-of-service`: If you're using the `--push-notifications` flag,
  you can pass this additional flag to indicate that you have read and agree to
  the [Terms of Service][terms].
  This skips the Terms of Service prompt, allowing for running the installer
  with `--push-notifications` in scripts without requiring user input.

- `--self-signed-cert`: With this option, the Zulip installer
  generates a self-signed SSL certificate for the server. This isn't
  suitable for production use (unless your server is [behind a reverse
  proxy][reverse-proxy]), but may be convenient for testing.

For advanced installer options, see our [deployment options][doc-deployment-options]
documentation.

:::{important}

If you are importing data, stop here and return to the import instructions for
[Slack][slack-import], [Mattermost][mattermost-import],
[Rocket.Chat][rocketchat-import], [Zulip Cloud][zulip-cloud-import], [a server backup][zulip-backups], or [another Zulip server][zulip-server-import].

:::

[doc-settings]: settings.md
[doc-certbot]: ssl-certificates.md#certbot-recommended
[doc-ssl-manual]: ssl-certificates.md#manual-install
[doc-deployment-options]: deployment.md#advanced-installer-options
[zulip-backups]: export-and-import.md#backups
[reverse-proxy]: reverse-proxies.md
[slack-import]: https://zulip.com/help/import-from-slack
[mattermost-import]: https://zulip.com/help/import-from-mattermost
[rocketchat-import]: https://zulip.com/help/import-from-rocketchat
[zulip-cloud-import]: export-and-import.md#import-into-a-new-zulip-server
[zulip-server-import]: export-and-import.md#import-into-a-new-zulip-server

## Step 3: Create a Zulip organization, and log in

When the installation process is complete, the install script prints a secure
one-time-use organization creation link. Open this link in your browser, and
follow the prompts to set up your organization and your own user account. Your
Zulip organization is ready to use!

:::{note}
You can generate a new organization creation link by running `manage.py
generate_realm_creation_link` on the server. See also our guide on running
[multiple organizations on the same server](multiple-organizations.md).
:::

## Getting started with Zulip

To really see Zulip in action, you'll need to get the people you work
together with using it with you.

- [Set up outgoing email](email.md) so Zulip can confirm new users'
  email addresses and send notifications.
- Learn how to [get your organization started][realm-admin-docs] using
  Zulip at its best.

Learning more:

- Subscribe to the [Zulip announcements email
  list](https://groups.google.com/g/zulip-announce) for
  server administrators. This extremely low-traffic list is for
  important announcements, including [new
  releases](../overview/release-lifecycle.md) and security issues.
- Follow us on [Mastodon](https://fosstodon.org/@zulip) or
  [X/Twitter](https://x.com/zulip).
- Learn how to [configure your Zulip server settings](settings.md).
- Learn about [Backups, export and import](export-and-import.md)
  and [upgrading](upgrade.md) a production Zulip
  server.

[realm-admin-docs]: https://zulip.com/help/moving-to-zulip
[terms]: https://zulip.com/policies/terms
```

--------------------------------------------------------------------------------

---[FILE: maintain-secure-upgrade.md]---
Location: zulip-main/docs/production/maintain-secure-upgrade.md

```text
---
orphan: true
---

# Maintain, secure, and upgrade

This was once a long page covering a bunch of topics; those topics
have since all moved to dedicated pages:

### Monitoring

Moved to [Troubleshooting](troubleshooting.md#monitoring).

### Securing your Zulip server

Moved to [Securing your Zulip server](securing-your-zulip-server.md).

### Upgrading

Moved to [Upgrading to a release](upgrade.md#upgrading-to-a-release).

### Upgrading from a Git repository

Moved to [Upgrading from a Git
repository](upgrade.md#upgrading-from-a-git-repository).

### Upgrading the operating system

Moved to [Upgrading the operating
system](upgrade.md#upgrading-the-operating-system).

### Scalability

Moved to [Scalability](requirements.md#scalability).

### Management commands

Moved to [Management commands](management-commands.md).

### API and your Zulip URL

Moved to [REST API](https://zulip.com/api/rest).
```

--------------------------------------------------------------------------------

---[FILE: management-commands.md]---
Location: zulip-main/docs/production/management-commands.md

```text
# Management commands

Sometimes, you need to modify or inspect Zulip data from the command
line. To help with this, Zulip ships with over 100 command-line tools
implemented using the [Django management commands
framework][django-management].

Because management commands require server shell access, Zulip Cloud
users will need to contact support for situations requiring them.

## Running management commands

Start by logging in as the `zulip` user on the Zulip server. Then run
them as follows:

```bash
cd /home/zulip/deployments/current

# Start by reading the help
./manage.py <command_name> --help

# Once you've determined this is the command for you, run it!
./manage.py <command_name> <args>
```

A full list of commands is available via `./manage.py help`; you'll
primarily want to use those in the `[zerver]` section as those are the
ones specifically built for Zulip.

As a warning, some of them are designed for specific use cases and may
cause problems if run in other situations. If you're not sure, it's
worth reading the documentation (or the code, usually available at
`zerver/management/commands/`; they're generally very simple programs).

### Accessing an organization's `string_id`

Since Zulip supports hosting multiple organizations on a single
server, many management commands require you specify which
organization ("realm") you'd like to modify, either via numerical or
string ID (usually the subdomain).

You can see all the organizations on your Zulip server using
`./manage.py list_realms`.

```console
zulip@zulip:~$ /home/zulip/deployments/current/manage.py list_realms
id    string_id                                name
--    ---------                                ----
1     zulipinternal                            None
2                                              Zulip Community
```

(Note that every Zulip server has a special `zulipinternal` realm
containing system-internal bots like `Notification Bot`; you are
unlikely to ever need to interact with that realm.)

Unless you are
[hosting multiple organizations on your Zulip server](multiple-organizations.md),
your single Zulip organization on the root domain will have the empty
string (`''`) as its `string_id`. So you can run, for example:

```console
zulip@zulip:~$ /home/zulip/deployments/current/manage.py show_admins -r ''
```

Otherwise, the `string_id` will correspond to the organization's
subdomain. E.g., on `it.zulip.example.com`, use
`/home/zulip/deployments/current/manage.py show_admins -r it`.

## manage.py shell

If you need to query or edit data directly in the Zulip database, the
best way to do this is with Django's built-in management shell.

You can get an IPython shell with full access to code within the Zulip
project using `manage.py shell`, e.g., you can do the following to
change a user's email address:

```console
$ cd /home/zulip/deployments/current/
$ ./manage.py shell
In [1]: user_profile = get_user_profile_by_email("email@example.com")
In [2]: do_change_user_delivery_email(user_profile, "new_email@example.com")
```

Any Django tutorial can give you helpful advice on querying and
formatting data from Zulip's tables for inspection; Zulip's own
[new feature tutorial](../tutorials/new-feature-tutorial.md) should help
you understand how the codebase is organized.

We recommend against directly editing objects and saving them using
Django's `object.save()`. While this will save your changes to the
database, for most objects, in addition to saving the changes to the
database, one may also need to flush caches, notify the apps and open
browser windows, and record the change in Zulip's `RealmAuditLog`
audit history table. For almost any data change you want to do, there
is already a function in `zerver.actions` with a name like
`do_change_full_name` that updates that field and notifies clients
correctly.

For convenience, Zulip automatically imports `zerver.models`
into every management shell; if you need to
access other functions, you'll need to import them yourself.

## Other useful manage.py commands

There are dozens of useful management commands under
`zerver/management/commands/`. We detail a few here:

- `./manage.py help`: Lists all available management commands.
- `./manage.py dbshell`: If you're more comfortable with raw SQL than
  Python, this will open a PostgreSQL SQL shell connected to the Zulip
  server's database. Beware of changing data; editing data directly
  with SQL will often not behave correctly because PostgreSQL doesn't
  know to flush Zulip's caches or notify browsers of changes.
- `./manage.py send_custom_email`: Can be used to send an email to a set
  of users. The `--help` documents how to run it from a
  `manage.py shell` for use with more complex programmatically
  computed sets of users.
- `./manage.py send_password_reset_email`: Sends password reset email(s)
  to one or more users.
- `./manage.py change_realm_subdomain`: Change subdomain of a realm.
- `./manage.py change_user_email`: Change a user's email address.
- `./manage.py change_user_role`: Can change a user's role
  (easier done [via the
  UI](https://zulip.com/help/user-roles)) or give bots the
  `can_forge_sender` permission, which is needed for certain special API features.
- `./manage.py export_single_user`: does a limited version of the [main
  export tools](export-and-import.md) containing just
  the messages accessible by a single user.
- `./manage.py unarchive_channel`:
  [Reactivates](https://zulip.com/help/archive-a-channel#unarchiving-archived-channels)
  an archived channel.
- `./manage.py reactivate_realm`: Reactivates a realm.
- `./manage.py deactivate_user`: Deactivates a user. This can be done
  more easily in Zulip's organization administrator UI.
- `./manage.py delete_user`: Completely delete a user from the database.
  For most purposes, deactivating users is preferred, since that does not
  alter message history for other users.
  See the `./manage.py delete_user --help` documentation for details.
- `./manage.py reset_authentication_attempt_count`: If a user failed authentication
  attempts too many times and further attempts are disallowed by the rate limiter,
  this can be used to reset the limit.

All of our management commands have internal documentation available
via `manage.py command_name --help`.

## Custom management commands

Zulip supports several mechanisms for running custom code on a
self-hosted Zulip server:

- Using an existing [integration][integrations] or writing your own
  [webhook integration][webhook-integrations] or [bot][writing-bots].
- Writing a program using the [Zulip API][zulip-api].
- [Modifying the Zulip server][modifying-zulip].
- Using the interactive [management shell](#managepy-shell),
  documented above, for one-time work or prototyping.
- Writing a custom management command, detailed here.

Custom management commands are Python 3 programs that run inside
Zulip's context, so that they can access its libraries, database, and
code freely. They can be the best choice when you want to run custom
code that is not permitted by Zulip's security model (and thus can't
be done more easily using the [REST API][zulip-api]) and that you
might want to run often (and so the interactive `manage.py shell` is
not suitable, though we recommend using the management shell to
prototype queries).

Our developer documentation on [writing management
commands][management-commands-dev] explains how to write them.

Simply writing the command inside a `deployments/` directory is not
ideal, because a new such directory is created every time you upgrade
the Zulip server.

Instead, we recommend deploying custom management commands either via
the [modifying Zulip][modifying-zulip] process or by storing them in
`/etc/zulip` (so they are included in
[backups](export-and-import.md#backups)) and then
symlinking them into
`/home/zulip/deployments/current/zerver/management/` after each
upgrade.

[modifying-zulip]: modify.md
[writing-bots]: https://zulip.com/api/writing-bots
[integrations]: https://zulip.com/integrations
[zulip-api]: https://zulip.com/api/rest
[webhook-integrations]: https://zulip.com/api/incoming-webhooks-overview
[management-commands-dev]: ../subsystems/management-commands.md
[django-management]: https://docs.djangoproject.com/en/5.0/ref/django-admin/#django-admin-and-manage-py
```

--------------------------------------------------------------------------------

---[FILE: mobile-push-notifications.md]---
Location: zulip-main/docs/production/mobile-push-notifications.md

```text
# Mobile push notification service

Zulip's iOS and Android [mobile apps](https://zulip.com/apps/) support
receiving push notifications from Zulip servers to notify users when
new messages have arrived. This is an important feature for having a
great mobile app experience.

Google's and Apple's security model for mobile push notifications does not allow
self-hosted Zulip servers to directly send mobile notifications to the Zulip
mobile apps. The Zulip Mobile Push Notification Service solves this problem by
forwarding mobile push notifications generated by your server to the Zulip
mobile apps.

## Signing up

:::{important}

The Zulip Server 10.0+ [installer](install.md#step-2-install-zulip)
includes a `--push-notifications` flag that automates this
registration process.

These instructions apply to Zulip 9.0+. If you are running an older
version of Zulip ([check](https://zulip.com/help/view-zulip-version)
if you are unsure), see the [Zulip 8.x
documentation](https://zulip.readthedocs.io/en/8.4/production/mobile-push-notifications.html).
:::

You can enable the mobile push notification service for your Zulip
server as follows:

1. Make sure your server has outgoing HTTPS access to the public Internet. If
   that is restricted by a proxy, you will need to [configure Zulip to use your
   outgoing HTTP proxy](deployment.md#customizing-the-outgoing-http-proxy)
   first.

1. Make sure that the `ZULIP_ADMINISTRATOR` setting in your
   `/etc/zulip/settings.py` file is a real email address which you
   monitor. If the Mobile Push Notification Service needs to contact
   you regarding your server, and will use this email address. [See
   below](#updating-your-servers-registration) for instructions if
   this contact needs to be updated later.

1. Set `ZULIP_SERVICE_PUSH_NOTIFICATIONS = True` in your
   `/etc/zulip/settings.py` file. Simply uncomment the appropriate line [in
   settings.py][update-settings-docs] by deleting the initial `# `.

1. Decide whether to share usage statistics with the Zulip team.

   By default, Zulip installations using the Mobile Push Notification Service
   submit additional usage statistics that help Zulip's maintainers allocate
   resources towards supporting self-hosted installations
   ([details](#uploading-usage-statistics)). You can disable submitting usage
   statistics now or at any time by setting
   `ZULIP_SERVICE_SUBMIT_USAGE_STATISTICS=False` in `/etc/zulip/settings.py`
   (uncomment the appropriate line).

   Note that all systems using the service upload [basic
   metadata](#uploading-basic-metadata) about the organizations hosted
   by the installation.

   [update-settings-docs]: ../production/upgrade.md#updating-settingspy-inline-documentation

1. [Restart your Zulip server](settings.md#changing-server-settings) so that
   your configuration changes take effect.

1. Run the registration command. If you installed Zulip directly on the server
   (without Docker), run as root:

   ```
   su zulip -c '/home/zulip/deployments/current/manage.py register_server'
   ```

   Or if you're using Docker, run:

   ```
   docker exec -it -u zulip <container_name> /home/zulip/deployments/current/manage.py register_server
   ```

   This command will print the registration data it would send to the Mobile
   Push Notification Service, ask you to accept the terms of service, and if
   you accept, register your server. If you have trouble, [contact Zulip
   support](https://zulip.com/help/contact-support) with the output of this
   command.

1. Organizations with more than 10 users must upgrade their
   [plan](https://zulip.com/plans/) in order to access the Mobile Push
   Notification Service. See [plan management](#plan-management) for details.

1. If you or your users have already set up the Zulip mobile app, you'll each
   need to log out of the mobile app, and log back in again in order to start
   getting push notifications.

Congratulations! You've successfully set up the service. You can now test mobile
push notifications by following [these
instructions](https://zulip.com/help/mobile-notifications#testing-mobile-notifications).

## Plan management

To access the Mobile Push Notification Service, organizations with more than 10
users must upgrade to a paid [plan](https://zulip.com/plans/#self-hosted), or
the free Community plan (if
[eligible](https://zulip.com/help/self-hosted-billing#free-community-plan)).
While upgrading your Zulip server to version 8.0+ makes it more convenient to
manage your plan, the same plans are offered for all Zulip versions.

### Plan management for a Zulip organization

On a self-hosted Zulip server running Zulip 8.0+, [organization
owners](https://zulip.com/help/user-roles) and billing administrators
can conveniently access plan management from the Zulip app. See [help center
documentation](https://zulip.com/help/self-hosted-billing) for detailed
instructions.

#### Configure who can manage plans and billing

::::{tab-set}

:::{tab-item} Zulip Server 10.0+

Follow [these
instructions](https://zulip.com/help/self-hosted-billing#configure-who-can-manage-plans-and-billing)
to configure who can manage plans and billing.

:::

:::{tab-item} Older versions

You can add billing administrators using the `change_user_role` [management
command][management-commands], passing [the organization's
`string_id`][accessing-string-id], and the email address of the Zulip user who
should be added as a billing administrator.

```
/home/zulip/deployments/current/manage.py change_user_role -r '' username@example.com is_billing_admin
```

You can remove a user's billing administrator permissions with the `--revoke`
option:

```
/home/zulip/deployments/current/manage.py change_user_role --revoke -r '' username@example.com is_billing_admin
```

:::

::::

[management-commands]: ../production/management-commands.md
[accessing-string-id]: https://zulip.readthedocs.io/en/stable/production/management-commands.html#accessing-an-organization-s-string-id

### Plan management for an entire Zulip server

Servers running Zulip releases older than Zulip 8.0 can start the plan
management log in process at
<https://selfhosting.zulip.com/serverlogin/>. This option is also
available for Zulip 8.0+ servers, and makes it possible to use a
single plan for multiple organizations on one installation. See [help
center documentation](https://zulip.com/help/self-hosted-billing) for
detailed log in instructions.

You will use your server's `zulip_org_id` and `zulip_org_key` as the username
and password to access plan management. You can obtain these from
`/etc/zulip/zulip-secrets.conf` on your Zulip server, or via the following
commands:

```
/home/zulip/deployments/current/scripts/get-django-setting ZULIP_ORG_ID
/home/zulip/deployments/current/scripts/get-django-setting ZULIP_ORG_KEY
```

## Why a push notification service is necessary

Both Google's and Apple's push notification services have a security
model that does not support mutually untrusted self-hosted servers
sending push notifications to the same app. In particular, when an
app is published to their respective app stores, one must compile into
the app a secret corresponding to the server that will be able to
publish push notifications for the app. This means that it is
impossible for a single app in their stores to receive push
notifications from multiple, mutually untrusted, servers.

Zulip's solution to this problem is to provide a central push
notification forwarding service, which allows registered Zulip servers
to send push notifications to the Zulip app indirectly (through the
forwarding service).

## Security and privacy

Use of the push notification bouncer is subject to the Zulip Cloud [Terms of
Service](https://zulip.com/policies/terms), [Privacy
Policy](https://zulip.com/policies/privacy) and [Rules of
Use](https://zulip.com/policies/rules). By using push notifications, you agree
to these terms.

We've designed this push notification bouncer service with security
and privacy in mind:

- Zulip Server 11.0+ supports a new end-to-end encrypted (E2EE)
  protocol for mobile push notifications. Because mobile app support
  for that protocol is not yet available, this documentation details
  the legacy protocol. This documentation will be updated to reflect
  on the new protocol's better privacy guarantees once [official
  mobile app support][e2ee-flutter-issue] for the new protocol is
  generally available.
- A central design goal of the Push Notification Service is to
  avoid any message content being stored or logged by the service,
  even in error cases.
- The Push Notification Service only stores the necessary metadata for
  delivering the notifications to the appropriate devices and
  otherwise operating the service:
  - The APNS/FCM tokens needed to securely send mobile push
    notifications to iOS and Android devices, one per device
    registered to be notified by your Zulip server.
  - User ID numbers generated by your Zulip server, needed to route
    a given notification to the appropriate set of mobile devices.
    These user ID numbers are opaque to the Push Notification
    Service and Kandra Labs.
  - [Basic organization metadata](#uploading-basic-metadata),
    [optional usage statistics](#uploading-usage-statistics), and
    aggregate statistics about how many push notifications are sent by
    each customer.
- The Push Notification Service receives (but does not store) the
  contents of individual mobile push notifications:

  - The numeric message ID generated by your Zulip server.
  - Metadata on the message's sender (name and avatar URL).
  - Metadata on the message's recipient (channel name + ID, topic,
    direct message recipients, etc.).
  - A timestamp.
  - The message's content.

  Zulip 11.0+ has an organization-level setting available to disable
  message content being sent via the push notification bouncer (i.e.,
  message content will be replaced with `New message`), for clients
  that don't support the new end-to-end encrypted notifications
  protocol. As of July 2025, this setting makes push notifications
  significantly less usable, since mobile client support for
  end-to-end encrypted push notifications is not yet available.

  (Prior to Zulip 11.0, this functionality was available via the
  `PUSH_NOTIFICATION_REDACT_CONTENT` server-level setting).

- All of the network requests (both from Zulip servers to the Push
  Notification Service and from the Push Notification Service to the
  relevant Google and Apple services) are encrypted over the wire with
  SSL/TLS.
- The code for the push notification forwarding service is 100% open
  source and available as part of the
  [Zulip server project on GitHub](https://github.com/zulip/zulip)
  (specifically, [here](https://github.com/zulip/zulip/tree/main/zilencer)).
- The push notification forwarding servers are professionally managed
  by a small team of security-sensitive engineers.

If you have any questions about the security model, [contact Zulip
support](https://zulip.com/help/contact-support).

[e2ee-flutter-issue]: https://github.com/zulip/zulip-flutter/issues/1764

### Uploading basic metadata

All Zulip installations running Zulip 8.0 or greater that are
registered for the Mobile Push Notification Service regularly upload
to the service basic metadata about the organizations hosted by the
installation. (Older Zulip servers upload these metadata only if
[uploading usage statistics](#uploading-usage-statistics) is enabled).

Uploaded metadata consists of, for each organization hosted by the
installation:

- A subset of the basic metadata returned by the unauthenticated [`GET
/server_settings` API
  endpoint](https://zulip.com/api/get-server-settings).

  The purpose of that API endpoint is to serve the minimal data
  needed by the Zulip mobile apps in order to:

  - Verify that a given URL is indeed a valid Zulip server URL
  - Present a correct login form, offering only the supported features
    and authentication methods for that organization and Zulip server
    version.

  Most of the metadata it returns is necessarily displayed to anyone
  with network access to the Zulip server on the login and signup
  pages for your Zulip organization as well.

  (Some fields returned by this endpoint, like the organization icon
  and description, are not included in uploaded metadata.)

- The [organization type](https://zulip.com/help/organization-type)
  and creation date.
- The number of user accounts with each role.

Our use of uploaded metadata is governed by the same [Terms of
Service](https://zulip.com/policies/terms) and [Privacy
Policy](https://zulip.com/policies/privacy) that covers the Mobile
Push Notification Service itself.

### Uploading usage statistics

By default, Zulip installations that register for the Mobile Push
Notification Service upload the following usage statistics. You can
disable these uploads any time by setting
`ZULIP_SERVICE_SUBMIT_USAGE_STATISTICS=False` in `/etc/zulip/settings.py`.

- Totals for messages sent and read with subtotals for various
  combinations of clients and integrations.
- Totals for active users under a few definitions (1day, 7day, 15day)
  and related statistics.

Some of the graphs on your server's [usage statistics
page](https://zulip.com/help/analytics) can be generated from these
statistics.

When enabled, usage statistics are submitted via an hourly cron
job. If you'd like to access plan management immediately after
enabling `SUBMIT_USAGE_STATISTICS=True` (the legacy form of this setting)
on a pre-8.0 Zulip server, you can run the analytics job manually via:

```
/home/zulip/deployments/current/manage.py update_analytics_counts
```

Our use of uploaded usage statistics is governed by the same [Terms of
Service](https://zulip.com/policies/terms) and [Privacy
Policy](https://zulip.com/policies/privacy) that covers the Mobile
Push Notification Service itself.

## Rate limits

The Mobile Push Notification Service API has a very high default rate
limit of 1000 requests per minute. A Zulip server makes requests to
this API every time it sends a push notification, which is fairly
frequent, but we believe it to be unlikely that a self-hosted
installation will hit this limit.

This limit is primarily intended to protect the service against DoS
attacks (intentional or otherwise). If you hit this limit or you
anticipate that your server will require sending more push
notifications than the limit permits, please [contact
support](https://zulip.com/help/contact-support).

## Updating your server's registration

Your server's registration includes the server's hostname and contact
email address (from `EXTERNAL_HOST` and `ZULIP_ADMINISTRATOR` in
`/etc/zulip/settings.py`, aka the `--hostname` and `--email` options
in the installer). You can update your server's registration data by
running `manage.py register_server` again.

If you'd like to rotate your server's API key for this service
(`zulip_org_key`), you need to use
`manage.py register_server --rotate-key` option; it will automatically
generate a new `zulip_org_key` and store that new key in
`/etc/zulip/zulip-secrets.conf`.

## Moving your registration to a new server

When migrating your Zulip deployment to a new machine, you will likely want to
retain your original registration and successfully transfer it. This is
especially important if you have an active plan for the Mobile Push
Notification Service.

The best way to preserve your registration when moving to a new server is to
copy over the credentials from the old server. These credentials are stored in
the `/etc/zulip/zulip-secrets.conf` file, specifically in the `zulip_org_id`
and `zulip_org_key` fields. After installing Zulip on the new machine, ensure
that `zulip_org_id` and `zulip_org_key` are set to the same values as on the
old server.

If you used the [official backup tool](export-and-import.md#backups)
to restore your Zulip deployment on the new machine, it will have
automatically transferred all secrets, including the registration
credentials, correctly.

### Transferring your registration if you lost the original credentials

If you have lost your original credentials, you can still transfer your Zulip
registration to a new server by following these steps:

1. Ensure Zulip is installed and accessible:

   - Install Zulip on the new machine and ensure it is fully operational.
   - The server must be accessible on the hostname associated with the original
     registration, with properly configured SSL certificates.
   - This process **will not work** if your Zulip server is on a local network
     or otherwise unreachable from the internet by our Mobile Push Notification
     Service. If that’s the case, contact
     [support@zulip.com](mailto:support@zulip.com) for assistance.

1. Run the below command to transfer your registration to the new server. This will
   execute a verification flow to prove to our Mobile Push Notification Service that
   you control the hostname and upon success, re-generate the credentials for
   using the registration and write them to the `/etc/zulip/zulip-secrets.conf` file.

   ```bash
   /home/zulip/deployments/current/manage.py register_server --registration-transfer
   ```

   Note that the `zulip_org_key` value changes in the process, and therefore if you
   still have an old server running using the service, it will lose access upon
   execution of this command.

1. Apply the changes by restarting the server:

   ```bash
   /home/zulip/deployments/current/scripts/restart-server
   ```

   Finally, [verify][verify-push-notifications] that push
   notifications are working correctly. If you encounter further
   issues, contact [support@zulip.com](mailto:support@zulip.com).

1. If you store `/etc/zulip/zulip-secrets.conf` secrets externally in
   an external configuration management tool (Ansible, etc.), or
   [backups](export-and-import.md#backups), this is a good time to
   update that configuration.

[verify-push-notifications]: https://zulip.com/help/mobile-notifications#testing-mobile-notifications

## Deactivating your server's registration

If you are deleting your Zulip server or otherwise no longer want to
use the Mobile Push Notification Service, you can deactivate your server's
registration.

1. [Cancel any paid
   plans](https://zulip.com/help/self-hosted-billing#cancel-paid-plan)
   associated with your server.

1. Run the deregistration command. If you installed Zulip directly on
   the server (without Docker), run as root:

   ```
   su zulip -c '/home/zulip/deployments/current/manage.py register_server --deactivate'
   ```

   Or if you're using Docker, run:

   ```
   docker exec -it -u zulip <container_name> /home/zulip/deployments/current/manage.py register_server --deactivate
   ```

1. Comment out the
   `ZULIP_SERVICE_PUSH_NOTIFICATIONS = True` line
   in your `/etc/zulip/settings.py` file (i.e., add `# ` at the
   start of the line), and [restart your Zulip
   server](settings.md#changing-server-settings).

If you ever need to reactivate your server's registration, [contact Zulip
support](https://zulip.com/help/contact-support).

### Pausing use of the Mobile Push Notification Service

You can temporarily stop using the Mobile Push Notification Service. Comment out
the `PUSH_NOTIFICATION_BOUNCER_URL = 'https://push.zulipchat.com'` line in your
`/etc/zulip/settings.py` file (i.e., add `# ` at the start of the line), and
[restart your Zulip server](settings.md#changing-server-settings). This approach makes it
easy to start using the service again by uncommenting the same line.
```

--------------------------------------------------------------------------------

````
