---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 13
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 13 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: pyproject.toml]---
Location: prowler-master/api/pyproject.toml
Signals: Docker

```toml
[build-system]
build-backend = "poetry.core.masonry.api"
requires = ["poetry-core"]

[project]
authors = [{name = "Prowler Engineering", email = "engineering@prowler.com"}]
dependencies = [
  "celery[pytest] (>=5.4.0,<6.0.0)",
  "dj-rest-auth[with_social,jwt] (==7.0.1)",
  "django (==5.1.14)",
  "django-allauth[saml] (>=65.8.0,<66.0.0)",
  "django-celery-beat (>=2.7.0,<3.0.0)",
  "django-celery-results (>=2.5.1,<3.0.0)",
  "django-cors-headers==4.4.0",
  "django-environ==0.11.2",
  "django-filter==24.3",
  "django-guid==3.5.0",
  "django-postgres-extra (>=2.0.8,<3.0.0)",
  "djangorestframework==3.15.2",
  "djangorestframework-jsonapi==7.0.2",
  "djangorestframework-simplejwt (>=5.3.1,<6.0.0)",
  "drf-nested-routers (>=0.94.1,<1.0.0)",
  "drf-spectacular==0.27.2",
  "drf-spectacular-jsonapi==0.5.1",
  "gunicorn==23.0.0",
  "lxml==5.3.2",
  "prowler @ git+https://github.com/prowler-cloud/prowler.git@master",
  "psycopg2-binary==2.9.9",
  "pytest-celery[redis] (>=1.0.1,<2.0.0)",
  "sentry-sdk[django] (>=2.20.0,<3.0.0)",
  "uuid6==2024.7.10",
  "openai (>=1.82.0,<2.0.0)",
  "xmlsec==1.3.14",
  "h2 (==4.3.0)",
  "markdown (>=3.9,<4.0)",
  "drf-simple-apikey (==2.2.1)",
  "matplotlib (>=3.10.6,<4.0.0)",
  "reportlab (>=4.4.4,<5.0.0)",
  "gevent (>=25.9.1,<26.0.0)"
]
description = "Prowler's API (Django/DRF)"
license = "Apache-2.0"
name = "prowler-api"
package-mode = false
# Needed for the SDK compatibility
requires-python = ">=3.11,<3.13"
version = "1.16.0"

[project.scripts]
celery = "src.backend.config.settings.celery"

[tool.poetry.group.dev.dependencies]
bandit = "1.7.9"
coverage = "7.5.4"
django-silk = "5.3.2"
docker = "7.1.0"
freezegun = "1.5.1"
marshmallow = ">=3.15.0,<4.0.0"
mypy = "1.10.1"
pylint = "3.2.5"
pytest = "8.2.2"
pytest-cov = "5.0.0"
pytest-django = "4.8.0"
pytest-env = "1.1.3"
pytest-randomly = "3.15.0"
pytest-xdist = "3.6.1"
ruff = "0.5.0"
safety = "3.2.9"
tqdm = "4.67.1"
vulture = "2.14"
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/api/README.md

```text
# Description

This repository contains the JSON API and Task Runner components for Prowler, which facilitate a complete backend that interacts with the Prowler SDK and is used by the Prowler UI.

# Components
The Prowler API is composed of the following components:

- The JSON API, which is an API built with Django Rest Framework.
- The Celery worker, which is responsible for executing the background tasks that are defined in the JSON API.
- The PostgreSQL database, which is used to store the data.
- The Valkey database, which is an in-memory database which is used as a message broker for the Celery workers.

## Note about Valkey

[Valkey](https://valkey.io/) is an open source (BSD) high performance key/value datastore.

Valkey exposes a Redis 7.2 compliant API. Any service that exposes the Redis API can be used with Prowler API.

# Modify environment variables

Under the root path of the project, you can find a file called `.env`. This file shows all the environment variables that the project uses. You should review it and set the values for the variables you want to change.

If you don’t set `DJANGO_TOKEN_SIGNING_KEY` or `DJANGO_TOKEN_VERIFYING_KEY`, the API will generate them at `~/.config/prowler-api/` with `0600` and `0644` permissions; back up these files to persist identity across redeploys.

**Important note**: Every Prowler version (or repository branches and tags) could have different variables set in its `.env` file. Please use the `.env` file that corresponds with each version.

## Local deployment
Keep in mind if you export the `.env` file to use it with local deployment that you will have to do it within the context of the Poetry interpreter, not before. Otherwise, variables will not be loaded properly.

To do this, you can run:

```console
poetry shell
set -a
source .env
```

# 🚀 Production deployment
## Docker deployment

This method requires `docker` and `docker compose`.

### Clone the repository

```console
# HTTPS
git clone https://github.com/prowler-cloud/api.git

# SSH
git clone git@github.com:prowler-cloud/api.git

```

### Build the base image

```console
docker compose --profile prod build
```

### Run the production service

This command will start the Django production server and the Celery worker and also the Valkey and PostgreSQL databases.

```console
docker compose --profile prod up -d
```

You can access the server in `http://localhost:8080`.

> **NOTE:** notice how the port is different. When developing using docker, the port will be `8080` to prevent conflicts.

### View the Production Server Logs

To view the logs for any component (e.g., Django, Celery worker), you can use the following command with a wildcard. This command will follow logs for any container that matches the specified pattern:

```console
docker logs -f $(docker ps --format "{{.Names}}" | grep 'api-')

## Local deployment

To use this method, you'll need to set up a Python virtual environment (version ">=3.11,<3.13") and keep dependencies updated. Additionally, ensure that `poetry` and `docker compose` are installed.

### Clone the repository

```console
# HTTPS
git clone https://github.com/prowler-cloud/api.git

# SSH
git clone git@github.com:prowler-cloud/api.git

```
### Install all dependencies with Poetry

```console
poetry install
poetry shell
```

## Start the PostgreSQL Database and Valkey

The PostgreSQL database (version 16.3) and Valkey (version 7) are required for the development environment. To make development easier, we have provided a `docker-compose` file that will start these components for you.

**Note:** Make sure to use the specified versions, as there are features in our setup that may not be compatible with older versions of PostgreSQL and Valkey.


```console
docker compose up postgres valkey -d
```

## Deploy Django and the Celery worker

### Run migrations

For migrations, you need to force the `admin` database router. Assuming you have the correct environment variables and Python virtual environment, run:

```console
cd src/backend
python manage.py migrate --database admin
```

### Run the Celery worker

```console
cd src/backend
python -m celery -A config.celery worker -l info -E
```

### Run the Django server with Gunicorn

```console
cd src/backend
gunicorn -c config/guniconf.py config.wsgi:application
```

> By default, the Gunicorn server will try to use as many workers as your machine can handle. You can manually change that in the `src/backend/config/guniconf.py` file.

# 🧪 Development guide

## Local deployment

To use this method, you'll need to set up a Python virtual environment (version ">=3.11,<3.13") and keep dependencies updated. Additionally, ensure that `poetry` and `docker compose` are installed.

### Clone the repository

```console
# HTTPS
git clone https://github.com/prowler-cloud/api.git

# SSH
git clone git@github.com:prowler-cloud/api.git

```

### Start the PostgreSQL Database and Valkey

The PostgreSQL database (version 16.3) and Valkey (version 7) are required for the development environment. To make development easier, we have provided a `docker-compose` file that will start these components for you.

**Note:** Make sure to use the specified versions, as there are features in our setup that may not be compatible with older versions of PostgreSQL and Valkey.


```console
docker compose up postgres valkey -d
```

### Install the Python dependencies

> You must have Poetry installed

```console
poetry install
poetry shell
```

### Apply migrations

For migrations, you need to force the `admin` database router. Assuming you have the correct environment variables and Python virtual environment, run:

```console
cd src/backend
python manage.py migrate --database admin
```

### Run the Django development server

```console
cd src/backend
python manage.py runserver
```

You can access the server in `http://localhost:8000`.
All changes in the code will be automatically reloaded in the server.

### Run the Celery worker

```console
python -m celery -A config.celery worker -l info -E
```

The Celery worker does not detect and reload changes in the code, so you need to restart it manually when you make changes.

## Docker deployment

This method requires `docker` and `docker compose`.

### Clone the repository

```console
# HTTPS
git clone https://github.com/prowler-cloud/api.git

# SSH
git clone git@github.com:prowler-cloud/api.git

```

### Build the base image

```console
docker compose --profile dev build
```

### Run the development service

This command will start the Django development server and the Celery worker and also the Valkey and PostgreSQL databases.

```console
docker compose --profile dev up -d
```

You can access the server in `http://localhost:8080`.
All changes in the code will be automatically reloaded in the server.

> **NOTE:** notice how the port is different. When developing using docker, the port will be `8080` to prevent conflicts.

### View the development server logs

To view the logs for any component (e.g., Django, Celery worker), you can use the following command with a wildcard. This command will follow logs for any container that matches the specified pattern:

```console
docker logs -f $(docker ps --format "{{.Names}}" | grep 'api-')
```

## Applying migrations

For migrations, you need to force the `admin` database router. Assuming you have the correct environment variables and Python virtual environment, run:

```console
poetry shell
cd src/backend
python manage.py migrate --database admin
```

## Apply fixtures

Fixtures are used to populate the database with initial development data.

```console
poetry shell
cd src/backend
python manage.py loaddata api/fixtures/0_dev_users.json --database admin
```

> The default credentials are `dev@prowler.com:Thisisapassword123@` or `dev2@prowler.com:Thisisapassword123@`

## Run tests

Note that the tests will fail if you use the same `.env` file as the development environment.

For best results, run in a new shell with no environment variables set.

```console
poetry shell
cd src/backend
pytest
```

# Custom commands

Django provides a way to create custom commands that can be run from the command line.

> These commands can be found in: ```prowler/api/src/backend/api/management/commands```

To run a custom command, you need to be in the `prowler/api/src/backend` directory and run:

```console
poetry shell
python manage.py <command_name>
```

## Generate dummy data

```console
python manage.py findings --tenant
<TENANT_ID> --findings <NUM_FINDINGS> --re
sources <NUM_RESOURCES> --batch <TRANSACTION_BATCH_SIZE> --alias <ALIAS>
```

This command creates, for a given tenant, a provider, scan and a set of findings and resources related altogether.

> Scan progress and state are updated in real time.
> - 0-33%: Create resources.
> - 33-66%: Create findings.
> - 66%: Create resource-finding mapping.
>
> The last step is required to access the findings details, since the UI needs that to print all the information.

### Example

```console
~/backend $ poetry run python manage.py findings --tenant
fffb1893-3fc7-4623-a5d9-fae47da1c528 --findings 25000 --re
sources 1000 --batch 5000 --alias test-script

Starting data population
	Tenant: fffb1893-3fc7-4623-a5d9-fae47da1c528
	Alias: test-script
	Resources: 1000
	Findings: 25000
	Batch size: 5000


Creating resources...
100%|███████████████████████| 1/1 [00:00<00:00,  7.72it/s]
Resources created successfully.


Creating findings...
100%|███████████████████████| 5/5 [00:05<00:00,  1.09s/it]
Findings created successfully.


Creating resource-finding mappings...
100%|███████████████████████| 5/5 [00:02<00:00,  1.81it/s]
Resource-finding mappings created successfully.


Successfully populated test data.
```
```

--------------------------------------------------------------------------------

---[FILE: partitions.md]---
Location: prowler-master/api/docs/partitions.md

```text
# Partitions

## Overview

Partitions are used to split the data in a table into smaller chunks, allowing for more efficient querying and storage.

The Prowler API uses partitions to store findings. The partitions are created based on the UUIDv7 `id` field.

You can use the Prowler API without ever creating additional partitions. This documentation is only relevant if you want to manage partitions to gain additional query performance.

### Required Postgres Configuration

There are 3 configuration options that need to be set in the `postgres.conf` file to get the most performance out of the partitioning:

- `enable_partition_pruning = on` (default is on)
- `enable_partitionwise_join = on` (default is off)
- `enable_partitionwise_aggregate = on` (default is off)

For more information on these options, see the [Postgres documentation](https://www.postgresql.org/docs/current/runtime-config-query.html).

## Partitioning Strategy

The partitioning strategy is defined in the `api.partitions` module. The strategy is responsible for creating and deleting partitions based on the provided configuration.

## Managing Partitions

The application will run without any extra work on your part. If you want to add or delete partitions, you can use the following commands:

To manage the partitions, run `python manage.py pgpartition --using admin`

This command will generate a list of partitions to create and delete based on the provided configuration.

By default, the command will prompt you to accept the changes before applying them.

```shell
Finding:
   + 2024_nov
      name: 2024_nov
      from_values: 0192e505-9000-72c8-a47c-cce719d8fb93
      to_values: 01937f84-5418-7eb8-b2a6-e3be749e839d
      size_unit: months
      size_value: 1
   + 2024_dec
      name: 2024_dec
      from_values: 01937f84-5800-7b55-879c-9cdb46f023f6
      to_values: 01941f29-7818-7f9f-b4be-20b05bb2f574
      size_unit: months
      size_value: 1

0 partitions will be deleted
2 partitions will be created
```

If you choose to apply the partitions, tables will be generated with the following format: `<table_name>_<year>_<month>`.

For more info on the partitioning manager, see https://github.com/SectorLabs/django-postgres-extra

### Changing the Partitioning Parameters

There are 4 environment variables that can be used to change the partitioning parameters:

- `DJANGO_MANAGE_DB_PARTITIONS`: Allow Django to manage database partitons. By default is set to `False`.
- `FINDINGS_TABLE_PARTITION_MONTHS`: Set the months for each partition. Setting the partition monts to 1 will create partitions with a size of 1 natural month.
- `FINDINGS_TABLE_PARTITION_COUNT`: Set the number of partitions to create
- `FINDINGS_TABLE_PARTITION_MAX_AGE_MONTHS`: Set the number of months to keep partitions before deleting them. Setting this to `None` will keep partitions indefinitely.
```

--------------------------------------------------------------------------------

````
