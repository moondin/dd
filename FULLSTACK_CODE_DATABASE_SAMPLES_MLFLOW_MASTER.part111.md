---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 111
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 111 of 991)

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

---[FILE: optimizer.mdx]---
Location: mlflow-master/docs/docs/genai/flavors/dspy/optimizer.mdx

```text
import { APILink } from "@site/src/components/APILink";
import { Table } from "@site/src/components/Table";

# DSPy Optimizer Autologging

A [DSPy optimizer](https://dspy.ai/learn/optimization/optimizers/) is an algorithm that tunes the parameters of a DSPy program (i.e., the prompts and/or the LM weights) to maximize the metrics you specify.
However, optimizers have the following challenges due to its black box nature:

1. **Parameters and Score of individual trial**: Program parameters (e.g. proposed instructions and selected demonstrations) and performance of each trial during optimization are not saved.
2. **Intermediate Artifacts**: Prompts and model responses for the intermediate programs are not available. While some of them are printed out, there is no easy way to store the information in a structured manner.
3. **Optimization Trajectory**: It is hard to understand the overview of the optimization trajectory from log texts (e.g. score progress over time).

The MLflow DSPy flavor provides a convenient way to automatically track the optimization process and results. This allows you to analyze the optimization process and results more efficiently.

## Enable Autologging

To enable autologging for DSPy optimization, call <APILink fn="mlflow.dspy.autolog" /> at the beginning of your script or notebook with the following parameters. This will automatically log traces for your program execution as well as other metrics and artifacts such as program states, train datasets, and evaluation results depending on the configuration.
Note that the optimizer autologging feature is available since MLflow `2.21.1`.

```python
import mlflow

mlflow.dspy.autolog(log_compiles=True, log_evals=True, log_traces_from_compile=True)

# Your DSPy code here
...
```

<Table>
    <thead>
        <tr>
            <th>Target</th>
            <th>Default</th>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Traces</td>
            <td>`true`</td>
            <td>`log_traces`</td>
            <td>Whether to generate and log traces for the program. See [MLflow Tracing](/genai/tracing) for more details about tracing feature.</td>
        </tr>
        <tr>
            <td>Traces during Optimization</td>
            <td>`false`</td>
            <td>`log_traces_from_compile`</td>
            <td>MLflow does not generate traces for program calls during optimization by default. Set `True` to see traces for programs calls during optimization.</td>
        </tr>
        <tr>
            <td>Traces during Evaluation</td>
            <td>`True`</td>
            <td>`log_traces_from_eval`</td>
            <td>If set `True`, MLflow generates traces for program calls during evaluation.</td>
        </tr>
        <tr>
            <td>Optimization</td>
            <td>`false`</td>
            <td>`log_compiles`</td>
            <td>If set to `True`, a MLflow run is created for each `Teleprompter.compile` call, and metrics and artifacts for the optimization are logged.</td>
        </tr>
        <tr>
            <td>Evaluation</td>
            <td>`false`</td>
            <td>`log_evals`</td>
            <td>If set to `True`, a MLflow run is created for each `Evaluate.__call__` call, and metrics and artifacts for the evaluation are logged.</td>
        </tr>
    </tbody>
</Table>

## Example Code of DSPy Optimizer Autologging

```python
import dspy
from dspy.datasets.gsm8k import GSM8K, gsm8k_metric
import mlflow

# Enabling tracing for DSPy
mlflow.dspy.autolog(log_compiles=True, log_evals=True, log_traces_from_compile=True)

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("DSPy")

lm = dspy.LM(model="openai/gpt-3.5-turbo", max_tokens=250)
dspy.configure(lm=lm)

gsm8k = GSM8K()

trainset = gsm8k.train
devset = gsm8k.dev[:50]

program = dspy.ChainOfThought("question -> answer")

# define a teleprompter
teleprompter = dspy.teleprompt.MIPROv2(
    metric=gsm8k_metric,
    auto="light",
)
# run the optimizer
optimized_program = teleprompter.compile(
    program,
    trainset=trainset,
    max_bootstrapped_demos=3,
    max_labeled_demos=4,
    requires_permission_to_run=False,
)
```

## What Gets Logged?

MLflow optimizer autologging logs the following information:

- **Optimizer Parameters**: The hyper parameters of the optimizer (e.g. number of demonstrates).
- **Optimized Program**: MLflow automatically saves the states of the optimized program as a json artifact.
- **Datasets**: The train and evaluation datasets used in the optimization.
- **Overall Progression of Metric**: The progression of the metric over time is captured as step-wise metrics of a compile run.
- **Intermediate Program States and Metric**: The states of the program and the performance metric at each evaluation are captured in an evaluation run.
- **Traces**: The traces of each intermediate program are captured in an evaluation run.

When both `log_compiles` and `log_evals` are set to `True`, MLflow creates a run for `Teleprompter.compile` with child runs for `Evaluate.__call__` calls.
In the MLflow UI, they are displayed hierarchically as shown below:

<img src="https://i.imgur.com/eD0lA6V.png" alt="Experiment Page" width="700px"/>

In the run page for the parent run (compile call), the optimizer parameters are displayed as run parameters. The progression of program performance is displayed as model metrics and the datasets used in the optimization are displayed as artifacts.
When there are multiple type of evaluation calls (e.g. full dataset evaluation and mini-batch evaluation), the evaluation results are logged separately.

<img src="https://i.imgur.com/lXKINPQ.png" alt="Parent Run" width="1000px"/>

In the run page for the child run (evaluation call), the intermediate program states are displayed as run parameters, the performance metric are displayed as model metrics and the traces of the program are available in the trace tab.

<img src="https://i.imgur.com/XAC9hND.png" alt="Child Run" width="800px"/>

## FAQ

### How to log my optimization and evaluation into a same run?

To log both optimization and evaluation into a same run, you can manually create a parent run using `mlflow.start_run` and run your optimization and evaluation within the run.

```python
with mlflow.start_run(run_name="My Optimization Run") as run:
    optimized_program = teleprompter.compile(
        program,
        trainset=trainset,
    )
    evaluation = dspy.Evaluate(devset=devset, metric=metric)
    evaluation(optimized_program)
```
```

--------------------------------------------------------------------------------

---[FILE: dspy_quickstart.ipynb]---
Location: mlflow-master/docs/docs/genai/flavors/dspy/notebooks/dspy_quickstart.ipynb

```text
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "fa602d14-6372-4e0a-92d8-6f7db048c3b8",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "# DSPy Quickstart\n",
    "\n",
    "[DSPy](https://dspy-docs.vercel.app/) simplifies building language model (LM) pipelines by replacing manual prompt engineering with structured \"text transformation graphs.\" These graphs use flexible, learning modules that automate and optimize LM tasks like reasoning, retrieval, and answering complex questions. \n",
    "\n",
    "## How does it work?\n",
    "At a high level, DSPy optimizes prompts, selects the best language model, and can even fine-tune the model using training data.\n",
    "\n",
    "The process follows these three steps, common to most DSPy [optimizers](https://dspy.ai/learn/optimization/optimizers/):\n",
    "\n",
    "1. **Candidate Generation**: DSPy finds all `Predict` modules in the program and generates variations of instructions and demonstrations (e.g., examples for prompts). This step creates a set of possible candidates for the next stage.\n",
    "2. **Parameter Optimization**: DSPy then uses methods like random search, TPE, or Optuna to select the best candidate. Fine-tuning models can also be done at this stage.\n",
    "\n",
    "## This Demo\n",
    "Below we create a simple program that demonstrates the power of DSPy. We will build a text classifier leveraging OpenAI. By the end of this tutorial, we will...\n",
    "\n",
    "1. Define a [dspy.Signature](https://dspy.ai/learn/programming/signatures/) and [dspy.Module](https://dspy.ai/learn/programming/modules/) to perform text classification.\n",
    "2. Leverage [dspy.SIMBA](https://dspy.ai/api/optimizers/SIMBA/) to compile our module so it's better at classifying our text.\n",
    "3. Analyze internal steps with MLflow Tracing.\n",
    "3. Log the compiled model with MLflow.\n",
    "4. Load the logged model and perform inference."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "58918566-6e93-4a2e-9a34-b0f56378885a",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "%pip install -U datasets openai \"dspy>=3.0.3\" \"mlflow>=3.4.0\""
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "7bd9e460-4c9c-4508-8801-6f29fcf2c8d2",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "## Setup\n"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "c27ec364-1195-447d-a9d5-f38defa6652e",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "### Set Up LLM\n",
    "\n",
    "After installing the relevant dependencies, let's set up access to an OpenAI LLM. Here, will leverage OpenAI's `gpt-4o-mini` model."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Set OpenAI API Key to the environment variable. You can also pass the token to dspy.LM()\n",
    "import getpass\n",
    "import os\n",
    "\n",
    "os.environ[\"OPENAI_API_KEY\"] = getpass.getpass(\"Enter your OpenAI Key:\")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "3232fb03-f4be-490f-9179-0f2b71129196",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "import dspy\n",
    "\n",
    "# Define your model. We will use OpenAI for simplicity\n",
    "model_name = \"gpt-4o-mini\"\n",
    "\n",
    "# Note that an OPENAI_API_KEY environment must be present. You can also pass the token to dspy.LM()\n",
    "lm = dspy.LM(\n",
    "    model=f\"openai/{model_name}\",\n",
    "    max_tokens=500,\n",
    "    temperature=0.1,\n",
    ")\n",
    "dspy.settings.configure(lm=lm)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Create MLflow Experiment\n",
    "\n",
    "Create a new MLflow Experiment to track your DSPy models, metrics, parameters, and traces in one place. Although there is already a \"default\" experiment created in your workspace, it is highly recommended to create one for different tasks to organize experiment artifacts.\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "import mlflow\n",
    "\n",
    "mlflow.set_experiment(\"DSPy Quickstart\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Turn on Auto Tracing with MLflow\n",
    "\n",
    "[MLflow Tracing](https://mlflow.org/docs/latest/llms/tracing/index.html) is a powerful observability tool for monitoring and debugging what happens inside your DSPy modules, helping you identify potential bottlenecks or issues quickly. To enable DSPy tracing, you just need to call `mlflow.dspy.autolog` and that's it!"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 7,
   "metadata": {},
   "outputs": [],
   "source": [
    "mlflow.dspy.autolog()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "e3fde40f-650a-4090-9791-120dd954cd36",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "### Set Up Data\n",
    "\n",
    "Next, we will download the [Reuters 21578](https://huggingface.co/datasets/yangwang825/reuters-21578) dataset from Huggingface. We also write a utility to ensure that our train/test split has the same labels."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 25,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "dd53a405-1685-4e2f-86c5-8f3f570828c1",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "24 8\n",
      "Train labels: {'interest', 'earn', 'money-fx', 'trade', 'ship', 'grain', 'acq', 'crude'}\n",
      "Example({'text': 'bankamerica bacp raises prime rate to pct bankamerica corp following moves by other major banks said it has raised its prime rate to pct from pct effective today reuter', 'label': 'interest'}) (input_keys={'text'})\n"
     ]
    }
   ],
   "source": [
    "import numpy as np\n",
    "import pandas as pd\n",
    "from datasets import load_dataset\n",
    "from dspy.datasets.dataset import Dataset\n",
    "\n",
    "\n",
    "def read_data_and_subset_to_categories() -> tuple[pd.DataFrame]:\n",
    "    \"\"\"\n",
    "    Read the reuters-21578 dataset. Docs can be found in the url below:\n",
    "    https://huggingface.co/datasets/yangwang825/reuters-21578\n",
    "    \"\"\"\n",
    "\n",
    "    # Read train/test split\n",
    "    dataset = load_dataset(\"yangwang825/reuters-21578\")\n",
    "    train = pd.DataFrame(dataset[\"train\"])\n",
    "    test = pd.DataFrame(dataset[\"test\"])\n",
    "\n",
    "    # Clean the labels\n",
    "    label_map = {\n",
    "        0: \"acq\",\n",
    "        1: \"crude\",\n",
    "        2: \"earn\",\n",
    "        3: \"grain\",\n",
    "        4: \"interest\",\n",
    "        5: \"money-fx\",\n",
    "        6: \"ship\",\n",
    "        7: \"trade\",\n",
    "    }\n",
    "\n",
    "    train[\"label\"] = train[\"label\"].map(label_map)\n",
    "    test[\"label\"] = test[\"label\"].map(label_map)\n",
    "\n",
    "    return train, test\n",
    "\n",
    "\n",
    "class CSVDataset(Dataset):\n",
    "    def __init__(\n",
    "        self, n_train_per_label: int = 20, n_test_per_label: int = 10, *args, **kwargs\n",
    "    ) -> None:\n",
    "        super().__init__(*args, **kwargs)\n",
    "        self.n_train_per_label = n_train_per_label\n",
    "        self.n_test_per_label = n_test_per_label\n",
    "\n",
    "        self._create_train_test_split_and_ensure_labels()\n",
    "\n",
    "    def _create_train_test_split_and_ensure_labels(self) -> None:\n",
    "        \"\"\"Perform a train/test split that ensure labels in `dev` are also in `train`.\"\"\"\n",
    "        # Read the data\n",
    "        train_df, test_df = read_data_and_subset_to_categories()\n",
    "\n",
    "        # Sample for each label\n",
    "        train_samples_df = pd.concat(\n",
    "            [group.sample(n=self.n_train_per_label) for _, group in train_df.groupby(\"label\")]\n",
    "        )\n",
    "        test_samples_df = pd.concat(\n",
    "            [group.sample(n=self.n_test_per_label) for _, group in test_df.groupby(\"label\")]\n",
    "        )\n",
    "\n",
    "        # Set DSPy class variables\n",
    "        self._train = train_samples_df.to_dict(orient=\"records\")\n",
    "        self._dev = test_samples_df.to_dict(orient=\"records\")\n",
    "\n",
    "\n",
    "# Limit to a small dataset to showcase the value of bootstrapping\n",
    "dataset = CSVDataset(n_train_per_label=3, n_test_per_label=1)\n",
    "\n",
    "# Create train and test sets containing DSPy\n",
    "# Note that we must specify the expected input value name\n",
    "train_dataset = [example.with_inputs(\"text\") for example in dataset.train]\n",
    "test_dataset = [example.with_inputs(\"text\") for example in dataset.dev]\n",
    "unique_train_labels = {example.label for example in dataset.train}\n",
    "\n",
    "print(len(train_dataset), len(test_dataset))\n",
    "print(f\"Train labels: {unique_train_labels}\")\n",
    "print(train_dataset[0])"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "4a683b83-6acc-4fdf-846f-bd81cadda53b",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "### Set up DSPy Signature and Module\n",
    "\n",
    "Finally, we will define our task: text classification.\n",
    "\n",
    "There are a variety of ways you can provide guidelines to DSPy signature behavior. Currently, DSPy allows users to specify:\n",
    "\n",
    "1. A high-level goal via the class docstring.\n",
    "2. A set of input fields, with optional metadata.\n",
    "3. A set of output fields with optional metadata.\n",
    "\n",
    "DSPy will then leverage this information to inform optimization. \n",
    "\n",
    "In the below example, note that we simply provide the expected labels to `output` field in the `TextClassificationSignature` class. From this initial state, we'll look to use DSPy to learn to improve our classifier accuracy."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 10,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "d0743c63-c679-4114-b7b1-bed4aeb918cd",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "class TextClassificationSignature(dspy.Signature):\n",
    "    text = dspy.InputField()\n",
    "    label = dspy.OutputField(\n",
    "        desc=f\"Label of predicted class. Possible labels are {unique_train_labels}\"\n",
    "    )\n",
    "\n",
    "\n",
    "class TextClassifier(dspy.Module):\n",
    "    def __init__(self):\n",
    "        super().__init__()\n",
    "        self.generate_classification = dspy.Predict(TextClassificationSignature)\n",
    "\n",
    "    def forward(self, text: str):\n",
    "        return self.generate_classification(text=text)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "0d93df5c-25d7-460d-a803-0e5469f3bbad",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "## Run it!"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "c89741fa-2698-4409-b290-f5f5652f7d66",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "### Hello World\n",
    "Let's demonstrate predicting via the DSPy module and associated signature. The program has correctly learned our labels from the signature `desc` field and generates reasonable predictions."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 21,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "d4da1ad9-7173-4d1b-ab53-346e9c49fbbf",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Prediction(\n",
      "    label='interest'\n",
      ")\n",
      "Prediction(\n",
      "    label='interest'\n",
      ")\n"
     ]
    }
   ],
   "source": [
    "# Initilize our impact_improvement class\n",
    "text_classifier = TextClassifier()\n",
    "\n",
    "message = \"I am interested in space\"\n",
    "print(text_classifier(text=message))\n",
    "\n",
    "message = \"I enjoy ice skating\"\n",
    "print(text_classifier(text=message))"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Review Traces\n",
    "\n",
    "1. Open the MLflow UI and select the `\"DSPy Quickstart\"` experiment.\n",
    "2. Go to the `\"Traces\"` tab to view the generated traces.\n",
    "\n",
    "Now, you can observe how DSPy translates your query and interacts with the LLM. This feature is extremely valuable for debugging, iteratively refining components within your system, and monitoring models in production. While the module in this tutorial is relatively simple, the tracing feature becomes even more powerful as your model grows in complexity.\n",
    "\n",
    "![MLflow DSPy Trace](/images/llms/dspy/dspy-trace.png)\n"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "b064a99e-027a-4854-873b-5347d901de46",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "## Compilation\n",
    "\n"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "5a82d466-40f7-411a-a029-dcadb4629391",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "### Training\n",
    "\n",
    "To train, we will leverage [SIMBA](https://dspy.ai/api/optimizers/SIMBA/), an optimizer that will take bootstrap samples from our training set and leverage a random search strategy to optimize our predictive accuracy.\n",
    "\n",
    "Note that in the below example, we leverage a simple metric definition of exact match, as defined in `validate_classification`, but [dspy.Metrics](https://dspy.ai/learn/evaluation/metrics/) can contain complex and LM-based logic to properly evaluate our accuracy."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "f7d41f13-ef79-45bf-90fa-2abee39c35ff",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "from dspy import SIMBA\n",
    "\n",
    "\n",
    "def validate_classification(example, prediction, trace=None) -> bool:\n",
    "    return example.label == prediction.label\n",
    "\n",
    "\n",
    "optimizer = SIMBA(\n",
    "    metric=validate_classification,\n",
    "    max_demos=2,\n",
    "    bsize=12,\n",
    "    num_threads=1,\n",
    ")\n",
    "\n",
    "compiled_pe = optimizer.compile(TextClassifier(), trainset=train_dataset)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "6f09466f-b929-4ebf-adfd-01c9387d3c8a",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "### Compare Pre/Post Compiled Accuracy\n",
    "\n",
    "Finally, let's explore how well our trained model can predict on unseen test data. "
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 27,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "c075af7e-b15d-4adb-ab2a-e65bbdc38069",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Uncompiled accuracy: 0.875\n",
      "Compiled accuracy: 1.0\n"
     ]
    }
   ],
   "source": [
    "def check_accuracy(classifier, test_data: pd.DataFrame = test_dataset) -> float:\n",
    "    residuals = []\n",
    "    predictions = []\n",
    "    for example in test_data:\n",
    "        prediction = classifier(text=example[\"text\"])\n",
    "        residuals.append(int(validate_classification(example, prediction)))\n",
    "        predictions.append(prediction)\n",
    "    return residuals, predictions\n",
    "\n",
    "\n",
    "uncompiled_residuals, uncompiled_predictions = check_accuracy(TextClassifier())\n",
    "print(f\"Uncompiled accuracy: {np.mean(uncompiled_residuals)}\")\n",
    "\n",
    "compiled_residuals, compiled_predictions = check_accuracy(compiled_pe)\n",
    "print(f\"Compiled accuracy: {np.mean(compiled_residuals)}\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "0964ae5f-6dfe-4b52-8a91-b91d45f69b82",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "As shown above, our compiled accuracy is non-zero - our base LLM inferred meaning of the classification labels simply via our initial prompt. However, with DSPy training, the prompts, demonstrations, and input/output signatures have been updated to give our model to 100% accuracy on unseen data. That's a gain of 12 percentage points!\n",
    "\n",
    "Let's take a look at each prediction in our test set."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 19,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "a9228b66-864b-49fb-838d-33c12e2ff8b4",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Incorrect prediction:    money-fx\n",
      "Correct prediction:      crude\n",
      "Correct prediction:      money-fx\n",
      "Correct prediction:      earn\n",
      "Incorrect prediction:    interest\n",
      "Correct prediction:      grain\n",
      "Correct prediction:      trade\n",
      "Incorrect prediction:    trade\n"
     ]
    }
   ],
   "source": [
    "for uncompiled_residual, uncompiled_prediction in zip(uncompiled_residuals, uncompiled_predictions):\n",
    "    is_correct = \"Correct\" if bool(uncompiled_residual) else \"Incorrect\"\n",
    "    prediction = uncompiled_prediction.label\n",
    "    print(f\"{is_correct} prediction: {' ' * (12 - len(is_correct))}{prediction}\")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 28,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "e93c1b68-a95e-436e-9c0d-54b2b3e34f6f",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Correct prediction:      interest\n",
      "Correct prediction:      crude\n",
      "Correct prediction:      money-fx\n",
      "Correct prediction:      earn\n",
      "Correct prediction:      acq\n",
      "Correct prediction:      grain\n",
      "Correct prediction:      trade\n",
      "Correct prediction:      ship\n"
     ]
    }
   ],
   "source": [
    "for compiled_residual, compiled_prediction in zip(compiled_residuals, compiled_predictions):\n",
    "    is_correct = \"Correct\" if bool(compiled_residual) else \"Incorrect\"\n",
    "    prediction = compiled_prediction.label\n",
    "    print(f\"{is_correct} prediction: {' ' * (12 - len(is_correct))}{prediction}\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "73351663-ed84-4e29-8bf5-61fbf94da937",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "## Log and Load the Model with MLflow\n",
    "\n",
    "Now that we have a compiled model with higher classification accuracy, let's leverage MLflow to log this model and load it for inference."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 21,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "a94969489f0444d3a919ccf11f0bc4b6",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "Downloading artifacts:   0%|          | 0/7 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    }
   ],
   "source": [
    "import mlflow\n",
    "\n",
    "with mlflow.start_run():\n",
    "    model_info = mlflow.dspy.log_model(\n",
    "        compiled_pe,\n",
    "        name=\"model\",\n",
    "        input_example=\"what is 2 + 2?\",\n",
    "    )"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "Open the MLflow UI again and check the complied model is recorded to a new MLflow Run. Now you can load the model back for inference using `mlflow.dspy.load_model` or `mlflow.pyfunc.load_model`.\n",
    "\n",
    "💡 MLflow will remember the environment configuration stored in `dspy.settings`, such as the language model (LM) used during the experiment. This ensures excellent reproducibility for your experiment."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 22,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "\n",
      "==============Input Text============\n",
      "Text: top discount rate at u k bill tender rises to pct\n",
      "\n",
      "--------------Original DSPy Prediction------------\n",
      "interest\n",
      "\n",
      "--------------Loaded DSPy Prediction------------\n",
      "interest\n",
      "\n",
      "--------------PyFunc Prediction------------\n",
      "interest\n"
     ]
    }
   ],
   "source": [
    "# Define input text\n",
    "print(\"\\n==============Input Text============\")\n",
    "text = test_dataset[0][\"text\"]\n",
    "print(f\"Text: {text}\")\n",
    "\n",
    "# Inference with original DSPy object\n",
    "print(\"\\n--------------Original DSPy Prediction------------\")\n",
    "print(compiled_pe(text=text).label)\n",
    "\n",
    "# Inference with loaded DSPy object\n",
    "print(\"\\n--------------Loaded DSPy Prediction------------\")\n",
    "loaded_model_dspy = mlflow.dspy.load_model(model_info.model_uri)\n",
    "print(loaded_model_dspy(text=text).label)\n",
    "\n",
    "# Inference with MLflow PyFunc API\n",
    "loaded_model_pyfunc = mlflow.pyfunc.load_model(model_info.model_uri)\n",
    "print(\"\\n--------------PyFunc Prediction------------\")\n",
    "print(loaded_model_pyfunc.predict(text)[\"label\"])"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "09199461-878a-4b9f-9eb0-8803775a6cc5",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "## Next Steps\n",
    "\n",
    "This example demonstrates how DSPy works. Below are some potential extensions for improving this project, both with DSPy and MLflow.\n",
    "\n",
    "### DSPy\n",
    "* Use real-world data for the classifier.\n",
    "* Experiment with different optimizers.\n",
    "* For more in-depth examples, check out the [tutorials](https://dspy.ai/tutorials/) and [documentation](https://dspy.ai/learn/).\n",
    "\n",
    "### MLflow\n",
    "* Deploy the model using MLflow serving.\n",
    "* Use MLflow to experiment with various optimization strategies.\n",
    "* Track your DSPy experiments using [DSPy Optimizer Autologging](https://mlflow.org/docs/latest/genai/flavors/dspy/optimizer/).\n",
    "\n",
    "Happy coding!"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": []
  }
 ],
 "metadata": {
  "application/vnd.databricks.v1+notebook": {
   "dashboards": [],
   "environmentMetadata": {
    "base_environment": "",
    "client": "1"
   },
   "language": "python",
   "notebookMetadata": {
    "pythonIndentUnit": 2
   },
   "notebookName": "Simple DSPy Classifier OSS",
   "widgets": {}
  },
  "kernelspec": {
   "display_name": "mlflow-3.10",
   "language": "python",
   "name": "mlflow-3.10"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.10.13"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 0
}
```

--------------------------------------------------------------------------------

````
