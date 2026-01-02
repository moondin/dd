---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 146
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 146 of 991)

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

---[FILE: VersionSelector.tsx]---
Location: mlflow-master/docs/src/components/NavbarItems/VersionSelector.tsx
Signals: React

```typescript
import React, { useState, useEffect } from 'react';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { LinkLikeNavbarItemProps } from '@theme/NavbarItem';

interface VersionSelectorProps {
  mobile?: boolean;
  position?: 'left' | 'right';
  label?: string;
  [key: string]: any;
}

function getLabel(currentVersion: string, versions: string[]): string {
  if (currentVersion === 'latest' && versions.length > 0) {
    // version list is sorted in descending order, so the first one is the latest
    return `Version: ${versions[0]} (latest)`;
  }

  return `Version: ${currentVersion}`;
}

function VersionSelectorImpl({ mobile, label = 'Version', ...props }: VersionSelectorProps): JSX.Element {
  const [versions, setVersions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const versionsUrl = window.location.origin + '/docs/versions.json';

  // Determine current version from URL or default to latest
  const docPath = window.location.pathname;
  const currentVersion = docPath.match(/^\/docs\/([a-zA-Z0-9.]+)/)?.[1];

  const versionItems: LinkLikeNavbarItemProps[] = versions?.map((version) => ({
    type: 'default',
    label: version,
    to: window.location.origin + `/docs/${version}/`,
    target: '_self',
  }));

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await fetch(versionsUrl);
        const data = await response.json();
        if (data['versions'] != null) {
          setVersions(data['versions']);
        }
      } catch (error) {
        // do nothing, this can happen in dev where the versions.json file is not available
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [versionsUrl]);

  if (loading || versions == null || versions.length === 0) {
    return null;
  }

  return (
    <DropdownNavbarItem {...props} mobile={mobile} label={getLabel(currentVersion, versions)} items={versionItems} />
  );
}

export default function VersionSelector(props: VersionSelectorProps): JSX.Element {
  return <BrowserOnly>{() => <VersionSelectorImpl {...props} />}</BrowserOnly>;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/NotebookCellOutput/index.tsx

```typescript
export const NotebookCellOutput = ({ children, isStderr }): JSX.Element => (
  <pre
    style={{
      margin: 0,
      borderRadius: 0,
      background: 'none',
      fontSize: '0.85rem',
      flexGrow: 1,
      padding: `var(--padding-sm)`,
    }}
  >
    {children}
  </pre>
);
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/NotebookCodeCell/index.tsx

```typescript
import CodeBlock from '@theme/CodeBlock';
import styles from './styles.module.css';

export const NotebookCodeCell = ({ children, executionCount }): JSX.Element => (
  <div
    style={{
      flexGrow: 1,
      minWidth: 0,
      marginTop: 'var(--padding-md)',
      width: '100%',
    }}
  >
    <CodeBlock className={styles.codeBlock} language="python">
      {children}
    </CodeBlock>
  </div>
);
```

--------------------------------------------------------------------------------

---[FILE: styles.module.css]---
Location: mlflow-master/docs/src/components/NotebookCodeCell/styles.module.css

```text
.codeBlock {
  margin: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/NotebookDownloadButton/index.tsx
Signals: React

```typescript
import { MouseEvent, ReactNode, useCallback } from 'react';
import { Version } from '@site/src/constants';

interface NotebookDownloadButtonProps {
  children: ReactNode;
  href: string;
}

export function NotebookDownloadButton({ children, href }: NotebookDownloadButtonProps) {
  const handleClick = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();

      if ((window as any).gtag) {
        try {
          (window as any).gtag('event', 'notebook-download', {
            href,
          });
        } catch {
          // do nothing if the gtag call fails
        }
      }

      if (!Version.includes('dev')) {
        // Replace 'master' with the current version to pin the download to the released version
        // and avoid 404 errors
        href = href.replace(/\/master\//, `/v${Version}/`);
      }

      const response = await fetch(href);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      const filename = href.split('/').pop();
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    },
    [href],
  );

  return (
    <a
      className="button button--primary"
      style={{ marginBottom: '1rem', display: 'block', width: 'min-content' }}
      href={href}
      download
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/NotebookHTMLOutput/index.tsx

```typescript
export const NotebookHTMLOutput = ({ children }): JSX.Element => (
  <div style={{ flexGrow: 1, minWidth: 0, fontSize: '0.8rem', width: '100%' }}>{children}</div>
);
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/SearchBox/index.tsx
Signals: React

```typescript
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface SearchBoxProps {
  /**
   * Placeholder text for the button
   */
  placeholder?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export default function SearchBox({
  placeholder = 'What do you want to learn?',
  className,
}: SearchBoxProps): JSX.Element {
  const openRunLLM = () => {
    // Open RunLLM widget when user clicks the input
    if (typeof window !== 'undefined' && (window as any).runllm) {
      (window as any).runllm.open();
    }
  };

  return (
    <div className={clsx(styles.searchContainer, className)}>
      <div className={styles.searchWrapper}>
        <input type="text" className={styles.searchInput} placeholder={placeholder} onClick={openRunLLM} readOnly />
        <button type="button" className={styles.searchButton} onClick={openRunLLM}>
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: styles.module.css]---
Location: mlflow-master/docs/src/components/SearchBox/styles.module.css

```text
.searchContainer {
  position: relative;
  max-width: 500px;
  width: 100%;
}

.searchWrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.searchInput {
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  border: 2px solid var(--ifm-border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--ifm-background-color);
  color: var(--ifm-color-emphasis-hover);
  transition: all 0.2s ease;
  opacity: 0.7;
}

.searchInput:focus {
  outline: none;
  border-color: #0194e2;
  box-shadow: 0 0 0 3px rgba(1, 148, 226, 0.1);
  opacity: 1;
}

.searchInput::placeholder {
  color: var(--ifm-border-color);
}

.searchButton {
  position: absolute;
  right: 0.5rem;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: var(--ifm-border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  border-radius: 4px;
}

.searchButton:hover:not(:disabled) {
  color: #0194e2;
  background: rgba(1, 148, 226, 0.1);
}

/* Hide SearchBox on mobile devices */
@media (max-width: 768px) {
  .searchContainer {
    display: none;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/Table/index.tsx
Signals: React

```typescript
import { PropsWithChildren } from 'react';

export function Table({ children }: PropsWithChildren) {
  return (
    <div className="w-full overflow-x-auto">
      <table>{children}</table>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/TabsWrapper/index.tsx
Signals: React

```typescript
import React from 'react';
import styles from './TabsWrapper.module.css';

interface TabsWrapperProps {
  children: React.ReactNode;
}

export default function TabsWrapper({ children }: TabsWrapperProps) {
  return <div className={styles.wrapper}>{children}</div>;
}
```

--------------------------------------------------------------------------------

---[FILE: TabsWrapper.module.css]---
Location: mlflow-master/docs/src/components/TabsWrapper/TabsWrapper.module.css

```text
.wrapper {
  padding: var(--padding-lg);
  border: 1px solid var(--ifm-color-gray-400);
  border-radius: 12px;
  margin: var(--padding-lg) 0;
  background: var(--ifm-background-surface-color);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease-in-out;
}

.wrapper:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] .wrapper {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

[data-theme='dark'] .wrapper:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.wrapper img {
  border-radius: 12px;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/TileCard/index.tsx
Signals: React

```typescript
import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';

export interface TileCardProps {
  /**
   * The icon component to display at the top of the card (optional if image is provided)
   */
  icon?: LucideIcon;
  /**
   * The image source to display at the top of the card (optional if icon is provided)
   */
  image?: string;
  /**
   * The dark mode image source (optional, defaults to image if not provided)
   */
  imageDark?: string;
  /**
   * The width of the image in pixels (optional)
   */
  imageWidth?: number;
  /**
   * The height of the image in pixels (optional)
   */
  imageHeight?: number;
  /**
   * The size of the icon (default: 32) - only used when icon is provided
   */
  iconSize?: number;
  /**
   * The height of the icon/image container in pixels (optional)
   */
  containerHeight?: number;
  /**
   * The title of the card
   */
  title: string;
  /**
   * The description text
   */
  description: string;
  /**
   * The href for the link
   */
  href: string;
  /**
   * The link text (default: "Learn more →")
   */
  linkText?: string;
  /**
   * Additional CSS classes for the card
   */
  className?: string;
}

/**
 * A reusable tile card component for displaying feature cards with icon, title, description and link
 */
export default function TileCard({
  icon: Icon,
  image,
  imageDark,
  imageWidth,
  imageHeight,
  iconSize = 32,
  containerHeight,
  title,
  description,
  href,
  linkText = 'Learn more →',
  className,
}: TileCardProps): JSX.Element {
  // Ensure either icon or image is provided
  if (!Icon && !image) {
    throw new Error('TileCard requires either an icon or image prop');
  }

  const containerStyle = containerHeight ? { height: `${containerHeight}px` } : {};
  const imageStyle: React.CSSProperties = {};
  if (imageWidth) imageStyle.width = `${imageWidth}px`;
  if (imageHeight) imageStyle.height = `${imageHeight}px`;

  return (
    <Link href={href} className={clsx(styles.tileCard, className)}>
      <div className={styles.tileIcon} style={containerStyle}>
        {Icon ? (
          <Icon size={iconSize} />
        ) : imageDark ? (
          <ThemedImage
            sources={{
              light: useBaseUrl(image),
              dark: useBaseUrl(imageDark),
            }}
            alt={title}
            className={styles.tileImage}
            style={imageStyle}
          />
        ) : (
          <img src={useBaseUrl(image)} alt={title} className={styles.tileImage} style={imageStyle} />
        )}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={styles.tileLink}>{linkText}</div>
    </Link>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: styles.module.css]---
Location: mlflow-master/docs/src/components/TileCard/styles.module.css

```text
.tileCard {
  background: var(--ifm-background-color);
  border: 1px solid var(--ifm-border-color);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tileCard:hover {
  transform: translateY(-4px);
  box-shadow: var(--ifm-shadow-tile-hover);
  border-color: #0194e2;
}

.tileCard:hover .tileIcon {
  transform: scale(1.1);
}

.tileIcon {
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #0194e2;
}

.tileCard h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--ifm-color-emphasis-hover);
}

.tileCard p {
  color: var(--ifm-border-color);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.tileLink {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #0194e2;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.tileLink:hover {
  color: #0066cc;
  text-decoration: none;
}

.tileImage {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  object-fit: contain;
  background: transparent;
}

/* Add subtle background for X logo for better contrast */
.tileCard[href*='x.com'] .tileImage {
  background: rgba(128, 128, 128, 0.1);
  border-radius: 8px;
  padding: 6px;
}

/* Dark mode specific styling for X logo */
[data-theme='dark'] .tileCard[href*='x.com'] .tileImage {
  background: rgba(255, 255, 255, 0.08);
}

/* Dark mode adjustments for deep learning framework logos */
/* PyTorch logo - has black text, needs inversion */
[data-theme='dark'] .tileCard[href*='pytorch'] .tileImage {
  filter: invert(1) hue-rotate(180deg);
  background: transparent;
}

/* TensorFlow logo - has dark text, needs inversion */
[data-theme='dark'] .tileCard[href*='tensorflow'] .tileImage {
  filter: invert(1) hue-rotate(180deg);
  background: transparent;
}

/* spaCy logo - bright blue, just needs brightening */
[data-theme='dark'] .tileCard[href*='spacy'] .tileImage {
  filter: brightness(1.3);
  background: transparent;
}

/* HuggingFace/Transformers logo - now using proper dark mode SVG */
[data-theme='dark'] .tileCard[href*='transformers'] .tileImage {
  background: transparent;
}

/* Sentence Transformers logo */
[data-theme='dark'] .tileCard[href*='sentence-transformers'] .tileImage {
  filter: brightness(1.5);
  background: transparent;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/TilesGrid/index.tsx
Signals: React

```typescript
import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface TilesGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function TilesGrid({ children, className }: TilesGridProps): JSX.Element {
  return <div className={clsx(styles.tilesGrid, className)}>{children}</div>;
}
```

--------------------------------------------------------------------------------

---[FILE: styles.module.css]---
Location: mlflow-master/docs/src/components/TilesGrid/styles.module.css

```text
.tilesGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 996px) {
  .tilesGrid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .tilesGrid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/TracingIntegrations/index.tsx
Signals: React

```typescript
import React from 'react';
import { CardGroup, SmallLogoCard } from '../Card';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TabsWrapper from '../TabsWrapper';

interface TracingIntegration {
  id: string;
  name: string;
  logoPath: string;
  link: string;
  category: string;
  languages: ('python' | 'typescript')[];
}

// Centralized integration definitions with categories
const TRACING_INTEGRATIONS: TracingIntegration[] = [
  // Agent Frameworks
  {
    id: 'langchain',
    name: 'LangChain',
    logoPath: '/images/logos/langchain-logo.png',
    link: '/genai/tracing/integrations/listing/langchain',
    category: 'Agent Frameworks',
    languages: ['python', 'typescript'],
  },
  {
    id: 'langgraph',
    name: 'LangGraph',
    logoPath: '/images/logos/langgraph-logo.png',
    link: '/genai/tracing/integrations/listing/langgraph',
    category: 'Agent Frameworks',
    languages: ['python', 'typescript'],
  },
  {
    id: 'vercelai',
    name: 'Vercel AI SDK',
    logoPath: '/images/logos/vercel-logo.svg',
    link: '/genai/tracing/integrations/listing/vercelai',
    category: 'Agent Frameworks',
    languages: ['typescript'],
  },
  {
    id: 'openai-agent',
    name: 'OpenAI Agent',
    logoPath: '/images/logos/openai-agent-logo.png',
    link: '/genai/tracing/integrations/listing/openai-agent',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  {
    id: 'dspy',
    name: 'DSPy',
    logoPath: '/images/logos/dspy-logo.png',
    link: '/genai/tracing/integrations/listing/dspy',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  {
    id: 'pydantic_ai',
    name: 'PydanticAI',
    logoPath: '/images/logos/pydanticai-logo.png',
    link: '/genai/tracing/integrations/listing/pydantic_ai',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  {
    id: 'google-adk',
    name: 'Google ADK',
    logoPath: '/images/logos/google-adk-logo.png',
    link: '/genai/tracing/integrations/listing/google-adk',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  {
    id: 'microsoft-agent-framework',
    name: 'Microsoft Agent Framework',
    logoPath: '/images/logos/microsoft-agent-framework-logo.jpg',
    link: '/genai/tracing/integrations/listing/microsoft-agent-framework',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  {
    id: 'crewai',
    name: 'CrewAI',
    logoPath: '/images/logos/crewai-logo.png',
    link: '/genai/tracing/integrations/listing/crewai',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  {
    id: 'llama_index',
    name: 'LlamaIndex',
    logoPath: '/images/logos/llamaindex-logo.svg',
    link: '/genai/tracing/integrations/listing/llama_index',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  {
    id: 'autogen',
    name: 'AutoGen',
    logoPath: '/images/logos/autogen-logo.png',
    link: '/genai/tracing/integrations/listing/autogen',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  {
    id: 'strands',
    name: 'Strands Agent SDK',
    logoPath: '/images/logos/strands-logo.png',
    link: '/genai/tracing/integrations/listing/strands',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  {
    id: 'mastra',
    name: 'Mastra',
    logoPath: '/images/logos/mastra-logo.png',
    link: '/genai/tracing/integrations/listing/mastra',
    category: 'Agent Frameworks',
    languages: ['typescript'],
  },
  {
    id: 'voltagent',
    name: 'VoltAgent',
    logoPath: '/images/logos/voltagent-logo.png',
    link: '/genai/tracing/integrations/listing/voltagent',
    category: 'Agent Frameworks',
    languages: ['typescript'],
  },
  {
    id: 'agno',
    name: 'Agno',
    logoPath: '/images/logos/agno-logo.png',
    link: '/genai/tracing/integrations/listing/agno',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  {
    id: 'smolagents',
    name: 'Smolagents',
    logoPath: '/images/logos/smolagents-logo.png',
    link: '/genai/tracing/integrations/listing/smolagents',
    category: 'Agent Frameworks',
    languages: ['python'],
  },

  {
    id: 'semantic_kernel',
    name: 'Semantic Kernel',
    logoPath: '/images/logos/semantic-kernel-logo.png',
    link: '/genai/tracing/integrations/listing/semantic_kernel',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  {
    id: 'ag2',
    name: 'AG2',
    logoPath: '/images/logos/ag2-logo.png',
    link: '/genai/tracing/integrations/listing/ag2',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  {
    id: 'haystack',
    name: 'Haystack',
    logoPath: '/images/logos/haystack-logo.png',
    link: '/genai/tracing/integrations/listing/haystack',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  {
    id: 'instructor',
    name: 'Instructor',
    logoPath: '/images/logos/instructor-logo.svg',
    link: '/genai/tracing/integrations/listing/instructor',
    category: 'Tools',
    languages: ['python'],
  },
  {
    id: 'txtai',
    name: 'txtai',
    logoPath: '/images/logos/txtai-logo.png',
    link: '/genai/tracing/integrations/listing/txtai',
    category: 'Agent Frameworks',
    languages: ['python'],
  },
  // Model Providers
  {
    id: 'openai',
    name: 'OpenAI',
    logoPath: '/images/logos/openai-logo.png',
    link: '/genai/tracing/integrations/listing/openai',
    category: 'Model Providers',
    languages: ['python', 'typescript'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    logoPath: '/images/logos/anthropic-logo.svg',
    link: '/genai/tracing/integrations/listing/anthropic',
    category: 'Model Providers',
    languages: ['python', 'typescript'],
  },
  {
    id: 'bedrock',
    name: 'Bedrock',
    logoPath: '/images/logos/bedrock-logo.png',
    link: '/genai/tracing/integrations/listing/bedrock',
    category: 'Model Providers',
    languages: ['python'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    logoPath: '/images/logos/google-gemini-logo.svg',
    link: '/genai/tracing/integrations/listing/gemini',
    category: 'Model Providers',
    languages: ['python', 'typescript'],
  },
  {
    id: 'ollama',
    name: 'Ollama',
    logoPath: '/images/logos/ollama-logo.png',
    link: '/genai/tracing/integrations/listing/ollama',
    category: 'Model Providers',
    languages: ['python'],
  },
  {
    id: 'groq',
    name: 'Groq',
    logoPath: '/images/logos/groq-logo.svg',
    link: '/genai/tracing/integrations/listing/groq',
    category: 'Model Providers',
    languages: ['python'],
  },
  {
    id: 'mistral',
    name: 'Mistral',
    logoPath: '/images/logos/mistral-ai-logo.svg',
    link: '/genai/tracing/integrations/listing/mistral',
    category: 'Model Providers',
    languages: ['python'],
  },
  {
    id: 'fireworksai',
    name: 'FireworksAI',
    logoPath: '/images/logos/fireworks-ai-logo.svg',
    link: '/genai/tracing/integrations/listing/fireworksai',
    category: 'Model Providers',
    languages: ['python'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    logoPath: '/images/logos/deepseek-logo.png',
    link: '/genai/tracing/integrations/listing/deepseek',
    category: 'Model Providers',
    languages: ['python'],
  },
  {
    id: 'litellm',
    name: 'LiteLLM',
    logoPath: '/images/logos/litellm-logo.jpg',
    link: '/genai/tracing/integrations/listing/litellm',
    category: 'Model Providers',
    languages: ['python'],
  },
  // Tools
  {
    id: 'claude_code',
    name: 'Claude Code',
    logoPath: '/images/logos/claude-code-logo.svg',
    link: '/genai/tracing/integrations/listing/claude_code',
    category: 'Tools',
    languages: ['python'],
  },
];

interface TracingIntegrationsProps {
  cardGroupProps?: {
    isSmall?: boolean;
    cols?: number;
    noGap?: boolean;
  };
  categorized?: boolean;
}

const IntegrationContent: React.FC<{
  integrations: TracingIntegration[];
  cardGroupProps: TracingIntegrationsProps['cardGroupProps'];
  categorized: boolean;
}> = ({ integrations, cardGroupProps = {}, categorized }) => {
  if (categorized) {
    // Group integrations by category
    const categories = integrations.reduce(
      (acc, integration) => {
        if (!acc[integration.category]) {
          acc[integration.category] = [];
        }
        acc[integration.category].push(integration);
        return acc;
      },
      {} as Record<string, TracingIntegration[]>,
    );

    // Define category order
    const categoryOrder = ['Agent Frameworks', 'Model Providers', 'Tools'];

    return (
      <>
        {categoryOrder.map((category) => {
          const categoryIntegrations = categories[category] || [];
          if (categoryIntegrations.length === 0) return null;

          return (
            <div key={category} style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{category}</h2>
              <CardGroup isSmall={cardGroupProps.isSmall} cols={cardGroupProps.cols} noGap={cardGroupProps.noGap}>
                {categoryIntegrations.map((integration) => (
                  <SmallLogoCard key={integration.id} link={integration.link}>
                    <span>
                      <img src={useBaseUrl(integration.logoPath)} alt={`${integration.name} Logo`} />
                    </span>
                  </SmallLogoCard>
                ))}
              </CardGroup>
            </div>
          );
        })}
      </>
    );
  }

  return (
    <CardGroup isSmall={cardGroupProps.isSmall} cols={cardGroupProps.cols} noGap={cardGroupProps.noGap}>
      {integrations.map((integration) => (
        <SmallLogoCard key={integration.id} link={integration.link}>
          <span>
            <img src={useBaseUrl(integration.logoPath)} alt={`${integration.name} Logo`} />
          </span>
        </SmallLogoCard>
      ))}
    </CardGroup>
  );
};

export const TracingIntegrations: React.FC<TracingIntegrationsProps> = ({
  cardGroupProps = {},
  categorized = false,
}) => {
  const pythonIntegrations = TRACING_INTEGRATIONS.filter((integration) => integration.languages.includes('python'));
  const typescriptIntegrations = TRACING_INTEGRATIONS.filter((integration) =>
    integration.languages.includes('typescript'),
  );

  return (
    <TabsWrapper>
      <Tabs groupId="programming-language">
        <TabItem value="python" label="Python" default>
          <IntegrationContent
            integrations={pythonIntegrations}
            cardGroupProps={cardGroupProps}
            categorized={categorized}
          />
        </TabItem>
        <TabItem value="typescript" label="TypeScript">
          <IntegrationContent
            integrations={typescriptIntegrations}
            cardGroupProps={cardGroupProps}
            categorized={categorized}
          />
        </TabItem>
      </Tabs>
    </TabsWrapper>
  );
};

export default TracingIntegrations;
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/TreeView/index.tsx

```typescript
type TreeViewItem = {
  name: string;
  items?: TreeViewItem[];
};

type TreeViewProps = {
  items?: TreeViewItem[];
};

export function TreeView({ items }: TreeViewProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ul style={{ fontSize: '1.25rem' }}>
      {items.map((i) => (
        <>
          <li className="badge badge--info">{i.name}</li>
          {i.items ? <TreeView items={i.items} /> : <br />}
        </>
      ))}
    </ul>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/components/WorkflowSteps/index.tsx
Signals: React

```typescript
import React from 'react';
import { LucideIcon } from 'lucide-react';
import styles from './styles.module.css';
import ImageBox from '../ImageBox';

interface WorkflowStep {
  title: string;
  description: string | React.ReactNode;
  icon?: LucideIcon;
}

interface WorkflowStepsProps {
  steps: WorkflowStep[];
  title?: string;
  screenshot?: {
    src: string;
    alt: string;
    width?: string;
  };
  width?: 'normal' | 'wide';
}

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({ steps, title, screenshot, width = 'normal' }) => {
  return (
    <div className={styles.workflowContainer}>
      {title && <h3 className={styles.workflowTitle}>{title}</h3>}
      {screenshot && (
        <div className={styles.screenshotContainer}>
          <ImageBox src={screenshot.src} alt={screenshot.alt} width={screenshot.width || '90%'} />
        </div>
      )}
      <div className={styles.stepsContainer} style={{ maxWidth: width === 'wide' ? '850px' : '700px' }}>
        {steps.map((step, index) => (
          <div key={index} className={styles.stepItem}>
            <div className={styles.stepIndicator}>
              <div className={styles.stepNumber}>
                {step.icon ? <step.icon size={16} /> : <span className={styles.stepNumberText}>{index + 1}</span>}
              </div>
              {index < steps.length - 1 && <div className={styles.stepConnector} />}
            </div>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>{step.title}</h4>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowSteps;
```

--------------------------------------------------------------------------------

---[FILE: styles.module.css]---
Location: mlflow-master/docs/src/components/WorkflowSteps/styles.module.css

```text
.workflowContainer {
  margin: 2rem 0;
}

.workflowTitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: var(--ifm-color-emphasis-900);
  text-align: center;
  font-weight: 600;
}

/* Layout containers */
.workflowStandalone {
  display: block;
}

.stepsContainer {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0 auto;
}

.screenshotContainer {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1.5rem;
  background: var(--ifm-background-surface-color);
  border-radius: 12px;
  border: 1px solid var(--ifm-color-emphasis-200);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.screenshotImage {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stepItem {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
}

.stepIndicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  position: relative;
}

.stepNumber {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0194e2;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  z-index: 2;
  position: relative;
}

.stepNumberText {
  line-height: 1;
}

.stepConnector {
  width: 2px;
  height: 3rem;
  background: #b3e0f7;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}

.stepContent {
  flex: 1;
  padding-bottom: 2rem;
}

.stepTitle {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--ifm-color-emphasis-900);
  line-height: 1.3;
}

.stepDescription {
  color: var(--ifm-color-emphasis-700);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

/* Remove connector from last step */
.stepItem:last-child .stepConnector {
  display: none;
}

.stepItem:last-child .stepContent {
  padding-bottom: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .screenshotContainer {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .stepsContainer {
    max-width: 100%;
    padding: 0 1rem;
  }

  .stepContent {
    padding-bottom: 1.5rem;
  }

  .stepNumber {
    width: 28px;
    height: 28px;
    font-size: 0.85rem;
  }

  .stepTitle {
    font-size: 1rem;
  }

  .stepDescription {
    font-size: 0.9rem;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: platform.mdx]---
Location: mlflow-master/docs/src/content/platform.mdx

```text
import { CardGroup, SmallLogoCard } from '@site/src/components/Card';

MLflow can be used in a variety of environments, including your local environment, on-premises clusters, cloud platforms, and managed services. Being an open-source platform, MLflow is **vendor-neutral**; no matter where you are doing machine learning, you have access to the MLflow's core capabilities sets such as tracking, evaluation, observability, and more.

<CardGroup cols={5}>
  <SmallLogoCard link="https://docs.databricks.com/aws/en/mlflow3/genai/">
    <span>![Databricks Logo](/images/logos/databricks-logo.png)</span>
  </SmallLogoCard>
  <SmallLogoCard link="https://aws.amazon.com/sagemaker-ai/experiments/">
    <span>![Amazon SageMaker Logo](/images/logos/amazon-sagemaker-logo.png)</span>
  </SmallLogoCard>
  <SmallLogoCard link="https://learn.microsoft.com/en-us/azure/machine-learning/concept-mlflow?view=azureml-api-2">
    <span>![Azure Machine Learning Logo](/images/logos/azure-ml-logo.png)</span>
  </SmallLogoCard>
  <SmallLogoCard link="https://nebius.com/services/managed-mlflow">
    <span>![Nebius Logo](/images/logos/nebius-logo.png)</span>
  </SmallLogoCard>
  <SmallLogoCard link="/ml/tracking">
    <span>![Kubernetes Logo](/images/logos/kubernetes-logo.png)</span>
  </SmallLogoCard>
</CardGroup>
```

--------------------------------------------------------------------------------

---[FILE: setup_server.mdx]---
Location: mlflow-master/docs/src/content/setup_server.mdx

```text
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TabsWrapper from '@site/src/components/TabsWrapper';

<TabsWrapper>
<Tabs>
<TabItem value="local" label="Local (pip)" default>

**Python Environment**: Python 3.10+

For the fastest setup, you can install the `mlflow` Python package via `pip` and start the MLflow server locally.

```bash
pip install --upgrade mlflow
mlflow server
```

</TabItem>

<TabItem value="docker" label="Local (docker)">

MLflow provides a Docker Compose file to start a local MLflow server with a postgres database and a minio server.

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/mlflow/mlflow.git
cd mlflow
git sparse-checkout set docker-compose
cd docker-compose
cp .env.dev.example .env
docker compose up -d
```

Refer to the [instruction](https://github.com/mlflow/mlflow/tree/master/docker-compose/README.md) for more details, e.g., overriding the default environment variables.

</TabItem>

</Tabs>
</TabsWrapper>
```

--------------------------------------------------------------------------------

````
