---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 145
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 145 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: styles.module.css]---
Location: mlflow-master/docs/src/components/DAGLoop/styles.module.css

```text
/* Define color variables for light/dark mode - matching TileCard blues */
:root {
  --dag-loop-primary: #0194e2;
  --dag-loop-primary-dark: #0066cc;
  --dag-loop-primary-light: rgba(1, 148, 226, 0.3);
  --dag-loop-primary-lightest: rgba(1, 148, 226, 0.1);
  --dag-loop-background: var(--ifm-background-color);
  --dag-loop-border: var(--ifm-border-color);
  --dag-loop-text-primary: var(--ifm-color-emphasis-900);
  --dag-loop-text-secondary: var(--ifm-color-emphasis-700);
}

:global([data-theme='dark']) {
  --dag-loop-primary: #0194e2;
  --dag-loop-primary-dark: #5cb7cc;
  --dag-loop-primary-light: rgba(1, 148, 226, 0.3);
  --dag-loop-primary-lightest: rgba(1, 148, 226, 0.15);
  --dag-loop-background: var(--ifm-background-color);
  --dag-loop-border: var(--ifm-border-color);
  --dag-loop-text-primary: var(--ifm-color-emphasis-900);
  --dag-loop-text-secondary: var(--ifm-color-emphasis-700);
}

.loopContainer {
  margin: 2rem 0;
  position: relative;
  overflow: visible;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
}

.loopTitle {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--dag-loop-text-primary);
  text-align: center;
  font-weight: 600;
  width: 100%;
}

.loopContent {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 1rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Circle layout container */
.circleContainer {
  position: relative;
  margin: 1rem auto 2rem;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
}

.svgCanvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.arrowPath {
  transition: opacity 0.2s ease;
  color: var(--dag-loop-primary-light);
}

.arrowPath:hover {
  opacity: 0.9 !important;
}

.arrowHead {
  color: var(--dag-loop-primary-light);
}

/* Step nodes */
.stepNode {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  z-index: 10;
}

.stepNode:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.stepNodeContent {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--dag-loop-background);
  border: 2px solid var(--dag-loop-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dag-loop-primary);
  font-weight: 600;
  font-size: 1.3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stepNode:hover .stepNodeContent {
  border-color: var(--dag-loop-primary);
  background: var(--dag-loop-primary-lightest);
  box-shadow: 0 4px 16px rgba(1, 148, 226, 0.2);
}

.stepNode.highlighted .stepNodeContent {
  background: var(--dag-loop-primary-lightest);
  border-color: var(--dag-loop-primary);
  border-width: 3px;
}

/* Focus node styling - subtle emphasis */
.stepNode.focusNode .stepNodeContent {
  background: var(--dag-loop-primary);
  color: white;
  border-color: var(--dag-loop-primary-dark);
  border-width: 2px;
  box-shadow: 0 4px 12px rgba(1, 148, 226, 0.25);
}

.stepNode.focusNode:hover .stepNodeContent {
  background: var(--dag-loop-primary-dark);
  box-shadow: 0 6px 16px rgba(1, 148, 226, 0.35);
}

.stepNumber {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--dag-loop-primary);
}

.stepLabel {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--dag-loop-text-secondary);
  text-align: center;
  max-width: 120px;
  line-height: 1.3;
}

/* Center loop icon */
.centerIcon {
  opacity: 1;
}

.loopIconWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: var(--dag-loop-background);
  border: 2px solid var(--dag-loop-primary-light);
  color: var(--dag-loop-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.centerIcon:hover .loopIconWrapper {
  border-color: var(--dag-loop-primary);
  background: var(--dag-loop-primary-lightest);
  box-shadow: 0 4px 16px rgba(1, 148, 226, 0.2);
}

.loopText {
  fill: var(--dag-loop-primary);
  font-size: 0.95rem;
  font-weight: 600;
}

/* Tooltip */
.tooltip {
  position: absolute;
  background: var(--ifm-background-surface-color);
  border: 2px solid var(--dag-loop-primary-light);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 250px;
  max-width: 350px;
  pointer-events: none;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -110%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -120%);
  }
}

.tooltipTitle {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--dag-loop-text-primary);
}

.tooltipDescription {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--dag-loop-text-secondary);
  margin: 0;
}

.tooltipArrow {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 16px;
  height: 16px;
  background: var(--ifm-background-surface-color);
  border-right: 2px solid var(--dag-loop-primary-light);
  border-bottom: 2px solid var(--dag-loop-primary-light);
}

/* Center tooltip */
.centerTooltip {
  position: absolute;
  background: var(--ifm-background-surface-color);
  border: 2px solid var(--dag-loop-primary-light);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 400px;
  min-width: 300px;
  pointer-events: none;
  animation: fadeIn 0.2s ease;
  margin-top: 140px;
}

.centerTooltipDescription {
  color: var(--dag-loop-text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

/* Mobile linear layout styles */
.mobileLinearContent {
  max-width: 100%;
  padding: 1rem;
}

.mobileStepItem {
  display: flex;
  gap: 1rem;
  margin-bottom: 0;
}

.mobileStepIndicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.mobileStepNumber {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--dag-loop-primary-lightest);
  border: 2px solid var(--dag-loop-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dag-loop-primary);
  font-weight: 600;
  font-size: 0.9rem;
}

.mobileStepNumber.mobileFocusNode {
  background: var(--dag-loop-primary);
  color: white;
  border-width: 2px;
  box-shadow: 0 3px 8px rgba(1, 148, 226, 0.2);
}

.mobileStepConnector {
  width: 2px;
  height: 40px;
  background: var(--dag-loop-primary-light);
  margin: 4px 0;
}

.mobileStepContent {
  flex: 1;
  padding-bottom: 1.5rem;
}

.mobileStepTitle {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--dag-loop-text-primary);
}

.mobileStepDescription {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--dag-loop-text-secondary);
  margin: 0;
}

.mobileLoopBack {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--dag-loop-background);
  border: 2px solid var(--dag-loop-primary-light);
  border-radius: 8px;
  margin-top: 0.5rem;
}

.mobileLoopIcon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--dag-loop-primary-lightest);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dag-loop-primary);
  flex-shrink: 0;
}

.mobileLoopContent {
  flex: 1;
}

.mobileLoopTitle {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--dag-loop-primary);
}

.mobileLoopDescription {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--dag-loop-text-secondary);
  margin: 0;
}

/* Mobile responsive design */
@media (max-width: 768px) {
  .loopContainer {
    min-height: auto;
    margin: 1.5rem 0;
    padding: 0;
  }

  .loopContent {
    padding: 1rem 0.5rem;
    width: 100%;
    max-width: 100%;
  }

  .circleContainer {
    width: 280px;
    height: 280px;
    margin: 1rem auto;
    transform: scale(0.9);
  }

  .stepNodeContent {
    width: 44px;
    height: 44px;
    font-size: 1rem;
  }

  .stepLabel {
    font-size: 0.7rem;
    max-width: 70px;
  }

  .tooltip {
    min-width: 200px;
    max-width: 280px;
    padding: 0.75rem 1rem;
  }

  .tooltipTitle {
    font-size: 1rem;
  }

  .tooltipDescription {
    font-size: 0.85rem;
  }

  .centerTooltip {
    max-width: 280px;
    min-width: 200px;
    padding: 1rem;
    margin-top: 100px;
  }

  .centerTooltipDescription {
    font-size: 0.9rem;
  }

  .loopIconWrapper {
    width: 50px;
    height: 50px;
  }

  .loopText {
    font-size: 0.75rem;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/FeatureHighlights/index.tsx
Signals: React

```typescript
import React from 'react';
import { LucideIcon } from 'lucide-react';
import styles from './styles.module.css';

export interface FeatureItem {
  icon?: LucideIcon;
  title: string;
  description: string;
}

interface FeatureHighlightsProps {
  features: FeatureItem[];
  col?: number;
}

export default function FeatureHighlights({ features, col = 2 }: FeatureHighlightsProps) {
  return (
    <div className={styles.featureHighlights} style={{ gridTemplateColumns: `repeat(${col}, 1fr)` }}>
      {features.map((feature, index) => (
        <div key={index} className={styles.highlightItem}>
          {feature.icon && (
            <div className={styles.highlightIcon}>
              <feature.icon size={24} />
            </div>
          )}
          <div className={styles.highlightContent}>
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: styles.module.css]---
Location: mlflow-master/docs/src/components/FeatureHighlights/styles.module.css

```text
.featureHighlights {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.highlightItem {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  text-align: left;
}

.highlightIcon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.highlightContent h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--ifm-color-emphasis-hover);
  margin-top: 0;
}

.highlightContent p {
  color: var(--ifm-border-color);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: Footer.tsx]---
Location: mlflow-master/docs/src/components/Footer/Footer.tsx

```typescript
import { cva } from 'class-variance-authority';
import { useColorMode } from '@docusaurus/theme-common';

import LogoDark from '@site/static/images/mlflow-logo-white.svg';
import LogoLight from '@site/static/images/mlflow-logo-black.svg';
import useBaseUrl from '@docusaurus/useBaseUrl';

import { FooterMenuItem } from '../FooterMenuItem/FooterMenuItem';
import { GradientWrapper, type Variant } from '../GradientWrapper/GradientWrapper';

const footerVariants = cva(
  'pb-30 flex flex-col pt-30 bg-bottom bg-no-repeat bg-cover bg-size-[auto_360px] 2xl:bg-size-[100%_360px]',
  {
    variants: {
      theme: {
        dark: 'bg-brand-black',
        light: 'bg-white',
      },
    },
  },
);

const getLogo = (isDarkMode: boolean) => {
  return isDarkMode ? LogoDark : LogoLight;
};

export const Footer = ({ variant }: { variant: Variant }) => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';
  const Logo = getLogo(isDarkMode);

  return (
    <GradientWrapper
      variant={variant}
      isFooter
      className={footerVariants({ theme: colorMode })}
      element="footer"
      height={360}
    >
      <div className="flex flex-row justify-between items-start md:items-center px-6 lg:px-20 gap-10 xs:gap-0 max-w-container">
        <div className="flex flex-col gap-8">
          <Logo className="h-[36px] shrink-0" />
          <div className="text-xs text-left md:text-nowrap md:w-0">
            © 2025 MLflow Project, a Series of LF Projects, LLC.
          </div>
        </div>

        <div className="flex flex-col flex-wrap justify-end md:text-right md:flex-row gap-x-10 lg:gap-x-20 gap-y-5 w-2/5 md:w-auto md:pt-2 max-w-fit">
          {/* these routes are on the main mlflow.org site, which is hosted in a different repo */}
          <FooterMenuItem href="https://mlflow.org" isDarkMode={isDarkMode}>
            Components
          </FooterMenuItem>
          <FooterMenuItem href="https://mlflow.org/releases" isDarkMode={isDarkMode}>
            Releases
          </FooterMenuItem>
          <FooterMenuItem href="https://mlflow.org/blog" isDarkMode={isDarkMode}>
            Blog
          </FooterMenuItem>
          <FooterMenuItem href={useBaseUrl('/')} isDarkMode={isDarkMode}>
            Docs
          </FooterMenuItem>
          <FooterMenuItem href="https://mlflow.org/ambassadors" isDarkMode={isDarkMode}>
            Ambassador Program
          </FooterMenuItem>
        </div>
      </div>
    </GradientWrapper>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: FooterMenuItem.tsx]---
Location: mlflow-master/docs/src/components/FooterMenuItem/FooterMenuItem.tsx
Signals: React

```typescript
import Link from '@docusaurus/Link';
import { ComponentProps, ReactNode } from 'react';
import { cx } from 'class-variance-authority';

interface FooterMenuItemProps extends ComponentProps<typeof Link> {
  isDarkMode: boolean;
  children: ReactNode;
  className?: string;
  href: string;
}

export const FooterMenuItem = ({ className, isDarkMode, children, ...props }: FooterMenuItemProps) => {
  return (
    <div>
      <Link
        {...props}
        className={cx(
          'text-[15px] font-medium no-underline hover:no-underline transition-opacity hover:opacity-80',
          isDarkMode ? 'text-white visited:text-white' : 'text-black visited:text-black',
          className,
        )}
      >
        {children}
      </Link>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/GitHubIssues/index.tsx
Signals: React

```typescript
import React, { useEffect, useState, useRef } from 'react';
import { Search, ArrowUpDown, Plus, MessageSquare } from 'lucide-react';
import styles from './styles.module.css';

interface GitHubIssue {
  number: number;
  title: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  comments: number;
  reactions: {
    '+1': number;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
}

interface GitHubIssuesProps {
  repo: string;
  label?: string;
  maxIssues?: number;
}

export default function GitHubIssues({
  repo = 'mlflow/mlflow',
  label = 'domain/genai',
  maxIssues = 10,
}: GitHubIssuesProps): JSX.Element {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'reactions' | 'created'>('reactions');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query with optional search
        let query = `repo:${repo} is:issue state:open label:${label}`;
        if (searchQuery.trim()) {
          query += ` ${searchQuery.trim()}`;
        }

        const sortParam = sortBy === 'reactions' ? 'reactions' : 'created';
        const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=${sortParam}&order=desc&per_page=${maxIssues}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch issues');
        }

        const data = await response.json();
        setIssues(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchIssues();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [repo, label, maxIssues, searchQuery, sortBy]);

  // Close sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };

    if (showSortMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortMenu]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Feature requests</h3>
        </div>
        <div className={styles.loading}>Loading feature requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Feature requests</h3>
        </div>
        <div className={styles.error}>
          <p>Unable to load issues. Please visit GitHub directly:</p>
          <a
            href={`https://github.com/${repo}/issues?q=is%3Aissue+state%3Aopen+label%3A${label}+sort%3Areactions-%2B1-desc`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.errorLink}
          >
            View on GitHub →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Feature requests</h3>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.sortDropdown} ref={sortMenuRef}>
            <button className={styles.sortButton} onClick={() => setShowSortMenu(!showSortMenu)}>
              <ArrowUpDown size={16} />
              {sortBy === 'reactions' ? 'Upvotes' : 'Recent'}
            </button>
            {showSortMenu && (
              <div className={styles.sortMenu}>
                <button
                  className={sortBy === 'reactions' ? styles.sortMenuItemActive : styles.sortMenuItem}
                  onClick={() => {
                    setSortBy('reactions');
                    setShowSortMenu(false);
                  }}
                >
                  Upvotes
                </button>
                <button
                  className={sortBy === 'created' ? styles.sortMenuItemActive : styles.sortMenuItem}
                  onClick={() => {
                    setSortBy('created');
                    setShowSortMenu(false);
                  }}
                >
                  Recent
                </button>
              </div>
            )}
          </div>
          <a
            href={`https://github.com/${repo}/issues/new?template=feature_request_template.yaml`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.newButton}
          >
            <Plus size={16} />
            New
          </a>
        </div>
      </div>

      <div className={styles.issuesList}>
        {issues.map((issue) => (
          <a
            key={issue.number}
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.issueRow}
          >
            <div className={styles.voteColumn}>
              <div className={styles.voteCount}>{issue.reactions['+1']}</div>
              <div className={styles.voteLabel}>votes</div>
            </div>

            <div className={styles.issueContent}>
              <div className={styles.issueTitle}>{issue.title}</div>
              <div className={styles.issueMeta}>
                <span className={styles.author}>{issue.user.login}</span>
                <span className={styles.separator}>•</span>
                <span className={styles.date}>{formatDate(issue.created_at)}</span>
                {issue.comments > 0 && (
                  <>
                    <span className={styles.separator}>•</span>
                    <span className={styles.comments}>
                      <MessageSquare size={14} />
                      {issue.comments}
                    </span>
                  </>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className={styles.footer}>
        <a
          href={`https://github.com/${repo}/issues?q=is%3Aissue+state%3Aopen+label%3A${label}+sort%3Areactions-%2B1-desc`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewAllLink}
        >
          View all on GitHub →
        </a>
      </div>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: styles.module.css]---
Location: mlflow-master/docs/src/components/GitHubIssues/styles.module.css

```text
.container {
  width: 100%;
  margin: 20px 0;
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 8px;
  background: var(--ifm-background-surface-color);
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--ifm-color-emphasis-300);
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--ifm-font-color-base);
}

.headerActions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.searchBox {
  position: relative;
  display: flex;
  align-items: center;
}

.searchIcon {
  position: absolute;
  left: 10px;
  color: var(--ifm-color-emphasis-600);
  pointer-events: none;
}

.searchInput {
  padding: 6px 12px 6px 32px;
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 6px;
  font-size: 14px;
  background: var(--ifm-background-surface-color);
  color: var(--ifm-font-color-base);
  outline: none;
  transition: all 0.2s;
  width: 200px;
}

.searchInput:focus {
  border-color: var(--ifm-color-primary);
  box-shadow: 0 0 0 2px rgba(53, 120, 229, 0.1);
}

.searchInput::placeholder {
  color: var(--ifm-color-emphasis-600);
}

.sortDropdown {
  position: relative;
}

.sortButton,
.newButton {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--ifm-color-emphasis-300);
  background: var(--ifm-background-surface-color);
  color: var(--ifm-font-color-base);
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.sortButton:hover,
.newButton:hover {
  background: var(--ifm-color-emphasis-100);
  border-color: var(--ifm-color-emphasis-400);
}

.sortButton svg,
.newButton svg {
  flex-shrink: 0;
}

.sortMenu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 120px;
  background: var(--ifm-background-surface-color);
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
}

.sortMenuItem,
.sortMenuItemActive {
  display: block;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  border: none;
  background: none;
  color: var(--ifm-font-color-base);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.sortMenuItem:hover {
  background: var(--ifm-color-emphasis-100);
}

.sortMenuItemActive {
  background: var(--ifm-color-primary-lightest);
  color: var(--ifm-color-primary-dark);
  font-weight: 600;
}

.sortMenuItemActive:hover {
  background: var(--ifm-color-primary-lighter);
}

.loading,
.error {
  text-align: center;
  padding: 40px 20px;
}

.error {
  color: var(--ifm-color-danger);
}

.errorLink {
  display: inline-block;
  margin-top: 12px;
  color: var(--ifm-color-primary);
  text-decoration: none;
  font-weight: 600;
}

.errorLink:hover {
  text-decoration: underline;
}

.issuesList {
  display: flex;
  flex-direction: column;
}

.issueRow {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--ifm-color-emphasis-200);
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
}

.issueRow:last-child {
  border-bottom: none;
}

.issueRow:hover {
  background-color: var(--ifm-color-emphasis-100);
}

.voteColumn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  flex-shrink: 0;
}

.voteCount {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--ifm-font-color-base);
}

.voteLabel {
  font-size: 12px;
  color: var(--ifm-color-emphasis-600);
  margin-top: 2px;
}

.issueContent {
  flex: 1;
  min-width: 0;
}

.issueTitle {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--ifm-font-color-base);
  margin-bottom: 6px;
  word-wrap: break-word;
}

.issueMeta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--ifm-color-emphasis-700);
}

.author {
  color: var(--ifm-color-emphasis-700);
}

.separator {
  color: var(--ifm-color-emphasis-500);
}

.date {
  color: var(--ifm-color-emphasis-600);
}

.comments {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--ifm-color-emphasis-700);
}

.comments svg {
  flex-shrink: 0;
  opacity: 0.7;
}

.label {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--ifm-color-emphasis-200);
  color: var(--ifm-color-emphasis-800);
  font-weight: 500;
}

.footer {
  padding: 12px 20px;
  border-top: 1px solid var(--ifm-color-emphasis-300);
  text-align: center;
  background: var(--ifm-color-emphasis-50);
}

.viewAllLink {
  display: inline-block;
  color: var(--ifm-color-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.viewAllLink:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .headerActions {
    width: 100%;
    flex-wrap: wrap;
    gap: 8px;
  }

  .searchBox {
    flex: 1;
    min-width: 200px;
  }

  .searchInput {
    width: 100%;
  }

  .issueRow {
    flex-direction: column;
    gap: 12px;
  }

  .voteColumn {
    flex-direction: row;
    gap: 8px;
    min-width: auto;
  }

  .voteLabel::before {
    content: ' ';
  }

  .issueMeta {
    font-size: 12px;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: GlossyCard.tsx]---
Location: mlflow-master/docs/src/components/GlossyCard/GlossyCard.tsx
Signals: React

```typescript
import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './GlossyCard.module.css';

interface GlossyCardProps {
  /**
   * The title displayed in the card header
   */
  title: string;

  /**
   * Descriptive text for the card content
   */
  description: string;

  /**
   * Color theme for the card ('blue' or 'red')
   */
  colorTheme: 'blue' | 'red';

  /**
   * The URL that the card button will link to
   */
  linkPath: string;

  /**
   * Custom text for the card button (default: "View documentation")
   */
  buttonText?: string;

  /**
   * Additional CSS class names to apply to the card
   */
  className?: string;

  /**
   * Optional icon to display next to the title
   */
  icon?: React.ReactNode;
}

export const GlossyCard: React.FC<GlossyCardProps> = ({
  title,
  description,
  colorTheme,
  linkPath,
  buttonText = 'View documentation',
  className,
  icon,
}) => {
  const colorClass = colorTheme === 'blue' ? 'blueTheme' : 'redTheme';

  return (
    <div className={clsx(styles.glossyCard, className)}>
      <div className={styles.glossyCardContent}>
        <div className={styles.cardHeader}>
          <div className={clsx(styles.colorBlock, styles[colorClass])}></div>
          {icon && <div className={styles.cardIcon}>{icon}</div>}
          <h2 className={styles.cardTitle}>{title}</h2>
        </div>

        <p className={styles.cardDescription}>{description}</p>

        <div className={styles.cardAction}>
          <Link to={linkPath} className={clsx(styles.cardButton, styles[`${colorClass}Button`])}>
            {buttonText} <span className={styles.arrowIcon}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GlossyCard;
```

--------------------------------------------------------------------------------

---[FILE: GradientWrapper.tsx]---
Location: mlflow-master/docs/src/components/GradientWrapper/GradientWrapper.tsx
Signals: React

```typescript
import { cx } from 'class-variance-authority';
import type { CSSProperties, PropsWithChildren } from 'react';

export type Variant = 'blue' | 'red' | 'colorful';
type Direction = 'up' | 'down';

function getColors(variant: Variant) {
  switch (variant) {
    case 'blue':
      return {
        center: 'oklch(0.7533 0.11 216.4)',
        left: 'navy 40%',
        right: 'teal 40%',
      };
    case 'red':
      return {
        center: 'oklch(0.6 0.22 30.59)',
        left: 'black 10%',
        right: 'oklch(0.91 0.09 326.28) 40%',
      };
    case 'colorful':
      return {
        center: 'var(--color-brand-red)',
        left: 'oklch(0.33 0.15 328.37) 80%',
        right: 'oklch(0.66 0.17 248.82) 100%',
      };
  }
}

export function getGradientStyles(
  variant: Variant,
  direction: Direction = 'up',
  isFooter: boolean,
  height?: number,
): CSSProperties {
  const colors = getColors(variant);
  return {
    position: 'absolute',
    width: '100%',
    [isFooter ? 'bottom' : 'top']: 0,
    pointerEvents: 'none',
    maskComposite: 'intersect',
    height,
    backgroundImage: `
      repeating-linear-gradient(
        to right,
        rgba(0, 0, 0, 0.05),
        rgba(0, 0, 0, 0.25) ${direction === 'down' ? '24px' : '18px'},
        transparent 2px,
        transparent 10px
      ),
      radial-gradient(
        circle at ${direction === 'down' ? 'top' : 'bottom'} center,
        ${colors.center} 0%,
        transparent 60%
      ),
      linear-gradient(to right, color-mix(in srgb, ${colors.center}, ${colors.left}), color-mix(in srgb, ${colors.center}, ${colors.right}))
    `,
    maskImage: `
      ${isFooter ? 'radial-gradient(ellipse at center bottom, black 60%, transparent 80%),' : ''}
      linear-gradient(to ${direction === 'down' ? 'bottom' : 'top'}, black ${direction === 'down' ? '40%' : '10%'}, transparent ${direction === 'down' ? '90%' : '40%'})
    `,
  };
}

type Props = PropsWithChildren<{
  element?: keyof HTMLElementTagNameMap;
  variant: Variant;
  direction?: Direction;
  isFooter?: boolean;
  height?: number;
  className?: string;
}>;

export function GradientWrapper({
  element: Element = 'div',
  variant,
  direction = 'up',
  isFooter = false,
  children,
  height,
  className,
}: Props) {
  return (
    <Element className={cx('relative', className)}>
      <div style={getGradientStyles(variant, direction, isFooter, height)} />
      <div className="z-1">{children}</div>
    </Element>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/HomepageFeatures/index.tsx

```typescript
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/images/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and used to get your website up and running
        quickly.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/images/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go ahead and move your docs into the{' '}
        <code>docs</code> directory.
      </>
    ),
  },
  {
    title: 'Powered by React',
    Svg: require('@site/static/images/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can be extended while reusing the same
        header and footer.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: styles.module.css]---
Location: mlflow-master/docs/src/components/HomepageFeatures/styles.module.css

```text
.features {
  display: flex;
  align-items: center;
  padding: 2rem 0;
  width: 100%;
}

.featureSvg {
  height: 200px;
  width: 200px;
}
```

--------------------------------------------------------------------------------

---[FILE: ImageBox.module.css]---
Location: mlflow-master/docs/src/components/ImageBox/ImageBox.module.css

```text
.container {
  margin: var(--padding-lg) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.imageWrapper {
  display: inline-block;
}

.image {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  border: 1px solid var(--ifm-color-gray-300);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease-in-out;
  display: block;
}

.image:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] .image {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

[data-theme='dark'] .image:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.caption {
  margin-top: var(--padding-sm);
  font-size: 0.9em;
  color: var(--ifm-color-secondary);
  text-align: center;
  font-style: italic;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/ImageBox/index.tsx
Signals: React

```typescript
import React from 'react';
import styles from './ImageBox.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface ImageBoxProps {
  src: string;
  alt: string;
  width?: string;
  caption?: string;
  className?: string;
}

export default function ImageBox({ src, alt, width, caption, className }: ImageBoxProps) {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.imageWrapper} style={width ? { width } : {}}>
        <img src={useBaseUrl(src)} alt={alt} className={styles.image} />
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: DocsDropdown.module.css]---
Location: mlflow-master/docs/src/components/NavbarItems/DocsDropdown.module.css

```text
.docsDropdown {
  display: flex;
  align-items: center;
  gap: 4px;
}

.docsDropdown::after {
  top: 4px !important;
}

@media (max-width: 996px) {
  .dropdownCircle {
    display: none;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DocsDropdown.tsx]---
Location: mlflow-master/docs/src/components/NavbarItems/DocsDropdown.tsx

```typescript
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useLocation } from '@docusaurus/router';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import styles from './DocsDropdown.module.css';

type Section = 'genai' | 'ml' | 'default';

interface DocsDropdownProps {
  mobile?: boolean;
  position?: 'left' | 'right';
  items: any[];
  label?: string;
  [key: string]: any;
}

export default function DocsDropdown({
  mobile,
  items: configItems,
  label: configLabel,
  ...props
}: DocsDropdownProps): JSX.Element {
  const location = useLocation();

  const getCurrentSection = (): Section => {
    const path = location.pathname;
    const genaiPath = useBaseUrl('/genai');
    const mlPath = useBaseUrl('/ml');
    if (path.startsWith(genaiPath)) {
      return 'genai';
    } else if (path.startsWith(mlPath)) {
      return 'ml';
    }
    return 'default';
  };

  const currentSection = getCurrentSection();

  const getLabel = (): JSX.Element => {
    let color;
    let text = configLabel || 'Documentation';

    if (currentSection === 'genai') {
      color = 'var(--genai-color-primary)';
      text = 'GenAI Docs';
    } else if (currentSection === 'ml') {
      color = 'var(--ml-color-primary)';
      text = 'ML Docs';
    }

    return (
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        {color && (
          <div
            className={styles.dropdownCircle}
            style={{
              width: 10,
              height: 10,
              backgroundColor: color,
              borderRadius: 4,
            }}
          />
        )}
        {text}
      </div>
    );
  };

  const enhancedItems = configItems.map((item) => {
    if (item.docsPluginId === 'classic-ml') {
      return {
        ...item,
        label: (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div
              style={{
                width: 10,
                height: 10,
                backgroundColor: 'var(--ml-color-primary)',
                borderRadius: 4,
              }}
            />
            {item.label}
          </div>
        ),
      };
    } else if (item.docsPluginId === 'genai') {
      return {
        ...item,
        label: (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div
              style={{
                width: 10,
                height: 10,
                backgroundColor: 'var(--genai-color-primary)',
                borderRadius: 4,
              }}
            />
            {item.label}
          </div>
        ),
      };
    }
    return item;
  });

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={getLabel()}
      items={enhancedItems}
      className={styles.docsDropdown}
      data-active={currentSection !== 'default' ? currentSection : undefined}
    />
  );
}
```

--------------------------------------------------------------------------------

````
