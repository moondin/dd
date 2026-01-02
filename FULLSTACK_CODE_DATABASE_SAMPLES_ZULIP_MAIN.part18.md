---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 18
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 18 of 1290)

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

---[FILE: interactive-bots-api.md]---
Location: zulip-main/api_docs/interactive-bots-api.md

```text
## Interactive bots API

This page documents functions available to the bot, and the structure of the
bot's config file.

With this API, you *can*

* intercept, view, and process messages sent by users on Zulip.
* send out new messages as replies to the processed messages.

With this API, you *cannot*

* modify an intercepted message (you have to send a new message).
* send messages on behalf of or impersonate other users.
* intercept direct messages (except for direct messages with the bot as an
explicit recipient).

## usage

*usage(self)*

is called to retrieve information about the bot.

### Arguments

* self - the instance the method is called on.

### Return values

* A string describing the bot's functionality

### Example implementation

```python
def usage(self):
    return '''
        This plugin will allow users to flag messages
        as being follow-up items.  Users should preface
        messages with "@followup".
        Before running this, make sure to create a channel
        called "followup" that your API user can send to.
        '''
```

## handle_message

*handle_message(self, message, bot_handler)*

handles user message.

### Arguments

* self - the instance the method is called on.

* message - a dictionary describing a Zulip message

* bot_handler - used to interact with the server, e.g., to send a message

### Return values

None.

### Example implementation

```python
  def handle_message(self, message, bot_handler):
     original_content = message['content']
     original_sender = message['sender_email']
     new_content = original_content.replace('@followup',
                                            'from %s:' % (original_sender,))

     bot_handler.send_message(dict(
         type='stream',
         to='followup',
         subject=message['sender_email'],
         content=new_content,
     ))
```
## bot_handler.send_message

*bot_handler.send_message(message)*

will send a message as the bot user.  Generally, this is less
convenient than *send_reply*, but it offers additional flexibility
about where the message is sent to.

### Arguments

* message - a dictionary describing the message to be sent by the bot

### Example implementation

```python
bot_handler.send_message(dict(
    type='stream', # can be 'stream' or 'private'
    to=channel_name, # either the channel name or user's email
    subject=subject, # message subject
    content=message, # content of the sent message
))
```

## bot_handler.send_reply

*bot_handler.send_reply(message, response)*

will reply to the triggering message to the same place the original
message was sent to, with the content of the reply being *response*.

### Arguments

* message - Dictionary containing information on message to respond to
 (provided by `handle_message`).
* response - Response message from the bot (string).

## bot_handler.update_message

*bot_handler.update_message(message)*

will edit the content of a previously sent message.

### Arguments

* message - dictionary defining what message to edit and the new content

### Example

From `zulip_bots/bots/incrementor/incrementor.py`:

```python
bot_handler.update_message(dict(
    message_id=self.message_id, # id of message to be updated
    content=str(self.number), # string with which to update message with
))
```

## bot_handler.storage

A common problem when writing an interactive bot is that you want to
be able to store a bit of persistent state for the bot (e.g., for an
RSVP bot, the RSVPs).  For a sufficiently complex bot, you want need
your own database, but for simpler bots, we offer a convenient way for
bot code to persistently store data.

The interface for doing this is `bot_handler.storage`.

The data is stored in the Zulip Server's database. Each bot user has
an independent storage quota available to it.

### Performance considerations

You can use `bot_handler.storage` in one of two ways:

- **Direct access**: You can use bot_handler.storage directly, which
will result in a round-trip to the server for each `get`, `put`, and
`contains` call.
- **Context manager**: Alternatively, you can use the `use_storage`
context manager to minimize the number of round-trips to the server. We
recommend writing bots with the context manager such that they
automatically fetch data at the start of `handle_message` and submit the
state to the server at the end.

### Context manager use_storage

`use_storage(storage: BotStorage, keys: List[str])`

The context manager fetches the data for the specified keys and stores
them in a `CachedStorage` object with a `bot_handler.storage.get` call for
each key, at the start. This object will not communicate with the server
until manually calling flush or getting some values that are not previously
fetched. After the context manager block is exited, it will automatically
flush any changes made to the `CachedStorage` object to the server.

#### Arguments
* storage - a BotStorage object, i.e., `bot_handler.storage`
* keys - a list of keys to fetch

#### Example

```python
with use_storage(bot_handler.storage, ["foo", "bar"]) as cache:
    print(cache.get("foo"))  # print the value of "foo"
    cache.put("foo", "new value")  # update the value of "foo"
# changes are automatically flushed to the server on exiting the block
```

### bot_handler.storage methods

When using the `use_storage` context manager, the `bot_handler.storage`
methods on the yielded object will only operate on a cached version of the
storage.

### bot_handler.storage.put

*bot_handler.storage.put(key, value)*

will store the value `value` in the entry `key`.

#### Arguments

* key - a UTF-8 string
* value - a UTF-8 string

#### Example

```python
bot_handler.storage.put("foo", "bar")  # set entry "foo" to "bar"
```

### bot_handler.storage.get

*bot_handler.storage.get(key)*

will retrieve the value for the entry `key`.

##### Arguments

* key - a UTF-8 string

#### Example

```python
bot_handler.storage.put("foo", "bar")
print(bot_handler.storage.get("foo"))  # print "bar"
```

### bot_handler.storage.contains

*bot_handler.storage.contains(key)*

will check if the entry `key` exists.

Note that this will only check the cache, so it would return `False` if no
previous call to `bot_handler.storage.get()` or `bot_handler.storage.put()`
was made for `key`, since the bot was restarted.

#### Arguments

* key - a UTF-8 string

#### Example

```python
bot_handler.storage.contains("foo")  # False
bot_handler.storage.put("foo", "bar")
bot_handler.storage.contains("foo")  # True
```

### bot_handler.storage marshaling

By default, `bot_handler.storage` accepts any object for keys and
values, as long as it is JSON-able. Internally, the object then gets
converted to an UTF-8 string. You can specify custom data marshaling
by setting the functions `bot_handler.storage.marshal` and
`bot_handler.storage.demarshal`. These functions parse your data on
every call to `put` and `get`, respectively.

### Flushing cached data to the server

When using the `use_storage` context manager, you can manually flush
changes made to the cache to the server, using the below methods.

### cache.flush

`cache.flush()`

will flush all changes to the cache to the server.

#### Example
```python
with use_storage(bot_handler.storage, ["foo", "bar"]) as cache:
    cache.put("foo", "foo_value")  # update the value of "foo"
    cache.put("bar", "bar_value")  # update the value of "bar"
    cache.flush()  # manually flush both the changes to the server
```

### cache.flush_one

`cache.flush_one(key)`

will flush the changes for the specified key to the server.

#### Arguments

- key - a UTF-8 string

#### Example
```python
with use_storage(bot_handler.storage, ["foo", "bar"]) as cache:
    cache.put("foo", "baz")  # update the value of "foo"
    cache.put("bar", "bar_value")  # update the value of "bar"
    cache.flush_one("foo")  # flush the changes to "foo" to the server
```

## Configuration file

```
 [api]
 key=<api-key>
 email=<email>
 site=<dev-url>
```

* key - the API key you created for the bot; this is how Zulip knows
  the request is from an authorized user.

* email - the email address of the bot, e.g., `some-bot@zulip.com`

* site - your development environment URL; if you are working on a
  development environment hosted on your computer, use
  `localhost:9991`

## Related articles

* [Writing bots](/api/writing-bots)
* [Writing tests for bots](/api/writing-tests-for-interactive-bots)
```

--------------------------------------------------------------------------------

---[FILE: message-formatting.md]---
Location: zulip-main/api_docs/message-formatting.md

```text
# Message formatting

Zulip supports an extended version of Markdown for messages, as well as
some HTML level special behavior. The Zulip help center article on [message
formatting](/help/format-your-message-using-markdown) is the primary
documentation for Zulip's markup features. This article is currently a
changelog for updates to these features.

The [render a message](/api/render-message) endpoint can be used to get
the current HTML version of any Markdown syntax for message content.

## Code blocks

**Changes**: As of Zulip 4.0 (feature level 33), [code blocks][help-code]
can have a `data-code-language` attribute attached to the outer HTML
`div` element, which records the programming language that was selected
for syntax highlighting. This field is used in the
[playgrounds][help-playgrounds] feature for code blocks.

## Global times

**Changes**: In Zulip 3.0 (feature level 8), added [global time
mentions][help-global-time] to supported Markdown message formatting
features.

## Links to channels, topics, and messages

Zulip's markup supports special readable Markdown syntax for [linking
to channels, topics, and
messages](/help/link-to-a-message-or-conversation). See also [Zulip
URLs](/api/zulip-urls)

Sample HTML formats are as follows:
``` html
<!-- Syntax: #**announce** -->
<a class="stream" data-stream-id="9"
  href="/#narrow/channel/9-announce">
 #announce
</a>

<!-- Syntax: #**announce>Zulip updates** -->
<a class="stream-topic" data-stream-id="9"
  href="/#narrow/channel/9-announce/topic/Zulip.20updates/with/214">
 #announce &gt; Zulip updates
</a>

<!-- Syntax: #**announce>Zulip updates**
     Generated only if topic had no messages or the link was rendered
     before Zulip 10.0 (feature level 347) -->
<a class="stream-topic" data-stream-id="9"
  href="/#narrow/channel/9-announce/topic/Zulip.20updates">
 #announce &gt; Zulip updates
</a>

<!-- Syntax: #**announce>Zulip updates@214** -->
<a class="message-link"
  href="/#narrow/channel/9-announce/topic/Zulip.20updates/near/214">
 #announce &gt; Zulip updates @ 💬
</a>
```

The `near` and `with` operators are documented in more detail in the
[search and URL documentation](/api/construct-narrow). When rendering
topic links with the `with` operator, the code doing the rendering may
pick the ID arbitrarily among messages accessible to the client and/or
acting user at the time of rendering. Currently, the server chooses
the message ID to use for `with` operators as the latest message ID in
the topic accessible to the user who wrote the message.

The older stream/topic link elements include a `data-stream-id`, which
historically was used in order to display the current channel name if
the channel had been renamed. That field is **deprecated**, because
displaying an updated value for the most common forms of this syntax
requires parsing the URL to get the topic to use anyway.

When a topic is an empty string, it is replaced with
`realm_empty_topic_display_name` found in the [`POST /register`](/api/register-queue)
response and wrapped with the `<em>` tag.

Sample HTML formats with `"realm_empty_topic_display_name": "general chat"`
are as follows:
```html
<!-- Syntax: #**announce>** -->
<a class="stream-topic" data-stream-id="9"
  href="/#narrow/channel/9-announce/topic/with/214">
 #announce &gt; <em>general chat</em>
</a>

<!-- Syntax: #**announce>**
     Generated only if topic had no messages or the link was rendered
     before Zulip 10.0 (feature level 347) -->
<a class="stream-topic" data-stream-id="9"
  href="/#narrow/channel/9-announce/topic/">
 #announce &gt; <em>general chat</em>
</a>

<!-- Syntax: #**announce>@214** -->
<a class="message-link"
  href="/#narrow/channel/9-announce/topic//near/214">
 #announce &gt; <em>general chat</em> @ 💬
</a>
```

**Changes**: In Zulip 11.0 (feature level 400), the server switched
its strategy for `with` URL construction to choose the latest
accessible message ID in a topic. Previously, it used the oldest.

Before Zulip 10.0 (feature level 347), the `with` field
was never used in topic link URLs generated by the server; the markup
currently used only for empty topics was used for all topic links.

Before Zulip 10.0 (feature level 346), empty string
was not a valid topic name in syntaxes for linking to topics and
messages.

In Zulip 10.0 (feature level 319), added Markdown syntax
for linking to a specific message in a conversation. Declared the
`data-stream-id` field to be deprecated as detailed above.

In Zulip 11.0 (feature level 383), clients can decide what
channel view a.stream channel link elements take you to -- i.e.,
the href for those is the default behavior of the link that also
encodes the channel alongside the data-stream-id field, but clients
can override that default based on `web_channel_default_view` setting.

## Emoji

Zulip's [emoji][help-emoji] support includes standard Unicode emoji, a
built-in Zulip custom emoji like `:zulip:` and [custom realm
emoji][help-custom-emoji]. To maximize legibility, emoji should be
displayed inline with text, at the maximum size that does not
interfere with line spacing.

**Large emoji**. Clients are recommended to display single-paragraph
messages that contain only emoji elements with a greatly increased
size. For example, Zulip the web app scales large emoji to be 2x the
size of other message emoji.

Unicode emoji, such as `:smiling_face:` (☺️ / `263a`), are represented
in the HTML by spans with the following format:

```html
<span aria-label="smiling face" class="emoji emoji-263a" role="img"
  title="smiling face">:smiling_face:</span>
```

Note that Unicode emoji in messages that were originally sent on Zulip
versions older than Zulip 1.9.2 will not have the `role` or
`aria-label` attributes. Thus, clients should not rely on those fields
existing.

The `server_emoji_data_url` key in the [`POST
/register`](/api/register-queue) response contains the server's
mapping between Unicode codepoints and emoji names.

Custom emoji are represented in the HTML by image tags that also use
the `.emoji` class. The `src` URL should be resolved with respect to
the Zulip server's hostname:

```html
<-- Configured realm-specific custom emoji -->
<img alt=":example_custom_emoji:" class="emoji" title="example_custom_emoji"
  src="/user_avatars/2/emoji/images/dbe43627.png">

<-- Built-in custom emoji like :zulip: -->
<img alt=":zulip:" class="emoji" title="zulip"
  src="/static/generated/emoji/images/emoji/unicode/zulip.png">
```

**Changes**: Large emoji are new in Zulip 12.0 (feature level 436).

## Images

When a Zulip message is sent linking to an uploaded image, Zulip will
generate an image preview element with the following format:

``` html
<div class="message_inline_image">
    <a href="/user_uploads/path/to/example.png" title="example.png">
        <img data-original-dimensions="1920x1080"
          data-original-content-type="image/png"
          src="/user_uploads/thumbnail/path/to/example.png/840x560.webp">
    </a>
</div>
```

Clients can recognize if an image was thumbnailed by its `src`
attribute starting with `/user_uploads/thumbnail/`.  The `href` will
always link to the originally-uploaded file.

**Changes**: See [Changes to image formatting](#changes-to-image-formatting).

### Image-loading placeholders

If the server has yet to generate thumbnails for the image by
the time the message is sent, the `img` element will temporarily
reference a loading indicator image and have the `image-loading-placeholder`
class, which clients can use to identify loading indicators and
replace them with a more native loading indicator element if
desired. For example:

``` html
<div class="message_inline_image">
    <a href="/user_uploads/path/to/example.png" title="example.png">
        <img class="image-loading-placeholder"
          data-original-dimensions="1920x1080"
          data-original-content-type="image/png"
          src="/path/to/spinner.png">
    </a>
</div>
```

Once the server has a working thumbnail, such messages will be updated
via an `update_message` event, with the `rendering_only: true` flag
(telling clients not to adjust message edit history), with appropriate
adjusted `rendered_content`. A client should process those events by
just using the updated rendering. If thumbnailing failed, the same
type of event will edit the message's rendered form to remove the
image preview element, so no special client-side logic should be
required to process such errors.

Note that in the uncommon situation that the thumbnailing system is
backlogged, an individual message containing multiple image previews
may be re-rendered multiple times as each image finishes thumbnailing
and triggers a message update.

Clients displaying message-edit history should rewrite image-loading
placeholder images in edit history to the generic deleted-file image
(`/static/images/errors/file-not-exist.png`).

### Transcoded images

Image elements whose formats are not widely supported by web browsers
(e.g., HEIC and TIFF) may contain a `data-transcoded-image` attribute,
which specifies a high-resolution thumbnail format that clients may
opt to present instead of the original image. If the
`data-transcoded-image` attribute is present, clients should use the
`data-original-content-type` attribute to decide whether to display the
original image or use the transcoded version.

Transcoded images are presented with this structure in image previews:

``` html
<div class="message_inline_image">
    <a href="/user_uploads/path/to/example.heic" title="example.heic">
        <img data-original-dimensions="1920x1080"
          data-original-content-type="image/heic"
          data-transcoded-image="1920x1080.webp"
          src="/user_uploads/thumbnail/path/to/example.heic/840x560.webp">
    </a>
</div>
```

### Recommended client processing of image previews

Clients are recommended to do the following when processing image
previews:

- Clients that would like to use the image's aspect ratio to lay out
  one or more images in the message feed may use the
  `data-original-dimensions` attribute, which is present even if the
  image is a placeholder spinner.  This attribute encodes the
  dimensions of the original image as `{width}x{height}`.  These
  dimensions are for the image as rendered, _after_ any EXIF rotation
  and mirroring has been applied.
- If the client would like to control the thumbnail resolution used,
  it can replace the final section of the URL (`840x560.webp` in the
  example above) with the `name` of its preferred format from the set
  of supported formats provided by the server in the
  `server_thumbnail_formats` portion of the `register`
  response. Clients should not make any assumptions about what format
  the server will use as the "default" thumbnail resolution, as it may
  change over time.
- Download button type elements should provide the original image
  (encoded via the `href` of the containing `a` tag).
- The content-type of the original image is provided on a
  `data-original-content-type` attribute, so clients can decide if
  they are capable of rendering the original image.
- For images whose formats which are not widely-accepted by browsers
  (e.g., HEIC and TIFF), the image may contain a
  `data-transcoded-image` attribute, which specifies a high-resolution
  thumbnail format which clients may use instead of the original
  image.
- Lightbox elements for viewing an image should be designed to
  immediately display any already-downloaded thumbnail while fetching
  the original-quality image or an appropriate higher-quality
  thumbnail from the server, to be transparently swapped in once it is
  available. Clients that would like to size the lightbox based on the
  size of the original image can use the `data-original-dimensions`
  attribute, as described above.
- Animated images will have a `data-animated` attribute on the `img`
  tag. As detailed in `server_thumbnail_formats`, both animated and
  still images are available for clients to use, depending on their
  preference. See, for example, the [web setting][help-previews]
  to control whether animated images are autoplayed in the message
  feed.
- Clients should not assume that the requested format is the format
  that they will receive; in rare cases where the client has an
  out-of-date list of `server_thumbnail_formats`, the server will
  provide an approximation of the client's requested format.  Because
  of this, clients should not assume that the pixel dimensions or file
  format match what they requested.
- No other processing of the URLs is recommended.

### Changes to image formatting

**In Zulip 10.0** (feature level 336), added
`data-original-content-type` attribute to convey the type of the
original image, and optional `data-transcoded-image` attribute for
images with formats which are not widely supported by browsers.

**In Zulip 9.2** (feature levels 278-279, and 287+), added
`data-original-dimensions` to the `image-loading-placeholder` spinner
images, containing the dimensions of the original image.

**In Zulip 9.0** (feature level 276), added `data-original-dimensions`
attribute to images that have been thumbnailed, containing the
dimensions of the full-size version of the image. Thumbnailing itself
was reintroduced at feature level 275.

Previously, with the exception of Zulip servers that used the beta
Thumbor-based implementation years ago, all image previews in Zulip
messages were not thumbnailed; the `a` tag and the `img` tag would both
point to the original image.

Clients that correctly implement the current API should handle
Thumbor-based older thumbnails correctly, as long as they do not
assume that `data-original-dimensions` is present. Clients should not
assume that messages sent prior to the introduction of thumbnailing
have been re-rendered to use the new format or have thumbnails
available.

## Video embeddings and previews

When a Zulip message is sent linking to an uploaded video, Zulip may
generate a video preview element with the following format.


``` html
<div class="message_inline_image message_inline_video">
  <a href="/user_uploads/path/to/video.mp4">
    <video preload="metadata" src="/user_uploads/path/to/video.mp4">
    </video>
  </a>
</div>
```

## Audio Players

When the Markdown media syntax is used with an uploaded file with an
audio `Content-Type`, Zulip will generate an HTML5 `<audio>` player
element. Supported MIME types are currently `audio/aac`, `audio/flac`,
`audio/mpeg`, and `audio/wav`.

For example, `[file.mp3](/user_uploads/path/to/file.mp3)` renders as:

``` html
<audio controls preload="metadata"
  src="/user_uploads/path/to/file.mp3" title="file.mp3">
</audio>
```

If the Zulip server has rewritten the URL of the audio file, it will
provide the URL in a `data-original-url` parameter. The Zulip server
does this for all non-uploaded file audio URLs.

``` html
<audio controls preload="metadata"
  data-original-url="https://example.com/path/to/original/file.mp3"
  src="https://zulipcdn.example.com/path/to/playable/file.mp3" title="file.mp3">
</audio>
```

Clients that cannot render an audio player are recommended to convert
audio elements into a link to the original URL.

The Zulip server does not validate whether uploaded files with an
audio `Content-Type` are actually playable.

**Changes**: New in Zulip 11.0 (feature level 405).

## Mentions and silent mentions

Zulip markup supports [mentioning](/help/mention-a-user-or-group)
users, user groups, and a few special "wildcard" mentions (the three
spellings of a channel wildcard mention: `@**all**`, `@**everyone**`,
`@**channel**` and the topic wildcard mention `@**topic**`).

Mentions result in a message being highlighted for the target user(s),
both in the UI and in notifications, and may also result in the target
user(s) following the conversation, [depending on their
settings](/help/follow-a-topic#follow-topics-where-you-are-mentioned).

Silent mentions of users or groups have none of those side effects,
but nonetheless uniquely identify the user or group
identified. (There's no such thing as a silent wildcard mention).

Permissions for mentioning users work as follows:

- Any user can mention any other user, though mentions by [muted
users](/help/mute-a-user) are automatically marked as read and thus do
not trigger notifications or otherwise get highlighted like unread
mentions.

- Wildcard mentions are permitted except where [organization-level
restrictions](/help/restrict-wildcard-mentions) apply.

- User groups can be mentioned if and only if the acting user is in
the `can_mention_group` group for that group. All user groups can be
silently mentioned by any user.

- System groups, when (silently) mentioned, should be displayed using
their description, not their `role:nobody` style API names; see the
main [system group
documentation](/api/group-setting-values#system-groups) for
details. System groups can only be silently mentioned right now,
because they happen to all use the empty `Nobody` group for
`can_mention_group`; clients should just use `can_mention_group` to
determine which groups to offer in typeahead in similar contexts.

- Requests to send or edit a message that are impermissible due to
including a mention where the acting user does not have permission to
mention the target will return an error. Mention syntax that does not
correspond to a real user or group is ignored.

Sample markup for `@**Example User**`:

``` html
<span class="user-mention" data-user-id="31">@Example User</span>
```

Sample markup for `@_**Example User**`:

``` html
<span class="user-mention silent" data-user-id="31">Example User</span>
```

Sample markup for `@**topic**`:

``` html
<span class="topic-mention">@topic</span>
```

Sample markup for `@**channel**`:

``` html
<span class="user-mention channel-wildcard-mention"
  data-user-id="*">@channel</span>
```

Sample markup for `@*support*`, assuming "support" is a valid group:
``` html
<span class="user-group-mention"
  data-user-group-id="17">@support</span>
```

Sample markup for `@_*support*`, assuming "support" is a valid group:
``` html
<span class="user-group-mention silent"
  data-user-group-id="17">support</span>
```

Sample markup for `@_*role:administrators*`:
``` html
<span class="user-group-mention silent"
  data-user-group-id="5">Administrators</span>
```

When processing mentions, clients should look up the user or group
referenced by ID, and update the textual name for the mention to the
current name for the user or group with that ID. Note that for system
groups, this requires special logic to look up the user-facing name
for that group; see [system
groups](/api/group-setting-values#system-groups) for details.

**Changes**: Prior to Zulip 10.0 (feature level 333), it was not
possible to silently mention [system
groups](/api/group-setting-values#system-groups).

In Zulip 9.0 (feature level 247), `channel` was added to the supported
[wildcard][help-mention-all] options used in the
[mentions][help-mentions] Markdown message formatting feature.

## Spoilers

**Changes**: In Zulip 3.0 (feature level 15), added
[spoilers][help-spoilers] to supported Markdown message formatting
features.

## Removed features

### Removed legacy Dropbox link preview markup

In Zulip 11.0 (feature level 395), the Zulip server stopped generating
legacy Dropbox link previews. Dropbox links are now previewed just
like standard Zulip image/link previews. However, some legacy Dropbox
previews may exist in existing messages.

Clients are recommended to prune these previews from message HTML;
since they always appear after the actual link, there is no loss of
information/functionality. They can be recognized via the classes
`message_inline_ref`, `message_inline_image_desc`, and
`message_inline_image_title`:

``` html
<div class="message_inline_ref">
    <a href="https://www.dropbox.com/sh/cm39k9e04z7fhim/AAAII5NK-9daee3FcF41anEua?dl=" title="Saves">
        <img src="/path/to/folder_dropbox.png">
    </a>
    <div><div class="message_inline_image_title">Saves</div>
        <desc class="message_inline_image_desc"></desc>
    </div>
</div>
```

### Removed legacy avatar markup

In Zulip 4.0 (feature level 24), the rarely used `!avatar()`
and `!gravatar()` markup syntax, which was never documented and had an
inconsistent syntax, were removed.

## Related articles

* [Markdown formatting](/help/format-your-message-using-markdown)
* [Send a message](/api/send-message)
* [Render a message](/api/render-message)

[help-code]: /help/code-blocks
[help-emoji]: /help/emoji-and-emoticons
[help-custom-emoji]: /help/custom-emoji
[help-playgrounds]: /help/code-blocks#code-playgrounds
[help-spoilers]: /help/spoilers
[help-global-time]: /help/global-times
[help-mentions]: /help/mention-a-user-or-group
[help-mention-all]: /help/mention-a-user-or-group#mention-everyone-on-a-channel
[help-previews]: /help/image-video-and-website-previews#configure-how-animated-images-are-played
```

--------------------------------------------------------------------------------

---[FILE: missing.md]---
Location: zulip-main/api_docs/missing.md

```text
No such article.
```

--------------------------------------------------------------------------------

---[FILE: mobile-notifications.md]---
Location: zulip-main/api_docs/mobile-notifications.md

```text
# Mobile notifications

Zulip Server 11.0+ supports end-to-end encryption (E2EE) for mobile
push notifications. Mobile push notifications sent by all Zulip
servers go through Zulip's mobile push notifications service, which
then delivers the notifications through the appropriate
platform-specific push notification service (Google's FCM or Apple's
APNs). E2EE push notifications ensure that mobile notification message
content and metadata is not visible to intermediaries.

Mobile clients that have [registered an E2EE push
device](/api/register-push-device) will receive mobile notifications
end-to-end encrypted by their Zulip server.

This page documents the format of the encrypted JSON-format payloads
that the client will receive through this protocol. The same encrypted
payload formats are used for both Firebase Cloud Messaging (FCM) and
Apple Push Notification service (APNs).

## Payload examples

### New channel message

Sample JSON data that gets encrypted:
```json
{
  "channel_id": 10,
  "channel_name": "Denmark",
  "content": "@test_user_group",
  "mentioned_user_group_id": 41,
  "mentioned_user_group_name": "test_user_group",
  "message_id": 45,
  "realm_name": "Zulip Dev",
  "realm_url": "http://zulip.testserver",
  "recipient_type": "channel",
  "sender_avatar_url": "https://secure.gravatar.com/avatar/818c212b9f8830dfef491b3f7da99a14?d=identicon&version=1",
  "sender_full_name": "aaron",
  "sender_id": 6,
  "time": 1754385395,
  "topic": "test",
  "type": "message",
  "user_id": 10
}
```

- The `mentioned_user_group_id` and `mentioned_user_group_name` fields
  are only present for messages that mention a group containing the
  current user, and triggered a mobile notification because of that
  group mention. For example, messages that mention both the user
  directly and a group containing the user, these fields will not be
  present in the payload, because the direct mention has precedence.

**Changes**: New in Zulip 11.0 (feature level 413).

### New direct message

Sample JSON data that gets encrypted:
```json
{
  "content": "test content",
  "message_id": 46,
  "realm_name": "Zulip Dev",
  "realm_url": "http://zulip.testserver",
  "recipient_type": "direct",
  "recipient_user_ids": [6,10,12,15],
  "sender_avatar_url": "https://secure.gravatar.com/avatar/818c212b9f8830dfef491b3f7da99a14?d=identicon&version=1",
  "sender_full_name": "aaron",
  "sender_id": 6,
  "time": 1754385290,
  "type": "message",
  "user_id": 10
}
```

- The `recipient_user_ids` field is a sorted array of all user IDs in
the direct message conversation, including both `user_id` and
`sender_id`.

**Changes**: In Zulip 12.0 (feature level 429), replaced the
`pm_users` field with `recipient_user_ids`. The old `pm_users` field
was only present for group DMs, and was a string containing a
comma-separated list of sorted user IDs.

New in Zulip 11.0 (feature level 413).

### Remove notifications

When a batch of messages that had previously been included in mobile
notifications are marked as read, are deleted, become inaccessible, or
otherwise should no longer be displayed to the user, a removal
notification is sent.

Sample JSON data that gets encrypted:
```json
{
  "message_ids": [
    31,
    32
  ],
  "realm_name": "Zulip Dev",
  "realm_url": "http://zulip.testserver",
  "type": "remove",
  "user_id": 10
}
```

[zulip-bouncer]: https://zulip.readthedocs.io/en/latest/production/mobile-push-notifications.html#mobile-push-notification-service

**Changes**: New in Zulip 11.0 (feature level 413).

### Test push notification

A user can trigger [sending an E2EE test push notification](/api/e2ee-test-notify)
to the user's selected mobile device or all of their mobile devices.

Sample JSON data that gets encrypted:
```json
{
  "realm_name": "Zulip Dev",
  "realm_url": "http://zulip.testserver",
  "time": 1754577820,
  "type": "test",
  "user_id": 10
}
```

**Changes**: New in Zulip 11.0 (feature level 420).

### Data sent to Zulip's push notifications service

Sample JSON data sent by a self-hosted server to the Zulip's push notifications service:
```json
{
  "realm_uuid": "e502dde1-74fc-44b3-9e3a-114c41ed3ea4",
  "push_requests": [
    {
      "device_id": 1,
      "http_headers": {
        "apns_priority": 10,
        "apns_push_type": "alert"
      },
      "payload": {
        "push_account_id": 10,
        "encrypted_data": "uOGQ9m8bdnLab/2Qq6WLdJnFUsU/NlX0955rF6GgpiZylQB/HSD+lrHct0KUXdCneu+fnGOuBMAGkYol+SLlbvdsnePn/f6wSvMDbm3iffcgiz2u8TywUlmQL/Q7Ruj5RSpLgEhpFitL/WjwQBtrA31vsqMHycmROju+tOhFlVjmzJmYy3o7ZQDi/YeB2Y+CnA5EuuXjckBYSjL4vi/YaEJXmeHvJ8Pk3T/WwXvo8CFZYlafiqSw0vC/2bkjPTFFAFVo/49nAUI+5Rpa90wJUVChsrkKTclOs4Ih1dNIDYr6+WoIKJTtIR9zgDg3YOkVHBZhlt7Se3i40WAs5JAb1PViMpAp2hbU36z1Qq0g90nmfRjXN9FRdAPaKlbFTT2PkEtS9wVBv9T14ufkhbOwaMLfx5iaHKw3XHoWo7Fe+0IF9ZJ77uhCZoA1kyFKDhl7AZ8K4DOvib8gsfkeAR4XXXnXVmLtAyjBhMrWYNsECo9j4UeE6M90z3xIVR8=",
        "aps": {
          "mutable-content": 1,
          "alert": {
            "title": "New notification"
          }
        }
      }
    },
    {
      "device_id": 2,
      "fcm_priority": "high",
      "payload": {
        "push_account_id": 20,
        "encrypted_data": "OzPhtLiyU1U+3ynqyTxkFt83N5GN7t3Uw8/OkCoFKFo/cu3GAzCMMbAAhPghflkrFK37SNOuxpPiL1TzPy5tQJqdSKpQrgu6cp0Y6VVA1aV/zsCDAcSABaWeaOeC5mVL+xFpmFeEbhzUaOLchbRn4kBO4m8gqDU/rAn0cKFY1F7tyCgC+fvvcczP05itDLpkwZMnrADGp3tSHFldr4iGO1pWJxFTXFFhg63UyH1FcMXKFzBPek7hLbpLsqu5OFEQv2TtDbAYdWZr1LXRqnkHTDmMd6NAdkOsVcnk31jHThFPDqaM5zDXb24hGHW79OpBnGAQWydfeChS4pC4yHWCO6ZRDqwvJX9IydS+V7S91KCl0QSToaXvgW7Q3zvHunzu7L/rw0dQQRgPM3qIOHr7gGtptkZpmKuT6icdDGgjRtgP/L0TfxdRKa37fn6nF64+HH60wLPYWOz7vZjgTrA20MrbA3ogMfhFYpwjppidFGVWjrLpk+peQjHB1sY="
      }
    }
  ]
}
```

**Changes**: New in Zulip 11.0 (feature level 413).

### Data sent to FCM

Zulip's push notifications service uses [Firebase Admin Python SDK](https://github.com/firebase/firebase-admin-python)
to access FCM.

A sample `messages` argument, which is internally used by the SDK to prepare payload for FCM,
passed to [`firebase_admin.messaging.send_each`](https://firebase.google.com/docs/reference/admin/python/firebase_admin.messaging#send_each):
```py
[
  firebase_admin.messaging.Message(
    data={
      'push_account_id': '20',
      'encrypted_data': 'OzPhtLiyU1U+3ynqyTxkFt83N5GN7t3Uw8/OkCoFKFo/cu3GAzCMMbAAhPghflkrFK37SNOuxpPiL1TzPy5tQJqdSKpQrgu6cp0Y6VVA1aV/zsCDAcSABaWeaOeC5mVL+xFpmFeEbhzUaOLchbRn4kBO4m8gqDU/rAn0cKFY1F7tyCgC+fvvcczP05itDLpkwZMnrADGp3tSHFldr4iGO1pWJxFTXFFhg63UyH1FcMXKFzBPek7hLbpLsqu5OFEQv2TtDbAYdWZr1LXRqnkHTDmMd6NAdkOsVcnk31jHThFPDqaM5zDXb24hGHW79OpBnGAQWydfeChS4pC4yHWCO6ZRDqwvJX9IydS+V7S91KCl0QSToaXvgW7Q3zvHunzu7L/rw0dQQRgPM3qIOHr7gGtptkZpmKuT6icdDGgjRtgP/L0TfxdRKa37fn6nF64+HH60wLPYWOz7vZjgTrA20MrbA3ogMfhFYpwjppidFGVWjrLpk+peQjHB1sY=',
    },
    token='push-device-token-3',
    android=firebase_admin.messaging.AndroidConfig(priority='high'),
  ),
]
```

**Changes**: New in Zulip 11.0 (feature level 413).

### Data sent to APNs

Zulip's push notifications service uses [aioapns](https://github.com/Fatal1ty/aioapns) to access APNs.

A sample `request` argument, which is internally used by the library to prepare payload for APNs,
passed to [`aioapns.APNs.send_notification`](https://github.com/Fatal1ty/aioapns/blob/96831003ec5a8986206cde77e59fdb4b5a3c4b24/aioapns/client.py):
```py
aioapns.NotificationRequest(
  apns_topic='remote_push_device_ios_app_id',
  device_token='push-device-token-1',
  message={
    'push_account_id': 10,
    'encrypted_data': 'rUNqoWOB+EQmjThJyXhDptmUrHyzSx4DPlvShzrM7XGdRVMG5qNuH0dnGQDVza9frnWNVOF3vFcuYvDnUnYRBf1j+/n1ML1K2CBnsThCGl3KJNWrKcf5fME7Q1dU2xtJ3+RAKuLtZ9y2gq6DWamui7WfQ75m1eJpYRDbbHIQEiSIZpo7X2Lie3aHkQBgE8SN5MJ6N3VM33DM6i1xGpIeWiFy+hqNloGyEI2qf6xV0SjvvkN+HbGticben4atBkAuAIKi0gIYMPyMihH26T1sEhOH3IDyO3KvaHe1NIdj0naT9RoFkN5UgdxIchXQ7qkVEjivA2E/HefpvZYlhems6TAosfJwgCMB8HuydqdImjixkugRQfugroTTG97p6xQIJSFWCOyrpuBDElI0Ale8XjmzaVo4Dbgqz5kIAhmJWtlwgJw8nt7Orr3EWUVjnIAi0nHCFObAXNShedAbyuLeC1qezqC4FZe/GOLLi4DPWgWSdk8PV5vGw9YC+XcZ38dqQogtpG7dpzMwwsqzLBmlzQ==',
    'aps': {
      'mutable-content': 1,
      'alert': {'title': 'New notification'}
    }
  },
  priority=10,
  push_type="alert",
)
```

**Changes**: New in Zulip 11.0 (feature level 413).
```

--------------------------------------------------------------------------------

````
