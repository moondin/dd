---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 520
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 520 of 1290)

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

---[FILE: atolio-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/atolio-case-study.md

```text
Founded in 2019 by a seasoned team of engineering and sales leaders, Atolio is a
small startup with big ambitions to radically improve the way people deal with
information at work. They have deep expertise in what it takes to [empower teams
to collaborate effectively](/why-zulip/), and have thought hard about how to
enable effective collaboration for their own team.

> “The first-class threads in Zulip are absolutely critical to how we work.  As
> a fully distributed company, we needed a modern way to support the different
> ways people work, while ensuring that everyone can find the current and
> historical topics that are important to them.  So many people on Hacker News
> talk about using Zulip - I'm so glad we joined them!”
>
> — David Lanstein, co-founder and CEO of [Atolio](https://www.atolio.com/)


## Taking the opportunity to pick the best collaboration tools

Atolio’s founders set out to build a fully distributed company from the get-go,
and they knew how important it would be to choose the right set of collaboration
tools. “We had all used Slack, Jira and Confluence before, but we didn’t want to
default to those options,” says Atolio’s co-founder and CTO Gareth Watts. “We
wanted to take the opportunity to pick the best tools for our future team.”

As past users of Slack’s team chat, Atolio’s founders were well aware of its
downsides. "Slack is an extremely noisy environment. It’s very difficult to keep
up with what your colleagues are doing, and it’s hard to separate chitchat from
what’s important,” says Atolio’s CTO Gareth Watts. “Information in Slack’s
threads ends up being even more hidden than other messages.”

Thus the search was on to find a team chat tool that would truly serve Atolio’s
needs. “We didn’t want Slack,” Gareth says. “We wanted a tool designed for
asynchronous distributed communication, and Zulip seemed to fit the bill.”

> "Slack is an extremely noisy environment. It’s very difficult to keep up with
> what your colleagues are doing.”
>
> — Gareth Watts, co-founder and CTO of [Atolio](https://www.atolio.com/)

## Trying out Zulip’s open-source team chat

Beyond Zulip’s [topic-based threading model](/why-zulip/), Atolio’s team felt
confident that they could [count on Zulip in the coming years](/values/) as they
built out their company. “We liked that Zulip is an open-source tool with a
[huge community](/team/) around it,” Atolio’s CTO Gareth Watts explains. “We are
using Zulip Cloud, but if we want, we can export our data and
[self-host](/self-hosting/) our own Zulip server. So we know Zulip will always
be there for us.”

Having decided to test out Zulip, Atolio’s founders realized that they should go
all-in on a trial period. “We decided to turn off all other chat tools and try
Zulip for a full month,” Gareth says. This way, the team could really see how
Zulip would fit into the company’s communication patterns and workflows after an
initial adjustment period. “After that, we could discuss if it wasn’t working
out,” says Gareth. “But as it turned out, we never looked back.”

> “We decided to turn off all other chat tools and try Zulip for a full month…
> We never looked back.”
>
> — Gareth Watts, co-founder and CTO of [Atolio](https://www.atolio.com/)

## “Zulip is at the core of our business”

Since February 2020, Zulip has been the primary tool for internal communication
at Atolio. “Zulip is at the core of our business,” Atolio’s CTO Gareth Watts
explains. The team has always been able to rely on this crucial piece of company
infrastructure. “The Zulip Cloud hosting has been bulletproof — we haven’t had
any down time,” says Gareth.

Zulip’s organized team chat has enabled Atolio to create the open communication
culture the founders wanted. “Zulip lets us have conversations in public, not
behind closed doors,” Gareth explains. “In Slack, two thirds of communication is
not in public just to avoid noise. In Zulip, you can talk about what you want —
you just give everything its own topic.”

> “In Zulip, it’s super easy to find things 24 hours later if you weren’t online
> when a discussion happened.”
>
> — Gareth Watts, co-founder and CTO of [Atolio](https://www.atolio.com/)

Atolio’s distributed team also uses Zulip to build personal connections. With
each conversation getting its own space in a dedicated topic, team members can
share pictures of their cats or GIPHY memes without disrupting serious work
discussions. And if a topic ever goes off on a tangent, it’s easy to split it in
two and continue from there.

When new team members join the company, the onboarding process welcomes them to
Zulip and the company’s communication culture. An internal Wiki introduces
Zulip’s [topic-based threading](/help/introduction-to-topics), [search
tools](/help/search-for-messages), and some handy [keyboard
shortcuts](/help/keyboard-shortcuts), with pointers to [Zulip’s help
center](/help/) for more information. Gareth hasn’t seen much difference between
onboarding to Zulip compared to other team chat tools: “If someone hasn’t used
Slack before, they need onboarding too.”

> “Zulip lets us have conversations in public, not behind closed doors.”
>
> — Gareth Watts, co-founder and CTO of [Atolio](https://www.atolio.com/)

## Easy to integrate

To make Zulip a central hub for updates about what’s happening, Atolio has
integrated Zulip with its engineering tools. In a #tickets channel, a topic is
created automatically for each ticket, so there is a dedicated space to discuss
the issue at hand. There are topics in other Zulip channels for automated
deployment announcements, and for bot posts when pull requests are opened or
merged.

Atolio has also [connected Zulip](https://www.atolio.com/connectors/) to their
own unified search product. “Writing against the [Zulip APIs](/api/) has not
been hard,” Gareth says. “And since it’s open-source, we can always [read the
source code](https://github.com/zulip/zulip#readme) if we find the docs
confusing.”

---

Check out our guide on [using Zulip for business](/for/business/). You can also
learn how Zulip is being used at the InsurTech startup
[Semsee](/case-studies/semsee/), the [iDrift AS](/case-studies/idrift/) company,
the [End Point Dev](/case-studies/end-point/) software consultancy, and the [GUT
contact](/case-studies/gut-contact/) support agency.
```

--------------------------------------------------------------------------------

---[FILE: end-point-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/end-point-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: End Point Dev software consultancy | Zulip" %}

{% set PAGE_DESCRIPTION = "Learn how Zulip takes the pain out of remote
  collaboration in a distributed company with hundreds of ongoing projects." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: End Point Dev</h1>
            <p>Software consultancy</p>
        </div>
        <div class="hero-text">
            Learn more about using Zulip for <a href="/for/business/">business</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/end-point-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: end-point-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/end-point-case-study.md

```text
## Organizing the flow of information

Founded in 1995, [End Point Dev](https://www.endpointdev.com/about/) is a
full-service software consultancy, with a diverse set of customers: from
startups, to giants like Google, NASA, Oracle, and Morgan Stanley. The company
employs a team of 65 or so software developers, data organizers, and security
experts distributed all around the globe. Each project brings together talented
individuals with the right mixture of skills, wherever they might be located.

For the past six years, End Point has been using Zulip to stay connected as a
team. “Other apps like Slack would struggle with organizing the flow of
information in a complex organization like ours,” says End Point CTO [Jon
Jensen](https://www.endpointdev.com/team/jon-jensen/). “Zulip’s UI makes it easy
to access all the information you need, without being too cluttered.”


> “Zulip’s UI makes it easy to access all the info you need.”
>
> — [Jon Jensen](https://www.endpointdev.com/team/jon-jensen/), CTO of End Point

## Legacy software challenges

In 2005, looking to improve on email and phone communication, the company set up
an IRC chat server. Many team members loved IRC’s realtime chat experience. As
the company evolved, however, IRC’s limited feature set (for example, there were
no file uploads), became a growing concern.

By 2017, while most of the company was still on IRC, one division had moved to
Flowdock, and another team that had joined in an acquisition was using Slack.
The company’s collaboration tools were no longer helping everyone stay
connected. “Having multiple chat systems was bad for our culture,” says End
Point’s CTO [Jon Jensen](https://www.endpointdev.com/team/jon-jensen/). “Some
people were always cut out of the conversation.”

## Choosing Zulip: A modern feature set with a snappy UI

It was time to find a team chat solution that would bring the company back
together. Unfortunately, none of the tools already in use would do the job.
“Slack’s interface was too slow and clunky,” [Jon
Jensen](https://www.endpointdev.com/team/jon-jensen/) explains, “And the more
channels you’re in, the harder it is to use,” which was a show-stopper for a
consulting company with hundreds of ongoing projects.


> “Slack’s interface was too slow and clunky, and the more channels you’re in,
> the harder it is to use.”
>
> — [Jon Jensen](https://www.endpointdev.com/team/jon-jensen/), CTO of End Point

Inclined to go with a self-hosted solution, Jon and some of his co-workers
explored all the leading open-source team chat products. They found that while
Mattermost and Rocket.Chat were similar to Slack (but felt less polished), Zulip
stood out. “Zulip had all the modern features we were looking for, like
reliable, flexible notifications. At the same time, the [extensive keyboard
shortcuts](/help/keyboard-shortcuts) and the ‘Combined feed’
view offered a UI that the IRC fans loved.”

When End Point moved to Zulip, it was an immediate improvement over the
hodge-podge of tools previously in use. “Choosing topics in Zulip felt like a
hurdle at first,” Jon recalls, “but the team got used to it pretty quickly.” Not
entering a topic is always an option, and Zulip’s topics help users read their
messages more efficiently. “It’s nice to be able to [mute](/help/mute-a-topic)
busy topics,” Jon says.

## “Zulip is our virtual office”

For the past six years, the Zulip chat has been a virtual office for End Point’s
distributed team, a place to show up and be present at work. Discussing projects
in Zulip channels keeps everyone informed.

“Zulip is my lifeline,” says [Joanne
Tipton](https://www.endpointdev.com/team/joanne-tipton/), a senior team manager
at End Point. “I’m on it all day. I need to have an idea of all the things that
are going on, so the [desktop notifications](/help/desktop-notifications) are
invaluable.” There are 130 channels in the organization, and managers are
subscribed to most of them. Joanne takes advantage of per-channel flexibility for
notifications, turning on notification sounds just for low-traffic channels where
every message is important.

> “Zulip is my lifeline.”
>
> — [Joanne Tipton](https://www.endpointdev.com/team/joanne-tipton/), Senior Team Manager at End Point

[Alejandro Ramon](https://www.endpointdev.com/team/alejandro-ramon/), who leads
the Immersive & Geospatial division, joined End Point the day before the move to
Zulip. Zulip has always been a core tool for his work at End  Point, and he has
built his workflows on Zulip’s [integrations](/integrations/). “With the
[Jenkins CI integration](/integrations/jenkins), I can see when a job has
finished building and is ready to deploy,” Alejandro says. “I use this 100s of
times per week.”


> “I use Zulip’s Jenkins CI integration 100s of times per week.”
>
> — [Alejandro Ramon](https://www.endpointdev.com/team/alejandro-ramon/),
> Director of Immersive & Geospatial division at End Point

Zulip also enables real-time system monitoring, with error alerts sent into a
dedicated channel for each system. Alejandro relies on Zulip’s clear record of
what’s been happening with each installation, which combines automated alerts
with discussion by the team. “I use [search](/help/search-for-messages) quite a
bit,” Alejandro says. “Being able to filter by user and search term, and look at
a date range, is very helpful.”

Zulip is conveniently accessible no matter where Alejandro is working from. “The
[mobile apps](/apps/) work well when I need to connect from a customer site,”
Alejandro explains.

## Taking the pain out of team chat

End Point’s client companies use a wide variety of chat tools to communicate
with their collaborators at EndDev, from modern team chat tools like Slack and
Microsoft Teams, to tools designed primarily for 1:1 communication like Google
Chat and Skype. End Point’s CTO [Jon
Jensen](https://www.endpointdev.com/team/jon-jensen/) has experienced them all.

“It is amazing that companies would use Teams in its current state,” Jon says, a
bit exasperated. “The UI is slow and inconsistent, and you have to do so much
clicking to get anywhere. Compared to Zulip, it’s missing key features like the
‘Combined feed’ view and topics.”

> “It is amazing that companies would use Teams in its current state. The UI is
> slow and inconsistent, and compared to Zulip, it’s missing key features.”
>
> — [Jon Jensen](https://www.endpointdev.com/team/jon-jensen/), CTO of End Point

In Jon’s view, any communication tool imposes some cost on the team. “When
you’re choosing a team chat tool, you’re deciding how much pain are you
requiring your staff to undergo,” Jon explains. “And if your remote tools are
painful to use, you marginalize remote staff,” as conversations move from chat
to offices and hallways. Thankfully, this is not a problem at End Point, Jon
says. “Zulip removes much of the pain that makes people not want to use team
chat apps. We love it."

>  “Zulip removes much of the pain that makes people not want to use team chat
>  apps. We love it.”
>
> — [Jon Jensen](https://www.endpointdev.com/team/jon-jensen/), CTO of End Point

---

Check out our guide on [using Zulip for business](/for/business/). You can also
learn how Zulip is being used at the [iDrift AS](/case-studies/idrift/) company,
the [GUT contact](/case-studies/gut-contact/) support agency, and the startups
[Semsee](/case-studies/semsee/) and [Atolio](/case-studies/atolio/).
```

--------------------------------------------------------------------------------

---[FILE: gut-contact-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/gut-contact-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: GUT contact | Zulip" %}

{% set PAGE_DESCRIPTION = "Learn how Zulip makes communication easy for 1000
  agents at GUT contact, a support agency." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: GUT contact</h1>
            <p>Support agency</p>
        </div>
        <div class="hero-text">
            Learn more about using Zulip for <a href="/for/business/">business</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/gut-contact-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: gut-contact-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/gut-contact-case-study.md

```text
For over 20 years, GUT contact has been offering premium customer support,
outbound sales and other German-language services. The company achieves top
performance by putting employees in a productive and motivating environment.
Company leadership makes mindful choices about the tools employees use to get
their work done, and has successfully scaled the team to over 1000 agents.

Agents at GUT contact use Zulip every day to communicate with their team leads.
“Most of our agents are in their 60s or 70s, so the software must be as simple
as possible. That’s why we love Zulip,” says [Erik
Dittert](https://gutcontact.de/unternehmen/team/erik-dittert/), who’s been
leading GUT contact’s IT team for the past 20 years.

> “The software must be as simple as possible. That’s why we love Zulip.”
>
> — Erik Dittert, [Head of
> IT](https://gutcontact.de/unternehmen/team/erik-dittert/) at [GUT
> contact](https://gutcontact.de/)


## “Our agents don’t need email accounts”

GUT contact relies on team chat for written communication within the company.
“Our agents don’t need email accounts,” says Erik Dittert, GUT Contact’s Head of
IT. “If someone has an email, they’ll get spam.” Instead, under Erik’s
leadership, GUT contact has been self-hosting open-source team chat applications
for years, upgrading as technology has evolved.

The company started with IRC, used an XMPP chat client for a while, and in 2019
moved to Rocket.Chat. “Rocket.Chat was a little bit better than our XMPP
server,” Erik says. However, when Erik learned about Zulip, he was excited to
check it out. “I installed Zulip, and the IT team played with the app. We loved
it. The UI was just cleaner, easier,” Erik says.

Zulip’s topic-based threading model was transformative. With other chat apps,
“the first person has a question about something, the next person has a question
about something else. You answer the first person, and the second person is
confused,” Erik explains. This doesn’t happen with Zulip’s topics.

> “Topic-based communication is a big big big feature we love in Zulip.”
>
> — Erik Dittert, [Head of
> IT](https://gutcontact.de/unternehmen/team/erik-dittert/) at [GUT
> contact](https://gutcontact.de/)


## Smooth transition to Zulip

Erik showed Zulip to his boss and others at the company, and in October 2022,
GUT contact made the switch.

“Zulip was quite easy to set up, and worked instantly. 1000 people — no
problem,” Erik recalls. “I hooked up the Zulip server to LDAP, and our agents
loved not having to remember a separate username and password.” Erik considered
importing data from Rocket.Chat into Zulip, but in the end it was decided that
the messy conversation history was not worth preserving.

Erik put training videos on the company’s intranet to explain the switching
process, and to give an overview of key new features. Employees were encouraged
to play around with Zulip, create channels, and chat with each other. After a
month of running Zulip in parallel with Rocket.Chat, the old system was turned
off.

> “Zulip was quite easy to set up, and worked instantly. 1000 people — no
> problem.”
>
> — Erik Dittert, [Head of
> IT](https://gutcontact.de/unternehmen/team/erik-dittert/) at [GUT
> contact](https://gutcontact.de/)


## Easy for anyone to use

GUT contact offers employees the flexibility to work from one of 10 offices
across 3 countries, or from their home office. This makes Zulip a critical
communication tool across all job functions. There is a channel for each
department (IT, human resources, etc.), as well as a dedicated channel for each
customer, where team leaders post daily updates.

For agents, many of whom are not fully comfortable with modern software, Zulip
being easy to use is invaluable. "We checked out Microsoft Teams and Mattermost,
and most of our users didn’t like these programs, because they didn’t know how
to work with them,” Erik says. “In Zulip, agents love the “Combined feed” view,”
which combines direct messages and channel messages into a single feed. “Unlike
other chat apps, you don’t have to click on each channel separately to see
unreads,” Erik explains.

## Functionality for the most technical users

Members of the IT team use Zulip to collaborate from around the world. “We share
code all the time, and the formatting and syntax highlighting is great,” Erik
says. When they need to jump on a call, “The Jitsi integration is perfect. We
don’t have to deal with emailing a calendar invite.”

Outside of office hours, Erik uses the mobile app to check on his message inbox.
It’s easy to skim the list of topics to check if anything requires timely
attention. “I love the clean mobile app and the push notifications,” Erik says.
“The app is extremely fast — you click, and messages show up instantly.”

Erik meets up regularly with other technologists to “have a beer and talk about
cool software.” In this 50-person group, “Zulip is quite a big theme right now,”
Erik says.

>  “I love Zulip. I use it every day, every night.”
>
> — Erik Dittert, [Head of
> IT](https://gutcontact.de/unternehmen/team/erik-dittert/) at [GUT
> contact](https://gutcontact.de/)

---

Check out our guide on [using Zulip for business](/for/business/). You can also
learn how Zulip is being used at the [iDrift AS](/case-studies/idrift/) company,
the [End Point Dev](/case-studies/end-point/) software consultancy, and the
startups [Semsee](/case-studies/semsee/) and [Atolio](/case-studies/atolio/).
```

--------------------------------------------------------------------------------

---[FILE: idrift-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/idrift-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: iDrift AS, distributed tech company | Zulip" %}

{% set PAGE_DESCRIPTION = "Learn why using Zulip significantly increases the
  size of the team for which a manager can meaningfully know what’s going on." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: iDrift AS</h1>
            <p>Distributed tech company</p>
        </div>
        <div class="hero-text">
            Learn more about using Zulip for <a href="/for/business/">business</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/idrift-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: idrift-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/idrift-case-study.md

```text
## A distributed team

For the past 20 years, iDrift AS has been offering infrastructure and security
support for small businesses. iDrift AS is a distributed organization, operating
from six offices across Norway. As such, this 30-person company has always
depended on team chat to coordinate and support each other’s efforts.

iDrift AS co-founder and owner Gaute Lund had long been frustrated with the
limitations of the company’s collaboration tools. “When I learned about Zulip it
was an absolute revelation,” says Gaute Lund. “Zulip’s threading model makes it
so much easier to manage my team. As a leader, in just a few minutes I can get
an overview over what's going on and see where my attention is needed.”


## Async communication is a challenge

From its founding, iDrift AS relied on IRC for internal communication, but the
lack of a modern user interface proved to be a barrier for participation for
management and non-technical members of the team. iDrift AS therefore moved from
IRC to Slack in October 2016.

“In terms of functionality, Slack is just souped-up IRC — there is no conceptual
difference,” says iDrift AS owner Gaute Lund. “It doesn’t add anything
significant other than the UI.”

While Slack worked reasonably well for real-time communication, the busy Slack
channels at iDrift AS were not effective for asynchronous discussions. “It was
almost impossible to catch up on a conversation, or get an overview of what you
missed while on vacation,” Gaute Lund says.

> “Slack is just souped-up IRC — there is no conceptual difference.”
>
> — Gaute Lund, co-founder and owner of iDrift AS


## Easy transition to Zulip

When a team member recommended Zulip, Gaute Lund understood the potential of
[Zulip’s threading model](/why-zulip/) to dramatically improve
async collaboration at iDrift AS. The company evaluated Zulip in the summer of
2020, and decided to make the move.

The team took easily to Zulip’s topic-based threading paradigm. “Once people
start using Zulip, it quickly becomes obvious why it’s better,” says Gaute Lund.

The transition also went smoothly from a technical perspective. “It was not a
lot of work to move everything over from Slack to Zulip,” says Gaute Lund. “The
export/import tool worked really well to ensure that we had logs of all the
prior conversations.”

Chat integrations for operational systems and alerts are a crucial part of the
workflow at iDrift AS. Zulip offers a [Slack-compatible
interface](/integrations/slack_incoming), so many integrations could be
simply moved over. “For a handful of integrations where Zulip didn’t meet our
needs, it was easy to [create our own
integration](/api/integrations-overview#write-your-own-integration) or improve
the existing one. It wasn’t a problem,” Gaute Lund says.

iDrift AS decided to self-host its own Zulip server. Because Zulip is
[100% open source](https://github.com/zulip/zulip), this option offers
the same functionality as a [Zulip Cloud Standard](/plans/)
subscription. “Zulip is very stable, and easy to run and to upgrade,”
says Senior IT Consultant Tor Hveem.

> “Once people start using Zulip, it quickly becomes obvious why it’s better.”
>
> — Gaute Lund, co-founder and owner of iDrift AS


## Zulip helps leaders scale

The move to Zulip transformed Gaute Lund’s day-to-day experience as a leader.
“Using Zulip significantly increases the size of the team for which a manager
can meaningfully know what’s going on,” says Gaute Lund. “There are 25 people
for whom I have a very good grip on their work, whereas previously it was no
more than a handful”.


> “Using Zulip significantly increases the size of the team for which a manager
> can meaningfully know what’s going on.”
>
> — Gaute Lund, co-founder and owner of iDrift AS

As a Microsoft shop, iDrift AS uses Microsoft Teams for file sharing, scheduling
and video calls. Would they use it for team chat? “For technical people, the
chat experience in Teams is abhorrent,” says Gaute. “It’s almost impossible to
get an overview of what’s happening. Only a small number of messages fit on the
screen, and the discussions hidden inside threads make it even harder to see
what’s going on.”

In contrast, Zulip’s topic-based threading lets Gaute review conversations in
batches, without being constantly interrupted by chat messages. Every few hours,
Gaute looks through the list of recent Zulip topics to find discussions that may
require his attention, and offers feedback as needed. Catching up is fast:
“Updating myself on an incident might take a few seconds,” Gaute Lund says.


## Efficient team communication

With Zulip, the team can discuss everything from customer issues to major design
decisions. “Zulip lets people focus on conversations where they can contribute,
whether or not they happen to be online when the conversation starts,” says
Gaute Lund.

The Zulip chat also serves as a knowledge base for the history of the
organization. “We have a very stable customer base, and Zulip search makes it
easy to review past interactions,” Gaute Lund says.

> “Zulip lets people focus on conversations where they can contribute.”
>
> — Gaute Lund, co-founder and owner of iDrift AS

---

Check out our guide on [using Zulip for business](/for/business/). You can also
learn how Zulip is being used at the [End Point Dev](/case-studies/end-point/)
software consultancy, the [GUT contact](/case-studies/gut-contact/) support
agency, and the startups [Semsee](/case-studies/semsee/) and
[Atolio](/case-studies/atolio/).
```

--------------------------------------------------------------------------------

---[FILE: lean-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/lean-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: Lean theorem prover community | Zulip" %}
{% set PAGE_DESCRIPTION = "Zulip enables collaboration at scale: “We could never do what we’re doing on Slack or Discord.”" %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: <br/>Lean theorem prover community</h1>
        </div>
        <div class="hero-text">
            Learn more about using Zulip for <a href="/for/research/">research</a><br/>
            and <a href="/for/open-source/">open source</a> communities.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/lean-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: lean-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/lean-case-study.md

```text
## Collaboration at the cutting edge of mathematics

Modern mathematical research is an incredibly complex and specialized endeavor.
Novel proofs may require years of dedicated study to understand, making it very
difficult for the mathematical community to fully validate each other’s
research. To enlist the help of computers for verifying mathematical theorems,
mathematicians and computer scientists are [collaborating on an ambitious
project](https://leanprover-community.github.io/) to develop the [Lean theorem
prover](https://leanprover.github.io/) mathematics library.

The Lean prover project was [featured in Nature magazine in June
2021](https://www.nature.com/articles/d41586-021-01627-2), when the interactive
theorem prover was successfully used to [verify a result at the cutting edge of
mathematical
research](https://www.quantamagazine.org/lean-computer-program-confirms-peter-scholze-proof-20210728/).
This accomplishment was the result of a deep multi-month collaboration between
the [Lean Prover community](https://leanprover-community.github.io/) [on
Zulip](https://leanprover.zulipchat.com/login/) and [Peter
Scholze](https://www.hcm.uni-bonn.de/people/faculty/profile/peter-scholze/), a
[world-famous mathematician](https://en.wikipedia.org/wiki/Peter_Scholze)
working to “[rebuild much of modern
mathematics](http://nature.com/articles/d41586-021-01627-2)”.

“I joined the Zulip chat to answer any mathematical questions that may arise,
but also as an interested spectator,” wrote Peter Scholze in a [blog post
describing the
project](https://xenaproject.wordpress.com/2021/06/05/half-a-year-of-the-liquid-tensor-experiment-amazing-developments/).
“It was exactly the interactions via the Zulip chat that convinced me that a
proper verification was going on,” he commented.


> “It was exactly the interactions via the Zulip chat that convinced me that a
> proper verification was going on.”
>
> — [Peter Scholze](https://www.hcm.uni-bonn.de/people/faculty/profile/peter-scholze/),
> professor at the [University of
> Bonn](https://en.wikipedia.org/wiki/University_of_Bonn) and director at the
> [Max Planck Institute for
> Mathematics](https://en.wikipedia.org/wiki/Max_Planck_Institute_for_Mathematics)
> ([source](https://xenaproject.wordpress.com/2021/06/05/half-a-year-of-the-liquid-tensor-experiment-amazing-developments/))

“I have never seen this kind of collaboration before,” says [Kevin
Buzzard](https://www.imperial.ac.uk/people/k.buzzard), Professor of Pure
Mathematics at Imperial College London, who took part in Lean community’s
verification effort. In mathematics, papers are generally coauthored by 2-3
people who have known each other for years.  The verification project is
breaking new ground, with 10 authors, most of whom have never met, scattered
across the world. “Zulip has completely changed the way I work, and very much
for the better,” says Kevin Buzzard, who also leads the [Xena
project](https://xenaproject.wordpress.com/what-is-the-xena-project/) to
formalize undergraduate mathematics with Lean and thereby transform how college
mathematics is taught.


## Unified library of mathematics developed by a diverse community

Lean is an interactive theorem prover and a programming language. Like C++ or
Python, it would be impossible to use in practice without a library of
pre-defined components — imagine writing a function from scratch every time you
need to sort a list!  The functions that make it possible to “program” in Lean
are being developed as
[*mathlib*](https://github.com/leanprover-community/mathlib), a unified
open-source library of mathematics.

The mathlib development effort brings together a uniquely large and diverse
group of contributors, ranging from renowned researchers to undergraduate
students just starting their mathematical journey. The Zulip chat has been vital
to attracting and growing the mathlib community, which has been the foundation
of mathlib’s success.


> “A number of people have cited the accessibility of [the Zulip] chat room as a
> reason for deciding to use Lean.”
>
> — “The Lean Mathematical Library”, by the
> [mathlib](https://github.com/leanprover-community/mathlib) community
> ([arXiv:1910.09336v2](https://arxiv.org/abs/1910.09336v2) **[cs.LO])**

Now numbering hundreds of active participants, the Lean community did not start
out this way. [Launched in 2013](https://leanprover.github.io/about/), Lean was
for many years developed by a small, tight-knit group, which exchanged ideas on
a mailing list. Looking to have faster-paced interactions, the user community
moved to Gitter in 2017, but it felt chaotic. Seeking a platform that would
truly help the community to scale, the Lean community adopted Zulip in February
2018.

“When we moved to Zulip, it was instantly clear that the problems we were seeing
on Gitter had gone away completely,” says [Kevin
Buzzard](https://www.imperial.ac.uk/people/k.buzzard), Professor of Pure
Mathematics at Imperial College London. “Zulip was incredibly intuitive to use.
It just worked.”


> “Zulip is incredibly intuitive.”
>
> — [Kevin
> Buzzard](https://www.imperial.ac.uk/people/k.buzzard), Professor of Pure
> Mathematics at Imperial College London


## Accessible and efficient like no other chat platform

Zulip’s unique combination of [topic-based
organization](/why-zulip/) with a casual chat app feel helps
the Lean community create a welcoming environment for newcomers. By [browsing
recent conversations](/help/recent-conversations), newcomers can see what’s
being discussed without being overwhelmed. They can start a new topic to ask
basic questions without worrying about interrupting other conversations. Zulip’s
threading model makes managing conversations incredibly efficient, allowing more
senior community members to collaborate on research and library development, and
jump in to help newer community members as time allows.


> “We could never do what we’re doing on Slack or Discord.”
>
> — [Kevin Buzzard](https://www.imperial.ac.uk/people/k.buzzard), Professor of
> Pure Mathematics at Imperial College London

 “Zulip has been fantastic,” says [Robert Y. Lewis](https://robertylewis.com/),
 Brown University lecturer and
 [mathlib](https://github.com/leanprover-community/mathlib)
 [maintainer](https://github.com/leanprover-community/mathlib#maintainers). “I
 use Slack at work, and it works fine for 10-15 people, but I can’t imagine it
 working at Lean’s scale.”


> “I can’t imagine the Lean community without Zulip.”
>
> — [Robert Y. Lewis](https://robertylewis.com/), Brown University lecturer and
> [mathlib](https://github.com/leanprover-community/mathlib)
> [maintainer](https://github.com/leanprover-community/mathlib#maintainers)

---

Check out our guides on using Zulip for [research](/for/research/)
and [open source](/for/open-source/), and learn how Zulip
[helps communities grow](/for/communities/)!
```

--------------------------------------------------------------------------------

---[FILE: mixxx-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/mixxx-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: Mixxx open-source community | Zulip" %}

{% set PAGE_DESCRIPTION = "Learn how Zulip has become the foundation for a
  community of passionate DJs and programmers from all over the world." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: Mixxx <br /> open-source community</h1>
        </div>
        <div class="hero-text">
            Learn more about using Zulip for<br /> <a href="/for/open-source/">open
            source projects</a> and <a href="/for/communities/">communities</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/mixxx-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

````
