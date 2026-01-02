---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 197
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 197 of 991)

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

---[FILE: hpo_mnist.py]---
Location: mlflow-master/examples/pytorch/HPOExample/hpo_mnist.py

```python
"""
Hyperparameter Optimization Example with Pure PyTorch and MLflow

This example demonstrates:
- Using MLflow to track hyperparameter optimization trials
- Parent/child run structure for organizing HPO experiments
- Pure PyTorch training (no Lightning dependencies)
- Simple MNIST classification with configurable hyperparameters

Run with: python hpo_mnist.py --n-trials 5 --max-epochs 3
"""

import argparse

import optuna
import torch
import torch.nn.functional as F
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

import mlflow


class SimpleNet(nn.Module):
    def __init__(self, hidden_size, dropout_rate):
        super().__init__()
        self.fc1 = nn.Linear(784, hidden_size)
        self.dropout = nn.Dropout(dropout_rate)
        self.fc2 = nn.Linear(hidden_size, 10)

    def forward(self, x):
        x = x.view(-1, 784)
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return F.log_softmax(x, dim=1)


def train_epoch(model, device, train_loader, optimizer):
    model.train()
    for data, target in train_loader:
        data = data.to(device)
        target = target.to(device)
        optimizer.zero_grad()
        output = model(data)
        loss = F.nll_loss(output, target)
        loss.backward()
        optimizer.step()


def evaluate(model, device, test_loader):
    model.eval()
    test_loss = 0
    correct = 0
    with torch.no_grad():
        for data, target in test_loader:
            data = data.to(device)
            target = target.to(device)
            output = model(data)
            test_loss += F.nll_loss(output, target, reduction="sum").item()
            pred = output.argmax(dim=1, keepdim=True)
            correct += pred.eq(target.view_as(pred)).sum().item()

    test_loss /= len(test_loader.dataset)
    accuracy = correct / len(test_loader.dataset)
    return test_loss, accuracy


def objective(trial, args, train_loader, test_loader, device):
    # Suggest hyperparameters
    lr = trial.suggest_float("lr", 1e-4, 1e-1, log=True)
    hidden_size = trial.suggest_int("hidden_size", 64, 512, step=64)
    dropout_rate = trial.suggest_float("dropout_rate", 0.1, 0.5)
    batch_size = trial.suggest_categorical("batch_size", [32, 64, 128])

    # Recreate data loaders with new batch size
    train_loader = DataLoader(train_loader.dataset, batch_size=batch_size, shuffle=True)
    test_loader = DataLoader(test_loader.dataset, batch_size=batch_size, shuffle=False)

    # Start nested MLflow run for this trial
    with mlflow.start_run(nested=True, run_name=f"trial_{trial.number}"):
        # Log hyperparameters
        mlflow.log_params(
            {
                "lr": lr,
                "hidden_size": hidden_size,
                "dropout_rate": dropout_rate,
                "batch_size": batch_size,
            }
        )

        # Create model and optimizer
        model = SimpleNet(hidden_size, dropout_rate).to(device)
        optimizer = torch.optim.Adam(model.parameters(), lr=lr)

        # Training loop
        for epoch in range(args.max_epochs):
            train_epoch(model, device, train_loader, optimizer)
            test_loss, accuracy = evaluate(model, device, test_loader)

            # Log metrics for each epoch
            mlflow.log_metrics({"test_loss": test_loss, "accuracy": accuracy}, step=epoch)

        # Return final accuracy for optimization
        return accuracy


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--n-trials", type=int, default=10, help="Number of HPO trials")
    parser.add_argument("--max-epochs", type=int, default=5, help="Epochs per trial")
    parser.add_argument("--batch-size", type=int, default=64, help="Initial batch size")
    args = parser.parse_args()

    # Setup device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Load MNIST data
    transform = transforms.Compose(
        [transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))]
    )

    train_dataset = datasets.MNIST("./data", train=True, download=True, transform=transform)
    test_dataset = datasets.MNIST("./data", train=False, transform=transform)

    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=args.batch_size, shuffle=False)

    # Start parent MLflow run
    with mlflow.start_run(run_name="HPO_Parent"):
        mlflow.log_params({"n_trials": args.n_trials, "max_epochs": args.max_epochs})

        # Create Optuna study
        study = optuna.create_study(direction="maximize", study_name="mnist_hpo")

        # Run optimization
        study.optimize(
            lambda trial: objective(trial, args, train_loader, test_loader, device),
            n_trials=args.n_trials,
        )

        # Log best results to parent run
        mlflow.log_metrics(
            {
                "best_accuracy": study.best_value,
                "best_trial": study.best_trial.number,
            }
        )
        # Log best hyperparameters with 'best_' prefix to avoid conflicts
        best_params = {f"best_{k}": v for k, v in study.best_params.items()}
        mlflow.log_params(best_params)

        print(f"\nBest trial: {study.best_trial.number}")
        print(f"Best accuracy: {study.best_value:.4f}")
        print(f"Best params: {study.best_params}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/pytorch/HPOExample/MLproject

```text
name: pytorch-hpo-example

python_env: python_env.yaml

entry_points:
  main:
    parameters:
      n_trials: {type: int, default: 10}
      max_epochs: {type: int, default: 5}
      batch_size: {type: int, default: 64}
    command: "python hpo_mnist.py --n-trials {n_trials} --max-epochs {max_epochs} --batch-size {batch_size}"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/pytorch/HPOExample/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow
  - torch>=2.1
  - torchvision>=0.15.1
  - optuna>=3.0.0
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/pytorch/HPOExample/README.md

```text
# PyTorch Hyperparameter Optimization Example

This example demonstrates hyperparameter optimization with MLflow tracking using pure PyTorch (no Lightning dependencies).

## What it demonstrates

- **MLflow nested runs**: Parent run tracks the overall HPO experiment, child runs track individual trials
- **Hyperparameter tuning**: Uses Optuna to optimize learning rate, hidden layer size, dropout rate, and batch size
- **Pure PyTorch**: Simple, clean implementation without framework overhead
- **Fast training**: MNIST classification completes quickly for rapid iteration

## Architecture

The model is a simple 2-layer neural network:

```
Input (784) → FC1 (hidden_size) → ReLU → Dropout → FC2 (10) → LogSoftmax
```

## Hyperparameters optimized

- `lr`: Learning rate (1e-4 to 1e-1, log scale)
- `hidden_size`: Hidden layer size (64 to 512, step 64)
- `dropout_rate`: Dropout probability (0.1 to 0.5)
- `batch_size`: Batch size (32, 64, or 128)

## Running the example

### Quick test (3 trials, 3 epochs each)

```bash
python hpo_mnist.py --n-trials 3 --max-epochs 3
```

### Full optimization (10 trials, 5 epochs each)

```bash
python hpo_mnist.py --n-trials 10 --max-epochs 5
```

### Using MLflow projects

```bash
mlflow run . -P n_trials=5 -P max_epochs=3
```

## Viewing results

After running, view the results in MLflow UI:

```bash
mlflow server
```

Navigate to http://localhost:5000 to see:

- Parent run with overall HPO results
- Child runs for each trial with their hyperparameters and metrics
- Comparison view to analyze which hyperparameters work best

## Dependencies

- `torch>=2.1`: PyTorch for model training
- `torchvision>=0.15.1`: MNIST dataset
- `optuna>=3.0.0`: Hyperparameter optimization framework
- `mlflow`: Experiment tracking

**No Lightning, no torchmetrics, no transformers** = no dependency conflicts! 🎉
```

--------------------------------------------------------------------------------

---[FILE: pytorch_log_model.ipynb]---
Location: mlflow-master/examples/pytorch/logging/pytorch_log_model.ipynb

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
     "nuid": "7066087c-6947-4a50-a7fb-6ab71c004ccf",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "# Log Your PyTorch Model to mlflow\n",
    "\n",
    "This guide will walk you through how to save your PyTorch model to mlflow and load the saved model for inference. Saving a pretrained/finetuned model in MLflow allows you to easily share the model or deploy it to production.\n",
    "\n",
    "We will cover how to:\n",
    "- Define a simple pytorch model\n",
    "- Set a model signature for our logged model to define inputs and outputs to the mlflow model\n",
    "- Log our model to MLflow server\n",
    "- Load the model back from storage to use in other notebooks"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Start mlflow Server\n",
    "You can either:\n",
    "- Start a local tracking server by running `mlflow server` within the same directory that your notebook is in\n",
    "  - Please follow [this section of the contributing guide](https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md#javascript-and-ui) to get the UI set up.\n",
    "- Use a tracking server, as described in [this overview](https://mlflow.org/docs/latest/getting-started/tracking-server-overview/index.html)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "Install dependencies"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 1,
   "metadata": {
    "application/vnd.databricks.v1+cell": {
     "cellMetadata": {
      "byteLimit": 2048000,
      "rowLimit": 10000
     },
     "inputWidgets": {},
     "nuid": "885e8968-cc18-48db-af92-1b034c6ea3af",
     "showTitle": false,
     "title": ""
    },
    "jupyter": {
     "outputs_hidden": true
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "\n",
      "\u001b[1m[\u001b[0m\u001b[34;49mnotice\u001b[0m\u001b[1;39;49m]\u001b[0m\u001b[39;49m A new release of pip is available: \u001b[0m\u001b[31;49m23.2.1\u001b[0m\u001b[39;49m -> \u001b[0m\u001b[32;49m23.3.1\u001b[0m\n",
      "\u001b[1m[\u001b[0m\u001b[34;49mnotice\u001b[0m\u001b[1;39;49m]\u001b[0m\u001b[39;49m To update, run: \u001b[0m\u001b[32;49mpip install --upgrade pip\u001b[0m\n",
      "Note: you may need to restart the kernel to use updated packages.\n"
     ]
    }
   ],
   "source": [
    "%pip install -q mlflow torch torchmetrics"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "Import packages"
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
     "nuid": "092ae65d-cebd-4778-8db5-400097966a3e",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "/Users/bryan.qiu/.pyenv/versions/3.8.13/envs/mlflow/lib/python3.8/site-packages/pydantic/_internal/_fields.py:149: UserWarning: Field \"model_server_url\" has conflict with protected namespace \"model_\".\n",
      "\n",
      "You may be able to resolve this warning by setting `model_config['protected_namespaces'] = ()`.\n",
      "  warnings.warn(\n",
      "/Users/bryan.qiu/.pyenv/versions/3.8.13/envs/mlflow/lib/python3.8/site-packages/pydantic/_internal/_config.py:318: UserWarning: Valid config keys have changed in V2:\n",
      "* 'schema_extra' has been renamed to 'json_schema_extra'\n",
      "  warnings.warn(message, UserWarning)\n"
     ]
    }
   ],
   "source": [
    "import torch\n",
    "import torchmetrics\n",
    "from sklearn.datasets import load_iris\n",
    "from sklearn.model_selection import train_test_split\n",
    "from sklearn.preprocessing import StandardScaler\n",
    "from torch import nn\n",
    "from torch.utils.data import DataLoader, TensorDataset\n",
    "\n",
    "import mlflow\n",
    "import mlflow.pytorch"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## Prepare the data\n",
    "\n",
    "The Iris dataset is a popular beginner's dataset for classification models that contains measurements of 3 species of Iris flowers. If you want, more information can be found [at this link](https://archive.ics.uci.edu/dataset/53/iris).\n",
    "\n",
    " We are loading the data, standardizing it, splitting it into training and testing sets, converting it into the format required by PyTorch, and preparing it for efficient training in mini-batches."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Load and preprocess the Iris dataset\n",
    "iris = load_iris()\n",
    "X = iris.data\n",
    "y = iris.target\n",
    "\n",
    "# Standardize features\n",
    "scaler = StandardScaler()\n",
    "X_scaled = scaler.fit_transform(X)\n",
    "\n",
    "# Split the data into training and testing sets\n",
    "X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)\n",
    "\n",
    "# Convert arrays to PyTorch tensors\n",
    "X_train_tensor = torch.tensor(X_train, dtype=torch.float32)\n",
    "y_train_tensor = torch.tensor(y_train, dtype=torch.long)\n",
    "X_test_tensor = torch.tensor(X_test, dtype=torch.float32)\n",
    "y_test_tensor = torch.tensor(y_test, dtype=torch.long)\n",
    "\n",
    "# Create datasets and dataloaders\n",
    "train_dataset = TensorDataset(X_train_tensor, y_train_tensor)\n",
    "train_loader = DataLoader(dataset=train_dataset, batch_size=16)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "Define your pytorch model"
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
     "nuid": "51760571-74ad-4053-9191-b82fb061c3f5",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [],
   "source": [
    "# Define a simple neural network model\n",
    "class SimpleNN(nn.Module):\n",
    "    def __init__(self):\n",
    "        super().__init__()\n",
    "        self.fc1 = nn.Linear(4, 10)\n",
    "        self.fc2 = nn.Linear(10, 3)\n",
    "\n",
    "    def forward(self, x):\n",
    "        x = torch.relu(self.fc1(x))\n",
    "        x = self.fc2(x)\n",
    "        return x\n",
    "\n",
    "\n",
    "model = SimpleNN()\n",
    "loss = nn.CrossEntropyLoss()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Define the model signature\n",
    "\n",
    "A model signature defines valid input, output and params schema, and is used to validate them at inference time. `mlflow.models.infer_signature` infers the model signature that can be passed into `mlflow.pytorch.log_model`.\n",
    "\n",
    "Since pytorch model's usually operate on tensors, we need to convert both the input and output into a type compatible with `mlflow.models.infer_signature`. Commonly, this means converting them into a `numpy.ndarray` or a dictionary of `numpy.ndarray`  (if the output is multiple tensors).\n",
    "\n",
    "For more information about infer_signature, please read [the `mlflow.models.infer_signature` docs](https://mlflow.org/docs/latest/python_api/mlflow.models.html#mlflow.models.infer_signature).\n",
    "\n",
    "If you've already logged a model, you can add a signature to the logged model with [this API](https://www.mlflow.org/docs/2.8.0/models.html#set-signature-on-logged-model) as well."
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
     "nuid": "2b17c594-aa9a-4e0d-86fe-28d687dfa658",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Model signature: inputs: \n",
      "  [Tensor('float32', (-1, 4))]\n",
      "outputs: \n",
      "  [Tensor('float32', (-1, 3))]\n",
      "params: \n",
      "  None\n",
      "\n"
     ]
    }
   ],
   "source": [
    "from mlflow.models.signature import infer_signature\n",
    "\n",
    "# Infer the signature of the model\n",
    "sample_input = X_train_tensor[:1]\n",
    "model.eval()\n",
    "with torch.no_grad():\n",
    "    sample_output = model(sample_input)\n",
    "signature = infer_signature(sample_input.numpy(), sample_output.numpy())\n",
    "\n",
    "print(\"Model signature:\", signature)"
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
     "nuid": "4525800f-012c-4203-84d2-cb4017dc3d93",
     "showTitle": false,
     "title": ""
    }
   },
   "source": [
    "Start an mlflow run and see how our model performs!"
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
     "nuid": "92645e70-05dd-47ea-a459-d4ca3726b77c",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Epoch 1, Loss: 0.9870926588773727, Accuracy: 0.3359375\n",
      "Epoch 2, Loss: 0.9870926588773727, Accuracy: 0.3359375\n",
      "Epoch 3, Loss: 0.9870926588773727, Accuracy: 0.3359375\n",
      "Epoch 4, Loss: 0.9870926588773727, Accuracy: 0.3359375\n",
      "Epoch 5, Loss: 0.9870926588773727, Accuracy: 0.3359375\n",
      "Model training and logging complete.\n"
     ]
    },
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "/Users/bryan.qiu/.pyenv/versions/3.8.13/envs/mlflow/lib/python3.8/site-packages/_distutils_hack/__init__.py:33: UserWarning: Setuptools is replacing distutils.\n",
      "  warnings.warn(\"Setuptools is replacing distutils.\")\n"
     ]
    }
   ],
   "source": [
    "mlflow.set_experiment(\"iris_classification_pytorch\")\n",
    "\n",
    "# Start an MLflow run\n",
    "with mlflow.start_run() as run:\n",
    "    accuracy_metric = torchmetrics.Accuracy(\n",
    "        task=\"multiclass\", num_classes=3\n",
    "    )  # Instantiate the Accuracy metric\n",
    "\n",
    "    for epoch in range(5):  # number of epochs\n",
    "        total_loss = 0\n",
    "        total_accuracy = 0\n",
    "\n",
    "        for inputs, labels in train_loader:\n",
    "            outputs = model(inputs)\n",
    "            curr_loss = loss(outputs, labels)\n",
    "            curr_loss.backward()\n",
    "\n",
    "            total_loss += curr_loss.item()\n",
    "\n",
    "            # Calculate accuracy using torchmetrics\n",
    "            _, preds = torch.max(outputs, 1)\n",
    "            total_accuracy += accuracy_metric(preds, labels).item()\n",
    "\n",
    "        avg_loss = total_loss / len(train_loader)\n",
    "        avg_accuracy = total_accuracy / len(train_loader)\n",
    "\n",
    "        print(f\"Epoch {epoch + 1}, Loss: {avg_loss}, Accuracy: {avg_accuracy}\")\n",
    "        mlflow.log_metric(\"loss\", avg_loss, step=epoch)\n",
    "        mlflow.log_metric(\"accuracy\", avg_accuracy, step=epoch)\n",
    "\n",
    "    # Log the PyTorch model with the signature\n",
    "    mlflow.pytorch.log_model(model, name=\"model\", signature=signature)\n",
    "\n",
    "    # Log parameters\n",
    "    mlflow.log_param(\"epochs\", 10)\n",
    "    mlflow.log_param(\"batch_size\", 16)\n",
    "    mlflow.log_param(\"learning_rate\", 0.001)\n",
    "\n",
    "print(\"Model training and logging complete.\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "Loading the logged model back into memory with `mlflow.pytorch.load_model`"
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
     "nuid": "caac8221-e7bb-4772-9946-acd4c4f331e6",
     "showTitle": false,
     "title": ""
    }
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Run id from the run above: 24cb360323474df7b9090db92237a1e0\n",
      "Original model output: tensor([[-0.2564,  0.4631,  0.2051]])\n",
      "Loaded model output: tensor([[-0.2564,  0.4631,  0.2051]])\n"
     ]
    }
   ],
   "source": [
    "print(\"Run id from the run above:\", run.info.run_id)\n",
    "\n",
    "# Later, or in a different script, you can load the model using the run ID\n",
    "loaded_model = mlflow.pytorch.load_model(f\"runs:/{run.info.run_id}/model\")\n",
    "\n",
    "# you can now use the loaded model as you would've used the original pytorch model!\n",
    "loaded_model.eval()\n",
    "with torch.no_grad():\n",
    "    sample_input = X_test_tensor[:1]\n",
    "    loaded_output = loaded_model(sample_input)\n",
    "    og_output = model(sample_input)\n",
    "    print(\"Original model output:\", og_output)\n",
    "    print(\"Loaded model output:\", loaded_output)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "\n",
    "# What you see in the mlflow UI\n",
    "This is what you would see on the tracking server (either local or hosted, depending on your choice at the beginning)\n",
    "\n",
    "### Experiment page\n",
    "Here, you can select the experiment you set in the code above and choose a run to view the model logged during that run. You can also see how your pytorch model has changed in accuracy / loss over different runs in the `Chart` tab.\n",
    "\n",
    "<img src=\"https://i.imgur.com/hiolwEe.png\" style=\"width: 60%\">\n",
    "\n",
    "### Runs detail page\n",
    "Here, you can see the run ID of this run (used to retrieve the logged model) and the model signature that we set above.\n",
    "\n",
    "<img src=\"https://i.imgur.com/gJN4f2v.png'\" style=\"width: 60%\">\n",
    "\n"
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
   "notebookName": "pytorch log model",
   "widgets": {}
  },
  "kernelspec": {
   "display_name": "mlflow",
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
 "nbformat_minor": 0
}
```

--------------------------------------------------------------------------------

---[FILE: conda.yaml]---
Location: mlflow-master/examples/pytorch/MNIST/conda.yaml

```yaml
channels:
  - conda-forge
dependencies:
  - python=3.8.2
  - pip
  - pip:
      - mlflow
      - torchvision>=0.15.1
      - torch>=2.1
      - lightning
      - jsonargparse[signatures]>=4.17.0
      - protobuf<4.0.0
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/pytorch/MNIST/MLproject

```text
name: mnist-autolog-example

python_env: python_env.yaml

entry_points:
  main:
    parameters:
      max_epochs: {type: int, default: 5}
      devices : {type: str, default: "auto"}
      strategy: {type str, default: "auto"}
      accelerator: {type str, default: "auto"}
      batch_size: {type: int, default: 64}
      num_workers: {type: int, default: 3}
      learning_rate: {type: float, default: 0.001}

    command: |
          python mnist_autolog_example.py \
            --trainer.max_epochs={max_epochs} \
            --trainer.devices={devices} \
            --trainer.strategy={strategy} \
            --trainer.accelerator={accelerator} \
            --data.batch_size={batch_size} \
            --data.num_workers={num_workers} \
            --model.learning_rate={learning_rate}
```

--------------------------------------------------------------------------------

---[FILE: mnist_autolog_example.py]---
Location: mlflow-master/examples/pytorch/MNIST/mnist_autolog_example.py

```python
#
# Trains an MNIST digit recognizer using PyTorch Lightning,
# and uses MLflow to log metrics, params and artifacts
# NOTE: This example requires you to first install
# pytorch-lightning (using pip install pytorch-lightning)
#       and mlflow (using pip install mlflow).
#


import os

import lightning as L
import torch
from lightning.pytorch.callbacks import EarlyStopping, LearningRateMonitor, ModelCheckpoint
from lightning.pytorch.cli import LightningCLI
from torch.nn import functional as F
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms

import mlflow.pytorch


class MNISTDataModule(L.LightningDataModule):
    def __init__(self, batch_size=64, num_workers=3):
        """
        Initialization of inherited lightning data module
        """
        super().__init__()
        self.df_train = None
        self.df_val = None
        self.df_test = None
        self.train_data_loader = None
        self.val_data_loader = None
        self.test_data_loader = None
        self.batch_size = batch_size
        self.num_workers = num_workers

        # transforms for images
        self.transform = transforms.Compose(
            [transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))]
        )

    def setup(self, stage=None):
        """
        Downloads the data, parse it and split the data into train, test, validation data

        Args:
            stage: Stage - training or testing
        """

        self.df_train = datasets.MNIST(
            "dataset", download=True, train=True, transform=self.transform
        )
        self.df_train, self.df_val = random_split(self.df_train, [55000, 5000])
        self.df_test = datasets.MNIST(
            "dataset", download=True, train=False, transform=self.transform
        )

    def create_data_loader(self, df):
        """
        Generic data loader function

        Args:
            df: Input tensor

        Returns:
            Returns the constructed dataloader
        """
        return DataLoader(df, batch_size=self.batch_size, num_workers=self.num_workers)

    def train_dataloader(self):
        """
        Returns:
            output: Train data loader for the given input.
        """
        return self.create_data_loader(self.df_train)

    def val_dataloader(self):
        """
        Returns:
            output: Validation data loader for the given input.
        """
        return self.create_data_loader(self.df_val)

    def test_dataloader(self):
        """
        Returns:
            output: Test data loader for the given input.
        """
        return self.create_data_loader(self.df_test)


class LightningMNISTClassifier(L.LightningModule):
    def __init__(self, learning_rate=0.01):
        """
        Initializes the network
        """
        super().__init__()

        # mnist images are (1, 28, 28) (channels, width, height)
        self.optimizer = None
        self.scheduler = None
        self.layer_1 = torch.nn.Linear(28 * 28, 128)
        self.layer_2 = torch.nn.Linear(128, 256)
        self.layer_3 = torch.nn.Linear(256, 10)
        self.learning_rate = learning_rate
        self.val_outputs = []
        self.test_outputs = []

    def forward(self, x):
        """
        Args:
            x: Input data

        Returns:
            output - mnist digit label for the input image
        """
        batch_size = x.size()[0]

        # (b, 1, 28, 28) -> (b, 1*28*28)
        x = x.view(batch_size, -1)

        # layer 1 (b, 1*28*28) -> (b, 128)
        x = self.layer_1(x)
        x = torch.relu(x)

        # layer 2 (b, 128) -> (b, 256)
        x = self.layer_2(x)
        x = torch.relu(x)

        # layer 3 (b, 256) -> (b, 10)
        x = self.layer_3(x)

        # probability distribution over labels
        x = torch.log_softmax(x, dim=1)

        return x

    def cross_entropy_loss(self, logits, labels):
        """
        Initializes the loss function

        Returns:
            output: Initialized cross entropy loss function.
        """
        return F.nll_loss(logits, labels)

    def training_step(self, train_batch, batch_idx):
        """
        Training the data as batches and returns training loss on each batch

        Args:
            train_batch: Batch data
            batch_idx: Batch indices

        Returns:
            output - Training loss
        """
        x, y = train_batch
        logits = self.forward(x)
        loss = self.cross_entropy_loss(logits, y)
        return {"loss": loss}

    def validation_step(self, val_batch, batch_idx):
        """
        Performs validation of data in batches

        Args:
            val_batch: Batch data
            batch_idx: Batch indices

        Returns:
            output: valid step loss
        """
        x, y = val_batch
        logits = self.forward(x)
        loss = self.cross_entropy_loss(logits, y)
        self.val_outputs.append(loss)
        return {"val_step_loss": loss}

    def on_validation_epoch_end(self):
        """
        Computes average validation loss
        """
        avg_loss = torch.stack(self.val_outputs).mean()
        self.log("val_loss", avg_loss, sync_dist=True)
        self.val_outputs.clear()

    def test_step(self, test_batch, batch_idx):
        """
        Performs test and computes the accuracy of the model

        Args:
            test_batch: Batch data
            batch_idx: Batch indices

        Returns:
            output: Testing accuracy
        """
        x, y = test_batch
        output = self.forward(x)
        _, y_hat = torch.max(output, dim=1)
        test_acc = (y_hat == y).float().mean()
        self.test_outputs.append(test_acc)
        return {"test_acc": test_acc}

    def on_test_epoch_end(self):
        """
        Computes average test accuracy score
        """
        avg_test_acc = torch.stack(self.test_outputs).mean()
        self.log("avg_test_acc", avg_test_acc, sync_dist=True)
        self.test_outputs.clear()

    def configure_optimizers(self):
        """
        Initializes the optimizer and learning rate scheduler

        Returns:
            output: Initialized optimizer and scheduler
        """
        self.optimizer = torch.optim.Adam(self.parameters(), lr=self.learning_rate)
        self.scheduler = {
            "scheduler": torch.optim.lr_scheduler.ReduceLROnPlateau(
                self.optimizer,
                mode="min",
                factor=0.2,
                patience=2,
                min_lr=1e-6,
            ),
            "monitor": "val_loss",
        }
        return [self.optimizer], [self.scheduler]


def cli_main():
    early_stopping = EarlyStopping(
        monitor="val_loss",
    )

    checkpoint_callback = ModelCheckpoint(
        dirpath=os.getcwd(), save_top_k=1, verbose=True, monitor="val_loss", mode="min"
    )
    lr_logger = LearningRateMonitor()
    cli = LightningCLI(
        LightningMNISTClassifier,
        MNISTDataModule,
        run=False,
        save_config_callback=None,
        trainer_defaults={"callbacks": [early_stopping, checkpoint_callback, lr_logger]},
    )
    if cli.trainer.global_rank == 0:
        mlflow.pytorch.autolog()
    cli.trainer.fit(cli.model, datamodule=cli.datamodule)
    cli.trainer.test(ckpt_path="best", datamodule=cli.datamodule)


if __name__ == "__main__":
    cli_main()
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/pytorch/MNIST/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow
  - torchvision>=0.15.1
  - torch>=2.1
  - lightning
  - jsonargparse[signatures]>=4.17.0
  - protobuf<4.0.0
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/pytorch/MNIST/README.md

```text
## MNIST example with MLflow

In this example, we train a Pytorch Lightning model to predict handwritten digits, leveraging early stopping.
The code is almost entirely dedicated to model training, with the addition of a single `mlflow.pytorch.autolog()` call to enable automatic logging of params, metrics, and models,
including the best model from early stopping.

### Running the code

To run the example via MLflow, navigate to the `mlflow/examples/pytorch/MNIST` directory and run the command

```
mlflow run .
```

This will run `mnist_autolog_example.py` with the default set of parameters such as `max_epochs=5`. You can see the default value in the `MLproject` file.

In order to run the file with custom parameters, run the command

```
mlflow run . -P max_epochs=X
```

where `X` is your desired value for `max_epochs`.

If you have the required modules for the file and would like to skip the creation of a conda environment, add the argument `--env-manager=local`.

```
mlflow run . --env-manager=local
```

### Viewing results in the MLflow UI

Once the code is finished executing, you can view the run's metrics, parameters, and details by running the command

```
mlflow server
```

and navigating to [http://localhost:5000](http://localhost:5000).

For more details on MLflow tracking, see [the docs](https://www.mlflow.org/docs/latest/tracking.html#mlflow-tracking).

### Passing custom training parameters

The parameters can be overridden via the command line:

1. max_epochs - Number of epochs to train model. Training can be interrupted early via Ctrl+C
2. devices - Number of GPUs.
3. strategy - [strategy](https://pytorch-lightning.readthedocs.io/en/stable/common/trainer.html#trainer-class-api) (e.g. "ddp" for the Distributed Data Parallel backend) to use for training. By default, no strategy is used.
4. accelerator - [accelerator](https://lightning.ai/docs/pytorch/stable/extensions/accelerator.html) (e.g. "gpu" - for running in GPU environment. Set to "cpu" by default)
5. batch_size - Input batch size for training
6. num_workers - Number of worker threads to load training data
7. learning_rate - Learning rate

For example:

```
mlflow run . -P max_epochs=5 -P devices=1 -P batch_size=32 -P num_workers=2 -P learning_rate=0.01 -P strategy="ddp"
```

Or to run the training script directly with custom parameters:

```sh
python mnist_autolog_example.py \
    --trainer.max_epochs 5 \
    --trainer.devices 1 \
    --trainer.strategy "ddp" \
    --trainer.accelerator "gpu" \
    --data.batch_size 64 \
    --data.num_workers 3 \
    --model.learning_rate 0.001
```

## Logging to a custom tracking server

To configure MLflow to log to a custom (non-default) tracking location, set the MLFLOW_TRACKING_URI environment variable, e.g. via export MLFLOW_TRACKING_URI=http://localhost:5000/. For more details, see [the docs](https://mlflow.org/docs/latest/tracking.html#where-runs-are-recorded).
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/pytorch/MNIST/example2/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow
  - torch==1.8.0
  - torchvision==0.9.1
  - pytorch-lightning==1.0.2
```

--------------------------------------------------------------------------------

---[FILE: iris_classification.py]---
Location: mlflow-master/examples/pytorch/torchscript/IrisClassification/iris_classification.py

```python
import argparse

import torch
import torch.nn.functional as F
from sklearn.datasets import load_iris
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from torch import nn

import mlflow.pytorch
from mlflow.models import infer_signature


class IrisClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(4, 10)
        self.fc2 = nn.Linear(10, 10)
        self.fc3 = nn.Linear(10, 3)

    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = F.dropout(x, 0.2)
        x = self.fc3(x)
        return x


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def prepare_data():
    iris = load_iris()
    data = iris.data
    labels = iris.target
    target_names = iris.target_names

    X_train, X_test, y_train, y_test = train_test_split(
        data, labels, test_size=0.2, random_state=42, shuffle=True, stratify=labels
    )

    X_train = torch.FloatTensor(X_train).to(device)
    X_test = torch.FloatTensor(X_test).to(device)
    y_train = torch.LongTensor(y_train).to(device)
    y_test = torch.LongTensor(y_test).to(device)

    return X_train, X_test, y_train, y_test, target_names


def train_model(model, epochs, X_train, y_train):
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

    for epoch in range(epochs):
        out = model(X_train)
        loss = criterion(out, y_train).to(device)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if epoch % 10 == 0:
            print("number of epoch", epoch, "loss", float(loss))

    return model


def test_model(model, X_test, y_test):
    model.eval()
    with torch.no_grad():
        predict_out = model(X_test)
        _, predict_y = torch.max(predict_out, 1)

        print("\nprediction accuracy", float(accuracy_score(y_test.cpu(), predict_y.cpu())))
        return infer_signature(X_test.numpy(), predict_out.numpy())


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Iris Classification Torchscripted model")

    parser.add_argument(
        "--epochs", type=int, default=100, help="number of epochs to run (default: 100)"
    )

    args = parser.parse_args()

    model = IrisClassifier()
    model = model.to(device)
    X_train, X_test, y_train, y_test, target_names = prepare_data()
    scripted_model = torch.jit.script(model)  # scripting the model
    scripted_model = train_model(scripted_model, args.epochs, X_train, y_train)
    signature = test_model(scripted_model, X_test, y_test)

    with mlflow.start_run() as run:
        mlflow.pytorch.log_model(
            scripted_model, name="model", signature=signature
        )  # logging scripted model
        model_path = mlflow.get_artifact_uri("model")
        loaded_pytorch_model = mlflow.pytorch.load_model(model_path)  # loading scripted model
        model.eval()
        with torch.no_grad():
            test_datapoint = torch.Tensor([4.4000, 3.0000, 1.3000, 0.2000]).to(device)
            prediction = loaded_pytorch_model(test_datapoint)
            actual = "setosa"
            predicted = target_names[torch.argmax(prediction)]
            print(f"\nPREDICTION RESULT: ACTUAL: {actual}, PREDICTED: {predicted}")
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/pytorch/torchscript/IrisClassification/MLproject

```text
name: iris-classification

python_env: python_env.yaml

entry_points:
  main:
    parameters:
      epochs: {type: int, default: 50}

    command: |
          python iris_classification.py \
            --epochs {epochs}
```

--------------------------------------------------------------------------------

````
