---
source_txt: fullstack_samples/umami-master
converted_utc: 2025-12-18T10:37:23Z
part: 5
parts_total: 6
---

# FULLSTACK CODE DATABASE SAMPLES umami-master

## Extracted Reusable Patterns (Non-verbatim) (Part 5 of 6)

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

---[FILE: useWebsitesQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsitesQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWebsitesQuery(params?: Record<string, any>, options?: Rea...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsitesQuery
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteStatsQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteStatsQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export interface WebsiteStatsData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteStatsQuery
- WebsiteStatsData
```

--------------------------------------------------------------------------------

---[FILE: useWebsiteValuesQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWebsiteValuesQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWebsiteValuesQuery({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebsiteValuesQuery
```

--------------------------------------------------------------------------------

---[FILE: useWeeklyTrafficQuery.ts]---
Location: umami-master/src/components/hooks/queries/useWeeklyTrafficQuery.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWeeklyTrafficQuery(websiteId: string, params?: Record<str...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWeeklyTrafficQuery
```

--------------------------------------------------------------------------------

---[FILE: ActionSelect.tsx]---
Location: umami-master/src/components/input/ActionSelect.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface ActionSelectProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActionSelect
- ActionSelectProps
```

--------------------------------------------------------------------------------

---[FILE: CurrencySelect.tsx]---
Location: umami-master/src/components/input/CurrencySelect.tsx
Signals: React
Excerpt (<=80 chars):  export function CurrencySelect({ value, onChange }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CurrencySelect
```

--------------------------------------------------------------------------------

---[FILE: DateFilter.tsx]---
Location: umami-master/src/components/input/DateFilter.tsx
Signals: React
Excerpt (<=80 chars):  export interface DateFilterProps extends SelectProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DateFilter
- DateFilterProps
```

--------------------------------------------------------------------------------

---[FILE: DialogButton.tsx]---
Location: umami-master/src/components/input/DialogButton.tsx
Signals: React
Excerpt (<=80 chars):  export interface DialogButtonProps extends Omit<ButtonProps, 'children'> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DialogButton
- DialogButtonProps
```

--------------------------------------------------------------------------------

---[FILE: DownloadButton.tsx]---
Location: umami-master/src/components/input/DownloadButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function DownloadButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadButton
```

--------------------------------------------------------------------------------

---[FILE: ExportButton.tsx]---
Location: umami-master/src/components/input/ExportButton.tsx
Signals: React, Next.js
Excerpt (<=80 chars):  export function ExportButton({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportButton
```

--------------------------------------------------------------------------------

---[FILE: FieldFilters.tsx]---
Location: umami-master/src/components/input/FieldFilters.tsx
Signals: React
Excerpt (<=80 chars):  export interface FieldFiltersProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FieldFilters
- FieldFiltersProps
```

--------------------------------------------------------------------------------

---[FILE: FilterBar.tsx]---
Location: umami-master/src/components/input/FilterBar.tsx
Signals: N/A
Excerpt (<=80 chars):  export function FilterBar({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterBar
```

--------------------------------------------------------------------------------

---[FILE: FilterButtons.tsx]---
Location: umami-master/src/components/input/FilterButtons.tsx
Signals: React
Excerpt (<=80 chars):  export interface FilterButtonsProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterButtons
- FilterButtonsProps
```

--------------------------------------------------------------------------------

---[FILE: FilterEditForm.tsx]---
Location: umami-master/src/components/input/FilterEditForm.tsx
Signals: React
Excerpt (<=80 chars):  export interface FilterEditFormProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterEditForm
- FilterEditFormProps
```

--------------------------------------------------------------------------------

---[FILE: LanguageButton.tsx]---
Location: umami-master/src/components/input/LanguageButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function LanguageButton() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LanguageButton
```

--------------------------------------------------------------------------------

---[FILE: LookupField.tsx]---
Location: umami-master/src/components/input/LookupField.tsx
Signals: React
Excerpt (<=80 chars):  export interface LookupFieldProps extends ComboBoxProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LookupField
- LookupFieldProps
```

--------------------------------------------------------------------------------

---[FILE: MenuButton.tsx]---
Location: umami-master/src/components/input/MenuButton.tsx
Signals: React
Excerpt (<=80 chars):  export function MenuButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MenuButton
```

--------------------------------------------------------------------------------

---[FILE: MobileMenuButton.tsx]---
Location: umami-master/src/components/input/MobileMenuButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function MobileMenuButton(props: DialogProps) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MobileMenuButton
```

--------------------------------------------------------------------------------

---[FILE: MonthFilter.tsx]---
Location: umami-master/src/components/input/MonthFilter.tsx
Signals: N/A
Excerpt (<=80 chars):  export function MonthFilter() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MonthFilter
```

--------------------------------------------------------------------------------

---[FILE: MonthSelect.tsx]---
Location: umami-master/src/components/input/MonthSelect.tsx
Signals: N/A
Excerpt (<=80 chars):  export function MonthSelect({ date = new Date(), onChange }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MonthSelect
```

--------------------------------------------------------------------------------

---[FILE: NavButton.tsx]---
Location: umami-master/src/components/input/NavButton.tsx
Signals: React
Excerpt (<=80 chars):  export interface TeamsButtonProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NavButton
- TeamsButtonProps
```

--------------------------------------------------------------------------------

---[FILE: PanelButton.tsx]---
Location: umami-master/src/components/input/PanelButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PanelButton(props: ButtonProps) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PanelButton
```

--------------------------------------------------------------------------------

---[FILE: PreferencesButton.tsx]---
Location: umami-master/src/components/input/PreferencesButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function PreferencesButton() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PreferencesButton
```

--------------------------------------------------------------------------------

---[FILE: ProfileButton.tsx]---
Location: umami-master/src/components/input/ProfileButton.tsx
Signals: React
Excerpt (<=80 chars):  export function ProfileButton() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProfileButton
```

--------------------------------------------------------------------------------

---[FILE: RefreshButton.tsx]---
Location: umami-master/src/components/input/RefreshButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function RefreshButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RefreshButton
```

--------------------------------------------------------------------------------

---[FILE: ReportEditButton.tsx]---
Location: umami-master/src/components/input/ReportEditButton.tsx
Signals: React
Excerpt (<=80 chars):  export function ReportEditButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReportEditButton
```

--------------------------------------------------------------------------------

---[FILE: SegmentFilters.tsx]---
Location: umami-master/src/components/input/SegmentFilters.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface SegmentFiltersProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SegmentFilters
- SegmentFiltersProps
```

--------------------------------------------------------------------------------

---[FILE: SegmentSaveButton.tsx]---
Location: umami-master/src/components/input/SegmentSaveButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function SegmentSaveButton({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SegmentSaveButton
```

--------------------------------------------------------------------------------

---[FILE: SettingsButton.tsx]---
Location: umami-master/src/components/input/SettingsButton.tsx
Signals: React
Excerpt (<=80 chars):  export function SettingsButton() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SettingsButton
```

--------------------------------------------------------------------------------

---[FILE: WebsiteDateFilter.tsx]---
Location: umami-master/src/components/input/WebsiteDateFilter.tsx
Signals: React
Excerpt (<=80 chars):  export interface WebsiteDateFilterProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteDateFilter
- WebsiteDateFilterProps
```

--------------------------------------------------------------------------------

---[FILE: WebsiteFilterButton.tsx]---
Location: umami-master/src/components/input/WebsiteFilterButton.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WebsiteFilterButton({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteFilterButton
```

--------------------------------------------------------------------------------

---[FILE: WebsiteSelect.tsx]---
Location: umami-master/src/components/input/WebsiteSelect.tsx
Signals: React
Excerpt (<=80 chars):  export function WebsiteSelect({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteSelect
```

--------------------------------------------------------------------------------

---[FILE: ActiveUsers.tsx]---
Location: umami-master/src/components/metrics/ActiveUsers.tsx
Signals: React
Excerpt (<=80 chars):  export function ActiveUsers({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActiveUsers
```

--------------------------------------------------------------------------------

---[FILE: ChangeLabel.tsx]---
Location: umami-master/src/components/metrics/ChangeLabel.tsx
Signals: React
Excerpt (<=80 chars):  export function ChangeLabel({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeLabel
```

--------------------------------------------------------------------------------

---[FILE: DatePickerForm.tsx]---
Location: umami-master/src/components/metrics/DatePickerForm.tsx
Signals: React
Excerpt (<=80 chars):  export function DatePickerForm({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DatePickerForm
```

--------------------------------------------------------------------------------

---[FILE: EventData.tsx]---
Location: umami-master/src/components/metrics/EventData.tsx
Signals: N/A
Excerpt (<=80 chars):  export function EventData({ websiteId, eventId }: { websiteId: string; event...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventData
```

--------------------------------------------------------------------------------

---[FILE: EventsChart.tsx]---
Location: umami-master/src/components/metrics/EventsChart.tsx
Signals: React
Excerpt (<=80 chars):  export interface EventsChartProps extends BarChartProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventsChart
- EventsChartProps
```

--------------------------------------------------------------------------------

---[FILE: Legend.tsx]---
Location: umami-master/src/components/metrics/Legend.tsx
Signals: N/A
Excerpt (<=80 chars):  export function Legend({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Legend
```

--------------------------------------------------------------------------------

---[FILE: ListTable.tsx]---
Location: umami-master/src/components/metrics/ListTable.tsx
Signals: React
Excerpt (<=80 chars):  export interface ListTableProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListTable
- ListTableProps
```

--------------------------------------------------------------------------------

---[FILE: MetricCard.tsx]---
Location: umami-master/src/components/metrics/MetricCard.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface MetricCardProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MetricCard
- MetricCardProps
```

--------------------------------------------------------------------------------

---[FILE: MetricLabel.tsx]---
Location: umami-master/src/components/metrics/MetricLabel.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface MetricLabelProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MetricLabel
- MetricLabelProps
```

--------------------------------------------------------------------------------

---[FILE: MetricsBar.tsx]---
Location: umami-master/src/components/metrics/MetricsBar.tsx
Signals: React
Excerpt (<=80 chars):  export interface MetricsBarProps extends GridProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MetricsBar
- MetricsBarProps
```

--------------------------------------------------------------------------------

---[FILE: MetricsExpandedTable.tsx]---
Location: umami-master/src/components/metrics/MetricsExpandedTable.tsx
Signals: React
Excerpt (<=80 chars):  export interface MetricsExpandedTableProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MetricsExpandedTable
- MetricsExpandedTableProps
```

--------------------------------------------------------------------------------

---[FILE: MetricsTable.tsx]---
Location: umami-master/src/components/metrics/MetricsTable.tsx
Signals: React
Excerpt (<=80 chars):  export interface MetricsTableProps extends ListTableProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MetricsTable
- MetricsTableProps
```

--------------------------------------------------------------------------------

---[FILE: PageviewsChart.tsx]---
Location: umami-master/src/components/metrics/PageviewsChart.tsx
Signals: React
Excerpt (<=80 chars):  export interface PageviewsChartProps extends BarChartProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageviewsChart
- PageviewsChartProps
```

--------------------------------------------------------------------------------

---[FILE: RealtimeChart.tsx]---
Location: umami-master/src/components/metrics/RealtimeChart.tsx
Signals: React
Excerpt (<=80 chars):  export interface RealtimeChartProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RealtimeChart
- RealtimeChartProps
```

--------------------------------------------------------------------------------

---[FILE: WeeklyTraffic.tsx]---
Location: umami-master/src/components/metrics/WeeklyTraffic.tsx
Signals: N/A
Excerpt (<=80 chars):  export function WeeklyTraffic({ websiteId }: { websiteId: string }) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WeeklyTraffic
```

--------------------------------------------------------------------------------

---[FILE: WorldMap.tsx]---
Location: umami-master/src/components/metrics/WorldMap.tsx
Signals: React
Excerpt (<=80 chars):  export interface WorldMapProps extends ColumnProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorldMap
- WorldMapProps
```

--------------------------------------------------------------------------------

---[FILE: AddUser.tsx]---
Location: umami-master/src/components/svg/AddUser.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: BarChart.tsx]---
Location: umami-master/src/components/svg/BarChart.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Bars.tsx]---
Location: umami-master/src/components/svg/Bars.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Bolt.tsx]---
Location: umami-master/src/components/svg/Bolt.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Bookmark.tsx]---
Location: umami-master/src/components/svg/Bookmark.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Calendar.tsx]---
Location: umami-master/src/components/svg/Calendar.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Change.tsx]---
Location: umami-master/src/components/svg/Change.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Clock.tsx]---
Location: umami-master/src/components/svg/Clock.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Compare.tsx]---
Location: umami-master/src/components/svg/Compare.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Dashboard.tsx]---
Location: umami-master/src/components/svg/Dashboard.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Download.tsx]---
Location: umami-master/src/components/svg/Download.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Expand.tsx]---
Location: umami-master/src/components/svg/Expand.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Export.tsx]---
Location: umami-master/src/components/svg/Export.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Flag.tsx]---
Location: umami-master/src/components/svg/Flag.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Funnel.tsx]---
Location: umami-master/src/components/svg/Funnel.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Gear.tsx]---
Location: umami-master/src/components/svg/Gear.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Globe.tsx]---
Location: umami-master/src/components/svg/Globe.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Lightbulb.tsx]---
Location: umami-master/src/components/svg/Lightbulb.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Lightning.tsx]---
Location: umami-master/src/components/svg/Lightning.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Link.tsx]---
Location: umami-master/src/components/svg/Link.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Location.tsx]---
Location: umami-master/src/components/svg/Location.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Lock.tsx]---
Location: umami-master/src/components/svg/Lock.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Logo.tsx]---
Location: umami-master/src/components/svg/Logo.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LogoWhite.tsx]---
Location: umami-master/src/components/svg/LogoWhite.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Magnet.tsx]---
Location: umami-master/src/components/svg/Magnet.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Money.tsx]---
Location: umami-master/src/components/svg/Money.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Moon.tsx]---
Location: umami-master/src/components/svg/Moon.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Network.tsx]---
Location: umami-master/src/components/svg/Network.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Nodes.tsx]---
Location: umami-master/src/components/svg/Nodes.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Overview.tsx]---
Location: umami-master/src/components/svg/Overview.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Path.tsx]---
Location: umami-master/src/components/svg/Path.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Profile.tsx]---
Location: umami-master/src/components/svg/Profile.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Pushpin.tsx]---
Location: umami-master/src/components/svg/Pushpin.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Redo.tsx]---
Location: umami-master/src/components/svg/Redo.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Reports.tsx]---
Location: umami-master/src/components/svg/Reports.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Security.tsx]---
Location: umami-master/src/components/svg/Security.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Speaker.tsx]---
Location: umami-master/src/components/svg/Speaker.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Sun.tsx]---
Location: umami-master/src/components/svg/Sun.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Switch.tsx]---
Location: umami-master/src/components/svg/Switch.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Tag.tsx]---
Location: umami-master/src/components/svg/Tag.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Target.tsx]---
Location: umami-master/src/components/svg/Target.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Visitor.tsx]---
Location: umami-master/src/components/svg/Visitor.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Website.tsx]---
Location: umami-master/src/components/svg/Website.tsx
Signals: React
Excerpt (<=80 chars): import type { SVGProps } from 'react';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth.ts]---
Location: umami-master/src/lib/auth.ts
Signals: N/A
Excerpt (<=80 chars):  export function getBearerToken(request: Request) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getBearerToken
- parseShareToken
```

--------------------------------------------------------------------------------

---[FILE: charts.ts]---
Location: umami-master/src/lib/charts.ts
Signals: N/A
Excerpt (<=80 chars):  export function renderNumberLabels(label: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- renderNumberLabels
- renderDateLabels
```

--------------------------------------------------------------------------------

---[FILE: clickhouse.ts]---
Location: umami-master/src/lib/clickhouse.ts
Signals: N/A
Excerpt (<=80 chars):  export const CLICKHOUSE_DATE_FORMATS = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CLICKHOUSE_DATE_FORMATS
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: umami-master/src/lib/client.ts
Signals: N/A
Excerpt (<=80 chars):  export function getClientAuthToken() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getClientAuthToken
- setClientAuthToken
- removeClientAuthToken
```

--------------------------------------------------------------------------------

---[FILE: colors.ts]---
Location: umami-master/src/lib/colors.ts
Signals: N/A
Excerpt (<=80 chars):  export function hex6(str: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hex6
- clamp
- hex2RGB
- rgb2Hex
- getPastel
- getColor
- getThemeColors
- pick
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: umami-master/src/lib/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const CURRENT_VERSION = process.env.currentVersion;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CURRENT_VERSION
- AUTH_TOKEN
- LOCALE_CONFIG
- TIMEZONE_CONFIG
- DATE_RANGE_CONFIG
- THEME_CONFIG
- DASHBOARD_CONFIG
- LAST_TEAM_CONFIG
- VERSION_CHECK
- SHARE_TOKEN_HEADER
- HOMEPAGE_URL
- DOCS_URL
- REPO_URL
- UPDATES_URL
- TELEMETRY_PIXEL
- FAVICON_URL
- LINKS_URL
- PIXELS_URL
```

--------------------------------------------------------------------------------

---[FILE: crypto.ts]---
Location: umami-master/src/lib/crypto.ts
Signals: N/A
Excerpt (<=80 chars):  export function encrypt(value: any, secret: any) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encrypt
- decrypt
- hash
- md5
- secret
- uuid
```

--------------------------------------------------------------------------------

---[FILE: data.ts]---
Location: umami-master/src/lib/data.ts
Signals: N/A
Excerpt (<=80 chars):  export function flattenJSON(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- flattenJSON
- isValidDateValue
- getDataType
- getStringValue
- objectToArray
```

--------------------------------------------------------------------------------

---[FILE: date.ts]---
Location: umami-master/src/lib/date.ts
Signals: N/A
Excerpt (<=80 chars):  export const TIME_UNIT = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- normalizeTimezone
- isValidTimezone
- getTimezone
- parseDateValue
- parseDateRange
- getOffsetDateRange
- getAllowedUnits
- getMinimumUnit
- maxDate
- minDate
- getCompareDate
- getDayOfWeekAsDate
- formatDate
- generateTimeSeries
- getDateRangeValue
- getMonthDateRangeValue
- isInvalidDate
- TIME_UNIT
```

--------------------------------------------------------------------------------

---[FILE: db.ts]---
Location: umami-master/src/lib/db.ts
Signals: N/A
Excerpt (<=80 chars): export const PRISMA = 'prisma';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDatabaseType
- notImplemented
- PRISMA
- POSTGRESQL
- CLICKHOUSE
- KAFKA
- KAFKA_PRODUCER
```

--------------------------------------------------------------------------------

---[FILE: detect.ts]---
Location: umami-master/src/lib/detect.ts
Signals: N/A
Excerpt (<=80 chars):  export function getDevice(userAgent: string, screen: string = '') {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDevice
- hasBlockedIp
```

--------------------------------------------------------------------------------

---[FILE: fetch.ts]---
Location: umami-master/src/lib/fetch.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ErrorResponse {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ErrorResponse
- FetchResponse
```

--------------------------------------------------------------------------------

---[FILE: filters.ts]---
Location: umami-master/src/lib/filters.ts
Signals: N/A
Excerpt (<=80 chars): export const percentFilter = (data: any[]) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- percentFilter
- paramFilter
```

--------------------------------------------------------------------------------

---[FILE: format.ts]---
Location: umami-master/src/lib/format.ts
Signals: N/A
Excerpt (<=80 chars): export function parseTime(val: number) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseTime
- formatTime
- formatShortTime
- formatNumber
- formatLongNumber
- stringToColor
- formatCurrency
- formatLongCurrency
```

--------------------------------------------------------------------------------

---[FILE: generate.ts]---
Location: umami-master/src/lib/generate.ts
Signals: N/A
Excerpt (<=80 chars):  export function random(min: number, max: number) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- random
- getRandomChars
```

--------------------------------------------------------------------------------

---[FILE: ip.ts]---
Location: umami-master/src/lib/ip.ts
Signals: N/A
Excerpt (<=80 chars): export const IP_ADDRESS_HEADERS = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getIpAddress
- stripPort
- IP_ADDRESS_HEADERS
```

--------------------------------------------------------------------------------

---[FILE: jwt.ts]---
Location: umami-master/src/lib/jwt.ts
Signals: N/A
Excerpt (<=80 chars):  export function createToken(payload: any, secret: any, options?: any) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createToken
- parseToken
- createSecureToken
- parseSecureToken
```

--------------------------------------------------------------------------------

````
