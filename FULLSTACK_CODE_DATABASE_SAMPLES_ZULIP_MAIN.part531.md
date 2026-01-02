---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 531
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 531 of 1290)

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

---[FILE: engineers.html]---
Location: zulip-main/templates/corporate/role/engineers.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}
{% set PAGE_TITLE = "Why engineers love Zulip" %}
{% set PAGE_DESCRIPTION = "Learn why engineers love Zulip organized team chat." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}
{% include 'zerver/landing_nav.html'%}

<div
  id="engineers-love-zulip-page"
  class="portico-landing why-page solutions-page self-hosting-page zulip-cloud-page"
  >
    <div class="hero bg-pycon programmer">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Why engineers love Zulip</h1>
        </div>
        <div class="hero-buttons center">
            <a href="/for/business/" class="button">
                {{ _('Zulip for business') }}
            </a>
            <a href="/for/open-source/" class="button">
                {{ _('Zulip for open source') }}
            </a>
        </div>
    </div>

    <div class="alternative-features">
        <!-- Chat that helps engineers focus -->
        <div class="feature-container">
            <div class="feature-half">
                <div class="feature-text">
                    <h1>Chat that helps engineers focus (really!)</h1>
                    <p>
                        Rather than task-switching each time a new message comes
                        in, <a href="/why-zulip/">Zulip's threading model</a>
                        lets you focus on your work for a few hours, and then
                        <strong>respond asynchronously</strong>. Your messages
                        won’t interrupt newer discussions or get missed in a
                        side thread.
                    </p>
                    <p>
                        You can have
                        <strong>substantive conversations over chat</strong>,
                        instead of interrupting your flow with meetings.
                    </p>
                    <p>
                        <a
                          href="/help/mention-a-user-or-group#silently-mention-a-user"
                          >
                            Silent mentions
                        </a>
                        <b>tune down the noise</b> for non-urgent matters, and you can
                        <a href="/help/follow-a-topic">follow</a>
                        particular topics to get notified just where your timely
                        attention is needed.
                    </p>
                </div>
            </div>
            <div class="feature-half">
                <div class="feature-icon">
                    <img
                      class="image man-mobile-image grey-border"
                      alt='{{ _("Dog in glasses with a laptop") }}'
                      src="{{ static('images/landing-page/engineers/focus.jpg') }}"
                      />
                </div>
            </div>
        </div>

        <!-- Understand the context behind decisions -->
        <div class="feature-container alternate-grid">
            <div class="feature-half md-hide">
                <div class="feature-icon">
                    <img
                      class="image grey-border"
                      alt='{{ _("Screenshot of Zulip conversation") }}'
                      src="{{ static('images/landing-page/engineers/context.png') }}"
                      />
                </div>
            </div>
            <div class="feature-half">
                <div class="feature-text">
                    <h1>
                        Understand the context behind technical and product
                        decisions
                    </h1>
                    <p>
                        <b>Context is right at hand</b> when you
                        <a
                          href="/help/link-to-a-message-or-conversation#link-to-zulip-from-anywhere"
                          >
                            link to Zulip conversations
                        </a>
                        from your issue tracker, design docs, emails, code
                        comments, etc.
                    </p>
                    <p>
                        With conversations
                        <a href="/help/introduction-to-topics"
                          >organized by topic</a
                        >, you can ask <b>follow-up questions in the same space</b>,
                        even months later.
                    </p>
                    <div class="intro_quote quote-in-feature-text">
                        <blockquote>
                            “Zulip organizes ideas in such a clean and simple
                            way. You get <b>easy readability over months</b>, not just
                            hours like in other apps.”
                            <div class="author">
                                &mdash; Nathan Kaplan, Head of Global Launch
                                Operations at <a
                                href="/case-studies/windborne/">WindBorne</a>
                            </div>
                        </blockquote>
                    </div>
                </div>
            </div>
            <div class="feature-half md-display">
                <div class="feature-icon">
                    <img
                      class="image grey-border"
                      alt='{{ _("Screenshot of Zulip conversation") }}'
                      src="{{ static('images/landing-page/engineers/context.png') }}"
                      />
                </div>
            </div>
        </div>

        <!-- Monitor production systems -->
        <div class="feature-container">
            <div class="feature-half">
                <div class="feature-text">
                    <h1>
                        Monitor production systems (without making your chat a
                        mess)
                    </h1>
                    <p>
                        Zulip’s native
                        <a href="/integrations/category/monitoring">
                            monitoring tool integrations
                        </a>
                        give you the updates you need <b>without disrupting human
                        conversations</b>.
                    </p>
                    <p>
                        High-volume automations can send messages to a
                        <strong>dedicated topic</strong> in your team’s channel.
                        (Your PM and designer can
                        <a href="/help/mute-a-topic">mute</a> this one. 😉)
                        There's no separate channel to keep track of.
                    </p>
                    <p>
                        Or use a
                        <strong>separate topic for each error or incident</strong>,
                        automatically creating a lightweight discussion space
                        for each problem your team needs to solve.
                    </p>
                </div>
            </div>
            <div class="feature-half">
                <div class="message-screenshot">
                    <img
                      class="image"
                      alt='{{ _("Screenshot of Zulip conversation with sentry bot") }}'
                      src="{{ static('images/landing-page/engineers/exceptions.png') }}"
                      />
                </div>
            </div>
        </div>

        <!-- Stop stressing about missing important messages -->
        <div class="feature-container alternate-grid">
            <div class="feature-half md-hide">
                <div class="feature-icon">
                    <img
                      class="image grey-border"
                      alt='{{ _("Screenshot of Zulip inbox") }}'
                      src="{{ static('images/landing-page/engineers/inbox.png') }}"
                      />
                </div>
            </div>
            <div class="feature-half">
                <div class="feature-text">
                    <h1>Stop stressing about missing important messages</h1>
                    <p>
                        Ever miss a message because it got buried or lost in a
                        side thread? 🤦
                    </p>
                    <p>
                        In Zulip, new messages will pop their thread to the top,
                        making <b>updates easy to keep track of</b> in your
                        <a href="/help/inbox">inbox</a>,
                        <a href="/help/recent-conversations"
                          >recent conversations</a
                        >, and <a href="/help/left-sidebar">sidebar</a>.
                    </p>
                    <div class="intro_quote quote-in-feature-text">
                        <blockquote>
                            “Literally the day we moved to Zulip, all the
                            anxiety and stress of keeping up… was gone.”
                            <div class="author">
                                &mdash; Dan Allen, <a
                                href="/case-studies/asciidoctor/">Asciidoctor</a>
                                project lead
                            </div>
                        </blockquote>
                    </div>
                </div>
            </div>
            <div class="feature-half md-display">
                <div class="feature-icon">
                    <img
                      class="image grey-border"
                      alt='{{ _("Screenshot of Zulip inbox") }}'
                      src="{{ static('images/landing-page/engineers/inbox.png') }}"
                      />
                </div>
            </div>
        </div>

        <!-- Team chat as an organized knowledge base -->
        <div class="feature-container">
            <div class="feature-half">
                <div class="feature-text">
                    <h1>Team chat becomes an organized knowledge base</h1>
                    <p>
                        With conversations organized by topic, it’s easy to
                        <a href="/help/search-for-messages">find</a> discussions
                        that help you <b>understand past work</b>, expert
                        opinions, and decisions, and to <b>onboard</b> new team
                        members.
                    </p>
                    <div class="intro_quote quote-in-feature-text">
                        <blockquote>
                            “Using Zulip in a way that feels natural creates an
                            organized repository of knowledge as a side effect.”
                            <div class="author">
                                &mdash; Max McCrea, Co-founder of
                                <a
                                  href="https://monadical.com/posts/how-to-make-remote-work-part-two-zulip.html"
                                  >
                                    Monadical
                                </a>
                            </div>
                        </blockquote>
                    </div>
                    <p>
                        Zulip lets you <b>keep discussions organized</b> by
                        <a href="/move-content-to-another-channel">moving</a> or
                        <a href="/help/move-content-to-another-topic"
                          >splitting</a
                        >
                        topics when conversations digress.
                    </p>
                </div>
            </div>
            <div class="feature-half">
                <div class="feature-icon">
                    <img
                      class="mirror-image man-mobile-image grey-border"
                      alt='{{ _("Open laptop with book inside") }}'
                      src="{{ static('images/landing-page/engineers/knowledge-base.jpg') }}"
                      />
                </div>
            </div>
        </div>

        <!-- Open-source platform you can help make better -->
        <div class="feature-container alternate-grid">
            <div class="feature-half md-hide">
                <div class="feature-icon">
                    <img
                      class="image grey-border"
                      alt='{{ _("Two hands assembling puzzle") }}'
                      src="{{ static('images/landing-page/hands.jpg') }}"
                      />
                </div>
            </div>
            <div class="feature-half">
                <div class="feature-text">
                    <h1>
                        Open-source platform <em>you</em> can help make even better
                    </h1>
                    <p>
                        We are a <a href="/values/">values-focused</a> startup,
                        not a faceless mega-corporation.
                    </p>
                    <p>
                        You can
                        <a
                          href="https://zulip.readthedocs.io/en/stable/contributing/reporting-bugs.html"
                          >
                            report bugs
                        </a>
                        and
                        <a
                          href="https://zulip.readthedocs.io/en/stable/contributing/suggesting-features.html"
                          >
                            give product feedback
                        </a>
                        <b>directly to the product and engineering team</b> in
                        the
                        <a href="/development-community/">
                            Zulip development community </a
                        >.
                    </p>
                    <p>
                        <a
                          href="https://zulip.readthedocs.io/en/latest/contributing/reviewable-prs.html"
                          >
                            Submit a pull request
                        </a>
                        or
                        <a
                          href="https://zulip.readthedocs.io/en/latest/production/modify.html"
                          >
                            run a fork
                        </a>
                        to <b>fix anything</b> that’s bugging you.
                    </p>
                    <p>
                        Our support is staffed by
                        <em>thoughtful people</em> whose job is to actually
                        <b>solve your problems.</b>
                    </p>
                </div>
            </div>
            <div class="feature-half md-display">
                <div class="feature-icon">
                    <img
                      class="image grey-border"
                      alt='{{ _("Two hands assembling puzzle") }}'
                      src="{{ static('images/landing-page/hands.jpg') }}"
                      />
                </div>
            </div>
        </div>

        <div class="quote">
            <div class="triangle"></div>
            <blockquote>
                I don’t like going back to Slack now. It’s just not as efficient
                a way to organize communication.
                <div class="author">
                    &mdash; James van Lommel, Director of Engineering at
                    <a href="/case-studies/semsee/">Semsee</a>
                </div>
            </blockquote>
        </div>

        <div class="feature-grid">
            <div class="feature-end">
                <h1>
                    Fan favorite features:
                </h1>
            </div>
            <div class="feature-row">
                <!-- Powerful Markdown formatting -->
                <div class="feature-box">
                    <div class="feature-icon">
                        <img
                          src="{{ static('images/landing-page/engineers/message-square-code.svg') }}"
                          alt='{{ _("Message with code") }}'
                          />
                    </div>
                    <div class="feature-text">
                        <h1>Powerful Markdown formatting</h1>
                        <ul>
                            <li>
                                <a href="/help/code-blocks"
                                  >Zulip code blocks</a
                                >
                                come with <b>syntax highlighting</b> for over 250
                                languages, and integrated
                                <a href="/help/code-blocks#code-playgrounds"
                                  ><b>code playgrounds</b></a
                                >.
                            </li>
                            <li>
                                Code spans, media uploads, spoilers, GIFs,
                                lists, and more — <b>you control</b> how your
                                message looks.
                            </li>
                            <li>
                                Type
                                <a
                                  href="/help/format-your-message-using-markdown#latex"
                                  ><b>LaTeX</b></a
                                >
                                directly into messages, and see it beautifully
                                rendered.
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Lightning fast -->
                <div class="feature-box">
                    <div class="feature-icon">
                        <img
                          src="{{ static('images/landing-page/engineers/zap.svg') }}"
                          alt='{{ _("Lightning") }}'
                          />
                    </div>
                    <div class="feature-text list-content">
                        <h1>Lightning fast</h1>
                        <ul>
                            <li>
                                Zulip is engineered to make every interaction
                                <b>snappy</b>.
                            </li>
                            <li>
                                Dozens of
                                <a href="/help/keyboard-shortcuts"
                                  ><b>keyboard shortcuts</b></a
                                >
                                let you add and upvote emoji reactions, jump to
                                the next unread conversation, reply, and more.
                            </li>
                            <li>
                                Adjust
                                <a href="/help/font-size">font size</a> and
                                <a href="/help/line-spacing">line spacing</a> to
                                <b>make reading feel pleasant</b>, and <b>fit as much
                                information</b> as you like.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="feature-row">
                <div class="intro_quote quote-in-feature-text">
                    <blockquote>
                        “The app is extremely fast — you click, and messages
                        show up instantly.”
                        <div class="author">
                            — Erik Dittert, Head of IT at GUT contact
                        </div>
                    </blockquote>
                </div>
            </div>

            <div class="feature-row">
                <!-- Connect with other tools -->
                <div class="feature-box">
                    <div class="feature-icon">
                        <img
                          src="{{ static('images/landing-page/engineers/link.svg') }}"
                          alt='{{ _("Link") }}'
                          />
                    </div>
                    <div class="feature-text">
                        <h1>Connect with other tools</h1>
                        <ul>
                            <li>
                                <a href="/help/add-a-custom-linkifier"><b>Configure
                                linkifiers</b></a> for issues (e.g, “JIRA-1234”
                                or “#1234”), documentation pages, websites, and
                                more.
                            </li>
                            <li>
                                <b>Native integrations</b> for GitHub, Jira, and
                                <a href="/integrations/"
                                  >hundreds of other tools</a
                                >
                                can initiate new topics, creating lightweight
                                discussion spaces for each issue.
                            </li>
                            <li>
                                For a <b>smooth transition</b>, integrations
                                written for Slack can post into Zulip via the
                                <a href="/integrations/slack_incoming"
                                  >Slack compatible webhook</a
                                >.
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- You've got control -->
                <div class="feature-box">
                    <div class="feature-icon">
                        <img
                          src="{{ static('images/landing-page/engineers/ship-wheel.svg') }}"
                          alt='{{ _("Ship wheel") }}'
                          />
                    </div>
                    <div class="feature-text">
                        <h1>You've got control</h1>
                        <ul>
                            <li>
                                Make Zulip <b>suit your preferences</b> with
                                flexible settings for <a
                                href="/help/channel-notifications">notifications</a>,
                                <a
                                  href="/help/review-your-settings#review-your-privacy-settings">privacy</a>,
                                and <a
                                href="/help/review-your-settings">more</a>. You
                                can <a
                                href="/help/configure-default-new-user-settings">configure
                                default settings</a> for new users.
                            </li>
                            <li>
                                Easily write <a
                                href="/api/integrations-overview"><b>custom
                                integrations</b></a> with simple, intuitive and
                                stable <a href="/api/">APIs</a>. Pull message
                                history into an LLM without arbitrary API use
                                restrictions.
                            </li>
                            <li>
                                Keep full control of your data when you <a
                                href="/self-hosting/">self-host</a>.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="feature-row">
                <div class="intro_quote quote-in-feature-text">
                    <blockquote>
                        “If you integrate an LLM bot into Slack, you can't
                        manage its context window — off-topic messages can
                        poison the context. With Zulip, you can always just
                        start a new topic, and move messages around as needed.”
                        <div class="author">
                            — John Dean, Co-founder and CEO of WindBorne
                        </div>
                    </blockquote>
                </div>
            </div>
        </div>

        <div class="feature-end">
            <p>
                Learn how engineers at
                <a href="/case-studies/end-point/">End Point Dev</a>,
                <a href="/case-studies/atolio">Atolio</a>, and
                <a href="/case-studies/rust/">the Rust language community</a>
                are using Zulip. Please reach out to
                <a href="mailto:sales@zulip.com">sales@zulip.com</a> with any
                questions, or drop by our
                <a href="/development-community/"
                  >friendly development community</a
                >.
            </p>

            <div class="bottom-register-buttons">
                <h1>Join other engineers who love using Zulip!</h1>
                <div class="hero-buttons center">
                    <a href="/new/" class="button">
                        {{ _('Create organization') }}
                    </a>
                    <a href="/for/business/" class="button">
                        {{ _('Zulip for business') }}
                    </a>
                    <a href="/self-hosting/" class="button">
                        {{ _('Self-host Zulip') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: basic_realm_data.html]---
Location: zulip-main/templates/corporate/support/basic_realm_data.html

```text
<b>Organization type</b>: {{ get_org_type_display_name(realm.org_type) }}<br />
<b>Plan type</b>: {{ get_plan_type_name(realm.plan_type) }}<br />
<b>Non-guest user count</b>: {{ user_data.non_guest_user_count }}<br />
<b>Guest user count</b>: {{ user_data.guest_user_count }}<br />
```

--------------------------------------------------------------------------------

---[FILE: current_plan_details.html]---
Location: zulip-main/templates/corporate/support/current_plan_details.html

```text
<div class="current-plan-information">
    <p class="support-section-header">
        {% if plan_data.stripe_customer_url %}
        <a target="_blank" rel="noopener noreferrer" href="{{ plan_data.stripe_customer_url }}"><i class="fa fa-credit-card"></i></a>
        {% else %}
        <i class="fa fa-credit-card"></i>
        {% endif %}
        Current plan information:
    </p>
    {% if plan_data.warning %}
    <div class="current-plan-data-missing">
        <b>{{ plan_data.warning }}</b><br />
    </div>
    {% endif %}
    <b>Plan name</b>: {{ plan_data.current_plan.name }}<br />
    <b>Status</b>: {{ plan_data.current_plan.get_plan_status_as_text() }}<br />
    {% if plan_data.current_plan.tier == plan_data.current_plan.TIER_SELF_HOSTED_COMMUNITY %}
    <!-- Any data below doesn't makes sense for sponsored organizations. -->
    {% else %}
    {% if plan_data.current_plan.discount %}
        <b>Discount</b>: {{ plan_data.current_plan.discount }}%<br />
    {% endif %}
    {% if plan_data.is_complimentary_access_plan %}
        <b>End date</b>: {{ plan_data.current_plan.end_date.strftime('%d %B %Y') }}<br />
    {% else %}
        <b>Licenses</b>: {{ plan_data.licenses_used }}/{{ plan_data.licenses }} ({% if plan_data.current_plan.automanage_licenses %}Automatic{% else %}Manual{% endif %})<br />
        <b>Billing schedule</b>: {% if plan_data.current_plan.billing_schedule == plan_data.current_plan.BILLING_SCHEDULE_ANNUAL %}Annual{% else %}Monthly{% endif %}<br />
        {% if plan_data.current_plan.price_per_license %}
            <b>Price per license</b>: ${{ dollar_amount(plan_data.current_plan.price_per_license) }}<br />
        {% elif plan_data.current_plan.fixed_price %}
            <b>Plan type</b>: Fixed price<br />
        {% endif %}
        <b>Annual recurring revenue</b>: ${{ dollar_amount(plan_data.annual_recurring_revenue) }}<br />
        <b>Start of next billing cycle</b>: {{ plan_data.next_billing_cycle_start.strftime('%d %B %Y') }}<br />
    {% endif %}
    <a target="_blank" rel="noopener noreferrer" href="/activity/plan_ledger/{{ plan_data.current_plan.id }}/">License ledger entries</a><br />
    {% endif %}
</div>
```

--------------------------------------------------------------------------------

---[FILE: current_plan_forms_support.html]---
Location: zulip-main/templates/corporate/support/current_plan_forms_support.html

```text
<form method="POST" class="support-form">
    <b>Billing collection method</b><br />
    {{ csrf_input }}
    <input type="hidden" name="{{ remote_type }}" value="{{ remote_id }}" />
    <select name="billing_modality" class="billing-modality-select" required>
        <option value="charge_automatically" {% if current_plan.charge_automatically %}selected{% endif %}>Charge automatically</option>
        <option value="send_invoice" {% if not current_plan.charge_automatically %}selected{% endif %}>Pay by invoice</option>
    </select>
    <button type="submit" class="support-submit-button">Update</button>
</form>

{% if current_plan.status == current_plan.ACTIVE %}
<form method="POST" class="support-form">
    <b>Plan end date</b><br />
    {{ csrf_input }}
    <input type="hidden" name="{{ remote_type }}" value="{{ remote_id }}" />
    <input type="date" name="plan_end_date" {% if current_plan.end_date %}
      value="{{ current_plan.end_date.date().isoformat() }}" {% endif %} required />
    <button type="submit" class="support-submit-button">Update</button>
</form>
{% endif %}

<form method="POST" class="support-form">
    <b>Modify current plan</b><br />
    {{ csrf_input }}
    <input type="hidden" name="{{ remote_type }}" value="{{ remote_id }}" />
    <select name="modify_plan" class="modify-plan-method-select" required>
        <option disabled value="" selected>-- select --</option>
        <option value="downgrade_at_billing_cycle_end">Downgrade at the end of current billing cycle</option>
        <option value="downgrade_now_without_additional_licenses">Downgrade now without creating additional invoices</option>
        <option value="downgrade_now_void_open_invoices">Downgrade now and void open invoices</option>
        {% if not remote_support_view and not current_plan.fixed_price %}
        <option value="upgrade_plan_tier">Upgrade to the Plus plan</option>
        {% endif %}
    </select>
    <button type="submit" class="support-submit-button">Modify</button>
</form>
```

--------------------------------------------------------------------------------

---[FILE: demo_request.html]---
Location: zulip-main/templates/corporate/support/demo_request.html

```text
{% extends "zerver/portico_signup.html" %}

{% set PAGE_TITLE = "Request a demo | Zulip" %}

{% block portico_content %}
<div class="register-account flex full-page">
    <div class="center-block new-style">
        <div class="pitch">
            <h1>Request a demo</h1>
        </div>

        <form method="post" class="white-box" id="registration">
            {{ csrf_input }}

            <fieldset class="support-request">
                <div class="input-box support-form-field">
                    <label for="request_demo_form_full_name" class="inline-block label-title">Full name</label>
                    <input id="request_demo_form_full_name" class="required" type="text" name="full_name" maxlength="{{ MAX_INPUT_LENGTH }}" required />
                </div>
                <div class="input-box support-form-field">
                    <label for="request_demo_form_email" class="inline-block label-title">Email</label>
                    <input id="request_demo_form_email" class="required" type="email" name="email" required />
                </div>
                <div class="input-box support-form-field">
                    <label for="request_demo_form_role" class="inline-block label-title">Your role</label>
                    <input id="request_demo_form_role" class="required" type="text" name="role" maxlength="{{ MAX_INPUT_LENGTH }}" required />
                </div>
                <div class="input-box support-form-field">
                    <label for="request_demo_form_organization_name" class="inline-block label-title">Organization name</label>
                    <input id="request_demo_form_organization_name" class="required" type="text" name="organization_name" maxlength="{{ MAX_INPUT_LENGTH }}" required />
                </div>
                <div class="input-box support-form-field">
                    <label for="request_demo_form_organization_type" class="inline-block label-title">Organization type</label>
                    <select id="request_demo_form_organization_type" name="organization_type" class="required">
                        {% for org_type in SORTED_ORG_TYPE_NAMES %}
                            <option
                              value="{{ org_type }}">
                                {{ org_type }}
                            </option>
                        {% endfor %}
                    </select>
                </div>
                <div class="input-box support-form-field">
                    <label for="request_demo_form_organization_website" class="inline-block label-title">Organization website</label>
                    <input id="request_demo_form_organization_website" class="required" type="url" name="organization_website" required />
                </div>
                <div class="input-box support-form-field">
                    <label for="request_demo_form_expected_user_count" class="inline-block label-title">Expected number of users (approximate range)</label>
                    <input id="request_demo_form_expected_user_count" class="required" type="text" name="expected_user_count" maxlength="{{ MAX_INPUT_LENGTH }}" required />
                </div>
                <div class="input-box support-form-field">
                    <label for="request_demo_form_type_of_hosting" class="inline-block label-title">Are you interested in Zulip Cloud (SaaS) or self-hosting Zulip?</label>
                    <select id="request_demo_form_type_of_hosting" name="type_of_hosting" class="required">
                        <option value="" disabled selected>Select an option</option>
                        {% for hosting_option in TYPE_OF_HOSTING_OPTIONS %}
                            <option
                              value="{{ hosting_option }}">
                                {{ hosting_option }}
                            </option>
                        {% endfor %}
                    </select>
                </div>
                <div class="input-box support-form-field">
                    <label for="request_demo_form_message" class="inline-block label-title">How can we help?</label>
                    <textarea id="request_demo_form_message" name="message" cols="100" rows="5" required></textarea>
                </div>

                <div class="register-button-box">
                    <button class="register-button support-submit-button" type="submit">
                        <span>Submit</span>
                        <object class="loader" type="image/svg+xml" data="{{ static('images/loading/loader-white.svg') }}"></object>
                    </button>
                </div>
            </fieldset>
        </form>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: next_plan_details.html]---
Location: zulip-main/templates/corporate/support/next_plan_details.html

```text
<div class="next-plan-information">
    <p class="support-section-header">⏱️ Next plan information:</p>
    <b>Plan name</b>: {{ plan_data.next_plan.name }}<br />
    <b>Status</b>: {{ plan_data.next_plan.get_plan_status_as_text() }}<br />
    {% if plan_data.next_plan.price_per_license %}
        <b>Start date</b>: {{ plan_data.next_plan.billing_cycle_anchor.strftime('%d %B %Y') }}<br />
        <b>Billing schedule</b>: {% if plan_data.next_plan.billing_schedule == plan_data.next_plan.BILLING_SCHEDULE_ANNUAL %}Annual{% else %}Monthly{% endif %}<br />
        {% if plan_data.next_plan.discount %}
            <b>Discount</b>: {{ plan_data.next_plan.discount }}%<br />
        {% endif %}
        <b>Price per license</b>: ${{ dollar_amount(plan_data.next_plan.price_per_license) }}<br />
        <b>Estimated billed licenses</b>: {{ plan_data.current_plan.licenses_at_next_renewal() }}<br />
    {% elif plan_data.next_plan.fixed_price %}
        <b>Plan has a fixed price.</b><br />
        {% if plan_data.next_plan.sent_invoice_id %}
            <b>Payment pending for Invoice ID</b>: {{plan_data.next_plan.sent_invoice_id}}<br />
        {% endif %}
    {% endif %}
    <b>Estimated annual revenue</b>: ${{ dollar_amount(plan_data.estimated_next_plan_revenue) }}<br />
    {% if plan_data.next_plan.fixed_price %}
    <form method="POST" class="delete-next-fixed-price-plan-form">
        {{ csrf_input }}
        <input type="hidden" name="{{ remote_type }}" value="{{ remote_id }}" />
        <input type="hidden" name="delete_fixed_price_next_plan" value="true" />
        <button type="submit" class="delete-next-fixed-price-plan-button">Delete configured fixed price next plan</button>
    </form>
    {% endif %}
</div>
```

--------------------------------------------------------------------------------

---[FILE: next_plan_forms_support.html]---
Location: zulip-main/templates/corporate/support/next_plan_forms_support.html

```text
<p class="support-section-header">⏱️ Schedule plan:</p>
<form method="POST" class="support-form">
    <b>Configure fixed price plan:</b><br />
    {% if not plan_data.is_current_plan_billable %}
    <i>Enter Invoice ID only if the customer chose to pay by invoice.</i><br />
    {% endif %}
    {{ csrf_input }}
    <input type="hidden" name="{{ remote_type }}" value="{{ remote_id }}" />
    <input type="number" name="fixed_price" placeholder="Annual amount in dollars" required />
    {% if not plan_data.is_current_plan_billable %}
    <input type="text" name="sent_invoice_id" placeholder="Sent invoice ID" />
    {% endif %}
    <button type="submit" class="support-submit-button">Schedule</button>
</form>
{% if not plan_data.current_plan and remote_support_view %}
<form method="POST" class="support-form">
    <b>Configure complimentary access plan:</b><br />
    <i>Once created, the end date for the complimentary access plan can be extended.</i><br />
    {{ csrf_input }}
    <input type="hidden" name="{{ remote_type }}" value="{{ remote_id }}" />
    <input type="date" name="complimentary_access_plan" required />
    <button type="submit" class="support-submit-button">Create</button>
</form>
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: push_status_details.html]---
Location: zulip-main/templates/corporate/support/push_status_details.html

```text
<div class="push-notification-status">
    <p class="support-section-header">📶 Push notification status:</p>
    <b>Can push</b>: {{ status.can_push }}<br />
    <b>Expected end</b>: {{ format_optional_datetime(status.expected_end, True) }}<br />
    <b>Message</b>: {{ status.message }}<br />
</div>
```

--------------------------------------------------------------------------------

````
