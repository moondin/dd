---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 21
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 21 of 867)

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

---[FILE: uuid_utils.py]---
Location: prowler-master/api/src/backend/api/uuid_utils.py

```python
from datetime import datetime, timezone
from random import getrandbits

from dateutil.relativedelta import relativedelta
from rest_framework_json_api.serializers import ValidationError
from uuid6 import UUID


def transform_into_uuid7(uuid_obj: UUID) -> UUID:
    """
    Validates that the given UUID object is a UUIDv7 and returns it.

    This function checks if the provided UUID object is of version 7.
    If it is, it returns a new UUID object constructed from the uppercase
    hexadecimal representation of the input UUID. If not, it raises a ValidationError.

    Args:
        uuid_obj (UUID): The UUID object to validate and transform.

    Returns:
        UUID: A new UUIDv7 object constructed from the uppercase hexadecimal
        representation of the input UUID.

    Raises:
        ValidationError: If the provided UUID is not a version 7 UUID.
    """
    try:
        if uuid_obj.version != 7:
            raise ValueError
        return UUID(hex=uuid_obj.hex.upper())
    except ValueError:
        raise ValidationError("Invalid UUIDv7 value.")


def datetime_to_uuid7(dt: datetime) -> UUID:
    """
    Generates a UUIDv7 from a given datetime object.

    Constructs a UUIDv7 using the provided datetime timestamp.
    Ensures that the version and variant bits are set correctly.

    Args:
        dt: A datetime object representing the desired timestamp for the UUIDv7.

    Returns:
        A UUIDv7 object corresponding to the given datetime.
    """
    timestamp_ms = int(dt.timestamp() * 1000) & 0xFFFFFFFFFFFF  # 48 bits

    # Generate 12 bits of randomness for the sequence
    rand_seq = getrandbits(12)
    # Generate 62 bits of randomness for the node
    rand_node = getrandbits(62)

    # Build the UUID integer
    uuid_int = timestamp_ms << 80  # Shift timestamp to bits 80-127

    # Set the version to 7 in bits 76-79
    uuid_int |= 0x7 << 76

    # Set 12 bits of randomness in bits 64-75
    uuid_int |= rand_seq << 64

    # Set the variant to "10" in bits 62-63
    uuid_int |= 0x2 << 62

    # Set 62 bits of randomness in bits 0-61
    uuid_int |= rand_node

    return UUID(int=uuid_int)


def datetime_from_uuid7(uuid7: UUID) -> datetime:
    """
    Extracts the timestamp from a UUIDv7 and returns it as a datetime object.

    Args:
        uuid7: A UUIDv7 object.

    Returns:
        A datetime object representing the timestamp encoded in the UUIDv7.
    """
    timestamp_ms = uuid7.time
    return datetime.fromtimestamp(timestamp_ms / 1000, tz=timezone.utc)


def uuid7_start(uuid_obj: UUID) -> UUID:
    """
    Returns a UUIDv7 that represents the start of the day for the given UUID.

    Args:
        uuid_obj: A UUIDv7 object.

    Returns:
        A UUIDv7 object representing the start of the day for the given UUID's timestamp.
    """
    start_of_day = datetime_from_uuid7(uuid_obj).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    return datetime_to_uuid7(start_of_day)


def uuid7_end(uuid_obj: UUID, offset_months: int = 1) -> UUID:
    """
    Returns a UUIDv7 that represents the end of the month for the given UUID.

    Args:
        uuid_obj: A UUIDv7 object.
        offset_months: Number of months to offset from the given UUID's date. Defaults to 1 to handle if
        partitions are not being used, if so the value will be the one set at FINDINGS_TABLE_PARTITION_MONTHS.

    Returns:
        A UUIDv7 object representing the end of the month for the given UUID's date plus offset_months.
    """
    end_of_month = datetime_from_uuid7(uuid_obj).replace(
        day=1, hour=0, minute=0, second=0, microsecond=0
    )
    end_of_month += relativedelta(months=offset_months, microseconds=-1)
    return datetime_to_uuid7(end_of_month)


def uuid7_range(uuid_list: list[UUID]) -> list[UUID]:
    """
    For the given list of UUIDv7s, returns the start and end UUIDv7 values that represent
    the range of days covered by the UUIDs.

    Args:
        uuid_list: A list of UUIDv7 objects.

    Returns:
        A list containing two UUIDv7 objects: the start and end of the day range.

    Raises:
        ValidationError: If the list is empty or contains invalid UUIDv7 objects.
    """
    if not uuid_list:
        raise ValidationError("UUID list is empty.")

    try:
        start_uuid = min(uuid_list, key=lambda u: u.time)
        end_uuid = max(uuid_list, key=lambda u: u.time)
    except AttributeError:
        raise ValidationError("Invalid UUIDv7 objects in the list.")

    start_range = uuid7_start(start_uuid)
    end_range = uuid7_end(end_uuid)

    return [start_range, end_range]
```

--------------------------------------------------------------------------------

---[FILE: validators.py]---
Location: prowler-master/api/src/backend/api/validators.py
Signals: Django

```python
import string

from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class MaximumLengthValidator:
    def __init__(self, max_length=72):
        self.max_length = max_length

    def validate(self, password, user=None):
        if len(password) > self.max_length:
            raise ValidationError(
                _(
                    "This password is too long. It must contain no more than %(max_length)d characters."
                ),
                code="password_too_long",
                params={"max_length": self.max_length},
            )

    def get_help_text(self):
        return _(
            f"Your password must contain no more than {self.max_length} characters."
        )


class SpecialCharactersValidator:
    def __init__(self, special_characters=None, min_special_characters=1):
        # Use string.punctuation if no custom characters provided
        self.special_characters = special_characters or string.punctuation
        self.min_special_characters = min_special_characters

    def validate(self, password, user=None):
        if (
            sum(1 for char in password if char in self.special_characters)
            < self.min_special_characters
        ):
            raise ValidationError(
                _("This password must contain at least one special character."),
                code="password_no_special_characters",
                params={
                    "special_characters": self.special_characters,
                    "min_special_characters": self.min_special_characters,
                },
            )

    def get_help_text(self):
        return _(
            f"Your password must contain at least one special character from: {self.special_characters}"
        )


class UppercaseValidator:
    def __init__(self, min_uppercase=1):
        self.min_uppercase = min_uppercase

    def validate(self, password, user=None):
        if sum(1 for char in password if char.isupper()) < self.min_uppercase:
            raise ValidationError(
                _(
                    "This password must contain at least %(min_uppercase)d uppercase letter."
                ),
                code="password_no_uppercase_letters",
                params={"min_uppercase": self.min_uppercase},
            )

    def get_help_text(self):
        return _(
            f"Your password must contain at least {self.min_uppercase} uppercase letter."
        )


class LowercaseValidator:
    def __init__(self, min_lowercase=1):
        self.min_lowercase = min_lowercase

    def validate(self, password, user=None):
        if sum(1 for char in password if char.islower()) < self.min_lowercase:
            raise ValidationError(
                _(
                    "This password must contain at least %(min_lowercase)d lowercase letter."
                ),
                code="password_no_lowercase_letters",
                params={"min_lowercase": self.min_lowercase},
            )

    def get_help_text(self):
        return _(
            f"Your password must contain at least {self.min_lowercase} lowercase letter."
        )


class NumericValidator:
    def __init__(self, min_numeric=1):
        self.min_numeric = min_numeric

    def validate(self, password, user=None):
        if sum(1 for char in password if char.isdigit()) < self.min_numeric:
            raise ValidationError(
                _(
                    "This password must contain at least %(min_numeric)d numeric character."
                ),
                code="password_no_numeric_characters",
                params={"min_numeric": self.min_numeric},
            )

    def get_help_text(self):
        return _(
            f"Your password must contain at least {self.min_numeric} numeric character."
        )
```

--------------------------------------------------------------------------------

---[FILE: 0_dev_users.json]---
Location: prowler-master/api/src/backend/api/fixtures/dev/0_dev_users.json

```json
[
  {
    "model": "api.user",
    "pk": "8b38e2eb-6689-4f1e-a4ba-95b275130200",
    "fields": {
      "password": "pbkdf2_sha256$870000$Z63pGJ7nre48hfcGbk5S0O$rQpKczAmijs96xa+gPVJifpT3Fetb8DOusl5Eq6gxac=",
      "last_login": null,
      "name": "Devie Prowlerson",
      "email": "dev@prowler.com",
      "company_name": "Prowler Developers",
      "is_active": true,
      "date_joined": "2024-09-17T09:04:20.850Z"
    }
  },
  {
    "model": "api.user",
    "pk": "b6493a3a-c997-489b-8b99-278bf74de9f6",
    "fields": {
      "password": "pbkdf2_sha256$870000$Z63pGJ7nre48hfcGbk5S0O$rQpKczAmijs96xa+gPVJifpT3Fetb8DOusl5Eq6gxac=",
      "last_login": null,
      "name": "Devietoo Prowlerson",
      "email": "dev2@prowler.com",
      "company_name": "Prowler Developers",
      "is_active": true,
      "date_joined": "2024-09-18T09:04:20.850Z"
    }
  },
  {
    "model": "api.user",
    "pk": "6d4f8a91-3c2e-4b5a-8f7d-1e9c5b2a4d6f",
    "fields": {
      "password": "pbkdf2_sha256$870000$Z63pGJ7nre48hfcGbk5S0O$rQpKczAmijs96xa+gPVJifpT3Fetb8DOusl5Eq6gxac=",
      "last_login": null,
      "name": "E2E Test User",
      "email": "e2e@prowler.com",
      "company_name": "Prowler E2E Tests",
      "is_active": true,
      "date_joined": "2024-01-01T00:00:00.850Z"
    }
  }
]
```

--------------------------------------------------------------------------------

---[FILE: 1_dev_tenants.json]---
Location: prowler-master/api/src/backend/api/fixtures/dev/1_dev_tenants.json

```json
[
  {
    "model": "api.tenant",
    "pk": "12646005-9067-4d2a-a098-8bb378604362",
    "fields": {
      "inserted_at": "2024-03-21T23:00:00Z",
      "updated_at": "2024-03-21T23:00:00Z",
      "name": "Tenant1"
    }
  },
  {
    "model": "api.tenant",
    "pk": "0412980b-06e3-436a-ab98-3c9b1d0333d3",
    "fields": {
      "inserted_at": "2024-03-21T23:00:00Z",
      "updated_at": "2024-03-21T23:00:00Z",
      "name": "Tenant2"
    }
  },
  {
    "model": "api.membership",
    "pk": "2b0db93a-7e0b-4edf-a851-ea448676b7eb",
    "fields": {
      "user": "8b38e2eb-6689-4f1e-a4ba-95b275130200",
      "tenant": "0412980b-06e3-436a-ab98-3c9b1d0333d3",
      "role": "owner",
      "date_joined": "2024-09-19T11:03:59.712Z"
    }
  },
  {
    "model": "api.membership",
    "pk": "797d7cee-abc9-4598-98bb-4bf4bfb97f27",
    "fields": {
      "user": "8b38e2eb-6689-4f1e-a4ba-95b275130200",
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "role": "owner",
      "date_joined": "2024-09-19T11:02:59.712Z"
    }
  },
  {
    "model": "api.membership",
    "pk": "dea37563-7009-4dcf-9f18-25efb41462a7",
    "fields": {
      "user": "b6493a3a-c997-489b-8b99-278bf74de9f6",
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "role": "member",
      "date_joined": "2024-09-19T11:03:59.712Z"
    }
  },
  {
    "model": "api.tenant",
    "pk": "7c8f94a3-e2d1-4b3a-9f87-2c4d5e6f1a2b",
    "fields": {
      "inserted_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "name": "E2E Test Tenant"
    }
  },
  {
    "model": "api.membership",
    "pk": "9b1a2c3d-4e5f-6789-abc1-23456789def0",
    "fields": {
      "user": "6d4f8a91-3c2e-4b5a-8f7d-1e9c5b2a4d6f",
      "tenant": "7c8f94a3-e2d1-4b3a-9f87-2c4d5e6f1a2b",
      "role": "owner",
      "date_joined": "2024-01-01T00:00:00.000Z"
    }
  }
]
```

--------------------------------------------------------------------------------

---[FILE: 2_dev_providers.json]---
Location: prowler-master/api/src/backend/api/fixtures/dev/2_dev_providers.json

```json
[
  {
    "model": "api.provider",
    "pk": "37b065f8-26b0-4218-a665-0b23d07b27d9",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "inserted_at": "2024-08-01T17:20:27.050Z",
      "updated_at": "2024-08-01T17:20:27.050Z",
      "provider": "gcp",
      "uid": "a12322-test321",
      "alias": "gcp_testing_2",
      "connected": null,
      "connection_last_checked_at": null,
      "metadata": {}
    }
  },
  {
    "model": "api.provider",
    "pk": "8851db6b-42e5-4533-aa9e-30a32d67e875",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "inserted_at": "2024-08-01T17:19:42.453Z",
      "updated_at": "2024-08-01T17:19:42.453Z",
      "provider": "gcp",
      "uid": "a12345-test123",
      "alias": "gcp_testing_1",
      "connected": null,
      "connection_last_checked_at": null,
      "metadata": {}
    }
  },
  {
    "model": "api.provider",
    "pk": "b85601a8-4b45-4194-8135-03fb980ef428",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "inserted_at": "2024-08-01T17:19:09.556Z",
      "updated_at": "2024-08-01T17:19:09.556Z",
      "provider": "aws",
      "uid": "123456789020",
      "alias": "aws_testing_2",
      "connected": null,
      "connection_last_checked_at": null,
      "metadata": {}
    }
  },
  {
    "model": "api.provider",
    "pk": "baa7b895-8bac-4f47-b010-4226d132856e",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "inserted_at": "2024-08-01T17:20:16.962Z",
      "updated_at": "2024-08-01T17:20:16.962Z",
      "provider": "gcp",
      "uid": "a12322-test123",
      "alias": "gcp_testing_3",
      "connected": null,
      "connection_last_checked_at": null,
      "metadata": {}
    }
  },
  {
    "model": "api.provider",
    "pk": "d7c7ea89-d9af-423b-a364-1290dcad5a01",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "inserted_at": "2024-08-01T17:18:58.132Z",
      "updated_at": "2024-08-01T17:18:58.132Z",
      "provider": "aws",
      "uid": "123456789015",
      "alias": "aws_testing_1",
      "connected": null,
      "connection_last_checked_at": null,
      "metadata": {}
    }
  },
  {
    "model": "api.provider",
    "pk": "1b59e032-3eb6-4694-93a5-df84cd9b3ce2",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "inserted_at": "2024-08-06T16:03:26.176Z",
      "updated_at": "2024-08-06T16:03:26.176Z",
      "provider": "azure",
      "uid": "8851db6b-42e5-4533-aa9e-30a32d67e875",
      "alias": "azure_testing",
      "connected": null,
      "connection_last_checked_at": null,
      "metadata": {},
      "scanner_args": {}
    }
  },
  {
    "model": "api.provider",
    "pk": "26e55a24-cb2c-4cef-ac87-6f91fddb2c97",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "inserted_at": "2024-08-06T16:03:07.037Z",
      "updated_at": "2024-08-06T16:03:07.037Z",
      "provider": "kubernetes",
      "uid": "kubernetes-test-12345",
      "alias": "k8s_testing",
      "connected": null,
      "connection_last_checked_at": null,
      "metadata": {},
      "scanner_args": {}
    }
  },
  {
    "model": "api.provider",
    "pk": "15fce1fa-ecaa-433f-a9dc-62553f3a2555",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "inserted_at": "2024-10-18T10:45:26.352Z",
      "updated_at": "2024-10-18T11:16:23.533Z",
      "provider": "aws",
      "uid": "106908755759",
      "alias": "real testing aws provider",
      "connected": true,
      "connection_last_checked_at": "2024-10-18T11:16:23.503Z",
      "metadata": {},
      "scanner_args": {}
    }
  },
  {
    "model": "api.provider",
    "pk": "7791914f-d646-4fe2-b2ed-73f2c6499a36",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "inserted_at": "2024-10-18T10:45:26.352Z",
      "updated_at": "2024-10-18T11:16:23.533Z",
      "provider": "kubernetes",
      "uid": "gke_lucky-coast-419309_us-central1_autopilot-cluster-2",
      "alias": "k8s_testing_2",
      "connected": true,
      "connection_last_checked_at": "2024-10-18T11:16:23.503Z",
      "metadata": {},
      "scanner_args": {}
    }
  },
  {
    "model": "api.providersecret",
    "pk": "11491b47-75ae-4f71-ad8d-3e630a72182e",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "inserted_at": "2024-10-11T08:03:05.026Z",
      "updated_at": "2024-10-11T08:04:47.033Z",
      "name": "GCP static secrets",
      "secret_type": "static",
      "_secret": "Z0FBQUFBQm5DTndmZW9KakRZUHM2UHhQN2V3RzN0QmM1cERham8yMHp5cnVTT0lzdGFyS1FuVmJXUlpYSGsyU0cxR3RMMEdQYXlYMUVsaWtqLU1OZWlaVUp6OFREYlotZTVBY3BuTlZYbm9YcUJydzAxV2p5dkpLamI1Y2tUYzA0MmJUNWxsNTBRM0E1SDRCa0pPQWVlb05YU3dfeUhkLTRmOEh3dGczOGh1ZGhQcVdZdVAtYmtoSWlwNXM4VGFoVmF3dno2X1hrbk5GZjZTWjVuWEdEZUFXeHJSQjEzbTlVakhNdzYyWTdiVEpvUEc2MTNpRzUtczhEank1eGI0b3MyMlAyaGN6dlByZmtUWHByaDNUYWFqYS1tYnNBUkRKTzBacFNSRjFuVmd5bUtFUEJhd1ZVS1ZDd2xSUV9PaEtLTnc0XzVkY2lhM01WTjQwaWdJSk9wNUJSXzQ4RUNQLXFPNy1VdzdPYkZyWkVkU3RyQjVLTS1MVHN0R3k4THNKZ2NBNExaZnl3Q1EwN2dwNGRsUXptMjB0LXUzTUpzTDE2Q1hmS0ZSN2g1ZjBPeV8taFoxNUwxc2FEcktXX0dCM1IzeUZTTHNiTmNxVXBvNWViZTJScUVWV2VYTFQ4UHlid21PY1A0UjdNMGtERkZCd0lLMlJENDMzMVZUM09DQ0twd1N3VHlZd09XLUctOWhYcFJIR1p5aUlZeEUzejc2dWRYdGNsd0xOODNqRUFEczhSTWNtWU0tdFZ1ZTExaHNHUVYtd0Zxdld1LTdKVUNINzlZTGdHODhKeVVpQmRZMHRUNTJRRWhwS1F1Y3I2X2Iwc0c1NHlXSVRLZWxreEt0dVRnOTZFMkptU2VMS1dWXzdVOVRzMUNUWXM2aFlxVDJXdGo3d2cxSVZGWlI2ZWhIZzZBcEl4bEJ6UnVHc0RYWVNHcjFZUHI5ZUYyWG9rSlo0QUVSUkFCX3h2UmtJUTFzVXJUZ25vTmk2VzdoTTNta05ucmNfTi0yR1ZxN1E2MnZJOVVKOGxmMXMzdHMxVndmSVhQbUItUHgtMVpVcHJwMU5JVHJLb0Y1aHV5OEEwS0kzQkEtcFJkdkRnWGxmZnprNFhndWg1TmQyd09yTFdTRmZ3d2ZvZFUtWXp4a2VYb3JjckFIcE13MDUzX0RHSnlzM0N2ZE5IRzJzMXFMc0k4MDRyTHdLZFlWOG9SaFF0LU43Ynd6VFlEcVNvdFZ0emJEVk10aEp4dDZFTFNFNzk0UUo2WTlVLWRGYm1fanZHaFZreHBIMmtzVjhyS0xPTk9fWHhiVTJHQXZwVlVuY3JtSjFUYUdHQzhEaHFNZXhwUHBmY0kxaUVrOHo4a0FYOTdpZVJDbFRvdFlQeWo3eFZHX1ZMZ1Myc3prU3o2c3o2eXNja1U4N0Y1T0d1REVjZFRGNTByUkgyemVCSjlQYkY2bmJ4YTZodHB0cUNzd2xZcENycUdsczBIaEZPbG1jVUlqNlM2cEE3aGpVaWswTzBDLVFGUHM5UHhvM09saWNtaDhaNVlsc3FZdktKeWlheDF5OGhTODE2N3JWamdTZG5Fa3JSQ2ZUSEVfRjZOZXdreXRZLTBZRFhleVFFeC1YUzc0cWhYeEhobGxvdnZ3Rm15WFlBWXp0dm1DeTA5eExLeEFRRXVRSXBXdTNEaWdZZ3JDenItdDhoZlFiTzI0SGZ1c01FR1FNaFVweVBKR1YxWGRUMW1Mc2JVdW9raWR6UHk2ZTBnS05pV3oyZVBjREdkY3k4ZHZPUWE5S281MkJRSHF3NnpTclZ5bl90bk1wUEh6Tkp5dXlDcE5paWRqcVhxRFVObWIzRldWOGJ2aC1CRHZpbFZrb0hjNGpCMm5POGRiS2lETUpMLUVfQlhCdTZPLW9USW1LTFlTSF9zRUJYZ1NKeFFEQjNOR215ZXJDbkFndmcxWl9rWlk9",
      "provider": "8851db6b-42e5-4533-aa9e-30a32d67e875"
    }
  },
  {
    "model": "api.providersecret",
    "pk": "40191ad5-d8c2-40a9-826d-241397626b68",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "inserted_at": "2024-10-10T11:11:44.515Z",
      "updated_at": "2024-10-11T07:59:56.102Z",
      "name": "AWS static secrets",
      "secret_type": "static",
      "_secret": "Z0FBQUFBQm5DTnI4Y1RyV19UWEJzc3kzQUExcU5tdlQzbFVLeDdZMWd1MzkwWkl2UF9oZGhiVEJHVWpSMXV4MjYyN3g2OVpvNVpkQUQ3S0VGaGdQLTFhQWE3MkpWZUt2cnVhODc4d3FpY3FVZkpwdHJzNUJPeFRwZ3N4bGpPZTlkNWRNdFlwTHU3aTNWR3JjSzJwLWRITHdfQWpXb1F0c1l3bVFxbnFrTEpPTGgxcnF1VUprSzZ5dGRQU2VGYmZhTTlwbVpsNFBNWlFhVW9RbjJyYnZ5N0oweE5kV0ZEaUdpUUpNVExOa3oyQ2dNREVSenJ0TEFZc0RrRWpXNUhyMmtybGNLWDVOR0FabEl4QVR1bkZyb2hBLWc1MFNIekVyeXI0SmVreHBjRnJ1YUlVdXpVbW9JZkk0aEgxYlM1VGhSRlhtcS14YzdTYUhXR2xodElmWjZuNUVwaHozX1RVTG1QWHdPZWd4clNHYnAyOTBsWEl5UU83RGxZb0RKWjdadjlsTmJtSHQ0Yl9uaDJoODB0QV9sWmFYbFAxcjA1bmhNVlNqc2xEeHlvcUJFbVZvY250ZENnMnZLT1psb1JDclB3WVR6NGdZb2pzb3U4Ny04QlB0UTZub0dMOXZEUTZEcVJhZldCWEZZSDdLTy02UVZqck5zVTZwS3pObGlOejNJeHUzbFRabFM2V2xaekZVRjZtX3VzZlplendnOWQzT01WMFd3ejNadHVlTFlqRGR2dk5Da29zOFYwOUdOaEc4OHhHRnJFMmJFMk12VDNPNlBBTGlsXy13cUM1QkVYb0o1Z2U4ZXJnWXpZdm1sWjA5bzQzb2NFWC1xbmIycGZRbGtCaGNaOWlkX094UUNNampwbkZoREctNWI4QnZRaE8zM3BEQ1BwNzA1a3BzOGczZXdIM2s1NHFGN1ZTbmJhZkc4RVdfM0ZIZU5udTBYajd1RGxpWXZpRWdSMmhHa2RKOEIzbmM0X2F1OGxrN2p6LW9UVldDOFVpREoxZ1UzcTBZX19OQ0xJb0syWlhNSlQ4MzQwdzRtVG94Y01GS3FMLV95UVlxOTFORk8zdjE5VGxVaXdhbGlzeHdoYWNzazZWai1GUGtUM2gzR0ZWTTY4SThWeVFnZldIaklOTTJqTTg1VkhEYW5wNmdEVllXMmJCV2tpVmVYeUV2c0E1T00xbHJRNzgzVG9wb0Q1cV81UEhqYUFsQ2p1a0VpRDVINl9SVkpyZVRNVnVXQUxwY3NWZnJrNmRVREpiLWNHYUpXWmxkQlhNbWhuR1NmQ1BaVDlidUxCWHJMaHhZbk1FclVBaEVZeWg1ZlFoenZzRHlKbV8wa3lmMGZrd3NmTDZjQkE0UXNSUFhpTWtUUHBrX29BVzc4QzEtWEJIQW1GMGFuZVlXQWZIOXJEamloeGFCeHpYMHNjMFVfNXpQdlJfSkk2bzFROU5NU0c1SHREWW1nbkFNZFZ0UjdPRGdjaF96RGplY1hjdFFzLVR6MTVXYlRjbHIxQ2JRejRpVko5NWhBU0ZHR3ZvczU5elljRGpHRTdIc0FsSm5fUHEwT1gtTS1lN3M3X3ZZRnlkYUZoZXRQeEJsZlhLdFdTUzU1NUl4a29aOWZIdTlPM0Fnak1xYWVkYTNiMmZXUHlXS2lwUVBZLXQyaUxuRmtQNFFieE9SVmdZVW9WTHlzbnBPZlNIdGVHOE1LNVNESjN3cGtVSHVpT1NJWHE1ZzNmUTVTOC0xX3NGSmJqU19IbjZfQWtMRG1YNUQtRy13TUJIZFlyOXJkQzFQbkdZVXVzM2czbS1HWHFBT1pXdVd3N09tcG82SVhnY1ZtUWxqTEg2UzJCUmllb2pweVN2aGwwS1FVRUhjNEN2amRMc3MwVU4zN3dVMWM5Slg4SERtenFaQk1yMWx0LWtxVWtLZVVtbU4yejVEM2h6TEt0RGdfWE09",
      "provider": "b85601a8-4b45-4194-8135-03fb980ef428"
    }
  },
  {
    "model": "api.providersecret",
    "pk": "ed89d1ea-366a-4d12-a602-f2ab77019742",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "inserted_at": "2024-10-10T11:11:44.515Z",
      "updated_at": "2024-10-11T07:59:56.102Z",
      "name": "Azure static secrets",
      "secret_type": "static",
      "_secret": "Z0FBQUFBQm5DTnI4Y1RyV19UWEJzc3kzQUExcU5tdlQzbFVLeDdZMWd1MzkwWkl2UF9oZGhiVEJHVWpSMXV4MjYyN3g2OVpvNVpkQUQ3S0VGaGdQLTFhQWE3MkpWZUt2cnVhODc4d3FpY3FVZkpwdHJzNUJPeFRwZ3N4bGpPZTlkNWRNdFlwTHU3aTNWR3JjSzJwLWRITHdfQWpXb1F0c1l3bVFxbnFrTEpPTGgxcnF1VUprSzZ5dGRQU2VGYmZhTTlwbVpsNFBNWlFhVW9RbjJyYnZ5N0oweE5kV0ZEaUdpUUpNVExOa3oyQ2dNREVSenJ0TEFZc0RrRWpXNUhyMmtybGNLWDVOR0FabEl4QVR1bkZyb2hBLWc1MFNIekVyeXI0SmVreHBjRnJ1YUlVdXpVbW9JZkk0aEgxYlM1VGhSRlhtcS14YzdTYUhXR2xodElmWjZuNUVwaHozX1RVTG1QWHdPZWd4clNHYnAyOTBsWEl5UU83RGxZb0RKWjdadjlsTmJtSHQ0Yl9uaDJoODB0QV9sWmFYbFAxcjA1bmhNVlNqc2xEeHlvcUJFbVZvY250ZENnMnZLT1psb1JDclB3WVR6NGdZb2pzb3U4Ny04QlB0UTZub0dMOXZEUTZEcVJhZldCWEZZSDdLTy02UVZqck5zVTZwS3pObGlOejNJeHUzbFRabFM2V2xaekZVRjZtX3VzZlplendnOWQzT01WMFd3ejNadHVlTFlqRGR2dk5Da29zOFYwOUdOaEc4OHhHRnJFMmJFMk12VDNPNlBBTGlsXy13cUM1QkVYb0o1Z2U4ZXJnWXpZdm1sWjA5bzQzb2NFWC1xbmIycGZRbGtCaGNaOWlkX094UUNNampwbkZoREctNWI4QnZRaE8zM3BEQ1BwNzA1a3BzOGczZXdIM2s1NHFGN1ZTbmJhZkc4RVdfM0ZIZU5udTBYajd1RGxpWXZpRWdSMmhHa2RKOEIzbmM0X2F1OGxrN2p6LW9UVldDOFVpREoxZ1UzcTBZX19OQ0xJb0syWlhNSlQ4MzQwdzRtVG94Y01GS3FMLV95UVlxOTFORk8zdjE5VGxVaXdhbGlzeHdoYWNzazZWai1GUGtUM2gzR0ZWTTY4SThWeVFnZldIaklOTTJqTTg1VkhEYW5wNmdEVllXMmJCV2tpVmVYeUV2c0E1T00xbHJRNzgzVG9wb0Q1cV81UEhqYUFsQ2p1a0VpRDVINl9SVkpyZVRNVnVXQUxwY3NWZnJrNmRVREpiLWNHYUpXWmxkQlhNbWhuR1NmQ1BaVDlidUxCWHJMaHhZbk1FclVBaEVZeWg1ZlFoenZzRHlKbV8wa3lmMGZrd3NmTDZjQkE0UXNSUFhpTWtUUHBrX29BVzc4QzEtWEJIQW1GMGFuZVlXQWZIOXJEamloeGFCeHpYMHNjMFVfNXpQdlJfSkk2bzFROU5NU0c1SHREWW1nbkFNZFZ0UjdPRGdjaF96RGplY1hjdFFzLVR6MTVXYlRjbHIxQ2JRejRpVko5NWhBU0ZHR3ZvczU5elljRGpHRTdIc0FsSm5fUHEwT1gtTS1lN3M3X3ZZRnlkYUZoZXRQeEJsZlhLdFdTUzU1NUl4a29aOWZIdTlPM0Fnak1xYWVkYTNiMmZXUHlXS2lwUVBZLXQyaUxuRmtQNFFieE9SVmdZVW9WTHlzbnBPZlNIdGVHOE1LNVNESjN3cGtVSHVpT1NJWHE1ZzNmUTVTOC0xX3NGSmJqU19IbjZfQWtMRG1YNUQtRy13TUJIZFlyOXJkQzFQbkdZVXVzM2czbS1HWHFBT1pXdVd3N09tcG82SVhnY1ZtUWxqTEg2UzJCUmllb2pweVN2aGwwS1FVRUhjNEN2amRMc3MwVU4zN3dVMWM5Slg4SERtenFaQk1yMWx0LWtxVWtLZVVtbU4yejVEM2h6TEt0RGdfWE09",
      "provider": "1b59e032-3eb6-4694-93a5-df84cd9b3ce2"
    }
  },
  {
    "model": "api.providersecret",
    "pk": "ae48ecde-75cd-4814-92ab-18f48719e5d9",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "inserted_at": "2024-10-18T10:45:26.412Z",
      "updated_at": "2024-10-18T10:45:26.412Z",
      "name": "Valid AWS Credentials",
      "secret_type": "static",
      "_secret": "Z0FBQUFBQm5FanhHa3dXS0I3M2NmWm56SktiaGNqdDZUN0xQU1QwUi15QkhLZldFUmRENk1BXzlscG9JSUxVSTF5ekxuMkdEanlJNjhPUS1VSV9wVTBvU2l4ZnNGOVJhYW93RC1LTEhmc2pyOTJvUWwyWnpFY19WN1pRQk5IdDYwYnBDQnF1eU9nUzdwTGU3QU5qMGFyX1E4SXdpSk9paGVLcVpOVUhwb3duaXgxZ0ZxME5Pcm40QzBGWEZKY2lmRVlCMGFuVFVzemxuVjVNalZVQ2JsY2ZqNWt3Z01IYUZ0dk92YkdtSUZ5SlBvQWZoVU5DWlRFWmExNnJGVEY4Q1Bnd2VJUW9TSWdRcG9rSDNfREQwRld3Q1RYVnVYWVJLWWIxZmpsWGpwd0xQM0dtLTlYUjdHOVhhNklLWXFGTHpFQUVyVmNhYW9CU0tocGVyX3VjMkVEcVdjdFBfaVpsLTBzaUxrWTlta3dpelNtTG9xYVhBUHUzNUE4RnI1WXdJdHcxcFVfaG1XRHhDVFBKamxJb1FaQ2lsQ3FzRmxZbEJVemVkT1E2aHZfbDJqWDJPT3ViOWJGYzQ3eTNWNlFQSHBWRDFiV2tneDM4SmVqMU9Bd01TaXhPY2dmWG5RdENURkM2b2s5V3luVUZQcnFKNldnWEdYaWE2MnVNQkEwMHd6cUY5cVJkcGw4bHBtNzhPeHhkREdwSXNEc1JqQkxUR1FYRTV0UFNwbVlVSWF5LWgtbVhJZXlPZ0Q4cG9HX2E0Qld0LTF1TTFEVy1XNGdnQTRpLWpQQmFJUEdaOFJGNDVoUVJnQ25YVU5DTENMaTY4YmxtYWJFRERXTjAydVN2YnBDb3RkUE0zSDRlN1A3TXc4d2h1Wmd0LWUzZEcwMUstNUw2YnFyS2Z0NEVYMXllQW5GLVBpeU55SkNhczFIeFhrWXZpVXdwSFVrTDdiQjQtWHZJdERXVThzSnJsT2FNZzJDaUt6Y2NXYUZhUlo3VkY0R1BrSHNHNHprTmxjYmp1TXVKakRha0VtNmRFZWRmZHJWdnRCOVNjVGFVWjVQM3RwWWl4SkNmOU1pb2xqMFdOblhNY3Y3aERpOHFlWjJRc2dtRDkzZm1Qc29wdk5OQmJPbGk5ZUpGM1I2YzRJN2gxR3FEMllXR1pma1k0emVqSjZyMUliMGZsc3NfSlVDbGt4QzJTc3hHOU9FRHlZb09zVnlvcDR6WC1uclRSenI0Yy13WlFWNzJWRkwydjhmSjFZdnZ5X3NmZVF6UWRNMXo5STVyV3B0d09UUlFtOURITGhXSDVIUl9zYURJc05KWUNxekVyYkxJclNFNV9leEk4R2xsMGJod3lYeFIwaXR2dllwLTZyNWlXdDRpRkxVYkxWZFdvYUhKck5aeElBZUtKejNKS2tYVW1rTnVrRjJBQmdlZmV6ckozNjNwRmxLS1FaZzRVTTBZYzFFYi1idjBpZkQ3bWVvbEdRZXJrWFNleWZmSmFNdG1wQlp0YmxjWDV5T0tEbHRsYnNHbjRPRjl5MkttOUhRWlJtd1pmTnY4Z1lPRlZoTzFGVDdTZ0RDY1ByV0RndTd5LUNhcHNXUnNIeXdLMEw3WS1tektRTWFLQy1zakpMLWFiM3FOakE1UWU4LXlOX2VPbmd4MTZCRk9OY3Z4UGVDSWxhRlg4eHI4X1VUTDZZM0pjV0JDVi1UUjlTUl85cm1LWlZ0T1dzU0lpdWUwbXgtZ0l6eHNSNExRTV9MczJ6UkRkVElnRV9Rc0RoTDFnVHRZSEFPb2paX200TzZiRzVmRE5hOW5CTjh5Qi1WaEtueEpqRzJDY1luVWZtX1pseUpQSE5lQ0RrZ05EbWo5cU9MZ0ZkcXlqUll4UUkyejRfY2p4RXdEeC1PS1JIQVNUcmNIdkRJbzRiUktMWEQxUFM3aGNzeVFWUDdtcm5xNHlOYUU9",
      "provider": "15fce1fa-ecaa-433f-a9dc-62553f3a2555"
    }
  }
]
```

--------------------------------------------------------------------------------

---[FILE: 3_dev_scans.json]---
Location: prowler-master/api/src/backend/api/fixtures/dev/3_dev_scans.json

```json
[
  {
    "model": "api.scan",
    "pk": "0191e280-9d2f-71c8-9b18-487a23ba185e",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "provider": "37b065f8-26b0-4218-a665-0b23d07b27d9",
      "trigger": "manual",
      "name": "test scan 1",
      "state": "completed",
      "unique_resource_count": 1,
      "duration": 5,
      "scanner_args": {
        "checks_to_execute": ["accessanalyzer_enabled"]
      },
      "inserted_at": "2024-09-01T17:25:27.050Z",
      "started_at": "2024-09-01T17:25:27.050Z",
      "updated_at": "2024-09-01T17:25:27.050Z",
      "completed_at": "2024-09-01T17:25:32.050Z"
    }
  },
  {
    "model": "api.scan",
    "pk": "01920573-aa9c-73c9-bcda-f2e35c9b19d2",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "provider": "b85601a8-4b45-4194-8135-03fb980ef428",
      "trigger": "manual",
      "name": "test aws scan 2",
      "state": "completed",
      "unique_resource_count": 1,
      "duration": 20,
      "scanner_args": {
        "checks_to_execute": ["accessanalyzer_enabled"]
      },
      "inserted_at": "2024-09-02T17:24:27.050Z",
      "started_at": "2024-09-02T17:24:27.050Z",
      "updated_at": "2024-09-02T17:24:27.050Z",
      "completed_at": "2024-09-01T17:24:37.050Z"
    }
  },
  {
    "model": "api.scan",
    "pk": "01920573-ea5b-77fd-a93f-1ed2ae12f728",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "provider": "baa7b895-8bac-4f47-b010-4226d132856e",
      "trigger": "manual",
      "name": "test gcp scan",
      "state": "completed",
      "unique_resource_count": 10,
      "duration": 10,
      "scanner_args": {
        "checks_to_execute": ["cloudsql_instance_automated_backups"]
      },
      "inserted_at": "2024-09-02T19:26:27.050Z",
      "started_at": "2024-09-02T19:26:27.050Z",
      "updated_at": "2024-09-02T19:26:27.050Z",
      "completed_at": "2024-09-01T17:26:37.050Z"
    }
  },
  {
    "model": "api.scan",
    "pk": "01920573-ea5b-77fd-a93f-1ed2ae12f728",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "provider": "b85601a8-4b45-4194-8135-03fb980ef428",
      "trigger": "manual",
      "name": "test aws scan",
      "state": "completed",
      "unique_resource_count": 1,
      "duration": 35,
      "scanner_args": {
        "checks_to_execute": ["accessanalyzer_enabled"]
      },
      "inserted_at": "2024-09-02T19:27:27.050Z",
      "started_at": "2024-09-02T19:27:27.050Z",
      "updated_at": "2024-09-02T19:27:27.050Z",
      "completed_at": "2024-09-01T17:27:37.050Z"
    }
  },
  {
    "model": "api.scan",
    "pk": "c281c924-23f3-4fcc-ac63-73a22154b7de",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "provider": "b85601a8-4b45-4194-8135-03fb980ef428",
      "trigger": "scheduled",
      "name": "test scheduled aws scan",
      "state": "available",
      "scanner_args": {
        "checks_to_execute": ["cloudformation_stack_outputs_find_secrets"]
      },
      "scheduled_at": "2030-09-02T19:20:27.050Z",
      "inserted_at": "2024-09-02T19:24:27.050Z",
      "updated_at": "2024-09-02T19:24:27.050Z"
    }
  },
  {
    "model": "api.scan",
    "pk": "25c8907c-b26e-4ec0-966b-a1f53a39d8e6",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "provider": "b85601a8-4b45-4194-8135-03fb980ef428",
      "trigger": "scheduled",
      "name": "test scheduled aws scan 2",
      "state": "available",
      "scanner_args": {
        "checks_to_execute": [
          "accessanalyzer_enabled",
          "cloudformation_stack_outputs_find_secrets"
        ]
      },
      "scheduled_at": "2030-08-02T19:31:27.050Z",
      "inserted_at": "2024-09-02T19:38:27.050Z",
      "updated_at": "2024-09-02T19:38:27.050Z"
    }
  },
  {
    "model": "api.scan",
    "pk": "25c8907c-b26e-4ec0-966b-a1f53a39d8e6",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "provider": "baa7b895-8bac-4f47-b010-4226d132856e",
      "trigger": "scheduled",
      "name": "test scheduled gcp scan",
      "state": "available",
      "scanner_args": {
        "checks_to_execute": [
          "cloudsql_instance_automated_backups",
          "iam_audit_logs_enabled"
        ]
      },
      "scheduled_at": "2030-07-02T19:30:27.050Z",
      "inserted_at": "2024-09-02T19:29:27.050Z",
      "updated_at": "2024-09-02T19:29:27.050Z"
    }
  },
  {
    "model": "api.scan",
    "pk": "25c8907c-b26e-4ec0-966b-a1f53a39d8e6",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "provider": "1b59e032-3eb6-4694-93a5-df84cd9b3ce2",
      "trigger": "scheduled",
      "name": "test scheduled azure scan",
      "state": "available",
      "scanner_args": {
        "checks_to_execute": [
          "aks_cluster_rbac_enabled",
          "defender_additional_email_configured_with_a_security_contact"
        ]
      },
      "scheduled_at": "2030-08-05T19:32:27.050Z",
      "inserted_at": "2024-09-02T19:29:27.050Z",
      "updated_at": "2024-09-02T19:29:27.050Z"
    }
  },
  {
    "model": "api.scan",
    "pk": "01929f3b-ed2e-7623-ad63-7c37cd37828f",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "name": "real scan 1",
      "provider": "15fce1fa-ecaa-433f-a9dc-62553f3a2555",
      "trigger": "manual",
      "state": "completed",
      "unique_resource_count": 19,
      "progress": 100,
      "scanner_args": {
        "checks_to_execute": ["accessanalyzer_enabled"]
      },
      "duration": 7,
      "scheduled_at": null,
      "inserted_at": "2024-10-18T10:45:57.678Z",
      "updated_at": "2024-10-18T10:46:05.127Z",
      "started_at": "2024-10-18T10:45:57.909Z",
      "completed_at": "2024-10-18T10:46:05.127Z"
    }
  },
  {
    "model": "api.scan",
    "pk": "6dd8925f-a52d-48de-a546-d2d90db30ab1",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "name": "real scan azure",
      "provider": "1b59e032-3eb6-4694-93a5-df84cd9b3ce2",
      "trigger": "manual",
      "state": "completed",
      "unique_resource_count": 20,
      "progress": 100,
      "scanner_args": {
        "checks_to_execute": [
          "accessanalyzer_enabled",
          "account_security_contact_information_is_registered"
        ]
      },
      "duration": 4,
      "scheduled_at": null,
      "inserted_at": "2024-10-18T11:16:21.358Z",
      "updated_at": "2024-10-18T11:16:26.060Z",
      "started_at": "2024-10-18T11:16:21.593Z",
      "completed_at": "2024-10-18T11:16:26.060Z"
    }
  },
  {
    "model": "api.scan",
    "pk": "4ca7ce89-3236-41a8-a369-8937bc152af5",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "name": "real scan k8s",
      "provider": "7791914f-d646-4fe2-b2ed-73f2c6499a36",
      "trigger": "manual",
      "state": "completed",
      "unique_resource_count": 20,
      "progress": 100,
      "scanner_args": {
        "checks_to_execute": [
          "accessanalyzer_enabled",
          "account_security_contact_information_is_registered"
        ]
      },
      "duration": 4,
      "scheduled_at": null,
      "inserted_at": "2024-10-18T11:16:21.358Z",
      "updated_at": "2024-10-18T11:16:26.060Z",
      "started_at": "2024-10-18T11:16:21.593Z",
      "completed_at": "2024-10-18T11:16:26.060Z"
    }
  },
  {
    "model": "api.scan",
    "pk": "01929f57-c0ee-7553-be0b-cbde006fb6f7",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "name": "real scan 2",
      "provider": "15fce1fa-ecaa-433f-a9dc-62553f3a2555",
      "trigger": "manual",
      "state": "completed",
      "unique_resource_count": 20,
      "progress": 100,
      "scanner_args": {
        "checks_to_execute": [
          "accessanalyzer_enabled",
          "account_security_contact_information_is_registered"
        ]
      },
      "duration": 4,
      "scheduled_at": null,
      "inserted_at": "2024-10-18T11:16:21.358Z",
      "updated_at": "2024-10-18T11:16:26.060Z",
      "started_at": "2024-10-18T11:16:21.593Z",
      "completed_at": "2024-10-18T11:16:26.060Z"
    }
  }
]
```

--------------------------------------------------------------------------------

````
