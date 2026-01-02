---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 178
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 178 of 991)

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

---[FILE: rag-evaluation.ipynb]---
Location: mlflow-master/examples/evaluation/rag-evaluation.ipynb

```text
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "42084110-295b-493a-9b3e-5d8d29ff78b3",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "# LLM RAG Evaluation with MLflow Example Notebook\n",
    "\n",
    "In this notebook, we will demonstrate how to evaluate various a RAG system with MLflow."
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "bdff35e3-0e09-48b8-87ce-78759de88998",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "We need to set our OpenAI API key, since we will be using GPT-4 for our LLM-judged metrics.\n",
    "\n",
    "In order to set your private key safely, please be sure to either export your key through a command-line terminal for your current instance, or, for a permanent addition to all user-based sessions, configure your favored environment management configuration file (i.e., .bashrc, .zshrc) to have the following entry:\n",
    "\n",
    "`OPENAI_API_KEY=<your openai API key>`"
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
     "nuid": "fb946228-62fb-4d68-9732-75935c9cb401",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "import pandas as pd\n",
    "\n",
    "import mlflow"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "273d1345-95d7-435a-a7b6-a5f3dbb3f073",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "## Create a RAG system\n",
    "\n",
    "Use Langchain and Chroma to create a RAG system that answers questions based on the MLflow documentation."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "2c28d0ad-f469-46ab-a2b4-c5e8db50a729",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "from langchain.chains import RetrievalQA\n",
    "from langchain.document_loaders import WebBaseLoader\n",
    "from langchain.embeddings.openai import OpenAIEmbeddings\n",
    "from langchain.llms import OpenAI\n",
    "from langchain.text_splitter import CharacterTextSplitter\n",
    "from langchain.vectorstores import Chroma"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 9,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "83a7e77e-6717-472a-86dc-02e2c356ddef",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "loader = WebBaseLoader(\"https://mlflow.org/docs/latest/index.html\")\n",
    "\n",
    "documents = loader.load()\n",
    "text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)\n",
    "texts = text_splitter.split_documents(documents)\n",
    "\n",
    "embeddings = OpenAIEmbeddings()\n",
    "docsearch = Chroma.from_documents(texts, embeddings)\n",
    "\n",
    "qa = RetrievalQA.from_chain_type(\n",
    "    llm=OpenAI(temperature=0),\n",
    "    chain_type=\"stuff\",\n",
    "    retriever=docsearch.as_retriever(),\n",
    "    return_source_documents=True,\n",
    ")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "fd70bcf6-7c44-44d3-9435-567b82611e1c",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "## Evaluate the RAG system using `mlflow.evaluate()`"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "de1bc359-2e40-459c-bea4-bed35a117988",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "Create a simple function that runs each input through the RAG chain"
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
     "nuid": "667ec809-2bb5-4170-9937-6804386b41ec",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "def model(input_df):\n",
    "    answer = []\n",
    "    for index, row in input_df.iterrows():\n",
    "        answer.append(qa(row[\"questions\"]))\n",
    "\n",
    "    return answer"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "d1064306-b7f3-4b3e-825c-4353d808f21d",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "Create an eval dataset"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 16,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "a5481491-e4a9-42ea-8a3f-f527faffd04d",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "eval_df = pd.DataFrame(\n",
    "    {\n",
    "        \"questions\": [\n",
    "            \"What is MLflow?\",\n",
    "            \"How to run mlflow.evaluate()?\",\n",
    "            \"How to log_table()?\",\n",
    "            \"How to load_table()?\",\n",
    "        ],\n",
    "    }\n",
    ")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "9c3c8023-8feb-427a-b36d-34cd1853a5dc",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "Create a faithfulness metric"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 12,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "3882b940-9c25-41ce-a301-72d8c0c90aaa",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "from mlflow.metrics.genai.metric_definitions import faithfulness\n",
    "\n",
    "faithfulness_metric = faithfulness(model=\"openai:/gpt-4\")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 17,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "ea40ce52-6ac7-4c20-9669-d24f80a6cebe",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "2023/10/23 13:13:16 INFO mlflow.models.evaluation.base: Evaluating the model with the default evaluator.\n"
     ]
    },
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "Number of requested results 4 is greater than number of elements in index 3, updating n_results = 3\n",
      "Number of requested results 4 is greater than number of elements in index 3, updating n_results = 3\n",
      "Number of requested results 4 is greater than number of elements in index 3, updating n_results = 3\n",
      "Number of requested results 4 is greater than number of elements in index 3, updating n_results = 3\n",
      "Using pad_token, but it is not set yet.\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "23e9a5f58f1b4930ac47c88259156e1d",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/1 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "2023/10/23 13:13:41 INFO mlflow.models.evaluation.default_evaluator: Evaluating builtin metrics: token_count\n",
      "2023/10/23 13:13:41 INFO mlflow.models.evaluation.default_evaluator: Evaluating builtin metrics: toxicity\n",
      "2023/10/23 13:13:41 INFO mlflow.models.evaluation.default_evaluator: Evaluating builtin metrics: perplexity\n",
      "Using pad_token, but it is not set yet.\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "2c6fd2067bad4404ad5550d56e23407e",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/1 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "2023/10/23 13:13:44 INFO mlflow.models.evaluation.default_evaluator: Evaluating builtin metrics: flesch_kincaid_grade_level\n",
      "2023/10/23 13:13:44 INFO mlflow.models.evaluation.default_evaluator: Evaluating builtin metrics: ari_grade_level\n",
      "2023/10/23 13:13:44 INFO mlflow.models.evaluation.default_evaluator: Evaluating builtin metrics: exact_match\n",
      "2023/10/23 13:13:44 INFO mlflow.models.evaluation.default_evaluator: Evaluating metrics: faithfulness\n"
     ]
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "{'toxicity/v1/mean': 0.0002736186215770431, 'toxicity/v1/variance': 2.856656765360073e-08, 'toxicity/v1/p90': 0.0004570253004203551, 'toxicity/v1/ratio': 0.0, 'perplexity/v1/mean': 70.08646988868713, 'perplexity/v1/variance': 5233.465638493719, 'perplexity/v1/p90': 149.10144042968753, 'flesch_kincaid_grade_level/v1/mean': 7.625, 'flesch_kincaid_grade_level/v1/variance': 23.836875, 'flesch_kincaid_grade_level/v1/p90': 13.150000000000002, 'ari_grade_level/v1/mean': 9.450000000000001, 'ari_grade_level/v1/variance': 32.262499999999996, 'ari_grade_level/v1/p90': 15.870000000000001, 'faithfulness/v1/mean': 4.0, 'faithfulness/v1/variance': 3.0, 'faithfulness/v1/p90': 5.0}\n"
     ]
    }
   ],
   "source": [
    "results = mlflow.evaluate(\n",
    "    model,\n",
    "    eval_df,\n",
    "    model_type=\"question-answering\",\n",
    "    evaluators=\"default\",\n",
    "    predictions=\"result\",\n",
    "    extra_metrics=[faithfulness_metric, mlflow.metrics.latency()],\n",
    "    evaluator_config={\n",
    "        \"col_mapping\": {\n",
    "            \"inputs\": \"questions\",\n",
    "            \"context\": \"source_documents\",\n",
    "        }\n",
    "    },\n",
    ")\n",
    "print(results.metrics)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 18,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "989a0861-5153-44e6-a19d-efcae7fe6cb5",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "4a4883be06c94983a171da51d14b40a3",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "Downloading artifacts:   0%|          | 0/1 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
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
       "      <th>questions</th>\n",
       "      <th>outputs</th>\n",
       "      <th>query</th>\n",
       "      <th>source_documents</th>\n",
       "      <th>latency</th>\n",
       "      <th>token_count</th>\n",
       "      <th>toxicity/v1/score</th>\n",
       "      <th>perplexity/v1/score</th>\n",
       "      <th>flesch_kincaid_grade_level/v1/score</th>\n",
       "      <th>ari_grade_level/v1/score</th>\n",
       "      <th>faithfulness/v1/score</th>\n",
       "      <th>faithfulness/v1/justification</th>\n",
       "    </tr>\n",
       "  </thead>\n",
       "  <tbody>\n",
       "    <tr>\n",
       "      <th>0</th>\n",
       "      <td>What is MLflow?</td>\n",
       "      <td>MLflow is an open source platform for managin...</td>\n",
       "      <td>What is MLflow?</td>\n",
       "      <td>[{'lc_attributes': {}, 'lc_namespace': ['langc...</td>\n",
       "      <td>3.970739</td>\n",
       "      <td>176</td>\n",
       "      <td>0.000208</td>\n",
       "      <td>28.626591</td>\n",
       "      <td>15.4</td>\n",
       "      <td>18.9</td>\n",
       "      <td>5</td>\n",
       "      <td>The output provided by the model is a detailed...</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>1</th>\n",
       "      <td>How to run MLflow.evaluate()?</td>\n",
       "      <td>\\n\\nYou can run MLflow.evaluate() by using the...</td>\n",
       "      <td>How to run MLflow.evaluate()?</td>\n",
       "      <td>[{'lc_attributes': {}, 'lc_namespace': ['langc...</td>\n",
       "      <td>1.083653</td>\n",
       "      <td>39</td>\n",
       "      <td>0.000179</td>\n",
       "      <td>44.533493</td>\n",
       "      <td>4.7</td>\n",
       "      <td>4.5</td>\n",
       "      <td>5</td>\n",
       "      <td>The output states that \"You can run MLflow.eva...</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>2</th>\n",
       "      <td>How to log_table()?</td>\n",
       "      <td>\\n\\nYou can use the log_table() function in ML...</td>\n",
       "      <td>How to log_table()?</td>\n",
       "      <td>[{'lc_attributes': {}, 'lc_namespace': ['langc...</td>\n",
       "      <td>2.833117</td>\n",
       "      <td>114</td>\n",
       "      <td>0.000564</td>\n",
       "      <td>13.269521</td>\n",
       "      <td>7.9</td>\n",
       "      <td>8.8</td>\n",
       "      <td>1</td>\n",
       "      <td>The output provides a detailed explanation of ...</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>3</th>\n",
       "      <td>How to load_table()?</td>\n",
       "      <td>load_table() is not a function in MLflow.</td>\n",
       "      <td>How to load_table()?</td>\n",
       "      <td>[{'lc_attributes': {}, 'lc_namespace': ['langc...</td>\n",
       "      <td>3.736170</td>\n",
       "      <td>11</td>\n",
       "      <td>0.000144</td>\n",
       "      <td>193.916275</td>\n",
       "      <td>2.5</td>\n",
       "      <td>5.6</td>\n",
       "      <td>5</td>\n",
       "      <td>The output states that \"load_table() is not a ...</td>\n",
       "    </tr>\n",
       "  </tbody>\n",
       "</table>\n",
       "</div>"
      ],
      "text/plain": [
       "                       questions  \\\n",
       "0                What is MLflow?   \n",
       "1  How to run MLflow.evaluate()?   \n",
       "2            How to log_table()?   \n",
       "3           How to load_table()?   \n",
       "\n",
       "                                             outputs  \\\n",
       "0   MLflow is an open source platform for managin...   \n",
       "1  \\n\\nYou can run MLflow.evaluate() by using the...   \n",
       "2  \\n\\nYou can use the log_table() function in ML...   \n",
       "3          load_table() is not a function in MLflow.   \n",
       "\n",
       "                           query  \\\n",
       "0                What is MLflow?   \n",
       "1  How to run MLflow.evaluate()?   \n",
       "2            How to log_table()?   \n",
       "3           How to load_table()?   \n",
       "\n",
       "                                    source_documents   latency  token_count  \\\n",
       "0  [{'lc_attributes': {}, 'lc_namespace': ['langc...  3.970739          176   \n",
       "1  [{'lc_attributes': {}, 'lc_namespace': ['langc...  1.083653           39   \n",
       "2  [{'lc_attributes': {}, 'lc_namespace': ['langc...  2.833117          114   \n",
       "3  [{'lc_attributes': {}, 'lc_namespace': ['langc...  3.736170           11   \n",
       "\n",
       "   toxicity/v1/score  perplexity/v1/score  \\\n",
       "0           0.000208            28.626591   \n",
       "1           0.000179            44.533493   \n",
       "2           0.000564            13.269521   \n",
       "3           0.000144           193.916275   \n",
       "\n",
       "   flesch_kincaid_grade_level/v1/score  ari_grade_level/v1/score  \\\n",
       "0                                 15.4                      18.9   \n",
       "1                                  4.7                       4.5   \n",
       "2                                  7.9                       8.8   \n",
       "3                                  2.5                       5.6   \n",
       "\n",
       "   faithfulness/v1/score                      faithfulness/v1/justification  \n",
       "0                      5  The output provided by the model is a detailed...  \n",
       "1                      5  The output states that \"You can run MLflow.eva...  \n",
       "2                      1  The output provides a detailed explanation of ...  \n",
       "3                      5  The output states that \"load_table() is not a ...  "
      ]
     },
     "execution_count": 18,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "results.tables[\"eval_results_table\"]"
   ]
  }
 ],
 "metadata": {
  "application/vnd.databricks.v1+notebook": {
   "dashboards": [],
   "language": "python",
   "notebookMetadata": {
    "pythonIndentUnit": 2
   },
   "notebookName": "LLM Evaluation Examples -- RAG",
   "widgets": {}
  },
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
   "version": "3.8.17"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 0
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/evaluation/README.md

```text
### MLflow evaluation Examples

The examples in this directory demonstrate how to use the `mlflow.evaluate()` API. Specifically,
they show how to evaluate a PyFunc model on a specified dataset using the builtin default evaluator
and specified extra metrics, where the resulting metrics & artifacts are logged to MLflow Tracking.
They also show how to specify validation thresholds for the resulting metrics to validate the quality
of your model. See full list of examples below:

- Example `evaluate_on_binary_classifier.py` evaluates an xgboost `XGBClassifier` model on dataset loaded by
  `shap.datasets.adult`.
- Example `evaluate_on_multiclass_classifier.py` evaluates a scikit-learn `LogisticRegression` model on dataset
  generated by `sklearn.datasets.make_classification`.
- Example `evaluate_on_regressor.py` evaluate as scikit-learn `LinearRegression` model on dataset loaded by
  `sklearn.datasets.fetch_california_housing`
- Example `evaluate_with_custom_metrics.py` evaluates a scikit-learn `LinearRegression`
  model with a custom metric function on dataset loaded by `sklearn.datasets.fetch_california_housing`
- Example `evaluate_with_custom_metrics_comprehensive.py` evaluates a scikit-learn `LinearRegression` model
  with a comprehensive list of custom metric functions on dataset loaded by `sklearn.datasets.fetch_california_housing`
- Example `evaluate_with_model_validation.py` trains both a candidate xgboost `XGBClassifier` model
  and a baseline `DummyClassifier` model on dataset loaded by `shap.datasets.adult`. Then, it validates
  the candidate model against specified thresholds on both builtin and extra metrics and the dummy model.

#### Prerequisites

```
pip install scikit-learn xgboost shap>=0.40 matplotlib
```

#### How to run the examples

Run in this directory with Python.

```sh
python evaluate_on_binary_classifier.py
python evaluate_on_multiclass_classifier.py
python evaluate_on_regressor.py
python evaluate_with_custom_metrics.py
python evaluate_with_custom_metrics_comprehensive.py
python evaluate_with_model_validation.py
```
```

--------------------------------------------------------------------------------

---[FILE: image_pyfunc.py]---
Location: mlflow-master/examples/flower_classifier/image_pyfunc.py

```python
"""
Example of a custom python function implementing image classifier with image preprocessing embedded
in the model.
"""

import base64
import importlib.metadata
import os
from io import BytesIO
from typing import Any

import keras
import numpy as np
import pandas as pd
import PIL
import tensorflow as tf
import yaml
from PIL import Image

import mlflow
from mlflow.utils import PYTHON_VERSION
from mlflow.utils.file_utils import TempDir


def decode_and_resize_image(raw_bytes, size):
    """
    Read, decode and resize raw image bytes (e.g. raw content of a jpeg file).

    Args:
        raw_bytes: Image bits, e.g. jpeg image.
        size: Requested output dimensions.

    Returns:
        Multidimensional numpy array representing the resized image.
    """
    return np.asarray(Image.open(BytesIO(raw_bytes)).resize(size), dtype=np.float32)


class KerasImageClassifierPyfunc:
    """
    Image classification model with embedded pre-processing.

    This class is essentially an MLflow custom python function wrapper around a Keras model.
    The wrapper provides image preprocessing so that the model can be applied to images directly.
    The input to the model is base64 encoded image binary data (e.g. contents of a jpeg file).
    The output is the predicted class label, predicted class id followed by probabilities for each
    class.

    The model declares current local versions of Keras, Tensorlow and pillow as dependencies in its
    conda environment file.
    """

    def __init__(self, graph, session, model, image_dims, domain):
        self._graph = graph
        self._session = session
        self._model = model
        self._image_dims = image_dims
        self._domain = domain
        probs_names = [f"p({x})" for x in domain]
        self._column_names = ["predicted_label", "predicted_label_id"] + probs_names

    def predict(
        self,
        input,
        params: dict[str, Any] | None = None,
    ):
        """
        Generate predictions for the data.

        Args:
            input: pandas.DataFrame with one column containing images to be scored. The image
                column must contain base64 encoded binary content of the image files. The image
                format must be supported by PIL (e.g. jpeg or png).
            params: Additional parameters to pass to the model for inference.

        Returns:
            pandas.DataFrame containing predictions with the following schema:
                Predicted class: string,
                Predicted class index: int,
                Probability(class==0): float,
                ...,
                Probability(class==N): float,
        """

        # decode image bytes from base64 encoding
        def decode_img(x):
            return pd.Series(base64.decodebytes(bytearray(x[0], encoding="utf8")))

        images = input.apply(axis=1, func=decode_img)
        probs = self._predict_images(images)
        m, n = probs.shape
        label_idx = np.argmax(probs, axis=1)
        labels = np.array([self._domain[i] for i in label_idx], dtype=str).reshape(m, 1)
        output_data = np.concatenate((labels, label_idx.reshape(m, 1), probs), axis=1)
        res = pd.DataFrame(columns=self._column_names, data=output_data)
        res.index = input.index
        return res

    def _predict_images(self, images):
        """
        Generate predictions for input images.

        Args:
            images: Binary image data.

        Returns:
            Predicted probabilities for each class.
        """

        def preprocess_f(z):
            return decode_and_resize_image(z, self._image_dims[:2])

        x = np.array(images[images.columns[0]].apply(preprocess_f).tolist())
        with self._graph.as_default():
            with self._session.as_default():
                return self._model.predict(x)


def log_model(keras_model, signature, artifact_path, image_dims, domain):
    """
    Log a KerasImageClassifierPyfunc model as an MLflow artifact for the current run.

    Args:
        keras_model: Keras model to be saved.
        signature: Model signature.
        artifact_path: Run-relative artifact path this model is to be saved to.
        image_dims: Image dimensions the Keras model expects.
        domain: Labels for the classes this model can predict.
    """

    with TempDir() as tmp:
        data_path = tmp.path("image_model")
        os.mkdir(data_path)
        conf = {"image_dims": "/".join(map(str, image_dims)), "domain": "/".join(map(str, domain))}
        with open(os.path.join(data_path, "conf.yaml"), "w") as f:
            yaml.safe_dump(conf, stream=f)
        keras_path = os.path.join(data_path, "keras_model")
        mlflow.tensorflow.save_model(model=keras_model, path=keras_path)
        conda_env = tmp.path("conda_env.yaml")
        with open(conda_env, "w") as f:
            f.write(
                conda_env_template.format(
                    python_version=PYTHON_VERSION,
                    keras_version=keras.__version__,
                    tf_name=tf.__name__,  # can have optional -gpu suffix
                    tf_version=tf.__version__,
                    pip_version=importlib.metadata.version("pip"),
                    pillow_version=PIL.__version__,
                )
            )

        mlflow.pyfunc.log_model(
            name=artifact_path,
            signature=signature,
            loader_module=__name__,
            code_paths=[__file__],
            data_path=data_path,
            conda_env=conda_env,
        )


def _load_pyfunc(path):
    """
    Load the KerasImageClassifierPyfunc model.
    """
    with open(os.path.join(path, "conf.yaml")) as f:
        conf = yaml.safe_load(f)
    keras_model_path = os.path.join(path, "keras_model")
    domain = conf["domain"].split("/")
    image_dims = np.array([int(x) for x in conf["image_dims"].split("/")], dtype=np.int32)
    # NOTE: TensorFlow based models depend on global state (Graph and Session) given by the context.
    # To make sure we score the model in the same session as we loaded it in, we create a new
    # session and a new graph here and store them with the model.
    with tf.Graph().as_default() as g:
        with tf.Session().as_default() as sess:
            keras.backend.set_session(sess)
            keras_model = mlflow.tensorflow.load_model(keras_model_path)
    return KerasImageClassifierPyfunc(g, sess, keras_model, image_dims, domain=domain)


conda_env_template = """
name: flower_classifier
channels:
  - conda-forge
dependencies:
  - python=={python_version}
  - pip=={pip_version}
  - pip:
    - mlflow>=1.6
    - pillow=={pillow_version}
    - keras=={keras_version}
    - {tf_name}=={tf_version}
"""
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/flower_classifier/MLproject

```text
name: FlowerClassifier

python_env: python_env.yaml

entry_points:
  # train Keras DL model
  main:
    parameters:
      training_data: {type: string, default: "./flower_photos"}
      epochs: {type: int, default: 1}
      image_width: {type: int, default: 224}
      image_height: {type: int, default: 224}
      batch_size: {type: int, default: 16}
      test_ratio: {type: float, default: 0.2}
      seed: {type: int, default: 97531}
    command: "python train.py --training-data {training_data}
                              --batch-size {batch_size}
                              --epochs {epochs}
                              --image-width {image_width}
                              --image-height {image_height}
                              --test-ratio {test_ratio}"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/flower_classifier/python_env.yaml

```yaml
build_dependencies:
  - pip==22.2.2
dependencies:
  - mlflow>=1.6
  - pandas==1.5.0
  - scikit-learn==1.1.3
  - tensorflow==2.10.0
  - pillow==9.2.0
```

--------------------------------------------------------------------------------

---[FILE: README.rst]---
Location: mlflow-master/examples/flower_classifier/README.rst

```text
How To Train and Deploy Image Classifier with MLflow and Keras
--------------------------------------------------------------

In this example we demonstrate how to train and deploy image classification models with MLflow.
We train a VGG16 deep learning model to classify flower species from photos using a `dataset
<http://download.tensorflow.org/example_images/flower_photos.tgz>`_ available from `tensorflow.org
<http://www.tensorflow.org>`_. Note that although we use Keras to train the model in this case,
a similar approach can be applied to other deep learning frameworks such as ``PyTorch``.

The MLflow model produced by running this example can be deployed to any MLflow supported endpoints.
All the necessary image preprocessing is packaged with the model. The model can therefore be applied
to image data directly. All that is required in order to pass new data to the model is to encode the
image binary data as base64 encoded string in pandas DataFrame (standard interface for MLflow python
function models). The included Python scripts demonstrate how the model can be deployed to a REST
API endpoint for realtime evaluation or to Spark for batch scoring..

In order to include custom image pre-processing logic with the model, we define the model as a
custom python function model wrapping around the underlying Keras model. The wrapper provides
necessary preprocessing to convert input data into multidimensional arrays expected by the
Keras model. The preprocessing logic is stored with the model as a code dependency. Here is an
example of the output model directory layout:

.. code-block:: bash

   tree model

::

   model
   ├── MLmodel
   ├── code
   │   └── image_pyfunc.py
   ├── data
   │   └── image_model
   │       ├── conf.yaml
   │       └── keras_model
   │           ├── MLmodel
   │           ├── conda.yaml
   │           └── model.h5
   └── mlflow_env.yml



The example contains the following files:

 * MLproject
   Contains definition of this project. Contains only one entry point to train the model.

 * conda.yaml
   Defines project dependencies. NOTE: You might want to change tensorflow package to tensorflow-gpu
   if you have gpu(s) available.

 * train.py
   Main entry point of the projects. Handles command line arguments and possibly downloads the
   dataset.

 * image_pyfunc.py
   The implementation of the model train and also of the outputed custom python flavor model. Note
   that the same preprocessing code that is used during model training is packaged with the output
   model and is used during scoring.

 * score_images_rest.py
   Score an image or a directory of images using a model deployed to a REST endpoint.

 * score_images_spark.py
   Score an image or a directory of images using model deployed to Spark.



Running this Example
^^^^^^^^^^^^^^^^^^^^

To train the model, run the example as a standard MLflow project:


.. code-block:: bash

    mlflow run examples/flower_classifier

This will download the training dataset from ``tensorflow.org``, train a classifier using Keras and
log results with MLflow.

To test your model, run the included scoring scripts. For example, say your model was trained with
run_id ``101``.

- To test REST api scoring do the following two steps:

  1. Deploy the model as a local REST endpoint by running ``mlflow models serve``:

    .. code-block:: bash

        # deploy the model to local REST api endpoint
        mlflow models serve --model-uri runs:/101/model --port 54321

  1. Apply the model to new data using the provided score_images_rest.py script:

    .. code-block:: bash

        # score the deployed model
        python score_images_rest.py --host http://127.0.0.1 --port 54321 /path/to/images/for/scoring


- To test batch scoring in Spark, run score_images_spark.py to score the model in Spark like this:

  .. code-block:: bash

    python score_images_spark.py --model-uri runs:/101/model /path/to/images/for/scoring
```

--------------------------------------------------------------------------------

---[FILE: score_images_rest.py]---
Location: mlflow-master/examples/flower_classifier/score_images_rest.py

```python
"""
Example of scoring images with MLflow model deployed to a REST API endpoint.

The MLflow model to be scored is expected to be an instance of KerasImageClassifierPyfunc
(e.g. produced by running this project) and deployed with MLflow prior to invoking this script.
"""

import base64
import os

import click
import pandas as pd
import requests

from mlflow.utils import cli_args


def score_model(path, host, port):
    """
    Score images on the local path with MLflow model deployed at given uri and port.

    Args:
        path: Path to a single image file or a directory of images.
        host: Host the model is deployed at.
        port: Port the model is deployed at.

    Returns:
        Server response.
    """
    if os.path.isdir(path):
        filenames = [
            os.path.join(path, x) for x in os.listdir(path) if os.path.isfile(os.path.join(path, x))
        ]
    else:
        filenames = [path]

    def read_image(x):
        with open(x, "rb") as f:
            return f.read()

    data = pd.DataFrame(
        data=[base64.encodebytes(read_image(x)) for x in filenames], columns=["image"]
    ).to_json(orient="split")

    response = requests.post(
        url=f"{host}:{port}/invocations",
        data={
            "dataframe_split": data,
        },
        headers={"Content-Type": "application/json"},
    )

    if response.status_code != 200:
        raise Exception(f"Status Code {response.status_code}. {response.text}")
    return response


@click.command(help="Score images.")
@click.option("--port", type=click.INT, default=80, help="Port at which the model is deployed.")
@cli_args.HOST
@click.argument("data-path")
def run(data_path, host, port):
    """
    Score images with MLflow deployed deployed at given uri and port and print out the response
    to standard out.
    """
    print(score_model(data_path, host, port).text)


if __name__ == "__main__":
    run()
```

--------------------------------------------------------------------------------

---[FILE: score_images_spark.py]---
Location: mlflow-master/examples/flower_classifier/score_images_spark.py

```python
"""
Example of scoring images with MLflow model produced by running this project in Spark.

The MLflow model is loaded to Spark using ``mlflow.pyfunc.spark_udf``. The images are read as binary
data and represented as base64 encoded string column and passed to the model. The results are
returned as a column with predicted class label, class id and probabilities for each class encoded
as an array of strings.

"""

import base64
import os

import click
import pandas as pd
import pyspark
from pyspark.sql.types import ArrayType, Row, StringType, StructField, StructType

import mlflow
import mlflow.pyfunc
from mlflow.utils import cli_args


def read_image_bytes_base64(path):
    with open(path, "rb") as f:
        return str(base64.encodebytes(f.read()), encoding="utf8")


def read_images(spark, filenames):
    filenames_rdd = spark.sparkContext.parallelize(filenames)
    schema = StructType(
        [StructField("filename", StringType(), True), StructField("image", StringType(), True)]
    )
    return filenames_rdd.map(lambda x: Row(filename=x, image=read_image_bytes_base64(x))).toDF(
        schema=schema
    )


def score_model(spark, data_path, model_uri):
    if os.path.isdir(data_path):
        filenames = [
            os.path.abspath(os.path.join(data_path, x))
            for x in os.listdir(data_path)
            if os.path.isfile(os.path.join(data_path, x))
        ]
    else:
        filenames = [data_path]

    image_classifier_udf = mlflow.pyfunc.spark_udf(
        spark=spark, model_uri=model_uri, result_type=ArrayType(StringType())
    )

    image_df = read_images(spark, filenames)

    raw_preds = (
        image_df.withColumn("prediction", image_classifier_udf("image"))
        .select(["filename", "prediction"])
        .toPandas()
    )
    # load the pyfunc model to get our domain
    pyfunc_model = mlflow.pyfunc.load_model(model_uri=model_uri)
    preds = pd.DataFrame(raw_preds["filename"], index=raw_preds.index)
    preds[pyfunc_model._column_names] = pd.DataFrame(
        raw_preds["prediction"].values.tolist(),
        columns=pyfunc_model._column_names,
        index=raw_preds.index,
    )

    preds = pd.DataFrame(raw_preds["filename"], index=raw_preds.index)

    preds[pyfunc_model._column_names] = pd.DataFrame(
        raw_preds["prediction"].values.tolist(),
        columns=pyfunc_model._column_names,
        index=raw_preds.index,
    )
    return preds.to_json(orient="records")


@click.command(help="Score images.")
@cli_args.MODEL_URI
@click.argument("data-path")
def run(data_path, model_uri):
    with (
        pyspark.sql.SparkSession.builder.config(key="spark.python.worker.reuse", value=True)
        .config(key="spark.ui.enabled", value=False)
        .master("local-cluster[2, 1, 1024]")
        .getOrCreate() as spark
    ):
        # ignore spark log output
        spark.sparkContext.setLogLevel("OFF")
        print(score_model(spark, data_path, model_uri))


if __name__ == "__main__":
    run()
```

--------------------------------------------------------------------------------

````
