---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 31
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 31 of 37)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - create-react-app-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/create-react-app-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: App.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/App.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';

class BuiltEmitter extends Component {
  static propTypes = {
    error: PropTypes.string,
    feature: PropTypes.func,
  };

  componentDidMount() {
    const { error, feature } = this.props;

    if (error) {
      this.handleError(error);
      return;
    }

    // Class components must call this.props.onReady when they're ready for the test.
    // We will assume functional components are ready immediately after mounting.
    if (!Object.prototype.isPrototypeOf.call(Component, feature)) {
      this.handleReady();
    }
  }

  handleError(error) {
    document.dispatchEvent(new Event('ReactFeatureError'));
  }

  handleReady() {
    document.dispatchEvent(new Event('ReactFeatureDidMount'));
  }

  render() {
    const {
      props: { feature },
      handleReady,
    } = this;
    return (
      <div>
        {feature &&
          createElement(feature, {
            onReady: handleReady,
          })}
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { feature: null };

    this.setFeature = this.setFeature.bind(this);
  }

  componentDidMount() {
    const url = window.location.href;
    // const feature = window.location.hash.slice(1);
    // This works around an issue of a duplicate hash in the href
    // Ex: http://localhost:3001/#array-destructuring#array-destructuring
    // This seems like a jsdom bug as the URL in initDom.js appears to be correct
    const feature = url.slice(url.lastIndexOf('#') + 1);

    switch (feature) {
      case 'array-destructuring':
        import('./features/syntax/ArrayDestructuring').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'array-spread':
        import('./features/syntax/ArraySpread').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'async-await':
        import('./features/syntax/AsyncAwait').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'class-properties':
        import('./features/syntax/ClassProperties').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'computed-properties':
        import('./features/syntax/ComputedProperties').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'css-inclusion':
        import('./features/webpack/CssInclusion').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'css-modules-inclusion':
        import('./features/webpack/CssModulesInclusion').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'scss-inclusion':
        import('./features/webpack/ScssInclusion').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'scss-modules-inclusion':
        import('./features/webpack/ScssModulesInclusion').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'sass-inclusion':
        import('./features/webpack/SassInclusion').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'sass-modules-inclusion':
        import('./features/webpack/SassModulesInclusion').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'custom-interpolation':
        import('./features/syntax/CustomInterpolation').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'default-parameters':
        import('./features/syntax/DefaultParameters').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'destructuring-and-await':
        import('./features/syntax/DestructuringAndAwait').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'file-env-variables':
        import('./features/env/FileEnvVariables').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'generators':
        import('./features/syntax/Generators').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'image-inclusion':
        import('./features/webpack/ImageInclusion').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'json-inclusion':
        import('./features/webpack/JsonInclusion').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'linked-modules':
        import('./features/webpack/LinkedModules').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'no-ext-inclusion':
        import('./features/webpack/NoExtInclusion').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'nullish-coalescing':
        import('./features/syntax/NullishCoalescing').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'object-destructuring':
        import('./features/syntax/ObjectDestructuring').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'object-spread':
        import('./features/syntax/ObjectSpread').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'optional-chaining':
        import('./features/syntax/OptionalChaining').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'promises':
        import('./features/syntax/Promises').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'public-url':
        import('./features/env/PublicUrl').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'rest-and-default':
        import('./features/syntax/RestAndDefault').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'rest-parameters':
        import('./features/syntax/RestParameters').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'shell-env-variables':
        import('./features/env/ShellEnvVariables').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'svg-inclusion':
        import('./features/webpack/SvgInclusion').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'svg-component':
        import('./features/webpack/SvgComponent').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'svg-in-css':
        import('./features/webpack/SvgInCss').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'template-interpolation':
        import('./features/syntax/TemplateInterpolation').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'unknown-ext-inclusion':
        import('./features/webpack/UnknownExtInclusion').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'expand-env-variables':
        import('./features/env/ExpandEnvVariables').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'base-url':
        import('./features/config/BaseUrl').then(f =>
          this.setFeature(f.default)
        );
        break;
      case 'dynamic-import':
        import('./features/webpack/DynamicImport').then(f =>
          this.setFeature(f.default)
        );
        break;
      default:
        this.setState({ error: `Missing feature "${feature}"` });
    }
  }

  setFeature(feature) {
    this.setState({ feature });
  }

  render() {
    const { error, feature } = this.state;
    if (error || feature) {
      return <BuiltEmitter error={error} feature={feature} />;
    }
    return null;
  }
}

export default App;
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/index.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import App from './App';
import ReactDOMClient from 'react-dom/client';

ReactDOMClient.createRoot(document.getElementById('root')).render(<App />);
```

--------------------------------------------------------------------------------

---[FILE: BaseUrl.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/config/BaseUrl.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import load from 'absoluteLoad';

export default class BaseUrl extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const users = load();
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-base-url">
        {this.state.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: BaseUrl.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/config/BaseUrl.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOMClient from 'react-dom/client';
import NodePath from './BaseUrl';

describe('BASE_URL', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(<NodePath onReady={resolve} />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExpandEnvVariables.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/env/ExpandEnvVariables.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

const ExpandEnvVariables = () => (
  <span>
    <span id="feature-expand-env-1">{process.env.REACT_APP_BASIC}</span>
    <span id="feature-expand-env-2">{process.env.REACT_APP_BASIC_EXPAND}</span>
    <span id="feature-expand-env-3">
      {process.env.REACT_APP_BASIC_EXPAND_SIMPLE}
    </span>
    <span id="feature-expand-env-existing">
      {process.env.REACT_APP_EXPAND_EXISTING}
    </span>
  </span>
);

export default ExpandEnvVariables;
```

--------------------------------------------------------------------------------

---[FILE: ExpandEnvVariables.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/env/ExpandEnvVariables.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOMClient from 'react-dom/client';
import ExpandEnvVariables from './ExpandEnvVariables';
import { flushSync } from 'react-dom';

describe('expand .env variables', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<ExpandEnvVariables />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: FileEnvVariables.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/env/FileEnvVariables.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

const FileEnvVariables = () => (
  <span>
    <span id="feature-file-env-original-1">
      {process.env.REACT_APP_ORIGINAL_1}
    </span>
    <span id="feature-file-env-original-2">
      {process.env.REACT_APP_ORIGINAL_2}
    </span>
    <span id="feature-file-env">
      {process.env.REACT_APP_DEVELOPMENT}
      {process.env.REACT_APP_PRODUCTION}
    </span>
    <span id="feature-file-env-x">{process.env.REACT_APP_X}</span>
  </span>
);

export default FileEnvVariables;
```

--------------------------------------------------------------------------------

---[FILE: FileEnvVariables.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/env/FileEnvVariables.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import FileEnvVariables from './FileEnvVariables';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('.env variables', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<FileEnvVariables />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PublicUrl.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/env/PublicUrl.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

const PublicUrl = () => (
  <span id="feature-public-url">{process.env.PUBLIC_URL}.</span>
);

export default PublicUrl;
```

--------------------------------------------------------------------------------

---[FILE: PublicUrl.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/env/PublicUrl.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PublicUrl from './PublicUrl';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('PUBLIC_URL', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<PublicUrl />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ShellEnvVariables.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/env/ShellEnvVariables.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

const ShellEnvVariables = () => (
  <span id="feature-shell-env-variables">
    {process.env.REACT_APP_SHELL_ENV_MESSAGE}.
  </span>
);

export default ShellEnvVariables;
```

--------------------------------------------------------------------------------

---[FILE: ShellEnvVariables.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/env/ShellEnvVariables.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ShellEnvVariables from './ShellEnvVariables';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('shell env variables', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<ShellEnvVariables />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ArrayDestructuring.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/ArrayDestructuring.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

function load() {
  return [
    [1, '1'],
    [2, '2'],
    [3, '3'],
    [4, '4'],
  ];
}

export default class ArrayDestructuring extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const users = load();
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-array-destructuring">
        {this.state.users.map(user => {
          const [id, name] = user;
          return <div key={id}>{name}</div>;
        })}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ArrayDestructuring.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/ArrayDestructuring.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ArrayDestructuring from './ArrayDestructuring';
import ReactDOMClient from 'react-dom/client';

describe('array destructuring', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(
        <ArrayDestructuring onReady={resolve} />
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ArraySpread.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/ArraySpread.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

function load(users) {
  return [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    ...users,
  ];
}

export default class ArraySpread extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const users = load([{ id: 42, name: '42' }]);
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-array-spread">
        {this.state.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ArraySpread.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/ArraySpread.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ArraySpread from './ArraySpread';
import ReactDOMClient from 'react-dom/client';

describe('array spread', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(<ArraySpread onReady={resolve} />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: AsyncAwait.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/AsyncAwait.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

async function load() {
  return [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
  ];
}

/* eslint-disable */
// Regression test for https://github.com/facebook/create-react-app/issues/3055
const x = async (
  /* prettier-ignore */
  y: void
) => {
  const z = await y;
};
/* eslint-enable */

export default class AsyncAwait extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const users = await load();
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-async-await">
        {this.state.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: AsyncAwait.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/AsyncAwait.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import AsyncAwait from './AsyncAwait';
import ReactDOMClient from 'react-dom/client';

describe('async/await', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(<AsyncAwait onReady={resolve} />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ClassProperties.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/ClassProperties.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ClassProperties extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  users = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
  ];

  componentDidMount() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-class-properties">
        {this.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ClassProperties.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/ClassProperties.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ClassProperties from './ClassProperties';
import ReactDOMClient from 'react-dom/client';

describe('class properties', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(
        <ClassProperties onReady={resolve} />
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ComputedProperties.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/ComputedProperties.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

function load(prefix) {
  return [
    { id: 1, [`${prefix} name`]: '1' },
    { id: 2, [`${prefix} name`]: '2' },
    { id: 3, [`${prefix} name`]: '3' },
    { id: 4, [`${prefix} name`]: '4' },
  ];
}

export default class ComputedProperties extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const users = load('user_');
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-computed-properties">
        {this.state.users.map(user => (
          <div key={user.id}>{user.user_name}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComputedProperties.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/ComputedProperties.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ComputedProperties from './ComputedProperties';
import ReactDOMClient from 'react-dom/client';

describe('computed properties', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(
        <ComputedProperties onReady={resolve} />
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CustomInterpolation.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/CustomInterpolation.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styled = ([style]) =>
  style
    .trim()
    .split(/\s*;\s*/)
    .map(rule => rule.split(/\s*:\s*/))
    .reduce((rules, rule) => ({ ...rules, [rule[0]]: rule[1] }), {});

function load() {
  return [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
  ];
}

export default class CustomInterpolation extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const users = load();
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    const veryInlineStyle = styled`
      background: palevioletred;
      color: papayawhip;
    `;

    return (
      <div id="feature-custom-interpolation">
        {this.state.users.map(user => (
          <div key={user.id} style={veryInlineStyle}>
            {user.name}
          </div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomInterpolation.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/CustomInterpolation.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import CustomInterpolation from './CustomInterpolation';
import ReactDOMClient from 'react-dom/client';

describe('custom interpolation', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(
        <CustomInterpolation onReady={resolve} />
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: DefaultParameters.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/DefaultParameters.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

function load(id = 0) {
  return [
    { id: id + 1, name: '1' },
    { id: id + 2, name: '2' },
    { id: id + 3, name: '3' },
    { id: id + 4, name: '4' },
  ];
}

export default class DefaultParameters extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const users = load();
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-default-parameters">
        {this.state.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DefaultParameters.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/DefaultParameters.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DefaultParameters from './DefaultParameters';
import ReactDOMClient from 'react-dom/client';

describe('default parameters', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(
        <DefaultParameters onReady={resolve} />
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: DestructuringAndAwait.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/DestructuringAndAwait.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

async function load() {
  return {
    users: [
      { id: 1, name: '1' },
      { id: 2, name: '2' },
      { id: 3, name: '3' },
      { id: 4, name: '4' },
    ],
  };
}

export default class DestructuringAndAwait extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const { users } = await load();
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-destructuring-and-await">
        {this.state.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DestructuringAndAwait.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/DestructuringAndAwait.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DestructuringAndAwait from './DestructuringAndAwait';
import ReactDOMClient from 'react-dom/client';

describe('destructuring and await', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(
        <DestructuringAndAwait onReady={resolve} />
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: Generators.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/Generators.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

function* load(limit) {
  let i = 1;
  while (i <= limit) {
    yield { id: i, name: i };
    i++;
  }
}

export default class Generators extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  componentDidMount() {
    const users = [];
    for (let user of load(4)) {
      users.push(user);
    }
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-generators">
        {this.state.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Generators.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/Generators.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Generators from './Generators';
import ReactDOMClient from 'react-dom/client';

describe('generators', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(<Generators onReady={resolve} />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: NullishCoalescing.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/NullishCoalescing.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

function load() {
  return [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
  ];
}

export default class NullishCoalescing extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const users = load();
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-nullish-coalescing">
        {this.state.users.map(user => (
          <div key={user.id}>{user.name ?? 'John Doe'}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: NullishCoalescing.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/NullishCoalescing.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import NullishCoalescing from './NullishCoalescing';
import ReactDOMClient from 'react-dom/client';

describe('nullish coalescing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(
        <NullishCoalescing onReady={resolve} />
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ObjectDestructuring.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/ObjectDestructuring.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

function load() {
  return [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
  ];
}

export default class ObjectDestructuring extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const users = load();
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-object-destructuring">
        {this.state.users.map(user => {
          const { id, ...rest } = user;
          // eslint-disable-next-line no-unused-vars
          const [{ name, ...innerRest }] = [{ ...rest }];
          return <div key={id}>{name}</div>;
        })}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

````
