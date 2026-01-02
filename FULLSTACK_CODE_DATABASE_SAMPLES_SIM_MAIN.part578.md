---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 578
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 578 of 933)

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

---[FILE: unsubscribe.ts]---
Location: sim-main/apps/sim/lib/messaging/email/unsubscribe.ts

```typescript
import { createHash, randomBytes } from 'crypto'
import { db } from '@sim/db'
import { settings, user } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'
import type { EmailType } from '@/lib/messaging/email/mailer'

const logger = createLogger('Unsubscribe')

export interface EmailPreferences {
  unsubscribeAll?: boolean
  unsubscribeMarketing?: boolean
  unsubscribeUpdates?: boolean
  unsubscribeNotifications?: boolean
}

/**
 * Generate a secure unsubscribe token for an email address
 */
export function generateUnsubscribeToken(email: string, emailType = 'marketing'): string {
  const salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256')
    .update(`${email}:${salt}:${emailType}:${env.BETTER_AUTH_SECRET}`)
    .digest('hex')

  return `${salt}:${hash}:${emailType}`
}

/**
 * Verify an unsubscribe token for an email address and return email type
 */
export function verifyUnsubscribeToken(
  email: string,
  token: string
): { valid: boolean; emailType?: string } {
  try {
    const parts = token.split(':')
    if (parts.length < 2) return { valid: false }

    // Handle legacy tokens (without email type)
    if (parts.length === 2) {
      const [salt, expectedHash] = parts
      const hash = createHash('sha256')
        .update(`${email}:${salt}:${env.BETTER_AUTH_SECRET}`)
        .digest('hex')

      return { valid: hash === expectedHash, emailType: 'marketing' }
    }

    // Handle new tokens (with email type)
    const [salt, expectedHash, emailType] = parts
    if (!salt || !expectedHash || !emailType) return { valid: false }

    const hash = createHash('sha256')
      .update(`${email}:${salt}:${emailType}:${env.BETTER_AUTH_SECRET}`)
      .digest('hex')

    return { valid: hash === expectedHash, emailType }
  } catch (error) {
    logger.error('Error verifying unsubscribe token:', error)
    return { valid: false }
  }
}

/**
 * Check if an email type is transactional
 */
export function isTransactionalEmail(emailType: EmailType): boolean {
  return emailType === ('transactional' as EmailType)
}

/**
 * Get user's email preferences
 */
export async function getEmailPreferences(email: string): Promise<EmailPreferences | null> {
  try {
    const result = await db
      .select({
        emailPreferences: settings.emailPreferences,
      })
      .from(user)
      .leftJoin(settings, eq(settings.userId, user.id))
      .where(eq(user.email, email))
      .limit(1)

    if (!result[0]) return null

    return (result[0].emailPreferences as EmailPreferences) || {}
  } catch (error) {
    logger.error('Error getting email preferences:', error)
    return null
  }
}

/**
 * Update user's email preferences
 */
export async function updateEmailPreferences(
  email: string,
  preferences: EmailPreferences
): Promise<boolean> {
  try {
    // First, find the user
    const userResult = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, email))
      .limit(1)

    if (!userResult[0]) {
      logger.warn(`User not found for email: ${email}`)
      return false
    }

    const userId = userResult[0].id

    // Get existing email preferences
    const existingSettings = await db
      .select({ emailPreferences: settings.emailPreferences })
      .from(settings)
      .where(eq(settings.userId, userId))
      .limit(1)

    let currentEmailPreferences = {}
    if (existingSettings[0]) {
      currentEmailPreferences = (existingSettings[0].emailPreferences as EmailPreferences) || {}
    }

    // Merge email preferences
    const updatedEmailPreferences = {
      ...currentEmailPreferences,
      ...preferences,
    }

    // Upsert settings
    await db
      .insert(settings)
      .values({
        id: userId,
        userId,
        emailPreferences: updatedEmailPreferences,
      })
      .onConflictDoUpdate({
        target: settings.userId,
        set: {
          emailPreferences: updatedEmailPreferences,
          updatedAt: new Date(),
        },
      })

    logger.info(`Updated email preferences for user: ${email}`)
    return true
  } catch (error) {
    logger.error('Error updating email preferences:', error)
    return false
  }
}

/**
 * Check if user has unsubscribed from a specific email type
 */
export async function isUnsubscribed(
  email: string,
  emailType: 'all' | 'marketing' | 'updates' | 'notifications' = 'all'
): Promise<boolean> {
  try {
    const preferences = await getEmailPreferences(email)
    if (!preferences) return false

    // Check unsubscribe all first
    if (preferences.unsubscribeAll) return true

    // Check specific type
    switch (emailType) {
      case 'marketing':
        return preferences.unsubscribeMarketing || false
      case 'updates':
        return preferences.unsubscribeUpdates || false
      case 'notifications':
        return preferences.unsubscribeNotifications || false
      default:
        return false
    }
  } catch (error) {
    logger.error('Error checking unsubscribe status:', error)
    return false
  }
}

/**
 * Unsubscribe user from all emails
 */
export async function unsubscribeFromAll(email: string): Promise<boolean> {
  return updateEmailPreferences(email, { unsubscribeAll: true })
}

/**
 * Resubscribe user (remove all unsubscribe flags)
 */
export async function resubscribe(email: string): Promise<boolean> {
  return updateEmailPreferences(email, {
    unsubscribeAll: false,
    unsubscribeMarketing: false,
    unsubscribeUpdates: false,
    unsubscribeNotifications: false,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: utils.test.ts]---
Location: sim-main/apps/sim/lib/messaging/email/utils.test.ts

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the env module
vi.mock('@/lib/core/config/env', () => ({
  env: {
    FROM_EMAIL_ADDRESS: undefined,
    EMAIL_DOMAIN: undefined,
  },
}))

// Mock the getEmailDomain function
vi.mock('@/lib/core/utils/urls', () => ({
  getEmailDomain: vi.fn().mockReturnValue('fallback.com'),
}))

describe('getFromEmailAddress', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetModules()
  })

  it('should return FROM_EMAIL_ADDRESS when set', async () => {
    // Mock env with FROM_EMAIL_ADDRESS
    vi.doMock('@/lib/core/config/env', () => ({
      env: {
        FROM_EMAIL_ADDRESS: 'Sim <noreply@sim.ai>',
        EMAIL_DOMAIN: 'example.com',
      },
    }))

    const { getFromEmailAddress } = await import('./utils')
    const result = getFromEmailAddress()

    expect(result).toBe('Sim <noreply@sim.ai>')
  })

  it('should return simple email format when FROM_EMAIL_ADDRESS is set without display name', async () => {
    vi.doMock('@/lib/core/config/env', () => ({
      env: {
        FROM_EMAIL_ADDRESS: 'noreply@sim.ai',
        EMAIL_DOMAIN: 'example.com',
      },
    }))

    const { getFromEmailAddress } = await import('./utils')
    const result = getFromEmailAddress()

    expect(result).toBe('noreply@sim.ai')
  })

  it('should return Azure ACS format when FROM_EMAIL_ADDRESS is set', async () => {
    vi.doMock('@/lib/core/config/env', () => ({
      env: {
        FROM_EMAIL_ADDRESS: 'DoNotReply@customer.azurecomm.net',
        EMAIL_DOMAIN: 'example.com',
      },
    }))

    const { getFromEmailAddress } = await import('./utils')
    const result = getFromEmailAddress()

    expect(result).toBe('DoNotReply@customer.azurecomm.net')
  })

  it('should construct from EMAIL_DOMAIN when FROM_EMAIL_ADDRESS is not set', async () => {
    vi.doMock('@/lib/core/config/env', () => ({
      env: {
        FROM_EMAIL_ADDRESS: undefined,
        EMAIL_DOMAIN: 'example.com',
      },
    }))

    const { getFromEmailAddress } = await import('./utils')
    const result = getFromEmailAddress()

    expect(result).toBe('noreply@example.com')
  })

  it('should use getEmailDomain fallback when both FROM_EMAIL_ADDRESS and EMAIL_DOMAIN are not set', async () => {
    vi.doMock('@/lib/core/config/env', () => ({
      env: {
        FROM_EMAIL_ADDRESS: undefined,
        EMAIL_DOMAIN: undefined,
      },
    }))

    const mockGetEmailDomain = vi.fn().mockReturnValue('fallback.com')
    vi.doMock('@/lib/core/utils/urls', () => ({
      getEmailDomain: mockGetEmailDomain,
    }))

    const { getFromEmailAddress } = await import('./utils')
    const result = getFromEmailAddress()

    expect(result).toBe('noreply@fallback.com')
    expect(mockGetEmailDomain).toHaveBeenCalled()
  })

  it('should prioritize FROM_EMAIL_ADDRESS over EMAIL_DOMAIN when both are set', async () => {
    vi.doMock('@/lib/core/config/env', () => ({
      env: {
        FROM_EMAIL_ADDRESS: 'Custom <custom@custom.com>',
        EMAIL_DOMAIN: 'ignored.com',
      },
    }))

    const { getFromEmailAddress } = await import('./utils')
    const result = getFromEmailAddress()

    expect(result).toBe('Custom <custom@custom.com>')
  })

  it('should handle empty string FROM_EMAIL_ADDRESS by falling back to EMAIL_DOMAIN', async () => {
    vi.doMock('@/lib/core/config/env', () => ({
      env: {
        FROM_EMAIL_ADDRESS: '',
        EMAIL_DOMAIN: 'fallback.com',
      },
    }))

    const { getFromEmailAddress } = await import('./utils')
    const result = getFromEmailAddress()

    expect(result).toBe('noreply@fallback.com')
  })

  it('should handle whitespace-only FROM_EMAIL_ADDRESS by falling back to EMAIL_DOMAIN', async () => {
    vi.doMock('@/lib/core/config/env', () => ({
      env: {
        FROM_EMAIL_ADDRESS: '   ',
        EMAIL_DOMAIN: 'fallback.com',
      },
    }))

    const { getFromEmailAddress } = await import('./utils')
    const result = getFromEmailAddress()

    expect(result).toBe('noreply@fallback.com')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/messaging/email/utils.ts

```typescript
import { env } from '@/lib/core/config/env'
import { getEmailDomain } from '@/lib/core/utils/urls'

/**
 * Get the from email address, preferring FROM_EMAIL_ADDRESS over EMAIL_DOMAIN
 */
export function getFromEmailAddress(): string {
  if (env.FROM_EMAIL_ADDRESS?.trim()) {
    return env.FROM_EMAIL_ADDRESS
  }
  // Fallback to constructing from EMAIL_DOMAIN
  return `noreply@${env.EMAIL_DOMAIN || getEmailDomain()}`
}
```

--------------------------------------------------------------------------------

---[FILE: validation.test.ts]---
Location: sim-main/apps/sim/lib/messaging/email/validation.test.ts

```typescript
import { describe, expect, it } from 'vitest'
import { quickValidateEmail, validateEmail } from '@/lib/messaging/email/validation'

describe('Email Validation', () => {
  describe('validateEmail', () => {
    it.concurrent('should validate a correct email', async () => {
      const result = await validateEmail('user@example.com')
      expect(result.isValid).toBe(true)
      expect(result.checks.syntax).toBe(true)
      expect(result.checks.disposable).toBe(true)
    })

    it.concurrent('should reject invalid syntax', async () => {
      const result = await validateEmail('invalid-email')
      expect(result.isValid).toBe(false)
      expect(result.reason).toBe('Invalid email format')
      expect(result.checks.syntax).toBe(false)
    })

    it.concurrent('should reject disposable email addresses', async () => {
      const result = await validateEmail('test@10minutemail.com')
      expect(result.isValid).toBe(false)
      expect(result.reason).toBe('Disposable email addresses are not allowed')
      expect(result.checks.disposable).toBe(false)
    })

    it.concurrent('should accept legitimate business emails', async () => {
      const legitimateEmails = [
        'test@gmail.com',
        'no-reply@yahoo.com',
        'user12345@outlook.com',
        'longusernamehere@gmail.com',
      ]

      for (const email of legitimateEmails) {
        const result = await validateEmail(email)
        expect(result.isValid).toBe(true)
      }
    })

    it.concurrent('should reject consecutive dots (RFC violation)', async () => {
      const result = await validateEmail('user..name@example.com')
      expect(result.isValid).toBe(false)
      expect(result.reason).toBe('Email contains suspicious patterns')
    })

    it.concurrent('should reject very long local parts (RFC violation)', async () => {
      const longLocalPart = 'a'.repeat(65)
      const result = await validateEmail(`${longLocalPart}@example.com`)
      expect(result.isValid).toBe(false)
      expect(result.reason).toBe('Email contains suspicious patterns')
    })
  })

  describe('quickValidateEmail', () => {
    it.concurrent('should validate quickly without MX check', () => {
      const result = quickValidateEmail('user@example.com')
      expect(result.isValid).toBe(true)
      expect(result.checks.mxRecord).toBe(true) // Skipped, so assumed true
      expect(result.confidence).toBe('medium')
    })

    it.concurrent('should reject invalid emails quickly', () => {
      const result = quickValidateEmail('invalid-email')
      expect(result.isValid).toBe(false)
      expect(result.reason).toBe('Invalid email format')
    })

    it.concurrent('should reject disposable emails quickly', () => {
      const result = quickValidateEmail('test@tempmail.org')
      expect(result.isValid).toBe(false)
      expect(result.reason).toBe('Disposable email addresses are not allowed')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: validation.ts]---
Location: sim-main/apps/sim/lib/messaging/email/validation.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('EmailValidation')

export interface EmailValidationResult {
  isValid: boolean
  reason?: string
  confidence: 'high' | 'medium' | 'low'
  checks: {
    syntax: boolean
    domain: boolean
    mxRecord: boolean
    disposable: boolean
  }
}

// Common disposable email domains (subset - can be expanded)
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'yopmail.com',
  'temp-mail.org',
  'throwaway.email',
  'getnada.com',
  '10minutemail.net',
  'temporary-mail.net',
  'fakemailgenerator.com',
  'sharklasers.com',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'tempail.com',
  'tempr.email',
  'dispostable.com',
  'emailondeck.com',
])

/**
 * Validates email syntax using RFC 5322 compliant regex
 */
function validateEmailSyntax(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Checks if domain has valid MX records (server-side only)
 */
async function checkMXRecord(domain: string): Promise<boolean> {
  // Skip MX check on client-side (browser)
  if (typeof window !== 'undefined') {
    return true // Assume valid on client-side
  }

  try {
    const { promisify } = await import('util')
    const dns = await import('dns')
    const resolveMx = promisify(dns.resolveMx)

    const mxRecords = await resolveMx(domain)
    return mxRecords && mxRecords.length > 0
  } catch (error) {
    logger.debug('MX record check failed', { domain, error })
    return false
  }
}

/**
 * Checks if email is from a known disposable email provider
 */
function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false
}

/**
 * Checks for obvious patterns that indicate invalid emails
 */
function hasInvalidPatterns(email: string): boolean {
  // Check for consecutive dots (RFC violation)
  if (email.includes('..')) return true

  // Check for local part length (RFC limit is 64 characters)
  const localPart = email.split('@')[0]
  if (localPart && localPart.length > 64) return true

  return false
}

/**
 * Validates an email address comprehensively
 */
export async function validateEmail(email: string): Promise<EmailValidationResult> {
  const checks = {
    syntax: false,
    domain: false,
    mxRecord: false,
    disposable: false,
  }

  try {
    // 1. Basic syntax validation
    checks.syntax = validateEmailSyntax(email)
    if (!checks.syntax) {
      return {
        isValid: false,
        reason: 'Invalid email format',
        confidence: 'high',
        checks,
      }
    }

    const domain = email.split('@')[1]?.toLowerCase()
    if (!domain) {
      return {
        isValid: false,
        reason: 'Missing domain',
        confidence: 'high',
        checks,
      }
    }

    // 2. Check for disposable email first (more specific)
    checks.disposable = !isDisposableEmail(email)
    if (!checks.disposable) {
      return {
        isValid: false,
        reason: 'Disposable email addresses are not allowed',
        confidence: 'high',
        checks,
      }
    }

    // 3. Check for invalid patterns
    if (hasInvalidPatterns(email)) {
      return {
        isValid: false,
        reason: 'Email contains suspicious patterns',
        confidence: 'high',
        checks,
      }
    }

    // 4. Domain validation - check for obvious invalid domains
    checks.domain = domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.')
    if (!checks.domain) {
      return {
        isValid: false,
        reason: 'Invalid domain format',
        confidence: 'high',
        checks,
      }
    }

    // 5. MX record check (with timeout)
    try {
      const mxCheckPromise = checkMXRecord(domain)
      const timeoutPromise = new Promise<boolean>((_, reject) =>
        setTimeout(() => reject(new Error('MX check timeout')), 5000)
      )

      checks.mxRecord = await Promise.race([mxCheckPromise, timeoutPromise])
    } catch (error) {
      logger.debug('MX record check failed or timed out', { domain, error })
      checks.mxRecord = false
    }

    // Determine overall validity and confidence
    if (!checks.mxRecord) {
      return {
        isValid: false,
        reason: 'Domain does not accept emails (no MX records)',
        confidence: 'high',
        checks,
      }
    }

    return {
      isValid: true,
      confidence: 'high',
      checks,
    }
  } catch (error) {
    logger.error('Email validation error', { email, error })
    return {
      isValid: false,
      reason: 'Validation service temporarily unavailable',
      confidence: 'low',
      checks,
    }
  }
}

/**
 * Quick validation for high-volume scenarios (skips MX check)
 */
export function quickValidateEmail(email: string): EmailValidationResult {
  const checks = {
    syntax: false,
    domain: false,
    mxRecord: true, // Skip MX check for performance
    disposable: false,
  }

  checks.syntax = validateEmailSyntax(email)
  if (!checks.syntax) {
    return {
      isValid: false,
      reason: 'Invalid email format',
      confidence: 'high',
      checks,
    }
  }

  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) {
    return {
      isValid: false,
      reason: 'Missing domain',
      confidence: 'high',
      checks,
    }
  }

  checks.disposable = !isDisposableEmail(email)
  if (!checks.disposable) {
    return {
      isValid: false,
      reason: 'Disposable email addresses are not allowed',
      confidence: 'high',
      checks,
    }
  }

  if (hasInvalidPatterns(email)) {
    return {
      isValid: false,
      reason: 'Email contains suspicious patterns',
      confidence: 'medium',
      checks,
    }
  }

  checks.domain = domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.')
  if (!checks.domain) {
    return {
      isValid: false,
      reason: 'Invalid domain format',
      confidence: 'high',
      checks,
    }
  }

  return {
    isValid: true,
    confidence: 'medium',
    checks,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: sim-main/apps/sim/lib/messaging/sms/service.ts

```typescript
import { Twilio } from 'twilio'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('SMSService')

export interface SMSOptions {
  to: string | string[]
  body: string
  from?: string
}

export interface BatchSMSOptions {
  messages: SMSOptions[]
}

export interface SMSResponseData {
  sid?: string
  status?: string
  to?: string
  from?: string
  id?: string
  results?: SendSMSResult[]
  count?: number
}

export interface SendSMSResult {
  success: boolean
  message: string
  data?: SMSResponseData
}

export interface BatchSendSMSResult {
  success: boolean
  message: string
  results: SendSMSResult[]
  data?: SMSResponseData
}

const twilioAccountSid = env.TWILIO_ACCOUNT_SID
const twilioAuthToken = env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = env.TWILIO_PHONE_NUMBER

const twilioClient =
  twilioAccountSid &&
  twilioAuthToken &&
  twilioAccountSid.trim() !== '' &&
  twilioAuthToken.trim() !== ''
    ? new Twilio(twilioAccountSid, twilioAuthToken)
    : null

export async function sendSMS(options: SMSOptions): Promise<SendSMSResult> {
  try {
    const { to, body, from } = options
    const fromNumber = from || twilioPhoneNumber

    if (!fromNumber || fromNumber.trim() === '') {
      logger.error('No Twilio phone number configured')
      return {
        success: false,
        message: 'SMS sending failed: No from phone number configured',
      }
    }

    if (!twilioClient) {
      logger.error('SMS sending failed: Twilio not configured', {
        to,
        body: `${body.substring(0, 50)}...`,
        from: fromNumber,
      })
      return {
        success: false,
        message:
          'SMS sending failed: Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in your environment variables.',
      }
    }

    if (typeof to === 'string') {
      return await sendSingleSMS(to, body, fromNumber)
    }

    const results: SendSMSResult[] = []
    for (const phoneNumber of to) {
      try {
        const result = await sendSingleSMS(phoneNumber, body, fromNumber)
        results.push(result)
      } catch (error) {
        results.push({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to send SMS',
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    return {
      success: successCount === results.length,
      message:
        successCount === results.length
          ? 'All SMS messages sent successfully'
          : `${successCount}/${results.length} SMS messages sent successfully`,
      data: { results, count: successCount },
    }
  } catch (error) {
    logger.error('Error sending SMS:', error)
    return {
      success: false,
      message: 'Failed to send SMS',
    }
  }
}

async function sendSingleSMS(to: string, body: string, from: string): Promise<SendSMSResult> {
  if (!twilioClient) {
    throw new Error('Twilio client not configured')
  }

  try {
    const message = await twilioClient.messages.create({
      body,
      from,
      to,
    })

    logger.info('SMS sent successfully:', {
      to,
      from,
      messageSid: message.sid,
      status: message.status,
    })

    return {
      success: true,
      message: 'SMS sent successfully via Twilio',
      data: {
        sid: message.sid,
        status: message.status,
        to: message.to,
        from: message.from,
      },
    }
  } catch (error) {
    logger.error('Failed to send SMS via Twilio:', error)
    throw error
  }
}

export async function sendBatchSMS(options: BatchSMSOptions): Promise<BatchSendSMSResult> {
  try {
    const results: SendSMSResult[] = []

    logger.info('Sending batch SMS messages')
    for (const smsOptions of options.messages) {
      try {
        const result = await sendSMS(smsOptions)
        results.push(result)
      } catch (error) {
        results.push({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to send SMS',
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    return {
      success: successCount === results.length,
      message:
        successCount === results.length
          ? 'All batch SMS messages sent successfully'
          : `${successCount}/${results.length} SMS messages sent successfully`,
      results,
      data: { count: successCount },
    }
  } catch (error) {
    logger.error('Error in batch SMS sending:', error)
    return {
      success: false,
      message: 'Failed to send batch SMS messages',
      results: [],
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: alert-rules.ts]---
Location: sim-main/apps/sim/lib/notifications/alert-rules.ts

```typescript
import { db } from '@sim/db'
import { workflowExecutionLogs } from '@sim/db/schema'
import { and, avg, count, desc, eq, gte } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('AlertRules')

/**
 * Alert rule types supported by the notification system
 */
export type AlertRuleType =
  | 'consecutive_failures'
  | 'failure_rate'
  | 'latency_threshold'
  | 'latency_spike'
  | 'cost_threshold'
  | 'no_activity'
  | 'error_count'

/**
 * Configuration for alert rules
 */
export interface AlertConfig {
  rule: AlertRuleType
  consecutiveFailures?: number
  failureRatePercent?: number
  windowHours?: number
  durationThresholdMs?: number
  latencySpikePercent?: number
  costThresholdDollars?: number
  inactivityHours?: number
  errorCountThreshold?: number
}

/**
 * Metadata for alert rule types
 */
export interface AlertRuleDefinition {
  type: AlertRuleType
  name: string
  description: string
  requiredFields: (keyof AlertConfig)[]
  defaultValues: Partial<AlertConfig>
}

/**
 * Registry of all alert rule definitions
 */
export const ALERT_RULES: Record<AlertRuleType, AlertRuleDefinition> = {
  consecutive_failures: {
    type: 'consecutive_failures',
    name: 'Consecutive Failures',
    description: 'Alert after X consecutive failed executions',
    requiredFields: ['consecutiveFailures'],
    defaultValues: { consecutiveFailures: 3 },
  },
  failure_rate: {
    type: 'failure_rate',
    name: 'Failure Rate',
    description: 'Alert when failure rate exceeds X% over a time window',
    requiredFields: ['failureRatePercent', 'windowHours'],
    defaultValues: { failureRatePercent: 50, windowHours: 24 },
  },
  latency_threshold: {
    type: 'latency_threshold',
    name: 'Latency Threshold',
    description: 'Alert when execution duration exceeds a threshold',
    requiredFields: ['durationThresholdMs'],
    defaultValues: { durationThresholdMs: 30000 },
  },
  latency_spike: {
    type: 'latency_spike',
    name: 'Latency Spike',
    description: 'Alert when execution is X% slower than average',
    requiredFields: ['latencySpikePercent', 'windowHours'],
    defaultValues: { latencySpikePercent: 100, windowHours: 24 },
  },
  cost_threshold: {
    type: 'cost_threshold',
    name: 'Cost Threshold',
    description: 'Alert when execution cost exceeds a threshold',
    requiredFields: ['costThresholdDollars'],
    defaultValues: { costThresholdDollars: 1 },
  },
  no_activity: {
    type: 'no_activity',
    name: 'No Activity',
    description: 'Alert when no executions occur within a time window',
    requiredFields: ['inactivityHours'],
    defaultValues: { inactivityHours: 24 },
  },
  error_count: {
    type: 'error_count',
    name: 'Error Count',
    description: 'Alert when error count exceeds threshold within time window',
    requiredFields: ['errorCountThreshold', 'windowHours'],
    defaultValues: { errorCountThreshold: 10, windowHours: 1 },
  },
}

/**
 * Cooldown period in hours to prevent alert spam
 */
export const ALERT_COOLDOWN_HOURS = 1

/**
 * Minimum executions required for rate-based alerts
 */
export const MIN_EXECUTIONS_FOR_RATE_ALERT = 5

/**
 * Validates an alert configuration
 */
export function validateAlertConfig(config: AlertConfig): { valid: boolean; error?: string } {
  const definition = ALERT_RULES[config.rule]
  if (!definition) {
    return { valid: false, error: `Unknown alert rule: ${config.rule}` }
  }

  for (const field of definition.requiredFields) {
    if (config[field] === undefined || config[field] === null) {
      return { valid: false, error: `Missing required field: ${field}` }
    }
  }

  return { valid: true }
}

/**
 * Checks if a subscription is within its cooldown period
 */
export function isInCooldown(lastAlertAt: Date | null): boolean {
  if (!lastAlertAt) return false
  const cooldownEnd = new Date(lastAlertAt.getTime() + ALERT_COOLDOWN_HOURS * 60 * 60 * 1000)
  return new Date() < cooldownEnd
}

/**
 * Context passed to alert check functions
 */
export interface AlertCheckContext {
  workflowId: string
  executionId: string
  status: 'success' | 'error'
  durationMs: number
  cost: number
}

/**
 * Check if consecutive failures threshold is met
 */
async function checkConsecutiveFailures(workflowId: string, threshold: number): Promise<boolean> {
  const recentLogs = await db
    .select({ level: workflowExecutionLogs.level })
    .from(workflowExecutionLogs)
    .where(eq(workflowExecutionLogs.workflowId, workflowId))
    .orderBy(desc(workflowExecutionLogs.createdAt))
    .limit(threshold)

  if (recentLogs.length < threshold) return false

  return recentLogs.every((log) => log.level === 'error')
}

/**
 * Check if failure rate exceeds threshold
 */
async function checkFailureRate(
  workflowId: string,
  ratePercent: number,
  windowHours: number
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowHours * 60 * 60 * 1000)

  const logs = await db
    .select({
      level: workflowExecutionLogs.level,
      createdAt: workflowExecutionLogs.createdAt,
    })
    .from(workflowExecutionLogs)
    .where(
      and(
        eq(workflowExecutionLogs.workflowId, workflowId),
        gte(workflowExecutionLogs.createdAt, windowStart)
      )
    )
    .orderBy(workflowExecutionLogs.createdAt)

  if (logs.length < MIN_EXECUTIONS_FOR_RATE_ALERT) return false

  const oldestLog = logs[0]
  if (oldestLog && oldestLog.createdAt > windowStart) {
    return false
  }

  const errorCount = logs.filter((log) => log.level === 'error').length
  const failureRate = (errorCount / logs.length) * 100

  return failureRate >= ratePercent
}

/**
 * Check if execution duration exceeds threshold
 */
function checkLatencyThreshold(durationMs: number, thresholdMs: number): boolean {
  return durationMs > thresholdMs
}

/**
 * Check if execution duration is significantly above average
 */
async function checkLatencySpike(
  workflowId: string,
  currentDurationMs: number,
  spikePercent: number,
  windowHours: number
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowHours * 60 * 60 * 1000)

  const result = await db
    .select({
      avgDuration: avg(workflowExecutionLogs.totalDurationMs),
      count: count(),
    })
    .from(workflowExecutionLogs)
    .where(
      and(
        eq(workflowExecutionLogs.workflowId, workflowId),
        gte(workflowExecutionLogs.createdAt, windowStart)
      )
    )

  const avgDuration = result[0]?.avgDuration
  const execCount = result[0]?.count || 0

  if (!avgDuration || execCount < MIN_EXECUTIONS_FOR_RATE_ALERT) return false

  const avgMs = Number(avgDuration)
  const threshold = avgMs * (1 + spikePercent / 100)

  return currentDurationMs > threshold
}

/**
 * Check if execution cost exceeds threshold
 */
function checkCostThreshold(cost: number, thresholdDollars: number): boolean {
  return cost > thresholdDollars
}

/**
 * Check if error count exceeds threshold within window
 */
async function checkErrorCount(
  workflowId: string,
  threshold: number,
  windowHours: number
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowHours * 60 * 60 * 1000)

  const result = await db
    .select({ count: count() })
    .from(workflowExecutionLogs)
    .where(
      and(
        eq(workflowExecutionLogs.workflowId, workflowId),
        eq(workflowExecutionLogs.level, 'error'),
        gte(workflowExecutionLogs.createdAt, windowStart)
      )
    )

  const errorCount = result[0]?.count || 0
  return errorCount >= threshold
}

/**
 * Evaluates if an alert should be triggered based on the configuration
 */
export async function shouldTriggerAlert(
  config: AlertConfig,
  context: AlertCheckContext,
  lastAlertAt: Date | null
): Promise<boolean> {
  if (isInCooldown(lastAlertAt)) {
    logger.debug('Subscription in cooldown, skipping alert check')
    return false
  }

  const { rule } = config
  const { workflowId, status, durationMs, cost } = context

  switch (rule) {
    case 'consecutive_failures':
      if (status !== 'error') return false
      return checkConsecutiveFailures(workflowId, config.consecutiveFailures!)

    case 'failure_rate':
      if (status !== 'error') return false
      return checkFailureRate(workflowId, config.failureRatePercent!, config.windowHours!)

    case 'latency_threshold':
      return checkLatencyThreshold(durationMs, config.durationThresholdMs!)

    case 'latency_spike':
      return checkLatencySpike(
        workflowId,
        durationMs,
        config.latencySpikePercent!,
        config.windowHours!
      )

    case 'cost_threshold':
      return checkCostThreshold(cost, config.costThresholdDollars!)

    case 'no_activity':
      // no_activity alerts are handled by the hourly polling job, not execution events
      return false

    case 'error_count':
      if (status !== 'error') return false
      return checkErrorCount(workflowId, config.errorCountThreshold!, config.windowHours!)

    default:
      logger.warn(`Unknown alert rule: ${rule}`)
      return false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: inactivity-polling.ts]---
Location: sim-main/apps/sim/lib/notifications/inactivity-polling.ts

```typescript
import { db } from '@sim/db'
import {
  workflow,
  workflowExecutionLogs,
  workspaceNotificationDelivery,
  workspaceNotificationSubscription,
} from '@sim/db/schema'
import { and, eq, gte, inArray, sql } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { isTriggerDevEnabled } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'
import {
  executeNotificationDelivery,
  workspaceNotificationDeliveryTask,
} from '@/background/workspace-notification-delivery'
import type { AlertConfig } from './alert-rules'
import { isInCooldown } from './alert-rules'

const logger = createLogger('InactivityPolling')

interface InactivityCheckResult {
  subscriptionId: string
  workflowId: string
  triggered: boolean
  reason?: string
}

/**
 * Checks a single workflow for inactivity and triggers notification if needed
 */
async function checkWorkflowInactivity(
  subscription: typeof workspaceNotificationSubscription.$inferSelect,
  workflowId: string,
  alertConfig: AlertConfig
): Promise<InactivityCheckResult> {
  const result: InactivityCheckResult = {
    subscriptionId: subscription.id,
    workflowId,
    triggered: false,
  }

  if (isInCooldown(subscription.lastAlertAt)) {
    result.reason = 'in_cooldown'
    return result
  }

  const windowStart = new Date(Date.now() - (alertConfig.inactivityHours || 24) * 60 * 60 * 1000)
  const triggerFilter = subscription.triggerFilter
  const levelFilter = subscription.levelFilter

  const recentLogs = await db
    .select({ id: workflowExecutionLogs.id })
    .from(workflowExecutionLogs)
    .where(
      and(
        eq(workflowExecutionLogs.workflowId, workflowId),
        gte(workflowExecutionLogs.createdAt, windowStart),
        inArray(workflowExecutionLogs.trigger, triggerFilter),
        inArray(workflowExecutionLogs.level, levelFilter)
      )
    )
    .limit(1)

  if (recentLogs.length > 0) {
    result.reason = 'has_activity'
    return result
  }

  const [workflowData] = await db
    .select({
      name: workflow.name,
      workspaceId: workflow.workspaceId,
    })
    .from(workflow)
    .where(eq(workflow.id, workflowId))
    .limit(1)

  if (!workflowData || !workflowData.workspaceId) {
    result.reason = 'workflow_not_found'
    return result
  }

  await db
    .update(workspaceNotificationSubscription)
    .set({ lastAlertAt: new Date() })
    .where(eq(workspaceNotificationSubscription.id, subscription.id))

  const deliveryId = uuidv4()

  await db.insert(workspaceNotificationDelivery).values({
    id: deliveryId,
    subscriptionId: subscription.id,
    workflowId,
    executionId: `inactivity_${Date.now()}`,
    status: 'pending',
    attempts: 0,
    nextAttemptAt: new Date(),
  })

  const now = new Date().toISOString()
  const mockLog = {
    id: `inactivity_log_${uuidv4()}`,
    workflowId,
    executionId: `inactivity_${Date.now()}`,
    stateSnapshotId: '',
    level: 'info' as const,
    trigger: 'system' as const,
    startedAt: now,
    endedAt: now,
    totalDurationMs: 0,
    executionData: {},
    cost: { total: 0 },
    workspaceId: workflowData.workspaceId,
    createdAt: now,
  }

  const payload = {
    deliveryId,
    subscriptionId: subscription.id,
    notificationType: subscription.notificationType,
    log: mockLog,
    alertConfig,
  }

  if (isTriggerDevEnabled) {
    await workspaceNotificationDeliveryTask.trigger(payload)
  } else {
    void executeNotificationDelivery(payload).catch((error) => {
      logger.error(`Direct notification delivery failed for ${deliveryId}`, { error })
    })
  }

  result.triggered = true
  result.reason = 'alert_sent'

  logger.info(`Inactivity alert triggered for workflow ${workflowId}`, {
    subscriptionId: subscription.id,
    inactivityHours: alertConfig.inactivityHours,
  })

  return result
}

/**
 * Polls all active no_activity subscriptions and triggers alerts as needed
 */
export async function pollInactivityAlerts(): Promise<{
  total: number
  triggered: number
  skipped: number
  details: InactivityCheckResult[]
}> {
  logger.info('Starting inactivity alert polling')

  const subscriptions = await db
    .select()
    .from(workspaceNotificationSubscription)
    .where(
      and(
        eq(workspaceNotificationSubscription.active, true),
        sql`${workspaceNotificationSubscription.alertConfig}->>'rule' = 'no_activity'`
      )
    )

  if (subscriptions.length === 0) {
    logger.info('No active no_activity subscriptions found')
    return { total: 0, triggered: 0, skipped: 0, details: [] }
  }

  logger.info(`Found ${subscriptions.length} no_activity subscriptions to check`)

  const results: InactivityCheckResult[] = []
  let triggered = 0
  let skipped = 0

  for (const subscription of subscriptions) {
    const alertConfig = subscription.alertConfig as AlertConfig
    if (!alertConfig || alertConfig.rule !== 'no_activity') {
      continue
    }

    let workflowIds: string[] = []

    if (subscription.allWorkflows) {
      const workflows = await db
        .select({ id: workflow.id })
        .from(workflow)
        .where(eq(workflow.workspaceId, subscription.workspaceId))

      workflowIds = workflows.map((w) => w.id)
    } else {
      workflowIds = subscription.workflowIds || []
    }

    for (const workflowId of workflowIds) {
      const result = await checkWorkflowInactivity(subscription, workflowId, alertConfig)
      results.push(result)

      if (result.triggered) {
        triggered++
      } else {
        skipped++
      }
    }
  }

  logger.info(`Inactivity polling completed: ${triggered} alerts triggered, ${skipped} skipped`)

  return {
    total: results.length,
    triggered,
    skipped,
    details: results,
  }
}
```

--------------------------------------------------------------------------------

````
