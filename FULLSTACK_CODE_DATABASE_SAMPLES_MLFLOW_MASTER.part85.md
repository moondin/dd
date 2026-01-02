---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 85
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 85 of 991)

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

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/traditional-ml/tutorials/creating-custom-pyfunc/notebooks/index.mdx

```text
---
sidebar_position: 3
sidebar_label: Full Notebooks
---

import Link from "@docusaurus/Link";

# Custom PyFuncs with MLflow - Notebooks

If you would like to view the notebooks in this guide in their entirety, each notebook can viewed or downloaded directly below.

## Basics of Creating a Custom Python Model with MLflow's Pyfunc

### Introduction

In this initial tutorial, we'll introduce you to the foundational concepts of MLflow's _pyfunc_. We'll illustrate the simplicity and
adaptability of creating, saving, and invoking a custom Python function model within the MLflow ecosystem. By the end, you'll have a
hands-on understanding of a model that adds a specified numeric value to DataFrame columns, highlighting the innate flexibility
of the _pyfunc_ flavor.

### What you will learn

- **Simplicity of Custom PyFunc Models**: Grasp the basic structure of the _PythonModel_ class and how it forms the backbone of custom models in MLflow.
- **Model Persistence**: Understand the straightforward process of saving and retrieving custom models.
- **Invoking Predictions**: Learn the mechanics of how to use a loaded custom _pyfunc_ model for predictions.

### Step-by-step Guide

1. **Model Definition**: Begin by crafting a Python class encapsulating the logic for our straightforward "Add N" model.
2. **Persisting the Model**: Use MLflow's capabilities to save the defined model, ensuring it can be retrieved later.
3. **Model Retrieval**: Load the model from its saved location and prepare it for predictions.
4. **Model Evaluation**: Use the retrieved model on sample data to witness its functionality.

### Wrap Up

By the conclusion of this tutorial, you'll appreciate the ease and consistency that MLflow's custom _pyfunc_ offers, even for the simplest of models. It sets the stage for more advanced functionalities and use-cases you might explore in subsequent tutorials.

<Link className="button button--primary" to="introduction">
  <span>View the Notebook</span>
</Link>

## Building a Basic Custom Python Model

### Introduction

In this tutorial, we deepen our understanding of MLflow's Custom Pyfunc. The `PythonModel` class serves as the cornerstone, allowing
you to define, save, load, and predict using custom PyFunc models.
We'll be developing a very non-standard model; one that generates plotted figures in order to showcase the flexibility of custom PyFunc models.
By the end, we'll have a functional Lissajous curve generator, wrapped and managed within the Pyfunc framework.

### What you will learn

- **Defining Custom PyFunc Models**: Explore the structure of the `PythonModel` class and its essential methods.
- **Understanding Pyfunc Components**: Get acquainted with the foundational building blocks of the Pyfunc flavor.
- **Saving and Loading Models**: Experience the seamless integration of MLflow's storage and retrieval capabilities.
- **Predicting with Custom Logic**: Interface with the loaded custom Pyfunc to generate interesting Lissajous curve plots.

### The `PythonModel` class

MLflow's commitment to flexibility and standardization shines through the `PythonModel` class. This class, crucial to the Pyfunc
flavor, provides the necessary scaffolding to define custom logic, load resources, and make predictions.

There are two primary ways to create an instance of the PythonModel:

1. **Class-based approach**: Define a class with necessary methods and use it as a blueprint for the model.
2. **Function-based approach**: Capture the entire prediction logic within a single function, letting MLflow handle the rest.

For this tutorial, we'll focus on the class-based approach, delving into methods like `load_context` and `predict` and
understanding their roles in the larger ecosystem.

### Lissajous Curves

As our vehicle for understanding, we'll employ the Lissajous curves – sinusoidal parametric curves whose shapes and orientations are
determined by their parameters. Instead of a conventional machine learning model, this mathematical curve will demonstrate the versatility
and power of the Pyfunc flavor.

### Step-by-step Guide

1. **Define the Custom PyFunc Model**: We start by creating a Python class encapsulating the logic for generating Lissajous curves.
2. **Save the Model**: With the model defined, we leverage MLflow's capabilities to save it, ensuring future reproducibility.
3. **Load the Model**: Retrieve the model from storage and prepare it for predictions.
4. **Generate Curves**: Use the loaded model to create and visualize Lissajous curves, showcasing the end-to-end capabilities of the Pyfunc flavor.

### Wrap Up

With a practical example under our belt, the power and flexibility of MLflow's Custom Pyfunc are evident. Whether you're working with
traditional machine learning models or unique use cases like the Lissajous curve generator, Pyfunc ensures a standardized, reproducible,
and efficient workflow.

<Link className="button button--primary" to="basic-pyfunc">
  <span>View the Notebook</span>
</Link>

## Overriding a model's prediction method

### Introduction

Diving deeper into the realm of custom PyFuncs with MLflow, this tutorial addresses a common challenge in model deployment: retaining and
customizing the behavior of a model's prediction method after serialization and deployment. Leveraging the power of MLflow's PyFunc flavor,
we'll learn how to override the default _predict_ behavior, ensuring our model retains all its original capabilities when deployed in
different environments.

### What you will learn

- **The Challenge with Default PyFuncs**: Recognize the limitations of default PyFunc behavior with complex models, especially when methods other than _predict_ are vital.
- **Customizing Predict Method**: Discover the technique to override the default _predict_ method, enabling the support of various prediction methodologies.
- **Harnessing Joblib with PyFunc**: Understand why _joblib_ is preferred over _pickle_ for serializing scikit-learn models and how to integrate it with PyFunc.
- **Dynamic Prediction with Params**: Learn to make the _predict_ method more versatile by accepting parameters that dictate the type of prediction.

### Why Override _predict_?

Models, especially in libraries like scikit-learn, often come with multiple methods for prediction, such as _predict_, _predict_proba_, and _predict_log_proba_.
When deploying such models, it's essential to retain the flexibility to choose the prediction methodology dynamically. This section sheds light
on the need for such flexibility and the challenges with default PyFunc deployments.

### Creating a Custom PyFunc

Venturing into the solution, we craft a custom PyFunc by extending MLflow's _PythonModel_. This custom class serves as a wrapper around the
original model, providing a flexible _predict_ method that can mimic the behavior of various original methods based on provided parameters.

### Step-by-step Guide

1. **Prepare a Basic Model**: Use the Iris dataset to create a simple Logistic Regression model, illustrating the different prediction methods.
2. **Challenges with Default Deployment**: Recognize the limitations when deploying the model as a default PyFunc.
3. **Crafting the Custom PyFunc**: Design a ModelWrapper class that can dynamically switch between prediction methods.
4. **Saving and Loading the Custom Model**: Integrate with MLflow to save the custom PyFunc and load it for predictions.
5. **Dynamic Predictions**: Test the loaded model, ensuring it supports all original prediction methods.

### Wrap Up

Overcoming the challenges of default deployments, this tutorial showcases the prowess of custom PyFuncs in MLflow. The ability to override and
customize prediction methods ensures that our deployed models remain as versatile and capable as their original incarnations. As ML workflows
grow in complexity, such customization becomes invaluable, ensuring our deployments are robust and adaptable.

<Link className="button button--primary" to="override-predict">
  <span>View the Notebook</span>
</Link>

If you would like to run the notebooks in this tutorial series, each notebook page has a link to download the notebooks locally to your computer.

:::note
In order to run the notebooks, please ensure that you either have a local MLflow Tracking Server started or modify the
`mlflow.set_tracking_uri()` values to point to a running instance of the MLflow Tracking Server. In order to interact with
the MLflow UI, ensure that you are either running the UI server locally or have a configured deployed MLflow UI server that
you are able to access.
:::
```

--------------------------------------------------------------------------------

---[FILE: introduction.ipynb]---
Location: mlflow-master/docs/docs/classic-ml/traditional-ml/tutorials/creating-custom-pyfunc/notebooks/introduction.ipynb

```text
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Creating a Custom Model: \"Add N\" Model\n",
    "Our first example is simple yet illustrative. We'll create a model that adds a specified numeric value, n, to all columns of a Pandas DataFrame input. This will demonstrate the process of defining a custom model, saving it, loading it back, and performing predictions."
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "#### Step 1: Define the Model Class\n",
    "We begin by defining a Python class for our model. This class should inherit from mlflow.pyfunc.PythonModel and implement the necessary methods."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 1,
   "metadata": {},
   "outputs": [],
   "source": [
    "import mlflow.pyfunc\n",
    "\n",
    "\n",
    "class AddN(mlflow.pyfunc.PythonModel):\n",
    "    \"\"\"\n",
    "    A custom model that adds a specified value `n` to all columns of the input DataFrame.\n",
    "\n",
    "    Attributes:\n",
    "    -----------\n",
    "    n : int\n",
    "        The value to add to input columns.\n",
    "    \"\"\"\n",
    "\n",
    "    def __init__(self, n):\n",
    "        \"\"\"\n",
    "        Constructor method. Initializes the model with the specified value `n`.\n",
    "\n",
    "        Parameters:\n",
    "        -----------\n",
    "        n : int\n",
    "            The value to add to input columns.\n",
    "        \"\"\"\n",
    "        self.n = n\n",
    "\n",
    "    def predict(self, context, model_input, params=None):\n",
    "        \"\"\"\n",
    "        Prediction method for the custom model.\n",
    "\n",
    "        Parameters:\n",
    "        -----------\n",
    "        context : Any\n",
    "            Ignored in this example. It's a placeholder for additional data or utility methods.\n",
    "\n",
    "        model_input : pd.DataFrame\n",
    "            The input DataFrame to which `n` should be added.\n",
    "\n",
    "        params : dict, optional\n",
    "            Additional prediction parameters. Ignored in this example.\n",
    "\n",
    "        Returns:\n",
    "        --------\n",
    "        pd.DataFrame\n",
    "            The input DataFrame with `n` added to all columns.\n",
    "        \"\"\"\n",
    "        return model_input.apply(lambda column: column + self.n)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "#### Step 2: Save the Model\n",
    "Now that our model class is defined, we can instantiate it and save it using MLflow."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "/Users/benjamin.wilson/miniconda3/envs/mlflow-dev-env/lib/python3.8/site-packages/_distutils_hack/__init__.py:30: UserWarning: Setuptools is replacing distutils.\n",
      "  warnings.warn(\"Setuptools is replacing distutils.\")\n"
     ]
    }
   ],
   "source": [
    "# Define the path to save the model\n",
    "model_path = \"/tmp/add_n_model\"\n",
    "\n",
    "# Create an instance of the model with `n=5`\n",
    "add5_model = AddN(n=5)\n",
    "\n",
    "# Save the model using MLflow\n",
    "mlflow.pyfunc.save_model(path=model_path, python_model=add5_model)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "#### Step 3: Load the Model\n",
    "With our model saved, we can load it back using MLflow and then use it for predictions."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Load the saved model\n",
    "loaded_model = mlflow.pyfunc.load_model(model_path)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "#### Step 4: Evaluate the Model\n",
    "Let's now use our loaded model to perform predictions on a sample input and verify its correctness."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "metadata": {},
   "outputs": [],
   "source": [
    "import pandas as pd\n",
    "\n",
    "# Define a sample input DataFrame\n",
    "model_input = pd.DataFrame([range(10)])\n",
    "\n",
    "# Use the loaded model to make predictions\n",
    "model_output = loaded_model.predict(model_input)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/html": [
       "<div>\n",
       "<style scoped>\n",
       "    .dataframe tbody tr th:only-of-type {\n",
       "        vertical-align: middle;\n",
       "    }\n",
       "\n",
       "    .dataframe tbody tr th {\n",
       "        vertical-align: top;\n",
       "    }\n",
       "\n",
       "    .dataframe thead th {\n",
       "        text-align: right;\n",
       "    }\n",
       "</style>\n",
       "<table border=\"1\" class=\"dataframe\">\n",
       "  <thead>\n",
       "    <tr style=\"text-align: right;\">\n",
       "      <th></th>\n",
       "      <th>0</th>\n",
       "      <th>1</th>\n",
       "      <th>2</th>\n",
       "      <th>3</th>\n",
       "      <th>4</th>\n",
       "      <th>5</th>\n",
       "      <th>6</th>\n",
       "      <th>7</th>\n",
       "      <th>8</th>\n",
       "      <th>9</th>\n",
       "    </tr>\n",
       "  </thead>\n",
       "  <tbody>\n",
       "    <tr>\n",
       "      <th>0</th>\n",
       "      <td>5</td>\n",
       "      <td>6</td>\n",
       "      <td>7</td>\n",
       "      <td>8</td>\n",
       "      <td>9</td>\n",
       "      <td>10</td>\n",
       "      <td>11</td>\n",
       "      <td>12</td>\n",
       "      <td>13</td>\n",
       "      <td>14</td>\n",
       "    </tr>\n",
       "  </tbody>\n",
       "</table>\n",
       "</div>"
      ],
      "text/plain": [
       "   0  1  2  3  4   5   6   7   8   9\n",
       "0  5  6  7  8  9  10  11  12  13  14"
      ]
     },
     "execution_count": 5,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "model_output"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "#### Conclusion\n",
    "This simple example demonstrates the power and flexibility of MLflow's custom pyfunc. By encapsulating arbitrary Python code and its dependencies, custom pyfunc models ensure a consistent and unified interface for a wide range of use cases. Whether you're working with a niche machine learning framework, need custom preprocessing steps, or want to integrate unique prediction logic, pyfunc is the tool for the job."
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "mlflow-dev-env",
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
 "nbformat_minor": 2
}
```

--------------------------------------------------------------------------------

````
