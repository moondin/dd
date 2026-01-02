---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 274
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 274 of 1290)

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

---[FILE: upload-backends.md]---
Location: zulip-main/docs/production/upload-backends.md

```text
# File upload backends

Zulip in production supports a couple different backends for storing
files uploaded by users of the Zulip server (messages, profile
pictures, organization icons, custom emoji, etc.).

The default is the `LOCAL_UPLOADS_DIR` backend, which just stores
files on disk in the specified directory on the Zulip server.
Obviously, this backend doesn't work with multiple Zulip servers and
doesn't scale, but it's great for getting a Zulip server up and
running quickly. You can later migrate the uploads to S3 by
[following the instructions here](#migrating-from-local-uploads-to-amazon-s3-backend).

We also support an `S3` backend, which uses the Python `boto` library
to upload files to Amazon S3 (or an S3-compatible block storage
provider supported by the `boto` library).

Regardless of the backend you choose, you can configure the maximum
size of individual uploaded files using the `MAX_FILE_UPLOAD_SIZE`
[server setting](../production/settings.md). Setting it to 0 disables
file uploads, and hides the UI for uploading files from the web and
desktop apps.

## S3 backend configuration

Here, we document the process for configuring Zulip's S3 file upload
backend. To enable this backend, you need to do the following:

1. In the AWS management console, create a new IAM account (aka API
   user) for your Zulip server, and two buckets in S3, one for uploaded
   files included in messages, and another for user avatars. You need
   two buckets because the "user avatars" bucket is generally configured
   as world-readable, whereas the "uploaded files" one is not.

1. Set `s3_key` and `s3_secret_key` in /etc/zulip/zulip-secrets.conf
   to be the S3 access and secret keys for the IAM account.
   Alternately, if your Zulip server runs on an EC2 instance, set the
   IAM role for the EC2 instance to the role created in the previous
   step.

1. Set the `S3_AUTH_UPLOADS_BUCKET` and `S3_AVATAR_BUCKET` settings in
   `/etc/zulip/settings.py` to be the names of the S3 buckets you
   created (e.g., `"exampleinc-zulip-uploads"`).

1. Comment out the `LOCAL_UPLOADS_DIR` setting in
   `/etc/zulip/settings.py` (add a `#` at the start of the line).

1. If you are using a non-AWS block storage provider,
   you need to set the `S3_ENDPOINT_URL` setting to your
   endpoint url (e.g., `"https://s3.eu-central-1.amazonaws.com"`).

   For certain AWS regions, you may need to set the `S3_REGION`
   setting to your default AWS region's code (e.g., `"eu-central-1"`).

1. Non-AWS block storage providers may need `S3_SKIP_CHECKSUM = True`; you
   should try without this at first, but enable it if you see exceptions
   involving `XAmzContentSHA256Mismatch`.

1. Finally, restart the Zulip server so that your settings changes
   take effect
   (`/home/zulip/deployments/current/scripts/restart-server`).

It's simplest to just do this configuration when setting up your Zulip
server for production usage. Note that if you had any existing
uploading files, this process does not upload them to Amazon S3; see
[migration instructions](#migrating-from-local-uploads-to-amazon-s3-backend)
below for those steps.

### Google Cloud Platform

In addition to configuring `settings.py` as suggested above:

```python
S3_AUTH_UPLOADS_BUCKET = "..."
S3_AVATAR_BUCKET = "..."
S3_ENDPOINT_URL = "https://storage.googleapis.com"
S3_SKIP_CHECKSUM = True
```

...and adding `s3_key` and `s3_secret_key` in `/etc/zulip/zulip-secrets.conf`,
you will need to also add a `/etc/zulip/gcp_key.json` which contains a [service
account key][gcp-key] with "Storage Object Admin" permissions on the uploads
bucket. This is used by the `tusd` chunked upload service when receiving file
uploads from clients.

[gcp-key]: https://cloud.google.com/iam/docs/keys-create-delete

## S3 local caching

For performance reasons, Zulip stores a cache of recently served user
uploads on disk locally, even though the durable storage is kept in
S3. There are a number of parameters which control the size and usage
of this cache, which is maintained by nginx:

- `s3_memory_cache_size` controls the in-memory size of the cache
  _index_; the default is 1MB, which is enough to store about 8 thousand
  entries.
- `s3_disk_cache_size` controls the on-disk size of the cache
  _contents_; the default is 200MB.
- `s3_cache_inactive_time` controls the longest amount of time an
  entry will be cached since last use; the default is 30 days. Since
  the contents of the cache are immutable, this serves only as a
  potential additional limit on the size of the contents on disk;
  `s3_disk_cache_size` is expected to be the primary control for cache
  sizing.

These defaults are likely sufficient for small-to-medium deployments.
Large deployments, or deployments with image-heavy use cases, will
want to increase `s3_disk_cache_size`, potentially to be several
gigabytes. `s3_memory_cache_size` should potentially be increased,
based on estimating the number of files that the larger disk cache
will hold.

You may also wish to increase the cache sizes if the S3 storage (or
S3-compatible equivalent) is not closely located to your Zulip server,
as cache misses will be more expensive.

## nginx DNS nameserver configuration

The S3 cache described above is maintained by nginx. nginx's configuration
requires an explicitly-set DNS nameserver to resolve the hostname of the S3
servers; Zulip defaults this value to the first nameserver found in
`/etc/resolv.conf`, but this resolver can be [adjusted in
`/etc/zulip/zulip.conf`][s3-resolver] if needed. If you adjust this value, you
will need to run `/home/zulip/deployments/current/scripts/zulip-puppet-apply` to
update the nginx configuration for the new value.

[s3-resolver]: system-configuration.md#nameserver

## S3 bucket policy

The best way to do the S3 integration with Amazon is to create a new IAM user
just for your Zulip server with limited permissions. For both the user uploads
bucket and the user avatars bucket, you'll need to adjust the [S3 bucket
policy](https://awspolicygen.s3.amazonaws.com/policygen.html).

The file uploads bucket should have a policy of:

```json
{
    "Version": "2012-10-17",
    "Id": "Policy1468991802320",
    "Statement": [
        {
            "Sid": "Stmt1468991795370",
            "Effect": "Allow",
            "Principal": {
                "AWS": "ARN_PRINCIPAL_HERE"
            },
            "Action": [
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::BUCKET_NAME_HERE/*"
        },
        {
            "Sid": "Stmt1468991795371",
            "Effect": "Allow",
            "Principal": {
                "AWS": "ARN_PRINCIPAL_HERE"
            },
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::BUCKET_NAME_HERE"
        }
    ]
}
```

The file-uploads bucket should not be world-readable. See the
[documentation on the Zulip security model](securing-your-zulip-server.md) for
details on the security model for uploaded files.

However, the avatars bucket is intended to be world-readable, so its
policy should be:

```json
{
    "Version": "2012-10-17",
    "Id": "Policy1468991802321",
    "Statement": [
        {
            "Sid": "Stmt1468991795380",
            "Effect": "Allow",
            "Principal": {
                "AWS": "ARN_PRINCIPAL_HERE"
            },
            "Action": [
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::BUCKET_NAME_HERE/*"
        },
        {
            "Sid": "Stmt1468991795381",
            "Effect": "Allow",
            "Principal": {
                "AWS": "ARN_PRINCIPAL_HERE"
            },
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::BUCKET_NAME_HERE"
        },
        {
            "Sid": "Stmt1468991795382",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::BUCKET_NAME_HERE/*"
        }
    ]
}
```

## Migrating from local uploads to Amazon S3 backend

As you scale your server, you might want to migrate the uploads from
your local backend to Amazon S3. Follow these instructions, step by
step, to do the migration.

1. First, [set up the S3 backend](#s3-backend-configuration) in the settings
   (all the auth stuff), but leave `LOCAL_UPLOADS_DIR` set -- the
   migration tool will need that value to know where to find your uploads.
2. Run `./manage.py transfer_uploads_to_s3`. This will upload all the
   files from the local uploads directory to Amazon S3. By default,
   this command runs on 6 parallel processes, since uploading is a
   latency-sensitive operation. You can control this parameter using
   the `--processes` option.
3. Once the transfer script completes, disable `LOCAL_UPLOADS_DIR`, and
   restart your server (continuing the last few steps of the S3
   backend setup instructions).

Congratulations! Your uploaded files are now migrated to S3.

**Caveat**: The current version of this tool does not migrate an
uploaded organization avatar or logo.

## S3 data storage class

In general, uploaded files in Zulip are accessed frequently at first, and then
age out of frequent access. The S3 backend provides the [S3
Intelligent-Tiering][s3-it] [storage class][s3-storage-class] which provides
cheaper storage for less frequently accessed objects, and may provide overall
cost savings for large deployments.

You can configure Zulip to store uploaded files using Intelligent-Tiering by
setting `S3_UPLOADS_STORAGE_CLASS` to `INTELLIGENT_TIERING` in `settings.py`.
This setting can take any of the following [storage class
value][s3-storage-class-constant] values:

- `STANDARD`
- `STANDARD_IA`
- `ONEZONE_IA`
- `REDUCED_REDUNDANCY`
- `GLACIER_IR`
- `INTELLIGENT_TIERING`

Setting `S3_UPLOADS_STORAGE_CLASS` does not affect the storage class of existing
objects. In order to change those, for example to `INTELLIGENT_TIERING`, perform
an in-place copy:

    aws s3 cp --storage-class INTELLIGENT_TIERING --recursive \
        s3://your-bucket-name/ s3://your-bucket-name/

Note that changing the lifecycle of existing objects will incur a [one-time
lifecycle transition cost][s3-pricing].

[s3-it]: https://aws.amazon.com/s3/storage-classes/intelligent-tiering/
[s3-storage-class]: https://aws.amazon.com/s3/storage-classes/
[s3-storage-class-constant]: https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html#AmazonS3-PutObject-request-header-StorageClass
[s3-pricing]: https://aws.amazon.com/s3/pricing/

## Data export bucket

The [data export process](export-and-import.md#data-export) process, when
[triggered from the
UI](https://zulip.com/help/export-your-organization), uploads the
completed export so it is available to download from the server; this
is also available [from the command
line](export-and-import.md#export-your-zulip-data) by passing
`--upload`. When the S3 backend is used, these uploads are done to S3.

By default, they are uploaded to the bucket with user avatars
(`S3_AVATAR_BUCKET`), because that bucket is world-readable, allowing
easy generation of links to download the export.

If you would like to store exports in a dedicated bucket, you can set
`S3_EXPORT_BUCKET` in your `/etc/zulip/settings.py`. This bucket
should also be configured like the uploads bucket, only allowing write
access to the Zulip account, as it will generate links which are valid
for 1 week at a time:

```json
{
    "Version": "2012-10-17",
    "Id": "Policy1468991802322",
    "Statement": [
        {
            "Sid": "Stmt1468991795390",
            "Effect": "Allow",
            "Principal": {
                "AWS": "ARN_PRINCIPAL_HERE"
            },
            "Action": [
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::BUCKET_NAME_HERE/*"
        },
        {
            "Sid": "Stmt1468991795391",
            "Effect": "Allow",
            "Principal": {
                "AWS": "ARN_PRINCIPAL_HERE"
            },
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::BUCKET_NAME_HERE"
        }
    ]
}
```

You should copy existing exports to the new bucket. For instance,
using the [AWS CLI](https://aws.amazon.com/cli/)'s [`aws s3
sync`](https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html),
if the old bucket was named `example-zulip-avatars` and the new export
bucket is named `example-zulip-exports`:

```
aws s3 sync s3://example-zulip-avatars/exports/ s3://example-zulip-exports/
```
```

--------------------------------------------------------------------------------

---[FILE: video-calls.md]---
Location: zulip-main/docs/production/video-calls.md

```text
# Video call providers

Zulip makes it convenient to [start a
call](https://zulip.com/help/start-a-call) with the click of a button, using the
call provider of your choice. The call providers
supported by Zulip are:

- [Jitsi Meet](https://zulip.com/integrations/jitsi), a fully-encrypted,
  100% open source video conferencing solution.
- [Zoom](https://zulip.com/integrations/zoom)
- [BigBlueButton](https://zulip.com/integrations/big-blue-button)

By default, Zulip uses the [cloud version of Jitsi Meet](https://meet.jit.si/)
as its call provider. This page documents the configurations required to support
other [video call integration
options](https://zulip.com/help/configure-call-provider) on a self-hosted Zulip
server.

:::{note}
You can disable the video and voice call buttons for your organization by
[setting the call
provider](https://zulip.com/help/configure-call-provider)
to "None".
:::

## Jitsi

You can configure Zulip to use a self-hosted
instance of Jitsi Meet by providing the URL of your self-hosted Jitsi Meet
server [in organization
settings](https://zulip.com/help/configure-call-provider#use-a-self-hosted-instance-of-jitsi-meet).
No server configuration changes are required.

## Zoom

To use a [Zoom](https://zoom.us) integration on a self-hosted
installation, you'll need to register a custom Zoom application for
your Zulip server. Zulip supports two types of custom Zoom apps:

- [Server to Server OAuth app](#server-to-server-oauth-app): Easiest to set up,
  but requires users to be part of the Zoom organization that created the
  application in order to create calls.

- [General OAuth app](#general-oauth-app): Recommended for settings where the
  limitations of the Server to Server OAuth app are problematic (e.g., this is
  used by Zulip Cloud).

### Server to Server OAuth app

This Zoom application type, introduced in Zulip 10.0, is easiest to
set up, and is ideal for most installations that self-host Zulip. To
[create Zoom meeting links in Zulip
messages](https://zulip.com/help/start-a-call#start-a-call) using this
integration, users will will need to be members of your Zoom
organization and use the same email address in Zulip that they have
registered with Zoom.

You can set up this integration as follows:

1. Select [**Build App**](https://marketplace.zoom.us/develop/create)
   at the Zoom Marketplace. Create a **Server to Server OAuth App**.

1. Choose an app name such as "ExampleCorp Zulip".

1. In the **Information** tab:

   - Add a short description and company name.
   - Add a name and email for the developer contact information.

1. In the **Scopes** tab, add the `meeting:write:meeting:admin` and
   `meeting:write:meeting:master` scopes.

1. In the **Activation** tab, activate your app. You can now
   [configure your Zulip server](#configure-your-zulip-server)
   to use the app.

### General OAuth app

This Zoom application type is more flexible than the server-to-server
integration. However, current Zoom policy requires all General OAuth
apps to go through the full Zoom Marketplace review process, even for
[unlisted
apps](https://developers.zoom.us/docs/platform/key-concepts/#private-vs-beta-vs-published-vs-unlisted-apps)
that will only be used by a single customer. As a result, you have to
do quite a bit of publishing overhead work in order to create this
type of Zoom application for your Zulip server.

1. Select [**Build App**](https://marketplace.zoom.us/develop/create)
   at the Zoom Marketplace. Create a **General App**.

1. In the **Basic Information** tab:

   - Choose an app name such as "ExampleCorp Zulip".
   - Select **User-managed app**.
   - In the **OAuth Information** section, set the **OAuth Redirect URL**
     to `https://zulip.example.com/calls/zoom/complete` (replacing
     `zulip.example.com` by your main Zulip hostname).

<!--
If we ever need to increase scopes in the future, we should also include the scopes
required to retrieve a user's details via this
endpoint: https://developers.zoom.us/docs/api/users/#tag/users/get/users/{userId}

This will help us implement a deauthorization workflow for Zoom app integrations,
where we delete the user's zoom_token from the database upon receiving a request
from Zoom’s deauthorization webhook, based on the user's zoom_id, which is part
of the deauthorization request payload.

Details: https://chat.zulip.org/#narrow/channel/49-development-help/topic/What's.20the.20use.20of.20.60.2Fcalls.2Fzoom.2Fdeauthorize.60.20endpoint/with/2296326
 -->

1. In the **Scopes** tab, add the `meeting:write:meeting` scope.

1. Switch to the **Production** tab and complete the information needed
   for the [Zoom App Marketplace Review
   Process](https://developers.zoom.us/docs/distribute/app-review-process/)
   in the **App Listing** and **Technical Design** tabs.

1. [Submit your app for
   review](https://developers.zoom.us/docs/build-flow/submitting-apps-for-review/).
   Select the **Publish the app by myself** option on the **App Submission**
   page so that the app will be
   [unlisted](https://developers.zoom.us/docs/build-flow/publishing-your-apps/#unlisted-apps).

1. Once your app has been approved by the Zoom app review team, then
   you can proceed to [configure your Zulip server](#configure-your-zulip-server)
   to use the app.

### Configure your Zulip server

1. In `/etc/zulip/zulip-secrets.conf`, set `video_zoom_client_secret`
   to be your app's "Client Secret".

1. In `/etc/zulip/settings.py`, set `VIDEO_ZOOM_CLIENT_ID` to your
   app's "Client ID". Some Zoom enterprise customers that don't use
   `zoom.us` will need to set `VIDEO_ZOOM_API_URL` for the Zoom API
   server and `VIDEO_ZOOM_OAUTH_URL` for your instance's
   authorization. If you're using a Zoom [Server to Server OAuth
   app](#server-to-server-oauth-app), set
   `VIDEO_ZOOM_SERVER_TO_SERVER_ACCOUNT_ID` to be your app's "Account
   ID".

1. Restart the Zulip server with
   `/home/zulip/deployments/current/scripts/restart-server`.

This enables Zoom support in your Zulip server. Finally, [configure Zoom as the
video call
provider](https://zulip.com/help/configure-call-provider)
in the Zulip organizations where you want to use it.

## BigBlueButton

To use the [BigBlueButton](https://bigbluebutton.org/) video call
integration on a self-hosted Zulip installation, you'll need to have a
BigBlueButton server (version 2.4+) and configure it:

1. Get the Shared Secret using the `bbb-conf --secret` command on your
   BigBlueButton Server. See also [the BigBlueButton
   documentation](https://docs.bigbluebutton.org/administration/customize/#extract-the-shared-secret).

2. Get the URL to your BigBlueButton API. The URL has the form of
   `https://bigbluebutton.example.com/bigbluebutton/` and can also be
   found using the `bbb-conf --secret` command.

You can then configure your Zulip server to use that BigBlueButton
Server as follows:

1. In `/etc/zulip/zulip-secrets.conf`, set `big_blue_button_secret`
   to be your BigBlueButton Server's shared secret.

2. In `/etc/zulip/settings.py`, set `BIG_BLUE_BUTTON_URL` to your
   to be your BigBlueButton Server's API URL.

3. Restart the Zulip server with
   `/home/zulip/deployments/current/scripts/restart-server`.

This enables BigBlueButton support in your Zulip server. Finally, [configure
BigBlueButton as the video call
provider](https://zulip.com/help/configure-call-provider)
in the Zulip organizations where you want to use it.
```

--------------------------------------------------------------------------------

---[FILE: accessibility.md]---
Location: zulip-main/docs/subsystems/accessibility.md

```text
# Accessibility

## Guidelines

In order to accommodate all users, Zulip strives to implement accessibility
best practices in its user interface. There are many aspects to accessibility;
here are some of the more important ones to keep in mind.

- All images should have alternative text attributes for the benefit of users
  who cannot see them (this includes users who are utilizing a voice interface
  to free up their eyes to look at something else instead).
- The entire application should be usable via a keyboard (many users are unable
  to use a mouse, and many accessibility aids emulate a keyboard).
- Text should have good enough contrast against the background to enable
  even users with moderate visual impairment to be able to read it.
- [ARIA](https://www.w3.org/WAI/intro/aria) (Accessible Rich Internet
  Application) attributes should be used appropriately to enable screen
  readers and other alternative interfaces to navigate the application
  effectively.

There are many different standards for accessibility, but the most relevant
one for Zulip is the W3C's [WCAG](https://www.w3.org/TR/WCAG20/) (Web Content
Accessibility Guidelines), currently at version 2.0. Whenever practical, we
should strive for compliance with the AA level of this specification.
(The W3C itself
[recommends not trying](https://www.w3.org/TR/UNDERSTANDING-WCAG20/conformance.html#uc-conf-req1-head)
to comply with the highest AAA level for an entire web site or application,
as it is not possible for some content.)

## Tools

There are tools available to automatically audit a web page for compliance
with many of the WCAG guidelines. Here are some of the more useful ones:

- [Accessibility Developer Tools][chrome-webstore]
  This open-source Chrome extension from Google adds an accessibility audit to
  the "Audits" tab of the Chrome Developer Tools. The audit is performed
  against the page's DOM via JavaScript, allowing it to identify some issues
  that a static HTML inspector would miss.
- [axe](https://www.deque.com/products/axe/) An open-source Chrome and Firefox
  extension which runs a somewhat different set of checks than Google's Chrome
  extension.
- [Wave](https://wave.webaim.org/) This web application takes a URL and loads
  it in a frame, reporting on all the issues it finds with links to more
  information. Has the advantage of not requiring installation, but requires
  a URL which can be directly accessed by an external site.
- [Web Developer](https://chrispederick.com/work/web-developer/) This browser
  extension has many useful features, including a convenient link for opening
  the current URL in Wave to get an accessibility report.

Note that these tools cannot catch all possible accessibility problems, and
sometimes report false positives as well. They are a useful aid in quickly
identifying potential problems and checking for regressions, but their
recommendations should not be blindly obeyed.

## GitHub issues

Problems with Zulip's accessibility should be reported as
[GitHub issues](https://github.com/zulip/zulip/issues) with the "accessibility"
label. This label can be added by entering the following text in a separate
comment on the issue:

> @zulipbot add "accessibility"

If you want to help make Zulip more accessible, here is a list of the
[currently open accessibility issues][accessibility-issues].

## Additional resources

For more information about making Zulip accessible to as many users as
possible, the following resources may be useful.

- [Font Awesome accessibility guide](https://fontawesome.com/how-to-use/on-the-web/other-topics/accessibility),
  which is especially helpful since Zulip uses Font Awesome for its icons.
- [Web Content Accessibility Guidelines (WCAG) 2.0](https://www.w3.org/TR/WCAG/)
- [WAI-ARIA](https://www.w3.org/WAI/intro/aria) - Web Accessibility Initiative
  Accessible Rich Internet Application Suite
- [WebAIM](https://webaim.org/) - Web Accessibility in Mind
- The [MDN page on accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- The [Open edX Accessibility Guidelines][openedx-guidelines] for developers

[chrome-webstore]: https://chrome.google.com/webstore/detail/accessibility-developer-t/fpkknkljclfencbdbgkenhalefipecmb
[openedx-guidelines]: https://docs.openedx.org/en/latest/developers/concepts/accessibility.html
[accessibility-issues]: https://github.com/zulip/zulip/issues?q=is%3Aissue+is%3Aopen+label%3Aaccessibility
```

--------------------------------------------------------------------------------

---[FILE: analytics.md]---
Location: zulip-main/docs/subsystems/analytics.md

```text
# Analytics

Zulip has a cool analytics system for tracking various useful statistics
that currently power the `/stats` page, and over time will power other
features, like showing usage statistics for the various channels. It is
designed around the following goals:

- Minimal impact on scalability and service complexity.
- Well-tested so that we can count on the results being correct.
- Efficient to query so that we can display data in-app (e.g., on the channels
  page) with minimum impact on the overall performance of those pages.
- Storage size smaller than the size of the main Message/UserMessage
  database tables, so that we can store the data in the main PostgreSQL
  database rather than using a specialized database platform.

There are a few important things you need to understand in order to
effectively modify the system.

## Analytics backend overview

There are three main components:

- models: The `UserCount`, `StreamCount`, `RealmCount`, and `InstallationCount`
  tables (`analytics/models.py`) collect and store time series data.
- stat definitions: The `CountStat` objects in the `COUNT_STATS` dictionary
  (`analytics/lib/counts.py`) define the set of stats Zulip collects.
- accounting: The `FillState` table (`analytics/models.py`) keeps track of what
  has been collected for which `CountStat`.

The next several sections will dive into the details of these components.

## The `*Count` database tables

The Zulip analytics system is built around collecting time series data in a
set of database tables. Each of these tables has the following fields:

- property: A human readable string uniquely identifying a `CountStat`
  object. Example: `"active_users_audit:is_bot:hour"` or
  `"messages_sent:client:day"`.
- subgroup: Almost all `CountStat` objects are further sliced by subgroup. For
  `"active_users_audit:is_bot:day"`, this column will be `False` for measurements of
  humans, and `True` for measurements of bots. For `"messages_sent:client:day"`,
  this column is the client_id of the client under consideration.
- end_time: A datetime indicating the end of a time interval. It will be on
  an hour (or UTC day) boundary for stats collected at hourly (or daily)
  frequency. The time interval is determined by the `CountStat`.
- various "id" fields: Foreign keys into `Realm`, `UserProfile`, `Stream`, or
  nothing. E.g., the `RealmCount` table has a foreign key into `Realm`.
- value: The integer counts. For `"active_users_audit:is_bot:hour"` in the
  `RealmCount` table, this is the number of active humans or bots (depending
  on subgroup) in a particular realm at a particular `end_time`. For
  `"messages_sent:client:day"` in the `UserCount` table, this is the number of
  messages sent by a particular user, from a particular client, on the day
  ending at `end_time`.

There are four tables: `UserCount`, `StreamCount`, `RealmCount`, and
`InstallationCount`. Every `CountStat` is initially collected into `UserCount`,
`StreamCount`, or `RealmCount`. Every stat in `UserCount` and `StreamCount` is
aggregated into `RealmCount`, and then all stats are aggregated from
`RealmCount` into `InstallationCount`. So for example,
`"messages_sent:client:day"` has rows in `UserCount` corresponding to
`(user, end_time, client)` triples. These are summed to rows in `RealmCount`
corresponding to triples of `(realm, end_time, client)`. And then these are
summed to rows in `InstallationCount` with totals for pairs of `(end_time, client)`.

Note: In most cases, we do not store rows with value 0. See
[Performance strategy](#performance-strategy) below.

## CountStats

`CountStat` objects declare what analytics data should be generated and stored. The
`CountStat` class definition and instances live in `analytics/lib/counts.py`.
These declarations specify at a high level which tables should be populated
by the system and with what data.

## The FillState table

The default Zulip production configuration runs a cron job once an hour that
updates the `*Count` tables for each of the `CountStat` objects in the `COUNT_STATS`
dictionary. The `FillState` table simply keeps track of the last `end_time` that
we successfully updated each stat. It also enables the analytics system to
recover from errors (by retrying) and to monitor that the cron job is
running and running to completion.

## Performance strategy

An important consideration with any analytics system is performance, since
it's easy to end up processing a huge amount of data inefficiently and
needing a system like Hadoop to manage it. For the built-in analytics in
Zulip, we've designed something lightweight and fast that can be available
on any Zulip server without any extra dependencies through the carefully
designed set of tables in PostgreSQL.

This requires some care to avoid making the analytics tables larger than the
rest of the Zulip database or adding a ton of computational load, but with
careful design, we can make the analytics system very low cost to operate.
Also, note that a Zulip application database has 2 huge tables: `Message` and
`UserMessage`, and everything else is small and thus not performance or
space-sensitive, so it's important to optimize how many expensive queries we
do against those 2 tables.

There are a few important principles that we use to make the system
efficient:

- Not repeating work to keep things up to date (via `FillState`)
- Storing data in the `*Count` tables to avoid our endpoints hitting the core
  `Message`/`UserMessage` tables is key, because some queries could take minutes
  to calculate. This allows any expensive operations to run offline, and
  then the endpoints to server data to users can be fast.
- Doing expensive operations inside the database, rather than fetching data
  to Python and then sending it back to the database (which can be far
  slower if there's a lot of data involved). The Django ORM currently
  doesn't support the `"insert into .. select"` type SQL query that's needed
  for this, which is why we use raw database queries (which we usually avoid
  in Zulip) rather than the ORM.
- Aggregating where possible to avoid unnecessary queries against the
  `Message` and `UserMessage` tables. E.g., rather than querying the `Message`
  table both to generate sent message counts for each realm and again for
  each user, we just query for each user, and then add up the numbers for
  the users to get the totals for the realm.
- Not storing rows when the value is 0. An hourly user stat would otherwise
  collect 24 \* 365 \* roughly .5MB per db row = 4GB of data per user per
  year, most of whose values are 0. A related note is to be cautious about
  adding queries that are typically non-0 instead of being typically 0.

## Backend testing

There are a few types of automated tests that are important for this sort of
system:

- Most important: Tests for the code path that actually populates data into
  the analytics tables. These are most important, because it can be very
  expensive to fix bugs in the logic that generates these tables (one
  basically needs to regenerate all of history for those tables), and these
  bugs are hard to discover. It's worth taking the time to think about
  interesting corner cases and add them to the test suite.
- Tests for the backend views code logic for extracting data from the
  database and serving it to clients.

For manual backend testing, it sometimes can be valuable to use
`./manage.py dbshell` to inspect the tables manually to check that
things look right; but usually anything you feel the need to check
manually, you should add some sort of assertion for to the backend
analytics tests, to make sure it stays that way as we refactor.

## LoggingCountStats

The system discussed above is designed primarily around the technical
problem of showing useful analytics about things where the raw data is
already stored in the database (e.g., `Message`, `UserMessage`). This is great
because we can always backfill that data to the beginning of time, but of
course sometimes one wants to do analytics on things that aren't worth
storing every data point for (e.g., activity data, request performance
statistics, etc.). There is currently a reference implementation of a
`LoggingCountStat` that shows how to handle such a situation.

## Analytics UI development and testing

### Setup and testing

The main testing approach for the `/stats` page UI is manual testing.
For most UI testing, you can visit `/stats/realm/analytics` while
logged in as Iago (this is the server administrator view of stats for
a given realm). The only piece that you can't test here is the "Me"
buttons, which won't have any data. For those, you can instead log in
as the `shylock@analytics.ds` in the `analytics` realm and visit
`/stats` there (which is only a bit more work). Note that the
`analytics` realm is a shell with no channels, so you'll only want to
use it for testing the graphs.

If you're adding a new stat/table, you'll want to edit
`analytics/management/commands/populate_analytics_db.py` and add code
to generate fake data of the form needed for your new stat/table;
you'll then run `./manage.py populate_analytics_db` before looking at
the updated graphs.

### Adding or editing /stats graphs

The relevant files are:

- `analytics/views/stats.py`: All chart data requests from the /stats page call
  get_chart_data in this file.
- `web/src/stats/stats.ts`: The JavaScript and Plotly code.
- `templates/analytics/stats.html`
- `web/styles/stats.css` and `web/styles/legacy_portico.css`: We are in the
  process of re-styling this page to use in-app CSS instead of the portico CSS,
  but there is currently still a lot of portico influence.
- `analytics/urls.py`: Has the URL routes; it's unlikely you will have to
  modify this, including for adding a new graph.

Most of the code is self-explanatory, and for adding say a new graph, the
answer to most questions is to copy what the other graphs do. It is easy
when writing this sort of code to have a lot of semi-repeated code blocks
(especially in `stats.ts`); it's good to do what you can to reduce this.

Tips and tricks:

- Use `$.get` to fetch data from the backend. You can grep through `stats.ts`
  to find examples of this.
- The Plotly documentation is at
  <https://plot.ly/javascript/> (check out the full reference, event
  reference, and function reference). The documentation pages seem to work
  better in Chrome than in Firefox, though this hasn't been extensively
  verified.
- Unless a graph has a ton of data, it is typically better to just redraw it
  when something changes (e.g., in the various aggregation click handlers)
  rather than to use retrace or relayout or do other complicated
  things. Performance on the `/stats` page is nice but not critical, and we've
  run into a lot of small bugs when trying to use Plotly's retrace/relayout.
- There is a way to access raw d3 functionality through Plotly, though it
  isn't documented well.
- `'paper'` as a Plotly option refers to the bounding box of the graph (or
  something related to that).
- You can't right click and inspect the elements of a Plotly graph (e.g., the
  bars in a bar graph) in your browser, since there is an interaction layer
  on top of it. But if you hunt around the document tree you should be able
  to find it.

### /activity page

- There's a somewhat less developed `/activity` page, for server
  administrators, showing data on all the realms on a server. To
  access it, you need to have the `is_staff` bit set on your
  `UserProfile` object. You can set it using `manage.py shell` and
  editing the `UserProfile` object directly. A great future project is
  to clean up that page's data sources, and make this a documented
  interface.
```

--------------------------------------------------------------------------------

````
