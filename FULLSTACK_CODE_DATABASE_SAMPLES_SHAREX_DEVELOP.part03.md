---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:46Z
part: 3
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 3 of 650)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - ShareX-develop
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/ShareX-develop
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: ShareX.sln]---
Location: ShareX-develop/ShareX.sln

```text

Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.0.32112.339
MinimumVisualStudioVersion = 10.0.40219.1
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "ShareX", "ShareX\ShareX.csproj", "{C5AE4585-E9EC-4FA3-B75A-E1210635ACB6}"
	ProjectSection(ProjectDependencies) = postProject
		{254E398D-F7F5-4B2A-9024-5C121EA6C564} = {254E398D-F7F5-4B2A-9024-5C121EA6C564}
	EndProjectSection
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "ShareX.HistoryLib", "ShareX.HistoryLib\ShareX.HistoryLib.csproj", "{E7DE6237-AEA2-498B-8F56-9B392472C490}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "ShareX.ScreenCaptureLib", "ShareX.ScreenCaptureLib\ShareX.ScreenCaptureLib.csproj", "{DBDB0DAA-B3AE-4CC4-A8C2-20550B7F32E3}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "ShareX.HelpersLib", "ShareX.HelpersLib\ShareX.HelpersLib.csproj", "{327750E1-9FB7-4CC3-8AEA-9BC42180CAD3}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "ShareX.UploadersLib", "ShareX.UploadersLib\ShareX.UploadersLib.csproj", "{E1C94415-3424-4517-A2A1-B2FDD1F59C67}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "ShareX.IndexerLib", "ShareX.IndexerLib\ShareX.IndexerLib.csproj", "{750C6F46-2C5A-4488-81D3-3B35CA50F3EE}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "ShareX.ImageEffectsLib", "ShareX.ImageEffectsLib\ShareX.ImageEffectsLib.csproj", "{D13441B6-96E1-4D1B-8A95-58A7D6CB1E24}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "ShareX.Setup", "ShareX.Setup\ShareX.Setup.csproj", "{3D19A94A-7A58-4451-A686-EE70B471C206}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "ShareX.MediaLib", "ShareX.MediaLib\ShareX.MediaLib.csproj", "{1A190E53-1419-4CC2-B0E5-3BC7EA861C8B}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "ShareX.Steam", "ShareX.Steam\ShareX.Steam.csproj", "{7F6ADFC5-2563-4A5F-B202-93B553578719}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "ShareX.NativeMessagingHost", "ShareX.NativeMessagingHost\ShareX.NativeMessagingHost.csproj", "{254E398D-F7F5-4B2A-9024-5C121EA6C564}"
EndProject
Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "Solution Items", "Solution Items", "{515655AC-4716-420E-BBA9-318680DBF355}"
	ProjectSection(SolutionItems) = preProject
		.editorconfig = .editorconfig
		Directory.build.props = Directory.build.props
		Directory.build.targets = Directory.build.targets
	EndProjectSection
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		MicrosoftStore|Any CPU = MicrosoftStore|Any CPU
		MicrosoftStoreDebug|Any CPU = MicrosoftStoreDebug|Any CPU
		Release|Any CPU = Release|Any CPU
		Steam|Any CPU = Steam|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{C5AE4585-E9EC-4FA3-B75A-E1210635ACB6}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{C5AE4585-E9EC-4FA3-B75A-E1210635ACB6}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{C5AE4585-E9EC-4FA3-B75A-E1210635ACB6}.MicrosoftStore|Any CPU.ActiveCfg = MicrosoftStore|Any CPU
		{C5AE4585-E9EC-4FA3-B75A-E1210635ACB6}.MicrosoftStore|Any CPU.Build.0 = MicrosoftStore|Any CPU
		{C5AE4585-E9EC-4FA3-B75A-E1210635ACB6}.MicrosoftStoreDebug|Any CPU.ActiveCfg = MicrosoftStoreDebug|Any CPU
		{C5AE4585-E9EC-4FA3-B75A-E1210635ACB6}.MicrosoftStoreDebug|Any CPU.Build.0 = MicrosoftStoreDebug|Any CPU
		{C5AE4585-E9EC-4FA3-B75A-E1210635ACB6}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{C5AE4585-E9EC-4FA3-B75A-E1210635ACB6}.Release|Any CPU.Build.0 = Release|Any CPU
		{C5AE4585-E9EC-4FA3-B75A-E1210635ACB6}.Steam|Any CPU.ActiveCfg = Steam|Any CPU
		{C5AE4585-E9EC-4FA3-B75A-E1210635ACB6}.Steam|Any CPU.Build.0 = Steam|Any CPU
		{E7DE6237-AEA2-498B-8F56-9B392472C490}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{E7DE6237-AEA2-498B-8F56-9B392472C490}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{E7DE6237-AEA2-498B-8F56-9B392472C490}.MicrosoftStore|Any CPU.ActiveCfg = MicrosoftStore|Any CPU
		{E7DE6237-AEA2-498B-8F56-9B392472C490}.MicrosoftStore|Any CPU.Build.0 = MicrosoftStore|Any CPU
		{E7DE6237-AEA2-498B-8F56-9B392472C490}.MicrosoftStoreDebug|Any CPU.ActiveCfg = MicrosoftStoreDebug|Any CPU
		{E7DE6237-AEA2-498B-8F56-9B392472C490}.MicrosoftStoreDebug|Any CPU.Build.0 = MicrosoftStoreDebug|Any CPU
		{E7DE6237-AEA2-498B-8F56-9B392472C490}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{E7DE6237-AEA2-498B-8F56-9B392472C490}.Release|Any CPU.Build.0 = Release|Any CPU
		{E7DE6237-AEA2-498B-8F56-9B392472C490}.Steam|Any CPU.ActiveCfg = Steam|Any CPU
		{E7DE6237-AEA2-498B-8F56-9B392472C490}.Steam|Any CPU.Build.0 = Steam|Any CPU
		{DBDB0DAA-B3AE-4CC4-A8C2-20550B7F32E3}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{DBDB0DAA-B3AE-4CC4-A8C2-20550B7F32E3}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{DBDB0DAA-B3AE-4CC4-A8C2-20550B7F32E3}.MicrosoftStore|Any CPU.ActiveCfg = MicrosoftStore|Any CPU
		{DBDB0DAA-B3AE-4CC4-A8C2-20550B7F32E3}.MicrosoftStore|Any CPU.Build.0 = MicrosoftStore|Any CPU
		{DBDB0DAA-B3AE-4CC4-A8C2-20550B7F32E3}.MicrosoftStoreDebug|Any CPU.ActiveCfg = MicrosoftStoreDebug|Any CPU
		{DBDB0DAA-B3AE-4CC4-A8C2-20550B7F32E3}.MicrosoftStoreDebug|Any CPU.Build.0 = MicrosoftStoreDebug|Any CPU
		{DBDB0DAA-B3AE-4CC4-A8C2-20550B7F32E3}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{DBDB0DAA-B3AE-4CC4-A8C2-20550B7F32E3}.Release|Any CPU.Build.0 = Release|Any CPU
		{DBDB0DAA-B3AE-4CC4-A8C2-20550B7F32E3}.Steam|Any CPU.ActiveCfg = Steam|Any CPU
		{DBDB0DAA-B3AE-4CC4-A8C2-20550B7F32E3}.Steam|Any CPU.Build.0 = Steam|Any CPU
		{327750E1-9FB7-4CC3-8AEA-9BC42180CAD3}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{327750E1-9FB7-4CC3-8AEA-9BC42180CAD3}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{327750E1-9FB7-4CC3-8AEA-9BC42180CAD3}.MicrosoftStore|Any CPU.ActiveCfg = MicrosoftStore|Any CPU
		{327750E1-9FB7-4CC3-8AEA-9BC42180CAD3}.MicrosoftStore|Any CPU.Build.0 = MicrosoftStore|Any CPU
		{327750E1-9FB7-4CC3-8AEA-9BC42180CAD3}.MicrosoftStoreDebug|Any CPU.ActiveCfg = MicrosoftStoreDebug|Any CPU
		{327750E1-9FB7-4CC3-8AEA-9BC42180CAD3}.MicrosoftStoreDebug|Any CPU.Build.0 = MicrosoftStoreDebug|Any CPU
		{327750E1-9FB7-4CC3-8AEA-9BC42180CAD3}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{327750E1-9FB7-4CC3-8AEA-9BC42180CAD3}.Release|Any CPU.Build.0 = Release|Any CPU
		{327750E1-9FB7-4CC3-8AEA-9BC42180CAD3}.Steam|Any CPU.ActiveCfg = Steam|Any CPU
		{327750E1-9FB7-4CC3-8AEA-9BC42180CAD3}.Steam|Any CPU.Build.0 = Steam|Any CPU
		{E1C94415-3424-4517-A2A1-B2FDD1F59C67}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{E1C94415-3424-4517-A2A1-B2FDD1F59C67}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{E1C94415-3424-4517-A2A1-B2FDD1F59C67}.MicrosoftStore|Any CPU.ActiveCfg = MicrosoftStore|Any CPU
		{E1C94415-3424-4517-A2A1-B2FDD1F59C67}.MicrosoftStore|Any CPU.Build.0 = MicrosoftStore|Any CPU
		{E1C94415-3424-4517-A2A1-B2FDD1F59C67}.MicrosoftStoreDebug|Any CPU.ActiveCfg = MicrosoftStoreDebug|Any CPU
		{E1C94415-3424-4517-A2A1-B2FDD1F59C67}.MicrosoftStoreDebug|Any CPU.Build.0 = MicrosoftStoreDebug|Any CPU
		{E1C94415-3424-4517-A2A1-B2FDD1F59C67}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{E1C94415-3424-4517-A2A1-B2FDD1F59C67}.Release|Any CPU.Build.0 = Release|Any CPU
		{E1C94415-3424-4517-A2A1-B2FDD1F59C67}.Steam|Any CPU.ActiveCfg = Steam|Any CPU
		{E1C94415-3424-4517-A2A1-B2FDD1F59C67}.Steam|Any CPU.Build.0 = Steam|Any CPU
		{750C6F46-2C5A-4488-81D3-3B35CA50F3EE}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{750C6F46-2C5A-4488-81D3-3B35CA50F3EE}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{750C6F46-2C5A-4488-81D3-3B35CA50F3EE}.MicrosoftStore|Any CPU.ActiveCfg = MicrosoftStore|Any CPU
		{750C6F46-2C5A-4488-81D3-3B35CA50F3EE}.MicrosoftStore|Any CPU.Build.0 = MicrosoftStore|Any CPU
		{750C6F46-2C5A-4488-81D3-3B35CA50F3EE}.MicrosoftStoreDebug|Any CPU.ActiveCfg = MicrosoftStoreDebug|Any CPU
		{750C6F46-2C5A-4488-81D3-3B35CA50F3EE}.MicrosoftStoreDebug|Any CPU.Build.0 = MicrosoftStoreDebug|Any CPU
		{750C6F46-2C5A-4488-81D3-3B35CA50F3EE}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{750C6F46-2C5A-4488-81D3-3B35CA50F3EE}.Release|Any CPU.Build.0 = Release|Any CPU
		{750C6F46-2C5A-4488-81D3-3B35CA50F3EE}.Steam|Any CPU.ActiveCfg = Steam|Any CPU
		{750C6F46-2C5A-4488-81D3-3B35CA50F3EE}.Steam|Any CPU.Build.0 = Steam|Any CPU
		{D13441B6-96E1-4D1B-8A95-58A7D6CB1E24}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{D13441B6-96E1-4D1B-8A95-58A7D6CB1E24}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{D13441B6-96E1-4D1B-8A95-58A7D6CB1E24}.MicrosoftStore|Any CPU.ActiveCfg = MicrosoftStore|Any CPU
		{D13441B6-96E1-4D1B-8A95-58A7D6CB1E24}.MicrosoftStore|Any CPU.Build.0 = MicrosoftStore|Any CPU
		{D13441B6-96E1-4D1B-8A95-58A7D6CB1E24}.MicrosoftStoreDebug|Any CPU.ActiveCfg = MicrosoftStoreDebug|Any CPU
		{D13441B6-96E1-4D1B-8A95-58A7D6CB1E24}.MicrosoftStoreDebug|Any CPU.Build.0 = MicrosoftStoreDebug|Any CPU
		{D13441B6-96E1-4D1B-8A95-58A7D6CB1E24}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{D13441B6-96E1-4D1B-8A95-58A7D6CB1E24}.Release|Any CPU.Build.0 = Release|Any CPU
		{D13441B6-96E1-4D1B-8A95-58A7D6CB1E24}.Steam|Any CPU.ActiveCfg = Steam|Any CPU
		{D13441B6-96E1-4D1B-8A95-58A7D6CB1E24}.Steam|Any CPU.Build.0 = Steam|Any CPU
		{3D19A94A-7A58-4451-A686-EE70B471C206}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{3D19A94A-7A58-4451-A686-EE70B471C206}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{3D19A94A-7A58-4451-A686-EE70B471C206}.MicrosoftStore|Any CPU.ActiveCfg = MicrosoftStore|Any CPU
		{3D19A94A-7A58-4451-A686-EE70B471C206}.MicrosoftStore|Any CPU.Build.0 = MicrosoftStore|Any CPU
		{3D19A94A-7A58-4451-A686-EE70B471C206}.MicrosoftStoreDebug|Any CPU.ActiveCfg = MicrosoftStoreDebug|Any CPU
		{3D19A94A-7A58-4451-A686-EE70B471C206}.MicrosoftStoreDebug|Any CPU.Build.0 = MicrosoftStoreDebug|Any CPU
		{3D19A94A-7A58-4451-A686-EE70B471C206}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{3D19A94A-7A58-4451-A686-EE70B471C206}.Release|Any CPU.Build.0 = Release|Any CPU
		{3D19A94A-7A58-4451-A686-EE70B471C206}.Steam|Any CPU.ActiveCfg = Steam|Any CPU
		{3D19A94A-7A58-4451-A686-EE70B471C206}.Steam|Any CPU.Build.0 = Steam|Any CPU
		{1A190E53-1419-4CC2-B0E5-3BC7EA861C8B}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{1A190E53-1419-4CC2-B0E5-3BC7EA861C8B}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{1A190E53-1419-4CC2-B0E5-3BC7EA861C8B}.MicrosoftStore|Any CPU.ActiveCfg = MicrosoftStore|Any CPU
		{1A190E53-1419-4CC2-B0E5-3BC7EA861C8B}.MicrosoftStore|Any CPU.Build.0 = MicrosoftStore|Any CPU
		{1A190E53-1419-4CC2-B0E5-3BC7EA861C8B}.MicrosoftStoreDebug|Any CPU.ActiveCfg = MicrosoftStoreDebug|Any CPU
		{1A190E53-1419-4CC2-B0E5-3BC7EA861C8B}.MicrosoftStoreDebug|Any CPU.Build.0 = MicrosoftStoreDebug|Any CPU
		{1A190E53-1419-4CC2-B0E5-3BC7EA861C8B}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{1A190E53-1419-4CC2-B0E5-3BC7EA861C8B}.Release|Any CPU.Build.0 = Release|Any CPU
		{1A190E53-1419-4CC2-B0E5-3BC7EA861C8B}.Steam|Any CPU.ActiveCfg = Steam|Any CPU
		{1A190E53-1419-4CC2-B0E5-3BC7EA861C8B}.Steam|Any CPU.Build.0 = Steam|Any CPU
		{7F6ADFC5-2563-4A5F-B202-93B553578719}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{7F6ADFC5-2563-4A5F-B202-93B553578719}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{7F6ADFC5-2563-4A5F-B202-93B553578719}.MicrosoftStore|Any CPU.ActiveCfg = MicrosoftStore|Any CPU
		{7F6ADFC5-2563-4A5F-B202-93B553578719}.MicrosoftStore|Any CPU.Build.0 = MicrosoftStore|Any CPU
		{7F6ADFC5-2563-4A5F-B202-93B553578719}.MicrosoftStoreDebug|Any CPU.ActiveCfg = MicrosoftStoreDebug|Any CPU
		{7F6ADFC5-2563-4A5F-B202-93B553578719}.MicrosoftStoreDebug|Any CPU.Build.0 = MicrosoftStoreDebug|Any CPU
		{7F6ADFC5-2563-4A5F-B202-93B553578719}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{7F6ADFC5-2563-4A5F-B202-93B553578719}.Release|Any CPU.Build.0 = Release|Any CPU
		{7F6ADFC5-2563-4A5F-B202-93B553578719}.Steam|Any CPU.ActiveCfg = Steam|Any CPU
		{7F6ADFC5-2563-4A5F-B202-93B553578719}.Steam|Any CPU.Build.0 = Steam|Any CPU
		{254E398D-F7F5-4B2A-9024-5C121EA6C564}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{254E398D-F7F5-4B2A-9024-5C121EA6C564}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{254E398D-F7F5-4B2A-9024-5C121EA6C564}.MicrosoftStore|Any CPU.ActiveCfg = MicrosoftStore|Any CPU
		{254E398D-F7F5-4B2A-9024-5C121EA6C564}.MicrosoftStore|Any CPU.Build.0 = MicrosoftStore|Any CPU
		{254E398D-F7F5-4B2A-9024-5C121EA6C564}.MicrosoftStoreDebug|Any CPU.ActiveCfg = MicrosoftStoreDebug|Any CPU
		{254E398D-F7F5-4B2A-9024-5C121EA6C564}.MicrosoftStoreDebug|Any CPU.Build.0 = MicrosoftStoreDebug|Any CPU
		{254E398D-F7F5-4B2A-9024-5C121EA6C564}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{254E398D-F7F5-4B2A-9024-5C121EA6C564}.Release|Any CPU.Build.0 = Release|Any CPU
		{254E398D-F7F5-4B2A-9024-5C121EA6C564}.Steam|Any CPU.ActiveCfg = Steam|Any CPU
		{254E398D-F7F5-4B2A-9024-5C121EA6C564}.Steam|Any CPU.Build.0 = Steam|Any CPU
	EndGlobalSection
	GlobalSection(SolutionProperties) = preSolution
		HideSolutionNode = FALSE
	EndGlobalSection
	GlobalSection(ExtensibilityGlobals) = postSolution
		SolutionGuid = {DEACF1C2-28EE-44DF-B55E-2234F6137272}
	EndGlobalSection
EndGlobal
```

--------------------------------------------------------------------------------

---[FILE: FUNDING.yml]---
Location: ShareX-develop/.github/FUNDING.yml

```yaml
github: [Jaex]
```

--------------------------------------------------------------------------------

---[FILE: SECURITY.md]---
Location: ShareX-develop/.github/SECURITY.md

```text
# Security Policy

## Reporting a Vulnerability

We take the security of our project seriously. If you discover a security vulnerability, we appreciate your help in disclosing it to us in a responsible manner.

To report a security vulnerability, please follow these steps:

1. Visit our [Security Page](https://github.com/ShareX/ShareX/security) on GitHub.
2. Click on the "Report a vulnerability" button.
3. Provide a detailed description of the vulnerability, including steps to reproduce if possible.
4. Allow us a reasonable amount of time to address and mitigate the issue before disclosing it publicly.

We encourage you to play a crucial role in keeping our project secure, and we thank you for your contributions to the community.

Thank you for your cooperation.
```

--------------------------------------------------------------------------------

---[FILE: build.yml]---
Location: ShareX-develop/.github/workflows/build.yml

```yaml
name: Build ShareX

on:
  push:
    branches:
      - "**"
    tags:
      - "v[0-9]+.[0-9]+.[0-9]+"
    paths-ignore:
      - "**/*.md"
      - "**/*.gitignore"
      - "**/*.gitattributes"

permissions:
  contents: read

jobs:
  build:
    name: Build
    runs-on: windows-latest

    strategy:
      fail-fast: false
      matrix:
        configuration:
          - Release
          - Debug
          - Steam
          - MicrosoftStore
          - MicrosoftStoreDebug
        platform:
          - win-x64

    env:
      SOLUTION_FILE_PATH: ShareX.sln
      ASSEMBLY_INFO_PATH: Directory.build.props

    outputs:
      APP_VERSION: ${{ env.APP_VERSION }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 9.0.x

      - name: Set APP_VERSION
        run: |
          $content = Get-Content "${{ env.ASSEMBLY_INFO_PATH }}" -Raw
          $pattern = '<Version>([0-9]+(?:\.[0-9]+){1,3})</Version>'
          $match = [regex]::Match($content, $pattern)
          $version = $match.Groups[1].Value
          if ($env:GITHUB_REF -eq "refs/heads/develop") {
            $version = "$version.$env:GITHUB_RUN_NUMBER"
            $content = [regex]::Replace($content, $pattern, "<Version>$version</Version>")
            Set-Content -Path "${{ env.ASSEMBLY_INFO_PATH }}" -Value "$content" -NoNewline
          }
          echo $version
          echo "APP_VERSION=$version" >> $env:GITHUB_ENV

      - name: Download API keys
        env:
          API_KEYS: ${{ secrets.API_KEYS }}
        if: env.API_KEYS != ''
        working-directory: ${{ env.GITHUB_WORKSPACE }}
        run: |
          Invoke-WebRequest -Uri "$env:API_KEYS" -OutFile "ShareX.UploadersLib\APIKeys\APIKeysLocal.cs"

      - name: Restore NuGet packages
        run: dotnet restore --runtime "${{ matrix.platform }}" "${{ env.SOLUTION_FILE_PATH }}"

      - name: Build
        run: dotnet build --no-restore --configuration "${{ matrix.configuration }}" --self-contained true /m:1 "${{ env.SOLUTION_FILE_PATH }}"

      - name: Setup
        working-directory: ${{ env.GITHUB_WORKSPACE }}
        run: |
          & "ShareX.Setup\bin\${{ matrix.configuration }}\win-x64\ShareX.Setup.exe" -silent -job "${{ matrix.configuration }}"

      - name: Upload artifact (Setup)
        if: matrix.configuration == 'Release'
        uses: actions/upload-artifact@v4
        with:
          name: Setup
          path: Output\ShareX-${{ env.APP_VERSION }}-setup.exe

      - name: Upload artifact (Portable)
        if: matrix.configuration == 'Release'
        uses: actions/upload-artifact@v4
        with:
          name: Portable
          path: Output\ShareX-${{ env.APP_VERSION }}-portable.zip

      - name: Upload artifact (Debug)
        if: matrix.configuration == 'Debug'
        uses: actions/upload-artifact@v4
        with:
          name: Debug
          path: Output\ShareX-${{ env.APP_VERSION }}-debug.zip

      - name: Upload artifact (Steam)
        if: matrix.configuration == 'Steam'
        uses: actions/upload-artifact@v4
        with:
          name: Steam
          path: Output\ShareX-${{ env.APP_VERSION }}-Steam.zip

      - name: Upload artifact (MicrosoftStore)
        if: matrix.configuration == 'MicrosoftStore'
        uses: actions/upload-artifact@v4
        with:
          name: MicrosoftStore
          path: Output\ShareX-${{ env.APP_VERSION }}.appx

      - name: Upload artifact (MicrosoftStoreDebug)
        if: matrix.configuration == 'MicrosoftStoreDebug'
        uses: actions/upload-artifact@v4
        with:
          name: MicrosoftStoreDebug
          path: Output\ShareX-${{ env.APP_VERSION }}-debug.appx

  release:
    name: Release
    needs: build
    if: github.ref == 'refs/heads/develop' || startsWith(github.ref, 'refs/tags/v')
    runs-on: windows-latest

    permissions:
      contents: write

    env:
      REPO_DEV_BUILDS: ${{ github.repository_owner }}/DevBuilds
      RELEASE_BODY_PATH: RELEASE_BODY.md
      APP_VERSION: ${{ needs.build.outputs.APP_VERSION }}

    steps:
      - name: Download artifact (Setup)
        uses: actions/download-artifact@v4
        with:
          name: Setup
          path: Output

      - name: Download artifact (Portable)
        uses: actions/download-artifact@v4
        with:
          name: Portable
          path: Output

      - name: Download artifact (Debug)
        if: github.ref == 'refs/heads/develop'
        uses: actions/download-artifact@v4
        with:
          name: Debug
          path: Output

      - name: Download artifact (Steam)
        if: github.ref == 'refs/heads/develop'
        uses: actions/download-artifact@v4
        with:
          name: Steam
          path: Output

      - name: Download artifact (MicrosoftStore)
        if: github.ref == 'refs/heads/develop'
        uses: actions/download-artifact@v4
        with:
          name: MicrosoftStore
          path: Output

      - name: Download artifact (MicrosoftStoreDebug)
        if: github.ref == 'refs/heads/develop'
        uses: actions/download-artifact@v4
        with:
          name: MicrosoftStoreDebug
          path: Output

      - name: Create release body file
        run: |
          $checksums = Get-ChildItem -Path "Output\" -Recurse -File
            | Sort-Object -Property Name
            | ForEach-Object { "| $($_.Name) | ``$((Get-FileHash $_.FullName -Algorithm SHA256).Hash)`` |" }
            | Out-String
          $output = "| File | SHA256 |`r`n| --- | --- |`r`n$($checksums.Trim())"
          echo $output >> $env:GITHUB_STEP_SUMMARY
          if ($env:GITHUB_REF.StartsWith("refs/tags/v")) {
            $output = "**Changelog:** https://getsharex.com/changelog#$env:GITHUB_REF_NAME`r`n`r`n$output"
          }
          echo $output
          Set-Content -Path "${{ env.RELEASE_BODY_PATH }}" -Value "$output" -NoNewline

      - name: Release (Dev)
        env:
          CUSTOM_GITHUB_TOKEN: ${{ secrets.CUSTOM_GITHUB_TOKEN }}
        if: env.CUSTOM_GITHUB_TOKEN != '' && env.REPO_DEV_BUILDS != '' && github.ref == 'refs/heads/develop'
        uses: softprops/action-gh-release@975c1b265e11dd76618af1c374e7981f9a6ff44a
        with:
          repository: ${{ env.REPO_DEV_BUILDS }}
          token: ${{ env.CUSTOM_GITHUB_TOKEN }}
          tag_name: v${{ env.APP_VERSION }}
          name: ShareX ${{ env.APP_VERSION }} Dev
          body_path: ${{ env.RELEASE_BODY_PATH }}
          draft: false
          prerelease: false
          files: |
            Output/ShareX-${{ env.APP_VERSION }}-setup.exe
            Output/ShareX-${{ env.APP_VERSION }}-portable.zip
            Output/ShareX-${{ env.APP_VERSION }}-debug.zip
            Output/ShareX-${{ env.APP_VERSION }}-Steam.zip
            Output/ShareX-${{ env.APP_VERSION }}.appx
            Output/ShareX-${{ env.APP_VERSION }}-debug.appx

      - name: Release (Stable)
        env:
          CUSTOM_GITHUB_TOKEN: ${{ secrets.CUSTOM_GITHUB_TOKEN }}
        if: env.CUSTOM_GITHUB_TOKEN != '' && startsWith(github.ref, 'refs/tags/v')
        uses: softprops/action-gh-release@975c1b265e11dd76618af1c374e7981f9a6ff44a
        with:
          repository: ${{ github.repository }}
          token: ${{ env.CUSTOM_GITHUB_TOKEN }}
          tag_name: ${{ github.ref_name }}
          name: ShareX ${{ env.APP_VERSION }}
          body_path: ${{ env.RELEASE_BODY_PATH }}
          draft: false
          prerelease: true
          files: |
            Output/ShareX-${{ env.APP_VERSION }}-setup.exe
            Output/ShareX-${{ env.APP_VERSION }}-portable.zip
```

--------------------------------------------------------------------------------

---[FILE: pr.yml]---
Location: ShareX-develop/.github/workflows/pr.yml

```yaml
name: Build ShareX (PR)

on:
  pull_request:
    branches:
      - "**"

permissions:
  contents: read

jobs:
  build:
    name: Build
    runs-on: windows-latest

    strategy:
      fail-fast: false
      matrix:
        configuration:
          - Release
          - Debug
          - Steam
          - MicrosoftStore
          - MicrosoftStoreDebug
        platform:
          - Any CPU

    env:
      SOLUTION_FILE_PATH: ShareX.sln

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 9.0.x

      - name: Restore NuGet packages
        run: dotnet restore --runtime win-x64 "${{ env.SOLUTION_FILE_PATH }}"

      - name: Build
        run: dotnet build --no-restore --configuration "${{ matrix.configuration }}" --self-contained true /m:1 "${{ env.SOLUTION_FILE_PATH }}"
```

--------------------------------------------------------------------------------

---[FILE: stale.yml]---
Location: ShareX-develop/.github/workflows/stale.yml

```yaml
name: Close stale issues and PRs

on:
  schedule:
    - cron: "30 1 * * *"

permissions:
  issues: write
  pull-requests: write

jobs:
  stale:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/stale@v9
        with:
          stale-issue-message: ""
          stale-pr-message: ""
          days-before-issue-stale: 360
          days-before-pr-stale: 90
          days-before-issue-close: 7
          days-before-pr-close: 7
          stale-issue-label: "Stale"
          stale-pr-label: "Stale"
          exempt-issue-labels: "Bug,Enhancement"
          exempt-pr-labels: ""
          operations-per-run: 100
```

--------------------------------------------------------------------------------

---[FILE: BlobEmoji_license.txt]---
Location: ShareX-develop/Licenses/BlobEmoji_license.txt

```text
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
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
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
          wherever such third-party notices normally appear. The contents
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
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
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
      identification within third-party archives.

   Copyright 2015-2017 Google Inc. & Arjen Nienhuis
   Copyright 2017 - 2019 Blob Emoji (https://blobs.gg)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```

--------------------------------------------------------------------------------

---[FILE: DirectShow_devices_license.txt]---
Location: ShareX-develop/Licenses/DirectShow_devices_license.txt

```text
This license governs use of the accompanying software. If you use the software, you
accept this license. If you do not accept the license, do not use the software.

1. Definitions
The terms "reproduce," "reproduction," "derivative works," and "distribution" have the
same meaning here as under U.S. copyright law.
A "contribution" is the original software, or any additions or changes to the software.
A "contributor" is any person that distributes its contribution under this license.
"Licensed patents" are a contributor's patent claims that read directly on its contribution.

2. Grant of Rights
(A) Copyright Grant- Subject to the terms of this license, including the license conditions and limitations in section 3, each contributor grants you a non-exclusive, worldwide, royalty-free copyright license to reproduce its contribution, prepare derivative works of its contribution, and distribute its contribution or any derivative works that you create.
(B) Patent Grant- Subject to the terms of this license, including the license conditions and limitations in section 3, each contributor grants you a non-exclusive, worldwide, royalty-free license under its licensed patents to make, have made, use, sell, offer for sale, import, and/or otherwise dispose of its contribution in the software or derivative works of the contribution in the software.

3. Conditions and Limitations
(A) No Trademark License- This license does not grant you rights to use any contributors' name, logo, or trademarks.
(B) If you bring a patent claim against any contributor over patents that you claim are infringed by the software, your patent license from such contributor to the software ends automatically.
(C) If you distribute any portion of the software, you must retain all copyright, patent, trademark, and attribution notices that are present in the software.
(D) If you distribute any portion of the software in source code form, you may do so only under this license by including a complete copy of this license with your distribution. If you distribute any portion of the software in compiled or object code form, you may only do so under a license that complies with this license.
(E) The software is licensed "as-is." You bear the risk of using it. The contributors give no express warranties, guarantees or conditions. You may have additional consumer rights under your local laws which this license cannot change. To the extent permitted under your local laws, the contributors exclude the implied warranties of merchantability, fitness for a particular purpose and non-infringement.
```

--------------------------------------------------------------------------------

````
