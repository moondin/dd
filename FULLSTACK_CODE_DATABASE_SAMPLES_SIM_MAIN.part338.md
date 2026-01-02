---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 338
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 338 of 933)

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

---[FILE: sso-auth.tsx]---
Location: sim-main/apps/sim/app/chat/components/auth/sso/sso-auth.tsx
Signals: React, Next.js

```typescript
'use client'

import { type KeyboardEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { quickValidateEmail } from '@/lib/messaging/email/validation'
import { inter } from '@/app/_styles/fonts/inter/inter'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import Nav from '@/app/(landing)/components/nav/nav'

const logger = createLogger('SSOAuth')

interface SSOAuthProps {
  identifier: string
  onAuthSuccess: () => void
  title?: string
  primaryColor?: string
}

const validateEmailField = (emailValue: string): string[] => {
  const errors: string[] = []

  if (!emailValue || !emailValue.trim()) {
    errors.push('Email is required.')
    return errors
  }

  const validation = quickValidateEmail(emailValue.trim().toLowerCase())
  if (!validation.isValid) {
    errors.push(validation.reason || 'Please enter a valid email address.')
  }

  return errors
}

export default function SSOAuth({
  identifier,
  onAuthSuccess,
  title = 'chat',
  primaryColor = 'var(--brand-primary-hover-hex)',
}: SSOAuthProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailErrors, setEmailErrors] = useState<string[]>([])
  const [showEmailValidationError, setShowEmailValidationError] = useState(false)
  const [buttonClass, setButtonClass] = useState('auth-button-gradient')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkCustomBrand = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      const brandAccent = computedStyle.getPropertyValue('--brand-accent-hex').trim()

      if (brandAccent && brandAccent !== '#6f3dfa') {
        setButtonClass('auth-button-custom')
      } else {
        setButtonClass('auth-button-gradient')
      }
    }

    checkCustomBrand()

    window.addEventListener('resize', checkCustomBrand)
    const observer = new MutationObserver(checkCustomBrand)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })

    return () => {
      window.removeEventListener('resize', checkCustomBrand)
      observer.disconnect()
    }
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAuthenticate()
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    setShowEmailValidationError(false)
    setEmailErrors([])
  }

  const handleAuthenticate = async () => {
    const emailValidationErrors = validateEmailField(email)
    setEmailErrors(emailValidationErrors)
    setShowEmailValidationError(emailValidationErrors.length > 0)

    if (emailValidationErrors.length > 0) {
      return
    }

    setIsLoading(true)

    try {
      const checkResponse = await fetch(`/api/chat/${identifier}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ email, checkSSOAccess: true }),
      })

      if (!checkResponse.ok) {
        const errorData = await checkResponse.json()
        setEmailErrors([errorData.error || 'Email not authorized for this chat'])
        setShowEmailValidationError(true)
        setIsLoading(false)
        return
      }

      const callbackUrl = `/chat/${identifier}`
      const ssoUrl = `/sso?email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackUrl)}`
      router.push(ssoUrl)
    } catch (error) {
      logger.error('SSO authentication error:', error)
      setEmailErrors(['An error occurred during authentication'])
      setShowEmailValidationError(true)
      setIsLoading(false)
    }
  }

  return (
    <div className='bg-white'>
      <Nav variant='auth' />
      <div className='flex min-h-[calc(100vh-120px)] items-center justify-center px-4'>
        <div className='w-full max-w-[410px]'>
          <div className='flex flex-col items-center justify-center'>
            {/* Header */}
            <div className='space-y-1 text-center'>
              <h1
                className={`${soehne.className} font-medium text-[32px] text-black tracking-tight`}
              >
                SSO Authentication
              </h1>
              <p className={`${inter.className} font-[380] text-[16px] text-muted-foreground`}>
                This chat requires SSO authentication
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAuthenticate()
              }}
              className={`${inter.className} mt-8 w-full space-y-8`}
            >
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='email'>Work Email</Label>
                  </div>
                  <Input
                    id='email'
                    name='email'
                    required
                    type='email'
                    autoCapitalize='none'
                    autoComplete='email'
                    autoCorrect='off'
                    placeholder='Enter your work email'
                    value={email}
                    onChange={handleEmailChange}
                    onKeyDown={handleKeyDown}
                    className={cn(
                      'rounded-[10px] shadow-sm transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
                      showEmailValidationError &&
                        emailErrors.length > 0 &&
                        'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                    )}
                    autoFocus
                  />
                  {showEmailValidationError && emailErrors.length > 0 && (
                    <div className='mt-1 space-y-1 text-red-400 text-xs'>
                      {emailErrors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type='submit'
                className={`${buttonClass} flex w-full items-center justify-center gap-2 rounded-[10px] border font-medium text-[15px] text-white transition-all duration-200`}
                disabled={isLoading}
              >
                {isLoading ? 'Redirecting to SSO...' : 'Continue with SSO'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: markdown-renderer.tsx]---
Location: sim-main/apps/sim/app/chat/components/components/markdown-renderer/markdown-renderer.tsx

```typescript
import ReactMarkdown from 'react-markdown'

export default function MarkdownRenderer({ content }: { content: string }) {
  const customComponents = {
    // Paragraph
    p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className='mt-0.5 mb-1 text-base leading-normal'>{children}</p>
    ),

    // Headings
    h1: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className='mt-3 mb-1 font-semibold text-xl'>{children}</h1>
    ),
    h2: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className='mt-3 mb-1 font-semibold text-lg'>{children}</h2>
    ),
    h3: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className='mt-3 mb-1 font-semibold text-base'>{children}</h3>
    ),
    h4: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4 className='mt-3 mb-1 font-semibold text-sm'>{children}</h4>
    ),

    // Lists
    ul: ({ children }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className='my-1 list-disc space-y-0.5 pl-5'>{children}</ul>
    ),
    ol: ({ children }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className='my-1 list-decimal space-y-0.5 pl-5'>{children}</ol>
    ),
    li: ({ children }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className='text-base'>{children}</li>
    ),

    // Code blocks
    pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => (
      <pre className='my-2 overflow-x-auto rounded-md bg-gray-100 p-3 font-mono text-sm dark:bg-gray-800'>
        {children}
      </pre>
    ),

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
            className='rounded-md bg-gray-100 px-1 py-0.5 font-mono text-[0.9em] dark:bg-gray-800'
            {...props}
          >
            {children}
          </code>
        )
      }

      // Extract language from className (format: language-xxx)
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''

      return (
        <div className='relative'>
          {language && (
            <div className='absolute top-1 right-2 text-gray-500 text-xs dark:text-gray-400'>
              {language}
            </div>
          )}
          <code className={className} {...props}>
            {children}
          </code>
        </div>
      )
    },

    // Blockquotes
    blockquote: ({ children }: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote className='my-2 border-gray-200 border-l-4 py-0 pl-4 text-gray-700 italic dark:border-gray-700 dark:text-gray-300'>
        <div className='flex items-center py-0'>{children}</div>
      </blockquote>
    ),

    // Horizontal rule
    hr: () => <hr className='my-3 border-gray-200 dark:border-gray-700' />,

    // Links
    a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        href={href}
        className='text-blue-600 hover:underline dark:text-blue-400'
        target='_blank'
        rel='noopener noreferrer'
        {...props}
      >
        {children}
      </a>
    ),

    // Tables
    table: ({ children }: React.TableHTMLAttributes<HTMLTableElement>) => (
      <div className='my-2 overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700'>
        <table className='w-full border-collapse'>{children}</table>
      </div>
    ),
    thead: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className='border-gray-200 border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800'>
        {children}
      </thead>
    ),
    tbody: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900'>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60' {...props}>
        {children}
      </tr>
    ),
    th: ({ children }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
      <th className='px-4 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider dark:text-gray-300'>
        {children}
      </th>
    ),
    td: ({ children }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
      <td className='border-0 px-4 py-3 text-sm'>{children}</td>
    ),

    // Images
    img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img
        src={src}
        alt={alt || 'Image'}
        className='my-2 h-auto max-w-full rounded-md'
        {...props}
      />
    ),
  }

  // Process text to clean up unnecessary whitespace and formatting issues
  const processedContent = content
    .replace(/\n{2,}/g, '\n\n') // Replace multiple newlines with exactly double newlines
    .replace(/^(#{1,6})\s+(.+?)\n{2,}/gm, '$1 $2\n') // Reduce space after headings to single newline
    .trim()

  return (
    <div className='text-[#0D0D0D] text-base leading-normal dark:text-gray-100'>
      <ReactMarkdown components={customComponents}>{processedContent}</ReactMarkdown>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: error-state.tsx]---
Location: sim-main/apps/sim/app/chat/components/error-state/error-state.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useBrandConfig } from '@/lib/branding/branding'
import { inter } from '@/app/_styles/fonts/inter/inter'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import Nav from '@/app/(landing)/components/nav/nav'

interface ChatErrorStateProps {
  error: string
  starCount: string
}

export function ChatErrorState({ error, starCount }: ChatErrorStateProps) {
  const router = useRouter()
  const [buttonClass, setButtonClass] = useState('auth-button-gradient')
  const brandConfig = useBrandConfig()

  useEffect(() => {
    // Check if CSS variable has been customized
    const checkCustomBrand = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      const brandAccent = computedStyle.getPropertyValue('--brand-accent-hex').trim()

      // Check if the CSS variable exists and is different from the default
      if (brandAccent && brandAccent !== '#6f3dfa') {
        setButtonClass('auth-button-custom')
      } else {
        setButtonClass('auth-button-gradient')
      }
    }

    checkCustomBrand()

    // Also check on window resize or theme changes
    window.addEventListener('resize', checkCustomBrand)
    const observer = new MutationObserver(checkCustomBrand)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })

    return () => {
      window.removeEventListener('resize', checkCustomBrand)
      observer.disconnect()
    }
  }, [])

  return (
    <div className='min-h-screen bg-white'>
      <Nav variant='auth' />
      <div className='flex min-h-[calc(100vh-120px)] items-center justify-center px-4'>
        <div className='w-full max-w-[410px]'>
          <div className='flex flex-col items-center justify-center'>
            {/* Error content */}
            <div className='space-y-1 text-center'>
              <h1
                className={`${soehne.className} font-medium text-[32px] text-black tracking-tight`}
              >
                Chat Unavailable
              </h1>
              <p className={`${inter.className} font-[380] text-[16px] text-muted-foreground`}>
                {error}
              </p>
            </div>

            {/* Action button - matching login form */}
            <div className='mt-8 w-full'>
              <Button
                type='button'
                onClick={() => router.push('/workspace')}
                className={`${buttonClass} flex w-full items-center justify-center gap-2 rounded-[10px] border font-medium text-[15px] text-white transition-all duration-200`}
              >
                Return to Workspace
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${inter.className} auth-text-muted fixed right-0 bottom-0 left-0 z-50 pb-8 text-center font-[340] text-[13px] leading-relaxed`}
      >
        Need help?{' '}
        <a
          href={`mailto:${brandConfig.supportEmail}`}
          className='auth-link underline-offset-4 transition hover:underline'
        >
          Contact support
        </a>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: header.tsx]---
Location: sim-main/apps/sim/app/chat/components/header/header.tsx
Signals: Next.js

```typescript
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { GithubIcon } from '@/components/icons'
import { useBrandConfig } from '@/lib/branding/branding'
import { inter } from '@/app/_styles/fonts/inter/inter'

interface ChatHeaderProps {
  chatConfig: {
    title?: string
    customizations?: {
      headerText?: string
      logoUrl?: string
      imageUrl?: string
      primaryColor?: string
    }
  } | null
  starCount: string
}

export function ChatHeader({ chatConfig, starCount }: ChatHeaderProps) {
  const brand = useBrandConfig()
  const primaryColor = chatConfig?.customizations?.primaryColor || 'var(--brand-primary-hex)'
  const customImage = chatConfig?.customizations?.imageUrl || chatConfig?.customizations?.logoUrl

  return (
    <nav
      aria-label='Chat navigation'
      className={`flex w-full items-center justify-between px-4 pt-[12px] pb-[21px] sm:px-8 sm:pt-[8.5px] md:px-[44px] md:pt-[16px]`}
    >
      <div className='flex items-center gap-[34px]'>
        <div className='flex items-center gap-3'>
          {customImage && (
            <Image
              src={customImage}
              alt={`${chatConfig?.title || 'Chat'} logo`}
              width={24}
              height={24}
              unoptimized
              className='h-6 w-6 rounded-md object-cover'
            />
          )}
          <h2 className={`${inter.className} font-medium text-[18px] text-foreground`}>
            {chatConfig?.customizations?.headerText || chatConfig?.title || 'Chat'}
          </h2>
        </div>
      </div>

      {!brand.logoUrl && (
        <div className='flex items-center gap-[16px]'>
          <a
            href='https://github.com/simstudioai/sim'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 text-[16px] text-muted-foreground transition-colors hover:text-foreground'
            aria-label={`GitHub repository - ${starCount} stars`}
          >
            <GithubIcon className='h-[16px] w-[16px]' aria-hidden='true' />
            <span className={`${inter.className}`} aria-live='polite'>
              {starCount}
            </span>
          </a>
          {/* Only show Sim logo if no custom branding is set */}

          <Link
            href='https://sim.ai'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Sim home'
          >
            <Image
              src='/logo/b&w/text/small.png'
              alt='Sim - Workflows for LLMs'
              width={29.869884}
              height={14.5656}
              className='h-[14.5656px] w-auto pb-[1px]'
              priority
              loading='eager'
              quality={100}
            />
          </Link>
        </div>
      )}
    </nav>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: input.tsx]---
Location: sim-main/apps/sim/app/chat/components/input/input.tsx
Signals: React

```typescript
'use client'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Paperclip, Send, Square, X } from 'lucide-react'
import { Tooltip } from '@/components/emcn'
import { VoiceInput } from '@/app/chat/components/input/voice-input'

const logger = createLogger('ChatInput')

import { createLogger } from '@/lib/logs/console/logger'

const PLACEHOLDER_MOBILE = 'Enter a message'
const PLACEHOLDER_DESKTOP = 'Enter a message or click the mic to speak'
const MAX_TEXTAREA_HEIGHT = 120 // Max height in pixels (e.g., for about 3-4 lines)
const MAX_TEXTAREA_HEIGHT_MOBILE = 100 // Smaller for mobile

interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
  file: File
  dataUrl?: string
}

export const ChatInput: React.FC<{
  onSubmit?: (value: string, isVoiceInput?: boolean, files?: AttachedFile[]) => void
  isStreaming?: boolean
  onStopStreaming?: () => void
  onVoiceStart?: () => void
  voiceOnly?: boolean
}> = ({ onSubmit, isStreaming = false, onStopStreaming, onVoiceStart, voiceOnly = false }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null) // Ref for the textarea
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [uploadErrors, setUploadErrors] = useState<string[]>([])
  const [dragCounter, setDragCounter] = useState(0)
  const isDragOver = dragCounter > 0

  // Check if speech-to-text is available in the browser
  const isSttAvailable =
    typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  // Function to adjust textarea height
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      const el = textareaRef.current
      el.style.height = 'auto' // Reset height to correctly calculate scrollHeight
      const scrollHeight = el.scrollHeight

      // Use mobile height on mobile devices, desktop height on desktop
      const isMobile = window.innerWidth < 768
      const maxHeight = isMobile ? MAX_TEXTAREA_HEIGHT_MOBILE : MAX_TEXTAREA_HEIGHT

      if (scrollHeight > maxHeight) {
        el.style.height = `${maxHeight}px`
        el.style.overflowY = 'auto'
      } else {
        el.style.height = `${scrollHeight}px`
        el.style.overflowY = 'hidden'
      }
    }
  }

  // Adjust height on input change
  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue])

  // Close the input when clicking outside (only when empty)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        if (!inputValue) {
          setIsActive(false)
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto' // Reset height
            textareaRef.current.style.overflowY = 'hidden' // Ensure overflow is hidden
          }
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [inputValue])

  // Handle focus and initial height when activated
  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus()
      adjustTextareaHeight() // Adjust height when becoming active
    }
  }, [isActive])

  const handleActivate = () => {
    setIsActive(true)
    // Focus is now handled by the useEffect above
  }

  // Handle file selection
  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: AttachedFile[] = []
    const maxSize = 10 * 1024 * 1024 // 10MB limit
    const maxFiles = 15

    for (let i = 0; i < selectedFiles.length; i++) {
      if (attachedFiles.length + newFiles.length >= maxFiles) break

      const file = selectedFiles[i]

      // Check file size
      if (file.size > maxSize) {
        setUploadErrors((prev) => [...prev, `${file.name} is too large (max 10MB)`])
        continue
      }

      // Check for duplicates
      const isDuplicate = attachedFiles.some(
        (existingFile) => existingFile.name === file.name && existingFile.size === file.size
      )
      if (isDuplicate) {
        setUploadErrors((prev) => [...prev, `${file.name} already added`])
        continue
      }

      // Read file as data URL if it's an image
      let dataUrl: string | undefined
      if (file.type.startsWith('image/')) {
        try {
          dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
        } catch (error) {
          logger.error('Error reading file:', error)
        }
      }

      newFiles.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
        dataUrl,
      })
    }

    if (newFiles.length > 0) {
      setAttachedFiles([...attachedFiles, ...newFiles])
      setUploadErrors([]) // Clear errors when files are successfully added
    }
  }

  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles(attachedFiles.filter((f) => f.id !== fileId))
  }

  const handleSubmit = () => {
    if (isStreaming) return
    if (!inputValue.trim() && attachedFiles.length === 0) return
    onSubmit?.(inputValue.trim(), false, attachedFiles) // false = not voice input
    setInputValue('')
    setAttachedFiles([])
    setUploadErrors([]) // Clear errors when sending message
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto' // Reset height after submit
      textareaRef.current.style.overflowY = 'hidden' // Ensure overflow is hidden
    }
    setIsActive(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  // Handle voice start with smooth transition to voice-first mode
  const handleVoiceStart = () => {
    onVoiceStart?.() // This will trigger the voice-first mode transition
  }

  // Voice-only mode interface (for voice-first UI)
  if (voiceOnly) {
    return (
      <Tooltip.Provider>
        <div className='flex items-center justify-center'>
          {/* Voice Input Only */}
          {isSttAvailable && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div>
                  <VoiceInput onVoiceStart={handleVoiceStart} disabled={isStreaming} large={true} />
                </div>
              </Tooltip.Trigger>
              <Tooltip.Content side='top'>
                <p>Start voice conversation</p>
              </Tooltip.Content>
            </Tooltip.Root>
          )}
        </div>
      </Tooltip.Provider>
    )
  }

  return (
    <Tooltip.Provider>
      <div className='fixed right-0 bottom-0 left-0 flex w-full items-center justify-center bg-gradient-to-t from-white to-transparent px-4 pb-4 text-black md:px-0 md:pb-4'>
        <div ref={wrapperRef} className='w-full max-w-3xl md:max-w-[748px]'>
          {/* Error Messages */}
          {uploadErrors.length > 0 && (
            <div className='mb-3'>
              <div className='rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/50 dark:bg-red-950/20'>
                <div className='flex items-start gap-2'>
                  <AlertCircle className='mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400' />
                  <div className='flex-1'>
                    <div className='mb-1 font-medium text-red-800 text-sm dark:text-red-300'>
                      File upload error
                    </div>
                    <div className='space-y-1'>
                      {uploadErrors.map((error, idx) => (
                        <div key={idx} className='text-red-700 text-sm dark:text-red-400'>
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Text Input Area with Controls */}
          <motion.div
            className={`rounded-2xl border shadow-sm transition-all duration-200 md:rounded-3xl ${
              isDragOver
                ? 'border-purple-500 bg-purple-50/50 dark:border-purple-500 dark:bg-purple-950/20'
                : 'border-gray-200 bg-white'
            }`}
            onClick={handleActivate}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onDragEnter={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!isStreaming) {
                setDragCounter((prev) => prev + 1)
              }
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!isStreaming) {
                e.dataTransfer.dropEffect = 'copy'
              }
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragCounter((prev) => Math.max(0, prev - 1))
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragCounter(0)
              if (!isStreaming) {
                handleFileSelect(e.dataTransfer.files)
              }
            }}
          >
            {/* File Previews */}
            {attachedFiles.length > 0 && (
              <div className='mb-2 flex flex-wrap gap-2 px-3 pt-3 md:px-4'>
                {attachedFiles.map((file) => {
                  const formatFileSize = (bytes: number) => {
                    if (bytes === 0) return '0 B'
                    const k = 1024
                    const sizes = ['B', 'KB', 'MB', 'GB']
                    const i = Math.floor(Math.log(bytes) / Math.log(k))
                    return `${Math.round((bytes / k ** i) * 10) / 10} ${sizes[i]}`
                  }

                  return (
                    <div
                      key={file.id}
                      className={`group relative overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${
                        file.dataUrl
                          ? 'h-16 w-16 md:h-20 md:w-20'
                          : 'flex h-16 min-w-[120px] max-w-[200px] items-center gap-2 px-2 md:h-20 md:min-w-[140px] md:max-w-[220px] md:px-3'
                      }`}
                      title=''
                    >
                      {file.dataUrl ? (
                        <img
                          src={file.dataUrl}
                          alt={file.name}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <>
                          <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gray-100 md:h-10 md:w-10 dark:bg-gray-700'>
                            <Paperclip
                              size={16}
                              className='text-gray-500 md:h-5 md:w-5 dark:text-gray-400'
                            />
                          </div>
                          <div className='min-w-0 flex-1'>
                            <div className='truncate font-medium text-gray-800 text-xs dark:text-gray-200'>
                              {file.name}
                            </div>
                            <div className='text-[10px] text-gray-500 dark:text-gray-400'>
                              {formatFileSize(file.size)}
                            </div>
                          </div>
                        </>
                      )}
                      <button
                        type='button'
                        onClick={() => handleRemoveFile(file.id)}
                        className='absolute top-1 right-1 rounded-full bg-gray-800/80 p-1 text-white opacity-0 transition-opacity hover:bg-gray-800/80 hover:text-white group-hover:opacity-100 dark:bg-black/70 dark:hover:bg-black/70 dark:hover:text-white'
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <div className='flex items-center gap-2 p-3 md:p-4'>
              {/* Paperclip Button */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isStreaming || attachedFiles.length >= 15}
                    className='flex items-center justify-center rounded-full p-1.5 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 md:p-2'
                  >
                    <Paperclip size={16} className='md:h-5 md:w-5' />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content side='top'>
                  <p>Attach files</p>
                </Tooltip.Content>
              </Tooltip.Root>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type='file'
                multiple
                accept='.pdf,.csv,.doc,.docx,.txt,.md,.xlsx,.xls,.html,.htm,.pptx,.ppt,.json,.xml,.rtf,image/*'
                onChange={(e) => {
                  handleFileSelect(e.target.files)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
                className='hidden'
                disabled={isStreaming}
              />

              {/* Text Input Container */}
              <div className='relative flex-1'>
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  className='flex w-full resize-none items-center overflow-hidden bg-transparent text-base outline-none placeholder:text-gray-400 md:font-[330]'
                  placeholder={isDragOver ? 'Drop files here...' : isActive ? '' : ''}
                  rows={1}
                  style={{
                    minHeight: window.innerWidth >= 768 ? '24px' : '28px',
                    lineHeight: '1.4',
                    paddingTop: window.innerWidth >= 768 ? '4px' : '3px',
                    paddingBottom: window.innerWidth >= 768 ? '4px' : '3px',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                />

                {/* Placeholder */}
                <div className='pointer-events-none absolute top-0 left-0 flex h-full w-full items-center'>
                  {!isActive && !inputValue && (
                    <>
                      {/* Mobile placeholder */}
                      <div
                        className='-translate-y-1/2 absolute top-1/2 left-0 transform select-none text-base text-gray-400 md:hidden'
                        style={{ paddingTop: '3px', paddingBottom: '3px' }}
                      >
                        {isDragOver ? 'Drop files here...' : PLACEHOLDER_MOBILE}
                      </div>
                      {/* Desktop placeholder */}
                      <div
                        className='-translate-y-1/2 absolute top-1/2 left-0 hidden transform select-none font-[330] text-base text-gray-400 md:block'
                        style={{ paddingTop: '4px', paddingBottom: '4px' }}
                      >
                        {isDragOver ? 'Drop files here...' : PLACEHOLDER_DESKTOP}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Voice Input */}
              {isSttAvailable && (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div>
                      <VoiceInput onVoiceStart={handleVoiceStart} disabled={isStreaming} minimal />
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Content side='top'>
                    <p>Start voice conversation</p>
                  </Tooltip.Content>
                </Tooltip.Root>
              )}

              {/* Send Button */}
              <button
                className={`flex items-center justify-center rounded-full p-1.5 text-white transition-colors md:p-2 ${
                  inputValue.trim() || attachedFiles.length > 0
                    ? 'bg-black hover:bg-zinc-700'
                    : 'cursor-default bg-gray-300 hover:bg-gray-400'
                }`}
                title={isStreaming ? 'Stop' : 'Send'}
                type='button'
                onClick={(e) => {
                  e.stopPropagation()
                  if (isStreaming) {
                    onStopStreaming?.()
                  } else {
                    handleSubmit()
                  }
                }}
              >
                {isStreaming ? (
                  <>
                    <Square size={16} className='md:hidden' />
                    <Square size={18} className='hidden md:block' />
                  </>
                ) : (
                  <>
                    <Send size={16} className='md:hidden' />
                    <Send size={18} className='hidden md:block' />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Tooltip.Provider>
  )
}
```

--------------------------------------------------------------------------------

````
