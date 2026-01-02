---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 406
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 406 of 933)

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

---[FILE: chat.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/deploy/components/deploy-modal/components/chat/chat.tsx
Signals: React

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Check, Clipboard, Eye, EyeOff, Loader2, RefreshCw, X } from 'lucide-react'
import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Tooltip,
} from '@/components/emcn'
import { Alert, AlertDescription, Skeleton } from '@/components/ui'
import { getEnv, isTruthy } from '@/lib/core/config/env'
import { generatePassword } from '@/lib/core/security/encryption'
import { cn } from '@/lib/core/utils/cn'
import { getEmailDomain } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { quickValidateEmail } from '@/lib/messaging/email/validation'
import { OutputSelect } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/chat/components/output-select/output-select'
import {
  type AuthType,
  type ChatFormData,
  useChatDeployment,
  useIdentifierValidation,
} from './hooks'

const logger = createLogger('ChatDeploy')

const IDENTIFIER_PATTERN = /^[a-z0-9-]+$/

interface ChatDeployProps {
  workflowId: string
  deploymentInfo: {
    apiKey: string
  } | null
  existingChat: ExistingChat | null
  isLoadingChat: boolean
  onRefetchChat: () => Promise<void>
  onChatExistsChange?: (exists: boolean) => void
  chatSubmitting: boolean
  setChatSubmitting: (submitting: boolean) => void
  onValidationChange?: (isValid: boolean) => void
  showDeleteConfirmation?: boolean
  setShowDeleteConfirmation?: (show: boolean) => void
  onDeploymentComplete?: () => void
  onDeployed?: () => void
  onVersionActivated?: () => void
}

export interface ExistingChat {
  id: string
  identifier: string
  title: string
  description: string
  authType: 'public' | 'password' | 'email' | 'sso'
  allowedEmails: string[]
  outputConfigs: Array<{ blockId: string; path: string }>
  customizations?: {
    welcomeMessage?: string
    imageUrl?: string
  }
  isActive: boolean
}

interface FormErrors {
  identifier?: string
  title?: string
  password?: string
  emails?: string
  outputBlocks?: string
  general?: string
}

const initialFormData: ChatFormData = {
  identifier: '',
  title: '',
  description: '',
  authType: 'public',
  password: '',
  emails: [],
  welcomeMessage: 'Hi there! How can I help you today?',
  selectedOutputBlocks: [],
}

export function ChatDeploy({
  workflowId,
  deploymentInfo,
  existingChat,
  isLoadingChat,
  onRefetchChat,
  onChatExistsChange,
  chatSubmitting,
  setChatSubmitting,
  onValidationChange,
  showDeleteConfirmation: externalShowDeleteConfirmation,
  setShowDeleteConfirmation: externalSetShowDeleteConfirmation,
  onDeploymentComplete,
  onDeployed,
  onVersionActivated,
}: ChatDeployProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [internalShowDeleteConfirmation, setInternalShowDeleteConfirmation] = useState(false)

  const showDeleteConfirmation =
    externalShowDeleteConfirmation !== undefined
      ? externalShowDeleteConfirmation
      : internalShowDeleteConfirmation

  const setShowDeleteConfirmation =
    externalSetShowDeleteConfirmation || setInternalShowDeleteConfirmation

  const [formData, setFormData] = useState<ChatFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const { deployChat } = useChatDeployment()
  const formRef = useRef<HTMLFormElement>(null)
  const [isIdentifierValid, setIsIdentifierValid] = useState(false)
  const [hasInitializedForm, setHasInitializedForm] = useState(false)

  const updateField = <K extends keyof ChatFormData>(field: K, value: ChatFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const setError = (field: keyof FormErrors, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }))
  }

  const validateForm = (isExistingChat: boolean): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Identifier is required'
    } else if (!IDENTIFIER_PATTERN.test(formData.identifier)) {
      newErrors.identifier = 'Identifier can only contain lowercase letters, numbers, and hyphens'
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (formData.authType === 'password' && !isExistingChat && !formData.password.trim()) {
      newErrors.password = 'Password is required when using password protection'
    }

    if (
      (formData.authType === 'email' || formData.authType === 'sso') &&
      formData.emails.length === 0
    ) {
      newErrors.emails = `At least one email or domain is required when using ${formData.authType === 'sso' ? 'SSO' : 'email'} access control`
    }

    if (formData.selectedOutputBlocks.length === 0) {
      newErrors.outputBlocks = 'Please select at least one output block'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid =
    isIdentifierValid &&
    Boolean(formData.title.trim()) &&
    formData.selectedOutputBlocks.length > 0 &&
    (formData.authType !== 'password' ||
      Boolean(formData.password.trim()) ||
      Boolean(existingChat)) &&
    ((formData.authType !== 'email' && formData.authType !== 'sso') || formData.emails.length > 0)

  useEffect(() => {
    onValidationChange?.(isFormValid)
  }, [isFormValid, onValidationChange])

  useEffect(() => {
    if (existingChat && !hasInitializedForm) {
      setFormData({
        identifier: existingChat.identifier || '',
        title: existingChat.title || '',
        description: existingChat.description || '',
        authType: existingChat.authType || 'public',
        password: '',
        emails: Array.isArray(existingChat.allowedEmails) ? [...existingChat.allowedEmails] : [],
        welcomeMessage:
          existingChat.customizations?.welcomeMessage || 'Hi there! How can I help you today?',
        selectedOutputBlocks: Array.isArray(existingChat.outputConfigs)
          ? existingChat.outputConfigs.map(
              (config: { blockId: string; path: string }) => `${config.blockId}_${config.path}`
            )
          : [],
      })

      if (existingChat.customizations?.imageUrl) {
        setImageUrl(existingChat.customizations.imageUrl)
      }

      setHasInitializedForm(true)
    } else if (!existingChat && !isLoadingChat) {
      setFormData(initialFormData)
      setImageUrl(null)
      setHasInitializedForm(false)
    }
  }, [existingChat, isLoadingChat, hasInitializedForm])

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (chatSubmitting) return

    setChatSubmitting(true)

    try {
      if (!validateForm(!!existingChat)) {
        setChatSubmitting(false)
        return
      }

      if (!isIdentifierValid && formData.identifier !== existingChat?.identifier) {
        setError('identifier', 'Please wait for identifier validation to complete')
        setChatSubmitting(false)
        return
      }

      const chatUrl = await deployChat(
        workflowId,
        formData,
        deploymentInfo,
        existingChat?.id,
        imageUrl
      )

      onChatExistsChange?.(true)
      onDeployed?.()
      onVersionActivated?.()

      if (chatUrl) {
        window.open(chatUrl, '_blank', 'noopener,noreferrer')
      }

      setHasInitializedForm(false)
      await onRefetchChat()
    } catch (error: any) {
      if (error.message?.includes('identifier')) {
        setError('identifier', error.message)
      } else {
        setError('general', error.message)
      }
    } finally {
      setChatSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!existingChat || !existingChat.id) return

    try {
      setIsDeleting(true)

      const response = await fetch(`/api/chat/manage/${existingChat.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete chat')
      }

      setImageUrl(null)
      setHasInitializedForm(false)
      onChatExistsChange?.(false)
      await onRefetchChat()

      onDeploymentComplete?.()
    } catch (error: any) {
      logger.error('Failed to delete chat:', error)
      setError('general', error.message || 'An unexpected error occurred while deleting')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirmation(false)
    }
  }

  if (isLoadingChat) {
    return <LoadingSkeleton />
  }

  return (
    <>
      <form
        id='chat-deploy-form'
        ref={formRef}
        onSubmit={handleSubmit}
        className='-mx-1 space-y-4 overflow-y-auto px-1'
      >
        {errors.general && (
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className='space-y-[12px]'>
          <IdentifierInput
            value={formData.identifier}
            onChange={(value) => updateField('identifier', value)}
            originalIdentifier={existingChat?.identifier || undefined}
            disabled={chatSubmitting}
            onValidationChange={setIsIdentifierValid}
            isEditingExisting={!!existingChat}
          />

          <div>
            <Label
              htmlFor='title'
              className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'
            >
              Title
            </Label>
            <Input
              id='title'
              placeholder='Customer Support Assistant'
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
              disabled={chatSubmitting}
            />
            {errors.title && <p className='mt-1 text-destructive text-sm'>{errors.title}</p>}
          </div>

          <div>
            <Label className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
              Output
            </Label>
            <OutputSelect
              workflowId={workflowId}
              selectedOutputs={formData.selectedOutputBlocks}
              onOutputSelect={(values) => updateField('selectedOutputBlocks', values)}
              placeholder='Select which block outputs to use'
              disabled={chatSubmitting}
            />
            {errors.outputBlocks && (
              <p className='mt-1 text-destructive text-sm'>{errors.outputBlocks}</p>
            )}
          </div>

          <AuthSelector
            authType={formData.authType}
            password={formData.password}
            emails={formData.emails}
            onAuthTypeChange={(type) => updateField('authType', type)}
            onPasswordChange={(password) => updateField('password', password)}
            onEmailsChange={(emails) => updateField('emails', emails)}
            disabled={chatSubmitting}
            isExistingChat={!!existingChat}
            error={errors.password || errors.emails}
          />
          <div>
            <Label
              htmlFor='welcomeMessage'
              className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'
            >
              Welcome message
            </Label>
            <Textarea
              id='welcomeMessage'
              placeholder='Enter a welcome message for your chat'
              value={formData.welcomeMessage}
              onChange={(e) => updateField('welcomeMessage', e.target.value)}
              rows={3}
              disabled={chatSubmitting}
              className='min-h-[80px] resize-none'
            />
            <p className='mt-[6.5px] text-[11px] text-[var(--text-secondary)]'>
              This message will be displayed when users first open the chat
            </p>
          </div>

          <button
            type='button'
            data-delete-trigger
            onClick={() => setShowDeleteConfirmation(true)}
            style={{ display: 'none' }}
          />
        </div>
      </form>

      <Modal open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <ModalContent size='sm'>
          <ModalHeader>Delete Chat</ModalHeader>
          <ModalBody>
            <p className='text-[12px] text-[var(--text-tertiary)]'>
              Are you sure you want to delete this chat?{' '}
              <span className='text-[var(--text-error)]'>
                This will remove the chat at "{getEmailDomain()}/chat/{existingChat?.identifier}"
                and make it unavailable to all users.
              </span>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant='default'
              onClick={() => setShowDeleteConfirmation(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={handleDelete}
              disabled={isDeleting}
              className='gap-[8px] bg-[var(--text-error)] text-[13px] text-white hover:bg-[var(--text-error)]'
            >
              {isDeleting && <Loader2 className='mr-1 h-4 w-4 animate-spin' />}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

function LoadingSkeleton() {
  return (
    <div className='-mx-1 space-y-4 px-1'>
      <div className='space-y-[12px]'>
        <div>
          <Skeleton className='mb-[6.5px] h-[16px] w-[26px]' />
          <Skeleton className='h-[34px] w-full rounded-[4px]' />
          <Skeleton className='mt-[6.5px] h-[14px] w-[320px]' />
        </div>
        <div>
          <Skeleton className='mb-[6.5px] h-[16px] w-[30px]' />
          <Skeleton className='h-[34px] w-full rounded-[4px]' />
        </div>
        <div>
          <Skeleton className='mb-[6.5px] h-[16px] w-[46px]' />
          <Skeleton className='h-[34px] w-full rounded-[4px]' />
        </div>
        <div>
          <Skeleton className='mb-[6.5px] h-[16px] w-[95px]' />
          <Skeleton className='h-[28px] w-[170px] rounded-[4px]' />
        </div>
        <div>
          <Skeleton className='mb-[6.5px] h-[16px] w-[115px]' />
          <Skeleton className='h-[80px] w-full rounded-[4px]' />
          <Skeleton className='mt-[6.5px] h-[14px] w-[340px]' />
        </div>
      </div>
    </div>
  )
}

interface IdentifierInputProps {
  value: string
  onChange: (value: string) => void
  originalIdentifier?: string
  disabled?: boolean
  onValidationChange?: (isValid: boolean) => void
  isEditingExisting?: boolean
}

const getDomainPrefix = (() => {
  const prefix = `${getEmailDomain()}/chat/`
  return () => prefix
})()

function IdentifierInput({
  value,
  onChange,
  originalIdentifier,
  disabled = false,
  onValidationChange,
  isEditingExisting = false,
}: IdentifierInputProps) {
  const { isChecking, error, isValid } = useIdentifierValidation(
    value,
    originalIdentifier,
    isEditingExisting
  )

  useEffect(() => {
    onValidationChange?.(isValid)
  }, [isValid, onValidationChange])

  const handleChange = (newValue: string) => {
    const lowercaseValue = newValue.toLowerCase()
    onChange(lowercaseValue)
  }

  const fullUrl = `${getEnv('NEXT_PUBLIC_APP_URL')}/chat/${value}`
  const displayUrl = fullUrl.replace(/^https?:\/\//, '')

  return (
    <div>
      <Label
        htmlFor='chat-url'
        className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'
      >
        URL
      </Label>
      <div
        className={cn(
          'relative flex items-stretch overflow-hidden rounded-[4px] border border-[var(--surface-11)]',
          error && 'border-[var(--text-error)]'
        )}
      >
        <div className='flex items-center whitespace-nowrap bg-[var(--surface-6)] px-[8px] font-medium text-[var(--text-secondary)] text-sm dark:bg-[var(--surface-9)]'>
          {getDomainPrefix()}
        </div>
        <div className='relative flex-1'>
          <Input
            id='chat-url'
            placeholder='company-name'
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            required
            disabled={disabled}
            className={cn(
              'rounded-none border-0 pl-0 shadow-none disabled:bg-transparent disabled:opacity-100',
              isChecking && 'pr-[32px]'
            )}
          />
          {isChecking && (
            <div className='-translate-y-1/2 absolute top-1/2 right-2'>
              <Loader2 className='h-4 w-4 animate-spin text-[var(--text-tertiary)]' />
            </div>
          )}
        </div>
      </div>
      {error && <p className='mt-[6.5px] text-[11px] text-[var(--text-error)]'>{error}</p>}
      <p className='mt-[6.5px] truncate text-[11px] text-[var(--text-secondary)]'>
        {isEditingExisting && value ? (
          <>
            Live at:{' '}
            <a
              href={fullUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-[var(--text-primary)] hover:underline'
            >
              {displayUrl}
            </a>
          </>
        ) : (
          'The unique URL path where your chat will be accessible'
        )}
      </p>
    </div>
  )
}

interface AuthSelectorProps {
  authType: AuthType
  password: string
  emails: string[]
  onAuthTypeChange: (type: AuthType) => void
  onPasswordChange: (password: string) => void
  onEmailsChange: (emails: string[]) => void
  disabled?: boolean
  isExistingChat?: boolean
  error?: string
}

const AUTH_LABELS: Record<AuthType, string> = {
  public: 'Public',
  password: 'Password',
  email: 'Email',
  sso: 'SSO',
}

function AuthSelector({
  authType,
  password,
  emails,
  onAuthTypeChange,
  onPasswordChange,
  onEmailsChange,
  disabled = false,
  isExistingChat = false,
  error,
}: AuthSelectorProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [emailInputValue, setEmailInputValue] = useState('')
  const [emailError, setEmailError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [invalidEmails, setInvalidEmails] = useState<string[]>([])

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(24)
    onPasswordChange(newPassword)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const addEmail = (email: string): boolean => {
    if (!email.trim()) return false

    const normalized = email.trim().toLowerCase()
    const isDomainPattern = normalized.startsWith('@')
    const validation = quickValidateEmail(normalized)
    const isValid = validation.isValid || isDomainPattern

    if (emails.includes(normalized) || invalidEmails.includes(normalized)) {
      return false
    }

    if (!isValid) {
      setInvalidEmails((prev) => [...prev, normalized])
      setEmailInputValue('')
      return false
    }

    setEmailError('')
    onEmailsChange([...emails, normalized])
    setEmailInputValue('')
    return true
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    onEmailsChange(emails.filter((e) => e !== emailToRemove))
  }

  const handleRemoveInvalidEmail = (index: number) => {
    setInvalidEmails((prev) => prev.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ',', ' '].includes(e.key) && emailInputValue.trim()) {
      e.preventDefault()
      addEmail(emailInputValue)
    }

    if (e.key === 'Backspace' && !emailInputValue) {
      if (invalidEmails.length > 0) {
        handleRemoveInvalidEmail(invalidEmails.length - 1)
      } else if (emails.length > 0) {
        handleRemoveEmail(emails[emails.length - 1])
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const pastedEmails = pastedText.split(/[\s,;]+/).filter(Boolean)

    let addedCount = 0
    pastedEmails.forEach((email) => {
      if (addEmail(email)) {
        addedCount++
      }
    })

    if (addedCount === 0 && pastedEmails.length === 1) {
      setEmailInputValue(emailInputValue + pastedEmails[0])
    }
  }

  const ssoEnabled = isTruthy(getEnv('NEXT_PUBLIC_SSO_ENABLED'))
  const authOptions = ssoEnabled
    ? (['public', 'password', 'email', 'sso'] as const)
    : (['public', 'password', 'email'] as const)

  return (
    <div className='space-y-[16px]'>
      <div>
        <Label className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
          Access control
        </Label>
        <div className='inline-flex gap-[2px]'>
          {authOptions.map((type, index, arr) => (
            <Button
              key={type}
              type='button'
              variant={authType === type ? 'active' : 'default'}
              onClick={() => !disabled && onAuthTypeChange(type)}
              disabled={disabled}
              className={`px-[8px] py-[4px] text-[12px] ${
                index === 0
                  ? 'rounded-r-none'
                  : index === arr.length - 1
                    ? 'rounded-l-none'
                    : 'rounded-none'
              }`}
            >
              {AUTH_LABELS[type]}
            </Button>
          ))}
        </div>
      </div>

      {authType === 'password' && (
        <div>
          <Label className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
            Password
          </Label>
          <div className='relative'>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder={isExistingChat ? 'Enter new password to change' : 'Enter password'}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={disabled}
              className='pr-[88px]'
              required={!isExistingChat}
              autoComplete='new-password'
            />
            <div className='-translate-y-1/2 absolute top-1/2 right-[4px] flex items-center'>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={handleGeneratePassword}
                    disabled={disabled}
                    aria-label='Generate password'
                    className='!p-1.5'
                  >
                    <RefreshCw className='h-3 w-3' />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <span>Generate</span>
                </Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={() => copyToClipboard(password)}
                    disabled={!password || disabled}
                    aria-label='Copy password'
                    className='!p-1.5'
                  >
                    {copySuccess ? (
                      <Check className='h-3 w-3' />
                    ) : (
                      <Clipboard className='h-3 w-3' />
                    )}
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <span>{copySuccess ? 'Copied' : 'Copy'}</span>
                </Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={disabled}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className='!p-1.5'
                  >
                    {showPassword ? <EyeOff className='h-3 w-3' /> : <Eye className='h-3 w-3' />}
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </Tooltip.Content>
              </Tooltip.Root>
            </div>
          </div>
          <p className='mt-[6.5px] text-[11px] text-[var(--text-secondary)]'>
            {isExistingChat
              ? 'Leave empty to keep the current password'
              : 'This password will be required to access your chat'}
          </p>
        </div>
      )}

      {(authType === 'email' || authType === 'sso') && (
        <div>
          <Label className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
            {authType === 'email' ? 'Allowed emails' : 'Allowed SSO emails'}
          </Label>
          <div className='scrollbar-hide flex max-h-32 flex-wrap items-center gap-x-[8px] gap-y-[4px] overflow-y-auto rounded-[4px] border border-[var(--surface-11)] bg-[var(--surface-6)] px-[8px] py-[6px] focus-within:outline-none dark:bg-[var(--surface-9)]'>
            {invalidEmails.map((email, index) => (
              <EmailTag
                key={`invalid-${index}`}
                email={email}
                onRemove={() => handleRemoveInvalidEmail(index)}
                disabled={disabled}
                isInvalid={true}
              />
            ))}
            {emails.map((email, index) => (
              <EmailTag
                key={`valid-${index}`}
                email={email}
                onRemove={() => handleRemoveEmail(email)}
                disabled={disabled}
              />
            ))}
            <input
              type='text'
              value={emailInputValue}
              onChange={(e) => setEmailInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onBlur={() => emailInputValue.trim() && addEmail(emailInputValue)}
              placeholder={
                emails.length > 0 || invalidEmails.length > 0
                  ? 'Add another email'
                  : 'Enter emails or domains (@example.com)'
              }
              className='min-w-[180px] flex-1 border-none bg-transparent p-0 font-medium font-sans text-foreground text-sm outline-none placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-50'
              disabled={disabled}
            />
          </div>
          {emailError && (
            <p className='mt-[6.5px] text-[11px] text-[var(--text-error)]'>{emailError}</p>
          )}
          <p className='mt-[6.5px] text-[11px] text-[var(--text-secondary)]'>
            {authType === 'email'
              ? 'Add specific emails or entire domains (@example.com)'
              : 'Add emails or domains that can access via SSO'}
          </p>
        </div>
      )}

      {error && <p className='mt-[6.5px] text-[11px] text-[var(--text-error)]'>{error}</p>}
    </div>
  )
}

interface EmailTagProps {
  email: string
  onRemove: () => void
  disabled?: boolean
  isInvalid?: boolean
}

function EmailTag({ email, onRemove, disabled, isInvalid }: EmailTagProps) {
  return (
    <div
      className={cn(
        'flex w-auto items-center gap-[4px] rounded-[4px] border px-[6px] py-[2px] text-[12px]',
        isInvalid
          ? 'border-[var(--text-error)] bg-[color-mix(in_srgb,var(--text-error)_10%,transparent)] text-[var(--text-error)] dark:bg-[color-mix(in_srgb,var(--text-error)_16%,transparent)]'
          : 'border-[var(--surface-11)] bg-[var(--surface-5)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      )}
    >
      <span className='max-w-[200px] truncate'>{email}</span>
      {!disabled && (
        <button
          type='button'
          onClick={onRemove}
          className={cn(
            'flex-shrink-0 transition-colors focus:outline-none',
            isInvalid
              ? 'text-[var(--text-error)] hover:text-[var(--text-error)]'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
          )}
          aria-label={`Remove ${email}`}
        >
          <X className='h-[12px] w-[12px] translate-y-[0.2px]' />
        </button>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/deploy/components/deploy-modal/components/chat/hooks/index.ts

```typescript
export { type AuthType, type ChatFormData, useChatDeployment } from './use-chat-deployment'
export { useIdentifierValidation } from './use-identifier-validation'
```

--------------------------------------------------------------------------------

---[FILE: use-chat-deployment.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/deploy/components/deploy-modal/components/chat/hooks/use-chat-deployment.ts
Signals: React, Zod

```typescript
import { useCallback } from 'react'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import type { OutputConfig } from '@/stores/chat/store'

const logger = createLogger('ChatDeployment')

export type AuthType = 'public' | 'password' | 'email' | 'sso'

export interface ChatFormData {
  identifier: string
  title: string
  description: string
  authType: AuthType
  password: string
  emails: string[]
  welcomeMessage: string
  selectedOutputBlocks: string[]
}

const chatSchema = z.object({
  workflowId: z.string().min(1, 'Workflow ID is required'),
  identifier: z
    .string()
    .min(1, 'Identifier is required')
    .regex(/^[a-z0-9-]+$/, 'Identifier can only contain lowercase letters, numbers, and hyphens'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  customizations: z.object({
    primaryColor: z.string(),
    welcomeMessage: z.string(),
    imageUrl: z.string().optional(),
  }),
  authType: z.enum(['public', 'password', 'email', 'sso']).default('public'),
  password: z.string().optional(),
  allowedEmails: z.array(z.string()).optional().default([]),
  outputConfigs: z
    .array(
      z.object({
        blockId: z.string(),
        path: z.string(),
      })
    )
    .optional()
    .default([]),
})

/**
 * Parses output block selections into structured output configs
 */
function parseOutputConfigs(selectedOutputBlocks: string[]): OutputConfig[] {
  return selectedOutputBlocks
    .map((outputId) => {
      const firstUnderscoreIndex = outputId.indexOf('_')
      if (firstUnderscoreIndex !== -1) {
        const blockId = outputId.substring(0, firstUnderscoreIndex)
        const path = outputId.substring(firstUnderscoreIndex + 1)
        if (blockId && path) {
          return { blockId, path }
        }
      }
      return null
    })
    .filter((config): config is OutputConfig => config !== null)
}

/**
 * Hook for deploying or updating a chat interface
 */
export function useChatDeployment() {
  const deployChat = useCallback(
    async (
      workflowId: string,
      formData: ChatFormData,
      deploymentInfo: { apiKey: string } | null,
      existingChatId?: string,
      imageUrl?: string | null
    ): Promise<string> => {
      const outputConfigs = parseOutputConfigs(formData.selectedOutputBlocks)

      const payload = {
        workflowId,
        identifier: formData.identifier.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        customizations: {
          primaryColor: 'var(--brand-primary-hover-hex)',
          welcomeMessage: formData.welcomeMessage.trim(),
          ...(imageUrl && { imageUrl }),
        },
        authType: formData.authType,
        password: formData.authType === 'password' ? formData.password : undefined,
        allowedEmails:
          formData.authType === 'email' || formData.authType === 'sso' ? formData.emails : [],
        outputConfigs,
        apiKey: deploymentInfo?.apiKey,
        deployApiEnabled: !existingChatId,
      }

      chatSchema.parse(payload)

      const endpoint = existingChatId ? `/api/chat/manage/${existingChatId}` : '/api/chat'
      const method = existingChatId ? 'PATCH' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.error === 'Identifier already in use') {
          throw new Error('This identifier is already in use')
        }
        throw new Error(result.error || `Failed to ${existingChatId ? 'update' : 'deploy'} chat`)
      }

      if (!result.chatUrl) {
        throw new Error('Response missing chatUrl')
      }

      logger.info(`Chat ${existingChatId ? 'updated' : 'deployed'} successfully:`, result.chatUrl)
      return result.chatUrl
    },
    []
  )

  return { deployChat }
}
```

--------------------------------------------------------------------------------

---[FILE: use-identifier-validation.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/deploy/components/deploy-modal/components/chat/hooks/use-identifier-validation.ts
Signals: React

```typescript
import { useEffect, useRef, useState } from 'react'

const IDENTIFIER_PATTERN = /^[a-z0-9-]+$/
const DEBOUNCE_MS = 500

interface IdentifierValidationState {
  isChecking: boolean
  error: string | null
  isValid: boolean
}

/**
 * Hook for validating chat identifier availability with debounced API checks
 * @param identifier - The identifier to validate
 * @param originalIdentifier - The original identifier when editing an existing chat
 * @param isEditingExisting - Whether we're editing an existing chat deployment
 */
export function useIdentifierValidation(
  identifier: string,
  originalIdentifier?: string,
  isEditingExisting?: boolean
): IdentifierValidationState {
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setError(null)
    setIsValid(false)
    setIsChecking(false)

    if (!identifier.trim()) {
      return
    }

    if (originalIdentifier && identifier === originalIdentifier) {
      setIsValid(true)
      return
    }

    if (isEditingExisting && !originalIdentifier) {
      setIsValid(true)
      return
    }

    if (!IDENTIFIER_PATTERN.test(identifier)) {
      setError('Identifier can only contain lowercase letters, numbers, and hyphens')
      return
    }

    setIsChecking(true)
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/chat/validate?identifier=${encodeURIComponent(identifier)}`
        )
        const data = await response.json()

        if (!response.ok) {
          setError('Error checking identifier availability')
          setIsValid(false)
        } else if (!data.available) {
          setError(data.error || 'This identifier is already in use')
          setIsValid(false)
        } else {
          setError(null)
          setIsValid(true)
        }
      } catch {
        setError('Error checking identifier availability')
        setIsValid(false)
      } finally {
        setIsChecking(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [identifier, originalIdentifier, isEditingExisting])

  return { isChecking, error, isValid }
}
```

--------------------------------------------------------------------------------

````
