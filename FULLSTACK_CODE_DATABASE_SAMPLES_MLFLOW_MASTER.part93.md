---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 93
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 93 of 991)

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

---[FILE: MME_Tutorial.ipynb]---
Location: mlflow-master/docs/docs/classic-ml/traditional-ml/tutorials/serving-multiple-models-with-pyfunc/notebooks/MME_Tutorial.ipynb

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
     "nuid": "2877aa82-8820-4685-b646-fb475f4f9af6",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "# Deploy an MLflow `PyFunc` model with Model Serving\n",
    "\n",
    "In this notebook, learn how to deploy a custom MLflow PyFunc model to a serving endpoint. MLflow pyfunc offers greater flexibility and customization to your deployment. You can run any custom model, add preprocessing or post-processing logic, or execute any arbitrary Python code. While using the MLflow built-in flavor is recommended for optimal performance, you can use MLflow PyFunc models where more customization is required. "
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
     "nuid": "7e55e4c6-b8c8-4edb-8745-42414175e906",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "## Install and import libraries "
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 13,
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "213.32s - pydevd: Sending message related to process being replaced timed-out after 5 seconds\n"
     ]
    }
   ],
   "source": [
    "%pip install --upgrade mlflow scikit-learn -q"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "ddca5a37-60a7-4a0a-81c6-684a3296f51b",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "import json\n",
    "import warnings\n",
    "\n",
    "import numpy as np\n",
    "import pandas as pd\n",
    "import requests\n",
    "from sklearn.ensemble import RandomForestRegressor\n",
    "\n",
    "import mlflow\n",
    "from mlflow.models import infer_signature\n",
    "\n",
    "warnings.filterwarnings(\"ignore\")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "d15dfcfe-b2f7-4e56-8b1c-e1a137235742",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "DOW_MODEL_NAME_PREFIX = \"DOW_model_\"\n",
    "MME_MODEL_NAME = \"MME_DOW_model\""
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
     "nuid": "2dfb4e47-62f4-428a-b956-19402e664bc8",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "## 1 - Create Some Sample Models"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "3420ad3e-fe51-4974-af8f-f0d71fdbf4f4",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "#### 1.1 - Create Dummy Data"
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
     "nuid": "3753aa5a-9f27-4c98-9058-b7ec50fcaa8b",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "(15000, 5)\n"
     ]
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
       "      <th>x1</th>\n",
       "      <th>x2</th>\n",
       "      <th>x3</th>\n",
       "      <th>y</th>\n",
       "      <th>dow</th>\n",
       "    </tr>\n",
       "  </thead>\n",
       "  <tbody>\n",
       "    <tr>\n",
       "      <th>2024-01-26 18:30:42.810981</th>\n",
       "      <td>-1.137854</td>\n",
       "      <td>0.165915</td>\n",
       "      <td>0.711107</td>\n",
       "      <td>0.046467</td>\n",
       "      <td>4</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>2024-01-27 18:30:42.810981</th>\n",
       "      <td>0.475331</td>\n",
       "      <td>-0.749121</td>\n",
       "      <td>0.318395</td>\n",
       "      <td>0.520535</td>\n",
       "      <td>5</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>2024-01-28 18:30:42.810981</th>\n",
       "      <td>2.525948</td>\n",
       "      <td>1.019708</td>\n",
       "      <td>0.038251</td>\n",
       "      <td>-0.270675</td>\n",
       "      <td>6</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>2024-01-29 18:30:42.810981</th>\n",
       "      <td>1.113931</td>\n",
       "      <td>0.376434</td>\n",
       "      <td>-1.464181</td>\n",
       "      <td>-0.069208</td>\n",
       "      <td>0</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>2024-01-30 18:30:42.810981</th>\n",
       "      <td>-0.304569</td>\n",
       "      <td>1.389245</td>\n",
       "      <td>-1.152598</td>\n",
       "      <td>-1.137589</td>\n",
       "      <td>1</td>\n",
       "    </tr>\n",
       "  </tbody>\n",
       "</table>\n",
       "</div>"
      ],
      "text/plain": [
       "                                  x1        x2        x3         y  dow\n",
       "2024-01-26 18:30:42.810981 -1.137854  0.165915  0.711107  0.046467    4\n",
       "2024-01-27 18:30:42.810981  0.475331 -0.749121  0.318395  0.520535    5\n",
       "2024-01-28 18:30:42.810981  2.525948  1.019708  0.038251 -0.270675    6\n",
       "2024-01-29 18:30:42.810981  1.113931  0.376434 -1.464181 -0.069208    0\n",
       "2024-01-30 18:30:42.810981 -0.304569  1.389245 -1.152598 -1.137589    1"
      ]
     },
     "execution_count": 4,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "def create_weekly_dataset(n_dates, n_observations_per_date):\n",
    "    rng = pd.date_range(start=\"today\", periods=n_dates, freq=\"D\")\n",
    "    df = pd.DataFrame(\n",
    "        np.random.randn(n_dates * n_observations_per_date, 4),\n",
    "        columns=[\"x1\", \"x2\", \"x3\", \"y\"],\n",
    "        index=np.tile(rng, n_observations_per_date),\n",
    "    )\n",
    "    df[\"dow\"] = df.index.dayofweek\n",
    "    return df\n",
    "\n",
    "\n",
    "df = create_weekly_dataset(n_dates=30, n_observations_per_date=500)\n",
    "print(df.shape)\n",
    "df.head()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "7e7fe969-003b-4e15-bb5d-0a4b8f66b710",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "#### 1.2 - Train Models for Each Day of the Week"
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
     "nuid": "eef7c545-d93e-4d96-ac8e-9ad2e6a7f305",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "Successfully registered model 'DOW_model_4'.\n",
      "Created version '1' of model 'DOW_model_4'.\n",
      "Successfully registered model 'DOW_model_5'.\n",
      "Created version '1' of model 'DOW_model_5'.\n",
      "Successfully registered model 'DOW_model_6'.\n",
      "Created version '1' of model 'DOW_model_6'.\n",
      "Successfully registered model 'DOW_model_0'.\n",
      "Created version '1' of model 'DOW_model_0'.\n",
      "Successfully registered model 'DOW_model_1'.\n",
      "Created version '1' of model 'DOW_model_1'.\n",
      "Successfully registered model 'DOW_model_2'.\n",
      "Created version '1' of model 'DOW_model_2'.\n",
      "Successfully registered model 'DOW_model_3'.\n",
      "Created version '1' of model 'DOW_model_3'.\n"
     ]
    }
   ],
   "source": [
    "for dow in df[\"dow\"].unique():\n",
    "    # Create dataset corresponding to a single day of the week\n",
    "    X = df.loc[df[\"dow\"] == dow]\n",
    "    X.pop(\"dow\")  # Remove DOW as a predictor column\n",
    "    y = X.pop(\"y\")\n",
    "\n",
    "    # Fit our DOW model\n",
    "    model = RandomForestRegressor().fit(X, y)\n",
    "\n",
    "    # Infer signature of the model\n",
    "    signature = infer_signature(X, model.predict(X))\n",
    "\n",
    "    with mlflow.start_run():\n",
    "        model_path = f\"model_{dow}\"\n",
    "\n",
    "        # Log and register our DOW model with signature\n",
    "        mlflow.sklearn.log_model(\n",
    "            model,\n",
    "            name=model_path,\n",
    "            signature=signature,\n",
    "            registered_model_name=f\"{DOW_MODEL_NAME_PREFIX}{dow}\",\n",
    "        )\n",
    "        mlflow.set_tag(\"dow\", dow)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "54990a4b-471f-4dea-b188-bfeef668906f",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "#### 1.3 - Test inference on our DOW models"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 6,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "5028c3aa-236d-4676-adb4-d6ca9dbce977",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "[-0.8571552   0.61833952  0.61625155  0.28999143  0.49778144]\n"
     ]
    }
   ],
   "source": [
    "# Load Tuesday's model\n",
    "tuesday_dow = 1\n",
    "model_name = f\"{DOW_MODEL_NAME_PREFIX}{tuesday_dow}\"\n",
    "model_uri = f\"models:/{model_name}/latest\"\n",
    "model = mlflow.sklearn.load_model(model_uri)\n",
    "\n",
    "# Perform inference using our training data for Tuesday\n",
    "predictor_columns = [column for column in df.columns if column not in {\"y\", \"dow\"}]\n",
    "head_of_training_data = df.loc[df[\"dow\"] == tuesday_dow, predictor_columns].head()\n",
    "tuesday_fitted_values = model.predict(head_of_training_data)\n",
    "print(tuesday_fitted_values)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "9a6ce232-30ec-4ed6-9ab5-01019d55d8fe",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "## 2 - Create an MME Custom PyFunc Model"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "f42d5214-01f4-4399-9096-6d82380cedd7",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "#### 2.1 - Create a Child Implementation of `mlflow.pyfunc.PythonModel`"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 7,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "3e8df098-35c5-4792-8c5d-85c61ec42a25",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "class DOWModel(mlflow.pyfunc.PythonModel):\n",
    "    def __init__(self, model_uris):\n",
    "        self.model_uris = model_uris\n",
    "        self.models = {}\n",
    "\n",
    "    @staticmethod\n",
    "    def _model_uri_to_dow(model_uri: str) -> int:\n",
    "        return int(model_uri.split(\"/\")[-2].split(\"_\")[-1])\n",
    "\n",
    "    def load_context(self, context):\n",
    "        self.models = {\n",
    "            self._model_uri_to_dow(model_uri): mlflow.sklearn.load_model(model_uri)\n",
    "            for model_uri in self.model_uris\n",
    "        }\n",
    "\n",
    "    def predict(self, context, model_input, params):\n",
    "        # Parse the dow parameter\n",
    "        dow = params.get(\"dow\")\n",
    "        if dow is None:\n",
    "            raise ValueError(\"DOW param is not passed.\")\n",
    "\n",
    "        # Get the model associated with the dow parameter\n",
    "        model = self.models.get(dow)\n",
    "        if model is None:\n",
    "            raise ValueError(f\"Model {dow} version was not found: {self.models.keys()}.\")\n",
    "\n",
    "        # Perform inference\n",
    "        return model.predict(model_input)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "2bd010c9-3374-4036-ad18-e4977cf5efc7",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "#### 2.2 - Test our Implementation"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 8,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "14d1ad9d-c1ae-4b01-abe3-5f51cc99d3fe",
     "showTitle": false,
     "title": ""
    }
   },
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
       "      <th>x1</th>\n",
       "      <th>x2</th>\n",
       "      <th>x3</th>\n",
       "    </tr>\n",
       "  </thead>\n",
       "  <tbody>\n",
       "    <tr>\n",
       "      <th>2024-01-30 18:30:42.810981</th>\n",
       "      <td>-0.304569</td>\n",
       "      <td>1.389245</td>\n",
       "      <td>-1.152598</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>2024-02-06 18:30:42.810981</th>\n",
       "      <td>0.521323</td>\n",
       "      <td>0.814452</td>\n",
       "      <td>0.115571</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>2024-02-13 18:30:42.810981</th>\n",
       "      <td>0.229761</td>\n",
       "      <td>-1.936210</td>\n",
       "      <td>0.139201</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>2024-02-20 18:30:42.810981</th>\n",
       "      <td>-0.865488</td>\n",
       "      <td>1.024857</td>\n",
       "      <td>-0.857649</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>2024-01-30 18:30:42.810981</th>\n",
       "      <td>-1.454631</td>\n",
       "      <td>0.462055</td>\n",
       "      <td>0.703858</td>\n",
       "    </tr>\n",
       "  </tbody>\n",
       "</table>\n",
       "</div>"
      ],
      "text/plain": [
       "                                  x1        x2        x3\n",
       "2024-01-30 18:30:42.810981 -0.304569  1.389245 -1.152598\n",
       "2024-02-06 18:30:42.810981  0.521323  0.814452  0.115571\n",
       "2024-02-13 18:30:42.810981  0.229761 -1.936210  0.139201\n",
       "2024-02-20 18:30:42.810981 -0.865488  1.024857 -0.857649\n",
       "2024-01-30 18:30:42.810981 -1.454631  0.462055  0.703858"
      ]
     },
     "execution_count": 8,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "head_of_training_data"
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
     "nuid": "1a859e64-7d2f-4fef-b7dc-629b51612172",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Model URIs:\n",
      "['models:/DOW_model_4/latest', 'models:/DOW_model_5/latest', 'models:/DOW_model_6/latest', 'models:/DOW_model_0/latest', 'models:/DOW_model_1/latest', 'models:/DOW_model_2/latest', 'models:/DOW_model_3/latest']\n",
      "\n",
      "Tuesday fitted values:\n",
      "[-0.8571552   0.61833952  0.61625155  0.28999143  0.49778144]\n"
     ]
    }
   ],
   "source": [
    "# Instantiate our DOW MME\n",
    "model_uris = [f\"models:/{DOW_MODEL_NAME_PREFIX}{i}/latest\" for i in df[\"dow\"].unique()]\n",
    "dow_model = DOWModel(model_uris)\n",
    "dow_model.load_context(None)\n",
    "print(\"Model URIs:\")\n",
    "print(model_uris)\n",
    "\n",
    "# Perform inference using our training data for Tuesday\n",
    "params = {\"dow\": 1}\n",
    "mme_tuesday_fitted_values = dow_model.predict(None, head_of_training_data, params=params)\n",
    "assert all(tuesday_fitted_values == mme_tuesday_fitted_values)\n",
    "\n",
    "print(\"\\nTuesday fitted values:\")\n",
    "print(mme_tuesday_fitted_values)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "815fb2f7-f1fb-4707-bc79-096171b59af3",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "#### 2.3 - Register our Custom PyFunc Model"
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
     "nuid": "858fa086-975b-4f04-91f3-fa396217a92a",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "inputs: \n",
      "  ['x1': double (required), 'x2': double (required), 'x3': double (required)]\n",
      "outputs: \n",
      "  [Tensor('float64', (-1,))]\n",
      "params: \n",
      "  ['dow': long (default: 1)]\n",
      "\n"
     ]
    },
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "Successfully registered model 'MME_DOW_model'.\n",
      "Created version '1' of model 'MME_DOW_model'.\n"
     ]
    }
   ],
   "source": [
    "with mlflow.start_run():\n",
    "    # Instantiate the custom pyfunc model\n",
    "    model = DOWModel(model_uris)\n",
    "    model.load_context(None)\n",
    "    model_path = \"MME_model_path\"\n",
    "\n",
    "    signature = infer_signature(\n",
    "        model_input=head_of_training_data,\n",
    "        model_output=tuesday_fitted_values,\n",
    "        params=params,\n",
    "    )\n",
    "    print(signature)\n",
    "\n",
    "    # Log the model to the experiment\n",
    "    mlflow.pyfunc.log_model(\n",
    "        name=model_path,\n",
    "        python_model=model,\n",
    "        signature=signature,\n",
    "        pip_requirements=[\"scikit-learn=1.3.2\"],\n",
    "        registered_model_name=MME_MODEL_NAME,  # also register the model for easy access\n",
    "    )\n",
    "\n",
    "    # Set some relevant information about our model\n",
    "    # (Assuming model has a property 'models' that can be counted)\n",
    "    mlflow.log_param(\"num_models\", len(model.models))"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {},
     "inputWidgets": {},
     "nuid": "62500462-0849-4c1c-93e1-b98809658d5f",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "## 3 - Serve our Model\n",
    "To test our endpoint, let's serve our model on our local machine. \n",
    "1. Open a new shell window in the root containing `mlruns` directory e.g. the same directory you ran this notebook.\n",
    "2. Ensure mlflow is installed: `pip install --upgrade mlflow scikit-learn`\n",
    "3. Run the bash command printed below."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 11,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "cbd02c0c-7c86-446a-846d-62fcea65f4bd",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Run the below command in a new window. You must be in the same repo as your mlruns directory and have mlflow installed...\n",
      "    mlflow models serve -m \"models:/MME_DOW_model/latest\" --env-manager local -p 1234\n"
     ]
    }
   ],
   "source": [
    "PORT = 1234\n",
    "print(\n",
    "    f\"\"\"Run the below command in a new window. You must be in the same repo as your mlruns directory and have mlflow installed...\n",
    "    mlflow models serve -m \"models:/{MME_MODEL_NAME}/latest\" --env-manager local -p {PORT}\"\"\"\n",
    ")"
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
     "nuid": "e6fc2cf8-3217-4696-a04f-d1040c886ba8",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "## 4 - Query our Served Model"
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
     "nuid": "36cc8fdd-5c1f-46f0-b84b-a17663954c15",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Inference on dow model 1 (Tuesday):\n",
      "{'predictions': [-0.8571551951905747, 0.618339524354309, 0.6162515496343108, 0.2899914313294642, 0.4977814353066934]}\n"
     ]
    }
   ],
   "source": [
    "def score_model(pdf, params):\n",
    "    headers = {\"Content-Type\": \"application/json\"}\n",
    "    url = f\"http://127.0.0.1:{PORT}/invocations\"\n",
    "    ds_dict = {\"dataframe_split\": pdf, \"params\": params}\n",
    "    data_json = json.dumps(ds_dict, allow_nan=True)\n",
    "\n",
    "    response = requests.request(method=\"POST\", headers=headers, url=url, data=data_json)\n",
    "    response.raise_for_status()\n",
    "\n",
    "    return response.json()\n",
    "\n",
    "\n",
    "print(\"Inference on dow model 1 (Tuesday):\")\n",
    "inference_df = head_of_training_data.reset_index(drop=True).to_dict(orient=\"split\")\n",
    "print(score_model(inference_df, params={\"dow\": 1}))"
   ]
  }
 ],
 "metadata": {
  "application/vnd.databricks.v1+notebook": {
   "dashboards": [],
   "language": "python",
   "notebookMetadata": {
    "mostRecentlyExecutedCommandWithImplicitDF": {
     "commandId": -1,
     "dataframes": [
      "_sqldf"
     ]
    },
    "pythonIndentUnit": 2
   },
   "notebookName": "MME Tutorial",
   "widgets": {}
  },
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
   "version": "3.8.0"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 4
}
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/traditional-ml/xgboost/index.mdx

```text
---
sidebar_position: 1
sidebar_label: XGBoost
---

import FeatureHighlights from "@site/src/components/FeatureHighlights";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { Zap, Package, TrendingUp, GitBranch, BarChart3, Rocket, Server } from "lucide-react";

# MLflow XGBoost Integration

## Introduction

**XGBoost** (eXtreme Gradient Boosting) is a popular gradient boosting library for structured data. MLflow provides native integration with XGBoost for experiment tracking, model management, and deployment.

This integration supports both the native XGBoost API and scikit-learn compatible interface, making it easy to track experiments and deploy models regardless of which API you prefer.

## Why MLflow + XGBoost?

<FeatureHighlights features={[
  {
    icon: Zap,
    title: "Automatic Logging",
    description: "Single line of code (mlflow.xgboost.autolog()) captures all parameters, metrics per boosting round, and feature importance without manual instrumentation."
  },
  {
    icon: Package,
    title: "Complete Model Recording",
    description: "Logs trained models with serialization format, input/output signatures, model dependencies, and Python environment for reproducible deployments."
  },
  {
    icon: TrendingUp,
    title: "Hyperparameter Tuning",
    description: "Automatically creates child runs for GridSearchCV and RandomizedSearchCV, tracking all parameter combinations and their performance metrics."
  },
  {
    icon: GitBranch,
    title: "Dual API Support",
    description: "Works with both native XGBoost API (xgb.train) and scikit-learn compatible estimators (XGBClassifier, XGBRegressor) with the same autologging functionality."
  }
]} />

## Getting Started

Get started with XGBoost and MLflow in just a few lines of code:

```python
import mlflow
import xgboost as xgb
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split

# Enable autologging - captures everything automatically
mlflow.xgboost.autolog()

# Load and prepare data
data = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

# Prepare data in XGBoost format
dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

# Train model - MLflow automatically logs everything!
with mlflow.start_run():
    model = xgb.train(
        params={
            "objective": "reg:squarederror",
            "max_depth": 6,
            "learning_rate": 0.1,
        },
        dtrain=dtrain,
        num_boost_round=100,
        evals=[(dtrain, "train"), (dtest, "test")],
    )
```

Autologging captures parameters, metrics per iteration, feature importance with visualizations, and the trained model.

:::tip Tracking Server Setup
Running locally? MLflow stores experiments in the current directory by default. For team collaboration or remote tracking, **[set up a tracking server](/ml/tracking/tutorials/remote-server)**.
:::

## Autologging

Enable autologging to automatically track XGBoost experiments with a single line of code:

<Tabs>
  <TabItem value="native" label="Native XGBoost API" default>

```python
import mlflow
import xgboost as xgb
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split

# Load data
data = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

# Enable autologging
mlflow.xgboost.autolog()

# Train with native API
with mlflow.start_run():
    dtrain = xgb.DMatrix(X_train, label=y_train)
    model = xgb.train(
        params={"objective": "reg:squarederror", "max_depth": 6},
        dtrain=dtrain,
        num_boost_round=100,
    )
```

  </TabItem>
  <TabItem value="sklearn" label="Scikit-learn API">

```python
import mlflow
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor

# Load data
data = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

# Enable sklearn autologging (works with XGBoost estimators)
mlflow.sklearn.autolog()

# Train with sklearn-compatible API
with mlflow.start_run():
    model = XGBRegressor(n_estimators=100, max_depth=6)
    model.fit(X_train, y_train)
```

  </TabItem>
</Tabs>

### What Gets Logged

When autologging is enabled, MLflow automatically captures:

- **Parameters**: All booster parameters and training configuration
- **Metrics**: Training and validation metrics for each boosting round
- **Feature Importance**: Multiple importance types (weight, gain, cover) with visualizations
- **Model**: The trained model with proper serialization format
- **Artifacts**: Feature importance plots and JSON data

### Autolog Configuration

Customize autologging behavior:

```python
mlflow.xgboost.autolog(
    log_input_examples=True,
    log_model_signatures=True,
    log_models=True,
    log_datasets=True,
    model_format="json",  # Recommended for portability
    registered_model_name="XGBoostModel",
    extra_tags={"team": "data-science"},
)
```

## Hyperparameter Tuning

### Grid Search

MLflow automatically creates child runs for hyperparameter tuning:

```python
import mlflow
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import GridSearchCV, train_test_split
from xgboost import XGBClassifier

# Load data
data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

# Enable autologging
mlflow.sklearn.autolog()

# Define parameter grid
param_grid = {
    "n_estimators": [50, 100, 200],
    "max_depth": [3, 6, 9],
    "learning_rate": [0.01, 0.1, 0.3],
}

# Run grid search - MLflow logs each combination as a child run
with mlflow.start_run():
    model = XGBClassifier(random_state=42)
    grid_search = GridSearchCV(model, param_grid, cv=5, scoring="roc_auc", n_jobs=-1)
    grid_search.fit(X_train, y_train)

    print(f"Best score: {grid_search.best_score_}")
```

### Optuna Integration

For more advanced hyperparameter optimization:

```python
import mlflow
import optuna
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

# Load data
data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

mlflow.xgboost.autolog()


def objective(trial):
    params = {
        "n_estimators": trial.suggest_int("n_estimators", 50, 300),
        "max_depth": trial.suggest_int("max_depth", 3, 10),
        "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
        "subsample": trial.suggest_float("subsample", 0.6, 1.0),
        "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
    }

    with mlflow.start_run(nested=True):
        model = XGBClassifier(**params, random_state=42)
        model.fit(X_train, y_train)
        score = model.score(X_test, y_test)
        return score


with mlflow.start_run():
    study = optuna.create_study(direction="maximize")
    study.optimize(objective, n_trials=50)

    mlflow.log_params({f"best_{k}": v for k, v in study.best_params.items()})
    mlflow.log_metric("best_score", study.best_value)
```

## Model Management

Log models with specific configurations:

```python
import mlflow.xgboost
import xgboost as xgb
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split

# Load data
data = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

dtrain = xgb.DMatrix(X_train, label=y_train)

with mlflow.start_run():
    params = {"objective": "reg:squarederror", "max_depth": 6}
    model = xgb.train(params, dtrain, num_boost_round=100)

    mlflow.xgboost.log_model(
        xgb_model=model,
        name="model",
        model_format="json",  # Recommended for portability
        registered_model_name="production_model",
    )
```

:::tip Model Format
Use `model_format="json"` for the best portability across XGBoost versions. The `json` format is human-readable and cross-platform compatible.
:::

Load models for inference:

```python
# Load as native XGBoost model
model = mlflow.xgboost.load_model("runs:/<run_id>/model")

# Load as PyFunc for generic interface
pyfunc_model = mlflow.pyfunc.load_model("runs:/<run_id>/model")

# Load from model registry using alias
model = mlflow.pyfunc.load_model("models:/XGBoostModel@champion")
```

## Model Registry Integration

Register and manage model versions:

```python
import mlflow.xgboost
import xgboost as xgb
from mlflow import MlflowClient
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split

# Load and prepare data
data = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)
dtrain = xgb.DMatrix(X_train, label=y_train)

# Register model during training
with mlflow.start_run():
    params = {"objective": "reg:squarederror", "max_depth": 6}
    model = xgb.train(params, dtrain, num_boost_round=100)

    mlflow.xgboost.log_model(
        xgb_model=model,
        name="model",
        registered_model_name="XGBoostModel",
    )

# Set alias for deployment
client = MlflowClient()
client.set_registered_model_alias(
    name="XGBoostModel",
    alias="champion",
    version=1,
)

# Load model by alias
model = mlflow.pyfunc.load_model("models:/XGBoostModel@champion")
```

## Model Serving

Serve models locally for testing:

```bash
mlflow models serve -m "models:/XGBoostModel@champion" -p 5000
```

Make predictions via REST API:

```python
import requests
import pandas as pd

data = pd.DataFrame(
    {
        "feature1": [1.2, 2.3],
        "feature2": [0.8, 1.5],
        "feature3": [3.4, 4.2],
    }
)

response = requests.post(
    "http://localhost:5000/invocations",
    headers={"Content-Type": "application/json"},
    json={"dataframe_split": data.to_dict(orient="split")},
)

predictions = response.json()
```

Deploy to cloud platforms:

```bash
# Deploy to AWS SageMaker
mlflow deployments create \
    -t sagemaker \
    --name xgboost-endpoint \
    -m models:/XGBoostModel@champion

# Deploy to Azure ML
mlflow deployments create \
    -t azureml \
    --name xgboost-service \
    -m models:/XGBoostModel@champion
```

## Learn More

<TilesGrid>
  <TileCard
    icon={Server}
    title="Tracking Server Setup"
    description="Set up a self-hosted MLflow tracking server for team collaboration and remote experiment tracking."
    href="/ml/tracking/tutorials/remote-server"
  />
  <TileCard
    icon={BarChart3}
    title="Model Evaluation"
    description="Evaluate XGBoost models using MLflow's comprehensive evaluation framework with built-in metrics and custom evaluators."
    href="/ml/evaluation"
  />
  <TileCard
    icon={Rocket}
    title="Model Deployment"
    description="Deploy XGBoost models locally, to Kubernetes, AWS SageMaker, or other cloud platforms using MLflow's deployment tools."
    href="/ml/deployment"
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

````
