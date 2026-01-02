---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 809
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 809 of 1290)

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

---[FILE: postprocess_content.test.cjs]---
Location: zulip-main/web/tests/postprocess_content.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const thumbnail = mock_esm("../src/thumbnail");

const {postprocess_content} = zrequire("postprocess_content");
const {initialize_user_settings} = zrequire("user_settings");

const user_settings = {web_font_size_px: 16};
initialize_user_settings({user_settings});

run_test("emoji_only", () => {
    // Test emoji-only message
    assert.equal(
        postprocess_content(
            '<p><span aria-label="wave" class="emoji emoji-1f44b" role="img" title="wave">:wave:</span></p>',
        ),
        '<p class="emoji-only"><span aria-label="wave" class="emoji emoji-1f44b" role="img" title="wave">:wave:</span></p>',
    );
    // Test emoji with other text content
    assert.equal(
        postprocess_content(
            '<p><span aria-label="wave" class="emoji emoji-1f44b" role="img" title="wave">:wave:</span> hi</p>',
        ),
        '<p><span aria-label="wave" class="emoji emoji-1f44b" role="img" title="wave">:wave:</span> hi</p>',
    );
    // Test emoji with other node content
    assert.equal(
        postprocess_content(
            '<p><span aria-label="wave" class="emoji emoji-1f44b" role="img" title="wave">:wave:</span> <strong>hi</strong></p>',
        ),
        '<p><span aria-label="wave" class="emoji emoji-1f44b" role="img" title="wave">:wave:</span> <strong>hi</strong></p>',
    );
});

run_test("ordered_lists", () => {
    assert.equal(
        postprocess_content('<ol start="9"><li>Nine</li><li>Ten</li></ol>'),
        '<ol start="9" class="counter-length-2" style="counter-reset: count 8;"><li>Nine</li><li>Ten</li></ol>',
    );
});

// Care should be taken to present real-world cases here and
// throughout, rather than contrived examples that serve
// only to satisfy 100% test coverage.
run_test("postprocess_basic_links", () => {
    assert.equal(
        postprocess_content(
            '<a href="http://example.com">good</a> ' +
                '<a href="http://zulip.zulipdev.com/user_uploads/w/ha/tever/file.png">upload</a> ' +
                '<a href="http://localhost:NNNN">invalid</a> ' +
                '<a href="javascript:alert(1)">unsafe</a> ' +
                '<a href="/#fragment" target="_blank">fragment</a>' +
                "<a>missing href</a>",
        ),
        '<a href="http://example.com" target="_blank" rel="noopener noreferrer" title="http://example.com/">good</a> ' +
            '<a href="http://zulip.zulipdev.com/user_uploads/w/ha/tever/file.png" target="_blank" rel="noopener noreferrer" title="translated: Download file.png">upload</a> ' +
            "<a>invalid</a> " +
            "<a>unsafe</a> " +
            '<a href="/#fragment" title="http://zulip.zulipdev.com/#fragment">fragment</a>' +
            "<a>missing href</a>",
    );
});

run_test("postprocess_media_and_embeds", () => {
    assert.equal(
        postprocess_content(
            '<div class="message_inline_image message_inline_video">' +
                '<a href="http://zulip.zulipdev.com/user_uploads/w/ha/tever/inline.mp4">' +
                '<video src="http://zulip.zulipdev.com/user_uploads/w/ha/tever/inline.mp4"></video>' +
                "</a>" +
                "</div>" +
                '<div class="youtube-video message_inline_image">' +
                '<a class="" href="https://www.youtube.com/watch?v=tyKJueEk0XM">' +
                '<img src="https://i.ytimg.com/vi/tyKJueEk0XM/default.jpg">' +
                "</a>" +
                "</div>" +
                '<div class="message_embed">' +
                '<a class="message_embed_image" href="https://example.com/about" style="background-image: url(&quot;https://example.com/preview.jpeg&quot;)"></a>' +
                '<div class="data-container">' +
                '<div class="message_embed_title">' +
                '<a href="https://example.com/about">About us</a>' +
                "</div>" +
                '<div class="message_embed_description">All about us.</div>' +
                "</div>" +
                "</div>",
        ),
        '<div class="message-thumbnail-gallery">' +
            '<div class="message-media-preview-video message_inline_video">' +
            '<a href="http://zulip.zulipdev.com/user_uploads/w/ha/tever/inline.mp4" target="_blank" rel="noopener noreferrer" class="media-anchor-element">' +
            '<video src="http://zulip.zulipdev.com/user_uploads/w/ha/tever/inline.mp4" class="media-video-element media-image-element"></video>' +
            "</a>" +
            "</div>" +
            '<div class="youtube-video message-media-preview-image">' +
            '<a class="media-anchor-element" href="https://www.youtube.com/watch?v=tyKJueEk0XM" target="_blank" rel="noopener noreferrer">' +
            '<img src="https://i.ytimg.com/vi/tyKJueEk0XM/mqdefault.jpg" class="media-image-element" loading="lazy">' +
            "</a>" +
            "</div>" +
            "</div>" +
            '<div class="message_embed">' +
            '<a class="message_embed_image" href="https://example.com/about" style="background-image: url(&quot;https://example.com/preview.jpeg&quot;)" target="_blank" rel="noopener noreferrer" title="https://example.com/about"></a>' +
            '<div class="data-container">' +
            '<div class="message_embed_title">' +
            '<a href="https://example.com/about" class="message-embed-title-link" target="_blank" rel="noopener noreferrer" title="https://example.com/about">About us</a>' +
            "</div>" +
            '<div class="message_embed_description">All about us.</div>' +
            "</div>" +
            "</div>",
    );
});

run_test("inline_image_galleries", ({override}) => {
    const thumbnail_formats = [
        {
            name: "840x560.webp",
            max_width: 840,
            max_height: 560,
            format: "webp",
            animated: false,
        },
    ];
    override(thumbnail, "preferred_format", thumbnail_formats[0]);
    assert.equal(
        postprocess_content(
            "<p>Message text</p>" +
                '<div class="message_inline_image">' +
                '<a href="/user_uploads/path/to/image.png" title="image.png">' +
                '<img data-original-dimensions="1000x2000" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp">' +
                "</a>" +
                "</div>" +
                '<div class="message_inline_image">' +
                '<a href="/user_uploads/path/to/image.png" title="image.png">' +
                '<img data-original-dimensions="2000x1000" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp">' +
                "</a>" +
                "</div>" +
                "<p>Message text</p>" +
                '<div class="message_inline_image">' +
                '<a href="/user_uploads/path/to/image.png" title="image.png">' +
                '<img data-original-dimensions="1000x1000" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp">' +
                "</a>" +
                "</div>" +
                "<p>" +
                '<img alt="image" class="inline-image" data-original-content-type="image/png" data-original-dimensions="900x600" data-original-src="/user_uploads/path/to/image-wide.png" src="/user_uploads/thumbnail/path/to/image.png/900x600.webp">' +
                " or " +
                '<img alt="image" class="inline-image" data-original-content-type="image/png" data-original-dimensions="600x900" data-original-src="/user_uploads/path/to/image-tall.png" src="/user_uploads/thumbnail/path/to/image.png/600x900.webp">' +
                "</p>" +
                "<p>" +
                '<img alt="image" class="inline-image" data-original-content-type="image/png" data-original-dimensions="900x600" data-original-src="/user_uploads/path/to/image-wide.png" src="/user_uploads/thumbnail/path/to/image.png/900x600.webp">' +
                "<br>" +
                '<img alt="image" class="inline-image" data-original-content-type="image/png" data-original-dimensions="600x900" data-original-src="/user_uploads/path/to/image-tall.png" src="/user_uploads/thumbnail/path/to/image.png/600x900.webp">' +
                "</p>",
        ),
        "<p>Message text</p>" +
            '<div class="message-thumbnail-gallery">' +
            '<div class="message-media-preview-image">' +
            '<a href="/user_uploads/path/to/image.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image.png">' +
            '<img data-original-dimensions="1000x2000" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp" class="media-image-element portrait-thumbnail" loading="lazy" width="1000" height="2000" style="width: 5em;">' +
            "</a>" +
            "</div>" +
            '<div class="message-media-preview-image">' +
            '<a href="/user_uploads/path/to/image.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image.png">' +
            '<img data-original-dimensions="2000x1000" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp" class="media-image-element landscape-thumbnail" loading="lazy" width="2000" height="1000" style="width: 20em;">' +
            "</a>" +
            "</div>" +
            "</div>" +
            "<p>Message text</p>" +
            '<div class="message-thumbnail-gallery">' +
            '<div class="message-media-preview-image">' +
            '<a href="/user_uploads/path/to/image.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image.png">' +
            '<img data-original-dimensions="1000x1000" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp" class="media-image-element portrait-thumbnail" loading="lazy" width="1000" height="1000" style="width: 10em;">' +
            "</a>" +
            "</div>" +
            "</div>" +
            "<p>" +
            '<span class="message-media-inline-image">' +
            '<a href="/user_uploads/path/to/image-wide.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image">' +
            '<img alt="image" class="inline-image media-image-element landscape-thumbnail" data-original-content-type="image/png" data-original-dimensions="900x600" data-original-src="/user_uploads/path/to/image-wide.png" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp" loading="lazy" width="900" height="600" style="width: 15em;">' +
            "</a>" +
            "</span>" +
            " or " +
            '<span class="message-media-inline-image">' +
            '<a href="/user_uploads/path/to/image-tall.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image">' +
            '<img alt="image" class="inline-image media-image-element portrait-thumbnail" data-original-content-type="image/png" data-original-dimensions="600x900" data-original-src="/user_uploads/path/to/image-tall.png" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp" loading="lazy" width="600" height="900" style="width: 6.666666666666667em;">' +
            "</a>" +
            "</span>" +
            "</p>" +
            "<p>" +
            '<div class="message-thumbnail-gallery">' +
            '<span class="message-media-inline-image message-media-gallery-image">' +
            '<a href="/user_uploads/path/to/image-wide.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image">' +
            '<img alt="image" class="inline-image media-image-element landscape-thumbnail" data-original-content-type="image/png" data-original-dimensions="900x600" data-original-src="/user_uploads/path/to/image-wide.png" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp" loading="lazy" width="900" height="600" style="width: 15em;">' +
            "</a>" +
            "</span>" +
            '<span class="message-media-inline-image message-media-gallery-image">' +
            '<a href="/user_uploads/path/to/image-tall.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image">' +
            '<img alt="image" class="inline-image media-image-element portrait-thumbnail" data-original-content-type="image/png" data-original-dimensions="600x900" data-original-src="/user_uploads/path/to/image-tall.png" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp" loading="lazy" width="600" height="900" style="width: 6.666666666666667em;">' +
            "</a>" +
            "</span>" +
            "</div>" +
            "</p>",
    );
});

run_test("message_inline_animated_image_still", ({override}) => {
    const thumbnail_formats = [
        {
            name: "840x560-anim.webp",
            max_width: 840,
            max_height: 560,
            format: "webp",
            animated: true,
        },
        {
            name: "840x560.webp",
            max_width: 840,
            max_height: 560,
            format: "webp",
            animated: false,
        },
        {
            name: "300x200-anim.webp",
            max_width: 300,
            max_height: 200,
            format: "webp",
            animated: true,
        },
        {
            name: "300x200.webp",
            max_width: 300,
            max_height: 200,
            format: "webp",
            animated: false,
        },
        {
            name: "300x200.jpg",
            max_width: 300,
            max_height: 200,
            format: "jpg",
            animated: false,
        },
    ];
    // TODO: Initialize the real thumbnail.ts rather than mocking it.
    override(thumbnail, "preferred_format", thumbnail_formats[3]);
    override(thumbnail, "animated_format", thumbnail_formats[2]);

    // Test for landscape thumbnails
    assert.equal(
        postprocess_content(
            '<div class="message_inline_image">' +
                '<a href="/user_uploads/path/to/image.png" title="image.png">' +
                '<img data-original-dimensions="3264x2448" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp">' +
                "</a>" +
                "</div>",
        ),
        '<div class="message-thumbnail-gallery">' +
            '<div class="message-media-preview-image">' +
            '<a href="/user_uploads/path/to/image.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image.png">' +
            '<img data-original-dimensions="3264x2448" src="/user_uploads/thumbnail/path/to/image.png/300x200.webp" class="media-image-element landscape-thumbnail" loading="lazy" width="3264" height="2448" style="width: 13.333333333333334em;">' +
            "</a>" +
            "</div>" +
            "</div>",
    );

    // Test for portrait thumbnails
    assert.equal(
        postprocess_content(
            '<div class="message_inline_image">' +
                '<a href="/user_uploads/path/to/image.png" title="image.png">' +
                '<img data-original-dimensions="100x200" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp">' +
                "</a>" +
                "</div>",
        ),
        '<div class="message-thumbnail-gallery">' +
            '<div class="message-media-preview-image">' +
            '<a href="/user_uploads/path/to/image.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image.png">' +
            '<img data-original-dimensions="100x200" src="/user_uploads/thumbnail/path/to/image.png/300x200.webp" class="media-image-element portrait-thumbnail" loading="lazy" width="100" height="200" style="width: 5em;">' +
            "</a>" +
            "</div>" +
            "</div>",
    );

    // Test for dinky thumbnails
    assert.equal(
        postprocess_content(
            '<div class="message_inline_image">' +
                '<a href="/user_uploads/path/to/image.png" title="image.png">' +
                '<img data-original-dimensions="1x10" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp">' +
                "</a>" +
                "</div>",
        ),
        '<div class="message-thumbnail-gallery">' +
            '<div class="message-media-preview-image">' +
            '<a href="/user_uploads/path/to/image.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image.png">' +
            '<img data-original-dimensions="1x10" src="/user_uploads/thumbnail/path/to/image.png/300x200.webp" class="media-image-element dinky-thumbnail extreme-aspect-ratio portrait-thumbnail" loading="lazy" width="1" height="10" style="width: 1px;">' +
            "</a>" +
            "</div>" +
            "</div>",
    );

    // Now verify the behavior for animated images.
    override(user_settings, "web_animate_image_previews", "always");
    assert.equal(
        postprocess_content(
            '<div class="message_inline_image">' +
                '<a href="/user_uploads/path/to/image.png" title="image.png">' +
                '<img data-original-dimensions="3264x2448" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp" data-animated="true">' +
                "</a>" +
                "</div>" +
                "<p>" +
                '<img alt="image" class="inline-image" data-original-content-type="image/png" data-original-dimensions="900x600" data-original-src="/user_uploads/path/to/image-wide.png" src="/user_uploads/thumbnail/path/to/image.png/900x600.webp" data-animated="true">' +
                " or " +
                '<img alt="image" class="inline-image" data-original-content-type="image/png" data-original-dimensions="600x900" data-original-src="/user_uploads/path/to/image-tall.png" src="/user_uploads/thumbnail/path/to/image.png/600x900.webp" data-animated="true">' +
                "</p>",
        ),
        '<div class="message-thumbnail-gallery">' +
            '<div class="message-media-preview-image">' +
            '<a href="/user_uploads/path/to/image.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image.png">' +
            '<img data-original-dimensions="3264x2448" src="/user_uploads/thumbnail/path/to/image.png/300x200-anim.webp" data-animated="true" class="media-image-element landscape-thumbnail" loading="lazy" width="3264" height="2448" style="width: 13.333333333333334em;">' +
            "</a>" +
            "</div>" +
            "</div>" +
            "<p>" +
            '<span class="message-media-inline-image">' +
            '<a href="/user_uploads/path/to/image-wide.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image">' +
            '<img alt="image" class="inline-image media-image-element landscape-thumbnail" data-original-content-type="image/png" data-original-dimensions="900x600" data-original-src="/user_uploads/path/to/image-wide.png" src="/user_uploads/thumbnail/path/to/image.png/300x200-anim.webp" data-animated="true" loading="lazy" width="900" height="600" style="width: 15em;">' +
            "</a>" +
            "</span>" +
            " or " +
            '<span class="message-media-inline-image">' +
            '<a href="/user_uploads/path/to/image-tall.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image">' +
            '<img alt="image" class="inline-image media-image-element portrait-thumbnail" data-original-content-type="image/png" data-original-dimensions="600x900" data-original-src="/user_uploads/path/to/image-tall.png" src="/user_uploads/thumbnail/path/to/image.png/300x200-anim.webp" data-animated="true" loading="lazy" width="600" height="900" style="width: 6.666666666666667em;">' +
            "</a>" +
            "</span>" +
            "</p>",
    );

    // And verify the different behavior for other values of the animation setting.
    override(user_settings, "web_animate_image_previews", "on_hover");
    assert.equal(
        postprocess_content(
            '<div class="message_inline_image">' +
                '<a href="/user_uploads/path/to/image.png" title="image.png">' +
                '<img data-original-dimensions="3264x2448" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp" data-animated="true">' +
                "</a>" +
                "</div>" +
                "<p>" +
                '<img alt="image" class="inline-image" data-original-content-type="image/png" data-original-dimensions="900x600" data-original-src="/user_uploads/path/to/image-wide.png" src="/user_uploads/thumbnail/path/to/image.png/900x600.webp" data-animated="true">' +
                " or " +
                '<img alt="image" class="inline-image" data-original-content-type="image/png" data-original-dimensions="600x900" data-original-src="/user_uploads/path/to/image-tall.png" src="/user_uploads/thumbnail/path/to/image.png/600x900.webp" data-animated="true">' +
                "</p>",
        ),
        '<div class="message-thumbnail-gallery">' +
            '<div class="message-media-preview-image message_inline_animated_image_still">' +
            '<a href="/user_uploads/path/to/image.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image.png">' +
            '<img data-original-dimensions="3264x2448" src="/user_uploads/thumbnail/path/to/image.png/300x200.webp" data-animated="true" class="media-image-element landscape-thumbnail" loading="lazy" width="3264" height="2448" style="width: 13.333333333333334em;">' +
            "</a>" +
            "</div>" +
            "</div>" +
            "<p>" +
            '<span class="message-media-inline-image message_inline_animated_image_still">' +
            '<a href="/user_uploads/path/to/image-wide.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image">' +
            '<img alt="image" class="inline-image media-image-element landscape-thumbnail" data-original-content-type="image/png" data-original-dimensions="900x600" data-original-src="/user_uploads/path/to/image-wide.png" src="/user_uploads/thumbnail/path/to/image.png/300x200.webp" data-animated="true" loading="lazy" width="900" height="600" style="width: 15em;">' +
            "</a>" +
            "</span>" +
            " or " +
            '<span class="message-media-inline-image message_inline_animated_image_still">' +
            '<a href="/user_uploads/path/to/image-tall.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image">' +
            '<img alt="image" class="inline-image media-image-element portrait-thumbnail" data-original-content-type="image/png" data-original-dimensions="600x900" data-original-src="/user_uploads/path/to/image-tall.png" src="/user_uploads/thumbnail/path/to/image.png/300x200.webp" data-animated="true" loading="lazy" width="600" height="900" style="width: 6.666666666666667em;">' +
            "</a>" +
            "</span>" +
            "</p>",
    );

    override(user_settings, "web_animate_image_previews", "never");
    assert.equal(
        postprocess_content(
            '<div class="message_inline_image">' +
                '<a href="/user_uploads/path/to/image.png" title="image.png">' +
                '<img data-original-dimensions="3264x2448" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp" data-animated="true">' +
                "</a>" +
                "</div>" +
                "<p>" +
                '<img alt="image" class="inline-image" data-original-content-type="image/png" data-original-dimensions="900x600" data-original-src="/user_uploads/path/to/image-wide.png" src="/user_uploads/thumbnail/path/to/image.png/900x600.webp" data-animated="true">' +
                " or " +
                '<img alt="image" class="inline-image" data-original-content-type="image/png" data-original-dimensions="600x900" data-original-src="/user_uploads/path/to/image-tall.png" src="/user_uploads/thumbnail/path/to/image.png/600x900.webp" data-animated="true">' +
                "</p>",
        ),
        '<div class="message-thumbnail-gallery">' +
            '<div class="message-media-preview-image message_inline_animated_image_still">' +
            '<a href="/user_uploads/path/to/image.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image.png">' +
            '<img data-original-dimensions="3264x2448" src="/user_uploads/thumbnail/path/to/image.png/300x200.webp" data-animated="true" class="media-image-element landscape-thumbnail" loading="lazy" width="3264" height="2448" style="width: 13.333333333333334em;">' +
            "</a>" +
            "</div>" +
            "</div>" +
            "<p>" +
            '<span class="message-media-inline-image message_inline_animated_image_still">' +
            '<a href="/user_uploads/path/to/image-wide.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image">' +
            '<img alt="image" class="inline-image media-image-element landscape-thumbnail" data-original-content-type="image/png" data-original-dimensions="900x600" data-original-src="/user_uploads/path/to/image-wide.png" src="/user_uploads/thumbnail/path/to/image.png/300x200.webp" data-animated="true" loading="lazy" width="900" height="600" style="width: 15em;">' +
            "</a>" +
            "</span>" +
            " or " +
            '<span class="message-media-inline-image message_inline_animated_image_still">' +
            '<a href="/user_uploads/path/to/image-tall.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image">' +
            '<img alt="image" class="inline-image media-image-element portrait-thumbnail" data-original-content-type="image/png" data-original-dimensions="600x900" data-original-src="/user_uploads/path/to/image-tall.png" src="/user_uploads/thumbnail/path/to/image.png/300x200.webp" data-animated="true" loading="lazy" width="600" height="900" style="width: 6.666666666666667em;">' +
            "</a>" +
            "</span>" +
            "</p>",
    );

    // Broken/invalid source URLs in image previews should be
    // dropped. Inspired by a real message found in chat.zulip.org
    // history.
    assert.equal(
        postprocess_content(
            '<div class="message_inline_image">' +
                '<a href="https://zulip.%20[Click%20to%20join%20video%20call](https://meeting.example.com/abcd1234)%20example.com/user_uploads/2/ab/abcd1234/image.png" target="_blank" title="image.png">' +
                '<img src="https://zulip.%20[Click%20to%20join%20video%20call](https://meeting.example.com/abcd1234)%20example.com/user_uploads/2/ab/abcd1234/image.png">' +
                "</a>" +
                "</div>",
        ),
        "",
    );
});

run_test("inline_images", ({override}) => {
    const thumbnail_formats = [
        {
            name: "840x560.webp",
            max_width: 840,
            max_height: 560,
            format: "webp",
            animated: false,
        },
    ];

    override(thumbnail, "preferred_format", thumbnail_formats[0]);

    assert.equal(
        postprocess_content(
            '<img alt="image" class="inline-image" data-original-content-type="image/png" data-original-dimensions="128x128" data-original-src="/user_uploads/path/to/image.png" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp">',
        ),
        '<span class="message-media-inline-image">' +
            '<a href="/user_uploads/path/to/image.png" target="_blank" rel="noopener noreferrer" class="media-anchor-element" aria-label="image">' +
            '<img alt="image" class="inline-image media-image-element dinky-thumbnail portrait-thumbnail" data-original-content-type="image/png" data-original-dimensions="128x128" data-original-src="/user_uploads/path/to/image.png" src="/user_uploads/thumbnail/path/to/image.png/840x560.webp" loading="lazy" width="128" height="128" style="width: 128px;">' +
            "</a>" +
            "</span>",
    );

    // Broken/invalid source URLs in image previews should be
    // dropped. Inspired by a real message found in chat.zulip.org
    // history.
    assert.equal(
        postprocess_content(
            '<img class="inline-image" data-original-src="https://zulip.%20[Click%20to%20join%20video%20call](https://meeting.example.com/abcd1234)%20example.com/user_uploads/2/ab/abcd1234/image.png" src="https://zulip.%20[Click%20to%20join%20video%20call](https://meeting.example.com/abcd1234)%20example.com/user_uploads/2/ab/abcd1234/image.png">',
        ),
        "",
    );
});
```

--------------------------------------------------------------------------------

---[FILE: presence.test.cjs]---
Location: zulip-main/web/tests/presence.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

mock_esm("../src/settings_data", {
    user_can_access_all_other_users: () => true,
});

const people = zrequire("people");
const presence = zrequire("presence");
const {set_realm} = zrequire("state_data");
const {initialize_user_settings} = zrequire("user_settings");

const realm = make_realm();
set_realm(realm);
const user_settings = {};
initialize_user_settings({user_settings});

const OFFLINE_THRESHOLD_SECS = 200;

const me = {
    email: "me@zulip.com",
    user_id: 101,
    full_name: "Me Myself",
};

const alice = {
    email: "alice@zulip.com",
    user_id: 1,
    full_name: "Alice Smith",
};

const fred = {
    email: "fred@zulip.com",
    user_id: 2,
    full_name: "Fred Flintstone",
};

const sally = {
    email: "sally@example.com",
    user_id: 3,
    full_name: "Sally Jones",
};

const zoe = {
    email: "zoe@example.com",
    user_id: 6,
    full_name: "Zoe Yang",
};

const bot = {
    email: "bot@zulip.com",
    user_id: 7,
    full_name: "The Bot",
    is_bot: true,
};

const john = {
    email: "john@zulip.com",
    user_id: 8,
    full_name: "John Doe",
    // Second 77.
    date_joined: "1970-01-01 00:01:15 UTC",
};

const jane = {
    email: "jane@zulip.com",
    user_id: 9,
    full_name: "Jane Doe",
};

people.add_active_user(me);
people.add_active_user(alice);
people.add_active_user(fred);
people.add_active_user(sally);
people.add_active_user(zoe);
people.add_active_user(bot);
people.add_active_user(john);
people.add_active_user(jane);

const inaccessible_user_id = 9999;
const inaccessible_user = people.add_inaccessible_user(inaccessible_user_id);
inaccessible_user.is_inaccessible_user = true;

people.initialize_current_user(me.user_id);

function test(label, f) {
    run_test(label, (helpers) => {
        helpers.override(
            realm,
            "server_presence_offline_threshold_seconds",
            OFFLINE_THRESHOLD_SECS,
        );
        helpers.override(user_settings, "presence_enabled", true);
        presence.clear_internal_data();
        f(helpers);
    });
}

test("my user", () => {
    assert.equal(presence.get_status(me.user_id), "active");
});

test("status_from_raw", () => {
    const status_from_raw = presence.status_from_raw;

    const now = 5000;
    let raw;

    raw = {
        server_timestamp: now,
        active_timestamp: now - OFFLINE_THRESHOLD_SECS / 2,
    };

    assert.deepEqual(status_from_raw(raw, alice), {
        status: "active",
        last_active: raw.active_timestamp,
    });

    raw = {
        server_timestamp: now,
        active_timestamp: now - OFFLINE_THRESHOLD_SECS * 2,
    };

    assert.deepEqual(status_from_raw(raw, alice), {
        status: "offline",
        last_active: raw.active_timestamp,
    });

    raw = {
        server_timestamp: now,
        idle_timestamp: now - OFFLINE_THRESHOLD_SECS / 2,
    };

    assert.deepEqual(status_from_raw(raw, alice), {
        status: "idle",
        last_active: raw.idle_timestamp,
    });

    const user = people.get_by_user_id(alice.user_id);
    user.date_joined = new Date((now - OFFLINE_THRESHOLD_SECS * 200) * 1000);

    raw = {
        server_timestamp: now,
        active_timestamp: now - OFFLINE_THRESHOLD_SECS * 200,
        idle_timestamp: now - OFFLINE_THRESHOLD_SECS * 100,
    };
    assert.deepEqual(status_from_raw(raw, alice), {
        status: "offline",
        last_active: raw.active_timestamp,
    });
});

test("set_presence_info", () => {
    const now = 5000;
    const recent = now + 1 - OFFLINE_THRESHOLD_SECS;
    const a_while_ago = now - OFFLINE_THRESHOLD_SECS * 2;

    const unknown_user_id = 999;

    const presences = {
        [alice.user_id.toString()]: {active_timestamp: recent},
        [fred.user_id.toString()]: {active_timestamp: a_while_ago, idle_timestamp: now},
        [me.user_id.toString()]: {active_timestamp: now},
        [sally.user_id.toString()]: {active_timestamp: a_while_ago},
        [john.user_id.toString()]: {idle_timestamp: a_while_ago},
        [jane.user_id.toString()]: {idle_timestamp: now},
        // Unknown user ids can also be in the presence data.
        [unknown_user_id.toString()]: {idle_timestamp: now},
        [inaccessible_user_id.toString()]: {idle_timestamp: now},
    };

    presence.initialize({presences, server_timestamp: now});

    assert.deepEqual(presence.presence_info.get(alice.user_id), {
        status: "active",
        last_active: recent,
    });
    assert.equal(presence.get_status(alice.user_id), "active");
    assert.deepEqual(presence.last_active_date(alice.user_id), new Date(recent * 1000));

    assert.deepEqual(presence.presence_info.get(fred.user_id), {status: "idle", last_active: now});
    assert.equal(presence.get_status(fred.user_id), "idle");

    assert.deepEqual(presence.presence_info.get(me.user_id), {status: "active", last_active: now});
    assert.equal(presence.get_status(me.user_id), "active");

    assert.deepEqual(presence.presence_info.get(sally.user_id), {
        status: "offline",
        last_active: a_while_ago,
    });
    assert.equal(presence.get_status(sally.user_id), "offline");

    assert.deepEqual(presence.presence_info.get(zoe.user_id), {
        status: "offline",
        last_active: undefined,
    });
    assert.equal(presence.get_status(zoe.user_id), "offline");
    assert.equal(presence.last_active_date(zoe.user_id), undefined);

    assert.ok(!presence.presence_info.has(bot.user_id));
    assert.equal(presence.get_status(bot.user_id), "offline");

    assert.deepEqual(presence.presence_info.get(john.user_id), {
        status: "offline",
        // Fall back to date_joined, which we set to 75 seconds after the epoch above.
        last_active: 75,
    });
    assert.equal(presence.get_status(john.user_id), "offline");

    assert.deepEqual(presence.presence_info.get(jane.user_id), {status: "idle", last_active: now});
    assert.equal(presence.get_status(jane.user_id), "idle");

    assert.deepEqual(presence.presence_info.get(unknown_user_id), {
        status: "idle",
        last_active: now,
    });
    assert.equal(presence.get_status(unknown_user_id), "idle");

    assert.equal(presence.presence_info.get(inaccessible_user_id), undefined);
});

test("missing values", () => {
    /*
        When a user does not have a relevant active timestamp,
        the server just leaves off the `active_timestamp` field
        to save bandwidth, which looks like `undefined` to us
        if we try to dereference it.
    */
    const now = 2000000;
    const a_bit_ago = now - 5;
    const presences = {[zoe.user_id.toString()]: {idle_timestamp: a_bit_ago}};

    presence.set_info(presences, now);

    assert.deepEqual(presence.presence_info.get(zoe.user_id), {
        status: "idle",
        last_active: a_bit_ago,
    });

    presences[zoe.user_id.toString()] = {};

    presence.set_info(presences, now);

    assert.deepEqual(presence.presence_info.get(zoe.user_id), {
        status: "offline",
        // This shouldn't happen in reality, but covers not crashing
        // if we don't have a last_active_time.
        last_active: 0,
    });
});

test("big realms", ({override_rewire}) => {
    const now = 5000;
    const presences = {[sally.user_id.toString()]: {active_timestamp: now}};

    // Make it seem like realm has a lot of people, in
    // which case we will not provide default values for
    // users that aren't in our presences payload.
    override_rewire(people, "get_active_human_count", () => 1000);
    presence.set_info(presences, now);
    assert.ok(presence.presence_info.has(sally.user_id));
    assert.ok(!presence.presence_info.has(zoe.user_id));
});

test("last_active_date", () => {
    const unknown_id = 42;
    presence.presence_info.clear();
    presence.presence_info.set(alice.user_id, {last_active: 500});
    presence.presence_info.set(fred.user_id, {});

    assert.equal(presence.last_active_date(unknown_id), undefined);
    assert.equal(presence.last_active_date(fred.user_id), undefined);
    assert.deepEqual(presence.last_active_date(alice.user_id), new Date(500 * 1000));
});

test("update_info_from_event", () => {
    let info;

    info = {
        active_timestamp: 500,
        idle_timestamp: 500,
    };

    presence.presence_info.delete(alice.user_id);
    presence.update_info_from_event(alice.user_id, info, 500);

    assert.deepEqual(presence.presence_info.get(alice.user_id), {
        status: "active",
        last_active: 500,
    });

    info = {
        active_timestamp: 500,
        idle_timestamp: 500,
    };
    presence.update_info_from_event(alice.user_id, info, 510);

    assert.deepEqual(presence.presence_info.get(alice.user_id), {
        status: "active",
        last_active: 500,
    });

    info = {
        active_timestamp: 500,
        idle_timestamp: 1000,
    };
    presence.update_info_from_event(alice.user_id, info, 1000);

    assert.deepEqual(presence.presence_info.get(alice.user_id), {
        status: "idle",
        last_active: 1000,
    });
});
```

--------------------------------------------------------------------------------

````
