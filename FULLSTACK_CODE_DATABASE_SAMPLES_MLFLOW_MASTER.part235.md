---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 235
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 235 of 991)

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

---[FILE: genai_eval_utils.py]---
Location: mlflow-master/mlflow/cli/genai_eval_utils.py

```python
"""
Utility functions for trace evaluation output formatting.
"""

from dataclasses import dataclass
from typing import Any

import click
import pandas as pd

from mlflow.exceptions import MlflowException
from mlflow.genai.scorers import Scorer, get_all_scorers, get_scorer
from mlflow.tracing.constant import AssessmentMetadataKey

# Represents the absence of a value for an assessment
NA_VALUE = "N/A"


@dataclass
class Assessment:
    """
    Structured assessment data for a trace evaluation.
    """

    name: str | None
    """The name of the assessment"""

    result: Any | None = None
    """The result value from the assessment"""

    rationale: str | None = None
    """The rationale text explaining the assessment"""

    error: str | None = None
    """Error message if the assessment failed"""


@dataclass
class Cell:
    """
    Structured cell data for table display with metadata.
    """

    value: str
    """The formatted display value for the cell"""

    assessment: Assessment | None = None
    """The assessment data for this cell, if it represents an assessment"""


@dataclass
class EvalResult:
    """
    Container for evaluation results for a single trace.

    This dataclass provides structured access to trace evaluation data,
    replacing dict-based access for better type safety.
    """

    trace_id: str
    """The trace ID"""

    assessments: list[Assessment]
    """List of Assessment objects for this trace"""


@dataclass
class TableOutput:
    """Container for formatted table data."""

    headers: list[str]
    rows: list[list[Cell]]


def _format_assessment_cell(assessment: Assessment | None) -> Cell:
    """
    Format a single assessment cell for table display.

    Args:
        assessment: Assessment object with result, rationale, and error fields

    Returns:
        Cell object with formatted value and assessment metadata
    """
    if not assessment:
        return Cell(value=NA_VALUE)

    if assessment.error:
        display_value = f"error: {assessment.error}"
    elif assessment.result is not None and assessment.rationale:
        display_value = f"value: {assessment.result}, rationale: {assessment.rationale}"
    elif assessment.result is not None:
        display_value = f"value: {assessment.result}"
    elif assessment.rationale:
        display_value = f"rationale: {assessment.rationale}"
    else:
        display_value = NA_VALUE

    return Cell(value=display_value, assessment=assessment)


def resolve_scorers(scorer_names: list[str], experiment_id: str) -> list[Scorer]:
    """
    Resolve scorer names to scorer objects.

    Checks built-in scorers first, then registered scorers.
    Supports both class names (e.g., "RelevanceToQuery") and snake_case
    scorer names (e.g., "relevance_to_query").

    Args:
        scorer_names: List of scorer names to resolve
        experiment_id: Experiment ID for looking up registered scorers

    Returns:
        List of resolved scorer objects

    Raises:
        click.UsageError: If a scorer is not found or no valid scorers specified
    """
    resolved_scorers = []
    builtin_scorers = get_all_scorers()
    # Build map with both class name and snake_case name for lookup
    builtin_scorer_map = {}
    for scorer in builtin_scorers:
        # Map by class name (e.g., "RelevanceToQuery")
        builtin_scorer_map[scorer.__class__.__name__] = scorer
        # Map by scorer.name (snake_case, e.g., "relevance_to_query")
        if scorer.name is not None:
            builtin_scorer_map[scorer.name] = scorer

    for scorer_name in scorer_names:
        if scorer_name in builtin_scorer_map:
            resolved_scorers.append(builtin_scorer_map[scorer_name])
        else:
            # Try to get it as a registered scorer
            try:
                registered_scorer = get_scorer(name=scorer_name, experiment_id=experiment_id)
                resolved_scorers.append(registered_scorer)
            except MlflowException as e:
                error_message = str(e)
                if "not found" in error_message.lower():
                    available_builtin = ", ".join(
                        sorted({scorer.__class__.__name__ for scorer in builtin_scorers})
                    )
                    raise click.UsageError(
                        f"Could not identify Scorer '{scorer_name}'. "
                        f"Only built-in or registered scorers can be resolved. "
                        f"Available built-in scorers: {available_builtin}. "
                        f"To use a custom scorer, register it first in experiment {experiment_id} "
                        f"using the register_scorer() API."
                    )
                else:
                    raise click.UsageError(
                        f"An error occurred when retrieving information for Scorer "
                        f"`{scorer_name}`: {error_message}"
                    )

    if not resolved_scorers:
        raise click.UsageError("No valid scorers specified")

    return resolved_scorers


def extract_assessments_from_results(
    results_df: pd.DataFrame, evaluation_run_id: str
) -> list[EvalResult]:
    """
    Extract assessments from evaluation results DataFrame.

    The evaluate() function returns results with a DataFrame that contains
    an 'assessments' column. Each row has a list of assessment dictionaries
    with metadata including AssessmentMetadataKey.SOURCE_RUN_ID that we use to
    filter assessments from this specific evaluation run.

    Args:
        results_df: DataFrame from evaluate() results containing assessments column
        evaluation_run_id: The MLflow run ID from the evaluation that generated the assessments

    Returns:
        List of EvalResult objects with trace_id and assessments
    """
    output_data = []

    for _, row in results_df.iterrows():
        trace_id = row.get("trace_id", "unknown")
        assessments_list = []

        for assessment_dict in row.get("assessments", []):
            # Only consider assessments from the evaluation run
            metadata = assessment_dict.get("metadata", {})
            source_run_id = metadata.get(AssessmentMetadataKey.SOURCE_RUN_ID)

            if source_run_id != evaluation_run_id:
                continue

            assessment_name = assessment_dict.get("assessment_name")
            assessment_result = None
            assessment_rationale = None
            assessment_error = None

            if (feedback := assessment_dict.get("feedback")) and isinstance(feedback, dict):
                assessment_result = feedback.get("value")

            if rationale := assessment_dict.get("rationale"):
                assessment_rationale = rationale

            if error := assessment_dict.get("error"):
                assessment_error = str(error)

            assessments_list.append(
                Assessment(
                    name=assessment_name,
                    result=assessment_result,
                    rationale=assessment_rationale,
                    error=assessment_error,
                )
            )

        # If no assessments were found for this trace, add error markers
        if not assessments_list:
            assessments_list.append(
                Assessment(
                    name=NA_VALUE,
                    result=None,
                    rationale=None,
                    error="No assessments found on trace",
                )
            )

        output_data.append(EvalResult(trace_id=trace_id, assessments=assessments_list))

    return output_data


def format_table_output(output_data: list[EvalResult]) -> TableOutput:
    """
    Format evaluation results as table data.

    Args:
        output_data: List of EvalResult objects with assessments

    Returns:
        TableOutput dataclass containing headers and rows
    """
    # Extract unique assessment names from output_data to use as column headers
    # Note: assessment name can be None, so we filter it out
    assessment_names_set = set()
    for trace_result in output_data:
        for assessment in trace_result.assessments:
            if assessment.name and assessment.name != NA_VALUE:
                assessment_names_set.add(assessment.name)

    # Sort for consistent ordering
    assessment_names = sorted(assessment_names_set)

    headers = ["trace_id"] + assessment_names
    table_data = []

    for trace_result in output_data:
        # Create Cell for trace_id column
        row = [Cell(value=trace_result.trace_id)]

        # Build a map of assessment name -> assessment for this trace
        assessment_map = {
            assessment.name: assessment
            for assessment in trace_result.assessments
            if assessment.name and assessment.name != NA_VALUE
        }

        # For each assessment name in headers, get the corresponding assessment
        for assessment_name in assessment_names:
            cell_content = _format_assessment_cell(assessment_map.get(assessment_name))
            row.append(cell_content)

        table_data.append(row)

    return TableOutput(headers=headers, rows=table_data)
```

--------------------------------------------------------------------------------

---[FILE: scorers.py]---
Location: mlflow-master/mlflow/cli/scorers.py

```python
import json
from typing import Literal

import click

from mlflow.environment_variables import MLFLOW_EXPERIMENT_ID
from mlflow.genai.judges import make_judge
from mlflow.genai.scorers import get_all_scorers
from mlflow.genai.scorers import list_scorers as list_scorers_api
from mlflow.utils.string_utils import _create_table


@click.group("scorers")
def commands():
    """
    Manage scorers, including LLM judges. To manage scorers associated with a tracking
    server, set the MLFLOW_TRACKING_URI environment variable to the URL of the desired server.
    """


@commands.command("list")
@click.option(
    "--experiment-id",
    "-x",
    envvar=MLFLOW_EXPERIMENT_ID.name,
    type=click.STRING,
    required=False,
    help="Experiment ID for which to list scorers. Can be set via MLFLOW_EXPERIMENT_ID env var.",
)
@click.option(
    "--builtin",
    "-b",
    is_flag=True,
    default=False,
    help="List built-in scorers instead of registered scorers for an experiment.",
)
@click.option(
    "--output",
    type=click.Choice(["table", "json"]),
    default="table",
    help="Output format: 'table' for formatted table (default) or 'json' for JSON format",
)
def list_scorers(
    experiment_id: str | None, builtin: bool, output: Literal["table", "json"]
) -> None:
    """
    List registered scorers for an experiment, or list all built-in scorers.

    \b
    Examples:

    .. code-block:: bash

        # List built-in scorers (table format)
        mlflow scorers list --builtin
        mlflow scorers list -b

        # List built-in scorers (JSON format)
        mlflow scorers list --builtin --output json

        # List registered scorers in table format (default)
        mlflow scorers list --experiment-id 123

        # List registered scorers in JSON format
        mlflow scorers list --experiment-id 123 --output json

        # Using environment variable for experiment ID
        export MLFLOW_EXPERIMENT_ID=123
        mlflow scorers list
    """
    # Validate mutual exclusivity
    if builtin and experiment_id:
        raise click.UsageError(
            "Cannot specify both --builtin and --experiment-id. "
            "Use --builtin to list built-in scorers or --experiment-id to list "
            "registered scorers for an experiment."
        )

    if not builtin and not experiment_id:
        raise click.UsageError(
            "Must specify either --builtin or --experiment-id. "
            "Use --builtin to list built-in scorers or --experiment-id to list "
            "registered scorers for an experiment."
        )

    # Get scorers based on mode
    scorers = get_all_scorers() if builtin else list_scorers_api(experiment_id=experiment_id)

    # Format scorer data for output
    scorer_data = [{"name": scorer.name, "description": scorer.description} for scorer in scorers]

    if output == "json":
        result = {"scorers": scorer_data}
        click.echo(json.dumps(result, indent=2))
    else:
        # Table output format
        table = [[s["name"], s["description"] or ""] for s in scorer_data]
        click.echo(_create_table(table, headers=["Scorer Name", "Description"]))


@commands.command("register-llm-judge")
@click.option(
    "--name",
    "-n",
    type=click.STRING,
    required=True,
    help="Name for the judge scorer",
)
@click.option(
    "--instructions",
    "-i",
    type=click.STRING,
    required=True,
    help=(
        "Instructions for evaluation. Must contain at least one template variable: "
        "``{{ inputs }}``, ``{{ outputs }}``, ``{{ expectations }}``, or ``{{ trace }}``. "
        "See the make_judge documentation for variable interpretations."
    ),
)
@click.option(
    "--model",
    "-m",
    type=click.STRING,
    required=False,
    help=(
        "Model identifier to use for evaluation (e.g., ``openai:/gpt-4``). "
        "If not provided, uses the default model."
    ),
)
@click.option(
    "--experiment-id",
    "-x",
    envvar=MLFLOW_EXPERIMENT_ID.name,
    type=click.STRING,
    required=True,
    help="Experiment ID to register the judge in. Can be set via MLFLOW_EXPERIMENT_ID env var.",
)
@click.option(
    "--description",
    "-d",
    type=click.STRING,
    required=False,
    help="Description of what the judge evaluates.",
)
def register_llm_judge(
    name: str, instructions: str, model: str | None, experiment_id: str, description: str | None
) -> None:
    """
    Register an LLM judge scorer in the specified experiment.

    This command creates an LLM judge using natural language instructions and registers
    it in an experiment for use in evaluation workflows. The instructions must contain at
    least one template variable (``{{ inputs }}``, ``{{ outputs }}``, ``{{ expectations }}``,
    or ``{{ trace }}``) to define what the judge will evaluate.

    \b
    Examples:

    .. code-block:: bash

        # Register a basic quality judge
        mlflow scorers register-llm-judge -n quality_judge \\
            -i "Evaluate if {{ outputs }} answers {{ inputs }}. Return yes or no." -x 123

        # Register a judge with custom model
        mlflow scorers register-llm-judge -n custom_judge \\
            -i "Check whether {{ outputs }} is professional and formal. Rate pass, fail, or na" \\
            -m "openai:/gpt-4" -x 123

        # Register a judge with description
        mlflow scorers register-llm-judge -n quality_judge \\
            -i "Evaluate if {{ outputs }} answers {{ inputs }}. Return yes or no." \\
            -d "Evaluates response quality and relevance" -x 123

        # Using environment variable
        export MLFLOW_EXPERIMENT_ID=123
        mlflow scorers register-llm-judge -n my_judge \\
            -i "Check whether {{ outputs }} contains PII"
    """
    judge = make_judge(
        name=name,
        instructions=instructions,
        model=model,
        description=description,
        feedback_value_type=str,
    )
    registered_judge = judge.register(experiment_id=experiment_id)
    click.echo(
        f"Successfully created and registered judge scorer '{registered_judge.name}' "
        f"in experiment {experiment_id}"
    )
```

--------------------------------------------------------------------------------

````
