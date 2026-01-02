---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 282
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 282 of 991)

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

---[FILE: util.py]---
Location: mlflow-master/mlflow/genai/optimize/util.py
Signals: Pydantic

```python
import functools
from contextlib import contextmanager, nullcontext
from typing import TYPE_CHECKING, Any, Callable

from pydantic import BaseModel, create_model

from mlflow.entities import Trace
from mlflow.exceptions import MlflowException
from mlflow.genai.scorers import Scorer
from mlflow.genai.scorers.builtin_scorers import BuiltInScorer
from mlflow.genai.scorers.validation import valid_data_for_builtin_scorers
from mlflow.tracking.client import MlflowClient

if TYPE_CHECKING:
    import pandas as pd


@contextmanager
def prompt_optimization_autolog(
    optimizer_name: str,
    num_prompts: int,
    num_training_samples: int,
    train_data_df: "pd.DataFrame",
):
    """
    Context manager for autologging prompt optimization runs.

    Args:
        optimizer_name: Name of the optimizer being used
        num_prompts: Number of prompts being optimized
        num_training_samples: Number of training samples
        train_data_df: Training data as a pandas DataFrame

    Yields:
        Tuple of (run_id, results_dict) where results_dict should be populated with
        PromptOptimizerOutput and list of optimized PromptVersion objects
    """
    import mlflow.data

    active_run = mlflow.active_run()
    run_context = mlflow.start_run() if active_run is None else nullcontext(active_run)

    with run_context as run:
        client = MlflowClient()
        run_id = run.info.run_id

        mlflow.log_param("optimizer", optimizer_name)
        mlflow.log_param("num_prompts", num_prompts)
        mlflow.log_param("num_training_samples", num_training_samples)

        # Log training dataset as run input
        dataset = mlflow.data.from_pandas(train_data_df, source="prompt_optimization_train_data")
        mlflow.log_input(dataset, context="training")

        results = {}
        yield results

        if "optimized_prompts" in results:
            for prompt in results["optimized_prompts"]:
                client.link_prompt_version_to_run(run_id=run_id, prompt=prompt)

        if "optimizer_output" in results:
            output = results["optimizer_output"]
            if output.initial_eval_score is not None:
                mlflow.log_metric("initial_eval_score", output.initial_eval_score)
            if output.final_eval_score is not None:
                mlflow.log_metric("final_eval_score", output.final_eval_score)


def validate_train_data(
    train_data: "pd.DataFrame", scorers: list[Scorer], predict_fn: Callable[..., Any] | None = None
) -> None:
    """
    Validate that training data has required fields for prompt optimization.

    Args:
        train_data: Training data as a pandas DataFrame.
        scorers: Scorers to validate the training data for.
        predict_fn: The predict function to validate the training data for.

    Raises:
        MlflowException: If any record is missing required 'inputs' field or it is empty.
    """
    for i, record in enumerate(train_data.to_dict("records")):
        if "inputs" not in record or not record["inputs"]:
            raise MlflowException.invalid_parameter_value(
                f"Record {i} is missing required 'inputs' field or it is empty"
            )

    builtin_scorers = [scorer for scorer in scorers if isinstance(scorer, BuiltInScorer)]
    valid_data_for_builtin_scorers(train_data, builtin_scorers, predict_fn)


def infer_type_from_value(value: Any, model_name: str = "Output") -> type:
    """
    Infer the type from the value.
    Only supports primitive types, lists, and dict and Pydantic models.
    """
    if value is None:
        return type(None)
    elif isinstance(value, (bool, int, float, str)):
        return type(value)
    elif isinstance(value, list):
        if not value:
            return list[Any]
        element_types = {infer_type_from_value(item) for item in value}
        return list[functools.reduce(lambda x, y: x | y, element_types)]
    elif isinstance(value, dict):
        fields = {k: (infer_type_from_value(v, model_name=k), ...) for k, v in value.items()}
        return create_model(model_name, **fields)
    elif isinstance(value, BaseModel):
        return type(value)
    return Any


def create_metric_from_scorers(
    scorers: list[Scorer],
    objective: Callable[[dict[str, Any]], float] | None = None,
) -> Callable[[Any, Any, dict[str, Any]], float]:
    """
    Create a metric function from scorers and an optional objective function.

    Args:
        scorers: List of scorers to evaluate inputs, outputs, and expectations.
        objective: Optional function that aggregates scorer outputs into a single score.
                  Takes a dict mapping scorer names to scores and returns a float.
                  If None and all scorers return numerical or CategoricalRating values,
                  uses default aggregation (sum for numerical, conversion for categorical).

    Returns:
        A callable that takes (inputs, outputs, expectations) and
        returns a tuple of (float score, dict of rationales).

    Raises:
        MlflowException: If scorers return non-numerical values and no objective is provided.
    """
    from mlflow.entities import Feedback
    from mlflow.genai.judges import CategoricalRating

    def _convert_to_numeric(score: Any) -> float | None:
        """Convert a value to numeric, handling Feedback and primitive types."""
        if isinstance(score, Feedback):
            score = score.value
        if score == CategoricalRating.YES:
            return 1.0
        elif score == CategoricalRating.NO:
            return 0.0
        elif isinstance(score, (int, float, bool)):
            return float(score)
        return None

    def metric(
        inputs: Any,
        outputs: Any,
        expectations: dict[str, Any],
        trace: Trace | None,
    ) -> float:
        scores = {}
        rationales = {}

        for scorer in scorers:
            scores[scorer.name] = scorer.run(
                inputs=inputs, outputs=outputs, expectations=expectations, trace=trace
            )

        for key, score in scores.items():
            if isinstance(score, Feedback):
                rationales[key] = score.rationale

        if objective is not None:
            return objective(scores), rationales

        # Try to convert all scores to numeric
        numeric_scores = {}
        for name, score in scores.items():
            numeric_value = _convert_to_numeric(score)
            if numeric_value is not None:
                numeric_scores[name] = numeric_value

        # If all scores were convertible, use sum as default aggregation
        if len(numeric_scores) == len(scores):
            # We average the scores to get the score between 0 and 1.
            return sum(numeric_scores.values()) / len(numeric_scores), rationales

        # Otherwise, report error with actual types
        non_convertible = {
            k: type(v).__name__ for k, v in scores.items() if k not in numeric_scores
        }
        scorer_details = ", ".join([f"{k} (type: {t})" for k, t in non_convertible.items()])
        raise MlflowException(
            f"Scorers [{scorer_details}] return non-numerical values that cannot be "
            "automatically aggregated. Please provide an `objective` function to aggregate "
            "these values into a single score for optimization."
        )

    return metric
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/optimize/__init__.py

```python
from mlflow.exceptions import MlflowException
from mlflow.genai.optimize.optimize import optimize_prompts
from mlflow.genai.optimize.optimizers import BasePromptOptimizer, GepaPromptOptimizer
from mlflow.genai.optimize.types import (
    LLMParams,
    OptimizerConfig,
    PromptOptimizationResult,
    PromptOptimizerOutput,
)

_MIGRATION_GUIDE = """
    Migration guide:
        The ``optimize_prompt()`` API has been replaced by
        :py:func:`mlflow.genai.optimize_prompts()`, which provides more flexible
        optimization capabilities with a joint optimization of prompts in an arbitrary function.

        **Old API (removed):**

        .. code-block:: python

            from mlflow.genai import optimize_prompt
            from mlflow.genai.optimize.types import OptimizerConfig, LLMParams

            result = optimize_prompt(
                target_llm=LLMParams(model_name="openai:/gpt-4o"),
                prompt="prompts:/my-prompt/1",
                train_data=dataset,
                optimizer_config=OptimizerConfig(num_instruction_candidates=10),
            )

        **New API:**

        .. code-block:: python

            import mlflow
            import openai
            from mlflow.genai import optimize_prompts
            from mlflow.genai.optimize.optimizers import GepaPromptOptimizer
            from mlflow.genai.scorers import Correctness


            # Define a predict function that uses the prompt and LLM
            def predict_fn(inputs: dict[str, Any]) -> str:
                prompt = mlflow.genai.load_prompt("prompts:/my-prompt/1")
                formatted_prompt = prompt.format(**inputs)
                completion = openai.OpenAI().chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": formatted_prompt}],
                )
                return completion.choices[0].message.content


            result = optimize_prompts(
                predict_fn=predict_fn,
                train_data=dataset,
                prompt_uris=["prompts:/my-prompt/1"],
                optimizer=GepaPromptOptimizer(
                    reflection_model="openai:/gpt-4o",
                    max_metric_calls=100,
                ),
                scorers=[Correctness(model="openai:/gpt-4o")],
            )

        Key differences:
        - Use ``optimize_prompts()`` (plural) instead of ``optimize_prompt()``
        - Provide a predict function ``predict_fn`` instead of a prompt uri ``prompt``
        - Use ``prompt_uris`` to reference registered prompts
        - Specify an ``optimizer`` instance (e.g., ``GepaPromptOptimizer``)

        For more details, see the documentation:
        https://mlflow.org/docs/latest/genai/prompt-registry/optimize-prompts.html
        """


def optimize_prompt(*args, **kwargs):
    f"""
    Optimize a LLM prompt using the given dataset and evaluation metrics.
    This function has been removed. Use mlflow.genai.optimize_prompts() instead.

    {_MIGRATION_GUIDE}
    """

    raise MlflowException(
        f"""
        The optimize_prompt() function has been removed in MLflow 3.5.0.
        Please use mlflow.genai.optimize_prompts() instead.
        {_MIGRATION_GUIDE}"""
    )


__all__ = [
    "optimize_prompts",
    "optimize_prompt",
    "LLMParams",
    "OptimizerConfig",
    "BasePromptOptimizer",
    "GepaPromptOptimizer",
    "PromptOptimizerOutput",
    "PromptOptimizationResult",
]
```

--------------------------------------------------------------------------------

---[FILE: base.py]---
Location: mlflow-master/mlflow/genai/optimize/optimizers/base.py

```python
from abc import ABC, abstractmethod
from typing import Any, Callable

from mlflow.genai.optimize.types import EvaluationResultRecord, PromptOptimizerOutput
from mlflow.utils.annotations import experimental

# The evaluation function that takes candidate prompts as a dict
# (prompt template name -> prompt template) and a dataset as a list of dicts,
# and returns a list of EvaluationResultRecord.
_EvalFunc = Callable[[dict[str, str], list[dict[str, Any]]], list[EvaluationResultRecord]]


@experimental(version="3.5.0")
class BasePromptOptimizer(ABC):
    @abstractmethod
    def optimize(
        self,
        eval_fn: _EvalFunc,
        train_data: list[dict[str, Any]],
        target_prompts: dict[str, str],
        enable_tracking: bool = True,
    ) -> PromptOptimizerOutput:
        """
        Optimize the target prompts using the given evaluation function,
        dataset and target prompt templates.

        Args:
            eval_fn: The evaluation function that takes candidate prompts as a dict
                (prompt template name -> prompt template) and a dataset as a list of dicts,
                and returns a list of EvaluationResultRecord. Note that eval_fn is not thread-safe.
            train_data: The dataset to use for optimization. Each record should
                include the inputs and outputs fields with dict values.
            target_prompts: The target prompt templates to use. The key is the prompt template
                name and the value is the prompt template.
            enable_tracking: If True (default), automatically log optimization progress.

        Returns:
            The outputs of the prompt optimizer that includes the optimized prompts
            as a dict (prompt template name -> prompt template).
        """
```

--------------------------------------------------------------------------------

---[FILE: gepa_optimizer.py]---
Location: mlflow-master/mlflow/genai/optimize/optimizers/gepa_optimizer.py

```python
import importlib.metadata
from typing import TYPE_CHECKING, Any

from packaging.version import Version

from mlflow.genai.optimize.optimizers.base import BasePromptOptimizer, _EvalFunc
from mlflow.genai.optimize.types import EvaluationResultRecord, PromptOptimizerOutput
from mlflow.utils.annotations import experimental

if TYPE_CHECKING:
    import gepa


@experimental(version="3.5.0")
class GepaPromptOptimizer(BasePromptOptimizer):
    """
    A prompt adapter that uses GEPA (Genetic-Pareto) optimization algorithm
    to optimize prompts.

    GEPA uses iterative mutation, reflection, and Pareto-aware candidate selection
    to improve text components like prompts. It leverages large language models to
    reflect on system behavior and propose improvements.

    Args:
        reflection_model: Name of the model to use for reflection and optimization.
            Format: "<provider>:/<model>"
            (e.g., "openai:/gpt-4o", "anthropic:/claude-3-5-sonnet-20241022").
        max_metric_calls: Maximum number of evaluation calls during optimization.
            Higher values may lead to better results but increase optimization time.
            Default: 100
        display_progress_bar: Whether to show a progress bar during optimization.
            Default: False
        gepa_kwargs: Additional keyword arguments to pass directly to
            gepa.optimize <https://github.com/gepa-ai/gepa/blob/main/src/gepa/api.py>.
            Useful for accessing advanced GEPA features not directly exposed
            through MLflow's GEPA interface.

            Note: Parameters already handled by MLflow's GEPA class will be overridden by the direct
            parameters and should not be passed through gepa_kwargs. List of predefined params:

            - max_metric_calls
            - display_progress_bar
            - seed_candidate
            - trainset
            - adapter
            - reflection_lm
            - use_mlflow

    Example:

        .. code-block:: python

            import mlflow
            import openai
            from mlflow.genai.optimize.optimizers import GepaPromptOptimizer

            prompt = mlflow.genai.register_prompt(
                name="qa",
                template="Answer the following question: {{question}}",
            )


            def predict_fn(question: str) -> str:
                completion = openai.OpenAI().chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt.format(question=question)}],
                )
                return completion.choices[0].message.content


            dataset = [
                {"inputs": {"question": "What is the capital of France?"}, "outputs": "Paris"},
                {"inputs": {"question": "What is the capital of Germany?"}, "outputs": "Berlin"},
            ]

            result = mlflow.genai.optimize_prompts(
                predict_fn=predict_fn,
                train_data=dataset,
                prompt_uris=[prompt.uri],
                optimizer=GepaPromptOptimizer(
                    reflection_model="openai:/gpt-4o",
                    display_progress_bar=True,
                ),
            )

            print(result.optimized_prompts[0].template)
    """

    def __init__(
        self,
        reflection_model: str,
        max_metric_calls: int = 100,
        display_progress_bar: bool = False,
        gepa_kwargs: dict[str, Any] | None = None,
    ):
        self.reflection_model = reflection_model
        self.max_metric_calls = max_metric_calls
        self.display_progress_bar = display_progress_bar
        self.gepa_kwargs = gepa_kwargs or {}

    def optimize(
        self,
        eval_fn: _EvalFunc,
        train_data: list[dict[str, Any]],
        target_prompts: dict[str, str],
        enable_tracking: bool = True,
    ) -> PromptOptimizerOutput:
        """
        Optimize the target prompts using GEPA algorithm.

        Args:
            eval_fn: The evaluation function that takes candidate prompts as a dict
                (prompt template name -> prompt template) and a dataset as a list of dicts,
                and returns a list of EvaluationResultRecord.
            train_data: The dataset to use for optimization. Each record should
                include the inputs and outputs fields with dict values.
            target_prompts: The target prompt templates to use. The key is the prompt template
                name and the value is the prompt template.
            enable_tracking: If True (default), automatically log optimization progress.

        Returns:
            The outputs of the prompt optimizer that includes the optimized prompts
            as a dict (prompt template name -> prompt template).
        """
        from mlflow.metrics.genai.model_utils import _parse_model_uri

        try:
            import gepa
        except ImportError as e:
            raise ImportError(
                "GEPA is not installed. Please install it with: `pip install gepa`"
            ) from e

        provider, model = _parse_model_uri(self.reflection_model)

        class MlflowGEPAAdapter(gepa.GEPAAdapter):
            def __init__(self, eval_function, prompts_dict):
                self.eval_function = eval_function
                self.prompts_dict = prompts_dict
                self.prompt_names = list(prompts_dict.keys())

            def evaluate(
                self,
                batch: list[dict[str, Any]],
                candidate: dict[str, str],
                capture_traces: bool = False,
            ) -> "gepa.EvaluationBatch":
                """
                Evaluate a candidate prompt using the MLflow eval function.

                Args:
                    batch: List of data instances to evaluate
                    candidate: Proposed text components (prompts)
                    capture_traces: Whether to capture execution traces

                Returns:
                    EvaluationBatch with outputs, scores, and optional trajectories
                """
                eval_results = self.eval_function(candidate, batch)

                outputs = [result.outputs for result in eval_results]
                scores = [result.score for result in eval_results]
                trajectories = eval_results if capture_traces else None

                return gepa.EvaluationBatch(
                    outputs=outputs, scores=scores, trajectories=trajectories
                )

            def make_reflective_dataset(
                self,
                candidate: dict[str, str],
                eval_batch: "gepa.EvaluationBatch[EvaluationResultRecord, Any]",
                components_to_update: list[str],
            ) -> dict[str, list[dict[str, Any]]]:
                """
                Build a reflective dataset for instruction refinement.

                Args:
                    candidate: The evaluated candidate
                    eval_batch: Result of evaluate with capture_traces=True
                    components_to_update: Component names to update

                Returns:
                    Dict of reflective dataset per component
                """
                reflective_datasets = {}

                for component_name in components_to_update:
                    component_data = []

                    trajectories = eval_batch.trajectories

                    for i, (trajectory, score) in enumerate(zip(trajectories, eval_batch.scores)):
                        trace = trajectory.trace
                        spans = []
                        if trace:
                            spans = [
                                {
                                    "name": span.name,
                                    "inputs": span.inputs,
                                    "outputs": span.outputs,
                                }
                                for span in trace.data.spans
                            ]

                        component_data.append(
                            {
                                "component_name": component_name,
                                "current_text": candidate.get(component_name, ""),
                                "trace": spans,
                                "score": score,
                                "inputs": trajectory.inputs,
                                "outputs": trajectory.outputs,
                                "expectations": trajectory.expectations,
                                "rationales": trajectory.rationales,
                                "index": i,
                            }
                        )

                    reflective_datasets[component_name] = component_data

                return reflective_datasets

        adapter = MlflowGEPAAdapter(eval_fn, target_prompts)

        kwargs = self.gepa_kwargs | {
            "seed_candidate": target_prompts,
            "trainset": train_data,
            "adapter": adapter,
            "reflection_lm": f"{provider}/{model}",
            "max_metric_calls": self.max_metric_calls,
            "display_progress_bar": self.display_progress_bar,
            "use_mlflow": enable_tracking,
        }

        if Version(importlib.metadata.version("gepa")) < Version("0.0.18"):
            kwargs.pop("use_mlflow")
        gepa_result = gepa.optimize(**kwargs)

        optimized_prompts = gepa_result.best_candidate
        initial_score, final_score = self._extract_eval_scores(gepa_result)

        return PromptOptimizerOutput(
            optimized_prompts=optimized_prompts,
            initial_eval_score=initial_score,
            final_eval_score=final_score,
        )

    def _extract_eval_scores(self, result: "gepa.GEPAResult") -> tuple[float | None, float | None]:
        """
        Extract initial and final evaluation scores from GEPA result.

        Args:
            result: GEPA optimization result

        Returns:
            Tuple of (initial_score, final_score), both can be None if unavailable
        """
        final_score = None
        initial_score = None

        scores = result.val_aggregate_scores
        if scores and len(scores) > 0:
            # The first score is the initial baseline score
            initial_score = scores[0]
            # The highest score is the final optimized score
            final_score = max(scores)

        return initial_score, final_score
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/optimize/optimizers/__init__.py

```python
from mlflow.genai.optimize.optimizers.base import BasePromptOptimizer
from mlflow.genai.optimize.optimizers.gepa_optimizer import GepaPromptOptimizer

__all__ = ["BasePromptOptimizer", "GepaPromptOptimizer"]
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/genai/prompts/utils.py

```python
import re
from typing import Any


def format_prompt(prompt: str, **values: Any) -> str:
    """Format double-curly variables in the prompt template."""
    for key, value in values.items():
        # Escape backslashes in the replacement string to prevent re.sub from interpreting
        # them as escape sequences (e.g. \u being treated as Unicode escape)
        replacement = str(value).replace("\\", "\\\\")
        prompt = re.sub(r"\{\{\s*" + key + r"\s*\}\}", replacement, prompt)
    return prompt
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/prompts/__init__.py
Signals: Pydantic

```python
import json
import warnings
from contextlib import contextmanager
from typing import Any

from pydantic import BaseModel

import mlflow.tracking._model_registry.fluent as registry_api
from mlflow.entities.model_registry.prompt import Prompt
from mlflow.entities.model_registry.prompt_version import (
    PromptModelConfig,
    PromptVersion,
)
from mlflow.prompt.constants import PROMPT_MODEL_CONFIG_TAG_KEY
from mlflow.prompt.registry_utils import PromptCache as PromptCache
from mlflow.prompt.registry_utils import require_prompt_registry
from mlflow.store.entities.paged_list import PagedList
from mlflow.tracking.client import MlflowClient
from mlflow.utils.annotations import experimental


@contextmanager
def suppress_genai_migration_warning():
    """Suppress the deprecation warning when the api is called from `mlflow.genai` namespace."""
    with warnings.catch_warnings():
        warnings.filterwarnings(
            action="ignore",
            category=FutureWarning,
            message="The `mlflow.*` API is moved to the `mlflow.genai` namespace.*",
        )
        yield


@require_prompt_registry
def register_prompt(
    name: str,
    template: str | list[dict[str, Any]],
    commit_message: str | None = None,
    tags: dict[str, str] | None = None,
    response_format: type[BaseModel] | dict[str, Any] | None = None,
    model_config: PromptModelConfig | dict[str, Any] | None = None,
) -> PromptVersion:
    """
    Register a new :py:class:`Prompt <mlflow.entities.Prompt>` in the MLflow Prompt Registry.

    A :py:class:`Prompt <mlflow.entities.Prompt>` is a pair of name and
    template content at minimum. With MLflow Prompt Registry, you can create, manage, and
    version control prompts with the MLflow's robust model tracking framework.

    If there is no registered prompt with the given name, a new prompt will be created.
    Otherwise, a new version of the existing prompt will be created.

    Args:
        name: The name of the prompt.
        template: The template content of the prompt. Can be either:

            - A string containing text with variables enclosed in double curly braces,
              e.g. {{variable}}, which will be replaced with actual values by the `format` method.
            - A list of dictionaries representing chat messages, where each message has
              'role' and 'content' keys (e.g., [{"role": "user", "content": "Hello {{name}}"}])


            .. note::

                If you want to use the prompt with a framework that uses single curly braces
                e.g. LangChain, you can use the `to_single_brace_format` method to convert the
                loaded prompt to a format that uses single curly braces.

                .. code-block:: python

                    prompt = client.load_prompt("my_prompt")
                    langchain_format = prompt.to_single_brace_format()

        commit_message: A message describing the changes made to the prompt, similar to a
            Git commit message. Optional.
        tags: A dictionary of tags associated with the **prompt version**.
            This is useful for storing version-specific information, such as the author of
            the changes. Optional.
        response_format: Optional Pydantic class or dictionary defining the expected response
            structure. This can be used to specify the schema for structured outputs from LLM calls.
        model_config: Optional PromptModelConfig instance or dictionary containing model-specific
            configuration including model name and settings like temperature, top_p, max_tokens.
            Using PromptModelConfig provides validation and type safety for common parameters.
            Example (dict): {"model_name": "gpt-4", "temperature": 0.7}
            Example (PromptModelConfig): PromptModelConfig(model_name="gpt-4", temperature=0.7)

    Returns:
        A :py:class:`Prompt <mlflow.entities.Prompt>` object that was created.

    Example:

    .. code-block:: python

        import mlflow

        # Register a text prompt
        mlflow.genai.register_prompt(
            name="greeting_prompt",
            template="Respond to the user's message as a {{style}} AI.",
        )

        # Register a chat prompt with multiple messages
        mlflow.genai.register_prompt(
            name="assistant_prompt",
            template=[
                {"role": "system", "content": "You are a helpful {{style}} assistant."},
                {"role": "user", "content": "{{question}}"},
            ],
            response_format={"type": "object", "properties": {"answer": {"type": "string"}}},
        )

        # Load and use the prompt
        prompt = mlflow.genai.load_prompt("greeting_prompt")

        # Use the prompt in your application
        import openai

        openai_client = openai.OpenAI()
        openai_client.chat.completion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt.format(style="friendly")},
                {"role": "user", "content": "Hello, how are you?"},
            ],
        )

        # Update the prompt with a new version
        prompt = mlflow.genai.register_prompt(
            name="greeting_prompt",
            template="Respond to the user's message as a {{style}} AI. {{greeting}}",
            commit_message="Add a greeting to the prompt.",
            tags={"author": "Bob"},
        )

    """
    with suppress_genai_migration_warning():
        return registry_api.register_prompt(
            name=name,
            template=template,
            commit_message=commit_message,
            tags=tags,
            response_format=response_format,
            model_config=model_config,
        )


@require_prompt_registry
def search_prompts(
    filter_string: str | None = None,
    max_results: int | None = None,
) -> PagedList[Prompt]:
    with suppress_genai_migration_warning():
        return registry_api.search_prompts(filter_string=filter_string, max_results=max_results)


@require_prompt_registry
def load_prompt(
    name_or_uri: str,
    version: str | int | None = None,
    allow_missing: bool = False,
    link_to_model: bool = True,
    model_id: str | None = None,
    cache_ttl_seconds: float | None = None,
) -> PromptVersion:
    """
    Load a :py:class:`Prompt <mlflow.entities.Prompt>` from the MLflow Prompt Registry.

    The prompt can be specified by name and version, or by URI.

    Args:
        name_or_uri: The name of the prompt, or the URI in the format "prompts:/name/version".
        version: The version of the prompt (required when using name, not allowed when using URI).
        allow_missing: If True, return None instead of raising Exception if the specified prompt
            is not found.
        link_to_model: If True, link the prompt to the model.
        model_id: The ID of the model to link the prompt to. Only used if link_to_model is True.
        cache_ttl_seconds: Time-to-live in seconds for the cached prompt. If not specified,
            uses the value from `MLFLOW_ALIAS_PROMPT_CACHE_TTL_SECONDS` environment variable for
            alias-based prompts (default 60), and the value from
            `MLFLOW_VERSION_PROMPT_CACHE_TTL_SECONDS` environment variable for version-based prompts
            (default None, no TTL).
            Set to 0 to bypass the cache and always fetch from the server.

    Example:

    .. code-block:: python

        import mlflow

        # Load the latest version of the prompt
        prompt = mlflow.genai.load_prompt("my_prompt")

        # Load a specific version of the prompt
        prompt = mlflow.genai.load_prompt("my_prompt", version=1)

        # Load a specific version of the prompt by URI
        prompt = mlflow.genai.load_prompt("prompts:/my_prompt/1")

        # Load a prompt version with an alias "production"
        prompt = mlflow.genai.load_prompt("prompts:/my_prompt@production")

        # Load the latest version of the prompt by URI
        prompt = mlflow.genai.load_prompt("prompts:/my_prompt@latest")

        # Load with custom cache TTL (5 minutes)
        prompt = mlflow.genai.load_prompt("my_prompt", version=1, cache_ttl_seconds=300)

        # Bypass cache entirely
        prompt = mlflow.genai.load_prompt("my_prompt", version=1, cache_ttl_seconds=0)
    """
    with suppress_genai_migration_warning():
        return registry_api.load_prompt(
            name_or_uri=name_or_uri,
            version=version,
            allow_missing=allow_missing,
            link_to_model=link_to_model,
            model_id=model_id,
            cache_ttl_seconds=cache_ttl_seconds,
        )


@require_prompt_registry
def set_prompt_alias(name: str, alias: str, version: int) -> None:
    """
    Set an alias for a :py:class:`Prompt <mlflow.entities.Prompt>` in the MLflow Prompt Registry.

    Args:
        name: The name of the prompt.
        alias: The alias to set for the prompt.
        version: The version of the prompt.

    Example:

    .. code-block:: python

        import mlflow

        # Set an alias for the prompt
        mlflow.genai.set_prompt_alias(name="my_prompt", version=1, alias="production")

        # Load the prompt by alias (use "@" to specify the alias)
        prompt = mlflow.genai.load_prompt("prompts:/my_prompt@production")

        # Switch the alias to a new version of the prompt
        mlflow.genai.set_prompt_alias(name="my_prompt", version=2, alias="production")

        # Delete the alias
        mlflow.genai.delete_prompt_alias(name="my_prompt", alias="production")
    """
    with suppress_genai_migration_warning():
        return registry_api.set_prompt_alias(name=name, version=version, alias=alias)


@require_prompt_registry
def delete_prompt_alias(name: str, alias: str) -> None:
    """
    Delete an alias for a :py:class:`Prompt <mlflow.entities.Prompt>` in the MLflow Prompt Registry.

    Args:
        name: The name of the prompt.
        alias: The alias to delete for the prompt.
    """
    with suppress_genai_migration_warning():
        return registry_api.delete_prompt_alias(name=name, alias=alias)


@experimental(version="3.5.0")
@require_prompt_registry
def get_prompt_tags(name: str) -> Prompt:
    """Get a prompt's metadata from the MLflow Prompt Registry.

    Args:
        name: The name of the prompt.
    """
    with suppress_genai_migration_warning():
        return MlflowClient().get_prompt(name=name).tags


@experimental(version="3.5.0")
@require_prompt_registry
def set_prompt_tag(name: str, key: str, value: str) -> None:
    """Set a tag on a prompt in the MLflow Prompt Registry.

    Args:
        name: The name of the prompt.
        key: The key of the tag
        value: The value of the tag for the key
    """
    with suppress_genai_migration_warning():
        MlflowClient().set_prompt_tag(name=name, key=key, value=value)


@experimental(version="3.5.0")
@require_prompt_registry
def delete_prompt_tag(name: str, key: str) -> None:
    """Delete a tag from a prompt in the MLflow Prompt Registry.

    Args:
        name: The name of the prompt.
        key: The key of the tag
    """
    with suppress_genai_migration_warning():
        MlflowClient().delete_prompt_tag(name=name, key=key)


@experimental(version="3.5.0")
@require_prompt_registry
def set_prompt_version_tag(name: str, version: str | int, key: str, value: str) -> None:
    """Set a tag on a prompt version in the MLflow Prompt Registry.

    Args:
        name: The name of the prompt.
        version: The version of the prompt.
        key: The key of the tag
        value: The value of the tag for the key
    """
    with suppress_genai_migration_warning():
        MlflowClient().set_prompt_version_tag(name=name, version=version, key=key, value=value)


@experimental(version="3.5.0")
@require_prompt_registry
def delete_prompt_version_tag(name: str, version: str | int, key: str) -> None:
    """Delete a tag from a prompt version in the MLflow Prompt Registry.

    Args:
        name: The name of the prompt.
        version: The version of the prompt.
        key: The key of the tag
    """
    with suppress_genai_migration_warning():
        MlflowClient().delete_prompt_version_tag(name=name, version=version, key=key)


@experimental(version="3.8.0")
@require_prompt_registry
def set_prompt_model_config(
    name: str,
    version: str | int,
    model_config: PromptModelConfig | dict[str, Any],
) -> None:
    """Set or update the model configuration for a specific prompt version.

    Model configuration includes model-specific settings such as model name, temperature,
    max_tokens, and other inference parameters. Unlike the prompt template, model configuration
    is mutable and can be updated after a prompt version is created.

    Args:
        name: The name of the prompt.
        version: The version of the prompt.
        model_config: A PromptModelConfig or dict with model settings like model_name, temperature.

    Example:

    .. code-block:: python

        import mlflow
        from mlflow.entities.model_registry import PromptModelConfig

        # Set model config using a dictionary
        mlflow.genai.set_prompt_model_config(
            name="my-prompt",
            version=1,
            model_config={"model_name": "gpt-4", "temperature": 0.7, "max_tokens": 1000},
        )

        # Set model config using PromptModelConfig for validation
        config = PromptModelConfig(
            model_name="gpt-4-turbo",
            temperature=0.5,
            max_tokens=2000,
            top_p=0.95,
        )
        mlflow.genai.set_prompt_model_config(
            name="my-prompt",
            version=1,
            model_config=config,
        )

        # Load and verify the config was set
        prompt = mlflow.genai.load_prompt("my-prompt", version=1)
        print(prompt.model_config)
    """
    if isinstance(model_config, PromptModelConfig):
        config_dict = model_config.to_dict()
    else:
        config_dict = PromptModelConfig.from_dict(model_config).to_dict()

    config_json = json.dumps(config_dict)

    with suppress_genai_migration_warning():
        MlflowClient().set_prompt_version_tag(
            name=name, version=version, key=PROMPT_MODEL_CONFIG_TAG_KEY, value=config_json
        )


@experimental(version="3.8.0")
@require_prompt_registry
def delete_prompt_model_config(name: str, version: str | int) -> None:
    """Delete the model configuration from a specific prompt version.

    Args:
        name: The name of the prompt.
        version: The version of the prompt.

    Example:

    .. code-block:: python

        import mlflow

        # Remove model config from a prompt version
        mlflow.genai.delete_prompt_model_config(name="my-prompt", version=1)

        # Verify the config was removed
        prompt = mlflow.genai.load_prompt("my-prompt", version=1)
        assert prompt.model_config is None
    """
    with suppress_genai_migration_warning():
        MlflowClient().delete_prompt_version_tag(
            name=name, version=version, key=PROMPT_MODEL_CONFIG_TAG_KEY
        )
```

--------------------------------------------------------------------------------

````
