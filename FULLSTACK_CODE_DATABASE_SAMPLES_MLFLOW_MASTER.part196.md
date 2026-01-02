---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 196
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 196 of 991)

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

---[FILE: pipeline.py]---
Location: mlflow-master/examples/pyspark_ml_autologging/pipeline.py

```python
from pyspark.ml import Pipeline
from pyspark.ml.classification import LogisticRegression
from pyspark.ml.feature import StandardScaler, VectorAssembler
from pyspark.sql import SparkSession
from sklearn.datasets import load_iris

import mlflow

with SparkSession.builder.getOrCreate() as spark:
    mlflow.pyspark.ml.autolog()

    df = load_iris(as_frame=True).frame.rename(columns={"target": "label"})
    df = spark.createDataFrame(df)
    train, test = df.randomSplit([0.8, 0.2])

    assembler = VectorAssembler(inputCols=df.columns[:-1], outputCol="features")
    scaler = StandardScaler(inputCol=assembler.getOutputCol(), outputCol="scaledFeatures")
    lor = LogisticRegression(maxIter=5, featuresCol=scaler.getOutputCol())

    # Non-neseted pipeline
    pipeline = Pipeline(stages=[assembler, scaler, lor])
    with mlflow.start_run():
        pipeline_model = pipeline.fit(train)

    columns = ["features", "prediction"]
    pipeline_model.transform(test).select(columns).show()

    # Nested pipeline
    nested_pipeline = Pipeline(stages=[Pipeline(stages=[assembler, scaler]), lor])
    with mlflow.start_run():
        nested_pipeline_model = nested_pipeline.fit(train)

    nested_pipeline_model.transform(test).select(columns).show()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/pyspark_ml_autologging/README.md

```text
# PySpark ML Autologging Examples

This directory contains examples for demonstrating how PySpark ML autologging works.

| File                     | Description                        |
| :----------------------- | :--------------------------------- |
| `logistic_regression.py` | Train a `LogisticRegression` model |
| `one_vs_rest.py`         | Train a `OneVsRest` model          |
```

--------------------------------------------------------------------------------

---[FILE: pipeline.py]---
Location: mlflow-master/examples/pyspark_ml_connect/pipeline.py

```python
from pyspark.ml.connect.classification import LogisticRegression
from pyspark.ml.connect.feature import StandardScaler
from pyspark.ml.connect.pipeline import Pipeline
from pyspark.sql import SparkSession
from sklearn import datasets

import mlflow

spark = SparkSession.builder.remote("local[2]").getOrCreate()

scaler = StandardScaler(inputCol="features", outputCol="scaled_features")
lr = LogisticRegression(maxIter=10, numTrainWorkers=2, learningRate=0.001)
pipeline = Pipeline(stages=[scaler, lr])

X, y = datasets.load_iris(return_X_y=True)

spark_df = spark.createDataFrame(zip(X, y), schema="features: array<double>, label: long")

pipeline_model = pipeline.fit(spark_df)

with mlflow.start_run():
    model_info = mlflow.spark.log_model(spark_model=pipeline_model, artifact_path="model")

model_uri = model_info.model_uri
print(f"Model is saved to URI: {model_uri}")

inference_df = spark_df.select("features").toPandas()
loaded_model = mlflow.spark.load_model(model_uri)
inference_result = loaded_model.transform(inference_df.copy(deep=False))

print("Loaded spark model inference result:\n")
print(inference_result)

pyfunc_model = mlflow.pyfunc.load_model(model_uri)
pyfunc_inference_result = pyfunc_model.predict(inference_df.copy(deep=False))
print("Loaded pyfunc model inference result:\n")
print(pyfunc_inference_result)
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/pyspark_ml_connect/README.md

```text
# PySpark ML connect Examples

This directory contains examples for demonstrating how to log PySpark ML connect model.

| File          | Description                                           |
| :------------ | :---------------------------------------------------- |
| `pipeline.py` | Use mlflow to Log a PySpark ML connect pipeline model |
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/pytorch/MLproject

```text
name: pytorch_tutorial

python_env: python_env.yaml

entry_points:
  main:
    parameters:
      batch-size: {type: int, default: 64}
      test-batch-size: {type: int, default: 1000}
      epochs: {type: int, default: 10}
      lr: {type: float, default: 0.01}
      momentum: {type: float, default: 0.5}
      enable-cuda: {type: string, default: 'True'}
      seed: {type: int, default: 5}
      log-interval: {type: int, default: 100}
    command: |
          python mnist_tensorboard_artifact.py \
            --batch-size {batch-size} \
            --test-batch-size {test-batch-size} \
            --epochs {epochs} \
            --lr {lr} \
            --momentum {momentum} \
            --enable-cuda {enable-cuda} \
            --seed {seed} \
            --log-interval {log-interval}
```

--------------------------------------------------------------------------------

---[FILE: mnist_tensorboard_artifact.py]---
Location: mlflow-master/examples/pytorch/mnist_tensorboard_artifact.py

```python
#
# Trains an MNIST digit recognizer using PyTorch, and uses tensorboardX to log training metrics
# and weights in TensorBoard event format to the MLflow run's artifact directory. This stores the
# TensorBoard events in MLflow for later access using the TensorBoard command line tool.
#
# NOTE: This example requires you to first install PyTorch (using the instructions at pytorch.org)
#       and tensorboardX (using pip install tensorboardX).
#
# Code based on https://github.com/lanpa/tensorboard-pytorch-examples/blob/master/mnist/main.py.
#
import argparse
import os
import pickle
import tempfile

import torch
import torch.nn.functional as F
from tensorboardX import SummaryWriter
from torch import nn, optim
from torchvision import datasets, transforms

import mlflow
import mlflow.pytorch

# Command-line arguments
parser = argparse.ArgumentParser(description="PyTorch MNIST Example")
parser.add_argument(
    "--batch-size",
    type=int,
    default=64,
    metavar="N",
    help="input batch size for training (default: 64)",
)
parser.add_argument(
    "--test-batch-size",
    type=int,
    default=1000,
    metavar="N",
    help="input batch size for testing (default: 1000)",
)
parser.add_argument(
    "--epochs", type=int, default=10, metavar="N", help="number of epochs to train (default: 10)"
)
parser.add_argument(
    "--lr", type=float, default=0.01, metavar="LR", help="learning rate (default: 0.01)"
)
parser.add_argument(
    "--momentum", type=float, default=0.5, metavar="M", help="SGD momentum (default: 0.5)"
)
parser.add_argument(
    "--enable-cuda",
    type=str,
    choices=["True", "False"],
    default="True",
    help="enables or disables CUDA training",
)
parser.add_argument("--seed", type=int, default=1, metavar="S", help="random seed (default: 1)")
parser.add_argument(
    "--log-interval",
    type=int,
    default=100,
    metavar="N",
    help="how many batches to wait before logging training status",
)
args = parser.parse_args()

enable_cuda_flag = args.enable_cuda == "True"

args.cuda = enable_cuda_flag and torch.cuda.is_available()

torch.manual_seed(args.seed)
if args.cuda:
    torch.cuda.manual_seed(args.seed)

kwargs = {"num_workers": 1, "pin_memory": True} if args.cuda else {}
train_loader = torch.utils.data.DataLoader(
    datasets.MNIST(
        "../data",
        train=True,
        download=True,
        transform=transforms.Compose(
            [transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))]
        ),
    ),
    batch_size=args.batch_size,
    shuffle=True,
    **kwargs,
)
test_loader = torch.utils.data.DataLoader(
    datasets.MNIST(
        "../data",
        train=False,
        transform=transforms.Compose(
            [transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))]
        ),
    ),
    batch_size=args.test_batch_size,
    shuffle=True,
    **kwargs,
)


class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 10, kernel_size=5)
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5)
        self.conv2_drop = nn.Dropout2d()
        self.fc1 = nn.Linear(320, 50)
        self.fc2 = nn.Linear(50, 10)

    def forward(self, x):
        x = F.relu(F.max_pool2d(self.conv1(x), 2))
        x = F.relu(F.max_pool2d(self.conv2_drop(self.conv2(x)), 2))
        x = x.view(-1, 320)
        x = F.relu(self.fc1(x))
        x = F.dropout(x, training=self.training)
        x = self.fc2(x)
        return F.log_softmax(x, dim=0)

    def log_weights(self, step):
        writer.add_histogram("weights/conv1/weight", model.conv1.weight.data, step)
        writer.add_histogram("weights/conv1/bias", model.conv1.bias.data, step)
        writer.add_histogram("weights/conv2/weight", model.conv2.weight.data, step)
        writer.add_histogram("weights/conv2/bias", model.conv2.bias.data, step)
        writer.add_histogram("weights/fc1/weight", model.fc1.weight.data, step)
        writer.add_histogram("weights/fc1/bias", model.fc1.bias.data, step)
        writer.add_histogram("weights/fc2/weight", model.fc2.weight.data, step)
        writer.add_histogram("weights/fc2/bias", model.fc2.bias.data, step)


model = Net()
if args.cuda:
    model.cuda()

optimizer = optim.SGD(model.parameters(), lr=args.lr, momentum=args.momentum)

writer = None  # Will be used to write TensorBoard events


def train(epoch):
    model.train()
    for batch_idx, (data, target) in enumerate(train_loader):
        if args.cuda:
            data = data.cuda()
            target = target.cuda()
        optimizer.zero_grad()
        output = model(data)
        loss = F.nll_loss(output, target)
        loss.backward()
        optimizer.step()
        if batch_idx % args.log_interval == 0:
            print(
                "Train Epoch: {} [{}/{} ({:.0f}%)]\tLoss: {:.6f}".format(
                    epoch,
                    batch_idx * len(data),
                    len(train_loader.dataset),
                    100.0 * batch_idx / len(train_loader),
                    loss.data.item(),
                )
            )
            step = epoch * len(train_loader) + batch_idx
            log_scalar("train_loss", loss.data.item(), step)
            model.log_weights(step)


def test(epoch):
    model.eval()
    test_loss = 0
    correct = 0
    with torch.no_grad():
        for data, target in test_loader:
            if args.cuda:
                data = data.cuda()
                target = target.cuda()
            output = model(data)
            test_loss += F.nll_loss(
                output, target, reduction="sum"
            ).data.item()  # sum up batch loss
            pred = output.data.max(1)[1]  # get the index of the max log-probability
            correct += pred.eq(target.data).cpu().sum().item()

    test_loss /= len(test_loader.dataset)
    test_accuracy = 100.0 * correct / len(test_loader.dataset)
    print(
        "\nTest set: Average loss: {:.4f}, Accuracy: {}/{} ({:.0f}%)\n".format(
            test_loss, correct, len(test_loader.dataset), test_accuracy
        )
    )
    step = (epoch + 1) * len(train_loader)
    log_scalar("test_loss", test_loss, step)
    log_scalar("test_accuracy", test_accuracy, step)


def log_scalar(name, value, step):
    """Log a scalar value to both MLflow and TensorBoard"""
    writer.add_scalar(name, value, step)
    mlflow.log_metric(name, value)


with mlflow.start_run():
    # Log our parameters into mlflow
    for key, value in vars(args).items():
        mlflow.log_param(key, value)

    # Create a SummaryWriter to write TensorBoard events locally
    output_dir = dirpath = tempfile.mkdtemp()
    writer = SummaryWriter(output_dir)
    print(f"Writing TensorBoard events locally to {output_dir}\n")

    # Perform the training
    for epoch in range(1, args.epochs + 1):
        train(epoch)
        test(epoch)

    # Upload the TensorBoard event logs as a run artifact
    print("Uploading TensorBoard events as a run artifact...")
    mlflow.log_artifacts(output_dir, artifact_path="events")
    print(
        "\nLaunch TensorBoard with:\n\ntensorboard --logdir={}".format(
            os.path.join(mlflow.get_artifact_uri(), "events")
        )
    )

    # Log the model as an artifact of the MLflow run.
    print("\nLogging the trained model as a run artifact...")
    model_info = mlflow.pytorch.log_model(model, name="pytorch-model", pickle_module=pickle)
    print(f"\nThe model is logged at:\n{model_info.artifact_path}")

    # Get the device (GPU or CPU)
    device = torch.device("cuda" if args.cuda else "cpu")

    # Since the model was logged as an artifact, it can be loaded to make predictions
    loaded_model = mlflow.pytorch.load_model(model_info.model_uri)

    # Extract a few examples from the test dataset to evaluate on
    eval_data, eval_labels = next(iter(test_loader))

    # Move evaluation data to the same device as the model
    eval_data = eval_data.to(device)
    eval_labels = eval_labels.to(device)

    # Make a few predictions
    predictions = loaded_model(eval_data).data.max(1)[1]
    template = 'Sample {} : Ground truth is "{}", model prediction is "{}"'
    print("\nSample predictions")
    for index in range(5):
        print(template.format(index, eval_labels[index], predictions[index]))
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/pytorch/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - torch
  - torchvision
  - mlflow
  - tensorboardX
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/pytorch/CaptumExample/MLproject

```text
name: Titanic-Captum-Example

python_env: python_env.yaml

entry_points:
  main:
    parameters:
      max_epochs: {type: int, default: 50}
      lr: {type: float, default: 0.1}

    command: |
          python Titanic_Captum_Interpret.py \
            --max_epochs {max_epochs} \
            --lr {lr}
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/pytorch/CaptumExample/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow
  - pandas
  - scipy
  - captum
  - boto3
  - scikit-learn
  - prettytable
  - ipython
  - torch
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/pytorch/CaptumExample/README.md

```text
## Using Captum and MLflow to interpret Pytorch models

In this example, we will demonstrate the basic features of the [Captum](https://captum.ai/) interpretability,and logging those features using mlflow library through an example model trained on the Titanic survival data.
We will first train a deep neural network on the data using PyTorch and use Captum to understand which of the features were most important and how the network reached its prediction.

you can get more details about used attributions methods used in this example

1. [Titanic_Basic_Interpret](https://captum.ai/tutorials/Titanic_Basic_Interpret)
2. [integrated-gradients](https://captum.ai/docs/algorithms#primary-attribution)
3. [layer-attributions](https://captum.ai/docs/algorithms#layer-attribution)

### Running the code

To run the example via MLflow, navigate to the `mlflow/examples/pytorch/CaptumExample` directory and run the command

```
mlflow run .
```

This will run `Titanic_Captum_Interpret.py` with default parameter values, e.g. `--max_epochs=100` and `--use_pretrained_model False`. You can see the full set of parameters in the `MLproject` file within this directory.

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
2. lr - Learning rate
3. use_pretrained_model - If want to use pretrained model

For example:

```
mlflow run . -P max_epochs=5 -P learning_rate=0.01 -P use_pretrained_model=True
```

Or to run the training script directly with custom parameters:

```sh
python Titanic_Captum_Interpret.py \
    --max_epochs 50 \
    --lr 0.1
```

## Logging to a custom tracking server

To configure MLflow to log to a custom (non-default) tracking location, set the MLFLOW_TRACKING_URI environment variable, e.g. via export MLFLOW_TRACKING_URI=http://localhost:5000/. For more details, see [the docs](https://mlflow.org/docs/latest/tracking.html#where-runs-are-recorded).
```

--------------------------------------------------------------------------------

---[FILE: titanic3.csv]---
Location: mlflow-master/examples/pytorch/CaptumExample/titanic3.csv

```text
passengerid,survived,pclass,name,sex,age,sibsp,parch,ticket,fare,cabin,embarked
1,0,3,"Braund, Mr. Owen Harris",male,22,1,0,A/5 21171,7.25,,S
2,1,1,"Cumings, Mrs. John Bradley (Florence Briggs Thayer)",female,38,1,0,PC 17599,71.2833,C85,C
3,1,3,"Heikkinen, Miss. Laina",female,26,0,0,STON/O2. 3101282,7.925,,S
4,1,1,"Futrelle, Mrs. Jacques Heath (Lily May Peel)",female,35,1,0,113803,53.1,C123,S
5,0,3,"Allen, Mr. William Henry",male,35,0,0,373450,8.05,,S
6,0,3,"Moran, Mr. James",male,,0,0,330877,8.4583,,Q
7,0,1,"McCarthy, Mr. Timothy J",male,54,0,0,17463,51.8625,E46,S
8,0,3,"Palsson, Master. Gosta Leonard",male,2,3,1,349909,21.075,,S
9,1,3,"Johnson, Mrs. Oscar W (Elisabeth Vilhelmina Berg)",female,27,0,2,347742,11.1333,,S
10,1,2,"Nasser, Mrs. Nicholas (Adele Achem)",female,14,1,0,237736,30.0708,,C
11,1,3,"Sandstrom, Miss. Marguerite Rut",female,4,1,1,PP 9549,16.7,G6,S
12,1,1,"Bonnell, Miss. Elizabeth",female,58,0,0,113783,26.55,C103,S
13,0,3,"Saundercock, Mr. William Henry",male,20,0,0,A/5. 2151,8.05,,S
14,0,3,"Andersson, Mr. Anders Johan",male,39,1,5,347082,31.275,,S
15,0,3,"Vestrom, Miss. Hulda Amanda Adolfina",female,14,0,0,350406,7.8542,,S
16,1,2,"Hewlett, Mrs. (Mary D Kingcome) ",female,55,0,0,248706,16,,S
17,0,3,"Rice, Master. Eugene",male,2,4,1,382652,29.125,,Q
18,1,2,"Williams, Mr. Charles Eugene",male,,0,0,244373,13,,S
19,0,3,"Vander Planke, Mrs. Julius (Emelia Maria Vandemoortele)",female,31,1,0,345763,18,,S
20,1,3,"Masselmani, Mrs. Fatima",female,,0,0,2649,7.225,,C
21,0,2,"Fynney, Mr. Joseph J",male,35,0,0,239865,26,,S
22,1,2,"Beesley, Mr. Lawrence",male,34,0,0,248698,13,D56,S
23,1,3,"McGowan, Miss. Anna ""Annie""",female,15,0,0,330923,8.0292,,Q
24,1,1,"Sloper, Mr. William Thompson",male,28,0,0,113788,35.5,A6,S
25,0,3,"Palsson, Miss. Torborg Danira",female,8,3,1,349909,21.075,,S
26,1,3,"Asplund, Mrs. Carl Oscar (Selma Augusta Emilia Johansson)",female,38,1,5,347077,31.3875,,S
27,0,3,"Emir, Mr. Farred Chehab",male,,0,0,2631,7.225,,C
28,0,1,"Fortune, Mr. Charles Alexander",male,19,3,2,19950,263,C23 C25 C27,S
29,1,3,"O'Dwyer, Miss. Ellen ""Nellie""",female,,0,0,330959,7.8792,,Q
30,0,3,"Todoroff, Mr. Lalio",male,,0,0,349216,7.8958,,S
31,0,1,"Uruchurtu, Don. Manuel E",male,40,0,0,PC 17601,27.7208,,C
32,1,1,"Spencer, Mrs. William Augustus (Marie Eugenie)",female,,1,0,PC 17569,146.5208,B78,C
33,1,3,"Glynn, Miss. Mary Agatha",female,,0,0,335677,7.75,,Q
34,0,2,"Wheadon, Mr. Edward H",male,66,0,0,C.A. 24579,10.5,,S
35,0,1,"Meyer, Mr. Edgar Joseph",male,28,1,0,PC 17604,82.1708,,C
36,0,1,"Holverson, Mr. Alexander Oskar",male,42,1,0,113789,52,,S
37,1,3,"Mamee, Mr. Hanna",male,,0,0,2677,7.2292,,C
38,0,3,"Cann, Mr. Ernest Charles",male,21,0,0,A./5. 2152,8.05,,S
39,0,3,"Vander Planke, Miss. Augusta Maria",female,18,2,0,345764,18,,S
40,1,3,"Nicola-Yarred, Miss. Jamila",female,14,1,0,2651,11.2417,,C
41,0,3,"Ahlin, Mrs. Johan (Johanna Persdotter Larsson)",female,40,1,0,7546,9.475,,S
42,0,2,"Turpin, Mrs. William John Robert (Dorothy Ann Wonnacott)",female,27,1,0,11668,21,,S
43,0,3,"Kraeff, Mr. Theodor",male,,0,0,349253,7.8958,,C
44,1,2,"Laroche, Miss. Simonne Marie Anne Andree",female,3,1,2,SC/Paris 2123,41.5792,,C
45,1,3,"Devaney, Miss. Margaret Delia",female,19,0,0,330958,7.8792,,Q
46,0,3,"Rogers, Mr. William John",male,,0,0,S.C./A.4. 23567,8.05,,S
47,0,3,"Lennon, Mr. Denis",male,,1,0,370371,15.5,,Q
48,1,3,"O'Driscoll, Miss. Bridget",female,,0,0,14311,7.75,,Q
49,0,3,"Samaan, Mr. Youssef",male,,2,0,2662,21.6792,,C
50,0,3,"Arnold-Franchi, Mrs. Josef (Josefine Franchi)",female,18,1,0,349237,17.8,,S
51,0,3,"Panula, Master. Juha Niilo",male,7,4,1,3101295,39.6875,,S
52,0,3,"Nosworthy, Mr. Richard Cater",male,21,0,0,A/4. 39886,7.8,,S
53,1,1,"Harper, Mrs. Henry Sleeper (Myna Haxtun)",female,49,1,0,PC 17572,76.7292,D33,C
54,1,2,"Faunthorpe, Mrs. Lizzie (Elizabeth Anne Wilkinson)",female,29,1,0,2926,26,,S
55,0,1,"Ostby, Mr. Engelhart Cornelius",male,65,0,1,113509,61.9792,B30,C
56,1,1,"Woolner, Mr. Hugh",male,,0,0,19947,35.5,C52,S
57,1,2,"Rugg, Miss. Emily",female,21,0,0,C.A. 31026,10.5,,S
58,0,3,"Novel, Mr. Mansouer",male,28.5,0,0,2697,7.2292,,C
59,1,2,"West, Miss. Constance Mirium",female,5,1,2,C.A. 34651,27.75,,S
60,0,3,"Goodwin, Master. William Frederick",male,11,5,2,CA 2144,46.9,,S
61,0,3,"Sirayanian, Mr. Orsen",male,22,0,0,2669,7.2292,,C
62,1,1,"Icard, Miss. Amelie",female,38,0,0,113572,80,B28,
63,0,1,"Harris, Mr. Henry Birkhardt",male,45,1,0,36973,83.475,C83,S
64,0,3,"Skoog, Master. Harald",male,4,3,2,347088,27.9,,S
65,0,1,"Stewart, Mr. Albert A",male,,0,0,PC 17605,27.7208,,C
66,1,3,"Moubarek, Master. Gerios",male,,1,1,2661,15.2458,,C
67,1,2,"Nye, Mrs. (Elizabeth Ramell)",female,29,0,0,C.A. 29395,10.5,F33,S
68,0,3,"Crease, Mr. Ernest James",male,19,0,0,S.P. 3464,8.1583,,S
69,1,3,"Andersson, Miss. Erna Alexandra",female,17,4,2,3101281,7.925,,S
70,0,3,"Kink, Mr. Vincenz",male,26,2,0,315151,8.6625,,S
71,0,2,"Jenkin, Mr. Stephen Curnow",male,32,0,0,C.A. 33111,10.5,,S
72,0,3,"Goodwin, Miss. Lillian Amy",female,16,5,2,CA 2144,46.9,,S
73,0,2,"Hood, Mr. Ambrose Jr",male,21,0,0,S.O.C. 14879,73.5,,S
74,0,3,"Chronopoulos, Mr. Apostolos",male,26,1,0,2680,14.4542,,C
75,1,3,"Bing, Mr. Lee",male,32,0,0,1601,56.4958,,S
76,0,3,"Moen, Mr. Sigurd Hansen",male,25,0,0,348123,7.65,F G73,S
77,0,3,"Staneff, Mr. Ivan",male,,0,0,349208,7.8958,,S
78,0,3,"Moutal, Mr. Rahamin Haim",male,,0,0,374746,8.05,,S
79,1,2,"Caldwell, Master. Alden Gates",male,0.83,0,2,248738,29,,S
80,1,3,"Dowdell, Miss. Elizabeth",female,30,0,0,364516,12.475,,S
81,0,3,"Waelens, Mr. Achille",male,22,0,0,345767,9,,S
82,1,3,"Sheerlinck, Mr. Jan Baptist",male,29,0,0,345779,9.5,,S
83,1,3,"McDermott, Miss. Brigdet Delia",female,,0,0,330932,7.7875,,Q
84,0,1,"Carrau, Mr. Francisco M",male,28,0,0,113059,47.1,,S
85,1,2,"Ilett, Miss. Bertha",female,17,0,0,SO/C 14885,10.5,,S
86,1,3,"Backstrom, Mrs. Karl Alfred (Maria Mathilda Gustafsson)",female,33,3,0,3101278,15.85,,S
87,0,3,"Ford, Mr. William Neal",male,16,1,3,W./C. 6608,34.375,,S
88,0,3,"Slocovski, Mr. Selman Francis",male,,0,0,SOTON/OQ 392086,8.05,,S
89,1,1,"Fortune, Miss. Mabel Helen",female,23,3,2,19950,263,C23 C25 C27,S
90,0,3,"Celotti, Mr. Francesco",male,24,0,0,343275,8.05,,S
91,0,3,"Christmann, Mr. Emil",male,29,0,0,343276,8.05,,S
92,0,3,"Andreasson, Mr. Paul Edvin",male,20,0,0,347466,7.8542,,S
93,0,1,"Chaffee, Mr. Herbert Fuller",male,46,1,0,W.E.P. 5734,61.175,E31,S
94,0,3,"Dean, Mr. Bertram Frank",male,26,1,2,C.A. 2315,20.575,,S
95,0,3,"Coxon, Mr. Daniel",male,59,0,0,364500,7.25,,S
96,0,3,"Shorney, Mr. Charles Joseph",male,,0,0,374910,8.05,,S
97,0,1,"Goldschmidt, Mr. George B",male,71,0,0,PC 17754,34.6542,A5,C
98,1,1,"Greenfield, Mr. William Bertram",male,23,0,1,PC 17759,63.3583,D10 D12,C
99,1,2,"Doling, Mrs. John T (Ada Julia Bone)",female,34,0,1,231919,23,,S
100,0,2,"Kantor, Mr. Sinai",male,34,1,0,244367,26,,S
```

--------------------------------------------------------------------------------

---[FILE: Titanic_Captum_Interpret.py]---
Location: mlflow-master/examples/pytorch/CaptumExample/Titanic_Captum_Interpret.py

```python
"""
Getting started with Captum - Titanic Data Analysis
"""

# Initial imports
import os
from argparse import ArgumentParser

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
from captum.attr import IntegratedGradients, LayerConductance, NeuronConductance
from prettytable import PrettyTable
from scipy import stats
from sklearn.model_selection import train_test_split
from torch import nn

import mlflow


def get_titanic():
    """
    we now preprocess the data by converting some categorical features such as
    gender, location of embarcation, and passenger class into one-hot encodings
    We also remove some features that are more difficult to analyze
    After processing, the features we have are:
    Age: Passenger Age
    Sibsp: Number of Siblings / Spouses Aboard
    Parch: Number of Parents / Children Aboard
    Fare: Fare Amount Paid in British Pounds
    Female: Binary variable indicating whether passenger is female
    Male: Binary variable indicating whether passenger is male
    EmbarkC : Binary var indicating whether passenger embarked @ Cherbourg
    EmbarkQ : Binary var indicating whether passenger embarked @ Queenstown
    EmbarkS : Binary var indicating whether passenger embarked @ Southampton
    Class1 : Binary var indicating whether passenger was in first class
    Class2 : Binary var indicating whether passenger was in second class
    Class3 : Binary var indicating whether passenger was in third class
    """
    data_path = "titanic3.csv"
    titanic_data = pd.read_csv(data_path)
    titanic_data = pd.concat(
        [
            titanic_data,
            pd.get_dummies(titanic_data["sex"], dtype=np.uint8),
            pd.get_dummies(titanic_data["embarked"], prefix="embark", dtype=np.uint8),
            pd.get_dummies(titanic_data["pclass"], prefix="class", dtype=np.uint8),
        ],
        axis=1,
    )

    titanic_data["age"] = titanic_data["age"].fillna(titanic_data["age"].mean())
    titanic_data["fare"] = titanic_data["fare"].fillna(titanic_data["fare"].mean())
    return titanic_data.drop(
        [
            "passengerid",
            "name",
            "ticket",
            "cabin",
            "sex",
            "embarked",
            "pclass",
        ],
        axis=1,
    )


torch.manual_seed(1)  # Set seed for reproducibility.


class TitanicSimpleNNModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.linear1 = nn.Linear(12, 12)
        self.sigmoid1 = nn.Sigmoid()
        self.linear2 = nn.Linear(12, 8)
        self.sigmoid2 = nn.Sigmoid()
        self.linear3 = nn.Linear(8, 2)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        lin1_out = self.linear1(x)
        sigmoid_out1 = self.sigmoid1(lin1_out)
        sigmoid_out2 = self.sigmoid2(self.linear2(sigmoid_out1))
        return self.softmax(self.linear3(sigmoid_out2))


def prepare():
    RANDOM_SEED = 42
    titanic_data = get_titanic()
    print(titanic_data)

    labels = titanic_data["survived"].to_numpy()
    titanic_data = titanic_data.drop(["survived"], axis=1)
    feature_names = list(titanic_data.columns)
    data = titanic_data.to_numpy()
    # Separate training and test sets using
    train_features, test_features, train_labels, test_labels = train_test_split(
        data, labels, test_size=0.3, random_state=RANDOM_SEED, stratify=labels
    )
    train_features = np.vstack(train_features[:, :]).astype(np.float32)
    test_features = np.vstack(test_features[:, :]).astype(np.float32)
    return train_features, train_labels, test_features, test_labels, feature_names


def count_model_parameters(model):
    table = PrettyTable(["Modules", "Parameters"])
    total_params = 0
    for name, parameter in model.named_parameters():
        if not parameter.requires_grad:
            continue
        param = parameter.nonzero(as_tuple=False).size(0)
        table.add_row([name, param])
        total_params += param

    return table, total_params


def visualize_importances(
    feature_names,
    importances,
    title="Average Feature Importances",
    plot=True,
    axis_title="Features",
):
    print(title)
    feature_imp = PrettyTable(["feature_name", "importances"])
    feature_imp_dict = {}
    for i in range(len(feature_names)):
        print(feature_names[i], ": ", f"{importances[i]:.3f}")
        feature_imp.add_row([feature_names[i], importances[i]])
        feature_imp_dict[str(feature_names[i])] = importances[i]
    x_pos = np.arange(len(feature_names))
    if plot:
        fig, ax = plt.subplots(figsize=(12, 6))
        ax.bar(x_pos, importances, align="center")
        ax.set(title=title, xlabel=axis_title)
        ax.set_xticks(x_pos)
        ax.set_xticklabels(feature_names, rotation="vertical")
        mlflow.log_figure(fig, title + ".png")
    return feature_imp, feature_imp_dict


def train(USE_PRETRAINED_MODEL=False):
    net = TitanicSimpleNNModel()
    train_features, train_labels, test_features, test_labels, feature_names = prepare()
    USE_PRETRAINED_MODEL = dict_args["use_pretrained_model"]
    if USE_PRETRAINED_MODEL:
        net.load_state_dict(torch.load("models/titanic_state_dict.pt"))
        net.eval()
        print("Model Loaded!")
    else:
        criterion = nn.CrossEntropyLoss()
        num_epochs = dict_args["max_epochs"]
        mlflow.log_param("epochs", num_epochs)
        mlflow.log_param("lr", dict_args["lr"])

        optimizer = torch.optim.Adam(net.parameters(), lr=dict_args["lr"])
        print(train_features.dtype)
        input_tensor = torch.from_numpy(train_features).type(torch.FloatTensor)
        label_tensor = torch.from_numpy(train_labels)
        for epoch in range(num_epochs):
            output = net(input_tensor)
            loss = criterion(output, label_tensor)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            if epoch % 50 == 0:
                print(f"Epoch {epoch + 1}/{num_epochs} => Train Loss: {loss.item():.2f}")
                mlflow.log_metric(
                    f"Epoch {epoch + 1!s} Loss",
                    float(loss.item()),
                    step=epoch,
                )
        if not os.path.isdir("models"):
            os.makedirs("models")
            torch.save(net.state_dict(), "models/titanic_state_dict.pt")
    summary, _ = count_model_parameters(net)
    mlflow.log_text(str(summary), "model_summary.txt")
    return (
        net,
        train_features,
        train_labels,
        test_features,
        test_labels,
        feature_names,
    )


def compute_accuracy(net, features, labels, title=None):
    input_tensor = torch.from_numpy(features).type(torch.FloatTensor)
    out_probs = net(input_tensor).detach().numpy()
    out_classes = np.argmax(out_probs, axis=1)
    mlflow.log_metric(title, float(sum(out_classes == labels) / len(labels)))
    print(title, sum(out_classes == labels) / len(labels))
    return input_tensor


def feature_conductance(net, test_input_tensor):
    """
    The method takes tensor(s) of input examples (matching the forward function of the model),
    and returns the input attributions for the given input example.
    The returned values of the attribute method are the attributions,
    which match the size of the given inputs, and delta,
    which approximates the error between the approximated integral and true integral.
    This method saves the distribution of avg attributions of the trained features for the given target.
    """
    ig = IntegratedGradients(net)
    test_input_tensor.requires_grad_()
    attr, _ = ig.attribute(test_input_tensor, target=1, return_convergence_delta=True)
    attr = attr.detach().numpy()
    # To understand these attributions, we can first average them across all the inputs and print and visualize the average attribution for each feature.
    feature_imp, feature_imp_dict = visualize_importances(feature_names, np.mean(attr, axis=0))
    mlflow.log_metrics(feature_imp_dict)
    mlflow.log_text(str(feature_imp), "feature_imp_summary.txt")
    fig, (ax1, ax2) = plt.subplots(2, 1)
    fig.tight_layout(pad=3)
    ax1.hist(attr[:, 1], 100)
    ax1.set(title="Distribution of Sibsp Attribution Values")

    # we can bucket the examples by the value of the sibsp feature and plot the average attribution for the feature.
    # In the plot below, the size of the dot is proportional to the number of examples with that value.

    bin_means, bin_edges, _ = stats.binned_statistic(
        test_features[:, 1], attr[:, 1], statistic="mean", bins=6
    )
    bin_count, _, _ = stats.binned_statistic(
        test_features[:, 1], attr[:, 1], statistic="count", bins=6
    )

    bin_width = bin_edges[1] - bin_edges[0]
    bin_centers = bin_edges[1:] - bin_width / 2
    ax2.scatter(bin_centers, bin_means, s=bin_count)
    ax2.set(xlabel="Average Sibsp Feature Value", ylabel="Average Attribution")
    mlflow.log_figure(fig, "Average_Sibsp_Feature_Value.png")


def layer_conductance(net, test_input_tensor):
    """
    To use Layer Conductance, we create a LayerConductance object passing in the model as well as the module (layer) whose output we would like to understand.
    In this case, we choose net.sigmoid1, the output of the first hidden layer.
    Now obtain the conductance values for all the test examples by calling attribute on the LayerConductance object.
    LayerConductance also requires a target index for networks with multiple outputs, defining the index of the output for which gradients are computed.
    Similar to feature attributions, we provide target = 1, corresponding to survival.
    LayerConductance also utilizes a baseline, but we simply use the default zero baseline as in integrated gradients.
    """

    cond = LayerConductance(net, net.sigmoid1)

    cond_vals = cond.attribute(test_input_tensor, target=1)
    cond_vals = cond_vals.detach().numpy()
    # We can begin by visualizing the average conductance for each neuron.
    neuron_names = ["neuron " + str(x) for x in range(12)]
    avg_neuron_imp, neuron_imp_dict = visualize_importances(
        neuron_names,
        np.mean(cond_vals, axis=0),
        title="Average Neuron Importances",
        axis_title="Neurons",
    )
    mlflow.log_metrics(neuron_imp_dict)
    mlflow.log_text(str(avg_neuron_imp), "neuron_imp_summary.txt")
    # We can also look at the distribution of each neuron's attributions. Below we look at the distributions for neurons 7 and 9,
    # and we can confirm that their attribution distributions are very close to 0, suggesting they are not learning substantial features.
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 6))
    fig.tight_layout(pad=3)
    ax1.hist(cond_vals[:, 9], 100)
    ax1.set(title="Neuron 9 Distribution")
    ax2.hist(cond_vals[:, 7], 100)
    ax2.set(title="Neuron 7 Distribution")
    mlflow.log_figure(fig, "Neurons_Distribution.png")


def neuron_conductance(net, test_input_tensor, neuron_selector=None):
    """
    We have identified that some of the neurons are not learning important features, while others are.
    Can we now understand what each of these important neurons are looking at in the input?
    For instance, are they identifying different features in the input or similar ones?

    To answer these questions, we can apply the third type of attributions available in Captum, **Neuron Attributions**.
    This allows us to understand what parts of the input contribute to activating a particular input neuron. For this example,
    we will apply Neuron Conductance, which divides the neuron's total conductance value into the contribution from each individual input feature.

    To use Neuron Conductance, we create a NeuronConductance object, analogously to Conductance,
    passing in the model as well as the module (layer) whose output we would like to understand, in this case, net.sigmoid1, as before.
    """
    neuron_selector = 0
    neuron_cond = NeuronConductance(net, net.sigmoid1)

    # We can now obtain the neuron conductance values for all the test examples by calling attribute on the NeuronConductance object.
    # Neuron Conductance requires the neuron index in the target layer for which attributions are requested as well as the target index for networks with multiple outputs,
    # similar to layer conductance. As before, we provide target = 1, corresponding to survival, and compute neuron conductance for neurons 0 and 10, the significant neurons identified above.
    # The neuron index can be provided either as a tuple or as just an integer if the layer output is 1-dimensional.

    neuron_cond_vals = neuron_cond.attribute(
        test_input_tensor, neuron_selector=neuron_selector, target=1
    )
    neuron_cond, _ = visualize_importances(
        feature_names,
        neuron_cond_vals.mean(dim=0).detach().numpy(),
        title=f"Average Feature Importances for Neuron {neuron_selector}",
    )
    mlflow.log_text(
        str(neuron_cond), "Avg_Feature_Importances_Neuron_" + str(neuron_selector) + ".txt"
    )


if __name__ == "__main__":
    parser = ArgumentParser(description="Titanic Captum Example")

    parser.add_argument(
        "--use_pretrained_model",
        default=False,
        metavar="N",
        help="Use pretrained model or train from the scratch",
    )

    parser.add_argument(
        "--max_epochs",
        type=int,
        default=100,
        metavar="N",
        help="Number of epochs to be used for training",
    )

    parser.add_argument(
        "--lr",
        type=float,
        default=0.1,
        metavar="LR",
        help="learning rate (default: 0.1)",
    )

    args = parser.parse_args()
    dict_args = vars(args)

    with mlflow.start_run(run_name="Titanic_Captum_mlflow"):
        net, train_features, train_labels, test_features, test_labels, feature_names = train()

        compute_accuracy(net, train_features, train_labels, title="Train Accuracy")
        test_input_tensor = compute_accuracy(net, test_features, test_labels, title="Test Accuracy")
        feature_conductance(net, test_input_tensor)
        layer_conductance(net, test_input_tensor)
        neuron_conductance(net, test_input_tensor)
        mlflow.log_param("Train Size", len(train_labels))
        mlflow.log_param("Test Size", len(test_labels))
```

--------------------------------------------------------------------------------

---[FILE: conda.yaml]---
Location: mlflow-master/examples/pytorch/HPOExample/conda.yaml

```yaml
channels:
  - conda-forge
dependencies:
  - python=3.10
  - pip
  - pip:
      - mlflow
      - torch>=2.1
      - torchvision>=0.15.1
      - optuna>=3.0.0
```

--------------------------------------------------------------------------------

````
