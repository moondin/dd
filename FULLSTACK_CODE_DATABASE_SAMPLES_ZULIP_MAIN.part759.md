---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 759
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 759 of 1290)

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

---[FILE: left_sidebar.hbs]---
Location: zulip-main/web/templates/left_sidebar.hbs

```text
<div class="left-sidebar" id="left-sidebar" role="navigation">
    <div id="left-sidebar-search" class="zoom-in-hide">
        <div class="input-wrapper-for-tooltip tippy-zulip-delayed-tooltip" data-tooltip-template-id="filter-left-sidebar-tooltip-template">
            {{#> input_wrapper input_type="filter-input" custom_classes="left-sidebar-search-section" icon="search" input_button_icon="close"}}
                <input type="text" class="input-element left-sidebar-search-input home-page-input" autocomplete="off" placeholder="{{t 'Filter left sidebar' }}" />
            {{/input_wrapper}}
        </div>
        <span id="add_streams_tooltip" class="add-stream-icon-container hidden-for-spectators">
            <i id="streams_inline_icon" class="add_stream_icon zulip-icon zulip-icon-square-plus" aria-hidden="true" ></i>
        </span>
        <span class="sidebar-menu-icon channel-folders-sidebar-menu-icon hidden-for-spectators"><i class="zulip-icon zulip-icon-more-vertical" aria-label="{{t 'Show channel folders'}}"></i></span>
    </div>
    <ul id="left-sidebar-empty-list-message" class="hidden">
        {{> empty_list_widget_for_list
          empty_list_message=(t "No matches.")
          }}
    </ul>
    <div id="left-sidebar-navigation-area" class="left-sidebar-navigation-area">
        <div id="views-label-container" class="showing-expanded-navigation{{#if is_spectator}} remove-pointer-for-spectator{{/if}}">
            <i id="toggle-top-left-navigation-area-icon" class="zulip-icon zulip-icon-heading-triangle-right sidebar-heading-icon rotate-icon-down views-tooltip-target hidden-for-spectators" aria-hidden="true" tabindex="0" role="button"></i>
            {{~!-- squash whitespace --~}}
            <h4 class="left-sidebar-title"><span class="views-tooltip-target">{{ LEFT_SIDEBAR_NAVIGATION_AREA_TITLE }}</span></h4>
            <ul id="left-sidebar-navigation-list-condensed" class="filters">
                {{#each primary_condensed_views}}
                    {{> left_sidebar_primary_condensed_view_item . }}
                {{/each}}
                <li class="top_left_condensed_unread_marker left-sidebar-navigation-condensed-item">
                    <span class="unread_count normal-count"></span>
                </li>
            </ul>
            <div class="left-sidebar-navigation-menu-icon">
                <i class="zulip-icon zulip-icon-more-vertical" aria-label="{{t 'Other views'}}"></i>
            </div>
        </div>
        <ul id="left-sidebar-navigation-list" class="left-sidebar-navigation-list filters">
            {{> left_sidebar_expanded_view_items_list expanded_views=expanded_views}}
        </ul>
    </div>

    <a id="hide-more-direct-messages" class="trigger-click-on-enter" tabindex="0">
        <span class="hide-more-direct-messages-text"> {{t 'back to channels' }}</span>
    </a>
    <div id="direct-messages-section-header" class="direct-messages-container hidden-for-spectators zoom-out zoom-in-sticky">
        <i id="toggle-direct-messages-section-icon" class="zulip-icon zulip-icon-heading-triangle-right sidebar-heading-icon rotate-icon-down dm-tooltip-target zoom-in-hide" aria-hidden="true" tabindex="0" role="button"></i>
        <h4 class="left-sidebar-title"><span class="dm-tooltip-target">{{ LEFT_SIDEBAR_DIRECT_MESSAGES_TITLE }}</span></h4>
        <div class="left-sidebar-controls">
            <a id="show-all-direct-messages" class="tippy-left-sidebar-tooltip-no-label-delay" href="#narrow/is/dm" data-tooltip-template-id="show-all-direct-messages-template">
                <i class="zulip-icon zulip-icon-all-messages" aria-label="{{t 'Direct message feed' }}"></i>
            </a>
            <span id="compose-new-direct-message" class="tippy-left-sidebar-tooltip-no-label-delay auto-hide-left-sidebar-overlay" data-tooltip-template-id="new_direct_message_button_tooltip_template">
                <i class="left-sidebar-new-direct-message-icon zulip-icon zulip-icon-square-plus" aria-label="{{t 'New direct message' }}"></i>
            </span>
        </div>
        <div class="heading-markers-and-unreads">
            <span class="unread_count"></span>
        </div>
        <div class="zoom-out-hide direct-messages-search-section left-sidebar-filter-input-container">
            {{#> input_wrapper input_type="filter-input" icon="search" input_button_icon="close"}}
                <input type="text" class="input-element direct-messages-list-filter home-page-input" autocomplete="off" placeholder="{{t 'Filter direct messages' }}" />
            {{/input_wrapper}}
        </div>
    </div>
    {{~!-- squash whitespace --~}}
    <div id="left_sidebar_scroll_container" class="scrolling_list" data-simplebar data-simplebar-tab-index="-1">
        <div class="direct-messages-container zoom-out hidden-for-spectators">
            <div id="direct-messages-list"></div>
        </div>

        <div id="streams_list" class="zoom-out">
            <div id="topics_header">
                <a class="show-all-streams trigger-click-on-enter" tabindex="0">{{t 'Back to channels' }}</a> <span class="unread_count quiet-count"></span>
            </div>
            <div id="stream-filters-container">
                <ul id="stream_filters" class="filters"></ul>
                {{#unless is_guest }}
                    <div id="subscribe-to-more-streams"></div>
                {{/unless}}
                <div id="login-to-more-streams" class="only-visible-for-spectators login_button">
                    <a class="subscribe-more-link" tabindex="0">
                        <i class="subscribe-more-icon zulip-icon zulip-icon-log-in" aria-hidden="true" ></i>
                        <span class="subscribe-more-label">{{~t "LOG IN TO BROWSE MORE" ~}}</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_expanded_view_item.hbs]---
Location: zulip-main/web/templates/left_sidebar_expanded_view_item.hbs

```text
<li class="top_left_{{css_class_suffix}} top_left_row {{#if hidden_for_spectators}}hidden-for-spectators{{/if}} {{#if is_home_view}}selected-home-view{{/if}}">
    <a href="#{{fragment}}" class="left-sidebar-navigation-label-container tippy-left-sidebar-tooltip" data-tooltip-template-id="{{tooltip_template_id}}">
        <span class="filter-icon">
            <i class="zulip-icon {{icon}}" aria-hidden="true"></i>
        </span>
        {{~!-- squash whitespace --~}}
        <span class="left-sidebar-navigation-label">{{name}}</span>
        <span class="unread_count {{unread_count_type}}{{#unless unread_count}} hide{{/unless}}">
            {{#if unread_count}}
                {{unread_count}}
            {{/if}}
        </span>
        {{#if supports_masked_unread}}
        <span class="masked_unread_count">
            <i class="zulip-icon zulip-icon-masked-unread"></i>
        </span>
        {{/if}}
    </a>
    {{#if menu_icon_class}}
        <span class="arrow sidebar-menu-icon {{menu_icon_class}} hidden-for-spectators"><i class="zulip-icon zulip-icon-more-vertical" aria-label="{{menu_aria_label}}"></i></span>
    {{/if}}
</li>
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_expanded_view_items_list.hbs]---
Location: zulip-main/web/templates/left_sidebar_expanded_view_items_list.hbs

```text
{{#each expanded_views}}
    {{> left_sidebar_expanded_view_item . }}
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_primary_condensed_view_item.hbs]---
Location: zulip-main/web/templates/left_sidebar_primary_condensed_view_item.hbs

```text
<li class="top_left_{{css_class_suffix}} left-sidebar-navigation-condensed-item{{#if is_home_view}} selected-home-view{{/if}}">
    <a href="#{{fragment}}" class="tippy-left-sidebar-tooltip left-sidebar-navigation-icon-container" data-tooltip-template-id="{{tooltip_template_id}}">
        <span class="filter-icon">
            <i class="zulip-icon {{icon}}" aria-hidden="true"></i>
        </span>
        <span class="unread_count {{unread_count_type}}"></span>
    </a>
</li>
```

--------------------------------------------------------------------------------

---[FILE: lightbox_overlay.hbs]---
Location: zulip-main/web/templates/lightbox_overlay.hbs

```text
<div id="lightbox_overlay" class="overlay" data-overlay="lightbox" data-noclose="false">
    <div class="media-info-wrapper">
        <div class="media-description">
            <div class="title"></div>
            <div class="user"></div>
        </div>
        <div class="media-actions">
            <a class="lightbox-media-action lightbox-zoom-reset disabled">{{t "Reset zoom" }}</a>
            <a class="lightbox-media-action open" rel="noopener noreferrer" target="_blank">{{t "Open" }}</a>
            <a class="lightbox-media-action download" download>{{t "Download" }}</a>
        </div>
        <div class="exit" aria-label="{{t 'Close' }}">
            <span aria-hidden="true" class="zulip-icon zulip-icon-close"></span>
        </div>
    </div>

    <div class="image-preview no-select">
        <div class="zoom-element no-select"></div>
    </div>
    <div class="video-player"></div>
    <div class="player-container"></div>
    <div class="center">
        <div class="arrow no-select" data-direction="prev"><i class="zulip-icon zulip-icon-chevron-left"></i></div>
        <div class="image-list"></div>
        <div class="arrow no-select" data-direction="next"><i class="zulip-icon zulip-icon-chevron-right"></i></div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: loader.hbs]---
Location: zulip-main/web/templates/loader.hbs

```text
<svg width='100%' height='100%' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-ring">
    <rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect>
    <defs>
        <filter id="uil-ring-shadow-{{ container_id }}" x="-100%" y="-100%" width="300%" height="300%">
            <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0"></feOffset>
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="0"></feGaussianBlur>
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>
        </filter>
    </defs>
    <path d="M10,50c0,0,0,0.5,0.1,1.4c0,0.5,0.1,1,0.2,1.7c0,0.3,0.1,0.7,0.1,1.1c0.1,0.4,0.1,0.8,0.2,1.2c0.2,0.8,0.3,1.8,0.5,2.8 c0.3,1,0.6,2.1,0.9,3.2c0.3,1.1,0.9,2.3,1.4,3.5c0.5,1.2,1.2,2.4,1.8,3.7c0.3,0.6,0.8,1.2,1.2,1.9c0.4,0.6,0.8,1.3,1.3,1.9 c1,1.2,1.9,2.6,3.1,3.7c2.2,2.5,5,4.7,7.9,6.7c3,2,6.5,3.4,10.1,4.6c3.6,1.1,7.5,1.5,11.2,1.6c4-0.1,7.7-0.6,11.3-1.6 c3.6-1.2,7-2.6,10-4.6c3-2,5.8-4.2,7.9-6.7c1.2-1.2,2.1-2.5,3.1-3.7c0.5-0.6,0.9-1.3,1.3-1.9c0.4-0.6,0.8-1.3,1.2-1.9 c0.6-1.3,1.3-2.5,1.8-3.7c0.5-1.2,1-2.4,1.4-3.5c0.3-1.1,0.6-2.2,0.9-3.2c0.2-1,0.4-1.9,0.5-2.8c0.1-0.4,0.1-0.8,0.2-1.2 c0-0.4,0.1-0.7,0.1-1.1c0.1-0.7,0.1-1.2,0.2-1.7C90,50.5,90,50,90,50s0,0.5,0,1.4c0,0.5,0,1,0,1.7c0,0.3,0,0.7,0,1.1 c0,0.4-0.1,0.8-0.1,1.2c-0.1,0.9-0.2,1.8-0.4,2.8c-0.2,1-0.5,2.1-0.7,3.3c-0.3,1.2-0.8,2.4-1.2,3.7c-0.2,0.7-0.5,1.3-0.8,1.9 c-0.3,0.7-0.6,1.3-0.9,2c-0.3,0.7-0.7,1.3-1.1,2c-0.4,0.7-0.7,1.4-1.2,2c-1,1.3-1.9,2.7-3.1,4c-2.2,2.7-5,5-8.1,7.1 c-0.8,0.5-1.6,1-2.4,1.5c-0.8,0.5-1.7,0.9-2.6,1.3L66,87.7l-1.4,0.5c-0.9,0.3-1.8,0.7-2.8,1c-3.8,1.1-7.9,1.7-11.8,1.8L47,90.8 c-1,0-2-0.2-3-0.3l-1.5-0.2l-0.7-0.1L41.1,90c-1-0.3-1.9-0.5-2.9-0.7c-0.9-0.3-1.9-0.7-2.8-1L34,87.7l-1.3-0.6 c-0.9-0.4-1.8-0.8-2.6-1.3c-0.8-0.5-1.6-1-2.4-1.5c-3.1-2.1-5.9-4.5-8.1-7.1c-1.2-1.2-2.1-2.7-3.1-4c-0.5-0.6-0.8-1.4-1.2-2 c-0.4-0.7-0.8-1.3-1.1-2c-0.3-0.7-0.6-1.3-0.9-2c-0.3-0.7-0.6-1.3-0.8-1.9c-0.4-1.3-0.9-2.5-1.2-3.7c-0.3-1.2-0.5-2.3-0.7-3.3 c-0.2-1-0.3-2-0.4-2.8c-0.1-0.4-0.1-0.8-0.1-1.2c0-0.4,0-0.7,0-1.1c0-0.7,0-1.2,0-1.7C10,50.5,10,50,10,50z" fill="#444" filter="url(#uil-ring-shadow-{{ container_id }})">
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" repeatCount="indefinite" dur="1s"></animateTransform>
    </path>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: login_to_access.hbs]---
Location: zulip-main/web/templates/login_to_access.hbs

```text
<div class="micromodal" id="login_to_access_modal" aria-hidden="true">
    <div class="modal__overlay" tabindex="-1">
        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="login_to_access_modal_label">
            <header class="modal__header">
                <h1 class="modal__title" id="login_to_access_modal_label">
                    {{t "Join {realm_name}" }}
                </h1>
                <button class="modal__close" aria-label="{{t 'Close modal' }}" data-micromodal-close></button>
            </header>
            <main class="modal__content">
                {{#if empty_narrow}}
                <p>
                    {{#tr}}
                        This is not a <z-link>publicly accessible</z-link> conversation.
                        {{#*inline "z-link"}}<a target="_blank" rel="noopener noreferrer" href="/help/public-access-option">{{> @partial-block}}</a>{{/inline}}
                    {{/tr}}
                </p>
                {{/if}}
                <p>
                    {{t "You can fully access this community and participate in conversations
                      by creating a Zulip account in this organization." }}
                </p>
            </main>
            <footer class="modal__footer">
                <a class="modal__button dialog_submit_button" href="{{signup_link}}">
                    <span>{{t "Sign up" }}</span>
                </a>
                <a class="modal__button dialog_submit_button" href="{{login_link}}">
                    <span>{{t "Log in" }}</span>
                </a>
            </footer>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: login_to_view_image_button.hbs]---
Location: zulip-main/web/templates/login_to_view_image_button.hbs

```text
<div class="spectator_login_for_image_button">
    <a class="login_button color_animated_button" href="/login/">
        <i class='zulip-icon zulip-icon-log-in'></i>
        <span class="color-animated-button-text">{{t "Log in to view image" }}</span>
    </a>
</div>
```

--------------------------------------------------------------------------------

---[FILE: markdown_audio.hbs]---
Location: zulip-main/web/templates/markdown_audio.hbs

```text
{{~!-- --~}}
<span class="media-audio-wrapper">
    <audio controls="" preload="metadata" src="{{audio_src}}" title="{{audio_title}}" class="media-audio-element"></audio>
    <a class="media-audio-download icon-button icon-button-square icon-button-neutral"
      aria-label="{{t 'Download' }}" href="{{ audio_src}}" download>
        <i class="media-download-icon zulip-icon zulip-icon-download"></i>
    </a>
</span>
{{~!-- --~}}
```

--------------------------------------------------------------------------------

---[FILE: markdown_help.hbs]---
Location: zulip-main/web/templates/markdown_help.hbs

```text
<div class="overlay-modal hide" id="message-formatting" tabindex="-1" role="dialog"
  aria-label="{{t 'Message formatting' }}">
    <div class="overlay-scroll-container" data-simplebar data-simplebar-tab-index="-1" data-simplebar-auto-hide="false">
        <div id="markdown-instructions">
            <table class="table table-striped table-rounded table-bordered help-table">
                <thead>
                    <tr>
                        <th id="message-formatting-first-header">{{t "You type" }}</th>
                        <th>{{t "You get" }}</th>
                    </tr>
                </thead>

                <tbody>
                    {{#each markdown_help_rows}}
                        <tr>
                            {{#if note_html}}
                            <td colspan="2">{{{note_html}}}</td>
                            {{else}}
                            <td><div class="preserve_spaces">{{markdown}}</div> {{#if usage_html}}{{{usage_html}}}{{/if}}</td>
                            <td class="rendered_markdown">{{{output_html}}} {{#if effect_html}}{{{effect_html}}}{{/if}}</td>
                            {{/if}}
                        </tr>
                    {{/each}}
                </tbody>
            </table>
        </div>
        <hr />
        <a href="/help/format-your-message-using-markdown" target="_blank" rel="noopener noreferrer">{{t "Detailed message formatting documentation" }}</a>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: markdown_timestamp.hbs]---
Location: zulip-main/web/templates/markdown_timestamp.hbs

```text
{{~!-- --~}}
<span class="timestamp-content-wrapper">
    <i class="zulip-icon zulip-icon-clock markdown-timestamp-icon"></i>
    {{~ text ~}}
</span>
{{~!-- --~}}
```

--------------------------------------------------------------------------------

---[FILE: markdown_time_tooltip.hbs]---
Location: zulip-main/web/templates/markdown_time_tooltip.hbs

```text
{{t 'Everyone sees this in their own time zone.' }}
<br/>
{{t 'Your time zone:' }} {{ tz_offset_str }}
```

--------------------------------------------------------------------------------

---[FILE: mention_content_wrapper.hbs]---
Location: zulip-main/web/templates/mention_content_wrapper.hbs

```text
{{~!-- --~}}
<span class="mention-content-wrapper">{{ mention_text }}</span>
{{~!-- --~}}
{{#if is_bot}}<i class="zulip-icon zulip-icon-bot" aria-label="{{t 'Bot' }}"></i>{{/if}}
{{~!-- --~}}
```

--------------------------------------------------------------------------------

---[FILE: message_avatar.hbs]---
Location: zulip-main/web/templates/message_avatar.hbs

```text
<div class="u-{{msg/sender_id}} message-avatar sender_info_hover view_user_card_tooltip no-select" aria-hidden="true" data-is-bot="{{sender_is_bot}}">
    <div class="inline-profile-picture-wrapper">
        <div class="inline_profile_picture {{#if sender_is_guest}} guest-avatar{{/if}} {{#if sender_is_deactivated}} deactivated {{/if}} {{#if is_hidden}} muted-sender-avatar {{/if}}">
            <img loading="lazy" src="{{small_avatar_url}}" alt="" class="no-drag"/>
            {{#if sender_is_deactivated}}
                <i class="fa fa-ban deactivated-user-icon"></i>
            {{/if}}
        </div>
    </div>
</div>
{{~! remove whitespace ~}}
```

--------------------------------------------------------------------------------

---[FILE: message_body.hbs]---
Location: zulip-main/web/templates/message_body.hbs

```text
{{#if include_sender}}
    {{> message_avatar . ~}}
{{/if}}
<span class="message_sender">
    {{#if include_sender}}
        <span class="sender_info_hover sender_name" role="button" tabindex="0">
            <span class="view_user_card_tooltip sender_name_text" data-is-bot="{{sender_is_bot}}">
                {{> user_full_name name=msg/sender_full_name should_add_guest_user_indicator=should_add_guest_indicator_for_sender is_hidden=is_hidden}}
            </span>
            {{#unless status_message}}
                {{#unless is_hidden}}
                {{> status_emoji msg/status_emoji_info}}
                {{/unless}}
            {{/unless}}
        </span>
        {{#unless is_hidden}}
            {{#if sender_is_bot}}
                <i class="zulip-icon zulip-icon-bot" aria-label="{{t 'Bot' }}"></i>
            {{/if}}
            {{#if status_message}}
                <span class="message_content rendered_markdown status-message">{{rendered_markdown status_message}}</span>
                {{#if message_edit_notices_for_status_message}}
                    {{> edited_notice .}}
                {{/if}}
            {{/if}}
            {{#if message_edit_notices_alongside_sender}}
                {{> edited_notice .}}
            {{/if}}
        {{/unless}}
    {{/if}}
</span>

<a {{#unless msg/locally_echoed}}href="{{ msg/url }}"{{/unless}} class="message-time">
    {{#unless include_sender}}
    <span class="copy-paste-text">&nbsp;</span>
    {{/unless}}
    {{timestr}}
</a>

{{#if (and (not msg/failed_request) msg/locally_echoed)}}
    <span data-tooltip-template-id="slow-send-spinner-tooltip-template" class="fa fa-circle-o-notch slow-send-spinner{{#unless msg/show_slow_send_spinner }} hidden{{/unless}}"></span>
{{/if}}

<div class="message_controls no-select">
    {{#if msg/locally_echoed}}
        {{#if msg/failed_request}}
            {{> message_controls_failed_msg}}
            {{ else }}
            {{> message_controls .}}
        {{/if}}
    {{else}}
        {{> message_controls .}}
    {{/if}}
</div>

{{#unless status_message}}
    {{#unless is_hidden}}
    <div class="message_content rendered_markdown">
        {{#if use_match_properties}}
            {{rendered_markdown msg/match_content}}
        {{else}}
            {{rendered_markdown msg/content}}
        {{/if}}
    </div>
    {{else}}
    <div class="message_content rendered_markdown">
        {{> message_hidden_dialog}}
    </div>
    {{/unless}}
{{/unless}}

{{#if message_edit_notices_in_left_col}}
{{> edited_notice .}}
{{/if}}

<div class="message_length_controller"></div>

{{#if (and (not is_hidden) msg.message_reactions)}}
    {{> message_reactions . }}
{{/if}}

{{#if msg.reminders}}
    {{> message_reminders . }}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: message_controls.hbs]---
Location: zulip-main/web/templates/message_controls.hbs

```text
{{#unless is_archived}}
    {{#if msg/sent_by_me}}
        <div class="edit_content message_control_button">
            <i class="message-controls-icon zulip-icon zulip-icon-edit edit_content_button edit_message_button" role="button" tabindex="0" aria-label="{{t 'Edit message' }} (e)"></i>
            <i class="message-controls-icon zulip-icon zulip-icon-move-alt move_message_button edit_message_button" role="button" tabindex="0" aria-label="{{t 'Move message' }} (m)"></i>
        </div>
    {{/if}}

    {{#unless msg/sent_by_me}}
        <div class="reaction_button message_control_button" data-tooltip-template-id="add-emoji-tooltip-template">
            <div class="emoji-message-control-button-container">
                <i class="message-controls-icon zulip-icon zulip-icon-smile" aria-label="{{t 'Add emoji reaction' }} (:)" role="button" aria-haspopup="true" tabindex="0"></i>
            </div>
        </div>
    {{/unless}}
{{/unless}}

<div class="actions_hover message_control_button" data-tooltip-template-id="message-actions-tooltip-template" >
    <i class="message-controls-icon message-actions-menu-button zulip-icon zulip-icon-more-vertical-spread" role="button" aria-haspopup="true" tabindex="0" aria-label="{{t 'Message actions' }}"></i>
</div>

<div class="star_container message_control_button {{#if msg/starred}}{{else}}empty-star{{/if}}" data-tooltip-template-id="{{#if msg/starred}}unstar{{else}}star{{/if}}-message-tooltip-template">
    {{#unless msg/locally_echoed}}
    <i role="button" tabindex="0" class="message-controls-icon star zulip-icon {{#if msg/starred}}zulip-icon-star-filled{{else}}zulip-icon-star{{/if}}"></i>
    {{/unless}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: message_controls_failed_msg.hbs]---
Location: zulip-main/web/templates/message_controls_failed_msg.hbs

```text
<div class="message_control_button failed_message_action" data-tippy-content="{{t 'Retry' }}">
    <i class="message-controls-icon fa fa-refresh refresh-failed-message" aria-label="{{t 'Retry' }}" role="button" tabindex="0"></i>
</div>

<div class="message_control_button failed_message_action" data-tooltip-template-id="dismiss-failed-send-button-tooltip-template">
    <i class="message-controls-icon fa fa-times-circle remove-failed-message" aria-label="{{t 'Dismiss' }}" role="button" tabindex="0"></i>
</div>
```

--------------------------------------------------------------------------------

---[FILE: message_edit_form.hbs]---
Location: zulip-main/web/templates/message_edit_form.hbs

```text
{{! Client-side Handlebars template for rendering the message edit form. }}
<div class="message_edit">
    <div class="message_edit_form">
        <form class="edit-form" id="edit_form_{{message_id}}">
            <div class="edit_form_banners"></div>
            <div class="edit-controls edit-content-container {{#if is_editable}}surround-formatting-buttons-row{{/if}}">
                <div class="message-edit-textbox">
                    <span class="copy_message copy-button copy-button-square tippy-zulip-tooltip" data-tippy-content="{{t 'Copy and close' }}" aria-label="{{t 'Copy and close' }}" role="button">
                        <i class="zulip-icon zulip-icon-copy" aria-hidden="true"></i>
                    </span>
                    <textarea class="message_edit_content message-textarea">{{content}}</textarea>
                </div>
                <div class="scrolling_list preview_message_area" id="preview_message_area_{{message_id}}" style="display:none;">
                    <div class="markdown_preview_spinner"></div>
                    <div class="preview_content rendered_markdown"></div>
                </div>
            </div>
            <div class="action-buttons">
                <div class="controls edit-controls">
                    {{#if is_editable}}
                    <div class="message-edit-feature-group compose-scrolling-buttons-container">
                        {{> compose_control_buttons . }}
                        <button type="button" class="formatting-control-scroller-button formatting-scroller-forward">
                            <i class="scroller-forward-icon zulip-icon zulip-icon-compose-scroll-right"></i>
                        </button>
                        <button type="button" class="formatting-control-scroller-button formatting-scroller-backward">
                            <i class="scroller-backward-icon zulip-icon zulip-icon-compose-scroll-left"></i>
                        </button>
                    </div>
                    {{/if}}
                    <div class="message-edit-buttons-and-timer">
                        {{#if is_editable}}
                            <div class="message_edit_save_container">
                                <button type="button" class="message-actions-button message_edit_save">
                                    <img class="loader" alt="" src="" />
                                    <span>{{t "Save" }}</span>
                                </button>
                            </div>
                            <button type="button" class="message-actions-button message_edit_cancel"><span>{{t "Cancel" }}</span></button>
                            <span class="tippy-zulip-tooltip message-limit-indicator" data-tippy-content="{{t 'Maximum message length: {max_message_length} characters' }}"></span>
                            <div class="message-edit-timer">
                                <span class="message_edit_countdown_timer
                                  tippy-zulip-tooltip" data-tippy-content="{{t 'This organization is configured to restrict editing of message content to {minutes_to_edit} minutes after it is sent.' }}"></span>
                            </div>
                        {{else}}
                            <button type="button" class="message-actions-button message_edit_close"><span>{{t "Close" }}</span></button>
                        {{/if}}
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: message_edit_history.hbs]---
Location: zulip-main/web/templates/message_edit_history.hbs

```text
{{! Client-side Handlebars template for viewing message edit history. }}

{{#each edited_messages}}
    <div class="message-edit-message-row overlay-message-row" data-message-edit-history-id="{{timestamp}}">
        <div class="message-edit-message-info-box overlay-message-info-box" tabindex="0">
            {{#if is_stream }}
            <div class="message_header message_header_stream overlay-message-header">
                <div class="message-header-contents" style="background: {{recipient_bar_color}};">
                    <div class="message_label_clickable stream_label">
                        <span class="private_message_header_name">{{ edited_by_notice }}</span>
                    </div>
                    <div class="recipient_row_date" title="{{t 'Last modified'}}">{{t "{edited_at_time}" }}

                    </div>
                </div>
            </div>
            {{else}}
            <div class="message_header message_header_private_message overlay-message-header">
                <div class="message-header-contents">
                    <div class="message_label_clickable stream_label">
                        <span class="private_message_header_name">{{ edited_by_notice }}</span>
                    </div>
                    <div class="recipient_row_date" title="{{t 'Last modified'}}">{{t "{edited_at_time}" }}</div>
                </div>
            </div>
            {{/if}}
            <div class="message_row{{#unless is_stream}} private-message{{/unless}}" role="listitem">
                <div class="messagebox">
                    <div class="messagebox-content">
                        {{#if initial_entry_for_move_history}}
                        <div class="message_content message_edit_history_content">
                            <p>{{t "Channel" }}: <span class="highlight_text_inserted">{{ new_stream }}</span></p>
                            <p>{{t "Topic" }}:
                                <span class="highlight_text_inserted {{#if is_empty_string_new_topic}}empty-topic-display{{/if}}">{{ new_topic_display_name }}</span>
                            </p>
                        </div>
                        {{else}}
                        {{#if stream_changed}}
                        <div class="message_content message_edit_history_content">
                            <p>{{t "Channel" }}: <span class="highlight_text_inserted">{{ new_stream }}</span>
                                <span class="highlight_text_deleted">{{ prev_stream }}</span>
                            </p>
                        </div>
                        {{/if}}
                        {{#if topic_edited}}
                        <div class="message_content message_edit_history_content">
                            <p>{{t "Topic" }}:
                                <span class="highlight_text_inserted {{#if is_empty_string_new_topic}}empty-topic-display{{/if}}">{{ new_topic_display_name }}</span>
                                <span class="highlight_text_deleted {{#if is_empty_string_prev_topic}}empty-topic-display{{/if}}">{{ prev_topic_display_name }}</span>
                            </p>
                        </div>
                        {{/if}}
                        {{#if body_to_render}}
                        <div class="message_content rendered_markdown message_edit_history_content">
                            {{ rendered_markdown body_to_render}}
                        </div>
                        {{/if}}
                        {{/if}}
                    </div>
                </div>
            </div>
        </div>
    </div>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: message_edit_notice_tooltip.hbs]---
Location: zulip-main/web/templates/message_edit_notice_tooltip.hbs

```text
<div>
    {{#if edit_history_access}}
        {{#if edited}}
            {{#if moved}}
            <div>{{t "View edit and move history"}}</div>
            {{else}}
            <div>{{t "View edit history"}}</div>
            {{/if}}
        {{else if moved}}
            <div>{{t "View move history"}}</div>
        {{/if}}
    {{else if message_moved_and_move_history_access}}
        <div>{{t "View move history"}}</div>
    {{/if}}
    {{#if edited}}
        <div class="tooltip-inner-content italic">
            {{t 'Last edited {edited_time_string}.'}}
        </div>
    {{/if}}
    {{#if moved}}
    <div class="tooltip-inner-content italic">
        {{t 'Last moved {moved_time_string}.'}}
    </div>
    {{/if}}
</div>
{{#if edit_history_access}}
{{tooltip_hotkey_hints "Shift" "H"}}
{{else if message_moved_and_move_history_access}}
{{tooltip_hotkey_hints "Shift" "H"}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: message_feed_errors.hbs]---
Location: zulip-main/web/templates/message_feed_errors.hbs

```text
<div class="history-limited-box">
    <p>
        <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        {{#tr}}
        Some older messages are unavailable.
        <z-link>Upgrade your organization</z-link>
        to access your full message history.
        {{#*inline "z-link"}}<a href="/plans/" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </p>
</div>
<div class="all-messages-search-caution hidden-for-spectators" hidden>
    <p>
        <i class="all-messages-search-caution-icon fa fa-exclamation-circle" aria-hidden="true"></i>
        {{#tr}}
        End of results from your
        <z-link>history</z-link>.
        {{#*inline "z-link"}}<a href="/help/search-for-messages#search-shared-history"
          target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
        &nbsp;
        <span>
            {{#if is_guest}}
                {{#tr}}
                    Consider <z-link>searching all public channels that you can view</z-link>.
                    {{#*inline "z-link"}}<a class="search-shared-history" href="">{{> @partial-block}}</a>{{/inline}}
                {{/tr}}
            {{else}}
                {{#tr}}
                    Consider <z-link>searching all public channels</z-link>.
                    {{#*inline "z-link"}}<a class="search-shared-history" href="">{{> @partial-block}}</a>{{/inline}}
                {{/tr}}
            {{/if}}
        </span>
    </p>
</div>
<div class="empty_feed_notice_main"></div>
```

--------------------------------------------------------------------------------

---[FILE: message_group.hbs]---
Location: zulip-main/web/templates/message_group.hbs

```text
{{! Client-side Handlebars template for rendering messages. }}

{{#each message_groups}}
    {{#if bookend_top}}
    {{> bookend .}}
    {{/if}}

    <div class="recipient_row" id="{{message_group_id}}">
        {{> recipient_row . use_match_properties=../use_match_properties}}
        {{#each message_containers}}
            {{> single_message . use_match_properties=../../use_match_properties message_list_id=../../message_list_id is_archived=../is_archived}}
        {{/each}}
    </div>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: message_hidden_dialog.hbs]---
Location: zulip-main/web/templates/message_hidden_dialog.hbs

```text
<p class="muted-message-notice-container">
    <span class="muted-message-notice">
        {{t "Message from a muted user." }}
    </span>
    <button class="action-button action-button-borderless-neutral reveal-hidden-message reveal-button" tabindex="0" aria-label="{{t 'Reveal message from muted user' }}">
        <i class="zulip-icon zulip-icon-eye"></i>
        <span class="action-button-label">{{t 'Reveal'}}</span>
    </button>
</p>
```

--------------------------------------------------------------------------------

---[FILE: message_history_overlay.hbs]---
Location: zulip-main/web/templates/message_history_overlay.hbs

```text
<div id="message-history-overlay" class="overlay" data-overlay="message_edit_history">
    <div class="flex overlay-content">
        <div class="message-edit-history-container overlay-messages-container overlay-container">
            <div class="overlay-messages-header">
                {{#if move_history_only}}
                <h1>{{t "Message move history" }}</h1>
                {{else}}
                {{#if edited}}
                    {{#if moved}}
                    <h1>{{t "Message edit and move history" }}</h1>
                    {{else}}
                    <h1>{{t "Message edit history" }}</h1>
                    {{/if}}
                {{else if moved}}
                    <h1>{{t "Message move history" }}</h1>
                {{/if}}
                {{/if}}
                <div class="exit">
                    <span class="exit-sign">&times;</span>
                </div>
            </div>
            <div class="message-edit-history-list overlay-messages-list">
            </div>
            <div class="loading_indicator"></div>
            <div id="message-history-error" class="alert">
            </div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: message_length_toggle.hbs]---
Location: zulip-main/web/templates/message_length_toggle.hbs

```text
{{#if (eq toggle_type "expander")}}
<button type="button" class="message_expander message_length_toggle"
  {{#if tooltip_template_id}}
  data-enable-tooltip="true" data-tooltip-template-id="{{ tooltip_template_id }}"
  {{else}}
  data-enable-tooltip="false"
  {{/if}}>
    {{ label_text }}
</button>
{{else if (eq toggle_type "condenser")}}
<button type="button" class="message_condenser message_length_toggle"
  {{#if tooltip_template_id}}
  data-enable-tooltip="true" data-tooltip-template-id="{{ tooltip_template_id }}"
  {{else}}
  data-enable-tooltip="false"
  {{/if}}>
    {{ label_text }}
</button>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: message_list.hbs]---
Location: zulip-main/web/templates/message_list.hbs

```text
<div class="message-list" data-message-list-id="{{ message_list_id }}" role="list" aria-live="polite" aria-label="{{t 'Messages' }}"></div>
```

--------------------------------------------------------------------------------

---[FILE: message_media_preview_tooltip.hbs]---
Location: zulip-main/web/templates/message_media_preview_tooltip.hbs

```text
<div>
    <strong>{{ title }}</strong>
    <div class="tooltip-inner-content italic">{{t 'Click to view or download.'}}</div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: message_moved_widget_body.hbs]---
Location: zulip-main/web/templates/message_moved_widget_body.hbs

```text
<div>
    {{#tr}}
        Message moved to <z-link></z-link>.
        {{#*inline "z-link"~}}
            <a class="white-space-preserve-wrap" href="{{new_location_url}}">
                {{~!-- squash whitespace --~}}
                #{{new_stream_name}} &gt; <span {{#if is_empty_string_topic}}class="empty-topic-display"{{/if}}>{{new_topic_display_name}}</span>
                {{~!-- squash whitespace --~}}
            </a>
        {{~/inline}}
    {{/tr}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: message_reaction.hbs]---
Location: zulip-main/web/templates/message_reaction.hbs

```text
<div class="message_reaction_container {{#if is_archived}}disabled{{/if}}">
    <div class="{{this.class}} {{#if is_archived}}disabled{{/if}}" aria-label="{{this.label}}" data-reaction-id="{{this.local_id}}">
        {{#if this.emoji_alt_code}}
            <div class="emoji_alt_code">&nbsp;:{{this.emoji_name}}:</div>
        {{else if this.is_realm_emoji}}
            <img src="{{this.url}}" class="emoji" />
        {{else}}
            <div class="emoji emoji-{{this.emoji_code}}"></div>
        {{/if}}
        <div class="message_reaction_count">{{this.vote_text}}</div>
    </div>
</div>
```

--------------------------------------------------------------------------------

````
