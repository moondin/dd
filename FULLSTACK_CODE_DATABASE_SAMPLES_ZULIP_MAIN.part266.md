---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 266
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 266 of 1290)

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

---[FILE: deployment.md]---
Location: zulip-main/docs/production/deployment.md

```text
# Deployment options

The default Zulip installation instructions will install a complete
Zulip server, with all of the services it needs, on a single machine.

For production deployment, however, it's common to want to do
something more complicated. This page documents the options for doing so.

## Installing Zulip from Git

To install a development version of Zulip from Git, just clone the Git
repository from GitHub:

```bash
# First, install Git if you don't have it installed already
sudo apt install git
git clone https://github.com/zulip/zulip.git zulip-server-git
```

and then
[continue the normal installation instructions](install.md#step-2-install-zulip).
You can also [upgrade Zulip from Git](upgrade.md#upgrading-from-a-git-repository).

The most common use case for this is upgrading to `main` to get a
feature that hasn't made it into an official release yet (often
support for a new base OS release). See [upgrading to
main][upgrade-to-main] for notes on how `main` works and the
support story for it, and [upgrading to future
releases][upgrade-to-future-release] for notes on upgrading Zulip
afterwards.

In particular, we are always very glad to investigate problems with
installing Zulip from `main`; they are rare and help us ensure that
our next major release has a reliable install experience.

[upgrade-to-main]: modify.md#upgrading-to-main
[upgrade-to-future-release]: modify.md#upgrading-to-future-releases

## Zulip in Docker

In addition to the [standard installer](./install.md), Zulip has an
[official Docker image](https://github.com/zulip/docker-zulip).

We recommend using the Docker image only if your organization has a
preference for deploying services using Docker. Deploying with Docker
moderately increases the effort required to install, maintain, and
upgrade a Zulip installation.

Zulip's [backup tool][backups] supports migrating between Docker and a
standard installation, so you can change your mind later.

[backups]: https://zulip.readthedocs.io/en/stable/production/export-and-import.html#backups

## Zulip installer details

The [Zulip installer](install.md) does the following:

- Creates the `zulip` user, which the various Zulip servers will run as.
- Creates `/home/zulip/deployments/`, which the Zulip code for this
  deployment (and future deployments when you upgrade) goes into. At the
  very end of the install process, the script moves the Zulip code tree
  it's running from (which you unpacked from a tarball above) to a
  directory there, and makes `/home/zulip/deployments/current` as a
  symbolic link to it.
- Installs Zulip's various dependencies.
- Configures the various third-party services Zulip uses, including
  PostgreSQL, RabbitMQ, Memcached and Redis.
- Initializes Zulip's database.

### Advanced installer options

The Zulip installer supports the following advanced installer options
as well as those mentioned in the
[install](install.md#installer-options) documentation:

- `--postgresql-version`: Sets the version of PostgreSQL that will be
  installed. We currently support PostgreSQL 14, 15, 16, 17, and 18,
  with 18 being the default.

- `--postgresql-database-name=exampledbname`: With this option, you
  can customize the default database name. If you do not set this. The
  default database name will be `zulip`. This setting can only be set
  on the first install.

- `--postgresql-database-user=exampledbuser`: With this option, you
  can customize the default database user. If you do not set this. The
  default database user will be `zulip`. This setting can only be set
  on the first install.

- `--no-init-db`: This option instructs the installer to not do any
  database initialization. This should be used when you already have a
  Zulip database.

- `--no-overwrite-settings`: This option preserves existing
  `/etc/zulip` configuration files.

[missing-dicts]: system-configuration.md#missing_dictionaries

## Installing on an existing server

Zulip's installation process assumes it is the only application
running on the server; though installing alongside other applications
is not recommended, we do have [some notes on the
process](install-existing-server.md).

## Deployment hooks

Zulip's upgrades have a hook system which allows for arbitrary
user-configured actions to run before and after an upgrade; see the
[upgrading documentation](upgrade.md#deployment-hooks) for details on
how to write your own.

### Zulip message deploy hook

Zulip can use its deploy hooks to send a message immediately before and after
conducting an upgrade. To configure this:

1. Add `, zulip::hooks::zulip_notify` to the `puppet_classes` line in
   `/etc/zulip/zulip.conf`
1. Add a `[zulip_notify]` section to `/etc/zulip/zulip.conf`:
   ```ini
   [zulip_notify]
   bot_email = your-bot@zulip.example.com
   server = zulip.example.com
   stream = deployments
   ```
1. Add the [api key](https://zulip.com/api/api-keys#get-a-bots-api-key) for the
   bot user in `/etc/zulip/zulip-secrets.conf` as `zulip_release_api_key`:
   ```ini
   # Replace with your own bot's token, found in the Zulip UI
   zulip_release_api_key = abcd1234E6DK0F7pNSqaMSuzd8C5i7Eu
   ```
1. As root, run `/home/zulip/deployments/current/scripts/zulip-puppet-apply`.

### Sentry deploy hook

Zulip can use its deploy hooks to create [Sentry
releases][sentry-release], which can help associate Sentry [error
logging][sentry-error] with specific releases. If you are deploying
Zulip from Git, it can be aware of which Zulip commits are associated
with the release, and help identify which commits might be relevant to
an error.

To do so:

1. Enable [Sentry error logging][sentry-error].
2. Add a new [internal Sentry integration][sentry-internal] named
   "Release annotator".
3. Grant the internal integration the [permissions][sentry-perms] of
   "Admin" on "Release".
4. Add `, zulip::hooks::sentry` to the `puppet_classes` line in `/etc/zulip/zulip.conf`
5. Add a `[sentry]` section to `/etc/zulip/zulip.conf`:
   ```ini
   [sentry]
   organization = your-organization-name
   project = your-project-name
   ```
6. Add the [authentication token][sentry-tokens] for your internal Sentry integration
   to your `/etc/zulip/zulip-secrets.conf`:
   ```ini
   # Replace with your own token, found in Sentry
   sentry_release_auth_token = 6c12f890c1c864666e64ee9c959c4552b3de473a076815e7669f53793fa16afc
   ```
7. As root, run `/home/zulip/deployments/current/scripts/zulip-puppet-apply`.

If you are deploying Zulip from Git, you will also need to:

1. In your Zulip project, add the [GitHub integration][sentry-github].
2. Configure the `zulip/zulip` GitHub project for your Sentry project.
   You should do this even if you are deploying a private fork of
   Zulip.
3. Additionally grant the internal integration "Read & Write" on
   "Organization"; this is necessary to associate the commits with the
   release.

[sentry-release]: https://docs.sentry.io/product/releases/
[sentry-error]: ../subsystems/logging.md#sentry-error-logging
[sentry-github]: https://docs.sentry.io/product/integrations/source-code-mgmt/github/
[sentry-internal]: https://docs.sentry.io/product/integrations/integration-platform/internal-integration/
[sentry-perms]: https://docs.sentry.io/product/integrations/integration-platform/#permissions
[sentry-tokens]: https://docs.sentry.io/product/integrations/integration-platform/internal-integration#auth-tokens

## Running Zulip's service dependencies on different machines

Zulip has full support for each top-level service living on its own machine.

You can configure remote servers for Memcached, PostgreSQL, RabbitMQ, Redis, and
Smokescreen in `/etc/zulip/settings.py`; just search for the service name in
that file and you'll find inline documentation in comments for how to configure
it.

All puppet modules under `zulip::profile` are allowed to be configured
stand-alone on a host. You can see most likely manifests you might
want to choose in the list of includes in [the main manifest for the
default all-in-one Zulip server][standalone.pp], though it's also
possible to subclass some of the lower-level manifests defined in that
directory if you want to customize. A good example of doing this is
in the [kandra Puppet configuration][zulipchat-puppet] that we use
as part of managing chat.zulip.org and zulip.com.

For example, to install a Zulip Redis server on a machine, you can run
the following after unpacking a Zulip production release tarball:

```bash
./scripts/setup/install --puppet-classes zulip::profile::redis
```

To run the database on a separate server, including a cloud provider's managed
PostgreSQL instance (e.g., AWS RDS), or with a warm-standby replica for
reliability, see our [dedicated PostgreSQL documentation][postgresql].

[standalone.pp]: https://github.com/zulip/zulip/blob/main/puppet/zulip/manifests/profile/standalone.pp
[zulipchat-puppet]: https://github.com/zulip/zulip/tree/main/puppet/kandra/manifests
[postgresql]: postgresql.md

## Deploying behind a reverse proxy

See our dedicated page on [reverse proxies][reverse-proxies].

[reverse-proxies]: reverse-proxies.md

## Using an alternate port

If you'd like your Zulip server to use an HTTPS port other than 443, you can
configure that as follows:

1. Edit `EXTERNAL_HOST` in `/etc/zulip/settings.py`, which controls how
   the Zulip server reports its own URL, and restart the Zulip server
   with `/home/zulip/deployments/current/scripts/restart-server`.
1. Add the following block to `/etc/zulip/zulip.conf`:

   ```ini
   [application_server]
   nginx_listen_port = 12345
   ```

1. As root, run
   `/home/zulip/deployments/current/scripts/zulip-puppet-apply`. This
   will convert Zulip's main `nginx` configuration file to use your new
   port.

We also have documentation for a Zulip server [using HTTP][using-http] for use
behind reverse proxies.

[using-http]: reverse-proxies.md#configuring-zulip-to-allow-http

## Customizing the outgoing HTTP proxy

To protect against [SSRF][ssrf], Zulip routes all outgoing HTTP and
HTTPS traffic through [Smokescreen][smokescreen], an HTTP `CONNECT`
proxy; this includes outgoing webhooks, website previews, and mobile
push notifications.

### IP address rules

By default, Smokescreen denies access to all [non-public IP
addresses](https://en.wikipedia.org/wiki/Private_network), including
127.0.0.1, but allows traffic to all public Internet hosts. You can
[adjust those rules][smokescreen-acls]. For instance, if you have an
outgoing webhook at `http://10.17.17.17:80/`, you would need to:

1. Add the following block to `/etc/zulip/zulip.com`, substituting
   your internal host's IP address:

   ```ini
   [http_proxy]
   allow_addresses = 10.17.17.17
   ```

1. As root, run
   `/home/zulip/deployments/current/scripts/zulip-puppet-apply`. This
   will reconfigure and restart Zulip.

### Using a different outgoing proxy

To use a custom outgoing proxy:

1. Add the following block to `/etc/zulip/zulip.conf`, substituting in
   your proxy's hostname/IP and port:

   ```ini
   [http_proxy]
   host = 127.0.0.1
   port = 4750
   ```

1. As root, run
   `/home/zulip/deployments/current/scripts/zulip-puppet-apply`. This
   will reconfigure and restart Zulip.

If you wish to disable the outgoing proxy entirely, follow the above
steps, configuring an empty `host` value. **This is not
recommended**, as it allows attackers to leverage the Zulip server to
access internal resources.

### Routing Camo requests through an outgoing proxy

By default, the Camo image proxy will use a custom outgoing proxy if
one is configured, but will not use the default Smokescreen proxy
(because Camo includes similar logic to deny access to private
subnets). You can [override][proxy.enable_for_camo] this logic in
either direction, if desired.

### Installing Smokescreen on a separate host

If you have a deployment with multiple frontend servers, or wish to
install Smokescreen on a separate host, you can apply the
`zulip::profile::smokescreen` Puppet class on that host, and follow
the above steps, setting the `[http_proxy]` block to point to that
host.

[ssrf]: https://owasp.org/www-community/attacks/Server_Side_Request_Forgery
[smokescreen]: https://github.com/stripe/smokescreen
[proxy.enable_for_camo]: system-configuration.md#enable_for_camo
[smokescreen-acls]: system-configuration.md#allow_addresses-allow_ranges-deny_addresses-deny_ranges

### S3 file storage requests and outgoing proxies

By default, the [S3 file storage backend][s3] bypasses the Smokescreen
proxy, because when running on EC2 it may require metadata from the
IMDS metadata endpoint, which resides on the internal IP address
169.254.169.254 and would thus be blocked by Smokescreen.

If your S3-compatible storage backend requires use of Smokescreen or
some other proxy, you can override this default by setting
`S3_SKIP_PROXY = False` in `/etc/zulip/settings.py`.

[s3]: upload-backends.md#s3-backend-configuration
```

--------------------------------------------------------------------------------

---[FILE: email-gateway.md]---
Location: zulip-main/docs/production/email-gateway.md

```text
# Incoming email integration

Zulip's incoming email gateway integration makes it possible to send
messages into Zulip by sending an email. It's highly recommended
because it enables:

- When users reply to one of Zulip's message notification emails
  from their email client, the reply can go directly
  into Zulip.
- Integrating third-party services that can send email notifications
  into Zulip. See the [integration
  documentation](https://zulip.com/integrations/email) for
  details.

Once this integration is configured, each channel will have a special
email address displayed on the channel settings page. Emails sent to
that address will be delivered into the channel.

There are two ways to configure Zulip's email gateway:

1. Local delivery (recommended): A server runs on the Zulip
   server and passes the emails directly to Zulip.
1. Polling: A cron job running on the Zulip server checks an IMAP
   inbox (`username@example.com`) every minute for new emails.

The local delivery configuration is preferred for production because
it supports nicer looking email addresses and has no cron delay. The
polling option is convenient for testing/developing this feature
because it doesn't require a public IP address, setting up MX
records in DNS, or adjusting firewalls.

:::{note}
Incoming emails are rate-limited, with the following limits:

- 50 emails per minute.
- 120 emails per 5 minutes.
- 600 emails per hour.

:::

## Local delivery setup

Zulip's Puppet configuration provides everything needed to run this
integration; you just need to enable and configure it as follows.

The main decision you need to make is what email domain you want to
use for the gateway; for this discussion we'll use
`emaildomain.example.com`. The email addresses used by the gateway
will look like `foo@emaildomain.example.com`, so we recommend using
`EXTERNAL_HOST` here.

We will use `hostname.example.com` as the hostname of the Zulip server
(this will usually also be the same as `EXTERNAL_HOST`, unless you are
using an [HTTP reverse proxy][reverse-proxy]).

1. Using your DNS provider, create a DNS MX (mail exchange) record
   configuring email for `emaildomain.example.com` to be processed by
   `hostname.example.com`. You can check your work using this command:

   ```console
   $ dig +short emaildomain.example.com -t MX
   1 hostname.example.com
   ```

1. If you have a network firewall enabled, configure it to allow incoming access
   to port 25 on the Zulip server from the public internet. Other mail servers
   will need to use it to deliver emails to Zulip.

1. Log in to your Zulip server; the remaining steps all happen there.

1. Add `, zulip::local_mailserver` to `puppet_classes` in
   `/etc/zulip/zulip.conf`. A typical value after this change is:

   ```ini
   puppet_classes = zulip::profile::standalone, zulip::local_mailserver
   ```

1. Run `/home/zulip/deployments/current/scripts/zulip-puppet-apply`
   (and answer `y`) to apply your new `/etc/zulip/zulip.conf`
   configuration to your Zulip server.

1. Edit `/etc/zulip/settings.py`, and set `EMAIL_GATEWAY_PATTERN`
   to `"%s@emaildomain.example.com"`.

1. Restart your Zulip server with
   `/home/zulip/deployments/current/scripts/restart-server`.

Congratulations! The integration should be fully operational.

[reverse-proxy]: reverse-proxies.md

## Polling setup

1. Create an email account dedicated to Zulip's email gateway
   messages. We assume the address is of the form
   `username@example.com`. The email provider needs to support the
   standard model of delivering emails sent to
   `username+stuff@example.com` to the `username@example.com` inbox.

1. Edit `/etc/zulip/settings.py`, and set `EMAIL_GATEWAY_PATTERN` to
   `"username+%s@example.com"`.

1. Set up IMAP for your email account and obtain the authentication details.
   ([Here's how it works with Gmail](https://support.google.com/mail/answer/7126229?hl=en))

1. Configure IMAP access in the appropriate Zulip settings:

   - Login and server connection details in `/etc/zulip/settings.py`
     in the email gateway integration section (`EMAIL_GATEWAY_LOGIN` and others).
   - Password in `/etc/zulip/zulip-secrets.conf` as `email_gateway_password`.

1. Test your configuration by sending emails to the target email
   account and then running the Zulip tool to poll that inbox:

   ```bash
   su zulip -c '/home/zulip/deployments/current/manage.py email_mirror'
   ```

1. Once everything is working, install the cron job which will poll
   the inbox every minute for new messages using the tool you tested
   in the last step:
   ```bash
   cd /home/zulip/deployments/current/
   sudo cp puppet/zulip/files/cron.d/email-mirror /etc/cron.d/
   ```

Congratulations! The integration should be fully operational.
```

--------------------------------------------------------------------------------

---[FILE: email.md]---
Location: zulip-main/docs/production/email.md

```text
# Outgoing email

Zulip needs to be able to send email so it can confirm new users'
email addresses and send notifications.

## How to configure

1. Identify an outgoing email (SMTP) account where you can have Zulip
   send mail. If you don't already have one you want to use, see
   [Email services](#email-services) below.

1. Fill out the section of `/etc/zulip/settings.py` headed "Outgoing
   email (SMTP) settings". This includes the hostname and typically
   the port to reach your SMTP provider, and the username to log in to
   it. If your SMTP server does not require authentication, leave
   `EMAIL_HOST_USER` empty. You'll also want to fill out the noreply
   email section.

1. Put the password for the SMTP user account in
   `/etc/zulip/zulip-secrets.conf` by setting `email_password`. For
   example: `email_password = abcd1234`.

   Like any other change to the Zulip configuration, be sure to
   [restart the server](settings.md) to make your changes take
   effect.

1. Configure your SMTP server to allows your Zulip server to send
   emails originating from the email addresses listed in
   `/etc/zulip/settings.py` as `ZULIP_ADMINISTRATOR`,
   `NOREPLY_EMAIL_ADDRESS` and if `ADD_TOKENS_TO_NOREPLY_ADDRESS=True`
   (the default), `TOKENIZED_NOREPLY_EMAIL_ADDRESS`.

   If you don't know how to do this, we recommend using a [free
   transactional email service](#free-outgoing-email-services); they
   will guide you through everything you need to do, covering details
   like configuring DKIM/SPF authentication so your Zulip emails won't
   be spam filtered.

1. Use Zulip's email configuration test tool, documented in the
   [Troubleshooting section](#troubleshooting), to verify that your
   configuration is working.

1. Once your configuration is working, restart the Zulip server with
   `su zulip -c '/home/zulip/deployments/current/scripts/restart-server'`.

## Email services

### Free outgoing email services

For sending outgoing email from your Zulip server, we highly recommend
using a "transactional email" service like
[Mailgun](https://documentation.mailgun.com/docs/mailgun/user-manual/sending-messages/send-smtp),
[SendGrid](https://www.twilio.com/docs/sendgrid/for-developers/sending-email/integrating-with-the-smtp-api),
or, for AWS users,
[Amazon SES](https://docs.aws.amazon.com/ses/latest/dg/send-email-smtp.html).
These services are designed to send email from servers, and are by far
the easiest way to get outgoing email working reliably (Mailgun has
the best documentation).

If you don't have an existing outgoing SMTP provider, don't worry!
Each of the options we recommend above (as well as dozens of other
services) have free options. Once you've signed up, you'll want to
find the service's provided "SMTP credentials", and configure Zulip as
follows:

- The hostname like `EMAIL_HOST = 'smtp.mailgun.org'` in `/etc/zulip/settings.py`
- The username like `EMAIL_HOST_USER = 'username@example.com'` in
  `/etc/zulip/settings.py`.
- The TLS setting as `EMAIL_USE_TLS = True` in
  `/etc/zulip/settings.py`, for most providers
- The port as `EMAIL_PORT = 587` in `/etc/zulip/settings.py`, for most
  providers
- The password like `email_password = abcd1234` in `/etc/zulip/zulip-secrets.conf`.

If your SMTP provider uses implicit SSL/TLS on port 465 (and not `STARTTLS` on
port 587), you need to set `EMAIL_PORT = 465`, as well as replacing
[`EMAIL_USE_TLS = True`](https://docs.djangoproject.com/en/5.0/ref/settings/#std-setting-EMAIL_USE_TLS)
with [`EMAIL_USE_SSL = True`](https://docs.djangoproject.com/en/5.0/ref/settings/#std-setting-EMAIL_USE_SSL).

### Using system email

If you'd like to send outgoing email using the local operating
system's email delivery configuration (e.g., you have `postfix`
configuration on the system that forwards email sent locally into your
corporate email system), you will likely need to use something like
these setting values:

```python
EMAIL_HOST = 'localhost'
EMAIL_PORT = 25
EMAIL_USE_TLS = False
EMAIL_HOST_USER = ""
```

We should emphasize that because modern spam filtering is very
aggressive, you should make sure your downstream email system is
configured to properly sign outgoing email sent by your Zulip server
(or check your spam folder) when using this configuration. See
[documentation on using Django with a local postfix server][postfix-email]
for additional advice.

[postfix-email]: https://stackoverflow.com/questions/26333009/how-do-you-configure-django-to-send-mail-through-postfix

### Using Gmail for outgoing email

We don't recommend using an inbox product like Gmail for outgoing
email, because Gmail's anti-spam measures make this annoying. But if
you want to use a Gmail account to send outgoing email anyway, here's
how to make it work:

- Create a totally new Gmail account for your Zulip server; you don't
  want Zulip's automated emails to come from your personal email address.
- If you're using 2-factor authentication on the Gmail account, you'll
  need to use an
  [app-specific password](https://support.google.com/accounts/answer/185833).
- If you're not using 2-factor authentication, read this Google
  support answer and configure that account as
  ["less secure"](https://support.google.com/accounts/answer/6010255);
  Gmail doesn't allow servers to send outgoing email by default.
- Note also that the rate limits for Gmail are also quite low
  (e.g., 100 / day), so it's easy to get rate-limited if your server
  has significant traffic. For more active servers, we recommend
  moving to a free account on a transactional email service.

### Logging outgoing email to a file for prototyping

For prototyping, you might want to proceed without setting up an email
provider. If you want to see the emails Zulip would have sent, you
can log them to a file instead.

To do so, add these lines to `/etc/zulip/settings.py`:

```python
EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
EMAIL_FILE_PATH = '/var/log/zulip/emails'
```

Then outgoing emails that Zulip would have sent will just be written
to files in `/var/log/zulip/emails/`.

Remember to delete this configuration (and restart the server) if you
later set up a real SMTP provider!

## Troubleshooting

You can quickly test your outgoing email configuration using:

```bash
su zulip -c '/home/zulip/deployments/current/manage.py send_test_email user@example.com'
```

If it doesn't throw an error, it probably worked; you can confirm by
checking your email. You should get two emails: One sent by the
default From address for your Zulip server, and one sent by the
"noreply" From address.

If it doesn't work, check these common failure causes:

- Your hosting provider may block outgoing SMTP traffic in its default
  firewall rules. Check whether the port `EMAIL_PORT` is blocked in
  your hosting provider's firewall.

- Your SMTP server's permissions might not allow the email account
  you're using to send email from the `noreply` email addresses used
  by Zulip when sending confirmation emails.

  For security reasons, Zulip sends confirmation emails (used for
  account creation, etc.) with randomly generated from addresses
  starting with `noreply-`.

  If necessary, you can set `ADD_TOKENS_TO_NOREPLY_ADDRESS` to `False`
  in `/etc/zulip/settings.py` (which will cause these confirmation
  emails to be sent from a consistent `noreply@` address). Disabling
  `ADD_TOKENS_TO_NOREPLY_ADDRESS` is generally safe if you are not
  using Zulip's feature that allows anyone to create an account in
  your Zulip organization if they have access to an email address in a
  certain domain. See [this article][helpdesk-attack] for details on
  the security issue with helpdesk software that
  `ADD_TOKENS_TO_NOREPLY_ADDRESS` helps protect against.

- Make sure you set the password in `/etc/zulip/zulip-secrets.conf`.

- Check the username and password for typos.

- Be sure to restart your Zulip server after editing either
  `settings.py` or `zulip-secrets.conf`, using
  `/home/zulip/deployments/current/scripts/restart-server` .
  Note that the `manage.py` command above will read the latest
  configuration from the config files, even if the server is still
  running with an old configuration.

### Advanced troubleshooting

Here are a few final notes on what to look at when debugging why you
aren't receiving emails from Zulip:

- Most transactional email services have an "outgoing email" log where
  you can inspect the emails that reached the service, whether an
  email was flagged as spam, etc.

- Zulip logs an entry in `/var/log/zulip/send_email.log` whenever it
  attempts to send an email. The log entry includes whether the
  request succeeded or failed.

- If attempting to send an email throws an exception, a traceback
  should be in `/var/log/zulip/errors.log`, along with any other
  exceptions Zulip encounters.

- Zulip's email sending configuration is based on the standard Django
  [SMTP backend](https://docs.djangoproject.com/en/5.0/topics/email/#smtp-backend)
  configuration. So if you're having trouble getting your email
  provider working, you may want to search for documentation related
  to using your email provider with Django.

  The one thing we've changed from the Django defaults is that we read
  the email password from the `email_password` entry in the Zulip
  secrets file, as part of our policy of not having any secret
  information in the `/etc/zulip/settings.py` file. In other words,
  if Django documentation references setting `EMAIL_HOST_PASSWORD`,
  you should instead set `email_password` in
  `/etc/zulip/zulip-secrets.conf`.

[helpdesk-attack]: https://medium.com/intigriti/how-i-hacked-hundreds-of-companies-through-their-helpdesk-b7680ddc2d4c
```

--------------------------------------------------------------------------------

````
