---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 91
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 91 of 991)

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

---[FILE: parent-child-runs.ipynb]---
Location: mlflow-master/docs/docs/classic-ml/traditional-ml/tutorials/hyperparameter-tuning/notebooks/parent-child-runs.ipynb

```text
{
 "cells": [
  {
   "cell_type": "markdown",
   "id": "839c1575",
   "metadata": {},
   "source": [
    "# Leveraging Child Runs in MLflow for Hyperparameter Tuning\n",
    "\n",
    "In the world of machine learning, the task of hyperparameter tuning is central to model optimization. This process involves performing multiple runs with varying parameters to identify the most effective combination, ultimately enhancing model performance. However, this can lead to a large volume of runs, making it challenging to track, organize, and compare these experiments effectively.\n",
    "\n",
    "**MLflow** incorporates the ability to simplify the large-data-volume issue by offering a structured approach to manage this complexity. In this notebook, we will explore the concept of **Parent and Child Runs** in MLflow, a feature that provides a hierarchical structure to organize runs. This hierarchy allows us to bundle a set of runs under a parent run, making it much more manageable and intuitive to analyze and compare the results of different hyperparameter combinations. This structure proves to be especially beneficial in understanding and visualizing the outcomes of hyperparameter tuning processes.\n",
    "\n",
    "Throughout this notebook, we will:\n",
    "- Understand the usage and benefits of parent and child runs in MLflow.\n",
    "- Walk through a practical example demonstrating the organization of runs without and with child runs.\n",
    "- Observe how child runs aid in effectively tracking and comparing the results of different parameter combinations.\n",
    "- Demonstrate a further refinement by having the parent run maintain the state of the best conditions from child run iterations."
   ]
  },
  {
   "cell_type": "markdown",
   "id": "5284b022",
   "metadata": {},
   "source": [
    "### Starting Without Child Runs\n",
    "\n",
    "Before diving into the structured world of parent and child runs, let's begin by observing the scenario without utilizing child runs in MLflow. In this section, we perform multiple runs with different parameters and metrics without associating them as child runs of a parent run.\n",
    "\n",
    "Below is the code executing five hyperparameter tuning runs. These runs are not organized as child runs, and hence, each run is treated as an independent entity in MLflow. We will observe the challenges this approach poses in tracking and comparing runs, setting the stage for the introduction of child runs in the subsequent sections.\n",
    "\n",
    "After running the above code, you can proceed to the MLflow UI to view the logged runs. Observing the organization (or lack thereof) of these runs will help in appreciating the structured approach offered by using child runs, which we will explore in the next sections of this notebook.\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "id": "b6f7293b",
   "metadata": {},
   "outputs": [],
   "source": [
    "import random\n",
    "from functools import partial\n",
    "from itertools import starmap\n",
    "\n",
    "from more_itertools import consume\n",
    "\n",
    "import mlflow\n",
    "\n",
    "\n",
    "# Define a function to log parameters and metrics\n",
    "def log_run(run_name, test_no):\n",
    "    with mlflow.start_run(run_name=run_name):\n",
    "        mlflow.log_param(\"param1\", random.choice([\"a\", \"b\", \"c\"]))\n",
    "        mlflow.log_param(\"param2\", random.choice([\"d\", \"e\", \"f\"]))\n",
    "        mlflow.log_metric(\"metric1\", random.uniform(0, 1))\n",
    "        mlflow.log_metric(\"metric2\", abs(random.gauss(5, 2.5)))\n",
    "\n",
    "\n",
    "# Generate run names\n",
    "def generate_run_names(test_no, num_runs=5):\n",
    "    return (f\"run_{i}_test_{test_no}\" for i in range(num_runs))\n",
    "\n",
    "\n",
    "# Execute tuning function\n",
    "def execute_tuning(test_no):\n",
    "    # Partial application of the log_run function\n",
    "    log_current_run = partial(log_run, test_no=test_no)\n",
    "    # Generate run names and apply log_current_run function to each run name\n",
    "    runs = starmap(log_current_run, ((run_name,) for run_name in generate_run_names(test_no)))\n",
    "    # Consume the iterator to execute the runs\n",
    "    consume(runs)\n",
    "\n",
    "\n",
    "# Set the tracking uri and experiment\n",
    "mlflow.set_tracking_uri(\"http://localhost:8080\")\n",
    "mlflow.set_experiment(\"No Child Runs\")\n",
    "\n",
    "# Execute 5 hyperparameter tuning runs\n",
    "consume(starmap(execute_tuning, ((x,) for x in range(5))))"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "e28c2713",
   "metadata": {},
   "source": [
    "#### Iterative development simulation\n",
    "\n",
    "It is very rare that a tuning run will be conducted in isolation. Typically, we will run many iterations of combinations of parameters, refining our search space to achieve the best possible potential results in the shortest amount of execution time. \n",
    "\n",
    "In order to arrive at this limited set of selection parameters ranges and conditions, we will be executing many such tests. "
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "id": "a0dec003",
   "metadata": {},
   "outputs": [],
   "source": [
    "# What if we need to run this again?\n",
    "consume(starmap(execute_tuning, ((x,) for x in range(5))))"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "d88be7b0",
   "metadata": {},
   "source": [
    "### Using Child Runs for Improved Organization\n",
    "\n",
    "As we proceed, the spotlight now shifts to the utilization of **Child Runs in MLflow**. This feature brings forth an organized structure, inherently solving the challenges we observed in the previous section. The child runs are neatly nested under a parent run, providing a clear, hierarchical view of all the runs, making it exceptionally convenient to analyze and compare the outcomes.\n",
    "\n",
    "#### Benefits of Using Child Runs:\n",
    "- **Structured View:** The child runs, grouped under a parent run, offer a clean and structured view in the MLflow UI.\n",
    "- **Efficient Filtering:** The hierarchical organization facilitates efficient filtering and selection, enhancing the usability of the MLflow UI and search APIs.\n",
    "- **Distinct Naming:** Utilizing visually distinct naming for runs aids in effortless identification and selection within the UI.\n",
    "\n",
    "In this section, the code is enhanced to use child runs. Each `execute_tuning` function call creates a parent run, under which multiple child runs are nested. These child runs are performed with different parameters and metrics. Additionally, we incorporate tags to further enhance the search and filter capabilities in MLflow.\n",
    "\n",
    "Notice the inclusion of the `nested=True` parameter in the `mlflow.start_run()` function, indicating the creation of a child run. The addition of tags, using the `mlflow.set_tag()` function, provides an extra layer of information, useful for filtering and searching runs effectively.\n",
    "\n",
    "Let's dive into the code and observe the seamless organization and enhanced functionality brought about by the use of child runs in MLflow.\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "id": "55ea8093",
   "metadata": {},
   "outputs": [],
   "source": [
    "# Define a function to log parameters and metrics and add tag\n",
    "# logging for search_runs functionality\n",
    "def log_run(run_name, test_no, param1_choices, param2_choices, tag_ident):\n",
    "    with mlflow.start_run(run_name=run_name, nested=True):\n",
    "        mlflow.log_param(\"param1\", random.choice(param1_choices))\n",
    "        mlflow.log_param(\"param2\", random.choice(param2_choices))\n",
    "        mlflow.log_metric(\"metric1\", random.uniform(0, 1))\n",
    "        mlflow.log_metric(\"metric2\", abs(random.gauss(5, 2.5)))\n",
    "        mlflow.set_tag(\"test_identifier\", tag_ident)\n",
    "\n",
    "\n",
    "# Generate run names\n",
    "def generate_run_names(test_no, num_runs=5):\n",
    "    return (f\"run_{i}_test_{test_no}\" for i in range(num_runs))\n",
    "\n",
    "\n",
    "# Execute tuning function, allowing for param overrides,\n",
    "# run_name disambiguation, and tagging support\n",
    "def execute_tuning(\n",
    "    test_no, param1_choices=(\"a\", \"b\", \"c\"), param2_choices=(\"d\", \"e\", \"f\"), test_identifier=\"\"\n",
    "):\n",
    "    ident = \"default\" if not test_identifier else test_identifier\n",
    "    # Use a parent run to encapsulate the child runs\n",
    "    with mlflow.start_run(run_name=f\"parent_run_test_{ident}_{test_no}\"):\n",
    "        # Partial application of the log_run function\n",
    "        log_current_run = partial(\n",
    "            log_run,\n",
    "            test_no=test_no,\n",
    "            param1_choices=param1_choices,\n",
    "            param2_choices=param2_choices,\n",
    "            tag_ident=ident,\n",
    "        )\n",
    "        mlflow.set_tag(\"test_identifier\", ident)\n",
    "        # Generate run names and apply log_current_run function to each run name\n",
    "        runs = starmap(log_current_run, ((run_name,) for run_name in generate_run_names(test_no)))\n",
    "        # Consume the iterator to execute the runs\n",
    "        consume(runs)\n",
    "\n",
    "\n",
    "# Set the tracking uri and experiment\n",
    "mlflow.set_tracking_uri(\"http://localhost:8080\")\n",
    "mlflow.set_experiment(\"Nested Child Association\")\n",
    "\n",
    "# Define custom parameters\n",
    "param_1_values = [\"x\", \"y\", \"z\"]\n",
    "param_2_values = [\"u\", \"v\", \"w\"]\n",
    "\n",
    "# Execute hyperparameter tuning runs with custom parameter choices\n",
    "consume(starmap(execute_tuning, ((x, param_1_values, param_2_values) for x in range(5))))"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "8e7b8ecc",
   "metadata": {},
   "source": [
    "### Tailoring the Hyperparameter Tuning Process\n",
    "\n",
    "In this segment, we are taking a step further in our iterative process of hyperparameter tuning. Observe the execution of additional hyperparameter tuning runs, where we introduce **custom parameter choices** and a unique identifier for tagging.\n",
    "\n",
    "#### What Are We Doing?\n",
    "- **Custom Parameter Choices:** We are now employing different parameter values (`param_1_values` as `[\"x\", \"y\", \"z\"]` and `param_2_values` as `[\"u\", \"v\", \"w\"]`) for the runs.\n",
    "- **Unique Identifier for Tagging:** A distinct identifier (`ident`) is used for tagging, which provides an easy and efficient way to filter and search these specific runs in the MLflow UI.\n",
    "\n",
    "#### How Does It Apply to Hyperparameter Tuning?\n",
    "- **Parameter Sensitivity Analysis:** This step allows us to analyze the sensitivity of the model to different parameter values, aiding in a more informed and effective tuning process.\n",
    "- **Efficient Search and Filter:** The use of a unique identifier for tagging facilitates an efficient and quick search for these specific runs among a multitude of others, enhancing the user experience in the MLflow UI.\n",
    "\n",
    "This approach, employing custom parameters and tagging, enhances the clarity and efficiency of the hyperparameter tuning process, contributing to building a more robust and optimized model.\n",
    "\n",
    "Let's execute this section of the code and delve deeper into the insights and improvements it offers in the hyperparameter tuning process.\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "id": "7c179058",
   "metadata": {},
   "outputs": [],
   "source": [
    "# Execute additional hyperparameter tuning runs with custom parameter choices\n",
    "param_1_values = [\"x\", \"y\", \"z\"]\n",
    "param_2_values = [\"u\", \"v\", \"w\"]\n",
    "ident = \"params_test_2\"\n",
    "consume(starmap(execute_tuning, ((x, param_1_values, param_2_values, ident) for x in range(5))))"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "ec1602ab",
   "metadata": {},
   "source": [
    "### Refining the Hyperparameter Search Space\n",
    "\n",
    "In this phase, we focus on **refining the hyperparameter search space**. This is a crucial step in the hyperparameter tuning process. After a broad exploration of the parameter space, we are now narrowing down our search to a subset of parameter values. \n",
    "\n",
    "#### What Are We Doing?\n",
    "- **Sub-setting Parameter Values:** We are focusing on a more specific set of parameter values (`param_1_values` as `[\"b\", \"c\"]` and `param_2_values` as `[\"d\", \"f\"]`) based on insights gathered from previous runs.\n",
    "- **Tagging the Runs:** Using a unique identifier (`ident`) for tagging ensures easy filtering and searching of these runs in the MLflow UI.\n",
    "\n",
    "#### How Does It Apply to Hyperparameter Tuning?\n",
    "- **Focused Search:** This narrowed search allows us to deeply explore the interactions and impacts of a specific set of parameter values, potentially leading to more optimized models.\n",
    "- **Efficient Resource Utilization:** It enables more efficient use of computational resources by focusing the search on promising areas of the parameter space.\n",
    "\n",
    "#### Caution\n",
    "While this approach is a common tactic in hyperparameter tuning, it's crucial to acknowledge the implications. Comparing results from the narrowed search space directly with those from the original, broader search space can be misleading. \n",
    "\n",
    "#### Why Is It Invalid to Compare?\n",
    "- **Nature of Bayesian Tuning Algorithms:** Bayesian optimization and other tuning algorithms often depend on the exploration of a broad parameter space to make informed decisions. Restricting the parameter space can influence the behavior of these algorithms, leading to biased or suboptimal results.\n",
    "- **Interaction of Hyperparameter Selection Values:** Different parameter values have different interactions and impacts on the model performance. A narrowed search space may miss out on capturing these interactions, leading to incomplete or skewed insights.\n",
    "\n",
    "In conclusion, while refining the search space is essential for efficient and effective hyperparameter tuning, it's imperative to approach the comparison of results with caution, acknowledging the intricacies and potential biases involved.\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 6,
   "id": "972c0d6a",
   "metadata": {},
   "outputs": [],
   "source": [
    "param_1_values = [\"b\", \"c\"]\n",
    "param_2_values = [\"d\", \"f\"]\n",
    "ident = \"params_test_3\"\n",
    "consume(starmap(execute_tuning, ((x, param_1_values, param_2_values, ident) for x in range(5))))"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "552cc0b6",
   "metadata": {},
   "source": [
    "### Challenge: Logging Best Metrics and Parameters\n",
    "\n",
    "In the real world of machine learning, it is crucial to keep track of the best performing models and their corresponding parameters for easy comparison and reproduction. **Your challenge is to enhance the `execute_tuning` function to log the best metrics and parameters from the child runs in each parent run.** This way, you can easily compare the best-performing models across different parent runs within the MLflow UI.\n",
    "\n",
    "#### Your Task:\n",
    "\n",
    "1. Modify the `execute_tuning` function such that for each parent run, it logs the best (minimum) `metric1` found among all its child runs.\n",
    "2. Alongside the best `metric1`, also log the parameters `param1` and `param2` that yielded this best `metric1`.\n",
    "3. Ensure that the `execute_tuning` function can accept a `num_child_runs` parameter to specify how many child iterations to perform per parent run.\n",
    "\n",
    "This is a common practice that allows you to keep your MLflow experiments organized and easily retrievable, making the model selection process smoother and more efficient.\n",
    "\n",
    "**Hint:** You might want to return values from the `log_run` function and use these returned values in the `execute_tuning` function to keep track of the best metrics and parameters.\n",
    "\n",
    "#### Note:\n",
    "Before moving on to the solution below, **give it a try yourself!** This exercise is a great opportunity to familiarize yourself with advanced features of MLflow and improve your MLOps skills. If you get stuck or want to compare your solution, you can scroll down to see a possible implementation.\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 7,
   "id": "d1a6e57b",
   "metadata": {},
   "outputs": [],
   "source": [
    "# Define a function to log parameters and metrics and add tag\n",
    "# logging for search_runs functionality\n",
    "def log_run(run_name, test_no, param1_choices, param2_choices, tag_ident):\n",
    "    with mlflow.start_run(run_name=run_name, nested=True) as run:\n",
    "        param1 = random.choice(param1_choices)\n",
    "        param2 = random.choice(param2_choices)\n",
    "        metric1 = random.uniform(0, 1)\n",
    "        metric2 = abs(random.gauss(5, 2.5))\n",
    "\n",
    "        mlflow.log_param(\"param1\", param1)\n",
    "        mlflow.log_param(\"param2\", param2)\n",
    "        mlflow.log_metric(\"metric1\", metric1)\n",
    "        mlflow.log_metric(\"metric2\", metric2)\n",
    "        mlflow.set_tag(\"test_identifier\", tag_ident)\n",
    "\n",
    "        return run.info.run_id, metric1, param1, param2\n",
    "\n",
    "\n",
    "# Generate run names\n",
    "def generate_run_names(test_no, num_runs=5):\n",
    "    return (f\"run_{i}_test_{test_no}\" for i in range(num_runs))\n",
    "\n",
    "\n",
    "# Execute tuning function, allowing for param overrides,\n",
    "# run_name disambiguation, and tagging support\n",
    "def execute_tuning(\n",
    "    test_no,\n",
    "    param1_choices=(\"a\", \"b\", \"c\"),\n",
    "    param2_choices=(\"d\", \"e\", \"f\"),\n",
    "    test_identifier=\"\",\n",
    "    num_child_runs=5,\n",
    "):\n",
    "    ident = \"default\" if not test_identifier else test_identifier\n",
    "    best_metric1 = float(\"inf\")\n",
    "    best_params = None\n",
    "    # Use a parent run to encapsulate the child runs\n",
    "    with mlflow.start_run(run_name=f\"parent_run_test_{ident}_{test_no}\"):\n",
    "        # Partial application of the log_run function\n",
    "        log_current_run = partial(\n",
    "            log_run,\n",
    "            test_no=test_no,\n",
    "            param1_choices=param1_choices,\n",
    "            param2_choices=param2_choices,\n",
    "            tag_ident=ident,\n",
    "        )\n",
    "        mlflow.set_tag(\"test_identifier\", ident)\n",
    "        # Generate run names and apply log_current_run function to each run name\n",
    "        results = list(\n",
    "            starmap(\n",
    "                log_current_run,\n",
    "                ((run_name,) for run_name in generate_run_names(test_no, num_child_runs)),\n",
    "            )\n",
    "        )\n",
    "\n",
    "        for _, metric1, param1, param2 in results:\n",
    "            if metric1 < best_metric1:\n",
    "                best_metric1 = metric1\n",
    "                best_params = (param1, param2)\n",
    "\n",
    "        mlflow.log_metric(\"best_metric1\", best_metric1)\n",
    "        mlflow.log_param(\"best_param1\", best_params[0])\n",
    "        mlflow.log_param(\"best_param2\", best_params[1])\n",
    "        # Consume the iterator to execute the runs\n",
    "        consume(results)\n",
    "\n",
    "\n",
    "# Set the tracking uri and experiment\n",
    "mlflow.set_tracking_uri(\"http://localhost:8080\")\n",
    "mlflow.set_experiment(\"Parent Child Association Challenge\")\n",
    "\n",
    "param_1_values = [\"a\", \"b\"]\n",
    "param_2_values = [\"d\", \"f\"]\n",
    "\n",
    "# Execute hyperparameter tuning runs with custom parameter choices\n",
    "consume(\n",
    "    starmap(\n",
    "        execute_tuning, ((x, param_1_values, param_2_values, \"subset_test\", 25) for x in range(5))\n",
    "    )\n",
    ")"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3 (ipykernel)",
   "language": "python",
   "name": "python3"
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
   "version": "3.8.13"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/traditional-ml/tutorials/hyperparameter-tuning/part1-child-runs/index.mdx

```text
---
sidebar_position: 2
sidebar_label: The Parent-Child relationship with runs
---

import useBaseUrl from '@docusaurus/useBaseUrl';

import { NotebookDownloadButton } from "@site/src/components/NotebookDownloadButton";

# Understanding Parent and Child Runs in MLflow

## Introduction

Machine learning projects often involve intricate relationships. These connections can emerge at
various stages, be it the project's conception, during data preprocessing, in the model's architecture,
or even during the model's tuning process. MLflow provides tools to efficiently capture and represent
these relationships.

## Core Concepts of MLflow: Tags, Experiments, and Runs

In our foundational MLflow tutorial, we highlighted a fundamental relationship: the association
between **tags**, **experiments**, and **runs**. This association is crucial when dealing with
complex ML projects, such as forecasting models for individual products in a supermarket, as
presented in our example. The diagram below offers a visual representation:

<figure className="center-div" style={{ width: 1024, maxWidth: "100%", textAlign: "center" }}>
  ![Tags, experiments, and runs relationships](/images/tutorials/introductory/logging-first-model/tag-exp-run-relationship.svg)
  <figcaption>A model grouping hierarchy</figcaption>
</figure>

### Key Aspects

- **Tags**: These are instrumental in defining business-level filtering keys. They aid in retrieving relevant experiments and their runs.

- **Experiments**: They set boundaries, both from a business perspective and data-wise. For instance, sales data for carrots wouldn't be used to predict sales of apples without prior validation.

- **Runs**: Each run captures a specific hypothesis or iteration of training, nestled within the context of the experiment.

## The Real-world Challenge: Hyperparameter Tuning

While the above model suffices for introductory purposes, real-world scenarios introduce complexities. One such complexity arises when tuning models.

Model tuning is paramount. Methods range from grid search (though typically not recommended due to
inefficiencies) to random searches, and more advanced approaches like automated hyperparameter tuning.
The objective remains the same: to optimally traverse the model's parameter space.

### Benefits of Hyperparameter Tuning

- **Loss Metric Relationship**: By analyzing the relationship between hyperparameters and optimization loss metrics, we can discern potentially irrelevant parameters.

- **Parameter Space Analysis**: Monitoring the range of tested values can indicate if we need to constrict or expand our search space.

- **Model Sensitivity Analysis**: Estimating how a model reacts to specific parameters can pinpoint potential feature set issues.

But here lies the challenge: How do we systematically store the extensive data produced during hyperparameter tuning?

<figure className="center-div" style={{ width: 1024, maxWidth: "100%", textAlign: "center" }}>
  ![Challenges with hyperparameter data storage](/images/guides/introductory/hyperparameter-tuning-with-child-runs/what-to-do-with-hyperparam-runs.svg)
  <figcaption>The quandary of storing hyperparameter data</figcaption>
</figure>

In the upcoming sections, we'll delve deeper, exploring MLflow's capabilities to address this
challenge, focusing on the concepts of Parent and Child Runs.

## What are Parent and Child Runs?

At its core, MLflow allows users to track experiments, which are essentially named groups of runs.
A "run" in this context refers to a single execution of a model training event, where you can log
parameters, metrics, tags, and artifacts associated with the training process.
The concept of Parent and Child Runs introduces a hierarchical structure to these runs.

Imagine a scenario where you're testing a deep learning model with different architectures. Each
architecture can be considered a parent run, and every iteration of hyperparameter tuning for that
architecture becomes a child run nested under its respective parent.

## Benefits

1. **Organizational Clarity**: By using Parent and Child Runs, you can easily group related runs together. For instance, if you're running a hyperparameter search using a Bayesian approach on a particular model architecture, every iteration can be logged as a child run, while the overarching Bayesian optimization process can be the parent run.

2. **Enhanced Traceability**: When working on large projects with a broad product hierarchy, child runs can represent individual products or variants, making it straightforward to trace back results, metrics, or artifacts to their specific run.

3. **Scalability**: As your experiments grow in number and complexity, having a nested structure ensures that your tracking remains scalable. It's much easier to navigate through a structured hierarchy than a flat list of hundreds or thousands of runs.

4. **Improved Collaboration**: For teams, this approach ensures that members can easily understand the structure and flow of experiments conducted by their peers, promoting collaboration and knowledge sharing.

## Relationship between Experiments, Parent Runs, and Child Runs

- **Experiments**: Consider experiments as the topmost layer. They are named entities under which all related runs reside. For instance, an experiment named "Deep Learning Architectures" might contain runs related to various architectures you're testing.

- **Parent Runs**: Within an experiment, a parent run represents a significant segment or phase of your workflow. Taking the earlier example, each specific architecture (like CNN, RNN, or Transformer) can be a parent run.

- **Child Runs**: Nested within parent runs are child runs. These are iterations or variations within the scope of their parent. For a CNN parent run, different sets of hyperparameters or slight architectural tweaks can each be a child run.

## Practical Example

For this example, let's image that we're working through a fine-tuning exercise for a particular modeling solution.
We're going through the tuning phase of rough adjustments initially, attempting to determine which parameter ranges and
categorical selection values that we might want to consider for a full hyperparameter tuning run with a much higher
iteration count.

### Naive Approach with no child runs

In this first phase, we will be trying relatively small batches of different combinations of parameters and
evaluating them within the MLflow UI to determine whether we should include or exempt certain values based on the
relatively performance amongst our iterative trials.

If we were to use each iteration as its own MLflow run, our code might look something like this:

```python
import random
import mlflow
from functools import partial
from itertools import starmap
from more_itertools import consume


# Define a function to log parameters and metrics
def log_run(run_name, test_no):
    with mlflow.start_run(run_name=run_name):
        mlflow.log_param("param1", random.choice(["a", "b", "c"]))
        mlflow.log_param("param2", random.choice(["d", "e", "f"]))
        mlflow.log_metric("metric1", random.uniform(0, 1))
        mlflow.log_metric("metric2", abs(random.gauss(5, 2.5)))


# Generate run names
def generate_run_names(test_no, num_runs=5):
    return (f"run_{i}_test_{test_no}" for i in range(num_runs))


# Execute tuning function
def execute_tuning(test_no):
    # Partial application of the log_run function
    log_current_run = partial(log_run, test_no=test_no)
    # Generate run names and apply log_current_run function to each run name
    runs = starmap(
        log_current_run, ((run_name,) for run_name in generate_run_names(test_no))
    )
    # Consume the iterator to execute the runs
    consume(runs)


# Set the tracking uri and experiment
mlflow.set_tracking_uri("http://localhost:8080")
mlflow.set_experiment("No Child Runs")

# Execute 5 hyperparameter tuning runs
consume(starmap(execute_tuning, ((x,) for x in range(5))))
```

After executing this, we can navigate to the MLflow UI to see the results of the iterations and compare each run's
error metrics to the parameters that were selected.

<figure className="center-div" style={{ width: 1024, maxWidth: "100%", textAlign: "center" }}>
  <video src={useBaseUrl("/images/guides/introductory/hyperparameter-tuning-with-child-runs/no-child-first.mp4")} controls loop autoPlay muted aria-label="Hyperparameter tuning no child runs" />
  <figcaption>Initial Hyperparameter tuning execution</figcaption>
</figure>

What happens when we need to run this again with some slight modifications?

Our code might change in-place with the values being tested:

```python
def log_run(run_name, test_no):
    with mlflow.start_run(run_name=run_name):
        mlflow.log_param("param1", random.choice(["a", "c"]))  # remove 'b'
        # remainder of code ...
```

When we execute this and navigate back to the UI, it is now significantly more difficult to determine
which run results are associated with a particular parameter grouping. For this example, it isn't
particularly problematic since the features are identical and the parameter search space is a subset of the
original hyperparameter test.

This may become a serious problem for analysis if we:

- Add terms to the original hyperparameter search space

- Modify the feature data (add or remove features)

- Change the underlying model architecture (test 1 is a Random Forest model, while test 2 is a Gradient Boosted Trees model)

Let's take a look at the UI and see if it is clear which iteration a particular run is a member of.

<figure className="center-div" style={{ width: 1024, maxWidth: "100%", textAlign: "center" }}>
  <video src={useBaseUrl("/images/guides/introductory/hyperparameter-tuning-with-child-runs/no-child-more.mp4")} controls loop autoPlay muted aria-label="Adding more runs" />
  <figcaption>Challenges with iterative tuning without child run encapsulation</figcaption>
</figure>

It's not too hard to imagine how complicated this can become if there are thousands of runs in this experiment.

There is a solution for this, though. We can setup the exact same testing scenario with few small modifications to make it easy to find
related runs, declutter the UI, and greatly simplify the overall process of evaluating hyperparameter ranges and parameter inclusions
during the process of tuning. Only a few modification are needed:

- Use child runs by adding a nested `start_run()` context within a parent run's context.

- Add disambiguation information to the runs in the form of modifying the `run_name` of the parent run

- Add tag information to the parent and child runs to enable searching on keys that identify a family of runs

### Adapting for Parent and Child Runs

The code below demonstrates these modifications to our original hyperparameter tuning example.

```python
import random
import mlflow
from functools import partial
from itertools import starmap
from more_itertools import consume


# Define a function to log parameters and metrics and add tag
# logging for search_runs functionality
def log_run(run_name, test_no, param1_choices, param2_choices, tag_ident):
    with mlflow.start_run(run_name=run_name, nested=True):
        mlflow.log_param("param1", random.choice(param1_choices))
        mlflow.log_param("param2", random.choice(param2_choices))
        mlflow.log_metric("metric1", random.uniform(0, 1))
        mlflow.log_metric("metric2", abs(random.gauss(5, 2.5)))
        mlflow.set_tag("test_identifier", tag_ident)


# Generate run names
def generate_run_names(test_no, num_runs=5):
    return (f"run_{i}_test_{test_no}" for i in range(num_runs))


# Execute tuning function, allowing for param overrides,
# run_name disambiguation, and tagging support
def execute_tuning(
    test_no,
    param1_choices=["a", "b", "c"],
    param2_choices=["d", "e", "f"],
    test_identifier="",
):
    ident = "default" if not test_identifier else test_identifier
    # Use a parent run to encapsulate the child runs
    with mlflow.start_run(run_name=f"parent_run_test_{ident}_{test_no}"):
        # Partial application of the log_run function
        log_current_run = partial(
            log_run,
            test_no=test_no,
            param1_choices=param1_choices,
            param2_choices=param2_choices,
            tag_ident=ident,
        )
        mlflow.set_tag("test_identifier", ident)
        # Generate run names and apply log_current_run function to each run name
        runs = starmap(
            log_current_run, ((run_name,) for run_name in generate_run_names(test_no))
        )
        # Consume the iterator to execute the runs
        consume(runs)


# Set the tracking uri and experiment
mlflow.set_tracking_uri("http://localhost:8080")
mlflow.set_experiment("Nested Child Association")

# Define custom parameters
param_1_values = ["x", "y", "z"]
param_2_values = ["u", "v", "w"]

# Execute hyperparameter tuning runs with custom parameter choices
consume(
    starmap(execute_tuning, ((x, param_1_values, param_2_values) for x in range(5)))
)
```

We can view the results of executing this in the UI:

The real benefit of this nested architecture becomes much more apparent when we add additional runs
with different conditions of hyperparameter selection criteria.

```python
# Execute modified hyperparameter tuning runs with custom parameter choices
param_1_values = ["a", "b"]
param_2_values = ["u", "v", "w"]
ident = "params_test_2"
consume(
    starmap(
        execute_tuning, ((x, param_1_values, param_2_values, ident) for x in range(5))
    )
)
```

... and even more runs ...

```python
param_1_values = ["b", "c"]
param_2_values = ["d", "f"]
ident = "params_test_3"
consume(
    starmap(
        execute_tuning, ((x, param_1_values, param_2_values, ident) for x in range(5))
    )
)
```

Once we execute these three tuning run tests, we can view the results in the UI:

<figure className="center-div" style={{ width: 1024, maxWidth: "100%", textAlign: "center" }}>
  <video src={useBaseUrl("/images/guides/introductory/hyperparameter-tuning-with-child-runs/child-runs.mp4")} controls loop autoPlay muted aria-label="Using child runs" />
  <figcaption>Encapsulating tests with child runs</figcaption>
</figure>

In the above video, you can see that we purposefully avoided including the parent run in the run comparison.
This is due to the fact that no metrics or parameters were actually written to these parent runs; rather, they
were used purely for organizational purposes to limit the volume of runs visible within the UI.

In practice, it is best to store the best conditions found with a hyperparamter execution of child runs within
the parent's run data.

## Challenge

As an exercise, if you are interested, you may download the notebook with these two examples and modify the
code within in order to achieve this.

<p>
  <NotebookDownloadButton href="https://raw.githubusercontent.com/mlflow/mlflow/master/docs/docs/classic-ml/traditional-ml/tutorials/hyperparameter-tuning/notebooks/parent-child-runs.ipynb">Download the notebook</NotebookDownloadButton>
</p>

The notebook contains an example implementation of this, but it is
recommended to develop your own implementation that fulfills the following requirements:

- Record the lowest metric1 value amongst the children and the associated parameters with that child run in the parent run's information.

- Add the ability to specify an iteration count to the number of children created from the calling entry point.

The results in the UI for this challenge are shown below.

<figure className="center-div" style={{ width: 1024, maxWidth: "100%", textAlign: "center" }}>
  <video src={useBaseUrl("/images/guides/introductory/hyperparameter-tuning-with-child-runs/parent-child-challenge.mp4")} controls loop autoPlay muted aria-label="Challenge" />
  <figcaption>Adding best child run data to parent run</figcaption>
</figure>

## Conclusion

The usage of parent and child runs associations can greatly simplify iterative model development.
With repetitive and high-data-volume tasks such as hyperparameter tuning, encapsulating a training run's
parameter search space or feature engineering evaluation runs can help to ensure that you're comparing
exactly what you intend to compare, all with minimal effort.
```

--------------------------------------------------------------------------------

````
