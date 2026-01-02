---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 499
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 499 of 933)

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

---[FILE: onedollarstats.tsx]---
Location: sim-main/apps/sim/components/analytics/onedollarstats.tsx
Signals: React

```typescript
'use client'

import { useEffect } from 'react'
import { configure } from 'onedollarstats'
import { env } from '@/lib/core/config/env'

export function OneDollarStats() {
  useEffect(() => {
    const shouldInitialize = !!env.DRIZZLE_ODS_API_KEY

    if (!shouldInitialize) {
      return
    }

    configure({
      collectorUrl: 'https://collector.onedollarstats.com/events',
      autocollect: true,
      hashRouting: true,
    })
  }, [])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: base-styles.ts]---
Location: sim-main/apps/sim/components/emails/base-styles.ts

```typescript
// Base styles for all email templates

export const baseStyles = {
  fontFamily: 'HelveticaNeue, Helvetica, Arial, sans-serif',
  main: {
    backgroundColor: '#f5f5f7',
    fontFamily: 'HelveticaNeue, Helvetica, Arial, sans-serif',
  },
  container: {
    maxWidth: '580px',
    margin: '30px auto',
    backgroundColor: '#ffffff',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  header: {
    padding: '30px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  content: {
    padding: '5px 30px 20px 30px',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#333333',
    margin: '16px 0',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#6F3DFA',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '12px 30px',
    borderRadius: '5px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    margin: '20px 0',
  },
  link: {
    color: '#6F3DFA',
    textDecoration: 'underline',
  },
  footer: {
    maxWidth: '580px',
    margin: '0 auto',
    padding: '20px 0',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '12px',
    color: '#666666',
    margin: '0',
  },
  codeContainer: {
    margin: '20px 0',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    border: '1px solid #eee',
    textAlign: 'center' as const,
  },
  code: {
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '4px',
    color: '#333333',
  },
  sectionsBorders: {
    width: '100%',
    display: 'flex',
  },
  sectionBorder: {
    borderBottom: '1px solid #eeeeee',
    width: '249px',
  },
  sectionCenter: {
    borderBottom: '1px solid #6F3DFA',
    width: '102px',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: batch-invitation-email.tsx]---
Location: sim-main/apps/sim/components/emails/batch-invitation-email.tsx

```typescript
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { baseStyles } from '@/components/emails/base-styles'
import EmailFooter from '@/components/emails/footer'
import { getBrandConfig } from '@/lib/branding/branding'
import { getBaseUrl } from '@/lib/core/utils/urls'

interface WorkspaceInvitation {
  workspaceId: string
  workspaceName: string
  permission: 'admin' | 'write' | 'read'
}

interface BatchInvitationEmailProps {
  inviterName: string
  organizationName: string
  organizationRole: 'admin' | 'member'
  workspaceInvitations: WorkspaceInvitation[]
  acceptUrl: string
}

const getPermissionLabel = (permission: string) => {
  switch (permission) {
    case 'admin':
      return 'Admin (full access)'
    case 'write':
      return 'Editor (can edit workflows)'
    case 'read':
      return 'Viewer (read-only access)'
    default:
      return permission
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Admin'
    case 'member':
      return 'Member'
    default:
      return role
  }
}

export const BatchInvitationEmail = ({
  inviterName = 'Someone',
  organizationName = 'the team',
  organizationRole = 'member',
  workspaceInvitations = [],
  acceptUrl,
}: BatchInvitationEmailProps) => {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()
  const hasWorkspaces = workspaceInvitations.length > 0

  return (
    <Html>
      <Head />
      <Body style={baseStyles.main}>
        <Preview>
          You've been invited to join {organizationName}
          {hasWorkspaces ? ` and ${workspaceInvitations.length} workspace(s)` : ''}
        </Preview>
        <Container style={baseStyles.container}>
          <Section style={{ padding: '30px 0', textAlign: 'center' }}>
            <Row>
              <Column style={{ textAlign: 'center' }}>
                <Img
                  src={brand.logoUrl || `${baseUrl}/logo/reverse/text/medium.png`}
                  width='114'
                  alt={brand.name}
                  style={{
                    margin: '0 auto',
                  }}
                />
              </Column>
            </Row>
          </Section>

          <Section style={baseStyles.sectionsBorders}>
            <Row>
              <Column style={baseStyles.sectionBorder} />
              <Column style={baseStyles.sectionCenter} />
              <Column style={baseStyles.sectionBorder} />
            </Row>
          </Section>

          <Section style={baseStyles.content}>
            <Text style={baseStyles.paragraph}>Hello,</Text>
            <Text style={baseStyles.paragraph}>
              <strong>{inviterName}</strong> has invited you to join{' '}
              <strong>{organizationName}</strong> on Sim.
            </Text>

            {/* Team Role Information */}
            <Text style={baseStyles.paragraph}>
              <strong>Team Role:</strong> {getRoleLabel(organizationRole)}
            </Text>
            <Text style={baseStyles.paragraph}>
              {organizationRole === 'admin'
                ? "As a Team Admin, you'll be able to manage team members, billing, and workspace access."
                : "As a Team Member, you'll have access to shared team billing and can be invited to workspaces."}
            </Text>

            {/* Workspace Invitations */}
            {hasWorkspaces && (
              <>
                <Text style={baseStyles.paragraph}>
                  <strong>
                    Workspace Access ({workspaceInvitations.length} workspace
                    {workspaceInvitations.length !== 1 ? 's' : ''}):
                  </strong>
                </Text>
                {workspaceInvitations.map((ws) => (
                  <Text
                    key={ws.workspaceId}
                    style={{ ...baseStyles.paragraph, marginLeft: '20px' }}
                  >
                    • <strong>{ws.workspaceName}</strong> - {getPermissionLabel(ws.permission)}
                  </Text>
                ))}
              </>
            )}

            <Link href={acceptUrl} style={{ textDecoration: 'none' }}>
              <Text style={baseStyles.button}>Accept Invitation</Text>
            </Link>

            <Text style={baseStyles.paragraph}>
              By accepting this invitation, you'll join {organizationName}
              {hasWorkspaces
                ? ` and gain access to ${workspaceInvitations.length} workspace(s)`
                : ''}
              .
            </Text>

            <Text style={baseStyles.paragraph}>
              This invitation will expire in 7 days. If you didn't expect this invitation, you can
              safely ignore this email.
            </Text>

            <Text style={baseStyles.paragraph}>
              Best regards,
              <br />
              The Sim Team
            </Text>
          </Section>
        </Container>

        <EmailFooter baseUrl={baseUrl} />
      </Body>
    </Html>
  )
}

export default BatchInvitationEmail
```

--------------------------------------------------------------------------------

---[FILE: footer.tsx]---
Location: sim-main/apps/sim/components/emails/footer.tsx

```typescript
import { Container, Img, Link, Section, Text } from '@react-email/components'
import { getBrandConfig } from '@/lib/branding/branding'
import { isHosted } from '@/lib/core/config/feature-flags'
import { getBaseUrl } from '@/lib/core/utils/urls'

interface UnsubscribeOptions {
  unsubscribeToken?: string
  email?: string
}

interface EmailFooterProps {
  baseUrl?: string
  unsubscribe?: UnsubscribeOptions
}

export const EmailFooter = ({ baseUrl = getBaseUrl(), unsubscribe }: EmailFooterProps) => {
  const brand = getBrandConfig()

  return (
    <Container>
      <Section style={{ maxWidth: '580px', margin: '0 auto', padding: '20px 0' }}>
        <table style={{ width: '100%' }}>
          <tr>
            <td align='center'>
              <table cellPadding={0} cellSpacing={0} style={{ border: 0 }}>
                <tr>
                  <td align='center' style={{ padding: '0 8px' }}>
                    <Link href='https://x.com/simdotai' rel='noopener noreferrer'>
                      <Img src={`${baseUrl}/static/x-icon.png`} width='24' height='24' alt='X' />
                    </Link>
                  </td>
                  <td align='center' style={{ padding: '0 8px' }}>
                    <Link href='https://discord.gg/Hr4UWYEcTT' rel='noopener noreferrer'>
                      <Img
                        src={`${baseUrl}/static/discord-icon.png`}
                        width='24'
                        height='24'
                        alt='Discord'
                      />
                    </Link>
                  </td>
                  <td align='center' style={{ padding: '0 8px' }}>
                    <Link href='https://github.com/simstudioai/sim' rel='noopener noreferrer'>
                      <Img
                        src={`${baseUrl}/static/github-icon.png`}
                        width='24'
                        height='24'
                        alt='GitHub'
                      />
                    </Link>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align='center' style={{ paddingTop: '12px' }}>
              <Text
                style={{
                  fontSize: '12px',
                  color: '#706a7b',
                  margin: '8px 0 0 0',
                }}
              >
                © {new Date().getFullYear()} {brand.name}, All Rights Reserved
                <br />
                If you have any questions, please contact us at{' '}
                <a
                  href={`mailto:${brand.supportEmail}`}
                  style={{
                    color: '#706a7b !important',
                    textDecoration: 'underline',
                    fontWeight: 'normal',
                    fontFamily: 'HelveticaNeue, Helvetica, Arial, sans-serif',
                  }}
                >
                  {brand.supportEmail}
                </a>
                {isHosted && (
                  <>
                    <br />
                    Sim, 80 Langton St, San Francisco, CA 94133, USA
                  </>
                )}
              </Text>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%', marginTop: '4px' }}>
                <tr>
                  <td align='center'>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#706a7b',
                        margin: '8px 0 0 0',
                        fontFamily: 'HelveticaNeue, Helvetica, Arial, sans-serif',
                      }}
                    >
                      <a
                        href={`${baseUrl}/privacy`}
                        style={{
                          color: '#706a7b !important',
                          textDecoration: 'underline',
                          fontWeight: 'normal',
                          fontFamily: 'HelveticaNeue, Helvetica, Arial, sans-serif',
                        }}
                        rel='noopener noreferrer'
                      >
                        Privacy Policy
                      </a>{' '}
                      •{' '}
                      <a
                        href={`${baseUrl}/terms`}
                        style={{
                          color: '#706a7b !important',
                          textDecoration: 'underline',
                          fontWeight: 'normal',
                          fontFamily: 'HelveticaNeue, Helvetica, Arial, sans-serif',
                        }}
                        rel='noopener noreferrer'
                      >
                        Terms of Service
                      </a>{' '}
                      •{' '}
                      <a
                        href={
                          unsubscribe?.unsubscribeToken && unsubscribe?.email
                            ? `${baseUrl}/unsubscribe?token=${unsubscribe.unsubscribeToken}&email=${encodeURIComponent(unsubscribe.email)}`
                            : `mailto:${brand.supportEmail}?subject=Unsubscribe%20Request&body=Please%20unsubscribe%20me%20from%20all%20emails.`
                        }
                        style={{
                          color: '#706a7b !important',
                          textDecoration: 'underline',
                          fontWeight: 'normal',
                          fontFamily: 'HelveticaNeue, Helvetica, Arial, sans-serif',
                        }}
                        rel='noopener noreferrer'
                      >
                        Unsubscribe
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </Section>
    </Container>
  )
}

export default EmailFooter
```

--------------------------------------------------------------------------------

---[FILE: help-confirmation-email.tsx]---
Location: sim-main/apps/sim/components/emails/help-confirmation-email.tsx

```typescript
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { format } from 'date-fns'
import { baseStyles } from '@/components/emails/base-styles'
import EmailFooter from '@/components/emails/footer'
import { getBrandConfig } from '@/lib/branding/branding'
import { getBaseUrl } from '@/lib/core/utils/urls'

interface HelpConfirmationEmailProps {
  userEmail?: string
  type?: 'bug' | 'feedback' | 'feature_request' | 'other'
  attachmentCount?: number
  submittedDate?: Date
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'bug':
      return 'Bug Report'
    case 'feedback':
      return 'Feedback'
    case 'feature_request':
      return 'Feature Request'
    case 'other':
      return 'General Inquiry'
    default:
      return 'Request'
  }
}

export const HelpConfirmationEmail = ({
  userEmail = '',
  type = 'other',
  attachmentCount = 0,
  submittedDate = new Date(),
}: HelpConfirmationEmailProps) => {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()
  const typeLabel = getTypeLabel(type)

  return (
    <Html>
      <Head />
      <Body style={baseStyles.main}>
        <Preview>Your {typeLabel.toLowerCase()} has been received</Preview>
        <Container style={baseStyles.container}>
          <Section style={{ padding: '30px 0', textAlign: 'center' }}>
            <Row>
              <Column style={{ textAlign: 'center' }}>
                <Img
                  src={brand.logoUrl || `${baseUrl}/logo/reverse/text/medium.png`}
                  width='114'
                  alt={brand.name}
                  style={{
                    margin: '0 auto',
                  }}
                />
              </Column>
            </Row>
          </Section>

          <Section style={baseStyles.sectionsBorders}>
            <Row>
              <Column style={baseStyles.sectionBorder} />
              <Column style={baseStyles.sectionCenter} />
              <Column style={baseStyles.sectionBorder} />
            </Row>
          </Section>

          <Section style={baseStyles.content}>
            <Text style={baseStyles.paragraph}>Hello,</Text>
            <Text style={baseStyles.paragraph}>
              Thank you for your <strong>{typeLabel.toLowerCase()}</strong> submission. We've
              received your request and will get back to you as soon as possible.
            </Text>

            {attachmentCount > 0 && (
              <Text style={baseStyles.paragraph}>
                You attached{' '}
                <strong>
                  {attachmentCount} image{attachmentCount > 1 ? 's' : ''}
                </strong>{' '}
                with your request.
              </Text>
            )}

            <Text style={baseStyles.paragraph}>
              We typically respond to{' '}
              {type === 'bug'
                ? 'bug reports'
                : type === 'feature_request'
                  ? 'feature requests'
                  : 'inquiries'}{' '}
              within a few hours. If you need immediate assistance, please don't hesitate to reach
              out to us directly.
            </Text>

            <Text style={baseStyles.paragraph}>
              Best regards,
              <br />
              The {brand.name} Team
            </Text>

            <Text
              style={{
                ...baseStyles.footerText,
                marginTop: '40px',
                textAlign: 'left',
                color: '#666666',
              }}
            >
              This confirmation was sent on {format(submittedDate, 'MMMM do, yyyy')} for your{' '}
              {typeLabel.toLowerCase()} submission from {userEmail}.
            </Text>
          </Section>
        </Container>

        <EmailFooter baseUrl={baseUrl} />
      </Body>
    </Html>
  )
}

export default HelpConfirmationEmail
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/components/emails/index.ts

```typescript
export * from './base-styles'
export { BatchInvitationEmail } from './batch-invitation-email'
export { EnterpriseSubscriptionEmail } from './billing/enterprise-subscription-email'
export { PlanWelcomeEmail } from './billing/plan-welcome-email'
export { UsageThresholdEmail } from './billing/usage-threshold-email'
export { default as EmailFooter } from './footer'
export { HelpConfirmationEmail } from './help-confirmation-email'
export { InvitationEmail } from './invitation-email'
export { OTPVerificationEmail } from './otp-verification-email'
export * from './render-email'
export { ResetPasswordEmail } from './reset-password-email'
export { WorkspaceInvitationEmail } from './workspace-invitation'
```

--------------------------------------------------------------------------------

---[FILE: invitation-email.tsx]---
Location: sim-main/apps/sim/components/emails/invitation-email.tsx

```typescript
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { format } from 'date-fns'
import { baseStyles } from '@/components/emails/base-styles'
import EmailFooter from '@/components/emails/footer'
import { getBrandConfig } from '@/lib/branding/branding'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'

interface InvitationEmailProps {
  inviterName?: string
  organizationName?: string
  inviteLink?: string
  invitedEmail?: string
  updatedDate?: Date
}

const logger = createLogger('InvitationEmail')

export const InvitationEmail = ({
  inviterName = 'A team member',
  organizationName = 'an organization',
  inviteLink = '',
  invitedEmail = '',
  updatedDate = new Date(),
}: InvitationEmailProps) => {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()

  // Extract invitation ID or token from inviteLink if present
  let enhancedLink = inviteLink

  // Check if link contains an ID (old format) and append token parameter if needed
  if (inviteLink && !inviteLink.includes('token=')) {
    try {
      const url = new URL(inviteLink)
      const invitationId = url.pathname.split('/').pop()
      if (invitationId) {
        enhancedLink = `${baseUrl}/invite/${invitationId}?token=${invitationId}`
      }
    } catch (e) {
      logger.error('Error parsing invite link:', e)
    }
  }

  return (
    <Html>
      <Head />
      <Body style={baseStyles.main}>
        <Preview>You've been invited to join {organizationName} on Sim</Preview>
        <Container style={baseStyles.container}>
          <Section style={{ padding: '30px 0', textAlign: 'center' }}>
            <Row>
              <Column style={{ textAlign: 'center' }}>
                <Img
                  src={brand.logoUrl || `${baseUrl}/logo/reverse/text/medium.png`}
                  width='114'
                  alt={brand.name}
                  style={{
                    margin: '0 auto',
                  }}
                />
              </Column>
            </Row>
          </Section>

          <Section style={baseStyles.sectionsBorders}>
            <Row>
              <Column style={baseStyles.sectionBorder} />
              <Column style={baseStyles.sectionCenter} />
              <Column style={baseStyles.sectionBorder} />
            </Row>
          </Section>

          <Section style={baseStyles.content}>
            <Text style={baseStyles.paragraph}>Hello,</Text>
            <Text style={baseStyles.paragraph}>
              <strong>{inviterName}</strong> has invited you to join{' '}
              <strong>{organizationName}</strong> on Sim. Sim is a powerful, user-friendly platform
              for building, testing, and optimizing agentic workflows.
            </Text>
            <Link href={enhancedLink} style={{ textDecoration: 'none' }}>
              <Text style={baseStyles.button}>Accept Invitation</Text>
            </Link>
            <Text style={baseStyles.paragraph}>
              This invitation will expire in 48 hours. If you believe this invitation was sent in
              error, please ignore this email.
            </Text>
            <Text style={baseStyles.paragraph}>
              Best regards,
              <br />
              The Sim Team
            </Text>
            <Text
              style={{
                ...baseStyles.footerText,
                marginTop: '40px',
                textAlign: 'left',
                color: '#666666',
              }}
            >
              This email was sent on {format(updatedDate, 'MMMM do, yyyy')} to {invitedEmail} with
              an invitation to join {organizationName} on Sim.
            </Text>
          </Section>
        </Container>

        <EmailFooter baseUrl={baseUrl} />
      </Body>
    </Html>
  )
}

export default InvitationEmail
```

--------------------------------------------------------------------------------

---[FILE: otp-verification-email.tsx]---
Location: sim-main/apps/sim/components/emails/otp-verification-email.tsx

```typescript
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { baseStyles } from '@/components/emails/base-styles'
import EmailFooter from '@/components/emails/footer'
import { getBrandConfig } from '@/lib/branding/branding'
import { getBaseUrl } from '@/lib/core/utils/urls'

interface OTPVerificationEmailProps {
  otp: string
  email?: string
  type?: 'sign-in' | 'email-verification' | 'forget-password' | 'chat-access'
  chatTitle?: string
}

const getSubjectByType = (type: string, brandName: string, chatTitle?: string) => {
  switch (type) {
    case 'sign-in':
      return `Sign in to ${brandName}`
    case 'email-verification':
      return `Verify your email for ${brandName}`
    case 'forget-password':
      return `Reset your ${brandName} password`
    case 'chat-access':
      return `Verification code for ${chatTitle || 'Chat'}`
    default:
      return `Verification code for ${brandName}`
  }
}

export const OTPVerificationEmail = ({
  otp,
  email = '',
  type = 'email-verification',
  chatTitle,
}: OTPVerificationEmailProps) => {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()

  // Get a message based on the type
  const getMessage = () => {
    switch (type) {
      case 'sign-in':
        return `Sign in to ${brand.name}`
      case 'forget-password':
        return `Reset your password for ${brand.name}`
      case 'chat-access':
        return `Access ${chatTitle || 'the chat'}`
      default:
        return `Welcome to ${brand.name}`
    }
  }

  return (
    <Html>
      <Head />
      <Body style={baseStyles.main}>
        <Preview>{getSubjectByType(type, brand.name, chatTitle)}</Preview>
        <Container style={baseStyles.container}>
          <Section style={{ padding: '30px 0', textAlign: 'center' }}>
            <Row>
              <Column style={{ textAlign: 'center' }}>
                <Img
                  src={brand.logoUrl || `${baseUrl}/logo/reverse/text/medium.png`}
                  width='114'
                  alt={brand.name}
                  style={{
                    margin: '0 auto',
                  }}
                />
              </Column>
            </Row>
          </Section>
          <Section style={baseStyles.sectionsBorders}>
            <Row>
              <Column style={baseStyles.sectionBorder} />
              <Column style={baseStyles.sectionCenter} />
              <Column style={baseStyles.sectionBorder} />
            </Row>
          </Section>
          <Section style={baseStyles.content}>
            <Text style={baseStyles.paragraph}>{getMessage()}</Text>
            <Text style={baseStyles.paragraph}>Your verification code is:</Text>
            <Section style={baseStyles.codeContainer}>
              <Text style={baseStyles.code}>{otp}</Text>
            </Section>
            <Text style={baseStyles.paragraph}>This code will expire in 15 minutes.</Text>
            <Text style={baseStyles.paragraph}>
              If you didn't request this code, you can safely ignore this email.
            </Text>
            <Text style={baseStyles.paragraph}>
              Best regards,
              <br />
              The Sim Team
            </Text>
          </Section>
        </Container>

        <EmailFooter baseUrl={baseUrl} />
      </Body>
    </Html>
  )
}

export default OTPVerificationEmail
```

--------------------------------------------------------------------------------

---[FILE: render-email.ts]---
Location: sim-main/apps/sim/components/emails/render-email.ts

```typescript
import { render } from '@react-email/components'
import {
  BatchInvitationEmail,
  EnterpriseSubscriptionEmail,
  HelpConfirmationEmail,
  InvitationEmail,
  OTPVerificationEmail,
  PlanWelcomeEmail,
  ResetPasswordEmail,
  UsageThresholdEmail,
} from '@/components/emails'
import CreditPurchaseEmail from '@/components/emails/billing/credit-purchase-email'
import FreeTierUpgradeEmail from '@/components/emails/billing/free-tier-upgrade-email'
import { getBrandConfig } from '@/lib/branding/branding'
import { getBaseUrl } from '@/lib/core/utils/urls'

export async function renderOTPEmail(
  otp: string,
  email: string,
  type: 'sign-in' | 'email-verification' | 'forget-password' = 'email-verification',
  chatTitle?: string
): Promise<string> {
  return await render(OTPVerificationEmail({ otp, email, type, chatTitle }))
}

export async function renderPasswordResetEmail(
  username: string,
  resetLink: string
): Promise<string> {
  return await render(
    ResetPasswordEmail({ username, resetLink: resetLink, updatedDate: new Date() })
  )
}

export async function renderInvitationEmail(
  inviterName: string,
  organizationName: string,
  invitationUrl: string,
  email: string
): Promise<string> {
  return await render(
    InvitationEmail({
      inviterName,
      organizationName,
      inviteLink: invitationUrl,
      invitedEmail: email,
      updatedDate: new Date(),
    })
  )
}

interface WorkspaceInvitation {
  workspaceId: string
  workspaceName: string
  permission: 'admin' | 'write' | 'read'
}

export async function renderBatchInvitationEmail(
  inviterName: string,
  organizationName: string,
  organizationRole: 'admin' | 'member',
  workspaceInvitations: WorkspaceInvitation[],
  acceptUrl: string
): Promise<string> {
  return await render(
    BatchInvitationEmail({
      inviterName,
      organizationName,
      organizationRole,
      workspaceInvitations,
      acceptUrl,
    })
  )
}

export async function renderHelpConfirmationEmail(
  userEmail: string,
  type: 'bug' | 'feedback' | 'feature_request' | 'other',
  attachmentCount = 0
): Promise<string> {
  return await render(
    HelpConfirmationEmail({
      userEmail,
      type,
      attachmentCount,
      submittedDate: new Date(),
    })
  )
}

export async function renderEnterpriseSubscriptionEmail(
  userName: string,
  userEmail: string
): Promise<string> {
  const baseUrl = getBaseUrl()
  const loginLink = `${baseUrl}/login`

  return await render(
    EnterpriseSubscriptionEmail({
      userName,
      userEmail,
      loginLink,
      createdDate: new Date(),
    })
  )
}

export async function renderUsageThresholdEmail(params: {
  userName?: string
  planName: string
  percentUsed: number
  currentUsage: number
  limit: number
  ctaLink: string
}): Promise<string> {
  return await render(
    UsageThresholdEmail({
      userName: params.userName,
      planName: params.planName,
      percentUsed: params.percentUsed,
      currentUsage: params.currentUsage,
      limit: params.limit,
      ctaLink: params.ctaLink,
      updatedDate: new Date(),
    })
  )
}

export async function renderFreeTierUpgradeEmail(params: {
  userName?: string
  percentUsed: number
  currentUsage: number
  limit: number
  upgradeLink: string
}): Promise<string> {
  return await render(
    FreeTierUpgradeEmail({
      userName: params.userName,
      percentUsed: params.percentUsed,
      currentUsage: params.currentUsage,
      limit: params.limit,
      upgradeLink: params.upgradeLink,
      updatedDate: new Date(),
    })
  )
}

export function getEmailSubject(
  type:
    | 'sign-in'
    | 'email-verification'
    | 'forget-password'
    | 'reset-password'
    | 'invitation'
    | 'batch-invitation'
    | 'help-confirmation'
    | 'enterprise-subscription'
    | 'usage-threshold'
    | 'free-tier-upgrade'
    | 'plan-welcome-pro'
    | 'plan-welcome-team'
    | 'credit-purchase'
): string {
  const brandName = getBrandConfig().name

  switch (type) {
    case 'sign-in':
      return `Sign in to ${brandName}`
    case 'email-verification':
      return `Verify your email for ${brandName}`
    case 'forget-password':
      return `Reset your ${brandName} password`
    case 'reset-password':
      return `Reset your ${brandName} password`
    case 'invitation':
      return `You've been invited to join a team on ${brandName}`
    case 'batch-invitation':
      return `You've been invited to join a team and workspaces on ${brandName}`
    case 'help-confirmation':
      return 'Your request has been received'
    case 'enterprise-subscription':
      return `Your Enterprise Plan is now active on ${brandName}`
    case 'usage-threshold':
      return `You're nearing your monthly budget on ${brandName}`
    case 'free-tier-upgrade':
      return `You're at 90% of your free credits on ${brandName}`
    case 'plan-welcome-pro':
      return `Your Pro plan is now active on ${brandName}`
    case 'plan-welcome-team':
      return `Your Team plan is now active on ${brandName}`
    case 'credit-purchase':
      return `Credits added to your ${brandName} account`
    default:
      return brandName
  }
}

export async function renderPlanWelcomeEmail(params: {
  planName: 'Pro' | 'Team'
  userName?: string
  loginLink?: string
}): Promise<string> {
  return await render(
    PlanWelcomeEmail({
      planName: params.planName,
      userName: params.userName,
      loginLink: params.loginLink,
      createdDate: new Date(),
    })
  )
}

export async function renderCreditPurchaseEmail(params: {
  userName?: string
  amount: number
  newBalance: number
}): Promise<string> {
  return await render(
    CreditPurchaseEmail({
      userName: params.userName,
      amount: params.amount,
      newBalance: params.newBalance,
      purchaseDate: new Date(),
    })
  )
}
```

--------------------------------------------------------------------------------

---[FILE: reset-password-email.tsx]---
Location: sim-main/apps/sim/components/emails/reset-password-email.tsx

```typescript
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { format } from 'date-fns'
import { baseStyles } from '@/components/emails/base-styles'
import EmailFooter from '@/components/emails/footer'
import { getBrandConfig } from '@/lib/branding/branding'
import { getBaseUrl } from '@/lib/core/utils/urls'

interface ResetPasswordEmailProps {
  username?: string
  resetLink?: string
  updatedDate?: Date
}

export const ResetPasswordEmail = ({
  username = '',
  resetLink = '',
  updatedDate = new Date(),
}: ResetPasswordEmailProps) => {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()

  return (
    <Html>
      <Head />
      <Body style={baseStyles.main}>
        <Preview>Reset your {brand.name} password</Preview>
        <Container style={baseStyles.container}>
          <Section style={{ padding: '30px 0', textAlign: 'center' }}>
            <Row>
              <Column style={{ textAlign: 'center' }}>
                <Img
                  src={brand.logoUrl || `${baseUrl}/logo/reverse/text/medium.png`}
                  width='114'
                  alt={brand.name}
                  style={{
                    margin: '0 auto',
                  }}
                />
              </Column>
            </Row>
          </Section>

          <Section style={baseStyles.sectionsBorders}>
            <Row>
              <Column style={baseStyles.sectionBorder} />
              <Column style={baseStyles.sectionCenter} />
              <Column style={baseStyles.sectionBorder} />
            </Row>
          </Section>

          <Section style={baseStyles.content}>
            <Text style={baseStyles.paragraph}>Hello {username},</Text>
            <Text style={baseStyles.paragraph}>
              You recently requested to reset your password for your {brand.name} account. Use the
              button below to reset it. This password reset is only valid for the next 24 hours.
            </Text>
            <Link href={resetLink} style={{ textDecoration: 'none' }}>
              <Text style={baseStyles.button}>Reset Your Password</Text>
            </Link>
            <Text style={baseStyles.paragraph}>
              If you did not request a password reset, please ignore this email or contact support
              if you have concerns.
            </Text>
            <Text style={baseStyles.paragraph}>
              Best regards,
              <br />
              The {brand.name} Team
            </Text>
            <Text
              style={{
                ...baseStyles.footerText,
                marginTop: '40px',
                textAlign: 'left',
                color: '#666666',
              }}
            >
              This email was sent on {format(updatedDate, 'MMMM do, yyyy')} because a password reset
              was requested for your account.
            </Text>
          </Section>
        </Container>

        <EmailFooter baseUrl={baseUrl} />
      </Body>
    </Html>
  )
}

export default ResetPasswordEmail
```

--------------------------------------------------------------------------------

---[FILE: workspace-invitation.tsx]---
Location: sim-main/apps/sim/components/emails/workspace-invitation.tsx

```typescript
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { baseStyles } from '@/components/emails/base-styles'
import EmailFooter from '@/components/emails/footer'
import { getBrandConfig } from '@/lib/branding/branding'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('WorkspaceInvitationEmail')

interface WorkspaceInvitationEmailProps {
  workspaceName?: string
  inviterName?: string
  invitationLink?: string
}

export const WorkspaceInvitationEmail = ({
  workspaceName = 'Workspace',
  inviterName = 'Someone',
  invitationLink = '',
}: WorkspaceInvitationEmailProps) => {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()

  // Extract token from the link to ensure we're using the correct format
  let enhancedLink = invitationLink

  try {
    // If the link is pointing to any API endpoint directly, update it to use the client route
    if (
      invitationLink.includes('/api/workspaces/invitations/accept') ||
      invitationLink.match(/\/api\/workspaces\/invitations\/[^?]+\?token=/)
    ) {
      const url = new URL(invitationLink)
      const token = url.searchParams.get('token')
      if (token) {
        enhancedLink = `${baseUrl}/invite/${token}?token=${token}`
      }
    }
  } catch (e) {
    logger.error('Error enhancing invitation link:', e)
  }

  return (
    <Html>
      <Head />
      <Body style={baseStyles.main}>
        <Preview>You've been invited to join the "{workspaceName}" workspace on Sim!</Preview>
        <Container style={baseStyles.container}>
          <Section style={{ padding: '30px 0', textAlign: 'center' }}>
            <Row>
              <Column style={{ textAlign: 'center' }}>
                <Img
                  src={brand.logoUrl || `${baseUrl}/logo/reverse/text/medium.png`}
                  width='114'
                  alt={brand.name}
                  style={{
                    margin: '0 auto',
                  }}
                />
              </Column>
            </Row>
          </Section>

          <Section style={baseStyles.sectionsBorders}>
            <Row>
              <Column style={baseStyles.sectionBorder} />
              <Column style={baseStyles.sectionCenter} />
              <Column style={baseStyles.sectionBorder} />
            </Row>
          </Section>

          <Section style={baseStyles.content}>
            <Text style={baseStyles.paragraph}>Hello,</Text>
            <Text style={baseStyles.paragraph}>
              {inviterName} has invited you to join the "{workspaceName}" workspace on Sim!
            </Text>
            <Text style={baseStyles.paragraph}>
              Sim is a powerful platform for building, testing, and optimizing AI workflows. Join
              this workspace to collaborate with your team.
            </Text>
            <Link href={enhancedLink} style={{ textDecoration: 'none' }}>
              <Text style={baseStyles.button}>Accept Invitation</Text>
            </Link>
            <Text style={baseStyles.paragraph}>
              This invitation link will expire in 7 days. If you have any questions or need
              assistance, feel free to reach out to our support team.
            </Text>
            <Text style={baseStyles.paragraph}>
              Best regards,
              <br />
              The Sim Team
            </Text>
          </Section>
        </Container>

        <EmailFooter baseUrl={baseUrl} />
      </Body>
    </Html>
  )
}

export default WorkspaceInvitationEmail
```

--------------------------------------------------------------------------------

````
