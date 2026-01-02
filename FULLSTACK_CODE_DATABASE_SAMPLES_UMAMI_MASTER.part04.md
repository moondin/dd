---
source_txt: fullstack_samples/umami-master
converted_utc: 2025-12-18T10:37:23Z
part: 4
parts_total: 6
---

# FULLSTACK CODE DATABASE SAMPLES umami-master

## Extracted Reusable Patterns (Non-verbatim) (Part 4 of 6)

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

---[FILE: page.tsx]---
Location: umami-master/src/app/logout/page.tsx
Signals: Next.js
Excerpt (<=80 chars):  export const metadata: Metadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Footer.tsx]---
Location: umami-master/src/app/share/[...shareId]/Footer.tsx
Signals: N/A
Excerpt (<=80 chars):  export function Footer() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Footer
```

--------------------------------------------------------------------------------

---[FILE: Header.tsx]---
Location: umami-master/src/app/share/[...shareId]/Header.tsx
Signals: N/A
Excerpt (<=80 chars):  export function Header() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Header
```

--------------------------------------------------------------------------------

---[FILE: SharePage.tsx]---
Location: umami-master/src/app/share/[...shareId]/SharePage.tsx
Signals: React
Excerpt (<=80 chars):  export function SharePage({ shareId }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SharePage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: umami-master/src/app/sso/page.tsx
Signals: React
Excerpt (<=80 chars): import { Suspense } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SSOPage.tsx]---
Location: umami-master/src/app/sso/SSOPage.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export function SSOPage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SSOPage
```

--------------------------------------------------------------------------------

---[FILE: messages.ts]---
Location: umami-master/src/components/messages.ts
Signals: N/A
Excerpt (<=80 chars):  export const labels = defineMessages({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- labels
- messages
```

--------------------------------------------------------------------------------

---[FILE: Board.tsx]---
Location: umami-master/src/components/boards/Board.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface BoardProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Board
- BoardProps
```

--------------------------------------------------------------------------------

---[FILE: BarChart.tsx]---
Location: umami-master/src/components/charts/BarChart.tsx
Signals: React
Excerpt (<=80 chars):  export interface BarChartProps extends ChartProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BarChart
- BarChartProps
```

--------------------------------------------------------------------------------

---[FILE: BubbleChart.tsx]---
Location: umami-master/src/components/charts/BubbleChart.tsx
Signals: React
Excerpt (<=80 chars):  export interface BubbleChartProps extends ChartProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BubbleChart
- BubbleChartProps
```

--------------------------------------------------------------------------------

---[FILE: Chart.tsx]---
Location: umami-master/src/components/charts/Chart.tsx
Signals: React
Excerpt (<=80 chars):  export interface ChartProps extends BoxProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Chart
- ChartProps
```

--------------------------------------------------------------------------------

---[FILE: ChartTooltip.tsx]---
Location: umami-master/src/components/charts/ChartTooltip.tsx
Signals: React
Excerpt (<=80 chars):  export function ChartTooltip({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChartTooltip
```

--------------------------------------------------------------------------------

---[FILE: PieChart.tsx]---
Location: umami-master/src/components/charts/PieChart.tsx
Signals: React
Excerpt (<=80 chars):  export interface PieChartProps extends ChartProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PieChart
- PieChartProps
```

--------------------------------------------------------------------------------

---[FILE: ActionForm.tsx]---
Location: umami-master/src/components/common/ActionForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function ActionForm({ label, description, children }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActionForm
```

--------------------------------------------------------------------------------

---[FILE: Avatar.tsx]---
Location: umami-master/src/components/common/Avatar.tsx
Signals: React
Excerpt (<=80 chars):  export function Avatar({ seed, size = 128, ...props }: { seed: string; size?...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Avatar
```

--------------------------------------------------------------------------------

---[FILE: ConfirmationForm.tsx]---
Location: umami-master/src/components/common/ConfirmationForm.tsx
Signals: React
Excerpt (<=80 chars):  export interface ConfirmationFormProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConfirmationForm
- ConfirmationFormProps
```

--------------------------------------------------------------------------------

---[FILE: DataGrid.tsx]---
Location: umami-master/src/components/common/DataGrid.tsx
Signals: React
Excerpt (<=80 chars):  export interface DataGridProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataGrid
- DataGridProps
```

--------------------------------------------------------------------------------

---[FILE: DateDisplay.tsx]---
Location: umami-master/src/components/common/DateDisplay.tsx
Signals: N/A
Excerpt (<=80 chars):  export function DateDisplay({ startDate, endDate }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DateDisplay
```

--------------------------------------------------------------------------------

---[FILE: DateDistance.tsx]---
Location: umami-master/src/components/common/DateDistance.tsx
Signals: N/A
Excerpt (<=80 chars):  export function DateDistance({ date }: { date: Date }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DateDistance
```

--------------------------------------------------------------------------------

---[FILE: Empty.tsx]---
Location: umami-master/src/components/common/Empty.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface EmptyProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Empty
- EmptyProps
```

--------------------------------------------------------------------------------

---[FILE: EmptyPlaceholder.tsx]---
Location: umami-master/src/components/common/EmptyPlaceholder.tsx
Signals: React
Excerpt (<=80 chars):  export interface EmptyPlaceholderProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmptyPlaceholder
- EmptyPlaceholderProps
```

--------------------------------------------------------------------------------

---[FILE: ErrorBoundary.tsx]---
Location: umami-master/src/components/common/ErrorBoundary.tsx
Signals: React
Excerpt (<=80 chars):  export function ErrorBoundary({ children }: { children: ReactNode }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ErrorBoundary
```

--------------------------------------------------------------------------------

---[FILE: ErrorMessage.tsx]---
Location: umami-master/src/components/common/ErrorMessage.tsx
Signals: N/A
Excerpt (<=80 chars):  export function ErrorMessage() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ErrorMessage
```

--------------------------------------------------------------------------------

---[FILE: ExternalLink.tsx]---
Location: umami-master/src/components/common/ExternalLink.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export function ExternalLink({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalLink
```

--------------------------------------------------------------------------------

---[FILE: Favicon.tsx]---
Location: umami-master/src/components/common/Favicon.tsx
Signals: N/A
Excerpt (<=80 chars):  export function Favicon({ domain, ...props }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Favicon
```

--------------------------------------------------------------------------------

---[FILE: FilterLink.tsx]---
Location: umami-master/src/components/common/FilterLink.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export interface FilterLinkProps extends HTMLAttributes<HTMLDivElement> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterLink
- FilterLinkProps
```

--------------------------------------------------------------------------------

---[FILE: FilterRecord.tsx]---
Location: umami-master/src/components/common/FilterRecord.tsx
Signals: React
Excerpt (<=80 chars):  export interface FilterRecordProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterRecord
- FilterRecordProps
```

--------------------------------------------------------------------------------

---[FILE: GridRow.tsx]---
Location: umami-master/src/components/common/GridRow.tsx
Signals: N/A
Excerpt (<=80 chars):  export function GridRow(props: {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GridRow
```

--------------------------------------------------------------------------------

---[FILE: LinkButton.tsx]---
Location: umami-master/src/components/common/LinkButton.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export interface LinkButtonProps extends ButtonProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkButton
- LinkButtonProps
```

--------------------------------------------------------------------------------

---[FILE: LoadingPanel.tsx]---
Location: umami-master/src/components/common/LoadingPanel.tsx
Signals: React
Excerpt (<=80 chars):  export interface LoadingPanelProps extends ColumnProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoadingPanel
- LoadingPanelProps
```

--------------------------------------------------------------------------------

---[FILE: PageBody.tsx]---
Location: umami-master/src/components/common/PageBody.tsx
Signals: React
Excerpt (<=80 chars):  export function PageBody({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageBody
```

--------------------------------------------------------------------------------

---[FILE: PageHeader.tsx]---
Location: umami-master/src/components/common/PageHeader.tsx
Signals: React
Excerpt (<=80 chars):  export function PageHeader({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageHeader
```

--------------------------------------------------------------------------------

---[FILE: Pager.tsx]---
Location: umami-master/src/components/common/Pager.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface PagerProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Pager
- PagerProps
```

--------------------------------------------------------------------------------

---[FILE: Panel.tsx]---
Location: umami-master/src/components/common/Panel.tsx
Signals: React
Excerpt (<=80 chars):  export interface PanelProps extends ColumnProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Panel
- PanelProps
```

--------------------------------------------------------------------------------

---[FILE: SectionHeader.tsx]---
Location: umami-master/src/components/common/SectionHeader.tsx
Signals: React
Excerpt (<=80 chars):  export function SectionHeader({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SectionHeader
```

--------------------------------------------------------------------------------

---[FILE: SideMenu.tsx]---
Location: umami-master/src/components/common/SideMenu.tsx
Signals: Next.js
Excerpt (<=80 chars):  export interface SideMenuProps extends NavMenuProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SideMenu
- SideMenuProps
```

--------------------------------------------------------------------------------

---[FILE: TypeConfirmationForm.tsx]---
Location: umami-master/src/components/common/TypeConfirmationForm.tsx
Signals: N/A
Excerpt (<=80 chars):  export function TypeConfirmationForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TypeConfirmationForm
```

--------------------------------------------------------------------------------

---[FILE: TypeIcon.tsx]---
Location: umami-master/src/components/common/TypeIcon.tsx
Signals: React
Excerpt (<=80 chars):  export function TypeIcon({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TypeIcon
```

--------------------------------------------------------------------------------

---[FILE: useApi.ts]---
Location: umami-master/src/components/hooks/useApi.ts
Signals: React
Excerpt (<=80 chars):  export function useApi() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useApi
```

--------------------------------------------------------------------------------

---[FILE: useConfig.ts]---
Location: umami-master/src/components/hooks/useConfig.ts
Signals: React
Excerpt (<=80 chars):  export type Config = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useConfig
- Config
```

--------------------------------------------------------------------------------

---[FILE: useCountryNames.ts]---
Location: umami-master/src/components/hooks/useCountryNames.ts
Signals: React
Excerpt (<=80 chars):  export function useCountryNames(locale: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCountryNames
```

--------------------------------------------------------------------------------

---[FILE: useDateParameters.ts]---
Location: umami-master/src/components/hooks/useDateParameters.ts
Signals: N/A
Excerpt (<=80 chars):  export function useDateParameters() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDateParameters
```

--------------------------------------------------------------------------------

---[FILE: useDateRange.ts]---
Location: umami-master/src/components/hooks/useDateRange.ts
Signals: React
Excerpt (<=80 chars):  export function useDateRange(options: { ignoreOffset?: boolean; timezone?: s...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDateRange
```

--------------------------------------------------------------------------------

---[FILE: useDocumentClick.ts]---
Location: umami-master/src/components/hooks/useDocumentClick.ts
Signals: React
Excerpt (<=80 chars):  export function useDocumentClick(handler: (event: MouseEvent) => any) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDocumentClick
```

--------------------------------------------------------------------------------

---[FILE: useEscapeKey.ts]---
Location: umami-master/src/components/hooks/useEscapeKey.ts
Signals: React
Excerpt (<=80 chars):  export function useEscapeKey(handler: (event: KeyboardEvent) => void) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEscapeKey
```

--------------------------------------------------------------------------------

---[FILE: useFields.ts]---
Location: umami-master/src/components/hooks/useFields.ts
Signals: N/A
Excerpt (<=80 chars):  export function useFields() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useFields
```

--------------------------------------------------------------------------------

---[FILE: useFilterParameters.ts]---
Location: umami-master/src/components/hooks/useFilterParameters.ts
Signals: React
Excerpt (<=80 chars):  export function useFilterParameters() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useFilterParameters
```

--------------------------------------------------------------------------------

---[FILE: useFilters.ts]---
Location: umami-master/src/components/hooks/useFilters.ts
Signals: N/A
Excerpt (<=80 chars):  export function useFilters() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useFilters
```

--------------------------------------------------------------------------------

---[FILE: useForceUpdate.ts]---
Location: umami-master/src/components/hooks/useForceUpdate.ts
Signals: React
Excerpt (<=80 chars):  export function useForceUpdate() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useForceUpdate
```

--------------------------------------------------------------------------------

---[FILE: useFormat.ts]---
Location: umami-master/src/components/hooks/useFormat.ts
Signals: N/A
Excerpt (<=80 chars):  export function useFormat() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useFormat
```

--------------------------------------------------------------------------------

---[FILE: useLanguageNames.ts]---
Location: umami-master/src/components/hooks/useLanguageNames.ts
Signals: React
Excerpt (<=80 chars):  export function useLanguageNames(locale) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLanguageNames
```

--------------------------------------------------------------------------------

---[FILE: useLocale.ts]---
Location: umami-master/src/components/hooks/useLocale.ts
Signals: React
Excerpt (<=80 chars):  export function useLocale() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLocale
```

--------------------------------------------------------------------------------

---[FILE: useMessages.ts]---
Location: umami-master/src/components/hooks/useMessages.ts
Signals: N/A
Excerpt (<=80 chars):  export function useMessages(): UseMessages {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useMessages
```

--------------------------------------------------------------------------------

---[FILE: useMobile.ts]---
Location: umami-master/src/components/hooks/useMobile.ts
Signals: N/A
Excerpt (<=80 chars):  export function useMobile() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useMobile
```

--------------------------------------------------------------------------------

---[FILE: useModified.ts]---
Location: umami-master/src/components/hooks/useModified.ts
Signals: N/A
Excerpt (<=80 chars):  export function touch(key: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- touch
- useModified
```

--------------------------------------------------------------------------------

---[FILE: useNavigation.ts]---
Location: umami-master/src/components/hooks/useNavigation.ts
Signals: React, Next.js
Excerpt (<=80 chars):  export function useNavigation() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNavigation
```

--------------------------------------------------------------------------------

---[FILE: usePageParameters.ts]---
Location: umami-master/src/components/hooks/usePageParameters.ts
Signals: React
Excerpt (<=80 chars):  export function usePageParameters() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePageParameters
```

--------------------------------------------------------------------------------

---[FILE: useRegionNames.ts]---
Location: umami-master/src/components/hooks/useRegionNames.ts
Signals: N/A
Excerpt (<=80 chars):  export function useRegionNames(locale: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useRegionNames
```

--------------------------------------------------------------------------------

---[FILE: useSlug.ts]---
Location: umami-master/src/components/hooks/useSlug.ts
Signals: N/A
Excerpt (<=80 chars):  export function useSlug(type: 'link' | 'pixel') {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSlug
```

--------------------------------------------------------------------------------

---[FILE: useSticky.ts]---
Location: umami-master/src/components/hooks/useSticky.ts
Signals: React
Excerpt (<=80 chars):  export function useSticky({ enabled = true, threshold = 1 }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSticky
```

--------------------------------------------------------------------------------

---[FILE: useTimezone.ts]---
Location: umami-master/src/components/hooks/useTimezone.ts
Signals: N/A
Excerpt (<=80 chars):  export function useTimezone() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTimezone
```

--------------------------------------------------------------------------------

---[FILE: useLink.ts]---
Location: umami-master/src/components/hooks/context/useLink.ts
Signals: React
Excerpt (<=80 chars):  export function useLink() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLink
```

--------------------------------------------------------------------------------

---[FILE: usePixel.ts]---
Location: umami-master/src/components/hooks/context/usePixel.ts
Signals: React
Excerpt (<=80 chars):  export function usePixel() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePixel
```

--------------------------------------------------------------------------------

---[FILE: useTeam.ts]---
Location: umami-master/src/components/hooks/context/useTeam.ts
Signals: React
Excerpt (<=80 chars):  export function useTeam() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTeam
```

--------------------------------------------------------------------------------

---[FILE: useUser.ts]---
Location: umami-master/src/components/hooks/context/useUser.ts
Signals: React
Excerpt (<=80 chars):  export function useUser() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUser
```

--------------------------------------------------------------------------------

---[FILE: useWebsite.ts]---
Location: umami-master/src/components/hooks/context/useWebsite.ts
Signals: React
Excerpt (<=80 chars):  export function useWebsite() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsite
```

--------------------------------------------------------------------------------

---[FILE: useActiveUsersQuery.ts]---
Location: umami-master/src/components/hooks/queries/useActiveUsersQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useActyiveUsersQuery(websiteId: string, options?: ReactQuery...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useActyiveUsersQuery
```

--------------------------------------------------------------------------------

---[FILE: useDateRangeQuery.ts]---
Location: umami-master/src/components/hooks/queries/useDateRangeQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useDateRangeQuery(websiteId: string, options?: ReactQueryOpt...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDateRangeQuery
```

--------------------------------------------------------------------------------

---[FILE: useDeleteQuery.ts]---
Location: umami-master/src/components/hooks/queries/useDeleteQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useDeleteQuery(path: string, params?: Record<string, any>) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDeleteQuery
```

--------------------------------------------------------------------------------

---[FILE: useEventDataEventsQuery.ts]---
Location: umami-master/src/components/hooks/queries/useEventDataEventsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useEventDataEventsQuery(websiteId: string, options?: ReactQu...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEventDataEventsQuery
```

--------------------------------------------------------------------------------

---[FILE: useEventDataPropertiesQuery.ts]---
Location: umami-master/src/components/hooks/queries/useEventDataPropertiesQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useEventDataPropertiesQuery(websiteId: string, options?: Rea...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEventDataPropertiesQuery
```

--------------------------------------------------------------------------------

---[FILE: useEventDataQuery.ts]---
Location: umami-master/src/components/hooks/queries/useEventDataQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useEventDataQuery(websiteId: string, eventId: string, option...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEventDataQuery
```

--------------------------------------------------------------------------------

---[FILE: useEventDataValuesQuery.ts]---
Location: umami-master/src/components/hooks/queries/useEventDataValuesQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useEventDataValuesQuery(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEventDataValuesQuery
```

--------------------------------------------------------------------------------

---[FILE: useLinkQuery.ts]---
Location: umami-master/src/components/hooks/queries/useLinkQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useLinkQuery(linkId: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLinkQuery
```

--------------------------------------------------------------------------------

---[FILE: useLinksQuery.ts]---
Location: umami-master/src/components/hooks/queries/useLinksQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useLinksQuery({ teamId }: { teamId?: string }, options?: Rea...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLinksQuery
```

--------------------------------------------------------------------------------

---[FILE: useLoginQuery.ts]---
Location: umami-master/src/components/hooks/queries/useLoginQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useLoginQuery() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLoginQuery
```

--------------------------------------------------------------------------------

---[FILE: usePixelQuery.ts]---
Location: umami-master/src/components/hooks/queries/usePixelQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function usePixelQuery(pixelId: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePixelQuery
```

--------------------------------------------------------------------------------

---[FILE: usePixelsQuery.ts]---
Location: umami-master/src/components/hooks/queries/usePixelsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function usePixelsQuery({ teamId }: { teamId?: string }, options?: Re...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePixelsQuery
```

--------------------------------------------------------------------------------

---[FILE: useRealtimeQuery.ts]---
Location: umami-master/src/components/hooks/queries/useRealtimeQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useRealtimeQuery(websiteId: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useRealtimeQuery
```

--------------------------------------------------------------------------------

---[FILE: useReportQuery.ts]---
Location: umami-master/src/components/hooks/queries/useReportQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useReportQuery(reportId: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useReportQuery
```

--------------------------------------------------------------------------------

---[FILE: useReportsQuery.ts]---
Location: umami-master/src/components/hooks/queries/useReportsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useReportsQuery(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useReportsQuery
```

--------------------------------------------------------------------------------

---[FILE: useSessionActivityQuery.ts]---
Location: umami-master/src/components/hooks/queries/useSessionActivityQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useSessionActivityQuery(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSessionActivityQuery
```

--------------------------------------------------------------------------------

---[FILE: useSessionDataPropertiesQuery.ts]---
Location: umami-master/src/components/hooks/queries/useSessionDataPropertiesQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useSessionDataPropertiesQuery(websiteId: string, options?: R...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSessionDataPropertiesQuery
```

--------------------------------------------------------------------------------

---[FILE: useSessionDataQuery.ts]---
Location: umami-master/src/components/hooks/queries/useSessionDataQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useSessionDataQuery(websiteId: string, sessionId: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSessionDataQuery
```

--------------------------------------------------------------------------------

---[FILE: useSessionDataValuesQuery.ts]---
Location: umami-master/src/components/hooks/queries/useSessionDataValuesQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useSessionDataValuesQuery(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSessionDataValuesQuery
```

--------------------------------------------------------------------------------

---[FILE: useShareTokenQuery.ts]---
Location: umami-master/src/components/hooks/queries/useShareTokenQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useShareTokenQuery(shareId: string): {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useShareTokenQuery
```

--------------------------------------------------------------------------------

---[FILE: useTeamMembersQuery.ts]---
Location: umami-master/src/components/hooks/queries/useTeamMembersQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useTeamMembersQuery(teamId: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTeamMembersQuery
```

--------------------------------------------------------------------------------

---[FILE: useTeamQuery.ts]---
Location: umami-master/src/components/hooks/queries/useTeamQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useTeamQuery(teamId: string, options?: ReactQueryOptions) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTeamQuery
```

--------------------------------------------------------------------------------

---[FILE: useTeamsQuery.ts]---
Location: umami-master/src/components/hooks/queries/useTeamsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useTeamsQuery(params?: Record<string, any>, options?: ReactQ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTeamsQuery
```

--------------------------------------------------------------------------------

---[FILE: useTeamWebsitesQuery.ts]---
Location: umami-master/src/components/hooks/queries/useTeamWebsitesQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useTeamWebsitesQuery(teamId: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTeamWebsitesQuery
```

--------------------------------------------------------------------------------

---[FILE: useUpdateQuery.ts]---
Location: umami-master/src/components/hooks/queries/useUpdateQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useUpdateQuery(path: string, params?: Record<string, any>) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUpdateQuery
```

--------------------------------------------------------------------------------

---[FILE: useUserQuery.ts]---
Location: umami-master/src/components/hooks/queries/useUserQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useUserQuery(userId: string, options?: ReactQueryOptions) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUserQuery
```

--------------------------------------------------------------------------------

---[FILE: useUsersQuery.ts]---
Location: umami-master/src/components/hooks/queries/useUsersQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useUsersQuery() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUsersQuery
```

--------------------------------------------------------------------------------

---[FILE: useUserTeamsQuery.ts]---
Location: umami-master/src/components/hooks/queries/useUserTeamsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useUserTeamsQuery(userId: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUserTeamsQuery
```

--------------------------------------------------------------------------------

---[FILE: useUserWebsitesQuery.ts]---
Location: umami-master/src/components/hooks/queries/useUserWebsitesQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useUserWebsitesQuery(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUserWebsitesQuery
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteCohortQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteCohortQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWebsiteCohortQuery(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteCohortQuery
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteCohortsQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteCohortsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWebsiteCohortsQuery(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteCohortsQuery
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteEventsQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteEventsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWebsiteEventsQuery(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteEventsQuery
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteEventsSeriesQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteEventsSeriesQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWebsiteEventsSeriesQuery(websiteId: string, options?: Rea...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteEventsSeriesQuery
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteExpandedMetricsQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteExpandedMetricsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export type WebsiteExpandedMetricsData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteExpandedMetricsQuery
- WebsiteExpandedMetricsData
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteMetricsQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteMetricsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export type WebsiteMetricsData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteMetricsQuery
- WebsiteMetricsData
```

--------------------------------------------------------------------------------

---[FILE: useWebsitePageviewsQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsitePageviewsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export interface WebsitePageviewsData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsitePageviewsQuery
- WebsitePageviewsData
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWebsiteQuery(websiteId: string, options?: ReactQueryOptio...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteQuery
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteSegmentQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteSegmentQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWebsiteSegmentQuery(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteSegmentQuery
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteSegmentsQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteSegmentsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWebsiteSegmentsQuery(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteSegmentsQuery
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteSessionQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteSessionQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWebsiteSessionQuery(websiteId: string, sessionId: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteSessionQuery
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteSessionsQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteSessionsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWebsiteSessionsQuery(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteSessionsQuery
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteSessionStatsQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteSessionStatsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWebsiteSessionStatsQuery(websiteId: string, options?: Rec...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteSessionStatsQuery
```

--------------------------------------------------------------------------------

````
