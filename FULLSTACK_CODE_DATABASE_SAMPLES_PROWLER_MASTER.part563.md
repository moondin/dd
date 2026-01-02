---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 563
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 563 of 867)

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

---[FILE: glue_development_endpoints_job_bookmark_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/glue/glue_development_endpoints_job_bookmark_encryption_enabled/glue_development_endpoints_job_bookmark_encryption_enabled_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.glue.glue_service import DevEndpoint, SecurityConfig
from tests.providers.aws.utils import AWS_REGION_US_EAST_1


class Test_glue_development_endpoints_job_bookmark_encryption_enabled:
    def test_glue_no_endpoints(self):
        glue_client = MagicMock
        glue_client.dev_endpoints = []

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_development_endpoints_job_bookmark_encryption_enabled.glue_development_endpoints_job_bookmark_encryption_enabled import (
                glue_development_endpoints_job_bookmark_encryption_enabled,
            )

            check = glue_development_endpoints_job_bookmark_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_glue_encrypted_endpoint(self):
        glue_client = MagicMock
        glue_client.dev_endpoints = [
            DevEndpoint(
                name="test",
                security="sec_config",
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"test": "value"}],
            )
        ]
        glue_client.security_configs = [
            SecurityConfig(
                name="sec_config",
                jb_encryption="SSE-KMS",
                jb_key_arn="key_arn",
                cw_encryption="DISABLED",
                s3_encryption="DISABLED",
                region=AWS_REGION_US_EAST_1,
            )
        ]

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_development_endpoints_job_bookmark_encryption_enabled.glue_development_endpoints_job_bookmark_encryption_enabled import (
                glue_development_endpoints_job_bookmark_encryption_enabled,
            )

            check = glue_development_endpoints_job_bookmark_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Glue development endpoint test has Job Bookmark encryption enabled with key key_arn."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"test": "value"}]

    def test_glue_unencrypted_endpoint(self):
        glue_client = MagicMock
        glue_client.dev_endpoints = [
            DevEndpoint(
                name="test",
                security="sec_config",
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"test": "value"}],
            )
        ]
        glue_client.security_configs = [
            SecurityConfig(
                name="sec_config",
                s3_encryption="DISABLED",
                cw_encryption="DISABLED",
                jb_encryption="DISABLED",
                region=AWS_REGION_US_EAST_1,
            )
        ]

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_development_endpoints_job_bookmark_encryption_enabled.glue_development_endpoints_job_bookmark_encryption_enabled import (
                glue_development_endpoints_job_bookmark_encryption_enabled,
            )

            check = glue_development_endpoints_job_bookmark_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue development endpoint test does not have Job Bookmark encryption enabled."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"test": "value"}]

    def test_glue_no_sec_configs(self):
        glue_client = MagicMock
        glue_client.dev_endpoints = [
            DevEndpoint(
                name="test",
                security="sec_config",
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"test": "value"}],
            )
        ]
        glue_client.security_configs = []

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_development_endpoints_job_bookmark_encryption_enabled.glue_development_endpoints_job_bookmark_encryption_enabled import (
                glue_development_endpoints_job_bookmark_encryption_enabled,
            )

            check = glue_development_endpoints_job_bookmark_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue development endpoint test does not have security configuration."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"test": "value"}]
```

--------------------------------------------------------------------------------

---[FILE: glue_development_endpoints_s3_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/glue/glue_development_endpoints_s3_encryption_enabled/glue_development_endpoints_s3_encryption_enabled_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.glue.glue_service import DevEndpoint, SecurityConfig
from tests.providers.aws.utils import AWS_REGION_US_EAST_1


class Test_glue_development_endpoints_s3_encryption_enabled:
    def test_glue_no_endpoints(self):
        glue_client = MagicMock
        glue_client.dev_endpoints = []

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_development_endpoints_s3_encryption_enabled.glue_development_endpoints_s3_encryption_enabled import (
                glue_development_endpoints_s3_encryption_enabled,
            )

            check = glue_development_endpoints_s3_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_glue_encrypted_endpoint(self):
        glue_client = MagicMock
        glue_client.dev_endpoints = [
            DevEndpoint(
                name="test",
                security="sec_config",
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = [
            SecurityConfig(
                name="sec_config",
                s3_encryption="SSE-KMS",
                s3_key_arn="key_arn",
                cw_encryption="DISABLED",
                jb_encryption="DISABLED",
                region=AWS_REGION_US_EAST_1,
            )
        ]

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_development_endpoints_s3_encryption_enabled.glue_development_endpoints_s3_encryption_enabled import (
                glue_development_endpoints_s3_encryption_enabled,
            )

            check = glue_development_endpoints_s3_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Glue development endpoint test has S3 encryption enabled with key key_arn."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]

    def test_glue_unencrypted_endpoint(self):
        glue_client = MagicMock
        glue_client.dev_endpoints = [
            DevEndpoint(
                name="test",
                security="sec_config",
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = [
            SecurityConfig(
                name="sec_config",
                s3_encryption="DISABLED",
                cw_encryption="DISABLED",
                jb_encryption="DISABLED",
                region=AWS_REGION_US_EAST_1,
            )
        ]

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_development_endpoints_s3_encryption_enabled.glue_development_endpoints_s3_encryption_enabled import (
                glue_development_endpoints_s3_encryption_enabled,
            )

            check = glue_development_endpoints_s3_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue development endpoint test does not have S3 encryption enabled."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]

    def test_glue_no_sec_configs(self):
        glue_client = MagicMock
        glue_client.dev_endpoints = [
            DevEndpoint(
                name="test",
                security="sec_config",
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = []

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_development_endpoints_s3_encryption_enabled.glue_development_endpoints_s3_encryption_enabled import (
                glue_development_endpoints_s3_encryption_enabled,
            )

            check = glue_development_endpoints_s3_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue development endpoint test does not have security configuration."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]
```

--------------------------------------------------------------------------------

---[FILE: glue_etl_jobs_amazon_s3_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/glue/glue_etl_jobs_amazon_s3_encryption_enabled/glue_etl_jobs_amazon_s3_encryption_enabled_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.glue.glue_service import Job, SecurityConfig
from tests.providers.aws.utils import AWS_REGION_US_EAST_1


class Test_glue_etl_jobs_amazon_s3_encryption_enabled:
    def test_glue_no_jobs(self):
        glue_client = MagicMock
        glue_client.jobs = []

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_etl_jobs_amazon_s3_encryption_enabled.glue_etl_jobs_amazon_s3_encryption_enabled import (
                glue_etl_jobs_amazon_s3_encryption_enabled,
            )

            check = glue_etl_jobs_amazon_s3_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_glue_encrypted_job(self):
        glue_client = MagicMock
        glue_client.jobs = [
            Job(
                name="test",
                security="sec_config",
                arguments=None,
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = [
            SecurityConfig(
                name="sec_config",
                s3_encryption="SSE-KMS",
                s3_key_arn="key_arn",
                cw_encryption="DISABLED",
                jb_encryption="DISABLED",
                region=AWS_REGION_US_EAST_1,
            )
        ]

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_etl_jobs_amazon_s3_encryption_enabled.glue_etl_jobs_amazon_s3_encryption_enabled import (
                glue_etl_jobs_amazon_s3_encryption_enabled,
            )

            check = glue_etl_jobs_amazon_s3_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Glue job test has S3 encryption enabled with key key_arn."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]

    def test_glue_unencrypted_job(self):
        glue_client = MagicMock
        glue_client.jobs = [
            Job(
                name="test",
                security="sec_config",
                arguments=None,
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = [
            SecurityConfig(
                name="sec_config",
                s3_encryption="DISABLED",
                cw_encryption="DISABLED",
                jb_encryption="DISABLED",
                region=AWS_REGION_US_EAST_1,
            )
        ]

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_etl_jobs_amazon_s3_encryption_enabled.glue_etl_jobs_amazon_s3_encryption_enabled import (
                glue_etl_jobs_amazon_s3_encryption_enabled,
            )

            check = glue_etl_jobs_amazon_s3_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue job test does not have S3 encryption enabled."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]

    def test_glue_no_sec_configs(self):
        glue_client = MagicMock
        glue_client.jobs = [
            Job(
                name="test",
                security="sec_config",
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = []

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_etl_jobs_amazon_s3_encryption_enabled.glue_etl_jobs_amazon_s3_encryption_enabled import (
                glue_etl_jobs_amazon_s3_encryption_enabled,
            )

            check = glue_etl_jobs_amazon_s3_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue job test does not have security configuration."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]

    def test_glue_encrypted_job_with_argument(self):
        glue_client = MagicMock
        glue_client.jobs = [
            Job(
                name="test",
                security="sec_config",
                arguments={
                    "--encryption-type": "sse-s3",
                    "--enable-job-insights": "false",
                },
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = []

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_etl_jobs_amazon_s3_encryption_enabled.glue_etl_jobs_amazon_s3_encryption_enabled import (
                glue_etl_jobs_amazon_s3_encryption_enabled,
            )

            check = glue_etl_jobs_amazon_s3_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "Glue job test has S3 encryption enabled."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]
```

--------------------------------------------------------------------------------

---[FILE: glue_etl_jobs_cloudwatch_logs_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/glue/glue_etl_jobs_cloudwatch_logs_encryption_enabled/glue_etl_jobs_cloudwatch_logs_encryption_enabled_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.glue.glue_service import Job, SecurityConfig
from tests.providers.aws.utils import AWS_REGION_US_EAST_1


class Test_glue_etl_jobs_cloudwatch_logs_encryption_enabled:
    def test_glue_no_jobs(self):
        glue_client = MagicMock
        glue_client.jobs = []

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_etl_jobs_cloudwatch_logs_encryption_enabled.glue_etl_jobs_cloudwatch_logs_encryption_enabled import (
                glue_etl_jobs_cloudwatch_logs_encryption_enabled,
            )

            check = glue_etl_jobs_cloudwatch_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_glue_encrypted_job(self):
        glue_client = MagicMock
        glue_client.jobs = [
            Job(
                name="test",
                security="sec_config",
                arguments=None,
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = [
            SecurityConfig(
                name="sec_config",
                cw_encryption="SSE-KMS",
                cw_key_arn="key_arn",
                s3_encryption="DISABLED",
                jb_encryption="DISABLED",
                region=AWS_REGION_US_EAST_1,
            )
        ]

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_etl_jobs_cloudwatch_logs_encryption_enabled.glue_etl_jobs_cloudwatch_logs_encryption_enabled import (
                glue_etl_jobs_cloudwatch_logs_encryption_enabled,
            )

            check = glue_etl_jobs_cloudwatch_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Glue job test has CloudWatch Logs encryption enabled with key key_arn."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]

    def test_glue_unencrypted_job(self):
        glue_client = MagicMock
        glue_client.jobs = [
            Job(
                name="test",
                security="sec_config",
                arguments=None,
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = [
            SecurityConfig(
                name="sec_config",
                s3_encryption="DISABLED",
                cw_encryption="DISABLED",
                jb_encryption="DISABLED",
                region=AWS_REGION_US_EAST_1,
            )
        ]

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_etl_jobs_cloudwatch_logs_encryption_enabled.glue_etl_jobs_cloudwatch_logs_encryption_enabled import (
                glue_etl_jobs_cloudwatch_logs_encryption_enabled,
            )

            check = glue_etl_jobs_cloudwatch_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue job test does not have CloudWatch Logs encryption enabled."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]

    def test_glue_no_sec_configs(self):
        glue_client = MagicMock
        glue_client.jobs = [
            Job(
                name="test",
                security="sec_config",
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = []

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_etl_jobs_cloudwatch_logs_encryption_enabled.glue_etl_jobs_cloudwatch_logs_encryption_enabled import (
                glue_etl_jobs_cloudwatch_logs_encryption_enabled,
            )

            check = glue_etl_jobs_cloudwatch_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue job test does not have security configuration."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]
```

--------------------------------------------------------------------------------

---[FILE: glue_etl_jobs_job_bookmark_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/glue/glue_etl_jobs_job_bookmark_encryption_enabled/glue_etl_jobs_job_bookmark_encryption_enabled_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.glue.glue_service import Job, SecurityConfig
from tests.providers.aws.utils import AWS_REGION_US_EAST_1


class Test_glue_etl_jobs_job_bookmark_encryption_enabled:
    def test_glue_no_jobs(self):
        glue_client = MagicMock
        glue_client.jobs = []

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_etl_jobs_job_bookmark_encryption_enabled.glue_etl_jobs_job_bookmark_encryption_enabled import (
                glue_etl_jobs_job_bookmark_encryption_enabled,
            )

            check = glue_etl_jobs_job_bookmark_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_glue_encrypted_job(self):
        glue_client = MagicMock
        glue_client.jobs = [
            Job(
                name="test",
                security="sec_config",
                arguments=None,
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = [
            SecurityConfig(
                name="sec_config",
                jb_encryption="SSE-KMS",
                jb_key_arn="key_arn",
                s3_encryption="DISABLED",
                cw_encryption="DISABLED",
                region=AWS_REGION_US_EAST_1,
            )
        ]

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_etl_jobs_job_bookmark_encryption_enabled.glue_etl_jobs_job_bookmark_encryption_enabled import (
                glue_etl_jobs_job_bookmark_encryption_enabled,
            )

            check = glue_etl_jobs_job_bookmark_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Glue job test has Job bookmark encryption enabled with key key_arn."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]

    def test_glue_unencrypted_job(self):
        glue_client = MagicMock
        glue_client.jobs = [
            Job(
                name="test",
                security="sec_config",
                arguments=None,
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = [
            SecurityConfig(
                name="sec_config",
                s3_encryption="DISABLED",
                cw_encryption="DISABLED",
                jb_encryption="DISABLED",
                region=AWS_REGION_US_EAST_1,
            )
        ]

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_etl_jobs_job_bookmark_encryption_enabled.glue_etl_jobs_job_bookmark_encryption_enabled import (
                glue_etl_jobs_job_bookmark_encryption_enabled,
            )

            check = glue_etl_jobs_job_bookmark_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue job test does not have Job bookmark encryption enabled."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]

    def test_glue_no_sec_configs(self):
        glue_client = MagicMock
        glue_client.jobs = [
            Job(
                name="test",
                security="sec_config",
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = []

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_etl_jobs_job_bookmark_encryption_enabled.glue_etl_jobs_job_bookmark_encryption_enabled import (
                glue_etl_jobs_job_bookmark_encryption_enabled,
            )

            check = glue_etl_jobs_job_bookmark_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue job test does not have security configuration."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]
```

--------------------------------------------------------------------------------

---[FILE: glue_etl_jobs_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/glue/glue_etl_jobs_logging_enabled/glue_etl_jobs_logging_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_glue_etl_jobs_logging_enabled:
    @mock_aws
    def test_glue_no_jobs(self):
        from prowler.providers.aws.services.glue.glue_service import Glue

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.glue.glue_etl_jobs_logging_enabled.glue_etl_jobs_logging_enabled.glue_client",
                new=Glue(aws_provider),
            ):
                from prowler.providers.aws.services.glue.glue_etl_jobs_logging_enabled.glue_etl_jobs_logging_enabled import (
                    glue_etl_jobs_logging_enabled,
                )

                check = glue_etl_jobs_logging_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_glue_job_logging_enabled(self):
        glue_client = client("glue", region_name=AWS_REGION_US_EAST_1)
        job_name = "test-job"
        job_arn = (
            f"arn:aws:glue:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:job/{job_name}"
        )
        glue_client.create_job(
            Name=job_name,
            Role="role_test",
            Command={"Name": "name_test", "ScriptLocation": "script_test"},
            DefaultArguments={"--enable-continuous-cloudwatch-log": "true"},
            Tags={"key_test": "value_test"},
            GlueVersion="1.0",
            MaxCapacity=0.0625,
            MaxRetries=0,
            Timeout=10,
            NumberOfWorkers=2,
            WorkerType="G.1X",
            SecurityConfiguration="sec_config",
            NotificationProperty={"NotifyDelayAfter": 1},
        )

        from prowler.providers.aws.services.glue.glue_service import Glue

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.glue.glue_etl_jobs_logging_enabled.glue_etl_jobs_logging_enabled.glue_client",
                new=Glue(aws_provider),
            ):
                from prowler.providers.aws.services.glue.glue_etl_jobs_logging_enabled.glue_etl_jobs_logging_enabled import (
                    glue_etl_jobs_logging_enabled,
                )

                check = glue_etl_jobs_logging_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Glue job {job_name} have logging enabled."
                )
                assert result[0].resource_id == job_name
                assert result[0].resource_arn == job_arn
                assert result[0].resource_tags == [{"key_test": "value_test"}]

    @mock_aws
    def test_glue_job_logging_disabled(self):
        glue_client = client("glue", region_name=AWS_REGION_US_EAST_1)
        job_name = "test-job"
        job_arn = (
            f"arn:aws:glue:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:job/{job_name}"
        )
        glue_client.create_job(
            Name=job_name,
            Role="role_test",
            Command={"Name": "name_test", "ScriptLocation": "script_test"},
            DefaultArguments={},
            Tags={"key_test": "value_test"},
            GlueVersion="1.0",
            MaxCapacity=0.0625,
            MaxRetries=0,
            Timeout=10,
            NumberOfWorkers=2,
            WorkerType="G.1X",
            SecurityConfiguration="sec_config",
        )

        from prowler.providers.aws.services.glue.glue_service import Glue

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.glue.glue_etl_jobs_logging_enabled.glue_etl_jobs_logging_enabled.glue_client",
                new=Glue(aws_provider),
            ):
                from prowler.providers.aws.services.glue.glue_etl_jobs_logging_enabled.glue_etl_jobs_logging_enabled import (
                    glue_etl_jobs_logging_enabled,
                )

                check = glue_etl_jobs_logging_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Glue job {job_name} does not have logging enabled."
                )
                assert result[0].resource_id == job_name
                assert result[0].resource_arn == job_arn
                assert result[0].resource_tags == [{"key_test": "value_test"}]
```

--------------------------------------------------------------------------------

````
