---
source_txt: fullstack_samples/umami-master
converted_utc: 2025-12-18T10:37:23Z
part: 3
parts_total: 6
---

# FULLSTACK CODE DATABASE SAMPLES umami-master

## Extracted Reusable Patterns (Non-verbatim) (Part 3 of 6)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - umami-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/umami-master
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: CohortEditForm.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/cohorts/CohortEditForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function CohortEditForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CohortEditForm
```

--------------------------------------------------------------------------------

---[FILE: CohortsDataTable.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/cohorts/CohortsDataTable.tsx
Signals: N/A
Excerpt (<=80 chars):  export function CohortsDataTable({ websiteId }: { websiteId?: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CohortsDataTable
```

--------------------------------------------------------------------------------

---[FILE: CohortsPage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/cohorts/CohortsPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function CohortsPage({ websiteId }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CohortsPage
```

--------------------------------------------------------------------------------

---[FILE: CohortsTable.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/cohorts/CohortsTable.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function CohortsTable(props: DataTableProps) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CohortsTable
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/cohorts/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ComparePage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/compare/ComparePage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function ComparePage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ComparePage
```

--------------------------------------------------------------------------------

---[FILE: CompareTables.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/compare/CompareTables.tsx
Signals: React
Excerpt (<=80 chars):  export function CompareTables({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CompareTables
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/compare/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EventProperties.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/events/EventProperties.tsx
Signals: React
Excerpt (<=80 chars):  export function EventProperties({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventProperties
```

--------------------------------------------------------------------------------

---[FILE: EventsDataTable.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/events/EventsDataTable.tsx
Signals: React
Excerpt (<=80 chars):  export function EventsDataTable({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventsDataTable
```

--------------------------------------------------------------------------------

---[FILE: EventsMetricsBar.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/events/EventsMetricsBar.tsx
Signals: N/A
Excerpt (<=80 chars):  export function EventsMetricsBar({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventsMetricsBar
```

--------------------------------------------------------------------------------

---[FILE: EventsPage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/events/EventsPage.tsx
Signals: React
Excerpt (<=80 chars):  export function EventsPage({ websiteId }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventsPage
```

--------------------------------------------------------------------------------

---[FILE: EventsTable.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/events/EventsTable.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function EventsTable(props: DataTableProps) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventsTable
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/events/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/realtime/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RealtimeCountries.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/realtime/RealtimeCountries.tsx
Signals: React
Excerpt (<=80 chars):  export function RealtimeCountries({ data }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RealtimeCountries
```

--------------------------------------------------------------------------------

---[FILE: RealtimeHeader.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/realtime/RealtimeHeader.tsx
Signals: N/A
Excerpt (<=80 chars):  export function RealtimeHeader({ data }: { data: any }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RealtimeHeader
```

--------------------------------------------------------------------------------

---[FILE: RealtimeLog.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/realtime/RealtimeLog.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export function RealtimeLog({ data }: { data: any }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RealtimeLog
```

--------------------------------------------------------------------------------

---[FILE: RealtimePage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/realtime/RealtimePage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function RealtimePage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RealtimePage
```

--------------------------------------------------------------------------------

---[FILE: RealtimePaths.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/realtime/RealtimePaths.tsx
Signals: N/A
Excerpt (<=80 chars):  export function RealtimePaths({ data }: { data: any }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RealtimePaths
```

--------------------------------------------------------------------------------

---[FILE: RealtimeReferrers.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/realtime/RealtimeReferrers.tsx
Signals: N/A
Excerpt (<=80 chars):  export function RealtimeReferrers({ data }: { data: any }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RealtimeReferrers
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/segments/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SegmentAddButton.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/segments/SegmentAddButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SegmentAddButton({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SegmentAddButton
```

--------------------------------------------------------------------------------

---[FILE: SegmentDeleteButton.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/segments/SegmentDeleteButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SegmentDeleteButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SegmentDeleteButton
```

--------------------------------------------------------------------------------

---[FILE: SegmentEditButton.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/segments/SegmentEditButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SegmentEditButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SegmentEditButton
```

--------------------------------------------------------------------------------

---[FILE: SegmentEditForm.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/segments/SegmentEditForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SegmentEditForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SegmentEditForm
```

--------------------------------------------------------------------------------

---[FILE: SegmentsDataTable.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/segments/SegmentsDataTable.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SegmentsDataTable({ websiteId }: { websiteId?: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SegmentsDataTable
```

--------------------------------------------------------------------------------

---[FILE: SegmentsPage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/segments/SegmentsPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SegmentsPage({ websiteId }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SegmentsPage
```

--------------------------------------------------------------------------------

---[FILE: SegmentsTable.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/segments/SegmentsTable.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function SegmentsTable(props: DataTableProps) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SegmentsTable
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/sessions/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SessionActivity.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/sessions/SessionActivity.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SessionActivity({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionActivity
```

--------------------------------------------------------------------------------

---[FILE: SessionData.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/sessions/SessionData.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SessionData({ websiteId, sessionId }: { websiteId: string; s...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionData
```

--------------------------------------------------------------------------------

---[FILE: SessionInfo.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/sessions/SessionInfo.tsx
Signals: React
Excerpt (<=80 chars):  export function SessionInfo({ data }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionInfo
```

--------------------------------------------------------------------------------

---[FILE: SessionModal.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/sessions/SessionModal.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface SessionModalProps extends ModalProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionModal
- SessionModalProps
```

--------------------------------------------------------------------------------

---[FILE: SessionProfile.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/sessions/SessionProfile.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SessionProfile({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionProfile
```

--------------------------------------------------------------------------------

---[FILE: SessionProperties.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/sessions/SessionProperties.tsx
Signals: React
Excerpt (<=80 chars):  export function SessionProperties({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionProperties
```

--------------------------------------------------------------------------------

---[FILE: SessionsDataTable.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/sessions/SessionsDataTable.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SessionsDataTable({ websiteId }: { websiteId?: string; teamI...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionsDataTable
```

--------------------------------------------------------------------------------

---[FILE: SessionsMetricsBar.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/sessions/SessionsMetricsBar.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SessionsMetricsBar({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionsMetricsBar
```

--------------------------------------------------------------------------------

---[FILE: SessionsPage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/sessions/SessionsPage.tsx
Signals: React
Excerpt (<=80 chars):  export function SessionsPage({ websiteId }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionsPage
```

--------------------------------------------------------------------------------

---[FILE: SessionsTable.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/sessions/SessionsTable.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function SessionsTable(props: DataTableProps) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionsTable
```

--------------------------------------------------------------------------------

---[FILE: SessionStats.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/sessions/SessionStats.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SessionStats({ data }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionStats
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/settings/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SettingsPage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/settings/SettingsPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SettingsPage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SettingsPage
```

--------------------------------------------------------------------------------

---[FILE: WebsiteData.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/settings/WebsiteData.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteData({ websiteId, onSave }: { websiteId: string; onSa...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteData
```

--------------------------------------------------------------------------------

---[FILE: WebsiteDeleteForm.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/settings/WebsiteDeleteForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteDeleteForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteDeleteForm
```

--------------------------------------------------------------------------------

---[FILE: WebsiteEditForm.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/settings/WebsiteEditForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteEditForm({ websiteId, onSave }: { websiteId: string; ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteEditForm
```

--------------------------------------------------------------------------------

---[FILE: WebsiteResetForm.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/settings/WebsiteResetForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteResetForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteResetForm
```

--------------------------------------------------------------------------------

---[FILE: WebsiteSettings.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/settings/WebsiteSettings.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteSettings({ websiteId }: { websiteId: string; openExte...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteSettings
```

--------------------------------------------------------------------------------

---[FILE: WebsiteSettingsHeader.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/settings/WebsiteSettingsHeader.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function WebsiteSettingsHeader() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteSettingsHeader
```

--------------------------------------------------------------------------------

---[FILE: WebsiteShareForm.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/settings/WebsiteShareForm.tsx
Signals: React
Excerpt (<=80 chars):  export interface WebsiteShareFormProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteShareForm
- WebsiteShareFormProps
```

--------------------------------------------------------------------------------

---[FILE: WebsiteTrackingCode.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/settings/WebsiteTrackingCode.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteTrackingCode({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteTrackingCode
```

--------------------------------------------------------------------------------

---[FILE: WebsiteTransferForm.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/settings/WebsiteTransferForm.tsx
Signals: React
Excerpt (<=80 chars):  export function WebsiteTransferForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteTransferForm
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/admin/teams/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/admin/users/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/admin/websites/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/auth/login/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/batch/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/links/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/links/[linkId]/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/me/password/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/me/teams/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/me/websites/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/pixels/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/pixels/[pixelId]/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/reports/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/send/route.ts
Signals: Zod
Excerpt (<=80 chars): import { startOfHour, startOfMonth } from 'date-fns';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/teams/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/teams/join/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/teams/[teamId]/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/teams/[teamId]/links/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/teams/[teamId]/pixels/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/teams/[teamId]/users/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/teams/[teamId]/users/[userId]/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/teams/[teamId]/websites/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/users/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/users/[userId]/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/users/[userId]/teams/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/users/[userId]/websites/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/event-data/events/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/event-data/fields/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/event-data/properties/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/event-data/stats/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/event-data/values/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/events/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/events/series/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/export/route.ts
Signals: Zod
Excerpt (<=80 chars): import JSZip from 'jszip';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/metrics/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/metrics/expanded/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/pageviews/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/reports/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/segments/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/segments/[segmentId]/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/session-data/properties/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/session-data/values/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/sessions/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/sessions/stats/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/sessions/weekly/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/sessions/[sessionId]/activity/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/stats/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/transfer/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/api/websites/[websiteId]/values/route.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LoginForm.tsx]---
Location: umami-master/src/app/login/LoginForm.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function LoginForm() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoginForm
```

--------------------------------------------------------------------------------

---[FILE: LoginPage.tsx]---
Location: umami-master/src/app/login/LoginPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function LoginPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoginPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/login/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LogoutPage.tsx]---
Location: umami-master/src/app/logout/LogoutPage.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export function LogoutPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LogoutPage
```

--------------------------------------------------------------------------------

````
