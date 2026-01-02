---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 10
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 10 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: README.md]---
Location: payload-main/.github/actions/release-commenter/README.md

```text
# Release Commenter

This GitHub Action automatically comments on and/or labels Issues and PRs when a fix is released for them.

> [!IMPORTANT]
> 🔧 Heavily modified version of https://github.com/apexskier/github-release-commenter

## Fork Modifications

- Filters to closed PRs only
- Adds tag filter to support non-linear releases
- Better logging
- Moved to pnpm
- Uses @vercel/ncc for packaging
- Comments on locked issues by unlocking then re-locking

## How it works

Use this action in a workflow [triggered by a release](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#release). It will scan commits between that and the prior release, find associated Issues and PRs, and comment on them to let people know a release has been made. Associated Issues and PRs can be directly [linked](https://docs.github.com/en/free-pro-team@latest/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue) to the commit or manually linked from a PR associated with the commit.

## Inputs

**GITHUB_TOKEN**

A GitHub personal access token with repo scope, such as [`secrets.GITHUB_TOKEN`](https://docs.github.com/en/free-pro-team@latest/actions/reference/authentication-in-a-workflow#about-the-github_token-secret).

**comment-template** (optional)

Override the comment posted on Issues and PRs. Set to the empty string to disable commenting. Several variables strings will be automatically replaced:

- `{release_link}` - a markdown link to the release
- `{release_name}` - the release's name
- `{release_tag}` - the release's tag

**label-template** (optional)

Add the given label. Multiple labels can be separated by commas. Several variable strings will be automatically replaced:

- `{release_name}` - the release's name
- `{release_tag}` - the release's tag

**skip-label** (optional)

Skip processing if any of the given labels are present. Same processing rules as **label-template**. Default is "dependencies".

## Example

```yml
on:
  release:
    types: [published]

jobs:
  release:
    steps:
      - uses: apexskier/github-release-commenter@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          comment-template: |
            Release {release_link} addresses this.
```

## Known limitations

These are some known limitations of this action. I'd like to try to address them in the future.

- Non-linear releases aren't supported. For example, releasing a patch to a prior major release after a new major release has been bumped.
- Non-sequential releases aren't supported. For example, if you release multiple prereleases between two official releases, this will only create a comment for the first prerelease in which a fix is released, not the final release.
- The first release for a project will be ignored. This is intentional, as the use case is unlikely. Most projects will either have several alphas that don't need release comments, or won't use issues/PRs for the first commit.
- If a large number of things are commented on, you may see the error `Error: You have triggered an abuse detection mechanism. Please wait a few minutes before you try again.`. Consider using the `skip-label` input to reduce your load on the GitHub API.

## Versions

Workflows will automatically update the tags `v1` and `latest`, allowing you to reference one of those instead of locking to a specific release.
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/.github/actions/release-commenter/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es2020.string"],
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "downlevelIteration": true,
    "skipLibCheck": true,
  },
  "exclude": ["src/**/*.test.ts"]
}
```

--------------------------------------------------------------------------------

---[FILE: index.test.ts]---
Location: payload-main/.github/actions/release-commenter/src/index.test.ts

```typescript
import type * as githubModule from '@actions/github'
import type * as coreModule from '@actions/core'
import { mock } from 'node:test'

jest.mock('@actions/core')
jest.mock('@actions/github')

type Mocked<T> = {
  -readonly [P in keyof T]: T[P] extends Function ? jest.Mock<T[P]> : jest.Mocked<Partial<T[P]>>
}

const github = require('@actions/github') as jest.Mocked<Mocked<typeof githubModule>>
const core = require('@actions/core') as jest.Mocked<Mocked<typeof coreModule>>

describe('tests', () => {
  let mockOctokit: any = {}
  let currentTag: string = 'current_tag_name'

  ;(core.warning as any) = jest.fn(console.warn.bind(console))
  ;(core.error as any) = jest.fn(console.error.bind(console))

  let commentTempate: string = ''
  let labelTemplate: string | null = null
  const skipLabelTemplate: string | null = 'skip,test'
  let tagFilter: string | RegExp | null = null

  let simpleMockOctokit: any = {}

  beforeEach(() => {
    tagFilter = null
    currentTag = 'current_tag_name'
    ;(github.context as any) = {
      payload: {
        repo: {
          owner: 'owner',
          repo: 'repo',
        },
        release: {
          tag_name: currentTag,
        },
        repository: { html_url: 'http://repository' },
      },
    }

    github.getOctokit.mockReset().mockImplementationOnce(((token: string) => {
      expect(token).toBe('GITHUB_TOKEN_VALUE')
      return mockOctokit
    }) as any)
    ;(core.getInput as any).mockImplementation((key: string) => {
      if (key == 'GITHUB_TOKEN') {
        return 'GITHUB_TOKEN_VALUE'
      }
      if (key == 'comment-template') {
        return commentTempate
      }
      if (key == 'label-template') {
        return labelTemplate
      }
      if (key == 'skip-label') {
        return skipLabelTemplate
      }
      if (key == 'tag-filter') {
        return tagFilter
      }
      fail(`Unexpected input key ${key}`)
    })

    commentTempate =
      'Included in release {release_link}. Replacements: {release_name}, {release_tag}.'
    labelTemplate = null
    simpleMockOctokit = {
      rest: {
        issues: {
          get: jest.fn(() => Promise.resolve({ data: { locked: false } })),
          createComment: jest.fn(() => Promise.resolve()),
          addLabels: jest.fn(() => Promise.resolve()),
        },
        repos: {
          listReleases: jest.fn(() =>
            Promise.resolve({
              data: [
                {
                  name: 'Release Name',
                  tag_name: 'current_tag_name',
                  html_url: 'http://current_release',
                },
                {
                  tag_name: 'prior_tag_name',
                  html_url: 'http://prior_release',
                },
              ],
            }),
          ),
          compareCommits: jest.fn(() =>
            Promise.resolve({
              data: { commits: [{ sha: 'SHA1' }] },
            }),
          ),
        },
      },
      graphql: jest.fn(() =>
        Promise.resolve({
          resource: {
            messageHeadlineHTML: '',
            messageBodyHTML:
              '<span class="issue-keyword tooltipped tooltipped-se" aria-label="This commit closes issue #123.">Closes</span> <p><span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes issue #7.">Closes</span>',
            associatedPullRequests: {
              pageInfo: { hasNextPage: false },
              edges: [],
            },
          },
        }),
      ),
    }
  })

  afterEach(() => {
    expect(core.error).not.toHaveBeenCalled()
    expect(core.warning).not.toHaveBeenCalled()
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  test('main test', async () => {
    mockOctokit = {
      ...simpleMockOctokit,
      rest: {
        issues: {
          get: jest.fn(() => Promise.resolve({ data: { locked: false } })),
          createComment: jest.fn(() => Promise.resolve()),
          addLabels: jest.fn(() => Promise.resolve()),
        },
        repos: {
          listReleases: jest.fn(() =>
            Promise.resolve({
              data: [
                {
                  tag_name: 'current_tag_name',
                  html_url: 'http://current_release',
                },
                {
                  tag_name: 'prior_tag_name',
                  html_url: 'http://prior_release',
                },
              ],
            }),
          ),
          compareCommits: jest.fn(() =>
            Promise.resolve({
              data: { commits: [{ sha: 'SHA1' }, { sha: 'SHA2' }] },
            }),
          ),
        },
      },
      graphql: jest.fn(() =>
        Promise.resolve({
          resource: {
            messageHeadlineHTML:
              '<span class="issue-keyword tooltipped tooltipped-se" aria-label="This commit closes issue #3.">Closes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="718013420" data-permission-text="Title is private" data-url="https://github.com/apexskier/github-release-commenter/issues/1" data-hovercard-type="issue" data-hovercard-url="/apexskier/github-release-commenter/issues/1/hovercard" href="https://github.com/apexskier/github-release-commenter/issues/1">#1</a>',
            messageBodyHTML:
              '<span class="issue-keyword tooltipped tooltipped-se" aria-label="This commit closes issue #123.">Closes</span> <p><span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes issue #7.">Closes</span>',
            associatedPullRequests: {
              pageInfo: { hasNextPage: false },
              edges: [
                {
                  node: {
                    bodyHTML:
                      '<span class="issue-keyword tooltipped tooltipped-se" aria-label="This commit closes issue #4.">Closes</span> <span class="issue-keyword tooltipped tooltipped-se" aria-label="This commit closes issue #5.">Closes</span>',
                    number: 9,
                    labels: {
                      pageInfo: { hasNextPage: false },
                      nodes: [{ name: 'label1' }, { name: 'label2' }],
                    },
                    timelineItems: {
                      pageInfo: { hasNextPage: false },
                      nodes: [
                        {
                          isCrossRepository: true,
                          __typename: 'ConnectedEvent',
                          subject: { number: 1 },
                        },
                        {
                          isCrossRepository: false,
                          __typename: 'ConnectedEvent',
                          subject: { number: 2 },
                        },
                        {
                          isCrossRepository: false,
                          __typename: 'DisconnectedEvent',
                          subject: { number: 2 },
                        },
                        {
                          isCrossRepository: false,
                          __typename: 'ConnectedEvent',
                          subject: { number: 2 },
                        },
                      ],
                    },
                  },
                },
                {
                  node: {
                    bodyHTML: '',
                    number: 42,
                    labels: {
                      pageInfo: { hasNextPage: false },
                      nodes: [{ name: 'label1' }, { name: 'skip' }],
                    },
                    timelineItems: {
                      pageInfo: { hasNextPage: false },
                      nodes: [
                        {
                          isCrossRepository: true,
                          __typename: 'ConnectedEvent',
                          subject: { number: 82 },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        }),
      ),
    }

    jest.isolateModules(() => {
      require('./index')
    })

    await new Promise<void>(setImmediate)

    expect(mockOctokit).toMatchSnapshot()
    expect(mockOctokit.rest.issues.createComment).toHaveBeenCalledTimes(3)
  })

  describe('can filter tags', () => {
    const v3prev = 'v3.0.1'
    const v3current = 'v3.0.2'
    const v2prev = 'v2.0.1'
    const v2current = 'v2.0.2'

    const listReleasesData = [
      {
        name: 'Current Release Name',
        tag_name: v3current,
        html_url: 'http://v3.0.2',
      },
      {
        name: 'Prev Release Name',
        tag_name: v3prev,
        html_url: 'http://v3.0.1',
      },
      {
        name: 'v2 Current Release Name',
        tag_name: v2current,
        html_url: 'http://v2.0.2',
      },
      {
        name: 'v2 Prev Release Name',
        tag_name: v2prev,
        html_url: 'http://v2.0.1',
      },
    ]

    it.each`
      description    | prevTag   | currentTag   | filter
      ${'no filter'} | ${v3prev} | ${v3current} | ${null}
      ${'v3'}        | ${v3prev} | ${v3current} | ${'v\\d'}
      ${'v2'}        | ${v2prev} | ${v2current} | ${'v\\d'}
    `('should filter tags with $description', async ({ prevTag, currentTag, filter }) => {
      // @ts-ignore
      github.context.payload.release.tag_name = currentTag

      tagFilter = filter

      mockOctokit = {
        ...simpleMockOctokit,
        rest: {
          issues: {
            get: jest.fn(() => Promise.resolve({ data: { locked: false } })),
            createComment: jest.fn(() => Promise.resolve()),
            addLabels: jest.fn(() => Promise.resolve()),
          },
          repos: {
            listReleases: jest.fn(() =>
              Promise.resolve({
                data: listReleasesData,
              }),
            ),
            compareCommits: jest.fn(() =>
              Promise.resolve({
                data: { commits: [{ sha: 'SHA1' }] },
              }),
            ),
          },
        },
        graphql: jest.fn(() =>
          Promise.resolve({
            resource: {
              messageHeadlineHTML: '',
              messageBodyHTML:
                '<span class="issue-keyword tooltipped tooltipped-se" aria-label="This commit closes issue #123.">Closes</span> <p><span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes issue #7.">Closes</span>',
              associatedPullRequests: {
                pageInfo: { hasNextPage: false },
                edges: [],
              },
            },
          }),
        ),
      }

      jest.isolateModules(() => {
        require('./index')
      })

      await new Promise<void>((resolve) => setImmediate(() => resolve()))

      expect(github.getOctokit).toHaveBeenCalled()
      expect(mockOctokit.rest.repos.compareCommits.mock.calls).toEqual([
        [{ base: prevTag, head: currentTag }],
      ])
    })
  })

  describe('feature tests', () => {
    beforeEach(() => {
      mockOctokit = simpleMockOctokit
    })

    it('can disable comments', async () => {
      commentTempate = ''

      jest.isolateModules(() => {
        require('./index')
      })

      await new Promise<void>((resolve) => setImmediate(() => resolve()))

      expect(github.getOctokit).toHaveBeenCalled()
      expect(mockOctokit.rest.issues.createComment).not.toHaveBeenCalled()
    })

    it('should unlock and comment', async () => {
      mockOctokit = {
        ...simpleMockOctokit,
        rest: {
          ...simpleMockOctokit.rest,
          issues: {
            // Return locked for both issues to be commented on
            get: jest.fn(() => Promise.resolve({ data: { locked: true } })),
            lock: jest.fn(() => Promise.resolve()),
            unlock: jest.fn(() => Promise.resolve()),
            createComment: jest.fn(() => Promise.resolve()),
          },
        },
        graphql: jest.fn(() =>
          Promise.resolve({
            resource: {
              messageHeadlineHTML: '',
              messageBodyHTML:
                '<span class="issue-keyword tooltipped tooltipped-se" aria-label="This commit closes issue #123.">Closes</span> <p><span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes issue #7.">Closes</span>',
              associatedPullRequests: {
                pageInfo: { hasNextPage: false },
                edges: [],
              },
            },
          }),
        ),
      }

      jest.isolateModules(() => {
        require('./index')
      })

      await new Promise<void>((resolve) => setImmediate(() => resolve()))

      expect(github.getOctokit).toHaveBeenCalled()

      // Should call once for both linked issues
      expect(mockOctokit.rest.issues.unlock).toHaveBeenCalledTimes(2)
      expect(mockOctokit.rest.issues.createComment).toHaveBeenCalledTimes(2)
      expect(mockOctokit.rest.issues.lock).toHaveBeenCalledTimes(2)
    })

    it.skip('can apply labels', async () => {
      labelTemplate = ':dart: landed,release-{release_tag},{release_name}'

      jest.isolateModules(() => {
        require('./index')
      })

      await new Promise<void>((resolve) => setImmediate(() => resolve()))

      expect(github.getOctokit).toHaveBeenCalled()
      expect(mockOctokit.rest.issues.addLabels.mock.calls).toMatchSnapshot()
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/.github/actions/release-commenter/src/index.ts

```typescript
import * as core from '@actions/core'
import * as github from '@actions/github'
import type * as Webhooks from '@octokit/webhooks-types'

const closesMatcher = /aria-label="This (?:commit|pull request) closes issue #(\d+)\."/g

const releaseLinkTemplateRegex = /{release_link}/g
const releaseNameTemplateRegex = /{release_name}/g
const releaseTagTemplateRegex = /{release_tag}/g

;(async function main() {
  try {
    const payload = github.context.payload as Webhooks.EventPayloadMap['release']

    const githubToken = core.getInput('GITHUB_TOKEN')
    const tagFilter = core.getInput('tag-filter') || undefined // Accept tag filter as an input
    const octokit = github.getOctokit(githubToken)

    const commentTemplate = core.getInput('comment-template')
    const labelTemplate = core.getInput('label-template') || null
    const skipLabelTemplate = core.getInput('skip-label') || null

    // Fetch the releases with the optional tag filter applied
    const { data: rawReleases } = await octokit.rest.repos.listReleases({
      ...github.context.repo,
      per_page: 100,
    })

    // Get the current release tag or latest tag
    const currentTag = payload?.release?.tag_name || rawReleases?.[0]?.tag_name

    let releases = rawReleases

    // Filter releases by the tag filter if provided
    if (tagFilter) {
      core.info(`Filtering releases by tag filter: ${tagFilter}`)
      // Get the matching part of the current release tag
      const regexMatch = currentTag.match(tagFilter)?.[0]
      if (!regexMatch) {
        core.error(`Current release tag ${currentTag} does not match the tag filter ${tagFilter}`)
        return
      }

      core.info(`Matched string from filter: ${regexMatch}`)

      releases = releases
        .filter((release) => {
          const match = release.tag_name.match(regexMatch)?.[0]
          return match
        })
        .slice(0, 2)
    }

    core.info(`Releases: ${JSON.stringify(releases, null, 2)}`)

    if (releases.length < 2) {
      if (!releases.length) {
        core.error(`No releases found with the provided tag filter: '${tagFilter}'`)
        return
      }

      core.info('first release')
      return
    }

    const [currentRelease, priorRelease] = releases

    core.info(`${priorRelease.tag_name}...${currentRelease.tag_name}`)

    const {
      data: { commits },
    } = await octokit.rest.repos.compareCommits({
      ...github.context.repo,
      base: priorRelease.tag_name,
      head: currentRelease.tag_name,
    })

    if (!currentRelease.name) {
      core.info('Current release has no name, will fall back to the tag name.')
    }
    const releaseLabel = currentRelease.name || currentRelease.tag_name

    const comment = commentTemplate
      .trim()
      .split(releaseLinkTemplateRegex)
      .join(`[${releaseLabel}](${currentRelease.html_url})`)
      .split(releaseNameTemplateRegex)
      .join(releaseLabel)
      .split(releaseTagTemplateRegex)
      .join(currentRelease.tag_name)

    const parseLabels = (rawInput: string | null) =>
      rawInput
        ?.split(releaseNameTemplateRegex)
        .join(releaseLabel)
        ?.split(releaseTagTemplateRegex)
        .join(currentRelease.tag_name)
        ?.split(',')
        ?.map((l) => l.trim())
        .filter((l) => l)

    const labels = parseLabels(labelTemplate)
    const skipLabels = parseLabels(skipLabelTemplate)

    const linkedIssuesPrs = new Set<number>()

    await Promise.all(
      commits.map((commit) =>
        (async () => {
          const query = `
            {
              resource(url: "${payload.repository.html_url}/commit/${commit.sha}") {
                ... on Commit {
                  messageHeadlineHTML
                  messageBodyHTML
                  associatedPullRequests(first: 10) {
                    pageInfo {
                      hasNextPage
                    }
                    edges {
                      node {
                        bodyHTML
                        number
                        state
                        labels(first: 10) {
                          pageInfo {
                            hasNextPage
                          }
                          nodes {
                            name
                          }
                        }
                        timelineItems(itemTypes: [CONNECTED_EVENT, DISCONNECTED_EVENT], first: 100) {
                          pageInfo {
                            hasNextPage
                          }
                          nodes {
                            ... on ConnectedEvent {
                              __typename
                              isCrossRepository
                              subject {
                                ... on Issue {
                                  number
                                }
                              }
                            }
                            ... on DisconnectedEvent {
                              __typename
                              isCrossRepository
                              subject {
                                ... on Issue {
                                  number
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `
          const response: {
            resource: null | {
              messageHeadlineHTML: string
              messageBodyHTML: string
              associatedPullRequests: {
                pageInfo: { hasNextPage: boolean }
                edges: ReadonlyArray<{
                  node: {
                    bodyHTML: string
                    number: number
                    state: 'OPEN' | 'CLOSED' | 'MERGED'
                    labels: {
                      pageInfo: { hasNextPage: boolean }
                      nodes: ReadonlyArray<{
                        name: string
                      }>
                    }
                    timelineItems: {
                      pageInfo: { hasNextPage: boolean }
                      nodes: ReadonlyArray<{
                        __typename: 'ConnectedEvent' | 'DisconnectedEvent'
                        isCrossRepository: boolean
                        subject: {
                          number: number
                        }
                      }>
                    }
                  }
                }>
              }
            }
          } = await octokit.graphql(query)

          if (!response.resource) {
            return
          }

          // core.info(JSON.stringify(response.resource, null, 2))

          core.info(`Checking commit: ${payload.repository.html_url}/commit/${commit.sha}`)

          const associatedClosedPREdges = response.resource.associatedPullRequests.edges.filter(
            (e) => e.node.state === 'MERGED',
          )

          if (associatedClosedPREdges.length) {
            core.info(
              `  Associated Merged PRs:\n    ${associatedClosedPREdges.map((pr) => `${payload.repository.html_url}/pull/${pr.node.number}`).join('\n    ')}`,
            )
          } else {
            core.info('  No associated merged PRs')
          }

          const html = [
            response.resource.messageHeadlineHTML,
            response.resource.messageBodyHTML,
            ...associatedClosedPREdges.map((pr) => pr.node.bodyHTML),
          ].join(' ')

          for (const match of html.matchAll(closesMatcher)) {
            const [, num] = match
            linkedIssuesPrs.add(parseInt(num, 10))
            core.info(
              `  Linked issue/PR from closesMatcher: ${payload.repository.html_url}/pull/${num}`,
            )
          }

          if (response.resource.associatedPullRequests.pageInfo.hasNextPage) {
            core.warning(`Too many PRs associated with ${commit.sha}`)
          }

          const seen = new Set<number>()
          for (const associatedPR of associatedClosedPREdges) {
            if (associatedPR.node.timelineItems.pageInfo.hasNextPage) {
              core.warning(`Too many links for #${associatedPR.node.number}`)
            }
            if (associatedPR.node.labels.pageInfo.hasNextPage) {
              core.warning(`Too many labels for #${associatedPR.node.number}`)
            }
            // a skip labels is present on this PR
            if (
              skipLabels?.some((l) => associatedPR.node.labels.nodes.some(({ name }) => name === l))
            ) {
              continue
            }

            linkedIssuesPrs.add(associatedPR.node.number)
            core.info(
              `  Linked issue/PR from associated PR: ${payload.repository.html_url}/pull/${associatedPR.node.number}`,
            )

            // These are sorted by creation date in ascending order. The latest event for a given issue/PR is all we need
            // ignore links that aren't part of this repo
            const links = associatedPR.node.timelineItems.nodes
              .filter((node) => !node.isCrossRepository)
              .reverse()
            for (const link of links) {
              if (seen.has(link.subject.number)) {
                continue
              }
              if (link.__typename == 'ConnectedEvent') {
                linkedIssuesPrs.add(link.subject.number)
                core.info(
                  `Linked issue/PR from connected event: ${payload.repository.html_url}/pull/${link.subject.number}`,
                )
              }
              seen.add(link.subject.number)
            }
          }
        })(),
      ),
    )

    core.info(
      `Final issues/PRs to be commented on: \n${Array.from(linkedIssuesPrs)
        .map((num) => `  ${payload.repository.html_url}/pull/${num}`)
        .join('\n')}`,
    )

    const requests: Array<Promise<unknown>> = []
    for (const issueNumber of linkedIssuesPrs) {
      const baseRequest = {
        ...github.context.repo,
        issue_number: issueNumber,
      }
      if (comment) {
        const commentRequest = {
          ...baseRequest,
          body: comment,
        }

        // Check if issue is locked or not
        const { data: issue } = await octokit.rest.issues.get(baseRequest)

        let createCommentPromise: () => Promise<void>
        if (!issue.locked) {
          createCommentPromise = async () => {
            try {
              await octokit.rest.issues.createComment(commentRequest)
            } catch (error) {
              core.error(error as Error)
              core.error(
                `Failed to comment on issue/PR: ${issueNumber}. ${payload.repository.html_url}/pull/${issueNumber}`,
              )
            }
          }
        } else {
          core.info(
            `Issue/PR is locked: ${issueNumber}. Unlocking, commenting, and re-locking. ${payload.repository.html_url}/pull/${issueNumber}`,
          )
          createCommentPromise = async () => {
            try {
              core.debug(`Unlocking issue/PR: ${issueNumber}`)
              await octokit.rest.issues.unlock(baseRequest)
              core.debug(`Commenting on issue/PR: ${issueNumber}`)
              await octokit.rest.issues.createComment(commentRequest)
              core.debug(`Re-locking issue/PR: ${issueNumber}`)
              await octokit.rest.issues.lock(baseRequest)
            } catch (error) {
              core.error(error as Error)
              core.error(
                `Failed to unlock, comment, and re-lock issue/PR: ${issueNumber}. ${payload.repository.html_url}/pull/${issueNumber}`,
              )
            }
          }
        }

        requests.push(createCommentPromise())
      }
      if (labels) {
        const request = {
          ...baseRequest,
          labels,
        }
        // core.info(JSON.stringify(request, null, 2))
        requests.push(octokit.rest.issues.addLabels(request))
      }
    }

    await Promise.all(requests)
  } catch (error) {
    core.error(error as Error)
    core.setFailed((error as Error).message)
  }
})()
```

--------------------------------------------------------------------------------

---[FILE: index.test.ts.snap]---
Location: payload-main/.github/actions/release-commenter/src/__snapshots__/index.test.ts.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`tests feature tests can apply labels 1`] = `
[
  [
    {
      "issue_number": 123,
      "labels": [
        ":dart: landed",
        "release-current_tag_name",
        "Release Name",
      ],
    },
  ],
  [
    {
      "issue_number": 7,
      "labels": [
        ":dart: landed",
        "release-current_tag_name",
        "Release Name",
      ],
    },
  ],
]
`;

exports[`tests main test 1`] = `
{
  "graphql": [MockFunction] {
    "calls": [
      [
        "
            {
              resource(url: "http://repository/commit/SHA1") {
                ... on Commit {
                  messageHeadlineHTML
                  messageBodyHTML
                  associatedPullRequests(first: 10) {
                    pageInfo {
                      hasNextPage
                    }
                    edges {
                      node {
                        bodyHTML
                        number
                        state
                        labels(first: 10) {
                          pageInfo {
                            hasNextPage
                          }
                          nodes {
                            name
                          }
                        }
                        timelineItems(itemTypes: [CONNECTED_EVENT, DISCONNECTED_EVENT], first: 100) {
                          pageInfo {
                            hasNextPage
                          }
                          nodes {
                            ... on ConnectedEvent {
                              __typename
                              isCrossRepository
                              subject {
                                ... on Issue {
                                  number
                                }
                              }
                            }
                            ... on DisconnectedEvent {
                              __typename
                              isCrossRepository
                              subject {
                                ... on Issue {
                                  number
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          ",
      ],
      [
        "
            {
              resource(url: "http://repository/commit/SHA2") {
                ... on Commit {
                  messageHeadlineHTML
                  messageBodyHTML
                  associatedPullRequests(first: 10) {
                    pageInfo {
                      hasNextPage
                    }
                    edges {
                      node {
                        bodyHTML
                        number
                        state
                        labels(first: 10) {
                          pageInfo {
                            hasNextPage
                          }
                          nodes {
                            name
                          }
                        }
                        timelineItems(itemTypes: [CONNECTED_EVENT, DISCONNECTED_EVENT], first: 100) {
                          pageInfo {
                            hasNextPage
                          }
                          nodes {
                            ... on ConnectedEvent {
                              __typename
                              isCrossRepository
                              subject {
                                ... on Issue {
                                  number
                                }
                              }
                            }
                            ... on DisconnectedEvent {
                              __typename
                              isCrossRepository
                              subject {
                                ... on Issue {
                                  number
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          ",
      ],
    ],
    "results": [
      {
        "type": "return",
        "value": Promise {},
      },
      {
        "type": "return",
        "value": Promise {},
      },
    ],
  },
  "rest": {
    "issues": {
      "addLabels": [MockFunction],
      "createComment": [MockFunction] {
        "calls": [
          [
            {
              "body": "Included in release [current_tag_name](http://current_release). Replacements: current_tag_name, current_tag_name.",
              "issue_number": 3,
            },
          ],
          [
            {
              "body": "Included in release [current_tag_name](http://current_release). Replacements: current_tag_name, current_tag_name.",
              "issue_number": 123,
            },
          ],
          [
            {
              "body": "Included in release [current_tag_name](http://current_release). Replacements: current_tag_name, current_tag_name.",
              "issue_number": 7,
            },
          ],
        ],
        "results": [
          {
            "type": "return",
            "value": Promise {},
          },
          {
            "type": "return",
            "value": Promise {},
          },
          {
            "type": "return",
            "value": Promise {},
          },
        ],
      },
      "get": [MockFunction] {
        "calls": [
          [
            {
              "issue_number": 3,
            },
          ],
          [
            {
              "issue_number": 123,
            },
          ],
          [
            {
              "issue_number": 7,
            },
          ],
        ],
        "results": [
          {
            "type": "return",
            "value": Promise {},
          },
          {
            "type": "return",
            "value": Promise {},
          },
          {
            "type": "return",
            "value": Promise {},
          },
        ],
      },
    },
    "repos": {
      "compareCommits": [MockFunction] {
        "calls": [
          [
            {
              "base": "prior_tag_name",
              "head": "current_tag_name",
            },
          ],
        ],
        "results": [
          {
            "type": "return",
            "value": Promise {},
          },
        ],
      },
      "listReleases": [MockFunction] {
        "calls": [
          [
            {
              "per_page": 100,
            },
          ],
        ],
        "results": [
          {
            "type": "return",
            "value": Promise {},
          },
        ],
      },
    },
  },
}
`;
```

--------------------------------------------------------------------------------

````
