---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 500
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 500 of 933)

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

---[FILE: credit-purchase-email.tsx]---
Location: sim-main/apps/sim/components/emails/billing/credit-purchase-email.tsx

```typescript
import {
  Body,
  Column,
  Container,
  Head,
  Hr,
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

interface CreditPurchaseEmailProps {
  userName?: string
  amount: number
  newBalance: number
  purchaseDate?: Date
}

export function CreditPurchaseEmail({
  userName,
  amount,
  newBalance,
  purchaseDate = new Date(),
}: CreditPurchaseEmailProps) {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()

  const previewText = `${brand.name}: $${amount.toFixed(2)} in credits added to your account`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={baseStyles.main}>
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
            <Text style={{ ...baseStyles.paragraph, marginTop: 0 }}>
              {userName ? `Hi ${userName},` : 'Hi,'}
            </Text>
            <Text style={baseStyles.paragraph}>
              Your credit purchase of <strong>${amount.toFixed(2)}</strong> has been confirmed.
            </Text>

            <Section
              style={{
                background: '#f4f4f5',
                borderRadius: '8px',
                padding: '16px',
                margin: '24px 0',
              }}
            >
              <Text style={{ margin: 0, fontSize: '14px', color: '#71717a' }}>Amount Added</Text>
              <Text style={{ margin: '4px 0 16px', fontSize: '24px', fontWeight: 'bold' }}>
                ${amount.toFixed(2)}
              </Text>
              <Text style={{ margin: 0, fontSize: '14px', color: '#71717a' }}>New Balance</Text>
              <Text style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: 'bold' }}>
                ${newBalance.toFixed(2)}
              </Text>
            </Section>

            <Text style={baseStyles.paragraph}>
              These credits will be applied automatically to your workflow executions. Credits are
              consumed before any overage charges apply.
            </Text>

            <Link href={`${baseUrl}/workspace`} style={{ textDecoration: 'none' }}>
              <Text style={baseStyles.button}>View Dashboard</Text>
            </Link>

            <Hr />

            <Text style={baseStyles.paragraph}>
              You can view your credit balance and purchase history in Settings → Subscription.
            </Text>

            <Text style={baseStyles.paragraph}>
              Best regards,
              <br />
              The Sim Team
            </Text>

            <Text style={{ ...baseStyles.paragraph, fontSize: '12px', color: '#666' }}>
              Purchased on {purchaseDate.toLocaleDateString()}
            </Text>
          </Section>
        </Container>
        <EmailFooter baseUrl={baseUrl} />
      </Body>
    </Html>
  )
}

export default CreditPurchaseEmail
```

--------------------------------------------------------------------------------

---[FILE: enterprise-subscription-email.tsx]---
Location: sim-main/apps/sim/components/emails/billing/enterprise-subscription-email.tsx

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

interface EnterpriseSubscriptionEmailProps {
  userName?: string
  userEmail?: string
  loginLink?: string
  createdDate?: Date
}

export const EnterpriseSubscriptionEmail = ({
  userName = 'Valued User',
  userEmail = '',
  loginLink,
  createdDate = new Date(),
}: EnterpriseSubscriptionEmailProps) => {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()
  const effectiveLoginLink = loginLink || `${baseUrl}/login`

  return (
    <Html>
      <Head />
      <Body style={baseStyles.main}>
        <Preview>Your Enterprise Plan is now active on Sim</Preview>
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
            <Text style={baseStyles.paragraph}>Hello {userName},</Text>
            <Text style={baseStyles.paragraph}>
              Great news! Your <strong>Enterprise Plan</strong> has been activated on Sim. You now
              have access to advanced features and increased capacity for your workflows.
            </Text>

            <Text style={baseStyles.paragraph}>
              Your account has been set up with full access to your organization. Click below to log
              in and start exploring your new Enterprise features:
            </Text>

            <Link href={effectiveLoginLink} style={{ textDecoration: 'none' }}>
              <Text style={baseStyles.button}>Access Your Enterprise Account</Text>
            </Link>

            <Text style={baseStyles.paragraph}>
              <strong>What's next?</strong>
            </Text>
            <Text style={baseStyles.paragraph}>
              • Invite team members to your organization
              <br />• Begin building your workflows
            </Text>

            <Text style={baseStyles.paragraph}>
              If you have any questions or need assistance getting started, our support team is here
              to help.
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
              This email was sent on {format(createdDate, 'MMMM do, yyyy')} to {userEmail}
              regarding your Enterprise plan activation on Sim.
            </Text>
          </Section>
        </Container>

        <EmailFooter baseUrl={baseUrl} />
      </Body>
    </Html>
  )
}

export default EnterpriseSubscriptionEmail
```

--------------------------------------------------------------------------------

---[FILE: free-tier-upgrade-email.tsx]---
Location: sim-main/apps/sim/components/emails/billing/free-tier-upgrade-email.tsx

```typescript
import {
  Body,
  Column,
  Container,
  Head,
  Hr,
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

interface FreeTierUpgradeEmailProps {
  userName?: string
  percentUsed: number
  currentUsage: number
  limit: number
  upgradeLink: string
  updatedDate?: Date
}

export function FreeTierUpgradeEmail({
  userName,
  percentUsed,
  currentUsage,
  limit,
  upgradeLink,
  updatedDate = new Date(),
}: FreeTierUpgradeEmailProps) {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()

  const previewText = `${brand.name}: You've used ${percentUsed}% of your free credits`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={baseStyles.main}>
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
            <Text style={{ ...baseStyles.paragraph, marginTop: 0 }}>
              {userName ? `Hi ${userName},` : 'Hi,'}
            </Text>

            <Text style={baseStyles.paragraph}>
              You've used <strong>${currentUsage.toFixed(2)}</strong> of your{' '}
              <strong>${limit.toFixed(2)}</strong> free credits ({percentUsed}%).
            </Text>

            <Text style={baseStyles.paragraph}>
              To ensure uninterrupted service and unlock the full power of {brand.name}, upgrade to
              Pro today.
            </Text>

            <Section
              style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '5px',
                margin: '20px 0',
              }}
            >
              <Text
                style={{
                  ...baseStyles.paragraph,
                  marginTop: 0,
                  marginBottom: 12,
                  fontWeight: 'bold',
                }}
              >
                What you get with Pro:
              </Text>
              <Text style={{ ...baseStyles.paragraph, margin: '8px 0', lineHeight: 1.6 }}>
                • <strong>$20/month in credits</strong> – 2x your free tier
                <br />• <strong>Priority support</strong> – Get help when you need it
                <br />• <strong>Advanced features</strong> – Access to premium blocks and
                integrations
                <br />• <strong>No interruptions</strong> – Never worry about running out of credits
              </Text>
            </Section>

            <Hr />

            <Text style={baseStyles.paragraph}>Upgrade now to keep building without limits.</Text>

            <Link href={upgradeLink} style={{ textDecoration: 'none' }}>
              <Text style={baseStyles.button}>Upgrade to Pro</Text>
            </Link>

            <Text style={baseStyles.paragraph}>
              Questions? We're here to help.
              <br />
              <br />
              Best regards,
              <br />
              The {brand.name} Team
            </Text>

            <Text style={{ ...baseStyles.paragraph, fontSize: '12px', color: '#666' }}>
              Sent on {updatedDate.toLocaleDateString()} • This is a one-time notification at 90%.
            </Text>
          </Section>
        </Container>

        <EmailFooter baseUrl={baseUrl} />
      </Body>
    </Html>
  )
}

export default FreeTierUpgradeEmail
```

--------------------------------------------------------------------------------

---[FILE: payment-failed-email.tsx]---
Location: sim-main/apps/sim/components/emails/billing/payment-failed-email.tsx

```typescript
import {
  Body,
  Column,
  Container,
  Head,
  Hr,
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

interface PaymentFailedEmailProps {
  userName?: string
  amountDue: number
  lastFourDigits?: string
  billingPortalUrl: string
  failureReason?: string
  sentDate?: Date
}

export function PaymentFailedEmail({
  userName,
  amountDue,
  lastFourDigits,
  billingPortalUrl,
  failureReason,
  sentDate = new Date(),
}: PaymentFailedEmailProps) {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()

  const previewText = `${brand.name}: Payment Failed - Action Required`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={baseStyles.main}>
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
            <Text style={{ ...baseStyles.paragraph, marginTop: 0 }}>
              {userName ? `Hi ${userName},` : 'Hi,'}
            </Text>

            <Text style={{ ...baseStyles.paragraph, fontSize: '18px', fontWeight: 'bold' }}>
              We were unable to process your payment.
            </Text>

            <Text style={baseStyles.paragraph}>
              Your {brand.name} account has been temporarily blocked to prevent service
              interruptions and unexpected charges. To restore access immediately, please update
              your payment method.
            </Text>

            <Section
              style={{
                backgroundColor: '#fff5f5',
                border: '1px solid #fed7d7',
                borderRadius: '5px',
                padding: '16px',
                margin: '20px 0',
              }}
            >
              <Row>
                <Column>
                  <Text style={{ ...baseStyles.paragraph, marginBottom: 8, marginTop: 0 }}>
                    <strong>Payment Details</strong>
                  </Text>
                  <Text style={{ ...baseStyles.paragraph, margin: '4px 0' }}>
                    Amount due: ${amountDue.toFixed(2)}
                  </Text>
                  {lastFourDigits && (
                    <Text style={{ ...baseStyles.paragraph, margin: '4px 0' }}>
                      Payment method: •••• {lastFourDigits}
                    </Text>
                  )}
                  {failureReason && (
                    <Text style={{ ...baseStyles.paragraph, margin: '4px 0' }}>
                      Reason: {failureReason}
                    </Text>
                  )}
                </Column>
              </Row>
            </Section>

            <Link href={billingPortalUrl} style={{ textDecoration: 'none' }}>
              <Text style={baseStyles.button}>Update Payment Method</Text>
            </Link>

            <Hr />

            <Text style={baseStyles.paragraph}>
              <strong>What happens next?</strong>
            </Text>

            <Text style={baseStyles.paragraph}>
              • Your workflows and automations are currently paused
              <br />• Update your payment method to restore service immediately
              <br />• Stripe will automatically retry the charge once payment is updated
            </Text>

            <Hr />

            <Text style={baseStyles.paragraph}>
              <strong>Need help?</strong>
            </Text>

            <Text style={baseStyles.paragraph}>
              Common reasons for payment failures include expired cards, insufficient funds, or
              incorrect billing information. If you continue to experience issues, please{' '}
              <Link href={`${baseUrl}/support`} style={baseStyles.link}>
                contact our support team
              </Link>
              .
            </Text>

            <Text style={baseStyles.paragraph}>
              Best regards,
              <br />
              The Sim Team
            </Text>

            <Text style={{ ...baseStyles.paragraph, fontSize: '12px', color: '#666' }}>
              Sent on {sentDate.toLocaleDateString()} • This is a critical transactional
              notification.
            </Text>
          </Section>
        </Container>

        <EmailFooter baseUrl={baseUrl} />
      </Body>
    </Html>
  )
}

export default PaymentFailedEmail
```

--------------------------------------------------------------------------------

---[FILE: plan-welcome-email.tsx]---
Location: sim-main/apps/sim/components/emails/billing/plan-welcome-email.tsx

```typescript
import {
  Body,
  Column,
  Container,
  Head,
  Hr,
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

interface PlanWelcomeEmailProps {
  planName: 'Pro' | 'Team'
  userName?: string
  loginLink?: string
  createdDate?: Date
}

export function PlanWelcomeEmail({
  planName,
  userName,
  loginLink,
  createdDate = new Date(),
}: PlanWelcomeEmailProps) {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()
  const cta = loginLink || `${baseUrl}/login`

  const previewText = `${brand.name}: Your ${planName} plan is active`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={baseStyles.main}>
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
            <Text style={{ ...baseStyles.paragraph, marginTop: 0 }}>
              {userName ? `Hi ${userName},` : 'Hi,'}
            </Text>
            <Text style={baseStyles.paragraph}>
              Welcome to the <strong>{planName}</strong> plan on {brand.name}. You're all set to
              build, test, and scale your agentic workflows.
            </Text>

            <Link href={cta} style={{ textDecoration: 'none' }}>
              <Text style={baseStyles.button}>Open {brand.name}</Text>
            </Link>

            <Text style={baseStyles.paragraph}>
              Want to discuss your plan or get personalized help getting started?{' '}
              <Link href='https://cal.com/waleedlatif/15min' style={baseStyles.link}>
                Schedule a 15-minute call
              </Link>{' '}
              with our team.
            </Text>

            <Hr />

            <Text style={baseStyles.paragraph}>
              Need to invite teammates, adjust usage limits, or manage billing? You can do that from
              Settings → Subscription.
            </Text>

            <Text style={baseStyles.paragraph}>
              Best regards,
              <br />
              The Sim Team
            </Text>

            <Text style={{ ...baseStyles.paragraph, fontSize: '12px', color: '#666' }}>
              Sent on {createdDate.toLocaleDateString()}
            </Text>
          </Section>
        </Container>
        <EmailFooter baseUrl={baseUrl} />
      </Body>
    </Html>
  )
}

export default PlanWelcomeEmail
```

--------------------------------------------------------------------------------

---[FILE: usage-threshold-email.tsx]---
Location: sim-main/apps/sim/components/emails/billing/usage-threshold-email.tsx

```typescript
import {
  Body,
  Column,
  Container,
  Head,
  Hr,
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

interface UsageThresholdEmailProps {
  userName?: string
  planName: string
  percentUsed: number
  currentUsage: number
  limit: number
  ctaLink: string
  updatedDate?: Date
}

export function UsageThresholdEmail({
  userName,
  planName,
  percentUsed,
  currentUsage,
  limit,
  ctaLink,
  updatedDate = new Date(),
}: UsageThresholdEmailProps) {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()

  const previewText = `${brand.name}: You're at ${percentUsed}% of your ${planName} monthly budget`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={baseStyles.main}>
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
            <Text style={{ ...baseStyles.paragraph, marginTop: 0 }}>
              {userName ? `Hi ${userName},` : 'Hi,'}
            </Text>

            <Text style={baseStyles.paragraph}>
              You're approaching your monthly budget on the {planName} plan.
            </Text>

            <Section>
              <Row>
                <Column>
                  <Text style={{ ...baseStyles.paragraph, marginBottom: 8 }}>
                    <strong>Usage</strong>
                  </Text>
                  <Text style={{ ...baseStyles.paragraph, marginTop: 0 }}>
                    ${currentUsage.toFixed(2)} of ${limit.toFixed(2)} used ({percentUsed}%)
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr />

            <Text style={{ ...baseStyles.paragraph }}>
              To avoid interruptions, consider increasing your monthly limit.
            </Text>

            <Link href={ctaLink} style={{ textDecoration: 'none' }}>
              <Text style={baseStyles.button}>Review limits</Text>
            </Link>

            <Text style={baseStyles.paragraph}>
              Best regards,
              <br />
              The Sim Team
            </Text>

            <Text style={{ ...baseStyles.paragraph, fontSize: '12px', color: '#666' }}>
              Sent on {updatedDate.toLocaleDateString()} • This is a one-time notification at 80%.
            </Text>
          </Section>
        </Container>

        <EmailFooter baseUrl={baseUrl} />
      </Body>
    </Html>
  )
}

export default UsageThresholdEmail
```

--------------------------------------------------------------------------------

---[FILE: careers-confirmation-email.tsx]---
Location: sim-main/apps/sim/components/emails/careers/careers-confirmation-email.tsx

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

interface CareersConfirmationEmailProps {
  name: string
  position: string
  submittedDate?: Date
}

export const CareersConfirmationEmail = ({
  name,
  position,
  submittedDate = new Date(),
}: CareersConfirmationEmailProps) => {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()

  return (
    <Html>
      <Head />
      <Body style={baseStyles.main}>
        <Preview>Your application to {brand.name} has been received</Preview>
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
            <Text style={baseStyles.paragraph}>Hello {name},</Text>
            <Text style={baseStyles.paragraph}>
              Thank you for your interest in joining the {brand.name} team! We've received your
              application for the <strong>{position}</strong> position.
            </Text>

            <Text style={baseStyles.paragraph}>
              Our team carefully reviews every application and will get back to you within the next
              few weeks. If your qualifications match what we're looking for, we'll reach out to
              schedule an initial conversation.
            </Text>

            <Text style={baseStyles.paragraph}>
              In the meantime, feel free to explore our{' '}
              <a
                href='https://docs.sim.ai'
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: '#6F3DFA', textDecoration: 'none' }}
              >
                documentation
              </a>{' '}
              to learn more about what we're building, or check out our{' '}
              <a href={`${baseUrl}/studio`} style={{ color: '#6F3DFA', textDecoration: 'none' }}>
                blog
              </a>{' '}
              for the latest updates.
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
              This confirmation was sent on {format(submittedDate, 'MMMM do, yyyy')} at{' '}
              {format(submittedDate, 'h:mm a')}.
            </Text>
          </Section>
        </Container>

        <EmailFooter baseUrl={baseUrl} />
      </Body>
    </Html>
  )
}

export default CareersConfirmationEmail
```

--------------------------------------------------------------------------------

---[FILE: careers-submission-email.tsx]---
Location: sim-main/apps/sim/components/emails/careers/careers-submission-email.tsx

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
import { getBrandConfig } from '@/lib/branding/branding'
import { getBaseUrl } from '@/lib/core/utils/urls'

interface CareersSubmissionEmailProps {
  name: string
  email: string
  phone?: string
  position: string
  linkedin?: string
  portfolio?: string
  experience: string
  location: string
  message: string
  submittedDate?: Date
}

const getExperienceLabel = (experience: string) => {
  const labels: Record<string, string> = {
    '0-1': '0-1 years',
    '1-3': '1-3 years',
    '3-5': '3-5 years',
    '5-10': '5-10 years',
    '10+': '10+ years',
  }
  return labels[experience] || experience
}

export const CareersSubmissionEmail = ({
  name,
  email,
  phone,
  position,
  linkedin,
  portfolio,
  experience,
  location,
  message,
  submittedDate = new Date(),
}: CareersSubmissionEmailProps) => {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()

  return (
    <Html>
      <Head />
      <Body style={baseStyles.main}>
        <Preview>New Career Application from {name}</Preview>
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
            <Text style={{ ...baseStyles.paragraph, fontSize: '18px', fontWeight: 'bold' }}>
              New Career Application
            </Text>

            <Text style={baseStyles.paragraph}>
              A new career application has been submitted on{' '}
              {format(submittedDate, 'MMMM do, yyyy')} at {format(submittedDate, 'h:mm a')}.
            </Text>

            {/* Applicant Information */}
            <Section
              style={{
                marginTop: '24px',
                marginBottom: '24px',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
              }}
            >
              <Text
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333333',
                }}
              >
                Applicant Information
              </Text>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tr>
                  <td
                    style={{
                      padding: '8px 0',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#666666',
                      width: '40%',
                    }}
                  >
                    Name:
                  </td>
                  <td style={{ padding: '8px 0', fontSize: '14px', color: '#333333' }}>{name}</td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: '8px 0',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#666666',
                    }}
                  >
                    Email:
                  </td>
                  <td style={{ padding: '8px 0', fontSize: '14px', color: '#333333' }}>
                    <a
                      href={`mailto:${email}`}
                      style={{ color: '#6F3DFA', textDecoration: 'none' }}
                    >
                      {email}
                    </a>
                  </td>
                </tr>
                {phone && (
                  <tr>
                    <td
                      style={{
                        padding: '8px 0',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#666666',
                      }}
                    >
                      Phone:
                    </td>
                    <td style={{ padding: '8px 0', fontSize: '14px', color: '#333333' }}>
                      <a href={`tel:${phone}`} style={{ color: '#6F3DFA', textDecoration: 'none' }}>
                        {phone}
                      </a>
                    </td>
                  </tr>
                )}
                <tr>
                  <td
                    style={{
                      padding: '8px 0',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#666666',
                    }}
                  >
                    Position:
                  </td>
                  <td style={{ padding: '8px 0', fontSize: '14px', color: '#333333' }}>
                    {position}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: '8px 0',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#666666',
                    }}
                  >
                    Experience:
                  </td>
                  <td style={{ padding: '8px 0', fontSize: '14px', color: '#333333' }}>
                    {getExperienceLabel(experience)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: '8px 0',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#666666',
                    }}
                  >
                    Location:
                  </td>
                  <td style={{ padding: '8px 0', fontSize: '14px', color: '#333333' }}>
                    {location}
                  </td>
                </tr>
                {linkedin && (
                  <tr>
                    <td
                      style={{
                        padding: '8px 0',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#666666',
                      }}
                    >
                      LinkedIn:
                    </td>
                    <td style={{ padding: '8px 0', fontSize: '14px', color: '#333333' }}>
                      <a
                        href={linkedin}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{ color: '#6F3DFA', textDecoration: 'none' }}
                      >
                        View Profile
                      </a>
                    </td>
                  </tr>
                )}
                {portfolio && (
                  <tr>
                    <td
                      style={{
                        padding: '8px 0',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#666666',
                      }}
                    >
                      Portfolio:
                    </td>
                    <td style={{ padding: '8px 0', fontSize: '14px', color: '#333333' }}>
                      <a
                        href={portfolio}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{ color: '#6F3DFA', textDecoration: 'none' }}
                      >
                        View Portfolio
                      </a>
                    </td>
                  </tr>
                )}
              </table>
            </Section>

            {/* Message */}
            <Section
              style={{
                marginTop: '24px',
                marginBottom: '24px',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
              }}
            >
              <Text
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333333',
                }}
              >
                About Themselves
              </Text>
              <Text
                style={{
                  margin: '0',
                  fontSize: '14px',
                  color: '#333333',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {message}
              </Text>
            </Section>

            <Text style={baseStyles.paragraph}>
              Please review this application and reach out to the candidate at your earliest
              convenience.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default CareersSubmissionEmail
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/components/emcn/index.ts

```typescript
export * from './components'
export * from './icons'
```

--------------------------------------------------------------------------------

````
