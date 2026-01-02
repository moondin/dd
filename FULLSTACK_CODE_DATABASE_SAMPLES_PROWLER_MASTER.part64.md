---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 64
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 64 of 867)

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

---[FILE: megaprowler.sh]---
Location: prowler-master/contrib/other-contrib/multi-account/megaprowler.sh

```bash
#!/bin/bash

BASEDIR=$(dirname "${0}")
# source the configuration data from "config" in this directory
if [[ -f "${BASEDIR}/config" ]]; then
  # shellcheck disable=SC1090
  . "${BASEDIR}/config"

else
  echo "CONFIG file missing - ${BASEDIR}/config"
  exit 255
fi

## Check Environment variables which are set by config
if [[ "${ORG_MASTERS}X" == "X" && "${STANDALONE_ACCOUNTS}X" == "X" ]]; then
  echo "No audit targets specified. Failing."
  exit 15
fi
if [[ -z $SKIP_ACCOUNTS_REGEX ]]; then
  SKIP_ACCOUNTS_REGEX=""
fi

if [[ -z $CHECKGROUP ]]; then
  echo "Missing check group from config file"
  exit 255
fi
if [[ -z $AUDIT_ROLE ]]; then
  echo "Missing audit role from config file"
  exit 255
fi

## ========================================================================================

## Check Arguments
if [ $# -lt 1 ]; then
  echo "NEED AN OUTPUT DIRECTORY"
  exit 2
else
  if [[ -d $1 && -w $1 ]]; then
    OUTBASE=$1
  else
    echo "Output directory missing or write-protected"
    exit 1
  fi
fi


## Check Requirements
if [[ -x $(command -v aws) ]]; then
  aws --version
else
  echo "AWS CLI is not in PATH ... giving up"
  exit 4
fi

if [[ -x $(command -v jq) ]]; then
  jq --version
else
  echo "JQ is not in PATH ... giving up"
  exit 4
fi

# Ensure AWS Credentials are present in environment
if [[ -z $CREDSOURCE ]]; then
  echo "No source for base credentials ... giving up"
  exit 5
fi

if [[ -f ${PROWLER} && -x ${PROWLER} ]]; then
  ${PROWLER} -V
else
  echo "Unable to execute prowler from ${PROWLER}"
  exit 3
fi


## Preflight checks complete

DAYPATH=$(date -u +%Y/%m/%d)
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
## Create output subdirs
OUTDATA="${OUTBASE}/data/${DAYPATH}"
OUTLOGS="${OUTBASE}/logs/${DAYPATH}"
mkdir -p "${OUTDATA}" "${OUTLOGS}"


if [[ -x $(command -v parallel) ]]; then
  # Note: the "standard" codebuild container includes parallel
  echo "Using GNU sem/parallel, with NCPU+4 jobs"
  parallel --citation > /dev/null 2> /dev/null
  PARALLEL_START="parallel --semaphore --fg --id p_${STAMP} --jobs +4 --env AWS_SHARED_CREDENTIALS_FILE"
  PARALLEL_START_SUFFIX=''
  PARALLEL_END="parallel --semaphore --wait --id p_${STAMP}"
else
  echo "Consider installing GNU Parallel to avoid punishing your system"
  PARALLEL_START=''
  PARALLEL_START_SUFFIX=' &'
  # shellcheck disable=SC2089
  PARALLEL_END="echo 'WAITING BLINDLY FOR PROCESSES TO COMPLETE'; wait ; sleep 30 ; wait"
fi

echo "Execution Timestamp: ${STAMP}"

ALL_ACCOUNTS=""


# Create a temporary credential file
AWS_MASTERS_CREDENTIALS_FILE=$(mktemp -t prowler.masters-XXXXXX)
echo "Preparing Credentials ${AWS_MASTERS_CREDENTIALS_FILE} ( ${CREDSOURCE} )"
echo "# Master Credentials ${STAMP}"   >> "${AWS_MASTERS_CREDENTIALS_FILE}"
echo ""                                >> "${AWS_MASTERS_CREDENTIALS_FILE}"

AWS_TARGETS_CREDENTIALS_FILE=$(mktemp -t prowler.targets-XXXXXX)
echo "Preparing Credentials ${AWS_TARGETS_CREDENTIALS_FILE} ( ${CREDSOURCE} )"
echo "# Target Credentials ${STAMP}" >> "${AWS_TARGETS_CREDENTIALS_FILE}"
echo ""                              >> "${AWS_TARGETS_CREDENTIALS_FILE}"


## Visit the Organization Master accounts & build a list of all member accounts
export AWS_SHARED_CREDENTIALS_FILE=$AWS_MASTERS_CREDENTIALS_FILE
for org in $ORG_MASTERS ; do
  echo -n "Preparing organization $org "
  # create credential profile
  {
  echo "[audit_${org}]"
  echo "role_arn = arn:aws:iam::${org}:role${AUDIT_ROLE}"
  echo "credential_source = ${CREDSOURCE}"
  echo ""
  } >> "${AWS_MASTERS_CREDENTIALS_FILE}"

  # Get the Organization ID to use for output paths, collecting info, etc
  org_id=$(aws --output json --profile "audit_${org}" organizations describe-organization | jq -r '.Organization.Id' )

  echo "( $org_id )"
  ORG_ID_LIST="${ORG_ID_LIST} ${org_id}"


  # Build the list of all accounts in the organizations
  aws --output json --profile "audit_${org}" organizations list-accounts > "${OUTLOGS}/${STAMP}-${org_id}-account-list.json"
  # shellcheck disable=SC2002
  ORG_ACCOUNTS=$( cat "${OUTLOGS}/${STAMP}-${org_id}-account-list.json" | jq -r '.Accounts[].Id' | tr "\n" " ")
  ALL_ACCOUNTS="${ALL_ACCOUNTS} ${ORG_ACCOUNTS}"

  # Add the Org's Accounts (including master) to the TARGETS_CREDENTIALS file
  for target in $ORG_ACCOUNTS ; do
    if echo "$target" | grep -qE "${SKIP_ACCOUNTS_REGEX}"; then
      echo " skipping account      ${target} ( ${org_id} )"
      continue
    fi
    # echo "  ${org_id}_${target}"
    {
    echo "[${org_id}_${target}]"
    echo "role_arn = arn:aws:iam::${target}:role${AUDIT_ROLE}"
    echo "credential_source = ${CREDSOURCE}"
    echo ""
    } >> "${AWS_TARGETS_CREDENTIALS_FILE}"
  done

done

# Prepare credentials for standalone accounts
if [[ "" != "${STANDALONE_ACCOUNTS}" ]] ; then
  # mkdir -p ${OUTBASE}/data/standalone/${DAYPATH} ${OUTBASE}/logs/standalone/${DAYPATH}
  for target in $STANDALONE_ACCOUNTS ; do
    echo "Preparing account      ${target} ( standalone )"
    {
    echo "[standalone_${target}]"
    echo "role_arn = arn:aws:iam::${target}:role${AUDIT_ROLE}"
    echo "credential_source = ${CREDSOURCE}"
    echo ""
    } >> "${AWS_TARGETS_CREDENTIALS_FILE}"
  done
  ALL_ACCOUNTS="${ALL_ACCOUNTS} ${STANDALONE_ACCOUNTS}"
fi

# grep -E '^\[' $AWS_MASTERS_CREDENTIALS_FILE $AWS_TARGETS_CREDENTIALS_FILE


# Switch to Target Credential Set
export AWS_SHARED_CREDENTIALS_FILE=${AWS_TARGETS_CREDENTIALS_FILE}

## visit each target account
NUM_ACCOUNTS=$(grep -cE '^\[' "${AWS_TARGETS_CREDENTIALS_FILE}")
echo "Launching ${CHECKGROUP} audit of ${NUM_ACCOUNTS} accounts"
for member in $(grep -E '^\[' "${AWS_TARGETS_CREDENTIALS_FILE}" | tr -d '][') ; do
  ORG_ID=$(echo "$member" | cut -d'_' -f1)
  ACCOUNT_NUM=$(echo "$member" | cut -d'_' -f2)

  # shellcheck disable=SC2086
  ${PARALLEL_START} "${PROWLER} -p ${member} -n -M csv -g ${CHECKGROUP} 2> ${OUTLOGS}/${STAMP}-${ORG_ID}-${ACCOUNT_NUM}-prowler-${CHECKGROUP}.log  > ${OUTDATA}/${STAMP}-${ORG_ID}-${ACCOUNT_NUM}-prowler-${CHECKGROUP}.csv ; echo \"${ORG_ID}-${ACCOUNT_NUM}-prowler-${CHECKGROUP} finished\" " ${PARALLEL_START_SUFFIX}
done

echo -n "waiting for parallel threads to complete - " ; date
# shellcheck disable=SC2090
${PARALLEL_END}

echo "Completed ${CHECKGROUP} audit with stamp ${STAMP}"

# mkdir -p ${OUTBASE}/logs/debug/${DAYPATH}
# cp "$AWS_MASTERS_CREDENTIALS_FILE" "${OUTLOGS}/${STAMP}-master_creds.txt"
# cp "$AWS_TARGETS_CREDENTIALS_FILE" "${OUTLOGS}/${STAMP}-target_creds.txt"
rm "$AWS_MASTERS_CREDENTIALS_FILE" "$AWS_TARGETS_CREDENTIALS_FILE"
```

--------------------------------------------------------------------------------

---[FILE: readme.md]---
Location: prowler-master/contrib/PowerBI/Multicloud CIS Benchmarks/readme.md

```text
# Prowler Multicloud CIS Benchmarks PowerBI Template
![Prowler Report](https://github.com/user-attachments/assets/560f7f83-1616-4836-811a-16963223c72f)

## Getting Started

1. Install Microsoft PowerBI Desktop

   This report requires the Microsoft PowerBI Desktop software which can be downloaded for free from Microsoft.
2. Run compliance scans in Prowler

   The report uses compliance csv outputs from Prowler. Compliance scans be run using either [Prowler CLI](https://docs.prowler.com/projects/prowler-open-source/en/latest/#prowler-cli) or [Prowler Cloud/App](https://cloud.prowler.com/sign-in)
   1. Prowler CLI -&gt; Run a Prowler scan using the --compliance option
   2. Prowler Cloud/App -&gt; Navigate to the compliance section to download csv outputs
![Download Compliance Scan](https://github.com/user-attachments/assets/42c11a60-8ce8-4c60-a663-2371199c052b)
   

   The template supports the following CIS Benchmarks only:

   | Compliance Framework                           | Version |
   | ---------------------------------------------- | ------- |
   | CIS Amazon Web Services Foundations Benchmark  | v4.0.1  |
   | CIS Google Cloud Platform Foundation Benchmark | v3.0.0  |
   | CIS Microsoft Azure Foundations Benchmark      | v3.0.0  |
   | CIS Kubernetes Benchmark                       | v1.10.0 |

   Ensure you run or download the correct benchmark versions.
3. Create a local directory to store Prowler csvoutputs

   Once downloaded, place your csv outputs in a directory on your local machine. If you rename the files, they must maintain the provider in the filename.

   To use time-series capabilities such as "compliance percent over time" you'll need scans from multiple dates.
4. Download and run the PowerBI template file (.pbit)

   Running the .pbit file will open PowerBI Desktop and prompt you for the full filepath to the local directory
5. Enter the full filepath to the directory created in step 3

   Provide the full filepath from the root directory.

   Ensure that the filepath is not wrapped in quotation marks (""). If you use Window's "copy as path" feature, it will automatically include quotation marks.
6. Save the report as a PowerBI file (.pbix)

   Once the filepath is entered, the template will automatically ingest and populate the report. You can then save this file as a new PowerBI report. If you'd like to generate another report, simply re-run the template file (.pbit) from step 4.

## Validation

After setting up your dashboard, you may want to validate the Prowler csv files were ingested correctly. To do this, navigate to the "Configuration" tab.

The "loaded CIS Benchmarks" table shows the supported benchmarks and versions. This is defined by the template file and not editable by the user. All benchmarks will be loaded regardless of which providers you provided csv outputs for.

The "Prowler CSV Folder" shows the path to the local directory you provided.

The "Loaded Prowler Exports" table shows the ingested csv files from the local directory. It will mark files that are treated as the latest assessment with a green checkmark.

![Prowler Validation](https://github.com/user-attachments/assets/a543ca9b-6cbe-4ad1-b32a-d4ac2163d447)

## Report Sections

The PowerBI Report is broken into three main report pages

| Report Page | Description                                                                         |
| ----------- | ----------------------------------------------------------------------------------- |
| Overview    | Provides general CIS Benchmark overview across both AWS, Azure, GCP, and Kubernetes |
| Benchmark   | Provides overview of a single CIS Benchmark                                         |
| Requirement | Drill-through page to view details of a single requirement                          |


### Overview Page

The overview page is a general CIS Benchmark overview across both AWS, Azure, GCP, and Kubernetes.

![image](https://github.com/user-attachments/assets/94164fa9-36a4-4bb9-890d-e9a9a63a3e7d)

The page has the following components:

| Component                                | Description                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| CIS Benchmark Overview                   | Table with benchmark name, Version, and overall compliance percentage    |
| Provider by Requirement Status           | Bar chart showing benchmark requirements by status by provider           |
| Compliance Percent Heatmap               | Heatmap showing compliance percent by benchmark and profile level        |
| Profile level by Requirement Status      | Bar chart showing requirements by status and profile level               |
| Compliance Percent Over Time by Provider | Line chart showing overall compliance perecentage over time by provider. |

### Benchmark Page

The benchmark page provides an overview of a single CIS Benchmark. You can select the benchmark from the dropdown as well as scope down to specific profile levels or regions.

![image](https://github.com/user-attachments/assets/34498ee8-317b-4b81-b241-c561451d8def)

The page has the following components:

| Component                               | Description                                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Compliance Percent Heatmap              | Heatmap showing compliance percent by region and profile level                                                                             |
| Benchmark Section by Requirement Status | Bar chart showing benchmark requirements by bennchmark section and status                                                                  |
| Compliance percent Over Time by Region  | Line chart showing overall compliance percentage over time by region                                                                       |
| Benchmark Requirements                  | Table showing requirement section, requirement number, reuqirement title, number of resources tested, status, and number of failing checks |

### Requirement Page

The requirement page is a drill-through page to view details of a single requirement. To populate the requirement page right click on a requiement from the "Benchmark Requirements" table on the benchmark page and select "Drill through" -&gt; "Requirement".

![image](https://github.com/user-attachments/assets/5c9172d9-56fe-4514-b341-7e708863fad6)

The requirement page has the following components:

| Component                                  | Description                                                                       |
| ------------------------------------------ | --------------------------------------------------------------------------------- |
| Title                                      | Title of the requirement                                                          |
| Rationale                                  | Rationale of the requirement                                                      |
| Remediation                                | Remedation guidance for the requirement                                           |
| Region by Check Status                     | Bar chart showing Prowler checks by region and status                             |
| Resource Checks for Benchmark Requirements | Table showing Resource ID, Resource Name, Status, Description, and Prowler Checkl |

## Walkthrough Video
[![image](https://github.com/user-attachments/assets/866642c6-43ac-4aac-83d3-bb625002da0b)](https://www.youtube.com/watch?v=lfKFkTqBxjU)
```

--------------------------------------------------------------------------------

---[FILE: data.tf]---
Location: prowler-master/contrib/terraform-kickstarter/data.tf

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
data "aws_iam_policy" "SecurityAudit" {
  arn = "arn:aws:iam::aws:policy/SecurityAudit"
}
data "aws_caller_identity" "current" {
}
data "aws_region" "current" {
}
```

--------------------------------------------------------------------------------

````
