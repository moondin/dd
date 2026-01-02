---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 66
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 66 of 867)

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

---[FILE: tf_install.sh]---
Location: prowler-master/contrib/terraform-kickstarter/tf_install.sh

```bash
#!/bin/bash
#AMZN-Linux Terraform Install Script
git clone https://github.com/singergs/prowler.git
git fetch
cd prowler
git checkout -t origin/terraform-kickstart
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
sudo yum -y install terraform
```

--------------------------------------------------------------------------------

---[FILE: variables.tf]---
Location: prowler-master/contrib/terraform-kickstarter/variables.tf

```text
/*
© 2020 Amazon Web Services, Inc. or its affiliates. All Rights Reserved.

                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non_exclusive, no_charge, royalty_free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non_exclusive, no_charge, royalty_free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross_claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third_party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON_INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third_party archives.

   Copyright [2020] [© 2020 Amazon Web Services, Inc. or its affiliates. All Rights Reserved.]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE_2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/*
Security Hub Import Commands

Run this to get state of SecurityHub

terraform import aws_securityhub_account.securityhubresource 123456789012

*/

variable "select_region" {
  description = "Uses the following AWS Region."
  type        = string
  default     = "us-east-1"
}

variable "enable_security_hub" {
  description = "Enable AWS SecurityHub."
  type        = bool
  default     = true
}

variable "enable_security_hub_prowler_subscription" {
  description = "Enable a Prowler Subscription."
  type        = bool
  default     = true
}

variable "prowler_cli_options" {
  description = "Run Prowler With The Following Command"
  type        = string
  default     =  "-q -M json-asff -S -f us-east-1"
}

variable "prowler_schedule"{
  description = "Run Prowler based on cron schedule"
  default="cron(0 0 ? * * *)"
  type=string

}

variable "codebuild_timeout" {
  description = "Codebuild timeout setting"
  default = 300
  type=number
}
```

--------------------------------------------------------------------------------

---[FILE: tf.md]---
Location: prowler-master/contrib/terraform-kickstarter/docs/tf.md

```text
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 3.54 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 3.55.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_event_rule.prowler_check_scheduler_event](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_rule) | resource |
| [aws_cloudwatch_event_target.run_prowler_scan](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_target) | resource |
| [aws_codebuild_project.prowler_codebuild](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/codebuild_project) | resource |
| [aws_iam_policy.prowler_event_trigger_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.prowler_kickstarter_iam_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy_attachment.prowler_event_trigger_policy_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy_attachment) | resource |
| [aws_iam_policy_attachment.prowler_kickstarter_iam_policy_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy_attachment) | resource |
| [aws_iam_role.prowler_event_trigger_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.prowler_kick_start_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_s3_bucket.prowler_report_storage_bucket](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_policy.prowler_report_storage_bucket_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_policy) | resource |
| [aws_s3_bucket_public_access_block.prowler_report_storage_bucket_block_public](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block) | resource |
| [aws_securityhub_account.securityhub_resource](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/securityhub_account) | resource |
| [aws_securityhub_product_subscription.security_hub_enable_prowler_findings](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/securityhub_product_subscription) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy.SecurityAudit](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_codebuild_timeout"></a> [codebuild\_timeout](#input\_codebuild\_timeout) | Codebuild timeout setting | `number` | `300` | no |
| <a name="input_enable_security_hub"></a> [enable\_security\_hub](#input\_enable\_security\_hub) | Enable AWS SecurityHub. | `bool` | `true` | no |
| <a name="input_enable_security_hub_prowler_subscription"></a> [enable\_security\_hub\_prowler\_subscription](#input\_enable\_security\_hub\_prowler\_subscription) | Enable a Prowler Subscription. | `bool` | `true` | no |
| <a name="input_prowler_cli_options"></a> [prowler\_cli\_options](#input\_prowler\_cli\_options) | Run Prowler With The Following Command | `string` | `"_q _M json_asff _S _f us_east_1"` | no |
| <a name="input_prowler_schedule"></a> [prowler\_schedule](#input\_prowler\_schedule) | Run Prowler based on cron schedule | `string` | `"cron(0 0 ? * * *)"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_account_id"></a> [account\_id](#output\_account\_id) | TODO Move these to outputs file |
```

--------------------------------------------------------------------------------

---[FILE: prowler-wrapper.py]---
Location: prowler-master/contrib/wazuh/prowler-wrapper.py

```python
#!/usr/bin/env python
#
# Authored by Jeremy Phillips <jeremy@uranusbytes.com>
# Copyright: Apache License 2.0
#
# Wrapper around prowler script to parse results and forward to Wazuh
# Prowler - https://github.com/toniblyx/prowler
#
# TODO: Add ability to disable different groups (EXTRA, etc...
# TODO: Allow to disable individual checks
# TODO: Remove all the commented out stuff
#
# Error Codes:
#   1 - Unknown
#   2 - SIGINT
#   3 - Error output from execution of Prowler
#   4 - Output row is invalid json
#   5 - Wazuh must be running
#   6 - Error sending to socket


import argparse
import json
import os
import re
import shlex
import signal
import socket
import subprocess
import sys
from datetime import datetime

################################################################################
# Constants
################################################################################
WAZUH_PATH = open("/etc/ossec-init.conf").readline().split('"')[1]
DEBUG_LEVEL = 0  # Enable/disable debug mode
PATH_TO_PROWLER = "{0}/integrations/prowler".format(WAZUH_PATH)  # No trailing slash
TEMPLATE_CHECK = """
{{
  "integration": "prowler",
  "prowler": {0}
}}
"""
TEMPLATE_MSG = "1:Wazuh-Prowler:{0}"
TEMPLATE_ERROR = """{{
  "aws_account_id": {aws_account_id},
  "aws_profile": "{aws_profile}",
  "prowler_error": "{prowler_error}",
  "prowler_version": "{prowler_version}",
  "timestamp": "{timestamp}",
  "status": "Error"
}}
"""
WAZUH_QUEUE = "{0}/queue/ossec/queue".format(WAZUH_PATH)
FIELD_REMAP = {
    "Profile": "aws_profile",
    "Control": "control",
    "Account Number": "aws_account_id",
    "Level": "level",
    "Account Alias": "aws_account_alias",
    "Timestamp": "timestamp",
    "Region": "region",
    "Control ID": "control_id",
    "Status": "status",
    "Scored": "scored",
    "Message": "message",
}
CHECKS_FILES_TO_IGNORE = ["check_sample"]


################################################################################
# Functions
################################################################################
def _send_msg(msg):
    try:
        _json_msg = json.dumps(_reformat_msg(msg))
        _debug("Sending Msg: {0}".format(_json_msg), 3)
        _socket = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
        _socket.connect(WAZUH_QUEUE)
        _socket.send(TEMPLATE_MSG.format(_json_msg).encode())
        _socket.close()
    except socket.error as e:
        if e.errno == 111:
            print("ERROR: Wazuh must be running.")
            sys.exit(5)
        else:
            print("ERROR: Error sending message to wazuh: {}".format(e))
            sys.exit(6)
    except Exception as e:
        print("ERROR: Error sending message to wazuh: {}".format(e))
        sys.exit(6)
    return


def _handler(signal, frame):
    print("ERROR: SIGINT received.")
    sys.exit(12)


def _debug(msg, msg_level):
    if DEBUG_LEVEL >= msg_level:
        print("DEBUG-{level}: {debug_msg}".format(level=msg_level, debug_msg=msg))


def _get_script_arguments():
    _parser = argparse.ArgumentParser(
        usage="usage: %(prog)s [options]",
        description="Wazuh wodle for evaluating AWS security configuration",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    _parser.add_argument(
        "-c",
        "--aws_account_id",
        dest="aws_account_id",
        help="AWS Account ID for logs",
        required=False,
    )
    _parser.add_argument(
        "-d", "--debug", action="store", dest="debug", default=0, help="Enable debug"
    )
    _parser.add_argument(
        "-p",
        "--aws_profile",
        dest="aws_profile",
        help="The name of credential profile to use",
        default=None,
    )
    _parser.add_argument(
        "-n",
        "--aws_account_alias",
        dest="aws_account_alias",
        help="AWS Account ID Alias",
        default="",
    )
    _parser.add_argument(
        "-e",
        "--skip_on_error",
        action="store_false",
        dest="skip_on_error",
        help="If check output is invalid json, error out instead of skipping the check",
        default=True,
    )
    return _parser.parse_args()


def _run_prowler(prowler_args):
    _debug("Running prowler with args: {0}".format(prowler_args), 1)
    _prowler_command = shlex.split(
        "{prowler}/prowler {args}".format(prowler=PATH_TO_PROWLER, args=prowler_args)
    )
    _debug("Running command: {0}".format(" ".join(_prowler_command)), 2)
    _process = subprocess.Popen(_prowler_command, stdout=subprocess.PIPE)
    _output, _error = _process.communicate()
    _debug("Raw prowler output: {0}".format(_output), 3)
    _debug("Raw prowler error: {0}".format(_error), 3)
    if _error is not None:
        _debug("PROWLER ERROR: {0}".format(_error), 1)
        exit(3)
    return _output


def _get_prowler_version(options):
    _debug("+++ Get Prowler Version", 1)
    # Execute prowler, but only display the version and immediately exit
    return _run_prowler("-p {0} -V".format(options.aws_profile)).rstrip()


def _get_prowler_results(options, prowler_check):
    _debug("+++ Get Prowler Results - {check}".format(check=prowler_check), 1)
    # Execute prowler with all checks
    # -b = disable banner
    # -p = credential profile
    # -M = output json

    return _run_prowler(
        "-b -c {check} -p {aws_profile} -M json".format(
            check=prowler_check, aws_profile=options.aws_profile
        )
    )


def _get_prowler_checks():
    _prowler_checks = []
    for _directory_path, _directories, _files in os.walk(
        "{path}/checks".format(path=PATH_TO_PROWLER)
    ):
        _debug("Checking in : {}".format(_directory_path), 3)
        for _file in _files:
            if _file in CHECKS_FILES_TO_IGNORE:
                _debug("Ignoring check - {}".format(_directory_path, _file), 3)
            elif re.match("check\d+", _file):
                _prowler_checks.append(_file)
            elif re.match("check_extra(\d+)", _file):
                _prowler_checks.append(_file[6:])
            else:
                _debug("Unknown check file type- {}".format(_directory_path, _file), 3)
    return _prowler_checks


def _send_prowler_results(prowler_results, _prowler_version, options):
    _debug("+++ Send Prowler Results", 1)
    for _check_result in prowler_results.splitlines():
        # Empty row
        if len(_check_result) < 1:
            continue
        # Something failed during prowler check
        elif _check_result[:17] == "An error occurred":
            _debug("ERROR MSG --- {0}".format(_check_result), 2)
            _temp_msg = TEMPLATE_ERROR.format(
                aws_account_id=options.aws_account_id,
                aws_profile=options.aws_profile,
                prowler_error=_check_result.replace('"', '"'),
                prowler_version=_prowler_version,
                timestamp=datetime.now().isoformat(),
            )
            _error_msg = json.loads(TEMPLATE_CHECK.format(_temp_msg))
            _send_msg(_error_msg)
            continue
        try:
            _debug("RESULT MSG --- {0}".format(_check_result), 2)
            _check_result = json.loads(TEMPLATE_CHECK.format(_check_result))
        except:
            _debug(
                "INVALID JSON --- {0}".format(TEMPLATE_CHECK.format(_check_result)), 1
            )
            if not options.skip_on_error:
                exit(4)
        _check_result["prowler"]["prowler_version"] = _prowler_version
        _check_result["prowler"]["aws_account_alias"] = options.aws_account_alias
        _send_msg(_check_result)

    return True


def _reformat_msg(msg):
    for field in FIELD_REMAP:
        if field in msg["prowler"]:
            msg["prowler"][FIELD_REMAP[field]] = msg["prowler"][field]
            del msg["prowler"][field]
    return msg


# Main
###############################################################################
def main(argv):
    _debug("+++ Begin script", 1)
    # Parse arguments
    _options = _get_script_arguments()

    if int(_options.debug) > 0:
        global DEBUG_LEVEL
        DEBUG_LEVEL = int(_options.debug)
        _debug("+++ Debug mode on - Level: {debug}".format(debug=_options.debug), 1)

    _prowler_version = _get_prowler_version(_options)
    _prowler_checks = _get_prowler_checks()
    for _check in _prowler_checks:
        _prowler_results = _get_prowler_results(_options, _check)
        _send_prowler_results(_prowler_results, _prowler_version, _options)
    _debug("+++ Finished script", 1)
    return


if __name__ == "__main__":
    try:
        _debug("Args: {args}".format(args=str(sys.argv)), 2)
        signal.signal(signal.SIGINT, _handler)
        main(sys.argv[1:])
        sys.exit(0)
    except Exception as e:
        print("Unknown error: {}".format(e))
        if DEBUG_LEVEL > 0:
            raise
        sys.exit(1)
```

--------------------------------------------------------------------------------

---[FILE: prowler_rules.xml]---
Location: prowler-master/contrib/wazuh/prowler_rules.xml

```text
<!--
  Rules for parsing Prowler output
  Authored by Jeremy Phillips <jeremy@uranusbytes.com>
  Copyright: Apache License 2.0
  ID: 110000-110009
  Prowler - https://github.com/toniblyx/prowler
-->

<group name="local,amazon,prowler,">
    <!-- Filter 1: Only prowler events -->
    <rule id="110001" level="0">
        <field name="integration">prowler</field>
        <description>Prowler Check Result: $(prowler.status) - Control $(prowler.control_id)</description>
    </rule>
    <!-- Check Result: Pass -->
    <rule id="110002" level="1">
        <if_sid>110001</if_sid>
        <field name="prowler.status">Pass</field>
        <description>Prowler Check Result: $(prowler.status) - Control $(prowler.control_id)</description>
    </rule>
    <!-- Check Result: Info -->
    <rule id="110003" level="3">
        <if_sid>110001</if_sid>
        <field name="prowler.status">Info</field>
        <description>Prowler Check Result: $(prowler.status) - Control $(prowler.control_id)</description>
    </rule>
    <!-- Check Result: Error -->
    <rule id="110004" level="5">
        <if_sid>110001</if_sid>
        <field name="prowler.status">Error</field>
        <description>Prowler Check Result: $(prowler.status) - Control $(prowler.control_id)</description>
    </rule>
    <!-- Check Result: Fail, Scored -->
    <rule id="110005" level="9">
        <if_sid>110001</if_sid>
        <field name="prowler.status">Fail</field>
        <description>Prowler Check Result: $(prowler.status) - Control $(prowler.control_id)</description>
    </rule>
    <!-- Check Result: Fail, Not Scored -->
    <rule id="110006" level="7">
        <if_sid>110005</if_sid>
        <field name="prowler.scored">Not Scored</field>
        <description>Prowler Check Result: $(prowler.status) - Control $(prowler.control_id)</description>
    </rule>
</group>
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/contrib/wazuh/README.md

```text
# Prowler integration with Wazuh (DRAFT)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Requirements](#requirements)
- [Integration steps](#integration-steps)
- [Troubleshooting](#troubleshooting)
- [Thanks](#thanks)
- [License](#license)

## Description

Prowler integration with WAZUH using a python wrapper. Due to the wrapper limitations, this integration can be considered as a proof of concept at this time.

## Features

Wazuh, using a wodle, runs Prowler every certain time and stores alerts (failed checks) using JSON output which Wazuh processes and sends to Elastic Search to be queried from Kibana.

## Requirements

1. Latest AWS-CLI client (`pip install awscli`). If you have it already installed, make sure you are using the latest version, upgrade it: `pip install awscli --upgrade`.
2. Also `jq` is needed (`pip install jq`).

Remember, you must have AWS-CLI credentials already configured in the same instance running Wazuh (run `aws configure` if needed). In this DRAFT I'm using `/root/.aws/credentials` file with [default] as AWS-CLI profile and access keys but you can use assume role configuration as well. For the moment instance profile is not supported in this wrapper.

It may work in previous versions of Wazuh, but this document and integration was tested on Wazuh 3.7.1. So to have a Wazuh running installation is obviously required.

## Integration steps

Add Prowler to Wazuh's integrations:
```
cd /var/ossec/integrations/
git clone https://github.com/toniblyx/prowler
```
Copy `prowler-wrapper.py` to integrations folder:

```
cp /var/ossec/integrations/prowler/integrations/prowler-wrapper.py /var/ossec/integrations/prowler-wrapper.py
```
Then make sure it is executable:
```
chmod +x /var/ossec/integrations/prowler-wrapper.py
```
Run Prowler wrapper manually to make sure it works fine, use `--debug 1` or `--debug 2`):
```
/var/ossec/integrations/prowler-wrapper.py --aws_profile default --aws_account_alias default --debug 2
```

Copy rules file to its location:

```
cp /var/ossec/integrations/prowler/integrations/prowler_rules.xml /var/ossec/etc/rules/prowler_rules.xml
```

Edit `/var/ossec/etc/ossec.conf` and add the following wodle configuration. Remember that here `timeout 21600 seconds` is 6 hours, just to allow Prowler runs completely in case of a large account. The interval recommended is 1d:
```xml
  <wodle name="command">
    <disabled>no</disabled>
    <tag>aws-prowler: account1</tag>
    <command>/var/ossec/integrations/prowler-wrapper.py --aws_profile default --aws_account_alias default</command>
    <interval>1d</interval>
    <ignore_output>no</ignore_output>
    <run_on_start>no</run_on_start>
    <timeout>21600</timeout>
  </wodle>
```
To check multiple AWS accounts, add a wodle per account.

Now restart `wazuh-manager` and look at `/var/ossec/logs/alerts/alerts.json`, eventually you should see FAIL checks detected by Prowler, then you will find them using Kibana. Some Kibana search examples are:
```
data.integration:"prowler" and data.prowler.status:"Fail"
data.integration:"prowler" AND rule.level >= 5
data.integration:"prowler" AND rule.level : 7 or 9
```

Adjust the level range to what alerts you want to include, as alerts, Elastic Search only gets fail messages (7 and 9).

1 - pass
3 - info
5 - error
7 - fail: not scored
9 - fail: scored

## Troubleshooting

To make sure rules are working fine, run `/var/ossec/bin/ossec-logtest` and copy/paste this sample JSON:

```json
{"prowler":{"Timestamp":"2018-11-29T03:15:50Z","Region":"us-east-1","Profile":"default","Account Number”:”1234567890”,”Control":"[check34] Ensure a log metric filter and alarm exist for IAM policy changes (Scored)","Message":"No CloudWatch group found for CloudTrail events","Status":"Fail","Scored":"Scored","Level":"Level 1","Control ID":"3.4"}, "integration": "prowler"}
```
You must see 3 phases goin on.

To check if there is any error you can enable the debug mode of `modulesd` setting the `wazuh_modules.debug=0` variable to 2 in `/var/ossec/etc/internal_options.conf` file. Restart wazuh-manager and errors should appear in the `/var/ossec/logs/ossec.log` file.

## Thanks

To Jeremy Phillips <jeremy@uranusbytes.com>, who wrote the initial rules file and wrapper and helped me to understand how it works and debug it.

To [Marta Gomez](https://github.com/mgmacias95) and the [Wazuh](https://www.wazuh.com) team for their support to debug this integration and make it work properly. Their job on Wazuh and willingness to help is invaluable.

## License

All CIS based checks in the checks folder are licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License.
The link to the license terms can be found at
<https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode>
Any other piece of code is licensed as Apache License 2.0 as specified in each file. You may obtain a copy of the License at
<http://www.apache.org/licenses/LICENSE-2.0>

NOTE: If you are interested in using Prowler for commercial purposes remember that due to the CC4.0 license “The distributors or partners that are interested and using Prowler would need to enroll as CIS SecureSuite Members to incorporate this product, which includes references to CIS resources, in their offering.". Information about CIS pricing for vendors here: <https://www.cisecurity.org/cis-securesuite/pricing-and-categories/product-vendor/>

**I'm not related anyhow with CIS organization, I just write and maintain Prowler to help companies over the world to make their cloud infrastructure more secure.**

If you want to contact me visit <https://blyx.com/contact>
```

--------------------------------------------------------------------------------

````
