---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 425
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 425 of 933)

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

---[FILE: mcp-tools-list.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tool-input/components/mcp-tools-list.tsx
Signals: React

```typescript
import type React from 'react'
import { PopoverSection } from '@/components/emcn'
import { ToolCommand } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tool-input/components/tool-command/tool-command'

const IconComponent = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  if (!Icon) return null
  return <Icon className={className} />
}

interface McpTool {
  id: string
  name: string
  description?: string
  serverId: string
  serverName: string
  icon: React.ComponentType<any>
  bgColor: string
  inputSchema?: any
}

interface McpServer {
  id: string
  url?: string
}

interface StoredTool {
  type: 'mcp'
  title: string
  toolId: string
  params: {
    serverId: string
    serverUrl?: string
    toolName: string
    serverName: string
  }
  isExpanded: boolean
  usageControl: 'auto'
  schema?: any
}

interface McpToolsListProps {
  mcpTools: McpTool[]
  mcpServers?: McpServer[]
  searchQuery: string
  customFilter: (name: string, query: string) => number
  onToolSelect: (tool: StoredTool) => void
  disabled?: boolean
}

/**
 * Displays a filtered list of MCP tools with proper section header and separator
 */
export function McpToolsList({
  mcpTools,
  mcpServers = [],
  searchQuery,
  customFilter,
  onToolSelect,
  disabled = false,
}: McpToolsListProps) {
  const filteredTools = mcpTools.filter((tool) => customFilter(tool.name, searchQuery || '') > 0)

  if (filteredTools.length === 0) {
    return null
  }

  return (
    <>
      <PopoverSection>MCP Tools</PopoverSection>
      {filteredTools.map((mcpTool) => {
        const server = mcpServers.find((s) => s.id === mcpTool.serverId)
        return (
          <ToolCommand.Item
            key={mcpTool.id}
            value={mcpTool.name}
            onSelect={() => {
              if (disabled) return

              const newTool: StoredTool = {
                type: 'mcp',
                title: mcpTool.name,
                toolId: mcpTool.id,
                params: {
                  serverId: mcpTool.serverId,
                  serverUrl: server?.url,
                  toolName: mcpTool.name,
                  serverName: mcpTool.serverName,
                },
                isExpanded: true,
                usageControl: 'auto',
                schema: {
                  ...mcpTool.inputSchema,
                  description: mcpTool.description,
                },
              }

              onToolSelect(newTool)
            }}
          >
            <div
              className='flex h-[15px] w-[15px] flex-shrink-0 items-center justify-center rounded'
              style={{ background: mcpTool.bgColor }}
            >
              <IconComponent icon={mcpTool.icon} className='h-[11px] w-[11px] text-white' />
            </div>
            <span className='truncate' title={`${mcpTool.name} (${mcpTool.serverName})`}>
              {mcpTool.name}
            </span>
          </ToolCommand.Item>
        )
      })}
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: tool-credential-selector.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tool-input/components/tool-credential-selector.tsx
Signals: React

```typescript
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Button, Combobox } from '@/components/emcn/components'
import {
  getCanonicalScopesForProvider,
  getProviderIdFromServiceId,
  getServiceIdFromScopes,
  OAUTH_PROVIDERS,
  type OAuthProvider,
  type OAuthService,
  parseProvider,
} from '@/lib/oauth'
import { OAuthRequiredModal } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/credential-selector/components/oauth-required-modal'
import { useOAuthCredentialDetail, useOAuthCredentials } from '@/hooks/queries/oauth-credentials'
import { getMissingRequiredScopes } from '@/hooks/use-oauth-scope-status'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

const getProviderIcon = (providerName: OAuthProvider) => {
  const { baseProvider } = parseProvider(providerName)
  const baseProviderConfig = OAUTH_PROVIDERS[baseProvider]

  if (!baseProviderConfig) {
    return <ExternalLink className='h-3 w-3' />
  }
  return baseProviderConfig.icon({ className: 'h-3 w-3' })
}

const getProviderName = (providerName: OAuthProvider) => {
  const { baseProvider } = parseProvider(providerName)
  const baseProviderConfig = OAUTH_PROVIDERS[baseProvider]

  if (baseProviderConfig) {
    return baseProviderConfig.name
  }

  return providerName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

interface ToolCredentialSelectorProps {
  value: string
  onChange: (value: string) => void
  provider: OAuthProvider
  requiredScopes?: string[]
  label?: string
  serviceId?: OAuthService
  disabled?: boolean
}

export function ToolCredentialSelector({
  value,
  onChange,
  provider,
  requiredScopes = [],
  label = 'Select account',
  serviceId,
  disabled = false,
}: ToolCredentialSelectorProps) {
  const [showOAuthModal, setShowOAuthModal] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const { activeWorkflowId } = useWorkflowRegistry()

  const selectedId = value || ''

  const effectiveServiceId = useMemo(
    () => serviceId || getServiceIdFromScopes(provider, requiredScopes),
    [provider, requiredScopes, serviceId]
  )

  const effectiveProviderId = useMemo(
    () => getProviderIdFromServiceId(effectiveServiceId),
    [effectiveServiceId]
  )

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
    Boolean(selectedId) &&
    !selectedCredential &&
    !hasForeignMeta &&
    !credentialsLoading &&
    !foreignMetaLoading

  useEffect(() => {
    if (!invalidSelection) return
    onChange('')
  }, [invalidSelection, onChange])

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
    hasSelection && missingRequiredScopes.length > 0 && !disabled && !credentialsLoading

  const handleSelect = useCallback(
    (credentialId: string) => {
      onChange(credentialId)
      setIsEditing(false)
    },
    [onChange]
  )

  const handleAddCredential = useCallback(() => {
    setShowOAuthModal(true)
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
  }, [credentials, provider])

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
  }, [inputValue, selectedCredentialProvider])

  const handleComboboxChange = useCallback(
    (newValue: string) => {
      if (newValue === '__connect_account__') {
        handleAddCredential()
        return
      }

      const matchedCred = credentials.find((c) => c.id === newValue)
      if (matchedCred) {
        setInputValue(matchedCred.name)
        handleSelect(newValue)
        return
      }

      setIsEditing(true)
      setInputValue(newValue)
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
        placeholder={label}
        disabled={disabled}
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
          serviceId={effectiveServiceId}
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

---[FILE: code-editor.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tool-input/components/code-editor/code-editor.tsx
Signals: React

```typescript
import type { ReactElement } from 'react'
import { useEffect, useRef, useState } from 'react'
import 'prismjs/components/prism-json'
import { Wand2 } from 'lucide-react'
import Editor from 'react-simple-code-editor'
import {
  CODE_LINE_HEIGHT_PX,
  Code,
  calculateGutterWidth,
  getCodeEditorProps,
  highlight,
  languages,
} from '@/components/emcn'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/core/utils/cn'
import {
  createEnvVarPattern,
  createWorkflowVariablePattern,
} from '@/executor/utils/reference-validation'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: 'javascript' | 'json'
  placeholder?: string
  className?: string
  gutterClassName?: string
  minHeight?: string
  highlightVariables?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
  disabled?: boolean
  schemaParameters?: Array<{ name: string; type: string; description: string; required: boolean }>
  showWandButton?: boolean
  onWandClick?: () => void
  wandButtonDisabled?: boolean
}

export function CodeEditor({
  value,
  onChange,
  language,
  placeholder = '',
  className = '',
  gutterClassName = '',
  minHeight = '360px',
  highlightVariables = true,
  onKeyDown,
  disabled = false,
  schemaParameters = [],
  showWandButton = false,
  onWandClick,
  wandButtonDisabled = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(value)
  const [visualLineHeights, setVisualLineHeights] = useState<number[]>([])

  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCode(value)
  }, [value])

  useEffect(() => {
    if (!editorRef.current) return

    const calculateVisualLines = () => {
      const preElement = editorRef.current?.querySelector('pre')
      if (!preElement) return

      const lines = code.split('\n')
      const newVisualLineHeights: number[] = []

      const container = document.createElement('div')
      container.style.cssText = `
        position: absolute;
        visibility: hidden;
        width: ${preElement.clientWidth}px;
        font-family: ${window.getComputedStyle(preElement).fontFamily};
        font-size: ${window.getComputedStyle(preElement).fontSize};
        padding: 12px;
        white-space: pre-wrap;
        word-break: break-word;
      `
      document.body.appendChild(container)

      lines.forEach((line) => {
        const lineDiv = document.createElement('div')
        lineDiv.textContent = line || ' '
        container.appendChild(lineDiv)
        const actualHeight = lineDiv.getBoundingClientRect().height
        const lineUnits = Math.ceil(actualHeight / CODE_LINE_HEIGHT_PX)
        newVisualLineHeights.push(lineUnits)
        container.removeChild(lineDiv)
      })

      document.body.removeChild(container)
      setVisualLineHeights(newVisualLineHeights)
    }

    const resizeObserver = new ResizeObserver(calculateVisualLines)
    resizeObserver.observe(editorRef.current)

    return () => resizeObserver.disconnect()
  }, [code])

  const lineCount = code.split('\n').length
  const gutterWidth = calculateGutterWidth(lineCount)

  const renderLineNumbers = () => {
    const numbers: ReactElement[] = []
    let lineNumber = 1

    visualLineHeights.forEach((height) => {
      for (let i = 0; i < height; i++) {
        numbers.push(
          <div
            key={`${lineNumber}-${i}`}
            className={cn(
              'text-xs tabular-nums',
              `leading-[${CODE_LINE_HEIGHT_PX}px]`,
              i > 0 ? 'invisible' : 'text-[#a8a8a8]'
            )}
          >
            {lineNumber}
          </div>
        )
      }
      lineNumber++
    })

    return numbers
  }

  const customHighlight = (code: string) => {
    if (!highlightVariables || language !== 'javascript') {
      return highlight(code, languages[language], language)
    }

    const escapeHtml = (text: string) =>
      text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    const placeholders: Array<{
      placeholder: string
      original: string
      type: 'env' | 'param' | 'variable'
    }> = []
    let processedCode = code

    processedCode = processedCode.replace(createEnvVarPattern(), (match) => {
      const placeholder = `__ENV_VAR_${placeholders.length}__`
      placeholders.push({ placeholder, original: match, type: 'env' })
      return placeholder
    })

    processedCode = processedCode.replace(createWorkflowVariablePattern(), (match) => {
      const placeholder = `__VARIABLE_${placeholders.length}__`
      placeholders.push({ placeholder, original: match, type: 'variable' })
      return placeholder
    })

    if (schemaParameters.length > 0) {
      schemaParameters.forEach((param) => {
        const escapedName = param.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const paramRegex = new RegExp(`\\b(${escapedName})\\b`, 'g')
        processedCode = processedCode.replace(paramRegex, (match) => {
          const placeholder = `__PARAM_${placeholders.length}__`
          placeholders.push({ placeholder, original: match, type: 'param' })
          return placeholder
        })
      })
    }

    let highlighted = highlight(processedCode, languages[language], language)

    placeholders.forEach(({ placeholder, original, type }) => {
      const escapedOriginal = type === 'variable' ? escapeHtml(original) : original
      const replacement =
        type === 'env' || type === 'variable'
          ? `<span style="color: #34B5FF;">${escapedOriginal}</span>`
          : `<span style="color: #34B5FF; font-weight: 500;">${original}</span>`

      highlighted = highlighted.replace(placeholder, replacement)
    })

    return highlighted
  }

  return (
    <Code.Container className={className} style={{ minHeight }}>
      {showWandButton && onWandClick && (
        <Button
          variant='ghost'
          size='icon'
          onClick={onWandClick}
          disabled={wandButtonDisabled}
          aria-label='Generate with AI'
          className='absolute top-2 right-3 z-10 h-8 w-8 rounded-full border border-transparent bg-muted/80 text-muted-foreground opacity-0 shadow-sm transition-all duration-200 hover:border-primary/20 hover:bg-muted hover:text-foreground hover:shadow group-hover:opacity-100'
        >
          <Wand2 className='h-4 w-4' />
        </Button>
      )}

      <Code.Gutter width={gutterWidth} className={gutterClassName}>
        {renderLineNumbers()}
      </Code.Gutter>

      <Code.Content paddingLeft={`${gutterWidth}px`} editorRef={editorRef}>
        <Code.Placeholder gutterWidth={gutterWidth} show={code.length === 0 && !!placeholder}>
          {placeholder}
        </Code.Placeholder>

        <Editor
          value={code}
          onValueChange={(newCode) => {
            setCode(newCode)
            onChange(newCode)
          }}
          onKeyDown={onKeyDown}
          highlight={(code) => customHighlight(code)}
          disabled={disabled}
          {...getCodeEditorProps({ disabled })}
          className={cn(getCodeEditorProps({ disabled }).className, 'h-full')}
          style={{ minHeight }}
          textareaClassName={cn(
            getCodeEditorProps({ disabled }).textareaClassName,
            '!block !h-full !min-h-full'
          )}
        />
      </Code.Content>
    </Code.Container>
  )
}
```

--------------------------------------------------------------------------------

````
