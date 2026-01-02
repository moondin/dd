---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 32
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 32 of 37)

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

---[FILE: ObjectDestructuring.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/ObjectDestructuring.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ObjectDestructuring from './ObjectDestructuring';
import ReactDOMClient from 'react-dom/client';

describe('object destructuring', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(
        <ObjectDestructuring onReady={resolve} />
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ObjectSpread.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/ObjectSpread.js
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

function load(baseUser) {
  return [
    { id: 1, name: '1', ...baseUser },
    { id: 2, name: '2', ...baseUser },
    { id: 3, name: '3', ...baseUser },
    { id: 4, name: '4', ...baseUser },
  ];
}

export default class ObjectSpread extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const users = load({ age: 42 });
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-object-spread">
        {this.state.users.map(user => (
          <div key={user.id}>
            {user.name}: {user.age}
          </div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ObjectSpread.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/ObjectSpread.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ObjectSpread from './ObjectSpread';
import ReactDOMClient from 'react-dom/client';

describe('object spread', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(<ObjectSpread onReady={resolve} />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: OptionalChaining.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/OptionalChaining.js
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

export default class OptionalChaining extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const users = load?.();
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-optional-chaining">
        {this.state.users.map(user => (
          <div key={user.id}>{user?.name}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: OptionalChaining.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/OptionalChaining.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import OptionalChaining from './OptionalChaining';
import ReactDOMClient from 'react-dom/client';

describe('optional chaining', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(
        <OptionalChaining onReady={resolve} />
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: Promises.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/Promises.js
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
  return Promise.resolve([
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
  ]);
}

export default class Promises extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  componentDidMount() {
    load().then(users => {
      this.setState({ users });
    });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-promises">
        {this.state.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Promises.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/Promises.test.js
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

describe('promises', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return import('./Promises').then(({ default: Promises }) => {
      return new Promise(resolve => {
        ReactDOMClient.createRoot(div).render(<Promises onReady={resolve} />);
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RestAndDefault.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/RestAndDefault.js
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

function load({ id, ...rest } = { id: 0, user: { id: 42, name: '42' } }) {
  return [
    { id: id + 1, name: '1' },
    { id: id + 2, name: '2' },
    { id: id + 3, name: '3' },
    rest.user,
  ];
}

export default class RestAndDefault extends Component {
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
      <div id="feature-rest-and-default">
        {this.state.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: RestAndDefault.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/RestAndDefault.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import RestAndDefault from './RestAndDefault';
import ReactDOMClient from 'react-dom/client';

describe('rest + default', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(
        <RestAndDefault onReady={resolve} />
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RestParameters.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/RestParameters.js
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

function load({ id = 0, ...rest }) {
  return [
    { id: id + 1, name: '1' },
    { id: id + 2, name: '2' },
    { id: id + 3, name: '3' },
    rest.user,
  ];
}

export default class RestParameters extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const users = load({ id: 0, user: { id: 42, name: '42' } });
    this.setState({ users });
  }

  componentDidUpdate() {
    this.props.onReady();
  }

  render() {
    return (
      <div id="feature-rest-parameters">
        {this.state.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: RestParameters.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/RestParameters.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import RestParameters from './RestParameters';
import ReactDOMClient from 'react-dom/client';

describe('rest parameters', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(
        <RestParameters onReady={resolve} />
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TemplateInterpolation.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/TemplateInterpolation.js
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

function load(name) {
  return [
    { id: 1, name: `${name}1` },
    { id: 2, name: `${name}2` },
    { id: 3, name: `${name}3` },
    { id: 4, name: `${name}4` },
  ];
}

export default class TemplateInterpolation extends Component {
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
      <div id="feature-template-interpolation">
        {this.state.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: TemplateInterpolation.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/syntax/TemplateInterpolation.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import TemplateInterpolation from './TemplateInterpolation';
import ReactDOMClient from 'react-dom/client';

describe('template interpolation', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise(resolve => {
      ReactDOMClient.createRoot(div).render(
        <TemplateInterpolation onReady={resolve} />
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CssInclusion.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/CssInclusion.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import './assets/style.css';

const CssInclusion = () => (
  <p id="feature-css-inclusion">We love useless text.</p>
);

export default CssInclusion;
```

--------------------------------------------------------------------------------

---[FILE: CssInclusion.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/CssInclusion.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import CssInclusion from './CssInclusion';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('css inclusion', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<CssInclusion />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CssModulesInclusion.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/CssModulesInclusion.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import styles from './assets/style.module.css';
import indexStyles from './assets/index.module.css';

const CssModulesInclusion = () => (
  <div>
    <p className={styles.cssModulesInclusion}>CSS Modules are working!</p>
    <p className={indexStyles.cssModulesInclusion}>
      CSS Modules with index are working!
    </p>
  </div>
);

export default CssModulesInclusion;
```

--------------------------------------------------------------------------------

---[FILE: CssModulesInclusion.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/CssModulesInclusion.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import CssModulesInclusion from './CssModulesInclusion';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('css modules inclusion', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<CssModulesInclusion />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: DynamicImport.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/DynamicImport.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

const DynamicImport = () => {
  return <>Hello World!</>;
};

export default DynamicImport;
```

--------------------------------------------------------------------------------

---[FILE: DynamicImport.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/DynamicImport.test.js
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
import { flushSync } from 'react-dom';

describe('dynamic import', () => {
  it('renders without crashing', async () => {
    const DynamicImport = (await import('./DynamicImport')).default;
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<DynamicImport />);
    });
    expect(div.textContent).toBe('Hello World!');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ImageInclusion.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/ImageInclusion.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import tiniestCat from './assets/tiniest-cat.jpg';

const ImageInclusion = () => (
  <img id="feature-image-inclusion" src={tiniestCat} alt="tiniest cat" />
);

export default ImageInclusion;
```

--------------------------------------------------------------------------------

---[FILE: ImageInclusion.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/ImageInclusion.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ImageInclusion from './ImageInclusion';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('image inclusion', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<ImageInclusion />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: JsonInclusion.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/JsonInclusion.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import abstractJson from './assets/abstract.json';

const { abstract } = abstractJson;

const JsonInclusion = () => (
  <summary id="feature-json-inclusion">{abstract}</summary>
);

export default JsonInclusion;
```

--------------------------------------------------------------------------------

---[FILE: JsonInclusion.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/JsonInclusion.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import JsonInclusion from './JsonInclusion';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('JSON inclusion', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<JsonInclusion />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: LinkedModules.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/LinkedModules.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import './assets/style.css';
import { test, version } from 'test-integrity';

const LinkedModules = () => {
  const v = version();
  if (!test() || v !== '2.0.0') {
    throw new Error('Functionality test did not pass.');
  }
  return <p id="feature-linked-modules">{v}</p>;
};

export default LinkedModules;
```

--------------------------------------------------------------------------------

---[FILE: LinkedModules.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/LinkedModules.test.js
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
import { test, version } from 'test-integrity';
import LinkedModules from './LinkedModules';
import { flushSync } from 'react-dom';

describe('linked modules', () => {
  it('has integrity', () => {
    expect(test()).toBeTruthy();
    expect(version() === '2.0.0').toBeTruthy();
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<LinkedModules />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: NoExtInclusion.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/NoExtInclusion.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import aFileWithoutExt from './assets/aFileWithoutExt';

const text = aFileWithoutExt.includes('base64')
  ? atob(aFileWithoutExt.split('base64,')[1]).trim()
  : aFileWithoutExt;

const NoExtInclusion = () => (
  <a id="feature-no-ext-inclusion" href={text}>
    aFileWithoutExt
  </a>
);

export default NoExtInclusion;
```

--------------------------------------------------------------------------------

---[FILE: NoExtInclusion.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/NoExtInclusion.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import NoExtInclusion from './NoExtInclusion';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('no ext inclusion', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<NoExtInclusion />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SassInclusion.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/SassInclusion.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import './assets/sass-styles.sass';

const SassInclusion = () => (
  <p id="feature-sass-inclusion">We love useless text.</p>
);

export default SassInclusion;
```

--------------------------------------------------------------------------------

---[FILE: SassInclusion.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/SassInclusion.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import SassInclusion from './SassInclusion';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('sass inclusion', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<SassInclusion />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SassModulesInclusion.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/SassModulesInclusion.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import styles from './assets/sass-styles.module.sass';
import indexStyles from './assets/index.module.sass';

const SassModulesInclusion = () => (
  <div>
    <p className={styles.sassModulesInclusion}>SASS Modules are working!</p>
    <p className={indexStyles.sassModulesIndexInclusion}>
      SASS Modules with index are working!
    </p>
  </div>
);

export default SassModulesInclusion;
```

--------------------------------------------------------------------------------

---[FILE: SassModulesInclusion.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/SassModulesInclusion.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import SassModulesInclusion from './SassModulesInclusion';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('sass modules inclusion', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<SassModulesInclusion />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ScssInclusion.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/ScssInclusion.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import './assets/scss-styles.scss';

const ScssInclusion = () => (
  <p id="feature-scss-inclusion">We love useless text.</p>
);

export default ScssInclusion;
```

--------------------------------------------------------------------------------

---[FILE: ScssInclusion.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/ScssInclusion.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ScssInclusion from './ScssInclusion';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('scss inclusion', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<ScssInclusion />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ScssModulesInclusion.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/ScssModulesInclusion.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import styles from './assets/scss-styles.module.scss';
import indexStyles from './assets/index.module.scss';

const ScssModulesInclusion = () => (
  <div>
    <p className={styles.scssModulesInclusion}>SCSS Modules are working!</p>
    <p className={indexStyles.scssModulesIndexInclusion}>
      SCSS Modules with index are working!
    </p>
  </div>
);

export default ScssModulesInclusion;
```

--------------------------------------------------------------------------------

---[FILE: ScssModulesInclusion.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/ScssModulesInclusion.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ScssModulesInclusion from './ScssModulesInclusion';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('scss modules inclusion', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<ScssModulesInclusion />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SvgComponent.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/SvgComponent.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { ReactComponent as Logo } from './assets/logo.svg';

const SvgComponent = () => {
  return <Logo id="feature-svg-component" />;
};

export const SvgComponentWithRef = React.forwardRef((props, ref) => (
  <Logo id="feature-svg-component-with-ref" ref={ref} />
));

export default SvgComponent;
```

--------------------------------------------------------------------------------

---[FILE: SvgComponent.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/SvgComponent.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import SvgComponent, { SvgComponentWithRef } from './SvgComponent';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

// TODO: these fail with React 19 due to the JSX transform mismatch.
describe.skip('svg component', () => {
  it('renders without crashing', async () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<SvgComponent />);
    });
    expect(div.textContent).toBe('logo.svg');
  });

  it('svg root element equals the passed ref', async () => {
    const div = document.createElement('div');
    const someRef = React.createRef();
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(
        <SvgComponentWithRef ref={someRef} />
      );
    });
    const svgElement = div.getElementsByTagName('svg');
    expect(svgElement).toHaveLength(1);
    expect(svgElement[0]).toBe(someRef.current);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SvgInclusion.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/SvgInclusion.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import logo from './assets/logo.svg';

const SvgInclusion = () => (
  <img id="feature-svg-inclusion" src={logo} alt="logo" />
);

export default SvgInclusion;
```

--------------------------------------------------------------------------------

---[FILE: SvgInclusion.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/SvgInclusion.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import SvgInclusion from './SvgInclusion';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('svg inclusion', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<SvgInclusion />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SvgInCss.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/SvgInCss.js
Signals: React

```javascript
import React from 'react';
import './assets/svg.css';

const SvgInCss = () => <div id="feature-svg-in-css" />;

export default SvgInCss;
```

--------------------------------------------------------------------------------

---[FILE: SvgInCss.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/SvgInCss.test.js
Signals: React

```javascript
import React from 'react';
import SvgInCss from './SvgInCss';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('svg in css', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<SvgInCss />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: UnknownExtInclusion.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/UnknownExtInclusion.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import aFileWithExtUnknown from './assets/aFileWithExt.unknown';

const text = aFileWithExtUnknown.includes('base64')
  ? atob(aFileWithExtUnknown.split('base64,')[1]).trim()
  : aFileWithExtUnknown;

const UnknownExtInclusion = () => (
  <a id="feature-unknown-ext-inclusion" href={text}>
    aFileWithExtUnknown
  </a>
);

export default UnknownExtInclusion;
```

--------------------------------------------------------------------------------

---[FILE: UnknownExtInclusion.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/UnknownExtInclusion.test.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import UnknownExtInclusion from './UnknownExtInclusion';
import ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

describe('unknown ext inclusion', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    flushSync(() => {
      ReactDOMClient.createRoot(div).render(<UnknownExtInclusion />);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: abstract.json]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/assets/abstract.json

```json
{
  "abstract": "This is an abstract."
}
```

--------------------------------------------------------------------------------

---[FILE: aFileWithExt.unknown]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/assets/aFileWithExt.unknown

```text
Whoooo, spooky!
```

--------------------------------------------------------------------------------

---[FILE: aFileWithoutExt]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/assets/aFileWithoutExt

```text
This is just a file without an extension
```

--------------------------------------------------------------------------------

---[FILE: index.module.css]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/assets/index.module.css

```text
.cssModulesIndexInclusion {
  background: darkblue;
  color: lightblue;
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.sass]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/assets/index.module.sass

```text
.sassModulesIndexInclusion
  background: darkblue
  color: lightblue
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/features/webpack/assets/index.module.scss

```text
.scssModulesIndexInclusion {
  background: darkblue;
  color: lightblue;
}
```

--------------------------------------------------------------------------------

````
