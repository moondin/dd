---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 418
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 418 of 695)

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

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/views/List/ListSelection/index.tsx
Signals: React

```typescript
'use client'
import type { ClientCollectionConfig, ViewTypes, Where } from 'payload'

import React, { Fragment, useCallback } from 'react'

import { DeleteMany } from '../../../elements/DeleteMany/index.js'
import { EditMany_v4 } from '../../../elements/EditMany/index.js'
import { ListSelection_v4, ListSelectionButton } from '../../../elements/ListSelection/index.js'
import { PublishMany_v4 } from '../../../elements/PublishMany/index.js'
import { RestoreMany } from '../../../elements/RestoreMany/index.js'
import { UnpublishMany_v4 } from '../../../elements/UnpublishMany/index.js'
import { SelectAllStatus, useSelection } from '../../../providers/Selection/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'

export type ListSelectionProps = {
  collectionConfig?: ClientCollectionConfig
  disableBulkDelete?: boolean
  disableBulkEdit?: boolean
  label: string
  modalPrefix?: string
  showSelectAllAcrossPages?: boolean
  viewType?: ViewTypes
  where?: Where
}

export const ListSelection: React.FC<ListSelectionProps> = ({
  collectionConfig,
  disableBulkDelete,
  disableBulkEdit,
  label,
  modalPrefix,
  showSelectAllAcrossPages = true,
  viewType,
  where,
}) => {
  const { count, selectAll, selectedIDs, toggleAll, totalDocs } = useSelection()
  const { t } = useTranslation()

  const onActionSuccess = useCallback(() => toggleAll(), [toggleAll])

  if (count === 0) {
    return null
  }

  const isTrashView = collectionConfig?.trash && viewType === 'trash'

  return (
    <ListSelection_v4
      count={count}
      ListActions={[
        selectAll !== SelectAllStatus.AllAvailable &&
        count < totalDocs &&
        showSelectAllAcrossPages !== false ? (
          <ListSelectionButton
            aria-label={t('general:selectAll', { count: `(${totalDocs})`, label })}
            id="select-all-across-pages"
            key="select-all"
            onClick={() => toggleAll(true)}
          >
            {t('general:selectAll', { count: `(${totalDocs})`, label: '' })}
          </ListSelectionButton>
        ) : null,
      ].filter(Boolean)}
      SelectionActions={[
        !disableBulkEdit && !isTrashView && (
          <Fragment key="bulk-actions">
            <EditMany_v4
              collection={collectionConfig}
              count={count}
              ids={selectedIDs}
              modalPrefix={modalPrefix}
              onSuccess={onActionSuccess}
              selectAll={selectAll === SelectAllStatus.AllAvailable}
              where={where}
            />
            <PublishMany_v4
              collection={collectionConfig}
              count={count}
              ids={selectedIDs}
              modalPrefix={modalPrefix}
              onSuccess={onActionSuccess}
              selectAll={selectAll === SelectAllStatus.AllAvailable}
              where={where}
            />
            <UnpublishMany_v4
              collection={collectionConfig}
              count={count}
              ids={selectedIDs}
              modalPrefix={modalPrefix}
              onSuccess={onActionSuccess}
              selectAll={selectAll === SelectAllStatus.AllAvailable}
              where={where}
            />
          </Fragment>
        ),
        isTrashView && (
          <RestoreMany collection={collectionConfig} key="bulk-restore" viewType={viewType} />
        ),
        !disableBulkDelete && (
          <DeleteMany
            collection={collectionConfig}
            key="bulk-delete"
            modalPrefix={modalPrefix}
            viewType={viewType}
          />
        ),
      ].filter(Boolean)}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: audit-dependencies.mjs]---
Location: payload-main/scripts/audit-dependencies.mjs

```text
#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

// Simple semver check functions - avoid external dependency
function satisfies(version, range) {
  // Handle >=x.y.z format
  if (range.startsWith('>=')) {
    const minVersion = range.substring(2)
    return compareVersions(version, minVersion) >= 0
  }
  // Handle <x.y.z format
  if (range.startsWith('<') && !range.startsWith('<=')) {
    const maxVersion = range.substring(1)
    return compareVersions(version, maxVersion) < 0
  }
  // Handle <=x.y.z format
  if (range.startsWith('<=')) {
    const maxVersion = range.substring(2)
    return compareVersions(version, maxVersion) <= 0
  }
  return true
}

function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0
    const p2 = parts2[i] || 0
    if (p1 > p2) return 1
    if (p1 < p2) return -1
  }
  return 0
}

function maxSatisfying(range, fixedVersion) {
  // Check if a range like ^5.28.4 could satisfy >=5.28.5
  const fixedVer = fixedVersion.replace('>=', '').replace('>', '')

  if (range.startsWith('^')) {
    const baseVersion = range.substring(1)
    const baseParts = baseVersion.split('.').map(Number)
    const fixedParts = fixedVer.split('.').map(Number)

    // For ^x.y.z, allows >=x.y.z <(x+1).0.0
    // Check if major versions match and fixed version is within range
    if (baseParts[0] === fixedParts[0]) {
      return true // Same major version, caret range can include the fix
    }
  }

  if (range.startsWith('~')) {
    const baseVersion = range.substring(1)
    const baseParts = baseVersion.split('.').map(Number)
    const fixedParts = fixedVer.split('.').map(Number)

    // For ~x.y.z, allows >=x.y.z <x.(y+1).0
    if (baseParts[0] === fixedParts[0] && baseParts[1] === fixedParts[1]) {
      return true // Same major.minor, tilde range can include the fix
    }
  }

  return false
}

const severity = process.argv[2] || 'high'
const outputFile = 'audit_output.json'

console.log(`Auditing for ${severity}+ vulnerabilities...`)

let auditJson
try {
  const auditOutput = execSync('pnpm audit --prod --json', {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024, // 10MB buffer
  })
  auditJson = JSON.parse(auditOutput)
} catch (error) {
  // pnpm audit exits with non-zero when vulnerabilities are found
  if (error.stdout) {
    auditJson = JSON.parse(error.stdout)
  } else {
    throw error
  }
}

const severityLevels = ['low', 'moderate', 'high', 'critical']
const minSeverityIndex = severityLevels.indexOf(severity)

const advisories = auditJson.advisories || {}
const vulnerabilities = Object.entries(advisories)
  .filter(([_, advisory]) => {
    const advSeverityIndex = severityLevels.indexOf(advisory.severity)
    return advSeverityIndex >= minSeverityIndex
  })
  .map(([_, advisory]) => {
    const affectedPackages = []
    const firstDependentPaths = []
    const paths = advisory.findings.flatMap((finding) => finding.paths)

    // Find deepest path to check direct dependency
    let deepestPath = ''
    for (const path of paths) {
      const topLevelPkg = path.split(' > ')[0]
      if (topLevelPkg.startsWith('packages/')) {
        if (!affectedPackages.includes(topLevelPkg)) {
          affectedPackages.push(topLevelPkg)
          firstDependentPaths.push(path.split(' > ')[1] || '')
        }
        if (path.split(' > ').length > deepestPath.split(' > ').length) {
          deepestPath = path
        }
      }
    }

    // Walk up the dependency chain to find the minimum fixable dependency
    let directDepVersion = null
    let blockingDep = null // Track which dep blocks the fix

    // If no paths, the vulnerable package itself might be a direct/peer dependency
    if (!deepestPath && paths.length === 0 && advisory.patched_versions !== '<0.0.0') {
      try {
        const latestVersion = execSync(`pnpm view "${advisory.module_name}" version`, {
          encoding: 'utf-8',
          maxBuffer: 10 * 1024 * 1024,
          stdio: ['pipe', 'pipe', 'ignore'],
        }).trim()

        // Check if latest version satisfies the patched version range
        if (satisfies(latestVersion, advisory.patched_versions)) {
          directDepVersion = latestVersion
        }
      } catch (error) {
        // Ignore errors
      }
    } else if (deepestPath && advisory.patched_versions !== '<0.0.0') {
      const parts = deepestPath.split(' > ')
      const vulnerablePkg = advisory.module_name

      // Find the first non-workspace dependency in the chain (the actual direct dep we can update)
      let actualDirectDepIndex = -1
      let actualDirectDepName = null
      for (let i = 1; i < parts.length; i++) {
        const match = parts[i].match(/^(.+?)@(.+)$/)
        if (match && !match[2].startsWith('link:') && !match[2].startsWith('workspace:')) {
          actualDirectDepIndex = i
          actualDirectDepName = match[1]
          break
        }
      }

      // Walk from parent of vulnerable package upward (skip vulnerable package itself)
      for (let i = parts.length - 2; i >= 1; i--) {
        const depStr = parts[i]
        const match = depStr.match(/^(.+?)@(.+)$/)
        if (!match) continue

        const depName = match[1]
        const currentVersion = match[2]

        // Skip workspace packages - can't update them via npm
        if (currentVersion.startsWith('link:') || currentVersion.startsWith('workspace:')) {
          continue
        }

        // Track this as potentially blocking
        if (!blockingDep) {
          blockingDep = `${depName}@${currentVersion}`
        }

        // Get latest version of this dependency
        try {
          const latestVersion = execSync(`pnpm view "${depName}" version`, {
            encoding: 'utf-8',
            maxBuffer: 10 * 1024 * 1024,
            stdio: ['pipe', 'pipe', 'ignore'],
          }).trim()

          // Skip if already on latest
          if (latestVersion === currentVersion) continue

          // Check if latest version of this dep has fixed the vulnerable transitive dep
          const depsOutput = execSync(
            `pnpm view "${depName}@${latestVersion}" dependencies --json`,
            {
              encoding: 'utf-8',
              maxBuffer: 10 * 1024 * 1024,
              stdio: ['pipe', 'pipe', 'ignore'],
            },
          )
          if (!depsOutput.trim()) continue

          const deps = JSON.parse(depsOutput)
          const vulnerableDepVersion = deps[vulnerablePkg]

          if (vulnerableDepVersion) {
            // Check what version would actually be resolved
            // Use pnpm view to get the max satisfying version for the range
            try {
              const viewOutput = execSync(
                `pnpm view "${vulnerablePkg}@${vulnerableDepVersion}" --json 2>/dev/null`,
                {
                  encoding: 'utf-8',
                  maxBuffer: 10 * 1024 * 1024,
                  stdio: ['pipe', 'pipe', 'ignore'],
                },
              ).trim()

              if (!viewOutput) throw new Error('No output')

              const viewData = JSON.parse(viewOutput)
              // If array, take the last (latest) version, otherwise single object
              const resolvedVersion = Array.isArray(viewData)
                ? viewData[viewData.length - 1].version
                : viewData.version

              // Check if the resolved version satisfies the fix
              const fixedVersionRange = advisory.patched_versions
              if (satisfies(resolvedVersion, fixedVersionRange)) {
                // Found a fix! Clear the blocking dep
                blockingDep = null

                // Calculate what version of the direct dependency is needed
                if (i === actualDirectDepIndex) {
                  // fixable dep IS the actual direct dep
                  directDepVersion = latestVersion
                } else {
                  // Need to find what version of actual direct dep includes this fix
                  if (actualDirectDepName) {
                    try {
                      const directDepLatest = execSync(
                        `pnpm view "${actualDirectDepName}" version`,
                        {
                          encoding: 'utf-8',
                          maxBuffer: 10 * 1024 * 1024,
                          stdio: ['pipe', 'pipe', 'ignore'],
                        },
                      ).trim()
                      directDepVersion = directDepLatest
                    } catch (e) {
                      directDepVersion = latestVersion
                    }
                  }
                }
                break
              }
            } catch (resolveError) {
              // If we can't resolve, fall back to range check
              const fixedVersionRange = advisory.patched_versions
              if (maxSatisfying(vulnerableDepVersion, fixedVersionRange)) {
                // Found a fix! Clear the blocking dep
                blockingDep = null

                // Calculate direct dep version
                if (i === actualDirectDepIndex) {
                  directDepVersion = latestVersion
                } else {
                  if (actualDirectDepName) {
                    try {
                      const directDepLatest = execSync(
                        `pnpm view "${actualDirectDepName}" version`,
                        {
                          encoding: 'utf-8',
                          maxBuffer: 10 * 1024 * 1024,
                          stdio: ['pipe', 'pipe', 'ignore'],
                        },
                      ).trim()
                      directDepVersion = directDepLatest
                    } catch (e) {
                      directDepVersion = latestVersion
                    }
                  }
                }
                break
              }
            }
          }
        } catch (error) {
          // Ignore errors, continue walking up
        }
      }
    }

    // Get the direct dep (first non-workspace dependency in the chain)
    let directDep = advisory.module_name
    if (deepestPath) {
      const parts = deepestPath.split(' > ')
      for (let i = 1; i < parts.length; i++) {
        const match = parts[i].match(/^(.+?)@(.+)$/)
        if (match && !match[2].startsWith('link:') && !match[2].startsWith('workspace:')) {
          directDep = match[1]
          break
        }
      }
    }

    const hasDirectUpdate = directDepVersion !== null

    // Build the fix chain showing what the dependency path would look like after the fix
    let fixChain = null
    if (hasDirectUpdate && deepestPath && directDepVersion) {
      try {
        const parts = deepestPath.split(' > ')
        const pkgPath = parts[0]

        // Helper to resolve workspace link to actual version
        const resolveWorkspaceLink = (linkPath) => {
          try {
            // linkPath is like "link:../drizzle" or "workspace:*"
            const relativePath = linkPath.replace(/^(link:|workspace:)/, '').replace(/^\.\.\//, '')
            const packageJsonPath = path.join(
              process.cwd(),
              'packages',
              relativePath,
              'package.json',
            )
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
            return packageJson.version
          } catch (e) {
            return null
          }
        }

        // Recursively resolve the same path as the vulnerable one, but with updated versions
        const resolveChain = (parentPkg, parentVersion, targetDepName, depth) => {
          try {
            // Check if parentVersion is a workspace link
            const isLink = parentVersion && parentVersion.startsWith('link:')
            let depsOutput

            if (isLink) {
              // Read from local package.json
              const relativePath = parentVersion
                .replace(/^(link:|workspace:)/, '')
                .replace(/^\.\.\//, '')
              const packageJsonPath = path.join(
                process.cwd(),
                'packages',
                relativePath,
                'package.json',
              )
              const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
              depsOutput = JSON.stringify(packageJson.dependencies || {})
            } else {
              // Read from npm registry
              depsOutput = execSync(
                `pnpm view "${parentPkg}@${parentVersion}" dependencies --json`,
                {
                  encoding: 'utf-8',
                  maxBuffer: 10 * 1024 * 1024,
                  stdio: ['pipe', 'pipe', 'ignore'],
                },
              ).trim()
            }

            if (!depsOutput) return null

            const deps = JSON.parse(depsOutput)
            const depRange = deps[targetDepName]

            if (!depRange) return null

            // Check if this is a workspace link
            if (depRange.startsWith('link:') || depRange.startsWith('workspace:')) {
              const version = resolveWorkspaceLink(depRange)
              return version ? `link:${depRange.replace(/^(link:|workspace:)/, '')}` : null
            }

            // Resolve what version this range would give us
            const viewOutput = execSync(
              `pnpm view "${targetDepName}@${depRange}" --json 2>/dev/null`,
              {
                encoding: 'utf-8',
                maxBuffer: 10 * 1024 * 1024,
                stdio: ['pipe', 'pipe', 'ignore'],
              },
            ).trim()

            if (!viewOutput) return null

            const viewData = JSON.parse(viewOutput)
            const resolvedVersion = Array.isArray(viewData)
              ? viewData[viewData.length - 1].version
              : viewData.version

            return resolvedVersion
          } catch (e) {
            return null
          }
        }

        // Start building chain from package -> direct dep with new version
        const chain = [pkgPath, `${directDep}@${directDepVersion}`]

        // Try to find the shortest path from direct dep to the fixed vulnerable package
        // First check if direct dep directly depends on the vulnerable package
        const directDepDeps = (() => {
          try {
            const output = execSync(
              `pnpm view "${directDep}@${directDepVersion}" dependencies --json`,
              {
                encoding: 'utf-8',
                maxBuffer: 10 * 1024 * 1024,
                stdio: ['pipe', 'pipe', 'ignore'],
              },
            ).trim()
            return output ? JSON.parse(output) : {}
          } catch (e) {
            return {}
          }
        })()

        if (directDepDeps[advisory.module_name]) {
          // Direct path exists
          const resolvedVersion = (() => {
            try {
              const viewOutput = execSync(
                `pnpm view "${advisory.module_name}@${directDepDeps[advisory.module_name]}" --json`,
                {
                  encoding: 'utf-8',
                  maxBuffer: 10 * 1024 * 1024,
                  stdio: ['pipe', 'pipe', 'ignore'],
                },
              ).trim()
              const viewData = JSON.parse(viewOutput)
              return Array.isArray(viewData)
                ? viewData[viewData.length - 1].version
                : viewData.version
            } catch (e) {
              return advisory.patched_versions.replace('>=', '')
            }
          })()
          chain.push(`${advisory.module_name}@${resolvedVersion}`)
        } else {
          // Walk through the original path
          let currentPkg = directDep
          let currentVersion = directDepVersion

          for (let j = 2; j < parts.length; j++) {
            const currentDepName = parts[j].match(/^(.+?)@/)?.[1]
            if (!currentDepName) continue

            const resolvedVersion = resolveChain(currentPkg, currentVersion, currentDepName, j)

            if (resolvedVersion) {
              chain.push(`${currentDepName}@${resolvedVersion}`)
              currentPkg = currentDepName
              currentVersion = resolvedVersion
            } else {
              // Can't resolve, stop here
              break
            }
          }
        }

        fixChain = chain
      } catch (e) {
        // If we can't build the chain, just leave it null
      }
    }

    affectedPackages.sort()

    return {
      package: advisory.module_name,
      title: advisory.title,
      severity: advisory.severity,
      vulnerable: advisory.vulnerable_versions,
      fixedIn: advisory.patched_versions,
      url: advisory.url,
      findings: advisory.findings,
      affectedPackages: affectedPackages,
      firstDependent: firstDependentPaths[0] || advisory.module_name,
      directDep: directDep,
      directDepVersion: directDepVersion,
      hasDirectUpdate: hasDirectUpdate,
      blockingDep: blockingDep,
      fixChain: fixChain,
    }
  })
  .sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, moderate: 2, low: 3 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })

fs.writeFileSync(outputFile, JSON.stringify(vulnerabilities, null, 2))

if (vulnerabilities.length > 0) {
  console.log(chalk.bold(`\nFound ${vulnerabilities.length} ${severity}+ vulnerabilities:\n`))

  for (const vuln of vulnerabilities) {
    console.log(chalk.bold.cyan(`${vuln.package}`))
    if (vuln.title) {
      console.log(`  ${chalk.dim('Title:')} ${vuln.title}`)
    }
    if (vuln.severity) {
      const severityColors = {
        low: chalk.gray,
        moderate: chalk.yellow,
        high: chalk.red,
        critical: chalk.bgRed.white,
      }
      const colorFn = severityColors[vuln.severity] || chalk.white
      console.log(`  ${chalk.gray('Severity:')} ${colorFn(vuln.severity.toUpperCase())}`)
    }
    console.log(`  ${chalk.gray('Vulnerable:')} ${chalk.red(vuln.vulnerable)}`)
    console.log(`  ${chalk.gray('Fixed in:')} ${chalk.green(vuln.fixedIn)}`)
    console.log(`  ${chalk.gray('Info:')} ${chalk.blue(vuln.url)}`)

    if (vuln.affectedPackages.length > 0) {
      const pkgList = vuln.affectedPackages.join(', ')
      console.log(`  ${chalk.gray('Affects:')} ${pkgList} ${chalk.gray('via')} ${vuln.directDep}`)
    }

    if (vuln.hasDirectUpdate && vuln.directDepVersion) {
      console.log(
        `  ${chalk.gray('Fix:')} Update ${chalk.yellow(vuln.directDep)} to ${chalk.yellow(vuln.directDepVersion)}`,
      )

      // Show the new dependency chain after the fix
      if (vuln.fixChain) {
        console.log(`  ${chalk.gray('Fixed chain:')}`)
        vuln.fixChain.forEach((dep, i) => {
          const indent = '    ' + '  '.repeat(i)
          if (i === 0) {
            console.log(`${indent}${chalk.dim(dep)}`)
          } else {
            const match = dep.match(/^(.+?)@(.+)$/)
            if (match) {
              const [, pkg, version] = match
              // Check if it's a workspace link and resolve to actual version
              let displayVersion = version
              if (version.startsWith('link:') || version.startsWith('workspace:')) {
                try {
                  const relativePath = version
                    .replace(/^(link:|workspace:)/, '')
                    .replace(/^\.\.\//, '')
                  const packageJsonPath = path.join(
                    process.cwd(),
                    'packages',
                    relativePath,
                    'package.json',
                  )
                  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
                  displayVersion = `${packageJson.version} ${chalk.dim('(workspace)')}`
                } catch (e) {
                  displayVersion = version
                }
              }
              const formatted = `${chalk.white(pkg)} ${chalk.dim(displayVersion)}`
              console.log(`${indent}${chalk.dim('└─')} ${formatted}`)
            } else {
              console.log(`${indent}${chalk.dim('└─')} ${dep}`)
            }
          }
        })
      }
    } else if (!vuln.hasDirectUpdate) {
      if (vuln.blockingDep) {
        console.log(
          `  ${chalk.gray('Fix:')} ${chalk.red('No fix available')} (blocked by ${chalk.red(vuln.blockingDep)})`,
        )
      } else {
        console.log(`  ${chalk.gray('Fix:')} ${chalk.red('No fix available')}`)
      }
    }

    // Show full dependency paths
    const paths = vuln.findings
      .flatMap((finding) => finding.paths)
      .filter((path) => path.split(' > ')[0].startsWith('packages/'))
    if (paths.length > 0) {
      console.log(`  ${chalk.gray('Paths:')}`)
      paths.slice(0, 3).forEach((path) => {
        const parts = path.split(' > ')
        parts.forEach((part, i) => {
          const indent = '    ' + '  '.repeat(i)
          if (i === 0) {
            console.log(`${indent}${chalk.dim(part)}`)
          } else {
            const match = part.match(/^(.+?)@(.+)$/)
            if (match) {
              const [, pkg, version] = match
              let displayVersion = version
              // Check if it's a workspace link
              if (version.startsWith('link:') || version.startsWith('workspace:')) {
                try {
                  const relativePath = version
                    .replace(/^(link:|workspace:)/, '')
                    .replace(/^\.\.\//, '')
                  const packageJsonPath = path.join(
                    process.cwd(),
                    'packages',
                    relativePath,
                    'package.json',
                  )
                  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
                  displayVersion = `${packageJson.version} ${chalk.dim('(workspace)')}`
                } catch (e) {
                  displayVersion = version
                }
              }
              // Check if this is the blocking dependency
              const isBlocking = vuln.blockingDep === `${pkg}@${version}`
              const pkgColor = isBlocking ? chalk.red : chalk.white
              const formatted = `${pkgColor(pkg)} ${chalk.dim(displayVersion)}`
              console.log(`${indent}${chalk.dim('└─')} ${formatted}`)
            } else {
              console.log(`${indent}${chalk.dim('└─')} ${part}`)
            }
          }
        })
      })
      if (paths.length > 3) {
        console.log(chalk.dim(`    ... and ${paths.length - 3} more`))
      }
    }

    console.log()
  }

  console.log(chalk.dim(`Output written to ${outputFile}`))
  console.log(
    chalk.dim(`Rerun with: node ./.github/workflows/audit-dependencies.cjs ${severity}\n`),
  )
  process.exit(1)
} else {
  console.log(chalk.green('✓ No actionable vulnerabilities'))
  process.exit(0)
}
```

--------------------------------------------------------------------------------

---[FILE: build-generated-templates.ts]---
Location: payload-main/scripts/build-generated-templates.ts

```typescript
import * as fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'path'
import { execSync } from 'child_process'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function main() {
  // Get all directories in `templates` directory
  const repoRoot = path.resolve(dirname, '..')
  const templatesDir = path.resolve(repoRoot, 'templates')

  const rawTemplateDirs = await fs.readdir(templatesDir, { withFileTypes: true })
  const templateDirnames = rawTemplateDirs
    .filter(
      (dirent) =>
        dirent.isDirectory() && (dirent.name.startsWith('with') || dirent.name == 'blank'),
    )
    .map((dirent) => dirent.name)

  console.log(`Found generated templates: ${templateDirnames}`)

  // Build each template
  for (const template of templateDirnames) {
    const cmd = `cd ${templatesDir}/${template} && pnpm install --ignore-workspace --no-frozen-lockfile && pnpm build`
    console.log(`🔧 Building ${template}...`)
    console.log(`   cmd: ${cmd}\n\n`)
    execSync(cmd, { stdio: 'inherit' })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: delete-recursively.js]---
Location: payload-main/scripts/delete-recursively.js

```javascript
import { promises as fs, existsSync } from 'fs'
import { join } from 'path'
import globby from 'globby'
import process from 'node:process'
import chalk from 'chalk'

// Helper function to format size appropriately in KB or MB
function formatSize(sizeInBytes) {
  const sizeInKB = sizeInBytes / 1024
  if (sizeInKB < 1024) {
    return `${sizeInKB.toFixed(2)} KB`
  } else {
    return `${(sizeInKB / 1024).toFixed(2)} MB`
  }
}

// Function to calculate the size of a directory
async function calculateSize(targetPath) {
  let totalSize = 0
  const stats = await fs.lstat(targetPath)
  if (stats.isDirectory()) {
    const files = await fs.readdir(targetPath)
    for (const file of files) {
      const filePath = join(targetPath, file)
      totalSize += await calculateSize(filePath)
    }
  } else {
    totalSize = stats.size
  }
  return totalSize
}

// Function to delete a file or directory recursively
async function deleteRecursively(targetPath, fullDelete = false) {
  try {
    if (fullDelete && existsSync(targetPath)) {
      const size = await calculateSize(targetPath)
      await fs.rmdir(targetPath, { recursive: true }) // Use async version of rmdir
      return size
    }

    const stats = await fs.lstat(targetPath)
    let size = 0
    if (stats.isDirectory()) {
      const files = await fs.readdir(targetPath)
      for (const file of files) {
        const curPath = join(targetPath, file)
        size += await deleteRecursively(curPath)
      }
      await fs.rmdir(targetPath)
    } else {
      size = stats.size
      await fs.unlink(targetPath)
    }
    return size
  } catch (error) {
    console.error(chalk.red(`Error deleting ${targetPath}: ${error.message}`))
    return 0 // Return 0 size if there's an error
  }
}

// Function to clean directories based on provided patterns
async function cleanDirectories(patterns) {
  const deletedCounts = {}
  let totalSize = 0

  for (let entry of patterns) {
    const ignoreNodeModules = !entry.endsWith('!')
    let pattern = ignoreNodeModules ? entry : entry.slice(0, -1)

    let files = []
    let fulleDelete = false
    if (pattern === '@node_modules') {
      pattern = '**/node_modules'
      fulleDelete = true
      files = await globby(pattern, {
        onlyDirectories: true,
        ignore: ['**/node_modules/**/node_modules'],
      })
    } else {
      const options = {
        ignore: ignoreNodeModules ? '**/node_modules/**' : '',
        onlyDirectories: pattern.endsWith('/') ? true : false,
      }
      fulleDelete = options.onlyDirectories

      files = await globby(pattern, options)
    }

    let count = 0
    let patternSize = 0
    for (const file of files) {
      const fileSize = await deleteRecursively(file, fulleDelete)
      count++
      patternSize += fileSize
    }
    deletedCounts[pattern] = { count, size: patternSize }
    totalSize += patternSize
  }

  // Determine the maximum lengths needed for even spacing
  const maxPatternLength = Math.max(...Object.keys(deletedCounts).map((pattern) => pattern.length))
  const maxCountLength = Math.max(
    ...Object.values(deletedCounts).map(
      (item) => `${item.count} item${item.count !== 1 ? 's' : ''} deleted`.length,
    ),
  )
  const maxSizeLength = Math.max(
    ...Object.values(deletedCounts).map((item) => formatSize(item.size).length),
  )

  // Print details for each pattern with colors, formatted for alignment
  console.log(chalk.blue('\nSummary of deleted items:'))
  Object.keys(deletedCounts).forEach((pattern) => {
    const itemCount =
      `${deletedCounts[pattern].count} item${deletedCounts[pattern].count !== 1 ? 's' : ''} deleted`.padEnd(
        maxCountLength,
      )
    console.log(
      `${chalk.green(pattern.padEnd(maxPatternLength))} ${chalk.red(itemCount)} ${chalk.yellow(formatSize(deletedCounts[pattern].size).padStart(maxSizeLength))}`,
    )
  })

  // Calculate total deleted items and size
  console.log(
    chalk.magenta(
      `Total deleted items: ${Object.values(deletedCounts).reduce((acc, { count }) => acc + count, 0)}`,
    ),
  )
  console.log(chalk.cyan(`Total size of deleted items: ${formatSize(totalSize)}\n`))
}

// Get patterns from command-line arguments
const patterns = process.argv.slice(2)

if (patterns.length > 0) {
  void cleanDirectories(patterns)
} else {
  console.log(chalk.red('No patterns provided. Usage: node script.js [patterns]'))
}
```

--------------------------------------------------------------------------------

---[FILE: pack_to_dest.sh]---
Location: payload-main/scripts/pack_to_dest.sh

```bash
#!/usr/bin/env bash

set -ex

# Build and pack package as tgz and move to destination

package_name=$1
package_dir="packages/$package_name"
dest=$2

if [ -z "$package_name" ]; then
  echo "Please specify a package to publish"
  exit 1
fi

# Check if packages/$package_name exists

if [ ! -d "$package_dir" ]; then
  echo "Package $package_name does not exist"
  exit 1
fi

# Check if destination directory exists
if [ ! -d "$dest" ]; then
  echo "Destination directory $dest does not exist"
  exit 1
fi

pnpm --filter "$package_name" run clean
pnpm --filter "$package_name" run build
pnpm -C "$package_dir" pack --pack-destination "$dest"
```

--------------------------------------------------------------------------------

---[FILE: reinstall.sh]---
Location: payload-main/scripts/reinstall.sh

```bash
#!/usr/bin/env bash

# Deletes all node_modules folders and reinstalls all dependencies

set -ex

root_dir=$(git rev-parse --show-toplevel || echo .)
find "$root_dir" -name 'node_modules' -type d -prune -exec rm -rf '{}' +
pnpm install
```

--------------------------------------------------------------------------------

---[FILE: remove-template-lock-files.ts]---
Location: payload-main/scripts/remove-template-lock-files.ts

```typescript
/**
 * In order for Payload Cloud to detect the package manager used in a template, it looks for lock files in the root of the template directory.
 *
 * Lock files should remain for blank and website templates, but should be removed for all others.
 */

import { existsSync, readdirSync, rmSync } from 'fs'
import { join } from 'path'

const baseDir = join(process.cwd(), 'templates')

// These directories MUST contain a lock file for Payload Cloud to detect the package manager
const excluded = ['website', 'blank']

const directories = readdirSync(baseDir, { withFileTypes: true })
  .filter((dir) => dir.isDirectory() && !excluded.includes(dir.name))
  .map((dir) => join(baseDir, dir.name, 'pnpm-lock.yaml'))

directories.forEach((file) => {
  if (existsSync(file)) {
    rmSync(file)
    console.log(`Removed: ${file}`)
  }
})
```

--------------------------------------------------------------------------------

---[FILE: reset-tsconfig.js]---
Location: payload-main/scripts/reset-tsconfig.js

```javascript
// @ts-check

/**
 * Parse tsconfig.json and ensure
 * - compilerOptions.paths['@payload-config'] is set to ['./test/_community/config.ts']
 * - Ends with a newline
 */

import { parse, stringify } from 'comment-json'

import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const tsConfigBasePath = path.resolve(dirname, '../tsconfig.base.json')
const tsConfigPath = existsSync(tsConfigBasePath)
  ? tsConfigBasePath
  : path.resolve(dirname, '../tsconfig.json')


const tsConfigContent = await fs.readFile(tsConfigPath, 'utf8')
const tsConfig = parse(tsConfigContent)

tsConfig.compilerOptions.paths['@payload-config'] = ['./test/_community/config.ts']
const output = stringify(tsConfig, null, 2) + `\n`
await fs.writeFile(tsConfigPath, output)
```

--------------------------------------------------------------------------------

---[FILE: set_npm_script.sh]---
Location: payload-main/scripts/set_npm_script.sh

```bash
#!/usr/bin/env bash

set -ex

# Add/set an npm script on every package in packages directory

# Get all package.json files in packages directory, except eslint-* packages
package_json_files=$(find packages -name "package.json" \
  -not -path "packages/eslint-*")

npm_script_name="lint"
npm_script_command="eslint ."

# Loop through each package.json file
for package_json_file in $package_json_files; do
  # use jq to set a value inside of the package.json "scripts" object
  jq ".scripts[\"$npm_script_name\"] = \"$npm_script_command\"" "$package_json_file" \
    > tmp.json && mv tmp.json "$package_json_file"
done
```

--------------------------------------------------------------------------------

---[FILE: .env.example]---
Location: payload-main/templates/blank/.env.example

```text
DATABASE_URI=mongodb://127.0.0.1/your-database-name
PAYLOAD_SECRET=YOUR_SECRET_HERE
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/templates/blank/.gitignore

```text
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

/.idea/*
!/.idea/runConfigurations

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

.env

/media

# Playwright
node_modules/
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

--------------------------------------------------------------------------------

---[FILE: .npmrc]---
Location: payload-main/templates/blank/.npmrc

```text
legacy-peer-deps=true
```

--------------------------------------------------------------------------------

---[FILE: .prettierrc.json]---
Location: payload-main/templates/blank/.prettierrc.json

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": false
}
```

--------------------------------------------------------------------------------

---[FILE: .yarnrc]---
Location: payload-main/templates/blank/.yarnrc

```text
--install.ignore-engines true
```

--------------------------------------------------------------------------------

````
