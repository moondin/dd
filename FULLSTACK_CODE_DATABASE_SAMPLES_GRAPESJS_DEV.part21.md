---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 21
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 21 of 97)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - grapesjs-dev
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/grapesjs-dev
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: build.ts]---
Location: grapesjs-dev/packages/cli/src/build.ts

```typescript
import {
  printRow,
  printError,
  buildWebpackArgs,
  normalizeJsonOpt,
  copyRecursiveSync,
  rootResolve,
  babelConfig,
  log,
  writeFile,
} from './utils';
import { generateDtsBundle } from 'dts-bundle-generator';
import webpack from 'webpack';
import fs from 'fs';
import webpackConfig from './webpack.config';
import { exec } from 'child_process';
import chalk from 'chalk';
import rimraf from 'rimraf';
import { transformFileSync } from '@babel/core';

interface BuildOptions {
  verbose?: boolean;
  patch?: boolean;
  statsOutput?: string;
  localePath?: string;
  dts?: 'include' | 'skip' | 'only';
}

/**
 * Build locale files
 * @param {Object} opts
 */
export const buildLocale = async (opts: BuildOptions = {}) => {
  const { localePath } = opts;
  if (!fs.existsSync(rootResolve(localePath))) return;
  printRow('Start building locale files...', { lineDown: 0 });

  await rimraf('locale');

  const localDst = rootResolve('locale');
  copyRecursiveSync(rootResolve(localePath), localDst);

  // Create locale/index.js file
  let result = '';
  fs.readdirSync(localDst).forEach((file) => {
    const name = file.split('.')[0];
    result += `export { default as ${name} } from './${name}'\n`;
  });
  fs.writeFileSync(`${localDst}/index.js`, result);

  // Compile files
  const babelOpts = { ...babelConfig(buildWebpackArgs(opts) as any) };
  fs.readdirSync(localDst).forEach((file) => {
    const filePath = `${localDst}/${file}`;
    const esModuleFileName = filePath.replace(/\.[^.]+$/, '.mjs');
    fs.copyFileSync(filePath, esModuleFileName);
    const compiled = transformFileSync(filePath, babelOpts).code;
    fs.writeFileSync(filePath, compiled);
  });

  // Remove the index.mjs as it is useless
  fs.unlinkSync(`${localDst}/index.mjs`);

  printRow('Locale files building completed successfully!');
};

/**
 * Build TS declaration file
 * @param {Object} opts
 */
export const buildDeclaration = async (opts: BuildOptions = {}) => {
  const filePath = rootResolve('src/index.ts');
  if (!fs.existsSync(filePath)) return;

  printRow('Start building TS declaration file...', { lineDown: 0 });

  const entry = { filePath, output: { noBanner: true } };
  const bundleOptions = { preferredConfigPath: rootResolve('tsconfig.json') };
  const result = generateDtsBundle([entry], bundleOptions)[0];
  await writeFile(rootResolve('dist/index.d.ts'), result);

  printRow('TS declaration file building completed successfully!');
};

/**
 * Build the library files
 * @param {Object} opts
 */
export default (opts: BuildOptions = {}) => {
  printRow('Start building the library...');
  const isVerb = opts.verbose;
  const { dts } = opts;
  isVerb && log(chalk.yellow('Build config:\n'), opts, '\n');

  const buildWebpack = () => {
    const buildConf = {
      ...webpackConfig({
        production: 1,
        args: buildWebpackArgs(opts),
        cmdOpts: opts,
      }),
      ...normalizeJsonOpt(opts, 'config'),
    };

    if (dts === 'only') {
      return buildDeclaration(opts);
    }

    webpack(buildConf, async (err, stats) => {
      const errors = err || (stats ? stats.hasErrors() : false);
      const statConf = {
        hash: false,
        colors: true,
        builtAt: false,
        entrypoints: false,
        modules: false,
        ...normalizeJsonOpt(opts, 'stats'),
      };

      if (stats) {
        opts.statsOutput && fs.writeFileSync(rootResolve(opts.statsOutput), JSON.stringify(stats.toJson()));
        isVerb && log(chalk.yellow('Stats config:\n'), statConf, '\n');
        const result = stats.toString(statConf);
        log(result, '\n');
      }

      await buildLocale(opts);

      if (dts !== 'skip') {
        await buildDeclaration(opts);
      }

      if (errors) {
        printError(`Error during building`);
        console.error(err);
      } else {
        printRow('Building completed successfully!');
      }
    });
  };

  if (opts.patch) {
    isVerb && log(chalk.yellow('Patch the version'), '\n');
    exec('npm version --no-git-tag-version patch', buildWebpack);
  } else {
    buildWebpack();
  }
};
```

--------------------------------------------------------------------------------

---[FILE: cli.ts]---
Location: grapesjs-dev/packages/cli/src/cli.ts

```typescript
import yargs from 'yargs';
import fs from 'fs';
import path from 'path';
import { serve, build, init } from './main';
import chalk from 'chalk';
import { printError } from './utils';
import { version } from '../package.json';

yargs.usage(chalk.green.bold(fs.readFileSync(path.resolve(__dirname, './banner.txt'), 'utf8') + `\nv${version}`));

const webpackOptions = (yargs) => {
  yargs
    .positional('config', {
      describe: 'webpack configuration options',
      type: 'string',
      default: '{}',
    })
    .positional('babel', {
      describe: 'Babel configuration object',
      type: 'string',
      default: '{}',
    })
    .positional('targets', {
      describe: 'Browser targets in browserslist query',
      type: 'string',
      default: '> 0.25%, not dead',
    })
    .positional('entry', {
      describe: 'Library entry point',
      type: 'string',
      default: 'src/index',
    })
    .positional('output', {
      describe: 'Build destination directory',
      type: 'string',
      default: 'dist',
    });
};

export const createCommands = (yargs) => {
  return yargs
    .command(
      ['serve [port]', 'server'],
      'Start the server',
      (yargs) => {
        yargs
          .positional('devServer', {
            describe: 'webpack-dev-server options',
            type: 'string',
            default: '{}',
          })
          .positional('host', {
            alias: 'h',
            describe: 'Host to bind on',
            type: 'string',
            default: 'localhost',
          })
          .positional('port', {
            alias: 'p',
            describe: 'Port to bind on',
            type: 'number',
            default: 8080,
          })
          .positional('htmlWebpack', {
            describe: 'html-webpack-plugin options',
            type: 'string',
            default: '{}',
          });
        webpackOptions(yargs);
      },
      (argv) => serve(argv),
    )
    .command(
      'build',
      'Build the source',
      (yargs) => {
        yargs
          .positional('stats', {
            describe: 'Options for webpack Stats instance',
            type: 'string',
            default: '{}',
          })
          .positional('statsOutput', {
            describe: 'Specify the path where to output webpack stats file (eg. "stats.json")',
            type: 'string',
            default: '',
          })
          .positional('patch', {
            describe: 'Increase automatically the patch version',
            type: 'boolean',
            default: true,
          })
          .positional('localePath', {
            describe: 'Path to the directory containing locale files',
            type: 'string',
            default: 'src/locale',
          })
          .positional('dts', {
            describe: 'Generate typescript dts file ("include", "skip", "only")',
            type: 'string',
            default: 'include',
          });
        webpackOptions(yargs);
      },
      (argv) => build(argv),
    )
    .command(
      'init',
      'Init GrapesJS plugin project',
      (yargs) => {
        yargs
          .positional('yes', {
            alias: 'y',
            describe: 'All default answers',
            type: 'boolean',
            default: false,
          })
          .positional('name', {
            describe: 'Name of the project',
            type: 'string',
          })
          .positional('rName', {
            describe: 'Repository name',
            type: 'string',
          })
          .positional('user', {
            describe: 'Repository username',
            type: 'string',
          })
          .positional('components', {
            describe: 'Indicate to include custom component types API',
            type: 'boolean',
          })
          .positional('blocks', {
            describe: 'Indicate to include blocks API',
            type: 'boolean',
          })
          .positional('i18n', {
            describe: 'Indicate to include the support for i18n',
            type: 'boolean',
          })
          .positional('license', {
            describe: 'License of the project',
            type: 'string',
          });
      },
      (argv) => init(argv),
    )
    .options({
      verbose: {
        alias: 'v',
        description: 'Run with verbose logging',
        type: 'boolean', // boolean | number | string
        default: false,
      },
    })
    .recommendCommands()
    .strict();
};

export const argsToOpts = async () => {
  return await createCommands(yargs).parse();
};

export const run = async (opts = {}) => {
  try {
    let options = await argsToOpts();
    if (!options._.length) yargs.showHelp();
  } catch (error) {
    printError((error.stack || error).toString());
  }
};

run();
```

--------------------------------------------------------------------------------

---[FILE: init.ts]---
Location: grapesjs-dev/packages/cli/src/init.ts

```typescript
import inquirer from 'inquirer';
import { printRow, isUndefined, log, ensureDir } from './utils';
import Listr from 'listr';
import path from 'path';
import fs from 'fs';
import spdxLicenseList from 'spdx-license-list/full';
import template from 'lodash.template';
import { version } from '../package.json';

interface InitOptions {
  license?: string;
  name?: string;
  components?: boolean;
  blocks?: boolean;
  i18n?: boolean;
  verbose?: boolean;
  rName?: string;
  user?: string;
  yes?: boolean;
}

const tmpPath = './template';
const rootPath = process.cwd();

const getName = (str: string) =>
  str
    .replace(/\_/g, '-')
    .split('-')
    .filter((i) => i)
    .map((i) => i[0].toUpperCase() + i.slice(1))
    .join(' ');

const getTemplateFileContent = (pth: string) => {
  const pt = path.resolve(__dirname, `${tmpPath}/${pth}`);
  return fs.readFileSync(pt, 'utf8');
};

const resolveRoot = (pth: string) => {
  return path.resolve(rootPath, pth);
};

const resolveLocal = (pth: string) => {
  return path.resolve(__dirname, `${tmpPath}/${pth}`);
};

const createSourceFiles = async (opts: InitOptions = {}) => {
  const rdmSrc = getTemplateFileContent('README.md');
  const rdmDst = resolveRoot('README.md');
  const indxSrc = getTemplateFileContent('src/index.js');
  const indxDst = resolveRoot('src/index.js');
  const indexCnt = getTemplateFileContent('_index.html');
  const indexDst = resolveRoot('_index.html');
  const license = spdxLicenseList[opts.license];
  const licenseTxt =
    license &&
    (license.licenseText || '')
      .replace('<year>', `${new Date().getFullYear()}-current`)
      .replace('<copyright holders>', opts.name);
  ensureDir(indxDst);
  // write src/_index.html
  fs.writeFileSync(indxDst, template(indxSrc)(opts).trim());
  // write _index.html
  fs.writeFileSync(indexDst, template(indexCnt)(opts));
  // Write README.md
  fs.writeFileSync(rdmDst, template(rdmSrc)(opts));
  // write LICENSE
  licenseTxt && fs.writeFileSync(resolveRoot('LICENSE'), licenseTxt);
  // Copy files
  fs.copyFileSync(resolveLocal('.gitignore-t'), resolveRoot('.gitignore'));
  fs.copyFileSync(resolveLocal('.npmignore-t'), resolveRoot('.npmignore'));
  fs.copyFileSync(resolveLocal('tsconfig.json'), resolveRoot('tsconfig.json'));
};

const createFileComponents = (opts: InitOptions = {}) => {
  const filepath = 'src/components.js';
  const cmpSrc = resolveLocal(filepath);
  const cmpDst = resolveRoot(filepath);
  opts.components && fs.copyFileSync(cmpSrc, cmpDst);
};

const createFileBlocks = (opts: InitOptions = {}) => {
  const filepath = 'src/blocks.js';
  const blkSrc = resolveLocal(filepath);
  const blkDst = resolveRoot(filepath);
  opts.blocks && fs.copyFileSync(blkSrc, blkDst);
};

const createI18n = (opts = {}) => {
  const enPath = 'src/locale/en.js';
  const tmpEn = getTemplateFileContent(enPath);
  const dstEn = resolveRoot(enPath);
  ensureDir(dstEn);
  fs.writeFileSync(dstEn, template(tmpEn)(opts));
};

const createPackage = (opts = {}) => {
  const filepath = 'package.json';
  const cnt = getTemplateFileContent(filepath);
  const dst = resolveRoot(filepath);
  fs.writeFileSync(
    dst,
    template(cnt)({
      ...opts,
      version,
    }),
  );
};

const checkBoolean = (value) => (value && value !== 'false' ? true : false);

export const initPlugin = async (opts: InitOptions = {}) => {
  printRow('Start project creation...');
  opts.components = checkBoolean(opts.components);
  opts.blocks = checkBoolean(opts.blocks);
  opts.i18n = checkBoolean(opts.i18n);

  const tasks = new Listr([
    {
      title: 'Creating initial source files',
      task: () => createSourceFiles(opts),
    },
    {
      title: 'Creating custom Component Type file',
      task: () => createFileComponents(opts),
      enabled: () => opts.components,
    },
    {
      title: 'Creating Blocks file',
      task: () => createFileBlocks(opts),
      enabled: () => opts.blocks,
    },
    {
      title: 'Creating i18n structure',
      task: () => createI18n(opts),
      enabled: () => opts.i18n,
    },
    {
      title: 'Update package.json',
      task: () => createPackage(opts),
    },
  ]);
  await tasks.run();
};

export default async (opts: InitOptions = {}) => {
  const rootDir = path.basename(process.cwd());
  const questions = [];
  const { verbose, name, rName, user, yes, components, blocks, i18n, license } = opts;
  let results = {
    name: name || getName(rootDir),
    rName: rName || rootDir,
    user: user || 'YOUR-USERNAME',
    components: isUndefined(components) ? true : components,
    blocks: isUndefined(blocks) ? true : blocks,
    i18n: isUndefined(i18n) ? true : i18n,
    license: license || 'MIT',
  };
  printRow(`Init the project${verbose ? ' (verbose)' : ''}...`);

  if (!yes) {
    !name &&
      questions.push({
        name: 'name',
        message: 'Name of the project',
        default: results.name,
      });
    !rName &&
      questions.push({
        name: 'rName',
        message: 'Repository name (used also as the plugin name)',
        default: results.rName,
      });
    !user &&
      questions.push({
        name: 'user',
        message: 'Repository username (eg. on GitHub/Bitbucket)',
        default: results.user,
      });
    isUndefined(components) &&
      questions.push({
        type: 'boolean',
        name: 'components',
        message: 'Will you need to add custom Component Types?',
        default: results.components,
      });
    isUndefined(blocks) &&
      questions.push({
        type: 'boolean',
        name: 'blocks',
        message: 'Will you need to add Blocks?',
        default: results.blocks,
      });
    isUndefined(i18n) &&
      questions.push({
        type: 'boolean',
        name: 'i18n',
        message: 'Do you want to setup i18n structure in this plugin?',
        default: results.i18n,
      });
    !license &&
      questions.push({
        name: 'license',
        message: 'License of the project',
        default: results.license,
      });
  }

  const answers = await inquirer.prompt(questions);
  results = {
    ...results,
    ...answers,
  };

  verbose && log({ results, opts });
  await initPlugin(results);
  printRow('Project created! Happy coding');
};
```

--------------------------------------------------------------------------------

---[FILE: main.ts]---
Location: grapesjs-dev/packages/cli/src/main.ts

```typescript
export { default as init } from './init';
export { default as build } from './build';
export { default as serve } from './serve';
```

--------------------------------------------------------------------------------

---[FILE: serve.ts]---
Location: grapesjs-dev/packages/cli/src/serve.ts

```typescript
import { printRow, buildWebpackArgs, log, normalizeJsonOpt } from './utils';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.config';
import chalk from 'chalk';

interface ServeOptions {
  host?: string;
  port?: number;
  verbose?: boolean;
}

/**
 * Start up the development server
 * @param {Object} opts
 */
export default (opts: ServeOptions = {}) => {
  printRow('Start the development server...');
  const { host, port } = opts;
  const isVerb = opts.verbose;
  const resultWebpackConf = {
    ...webpackConfig({ args: buildWebpackArgs(opts), cmdOpts: opts }),
    ...normalizeJsonOpt(opts, 'webpack'),
  };
  const devServerConf = {
    ...resultWebpackConf.devServer,
    open: true,
    ...normalizeJsonOpt(opts, 'devServer'),
  };

  if (host !== 'localhost') {
    devServerConf.host = host;
  }

  if (port !== 8080) {
    devServerConf.port = port;
  }

  if (isVerb) {
    log(chalk.yellow('Server config:\n'), opts, '\n');
    log(chalk.yellow('DevServer config:\n'), devServerConf, '\n');
  }

  const compiler = webpack(resultWebpackConf);
  const server = new webpackDevServer(devServerConf, compiler);

  server.start();
};
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: grapesjs-dev/packages/cli/src/utils.ts

```typescript
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';

export const isString = (val: any): val is string => typeof val === 'string';

export const isUndefined = (value: any) => typeof value === 'undefined';

export const isFunction = (value: any): value is Function => typeof value === 'function';

export const isObject = (val: any) => val !== null && !Array.isArray(val) && typeof val === 'object';

export const printRow = (str: string, { color = 'green', lineDown = 1 } = {}) => {
  console.log('');
  console.log(chalk[color].bold(str));
  lineDown && console.log('');
};

export const printError = (str: string) => {
  printRow(str, { color: 'red' });
};

export const log = (...args: any[]) => console.log.apply(this, args);

export const ensureDir = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  fs.mkdirSync(dirname);
  return ensureDir(dirname);
};

/**
 * Normalize JSON options
 * @param opts Options
 * @param key Options name to normalize
 * @returns {Object}
 */
export const normalizeJsonOpt = (opts: Record<string, any>, key: string) => {
  let devServerOpt = opts[key] || {};

  if (isString(devServerOpt)) {
    try {
      devServerOpt = JSON.parse(devServerOpt);
    } catch (e) {
      printError(`Error while parsing "${key}" option`);
      printError(e);
      devServerOpt = {};
    }
  }

  return devServerOpt;
};

export const buildWebpackArgs = (opts: Record<string, any>) => {
  return {
    ...opts,
    babel: normalizeJsonOpt(opts, 'babel'),
    htmlWebpack: normalizeJsonOpt(opts, 'htmlWebpack'),
  };
};

export const copyRecursiveSync = (src: string, dest: string) => {
  const exists = fs.existsSync(src);
  const isDir = exists && fs.statSync(src).isDirectory();

  if (isDir) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((file) => {
      copyRecursiveSync(path.join(src, file), path.join(dest, file));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
};

export const isPathExists = async (path: string) => {
  try {
    await fsp.access(path);
    return true;
  } catch {
    return false;
  }
};

export const writeFile = async (filePath: string, data: string) => {
  try {
    const dirname = path.dirname(filePath);
    const exist = await isPathExists(dirname);
    if (!exist) {
      await fsp.mkdir(dirname, { recursive: true });
    }

    await fsp.writeFile(filePath, data, 'utf8');
  } catch (err) {
    throw new Error(err);
  }
};

export const rootResolve = (val: string) => path.resolve(process.cwd(), val);

export const originalRequire = () => {
  // @ts-ignore need this to use the original 'require.resolve' as it's replaced by webpack
  return __non_webpack_require__;
};

export const resolve = (value: string) => {
  return originalRequire().resolve(value);
};

export const babelConfig = (opts: { targets?: string } = {}) => ({
  presets: [
    [
      resolve('@babel/preset-env'),
      {
        targets: opts.targets,
        // useBuiltIns: 'usage', // this makes the build much bigger
        // corejs: 3,
      },
    ],
  ],
  plugins: [resolve('@babel/plugin-transform-runtime')],
});
```

--------------------------------------------------------------------------------

---[FILE: webpack.config.ts]---
Location: grapesjs-dev/packages/cli/src/webpack.config.ts

```typescript
import { babelConfig, rootResolve, isFunction, isObject, log, resolve, originalRequire } from './utils';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import webpack from 'webpack';

const dirCwd = process.cwd();
let plugins = [];

export default (opts: Record<string, any> = {}): any => {
  const pkgPath = path.join(dirCwd, 'package.json');
  const rawPackageJson = fs.readFileSync(pkgPath) as unknown as string;
  const pkg = JSON.parse(rawPackageJson);
  const { args, cmdOpts = {} } = opts;
  const { htmlWebpack = {} } = args;
  const name = pkg.name;
  const isProd = opts.production;
  const banner = `/*! ${name} - ${pkg.version} */`;

  if (!isProd) {
    const fname = 'index.html';
    const index = `${dirCwd}/${fname}`;
    const indexDev = `${dirCwd}/_${fname}`;
    let template = path.resolve(__dirname, `./../${fname}`);

    if (fs.existsSync(indexDev)) {
      template = indexDev;
    } else if (fs.existsSync(index)) {
      template = index;
    }

    plugins.push(
      new HtmlWebpackPlugin({
        inject: 'head',
        template,
        ...htmlWebpack,
        templateParameters: {
          name,
          title: name,
          gjsVersion: 'latest',
          pathGjs: '',
          pathGjsCss: '',
          ...(htmlWebpack.templateParameters || {}),
        },
      }),
    );
  }

  const outPath = path.resolve(dirCwd, args.output);
  const modulesPaths = ['node_modules', path.join(__dirname, '../node_modules')];

  let config = {
    entry: path.resolve(dirCwd, args.entry),
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'eval',
    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            compress: {
              evaluate: false, // Avoid breaking gjs scripts
            },
            output: {
              comments: false,
              quote_style: 3, // Preserve original quotes
              preamble: banner, // banner here instead of BannerPlugin
            },
          },
        }),
      ],
    },
    output: {
      path: outPath,
      filename: 'index.js',
      library: name,
      libraryTarget: 'umd',
      globalObject: `typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this)`,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: resolve('ts-loader'),
          exclude: /node_modules/,
          options: {
            context: rootResolve(''),
            configFile: rootResolve('tsconfig.json'),
          },
        },
        {
          test: /\.js$/,
          loader: resolve('babel-loader'),
          include: /src/,
          options: {
            ...babelConfig(args),
            cacheDirectory: true,
            ...args.babel,
          },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      modules: modulesPaths,
    },
    plugins,
  };

  // Try to load local webpack config
  const localWebpackPath = rootResolve('webpack.config.js');
  let localWebpackConf: any;

  if (fs.existsSync(localWebpackPath)) {
    const customWebpack = originalRequire()(localWebpackPath);
    localWebpackConf = customWebpack.default || customWebpack;
  }

  if (isFunction(localWebpackConf)) {
    const fnRes = localWebpackConf({ config, webpack, pkg });
    config = isObject(fnRes) ? fnRes : config;
  }

  cmdOpts.verbose && log(chalk.yellow('Webpack config:\n'), config, '\n');

  return config;
};
```

--------------------------------------------------------------------------------

---[FILE: .gitignore-t]---
Location: grapesjs-dev/packages/cli/src/template/.gitignore-t

```text
.DS_Store
private/
/locale
node_modules/
*.log
_index.html
dist/
stats.json
```

--------------------------------------------------------------------------------

---[FILE: .npmignore-t]---
Location: grapesjs-dev/packages/cli/src/template/.npmignore-t

```text
.*
*.log
*.html
**/tsconfig.json
**/webpack.config.js
node_modules
src
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: grapesjs-dev/packages/cli/src/template/package.json

```json
{
  "name": "<%= rName %>",
  "version": "1.0.0",
  "description": "<%= name %>",
  "main": "dist/index.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/<%= user %>/<%= rName %>.git"
  },
  "scripts": {
    "start": "grapesjs-cli serve",
    "build": "grapesjs-cli build",
    "bump": "npm version patch -m 'Bump v%s'"
  },
  "keywords": [
    "grapesjs",
    "plugin"
  ],
  "devDependencies": {
    "grapesjs-cli": "^<%= version %>"
  },
  "license": "<%= license %>"
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: grapesjs-dev/packages/cli/src/template/README.md

```text
# <%= name %>

## Live Demo

> **Show a live example of your plugin**

To make your plugin more engaging, create a simple live demo using online tools like [JSFiddle](https://jsfiddle.net), [CodeSandbox](https://codesandbox.io), or [CodePen](https://codepen.io). Include the demo link in your README. Adding a screenshot or GIF of the demo is a bonus.

Below, you'll find the necessary HTML, CSS, and JavaScript. Copy and paste this code into one of the tools mentioned. Once you're done, delete this section and update the link at the top with your demo.

### HTML

```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet" />
<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/<%= rName %>"></script>

<div id="gjs"></div>
```

### JS

```js
const editor = grapesjs.init({
  container: '#gjs',
  height: '100%',
  fromElement: true,
  storageManager: false,
  plugins: ['<%= rName %>'],
});
```

### CSS

```css
body,
html {
  margin: 0;
  height: 100%;
}
```

## Summary

- Plugin name: `<%= rName %>`
- Components
  - `component-id-1`
  - `component-id-2`
  - ...
- Blocks
  - `block-id-1`
  - `block-id-2`
  - ...

## Options

| Option    | Description        | Default         |
| --------- | ------------------ | --------------- |
| `option1` | Description option | `default value` |

## Download

- CDN
  - `https://unpkg.com/<%= rName %>`
- NPM
  - `npm i <%= rName %>`
- GIT
  - `git clone https://github.com/<%= user %>/<%= rName %>.git`

## Usage

Directly in the browser

```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet" />
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/<%= rName %>.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
    container: '#gjs',
    // ...
    plugins: ['<%= rName %>'],
    pluginsOpts: {
      '<%= rName %>': {
        /* options */
      },
    },
  });
</script>
```

Modern javascript

```js
import grapesjs from 'grapesjs';
import plugin from '<%= rName %>';
import 'grapesjs/dist/css/grapes.min.css';

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [plugin],
  pluginsOpts: {
    [plugin]: { /* options */ }
  }
  // or
  plugins: [
    editor => plugin(editor, { /* options */ }),
  ],
});
```

## Development

Clone the repository

```sh
$ git clone https://github.com/<%= user %>/<%= rName %>.git
$ cd <%= rName %>
```

Install dependencies

```sh
npm i
```

Start the dev server

```sh
npm start
```

Build the source

```sh
npm run build
```

## License

MIT
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: grapesjs-dev/packages/cli/src/template/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "sourceMap": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false
  },
  "include": ["src"]
}
```

--------------------------------------------------------------------------------

---[FILE: blocks.js]---
Location: grapesjs-dev/packages/cli/src/template/src/blocks.js

```javascript
export default (editor, opts = {}) => {
  const bm = editor.BlockManager;

  bm.add('MY-BLOCK', {
    label: 'My block',
    content: { type: 'MY-COMPONENT' },
    // media: '<svg>...</svg>',
  });
};
```

--------------------------------------------------------------------------------

---[FILE: components.js]---
Location: grapesjs-dev/packages/cli/src/template/src/components.js

```javascript
export default (editor, opts = {}) => {
  const domc = editor.DomComponents;

  domc.addType('MY-COMPONENT', {
    model: {
      defaults: {
        // Default props
      },
    },
    view: {},
  });
};
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: grapesjs-dev/packages/cli/src/template/src/index.js

```javascript
<% if(components){ %>import loadComponents from './components';<% } %>
<% if(blocks){ %>import loadBlocks from './blocks';<% } %>
<% if(i18n){ %>import en from './locale/en';<% } %>

export default (editor, opts = {}) => {
  const options = { ...{
    <% if(i18n){ %>i18n: {},<% } %>
    // default options
  },  ...opts };

  <% if(components){ %>// Add components
  loadComponents(editor, options);<% } %>
  <% if(blocks){ %>// Add blocks
  loadBlocks(editor, options);<% } %>
  <% if(i18n){ %>// Load i18n files
  editor.I18n && editor.I18n.addMessages({
      en,
      ...options.i18n,
  });<% } %>

  // TODO Remove
  editor.on('load', () =>
    editor.addComponents(
        `<div style="margin:100px; padding:25px;">
            Content loaded from the plugin
        </div>`,
        { at: 0 }
    ))
};
```

--------------------------------------------------------------------------------

````
