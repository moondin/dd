---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 37
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 37 of 37)

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

---[FILE: index.test.js.snap]---
Location: create-react-app-main/test/fixtures/webpack-message-formatting/__snapshots__/index.test.js.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`formats aliased unknown export 1`] = `
Object {
  "stderr": "Creating an optimized production build...
Failed to compile.

./src/App.js
Attempted import error: 'bar' is not exported from './AppUnknownExport' (imported as 'bar2').


",
  "stdout": "",
}
`;

exports[`formats babel syntax error 1`] = `
Object {
  "stderr": "Creating an optimized production build...
Failed to compile.

./src/App.js
Syntax error: Unterminated JSX contents (8:13)

   6 |       <div>
   7 |         <span>
>  8 |       </div>
     |             ^
   9 |     );
  10 |   }
  11 | }


",
  "stdout": "",
}
`;

exports[`formats css syntax error 1`] = `
Object {
  "stderr": "Creating an optimized production build...
Failed to compile.

./src/AppCss.css
Syntax error: Unexpected } (3:2)

  1 | .App {
  2 |   color: red;
> 3 | }}
    |  ^
  4 |


",
  "stdout": "",
}
`;

exports[`formats eslint error 1`] = `
Object {
  "stderr": "Creating an optimized production build...
Failed to compile.

./src/App.js
  Line 4:13:  'b' is not defined  no-undef

Search for the keywords to learn more about each error.


",
  "stdout": "",
}
`;

exports[`formats eslint warning 1`] = `
Object {
  "stderr": "",
  "stdout": "Creating an optimized production build...
Compiled with warnings.

./src/App.js
  Line 3:10:  'foo' is defined but never used  no-unused-vars

Search for the keywords to learn more about each warning.
To ignore, add // eslint-disable-next-line to the line before.

",
}
`;

exports[`formats file not found error 1`] = `
Object {
  "stderr": "Creating an optimized production build...
Failed to compile.

./src/App.js
Cannot find file './ThisFileSouldNotExist' in './src'.


",
  "stdout": "",
}
`;

exports[`formats missing package 1`] = `
Object {
  "stderr": "Creating an optimized production build...
Failed to compile.

./src/App.js
Cannot find module: 'unknown-package'. Make sure this package is installed.

You can install this package by running: yarn add unknown-package.


",
  "stdout": "",
}
`;

exports[`formats no default export 1`] = `
Object {
  "stderr": "Creating an optimized production build...
Failed to compile.

./src/App.js
Attempted import error: './ExportNoDefault' does not contain a default export (imported as 'myImport').


",
  "stdout": "",
}
`;

exports[`formats out of scope error 1`] = `
Object {
  "stderr": "Creating an optimized production build...
Failed to compile.

./src/App.js
You attempted to import ../OutOfScopeImport which falls outside of the project src/ directory. Relative imports outside of src/ are not supported.
You can either move it inside src/, or add a symlink to it from project's node_modules/.


",
  "stdout": "",
}
`;

exports[`formats unknown export 1`] = `
Object {
  "stderr": "Creating an optimized production build...
Failed to compile.

./src/App.js
Attempted import error: 'bar' is not exported from './AppUnknownExport'.


",
  "stdout": "",
}
`;
```

--------------------------------------------------------------------------------

---[FILE: test-setup.js]---
Location: create-react-app-main/test/fixtures/__shared__/test-setup.js

```javascript
'use strict';

const path = require('path');
const fs = require('fs-extra');
const TestSetup = require('./util/setup');

const fixturePath = path.dirname(module.parent.filename);
const fixtureName = path.basename(fixturePath);
const disablePnp = fs.existsSync(path.resolve(fixturePath, '.disable-pnp'));
const testSetup = new TestSetup(fixtureName, fixturePath, {
  pnp: !disablePnp,
});

beforeAll(async () => {
  await testSetup.setup();
}, 1000 * 60 * 5);
afterAll(async () => {
  await testSetup.teardown();
});

beforeEach(() => jest.setTimeout(1000 * 60 * 5));

module.exports = testSetup;
```

--------------------------------------------------------------------------------

---[FILE: index.html]---
Location: create-react-app-main/test/fixtures/__shared__/template/public/index.html

```text
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: scripts.js]---
Location: create-react-app-main/test/fixtures/__shared__/util/scripts.js

```javascript
'use strict';

const execa = require('execa');
const getPort = require('get-port');
const stripAnsi = require('strip-ansi');
const waitForLocalhost = require('wait-for-localhost');

function execaSafe(...args) {
  return execa(...args)
    .then(({ stdout, stderr, ...rest }) => ({
      fulfilled: true,
      rejected: false,
      stdout: stripAnsi(stdout),
      stderr: stripAnsi(stderr),
      ...rest,
    }))
    .catch(err => ({
      fulfilled: false,
      rejected: true,
      reason: err,
      stdout: '',
      stderr: stripAnsi(err.message.split('\n').slice(2).join('\n')),
    }));
}

module.exports = class ReactScripts {
  constructor(root) {
    this.root = root;
  }

  async start({ smoke = false, env = {} } = {}) {
    const port = await getPort();
    const options = {
      cwd: this.root,
      env: Object.assign(
        {},
        {
          CI: 'false',
          FORCE_COLOR: '0',
          BROWSER: 'none',
          PORT: port,
        },
        env
      ),
    };

    if (smoke) {
      return await execaSafe('npm', ['start', '--smoke-test'], options);
    }
    const startProcess = execa('npm', ['start'], options);
    await waitForLocalhost({ port });
    return {
      port,
      done() {
        startProcess.kill('SIGKILL');
      },
    };
  }

  async build({ env = {} } = {}) {
    return await execaSafe('npm', ['run', 'build'], {
      cwd: this.root,
      env: Object.assign({}, { CI: 'false', FORCE_COLOR: '0' }, env),
    });
  }

  async serve() {
    const port = await getPort();
    const serveProcess = execa(
      'npm',
      ['run', 'serve', '--', '-p', port, '-s', 'build/'],
      {
        cwd: this.root,
      }
    );
    await waitForLocalhost({ port });
    return {
      port,
      done() {
        serveProcess.kill('SIGKILL');
      },
    };
  }

  async test({ jestEnvironment = 'jsdom', env = {} } = {}) {
    return await execaSafe('npm', ['test', '--env', jestEnvironment, '--ci'], {
      cwd: this.root,
      env: Object.assign({}, { CI: 'true' }, env),
    });
  }
};
```

--------------------------------------------------------------------------------

---[FILE: setup.js]---
Location: create-react-app-main/test/fixtures/__shared__/util/setup.js

```javascript
'use strict';

const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const tempy = require('tempy');
const ReactScripts = require('./scripts');

module.exports = class TestSetup {
  constructor(fixtureName, templateDirectory) {
    this.fixtureName = fixtureName;

    this.templateDirectory = templateDirectory;
    this.testDirectory = null;
    this._scripts = null;

    this.setup = this.setup.bind(this);
    this.teardown = this.teardown.bind(this);

    this.isLocal = !(process.env.CI && process.env.CI !== 'false');
  }

  async setup() {
    await this.teardown();
    this.testDirectory = tempy.directory();
    await fs.copy(
      path.resolve(__dirname, '..', 'template'),
      this.testDirectory
    );
    await fs.copy(this.templateDirectory, this.testDirectory);
    await fs.remove(path.resolve(this.testDirectory, 'test.partial.js'));

    const packageJson = await fs.readJson(
      path.resolve(this.testDirectory, 'package.json')
    );

    const shouldInstallScripts = !this.isLocal;
    if (shouldInstallScripts) {
      packageJson.dependencies = Object.assign({}, packageJson.dependencies, {
        'react-scripts': 'latest',
      });
    }
    packageJson.scripts = Object.assign({}, packageJson.scripts, {
      start: 'react-scripts start',
      build: 'react-scripts build',
      test: 'react-scripts test',
    });
    packageJson.license = packageJson.license || 'UNLICENSED';
    await fs.writeJson(
      path.resolve(this.testDirectory, 'package.json'),
      packageJson
    );

    await execa('npm', ['install'], {
      cwd: this.testDirectory,
    });

    if (!shouldInstallScripts) {
      await fs.ensureSymlink(
        path.resolve(
          path.resolve(
            __dirname,
            '../../../..',
            'packages',
            'react-scripts',
            'bin',
            'react-scripts.js'
          )
        ),
        path.join(this.testDirectory, 'node_modules', '.bin', 'react-scripts')
      );
      await execa('npm', ['link', 'react-scripts'], {
        cwd: this.testDirectory,
      });
    }
  }

  get scripts() {
    if (this.testDirectory == null) {
      return null;
    }
    if (this._scripts == null) {
      this._scripts = new ReactScripts(this.testDirectory);
    }
    return this._scripts;
  }

  async teardown() {
    if (this.testDirectory != null) {
      try {
        await fs.remove(this.testDirectory);
      } catch (ex) {
        if (this.isLocal) {
          throw ex;
        } else {
          // In CI, don't worry if the test directory was not able to be deleted
        }
      }
      this.testDirectory = null;
      this._scripts = null;
    }
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.test.js]---
Location: create-react-app-main/test/integration/create-react-app/index.test.js

```javascript
'use strict';

const execa = require('execa');
const { mkdirp, writeFileSync, existsSync, readdirSync } = require('fs-extra');
const { join } = require('path');
const { rmSync } = require('fs');

const cli = require.resolve('create-react-app/index.js');

// Increase the timeout for GitHub macOS runner
jest.setTimeout(1000 * 60 * (process.env.RUNNER_OS === 'macOS' ? 10 : 5));

const projectName = 'test-app';
const genPath = join(__dirname, projectName);

const generatedFiles = [
  '.gitignore',
  'README.md',
  'node_modules',
  'package.json',
  'public',
  'src',
  'package-lock.json',
];

const removeGenPath = () => {
  rmSync(genPath, {
    recursive: true,
    force: true,
  });
};

beforeEach(removeGenPath);
afterAll(async () => {
  removeGenPath();
  // Defer jest result output waiting for stdout to flush
  await new Promise(resolve => setTimeout(resolve, 100));
});

const run = async (args, options) => {
  process.stdout.write(
    `::group::Test "${
      expect.getState().currentTestName
    }" - "create-react-app ${args.join(' ')}" output:\n`
  );
  const result = execa('node', [cli].concat(args), options);
  result.stdout.on('data', chunk =>
    process.stdout.write(chunk.toString('utf8'))
  );
  const childProcessResult = await result;
  process.stdout.write(`ExitCode: ${childProcessResult.exitCode}\n`);
  process.stdout.write('::endgroup::\n');
  const files = existsSync(genPath)
    ? readdirSync(genPath).filter(f => existsSync(join(genPath, f)))
    : null;
  return {
    ...childProcessResult,
    files,
  };
};

const expectAllFiles = (arr1, arr2) =>
  expect([...arr1].sort()).toEqual([...arr2].sort());

describe('create-react-app', () => {
  it('check yarn installation', async () => {
    const { exitCode } = await execa('yarn', ['--version']);

    // Assert for exit code
    expect(exitCode).toBe(0);
  });

  it('asks to supply an argument if none supplied', async () => {
    const { exitCode, stderr, files } = await run([], { reject: false });

    // Assertions
    expect(exitCode).toBe(1);
    expect(stderr).toContain('Please specify the project directory');
    expect(files).toBe(null);
  });

  it('creates a project on supplying a name as the argument', async () => {
    const { exitCode, files } = await run([projectName], { cwd: __dirname });

    // Assert for exit code
    expect(exitCode).toBe(0);

    // Assert for the generated files
    expectAllFiles(files, generatedFiles);
  });

  it('warns about conflicting files in path', async () => {
    // Create the temporary directory
    await mkdirp(genPath);

    // Create a package.json file
    const pkgJson = join(genPath, 'package.json');
    writeFileSync(pkgJson, '{ "foo": "bar" }');

    const { exitCode, stdout, files } = await run([projectName], {
      cwd: __dirname,
      reject: false,
    });

    // Assert for exit code
    expect(exitCode).toBe(1);

    // Assert for the expected message
    expect(stdout).toContain(
      `The directory ${projectName} contains files that could conflict`
    );

    // Existing file is still there
    expectAllFiles(files, ['package.json']);
  });

  it('creates a project in the current directory', async () => {
    // Create temporary directory
    await mkdirp(genPath);

    // Create a project in the current directory
    const { exitCode, files } = await run(['.'], { cwd: genPath });

    // Assert for exit code
    expect(exitCode).toBe(0);

    // Assert for the generated files
    expectAllFiles(files, generatedFiles);
  });

  it('uses yarn as the package manager', async () => {
    const { exitCode, files } = await run([projectName], {
      cwd: __dirname,
      env: { npm_config_user_agent: 'yarn' },
    });

    // Assert for exit code
    expect(exitCode).toBe(0);

    // Assert for the generated files
    const generatedFilesWithYarn = generatedFiles.map(file =>
      file === 'package-lock.json' ? 'yarn.lock' : file
    );

    expectAllFiles(files, generatedFilesWithYarn);
  });

  it('creates a project based on the typescript template', async () => {
    const { exitCode, files } = await run(
      [projectName, '--template', 'typescript'],
      {
        cwd: __dirname,
      }
    );

    // Assert for exit code
    expect(exitCode).toBe(0);

    // Assert for the generated files
    // TODO: why is there no tsconfig.json file on the template?
    expectAllFiles(files, generatedFiles);
  });
});
```

--------------------------------------------------------------------------------

````
