---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 775
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 775 of 1290)

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

---[FILE: stream_settings.hbs]---
Location: zulip-main/web/templates/stream_settings/stream_settings.hbs

```text
<div class="stream_settings_header" data-stream-id="{{sub.stream_id}}">
    <div class="tab-container"></div>
    {{#with sub}}
    <div class="button-group">
        <div class="sub_unsub_button_wrapper inline-block {{#unless should_display_subscription_button }}cannot-subscribe-tooltip{{/unless}}" data-tooltip-template-id="cannot-subscribe-tooltip-template">
            <template id="cannot-subscribe-tooltip-template">
                <span>
                    {{#tr}}
                        Cannot subscribe to private channel <z-stream></z-stream>
                        {{#*inline "z-stream"}}{{> ../inline_decorated_channel_name stream=../sub}}{{/inline}}
                    {{/tr}}
                </span>
            </template>
            <button class="action-button subscribe-button sub_unsub_button {{#if subscribed}}action-button-quiet-neutral{{else}}action-button-quiet-brand{{/if}} {{#if should_display_subscription_button}}toggle-subscription-tooltip{{/if}} {{#unless subscribed }}unsubscribed{{/unless}}" type="button" name="button"  data-tooltip-template-id="toggle-subscription-tooltip-template" {{#unless should_display_subscription_button}}disabled="disabled"{{/unless}}>
                {{#if subscribed }}
                    {{t "Unsubscribe" }}
                {{else}}
                    {{t "Subscribe" }}
                {{/if}}
            </button>
        </div>
        {{> ../components/action_button
          icon="eye"
          attention="quiet"
          intent="neutral"
          custom_classes="tippy-zulip-delayed-tooltip"
          data-tooltip-template-id="view-stream-tooltip-template"
          id="preview-stream-button"
          hidden=(not should_display_preview_button)
          }}
        {{> ../components/icon_button
          icon="archive"
          intent="danger"
          custom_classes="tippy-zulip-delayed-tooltip deactivate"
          data-tippy-content=(t 'Archive channel')
          }}
        {{> ../components/icon_button
          icon="unarchive"
          intent="success"
          custom_classes="tippy-zulip-delayed-tooltip reactivate"
          data-tippy-content=(t 'Unarchive channel')
          }}
    </div>
    {{/with}}
</div>
<div class="subscription_settings" data-stream-id="{{sub.stream_id}}">
    <div class="inner-box">
        <div class="stream-creation-confirmation-banner"></div>
        <div class="stream_section" data-stream-section="general">
            {{#with sub}}
            <div class="stream-settings-tip-container">
                {{> stream_settings_tip .}}
            </div>
            <div class="stream-header">
                {{> stream_privacy_icon
                  invite_only=invite_only
                  is_web_public=is_web_public
                  is_archived=is_archived }}
                <div class="stream-name">
                    <span class="sub-stream-name" data-tippy-content="{{name}}">{{name}}</span>
                </div>
                <div class="stream_change_property_info alert-notification"></div>
                <div class="button-group" {{#unless can_change_name_description}}style="display:none"{{/unless}}>
                    {{> ../components/icon_button
                      icon="edit"
                      intent="neutral"
                      custom_classes="tippy-zulip-delayed-tooltip"
                      id="open_stream_info_modal"
                      data-tippy-content=(t 'Edit channel name and description' )
                      }}
                </div>
            </div>
            <div class="stream-description">
                {{> stream_description
                  rendered_description=rendered_description
                  }}
            </div>
            <div class="creator_details stream_details_box">
                {{> ../creator_details .}}
            </div>
            {{/with}}

            <div class="stream-settings-subsection settings-subsection-parent">
                <div class="subsection-header">
                    <h3 class="stream_setting_subsection_title">
                        {{t "Settings" }}
                    </h3>
                    <div class="stream_email_address_error alert-notification"></div>
                    {{> ../settings/settings_save_discard_widget section_name="channel-general-settings"}}
                </div>

                {{> channel_folder .
                  is_stream_edit=true
                  channel_folder_widget_name="folder_id"
                  }}

                <div class="input-group stream-email-box">
                    <label for="copy_stream_email_button" class="settings-field-label">
                        {{t "Email address" }}
                        {{> ../help_link_widget link="/help/message-a-channel-by-email" }}
                    </label>
                    <span class="generate-channel-email-button-container {{#unless can_access_stream_email}}disabled_setting_tooltip{{/unless}}">
                        {{> ../components/action_button
                          label=(t "Generate email address")
                          attention="quiet"
                          intent="neutral"
                          type="button"
                          custom_classes="copy_email_button"
                          id="copy_stream_email_button"
                          disabled=(not can_access_stream_email)
                          }}
                    </span>
                </div>
            </div>
        </div>

        <div id="personal-stream-settings" class="stream_section" data-stream-section="personal">
            <div class="subsection-parent">
                <div class="subsection-header">
                    <h3 class="stream_setting_subsection_title inline-block">{{t "Personal settings" }}</h3>
                    <div class="stream_change_property_status alert-notification"></div>
                </div>
                {{#each other_settings}}
                    <div class="input-group">
                        {{> stream_settings_checkbox
                          setting_name=name
                          is_checked=is_checked
                          is_muted=(lookup ../sub "is_muted")
                          stream_id=(lookup ../sub "stream_id")
                          notification_setting=false
                          disabled_realm_setting=disabled_realm_setting
                          is_disabled=is_disabled
                          label=label}}
                    </div>
                {{/each}}
                <div class="input-group">
                    <label class="settings-field-label channel-color-label">{{t "Channel color" }}</label>
                    <button class="action-button action-button-quiet-neutral stream-settings-color-selector choose_stream_color" data-stream-id="{{ sub.stream_id }}">
                        <span class="stream-settings-color-preview" style="background: {{sub.color}};"></span>
                        <span class="stream-settings-color-selector-label">{{t "Change color"}}</span>
                    </button>
                </div>
            </div>
            <div class="subsection-parent">
                <div class="subsection-header">
                    <h4 class="stream_setting_subsection_title">{{t "Notification settings" }}</h4>
                    <div class="stream_change_property_status alert-notification"></div>
                </div>
                <p>{{t "In muted channels, channel notification settings apply only to unmuted topics." }}</p>
                <div class="input-group">
                    {{> ../components/action_button
                      label=(t "Reset to default notifications")
                      attention="quiet"
                      intent="neutral"
                      custom_classes="reset-stream-notifications-button"
                      type="button"
                      }}
                </div>
                {{#each notification_settings}}
                    <div class="input-group">
                        {{> stream_settings_checkbox
                          setting_name=name
                          is_checked=is_checked
                          stream_id=(lookup ../sub "stream_id")
                          notification_setting=true
                          disabled_realm_setting=disabled_realm_setting
                          is_disabled=is_disabled
                          label=label}}
                    </div>
                {{/each}}
            </div>
        </div>

        <div class="stream_section" data-stream-section="subscribers">
            {{#with sub}}
            <div class="edit_subscribers_for_stream">
                {{> stream_members .}}
            </div>
            {{/with}}
        </div>

        <div class="stream_section channel-permissions" data-stream-section="permissions">
            <div class="stream-settings-tip-container">
                {{> stream_settings_tip
                  can_change_stream_permissions_requiring_metadata_access=sub.can_change_stream_permissions_requiring_metadata_access }}
            </div>
            {{> channel_permissions .
              prefix="id_"
              is_stream_edit=true
              history_public_to_subscribers=sub.history_public_to_subscribers
              }}
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: stream_settings_checkbox.hbs]---
Location: zulip-main/web/templates/stream_settings/stream_settings_checkbox.hbs

```text
{{!-- If setting is disabled on realm level, then render setting as control-label-disabled and do not set setting value. Setting status should not change on any click handler, as it is disabled at realm level. --}}
<div class="sub_setting_checkbox">
    <div id="sub_{{setting_name}}_setting" class="{{#if disabled_realm_setting}}control-label-disabled
      {{else if notification_setting}}sub_notification_setting{{/if}}">
        <span {{#if (and disabled_realm_setting (eq setting_name "push_notifications"))}}class="tippy-zulip-tooltip" data-tooltip-template-id="mobile-push-notification-tooltip-template"{{/if}}>
            <label class="checkbox">
                <input id="{{setting_name}}_{{stream_id}}" name="{{setting_name}}"
                  class="sub_setting_control" type="checkbox"
                  {{#if is_checked}}checked{{/if}}
                  {{#if is_disabled}}disabled="disabled"{{/if}} />
                <span class="rendered-checkbox"></span>
            </label>
            <label class="inline" for="{{setting_name}}_{{stream_id}}">
                {{label}}
            </label>
        </span>
    </div>
    {{#if (eq setting_name "is_muted")}}
    {{> ../help_link_widget link="/help/mute-a-channel" }}
    {{else if (eq setting_name "push_notifications")}}
    {{> ../help_link_widget link="/help/mobile-notifications#enabling-push-notifications-for-self-hosted-servers" }}
    {{/if}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: stream_settings_overlay.hbs]---
Location: zulip-main/web/templates/stream_settings/stream_settings_overlay.hbs

```text
<div id="subscription_overlay" class="overlay two-pane-settings-overlay" data-overlay="subscriptions">
    <div class="flex overlay-content">
        <div class="two-pane-settings-container overlay-container">
            <div class="two-pane-settings-header">
                <div class="fa fa-chevron-left"></div>
                <span class="subscriptions-title">{{t 'Channels' }}</span>
                <div class="exit">
                    <span class="exit-sign">&times;</span>
                </div>
            </div>
            <div class="two-pane-settings-content">
                <div class="left">
                    <div class="two-pane-settings-subheader">
                        <div class="list-toggler-container">
                            <div id="add_new_subscription">
                                {{#if can_create_streams}}
                                <button class="create_stream_button two-pane-settings-plus-button tippy-zulip-delayed-tooltip" data-tooltip-template-id="create-new-stream-tooltip-template" data-tippy-placement="bottom">
                                    <i class="create_button_plus_sign zulip-icon zulip-icon-square-plus" aria-hidden="true"></i>
                                </button>
                                {{/if}}
                                <div class="float-clear"></div>
                            </div>
                        </div>
                    </div>
                    <div class="two-pane-settings-body">
                        <div class="input-append stream_name_search_section two-pane-settings-search" id="stream_filter">
                            <input type="text" name="stream_name" id="search_stream_name" class="filter_text_input" autocomplete="off"
                              placeholder="{{t 'Filter' }}" value=""/>
                            <button type="button" class="clear_search_button" id="clear_search_stream_name">
                                <i class="zulip-icon zulip-icon-close" aria-hidden="true"></i>
                            </button>
                            <div class="stream_settings_filter_container {{#unless realm_has_archived_channels}}hide_filter{{/unless}}">
                                {{> ../dropdown_widget widget_name="stream_settings_filter"}}
                            </div>
                        </div>
                        <div class="no-streams-to-show">
                            <div class="subscribed_streams_tab_empty_text">
                                <span class="settings-empty-option-text">
                                    {{t 'You are not subscribed to any channels.'}}
                                    {{#if can_view_all_streams}}
                                    <a href="#channels/all">{{t 'View all channels'}}</a>
                                    {{/if}}
                                </span>
                            </div>
                            <div class="available_streams_tab_empty_text">
                                <span class="settings-empty-option-text">
                                    {{t 'No channels to show.'}}
                                    <a href="#channels/all">{{t 'View all channels'}}</a>
                                </span>
                            </div>
                            <div class="no_stream_match_filter_empty_text">
                                <span class="settings-empty-option-text">
                                    {{t 'No channels match your filter.'}}
                                </span>
                            </div>
                            <div class="all_streams_tab_empty_text">
                                <span class="settings-empty-option-text">
                                    {{t 'There are no channels you can view in this organization.'}}
                                    {{#if can_create_streams}}
                                        <a href="#channels/new">{{t 'Create a channel'}}</a>
                                    {{/if}}
                                </span>
                            </div>
                        </div>
                        <div class="streams-list two-pane-settings-left-simplebar-container" data-simplebar data-simplebar-tab-index="-1">
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="two-pane-settings-subheader">
                        <div class="display-type">
                            <div id="stream_settings_title" class="stream-info-title">{{t 'Channel settings' }}</div>
                        </div>
                    </div>
                    <div class="two-pane-settings-body">
                        <div class="nothing-selected">
                            <div class="stream-info-banner banner-wrapper"></div>
                            <div class="create-stream-button-container">
                                <button type="button" class="create_stream_button animated-purple-button" {{#unless can_create_streams}}disabled{{/unless}}>{{t 'Create channel' }}</button>
                                {{#unless can_create_streams}}
                                <span class="settings-empty-option-text">
                                    {{t 'You do not have permission to create channels.' }}
                                </span>
                                {{/unless}}
                            </div>
                        </div>
                        <div id="stream_settings" class="two-pane-settings-right-simplebar-container settings" data-simplebar data-simplebar-tab-index="-1" data-simplebar-auto-hide="false">
                            {{!-- edit stream here --}}
                        </div>
                        {{> stream_creation_form . }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: stream_settings_tip.hbs]---
Location: zulip-main/web/templates/stream_settings/stream_settings_tip.hbs

```text
{{#unless can_change_stream_permissions_requiring_metadata_access}}
    {{> ../components/banner
      label=(t "Only channel administrators can edit these settings.")
      intent="info"
      custom_classes="admin-permissions-banner"
      close_button=false
      process=false
      }}
{{/unless}}
```

--------------------------------------------------------------------------------

---[FILE: stream_subscription_request_result.hbs]---
Location: zulip-main/web/templates/stream_settings/stream_subscription_request_result.hbs

```text
{{#if error_message}}
    {{error_message}}
{{else}}
    {{!-- We want to show ignored deactivated users message even when there are
    no new subscribers --}}
    {{#if (and (eq subscribed_users_count 0) (eq ignored_deactivated_users_count 0))}}
        {{t "All users were already subscribed."}}
    {{else}}
        {{#if (not is_total_subscriber_more_than_five) }}
            {{#if subscribed_users}}
                {{t "Subscribed:" }} {{{subscribe_success_messages.subscribed_users_message_html}}}.
            {{/if}}
            {{#if already_subscribed_users}}
                {{t "Already a subscriber:" }} {{{subscribe_success_messages.already_subscribed_users_message_html}}}.
            {{/if}}
            {{#if ignored_deactivated_users}}
                {{t "Ignored deactivated users:" }} {{{subscribe_success_messages.ignored_deactivated_users_message_html}}}.
            {{/if}}
        {{else}}
            {{#if subscribed_users}}
                {{t "{subscribed_users_count, plural,
                  one {Subscribed: {subscribed_users_count} user.}
                other {Subscribed: {subscribed_users_count} users.}
            }"}}
            {{/if}}
            {{#if already_subscribed_users}}
                {{t "{already_subscribed_users_count, plural,
                  one {Already subscribed: {already_subscribed_users_count} user.}
                    other {Already subscribed: {already_subscribed_users_count} users.}
                }"}}
            {{/if}}
            {{#if ignored_deactivated_users}}
                {{t "{ignored_deactivated_users_count, plural,
                  one {Ignored deactivated: {ignored_deactivated_users_count} user.}
                other {Ignored deactivated: {ignored_deactivated_users_count} users.}
            }"}}
            {{/if}}
        {{/if}}
    {{/if}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: stream_topics_policy_label.hbs]---
Location: zulip-main/web/templates/stream_settings/stream_topics_policy_label.hbs

```text
{{#tr}}
    Allow posting to the <z-empty-string-topic-display-name></z-empty-string-topic-display-name> topic?
    {{#*inline "z-empty-string-topic-display-name"}}<span class="empty-topic-display">{{empty_string_topic_display_name}}</span>{{/inline}}
{{/tr}}
```

--------------------------------------------------------------------------------

---[FILE: subscriber_count.hbs]---
Location: zulip-main/web/templates/stream_settings/subscriber_count.hbs

```text
<i class="fa fa-user-o" aria-hidden="true"></i>
{{#if can_access_subscribers}}
<span class="subscriber-count-text">{{numberFormat subscriber_count}}</span>
{{else}}
<i class="subscriber-count-lock fa fa-lock" aria-hidden="true"></i>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: subscription_setting_icon.hbs]---
Location: zulip-main/web/templates/stream_settings/subscription_setting_icon.hbs

```text
<div class="icon" style="background-color: {{color}}">
    <div class="flex">
        {{#if is_archived}}
        <i class="zulip-icon zulip-icon-archive fa-lg" aria-hidden="true"></i>
        {{else if invite_only}}
        <i class="zulip-icon zulip-icon-lock" aria-hidden="true"></i>
        {{else if is_web_public}}
        <i class="zulip-icon zulip-icon-globe fa-lg" aria-hidden="true"></i>
        {{else}}
        <span class="zulip-icon zulip-icon-hashtag"></span>
        {{/if}}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: topics_already_exist_error.hbs]---
Location: zulip-main/web/templates/stream_settings/topics_already_exist_error.hbs

```text
<div id="settings-topics-already-exist-error">
    {{#tr}}
    To enable this configuration, all messages in this channel must be in the <z-empty-string-topic-display-name></z-empty-string-topic-display-name> topic. Consider <z-link-rename>renaming</z-link-rename> other topics to <z-empty-string-topic-display-name></z-empty-string-topic-display-name>.
    {{#*inline "z-link-rename"}}<a target="_blank" rel="noopener noreferrer" href="/help/rename-a-topic">{{> @partial-block}}</a>{{/inline}}
    {{#*inline "z-empty-string-topic-display-name"}}<span class="empty-topic-display">{{empty_string_topic_display_name}}</span>{{/inline}}
    {{/tr}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: mark_as_read_disabled_banner.hbs]---
Location: zulip-main/web/templates/unread_banner/mark_as_read_disabled_banner.hbs

```text
<div id="mark_as_read_turned_off_banner" class="main-view-banner home-error-bar info">
    <p id="mark_as_read_turned_off_content" class="banner_content">
        {{#tr}}
            Messages will not be automatically marked as read. <z-link>Change setting</z-link>
            {{#*inline "z-link"}}<a href='/#settings/preferences'>{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </p>
    <button id="mark_view_read" class="main-view-banner-action-button">
        {{t 'Mark as read' }}
    </button>
    <a role="button" id="mark_as_read_close" class="zulip-icon zulip-icon-close main-view-banner-close-button"></a>
</div>
```

--------------------------------------------------------------------------------

---[FILE: mark_as_read_only_in_conversation_view.hbs]---
Location: zulip-main/web/templates/unread_banner/mark_as_read_only_in_conversation_view.hbs

```text
<div id="mark_as_read_turned_off_banner" class="main-view-banner home-error-bar info">
    <p id="mark_as_read_turned_off_content" class="banner_content">
        {{#tr}}
            Messages will not be automatically marked as read because this is not a
            <z-conversation-view>conversation</z-conversation-view> view. <z-link>Change setting</z-link>
            {{#*inline "z-conversation-view"}}<a href='/help/reading-conversations'>{{> @partial-block}}</a>{{/inline}}
            {{#*inline "z-link"}}<a href='/#settings/preferences'>{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </p>
    <button id="mark_view_read" class="main-view-banner-action-button">
        {{t 'Mark as read' }}
    </button>
    <a role="button" id="mark_as_read_close" class="zulip-icon zulip-icon-close main-view-banner-close-button"></a>
</div>
```

--------------------------------------------------------------------------------

---[FILE: mark_as_read_turned_off_banner.hbs]---
Location: zulip-main/web/templates/unread_banner/mark_as_read_turned_off_banner.hbs

```text
<div id="mark_as_read_turned_off_banner" class="main-view-banner home-error-bar info">
    <p id="mark_as_read_turned_off_content" class="banner_content">
        {{t 'To preserve your reading state, this view does not mark messages as read.' }}
    </p>
    <button id="mark_view_read" class="main-view-banner-action-button">
        {{t 'Mark as read' }}
    </button>
    <a role="button" id="mark_as_read_close" class="zulip-icon zulip-icon-close main-view-banner-close-button"></a>
</div>
```

--------------------------------------------------------------------------------

---[FILE: add_members_form.hbs]---
Location: zulip-main/web/templates/user_group_settings/add_members_form.hbs

```text
<div class="add_members_container add-button-container">
    <div class="pill-container person_picker">
        <div class="input" contenteditable="true"
          data-placeholder="{{t 'Add users or groups. Use #channelname to add all subscribers.' }}">
            {{~! Squash whitespace so that placeholder is displayed when empty. ~}}
        </div>
    </div>
    {{#if (not hide_add_button)}}
        <div class="add_member_button_wrapper add-users-button-wrapper inline-block">
            {{> ../components/action_button
              label=(t "Add")
              custom_classes="add-member-button add-users-button"
              id="add_member"
              attention="quiet"
              intent="brand"
              type="submit"
              }}
            {{> ../components/icon_button
              icon="check"
              intent="success"
              custom_classes="check hidden-below"
              disabled=true
              }}
        </div>
    {{/if}}
</div>
<div class="add-members-subtitle">
    {{#tr}}
        You can add members by name or email address.
        Enter a <z-user-roles-link>user role</z-user-roles-link>,
        <z-user-groups-link>user group</z-user-groups-link>,
        or <z-channel-link>#channel</z-channel-link> to add multiple users at once.
        {{#*inline "z-user-roles-link"}}<a href="/help/user-roles" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
        {{#*inline "z-user-groups-link"}}<a href="/help/user-groups" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
        {{#*inline "z-channel-link"}}<a href="/help/introduction-to-channels" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
    {{/tr}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: browse_user_groups_list_item.hbs]---
Location: zulip-main/web/templates/user_group_settings/browse_user_groups_list_item.hbs

```text
<div class="group-row {{#if deactivated}}deactivated-group{{/if}}" data-group-id="{{id}}" data-group-name="{{name}}">
    {{#if is_member}}
        <div class="check checked join_leave_button {{#unless can_leave}}disabled{{/unless}} {{#unless is_direct_member}}not-direct-member{{/unless}}">
            <div class="tippy-zulip-tooltip" data-tooltip-template-id="{{#if can_leave}}{{#if is_direct_member}}leave-{{id}}-group-tooltip-template{{else}}cannot-leave-{{id}}-because-of-subgroup-tooltip-template{{/if}}{{else}}cannot-leave-{{id}}-group-tooltip-template{{/if}}">
                <template id="leave-{{id}}-group-tooltip-template">
                    <span>
                        {{#tr}}
                            Leave group {name}
                        {{/tr}}
                    </span>
                </template>

                <template id="cannot-leave-{{id}}-because-of-subgroup-tooltip-template">
                    <span>
                        {{#tr}}
                            You are a member of this group because you are a member of a subgroup (<z-highlight>{associated_subgroup_names}</z-highlight>).
                            {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
                        {{/tr}}
                    </span>
                </template>

                <template id="cannot-leave-{{id}}-group-tooltip-template">
                    {{#if deactivated}}
                        <span>
                            {{#tr}}
                                You cannot leave a deactivated user group.
                            {{/tr}}
                        </span>
                    {{else}}
                        <span>
                            {{#tr}}
                                You do not have permission to leave this group.
                            {{/tr}}
                        </span>
                    {{/if}}
                </template>

                <i class="zulip-icon zulip-icon-subscriber-check sub-unsub-icon"></i>
            </div>
            <div class='join_leave_status'></div>
        </div>
    {{else}}
        <div class="check join_leave_button {{#unless can_join}}disabled{{/unless}}">
            <div class="tippy-zulip-tooltip" data-tooltip-template-id="{{#if can_join}}join-{{id}}-group-tooltip-template{{else}}cannot-join-{{id}}-group-tooltip-template{{/if}}">
                <template id="join-{{id}}-group-tooltip-template">
                    <span>
                        {{#tr}}
                            Join group {name}
                        {{/tr}}
                    </span>
                </template>

                <template id="cannot-join-{{id}}-group-tooltip-template">
                    {{#if deactivated}}
                        <span>
                            {{#tr}}
                                You cannot join a deactivated user group.
                            {{/tr}}
                        </span>
                    {{else}}
                        <span>
                            {{#tr}}
                                You do not have permission to join this group.
                            {{/tr}}
                        </span>
                    {{/if}}
                </template>

                <i class="zulip-icon zulip-icon-subscriber-plus sub-unsub-icon"></i>
            </div>
            <div class='join_leave_status'></div>
        </div>
    {{/if}}
    <div class="group-info-box">
        <div class="top-bar">
            <div class="group-name-wrapper">
                <div class="group-name">{{name}}</div>
                {{#if deactivated}}
                    <i class="fa fa-ban deactivated-user-icon"></i>
                {{/if}}
            </div>
        </div>
        <div class="bottom-bar">
            <div class="description rendered_markdown" data-no-description="{{t 'No description.'}}">{{description}}</div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: cannot_deactivate_group_banner.hbs]---
Location: zulip-main/web/templates/user_group_settings/cannot_deactivate_group_banner.hbs

```text
<div class="cannot-deactivate-group-banner main-view-banner error">
    <p class="banner-text">
        {{#if group_used_for_permissions}}
            {{t "To deactivate this group, you must first remove all permissions assigned to it."}}
        {{else}}
            {{#tr}}
                To deactivate this group, you must first remove it from all other groups. This group is currently a subgroup of: <z-supergroup-names></z-supergroup-names>.
                {{#*inline "z-supergroup-names"}}
                    {{#each supergroups}}
                        <a class="view-group-members" data-group-id="{{group_id}}" href="{{settings_url}}">{{group_name}}</a>
                        {{~#unless @last}}, {{/unless~}}
                    {{/each}}
                {{/inline}}
            {{/tr}}
        {{/if}}
    </p>
    {{#if group_used_for_permissions}}
    <button class="permissions-button main-view-banner-action-button">
        {{t "View permissions"}}
    </button>
    {{/if}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: change_user_group_info_modal.hbs]---
Location: zulip-main/web/templates/user_group_settings/change_user_group_info_modal.hbs

```text
<div>
    <label for="change_user_group_name" class="modal-field-label">
        {{t 'User group name' }}
    </label>
    <input type="text" id="change_user_group_name" class="modal_text_input" name="user_group_name" value="{{ group_name }}" maxlength="{{max_user_group_name_length}}" />
</div>

{{#if allow_editing_description}}
<div>
    <label for="change_user_group_description" class="modal-field-label">
        {{t 'User group description' }}
    </label>
    <textarea id="change_user_group_description" class="modal-textarea" name="user_group_description">{{ group_description }}</textarea>
</div>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: group_permissions.hbs]---
Location: zulip-main/web/templates/user_group_settings/group_permissions.hbs

```text
{{> ../settings/group_setting_value_pill_input
  setting_name="can_manage_group"
  label=group_setting_labels.can_manage_group
  prefix=prefix }}

{{> ../settings/group_setting_value_pill_input
  setting_name="can_mention_group"
  label=group_setting_labels.can_mention_group
  prefix=prefix }}

{{> ../settings/group_setting_value_pill_input
  setting_name="can_add_members_group"
  label=group_setting_labels.can_add_members_group
  prefix=prefix }}

{{> ../settings/group_setting_value_pill_input
  setting_name="can_remove_members_group"
  label=group_setting_labels.can_remove_members_group
  prefix=prefix }}

{{> ../settings/group_setting_value_pill_input
  setting_name="can_join_group"
  label=group_setting_labels.can_join_group
  prefix=prefix }}

{{> ../settings/group_setting_value_pill_input
  setting_name="can_leave_group"
  label=group_setting_labels.can_leave_group
  prefix=prefix }}
```

--------------------------------------------------------------------------------

---[FILE: group_permission_settings.hbs]---
Location: zulip-main/web/templates/user_group_settings/group_permission_settings.hbs

```text
<div class="group-permissions">
    <div class="realm-group-permissions group-permissions-section {{#if group_has_no_realm_permissions}}hide{{/if}}">
        <h3>{{t "Organization permissions"}}</h3>

        {{#each group_assigned_realm_permissions}}
            <div class="settings-subsection-parent {{subsection_key}} {{#unless assigned_permissions.length}}hide{{/unless}}">
                <div class="subsection-header">
                    <h3>{{subsection_heading}}</h3>
                    {{> ../settings/settings_save_discard_widget show_only_indicator=false }}
                </div>

                <div class="subsection-settings">
                    {{#each assigned_permissions}}
                        {{> ../settings/settings_checkbox
                          setting_name=setting_name
                          prefix="id_group_permission_"
                          is_checked=true
                          label=(lookup ../../all_group_setting_labels.realm setting_name)
                          is_disabled=(not can_edit)
                          tooltip_message=tooltip_message}}
                    {{/each}}
                </div>
            </div>
        {{/each}}
    </div>

    <div class="channel-group-permissions group-permissions-section {{#unless group_assigned_stream_permissions.length}}hide{{/unless}}">
        <h3>{{t "Channel permissions"}}</h3>

        {{#each group_assigned_stream_permissions}}
            {{> stream_group_permission_settings
              stream=stream
              assigned_permissions=assigned_permissions
              setting_labels=../all_group_setting_labels.stream
              id_prefix=id_prefix
              }}
        {{/each}}
    </div>

    <div class="user-group-permissions group-permissions-section {{#unless group_assigned_user_group_permissions.length}}hide{{/unless}}">
        <h3>{{t "User group permissions"}}</h3>

        {{#each group_assigned_user_group_permissions}}
            {{> user_group_permission_settings
              group_id=group_id
              group_name=group_name
              assigned_permissions=assigned_permissions
              setting_labels=../all_group_setting_labels.group
              id_prefix=id_prefix
              }}
        {{/each}}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: new_user_group_subgroup.hbs]---
Location: zulip-main/web/templates/user_group_settings/new_user_group_subgroup.hbs

```text
<tr class="user-group-subgroup-row" data-group-id="{{group_id}}">
    <td class="panel_user_list">
        {{> ../user_group_display_only_pill . strikethrough=soft_removed}}
    </td>
    <td class="empty-email-col-for-user-group"></td>
    <td class="action-column">
        {{#if soft_removed}}
            {{> ../components/action_button custom_classes="undo_soft_removed_potential_subgroup" label=(t "Add") attention="quiet" intent="neutral" aria-label=(t "Add") }}
        {{else}}
            {{> ../components/action_button custom_classes="remove_potential_subgroup" label=(t "Remove") attention="quiet" intent="neutral" aria-label=(t "Remove") }}
        {{/if}}
    </td>
</tr>
```

--------------------------------------------------------------------------------

---[FILE: new_user_group_users.hbs]---
Location: zulip-main/web/templates/user_group_settings/new_user_group_users.hbs

```text
<div class="member_list_add float-left">
    {{> add_members_form hide_add_button=true}}
</div>
<br />

<div class="create_member_list_header">
    <h4 class="user_group_setting_subsection_title">{{t 'Members preview' }}</h4>
    <input class="add-user-list-filter filter_text_input" name="user_list_filter" type="text"
      autocomplete="off" placeholder="{{t 'Filter' }}" />
</div>

<div class="add-group-member-loading-spinner"></div>

<div class="member-list-box">
    <div class="member_list_container" data-simplebar data-simplebar-tab-index="-1">
        <table class="member-list table table-striped">
            <thead class="table-sticky-headers">
                <tr>
                    <th class="panel_user_list" data-sort="alphabetic" data-sort-prop="full_name">{{t "Name" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="settings-email-column" data-sort="email">{{t "Email" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="action-column">{{t "Action" }}</th>
                </tr>
            </thead>
            <tbody id="create_user_group_members" class="member_table" data-empty="{{t 'This group has no members.' }}" data-search-results-empty="{{t 'No group members match your current filter.'}}"></tbody>
        </table>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: stream_group_permission_settings.hbs]---
Location: zulip-main/web/templates/user_group_settings/stream_group_permission_settings.hbs

```text
<div class="settings-subsection-parent" data-stream-id="{{stream.stream_id}}">
    <div class="subsection-header">
        <h3>
            {{> ../inline_decorated_channel_name stream=stream }}
        </h3>
        {{> ../settings/settings_save_discard_widget show_only_indicator=false }}
    </div>

    <div class="subsection-settings">
        {{#each assigned_permissions}}
            {{> ../settings/settings_checkbox
              setting_name=setting_name
              prefix=../id_prefix
              is_checked=true
              label=(lookup ../setting_labels setting_name)
              is_disabled=(not can_edit)
              tooltip_message=tooltip_message
              }}
        {{/each}}
    </div>
</div>
```

--------------------------------------------------------------------------------

````
