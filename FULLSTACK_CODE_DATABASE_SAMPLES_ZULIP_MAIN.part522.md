---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 522
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 522 of 1290)

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

---[FILE: semsee-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/semsee-case-study.md

```text
[Semsee](https://semsee.com/) is a technology startup in the commercial
insurance space, building intelligent software that digitizes slow manual
processes. Originally based out of an office in New York, Semsee moved to a
remote-work model during the pandemic, and now has several satellite teams
across the US.

Semsee adopted Zulip early on in its journey. “We didn’t plan to be remote,”
says James van Lommel, [Director of
Engineering](https://www.linkedin.com/in/james-v-91a65219/) at Semsee. “But now
that we are remote, it’s good to have a communication tool that really backs
that up.”


> “Now that we are remote, it’s good to have a communication tool that really
> backs that up.”
>
> — James van Lommel, Director of Engineering at [Semsee](https://semsee.com/)


## Looking for something better than Slack

James van Lommel joined Semsee in 2018 to lead the engineering team. At the
time, the company was using Slack. James knew his choice of communication
platform would have broad implications: “Communication helps feed the type of
culture you have at a company,” James says.

James had used Slack extensively in his prior work experience. “Seeing how Slack
gets used, especially as a company grows larger, I knew I wanted something
better,” he recalls. “If you are not using Slack *all the time*, you can’t keep
up with what’s happening.” James wanted a chat tool that would create breathing
room for focused work, in-person conversations, and different work schedules.

> “Seeing how Slack gets used, especially as a company grows larger, I knew I
> wanted something better.”
>
> — James van Lommel, Director of Engineering at [Semsee](https://semsee.com/)

In addition, as a security expert, James was interested in a self-hosted
solution. “There is so much sensitive data that goes into a chat tool,” he says.
“When we self-host, the messages don’t live on anyone else’s cloud.”

When James discovered Zulip, the topic-based threading model piqued his
interest. “I didn’t want Mattermost or another self-hosted Slack clone,” he
says. James quickly set up a Zulip server — he found that the instructions for
self-hosting were easy to follow, and worked without a hitch. After trying Zulip
for a few days with some coworkers, James was convinced that Zulip was the right
choice for Semsee. “We need our employees to be able to come to the right place,
and have a conversation about one thing,” he says. “Zulip solves that pain
point.”


## An efficient way to organize communication

These days, Zulip is at the core of company communication at Semsee. Email is
rarely used for internal communications. For jumping on a call, Zulip’s native
call integration is an easy starting point. System monitoring and software
development processes are integrated with Zulip via the API. For example, a
custom integration sends logging data from Semsee’s product into Zulip, with a
channel and topic configured based on the deployed environment.

New employees adapt easily to Zulip’s organized conversations. By reading
ongoing discussions, they quickly get an intuition for when to start a new
topic, and what kinds of topic names work well. “Once they get used to Zulip,
they are just rolling with it, and I don’t hear any complaints,” says James.
With conversations organized by topic, “people don’t have to scroll through and
cherry-pick out the messages they need to read,” James says.

Semsee invites customers to join the company Zulip chat as guests. “Our
customers just see one channel with one or two topics, so it’s very easy for
them,” James explains. On the flip side, when Semsee employees are invited to
join customers’ Slack chats, they miss Zulip. “I don’t like going back to Slack
now. It’s just not as efficient a way to organize communication,” says James. “A
few users from an extensive Slack background have told me: ‘Zulip is just
better.’"


> “I don’t like going back to Slack now. It’s just not as efficient a way to
> organize communication.”
>
> — James van Lommel, Director of Engineering at [Semsee](https://semsee.com/)

---

Check out our guide on [using Zulip for business](/for/business/). You can also
learn how Zulip is being used at the [Atolio](/case-studies/atolio/) startup,
the [iDrift AS](/case-studies/idrift/) company, the [End Point
Dev](/case-studies/end-point/) software consultancy, and the [GUT
contact](/case-studies/gut-contact/) support agency.
```

--------------------------------------------------------------------------------

---[FILE: tum-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/tum-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: Technical University of Munich Department of Informatics | Zulip" %}

{% set PAGE_DESCRIPTION = "How do you teach computer science to 1400 freshmen?
  “Zulip is the only app that makes hundreds of conversations manageable.”" %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: Technical University of Munich <br /> Department of Informatics</h1>
        </div>
        <div class="hero-text">
            Learn more about <a href="/for/education/">Zulip for Education</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/tum-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: tum-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/tum-case-study.md

```text
## How do you teach 1400+ students?

The [Technical University of Munich](https://www.tum.de/en/) (TUM) is
one of Europe’s top universities. Every year, its Department of
Informatics ([ranked #1 in Germany][tum-ranking]) welcomes over a
thousand freshmen to the undergraduate program.

Teaching introductory computer science courses to 1400-2000 students
at a time is a massive undertaking. Just answering student questions
easily takes 1500+ messages *per homework exercise*. Instructors have
cycled through product after product in search of a way to manage
communication with students, and among the 30-50 person course staff.

## Communication platform is key

[Tobias Lasser](https://ciip.in.tum.de/people/lasser.html), lecturer
at the TUM Department of Informatics, set out to teach an introductory
algorithms class with 1400 students in April 2020, as the COVID-19
pandemic was sweeping across Europe. With instruction moving online,
he knew that finding an effective communication platform was more
important than ever.

“Our default teaching platform is Moodle, which is fine for
announcements, but does not scale for discussions,” Tobias says. “Our
university also hosts Rocket.Chat, but when some colleagues tried it
for a large class, it was a complete mess.” Due to strict European
regulations, cloud-only solutions like Piazza, Slack and Discord were
non-starters for data privacy reasons. “I checked Mattermost and
Element, but wasn’t happy with the user interface for either.” That’s
when Tobias came across Zulip.

## “Better user experience than Slack”

Tobias evaluated Zulip by [visiting the Zulip development
community](/development-community/) to see it in action. “It takes a bit of
time to get used to, but Zulip has the best user experience of all the
chat apps I’ve tried,” Tobias says. “With the discussion organized by
topic within each channel, Zulip is the only app that makes hundreds of
conversations manageable.”

Despite initially asking to use Slack, students came to love Zulip’s
model. “Many students commented how great Zulip was on the course
evaluation forms,” Tobias says.

## Word about Zulip spreads

Word about Tobias’s success with teaching with Zulip quickly spread
throughout the department. One year later, the department’s Zulip
organization is used by 4400 students and educators. “I’m working to
establish Zulip as the new default communication platform for teaching
in the department, for classes of all sizes”, Tobias says.

Other instructors have loved using Zulip as well. “I consider Zulip to
be the best tool in terms of privacy and usability, and try to
implement it in all courses where I collaborate,” says Johannes Stöhr,
teaching assistant for multiple courses at the department.

## A welcoming open-source community

Robert Imschweiler, an undergraduate at the TUM, is responsible for
maintaining the department’s Zulip server. “Our chat needs to be
self-hosted to comply with European laws about protecting student
data,” Robert says. “Zulip has been extremely stable and requires no
maintenance beyond installing updates.”

When questions arise, Robert stops by the Zulip development community to ask for
advice. “Right before exams, we had over 1000 students online at once, and I
was worried that the CPU usage was high. The community investigated my
problem immediately, and a couple of days later they [shared a patch]
[czo-patch-thread] that resolved it.” This patch to improve performance at
scale was released to all users as part of [Zulip 4.0][zulip-4-blog].

Since then, Robert has built several Zulip customizations for the
department, and has had them merged to the upstream project. “I feel
very welcomed as a new contributor and am glad that I’ve been able to
contribute a few patches of my own,” Robert says.

---

Learn more about [Zulip for Education](/for/education/), and how
Zulip is being used at the [University of California San
Diego](/case-studies/ucsd/) and the [National University of Córdoba](/case-studies/university-of-cordoba/).
You can also check out our guides on using Zulip for [conferences](/for/events/)
and [research](/for/research/)!


[tum-ranking]: https://www.in.tum.de/en/the-department/profile-of-the-department/facts-figures/facts-and-figures-2020/
[czo-patch-thread]: https://chat.zulip.org/#narrow/channel/3-backend/topic/Tornado.20performance/near/1111686
[zulip-4-blog]: https://blog.zulip.com/2021/05/13/zulip-4-0-released/
```

--------------------------------------------------------------------------------

---[FILE: ucsd-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/ucsd-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: University of California San Diego | Zulip" %}

{% set PAGE_DESCRIPTION = "How do you teach graduate-level mathematics to
  students across six continents? “I chose Zulip especially for the threaded model
  and the TeX integration.”" %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: University of California San Diego</h1>
        </div>
        <div class="hero-text">
            Learn more about <a href="/for/education/">Zulip for Education</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/ucsd-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: ucsd-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/ucsd-case-study.md

```text
## Making the best of a tough year

[University of California San Diego
(UCSD)](https://ucsd.edu/about/index.html) is recognized as one of the
top universities worldwide. The UCSD math department offers
prestigious graduate and undergraduate programs, with course topics
ranging from foundational material to cutting-edge research.

In response to the COVID-19 pandemic, UCSD instruction moved online early
in 2020. As instructors scrambled to figure out online education,
Kiran Kedlaya, Professor of Mathematics at UCSD, gave himself a bigger
challenge: “Seeing the unique opportunity, I decided to open my
classes up to the world,” Kiran says.


## Communication is key

Kiran knew that an effective chat platform would be key for
communicating with students. He had prior experience with Slack,
Discord and Zulip.  “I chose Zulip for several reasons, especially the
threaded model (which I find sorely lacking in other chat apps), and
the TeX integration.”

From Spring 2020 through Spring 2021, the [Zulip
Standard](/for/education/#feature-pricing) plan was free for all educators,
as we did our part to help make the transition to online education a
little easier. Having set up Zulip Cloud for his three graduate-level
courses, Kiran felt confident in the communication platform, and was
ready to make his classes open to all.


## Teaching students across six continents

Students worldwide jumped on the opportunity to take a course with
Kiran. “Of the 350 students in my classes, no more than 15% were local
to UCSD,” Kiran says. A Zulip poll showed participants from as far as
the Middle East, Southeast Asia and Oceania.

“Zulip became a central hub for asynchronous Q&A and posting Zoom
links for lectures, whiteboard PDFs, and announcements,” Kiran says.

With students logging in at all hours of the day, Zulip’s topic model
was key to making sure everyone could find the materials they needed
and participate in the discussions. “Zulip’s topics, and the ability
to change the topic of someone else's message, has made it much easier
for me to keep things coherent,” says Kiran.


## Zulip has what you need

Beyond topics, Zulip’s rich functionality smoothed out made many
aspects of remote communication. Here is what Kiran has to say about
the benefits of just a few of Zulip’s features:


- **Discussing math**: “The
  [**TeX**](/help/format-your-message-using-markdown#latex)
  made it super easy to discuss material from the course using
  proper mathematical notation, and was one of the reasons I chose
  Zulip in the first place.”
- **Quick pulse-checks**: “[**Emoji
  reactions**](/help/emoji-reactions) were a nice way
  to collect RSVPs for office hours or acknowledge typo corrections
  for my lecture notes.”
- **Hiding answers**:
  “[**Spoilers**](/help/format-your-message-using-markdown#spoilers)
  are a great way to answer questions about homework without depriving
  students of a chance to keep thinking about the problem on their
  own.”
- **Scheduling**: “With [**global
  times**](/help/format-your-message-using-markdown#global-times),
  I could announce office hours or outside lectures without having to
  worry about confusion for students in different time zones.”


## Education beyond coursework

What happens once classes return to campus? “I intend to continue to
use Zulip as the main communication platform for my in-person classes
this coming year,” Kiran says.

Zulip is also helping Kiran organize events for students, and create
communities for education and research. “I used Zulip as the
communication hub for a 200-person undergraduate conference that was
held virtually for the first time,” Kiran says. “I’ve also started a
Zulip for the number theory research group at UCSD, where graduate
students and postdocs can connect to discuss reading courses, social
events, conferences of interest, etc.”

---

Learn more about [Zulip for Education](/for/education/), and how
Zulip is being used at the [Technical University of Munich](/case-studies/tum/)
and the [National University of Córdoba](/case-studies/university-of-cordoba/).
You can also check out our guides on using Zulip for [conferences](/for/events/)
and [research](/for/research/)!
```

--------------------------------------------------------------------------------

---[FILE: university-of-cordoba-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/university-of-cordoba-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: National University of Córdoba FAMAF | Zulip" %}

{% set PAGE_DESCRIPTION = "Learn how Zulip connects faculty with students at the
  National University of Córdoba, crossing the generational divide." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: National University of Córdoba</h1>
            <p>Faculty of Mathematics, Astronomy, Physics and Computing (FAMAF)</p>
        </div>
        <div class="hero-text">
            Learn more about <a href="/for/education/">Zulip for Education</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/university-of-cordoba-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: university-of-cordoba-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/university-of-cordoba-case-study.md

```text
Founded in 1613, the National University of Córdoba is the second largest
university in Argentina, with tuition-free enrollment for all. The university’s
Faculty of Mathematics, Astronomy, Physics and Computing (FAMAF) teaches classes
to over 5000 undergraduates from all over the country.

“Zulip is a key piece of how we run classes in our department,” says Nicolás
Wolovick, a professor at FAMAF and director of the computer science career
track. “If we didn’t have Zulip, I really don’t know how we’d manage it.”

## Sponsored hosting for a modern team chat app

For a while, FAMAF used Moodle’s course management software to communicate with
students, but “it was a pain,” Nicolás recalls. The department tried moving to
Slack. However, without a software budget, the message history limit on Slack’s
free plan was a major frustration.

In search of an alternative, a faculty member reached out to request a sponsored
Zulip Cloud Standard plan. With the request approved the very next day, the
department moved over to Zulip starting starting in Fall 2020.

Looking back, being pushed off Slack by its search history limit ended up being
for the best: “I think Zulip is a great tool, much better than Slack,” says
Miguel Pagano, professor at FAMAF.

> “I think Zulip is a great tool, much better than Slack.”
>
> — Miguel Pagano, professor at FAMAF of the National University of Córdoba

## Zulip becomes a knowledge base

Zulip has become part of the core flow of how faculty at FAMAF run their
classes. Instructors create channels for the classes they teach each semester.
For lab classes, instructors make private channels for communication with each
project group. “I use pinned channels to focus on the two subjects I’m teaching
right now,” Nicolás notes.

Discussions from prior semesters are available for easy reference, so
instructors can simply point students to past conversations for answers to their
questions. “Zulip acts as a knowledge database of what we did in each subject,”
Nicolás explains. “The search is perfect.”

> “We can find messages from five years ago — it’s very convenient.”
>
> — Miguel Pagano, professor at FAMAF of the National University of Córdoba

## A cross-generational app for instructors and students

Many members of the faculty prefer familiar tools, and sometimes find the UI of
apps like Discord overwhelming. So it matters that Zulip has a clean interface,
with channels and conversations inside channels clearly presented. There are
also some friendly touches: “I love using Markdown for message formatting, and
that you can copy-paste formatted text, and it translates accurately,” Nicolás
notes.

> “The UI is spartan, simple, clear — I like that. It reminds me of what Google
> used to be.”
>
> — Nicolás Wolovick, professor at FAMAF of the National University of Córdoba

And while students hardly use email, Nicolás and other faculty appreciate being
able to send messages to Zulip by replying to email notifications.

At the same time, Zulip offers fun features for the students. “We have a whole
subculture of custom emoji,” Nicolás says. “Students love to use them to
customize the space and express themselves.”

Still, the overall vibe is professional, and moderation has never been an issue.
“I’ve never had to ban anyone or even delete a message,” Nicolás says. Students
keep their Zulip account after graduation, which provides a way for faculty and
alumni to stay connected.

---

Learn more about [Zulip for Education](/for/education/), and how Zulip is being
used at the [Technical University of Munich](/case-studies/tum/) and the
[University of California San Diego](/case-studies/ucsd/). You can also check
out our guides on using Zulip for [conferences](/for/events/) and
[research](/for/research/)!
```

--------------------------------------------------------------------------------

---[FILE: windborne-case-study.html]---
Location: zulip-main/templates/corporate/case-studies/windborne-case-study.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Case study: WindBorne | Zulip" %}

{% set PAGE_DESCRIPTION = "Learn how Zulip became the irreplaceable hub for
  coordinating work at WindBorne, from balloon launches around the globe to
  building state-of-the-art AI models." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page case-study-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Case study: WindBorne</h1>
            <p>Tech startup with worldwide operations</p>
        </div>
        <div class="hero-text">
            Learn more about using Zulip for <a href="/for/business/">business</a>.
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/case-studies/windborne-case-study.md') }}
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: windborne-case-study.md]---
Location: zulip-main/templates/corporate/case-studies/windborne-case-study.md

```text
How can a scrappy startup help mitigate the most immediately destructive aspects
of climate change? [WindBorne](https://windbornesystems.com/) is advancing
humanity's ability to predict the weather — from hurricanes to heatwaves — and
thus manage its impacts.

Zulip has been WindBorne's irreplaceable hub for coordinating work
that ranges from balloon launches around the globe to developing
state-of-the-art AI models.

> “All our digital communication flows through Zulip… We have three deep
> learning channels, each with twenty active topics a day. No other chat system
> could support that.”
>
> — John Dean, co-founder and CEO of WindBorne

<figure class="markdown-image-with-caption">
  <img src="/static/images/landing-page/case-studies/WindBorne-constellation.png" alt="Atlas, the largest balloon constellation in the world">
  <figcaption class="markdown-image-caption">WindBorne Atlas, the largest balloon constellation in the world</figcaption>
</figure>

## “We were addicted to Slack”

When WindBorne co-founders started the company in 2019, Slack was the obvious
choice for their team chat. The team had met as Stanford undergrads, launching
high-altitude balloons with the [SSI](https://www.stanfordssi.org/) engineering
student group. “All the WindBorne cofounders were addicted to SSI's Slack — we
loved it,” says John Dean, WindBorne's co-founder and CEO.

The delight didn't last. The company's 12-person team was trying to use chat for
serious technical discussions, and Slack's user experience didn't feel so great
for that purpose. “With overlapping conversations, there was no way to make it
work. Slack threads are trying to solve a real problem, but solving it in a bad
way,” says John.

“Over 2019 and 2020, Slack got worse and worse,” John recalls. “I was using it
in Firefox on Linux, and things would just hang.” When Slack had outages, the
entire team's work would be disrupted for hours.

## “Oh my god, this is awesome”

When John discovered Zulip, its topic-based threading felt like the right
solution to Slack's messiness. After giving the app a try [in the Zulip
development community](https://chat.zulip.org/?show_try_zulip_modal), WindBorne
opted to host their own Zulip instance. (Never again will they have to rely on
an external vendor to manage their critical communication infrastructure.)

“After a couple of days, I thought: `Oh my god, this is awesome. How on earth
would you *not* use Zulip?'” John says. “It was so much easier to communicate.”

> “How on earth would you not use Zulip?”
>
> — John Dean, co-founder and CEO of WindBorne

Zulip's threading model was transformative, but John also appreciated other
touches. “[Zulip linkifiers](https://zulip.com/help/add-a-custom-linkifier) are
amazing,” John says. In WindBorne's Zulip, “W-” followed by a balloon's ID
number auto-links to that balloon's mission page, and “/live” goes to a live
map of balloon locations.

WindBorne's Head of Global Launch Operations Nathan Kaplan experienced a similar
revelation when he joined the company in 2023.  “My previous company used Slack,
and they required threads for everything. It was a complete mess,” Nathan says.
“Zulip took some getting used to, but after two weeks, it was so much better
than anything I'd used before.”

> “I love the application, and couldn't dream of going back to anything else.
> Slack and Discord just pale in comparison.”
>
> — Nathan Kaplan, Head of Global Launch Operations

## Communication hub for coordinating dozens of contractors worldwide

<div class="text-image-in-row">
  <p class="text-image-in-row-text">
    Nathan travels around the world to manage WindBorne's balloon
    launch sites — he's onboarded dozens of international contractors
    who run WindBorne's launch operations.
    <br/><br/>
    Nathan designed a streamlined experience for coordinating contractors, with Zulip as the hub.
    <br/><br/>
    “80 to 90 percent of the work a contractor does happens within their launch
    support channel on Zulip,” Nathan explains. “A big “aha” moment for them is
    knowing what they need to launch based on messages in the “launch planning”
    topic from the last few days, without having to do a bunch of scrolling.”
  </p>
  <figure>
      <!-- Set custom width to reduce image height so that it doesn't overflow text. -->
      <img
          class="text-image-in-row-image windborne-alaska-image"
          src="/static/images/landing-page/case-studies/Alaska-balloon.jpg"
          alt="Balloon launch in Alaska"
      >
      <figcaption class="markdown-image-caption">Balloon launch in Alaska</figcaption>
  </figure>
</div>

> “Zulip organizes ideas in such a clean and simple way. You get easy
> readability over months, not just hours like in other apps.”
>
> — Nathan Kaplan, Head of Global Launch Operations

Zulip also serves as a rapid prototyping platform to try out and refine
workflows before implementing them in WindBorne's dedicated launch management
product. Last year, Nathan used Zulip to develop a workflow for uploading photos
of balloon sensor bags. Only once requirements were clear did the team kick off
a major engineering project to build uploads into the launch management app.

> “Zulip offers us so much more than anything else really could — especially for
> the contractor onboarding experience, and how we manage the entire team.”
>
> — Nathan Kaplan, Head of Global Launch Operations

## The perfect platform for LLM bots

Zulip is a communal playground for WindBorne's team to try out new ideas. Using
Zulip's [bot API](https://zulip.com/api/running-bots), they built bots that
provide daily conversation summaries, post pull request reviews, and (more
whimsically) generate images of landscapes with balloons.

Zulip has been perfect for managing context for LLM bots: “If you integrate an
LLM bot into Slack, you can't manage its context window — off-topic messages can
poison the context,” John explains. “With Zulip, you can always just start a new
topic, and move messages around as needed.” John even uses a personal Zulip
instance as a note-taking app with integrated LLMs.

The team can experiment freely together without disrupting anyone's work: it's
easy to [mute](https://zulip.com/help/mute-a-topic) bot conversations you aren't
interested in. WindBorne
[allows](https://zulip.com/help/restrict-message-editing-and-deletion#configure-message-deletion-permissions)
any employee to delete messages to clear out experiments that didn't work out.
(Server administrators can review the activity log to make sure this permission
is not abused.)

> “Zulip allows me to build the culture I want.”
>
> — John Dean, co-founder and CEO of WindBorne
```

--------------------------------------------------------------------------------

````
