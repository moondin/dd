---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 198
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 198 of 991)

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

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/pytorch/torchscript/IrisClassification/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - scikit-learn
  - cloudpickle==1.6.0
  - boto3
  - torchvision>=0.9.1
  - torch>=1.9.0
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/pytorch/torchscript/IrisClassification/README.md

```text
## Iris classification example with MLflow

This example demonstrates training a classification model on the Iris dataset, scripting the model with TorchScript, logging the
scripted model to MLflow using
[`mlflow.pytorch.log_model`](https://mlflow.org/docs/latest/python_api/mlflow.pytorch.html#mlflow.pytorch.log_model), and
loading it back for inference using
[`mlflow.pytorch.load_model`](https://mlflow.org/docs/latest/python_api/mlflow.pytorch.html#mlflow.pytorch.load_model)

### Running the code

To run the example via MLflow, navigate to the `mlflow/examples/pytorch/torchscript/IrisClassification` directory and run the command

```
mlflow run .
```

This will run `iris_classification.py` with the default set of parameters such as `--max_epochs=5`. You can see the default value in the `MLproject` file.

In order to run the file with custom parameters, run the command

```
mlflow run . -P epochs=X
```

where `X` is your desired value for `epochs`.

If you have the required modules for the file and would like to skip the creation of a conda environment, add the argument `--env-manager=local`.

```
mlflow run . --env-manager=local
```

Once the code is finished executing, you can view the run's metrics, parameters, and details by running the command

```
mlflow server
```

and navigating to [http://localhost:5000](http://localhost:5000).

## Running against a custom tracking server

To configure MLflow to log to a custom (non-default) tracking location, set the `MLFLOW_TRACKING_URI` environment variable, e.g. via `export MLFLOW_TRACKING_URI=http://localhost:5000/`. For more details, see [the docs](https://mlflow.org/docs/latest/tracking.html#where-runs-are-recorded)
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/pytorch/torchscript/MNIST/MLproject

```text
name: mnist-torchscript

python_env: python_env.yaml

entry_points:
  main:
    parameters:
      epochs: {type: int, default: 5}
      batch_size: {type: int, default: 64}
      learning_rate: {type: float, default: 1e-3}

    command: |
          python mnist_torchscript.py \
            --epochs {epochs} \
            --batch-size {batch_size} \
            --lr {learning_rate}
```

--------------------------------------------------------------------------------

---[FILE: mnist_torchscript.py]---
Location: mlflow-master/examples/pytorch/torchscript/MNIST/mnist_torchscript.py

```python
import argparse

import torch
import torch.nn.functional as F
from torch import nn, optim
from torch.optim.lr_scheduler import StepLR
from torchvision import datasets, transforms

import mlflow
import mlflow.pytorch


class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, 3, 1)
        self.conv2 = nn.Conv2d(32, 64, 3, 1)
        self.dropout1 = nn.Dropout(0.25)
        self.dropout2 = nn.Dropout(0.5)
        self.fc1 = nn.Linear(9216, 128)
        self.fc2 = nn.Linear(128, 10)

    def forward(self, x):
        x = self.conv1(x)
        x = F.relu(x)
        x = self.conv2(x)
        x = F.relu(x)
        x = F.max_pool2d(x, 2)
        x = self.dropout1(x)
        x = torch.flatten(x, 1)
        x = self.fc1(x)
        x = F.relu(x)
        x = self.dropout2(x)
        x = self.fc2(x)
        x = F.log_softmax(x, dim=1)
        return x


def train(args, model, device, train_loader, optimizer, epoch):
    model.train()
    for batch_idx, (data, target) in enumerate(train_loader):
        data = data.to(device)
        target = target.to(device)
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
                    loss.item(),
                )
            )
            if args.dry_run:
                break


def test(model, device, test_loader):
    model.eval()
    test_loss = 0
    correct = 0
    with torch.no_grad():
        for data, target in test_loader:
            data = data.to(device)
            target = target.to(device)
            output = model(data)
            test_loss += F.nll_loss(output, target, reduction="sum").item()  # sum up batch loss
            pred = output.argmax(dim=1, keepdim=True)  # get the index of the max log-probability
            correct += pred.eq(target.view_as(pred)).sum().item()

    test_loss /= len(test_loader.dataset)

    print(
        "\nTest set: Average loss: {:.4f}, Accuracy: {}/{} ({:.0f}%)\n".format(
            test_loss,
            correct,
            len(test_loader.dataset),
            100.0 * correct / len(test_loader.dataset),
        )
    )


def main():
    # Training settings
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
        "--epochs",
        type=int,
        default=14,
        metavar="N",
        help="number of epochs to train (default: 14)",
    )
    parser.add_argument(
        "--lr",
        type=float,
        default=1.0,
        metavar="LR",
        help="learning rate (default: 1.0)",
    )
    parser.add_argument(
        "--gamma",
        type=float,
        default=0.7,
        metavar="M",
        help="Learning rate step gamma (default: 0.7)",
    )
    parser.add_argument(
        "--no-cuda", action="store_true", default=False, help="disables CUDA training"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=False,
        help="quickly check a single pass",
    )
    parser.add_argument("--seed", type=int, default=1, metavar="S", help="random seed (default: 1)")
    parser.add_argument(
        "--log-interval",
        type=int,
        default=10,
        metavar="N",
        help="how many batches to wait before logging training status",
    )
    parser.add_argument(
        "--save-model",
        action="store_true",
        default=False,
        help="For Saving the current model",
    )

    args = parser.parse_args()
    use_cuda = not args.no_cuda and torch.cuda.is_available()

    torch.manual_seed(args.seed)

    device = torch.device("cuda" if use_cuda else "cpu")

    train_kwargs = {"batch_size": args.batch_size}
    test_kwargs = {"batch_size": args.test_batch_size}
    if use_cuda:
        cuda_kwargs = {"num_workers": 1, "pin_memory": True, "shuffle": True}
        train_kwargs.update(cuda_kwargs)
        test_kwargs.update(cuda_kwargs)

    transform = transforms.Compose(
        [transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))]
    )
    dataset1 = datasets.MNIST("../data", train=True, download=True, transform=transform)
    dataset2 = datasets.MNIST("../data", train=False, transform=transform)
    train_loader = torch.utils.data.DataLoader(dataset1, **train_kwargs)
    test_loader = torch.utils.data.DataLoader(dataset2, **test_kwargs)

    model = Net().to(device)
    scripted_model = torch.jit.script(model)  # scripting the model
    optimizer = optim.Adadelta(model.parameters(), lr=args.lr)

    scheduler = StepLR(optimizer, step_size=1, gamma=args.gamma)
    for epoch in range(1, args.epochs + 1):
        train(args, scripted_model, device, train_loader, optimizer, epoch)
        scheduler.step()
    test(scripted_model, device, test_loader)
    with mlflow.start_run():
        mlflow.pytorch.log_model(scripted_model, name="model")  # logging scripted model
        model_path = mlflow.get_artifact_uri("model")
        loaded_pytorch_model = mlflow.pytorch.load_model(model_path)  # loading scripted model
        model.eval()
        with torch.no_grad():
            test_datapoint, test_target = next(iter(test_loader))
            prediction = loaded_pytorch_model(test_datapoint[0].unsqueeze(0).to(device))
            actual = test_target[0].item()
            predicted = torch.argmax(prediction).item()
            print(f"\nPREDICTION RESULT: ACTUAL: {actual!s}, PREDICTED: {predicted!s}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/pytorch/torchscript/MNIST/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow
  - cloudpickle==1.6.0
  - boto3
  - torchvision>=0.9.1
  - torch>=1.9.0
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/pytorch/torchscript/MNIST/README.md

```text
## MNIST example with MLflow

This example demonstrates training of MNIST handwritten recognition model and logging it as torch scripted model.
`mlflow.pytorch.log_model()` is used to log the scripted model to MLflow and `mlflow.pytorch.load_model()` to load it from MLflow

### Code related to MLflow:

This will log the TorchScripted model into MLflow and load the logged model.

## Setting Tracking URI

MLflow tracking URI can be set using the environment variable `MLFLOW_TRACKING_URI`

Example: `export MLFLOW_TRACKING_URI=http://localhost:5000/`

For more details - https://mlflow.org/docs/latest/tracking.html#where-runs-are-recorded

### Running the code

To run the example via MLflow, navigate to the `mlflow/examples/pytorch/torchscript/MNIST` directory and run the command

```
mlflow run .
```

This will run `mnist_torchscript.py` with the default set of parameters such as `--max_epochs=5`. You can see the default value in the `MLproject` file.

In order to run the file with custom parameters, run the command

```
mlflow run . -P epochs=X
```

where `X` is your desired value for `epochs`.

If you have the required modules for the file and would like to skip the creation of a conda environment, add the argument `--env-manager=local`.

```
mlflow run . --env-manager=local
```

Once the code is finished executing, you can view the run's metrics, parameters, and details by running the command

```
mlflow server
```

and navigating to [http://localhost:5000](http://localhost:5000).

For more information on MLflow tracking, click [here](https://www.mlflow.org/docs/latest/tracking.html#mlflow-tracking) to view documentation.
```

--------------------------------------------------------------------------------

---[FILE: mlflow_tracking.py]---
Location: mlflow-master/examples/quickstart/mlflow_tracking.py

```python
import os
from random import randint, random

from mlflow import log_artifacts, log_metric, log_param

if __name__ == "__main__":
    print("Running mlflow_tracking.py")

    log_param("param1", randint(0, 100))

    log_metric("foo", random())
    log_metric("foo", random() + 1)
    log_metric("foo", random() + 2)

    if not os.path.exists("outputs"):
        os.makedirs("outputs")
    with open("outputs/test.txt", "w") as f:
        f.write("hello world!")

    log_artifacts("outputs")
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: mlflow-master/examples/rapids/mlflow_project/.gitignore

```text
iris.csv
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/rapids/mlflow_project/MLproject

```text
name: cuML RF test

conda_env: envs/conda.yaml

entry_points:
    hyperopt:
        parameters:
            fpath: {type: str}
            algo: {type: str, default: 'tpe'}
        command: "python src/rf_test/train.py --fpath={fpath} --algo={algo}"
    simple:
        parameters:
            fpath: {type: str}
            n_estimators: {type: int}
            max_features: {type: float}
            max_depth: {type: int}
        command: "python src/rf_test/train_simple.py --fpath={fpath} --n_estimators={n_estimators} --max_features={max_features} --max_depth={max_depth}"
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/rapids/mlflow_project/README.md

```text
### Train and Publish Locally With RAPIDS and MLflow

**[RAPIDS](https://rapids.ai/)** is a suite of open source libraries for GPU-accelerated analytics.

**[RAPIDS cuML](https://github.com/rapidsai/cuml)** matches the scikit-learn API, so it can build on MLflow's existing support for scikit-learn-like models to support
persistence and deployment."

The example workflows below train RAPIDs regression models to predict airline flight delays, using
MLflow to log models and deploy them as local REST API endpoints for real-time inference. You can run them:

- On a GPU-enabled instance for free in Colab. If following this approach, we recommend using the "Jupyter notebook workflow" below
  and following the setup steps in [this Colab notebook](https://colab.research.google.com/drive/1rY7Ln6rEE1pOlfSHCYOVaqt8OvDO35J0#forceEdit=true&offline=true&sandboxMode=true) to configure your
  environment.

- On your own machine with an NVIDIA GPU and CUDA installed. See the [RAPIDS getting-started guide](https://rapids.ai/start.html)
  for more details on necessary prerequisites for running the examples on your own machine.

#### Jupyter Notebook Workflow

[Jupyter Notebook](notebooks/rapids_mlflow.ipynb)

#### CLI Based Workflow

1. Create data
   1. `cd examples/rapids/mlflow_project`
      ```shell script
      # Create iris.csv
      python -c "from sklearn.datasets import load_iris; d = load_iris(as_frame=True); d.frame.to_csv('iris.csv', index=False)"
      ```
1. Set MLflow tracking uri
   1. ```shell script
       export MLFLOW_TRACKING_URI=sqlite:////tmp/mlflow-db.sqlite
      ```
1. Train the model using a single run.
   1. ```shell script
      # Launch the job
      mlflow run . -e simple\
               --experiment-name RAPIDS-CLI \
               -P max_depth=10 -P max_features=0.75 -P n_estimators=500 \
               -P conda-env=$PWD/envs/conda.yaml \
               -P fpath=iris.csv
      ```
1. Train the model with Hyperopt

   1. ```shell script
      # Launch the job
      mlflow run . -e hyperopt \
               --experiment-name RAPIDS-CLI \
               -P conda-env=$PWD/envs/conda.yaml \
               -P fpath=iris.csv
      ```
   1. In the output, note: "Created version '[VERSION]' of model 'rapids_mlflow'"

1. Deploy your model

   1. Deploy your model
      1. `$ mlflow models serve --env-manager=local -m models:/rapids_mlflow_cli/[VERSION] -p 55755`

1. Query the deployed model with test data `src/sample_server_query.sh` example script.
   1. `bash src/sample_server_query.sh`
```

--------------------------------------------------------------------------------

---[FILE: conda.yaml]---
Location: mlflow-master/examples/rapids/mlflow_project/envs/conda.yaml
Signals: Docker

```yaml
name: mlflow
channels:
  - rapidsai
  - nvidia
  - conda-forge
  - defaults
dependencies:
  - _libgcc_mutex=0.1=conda_forge
  - _openmp_mutex=4.5=1_llvm
  - arrow-cpp=0.15.0=py37h090bef1_2
  - bokeh=2.1.0=py37hc8dfbb8_0
  - boost-cpp=1.70.0=h8e57a91_2
  - brotli=1.0.7=he1b5a44_1002
  - bzip2=1.0.8=h516909a_2
  - c-ares=1.15.0=h516909a_1001
  - ca-certificates=2020.4.5.2=hecda079_0
  - certifi=2020.4.5.2=py37hc8dfbb8_0
  - click=7.1.2=pyh9f0ad1d_0
  - cloudpickle=1.4.1=py_0
  - cudatoolkit=10.2.89=h6bb024c_0
  - cudf=0.14.0=py37_0
  - cudnn=7.6.5=cuda10.2_0
  - cuml=0.14.0=cuda10.2_py37_0
  - cupy=7.5.0=py37h940342b_0
  - cytoolz=0.10.1=py37h516909a_0
  - dask=2.18.1=py_0
  - dask-core=2.18.1=py_0
  - dask-cudf=0.14.0=py37_0
  - distributed=2.18.0=py37hc8dfbb8_0
  - dlpack=0.2=he1b5a44_1
  - double-conversion=3.1.5=he1b5a44_2
  - fastavro=0.23.4=py37h8f50634_0
  - fastrlock=0.5=py37h3340039_0
  - freetype=2.10.2=he06d7ca_0
  - fsspec=0.7.4=py_0
  - gflags=2.2.2=he1b5a44_1002
  - glog=0.4.0=h49b9bf7_3
  - grpc-cpp=1.23.0=h18db393_0
  - heapdict=1.0.1=py_0
  - icu=64.2=he1b5a44_1
  - jinja2=2.11.2=pyh9f0ad1d_0
  - joblib=0.15.1=py_0
  - jpeg=9d=h516909a_0
  - ld_impl_linux-64=2.33.1=h53a641e_7
  - libblas=3.8.0=16_openblas
  - libcblas=3.8.0=16_openblas
  - libcudf=0.14.0=cuda10.2_0
  - libcuml=0.14.0=cuda10.2_0
  - libcumlprims=0.14.1=cuda10.2_0
  - libedit=3.1.20181209=hc058e9b_0
  - libevent=2.1.10=h72c5cf5_0
  - libffi=3.3=he6710b0_1
  - libgcc-ng=9.2.0=h24d8f2e_2
  - libgfortran-ng=7.5.0=hdf63c60_6
  - libhwloc=2.1.0=h3c4fd83_0
  - libiconv=1.15=h516909a_1006
  - liblapack=3.8.0=16_openblas
  - libllvm8=8.0.1=hc9558a2_0
  - libnvstrings=0.14.0=cuda10.2_0
  - libopenblas=0.3.9=h5ec1e0e_0
  - libpng=1.6.37=hed695b0_1
  - libprotobuf=3.8.0=h8b12597_0
  - librmm=0.14.0=cuda10.2_0
  - libstdcxx-ng=9.1.0=hdf63c60_0
  - libtiff=4.1.0=hfc65ed5_0
  - libxml2=2.9.10=hee79883_0
  - llvm-openmp=10.0.0=hc9558a2_0
  - llvmlite=0.32.1=py37h5202443_0
  - locket=0.2.0=py_2
  - lz4-c=1.8.3=he1b5a44_1001
  - markupsafe=1.1.1=py37h8f50634_1
  - msgpack-python=1.0.0=py37h99015e2_1
  - nccl=2.6.4.1=hc6a2c23_0
  - ncurses=6.2=he6710b0_1
  - numba=0.49.1=py37h0da4684_0
  - numpy=1.17.5=py37h95a1406_0
  - nvstrings=0.14.0=py37_0
  - olefile=0.46=py_0
  - openssl=1.1.1g=h516909a_0
  - packaging=20.4=pyh9f0ad1d_0
  - pandas=0.25.3=py37hb3f55d8_0
  - parquet-cpp=1.5.1=2
  - partd=1.1.0=py_0
  - pillow=5.3.0=py37h00a061d_1000
  - pip=20.1.1=py37_1
  - psutil=5.7.0=py37h8f50634_1
  - pyarrow=0.15.0=py37h8b68381_1
  - pyparsing=2.4.7=pyh9f0ad1d_0
  - python=3.8.13=h12debd9_0
  - python-dateutil=2.8.1=py_0
  - python_abi=3.8=2_cp38
  - pytz=2020.1=pyh9f0ad1d_0
  - pyyaml=5.3.1=py37h8f50634_0
  - re2=2020.04.01=he1b5a44_0
  - readline=8.0=h7b6447c_0
  - rmm=0.14.0=py37_0
  - setuptools=47.3.0=py37_0
  - six=1.15.0=pyh9f0ad1d_0
  - snappy=1.1.8=he1b5a44_2
  - sortedcontainers=2.2.2=pyh9f0ad1d_0
  - spdlog=1.6.1=hc9558a2_0
  - sqlite=3.31.1=h62c20be_1
  - tblib=1.6.0=py_0
  - thrift-cpp=0.12.0=hf3afdfd_1004
  - tk=8.6.8=hbc83047_0
  - toolz=0.10.0=py_0
  - tornado=6.0.4=py37h8f50634_1
  - typing_extensions=3.7.4.2=py_0
  - ucx=1.8.0+gf6ec8d4=cuda10.2_20
  - ucx-py=0.14.0+gf6ec8d4=py37_0
  - uriparser=0.9.3=he1b5a44_1
  - wheel=0.34.2=py37_0
  - xz=5.2.5=h7b6447c_0
  - yaml=0.2.5=h516909a_0
  - zict=2.0.0=py_0
  - zlib=1.2.11=h7b6447c_3
  - zstd=1.4.3=h3b9ef0a_0
  - pip:
      - alembic==1.4.2
      - attrs==19.3.0
      - backcall==0.2.0
      - bleach==3.1.5
      - chardet==3.0.4
      - cycler==0.10.0
      - databricks-cli==0.11.0
      - decorator==4.4.2
      - defusedxml==0.6.0
      - docker==4.2.1
      - entrypoints==0.3
      - flask==1.1.2
      - future==0.18.2
      - gitdb==4.0.5
      - gitpython==3.1.3
      - gorilla==0.3.0
      - gunicorn==20.0.4
      - hyperopt==0.2.4
      - idna==2.9
      - importlib-metadata==1.6.1
      - ipykernel==5.3.0
      - ipython==7.15.0
      - ipython-genutils==0.2.0
      - ipywidgets==7.5.1
      - itsdangerous==1.1.0
      - jedi==0.17.0
      - json5==0.9.5
      - jsonschema==3.2.0
      - jupyter==1.0.0
      - jupyter-client==6.1.3
      - jupyter-console==6.1.0
      - jupyter-core==4.6.3
      - jupyterlab==2.1.4
      - jupyterlab-server==1.1.5
      - kiwisolver==1.2.0
      - lab==6.0
      - mako==1.1.3
      - matplotlib==3.2.2
      - mistune==0.8.4
      - mlflow==1.8.0
      - nbconvert==5.6.1
      - nbformat==5.0.7
      - networkx==2.4
      - notebook==6.0.3
      - pandocfilters==1.4.2
      - parso==0.7.0
      - pexpect==4.8.0
      - pickleshare==0.7.5
      - prometheus-client==0.8.0
      - prometheus-flask-exporter==0.14.1
      - prompt-toolkit==3.0.5
      - protobuf==3.12.2
      - ptyprocess==0.6.0
      - pygments==2.6.1
      - pyrsistent==0.16.0
      - python-editor==1.0.4
      - pyzmq==19.0.1
      - qtconsole==4.7.4
      - qtpy==1.9.0
      - querystring-parser==1.2.4
      - requests==2.24.0
      - scikit-learn==0.23.1
      - scipy==1.4.1
      - send2trash==1.5.0
      - simplejson==3.17.0
      - sklearn==0.0
      - smmap==3.0.4
      - sqlalchemy==1.3.13
      - sqlparse==0.4.2
      - tabulate==0.8.7
      - terminado==0.8.3
      - testpath==0.4.4
      - threadpoolctl==2.1.0
      - tqdm==4.46.1
      - traitlets==4.3.3
      - txt2tags==3.7
      - urllib3==1.25.9
      - wcwidth==0.2.4
      - webencodings==0.5.1
      - websocket-client==0.57.0
      - werkzeug==1.0.1
      - widgetsnbextension==3.5.1
      - zipp==3.1.0
```

--------------------------------------------------------------------------------

---[FILE: conda.yaml]---
Location: mlflow-master/examples/rapids/mlflow_project/notebooks/conda.yaml
Signals: Docker

```yaml
name: mlflow
channels:
  - rapidsai
  - nvidia
  - conda-forge
  - defaults
dependencies:
  - _libgcc_mutex=0.1=conda_forge
  - _openmp_mutex=4.5=1_llvm
  - arrow-cpp=0.15.0=py37h090bef1_2
  - bokeh=2.1.0=py37hc8dfbb8_0
  - boost-cpp=1.70.0=h8e57a91_2
  - brotli=1.0.7=he1b5a44_1002
  - bzip2=1.0.8=h516909a_2
  - c-ares=1.15.0=h516909a_1001
  - ca-certificates=2020.4.5.2=hecda079_0
  - certifi=2020.4.5.2=py37hc8dfbb8_0
  - click=7.1.2=pyh9f0ad1d_0
  - cloudpickle=1.4.1=py_0
  - cudatoolkit=10.2.89=h6bb024c_0
  - cudf=0.14.0=py37_0
  - cudnn=7.6.5=cuda10.2_0
  - cuml=0.14.0=cuda10.2_py37_0
  - cupy=7.5.0=py37h940342b_0
  - cytoolz=0.10.1=py37h516909a_0
  - dask=2.18.1=py_0
  - dask-core=2.18.1=py_0
  - dask-cudf=0.14.0=py37_0
  - distributed=2.18.0=py37hc8dfbb8_0
  - dlpack=0.2=he1b5a44_1
  - double-conversion=3.1.5=he1b5a44_2
  - fastavro=0.23.4=py37h8f50634_0
  - fastrlock=0.5=py37h3340039_0
  - freetype=2.10.2=he06d7ca_0
  - fsspec=0.7.4=py_0
  - gflags=2.2.2=he1b5a44_1002
  - glog=0.4.0=h49b9bf7_3
  - grpc-cpp=1.23.0=h18db393_0
  - heapdict=1.0.1=py_0
  - icu=64.2=he1b5a44_1
  - jinja2=2.11.2=pyh9f0ad1d_0
  - joblib=0.15.1=py_0
  - jpeg=9d=h516909a_0
  - ld_impl_linux-64=2.33.1=h53a641e_7
  - libblas=3.8.0=16_openblas
  - libcblas=3.8.0=16_openblas
  - libcudf=0.14.0=cuda10.2_0
  - libcuml=0.14.0=cuda10.2_0
  - libcumlprims=0.14.1=cuda10.2_0
  - libedit=3.1.20181209=hc058e9b_0
  - libevent=2.1.10=h72c5cf5_0
  - libffi=3.3=he6710b0_1
  - libgcc-ng=9.2.0=h24d8f2e_2
  - libgfortran-ng=7.5.0=hdf63c60_6
  - libhwloc=2.1.0=h3c4fd83_0
  - libiconv=1.15=h516909a_1006
  - liblapack=3.8.0=16_openblas
  - libllvm8=8.0.1=hc9558a2_0
  - libnvstrings=0.14.0=cuda10.2_0
  - libopenblas=0.3.9=h5ec1e0e_0
  - libpng=1.6.37=hed695b0_1
  - libprotobuf=3.8.0=h8b12597_0
  - librmm=0.14.0=cuda10.2_0
  - libstdcxx-ng=9.1.0=hdf63c60_0
  - libtiff=4.1.0=hfc65ed5_0
  - libxml2=2.9.10=hee79883_0
  - llvm-openmp=10.0.0=hc9558a2_0
  - llvmlite=0.32.1=py37h5202443_0
  - locket=0.2.0=py_2
  - lz4-c=1.8.3=he1b5a44_1001
  - markupsafe=1.1.1=py37h8f50634_1
  - msgpack-python=1.0.0=py37h99015e2_1
  - nccl=2.6.4.1=hc6a2c23_0
  - ncurses=6.2=he6710b0_1
  - numba=0.49.1=py37h0da4684_0
  - numpy=1.17.5=py37h95a1406_0
  - nvstrings=0.14.0=py37_0
  - olefile=0.46=py_0
  - openssl=1.1.1g=h516909a_0
  - packaging=20.4=pyh9f0ad1d_0
  - pandas=0.25.3=py37hb3f55d8_0
  - parquet-cpp=1.5.1=2
  - partd=1.1.0=py_0
  - pillow=5.3.0=py37h00a061d_1000
  - pip=20.1.1=py37_1
  - psutil=5.7.0=py37h8f50634_1
  - pyarrow=0.15.0=py37h8b68381_1
  - pyparsing=2.4.7=pyh9f0ad1d_0
  - python=3.8.13=h12debd9_0
  - python-dateutil=2.8.1=py_0
  - python_abi=3.8=2_cp38
  - pytz=2020.1=pyh9f0ad1d_0
  - pyyaml=5.3.1=py37h8f50634_0
  - re2=2020.04.01=he1b5a44_0
  - readline=8.0=h7b6447c_0
  - rmm=0.14.0=py37_0
  - setuptools=47.3.0=py37_0
  - six=1.15.0=pyh9f0ad1d_0
  - snappy=1.1.8=he1b5a44_2
  - sortedcontainers=2.2.2=pyh9f0ad1d_0
  - spdlog=1.6.1=hc9558a2_0
  - sqlite=3.31.1=h62c20be_1
  - tblib=1.6.0=py_0
  - thrift-cpp=0.12.0=hf3afdfd_1004
  - tk=8.6.8=hbc83047_0
  - toolz=0.10.0=py_0
  - tornado=6.0.4=py37h8f50634_1
  - typing_extensions=3.7.4.2=py_0
  - ucx=1.8.0+gf6ec8d4=cuda10.2_20
  - ucx-py=0.14.0+gf6ec8d4=py37_0
  - uriparser=0.9.3=he1b5a44_1
  - wheel=0.34.2=py37_0
  - xz=5.2.5=h7b6447c_0
  - yaml=0.2.5=h516909a_0
  - zict=2.0.0=py_0
  - zlib=1.2.11=h7b6447c_3
  - zstd=1.4.3=h3b9ef0a_0
  - pip:
      - alembic==1.4.2
      - attrs==19.3.0
      - backcall==0.2.0
      - bleach==3.1.5
      - chardet==3.0.4
      - cycler==0.10.0
      - databricks-cli==0.11.0
      - decorator==4.4.2
      - defusedxml==0.6.0
      - docker==4.2.1
      - entrypoints==0.3
      - flask==1.1.2
      - future==0.18.2
      - gitdb==4.0.5
      - gitpython==3.1.3
      - gorilla==0.3.0
      - gunicorn==20.0.4
      - hyperopt==0.2.4
      - idna==2.9
      - importlib-metadata==1.6.1
      - ipykernel==5.3.0
      - ipython==7.15.0
      - ipython-genutils==0.2.0
      - ipywidgets==7.5.1
      - itsdangerous==1.1.0
      - jedi==0.17.0
      - json5==0.9.5
      - jsonschema==3.2.0
      - jupyter==1.0.0
      - jupyter-client==6.1.3
      - jupyter-console==6.1.0
      - jupyter-core==4.6.3
      - jupyterlab==2.1.4
      - jupyterlab-server==1.1.5
      - kiwisolver==1.2.0
      - lab==6.0
      - mako==1.1.3
      - matplotlib==3.2.2
      - mistune==0.8.4
      - mlflow==1.8.0
      - nbconvert==5.6.1
      - nbformat==5.0.7
      - networkx==2.4
      - notebook==6.0.3
      - pandocfilters==1.4.2
      - parso==0.7.0
      - pexpect==4.8.0
      - pickleshare==0.7.5
      - prometheus-client==0.8.0
      - prometheus-flask-exporter==0.14.1
      - prompt-toolkit==3.0.5
      - protobuf==3.12.2
      - ptyprocess==0.6.0
      - pygments==2.6.1
      - pyrsistent==0.16.0
      - python-editor==1.0.4
      - pyzmq==19.0.1
      - qtconsole==4.7.4
      - qtpy==1.9.0
      - querystring-parser==1.2.4
      - requests==2.24.0
      - scikit-learn==0.23.1
      - scipy==1.4.1
      - send2trash==1.5.0
      - simplejson==3.17.0
      - sklearn==0.0
      - smmap==3.0.4
      - sqlalchemy==1.3.13
      - sqlparse==0.4.2
      - tabulate==0.8.7
      - terminado==0.8.3
      - testpath==0.4.4
      - threadpoolctl==2.1.0
      - tqdm==4.46.1
      - traitlets==4.3.3
      - txt2tags==3.7
      - urllib3==1.25.9
      - wcwidth==0.2.4
      - webencodings==0.5.1
      - websocket-client==0.57.0
      - werkzeug==1.0.1
      - widgetsnbextension==3.5.1
      - zipp==3.1.0
```

--------------------------------------------------------------------------------

---[FILE: rapids_mlflow.ipynb]---
Location: mlflow-master/examples/rapids/mlflow_project/notebooks/rapids_mlflow.ipynb

```text
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Train and Publish Locally With RAPIDS and MLflow"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "import time\n",
    "\n",
    "from cuml.ensemble import RandomForestClassifier\n",
    "from cuml.metrics.accuracy import accuracy_score\n",
    "from cuml.preprocessing.model_selection import train_test_split\n",
    "\n",
    "import mlflow\n",
    "import mlflow.sklearn\n",
    "from mlflow.models import infer_signature"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Pull sample airline data"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "#!python -c \"from sklearn.datasets import load_iris; d = load_iris(as_frame=True); d.frame.to_csv('iris.csv', index=False)\""
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Define data loader, using cuDF"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "def load_data(fpath):\n",
    "    \"\"\"\n",
    "    Simple helper function for loading data to be used by CPU/GPU models.\n",
    "\n",
    "    Args:\n",
    "        fpath: Path to the data to be ingested\n",
    "\n",
    "    Returns:\n",
    "        DataFrame wrapping the data at [fpath]. Data will be in either a Pandas or RAPIDS (cuDF) DataFrame\n",
    "    \"\"\"\n",
    "    import cudf\n",
    "\n",
    "    df = cudf.read_csv(fpath)\n",
    "    X = df.drop([\"target\"], axis=1)\n",
    "    y = df[\"target\"].astype(\"int32\")\n",
    "\n",
    "    return train_test_split(X, y, test_size=0.2)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Define our training routine."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "def train(fpath, max_depth, max_features, n_estimators):\n",
    "    \"\"\"\n",
    "    Args:\n",
    "        fpath: Path or URL for the training data used with the model.\n",
    "        max_depth: int Max tree depth\n",
    "        max_features: float percentage of features to use in classification\n",
    "        n_estimators: int number of trees to create\n",
    "\n",
    "    Returns:\n",
    "        Trained model\n",
    "    \"\"\"\n",
    "    X_train, X_test, y_train, y_test = load_data(fpath)\n",
    "    mod = RandomForestClassifier(\n",
    "        max_depth=max_depth, max_features=max_features, n_estimators=n_estimators\n",
    "    )\n",
    "    acc_scorer = accuracy_score\n",
    "\n",
    "    mod.fit(X_train, y_train)\n",
    "    preds = mod.predict(X_test)\n",
    "    acc = acc_scorer(y_test, preds)\n",
    "\n",
    "    mlparams = {\n",
    "        \"max_depth\": str(max_depth),\n",
    "        \"max_features\": str(max_features),\n",
    "        \"n_estimators\": str(n_estimators),\n",
    "    }\n",
    "    mlflow.log_params(mlparams)\n",
    "\n",
    "    mlmetrics = {\"accuracy\": acc}\n",
    "    mlflow.log_metrics(mlmetrics)\n",
    "\n",
    "    return mod, infer_signature(X_train.to_pandas(), y_train.to_pandas())"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Implement our MLflow training loop, and save our best model to the tracking server."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "conda_env = \"conda.yaml\"\n",
    "fpath = \"iris.csv\"\n",
    "\n",
    "max_depth = 10\n",
    "max_features = 0.75\n",
    "n_estimators = 500\n",
    "\n",
    "artifact_path = \"Airline-Demo\"\n",
    "artifact_uri = None\n",
    "experiment_name = \"RAPIDS-Notebook\"\n",
    "experiment_id = None\n",
    "\n",
    "mlflow.set_tracking_uri(uri=\"sqlite:////tmp/mlflow-db.sqlite\")\n",
    "mlflow.set_experiment(experiment_name)\n",
    "\n",
    "with mlflow.start_run(run_name=\"(Notebook) RAPIDS-MLflow\"):\n",
    "    model, signature = train(fpath, max_depth, max_features, n_estimators)\n",
    "\n",
    "    mlflow.sklearn.log_model(\n",
    "        model,\n",
    "        signature=signature,\n",
    "        name=artifact_path,\n",
    "        registered_model_name=\"rapids-mlflow-notebook\",\n",
    "        conda_env=\"conda.yaml\",\n",
    "    )\n",
    "\n",
    "    artifact_uri = mlflow.get_artifact_uri(artifact_path=artifact_path)\n",
    "print(artifact_uri)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Begin serving our trained model using MLflow\n",
    "**Note:** The serving thread will continue to run after cell execution. Select the cell and click 'interrupt the kernel' to stop it."
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "pycharm": {
     "name": "#%% md\n"
    }
   },
   "source": [
    "In a terminal, run: `mlflow models serve -m [artifact_uri] -p [port]`, you should see something similar to the following:\n",
    "\n",
    "```shell\n",
    "2020/07/27 13:59:49 INFO mlflow.models.cli: Selected backend for flavor 'python_function'\n",
    "2020/07/27 13:59:49 INFO mlflow.pyfunc.backend: === Running command 'source /anaconda3/bin/../etc/profile.d/conda.sh && conda activate mlflow-3335621df6011b1847d2555b195418d4496e5ffd 1>&2 && gunicorn --timeout=60 -b 127.0.0.1:5000 -w 1 ${GUNICORN_CMD_ARGS} -- mlflow.pyfunc.scoring_server.wsgi:app'\n",
    "[2020-07-27 13:59:50 -0600] [23779] [INFO] Starting gunicorn 20.0.4\n",
    "[2020-07-27 13:59:50 -0600] [23779] [INFO] Listening at: http://127.0.0.1:5000 (23779)\n",
    "[2020-07-27 13:59:50 -0600] [23779] [INFO] Using worker: sync\n",
    "[2020-07-27 13:59:50 -0600] [23788] [INFO] Booting worker with pid: 23788\n",
    "```"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "pycharm": {
     "name": "#%% md\n"
    }
   },
   "source": [
    "### Make requests against the deployed model"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "import json\n",
    "\n",
    "import requests\n",
    "\n",
    "host = \"localhost\"\n",
    "port = \"55755\"\n",
    "\n",
    "headers = {\n",
    "    \"Content-Type\": \"application/json\",\n",
    "}\n",
    "\n",
    "data = {\n",
    "    \"columns\": [\n",
    "        \"Year\",\n",
    "        \"Month\",\n",
    "        \"DayofMonth\",\n",
    "        \"DayofWeek\",\n",
    "        \"CRSDepTime\",\n",
    "        \"CRSArrTime\",\n",
    "        \"UniqueCarrier\",\n",
    "        \"FlightNum\",\n",
    "        \"ActualElapsedTime\",\n",
    "        \"Origin\",\n",
    "        \"Dest\",\n",
    "        \"Distance\",\n",
    "        \"Diverted\",\n",
    "    ],\n",
    "    \"data\": [[1987, 10, 1, 4, 1, 556, 0, 190, 247, 202, 162, 1846, 0]],\n",
    "}\n",
    "\n",
    "## Pause to let server start\n",
    "time.sleep(5)\n",
    "\n",
    "while True:\n",
    "    try:\n",
    "        resp = requests.post(\n",
    "            url=f\"http://{host}:{port}/invocations\",\n",
    "            data=json.dumps({\"dataframe_split\": data}),\n",
    "            headers=headers,\n",
    "        )\n",
    "        print(\"Classification: %s\" % (\"ON-Time\" if resp.text == \"[0.0]\" else \"LATE\"))\n",
    "        break\n",
    "    except Exception as e:\n",
    "        errmsg = f\"Caught exception attempting to call model endpoint: {e}\"\n",
    "        print(errmsg, end=\"\")\n",
    "        print(\"Sleeping\")\n",
    "        time.sleep(20)"
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
   "version": "3.8.12"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 4
}
```

--------------------------------------------------------------------------------

---[FILE: sample_server_query.sh]---
Location: mlflow-master/examples/rapids/mlflow_project/src/sample_server_query.sh

```bash
curl -X POST -H "Content-Type:application/json" --data '{"dataframe_split": {"columns":["Year", "Month", "DayofMonth", "DayofWeek", "CRSDepTime", "CRSArrTime", "UniqueCarrier", "FlightNum", "ActualElapsedTime", "Origin"    , "Dest", "Distance", "Diverted"],"data":[[1987, 10, 1, 4, 1, 556, 0, 190, 247, 202, 162, 1846, 0]]}}' http://127.0.0.1:55755/invocations
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/rapids/mlflow_project/src/rf_test/train.py

```python
"""Hyperparameter optimization with cuML, hyperopt, and MLflow"""

import argparse
from functools import partial

from cuml.ensemble import RandomForestClassifier
from cuml.metrics.accuracy import accuracy_score
from cuml.preprocessing.model_selection import train_test_split
from hyperopt import STATUS_OK, Trials, fmin, hp, tpe

import mlflow
import mlflow.sklearn
from mlflow.models import infer_signature


def load_data(fpath):
    """
    Simple helper function for loading data to be used by CPU/GPU models.

    Args:
        fpath: Path to the data to be ingested

    Returns:
        DataFrame wrapping the data at [fpath]. Data will be in either a Pandas or RAPIDS (cuDF) DataFrame
    """
    import cudf

    df = cudf.read_csv(fpath)
    X = df.drop(["target"], axis=1)
    y = df["target"].astype("int32")

    return train_test_split(X, y, test_size=0.2)


def _train(params, fpath, hyperopt=False):
    """
    Args:
        params: Hyperparameters. Its structure is consistent with how search space is defined.
        fpath: Path or URL for the training data used with the model.
        hyperopt: Use hyperopt for hyperparameter search during training.

    Returns:
        dict with fields 'loss' (scalar loss) and 'status' (success/failure status of run).
    """
    max_depth, max_features, n_estimators = params
    max_depth = int(max_depth)
    max_features = float(max_features)
    n_estimators = int(n_estimators)

    X_train, X_test, y_train, y_test = load_data(fpath)

    mod = RandomForestClassifier(
        max_depth=max_depth, max_features=max_features, n_estimators=n_estimators
    )

    mod.fit(X_train, y_train)
    preds = mod.predict(X_test)
    acc = accuracy_score(y_test, preds)

    mlparams = {
        "max_depth": str(max_depth),
        "max_features": str(max_features),
        "n_estimators": str(n_estimators),
    }
    mlflow.log_params(mlparams)

    mlflow.log_metric("accuracy", acc)

    predictions = mod.predict(X_train)
    signature = infer_signature(X_train, predictions)

    mlflow.sklearn.log_model(mod, name="saved_models", signature=signature)

    if not hyperopt:
        return mod

    return {"loss": acc, "status": STATUS_OK}


def train(params, fpath, hyperopt=False):
    """
    Proxy function used to call _train

    Args:
        params: Hyperparameters. Its structure is consistent with how search space is defined.
        fpath: Path or URL for the training data used with the model.
        hyperopt: Use hyperopt for hyperparameter search during training.

    Returns:
        dict with fields 'loss' (scalar loss) and 'status' (success/failure status of run)

    """
    with mlflow.start_run(nested=True):
        return _train(params, fpath, hyperopt)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--algo", default="tpe", choices=["tpe"], type=str)
    parser.add_argument("--conda-env", required=True, type=str)
    parser.add_argument("--fpath", required=True, type=str)
    args = parser.parse_args()

    search_space = [
        hp.uniform("max_depth", 5, 20),
        hp.uniform("max_features", 0.1, 1.0),
        hp.uniform("n_estimators", 150, 1000),
    ]

    trials = Trials()
    algorithm = tpe.suggest if args.algo == "tpe" else None
    fn = partial(train, fpath=args.fpath, hyperopt=True)
    experid = 0

    artifact_path = "Airline-Demo"
    artifact_uri = None

    mlflow.set_tracking_uri(uri="sqlite:////tmp/mlflow-db.sqlite")
    with mlflow.start_run(run_name="RAPIDS-Hyperopt"):
        argmin = fmin(fn=fn, space=search_space, algo=algorithm, max_evals=2, trials=trials)

        print("===========")
        fn = partial(train, fpath=args.fpath, hyperopt=False)
        final_model = fn(tuple(argmin.values()))

        mlflow.sklearn.log_model(
            final_model,
            name=artifact_path,
            registered_model_name="rapids_mlflow_cli",
            conda_env="envs/conda.yaml",
        )
```

--------------------------------------------------------------------------------

````
