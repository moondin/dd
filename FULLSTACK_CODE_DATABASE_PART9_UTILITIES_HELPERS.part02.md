---
source_txt: FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.txt
converted_utc: 2025-12-17T23:22:00Z
part: 2
parts_total: 2
---

# FULLSTACK CODE DATABASE PART9 UTILITIES HELPERS

## Verbatim Content (Part 2 of 2)

````text
Purpose: Global notification system with Material-UI

```tsx
import {createContext, FC, ReactNode} from 'react';
import {Zoom} from '@mui/material';
import {useSnackbar} from 'notistack';

type CustomSnackBarContext = {
  showSnackBar: (message: string, type: 'error' | 'success') => void;
};

// Create context
export const CustomSnackBarContext = createContext<CustomSnackBarContext>(
  {} as CustomSnackBarContext
);

interface Props {
  children: ReactNode;
}

export const CustomSnackBarProvider: FC<Props> = ({children}) => {
  const {enqueueSnackbar} = useSnackbar();
  
  const showSnackBar = (message: string, type: 'error' | 'success') => {
    enqueueSnackbar(message, {
      variant: type,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };
  
  return (
    <CustomSnackBarContext.Provider value={{showSnackBar}}>
      {children}
    </CustomSnackBarContext.Provider>
  );
};
```

---[FILE: Use SnackBar Hook - useSnackBar.ts]---
```typescript
import {useContext} from 'react';
import {CustomSnackBarContext} from 'contexts/CustomSnackBarContext';

export function useSnackBar() {
  return useContext(CustomSnackBarContext);
}
```

---[FILE: App Setup - App.tsx]---
```tsx
import {SnackbarProvider} from 'notistack';
import {CustomSnackBarProvider} from 'contexts/CustomSnackBarContext';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <CustomSnackBarProvider>
        {/* Your app content */}
      </CustomSnackBarProvider>
    </SnackbarProvider>
  );
}
```

USAGE EXAMPLES:
```tsx
import {useSnackBar} from 'hooks/useSnackBar';

// 1. SUCCESS NOTIFICATION
function SaveButton() {
  const {showSnackBar} = useSnackBar();

  const handleSave = async () => {
    try {
      await saveData();
      showSnackBar('Data saved successfully!', 'success');
    } catch (error) {
      showSnackBar('Failed to save data', 'error');
    }
  };

  return <button onClick={handleSave}>Save</button>;
}

// 2. FORM VALIDATION
function ContactForm() {
  const {showSnackBar} = useSnackBar();

  const handleSubmit = (data) => {
    if (!data.email) {
      showSnackBar('Email is required', 'error');
      return;
    }
    
    submitForm(data);
    showSnackBar('Message sent!', 'success');
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// 3. API ERRORS
function UserList() {
  const {showSnackBar} = useSnackBar();

  useEffect(() => {
    fetchUsers().catch(() => {
      showSnackBar('Failed to load users', 'error');
    });
  }, []);

  return <div>...</div>;
}
```

================================================================================
END OF PART 9
================================================================================

FEATURES DOCUMENTED:
✅ useTimeout (delayed execution)
✅ usePrevious (track previous values)
✅ useUpdateEffect (skip initial mount)
✅ useDebounce (with lodash & cancel)
✅ String utilities (capitalize, reverse, validate, count)
✅ Array utilities (transpose, normalize 2D arrays)
✅ CSV parsing (handle quotes, comments, custom delimiters)
✅ Color utilities (similarity check, hex conversion)
✅ File utilities (extensions, size formatting)
✅ SnackBar context (global notifications)

REUSABILITY:
- All utilities are framework-agnostic
- Type-safe with TypeScript
- Production-tested patterns
- No external dependencies (except lodash for debounce)
- Easy to integrate into any React project

````
