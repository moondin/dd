---
source_txt: fullstack_samples/umami-master
converted_utc: 2025-12-18T10:37:23Z
part: 1
parts_total: 6
---

# FULLSTACK CODE DATABASE SAMPLES umami-master

## Extracted Reusable Patterns (Non-verbatim) (Part 1 of 6)

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

---[FILE: prisma.config.ts]---
Location: umami-master/prisma.config.ts
Signals: TypeORM
Excerpt (<=80 chars): import 'dotenv/config';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: schema.sql]---
Location: umami-master/db/clickhouse/schema.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE umami.website_event

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- umami.website_event
- umami.event_data
- umami.session_data
- umami.website_event_stats_hourly
- umami.website_revenue
```

--------------------------------------------------------------------------------

---[FILE: 02_add_visit_id.sql]---
Location: umami-master/db/clickhouse/migrations/02_add_visit_id.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE umami.website_event_join

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- umami.website_event_join
- umami.website_event_new
```

--------------------------------------------------------------------------------

---[FILE: 03_session_data.sql]---
Location: umami-master/db/clickhouse/migrations/03_session_data.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE umami.event_data_new

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- umami.event_data_new
- umami.session_data
```

--------------------------------------------------------------------------------

---[FILE: 05_add_utm_clid.sql]---
Location: umami-master/db/clickhouse/migrations/05_add_utm_clid.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE umami.website_event_new

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- umami.website_event_new
- umami.website_event_stats_hourly_new
```

--------------------------------------------------------------------------------

---[FILE: 08_update_hostname_view.sql]---
Location: umami-master/db/clickhouse/migrations/08_update_hostname_view.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE umami.website_event_stats_hourly_new

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- umami.website_event_stats_hourly_new
```

--------------------------------------------------------------------------------

---[FILE: convert-utm-clid-columns.sql]---
Location: umami-master/db/postgresql/data-migrations/convert-utm-clid-columns.sql
Signals: MySQL
Excerpt (<=80 chars): -----------------------------------------------------

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: populate-revenue-table.sql]---
Location: umami-master/db/postgresql/data-migrations/populate-revenue-table.sql
Signals: MySQL
Excerpt (<=80 chars): -----------------------------------------------------

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: middleware.ts]---
Location: umami-master/docker/middleware.ts
Signals: Next.js
Excerpt (<=80 chars):  export const config = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- config
```

--------------------------------------------------------------------------------

---[FILE: migration.sql]---
Location: umami-master/prisma/migrations/01_init/migration.sql
Signals: N/A
Excerpt (<=80 chars): CREATE EXTENSION IF NOT EXISTS "pgcrypto";

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- "user"
- "session"
- "website"
- "website_event"
- "event_data"
- "team"
- "team_user"
- "team_website"
```

--------------------------------------------------------------------------------

---[FILE: migration.sql]---
Location: umami-master/prisma/migrations/02_report_schema_session_data/migration.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE "session_data" (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- "session_data"
- "report"
```

--------------------------------------------------------------------------------

---[FILE: migration.sql]---
Location: umami-master/prisma/migrations/11_add_segment/migration.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE "segment" (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- "segment"
```

--------------------------------------------------------------------------------

---[FILE: migration.sql]---
Location: umami-master/prisma/migrations/13_add_revenue/migration.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE "revenue" (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- "revenue"
```

--------------------------------------------------------------------------------

---[FILE: migration.sql]---
Location: umami-master/prisma/migrations/14_add_link_and_pixel/migration.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE "link" (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- "link"
- "pixel"
```

--------------------------------------------------------------------------------

---[FILE: build-prisma-client.js]---
Location: umami-master/scripts/build-prisma-client.js
Signals: Prisma
Excerpt (<=80 chars): import esbuild from 'esbuild';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: check-db.js]---
Location: umami-master/scripts/check-db.js
Signals: Prisma
Excerpt (<=80 chars): /* eslint-disable no-console */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: start-env.js]---
Location: umami-master/scripts/start-env.js
Signals: Next.js
Excerpt (<=80 chars): import 'dotenv/config';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: umami-master/scripts/seed/index.ts
Signals: Prisma
Excerpt (<=80 chars):  export interface SeedConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SeedConfig
- SeedResult
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: umami-master/scripts/seed/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export interface WeightedOption<T> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- randomInt
- randomFloat
- uuid
- generateDatesBetween
- addHours
- addMinutes
- addSeconds
- subDays
- formatNumber
- progressBar
- WeightedOption
```

--------------------------------------------------------------------------------

---[FILE: devices.ts]---
Location: umami-master/scripts/seed/distributions/devices.ts
Signals: N/A
Excerpt (<=80 chars):  export type DeviceType = 'desktop' | 'mobile' | 'tablet';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getRandomDevice
- DeviceType
- DeviceInfo
```

--------------------------------------------------------------------------------

---[FILE: geographic.ts]---
Location: umami-master/scripts/seed/distributions/geographic.ts
Signals: N/A
Excerpt (<=80 chars):  export function getRandomGeo(): GeoLocation {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getRandomGeo
- getRandomLanguage
```

--------------------------------------------------------------------------------

---[FILE: referrers.ts]---
Location: umami-master/scripts/seed/distributions/referrers.ts
Signals: N/A
Excerpt (<=80 chars):  export type ReferrerType = 'direct' | 'organic' | 'social' | 'paid' | 'refer...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getRandomReferrer
- ReferrerType
- ReferrerInfo
```

--------------------------------------------------------------------------------

---[FILE: temporal.ts]---
Location: umami-master/scripts/seed/distributions/temporal.ts
Signals: N/A
Excerpt (<=80 chars):  export function getWeightedHour(): number {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getWeightedHour
- getDayOfWeekMultiplier
- generateTimestampForDay
- getSessionCountForDay
```

--------------------------------------------------------------------------------

---[FILE: events.ts]---
Location: umami-master/scripts/seed/generators/events.ts
Signals: N/A
Excerpt (<=80 chars):  export const EVENT_TYPE = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateEventsForSession
- EVENT_TYPE
- PageConfig
- CustomEventConfig
- JourneyConfig
- EventData
- EventDataEntry
- SiteConfig
```

--------------------------------------------------------------------------------

---[FILE: revenue.ts]---
Location: umami-master/scripts/seed/generators/revenue.ts
Signals: N/A
Excerpt (<=80 chars):  export interface RevenueConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateRevenue
- generateRevenueForEvents
- RevenueConfig
- RevenueData
```

--------------------------------------------------------------------------------

---[FILE: sessions.ts]---
Location: umami-master/scripts/seed/generators/sessions.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SessionData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createSession
- createSessions
- SessionData
```

--------------------------------------------------------------------------------

---[FILE: blog.ts]---
Location: umami-master/scripts/seed/sites/blog.ts
Signals: N/A
Excerpt (<=80 chars):  export const BLOG_WEBSITE_NAME = 'Demo Blog';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getBlogSiteConfig
- getBlogJourney
- BLOG_WEBSITE_NAME
- BLOG_WEBSITE_DOMAIN
- BLOG_SESSIONS_PER_DAY
```

--------------------------------------------------------------------------------

---[FILE: saas.ts]---
Location: umami-master/scripts/seed/sites/saas.ts
Signals: N/A
Excerpt (<=80 chars):  export const SAAS_WEBSITE_NAME = 'Demo SaaS';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSaasSiteConfig
- getSaasJourney
- SAAS_WEBSITE_NAME
- SAAS_WEBSITE_DOMAIN
- SAAS_SESSIONS_PER_DAY
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: umami-master/src/app/layout.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/page.tsx
Signals: React, Next.js
Excerpt (<=80 chars): 'use client';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Providers.tsx]---
Location: umami-master/src/app/Providers.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export function Providers({ children }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Providers
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/(collect)/p/[slug]/route.ts
Signals: Next.js
Excerpt (<=80 chars): export const dynamic = 'force-dynamic';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dynamic
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: umami-master/src/app/(collect)/q/[slug]/route.ts
Signals: Next.js
Excerpt (<=80 chars): export const dynamic = 'force-dynamic';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dynamic
```

--------------------------------------------------------------------------------

---[FILE: App.tsx]---
Location: umami-master/src/app/(main)/App.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export function App({ children }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- App
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: umami-master/src/app/(main)/layout.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MobileNav.tsx]---
Location: umami-master/src/app/(main)/MobileNav.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function MobileNav() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MobileNav
```

--------------------------------------------------------------------------------

---[FILE: SideNav.tsx]---
Location: umami-master/src/app/(main)/SideNav.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export function SideNav(props: SidebarProps) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SideNav
```

--------------------------------------------------------------------------------

---[FILE: TopNav.tsx]---
Location: umami-master/src/app/(main)/TopNav.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TopNav() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TopNav
```

--------------------------------------------------------------------------------

---[FILE: UpdateNotice.tsx]---
Location: umami-master/src/app/(main)/UpdateNotice.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export function UpdateNotice({ user, config }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateNotice
```

--------------------------------------------------------------------------------

---[FILE: AdminLayout.tsx]---
Location: umami-master/src/app/(main)/admin/AdminLayout.tsx
Signals: React
Excerpt (<=80 chars):  export function AdminLayout({ children }: { children: ReactNode }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AdminLayout
```

--------------------------------------------------------------------------------

---[FILE: AdminNav.tsx]---
Location: umami-master/src/app/(main)/admin/AdminNav.tsx
Signals: N/A
Excerpt (<=80 chars):  export function AdminNav({ onItemClick }: { onItemClick?: () => void }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AdminNav
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: umami-master/src/app/(main)/admin/layout.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AdminTeamsDataTable.tsx]---
Location: umami-master/src/app/(main)/admin/teams/AdminTeamsDataTable.tsx
Signals: React
Excerpt (<=80 chars):  export function AdminTeamsDataTable({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AdminTeamsDataTable
```

--------------------------------------------------------------------------------

---[FILE: AdminTeamsPage.tsx]---
Location: umami-master/src/app/(main)/admin/teams/AdminTeamsPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function AdminTeamsPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AdminTeamsPage
```

--------------------------------------------------------------------------------

---[FILE: AdminTeamsTable.tsx]---
Location: umami-master/src/app/(main)/admin/teams/AdminTeamsTable.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export function AdminTeamsTable({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AdminTeamsTable
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/admin/teams/page.tsx
Signals: Next.js
Excerpt (<=80 chars): export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AdminTeamPage.tsx]---
Location: umami-master/src/app/(main)/admin/teams/[teamId]/AdminTeamPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function AdminTeamPage({ teamId }: { teamId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AdminTeamPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/admin/teams/[teamId]/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/admin/users/page.tsx
Signals: Next.js
Excerpt (<=80 chars): export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UserAddButton.tsx]---
Location: umami-master/src/app/(main)/admin/users/UserAddButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function UserAddButton({ onSave }: { onSave?: () => void }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserAddButton
```

--------------------------------------------------------------------------------

---[FILE: UserAddForm.tsx]---
Location: umami-master/src/app/(main)/admin/users/UserAddForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function UserAddForm({ onSave, onClose }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserAddForm
```

--------------------------------------------------------------------------------

---[FILE: UserDeleteButton.tsx]---
Location: umami-master/src/app/(main)/admin/users/UserDeleteButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function UserDeleteButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserDeleteButton
```

--------------------------------------------------------------------------------

---[FILE: UserDeleteForm.tsx]---
Location: umami-master/src/app/(main)/admin/users/UserDeleteForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function UserDeleteForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserDeleteForm
```

--------------------------------------------------------------------------------

---[FILE: UsersDataTable.tsx]---
Location: umami-master/src/app/(main)/admin/users/UsersDataTable.tsx
Signals: React
Excerpt (<=80 chars):  export function UsersDataTable({ showActions }: { showActions?: boolean; chi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UsersDataTable
```

--------------------------------------------------------------------------------

---[FILE: UsersPage.tsx]---
Location: umami-master/src/app/(main)/admin/users/UsersPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function UsersPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UsersPage
```

--------------------------------------------------------------------------------

---[FILE: UsersTable.tsx]---
Location: umami-master/src/app/(main)/admin/users/UsersTable.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export function UsersTable({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UsersTable
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/admin/users/[userId]/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UserEditForm.tsx]---
Location: umami-master/src/app/(main)/admin/users/[userId]/UserEditForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function UserEditForm({ userId, onSave }: { userId: string; onSave?: ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserEditForm
```

--------------------------------------------------------------------------------

---[FILE: UserHeader.tsx]---
Location: umami-master/src/app/(main)/admin/users/[userId]/UserHeader.tsx
Signals: N/A
Excerpt (<=80 chars):  export function UserHeader() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserHeader
```

--------------------------------------------------------------------------------

---[FILE: UserPage.tsx]---
Location: umami-master/src/app/(main)/admin/users/[userId]/UserPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function UserPage({ userId }: { userId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserPage
```

--------------------------------------------------------------------------------

---[FILE: UserProvider.tsx]---
Location: umami-master/src/app/(main)/admin/users/[userId]/UserProvider.tsx
Signals: React
Excerpt (<=80 chars):  export const UserContext = createContext<User>(null);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserProvider
- UserContext
```

--------------------------------------------------------------------------------

---[FILE: UserSettings.tsx]---
Location: umami-master/src/app/(main)/admin/users/[userId]/UserSettings.tsx
Signals: N/A
Excerpt (<=80 chars):  export function UserSettings({ userId }: { userId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserSettings
```

--------------------------------------------------------------------------------

---[FILE: UserWebsites.tsx]---
Location: umami-master/src/app/(main)/admin/users/[userId]/UserWebsites.tsx
Signals: N/A
Excerpt (<=80 chars):  export function UserWebsites({ userId }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserWebsites
```

--------------------------------------------------------------------------------

---[FILE: AdminWebsitesDataTable.tsx]---
Location: umami-master/src/app/(main)/admin/websites/AdminWebsitesDataTable.tsx
Signals: N/A
Excerpt (<=80 chars):  export function AdminWebsitesDataTable() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AdminWebsitesDataTable
```

--------------------------------------------------------------------------------

---[FILE: AdminWebsitesPage.tsx]---
Location: umami-master/src/app/(main)/admin/websites/AdminWebsitesPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function AdminWebsitesPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AdminWebsitesPage
```

--------------------------------------------------------------------------------

---[FILE: AdminWebsitesTable.tsx]---
Location: umami-master/src/app/(main)/admin/websites/AdminWebsitesTable.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export function AdminWebsitesTable({ data = [] }: { data: any[] }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AdminWebsitesTable
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/admin/websites/page.tsx
Signals: Next.js
Excerpt (<=80 chars): export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AdminWebsitePage.tsx]---
Location: umami-master/src/app/(main)/admin/websites/[websiteId]/AdminWebsitePage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function AdminWebsitePage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AdminWebsitePage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/admin/websites/[websiteId]/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: BoardAddButton.tsx]---
Location: umami-master/src/app/(main)/boards/BoardAddButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function BoardAddButton() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BoardAddButton
```

--------------------------------------------------------------------------------

---[FILE: BoardAddForm.tsx]---
Location: umami-master/src/app/(main)/boards/BoardAddForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function BoardAddForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BoardAddForm
```

--------------------------------------------------------------------------------

---[FILE: BoardsPage.tsx]---
Location: umami-master/src/app/(main)/boards/BoardsPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function BoardsPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BoardsPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/boards/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Board.tsx]---
Location: umami-master/src/app/(main)/boards/[boardId]/Board.tsx
Signals: N/A
Excerpt (<=80 chars):  export function Board({ boardId }: { boardId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Board
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/boards/[boardId]/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/console/[websiteId]/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TestConsolePage.tsx]---
Location: umami-master/src/app/(main)/console/[websiteId]/TestConsolePage.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function TestConsolePage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestConsolePage
```

--------------------------------------------------------------------------------

---[FILE: DashboardPage.tsx]---
Location: umami-master/src/app/(main)/dashboard/DashboardPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function DashboardPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DashboardPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/dashboard/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LinkAddButton.tsx]---
Location: umami-master/src/app/(main)/links/LinkAddButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function LinkAddButton({ teamId }: { teamId?: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkAddButton
```

--------------------------------------------------------------------------------

---[FILE: LinkDeleteButton.tsx]---
Location: umami-master/src/app/(main)/links/LinkDeleteButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function LinkDeleteButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkDeleteButton
```

--------------------------------------------------------------------------------

---[FILE: LinkEditButton.tsx]---
Location: umami-master/src/app/(main)/links/LinkEditButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function LinkEditButton({ linkId }: { linkId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkEditButton
```

--------------------------------------------------------------------------------

---[FILE: LinkEditForm.tsx]---
Location: umami-master/src/app/(main)/links/LinkEditForm.tsx
Signals: React
Excerpt (<=80 chars):  export function LinkEditForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkEditForm
```

--------------------------------------------------------------------------------

---[FILE: LinkProvider.tsx]---
Location: umami-master/src/app/(main)/links/LinkProvider.tsx
Signals: React
Excerpt (<=80 chars):  export const LinkContext = createContext<Link>(null);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkProvider
- LinkContext
```

--------------------------------------------------------------------------------

---[FILE: LinksDataTable.tsx]---
Location: umami-master/src/app/(main)/links/LinksDataTable.tsx
Signals: N/A
Excerpt (<=80 chars):  export function LinksDataTable() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinksDataTable
```

--------------------------------------------------------------------------------

---[FILE: LinksPage.tsx]---
Location: umami-master/src/app/(main)/links/LinksPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function LinksPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinksPage
```

--------------------------------------------------------------------------------

---[FILE: LinksTable.tsx]---
Location: umami-master/src/app/(main)/links/LinksTable.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function LinksTable(props: DataTableProps) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinksTable
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/links/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LinkControls.tsx]---
Location: umami-master/src/app/(main)/links/[linkId]/LinkControls.tsx
Signals: N/A
Excerpt (<=80 chars):  export function LinkControls({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkControls
```

--------------------------------------------------------------------------------

---[FILE: LinkHeader.tsx]---
Location: umami-master/src/app/(main)/links/[linkId]/LinkHeader.tsx
Signals: N/A
Excerpt (<=80 chars):  export function LinkHeader() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkHeader
```

--------------------------------------------------------------------------------

---[FILE: LinkMetricsBar.tsx]---
Location: umami-master/src/app/(main)/links/[linkId]/LinkMetricsBar.tsx
Signals: N/A
Excerpt (<=80 chars):  export function LinkMetricsBar({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkMetricsBar
```

--------------------------------------------------------------------------------

---[FILE: LinkPage.tsx]---
Location: umami-master/src/app/(main)/links/[linkId]/LinkPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function LinkPage({ linkId }: { linkId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkPage
```

--------------------------------------------------------------------------------

---[FILE: LinkPanels.tsx]---
Location: umami-master/src/app/(main)/links/[linkId]/LinkPanels.tsx
Signals: N/A
Excerpt (<=80 chars):  export function LinkPanels({ linkId }: { linkId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkPanels
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/links/[linkId]/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/pixels/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PixelAddButton.tsx]---
Location: umami-master/src/app/(main)/pixels/PixelAddButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PixelAddButton({ teamId }: { teamId?: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PixelAddButton
```

--------------------------------------------------------------------------------

---[FILE: PixelDeleteButton.tsx]---
Location: umami-master/src/app/(main)/pixels/PixelDeleteButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PixelDeleteButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PixelDeleteButton
```

--------------------------------------------------------------------------------

---[FILE: PixelEditButton.tsx]---
Location: umami-master/src/app/(main)/pixels/PixelEditButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PixelEditButton({ pixelId }: { pixelId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PixelEditButton
```

--------------------------------------------------------------------------------

---[FILE: PixelEditForm.tsx]---
Location: umami-master/src/app/(main)/pixels/PixelEditForm.tsx
Signals: React
Excerpt (<=80 chars):  export function PixelEditForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PixelEditForm
```

--------------------------------------------------------------------------------

---[FILE: PixelProvider.tsx]---
Location: umami-master/src/app/(main)/pixels/PixelProvider.tsx
Signals: React
Excerpt (<=80 chars):  export const PixelContext = createContext<Pixel>(null);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PixelProvider
- PixelContext
```

--------------------------------------------------------------------------------

---[FILE: PixelsDataTable.tsx]---
Location: umami-master/src/app/(main)/pixels/PixelsDataTable.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PixelsDataTable() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PixelsDataTable
```

--------------------------------------------------------------------------------

---[FILE: PixelsPage.tsx]---
Location: umami-master/src/app/(main)/pixels/PixelsPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PixelsPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PixelsPage
```

--------------------------------------------------------------------------------

---[FILE: PixelsTable.tsx]---
Location: umami-master/src/app/(main)/pixels/PixelsTable.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function PixelsTable(props: DataTableProps) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PixelsTable
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/pixels/[pixelId]/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PixelControls.tsx]---
Location: umami-master/src/app/(main)/pixels/[pixelId]/PixelControls.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PixelControls({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PixelControls
```

--------------------------------------------------------------------------------

---[FILE: PixelHeader.tsx]---
Location: umami-master/src/app/(main)/pixels/[pixelId]/PixelHeader.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PixelHeader() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PixelHeader
```

--------------------------------------------------------------------------------

---[FILE: PixelMetricsBar.tsx]---
Location: umami-master/src/app/(main)/pixels/[pixelId]/PixelMetricsBar.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PixelMetricsBar({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PixelMetricsBar
```

--------------------------------------------------------------------------------

---[FILE: PixelPage.tsx]---
Location: umami-master/src/app/(main)/pixels/[pixelId]/PixelPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PixelPage({ pixelId }: { pixelId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PixelPage
```

--------------------------------------------------------------------------------

````
