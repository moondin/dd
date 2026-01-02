---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 765
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 765 of 1290)

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

---[FILE: inbox_folder_with_channels.hbs]---
Location: zulip-main/web/templates/inbox_view/inbox_folder_with_channels.hbs

```text
{{> inbox_folder_row
  name=name
  header_id=header_id
  is_header_visible=is_header_visible
  is_dm_header=false
  is_collapsed=is_collapsed
  has_unread_mention=has_unread_mention
  unread_count=unread_count
  }}
<div class="inbox-streams-container inbox-folder-components">
    {{#each topics_dict as |key_value_list _index|}}
        {{#each ../streams_dict as |stream_key_value _stream_index|}}
            {{#if (and (eq stream_key_value.[1].folder_id ../../id) (eq stream_key_value.[0] key_value_list.[0]))}}
            <div id="{{key_value_list.[0]}}" class="inbox-folder-channel">
                {{> inbox_row stream_key_value.[1]}}
                <div class="inbox-topic-container">
                    {{#each key_value_list.[1]}}
                        {{> inbox_row this.[1]}}
                    {{/each}}
                </div>
            </div>
            {{/if}}
        {{/each}}
    {{/each}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: inbox_list.hbs]---
Location: zulip-main/web/templates/inbox_view/inbox_list.hbs

```text
{{> inbox_folder_row
  header_id="inbox-dm-header"
  is_header_visible=has_dms_post_filter
  is_dm_header=true
  is_collapsed=is_dms_collapsed
  has_unread_mention=has_unread_mention
  unread_count=unread_dms_count
  }}
<div id="inbox-direct-messages-container" class="inbox-folder-components">
    {{#each dms_dict}}
        {{> inbox_row this.[1]}}
    {{/each}}
</div>
{{#each channel_folders_dict as |channel_folder_key_value_list _index|}}
    {{> inbox_folder_with_channels
      id=channel_folder_key_value_list.[1].id
      name=channel_folder_key_value_list.[1].name
      header_id=channel_folder_key_value_list.[1].header_id
      is_header_visible=channel_folder_key_value_list.[1].is_header_visible
      is_collapsed=channel_folder_key_value_list.[1].is_collapsed
      has_unread_mention=channel_folder_key_value_list.[1].has_unread_mention
      unread_count=channel_folder_key_value_list.[1].unread_count
      topics_dict=../topics_dict
      streams_dict=../streams_dict
      }}
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: inbox_no_unreads.hbs]---
Location: zulip-main/web/templates/inbox_view/inbox_no_unreads.hbs

```text
<div id="inbox-empty-without-search"  class="inbox-empty-text">
    <div class="inbox-empty-illustration"></div>
    <div class="inbox-empty-title">
        {{t "There are no unread messages in your inbox."}}
    </div>
    <div class="inbox-empty-action">
        {{#tr}}
            You might be interested in <z-link>recent conversations</z-link>.
            {{#*inline "z-link"}}<a class="inbox-empty-action-link" href="#recent">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: inbox_row.hbs]---
Location: zulip-main/web/templates/inbox_view/inbox_row.hbs

```text
{{#if is_stream}}
    {{> inbox_stream_header_row .}}
{{else}}
    <div id="inbox-row-conversation-{{conversation_key}}" class="inbox-row {{#if is_hidden}}hidden_by_filters{{/if}}" tabindex="0" data-col-index="{{ column_indexes.FULL_ROW }}">
        <div class="inbox-focus-border">
            <div class="inbox-left-part-wrapper">
                <div class="inbox-left-part">
                    {{#if is_direct}}
                        <a class="recipients_info {{#unless user_circle_class}}inbox-group-or-bot-dm{{/unless}}" href="{{dm_url}}" tabindex="-1">
                            <span class="user_block">
                                {{#if is_bot}}
                                <span class="zulip-icon zulip-icon-bot" aria-hidden="true"></span>
                                {{else if is_group}}
                                <span class="conversation-partners-icon zulip-icon zulip-icon-dm-groups-3" aria-hidden="true"></span>
                                {{else}}
                                <span class="zulip-icon zulip-icon-{{user_circle_class}} {{user_circle_class}} user-circle" data-presence-indicator-user-id="{{user_ids_string}}"></span>
                                {{/if}}
                                <span class="recipients_name">{{{rendered_dm_with_html}}}</span>
                            </span>
                        </a>
                        <span class="unread_mention_info tippy-zulip-tooltip
                          {{#unless has_unread_mention}}hidden{{/unless}}"
                          data-tippy-content="{{t 'You have unread mentions' }}">@</span>
                        <div class="unread-count-focus-outline" tabindex="0" data-col-index="{{ column_indexes.UNREAD_COUNT }}">
                            <span class="unread_count tippy-zulip-tooltip on_hover_dm_read"
                              data-user-ids-string="{{user_ids_string}}" data-tippy-content="{{t 'Mark as read' }}"
                              aria-label="{{t 'Mark as read' }}">{{unread_count}}</span>
                        </div>
                    {{else if is_topic}}
                        <div class="inbox-topic-name">
                            <a tabindex="-1" href="{{topic_url}}" {{#if is_empty_string_topic}}class="empty-topic-display"{{/if}}>{{topic_display_name}}</a>
                        </div>
                        <span class="unread_mention_info tippy-zulip-tooltip
                          {{#unless mention_in_unread}}hidden{{/unless}}"
                          data-tippy-content="{{t 'You have unread mentions'}}">@</span>
                        {{#if unread_count}}
                        <div class="unread-count-focus-outline" tabindex="0" data-col-index="{{ column_indexes.UNREAD_COUNT }}">
                            <span class="unread_count tippy-zulip-tooltip on_hover_topic_read"
                              data-stream-id="{{stream_id}}" data-topic-name="{{topic_name}}"
                              data-tippy-content="{{t 'Mark as read' }}" aria-label="{{t 'Mark as read' }}">
                                {{unread_count}}
                            </span>
                        </div>
                        {{/if}}
                    {{/if}}
                </div>
            </div>
            {{#unless is_direct}}
            <div class="inbox-right-part-wrapper">
                <div class="inbox-right-part">
                    {{#if (and is_topic (not stream_archived))}}
                        <span class="visibility-policy-indicator change_visibility_policy hidden-for-spectators{{#if (eq visibility_policy all_visibility_policies.INHERIT)}} inbox-row-visibility-policy-inherit{{/if}}"
                          data-stream-id="{{stream_id}}" data-topic-name="{{topic_name}}" tabindex="0" data-col-index="{{ column_indexes.TOPIC_VISIBILITY }}">
                            {{#if (eq visibility_policy all_visibility_policies.FOLLOWED)}}
                                <i class="zulip-icon zulip-icon-follow recipient_bar_icon" data-tippy-content="{{t 'You follow this topic.'}}"
                                  role="button" aria-haspopup="true" aria-label="{{t 'You follow this topic.' }}"></i>
                            {{else if (eq visibility_policy all_visibility_policies.UNMUTED)}}
                                <i class="zulip-icon zulip-icon-unmute recipient_bar_icon" data-tippy-content="{{t 'You have unmuted this topic.'}}"
                                  role="button" aria-haspopup="true" aria-label="{{t 'You have unmuted this topic.' }}"></i>
                            {{else if (eq visibility_policy all_visibility_policies.MUTED)}}
                                <i class="zulip-icon zulip-icon-mute recipient_bar_icon" data-tippy-content="{{t 'You have muted this topic.'}}"
                                  role="button" aria-haspopup="true" aria-label="{{t 'You have muted this topic.' }}"></i>
                            {{else if (eq visibility_policy all_visibility_policies.INHERIT)}}
                                <i class="zulip-icon zulip-icon-inherit recipient_bar_icon"
                                  role="button" aria-haspopup="true" aria-label="{{t 'Notifications are based on your configuration for this channel.' }}"></i>
                            {{/if}}
                        </span>
                    {{/if}}
                    <div class="inbox-action-button inbox-topic-menu"
                      {{#if is_topic}}data-stream-id="{{stream_id}}" data-topic-name="{{topic_name}}"
                      data-topic-url="{{topic_url}}"{{/if}} tabindex="0" data-col-index="{{ column_indexes.ACTION_MENU }}">
                        <i class="zulip-icon zulip-icon-more-vertical" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            {{/unless}}
        </div>
    </div>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: inbox_stream_container.hbs]---
Location: zulip-main/web/templates/inbox_view/inbox_stream_container.hbs

```text
{{#each topics_dict as |key_value_list _index|}}
    <div id="{{key_value_list.[0]}}">
        {{#each ../streams_dict as |stream_key_value _stream_index|}}
            {{#if (eq stream_key_value.[0] key_value_list.[0])}}
                {{> inbox_row stream_key_value.[1]}}
            {{/if}}
        {{/each}}
        <div class="inbox-topic-container">
            {{#each key_value_list.[1]}}
                {{>inbox_row this.[1]}}
            {{/each}}
        </div>
    </div>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: inbox_stream_header_row.hbs]---
Location: zulip-main/web/templates/inbox_view/inbox_stream_header_row.hbs

```text
<div id="inbox-stream-header-{{stream_id}}" class="inbox-header {{#if is_hidden}}hidden_by_filters{{/if}} {{#if is_collapsed}}inbox-collapsed-state{{/if}}" data-col-index="{{ column_indexes.FULL_ROW }}" tabindex="0" data-stream-id="{{stream_id}}" style="background: {{stream_header_color}};">
    <div class="inbox-focus-border">
        <div class="inbox-left-part-wrapper">
            <div class="inbox-left-part">
                <div class="inbox-header-name">
                    <span class="stream-privacy-original-color-{{stream_id}} stream-privacy filter-icon" style="color: {{stream_color}}">
                        {{> ../stream_privacy . }}
                    </span>
                    <span class="inbox-header-name-text">{{stream_name}}</span>
                    {{#if is_archived}}
                        <span class="inbox-header-stream-archived">
                            <i class="archived-indicator">({{t 'archived' }})</i>
                        </span>
                    {{/if}}
                </div>
                <div class="collapsible-button toggle-inbox-header-icon {{#if is_collapsed}}icon-collapsed-state{{/if}}"><i class="channel-row-chevron zulip-icon zulip-icon-chevron-down"></i></div>
                <span class="unread_mention_info tippy-zulip-tooltip
                  {{#unless mention_in_unread}}hidden{{/unless}}"
                  data-tippy-content="{{t 'You have unread mentions'}}">@</span>
                <div class="unread-count-focus-outline" tabindex="0" data-col-index="{{ column_indexes.UNREAD_COUNT }}">
                    <span class="unread_count tippy-zulip-tooltip on_hover_topic_read"
                      data-stream-id="{{stream_id}}" data-tippy-content="{{t 'Mark as read' }}"
                      aria-label="{{t 'Mark as read' }}">{{unread_count}}</span>
                </div>
            </div>
        </div>
        <div class="inbox-right-part-wrapper">
            <div class="inbox-right-part">
                {{#if is_muted}}
                <span class="channel-visibility-policy-indicator toggle-channel-visibility tippy-zulip-tooltip" data-stream-id="{{stream_id}}" tabindex="0" data-col-index="{{ column_indexes.TOPIC_VISIBILITY }}" data-tooltip-template-id="inbox-channel-mute-toggle-tooltip-template">
                    <i class="zulip-icon zulip-icon-mute recipient_bar_icon" role="button"></i>
                </span>
                {{/if}}
                <div class="inbox-action-button inbox-stream-menu" data-stream-id="{{stream_id}}" tabindex="0" data-col-index="{{ column_indexes.ACTION_MENU }}">
                    <i class="zulip-icon zulip-icon-more-vertical" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: inbox_view.hbs]---
Location: zulip-main/web/templates/inbox_view/inbox_view.hbs

```text
<div id="inbox-main">
    {{#if unknown_channel}}
    <div id="inbox-unknown-channel-view" class="empty-list-message">
        {{t "This channel doesn't exist, or you are not allowed to view it."}}
    </div>
    {{else}}
    <div class="search_group" id="inbox-filters" role="group">
        {{> ../dropdown_widget widget_name="inbox-filter"}}
        {{#> input_wrapper . input_type="filter-input" custom_classes="inbox-search-wrapper" icon="search" input_button_icon="close"}}
            <input type="text" id="{{INBOX_SEARCH_ID}}" class="input-element" value="{{search_val}}" autocomplete="off" placeholder="{{t 'Filter' }}" />
        {{/input_wrapper}}
        {{#if show_channel_folder_toggle}}
        <span class="sidebar-menu-icon channel-folders-inbox-menu-icon hidden-for-spectators"><i class="zulip-icon zulip-icon-more-vertical" aria-label="{{t 'Show channel folders'}}"></i></span>
        {{/if}}
    </div>
    <div id="inbox-empty-with-search" class="inbox-empty-text empty-list-message">
        {{t "No conversations match your filters."}}
    </div>
    <div id="inbox-empty-channel-view-with-search" class="inbox-empty-text empty-list-message">
        {{t "No topics match your filters."}}
    </div>
    <div id="inbox-empty-channel-view-without-search" class="inbox-empty-text empty-list-message">
        {{t "There are no topics in this view."}}
    </div>
    {{#if normal_view}}
        {{> inbox_no_unreads}}
    {{/if}}
    <div id="inbox-list">
        {{#if normal_view}}
            {{> inbox_list .}}
        {{/if}}
    </div>
    <div id="inbox-collapsed-note">
        <div class="inbox-collapsed-note-and-button-wrapper">
            <span class="inbox-collapsed-note-span">
                {{t "All unread conversations are hidden. Click on a section, folder, or channel to expand it."}}
            </span>
            <button id="inbox-expand-all-button" class="action-button action-button-quiet-neutral" tabindex="0">
                <span class="action-button-label">{{t "Show all"}}</span>
            </button>
        </div>
    </div>
    <div id="inbox-loading-indicator">
        {{#unless normal_view}}
        {{> ../view_bottom_loading_indicator}}
        {{/unless}}
    </div>
    {{/if}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: allow_private_data_export_banner.hbs]---
Location: zulip-main/web/templates/modal_banner/allow_private_data_export_banner.hbs

```text
{{#> modal_banner . }}
    <p class="banner_message">
        {{#tr}}
            Do you want to <z-link>allow your private data to be exported</z-link>?
            {{#*inline "z-link"}}<a href="#settings/account-and-privacy">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </p>
{{/modal_banner}}
```

--------------------------------------------------------------------------------

---[FILE: invite_users_tips.hbs]---
Location: zulip-main/web/templates/modal_banner/invite_users_tips.hbs

```text
{{t "You may want to complete the following setup steps prior to inviting users:" }}
<ul class="invite-tips-list">
    {{#unless realm_has_description}}
    <li>
        {{#tr}}
            <z-link>Configure</z-link> your organization's login page.
            {{#*inline "z-link"}}<a class="banner-link" href="#organization/organization-profile">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </li>
    {{else unless realm_has_user_set_icon}}
    <li>
        {{#tr}}
            <z-link>Upload a profile picture</z-link> for your organization.
            {{#*inline "z-link"}}<a class="banner-link" href="#organization/organization-profile">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </li>
    {{/unless}}
    {{#unless realm_has_custom_profile_fields}}
    <li>
        {{#tr}}
            Configure <z-link-1>default new user settings</z-link-1> and <z-link-2>custom profile fields</z-link-2>.
            {{#*inline "z-link-1"}}<a class="banner-link" href="#organization/organization-level-user-defaults">{{> @partial-block}}</a>{{/inline}}
            {{#*inline "z-link-2"}}<a class="banner-link" href="#organization/profile-field-settings">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </li>
    {{/unless}}
</ul>
```

--------------------------------------------------------------------------------

---[FILE: modal_banner.hbs]---
Location: zulip-main/web/templates/modal_banner/modal_banner.hbs

```text
<div class="main-view-banner {{banner_type}} {{classname}}">
    <div class="main-view-banner-elements-wrapper">
        {{#if banner_text}}
        <p class="banner_content">{{banner_text}}</p>
        {{else}}
        <div class="banner_content">{{> @partial-block .}}</div>
        {{/if}}
        {{#if button_text}}
        {{#if button_link}}
        <a href="{{button_link}}">
            <button class="main-view-banner-action-button{{#if hide_close_button}} right_edge{{/if}}">{{button_text}}</button>
        </a>
        {{else}}
        <button class="main-view-banner-action-button{{#if hide_close_button}} right_edge{{/if}}">{{button_text}}</button>
        {{/if}}
        {{/if}}
    </div>
    {{#unless hide_close_button}}
    <a role="button" class="zulip-icon zulip-icon-close main-view-banner-close-button"></a>
    {{/unless}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: stream_creation_confirmation_banner.hbs]---
Location: zulip-main/web/templates/modal_banner/stream_creation_confirmation_banner.hbs

```text
{{#> modal_banner . }}
    <p class="banner_message">
        {{#tr}}
            Channel <z-link>#{stream_name}</z-link> created!
            {{#*inline "z-link"}}<a class="stream_narrow_link" href="{{stream_url}}">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </p>
{{/modal_banner}}
```

--------------------------------------------------------------------------------

---[FILE: topic_already_exists_warning_banner.hbs]---
Location: zulip-main/web/templates/modal_banner/topic_already_exists_warning_banner.hbs

```text
{{#> modal_banner . }}
    <p class="banner_message">
        {{#tr}}
            You are moving messages to a topic that already exists. Messages from these topics will be combined.
        {{/tr}}
    </p>
{{/modal_banner}}
```

--------------------------------------------------------------------------------

---[FILE: unsubscribed_participants_warning_banner.hbs]---
Location: zulip-main/web/templates/modal_banner/unsubscribed_participants_warning_banner.hbs

```text
{{#> modal_banner . }}
    <p class="banner_message">
        {{#if (eq selected_propagate_mode "change_one")}}
            {{#tr}}
                Message sender <z-user-names></z-user-names> is not subscribed to <z-stream></z-stream>.
                {{#*inline "z-user-names"}}({{{unsubscribed_participant_formatted_names_list_html}}}){{/inline}}
                {{#*inline "z-stream"}}<strong class="highlighted-element">{{> ../inline_decorated_channel_name stream=stream show_colored_icon=true}}</strong>{{/inline}}
            {{/tr}}

        {{else if few_unsubscribed_participants}}
            {{#tr}}
                Some topic participants <z-user-names></z-user-names> are not subscribed to <z-stream></z-stream>.
                {{#*inline "z-user-names"}}({{{unsubscribed_participant_formatted_names_list_html}}}){{/inline}}
                {{#*inline "z-stream"}}<strong class="highlighted-element">{{> ../inline_decorated_channel_name stream=stream show_colored_icon=true}}</strong>{{/inline}}
            {{/tr}}

        {{else}}
            {{#tr}}
                {unsubscribed_participants_count} topic participants are not subscribed to <z-stream></z-stream>.
                {{#*inline "z-stream"}}<strong class="highlighted-element">{{> ../inline_decorated_channel_name stream=stream show_colored_icon=true}}</strong>{{/inline}}
            {{/tr}}
        {{/if}}
    </p>

{{/modal_banner}}
```

--------------------------------------------------------------------------------

---[FILE: buddy_list_popover.hbs]---
Location: zulip-main/web/templates/popovers/buddy_list_popover.hbs

```text
<div class="popover-menu" id="buddy-list-actions-menu-popover" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        <li role="none" class="link-item">
            <label class="display-style-selector-header popover-menu-link" role="menuitem">
                <span class="popover-menu-label">
                    {{t 'User list style' }}
                </span>
            </label>
        </li>
        {{#each display_style_options}}
            <li role="none" class="display-style-selector link-item" value="{{this.code}}">
                <label class="popover-menu-link" role="menuitem" tabindex="0">
                    <input type="radio" class="user_list_style_choice" name="user_list_style" value="{{this.code}}"/>
                    <span class="popover-menu-label">{{this.description}}</span>
                </label>
            </li>
        {{/each}}
        {{#if can_invite_users}}
        <li role="none" class="invite-user-link-item link-item">
            <a class="invite-user-link popover-menu-link" role="menuitem" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-user-plus" aria-hidden="true"></i>
                <span class="popover-menu-label">
                    {{t 'Invite users to organization' }}
                </span>
            </a>
        </li>
        {{/if}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: change_visibility_policy_popover.hbs]---
Location: zulip-main/web/templates/popovers/change_visibility_policy_popover.hbs

```text
<div class="popover-menu visibility-policy-popover" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        <li role="none" class="popover-menu-list-item">
            <div role="group" class="recipient-bar-topic-visibility-switcher tab-picker tab-picker-vertical" aria-label="{{t 'Topic visibility' }}">
                <input type="radio" id="select-muted-policy" class="tab-option" name="visibility-policy-select" data-visibility-policy="{{all_visibility_policies.MUTED}}" {{#if (eq visibility_policy all_visibility_policies.MUTED)}}checked{{/if}} />
                <label role="menuitemradio" class="tab-option-content" for="select-muted-policy" tabindex="0">
                    <i class="zulip-icon zulip-icon-mute" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Mute"}}</span>
                </label>
                <input type="radio" id="select-inherit-policy" class="tab-option" name="visibility-policy-select" data-visibility-policy="{{all_visibility_policies.INHERIT}}" {{#if (eq visibility_policy all_visibility_policies.INHERIT)}}checked{{/if}} />
                <label role="menuitemradio" class="tab-option-content" for="select-inherit-policy" tabindex="0">
                    <i class="zulip-icon zulip-icon-inherit" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Default"}}</span>
                </label>
                {{#if (or stream_muted topic_unmuted)}}
                <input type="radio" id="select-unmuted-policy" class="tab-option" name="visibility-policy-select" data-visibility-policy="{{all_visibility_policies.UNMUTED}}" {{#if (eq visibility_policy all_visibility_policies.UNMUTED)}}checked{{/if}} />
                <label role="menuitemradio" class="tab-option-content" for="select-unmuted-policy" tabindex="0">
                    <i class="zulip-icon zulip-icon-unmute" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Unmute"}}</span>
                </label>
                {{/if}}
                <input type="radio" id="select-followed-policy" class="tab-option" name="visibility-policy-select" data-visibility-policy="{{all_visibility_policies.FOLLOWED}}" {{#if (eq visibility_policy all_visibility_policies.FOLLOWED)}}checked{{/if}} />
                <label role="menuitemradio" class="tab-option-content" for="select-followed-policy" tabindex="0">
                    <i class="zulip-icon zulip-icon-follow" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Follow"}}</span>
                </label>
                <span class="slider"></span>
            </div>
        </li>
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: channel_folder_setting_popover.hbs]---
Location: zulip-main/web/templates/popovers/channel_folder_setting_popover.hbs

```text
<div class="popover-menu" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        {{#if show_collapse_expand_all_options }}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" id="left_sidebar_expand_all" class="popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-expand" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Expand all sections" }}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" id="left_sidebar_collapse_all" class="popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-collapse" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Collapse all sections" }}</span>
            </a>
        </li>
        {{/if}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" id="{{channel_folders_id}}" class="popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-folder" aria-hidden="true"></i>
                {{#if show_channel_folders}}
                <span class="popover-menu-label">{{t "Don't group channels by folder" }}</span>
                {{else}}
                <span class="popover-menu-label">{{t "Group channels by folder" }}</span>
                {{/if}}
            </a>
        </li>
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: color_picker_popover.hbs]---
Location: zulip-main/web/templates/popovers/color_picker_popover.hbs

```text
<div class="popover-menu color-picker-popover no-auto-hide-left-sidebar-overlay" data-simplebar data-simplebar-tab-index="-1">
    <div class="message_header message_header_stream" data-stream-id="{{stream_id}}">
        <div class="message-header-contents" style="background: {{recipient_bar_color}};">
            <div class="message_label_clickable stream_label">
                <span class="stream-privacy-modified-color-{{stream_id}} stream-privacy filter-icon"  style="color: {{stream_privacy_icon_color}}">
                    {{> ../stream_privacy .}}
                </span>
                {{#if stream_name}}
                <span class="message-header-stream-name">
                    {{~stream_name~}}
                </span>
                {{else}}
                &nbsp;
                {{/if}}
            </div>
            <button class="color_picker_confirm_button icon-button icon-button-square icon-button-neutral tippy-zulip-delayed-tooltip" data-tooltip-template-id="color-picker-confirm-button-tooltip-template" aria-label="{{t 'Confirm new color' }}" tabindex="0">
                <i class="zulip-icon zulip-icon-check"></i>
            </button>
        </div>
    </div>
    <ul role="menu" class="popover-menu-list">
        <li role="none">
            <div role="group" class="color-swatch-list" aria-label="{{t 'Stream color' }}">
                {{#each stream_color_palette as |row|}}
                    {{#each row as |hex_color|}}
                        <input type="radio" id="color-{{hex_color}}" class="color-swatch-input" name="color-picker-select" data-swatch-color="{{hex_color}}" {{#if (eq hex_color ../stream_color )}}checked{{/if}} />
                        <label role="menuitemradio" class="color-swatch-label tippy-zulip-delayed-tooltip" for="color-{{hex_color}}" style="background-color: {{hex_color}};" aria-label="{{hex_color}}" data-tippy-content="{{hex_color}}" data-swatch-color="{{hex_color}}" data-row="{{@../index}}" data-column="{{@index}}" tabindex="0"></label>
                    {{/each}}
                {{/each}}
            </div>
        </li>
        <li role="separator" class="popover-menu-separator"></li>
        <li role="none" class="link-item popover-menu-list-item">
            <label role="menuitem" class="custom-color-picker popover-menu-link" tabindex="0">
                <i class="custom-color-swatch-icon popover-menu-icon" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Custom color"}}</span>
                <input type="color" class="color-picker-input" tabindex="-1" value="{{stream_color}}" />
            </label>
        </li>
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: message_actions_popover.hbs]---
Location: zulip-main/web/templates/popovers/message_actions_popover.hbs

```text
<div class="popover-menu" id="message-actions-menu-dropdown" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        {{!-- Group 1 --}}
        {{#if should_display_quote_message}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" data-message-id="{{message_id}}" class="respond_button popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-quote-message" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Quote message" }}</span>
                {{popover_hotkey_hints ">"}}
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" data-message-id="{{message_id}}" class="forward_button popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-forward-message" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Forward message" }}</span>
                {{popover_hotkey_hints "<"}}
            </a>
        </li>
        {{/if}}
        {{!-- Group 2 --}}
        {{#if (or editability_menu_item move_message_menu_item should_display_delete_option should_display_message_report_option)}}
        <li role="separator" class="popover-menu-separator"></li>
        {{/if}}
        {{#if editability_menu_item}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" data-message-id="{{message_id}}" class="popover_edit_message popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-edit" aria-hidden="true"></i>
                <span class="popover-menu-label">{{editability_menu_item}}</span>
                {{popover_hotkey_hints "E"}}
            </a>
        </li>
        {{/if}}
        {{#if move_message_menu_item}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" data-message-id="{{message_id}}" class="popover_move_message popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-move-alt" aria-hidden="true"></i>
                <span class="popover-menu-label">{{move_message_menu_item}}</span>
                {{popover_hotkey_hints "M"}}
            </a>
        </li>
        {{/if}}
        {{#if should_display_delete_option}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" data-message-id="{{message_id}}" class="delete_message popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-trash" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Delete message" }}</span>
            </a>
        </li>
        {{/if}}
        {{#if should_display_message_report_option}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" data-message-id="{{message_id}}" class="popover_report_message popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-flag" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Report message" }}</span>
            </a>
        </li>
        {{/if}}
        {{!-- Group 3 --}}
        {{#if should_display_add_reaction_option}}
        <li role="separator" class="popover-menu-separator"></li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" data-message-id="{{message_id}}" class="reaction_button popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-smile" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Add emoji reaction" }}</span>
                {{popover_hotkey_hints ":"}}
            </a>
        </li>
        {{/if}}
        {{!-- Group 4 --}}
        {{#if (or should_display_mark_as_unread should_display_remind_me_option should_display_collapse should_display_uncollapse)}}
        <li role="separator" class="popover-menu-separator"></li>
        {{/if}}
        {{#if should_display_mark_as_unread}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" data-message-id="{{message_id}}" class="mark_as_unread popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-mark-as-unread" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Mark as unread from here" }}</span>
                {{popover_hotkey_hints "Shift" "U"}}
            </a>
        </li>
        {{/if}}
        {{#if should_display_remind_me_option}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" data-message-id="{{message_id}}" class="message-reminder popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-alarm-clock" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Remind me about this" }}</span>
            </a>
        </li>
        {{/if}}
        {{#if should_display_collapse}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" data-message-id="{{message_id}}" class="popover_toggle_collapse popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-collapse" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Collapse message" }}</span>
                {{popover_hotkey_hints "-"}}
            </a>
        </li>
        {{/if}}
        {{#if should_display_uncollapse}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" data-message-id="{{message_id}}" class="popover_toggle_collapse popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-expand" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Expand message" }}</span>
                {{popover_hotkey_hints "-"}}
            </a>
        </li>
        {{/if}}
        {{!-- Group 5 --}}
        <li role="separator" class="popover-menu-separator hidden-for-spectators"></li>
        {{#if view_source_menu_item}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" data-message-id="{{message_id}}" class="popover_view_source popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-source" aria-hidden="true"></i>
                <span class="popover-menu-label">{{view_source_menu_item}}</span>
                {{popover_hotkey_hints "E"}}
            </a>
        </li>
        {{/if}}
        {{#if should_display_read_receipts_option}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" data-message-id="{{message_id}}" class="view_read_receipts popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-readreceipts" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "View read receipts" }}</span>
                {{popover_hotkey_hints "Shift" "V"}}
            </a>
        </li>
        {{/if}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="copy_link navigate-link-on-enter popover-menu-link" data-message-id="{{message_id}}" data-clipboard-text="{{ conversation_time_url }}" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-link-alt" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Copy link to message" }}</span>
                {{popover_hotkey_hints "L"}}
            </a>
        </li>
    </ul>
</div>
```

--------------------------------------------------------------------------------

````
