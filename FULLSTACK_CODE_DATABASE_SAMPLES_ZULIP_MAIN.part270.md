---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 270
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 270 of 1290)

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

---[FILE: requirements.md]---
Location: zulip-main/docs/production/requirements.md

```text
# Requirements and scalability

To run a Zulip server, you will need:

- A dedicated machine or VM
- A supported OS:
  - Ubuntu 22.04
  - Ubuntu 24.04
  - Debian 12
  - Debian 13
- A supported CPU architecture:
  - x86-64
  - aarch64
- At least 2 GB RAM
  - If you have < 5 GB RAM, we require some swap space; we recommend configuring
    2 GB of swap
  - If you expect 100+ users: 4 GB RAM, and 2 CPUs
- 10GB free space (i.e. approximately a 25GB total disk, given OS requirements)
- A hostname in DNS
- Credentials for sending email

For details on each of these requirements, see below.

[upgrade-from-git]: upgrade.md#upgrading-from-a-git-repository

## Server

#### General

The installer expects Zulip to be the **only thing** running on the
system; it will install system packages with `apt` (like nginx,
PostgreSQL, and Redis) and configure them for its own use. We strongly
recommend using either a fresh machine instance in a cloud provider, a
fresh VM, [our Docker image][docker-zulip-homepage], or a dedicated
machine. If you decide to disregard our advice and use a server that
hosts other services, we can't support you, but [we do have some notes
on issues you'll encounter](install-existing-server.md).

#### Operating system

Ubuntu 22.04, Ubuntu 24.04, Debian 12, and Debian 13
are supported for running Zulip in production. You can also
run Zulip on other platforms that support Docker using
[docker-zulip][docker-zulip-homepage].

We recommend installing on the newest supported OS release you're
comfortable with, to save a bit of future work [upgrading the
operating system][upgrade-os].

If you're using Ubuntu, the
[Ubuntu universe repository][ubuntu-repositories] must be
[enabled][enable-universe], which is usually just:

```bash
sudo add-apt-repository universe
sudo apt update
```

[docker-zulip-homepage]: https://github.com/zulip/docker-zulip#readme
[upgrade-os]: upgrade.md#upgrading-the-operating-system
[ubuntu-repositories]: https://help.ubuntu.com/community/Repositories/Ubuntu
[enable-universe]: https://help.ubuntu.com/community/Repositories/CommandLine#Adding_the_Universe_and_Multiverse_Repositories

#### Hardware specifications

- CPU and memory: For installations with 100+ users you'll need a
  minimum of **2 CPUs** and **4 GB RAM**. For installations with fewer
  users, 1 CPU and 2 GB RAM with 2 GB of swap is sufficient. We
  recommend against using highly CPU-limited servers like the AWS `t2`
  style instances for organizations with hundreds of users (active or
  no).

- Disk space: You'll need at least 10 GB of dedicated free disk space
  for a server with dozens of users. We recommend using an SSD and
  avoiding cloud storage backends that limit the IOPS per second,
  since the disk is primarily used for the Zulip database.

See our [documentation on scalability](#scalability) below for advice
on hardware requirements for larger organizations.

#### Network and security specifications

- Incoming HTTPS access (usually port 443, though this is
  [configurable](deployment.md#using-an-alternate-port))
  from the networks where your users are (usually, the public
  Internet).
- Incoming port 80 access (optional). Zulip only serves content over
  HTTPS, and will redirect HTTP requests to HTTPS.
- Incoming port 25 if you plan to enable Zulip's [incoming email
  integration](email-gateway.md).
- Incoming port 4369 should be protected by a firewall to prevent
  exposing `epmd`, an Erlang service which does not support binding
  only to localhost. Leaving this exposed will allow unauthenticated
  remote users to determine that the server is running RabbitMQ, and
  on which port, though no further information is leaked.
- Outgoing HTTP(S) access (ports 80 and 443) to the public Internet so
  that Zulip can properly manage image and website previews and mobile
  push notifications. Outgoing Internet access is not required if you
  [disable those
  features](https://zulip.com/help/image-video-and-website-previews).
- Outgoing SMTP access (usually port 587) to your [SMTP
  server](email.md) so that Zulip can send emails.
- A domain name (e.g., `zulip.example.com`) that your users will use to
  access the Zulip server. In order to generate valid SSL
  certificates [with Certbot][doc-certbot], and to enable other
  services such as Google authentication, public DNS name is simpler,
  but Zulip can be configured to use a non-public domain or even an IP
  address as its external hostname (though we don't recommend that
  configuration).
- Zulip supports [running behind a reverse proxy][reverse-proxy].
- Zulip configures [Smokescreen, an outgoing HTTP
  proxy][smokescreen-proxy], to protect against [SSRF attacks][ssrf],
  which prevents user from making the Zulip server make requests to
  private resources. If your network has its own outgoing HTTP proxy,
  Zulip supports using that instead.

Zulip does not, itself, require SSH, but most installations will also require
access to incoming port 22 for SSH access for remote access.

[ssrf]: https://owasp.org/www-community/attacks/Server_Side_Request_Forgery
[smokescreen-proxy]: deployment.md#customizing-the-outgoing-http-proxy
[reverse-proxy]: reverse-proxies.md

## Credentials needed

#### SSL certificate

Your Zulip server will need an SSL certificate for the domain name it
uses. For most Zulip servers, the recommended (and simplest) way to
get this is to just [use the `--certbot` option][doc-certbot] in the
Zulip installer, which will automatically get a certificate for you
and keep it renewed.

For test installations, an even simpler alternative is always
available: [the `--self-signed-cert` option][doc-self-signed] in the
installer.

If you'd rather acquire an SSL certificate another way, see our [SSL
certificate documentation](ssl-certificates.md).

[doc-certbot]: ssl-certificates.md#certbot-recommended
[doc-self-signed]: ssl-certificates.md#self-signed-certificate

#### Outgoing email

- Outgoing email (SMTP) credentials that Zulip can use to send
  outgoing emails to users (e.g., email address confirmation emails
  during the signup process, message notification emails, password
  reset, etc.). If you don't have an existing outgoing SMTP solution,
  read about
  [free outgoing SMTP options and options for prototyping](email.md#free-outgoing-email-services).

Once you have met these requirements, see [full instructions for installing
Zulip in production](install.md).

## Scalability

This section details some basic guidelines for running a Zulip server
for larger organizations (especially >1000 users or 500+ daily active
users). These guidelines are conservative, since they are intended to
be sufficient for a wide range of possible usage patterns that may not
be applicable to your installation.

Zulip's resource needs depend mainly on 3 parameters:

- daily active users (e.g., number of employees if everyone's an
  employee)
- total user accounts (can be much larger)
- message volume.

In the following, we discuss a configuration with at most two types of
servers: application servers (running Django, Tornado, RabbitMQ,
Redis, Memcached, etc.) and database servers. Of the application
server services, Django dominates the resource requirements. One can
run every service on its own system (as
[docker-zulip](https://github.com/zulip/docker-zulip) does) but for
most use cases, there's little scalability benefit to doing so. See
[deployment options](deployment.md) for details on
installing Zulip with a dedicated database server.

- **Dedicated database**. For installations with hundreds of daily
  active users, we recommend using a [remote PostgreSQL
  database](postgresql.md), but it's not required.

- **RAM:** We recommend more RAM for larger installations:

  - With 25+ daily active users, 4 GB of RAM.
  - With 100+ daily active users, 8 GB of RAM.
  - With 400+ daily active users, 16 GB of RAM for the Zulip
    application server, plus 16 GB for the database.
  - With 2000+ daily active users 32 GB of RAM, plus 32 GB for the
    database.
  - Roughly linear scaling beyond that.

- **CPU:** The Zulip application server's CPU usage is heavily
  optimized due to extensive work on optimizing the performance of
  requests for latency reasons. Because most servers with sufficient
  RAM have sufficient CPU resources, CPU requirements are rarely an
  issue. For larger installations with a dedicated database, we
  recommend high-CPU instances for the application server and a
  database-optimized (usually low CPU, high memory) instance for the
  database.

- **Disk for application server:** We recommend using [the S3 file
  uploads backend][s3-uploads] to store uploaded files at scale. With
  the S3 backend configuration, we recommend 50 GB of disk for the OS,
  Zulip software, logs and scratch/free space. Because uploaded files
  are cached locally, you may need more disk space if you make heavy
  use of uploaded files.

- **Disk for database:** SSD disk is highly recommended. For
  installations where most messages have <100 recipients, 10 GB per 1M
  messages of history is sufficient plus 1 GB per 1000 users is
  sufficient. If most messages are to public channels with 10K+ users
  subscribed (like on chat.zulip.org), add 20 GB per (1000 user
  accounts) per (1M messages to public channels).

- **Example:** When
  [the Zulip development community](https://zulip.com/development-community/) server
  had 12K user accounts (~300 daily actives) and 800K messages of
  history (400K to public channels), it was a default configuration
  single-server installation with 16 GB of RAM, 4 cores (essentially
  always idle), and its database was using about 100 GB of disk.

- **Disaster recovery:** One can easily run a warm spare application
  server and a warm spare database (using [PostgreSQL warm standby
  replicas][streaming-replication]). Make sure the warm spare
  application server has copies of `/etc/zulip` and you're either
  syncing `LOCAL_UPLOADS_DIR` or using the [S3 file uploads
  backend][s3-uploads].

- **Sharding:** For servers with several thousand daily active users,
  Zulip supports [sharding its real-time-push Tornado
  service][tornado-sharding], both by realm/organization (for hosting many
  organizations) and by user ID (for hosting single very large
  organizations).

  Care must be taken when dividing traffic for a single Zulip realm
  between multiple Zulip application servers, which is why we
  recommend a hot spare over load-balancing for most installations
  desiring extra redundancy.

If you have scalability questions or are unsure whether Zulip is a fit
for your use case, contact [Zulip sales or support][contact-support]
for assistance.

For readers interested in technical details around what features
impact Zulip's scalability, this [performance and scalability design
document](../subsystems/performance.md) may also be of interest.

[s3-uploads]: upload-backends.md#s3-backend-configuration
[streaming-replication]: postgresql.md#postgresql-warm-standby
[contact-support]: https://zulip.com/help/contact-support
[tornado-sharding]: system-configuration.md#tornado_sharding
```

--------------------------------------------------------------------------------

---[FILE: reverse-proxies.md]---
Location: zulip-main/docs/production/reverse-proxies.md

```text
## Reverse proxies

Zulip is designed to support being run behind a reverse proxy server.
This section contains notes on the configuration required with
variable reverse proxy implementations.

### Installer options

If your Zulip server will not be on the public Internet, we recommend,
installing with the `--self-signed-cert` option (rather than the
`--certbot` option), since Certbot requires the server to be on the
public Internet.

#### Configuring Zulip to allow HTTP

Zulip requires clients to connect to Zulip servers over the secure
HTTPS protocol; the insecure HTTP protocol is not supported. However,
we do support using a reverse proxy that speaks HTTPS to clients and
connects to the Zulip server over HTTP; this can be secure when the
Zulip server is not directly exposed to the public Internet.

After installing the Zulip server as [described
above](#installer-options), you can configure Zulip to accept HTTP
requests from a reverse proxy as follows:

1. Add the following block to `/etc/zulip/zulip.conf`:

   ```ini
   [application_server]
   http_only = true
   ```

1. As root, run
   `/home/zulip/deployments/current/scripts/zulip-puppet-apply`. This
   will convert Zulip's main `nginx` configuration file to allow HTTP
   instead of HTTPS.

1. Finally, restart the Zulip server, using
   `/home/zulip/deployments/current/scripts/restart-server`.

Note that Zulip must be able to accurately determine if its connection to the
client was over HTTPS or not; if you enable `http_only`, it is very important
that you correctly configure Zulip to trust the `X-Forwarded-Proto` header from
its proxy (see the next section), or clients may see infinite redirects.

#### Configuring Zulip to trust proxies

Before placing Zulip behind a reverse proxy, it needs to be configured to trust
the client IP addresses that the proxy reports via the `X-Forwarded-For` header,
and the protocol reported by the `X-Forwarded-Proto` header. This is important
to have accurate IP addresses in server logs, as well as in notification emails
which are sent to end users. Zulip doesn't default to trusting all
`X-Forwarded-*` headers, because doing so would allow clients to spoof any IP
address, and claim connections were over a secure connection when they were not;
we specify which IP addresses are the Zulip server's incoming proxies, so we
know which `X-Forwarded-*` headers to trust.

1. Determine the IP addresses of all reverse proxies you are setting up, as seen
   from the Zulip host. Depending on your network setup, these may not be the
   same as the public IP addresses of the reverse proxies. These can also be IP
   address ranges, as expressed in CIDR notation.

1. Add the following block to `/etc/zulip/zulip.conf`.

   ```ini
   [loadbalancer]
   # Use the IP addresses you determined above, separated by commas.
   ips = 192.168.0.100
   ```

1. Reconfigure Zulip with these settings. As root, run
   `/home/zulip/deployments/current/scripts/zulip-puppet-apply`. This will
   adjust Zulip's `nginx` configuration file to accept the `X-Forwarded-For`
   header when it is sent from one of the reverse proxy IPs.

1. Finally, restart the Zulip server, using
   `/home/zulip/deployments/current/scripts/restart-server`.

### nginx configuration

Below is a working example of a full nginx configuration. It assumes
that your Zulip server sits at `https://10.10.10.10:443`; see
[above](#configuring-zulip-to-allow-http) to switch to HTTP.

1. Follow the instructions to [configure Zulip to trust
   proxies](#configuring-zulip-to-trust-proxies).

1. Configure the root `nginx.conf` file. We recommend using
   `/etc/nginx/nginx.conf` from your Zulip server for our recommended
   settings. E.g., if you don't set `client_max_body_size`, it won't be
   possible to upload large files to your Zulip server.

1. Configure the `nginx` site-specific configuration (in
   `/etc/nginx/sites-available`) for the Zulip app. The following
   example is a good starting point:

   ```nginx
   server {
           listen 80;
           listen [::]:80;
           location / {
                   return 301 https://$host$request_uri;
           }
   }

   server {
           listen                  443 ssl http2;
           listen                  [::]:443 ssl http2;
           server_name             zulip.example.com;

           ssl_certificate         /etc/letsencrypt/live/zulip.example.com/fullchain.pem;
           ssl_certificate_key     /etc/letsencrypt/live/zulip.example.com/privkey.pem;

           location / {
                   proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
                   proxy_set_header        X-Forwarded-Proto $scheme;
                   proxy_set_header        Host $host;
                   proxy_http_version      1.1;
                   proxy_buffering         off;
                   proxy_read_timeout      20m;
                   proxy_pass              https://10.10.10.10:443;
           }
   }
   ```

   Don't forget to update `server_name`, `ssl_certificate`,
   `ssl_certificate_key` and `proxy_pass` with the appropriate values
   for your deployment.

### Apache2 configuration

Below is a working example of a full Apache2 configuration. It assumes
that your Zulip server sits at `https://internal.zulip.hostname:443`.
Note that if you wish to use SSL to connect to the Zulip server,
Apache requires you use the hostname, not the IP address; see
[above](#configuring-zulip-to-allow-http) to switch to HTTP.

1. Follow the instructions to [configure Zulip to trust
   proxies](#configuring-zulip-to-trust-proxies).

1. Set `USE_X_FORWARDED_HOST = True` in `/etc/zulip/settings.py` and
   restart Zulip.

1. Enable some required Apache modules:

   ```bash
   a2enmod ssl proxy proxy_http headers rewrite
   ```

1. Create an Apache2 virtual host configuration file, similar to the
   following. Place it the appropriate path for your Apache2
   installation and enable it (e.g., if you use Debian or Ubuntu, then
   place it in `/etc/apache2/sites-available/zulip.example.com.conf`
   and then run
   `a2ensite zulip.example.com && systemctl reload apache2`):

   ```apache
   <VirtualHost *:80>
       ServerName zulip.example.com
       RewriteEngine On
       RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
   </VirtualHost>

   <VirtualHost *:443>
     ServerName zulip.example.com

     RequestHeader set "X-Forwarded-Proto" expr=%{REQUEST_SCHEME}

     RewriteEngine On
     RewriteRule /(.*)           https://internal.zulip.hostname:443/$1 [P,L]

     <Location />
       Require all granted
       ProxyPass https://internal.zulip.hostname:443/ timeout=1200
     </Location>

     SSLEngine on
     SSLProxyEngine on
     SSLCertificateFile /etc/letsencrypt/live/zulip.example.com/fullchain.pem
     SSLCertificateKeyFile /etc/letsencrypt/live/zulip.example.com/privkey.pem
     # This file can be found in ~zulip/deployments/current/puppet/zulip/files/nginx/dhparam.pem
     SSLOpenSSLConfCmd DHParameters "/etc/nginx/dhparam.pem"
     SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
     SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384
     SSLHonorCipherOrder off
     SSLSessionTickets off
     Header set Strict-Transport-Security "max-age=31536000"
   </VirtualHost>
   ```

   Don't forget to update `ServerName`, `RewriteRule`, `ProxyPass`,
   `SSLCertificateFile`, and `SSLCertificateKeyFile` as are
   appropriate for your deployment.

### HAProxy configuration

Below is a working example of a HAProxy configuration. It assumes that
your Zulip server sits at `https://10.10.10.10:443`; see
[above](#configuring-zulip-to-allow-http) to switch to HTTP.

1. Follow the instructions to [configure Zulip to trust
   proxies](#configuring-zulip-to-trust-proxies).

1. Configure HAProxy. The below is a minimal `frontend` and `backend`
   configuration:

   ```text
   frontend zulip
       mode http
       bind *:80
       bind *:443 ssl crt /etc/ssl/private/zulip-combined.crt
       http-request redirect scheme https code 301 unless { ssl_fc }
       http-request set-header X-Forwarded-Proto http unless { ssl_fc }
       http-request set-header X-Forwarded-Proto https if { ssl_fc }
       default_backend zulip

   backend zulip
       mode http
       timeout server 20m
       server zulip 10.10.10.10:443 check ssl ca-file /etc/ssl/certs/ca-certificates.crt
   ```

   Don't forget to update `bind *:443 ssl crt` and `server` as is
   appropriate for your deployment.

### Other proxies

If you're using another reverse proxy implementation, there are few
things you need to be careful about when configuring it:

1. Configure your reverse proxy (or proxies) to correctly maintain the
   `X-Forwarded-For` HTTP header, which is supposed to contain the series
   of IP addresses the request was forwarded through. Additionally,
   [configure Zulip to respect the addresses sent by your reverse
   proxies](#configuring-zulip-to-trust-proxies). You can verify
   your work by looking at `/var/log/zulip/server.log` and checking it
   has the actual IP addresses of clients, not the IP address of the
   proxy server.

1. Configure your reverse proxy (or proxies) to correctly maintain the
   `X-Forwarded-Proto` HTTP header, which is supposed to contain either `https`
   or `http` depending on the connection between your browser and your
   proxy. This will be used by Django to perform CSRF checks regardless of your
   connection mechanism from your proxy to Zulip. Note that the proxies _must_
   set the header, overriding any existing values, not add a new header.

   If your proxy _cannot_ set the `X-Forwarded-Proto` header, you can opt to do
   all HTTP-to-HTTPS redirection at the load-balancer level, and set
   [`loadbalancer.rejects_http_requests` in `zulip.conf`][no-proto-header]; but
   note the important security caveats for that in its documentation.

1. Configure your proxy to pass along the `Host:` header as was sent
   from the client, not the internal hostname as seen by the proxy.
   If this is not possible, you can set `USE_X_FORWARDED_HOST = True`
   in `/etc/zulip/settings.py`, and pass the client's `Host` header to
   Zulip in an `X-Forwarded-Host` header.

1. Ensure your proxy doesn't interfere with Zulip's use of
   long-polling for real-time push from the server to your users'
   browsers. This [nginx code snippet][nginx-proxy-longpolling-config]
   does this.

   The key configuration options are:

   - `proxy_read_timeout 1200;`. It's critical that this be significantly above
     60s, but the precise value isn't important. This is most important for the
     events API, but must be applied to all endpoints.
   - `proxy_buffering off`. If you don't do this, your `nginx` proxy may return
     occasional 502 errors to clients using Zulip's events API.

1. The other tricky failure mode we've seen with `nginx` reverse
   proxies is that they can load-balance between the IPv4 and IPv6
   addresses for a given hostname. This can result in mysterious errors
   that can be quite difficult to debug. Be sure to declare your
   `upstreams` equivalent in a way that won't do load-balancing
   unexpectedly (e.g., pointing to a DNS name that you haven't configured
   with multiple IPs for your Zulip machine; sometimes this happens with
   IPv6 configuration).

[no-proto-header]: system-configuration.md#rejects_http_requests
[nginx-proxy-longpolling-config]: https://github.com/zulip/zulip/blob/main/puppet/zulip/files/nginx/zulip-include-common/proxy_longpolling
```

--------------------------------------------------------------------------------

---[FILE: scim.md]---
Location: zulip-main/docs/production/scim.md

```text
# SCIM provisioning

Zulip has beta support for user provisioning and deprovisioning via
the SCIM protocol. In SCIM, a third-party SCIM Identity Provider (IdP)
acts as the SCIM client, connecting to the service provider (your Zulip
server).

See the [SCIM help center page](https://zulip.com/help/scim) for
documentation on SCIM in [Zulip Cloud](https://zulip.com) as well as
detailed documentation for how to configure some SCIM IdP providers.

Synchronizing groups via SCIM is currently not supported.

## Server configuration

The Zulip server-side configuration is straightforward:

1. Pick a client name for your SCIM client. This name is internal to
   your Zulip configuration, so the name of your IdP provider is a
   good choice. We'll use `okta` in the examples below.

1. Configure the Zulip server by adding a `SCIM_CONFIG` block to your
   `/etc/zulip/settings.py`:

   ```python
   SCIM_CONFIG = {
       "subdomain": {
           "bearer_token": "<secret token>",
           "scim_client_name": "okta",
           "name_formatted_included": False,
       }
   }
   ```

   The `bearer_token` should contain a secure, secret token that you
   generate. You can use any secure password generation tools for this,
   such as the `apg` command included by default in some Linux distributions.
   For example, `apg -m20` will generate some passwords of minimum length 20
   for you.

   Make sure to restart the server after editing your settings, by running
   `/home/zulip/deployments/current/scripts/restart-server`.

   The SCIM IdP will authenticate its requests to your Zulip server by
   sending a `WWW-Authenticate` header like this:
   `WWW-Authenticate: Bearer <secret token>`. `name_formatted_included` needs to be set
   to `False` for Okta. It tells Zulip whether the IdP includes
   `name.formatted` in its `User` representation.

1. Now you can proceed to [configuring your SCIM IdP](https://zulip.com/help/scim).
   Use the value `Bearer <secret token>` using the `bearer_token` you've generated
   earlier as the `API token` that the SCIM IdP will ask for when configuring
   authentication details.

## Additional options

- To enable the creation of guest accounts without automatically subscribing them to any initial channels,
  add `"create_guests_without_streams": True` to your client's config dict in `SCIM_CONFIG`.
  This option is particularly useful for organizations that prefer to manually invite new guest users
  to the appropriate channels.

  Example configuration with the additional option:

  ```
  SCIM_CONFIG = {
     "subdomain": {
        "bearer_token": "<secret token>",
        "scim_client_name": "okta",
        "name_formatted_included": False,
        "create_guests_without_streams": True,
     }
  }
  ```
```

--------------------------------------------------------------------------------

---[FILE: securing-your-zulip-server.md]---
Location: zulip-main/docs/production/securing-your-zulip-server.md

```text
# Securing your Zulip server

This page offers practical information on how to secure your Zulip server. For a
deeper understanding of the security model, take a look at Zulip's [security
overview](https://zulip.com/security/).

Here are some best practices for keeping your Zulip server secure:

1. [Limit shell access to a small set of trusted individuals.](#1-limit-shell-access-to-a-small-set-of-trusted-individuals)
2. [Consider requiring authentication with single sign-on (SSO).](#2-consider-requiring-authentication-with-single-sign-on-sso)
3. [Teach users how to protect their account.](#3-teach-users-how-to-protect-their-account)
4. [Become familiar with Zulip's access management model.](#4-become-familiar-with-zulips-access-management-model)
5. [Understand security for user-uploaded content and user-generated requests.](#5-understand-security-for-user-uploaded-content-and-user-generated-requests)
6. [Understand Zulip's rate-limiting system.](#6-understand-zulips-rate-limiting-system)

If you believe you've identified a security issue, please report it to Zulip's
security team at [security@zulip.com](mailto:security@zulip.com) as soon as
possible, so that we can address it and make a responsible disclosure.

## 1. Limit shell access to a small set of trusted individuals.

Anyone with root access to a Zulip application server or Zulip database server,
or with access to the `zulip` user on a Zulip application server, has _complete
control over the Zulip installation_ and all of its data (so they can read
messages, modify history, etc.). This means that _only trusted individuals_
should have shell access to your Zulip server.

## 2. Consider requiring authentication with single sign-on (SSO).

The preferred way to log in to Zulip is using a single sign-on (SSO)
solution like Google authentication, LDAP, or similar, but Zulip
also supports password authentication. See [the authentication
methods documentation](authentication-methods.md) for
details on Zulip's available authentication methods.

## 3. Teach users how to protect their account.

Every Zulip user has an API key, which can be used to do essentially everything
that users can do when they're logged in. Make sure users know to immediately
[reset their API key and password](https://zulip.com/help/protect-your-account)
if their credentials are compromised (e.g., their cell phone is lost or stolen).

## 4. Become familiar with Zulip's access management model.

Zulip's help center offers a detailed overview of Zulip's permissions management
system. Reading the following guides will give you a good starting point:

- [Channel types and permissions](https://zulip.com/help/channel-permissions)
- [User roles](https://zulip.com/help/user-roles)
- [User groups](https://zulip.com/help/user-groups)
- [Restrict message editing and deletion](https://zulip.com/help/restrict-message-editing-and-deletion)
- [Bots overview](https://zulip.com/help/bots-overview)

## 5. Understand security for user-uploaded content and user-generated requests.

- Zulip supports user-uploaded files. Ideally they should be hosted
  from a separate domain from the main Zulip server to protect against
  various same-domain attacks (e.g., zulip-user-content.example.com).

  We support two ways of hosting them: the basic `LOCAL_UPLOADS_DIR`
  file storage backend, where they are stored in a directory on the
  Zulip server's filesystem, and the S3 backend, where the files are
  stored in Amazon S3. It would not be difficult to add additional
  supported backends should there be a need; see
  `zerver/lib/upload.py` for the full interface.

  For both backends, the URLs used to access uploaded files are long,
  random strings, providing one layer of security against unauthorized
  users accessing files uploaded in Zulip (an authorized user would
  need to share the URL with an unauthorized user in order for the
  file to be accessed by the unauthorized user. Of course, any
  such authorized user could have just downloaded and sent the file
  instead of the URL, so this is arguably pretty good protection.)

  However, to help protect against accidental sharing of URLs to
  restricted files (e.g., by forwarding a missed-message email or leaks
  involving the Referer header), every access to an uploaded file has
  access control verified (confirming that the browser is logged into
  a Zulip account that has received the uploaded file in question).

- Zulip supports using the [go-camo][go-camo] image proxy to proxy content like
  inline image previews, that can be inserted into the Zulip message feed by
  other users. This ensures that clients do not make requests to external
  servers to fetch images, improving privacy.

- By default, Zulip will provide image previews inline in the body of
  messages when a message contains a link to an image. You can
  control this using the `INLINE_IMAGE_PREVIEW` setting.

- Zulip may make outgoing HTTP connections to other servers in a
  number of cases:

  - Outgoing webhook bots (creation of which can be restricted)
  - Inline image previews in messages (enabled by default, but can be disabled)
  - Inline webpage previews and embeds (must be configured to be enabled)
  - Twitter message previews (must be configured to be enabled)
  - BigBlueButton and Zoom API requests (must be configured to be enabled)
  - Mobile push notifications (must be configured to be enabled)

- Notably, these first 3 features give end users (limited) control to cause
  the Zulip server to make HTTP requests on their behalf. Because of this,
  Zulip routes all outgoing HTTP requests [through
  Smokescreen][smokescreen-setup] to ensure that Zulip cannot be
  used to execute [SSRF attacks][ssrf] against other systems on an
  internal corporate network. The default Smokescreen configuration
  denies access to all non-public IP addresses, including 127.0.0.1.

  The Camo image server does not, by default, route its traffic
  through Smokescreen, since Camo includes logic to deny access to
  private subnets; this can be [overridden][proxy.enable_for_camo].

[go-camo]: https://github.com/cactus/go-camo
[ssrf]: https://owasp.org/www-community/attacks/Server_Side_Request_Forgery
[smokescreen-setup]: deployment.md#customizing-the-outgoing-http-proxy
[proxy.enable_for_camo]: system-configuration.md#enable_for_camo

## 6. Understand Zulip's rate-limiting system.

Zulip has built-in rate limiting of login attempts, all access to the
API, as well as certain other types of actions that may be involved in
abuse. For example, the email confirmation flow, by its nature, needs
to allow sending an email to an email address that isn't associated
with an existing Zulip account. Limiting the ability of users to
trigger such emails helps prevent bad actors from damaging the spam
reputation of a Zulip server by sending confirmation emails to random
email addresses.

The default rate limiting rules for a Zulip server will change as we improve
the product. A server administrator can browse the current rules using
`/home/zulip/deployments/current/scripts/get-django-setting
RATE_LIMITING_RULES`; or with comments by reading
`DEFAULT_RATE_LIMITING_RULES` in `zproject/default_settings.py`.

Server administrators can tweak rate limiting in the following ways in
`/etc/zulip/settings.py`:

- The `RATE_LIMITING` setting can be set to `False` to completely
  disable all rate-limiting.
- The `RATE_LIMITING_RULES` setting can be used to override specific
  rules. See the comment in the file for more specific details on how
  to do it. After changing the setting, we recommend using
  `/home/zulip/deployments/current/scripts/get-django-setting
RATE_LIMITING_RULES` to verify your changes. You can then restart
  the Zulip server with `scripts/restart-server` to have the new
  configuration take effect.
- The `RATE_LIMIT_TOR_TOGETHER` setting can be set to `True` to group all
  known exit nodes of [TOR](https://www.torproject.org/) together for purposes
  of IP address limiting. Since traffic from a client using TOR is distributed
  across its exit nodes, without enabling this setting, TOR can otherwise be
  used to avoid IP-based rate limiting. The updated list of TOR exit nodes
  is refetched once an hour.
- If a user runs into the rate limit for login attempts, a server
  administrator can clear this state using the
  `manage.py reset_authentication_attempt_count`
  [management command][management-commands].

See also our [API documentation on rate limiting][rate-limit-api].

[management-commands]: ../production/management-commands.md
[rate-limit-api]: https://zulip.com/api/rest-error-handling#rate-limit-exceeded
```

--------------------------------------------------------------------------------

---[FILE: settings.md]---
Location: zulip-main/docs/production/settings.md

```text
# Server configuration

This page explains the configuration options in `/etc/zulip/settings.py`, the
main configuration file used by system administrators to configure their Zulip
server.

[Organization administrators][user-roles] can also [configure][realm-admin-docs]
many options for a Zulip organization from the web or desktop app. See [system
and deployment configuration documentation](system-configuration.md) for advanced
configuration of the various services that make up a complete Zulip installation
(`/etc/zulip/zulip.conf`).

[realm-admin-docs]: https://zulip.com/help/moving-to-zulip
[user-roles]: https://zulip.com/help/user-roles

## Server settings overview

The Zulip server self-documents more than a hundred settings in the
organized comments in `/etc/zulip/settings.py`. You can read [the
latest version of the settings.py template][settings-py-template] in a
browser.

[settings-py-template]: https://github.com/zulip/zulip/blob/main/zproject/prod_settings_template.py

Important settings in `/etc/zulip/settings.py` include:

- The mandatory `EXTERNAL_HOST` and `ZULIP_ADMINISTRATOR` settings,
  which are prefilled by the [installer](install.md).
- [Authentication methods](authentication-methods.md), including data
  synchronization options like LDAP and SCIM.
- The [email gateway](email-gateway.md), which lets
  users send emails into Zulip.
- [Video and voice call integrations](video-calls.md).
- How the server should store [uploaded files](upload-backends.md).

## Changing server settings

To change any of the settings in `/etc/zulip/settings.py`, modify and save the
file on your Zulip server, and restart the server with the following command:

```bash
su zulip -c '/home/zulip/deployments/current/scripts/restart-server'
```

If you have questions about how to configure your server, best-effort community
support is available in the [Zulip development community][chat-zulip-org].
Contact [sales@zulip.com](mailto:sales@zulip.com) to learn about paid support
options.

[chat-zulip-org]: https://zulip.com/development-community/

## Customizing user onboarding

### Navigation tour video

New users are offered a [2-minute video
tour](https://static.zulipchat.com/static/navigation-tour-video/zulip-10.mp4),
which shows where to find everything to get started with Zulip.

You can modify `NAVIGATION_TOUR_VIDEO_URL` in `/etc/zulip/settings.py` in order
to host the official video on your network, or to provide your own introductory
video with information on how your organization uses Zulip. A value of `None`
disables the navigation tour video experience.

### Terms of Service and Privacy policy

:::{important}

If you are using this feature, please make sure the name of your organization
appears prominently in all documents, to avoid confusion with policies for Zulip
Cloud.

:::

Zulip lets you configure your server's Terms of Service and
Privacy Policy pages.

Policy documents are stored as Markdown files in the configured
`POLICIES_DIRECTORY`. We recommend using `/etc/zulip/policies` as the directory,
so that your policies are naturally backed up with the server's other
configurations.

To provide Terms of Service and a Privacy Policy for your users, place Markdown
files named `terms.md` and `privacy.md` in the configured directory, and set
`TERMS_OF_SERVICE_VERSION` to `1.0` to enable this feature.

You can put additional files in the same directory to document other
policies; if you do so, you may want to:

- Create a Markdown file `sidebar_index.md` listing the pages in your
  policies site; this generates the policies site navigation.
- Create a Markdown file `missing.md` with custom content for 404s in
  this directory.
```

--------------------------------------------------------------------------------

````
