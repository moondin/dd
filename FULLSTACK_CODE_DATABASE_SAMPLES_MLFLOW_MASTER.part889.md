---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 889
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 889 of 991)

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

---[FILE: test_study.py]---
Location: mlflow-master/tests/pyspark/optuna/test_study.py

```python
import logging
import os

import numpy as np
import pyspark
import pytest
from optuna.samplers import TPESampler
from packaging.version import Version

import mlflow
from mlflow.exceptions import ExecutionException
from mlflow.pyspark.optuna.study import MlflowSparkStudy

from tests.optuna.test_storage import setup_storage  # noqa: F401
from tests.pyfunc.test_spark import get_spark_session

_logger = logging.getLogger(__name__)


def _get_spark_session_with_retry(max_tries=3):
    conf = pyspark.SparkConf()
    for attempt in range(max_tries):
        try:
            return get_spark_session(conf)
        except Exception as e:
            if attempt >= max_tries - 1:
                raise
            _logger.exception(
                f"Attempt {attempt} to create a SparkSession failed ({e!r}), retrying..."
            )


# Specify `autouse=True` to ensure that a context is created
# before any tests are executed. This ensures that the Hadoop filesystem
# does not create its own SparkContext without the MLeap libraries required by
# other tests.
@pytest.fixture(scope="module", autouse=True)
def spark():
    if Version(pyspark.__version__) < Version("3.1"):
        spark_home = (
            os.environ.get("SPARK_HOME")
            if "SPARK_HOME" in os.environ
            else os.path.dirname(pyspark.__file__)
        )
        conf_dir = os.path.join(spark_home, "conf")
        os.makedirs(conf_dir, exist_ok=True)
        with open(os.path.join(conf_dir, "spark-defaults.conf"), "w") as f:
            conf = """
spark.driver.extraJavaOptions="-Dio.netty.tryReflectionSetAccessible=true"
spark.executor.extraJavaOptions="-Dio.netty.tryReflectionSetAccessible=true"
"""
            f.write(conf)

    with _get_spark_session_with_retry() as spark:
        yield spark


def test_study_optimize_run(setup_storage):
    storage = setup_storage
    study_name = "test-study"
    sampler = TPESampler(seed=10)
    mlflow_study = MlflowSparkStudy(
        study_name, storage, sampler=sampler, mlflow_tracking_uri=mlflow.get_tracking_uri()
    )

    def objective(trial):
        x = trial.suggest_float("x", -10, 10)
        return (x - 2) ** 2

    mlflow_study.optimize(objective, n_trials=8, n_jobs=4)
    assert sorted(mlflow_study.best_params.keys()) == ["x"]
    assert len(mlflow_study.trials) == 8
    np.testing.assert_allclose(mlflow_study.best_params["x"], 5.426412865334919, rtol=1e-6)


def test_study_with_failed_objective(setup_storage):
    storage = setup_storage
    study_name = "test-study"
    sampler = TPESampler(seed=10)
    mlflow_study = MlflowSparkStudy(
        study_name, storage, sampler=sampler, mlflow_tracking_uri=mlflow.get_tracking_uri()
    )

    def fail_objective(_):
        raise ValueError()

    with pytest.raises(
        ExecutionException,
        match="Optimization run for Optuna MlflowSparkStudy failed",
    ):
        mlflow_study.optimize(fail_objective, n_trials=4)


def test_auto_resume_existing_study(setup_storage):
    storage = setup_storage
    study_name = "resume-test-study"
    sampler = TPESampler(seed=42)

    # Create first study and run some trials
    study1 = MlflowSparkStudy(study_name, storage, sampler=sampler)
    assert not study1.is_resumed_study

    def objective(trial):
        return trial.suggest_float("x", 0, 10) ** 2

    study1.optimize(objective, n_trials=3, n_jobs=1)
    first_trial_count = len(study1.trials)
    first_best_value = study1.best_value

    # Create second study with same name - should resume
    study2 = MlflowSparkStudy(study_name, storage, sampler=sampler)
    assert study2.is_resumed_study
    assert len(study2.trials) == first_trial_count
    assert study2.best_value == first_best_value

    # Continue optimization
    study2.optimize(objective, n_trials=2, n_jobs=1)
    assert len(study2.trials) == first_trial_count + 2

    # Assert that the resumed study generates a better (lower) objective value than the first study
    assert study2.best_value <= first_best_value


def test_new_study_is_not_resumed(setup_storage):
    storage = setup_storage
    study_name = "new-study"

    study = MlflowSparkStudy(study_name, storage)
    assert not study.is_resumed_study
    assert study.completed_trials_count == 0

    info = study.get_resume_info()
    assert not info.is_resumed


def test_resume_info_method(setup_storage):
    storage = setup_storage
    study_name = "info-test-study"
    sampler = TPESampler(seed=123)

    # New study
    study1 = MlflowSparkStudy(study_name, storage, sampler=sampler)
    info = study1.get_resume_info()
    assert not info.is_resumed

    # Run some trials
    def objective(trial):
        return trial.suggest_float("x", 0, 1) ** 2

    study1.optimize(objective, n_trials=2, n_jobs=1)

    # Resume study
    study2 = MlflowSparkStudy(study_name, storage, sampler=sampler)
    info = study2.get_resume_info()
    assert info.is_resumed
    assert info.study_name == study_name
    assert info.existing_trials == 2
    assert info.completed_trials == 2
    assert hasattr(info, "best_value")
    assert hasattr(info, "best_params")
    assert info.best_value is not None
    assert info.best_params is not None


def test_completed_trials_count_property(setup_storage):
    storage = setup_storage
    study_name = "count-test-study"

    study = MlflowSparkStudy(study_name, storage)
    assert study.completed_trials_count == 0

    def objective(trial):
        return trial.suggest_float("x", 0, 1)

    study.optimize(objective, n_trials=3, n_jobs=1)
    assert study.completed_trials_count == 3

    # Resume and check count is preserved
    resumed_study = MlflowSparkStudy(study_name, storage)
    assert resumed_study.completed_trials_count == 3


def test_resume_preserves_best_results(setup_storage):
    storage = setup_storage
    study_name = "best-results-study"
    sampler = TPESampler(seed=456)

    def objective(trial):
        x = trial.suggest_float("x", -10, 10)
        return (x - 2) ** 2

    # First optimization
    study1 = MlflowSparkStudy(study_name, storage, sampler=sampler)
    study1.optimize(objective, n_trials=5, n_jobs=1)

    original_best_value = study1.best_value
    original_best_params = study1.best_params.copy()

    # Resume and verify best results are preserved
    study2 = MlflowSparkStudy(study_name, storage, sampler=sampler)
    assert study2.best_value == original_best_value
    assert study2.best_params == original_best_params

    # Continue optimization and verify it can improve
    study2.optimize(objective, n_trials=5, n_jobs=1)

    # Best value should be the same or better (lower for minimization)
    assert study2.best_value <= original_best_value
```

--------------------------------------------------------------------------------

---[FILE: iris.py]---
Location: mlflow-master/tests/pytorch/iris.py

```python
import tempfile

import pytorch_lightning as pl
import torch
import torch.nn.functional as F
import torch.utils.tensorboard
from packaging.version import Version
from torch import nn

tmpdir = tempfile.mkdtemp()
SUMMARY_WRITER = torch.utils.tensorboard.SummaryWriter(log_dir=tmpdir)


def create_multiclass_accuracy():
    # NB: Older versions of PyTorch Lightning define native APIs for metric computation,
    # (e.g., pytorch_lightning.metrics.Accuracy), while newer versions rely on the `torchmetrics`
    # package (e.g. `torchmetrics.Accuracy)
    try:
        import torchmetrics
        from torchmetrics import Accuracy

        if Version(torchmetrics.__version__) >= Version("0.11"):
            return Accuracy(task="multiclass", num_classes=3)
        else:
            return Accuracy()
    except ImportError:
        from pytorch_lightning.metrics import Accuracy

        return Accuracy()


class IrisClassificationBase(pl.LightningModule):
    def __init__(self, **kwargs):
        super().__init__()

        self.train_acc = create_multiclass_accuracy()
        self.val_acc = create_multiclass_accuracy()
        self.test_acc = create_multiclass_accuracy()
        self.args = kwargs

        self.fc1 = nn.Linear(4, 10)
        self.fc2 = nn.Linear(10, 10)
        self.fc3 = nn.Linear(10, 3)
        self.cross_entropy_loss = nn.CrossEntropyLoss()

    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        return F.relu(self.fc3(x))

    def configure_optimizers(self):
        return torch.optim.Adam(self.parameters(), 0.01)


class IrisClassification(IrisClassificationBase):
    def training_step(self, batch, batch_idx):
        x, y = batch
        logits = self.forward(x)
        loss = self.cross_entropy_loss(logits, y)
        # this should *not* get intercepted by "plain" pytorch autologging
        # since it is called from inside lightning's fit()
        SUMMARY_WRITER.add_scalar("plain_loss", loss.item())
        self.train_acc(torch.argmax(logits, dim=1), y)
        self.log("train_acc", self.train_acc.compute(), on_step=False, on_epoch=True)
        self.log("loss", loss)
        self.log("loss_forked", loss, on_epoch=True, on_step=True)
        return {"loss": loss}

    def validation_step(self, batch, batch_idx):
        x, y = batch
        logits = self.forward(x)
        loss = F.cross_entropy(logits, y)
        self.val_acc(torch.argmax(logits, dim=1), y)
        self.log("val_acc", self.val_acc.compute())
        self.log("val_loss", loss, sync_dist=True)

    def test_step(self, batch, batch_idx):
        x, y = batch
        logits = self.forward(x)
        loss = F.cross_entropy(logits, y)
        self.test_acc(torch.argmax(logits, dim=1), y)
        self.log("test_loss", loss)
        self.log("test_acc", self.test_acc.compute())


class IrisClassificationWithoutValidation(IrisClassificationBase):
    def training_step(self, batch, batch_idx):
        x, y = batch
        logits = self.forward(x)
        loss = self.cross_entropy_loss(logits, y)
        self.train_acc(torch.argmax(logits, dim=1), y)
        self.log("train_acc", self.train_acc.compute(), on_step=False, on_epoch=True)
        self.log("loss", loss)
        return {"loss": loss}

    def test_step(self, batch, batch_idx):
        x, y = batch
        logits = self.forward(x)
        loss = F.cross_entropy(logits, y)
        self.test_acc(torch.argmax(logits, dim=1), y)
        self.log("test_loss", loss)
        self.log("test_acc", self.test_acc.compute())


class IrisClassificationMultiOptimizer(IrisClassificationBase):
    """
    Contrived lightning module that uses multiple optimizers. In real-world scenarios
    multiple optimizers might be used for Generative Adversarial Networks (GANs).
    """

    def __init__(self, **kwargs):
        super().__init__()
        self.automatic_optimization = False

    def training_step(self, batch, batch_idx):
        opt1, opt2 = self.optimizers()

        x, y = batch
        logits = self.forward(x)
        loss = self.cross_entropy_loss(logits, y)

        opt1.zero_grad()
        opt2.zero_grad()

        self.manual_backward(loss)

        opt1.step()
        opt2.step()

        self.log("loss", loss, on_epoch=True, on_step=True)

    def configure_optimizers(self):
        opt1 = torch.optim.Adam(self.parameters(), 0.01)
        opt2 = torch.optim.Adam(self.parameters(), 0.01)
        return [opt1, opt2]


if __name__ == "__main__":
    pass
```

--------------------------------------------------------------------------------

---[FILE: iris_data_module.py]---
Location: mlflow-master/tests/pytorch/iris_data_module.py

```python
import pytorch_lightning as pl
import torch
from sklearn.datasets import load_iris
from torch.utils.data import DataLoader, TensorDataset, random_split


class IrisDataModuleBase(pl.LightningDataModule):
    def __init__(self):
        super().__init__()
        self.columns = None

    def _get_iris_as_tensor_dataset(self):
        iris = load_iris()
        df = iris.data
        self.columns = iris.feature_names
        target = iris["target"]
        data = torch.Tensor(df).float()
        labels = torch.Tensor(target).long()
        return TensorDataset(data, labels)

    def setup(self, stage=None):
        # Assign train/val datasets for use in dataloaders
        if stage == "fit" or stage is None:
            iris_full = self._get_iris_as_tensor_dataset()
            self.train_set, self.val_set = random_split(iris_full, [130, 20])

        # Assign test dataset for use in dataloader(s)
        if stage == "test" or stage is None:
            self.train_set, self.test_set = random_split(self.train_set, [110, 20])


class IrisDataModule(IrisDataModuleBase):
    def train_dataloader(self):
        return DataLoader(self.train_set, batch_size=4)

    def val_dataloader(self):
        return DataLoader(self.val_set, batch_size=4)

    def test_dataloader(self):
        return DataLoader(self.test_set, batch_size=4)


class IrisDataModuleWithoutValidation(IrisDataModuleBase):
    def train_dataloader(self):
        return DataLoader(self.train_set, batch_size=4)

    def test_dataloader(self):
        return DataLoader(self.test_set, batch_size=4)


if __name__ == "__main__":
    pass
```

--------------------------------------------------------------------------------

---[FILE: test_forecasting_model.py]---
Location: mlflow-master/tests/pytorch/test_forecasting_model.py

```python
import os

import numpy as np
import pytest
import torch
from lightning.pytorch import Trainer
from pytorch_forecasting import DeepAR, TimeSeriesDataSet
from pytorch_forecasting.data.examples import generate_ar_data

import mlflow


@pytest.fixture
def model_path(tmp_path):
    return os.path.join(tmp_path, "model")


def _gen_forecasting_model_and_data(n_series, timesteps, max_prediction_length):
    data = generate_ar_data(seasonality=10.0, timesteps=timesteps, n_series=n_series)
    max_encoder_length = 30

    time_series_dataset = TimeSeriesDataSet(
        data[lambda x: x.time_idx <= timesteps - max_prediction_length],
        time_idx="time_idx",
        target="value",
        group_ids=["series"],
        max_encoder_length=max_encoder_length,
        max_prediction_length=max_prediction_length,
        time_varying_unknown_reals=["value"],
    )
    deepar = DeepAR.from_dataset(
        time_series_dataset,
        learning_rate=1e-3,
        hidden_size=16,
        rnn_layers=2,
    )
    dataloader = time_series_dataset.to_dataloader(train=True, batch_size=32)
    trainer = Trainer(max_epochs=2, gradient_clip_val=0.1, accelerator="auto")
    trainer.fit(deepar, train_dataloaders=dataloader)

    return deepar, data


def test_forecasting_model_pyfunc_loader(model_path: str):
    n_series = 10
    max_prediction_length = 20
    deepar, data = _gen_forecasting_model_and_data(
        n_series=n_series,
        timesteps=100,
        max_prediction_length=max_prediction_length,
    )

    torch.manual_seed(42)
    predicted = deepar.predict(data).numpy()
    assert predicted.shape == (n_series, max_prediction_length)

    mlflow.pytorch.save_model(deepar, model_path)

    pyfunc_loaded = mlflow.pyfunc.load_model(model_path)
    torch.manual_seed(42)
    np.testing.assert_array_almost_equal(pyfunc_loaded.predict(data), predicted, decimal=4)

    with pytest.raises(
        TypeError,
        match="The pytorch forecasting model does not support numpy.ndarray",
    ):
        pyfunc_loaded.predict(np.array([1.0, 2.0]))
```

--------------------------------------------------------------------------------

````
