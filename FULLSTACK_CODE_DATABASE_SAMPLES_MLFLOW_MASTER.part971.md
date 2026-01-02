---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 971
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 971 of 991)

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

---[FILE: helper.py]---
Location: mlflow-master/tests/transformers/helper.py

```python
import inspect
import logging
import sys

import transformers
from packaging.version import Version

from mlflow.transformers import _PEFT_PIPELINE_ERROR_MSG, _try_import_conversational_pipeline
from mlflow.utils.logging_utils import suppress_logs

from tests.helper_functions import flaky

_logger = logging.getLogger(__name__)

transformers_version = Version(transformers.__version__)
IS_NEW_FEATURE_EXTRACTION_API = transformers_version >= Version("4.27.0")

CHAT_TEMPLATE = "{% for message in messages %}{{ message.content }}{{ eos_token }}{% endfor %}"


def prefetch(func):
    """
    Annotation decorator for marking model loading functions to run before testing.
    """
    func.is_prefetch = True
    return func


@prefetch
@flaky()
def load_small_qa_pipeline():
    architecture = "csarron/mobilebert-uncased-squad-v2"
    tokenizer = transformers.AutoTokenizer.from_pretrained(architecture, low_cpu_mem_usage=True)
    model = transformers.MobileBertForQuestionAnswering.from_pretrained(
        architecture, low_cpu_mem_usage=True
    )
    return transformers.pipeline(task="question-answering", model=model, tokenizer=tokenizer)


@prefetch
@flaky()
def load_small_vision_model():
    architecture = "google/mobilenet_v2_1.0_224"
    feature_extractor = transformers.AutoFeatureExtractor.from_pretrained(
        architecture, low_cpu_mem_usage=True
    )
    model = transformers.MobileNetV2ForImageClassification.from_pretrained(
        architecture, low_cpu_mem_usage=True
    )
    return transformers.pipeline(
        task="image-classification", model=model, feature_extractor=feature_extractor
    )


@prefetch
@flaky()
def load_small_multi_modal_pipeline():
    architecture = "dandelin/vilt-b32-finetuned-vqa"
    return transformers.pipeline(model=architecture)


@prefetch
@flaky()
def load_component_multi_modal():
    architecture = "dandelin/vilt-b32-finetuned-vqa"
    tokenizer = transformers.BertTokenizerFast.from_pretrained(architecture, low_cpu_mem_usage=True)
    processor = transformers.ViltProcessor.from_pretrained(architecture, low_cpu_mem_usage=True)
    image_processor = transformers.ViltImageProcessor.from_pretrained(
        architecture, low_cpu_mem_usage=True
    )
    model = transformers.ViltForQuestionAnswering.from_pretrained(
        architecture, low_cpu_mem_usage=True
    )
    transformers_model = {"model": model, "tokenizer": tokenizer}
    if IS_NEW_FEATURE_EXTRACTION_API:
        transformers_model["image_processor"] = image_processor
    else:
        transformers_model["feature_extractor"] = processor
    return transformers_model


@prefetch
@flaky()
def load_small_conversational_model():
    if _try_import_conversational_pipeline():
        tokenizer = transformers.AutoTokenizer.from_pretrained(
            "microsoft/DialoGPT-small", low_cpu_mem_usage=True
        )
        model = transformers.AutoModelWithLMHead.from_pretrained(
            "satvikag/chatbot", low_cpu_mem_usage=True
        )
        return transformers.pipeline(task="conversational", model=model, tokenizer=tokenizer)


@prefetch
@flaky()
def load_fill_mask_pipeline():
    architecture = "distilroberta-base"
    model = transformers.AutoModelForMaskedLM.from_pretrained(architecture, low_cpu_mem_usage=True)
    tokenizer = transformers.AutoTokenizer.from_pretrained(architecture)
    return transformers.pipeline(task="fill-mask", model=model, tokenizer=tokenizer)


@prefetch
@flaky()
def load_text2text_generation_pipeline():
    task = "text2text-generation"
    architecture = "mrm8488/t5-small-finetuned-common_gen"
    model = transformers.T5ForConditionalGeneration.from_pretrained(architecture)
    tokenizer = transformers.T5TokenizerFast.from_pretrained(architecture)
    return transformers.pipeline(task=task, tokenizer=tokenizer, model=model)


@prefetch
@flaky()
def load_text_generation_pipeline():
    task = "text-generation"
    architecture = "distilgpt2"
    model = transformers.AutoModelWithLMHead.from_pretrained(architecture)
    tokenizer = transformers.AutoTokenizer.from_pretrained(
        architecture, chat_template=CHAT_TEMPLATE
    )
    return transformers.pipeline(task=task, model=model, tokenizer=tokenizer)


@prefetch
@flaky()
def load_translation_pipeline():
    return transformers.pipeline(
        task="translation_en_to_de",
        model=transformers.T5ForConditionalGeneration.from_pretrained("t5-small"),
        tokenizer=transformers.T5TokenizerFast.from_pretrained("t5-small", model_max_length=100),
    )


@prefetch
@flaky()
def load_summarizer_pipeline():
    task = "summarization"
    architecture = "sshleifer/distilbart-cnn-6-6"
    model = transformers.BartForConditionalGeneration.from_pretrained(architecture)
    tokenizer = transformers.AutoTokenizer.from_pretrained(architecture)
    return transformers.pipeline(task=task, tokenizer=tokenizer, model=model)


@prefetch
@flaky()
def load_text_classification_pipeline():
    task = "text-classification"
    architecture = "distilbert-base-uncased-finetuned-sst-2-english"
    model = transformers.AutoModelForSequenceClassification.from_pretrained(architecture)
    tokenizer = transformers.AutoTokenizer.from_pretrained(architecture)
    return transformers.pipeline(
        task=task,
        tokenizer=tokenizer,
        model=model,
    )


@prefetch
@flaky()
def load_zero_shot_pipeline():
    task = "zero-shot-classification"
    architecture = "typeform/distilbert-base-uncased-mnli"
    model = transformers.AutoModelForSequenceClassification.from_pretrained(architecture)
    tokenizer = transformers.AutoTokenizer.from_pretrained(architecture)
    return transformers.pipeline(task=task, tokenizer=tokenizer, model=model)


@prefetch
@flaky()
def load_table_question_answering_pipeline():
    return transformers.pipeline(
        task="table-question-answering", model="google/tapas-tiny-finetuned-sqa"
    )


@prefetch
@flaky()
def load_ner_pipeline():
    return transformers.pipeline(
        task="token-classification", model="vblagoje/bert-english-uncased-finetuned-pos"
    )


@prefetch
@flaky()
def load_ner_pipeline_aggregation():
    return transformers.pipeline(
        task="token-classification",
        model="vblagoje/bert-english-uncased-finetuned-pos",
        aggregation_strategy="average",
    )


@prefetch
@flaky()
def load_conversational_pipeline():
    if _try_import_conversational_pipeline():
        return transformers.pipeline(
            model="AVeryRealHuman/DialoGPT-small-TonyStark", task="conversational"
        )


@prefetch
@flaky()
def load_whisper_pipeline():
    task = "automatic-speech-recognition"
    architecture = "openai/whisper-tiny"
    model = transformers.WhisperForConditionalGeneration.from_pretrained(architecture)
    tokenizer = transformers.WhisperTokenizer.from_pretrained(architecture)
    feature_extractor = transformers.WhisperFeatureExtractor.from_pretrained(architecture)
    if Version(transformers.__version__) > Version("4.30.2"):
        model.generation_config.alignment_heads = [[2, 2], [3, 0], [3, 2], [3, 3], [3, 4], [3, 5]]
    if Version(transformers.__version__) > Version("4.49.0"):
        # forced_decoder_ids is not allowed
        # ref: https://github.com/huggingface/transformers/blob/6a2627918d84f25422b931507a8fb9146106ca20/src/transformers/generation/utils.py#L1083
        model.generation_config.forced_decoder_ids = None
    return transformers.pipeline(
        task=task, model=model, tokenizer=tokenizer, feature_extractor=feature_extractor
    )


@prefetch
@flaky()
def load_audio_classification_pipeline():
    return transformers.pipeline("audio-classification", model="superb/wav2vec2-base-superb-ks")


@prefetch
@flaky()
def load_feature_extraction_pipeline():
    st_arch = "sentence-transformers/all-MiniLM-L6-v2"
    model = transformers.AutoModel.from_pretrained(st_arch)
    tokenizer = transformers.AutoTokenizer.from_pretrained(st_arch)
    return transformers.pipeline(model=model, tokenizer=tokenizer, task="feature-extraction")


@prefetch
@flaky()
def load_peft_pipeline():
    try:
        from peft import LoraConfig, TaskType, get_peft_model
    except ImportError:
        # Do nothing if PEFT is not installed
        return

    base_model_id = "Elron/bleurt-tiny-512"
    base_model = transformers.AutoModelForSequenceClassification.from_pretrained(base_model_id)
    tokenizer = transformers.AutoTokenizer.from_pretrained(base_model_id)

    peft_config = LoraConfig(
        task_type=TaskType.SEQ_CLS, inference_mode=False, r=8, lora_alpha=32, lora_dropout=0.1
    )
    peft_model = get_peft_model(base_model, peft_config)
    with suppress_logs("transformers.pipelines.base", filter_regex=_PEFT_PIPELINE_ERROR_MSG):
        return transformers.pipeline(
            task="text-classification", model=peft_model, tokenizer=tokenizer
        )


@prefetch
@flaky()
def load_custom_code_pipeline():
    model = transformers.AutoModel.from_pretrained(
        "hf-internal-testing/test_dynamic_model_with_util", trust_remote_code=True
    )
    tokenizer = transformers.AutoTokenizer.from_pretrained("google-bert/bert-base-uncased")
    return transformers.pipeline(
        task="feature-extraction",
        model=model,
        tokenizer=tokenizer,
    )


@prefetch
@flaky()
def load_custom_components_pipeline():
    model = transformers.AutoModel.from_pretrained(
        "hf-internal-testing/test_dynamic_model_with_tokenizer", trust_remote_code=True
    )
    tokenizer = transformers.AutoTokenizer.from_pretrained(
        "hf-internal-testing/test_dynamic_processor", trust_remote_code=True
    )
    feature_extractor = transformers.AutoFeatureExtractor.from_pretrained(
        "hf-internal-testing/test_dynamic_processor",
        trust_remote_code=True,
    )
    return transformers.pipeline(
        task="feature-extraction",
        model=model,
        tokenizer=tokenizer,
        feature_extractor=feature_extractor,
    )


def prefetch_models():
    """
    Prefetches models used in the test suite to avoid downloading them during the test run.
    Fetching model weights from the HuggingFace Hub has been proven to be flaky in the past, so
    we want to avoid doing it in the middle of the test run, instead, failing fast.
    """
    # Get all model loading functions that are marked as @prefetch
    for _, func in inspect.getmembers(sys.modules[__name__]):
        if inspect.isfunction(func) and hasattr(func, "is_prefetch") and func.is_prefetch:
            # Call the function to download the model to HuggingFace cache
            func()


if __name__ == "__main__":
    prefetch_models()
```

--------------------------------------------------------------------------------

---[FILE: test_flavor_configs.py]---
Location: mlflow-master/tests/transformers/test_flavor_configs.py

```python
import pytest

from mlflow.exceptions import MlflowException
from mlflow.transformers import _build_pipeline_from_model_input
from mlflow.transformers.flavor_config import (
    build_flavor_config,
    update_flavor_conf_to_persist_pretrained_model,
)
from mlflow.transformers.hub_utils import is_valid_hf_repo_id

from tests.transformers.helper import IS_NEW_FEATURE_EXTRACTION_API


@pytest.fixture
def multi_modal_pipeline(component_multi_modal):
    task = "image-classification"
    pipeline = _build_pipeline_from_model_input(component_multi_modal, task)

    if IS_NEW_FEATURE_EXTRACTION_API:
        processor = pipeline.image_processor
        components = {
            "tokenizer": "BertTokenizerFast",
            "image_processor": "ViltImageProcessor",
            "processor": "ViltImageProcessor",
        }
    else:
        processor = pipeline.feature_extractor
        components = {
            "tokenizer": "BertTokenizerFast",
            "feature_extractor": "ViltProcessor",
            "processor": "ViltProcessor",
        }

    return pipeline, task, processor, components


def test_flavor_config_pt_save_pretrained_false(small_qa_pipeline):
    expected = {
        "task": "question-answering",
        "instance_type": "QuestionAnsweringPipeline",
        "pipeline_model_type": "MobileBertForQuestionAnswering",
        "source_model_name": "csarron/mobilebert-uncased-squad-v2",
        # "source_model_revision": "SOME_COMMIT_SHA",
        "framework": "pt",
        "torch_dtype": "torch.float32",
        "components": ["tokenizer"],
        "tokenizer_type": "MobileBertTokenizerFast",
        "tokenizer_name": "csarron/mobilebert-uncased-squad-v2",
        # "tokenizer_revision": "SOME_COMMIT_SHA",
    }
    conf = build_flavor_config(small_qa_pipeline, save_pretrained=False)
    assert len(conf.pop("source_model_revision")) == 40
    assert len(conf.pop("tokenizer_revision")) == 40
    assert conf == expected


def test_flavor_config_torch_dtype_overridden_when_specified(small_qa_pipeline):
    import torch

    conf = build_flavor_config(small_qa_pipeline, torch_dtype=torch.float16, save_pretrained=False)
    assert conf["torch_dtype"] == "torch.float16"


def test_flavor_config_component_multi_modal(multi_modal_pipeline):
    pipeline, task, processor, expected_components = multi_modal_pipeline

    # 1. Test with save_pretrained = True
    conf = build_flavor_config(pipeline, processor)

    assert "model_binary" in conf
    assert conf["pipeline_model_type"] == "ViltForQuestionAnswering"
    assert conf["source_model_name"] == "dandelin/vilt-b32-finetuned-vqa"
    assert "source_model_revision" not in conf

    assert set(conf["components"]) == set(expected_components.keys()) - {"processor"}
    for component in expected_components:
        assert conf[f"{component}_type"] == expected_components[component]
        assert f"{component}_revision" not in conf
        assert f"{component}_revision" not in conf


def test_flavor_config_component_multi_modal_save_pretrained_false(multi_modal_pipeline):
    pipeline, task, processor, expected_components = multi_modal_pipeline

    conf = build_flavor_config(pipeline, processor, save_pretrained=False)

    assert "model_binary" not in conf
    assert conf["pipeline_model_type"] == "ViltForQuestionAnswering"
    assert conf["source_model_name"] == pipeline.model.name_or_path
    assert len(conf["source_model_revision"]) == 40

    assert set(conf["components"]) == set(expected_components.keys()) - {"processor"}

    for component in expected_components:
        assert conf[f"{component}_type"] == expected_components[component]
        assert conf[f"{component}_name"] == pipeline.model.name_or_path
        assert len(conf[f"{component}_revision"]) == 40


def test_is_valid_hf_repo_id(tmp_path):
    assert is_valid_hf_repo_id(None) is False
    assert is_valid_hf_repo_id(str(tmp_path)) is False
    assert is_valid_hf_repo_id("invalid/repo/name") is False
    assert is_valid_hf_repo_id("google-t5/t5-small") is True


_COMMON_CONF = {
    "task": "text-classification",
    "instance_type": "TextClassificationPipeline",
    "pipeline_model_type": "TFMobileBertForSequenceClassification",
    "source_model_name": "lordtt13/emo-mobilebert",
    "framework": "tf",
    "components": ["tokenizer"],
    "tokenizer_type": "MobileBertTokenizerFast",
    "transformers_version": "4.37.1",
}
_COMMIT_HASH = "26d8fcb41762ae83cc9fa03005cb63cde06ef340"


def test_update_flavor_conf_to_persist_pretrained_model():
    flavor_conf = {
        **_COMMON_CONF,
        "components": ["tokenizer"],
        "source_model_revision": _COMMIT_HASH,
        "tokenizer_name": "lordtt13/emo-mobilebert",
        "tokenizer_revision": _COMMIT_HASH,
    }
    updated_flavor_conf = update_flavor_conf_to_persist_pretrained_model(flavor_conf)

    assert updated_flavor_conf["model_binary"] == "model"
    assert "source_model_revision" not in updated_flavor_conf
    assert "tokenizer_revision" not in updated_flavor_conf
    assert "tokenizer_name" not in updated_flavor_conf


def test_update_flavor_conf_to_persist_pretrained_model_multi_modal():
    flavor_conf = {
        **_COMMON_CONF,
        "components": ["tokenizer", "image_processor"],
        "source_model_revision": _COMMIT_HASH,
        "tokznier_revision": _COMMIT_HASH,
        "image-processor_type": "ViltImageProcessor",
        "image_processor_name": "dandelin/vilt-b32-finetuned-vqa",
        "image_processor_revision": _COMMIT_HASH,
        "processor_type": "ViltImageProcessor",
        "processor_name": "dandelin/vilt-b32-finetuned-vqa",
        "processor_revision": _COMMIT_HASH,
    }
    updated_flavor_conf = update_flavor_conf_to_persist_pretrained_model(flavor_conf)

    assert updated_flavor_conf["model_binary"] == "model"
    assert "source_model_revision" not in updated_flavor_conf
    for component in ["tokenizer", "image_processor", "processor"]:
        assert f"{component}_revision" not in updated_flavor_conf
        assert f"{component}_name" not in updated_flavor_conf


def test_update_flavor_conf_to_persist_pretrained_model_raise_if_already_persisted():
    flavor_conf = {
        **_COMMON_CONF,
        "components": ["tokenizer"],
        "model_binary": "model",
    }

    with pytest.raises(MlflowException, match="It appears that the pretrained model weight"):
        update_flavor_conf_to_persist_pretrained_model(flavor_conf)
```

--------------------------------------------------------------------------------

---[FILE: test_transformers_autolog.py]---
Location: mlflow-master/tests/transformers/test_transformers_autolog.py

```python
import random

import numpy as np
import optuna
import pytest
import setfit
import sklearn
import sklearn.cluster
import sklearn.datasets
import torch
import transformers
from datasets import load_dataset
from packaging.version import Version
from sentence_transformers.losses import CosineSimilarityLoss
from setfit import SetFitModel, sample_dataset
from setfit import Trainer as SetFitTrainer
from setfit import TrainingArguments as SetFitTrainingArguments
from transformers import (
    DistilBertForSequenceClassification,
    DistilBertTokenizerFast,
    Trainer,
    TrainingArguments,
    pipeline,
)

import mlflow


@pytest.fixture
def iris_data():
    iris = sklearn.datasets.load_iris()
    return iris.data[:, :2], iris.target


@pytest.fixture
def setfit_trainer():
    dataset = load_dataset("sst2")

    train_dataset = sample_dataset(dataset["train"], label_column="label", num_samples=8)
    eval_dataset = dataset["validation"]

    model = SetFitModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

    training_args = SetFitTrainingArguments(
        loss=CosineSimilarityLoss,
        batch_size=16,
        num_iterations=5,
        num_epochs=1,
        report_to="none",
    )

    # TODO: Remove this once https://github.com/huggingface/setfit/issues/512
    #   is resolved. This is a workaround during the deprecation of the
    #   evaluation_strategy argument is being addressed in the SetFit library.
    training_args.eval_strategy = training_args.evaluation_strategy

    trainer = SetFitTrainer(
        model=model,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        metric="accuracy",
        column_mapping={"sentence": "text", "label": "label"},
        args=training_args,
    )

    # setfit >= 1.1.0 defines an internal BCSentenceTransformersTrainer
    # which directly uses transformers.Trainer, and the default callbacks
    # include MLflowCallback, so it produces extra runs no matter autologging
    # is on or off
    # ref: https://github.com/huggingface/transformers/blob/11c27dd331151e7d2ac20016cce11d9d7c4b1756/src/transformers/integrations/integration_utils.py#L2138
    if Version(setfit.__version__) >= Version("1.1.0"):
        from transformers.integrations.integration_utils import MLflowCallback

        trainer.remove_callback(MLflowCallback)

    return trainer


@pytest.fixture
def transformers_trainer(tmp_path):
    random.seed(8675309)
    np.random.seed(8675309)
    torch.manual_seed(8675309)

    tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")
    model = DistilBertForSequenceClassification.from_pretrained(
        "distilbert-base-uncased", num_labels=2
    )

    train_texts = ["I love this product!", "This is terrible."]
    train_labels = [1, 0]

    train_encodings = tokenizer(train_texts, truncation=True, padding=True)

    class CustomDataset(torch.utils.data.Dataset):
        def __init__(self, encodings, labels):
            self.encodings = encodings
            self.labels = labels

        def __getitem__(self, idx):
            item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
            item["labels"] = torch.tensor(self.labels[idx])
            return item

        def __len__(self):
            return len(self.labels)

    train_dataset = CustomDataset(train_encodings, train_labels)

    training_args = TrainingArguments(
        output_dir=str(tmp_path.joinpath("results")),
        num_train_epochs=1,
        per_device_train_batch_size=4,
        logging_dir=str(tmp_path.joinpath("logs")),
    )

    return Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
    )


@pytest.fixture
def transformers_hyperparameter_trainer(tmp_path):
    random.seed(555)
    np.random.seed(555)
    torch.manual_seed(555)

    tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")
    model = DistilBertForSequenceClassification.from_pretrained(
        "distilbert-base-uncased", num_labels=2
    )

    train_texts = ["I love this product!", "This is terrible."]
    train_labels = [1, 0]

    train_encodings = tokenizer(train_texts, truncation=True, padding=True)

    class CustomDataset(torch.utils.data.Dataset):
        def __init__(self, encodings, labels):
            self.encodings = encodings
            self.labels = labels

        def __getitem__(self, idx):
            item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
            item["labels"] = torch.tensor(self.labels[idx])
            return item

        def __len__(self):
            return len(self.labels)

    train_dataset = CustomDataset(train_encodings, train_labels)

    def model_init():
        return DistilBertForSequenceClassification.from_pretrained(
            "distilbert-base-uncased", num_labels=2
        )

    def objective(trial):
        learning_rate = trial.suggest_float("learning_rate", 1e-7, 1e-1, log=True)

        training_args = TrainingArguments(
            output_dir=str(tmp_path.joinpath("results")),
            num_train_epochs=1,
            per_device_train_batch_size=4,
            learning_rate=learning_rate,
            logging_dir=str(tmp_path.joinpath("logs")),
            report_to="none",
        )

        trainer = Trainer(
            model_init=model_init,
            args=training_args,
            train_dataset=train_dataset,
        )

        train_result = trainer.train()
        return train_result.training_loss

    study = optuna.create_study(direction="minimize")
    study.optimize(objective, n_trials=2)

    best_params = study.best_params

    best_training_args = TrainingArguments(
        output_dir=str(tmp_path.joinpath("results")),
        num_train_epochs=3,
        per_device_train_batch_size=4,
        learning_rate=best_params["learning_rate"],
        logging_dir=str(tmp_path.joinpath("logs")),
    )

    return Trainer(
        model=model,
        args=best_training_args,
        train_dataset=train_dataset,
    )


@pytest.fixture
def transformers_hyperparameter_functional(tmp_path):
    random.seed(555)
    np.random.seed(555)
    torch.manual_seed(555)

    tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")

    train_texts = [
        "I simply adore artisinal baked goods!",
        "I thoroughly dislike artisinal bathroom cleaning.",
    ]
    train_labels = [1, 0]
    eval_texts = [
        "It was an excellent experience.",
        "I'd rather pick my teeth with a rusty pitchfork.",
    ]
    eval_labels = [1, 0]

    train_encodings = tokenizer(train_texts, truncation=True, padding=True)
    eval_encodings = tokenizer(eval_texts, truncation=True, padding=True)

    class CustomDataset(torch.utils.data.Dataset):
        def __init__(self, encodings, labels):
            self.encodings = encodings
            self.labels = labels

        def __getitem__(self, idx):
            item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
            item["labels"] = torch.tensor(self.labels[idx])
            return item

        def __len__(self):
            return len(self.labels)

    train_dataset = CustomDataset(train_encodings, train_labels)
    eval_dataset = CustomDataset(eval_encodings, eval_labels)

    training_args = TrainingArguments(
        output_dir=str(tmp_path.joinpath("results")),
        num_train_epochs=1,
        per_device_train_batch_size=4,
        logging_dir=str(tmp_path.joinpath("logs")),
        report_to="none",
    )

    def model_init():
        return DistilBertForSequenceClassification.from_pretrained(
            "distilbert-base-uncased", num_labels=2
        )

    trainer = Trainer(
        model_init=model_init,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
    )

    def my_hp_space_optuna(trial):
        return {
            "learning_rate": trial.suggest_float("learning_rate", 1e-5, 1e-1, log=True),
        }

    best_run = trainer.hyperparameter_search(
        hp_space=my_hp_space_optuna,
        backend="optuna",
        n_trials=2,
        direction="minimize",
    )

    best_training_args = TrainingArguments(
        output_dir=str(tmp_path.joinpath("best_results")),
        num_train_epochs=1,
        per_device_train_batch_size=4,
        learning_rate=best_run.hyperparameters["learning_rate"],
        logging_dir=str(tmp_path.joinpath("best_logs")),
    )

    return Trainer(
        model=model_init(),
        args=best_training_args,
        train_dataset=train_dataset,
    )


skip_setfit = pytest.mark.skipif(
    Version(transformers.__version__) >= Version("4.46.0"),
    reason="fails due to issue: https://github.com/huggingface/setfit/issues/564",
)


@skip_setfit
def test_setfit_does_not_autolog(setfit_trainer):
    mlflow.autolog()

    setfit_trainer.train()

    last_run = mlflow.last_active_run()
    assert not last_run
    preds = setfit_trainer.model(
        ["Always carry a towel!", "The hobbits are going to Isengard", "What's tatoes, precious?"]
    )
    assert len(preds) == 3


@skip_setfit
def test_transformers_trainer_does_not_autolog_sklearn(transformers_trainer):
    mlflow.sklearn.autolog()

    exp = mlflow.set_experiment(experiment_name="trainer_autolog_test")

    transformers_trainer.train()

    last_run = mlflow.last_active_run()
    assert last_run.data.metrics["epoch"] == 1.0
    assert last_run.data.params["_name_or_path"] == "distilbert-base-uncased"

    pipe = pipeline(
        task="text-classification",
        model=transformers_trainer.model,
        tokenizer=DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased"),
    )
    assert len(pipe("This is wonderful!")[0]["label"]) > 5  # Checking for 'LABEL_0' or 'LABEL_1'

    client = mlflow.MlflowClient()
    runs = client.search_runs([exp.experiment_id])
    assert len(runs) == 1


@skip_setfit
def test_transformers_autolog_adheres_to_global_behavior_using_setfit(setfit_trainer):
    mlflow.transformers.autolog(disable=False)

    setfit_trainer.train()
    assert len(mlflow.search_runs()) == 0
    preds = setfit_trainer.model(["Jim, I'm a doctor, not an archaeologist!"])
    assert len(preds) == 1


def test_transformers_autolog_adheres_to_global_behavior_using_trainer(transformers_trainer):
    mlflow.transformers.autolog()

    exp = mlflow.set_experiment(experiment_name="autolog_with_trainer")

    transformers_trainer.train()

    last_run = mlflow.last_active_run()
    assert last_run.data.metrics["epoch"] == 1.0
    assert last_run.data.params["model_type"] == "distilbert"

    pipe = pipeline(
        task="text-classification",
        model=transformers_trainer.model,
        tokenizer=DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased"),
    )
    preds = pipe(["This is pretty ok, I guess", "I came here to chew bubblegum"])
    assert len(preds) == 2
    assert all(x["score"] > 0 for x in preds)

    client = mlflow.MlflowClient()
    runs = client.search_runs([exp.experiment_id])
    assert len(runs) == 1


@skip_setfit
def test_active_autolog_no_setfit_logging_followed_by_successful_sklearn_autolog(
    iris_data, setfit_trainer
):
    mlflow.autolog()

    exp = mlflow.set_experiment(experiment_name="setfit_with_sklearn")

    # Train and evaluate
    setfit_trainer.train()
    metrics = setfit_trainer.evaluate()
    assert metrics["accuracy"] > 0

    # Run inference
    preds = setfit_trainer.model(
        [
            "i loved the new Star Trek show!",
            "That burger was gross; it tasted like it was made from cat food!",
        ]
    )
    assert len(preds) == 2

    # Test that autologging works for a simple sklearn model (local disabling functions)
    with mlflow.start_run(experiment_id=exp.experiment_id) as run:
        model = sklearn.cluster.KMeans()
        X, y = iris_data
        model.fit(X, y)

    logged_sklearn_data = mlflow.get_run(run.info.run_id)
    assert logged_sklearn_data.data.tags["estimator_name"] == "KMeans"

    # Assert only the sklearn KMeans model was logged to the experiment

    client = mlflow.MlflowClient()
    runs = client.search_runs([exp.experiment_id])
    assert len(runs) == 1
    assert runs[0].info == logged_sklearn_data.info


def test_active_autolog_allows_subsequent_sklearn_autolog(iris_data, transformers_trainer):
    mlflow.autolog()

    exp = mlflow.set_experiment(experiment_name="trainer_with_sklearn")

    transformers_trainer.train()

    last_run = mlflow.last_active_run()
    assert last_run.data.metrics["epoch"] == 1.0
    assert last_run.data.params["model_type"] == "distilbert"

    pipe = pipeline(
        task="text-classification",
        model=transformers_trainer.model,
        tokenizer=DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased"),
    )
    preds = pipe(["This is pretty ok, I guess", "I came here to chew bubblegum"])
    assert len(preds) == 2
    assert all(x["score"] > 0 for x in preds)

    with mlflow.start_run(experiment_id=exp.experiment_id) as run:
        model = sklearn.cluster.KMeans()
        X, y = iris_data
        model.fit(X, y)

    logged_sklearn_data = mlflow.get_run(run.info.run_id)
    assert logged_sklearn_data.data.tags["estimator_name"] == "KMeans"

    # Assert only the sklearn KMeans model was logged to the experiment

    client = mlflow.MlflowClient()
    runs = client.search_runs([exp.experiment_id])
    assert len(runs) == 2
    sklearn_run = [x for x in runs if x.info.run_id == run.info.run_id]
    assert sklearn_run[0].info == logged_sklearn_data.info


@skip_setfit
def test_disabled_sklearn_autologging_does_not_revert_to_enabled_with_setfit(
    iris_data, setfit_trainer
):
    mlflow.autolog()
    mlflow.sklearn.autolog(disable=True)

    exp = mlflow.set_experiment(experiment_name="setfit_with_sklearn_no_autologging")

    # Train and evaluate
    setfit_trainer.train()
    metrics = setfit_trainer.evaluate()
    assert metrics["accuracy"] > 0

    # Run inference
    preds = setfit_trainer.model(
        [
            "i loved the new Star Trek show!",
            "That burger was gross; it tasted like it was made from cat food!",
        ]
    )
    assert len(preds) == 2

    # Test that autologging does not log since it is manually disabled above.
    with mlflow.start_run(experiment_id=exp.experiment_id) as run:
        model = sklearn.cluster.KMeans()
        X, y = iris_data
        model.fit(X, y)

    # Assert that only the run info is logged
    logged_sklearn_data = mlflow.get_run(run.info.run_id)

    assert logged_sklearn_data.data.params == {}
    assert logged_sklearn_data.data.metrics == {}

    client = mlflow.MlflowClient()
    runs = client.search_runs([exp.experiment_id])

    assert len(runs) == 1
    assert runs[0].info == logged_sklearn_data.info


def test_disable_sklearn_autologging_does_not_revert_with_trainer(iris_data, transformers_trainer):
    mlflow.autolog()
    mlflow.sklearn.autolog(disable=True)

    exp = mlflow.set_experiment(experiment_name="trainer_with_sklearn")

    transformers_trainer.train()
    mlflow.flush_async_logging()

    last_run = mlflow.last_active_run()
    assert last_run.data.metrics["epoch"] == 1.0
    assert last_run.data.params["model_type"] == "distilbert"

    pipe = pipeline(
        task="text-classification",
        model=transformers_trainer.model,
        tokenizer=DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased"),
    )
    preds = pipe(
        ["Did you hear that guitar solo? Brilliant!", "That band should avoid playing live."]
    )
    assert len(preds) == 2
    assert all(x["score"] > 0 for x in preds)

    # Test that autologging does not log since it is manually disabled above.
    with mlflow.start_run(experiment_id=exp.experiment_id) as run:
        model = sklearn.cluster.KMeans()
        X, y = iris_data
        model.fit(X, y)

    # Assert that only the run info is logged
    logged_sklearn_data = mlflow.get_run(run.info.run_id)

    assert logged_sklearn_data.data.params == {}
    assert logged_sklearn_data.data.metrics == {}

    client = mlflow.MlflowClient()
    runs = client.search_runs([exp.experiment_id])

    assert len(runs) == 2
    sklearn_run = [x for x in runs if x.info.run_id == run.info.run_id]
    assert sklearn_run[0].info == logged_sklearn_data.info


def test_trainer_hyperparameter_tuning_does_not_log_sklearn_model(
    transformers_hyperparameter_trainer,
):
    mlflow.autolog()

    exp = mlflow.set_experiment(experiment_name="hyperparam_trainer")

    transformers_hyperparameter_trainer.train()
    mlflow.flush_async_logging()

    last_run = mlflow.last_active_run()
    assert last_run.data.metrics["epoch"] == 3.0
    assert last_run.data.params["model_type"] == "distilbert"

    pipe = pipeline(
        task="text-classification",
        model=transformers_hyperparameter_trainer.model,
        tokenizer=DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased"),
    )
    assert len(pipe("This is wonderful!")[0]["label"]) > 5  # checking for 'LABEL_0' or 'LABEL_1'

    client = mlflow.MlflowClient()
    runs = client.search_runs([exp.experiment_id])

    assert len(runs) == 1


def test_trainer_hyperparameter_tuning_functional_does_not_log_sklearn_model(
    transformers_hyperparameter_functional,
):
    mlflow.autolog()

    exp = mlflow.set_experiment(experiment_name="hyperparam_trainer_functional")

    transformers_hyperparameter_functional.train()
    mlflow.flush_async_logging()

    last_run = mlflow.last_active_run()
    assert last_run.data.metrics["epoch"] == 1.0
    assert last_run.data.params["model_type"] == "distilbert"

    pipe = pipeline(
        task="text-classification",
        model=transformers_hyperparameter_functional.model,
        tokenizer=DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased"),
    )
    assert len(pipe("This is wonderful!")[0]["label"]) > 5  # checking for 'LABEL_0' or 'LABEL_1'

    client = mlflow.MlflowClient()
    runs = client.search_runs([exp.experiment_id])

    assert len(runs) == 1
```

--------------------------------------------------------------------------------

````
