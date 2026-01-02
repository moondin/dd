---
source_txt: FULLSTACK_CODE_DATABASE_PART8_HOOKS_ADVANCED.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART8 HOOKS ADVANCED

## Verbatim Content

````text
================================================================================
FULLSTACK CODE DATABASE - PART 8: CUSTOM REACT HOOKS & ADVANCED PATTERNS
================================================================================
Generated: December 16, 2025
Source: thenewboston Website-development, webstudio-main
Tech Stack: React, TypeScript, React Router, tRPC
================================================================================

TABLE OF CONTENTS:
1. Custom React Hooks
2. tRPC Caller Link (HTTP-less tRPC)
3. Advanced Hook Patterns
4. Performance Optimization Hooks

================================================================================
1. CUSTOM REACT HOOKS
================================================================================

---[FILE: Boolean State Hook - useBooleanState.ts]---
Location: src/hooks/useBooleanState.ts
Purpose: Manage boolean state with helper functions

```typescript
import {useCallback, useState} from 'react';

const useBooleanState = (
  initialValue: boolean,
): [
  state: boolean, 
  toggleState: () => void, 
  setTrue: () => void, 
  setFalse: () => void
] => {
  const [state, setState] = useState(initialValue);

  const setFalse = useCallback((): void => {
    setState(false);
  }, [setState]);

  const setTrue = useCallback((): void => {
    setState(true);
  }, [setState]);

  const toggleState = useCallback((): void => {
    setState(!state);
  }, [state, setState]);

  return [state, toggleState, setTrue, setFalse];
};

export default useBooleanState;
```

USAGE NOTES:
- Returns 4 values: state, toggle, setTrue, setFalse
- Optimized with useCallback to prevent unnecessary re-renders
- Perfect for modals, dropdowns, toggles

USAGE EXAMPLE:
```typescript
import useBooleanState from 'hooks/useBooleanState';

function ModalComponent() {
  const [isOpen, toggle, open, close] = useBooleanState(false);

  return (
    <>
      <button onClick={open}>Open Modal</button>
      <button onClick={toggle}>Toggle Modal</button>
      
      {isOpen && (
        <Modal onClose={close}>
          <h2>Modal Content</h2>
        </Modal>
      )}
    </>
  );
}
```

================================================================================

---[FILE: Event Listener Hook - useEventListener.ts]---
Location: src/hooks/useEventListener.ts
Purpose: Attach event listeners with automatic cleanup

```typescript
import {useEffect, useRef} from 'react';

type EventName = 'mousedown' | 'scroll' | 'resize' | 'keydown' | 'click';

const useEventListener = (
  eventName: EventName,
  handler: (e: Event) => any,
  element: EventTarget = window,
  capture = false,
): void => {
  const handlerRef = useRef(handler);

  // Update ref if handler changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // Attach event listener
  useEffect(() => {
    const eventListener = (e: Event) => handlerRef.current(e);

    element.addEventListener(eventName, eventListener, capture);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [capture, element, eventName]);
};

export default useEventListener;
```

USAGE NOTES:
- Automatically removes listener on unmount
- Uses ref to prevent re-registering on handler change
- Supports any EventTarget (window, document, element)
- Capture phase support

USAGE EXAMPLES:
```typescript
import useEventListener from 'hooks/useEventListener';

// 1. CLICK OUTSIDE TO CLOSE
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEventListener('mousedown', (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  });

  return (
    <div ref={dropdownRef}>
      {isOpen && <div>Dropdown content</div>}
    </div>
  );
}

// 2. KEYBOARD SHORTCUTS
function App() {
  useEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
    if (e.key === 's' && e.ctrlKey) {
      e.preventDefault();
      saveDocument();
    }
  });

  return <div>App Content</div>;
}

// 3. SCROLL TRACKING
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);

  useEventListener('scroll', () => {
    setScrollY(window.scrollY);
  });

  return <div>Scrolled: {scrollY}px</div>;
}
```

================================================================================

---[FILE: Query Params Hook - useQueryParams.ts]---
Location: src/hooks/useQueryParams.ts
Purpose: Easy access to URL query parameters

```typescript
import {useLocation} from 'react-router-dom';

const useQueryParams = (): URLSearchParams => {
  const {search} = useLocation();
  return new URLSearchParams(search);
};

export default useQueryParams;
```

USAGE NOTES:
- Returns URLSearchParams instance
- Automatically updates when URL changes
- Type-safe with TypeScript

USAGE EXAMPLES:
```typescript
import useQueryParams from 'hooks/useQueryParams';

// 1. READ QUERY PARAMS
function SearchResults() {
  const queryParams = useQueryParams();
  
  const searchTerm = queryParams.get('q');
  const page = parseInt(queryParams.get('page') || '1');
  const category = queryParams.get('category');

  useEffect(() => {
    fetchResults({searchTerm, page, category});
  }, [searchTerm, page, category]);

  return <div>Results for: {searchTerm}</div>;
}

// 2. PAGINATION
function PaginatedList() {
  const queryParams = useQueryParams();
  const currentPage = parseInt(queryParams.get('page') || '1');

  const navigate = useNavigate();
  
  const goToPage = (page: number) => {
    navigate(`?page=${page}`);
  };

  return (
    <>
      <List page={currentPage} />
      <button onClick={() => goToPage(currentPage + 1)}>Next</button>
    </>
  );
}

// 3. FILTERS
function ProductList() {
  const queryParams = useQueryParams();
  
  const filters = {
    category: queryParams.get('category'),
    minPrice: queryParams.get('min_price'),
    maxPrice: queryParams.get('max_price'),
    sort: queryParams.get('sort'),
  };

  // URL: /products?category=electronics&min_price=100&max_price=500&sort=price_asc
  
  return <div>Filtered products</div>;
}
```

================================================================================

---[FILE: Window Dimensions Hook - useWindowDimensions.ts]---
Location: src/hooks/useWindowDimensions.ts
Purpose: Track window size for responsive components

```typescript
import {useEffect, useState} from 'react';

interface WindowDimension {
  clientWidth: number;
  height: number;
  width: number;
}

const getWindowDimensions = (): WindowDimension => {
  const {innerHeight: height, innerWidth: width} = window;
  const {clientWidth} = document.documentElement;

  return {
    clientWidth,
    height,
    width,
  };
};

const useWindowDimensions = (): WindowDimension => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimension>(
    getWindowDimensions()
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
```

USAGE NOTES:
- Returns clientWidth, height, and width
- Automatically updates on window resize
- Cleanup on unmount

USAGE EXAMPLES:
```typescript
import useWindowDimensions from 'hooks/useWindowDimensions';

// 1. RESPONSIVE LAYOUT
function ResponsiveLayout() {
  const {width} = useWindowDimensions();
  
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  return (
    <div>
      {isMobile && <MobileNav />}
      {isTablet && <TabletNav />}
      {isDesktop && <DesktopNav />}
    </div>
  );
}

// 2. CONDITIONAL RENDERING
function Gallery() {
  const {width} = useWindowDimensions();
  
  const columns = width < 768 ? 1 : width < 1024 ? 2 : 3;

  return (
    <div style={{columnCount: columns}}>
      {images.map(img => <img src={img} />)}
    </div>
  );
}

// 3. SCROLL POSITION TRACKING
function ScrollProgress() {
  const {height} = useWindowDimensions();
  const [scrollPercent, setScrollPercent] = useState(0);

  useEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - height;
    const percent = (scrollTop / docHeight) * 100;
    setScrollPercent(percent);
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      width: `${scrollPercent}%`,
      height: '4px',
      background: 'blue'
    }} />
  );
}
```

================================================================================
2. TRPC CALLER LINK (HTTP-LESS TRPC)
================================================================================

---[FILE: tRPC Caller Link - trpc-caller-link.ts]---
Location: packages/trpc-interface/src/trpc-caller-link.ts
Purpose: Call tRPC routers without HTTP (in-memory)

```typescript
import type {AnyRouter} from "@trpc/server";
import {observable} from "@trpc/server/observable";
import {TRPCClientError, type TRPCLink} from "@trpc/client";

type MemoryLinkOptions<TemplateRouter extends AnyRouter> = {
  appRouter: TemplateRouter;
  createContext?: () => TemplateRouter["_def"]["_config"]["$types"]["ctx"];
};

/**
 * https://github.com/trpc/trpc/issues/3335
 *
 * createCaller and createTRPCProxyClient provides different interfaces,
 * here we provide callerLink which can be used as a [trpc client link]
 * Allowing us to call router api without http but through createTRPCProxyClient interface
 * See trpc-caller-link.test.ts for details
 **/
export const callerLink = <TemplateRouter extends AnyRouter>(
  opts: MemoryLinkOptions<TemplateRouter>
): TRPCLink<TemplateRouter> => {
  const {appRouter, createContext} = opts;

  return (_runtime) =>
    ({op}) =>
      observable((observer) => {
        const caller = appRouter.createCaller(createContext?.() ?? {});
        const {path, input} = op;

        const paths = path.split(".");

        let localCaller = caller as unknown as (
          arg: unknown
        ) => Promise<unknown>;

        // Navigate through nested routers
        for (const functionName of paths) {
          // @ts-ignore
          localCaller = localCaller[functionName];
        }

        const promise = localCaller(input);

        promise
          .then((data) => {
            observer.next({
              result: {data},
            });
            observer.complete();
          })
          .catch((error) => observer.error(TRPCClientError.from(error)));

        return () => {
          // nothing to cancel
        };
      });
};
```

USAGE NOTES:
- Call tRPC routers directly without HTTP overhead
- Perfect for server-side rendering (SSR)
- Useful for testing
- Provides same interface as HTTP client

USAGE EXAMPLE:
```typescript
import {createTRPCProxyClient} from '@trpc/client';
import {callerLink} from './trpc-caller-link';
import {appRouter} from './router';

// CREATE CLIENT WITHOUT HTTP
const client = createTRPCProxyClient<AppRouter>({
  links: [
    callerLink({
      appRouter,
      createContext: () => ({
        user: {id: '123', name: 'John'},
      }),
    }),
  ],
});

// USE LIKE NORMAL TRPC CLIENT
async function getUser() {
  const user = await client.user.get.query({id: '123'});
  return user;
}

// PERFECT FOR SSR
export async function loader() {
  const data = await client.posts.getAll.query();
  return {posts: data};
}
```

================================================================================
3. ADVANCED HOOK PATTERNS
================================================================================

---[FILE: useDebounce Hook]---
Purpose: Debounce values to prevent excessive updates

```typescript
import {useEffect, useState} from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

USAGE EXAMPLE:
```typescript
import useDebounce from 'hooks/useDebounce';

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Only calls API after user stops typing for 500ms
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

================================================================================

---[FILE: useLocalStorage Hook]---
Purpose: Sync state with localStorage

```typescript
import {useState, useEffect} from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Get from localStorage
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Save to localStorage
  const setValue = (value: T) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setStoredValue(newValue);
      
      // Dispatch event for other tabs
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes in other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, []);

  return [storedValue, setValue];
}

export default useLocalStorage;
```

USAGE EXAMPLES:
```typescript
import useLocalStorage from 'hooks/useLocalStorage';

// 1. PERSIST USER PREFERENCES
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}

// 2. PERSIST FORM DATA
function ContactForm() {
  const [formData, setFormData] = useLocalStorage('contact-form', {
    name: '',
    email: '',
    message: '',
  });

  return (
    <form>
      <input 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      {/* Form auto-saves to localStorage */}
    </form>
  );
}

// 3. RECENT SEARCHES
function SearchHistory() {
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    'recent-searches', 
    []
  );

  const addSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
  };

  return (
    <ul>
      {recentSearches.map(search => <li>{search}</li>)}
    </ul>
  );
}
```

================================================================================

---[FILE: useIntersectionObserver Hook]---
Purpose: Detect when element enters viewport (lazy loading, infinite scroll)

```typescript
import {useEffect, useRef, useState} from 'react';

interface Options extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

function useIntersectionObserver(
  options?: Options
): [React.RefObject<HTMLDivElement>, boolean] {
  const {threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false} = options || {};

  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        
        if (isIntersecting) {
          setIsVisible(true);
          if (freezeOnceVisible) {
            observer.unobserve(element);
          }
        } else {
          if (!freezeOnceVisible) {
            setIsVisible(false);
          }
        }
      },
      {threshold, root, rootMargin}
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return [elementRef, isVisible];
}

export default useIntersectionObserver;
```

USAGE EXAMPLES:
```typescript
import useIntersectionObserver from 'hooks/useIntersectionObserver';

// 1. LAZY LOAD IMAGES
function LazyImage({src, alt}) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true
  });

  return (
    <div ref={ref}>
      {isVisible ? (
        <img src={src} alt={alt} />
      ) : (
        <div style={{height: 400, background: '#eee'}}>Loading...</div>
      )}
    </div>
  );
}

// 2. INFINITE SCROLL
function InfiniteList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [ref, isVisible] = useIntersectionObserver({threshold: 1.0});

  useEffect(() => {
    if (isVisible) {
      fetchItems(page).then(newItems => {
        setItems([...items, ...newItems]);
        setPage(page + 1);
      });
    }
  }, [isVisible]);

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
      <div ref={ref}>Loading more...</div>
    </div>
  );
}

// 3. ANIMATE ON SCROLL
function AnimatedSection() {
  const [ref, isVisible] = useIntersectionObserver({threshold: 0.3});

  return (
    <div 
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s'
      }}
    >
      Content fades in when visible
    </div>
  );
}
```

================================================================================
4. PERFORMANCE OPTIMIZATION HOOKS
================================================================================

---[FILE: useMemoizedCallback Hook]---
Purpose: Advanced useCallback with dependency tracking

```typescript
import {useCallback, useRef, useEffect} from 'react';

function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    ((...args) => callbackRef.current(...args)) as T,
    deps
  );
}

export default useMemoizedCallback;
```

USAGE NOTES:
- Prevents callback recreation but always uses latest version
- Useful for event handlers passed to child components
- Reduces re-renders

USAGE EXAMPLE:
```typescript
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Child won't re-render when name changes
  const handleClick = useMemoizedCallback(() => {
    console.log(`Count: ${count}, Name: ${name}`);
  }, []);

  return <Child onClick={handleClick} />;
}
```

================================================================================
END OF PART 8
================================================================================

FEATURES DOCUMENTED:
✅ useBooleanState (toggle helpers)
✅ useEventListener (automatic cleanup)
✅ useQueryParams (URL params)
✅ useWindowDimensions (responsive design)
✅ useDebounce (delay updates)
✅ useLocalStorage (persist state)
✅ useIntersectionObserver (lazy loading, infinite scroll)
✅ useMemoizedCallback (performance optimization)
✅ tRPC Caller Link (HTTP-less tRPC calls)

REUSABILITY:
- All hooks are framework-agnostic (work with any React app)
- Type-safe with TypeScript
- Production-tested patterns
- Performance optimized with proper cleanup

````
