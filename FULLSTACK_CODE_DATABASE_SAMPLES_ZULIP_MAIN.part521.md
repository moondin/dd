---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 521
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 521 of 1290)

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

---[FILE: mixxx-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/mixxx-case-study.md

```text
[Mixxx](https://mixxx.org/) is open-source DJing software built by a community
of passionate DJs and programmers from all over the world. In their nights and
weekends, and without centralized planning or deadlines, they’ve created free
software that [rivals](https://cdm.link/mixxx-2-4-2/) commercial alternatives
*and* [respects](https://www.digitaldjtips.com/reviews/mixxx-2-5-1-dj-software/)
its users.

Mixxx aims to offer DJs creative freedom that can’t be found in other software.
In the Mixxx community, collaboration between users and developers drives
product innovation. A simple question from a user can spark a clever solution.

“Zulip has become a solid foundation of our community: a place where developers,
translators, designers, and testers meet and collaborate,” core Mixxx developer
Daniel Schürmann explains in a [blog
post](https://mixxx.org/news/2025-11-17-zulip-3000_members/) occasioned by the
Mixxx Zulip community reaching 3,000 members.

<figure class="markdown-image-with-caption">
  <img src="/static/images/landing-page/case-studies/Mixxx-UI.png" alt="Mixxx software interface">
  <figcaption class="markdown-image-caption">Mixxx software</figcaption>
</figure>

## Needed: A platform to keep conversations organized and accessible

Founded in 2001, the Mixxx community originally communicated on a Mailman
mailing list and an IRC chat channel. But by 2018, these platforms were no
longer serving the community’s needs.

"As the project and number of contributors grew, we needed a platform that could
keep conversations organized and accessible to everyone,” Daniel explains on the
Mixxx blog. “Zulip… convinced us after a short evaluation period. Its unique
thread system was the ideal solution to replace structured email threads and
instant chat rooms.”

> “[Zulip’s] unique thread system was the ideal solution to replace structured
> email threads and instant chat rooms.”
>
>  — [Mixxx blog](https://mixxx.org/news/2025-11-17-zulip-3000_members/)

## Supporting asynchronous collaboration with structure and focus

Zulip has proven perfectly suited to support Mixxx’s worldwide community: It has
made collaboration easier, and community engagement has grown as a result.
“Zulip works particularly well for open-source projects where many topics run in
parallel, and where structure and focus are key to success,” Daniel explains.

Being able to move messages between threads helps keep conversations tidy, which
is critical for a distributed volunteer community like Mixxx: “[It] makes it
possible to collaborate asynchronously across time zones without missing
important context,” Daniel’s writes on the blog.

> “Whenever a topic drifts, we can split it into a new thread, so conversations
>  stay focused and are easy to follow.”
>
>  — [Mixxx blog](https://mixxx.org/news/2025-11-17-zulip-3000_members/)

The Mixxx community has dedicated channels for development, support,
socializing, and introductions. New members are encouraged to introduce
themselves in a dedicated topic with their name, where the community can welcome
them.

## Informed, but not stressed

Daniel, too, contributes to Mixxx in his spare time. Given the demands of his
day job, family and friends, “I’m not the person who can always hang around in
the chat,” he explains. “With Zulip, there’s no *need* to hang around in chat
rooms to avoid missing an important conversation.”

> “With Zulip, I feel informed, but not stressed by all the messages.”
>
>  — Daniel Schürmann, core Mixxx developer

Zulip’s threading model also works well for occasional participants in the
community, and world-public channels make it possible to view discussions
without even creating an account.

Daniel squeezes in some Mixxx time on his commute: “The smart phone app recently
received a major update, and is very nice,” he says.

## Creative collaboration between users and developers

A creative partnership between users and developers is core to the Mixxx
development process. Zulip supports detailed, specific discussion of any problem
reported by a user, with video and image uploads, syntax-highlighted code
blocks, and convenient quoting functionality. Everyone can keep track of
conversations in their [inbox](/help/inbox), and automatically
[follow](/help/follow-a-topic) topics they’ve participated in.

> “Collaboration in the Mixxx Zulip community propels the creative process to
> the next level.”
>
> — Evelynne Veys, core Mixxx developer

## One of the best tools, built with love

Daniel uses Microsoft Teams in his day job, and greatly prefers Zulip: “You can
experience that there’s a lot of love in Zulip,” he explains. From the smooth,
snappy interactions, to helpful touches like global times, polls, and pronouns,
it adds up.

> “You can experience that there’s a lot of love in Zulip.”
>
>  — Daniel Schürmann, core Mixxx developer

Other community members feel it too: “Some new contributors who were skeptical
at first later told us that they consider Zulip one of the best tools for
managing communication across projects,” Daniel says.

With Zulip, the Mixxx community isn’t reliant on proprietary software built by a
mega-corporation. Daniel and other community members are glad that the Mixxx
community has found an excellent communication tool that also aligns with their
FOSS values.

> “I highly recommend Zulip to other communities… Slack is a no-go for many due
> to not being FLOSS, and I’m concerned about vendor lock-in if they were to
> stop being so generous. Slack’s threading model is much worse than Zulip’s
> IMO. The channels/topics flow is an incredibly intuitive way to keep track of
> everything that is going on.”
>
> — RJ Ryan, core Mixxx developer

---

Check out our guide on using Zulip for [open source](/for/open-source/), and
learn how Zulip [helps communities scale](/for/communities/)!
```

--------------------------------------------------------------------------------

---[FILE: recurse-center-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/recurse-center-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: Recurse Center | Zulip" %}

{% set PAGE_DESCRIPTION = "“Switching to Zulip has turned out to be one of the
  best decisions we’ve made,” says Recurse Center co-founder and CEO Nick
  Bergson-Shilcock." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: Recurse Center</h1>
        </div>
        <div class="hero-text">
            Learn more about using Zulip for
            <br/><a href="/for/communities/">communities</a> and <a href="/for/education/">education</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/recurse-center-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: recurse-center-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/recurse-center-case-study.md

```text
[The Recurse Center](https://www.recurse.com/about) (RC for short) offers
educational retreats for anyone who wants to get dramatically better at
programming.  Since its founding in 2011, [over 2000
participants](https://www.recurse.com/10-years) have attended the program,
either in person in New York City or (since the start of the Covid-19 pandemic)
remotely from anywhere in the world. Participants range from experienced
professional programmers to new programmers transitioning into the industry. The
retreats are free for everyone, and RC is funded entirely through its
[integrated recruiting agency](https://www.recurse.com/hire).

[A major highlight](https://www.recurse.com/why) of RC’s program is its active
online community of current participants and alumni. “The core of the Recurse
Center is the community, and the core of our online community is Zulip,”
[writes](https://www.recurse.com/blog/112-how-rc-uses-zulip) Recurse Center
[co-founder and CEO](https://www.recurse.com/team) Nick Bergson-Shilcock.
“Switching to Zulip has turned out to be one of the best decisions we’ve made,
and it’s impossible to imagine RC today without it.”


> “The core of the Recurse Center is the community, and the core of our online
> community is Zulip… Switching to Zulip has turned out to be one of the best
> decisions we’ve made, and it’s impossible to imagine RC today without it.”
>
> — [Nick Bergson-Shilcock](https://github.com/nicholasbs), Recurse Center
> [co-founder and CEO](https://www.recurse.com/team)


## Choosing Zulip in 2013: “One of the best decisions we’ve made”

The Recurse Center was an early adopter of Zulip. They began to use the product
in January 2013, when it was still in private beta. Even then, Zulip’s
thoughtful design made it stand out. “We wanted a private chat system that was
persistent, easily searchable, and which supported syntax highlighting for code
snippets,“ says Recurse Center co-founder and CEO Nick Bergson-Shilcock. “Zulip
gave us all the benefits above, along with a slew of others we hadn’t expected.”

When the startup building Zulip was [acquired by Dropbox in early
2014](https://zulip.com/history/), Zulip product development was put on hold for
a year and a half. Because of Zulip’s advantages over the alternatives, Recurse
Center continued using Zulip all through that time: “We strongly prefer Zulip to
other options for several reasons – its message threading being a key one,”
[wrote](https://www.recurse.com/blog/90-zulip-supporting-oss-at-the-recurse-center)
RC CEO Nick Bergson-Shilcock in 2015.

From the early days, the RC community has been passionate about Zulip. When
Dropbox generously decided to [release Zulip as open source
software](https://blogs.dropbox.com/tech/2015/09/open-sourcing-zulip-a-dropbox-hack-week-project/)
in 2015, Recurse Center alumni [flew out to San
Francisco](https://www.recurse.com/blog/90-zulip-supporting-oss-at-the-recurse-center)
for a week to help make it happen. Since then, Zulip has built the most active
open-source development community of any team chat software, with [75
people](https://zulip.com/team/) who’ve contributed 100+ commits.

> “It’s not an exaggeration to say Zulip has made RC a stronger community.”
>
> — [Nick Bergson-Shilcock](https://github.com/nicholasbs), Recurse Center
> [co-founder and CEO](https://www.recurse.com/team)


## Zulip becomes the backbone of a worldwide community

For years, the Zulip chat been the backbone of the Recurse Center community.
“Zulip is an integral part of the Recurse Center experience,” says Rachel
Petacat, [Head of Retreat](https://www.recurse.com/team) at Recurse Center, and
RC’s Director of Operations from 2014 to 2021.

Zulip serves as a collaboration hub for the current participants and alumni.
“Participants use Zulip to ask and answer questions, get code review, and
coordinate pairing sessions, reading groups, informal seminars, and countless
other forms of collaboration. Zulip is even more essential for our alumni, who
are in over 100 cities around the world but remain heavily involved thanks to
Zulip,” [writes](https://www.recurse.com/blog/112-how-rc-uses-zulip) RC CEO Nick
Bergson-Shilcock.

> [In the first ten years](https://www.recurse.com/10-years) since the Recurse
> Center was founded, the community sent **2.52 million** Zulip messages.

[Zulip’s threading model](https://zulip.com/why-zulip/) makes it easy to have
focused technical discussions. It also perfectly accommodates participants at
different levels of engagement. Current RC members can immerse themselves in the
ongoing discussions, occasionally muting topics they don’t want to follow. RC
leaders monitor the community asynchronously, reviewing the ongoing
conversations a few times a day and jumping in as needed. Finally, alumni can
drop by on occasion to skim [recent conversations](/help/recent-conversations),
catch up on their friends’ update threads, or search the discussion history for
a topic of interest.

“Our community is 10 years old and spans continents,” RC’s Head of Retreat
Rachel Petacat says. “Zulip provides the continuity that lets us maintain our
culture over time.”


## A welcoming environment for all community members

When new participants join the Recurse Center, Zulip becomes their port of entry
into the community. “With Zulip’s threading, new folks can get the full context
for a conversation, which makes the community feel welcoming,” Head of Retreat
Rachel Petacat says.


> “Zulip is more friendly to new users than Discord or Slack.”
>
> — Rachel Petacat, Recurse Center [Head of Retreat](https://www.recurse.com/team)

Threading also gives each conversation its own space, which means that community
members never have to feel like they are interrupting when they speak up.
“Threading makes it easy for anyone to jump in,” Rachel explains. ”Folks don’t
feel like they’re stepping onto someone’s conversation.”

Over the years, the Recurse Center has used Zulip’s customization features and
powerful, well-documented APIs to set up a space that really feels like a home
for the community. “We use so many custom emoji,” says Rachel Petacat.

A whole crew of bots is on hand to help out, from Chatbot for quick chat intros,
to [RSVPBot](https://github.com/wtfcarlos/RSVPBot#readme) for creating and
managing calendar events, to
[Blaggeregator](https://github.com/recursecenter/blaggregator#readme), which
aggregates blog posts for the RC community.


## “I can’t imagine being able to operate Recurse Center without Zulip”

Rachel Petacat is a long-time member of RC’s leadership team. Her job requires
keeping up with the ~45 members in the current batch, making sure they have what
they need to get the most out of their RC experience.

To juggle everything she needs to get done, Rachel takes full advantage of the
flexibility between synchronous and asynchronous discussions that Zulip offers.
Realtime chat on Zulip is perfect for coordinating with other members of the
leadership team. “Zulip is one of the first tabs I open at the start of the work
day,” Rachel says. “I can check what’s happening, and plan my day. Other
organizers and I tag each other on Zulip if we need any help.”

Rachel uses Zulip to follow the ongoing conversations, and help out as needed.
Zulip’s threading model makes it easy to review discussion threads every few
hours, and respond in context. “I read the discussions on Zulip once in the
morning and again in the afternoon, chiming in where I need to,” says Rachel.
With Zulip, Rachel is able to manage the community without her focus being
interrupted by the need to jump in before the moment has passed. “I can’t
imagine being able to operate the Recurse Center without Zulip,” Rachel says.


## An alum experience: Staying connected since 2015

One of the benefits of participating in RC is the opportunity to stay connected
with the community. “You'll be able to participate in the RC community online
forever,” the RC website [explains](https://www.recurse.com/why). “Almost 30% of
the RC community is regularly active [on
Zulip](https://www.recurse.com/blog/112-how-rc-uses-zulip),” an incredible
statistic for a 6-12 week program with many alumni who attended years ago. Many
alums drop in on Zulip to chat, pair-program, and host events.

John Hergenroeder first attended RC back in 2015. In the Recurse Center, John (a
software engineer by profession) found the inclusive and welcoming programming
community he was looking for.

Even with everyone sitting in the same room, Zulip served as a social hub for
John’s RC cohort. “People had different schedules, so we used Zulip to leave
questions, work artifacts, demos — anything you thought was interesting,” John
says. This let participants engage with the content asynchronously, and created
a lasting record for the community. “We even used a Zulip topic to coordinate
for lunch, to let people have their uninterrupted focus time,” John says.

Since 2015, John has stayed connected with the RC alumni community on Zulip. “We
have a channel for alumni check-ins, where each alum uses a dedicated topic to
post updates,” John explains. Some alums drop by weekly, while others might come
around once a year.  “You can leave a note, and it’s OK if your friend reads it
a few months later,” John says. “Compare that with Slack, where if someone
doesn’t see a message in some channel on that day, they’ll *never* see it.”

Without dedicating a lot of time, John is able to stay involved in the community
on Zulip, and share his expertise where relevant. “I scan [recent
topics](/help/recent-conversations) for places where I could help, and rely on
email notifications for private messages,” John explains. The experience of
keeping up on Zulip is in sharp contrast with Slack, which John uses at work:
“It’s so hard to keep up with the Slack firehose.”

> “Zulip allows people who are engaging with the community at different paces to connect.”
>
> — John Hergenroeder, Recurse Center alum


## Zulip’s open-source ethos

Zulip is developed as open-source software, with an active and growing
community; over 1100 people have contributed code to the project. As a long-time
Zulip user, John Hergenroeder appreciates the many thoughtfully designed
[features](https://zulip.com/features/) unique to Zulip.
“[Choosing](https://zulip.com/help/mention-a-user-or-group#silently-mention-a-user)
whether or not a mention notifies people is really handy,” John says. “[Global
times](https://zulip.com/help/format-your-message-using-markdown#global-times)
are great for organizing events, and
[spoilers](https://zulip.com/help/format-your-message-using-markdown#spoilers)
were perfect for chatting about the Advent of Code puzzles.”

And if Zulip is missing some feature? “We can file an issue, or even go and make
it happen,” says John. Over the years, John has filed [11
issues](https://github.com/zulip/zulip/issues?q=is%3Aissue+author%3Ajdherg+is%3Aclosed)
in the Zulip issue tracker that have been resolved, and dozens of Recursers have
contributed code to Zulip. It’s a radically different experience from trying to
give feedback to a corporation building a closed-source product. When he
encounters issues with Slack, John has his strategy: “When I come across a Slack
bug, I try to find someone I know who works there, because I have no idea if
anyone will pay attention if I go through support.”


## Going virtual: “For a while, Zulip *was* RC”

Prior to 2020, the Recurse Center offered an immersive in-person retreat
experience in the heart of New York City. This paradigm was shattered when the
Covid-19 pandemic hit New York in March 2020, and the Recurse Center made the
difficult decision to [move all operations
online](https://www.recurse.com/blog/152-RC-is-online-only-until-at-least-May).

Over time, the Recurse Center built out a custom virtual world (integrated with
Zulip) for online participants.  But in the early days of the pandemic, it was
Zulip that replaced the physical space where RC participants had spent time
together and helped each other out. “At the time, all we had was Zulip, email,
our website, Zoom, and a rarely used forum,” recalls RC’s Head of Retreat Rachel
Petacat.  “For a while, Zulip *was* RC.”


## An invaluable knowledge base

Edith, who works as a technical writer, participated in virtual RC in 2020. Two
years later, she still uses Zulip every day to stay connected.

Zulip’s combination of powerful search and topic-based threading makes prior
discussions both findable and useful.  “It’s easier to build context with Zulip
than any other tool,” Edith says. “With other messaging services, information
tends to get lost. In Zulip, I often look something up from a while ago —
anything from discussion of niche programming topics, to whether anyone has
commented on a book I’m thinking about reading.”

“You really feel that you’re joining a group of 2000 people who’ve been doing
this for 10 years,” says Rachel Petacat. “You can find someone who trod the same
path 6 years ago!”

---

Check out our guides on using Zulip for [education](/for/education/) and
[events](/for/events/), and learn how Zulip [helps communities
grow](/for/communities/)!
```

--------------------------------------------------------------------------------

---[FILE: rush-stack-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/rush-stack-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: Rush Stack open-source community | Zulip" %}

{% set PAGE_DESCRIPTION = "Learn how Zulip makes it easy for the Rush Stack
  community to provide the level of support required for mission-critical
  enterprise tools." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-pycon">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: Rush Stack <br /> open-source community</h1>
        </div>
        <div class="hero-text">
            Learn more about using Zulip for<br /> <a href="/for/open-source/">open
            source projects</a> and <a href="/for/communities/">communities</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/rush-stack-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: rush-stack-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/rush-stack-case-study.md

```text
[Rush Stack](https://rushstack.io/) is an open-source collection of specialized
tooling for working with the world's largest source code repositories.

Providing support is often a challenge for open-source projects, especially when
maintainers are juggling internal investigations at work alongside their
open-source correspondence.  Yet to be successful, the Rush Stack community
needs to systematically handle questions and feedback.

Zulip makes it easy for the Rush Stack community to provide the level of support
required for mission-critical enterprise tools. “With Zulip, we have a system
that feels professional, where once a topic is opened, we can make sure that it
gets resolved,” says Rush Stack maintainer [Pete
Gonzalez](https://github.com/octogonz).


> “With Zulip, we have a system that feels professional.”
>
> — Rush Stack maintainer Pete Gonzalez


## Choosing a chat product? Focus on the features that matter.

Pete Gonzalez started researching chat platform options for the Rush Stack
community in early 2020, looking to replace Gitter. “I had worked on
[Yammer](https://en.wikipedia.org/wiki/Viva_Engage), and even wrote my own
client, so I was thinking about chat apps very deeply,” Pete recalls. “Although
chat apps may seem similar, there are actually many subtle design tradeoffs
whose combination determines whether an app will work well for a particular use
case.”

Rush Stack needed a space for maintainers and community members to have serious,
long-running conversations. “Rush Stack discussions have the character of
support tickets,” Pete explains. “Someone can ask a question that might take two
years to finally solve.”

Pete identified Zulip as the best fit for the needs of the community. With
Zulip’s topic-based organization, conversations can run their course, with the
full context of the discussion easily at hand when someone has a new idea.
“Zulip gives you control,” Pete points out. “You can edit or move messages to
fix anything that might be incorrect or confusing, which is important for
long-running discussions.”


> “Zulip gives you control.”
>
> — Rush Stack maintainer Pete Gonzalez

To make the transition, Rush Stack imported the project’s full chat history from
Gitter into Zulip, making it an easily searchable resource. Enabling Zulip’s
feature for logging in with GitHub meant that users didn’t have to make new
accounts. Users could also control how their messages looked with familiar
Markdown formatting.


## “Zulip has better features for the way we use it”

Over the years, Pete had continued to keep an eye on the evolution of team chat
products. “Compared to Discord, Slack, GitHub discussions… Zulip has better
features for the way we use it,” he says.

Pete has seen open-source maintainers struggle to manage a Discord community:
“There are all these people asking questions… If an important question scrolls
out of view, how would you follow up? Maintainers end up giving up on community
management, leaving casual participants to sort things out on their own.”

Slack’s paid plans, which start at $8.75/user/month, are unaffordable for
community use. “You have to pay a lot for Slack history, and users can’t log in
with their GitHub account,” Pete says. On the free plan, communities have access
to just 90 days of message history, which is unworkable for a community with a
large knowledge base and long-running investigations.


> “Of all the apps I tested, Zulip’s approach stood out as the best fit for how
> we work.”
>
> — Rush Stack maintainer Pete Gonzalez


## Software that’s built in the open and always improving

Pete has been impressed by how Zulip handles user feedback. “I can go into the
development community to talk to them, and often the tech lead of the team will
reply,” he notes. “Even if their answer is that my request is a lower priority
right now, there is context to understand that. New features are always being
added, and with the team’s daily discussions being public, I can see what they
are working on and why. It’s a really different dynamic from trying to make
feature requests or bug reports for a closed source product with an invisible
engineering team.”


> “New features are always being added, and with the team’s daily discussions
> being public, I can see what they are working on and why.”
>
> — Rush Stack maintainer Pete Gonzalez

Pete was pleased to learn that organizations can now allow [public
access](/help/public-access-option) to channels. It lowers the bar for people to
view Zulip discussions that are linked from Rush Stack GitHub issues.

Pete has also seen Zulip’s onboarding experience transform over the past few
years. “In the past, Zulip was optimized for daily users, and so had a bit of a
learning curve for occasional Rush Stack participants. But the UX has improved a
lot in this regard. The [recent conversations](/help/recent-conversations) view
that’s been added has largely addressed the challenge for new users,” Pete says.
This view lists the topics being discussed, and is also the go-to for Pete to
check in on what’s happening.


> “The folks who make Zulip listen to customers, and the product continues to
> improve.”
>
> — Rush Stack maintainer Pete Gonzalez

---

Check out our guide on using Zulip for [open source](/for/open-source/), and
learn how Zulip [helps communities scale](/for/communities/)!
```

--------------------------------------------------------------------------------

---[FILE: rust-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/rust-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: Rust programming language community | Zulip" %}

{% set PAGE_DESCRIPTION = "Learn why Rust development would not be moving at the
  pace that it has been without Zulip, and the organized, searchable conversations it enables." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-pycon">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: Rust<br/>programming language community</h1>
        </div>
        <div class="hero-text">
            Learn more about using Zulip for<br /> <a href="/for/open-source/">open
            source projects</a> and <a href="/for/communities/">communities</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/rust-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: rust-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/rust-case-study.md

```text
## Rust: A popular programming language built by 1000s of contributors

[Rust](https://www.rust-lang.org/) is a popular modern programming language,
designed for performance, reliability and productivity, and used by hundreds of
companies around the world. Organized into teams and working groups, the Rust
project is led by [over 100 team members](https://www.rust-lang.org/governance)
who oversee the work of [more than 6000
contributors](https://thanks.rust-lang.org/).


## Rust moves to Zulip, one team at a time

Each Rust team decides independently how to organize itself and what
communication tools to use. Every major Rust team has chosen Zulip as their chat
platform, including the
[Compiler](https://www.rust-lang.org/governance/teams/compiler),
[Language](https://www.rust-lang.org/governance/teams/lang),
[Library](https://www.rust-lang.org/governance/teams/library) and
[Infrastructure](https://www.rust-lang.org/governance/teams/infra) teams. Some
Rust teams have migrated between collaboration tools two or even three times in
search of an effective solution. No team has moved away from Zulip after trying
it.

“Zulip lets us move faster, connect with each other better, and have interactive
technical discussions that are organized, recorded, and welcoming to other
people,” says [Rust Language
team](https://www.rust-lang.org/governance/teams/lang) co-lead [Josh
Triplett](https://joshtriplett.org/).


> “Zulip lets us have focused conversations at scale.”
>
> — [Rust compiler team](https://www.rust-lang.org/governance/teams/compiler) co-lead [Felix
> Klock](https://github.com/pnkfelix)


## The Language team moves from Discord to Zulip: “It’s better in all the ways I care about”

Let’s take a closer look at the story of the Rust Language team, which works on
designing and helping to implement new language features. The team started out
by using Gitter, but moved to Discord in 2018 in search of a more stable
solution.

Some community members advocated for trying out Zulip, but the team leadership
was reluctant to make another change. “Everyone in our community who was
familiar with Zulip seemed thrilled with it,” says [Language
team](https://www.rust-lang.org/governance/teams/lang) co-lead [Josh
Triplett](https://joshtriplett.org/), “but moving our team seemed like too much
of a pain.”

Eventually, Josh had to sign up for Zulip in order to get in touch with another
Rust team. “After a day of using Zulip, I became an advocate myself,” he says.
“Zulip is wildly simpler than most other tools I’ve worked with.” The team made
the move in November 2019 and has never looked back.

“I’m personally ecstatically happy with Zulip,” says Josh, who also uses the
Zulip instances for the [Bytecode Alliance](https://bytecodealliance.org/),
[Rust for Linux](https://github.com/Rust-for-Linux), and
[http-rs](https://github.com/http-rs/tide) Zulip communities. “It’s better in
all the ways I care about and a joy to use.”


> “Zulip is wildly simpler than most other tools I’ve worked with.”
>
> — [Rust Language team](https://www.rust-lang.org/governance/teams/lang) co-lead
> [Josh Triplett](https://joshtriplett.org/)


## Zulip enables organized, searchable conversations

Zulip’s threading model provides a two-layer organizational hierarchy. It offers
the advantages of a forum or a mailing list, reimagined in the context of a
modern chat tool.

In contrast with other chat tools, Zulip makes it pleasant to have **multiple
conversations** going on at once, with each conversation being easy to follow.
“Slack and Discord both suffer when trying to collaborate with others at scale —
you end up with conversations happening across each other,” says [David
Wood](https://davidtw.co/), member of the [Rust compiler
team](https://www.rust-lang.org/governance/teams/compiler). “In Zulip, I can
instantly see the context for each message.”

Afterwards, Zulip’s thread-based organization creates a **clear record** of
past discussions, documenting the decision-making process. “Zulip creates a
transparent record of what we do,” says Josh. It’s **easy to link** to Zulip
threads from other tools in order to provide background context. “We link to
Zulip threads all the time on GitHub, Twitter, email, Discourse, and from other
Zulip messages,” [Josh Triplett](https://joshtriplett.org/) says.


> “Slack and Discord feel opaque. Zulip feels like an open room.”
>
> — [Rust Language team](https://www.rust-lang.org/governance/teams/lang) co-lead
> [Josh Triplett](https://joshtriplett.org/)

Because information on Zulip is **well-organized**, one can easily find and
review earlier conversations, even if months have passed. The organization’s
**rich history** continues to provide value indefinitely.  “I can find and
re-read old conversations,” says [Rust Language
team](https://www.rust-lang.org/governance/teams/lang) co-lead [Niko
Matsakis](https://github.com/nikomatsakis). “If I send someone a link to a
discussion, they can jump right in; this would be impossible in other chat tools
I’ve used.”

Unlike other chat tools, a discussion on Zulip can even be revived after weeks
or months have passed if new information or ideas come to light, with no loss of
**surrounding context**.

Catching up works great, whether you were away for hours, days, or even weeks.
“When I come back after a break, I don’t feel overwhelmed: I can skim topics
looking for the ones that seem important, and scroll briefly through the rest,”
says [Rust Language team](https://www.rust-lang.org/governance/teams/lang)
co-lead [Niko Matsakis](https://github.com/nikomatsakis).


> “When I come back after a break, I don’t feel overwhelmed.”
>
> — [Rust Language team](https://www.rust-lang.org/governance/teams/lang)
> co-lead [Niko Matsakis](https://github.com/nikomatsakis)


## Zulip makes the Rust community more agile

In addition to being well-organized, Zulip interactions are
**conversational**, enabling **faster decision-making**. GitHub issues about
controversial Rust language decisions can devolve into incomprehensible comment
threads with [several](https://github.com/rust-lang/rust/issues/57640)
[hundred](https://github.com/rust-lang/rust/issues/34511)
[messages](https://github.com/rust-lang/rust/issues/28237).  “Some decisions
that were blocked for months on GitHub were resolved within 24 hours by starting
the right conversation on Zulip,” says [Rust Language
team](https://www.rust-lang.org/governance/teams/lang) co-lead [Josh
Triplett](https://joshtriplett.org/).


> “Some decisions that were blocked for months on GitHub were resolved within 24
> hours on Zulip.”
>
> — [Rust Language team](https://www.rust-lang.org/governance/teams/lang) co-lead
> [Josh Triplett](https://joshtriplett.org/)

With the features and feel of a **modern chat tool**, Zulip makes it easy to
have quick, light-weight, friendly conversations to get work done. “Zulip
strikes just the right balance between ephemeral and permanent,” [Josh
Triplett](https://joshtriplett.org/) says. The [mobile
applications](/apps/) make it easy to participate wherever you
are. “The Android app is extremely functional,” says Josh. “It’s easy to set
notification preferences, and the default level of notifications is just right.”

Adopting Zulip has been transformational for how the Rust community makes
progress. “Rust development would not be moving at the pace that it has been
without Zulip,” says [Rust Language
team](https://www.rust-lang.org/governance/teams/lang) co-lead [Josh
Triplett](https://joshtriplett.org/). “Without Zulip, the Rust community would
be more stuck, more slow-moving, less agile, and a little less human.”


> “Rust development would not be moving at the pace that it has been without
> Zulip.”
>
> — [Rust Language team](https://www.rust-lang.org/governance/teams/lang) co-lead
> [Josh Triplett](https://joshtriplett.org/)

---

Check out our guide on using Zulip for [open source](/for/open-source/), and
learn how Zulip [helps communities scale](/for/communities/)!
```

--------------------------------------------------------------------------------

---[FILE: semsee-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/semsee-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: Semsee | Zulip" %}

{% set PAGE_DESCRIPTION = "“I don't like going back to Slack now. It's just not
  as efficient a way to organize communication.” Learn how Zulip is used at
  InsurTech startup Semsee." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: Semsee</h1>
            <p>InsurTech Startup</p>
        </div>
        <div class="hero-text">
            Learn more about using Zulip for <a href="/for/business/">business</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/semsee-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

````
