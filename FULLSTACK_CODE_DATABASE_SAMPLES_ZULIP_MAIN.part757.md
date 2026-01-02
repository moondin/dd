---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 757
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 757 of 1290)

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

---[FILE: draft.hbs]---
Location: zulip-main/web/templates/draft.hbs

```text
<div class="draft-message-row overlay-message-row" data-draft-id="{{draft_id}}">
    <div class="draft-message-info-box overlay-message-info-box" tabindex="0">
        {{#if is_stream}}
        <div class="message_header message_header_stream restore-overlay-message overlay-message-header">
            <div class="message-header-contents" style="background: {{recipient_bar_color}};">
                <div class="message_label_clickable stream_label">
                    <span class="stream-privacy-modified-color-{{stream_id}} stream-privacy filter-icon"  style="color: {{stream_privacy_icon_color}}">
                        {{> stream_privacy .}}
                    </span>
                    {{#if stream_name}}
                        {{stream_name}}
                    {{else}}
                        <span class="drafts-unknown-msg-header-field">{{t "No channel selected" }}</span>
                    {{/if}}
                </div>
                <span class="stream_topic_separator"><i class="zulip-icon zulip-icon-chevron-right"></i></span>
                <span class="stream_topic">
                    <span class="message_label_clickable narrows_by_topic">
                        <span class="stream-topic-inner {{#if is_empty_string_topic}}empty-topic-display{{/if}}">{{topic_display_name}}</span>
                    </span>
                </span>
                <span class="recipient_bar_controls"></span>
                <div class="recipient_row_date">{{ time_stamp }}</div>
            </div>
        </div>
        {{else}}
        <div class="message_header message_header_private_message restore-overlay-message overlay-message-header">
            <div class="message-header-contents">
                <div class="message_label_clickable stream_label">
                    <span class="private_message_header_icon"><i class="zulip-icon zulip-icon-user"></i></span>
                    {{#if is_dm_with_self}}
                    <span class="private_message_header_name">{{t "You" }}</span>
                    {{else}}
                    {{#if has_recipient_data}}
                    <span class="private_message_header_name">{{t "You and {recipients}" }}</span>
                    {{else}}
                    <span class="drafts-unknown-msg-header-field">{{t "No DM recipients" }}</span>
                    {{/if}}
                    {{/if}}
                </div>
                <div class="recipient_row_date">{{ time_stamp }}</div>
            </div>
        </div>
        {{/if}}
        <div class="message_row{{#unless is_stream}} private-message{{/unless}}" role="listitem">
            <div class="messagebox">
                <div class="messagebox-content">
                    <div class="message_top_line">
                        <div class="overlay_message_controls">
                            <span class="copy-button copy-overlay-message tippy-zulip-delayed-tooltip" data-draft-id="{{draft_id}}" data-tippy-content="{{t 'Copy draft' }}" aria-label="{{t 'Copy draft' }}" role="button">
                                <i class="zulip-icon zulip-icon-copy" aria-hidden="true"></i>
                            </span>
                            {{> ./components/icon_button intent="danger" custom_classes="delete-overlay-message tippy-zulip-delayed-tooltip" icon="trash" data-tooltip-template-id="delete-draft-tooltip-template" aria-label=(t "Delete") }}
                            <div class="draft-selection-tooltip">
                                <i class="fa fa-square-o fa-lg draft-selection-checkbox" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                    <div class="message_content rendered_markdown restore-overlay-message">{{rendered_markdown content}}</div>
                </div>
            </div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: drafts_list.hbs]---
Location: zulip-main/web/templates/drafts_list.hbs

```text
<div class="drafts-list overlay-messages-list" data-simplebar data-simplebar-tab-index="-1">
    <div class="no-drafts no-overlay-messages">
        {{t 'No drafts.'}}
    </div>

    <div id="drafts-from-conversation">
        <h2>{{narrow_drafts_header}}</h2>
        {{#each narrow_drafts}}
            {{> draft .}}
        {{/each}}
    </div>
    <div id="other-drafts">
        <h2 id="other-drafts-header">{{t "Other drafts" }}</h2>
        {{#each other_drafts}}
            {{> draft .}}
        {{/each}}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: drafts_tooltip.hbs]---
Location: zulip-main/web/templates/drafts_tooltip.hbs

```text
<div>
    <div>{{t "View drafts"}}</div>
    {{#if draft_count_msg}}
        <div class="tooltip-inner-content italic">{{draft_count_msg}}</div>
    {{/if}}
</div>
{{tooltip_hotkey_hints "D"}}
```

--------------------------------------------------------------------------------

---[FILE: draft_table_body.hbs]---
Location: zulip-main/web/templates/draft_table_body.hbs

```text
<div id="draft_overlay" class="overlay" data-overlay="drafts">
    <div class="flex overlay-content">
        <div class="drafts-container overlay-messages-container overlay-container">
            <div class="overlay-messages-header">
                <h1>{{t 'Drafts' }}</h1>
                <div class="exit">
                    <span class="exit-sign">&times;</span>
                </div>
                <div id="draft_overlay_banner_container" class="banner-container banner-wrapper"></div>
                <div class="header-body">
                    <div class="drafts-header-note">
                        <div class="overlay-keyboard-shortcuts">
                            {{#tr}}
                                To restore a draft, click on it or press <z-shortcut></z-shortcut>.
                                {{#*inline "z-shortcut"}}{{popover_hotkey_hints "Enter"}}{{/inline}}
                            {{/tr}}
                        </div>
                        <div>{{t "Drafts are not synced to other devices and browsers." }}</div>
                    </div>
                    <div class="delete-drafts-group">
                        <div class="delete-selected-drafts-button-container">
                            {{> ./components/icon_button intent="danger" custom_classes="delete-selected-drafts-button" icon="trash" disabled=true  }}
                        </div>
                        <button class="action-button action-button-quiet-neutral select-drafts-button" role="checkbox" aria-checked="false">
                            <span>{{t "Select all drafts" }}</span>
                            <i class="fa fa-square-o select-state-indicator" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
            {{> drafts_list context }}
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: dropdown_current_value_not_in_options.hbs]---
Location: zulip-main/web/templates/dropdown_current_value_not_in_options.hbs

```text
<span class="dropdown-current-value-not-in-options">{{name}}</span>
```

--------------------------------------------------------------------------------

---[FILE: dropdown_disabled_state.hbs]---
Location: zulip-main/web/templates/dropdown_disabled_state.hbs

```text
<span class="setting-disabled-option">{{name}}</span>
```

--------------------------------------------------------------------------------

---[FILE: dropdown_list.hbs]---
Location: zulip-main/web/templates/dropdown_list.hbs

```text
{{#with item}}
    <li class="list-item {{#if is_current_user_setting}}current_user_setting{{/if}}" role="presentation" data-unique-id="{{unique_id}}" data-name="{{name}}" tabindex="0">
        {{#if description}}
        <a class="dropdown-list-item-common-styles">
            <span class="dropdown-list-item-name">
                {{#if bold_current_selection}}
                    <span class="dropdown-list-text-selected">{{name}}</span>
                    {{# if (or has_edit_icon has_delete_icon)}}
                    <span class="dropdown-list-buttons">
                        {{#if has_edit_icon}}
                            {{> components/icon_button custom_classes="dropdown-list-edit dropdown-list-control-button" intent="neutral" icon="edit" aria-label=edit_icon_label }}
                        {{/if}}
                        {{#if has_manage_folder_icon}}
                            {{> components/icon_button custom_classes="dropdown-list-manage-folder dropdown-list-control-button" intent="neutral" icon="folder-cog" aria-label=manage_folder_icon_label }}
                        {{/if}}
                        {{#if has_delete_icon}}
                            {{> components/icon_button custom_classes="dropdown-list-delete dropdown-list-control-button" intent="danger" icon="trash" aria-label=delete_icon_label }}
                        {{/if}}
                    </span>
                    {{/if}}
                {{else}}
                    <span class="dropdown-list-text-neutral">{{name}}</span>
                {{/if}}
            </span>
            <span class="dropdown-list-item-description line-clamp">
                {{description}}
            </span>
        </a>
        {{else}}
        <a class="dropdown-list-item-common-styles {{#if is_setting_disabled}}setting-disabled-option{{/if}}">
            {{#if stream}}
                {{> inline_decorated_channel_name stream=stream show_colored_icon=true}}
            {{else if is_direct_message}}
                <i class="zulip-icon zulip-icon-users channel-privacy-type-icon"></i> <span class="decorated-dm-name">{{name}}</span>
            {{else if is_setting_disabled}}
                {{#if show_disabled_icon}}
                    <i class="setting-disabled-option-icon zulip-icon zulip-icon-deactivated-circle" aria-hidden="true"></i>
                {{/if}}
                {{#if show_disabled_option_name}}
                    <span class="setting-disabled-option-text dropdown-list-text-neutral">{{name}}</span>
                {{else}}
                    <span class="setting-disabled-option-text dropdown-list-text-neutral">{{t "Disable" }}</span>
                {{/if}}
            {{else if (eq unique_id -2)}}
                {{!-- This is the option for PresetUrlOption.CHANNEL_MAPPING --}}
                <i class="zulip-icon zulip-icon-hashtag channel-privacy-type-icon" aria-hidden="true"></i> <span class="dropdown-list-text-neutral">{{name}}</span>
            {{else}}
                <span class="dropdown-list-item-name">
                    {{#if bold_current_selection}}
                        <span class="dropdown-list-text-selected">{{name}}</span>
                    {{else}}
                        <span class="dropdown-list-text-neutral">{{name}}</span>
                    {{/if}}
                    {{# if (or has_edit_icon has_delete_icon)}}
                    <span class="dropdown-list-buttons">
                        {{#if has_edit_icon}}
                            {{> components/icon_button custom_classes="dropdown-list-edit dropdown-list-control-button" intent="neutral" icon="edit" aria-label=(t "Edit folder") }}
                        {{/if}}
                        {{#if has_manage_folder_icon}}
                            {{> components/icon_button custom_classes="dropdown-list-manage-folder dropdown-list-control-button" intent="neutral" icon="folder-cog" aria-label=manage_folder_icon_label }}
                        {{/if}}
                        {{#if has_delete_icon}}
                            {{> components/icon_button custom_classes="dropdown-list-delete dropdown-list-control-button" intent="danger" icon="trash" aria-label=(t "Delete folder") }}
                        {{/if}}
                    </span>
                    {{/if}}
                </span>
            {{/if}}
        </a>
        {{/if}}
    </li>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: dropdown_list_container.hbs]---
Location: zulip-main/web/templates/dropdown_list_container.hbs

```text
<div class="dropdown-list-container {{widget_name}}-dropdown-list-container">
    <div class="dropdown-list-search popover-filter-input-wrapper">
        <input class="dropdown-list-search-input popover-filter-input filter_text_input{{#if hide_search_box}} hide{{/if}}" type="text" placeholder="{{t 'Filter' }}" autofocus/>
    </div>
    <div class="dropdown-list-wrapper" data-simplebar data-simplebar-tab-index="-1">
        <ul class="dropdown-list"></ul>
    </div>
    <div class="no-dropdown-items dropdown-list-item-common-styles">
        {{t 'No matching results'}}
    </div>
    {{#if sticky_bottom_option}}
    <button class="sticky-bottom-option-button">
        {{sticky_bottom_option}}
    </button>
    {{/if}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: dropdown_widget.hbs]---
Location: zulip-main/web/templates/dropdown_widget.hbs

```text
<button id="{{widget_name}}_widget" class="dropdown-widget-button {{#if custom_classes}}{{custom_classes}}{{/if}}" type="button" {{#if is_setting_disabled}}disabled{{/if}} {{#if disable_keyboard_focus}}tabindex="-1"{{/if}} name="{{widget_name}}">
    <span class="dropdown_widget_value">{{#if default_text}}{{default_text}}{{/if}}</span>
    <i class="zulip-icon zulip-icon-chevron-down"></i>
</button>
```

--------------------------------------------------------------------------------

---[FILE: dropdown_widget_with_label.hbs]---
Location: zulip-main/web/templates/dropdown_widget_with_label.hbs

```text
<div class="input-group" id="{{widget_name}}_widget_container">
    <label class="settings-field-label" for="{{widget_name}}_widget">{{label}}
        {{#if help_link}}{{> help_link_widget link=help_link }}{{/if}}
    </label>
    <span class="prop-element hide" id="id_{{widget_name}}" data-setting-widget-type="dropdown-list-widget" {{#if value_type}}data-setting-value-type="{{value_type}}"{{/if}}></span>
    <div class="dropdown_widget_with_label_wrapper">
        {{> dropdown_widget .}}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: dropdown_widget_wrapper.hbs]---
Location: zulip-main/web/templates/dropdown_widget_wrapper.hbs

```text
<div id="{{widget_name}}_widget_wrapper" tabindex="0">
    {{> dropdown_widget . disable_keyboard_focus="true"}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: edited_notice.hbs]---
Location: zulip-main/web/templates/edited_notice.hbs

```text
<div class="edit-notifications"></div>
{{#if modified}}
    {{#if msg/local_edit_timestamp}}
        <div class="message_edit_notice">
            {{t "SAVING"}}
        </div>
    {{else if edited}}
        <div class="message_edit_notice">
            {{t "EDITED"}}
        </div>
    {{else}}
        <div class="message_edit_notice">
            {{t "MOVED"}}
        </div>
    {{/if}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: editing_notifications.hbs]---
Location: zulip-main/web/templates/editing_notifications.hbs

```text
<div class="message-editing-animation">
    <span class="y-animated-dot"></span>
    <span class="y-animated-dot"></span>
    <span class="y-animated-dot"></span>
</div>
```

--------------------------------------------------------------------------------

---[FILE: edit_saved_snippet_modal.hbs]---
Location: zulip-main/web/templates/edit_saved_snippet_modal.hbs

```text
<div id="edit-saved-snippet-modal">
    <form id="edit-saved-snippet-form">
        <label for="title" class="modal-field-label">{{t "Title" }}</label>
        <input id="edit-saved-snippet-title" type="text" name="title" class="modal_text_input saved-snippet-title" value="{{title}}" autocomplete="off" spellcheck="false" autofocus="autofocus"/>
        <div>{{t "Content" }}</div>
        <textarea class="modal-textarea saved-snippet-content" rows="4">
            {{~content~}}
        </textarea>
    </form>
</div>
```

--------------------------------------------------------------------------------

---[FILE: embedded_bot_config_item.hbs]---
Location: zulip-main/web/templates/embedded_bot_config_item.hbs

```text
<div class="input-group" name="{{botname}}" id="{{botname}}_{{key}}">
    <label for="{{botname}}_{{key}}_input" class="modal-field-label">{{key}}</label>
    <input type="text" name="{{key}}" id="{{botname}}_{{key}}_input" class="modal_text_input"
      maxlength=1000 placeholder="{{value}}" value="" />
</div>
```

--------------------------------------------------------------------------------

---[FILE: empty_feed_notice.hbs]---
Location: zulip-main/web/templates/empty_feed_notice.hbs

```text
<div class="empty_feed_notice">
    <h4 class="empty-feed-notice-title"> {{ title }} </h4>
    {{#if search_data}}
        {{#if search_data.has_stop_word}}
        <div class="empty-feed-notice-description">
            {{t "Common words were excluded from your search:" }} <br/>
            {{#each search_data.query_words}}
                {{#if is_stop_word}}
                <del>{{query_word}}</del>
                {{else}}
                <span class="search-query-word">{{query_word}}</span>
                {{/if}}
            {{/each}}
        </div>
        {{/if}}
    {{else if notice_html}}
        <div class="empty-feed-notice-description">
            {{{ notice_html }}}
        </div>
    {{/if}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: empty_list_widget_for_list.hbs]---
Location: zulip-main/web/templates/empty_list_widget_for_list.hbs

```text
<li class="empty-list-message">{{empty_list_message}}</li>
```

--------------------------------------------------------------------------------

---[FILE: empty_list_widget_for_table.hbs]---
Location: zulip-main/web/templates/empty_list_widget_for_table.hbs

```text
<tr>
    <td class="empty-table-message" colspan="{{column_count}}">
        {{empty_list_message}}
    </td>
</tr>
```

--------------------------------------------------------------------------------

---[FILE: export_modal_warning_notes.hbs]---
Location: zulip-main/web/templates/export_modal_warning_notes.hbs

```text
{{#if unusable_user_count}}
    <p>
        {{#tr}}
            You don't have permission to <z-help-link>access</z-help-link> the
            email {unusable_user_count, plural, one {address} other {addresses}}
            of {unusable_user_count, plural, one {# user} other {# users}}.
            {{#*inline "z-help-link"}}
                <a target="_blank" rel="noopener noreferrer"
                  href="#/help/configure-email-visibility">
                    {{> @partial-block}}
                </a>
            {{/inline}}
        {{/tr}}

        {{#tr}}
            Accounts for users whose emails you can't access will be created
            with placeholder email addresses. A placeholder email must be
            updated by an administrator for the user to be able to log in.
        {{/tr}}
    </p>

    {{#if unusable_admin_user_count}}
        <p>
            {{#tr}}
                The following {unusable_admin_user_count, plural, one
                {administrator} other {administrators}} will be unable to
                log in: <z-user-pills></z-user-pills>

                {{#*inline "z-user-pills"}}
                    {{#each unusable_admin_users}}
                        {{> ./user_display_only_pill
                          user_id= this.user_id
                          display_value= this.full_name
                          img_src= this.avatar_url
                          is_active= true
                          }}
                        {{#unless @last}}, {{/unless}}
                    {{/each}}
                {{/inline}}
            {{/tr}}
        </p>
    {{/if}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: favicon.svg.hbs]---
Location: zulip-main/web/templates/favicon.svg.hbs

```text
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <style>
        @font-face {
        font-family: 'Source Sans 3';
        font-style: normal;
        font-weight: 700;
        src: url({{{favicon_font_url_html}}}) format('truetype');
        }
    </style>
    <linearGradient id="a" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#50adff" />
        <stop offset="1" stop-color="#7877fc" />
    </linearGradient>
    <path d="M688.52 150.67c0 33.91-15.23 64.04-38.44 82.31L424.79 434.17c-4.18 3.59-9.62-2.19-6.61-7.03l82.64-165.46c2.31-4.63-.69-10.33-5.44-10.33H174.86c-49.64 0-90.26-45.31-90.26-100.68 0-55.37 40.62-100.68 90.26-100.68h423.39c49.65 0 90.27 45.31 90.27 100.68zM174.86 723.13h423.39c49.64 0 90.26-45.31 90.26-100.68 0-55.37-40.62-100.68-90.26-100.68H277.73c-4.75 0-7.76-5.7-5.44-10.33l82.64-165.46c3.01-4.83-2.42-10.62-6.61-7.03L123.04 540.14c-23.21 18.27-38.44 48.4-38.44 82.31 0 55.37 40.62 100.68 90.26 100.68z" fill="url(#a)" transform="translate(8 8) scale(0.023769201057729446) translate(-386.56 -386.56)" />
    <text x="15" y="15" text-anchor="end"
      font-family="'Source Sans 3'" font-weight="bold" letter-spacing="-0.5"
      fill="white" stroke="white" stroke-width="2" stroke-linejoin="round" opacity=".5"
      {{#if count_long}}font-size="9" textLength="14" lengthAdjust="spacingAndGlyphs"{{else}}font-size="11"{{/if}}>
        {{count}}
    </text>
    <text x="15" y="15" text-anchor="end"
      font-family="'Source Sans 3'" font-weight="bold" letter-spacing="-0.5"
      {{#if count_long}}font-size="9" textLength="14" lengthAdjust="spacingAndGlyphs"{{else}}font-size="11"{{/if}}>
        {{count}}
    </text>
    {{#if have_pm}}
    <circle cx="14" cy="4" r="2" fill="#f00" />
    {{/if}}
</svg>
```

--------------------------------------------------------------------------------

---[FILE: feedback_container.hbs]---
Location: zulip-main/web/templates/feedback_container.hbs

```text
<div id="feedback-container-content-wrapper">
    <div class="float-header">
        <h3 class="light no-margin small-line-height float-left feedback_title"></h3>
        <div class="feedback-button-container">
            {{#if has_undo_button}}
                {{> components/action_button intent="neutral" attention="quiet" custom_classes="feedback_undo"}}
            {{/if}}
            {{> ./components/icon_button intent="neutral" custom_classes="exit-me" icon="close"}}
        </div>
        <div class="float-clear"></div>
    </div>
    <p class="n-margin feedback_content"></p>
</div>
```

--------------------------------------------------------------------------------

---[FILE: filter_topics.hbs]---
Location: zulip-main/web/templates/filter_topics.hbs

```text
<div class="left-sidebar-filter-input-container">
    {{#> input_wrapper input_type="filter-input" custom_classes="topic_search_section filter-topics has-input-pills" icon="search" input_button_icon="close"}}
        <div class="input-element home-page-input pill-container" id="left-sidebar-filter-topic-input">
            <div class="input" contenteditable="true" id="topic_filter_query" data-placeholder="{{t 'Filter topics' }}"></div>
        </div>
    {{/input_wrapper}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: gif_picker_ui.hbs]---
Location: zulip-main/web/templates/gif_picker_ui.hbs

```text
<div class="gif-grid-in-popover">
    <div class="arrow"></div>
    <div class="popover-inner">
        <div class="popover-filter-input-wrapper">
            {{#if is_giphy}}
                <input type="text" id="gif-search-query" class="popover-filter-input filter_text_input" autocomplete="off" placeholder="{{t 'Filter' }}" autofocus/>
            {{else}}
                <input type="text" id="gif-search-query" class="popover-filter-input filter_text_input" autocomplete="off" placeholder="{{t 'Search Tenor' }}" autofocus/>
            {{/if}}
            <button type="button" class="clear-search-button" id="gif-search-clear" tabindex="-1">
                <i class="zulip-icon zulip-icon-close" aria-hidden="true"></i>
            </button>
        </div>
        <div class="gif-scrolling-container" data-simplebar data-simplebar-tab-index="-1">
            {{! We need a container we can replace
            without removing the simplebar wrappers.
            We replace the `giphy-content`/`tenor-content` when
            searching for GIFs. }}
            {{#if is_giphy}}
                <div class="giphy-content"></div>
            {{else}}
                <div class="tenor-content"></div>
            {{/if}}
        </div>
        {{!-- We are required to include the
        "Powered By GIPHY" banner, which isn't mandatory
        for Tenor. So we avoid including one for Tenor
        to save space. --}}
        {{#if is_giphy}}
            <div class="popover-footer">
                <img src="../images/giphy/GIPHY_attribution.png" alt="{{t 'GIPHY attribution' }}" />
            </div>
        {{/if}}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: go_to_channel_feed_tooltip.hbs]---
Location: zulip-main/web/templates/go_to_channel_feed_tooltip.hbs

```text
<div>{{t "Go to channel feed"}}</div>
{{tooltip_hotkey_hints "s"}}
```

--------------------------------------------------------------------------------

---[FILE: go_to_channel_list_of_topics_tooltip.hbs]---
Location: zulip-main/web/templates/go_to_channel_list_of_topics_tooltip.hbs

```text
<div>{{t "Go to list of topics"}}</div>
{{tooltip_hotkey_hints "Y"}}
```

--------------------------------------------------------------------------------

---[FILE: guest_visible_users_message.hbs]---
Location: zulip-main/web/templates/guest_visible_users_message.hbs

```text
<p id="guest_visible_users_message">
    {{#tr}}
        Guests will be able to see <z-user-count></z-user-count> users in their channels when they join.
        {{#*inline "z-user-count"}}
        <span class="guest-visible-users-count" aria-hidden="true"></span>
        <span class="guest_visible_users_loading"></span>
        {{/inline}}
    {{/tr}}
    {{> help_link_widget link="/help/guest-users#configure-whether-guests-can-see-all-other-users" }}
</p>
```

--------------------------------------------------------------------------------

---[FILE: help_link_widget.hbs]---
Location: zulip-main/web/templates/help_link_widget.hbs

```text
<a class="help_link_widget" href="{{ link }}" target="_blank" rel="noopener noreferrer">
    <i class="fa fa-question-circle-o" aria-hidden="true"></i>
</a>
```

--------------------------------------------------------------------------------

---[FILE: image_editor_modal.hbs]---
Location: zulip-main/web/templates/image_editor_modal.hbs

```text
<div class="loading-placeholder"></div>
<div class="image-cropper-container"></div>
```

--------------------------------------------------------------------------------

---[FILE: information_density_update_button_tooltip.hbs]---
Location: zulip-main/web/templates/information_density_update_button_tooltip.hbs

```text
<div id="information_density_tooltip_template">
    <div class="tooltip-inner-content">
        <span>
            {{tooltip_first_line}}
            {{#if tooltip_second_line}}
            <br />
            <i>{{tooltip_second_line}}</i>
            {{/if}}
        </span>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: inline_decorated_channel_name.hbs]---
Location: zulip-main/web/templates/inline_decorated_channel_name.hbs

```text
{{! This controls whether the swatch next to streams in the left sidebar has a lock icon. }}
{{~#if stream.is_archived ~}}
<i class="zulip-icon zulip-icon-archive channel-privacy-type-icon" {{#if show_colored_icon}}style="color: {{stream.color}}"{{/if}} aria-hidden="true"></i> <span class="decorated-channel-name">{{stream.name ~}}</span>
{{~ else if stream.invite_only ~}}
<i class="zulip-icon zulip-icon-lock channel-privacy-type-icon" {{#if show_colored_icon}}style="color: {{stream.color}}"{{/if}} aria-hidden="true"></i> <span class="decorated-channel-name">{{stream.name ~}}</span>
{{~ else if stream.is_web_public ~}}
<i class="zulip-icon zulip-icon-globe channel-privacy-type-icon" {{#if show_colored_icon}}style="color: {{stream.color}}"{{/if}} aria-hidden="true"></i> <span class="decorated-channel-name">{{stream.name ~}}</span>
{{~ else ~}}
<i class="zulip-icon zulip-icon-hashtag channel-privacy-type-icon" {{#if show_colored_icon}}style="color: {{stream.color}}"{{/if}} aria-hidden="true"></i> <span class="decorated-channel-name">{{stream.name ~}}</span>
{{~/if~}}
```

--------------------------------------------------------------------------------

---[FILE: inline_stream_or_topic_reference.hbs]---
Location: zulip-main/web/templates/inline_stream_or_topic_reference.hbs

```text
<span class="stream-or-topic-reference">
    {{~#if stream~}}
        {{> inline_decorated_channel_name stream=stream show_colored_icon=show_colored_icon}}
        {{#if topic_display_name~}} &gt; {{/if}}
    {{~/if~}}
    <span {{#if is_empty_string_topic}}class="empty-topic-display"{{/if}}>{{~ topic_display_name ~}}</span>
</span>
```

--------------------------------------------------------------------------------

---[FILE: inline_topic_link_label.hbs]---
Location: zulip-main/web/templates/inline_topic_link_label.hbs

```text
{{#if is_empty_string_topic}}
<span class="stream-topic">
    {{~!-- squash whitespace --~}}
    #{{channel_name}} &gt; <em class="empty-topic-display">{{t "general chat"}}</em>
    {{~!-- squash whitespace --~}}
</span>
{{~else}}
<span class="stream-topic">
    {{~!-- squash whitespace --~}}
    #{{channel_name}} &gt; {{topic_display_name}}
    {{~!-- squash whitespace --~}}
</span>
{{~/if}}
```

--------------------------------------------------------------------------------

---[FILE: input_pill.hbs]---
Location: zulip-main/web/templates/input_pill.hbs

```text
<div class='pill {{#if deactivated}} deactivated-pill {{/if~}}'
  {{~#if user_id}}data-user-id="{{user_id}}"{{/if~}}
  {{~#if group_id}}data-user-group-id="{{group_id}}"{{/if~}}
  {{~#if stream_id}}data-stream-id="{{stream_id}}"{{/if~}}
  {{~#if data_syntax}}data-syntax="{{data_syntax}}"{{/if}} tabindex=0>
    {{#if has_image}}
    <img class="pill-image" src="{{img_src}}" />
    <div class="pill-image-border"></div>
    {{#if deactivated}}
        <span class="fa fa-ban slashed-circle-icon"></span>
    {{/if}}
    {{/if}}
    <span class="pill-label">
        <span class="pill-value">
            {{#if has_stream}}
                {{~#if stream.invite_only ~}}
                <i class="zulip-icon zulip-icon-lock channel-privacy-type-icon" aria-hidden="true"></i>
                {{~ else if stream.is_web_public ~}}
                <i class="zulip-icon zulip-icon-globe channel-privacy-type-icon" aria-hidden="true"></i>
                {{~ else ~}}
                <i class="zulip-icon zulip-icon-hashtag channel-privacy-type-icon" aria-hidden="true"></i>
                {{~/if~}}
            {{/if}}
            {{#if is_empty_string_topic}}
            {{sign}}topic:{{#if topic_display_name}}<span class="empty-topic-display"> {{topic_display_name}}</span>{{/if}}
            {{else}}
            {{ display_value }}
            {{/if}}
        </span>
        {{~#if should_add_guest_user_indicator}}&nbsp;<i>({{t 'guest'}})</i>{{~/if~}}
        {{~#if has_status~}}
            {{~> status_emoji status_emoji_info~}}
        {{~/if~}}
        {{~#if is_bot~}}
            <i class="zulip-icon zulip-icon-bot" aria-label="{{t 'Bot' }}"></i>
        {{~/if~}}
        {{~#if show_group_members_count~}}
        &nbsp;<span class="group-members-count">({{group_members_count}})</span>
        {{~/if~}}
    </span>
    {{#if show_expand_button}}
    <div class="expand">
        <a role="button" class="zulip-icon zulip-icon-expand-both-diagonals pill-expand-button"></a>
    </div>
    {{/if}}
    {{#unless disabled}}
    <div class="exit">
        <a role="button" class="zulip-icon zulip-icon-close pill-close-button"></a>
    </div>
    {{/unless}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: introduce_zulip_view_modal.hbs]---
Location: zulip-main/web/templates/introduce_zulip_view_modal.hbs

```text
<div id="introduce-zulip-view-modal">
    <p>
        {{#if (eq zulip_view "inbox")}}
            {{#tr}}
                You’ll see a list of <z-highlight>conversations</z-highlight> where you have <z-highlight>unread messages</z-highlight>, organized by channel.
                {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
            {{/tr}}
        {{else if (eq zulip_view "recent_conversations")}}
            {{#tr}}
                You’ll see a list of <z-highlight>ongoing conversations</z-highlight>.
                {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
            {{/tr}}
        {{/if}}

        {{#tr}}
            Each conversation is <z-highlight>labeled with a topic</z-highlight> by the person who started it.
            {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
        {{/tr}}
    </p>
    <p>
        {{t 'Click on a conversation to view it. To return here, you can:'}}
    </p>
    <ul>
        <li>
            {{#tr}}
                Use the <z-highlight>back</z-highlight> button in your browser or desktop app.
                {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
            {{/tr}}
        </li>
        <li>
            {{#if (eq zulip_view "inbox")}}
                {{#tr}}
                    Click <z-icon-inbox></z-icon-inbox> <z-highlight>Inbox</z-highlight> in the left sidebar.
                    {{#*inline "z-icon-inbox"}}<i class="zulip-icon zulip-icon-inbox" aria-hidden="true"></i>{{/inline}}
                    {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
                {{/tr}}
            {{else if (eq zulip_view "recent_conversations")}}
                {{#tr}}
                    Click <z-icon-recent></z-icon-recent> <z-highlight>Recent conversations</z-highlight> in the left sidebar.
                    {{#*inline "z-icon-recent"}}<i class="zulip-icon zulip-icon-recent" aria-hidden="true"></i>{{/inline}}
                    {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
                {{/tr}}
            {{/if}}
        </li>
        {{#if current_home_view_and_escape_navigation_enabled}}
            <li>
                {{#tr}}
                    Use <z-button>Esc</z-button> to go to your home view.
                    {{#*inline "z-button"}}<span class="keyboard-button">{{> @partial-block}}</span>{{/inline}}
                {{/tr}}
            </li>
        {{/if}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: invitation_failed_error.hbs]---
Location: zulip-main/web/templates/invitation_failed_error.hbs

```text
<p id="invitation_error_message">{{ error_message }}</p>
{{#if daily_limit_reached}}
    {{#tr}}
        Please <z-link-support>contact support</z-link-support> for an exception or <z-link-invite-help>add users with a reusable invite link</z-link-invite-help>.
        {{#*inline "z-link-support"}}<a href="https://zulip.com/help/contact-support">{{> @partial-block}}</a>{{/inline}}
        {{#*inline "z-link-invite-help"}}<a href="https://zulip.com/help/invite-new-users#create-a-reusable-invitation-link">{{> @partial-block}}</a>{{/inline}}
    {{/tr}}
{{/if}}
<ul>
    {{#each error_list}}
        <li>{{this}}</li>
    {{/each}}
</ul>
{{#if is_invitee_deactivated}}
    {{#if is_admin}}
    <p id="invitation_admin_message">
        {{#tr}}
            You can reactivate deactivated users from <z-link>organization settings</z-link>.
            {{#*inline "z-link"}}<a href="#organization/deactivated">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </p>
    {{else}}
    <p id="invitation_non_admin_message">{{t "Organization administrators can reactivate deactivated users." }}</p>
    {{/if}}
{{/if}}
{{#if license_limit_reached}}
    {{#if has_billing_access}}
        {{#tr}}
            To invite users, please <z-link-billing>increase the number of licenses</z-link-billing> or <z-link-help-page>deactivate inactive users</z-link-help-page>.
            {{#*inline "z-link-billing"}}<a href="/billing/">{{> @partial-block}}</a>{{/inline}}
            {{#*inline "z-link-help-page"}}<a href="/help/deactivate-or-reactivate-a-user" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    {{else}}
        {{#tr}}
            Please ask a user with billing permission to <z-link-billing>increase the number of licenses</z-link-billing> or <z-link-help-page>deactivate inactive users</z-link-help-page>, and try again.
            {{#*inline "z-link-billing"}}<a href="/billing/">{{> @partial-block}}</a>{{/inline}}
            {{#*inline "z-link-help-page"}}<a href="/help/deactivate-or-reactivate-a-user" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    {{/if}}
{{/if}}
```

--------------------------------------------------------------------------------

````
