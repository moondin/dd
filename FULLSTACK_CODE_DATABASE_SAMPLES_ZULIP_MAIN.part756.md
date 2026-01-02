---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 756
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 756 of 1290)

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

---[FILE: about_zulip.hbs]---
Location: zulip-main/web/templates/about_zulip.hbs

```text
<div id="about-zulip" class="overlay flex" tabindex="-1" role="dialog" data-overlay="about-zulip" aria-hidden="true">
    <div class="overlay-content overlay-container">
        <button type="button" class="exit" aria-label="{{t 'Close' }}"><span aria-hidden="true">&times;</span></button>
        <div class="overlay-body">
            <div class="about-zulip-logo">
                <a target="_blank" rel="noopener noreferrer" href="https://zulip.com"><img src="../../static/images/logo/zulip-org-logo.svg" alt="{{t 'Zulip' }}" /></a>
            </div>
            <div class="about-zulip-version">
                <strong>Zulip Server</strong>
                <div class="zulip-version-info">
                    <span>{{t "Version {zulip_version}" }}</span>
                    <span class="copy-button tippy-zulip-tooltip zulip-version" data-tippy-content="{{t 'Copy version' }}" data-tippy-placement="right" data-clipboard-text="{{zulip_version}}">
                        <i class="zulip-icon zulip-icon-copy" aria-hidden="true"></i>
                    </span>
                </div>
                {{#if is_fork}}
                <div class="zulip-merge-base-info">
                    <span>{{t "Forked from upstream at {zulip_merge_base}" }}</span>
                    <span class="copy-button tippy-zulip-tooltip zulip-merge-base" data-tippy-content="{{t 'Copy version' }}" data-tippy-placement="right" data-clipboard-text="{{zulip_merge_base}}">
                        <i class="zulip-icon zulip-icon-copy" aria-hidden="true"></i>
                    </span>
                </div>
                {{/if}}
            </div>
            <p>
                Copyright 2012–2015 Dropbox, Inc., 2015–2021 Kandra Labs, Inc., and contributors.
            </p>
            <p>
                Zulip is <a target="_blank" rel="noopener noreferrer" href="https://github.com/zulip/zulip#readme">open-source software</a>,
                distributed under the Apache 2.0 license.
            </p>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: add_poll_modal.hbs]---
Location: zulip-main/web/templates/add_poll_modal.hbs

```text
<form id="add-poll-form">
    <label class="poll-label">{{t "Question"}}</label>
    <div class="poll-question-input-container">
        <input type="text" id="poll-question-input" autocomplete="off" class="modal_text_input" placeholder="{{t 'Your question'}}" />
    </div>
    <label class="poll-label">{{t "Options"}}</label>
    <p>{{t "Anyone can add more options after the poll is posted."}}</p>
    <ul class="poll-options-list" data-simplebar data-simplebar-tab-index="-1">
        {{> poll_modal_option }}
        {{> poll_modal_option }}
        {{> poll_modal_option }}
    </ul>
</form>
```

--------------------------------------------------------------------------------

---[FILE: add_saved_snippet_modal.hbs]---
Location: zulip-main/web/templates/add_saved_snippet_modal.hbs

```text
<div id="add-new-saved-snippet-modal">
    <form id="add-new-saved-snippet-form">
        <label for="title" class="modal-field-label">{{t "Title" }}</label>
        <input id="new-saved-snippet-title" type="text" name="title" class="modal_text_input saved-snippet-title" value="" autocomplete="off" spellcheck="false" autofocus="autofocus"/>
        <div>{{t "Content" }}</div>
        <textarea class="modal-textarea saved-snippet-content" rows="4">
            {{~prepopulated_content~}}
        </textarea>
    </form>
</div>
```

--------------------------------------------------------------------------------

---[FILE: add_todo_list_modal.hbs]---
Location: zulip-main/web/templates/add_todo_list_modal.hbs

```text
<form id="add-todo-form" class="new-style">
    <label class="todo-label">{{t "To-do list title" }}</label>
    <div class="todo-title-input-container">
        <input type="text" id="todo-title-input" autocomplete="off" value="{{t 'Task list' }}" class="modal_text_input" />
    </div>
    <label class="todo-label">{{t "Tasks" }}</label>
    <p>{{t "Anyone can add more tasks after the to-do list is posted."}}</p>
    <ul class="todo-options-list" data-simplebar data-simplebar-tab-index="-1">
        {{> todo_modal_task }}
        {{> todo_modal_task }}
        {{> todo_modal_task }}
    </ul>
</form>
```

--------------------------------------------------------------------------------

---[FILE: blueslip_stacktrace.hbs]---
Location: zulip-main/web/templates/blueslip_stacktrace.hbs

```text
{{#each errors}}
    <div class="stacktrace-header">
        <div class="warning-symbol">
            <i class="fa fa-exclamation-triangle"></i>
        </div>
        <div class="message">{{#unless @first}}caused by {{/unless}}<strong>{{name}}:</strong> {{ message }}</div>
        {{#if @first}}
            <div class="exit"></div>
        {{/if}}
    </div>
    {{#if more_info}}
        <div class="stacktrace-more-info">{{more_info}}</div>
    {{/if}}
    <div class="stacktrace-content">
        {{#each stackframes}}
            <div data-full-path="{{ full_path }}" data-line-no="{{ line_number }}">
                <div class="stackframe">
                    <i class="fa fa-caret-right expand"></i>
                    <span class="subtle">at</span>
                    {{#if function_name}}
                    {{ function_name.scope }}<b>{{ function_name.name }}</b>
                    {{/if}}
                    <span class="subtle">{{ show_path }}:{{ line_number }}</span>
                </div>
                <div class="code-context" style="display: none">
                    <div class="code-context-content">
                        {{~#each context~}}
                            <div {{#if focus}}class="focus-line"{{/if}}><span class="line-number">{{ line_number }}</span> {{ line }}</div>
                        {{~/each~}}
                    </div>
                </div>
            </div>
        {{/each}}
    </div>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: bookend.hbs]---
Location: zulip-main/web/templates/bookend.hbs

```text
{{! Client-side Handlebars template for rendering the trailing bookend. }}
<div class="{{#if is_trailing_bookend}}trailing_bookend {{/if}}bookend">
    {{#if is_spectator}}
        <span class="recent-topics-link bookend-label">
            <a href="#recent">{{t "Browse recent conversations" }}</a>
        </span>
    {{else}}
        <span class="stream-status bookend-label">
            {{#if deactivated}}
                {{t "This channel has been archived." }}
            {{else if subscribed }}
                {{#tr}}
                    You subscribed to <z-stream-name></z-stream-name>. <channel-settings-link></channel-settings-link>
                    {{#*inline "z-stream-name"}}{{> stream_privacy . }} {{stream_name}}{{/inline}}
                    {{#*inline "channel-settings-link"}} <a class="bookend-channel-settings-link" href="#channels/{{stream_id}}/{{stream_name}}/personal">{{t 'Manage channel settings'}}</a>{{/inline}}
                {{/tr}}
            {{else if just_unsubscribed }}
                {{#tr}}
                    You unsubscribed from <z-stream-name></z-stream-name>. <channel-settings-link></channel-settings-link>
                    {{#*inline "z-stream-name"}}{{> stream_privacy . }} {{stream_name}}{{/inline}}
                    {{#*inline "channel-settings-link"}} <a class="bookend-channel-settings-link" href="#channels/{{stream_id}}/{{stream_name}}/general">{{t 'View in channel settings'}}</a>{{/inline}}
                {{/tr}}
            {{else}}
                {{#tr}}
                    You are not subscribed to <z-stream-name></z-stream-name>. <subscribe-button></subscribe-button>
                    {{#*inline "z-stream-name"}}{{> stream_privacy . }} {{stream_name}}{{/inline}}
                    {{#*inline "subscribe-button"}} <a class="stream_sub_unsub_button">{{t 'Subscribe'}}</a>{{/inline}}
                {{/tr}}
            {{/if}}
        </span>
    {{/if}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: buddy_list_tooltip_content.hbs]---
Location: zulip-main/web/templates/buddy_list_tooltip_content.hbs

```text
<div class="buddy_list_tooltip_content">
    <div>
        {{first_line}}
        {{#if show_you}}
        <span class="my_user_status">{{t "(you)" }}</span>
        {{/if}}
    </div>
    {{#if second_line}}
        <div class="tooltip-inner-content {{#if is_deactivated}}italic{{/if}}" >{{second_line}}</div>
    {{/if}}
    {{#if third_line}}
        <div class="tooltip-inner-content {{#if is_deactivated}}italic{{/if}}">{{third_line}}</div>
    {{/if}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: change_email_modal.hbs]---
Location: zulip-main/web/templates/change_email_modal.hbs

```text
<form id="change_email_form">
    <p>{{t "You will receive a confirmation email at the new address you enter."}}</p>
    <label for="change-email-form-input-email" class="modal-field-label">{{t "New email" }}</label>
    <input id="change-email-form-input-email" type="text" name="email" class="modal_text_input" value="{{delivery_email}}" autocomplete="off" spellcheck="false" autofocus="autofocus"/>
</form>
```

--------------------------------------------------------------------------------

---[FILE: change_visibility_policy_button_tooltip.hbs]---
Location: zulip-main/web/templates/change_visibility_policy_button_tooltip.hbs

```text
<div id="change_visibility_policy_button_tooltip">
    <strong>{{t 'Configure topic notifications' }}</strong>
    <div class="tooltip-inner-content italic">
        <span>
            {{#if should_render_privacy_icon}}
                {{#tr}}
                    Notifications are based on your configuration for <z-stream-name></z-stream-name>.
                    {{#*inline "z-stream-name"}}<span class="tooltip-privacy-icon">{{> stream_privacy . }}<span class="privacy-tooltip-stream-name">{{name}}</span></span>{{/inline}}
                {{/tr}}
            {{else}}
                {{current_visibility_policy_str}}
            {{/if}}
        </span>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: channel_message_link.hbs]---
Location: zulip-main/web/templates/channel_message_link.hbs

```text
{{#if is_empty_string_topic}}
<a class="message-link" href="{{href}}">
    {{~!-- squash whitespace --~}}
    #{{channel_name}} &gt; <span class="empty-topic-display">{{topic_display_name}}</span> @ 💬
    {{~!-- squash whitespace --~}}
</a>
{{~else}}
<a class="message-link" href="{{href}}">
    {{~!-- squash whitespace --~}}
    #{{channel_name}} &gt; {{topic_display_name}} @ 💬
    {{~!-- squash whitespace --~}}
</a>
{{~/if}}
```

--------------------------------------------------------------------------------

---[FILE: code_buttons_container.hbs]---
Location: zulip-main/web/templates/code_buttons_container.hbs

```text
<div class="code-buttons-container">
    <span class="copy_codeblock copy-button copy-button-square" data-tippy-content="{{t 'Copy code' }}" aria-label="{{t 'Copy code' }}" role="button">
        <i class="zulip-icon zulip-icon-copy" aria-hidden="true"></i>
    </span>
    {{~#if show_playground_button~}}
    {{! Display the "view code in playground" option for code blocks}}
    <span class="code_external_link">
        <i class="zulip-icon zulip-icon-external-link playground-links-popover-container"></i>
    </span>
    {{~/if~}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: compose.hbs]---
Location: zulip-main/web/templates/compose.hbs

```text
<div id="compose-content">
    {{!-- scroll to bottom button is not part of compose but
    helps us align it at various screens sizes with
    minimal css and no JS. We keep it `position: absolute` to prevent
    it changing compose box layout in any way. --}}
    <div id="scroll-to-bottom-button-container" aria-hidden="true">
        <div id="scroll-to-bottom-button-clickable-area" data-tooltip-template-id="scroll-to-bottom-button-tooltip-template">
            <div id="scroll-to-bottom-button">
                <i class="scroll-to-bottom-icon fa fa-chevron-down"></i>
            </div>
        </div>
    </div>
    <div id="compose_controls">
        <div id="compose_buttons">
            <div class="reply_button_container">
                <div class="compose-reply-button-wrapper" data-reply-button-type="selected_message">
                    <button type="button" class="compose_reply_button"
                      id="left_bar_compose_reply_button_big">
                        {{t 'Compose message' }}
                    </button>
                </div>
                <button type="button" class="compose_new_conversation_button"
                  id="new_conversation_button"
                  data-tooltip-template-id="new_stream_message_button_tooltip_template">
                    {{t 'Start new conversation' }}
                </button>
            </div>
            <span class="mobile_button_container">
                <button type="button" class="compose_mobile_button"
                  id="left_bar_compose_mobile_button_big"
                  data-tooltip-template-id="left_bar_compose_mobile_button_tooltip_template">
                    +
                </button>
            </span>
            {{#unless embedded }}
            <span class="new_direct_message_button_container">
                <button type="button" class="compose_new_direct_message_button"
                  id="new_direct_message_button"
                  data-tooltip-template-id="new_direct_message_button_tooltip_template">
                    {{t 'New direct message' }}
                </button>
            </span>
            {{/unless}}
        </div>
    </div>
    <div class="message_comp">
        <div id="compose_banners" data-simplebar data-simplebar-tab-index="-1"></div>
        <div class="composition-area">
            <form id="send_message_form" action="/json/messages" method="post">
                <div class="compose_table">
                    <div id="compose_top">
                        {{!-- We start with the low-attention-recipient-row class
                        on the template to avoid showing the transition
                        when the compose box first opens. Note that this
                        class is immediately removed when it's not used,
                        so, for example, opening the compose box from
                        Inbox view does not cause any flash of unwanted
                        styling. --}}
                        <div id="compose-recipient" class="low-attention-recipient-row">
                            {{> dropdown_widget_wrapper
                              widget_name="compose_select_recipient"}}
                            <div class="topic-marker-container">
                                <a role="button" class="conversation-arrow zulip-icon zulip-icon-chevron-right"></a>
                            </div>
                            <div id="compose_recipient_box">
                                <input type="text" name="stream_message_recipient_topic" id="stream_message_recipient_topic" maxlength="{{ max_topic_length }}" value="" placeholder="{{t 'Topic' }}" autocomplete="off" tabindex="0" aria-label="{{t 'Topic' }}" />
                                <span id="topic-not-mandatory-placeholder" class="placeholder">
                                    {{> topic_not_mandatory_placeholder_text empty_string_topic_display_name=empty_string_topic_display_name}}
                                </span>
                                <button type="button" id="recipient_box_clear_topic_button" class="compose-new-recipient-button" tabindex="-1">
                                    <i class="zulip-icon zulip-icon-square-plus"></i>
                                </button>
                            </div>
                            <div id="compose-direct-recipient" data-before="{{t 'You and' }}">
                                <div class="pill-container">
                                    <div class="input" contenteditable="true" id="private_message_recipient" data-no-recipients-text="{{t 'Add users' }}" ></div>
                                    <button type="button" id="compose-new-direct-recipient-button" class="compose-new-recipient-button tippy-zulip-delayed-tooltip" data-tippy-content="{{t 'Add recipient' }}" tabindex="-1">
                                        <i class="zulip-icon zulip-icon-square-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="messagebox">
                        <div id="message-content-container" class="surround-formatting-buttons-row">
                            <textarea class="new_message_textarea message-textarea" name="content" id='compose-textarea' placeholder="{{t 'Compose your message here' }}" tabindex="0" aria-label="{{t 'Compose your message here…' }}"></textarea>
                            <div id="preview-message-area-container">
                                <div class="scrolling_list preview_message_area" data-simplebar data-simplebar-tab-index="-1" id="preview_message_area" style="display:none;">
                                    <div class="markdown_preview_spinner"></div>
                                    <div class="preview_content rendered_markdown"></div>
                                </div>
                            </div>
                            <div class="composebox-buttons">
                                <button type="button" class="maximize-composebox-button zulip-icon zulip-icon-maximize-diagonal" aria-label="{{t 'Maximize compose box' }}" data-tippy-content="{{t 'Maximize compose box' }}"></button>
                                <button type="button" class="expand-composebox-button zulip-icon zulip-icon-expand-diagonal" aria-label="{{t 'Expand compose box' }}" data-tippy-content="{{t 'Expand compose box' }}"></button>
                                <button type="button" class="collapse-composebox-button zulip-icon zulip-icon-collapse-diagonal" aria-label="{{t 'Collapse compose box' }}" data-tippy-content="{{t 'Collapse compose box' }}"></button>
                            </div>
                            <div class="drag"></div>
                        </div>

                        <div id="message-send-controls-container">
                            <a id="compose-drafts-button" role="button" class="send-control-button hide-sm" tabindex=0 href="#drafts">
                                <span class="compose-drafts-text">{{t 'Drafts' }}</span><span class="compose-drafts-count-container">(<span class="compose-drafts-count"></span>)</span>
                            </a>
                            <span id="compose-limit-indicator" class="message-limit-indicator"></span>
                            <div class="message-send-controls">
                                <button type="submit" id="compose-send-button" class="send_message compose-submit-button compose-send-or-save-button" aria-label="{{t 'Send' }}">
                                    <img class="loader" alt="" src="" />
                                    <i class="zulip-icon zulip-icon-send"></i>
                                </button>
                                <button class="send-control-button send-related-action-button" id="send_later" tabindex=0 type="button" data-tippy-content="{{t 'Send options' }}">
                                    <i class="zulip-icon zulip-icon-more-vertical"></i>
                                </button>
                            </div>
                        </div>

                        <div id="message-formatting-controls-container" class="compose-scrolling-buttons-container">
                            {{> compose_control_buttons . }}
                            <button type="button" class="formatting-control-scroller-button formatting-scroller-forward">
                                <i class="scroller-forward-icon zulip-icon zulip-icon-compose-scroll-right"></i>
                            </button>
                            <button type="button" class="formatting-control-scroller-button formatting-scroller-backward">
                                <i class="scroller-backward-icon zulip-icon zulip-icon-compose-scroll-left"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <button type="button" class="zulip-icon zulip-icon-close" id='compose_close' data-tooltip-template-id="compose_close_tooltip_template"></button>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: compose_control_buttons.hbs]---
Location: zulip-main/web/templates/compose_control_buttons.hbs

```text
<div class="compose-scrollable-buttons compose-control-buttons-container order-1" tabindex="-1">
    <input type="file" class="file_input notvisible" multiple />
    <div class="compose_control_button_container compose_button_tooltip" data-tooltip-template-id="preview-tooltip" data-tippy-maxWidth="none">
        <a role="button" class="markdown_preview compose_control_button zulip-icon zulip-icon-preview" aria-label="{{t 'Preview mode' }}" tabindex=0></a>
    </div>
    <div class="compose_control_button_container compose_button_tooltip" data-tooltip-template-id="exit-preview-tooltip" data-tippy-maxWidth="none">
        <a role="button" class="undo_markdown_preview compose_control_button zulip-icon zulip-icon-compose-edit" aria-label="{{t 'Exit preview mode' }}" tabindex=0 style="display:none;"></a>
    </div>
    {{#if file_upload_enabled }}
    <div class="compose_control_button_container preview_mode_disabled compose_button_tooltip" data-tippy-content="{{t 'Upload files' }}">
        <a role="button" class="compose_control_button compose_upload_file zulip-icon zulip-icon-attachment" aria-label="{{t 'Upload files' }}" tabindex=0></a>
    </div>
    {{/if}}
    <div class="compose_control_button_container preview_mode_disabled compose_button_tooltip" data-tippy-content="{{t 'Add video call' }}">
        <a role="button" class="compose_control_button zulip-icon zulip-icon-video-call video_link" aria-label="{{t 'Add video call' }}" tabindex=0></a>
    </div>
    <div class="compose_control_button_container preview_mode_disabled compose_button_tooltip" data-tippy-content="{{t 'Add voice call' }}">
        <a role="button" class="compose_control_button zulip-icon zulip-icon-voice-call audio_link" aria-label="{{t 'Add voice call' }}" tabindex=0></a>
    </div>
    <div class="divider"></div>
    <div class="compose_control_button_container preview_mode_disabled compose_button_tooltip" data-tippy-content="{{t 'Add emoji' }}">
        <a role="button" class="compose_control_button zulip-icon zulip-icon-smile-bigger emoji_map" aria-label="{{t 'Add emoji' }}" tabindex=0></a>
    </div>
    <div class="compose_control_button_container preview_mode_disabled compose_button_tooltip" data-tooltip-template-id="add-global-time-tooltip" data-tippy-maxWidth="none">
        <a role="button" class="compose_control_button zulip-icon zulip-icon-time time_pick" aria-label="{{t 'Add global time' }}" tabindex=0></a>
    </div>
    {{#if (or tenor_enabled giphy_enabled)}}
        {{!-- We prefer showing the Tenor picker over the GIPHY picker, if both are enabled. --}}
        <div class="compose_control_button_container  preview_mode_disabled compose_button_tooltip" data-tippy-content="{{t 'Add GIF' }}">
            <a role="button" class="compose_control_button {{#if tenor_enabled}}compose-gif-icon-tenor{{else}}compose-gif-icon-giphy{{/if}} zulip-icon zulip-icon-gif" aria-label="{{t 'Add GIF' }}" tabindex=0></a>
        </div>
    {{/if}}
    {{#if message_id}}
    <div class="compose_control_button_container preview_mode_disabled compose_button_tooltip" data-tooltip-template-id="add-saved-snippet-tooltip">
        <a role="button" class="saved_snippets_widget saved-snippets-message-edit-widget compose_control_button zulip-icon zulip-icon-message-square-text" aria-label="{{t 'Add saved snippet' }}" data-message-id="{{message_id}}" tabindex=0></a>
    </div>
    {{else}}
    <div class="compose_control_button_container preview_mode_disabled compose_button_tooltip" data-tooltip-template-id="add-saved-snippet-tooltip">
        <a role="button" class="saved_snippets_widget saved-snippets-composebox-widget compose_control_button zulip-icon zulip-icon-message-square-text" aria-label="{{t 'Add saved snippet' }}" tabindex=0></a>
    </div>
    {{/if}}
    <div class="divider"></div>
    <div class="compose-control-buttons-container preview_mode_disabled">
        <a role="button" data-format-type="link" class="compose_button_tooltip compose_control_button zulip-icon zulip-icon-link formatting_button" aria-label="{{t 'Link' }}" {{#unless preview_mode_on}} tabindex=0 {{/unless}} data-tooltip-template-id="link-tooltip" data-tippy-maxWidth="none"></a>
        <a role="button" data-format-type="bold" class="compose_button_tooltip compose_control_button zulip-icon zulip-icon-bold formatting_button" aria-label="{{t 'Bold' }}" {{#unless preview_mode_on}} tabindex=0 {{/unless}} data-tooltip-template-id="bold-tooltip" data-tippy-maxWidth="none"></a>
        <a role="button" data-format-type="italic" class="compose_button_tooltip compose_control_button zulip-icon zulip-icon-italic formatting_button" aria-label="{{t 'Italic' }}" {{#unless preview_mode_on}} tabindex=0 {{/unless}} data-tooltip-template-id="italic-tooltip" data-tippy-maxWidth="none"></a>
        <a role="button" data-format-type="strikethrough" class="compose_button_tooltip compose_control_button zulip-icon zulip-icon-strikethrough formatting_button" aria-label="{{t 'Strikethrough' }}" {{#unless preview_mode_on}} tabindex=0 {{/unless}} data-tippy-content="{{t 'Strikethrough' }}"></a>
    </div>
    <div class="divider"></div>
    <div class="compose-control-buttons-container preview_mode_disabled">
        <a role="button" data-format-type="numbered" class="compose_button_tooltip compose_control_button zulip-icon zulip-icon-ordered-list formatting_button" aria-label="{{t 'Numbered list' }}" {{#unless preview_mode_on}} tabindex=0 {{/unless}} data-tippy-content="{{t 'Numbered list' }}"></a>
        <a role="button" data-format-type="bulleted" class="compose_button_tooltip compose_control_button zulip-icon zulip-icon-unordered-list formatting_button" aria-label="{{t 'Bulleted list' }}" {{#unless preview_mode_on}} tabindex=0 {{/unless}} data-tippy-content="{{t 'Bulleted list' }}"></a>
        <div class="divider"></div>
        <a role="button" data-format-type="quote" class="compose_button_tooltip compose_control_button zulip-icon zulip-icon-quote formatting_button" aria-label="{{t 'Quote' }}" {{#unless preview_mode_on}} tabindex=0 {{/unless}} data-tippy-content="{{t 'Quote' }}"></a>
        <a role="button" data-format-type="spoiler" class="compose_button_tooltip compose_control_button zulip-icon zulip-icon-spoiler formatting_button" aria-label="{{t 'Spoiler' }}" {{#unless preview_mode_on}} tabindex=0 {{/unless}} data-tippy-content="{{t 'Spoiler' }}"></a>
        <a role="button" data-format-type="code" class="compose_button_tooltip compose_control_button zulip-icon zulip-icon-code formatting_button" aria-label="{{t 'Code' }}" {{#unless preview_mode_on}} tabindex=0 {{/unless}} data-tooltip-template-id="code-tooltip"></a>
        <a role="button" data-format-type="latex" class="compose_button_tooltip compose_control_button zulip-icon zulip-icon-math formatting_button" aria-label="{{t 'Math (LaTeX)' }}" {{#unless preview_mode_on}} tabindex=0 {{/unless}} data-tippy-content="{{t 'Math (LaTeX)' }}"></a>
    </div>
    <div class="divider"></div>
    {{#unless message_id}}
    <div class="compose_control_button_container preview_mode_disabled needs-empty-compose compose_button_tooltip" data-tooltip-template-id="add-poll-tooltip" data-tippy-maxWidth="none">
        <a role="button" class="compose_control_button zulip-icon zulip-icon-poll add-poll" aria-label="{{t 'Add poll' }}" tabindex=0></a>
    </div>
    <div class="compose_control_button_container preview_mode_disabled needs-empty-compose compose_button_tooltip" data-tooltip-template-id="add-todo-tooltip" data-tippy-maxWidth="none">
        <a role="button" class="compose_control_button zulip-icon zulip-icon-todo-list add-todo-list" aria-label="{{t 'Add to-do list' }}" tabindex=0></a>
    </div>
    {{/unless}}
    <a role="button" class="compose_control_button compose_help_button zulip-icon zulip-icon-question compose_button_tooltip" tabindex=0 data-tippy-content="{{t 'Message formatting' }}" data-overlay-trigger="message-formatting"></a>
</div>
```

--------------------------------------------------------------------------------

---[FILE: compose_limit_indicator.hbs]---
Location: zulip-main/web/templates/compose_limit_indicator.hbs

```text
{{remaining_characters}}
```

--------------------------------------------------------------------------------

---[FILE: creator_details.hbs]---
Location: zulip-main/web/templates/creator_details.hbs

```text
{{#if creator}}
    {{#tr}}
        Created by <z-user></z-user> on <z-date-created></z-date-created>.
        {{#*inline "z-user"}}
            {{> user_display_only_pill
              is_inline=true
              user_id=creator.user_id
              img_src=creator.avatar_url
              display_value=creator.full_name
              is_current_user=is_creator
              is_active=creator.is_active }}
        {{/inline}}
        {{#*inline "z-date-created"}}{{date_created_string}}{{/inline}}
    {{/tr}}
{{else}}
    {{#tr}}
        Created on <z-date-created></z-date-created>.
        {{#*inline "z-date-created"}}{{date_created_string}}{{/inline}}
    {{/tr}}
{{/if}}
{{#if stream_id}}
{{# tr}}
    &nbsp;Channel ID: {{stream_id}}.
{{/tr}}
{{/if}}
{{#if group_id}}
{{# tr}}
    &nbsp;Group ID: {{group_id}}.
{{/tr}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: default_language_modal.hbs]---
Location: zulip-main/web/templates/default_language_modal.hbs

```text
<p>
    {{t "A language is marked as 100% translated only if every string in the web, desktop,
      and mobile apps is translated, including administrative UI and error messages." }}
</p>
<p>
    {{#tr}}
        Zulip's translations are contributed by our amazing community of volunteer
        translators. If you'd like to help, see the
        <z-link>Zulip translation guidelines</z-link>.
        {{#*inline "z-link"}}<a target="_blank" rel="noopener noreferrer" href="https://zulip.readthedocs.io/en/latest/translating/translating.html">{{> @partial-block}}</a>{{/inline}}
    {{/tr}}
</p>
<div class="default_language_modal_table">
    {{#each language_list}}
        <div class="language_block">
            <a class="language" data-code="{{this.code}}">
                {{#if this.selected}}
                <b>{{this.name_with_percent}}</b>
                {{else}}
                {{this.name_with_percent}}
                {{/if}}
            </a>
        </div>
    {{/each}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: demo_organization_add_email_modal.hbs]---
Location: zulip-main/web/templates/demo_organization_add_email_modal.hbs

```text
<form id="demo_organization_add_email_form">
    <div class="input-group">
        <label for="demo_organization_add_email" class="modal-field-label">{{t "Email" }}</label>
        <input id="demo_organization_add_email" type="text" name="email" class="modal_text_input" value="{{delivery_email}}" autocomplete="off" spellcheck="false" autofocus="autofocus"/>
    </div>
    <div class="input-group">
        <label for="demo_owner_email_address_visibility" class="modal-field-label">
            {{t "Who can access your email address"}}
            {{> help_link_widget link="/help/configure-email-visibility" }}
        </label>
        <select id="demo_owner_email_address_visibility" name="demo_owner_email_address_visibility" class="modal_select bootstrap-focus-style">
            {{#each email_address_visibility_values}}
                <option value="{{this.code}}">{{this.description}}</option>
            {{/each}}
        </select>
    </div>
    <div class="input-group">
        <label for="demo_organization_update_full_name" class="modal-field-label">{{t "Name" }}</label>
        <p id="demo-owner-update-email-field-hint">
            {{t "If you haven't updated your name, consider doing so before inviting others to join."}}
        </p>
        <input id="demo_organization_update_full_name" name="full_name" type="text" class="modal_text_input" value="{{full_name}}" maxlength="60" />
    </div>
</form>
```

--------------------------------------------------------------------------------

---[FILE: dialog_change_password.hbs]---
Location: zulip-main/web/templates/dialog_change_password.hbs

```text
<form id="change_password_container">
    <div class="settings-password-div">
        <label for="old_password" class="modal-field-label">{{t "Old password" }}</label>
        <div class="password-input-row">
            <input type="password" autocomplete="off" name="old_password" id="old_password" class="inline-block modal_password_input" value="" />
            <i class="fa fa-eye-slash password_visibility_toggle tippy-zulip-tooltip" role="button" tabindex="0"></i>
            <a href="/accounts/password/reset/" class="settings-forgot-password" target="_blank" rel="noopener noreferrer">{{t "Forgot it?" }}</a>
        </div>
    </div>
    <div class="settings-password-div">
        <label for="new_password" class="modal-field-label">{{t "New password" }}</label>
        <div class="password-input-row">
            <input type="password" autocomplete="new-password" name="new_password" id="new_password" class="inline-block modal_password_input" value=""
              data-min-length="{{password_min_length}}" data-min-guesses="{{password_min_guesses}}" data-max-length="{{ password_max_length }}" />
            <i class="fa fa-eye-slash password_visibility_toggle tippy-zulip-tooltip" role="button" tabindex="0"></i>
        </div>
        <div class="progress inline-block" id="pw_strength">
            <div class="bar bar-danger hide" style="width: 10%;"></div>
        </div>
    </div>
</form>
```

--------------------------------------------------------------------------------

---[FILE: dialog_widget.hbs]---
Location: zulip-main/web/templates/dialog_widget.hbs

```text
<div class="micromodal" id="{{modal_unique_id}}" aria-hidden="true">
    <div class="modal__overlay {{#unless close_on_overlay_click}}ignore-overlay-click{{/unless}}" tabindex="-1">
        <div {{#if id}}id="{{id}}" {{/if}}class="modal__container" role="dialog" aria-modal="true" aria-labelledby="dialog_title">
            <header class="modal__header">
                <h1 class="modal__title dialog_heading">
                    {{#if heading_html}}
                        {{{ heading_html }}}
                    {{else}}
                        {{ text_heading }}
                    {{/if}}
                    {{#if link}}
                    {{> help_link_widget . }}
                    {{/if}}
                </h1>
                <button class="modal__close" aria-label="{{t 'Close modal' }}" data-micromodal-close></button>
            </header>
            <main class="modal__content" data-simplebar data-simplebar-tab-index="-1" {{#if always_visible_scrollbar}}data-simplebar-auto-hide="false"{{/if}}>
                <div class="alert" id="dialog_error"></div>
                {{{ body_html }}}
            </main>
            <footer class="modal__footer">
                {{#if footer_minor_text }}
                <div class="dialog-widget-footer-minor-text">{{footer_minor_text}}</div>
                {{/if}}
                {{#unless single_footer_button}}
                <button class="modal__button dialog_exit_button" aria-label="{{t 'Close this dialog window' }}" data-micromodal-close>{{{ exit_button_html }}}</button>
                {{/unless}}
                <div class="dialog_submit_button_container">
                    <button class="modal__button dialog_submit_button"{{#if single_footer_button}} aria-label="{{t 'Close this dialog window' }}" data-micromodal-close{{/if}}>
                        <span class="submit-button-text">{{{ submit_button_html }}}</span>
                        <span class="modal__spinner"></span>
                    </button>
                </div>
            </footer>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

````
