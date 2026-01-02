---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 35
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 35 of 552)

````text
================================================================================
FULLSTACK USER CREATED CODE DATABASE (VERBATIM) - vscode-main
================================================================================
Generated: December 18, 2025
Source: user_created_projects/vscode-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: extensions/git/package.json]---
Location: vscode-main/extensions/git/package.json

```json
{
  "name": "git",
  "displayName": "%displayName%",
  "description": "%description%",
  "publisher": "vscode",
  "license": "MIT",
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.5.0"
  },
  "aiKey": "0c6ae279ed8443289764825290e4f9e2-1a736e7c-1324-4338-be46-fc2a58ae4d14-7255",
  "enabledApiProposals": [
    "canonicalUriProvider",
    "contribEditSessions",
    "contribEditorContentMenu",
    "contribMergeEditorMenus",
    "contribMultiDiffEditorMenus",
    "contribDiffEditorGutterToolBarMenus",
    "contribSourceControlArtifactGroupMenu",
    "contribSourceControlArtifactMenu",
    "contribSourceControlHistoryItemMenu",
    "contribSourceControlHistoryTitleMenu",
    "contribSourceControlInputBoxMenu",
    "contribSourceControlTitleMenu",
    "contribViewsWelcome",
    "editSessionIdentityProvider",
    "quickDiffProvider",
    "quickInputButtonLocation",
    "quickPickSortByLabel",
    "scmActionButton",
    "scmArtifactProvider",
    "scmHistoryProvider",
    "scmMultiDiffEditor",
    "scmProviderOptions",
    "scmSelectedProvider",
    "scmTextDocument",
    "scmValidation",
    "statusBarItemTooltip",
    "tabInputMultiDiff",
    "tabInputTextMerge",
    "textEditorDiffInformation",
    "timeline"
  ],
  "categories": [
    "Other"
  ],
  "activationEvents": [
    "*",
    "onEditSession:file",
    "onFileSystem:git",
    "onFileSystem:git-show"
  ],
  "extensionDependencies": [
    "vscode.git-base"
  ],
  "main": "./out/main",
  "icon": "resources/icons/git.png",
  "scripts": {
    "compile": "gulp compile-extension:git",
    "watch": "gulp watch-extension:git",
    "update-emoji": "node ./build/update-emoji.js",
    "test": "node ../../node_modules/mocha/bin/mocha"
  },
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": false
    }
  },
  "contributes": {
    "commands": [
      {
        "command": "git.continueInLocalClone",
        "title": "%command.continueInLocalClone%",
        "category": "Git",
        "icon": "$(repo-clone)",
        "enablement": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && remoteName"
      },
      {
        "command": "git.clone",
        "title": "%command.clone%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.cloneRecursive",
        "title": "%command.cloneRecursive%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.init",
        "title": "%command.init%",
        "category": "Git",
        "icon": "$(add)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.openRepository",
        "title": "%command.openRepository%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.reopenClosedRepositories",
        "title": "%command.reopenClosedRepositories%",
        "icon": "$(repo)",
        "category": "Git",
        "enablement": "!operationInProgress && git.closedRepositoryCount != 0"
      },
      {
        "command": "git.close",
        "title": "%command.close%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.closeOtherRepositories",
        "title": "%command.closeOtherRepositories%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.openWorktree",
        "title": "%command.openWorktree%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.openWorktreeInNewWindow",
        "title": "%command.openWorktreeInNewWindow%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.refresh",
        "title": "%command.refresh%",
        "category": "Git",
        "icon": "$(refresh)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.compareWithWorkspace",
        "title": "%command.compareWithWorkspace%",
        "category": "Git"
      },
      {
        "command": "git.openChange",
        "title": "%command.openChange%",
        "category": "Git",
        "icon": "$(compare-changes)"
      },
      {
        "command": "git.openAllChanges",
        "title": "%command.openAllChanges%",
        "category": "Git"
      },
      {
        "command": "git.openFile",
        "title": "%command.openFile%",
        "category": "Git",
        "icon": "$(go-to-file)"
      },
      {
        "command": "git.openFile2",
        "title": "%command.openFile%",
        "category": "Git",
        "icon": "$(go-to-file)"
      },
      {
        "command": "git.openHEADFile",
        "title": "%command.openHEADFile%",
        "category": "Git"
      },
      {
        "command": "git.stage",
        "title": "%command.stage%",
        "category": "Git",
        "icon": "$(add)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stageAll",
        "title": "%command.stageAll%",
        "category": "Git",
        "icon": "$(add)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stageAllTracked",
        "title": "%command.stageAllTracked%",
        "category": "Git",
        "icon": "$(add)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stageAllUntracked",
        "title": "%command.stageAllUntracked%",
        "category": "Git",
        "icon": "$(add)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stageAllMerge",
        "title": "%command.stageAllMerge%",
        "category": "Git",
        "icon": "$(add)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stageSelectedRanges",
        "title": "%command.stageSelectedRanges%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.diff.stageHunk",
        "title": "%command.stageBlock%",
        "category": "Git",
        "icon": "$(plus)"
      },
      {
        "command": "git.diff.stageSelection",
        "title": "%command.stageSelection%",
        "category": "Git",
        "icon": "$(plus)"
      },
      {
        "command": "git.revertSelectedRanges",
        "title": "%command.revertSelectedRanges%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stageChange",
        "title": "%command.stageChange%",
        "category": "Git",
        "icon": "$(add)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stageFile",
        "title": "%command.stage%",
        "category": "Git",
        "icon": "$(add)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.revertChange",
        "title": "%command.revertChange%",
        "category": "Git",
        "icon": "$(discard)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.unstage",
        "title": "%command.unstage%",
        "category": "Git",
        "icon": "$(remove)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.unstageAll",
        "title": "%command.unstageAll%",
        "category": "Git",
        "icon": "$(remove)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.unstageSelectedRanges",
        "title": "%command.unstageSelectedRanges%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.unstageChange",
        "title": "%command.unstageChange%",
        "category": "Git",
        "icon": "$(remove)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.unstageFile",
        "title": "%command.unstage%",
        "category": "Git",
        "icon": "$(remove)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.clean",
        "title": "%command.clean%",
        "category": "Git",
        "icon": "$(discard)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.cleanAll",
        "title": "%command.cleanAll%",
        "category": "Git",
        "icon": "$(discard)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.cleanAllTracked",
        "title": "%command.cleanAllTracked%",
        "category": "Git",
        "icon": "$(discard)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.cleanAllUntracked",
        "title": "%command.cleanAllUntracked%",
        "category": "Git",
        "icon": "$(discard)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.rename",
        "title": "%command.rename%",
        "category": "Git",
        "icon": "$(discard)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commit",
        "title": "%command.commit%",
        "category": "Git",
        "icon": "$(check)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitAmend",
        "title": "%command.commitAmend%",
        "category": "Git",
        "icon": "$(check)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitSigned",
        "title": "%command.commitSigned%",
        "category": "Git",
        "icon": "$(check)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitStaged",
        "title": "%command.commitStaged%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitEmpty",
        "title": "%command.commitEmpty%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitStagedSigned",
        "title": "%command.commitStagedSigned%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitStagedAmend",
        "title": "%command.commitStagedAmend%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitAll",
        "title": "%command.commitAll%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitAllSigned",
        "title": "%command.commitAllSigned%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitAllAmend",
        "title": "%command.commitAllAmend%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitNoVerify",
        "title": "%command.commitNoVerify%",
        "category": "Git",
        "icon": "$(check)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitStagedNoVerify",
        "title": "%command.commitStagedNoVerify%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitEmptyNoVerify",
        "title": "%command.commitEmptyNoVerify%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitStagedSignedNoVerify",
        "title": "%command.commitStagedSignedNoVerify%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitAmendNoVerify",
        "title": "%command.commitAmendNoVerify%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitSignedNoVerify",
        "title": "%command.commitSignedNoVerify%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitStagedAmendNoVerify",
        "title": "%command.commitStagedAmendNoVerify%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitAllNoVerify",
        "title": "%command.commitAllNoVerify%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitAllSignedNoVerify",
        "title": "%command.commitAllSignedNoVerify%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitAllAmendNoVerify",
        "title": "%command.commitAllAmendNoVerify%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.commitMessageAccept",
        "title": "%command.commitMessageAccept%",
        "category": "Git"
      },
      {
        "command": "git.commitMessageDiscard",
        "title": "%command.commitMessageDiscard%",
        "icon": "$(close)",
        "category": "Git"
      },
      {
        "command": "git.restoreCommitTemplate",
        "title": "%command.restoreCommitTemplate%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.undoCommit",
        "title": "%command.undoCommit%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.checkout",
        "title": "%command.checkout%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.graph.checkout",
        "title": "%command.graphCheckout%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.checkoutDetached",
        "title": "%command.checkoutDetached%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.graph.checkoutDetached",
        "title": "%command.graphCheckoutDetached%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.branch",
        "title": "%command.branch%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.branchFrom",
        "title": "%command.branchFrom%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.deleteBranch",
        "title": "%command.deleteBranch%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.graph.deleteBranch",
        "title": "%command.graphDeleteBranch%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.deleteRemoteBranch",
        "title": "%command.deleteRemoteBranch%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.renameBranch",
        "title": "%command.renameBranch%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.merge",
        "title": "%command.merge%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.mergeAbort",
        "title": "%command.mergeAbort%",
        "category": "Git",
        "enablement": "gitMergeInProgress"
      },
      {
        "command": "git.rebase",
        "title": "%command.rebase%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.createTag",
        "title": "%command.createTag%",
        "icon": "$(plus)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.deleteTag",
        "title": "%command.deleteTag%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.migrateWorktreeChanges",
        "title": "%command.migrateWorktreeChanges%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.createWorktree",
        "title": "%command.createWorktree%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.deleteWorktree",
        "title": "%command.deleteWorktree%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.deleteWorktree2",
        "title": "%command.deleteWorktree2%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.graph.deleteTag",
        "title": "%command.graphDeleteTag%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.deleteRemoteTag",
        "title": "%command.deleteRemoteTag%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.fetch",
        "title": "%command.fetch%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.fetchPrune",
        "title": "%command.fetchPrune%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.fetchAll",
        "title": "%command.fetchAll%",
        "icon": "$(git-fetch)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.fetchRef",
        "title": "%command.fetch%",
        "icon": "$(git-fetch)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.pull",
        "title": "%command.pull%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.pullRebase",
        "title": "%command.pullRebase%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.pullFrom",
        "title": "%command.pullFrom%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.pullRef",
        "title": "%command.pull%",
        "icon": "$(repo-pull)",
        "category": "Git",
        "enablement": "!operationInProgress && scmCurrentHistoryItemRefInFilter && scmCurrentHistoryItemRefHasRemote"
      },
      {
        "command": "git.push",
        "title": "%command.push%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.pushForce",
        "title": "%command.pushForce%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.pushTo",
        "title": "%command.pushTo%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.pushToForce",
        "title": "%command.pushToForce%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.pushTags",
        "title": "%command.pushTags%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.pushWithTags",
        "title": "%command.pushFollowTags%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.pushWithTagsForce",
        "title": "%command.pushFollowTagsForce%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.pushRef",
        "title": "%command.push%",
        "icon": "$(repo-push)",
        "category": "Git",
        "enablement": "!operationInProgress && scmCurrentHistoryItemRefInFilter && scmCurrentHistoryItemRefHasRemote"
      },
      {
        "command": "git.cherryPick",
        "title": "%command.cherryPick%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.graph.cherryPick",
        "title": "%command.graphCherryPick%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.cherryPickAbort",
        "title": "%command.cherryPickAbort%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.addRemote",
        "title": "%command.addRemote%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.removeRemote",
        "title": "%command.removeRemote%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.sync",
        "title": "%command.sync%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.syncRebase",
        "title": "%command.syncRebase%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.publish",
        "title": "%command.publish%",
        "category": "Git",
        "icon": "$(cloud-upload)",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.showOutput",
        "title": "%command.showOutput%",
        "category": "Git"
      },
      {
        "command": "git.ignore",
        "title": "%command.ignore%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.revealInExplorer",
        "title": "%command.revealInExplorer%",
        "category": "Git"
      },
      {
        "command": "git.revealFileInOS.linux",
        "title": "%command.revealFileInOS.linux%",
        "category": "Git"
      },
      {
        "command": "git.revealFileInOS.mac",
        "title": "%command.revealFileInOS.mac%",
        "category": "Git"
      },
      {
        "command": "git.revealFileInOS.windows",
        "title": "%command.revealFileInOS.windows%",
        "category": "Git"
      },
      {
        "command": "git.stashIncludeUntracked",
        "title": "%command.stashIncludeUntracked%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stash",
        "title": "%command.stash%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stashStaged",
        "title": "%command.stashStaged%",
        "category": "Git",
        "enablement": "!operationInProgress && gitVersion2.35"
      },
      {
        "command": "git.stashPop",
        "title": "%command.stashPop%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stashPopLatest",
        "title": "%command.stashPopLatest%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stashPopEditor",
        "title": "%command.stashPopEditor%",
        "icon": "$(git-stash-pop)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stashApply",
        "title": "%command.stashApply%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stashApplyLatest",
        "title": "%command.stashApplyLatest%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stashApplyEditor",
        "title": "%command.stashApplyEditor%",
        "icon": "$(git-stash-apply)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stashDrop",
        "title": "%command.stashDrop%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stashDropAll",
        "title": "%command.stashDropAll%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stashDropEditor",
        "title": "%command.stashDropEditor%",
        "icon": "$(trash)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.stashView",
        "title": "%command.stashView%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.timeline.openDiff",
        "title": "%command.timelineOpenDiff%",
        "icon": "$(compare-changes)",
        "category": "Git"
      },
      {
        "command": "git.timeline.copyCommitId",
        "title": "%command.timelineCopyCommitId%",
        "category": "Git"
      },
      {
        "command": "git.timeline.copyCommitMessage",
        "title": "%command.timelineCopyCommitMessage%",
        "category": "Git"
      },
      {
        "command": "git.timeline.selectForCompare",
        "title": "%command.timelineSelectForCompare%",
        "category": "Git"
      },
      {
        "command": "git.timeline.compareWithSelected",
        "title": "%command.timelineCompareWithSelected%",
        "category": "Git"
      },
      {
        "command": "git.timeline.viewCommit",
        "title": "%command.viewCommit%",
        "icon": "$(diff-multiple)",
        "category": "Git"
      },
      {
        "command": "git.rebaseAbort",
        "title": "%command.rebaseAbort%",
        "category": "Git",
        "enablement": "gitRebaseInProgress"
      },
      {
        "command": "git.closeAllDiffEditors",
        "title": "%command.closeAllDiffEditors%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.closeAllUnmodifiedEditors",
        "title": "%command.closeAllUnmodifiedEditors%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.api.getRepositories",
        "title": "%command.api.getRepositories%",
        "category": "Git API"
      },
      {
        "command": "git.api.getRepositoryState",
        "title": "%command.api.getRepositoryState%",
        "category": "Git API"
      },
      {
        "command": "git.api.getRemoteSources",
        "title": "%command.api.getRemoteSources%",
        "category": "Git API"
      },
      {
        "command": "git.acceptMerge",
        "title": "%command.git.acceptMerge%",
        "category": "Git",
        "enablement": "isMergeEditor && mergeEditorResultUri in git.mergeChanges"
      },
      {
        "command": "git.openMergeEditor",
        "title": "%command.git.openMergeEditor%",
        "category": "Git"
      },
      {
        "command": "git.runGitMerge",
        "title": "%command.git.runGitMerge%",
        "category": "Git",
        "enablement": "isMergeEditor"
      },
      {
        "command": "git.runGitMergeDiff3",
        "title": "%command.git.runGitMergeDiff3%",
        "category": "Git",
        "enablement": "isMergeEditor"
      },
      {
        "command": "git.manageUnsafeRepositories",
        "title": "%command.manageUnsafeRepositories%",
        "category": "Git"
      },
      {
        "command": "git.openRepositoriesInParentFolders",
        "title": "%command.openRepositoriesInParentFolders%",
        "category": "Git"
      },
      {
        "command": "git.viewChanges",
        "title": "%command.viewChanges%",
        "icon": "$(diff-multiple)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.viewStagedChanges",
        "title": "%command.viewStagedChanges%",
        "icon": "$(diff-multiple)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.viewUntrackedChanges",
        "title": "%command.viewUntrackedChanges%",
        "icon": "$(diff-multiple)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.viewCommit",
        "title": "%command.viewCommit%",
        "icon": "$(diff-multiple)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.copyCommitId",
        "title": "%command.timelineCopyCommitId%",
        "category": "Git"
      },
      {
        "command": "git.copyCommitMessage",
        "title": "%command.timelineCopyCommitMessage%",
        "category": "Git"
      },
      {
        "command": "git.blame.toggleEditorDecoration",
        "title": "%command.blameToggleEditorDecoration%",
        "category": "Git"
      },
      {
        "command": "git.blame.toggleStatusBarItem",
        "title": "%command.blameToggleStatusBarItem%",
        "category": "Git"
      },
      {
        "command": "git.graph.compareRef",
        "title": "%command.graphCompareRef%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.graph.compareWithRemote",
        "title": "%command.graphCompareWithRemote%",
        "category": "Git",
        "enablement": "!operationInProgress && scmCurrentHistoryItemRefHasRemote"
      },
      {
        "command": "git.graph.compareWithMergeBase",
        "title": "%command.graphCompareWithMergeBase%",
        "category": "Git",
        "enablement": "!operationInProgress && scmCurrentHistoryItemRefHasBase"
      },
      {
        "command": "git.repositories.checkout",
        "title": "%command.graphCheckout%",
        "icon": "$(target)",
        "category": "Git",
        "enablement": "!operationInProgress && !scmArtifactIsHistoryItemRef"
      },
      {
        "command": "git.repositories.checkoutDetached",
        "title": "%command.graphCheckoutDetached%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.compareRef",
        "title": "%command.graphCompareRef%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.createBranch",
        "title": "%command.branch%",
        "icon": "$(plus)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.createTag",
        "title": "%command.createTag%",
        "icon": "$(plus)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.merge",
        "title": "%command.merge2%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.rebase",
        "title": "%command.rebase2%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.deleteBranch",
        "title": "%command.deleteRef%",
        "category": "Git",
        "enablement": "!operationInProgress && !scmArtifactIsHistoryItemRef"
      },
      {
        "command": "git.repositories.deleteTag",
        "title": "%command.deleteRef%",
        "category": "Git",
        "enablement": "!operationInProgress && !scmArtifactIsHistoryItemRef"
      },
      {
        "command": "git.repositories.createFrom",
        "title": "%command.createFrom%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.stashView",
        "title": "%command.stashView2%",
        "icon": "$(diff-multiple)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.stashApply",
        "title": "%command.stashApplyEditor%",
        "icon": "$(git-stash-apply)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.stashPop",
        "title": "%command.stashPopEditor%",
        "icon": "$(git-stash-pop)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.stashDrop",
        "title": "%command.stashDropEditor%",
        "icon": "$(trash)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.createWorktree",
        "title": "%command.createWorktree%",
        "icon": "$(plus)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.openWorktree",
        "title": "%command.openWorktree2%",
        "icon": "$(folder-opened)",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.openWorktreeInNewWindow",
        "title": "%command.openWorktreeInNewWindow2%",
        "category": "Git",
        "enablement": "!operationInProgress"
      },
      {
        "command": "git.repositories.deleteWorktree",
        "title": "%command.deleteRef%",
        "category": "Git",
        "enablement": "!operationInProgress"
      }
    ],
    "continueEditSession": [
      {
        "command": "git.continueInLocalClone",
        "qualifiedName": "%command.continueInLocalClone.qualifiedName%",
        "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && remoteName",
        "remoteGroup": "remote_42_git_0_local@0"
      }
    ],
    "keybindings": [
      {
        "command": "git.stageSelectedRanges",
        "key": "ctrl+k ctrl+alt+s",
        "mac": "cmd+k cmd+alt+s",
        "when": "editorTextFocus && resourceScheme == file"
      },
      {
        "command": "git.unstageSelectedRanges",
        "key": "ctrl+k ctrl+n",
        "mac": "cmd+k cmd+n",
        "when": "editorTextFocus && isInDiffEditor && isInDiffRightEditor && resourceScheme == git"
      },
      {
        "command": "git.revertSelectedRanges",
        "key": "ctrl+k ctrl+r",
        "mac": "cmd+k cmd+r",
        "when": "editorTextFocus && resourceScheme == file"
      }
    ],
    "menus": {
      "commandPalette": [
        {
          "command": "git.continueInLocalClone",
          "when": "false"
        },
        {
          "command": "git.clone",
          "when": "config.git.enabled && !git.missing"
        },
        {
          "command": "git.cloneRecursive",
          "when": "config.git.enabled && !git.missing"
        },
        {
          "command": "git.init",
          "when": "config.git.enabled && !git.missing && remoteName != 'codespaces'"
        },
        {
          "command": "git.openRepository",
          "when": "config.git.enabled && !git.missing"
        },
        {
          "command": "git.close",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.closeOtherRepositories",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount > 1"
        },
        {
          "command": "git.openWorktree",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount > 1"
        },
        {
          "command": "git.openWorktreeInNewWindow",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount > 1"
        },
        {
          "command": "git.refresh",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.openFile",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && resourceScheme == file && scmActiveResourceHasChanges"
        },
        {
          "command": "git.openHEADFile",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && resourceScheme == file && scmActiveResourceHasChanges"
        },
        {
          "command": "git.openChange",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stage",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stageAll",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stageAllTracked",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stageAllUntracked",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stageAllMerge",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stageSelectedRanges",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && resourceScheme == file"
        },
        {
          "command": "git.stageChange",
          "when": "false"
        },
        {
          "command": "git.revertSelectedRanges",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && resourceScheme == file"
        },
        {
          "command": "git.revertChange",
          "when": "false"
        },
        {
          "command": "git.openFile2",
          "when": "false"
        },
        {
          "command": "git.unstage",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.unstageAll",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.unstageSelectedRanges",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && resourceScheme == git"
        },
        {
          "command": "git.unstageChange",
          "when": "false"
        },
        {
          "command": "git.clean",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.cleanAll",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.cleanAllTracked",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.cleanAllUntracked",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.rename",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && resourceScheme == file && scmActiveResourceRepository"
        },
        {
          "command": "git.commit",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitAmend",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitSigned",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitStaged",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitEmpty",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitStagedSigned",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitStagedAmend",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitAll",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitAllSigned",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitAllAmend",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.rebaseAbort",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && gitRebaseInProgress"
        },
        {
          "command": "git.commitNoVerify",
          "when": "config.git.enabled && !git.missing && config.git.allowNoVerifyCommit && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitStagedNoVerify",
          "when": "config.git.enabled && !git.missing && config.git.allowNoVerifyCommit && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitEmptyNoVerify",
          "when": "config.git.enabled && !git.missing && config.git.allowNoVerifyCommit && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitStagedSignedNoVerify",
          "when": "config.git.enabled && !git.missing && config.git.allowNoVerifyCommit && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitAmendNoVerify",
          "when": "config.git.enabled && !git.missing && config.git.allowNoVerifyCommit && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitSignedNoVerify",
          "when": "config.git.enabled && !git.missing && config.git.allowNoVerifyCommit && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitStagedAmendNoVerify",
          "when": "config.git.enabled && !git.missing && config.git.allowNoVerifyCommit && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitAllNoVerify",
          "when": "config.git.enabled && !git.missing && config.git.allowNoVerifyCommit && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitAllSignedNoVerify",
          "when": "config.git.enabled && !git.missing && config.git.allowNoVerifyCommit && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.commitAllAmendNoVerify",
          "when": "config.git.enabled && !git.missing && config.git.allowNoVerifyCommit && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.restoreCommitTemplate",
          "when": "false"
        },
        {
          "command": "git.commitMessageAccept",
          "when": "false"
        },
        {
          "command": "git.commitMessageDiscard",
          "when": "false"
        },
        {
          "command": "git.revealInExplorer",
          "when": "false"
        },
        {
          "command": "git.revealFileInOS.linux",
          "when": "false"
        },
        {
          "command": "git.revealFileInOS.mac",
          "when": "false"
        },
        {
          "command": "git.revealFileInOS.windows",
          "when": "false"
        },
        {
          "command": "git.undoCommit",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.checkout",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.branch",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.branchFrom",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.deleteBranch",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.deleteRemoteBranch",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.renameBranch",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.cherryPick",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.cherryPickAbort",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && gitCherryPickInProgress"
        },
        {
          "command": "git.pull",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.pullFrom",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.pullRebase",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.merge",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.mergeAbort",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && gitMergeInProgress"
        },
        {
          "command": "git.rebase",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.createTag",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.deleteTag",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.migrateWorktreeChanges",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.createWorktree",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.openWorktree",
          "when": "false"
        },
        {
          "command": "git.openWorktreeInNewWindow",
          "when": "false"
        },
        {
          "command": "git.deleteWorktree",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.deleteWorktree2",
          "when": "false"
        },
        {
          "command": "git.deleteRemoteTag",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.fetch",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.fetchPrune",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.fetchAll",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.push",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.pushForce",
          "when": "config.git.enabled && !git.missing && config.git.allowForcePush && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.pushTo",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.pushToForce",
          "when": "config.git.enabled && !git.missing && config.git.allowForcePush && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.pushWithTags",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.pushWithTagsForce",
          "when": "config.git.enabled && !git.missing && config.git.allowForcePush && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.pushTags",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.addRemote",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.removeRemote",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.sync",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.syncRebase",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.publish",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.showOutput",
          "when": "config.git.enabled"
        },
        {
          "command": "git.ignore",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && resourceScheme == file && scmActiveResourceRepository"
        },
        {
          "command": "git.stashIncludeUntracked",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stash",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stashStaged",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && gitVersion2.35"
        },
        {
          "command": "git.stashPop",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stashPopLatest",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stashPopEditor",
          "when": "false"
        },
        {
          "command": "git.stashApply",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stashApplyLatest",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stashApplyEditor",
          "when": "false"
        },
        {
          "command": "git.stashDrop",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stashDropAll",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.stashDropEditor",
          "when": "false"
        },
        {
          "command": "git.timeline.openDiff",
          "when": "false"
        },
        {
          "command": "git.timeline.copyCommitId",
          "when": "false"
        },
        {
          "command": "git.timeline.copyCommitMessage",
          "when": "false"
        },
        {
          "command": "git.timeline.selectForCompare",
          "when": "false"
        },
        {
          "command": "git.timeline.compareWithSelected",
          "when": "false"
        },
        {
          "command": "git.timeline.viewCommit",
          "when": "false"
        },
        {
          "command": "git.closeAllDiffEditors",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0"
        },
        {
          "command": "git.api.getRepositories",
          "when": "false"
        },
        {
          "command": "git.api.getRepositoryState",
          "when": "false"
        },
        {
          "command": "git.api.getRemoteSources",
          "when": "false"
        },
        {
          "command": "git.openMergeEditor",
          "when": "false"
        },
        {
          "command": "git.manageUnsafeRepositories",
          "when": "config.git.enabled && !git.missing && git.unsafeRepositoryCount != 0"
        },
        {
          "command": "git.openRepositoriesInParentFolders",
          "when": "config.git.enabled && !git.missing && git.parentRepositoryCount != 0"
        },
        {
          "command": "git.stashView",
          "when": "config.git.enabled && !git.missing"
        },
        {
          "command": "git.viewChanges",
          "when": "config.git.enabled && !git.missing"
        },
        {
          "command": "git.viewStagedChanges",
          "when": "config.git.enabled && !git.missing"
        },
        {
          "command": "git.viewUntrackedChanges",
          "when": "config.git.enabled && !git.missing && config.git.untrackedChanges == separate"
        },
        {
          "command": "git.viewCommit",
          "when": "false"
        },
        {
          "command": "git.stageFile",
          "when": "false"
        },
        {
          "command": "git.unstageFile",
          "when": "false"
        },
        {
          "command": "git.fetchRef",
          "when": "false"
        },
        {
          "command": "git.pullRef",
          "when": "false"
        },
        {
          "command": "git.pushRef",
          "when": "false"
        },
        {
          "command": "git.copyCommitId",
          "when": "false"
        },
        {
          "command": "git.copyCommitMessage",
          "when": "false"
        },
        {
          "command": "git.graph.checkout",
          "when": "false"
        },
        {
          "command": "git.graph.checkoutDetached",
          "when": "false"
        },
        {
          "command": "git.graph.deleteBranch",
          "when": "false"
        },
        {
          "command": "git.graph.compareRef",
          "when": "false"
        },
        {
          "command": "git.graph.deleteTag",
          "when": "false"
        },
        {
          "command": "git.graph.cherryPick",
          "when": "false"
        },
        {
          "command": "git.graph.compareWithMergeBase",
          "when": "false"
        },
        {
          "command": "git.graph.compareWithRemote",
          "when": "false"
        },
        {
          "command": "git.diff.stageHunk",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && diffEditorOriginalUri =~ /^git\\:.*%22ref%22%3A%22~%22%7D$/"
        },
        {
          "command": "git.diff.stageSelection",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && diffEditorOriginalUri =~ /^git\\:.*%22ref%22%3A%22~%22%7D$/"
        },
        {
          "command": "git.repositories.checkout",
          "when": "false"
        },
        {
          "command": "git.repositories.checkoutDetached",
          "when": "false"
        },
        {
          "command": "git.repositories.compareRef",
          "when": "false"
        },
        {
          "command": "git.repositories.createBranch",
          "when": "false"
        },
        {
          "command": "git.repositories.createTag",
          "when": "false"
        },
        {
          "command": "git.repositories.merge",
          "when": "false"
        },
        {
          "command": "git.repositories.rebase",
          "when": "false"
        },
        {
          "command": "git.repositories.deleteBranch",
          "when": "false"
        },
        {
          "command": "git.repositories.deleteTag",
          "when": "false"
        },
        {
          "command": "git.repositories.createFrom",
          "when": "false"
        },
        {
          "command": "git.repositories.stashView",
          "when": "false"
        },
        {
          "command": "git.repositories.stashApply",
          "when": "false"
        },
        {
          "command": "git.repositories.stashPop",
          "when": "false"
        },
        {
          "command": "git.repositories.stashDrop",
          "when": "false"
        },
        {
          "command": "git.repositories.createWorktree",
          "when": "false"
        },
        {
          "command": "git.repositories.openWorktree",
          "when": "false"
        },
        {
          "command": "git.repositories.openWorktreeInNewWindow",
          "when": "false"
        },
        {
          "command": "git.repositories.deleteWorktree",
          "when": "false"
        }
      ],
      "scm/title": [
        {
          "command": "git.commit",
          "group": "navigation",
          "when": "scmProvider == git"
        },
        {
          "command": "git.refresh",
          "group": "navigation",
          "when": "scmProvider == git"
        },
        {
          "command": "git.pull",
          "group": "1_header@1",
          "when": "scmProvider == git"
        },
        {
          "command": "git.push",
          "group": "1_header@2",
          "when": "scmProvider == git"
        },
        {
          "command": "git.clone",
          "group": "1_header@3",
          "when": "scmProvider == git"
        },
        {
          "command": "git.checkout",
          "group": "1_header@4",
          "when": "scmProvider == git"
        },
        {
          "command": "git.fetch",
          "group": "1_header@5",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.commit",
          "group": "2_main@1",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.changes",
          "group": "2_main@2",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.pullpush",
          "group": "2_main@3",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.branch",
          "group": "2_main@4",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.remotes",
          "group": "2_main@5",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.stash",
          "group": "2_main@6",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.tags",
          "group": "2_main@7",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.worktrees",
          "group": "2_main@8",
          "when": "scmProvider == git"
        },
        {
          "command": "git.showOutput",
          "group": "3_footer",
          "when": "scmProvider == git"
        }
      ],
      "scm/repositories/title": [
        {
          "command": "git.reopenClosedRepositories",
          "group": "navigation@1",
          "when": "git.closedRepositoryCount > 0"
        }
      ],
      "scm/repository": [
        {
          "command": "git.pull",
          "group": "1_header@1",
          "when": "scmProvider == git"
        },
        {
          "command": "git.push",
          "group": "1_header@2",
          "when": "scmProvider == git"
        },
        {
          "command": "git.clone",
          "group": "1_header@3",
          "when": "scmProvider == git"
        },
        {
          "command": "git.checkout",
          "group": "1_header@4",
          "when": "scmProvider == git"
        },
        {
          "command": "git.fetch",
          "group": "1_header@5",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.commit",
          "group": "2_main@1",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.changes",
          "group": "2_main@2",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.pullpush",
          "group": "2_main@3",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.branch",
          "group": "2_main@4",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.remotes",
          "group": "2_main@5",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.stash",
          "group": "2_main@6",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.tags",
          "group": "2_main@7",
          "when": "scmProvider == git"
        },
        {
          "submenu": "git.worktrees",
          "group": "2_main@8",
          "when": "scmProvider == git"
        },
        {
          "command": "git.showOutput",
          "group": "3_footer",
          "when": "scmProvider == git"
        }
      ],
      "scm/sourceControl": [
        {
          "command": "git.close",
          "group": "navigation@1",
          "when": "scmProvider == git"
        },
        {
          "command": "git.closeOtherRepositories",
          "group": "navigation@2",
          "when": "scmProvider == git && gitOpenRepositoryCount > 1"
        },
        {
          "command": "git.openWorktree",
          "group": "1_worktree@1",
          "when": "scmProvider == git && scmProviderContext == worktree"
        },
        {
          "command": "git.openWorktreeInNewWindow",
          "group": "1_worktree@2",
          "when": "scmProvider == git && scmProviderContext == worktree"
        },
        {
          "command": "git.deleteWorktree2",
          "group": "2_worktree@1",
          "when": "scmProvider == git && scmProviderContext == worktree"
        }
      ],
      "scm/artifactGroup/context": [
        {
          "command": "git.repositories.createBranch",
          "group": "inline@1",
          "when": "scmProvider == git && scmArtifactGroup == branches"
        },
        {
          "command": "git.repositories.createTag",
          "group": "inline@1",
          "when": "scmProvider == git && scmArtifactGroup == tags"
        },
        {
          "submenu": "git.repositories.stash",
          "group": "inline@1",
          "when": "scmProvider == git && scmArtifactGroup == stashes"
        },
        {
          "command": "git.repositories.createWorktree",
          "group": "inline@1",
          "when": "scmProvider == git && scmArtifactGroup == worktrees"
        }
      ],
      "scm/artifact/context": [
        {
          "command": "git.repositories.checkout",
          "group": "inline@1",
          "when": "scmProvider == git && (scmArtifactGroupId == branches || scmArtifactGroupId == tags)"
        },
        {
          "command": "git.repositories.stashApply",
          "alt": "git.repositories.stashPop",
          "group": "inline@1",
          "when": "scmProvider == git && scmArtifactGroupId == stashes"
        },
        {
          "command": "git.repositories.stashView",
          "group": "1_view@1",
          "when": "scmProvider == git && scmArtifactGroupId == stashes"
        },
        {
          "command": "git.repositories.stashApply",
          "group": "2_apply@1",
          "when": "scmProvider == git && scmArtifactGroupId == stashes"
        },
        {
          "command": "git.repositories.stashPop",
          "group": "2_apply@2",
          "when": "scmProvider == git && scmArtifactGroupId == stashes"
        },
        {
          "command": "git.repositories.stashDrop",
          "group": "3_drop@3",
          "when": "scmProvider == git && scmArtifactGroupId == stashes"
        },
        {
          "command": "git.repositories.checkout",
          "group": "1_checkout@1",
          "when": "scmProvider == git && (scmArtifactGroupId == branches || scmArtifactGroupId == tags)"
        },
        {
          "command": "git.repositories.checkoutDetached",
          "group": "1_checkout@2",
          "when": "scmProvider == git && (scmArtifactGroupId == branches || scmArtifactGroupId == tags)"
        },
        {
          "command": "git.repositories.merge",
          "group": "2_modify@1",
          "when": "scmProvider == git && scmArtifactGroupId == branches"
        },
        {
          "command": "git.repositories.rebase",
          "group": "2_modify@2",
          "when": "scmProvider == git && scmArtifactGroupId == branches"
        },
        {
          "command": "git.repositories.createFrom",
          "group": "3_modify@1",
          "when": "scmProvider == git && scmArtifactGroupId == branches"
        },
        {
          "command": "git.repositories.deleteBranch",
          "group": "3_modify@2",
          "when": "scmProvider == git && scmArtifactGroupId == branches"
        },
        {
          "command": "git.repositories.deleteTag",
          "group": "3_modify@1",
          "when": "scmProvider == git && scmArtifactGroupId == tags"
        },
        {
          "command": "git.repositories.compareRef",
          "group": "4_compare@1",
          "when": "scmProvider == git && (scmArtifactGroupId == branches || scmArtifactGroupId == tags)"
        },
        {
          "command": "git.repositories.openWorktree",
          "group": "inline@1",
          "when": "scmProvider == git && scmArtifactGroupId == worktrees"
        },
        {
          "command": "git.repositories.openWorktree",
          "group": "1_open@1",
          "when": "scmProvider == git && scmArtifactGroupId == worktrees"
        },
        {
          "command": "git.repositories.openWorktreeInNewWindow",
          "group": "1_open@2",
          "when": "scmProvider == git && scmArtifactGroupId == worktrees"
        },
        {
          "command": "git.repositories.deleteWorktree",
          "group": "2_modify@1",
          "when": "scmProvider == git && scmArtifactGroupId == worktrees"
        }
      ],
      "scm/resourceGroup/context": [
        {
          "command": "git.stageAllMerge",
          "when": "scmProvider == git && scmResourceGroup == merge",
          "group": "1_modification"
        },
        {
          "command": "git.stageAllMerge",
          "when": "scmProvider == git && scmResourceGroup == merge",
          "group": "inline@2"
        },
        {
          "command": "git.unstageAll",
          "when": "scmProvider == git && scmResourceGroup == index",
          "group": "1_modification"
        },
        {
          "command": "git.unstageAll",
          "when": "scmProvider == git && scmResourceGroup == index",
          "group": "inline@2"
        },
        {
          "command": "git.viewStagedChanges",
          "when": "scmProvider == git && scmResourceGroup == index",
          "group": "inline@1"
        },
        {
          "command": "git.viewChanges",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "inline@1"
        },
        {
          "command": "git.cleanAll",
          "when": "scmProvider == git && scmResourceGroup == workingTree && config.git.untrackedChanges == mixed",
          "group": "1_modification"
        },
        {
          "command": "git.stageAll",
          "when": "scmProvider == git && scmResourceGroup == workingTree && config.git.untrackedChanges == mixed",
          "group": "1_modification"
        },
        {
          "command": "git.cleanAll",
          "when": "scmProvider == git && scmResourceGroup == workingTree && config.git.untrackedChanges == mixed",
          "group": "inline@2"
        },
        {
          "command": "git.stageAll",
          "when": "scmProvider == git && scmResourceGroup == workingTree && config.git.untrackedChanges == mixed",
          "group": "inline@2"
        },
        {
          "command": "git.cleanAllTracked",
          "when": "scmProvider == git && scmResourceGroup == workingTree && config.git.untrackedChanges != mixed",
          "group": "1_modification"
        },
        {
          "command": "git.stageAllTracked",
          "when": "scmProvider == git && scmResourceGroup == workingTree && config.git.untrackedChanges != mixed",
          "group": "1_modification"
        },
        {
          "command": "git.cleanAllTracked",
          "when": "scmProvider == git && scmResourceGroup == workingTree && config.git.untrackedChanges != mixed",
          "group": "inline@2"
        },
        {
          "command": "git.stageAllTracked",
          "when": "scmProvider == git && scmResourceGroup == workingTree && config.git.untrackedChanges != mixed",
          "group": "inline@2"
        },
        {
          "command": "git.cleanAllUntracked",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "1_modification"
        },
        {
          "command": "git.stageAllUntracked",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "1_modification"
        },
        {
          "command": "git.viewUntrackedChanges",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "inline@1"
        },
        {
          "command": "git.cleanAllUntracked",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "inline@2"
        },
        {
          "command": "git.stageAllUntracked",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "inline@2"
        }
      ],
      "scm/resourceFolder/context": [
        {
          "command": "git.stage",
          "when": "scmProvider == git && scmResourceGroup == merge",
          "group": "1_modification"
        },
        {
          "command": "git.stage",
          "when": "scmProvider == git && scmResourceGroup == merge",
          "group": "inline@2"
        },
        {
          "command": "git.unstage",
          "when": "scmProvider == git && scmResourceGroup == index",
          "group": "1_modification"
        },
        {
          "command": "git.unstage",
          "when": "scmProvider == git && scmResourceGroup == index",
          "group": "inline@2"
        },
        {
          "command": "git.stage",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "1_modification"
        },
        {
          "command": "git.clean",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "1_modification"
        },
        {
          "command": "git.clean",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "inline@2"
        },
        {
          "command": "git.stage",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "inline@2"
        },
        {
          "command": "git.ignore",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "1_modification@3"
        },
        {
          "command": "git.stage",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "1_modification"
        },
        {
          "command": "git.stage",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "inline@2"
        },
        {
          "command": "git.clean",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "1_modification"
        },
        {
          "command": "git.clean",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "inline@2"
        },
        {
          "command": "git.ignore",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "1_modification@3"
        }
      ],
      "scm/resourceState/context": [
        {
          "command": "git.stage",
          "when": "scmProvider == git && scmResourceGroup == merge",
          "group": "1_modification"
        },
        {
          "command": "git.openFile",
          "when": "scmProvider == git && scmResourceGroup == merge",
          "group": "navigation"
        },
        {
          "command": "git.stage",
          "when": "scmProvider == git && scmResourceGroup == merge",
          "group": "inline@2"
        },
        {
          "command": "git.revealFileInOS.linux",
          "when": "scmProvider == git && scmResourceGroup == merge && remoteName == '' && isLinux",
          "group": "2_view@1"
        },
        {
          "command": "git.revealFileInOS.mac",
          "when": "scmProvider == git && scmResourceGroup == merge && remoteName == '' && isMac",
          "group": "2_view@1"
        },
        {
          "command": "git.revealFileInOS.windows",
          "when": "scmProvider == git && scmResourceGroup == merge && remoteName == '' && isWindows",
          "group": "2_view@1"
        },
        {
          "command": "git.revealInExplorer",
          "when": "scmProvider == git && scmResourceGroup == merge",
          "group": "2_view@2"
        },
        {
          "command": "git.openFile2",
          "when": "scmProvider == git && scmResourceGroup == merge && config.git.showInlineOpenFileAction && config.git.openDiffOnClick",
          "group": "inline@1"
        },
        {
          "command": "git.openChange",
          "when": "scmProvider == git && scmResourceGroup == merge && config.git.showInlineOpenFileAction && !config.git.openDiffOnClick",
          "group": "inline@1"
        },
        {
          "command": "git.openChange",
          "when": "scmProvider == git && scmResourceGroup == index",
          "group": "navigation"
        },
        {
          "command": "git.openFile",
          "when": "scmProvider == git && scmResourceGroup == index",
          "group": "navigation"
        },
        {
          "command": "git.openHEADFile",
          "when": "scmProvider == git && scmResourceGroup == index",
          "group": "navigation"
        },
        {
          "command": "git.unstage",
          "when": "scmProvider == git && scmResourceGroup == index",
          "group": "1_modification"
        },
        {
          "command": "git.unstage",
          "when": "scmProvider == git && scmResourceGroup == index",
          "group": "inline@2"
        },
        {
          "command": "git.revealFileInOS.linux",
          "when": "scmProvider == git && scmResourceGroup == index && remoteName == '' && isLinux",
          "group": "2_view@1"
        },
        {
          "command": "git.revealFileInOS.mac",
          "when": "scmProvider == git && scmResourceGroup == index && remoteName == '' && isMac",
          "group": "2_view@1"
        },
        {
          "command": "git.revealFileInOS.windows",
          "when": "scmProvider == git && scmResourceGroup == index && remoteName == '' && isWindows",
          "group": "2_view@1"
        },
        {
          "command": "git.revealInExplorer",
          "when": "scmProvider == git && scmResourceGroup == index",
          "group": "2_view@2"
        },
        {
          "command": "git.compareWithWorkspace",
          "when": "scmProvider == git && scmResourceGroup == index && scmResourceState == worktree",
          "group": "worktree_diff"
        },
        {
          "command": "git.openFile2",
          "when": "scmProvider == git && scmResourceGroup == index && config.git.showInlineOpenFileAction && config.git.openDiffOnClick",
          "group": "inline@1"
        },
        {
          "command": "git.openChange",
          "when": "scmProvider == git && scmResourceGroup == index && config.git.showInlineOpenFileAction && !config.git.openDiffOnClick",
          "group": "inline@1"
        },
        {
          "command": "git.openChange",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "navigation"
        },
        {
          "command": "git.openHEADFile",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "navigation"
        },
        {
          "command": "git.openFile",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "navigation"
        },
        {
          "command": "git.stage",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "1_modification"
        },
        {
          "command": "git.clean",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "1_modification"
        },
        {
          "command": "git.clean",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "inline@2"
        },
        {
          "command": "git.stage",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "inline@2"
        },
        {
          "command": "git.compareWithWorkspace",
          "when": "scmProvider == git && scmResourceGroup == workingTree && scmResourceState == worktree",
          "group": "worktree_diff"
        },
        {
          "command": "git.openFile2",
          "when": "scmProvider == git && scmResourceGroup == workingTree && config.git.showInlineOpenFileAction && config.git.openDiffOnClick",
          "group": "inline@1"
        },
        {
          "command": "git.openChange",
          "when": "scmProvider == git && scmResourceGroup == workingTree && config.git.showInlineOpenFileAction && !config.git.openDiffOnClick",
          "group": "inline@1"
        },
        {
          "command": "git.ignore",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "1_modification@3"
        },
        {
          "command": "git.revealFileInOS.linux",
          "when": "scmProvider == git && scmResourceGroup == workingTree && remoteName == '' && isLinux",
          "group": "2_view@1"
        },
        {
          "command": "git.revealFileInOS.mac",
          "when": "scmProvider == git && scmResourceGroup == workingTree && remoteName == '' && isMac",
          "group": "2_view@1"
        },
        {
          "command": "git.revealFileInOS.windows",
          "when": "scmProvider == git && scmResourceGroup == workingTree && remoteName == '' && isWindows",
          "group": "2_view@1"
        },
        {
          "command": "git.revealInExplorer",
          "when": "scmProvider == git && scmResourceGroup == workingTree",
          "group": "2_view@2"
        },
        {
          "command": "git.openChange",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "navigation"
        },
        {
          "command": "git.openHEADFile",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "navigation"
        },
        {
          "command": "git.openFile",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "navigation"
        },
        {
          "command": "git.stage",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "1_modification"
        },
        {
          "command": "git.clean",
          "when": "scmProvider == git && scmResourceGroup == untracked && !gitFreshRepository",
          "group": "1_modification"
        },
        {
          "command": "git.clean",
          "when": "scmProvider == git && scmResourceGroup == untracked && !gitFreshRepository",
          "group": "inline@2"
        },
        {
          "command": "git.stage",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "inline@2"
        },
        {
          "command": "git.openFile2",
          "when": "scmProvider == git && scmResourceGroup == untracked && config.git.showInlineOpenFileAction && config.git.openDiffOnClick",
          "group": "inline@1"
        },
        {
          "command": "git.openChange",
          "when": "scmProvider == git && scmResourceGroup == untracked && config.git.showInlineOpenFileAction && !config.git.openDiffOnClick",
          "group": "inline@1"
        },
        {
          "command": "git.ignore",
          "when": "scmProvider == git && scmResourceGroup == untracked",
          "group": "1_modification@3"
        }
      ],
      "scm/history/title": [
        {
          "command": "git.fetchAll",
          "group": "navigation@900",
          "when": "scmProvider == git"
        },
        {
          "command": "git.pullRef",
          "group": "navigation@901",
          "when": "scmProvider == git"
        },
        {
          "command": "git.pushRef",
          "when": "scmProvider == git && scmCurrentHistoryItemRefHasRemote",
          "group": "navigation@902"
        },
        {
          "command": "git.publish",
          "when": "scmProvider == git && !scmCurrentHistoryItemRefHasRemote",
          "group": "navigation@903"
        }
      ],
      "scm/historyItem/context": [
        {
          "command": "git.graph.checkoutDetached",
          "when": "scmProvider == git",
          "group": "1_checkout@2"
        },
        {
          "command": "git.branch",
          "when": "scmProvider == git",
          "group": "2_branch@2"
        },
        {
          "command": "git.createTag",
          "when": "scmProvider == git",
          "group": "3_tag@1"
        },
        {
          "command": "git.graph.cherryPick",
          "when": "scmProvider == git",
          "group": "4_modify@1"
        },
        {
          "command": "git.graph.compareWithRemote",
          "when": "scmProvider == git",
          "group": "5_compare@1"
        },
        {
          "command": "git.graph.compareWithMergeBase",
          "when": "scmProvider == git",
          "group": "5_compare@2"
        },
        {
          "command": "git.graph.compareRef",
          "when": "scmProvider == git",
          "group": "5_compare@3"
        },
        {
          "command": "git.copyCommitId",
          "when": "scmProvider == git && !listMultiSelection",
          "group": "9_copy@1"
        },
        {
          "command": "git.copyCommitMessage",
          "when": "scmProvider == git && !listMultiSelection",
          "group": "9_copy@2"
        }
      ],
      "scm/historyItemRef/context": [
        {
          "command": "git.graph.checkout",
          "when": "scmProvider == git",
          "group": "1_checkout@1"
        },
        {
          "command": "git.graph.deleteBranch",
          "when": "scmProvider == git && scmHistoryItemRef =~ /^refs\\/heads\\/|^refs\\/remotes\\//",
          "group": "2_branch@2"
        },
        {
          "command": "git.graph.deleteTag",
          "when": "scmProvider == git && scmHistoryItemRef =~ /^refs\\/tags\\//",
          "group": "3_tag@2"
        }
      ],
      "editor/title": [
        {
          "command": "git.openFile",
          "group": "navigation",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && isInDiffEditor && resourceScheme =~ /^git$|^file$/"
        },
        {
          "command": "git.openFile",
          "group": "navigation",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && isInNotebookTextDiffEditor && resourceScheme =~ /^git$|^file$/"
        },
        {
          "command": "git.openFile",
          "group": "navigation",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && !isInDiffEditor && !isInNotebookTextDiffEditor && resourceScheme == git"
        },
        {
          "command": "git.openChange",
          "group": "navigation@2",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && !isInDiffEditor && !isMergeEditor && resourceScheme == file && scmActiveResourceHasChanges"
        },
        {
          "command": "git.stashApplyEditor",
          "alt": "git.stashPopEditor",
          "group": "navigation@1",
          "when": "config.git.enabled && !git.missing && resourceScheme == git-stash"
        },
        {
          "command": "git.stashDropEditor",
          "group": "navigation@2",
          "when": "config.git.enabled && !git.missing && resourceScheme == git-stash"
        },
        {
          "command": "git.stage",
          "group": "2_git@1",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && !isInDiffEditor && !isMergeEditor && resourceScheme == file && git.activeResourceHasUnstagedChanges"
        },
        {
          "command": "git.unstage",
          "group": "2_git@2",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && !isInDiffEditor && !isMergeEditor && resourceScheme == file && git.activeResourceHasStagedChanges"
        },
        {
          "command": "git.stage",
          "group": "2_git@1",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && isInDiffEditor && isInDiffRightEditor && !isEmbeddedDiffEditor && resourceScheme == file"
        },
        {
          "command": "git.stageSelectedRanges",
          "group": "2_git@2",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && isInDiffEditor && isInDiffRightEditor && !isEmbeddedDiffEditor && resourceScheme == file"
        },
        {
          "command": "git.unstage",
          "group": "2_git@3",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && isInDiffEditor && isInDiffRightEditor && !isEmbeddedDiffEditor && resourceScheme == git"
        },
        {
          "command": "git.unstageSelectedRanges",
          "group": "2_git@4",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && isInDiffEditor && isInDiffRightEditor && !isEmbeddedDiffEditor && resourceScheme == git"
        },
        {
          "command": "git.revertSelectedRanges",
          "group": "2_git@5",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && isInDiffEditor && isInDiffRightEditor && !isEmbeddedDiffEditor && resourceScheme == file"
        }
      ],
      "editor/context": [
        {
          "command": "git.stageSelectedRanges",
          "group": "2_git@1",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && isInDiffEditor && isInDiffRightEditor && !isEmbeddedDiffEditor && resourceScheme == file"
        },
        {
          "command": "git.unstageSelectedRanges",
          "group": "2_git@2",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && isInDiffEditor && isInDiffRightEditor && !isEmbeddedDiffEditor && resourceScheme == git"
        },
        {
          "command": "git.revertSelectedRanges",
          "group": "2_git@3",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && isInDiffEditor && isInDiffRightEditor && !isEmbeddedDiffEditor && resourceScheme == file"
        }
      ],
      "editor/content": [
        {
          "command": "git.acceptMerge",
          "when": "isMergeResultEditor && mergeEditorBaseUri =~ /^(git|file):/ && mergeEditorResultUri in git.mergeChanges"
        },
        {
          "command": "git.openMergeEditor",
          "group": "navigation@-10",
          "when": "config.git.enabled && !git.missing && !isInDiffEditor && !isMergeEditor && resource in git.mergeChanges && git.activeResourceHasMergeConflicts"
        },
        {
          "command": "git.commitMessageAccept",
          "group": "navigation",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && editorLangId == git-commit"
        },
        {
          "command": "git.commitMessageDiscard",
          "group": "secondary",
          "when": "config.git.enabled && !git.missing && gitOpenRepositoryCount != 0 && editorLangId == git-commit"
        }
      ],
      "multiDiffEditor/resource/title": [
        {
          "command": "git.stageFile",
          "group": "navigation",
          "when": "scmProvider == git && scmResourceGroup == workingTree"
        },
        {
          "command": "git.stageFile",
          "group": "navigation",
          "when": "scmProvider == git && scmResourceGroup == untracked"
        },
        {
          "command": "git.unstageFile",
          "group": "navigation",
          "when": "scmProvider == git && scmResourceGroup == index"
        }
      ],
      "diffEditor/gutter/hunk": [
        {
          "command": "git.diff.stageHunk",
          "group": "primary@10",
          "when": "diffEditorOriginalUri =~ /^git\\:.*%22ref%22%3A%22~%22%7D$/"
        }
      ],
      "diffEditor/gutter/selection": [
        {
          "command": "git.diff.stageSelection",
          "group": "primary@10",
          "when": "diffEditorOriginalUri =~ /^git\\:.*%22ref%22%3A%22~%22%7D$/"
        }
      ],
      "scm/change/title": [
        {
          "command": "git.stageChange",
          "when": "config.git.enabled && !git.missing && originalResource =~ /^git\\:.*%22ref%22%3A%22%22%7D$/"
        },
        {
          "command": "git.revertChange",
          "when": "config.git.enabled && !git.missing && originalResource =~ /^git\\:.*%22ref%22%3A%22%22%7D$/"
        },
        {
          "command": "git.unstageChange",
          "when": "false"
        }
      ],
      "timeline/item/context": [
        {
          "command": "git.timeline.viewCommit",
          "group": "inline",
          "when": "config.git.enabled && !git.missing && timelineItem =~ /git:file:commit\\b/ && !listMultiSelection"
        },
        {
          "command": "git.timeline.openDiff",
          "group": "1_actions@1",
          "when": "config.git.enabled && !git.missing && timelineItem =~ /git:file\\b/ && !listMultiSelection"
        },
        {
          "command": "git.timeline.viewCommit",
          "group": "1_actions@2",
          "when": "config.git.enabled && !git.missing && timelineItem =~ /git:file:commit\\b/ && !listMultiSelection"
        },
        {
          "command": "git.timeline.compareWithSelected",
          "group": "3_compare@1",
          "when": "config.git.enabled && !git.missing && git.timeline.selectedForCompare && timelineItem =~ /git:file\\b/ && !listMultiSelection"
        },
        {
          "command": "git.timeline.selectForCompare",
          "group": "3_compare@2",
          "when": "config.git.enabled && !git.missing && timelineItem =~ /git:file\\b/ && !listMultiSelection"
        },
        {
          "command": "git.timeline.copyCommitId",
          "group": "5_copy@1",
          "when": "config.git.enabled && !git.missing && timelineItem =~ /git:file:commit\\b/ && !listMultiSelection"
        },
        {
          "command": "git.timeline.copyCommitMessage",
          "group": "5_copy@2",
          "when": "config.git.enabled && !git.missing && timelineItem =~ /git:file:commit\\b/ && !listMultiSelection"
        }
      ],
      "git.commit": [
        {
          "command": "git.commit",
          "group": "1_commit@1"
        },
        {
          "command": "git.commitStaged",
          "group": "1_commit@2"
        },
        {
          "command": "git.commitAll",
          "group": "1_commit@3"
        },
        {
          "command": "git.undoCommit",
          "group": "1_commit@4"
        },
        {
          "command": "git.rebaseAbort",
          "group": "1_commit@5"
        },
        {
          "command": "git.commitNoVerify",
          "group": "2_commit_noverify@1",
          "when": "config.git.allowNoVerifyCommit"
        },
        {
          "command": "git.commitStagedNoVerify",
          "group": "2_commit_noverify@2",
          "when": "config.git.allowNoVerifyCommit"
        },
        {
          "command": "git.commitAllNoVerify",
          "group": "2_commit_noverify@3",
          "when": "config.git.allowNoVerifyCommit"
        },
        {
          "command": "git.commitAmend",
          "group": "3_amend@1"
        },
        {
          "command": "git.commitStagedAmend",
          "group": "3_amend@2"
        },
        {
          "command": "git.commitAllAmend",
          "group": "3_amend@3"
        },
        {
          "command": "git.commitAmendNoVerify",
          "group": "4_amend_noverify@1",
          "when": "config.git.allowNoVerifyCommit"
        },
        {
          "command": "git.commitStagedAmendNoVerify",
          "group": "4_amend_noverify@2",
          "when": "config.git.allowNoVerifyCommit"
        },
        {
          "command": "git.commitAllAmendNoVerify",
          "group": "4_amend_noverify@3",
          "when": "config.git.allowNoVerifyCommit"
        },
        {
          "command": "git.commitSigned",
          "group": "5_signoff@1"
        },
        {
          "command": "git.commitStagedSigned",
          "group": "5_signoff@2"
        },
        {
          "command": "git.commitAllSigned",
          "group": "5_signoff@3"
        },
        {
          "command": "git.commitSignedNoVerify",
          "group": "6_signoff_noverify@1",
          "when": "config.git.allowNoVerifyCommit"
        },
        {
          "command": "git.commitStagedSignedNoVerify",
          "group": "6_signoff_noverify@2",
          "when": "config.git.allowNoVerifyCommit"
        },
        {
          "command": "git.commitAllSignedNoVerify",
          "group": "6_signoff_noverify@3",
          "when": "config.git.allowNoVerifyCommit"
        }
      ],
      "git.changes": [
        {
          "command": "git.stageAll",
          "group": "changes@1"
        },
        {
          "command": "git.unstageAll",
          "group": "changes@2"
        },
        {
          "command": "git.cleanAll",
          "group": "changes@3"
        }
      ],
      "git.pullpush": [
        {
          "command": "git.sync",
          "group": "1_sync@1"
        },
        {
          "command": "git.syncRebase",
          "when": "gitState == idle",
          "group": "1_sync@2"
        },
        {
          "command": "git.pull",
          "group": "2_pull@1"
        },
        {
          "command": "git.pullRebase",
          "group": "2_pull@2"
        },
        {
          "command": "git.pullFrom",
          "group": "2_pull@3"
        },
        {
          "command": "git.push",
          "group": "3_push@1"
        },
        {
          "command": "git.pushForce",
          "when": "config.git.allowForcePush",
          "group": "3_push@2"
        },
        {
          "command": "git.pushTo",
          "group": "3_push@3"
        },
        {
          "command": "git.pushToForce",
          "when": "config.git.allowForcePush",
          "group": "3_push@4"
        },
        {
          "command": "git.fetch",
          "group": "4_fetch@1"
        },
        {
          "command": "git.fetchPrune",
          "group": "4_fetch@2"
        },
        {
          "command": "git.fetchAll",
          "group": "4_fetch@3"
        }
      ],
      "git.branch": [
        {
          "command": "git.merge",
          "group": "1_merge@1"
        },
        {
          "command": "git.rebase",
          "group": "1_merge@2"
        },
        {
          "command": "git.branch",
          "group": "2_branch@1"
        },
        {
          "command": "git.branchFrom",
          "group": "2_branch@2"
        },
        {
          "command": "git.renameBranch",
          "group": "3_modify@1"
        },
        {
          "command": "git.deleteBranch",
          "group": "3_modify@2"
        },
        {
          "command": "git.deleteRemoteBranch",
          "group": "3_modify@3"
        },
        {
          "command": "git.publish",
          "group": "4_publish@1"
        }
      ],
      "git.remotes": [
        {
          "command": "git.addRemote",
          "group": "remote@1"
        },
        {
          "command": "git.removeRemote",
          "group": "remote@2"
        }
      ],
      "git.stash": [
        {
          "command": "git.stash",
          "group": "1_stash@1"
        },
        {
          "command": "git.stashIncludeUntracked",
          "group": "1_stash@2"
        },
        {
          "command": "git.stashStaged",
          "when": "gitVersion2.35",
          "group": "1_stash@3"
        },
        {
          "command": "git.stashApplyLatest",
          "group": "2_apply@1"
        },
        {
          "command": "git.stashApply",
          "group": "2_apply@2"
        },
        {
          "command": "git.stashPopLatest",
          "group": "3_pop@1"
        },
        {
          "command": "git.stashPop",
          "group": "3_pop@2"
        },
        {
          "command": "git.stashDrop",
          "group": "4_drop@1"
        },
        {
          "command": "git.stashDropAll",
          "group": "4_drop@2"
        },
        {
          "command": "git.stashView",
          "group": "5_preview@1"
        }
      ],
      "git.repositories.stash": [
        {
          "command": "git.stash",
          "group": "1_stash@1"
        },
        {
          "command": "git.stashStaged",
          "when": "gitVersion2.35",
          "group": "2_stash@1"
        },
        {
          "command": "git.stashIncludeUntracked",
          "group": "2_stash@2"
        }
      ],
      "git.tags": [
        {
          "command": "git.createTag",
          "group": "1_tags@1"
        },
        {
          "command": "git.deleteTag",
          "group": "1_tags@2"
        },
        {
          "command": "git.deleteRemoteTag",
          "group": "1_tags@3"
        },
        {
          "command": "git.pushTags",
          "group": "2_tags@1"
        }
      ],
      "git.worktrees": [
        {
          "when": "scmProviderContext == worktree",
          "command": "git.openWorktree",
          "group": "openWorktrees@1"
        },
        {
          "when": "scmProviderContext == worktree",
          "command": "git.openWorktreeInNewWindow",
          "group": "openWorktrees@2"
        },
        {
          "when": "scmProviderContext == repository",
          "command": "git.createWorktree",
          "group": "worktrees@1"
        },
        {
          "when": "scmProviderContext == worktree",
          "command": "git.deleteWorktree2",
          "group": "worktrees@2"
        }
      ]
    },
    "submenus": [
      {
        "id": "git.commit",
        "label": "%submenu.commit%"
      },
      {
        "id": "git.changes",
        "label": "%submenu.changes%"
      },
      {
        "id": "git.pullpush",
        "label": "%submenu.pullpush%"
      },
      {
        "id": "git.branch",
        "label": "%submenu.branch%"
      },
      {
        "id": "git.remotes",
        "label": "%submenu.remotes%"
      },
      {
        "id": "git.stash",
        "label": "%submenu.stash%"
      },
      {
        "id": "git.tags",
        "label": "%submenu.tags%"
      },
      {
        "id": "git.worktrees",
        "label": "%submenu.worktrees%"
      },
      {
        "id": "git.repositories.stash",
        "label": "%submenu.stash%",
        "icon": "$(plus)"
      }
    ],
    "configuration": {
      "title": "Git",
      "properties": {
        "git.enabled": {
          "type": "boolean",
          "scope": "resource",
          "description": "%config.enabled%",
          "default": true
        },
        "git.path": {
          "type": [
            "string",
            "null",
            "array"
          ],
          "markdownDescription": "%config.path%",
          "default": null,
          "scope": "machine"
        },
        "git.autoRepositoryDetection": {
          "type": [
            "boolean",
            "string"
          ],
          "enum": [
            true,
            false,
            "subFolders",
            "openEditors"
          ],
          "enumDescriptions": [
            "%config.autoRepositoryDetection.true%",
            "%config.autoRepositoryDetection.false%",
            "%config.autoRepositoryDetection.subFolders%",
            "%config.autoRepositoryDetection.openEditors%"
          ],
          "description": "%config.autoRepositoryDetection%",
          "default": true
        },
        "git.autorefresh": {
          "type": "boolean",
          "description": "%config.autorefresh%",
          "default": true
        },
        "git.autofetch": {
          "type": [
            "boolean",
            "string"
          ],
          "enum": [
            true,
            false,
            "all"
          ],
          "scope": "resource",
          "markdownDescription": "%config.autofetch%",
          "default": false,
          "tags": [
            "usesOnlineServices"
          ]
        },
        "git.autofetchPeriod": {
          "type": "number",
          "scope": "resource",
          "markdownDescription": "%config.autofetchPeriod%",
          "default": 180
        },
        "git.defaultBranchName": {
          "type": "string",
          "markdownDescription": "%config.defaultBranchName%",
          "default": "main",
          "scope": "resource"
        },
        "git.branchPrefix": {
          "type": "string",
          "description": "%config.branchPrefix%",
          "default": "",
          "scope": "resource"
        },
        "git.branchProtection": {
          "type": "array",
          "markdownDescription": "%config.branchProtection%",
          "items": {
            "type": "string"
          },
          "default": [],
          "scope": "resource"
        },
        "git.branchProtectionPrompt": {
          "type": "string",
          "description": "%config.branchProtectionPrompt%",
          "enum": [
            "alwaysCommit",
            "alwaysCommitToNewBranch",
            "alwaysPrompt"
          ],
          "enumDescriptions": [
            "%config.branchProtectionPrompt.alwaysCommit%",
            "%config.branchProtectionPrompt.alwaysCommitToNewBranch%",
            "%config.branchProtectionPrompt.alwaysPrompt%"
          ],
          "default": "alwaysPrompt",
          "scope": "resource"
        },
        "git.branchValidationRegex": {
          "type": "string",
          "description": "%config.branchValidationRegex%",
          "default": ""
        },
        "git.branchWhitespaceChar": {
          "type": "string",
          "description": "%config.branchWhitespaceChar%",
          "default": "-"
        },
        "git.branchRandomName.enable": {
          "type": "boolean",
          "description": "%config.branchRandomNameEnable%",
          "default": false,
          "scope": "resource"
        },
        "git.branchRandomName.dictionary": {
          "type": "array",
          "markdownDescription": "%config.branchRandomNameDictionary%",
          "items": {
            "type": "string",
            "enum": [
              "adjectives",
              "animals",
              "colors",
              "numbers"
            ],
            "enumDescriptions": [
              "%config.branchRandomNameDictionary.adjectives%",
              "%config.branchRandomNameDictionary.animals%",
              "%config.branchRandomNameDictionary.colors%",
              "%config.branchRandomNameDictionary.numbers%"
            ]
          },
          "minItems": 1,
          "maxItems": 5,
          "default": [
            "adjectives",
            "animals"
          ],
          "scope": "resource"
        },
        "git.confirmSync": {
          "type": "boolean",
          "description": "%config.confirmSync%",
          "default": true
        },
        "git.countBadge": {
          "type": "string",
          "enum": [
            "all",
            "tracked",
            "off"
          ],
          "enumDescriptions": [
            "%config.countBadge.all%",
            "%config.countBadge.tracked%",
            "%config.countBadge.off%"
          ],
          "description": "%config.countBadge%",
          "default": "all",
          "scope": "resource"
        },
        "git.checkoutType": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "local",
              "tags",
              "remote"
            ],
            "enumDescriptions": [
              "%config.checkoutType.local%",
              "%config.checkoutType.tags%",
              "%config.checkoutType.remote%"
            ]
          },
          "uniqueItems": true,
          "markdownDescription": "%config.checkoutType%",
          "default": [
            "local",
            "remote",
            "tags"
          ]
        },
        "git.ignoreLegacyWarning": {
          "type": "boolean",
          "description": "%config.ignoreLegacyWarning%",
          "default": false
        },
        "git.ignoreMissingGitWarning": {
          "type": "boolean",
          "description": "%config.ignoreMissingGitWarning%",
          "default": false
        },
        "git.ignoreWindowsGit27Warning": {
          "type": "boolean",
          "description": "%config.ignoreWindowsGit27Warning%",
          "default": false
        },
        "git.ignoreLimitWarning": {
          "type": "boolean",
          "description": "%config.ignoreLimitWarning%",
          "default": false
        },
        "git.ignoreRebaseWarning": {
          "type": "boolean",
          "description": "%config.ignoreRebaseWarning%",
          "default": false
        },
        "git.defaultCloneDirectory": {
          "type": [
            "string",
            "null"
          ],
          "default": null,
          "scope": "machine",
          "description": "%config.defaultCloneDirectory%"
        },
        "git.useEditorAsCommitInput": {
          "type": "boolean",
          "description": "%config.useEditorAsCommitInput%",
          "default": true
        },
        "git.verboseCommit": {
          "type": "boolean",
          "scope": "resource",
          "markdownDescription": "%config.verboseCommit%",
          "default": false
        },
        "git.enableSmartCommit": {
          "type": "boolean",
          "scope": "resource",
          "description": "%config.enableSmartCommit%",
          "default": false
        },
        "git.smartCommitChanges": {
          "type": "string",
          "enum": [
            "all",
            "tracked"
          ],
          "enumDescriptions": [
            "%config.smartCommitChanges.all%",
            "%config.smartCommitChanges.tracked%"
          ],
          "scope": "resource",
          "description": "%config.smartCommitChanges%",
          "default": "all"
        },
        "git.suggestSmartCommit": {
          "type": "boolean",
          "scope": "resource",
          "description": "%config.suggestSmartCommit%",
          "default": true
        },
        "git.enableCommitSigning": {
          "type": "boolean",
          "scope": "resource",
          "description": "%config.enableCommitSigning%",
          "default": false
        },
        "git.confirmEmptyCommits": {
          "type": "boolean",
          "scope": "resource",
          "description": "%config.confirmEmptyCommits%",
          "default": true
        },
        "git.decorations.enabled": {
          "type": "boolean",
          "default": true,
          "description": "%config.decorations.enabled%"
        },
        "git.enableStatusBarSync": {
          "type": "boolean",
          "default": true,
          "description": "%config.enableStatusBarSync%",
          "scope": "resource"
        },
        "git.followTagsWhenSync": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.followTagsWhenSync%"
        },
        "git.replaceTagsWhenPull": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.replaceTagsWhenPull%"
        },
        "git.promptToSaveFilesBeforeStash": {
          "type": "string",
          "enum": [
            "always",
            "staged",
            "never"
          ],
          "enumDescriptions": [
            "%config.promptToSaveFilesBeforeStash.always%",
            "%config.promptToSaveFilesBeforeStash.staged%",
            "%config.promptToSaveFilesBeforeStash.never%"
          ],
          "scope": "resource",
          "default": "always",
          "description": "%config.promptToSaveFilesBeforeStash%"
        },
        "git.promptToSaveFilesBeforeCommit": {
          "type": "string",
          "enum": [
            "always",
            "staged",
            "never"
          ],
          "enumDescriptions": [
            "%config.promptToSaveFilesBeforeCommit.always%",
            "%config.promptToSaveFilesBeforeCommit.staged%",
            "%config.promptToSaveFilesBeforeCommit.never%"
          ],
          "scope": "resource",
          "default": "always",
          "description": "%config.promptToSaveFilesBeforeCommit%"
        },
        "git.postCommitCommand": {
          "type": "string",
          "enum": [
            "none",
            "push",
            "sync"
          ],
          "enumDescriptions": [
            "%config.postCommitCommand.none%",
            "%config.postCommitCommand.push%",
            "%config.postCommitCommand.sync%"
          ],
          "markdownDescription": "%config.postCommitCommand%",
          "scope": "resource",
          "default": "none"
        },
        "git.rememberPostCommitCommand": {
          "type": "boolean",
          "description": "%config.rememberPostCommitCommand%",
          "scope": "resource",
          "default": false
        },
        "git.openAfterClone": {
          "type": "string",
          "enum": [
            "always",
            "alwaysNewWindow",
            "whenNoFolderOpen",
            "prompt"
          ],
          "enumDescriptions": [
            "%config.openAfterClone.always%",
            "%config.openAfterClone.alwaysNewWindow%",
            "%config.openAfterClone.whenNoFolderOpen%",
            "%config.openAfterClone.prompt%"
          ],
          "default": "prompt",
          "description": "%config.openAfterClone%"
        },
        "git.showInlineOpenFileAction": {
          "type": "boolean",
          "default": true,
          "description": "%config.showInlineOpenFileAction%"
        },
        "git.showPushSuccessNotification": {
          "type": "boolean",
          "description": "%config.showPushSuccessNotification%",
          "default": false
        },
        "git.inputValidation": {
          "type": "boolean",
          "default": false,
          "description": "%config.inputValidation%"
        },
        "git.inputValidationLength": {
          "type": "number",
          "default": 72,
          "description": "%config.inputValidationLength%"
        },
        "git.inputValidationSubjectLength": {
          "type": [
            "number",
            "null"
          ],
          "default": 50,
          "markdownDescription": "%config.inputValidationSubjectLength%"
        },
        "git.detectSubmodules": {
          "type": "boolean",
          "scope": "resource",
          "default": true,
          "description": "%config.detectSubmodules%"
        },
        "git.detectSubmodulesLimit": {
          "type": "number",
          "scope": "resource",
          "default": 10,
          "description": "%config.detectSubmodulesLimit%"
        },
        "git.detectWorktrees": {
          "type": "boolean",
          "scope": "resource",
          "default": true,
          "description": "%config.detectWorktrees%"
        },
        "git.detectWorktreesLimit": {
          "type": "number",
          "scope": "resource",
          "default": 50,
          "description": "%config.detectWorktreesLimit%"
        },
        "git.alwaysShowStagedChangesResourceGroup": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.alwaysShowStagedChangesResourceGroup%"
        },
        "git.alwaysSignOff": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.alwaysSignOff%"
        },
        "git.ignoreSubmodules": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.ignoreSubmodules%"
        },
        "git.ignoredRepositories": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": [],
          "scope": "window",
          "description": "%config.ignoredRepositories%"
        },
        "git.scanRepositories": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": [],
          "scope": "resource",
          "description": "%config.scanRepositories%"
        },
        "git.showProgress": {
          "type": "boolean",
          "description": "%config.showProgress%",
          "default": true,
          "scope": "resource"
        },
        "git.rebaseWhenSync": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.rebaseWhenSync%"
        },
        "git.pullBeforeCheckout": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.pullBeforeCheckout%"
        },
        "git.fetchOnPull": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.fetchOnPull%"
        },
        "git.pruneOnFetch": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.pruneOnFetch%"
        },
        "git.pullTags": {
          "type": "boolean",
          "scope": "resource",
          "default": true,
          "description": "%config.pullTags%"
        },
        "git.autoStash": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.autoStash%"
        },
        "git.allowForcePush": {
          "type": "boolean",
          "default": false,
          "description": "%config.allowForcePush%"
        },
        "git.useForcePushWithLease": {
          "type": "boolean",
          "default": true,
          "description": "%config.useForcePushWithLease%"
        },
        "git.useForcePushIfIncludes": {
          "type": "boolean",
          "default": true,
          "markdownDescription": "%config.useForcePushIfIncludes%"
        },
        "git.confirmForcePush": {
          "type": "boolean",
          "default": true,
          "description": "%config.confirmForcePush%"
        },
        "git.allowNoVerifyCommit": {
          "type": "boolean",
          "default": false,
          "description": "%config.allowNoVerifyCommit%"
        },
        "git.confirmNoVerifyCommit": {
          "type": "boolean",
          "default": true,
          "description": "%config.confirmNoVerifyCommit%"
        },
        "git.closeDiffOnOperation": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.closeDiffOnOperation%"
        },
        "git.openDiffOnClick": {
          "type": "boolean",
          "scope": "resource",
          "default": true,
          "description": "%config.openDiffOnClick%"
        },
        "git.supportCancellation": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.supportCancellation%"
        },
        "git.branchSortOrder": {
          "type": "string",
          "enum": [
            "committerdate",
            "alphabetically"
          ],
          "default": "committerdate",
          "description": "%config.branchSortOrder%"
        },
        "git.untrackedChanges": {
          "type": "string",
          "enum": [
            "mixed",
            "separate",
            "hidden"
          ],
          "enumDescriptions": [
            "%config.untrackedChanges.mixed%",
            "%config.untrackedChanges.separate%",
            "%config.untrackedChanges.hidden%"
          ],
          "default": "mixed",
          "description": "%config.untrackedChanges%",
          "scope": "resource"
        },
        "git.requireGitUserConfig": {
          "type": "boolean",
          "description": "%config.requireGitUserConfig%",
          "default": true,
          "scope": "resource"
        },
        "git.showCommitInput": {
          "type": "boolean",
          "scope": "resource",
          "default": true,
          "description": "%config.showCommitInput%"
        },
        "git.terminalAuthentication": {
          "type": "boolean",
          "default": true,
          "description": "%config.terminalAuthentication%"
        },
        "git.terminalGitEditor": {
          "type": "boolean",
          "default": false,
          "description": "%config.terminalGitEditor%"
        },
        "git.useCommitInputAsStashMessage": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.useCommitInputAsStashMessage%"
        },
        "git.useIntegratedAskPass": {
          "type": "boolean",
          "default": true,
          "description": "%config.useIntegratedAskPass%"
        },
        "git.githubAuthentication": {
          "markdownDeprecationMessage": "This setting is now deprecated, please use `#github.gitAuthentication#` instead."
        },
        "git.timeline.date": {
          "type": "string",
          "enum": [
            "committed",
            "authored"
          ],
          "enumDescriptions": [
            "%config.timeline.date.committed%",
            "%config.timeline.date.authored%"
          ],
          "default": "committed",
          "description": "%config.timeline.date%",
          "scope": "window"
        },
        "git.timeline.showAuthor": {
          "type": "boolean",
          "default": true,
          "description": "%config.timeline.showAuthor%",
          "scope": "window"
        },
        "git.timeline.showUncommitted": {
          "type": "boolean",
          "default": false,
          "description": "%config.timeline.showUncommitted%",
          "scope": "window"
        },
        "git.showActionButton": {
          "type": "object",
          "additionalProperties": false,
          "description": "%config.showActionButton%",
          "properties": {
            "commit": {
              "type": "boolean",
              "description": "%config.showActionButton.commit%"
            },
            "publish": {
              "type": "boolean",
              "description": "%config.showActionButton.publish%"
            },
            "sync": {
              "type": "boolean",
              "description": "%config.showActionButton.sync%"
            }
          },
          "default": {
            "commit": true,
            "publish": true,
            "sync": true
          },
          "scope": "resource"
        },
        "git.statusLimit": {
          "type": "number",
          "scope": "resource",
          "default": 10000,
          "description": "%config.statusLimit%"
        },
        "git.repositoryScanIgnoredFolders": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": [
            "node_modules"
          ],
          "scope": "resource",
          "markdownDescription": "%config.repositoryScanIgnoredFolders%"
        },
        "git.repositoryScanMaxDepth": {
          "type": "number",
          "scope": "resource",
          "default": 1,
          "markdownDescription": "%config.repositoryScanMaxDepth%"
        },
        "git.commandsToLog": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": [],
          "markdownDescription": "%config.commandsToLog%"
        },
        "git.mergeEditor": {
          "type": "boolean",
          "default": false,
          "markdownDescription": "%config.mergeEditor%",
          "scope": "window"
        },
        "git.optimisticUpdate": {
          "type": "boolean",
          "default": true,
          "markdownDescription": "%config.optimisticUpdate%",
          "scope": "resource",
          "tags": [
            "experimental"
          ]
        },
        "git.openRepositoryInParentFolders": {
          "type": "string",
          "enum": [
            "always",
            "never",
            "prompt"
          ],
          "enumDescriptions": [
            "%config.openRepositoryInParentFolders.always%",
            "%config.openRepositoryInParentFolders.never%",
            "%config.openRepositoryInParentFolders.prompt%"
          ],
          "default": "prompt",
          "markdownDescription": "%config.openRepositoryInParentFolders%",
          "scope": "resource"
        },
        "git.similarityThreshold": {
          "type": "number",
          "default": 50,
          "minimum": 0,
          "maximum": 100,
          "markdownDescription": "%config.similarityThreshold%",
          "scope": "resource"
        },
        "git.blame.editorDecoration.enabled": {
          "type": "boolean",
          "default": false,
          "markdownDescription": "%config.blameEditorDecoration.enabled%"
        },
        "git.blame.editorDecoration.template": {
          "type": "string",
          "default": "${subject}, ${authorName} (${authorDateAgo})",
          "markdownDescription": "%config.blameEditorDecoration.template%"
        },
        "git.blame.editorDecoration.disableHover": {
          "type": "boolean",
          "default": false,
          "markdownDescription": "%config.blameEditorDecoration.disableHover%"
        },
        "git.blame.statusBarItem.enabled": {
          "type": "boolean",
          "default": true,
          "markdownDescription": "%config.blameStatusBarItem.enabled%"
        },
        "git.blame.statusBarItem.template": {
          "type": "string",
          "default": "${authorName} (${authorDateAgo})",
          "markdownDescription": "%config.blameStatusBarItem.template%"
        },
        "git.commitShortHashLength": {
          "type": "number",
          "default": 7,
          "minimum": 7,
          "maximum": 40,
          "markdownDescription": "%config.commitShortHashLength%",
          "scope": "resource"
        },
        "git.diagnosticsCommitHook.enabled": {
          "type": "boolean",
          "default": false,
          "markdownDescription": "%config.diagnosticsCommitHook.enabled%",
          "scope": "resource"
        },
        "git.diagnosticsCommitHook.sources": {
          "type": "object",
          "additionalProperties": {
            "type": "string",
            "enum": [
              "error",
              "warning",
              "information",
              "hint",
              "none"
            ]
          },
          "default": {
            "*": "error"
          },
          "markdownDescription": "%config.diagnosticsCommitHook.sources%",
          "scope": "resource"
        },
        "git.discardUntrackedChangesToTrash": {
          "type": "boolean",
          "default": true,
          "markdownDescription": "%config.discardUntrackedChangesToTrash%"
        },
        "git.showReferenceDetails": {
          "type": "boolean",
          "default": true,
          "markdownDescription": "%config.showReferenceDetails%"
        }
      }
    },
    "colors": [
      {
        "id": "gitDecoration.addedResourceForeground",
        "description": "%colors.added%",
        "defaults": {
          "light": "#587c0c",
          "dark": "#81b88b",
          "highContrast": "#a1e3ad",
          "highContrastLight": "#374e06"
        }
      },
      {
        "id": "gitDecoration.modifiedResourceForeground",
        "description": "%colors.modified%",
        "defaults": {
          "light": "#895503",
          "dark": "#E2C08D",
          "highContrast": "#E2C08D",
          "highContrastLight": "#895503"
        }
      },
      {
        "id": "gitDecoration.deletedResourceForeground",
        "description": "%colors.deleted%",
        "defaults": {
          "light": "#ad0707",
          "dark": "#c74e39",
          "highContrast": "#c74e39",
          "highContrastLight": "#ad0707"
        }
      },
      {
        "id": "gitDecoration.renamedResourceForeground",
        "description": "%colors.renamed%",
        "defaults": {
          "light": "#007100",
          "dark": "#73C991",
          "highContrast": "#73C991",
          "highContrastLight": "#007100"
        }
      },
      {
        "id": "gitDecoration.untrackedResourceForeground",
        "description": "%colors.untracked%",
        "defaults": {
          "light": "#007100",
          "dark": "#73C991",
          "highContrast": "#73C991",
          "highContrastLight": "#007100"
        }
      },
      {
        "id": "gitDecoration.ignoredResourceForeground",
        "description": "%colors.ignored%",
        "defaults": {
          "light": "#8E8E90",
          "dark": "#8C8C8C",
          "highContrast": "#A7A8A9",
          "highContrastLight": "#8e8e90"
        }
      },
      {
        "id": "gitDecoration.stageModifiedResourceForeground",
        "description": "%colors.stageModified%",
        "defaults": {
          "light": "#895503",
          "dark": "#E2C08D",
          "highContrast": "#E2C08D",
          "highContrastLight": "#895503"
        }
      },
      {
        "id": "gitDecoration.stageDeletedResourceForeground",
        "description": "%colors.stageDeleted%",
        "defaults": {
          "light": "#ad0707",
          "dark": "#c74e39",
          "highContrast": "#c74e39",
          "highContrastLight": "#ad0707"
        }
      },
      {
        "id": "gitDecoration.conflictingResourceForeground",
        "description": "%colors.conflict%",
        "defaults": {
          "light": "#ad0707",
          "dark": "#e4676b",
          "highContrast": "#c74e39",
          "highContrastLight": "#ad0707"
        }
      },
      {
        "id": "gitDecoration.submoduleResourceForeground",
        "description": "%colors.submodule%",
        "defaults": {
          "light": "#1258a7",
          "dark": "#8db9e2",
          "highContrast": "#8db9e2",
          "highContrastLight": "#1258a7"
        }
      },
      {
        "id": "git.blame.editorDecorationForeground",
        "description": "%colors.blameEditorDecoration%",
        "defaults": {
          "dark": "editorInlayHint.foreground",
          "light": "editorInlayHint.foreground",
          "highContrast": "editorInlayHint.foreground",
          "highContrastLight": "editorInlayHint.foreground"
        }
      }
    ],
    "configurationDefaults": {
      "[git-commit]": {
        "editor.rulers": [
          50,
          72
        ],
        "editor.wordWrap": "off",
        "workbench.editor.restoreViewState": false
      },
      "[git-rebase]": {
        "workbench.editor.restoreViewState": false
      }
    },
    "viewsWelcome": [
      {
        "view": "scm",
        "contents": "%view.workbench.scm.disabled%",
        "when": "!config.git.enabled"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.missing%",
        "when": "config.git.enabled && git.missing && remoteName != ''"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.missing.mac%",
        "when": "config.git.enabled && git.missing && remoteName == '' && isMac"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.missing.windows%",
        "when": "config.git.enabled && git.missing && remoteName == '' && isWindows"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.missing.linux%",
        "when": "config.git.enabled && git.missing && remoteName == '' && isLinux"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.empty%",
        "when": "config.git.enabled && !git.missing && workbenchState == empty && git.parentRepositoryCount == 0 && git.unsafeRepositoryCount == 0 && git.closedRepositoryCount == 0",
        "enablement": "git.state == initialized",
        "group": "2_open@1"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.emptyWorkspace%",
        "when": "config.git.enabled && !git.missing && workbenchState == workspace && workspaceFolderCount == 0 && git.parentRepositoryCount == 0 && git.unsafeRepositoryCount == 0 && git.closedRepositoryCount == 0",
        "enablement": "git.state == initialized",
        "group": "2_open@1"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.scanFolderForRepositories%",
        "when": "config.git.enabled && !git.missing && workbenchState == folder && workspaceFolderCount != 0 && git.state != initialized"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.scanWorkspaceForRepositories%",
        "when": "config.git.enabled && !git.missing && workbenchState == workspace && workspaceFolderCount != 0 && git.state != initialized"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.folder%",
        "when": "config.git.enabled && !git.missing && git.state == initialized && workbenchState == folder && scm.providerCount == 0 && git.parentRepositoryCount == 0 && git.unsafeRepositoryCount == 0 && git.closedRepositoryCount == 0 && remoteName != 'codespaces'",
        "group": "5_scm@1"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.workspace%",
        "when": "config.git.enabled && !git.missing && git.state == initialized && workbenchState == workspace && workspaceFolderCount != 0 && scm.providerCount == 0 && git.parentRepositoryCount == 0 && git.unsafeRepositoryCount == 0 && git.closedRepositoryCount == 0 && remoteName != 'codespaces'",
        "group": "5_scm@1"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.repositoryInParentFolders%",
        "when": "config.git.enabled && !git.missing && git.state == initialized && git.parentRepositoryCount == 1"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.repositoriesInParentFolders%",
        "when": "config.git.enabled && !git.missing && git.state == initialized && git.parentRepositoryCount > 1"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.unsafeRepository%",
        "when": "config.git.enabled && !git.missing && git.state == initialized && git.unsafeRepositoryCount == 1"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.unsafeRepositories%",
        "when": "config.git.enabled && !git.missing && git.state == initialized && git.unsafeRepositoryCount > 1"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.closedRepository%",
        "when": "config.git.enabled && !git.missing && git.state == initialized && git.closedRepositoryCount == 1"
      },
      {
        "view": "scm",
        "contents": "%view.workbench.scm.closedRepositories%",
        "when": "config.git.enabled && !git.missing && git.state == initialized && git.closedRepositoryCount > 1"
      },
      {
        "view": "explorer",
        "contents": "%view.workbench.cloneRepository%",
        "when": "config.git.enabled && git.state == initialized && scm.providerCount == 0",
        "group": "5_scm@1"
      },
      {
        "view": "explorer",
        "contents": "%view.workbench.learnMore%",
        "when": "config.git.enabled && git.state == initialized && scm.providerCount == 0",
        "group": "5_scm@10"
      }
    ]
  },
  "dependencies": {
    "@joaomoreno/unique-names-generator": "^5.2.0",
    "@vscode/extension-telemetry": "^0.9.8",
    "byline": "^5.0.0",
    "file-type": "16.5.4",
    "picomatch": "2.3.1",
    "vscode-uri": "^2.0.0",
    "which": "4.0.0"
  },
  "devDependencies": {
    "@types/byline": "4.2.31",
    "@types/mocha": "^10.0.10",
    "@types/node": "22.x",
    "@types/picomatch": "2.3.0",
    "@types/which": "3.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/package.nls.json]---
Location: vscode-main/extensions/git/package.nls.json

```json
{
	"displayName": "Git",
	"description": "Git SCM Integration",
	"command.continueInLocalClone": "Clone Repository Locally and Open on Desktop...",
	"command.continueInLocalClone.qualifiedName": "Continue Working in New Local Clone",
	"command.clone": "Clone",
	"command.cloneRecursive": "Clone (Recursive)",
	"command.init": "Initialize Repository",
	"command.openRepository": "Open Repository",
	"command.reopenClosedRepositories": "Reopen Closed Repositories...",
	"command.close": "Close Repository",
	"command.closeOtherRepositories": "Close Other Repositories",
	"command.openWorktree": "Open Worktree in Current Window",
	"command.openWorktree2": "Open",
	"command.openWorktreeInNewWindow": "Open Worktree in New Window",
	"command.openWorktreeInNewWindow2": "Open in New Window",
	"command.refresh": "Refresh",
	"command.compareWithWorkspace": "Compare with Workspace",
	"command.openChange": "Open Changes",
	"command.openAllChanges": "Open All Changes",
	"command.openFile": "Open File",
	"command.openHEADFile": "Open File (HEAD)",
	"command.stage": "Stage Changes",
	"command.stageAll": "Stage All Changes",
	"command.stageAllTracked": "Stage All Tracked Changes",
	"command.stageAllUntracked": "Stage All Untracked Changes",
	"command.stageAllMerge": "Stage All Merge Changes",
	"command.stageSelectedRanges": "Stage Selected Ranges",
	"command.revertSelectedRanges": "Revert Selected Ranges",
	"command.stageChange": "Stage Change",
	"command.stageSelection": "Stage Selection",
	"command.stageBlock": "Stage Block",
	"command.revertChange": "Revert Change",
	"command.unstage": "Unstage Changes",
	"command.unstageAll": "Unstage All Changes",
	"command.unstageChange": "Unstage Change",
	"command.unstageSelectedRanges": "Unstage Selected Ranges",
	"command.rename": "Rename",
	"command.clean": "Discard Changes",
	"command.cleanAll": "Discard All Changes",
	"command.cleanAllTracked": "Discard All Tracked Changes",
	"command.cleanAllUntracked": "Discard All Untracked Changes",
	"command.closeAllDiffEditors": "Close All Diff Editors",
	"command.closeAllUnmodifiedEditors": "Close All Unmodified Editors",
	"command.commit": "Commit",
	"command.commitAmend": "Commit (Amend)",
	"command.commitSigned": "Commit (Signed Off)",
	"command.commitStaged": "Commit Staged",
	"command.commitEmpty": "Commit Empty",
	"command.commitStagedSigned": "Commit Staged (Signed Off)",
	"command.commitStagedAmend": "Commit Staged (Amend)",
	"command.commitAll": "Commit All",
	"command.commitAllSigned": "Commit All (Signed Off)",
	"command.commitAllAmend": "Commit All (Amend)",
	"command.commitNoVerify": "Commit (No Verify)",
	"command.commitStagedNoVerify": "Commit Staged (No Verify)",
	"command.commitEmptyNoVerify": "Commit Empty (No Verify)",
	"command.commitStagedSignedNoVerify": "Commit Staged (Signed Off, No Verify)",
	"command.commitAmendNoVerify": "Commit (Amend, No Verify)",
	"command.commitSignedNoVerify": "Commit (Signed Off, No Verify)",
	"command.commitStagedAmendNoVerify": "Commit Staged (Amend, No Verify)",
	"command.commitAllNoVerify": "Commit All (No Verify)",
	"command.commitAllSignedNoVerify": "Commit All (Signed Off, No Verify)",
	"command.commitAllAmendNoVerify": "Commit All (Amend, No Verify)",
	"command.commitMessageAccept": "Commit",
	"command.commitMessageDiscard": "Cancel",
	"command.restoreCommitTemplate": "Restore Commit Template",
	"command.undoCommit": "Undo Last Commit",
	"command.checkout": "Checkout to...",
	"command.checkoutDetached": "Checkout to (Detached)...",
	"command.branch": "Create Branch...",
	"command.branchFrom": "Create Branch From...",
	"command.deleteBranch": "Delete Branch...",
	"command.deleteRemoteBranch": "Delete Remote Branch...",
	"command.renameBranch": "Rename Branch...",
	"command.cherryPick": "Cherry Pick...",
	"command.cherryPickAbort": "Abort Cherry Pick",
	"command.merge": "Merge...",
	"command.merge2": "Merge",
	"command.mergeAbort": "Abort Merge",
	"command.rebase": "Rebase Branch...",
	"command.rebase2": "Rebase",
	"command.createFrom": "Create from...",
	"command.createTag": "Create Tag...",
	"command.deleteTag": "Delete Tag...",
	"command.migrateWorktreeChanges": "Migrate Worktree Changes...",
	"command.createWorktree": "Create Worktree...",
	"command.deleteWorktree": "Delete Worktree...",
	"command.deleteWorktree2": "Delete Worktree",
	"command.deleteRemoteTag": "Delete Remote Tag...",
	"command.fetch": "Fetch",
	"command.fetchPrune": "Fetch (Prune)",
	"command.fetchAll": "Fetch From All Remotes",
	"command.pull": "Pull",
	"command.pullRebase": "Pull (Rebase)",
	"command.pullFrom": "Pull from...",
	"command.push": "Push",
	"command.pushForce": "Push (Force)",
	"command.pushTo": "Push to...",
	"command.pushToForce": "Push to... (Force)",
	"command.pushFollowTags": "Push (Follow Tags)",
	"command.pushFollowTagsForce": "Push (Follow Tags, Force)",
	"command.pushTags": "Push Tags",
	"command.addRemote": "Add Remote...",
	"command.removeRemote": "Remove Remote",
	"command.sync": "Sync",
	"command.syncRebase": "Sync (Rebase)",
	"command.publish": "Publish Branch...",
	"command.showOutput": "Show Git Output",
	"command.ignore": "Add to .gitignore",
	"command.revealInExplorer": "Reveal in Explorer View",
	"command.revealFileInOS.linux": "Open Containing Folder",
	"command.revealFileInOS.mac": "Reveal in Finder",
	"command.revealFileInOS.windows": "Reveal in File Explorer",
	"command.rebaseAbort": "Abort Rebase",
	"command.stashIncludeUntracked": "Stash (Include Untracked)",
	"command.stash": "Stash",
	"command.stashStaged": "Stash Staged",
	"command.stashPop": "Pop Stash...",
	"command.stashPopLatest": "Pop Latest Stash",
	"command.stashPopEditor": "Pop Stash",
	"command.stashApply": "Apply Stash...",
	"command.stashApplyLatest": "Apply Latest Stash",
	"command.stashApplyEditor": "Apply Stash",
	"command.stashDrop": "Drop Stash...",
	"command.stashDropAll": "Drop All Stashes...",
	"command.stashDropEditor": "Drop Stash",
	"command.stashView": "View Stash...",
	"command.stashView2": "View Stash",
	"command.timelineOpenDiff": "Open Changes",
	"command.timelineCopyCommitId": "Copy Commit ID",
	"command.timelineCopyCommitMessage": "Copy Commit Message",
	"command.timelineSelectForCompare": "Select for Compare",
	"command.timelineCompareWithSelected": "Compare with Selected",
	"command.manageUnsafeRepositories": "Manage Unsafe Repositories",
	"command.openRepositoriesInParentFolders": "Open Repositories In Parent Folders",
	"command.viewChanges": "Open Changes",
	"command.viewStagedChanges": "Open Staged Changes",
	"command.viewUntrackedChanges": "Open Untracked Changes",
	"command.viewCommit": "Open Commit",
	"command.graphCheckout": "Checkout",
	"command.graphCheckoutDetached": "Checkout (Detached)",
	"command.graphCherryPick": "Cherry Pick",
	"command.graphDeleteBranch": "Delete Branch",
	"command.graphDeleteTag": "Delete Tag",
	"command.graphCompareRef": "Compare with...",
	"command.graphCompareWithMergeBase": "Compare with Merge Base",
	"command.graphCompareWithRemote": "Compare with Remote",
	"command.deleteRef": "Delete",
	"command.blameToggleEditorDecoration": "Toggle Git Blame Editor Decoration",
	"command.blameToggleStatusBarItem": "Toggle Git Blame Status Bar Item",
	"command.api.getRepositories": "Get Repositories",
	"command.api.getRepositoryState": "Get Repository State",
	"command.api.getRemoteSources": "Get Remote Sources",
	"command.git.acceptMerge": "Complete Merge",
	"command.git.openMergeEditor": "Resolve in Merge Editor",
	"command.git.runGitMerge": "Compute Conflicts With Git",
	"command.git.runGitMergeDiff3": "Compute Conflicts With Git (Diff3)",
	"config.enabled": "Whether Git is enabled.",
	"config.path": "Path and filename of the git executable, e.g. `C:\\Program Files\\Git\\bin\\git.exe` (Windows). This can also be an array of string values containing multiple paths to look up.",
	"config.autoRepositoryDetection": "Configures when repositories should be automatically detected.",
	"config.autoRepositoryDetection.true": "Scan for both subfolders of the current opened folder and parent folders of open files.",
	"config.autoRepositoryDetection.false": "Disable automatic repository scanning.",
	"config.autoRepositoryDetection.subFolders": "Scan for subfolders of the currently opened folder.",
	"config.autoRepositoryDetection.openEditors": "Scan for parent folders of open files.",
	"config.autorefresh": "Whether auto refreshing is enabled.",
	"config.autofetch": "When set to true, commits will automatically be fetched from the default remote of the current Git repository. Setting to `all` will fetch from all remotes.",
	"config.autofetchPeriod": "Duration in seconds between each automatic git fetch, when `#git.autofetch#` is enabled.",
	"config.confirmSync": "Confirm before synchronizing Git repositories.",
	"config.countBadge": "Controls the Git count badge.",
	"config.countBadge.all": "Count all changes.",
	"config.countBadge.tracked": "Count only tracked changes.",
	"config.countBadge.off": "Turn off counter.",
	"config.checkoutType": "Controls what type of Git refs are listed when running `Checkout to...`.",
	"config.checkoutType.local": "Local branches",
	"config.checkoutType.tags": "Tags",
	"config.checkoutType.remote": "Remote branches",
	"config.defaultBranchName": "The name of the default branch (example: main, trunk, development) when initializing a new Git repository. When set to empty, the default branch name configured in Git will be used. **Note:** Requires Git version `2.28.0` or later.",
	"config.branchPrefix": "Prefix used when creating a new branch.",
	"config.branchProtection": "List of protected branches. By default, a prompt is shown before changes are committed to a protected branch. The prompt can be controlled using the `#git.branchProtectionPrompt#`  setting.",
	"config.branchProtectionPrompt": "Controls whether a prompt is being shown before changes are committed to a protected branch.",
	"config.branchProtectionPrompt.alwaysCommit": "Always commit changes to the protected branch.",
	"config.branchProtectionPrompt.alwaysCommitToNewBranch": "Always commit changes to a new branch.",
	"config.branchProtectionPrompt.alwaysPrompt": "Always prompt before changes are committed to a protected branch.",
	"config.branchRandomNameDictionary": "List of dictionaries used for the randomly generated branch name. Each value represents the dictionary used to generate the segment of the branch name. Supported dictionaries: `adjectives`, `animals`, `colors` and `numbers`.",
	"config.branchRandomNameDictionary.adjectives": "A random adjective",
	"config.branchRandomNameDictionary.animals": "A random animal name",
	"config.branchRandomNameDictionary.colors": "A random color name",
	"config.branchRandomNameDictionary.numbers": "A random number between 100 and 999",
	"config.branchRandomNameEnable": "Controls whether a random name is generated when creating a new branch.",
	"config.branchValidationRegex": "A regular expression to validate new branch names.",
	"config.branchWhitespaceChar": "The character to replace whitespace in new branch names, and to separate segments of a randomly generated branch name.",
	"config.ignoreLegacyWarning": "Ignores the legacy Git warning.",
	"config.ignoreMissingGitWarning": "Ignores the warning when Git is missing.",
	"config.ignoreWindowsGit27Warning": "Ignores the warning when Git 2.25 - 2.26 is installed on Windows.",
	"config.ignoreLimitWarning": "Ignores the warning when there are too many changes in a repository.",
	"config.ignoreRebaseWarning": "Ignores the warning when it looks like the branch might have been rebased when pulling.",
	"config.defaultCloneDirectory": "The default location to clone a Git repository.",
	"config.useEditorAsCommitInput": "Controls whether a full text editor will be used to author commit messages, whenever no message is provided in the commit input box.",
	"config.verboseCommit": "Enable verbose output when `#git.useEditorAsCommitInput#` is enabled.",
	"config.enableSmartCommit": "Commit all changes when there are no staged changes.",
	"config.smartCommitChanges": "Control which changes are automatically staged by Smart Commit.",
	"config.smartCommitChanges.all": "Automatically stage all changes.",
	"config.smartCommitChanges.tracked": "Automatically stage tracked changes only.",
	"config.suggestSmartCommit": "Suggests to enable smart commit (commit all changes when there are no staged changes).",
	"config.enableCommitSigning": "Enables commit signing with GPG, X.509, or SSH.",
	"config.discardAllScope": "Controls what changes are discarded by the `Discard all changes` command. `all` discards all changes. `tracked` discards only tracked files. `prompt` shows a prompt dialog every time the action is run.",
	"config.decorations.enabled": "Controls whether Git contributes colors and badges to the Explorer and the Open Editors view.",
	"config.enableStatusBarSync": "Controls whether the Git Sync command appears in the status bar.",
	"config.followTagsWhenSync": "Push all annotated tags when running the sync command.",
	"config.replaceTagsWhenPull": "Automatically replace the local tags with the remote tags in case of a conflict when running the pull command.",
	"config.promptToSaveFilesBeforeStash": "Controls whether Git should check for unsaved files before stashing changes.",
	"config.promptToSaveFilesBeforeStash.always": "Check for any unsaved files.",
	"config.promptToSaveFilesBeforeStash.staged": "Check only for unsaved staged files.",
	"config.promptToSaveFilesBeforeStash.never": "Disable this check.",
	"config.promptToSaveFilesBeforeCommit": "Controls whether Git should check for unsaved files before committing.",
	"config.promptToSaveFilesBeforeCommit.always": "Check for any unsaved files.",
	"config.promptToSaveFilesBeforeCommit.staged": "Check only for unsaved staged files.",
	"config.promptToSaveFilesBeforeCommit.never": "Disable this check.",
	"config.postCommitCommand": "Run a git command after a successful commit.",
	"config.postCommitCommand.none": "Don't run any command after a commit.",
	"config.postCommitCommand.push": "Run 'git push' after a successful commit.",
	"config.postCommitCommand.sync": "Run 'git pull' and 'git push' after a successful commit.",
	"config.rememberPostCommitCommand": "Remember the last git command that ran after a commit.",
	"config.openAfterClone": "Controls whether to open a repository automatically after cloning.",
	"config.openAfterClone.always": "Always open in current window.",
	"config.openAfterClone.alwaysNewWindow": "Always open in a new window.",
	"config.openAfterClone.whenNoFolderOpen": "Only open in current window when no folder is opened.",
	"config.openAfterClone.prompt": "Always prompt for action.",
	"config.showInlineOpenFileAction": "Controls whether to show an inline Open File action in the Git changes view.",
	"config.showPushSuccessNotification": "Controls whether to show a notification when a push is successful.",
	"config.inputValidation": "Controls whether to show commit message input validation diagnostics.",
	"config.inputValidationLength": "Controls the commit message length threshold for showing a warning.",
	"config.inputValidationSubjectLength": "Controls the commit message subject length threshold for showing a warning. Unset it to inherit the value of `#git.inputValidationLength#`.",
	"config.detectSubmodules": "Controls whether to automatically detect Git submodules.",
	"config.detectSubmodulesLimit": "Controls the limit of Git submodules detected.",
	"config.detectWorktrees": "Controls whether to automatically detect Git worktrees.",
	"config.detectWorktreesLimit": "Controls the limit of Git worktrees detected.",
	"config.alwaysShowStagedChangesResourceGroup": "Always show the Staged Changes resource group.",
	"config.alwaysSignOff": "Controls the signoff flag for all commits.",
	"config.ignoreSubmodules": "Ignore modifications to submodules in the file tree.",
	"config.ignoredRepositories": "List of Git repositories to ignore.",
	"config.scanRepositories": "List of paths to search for Git repositories in.",
	"config.commandsToLog": {
		"message": "List of git commands (ex: commit, push) that would have their `stdout` logged to the [git output](command:git.showOutput). If the git command has a client-side hook configured, the client-side hook's `stdout` will also be logged to the [git output](command:git.showOutput).",
		"comment": [
			"{Locked='](command:git.showOutput'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"config.showProgress": "Controls whether Git actions should show progress.",
	"config.rebaseWhenSync": "Force Git to use rebase when running the sync command.",
	"config.confirmEmptyCommits": "Always confirm the creation of empty commits for the 'Git: Commit Empty' command.",
	"config.fetchOnPull": "When enabled, fetch all branches when pulling. Otherwise, fetch just the current one.",
	"config.pullBeforeCheckout": "Controls whether a branch that does not have outgoing commits is fast-forwarded before it is checked out.",
	"config.pullTags": "Fetch all tags when pulling.",
	"config.pruneOnFetch": "Prune when fetching.",
	"config.autoStash": "Stash any changes before pulling and restore them after successful pull.",
	"config.allowForcePush": "Controls whether force push (with or without lease) is enabled.",
	"config.useForcePushWithLease": "Controls whether force pushing uses the safer force-with-lease variant.",
	"config.useForcePushIfIncludes": "Controls whether force pushing uses the safer force-if-includes variant. Note: This setting requires the `#git.useForcePushWithLease#` setting to be enabled, and Git version `2.30.0` or later.",
	"config.confirmForcePush": "Controls whether to ask for confirmation before force-pushing.",
	"config.allowNoVerifyCommit": "Controls whether commits without running pre-commit and commit-msg hooks are allowed.",
	"config.confirmNoVerifyCommit": "Controls whether to ask for confirmation before committing without verification.",
	"config.closeDiffOnOperation": "Controls whether the diff editor should be automatically closed when changes are stashed, committed, discarded, staged, or unstaged.",
	"config.openDiffOnClick": "Controls whether the diff editor should be opened when clicking a change. Otherwise the regular editor will be opened.",
	"config.supportCancellation": "Controls whether a notification comes up when running the Sync action, which allows the user to cancel the operation.",
	"config.branchSortOrder": "Controls the sort order for branches.",
	"config.untrackedChanges": "Controls how untracked changes behave.",
	"config.untrackedChanges.mixed": "All changes, tracked and untracked, appear together and behave equally.",
	"config.untrackedChanges.separate": "Untracked changes appear separately in the Source Control view. They are also excluded from several actions.",
	"config.untrackedChanges.hidden": "Untracked changes are hidden and excluded from several actions.",
	"config.requireGitUserConfig": "Controls whether to require explicit Git user configuration or allow Git to guess if missing.",
	"config.showCommitInput": "Controls whether to show the commit input in the Git source control panel.",
	"config.terminalAuthentication": "Controls whether to enable VS Code to be the authentication handler for Git processes spawned in the Integrated Terminal. Note: Terminals need to be restarted to pick up a change in this setting.",
	"config.terminalGitEditor": "Controls whether to enable VS Code to be the Git editor for Git processes spawned in the integrated terminal. Note: Terminals need to be restarted to pick up a change in this setting.",
	"config.timeline.showAuthor": "Controls whether to show the commit author in the Timeline view.",
	"config.timeline.showUncommitted": "Controls whether to show uncommitted changes in the Timeline view.",
	"config.timeline.date": "Controls which date to use for items in the Timeline view.",
	"config.timeline.date.committed": "Use the committed date",
	"config.timeline.date.authored": "Use the authored date",
	"config.useCommitInputAsStashMessage": "Controls whether to use the message from the commit input box as the default stash message.",
	"config.showActionButton": "Controls whether an action button is shown in the Source Control view.",
	"config.showActionButton.commit": "Show an action button to commit changes when the local branch has modified files ready to be committed.",
	"config.showActionButton.publish": "Show an action button to publish the local branch when it does not have a tracking remote branch.",
	"config.showActionButton.sync": "Show an action button to synchronize changes when the local branch is either ahead or behind the remote branch.",
	"config.statusLimit": "Controls how to limit the number of changes that can be parsed from Git status command. Can be set to 0 for no limit.",
	"config.experimental.installGuide": "Experimental improvements for the Git setup flow.",
	"config.repositoryScanIgnoredFolders": "List of folders that are ignored while scanning for Git repositories when `#git.autoRepositoryDetection#` is set to `true` or `subFolders`.",
	"config.repositoryScanMaxDepth": "Controls the depth used when scanning workspace folders for Git repositories when `#git.autoRepositoryDetection#` is set to `true` or `subFolders`. Can be set to `-1` for no limit.",
	"config.useIntegratedAskPass": "Controls whether GIT_ASKPASS should be overwritten to use the integrated version.",
	"config.mergeEditor": "Open the merge editor for files that are currently under conflict.",
	"config.optimisticUpdate": "Controls whether to optimistically update the state of the Source Control view after running git commands.",
	"config.openRepositoryInParentFolders": "Control whether a repository in parent folders of workspaces or open files should be opened.",
	"config.openRepositoryInParentFolders.always": "Always open a repository in parent folders of workspaces or open files.",
	"config.openRepositoryInParentFolders.never": "Never open a repository in parent folders of workspaces or open files.",
	"config.openRepositoryInParentFolders.prompt": "Prompt before opening a repository the parent folders of workspaces or open files.",
	"config.publishBeforeContinueOn": "Controls whether to publish unpublished Git state when using Continue Working On from a Git repository.",
	"config.publishBeforeContinueOn.always": "Always publish unpublished Git state when using Continue Working On from a Git repository",
	"config.publishBeforeContinueOn.never": "Never publish unpublished Git state when using Continue Working On from a Git repository",
	"config.publishBeforeContinueOn.prompt": "Prompt to publish unpublished Git state when using Continue Working On from a Git repository",
	"config.similarityThreshold": "Controls the threshold of the similarity index (the amount of additions/deletions compared to the file's size) for changes in a pair of added/deleted files to be considered a rename. **Note:** Requires Git version `2.18.0` or later.",
	"config.blameEditorDecoration.enabled": "Controls whether to show blame information in the editor using editor decorations.",
	"config.blameEditorDecoration.template": "Template for the blame information editor decoration. Supported variables:\n\n* `hash`: Commit hash\n\n* `hashShort`: First N characters of the commit hash according to `#git.commitShortHashLength#`\n\n* `subject`: First line of the commit message\n\n* `authorName`: Author name\n\n* `authorEmail`: Author email\n\n* `authorDate`: Author date\n\n* `authorDateAgo`: Time difference between now and the author date\n\n",
	"config.blameEditorDecoration.disableHover": "Controls whether to disable the blame information editor decoration hover.",
	"config.blameStatusBarItem.enabled": "Controls whether to show blame information in the status bar.",
	"config.blameStatusBarItem.template": "Template for the blame information status bar item. Supported variables:\n\n* `hash`: Commit hash\n\n* `hashShort`: First N characters of the commit hash according to `#git.commitShortHashLength#`\n\n* `subject`: First line of the commit message\n\n* `authorName`: Author name\n\n* `authorEmail`: Author email\n\n* `authorDate`: Author date\n\n* `authorDateAgo`: Time difference between now and the author date\n\n",
	"config.commitShortHashLength": "Controls the length of the commit short hash.",
	"config.diagnosticsCommitHook.enabled": "Controls whether to check for unresolved diagnostics before committing.",
	"config.diagnosticsCommitHook.sources": "Controls the list of sources (**Item**) and the minimum severity (**Value**) to be considered before committing. **Note:** To ignore diagnostics from a particular source, add the source to the list and set the minimum severity to `none`.",
	"config.discardUntrackedChangesToTrash": "Controls whether discarding untracked changes moves the file(s) to the Recycle Bin (Windows), Trash (macOS, Linux) instead of deleting them permanently. **Note:** This setting has no effect when connected to a remote or when running in Linux as a snap package.",
	"config.showReferenceDetails": "Controls whether to show the details of the last commit for Git refs in the checkout, branch, and tag pickers.",
	"submenu.explorer": "Git",
	"submenu.commit": "Commit",
	"submenu.commit.amend": "Amend",
	"submenu.commit.signoff": "Sign Off",
	"submenu.changes": "Changes",
	"submenu.pullpush": "Pull, Push",
	"submenu.branch": "Branch",
	"submenu.remotes": "Remote",
	"submenu.stash": "Stash",
	"submenu.tags": "Tags",
	"submenu.worktrees": "Worktrees",
	"colors.added": "Color for added resources.",
	"colors.modified": "Color for modified resources.",
	"colors.stageModified": "Color for modified resources which have been staged.",
	"colors.stageDeleted": "Color for deleted resources which have been staged.",
	"colors.deleted": "Color for deleted resources.",
	"colors.renamed": "Color for renamed or copied resources.",
	"colors.untracked": "Color for untracked resources.",
	"colors.ignored": "Color for ignored resources.",
	"colors.conflict": "Color for resources with conflicts.",
	"colors.submodule": "Color for submodule resources.",
	"colors.incomingAdded": "Color for added incoming resource.",
	"colors.incomingDeleted": "Color for deleted incoming resource.",
	"colors.incomingRenamed": "Color for renamed incoming resource.",
	"colors.incomingModified": "Color for modified incoming resource.",
	"colors.blameEditorDecoration": "Color for the blame editor decoration.",
	"view.workbench.scm.missing.windows": {
		"message": "[Download Git for Windows](https://git-scm.com/download/win)\nAfter installing, please [reload](command:workbench.action.reloadWindow) (or [troubleshoot](command:git.showOutput)). Additional source control providers can be installed [from the Marketplace](command:workbench.extensions.search?%22%40category%3A%5C%22scm%20providers%5C%22%22).",
		"comment": [
			"{Locked='](command:workbench.action.reloadWindow'}",
			"{Locked='](command:git.showOutput'}",
			"{Locked='](command:workbench.extensions.search?%22%40category%3A%5C%22scm%20providers%5C%22%22'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.missing.mac": {
		"message": "[Download Git for macOS](https://git-scm.com/download/mac)\nAfter installing, please [reload](command:workbench.action.reloadWindow) (or [troubleshoot](command:git.showOutput)). Additional source control providers can be installed [from the Marketplace](command:workbench.extensions.search?%22%40category%3A%5C%22scm%20providers%5C%22%22).",
		"comment": [
			"{Locked='](command:workbench.action.reloadWindow'}",
			"{Locked='](command:git.showOutput'}",
			"{Locked='](command:workbench.extensions.search?%22%40category%3A%5C%22scm%20providers%5C%22%22'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.missing.linux": {
		"message": "Source control depends on Git being installed.\n[Download Git for Linux](https://git-scm.com/download/linux)\nAfter installing, please [reload](command:workbench.action.reloadWindow) (or [troubleshoot](command:git.showOutput)). Additional source control providers can be installed [from the Marketplace](command:workbench.extensions.search?%22%40category%3A%5C%22scm%20providers%5C%22%22).",
		"comment": [
			"{Locked='](command:workbench.action.reloadWindow'}",
			"{Locked='](command:git.showOutput'}",
			"{Locked='](command:workbench.extensions.search?%22%40category%3A%5C%22scm%20providers%5C%22%22'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.missing": {
		"message": "Install Git, a popular source control system, to track code changes and collaborate with others. Learn more in our [Git guides](https://aka.ms/vscode-scm).",
		"comment": [
			"{Locked='](https://aka.ms/vscode-scm'}",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.disabled": {
		"message": "If you would like to use Git features, please enable Git in your [settings](command:workbench.action.openSettings?%5B%22git.enabled%22%5D).\nTo learn more about how to use Git and source control in VS Code [read our docs](https://aka.ms/vscode-scm).",
		"comment": [
			"{Locked='](command:workbench.action.openSettings?%5B%22git.enabled%22%5D'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.empty": {
		"message": "In order to use Git features, you can open a folder containing a Git repository or clone from a URL.\n[Open Folder](command:vscode.openFolder)\n[Clone Repository](command:git.cloneRecursive)\nTo learn more about how to use Git and source control in VS Code [read our docs](https://aka.ms/vscode-scm).",
		"comment": [
			"{Locked='](command:vscode.openFolder'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.folder": {
		"message": "The folder currently open doesn't have a Git repository. You can initialize a repository which will enable source control features powered by Git.\n[Initialize Repository](command:git.init?%5Btrue%5D)\nTo learn more about how to use Git and source control in VS Code [read our docs](https://aka.ms/vscode-scm).",
		"comment": [
			"{Locked='](command:git.init?%5Btrue%5D'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.workspace": {
		"message": "The workspace currently open doesn't have any folders containing Git repositories. You can initialize a repository on a folder which will enable source control features powered by Git.\n[Initialize Repository](command:git.init)\nTo learn more about how to use Git and source control in VS Code [read our docs](https://aka.ms/vscode-scm).",
		"comment": [
			"{Locked='](command:git.init'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.emptyWorkspace": {
		"message": "The workspace currently open doesn't have any folders containing Git repositories.\n[Add Folder to Workspace](command:workbench.action.addRootFolder)\nTo learn more about how to use Git and source control in VS Code [read our docs](https://aka.ms/vscode-scm).",
		"comment": [
			"{Locked='](command:workbench.action.addRootFolder'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.scanFolderForRepositories": {
		"message": "Scanning folder for Git repositories..."
	},
	"view.workbench.scm.scanWorkspaceForRepositories": {
		"message": "Scanning workspace for Git repositories..."
	},
	"view.workbench.scm.repositoryInParentFolders": {
		"message": "A Git repository was found in the parent folders of the workspace or the open file(s).\n[Open Repository](command:git.openRepositoriesInParentFolders)\nUse the [git.openRepositoryInParentFolders](command:workbench.action.openSettings?%5B%22git.openRepositoryInParentFolders%22%5D) setting to control whether Git repositories in parent folders of workspaces or open files are opened. To learn more [read our docs](https://aka.ms/vscode-git-repository-in-parent-folders).",
		"comment": [
			"{Locked='](command:git.openRepositoriesInParentFolders'}",
			"{Locked='](command:workbench.action.openSettings?%5B%22git.openRepositoryInParentFolders%22%5D'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.repositoriesInParentFolders": {
		"message": "Git repositories were found in the parent folders of the workspace or the open file(s).\n[Open Repository](command:git.openRepositoriesInParentFolders)\nUse the [git.openRepositoryInParentFolders](command:workbench.action.openSettings?%5B%22git.openRepositoryInParentFolders%22%5D) setting to control whether Git repositories in parent folders of workspace or open files are opened. To learn more [read our docs](https://aka.ms/vscode-git-repository-in-parent-folders).",
		"comment": [
			"{Locked='](command:git.openRepositoriesInParentFolders'}",
			"{Locked='](command:workbench.action.openSettings?%5B%22git.openRepositoryInParentFolders%22%5D'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.unsafeRepository": {
		"message": "The detected Git repository is potentially unsafe as the folder is owned by someone other than the current user.\n[Manage Unsafe Repositories](command:git.manageUnsafeRepositories)\nTo learn more about unsafe repositories [read our docs](https://aka.ms/vscode-git-unsafe-repository).",
		"comment": [
			"{Locked='](command:git.manageUnsafeRepositories'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.unsafeRepositories": {
		"message": "The detected Git repositories are potentially unsafe as the folders are owned by someone other than the current user.\n[Manage Unsafe Repositories](command:git.manageUnsafeRepositories)\nTo learn more about unsafe repositories [read our docs](https://aka.ms/vscode-git-unsafe-repository).",
		"comment": [
			"{Locked='](command:git.manageUnsafeRepositories'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.closedRepository": {
		"message": "A Git repository was found that was previously closed.\n[Reopen Closed Repository](command:git.reopenClosedRepositories)\nTo learn more about how to use Git and source control in VS Code [read our docs](https://aka.ms/vscode-scm).",
		"comment": [
			"{Locked='](command:git.reopenClosedRepositories'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.scm.closedRepositories": {
		"message": "Git repositories were found that were previously closed.\n[Reopen Closed Repositories](command:git.reopenClosedRepositories)\nTo learn more about how to use Git and source control in VS Code [read our docs](https://aka.ms/vscode-scm).",
		"comment": [
			"{Locked='](command:git.reopenClosedRepositories'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.cloneRepository": {
		"message": "You can clone a repository locally.\n[Clone Repository](command:git.clone 'Clone a repository once the Git extension has activated')",
		"comment": [
			"{Locked='](command:git.clone'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"view.workbench.learnMore": "To learn more about how to use Git and source control in VS Code [read our docs](https://aka.ms/vscode-scm)."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/README.md]---
Location: vscode-main/extensions/git/README.md

```markdown
# Git integration for Visual Studio Code

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

See [Git support in VS Code](https://code.visualstudio.com/docs/editor/versioncontrol#_git-support) to learn about the features of this extension.

## API

The Git extension exposes an API, reachable by any other extension.

1. Copy `src/api/git.d.ts` to your extension's sources;
2. Include `git.d.ts` in your extension's compilation.
3. Get a hold of the API with the following snippet:

	```ts
	const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git').exports;
	const git = gitExtension.getAPI(1);
	```
	**Note:** To ensure that the `vscode.git` extension is activated before your extension, add `extensionDependencies` ([docs](https://code.visualstudio.com/api/references/extension-manifest)) into the `package.json` of your extension:
	```json
	"extensionDependencies": [
		"vscode.git"
	]
	```
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/tsconfig.json]---
Location: vscode-main/extensions/git/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"typeRoots": [
			"./node_modules/@types"
		],
		"skipLibCheck": true
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts",
		"../../src/vscode-dts/vscode.proposed.canonicalUriProvider.d.ts",
		"../../src/vscode-dts/vscode.proposed.editSessionIdentityProvider.d.ts",
		"../../src/vscode-dts/vscode.proposed.quickDiffProvider.d.ts",
		"../../src/vscode-dts/vscode.proposed.quickInputButtonLocation.d.ts",
		"../../src/vscode-dts/vscode.proposed.quickPickSortByLabel.d.ts",
		"../../src/vscode-dts/vscode.proposed.scmActionButton.d.ts",
		"../../src/vscode-dts/vscode.proposed.scmArtifactProvider.d.ts",
		"../../src/vscode-dts/vscode.proposed.scmHistoryProvider.d.ts",
		"../../src/vscode-dts/vscode.proposed.scmProviderOptions.d.ts",
		"../../src/vscode-dts/vscode.proposed.scmSelectedProvider.d.ts",
		"../../src/vscode-dts/vscode.proposed.scmValidation.d.ts",
		"../../src/vscode-dts/vscode.proposed.scmMultiDiffEditor.d.ts",
		"../../src/vscode-dts/vscode.proposed.scmTextDocument.d.ts",
		"../../src/vscode-dts/vscode.proposed.statusBarItemTooltip.d.ts",
		"../../src/vscode-dts/vscode.proposed.tabInputMultiDiff.d.ts",
		"../../src/vscode-dts/vscode.proposed.tabInputTextMerge.d.ts",
		"../../src/vscode-dts/vscode.proposed.textEditorDiffInformation.d.ts",
		"../../src/vscode-dts/vscode.proposed.timeline.d.ts",
		"../types/lib.textEncoder.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/build/update-emoji.js]---
Location: vscode-main/extensions/git/build/update-emoji.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const https = require('https');
const path = require('path');

async function generate() {
	/**
	 * @type {Map<string, string>}
	 */
	const shortcodeMap = new Map();

	// Get emoji data from https://github.com/milesj/emojibase
	// https://github.com/milesj/emojibase/

	const files = ['github.raw.json'] //, 'emojibase.raw.json']; //, 'iamcal.raw.json', 'joypixels.raw.json'];

	for (const file of files) {
		await download(
			`https://raw.githubusercontent.com/milesj/emojibase/master/packages/data/en/shortcodes/${file}`,
			file,
		);

		/**
		 * @type {Record<string, string | string[]>}}
		 */
		// eslint-disable-next-line import/no-dynamic-require
		const data = require(path.join(process.cwd(), file));
		for (const [emojis, codes] of Object.entries(data)) {
			const emoji = emojis
				.split('-')
				.map(c => String.fromCodePoint(parseInt(c, 16)))
				.join('');
			for (const code of Array.isArray(codes) ? codes : [codes]) {
				if (shortcodeMap.has(code)) {
					// console.warn(`${file}: ${code}`);
					continue;
				}
				shortcodeMap.set(code, emoji);
			}
		}

		fs.unlink(file, () => { });
	}

	// Get gitmoji data from https://github.com/carloscuesta/gitmoji
	// https://github.com/carloscuesta/gitmoji/blob/master/src/data/gitmojis.json
	await download(
		'https://raw.githubusercontent.com/carloscuesta/gitmoji/master/src/data/gitmojis.json',
		'gitmojis.json',
	);

	/**
	 * @type {({ code: string; emoji: string })[]}
	 */
	// eslint-disable-next-line import/no-dynamic-require
	const gitmojis = require(path.join(process.cwd(), 'gitmojis.json')).gitmojis;
	for (const emoji of gitmojis) {
		if (emoji.code.startsWith(':') && emoji.code.endsWith(':')) {
			emoji.code = emoji.code.substring(1, emoji.code.length - 2);
		}

		if (shortcodeMap.has(emoji.code)) {
			// console.warn(`GitHub: ${emoji.code}`);
			continue;
		}
		shortcodeMap.set(emoji.code, emoji.emoji);
	}

	fs.unlink('gitmojis.json', () => { });

	// Sort the emojis for easier diff checking
	const list = [...shortcodeMap.entries()];
	list.sort();

	const map = list.reduce((m, [key, value]) => {
		m[key] = value;
		return m;
	}, Object.create(null));

	fs.writeFileSync(path.join(process.cwd(), 'resources/emojis.json'), JSON.stringify(map), 'utf8');
}

function download(url, destination) {
	return new Promise(resolve => {
		const stream = fs.createWriteStream(destination);
		https.get(url, rsp => {
			rsp.pipe(stream);
			stream.on('finish', () => {
				stream.close();
				resolve();
			});
		});
	});
}

void generate();
```

--------------------------------------------------------------------------------

````
