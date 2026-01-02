---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 516
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 516 of 1290)

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

---[FILE: values.md]---
Location: zulip-main/templates/corporate/values.md

```text
## Building software that will always be there for our users

When choosing software that will be core to how one’s organization operates,
such as a team chat platform, there is an important question: “Will this product
still exist and be responsibly maintained in a few years?”

We have designed our company, community, and technology with the explicit goal
of Zulip being actively developed for many years to come.

This theme cuts across many of the decisions described below. It is also
reflected in our [history](/history/): Zulip's [earliest
customers](/case-studies/recurse-center/) have enjoyed uninterrupted service
since 2013.

## Keeping Zulip 100% open source

Many modern “open-source” companies use a version of their product with some
basic functionality intentionally removed as a demo for their non-open-source
paid product. In contrast, we are committed to keeping Zulip [100% open
source](https://github.com/zulip/zulip#readme).

When you [self-host Zulip](/self-hosting/), you get all the
[features](/features/) of our cloud offering. We work hard to [make it
easy](https://zulip.readthedocs.io/en/latest/production/install.html) to set up
and run a self-hosted Zulip installation without paying us a dime, which is why
thousands of organizations do so.

## Investing in community and mentorship

Zulip is developed by a [vibrant open-source community](/team/), and we are
fully committed to helping bring up the next generation of open-source
contributors from a wide range of backgrounds.

We have invested into making Zulip’s code uniquely readable, well tested, and
easy to modify. Beyond that, we have written an extraordinary 185K words of
documentation on [how to contribute to
Zulip](https://zulip.readthedocs.io/en/latest/overview/contributing.html), with
topics ranging from [practical Git
tips](https://zulip.readthedocs.io/en/latest/git/index.html) to [essays on
important architectural
decisions](https://zulip.readthedocs.io/en/latest/subsystems/events-system.html).

We also welcome and support contributors via [formal internship
programs](https://zulip.readthedocs.io/en/latest/outreach/overview.html), with
over 100 participants since 2016. Because of the thousands of hours our more
senior contributors (including alumni of these programs!) have dedicated to
mentorship, many of these participants have told us that they learned more
contributing to Zulip than in their 4-year formal computer science education.

## Building a sustainable business aligned with our values

Guiding the Zulip community in developing a world-class organized team chat
product with apps for every major desktop and mobile platform requires
leadership from a talented, dedicated team. We believe that the only sustainable
model is for our core team to be compensated fairly for their time. We have thus
**founded a company (Kandra Labs) to steward and financially support Zulip’s
development**.

We are **growing our business sustainably**, without venture capital funding.
VCs are incentivized to push companies to gamble for explosive growth. Often,
the result is that a company with a useful product burns rapidly through its
resources and goes out of business. We have built Zulip as a sustainable
business (also supported by [SBIR grants](https://seedfund.nsf.gov/) from the US
National Science Foundation), and are being thoughtful about our pace of
spending.

Funding our company without venture capital also allows us to **live by our
values**, without investor pressure to compromise them when doing so might be
“good business” or “what everyone does”.

Finally, **we’re building software that is easy to maintain,** so it does
not require a large team to keep the lights on. We have consistently emphasized
high standards for codebase readability, code review, commit discipline,
debuggability, automated testing, tooling, documentation, and all the other
subtle details that together determine whether software is easy to understand,
operate, and modify.


## Supporting other worthy organizations

An important part of Zulip’s mission is ensuring that worthy organizations, from
[programming-language developers](/case-studies/rust/) to [research
communities](/case-studies/lean/), are able to use Zulip whether or not they
have funding.

We sponsor [Zulip Cloud Standard](/plans/) hosting for [open-source
projects](/for/open-source/), [research groups](/for/research/),
[education](/for/education/), [non-profits](/for/communities/) and other
[communities](/for/communities/). This program has grown exponentially since its
inception; today we are proud to fully sponsor Zulip hosting for hundreds of
organizations.
```

--------------------------------------------------------------------------------

---[FILE: why-zulip.html]---
Location: zulip-main/templates/corporate/why-zulip.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Why Zulip? Efficient communication with organized team chat." %}

{% set PAGE_DESCRIPTION = "Make better decisions, faster with chat that’s
  organized right. Follow the discussions that matter to you, easily and
  efficiently, in real time or asynchronously." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page">
    <div class="hero bg-pycon why-zulip">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Why Zulip?</h1>
            <p>Efficient communication with organized team chat.</p>
        </div>
        <div class="hero-buttons center">
            <a href="/new/" class="button">
                {{ _('Create organization') }}
            </a>
            <a href="/request-demo/" class="button">
                {{ _('Get a demo') }}
            </a>
        </div>
    </div>


    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/why-zulip.md') }}
            </div>
        </div>
    </div>

    <div class="why-zulip">
        <div class="discounts-section">
            <header>
                <h2>Learn how Zulip can help your organization collaborate effectively!</h2>
            </header>
            <div class="register-buttons">
                <a href="/for/business/" class="register-now button">Business</a>
                <a href="/for/open-source/" class="register-now button">Open source</a>
                <a href="/for/education/" class="register-now button">Education</a>
                <a href="/for/events/" class="register-now button">Events and conferences</a>
                <a href="/for/research/" class="register-now button">Research</a>
                <a href="/for/communities/" class="register-now button">Communities</a>
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: why-zulip.md]---
Location: zulip-main/templates/corporate/why-zulip.md

```text
## Choosing the right tools for efficient communication can provide a massive productivity boost.

Communication consumes a [huge fraction of
time](https://blog.rescuetime.com/slack-and-email-cost/) in an organization. [A
recent
survey](https://www.grammarly.com/business/Grammarly_The_State_Of_Business_Communication.pdf)
found that knowledge workers spend half of their work day on communication, yet
72% of business leaders observe that their team struggles to communicate
effectively. [The
report](https://www.grammarly.com/business/Grammarly_The_State_Of_Business_Communication.pdf)
estimates that businesses lose an average of over $1,000/month *for each
employee* due to ineffective communication.

One of the most impactful ways to improve communication in your organization is
choosing tools that enable efficient communication.

**We created Zulip to empower teams to collaborate effectively**, so that they
can accomplish amazing things together. As you’ll learn below, Zulip’s organized
team chat app makes communication dramatically more efficient than other popular
apps like Slack and Microsoft Teams, which push teams towards chaotic and
disruptive communication patterns.

Switching to Zulip is thus one of the best ways to **increase the overall
productivity of your team**.

> Zulip is everything Slack is, but it's smarter and more powerful.
>
> — [Zulip review in The Register](https://www.theregister.com/2021/07/28/zulip_open_source_chat_collaboration_software/)

<br />

## Zulip’s unique topic-based threading model makes efficient communication possible. Here’s how.

In Zulip, **channels** determine who gets a message. Each conversation within a
channel is labeled with a **topic**, which keeps everything organized.

You can read Zulip one conversation at a time, seeing each message in context,
no matter how many other conversations are going on.

If anything is out of place, it’s easy to move messages, rename and split
topics, or even move a topic to a different channel.

![Channels and topics](/static/images/landing-page/why-zulip/channels-and-topics.png)

<br />

> We switched to Zulip after trying pretty much every chat app out there. And
> it’s been amazing. The threading-by-topic system is genius. It keeps every
> conversation in its lane and makes catching up effortless. We’ve cut down on
> meeting time and repetitive messaging, which easily saves us hours each week.
> The async setup means no one feels pressured to respond instantly, but nothing
> slips through the cracks either.
> <br /> <br />
> It’s fast, reliable, and honestly feels like
> the way team chat should work. Once you’ve used Zulip, other tools just feel
> outdated.
>
> — Deepak Shukla, Founder and CEO of [Pearl Lemon](https://pearllemon.com/)

<br />

## Zulip makes it easy to follow relevant conversations.

With well-organized chat that shows each message in context, it’s easy to stay
informed and connected. Everyone can follow and contribute to discussions that
matter to them, without wasting time reading every message, or stressing about
missing something important.

> “Slack’s interface was too slow and clunky, and the more channels you’re in,
> the harder it is to use. Zulip’s UI makes it easy to access all the information you
> need.”
>
> — Jon Jensen, CTO of [End Point Dev](https://www.endpointdev.com/about/) software
> consultancy ([case study](/case-studies/end-point/))

- **Read each message in context.**
With each conversation in its own space, you can coordinate multiple projects,
hold a virtual standup, and plan the next team social — all in one place. No
more scrolling up and down through dozens of messages to track down all parts of
a conversation. No more context-switching again and again as you catch up on
your chat messages.

- **Find the conversations that matter to you.**
Conversations are well-organized and labeled, so you will never again wade
through hundreds of messages to avoid missing the few that are important.
Leaders and cross-functional collaborators can quickly review busy communication
channels for places where their input is needed.

- **Never miss an important message.**
New messages will pop a long-running thread to the top, rather than languishing
in a forgotten sidebar. You’ll never create a new channel (and later forget to
check it) because your team’s main channel is busy — a busy channel
works just fine in Zulip! For timely messages, Zulip alerts you with [fully
customizable](/help/channel-notifications) mobile, email and desktop
notifications.

>  “With Zulip, I can manage hundreds of participants across two communities
>  extremely efficiently, and I don’t feel stressed.”
>
> — Dan Allen, [Asciidoctor](https://asciidoctor.org/) open-source project lead ([case
> study](/case-studies/asciidoctor/))

<br />

## Zulip empowers teams to work flexibly anytime, from anywhere, without interruptions.

With organized team chat that is designed for both synchronous and asynchronous
communication, everyone can be included in decision-making without being online
at the same time. Team members can focus when they need to, and contribute to
discussions asynchronously without interrupting their flow.

> “Zulip lets us move faster, connect with each other better, and have
> interactive technical discussions that are organized, recorded, and welcoming
> to other people.”
>
>  — Josh Triplett, [Rust Language
>  team](https://www.rust-lang.org/governance/teams/lang) co-lead ([case
>  study](/case-studies/rust/))

- **Take advantage of everyone’s expertise.**
Zulip’s topics make it easy to pick up a conversation thread hours (or days!)
later. With other chat tools, being unavailable when a discussion is happening
often means your perspective will never be heard. Zulip enables asynchronous
participation — feedback from team members who were in a meeting or work
from another time zone is seamlessly incorporated into the discussion.

- **Create focus time.**
Zulip removes the stress of needing to respond to chat messages right away.
Rather than task-switching each time a new message comes in, you can focus on
your work for a few hours, and then follow up asynchronously on conversations
you’d like to participate in. Knowledge workers will be happier and more
productive when only truly urgent messages interrupt their flow.

- **Integrate feedback from leaders.**
Since Zulip works great for asynchronous follow-ups, leaders with busy schedules
can weigh in easily and effectively when they are available. There is no need
for a barrage of @-mentions to get leaders’ attention, and the full context for
the decision is right there in the conversation thread for everyone's quick
reference.

> “Using Zulip significantly increases the size of the team for which a manager
> can meaningfully know what’s going on.”
>
> — Gaute Lund, co-founder of iDrift AS company ([case
> study](/case-studies/idrift/))

<br />

## Zulip helps you make better decisions, faster.

With an integrated communication hub that works great for everything from quick
check-ins to collaborating on the most challenging problems, you can make
decisions without the inefficiency of time-consuming group meetings, chaotic
chat channels, or clunky back-and-forth over email.

> Zulip’s topic-based threading helps us manage discussions with clarity,
> ensuring the right people can pay attention to the right messages. This
> makes our large-group discussion far more manageable than what we’ve
> experienced with Skype and Slack.
>
> — Grahame Grieve, founder of [FHIR](https://www.hl7.org/fhir/overview.html)
> health care standards body

- **Have substantive conversations over chat.**
With Zulip, there’s no longer a reason to email your teammates — you get the
organization of an email inbox together with all the features of a modern chat
app, like instant delivery of messages, emoji reactions, typing notifications,
@-mentions, and more.

- **Reduce reliance on meetings.**
Using Zulip, you can discuss complex topics and make decisions with input from
all stakeholders, without the overhead of scheduling meeting. Your team's
time and energy will be spent focusing on their work, not dialing into calls.

- **Understand past decisions.**
With conversations organized by topic, you can review prior discussions to
understand past work, explanations, and decisions — your chat history becomes a
knowledge base. If a conversation shifts to a new topic, it’s easy to reorganize
by moving messages to a different [topic](/help/move-content-to-another-topic)
or [channel](/help/move-content-to-another-channel). There is no more rifling
through unrelated chatter to find the context you need.  You can even [link to a
Zulip
conversation](/help/link-to-a-message-or-conversation#link-to-zulip-from-anywhere)
from emails, docs, issue trackers, code comments, or anywhere else.

> “Switching to Zulip has turned out to be one of the best
> decisions we’ve made.”
>
> — Nick Bergson-Shilcock, [Recurse Center](https://www.recurse.com/) co-founder
> and CEO ([case study](/case-studies/recurse-center/))
```

--------------------------------------------------------------------------------

---[FILE: zulip-cloud.html]---
Location: zulip-main/templates/corporate/zulip-cloud.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Zulip Cloud" %}

{% set PAGE_DESCRIPTION = "Reliable and convenient SaaS hosting for Zulip
  organized team chat." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page self-hosting-page zulip-cloud-page">
    <div class="hero bg-pycon clouds">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Zulip Cloud</h1>
            <p class="hero-description">Reliable and convenient SaaS hosting.</p>
        </div>
        <div class="hero-buttons center">
            <a href="/new" class="button">
                {{ _('Get started') }}
            </a>
            <a href="/request-demo/" class="button">
                {{ _('Get a demo') }}
            </a>
        </div>
    </div>

    <div class="alternative-features">
        <div class="feature-container">
            <div class="feature-half">
                <div class="feature-text">
                    <h1>
                        Ultimate convenience without lock-in.
                    </h1>
                    <p>
                        You can <a href="/new/">sign up</a> for Zulip Cloud in under a minute, and
                        move to a <a href="/self-hosting/">self-hosted server</a> or another service any
                        time.
                    </p>
                    <p>
                        Zulip is <a href="https://github.com/zulip">100%
                        open-source</a> software. You aren't subject to a
                        mega-corporation's whims.
                    </p>
                </div>
            </div>
            <div class="feature-half">
                <div class="feature-icon">
                    <img class="mirror-image man-mobile-image" alt="" src="{{ static('images/landing-page/education/mobile.svg') }}" />
                </div>
            </div>
        </div>

        <div class="feature-container alternate-grid">
            <div class="feature-half md-hide">
                <div class="feature-icon">
                    <img class="mirror-image" alt="" src="{{ static('images/landing-page/education/privacy.svg') }}" />
                </div>
            </div>
            <div class="feature-half">
                <div class="feature-text">
                    <h1>
                        Your space. Your data.
                    </h1>
                    <p>
                        Unlike other vendors, we believe that you should control
                        your data. No <a
                        href="https://blog.zulip.com/2025/07/24/who-owns-your-slack-history/">
                        arbitrary restrictions</a>. No ads. No LLM training on your conversations.
                    </p>
                    <p>
                        Connect Zulip to other tools with <a href="/integrations/">native
                        integrations</a> and powerful <a href="/api/">APIs</a>. An easy-to-use <a
                        href="https://zulip.com/api/writing-bots">bot
                        framework</a>
                        lets you <a
                        href="/case-studies/windborne/#the-perfect-platform-for-llm-bots">bring
                        your own</a> preferred AI tools.
                    </p>
                </div>
            </div>
            <div class="feature-half md-display">
                <div class="feature-icon">
                    <img class="mirror-image" alt="" src="{{ static('images/landing-page/education/privacy.svg') }}" />
                </div>
            </div>
        </div>

        <div class="feature-container">
            <div class="feature-half">
                <div class="feature-text">
                    <h1>
                        Operated by experts.
                    </h1>
                    <p>
                        Zulip Cloud is operated by the core team developing
                        Zulip, with deep expertise in running your
                        mission-critical chat software with <a href="https://status.zulip.com/">minimal downtime</a>.
                        Making sure your information stays protected is <a
                        href="/security/">our highest priority.</a>
                    </p>
                </div>
            </div>
            <div class="feature-half">
                <div class="feature-icon">
                    <img alt="" src="{{ static('images/landing-page/education/flexible-administration.svg') }}" />
                </div>
            </div>
        </div>

        <div class="feature-container alternate-grid">
            <div class="feature-half md-hide">
                <div class="feature-icon">
                    <img class="mirror-image" alt="" src="{{ static('images/landing-page/zulip-cloud/support.svg') }}" />
                </div>
            </div>
            <div class="feature-half">
                <div class="feature-text">
                    <h1>
                        Supported by humans who care.
                    </h1>
                    <p>
                        Our support is staffed by <i>real people</i> whose goal
                        is to actually <i>solve your problems</i>.
                    </p>
                    <p>
                        You can <a
                        href="https://zulip.readthedocs.io/en/stable/contributing/reporting-bugs.html">report
                        bugs</a> and <a
                        href="https://zulip.readthedocs.io/en/stable/contributing/suggesting-features.html">give
                        product feedback</a>
                        directly to the product and engineering team in the <a
                        href="/development-community/">Zulip development
                        community</a>.
                    </p>
                    <div class="intro_quote quote-in-feature-text">
                        <blockquote>
                            The Zulip team are very responsive to issue reports and requests, both
                            in their community and over email.
                            <div class="author">
                                &mdash; Neil W., CMO (<a href="https://www.g2.com/products/zulip/reviews/zulip-review-11898513">G2 review</a>)
                            </div>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="quote">
        <div class="triangle"></div>
        <blockquote>
            The Zulip Cloud hosting has been bulletproof — we haven’t had any down time.
            <div class="author">
                &mdash;  Gareth Watts, co-founder and CTO of <a href="/case-studies/atolio/">Atolio</a>
            </div>
        </blockquote>
    </div>

    <div class="feature-grid">
        <div class="feature-row">
            <div class="feature-box">
                <div class="feature-icon">
                    <img alt="" src="{{ static('images/landing-page/self-hosting/growth.png') }}" />
                </div>
                <div class="feature-text">
                    <h1>
                        Get the latest & greatest.
                    </h1>
                    <p>
                        Zulip Cloud is updated with new features and
                        improvements as soon as they are production-ready. (<a
                        href="https://blog.zulip.com/tag/major-releases/">Major
                        self-hosted versions</a> are released twice a year.)
                    </p>
                    <p>
                        We're making <a
                        href="https://github.com/zulip/zulip/graphs/commit-activity">dozens
                        of improvements</a> each week!
                    </p>
                </div>
            </div>
            <div class="feature-box">
                <div class="feature-icon">
                    <img alt="" src="{{ static('images/landing-page/zulip-cloud/free.png') }}" />
                </div>
                <div class="feature-text">
                    <h1>
                        Free to get started.
                    </h1>
                    <p>
                        With Zulip Cloud Free, you get everything you need for
                        exploring the product or casual use. <a
                        href="/help/zulip-cloud-billing#free-and-discounted-zulip-cloud-standard">Eligible
                        organizations</a>
                        are encouraged to join our generous sponsorship program.
                    </p>
                    <p>
                        If regular Zulip Cloud pricing is unaffordable for your
                        organization, please contact <a
                        href="mailto:sales@zulip.com">sales@zulip.com</a>.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="portico-pricing showing-cloud">
        {% with %}
        {% set rendering_page="cloud" %}
        {% include "corporate/pricing_model.html" %}
        {% endwith %}
    </div>

</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: zulipchat_migration_tos.html]---
Location: zulip-main/templates/corporate/zulipchat_migration_tos.html

```text
<div class="description">
    <p>
        {% trans %}
        This team chat is now being hosted on Zulip Cloud. Please accept the <a href="https://zulip.com/policies/terms">Zulip Terms of Service</a> to continue.
        {% endtrans %}
    </p>
</div>
```

--------------------------------------------------------------------------------

---[FILE: activity.html]---
Location: zulip-main/templates/corporate/activity/activity.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "activity" %}

{# Template for installation activity pages #}

{% block title %}
<title>{{ title }} | Zulip analytics</title>
{% endblock %}


{% block content %}
<div class="activity-page">
    {% if not is_home %}
    <a class="show-all" href="/activity">Home</a>
    <br />
    {% endif %}

    <div>
        {{ data|safe }}
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: activity_table.html]---
Location: zulip-main/templates/corporate/activity/activity_table.html

```text
<h3>{{ data.title }} {% if data.title_link %}{{ data.title_link }}{% endif %}</h3>

{% if data.title == "Remote servers" %}
{% include "corporate/activity/remote_activity_key.html" %}
{% endif %}

{% if data.header %}
<div class="activity-header-information">
    {% for entry in data.header %}
    <p class="activity-header-entry"><b>{{ entry.name }}</b>: {{ entry.value }}</p>
    {% endfor %}
</div>
{% endif %}

{{ data.rows|length}} rows
<table class="table sortable table-striped table-bordered analytics-table">

    <thead class="activity-head">
        <tr>
            {% for col in data.cols %}
            <th>{{ col }}</th>
            {% endfor %}
        </tr>
    </thead>
    <tbody>
        {% for row in data.rows %}
        <tr {% if row.row_class %}class="{{ row.row_class }}"{% endif %}>
            {% for field in row.cells %}
            <td sortable>{{ field }}</td>
            {% endfor %}
        </tr>
        {% endfor %}
    </tbody>
    {% if data.totals %}
    <tfoot class="activity-foot">
        <tr>
            {% for total in data.totals %}
            <td>{{ total }}</td>
            {% endfor %}
        </tr>
    </tfoot>
    {% endif %}
</table>
```

--------------------------------------------------------------------------------

---[FILE: installation_activity_table.html]---
Location: zulip-main/templates/corporate/activity/installation_activity_table.html

```text
<h3 class="installation-activity-header">Installation activity: {{ num_active_sites }} active sites</h3>

<p class="installation-activity-header">{{ utctime }}</p>

<h4>Other views:</h4>
<ul>
    <li><a href="/stats/installation">Server total /stats style graphs</a></li>
    <li><a href="/activity/remote">Remote servers</a></li>
    <li><a href="/activity/integrations">Integrations by client</a></li>
    {% if not export %}
    <li><a href="/activity?export=true">Export installation chart</a></li>
    {% else %}
    <li><a href="/activity">Non-export installation chart</a></li>
    {% endif %}
</ul>

<h4>Counts chart key:</h4>
<ul>
    <li><strong>active (site)</strong> - has ≥5 DAUs</li>
    <li>sites are listed if ≥1 users active in last 2 weeks</li>
    <li><strong>user</strong> - registered user, not deactivated, not a bot</li>
    <li><strong>active (user)</strong> - sent a message, or advanced the pointer (reading messages doesn't count unless advances the pointer)</li>
    <li><strong>ARR</strong> (Annual recurring revenue) - the number of users they are paying for * annual price/user.</li>
    <li><strong>Rate</strong> - % of full price the customer pays, or will pay, if on a paid plan.</li>
    <li><strong>Links</strong>
        <ul>
            <li><strong><i class="fa fa-home"></i></strong> - realm's Zulip</li>
            <li><strong><i class="fa fa-pie-chart"></i></strong> - realm's stats page</li>
            <li><strong><i class="fa fa-gear"></i></strong> - realm's support page</li>
        </ul>
    </li>
    <li><strong>DAU</strong> (daily active users) - users active in last 24hr</li>
    <li><strong>WAU</strong> (weekly active users) - users active in last 7 * 24hr</li>
    <li><strong>Human message</strong> - message sent by non-bot user, and not with known-bot client</li>
</ul>

<table class="table summary-table sortable table-striped table-bordered">

    <thead class="activity-head">
        <tr>
            {% if not export %}
            <th>Links</th>
            {% endif %}
            <th>Realm</th>
            <th>Created (green if ≤12wk)</th>
            {% if billing_enabled %}
            <th>Plan type</th>
            <th>ARR</th>
            <th>Rate (%)</th>
            {% endif %}
            <th>Organization type</th>
            <th>Referrer</th>
            <th>DAU</th>
            <th>WAU</th>
            <th>Total users</th>
            <th>Bots</th>
            {% if not export %}
            <th></th>
            {% endif %}
            <th colspan=8>Human messages sent, last 8 UTC days (today-so-far first)</th>
            {% if export %}
            <th>Admin emails</th>
            {% endif %}
        </tr>
    </thead>

    <tbody>
        {% for row in rows %}
        <tr>
            {% if not export %}
            <td>
                {{ row.realm_url }}
                {{ row.stats_link }}
                {{ row.activity_link }}
            </td>
            {% endif %}
            <td>
                {{ row.support_link }}
            </td>

            <td {% if row.is_new %}
              class="good" {% else %}
              class="neutral" {% endif %} >
                {{ row.date_created_day }}
            </td>

            {% if billing_enabled %}
            <td>
                {{ row.plan_type_string }}
            </td>

            <td class="number">
                {% if row.arr %}
                {{ row.arr }}
                {% endif %}
            </td>

            <td class="number">
                {% if row.effective_rate != "" %}
                {{ row.effective_rate }}
                {% endif %}
            </td>
            {% endif %}

            <td>
                {{ row.org_type_string }}
            </td>

            <td>
                {{ row.how_realm_creator_found_zulip }}
            </td>

            <td class="number">
                {{ row.dau_count }}
            </td>

            <td class="number">
                {{ row.wau_count }}
            </td>

            <td class="number">
                {{ row.user_profile_count }}
            </td>

            <td class="number">
                {{ row.bot_count }}
            </td>
            {% if not export %}
            <td>&nbsp;</td>
            {% endif %}
            {% if row.history %}
            {{ row.history|safe }}
            {% else %}
            <td colspan=8></td>
            {% endif %}

            {% if export %}
            <td>
                {{ row.admin_emails }}
            </td>
            {% endif %}
        </tr>
        {% endfor %}
    </tbody>
    <tfoot class="activity-foot">
        <tr>
            {% for total in totals %}
            <td>{{ total }}</td>
            {% endfor %}
        </tr>
    </tfoot>
</table>
```

--------------------------------------------------------------------------------

---[FILE: remote_activity_key.html]---
Location: zulip-main/templates/corporate/activity/remote_activity_key.html

```text
<h4>Chart key:</h4>
<ul>
    <li><strong>Server mobile pushes</strong>
        <ul>
            <li>Count of forwarded push notifications in last 7 days</li>
            <li>Includes today's current count</li>
        </ul>
    </li>
    <li><strong>ARR</strong> (annual recurring revenue)
        <ul>
            <li>If plan has a fixed price, displays that value</li>
            <li>Otherwise, is an estimate based on the current users multiplied by annual price per user</li>
            <li>Currently, does not account for first year, flat $20 discount per month</li>
            <li>Plans with status of <strong>Free trial</strong> show estimated revenue for full year</li>
        </ul>
    </li>
    <li><strong>Links</strong>
        <ul>
            <li><strong><i class="fa fa-pie-chart"></i></strong> - remote server's stats page</li>
            <li><strong><i class="fa fa-gear"></i></strong> - remote server's support page</li>
        </ul>
    </li>
</ul>
```

--------------------------------------------------------------------------------

````
