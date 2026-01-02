---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 504
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 504 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: CreateExperimentModal.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/CreateExperimentModal.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, jest, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import { shallow } from 'enzyme';
import { CreateExperimentModalImpl } from './CreateExperimentModal';
import { GenericInputModal } from './GenericInputModal';
import { createMLflowRoutePath } from '../../../common/utils/RoutingUtils';

describe('CreateExperimentModal', () => {
  let wrapper: any;
  let instance;
  let minimalProps: any;

  const navigate = jest.fn();

  const fakeExperimentId = 'fakeExpId';
  beforeEach(() => {
    navigate.mockClear();
    minimalProps = {
      isOpen: false,
      onClose: jest.fn(),
      experimentNames: [],
      createExperimentApi: (experimentName: any, artifactLocation: any) => {
        const response = { value: { experiment_id: fakeExperimentId } };
        return Promise.resolve(response);
      },
      searchExperimentsApi: () => Promise.resolve([]),
      onExperimentCreated: jest.fn(),
      navigate,
    };
    wrapper = shallow(<CreateExperimentModalImpl {...minimalProps} />);
  });
  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<CreateExperimentModalImpl {...minimalProps} />);
    expect(wrapper.find(GenericInputModal).length).toBe(1);
    expect(wrapper.length).toBe(1);
  });
  test('handleCreateExperiment redirects user to newly-created experiment page', async () => {
    instance = wrapper.instance();
    await instance.handleCreateExperiment({
      experimentName: 'myNewExp',
      artifactLocation: 'artifactLoc',
    });

    expect(navigate).toHaveBeenCalledWith(createMLflowRoutePath('/experiments/fakeExpId'));
  });
  test('handleCreateExperiment does not perform redirection if API requests fail', async () => {
    const propsVals = [
      {
        ...minimalProps,
        createExperimentApi: () => Promise.reject(new Error('CreateExperiment failed!')),
      },
    ];
    const testPromises: any = [];
    propsVals.forEach(async (props) => {
      wrapper = shallow(<CreateExperimentModalImpl {...props} />);
      instance = wrapper.instance();
      const payload = { experimentName: 'myNewExp', artifactLocation: 'artifactLoc' };
      testPromises.push(await expect(instance.handleCreateExperiment(payload)).rejects.toThrow());
    });
    await Promise.all(testPromises);

    expect(navigate).not.toHaveBeenCalled();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CreateExperimentModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/CreateExperimentModal.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { NavigateFunction } from '../../../common/utils/RoutingUtils';
import debounce from 'lodash/debounce';

import Routes from '../../routes';
import { GenericInputModal } from './GenericInputModal';
import { CreateExperimentForm, EXP_NAME_FIELD, ARTIFACT_LOCATION } from './CreateExperimentForm';
import { getExperimentNameValidator } from '../../../common/forms/validations';

import { createExperimentApi } from '../../actions';
import { getExperiments } from '../../reducers/Reducers';
import { withRouterNext } from '../../../common/utils/withRouterNext';

type CreateExperimentModalImplProps = {
  isOpen?: boolean;
  onClose: (...args: any[]) => any;
  experimentNames: string[];
  createExperimentApi: (...args: any[]) => any;
  onExperimentCreated: () => void;
  navigate: NavigateFunction;
};

export class CreateExperimentModalImpl extends Component<CreateExperimentModalImplProps> {
  handleCreateExperiment = async (values: any) => {
    // get values of input fields
    const experimentName = values[EXP_NAME_FIELD];
    const artifactLocation = values[ARTIFACT_LOCATION];

    // createExperimentApi call needs to be fulfilled before redirecting the user to the newly
    // created experiment page (history.push())
    const response = await this.props.createExperimentApi(experimentName, artifactLocation);
    this.props.onExperimentCreated();

    const {
      value: { experiment_id: newExperimentId },
    } = response;
    if (newExperimentId) {
      this.props.navigate(Routes.getExperimentPageRoute(newExperimentId));
    }
  };

  debouncedExperimentNameValidator = debounce(
    getExperimentNameValidator(() => this.props.experimentNames),
    400,
  );

  render() {
    const { isOpen } = this.props;
    return (
      <GenericInputModal
        title="Create Experiment"
        okText="Create"
        isOpen={isOpen}
        handleSubmit={this.handleCreateExperiment}
        onClose={this.props.onClose}
      >
        {/* @ts-expect-error TS(2322): Type '{ validator: ((rule: any, value: any, callba... Remove this comment to see the full error message */}
        <CreateExperimentForm validator={this.debouncedExperimentNameValidator} />
      </GenericInputModal>
    );
  }
}

const mapStateToProps = (state: any) => {
  const experiments = getExperiments(state);
  const experimentNames = experiments.map((e) => e.name);
  return { experimentNames };
};

const mapDispatchToProps = {
  createExperimentApi,
};

export const CreateExperimentModal = withRouterNext(
  connect(mapStateToProps, mapDispatchToProps)(CreateExperimentModalImpl),
);
```

--------------------------------------------------------------------------------

---[FILE: DeleteExperimentModal.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/DeleteExperimentModal.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, jest, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import { shallow } from 'enzyme';
import { DeleteExperimentModalImpl } from './DeleteExperimentModal';
import { ConfirmModal } from './ConfirmModal';
import { createMLflowRoutePath } from '../../../common/utils/RoutingUtils';

describe('DeleteExperimentModal', () => {
  let wrapper: any;
  let instance;
  let minimalProps: any;
  const fakeExperimentId = 'fakeExpId';

  const navigate = jest.fn();

  beforeEach(() => {
    navigate.mockClear();
    minimalProps = {
      isOpen: false,
      onClose: jest.fn(),
      activeExperimentIds: ['0'],
      experimentId: '0',
      experimentName: 'myFirstExperiment',
      deleteExperimentApi: (experimentId: any, deleteExperimentRequestId: any) => {
        const response = { value: { experiment_id: fakeExperimentId } };
        return Promise.resolve(response);
      },
      navigate,
    };
    wrapper = shallow(<DeleteExperimentModalImpl {...minimalProps} />);
  });
  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<DeleteExperimentModalImpl {...minimalProps} />);
    expect(wrapper.find(ConfirmModal).length).toBe(1);
    expect(wrapper.length).toBe(1);
  });
  test('handleSubmit redirects user to root page if current experiment is the only active experiment', async () => {
    instance = wrapper.instance();
    await instance.handleSubmit();
    expect(navigate).toHaveBeenCalledWith(createMLflowRoutePath('/'));
  });
  test('handleSubmit redirects to compare experiment page if current experiment is one of several active experiments', async () => {
    const props = Object.assign({}, minimalProps, { activeExperimentIds: ['0', '1', '2'] });
    instance = shallow(<DeleteExperimentModalImpl {...props} />).instance();
    await instance.handleSubmit();

    expect(navigate).toHaveBeenCalledWith(createMLflowRoutePath('/compare-experiments/s?experiments=["1","2"]'));
  });
  test('handleSubmit does not perform redirection if DeleteExperiment request fails', async () => {
    const props = {
      ...minimalProps,
      deleteExperimentApi: () => Promise.reject(new Error('DeleteExperiment failed!')),
    };
    wrapper = shallow(<DeleteExperimentModalImpl {...props} />);
    instance = wrapper.instance();
    await instance.handleSubmit();

    expect(navigate).not.toHaveBeenCalled();
  });
  test('handleSubmit does not perform redirection if deleted experiment is not active experiment', async () => {
    wrapper = shallow(<DeleteExperimentModalImpl {...{ ...minimalProps, activeExperimentIds: undefined }} />);
    instance = wrapper.instance();
    await instance.handleSubmit();

    expect(navigate).not.toHaveBeenCalled();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: DeleteExperimentModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/DeleteExperimentModal.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { ConfirmModal } from './ConfirmModal';
import { deleteExperimentApi } from '../../actions';
import Routes from '../../routes';
import Utils from '../../../common/utils/Utils';
import { connect } from 'react-redux';
import type { NavigateFunction } from '../../../common/utils/RoutingUtils';
import { getUUID } from '../../../common/utils/ActionUtils';
import { withRouterNext } from '../../../common/utils/withRouterNext';

type Props = {
  isOpen: boolean;
  onClose: (...args: any[]) => any;
  activeExperimentIds?: string[];
  experimentId: string;
  experimentName: string;
  deleteExperimentApi: (...args: any[]) => any;
  onExperimentDeleted: () => void;
  navigate: NavigateFunction;
};

export class DeleteExperimentModalImpl extends Component<Props> {
  handleSubmit = () => {
    const { experimentId, activeExperimentIds } = this.props;
    const deleteExperimentRequestId = getUUID();

    const deletePromise = this.props
      .deleteExperimentApi(experimentId, deleteExperimentRequestId)
      .then(() => {
        // reload the page if an active experiment was deleted
        if (activeExperimentIds?.includes(experimentId)) {
          if (activeExperimentIds.length === 1) {
            // send it to root
            this.props.navigate(Routes.rootRoute);
          } else {
            const experimentIds = activeExperimentIds.filter((eid) => eid !== experimentId);
            const route =
              experimentIds.length === 1
                ? Routes.getExperimentPageRoute(experimentIds[0])
                : Routes.getCompareExperimentsPageRoute(experimentIds);
            this.props.navigate(route);
          }
        }
      })
      .then(() => this.props.onExperimentDeleted())
      .catch((e: any) => {
        Utils.logErrorAndNotifyUser(e);
      });

    return deletePromise;
  };

  render() {
    return (
      <ConfirmModal
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        handleSubmit={this.handleSubmit}
        title={`Delete Experiment "${this.props.experimentName}"`}
        helpText={
          <div>
            <p>
              <b>
                Experiment "{this.props.experimentName}" (Experiment ID: {this.props.experimentId}) will be deleted.
              </b>
            </p>
            {/* @ts-expect-error TS(4111): Property 'MLFLOW_SHOW_GDPR_PURGING_MESSAGES' comes from a... Remove this comment to see the full error message */}
            {process.env.MLFLOW_SHOW_GDPR_PURGING_MESSAGES === 'true' ? (
              <p>
                Deleted experiments are restorable for 30 days, after which they are purged along with their associated
                runs, including metrics, params, tags, and artifacts.
              </p>
            ) : (
              ''
            )}
          </div>
        }
        confirmButtonText="Delete"
      />
    );
  }
}

const mapDispatchToProps = {
  deleteExperimentApi,
};

export const DeleteExperimentModal = withRouterNext(connect(undefined, mapDispatchToProps)(DeleteExperimentModalImpl));
```

--------------------------------------------------------------------------------

---[FILE: DeleteRunModal.d.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/DeleteRunModal.d.ts

```typescript
const DeleteRunModal: React.FC<
  React.PropsWithChildren<{
    isOpen?: boolean;
    onClose?: () => void;
    selectedRunIds?: string[];
  }>
>;

export default DeleteRunModal;
```

--------------------------------------------------------------------------------

---[FILE: DeleteRunModal.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/DeleteRunModal.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, jest, test, expect } from '@jest/globals';
import React from 'react';
import { shallow } from 'enzyme';
import { DeleteRunModalImpl } from './DeleteRunModal';

/**
 * Return a function that can be used to mock run deletion API requests, appending deleted run IDs
 * to the provided list.
 * @param shouldFail: If true, the generated function will return a promise that always reject
 * @param deletedIdsList List to which to append IDs of deleted runs
 * @returns {function(*=): Promise<any>}
 */
const getMockDeleteRunApiFn = (shouldFail: any, deletedIdsList: any) => {
  return (runId: any) => {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (shouldFail) {
          reject();
        } else {
          deletedIdsList.push(runId);
          // @ts-expect-error TS(2794): Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
          resolve();
        }
      }, 1000);
    });
  };
};

describe('MyComponent', () => {
  let wrapper;
  let instance;
  let minimalProps: any;

  beforeEach(() => {
    minimalProps = {
      isOpen: false,
      onClose: jest.fn(),
      selectedRunIds: ['runId0', 'runId1'],
      openErrorModal: jest.fn(),
      deleteRunApi: getMockDeleteRunApiFn(false, []),
      intl: { formatMessage: jest.fn() },
      childRunIdsBySelectedParent: {},
    };
    wrapper = shallow(<DeleteRunModalImpl {...minimalProps} />);
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<DeleteRunModalImpl {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should delete each selected run on submission', (done) => {
    const deletedRunIds: any = [];
    const deleteRunApi = getMockDeleteRunApiFn(false, deletedRunIds);
    wrapper = shallow(<DeleteRunModalImpl {...{ ...minimalProps, deleteRunApi }} />);
    instance = wrapper.instance();
    instance.handleDeleteSelected().then(() => {
      expect(deletedRunIds).toEqual(minimalProps.selectedRunIds);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should show error modal if deletion fails', (done) => {
    const deletedRunIds: any = [];
    const deleteRunApi = getMockDeleteRunApiFn(true, deletedRunIds);
    wrapper = shallow(<DeleteRunModalImpl {...{ ...minimalProps, deleteRunApi }} />);
    instance = wrapper.instance();
    instance.handleDeleteSelected().then(() => {
      expect(deletedRunIds).toEqual([]);
      expect(minimalProps.openErrorModal).toHaveBeenCalled();
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should delete child runs when selected', (done) => {
    const deletedRunIds: any = [];
    const deleteRunApi = getMockDeleteRunApiFn(false, deletedRunIds);
    const childRunIdsBySelectedParent = { runId0: ['childRun1', 'childRun2'] };
    wrapper = shallow(<DeleteRunModalImpl {...{ ...minimalProps, deleteRunApi, childRunIdsBySelectedParent }} />);
    instance = wrapper.instance();
    instance.handleDeleteWithChildren().then(() => {
      expect(deletedRunIds).toEqual(['runId0', 'runId1', 'childRun1', 'childRun2']);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should not duplicate already selected child runs', (done) => {
    const deletedRunIds: any = [];
    const deleteRunApi = getMockDeleteRunApiFn(false, deletedRunIds);
    const childRunIdsBySelectedParent = { runId0: ['runId1'] };
    wrapper = shallow(<DeleteRunModalImpl {...{ ...minimalProps, deleteRunApi, childRunIdsBySelectedParent }} />);
    instance = wrapper.instance();
    instance.handleDeleteWithChildren().then(() => {
      expect(deletedRunIds).toEqual(['runId0', 'runId1']);
      done();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: DeleteRunModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/DeleteRunModal.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { deleteRunApi, openErrorModal } from '../../actions';
import { connect } from 'react-redux';
import Utils from '../../../common/utils/Utils';
import type { IntlShape } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Button, Modal } from '@databricks/design-system';
import { EXPERIMENT_PARENT_ID_TAG } from '../experiment-page/utils/experimentPage.common-utils';

interface State {
  deletingMode: null | 'selected' | 'withChildren';
}

type Props = {
  isOpen: boolean;
  onClose: (...args: any[]) => any;
  selectedRunIds: string[];
  openErrorModal: (...args: any[]) => any;
  deleteRunApi: (...args: any[]) => any;
  onSuccess?: () => void;
  intl: IntlShape;
  childRunIdsBySelectedParent: Record<string, string[]>;
};

export class DeleteRunModalImpl extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteSelected = this.handleDeleteSelected.bind(this);
    this.handleDeleteWithChildren = this.handleDeleteWithChildren.bind(this);
    this.onRequestClose = this.onRequestClose.bind(this);
  }

  state: State = {
    deletingMode: null,
  };

  getChildRunIdsToDelete() {
    const { childRunIdsBySelectedParent, selectedRunIds } = this.props;
    const selectedRunIdsSet = new Set(selectedRunIds);
    const childRunIdsSet = new Set<string>();

    Object.values(childRunIdsBySelectedParent).forEach((childIds = []) => {
      childIds.forEach((childId) => {
        if (!selectedRunIdsSet.has(childId)) {
          childRunIdsSet.add(childId);
        }
      });
    });

    return Array.from(childRunIdsSet);
  }

  getRunIdsToDelete(includeDescendants: boolean) {
    if (!includeDescendants) {
      return this.props.selectedRunIds;
    }
    const childRunIds = this.getChildRunIdsToDelete();
    return [...this.props.selectedRunIds, ...childRunIds];
  }

  handleDelete(includeDescendants: boolean) {
    if (this.state.deletingMode) {
      return Promise.resolve();
    }
    this.setState({ deletingMode: includeDescendants ? 'withChildren' : 'selected' });
    return this.deleteRuns(includeDescendants);
  }

  handleDeleteSelected() {
    return this.handleDelete(false);
  }

  handleDeleteWithChildren() {
    return this.handleDelete(true);
  }

  deleteRuns(includeDescendants: boolean) {
    const deletePromises: any = [];
    const runIdsToDelete = this.getRunIdsToDelete(includeDescendants);
    runIdsToDelete.forEach((runId) => {
      deletePromises.push(this.props.deleteRunApi(runId));
    });
    return Promise.all(deletePromises)
      .catch(() => {
        const errorModalContent = `${this.props.intl.formatMessage({
          defaultMessage: 'While deleting an experiment run, an error occurred.',
          description: 'Experiment tracking > delete run modal > error message',
        })}`;
        this.props.openErrorModal(errorModalContent);
      })
      .then(() => {
        this.props.onSuccess?.();
      })
      .finally(() => {
        this.setState({ deletingMode: null });
        this.props.onClose();
      });
  }

  onRequestClose() {
    if (!this.state.deletingMode) {
      this.props.onClose();
    }
  }

  render() {
    const number = this.props.selectedRunIds.length;
    const childRunIds = this.getChildRunIdsToDelete();
    const childRunCount = childRunIds.length;
    const hasChildRuns = childRunCount > 0;
    const totalRunsWithChildren = number + childRunCount;
    const { deletingMode } = this.state;
    const isDeletingSelected = deletingMode === 'selected';
    const isDeletingWithChildren = deletingMode === 'withChildren';

    const deleteSelectedButton = (
      <Button
        componentId="delete-selected"
        key="delete-selected"
        onClick={this.handleDeleteSelected}
        disabled={isDeletingWithChildren}
        loading={isDeletingSelected}
        type="primary"
      >
        Delete selected
      </Button>
    );

    const deleteSelectedAndChildrenButton = hasChildRuns ? (
      <Button
        componentId="delete-selected-children"
        key="delete-selected-children"
        type="primary"
        onClick={this.handleDeleteWithChildren}
        disabled={isDeletingSelected}
        loading={isDeletingWithChildren}
      >
        Delete selected and children
      </Button>
    ) : null;

    const footerButtons = [
      <Button componentId="cancel" key="cancel" onClick={this.onRequestClose} disabled={!!deletingMode}>
        Cancel
      </Button>,
      deleteSelectedButton,
      ...(deleteSelectedAndChildrenButton ? [deleteSelectedAndChildrenButton] : []),
    ];

    return (
      <Modal
        componentId="delete-run-modal"
        data-testid="delete-run-modal"
        title={`Delete Experiment ${Utils.pluralize('Run', number)}`}
        visible={this.props.isOpen}
        onCancel={this.onRequestClose}
        footer={footerButtons}
      >
        <div className="modal-explanatory-text">
          <p>
            <b>
              Selected {number} experiment {Utils.pluralize('run', number)}.
            </b>
          </p>
          {hasChildRuns ? (
            <p>
              The selected run has {childRunCount} child {Utils.pluralize('run', childRunCount)}. Delete this run alone
              or all {totalRunsWithChildren}?
            </p>
          ) : null}
          {/* @ts-expect-error TS(4111): Property 'MLFLOW_SHOW_GDPR_PURGING_MESSAGES' comes from a... Remove this comment to see the full error message */}
          {process.env.MLFLOW_SHOW_GDPR_PURGING_MESSAGES === 'true' ? (
            <p>
              Deleted runs are restorable for 30 days, after which they are purged along with associated metrics,
              params, tags, and artifacts.
            </p>
          ) : (
            ''
          )}
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state: any, ownProps: { selectedRunIds: string[] }) => {
  const tagsByRunUuid = state.entities?.tagsByRunUuid || {};
  const parentToChildrenMap: Record<string, string[]> = {};

  Object.entries(tagsByRunUuid).forEach(([runId, tags]) => {
    const parentTag = (tags as any)?.[EXPERIMENT_PARENT_ID_TAG];
    const parentRunId = parentTag?.value;
    if (parentRunId) {
      if (!parentToChildrenMap[parentRunId]) {
        parentToChildrenMap[parentRunId] = [];
      }
      parentToChildrenMap[parentRunId].push(runId);
    }
  });

  const resolveDescendants = (runId: string) => {
    const result: string[] = [];
    const stack = [...(parentToChildrenMap[runId] || [])];
    const visited = new Set<string>();

    while (stack.length) {
      const current = stack.pop();
      if (current && !visited.has(current)) {
        visited.add(current);
        result.push(current);
        const children = parentToChildrenMap[current];
        if (children) {
          stack.push(...children);
        }
      }
    }

    return result;
  };

  const childRunIdsBySelectedParent: Record<string, string[]> = {};
  ownProps.selectedRunIds.forEach((runId) => {
    const descendants = resolveDescendants(runId);
    if (descendants.length) {
      childRunIdsBySelectedParent[runId] = descendants;
    }
  });

  return { childRunIdsBySelectedParent };
};

const mapDispatchToProps = {
  deleteRunApi,
  openErrorModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(DeleteRunModalImpl));
```

--------------------------------------------------------------------------------

---[FILE: ErrorModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/ErrorModal.test.tsx
Signals: React

```typescript
import { describe, jest, test, expect } from '@jest/globals';
import React from 'react';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { ErrorModalWithIntl } from './ErrorModal';

describe('ErrorModalImpl', () => {
  const minimalProps: any = {
    isOpen: true,
    onClose: jest.fn(),
    text: 'Error popup content',
  };

  test('should render with minimal props without exploding', () => {
    renderWithIntl(<ErrorModalWithIntl {...minimalProps} />);
    expect(screen.getByText(/error popup content/i)).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ErrorModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/ErrorModal.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { Modal } from '@databricks/design-system';
import { connect } from 'react-redux';
import { getErrorModalText, isErrorModalOpen } from '../../reducers/Reducers';
import { closeErrorModal } from '../../actions';
import { injectIntl } from 'react-intl';

type ErrorModalImplProps = {
  isOpen: boolean;
  onClose: (...args: any[]) => any;
  text: string;
  intl: {
    formatMessage: (...args: any[]) => any;
  };
};

class ErrorModalImpl extends Component<ErrorModalImplProps> {
  render() {
    return (
      <Modal
        title={this.props.intl.formatMessage({
          defaultMessage: 'Oops!',
          description: 'Error modal title to rendering errors',
        })}
        visible={this.props.isOpen}
        onCancel={this.props.onClose}
        okButtonProps={{
          style: {
            display: 'none',
          },
        }}
        cancelText={this.props.intl.formatMessage({
          defaultMessage: 'Close',
          description: 'Error modal close button text',
        })}
        // @ts-expect-error TS(2322): Type '{ children: Element; title: any; visible: bo... Remove this comment to see the full error message
        centered
      >
        <p style={{ marginBottom: '10px' }}>{this.props.text}</p>
      </Modal>
    );
  }
}

const mapStateToProps = (state: any) => {
  const isOpen = isErrorModalOpen(state);
  const text = getErrorModalText(state);
  return {
    isOpen,
    text,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onClose: () => {
      dispatch(closeErrorModal());
    },
  };
};

// @ts-expect-error TS(2769): No overload matches this call.
export const ErrorModalWithIntl = injectIntl(ErrorModalImpl);
export default connect(mapStateToProps, mapDispatchToProps)(ErrorModalWithIntl);
```

--------------------------------------------------------------------------------

---[FILE: GenericInputModal.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/GenericInputModal.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, jest, test, expect } from '@jest/globals';
import React, { Component } from 'react';
import { shallow } from 'enzyme';
import { GenericInputModal } from './GenericInputModal';
import { Modal } from '@databricks/design-system';

class SimpleForm extends Component {
  render() {
    return null;
  }
}
function validateFields(isFieldValid: any) {
  if (!isFieldValid) {
    return Promise.reject(new Error("{ formField: 'formValue' }"));
  } else {
    return Promise.resolve({ formField: 'formValue' });
  }
}
function resetFields(resetFieldsFn: any) {
  resetFieldsFn();
}

describe('GenericInputModal', () => {
  let wrapper;
  let minimalProps: any;
  let resetFieldsMock: any;

  beforeEach(() => {
    resetFieldsMock = jest.fn();
    minimalProps = {
      isOpen: false,
      onClose: jest.fn(),
      onCancel: jest.fn(),
      // Mock submission handler that sleeps 1s then resolves
      handleSubmit: (values: any) =>
        new Promise((resolve) => {
          window.setTimeout(() => {
            // @ts-expect-error TS(2794): Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
            resolve();
          }, 1000);
        }),
      title: 'Enter your input',
      // @ts-expect-error TS(2769): No overload matches this call.
      children: <SimpleForm shouldValidationThrow={false} resetFieldsFn={resetFieldsMock} />,
    };
    wrapper = shallow(<GenericInputModal {...minimalProps} />);
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<GenericInputModal {...minimalProps} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find(Modal).length).toBe(1);
  });

  test('should validate form contents and set submitting state in submission handler: successful submission case', async () => {
    // Test that validateFields() is called, and that handleSubmit is not called
    // when validation fails (and submitting state remains false)
    wrapper = shallow(<GenericInputModal {...minimalProps} />);
    const instance = wrapper.instance();
    wrapper.children(SimpleForm).props().innerRef.current = {
      validateFields: () => validateFields(true),
      resetFields: () => resetFields(resetFieldsMock),
    };
    const onValidationPromise = instance.onSubmit();
    expect(instance.state.isSubmitting).toEqual(true);
    await onValidationPromise;
    // We expect submission to succeed, and for the form fields to be reset and for the form to
    // no longer be submitting
    expect(resetFieldsMock).toHaveBeenCalled();
    expect(instance.state.isSubmitting).toEqual(false);
  });

  test('should validate form contents and set submitting state in submission handler: failed validation case', async () => {
    // Test that validateFields() is called, and that handleSubmit is not called
    // when validation fails (and submitting state remains false)
    // @ts-expect-error TS(2769): No overload matches this call.
    const form = <SimpleForm shouldValidationThrow resetFieldsFn={resetFieldsMock} />;
    const handleSubmit = jest.fn();
    wrapper = shallow(<GenericInputModal {...{ ...minimalProps, children: form, handleSubmit }} />);
    const instance = wrapper.instance();
    wrapper.children(SimpleForm).props().innerRef.current = {
      validateFields: () => validateFields(false),
      resetFields: () => resetFields(resetFieldsMock),
    };
    const onValidationPromise = instance.onSubmit();
    expect(instance.state.isSubmitting).toEqual(true);
    try {
      await onValidationPromise;
      throw new Error('Must throw');
    } catch (e) {
      // For validation errors, the form should not be reset (so that the user can fix the
      // validation error)
      expect(resetFieldsMock).not.toHaveBeenCalled();
      expect(handleSubmit).not.toHaveBeenCalled();
      expect(instance.state.isSubmitting).toEqual(false);
    }
  });

  // TODO: it seems that https://github.com/mlflow/mlflow/pull/15059 introduced test regression, to be investigated and fixed
  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('should validate form contents and set submitting state in submission handler: failed submission case', async () => {
    // Test that validateFields() is called, and that handleSubmit is not called
    // when validation fails (and submitting state remains false)
    // @ts-expect-error TS(2769): No overload matches this call.
    const form = <SimpleForm shouldValidationThrow={false} resetFieldsFn={resetFieldsMock} />;
    const handleSubmit = (values: any) =>
      new Promise((resolve, reject) => {
        window.setTimeout(() => {
          reject(new Error());
        }, 1000);
      });
    wrapper = shallow(<GenericInputModal {...{ ...minimalProps, children: form, handleSubmit }} />);
    const instance = wrapper.instance();
    wrapper.children(SimpleForm).props().innerRef.current = {
      validateFields: () => validateFields(true),
      resetFields: () => resetFields(resetFieldsMock),
    };
    const onValidationPromise = instance.onSubmit();
    expect(instance.state.isSubmitting).toEqual(true);
    await onValidationPromise;
    // For validation errors, the form should not be reset (so that the user can fix the
    // validation error)
    expect(resetFieldsMock).toHaveBeenCalled();
    expect(instance.state.isSubmitting).toEqual(false);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: GenericInputModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/GenericInputModal.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { Modal } from '@databricks/design-system';

import Utils from '../../../common/utils/Utils';

type Props = {
  okText?: string;
  cancelText?: string;
  isOpen?: boolean;
  onClose: (...args: any[]) => any;
  onCancel?: () => void;
  className?: string;
  footer?: React.ReactNode;
  handleSubmit: (...args: any[]) => any;
  title: React.ReactNode;
};

type State = {
  isSubmitting: boolean;
};

/**
 * Generic modal that has a title and an input field with a save/submit button.
 * As of now, it is used to display the 'Rename Run' and 'Rename Experiment' modals.
 */
export class GenericInputModal extends Component<Props, State> {
  state = {
    isSubmitting: false,
  };

  formRef = React.createRef();

  onSubmit = async () => {
    this.setState({ isSubmitting: true });
    try {
      const values = await (this as any).formRef.current.validateFields();
      await this.props.handleSubmit(values);
      this.resetAndClearModalForm();
      this.onRequestCloseHandler();
    } catch (e) {
      this.handleSubmitFailure(e);
    }
  };

  resetAndClearModalForm = () => {
    this.setState({ isSubmitting: false });
    (this as any).formRef.current.resetFields();
  };

  handleSubmitFailure = (e: any) => {
    this.setState({ isSubmitting: false });
    Utils.logErrorAndNotifyUser(e);
  };

  onRequestCloseHandler = () => {
    this.resetAndClearModalForm();
    this.props.onClose();
  };

  handleCancel = () => {
    this.onRequestCloseHandler();
    this.props.onCancel?.();
  };

  render() {
    const { isSubmitting } = this.state;
    const { okText, cancelText, isOpen, footer, children } = this.props;

    // add props (ref) to passed component
    const displayForm = React.Children.map(children, (child) => {
      // Checking isValidElement is the safe way and avoids a typescript
      // error too.
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { innerRef: this.formRef });
      }
      return child;
    });

    return (
      <Modal
        data-testid="mlflow-input-modal"
        className={this.props.className}
        title={this.props.title}
        // @ts-expect-error TS(2322): Type '{ children: {}[] | null | undefined; "data-t... Remove this comment to see the full error message
        width={540}
        visible={isOpen}
        onOk={this.onSubmit}
        okText={okText}
        cancelText={cancelText}
        confirmLoading={isSubmitting}
        onCancel={this.handleCancel}
        footer={footer}
        centered
      >
        {displayForm}
      </Modal>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: GetLinkModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/GetLinkModal.test.tsx
Signals: React

```typescript
import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { GetLinkModal } from './GetLinkModal';
import { DesignSystemProvider } from '@databricks/design-system';

describe('GetLinkModal', () => {
  const minimalProps: any = {
    visible: true,
    onCancel: () => {},
    link: 'link',
  };

  test('should render with minimal props without exploding', () => {
    renderWithIntl(
      <DesignSystemProvider>
        <GetLinkModal {...minimalProps} />
      </DesignSystemProvider>,
    );
    expect(screen.getByText('Get Link')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: GetLinkModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/GetLinkModal.tsx

```typescript
import { FormattedMessage } from 'react-intl';
import { Modal } from '@databricks/design-system';
import { CopyBox } from '../../../shared/building_blocks/CopyBox';

type Props = {
  visible: boolean;
  onCancel: () => void;
  link: string;
};

export const GetLinkModal = ({ visible, onCancel, link }: Props) => {
  return (
    <Modal
      componentId="codegen_mlflow_app_src_experiment-tracking_components_modals_getlinkmodal.tsx_21"
      title={<FormattedMessage defaultMessage="Get Link" description="Title text for get-link modal" />}
      visible={visible}
      onCancel={onCancel}
    >
      <CopyBox copyText={link} />
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

````
