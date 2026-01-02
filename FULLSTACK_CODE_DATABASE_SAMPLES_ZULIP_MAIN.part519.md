---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 519
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 519 of 1290)

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

---[FILE: upgrade.html]---
Location: zulip-main/templates/corporate/billing/upgrade.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "upgrade" %}

{% block title %}
<title>{{ _("Upgrade") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div id="upgrade-page" class="register-account flex full-page">
    <div class="center-block new-style">
        {% if is_self_hosting_management_page and is_sponsorship_pending %}
        <div class="alert alert-success billing-page-success" id="upgrade-page-sponsorship-pending-message-top">
            This organization has requested sponsorship for a
            {% if sponsorship_plan_name == "Business" %}
            discounted
            {% endif %}
            <a href="{{ page_params.billing_base_url }}/plans/">{{ sponsorship_plan_name }}</a> plan.<br/><a href="mailto:support@zulip.com">Contact Zulip support</a> with any questions or updates.
        </div>
        {% endif %}
        {% if success_message %}
        <div class="alert alert-success billing-page-success" id="upgrade-success-message-top">
            {{ success_message }}
        </div>
        {% endif %}
        <div class="pitch">
            <h1>
                {% if page_params.free_trial_days %}
                Start free trial of
                {% else %}
                Upgrade {{ customer_name }} to
                {% endif %}
                <a href="{{ page_params.billing_base_url }}/plans/">
                    {{ plan }}
                </a>
            </h1>
        </div>
        <div class="white-box">
            <div id="upgrade-page-details">
                {% if pay_by_invoice_payments_page %}
                <div class="input-box top-of-page-notice upgrade-page-field">
                    <div class="not-editable-realm-field">
                        {% if is_free_trial_invoice_expired_notice %}
                        Your free trial of {{ free_trial_invoice_expired_notice_page_plan_name }} has expired.
                        <a href="{{ pay_by_invoice_payments_page }}" target="_blank" rel="noopener noreferrer">An invoice</a>
                        for ${{ scheduled_upgrade_invoice_amount_due }} has been sent to <b>{{ stripe_email }}</b>.
                        To reactivate your {{ free_trial_invoice_expired_notice_page_plan_name }} plan, please pay the amount due.
                        Once the invoice has been paid, reload this page to see billing details.
                        {% else %}
                        <a href="{{ pay_by_invoice_payments_page }}" target="_blank" rel="noopener noreferrer">An invoice</a>
                        {% if fixed_price_plan %}
                        for $<span class="due-today-price"></span>
                        {% endif %}
                        {% if scheduled_upgrade_invoice_amount_due %}
                        for ${{ scheduled_upgrade_invoice_amount_due }}
                        {% endif %}
                        has been sent to <b>{{ stripe_email }}</b>.
                        To complete the plan upgrade process, please pay the amount due. Once the invoice has been paid, reload this page to see billing details.
                        {% endif %}
                    </div>
                </div>
                {% else %}
                <input type="hidden" name="csrfmiddlewaretoken" value="{{ csrf_token }}" />
                <form id="autopay-form">
                    <input type="hidden" name="seat_count" value="{{ seat_count }}" />
                    <input type="hidden" name="signed_seat_count" value="{{ signed_seat_count }}" />
                    <input type="hidden" name="salt" value="{{ salt }}" />
                    {% if page_params.setup_payment_by_invoice %}
                        <input type="hidden" name="billing_modality" value="send_invoice" />
                    {% else %}
                        <input type="hidden" name="billing_modality" value="charge_automatically" />
                    {% endif %}
                    <input type="hidden" name="tier" value="{{ page_params.tier }}" />

                    <div id="free-trial-top-banner" class="input-box upgrade-page-field">
                        {% if page_params.free_trial_days %}
                        <div class="not-editable-realm-field">
                            {% if page_params.setup_payment_by_invoice %}
                            An invoice will immediately be sent to <b>{{ stripe_email }}</b>. To ensure continuous access to Zulip Basic,
                            please pay your invoice before your free trial ends on {{ free_trial_end_date }}.
                            {% else %}
                            Add a credit card to start your <b>{{ page_params.free_trial_days }}-day free trial</b> of
                            {{ plan }}. Your card will not be charged if you
                            cancel in the first {{ page_params.free_trial_days }} days.
                            {% endif %}
                        </div>
                        {% endif %}
                    </div>

                    {% if page_params.free_trial_days and not page_params.setup_payment_by_invoice %}
                    <input type="hidden" name="schedule" value="monthly" />
                    {% else %}
                    <div class="input-box upgrade-page-field">
                        <select name="schedule" id="payment-schedule-select">
                            {% if fixed_price_plan %}
                            <option value="monthly">Pay monthly</option>
                            <option value="annual">Pay annually</option>
                            {% else %}
                            <option value="monthly" id="autopay_monthly_price"></option>
                            <option value="annual" id="autopay_annual_price_per_month"></option>
                            {% endif %}
                        </select>
                        <label for="payment-schedule-select">Payment schedule</label>
                    </div>
                    {% endif %}

                    {% if complimentary_access_plan_end_date %}
                    <div class="input-box upgrade-page-field">
                        <select name="remote_server_plan_start_date" id="remote-server-plan-start-date-select">
                            <option value="billing_cycle_end_date">{{ complimentary_access_plan_end_date }}</option>
                            <option value="today">Today</option>
                        </select>
                        <label for="remote-server-plan-start-date-select">Plan start date</label>
                    </div>
                    {% endif %}

                    {% if manual_license_management %}
                    <div class="input-box upgrade-page-field" id="upgrade-manual-license-count-wrapper">
                        <label for="licenses" class="inline-block label-title">Number of licenses {% if not exempt_from_license_number_check %}(minimum {{ seat_count }}){% endif %}</label>
                        <input type="number" name="licenses" autocomplete="off" {% if not exempt_from_license_number_check %}min="{{ seat_count }}" value="{{ seat_count }}"{% endif %} autocomplete="off" id="manual_license_count" required/>
                        <div id="upgrade-licenses-change-error" class="alert alert-danger upgrade-page-error"></div>
                    </div>
                    <input type="hidden" name="license_management" value="manual" />
                    {% else %}
                    <input type="hidden" name="license_management" value="automatic" />
                    {% endif %}

                    {% if complimentary_access_plan_end_date %}
                        <div class="input-box upgrade-page-field" id="due-today-for-future-update-wrapper">
                            <label for="due-today-for-future-update" class="inline-block label-title">
                                Due today
                            </label>
                            <div id="due-today-for-future-update" class="not-editable-realm-field">
                                <h1>$0</h1>
                            </div>
                        </div>
                    {% endif %}

                    <div class="input-box upgrade-page-field">
                        <label for="due-today" class="inline-block label-title">
                            {% if complimentary_access_plan_end_date %}
                            <span id="due-today-remote-server-title">
                                Due {{ complimentary_access_plan_end_date }}
                            </span>
                            {% endif %}
                            <span id="due-today-title">
                                Due
                                {% if page_params.free_trial_days %}
                                on {{ free_trial_end_date }}
                                {% else %}
                                today
                                {% endif %}
                            </span>
                        </label>
                        <div id="due-today" class="not-editable-realm-field">
                            {% if fixed_price_plan %}
                                <h1>$<span class="due-today-price"></span></h1>
                            {% else %}
                                $<span id="pre-discount-renewal-cents"></span>
                                ($<span class="due-today-unit-price"></span> x
                                {% if not manual_license_management %}
                                    {{ seat_count }}
                                {% else %}
                                    <span class="due-today-license-count">{{ seat_count }}</span>
                                {% endif %}
                                <span class="due-today-license-count-user-plural">
                                    {{ 'user' if seat_count == 1 else 'users' }}
                                </span> x
                                <span class="due-today-duration"></span>)
                                {% if page_params.flat_discounted_months > 0 %}
                                <br/>
                                <span class="flat-discount-minus-sign">−</span>
                                <span class="flat-discount-separator">$<span class="flat-discounted-price"></span>/month off</span> <i class="billing-page-discount">({{ page_params.flat_discounted_months }} {{ "month" if page_params.flat_discounted_months == 1 else "months" }} remaining)</i>
                                {% else %}
                                <br/>
                                <i class="billing-page-discount hide">Includes: <span class="billing-page-selected-schedule-discount"></span>% discount</i>
                                {% endif %}
                                <h1>$<span class="due-today-price"></span></h1>
                                {% if page_params.free_trial_days and not manual_license_management %}
                                <i>Your actual bill will depend on the number of
                                active users in your organization.</i>
                                {% endif %}
                                {% if not manual_license_management and using_min_licenses_for_plan %}
                                    <i>Minimum purchase for this plan: {{ min_licenses_for_plan }} licenses</i>
                                {% endif %}
                            {% endif %}
                        </div>
                    </div>

                    {% if page_params.free_trial_days %}
                    {% else %}
                    <div id="license-management-details" class="input-box upgrade-page-field license-management-section">
                        {% if fixed_price_plan %}
                        <p class="not-editable-realm-field">
                            This is a fixed-price plan. You will be contacted by Zulip Sales a couple of months before the plan ends to discuss plan renewal.
                        </p>
                        {% elif not manual_license_management %}
                        <p class="not-editable-realm-field">
                            Your subscription will renew automatically. Your bill will vary based on the number of active users in your organization.
                            You can also <a href="{{ page_params.billing_base_url }}/upgrade/?manual_license_management=true&tier={{ page_params.tier }}">purchase a fixed number of licenses</a> instead.
                            {% if is_self_hosting_management_page %}
                                See <a href="/help/self-hosted-billing#how-does-manual-license-management-work" target="_blank" rel="noopener noreferrer">here</a> for details.
                            {% else %}
                                See <a href="/help/zulip-cloud-billing#how-does-manual-license-management-work" target="_blank" rel="noopener noreferrer">here</a> for details.
                            {% endif %}
                        </p>
                        <input type="hidden" name="licenses" id="automatic_license_count" value="{{ seat_count }}" />
                        {% else %}
                        <p class="not-editable-realm-field">
                            Your subscription will renew automatically. You will be able to manage the number of licenses on your organization's billing page.
                            {% if not page_params.setup_payment_by_invoice %}
                                You can also <a href="{{ page_params.billing_base_url }}/upgrade/?tier={{ page_params.tier }}">choose automatic license management</a> instead.
                                {% if is_self_hosting_management_page %}
                                    See <a href="/help/self-hosted-billing#how-does-automatic-license-management-work" target="_blank" rel="noopener noreferrer">here</a> for details.
                                {% else %}
                                    See <a href="/help/zulip-cloud-billing#how-does-automatic-license-management-work" target="_blank" rel="noopener noreferrer">here</a> for details.
                                {% endif %}
                            {% else %}
                                {% if is_self_hosting_management_page %}
                                    See <a href="/help/self-hosted-billing#how-does-manual-license-management-work" target="_blank" rel="noopener noreferrer">here</a> for details.
                                {% else %}
                                    See <a href="/help/zulip-cloud-billing#how-does-manual-license-management-work" target="_blank" rel="noopener noreferrer">here</a> for details.
                                {% endif %}
                            {% endif %}
                        </p>
                        {% endif %}
                    </div>
                    {% endif %}

                    <div {% if page_params.setup_payment_by_invoice %} id="update-invoice-billing-info" {% elif payment_method %} id="upgrade-payment-info"{% endif %}>
                        {% if page_params.setup_payment_by_invoice %}
                        {% elif payment_method %}
                        <div class="input-box upgrade-page-field" id="upgrade-payment-method-wrapper">
                            <label for="customer-payment-method-for-upgrade" class="inline-block label-title">Payment method</label>
                            <div id="customer-payment-method-for-upgrade" class="not-editable-realm-field">
                                {{ payment_method }}
                            </div>
                        </div>
                        {% endif %}
                        <div id="upgrade-payment-method-container" class="upgrade-add-card-container input-box upgrade-page-field">
                            <button id="upgrade-add-card-button" {% if page_params.setup_payment_by_invoice %}class="update-billing-information-button"{% elif payment_method %}class="update-card-button"{% endif %}>
                                <span id="upgrade-add-card-button-text">
                                    {% if page_params.setup_payment_by_invoice %}
                                    Update billing information
                                    {% elif payment_method %}
                                    Update card
                                    {% else %}
                                    Add card
                                    {% endif %}
                                </span>
                                <object class="loader upgrade-button-loader" type="image/svg+xml" data="{{ static('images/loading/loader-white.svg') }}"></object>
                            </button>
                            {% if not fixed_price_plan %}
                            <span class="not-editable-realm-field" id="upgrade-payment-by-invoice-container">
                                {% if page_params.setup_payment_by_invoice %}
                                or <a href="{{ page_params.billing_base_url }}/upgrade/?tier={{ page_params.tier }}">pay by card</a>
                                {% else %}
                                or <a href="{{ page_params.billing_base_url }}/upgrade/?manual_license_management=true&tier={{ page_params.tier }}&setup_payment_by_invoice=true" id="upgrade-payment-by-invoice-link" data-tippy-content="Requires purchasing a fixed number of licenses" data-tippy-placement="right">pay by invoice</a>
                                {% endif %}
                            </span>
                            {% endif %}
                        </div>
                        {% if not page_params.free_trial_days and payment_method %}
                        <div class="stripe-billing-information not-editable-realm-field">
                            {% if not manual_license_management %}
                            <a href="{{ page_params.billing_base_url }}/customer_portal/?tier={{ page_params.tier }}">View and update</a> billing information that will be displayed on your invoice and receipt.
                            {% else %}
                            <a href="{{ page_params.billing_base_url }}/customer_portal/?manual_license_management=true&tier={{ page_params.tier }}">View and update</a> billing information that will be displayed on your invoice and receipt.
                            {% endif %}
                        </div>
                        {% endif %}
                        <div id="upgrade-cardchange-error" class="alert alert-danger upgrade-page-error"></div>
                    </div>
                    <div class="upgrade-button-container input-box upgrade-page-field" >
                        <button id="org-upgrade-button" {% if not page_params.setup_payment_by_invoice and not payment_method %}disabled{% endif %}>
                            <span id="org-upgrade-button-text">
                                {% if complimentary_access_plan_end_date %}
                                    <span id="org-future-upgrade-button-text-remote-server">
                                        Schedule upgrade to {{ plan }}
                                    </span>
                                {% endif %}
                                <span id="org-today-upgrade-button-text">
                                    {% if page_params.free_trial_days %}
                                        Start {{ page_params.free_trial_days }}-day free trial
                                    {% elif page_params.setup_payment_by_invoice %}
                                        Send invoice
                                    {% else %}
                                        Purchase {{ plan }}
                                    {% endif %}
                                </span>
                            </span>
                            <object class="loader upgrade-button-loader" type="image/svg+xml" data="{{ static('images/loading/loader-white.svg') }}"></object>
                        </button>
                        <div id="autopay-error" class="alert alert-danger upgrade-page-error hide"></div>
                    </div>
                </form>
                <form id="upgrade-cardchange-form">
                    {% if manual_license_management %}
                    <input type="hidden" name="manual_license_management" value="true" />
                    {% endif %}
                    <input type="hidden" name="tier" value="{{ page_params.tier }}" />
                </form>
                {% endif %}
                <div class="input-box upgrade-page-field">
                    <div class="support-link not-editable-realm-field">
                        {% if pay_by_invoice_payments_page %}
                        If you have questions or need to make any changes, please contact <a href="mailto:sales@zulip.com">sales@zulip.com</a>.
                        {% else %}
                        Questions? Contact <a href="mailto:sales@zulip.com">sales@zulip.com</a>.
                        {% endif %}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{% if page_params.setup_payment_by_invoice %}
<div id="confirm-send-invoice-modal" class="micromodal" aria-hidden="true">
    <div class="modal__overlay" tabindex="-1">
        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="dialog_title">
            <header class="modal__header">
                <h1 class="modal__title dialog_heading">
                    {% if page_params.free_trial_days %}
                    Start free trial for {{ plan }}
                    {% else %}
                    Send invoice for {{ plan }}
                    {% endif %}
                </h1>
                <button class="modal__close" aria-label="{{ _('Close modal') }}" data-micromodal-close></button>
            </header>
            <main class="modal__content">
                <p>
                    Please be sure to
                    <a href="{{ page_params.billing_base_url }}/customer_portal/?manual_license_management=true&tier={{ page_params.tier }}&setup_payment_by_invoice=true" target="_blank" rel="noopener noreferrer">configure</a>
                    your billing details if you have not done so already. This information will appear on your invoice and receipt.
                    <br />
                    {% if page_params.free_trial_days %}
                    <br />
                    Starting free trial will immediately send an invoice to <b>{{ stripe_email }}</b>.
                    This is your last chance to update the billing information on your invoice.
                    {% else %}
                    Your invoice will be sent to <b>{{ stripe_email }}</b>.
                    {% endif %}
                </p>
            </main>
            <footer class="modal__footer">
                <button class="modal__button dialog_exit_button" aria-label="{{ '(Close this dialog window)' }}" data-micromodal-close>{{ _('Cancel') }}</button>
                <button class="modal__button dialog_submit_button">
                    <span>
                        {% if page_params.free_trial_days %}
                        {{ _('Send invoice and start free trial') }}
                        {% else %}
                        {{ _('Send invoice') }}
                        {% endif %}
                    </span>
                </button>
            </footer>
        </div>
    </div>
</div>
{% endif %}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: asciidoctor-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/asciidoctor-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: Asciidoctor open-source community | Zulip" %}

{% set PAGE_DESCRIPTION = "Learn how Zulip became the heart of the Asciidoctor
  community by enabling organized, inclusive and thoughtful discussion." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-pycon">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: Asciidoctor <br /> open-source community</h1>
        </div>
        <div class="hero-text">
            Learn more about using Zulip for<br /> <a href="/for/open-source/">open
            source projects</a> and <a href="/for/communities/">communities</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/asciidoctor-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: asciidoctor-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/asciidoctor-case-study.md

```text
## Asciidoctor: An active open-source community building software to share knowledge

Started in 2012, the [Asciidoctor](https://asciidoctor.org) community develops
an [open-source](https://github.com/asciidoctor) text processor for parsing
AsciiDoc content, enriching it, and converting it to formats such as HTML 5,
DocBook, PDF, and many others.

For years, the project struggled to find a way to bring the community together
in one place. Thanks to recommendations from leaders at other open-source
communities, the Asciidoctor project leads decided to give Zulip a try to see if
it could solve those challenges. “Moving to Zulip transformed our dialogue,
making it organized, inclusive, and thoughtful in a way it never was before,”
says project lead [Dan Allen](https://github.com/mojavelinux). “We finally had a
home base. Zulip has been a game changer for our community.”


> “Zulip has been a game changer for our community.”
>
> — Project lead Dan Allen


## A decade-long search for a communication platform to bring the community together

“In the early days, we started out only communicating using the GitHub issue
tracker,” Dan Allen recalls, “but we could see that it wasn’t going to scale. It
doesn’t provide a channel for general dialogue.” The project tried IRC, but it
was unapproachable for newcomers and lacked modern chat and moderation features.
Asciidoctor set up a discussion list, but that wasn’t a good fit either.
Contacting hundreds of people over email to ask a simple question always felt
inappropriate, and the lack of real-time interaction ended up making
conversations take longer.

Looking for a web-based chat solution, Asciidoctor tapped into Gitter in 2014.
“Gitter certainly looks modern and approachable. However, we quickly learned
that the single, running thread of the channel was both chaotic and stressful,”
Dan says. And the platform had mostly stagnated.

Many users in the community pleaded for threads, but Gitter’s threading feature
(finally added in 2020), only made the situation more problematic for the
community. “Threads buried the replies. You had to either navigate to threads
using notifications, or scroll back multiple pages to find the little ‘see
replies’ link and rediscover the thread. It was just so tedious,” Dan recalls.


> “The conversations in Gitter were becoming more about Gitter and its
> limitations and less about the project itself.”
>
> — Project lead Dan Allen

While Gitter allows users to create new rooms, what the project really needed
was a single community space with “socially distanced” conversations going on.
They needed a new model. And that’s exactly what they found in Zulip.


## Asciidoctor moves to Zulip: “All the anxiety and stress was gone”

With the community continuing to grow, Dan and fellow maintainers decided it was
time to seek out a better solution. Drawing on advice from leaders of other
open-source communities, the project decided to give Zulip a try in early 2021.

[Zulip’s channels and topics model](/why-zulip/) immediately clicked. “Channels
partition the community without making it feel divided. When someone has a
question, they can find the most relevant channel and either make a new topic or
contribute to an existing one.” This paradigm was a game-changer. “Literally the
day we moved to Zulip, all the anxiety and stress of keeping up with the
discourse was gone,” Dan says.

With Zulip, Dan has developed a comfortable workflow for catching up on
conversations after being away. “When I start my day, I open up the [Recent
topics](/help/recent-conversations) page and work through the topics that have
activity on-by-one,” Dan describes. More casual community participants can [skim
the topic list](/help/reading-strategies) to find interesting discussions, and
mark topics they don’t care about as read with a single click.


## Powerful moderation tools help keep conversations on track

Zulip’s topic model helps discussions stay focused. “Zulip starts the
conversation out on the right foot by giving it its own space as a topic,” Dan
explains. “As a result, conversations don’t have to be branched from an
arbitrary spot, and the discussion is much more likely to stay focused and
succinct.”

> “Zulip starts the conversation out on the right foot by giving it its own
> space as a topic.”
>
> — Project lead Dan Allen

If a topic starts in the wrong place or veers off course, Zulip’s [moderation
tools](/help/moderating-open-organizations) make it easy to fix. Community
moderators can keep the dialogue organized by reclassifying topics and posts
without disrupting the ongoing conversation. “If someone accidentally posts to
the wrong channel or topic, Zulip allows me to [move those messages
around](/help/move-content-to-another-channel) so they land in the right spot,”
Dan says. “Moving messages also sends a subtle hint to the person posting about
where to post the next time. And I can use [topic
references](/help/link-to-a-message-or-conversation#link-to-a-topic-within-zulip)
to link to the new topic location, or to a related topic. That’s incredibly
powerful,” Dan says.

The ability to [mark topics as resolved](/help/resolve-a-topic) helps moderators
see at a glance which topics require their attention. “Many topics reach a
logical conclusion when the initial question has been answered, and the initial
poster will typically express that they’re satisfied. At that point, one of us
marks the topic as resolved,” Dan explains. “When I’m looking for topics that
need my attention, I can focus on the ones that aren’t yet resolved and try to
help get them to that state.” Later on, community members can use resolved
topics [as a reference source](#zulip-makes-information-easy-to-find).


## Zulip enables organized, inclusive and thoughtful discussion

After a successful launch of the Asciidoctor community on Zulip, Asciidoctor’s
sibling project [Antora](https://antora.org) adopted it as well. For both
projects, using Zulip has been night and day compared to other platforms. “I can
manage hundreds of participants across two communities extremely efficiently,
and I don’t feel stressed,” says Dan. “I used it for my company chat as well.
Zulip is calm and organized. I can immediately see what people are asking
and jump to respond when I need to.”

> “I can manage hundreds of participants across two communities extremely
> efficiently.”
>
> — Project lead Dan Allen

The sense of space created by Zulip’s topic model has made the community more
inclusive. “Using Zulip gives space to a much broader range of voices.
We’re seeing people participating who never participated before,” Dan says.
“People who are less extroverted, who don’t speak English natively, or just
can’t type as quickly now all have a chance to be part of the dialogue. Zulip
offers a more manageable pace.”

> “We’re seeing people participating who never participated before.”
>
> — Project lead Dan Allen

Even the tone of conversation has shifted, becoming more respectful and
thoughtful. “People are more relaxed. They can think and take their time to
reply. Topics give people space. People don’t feel like they are trying to talk
over someone else. That means you can have more constructive dialogue because
the volume level is lower,” says Dan. At the same time, Zulip enables
lightweight interactions. “Often times, I participate just [using
emoji](/help/emoji-reactions). I must use the 👍 and 🎉 reactions dozens of
times a day,” Dan says.

Channels have also helped the community get to know one another better. “When we
created the instance, we set up a #social channel. We seeded it with the topic
‘introduce yourself’, and new members took full advantage of it,” Dan says. The
social channel has brought a more personal touch to the community. “In real life,
no one just walks in and starts asking questions out of the blue,” Dan points
out. “In the social channel, we’ve talked about non-technical topics like TV
series, screen setups, and holiday wishes just to get to know the people behind
the screen name and enrich each other’s lives in other ways. What we learned?
Everyone enjoys a lot of British TV. ;)”


## Zulip makes information easy to find

As a community grows, its conversation history becomes a trove of reference
information. However, this history provides value only if the information is
findable. “Once a conversation went out of view in Gitter, it was essentially
lost,” Dan says. “The search was global across the whole Gitter instance, and it
only returned excerpts with no sense of context. It was often faster to just
scroll through the history in an attempt to try to find where the conversation
happened than it was to search.”

In contrast, Zulip offers a [faceted search](/help/search-for-messages) that
lets you find past discussions with pinpoint accuracy. “You can narrow the
search to a channel or topic (with autocomplete!),” Dan points out. The results
are presented with topic headings, making it easier to see whether the message
is relevant. “You can click the topic to see the message in context,” Dan says.
“It’s not only a great way to search, but it’s a great way to catch up on
messages too. You can also search for all messages you sent, which turns out to
be a great navigation tool and a memory saver!”


## “Zulip is the heart of our community”

Dan is passionate about supporting Zulip’s development. “If we don’t sponsor the
open source projects we love, we’ll have no one else to blame if we live in a
world of proprietary software,” Dan says. “We truly feel heard by Zulip
developers when we provide feedback. We also love that Zulip is [truly open
source](https://blog.zulip.com/2021/04/28/why-zulip-is-on-github-sponsors/), not
open core like some alternatives. And we very much appreciate Zulip supporting
open source by hosting our Zulip instances.”

“Zulip is the heart of our community, and nearly everyone who participates
absolutely loves it,” Dan says. “It really does provide [everything we
need](/features/) to manage the discourse, including topic-based threads,
mentions, faceted search, moderation controls, polls, and emoji.” Speaking on
behalf of the Asciidoctor and Antora projects, Dan wholeheartedly recommends
that other communities give it a try. “Many communities have been strained to
the limits during the pandemic,” says Dan. “Zulip brings health back to these
communities.”

---

Check out our guide on using Zulip for [open source](/for/open-source/), and
learn how Zulip [helps communities scale](/for/communities/)!
```

--------------------------------------------------------------------------------

---[FILE: atolio-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/atolio-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: Atolio | Zulip" %}

{% set PAGE_DESCRIPTION = "Learn how Zulip helps create an open communication
  culture at Atolio, a distributed tech startup." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: Atolio</h1>
            <p>Distributed startup</p>
        </div>
        <div class="hero-text">
            Learn more about using Zulip for <a href="/for/business/">business</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/atolio-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

````
