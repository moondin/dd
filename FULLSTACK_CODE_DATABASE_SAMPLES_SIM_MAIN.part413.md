---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 413
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 413 of 933)

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

---[FILE: credential-selector.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/credential-selector/credential-selector.tsx
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Button, Combobox } from '@/components/emcn/components'
import { createLogger } from '@/lib/logs/console/logger'
import {
  getCanonicalScopesForProvider,
  getProviderIdFromServiceId,
  OAUTH_PROVIDERS,
  type OAuthProvider,
  parseProvider,
} from '@/lib/oauth'
import { OAuthRequiredModal } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/credential-selector/components/oauth-required-modal'
import { useDependsOnGate } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-depends-on-gate'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import type { SubBlockConfig } from '@/blocks/types'
import { useOAuthCredentialDetail, useOAuthCredentials } from '@/hooks/queries/oauth-credentials'
import { getMissingRequiredScopes } from '@/hooks/use-oauth-scope-status'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

const logger = createLogger('CredentialSelector')

interface CredentialSelectorProps {
  blockId: string
  subBlock: SubBlockConfig
  disabled?: boolean
  isPreview?: boolean
  previewValue?: any | null
}

export function CredentialSelector({
  blockId,
  subBlock,
  disabled = false,
  isPreview = false,
  previewValue,
}: CredentialSelectorProps) {
  const [showOAuthModal, setShowOAuthModal] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const { activeWorkflowId } = useWorkflowRegistry()
  const [storeValue, setStoreValue] = useSubBlockValue<string | null>(blockId, subBlock.id)

  const requiredScopes = subBlock.requiredScopes || []
  const label = subBlock.placeholder || 'Select credential'
  const serviceId = subBlock.serviceId || ''

  const { depsSatisfied, dependsOn } = useDependsOnGate(blockId, subBlock, { disabled, isPreview })
  const hasDependencies = dependsOn.length > 0

  const effectiveDisabled = disabled || (hasDependencies && !depsSatisfied)

  const effectiveValue = isPreview && previewValue !== undefined ? previewValue : storeValue
  const selectedId = typeof effectiveValue === 'string' ? effectiveValue : ''

  const effectiveProviderId = useMemo(
    () => getProviderIdFromServiceId(serviceId) as OAuthProvider,
    [serviceId]
  )
  const provider = effectiveProviderId

  const {
    data: credentials = [],
    isFetching: credentialsLoading,
    refetch: refetchCredentials,
  } = useOAuthCredentials(effectiveProviderId, Boolean(effectiveProviderId))

  const selectedCredential = useMemo(
    () => credentials.find((cred) => cred.id === selectedId),
    [credentials, selectedId]
  )

  const shouldFetchForeignMeta =
    Boolean(selectedId) &&
    !selectedCredential &&
    Boolean(activeWorkflowId) &&
    Boolean(effectiveProviderId)

  const { data: foreignCredentials = [], isFetching: foreignMetaLoading } =
    useOAuthCredentialDetail(
      shouldFetchForeignMeta ? selectedId : undefined,
      activeWorkflowId || undefined,
      shouldFetchForeignMeta
    )

  const hasForeignMeta = foreignCredentials.length > 0
  const isForeign = Boolean(selectedId && !selectedCredential && hasForeignMeta)

  const resolvedLabel = useMemo(() => {
    if (selectedCredential) return selectedCredential.name
    if (isForeign) return 'Saved by collaborator'
    return ''
  }, [selectedCredential, isForeign])

  useEffect(() => {
    if (!isEditing) {
      setInputValue(resolvedLabel)
    }
  }, [resolvedLabel, isEditing])

  const invalidSelection =
    !isPreview &&
    Boolean(selectedId) &&
    !selectedCredential &&
    !hasForeignMeta &&
    !credentialsLoading &&
    !foreignMetaLoading

  useEffect(() => {
    if (!invalidSelection) return
    logger.info('Clearing invalid credential selection - credential was disconnected', {
      selectedId,
      provider: effectiveProviderId,
    })
    setStoreValue('')
  }, [invalidSelection, selectedId, effectiveProviderId, setStoreValue])

  useCredentialRefreshTriggers(refetchCredentials, effectiveProviderId, provider)

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        void refetchCredentials()
      }
    },
    [refetchCredentials]
  )

  const hasSelection = Boolean(selectedCredential)
  const missingRequiredScopes = hasSelection
    ? getMissingRequiredScopes(selectedCredential!, requiredScopes || [])
    : []

  const needsUpdate =
    hasSelection &&
    missingRequiredScopes.length > 0 &&
    !effectiveDisabled &&
    !isPreview &&
    !credentialsLoading

  const handleSelect = useCallback(
    (credentialId: string) => {
      if (isPreview) return
      setStoreValue(credentialId)
      setIsEditing(false)
    },
    [isPreview, setStoreValue]
  )

  const handleAddCredential = useCallback(() => {
    setShowOAuthModal(true)
  }, [])

  const getProviderIcon = useCallback((providerName: OAuthProvider) => {
    const { baseProvider } = parseProvider(providerName)
    const baseProviderConfig = OAUTH_PROVIDERS[baseProvider]

    if (!baseProviderConfig) {
      return <ExternalLink className='h-3 w-3' />
    }
    return baseProviderConfig.icon({ className: 'h-3 w-3' })
  }, [])

  const getProviderName = useCallback((providerName: OAuthProvider) => {
    const { baseProvider } = parseProvider(providerName)
    const baseProviderConfig = OAUTH_PROVIDERS[baseProvider]

    if (baseProviderConfig) {
      return baseProviderConfig.name
    }

    return providerName
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }, [])

  const comboboxOptions = useMemo(() => {
    const options = credentials.map((cred) => ({
      label: cred.name,
      value: cred.id,
    }))

    if (credentials.length === 0) {
      options.push({
        label: `Connect ${getProviderName(provider)} account`,
        value: '__connect_account__',
      })
    }

    return options
  }, [credentials, provider, getProviderName])

  const selectedCredentialProvider = selectedCredential?.provider ?? provider

  const overlayContent = useMemo(() => {
    if (!inputValue) return null

    return (
      <div className='flex w-full items-center truncate'>
        <div className='mr-2 flex-shrink-0 opacity-90'>
          {getProviderIcon(selectedCredentialProvider)}
        </div>
        <span className='truncate'>{inputValue}</span>
      </div>
    )
  }, [getProviderIcon, inputValue, selectedCredentialProvider])

  const handleComboboxChange = useCallback(
    (value: string) => {
      if (value === '__connect_account__') {
        handleAddCredential()
        return
      }

      const matchedCred = credentials.find((c) => c.id === value)
      if (matchedCred) {
        setInputValue(matchedCred.name)
        handleSelect(value)
        return
      }

      setIsEditing(true)
      setInputValue(value)
    },
    [credentials, handleAddCredential, handleSelect]
  )

  return (
    <>
      <Combobox
        options={comboboxOptions}
        value={inputValue}
        selectedValue={selectedId}
        onChange={handleComboboxChange}
        onOpenChange={handleOpenChange}
        placeholder={
          hasDependencies && !depsSatisfied ? 'Fill in required fields above first' : label
        }
        disabled={effectiveDisabled}
        editable={true}
        filterOptions={true}
        isLoading={credentialsLoading}
        overlayContent={overlayContent}
        className={selectedId ? 'pl-[28px]' : ''}
      />

      {needsUpdate && (
        <div className='mt-2 flex items-center justify-between rounded-[6px] border border-amber-300/40 bg-amber-50/60 px-2 py-1 font-medium text-[12px] transition-colors dark:bg-amber-950/10'>
          <span>Additional permissions required</span>
          {!isForeign && <Button onClick={() => setShowOAuthModal(true)}>Update access</Button>}
        </div>
      )}

      {showOAuthModal && (
        <OAuthRequiredModal
          isOpen={showOAuthModal}
          onClose={() => setShowOAuthModal(false)}
          provider={provider}
          toolName={getProviderName(provider)}
          requiredScopes={getCanonicalScopesForProvider(effectiveProviderId)}
          newScopes={missingRequiredScopes}
          serviceId={serviceId}
        />
      )}
    </>
  )
}

function useCredentialRefreshTriggers(
  refetchCredentials: () => Promise<unknown>,
  effectiveProviderId?: string,
  provider?: OAuthProvider
) {
  useEffect(() => {
    const refresh = () => {
      void refetchCredentials()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh()
      }
    }

    const handlePageShow = (event: Event) => {
      if ('persisted' in event && (event as PageTransitionEvent).persisted) {
        refresh()
      }
    }

    const handleCredentialDisconnected = (event: Event) => {
      const customEvent = event as CustomEvent<{ providerId?: string }>
      const providerId = customEvent.detail?.providerId

      if (
        providerId &&
        (providerId === effectiveProviderId || (provider && providerId.startsWith(provider)))
      ) {
        refresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pageshow', handlePageShow)
    window.addEventListener('credential-disconnected', handleCredentialDisconnected)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pageshow', handlePageShow)
      window.removeEventListener('credential-disconnected', handleCredentialDisconnected)
    }
  }, [refetchCredentials, effectiveProviderId, provider])
}
```

--------------------------------------------------------------------------------

---[FILE: oauth-required-modal.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/credential-selector/components/oauth-required-modal.tsx
Signals: React

```typescript
'use client'

import { useMemo } from 'react'
import { Check } from 'lucide-react'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/emcn'
import { client } from '@/lib/auth/auth-client'
import { createLogger } from '@/lib/logs/console/logger'
import {
  getProviderIdFromServiceId,
  getServiceIdFromScopes,
  OAUTH_PROVIDERS,
  type OAuthProvider,
  parseProvider,
} from '@/lib/oauth'

const logger = createLogger('OAuthRequiredModal')

export interface OAuthRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  provider: OAuthProvider
  toolName: string
  requiredScopes?: string[]
  serviceId?: string
  newScopes?: string[]
}

const SCOPE_DESCRIPTIONS: Record<string, string> = {
  'https://www.googleapis.com/auth/gmail.send': 'Send emails on your behalf',
  'https://www.googleapis.com/auth/gmail.labels': 'View and manage your email labels',
  'https://www.googleapis.com/auth/gmail.modify': 'View and manage your email messages',
  'https://www.googleapis.com/auth/drive.file': 'View and manage your Google Drive files',
  'https://www.googleapis.com/auth/drive': 'Full access to all your Google Drive files',
  'https://www.googleapis.com/auth/calendar': 'View and manage your calendar',
  'https://www.googleapis.com/auth/userinfo.email': 'View your email address',
  'https://www.googleapis.com/auth/userinfo.profile': 'View your basic profile info',
  'https://www.googleapis.com/auth/forms.responses.readonly': 'View responses to your Google Forms',
  'https://www.googleapis.com/auth/ediscovery': 'Access Google Vault for eDiscovery',
  'https://www.googleapis.com/auth/devstorage.read_only': 'Read files from Google Cloud Storage',
  'https://www.googleapis.com/auth/admin.directory.group': 'Manage Google Workspace groups',
  'https://www.googleapis.com/auth/admin.directory.group.member':
    'Manage Google Workspace group memberships',
  'https://www.googleapis.com/auth/admin.directory.group.readonly': 'View Google Workspace groups',
  'https://www.googleapis.com/auth/admin.directory.group.member.readonly':
    'View Google Workspace group memberships',
  'read:confluence-content.all': 'Read all Confluence content',
  'read:confluence-space.summary': 'Read Confluence space information',
  'read:space:confluence': 'View Confluence spaces',
  'read:space-details:confluence': 'View detailed Confluence space information',
  'write:confluence-content': 'Create and edit Confluence pages',
  'write:confluence-space': 'Manage Confluence spaces',
  'write:confluence-file': 'Upload files to Confluence',
  'read:content:confluence': 'Read Confluence content',
  'read:page:confluence': 'View Confluence pages',
  'write:page:confluence': 'Create and update Confluence pages',
  'read:comment:confluence': 'View comments on Confluence pages',
  'write:comment:confluence': 'Create and update comments',
  'delete:comment:confluence': 'Delete comments from Confluence pages',
  'read:attachment:confluence': 'View attachments on Confluence pages',
  'write:attachment:confluence': 'Upload and manage attachments',
  'delete:attachment:confluence': 'Delete attachments from Confluence pages',
  'delete:page:confluence': 'Delete Confluence pages',
  'read:label:confluence': 'View labels on Confluence content',
  'write:label:confluence': 'Add and remove labels',
  'search:confluence': 'Search Confluence content',
  'readonly:content.attachment:confluence': 'View attachments',
  'read:me': 'Read your profile information',
  'database.read': 'Read your database',
  'database.write': 'Write to your database',
  'projects.read': 'Read your projects',
  offline_access: 'Access your account when you are not using the application',
  repo: 'Access your repositories',
  workflow: 'Manage repository workflows',
  'read:user': 'Read your public user information',
  'user:email': 'Access your email address',
  'tweet.read': 'Read your tweets and timeline',
  'tweet.write': 'Post tweets on your behalf',
  'users.read': 'Read your profile information',
  'offline.access': 'Access your account when you are not using the application',
  'data.records:read': 'Read your records',
  'data.records:write': 'Write to your records',
  'webhook:manage': 'Manage your webhooks',
  'page.read': 'Read your Notion pages',
  'page.write': 'Write to your Notion pages',
  'workspace.content': 'Read your Notion content',
  'workspace.name': 'Read your Notion workspace name',
  'workspace.read': 'Read your Notion workspace',
  'workspace.write': 'Write to your Notion workspace',
  'user.email:read': 'Read your email address',
  'read:jira-user': 'Read your Jira user',
  'read:jira-work': 'Read your Jira work',
  'write:jira-work': 'Write to your Jira work',
  'manage:jira-webhook': 'Register and manage Jira webhooks',
  'read:webhook:jira': 'View Jira webhooks',
  'write:webhook:jira': 'Create and update Jira webhooks',
  'delete:webhook:jira': 'Delete Jira webhooks',
  'read:issue-event:jira': 'Read your Jira issue events',
  'write:issue:jira': 'Write to your Jira issues',
  'read:project:jira': 'Read your Jira projects',
  'read:issue-type:jira': 'Read your Jira issue types',
  'read:issue-meta:jira': 'Read your Jira issue meta',
  'read:issue-security-level:jira': 'Read your Jira issue security level',
  'read:issue.vote:jira': 'Read your Jira issue votes',
  'read:issue.changelog:jira': 'Read your Jira issue changelog',
  'read:avatar:jira': 'Read your Jira avatar',
  'read:issue:jira': 'Read your Jira issues',
  'read:status:jira': 'Read your Jira status',
  'read:user:jira': 'Read your Jira user',
  'read:field-configuration:jira': 'Read your Jira field configuration',
  'read:issue-details:jira': 'Read your Jira issue details',
  'read:field:jira': 'Read Jira field configurations',
  'read:jql:jira': 'Use JQL to filter Jira issues',
  'read:comment.property:jira': 'Read Jira comment properties',
  'read:issue.property:jira': 'Read Jira issue properties',
  'delete:issue:jira': 'Delete Jira issues',
  'write:comment:jira': 'Add and update comments on Jira issues',
  'read:comment:jira': 'Read comments on Jira issues',
  'delete:comment:jira': 'Delete comments from Jira issues',
  'read:attachment:jira': 'Read attachments from Jira issues',
  'delete:attachment:jira': 'Delete attachments from Jira issues',
  'write:issue-worklog:jira': 'Add and update worklog entries on Jira issues',
  'read:issue-worklog:jira': 'Read worklog entries from Jira issues',
  'delete:issue-worklog:jira': 'Delete worklog entries from Jira issues',
  'write:issue-link:jira': 'Create links between Jira issues',
  'delete:issue-link:jira': 'Delete links between Jira issues',
  'User.Read': 'Read your Microsoft user',
  'Chat.Read': 'Read your Microsoft chats',
  'Chat.ReadWrite': 'Write to your Microsoft chats',
  'Chat.ReadBasic': 'Read your Microsoft chats',
  'ChatMessage.Send': 'Send chat messages on your behalf',
  'Channel.ReadBasic.All': 'Read your Microsoft channels',
  'ChannelMessage.Send': 'Write to your Microsoft channels',
  'ChannelMessage.Read.All': 'Read your Microsoft channels',
  'ChannelMessage.ReadWrite': 'Read and write to your Microsoft channels',
  'ChannelMember.Read.All': 'Read team channel members',
  'Group.Read.All': 'Read your Microsoft groups',
  'Group.ReadWrite.All': 'Write to your Microsoft groups',
  'Team.ReadBasic.All': 'Read your Microsoft teams',
  'TeamMember.Read.All': 'Read team members',
  'Mail.ReadWrite': 'Write to your Microsoft emails',
  'Mail.ReadBasic': 'Read your Microsoft emails',
  'Mail.Read': 'Read your Microsoft emails',
  'Mail.Send': 'Send emails on your behalf',
  'Files.Read': 'Read your OneDrive files',
  'Files.ReadWrite': 'Read and write your OneDrive files',
  'Tasks.ReadWrite': 'Read and manage your Planner tasks',
  'Sites.Read.All': 'Read Sharepoint sites',
  'Sites.ReadWrite.All': 'Read and write Sharepoint sites',
  'Sites.Manage.All': 'Manage Sharepoint sites',
  openid: 'Standard authentication',
  profile: 'Access your profile information',
  email: 'Access your email address',
  identify: 'Read your Discord user',
  bot: 'Read your Discord bot',
  'messages.read': 'Read your Discord messages',
  guilds: 'Read your Discord guilds',
  'guilds.members.read': 'Read your Discord guild members',
  identity: 'Access your Reddit identity',
  submit: 'Submit posts and comments on your behalf',
  vote: 'Vote on posts and comments',
  save: 'Save and unsave posts and comments',
  edit: 'Edit your posts and comments',
  subscribe: 'Subscribe and unsubscribe from subreddits',
  history: 'Access your Reddit history',
  privatemessages: 'Access your inbox and send private messages',
  account: 'Update your account preferences and settings',
  mysubreddits: 'Access your subscribed and moderated subreddits',
  flair: 'Manage user and post flair',
  report: 'Report posts and comments for rule violations',
  modposts: 'Approve, remove, and moderate posts in subreddits you moderate',
  modflair: 'Manage flair in subreddits you moderate',
  modmail: 'Access and respond to moderator mail',
  login: 'Access your Wealthbox account',
  data: 'Access your Wealthbox data',
  read: 'Read access to your workspace',
  write: 'Write access to your Linear workspace',
  'channels:read': 'View public channels',
  'channels:history': 'Read channel messages',
  'groups:read': 'View private channels',
  'groups:history': 'Read private messages',
  'chat:write': 'Send messages',
  'chat:write.public': 'Post to public channels',
  'im:write': 'Send direct messages',
  'im:history': 'Read direct message history',
  'im:read': 'View direct message channels',
  'users:read': 'View workspace users',
  'files:write': 'Upload files',
  'files:read': 'Download and read files',
  'canvases:write': 'Create canvas documents',
  'reactions:write': 'Add emoji reactions to messages',
  'sites:read': 'View your Webflow sites',
  'sites:write': 'Manage webhooks and site settings',
  'cms:read': 'View your CMS content',
  'cms:write': 'Manage your CMS content',
  'crm.objects.contacts.read': 'Read your HubSpot contacts',
  'crm.objects.contacts.write': 'Create and update HubSpot contacts',
  'crm.objects.companies.read': 'Read your HubSpot companies',
  'crm.objects.companies.write': 'Create and update HubSpot companies',
  'crm.objects.deals.read': 'Read your HubSpot deals',
  'crm.objects.deals.write': 'Create and update HubSpot deals',
  'crm.objects.owners.read': 'Read HubSpot object owners',
  'crm.objects.users.read': 'Read HubSpot users',
  'crm.objects.users.write': 'Create and update HubSpot users',
  'crm.objects.marketing_events.read': 'Read HubSpot marketing events',
  'crm.objects.marketing_events.write': 'Create and update HubSpot marketing events',
  'crm.objects.line_items.read': 'Read HubSpot line items',
  'crm.objects.line_items.write': 'Create and update HubSpot line items',
  'crm.objects.quotes.read': 'Read HubSpot quotes',
  'crm.objects.quotes.write': 'Create and update HubSpot quotes',
  'crm.objects.appointments.read': 'Read HubSpot appointments',
  'crm.objects.appointments.write': 'Create and update HubSpot appointments',
  'crm.objects.carts.read': 'Read HubSpot shopping carts',
  'crm.objects.carts.write': 'Create and update HubSpot shopping carts',
  'crm.import': 'Import data into HubSpot',
  'crm.lists.read': 'Read HubSpot lists',
  'crm.lists.write': 'Create and update HubSpot lists',
  tickets: 'Manage HubSpot tickets',
  api: 'Access Salesforce API',
  refresh_token: 'Maintain long-term access to your Salesforce account',
  default: 'Access your Asana workspace',
  base: 'Basic access to your Pipedrive account',
  'deals:read': 'Read your Pipedrive deals',
  'deals:full': 'Full access to manage your Pipedrive deals',
  'contacts:read': 'Read your Pipedrive contacts',
  'contacts:full': 'Full access to manage your Pipedrive contacts',
  'leads:read': 'Read your Pipedrive leads',
  'leads:full': 'Full access to manage your Pipedrive leads',
  'activities:read': 'Read your Pipedrive activities',
  'activities:full': 'Full access to manage your Pipedrive activities',
  'mail:read': 'Read your Pipedrive emails',
  'mail:full': 'Full access to manage your Pipedrive emails',
  'projects:read': 'Read your Pipedrive projects',
  'projects:full': 'Full access to manage your Pipedrive projects',
  'webhooks:read': 'Read your Pipedrive webhooks',
  'webhooks:full': 'Full access to manage your Pipedrive webhooks',
  w_member_social: 'Access your LinkedIn profile',
  // Box scopes
  root_readwrite: 'Read and write all files and folders in your Box account',
  root_readonly: 'Read all files and folders in your Box account',
  // Shopify scopes (write_* implicitly includes read access)
  write_products: 'Read and manage your Shopify products',
  write_orders: 'Read and manage your Shopify orders',
  write_customers: 'Read and manage your Shopify customers',
  write_inventory: 'Read and manage your Shopify inventory levels',
  read_locations: 'View your store locations',
  write_merchant_managed_fulfillment_orders: 'Create fulfillments for orders',
  // Zoom scopes
  'user:read:user': 'View your Zoom profile information',
  'meeting:write:meeting': 'Create Zoom meetings',
  'meeting:read:meeting': 'View Zoom meeting details',
  'meeting:read:list_meetings': 'List your Zoom meetings',
  'meeting:update:meeting': 'Update Zoom meetings',
  'meeting:delete:meeting': 'Delete Zoom meetings',
  'meeting:read:invitation': 'View Zoom meeting invitations',
  'meeting:read:list_past_participants': 'View past meeting participants',
  'cloud_recording:read:list_user_recordings': 'List your Zoom cloud recordings',
  'cloud_recording:read:list_recording_files': 'View recording files',
  'cloud_recording:delete:recording_file': 'Delete cloud recordings',
  // Dropbox scopes
  'account_info.read': 'View your Dropbox account information',
  'files.metadata.read': 'View file and folder names, sizes, and dates',
  'files.metadata.write': 'Modify file and folder metadata',
  'files.content.read': 'Download and read your Dropbox files',
  'files.content.write': 'Upload, copy, move, and delete files in your Dropbox',
  'sharing.read': 'View your shared files and folders',
  'sharing.write': 'Share files and folders with others',
  // WordPress.com scopes
  global: 'Full access to manage your WordPress.com sites, posts, pages, media, and settings',
  // Spotify scopes
  'user-read-private': 'View your Spotify account details',
  'user-read-email': 'View your email address on Spotify',
  'user-library-read': 'View your saved tracks and albums',
  'user-library-modify': 'Save and remove tracks and albums from your library',
  'playlist-read-private': 'View your private playlists',
  'playlist-read-collaborative': 'View collaborative playlists you have access to',
  'playlist-modify-public': 'Create and manage your public playlists',
  'playlist-modify-private': 'Create and manage your private playlists',
  'user-read-playback-state': 'View your current playback state',
  'user-modify-playback-state': 'Control playback on your Spotify devices',
  'user-read-currently-playing': 'View your currently playing track',
  'user-read-recently-played': 'View your recently played tracks',
  'user-top-read': 'View your top artists and tracks',
  'user-follow-read': 'View artists and users you follow',
  'user-follow-modify': 'Follow and unfollow artists and users',
  'user-read-playback-position': 'View your playback position in podcasts',
  'ugc-image-upload': 'Upload images to your Spotify playlists',
}

function getScopeDescription(scope: string): string {
  return SCOPE_DESCRIPTIONS[scope] || scope
}

export function OAuthRequiredModal({
  isOpen,
  onClose,
  provider,
  toolName,
  requiredScopes = [],
  serviceId,
  newScopes = [],
}: OAuthRequiredModalProps) {
  const effectiveServiceId = serviceId || getServiceIdFromScopes(provider, requiredScopes)
  const { baseProvider } = parseProvider(provider)
  const baseProviderConfig = OAUTH_PROVIDERS[baseProvider]

  let providerName = baseProviderConfig?.name || provider
  let ProviderIcon = baseProviderConfig?.icon || (() => null)

  if (baseProviderConfig) {
    for (const service of Object.values(baseProviderConfig.services)) {
      if (service.id === effectiveServiceId || service.providerId === provider) {
        providerName = service.name
        ProviderIcon = service.icon
        break
      }
    }
  }

  const newScopesSet = useMemo(
    () =>
      new Set(
        (newScopes || []).filter(
          (scope) => !scope.includes('userinfo.email') && !scope.includes('userinfo.profile')
        )
      ),
    [newScopes]
  )

  const displayScopes = useMemo(() => {
    const filtered = requiredScopes.filter(
      (scope) => !scope.includes('userinfo.email') && !scope.includes('userinfo.profile')
    )
    return filtered.sort((a, b) => {
      const aIsNew = newScopesSet.has(a)
      const bIsNew = newScopesSet.has(b)
      if (aIsNew && !bIsNew) return -1
      if (!aIsNew && bIsNew) return 1
      return 0
    })
  }, [requiredScopes, newScopesSet])

  const handleConnectDirectly = async () => {
    try {
      const providerId = getProviderIdFromServiceId(effectiveServiceId)

      onClose()

      logger.info('Linking OAuth2:', {
        providerId,
        requiredScopes,
      })

      if (providerId === 'trello') {
        window.location.href = '/api/auth/trello/authorize'
        return
      }

      if (providerId === 'shopify') {
        // Pass the current URL so we can redirect back after OAuth
        const returnUrl = encodeURIComponent(window.location.href)
        window.location.href = `/api/auth/shopify/authorize?returnUrl=${returnUrl}`
        return
      }

      await client.oauth2.link({
        providerId,
        callbackURL: window.location.href,
      })
    } catch (error) {
      logger.error('Error initiating OAuth flow:', { error })
    }
  }

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent size='md'>
        <ModalHeader>Connect {providerName}</ModalHeader>
        <ModalBody>
          <div className='flex flex-col gap-[16px]'>
            <div className='flex items-center gap-[14px]'>
              <div className='flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-[8px] bg-[var(--surface-6)]'>
                <ProviderIcon className='h-[18px] w-[18px]' />
              </div>
              <div className='flex-1'>
                <p className='font-medium text-[13px] text-[var(--text-primary)]'>
                  Connect your {providerName} account
                </p>
                <p className='text-[12px] text-[var(--text-tertiary)]'>
                  The "{toolName}" tool requires access to your account
                </p>
              </div>
            </div>

            {displayScopes.length > 0 && (
              <div className='rounded-[8px] border bg-[var(--surface-6)]'>
                <div className='border-b px-[14px] py-[10px]'>
                  <h4 className='font-medium text-[13px] text-[var(--text-primary)]'>
                    Permissions requested
                  </h4>
                </div>
                <ul className='max-h-[330px] space-y-[10px] overflow-y-auto px-[14px] py-[12px]'>
                  {displayScopes.map((scope) => (
                    <li key={scope} className='flex items-start gap-[10px]'>
                      <div className='mt-[3px] flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center'>
                        <Check className='h-[10px] w-[10px] text-[var(--text-primary)]' />
                      </div>
                      <div className='flex-1 text-[12px] text-[var(--text-primary)]'>
                        <span>{getScopeDescription(scope)}</span>
                        {newScopesSet.has(scope) && (
                          <span className='ml-[8px] rounded-[4px] border border-amber-500/30 bg-amber-500/10 px-[6px] py-[2px] text-[10px] text-amber-300'>
                            New
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant='active' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='primary'
            type='button'
            onClick={handleConnectDirectly}
            className='!bg-[var(--brand-tertiary-2)] !text-[var(--text-inverse)] hover:!bg-[var(--brand-tertiary-2)]/90'
          >
            Connect
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: document-selector.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/document-selector/document-selector.tsx
Signals: React

```typescript
'use client'

import { useCallback, useMemo } from 'react'
import { Tooltip } from '@/components/emcn'
import { SelectorCombobox } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/selector-combobox/selector-combobox'
import { useDependsOnGate } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-depends-on-gate'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import type { SubBlockConfig } from '@/blocks/types'
import type { SelectorContext } from '@/hooks/selectors/types'

interface DocumentSelectorProps {
  blockId: string
  subBlock: SubBlockConfig
  disabled?: boolean
  onDocumentSelect?: (documentId: string) => void
  isPreview?: boolean
  previewValue?: string | null
}

export function DocumentSelector({
  blockId,
  subBlock,
  disabled = false,
  onDocumentSelect,
  isPreview = false,
  previewValue,
}: DocumentSelectorProps) {
  const { finalDisabled } = useDependsOnGate(blockId, subBlock, { disabled, isPreview })
  const [knowledgeBaseIdValue] = useSubBlockValue(blockId, 'knowledgeBaseId')
  const normalizedKnowledgeBaseId =
    typeof knowledgeBaseIdValue === 'string' && knowledgeBaseIdValue.trim().length > 0
      ? knowledgeBaseIdValue
      : null

  const selectorContext = useMemo<SelectorContext>(
    () => ({
      knowledgeBaseId: normalizedKnowledgeBaseId ?? undefined,
    }),
    [normalizedKnowledgeBaseId]
  )

  const handleDocumentChange = useCallback(
    (documentId: string) => {
      if (isPreview) return
      onDocumentSelect?.(documentId)
    },
    [isPreview, onDocumentSelect]
  )

  const missingKnowledgeBase = !normalizedKnowledgeBaseId
  const isDisabled = finalDisabled || missingKnowledgeBase
  const placeholder = subBlock.placeholder || 'Select document'

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div className='w-full'>
          <SelectorCombobox
            blockId={blockId}
            subBlock={subBlock}
            selectorKey='knowledge.documents'
            selectorContext={selectorContext}
            disabled={isDisabled}
            isPreview={isPreview}
            previewValue={previewValue ?? null}
            placeholder={placeholder}
            onOptionChange={handleDocumentChange}
          />
        </div>
      </Tooltip.Trigger>
      {missingKnowledgeBase && (
        <Tooltip.Content side='top'>
          <p>Select a knowledge base first.</p>
        </Tooltip.Content>
      )}
    </Tooltip.Root>
  )
}
```

--------------------------------------------------------------------------------

````
