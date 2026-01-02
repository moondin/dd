---
source_txt: FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.txt
converted_utc: 2025-12-17T23:22:00Z
part: 1
parts_total: 2
---

# FULLSTACK CODE DATABASE PART7 UI COMPONENTS

## Verbatim Content (Part 1 of 2)

````text
================================================================================
FULLSTACK CODE DATABASE - PART 7: REUSABLE UI COMPONENTS
================================================================================
Generated: December 16, 2025
Source: thenewboston Website-development
Tech Stack: React, TypeScript, styled-components, Formik
================================================================================

TABLE OF CONTENTS:
1. Data Table Component
2. Modal Component (Portal-based)
3. Pagination Component
4. Authentication Container
5. Form Button Component
6. Dropdown Input Component
7. Empty State Component
8. Component Type Definitions

================================================================================
1. DATA TABLE COMPONENT
================================================================================

---[FILE: DataTable Component - DataTable/index.tsx]---
Location: src/components/DataTable/index.tsx
Purpose: Reusable table with dynamic columns and rows

```tsx
import React, {ReactNode} from 'react';
import {SFC} from 'types/generic';

import * as S from './Styles';

type Props = {
  columns: ReactNode[];
  data: ReactNode[][];
};

const DataTable: SFC<Props> = ({className, columns, data}) => {
  const renderTableHeaders = (cols: ReactNode[]): ReactNode => {
    return (
      <>
        {cols.map((col, index) => (
          <S.Th className={className && `${className}__table-thead-th`} key={index}>
            {col}
          </S.Th>
        ))}
      </>
    );
  };

  const renderTableRows = (rows: ReactNode[][]): ReactNode => {
    return (
      <>
        {rows.map((row, index) => (
          <S.Tr className={className && `${className}__table-tbody-tr`} key={index}>
            {row.map((cell, idx) => (
              <S.Td className={className && `${className}__table-tbody-tr-td`} key={idx}>
                {cell}
              </S.Td>
            ))}
          </S.Tr>
        ))}
      </>
    );
  };

  return (
    <S.Table className={className && `${className}__table`}>
      <S.THead className={className && `${className}__table-thead`}>
        {renderTableHeaders(columns)}
      </S.THead>
      <tbody className={className && `${className}__table-tbody`}>
        {renderTableRows(data)}
      </tbody>
    </S.Table>
  );
};

export default DataTable;
```

---[FILE: DataTable Styles - DataTable/Styles.ts]---
```tsx
import styled from 'styled-components';
import {colors} from 'styles';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;

export const THead = styled.thead`
  background-color: ${colors.lightGray};
  border-bottom: 2px solid ${colors.border};
`;

export const Th = styled.th`
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: ${colors.darkGray};
`;

export const Tr = styled.tr`
  border-bottom: 1px solid ${colors.border};
  
  &:hover {
    background-color: ${colors.lightBackground};
  }
`;

export const Td = styled.td`
  padding: 12px;
  color: ${colors.text};
`;
```

USAGE NOTES:
- Accepts any ReactNode as column headers
- Rows are 2D array of ReactNode (flexible for buttons, links, etc.)
- Auto-generates BEM-style class names
- Responsive and accessible

USAGE EXAMPLE:
```tsx
import DataTable from 'components/DataTable';

function UsersTable({users}) {
  const columns = ['ID', 'Name', 'Email', 'Actions'];
  
  const data = users.map(user => [
    user.id,
    user.name,
    user.email,
    <button onClick={() => deleteUser(user.id)}>Delete</button>
  ]);

  return (
    <DataTable 
      className="UsersTable"
      columns={columns} 
      data={data} 
    />
  );
}
```

================================================================================
2. MODAL COMPONENT (PORTAL-BASED)
================================================================================

---[FILE: Modal Component - Modal/index.tsx]---
Location: src/components/Modal/index.tsx
Purpose: Full-featured modal with Formik integration, portals, and keyboard support

```tsx
import React, {CSSProperties, ReactNode, useCallback, useEffect, useMemo} from 'react';
import {createPortal} from 'react-dom';
import clsx from 'clsx';
import noop from 'lodash/noop';
import {Icon, IconType} from '@thenewboston/ui';
import {bemify} from '@thenewboston/utils';

import {Form, FormButton, FormButtonProps} from 'components/FormComponents';
import Loader from 'components/FormElements/Loader';
import {GenericFormValues} from 'types/forms';
import {ClassName, GenericFunction, SFC} from 'types/generic';

import * as S from './Styles';

export interface ModalButtonProps extends FormButtonProps, ClassName {
  content: ReactNode;
}

interface ComponentProps {
  cancelButton?: ModalButtonProps | string;
  close(): void;
  footer?: ReactNode;
  header?: ReactNode;
  ignoreDirty?: boolean;
  initialValues?: GenericFormValues;
  onSubmit: GenericFunction;
  style?: CSSProperties;
  submitButton?: ModalButtonProps | string;
  submitting?: boolean;
  validationSchema?: any;
}

const Modal: SFC<ComponentProps> = ({
  cancelButton,
  children,
  className,
  close,
  footer,
  header,
  ignoreDirty: ignoreDirtyProps = false,
  initialValues = {},
  onSubmit,
  style,
  submitButton,
  submitting = false,
  validationSchema,
}) => {
  // ESC key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    },
    [close],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Determine if form is dirty
  const ignoreDirty = useMemo<boolean>(
    () => ignoreDirtyProps || Object.keys(initialValues).length === 0,
    [ignoreDirtyProps, initialValues]
  );

  // Cancel button configuration
  const cancelProps = useMemo<ModalButtonProps>(() => {
    if (typeof cancelButton === 'string') {
      return {
        content: cancelButton,
        ignoreDirty,
        onClick: close,
        submitting,
        variant: 'link',
      };
    }
    return {
      className: cancelButton?.className ?? undefined,
      color: cancelButton?.color ?? undefined,
      content: cancelButton?.content ?? 'Cancel',
      disabled: cancelButton?.disabled ?? undefined,
      ignoreDirty: cancelButton?.ignoreDirty ?? ignoreDirty,
      onClick: cancelButton?.onClick ?? close,
      submitting: cancelButton?.submitting ?? submitting,
      type: cancelButton?.type ?? undefined,
      variant: cancelButton?.variant ?? 'link',
    };
  }, [cancelButton, close, ignoreDirty, submitting]);

  // Submit button configuration
  const submitProps = useMemo<ModalButtonProps>(() => {
    if (typeof submitButton === 'string') {
      return {
        content: submitButton,
        ignoreDirty,
        submitting,
        type: 'submit',
      };
    }
    return {
      className: submitButton?.className ?? undefined,
      color: submitButton?.color ?? undefined,
      content: submitButton?.content ?? 'Submit',
      disabled: submitButton?.disabled ?? undefined,
      ignoreDirty: submitButton?.ignoreDirty ?? ignoreDirty,
      onClick: submitButton?.onClick ?? noop,
      submitting: submitButton?.submitting ?? submitting,
      type: submitButton?.type ?? 'submit',
      variant: submitButton?.variant ?? undefined,
    };
  }, [ignoreDirty, submitButton, submitting]);

  // Click outside to close
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        close();
      }
    },
    [close]
  );

  const modalContent = (
    <S.Overlay className="Modal__overlay" onClick={handleOverlayClick}>
      <S.Container className={clsx('Modal', className)} style={style}>
        <S.CloseButton onClick={close}>
          <Icon icon={IconType.close} size={24} />
        </S.CloseButton>
        
        {header && <S.Header className="Modal__header">{header}</S.Header>}
        
        <Form initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          <S.Body className="Modal__body">{children}</S.Body>
          
          {footer || (
            <S.Footer className="Modal__footer">
              <FormButton {...cancelProps}>{cancelProps.content}</FormButton>
              <FormButton {...submitProps}>{submitProps.content}</FormButton>
            </S.Footer>
          )}
        </Form>
      </S.Container>
    </S.Overlay>
  );

  // Render to portal
  return createPortal(modalContent, document.body);
};

export default Modal;
```

---[FILE: Modal Styles - Modal/Styles.ts]---
```tsx
import styled from 'styled-components';
import {colors} from 'styles';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const Container = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${colors.textSecondary};
  
  &:hover {
    color: ${colors.text};
  }
`;

export const Header = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${colors.border};
  font-size: 20px;
  font-weight: 600;
`;

export const Body = styled.div`
  padding: 24px;
`;

export const Footer = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
```

USAGE NOTES:
- Uses React Portal to render outside DOM hierarchy
- ESC key and click-outside to close
- Integrates with Formik for forms
- Customizable buttons (simple string or full config)
- Prevents form submission when not dirty
- Shows loader on submit button

USAGE EXAMPLE:
```tsx
import {useState} from 'react';
import Modal from 'components/Modal';
import * as Yup from 'yup';

function UserForm() {
  const [isOpen, setIsOpen] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
  });

  const handleSubmit = async (values) => {
    await api.createUser(values);
    setIsOpen(false);
  };

  if (!isOpen) return <button onClick={() => setIsOpen(true)}>Add User</button>;

  return (
    <Modal
      close={() => setIsOpen(false)}
      header="Create New User"
      initialValues={{name: '', email: ''}}
      onSubmit={handleSubmit}
      submitButton="Create"
      cancelButton="Cancel"
      validationSchema={validationSchema}
    >
      <Field name="name" placeholder="Name" />
      <Field name="email" placeholder="Email" />
    </Modal>
  );
}
```

================================================================================
3. PAGINATION COMPONENT
================================================================================

---[FILE: Pagination Component - Pagination/index.tsx]---
Location: src/components/Pagination/index.tsx
Purpose: Navigation between documentation pages

```tsx
import React from 'react';
import {useLocation} from 'react-router-dom';
import {Icon, IconType} from '@thenewboston/ui';

import {SFC} from 'types/generic';
import {NavigationItem} from 'types/navigation';

import * as S from './Styles';

export interface PaginationProps {
  navigationData: NavigationItem[];
}

const Pagination: SFC<PaginationProps> = ({className, navigationData}) => {
  const location = useLocation();

  const renderNextLink = () => {
    const index = navigationData.findIndex(({url}) => url === location.pathname);
    if (index === navigationData.length - 1) return null;
    
    const {name, url} = navigationData[index + 1];
    return (
      <S.PaginationNavLink to={url}>
        {name}
        <Icon icon={IconType.chevronRight} size={20} />
      </S.PaginationNavLink>
    );
  };

  const renderPreviousLink = () => {
    const index = navigationData.findIndex(({url}) => url === location.pathname);
    if (index === 0 || index === -1) return null;
    
    const {name, url} = navigationData[index - 1];
    return (
      <S.PaginationNavLink to={url}>
        <Icon icon={IconType.chevronLeft} size={20} />
        {name}
      </S.PaginationNavLink>
    );
  };

  return (
    <S.Pagination className={className} data-testid="Pagination">
      {renderPreviousLink()}
      {renderNextLink()}
    </S.Pagination>
  );
};

export default Pagination;
```

---[FILE: Navigation Types - navigation.ts]---
```typescript
export interface NavigationItem {
  name: string;
  url: string;
  section?: string;
}
```

USAGE NOTES:
- Auto-detects current page from router
- Shows previous/next links based on position in navigation array
- Hides links at boundaries (first/last page)
- Works with any route structure

USAGE EXAMPLE:
```tsx
import Pagination from 'components/Pagination';

const docsNavigation = [
  {name: 'Introduction', url: '/docs/intro'},
  {name: 'Getting Started', url: '/docs/getting-started'},
  {name: 'API Reference', url: '/docs/api'},
  {name: 'Examples', url: '/docs/examples'},
];

function DocPage() {
  return (
    <div>
      {/* Page content */}
      <Pagination navigationData={docsNavigation} />
    </div>
  );
}
```

================================================================================
4. AUTHENTICATION CONTAINER
================================================================================

---[FILE: Auth Container - AuthContainer/index.tsx]---
Location: src/components/AuthContainer/index.tsx
Purpose: Wrapper for login/signup forms

```tsx
import React, {ReactNode} from 'react';
import {SFC} from 'types/generic';

import * as S from './Styles';

export interface AuthContainerProps {
  children: ReactNode;
  errorMessage?: string;
  heading: string;
}

const AuthContainer: SFC<AuthContainerProps> = ({
  children, 
  className, 
  errorMessage, 
  heading
}) => {
  return (
    <S.Container className={className} data-testid="AuthContainer">
      <S.Heading>{heading}</S.Heading>
      {errorMessage && (
        <S.Error data-testid="AuthContainer__error-message">
          {errorMessage}
        </S.Error>
      )}
      {children}
    </S.Container>
  );
};

export default AuthContainer;
```

---[FILE: Auth Container Styles - AuthContainer/Styles.ts]---
```tsx
import styled from 'styled-components';
import {colors} from 'styles';

export const Container = styled.div`
  max-width: 400px;
  margin: 60px auto;
  padding: 32px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const Heading = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
  color: ${colors.text};
`;

export const Error = styled.div`
  background-color: ${colors.errorBackground};
  border: 1px solid ${colors.errorBorder};
  color: ${colors.errorText};
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
`;
```

USAGE EXAMPLE:
```tsx
import AuthContainer from 'components/AuthContainer';
import {Formik, Form, Field} from 'formik';

function LoginPage() {
  const [error, setError] = useState('');

  const handleLogin = async (values) => {
    try {
      await login(values);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <AuthContainer heading="Sign In" errorMessage={error}>
      <Formik initialValues={{email: '', password: ''}} onSubmit={handleLogin}>
        <Form>
          <Field name="email" type="email" placeholder="Email" />
          <Field name="password" type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </Form>
      </Formik>
    </AuthContainer>
  );
}
```

================================================================================
5. FORM BUTTON COMPONENT
================================================================================

---[FILE: Form Button - FormButton/index.tsx]---
Location: src/components/FormComponents/FormButton/index.tsx
Purpose: Smart button that integrates with Formik state

```tsx
import React, {useMemo} from 'react';
import {useFormikContext} from 'formik';
import {BaseButtonProps, Button, Loader} from 'components/FormElements';
import {SFC} from 'types/generic';

export interface FormButtonProps extends BaseButtonProps {
  ignoreDirty?: boolean;
  submitting?: boolean;
}

const FormButton: SFC<FormButtonProps> = ({
  children, 
  ignoreDirty = false, 
  submitting = false, 
  ...baseButtonProps
}) => {
  const {disabled = false, onClick, type = 'button'} = baseButtonProps;
  const {dirty, handleReset, handleSubmit, isValid} = useFormikContext();

  // Disable button based on form state
  const buttonIsDisabled = useMemo(() => {
    switch (type) {
      case 'submit':
        return disabled || (!ignoreDirty && !dirty) || !isValid || submitting;
      case 'reset':
        return disabled || (!ignoreDirty && !dirty) || submitting;
      default:
        return disabled || submitting;
    }
  }, [disabled, dirty, ignoreDirty, isValid, submitting, type]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e?.preventDefault();
    if (buttonIsDisabled) return;

    if (type === 'submit') handleSubmit();
    if (type === 'reset') handleReset();
    if (type === 'button') onClick?.(e);
  };

  return (
    <Button {...baseButtonProps} disabled={buttonIsDisabled} onClick={handleClick}>
      {type === 'submit' && submitting ? <Loader /> : children}
    </Button>
  );
};

export default FormButton;
```

USAGE NOTES:
- Auto-disables when form is not dirty (prevents accidental submissions)
- Shows loader on submit button when submitting
- Handles submit, reset, and button types
- Can ignore dirty check with ignoreDirty prop
- Validates form before enabling submit

USAGE EXAMPLE:
```tsx
import {Formik, Form} from 'formik';
import FormButton from 'components/FormComponents/FormButton';

function EditForm({initialData}) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    await api.update(values);
    setSubmitting(false);
  };

  return (
    <Formik initialValues={initialData} onSubmit={handleSubmit}>
      <Form>
        {/* Form fields */}
        <FormButton type="reset">Reset</FormButton>
        <FormButton type="submit" submitting={submitting}>
          Save Changes
        </FormButton>
      </Form>
    </Formik>
  );
}
```

================================================================================
6. DROPDOWN INPUT COMPONENT
================================================================================

---[FILE: Dropdown Input - DropdownInput/index.tsx]---
Location: src/components/DropdownInput/index.tsx
Purpose: Custom styled dropdown with callback

```tsx
import React, {useState} from 'react';
import {IconType} from '@thenewboston/ui';
import {SFC} from 'types/generic';

import * as S from './Styles';

interface ComponentProps<T> {
  callbackOnChange: (selectedOption: string) => void;
  defaultOption: T;
  options: T[];
}

const DropdownInput: SFC<ComponentProps<string>> = ({
  callbackOnChange, 
  className, 
  defaultOption, 
  options
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(defaultOption);
  
  const handleChange = (e: React.FormEvent) => {
    const {value} = e.target as HTMLSelectElement;
    setSelectedOption(value);
    callbackOnChange(value);
  };
  
  return (
    <S.Container className={className} data-testid="DropdownInput">
      <S.Select 
        data-testid="DropdownInput__select-box" 
        value={selectedOption} 
        onChange={handleChange}
      >
        {options.map((option) => (
          <S.Option key={option} value={option} data-testid="DropdownInput__option">
            {option}
          </S.Option>
        ))}
      </S.Select>
      <S.ChevronDown data-testid="ChevronDown" icon={IconType.chevronDown} />
    </S.Container>
  );
};

export default DropdownInput;
```

---[FILE: Dropdown Styles - DropdownInput/Styles.ts]---
```tsx
import styled from 'styled-components';
import {Icon} from '@thenewboston/ui';
import {colors} from 'styles';

export const Container = styled.div`
  position: relative;
  display: inline-block;
`;

export const Select = styled.select`
  appearance: none;
  background: white;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  padding: 8px 32px 8px 12px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    border-color: ${colors.primary};
  }
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryLight};
  }
`;

export const Option = styled.option``;

export const ChevronDown = styled(Icon)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${colors.textSecondary};
`;
```

USAGE EXAMPLE:
```tsx
import DropdownInput from 'components/DropdownInput';

function FilterComponent() {
  const [category, setCategory] = useState('all');

  const categories = ['all', 'electronics', 'clothing', 'books'];

  const handleCategoryChange = (selected) => {
    setCategory(selected);
    fetchProducts(selected);
  };

  return (
    <DropdownInput
      options={categories}
      defaultOption="all"
      callbackOnChange={handleCategoryChange}
    />
  );
}
```

================================================================================
7. EMPTY STATE COMPONENT
================================================================================

---[FILE: Empty Page - EmptyPage/index.tsx]---
Location: src/components/EmptyPage/index.tsx
Purpose: Display when no data is available

```tsx
import React from 'react';
import clsx from 'clsx';
import {SFC} from 'types/generic';

import './EmptyPage.scss';

const EmptyPage: SFC = ({className}) => {
  return (
    <div className={clsx('EmptyPage', className)} data-testid="EmptyPage">
      <h1>No items to display</h1>
    </div>
  );
};

export default EmptyPage;
```

---[FILE: Empty Page Styles - EmptyPage.scss]---
```scss
.EmptyPage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 40px;
  text-align: center;

  h1 {
    font-size: 20px;
    color: #888;
    font-weight: 400;
  }
}
```

USAGE EXAMPLE:
```tsx
import EmptyPage from 'components/EmptyPage';

function UsersList({users}) {
  if (users.length === 0) {
    return <EmptyPage />;
  }

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

================================================================================
8. COMPONENT TYPE DEFINITIONS
================================================================================

---[FILE: Generic Types - generic.ts]---
Location: src/types/generic.ts
Purpose: Reusable type definitions for components

```typescript
import {FC, ReactNode} from 'react';

// Standard Functional Component with className
export interface ClassName {
  className?: string;
}

export type SFC<P = {}> = FC<P & ClassName>;

// Generic function type
export type GenericFunction = (...args: any[]) => any;

// Generic values object
export type GenericValues = Record<string, any>;

// Callback with generic parameter
export type Callback<T = void> = (param?: T) => void;
```

---[FILE: Form Types - forms.ts]---
```typescript

````
