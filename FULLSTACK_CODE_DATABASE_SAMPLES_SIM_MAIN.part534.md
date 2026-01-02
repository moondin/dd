---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 534
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 534 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: registry.ts]---
Location: sim-main/apps/sim/hooks/selectors/registry.ts

```typescript
import { fetchJson, fetchOAuthToken } from '@/hooks/selectors/helpers'
import type {
  SelectorContext,
  SelectorDefinition,
  SelectorKey,
  SelectorOption,
  SelectorQueryArgs,
} from '@/hooks/selectors/types'

const SELECTOR_STALE = 60 * 1000

type SlackChannel = { id: string; name: string }
type SlackUser = { id: string; name: string; real_name: string }
type FolderResponse = { id: string; name: string }
type PlannerTask = { id: string; title: string }

const ensureCredential = (context: SelectorContext, key: SelectorKey): string => {
  if (!context.credentialId) {
    throw new Error(`Missing credential for selector ${key}`)
  }
  return context.credentialId
}

const ensureDomain = (context: SelectorContext, key: SelectorKey): string => {
  if (!context.domain) {
    throw new Error(`Missing domain for selector ${key}`)
  }
  return context.domain
}

const ensureKnowledgeBase = (context: SelectorContext): string => {
  if (!context.knowledgeBaseId) {
    throw new Error('Missing knowledge base id')
  }
  return context.knowledgeBaseId
}

const registry: Record<SelectorKey, SelectorDefinition> = {
  'slack.channels': {
    key: 'slack.channels',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'slack.channels',
      context.credentialId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const body = JSON.stringify({
        credential: context.credentialId,
        workflowId: context.workflowId,
      })
      const data = await fetchJson<{ channels: SlackChannel[] }>('/api/tools/slack/channels', {
        method: 'POST',
        body,
      })
      return (data.channels || []).map((channel) => ({
        id: channel.id,
        label: `#${channel.name}`,
      }))
    },
  },
  'slack.users': {
    key: 'slack.users',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'slack.users',
      context.credentialId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const body = JSON.stringify({
        credential: context.credentialId,
        workflowId: context.workflowId,
      })
      const data = await fetchJson<{ users: SlackUser[] }>('/api/tools/slack/users', {
        method: 'POST',
        body,
      })
      return (data.users || []).map((user) => ({
        id: user.id,
        label: user.real_name || user.name,
      }))
    },
  },
  'gmail.labels': {
    key: 'gmail.labels',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'gmail.labels',
      context.credentialId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const data = await fetchJson<{ labels: FolderResponse[] }>('/api/tools/gmail/labels', {
        searchParams: { credentialId: context.credentialId },
      })
      return (data.labels || []).map((label) => ({
        id: label.id,
        label: label.name,
      }))
    },
  },
  'outlook.folders': {
    key: 'outlook.folders',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'outlook.folders',
      context.credentialId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const data = await fetchJson<{ folders: FolderResponse[] }>('/api/tools/outlook/folders', {
        searchParams: { credentialId: context.credentialId },
      })
      return (data.folders || []).map((folder) => ({
        id: folder.id,
        label: folder.name,
      }))
    },
  },
  'google.calendar': {
    key: 'google.calendar',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'google.calendar',
      context.credentialId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const data = await fetchJson<{ calendars: { id: string; summary: string }[] }>(
        '/api/tools/google_calendar/calendars',
        { searchParams: { credentialId: context.credentialId } }
      )
      return (data.calendars || []).map((calendar) => ({
        id: calendar.id,
        label: calendar.summary,
      }))
    },
  },
  'microsoft.teams': {
    key: 'microsoft.teams',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'microsoft.teams',
      context.credentialId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const body = JSON.stringify({ credential: context.credentialId })
      const data = await fetchJson<{ teams: { id: string; displayName: string }[] }>(
        '/api/tools/microsoft-teams/teams',
        { method: 'POST', body }
      )
      return (data.teams || []).map((team) => ({
        id: team.id,
        label: team.displayName,
      }))
    },
  },
  'microsoft.chats': {
    key: 'microsoft.chats',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'microsoft.chats',
      context.credentialId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const body = JSON.stringify({ credential: context.credentialId })
      const data = await fetchJson<{ chats: { id: string; displayName: string }[] }>(
        '/api/tools/microsoft-teams/chats',
        { method: 'POST', body }
      )
      return (data.chats || []).map((chat) => ({
        id: chat.id,
        label: chat.displayName,
      }))
    },
  },
  'microsoft.channels': {
    key: 'microsoft.channels',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'microsoft.channels',
      context.credentialId ?? 'none',
      context.teamId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId && context.teamId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const body = JSON.stringify({
        credential: context.credentialId,
        teamId: context.teamId,
      })
      const data = await fetchJson<{ channels: { id: string; displayName: string }[] }>(
        '/api/tools/microsoft-teams/channels',
        { method: 'POST', body }
      )
      return (data.channels || []).map((channel) => ({
        id: channel.id,
        label: channel.displayName,
      }))
    },
  },
  'wealthbox.contacts': {
    key: 'wealthbox.contacts',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'wealthbox.contacts',
      context.credentialId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const data = await fetchJson<{ items: { id: string; name: string }[] }>(
        '/api/tools/wealthbox/items',
        {
          searchParams: { credentialId: context.credentialId, type: 'contact' },
        }
      )
      return (data.items || []).map((item) => ({
        id: item.id,
        label: item.name,
      }))
    },
  },
  'sharepoint.sites': {
    key: 'sharepoint.sites',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'sharepoint.sites',
      context.credentialId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const data = await fetchJson<{ files: { id: string; name: string }[] }>(
        '/api/tools/sharepoint/sites',
        {
          searchParams: { credentialId: context.credentialId },
        }
      )
      return (data.files || []).map((file) => ({
        id: file.id,
        label: file.name,
      }))
    },
  },
  'microsoft.planner': {
    key: 'microsoft.planner',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'microsoft.planner',
      context.credentialId ?? 'none',
      context.planId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId && context.planId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const data = await fetchJson<{ tasks: PlannerTask[] }>('/api/tools/microsoft_planner/tasks', {
        searchParams: {
          credentialId: context.credentialId,
          planId: context.planId,
        },
      })
      return (data.tasks || []).map((task) => ({
        id: task.id,
        label: task.title,
      }))
    },
  },
  'jira.projects': {
    key: 'jira.projects',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context, search }: SelectorQueryArgs) => [
      'selectors',
      'jira.projects',
      context.credentialId ?? 'none',
      context.domain ?? 'none',
      search ?? '',
    ],
    enabled: ({ context }) => Boolean(context.credentialId && context.domain),
    fetchList: async ({ context, search }: SelectorQueryArgs) => {
      const credentialId = ensureCredential(context, 'jira.projects')
      const domain = ensureDomain(context, 'jira.projects')
      const accessToken = await fetchOAuthToken(credentialId, context.workflowId)
      if (!accessToken) {
        throw new Error('Missing Jira access token')
      }
      const data = await fetchJson<{ projects: { id: string; name: string }[] }>(
        '/api/tools/jira/projects',
        {
          searchParams: {
            domain,
            accessToken,
            query: search ?? '',
          },
        }
      )
      return (data.projects || []).map((project) => ({
        id: project.id,
        label: project.name,
      }))
    },
    fetchById: async ({ context, detailId }: SelectorQueryArgs) => {
      if (!detailId) return null
      const credentialId = ensureCredential(context, 'jira.projects')
      const domain = ensureDomain(context, 'jira.projects')
      const accessToken = await fetchOAuthToken(credentialId, context.workflowId)
      if (!accessToken) {
        throw new Error('Missing Jira access token')
      }
      const data = await fetchJson<{ project?: { id: string; name: string } }>(
        '/api/tools/jira/projects',
        {
          method: 'POST',
          body: JSON.stringify({
            domain,
            accessToken,
            projectId: detailId,
          }),
        }
      )
      if (!data.project) return null
      return {
        id: data.project.id,
        label: data.project.name,
      }
    },
  },
  'jira.issues': {
    key: 'jira.issues',
    staleTime: 15 * 1000,
    getQueryKey: ({ context, search }: SelectorQueryArgs) => [
      'selectors',
      'jira.issues',
      context.credentialId ?? 'none',
      context.domain ?? 'none',
      context.projectId ?? 'none',
      search ?? '',
    ],
    enabled: ({ context }) => Boolean(context.credentialId && context.domain),
    fetchList: async ({ context, search }: SelectorQueryArgs) => {
      const credentialId = ensureCredential(context, 'jira.issues')
      const domain = ensureDomain(context, 'jira.issues')
      const accessToken = await fetchOAuthToken(credentialId, context.workflowId)
      if (!accessToken) {
        throw new Error('Missing Jira access token')
      }
      const data = await fetchJson<{
        sections?: { issues: { id?: string; key?: string; summary?: string }[] }[]
      }>('/api/tools/jira/issues', {
        searchParams: {
          domain,
          accessToken,
          projectId: context.projectId,
          query: search ?? '',
        },
      })
      const issues =
        data.sections?.flatMap((section) =>
          (section.issues || []).map((issue) => ({
            id: issue.id || issue.key || '',
            name: issue.summary || issue.key || '',
          }))
        ) || []
      return issues
        .filter((issue) => issue.id)
        .map((issue) => ({ id: issue.id, label: issue.name || issue.id }))
    },
    fetchById: async ({ context, detailId }: SelectorQueryArgs) => {
      if (!detailId) return null
      const credentialId = ensureCredential(context, 'jira.issues')
      const domain = ensureDomain(context, 'jira.issues')
      const accessToken = await fetchOAuthToken(credentialId, context.workflowId)
      if (!accessToken) {
        throw new Error('Missing Jira access token')
      }
      const data = await fetchJson<{ issues?: { id: string; name: string }[] }>(
        '/api/tools/jira/issues',
        {
          method: 'POST',
          body: JSON.stringify({
            domain,
            accessToken,
            issueKeys: [detailId],
          }),
        }
      )
      const issue = data.issues?.[0]
      if (!issue) return null
      return { id: issue.id, label: issue.name }
    },
  },
  'linear.teams': {
    key: 'linear.teams',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'linear.teams',
      context.credentialId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const credentialId = ensureCredential(context, 'linear.teams')
      const body = JSON.stringify({ credential: credentialId, workflowId: context.workflowId })
      const data = await fetchJson<{ teams: { id: string; name: string }[] }>(
        '/api/tools/linear/teams',
        {
          method: 'POST',
          body,
        }
      )
      return (data.teams || []).map((team) => ({
        id: team.id,
        label: team.name,
      }))
    },
  },
  'linear.projects': {
    key: 'linear.projects',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'linear.projects',
      context.credentialId ?? 'none',
      context.teamId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId && context.teamId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const credentialId = ensureCredential(context, 'linear.projects')
      const body = JSON.stringify({
        credential: credentialId,
        teamId: context.teamId,
        workflowId: context.workflowId,
      })
      const data = await fetchJson<{ projects: { id: string; name: string }[] }>(
        '/api/tools/linear/projects',
        {
          method: 'POST',
          body,
        }
      )
      return (data.projects || []).map((project) => ({
        id: project.id,
        label: project.name,
      }))
    },
  },
  'confluence.pages': {
    key: 'confluence.pages',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context, search }: SelectorQueryArgs) => [
      'selectors',
      'confluence.pages',
      context.credentialId ?? 'none',
      context.domain ?? 'none',
      search ?? '',
    ],
    enabled: ({ context }) => Boolean(context.credentialId && context.domain),
    fetchList: async ({ context, search }: SelectorQueryArgs) => {
      const credentialId = ensureCredential(context, 'confluence.pages')
      const domain = ensureDomain(context, 'confluence.pages')
      const accessToken = await fetchOAuthToken(credentialId, context.workflowId)
      if (!accessToken) {
        throw new Error('Missing Confluence access token')
      }
      const data = await fetchJson<{ files: { id: string; name: string }[] }>(
        '/api/tools/confluence/pages',
        {
          method: 'POST',
          body: JSON.stringify({
            domain,
            accessToken,
            title: search,
          }),
        }
      )
      return (data.files || []).map((file) => ({
        id: file.id,
        label: file.name,
      }))
    },
    fetchById: async ({ context, detailId }: SelectorQueryArgs) => {
      if (!detailId) return null
      const credentialId = ensureCredential(context, 'confluence.pages')
      const domain = ensureDomain(context, 'confluence.pages')
      const accessToken = await fetchOAuthToken(credentialId, context.workflowId)
      if (!accessToken) {
        throw new Error('Missing Confluence access token')
      }
      const data = await fetchJson<{ id: string; title: string }>('/api/tools/confluence/page', {
        method: 'POST',
        body: JSON.stringify({
          domain,
          accessToken,
          pageId: detailId,
        }),
      })
      return { id: data.id, label: data.title }
    },
  },
  'onedrive.files': {
    key: 'onedrive.files',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'onedrive.files',
      context.credentialId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const credentialId = ensureCredential(context, 'onedrive.files')
      const data = await fetchJson<{ files: { id: string; name: string }[] }>(
        '/api/tools/onedrive/files',
        {
          searchParams: { credentialId },
        }
      )
      return (data.files || []).map((file) => ({
        id: file.id,
        label: file.name,
      }))
    },
  },
  'onedrive.folders': {
    key: 'onedrive.folders',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'onedrive.folders',
      context.credentialId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const credentialId = ensureCredential(context, 'onedrive.folders')
      const data = await fetchJson<{ files: { id: string; name: string }[] }>(
        '/api/tools/onedrive/folders',
        {
          searchParams: { credentialId },
        }
      )
      return (data.files || []).map((file) => ({
        id: file.id,
        label: file.name,
      }))
    },
  },
  'google.drive': {
    key: 'google.drive',
    staleTime: 15 * 1000,
    getQueryKey: ({ context, search }: SelectorQueryArgs) => [
      'selectors',
      'google.drive',
      context.credentialId ?? 'none',
      context.mimeType ?? 'any',
      context.fileId ?? 'root',
      search ?? '',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context, search }: SelectorQueryArgs) => {
      const credentialId = ensureCredential(context, 'google.drive')
      const data = await fetchJson<{ files: { id: string; name: string }[] }>(
        '/api/tools/drive/files',
        {
          searchParams: {
            credentialId,
            mimeType: context.mimeType,
            parentId: context.fileId,
            query: search,
            workflowId: context.workflowId,
          },
        }
      )
      return (data.files || []).map((file) => ({
        id: file.id,
        label: file.name,
      }))
    },
    fetchById: async ({ context, detailId }: SelectorQueryArgs) => {
      if (!detailId) return null
      const credentialId = ensureCredential(context, 'google.drive')
      const data = await fetchJson<{ file?: { id: string; name: string } }>(
        '/api/tools/drive/file',
        {
          searchParams: {
            credentialId,
            fileId: detailId,
            workflowId: context.workflowId,
          },
        }
      )
      const file = data.file
      if (!file) return null
      return { id: file.id, label: file.name }
    },
  },
  'microsoft.excel': {
    key: 'microsoft.excel',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context, search }: SelectorQueryArgs) => [
      'selectors',
      'microsoft.excel',
      context.credentialId ?? 'none',
      search ?? '',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context, search }: SelectorQueryArgs) => {
      const credentialId = ensureCredential(context, 'microsoft.excel')
      const data = await fetchJson<{ files: { id: string; name: string }[] }>(
        '/api/auth/oauth/microsoft/files',
        {
          searchParams: {
            credentialId,
            query: search,
            workflowId: context.workflowId,
          },
        }
      )
      return (data.files || []).map((file) => ({
        id: file.id,
        label: file.name,
      }))
    },
  },
  'microsoft.word': {
    key: 'microsoft.word',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context, search }: SelectorQueryArgs) => [
      'selectors',
      'microsoft.word',
      context.credentialId ?? 'none',
      search ?? '',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context, search }: SelectorQueryArgs) => {
      const credentialId = ensureCredential(context, 'microsoft.word')
      const data = await fetchJson<{ files: { id: string; name: string }[] }>(
        '/api/auth/oauth/microsoft/files',
        {
          searchParams: {
            credentialId,
            query: search,
            workflowId: context.workflowId,
          },
        }
      )
      return (data.files || []).map((file) => ({
        id: file.id,
        label: file.name,
      }))
    },
  },
  'knowledge.documents': {
    key: 'knowledge.documents',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context, search }: SelectorQueryArgs) => [
      'selectors',
      'knowledge.documents',
      context.knowledgeBaseId ?? 'none',
      search ?? '',
    ],
    enabled: ({ context }) => Boolean(context.knowledgeBaseId),
    fetchList: async ({ context, search }: SelectorQueryArgs) => {
      const knowledgeBaseId = ensureKnowledgeBase(context)
      const data = await fetchJson<{
        data?: { documents: { id: string; filename: string }[] }
      }>(`/api/knowledge/${knowledgeBaseId}/documents`, {
        searchParams: {
          limit: 200,
          search,
        },
      })
      const documents = data.data?.documents || []
      return documents.map((doc) => ({
        id: doc.id,
        label: doc.filename,
      }))
    },
    fetchById: async ({ context, detailId }: SelectorQueryArgs) => {
      if (!detailId) return null
      const knowledgeBaseId = ensureKnowledgeBase(context)
      const data = await fetchJson<{ data?: { document?: { id: string; filename: string } } }>(
        `/api/knowledge/${knowledgeBaseId}/documents/${detailId}`,
        {
          searchParams: { includeDisabled: 'true' },
        }
      )
      const doc = data.data?.document
      if (!doc) return null
      return { id: doc.id, label: doc.filename }
    },
  },
  'webflow.sites': {
    key: 'webflow.sites',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'webflow.sites',
      context.credentialId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const credentialId = ensureCredential(context, 'webflow.sites')
      const body = JSON.stringify({ credential: credentialId, workflowId: context.workflowId })
      const data = await fetchJson<{ sites: { id: string; name: string }[] }>(
        '/api/tools/webflow/sites',
        {
          method: 'POST',
          body,
        }
      )
      return (data.sites || []).map((site) => ({
        id: site.id,
        label: site.name,
      }))
    },
  },
  'webflow.collections': {
    key: 'webflow.collections',
    staleTime: SELECTOR_STALE,
    getQueryKey: ({ context }: SelectorQueryArgs) => [
      'selectors',
      'webflow.collections',
      context.credentialId ?? 'none',
      context.siteId ?? 'none',
    ],
    enabled: ({ context }) => Boolean(context.credentialId && context.siteId),
    fetchList: async ({ context }: SelectorQueryArgs) => {
      const credentialId = ensureCredential(context, 'webflow.collections')
      if (!context.siteId) {
        throw new Error('Missing site ID for webflow.collections selector')
      }
      const body = JSON.stringify({
        credential: credentialId,
        workflowId: context.workflowId,
        siteId: context.siteId,
      })
      const data = await fetchJson<{ collections: { id: string; name: string }[] }>(
        '/api/tools/webflow/collections',
        {
          method: 'POST',
          body,
        }
      )
      return (data.collections || []).map((collection) => ({
        id: collection.id,
        label: collection.name,
      }))
    },
  },
  'webflow.items': {
    key: 'webflow.items',
    staleTime: 15 * 1000,
    getQueryKey: ({ context, search }: SelectorQueryArgs) => [
      'selectors',
      'webflow.items',
      context.credentialId ?? 'none',
      context.collectionId ?? 'none',
      search ?? '',
    ],
    enabled: ({ context }) => Boolean(context.credentialId && context.collectionId),
    fetchList: async ({ context, search }: SelectorQueryArgs) => {
      const credentialId = ensureCredential(context, 'webflow.items')
      if (!context.collectionId) {
        throw new Error('Missing collection ID for webflow.items selector')
      }
      const body = JSON.stringify({
        credential: credentialId,
        workflowId: context.workflowId,
        collectionId: context.collectionId,
        search,
      })
      const data = await fetchJson<{ items: { id: string; name: string }[] }>(
        '/api/tools/webflow/items',
        {
          method: 'POST',
          body,
        }
      )
      return (data.items || []).map((item) => ({
        id: item.id,
        label: item.name,
      }))
    },
  },
}

export function getSelectorDefinition(key: SelectorKey): SelectorDefinition {
  const definition = registry[key]
  if (!definition) {
    throw new Error(`Missing selector definition for ${key}`)
  }
  return definition
}

export function mergeOption(options: SelectorOption[], option?: SelectorOption | null) {
  if (!option) return options
  if (options.some((item) => item.id === option.id)) {
    return options
  }
  return [option, ...options]
}
```

--------------------------------------------------------------------------------

---[FILE: resolution.ts]---
Location: sim-main/apps/sim/hooks/selectors/resolution.ts

```typescript
import type { SubBlockConfig } from '@/blocks/types'
import type { SelectorContext, SelectorKey } from '@/hooks/selectors/types'

export interface SelectorResolution {
  key: SelectorKey | null
  context: SelectorContext
  allowSearch: boolean
}

export interface SelectorResolutionArgs {
  workflowId?: string
  credentialId?: string
  domain?: string
  projectId?: string
  planId?: string
  teamId?: string
  knowledgeBaseId?: string
  siteId?: string
  collectionId?: string
}

const defaultContext: SelectorContext = {}

export function resolveSelectorForSubBlock(
  subBlock: SubBlockConfig,
  args: SelectorResolutionArgs
): SelectorResolution | null {
  switch (subBlock.type) {
    case 'file-selector':
      return resolveFileSelector(subBlock, args)
    case 'folder-selector':
      return resolveFolderSelector(subBlock, args)
    case 'channel-selector':
      return resolveChannelSelector(subBlock, args)
    case 'user-selector':
      return resolveUserSelector(subBlock, args)
    case 'project-selector':
      return resolveProjectSelector(subBlock, args)
    case 'document-selector':
      return resolveDocumentSelector(subBlock, args)
    default:
      return null
  }
}

function buildBaseContext(
  args: SelectorResolutionArgs,
  extra?: Partial<SelectorContext>
): SelectorContext {
  return {
    ...defaultContext,
    workflowId: args.workflowId,
    credentialId: args.credentialId,
    domain: args.domain,
    projectId: args.projectId,
    planId: args.planId,
    teamId: args.teamId,
    knowledgeBaseId: args.knowledgeBaseId,
    siteId: args.siteId,
    collectionId: args.collectionId,
    ...extra,
  }
}

function resolveFileSelector(
  subBlock: SubBlockConfig,
  args: SelectorResolutionArgs
): SelectorResolution {
  const context = buildBaseContext(args, {
    mimeType: subBlock.mimeType,
  })

  // Use serviceId as the canonical identifier
  const serviceId = subBlock.serviceId || ''

  switch (serviceId) {
    case 'google-calendar':
      return { key: 'google.calendar', context, allowSearch: false }
    case 'confluence':
      return { key: 'confluence.pages', context, allowSearch: true }
    case 'jira':
      return { key: 'jira.issues', context, allowSearch: true }
    case 'microsoft-teams':
      // Route to the correct selector based on what type of resource is being selected
      if (subBlock.id === 'chatId') {
        return { key: 'microsoft.chats', context, allowSearch: false }
      }
      if (subBlock.id === 'channelId') {
        return { key: 'microsoft.channels', context, allowSearch: false }
      }
      // Default to teams selector for teamId
      return { key: 'microsoft.teams', context, allowSearch: false }
    case 'wealthbox':
      return { key: 'wealthbox.contacts', context, allowSearch: true }
    case 'microsoft-planner':
      return { key: 'microsoft.planner', context, allowSearch: true }
    case 'microsoft-excel':
      return { key: 'microsoft.excel', context, allowSearch: true }
    case 'microsoft-word':
      return { key: 'microsoft.word', context, allowSearch: true }
    case 'google-drive':
      return { key: 'google.drive', context, allowSearch: true }
    case 'google-sheets':
      return { key: 'google.drive', context, allowSearch: true }
    case 'google-docs':
      return { key: 'google.drive', context, allowSearch: true }
    case 'google-slides':
      return { key: 'google.drive', context, allowSearch: true }
    case 'onedrive': {
      const key: SelectorKey = subBlock.mimeType === 'file' ? 'onedrive.files' : 'onedrive.folders'
      return { key, context, allowSearch: true }
    }
    case 'sharepoint':
      return { key: 'sharepoint.sites', context, allowSearch: true }
    case 'webflow':
      if (subBlock.id === 'collectionId') {
        return { key: 'webflow.collections', context, allowSearch: false }
      }
      if (subBlock.id === 'itemId') {
        return { key: 'webflow.items', context, allowSearch: true }
      }
      return { key: null, context, allowSearch: true }
    default:
      return { key: null, context, allowSearch: true }
  }
}

function resolveFolderSelector(
  subBlock: SubBlockConfig,
  args: SelectorResolutionArgs
): SelectorResolution {
  const serviceId = subBlock.serviceId?.toLowerCase()
  if (!serviceId) {
    return { key: null, context: buildBaseContext(args), allowSearch: true }
  }

  switch (serviceId) {
    case 'gmail':
      return { key: 'gmail.labels', context: buildBaseContext(args), allowSearch: true }
    case 'outlook':
      return { key: 'outlook.folders', context: buildBaseContext(args), allowSearch: true }
    default:
      return { key: null, context: buildBaseContext(args), allowSearch: true }
  }
}

function resolveChannelSelector(
  subBlock: SubBlockConfig,
  args: SelectorResolutionArgs
): SelectorResolution {
  const serviceId = subBlock.serviceId
  if (serviceId !== 'slack') {
    return { key: null, context: buildBaseContext(args), allowSearch: true }
  }
  return {
    key: 'slack.channels',
    context: buildBaseContext(args),
    allowSearch: true,
  }
}

function resolveUserSelector(
  subBlock: SubBlockConfig,
  args: SelectorResolutionArgs
): SelectorResolution {
  const serviceId = subBlock.serviceId
  if (serviceId !== 'slack') {
    return { key: null, context: buildBaseContext(args), allowSearch: true }
  }
  return {
    key: 'slack.users',
    context: buildBaseContext(args),
    allowSearch: true,
  }
}

function resolveProjectSelector(
  subBlock: SubBlockConfig,
  args: SelectorResolutionArgs
): SelectorResolution {
  const serviceId = subBlock.serviceId
  const context = buildBaseContext(args)

  switch (serviceId) {
    case 'linear': {
      const key: SelectorKey = subBlock.id === 'teamId' ? 'linear.teams' : 'linear.projects'
      return { key, context, allowSearch: true }
    }
    case 'jira':
      return { key: 'jira.projects', context, allowSearch: true }
    case 'webflow':
      return { key: 'webflow.sites', context, allowSearch: false }
    default:
      return { key: null, context, allowSearch: true }
  }
}

function resolveDocumentSelector(
  _subBlock: SubBlockConfig,
  args: SelectorResolutionArgs
): SelectorResolution {
  return {
    key: 'knowledge.documents',
    context: buildBaseContext(args),
    allowSearch: true,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/hooks/selectors/types.ts
Signals: React

```typescript
import type React from 'react'
import type { QueryKey } from '@tanstack/react-query'

export type SelectorKey =
  | 'slack.channels'
  | 'slack.users'
  | 'gmail.labels'
  | 'outlook.folders'
  | 'google.calendar'
  | 'jira.issues'
  | 'jira.projects'
  | 'linear.projects'
  | 'linear.teams'
  | 'confluence.pages'
  | 'microsoft.teams'
  | 'microsoft.chats'
  | 'microsoft.channels'
  | 'wealthbox.contacts'
  | 'onedrive.files'
  | 'onedrive.folders'
  | 'sharepoint.sites'
  | 'microsoft.excel'
  | 'microsoft.word'
  | 'microsoft.planner'
  | 'google.drive'
  | 'knowledge.documents'
  | 'webflow.sites'
  | 'webflow.collections'
  | 'webflow.items'

export interface SelectorOption {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  meta?: Record<string, unknown>
}

export interface SelectorContext {
  workspaceId?: string
  workflowId?: string
  credentialId?: string
  serviceId?: string
  domain?: string
  teamId?: string
  projectId?: string
  knowledgeBaseId?: string
  planId?: string
  mimeType?: string
  fileId?: string
  siteId?: string
  collectionId?: string
}

export interface SelectorQueryArgs {
  key: SelectorKey
  context: SelectorContext
  search?: string
  detailId?: string
}

export interface SelectorDefinition {
  key: SelectorKey
  getQueryKey: (args: SelectorQueryArgs) => QueryKey
  fetchList: (args: SelectorQueryArgs) => Promise<SelectorOption[]>
  fetchById?: (args: SelectorQueryArgs) => Promise<SelectorOption | null>
  enabled?: (args: SelectorQueryArgs) => boolean
  staleTime?: number
}
```

--------------------------------------------------------------------------------

---[FILE: use-selector-query.ts]---
Location: sim-main/apps/sim/hooks/selectors/use-selector-query.ts
Signals: React

```typescript
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSelectorDefinition, mergeOption } from '@/hooks/selectors/registry'
import type { SelectorKey, SelectorOption, SelectorQueryArgs } from '@/hooks/selectors/types'

interface SelectorHookArgs extends Omit<SelectorQueryArgs, 'key'> {
  search?: string
  detailId?: string
  enabled?: boolean
}

export function useSelectorOptions(key: SelectorKey, args: SelectorHookArgs) {
  const definition = getSelectorDefinition(key)
  const queryArgs: SelectorQueryArgs = {
    key,
    context: args.context,
    search: args.search,
  }
  const isEnabled = args.enabled ?? (definition.enabled ? definition.enabled(queryArgs) : true)
  return useQuery<SelectorOption[]>({
    queryKey: definition.getQueryKey(queryArgs),
    queryFn: () => definition.fetchList(queryArgs),
    enabled: isEnabled,
    staleTime: definition.staleTime ?? 30_000,
  })
}

export function useSelectorOptionDetail(
  key: SelectorKey,
  args: SelectorHookArgs & { detailId?: string }
) {
  const definition = getSelectorDefinition(key)
  const queryArgs: SelectorQueryArgs = {
    key,
    context: args.context,
    detailId: args.detailId,
  }
  const baseEnabled =
    Boolean(args.detailId) && definition.fetchById !== undefined
      ? definition.enabled
        ? definition.enabled(queryArgs)
        : true
      : false
  const enabled = args.enabled ?? baseEnabled

  const query = useQuery<SelectorOption | null>({
    queryKey: [...definition.getQueryKey(queryArgs), 'detail', args.detailId ?? 'none'],
    queryFn: () => definition.fetchById!(queryArgs),
    enabled,
    staleTime: definition.staleTime ?? 300_000,
  })

  return query
}

export function useSelectorOptionMap(options: SelectorOption[], extra?: SelectorOption | null) {
  return useMemo(() => {
    const merged = mergeOption(options, extra)
    return new Map(merged.map((option) => [option.id, option]))
  }, [options, extra])
}
```

--------------------------------------------------------------------------------

````
