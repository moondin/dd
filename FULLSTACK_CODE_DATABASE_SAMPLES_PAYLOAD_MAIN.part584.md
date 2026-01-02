---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 584
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 584 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: removeArrayRow.ts]---
Location: payload-main/test/helpers/e2e/fields/array/removeArrayRow.ts

```typescript
import type { Locator, Page } from 'playwright'

import { expect } from 'playwright/test'

import { openArrayRowActions } from './openArrayRowActions.js'

/**
 * Removes an array row at the specified index.
 */
export const removeArrayRow = async (
  page: Page,
  { fieldName, rowIndex = 0 }: Parameters<typeof openArrayRowActions>[1],
): Promise<{
  popupContentLocator: Locator
  rowActionsButtonLocator: Locator
}> => {
  const rowLocator = page.locator(`#field-${fieldName} .array-field__row`)
  const numberOfPrevRows = await rowLocator.count()

  const { popupContentLocator, rowActionsButtonLocator } = await openArrayRowActions(page, {
    fieldName,
    rowIndex,
  })

  await popupContentLocator.locator('.array-actions__action.array-actions__remove').click()

  expect(await rowLocator.count()).toBe(numberOfPrevRows - 1)

  // TODO: test the array row has been removed in the _correct position_ (original row index)
  // another row may have been moved into its place, need to ensure the test accounts for this fact

  return { popupContentLocator, rowActionsButtonLocator }
}
```

--------------------------------------------------------------------------------

---[FILE: addBlock.ts]---
Location: payload-main/test/helpers/e2e/fields/blocks/addBlock.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { exactText } from 'helpers.js'

import { openArrayRowActions } from '../array/openArrayRowActions.js'
import { openBlocksDrawer } from './openBlocksDrawer.js'

const selectBlockFromDrawer = async ({
  blocksDrawer,
  blockToSelect,
}: {
  blocksDrawer: Locator
  blockToSelect: string
}) => {
  const blockCard = blocksDrawer.locator('.blocks-drawer__block .thumbnail-card__label', {
    hasText: blockToSelect,
  })

  await expect(blockCard).toBeVisible()

  await blocksDrawer.getByRole('button', { name: exactText(blockToSelect) }).click()
}

/**
 * Adds a block to the end of the blocks array using the primary "Add Block" button.
 */
export const addBlock = async ({
  page,
  fieldName = 'blocks',
  blockToSelect = 'Block',
}: {
  /**
   * The name of the block to select from the blocks drawer.
   */
  blockToSelect: string
  fieldName: string
  page: Page
}) => {
  const rowLocator = page.locator(
    `#field-${fieldName} > .blocks-field__rows > div > .blocks-field__row`,
  )

  const numberOfPrevRows = await rowLocator.count()

  const blocksDrawer = await openBlocksDrawer({ page, fieldName })

  await selectBlockFromDrawer({
    blocksDrawer,
    blockToSelect,
  })

  await expect(rowLocator).toHaveCount(numberOfPrevRows + 1)

  // expect to see the block on the page
}

/**
 * Like `addBlock`, but inserts the block at the specified index using the row actions menu.
 */
export const addBlockBelow = async (
  page: Page,
  {
    fieldName = 'blocks',
    blockToSelect = 'Block',
    rowIndex = 0,
  }: {
    /**
     * The name of the block to select from the blocks drawer.
     */
    blockToSelect: string
    fieldName: string
    /**
     * The index at which to insert the block.
     */
    rowIndex?: number
  },
) => {
  const rowLocator = page.locator(
    `#field-${fieldName} > .blocks-field__rows > div > .blocks-field__row`,
  )

  const numberOfPrevRows = await rowLocator.count()

  const { popupContentLocator, rowActionsButtonLocator } = await openArrayRowActions(page, {
    fieldName,
    rowIndex,
  })

  await popupContentLocator.locator('.array-actions__action.array-actions__add').click()

  const blocksDrawer = page.locator('[id^=drawer_1_blocks-drawer-]')

  await selectBlockFromDrawer({
    blocksDrawer,
    blockToSelect,
  })

  await expect(rowLocator).toHaveCount(numberOfPrevRows + 1)

  return { popupContentLocator, rowActionsButtonLocator }
}
```

--------------------------------------------------------------------------------

---[FILE: duplicateBlock.ts]---
Location: payload-main/test/helpers/e2e/fields/blocks/duplicateBlock.ts

```typescript
import type { Locator, Page } from 'playwright'

import { expect } from 'playwright/test'

import { openArrayRowActions } from '../array/openArrayRowActions.js'

/**
 * Duplicates the block row at the specified index.
 */
export const duplicateBlock = async (
  page: Page,
  { fieldName, rowIndex = 0 }: Parameters<typeof openArrayRowActions>[1],
): Promise<{
  popupContentLocator: Locator
  rowActionsButtonLocator: Locator
  rowCount: number
}> => {
  const rowLocator = page.locator(
    `#field-${fieldName} > .blocks-field__rows > div > .blocks-field__row`,
  )

  const numberOfPrevRows = await rowLocator.count()

  const { popupContentLocator, rowActionsButtonLocator } = await openArrayRowActions(page, {
    fieldName,
    rowIndex,
  })

  await popupContentLocator.locator('.array-actions__action.array-actions__duplicate').click()
  const numberOfCurrentRows = await rowLocator.count()

  expect(numberOfCurrentRows).toBe(numberOfPrevRows + 1)

  // TODO: test the array row's field input values have been duplicated as well

  return { popupContentLocator, rowActionsButtonLocator, rowCount: numberOfCurrentRows }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/helpers/e2e/fields/blocks/index.ts

```typescript
export { addBlock, addBlockBelow } from './addBlock.js'
export { duplicateBlock } from './duplicateBlock.js'
export { openBlocksDrawer } from './openBlocksDrawer.js'
export { removeAllBlocks } from './removeAllBlocks.js'
export { reorderBlocks } from './reorderBlocks.js'
```

--------------------------------------------------------------------------------

---[FILE: openBlocksDrawer.ts]---
Location: payload-main/test/helpers/e2e/fields/blocks/openBlocksDrawer.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

export const openBlocksDrawer = async ({
  page,
  fieldName = 'blocks',
}: {
  fieldName: string
  page: Page
}): Promise<Locator> => {
  const blocksDrawer = page.locator('[id^=drawer_1_blocks-drawer-]')

  if (!(await blocksDrawer.isVisible())) {
    const addButton = page.locator(`#field-${fieldName} > .blocks-field__drawer-toggler`)
    await addButton.click()
  }

  await expect(blocksDrawer).toBeVisible()

  return blocksDrawer
}
```

--------------------------------------------------------------------------------

---[FILE: removeAllBlocks.ts]---
Location: payload-main/test/helpers/e2e/fields/blocks/removeAllBlocks.ts

```typescript
import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'

export const removeAllBlocks = async ({
  page,
  fieldName = 'blocks',
}: {
  fieldName: string
  page: Page
}) => {
  const blocksField = page.locator(`#field-${fieldName}`)

  const blocks = blocksField.locator(`[id^="${fieldName}-row-"]`)
  const count = await blocks.count()

  expect(count).toBeGreaterThan(0)

  for (let i = 0; i < count; i++) {
    // delete in reverse order to avoid index issues
    const block = blocksField.locator(`[id^="${fieldName}-row-${count - i - 1}"]`)
    await block.locator('.array-actions__button').first().click()
    await block.locator('.array-actions__action.array-actions__remove').first().click()
  }
}
```

--------------------------------------------------------------------------------

---[FILE: reorderBlocks.ts]---
Location: payload-main/test/helpers/e2e/fields/blocks/reorderBlocks.ts

```typescript
import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { wait } from 'payload/shared'

export const reorderBlocks = async ({
  page,
  fromBlockIndex = 1,
  toBlockIndex = 2,
  fieldName = 'blocks',
}: {
  fieldName?: string
  fromBlockIndex: number
  page: Page
  toBlockIndex: number
}) => {
  // Ensure blocks are loaded
  await expect(page.locator('.shimmer-effect')).toHaveCount(0)

  const blocksField = page.locator(`#field-${fieldName}`).first()

  const fromField = blocksField.locator(`[id^="${fieldName}-row-${fromBlockIndex}"]`)

  const fromBoundingBox = await fromField.locator(`.collapsible__drag`).boundingBox()

  const toField = blocksField.locator(`[id^="${fieldName}-row-${toBlockIndex}"]`)

  const toBoundingBox = await toField.locator(`.collapsible__drag`).boundingBox()

  if (!fromBoundingBox || !toBoundingBox) {
    return
  }

  // drag the "from" column to the left of the "to" column
  await page.mouse.move(fromBoundingBox.x + 2, fromBoundingBox.y + 2, { steps: 10 })
  await page.mouse.down()
  await wait(300)
  await page.mouse.move(toBoundingBox.x - 2, toBoundingBox.y - 2, { steps: 10 })
  await page.mouse.up()

  // Ensure blocks are loaded
  await expect(page.locator('.shimmer-effect')).toHaveCount(0)
}
```

--------------------------------------------------------------------------------

---[FILE: openCreateDocDrawer.ts]---
Location: payload-main/test/helpers/e2e/fields/relationship/openCreateDocDrawer.ts

```typescript
import type { Page } from 'playwright'

import { wait } from 'payload/shared'
import { expect } from 'playwright/test'

export async function openCreateDocDrawer({
  page,
  fieldSelector,
}: {
  fieldSelector: string
  page: Page
}): Promise<void> {
  await wait(500) // wait for parent form state to initialize
  const relationshipField = page.locator(fieldSelector)
  await expect(relationshipField.locator('input')).toBeEnabled()
  const addNewButton = relationshipField.locator('.relationship-add-new__add-button')
  await expect(addNewButton).toBeVisible()
  await addNewButton.click()
  await wait(500) // wait for drawer form state to initialize
}
```

--------------------------------------------------------------------------------

---[FILE: openRelationshipFieldDrawer.ts]---
Location: payload-main/test/helpers/e2e/fields/relationship/openRelationshipFieldDrawer.ts

```typescript
import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { wait } from 'payload/shared'

import { selectInput } from '../../selectInput.js'

/**
 * Opens a list drawer for a relationship field with appearance="drawer"
 * and optionally selects a specific collection type for polymorphic relationships.
 *
 * @param page - Playwright Page object
 * @param fieldName - Name of the relationship field (e.g., 'relationship', 'relationshipHasMany')
 * @param selectRelation - Optional: Collection slug to select for polymorphic relationships (e.g., 'posts', 'users')
 *
 * @example
 * // Open list drawer for a non-polymorphic relationship
 * await openRelationshipFieldDrawer({ page, fieldName: 'relationship' })
 *
 * @example
 * // Open list drawer and select a specific collection for polymorphic relationship
 * await openRelationshipFieldDrawer({
 *   page,
 *   fieldName: 'polymorphicRelationship',
 *   selectRelation: 'tenants'
 * })
 */
export async function openRelationshipFieldDrawer({
  fieldName,
  page,
  selectRelation,
}: {
  fieldName: string
  page: Page
  selectRelation?: string
}): Promise<void> {
  await wait(300)

  // Click the relationship field to open the list drawer
  const relationshipField = page.locator(`#field-${fieldName}`)
  await relationshipField.click()

  // Wait for list drawer to be visible
  const listDrawerContent = page.locator('.list-drawer').locator('.drawer__content')
  await expect(listDrawerContent).toBeVisible()

  // If a specific relation type should be selected (for polymorphic relationships)
  if (selectRelation) {
    const relationToSelector = page.locator('.list-header__select-collection')
    await expect(relationToSelector).toBeVisible()

    await selectInput({
      selectLocator: relationToSelector,
      option: selectRelation,
      multiSelect: false,
      selectType: 'select',
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: addListFilter.ts]---
Location: payload-main/test/helpers/e2e/filters/addListFilter.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

import { selectInput } from '../selectInput.js'
import { openListFilters } from './openListFilters.js'

export const addListFilter = async ({
  page,
  fieldLabel = 'ID',
  operatorLabel = 'equals',
  value,
  multiSelect,
}: {
  fieldLabel: string
  multiSelect?: boolean
  operatorLabel: string
  page: Page
  replaceExisting?: boolean
  value?: string
}): Promise<{
  /**
   * A Locator pointing to the condition that was just added.
   */
  condition: Locator
  /**
   * A Locator pointing to the WhereBuilder node.
   */
  whereBuilder: Locator
}> => {
  await openListFilters(page, {})

  const whereBuilder = page.locator('.where-builder')

  const addFirst = whereBuilder.locator('.where-builder__add-first-filter')
  const initializedEmpty = await addFirst.isVisible()

  if (initializedEmpty) {
    await addFirst.click()
  }

  const filters = whereBuilder.locator('.where-builder__or-filters > li')
  expect(await filters.count()).toBeGreaterThan(0)

  // If there were already filter(s), need to add another and manipulate _that_ instead of the existing one
  if (!initializedEmpty) {
    const addFilterButtons = whereBuilder.locator('.where-builder__add-or')
    await addFilterButtons.last().click()
    await expect(filters).toHaveCount(2)
  }

  const condition = filters.last()

  await selectInput({
    selectLocator: condition.locator('.condition__field'),
    multiSelect: false,
    option: fieldLabel,
  })

  await selectInput({
    selectLocator: condition.locator('.condition__operator'),
    multiSelect: false,
    option: operatorLabel,
  })

  if (value !== undefined) {
    const networkPromise = page.waitForResponse(
      (response) =>
        response.url().includes(encodeURIComponent('where[or')) && response.status() === 200,
    )
    const valueLocator = condition.locator('.condition__value')
    const valueInput = valueLocator.locator('input')
    await valueInput.fill(value)
    await expect(valueInput).toHaveValue(value)

    if ((await valueLocator.locator('input.rs__input').count()) > 0) {
      const valueOptions = condition.locator('.condition__value .rs__option')
      const createValue = valueOptions.locator(`text=Create "${value}"`)
      if ((await createValue.count()) > 0) {
        await createValue.click()
      } else {
        await selectInput({
          selectLocator: valueLocator,
          multiSelect: multiSelect ? undefined : false,
          option: value,
        })
      }
    }
    await networkPromise
  }

  return { whereBuilder, condition }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/helpers/e2e/filters/index.ts

```typescript
export { addListFilter } from './addListFilter.js'
export { openListFilters } from './openListFilters.js'
```

--------------------------------------------------------------------------------

---[FILE: openListFilters.ts]---
Location: payload-main/test/helpers/e2e/filters/openListFilters.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * Opens the list filters drawer in the list view. If it's already open, does nothing.
 * Return the filter container locator for further interactions.
 */
export const openListFilters = async (
  page: Page,
  {
    togglerSelector = '#toggle-list-filters',
    filterContainerSelector = '#list-controls-where',
  }: {
    filterContainerSelector?: string
    togglerSelector?: string
  },
): Promise<{
  filterContainer: Locator
}> => {
  await expect(page.locator(togglerSelector)).toBeVisible()
  const filterContainer = page.locator(filterContainerSelector).first()

  const isAlreadyOpen = await filterContainer.isVisible()

  if (!isAlreadyOpen) {
    await page.locator(togglerSelector).first().click()
  }

  await expect(page.locator(`${filterContainerSelector}.rah-static--height-auto`)).toBeVisible()

  return { filterContainer }
}
```

--------------------------------------------------------------------------------

---[FILE: addGroupBy.ts]---
Location: payload-main/test/helpers/e2e/groupBy/addGroupBy.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { exactText } from 'helpers.js'

import { openGroupBy } from './openGroupBy.js'

export const addGroupBy = async (
  page: Page,
  { fieldLabel, fieldPath }: { fieldLabel: string; fieldPath: string },
): Promise<{ field: Locator; groupByContainer: Locator }> => {
  const { groupByContainer } = await openGroupBy(page)
  const field = groupByContainer.locator('#group-by--field-select')

  await field.click()
  await field.locator('.rs__option', { hasText: exactText(fieldLabel) })?.click()
  await expect(field.locator('.react-select--single-value')).toHaveText(fieldLabel)

  await expect(page).toHaveURL(new RegExp(`&groupBy=${fieldPath}`))

  return { groupByContainer, field }
}
```

--------------------------------------------------------------------------------

---[FILE: clearGroupBy.ts]---
Location: payload-main/test/helpers/e2e/groupBy/clearGroupBy.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

import { openGroupBy } from './openGroupBy.js'

export const clearGroupBy = async (page: Page): Promise<{ groupByContainer: Locator }> => {
  const { groupByContainer } = await openGroupBy(page)

  await groupByContainer.locator('#group-by--reset').click()
  const field = groupByContainer.locator('#group-by--field-select')

  await expect(field.locator('.react-select--single-value')).toHaveText('Select a value')
  await expect(groupByContainer.locator('#group-by--reset')).toBeHidden()
  await expect(page).not.toHaveURL(/&groupBy=/)
  await expect(groupByContainer.locator('#field-direction input')).toBeDisabled()
  await expect(page.locator('.table-wrap')).toHaveCount(1)
  await expect(page.locator('.group-by-header')).toHaveCount(0)

  return { groupByContainer }
}
```

--------------------------------------------------------------------------------

---[FILE: closeGroupBy.ts]---
Location: payload-main/test/helpers/e2e/groupBy/closeGroupBy.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import type { ToggleOptions } from './toggleGroupBy.js';

import { toggleGroupBy } from './toggleGroupBy.js'

/**
 * Closes the group-by drawer in the list view. If it's already closed, does nothing.
 */
export const closeGroupBy = async (
  page: Page,
  options?: Omit<ToggleOptions, 'targetState'>,
): Promise<{
  groupByContainer: Locator
}> => toggleGroupBy(page, { ...(options || ({} as ToggleOptions)), targetState: 'closed' })
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: payload-main/test/helpers/e2e/groupBy/index.js

```javascript
export { addGroupBy } from './addGroupBy.js'
export { clearGroupBy } from './clearGroupBy.js'
export { closeGroupBy } from './closeGroupBy.js'
export { openGroupBy } from './openGroupBy.js'
export { toggleGroupBy } from './toggleGroupBy.js'
```

--------------------------------------------------------------------------------

---[FILE: openGroupBy.ts]---
Location: payload-main/test/helpers/e2e/groupBy/openGroupBy.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import type { ToggleOptions } from './toggleGroupBy.js'

import { toggleGroupBy } from './toggleGroupBy.js'

/**
 * Opens the group-by drawer in the list view. If it's already open, does nothing.
 */
export const openGroupBy = async (
  page: Page,
  options?: Omit<ToggleOptions, 'targetState'>,
): Promise<{
  groupByContainer: Locator
}> => toggleGroupBy(page, { ...(options || ({} as ToggleOptions)), targetState: 'open' })
```

--------------------------------------------------------------------------------

---[FILE: toggleGroupBy.ts]---
Location: payload-main/test/helpers/e2e/groupBy/toggleGroupBy.ts

```typescript
import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'

export type ToggleOptions = {
  groupByContainerSelector: string
  targetState: 'closed' | 'open'
  togglerSelector: string
}

/**
 * Toggles the group-by drawer in the list view based on the targetState option.
 */
export const toggleGroupBy = async (
  page: Page,
  {
    targetState = 'open',
    togglerSelector = '#toggle-group-by',
    groupByContainerSelector = '#list-controls-group-by',
  }: ToggleOptions,
) => {
  const groupByContainer = page.locator(groupByContainerSelector).first()

  const isAlreadyOpen = await groupByContainer.isVisible()

  if (!isAlreadyOpen && targetState === 'open') {
    await page.locator(togglerSelector).first().click()
    await expect(page.locator(`${groupByContainerSelector}.rah-static--height-auto`)).toBeVisible()
  }

  if (isAlreadyOpen && targetState === 'closed') {
    await page.locator(togglerSelector).first().click()
    await expect(page.locator(`${groupByContainerSelector}.rah-static--height-auto`)).toBeHidden()
  }

  return { groupByContainer }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/helpers/e2e/live-preview/index.ts

```typescript
export { selectLivePreviewBreakpoint } from './selectLivePreviewBreakpoint.js'
export { selectLivePreviewZoom } from './selectLivePreviewZoom.js'
export { toggleLivePreview } from './toggleLivePreview.js'
```

--------------------------------------------------------------------------------

---[FILE: selectLivePreviewBreakpoint.ts]---
Location: payload-main/test/helpers/e2e/live-preview/selectLivePreviewBreakpoint.ts

```typescript
import type { Page } from 'playwright'

import { POLL_TOPASS_TIMEOUT } from 'playwright.config.js'
import { expect } from 'playwright/test'

export const selectLivePreviewBreakpoint = async (page: Page, breakpointLabel: string) => {
  const breakpointSelector = page.locator(
    '.live-preview-toolbar-controls__breakpoint button.popup-button',
  )

  await expect(() => expect(breakpointSelector).toBeTruthy()).toPass({
    timeout: POLL_TOPASS_TIMEOUT,
  })

  await breakpointSelector.first().click()

  await page
    .locator('.popup__content .popup-button-list__button')
    .filter({ hasText: breakpointLabel })
    .click()

  await expect(breakpointSelector).toContainText(breakpointLabel)

  const option = page.locator('.live-preview-toolbar-controls__breakpoint button.popup-button')

  await expect(option).toHaveText(breakpointLabel)
}
```

--------------------------------------------------------------------------------

---[FILE: selectLivePreviewZoom.ts]---
Location: payload-main/test/helpers/e2e/live-preview/selectLivePreviewZoom.ts

```typescript
import type { Page } from 'playwright'

import { exactText } from 'helpers.js'
import { POLL_TOPASS_TIMEOUT } from 'playwright.config.js'
import { expect } from 'playwright/test'

export const selectLivePreviewZoom = async (page: Page, zoomLabel: string) => {
  const zoomSelector = page.locator('.live-preview-toolbar-controls__zoom button.popup-button')

  await expect(() => expect(zoomSelector).toBeTruthy()).toPass({
    timeout: POLL_TOPASS_TIMEOUT,
  })

  await zoomSelector.first().click()

  const zoomOption = page.locator('.popup__content button.popup-button-list__button', {
    hasText: exactText(zoomLabel),
  })

  expect(zoomOption).toBeTruthy()
  await zoomOption.click()

  await expect(zoomSelector).toContainText(zoomLabel)
}
```

--------------------------------------------------------------------------------

---[FILE: toggleLivePreview.ts]---
Location: payload-main/test/helpers/e2e/live-preview/toggleLivePreview.ts

```typescript
import type { Page } from 'playwright'

import { expect } from 'playwright/test'

export const toggleLivePreview = async (
  page: Page,
  options?: {
    targetState?: 'off' | 'on'
  },
): Promise<void> => {
  const toggler = page.locator('#live-preview-toggler')
  await expect(toggler).toBeVisible()

  const isActive = await toggler.evaluate((el) =>
    el.classList.contains('live-preview-toggler--active'),
  )

  if (isActive && (options?.targetState === 'off' || !options?.targetState)) {
    await toggler.click()
    await expect(toggler).not.toHaveClass(/live-preview-toggler--active/)
    await expect(page.locator('iframe.live-preview-iframe')).toBeHidden()
  }

  if (!isActive && (options?.targetState === 'on' || !options?.targetState)) {
    await toggler.click()
    await expect(toggler).toHaveClass(/live-preview-toggler--active/)
    await expect(page.locator('iframe.live-preview-iframe')).toBeVisible()
  }
}
```

--------------------------------------------------------------------------------

---[FILE: moveRow.ts]---
Location: payload-main/test/helpers/e2e/sort/moveRow.ts

```typescript
import type { Locator, Page } from 'playwright'

import { expect } from 'playwright/test'

export async function moveRow(
  page: Page,
  {
    fromIndex,
    toIndex,
    expected = 'success',
    scope,
  }: {
    expected?: 'success' | 'warning'
    fromIndex: number
    /**
     * Scope the sorting to a specific table in the DOM.
     * Useful when there are multiple sortable tables on the page.
     * If not provided, will search the first table on the page.
     */
    scope?: Locator
    toIndex: number
  },
) {
  const table = (scope || page).locator(`tbody`)
  await table.scrollIntoViewIfNeeded()

  const dragHandle = table.locator(`.sort-row`)
  const source = dragHandle.nth(fromIndex)
  const target = dragHandle.nth(toIndex)

  const sourceBox = await source.boundingBox()
  const targetBox = await target.boundingBox()

  if (!sourceBox || !targetBox) {
    throw new Error(
      `Could not find elements to DnD. Probably the dndkit animation is not finished. Try increasing the timeout`,
    )
  }

  // steps is important: move slightly to trigger the drag sensor of DnD-kit
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2, {
    steps: 10,
  })

  await page.mouse.down()
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
    steps: 10,
  })

  await page.mouse.up()

  await page.waitForTimeout(400) // dndkit animation

  if (expected === 'warning') {
    const toast = page.locator('.payload-toast-item.toast-warning')
    await expect(toast).toHaveText(
      'To reorder the rows you must first sort them by the "Order" column',
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: applyBrowseByFolderTypeFilter.ts]---
Location: payload-main/test/helpers/folders/applyBrowseByFolderTypeFilter.ts

```typescript
import type { Page } from '@playwright/test'

export const applyBrowseByFolderTypeFilter = async ({
  page,
  type,
  on,
}: {
  on: boolean
  page: Page
  type: {
    label: string
    value: string
  }
}) => {
  // Check if the popup is already active
  let typePill = page.locator('.search-bar__actions .checkbox-popup.popup--active', {
    hasText: 'Type',
  })
  const isActive = (await page.locator('.popup__content').count()) > 0

  if (!isActive) {
    typePill = page.locator('.search-bar__actions .checkbox-popup', { hasText: 'Type' })
    await typePill.locator('.popup-button', { hasText: 'Type' }).click()
  }

  await page.locator('.popup__content .field-label', { hasText: type.label }).click()

  await page.waitForURL((urlStr) => {
    try {
      const url = new URL(urlStr)
      const relationTo = url.searchParams.get('relationTo')
      if (on) {
        return Boolean(relationTo?.includes(`"${type.value}"`))
      } else {
        return Boolean(!relationTo?.includes(`"${type.value}"`))
      }
    } catch {
      return false
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: clickFolderCard.ts]---
Location: payload-main/test/helpers/folders/clickFolderCard.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

type Args = {
  doubleClick?: boolean
  folderName: string
  page: Page
  rootLocator?: Locator
}
export async function clickFolderCard({
  page,
  folderName,
  doubleClick = false,
  rootLocator,
}: Args): Promise<void> {
  const folderCard = (rootLocator || page)
    .locator('div[role="button"].draggable-with-click')
    .filter({
      has: page.locator('.folder-file-card__name', { hasText: folderName }),
    })
    .first()

  await folderCard.waitFor({ state: 'visible' })

  if (doubleClick) {
    // Release any modifier keys that might be held down from previous tests
    await page.keyboard.up('Shift')
    await page.keyboard.up('Control')
    await page.keyboard.up('Alt')
    await page.keyboard.up('Meta')
    await folderCard.dblclick()
    await expect(folderCard).toBeHidden()
  } else {
    await folderCard.click()
  }
}
```

--------------------------------------------------------------------------------

---[FILE: createFolder.ts]---
Location: payload-main/test/helpers/folders/createFolder.ts

```typescript
import { expect, type Page } from '@playwright/test'

import { createFolderDoc } from './createFolderDoc.js'

type Args = {
  folderName: string
  folderType?: string[]
  fromDropdown?: boolean
  page: Page
}
export async function createFolder({
  folderName,
  fromDropdown = false,
  page,
  folderType = ['Posts'],
}: Args): Promise<void> {
  if (fromDropdown) {
    const titleActionsLocator = page.locator('.list-header__title-actions')
    const folderDropdown = titleActionsLocator.locator('.create-new-doc-in-folder__action-popup', {
      hasText: 'Create',
    })
    await folderDropdown.click()
    const createFolderButton = page.locator('.popup__content .popup-button-list__button', {
      hasText: 'Folder',
    })
    await createFolderButton.click()
  } else {
    const createFolderButton = page.locator(
      '.list-header__title-and-actions .create-new-doc-in-folder__button:has-text("Create folder")',
    )
    await createFolderButton.click()
  }

  await createFolderDoc({
    page,
    folderName,
    folderType,
  })

  const folderCard = page.locator('.folder-file-card__name', { hasText: folderName }).first()
  await expect(folderCard).toBeVisible()
}
```

--------------------------------------------------------------------------------

---[FILE: createFolderDoc.ts]---
Location: payload-main/test/helpers/folders/createFolderDoc.ts

```typescript
import { expect, type Page } from '@playwright/test'

import { selectInput } from '../../helpers/e2e/selectInput.js'
export const createFolderDoc = async ({
  folderName,
  page,
  folderType,
}: {
  folderName: string
  folderType: string[]
  page: Page
}) => {
  const drawer = page.locator('dialog .collection-edit--payload-folders')
  await drawer.locator('input#field-name').fill(folderName)

  await selectInput({
    multiSelect: true,
    options: folderType,
    selectLocator: drawer.locator('#field-folderType'),
  })

  const createButton = drawer.getByRole('button', { name: 'Save' })
  await createButton.click()

  await expect(page.locator('.payload-toast-container')).toContainText('successfully')
}
```

--------------------------------------------------------------------------------

---[FILE: createFolderFromDoc.ts]---
Location: payload-main/test/helpers/folders/createFolderFromDoc.ts

```typescript
import { expect, type Page } from '@playwright/test'

import { createFolder } from './createFolder.js'
import { createFolderDoc } from './createFolderDoc.js'

type Args = {
  folderName: string
  folderType?: string[]
  page: Page
}

export async function createFolderFromDoc({
  folderName,
  page,
  folderType = ['Posts'],
}: Args): Promise<void> {
  const addFolderButton = page.locator('.create-new-doc-in-folder__button', {
    hasText: 'Create folder',
  })
  await addFolderButton.click()

  await createFolderDoc({
    page,
    folderName,
    folderType,
  })

  const folderCard = page.locator('.folder-file-card__name', { hasText: folderName }).first()
  await expect(folderCard).toBeVisible()
}
```

--------------------------------------------------------------------------------

---[FILE: expectNoResultsAndCreateFolderButton.ts]---
Location: payload-main/test/helpers/folders/expectNoResultsAndCreateFolderButton.ts

```typescript
import { expect, type Page } from '@playwright/test'

type Args = {
  page: Page
}

export async function expectNoResultsAndCreateFolderButton({ page }: Args): Promise<void> {
  const noResultsDiv = page.locator('div.no-results')
  await expect(noResultsDiv).toBeVisible()
  const createFolderButton = noResultsDiv.locator('text=Create Folder')
  await expect(createFolderButton).toBeVisible()
}
```

--------------------------------------------------------------------------------

---[FILE: selectFolderAndConfirmMove.ts]---
Location: payload-main/test/helpers/folders/selectFolderAndConfirmMove.ts

```typescript
import type { Page } from '@playwright/test'

import { clickFolderCard } from './clickFolderCard.js'

type Args = {
  folderName?: string
  page: Page
}
export async function selectFolderAndConfirmMove({ folderName, page }: Args): Promise<void> {
  if (folderName) {
    await clickFolderCard({ folderName, doubleClick: true, page })
  }

  const selectButton = page
    .locator('button[aria-label="Apply Changes"]')
    .filter({ hasText: 'Select' })
  await selectButton.click()
  const confirmMoveButton = page
    .locator('dialog#move-folder-drawer-confirm-move')
    .getByRole('button', { name: 'Move' })
  await confirmMoveButton.click()
}
```

--------------------------------------------------------------------------------

---[FILE: selectFolderAndConfirmMoveFromList.ts]---
Location: payload-main/test/helpers/folders/selectFolderAndConfirmMoveFromList.ts

```typescript
import type { Page } from '@playwright/test'

import { clickFolderCard } from './clickFolderCard.js'

type Args = {
  folderName?: string
  page: Page
  rowIndex?: number
}
export async function selectFolderAndConfirmMoveFromList({
  page,
  folderName,
  rowIndex = 1,
}: Args): Promise<void> {
  const firstListItem = page.locator(`tbody .row-${rowIndex}`)
  const folderPill = firstListItem.locator('.move-doc-to-folder')
  await folderPill.click()

  if (folderName) {
    await clickFolderCard({ folderName, doubleClick: true, page })
  }

  const selectButton = page
    .locator('button[aria-label="Apply Changes"]')
    .filter({ hasText: 'Select' })
  await selectButton.click()
  const confirmMoveButton = page
    .locator('dialog#move-folder-drawer-confirm-move')
    .getByRole('button', { name: 'Move' })
  await confirmMoveButton.click()
}
```

--------------------------------------------------------------------------------

---[FILE: emptyModule.js]---
Location: payload-main/test/helpers/mocks/emptyModule.js

```javascript
export default () => {}
```

--------------------------------------------------------------------------------

---[FILE: fileMock.js]---
Location: payload-main/test/helpers/mocks/fileMock.js

```javascript
export default 'file-stub'
```

--------------------------------------------------------------------------------

---[FILE: endpoint.ts]---
Location: payload-main/test/helpers/sdk/endpoint.ts

```typescript
import type { Endpoint, PayloadHandler } from 'payload'

import { status as httpStatus } from 'http-status'
import { addDataAndFileToRequest } from 'payload'

export const handler: PayloadHandler = async (req) => {
  await addDataAndFileToRequest(req)

  const { data, payload, user } = req

  const operation = data?.operation ? String(data.operation) : undefined

  if (data?.operation && typeof payload[operation] === 'function') {
    try {
      const result = await payload[operation]({
        ...(typeof data.args === 'object' ? data.args : {}),
        user,
      })

      return Response.json(result, {
        status: httpStatus.OK,
      })
    } catch (err) {
      payload.logger.error(err)
      return Response.json(err, {
        status: httpStatus.BAD_REQUEST,
      })
    }
  }

  return Response.json(
    {
      message: 'Payload Local API method not found.',
    },
    {
      status: httpStatus.BAD_REQUEST,
    },
  )
}

export const localAPIEndpoint: Endpoint = {
  path: '/local-api',
  method: 'post',
  handler,
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/helpers/sdk/index.ts

```typescript
import type { PaginatedDocs, SendEmailOptions } from 'payload'

import type {
  CreateArgs,
  DeleteArgs,
  FetchOptions,
  FindArgs,
  GeneratedTypes,
  LoginArgs,
  UpdateArgs,
  UpdateGlobalArgs,
} from './types.js'

type Args = {
  serverURL: string
}

export class PayloadTestSDK<TGeneratedTypes extends GeneratedTypes<TGeneratedTypes>> {
  private fetch = async <T>({ jwt, reduceJSON, args, operation }: FetchOptions): Promise<T> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (jwt) {
      headers.Authorization = `JWT ${jwt}`
    }

    const json: T = await fetch(`${this.serverURL}/api/local-api`, {
      method: 'post',
      headers,
      body: JSON.stringify({
        args,
        operation,
      }),
    }).then((res) => res.json())

    if (reduceJSON) {
      return reduceJSON<T>(json)
    }

    return json
  }

  create = async <T extends keyof TGeneratedTypes['collections']>({
    jwt,
    ...args
  }: CreateArgs<TGeneratedTypes, T>) => {
    return this.fetch<TGeneratedTypes['collections'][T]>({
      operation: 'create',
      args,
      jwt,
    })
  }

  delete = async <T extends keyof TGeneratedTypes['collections']>({
    jwt,
    ...args
  }: DeleteArgs<TGeneratedTypes, T>) => {
    return this.fetch<PaginatedDocs<TGeneratedTypes['collections'][T]>>({
      operation: 'delete',
      args,
      jwt,
    })
  }

  find = async <T extends keyof TGeneratedTypes['collections']>({
    jwt,
    ...args
  }: FindArgs<TGeneratedTypes, T>) => {
    return this.fetch<PaginatedDocs<TGeneratedTypes['collections'][T]>>({
      operation: 'find',
      args,
      jwt,
    })
  }

  findVersions = async <T extends keyof TGeneratedTypes['collections']>({
    jwt,
    ...args
  }: FindArgs<TGeneratedTypes, T>) => {
    return this.fetch<PaginatedDocs<TGeneratedTypes['collections'][T]>>({
      operation: 'findVersions',
      args,
      jwt,
    })
  }

  login = async <T extends keyof TGeneratedTypes['collections']>({
    jwt,
    ...args
  }: LoginArgs<TGeneratedTypes, T>) => {
    return this.fetch<TGeneratedTypes['collections'][T]>({
      operation: 'login',
      args,
      jwt,
    })
  }

  sendEmail = async ({ jwt, ...args }: { jwt?: string } & SendEmailOptions): Promise<unknown> => {
    return this.fetch({
      operation: 'sendEmail',
      args,
      jwt,
    })
  }

  serverURL: string

  update = async <T extends keyof TGeneratedTypes['collections']>({
    jwt,
    ...args
  }: UpdateArgs<TGeneratedTypes, T>) => {
    return this.fetch<TGeneratedTypes['collections'][T]>({
      operation: 'update',
      args,
      jwt,
    })
  }

  updateGlobal = async <T extends keyof TGeneratedTypes['globals']>({
    jwt,
    ...args
  }: UpdateGlobalArgs<TGeneratedTypes, T>) => {
    return this.fetch<TGeneratedTypes['collections'][T]>({
      operation: 'updateGlobal',
      args,
      jwt,
    })
  }

  constructor({ serverURL }: Args) {
    this.serverURL = serverURL
  }
}
```

--------------------------------------------------------------------------------

````
