---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 339
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 339 of 933)

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

---[FILE: voice-input.tsx]---
Location: sim-main/apps/sim/app/chat/components/input/voice-input.tsx
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic
    webkitSpeechRecognition?: SpeechRecognitionStatic
  }
}

interface VoiceInputProps {
  onVoiceStart: () => void
  isListening?: boolean
  disabled?: boolean
  large?: boolean
  minimal?: boolean
}

export function VoiceInput({
  onVoiceStart,
  isListening = false,
  disabled = false,
  large = false,
  minimal = false,
}: VoiceInputProps) {
  const [isSupported, setIsSupported] = useState(false)

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
  }, [])

  const handleVoiceClick = useCallback(() => {
    if (disabled) return
    onVoiceStart()
  }, [disabled, onVoiceStart])

  if (!isSupported) {
    return null
  }

  if (minimal) {
    return (
      <button
        type='button'
        onClick={handleVoiceClick}
        disabled={disabled}
        className={`flex items-center justify-center rounded-full p-1.5 text-gray-600 transition-colors duration-200 hover:bg-gray-100 md:p-2 ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
        title='Start voice conversation'
      >
        <Mic size={16} className='md:h-5 md:w-5' />
      </button>
    )
  }

  if (large) {
    return (
      <div className='flex flex-col items-center'>
        {/* Large Voice Button */}
        <motion.button
          type='button'
          onClick={handleVoiceClick}
          disabled={disabled}
          className={`flex items-center justify-center rounded-full border-2 p-6 transition-all duration-200 ${
            isListening
              ? 'border-red-400 bg-red-500/20 text-red-600 hover:bg-red-500/30'
              : 'border-blue-300 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title='Start voice conversation'
        >
          <Mic size={32} />
        </motion.button>
      </div>
    )
  }

  return (
    <div className='flex items-center'>
      {/* Voice Button - Now matches send button styling */}
      <motion.button
        type='button'
        onClick={handleVoiceClick}
        disabled={disabled}
        className={`flex items-center justify-center rounded-full p-2.5 transition-all duration-200 md:p-3 ${
          isListening
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-black text-white hover:bg-zinc-700'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title='Start voice conversation'
      >
        <Mic size={16} className='md:hidden' />
        <Mic size={18} className='hidden md:block' />
      </motion.button>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: loading-state.tsx]---
Location: sim-main/apps/sim/app/chat/components/loading-state/loading-state.tsx

```typescript
'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function ChatLoadingState() {
  return (
    <div className='bg-white'>
      <div className='flex min-h-[calc(100vh-120px)] items-center justify-center px-4'>
        <div className='w-full max-w-[410px]'>
          <div className='flex flex-col items-center justify-center'>
            {/* Title skeleton */}
            <div className='space-y-2 text-center'>
              <Skeleton className='mx-auto h-8 w-32' />
              <Skeleton className='mx-auto h-4 w-48' />
            </div>

            {/* Form skeleton */}
            <div className='mt-8 w-full space-y-8'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-10 w-full rounded-[10px]' />
              </div>
              <Skeleton className='h-10 w-full rounded-[10px]' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: message.tsx]---
Location: sim-main/apps/sim/app/chat/components/message/message.tsx
Signals: React

```typescript
'use client'

import { memo, useMemo, useState } from 'react'
import { Check, Copy, File as FileIcon, FileText, Image as ImageIcon } from 'lucide-react'
import { Tooltip } from '@/components/emcn'
import {
  ChatFileDownload,
  ChatFileDownloadAll,
} from '@/app/chat/components/message/components/file-download'
import MarkdownRenderer from '@/app/chat/components/message/components/markdown-renderer'

export interface ChatAttachment {
  id: string
  name: string
  type: string
  dataUrl: string
  size?: number
}

export interface ChatFile {
  id: string
  name: string
  url: string
  key: string
  size: number
  type: string
  context?: string
}

export interface ChatMessage {
  id: string
  content: string | Record<string, unknown>
  type: 'user' | 'assistant'
  timestamp: Date
  isInitialMessage?: boolean
  isStreaming?: boolean
  attachments?: ChatAttachment[]
  files?: ChatFile[]
}

function EnhancedMarkdownRenderer({ content }: { content: string }) {
  return <MarkdownRenderer content={content} />
}

export const ClientChatMessage = memo(
  function ClientChatMessage({ message }: { message: ChatMessage }) {
    const [isCopied, setIsCopied] = useState(false)

    const isJsonObject = useMemo(() => {
      return typeof message.content === 'object' && message.content !== null
    }, [message.content])

    // Since tool calls are now handled via SSE events and stored in message.toolCalls,
    // we can use the content directly without parsing
    const cleanTextContent = message.content

    const content =
      message.type === 'user' ? (
        <div className='px-4 py-5' data-message-id={message.id}>
          <div className='mx-auto max-w-3xl'>
            {/* File attachments displayed above the message */}
            {message.attachments && message.attachments.length > 0 && (
              <div className='mb-2 flex justify-end'>
                <div className='flex flex-wrap gap-2'>
                  {message.attachments.map((attachment) => {
                    const isImage = attachment.type.startsWith('image/')
                    const getFileIcon = (type: string) => {
                      if (type.includes('pdf'))
                        return (
                          <FileText className='h-5 w-5 text-gray-500 md:h-6 md:w-6 dark:text-gray-400' />
                        )
                      if (type.startsWith('image/'))
                        return (
                          <ImageIcon className='h-5 w-5 text-gray-500 md:h-6 md:w-6 dark:text-gray-400' />
                        )
                      if (type.includes('text') || type.includes('json'))
                        return (
                          <FileText className='h-5 w-5 text-gray-500 md:h-6 md:w-6 dark:text-gray-400' />
                        )
                      return (
                        <FileIcon className='h-5 w-5 text-gray-500 md:h-6 md:w-6 dark:text-gray-400' />
                      )
                    }
                    const formatFileSize = (bytes?: number) => {
                      if (!bytes || bytes === 0) return ''
                      const k = 1024
                      const sizes = ['B', 'KB', 'MB', 'GB']
                      const i = Math.floor(Math.log(bytes) / Math.log(k))
                      return `${Math.round((bytes / k ** i) * 10) / 10} ${sizes[i]}`
                    }

                    return (
                      <div
                        key={attachment.id}
                        className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 ${
                          attachment.dataUrl?.trim() && attachment.dataUrl.startsWith('data:')
                            ? 'cursor-pointer'
                            : ''
                        } ${
                          isImage
                            ? 'h-16 w-16 md:h-20 md:w-20'
                            : 'flex h-16 min-w-[140px] max-w-[220px] items-center gap-2 px-3 md:h-20 md:min-w-[160px] md:max-w-[240px]'
                        }`}
                        onClick={(e) => {
                          const validDataUrl = attachment.dataUrl?.trim()
                          if (validDataUrl?.startsWith('data:')) {
                            e.preventDefault()
                            e.stopPropagation()
                            const newWindow = window.open('', '_blank')
                            if (newWindow) {
                              newWindow.document.write(`
                                <!DOCTYPE html>
                                <html>
                                  <head>
                                    <title>${attachment.name}</title>
                                    <style>
                                      body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #000; }
                                      img { max-width: 100%; max-height: 100vh; object-fit: contain; }
                                    </style>
                                  </head>
                                  <body>
                                    <img src="${validDataUrl}" alt="${attachment.name}" />
                                  </body>
                                </html>
                              `)
                              newWindow.document.close()
                            }
                          }
                        }}
                      >
                        {isImage &&
                        attachment.dataUrl?.trim() &&
                        attachment.dataUrl.startsWith('data:') ? (
                          <img
                            src={attachment.dataUrl}
                            alt={attachment.name}
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <>
                            <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-100 md:h-12 md:w-12 dark:bg-gray-700'>
                              {getFileIcon(attachment.type)}
                            </div>
                            <div className='min-w-0 flex-1'>
                              <div className='truncate font-medium text-gray-800 text-xs md:text-sm dark:text-gray-200'>
                                {attachment.name}
                              </div>
                              {attachment.size && (
                                <div className='text-[10px] text-gray-500 md:text-xs dark:text-gray-400'>
                                  {formatFileSize(attachment.size)}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Only render message bubble if there's actual text content (not just file count message) */}
            {message.content && !String(message.content).startsWith('Sent') && (
              <div className='flex justify-end'>
                <div className='max-w-[80%] rounded-3xl bg-[#F4F4F4] px-4 py-3 dark:bg-gray-600'>
                  <div className='whitespace-pre-wrap break-words text-base text-gray-800 leading-relaxed dark:text-gray-100'>
                    {isJsonObject ? (
                      <pre>{JSON.stringify(message.content, null, 2)}</pre>
                    ) : (
                      <span>{message.content as string}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='px-4 pt-5 pb-2' data-message-id={message.id}>
          <div className='mx-auto max-w-3xl'>
            <div className='flex flex-col space-y-3'>
              {/* Direct content rendering - tool calls are now handled via SSE events */}
              <div>
                <div className='break-words text-base'>
                  {isJsonObject ? (
                    <pre className='text-gray-800 dark:text-gray-100'>
                      {JSON.stringify(cleanTextContent, null, 2)}
                    </pre>
                  ) : (
                    <EnhancedMarkdownRenderer content={cleanTextContent as string} />
                  )}
                </div>
              </div>
              {message.files && message.files.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {message.files.map((file) => (
                    <ChatFileDownload key={file.id} file={file} />
                  ))}
                </div>
              )}
              {message.type === 'assistant' && !isJsonObject && !message.isInitialMessage && (
                <div className='flex items-center justify-start space-x-2'>
                  {/* Copy Button - Only show when not streaming */}
                  {!message.isStreaming && (
                    <Tooltip.Root delayDuration={300}>
                      <Tooltip.Trigger asChild>
                        <button
                          className='text-muted-foreground transition-colors hover:bg-muted'
                          onClick={() => {
                            const contentToCopy =
                              typeof cleanTextContent === 'string'
                                ? cleanTextContent
                                : JSON.stringify(cleanTextContent, null, 2)
                            navigator.clipboard.writeText(contentToCopy)
                            setIsCopied(true)
                            setTimeout(() => setIsCopied(false), 2000)
                          }}
                        >
                          {isCopied ? (
                            <Check className='h-3 w-3' strokeWidth={2} />
                          ) : (
                            <Copy className='h-3 w-3' strokeWidth={2} />
                          )}
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content side='top' align='center' sideOffset={5}>
                        {isCopied ? 'Copied!' : 'Copy to clipboard'}
                      </Tooltip.Content>
                    </Tooltip.Root>
                  )}
                  {/* Download All Button - Only show when there are files */}
                  {!message.isStreaming && message.files && (
                    <ChatFileDownloadAll files={message.files} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )

    return <Tooltip.Provider>{content}</Tooltip.Provider>
  },
  (prevProps, nextProps) => {
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.content === nextProps.message.content &&
      prevProps.message.isStreaming === nextProps.message.isStreaming &&
      prevProps.message.isInitialMessage === nextProps.message.isInitialMessage &&
      prevProps.message.files?.length === nextProps.message.files?.length
    )
  }
)
```

--------------------------------------------------------------------------------

---[FILE: file-download.tsx]---
Location: sim-main/apps/sim/app/chat/components/message/components/file-download.tsx
Signals: React

```typescript
'use client'

import { useState } from 'react'
import { ArrowDown, Download, Loader2, Music } from 'lucide-react'
import { Button } from '@/components/emcn'
import { DefaultFileIcon, getDocumentIcon } from '@/components/icons/document-icons'
import { createLogger } from '@/lib/logs/console/logger'
import type { ChatFile } from '@/app/chat/components/message/message'

const logger = createLogger('ChatFileDownload')

interface ChatFileDownloadProps {
  file: ChatFile
}

interface ChatFileDownloadAllProps {
  files: ChatFile[]
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Math.round((bytes / k ** i) * 10) / 10} ${sizes[i]}`
}

function isAudioFile(mimeType: string, filename: string): boolean {
  const audioMimeTypes = [
    'audio/mpeg',
    'audio/wav',
    'audio/mp3',
    'audio/ogg',
    'audio/webm',
    'audio/aac',
    'audio/flac',
  ]
  const audioExtensions = ['mp3', 'wav', 'ogg', 'webm', 'aac', 'flac', 'm4a']
  const extension = filename.split('.').pop()?.toLowerCase()

  return (
    audioMimeTypes.some((t) => mimeType.includes(t)) ||
    (extension ? audioExtensions.includes(extension) : false)
  )
}

function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

function getFileUrl(file: ChatFile): string {
  return `/api/files/serve/${encodeURIComponent(file.key)}?context=${file.context || 'execution'}`
}

async function triggerDownload(url: string, filename: string): Promise<void> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`)
  }

  const blob = await response.blob()
  const blobUrl = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(blobUrl)
  logger.info(`Downloaded: ${filename}`)
}

export function ChatFileDownload({ file }: ChatFileDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleDownload = async () => {
    if (isDownloading) return

    setIsDownloading(true)

    try {
      logger.info(`Initiating download for file: ${file.name}`)
      const url = getFileUrl(file)
      await triggerDownload(url, file.name)
    } catch (error) {
      logger.error(`Failed to download file ${file.name}:`, error)
      if (file.url) {
        window.open(file.url, '_blank')
      }
    } finally {
      setIsDownloading(false)
    }
  }

  const renderIcon = () => {
    if (isAudioFile(file.type, file.name)) {
      return <Music className='h-4 w-4 text-purple-500' />
    }
    if (isImageFile(file.type)) {
      const ImageIcon = DefaultFileIcon
      return <ImageIcon className='h-5 w-5' />
    }
    const DocumentIcon = getDocumentIcon(file.type, file.name)
    return <DocumentIcon className='h-5 w-5' />
  }

  return (
    <Button
      variant='default'
      onClick={handleDownload}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isDownloading}
      className='flex h-auto w-[200px] items-center gap-2 rounded-lg px-3 py-2'
    >
      <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center'>{renderIcon()}</div>
      <div className='min-w-0 flex-1 text-left'>
        <div className='w-[100px] truncate text-xs'>{file.name}</div>
        <div className='text-[10px] text-[var(--text-muted)]'>{formatFileSize(file.size)}</div>
      </div>
      <div className='flex-shrink-0'>
        {isDownloading ? (
          <Loader2 className='h-3.5 w-3.5 animate-spin' />
        ) : (
          <ArrowDown
            className={`h-3.5 w-3.5 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
    </Button>
  )
}

export function ChatFileDownloadAll({ files }: ChatFileDownloadAllProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  if (!files || files.length === 0) return null

  const handleDownloadAll = async () => {
    if (isDownloading) return

    setIsDownloading(true)

    try {
      logger.info(`Initiating download for ${files.length} files`)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        try {
          const url = getFileUrl(file)
          await triggerDownload(url, file.name)
          logger.info(`Downloaded file ${i + 1}/${files.length}: ${file.name}`)

          if (i < files.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 150))
          }
        } catch (error) {
          logger.error(`Failed to download file ${file.name}:`, error)
        }
      }
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownloadAll}
      disabled={isDownloading}
      className='text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50'
    >
      {isDownloading ? (
        <Loader2 className='h-3 w-3 animate-spin' strokeWidth={2} />
      ) : (
        <Download className='h-3 w-3' strokeWidth={2} />
      )}
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: markdown-renderer.tsx]---
Location: sim-main/apps/sim/app/chat/components/message/components/markdown-renderer.tsx
Signals: React

```typescript
import React, { type HTMLAttributes, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Tooltip } from '@/components/emcn'

export function LinkWithPreview({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Tooltip.Root delayDuration={300}>
      <Tooltip.Trigger asChild>
        <a
          href={href}
          className='text-blue-600 hover:underline dark:text-blue-400'
          target='_blank'
          rel='noopener noreferrer'
        >
          {children}
        </a>
      </Tooltip.Trigger>
      <Tooltip.Content side='top' align='center' sideOffset={5} className='max-w-sm p-3'>
        <span className='truncate font-medium text-xs'>{href}</span>
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

export default function MarkdownRenderer({
  content,
  customLinkComponent,
}: {
  content: string
  customLinkComponent?: typeof LinkWithPreview
}) {
  const LinkComponent = customLinkComponent || LinkWithPreview

  const customComponents = {
    // Paragraph
    p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className='mb-1 font-sans text-base text-gray-800 leading-relaxed last:mb-0 dark:text-gray-200'>
        {children}
      </p>
    ),

    // Headings
    h1: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className='mt-10 mb-5 font-sans font-semibold text-2xl text-gray-900 dark:text-gray-100'>
        {children}
      </h1>
    ),
    h2: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className='mt-8 mb-4 font-sans font-semibold text-gray-900 text-xl dark:text-gray-100'>
        {children}
      </h2>
    ),
    h3: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className='mt-7 mb-3 font-sans font-semibold text-gray-900 text-lg dark:text-gray-100'>
        {children}
      </h3>
    ),
    h4: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4 className='mt-5 mb-2 font-sans font-semibold text-base text-gray-900 dark:text-gray-100'>
        {children}
      </h4>
    ),

    // Lists
    ul: ({ children }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul
        className='mt-1 mb-1 space-y-1 pl-6 font-sans text-gray-800 dark:text-gray-200'
        style={{ listStyleType: 'disc' }}
      >
        {children}
      </ul>
    ),
    ol: ({ children }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol
        className='mt-1 mb-1 space-y-1 pl-6 font-sans text-gray-800 dark:text-gray-200'
        style={{ listStyleType: 'decimal' }}
      >
        {children}
      </ol>
    ),
    li: ({
      children,
      ordered,
      ...props
    }: React.LiHTMLAttributes<HTMLLIElement> & { ordered?: boolean }) => (
      <li className='font-sans text-gray-800 dark:text-gray-200' style={{ display: 'list-item' }}>
        {children}
      </li>
    ),

    // Code blocks
    pre: ({ children }: HTMLAttributes<HTMLPreElement>) => {
      let codeProps: HTMLAttributes<HTMLElement> = {}
      let codeContent: ReactNode = children

      if (
        React.isValidElement<{ className?: string; children?: ReactNode }>(children) &&
        children.type === 'code'
      ) {
        const childElement = children as React.ReactElement<{
          className?: string
          children?: ReactNode
        }>
        codeProps = { className: childElement.props.className }
        codeContent = childElement.props.children
      }

      return (
        <div className='my-6 rounded-md bg-gray-900 text-sm dark:bg-black'>
          <div className='flex items-center justify-between border-gray-700 border-b px-4 py-1.5 dark:border-gray-800'>
            <span className='font-sans text-gray-400 text-xs'>
              {codeProps.className?.replace('language-', '') || 'code'}
            </span>
          </div>
          <pre className='overflow-x-auto p-4 font-mono text-gray-200 dark:text-gray-100'>
            {codeContent}
          </pre>
        </div>
      )
    },

    // Inline code
    code: ({
      inline,
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLElement> & { className?: string; inline?: boolean }) => {
      if (inline) {
        return (
          <code
            className='rounded bg-gray-200 px-1 py-0.5 font-mono text-[0.9em] text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            {...props}
          >
            {children}
          </code>
        )
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },

    // Blockquotes
    blockquote: ({ children }: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote className='my-4 border-gray-300 border-l-4 py-1 pl-4 font-sans text-gray-700 italic dark:border-gray-600 dark:text-gray-300'>
        {children}
      </blockquote>
    ),

    // Horizontal rule
    hr: () => <hr className='my-8 border-gray-500/[.07] border-t dark:border-gray-400/[.07]' />,

    // Links
    a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <LinkComponent href={href || '#'} {...props}>
        {children}
      </LinkComponent>
    ),

    // Tables
    table: ({ children }: React.TableHTMLAttributes<HTMLTableElement>) => (
      <div className='my-4 w-full overflow-x-auto'>
        <table className='min-w-full table-auto border border-gray-300 font-sans text-sm dark:border-gray-700'>
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className='bg-gray-100 text-left dark:bg-gray-800'>{children}</thead>
    ),
    tbody: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900'>
        {children}
      </tbody>
    ),
    tr: ({ children }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr className='border-gray-200 border-b transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/60'>
        {children}
      </tr>
    ),
    th: ({ children }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
      <th className='border-gray-300 border-r px-4 py-2 font-medium text-gray-700 last:border-r-0 dark:border-gray-700 dark:text-gray-300'>
        {children}
      </th>
    ),
    td: ({ children }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
      <td className='break-words border-gray-300 border-r px-4 py-2 text-gray-800 last:border-r-0 dark:border-gray-700 dark:text-gray-200'>
        {children}
      </td>
    ),

    // Images
    img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img
        src={src}
        alt={alt || 'Image'}
        className='my-3 h-auto max-w-full rounded-md'
        {...props}
      />
    ),
  }

  // Pre-process content to fix common issues
  const processedContent = content.trim()

  return (
    <div className='space-y-4 break-words font-sans text-[#0D0D0D] text-base leading-relaxed dark:text-gray-100'>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: message-container.tsx]---
Location: sim-main/apps/sim/app/chat/components/message-container/message-container.tsx
Signals: React

```typescript
'use client'

import { memo, type RefObject } from 'react'
import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type ChatMessage, ClientChatMessage } from '@/app/chat/components/message/message'

interface ChatMessageContainerProps {
  messages: ChatMessage[]
  isLoading: boolean
  showScrollButton: boolean
  messagesContainerRef: RefObject<HTMLDivElement>
  messagesEndRef: RefObject<HTMLDivElement>
  scrollToBottom: () => void
  scrollToMessage?: (messageId: string) => void
  chatConfig: {
    description?: string
  } | null
}

export const ChatMessageContainer = memo(function ChatMessageContainer({
  messages,
  isLoading,
  showScrollButton,
  messagesContainerRef,
  messagesEndRef,
  scrollToBottom,
  scrollToMessage,
  chatConfig,
}: ChatMessageContainerProps) {
  return (
    <div className='relative flex flex-1 flex-col overflow-hidden bg-white'>
      <style jsx>{`
        @keyframes growShrink {
          0%,
          100% {
            transform: scale(0.9);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .loading-dot {
          animation: growShrink 1.5s infinite ease-in-out;
        }
      `}</style>

      {/* Scrollable Messages Area */}
      <div
        ref={messagesContainerRef}
        className='absolute inset-0 touch-pan-y overflow-y-auto overscroll-auto scroll-smooth'
      >
        <div className='mx-auto max-w-3xl px-4 pt-10 pb-20'>
          {messages.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10'>
              <div className='space-y-2 text-center'>
                <h3 className='font-medium text-lg'>How can I help you today?</h3>
                <p className='text-muted-foreground text-sm'>
                  {chatConfig?.description || 'Ask me anything.'}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => <ClientChatMessage key={message.id} message={message} />)
          )}

          {/* Loading indicator (shows only when executing) */}
          {isLoading && (
            <div className='px-4 py-5'>
              <div className='mx-auto max-w-3xl'>
                <div className='flex'>
                  <div className='max-w-[80%]'>
                    <div className='flex h-6 items-center'>
                      <div className='loading-dot h-3 w-3 rounded-full bg-gray-800 dark:bg-gray-300' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* End of messages marker for scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button - appears when user scrolls up */}
      {showScrollButton && (
        <div className='-translate-x-1/2 absolute bottom-16 left-1/2 z-20 transform'>
          <Button
            onClick={scrollToBottom}
            size='sm'
            variant='outline'
            className='flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-lg transition-all hover:bg-gray-50'
          >
            <ArrowDown className='h-3.5 w-3.5' />
            <span className='sr-only'>Scroll to bottom</span>
          </Button>
        </div>
      )}
    </div>
  )
})
```

--------------------------------------------------------------------------------

````
