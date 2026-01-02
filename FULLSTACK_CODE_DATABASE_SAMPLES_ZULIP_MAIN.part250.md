---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 250
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 250 of 1290)

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

---[FILE: reviewable-prs.md]---
Location: zulip-main/docs/contributing/reviewable-prs.md

```text
# Submitting a pull request

A pull request (PR) is a presentation of your proposed changes to Zulip. Your aim
should be to explain your changes as clearly as possible. This will help
reviewers evaluate whether the proposed changes are correct, and address any
open questions. Clear communication helps the whole Zulip project move more
quickly by saving maintainers time when they review your code. It will also make
a big difference for getting your work integrated without delay.

You will go through the following steps to prepare your work for review. Each
step is described in detail below, with links to additional resources:

1. Write your code [with clarity in mind](#write-clear-code).
1. [Organize your proposed changes](#organize-your-proposed-changes) into a
   series of commits that tell the story of how the codebase will change.
1. [Explain your changes](#explain-your-changes) in the description for your
   pull request, including [screenshots](#demonstrating-visual-changes) for
   visual changes.
1. Carefully [review your own work](#review-your-own-work).
1. [Submit your pull request](#submit-your-pull-request-for-review) for review.

See the [pull request review process](../contributing/review-process.md) guide
for a detailed overview of what happens once your pull request is submitted.

## Write clear code

When you write code, you should make sure that you understand _why it works_ as
intended. This is the foundation for being able to explain your proposed changes
to others.

Zulip’s coding philosophy is to focus relentlessly on making the codebase easy
to understand and difficult to make dangerous mistakes. Our linters, tests, code
style guidelines, [testing philosophy](../testing/philosophy.md), [commit
discipline](../contributing/commit-discipline.md), this documentation, and our
attention to detail in [code review](../contributing/review-process.md) are all
important elements of this strategy. Following these guidelines is essential if
you'd like your work to be merged into the project.

If any part of your contribution is from someone else (code snippets, images,
sounds, or any other copyrightable work, modified or unmodified), be sure to
review the instructions on how to [properly attribute](./licensing.md) the work.

## Organize your proposed changes

The changes you submit will be organized into a series of commits. A PR might
contain a single commit, or a dozen or more, depending on the changes being
made.

Commits help you tell the story of how each change you are proposing is
necessary or helpful. If you were presenting your changes, a commit might be a
slide in your presentation. As a rough guideline, a good commit usually has less
than 100 lines of code changes. If you can see a way to split a commit into
different pieces of meaning, you should split it.

Keep in mind that you are presenting your final work product, _not_ the path you
took to get there. You should never have a commit that can be described as
fixing a mistake in an earlier commit in the same PR; use `git rebase -i` to fix
the mistake in the original commit.

See the [commit discipline guide](../contributing/commit-discipline.md) for more
details on how to structure your commits, and guidelines on how to write good
commit messages. Your pull request can only be reviewed once you've followed
these guidelines to the best of your ability. This makes it much easier for
reviewers to understand your work and identify any problems.

Ideally, when reviewing a pull request for a complex project, Zulip's
maintainers should be able to verify and merge the first few commits, and leave
comments on the rest. It is by far the most efficient way to do collaborative
development, since one is constantly making progress, we keep branches small,
and reviewers don't end up repeatedly going over the earlier parts of a pull
request.

## Explain your changes

By the time you are submitting your pull request, you should already have put a
lot of thought into how to organize and present your proposed changes. In the
description for your pull request, you will:

- Provide an overview of your changes.
- Note any differences from prior plans (e.g., from the description of the issue you
  are solving).
- Call out any open questions, concerns, or decisions you are uncertain about.
  The review process will go a lot more smoothly if points of uncertainty are
  explicitly laid out.
- Include screenshots for all visual changes, so that they can be reviewed
  without running your code. See [below](#demonstrating-visual-changes) for
  detailed instructions.

If you have a question about a specific part of your code that you expect to be
resolved during the review process, put it in a PR comment attached to a
relevant part of the changes.

Take advantage of [GitHub's formatting][github-syntax] to make your pull request
description and comments easy to read.

### Discussions in the development community

Any questions for which broader feedback or visibility is helpful are discussed
in the [Zulip development community](https://zulip.com/development-community/).

If there has been a conversation in the [Zulip development
community][zulip-dev-community] about the changes you've made or the issue your
pull request addresses, please cross-link between your pull request and those
conversations in both directions. This provides helpful context for maintainers
and reviewers. Specifically, it's best to link from your pull request [to a
specific message][link-to-message], as these links will still work even if the
topic of the conversation is renamed, moved or resolved.

Once you've created a pull request on GitHub, you can use one of the [custom
linkifiers][dev-community-linkifiers] in the development community to easily
link to your pull request from the relevant conversation.

## Review your own work

Before requesting a review for your pull request, follow our [review
guide](./code-reviewing.md#reviewing-your-own-code) to carefully review and test
your own work. You can often find things you missed by taking a step back to
look over your work before asking others to do so. Catching mistakes yourself
will help your PRs be merged faster, and reviewers will appreciate the quality
and professionalism of your work.

The pull request template in the `zulip/zulip` repository has a checklist of
reminders for points you need to cover in your review. Make sure that all the
relevant items on the self-review checklist have been addressed.

## Submit your pull request for review

If you are new to Git, see our guide on [making a pull
request](../git/pull-requests.md) for detailed technical instructions on how to
submit a pull request.

When submitting your PR, you will need to make sure that the pull request passes
all CI tests. You can sometimes request initial feedback if there are open
questions that will impact how you update the tests. But in general,
maintainers will wait for your PR to pass tests before reviewing your work.

If your PR was not ready for review when you first posted it (e.g., because it
was failing tests, or you weren't done working through the self-review
checklist), notify maintainers when you'd like them to take a look by posting a
clear comment on the main GitHub thread for your PR with details on any changes
from the original version; this is very helpful for any maintainers who already
read the draft PR.

## Draft pull requests

If it helps your workflow, you can submit your pull request marked as
a [draft][github-help-draft-pr] while you're still working on it. When ready for
review:

1. Make sure your PR is no longer marked as a [draft][github-help-draft-pr], and
   doesn't have "WIP" in the title.

1. Post a quick "Ready for review!" comment on the main GitHub thread for your
   PR.

[github-help-draft-pr]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests#draft-pull-requests

## Demonstrating visual changes

- For [screenshots or screencasts][screenshots-gifs] of changes,
  putting them in details/summary tags reduces visual clutter
  and scroll length of pull request comments. This is especially
  useful when you have several screenshots and/or screencasts to
  include in your comment as you can put each image, or group of
  images, in separate details/summary tags.

  ```
  <details>
  <summary>Descriptive summary of image</summary>

  ![uploaded-image](uploaded-file-information)
  </details>
  ```

- Screenshots are much easier to review than screencast videos.
  Wherever possible, use still screenshots instead of videos.
  Use a video only when necessary to demonstrate an interaction,
  and include screenshots too for any aspects of your changes
  which can be seen on a still screenshot.

  Keep any videos as short as possible, so that the reviewer can
  quickly get to the relevant part.

  In screencast videos, make sure a person watching your video
  can see where on the screen you're touching or clicking.
  Use the "show touches" or "include the mouse pointer" feature
  of your screen-recording software.

- For before and after images or videos of changes, using GithHub's table
  syntax renders them side-by-side for quick and clear comparison.
  While this works well for narrow or small images, it can be hard to
  see details in large, full screen images and videos in this format.

  Note that you can put the table syntax inside the details/summary
  tags described above as well.

  ```
  ### Descriptive header for images:
  | Before | After |
  | --- | --- |
  | ![image-before](uploaded-file-information) | ![image-after](uploaded-file-information)
  ```

- If you've updated existing documentation in your pull request,
  include a link to the current documentation above the screenshot
  of the updates. That way a reviewer can quickly access the current
  documentation while reviewing your changes.

  ```
  [Current documentation](link-to-current-documentation-page)
  ![image-after](uploaded-file-information)
  ```

- For updates or changes to CSS class rules, it's a good practice
  to include the results of a [git-grep][git-grep] search for
  the class name(s) to confirm that you've tested all the impacted
  areas of the UI and/or documentation.

  ```console
  $ git grep '.example-class-name' web/templates/ templates/
  templates/corporate/...
  templates/zerver/...
  web/templates/...
  ```

[github-syntax]: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
[git-grep]: https://git-scm.com/docs/git-grep
[screenshots-gifs]: ../tutorials/screenshot-and-gif-software.md
[zulip-dev-community]: https://chat.zulip.org
[link-to-message]: https://zulip.com/help/link-to-a-message-or-conversation#get-a-link-to-a-specific-message
[dev-community-linkifiers]: https://zulip.com/development-community/#linking-to-github-issues-and-pull-requests
```

--------------------------------------------------------------------------------

---[FILE: suggesting-features.md]---
Location: zulip-main/docs/contributing/suggesting-features.md

```text
# Suggesting features and improvements

If you have ideas for how to make Zulip better, we'd love to hear from you! Many
improvements start with a user's suggestion. The best way to suggest a feature
or an improvement is by starting a conversation in the [Zulip development
community](https://zulip.com/development-community/). It's a great way to engage
interactively with members of the community, and explore how best to improve
Zulip for you and other users.

Usually, if the discussion leads to a concrete proposal, Zulip's product team
will follow up by filing a GitHub issue to track the idea. Many conversations do
not immediately lead to a GitHub issue, and that's OK! Sometimes the time is not
right to pin down a plan, or more ideas need to come in before a great proposal
emerges. Regardless of whether a discussion results in immediate action, we
appreciate the time everyone takes to make suggestions and brainstorm ideas.

## What to include in your proposal

- Describe your idea. It's absolutely fine to bring up a problem without
  suggesting a concrete solution.
- Provide context on how the change you are proposing would help you or your
  organization. It is often helpful to describe how you are using Zulip (e.g.,
  "I work at a small startup", or "I'm teaching a class"). This lets us combine
  our Zulip expertise with your requirements to come up with a great design for
  a feature.
- If you are aware of a related issue in GitHub or a prior conversation in the
  development community, please include a link.

## Starting a conversation about a suggested feature or improvement

Steps and best practices for starting a conversation:

1. [**Join** the Zulip development
   community](https://zulip.com/development-community/) if you don't already
   have an account.
2. Pick an **appropriate channel** to discuss your idea:
   - [#feedback](https://chat.zulip.org/#narrow/channel/137-feedback) for suggestions for
     the Zulip web app or server. Use this channel if you aren't sure which channel is
     most appropriate.
   - [#mobile](https://chat.zulip.org/#narrow/channel/48-mobile) for suggestions
     for the mobile apps.
   - [#desktop](https://chat.zulip.org/#narrow/channel/16-desktop) for suggestions
     that are specific to the Zulip desktop app.
   - [#zulip-terminal](https://chat.zulip.org/#narrow/channel/206-zulip-terminal)
     for suggestions for the terminal app.
   - [#production
     help](https://chat.zulip.org/#narrow/channel/31-production-help) for suggestions
     related to self-hosting Zulip.
3. **[Start a new topic](https://zulip.com/help/introduction-to-topics#how-to-start-a-new-topic)**
   for discussing your suggestions, using a brief summary of your idea as the
   name of the topic.

If you aren't sure where to post or how to name your topic, don't worry!
Moderators can always rename the topic, or move the thread to another channel.

Members of the development community will jump in to discuss your idea. You can
help by participating in the discussion, including replying to any follow-up
questions, and helping develop the proposal. The discussion may conclude with an
issue being filed in GitHub to track the plan that was developed.

## Filing a GitHub issue

Filing a GitHub issue can be effective when you have a very specific proposal
for a feature or improvement. Steps and best practices for filing an issue:

1. File the issue in the **appropriate [Zulip
   repository](https://github.com/zulip)**. The most commonly used repositories
   are:
   - [zulip/zulip](https://github.com/zulip/zulip/issues) for suggestions for the
     Zulip web app or server. A good default if you aren't sure which repository
     to use.
   - [zulip/zulip-flutter](https://github.com/zulip/zulip-flutter/issues) for
     suggestions for the mobile apps.
   - [zulip/zulip-desktop](https://github.com/zulip/zulip-desktop/issues) for
     suggestions that are specific to the Zulip desktop app.
   - [zulip/zulip-terminal](https://github.com/zulip/zulip-terminal/issues) for
     suggestions for the terminal app.
2. Do a **quick search** of the repository to see if there is already a similar
   request. If there is, add a comment explaining why you would also appreciate
   the proposed change, and make any additional suggestions you might have. Do
   not file a new issue.
3. If you are aware of a related discussion in the Zulip development community,
   please **cross-link** between the issue and the discussion thread. [Link to a
   specific
   message](https://zulip.com/help/link-to-a-message-or-conversation#get-a-link-to-a-specific-message)
   in the discussion thread, as message links will still work even if the topic is
   renamed or resolved.

## Evaluation and onboarding feedback

If you have been involved in the decision to use (or not use!) Zulip, or are
currently considering it, we'd love to hear about it. You can contact us
publicly in the [#feedback](https://chat.zulip.org/#narrow/channel/137-feedback)
channel in the [Zulip development
community](https://zulip.com/development-community/), or privately at
[feedback@zulip.com](mailto:feedback@zulip.com).

Here are some questions we're especially interested in:

- **Who you are**: Tell us a bit about your organization. What does it do? How many
  people are involved?
- **Evaluation**: What is the process by which your organization chose or will
  choose a team chat product?
- **Pros and cons**: What are the pros and cons of Zulip for your organization,
  and the pros and cons of other products you are evaluating?
- **Features**: What are the features that are most important for your
  organization? In the best-case scenario, what would your chat solution do
  for you?
- **Onboarding**: If you remember, what were your impressions during your first
  few minutes of using Zulip? What did you notice, and how did you feel? Was
  there anything that stood out to you as confusing, or unexpected, or great?
```

--------------------------------------------------------------------------------

---[FILE: zulipbot-usage.md]---
Location: zulip-main/docs/contributing/zulipbot-usage.md

```text
# Using zulipbot

Zulip uses [@zulipbot](https://github.com/zulipbot), a GitHub workflow bot
deployed on all Zulip repositories, to handle issues and pull requests in our
repositories in order to create a better workflow for Zulip contributors.

Its purpose is to work around various limitations in GitHub's
permissions and notifications systems to make it possible to have a
much more democratic workflow for our contributors. It allows anyone
to self-assign or label an issue, not just the core contributors
trusted with full write access to the repository (which is the only
model GitHub supports).

## Usage

- **Claim an issue** — Comment `@zulipbot claim` on the issue you want
  to claim; **@zulipbot** will assign you to the issue and label the issue as
  **in progress**.

  - If you're a new contributor, **@zulipbot** will give you read-only
    collaborator access to the repository and leave a welcome message on the
    issue you claimed.

  - You can also claim an issue that you've opened by including
    `@zulipbot claim` in the body of your issue.

  - If you accidentally claim an issue you didn't want to claim, comment
    `@zulipbot abandon` to abandon an issue.

- **Label your issues** — Add appropriate labels to issues that you opened by
  including `@zulipbot add` in an issue comment or the body of your issue
  followed by the desired labels enclosed within double quotes (`""`).

  - For example, to add the **bug** and **help wanted** labels to your
    issue, comment or include `@zulipbot add "bug" "help wanted"` in the
    issue body.

  - You'll receive an error message if you try to add any labels to your issue
    that don't exist in your repository.

  - If you accidentally added the wrong labels, you can remove them by commenting
    `@zulipbot remove` followed by the desired labels enclosed with double quotes
    (`""`).

- **Find unclaimed issues** — Use the [GitHub search
  feature](https://help.github.com/en/articles/using-search-to-filter-issues-and-pull-requests)
  to find unclaimed issues by adding one of the following filters to your search:

  - `-label: "in progress"` (excludes issues labeled with the **in progress** label)

  - `no:assignee` (shows issues without assignees)

  Issues labeled with the **in progress** label and/or assigned to other users have
  already been claimed.

- **Collaborate in area label teams** — Receive notifications on
  issues and pull requests within your fields of expertise on the
  [Zulip server repository](https://github.com/zulip/zulip) by joining
  the Zulip server
  [area label teams](https://github.com/orgs/zulip/teams?utf8=✓&query=Server)
  (Note: this link only works for members of the Zulip organization;
  we'll happily add you if you're interested). These teams correspond
  to the repository's
  [area labels](https://github.com/zulip/zulip/labels), although some
  teams are associated with multiple labels; for example, the **area:
  message-editing** and **area: message view** labels are both related
  to the
  [Server message view](https://github.com/orgs/zulip/teams/server-message-view)
  team. Feel free to join as many area label teams as you'd like!

  After your request to join an area label team is approved, you'll receive
  notifications for any issues labeled with the team's corresponding area
  label as well as any pull requests that reference issues labeled with your
  team's area label.

- **Track inactive claimed issues** — If a claimed issue has not been updated
  for a week, **@zulipbot** will post a comment on the inactive issue to ask the
  assignee(s) if they are still working on the issue.

  If you see this comment on an issue you claimed, you should post a comment
  on the issue to notify **@zulipbot** that you're still working on it.

  If **@zulipbot** does not receive a response from the assignee within 3 days
  of an inactive issue prompt, **@zulipbot** will automatically remove the
  issue's current assignee(s) and the "in progress" label to allow others to
  work on an inactive issue.

### Contributing

If you wish to help develop and contribute to **@zulipbot**, check out the
[zulip/zulipbot](https://github.com/zulip/zulipbot) repository on GitHub and read
the project's [contributing
guidelines](https://github.com/zulip/zulipbot/blob/main/.github/CONTRIBUTING.md#contributing) for
more information.
```

--------------------------------------------------------------------------------

---[FILE: authentication.md]---
Location: zulip-main/docs/development/authentication.md

```text
# Authentication in the development environment

This page documents special notes that are useful for configuring
Zulip's various [authentication
methods](../production/authentication-methods.md) for testing in a
development environment.

Many of these authentication methods involve a complex interaction
between Zulip, an external service, and the user's browser. Because
browsers can (rightly!) be picky about the identity of sites you
interact with, the preferred way to set up authentication methods in a
development environment is provide secret keys so that you can go
through the real flow.

The steps to do this are a variation of the steps discussed in the
production documentation, including the comments in
`zproject/prod_settings_template.py`. The differences here are driven
by the fact that `dev_settings.py` is in Git, so it is inconvenient
for local [settings configuration](../subsystems/settings.md). As a
result, in the development environment, we allow setting certain
settings in the untracked file `zproject/dev-secrets.conf` (which is
also serves as `/etc/zulip/zulip-secrets.conf`).

Below, we document the procedure for each of the major authentication
methods supported by Zulip.

### Email and password

Zulip's default EmailAuthBackend authenticates users by verifying
control over their email address, and then allowing them to set a
password for their account. There are two development environment
details worth understanding:

- All of our authentication flows in the development environment have
  special links to the `/emails` page (advertised in `/devtools`),
  which shows all emails that the Zulip server has "sent" (emails are
  not actually sent by the development environment), to make it
  convenient to click through the UI of signup, password reset, etc.
- There's a management command,
  `manage.py print_initial_password username@example.com`, that prints
  out **default** passwords for the development environment users.
  Note that if you change a user's password in the development
  environment, those passwords will no longer work. It also prints
  out the user's **current** API key.

### Google

- Visit [the Google developer
  console](https://console.developers.google.com) and navigate to "APIs
  & services" > "Credentials". Create a "Project", which will correspond
  to your dev environment.

- Navigate to "APIs & services" > "Library", and find the "Identity
  Toolkit API". Choose "Enable".

- Return to "Credentials", and select "Create credentials". Choose
  "OAuth client ID", and follow prompts to create a consent screen, etc.
  For "Authorized redirect URIs", fill in
  `http://auth.zulipdev.com:9991/complete/google/` .

- You should get a client ID and a client secret. Copy them. In
  `dev-secrets.conf`, set `social_auth_google_key` to the client ID
  and `social_auth_google_secret` to the client secret.

### GitHub

- Register an OAuth2 application with GitHub at one of
  <https://github.com/settings/developers> or
  `https://github.com/organizations/<your-org>/settings/applications`.
  Specify `http://auth.zulipdev.com:9991/complete/github/` as the callback URL.

- You should get a page with settings for your new application,
  showing a client ID and a client secret. In `dev-secrets.conf`, set
  `social_auth_github_key` to the client ID and `social_auth_github_secret`
  to the client secret.

### GitLab

- Register an OAuth application with GitLab at
  <https://gitlab.com/oauth/applications>.
  Specify `http://auth.zulipdev.com:9991/complete/gitlab/` as the callback URL.

- You should get a page containing the Application ID and Secret for
  your new application. In `dev-secrets.conf`, enter the Application
  ID as `social_auth_gitlab_key` and the Secret as
  `social_auth_gitlab_secret`.

### Apple

- Visit <https://developer.apple.com/account/resources/>,
  Enable App ID and Create a Services ID with the instructions in
  <https://help.apple.com/developer-account/?lang=en#/dev1c0e25352> .
  When prompted for a "Return URL", enter
  `http://auth.zulipdev.com:9991/complete/apple/` .

- [Create a Sign in with Apple private key](https://help.apple.com/developer-account/?lang=en#/dev77c875b7e)

- In `dev-secrets.conf`, set
  - `social_auth_apple_services_id` to your
    "Services ID" (eg. com.application.your).
  - `social_auth_apple_app_id` to "App ID" or "Bundle ID".
    This is only required if you are testing Apple auth on iOS.
  - `social_auth_apple_key` to your "Key ID".
  - `social_auth_apple_team` to your "Team ID".
- Put the private key file you got from apple at the path
  `zproject/dev_apple.key`.

### SAML

- Sign up for a [developer Okta account](https://developer.okta.com/).
- Set up SAML authentication by following
  [Okta's documentation](https://developer.okta.com/docs/guides/saml-application-setup/overview/).
  Specify:
  - `http://localhost:9991/complete/saml/` for the "Single sign on URL"`.
  - `http://localhost:9991` for the "Audience URI (SP Entity ID)".
  - Skip "Default RelayState".
  - Skip "Name ID format".
  - Set 'Email` for "Application username format".
  - Provide "Attribute statements" of `email` to `user.email`,
    `first_name` to `user.firstName`, and `last_name` to `user.lastName`.
- Assign at least one account in the "Assignments" tab. You'll use it for
  signing up / logging in to Zulip.
- Visit the big "Setup instructions" button on the "Sign on" tab.
- Edit `zproject/dev-secrets.conf` to add the two values provided:
  - Set `saml_url = http...` from "Identity Provider Single Sign-On
    URL".
  - Set `saml_entity_id = http://...` from "Identity Provider Issuer".
  - Download the certificate and put it at the path `zproject/dev_saml.cert`.
- Now you should have working SAML authentication!
- You can sign up to the target realm with the account that you've "assigned"
  in the previous steps (if the account's email address is allowed in the realm,
  so you may have to change the realm settings to allow the appropriate email domain)
  and then you'll be able to log in freely. Alternatively, you can create an account
  with the email in any other way, and then just use SAML to log in.

### When SSL is required

Some OAuth providers (such as Facebook) require HTTPS on the callback
URL they post back to, which isn't supported directly by the Zulip
development environment. If you run a
[remote Zulip development server](remote.md), we have
instructions for
[an nginx reverse proxy with SSL](remote.md#using-an-nginx-reverse-proxy)
that you can use for your development efforts.

## Testing LDAP in development

Before Zulip 2.0, one of the more common classes of bug reports with
Zulip's authentication was users having trouble getting [LDAP
authentication](../production/authentication-methods.md#ldap-including-active-directory)
working. The root cause was because setting up a local LDAP server
for development was difficult, which meant most developers were unable
to work on fixing even simple issues with it.

We solved this problem for our unit tests long ago by using the
popular [fakeldap](https://github.com/zulip/fakeldap) library. And in
2018, we added convenient support for using fakeldap in the Zulip
development environment as well, so that you can go through all the
actual flows for LDAP configuration.

- To enable fakeldap, set `FAKE_LDAP_MODE` in
  `zproject/dev_settings.py` to one of the following options. For more
  information on these modes, refer to
  [our production docs](../production/authentication-methods.md#ldap-including-active-directory):

  - `a`: If users' email addresses are in LDAP and used as username.
  - `b`: If LDAP only has usernames but email addresses are of the form
    username@example.com
  - `c`: If LDAP usernames are completely unrelated to email addresses.

- To disable fakeldap, set `FAKE_LDAP_MODE` back to `None`.

- In all fakeldap configurations, users' fake LDAP passwords are equal
  to their usernames (e.g., for `ldapuser1@zulip.com`, the password is
  `ldapuser1`).

- `FAKE_LDAP_NUM_USERS` in `zproject/dev_settings.py` can be used to
  specify the number of LDAP users to be added. The default value for
  the number of LDAP users is 8.

### Testing avatar and custom profile field synchronization

The fakeldap LDAP directories we use in the development environment
are generated by the code in `zerver/lib/dev_ldap_directory.py`, and
contain data one might want to sync, including avatars and custom
profile fields.

We also have configured `AUTH_LDAP_USER_ATTR_MAP` in
`zproject/dev_settings.py` to sync several of those fields. For
example:

- Modes `a` and `b` will set the user's avatar on account creation and
  update it when `manage.py sync_ldap_user_data` is run.
- Mode `b` is configured to automatically have the `birthday` and
  `Phone number` custom profile fields populated/synced.
- Mode `a` is configured to deactivate/reactivate users whose accounts
  are disabled in LDAP when `manage.py sync_ldap_user_data` is run.
  (Note that you'll likely need to edit
  `zerver/lib/dev_ldap_directory.py` to ensure there are some accounts
  configured to be disabled).

### Automated testing

For our automated tests, we generally configure custom LDAP data for
each individual test, because that generally means one can understand
exactly what data is being used in the test without looking at other
resources. It also gives us more freedom to edit the development
environment directory without worrying about tests.

## Two factor authentication

Zulip uses [django-two-factor-auth][0] as a beta 2FA integration.

To enable 2FA, set `TWO_FACTOR_AUTHENTICATION_ENABLED` in settings to
`True`, then log in to Zulip and add an OTP device from the settings
page. Once the device is added, password based authentication will ask
for a one-time-password. In the development environment, this
one-time-password will be printed to the console when you try to
log in. Just copy-paste it into the form field to continue.

Direct development logins don't prompt for 2FA one-time-passwords, so
to test 2FA in development, make sure that you log in using a
password. You can get the passwords for the default test users using
`./manage.py print_initial_password`.

## Password form implementation

By default, Zulip uses `autocomplete=off` for password fields where we
enter the current password, and `autocomplete="new-password"` for
password fields where we create a new account or change the existing
password. This prevents the browser from auto-filling the existing
password.

Visit <https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete> for more details.

[0]: https://github.com/Bouke/django-two-factor-auth
```

--------------------------------------------------------------------------------

---[FILE: index.md]---
Location: zulip-main/docs/development/index.md

```text
# Development environment

```{toctree}
---
maxdepth: 3
---

Development environment installation <overview>
Recommended setup <setup-recommended>
Advanced setup <setup-advanced>
Using the development environment <using>
Developing remotely <remote>
Authentication in the development environment <authentication>
Testing the installer <test-install>
```
```

--------------------------------------------------------------------------------

---[FILE: overview.md]---
Location: zulip-main/docs/development/overview.md

```text
# Development environment installation

## Requirements

The Zulip development environment can be installed on **macOS,
Windows, and Linux** (Debian or Ubuntu recommended). You'll need at least **2GB
of available RAM**.

Installing the Zulip development environment requires downloading several hundred
megabytes of dependencies, so you will need an **active, reasonably fast,
internet connection throughout the entire installation processes.** You can
[configure a proxy][configure-proxy] if you need one.

## Recommended setup

**For first-time contributors, we recommend using the
[Vagrant development environment][install-vagrant]** on
macOS and Linux based OS and [WSL 2 setup][install-via-wsl] on Windows.

## Vagrant setup

[Vagrant setup][install-vagrant] creates a virtual machine (for Windows and macOS) or a
Linux container (otherwise) inside which the Zulip server and all
related services will run. Vagrant adds a bit of overhead to using the
Zulip development server, but provides an isolated environment that is
easy to install, update, and uninstall. It has been well-tested and
performs well.

## Advanced setup

Zulip also supports a wide range of ways to install the Zulip
development environment:

- On Linux platforms, you can **[install directly][install-direct]**.
- On Windows, you can **[install directly][install-via-wsl]** via WSL 2.

## Slow internet connections

If you have a very slow network connection, however, you may want to
avoid using Vagrant (which involves downloading an Ubuntu virtual
machine or Linux container) and [install directly][install-direct] on
a Linux system.

An alternative option if you have poor network connectivity is to rent
a cloud server and install the Zulip development environment for
remote use. See the [next section][self-install-remote] for details.

## Installing remotely

The Zulip development environment works well on remote virtual
machines. This can be a good alternative for those with poor network
connectivity or who have limited storage/memory on their local
machines.

We recommend giving the Zulip development environment its **own
virtual machine**, running one of
[the supported platforms for direct installation][install-direct],
with at least **2GB of memory**.

If the Zulip development environment will be the only thing running on
the remote virtual machine, we recommend installing
[directly][install-direct]. Otherwise, we recommend the
[Vagrant][install-vagrant] method so you can easily uninstall if you
need to.

## Next steps

Once you've installed the Zulip development environment, you'll want
to read these documents to learn how to use it:

- [Using the development environment][using-dev-env]
- [Testing][testing] (and [Configuring CI][ci])

And if you've set up the Zulip development environment on a remote
machine, take a look at our tips for
[developing remotely][dev-remote].

[dev-remote]: remote.md
[install-direct]: setup-advanced.md#installing-directly-on-ubuntu-debian-centos-or-fedora
[install-vagrant]: setup-recommended.md
[self-install-remote]: #installing-remotely
[self-slow-internet]: #slow-internet-connections
[configure-proxy]: setup-recommended.md#specifying-a-proxy
[using-dev-env]: using.md
[testing]: ../testing/testing.md
[ci]: ../git/cloning.md#step-3-configure-continuous-integration-for-your-fork
[install-via-wsl]: setup-recommended.md
```

--------------------------------------------------------------------------------

````
