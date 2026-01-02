---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 214
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 214 of 867)

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

---[FILE: powershell.py]---
Location: prowler-master/prowler/lib/powershell/powershell.py

```python
import json
import queue
import re
import subprocess
import threading
from typing import Union

from prowler.lib.logger import logger


class PowerShellSession:
    """
    Base class for managing PowerShell sessions.

    This class provides the core functionality for interacting with PowerShell,
    including command execution, output handling, and session management.
    It serves as a foundation for more specific PowerShell implementations.

    Features:
    - Maintains a persistent PowerShell session
    - Handles command execution and output parsing
    - Provides secure input sanitization
    - Manages ANSI escape sequence removal
    - Supports JSON output parsing
    - Implements timeout handling for long-running commands

    Attributes:
        END (str): Marker string used to signal the end of PowerShell command output.
        process (subprocess.Popen): The underlying PowerShell subprocess with open stdin, stdout, and stderr streams.

    Note:
        This is an abstract base class that should be extended by specific implementations
        for different PowerShell use cases.
    """

    END = "<END>"

    def __init__(self):
        """
        Initialize a persistent PowerShell session.

        Creates a subprocess running PowerShell with pipes for stdin, stdout, and stderr.
        The session is configured to run in interactive mode with no exit.

        Note:
            This is a base implementation that should be extended by subclasses
            to add specific initialization logic (e.g., credential setup).
        """
        powershell_cmd = "pwsh"
        self.process = subprocess.Popen(
            [powershell_cmd, "-NoExit", "-Command", "-"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
        )

    def sanitize(self, credential: str) -> str:
        """
        Sanitize input to prevent command injection.

        Filters the input string to allow only letters, numbers, @, periods, underscores,
        plus signs, and hyphens. This is a security measure to prevent command injection
        attacks through credential input.

        Args:
            credential (str): The string to sanitize.

        Returns:
            str: The sanitized string containing only allowed characters.

        Example:
            >>> sanitize("user@domain.com!@#$")
            "user@domain.com"
        """
        return re.sub(r"[^a-zA-Z0-9@._+\-]", "", credential)

    def remove_ansi(self, text: str) -> str:
        """
        Remove ANSI color codes and other escape sequences from PowerShell output.

        PowerShell often includes ANSI escape sequences in its output for terminal
        coloring and formatting. This method strips these sequences to produce clean,
        parseable text that can be processed programmatically.

        Args:
            text (str): Raw text containing ANSI escape sequences from PowerShell output.

        Returns:
            str: Clean text with all ANSI escape sequences removed, suitable for parsing.

        Example:
            >>> remove_ansi("\x1b[32mSuccess\x1b[0m")
            "Success"
        """
        ansi_escape = re.compile(r"\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])")
        return ansi_escape.sub("", text)

    def execute(
        self, command: str, json_parse: bool = False, timeout: int = 10
    ) -> Union[str, dict]:
        """
        Send a command to PowerShell and retrieve its output.

        Executes the given command in the PowerShell session, adds an END marker,
        and parses the output as JSON if possible. The command is executed
        asynchronously with a timeout mechanism.

        Args:
            command (str): PowerShell command to execute.

        Returns:
            dict: JSON-parsed output if available, otherwise an empty dictionary.

        Example:
            >>> execute("Get-Process | ConvertTo-Json")
            {"Name": "process1", "Id": 1234}
        """
        self.process.stdin.write(f"{command}\n")
        self.process.stdin.write(f"Write-Output '{self.END}'\n")
        self.process.stdin.write(f"Write-Error '{self.END}'\n")
        return (
            self.json_parse_output(self.read_output(timeout=timeout))
            if json_parse
            else self.read_output(timeout=timeout)
        )

    def read_output(self, timeout: int = 10, default: str = "") -> str:
        """
        Read output from a process with timeout functionality.

        This method reads lines from process stdout and stderr in separate threads until it encounters
        the END marker for each stream. If reading stdout takes longer than the timeout period,
        the method returns a default value while allowing the reading to continue in the background.

        Any errors from stderr are logged but do not affect the return value.

        Args:
            timeout (int, optional): Maximum time in seconds to wait for stdout output.
                Defaults to 10.
            default (str, optional): Value to return if stdout timeout occurs.
                Defaults to empty string.

        Returns:
            str: The stdout output if available, otherwise the default value.
                Errors from stderr are logged but not returned.

        Note:
            This method uses daemon threads to read stdout and stderr asynchronously,
            ensuring that the main thread is not blocked.
        """
        output_lines = []
        result_queue = queue.Queue()
        error_lines = []
        error_queue = queue.Queue()

        def reader_thread():
            try:
                while True:
                    line = self.remove_ansi(self.process.stdout.readline().strip())
                    if line == self.END:
                        break
                    output_lines.append(line)
                result_queue.put("\n".join(output_lines))
            except Exception as error:
                result_queue.put(str(error))

        def error_reader_thread():
            try:
                while True:
                    line = self.remove_ansi(self.process.stderr.readline().strip())
                    if line == f"Write-Error: {self.END}":
                        break
                    error_lines.append(line)
                error_queue.put("\n".join(error_lines))
            except Exception as error:
                error_queue.put(str(error))

        thread = threading.Thread(target=reader_thread)
        thread.daemon = True
        thread.start()

        error_thread = threading.Thread(target=error_reader_thread)
        error_thread.daemon = True
        error_thread.start()

        error_result = None
        try:
            result = result_queue.get(timeout=timeout) or default
            error_result = error_queue.get(timeout=1)
        except queue.Empty:
            result = default

        if error_result:
            logger.error(f"PowerShell error output: {error_result}")

        return result

    def json_parse_output(self, output: str) -> dict:
        """
        Parse command execution output to JSON format.

        Searches for a JSON object in the output string and parses it.
        The method looks for both object and array JSON structures.

        Args:
            output (str): The string output from a PowerShell command.

        Returns:
            dict: Parsed JSON object if found, otherwise an empty dictionary.

        Raises:
            JSONDecodeError: If the JSON parsing fails.

        Example:
            >>> json_parse_output('Some text {"key": "value"} more text')
            {"key": "value"}
        """
        if output == "":
            return {}

        decoder = json.JSONDecoder()
        for index, character in enumerate(output):
            if character not in ("{", "["):
                continue
            try:
                parsed_json, _ = decoder.raw_decode(output[index:])
                return parsed_json
            except json.JSONDecodeError:
                continue

        logger.error(
            f"Unexpected PowerShell output: {output}\n",
        )

        return {}

    def close(self) -> None:
        """
        Terminate the PowerShell session.

        Sends an exit command to PowerShell and terminates the subprocess.
        This method should be called when the session is no longer needed
        to ensure proper cleanup of resources.

        Note:
            It's important to call this method when done with the session
            to prevent resource leaks.
        """
        if self.process:
            try:
                # Send exit command
                self.process.stdin.write("exit\n")
                self.process.stdin.flush()

                # Terminate the process
                self.process.terminate()

                # Wait for the process to finish
                self.process.wait(timeout=5)
            except Exception:
                # If process is still running, force kill it
                self.process.kill()
            finally:
                # Close all pipes
                self.process.stdin.close()
                self.process.stdout.close()
                self.process.stderr.close()
                self.process = None
```

--------------------------------------------------------------------------------

---[FILE: scan.py]---
Location: prowler-master/prowler/lib/scan/scan.py

```python
import datetime
from datetime import timezone
from types import SimpleNamespace
from typing import Generator

from prowler.lib.check.check import (
    execute,
    import_check,
    list_services,
    update_audit_metadata,
)
from prowler.lib.check.checks_loader import load_checks_to_execute
from prowler.lib.check.compliance import update_checks_metadata_with_compliance
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.check.models import CheckMetadata, Severity
from prowler.lib.logger import logger
from prowler.lib.outputs.common import Status
from prowler.lib.outputs.finding import Finding
from prowler.lib.scan.exceptions.exceptions import (
    ScanInvalidCategoryError,
    ScanInvalidCheckError,
    ScanInvalidComplianceFrameworkError,
    ScanInvalidServiceError,
    ScanInvalidSeverityError,
    ScanInvalidStatusError,
)
from prowler.providers.common.models import Audit_Metadata, ProviderOutputOptions
from prowler.providers.common.provider import Provider
from prowler.providers.iac.iac_provider import IacProvider


class Scan:
    _provider: Provider
    # Refactor(Core): This should replace the Audit_Metadata
    _number_of_checks_to_execute: int = 0
    _number_of_checks_completed: int = 0
    # TODO the str should be a set of Check objects
    _checks_to_execute: list[str]
    _service_checks_to_execute: dict[str, set[str]]
    _service_checks_completed: dict[str, set[str]]
    _progress: float = 0.0
    _duration: int = 0
    _status: list[str] = None
    _bulk_checks_metadata: dict[str, CheckMetadata]
    _bulk_compliance_frameworks: dict

    def __init__(
        self,
        provider: Provider,
        checks: list[str] = None,
        services: list[str] = None,
        compliances: list[str] = None,
        categories: list[str] = None,
        severities: list[str] = None,
        excluded_checks: list[str] = None,
        excluded_services: list[str] = None,
        status: list[str] = None,
    ):
        """
        Scan is the class that executes the checks and yields the progress and the findings.

        Params:
            provider: Provider -> The provider to scan
            checks: list[str] -> The checks to execute
            services: list[str] -> The services to scan
            compliances: list[str] -> The compliances to check
            categories: list[str] -> The categories of the checks
            severities: list[str] -> The severities of the checks
            excluded_checks: list[str] -> The checks to exclude
            excluded_services: list[str] -> The services to exclude
            status: list[str] -> The status of the checks

        Raises:
            ScanInvalidCheckError: If the check does not exist in the provider or is from another provider.
            ScanInvalidServiceError: If the service does not exist in the provider.
            ScanInvalidComplianceFrameworkError: If the compliance framework does not exist in the provider.
            ScanInvalidCategoryError: If the category does not exist in the provider.
            ScanInvalidSeverityError: If the severity does not exist in the provider.
            ScanInvalidStatusError: If the status does not exist in the provider.
        """
        self._provider = provider

        # Validate the status
        if status:
            try:
                for s in status:
                    Status(s)
                    if not self._status:
                        self._status = []
                    if s not in self._status:
                        self._status.append(s)
            except ValueError:
                raise ScanInvalidStatusError(f"Invalid status provided: {s}.")

        # Special setup for IaC provider - override inputs to work with traditional flow
        if provider.type == "iac":
            # IaC doesn't use traditional Prowler checks, so clear all input parameters
            # to avoid validation errors and let it flow through the normal logic
            checks = None
            services = None
            excluded_checks = None
            excluded_services = None
            self._bulk_checks_metadata = {}
            self._bulk_compliance_frameworks = {}
        else:
            # Load bulk compliance frameworks
            self._bulk_compliance_frameworks = Compliance.get_bulk(provider.type)
            # Get bulk checks metadata for the provider
            self._bulk_checks_metadata = CheckMetadata.get_bulk(provider.type)
            # Complete checks metadata with the compliance framework specification
            self._bulk_checks_metadata = update_checks_metadata_with_compliance(
                self._bulk_compliance_frameworks, self._bulk_checks_metadata
            )

        # Create a list of valid categories
        valid_categories = set()
        for check, metadata in self._bulk_checks_metadata.items():
            for category in metadata.Categories:
                if category not in valid_categories:
                    valid_categories.add(category)

        # Validate checks
        if checks:
            for check in checks:
                if check not in self._bulk_checks_metadata.keys():
                    raise ScanInvalidCheckError(f"Invalid check provided: {check}.")

        # Validate services
        if services:
            for service in services:
                if service not in list_services(provider.type):
                    raise ScanInvalidServiceError(
                        f"Invalid service provided: {service}."
                    )

        # Validate compliances
        if compliances:
            for compliance in compliances:
                if compliance not in self._bulk_compliance_frameworks.keys():
                    raise ScanInvalidComplianceFrameworkError(
                        f"Invalid compliance provided: {compliance}."
                    )

        # Validate categories
        if categories:
            for category in categories:
                if category not in valid_categories:
                    raise ScanInvalidCategoryError(
                        f"Invalid category provided: {category}."
                    )

        # Validate severity
        if severities:
            for severity in severities:
                try:
                    Severity(severity)
                except ValueError:
                    raise ScanInvalidSeverityError(
                        f"Invalid severity provided: {severity}."
                    )

        # Load checks to execute
        if provider.type == "iac":
            self._checks_to_execute = ["iac_scan"]  # Dummy check name for IaC
        else:
            self._checks_to_execute = sorted(
                load_checks_to_execute(
                    bulk_checks_metadata=self._bulk_checks_metadata,
                    bulk_compliance_frameworks=self._bulk_compliance_frameworks,
                    check_list=checks,
                    service_list=services,
                    compliance_frameworks=compliances,
                    categories=categories,
                    severities=severities,
                    provider=provider.type,
                    checks_file=None,
                )
            )

        # Exclude checks
        if excluded_checks:
            for check in excluded_checks:
                if check in self._checks_to_execute:
                    self._checks_to_execute.remove(check)
                else:
                    raise ScanInvalidCheckError(
                        f"Invalid check provided: {check}. Check does not exist in the provider."
                    )

        # Exclude services
        if excluded_services:
            for check in self._checks_to_execute:
                if get_service_name_from_check_name(check) in excluded_services:
                    self._checks_to_execute.remove(check)
                else:
                    raise ScanInvalidServiceError(
                        f"Invalid service provided: {check}. Service does not exist in the provider."
                    )

        self._number_of_checks_to_execute = len(self._checks_to_execute)

        # Set up service-based checks tracking
        if provider.type == "iac":
            service_checks_to_execute = {"iac": set(["iac_scan"])}
        else:
            service_checks_to_execute = get_service_checks_to_execute(
                self._checks_to_execute
            )
        service_checks_completed = dict()

        self._service_checks_to_execute = service_checks_to_execute
        self._service_checks_completed = service_checks_completed

    @property
    def checks_to_execute(self) -> list[str]:
        return self._checks_to_execute

    @property
    def service_checks_to_execute(self) -> dict[str, set[str]]:
        return self._service_checks_to_execute

    @property
    def service_checks_completed(self) -> dict[str, set[str]]:
        return self._service_checks_completed

    @property
    def provider(self) -> Provider:
        return self._provider

    @property
    def progress(self) -> float:
        return (
            self._number_of_checks_completed / self._number_of_checks_to_execute * 100
        )

    @property
    def duration(self) -> int:
        return self._duration

    @property
    def bulk_checks_metadata(self) -> dict[str, CheckMetadata]:
        return self._bulk_checks_metadata

    @property
    def bulk_compliance_frameworks(self) -> dict[str, CheckMetadata]:
        return self._bulk_compliance_frameworks

    def scan(
        self,
        custom_checks_metadata: dict = None,
    ) -> Generator[tuple[float, list[Finding]], None, None]:
        """
        Executes the scan by iterating over the checks to execute and executing each check.
        Yields the progress and findings for each check.

        Args:
            custom_checks_metadata (dict): Custom metadata for the checks (default: {}).

        Yields:
            Tuple[float, list[Finding]]: A tuple containing the progress and findings for each check.

        Raises:
            ModuleNotFoundError: If the check does not exist in the provider or is from another provider.
            Exception: If any other error occurs during the execution of a check.
        """
        try:
            # Initialize check_name for error handling
            check_name = None

            # Using SimpleNamespace to create a mocked object
            arguments = SimpleNamespace()

            output_options = ProviderOutputOptions(
                arguments=arguments,
                bulk_checks_metadata=self.bulk_checks_metadata,
            )

            checks_to_execute = self.checks_to_execute
            # Initialize the Audit Metadata
            # TODO: this should be done in the provider class
            # Refactor(Core): Audit manager?
            self._provider.audit_metadata = Audit_Metadata(
                services_scanned=0,
                expected_checks=checks_to_execute,
                completed_checks=0,
                audit_progress=0,
            )

            start_time = datetime.datetime.now()

            # Special handling for IaC provider
            if self._provider.type == "iac":
                # IaC provider doesn't use regular checks, it runs Trivy directly
                if isinstance(self._provider, IacProvider):
                    logger.info("Running IaC scan with Trivy...")
                    # Run the IaC scan
                    iac_reports = self._provider.run()

                    # Convert IaC reports to Finding objects
                    findings = []

                    for report in iac_reports:
                        # Generate unique UID for the finding
                        finding_uid = f"{report.check_metadata.CheckID}-{report.resource_name}-{report.resource_line_range}"

                        # Convert status string to Status enum
                        status_enum = (
                            Status.FAIL if report.status == "FAIL" else Status.PASS
                        )
                        if report.muted:
                            status_enum = Status.MUTED

                        finding = Finding(
                            auth_method="Repository",  # IaC uses repository as auth method
                            timestamp=datetime.datetime.now(timezone.utc),
                            account_uid=self._provider.scan_repository_url or "local",
                            account_name="IaC Repository",
                            metadata=report.check_metadata,  # Pass the CheckMetadata object directly
                            uid=finding_uid,
                            status=status_enum,
                            status_extended=report.status_extended,
                            muted=report.muted,
                            resource_uid=report.resource_name,  # For IaC, the file path is the UID
                            resource_metadata=report.resource,  # The raw finding dict
                            resource_name=report.resource_name,
                            resource_details=report.resource_details,
                            resource_tags={},  # IaC doesn't have resource tags
                            region=report.region,  # IaC region is the branch name
                            compliance={},  # IaC doesn't have compliance mappings yet
                            raw=report.resource,  # The raw finding dict
                        )
                        findings.append(finding)

                    # Filter the findings by the status
                    if self._status:
                        findings = [f for f in findings if f.status in self._status]

                    # Update progress and yield findings
                    self._number_of_checks_completed = 1
                    self._number_of_checks_to_execute = 1

                    yield (100.0, findings)

                    # Calculate duration
                    end_time = datetime.datetime.now()
                    self._duration = int((end_time - start_time).total_seconds())
                    return

            for check_name in checks_to_execute:
                try:
                    # Recover service from check name
                    service = get_service_name_from_check_name(check_name)
                    try:
                        # Import check module
                        check_module_path = f"prowler.providers.{self._provider.type}.services.{service}.{check_name}.{check_name}"
                        lib = import_check(check_module_path)
                        # Recover functions from check
                        check_to_execute = getattr(lib, check_name)
                        check = check_to_execute()
                    except ModuleNotFoundError:
                        logger.error(
                            f"Check '{check_name}' was not found for the {self._provider.type.upper()} provider"
                        )
                        continue
                    # Execute the check
                    check_findings = execute(
                        check,
                        self._provider,
                        custom_checks_metadata,
                        output_options=None,
                    )

                    # Filter the findings by the status
                    if self._status:
                        for finding in check_findings:
                            if finding.status not in self._status:
                                check_findings.remove(finding)

                    # Remove the executed check
                    self._service_checks_to_execute[service].remove(check_name)
                    if len(self._service_checks_to_execute[service]) == 0:
                        self._service_checks_to_execute.pop(service, None)
                    # Add the completed check
                    if service not in self._service_checks_completed:
                        self._service_checks_completed[service] = set()
                    self._service_checks_completed[service].add(check_name)
                    self._number_of_checks_completed += 1

                    # This should be done just once all the service's checks are completed
                    # This metadata needs to get to the services not within the provider
                    # since it is present in the Scan class
                    self._provider.audit_metadata = update_audit_metadata(
                        self._provider.audit_metadata,
                        self.get_completed_services(),
                        self.get_completed_checks(),
                    )

                    findings = []
                    for finding in check_findings:
                        try:
                            findings.append(
                                Finding.generate_output(
                                    self.provider,
                                    finding,
                                    output_options=output_options,
                                )
                            )
                        except Exception:
                            continue

                    yield self.progress, findings
                # If check does not exists in the provider or is from another provider
                except ModuleNotFoundError:
                    logger.error(
                        f"Check '{check_name}' was not found for the {self._provider.type.upper()} provider"
                    )
                except Exception as error:
                    logger.error(
                        f"{check_name} - {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
            # Update the scan duration when all checks are completed
            self._duration = int((datetime.datetime.now() - start_time).total_seconds())
        except Exception as error:
            check_name = check_name or "Scan error"
            logger.error(
                f"{check_name} - {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def get_completed_services(self) -> set[str]:
        """
        get_completed_services returns the services that have been completed.

        Example:
            get_completed_services() -> {"ec2", "s3"}
        """
        return self._service_checks_completed.keys()

    def get_completed_checks(self) -> set[str]:
        """
        get_completed_checks returns the checks that have been completed.

        Example:
            get_completed_checks() -> {"ec2_instance_public_ip", "s3_bucket_public"}
        """
        completed_checks = set()
        for checks in self._service_checks_completed.values():
            completed_checks.update(checks)
        return completed_checks


def get_service_name_from_check_name(check_name: str) -> str:
    """
    get_service_name_from_check_name returns the service name for a given check name.

    Example:
        get_service_name_from_check_name("ec2_instance_public") -> "ec2"
    """
    return check_name.split("_")[0]


def get_service_checks_to_execute(checks_to_execute: set[str]) -> dict[str, set[str]]:
    """
    get_service_checks_to_execute returns a dictionary with the services and the checks to execute.

    Example:
        get_service_checks_to_execute({"accessanalyzer_enabled", "ec2_instance_public_ip"})
        -> {"accessanalyzer": {"accessanalyzer_enabled"}, "ec2": {"ec2_instance_public_ip"}}
    """
    service_checks_to_execute = dict()
    for check in checks_to_execute:
        # check -> accessanalyzer_enabled
        # service -> accessanalyzer
        service = get_service_name_from_check_name(check)
        if service not in service_checks_to_execute:
            service_checks_to_execute[service] = set()
        service_checks_to_execute[service].add(check)
    return service_checks_to_execute
```

--------------------------------------------------------------------------------

---[FILE: exceptions.py]---
Location: prowler-master/prowler/lib/scan/exceptions/exceptions.py

```python
from prowler.exceptions.exceptions import ProwlerException


# Exceptions codes from 5000 to 5999 are reserved for Scan exceptions
class ScanBaseException(ProwlerException):
    """Base class for Scan errors."""

    SCAN_ERROR_CODES = {
        (5000, "ScanInvalidSeverityError"): {
            "message": "Invalid severity level provided.",
            "remediation": "Please provide a valid severity level. Valid severities are: critical, high, medium, low, informational.",
        },
        (5001, "ScanInvalidCheckError"): {
            "message": "Invalid check provided.",
            "remediation": "Please provide a valid check name.",
        },
        (5002, "ScanInvalidServiceError"): {
            "message": "Invalid service provided.",
            "remediation": "Please provide a valid service name.",
        },
        (5003, "ScanInvalidComplianceFrameworkError"): {
            "message": "Invalid compliance framework provided.",
            "remediation": "Please provide a valid compliance framework name for the chosen provider.",
        },
        (5004, "ScanInvalidCategoryError"): {
            "message": "Invalid category provided.",
            "remediation": "Please provide a valid category name.",
        },
        (5005, "ScanInvalidStatusError"): {
            "message": "Invalid status provided.",
            "remediation": "Please provide a valid status: FAIL, PASS, MANUAL.",
        },
    }

    def __init__(self, code, file=None, original_exception=None, message=None):
        module = "Scan"
        error_info = self.SCAN_ERROR_CODES.get((code, self.__class__.__name__))
        if message:
            error_info["message"] = message
        super().__init__(
            code=code,
            source=module,
            file=file,
            original_exception=original_exception,
            error_info=error_info,
        )


class ScanInvalidSeverityError(ScanBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            5000, file=file, original_exception=original_exception, message=message
        )


class ScanInvalidCheckError(ScanBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            5001, file=file, original_exception=original_exception, message=message
        )


class ScanInvalidServiceError(ScanBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            5002, file=file, original_exception=original_exception, message=message
        )


class ScanInvalidComplianceFrameworkError(ScanBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            5003, file=file, original_exception=original_exception, message=message
        )


class ScanInvalidCategoryError(ScanBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            5004, file=file, original_exception=original_exception, message=message
        )


class ScanInvalidStatusError(ScanBaseException):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            5005, file=file, original_exception=original_exception, message=message
        )
```

--------------------------------------------------------------------------------

---[FILE: scan_filters.py]---
Location: prowler-master/prowler/lib/scan_filters/scan_filters.py

```python
from prowler.lib.logger import logger


def is_resource_filtered(resource: str, audit_resources: list) -> bool:
    """
    Check if the resource passed as argument is present in the audit_resources.

    Returns True if it is filtered and False if it does not match the input filters
    """
    try:
        if resource in audit_resources:
            return True
        return False
    except Exception as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error} ({resource})"
        )
```

--------------------------------------------------------------------------------

````
