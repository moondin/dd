---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 35
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 35 of 37)

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

---[FILE: e2e-kitchensink-eject.sh]---
Location: create-react-app-main/tasks/e2e-kitchensink-eject.sh

```bash
#!/bin/bash
# Copyright (c) 2015-present, Facebook, Inc.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

# ******************************************************************************
# This is an end-to-end kitchensink test intended to run on CI.
# You can also run it locally but it's slow.
# ******************************************************************************

# Start in tasks/ even if run from root directory
cd "$(dirname "$0")"

# CLI, app, and test module temporary locations
# http://unix.stackexchange.com/a/84980
temp_app_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_app_path'`
temp_module_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_module_path'`

# Load functions for working with local NPM registry (Verdaccio)
source local-registry.sh

function cleanup {
  echo 'Cleaning up.'
  unset BROWSERSLIST
  ps -ef | grep 'react-scripts' | grep -v grep | awk '{print $2}' | xargs kill -9
  cd "$root_path"
  # TODO: fix "Device or resource busy" and remove ``|| $CI`
  rm -rf "$temp_app_path" "$temp_module_path" || $CI
  # Restore the original NPM and Yarn registry URLs and stop Verdaccio
  stopLocalRegistry
}

# Error messages are redirected to stderr
function handle_error {
  echo "$(basename $0): ERROR! An error was encountered executing line $1." 1>&2;
  cleanup
  echo 'Exiting with error.' 1>&2;
  exit 1
}

function handle_exit {
  cleanup
  echo 'Exiting without error.' 1>&2;
  exit
}

# Check for the existence of one or more files.
function exists {
  for f in $*; do
    test -e "$f"
  done
}

# Exit the script with a helpful error message when any error is encountered
trap 'set +x; handle_error $LINENO $BASH_COMMAND' ERR

# Cleanup before exit on any termination signal
trap 'set +x; handle_exit' SIGQUIT SIGTERM SIGINT SIGKILL SIGHUP

# Echo every command being executed
set -x

# Go to root
cd ..
root_path=$PWD
# Set a Windows path for GitBash on Windows
if [ "$AGENT_OS" == 'Windows_NT' ]; then
  root_path=$(cmd //c cd)
fi

# ******************************************************************************
# First, publish the monorepo.
# ******************************************************************************

# Start the local NPM registry
startLocalRegistry "$root_path"/tasks/verdaccio.yaml

# Publish the monorepo
publishToLocalRegistry

# ******************************************************************************
# Now that we have published them, create a clean app folder and install them.
# ******************************************************************************

# Install the app in a temporary location
cd $temp_app_path
npx create-react-app test-kitchensink --template=file:"$root_path"/packages/react-scripts/fixtures/kitchensink

# Install the test module
cd "$temp_module_path"
npm install test-integrity@^2.0.1

# ******************************************************************************
# Now that we used create-react-app to create an app depending on react-scripts,
# let's make sure all npm scripts are in the working state.
# ******************************************************************************

# Enter the app directory
cd "$temp_app_path/test-kitchensink"

# In kitchensink, we want to test all transforms
export BROWSERSLIST='ie 9'

# ******************************************************************************
# Finally, let's check that everything still works after ejecting.
# ******************************************************************************

# Eject...
echo yes | npm run eject

# Test the build
REACT_APP_SHELL_ENV_MESSAGE=fromtheshell \
  NODE_PATH=src \
  PUBLIC_URL=http://www.example.org/spa/ \
  npm run build

# Check for expected output
exists build/*.html
exists build/static/js/main.*.js

# Unit tests
REACT_APP_SHELL_ENV_MESSAGE=fromtheshell \
  CI=true \
  NODE_PATH=src \
  NODE_ENV=test \
  npm test --no-cache --runInBand --testPathPattern=src

# Test "development" environment
tmp_server_log=`mktemp`
PORT=3002 \
  REACT_APP_SHELL_ENV_MESSAGE=fromtheshell \
  NODE_PATH=src \
  nohup npm start &>$tmp_server_log &
grep -q 'You can now view' <(tail -f $tmp_server_log)
E2E_URL="http://localhost:3002" \
  REACT_APP_SHELL_ENV_MESSAGE=fromtheshell \
  CI=true NODE_PATH=src \
  NODE_ENV=development \
  BABEL_ENV=test \
  node_modules/.bin/jest --no-cache --runInBand --config='jest.integration.config.js'

# Test "production" environment
E2E_FILE=./build/index.html \
  CI=true \
  NODE_ENV=production \
  BABEL_ENV=test \
  NODE_PATH=src \
  PUBLIC_URL=http://www.example.org/spa/ \
  node_modules/.bin/jest --no-cache --runInBand --config='jest.integration.config.js'

# Cleanup
cleanup
```

--------------------------------------------------------------------------------

---[FILE: e2e-kitchensink.sh]---
Location: create-react-app-main/tasks/e2e-kitchensink.sh

```bash
#!/bin/bash
# Copyright (c) 2015-present, Facebook, Inc.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

# ******************************************************************************
# This is an end-to-end kitchensink test intended to run on CI.
# You can also run it locally but it's slow.
# ******************************************************************************

# Start in tasks/ even if run from root directory
cd "$(dirname "$0")"

# CLI, app, and test module temporary locations
# http://unix.stackexchange.com/a/84980
temp_app_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_app_path'`
temp_module_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_module_path'`

# Load functions for working with local NPM registry (Verdaccio)
source local-registry.sh

function cleanup {
  echo 'Cleaning up.'
  unset BROWSERSLIST
  ps -ef | grep 'react-scripts' | grep -v grep | awk '{print $2}' | xargs kill -9
  cd "$root_path"
  # TODO: fix "Device or resource busy" and remove ``|| $CI`
  rm -rf "$temp_app_path" "$temp_module_path" || $CI
  # Restore the original NPM and Yarn registry URLs and stop Verdaccio
  stopLocalRegistry
}

# Error messages are redirected to stderr
function handle_error {
  echo "$(basename $0): ERROR! An error was encountered executing line $1." 1>&2;
  cleanup
  echo 'Exiting with error.' 1>&2;
  exit 1
}

function handle_exit {
  cleanup
  echo 'Exiting without error.' 1>&2;
  exit
}

# Check for the existence of one or more files.
function exists {
  for f in $*; do
    test -e "$f"
  done
}

# Exit the script with a helpful error message when any error is encountered
trap 'set +x; handle_error $LINENO $BASH_COMMAND' ERR

# Cleanup before exit on any termination signal
trap 'set +x; handle_exit' SIGQUIT SIGTERM SIGINT SIGKILL SIGHUP

# Echo every command being executed
set -x

# Go to root
cd ..
root_path=$PWD
# Set a Windows path for GitBash on Windows
if [ "$AGENT_OS" == 'Windows_NT' ]; then
  root_path=$(cmd //c cd)
fi

# ******************************************************************************
# First, publish the monorepo.
# ******************************************************************************

# Start the local NPM registry
startLocalRegistry "$root_path"/tasks/verdaccio.yaml

# Publish the monorepo
publishToLocalRegistry

# ******************************************************************************
# Now that we have published them, create a clean app folder and install them.
# ******************************************************************************

# Install the app in a temporary location
cd $temp_app_path
npx create-react-app test-kitchensink --template=file:"$root_path"/packages/react-scripts/fixtures/kitchensink

# Install the test module
cd "$temp_module_path"
npm install test-integrity@^2.0.1

# ******************************************************************************
# Now that we used create-react-app to create an app depending on react-scripts,
# let's make sure all npm scripts are in the working state.
# ******************************************************************************

# Enter the app directory
cd "$temp_app_path/test-kitchensink"

# In kitchensink, we want to test all transforms
export BROWSERSLIST='ie 9'

# Test the build
REACT_APP_SHELL_ENV_MESSAGE=fromtheshell \
  PUBLIC_URL=http://www.example.org/spa/ \
  npm run build

# Check for expected output
exists build/*.html
exists build/static/js/main.*.js

# Unit tests
# https://facebook.github.io/jest/docs/en/troubleshooting.html#tests-are-extremely-slow-on-docker-and-or-continuous-integration-ci-server
REACT_APP_SHELL_ENV_MESSAGE=fromtheshell \
  CI=true \
  NODE_ENV=test \
  npm test --no-cache --runInBand --testPathPattern=src

# Prepare "development" environment
tmp_server_log=`mktemp`
PORT=3001 \
  REACT_APP_SHELL_ENV_MESSAGE=fromtheshell \
  NODE_PATH=src \
  nohup npm start &>$tmp_server_log &
grep -q 'You can now view' <(tail -f $tmp_server_log)

# Test "development" environment
E2E_URL="http://localhost:3001" \
  REACT_APP_SHELL_ENV_MESSAGE=fromtheshell \
  CI=true NODE_PATH=src \
  NODE_ENV=development \
  BABEL_ENV=test \
  node_modules/.bin/jest --no-cache --runInBand --config='jest.integration.config.js'
# Test "production" environment
E2E_FILE=./build/index.html \
  CI=true \
  NODE_PATH=src \
  NODE_ENV=production \
  BABEL_ENV=test \
  PUBLIC_URL=http://www.example.org/spa/ \
  node_modules/.bin/jest --no-cache --runInBand --config='jest.integration.config.js'

# Cleanup
cleanup
```

--------------------------------------------------------------------------------

---[FILE: e2e-old-node.sh]---
Location: create-react-app-main/tasks/e2e-old-node.sh

```bash
#!/bin/bash
# Copyright (c) 2015-present, Facebook, Inc.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

# ******************************************************************************
# This is an end-to-end test intended to run on CI.
# You can also run it locally but it's slow.
# ******************************************************************************

# Start in tasks/ even if run from root directory
cd "$(dirname "$0")"

temp_app_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_app_path'`

function cleanup {
  echo 'Cleaning up.'
  cd "$root_path"
  rm -rf $temp_app_path
}

# Error messages are redirected to stderr
function handle_error {
  echo "$(basename $0): ERROR! An error was encountered executing line $1." 1>&2;
  cleanup
  echo 'Exiting with error.' 1>&2;
  exit 1
}

function handle_exit {
  cleanup
  echo 'Exiting without error.' 1>&2;
  exit
}

# Exit the script with a helpful error message when any error is encountered
trap 'set +x; handle_error $LINENO $BASH_COMMAND' ERR

# Cleanup before exit on any termination signal
trap 'set +x; handle_exit' SIGQUIT SIGTERM SIGINT SIGKILL SIGHUP

# Echo every command being executed
set -x

# Go to root
cd ..
root_path=$PWD

# We need to install create-react-app deps to test it
cd "$root_path"/packages/create-react-app
npm install
cd "$root_path"

# If the node version is < 10, the script should just give an error.
cd $temp_app_path
err_output=`node "$root_path"/packages/create-react-app/index.js test-node-version 2>&1 > /dev/null || echo ''`
[[ $err_output =~ You\ are\ running\ Node ]] && exit 0 || exit 1

# Cleanup
cleanup
```

--------------------------------------------------------------------------------

---[FILE: e2e-simple.sh]---
Location: create-react-app-main/tasks/e2e-simple.sh

```bash
#!/bin/bash
# Copyright (c) 2015-present, Facebook, Inc.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

# ******************************************************************************
# This is an end-to-end test intended to run on CI.
# You can also run it locally but it's slow.
# ******************************************************************************

# Start in tasks/ even if run from root directory
cd "$(dirname "$0")"

# App temporary location
# http://unix.stackexchange.com/a/84980
temp_app_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_app_path'`

# Load functions for working with local NPM registry (Verdaccio)
source local-registry.sh

function cleanup {
  echo 'Cleaning up.'
  cd "$root_path"
  # Uncomment when snapshot testing is enabled by default:
  # rm ./packages/react-scripts/template/src/__snapshots__/App.test.js.snap
  rm -rf "$temp_app_path"
  # Restore the original NPM and Yarn registry URLs and stop Verdaccio
  stopLocalRegistry
}

# Error messages are redirected to stderr
function handle_error {
  echo "$(basename $0): ERROR! An error was encountered executing line $1." 1>&2;
  cleanup
  echo 'Exiting with error.' 1>&2;
  exit 1
}

function handle_exit {
  cleanup
  echo 'Exiting without error.' 1>&2;
  exit
}

# Check for the existence of one or more files.
function exists {
  for f in $*; do
    test -e "$f"
  done
}

# Exit the script with a helpful error message when any error is encountered
trap 'set +x; handle_error $LINENO $BASH_COMMAND' ERR

# Cleanup before exit on any termination signal
trap 'set +x; handle_exit' SIGQUIT SIGTERM SIGINT SIGKILL SIGHUP

# Echo every command being executed
set -x

# Go to root
cd ..
root_path=$PWD

# Make sure we don't introduce accidental references to PATENTS.
EXPECTED='packages/react-error-overlay/fixtures/bundle.mjs
packages/react-error-overlay/fixtures/bundle.mjs.map
packages/react-error-overlay/fixtures/bundle_u.mjs
packages/react-error-overlay/fixtures/bundle_u.mjs.map
tasks/e2e-simple.sh'
ACTUAL=$(git grep -l PATENTS)
if [ "$EXPECTED" != "$ACTUAL" ]; then
  echo "PATENTS crept into some new files?"
  diff -u <(echo "$EXPECTED") <(echo "$ACTUAL") || true
  exit 1
fi

# Start the local NPM registry
startLocalRegistry "$root_path"/tasks/verdaccio.yaml

npm test -w react-error-overlay
if [ "$AGENT_OS" != 'Windows_NT' ]; then
  # Flow started hanging on Windows build agents
  npm run flow -w react-error-overlay
fi

npm test -w react-dev-utils

npm test -w babel-plugin-named-asset-import

npm test -w confusing-browser-globals

# ******************************************************************************
# First, test the create-react-app development environment.
# This does not affect our users but makes sure we can develop it.
# ******************************************************************************

# Test local build command
npm run build
# Check for expected output
exists build/*.html
exists build/static/js/*.js
exists build/static/css/*.css
exists build/static/media/*.svg
exists build/favicon.ico

# Run tests with CI flag
CI=true npm test
# Uncomment when snapshot testing is enabled by default:
# exists template/src/__snapshots__/App.test.js.snap

# Test local start command
npm start -- --smoke-test

# Publish the monorepo
publishToLocalRegistry

# ******************************************************************************
# Install react-scripts prerelease via create-react-app prerelease.
# ******************************************************************************

# Install the app in a temporary location
cd $temp_app_path
npx create-react-app test-app

# TODO: verify we installed prerelease

# ******************************************************************************
# Now that we used create-react-app to create an app depending on react-scripts,
# let's make sure all npm scripts are in the working state.
# ******************************************************************************

function verify_env_url {
  # Backup package.json because we're going to make it dirty
  cp package.json package.json.orig

  # Test default behavior
  grep -F -R --exclude=*.map "\"/static/" build/ -q; test $? -eq 0 || exit 1

  # Test relative path build
  awk -v n=2 -v s="  \"homepage\": \".\"," 'NR == n {print s} {print}' package.json > tmp && mv tmp package.json

  npm run build
  # Disabled until this can be tested
  # grep -F -R --exclude=*.map "../../static/" build/ -q; test $? -eq 0 || exit 1
  grep -F -R --exclude=*.map "\"./static/" build/ -q; test $? -eq 0 || exit 1
  grep -F -R --exclude=*.map "\"/static/" build/ -q; test $? -eq 1 || exit 1

  PUBLIC_URL="/anabsolute" npm run build
  grep -F -R --exclude=*.map "/anabsolute/static/" build/ -q; test $? -eq 0 || exit 1
  grep -F -R --exclude=*.map "\"/static/" build/ -q; test $? -eq 1 || exit 1

  # Test absolute path build
  sed "2s/.*/  \"homepage\": \"\/testingpath\",/" package.json > tmp && mv tmp package.json

  npm run build
  grep -F -R --exclude=*.map "/testingpath/static/" build/ -q; test $? -eq 0 || exit 1
  grep -F -R --exclude=*.map "\"/static/" build/ -q; test $? -eq 1 || exit 1

  PUBLIC_URL="https://www.example.net/overridetest" npm run build
  grep -F -R --exclude=*.map "https://www.example.net/overridetest/static/" build/ -q; test $? -eq 0 || exit 1
  grep -F -R --exclude=*.map "\"/static/" build/ -q; test $? -eq 1 || exit 1
  grep -F -R --exclude=*.map "testingpath/static" build/ -q; test $? -eq 1 || exit 1

  # Test absolute url build
  sed "2s/.*/  \"homepage\": \"https:\/\/www.example.net\/testingpath\",/" package.json > tmp && mv tmp package.json

  npm run build
  grep -F -R --exclude=*.map "/testingpath/static/" build/ -q; test $? -eq 0 || exit 1
  grep -F -R --exclude=*.map "\"/static/" build/ -q; test $? -eq 1 || exit 1

  PUBLIC_URL="https://www.example.net/overridetest" npm run build
  grep -F -R --exclude=*.map "https://www.example.net/overridetest/static/" build/ -q; test $? -eq 0 || exit 1
  grep -F -R --exclude=*.map "\"/static/" build/ -q; test $? -eq 1 || exit 1
  grep -F -R --exclude=*.map "testingpath/static" build/ -q; test $? -eq 1 || exit 1

  # Restore package.json
  rm package.json
  mv package.json.orig package.json
}

function verify_module_scope {
  # Create stub json file
  echo "{}" >> sample.json

  # Save App.js, we're going to modify it
  cp src/App.js src/App.js.bak

  # Add an out of scope import
  echo "import sampleJson from '../sample'" | cat - src/App.js > src/App.js.temp && mv src/App.js.temp src/App.js

  # Make sure the build fails
  npm run build; test $? -eq 1 || exit 1
  # TODO: check for error message

  rm sample.json

  # Restore App.js
  rm src/App.js
  mv src/App.js.bak src/App.js
}

# Enter the app directory
cd test-app

# Test the build
npm run build
# Check for expected output
exists build/*.html
exists build/static/js/*.js
exists build/static/css/*.css
exists build/static/media/*.svg
exists build/favicon.ico

# Run tests with CI flag
CI=true npm test
# Uncomment when snapshot testing is enabled by default:
# exists src/__snapshots__/App.test.js.snap

# Test the server
npm start -- --smoke-test

# Test environment handling
verify_env_url

# Test reliance on webpack internals
verify_module_scope

# ******************************************************************************
# Finally, let's check that everything still works after ejecting.
# ******************************************************************************

# Eject...
echo yes | npm run eject

# Test ejected files were staged
test -n "$(git diff --staged --name-only)"

# Test the build
npm run build
# Check for expected output
exists build/*.html
exists build/static/js/*.js
exists build/static/css/*.css
exists build/static/media/*.svg
exists build/favicon.ico

# Run tests, overriding the watch option to disable it.
npm test --watch=no
# Uncomment when snapshot testing is enabled by default:
# exists src/__snapshots__/App.test.js.snap

# Test the server
npm start -- --smoke-test

# Test environment handling
verify_env_url

# Test reliance on webpack internals
verify_module_scope

# Cleanup
cleanup
```

--------------------------------------------------------------------------------

---[FILE: local-registry.sh]---
Location: create-react-app-main/tasks/local-registry.sh

```bash
#!/bin/bash

custom_registry_url=http://localhost:4873
original_npm_registry_url=`npm get registry`
original_yarn_registry_url=`yarn config get registry`
default_verdaccio_package=verdaccio@^4.5.1

function startLocalRegistry {
  # Start local registry
  tmp_registry_log=`mktemp`
  echo "Registry output file: $tmp_registry_log"
  (cd && nohup npx ${VERDACCIO_PACKAGE:-$default_verdaccio_package} -c $1 &>$tmp_registry_log &)
  # Wait for Verdaccio to boot
  grep -q 'http address' <(tail -f $tmp_registry_log)

  # Set registry to local registry
  npm set registry "$custom_registry_url"
  yarn config set registry "$custom_registry_url"
}

function stopLocalRegistry {
  # Restore the original NPM and Yarn registry URLs and stop Verdaccio
  npm set registry "$original_npm_registry_url"
  yarn config set registry "$original_yarn_registry_url"
}

function publishToLocalRegistry {
  git clean -df
  ./tasks/publish.sh prerelease --yes --force-publish=* --no-git-tag-version --no-commit-hooks --no-push --exact --dist-tag=latest
}
```

--------------------------------------------------------------------------------

---[FILE: local-test.sh]---
Location: create-react-app-main/tasks/local-test.sh

```bash
#!/usr/bin/env bash
# Copyright (c) 2015-present, Facebook, Inc.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

node_version=14
current_git_branch=`git rev-parse --abbrev-ref HEAD`
git_branch=${current_git_branch}
test_suite=all
interactive=false

function print_help {
  echo "Usage: ${0} [OPTIONS]"
  echo ""
  echo "OPTIONS:"
  echo "  --node-version <version>  the node version to use while testing [${node_version}]"
  echo "  --git-branch <branch>     the git branch to checkout for testing [${current_git_branch}]"
  echo "  --test-suite <suite>      which test suite to use ('all', 'behavior', installs', 'kitchensink', 'kitchensink-eject', 'simple') ['${test_suite}']"
  echo "  --interactive             gain a bash shell after the test run [${interactive}]"
  echo "  --help                    print this message and exit"
  echo ""
}

cd $(dirname $0)

while [ "$1" != "" ]; do
  case $1 in
    "--node-version")
      shift
      node_version=$1
      ;;
    "--git-branch")
      shift
      git_branch=$1
      ;;
    "--test-suite")
      shift
      test_suite=$1
      ;;
    "--interactive")
      interactive=true
      ;;
    "--help")
      print_help
      exit 0
      ;;
  esac
  shift
done

test_command="./tasks/e2e-simple.sh && ./tasks/e2e-kitchensink.sh && ./tasks/e2e-kitchensink-eject.sh && ./tasks/e2e-installs.sh && ./tasks/e2e-behavior.sh"
case ${test_suite} in
  "all")
    ;;
  "simple")
    test_command="./tasks/e2e-simple.sh"
    ;;
  "kitchensink")
    test_command="./tasks/e2e-kitchensink.sh"
    ;;
  "kitchensink-eject")
    test_command="./tasks/e2e-kitchensink-eject.sh"
    ;;
  "installs")
    test_command="./tasks/e2e-installs.sh"
    ;;
  "behavior")
    test_command="./tasks/e2e-behavior.sh"
    ;;
  *)
    ;;
esac

read -r -d '' apply_changes <<- CMD
cd /var/create-react-app
git config --global user.name "Create React App"
git config --global user.email "cra@email.com"
git stash save -u
git stash show -p > patch
git diff 4b825dc642cb6eb9a060e54bf8d69288fbee4904 stash^3 >> patch
git stash pop
cd -
mv /var/create-react-app/patch .
git apply patch
rm patch
git add -A
git commit -m 'Apply local changes'
CMD

if [ ${git_branch} != ${current_git_branch} ]; then
  apply_changes=''
fi

read -r -d '' command <<- CMD
npm install npm@8 -g
export PATH=\$(npm config get prefix -g)/bin:\$PATH
set -x
git clone /var/create-react-app create-react-app --branch ${git_branch}
cd create-react-app
${apply_changes}
node --version
npm --version
npm ci
set +x
${test_command}
result_code=\$?
if [ \$result_code == 0 ]; then
  echo -e "\n\e[1;32m✔ Job passed\e[0m"
else
  echo -e "\n\e[1;31m✘ Job failed\e[0m"
fi
$([[ ${interactive} == 'true' ]] && echo 'bash')
exit \$result_code
CMD

docker run \
  --env CI=true \
  --env NPM_CONFIG_PREFIX=/home/node/.npm \
  --env NPM_CONFIG_QUIET=true \
  --tty \
  --rm \
  --user node \
  --volume ${PWD}/..:/var/create-react-app \
  --workdir /home/node \
  $([[ ${interactive} == 'true' ]] && echo '--interactive') \
  node:${node_version} \
  bash -c "${command}"
```

--------------------------------------------------------------------------------

---[FILE: publish.sh]---
Location: create-react-app-main/tasks/publish.sh

```bash
#!/bin/bash
# Copyright (c) 2015-present, Facebook, Inc.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

# ******************************************************************************
# This releases an update to the `react-scripts` package.
# Don't use `npm publish` for it.
# Read the release instructions:
# https://github.com/facebook/create-react-app/blob/main/CONTRIBUTING.md#cutting-a-release
# ******************************************************************************

# Start in tasks/ even if run from root directory
cd "$(dirname "$0")"

# Exit the script on any command with non 0 return code
# We assume that all the commands in the pipeline set their return code
# properly and that we do not need to validate that the output is correct
set -e

# Echo every command being executed
set -x

# Go to root
cd ..
root_path=$PWD

if [ -n "$(git status --porcelain)" ]; then
  echo "Your git status is not clean. Aborting.";
  exit 1;
fi

# Compile
npm run build:prod -w react-error-overlay

# Get 2FA when not CI
otp=""
if [ -z $CI ]; then
  echo "Please enter npm two-factor auth code: "
  read otp
fi

# Go!
NPM_CONFIG_OTP="$otp" ./node_modules/.bin/lerna publish "$@"
```

--------------------------------------------------------------------------------

---[FILE: screencast-start.js]---
Location: create-react-app-main/tasks/screencast-start.js

```javascript
#!/usr/bin/env node

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const execa = require('execa');
const meow = require('meow');
const multimatch = require('multimatch');

main(meow());

function main(cli) {
  let count = 0;

  const start = Date.now();
  const duration = parseInt(cli.flags.timeout, 10) * 1000;
  const cp = execa(cli.flags.command, { shell: true });

  const target = parseInt(cli.flags.patternCount || '1', 10);

  cp.stdout.on('data', data => {
    process.stdout.write(data);
    const matches = multimatch([String(data)], cli.flags.pattern);
    const errMatches = multimatch([String(data)], cli.flags.errorPattern);

    if (matches.length > 0) {
      count++;
    }

    if (errMatches.length > 0) {
      process.exit(1);
    }

    if (count >= target) {
      setTimeout(() => {
        process.exit(0);
      }, duration);
    }
  });

  cp.on('exit', e => {
    const elapsed = Date.now() - start;

    if (elapsed >= duration) {
      return;
    }

    setTimeout(() => {
      process.exit(e.exitCode);
    }, duration - elapsed);
  });
}
```

--------------------------------------------------------------------------------

---[FILE: screencast.js]---
Location: create-react-app-main/tasks/screencast.js

```javascript
#!/usr/bin/env node

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const execa = require('execa');
const tempy = require('tempy');

main();

function main() {
  const previous = process.cwd();
  const cwd = tempy.directory();

  const cast = path.join(cwd, 'screencast.json');
  const script = path.join(__dirname, 'screencast.sh');
  const out = path.join(previous, 'screencast.svg');

  const resolveLine = l => l.indexOf('🔍  Resolving packages...') > -1;
  const fetchLine = l => l.indexOf('🚚  Fetching packages...') > -1;
  const countLine = l => l.match(/Saved [0-9]+ new dependencies/);
  const doneLine = l => l.indexOf('✨  Done in') > -1;

  try {
    process.chdir(cwd);
    console.log(`Recording screencast ...`);
    execa.sync('asciinema', ['rec', '--command', `sh ${script}`, cast], {
      cwd,
      stdio: 'inherit',
    });

    console.log('Cleaning data ...');
    const data = require(cast);

    cut(data.stdout, { start: resolveLine, end: fetchLine });
    cut(data.stdout, { start: countLine, end: doneLine });
    replace(data.stdout, [{ in: cwd, out: '~' }]);

    fs.writeFileSync(cast, JSON.stringify(data, null, '  '));

    console.log('Rendering SVG ...');
    execa.sync('svg-term', ['--window', '--in', cast, '--out', out]);

    console.log(`Recorded screencast to ${cast}`);
    console.log(`Rendered SVG to ${out}`);
  } finally {
    process.chdir(previous);
  }
}

function cut(frames, { start, end }) {
  const si = frames.findIndex(([, l]) => start(l));
  const ei = frames.findIndex(([, l]) => end(l));

  if (si === -1 || ei === -1) {
    return;
  }

  frames.splice(si + 1, ei - si - 1);
}

function replace(frames, replacements) {
  frames.forEach(frame => {
    replacements.forEach(r => (frame[1] = frame[1].split(r.in).join(r.out)));
  });
}
```

--------------------------------------------------------------------------------

---[FILE: screencast.sh]---
Location: create-react-app-main/tasks/screencast.sh

```bash
#!/bin/zsh
# Copyright (c) 2015-present, Facebook, Inc.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

# ******************************************************************************
# This is an end-to-end test intended to be run via screencast.js
# Dependencies: asciinema, pv, core-utils
# ******************************************************************************
set -e

printf '\e[32m%s\e[m' "λ "
echo "npx create-react-app my-app" | pv -qL $[10+(-2 + RANDOM%5)]
npx create-react-app my-app

printf '\e[32m%s\e[m' "λ "
sleep 1
echo "cd my-app" | pv -qL $[10+(-2 + RANDOM%5)]
cd my-app

printf '\e[32m%s\e[m' "λ "
sleep 1
echo "npm start" | pv -qL $[10+(-2 + RANDOM%5)]

BROWSER="none" node "$(dirname $0)/screencast-start.js" \
    --command "npm start" \
    --pattern="Compiled successfully*" \
    --pattern-count 2 \
    --error-pattern="*already running on port" \
    --timeout 10

echo ""
```

--------------------------------------------------------------------------------

---[FILE: verdaccio.yaml]---
Location: create-react-app-main/tasks/verdaccio.yaml

```yaml
#
# This is based on verdaccio's default config file. It allows all users
# to do anything, so don't use it on production systems.
#
# Look here for more config file examples:
# https://github.com/verdaccio/verdaccio/tree/master/conf
#

# path to a directory with all packages
storage: ./storage

auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000

# a list of other known repositories we can talk to
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    max_fails: 40
    maxage: 30m
    timeout: 60s
    agent_options:
      keepAlive: true
      # Avoid exceeding the max sockets that are allocated per VM.
      # https://docs.microsoft.com/en-us/azure/app-service/app-service-web-nodejs-best-practices-and-troubleshoot-guide#my-node-application-is-making-excessive-outbound-calls
      maxSockets: 40
      maxFreeSockets: 10

packages:
  '@*/*':
    # scoped packages
    access: $all
    publish: $all
    proxy: npmjs

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    #
    # you can specify usernames/groupnames (depending on your auth plugin)
    # and three keywords: "$all", "$anonymous", "$authenticated"
    access: $all

    # allow all known users to publish packages
    # (anyone can register by default, remember?)
    publish: $all

    # if package is not available locally, proxy requests to 'npmjs' registry
    proxy: npmjs

# log settings
logs:
  - { type: stdout, format: pretty, level: warn }
  #- {type: file, path: verdaccio.log, level: info}

# See https://github.com/verdaccio/verdaccio/issues/301
server:
  keepAliveTimeout: 0
```

--------------------------------------------------------------------------------

---[FILE: jest.config.js]---
Location: create-react-app-main/test/jest.config.js

```javascript
'use strict';

module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.test.js'],
  testPathIgnorePatterns: ['/src/', 'node_modules'],
};
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: create-react-app-main/test/README.md

```text
# Create React App End-to-End Tests

## Usage

These tests ensure various functionality contracts are upheld across dependency upgrades.

To get started locally, run `npx jest test/ --watchAll`.

It's suggested that you filter down tests to avoid re-running everything. The most common tests will be the webpack messages.<br>
To only run the webpack messages, type `p` followed by `webpack-message` and press `[enter]`.

## How do these work?

### `fixtures/`

Each `fixture/` gets spun up in a temporary directory and has its dependencies installed with Yarn PnP (for speed).<br>
To opt-out of PnP, create a `.disable-pnp` file in the specific fixture directory.

A global (`testSetup`) is created which has a few interesting properties:

- `testSetup.testDirectory`: the directory containing the test application
- `testSetup.scripts`: an object allowing you to invoke `react-scripts` commands and friends

All tests for each `fixture/` are then ran.

#### `testSetup.scripts`

##### `start`

This will run the `start` command, it can be ran asynchronously or blocking if `{ smoke: true }` is used.<br>
If ran asynchronously, it will return the `port` and a `done` function to clean up the process.
If ran blocking, it will return the `stdout` and `stderr` of the process.

##### `build`

This will run the `build` command and return the `stdout` and `stderr` of the process.

##### `test`

This will run the `test` command and return the `stdout` and `stderr` of the process.

##### `serve`

This will run serve the application.
It will return the `port` and a `done` function to clean up the process.
```

--------------------------------------------------------------------------------

---[FILE: index.test.js]---
Location: create-react-app-main/test/fixtures/boostrap-sass/index.test.js

```javascript
'use strict';

const testSetup = require('../__shared__/test-setup');

if (testSetup.isLocal) {
  // TODO: make this work locally
  test('skipped locally', () => {});
} else {
  test('builds in development', async () => {
    const { fulfilled } = await testSetup.scripts.start({ smoke: true });
    expect(fulfilled).toBe(true);
  });

  test('builds in production', async () => {
    const { fulfilled } = await testSetup.scripts.build();
    expect(fulfilled).toBe(true);
  });
}
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: create-react-app-main/test/fixtures/boostrap-sass/package.json
Signals: React

```json
{
  "dependencies": {
    "bootstrap": "^4.x",
    "node-sass": "^6.x",
    "react": "latest",
    "react-dom": "latest"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: create-react-app-main/test/fixtures/boostrap-sass/src/index.js
Signals: React

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.sass';

ReactDOM.render(<div />, document.getElementById('root'));
```

--------------------------------------------------------------------------------

---[FILE: index.sass]---
Location: create-react-app-main/test/fixtures/boostrap-sass/src/index.sass

```text
@import "~bootstrap/scss/bootstrap.scss";
```

--------------------------------------------------------------------------------

---[FILE: index.test.js]---
Location: create-react-app-main/test/fixtures/builds-with-multiple-runtimes/index.test.js

```javascript
'use strict';

const testSetup = require('../__shared__/test-setup');

test('builds in development', async () => {
  const { fulfilled } = await testSetup.scripts.start({ smoke: true });
  expect(fulfilled).toBe(true);
});
test('builds in production', async () => {
  const { fulfilled } = await testSetup.scripts.build();
  expect(fulfilled).toBe(true);
});
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: create-react-app-main/test/fixtures/builds-with-multiple-runtimes/package.json
Signals: React

```json
{
  "dependencies": {
    "dva": "^2.4.0",
    "history": "^4.7.2",
    "ky": "^0.3.0",
    "react": "latest",
    "react-dom": "latest"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: create-react-app-main/test/fixtures/builds-with-multiple-runtimes/src/index.js
Signals: React

```javascript
import React from 'react';
import dva from 'dva';
import createHistory from 'history/createHashHistory';
import ky from 'ky';

const app = dva({ history: createHistory() });
app.router(() => {
  ky.get('https://canihazip.com/s')
    .then(r => r.text())
    .then(console.log, console.error)
    .then(() => console.log('ok'));
  return <div>Test</div>;
});
app.start('#root');
```

--------------------------------------------------------------------------------

---[FILE: index.test.js]---
Location: create-react-app-main/test/fixtures/global-scss-asset-resolution/index.test.js

```javascript
'use strict';

const testSetup = require('../__shared__/test-setup');

if (testSetup.isLocal) {
  // TODO: make this work locally
  test('skipped locally', () => {});
} else {
  test('builds in development', async () => {
    const { fulfilled } = await testSetup.scripts.start({ smoke: true });
    expect(fulfilled).toBe(true);
  });

  test('builds in production', async () => {
    const { fulfilled } = await testSetup.scripts.build();
    expect(fulfilled).toBe(true);
  });
}
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: create-react-app-main/test/fixtures/global-scss-asset-resolution/package.json
Signals: React

```json
{
  "dependencies": {
    "node-sass": "^6.x",
    "react": "latest",
    "react-dom": "latest"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: create-react-app-main/test/fixtures/global-scss-asset-resolution/src/index.js
Signals: React

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

ReactDOM.render(<div />, document.getElementById('root'));
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: create-react-app-main/test/fixtures/global-scss-asset-resolution/src/index.scss

```text
#root {
  width: 300px;
  height: 300px;
  background: url(/images/logo.svg) center/cover no-repeat;
}
```

--------------------------------------------------------------------------------

````
