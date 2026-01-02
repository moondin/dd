---
source_txt: FULLSTACK_CODE_DATABASE_PART6_REDUX_APIS.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART6 REDUX APIS

## Verbatim Content

````text
================================================================================
FULLSTACK CODE DATABASE - PART 6: REDUX STATE MANAGEMENT & API PATTERNS
================================================================================
Generated: December 16, 2025
Source: thenewboston Website-development
Tech Stack: Redux Toolkit, Axios, TypeScript, Formik, React
================================================================================

TABLE OF CONTENTS:
1. Redux Toolkit Store Setup
2. API Request Utilities with Axios
3. Authentication Patterns
4. Local Storage Integration
5. Form Handling with Formik
6. GitHub API Integration with ETag Caching

================================================================================
1. REDUX TOOLKIT STORE SETUP
================================================================================

---[FILE: Active User Slice - active-user.ts]---
Location: src/store/app/active-user.ts
Purpose: User state management with localStorage persistence

```typescript
import {createSlice} from '@reduxjs/toolkit';

import {APP_ACTIVE_USER} from 'constants/redux';
import {ActiveUser} from 'types/app/User';
import {getLocalStorageItem} from 'utils/browser';
import {setLocalAndStateReducer, unsetLocalAndStateReducer} from 'utils/store';

const activeUser = createSlice({
  initialState: getLocalStorageItem(APP_ACTIVE_USER, null) as ActiveUser,
  name: APP_ACTIVE_USER,
  reducers: {
    setActiveUser: setLocalAndStateReducer<ActiveUser>(APP_ACTIVE_USER),
    unsetActiveUser: unsetLocalAndStateReducer(APP_ACTIVE_USER, null),
  },
});

export const {setActiveUser, unsetActiveUser} = activeUser.actions;

export default activeUser;
```

---[FILE: Store Utilities - store.ts]---
Location: src/utils/store.ts
Purpose: Helper functions for Redux with localStorage sync

```typescript
import {setLocalStorageItem, removeLocalStorageItem} from './browser';

// Reducer that sets state AND localStorage
export function setLocalAndStateReducer<T>(key: string) {
  return (state: T, action: {payload: T}) => {
    setLocalStorageItem(key, JSON.stringify(action.payload));
    return action.payload;
  };
}

// Reducer that unsets state AND localStorage
export function unsetLocalAndStateReducer<T>(key: string, defaultValue: T) {
  return (state: T) => {
    removeLocalStorageItem(key);
    return defaultValue;
  };
}
```

---[FILE: Browser Utilities - browser.ts]---
Location: src/utils/browser.ts
Purpose: localStorage helpers with type safety

```typescript
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key);
  if (item === null) return defaultValue;
  
  try {
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

export function setLocalStorageItem(key: string, value: string): void {
  localStorage.setItem(key, value);
}

export function removeLocalStorageItem(key: string): void {
  localStorage.removeItem(key);
}

export function saveETagToLocalStorage(key: string, etag: string): void {
  if (etag) {
    localStorage.setItem(key, etag.replace(/"/g, ''));
  }
}
```

---[FILE: Store Configuration - index.ts]---
Location: src/store/index.ts
Purpose: Root store configuration

```typescript
import {configureStore} from '@reduxjs/toolkit';
import activeUser from './app/active-user';
import usersReducer from './models/users';

export const store = configureStore({
  reducer: {
    activeUser: activeUser.reducer,
    users: usersReducer,
    // Add more reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

USAGE NOTES:
- Automatically syncs Redux state with localStorage
- Type-safe with TypeScript
- Reusable reducers for common patterns
- Easy to add new slices

USAGE IN COMPONENT:
```typescript
import {useDispatch, useSelector} from 'react-redux';
import {setActiveUser, unsetActiveUser} from 'store/app/active-user';
import {RootState} from 'store';

function ProfileComponent() {
  const dispatch = useDispatch();
  const activeUser = useSelector((state: RootState) => state.activeUser);

  const handleLogin = (userData) => {
    dispatch(setActiveUser(userData));
  };

  const handleLogout = () => {
    dispatch(unsetActiveUser());
  };

  return <div>{activeUser?.display_name}</div>;
}
```

================================================================================
2. API REQUEST UTILITIES WITH AXIOS
================================================================================

---[FILE: Request Utilities - requests.ts]---
Location: src/utils/requests.ts
Purpose: Centralized request configuration and headers

```typescript
import axios from 'axios';
import {APP_ACTIVE_USER} from 'constants/redux';
import {getLocalStorageItem, saveETagToLocalStorage, setLocalStorageItem} from './browser';

// AUTHENTICATION HEADERS
export function authHeaders() {
  const activeUser = getLocalStorageItem(APP_ACTIVE_USER, null);
  return {
    headers: {
      Authorization: `Bearer ${activeUser.access_token}`,
      'Content-Type': 'application/json',
    },
  };
}

// STANDARD HEADERS
export function standardHeaders() {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

// GITHUB API HEADERS (with ETag support)
export function githubHeaders(eTag: string) {
  return {
    headers: {
      'If-None-Match': `"${eTag}"`, // provide cached etag to see if resource has been updated
    },
  };
}

// GITHUB API REQUEST WITH CACHING
export async function githubGetRequestAbstract<R>({
  eTagKey,
  cachedContentKey,
  params = {},
  url,
}: {
  eTagKey: string;
  cachedContentKey: string;
  params?: any;
  url: string;
}) {
  const eTag = getLocalStorageItem(eTagKey, '');

  const response = await axios.get<R>(url, {
    params,
    validateStatus: validateGitHubApiStatus,
    ...githubHeaders(eTag),
  });

  // Get cached content if not modified (304 status)
  if (response.status === 304) {
    return getLocalStorageItem(cachedContentKey, []);
  }
  
  // Save new ETag and content
  saveETagToLocalStorage(eTagKey, response.headers.etag);
  setLocalStorageItem(cachedContentKey, JSON.stringify(response.data));
  return response.data;
}

// VALIDATE GITHUB API STATUS
export function validateGitHubApiStatus(status: number) {
  return (status >= 200 && status <= 299) || status === 304;
}
```

USAGE NOTES:
- authHeaders() automatically includes JWT token from localStorage
- GitHub API integration with ETag caching reduces API calls
- Status 304 (Not Modified) returns cached data
- Type-safe with TypeScript generics

USAGE EXAMPLE:
```typescript
// Authenticated request
import {authHeaders} from 'utils/requests';

const response = await axios.get(
  `${API_URL}/protected-route`,
  authHeaders()
);

// GitHub request with caching
import {githubGetRequestAbstract} from 'utils/requests';

const repos = await githubGetRequestAbstract({
  eTagKey: 'github-repos-etag',
  cachedContentKey: 'github-repos-cache',
  url: 'https://api.github.com/users/username/repos',
});
```

================================================================================
3. AUTHENTICATION PATTERNS
================================================================================

---[FILE: Authentication API - authentication/index.ts]---
Location: src/apis/authentication/index.ts
Purpose: Login endpoint

```typescript
import axios from 'axios';

export async function login({
  email, 
  password
}: {
  email: string; 
  password: string;
}) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_API}/login`, 
    {email, password}
  );
}
```

---[FILE: User API - users/index.ts]---
Location: src/apis/users/index.ts
Purpose: User CRUD operations

```typescript
import axios from 'axios';
import {standardHeaders} from 'utils/requests';
import {User} from 'types/app/User';

// CREATE USER (REGISTRATION)
export async function createUser({
  display_name,
  email,
  password,
}: {
  display_name: string;
  email: string;
  password: string;
}) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_API}/users`, 
    {display_name, email, password}, 
    standardHeaders()
  );
}

// GET USER BY UUID
export async function getUser({uuid}: {uuid: string}): Promise<User> {
  const response = await axios.get<User>(
    `${process.env.REACT_APP_BACKEND_API}/users/${uuid}`
  );
  
  if (!response.data) {
    throw new Error('Error while fetching user. Please try again.');
  }
  
  return response.data;
}
```

---[FILE: User Type - User.ts]---
Location: src/types/app/User.ts
Purpose: Type definitions for user data

```typescript
export interface User {
  uuid: string;
  display_name: string;
  email: string;
  created_date: string;
  modified_date: string;
  profile_image?: string;
  github_username?: string;
}

export interface ActiveUser extends User {
  access_token: string;
  refresh_token?: string;
}
```

COMPLETE LOGIN FLOW:
```typescript
import {useDispatch} from 'react-redux';
import {login} from 'apis/authentication';
import {setActiveUser} from 'store/app/active-user';
import {useNavigate} from 'react-router-dom';

function LoginComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({email, password});
      
      // Save user data with tokens to Redux and localStorage
      dispatch(setActiveUser(response.data));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    // Login form JSX
  );
}
```

================================================================================
4. FORM HANDLING WITH FORMIK
================================================================================

---[FILE: Form Utilities - forms.tsx]---
Location: src/utils/forms.tsx
Purpose: Reusable form components and error handling

```tsx
import React, {ReactNode} from 'react';
import clsx from 'clsx';
import {ErrorMessage as FormikErrorMessageWrapper} from 'formik';
import {bemify} from '@thenewboston/utils';
import {ErrorMessage, RequiredAsterisk} from 'components';

// RENDER FORM ERROR MESSAGE
export const renderFormError = (
  name: string, 
  classNames: string | undefined, 
  hideErrorText = false
): ReactNode => (
  <div className={clsx('FormFieldComponent__error-message', {
    ...bemify(classNames, '__error-message')
  })}>
    {hideErrorText ? null : (
      <FormikErrorMessageWrapper name={name}>
        {(message) => (
          <ErrorMessage className={clsx({
            ...bemify(classNames, '__ErrorMessage')
          })}>
            {message}
          </ErrorMessage>
        )}
      </FormikErrorMessageWrapper>
    )}
  </div>
);

// RENDER FORM LABEL
export const renderFormLabel = (
  name: string,
  classNames: string | undefined,
  label?: string,
  required?: boolean,
): ReactNode =>
  label ? (
    <label 
      className={clsx('FormFieldComponent__label', {
        ...bemify(classNames, '__label')
      })} 
      htmlFor={name}
    >
      {label}
      {required ? <RequiredAsterisk /> : null}
    </label>
  ) : null;
```

USAGE IN FORMIK FORM:
```tsx
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import {renderFormError, renderFormLabel} from 'utils/forms';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Too short').required('Required'),
});

function LoginForm() {
  return (
    <Formik
      initialValues={{email: '', password: ''}}
      validationSchema={LoginSchema}
      onSubmit={(values) => {
        // Handle submit
      }}
    >
      {({errors, touched}) => (
        <Form>
          <div>
            {renderFormLabel('email', 'LoginForm', 'Email', true)}
            <Field name="email" type="email" />
            {renderFormError('email', 'LoginForm')}
          </div>

          <div>
            {renderFormLabel('password', 'LoginForm', 'Password', true)}
            <Field name="password" type="password" />
            {renderFormError('password', 'LoginForm')}
          </div>

          <button type="submit">Login</button>
        </Form>
      )}
    </Formik>
  );
}
```

================================================================================
5. ERROR HANDLING PATTERNS
================================================================================

---[FILE: Error Utilities - errors.ts]---
Location: src/utils/errors.ts
Purpose: Centralized error handling

```typescript
import {AxiosError} from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    // Handle Axios errors
    if (error.response) {
      // Server responded with error
      return error.response.data?.message || 'An error occurred';
    } else if (error.request) {
      // Request made but no response
      return 'No response from server. Please check your connection.';
    }
  }
  
  // Generic error
  return 'An unexpected error occurred';
}

export function getFieldError(
  errors: Record<string, string>, 
  field: string
): string | undefined {
  return errors[field];
}
```

---[FILE: Toast Notifications - toast.tsx]---
Location: src/utils/toast.tsx
Purpose: User-friendly error/success messages

```tsx
import React from 'react';
import {toast as hotToast} from 'react-hot-toast';

export const toast = {
  success: (message: string) => {
    hotToast.success(message, {
      duration: 4000,
      position: 'top-right',
    });
  },
  
  error: (message: string) => {
    hotToast.error(message, {
      duration: 5000,
      position: 'top-right',
    });
  },
  
  loading: (message: string) => {
    return hotToast.loading(message, {
      position: 'top-right',
    });
  },
  
  dismiss: (toastId: string) => {
    hotToast.dismiss(toastId);
  },
};
```

USAGE EXAMPLE:
```typescript
import {toast} from 'utils/toast';
import {handleApiError} from 'utils/errors';

async function submitForm(data) {
  const loadingToast = toast.loading('Submitting...');
  
  try {
    await api.submit(data);
    toast.dismiss(loadingToast);
    toast.success('Form submitted successfully!');
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error(handleApiError(error));
  }
}
```

================================================================================
6. AXIOS INTERCEPTORS SETUP
================================================================================

---[FILE: Axios Configuration - axios-config.ts]---
Purpose: Global Axios configuration with interceptors

```typescript
import axios from 'axios';
import {toast} from 'utils/toast';
import {handleApiError} from 'utils/errors';
import {getLocalStorageItem} from 'utils/browser';
import {APP_ACTIVE_USER} from 'constants/redux';

// Set base URL
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_API;

// REQUEST INTERCEPTOR - Add auth token
axios.interceptors.request.use(
  (config) => {
    const activeUser = getLocalStorageItem(APP_ACTIVE_USER, null);
    
    if (activeUser?.access_token) {
      config.headers.Authorization = `Bearer ${activeUser.access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handle errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = handleApiError(error);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear user data and redirect to login
      localStorage.removeItem(APP_ACTIVE_USER);
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
      return Promise.reject(error);
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
      return Promise.reject(error);
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
      return Promise.reject(error);
    }
    
    // Generic error toast
    if (!error.config?.skipErrorToast) {
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export default axios;
```

USAGE NOTES:
- Automatically adds JWT token to all requests
- Global error handling with toasts
- Handles token expiration (401)
- Prevents repetitive error handling code
- Can skip error toast with config flag

SKIP ERROR TOAST EXAMPLE:
```typescript
try {
  await axios.get('/endpoint', {
    skipErrorToast: true // Custom config
  });
} catch (error) {
  // Handle error manually
}
```

================================================================================
END OF PART 6
================================================================================

FEATURES DOCUMENTED:
✅ Redux Toolkit store setup
✅ localStorage sync with Redux
✅ API request utilities
✅ Authentication flow
✅ GitHub API with ETag caching
✅ Form handling with Formik
✅ Error handling patterns
✅ Toast notifications
✅ Axios interceptors

REUSABILITY:
- All patterns are framework-agnostic (work with any React app)
- Easy to adapt to different backends
- Type-safe with TypeScript
- Production-tested patterns

````
