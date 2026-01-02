---
source_txt: fullstack_samples/umami-master
converted_utc: 2025-12-18T10:37:23Z
part: 2
parts_total: 6
---

# FULLSTACK CODE DATABASE SAMPLES umami-master

## Extracted Reusable Patterns (Non-verbatim) (Part 2 of 6)

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

---[FILE: PixelPanels.tsx]---
Location: umami-master/src/app/(main)/pixels/[pixelId]/PixelPanels.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PixelPanels({ pixelId }: { pixelId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PixelPanels
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: umami-master/src/app/(main)/settings/layout.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SettingsLayout.tsx]---
Location: umami-master/src/app/(main)/settings/SettingsLayout.tsx
Signals: React
Excerpt (<=80 chars):  export function SettingsLayout({ children }: { children: ReactNode }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SettingsLayout
```

--------------------------------------------------------------------------------

---[FILE: SettingsNav.tsx]---
Location: umami-master/src/app/(main)/settings/SettingsNav.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SettingsNav({ onItemClick }: { onItemClick?: () => void }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SettingsNav
```

--------------------------------------------------------------------------------

---[FILE: DateRangeSetting.tsx]---
Location: umami-master/src/app/(main)/settings/preferences/DateRangeSetting.tsx
Signals: React
Excerpt (<=80 chars):  export function DateRangeSetting() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DateRangeSetting
```

--------------------------------------------------------------------------------

---[FILE: LanguageSetting.tsx]---
Location: umami-master/src/app/(main)/settings/preferences/LanguageSetting.tsx
Signals: React
Excerpt (<=80 chars):  export function LanguageSetting() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LanguageSetting
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/settings/preferences/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PreferenceSettings.tsx]---
Location: umami-master/src/app/(main)/settings/preferences/PreferenceSettings.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PreferenceSettings() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PreferenceSettings
```

--------------------------------------------------------------------------------

---[FILE: PreferencesPage.tsx]---
Location: umami-master/src/app/(main)/settings/preferences/PreferencesPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PreferencesPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PreferencesPage
```

--------------------------------------------------------------------------------

---[FILE: ThemeSetting.tsx]---
Location: umami-master/src/app/(main)/settings/preferences/ThemeSetting.tsx
Signals: N/A
Excerpt (<=80 chars):  export function ThemeSetting() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ThemeSetting
```

--------------------------------------------------------------------------------

---[FILE: TimezoneSetting.tsx]---
Location: umami-master/src/app/(main)/settings/preferences/TimezoneSetting.tsx
Signals: React
Excerpt (<=80 chars):  export function TimezoneSetting() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TimezoneSetting
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/settings/profile/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PasswordChangeButton.tsx]---
Location: umami-master/src/app/(main)/settings/profile/PasswordChangeButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PasswordChangeButton() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PasswordChangeButton
```

--------------------------------------------------------------------------------

---[FILE: PasswordEditForm.tsx]---
Location: umami-master/src/app/(main)/settings/profile/PasswordEditForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PasswordEditForm({ onSave, onClose }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PasswordEditForm
```

--------------------------------------------------------------------------------

---[FILE: ProfileHeader.tsx]---
Location: umami-master/src/app/(main)/settings/profile/ProfileHeader.tsx
Signals: N/A
Excerpt (<=80 chars):  export function ProfileHeader() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProfileHeader
```

--------------------------------------------------------------------------------

---[FILE: ProfilePage.tsx]---
Location: umami-master/src/app/(main)/settings/profile/ProfilePage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function ProfilePage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProfilePage
```

--------------------------------------------------------------------------------

---[FILE: ProfileSettings.tsx]---
Location: umami-master/src/app/(main)/settings/profile/ProfileSettings.tsx
Signals: N/A
Excerpt (<=80 chars):  export function ProfileSettings() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProfileSettings
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/settings/teams/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TeamsSettingsPage.tsx]---
Location: umami-master/src/app/(main)/settings/teams/TeamsSettingsPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamsSettingsPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamsSettingsPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/settings/teams/[teamId]/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TeamSettingsPage.tsx]---
Location: umami-master/src/app/(main)/settings/teams/[teamId]/TeamSettingsPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamSettingsPage({ teamId }: { teamId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamSettingsPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/settings/websites/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: WebsitesSettingsPage.tsx]---
Location: umami-master/src/app/(main)/settings/websites/WebsitesSettingsPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsitesSettingsPage({ teamId }: { teamId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsitesSettingsPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/settings/websites/[websiteId]/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: WebsiteSettingsPage.tsx]---
Location: umami-master/src/app/(main)/settings/websites/[websiteId]/WebsiteSettingsPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteSettingsPage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteSettingsPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/teams/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TeamAddForm.tsx]---
Location: umami-master/src/app/(main)/teams/TeamAddForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamAddForm({ onSave, onClose }: { onSave: () => void; onClo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamAddForm
```

--------------------------------------------------------------------------------

---[FILE: TeamJoinForm.tsx]---
Location: umami-master/src/app/(main)/teams/TeamJoinForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamJoinForm({ onSave, onClose }: { onSave: () => void; onCl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamJoinForm
```

--------------------------------------------------------------------------------

---[FILE: TeamLeaveButton.tsx]---
Location: umami-master/src/app/(main)/teams/TeamLeaveButton.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function TeamLeaveButton({ teamId, teamName }: { teamId: string; team...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamLeaveButton
```

--------------------------------------------------------------------------------

---[FILE: TeamLeaveForm.tsx]---
Location: umami-master/src/app/(main)/teams/TeamLeaveForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamLeaveForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamLeaveForm
```

--------------------------------------------------------------------------------

---[FILE: TeamProvider.tsx]---
Location: umami-master/src/app/(main)/teams/TeamProvider.tsx
Signals: React
Excerpt (<=80 chars):  export const TeamContext = createContext<Team>(null);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamProvider
- TeamContext
```

--------------------------------------------------------------------------------

---[FILE: TeamsAddButton.tsx]---
Location: umami-master/src/app/(main)/teams/TeamsAddButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamsAddButton({ onSave }: { onSave?: () => void }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamsAddButton
```

--------------------------------------------------------------------------------

---[FILE: TeamsDataTable.tsx]---
Location: umami-master/src/app/(main)/teams/TeamsDataTable.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function TeamsDataTable() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamsDataTable
```

--------------------------------------------------------------------------------

---[FILE: TeamsHeader.tsx]---
Location: umami-master/src/app/(main)/teams/TeamsHeader.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamsHeader({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamsHeader
```

--------------------------------------------------------------------------------

---[FILE: TeamsJoinButton.tsx]---
Location: umami-master/src/app/(main)/teams/TeamsJoinButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamsJoinButton() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamsJoinButton
```

--------------------------------------------------------------------------------

---[FILE: TeamsPage.tsx]---
Location: umami-master/src/app/(main)/teams/TeamsPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamsPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamsPage
```

--------------------------------------------------------------------------------

---[FILE: TeamsTable.tsx]---
Location: umami-master/src/app/(main)/teams/TeamsTable.tsx
Signals: React
Excerpt (<=80 chars):  export interface TeamsTableProps extends DataTableProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamsTable
- TeamsTableProps
```

--------------------------------------------------------------------------------

---[FILE: TeamDeleteForm.tsx]---
Location: umami-master/src/app/(main)/teams/[teamId]/TeamDeleteForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamDeleteForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamDeleteForm
```

--------------------------------------------------------------------------------

---[FILE: TeamEditForm.tsx]---
Location: umami-master/src/app/(main)/teams/[teamId]/TeamEditForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamEditForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamEditForm
```

--------------------------------------------------------------------------------

---[FILE: TeamManage.tsx]---
Location: umami-master/src/app/(main)/teams/[teamId]/TeamManage.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function TeamManage({ teamId }: { teamId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamManage
```

--------------------------------------------------------------------------------

---[FILE: TeamMemberEditButton.tsx]---
Location: umami-master/src/app/(main)/teams/[teamId]/TeamMemberEditButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamMemberEditButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamMemberEditButton
```

--------------------------------------------------------------------------------

---[FILE: TeamMemberEditForm.tsx]---
Location: umami-master/src/app/(main)/teams/[teamId]/TeamMemberEditForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamMemberEditForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamMemberEditForm
```

--------------------------------------------------------------------------------

---[FILE: TeamMemberRemoveButton.tsx]---
Location: umami-master/src/app/(main)/teams/[teamId]/TeamMemberRemoveButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamMemberRemoveButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamMemberRemoveButton
```

--------------------------------------------------------------------------------

---[FILE: TeamMembersDataTable.tsx]---
Location: umami-master/src/app/(main)/teams/[teamId]/TeamMembersDataTable.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamMembersDataTable({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamMembersDataTable
```

--------------------------------------------------------------------------------

---[FILE: TeamMembersTable.tsx]---
Location: umami-master/src/app/(main)/teams/[teamId]/TeamMembersTable.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamMembersTable({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamMembersTable
```

--------------------------------------------------------------------------------

---[FILE: TeamSettings.tsx]---
Location: umami-master/src/app/(main)/teams/[teamId]/TeamSettings.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamSettings({ teamId }: { teamId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamSettings
```

--------------------------------------------------------------------------------

---[FILE: TeamWebsiteRemoveButton.tsx]---
Location: umami-master/src/app/(main)/teams/[teamId]/TeamWebsiteRemoveButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamWebsiteRemoveButton({ teamId, websiteId, onSave }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamWebsiteRemoveButton
```

--------------------------------------------------------------------------------

---[FILE: TeamWebsitesDataTable.tsx]---
Location: umami-master/src/app/(main)/teams/[teamId]/TeamWebsitesDataTable.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TeamWebsitesDataTable({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamWebsitesDataTable
```

--------------------------------------------------------------------------------

---[FILE: TeamWebsitesTable.tsx]---
Location: umami-master/src/app/(main)/teams/[teamId]/TeamWebsitesTable.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function TeamWebsitesTable({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamWebsitesTable
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: WebsiteAddButton.tsx]---
Location: umami-master/src/app/(main)/websites/WebsiteAddButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteAddButton({ teamId, onSave }: { teamId: string; onSav...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteAddButton
```

--------------------------------------------------------------------------------

---[FILE: WebsiteAddForm.tsx]---
Location: umami-master/src/app/(main)/websites/WebsiteAddForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteAddForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteAddForm
```

--------------------------------------------------------------------------------

---[FILE: WebsiteProvider.tsx]---
Location: umami-master/src/app/(main)/websites/WebsiteProvider.tsx
Signals: React
Excerpt (<=80 chars):  export const WebsiteContext = createContext<Website>(null);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteProvider
- WebsiteContext
```

--------------------------------------------------------------------------------

---[FILE: WebsitesDataTable.tsx]---
Location: umami-master/src/app/(main)/websites/WebsitesDataTable.tsx
Signals: Next.js
Excerpt (<=80 chars):  export function WebsitesDataTable({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsitesDataTable
```

--------------------------------------------------------------------------------

---[FILE: WebsitesHeader.tsx]---
Location: umami-master/src/app/(main)/websites/WebsitesHeader.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface WebsitesHeaderProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsitesHeader
- WebsitesHeaderProps
```

--------------------------------------------------------------------------------

---[FILE: WebsitesPage.tsx]---
Location: umami-master/src/app/(main)/websites/WebsitesPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsitesPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsitesPage
```

--------------------------------------------------------------------------------

---[FILE: WebsitesTable.tsx]---
Location: umami-master/src/app/(main)/websites/WebsitesTable.tsx
Signals: React
Excerpt (<=80 chars):  export interface WebsitesTableProps extends DataTableProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsitesTable
- WebsitesTableProps
```

--------------------------------------------------------------------------------

---[FILE: ExpandedViewModal.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/ExpandedViewModal.tsx
Signals: N/A
Excerpt (<=80 chars):  export function ExpandedViewModal({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExpandedViewModal
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/layout.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: WebsiteChart.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/WebsiteChart.tsx
Signals: React
Excerpt (<=80 chars):  export function WebsiteChart({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteChart
```

--------------------------------------------------------------------------------

---[FILE: WebsiteControls.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/WebsiteControls.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteControls({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteControls
```

--------------------------------------------------------------------------------

---[FILE: WebsiteExpandedMenu.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/WebsiteExpandedMenu.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteExpandedMenu({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteExpandedMenu
```

--------------------------------------------------------------------------------

---[FILE: WebsiteExpandedView.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/WebsiteExpandedView.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteExpandedView({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteExpandedView
```

--------------------------------------------------------------------------------

---[FILE: WebsiteHeader.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/WebsiteHeader.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteHeader({ showActions }: { showActions?: boolean }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteHeader
```

--------------------------------------------------------------------------------

---[FILE: WebsiteLayout.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/WebsiteLayout.tsx
Signals: React
Excerpt (<=80 chars):  export function WebsiteLayout({ websiteId, children }: { websiteId: string; ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteLayout
```

--------------------------------------------------------------------------------

---[FILE: WebsiteMenu.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/WebsiteMenu.tsx
Signals: React
Excerpt (<=80 chars):  export function WebsiteMenu({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteMenu
```

--------------------------------------------------------------------------------

---[FILE: WebsiteMetricsBar.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/WebsiteMetricsBar.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteMetricsBar({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteMetricsBar
```

--------------------------------------------------------------------------------

---[FILE: WebsiteNav.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/WebsiteNav.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteNav({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteNav
```

--------------------------------------------------------------------------------

---[FILE: WebsitePage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/WebsitePage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsitePage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsitePage
```

--------------------------------------------------------------------------------

---[FILE: WebsitePanels.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/WebsitePanels.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsitePanels({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsitePanels
```

--------------------------------------------------------------------------------

---[FILE: WebsiteTabs.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/WebsiteTabs.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteTabs() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteTabs
```

--------------------------------------------------------------------------------

---[FILE: Attribution.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/attribution/Attribution.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface AttributionProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Attribution
- AttributionProps
```

--------------------------------------------------------------------------------

---[FILE: AttributionPage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/attribution/AttributionPage.tsx
Signals: React
Excerpt (<=80 chars):  export function AttributionPage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AttributionPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/attribution/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Breakdown.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/breakdown/Breakdown.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface BreakdownProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Breakdown
- BreakdownProps
```

--------------------------------------------------------------------------------

---[FILE: BreakdownPage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/breakdown/BreakdownPage.tsx
Signals: React
Excerpt (<=80 chars):  export function BreakdownPage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BreakdownPage
```

--------------------------------------------------------------------------------

---[FILE: FieldSelectForm.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/breakdown/FieldSelectForm.tsx
Signals: React
Excerpt (<=80 chars):  export function FieldSelectForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FieldSelectForm
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/breakdown/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Funnel.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/funnels/Funnel.tsx
Signals: N/A
Excerpt (<=80 chars):  export function Funnel({ id, name, type, parameters, websiteId }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Funnel
```

--------------------------------------------------------------------------------

---[FILE: FunnelAddButton.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/funnels/FunnelAddButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function FunnelAddButton({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FunnelAddButton
```

--------------------------------------------------------------------------------

---[FILE: FunnelEditForm.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/funnels/FunnelEditForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function FunnelEditForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FunnelEditForm
```

--------------------------------------------------------------------------------

---[FILE: FunnelsPage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/funnels/FunnelsPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function FunnelsPage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FunnelsPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/funnels/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Goal.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/goals/Goal.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface GoalProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Goal
- GoalData
- GoalProps
```

--------------------------------------------------------------------------------

---[FILE: GoalAddButton.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/goals/GoalAddButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function GoalAddButton({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoalAddButton
```

--------------------------------------------------------------------------------

---[FILE: GoalEditForm.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/goals/GoalEditForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function GoalEditForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoalEditForm
```

--------------------------------------------------------------------------------

---[FILE: GoalsPage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/goals/GoalsPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function GoalsPage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoalsPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/goals/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Journey.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/journeys/Journey.tsx
Signals: React
Excerpt (<=80 chars):  export interface JourneyProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Journey
- JourneyProps
```

--------------------------------------------------------------------------------

---[FILE: JourneysPage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/journeys/JourneysPage.tsx
Signals: React
Excerpt (<=80 chars):  export function JourneysPage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JourneysPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/journeys/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/retention/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Retention.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/retention/Retention.tsx
Signals: React
Excerpt (<=80 chars):  export interface RetentionProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Retention
- RetentionProps
```

--------------------------------------------------------------------------------

---[FILE: RetentionPage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/retention/RetentionPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function RetentionPage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RetentionPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/revenue/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Revenue.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/revenue/Revenue.tsx
Signals: React
Excerpt (<=80 chars):  export interface RevenueProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Revenue
- RevenueProps
```

--------------------------------------------------------------------------------

---[FILE: RevenuePage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/revenue/RevenuePage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function RevenuePage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RevenuePage
```

--------------------------------------------------------------------------------

---[FILE: RevenueTable.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/revenue/RevenueTable.tsx
Signals: N/A
Excerpt (<=80 chars):  export function RevenueTable({ data = [] }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RevenueTable
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/utm/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UTM.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/utm/UTM.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface UTMProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UTM
- UTMProps
```

--------------------------------------------------------------------------------

---[FILE: UTMPage.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/(reports)/utm/UTMPage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function UTMPage({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UTMPage
```

--------------------------------------------------------------------------------

---[FILE: CohortAddButton.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/cohorts/CohortAddButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function CohortAddButton({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CohortAddButton
```

--------------------------------------------------------------------------------

---[FILE: CohortDeleteButton.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/cohorts/CohortDeleteButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function CohortDeleteButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CohortDeleteButton
```

--------------------------------------------------------------------------------

---[FILE: CohortEditButton.tsx]---
Location: umami-master/src/app/(main)/websites/[websiteId]/cohorts/CohortEditButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function CohortEditButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CohortEditButton
```

--------------------------------------------------------------------------------

````
