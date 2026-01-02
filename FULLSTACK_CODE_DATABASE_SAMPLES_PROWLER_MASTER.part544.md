---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 544
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 544 of 867)

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

---[FILE: ecs_task_definitions_logging_block_mode_test.py]---
Location: prowler-master/tests/providers/aws/services/ecs/ecs_task_definitions_logging_block_mode/ecs_task_definitions_logging_block_mode_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

TASK_NAME = "test-task"
TASK_REVISION = "1"
CONTAINER_NAME = "test-container"


class Test_ecs_task_definitions_logging_block_mode:
    def test_no_task_definitions(self):
        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_logging_block_mode.ecs_task_definitions_logging_block_mode.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_logging_block_mode.ecs_task_definitions_logging_block_mode import (
                ecs_task_definitions_logging_block_mode,
            )

            check = ecs_task_definitions_logging_block_mode()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_task_definition_no_logconfiguration(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_logging_block_mode.ecs_task_definitions_logging_block_mode.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_logging_block_mode.ecs_task_definitions_logging_block_mode import (
                ecs_task_definitions_logging_block_mode,
            )

            check = ecs_task_definitions_logging_block_mode()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_task_definition_log_configuration_no_mode(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [],
                    "logConfiguration": {"logDriver": "awslogs"},
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_logging_block_mode.ecs_task_definitions_logging_block_mode.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_logging_block_mode.ecs_task_definitions_logging_block_mode import (
                ecs_task_definitions_logging_block_mode,
            )

            check = ecs_task_definitions_logging_block_mode()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} running with logging set to blocking mode on containers: {CONTAINER_NAME}"
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_task_definition_log_configuration_block_mode(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": True,
                    "user": "root",
                    "environment": [],
                    "logConfiguration": {
                        "logDriver": "awslogs",
                        "options": {
                            "mode": "non-blocking",
                            "max-buffer-size": "25m",
                        },
                    },
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_logging_block_mode.ecs_task_definitions_logging_block_mode.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_logging_block_mode.ecs_task_definitions_logging_block_mode import (
                ecs_task_definitions_logging_block_mode,
            )

            check = ecs_task_definitions_logging_block_mode()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} containers has logging configured with non blocking mode."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/ecs/ecs_task_definitions_logging_enabled/ecs_task_definitions_logging_enabled_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

TASK_NAME = "test-task"
TASK_REVISION = "1"
CONTAINER_NAME = "test-container"


class Test_ecs_task_definitions_logging_enabled:
    def test_no_task_definitions(self):
        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_logging_enabled.ecs_task_definitions_logging_enabled.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_logging_enabled.ecs_task_definitions_logging_enabled import (
                ecs_task_definitions_logging_enabled,
            )

            check = ecs_task_definitions_logging_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_task_definition_no_logconfiguration(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_logging_enabled.ecs_task_definitions_logging_enabled.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_logging_enabled.ecs_task_definitions_logging_enabled import (
                ecs_task_definitions_logging_enabled,
            )

            check = ecs_task_definitions_logging_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} has containers running with no logging configuration: {CONTAINER_NAME}"
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_task_definition_privileged_container(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": True,
                    "user": "root",
                    "environment": [],
                    "logConfiguration": {"logDriver": "awslogs"},
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_logging_enabled.ecs_task_definitions_logging_enabled.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_logging_enabled.ecs_task_definitions_logging_enabled import (
                ecs_task_definitions_logging_enabled,
            )

            check = ecs_task_definitions_logging_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} containers have logging configured."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_no_environment_secrets_test.py]---
Location: prowler-master/tests/providers/aws/services/ecs/ecs_task_definitions_no_environment_secrets/ecs_task_definitions_no_environment_secrets_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

TASK_NAME = "test-task"
TASK_REVISION = "1"
CONTAINER_NAME = "test-container"
ENV_VAR_NAME_NO_SECRETS = "host"
ENV_VAR_VALUE_NO_SECRETS = "localhost:1234"
ENV_VAR_NAME_WITH_KEYWORD = "DB_PASSWORD"
ENV_VAR_VALUE_WITH_SECRETS = "srv://admin:pass@db"
ENV_VAR_NAME_WITH_KEYWORD2 = "DATABASE_PASSWORD"
ENV_VAR_VALUE_WITH_SECRETS2 = "srv://admin:password@database"


class Test_ecs_task_definitions_no_environment_secrets:
    def test_no_task_definitions(self):
        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets import (
                ecs_task_definitions_no_environment_secrets,
            )

            check = ecs_task_definitions_no_environment_secrets()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_container_env_var_no_secrets(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [
                        {
                            "name": ENV_VAR_NAME_NO_SECRETS,
                            "value": ENV_VAR_VALUE_NO_SECRETS,
                        }
                    ],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets import (
                ecs_task_definitions_no_environment_secrets,
            )

            check = ecs_task_definitions_no_environment_secrets()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"No secrets found in variables of ECS task definition {TASK_NAME} with revision {TASK_REVISION}."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_container_env_var_with_secret(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [
                        {
                            "name": ENV_VAR_NAME_NO_SECRETS,
                            "value": ENV_VAR_VALUE_WITH_SECRETS,
                        }
                    ],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets import (
                ecs_task_definitions_no_environment_secrets,
            )

            check = ecs_task_definitions_no_environment_secrets()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secrets found in ECS task definition {TASK_NAME} with revision {TASK_REVISION}: Secrets in container test-container -> Basic Auth Credentials on the environment variable host."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_container_env_var_with_keyword(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [
                        {
                            "name": ENV_VAR_NAME_WITH_KEYWORD,
                            "value": ENV_VAR_VALUE_NO_SECRETS,
                        }
                    ],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets import (
                ecs_task_definitions_no_environment_secrets,
            )

            check = ecs_task_definitions_no_environment_secrets()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secrets found in ECS task definition {TASK_NAME} with revision {TASK_REVISION}: Secrets in container test-container -> Secret Keyword on the environment variable DB_PASSWORD."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_container_env_var_with_keyword_and_secret(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [
                        {
                            "name": ENV_VAR_NAME_WITH_KEYWORD,
                            "value": ENV_VAR_VALUE_WITH_SECRETS,
                        }
                    ],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets import (
                ecs_task_definitions_no_environment_secrets,
            )

            check = ecs_task_definitions_no_environment_secrets()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secrets found in ECS task definition {TASK_NAME} with revision {TASK_REVISION}: Secrets in container test-container -> Secret Keyword on the environment variable DB_PASSWORD, Basic Auth Credentials on the environment variable DB_PASSWORD."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_container_multiple_env_vars_with_keyword_and_secret(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [
                        {
                            "name": ENV_VAR_NAME_WITH_KEYWORD,
                            "value": ENV_VAR_VALUE_WITH_SECRETS,
                        },
                        {
                            "name": ENV_VAR_NAME_NO_SECRETS,
                            "value": ENV_VAR_VALUE_WITH_SECRETS2,
                        },
                    ],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets import (
                ecs_task_definitions_no_environment_secrets,
            )

            check = ecs_task_definitions_no_environment_secrets()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secrets found in ECS task definition {TASK_NAME} with revision {TASK_REVISION}: Secrets in container test-container -> Secret Keyword on the environment variable DB_PASSWORD, Basic Auth Credentials on the environment variable DB_PASSWORD, Basic Auth Credentials on the environment variable host."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_container_all_env_vars_with_keyword_and_secret(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [
                        {
                            "name": ENV_VAR_NAME_WITH_KEYWORD,
                            "value": ENV_VAR_VALUE_WITH_SECRETS,
                        },
                        {
                            "name": ENV_VAR_NAME_WITH_KEYWORD2,
                            "value": ENV_VAR_VALUE_WITH_SECRETS2,
                        },
                    ],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_no_environment_secrets.ecs_task_definitions_no_environment_secrets import (
                ecs_task_definitions_no_environment_secrets,
            )

            check = ecs_task_definitions_no_environment_secrets()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secrets found in ECS task definition {TASK_NAME} with revision {TASK_REVISION}: Secrets in container test-container -> Secret Keyword on the environment variable DB_PASSWORD, Basic Auth Credentials on the environment variable DB_PASSWORD, Basic Auth Credentials on the environment variable DATABASE_PASSWORD, Secret Keyword on the environment variable DATABASE_PASSWORD."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_no_privileged_containers_test.py]---
Location: prowler-master/tests/providers/aws/services/ecs/ecs_task_definitions_no_privileged_containers/ecs_task_definitions_no_privileged_containers_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

TASK_NAME = "test-task"
TASK_REVISION = "1"
CONTAINER_NAME = "test-container"


class Test_ecs_task_definitions_no_privileged_containers:
    def test_no_task_definitions(self):
        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_no_privileged_containers.ecs_task_definitions_no_privileged_containers.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_no_privileged_containers.ecs_task_definitions_no_privileged_containers import (
                ecs_task_definitions_no_privileged_containers,
            )

            check = ecs_task_definitions_no_privileged_containers()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_task_definition_no_priviled_container(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_no_privileged_containers.ecs_task_definitions_no_privileged_containers.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_no_privileged_containers.ecs_task_definitions_no_privileged_containers import (
                ecs_task_definitions_no_privileged_containers,
            )

            check = ecs_task_definitions_no_privileged_containers()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} does not have privileged containers."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_task_definition_privileged_container(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": True,
                    "user": "root",
                    "environment": [],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_no_privileged_containers.ecs_task_definitions_no_privileged_containers.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_no_privileged_containers.ecs_task_definitions_no_privileged_containers import (
                ecs_task_definitions_no_privileged_containers,
            )

            check = ecs_task_definitions_no_privileged_containers()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} has privileged containers: {CONTAINER_NAME}"
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

````
