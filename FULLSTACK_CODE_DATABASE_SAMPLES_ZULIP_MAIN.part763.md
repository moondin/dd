---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 763
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 763 of 1290)

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

---[FILE: topic_edit_form.hbs]---
Location: zulip-main/web/templates/topic_edit_form.hbs

```text
{{! Client-side Handlebars template for rendering the topic edit form. }}

<form class="topic_edit_form">
    <span class="topic_value_mirror hide"></span>
    <input type="text" value="" autocomplete="off" maxlength="{{ max_topic_length }}" class="inline_topic_edit header-v"/>
    {{#unless is_mandatory_topics}}
        <span class="inline-topic-edit-placeholder placeholder">
            {{> topic_not_mandatory_placeholder_text empty_string_topic_display_name=empty_string_topic_display_name}}
        </span>
    {{/unless}}
    <span class="topic-edit-save-wrapper">
        {{> components/action_button custom_classes="topic_edit_save tippy-zulip-delayed-tooltip" icon="check" attention="quiet" intent="neutral" data-tooltip-template-id="save-button-tooltip-template" }}
    </span>
    {{> components/action_button custom_classes="topic_edit_cancel tippy-zulip-delayed-tooltip" icon="circle-x" attention="borderless" intent="neutral" data-tooltip-template-id="cancel-button-tooltip-template" }}
    <div class="topic_edit_spinner"></div>
</form>
```

--------------------------------------------------------------------------------

---[FILE: topic_link.hbs]---
Location: zulip-main/web/templates/topic_link.hbs

```text
{{#if is_empty_string_topic}}
<a class="stream-topic" data-stream-id="{{channel_id}}" href="{{href}}">
    {{~!-- squash whitespace --~}}
    #{{channel_name}} &gt; <span class="empty-topic-display">{{topic_display_name}}</span>
    {{~!-- squash whitespace --~}}
</a>
{{~else}}
<a class="stream-topic" data-stream-id="{{channel_id}}" href="{{href}}">
    {{~!-- squash whitespace --~}}
    #{{channel_name}} &gt; {{topic_display_name}}
    {{~!-- squash whitespace --~}}
</a>
{{~/if}}
```

--------------------------------------------------------------------------------

---[FILE: topic_list_item.hbs]---
Location: zulip-main/web/templates/topic_list_item.hbs

```text
<li class="bottom_left_row {{#if is_active_topic}}active-sub-filter{{/if}} {{#if is_zero}}zero-topic-unreads{{/if}} {{#if is_muted}}muted_topic{{/if}} {{#if is_unmuted_or_followed}}unmuted_or_followed_topic{{/if}} topic-list-item" data-topic-name="{{topic_name}}">
    <a href="{{url}}" class="topic-box" draggable="false">
        <span class="sidebar-topic-check">
            {{topic_resolved_prefix}}
        </span>
        <span class="sidebar-topic-name">
            <span class="sidebar-topic-name-inner {{#if is_empty_string_topic}}empty-topic-display{{/if}}">{{topic_display_name}}</span>
        </span>
        <div class="topic-markers-and-unreads change_visibility_policy" data-stream-id="{{stream_id}}" data-topic-name="{{topic_name}}">
            {{#if contains_unread_mention}}
                <span class="unread_mention_info">
                    @
                </span>
            {{else if is_followed}}
                <i class="zulip-icon zulip-icon-follow visibility-policy-icon" role="button" aria-hidden="true" data-tippy-content="{{t 'You follow this topic.'}}"></i>
            {{/if}}
            <span class="unread_count normal-count {{#if is_zero}}zero_count{{/if}}">
                {{unread}}
            </span>
        </div>
        <span class="sidebar-menu-icon topic-sidebar-menu-icon">
            <i class="zulip-icon zulip-icon-more-vertical" aria-hidden="true"></i>
        </span>
    </a>
</li>
```

--------------------------------------------------------------------------------

---[FILE: topic_list_new_topic.hbs]---
Location: zulip-main/web/templates/topic_list_new_topic.hbs

```text
<li class="bottom_left_row topic-list-item">
    <a class="zoomed-new-topic" data-stream-id="{{stream_id}}" href="">
        <i class="topic-list-new-topic-icon zulip-icon zulip-icon-square-plus" aria-hidden="true"></i>
        <span class="new-topic-label">{{~t "NEW TOPIC" ~}}</span>
    </a>
</li>
```

--------------------------------------------------------------------------------

---[FILE: topic_muted.hbs]---
Location: zulip-main/web/templates/topic_muted.hbs

```text
{{#tr}}
    You have muted <z-stream-topic></z-stream-topic>.
    {{#*inline "z-stream-topic"}}<strong><span class="stream"></span> &gt; <span class="topic"></span></strong>{{/inline}}
{{/tr}}
```

--------------------------------------------------------------------------------

---[FILE: topic_not_mandatory_placeholder_text.hbs]---
Location: zulip-main/web/templates/topic_not_mandatory_placeholder_text.hbs

```text
{{#tr}}
    Enter a topic (skip for <z-empty-string-topic-display-name></z-empty-string-topic-display-name>)
    {{#*inline "z-empty-string-topic-display-name"}}<span class="empty-topic-display">{{empty_string_topic_display_name}}</span>{{/inline}}
{{/tr}}
```

--------------------------------------------------------------------------------

---[FILE: topic_summary.hbs]---
Location: zulip-main/web/templates/topic_summary.hbs

```text
<p>{{rendered_markdown summary_markdown}}</p>
```

--------------------------------------------------------------------------------

---[FILE: topic_typeahead_hint.hbs]---
Location: zulip-main/web/templates/topic_typeahead_hint.hbs

```text
{{#if can_create_new_topics_in_stream}}
<em>{{t 'Start a new topic or select one from the list.' }}</em>
{{else}}
<em>{{t 'Select a topic from the list.' }}</em>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: try_zulip_modal.hbs]---
Location: zulip-main/web/templates/try_zulip_modal.hbs

```text
<p>
    {{t "Explore how hundreds of community participants use Zulip to brainstorm ideas, discuss technical challenges, ask questions, and give feedback:" }}
</p>

<ul>
    <li>
        {{#tr}}
        You'll see a list of <z-highlight>recent conversations</z-highlight>, where each conversation is
        labeled with a topic by the person who started it. Click on a conversation to
        view it. You can always get back to recent conversations from the left sidebar.
        {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
        {{/tr}}
    </li>
    <li>
        {{#tr}}
        Click the name of a channel in the left sidebar, and click on any topic underneath
        to view one conversation at a time. You can explore discussions of changes to the
        design of the Zulip app in <z-highlight>#design</z-highlight>, or see ongoing issue
        investigations in <z-highlight>#issues</z-highlight>.
        {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
        {{/tr}}
    </li>
</ul>

<p>
    {{#tr}}
    If you have any questions, please post in the <z-highlight>#user questions</z-highlight> channel, and we'll be happy to help.
    {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
    {{/tr}}
</p>
```

--------------------------------------------------------------------------------

---[FILE: typeahead_list_item.hbs]---
Location: zulip-main/web/templates/typeahead_list_item.hbs

```text
{{#if is_emoji}}
    {{#if has_image}}
        <img class="emoji" src="{{ img_src }}" />
    {{else}}
        <span class='emoji emoji-{{ emoji_code }}'></span>
    {{/if}}
{{else if is_person}}
    {{#if has_image}}
    <div class="typeahead-image">
        <img class="typeahead-image-avatar" src="{{ img_src }}" />
        {{#if user_circle_class}}
        <span class="zulip-icon zulip-icon-{{user_circle_class}} {{user_circle_class}} user-circle"></span>
        {{/if}}
    </div>
    {{else}}
    <i class='typeahead-image zulip-icon zulip-icon-user-group'></i>
    {{/if}}
{{else if is_user_group}}
    <i class="typeahead-image zulip-icon zulip-icon-user-group" aria-hidden="true"></i>
{{/if}}
{{#if is_stream_topic}}
<div class="typeahead-text-container">
    <span role="button" class="zulip-icon zulip-icon-corner-down-right stream-to-topic-arrow"></span>
    <strong class="typeahead-strong-section{{#if is_empty_string_topic}} empty-topic-display{{/if}}">
        {{~ topic_display_name ~}}
    </strong>
</div>
{{else}}
{{!-- Separate container to ensure overflowing text remains in this container. --}}
<div class="typeahead-text-container{{#if has_secondary_html}} has_secondary_html{{/if}}">
    <strong class="typeahead-strong-section{{#if is_empty_string_topic}} empty-topic-display{{/if}}{{#if is_default_language}} default-language-display{{/if}}">
        {{~#if stream~}}
            {{~> inline_decorated_channel_name stream=stream ~}}
            {{~else~}}
            {{~ primary ~}}
        {{~/if~}}
    </strong>
    {{~#if is_bot}}
        <i class="zulip-icon zulip-icon-bot" aria-label="{{t 'Bot' }}"></i>
    {{/if}}
    {{~#if should_add_guest_user_indicator}}
        <i>({{t 'guest'}})</i>
    {{~/if}}
    {{~#if has_status}}
    {{> status_emoji status_emoji_info}}
    {{~/if}}
    {{~#if has_pronouns}}
        <span class="pronouns">{{pronouns}}{{#if (or has_secondary_html has_secondary)}},{{/if}}</span>
    {{~/if}}
    {{~#if has_secondary_html}}
    <span class="autocomplete_secondary rendered_markdown single-line-rendered-markdown">{{rendered_markdown secondary_html}}</span>
    {{~else if has_secondary}}
    <span class="autocomplete_secondary">
        {{~ secondary ~}}
    </span>
    {{~/if}}
</div>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: typing_notification.hbs]---
Location: zulip-main/web/templates/typing_notification.hbs

```text
<li data-email="{{this.email}}" class="typing_notification">{{t "{full_name} is typing…" }}</li>
```

--------------------------------------------------------------------------------

---[FILE: typing_notifications.hbs]---
Location: zulip-main/web/templates/typing_notifications.hbs

```text
{{! Typing notifications }}
<ul id="typing_notification_list">
    {{#if several_users}}
        <li class="typing_notification">{{t "Several people are typing…" }}</li>
    {{else}}
        {{#each users}}
            {{> typing_notification .}}
        {{/each}}
    {{/if}}
</ul>
```

--------------------------------------------------------------------------------

---[FILE: user_custom_profile_fields.hbs]---
Location: zulip-main/web/templates/user_custom_profile_fields.hbs

```text
{{#each profile_fields}}
    <li data-type="{{this.type}}" class="field-section custom_user_field" data-field-id="{{this.id}}">
        {{#unless ../for_user_card_popover}}
            <div class="name">{{this.name}}</div>
        {{/unless}}
        {{#if this.is_link}}
            <div class="custom-user-url-field">
                <a tabindex="0" href="{{this.value}}" target="_blank" rel="noopener noreferrer" class="value custom-profile-fields-link {{#if ../for_user_card_popover}}tippy-zulip-tooltip{{/if}}" data-tippy-content="{{this.name}}">{{this.value}}</a>
                <span tabindex="0" class="copy-button copy-custom-field-url tippy-zulip-tooltip" aria-label="{{t 'Copy URL' }}" data-tippy-content="{{t 'Copy URL' }}">
                    <i class="zulip-icon zulip-icon-copy" aria-hidden="true"></i>
                </span>
            </div>
        {{else if this.is_external_account}}
            <a tabindex="0" href="{{this.link}}" target="_blank" rel="noopener noreferrer" class="value custom-profile-fields-link {{#if ../for_user_card_popover}}tippy-zulip-tooltip{{/if}}" data-tippy-content="{{this.name}}">
                {{#if (eq this.subtype "github") }}
                <i class="fa fa-github" aria-hidden="true"></i>
                {{else if (eq this.subtype "twitter") }}
                <i class="fa fa-twitter" aria-hidden="true"></i>
                {{/if}}
                {{this.value}}
            </a>
        {{else if this.is_user_field}}
            <div class="user-type-custom-field-pill-container" data-field-id="{{this.id}}"></div>
        {{else}}
            {{#if this.rendered_value}}
            <span class="value rendered_markdown {{#if ../for_user_card_popover}}tippy-zulip-tooltip{{/if}}" data-tippy-content="{{this.name}}">{{rendered_markdown this.rendered_value}}</span>
            {{else}}
            <span class="value {{#if ../for_user_card_popover}}tippy-zulip-tooltip"{{/if}} data-tippy-content="{{this.name}}">{{this.value}}</span>
            {{/if}}
        {{/if}}
    </li>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: user_display_only_pill.hbs]---
Location: zulip-main/web/templates/user_display_only_pill.hbs

```text
<span class="pill-container display_only_pill {{#if is_inline}}inline_with_text_pill{{/if}}">
    <a data-user-id="{{user_id}}" class="view_user_profile pill" tabindex="0">
        {{#if img_src}}
        <img class="pill-image" src="{{img_src}}" />
        <span class="pill-image-border"></span>
        {{/if}}
        <span class="pill-label {{#if strikethrough}} strikethrough {{/if}}" >
            <span class="pill-value">{{display_value}}</span>
            {{#if is_current_user}}<span class="my_user_status">{{t '(you)'}}</span>{{/if}}
            {{~#if should_add_guest_user_indicator}}&nbsp;<i>({{t 'guest'}})</i>{{~/if~}}
            {{~#if deactivated}}&nbsp;({{t 'deactivated'}}){{~/if~}}
            {{~#if has_status~}}
            {{~> status_emoji status_emoji_info~}}
            {{~/if~}}
            {{#if is_bot}}
                <i class="zulip-icon zulip-icon-bot" aria-label="{{t 'Bot' }}"></i>
            {{/if}}
            {{#unless is_active}}
                <i class="fa fa-ban pill-deactivated deactivated-user-icon tippy-zulip-delayed-tooltip" data-tippy-content="{{#if is_bot}}{{t 'Bot is deactivated' }}{{else}}{{t 'User is deactivated' }}{{/if}}"></i>
            {{/unless}}
        </span>
    </a>
</span>
```

--------------------------------------------------------------------------------

---[FILE: user_full_name.hbs]---
Location: zulip-main/web/templates/user_full_name.hbs

```text
{{#if should_add_guest_user_indicator}}
<span class="user-name">{{name}}</span>&nbsp;<i class="guest-indicator">({{t 'guest' }})</i>
{{else}}
{{#if is_hidden}}<span class="user-name muted">{{t 'Muted user'}}</span>
{{else}}
<span class="user-name">{{name}}</span>
{{/if}}
{{/if}}
{{#if is_current_user}}&nbsp;<span class="my_user_status">{{t '(you)'}}</span>{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: user_group_display_only_pill.hbs]---
Location: zulip-main/web/templates/user_group_display_only_pill.hbs

```text
<span class="pill-container display_only_group_pill">
    <a data-user-group-id="{{group_id}}" class="view_user_group pill" tabindex="0">
        <i class="zulip-icon zulip-icon-user-group" aria-hidden="true"></i>
        <span class="pill-label {{#if strikethrough}} strikethrough {{/if}}" >
            <span class="pill-value">{{display_value}}</span>
        </span>
    </a>
</span>
```

--------------------------------------------------------------------------------

---[FILE: user_group_list_item.hbs]---
Location: zulip-main/web/templates/user_group_list_item.hbs

```text
<li class="group-list-item" role="presentation" data-group-id="{{group_id}}">
    <a class="user-profile-group-row hidden-remove-button-row" href="{{group_edit_url}}">
        <span class="user-group-name">
            {{name}}
        </span>
        {{#if can_remove_members }}
            <div class="remove-button-wrapper">
                {{#if is_direct_member}}
                    {{> components/icon_button icon="close" custom_classes="hidden-remove-button remove-member-button tippy-zulip-delayed-tooltip" intent="danger" aria-label=(t "Remove") data-tippy-content=(t "Remove") }}
                {{else}}
                    <span class="tippy-zulip-tooltip" data-tippy-content="{{#if is_me}}{{t 'You are a member of {name} because you are a member of a subgroup ({subgroups_name}).'}} {{else}}{{t 'This user is a member of {name} because they are a member of a subgroup ({subgroups_name}).'}}{{/if}}">
                        {{> components/icon_button icon="close" custom_classes="hidden-remove-button remove-member-button tippy-zulip-delayed-tooltip" intent="danger" aria-label=(t "Remove") data-tippy-content=(t "Remove") disabled="disabled" }}
                    </span>
                {{/if}}
            </div>
        {{/if}}
    </a>
</li>
```

--------------------------------------------------------------------------------

---[FILE: user_pill.hbs]---
Location: zulip-main/web/templates/user_pill.hbs

```text
<span class="user-pill pill-container pill-container-button">
    {{> input_pill user_pill_context }}
</span>
```

--------------------------------------------------------------------------------

---[FILE: user_profile_modal.hbs]---
Location: zulip-main/web/templates/user_profile_modal.hbs

```text
<div class="micromodal" id="user-profile-modal" data-user-id="{{user_id}}" aria-hidden="true">
    <div class="modal__overlay" tabindex="-1">
        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="dialog_title">
            <div class="modal__header">
                <h1 class="modal__title user-profile-name-heading" id="name">
                    {{#unless is_bot}}
                        {{#if is_active}}
                            <span class="tippy-zulip-tooltip user-status-icon-wrapper" data-tippy-content="{{last_seen}}">
                                <span class="zulip-icon zulip-icon-{{user_circle_class}} {{user_circle_class}} user-circle user_profile_presence" data-presence-indicator-user-id="{{user_id}}"></span>
                            </span>
                        {{else}}
                            <span>
                                <i class="fa fa-ban deactivated-user-icon tippy-zulip-tooltip" data-tippy-content="Deactivated user"></i>
                            </span>
                        {{/if}}
                    {{/unless}}
                    {{#if is_bot}}
                        <i class="zulip-icon zulip-icon-bot" aria-hidden="true"></i>
                    {{/if}}
                    <span class="user-profile-name">{{> user_full_name name=full_name}}</span>
                    <span class="user-profile-header-actions">
                        {{> components/icon_button custom_classes="copy-link-to-user-profile tippy-zulip-delayed-tooltip" icon="link-alt" intent="neutral" data-tippy-content=(t "Copy link to profile") aria-label=(t "Copy link to profile") }}
                        {{#if is_me}}
                            {{#if can_manage_profile}}
                                {{> components/icon_button custom_classes="user-profile-update-user-tab-button tippy-zulip-delayed-tooltip" icon="edit" intent="neutral" data-tippy-content=(t "Edit profile") aria-label=(t "Edit profile") }}
                            {{else}}
                                {{> components/icon_button custom_classes="user-profile-profile-settings-button tippy-zulip-delayed-tooltip" icon="edit" intent="neutral" data-tippy-content=(t "Edit profile") aria-label=(t "Edit profile") }}
                            {{/if}}
                        {{else if can_manage_profile}}
                            {{#if is_bot}}
                                {{> components/icon_button custom_classes="user-profile-update-user-tab-button tippy-zulip-delayed-tooltip" icon="edit" intent="neutral" data-tippy-content=(t "Manage bot") aria-label=(t "Manage bot") }}
                            {{else}}
                                {{> components/icon_button custom_classes="user-profile-update-user-tab-button tippy-zulip-delayed-tooltip" icon="edit" intent="neutral" data-tippy-content=(t "Manage user") aria-label=(t 'Manage user') }}
                            {{/if}}
                        {{/if}}
                    </span>
                </h1>
                <button class="modal__close" aria-label="{{t 'Close modal' }}" data-micromodal-close></button>
            </div>
            <div id="tab-toggle"></div>
            <main class="modal__body" id="body" data-simplebar data-simplebar-tab-index="-1" data-simplebar-auto-hide="false">
                <div class="tab-data">
                    <div class="tabcontent active" id="profile-tab">
                        <div class="top">
                            <div class="col-wrap col-left">
                                <div id="default-section">
                                    {{#if email}}
                                    <div id="email" class="default-field">
                                        <div class="name">{{t "Email" }}</div>
                                        <div class="value">{{email}}</div>
                                    </div>
                                    {{/if}}
                                    <div id="user-id" class="default-field">
                                        <div class="name">{{t "User ID" }}</div>
                                        <div class="value">{{user_id}}</div>
                                    </div>
                                    <div id="user-type" class="default-field">
                                        <div class="name">{{t "Role" }}</div>
                                        {{#if is_bot}}
                                            {{#if is_system_bot}}
                                            <div class="value">{{t "System bot" }}</div>
                                            {{else}}
                                            <div class="value">{{t "Bot" }}
                                                <span class="lowercase">({{user_type}})</span>
                                            </div>
                                            {{/if}}
                                        {{else}}
                                            <div class="value">{{user_type}}</div>
                                        {{/if}}
                                    </div>
                                    <div id="date-joined" class="default-field">
                                        <div class="name">{{t "Joined" }}</div>
                                        <div class="value">{{date_joined}}</div>
                                    </div>
                                    {{#if user_time}}
                                    <div class="default-field">
                                        <div class="name">{{t "Local time" }}</div>
                                        <div class="value">{{user_time}}</div>
                                    </div>
                                    {{/if}}
                                </div>
                            </div>
                            <div class="col-wrap col-right">
                                <div id="avatar" {{#if user_is_guest}} class="guest-avatar" {{/if}}
                                  style="background-image: url('{{user_avatar}}');">
                                </div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div id="content">
                                {{#if is_bot}}
                                    <div class="field-section">
                                        <div class="name">{{t "Bot type" }}</div>
                                        <div class="bot_info_value">{{bot_type}}</div>
                                    </div>
                                    {{#if bot_owner}}
                                    <div class="field-section bot_owner_user_field" data-field-id="{{bot_owner.user_id}}">
                                        <div class="name">{{t "Owner" }}</div>
                                        <div class="pill-container not-editable">
                                            <div class="input" contenteditable="false" style="display: none;"></div>
                                        </div>
                                    </div>
                                    {{/if}}
                                {{else}}
                                    {{> user_custom_profile_fields profile_fields=profile_data}}
                                {{/if}}
                            </div>
                        </div>
                    </div>

                    <div class="tabcontent" id="user-profile-streams-tab">
                        <div class="alert stream_list_info"></div>
                        <div class="stream-list-top-section">
                            <div class="header-section">
                                <h3 class="stream-tab-element-header">{{t 'Subscribed channels' }}</h3>
                            </div>
                            <div class="stream-list-container">
                                <div class="stream-search-container filter-input has-input-icon has-input-button input-element-wrapper">
                                    <i class="input-icon zulip-icon zulip-icon-search" aria-hidden="true"></i>
                                    <input type="text" class="input-element stream-search" placeholder="{{t 'Filter' }}" />
                                    <button type="button" class="input-button input-close-filter-button icon-button icon-button-square icon-button-neutral">
                                        <i class="zulip-icon zulip-icon-close" aria-hidden="true"></i>
                                    </button>
                                </div>
                                <div class="stream-list-loader"></div>
                                <div class="subscription-stream-list" data-simplebar data-simplebar-tab-index="-1">
                                    <ul class="user-stream-list" data-empty="{{t 'No channel subscriptions.' }}" data-search-results-empty="{{t 'No matching channels.' }}"></ul>
                                </div>
                            </div>
                        </div>
                        <div class="stream-list-bottom-section">
                            <div class="header-section">
                                <h3 class="stream-tab-element-header">{{t 'Subscribe {full_name} to channels'}}</h3>
                            </div>
                            {{> user_profile_subscribe_widget}}
                        </div>
                    </div>

                    <div class="tabcontent" id="user-profile-groups-tab">
                        <div class="alert user-profile-group-list-alert"></div>
                        <div class="group-list-top-section">
                            <div class="header-section">
                                <h3 class="group-tab-element-header">{{t 'Group membership' }}</h3>
                            </div>
                            <div class="group-list-container">
                                <div class="group-search-container filter-input has-input-icon has-input-button input-element-wrapper">
                                    <i class="input-icon zulip-icon zulip-icon-search"></i>
                                    <input type="text" class="input-element group-search" placeholder="{{t 'Filter' }}" />
                                    <button type="button" class="input-button input-close-filter-button icon-button icon-button-square icon-button-neutral">
                                        <i class="zulip-icon zulip-icon-close" aria-hidden="true"></i>
                                    </button>
                                </div>
                                <div class="subscription-group-list" data-simplebar data-simplebar-tab-index="-1">
                                    <ul class="user-group-list" data-empty="{{t 'Not a member of any groups.' }}" data-search-results-empty="{{t 'No matching user groups' }}"></ul>
                                </div>
                            </div>
                        </div>
                        <div class="group-list-bottom-section">
                            <div class="header-section">
                                <h3 class="group-tab-element-header">{{t 'Add {full_name} to groups'}}</h3>
                            </div>
                            <div id="groups-to-add" class="add-button-container">
                                <div id="user-group-to-add">
                                    <div class="add-user-group-container">
                                        <div class="pill-container">
                                            <div class="input" contenteditable="true"
                                              data-placeholder="{{t 'Add user groups' }}">
                                                {{~! Squash whitespace so that placeholder is displayed when empty. ~}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {{> components/action_button label=(t "Add") custom_classes="add-groups-button" attention="quiet" intent="brand" aria-label=(t "Add") }}
                            </div>
                        </div>
                    </div>
                    <div class="tabcontent" id="manage-profile-tab"></div>
                </div>
            </main>
            <div class="manage-profile-tab-footer">
                <footer class="modal__footer">
                    <div class="save-success"></div>
                    <button type="button" class="modal__button dialog_exit_button" aria-label="{{t 'Close this dialog window' }}" data-micromodal-close>{{t "Cancel" }}</button>
                    <button type="button" class="modal__button dialog_submit_button">
                        <span class="submit-button-text">{{t "Save changes"}}</span>
                        <span class="modal__spinner"></span>
                    </button>
                </footer>
            </div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: user_profile_subscribe_widget.hbs]---
Location: zulip-main/web/templates/user_profile_subscribe_widget.hbs

```text
<div class="user_profile_subscribe_widget">
    {{> dropdown_widget widget_name="user_profile_subscribe"}}
    {{> components/action_button label=(t "Subscribe") custom_classes="add-subscription-button" attention="quiet" intent="brand" aria-label=(t "Subscribe") }}
</div>
```

--------------------------------------------------------------------------------

---[FILE: user_topic_ui_row.hbs]---
Location: zulip-main/web/templates/user_topic_ui_row.hbs

```text
{{#with user_topic}}
<tr data-stream-id="{{stream_id}}" data-stream="{{stream}}" data-topic="{{topic}}" data-date-updated="{{date_updated_str}}" data-visibility-policy="{{visibility_policy}}">
    <td class="user-topic-stream">{{stream}}</td>
    <td class="white-space-preserve-wrap user-topic {{#if ../is_empty_string_topic}}empty-topic-display{{/if}}">{{../topic_display_name}}</td>
    <td>
        <select class="settings_user_topic_visibility_policy list_select bootstrap-focus-style" data-setting-widget-type="number">
            {{#each ../user_topic_visibility_policy_values}}
                <option value='{{this.code}}' {{#if (eq this.code ../visibility_policy)}}selected{{/if}}>{{this.description}}</option>
            {{/each}}
        </select>
    </td>
    <td class="topic_date_updated">{{date_updated_str}}</td>
</tr>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: user_with_status_icon.hbs]---
Location: zulip-main/web/templates/user_with_status_icon.hbs

```text
<span class="user_status_icon_wrapper">
    <span class="user-status-microlayout">
        <span class="user-name">{{name}}</span>
        {{~!-- --~}}
        {{~> status_emoji status_emoji_info ~}}
    </span>
    {{~!-- --~}}
</span>
{{~!-- --~}}
```

--------------------------------------------------------------------------------

---[FILE: view_bottom_loading_indicator.hbs]---
Location: zulip-main/web/templates/view_bottom_loading_indicator.hbs

```text
<div class="bottom-messages-logo">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 773.12 773.12">
        <circle cx="386.56" cy="386.56" r="386.56"/>
        <path d="M566.66 527.25c0 33.03-24.23 60.05-53.84 60.05H260.29c-29.61 0-53.84-27.02-53.84-60.05 0-20.22 9.09-38.2 22.93-49.09l134.37-120c2.5-2.14 5.74 1.31 3.94 4.19l-49.29 98.69c-1.38 2.76.41 6.16 3.25 6.16h191.18c29.61 0 53.83 27.03 53.83 60.05zm0-281.39c0 20.22-9.09 38.2-22.93 49.09l-134.37 120c-2.5 2.14-5.74-1.31-3.94-4.19l49.29-98.69c1.38-2.76-.41-6.16-3.25-6.16H260.29c-29.61 0-53.84-27.02-53.84-60.05s24.23-60.05 53.84-60.05h252.54c29.61 0 53.83 27.02 53.83 60.05z"/>
    </svg>
</div>
<div id="loading_more_indicator"></div>
```

--------------------------------------------------------------------------------

---[FILE: zulip_copy_icon.hbs]---
Location: zulip-main/web/templates/zulip_copy_icon.hbs

```text
<i class="zulip-icon zulip-icon-copy" aria-hidden="true"></i>
```

--------------------------------------------------------------------------------

---[FILE: section_header.hbs]---
Location: zulip-main/web/templates/buddy_list/section_header.hbs

```text
<i class="buddy-list-section-toggle zulip-icon zulip-icon-heading-triangle-right {{#if is_collapsed}}rotate-icon-right{{else}}rotate-icon-down{{/if}}" aria-hidden="true"></i>
<h5 id="{{id}}" class="buddy-list-heading no-style hidden-for-spectators">
    <span class="buddy-list-heading-text">{{header_text}}</span>
    {{!-- Hide the count until we have fetched data to display the correct count --}}
    <span class="buddy-list-heading-user-count-with-parens hide">
        (<span class="buddy-list-heading-user-count"></span>)
    </span>
</h5>
```

--------------------------------------------------------------------------------

---[FILE: title_tooltip.hbs]---
Location: zulip-main/web/templates/buddy_list/title_tooltip.hbs

```text
{{#tr}}
Filter {total_user_count, plural, =1 {1 person} other {# people}}
{{/tr}}
{{tooltip_hotkey_hints "W"}}
```

--------------------------------------------------------------------------------

---[FILE: view_all_subscribers.hbs]---
Location: zulip-main/web/templates/buddy_list/view_all_subscribers.hbs

```text
<a class="right-sidebar-wrappable-text-container" href="{{stream_edit_hash}}">
    <span class="right-sidebar-wrappable-text-inner">
        {{t "View all subscribers" }}
    </span>
</a>
```

--------------------------------------------------------------------------------

---[FILE: view_all_users.hbs]---
Location: zulip-main/web/templates/buddy_list/view_all_users.hbs

```text
<a class="right-sidebar-wrappable-text-container" href="#organization/users">
    <span class="right-sidebar-wrappable-text-inner">
        {{t "View all users" }}
    </span>
</a>
```

--------------------------------------------------------------------------------

---[FILE: action_button.hbs]---
Location: zulip-main/web/templates/components/action_button.hbs

```text
<button type="{{#if type}}{{type}}{{else}}button{{/if}}" {{#if id}}id="{{id}}"{{/if}} class="{{#if custom_classes}}{{custom_classes}} {{/if}}action-button action-button-{{attention}}-{{intent}} {{#if hidden}}hide{{/if}}" {{#if data-tippy-content}}data-tippy-content="{{data-tippy-content}}"{{/if}} {{#if data-tooltip-template-id}}data-tooltip-template-id="{{data-tooltip-template-id}}"{{/if}} tabindex="0" {{#if aria-label}}aria-label="{{aria-label}}"{{/if}}
  {{#if disabled}}disabled{{/if}}
  >
    {{#if icon}}
    <i class="zulip-icon zulip-icon-{{icon}}" aria-hidden="true"></i>
    {{/if}}
    {{#if label}}
    <span class="action-button-label">{{label}}</span>
    {{/if}}
</button>
```

--------------------------------------------------------------------------------

---[FILE: banner.hbs]---
Location: zulip-main/web/templates/components/banner.hbs

```text
<div {{#if process}}data-process="{{process}}"{{/if}} class="{{#if custom_classes}}{{custom_classes}} {{/if}}banner banner-{{intent}}">
    <span class="banner-content">
        <span class="banner-label">
            {{#if label}}
                {{label}}
            {{else}}
                {{> @partial-block .}}
            {{/if}}
        </span>
        {{#if buttons}}
            <span class="banner-action-buttons">
                {{!-- squash whitespace so :empty selector works when no buttons --}}
                {{~!-- squash whitespace --~}}
                {{#each buttons}}
                    {{#if this.intent}}
                        {{> action_button .}}
                    {{else}}
                        {{> action_button . intent=../intent}}
                    {{/if}}
                {{/each}}
                {{~!-- squash whitespace --~}}
            </span>
        {{/if}}
    </span>
    {{#if close_button}}
        {{> icon_button custom_classes="banner-close-action banner-close-button" icon="close" intent=intent}}
    {{/if}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: icon_button.hbs]---
Location: zulip-main/web/templates/components/icon_button.hbs

```text
<button type="button" {{#if id}}id="{{id}}"{{/if}} class="{{#if custom_classes}}{{custom_classes}} {{/if}}icon-button {{#if squared}}icon-button-square {{/if}}icon-button-{{intent}} {{#if hidden}}hide{{/if}}" {{#if data-tooltip-template-id}}data-tooltip-template-id="{{data-tooltip-template-id}}"{{/if}} tabindex="0" {{#if aria-label}}aria-label="{{aria-label}}"{{/if}}
  {{#if data-tippy-content}}data-tippy-content="{{data-tippy-content}}"{{/if}}
  {{#if disabled}}disabled{{/if}}
  >
    <i class="zulip-icon zulip-icon-{{icon}}" aria-hidden="true"></i>
</button>
```

--------------------------------------------------------------------------------

---[FILE: input_wrapper.hbs]---
Location: zulip-main/web/templates/components/input_wrapper.hbs

```text
<div {{#if id}}id="{{id}}"{{/if}} class="input-element-wrapper{{#if input_type}} {{input_type}}{{/if}}{{#if custom_classes}} {{custom_classes}}{{/if}}{{#if icon}} has-input-icon{{/if}}{{#if input_button_icon}} has-input-button{{/if}}">
    {{#if icon}}
        <i class="input-icon zulip-icon zulip-icon-{{icon}}" aria-hidden="true"></i>
    {{/if}}
    {{> @partial-block .}}
    {{#if input_button_icon}}
        {{#if (eq input_type "filter-input") }}
            {{> icon_button custom_classes="input-button input-close-filter-button" squared=true icon=input_button_icon intent="neutral" }}
        {{else}}
            {{> icon_button custom_classes="input-button" squared=true icon=input_button_icon intent="neutral" }}
        {{/if}}
    {{/if}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: membership_banner.hbs]---
Location: zulip-main/web/templates/components/membership_banner.hbs

```text
{{#> banner .}}
    {{> ../user_group_settings/user_group_membership_request_result .}}
{{/banner}}
```

--------------------------------------------------------------------------------

---[FILE: subscription_banner.hbs]---
Location: zulip-main/web/templates/components/subscription_banner.hbs

```text
{{#> banner .}}
    {{> ../stream_settings/stream_subscription_request_result .}}
{{/banner}}
```

--------------------------------------------------------------------------------

---[FILE: filter_input.hbs]---
Location: zulip-main/web/templates/components/showroom/filter_input.hbs

```text
{{#> input_wrapper input_type="filter-input" icon="search" input_button_icon="close"}}
    <input class="input-element" type="text" placeholder="{{t 'Filter component' }}" />
{{/input_wrapper}}
```

--------------------------------------------------------------------------------

````
