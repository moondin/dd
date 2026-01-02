---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 758
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 758 of 1290)

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

---[FILE: invite_user_modal.hbs]---
Location: zulip-main/web/templates/invite_user_modal.hbs

```text
<div class="invite-user-modal-banners">
    <div id="invite-success-banner-container" class="banner-wrapper"></div>
    {{#if (not user_has_email_set) }}
    <div class="demo-organization-add-email-banner banner-wrapper"></div>
    {{/if}}
    {{#if development_environment}}
    <div id="dev-env-email-access-banner-container" class="banner-wrapper"></div>
    {{/if}}
    <div class="invite-setup-tips-container banner-wrapper"></div>
</div>
<form id="invite-user-form">
    <div class="input-group">
        <div id="invite_users_option_tabs_container"></div>
        <div id="invitee_emails_container">
            <label for="invitee_emails" class="modal-field-label">{{t "Emails (one on each line or comma-separated)" }}
                {{> help_link_widget link="/help/invite-new-users#send-email-invitations" }}
            </label>
            <div class="pill-container {{#unless user_has_email_set}}not-editable-by-user{{/unless}}">
                <div class="input" {{#if user_has_email_set}}contenteditable="true"{{/if}}></div>
            </div>
        </div>
    </div>
    <div class="input-group" id="receive-invite-acceptance-notification-container">
        <label class="checkbox display-block">
            <input type="checkbox" id="receive-invite-acceptance-notification" checked/>
            <span class="rendered-checkbox"></span>
            {{t "Send me a direct message when my invitation is accepted" }}
        </label>
    </div>
    <div class="input-group">
        <label for="expires_in" class="modal-field-label">{{t "Invitation expires after" }}</label>
        <select id="expires_in" name="expires_in" class="invite-user-select modal_select bootstrap-focus-style">
            {{#each expires_in_options}}
                <option {{#if this.default }}selected{{/if}} value="{{this.value}}">{{this.description}}</option>
            {{/each}}
        </select>
        <p class="time-input-formatted-description"></p>
        <div id="custom-invite-expiration-time" class="dependent-settings-block custom-time-input-container">
            <label class="modal-field-label">{{t "Custom time" }}</label>
            <input id="custom-expiration-time-input" name="custom-expiration-time-input" class="custom-time-input-value inline-block" type="text" autocomplete="off" value="" maxlength="3"/>
            <select id="custom-expiration-time-unit" name="custom-expiration-time-unit" class="custom-time-input-unit invite-user-select modal_select bootstrap-focus-style">
                {{#each time_choices}}
                    <option value="{{this.name}}">{{this.description}}</option>
                {{/each}}
            </select>
            <p class="custom-time-input-formatted-description"></p>
        </div>
    </div>
    <div class="input-group">
        <label for="invite_as" class="modal-field-label">{{t "Users join as" }}
            {{> help_link_widget link="/help/user-roles" }}
        </label>
        <select id="invite_as" name="invite_as" class="invite-user-select modal_select bootstrap-focus-style">
            <option value="{{ invite_as_options.guest.code }}">{{t "Guests" }}</option>
            <option selected="selected" value="{{ invite_as_options.member.code }}">{{t "Members" }}</option>
            {{#if is_admin}}
            <option value="{{ invite_as_options.moderator.code }}">{{t "Moderators" }}</option>
            <option value="{{ invite_as_options.admin.code }}">{{t "Administrators" }}</option>
            {{/if}}
            {{#if is_owner}}
            <option value="{{ invite_as_options.owner.code }}">{{t "Owners" }}</option>
            {{/if}}
        </select>
    </div>
    <div class="input-group">
        <label>{{t "Channels they should join" }}</label>
        <div id="streams_to_add">
            {{#if show_select_default_streams_option}}
            <div class="select_default_streams">
                <label class="checkbox display-block modal-field-label">
                    <input type="checkbox" id="invite_select_default_streams" checked="checked" />
                    <span class="rendered-checkbox"></span>
                    {{t 'Default channels for this organization'}}
                </label>
            </div>
            {{/if}}
            <div id="invite_streams_container" class="add_streams_container">
                <div class="pill-container stream_picker">
                    <div class="input" contenteditable="true"
                      data-placeholder="{{t 'Add channels' }}">
                        {{~! Squash whitespace so that placeholder is displayed when empty. ~}}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="guest_visible_users_container" class="input-group" style="display: none;">
        {{> guest_visible_users_message}}
    </div>
    {{#if show_group_pill_container}}
        <div class="input-group">
            <label class="modal-field-label">{{t "User groups they should join" }} {{> help_link_widget link="/help/user-groups"}}</label>
            <div id="user-groups-to-add">
                <div id="invite-user-group-container" class="add-user-group-container">
                    <div class="pill-container">
                        <div class="input" contenteditable="true"
                          data-placeholder="{{t 'Add user groups' }}">
                            {{~! Squash whitespace so that placeholder is displayed when empty. ~}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {{/if}}
    {{#if is_admin}}
    <div class="input-group">
        {{#if default_welcome_message_custom_text.length}}
        <label class="checkbox display-block modal-field-label">
            <input type="checkbox" id="send_default_realm_welcome_message_custom_text" checked="checked"/>
            <span class="rendered-checkbox"></span>
            {{t 'Send the default Welcome Bot message configured for this organization'}}
        </label>
        {{else}}
        <label class="checkbox display-block modal-field-label">
            <input type="checkbox" id="send_custom_welcome_message_custom_text"/>
            <span class="rendered-checkbox"></span>
            {{t 'Send a custom Welcome Bot message'}}
        </label>
        {{/if}}
        <div id="invite_welcome_message_custom_text_container">
            <label for="invite_welcome_custom_message_text" class="modal-field-label">{{t "Message text" }}</label>
            <textarea id="invite_welcome_custom_message_text" name="invite_welcome_message_custom_text" class="modal-textarea" maxlength="8000" rows="3">
                {{~default_welcome_message_custom_text~}}
            </textarea>
        </div>
    </div>
    {{/if}}
</form>
```

--------------------------------------------------------------------------------

---[FILE: keyboard_shortcuts.hbs]---
Location: zulip-main/web/templates/keyboard_shortcuts.hbs

```text
<div class="overlay-modal" id="keyboard-shortcuts" tabindex="-1" role="dialog"
  aria-label="{{t 'Keyboard shortcuts' }}">
    <div class="overlay-scroll-container" data-simplebar data-simplebar-tab-index="-1" data-simplebar-auto-hide="false">
        <div>
            <table class="hotkeys_table table table-striped table-bordered">
                <thead>
                    <tr>
                        <th colspan="2">{{t "The basics" }}</th>
                    </tr>
                </thead>
                <tr>
                    <td class="definition">{{t 'Reply to message' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd>Enter</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>R</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'New channel message' }}</td>
                    <td><span class="hotkey"><kbd>C</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'New direct message' }}</td>
                    <td><span class="hotkey"><kbd>X</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Paste formatted text' }}</td>
                    <td><span class="hotkey"><kbd>Ctrl</kbd> + <kbd>V</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Paste as plain text' }}</td>
                    <td><span class="hotkey"><kbd data-mac-following-key="⌥">Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Cancel compose and save draft' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd>Esc</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd data-mac-key="Ctrl">Ctrl</kbd> + <kbd>[</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'View drafts' }}</td>
                    <td><span class="hotkey"><kbd>D</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Next message' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd class="arrow-key">↓</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>J</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Last message' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd>End</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>Shift</kbd> + <kbd>G</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Next unread topic' }}</td>
                    <td><span class="hotkey"><kbd>N</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Next unread followed topic' }}</td>
                    <td><span class="hotkey"><kbd>Shift</kbd> + <kbd>N</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Next unread direct message' }}</td>
                    <td><span class="hotkey"><kbd>P</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Initiate a search' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd>Ctrl</kbd> + <kbd>K</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>/</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Show keyboard shortcuts' }}</td>
                    <td><span class="hotkey"><kbd>?</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go to your home view' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> <z-wrapper>or</z-wrapper> <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd data-mac-key="Ctrl">Ctrl</kbd> + <kbd>[</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<span class="go-to-home-view-hotkey-help"><kbd>Esc</kbd></span>{{/inline}}
                                {{#*inline "z-wrapper"}}<span class="go-to-home-view-hotkey-help">{{> @partial-block}}</span>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
            </table>
        </div>
        <div>
            <table class="hotkeys_table table table-striped table-bordered">
                <thead>
                    <tr>
                        <th colspan="2">{{t 'Search' }}</th>
                    </tr>
                </thead>
                <tr>
                    <td class="definition">{{t 'Initiate a search' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd>Ctrl</kbd> + <kbd>K</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>/</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Filter left sidebar' }}</td>
                    <td><span class="hotkey"><kbd>Q</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Filter users' }}</td>
                    <td><span class="hotkey"><kbd>W</kbd></span></td>
                </tr>
            </table>
        </div>
        <div>
            <table class="hotkeys_table table table-striped table-bordered">
                <thead>
                    <tr>
                        <th colspan="2">{{t 'Scrolling' }}</th>
                    </tr>
                </thead>
                <tr>
                    <td class="definition">{{t 'Previous message' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd class="arrow-key">↑</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>K</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Next message' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd class="arrow-key">↓</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>J</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Scroll up' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2> or <z-kbd-3></z-kbd-3>
                                {{#*inline "z-kbd-1"}}<kbd>PgUp</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>Fn</kbd> + <kbd class="arrow-key">↑</kbd>{{/inline}}
                                {{#*inline "z-kbd-3"}}<kbd>Shift</kbd> + <kbd>K</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Scroll down' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2> or <z-kbd-3></z-kbd-3> or <z-kbd-4></z-kbd-4>
                                {{#*inline "z-kbd-1"}}<kbd>PgDn</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>Fn</kbd> + <kbd class="arrow-key">↓</kbd>{{/inline}}
                                {{#*inline "z-kbd-3"}}<kbd>Shift</kbd> + <kbd>J</kbd>{{/inline}}
                                {{#*inline "z-kbd-4"}}<kbd>Space</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Last message' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2> or <z-kbd-3></z-kbd-3>
                                {{#*inline "z-kbd-1"}}<kbd>End</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>Fn</kbd> + <kbd class="arrow-key">→</kbd>{{/inline}}
                                {{#*inline "z-kbd-3"}}<kbd>Shift</kbd> + <kbd>G</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'First message' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd>Home</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>Fn</kbd> + <kbd class="arrow-key">←</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
            </table>
        </div>
        <div>
            <table class="hotkeys_table table table-striped table-bordered">
                <thead>
                    <tr>
                        <th colspan="2">{{t 'Navigation' }}</th>
                    </tr>
                </thead>
                <tr>
                    <td class="definition">{{t 'Go back through viewing history' }}</td>
                    <td><span class="hotkey"><kbd data-mac-key="⌘">Alt</kbd> + <kbd class="arrow-key">←</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go forward through viewing history' }}</td>
                    <td><span class="hotkey"><kbd data-mac-key="⌘">Alt</kbd> + <kbd class="arrow-key">→</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go to topic or DM conversation' }}</td>
                    <td><span class="hotkey"><kbd>S</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go to channel feed from topic view' }}</td>
                    <td><span class="hotkey"><kbd>S</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go to direct message feed' }}</td>
                    <td><span class="hotkey"><kbd>Shift</kbd> + <kbd>P</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go to list of topics for the current channel' }}</td>
                    <td><span class="hotkey"><kbd>Y</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Zoom to message in conversation context' }}</td>
                    <td><span class="hotkey"><kbd>Z</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go to next unread topic' }}</td>
                    <td><span class="hotkey"><kbd>N</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go to next unread followed topic' }}</td>
                    <td><span class="hotkey"><kbd>Shift</kbd> + <kbd>N</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go to next unread direct message' }}</td>
                    <td><span class="hotkey"><kbd>P</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Cycle between channel views' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd>Shift</kbd> + <kbd>A</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>Shift</kbd> + <kbd>D</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go to inbox' }}</td>
                    <td><span class="hotkey"><kbd>Shift</kbd> + <kbd>I</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go to recent conversations' }}</td>
                    <td><span class="hotkey"><kbd>T</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go to combined feed' }}</td>
                    <td><span class="hotkey"><kbd>A</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go to starred messages' }}</td>
                    <td><span class="hotkey"><kbd>*</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Go to the conversation you are composing to' }}</td>
                    <td><span class="hotkey"><kbd>Ctrl</kbd> + <kbd>.</kbd></span></td>
                </tr>
            </table>
        </div>
        <div>
            <table class="hotkeys_table table table-striped table-bordered">
                <thead>
                    <tr>
                        <th colspan="2">{{t 'Composing messages' }}</th>
                    </tr>
                </thead>
                <tr>
                    <td class="definition">{{t 'New channel message' }}</td>
                    <td><span class="hotkey"><kbd>C</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'New direct message' }}</td>
                    <td><span class="hotkey"><kbd>X</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Reply to message' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd>Enter</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>R</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Quote message' }}</td>
                    <td><span class="hotkey"><kbd>></kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Forward message' }}</td>
                    <td><span class="hotkey"><kbd>&lt;</kbd></span></td> <!-- &lt; is the HTML entity for < -->
                </tr>
                <tr>
                    <td class="definition">{{t 'Reply directly to sender' }}</td>
                    <td><span class="hotkey"><kbd>Shift</kbd> + <kbd>R</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Reply @-mentioning sender' }}</td>
                    <td><span class="hotkey"><kbd>@</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Send message' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> then <z-kbd-2></z-kbd-2> or <z-kbd-3></z-kbd-3>
                                {{#*inline "z-kbd-1"}}<kbd>Tab</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd>Enter</kbd>{{/inline}}
                                {{#*inline "z-kbd-3"}}<kbd>Ctrl</kbd> + <kbd>Enter</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Insert new line' }}</td>
                    <td><span class="hotkey"><kbd>Shift</kbd> + <kbd>Enter</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Use or create a saved snippet' }}</td>
                    <td><span class="hotkey"><kbd>Ctrl</kbd> + <kbd>'</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Toggle preview mode' }}</td>
                    <td><span class="hotkey"><kbd>Alt</kbd> + <kbd>P</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Cancel compose and save draft' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd>Esc</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd data-mac-key="Ctrl">Ctrl</kbd> + <kbd>[</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
            </table>
        </div>
        <div>
            <table class="hotkeys_table table table-striped table-bordered">
                <thead>
                    <tr>
                        <th colspan="2">{{t 'Message actions' }}</th>
                    </tr>
                </thead>
                <tr>
                    <td class="definition">{{t 'Edit your last message' }}</td>
                    <td><span class="hotkey"><kbd class="arrow-key">←</kbd></span></td>
                </tr>
                <tr id="edit-message-hotkey-help">
                    <td class="definition">{{t 'Edit selected message or view source' }}</td>
                    <td><span class="hotkey"><kbd>E</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t "Show message sender's user card"   }}</td>
                    <td><span class="hotkey"><kbd>U</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'View read receipts' }}</td>
                    <td><span class="hotkey"><kbd>Shift</kbd> + <kbd>V</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Show images in thread' }}</td>
                    <td><span class="hotkey"><kbd>V</kbd></span></td>
                </tr>
                <tr id="move-message-hotkey-help">
                    <td class="definition">{{t 'Move messages or topic' }}</td>
                    <td><span class="hotkey"><kbd>M</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'View edit and move history' }}</td>
                    <td><span class="hotkey"><kbd>Shift</kbd> + <kbd>H</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Star selected message' }}</td>
                    <td><span class="hotkey"><kbd>Ctrl</kbd> + <kbd>S</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Add emoji reaction to selected message' }}</td>
                    <td><span class="hotkey"><kbd>:</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Toggle first emoji reaction on selected message' }}</td>
                    <td><span class="hotkey"><kbd>=</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition rendered_markdown">
                        {{t 'React to selected message with' }}
                        <img alt=":thumbs_up:"
                          class="emoji"
                          src="../../static/generated/emoji/images/emoji/unicode/1f44d.png"
                          title=":thumbs_up:"/>
                    </td>
                    <td><span class="hotkey"><kbd>+</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Mark as unread from selected message' }}</td>
                    <td><span class="hotkey"><kbd>Shift</kbd> + <kbd>U</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Collapse/show selected message' }}</td>
                    <td><span class="hotkey"><kbd>-</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Toggle topic mute' }}</td>
                    <td><span class="hotkey"><kbd>Shift</kbd> + <kbd>M</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Copy link to message' }}</td>
                    <td><span class="hotkey"><kbd>L</kbd></span></td>
                </tr>
            </table>
        </div>
        <div>
            <table class="hotkeys_table table table-striped table-bordered">
                <thead>
                    <tr>
                        <th colspan="2">{{t 'Recent conversations' }}</th>
                    </tr>
                </thead>
                <tr>
                    <td class="definition">{{t 'View recent conversations' }}</td>
                    <td><span class="hotkey"><kbd>T</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Filter topics' }}</td>
                    <td><span class="hotkey"><kbd>T</kbd></span></td>
                </tr>
            </table>
        </div>
        <div>
            <table class="hotkeys_table table table-striped table-bordered">
                <thead>
                    <tr>
                        <th colspan="2">{{t 'Drafts' }}</th>
                    </tr>
                </thead>
                <tr>
                    <td class="definition">{{t 'View drafts' }}</td>
                    <td><span class="hotkey"><kbd>D</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Edit selected draft' }}</td>
                    <td><span class="hotkey"><kbd>Enter</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Delete selected draft' }}</td>
                    <td><span class="hotkey"><kbd>Backspace</kbd></span></td>
                </tr>
            </table>
        </div>
        <div>
            <table class="hotkeys_table table table-striped table-bordered">
                <thead>
                    <tr>
                        <th colspan="2">{{t 'Menus' }}</th>
                    </tr>
                </thead>
                <tr>
                    <td class="definition">{{t 'Toggle the gear menu' }}</td>
                    <td><span class="hotkey"><kbd>G</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Open personal menu' }}</td>
                    <td><span class="hotkey"><kbd>G</kbd><kbd class="arrow-key">→</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Open help menu' }}</td>
                    <td><span class="hotkey"><kbd>G</kbd><kbd class="arrow-key">←</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Open message menu' }}</td>
                    <td><span class="hotkey"><kbd>I</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Show keyboard shortcuts' }}</td>
                    <td><span class="hotkey"><kbd>?</kbd></span></td>
                </tr>
            </table>
        </div>
        <div>
            <table class="hotkeys_table table table-striped table-bordered">
                <thead>
                    <tr>
                        <th colspan="2">{{t 'Channel settings' }}</th>
                    </tr>
                </thead>
                <tr>
                    <td class="definition">{{t 'Scroll through channels' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd class="arrow-key">↑</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd class="arrow-key">↓</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Switch between tabs' }}</td>
                    <td>
                        <span class="hotkey">
                            {{#tr}}
                                <z-kbd-1></z-kbd-1> or <z-kbd-2></z-kbd-2>
                                {{#*inline "z-kbd-1"}}<kbd class="arrow-key">←</kbd>{{/inline}}
                                {{#*inline "z-kbd-2"}}<kbd class="arrow-key">→</kbd>{{/inline}}
                            {{/tr}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="definition">{{t 'View channel messages' }}</td>
                    <td><span class="hotkey"><kbd>Shift</kbd> + <kbd>V</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Subscribe to/unsubscribe from selected channel' }}</td>
                    <td><span class="hotkey"><kbd>Shift</kbd> + <kbd>S</kbd></span></td>
                </tr>
                <tr>
                    <td class="definition">{{t 'Create new channel' }}</td>
                    <td><span class="hotkey"><kbd>N</kbd></span></td>
                </tr>
            </table>
        </div>
        <hr />
        <a href="/help/keyboard-shortcuts" target="_blank" rel="noopener noreferrer">{{t 'Detailed keyboard shortcuts documentation' }}</a>
    </div>
</div>
```

--------------------------------------------------------------------------------

````
