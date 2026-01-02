---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 19
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 19 of 552)

````text
================================================================================
FULLSTACK USER CREATED CODE DATABASE (VERBATIM) - vscode-main
================================================================================
Generated: December 18, 2025
Source: user_created_projects/vscode-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: build/win32/explorer-dll-fetcher.ts]---
Location: vscode-main/build/win32/explorer-dll-fetcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import fs from 'fs';
import debug from 'debug';
import path from 'path';
import { downloadArtifact } from '@electron/get';
import productJson from '../../product.json' with { type: 'json' };

interface ProductConfiguration {
	quality?: string;
	[key: string]: unknown;
}

const product: ProductConfiguration = productJson;

const d = debug('explorer-dll-fetcher');

export async function downloadExplorerDll(outDir: string, quality: string = 'stable', targetArch: string = 'x64'): Promise<void> {
	const fileNamePrefix = quality === 'insider' ? 'code_insider' : 'code';
	const fileName = `${fileNamePrefix}_explorer_command_${targetArch}.dll`;

	if (!await fs.existsSync(outDir)) {
		await fs.mkdirSync(outDir, { recursive: true });
	}

	// Read and parse checksums file
	const checksumsFilePath = path.join(path.dirname(import.meta.dirname), 'checksums', 'explorer-dll.txt');
	const checksumsContent = fs.readFileSync(checksumsFilePath, 'utf8');
	const checksums: Record<string, string> = {};

	checksumsContent.split('\n').forEach(line => {
		const trimmedLine = line.trim();
		if (trimmedLine) {
			const [checksum, filename] = trimmedLine.split(/\s+/);
			if (checksum && filename) {
				checksums[filename] = checksum;
			}
		}
	});

	d(`downloading ${fileName}`);
	const artifact = await downloadArtifact({
		isGeneric: true,
		version: 'v5.0.0-377200',
		artifactName: fileName,
		checksums,
		mirrorOptions: {
			mirror: 'https://github.com/microsoft/vscode-explorer-command/releases/download/',
			customDir: 'v5.0.0-377200',
			customFilename: fileName
		}
	});

	d(`moving ${artifact} to ${outDir}`);
	await fs.copyFileSync(artifact, path.join(outDir, fileName));
}

async function main(outputDir?: string): Promise<void> {
	const arch = process.env['VSCODE_ARCH'];

	if (!outputDir) {
		throw new Error('Required build env not set');
	}

	await downloadExplorerDll(outputDir, product.quality, arch);
}

if (import.meta.main) {
	main(process.argv[2]).catch(err => {
		console.error(err);
		process.exit(1);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/Default.hu.isl]---
Location: vscode-main/build/win32/i18n/Default.hu.isl

```text
;Inno Setup version 6.0.3+ Hungarian messages
;Based on the translation of Korn�l P�l, kornelpal@gmail.com
;Istv�n Szab�, E-mail: istvanszabo890629@gmail.com
;
; To download user-contributed translations of this file, go to:
;   http://www.jrsoftware.org/files/istrans/
;
; Note: When translating this text, do not add periods (.) to the end of
; messages that didn't have them already, because on those messages Inno
; Setup adds the periods automatically (appending a period would result in
; two periods being displayed).

[LangOptions]
; The following three entries are very important. Be sure to read and 
; understand the '[LangOptions] section' topic in the help file.
LanguageName=Magyar
LanguageID=$040E
LanguageCodePage=1250
; If the language you are translating to requires special font faces or
; sizes, uncomment any of the following entries and change them accordingly.
;DialogFontName=
;DialogFontSize=8
;WelcomeFontName=Verdana
;WelcomeFontSize=12
;TitleFontName=Arial CE
;TitleFontSize=29
;CopyrightFontName=Arial CE
;CopyrightFontSize=8

[Messages]

; *** Application titles
SetupAppTitle=Telep�t�
SetupWindowTitle=%1 - Telep�t�
UninstallAppTitle=Elt�vol�t�
UninstallAppFullTitle=%1 Elt�vol�t�

; *** Misc. common
InformationTitle=Inform�ci�k
ConfirmTitle=Meger�s�t
ErrorTitle=Hiba

; *** SetupLdr messages
SetupLdrStartupMessage=%1 telep�tve lesz. Szeretn� folytatni?
LdrCannotCreateTemp=�tmeneti f�jl l�trehoz�sa nem lehets�ges. A telep�t�s megszak�tva
LdrCannotExecTemp=F�jl futtat�sa nem lehets�ges az �tmeneti k�nyvt�rban. A telep�t�s megszak�tva
HelpTextNote=

; *** Startup error messages
LastErrorMessage=%1.%n%nHiba %2: %3
SetupFileMissing=A(z) %1 f�jl hi�nyzik a telep�t� k�nyvt�r�b�l. K�rem h�r�tsa el a probl�m�t, vagy szerezzen be egy m�sik p�ld�nyt a programb�l!
SetupFileCorrupt=A telep�t�si f�jlok s�r�ltek. K�rem, szerezzen be �j m�solatot a programb�l!
SetupFileCorruptOrWrongVer=A telep�t�si f�jlok s�r�ltek, vagy inkompatibilisek a telep�t� ezen verzi�j�val. H�r�tsa el a probl�m�t, vagy szerezzen be egy m�sik p�ld�nyt a programb�l!
InvalidParameter=A parancssorba �tadott param�ter �rv�nytelen:%n%n%1
SetupAlreadyRunning=A Telep�t� m�r fut.
WindowsVersionNotSupported=A program nem t�mogatja a Windows ezen verzi�j�t.
WindowsServicePackRequired=A program futtat�s�hoz %1 Service Pack %2 vagy �jabb sz�ks�ges.
NotOnThisPlatform=Ez a program nem futtathat� %1 alatt.
OnlyOnThisPlatform=Ezt a programot %1 alatt kell futtatni.
OnlyOnTheseArchitectures=A program kiz�r�lag a k�vetkez� processzor architekt�r�khoz tervezett Windows-on telep�thet�:%n%n%1
WinVersionTooLowError=A program futtat�s�hoz %1 %2 verzi�ja vagy k�s�bbi sz�ks�ges.
WinVersionTooHighError=Ez a program nem telep�thet� %1 %2 vagy k�s�bbire.
AdminPrivilegesRequired=Csak rendszergazdai m�dban telep�thet� ez a program.
PowerUserPrivilegesRequired=Csak rendszergazdak�nt vagy kiemelt felhaszn�l�k�nt telep�thet� ez a program.
SetupAppRunningError=A telep�t� �gy �szlelte %1 jelenleg fut.%n%nZ�rja be az �sszes p�ld�nyt, majd kattintson az 'OK'-ra a folytat�shoz, vagy a 'M�gse'-re a kil�p�shez.
UninstallAppRunningError=Az elt�vol�t� �gy �szlelte %1 jelenleg fut.%n%nZ�rja be az �sszes p�ld�nyt, majd kattintson az 'OK'-ra a folytat�shoz, vagy a 'M�gse'-re a kil�p�shez.

; *** Startup questions
PrivilegesRequiredOverrideTitle=Telep�t�si m�d kiv�laszt�sa
PrivilegesRequiredOverrideInstruction=V�lasszon telep�t�si m�dot
PrivilegesRequiredOverrideText1=%1 telep�thet� az �sszes felhaszn�l�nak (rendszergazdai jogok sz�ks�gesek), vagy csak mag�nak.
PrivilegesRequiredOverrideText2=%1 csak mag�nak telep�thet�, vagy az �sszes felhaszn�l�nak (rendszergazdai jogok sz�ks�gesek).
PrivilegesRequiredOverrideAllUsers=Telep�t�s &mindenkinek
PrivilegesRequiredOverrideAllUsersRecommended=Telep�t�s &mindenkinek (aj�nlott)
PrivilegesRequiredOverrideCurrentUser=Telep�t�s csak &nekem
PrivilegesRequiredOverrideCurrentUserRecommended=Telep�t�s csak &nekem (aj�nlott)

; *** Misc. errors
ErrorCreatingDir=A Telep�t� nem tudta l�trehozni a(z) "%1" k�nyvt�rat
ErrorTooManyFilesInDir=Nem hozhat� l�tre f�jl a(z) "%1" k�nyvt�rban, mert az m�r t�l sok f�jlt tartalmaz

; *** Setup common messages
ExitSetupTitle=Kil�p�s a telep�t�b�l
ExitSetupMessage=A telep�t�s m�g folyamatban van. Ha most kil�p, a program nem ker�l telep�t�sre.%n%nM�sik alkalommal is futtathat� a telep�t�s befejez�s�hez%n%nKil�p a telep�t�b�l?
AboutSetupMenuItem=&N�vjegy...
AboutSetupTitle=Telep�t� n�vjegye
AboutSetupMessage=%1 %2 verzi�%n%3%n%nAz %1 honlapja:%n%4
AboutSetupNote=
TranslatorNote=

; *** Buttons
ButtonBack=< &Vissza
ButtonNext=&Tov�bb >
ButtonInstall=&Telep�t
ButtonOK=OK
ButtonCancel=M�gse
ButtonYes=&Igen
ButtonYesToAll=&Mindet
ButtonNo=&Nem
ButtonNoToAll=&Egyiket se
ButtonFinish=&Befejez�s
ButtonBrowse=&Tall�z�s...
ButtonWizardBrowse=T&all�z�s...
ButtonNewFolder=�j &k�nyvt�r

; *** "Select Language" dialog messages
SelectLanguageTitle=Telep�t� nyelvi be�ll�t�s
SelectLanguageLabel=V�lassza ki a telep�t�s alatt haszn�lt nyelvet.

; *** Common wizard text
ClickNext=A folytat�shoz kattintson a 'Tov�bb'-ra, a kil�p�shez a 'M�gse'-re.
BeveledLabel=
BrowseDialogTitle=V�lasszon k�nyvt�rt 
BrowseDialogLabel=V�lasszon egy k�nyvt�rat az al�bbi list�b�l, majd kattintson az 'OK'-ra.
NewFolderName=�j k�nyvt�r

; *** "Welcome" wizard page
WelcomeLabel1=�dv�zli a(z) [name] Telep�t�var�zsl�ja.
WelcomeLabel2=A(z) [name/ver] telep�t�sre ker�l a sz�m�t�g�p�n.%n%nAj�nlott minden, egy�b fut� alkalmaz�s bez�r�sa a folytat�s el�tt.

; *** "Password" wizard page
WizardPassword=Jelsz�
PasswordLabel1=Ez a telep�t�s jelsz�val v�dett.
PasswordLabel3=K�rem adja meg a jelsz�t, majd kattintson a 'Tov�bb'-ra. A jelszavak kis- �s nagy bet� �rz�kenyek lehetnek.
PasswordEditLabel=&Jelsz�:
IncorrectPassword=Az �n �ltal megadott jelsz� helytelen. Pr�b�lja �jra.

; *** "License Agreement" wizard page
WizardLicense=Licencszerz�d�s
LicenseLabel=Olvassa el figyelmesen az inform�ci�kat folytat�s el�tt.
LicenseLabel3=K�rem, olvassa el az al�bbi licencszerz�d�st. A telep�t�s folytat�s�hoz, el kell fogadnia a szerz�d�st.
LicenseAccepted=&Elfogadom a szerz�d�st
LicenseNotAccepted=&Nem fogadom el a szerz�d�st

; *** "Information" wizard pages
WizardInfoBefore=Inform�ci�k
InfoBeforeLabel=Olvassa el a k�vetkez� fontos inform�ci�kat a folytat�s el�tt.
InfoBeforeClickLabel=Ha k�szen �ll, kattintson a 'Tov�bb'-ra.
WizardInfoAfter=Inform�ci�k
InfoAfterLabel=Olvassa el a k�vetkez� fontos inform�ci�kat a folytat�s el�tt.
InfoAfterClickLabel=Ha k�szen �ll, kattintson a 'Tov�bb'-ra.

; *** "User Information" wizard page
WizardUserInfo=Felhaszn�l� adatai
UserInfoDesc=K�rem, adja meg az adatait
UserInfoName=&Felhaszn�l�n�v:
UserInfoOrg=&Szervezet:
UserInfoSerial=&Sorozatsz�m:
UserInfoNameRequired=Meg kell adnia egy nevet.

; *** "Select Destination Location" wizard page
WizardSelectDir=V�lasszon c�lk�nyvt�rat
SelectDirDesc=Hova telep�lj�n a(z) [name]?
SelectDirLabel3=A(z) [name] az al�bbi k�nyvt�rba lesz telep�tve. 
SelectDirBrowseLabel=A folytat�shoz, kattintson a 'Tov�bb'-ra. Ha m�sik k�nyvt�rat v�lasztana, kattintson a 'Tall�z�s'-ra.
DiskSpaceGBLabel=At least [gb] GB szabad ter�letre van sz�ks�g.
DiskSpaceMBLabel=Legal�bb [mb] MB szabad ter�letre van sz�ks�g.
CannotInstallToNetworkDrive=A Telep�t� nem tud h�l�zati meghajt�ra telep�teni.
CannotInstallToUNCPath=A Telep�t� nem tud h�l�zati UNC el�r�si �tra telep�teni.
InvalidPath=Teljes �tvonalat adjon meg, a meghajt� bet�jel�vel; p�ld�ul:%n%nC:\Alkalmaz�s%n%nvagy egy h�l�zati �tvonalat a k�vetkez� alakban:%n%n\\kiszolg�l�\megoszt�s
InvalidDrive=A kiv�lasztott meghajt� vagy h�l�zati megoszt�s nem l�tezik vagy nem el�rhet�. V�lasszon egy m�sikat.
DiskSpaceWarningTitle=Nincs el�g szabad ter�let
DiskSpaceWarning=A Telep�t�nek legal�bb %1 KB szabad lemezter�letre van sz�ks�ge, viszont a kiv�lasztott meghajt�n csup�n %2 KB �ll rendelkez�sre.%n%nMindenk�ppen folytatja?
DirNameTooLong=A k�nyvt�r neve vagy az �tvonal t�l hossz�.
InvalidDirName=A k�nyvt�r neve �rv�nytelen.
BadDirName32=A k�nyvt�rak nevei ezen karakterek egyik�t sem tartalmazhatj�k:%n%n%1
DirExistsTitle=A k�nyvt�r m�r l�tezik
DirExists=A k�nyvt�r:%n%n%1%n%nm�r l�tezik. Mindenk�pp ide akar telep�teni?
DirDoesntExistTitle=A k�nyvt�r nem l�tezik
DirDoesntExist=A k�nyvt�r:%n%n%1%n%nnem l�tezik. Szeretn� l�trehozni?

; *** "Select Components" wizard page
WizardSelectComponents=�sszetev�k kiv�laszt�sa
SelectComponentsDesc=Mely �sszetev�k ker�ljenek telep�t�sre?
SelectComponentsLabel2=Jel�lje ki a telep�tend� �sszetev�ket; t�r�lje a telep�teni nem k�v�nt �sszetev�ket. Kattintson a 'Tov�bb'-ra, ha k�szen �ll a folytat�sra.
FullInstallation=Teljes telep�t�s
; if possible don't translate 'Compact' as 'Minimal' (I mean 'Minimal' in your language)
CompactInstallation=Szok�sos telep�t�s
CustomInstallation=Egy�ni telep�t�s
NoUninstallWarningTitle=L�tez� �sszetev�
NoUninstallWarning=A telep�t� �gy tal�lta, hogy a k�vetkez� �sszetev�k m�r telep�tve vannak a sz�m�t�g�pre:%n%n%1%n%nEzen �sszetev�k kijel�l�s�nek t�rl�se, nem t�vol�tja el azokat a sz�m�t�g�pr�l.%n%nMindenk�ppen folytatja?
ComponentSize1=%1 KB
ComponentSize2=%1 MB
ComponentsDiskSpaceMBLabel=A jelenlegi kijel�l�s legal�bb [gb] GB lemezter�letet ig�nyel.
ComponentsDiskSpaceMBLabel=A jelenlegi kijel�l�s legal�bb [mb] MB lemezter�letet ig�nyel.

; *** "Select Additional Tasks" wizard page
WizardSelectTasks=Tov�bbi feladatok
SelectTasksDesc=Mely kieg�sz�t� feladatok ker�ljenek v�grehajt�sra?
SelectTasksLabel2=Jel�lje ki, mely kieg�sz�t� feladatokat hajtsa v�gre a Telep�t� a(z) [name] telep�t�se sor�n, majd kattintson a 'Tov�bb'-ra.

; *** "Select Start Menu Folder" wizard page
WizardSelectProgramGroup=Start Men� k�nyvt�ra
SelectStartMenuFolderDesc=Hova helyezze a Telep�t� a program parancsikonjait?
SelectStartMenuFolderLabel3=A Telep�t� a program parancsikonjait a Start men� k�vetkez� mapp�j�ban fogja l�trehozni.
SelectStartMenuFolderBrowseLabel=A folytat�shoz kattintson a 'Tov�bb'-ra. Ha m�sik mapp�t v�lasztana, kattintson a 'Tall�z�s'-ra.
MustEnterGroupName=Meg kell adnia egy mappanevet.
GroupNameTooLong=A k�nyvt�r neve vagy az �tvonal t�l hossz�.
InvalidGroupName=A k�nyvt�r neve �rv�nytelen.
BadGroupName=A k�nyvt�rak nevei ezen karakterek egyik�t sem tartalmazhatj�k:%n%n%1
NoProgramGroupCheck2=&Ne hozzon l�tre mapp�t a Start men�ben

; *** "Ready to Install" wizard page
WizardReady=K�szen �llunk a telep�t�sre
ReadyLabel1=A Telep�t� k�szen �ll, a(z) [name] sz�m�t�g�pre telep�t�shez.
ReadyLabel2a=Kattintson a 'Telep�t�s'-re a folytat�shoz, vagy a "Vissza"-ra a be�ll�t�sok �ttekint�s�hez vagy megv�ltoztat�s�hoz.
ReadyLabel2b=Kattintson a 'Telep�t�s'-re a folytat�shoz.
ReadyMemoUserInfo=Felhaszn�l� adatai:
ReadyMemoDir=Telep�t�s c�lk�nyvt�ra:
ReadyMemoType=Telep�t�s t�pusa:
ReadyMemoComponents=V�lasztott �sszetev�k:
ReadyMemoGroup=Start men� mapp�ja:
ReadyMemoTasks=Kieg�sz�t� feladatok:

; *** "Preparing to Install" wizard page
WizardPreparing=Felk�sz�l�s a telep�t�sre
PreparingDesc=A Telep�t� felk�sz�l a(z) [name] sz�m�t�g�pre t�rt�n� telep�t�shez.
PreviousInstallNotCompleted=gy kor�bbi program telep�t�se/elt�vol�t�sa nem fejez�d�tt be. �jra kell ind�tania a sz�m�t�g�p�t a m�sik telep�t�s befejez�s�hez.%n%nA sz�m�t�g�pe �jraind�t�sa ut�n ism�t futtassa a Telep�t�t a(z) [name] telep�t�s�nek befejez�s�hez.
CannotContinue=A telep�t�s nem folytathat�. A kil�p�shez kattintson a 'M�gse'-re
ApplicationsFound=A k�vetkez� alkalmaz�sok olyan f�jlokat haszn�lnak, amelyeket a Telep�t�nek friss�teni kell. Aj�nlott, hogy enged�lyezze a Telep�t�nek ezen alkalmaz�sok automatikus bez�r�s�t.
ApplicationsFound2=A k�vetkez� alkalmaz�sok olyan f�jlokat haszn�lnak, amelyeket a Telep�t�nek friss�teni kell. Aj�nlott, hogy enged�lyezze a Telep�t�nek ezen alkalmaz�sok automatikus bez�r�s�t. A telep�t�s befejez�se ut�n a Telep�t� megk�s�rli az alkalmaz�sok �jraind�t�s�t.
CloseApplications=&Alkalmaz�sok automatikus bez�r�sa
DontCloseApplications=&Ne z�rja be az alkalmaz�sokat
ErrorCloseApplications=A Telep�t� nem tudott minden alkalmaz�st automatikusan bez�rni. A folytat�s el�tt aj�nlott minden, a Telep�t� �ltal friss�tend� f�jlokat haszn�l� alkalmaz�st bez�rni.
PrepareToInstallNeedsRestart=A telep�t�nek �jra kell ind�tania a sz�m�t�g�pet. �jraind�t�st k�vet�en, futtassa �jb�l a telep�t�t, a [name] telep�t�s�nek befejez�s�hez .%n%n�jra szeretn� ind�tani most a sz�m�t�g�pet?

; *** "Installing" wizard page
WizardInstalling=Telep�t�s
InstallingLabel=K�rem v�rjon, am�g a(z) [name] telep�t�se zajlik.

; *** "Setup Completed" wizard page
FinishedHeadingLabel=A(z) [name] telep�t�s�nek befejez�se
FinishedLabelNoIcons=A Telep�t� v�gzett a(z) [name] telep�t�s�vel.
FinishedLabel=A Telep�t� v�gzett a(z) [name] telep�t�s�vel. Az alkalmaz�st a l�trehozott ikonok kiv�laszt�s�val ind�thatja.
ClickFinish=Kattintson a 'Befejez�s'-re a kil�p�shez.
FinishedRestartLabel=A(z) [name] telep�t�s�nek befejez�s�hez �jra kell ind�tani a sz�m�t�g�pet. �jraind�tja most?
FinishedRestartMessage=A(z) [name] telep�t�s�nek befejez�s�hez, a Telep�t�nek �jra kell ind�tani a sz�m�t�g�pet.%n%n�jraind�tja most?
ShowReadmeCheck=Igen, szeretn�m elolvasni a FONTOS f�jlt
YesRadio=&Igen, �jraind�t�s most
NoRadio=&Nem, k�s�bb ind�tom �jra
; used for example as 'Run MyProg.exe'
RunEntryExec=%1 futtat�sa
; used for example as 'View Readme.txt'
RunEntryShellExec=%1 megtekint�se

; *** "Setup Needs the Next Disk" stuff
ChangeDiskTitle=A Telep�t�nek sz�ks�ge van a k�vetkez� lemezre
SelectDiskLabel2=Helyezze be a(z) %1. lemezt �s kattintson az 'OK'-ra.%n%nHa a f�jlok a lemez egy a megjelen�tett�l k�l�nb�z� mapp�j�ban tal�lhat�k, �rja be a helyes �tvonalat vagy kattintson a 'Tall�z�s'-ra.
PathLabel=�&tvonal:
FileNotInDir2=A(z) "%1" f�jl nem tal�lhat� a k�vetkez� helyen: "%2". Helyezze be a megfelel� lemezt vagy v�lasszon egy m�sik mapp�t.
SelectDirectoryLabel=Adja meg a k�vetkez� lemez hely�t.

; *** Installation phase messages
SetupAborted=A telep�t�s nem fejez�d�tt be.%n%nH�r�tsa el a hib�t �s futtassa �jb�l a Telep�t�t.
AbortRetryIgnoreSelectAction=V�lasszon m�veletet
AbortRetryIgnoreRetry=&�jra
AbortRetryIgnoreIgnore=&Hiba elvet�se �s folytat�s
AbortRetryIgnoreCancel=Telep�t�s megszak�t�sa

; *** Installation status messages
StatusClosingApplications=Alkalmaz�sok bez�r�sa...
StatusCreateDirs=K�nyvt�rak l�trehoz�sa...
StatusExtractFiles=F�jlok kibont�sa...
StatusCreateIcons=Parancsikonok l�trehoz�sa...
StatusCreateIniEntries=INI bejegyz�sek l�trehoz�sa...
StatusCreateRegistryEntries=Rendszerle�r� bejegyz�sek l�trehoz�sa...
StatusRegisterFiles=F�jlok regisztr�l�sa...
StatusSavingUninstall=Elt�vol�t� inform�ci�k ment�se...
StatusRunProgram=Telep�t�s befejez�se...
StatusRestartingApplications=Alkalmaz�sok �jraind�t�sa...
StatusRollback=V�ltoztat�sok visszavon�sa...

; *** Misc. errors
ErrorInternal2=Bels� hiba: %1
ErrorFunctionFailedNoCode=Sikertelen %1
ErrorFunctionFailed=Sikertelen %1; k�d: %2
ErrorFunctionFailedWithMessage=Sikertelen %1; k�d: %2.%n%3
ErrorExecutingProgram=Nem hajthat� v�gre a f�jl:%n%1

; *** Registry errors
ErrorRegOpenKey=Nem nyithat� meg a rendszerle�r� kulcs:%n%1\%2
ErrorRegCreateKey=Nem hozhat� l�tre a rendszerle�r� kulcs:%n%1\%2
ErrorRegWriteKey=Nem m�dos�that� a rendszerle�r� kulcs:%n%1\%2

; *** INI errors
ErrorIniEntry=Bejegyz�s l�trehoz�sa sikertelen a k�vetkez� INI f�jlban: "%1".

; *** File copying errors
FileAbortRetryIgnoreSkipNotRecommended=&F�jl kihagy�sa (nem aj�nlott)
FileAbortRetryIgnoreIgnoreNotRecommended=&Hiba elvet�se �s folytat�s (nem aj�nlott)
SourceIsCorrupted=A forr�sf�jl megs�r�lt
SourceDoesntExist=A(z) "%1" forr�sf�jl nem l�tezik
ExistingFileReadOnly2=A f�jl csak olvashat�k�nt van jel�lve.
ExistingFileReadOnlyRetry=Csak &olvashat� tulajdons�g elt�vol�t�sa �s �jra pr�b�lkoz�s 
ExistingFileReadOnlyKeepExisting=&L�tez� f�jl megtart�sa
ErrorReadingExistingDest=Hiba l�pett fel a f�jl olvas�sa k�zben:
FileExists=A f�jl m�r l�tezik.%n%nFel�l k�v�nja �rni?
ExistingFileNewer=A l�tez� f�jl �jabb a telep�t�sre ker�l�n�l. Aj�nlott a l�tez� f�jl megtart�sa.%n%nMeg k�v�nja tartani a l�tez� f�jlt?
ErrorChangingAttr=Hiba l�pett fel a f�jl attrib�tum�nak m�dos�t�sa k�zben:
ErrorCreatingTemp=Hiba l�pett fel a f�jl telep�t�si k�nyvt�rban t�rt�n� l�trehoz�sa k�zben:
ErrorReadingSource=Hiba l�pett fel a forr�sf�jl olvas�sa k�zben:
ErrorCopying=Hiba l�pett fel a f�jl m�sol�sa k�zben:
ErrorReplacingExistingFile=Hiba l�pett fel a l�tez� f�jl cser�je k�zben:
ErrorRestartReplace=A f�jl cser�je az �jraind�t�s ut�n sikertelen volt:
ErrorRenamingTemp=Hiba l�pett fel f�jl telep�t�si k�nyvt�rban t�rt�n� �tnevez�se k�zben:
ErrorRegisterServer=Nem lehet regisztr�lni a DLL-t/OCX-et: %1
ErrorRegSvr32Failed=Sikertelen RegSvr32. A visszaadott k�d: %1
ErrorRegisterTypeLib=Nem lehet regisztr�lni a t�pust�rat: %1

; *** Uninstall display name markings
; used for example as 'My Program (32-bit)'
UninstallDisplayNameMark=%1 (%2)
; used for example as 'My Program (32-bit, All users)'
UninstallDisplayNameMarks=%1 (%2, %3)
UninstallDisplayNameMark32Bit=32-bit
UninstallDisplayNameMark64Bit=64-bit
UninstallDisplayNameMarkAllUsers=Minden felhaszn�l�
UninstallDisplayNameMarkCurrentUser=Jelenlegi felhaszn�l�

; *** Post-installation errors
ErrorOpeningReadme=Hiba l�pett fel a FONTOS f�jl megnyit�sa k�zben.
ErrorRestartingComputer=A Telep�t� nem tudta �jraind�tani a sz�m�t�g�pet. Ind�tsa �jra k�zileg.

; *** Uninstaller messages
UninstallNotFound=A(z) "%1" f�jl nem l�tezik. Nem t�vol�that� el.
UninstallOpenError=A(z) "%1" f�jl nem nyithat� meg. Nem t�vol�that� el.
UninstallUnsupportedVer=A(z) "%1" elt�vol�t�si napl�f�jl form�tum�t nem tudja felismerni az elt�vol�t� jelen verzi�ja. Az elt�vol�t�s nem folytathat�
UninstallUnknownEntry=Egy ismeretlen bejegyz�s (%1) tal�lhat� az elt�vol�t�si napl�f�jlban
ConfirmUninstall=Biztosan el k�v�nja t�vol�tani a(z) %1 programot �s minden �sszetev�j�t?
UninstallOnlyOnWin64=Ezt a telep�t�st csak 64-bites Windowson lehet elt�vol�tani.
OnlyAdminCanUninstall=Ezt a telep�t�st csak adminisztr�ci�s jogokkal rendelkez� felhaszn�l� t�vol�thatja el.
UninstallStatusLabel=Legyen t�relemmel, am�g a(z) %1 sz�m�t�g�p�r�l t�rt�n� elt�vol�t�sa befejez�dik.
UninstalledAll=A(z) %1 sikeresen el lett t�vol�tva a sz�m�t�g�pr�l.
UninstalledMost=A(z) %1 elt�vol�t�sa befejez�d�tt.%n%nN�h�ny elemet nem lehetett elt�vol�tani. T�r�lje k�zileg.
UninstalledAndNeedsRestart=A(z) %1 elt�vol�t�s�nak befejez�s�hez �jra kell ind�tania a sz�m�t�g�p�t.%n%n�jraind�tja most?
UninstallDataCorrupted=A(z) "%1" f�jl s�r�lt. Nem t�vol�that� el.

; *** Uninstallation phase messages
ConfirmDeleteSharedFileTitle=T�rli a megosztott f�jlt?
ConfirmDeleteSharedFile2=A rendszer azt jelzi, hogy a k�vetkez� megosztott f�jlra m�r nincs sz�ks�ge egyetlen programnak sem. Elt�vol�tja a megosztott f�jlt?%n%nHa m�s programok m�g mindig haszn�lj�k a megosztott f�jlt, akkor az elt�vol�t�sa ut�n lehet, hogy nem fognak megfelel�en m�k�dni. Ha bizonytalan, v�lassza a Nemet. A f�jl megtart�sa nem okoz probl�m�t a rendszerben.
SharedFileNameLabel=F�jln�v:
SharedFileLocationLabel=Helye:
WizardUninstalling=Elt�vol�t�s �llapota
StatusUninstalling=%1 elt�vol�t�sa...

; *** Shutdown block reasons
ShutdownBlockReasonInstallingApp=%1 telep�t�se.
ShutdownBlockReasonUninstallingApp=%1 elt�vol�t�sa.

; The custom messages below aren't used by Setup itself, but if you make
; use of them in your scripts, you'll want to translate them.

[CustomMessages]

NameAndVersion=%1, verzi�: %2
AdditionalIcons=Tov�bbi parancsikonok:
CreateDesktopIcon=&Asztali ikon l�trehoz�sa
CreateQuickLaunchIcon=&Gyorsind�t� parancsikon l�trehoz�sa
ProgramOnTheWeb=%1 az interneten
UninstallProgram=Elt�vol�t�s - %1
LaunchProgram=Ind�t�s %1
AssocFileExtension=A(z) %1 &t�rs�t�sa a(z) %2 f�jlkiterjeszt�ssel
AssocingFileExtension=A(z) %1 t�rs�t�sa a(z) %2 f�jlkiterjeszt�ssel...
AutoStartProgramGroupDescription=Ind�t�pult:
AutoStartProgram=%1 automatikus ind�t�sa
AddonHostProgramNotFound=A(z) %1 nem tal�lhat� a kiv�lasztott k�nyvt�rban.%n%nMindenk�ppen folytatja?
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/Default.ko.isl]---
Location: vscode-main/build/win32/i18n/Default.ko.isl

```text
; *** Inno Setup version 6.0.0+ Korean messages ***
;
; �� 6.0.3+ Translator: SungDong Kim (acroedit@gmail.com)
; �� 5.5.3+ Translator: Domddol (domddol@gmail.com)
; �� Translation date: MAR 04, 2014
; �� Contributors: Hansoo KIM (iryna7@gmail.com), Woong-Jae An (a183393@hanmail.net)
; �� Storage: http://www.jrsoftware.org/files/istrans/
; �� �� ������ ���ο� �ѱ��� ����� ��Ģ�� �ؼ��մϴ�.
; Note: When translating this text, do not add periods (.) to the end of
; messages that didn't have them already, because on those messages Inno
; Setup adds the periods automatically (appending a period would result in
; two periods being displayed).

[LangOptions]
; The following three entries are very important. Be sure to read and 
; understand the '[LangOptions] section' topic in the help file.
LanguageName=Korean
LanguageID=$0412
LanguageCodePage=949
; If the language you are translating to requires special font faces or
; sizes, uncomment any of the following entries and change them accordingly.
;DialogFontName=
;DialogFontSize=8
;WelcomeFontName=Verdana
;WelcomeFontSize=12
;TitleFontName=Arial
;TitleFontSize=29
;CopyrightFontName=Arial
;CopyrightFontSize=8

[Messages]

; *** Application titles
SetupAppTitle=��ġ
SetupWindowTitle=%1 ��ġ
UninstallAppTitle=����
UninstallAppFullTitle=%1 ����

; *** Misc. common
InformationTitle=����
ConfirmTitle=Ȯ��
ErrorTitle=����

; *** SetupLdr messages
SetupLdrStartupMessage=%1��(��) ��ġ�մϴ�, ����Ͻðڽ��ϱ�?
LdrCannotCreateTemp=�ӽ� ������ ���� �� �����ϴ�, ��ġ�� �ߴ��մϴ�
LdrCannotExecTemp=�ӽ� ������ ������ ������ �� �����ϴ�, ��ġ�� �ߴ��մϴ�
HelpTextNote=

; *** Startup error messages
LastErrorMessage=%1.%n%n���� %2: %3
SetupFileMissing=%1 ������ �������� �ʽ��ϴ�, ������ �ذ��� ���ų� ���ο� ��ġ ���α׷��� ���Ͻñ� �ٶ��ϴ�.
SetupFileCorrupt=��ġ ������ �ջ�Ǿ����ϴ�, ���ο� ��ġ ���α׷��� ���Ͻñ� �ٶ��ϴ�.
SetupFileCorruptOrWrongVer=��ġ ������ �ջ��̰ų� �� ��ġ ������ ȣȯ���� �ʽ��ϴ�, ������ �ذ��� ���ų� ���ο� ��ġ ���α׷��� ���Ͻñ� �ٶ��ϴ�.
InvalidParameter=�߸��� �Ű� �����Դϴ�:%n%n%1
SetupAlreadyRunning=��ġ�� �̹� ���� ���Դϴ�.
WindowsVersionNotSupported=�� ���α׷��� ������ Windows ������ �������� �ʽ��ϴ�.
WindowsServicePackRequired=�� ���α׷��� �����Ϸ��� %1 sp%2 �̻��̾�� �մϴ�.
NotOnThisPlatform=�� ���α׷��� %1���� �۵����� �ʽ��ϴ�.
OnlyOnThisPlatform=�� ���α׷��� %1���� �����ؾ� �մϴ�.
OnlyOnTheseArchitectures=�� ���α׷��� �Ʒ� ó�� ������ ȣȯ�Ǵ� Windows �������� ��ġ�� �� �ֽ��ϴ�:%n%n%1
WinVersionTooLowError=�� ���α׷��� %1 ���� %2 �̻��� �ʿ��մϴ�.
WinVersionTooHighError=�� ���α׷��� %1 ���� %2 �̻󿡼� ��ġ�� �� �����ϴ�.
AdminPrivilegesRequired=�� ���α׷��� ��ġ�Ϸ��� �����ڷ� �α����ؾ� �մϴ�.
PowerUserPrivilegesRequired=�� ���α׷��� ��ġ�Ϸ��� ������ �Ǵ� ��� ����ڷ� �α����ؾ� �մϴ�.
SetupAppRunningError=���� %1��(��) ���� ���Դϴ�!%n%n���� �װ��� ��� �ν��Ͻ��� �ݾ� �ֽʽÿ�. �׷� ���� ����Ϸ��� "Ȯ��"��, �����Ϸ��� "���"�� Ŭ���Ͻʽÿ�.
UninstallAppRunningError=���� %1��(��) ���� ���Դϴ�!%n%n���� �װ��� ��� �ν��Ͻ��� �ݾ� �ֽʽÿ�. �׷� ���� ����Ϸ��� "Ȯ��"��, �����Ϸ��� "���"�� Ŭ���Ͻʽÿ�.

; *** Startup questions
PrivilegesRequiredOverrideTitle=��ġ ��� ����
PrivilegesRequiredOverrideInstruction=��ġ ��带 ������ �ֽʽÿ�
PrivilegesRequiredOverrideText1=%1 �� ��� �����(������ ���� �ʿ�) �Ǵ� ���� ����ڿ����� ��ġ�մϴ�.
PrivilegesRequiredOverrideText2=%1 �� ���� ����� �Ǵ� ��� �����(������ ���� �ʿ�) ������ ��ġ�մϴ�.
PrivilegesRequiredOverrideAllUsers=��� ����ڿ����� ��ġ(&A)
PrivilegesRequiredOverrideAllUsersRecommended=��� ����ڿ����� ��ġ(&A) (��õ)
PrivilegesRequiredOverrideCurrentUser=���� ����ڿ����� ��ġ(&M)
PrivilegesRequiredOverrideCurrentUserRecommended=���� ����ڿ����� ��ġ(&M) (��õ)

; *** Misc. errors
ErrorCreatingDir="%1" ������ ���� �� �����ϴ�.
ErrorTooManyFilesInDir="%1" ������ ������ �ʹ� ���� ������ ������ ���� �� �����ϴ�.

; *** Setup common messages
ExitSetupTitle=��ġ �Ϸ�
ExitSetupMessage=��ġ�� �Ϸ���� �ʾҽ��ϴ�, ���⼭ ��ġ�� �����ϸ� ���α׷��� ��ġ���� �ʽ��ϴ�.%n%n��ġ�� �Ϸ��Ϸ��� ���߿� �ٽ� ��ġ ���α׷��� �����ؾ� �մϴ�.%n%n�׷��� ��ġ�� �����Ͻðڽ��ϱ�?
AboutSetupMenuItem=��ġ ����(&A)...
AboutSetupTitle=��ġ ����
AboutSetupMessage=%1 ���� %2%n%3%n%n%1 Ȩ ������:%n%4
AboutSetupNote=
TranslatorNote=

; *** Buttons
ButtonBack=< �ڷ�(&B)
ButtonNext=����(&N) >
ButtonInstall=��ġ(&I)
ButtonOK=Ȯ��
ButtonCancel=���
ButtonYes=��(&Y)
ButtonYesToAll=��� ��(&A)
ButtonNo=�ƴϿ�(&N)
ButtonNoToAll=��� �ƴϿ�(&O)
ButtonFinish=����(&F)
ButtonBrowse=ã�ƺ���(&B)...
ButtonWizardBrowse=ã�ƺ���(&R)...
ButtonNewFolder=�� ���� �����(&M)

; *** "Select Language" dialog messages
SelectLanguageTitle=��ġ ��� ����
SelectLanguageLabel=��ġ�� ����� �� �����Ͻʽÿ�.

; *** Common wizard text
ClickNext=����Ϸ��� "����"�� Ŭ���ϰ� ��ġ�� �����Ϸ��� "���"�� Ŭ���մϴ�.
BeveledLabel=
BrowseDialogTitle=���� ã�ƺ���
BrowseDialogLabel=�Ʒ� ��Ͽ��� ������ ������ ���� "Ȯ��"�� Ŭ���մϴ�.
NewFolderName=�� ����

; *** "Welcome" wizard page
WelcomeLabel1=[name] ��ġ ������ ����
WelcomeLabel2=�� ������� ������ ��ǻ�Ϳ� [name/ver]��(��) ��ġ�� ���Դϴ�.%n%n��ġ�ϱ� ���� �ٸ� �������α׷����� ��� �����ñ� �ٶ��ϴ�.

; *** "Password" wizard page
WizardPassword=��� ��ȣ
PasswordLabel1=�� ��ġ ������� ��� ��ȣ�� ��ȣ�Ǿ� �ֽ��ϴ�.
PasswordLabel3=��� ��ȣ�� �Է��ϰ� "����"�� Ŭ���Ͻʽÿ�. ��� ��ȣ�� ��ҹ��ڸ� �����ؾ� �մϴ�.
PasswordEditLabel=��� ��ȣ(&P):
IncorrectPassword=��� ��ȣ�� ��Ȯ���� �ʽ��ϴ�, �ٽ� �Է��Ͻʽÿ�.

; *** "License Agreement" wizard page
WizardLicense=���� ���
LicenseLabel=����ϱ� ���� ������ �߿� ������ �о�ʽÿ�.
LicenseLabel3=���� ���� ����� �о�ʽÿ�, ��ġ�� ����Ϸ��� �� ��࿡ �����ؾ� �մϴ�.
LicenseAccepted=�����մϴ�(&A)
LicenseNotAccepted=�������� �ʽ��ϴ�(&D)

; *** "Information" wizard pages
WizardInfoBefore=����
InfoBeforeLabel=����ϱ� ���� ������ �߿� ������ �о�ʽÿ�.
InfoBeforeClickLabel=��ġ�� ����Ϸ��� "����"�� Ŭ���Ͻʽÿ�.
WizardInfoAfter=����
InfoAfterLabel=����ϱ� ���� ������ �߿� ������ �о�ʽÿ�.
InfoAfterClickLabel=��ġ�� ����Ϸ��� "����"�� Ŭ���Ͻʽÿ�.

; *** "User Information" wizard page
WizardUserInfo=����� ����
UserInfoDesc=����� ������ �Է��Ͻʽÿ�.
UserInfoName=����� �̸�(&U):
UserInfoOrg=����(&O):
UserInfoSerial=�ø��� ��ȣ(&S):
UserInfoNameRequired=����� �̸��� �Է��Ͻʽÿ�.

; *** "Select Destination Location" wizard page
WizardSelectDir=��ġ ��ġ ����
SelectDirDesc=[name]�� ��ġ ��ġ�� �����Ͻʽÿ�.
SelectDirLabel3=���� ������ [name]��(��) ��ġ�մϴ�.
SelectDirBrowseLabel=����Ϸ��� "����"��, �ٸ� ������ �����Ϸ��� "ã�ƺ���"�� Ŭ���Ͻʽÿ�.
DiskSpaceGBLabel=�� ���α׷��� �ּ� [gb] GB�� ��ũ ���� ������ �ʿ��մϴ�.
DiskSpaceMBLabel=�� ���α׷��� �ּ� [mb] MB�� ��ũ ���� ������ �ʿ��մϴ�.
CannotInstallToNetworkDrive=��Ʈ��ũ ����̺꿡 ��ġ�� �� �����ϴ�.
CannotInstallToUNCPath=UNC ��ο� ��ġ�� �� �����ϴ�.
InvalidPath=����̺� ���ڸ� ������ ��ü ��θ� �Է��Ͻʽÿ�.%n�� ��: C:\APP %n%n�Ǵ�, UNC ������ ��θ� �Է��Ͻʽÿ�.%n�� ��: \\server\share
InvalidDrive=������ ����̺� �Ǵ� UNC ������ �������� �ʰų� �׼����� �� �����ϴ�, �ٸ� ��θ� �����Ͻʽÿ�.
DiskSpaceWarningTitle=��ũ ������ �����մϴ�
DiskSpaceWarning=��ġ �� �ּ� %1 KB ��ũ ������ �ʿ�������, ������ ����̺��� ���� ������ %2 KB �ۿ� �����ϴ�.%n%n�׷��� ����Ͻðڽ��ϱ�?
DirNameTooLong=���� �̸� �Ǵ� ��ΰ� �ʹ� ��ϴ�.
InvalidDirName=���� �̸��� ��ȿ���� �ʽ��ϴ�.
BadDirName32=���� �̸��� ���� ���ڸ� ������ �� �����ϴ�:%n%n%1
DirExistsTitle=������ �����մϴ�
DirExists=���� %n%n%1%n%n��(��) �̹� �����մϴ�, �� ������ ��ġ�Ͻðڽ��ϱ�?
DirDoesntExistTitle=������ �������� �ʽ��ϴ�
DirDoesntExist=���� %n%n%1%n%n��(��) �������� �ʽ��ϴ�, ���� ������ ����ðڽ��ϱ�?

; *** "Select Components" wizard page
WizardSelectComponents=���� ��� ����
SelectComponentsDesc=��ġ�� ���� ��Ҹ� �����Ͻʽÿ�.
SelectComponentsLabel2=�ʿ��� ���� ��Ҵ� üũ�ϰ� ���ʿ��� ���� ��Ҵ� üũ �����մϴ�, ����Ϸ��� "����"�� Ŭ���Ͻʽÿ�.
FullInstallation=��� ��ġ
; if possible don't translate 'Compact' as 'Minimal' (I mean 'Minimal' in your language)
CompactInstallation=�ּ� ��ġ
CustomInstallation=����� ���� ��ġ
NoUninstallWarningTitle=���� ��Ұ� �����մϴ�
NoUninstallWarning=���� ���� ��Ұ� �̹� ��ġ�Ǿ� �ֽ��ϴ�:%n%n%1%n%n�� ���� ����� �������� ������, ���α׷� ���Ž� �� ���� ��ҵ��� ���ŵ��� ���� �̴ϴ�.%n%n�׷��� ����Ͻðڽ��ϱ�?
ComponentSize1=%1 KB
ComponentSize2=%1 MB
ComponentsDiskSpaceGBLabel=���� ������ �ּ� [gb] GB�� ��ũ ���� ������ �ʿ��մϴ�.
ComponentsDiskSpaceMBLabel=���� ������ �ּ� [mb] MB�� ��ũ ���� ������ �ʿ��մϴ�.

; *** "Select Additional Tasks" wizard page
WizardSelectTasks=�߰� �۾� ����
SelectTasksDesc=������ �߰� �۾��� �����Ͻʽÿ�.
SelectTasksLabel2=[name] ��ġ ������ ������ �߰� �۾��� ������ ��, "����"�� Ŭ���Ͻʽÿ�.

; *** "Select Start Menu Folder" wizard page
WizardSelectProgramGroup=���� �޴� ���� ����
SelectStartMenuFolderDesc=��� ���α׷� �ٷΰ��⸦ ��ġ�ϰڽ��ϱ�?
SelectStartMenuFolderLabel3=���� ���� �޴� ������ ���α׷� �ٷΰ��⸦ ����ϴ�.
SelectStartMenuFolderBrowseLabel=����Ϸ��� "����"�� Ŭ���ϰ�, �ٸ� ������ �����Ϸ��� "ã�ƺ���"�� Ŭ���Ͻʽÿ�.
MustEnterGroupName=���� �̸��� �Է��Ͻʽÿ�.
GroupNameTooLong=���� �̸� �Ǵ� ��ΰ� �ʹ� ��ϴ�.
InvalidGroupName=���� �̸��� ��ȿ���� �ʽ��ϴ�.
BadGroupName=���� �̸��� ���� ���ڸ� ������ �� �����ϴ�:%n%n%1
NoProgramGroupCheck2=���� �޴� ������ ������ ����(&D)

; *** "Ready to Install" wizard page
WizardReady=��ġ �غ� �Ϸ�
ReadyLabel1=������ ��ǻ�Ϳ� [name]��(��) ��ġ�� �غ� �Ǿ����ϴ�.
ReadyLabel2a=��ġ�� ����Ϸ��� "��ġ"��, ������ �����ϰų� �����Ϸ��� "�ڷ�"�� Ŭ���Ͻʽÿ�.
ReadyLabel2b=��ġ�� ����Ϸ��� "��ġ"�� Ŭ���Ͻʽÿ�.
ReadyMemoUserInfo=����� ����:
ReadyMemoDir=��ġ ��ġ:
ReadyMemoType=��ġ ����:
ReadyMemoComponents=������ ���� ���:
ReadyMemoGroup=���� �޴� ����:
ReadyMemoTasks=�߰� �۾�:

; *** "Preparing to Install" wizard page
WizardPreparing=��ġ �غ� ��
PreparingDesc=������ ��ǻ�Ϳ� [name] ��ġ�� �غ��ϴ� ���Դϴ�.
PreviousInstallNotCompleted=���� ���α׷��� ��ġ/���� �۾��� �Ϸ���� �ʾҽ��ϴ�, �Ϸ��Ϸ��� ��ǻ�͸� �ٽ� �����ؾ� �մϴ�.%n%n��ǻ�͸� �ٽ� ������ ��, ��ġ �����縦 �ٽ� �����Ͽ� [name] ��ġ�� �Ϸ��Ͻñ� �ٶ��ϴ�.
CannotContinue=��ġ�� ����� �� �����ϴ�, "���"�� Ŭ���Ͽ� ��ġ�� �����Ͻʽÿ�.
ApplicationsFound=���� �������α׷��� ��ġ ������Ʈ�� �ʿ��� ������ ����ϰ� �ֽ��ϴ�, ��ġ �����簡 �̷� �������α׷��� �ڵ����� ������ �� �ֵ��� ����Ͻñ� �ٶ��ϴ�.
ApplicationsFound2=���� �������α׷��� ��ġ ������Ʈ�� �ʿ��� ������ ����ϰ� �ֽ��ϴ�, ��ġ �����簡 �̷� �������α׷��� �ڵ����� ������ �� �ֵ��� ����Ͻñ� �ٶ��ϴ�. ��ġ�� �Ϸ�Ǹ�, ��ġ ������� �� �������α׷��� �ٽ� ���۵ǵ��� �õ��� �̴ϴ�.
CloseApplications=�ڵ����� �������α׷��� ������(&A)
DontCloseApplications=�������α׷��� �������� ����(&D)
ErrorCloseApplications=��ġ �����簡 �������α׷��� �ڵ����� ������ �� �����ϴ�, ����ϱ� ���� ��ġ ������Ʈ�� �ʿ��� ������ ����ϰ� �ִ� �������α׷��� ��� �����Ͻñ� �ٶ��ϴ�.
PrepareToInstallNeedsRestart=��ġ ������� ������ ��ǻ�͸� ������ؾ� �մϴ�. [name] ��ġ�� �Ϸ��ϱ� ���� ��ǻ�͸� �ٽ� ������ �Ŀ� ��ġ �����縦 �ٽ� ������ �ֽʽÿ�.%n%n���� �ٽ� �����Ͻðڽ��ϱ�?

; *** "Installing" wizard page
WizardInstalling=��ġ ��
InstallingLabel=������ ��ǻ�Ϳ� [name]��(��) ��ġ�ϴ� ��... ��� ��ٷ� �ֽʽÿ�.

; *** "Setup Completed" wizard page
FinishedHeadingLabel=[name] ��ġ ������ �Ϸ�
FinishedLabelNoIcons=������ ��ǻ�Ϳ� [name]��(��) ��ġ�Ǿ����ϴ�.
FinishedLabel=������ ��ǻ�Ϳ� [name]��(��) ��ġ�Ǿ����ϴ�, �������α׷��� ��ġ�� �������� �����Ͽ� ������ �� �ֽ��ϴ�.
ClickFinish=��ġ�� �������� "����"�� Ŭ���Ͻʽÿ�.
FinishedRestartLabel=[name] ��ġ�� �Ϸ��Ϸ���, ��ǻ�͸� �ٽ� �����ؾ� �մϴ�. ���� �ٽ� �����Ͻðڽ��ϱ�?
FinishedRestartMessage=[name] ��ġ�� �Ϸ��Ϸ���, ��ǻ�͸� �ٽ� �����ؾ� �մϴ�.%n%n���� �ٽ� �����Ͻðڽ��ϱ�?
ShowReadmeCheck=��, README ������ ǥ���մϴ�
YesRadio=��, ���� �ٽ� �����մϴ�(&Y)
NoRadio=�ƴϿ�, ���߿� �ٽ� �����մϴ�(&N)
; used for example as 'Run MyProg.exe'
RunEntryExec=%1 ����
; used for example as 'View Readme.txt'
RunEntryShellExec=%1 ǥ��

; *** "Setup Needs the Next Disk" stuff
ChangeDiskTitle=��ũ�� �ʿ��մϴ�
SelectDiskLabel2=��ũ %1��(��) �����ϰ� "Ȯ��"�� Ŭ���Ͻʽÿ�.%n%n�� ��ũ ���� ������ �Ʒ� ��ΰ� �ƴ� ���� �ִ� ���, �ùٸ� ��θ� �Է��ϰų� "ã�ƺ���"�� Ŭ���Ͻñ� �ٶ��ϴ�.
PathLabel=���(&P):
FileNotInDir2=%2�� ���� %1��(��) ��ġ�� �� �����ϴ�, �ùٸ� ��ũ�� �����ϰų� �ٸ� ������ �����Ͻʽÿ�.
SelectDirectoryLabel=���� ��ũ�� ��ġ�� �����Ͻʽÿ�.

; *** Installation phase messages
SetupAborted=��ġ�� �Ϸ���� �ʾҽ��ϴ�.%n%n������ �ذ��� ��, �ٽ� ��ġ�� �����Ͻʽÿ�.
AbortRetryIgnoreSelectAction=�׼��� ������ �ֽʽÿ�.
AbortRetryIgnoreRetry=��õ�(&T)
AbortRetryIgnoreIgnore=������ �����ϰ� ����(&I)
AbortRetryIgnoreCancel=��ġ ���

; *** Installation status messages
StatusClosingApplications=�������α׷��� �����ϴ� ��...
StatusCreateDirs=������ ����� ��...
StatusExtractFiles=������ �����ϴ� ��...
StatusCreateIcons=�ٷΰ��⸦ �����ϴ� ��...
StatusCreateIniEntries=INI �׸��� ����� ��...
StatusCreateRegistryEntries=������Ʈ�� �׸��� ����� ��...
StatusRegisterFiles=������ ����ϴ� ��...
StatusSavingUninstall=���� ������ �����ϴ� ��...
StatusRunProgram=��ġ�� �Ϸ��ϴ� ��...
StatusRestartingApplications=�������α׷��� �ٽ� �����ϴ� ��...
StatusRollback=������ ����ϴ� ��...

; *** Misc. errors
ErrorInternal2=���� ����: %1
ErrorFunctionFailedNoCode=%1 ����
ErrorFunctionFailed=%1 ����; �ڵ� %2
ErrorFunctionFailedWithMessage=%1 ����, �ڵ�: %2.%n%3
ErrorExecutingProgram=���� ���� ����:%n%1

; *** Registry errors
ErrorRegOpenKey=������Ʈ�� Ű ���� ����:%n%1\%2
ErrorRegCreateKey=������Ʈ�� Ű ���� ����:%n%1\%2
ErrorRegWriteKey=������Ʈ�� Ű ���� ����:%n%1\%2

; *** INI errors
ErrorIniEntry=%1 ���Ͽ� INI �׸� ����� �����Դϴ�.

; *** File copying errors
FileAbortRetryIgnoreSkipNotRecommended=�� ������ �ǳʶ�(&S) (�������� �ʽ��ϴ�)
FileAbortRetryIgnoreIgnoreNotRecommended=������ �����ϰ� ����(&I) (�������� �ʽ��ϴ�)
SourceIsCorrupted=���� ������ �ջ��
SourceDoesntExist=���� ���� %1��(��) �������� ����
ExistingFileReadOnly2=���� ������ �б� �����̱⶧���� ��ü�� �� �����ϴ�.
ExistingFileReadOnlyRetry=�б� ���� �Ӽ��� �����ϰ� �ٽ� �õ��Ϸ���(&R)
ExistingFileReadOnlyKeepExisting=���� ������ ����(&K)
ErrorReadingExistingDest=���� ������ �д� ���� ���� �߻�:
FileExists=������ �̹� �����մϴ�.%n%n������ ����ðڽ��ϱ�?
ExistingFileNewer=���� ������ ��ġ�Ϸ��� �ϴ� ���Ϻ��� �� �����Դϴ�, ���� ������ �����Ͻñ� �ٶ��ϴ�.%n%n���� ������ �����Ͻðڽ��ϱ�?
ErrorChangingAttr=���� ������ �Ӽ��� �����ϴ� ���� ���� �߻�:
ErrorCreatingTemp=��� ������ ������ ����� ���� ���� �߻�:
ErrorReadingSource=���� ������ �д� ���� ���� �߻�:
ErrorCopying=������ �����ϴ� ���� ���� �߻�:
ErrorReplacingExistingFile=���� ������ ��ü�ϴ� ���� ���� �߻�:
ErrorRestartReplace=RestartReplace ����:
ErrorRenamingTemp=��� ���� ���� ���� �̸��� �ٲٴ� ���� ���� �߻�:
ErrorRegisterServer=DLL/OCX ��� ����: %1
ErrorRegSvr32Failed=RegSvr32�� ���� ���� �ڵ�� ����: %1
ErrorRegisterTypeLib=���� ������ ���̺귯�� ��Ͽ� ����: %1

; *** Uninstall display name markings
; used for example as 'My Program (32-bit)'
UninstallDisplayNameMark=%1 (%2)
; used for example as 'My Program (32-bit, All users)'
UninstallDisplayNameMarks=%1 (%2, %3)
UninstallDisplayNameMark32Bit=32��Ʈ
UninstallDisplayNameMark64Bit=64��Ʈ
UninstallDisplayNameMarkAllUsers=��� �����
UninstallDisplayNameMarkCurrentUser=���� �����

; *** Post-installation errors
ErrorOpeningReadme=README ������ ���� �� ������ �߻��߽��ϴ�.
ErrorRestartingComputer=��ǻ�͸� �ٽ� ������ �� �����ϴ�, �������� �ٽ� �����Ͻʽÿ�.

; *** Uninstaller messages
UninstallNotFound=���� %1��(��) �������� �ʱ� ������, ���Ÿ� ������ �� �����ϴ�.
UninstallOpenError=���� %1��(��) �� �� ���� ������, ���Ÿ� ������ �� �����ϴ�.
UninstallUnsupportedVer=���� �α� ���� "%1"��(��) �� ���� ������� �ν��� �� ���� �����̱� ������, ���Ÿ� ������ �� �����ϴ�.
UninstallUnknownEntry=�� �� ���� �׸� %1��(��) ���� �α׿� ���ԵǾ� �ֽ��ϴ�.
ConfirmUninstall=���� %1��(��) �� ���� ��Ҹ� ��� �����Ͻðڽ��ϱ�?
UninstallOnlyOnWin64=�� ���α׷��� 64��Ʈ Windows������ ������ �� �ֽ��ϴ�.
OnlyAdminCanUninstall=�� ���α׷��� �����Ϸ��� ������ ������ �ʿ��մϴ�.
UninstallStatusLabel=������ ��ǻ�Ϳ��� %1��(��) �����ϴ� ��... ��� ��ٷ� �ֽʽÿ�.
UninstalledAll=%1��(��) ���������� ���ŵǾ����ϴ�!
UninstalledMost=%1 ���Ű� �Ϸ�Ǿ����ϴ�.%n%n�Ϻ� ��Ҵ� ������ �� ������, �������� �����Ͻñ� �ٶ��ϴ�.
UninstalledAndNeedsRestart=%1�� ���Ÿ� �Ϸ��Ϸ���, ��ǻ�͸� �ٽ� �����ؾ� �մϴ�.%n%n���� �ٽ� �����Ͻðڽ��ϱ�?
UninstallDataCorrupted=���� "%1"��(��) �ջ�Ǿ��� ������, ���Ÿ� ������ �� �����ϴ�.

; *** Uninstallation phase messages
ConfirmDeleteSharedFileTitle=���� ������ �����Ͻðڽ��ϱ�?
ConfirmDeleteSharedFile2=�ý����� � ���α׷��� ���� ���� ������ ������� �ʽ��ϴ�, �� ���� ������ �����Ͻðڽ��ϱ�?%n%n�� ������ �ٸ� ���α׷��� �����ϰ� �ִ� ���¿��� �� ������ ������ ���, �ش� ���α׷��� ����� �۵����� ���� �� ������, Ȯ���� ������ "�ƴϿ�"�� �����ϼŵ� �˴ϴ�. �ý��ۿ� ������ ���� �־ ������ ���� �ʽ��ϴ�.
SharedFileNameLabel=���� �̸�:
SharedFileLocationLabel=��ġ:
WizardUninstalling=���� ����
StatusUninstalling=%1��(��) �����ϴ� ��...

; *** Shutdown block reasons
ShutdownBlockReasonInstallingApp=%1��(��) ��ġ�ϴ� ���Դϴ�.
ShutdownBlockReasonUninstallingApp=%1��(��) �����ϴ� ���Դϴ�.

; The custom messages below aren't used by Setup itself, but if you make
; use of them in your scripts, you'll want to translate them.

[CustomMessages]

NameAndVersion=%1 ���� %2
AdditionalIcons=������ �߰�:
CreateDesktopIcon=���� ȭ�鿡 �ٷΰ��� �����(&D)
CreateQuickLaunchIcon=���� ���� ������ �����(&Q)
ProgramOnTheWeb=%1 ��������
UninstallProgram=%1 ����
LaunchProgram=%1 ����
AssocFileExtension=���� Ȯ���� %2��(��) %1�� �����մϴ�.
AssocingFileExtension=���� Ȯ���� %2��(��) %1�� �����ϴ� ��...
AutoStartProgramGroupDescription=����:
AutoStartProgram=%1��(��) �ڵ����� ����
AddonHostProgramNotFound=%1��(��) ������ ������ ��ġ�� �� �����ϴ�.%n%n�׷��� ����Ͻðڽ��ϱ�?
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/Default.zh-cn.isl]---
Location: vscode-main/build/win32/i18n/Default.zh-cn.isl

```text
; *** Inno Setup version 6.0.3+ Chinese Simplified messages ***
;
; Maintained by Zhenghan Yang
; Email: 847320916@QQ.com
; Translation based on network resource
; The latest Translation is on https://github.com/kira-96/Inno-Setup-Chinese-Simplified-Translation
;

[LangOptions]
; The following three entries are very important. Be sure to read and 
; understand the '[LangOptions] section' topic in the help file.
LanguageName=简体中文
; If Language Name display incorrect, uncomment next line
; LanguageName=<7B80><4F53><4E2D><6587>
LanguageID=$0804
LanguageCodePage=936
; If the language you are translating to requires special font faces or
; sizes, uncomment any of the following entries and change them accordingly.
;DialogFontName=
;DialogFontSize=8
;WelcomeFontName=Verdana
;WelcomeFontSize=12
;TitleFontName=Arial
;TitleFontSize=29
;CopyrightFontName=Arial
;CopyrightFontSize=8

[Messages]

; *** 应用程序标题
SetupAppTitle=安装
SetupWindowTitle=安装 - %1
UninstallAppTitle=卸载
UninstallAppFullTitle=%1 卸载

; *** Misc. common
InformationTitle=信息
ConfirmTitle=确认
ErrorTitle=错误

; *** SetupLdr messages
SetupLdrStartupMessage=现在将安装 %1。您想要继续吗？
LdrCannotCreateTemp=不能创建临时文件。安装中断。
LdrCannotExecTemp=不能执行临时目录中的文件。安装中断。
HelpTextNote=

; *** 启动错误消息
LastErrorMessage=%1.%n%n错误 %2: %3
SetupFileMissing=安装目录中的文件 %1 丢失。请修正这个问题或获取一个新的程序副本。
SetupFileCorrupt=安装文件已损坏。请获取一个新的程序副本。
SetupFileCorruptOrWrongVer=安装文件已损坏，或是与这个安装程序的版本不兼容。请修正这个问题或获取新的程序副本。
InvalidParameter=无效的命令行参数: %n%n%1
SetupAlreadyRunning=安装程序正在运行。
WindowsVersionNotSupported=这个程序不支持该版本的计算机运行。
WindowsServicePackRequired=这个程序要求%1服务包%1或更高。
NotOnThisPlatform=这个程序将不能运行于 %1。
OnlyOnThisPlatform=这个程序必须运行于 %1。
OnlyOnTheseArchitectures=这个程序只能在为下列处理器结构设计的 Windows 版本中进行安装:%n%n%1
WinVersionTooLowError=这个程序需要 %1 版本 %2 或更高。
WinVersionTooHighError=这个程序不能安装于 %1 版本 %2 或更高。
AdminPrivilegesRequired=在安装这个程序时您必须以管理员身份登录。
PowerUserPrivilegesRequired=在安装这个程序时您必须以管理员身份或有权限的用户组身份登录。
SetupAppRunningError=安装程序发现 %1 当前正在运行。%n%n请先关闭所有运行的窗口，然后单击“确定”继续，或按“取消”退出。
UninstallAppRunningError=卸载程序发现 %1 当前正在运行。%n%n请先关闭所有运行的窗口，然后单击“确定”继续，或按“取消”退出。

; *** 启动问题
PrivilegesRequiredOverrideTitle=选择安装程序模式
PrivilegesRequiredOverrideInstruction=选择安装模式
PrivilegesRequiredOverrideText1=%1 可以为所有用户安装(需要管理员权限)，或仅为您安装。
PrivilegesRequiredOverrideText2=%1 只能为您安装，或为所有用户安装(需要管理员权限)。
PrivilegesRequiredOverrideAllUsers=为所有用户安装(&A)
PrivilegesRequiredOverrideAllUsersRecommended=为所有用户安装(建议选项)(&A)
PrivilegesRequiredOverrideCurrentUser=只为我安装(&M)
PrivilegesRequiredOverrideCurrentUserRecommended=只为我安装(建议选项)(&M)

; *** 其它错误
ErrorCreatingDir=安装程序不能创建目录“%1”。
ErrorTooManyFilesInDir=不能在目录“%1”中创建文件，因为里面的文件太多

; *** 安装程序公共消息
ExitSetupTitle=退出安装程序
ExitSetupMessage=安装程序未完成安装。如果您现在退出，您的程序将不能安装。%n%n您可以以后再运行安装程序完成安装。%n%n退出安装程序吗？
AboutSetupMenuItem=关于安装程序(&A)...
AboutSetupTitle=关于安装程序
AboutSetupMessage=%1 版本 %2%n%3%n%n%1 主页:%n%4
AboutSetupNote=
TranslatorNote=

; *** 按钮
ButtonBack=< 上一步(&B)
ButtonNext=下一步(&N) >
ButtonInstall=安装(&I)
ButtonOK=确定
ButtonCancel=取消
ButtonYes=是(&Y)
ButtonYesToAll=全是(&A)
ButtonNo=否(&N)
ButtonNoToAll=全否(&O)
ButtonFinish=完成(&F)
ButtonBrowse=浏览(&B)...
ButtonWizardBrowse=浏览(&R)...
ButtonNewFolder=新建文件夹(&M)

; *** “选择语言”对话框消息
SelectLanguageTitle=选择安装语言
SelectLanguageLabel=选择安装时要使用的语言。

; *** 公共向导文字
ClickNext=单击“下一步”继续，或单击“取消”退出安装程序。
BeveledLabel=
BrowseDialogTitle=浏览文件夹
BrowseDialogLabel=在下列列表中选择一个文件夹，然后单击“确定”。
NewFolderName=新建文件夹

; *** “欢迎”向导页
WelcomeLabel1=欢迎使用 [name] 安装向导
WelcomeLabel2=现在将安装 [name/ver] 到您的电脑中。%n%n推荐您在继续安装前关闭所有其它应用程序。

; *** “密码”向导页
WizardPassword=密码
PasswordLabel1=这个安装程序有密码保护。
PasswordLabel3=请输入密码，然后单击“下一步”继续。密码区分大小写。
PasswordEditLabel=密码(&P):
IncorrectPassword=您输入的密码不正确，请重试。

; *** “许可协议”向导页
WizardLicense=许可协议
LicenseLabel=继续安装前请阅读下列重要信息。
LicenseLabel3=请仔细阅读下列许可协议。您在继续安装前必须同意这些协议条款。
LicenseAccepted=我同意此协议(&A)
LicenseNotAccepted=我不同意此协议(&D)

; *** “信息”向导页
WizardInfoBefore=信息
InfoBeforeLabel=请在继续安装前阅读下列重要信息。
InfoBeforeClickLabel=如果您想继续安装，单击“下一步”。
WizardInfoAfter=信息
InfoAfterLabel=请在继续安装前阅读下列重要信息。
InfoAfterClickLabel=如果您想继续安装，单击“下一步”。

; *** “用户信息”向导页
WizardUserInfo=用户信息
UserInfoDesc=请输入您的信息。
UserInfoName=用户名(&U):
UserInfoOrg=组织(&O):
UserInfoSerial=序列号(&S):
UserInfoNameRequired=您必须输入名字。

; *** “选择目标目录”向导面
WizardSelectDir=选择目标位置
SelectDirDesc=您想将 [name] 安装在什么地方？
SelectDirLabel3=安装程序将安装 [name] 到下列文件夹中。
SelectDirBrowseLabel=单击“下一步”继续。如果您想选择其它文件夹，单击“浏览”。
DiskSpaceGBLabel=至少需要有 [gb] GB 的可用磁盘空间。
DiskSpaceMBLabel=至少需要有 [mb] MB 的可用磁盘空间。
CannotInstallToNetworkDrive=安装程序无法安装到一个网络驱动器。
CannotInstallToUNCPath=安装程序无法安装到一个UNC路径。
InvalidPath=您必须输入一个带驱动器卷标的完整路径，例如:%n%nC:\APP%n%n或下列形式的 UNC 路径:%n%n\\server\share
InvalidDrive=您选定的驱动器或 UNC 共享不存在或不能访问。请选选择其它位置。
DiskSpaceWarningTitle=没有足够的磁盘空间
DiskSpaceWarning=安装程序至少需要 %1 KB 的可用空间才能安装，但选定驱动器只有 %2 KB 的可用空间。%n%n您一定要继续吗？
DirNameTooLong=文件夹名或路径太长。
InvalidDirName=文件夹名是无效的。
BadDirName32=文件夹名不能包含下列任何字符:%n%n%1
DirExistsTitle=文件夹存在
DirExists=文件夹:%n%n%1%n%n已经存在。您一定要安装到这个文件夹中吗？
DirDoesntExistTitle=文件夹不存在
DirDoesntExist=文件夹:%n%n%1%n%n不存在。您想要创建此目录吗？

; *** “选择组件”向导页
WizardSelectComponents=选择组件
SelectComponentsDesc=您想安装哪些程序的组件？
SelectComponentsLabel2=选择您想要安装的组件；清除您不想安装的组件。然后单击“下一步”继续。
FullInstallation=完全安装
; if possible don't translate 'Compact' as 'Minimal' (I mean 'Minimal' in your language)
CompactInstallation=简洁安装
CustomInstallation=自定义安装
NoUninstallWarningTitle=组件存在
NoUninstallWarning=安装程序侦测到下列组件已在您的电脑中安装。:%n%n%1%n%n取消选定这些组件将不能卸载它们。%n%n您一定要继续吗？
ComponentSize1=%1 KB
ComponentSize2=%1 MB
ComponentsDiskSpaceGBLabel=当前选择的组件至少需要 [gb] GB 的磁盘空间。
ComponentsDiskSpaceMBLabel=当前选择的组件至少需要 [mb] MB 的磁盘空间。

; *** “选择附加任务”向导页
WizardSelectTasks=选择附加任务
SelectTasksDesc=您想要安装程序执行哪些附加任务？
SelectTasksLabel2=选择您想要安装程序在安装 [name] 时执行的附加任务，然后单击“下一步”。

; *** “选择开始菜单文件夹”向导页
WizardSelectProgramGroup=选择开始菜单文件夹
SelectStartMenuFolderDesc=您想在哪里放置程序的快捷方式？
SelectStartMenuFolderLabel3=安装程序现在将在下列开始菜单文件夹中创建程序的快捷方式。
SelectStartMenuFolderBrowseLabel=单击“下一步”继续。如果您想选择其它文件夹，单击“浏览”。
MustEnterGroupName=您必须输入一个文件夹名。
GroupNameTooLong=文件夹名或路径太长。
InvalidGroupName=文件夹名是无效的。
BadGroupName=文件夹名不能包含下列任何字符:%n%n%1
NoProgramGroupCheck2=不创建开始菜单文件夹(&D)

; *** “准备安装”向导页
WizardReady=准备安装
ReadyLabel1=安装程序现在准备开始安装 [name] 到您的电脑中。
ReadyLabel2a=单击“安装”继续此安装程序。如果您想要回顾或改变设置，请单击“上一步”。
ReadyLabel2b=单击“安装”继续此安装程序?
ReadyMemoUserInfo=用户信息:
ReadyMemoDir=目标位置:
ReadyMemoType=安装类型:
ReadyMemoComponents=选定组件:
ReadyMemoGroup=开始菜单文件夹:
ReadyMemoTasks=附加任务:

; *** “正在准备安装”向导页
WizardPreparing=正在准备安装
PreparingDesc=安装程序正在准备安装 [name] 到您的电脑中。
PreviousInstallNotCompleted=先前程序的安装/卸载未完成。您需要重新启动您的电脑才能完成安装。%n%n在重新启动电脑后，再运行安装完成 [name] 的安装。
CannotContinue=安装程序不能继续。请单击“取消”退出。
ApplicationsFound=下列应用程序正在使用的文件需要更新设置。它是建议您允许安装程序自动关闭这些应用程序。
ApplicationsFound2=下列应用程序正在使用的文件需要更新设置。它是建议您允许安装程序自动关闭这些应用程序。安装完成后，安装程序将尝试重新启动应用程序。
CloseApplications=自动关闭该应用程序(&A)
DontCloseApplications=不要关闭该应用程序(D)
ErrorCloseApplications=安装程序无法自动关闭所有应用程序。在继续之前，我们建议您关闭所有使用需要更新的安装程序文件。
PrepareToInstallNeedsRestart=安装程序必须重新启动计算机。重新启动计算机后，请再次运行安装程序以完成 [name] 的安装。%n%n是否立即重新启动？

; *** “正在安装”向导页
WizardInstalling=正在安装
InstallingLabel=安装程序正在安装 [name] 到您的电脑中，请稍等。

; *** “安装完成”向导页
FinishedHeadingLabel=[name] 安装完成
FinishedLabelNoIcons=安装程序已在您的电脑中安装了 [name]。
FinishedLabel=安装程序已在您的电脑中安装了 [name]。此应用程序可以通过选择安装的快捷方式运行。
ClickFinish=单击“完成”退出安装程序。
FinishedRestartLabel=要完成 [name] 的安装，安装程序必须重新启动您的电脑。您想现在重新启动吗？
FinishedRestartMessage=要完成 [name] 的安装，安装程序必须重新启动您的电脑。%n%n您想现在重新启动吗？
ShowReadmeCheck=是，您想查阅自述文件
YesRadio=是，立即重新启动电脑(&Y)
NoRadio=否，稍后重新启动电脑(&N)
; 用于象“运行 MyProg.exe”
RunEntryExec=运行 %1
; 用于象“查阅 Readme.txt”
RunEntryShellExec=查阅 %1

; *** “安装程序需要下一张磁盘”提示
ChangeDiskTitle=安装程序需要下一张磁盘
SelectDiskLabel2=请插入磁盘 %1 并单击“确定”。%n%n如果这个磁盘中的文件不能在不同于下列显示的文件夹中找到，输入正确的路径或单击“浏览”。
PathLabel=路径(&P):
FileNotInDir2=文件“%1”不能在“%2”定位。请插入正确的磁盘或选择其它文件夹。
SelectDirectoryLabel=请指定下一张磁盘的位置。

; *** 安装状态消息
SetupAborted=安装程序未完成安装。%n%n请修正这个问题并重新运行安装程序。
AbortRetryIgnoreSelectAction=选项
AbortRetryIgnoreRetry=重试(&T)
AbortRetryIgnoreIgnore=忽略错误并继续(&I)
AbortRetryIgnoreCancel=关闭安装程序

; *** 安装状态消息
StatusClosingApplications=正在关闭应用程序...
StatusCreateDirs=正在创建目录...
StatusExtractFiles=正在解压缩文件...
StatusCreateIcons=正在创建快捷方式...
StatusCreateIniEntries=正在创建 INI 条目...
StatusCreateRegistryEntries=正在创建注册表条目...
StatusRegisterFiles=正在注册文件...
StatusSavingUninstall=正在保存卸载信息...
StatusRunProgram=正在完成安装...
StatusRestartingApplications=正在重启应用程序...
StatusRollback=正在撤销更改...

; *** 其它错误
ErrorInternal2=内部错误: %1
ErrorFunctionFailedNoCode=%1 失败
ErrorFunctionFailed=%1 失败；错误代码 %2
ErrorFunctionFailedWithMessage=%1 失败；错误代码 %2.%n%3
ErrorExecutingProgram=不能执行文件:%n%1

; *** 注册表错误
ErrorRegOpenKey=打开注册表项时出错:%n%1\%2
ErrorRegCreateKey=创建注册表项时出错:%n%1\%2
ErrorRegWriteKey=写入注册表项时出错:%n%1\%2

; *** INI 错误
ErrorIniEntry=在文件“%1”创建 INI 项目错误。

; *** 文件复制错误
FileAbortRetryIgnoreSkipNotRecommended=跳过这个文件 (不推荐)(&S)
FileAbortRetryIgnoreIgnoreNotRecommended=忽略错误并继续 (不推荐)(&I)
SourceIsCorrupted=源文件已损坏
SourceDoesntExist=源文件“%1”不存在
ExistingFileReadOnly2=无法替换现有文件，因为它是只读的。
ExistingFileReadOnlyRetry=移除只读属性并重试(&R)
ExistingFileReadOnlyKeepExisting=保留现有文件(&K)
ErrorReadingExistingDest=尝试读取现有文件时发生一个错误:
FileExists=文件已经存在。%n%n您想要安装程序覆盖它吗？
ExistingFileNewer=现有的文件新与安装程序要安装的文件。推荐您保留现有文件。%n%n您想要保留现有的文件吗？
ErrorChangingAttr=尝试改变下列现有的文件的属性时发生一个错误:
ErrorCreatingTemp=尝试在目标目录创建文件时发生一个错误:
ErrorReadingSource=尝试读取下列源文件时发生一个错误:
ErrorCopying=尝试复制下列文件时发生一个错误:
ErrorReplacingExistingFile=尝试替换现有的文件时发生错误:
ErrorRestartReplace=重启电脑后替换文件失败:
ErrorRenamingTemp=尝试重新命名以下目标目录中的一个文件时发生错误:
ErrorRegisterServer=不能注册 DLL/OCX: %1
ErrorRegSvr32Failed=RegSvr32 失败；退出代码 %1
ErrorRegisterTypeLib=不能注册类型库: %1

; *** 卸载显示名字标记
; used for example as 'My Program (32-bit)'
UninstallDisplayNameMark=%1 (%2)
; used for example as 'My Program (32-bit, All users)'
UninstallDisplayNameMarks=%1 (%2, %3)
UninstallDisplayNameMark32Bit=32位
UninstallDisplayNameMark64Bit=64位
UninstallDisplayNameMarkAllUsers=所有用户
UninstallDisplayNameMarkCurrentUser=当前用户

; *** 安装后错误
ErrorOpeningReadme=当尝试打开自述文件时发生一个错误。
ErrorRestartingComputer=安装程序不能重新启动电脑，请手动重启。

; *** 卸载消息
UninstallNotFound=文件“%1”不存在。不能卸载。
UninstallOpenError=文件“%1”不能打开。不能卸载。
UninstallUnsupportedVer=卸载日志文件“%1”有未被这个版本的卸载器承认的格式。不能卸载
UninstallUnknownEntry=在卸载日志中遇到一个未知的条目 (%1)
ConfirmUninstall=您确认想要完全删除 %1 及它的所有组件吗？
UninstallOnlyOnWin64=这个安装程序只能在 64 位 Windows 中进行卸载。
OnlyAdminCanUninstall=这个安装的程序只能是有管理员权限的用户才能卸载。
UninstallStatusLabel=正在从您的电脑中删除 %1，请等待。
UninstalledAll=%1 已顺利地从您的电脑中删除。
UninstalledMost=%1 卸载完成。%n%n有一些内容不能被删除。您可以手工删除它们。
UninstalledAndNeedsRestart=要完成 %1 的卸载，您的电脑必须重新启动。%n%n您现在想重新启动电脑吗？
UninstallDataCorrupted=“%1”文件被破坏，不能卸载

; *** 卸载状态消息
ConfirmDeleteSharedFileTitle=删除共享文件吗？
ConfirmDeleteSharedFile2=系统中包含的下列共享文件已经不被其它程序使用。您想要卸载程序删除这些共享文件吗？%n%n如果这些文件被删除，但还有程序正在使用这些文件，这些程序可能不能正确执行。如果您不能确定，选择“否”。把这些文件保留在系统中以免引起问题。
SharedFileNameLabel=文件名:
SharedFileLocationLabel=位置:
WizardUninstalling=卸载状态
StatusUninstalling=正在卸载 %1...

; *** Shutdown block reasons
ShutdownBlockReasonInstallingApp=正在安装 %1.
ShutdownBlockReasonUninstallingApp=正在卸载 %1.

; The custom messages below aren't used by Setup itself, but if you make
; use of them in your scripts, you'll want to translate them.

[CustomMessages]

NameAndVersion=%1 版本 %2
AdditionalIcons=附加快捷方式:
CreateDesktopIcon=创建桌面快捷方式(&D)
CreateQuickLaunchIcon=创建快速运行栏快捷方式(&Q)
ProgramOnTheWeb=%1 网站
UninstallProgram=卸载 %1
LaunchProgram=运行 %1
AssocFileExtension=将 %2 文件扩展名与 %1 建立关联(&A)
AssocingFileExtension=正在将 %2 文件扩展名与 %1 建立关联...
AutoStartProgramGroupDescription=启动组:
AutoStartProgram=自动启动 %1
AddonHostProgramNotFound=%1无法找到您所选择的文件夹。%n%n您想要继续吗？
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/Default.zh-tw.isl]---
Location: vscode-main/build/win32/i18n/Default.zh-tw.isl

```text
; *** Inno Setup version 6.0.0+ Chinese Traditional messages ***
;
; Name: John Wu, mr.johnwu@gmail.com
; Base on 5.5.3+ translations by Samuel Lee, Email: 751555749@qq.com
; Translation based on network resource
;

[LangOptions]
; The following three entries are very important. Be sure to read and 
; understand the '[LangOptions] section' topic in the help file.
; If Language Name display incorrect, uncomment next line
LanguageName=<7e41><9ad4><4e2d><6587>
LanguageID=$0404
LanguageCodepage=950
; If the language you are translating to requires special font faces or
; sizes, uncomment any of the following entries and change them accordingly.
DialogFontName=新細明體
DialogFontSize=9
TitleFontName=Arial
TitleFontSize=28
WelcomeFontName=新細明體
WelcomeFontSize=12
CopyrightFontName=新細明體
CopyrightFontSize=9

[Messages]

; *** Application titles
SetupAppTitle=安裝程式
SetupWindowTitle=%1 安裝程式
UninstallAppTitle=解除安裝
UninstallAppFullTitle=解除安裝 %1

; *** Misc. common
InformationTitle=訊息
ConfirmTitle=確認
ErrorTitle=錯誤

; *** SetupLdr messages
SetupLdrStartupMessage=這將會安裝 %1。您想要繼續嗎?
LdrCannotCreateTemp=無法建立暫存檔案。安裝程式將會結束。
LdrCannotExecTemp=無法執行暫存檔案。安裝程式將會結束。
HelpTextNote=

; *** Startup error messages
LastErrorMessage=%1%n%n錯誤 %2: %3
SetupFileMissing=安裝資料夾中遺失檔案 %1。請修正此問題或重新取得此軟體。
SetupFileCorrupt=安裝檔案已經損毀。請重新取得此軟體。
SetupFileCorruptOrWrongVer=安裝檔案已經損毀，或與安裝程式的版本不符。請重新取得此軟體。
InvalidParameter=某個無效的變量已被傳遞到了命令列:%n%n%1
SetupAlreadyRunning=安裝程式已經在執行。
WindowsVersionNotSupported=本安裝程式並不支援目前在電腦所運行的 Windows 版本。
WindowsServicePackRequired=本安裝程式需要 %1 Service Pack %2 或更新。
NotOnThisPlatform=這個程式無法在 %1 執行。
OnlyOnThisPlatform=這個程式必須在 %1 執行。
OnlyOnTheseArchitectures=這個程式只能在專門為以下處理器架構而設計的 Windows 上安裝:%n%n%1
WinVersionTooLowError=這個程式必須在 %1 版本 %2 或以上的系統執行。
WinVersionTooHighError=這個程式無法安裝在 %1 版本 %2 或以上的系統。
AdminPrivilegesRequired=您必須登入成系統管理員以安裝這個程式。
PowerUserPrivilegesRequired=您必須登入成具有系統管理員或 Power User 權限的使用者以安裝這個程式。
SetupAppRunningError=安裝程式偵測到 %1 正在執行。%n%n請關閉該程式後按 [確定] 繼續，或按 [取消] 離開。
UninstallAppRunningError=解除安裝程式偵測到 %1 正在執行。%n%n請關閉該程式後按 [確定] 繼續，或按 [取消] 離開。

; *** Startup questions
PrivilegesRequiredOverrideTitle=選擇安裝程式安裝模式
PrivilegesRequiredOverrideInstruction=選擇安裝模式
PrivilegesRequiredOverrideText1=可以為所有使用者安裝 %1 (需要系統管理權限)，或是僅為您安裝。
PrivilegesRequiredOverrideText2=可以僅為您安裝 %1，或是為所有使用者安裝 (需要系統管理權限)。
PrivilegesRequiredOverrideAllUsers=為所有使用者安裝 (&A)
PrivilegesRequiredOverrideAllUsersRecommended=為所有使用者安裝 (建議選項) (&A)
PrivilegesRequiredOverrideCurrentUser=僅為我安裝 (&M)
PrivilegesRequiredOverrideCurrentUserRecommended=僅為我安裝 (建議選項) (&M)

; *** Misc. errors
ErrorCreatingDir=安裝程式無法建立資料夾“%1”。
ErrorTooManyFilesInDir=無法在資料夾“%1”內建立檔案，因為資料夾內有太多的檔案。

; *** Setup common messages
ExitSetupTitle=結束安裝程式
ExitSetupMessage=安裝尚未完成。如果您現在結束安裝程式，這個程式將不會被安裝。%n%n您可以稍後再執行安裝程式以完成安裝程序。您現在要結束安裝程式嗎?
AboutSetupMenuItem=關於安裝程式(&A)...
AboutSetupTitle=關於安裝程式
AboutSetupMessage=%1 版本 %2%n%3%n%n%1 網址:%n%4
AboutSetupNote=
TranslatorNote=

; *** Buttons
ButtonBack=< 上一步(&B)
ButtonInstall=安裝(&I)
ButtonNext=下一步(&N)  >
ButtonOK=確定
ButtonCancel=取消
ButtonYes=是(&Y)
ButtonYesToAll=全部皆是(&A)
ButtonNo=否(&N)
ButtonNoToAll=全部皆否(&O)
ButtonFinish=完成(&F)
ButtonBrowse=瀏覽(&B)...
ButtonWizardBrowse=瀏覽(&R)...
ButtonNewFolder=建立新資料夾(&M)

; *** "Select Language" dialog messages
SelectLanguageTitle=選擇安裝語言
SelectLanguageLabel=選擇在安裝過程中使用的語言:

; *** Common wizard text
ClickNext=按 [下一步] 繼續安裝，或按 [取消] 結束安裝程式。
BeveledLabel=
BrowseDialogTitle=瀏覽資料夾
BrowseDialogLabel=在下面的資料夾列表中選擇一個資料夾，然後按 [確定]。
NewFolderName=新資料夾

; *** "Welcome" wizard page
WelcomeLabel1=歡迎使用 [name] 安裝程式
WelcomeLabel2=這個安裝程式將會安裝 [name/ver] 到您的電腦。%n%n我們強烈建議您在安裝過程中關閉其它的應用程式，以避免與安裝程式發生沖突。

; *** "Password" wizard page
WizardPassword=密碼
PasswordLabel1=這個安裝程式具有密碼保護。
PasswordLabel3=請輸入密碼，然後按 [下一步] 繼續。密碼是區分大小寫的。
PasswordEditLabel=密碼(&P):
IncorrectPassword=您輸入的密碼不正確，請重新輸入。

; *** "License Agreement" wizard page
WizardLicense=授權合約
LicenseLabel=請閱讀以下授權合約。
LicenseLabel3=請閱讀以下授權合約，您必須接受合約的各項條款才能繼續安裝。
LicenseAccepted=我同意(&A)
LicenseNotAccepted=我不同意(&D)

; *** "Information" wizard pages
WizardInfoBefore=訊息
InfoBeforeLabel=在繼續安裝之前請閱讀以下重要資訊。
InfoBeforeClickLabel=當您準備好繼續安裝，請按 [下一步]。
WizardInfoAfter=訊息
InfoAfterLabel=在繼續安裝之前請閱讀以下重要資訊。
InfoAfterClickLabel=當您準備好繼續安裝，請按 [下一步]。

; *** "User Information" wizard page
WizardUserInfo=使用者資訊
UserInfoDesc=請輸入您的資料。
UserInfoName=使用者名稱(&U):
UserInfoOrg=組織(&O):
UserInfoSerial=序號(&S):
UserInfoNameRequired=您必須輸入您的名稱。

; *** "Select Destination Location" wizard page
WizardSelectDir=選擇目的資料夾
SelectDirDesc=選擇安裝程式安裝 [name] 的位置。
SelectDirLabel3=安裝程式將會把 [name] 安裝到下面的資料夾。
SelectDirBrowseLabel=按 [下一步] 繼續，如果您想選擇另一個資料夾，請按 [瀏覽]。
DiskSpaceMBLabel=最少需要 [mb] MB 磁碟空間。
CannotInstallToNetworkDrive=安裝程式無法安裝於網絡磁碟機。
CannotInstallToUNCPath=安裝程式無法安裝於 UNC 路徑。
InvalidPath=您必須輸入完整的路徑名稱及磁碟機代碼。%n%n例如 C:\App 或 UNC 路徑格式 \\伺服器\共用資料夾。
InvalidDrive=您選取的磁碟機或 UNC 名稱不存在或無法存取，請選擇其他的目的地。
DiskSpaceWarningTitle=磁碟空間不足
DiskSpaceWarning=安裝程式需要至少 %1 KB 的磁碟空間，您所選取的磁碟只有 %2 KB 可用空間。%n%n您要繼續安裝嗎?
DirNameTooLong=資料夾名稱或路徑太長。
InvalidDirName=資料夾名稱不正確。
BadDirName32=資料夾名稱不得包含以下特殊字元:%n%n%1
DirExistsTitle=資料夾已經存在
DirExists=資料夾：%n%n%1%n%n 已經存在。仍要安裝到該資料夾嗎？
DirDoesntExistTitle=資料夾不存在
DirDoesntExist=資料夾：%n%n%1%n%n 不存在。要建立該資料夾嗎？

; *** "Select Components" wizard page
WizardSelectComponents=選擇元件
SelectComponentsDesc=選擇將會被安裝的元件。
SelectComponentsLabel2=選擇您想要安裝的元件；清除您不想安裝的元件。然後按 [下一步] 繼續安裝。
FullInstallation=完整安裝
; if possible don't translate 'Compact' as 'Minimal' (I mean 'Minimal' in your language)
CompactInstallation=最小安裝
CustomInstallation=自訂安裝
NoUninstallWarningTitle=元件已存在
NoUninstallWarning=安裝程式偵測到以下元件已經安裝在您的電腦上:%n%n%1%n%n取消選擇這些元件將不會移除它們。%n%n您仍然要繼續嗎?
ComponentSize1=%1 KB
ComponentSize2=%1 MB
ComponentsDiskSpaceMBLabel=目前的選擇需要至少 [mb] MB 磁碟空間。

; *** "Select Additional Tasks" wizard page
WizardSelectTasks=選擇附加的工作
SelectTasksDesc=選擇要執行的附加工作。
SelectTasksLabel2=選擇安裝程式在安裝 [name] 時要執行的附加工作，然後按 [下一步]。

; *** "Select Start Menu Folder" wizard page
WizardSelectProgramGroup=選擇「開始」功能表的資料夾
SelectStartMenuFolderDesc=選擇安裝程式建立程式的捷徑的位置。
SelectStartMenuFolderLabel3=安裝程式將會把程式的捷徑建立在下面的「開始」功能表資料夾。
SelectStartMenuFolderBrowseLabel=按 [下一步] 繼續，如果您想選擇另一個資料夾，請按 [瀏覽]。
MustEnterGroupName=您必須輸入一個資料夾的名稱。
GroupNameTooLong=資料夾名稱或路徑太長。
InvalidGroupName=資料夾名稱不正確。
BadGroupName=資料夾名稱不得包含下列字元:%n%n%1
NoProgramGroupCheck2=不要在「開始」功能表中建立資料夾(&D)

; *** "Ready to Install" wizard page
WizardReady=準備安裝
ReadyLabel1=安裝程式將開始安裝 [name] 到您的電腦中。
ReadyLabel2a=按下 [安裝] 繼續安裝，或按 [上一步] 重新檢視或設定各選項的內容。
ReadyLabel2b=按下 [安裝] 繼續安裝。
ReadyMemoUserInfo=使用者資訊
ReadyMemoDir=目的資料夾:
ReadyMemoType=安裝型態:
ReadyMemoComponents=選擇的元件:
ReadyMemoGroup=「開始」功能表資料夾:
ReadyMemoTasks=附加工作:

; *** "Preparing to Install" wizard page
WizardPreparing=準備安裝程式
PreparingDesc=安裝程式準備將 [name] 安裝到您的電腦上。
PreviousInstallNotCompleted=先前的安裝/ 解除安裝尚未完成，您必須重新啟動電腦以完成該安裝。%n%n在重新啟動電腦之後，請再執行這個程式來安裝 [name]。
CannotContinue=安裝程式無法繼續。請按 [取消] 離開。
ApplicationsFound=下面的應用程式正在使用安裝程式所需要更新的文檔。建議您允許安裝程式自動關閉這些應用程式。
ApplicationsFound2=下面的應用程式正在使用安裝程式所需要更新的文檔。建議您允許安裝程式自動關閉這些應用程式。當安裝過程結束後，本安裝程式將會嘗試重新開啟該應用程式。
CloseApplications=關閉應用程式(&A)
DontCloseApplications=不要關閉應用程式 (&D)
ErrorCloseApplications=安裝程式無法自動關閉所有應用程式。建議您在繼續前先關閉所有應用程式使用的檔案。

; *** "Installing" wizard page
WizardInstalling=正在安裝
InstallingLabel=請稍候，安裝程式正在將 [name] 安裝到您的電腦上

; *** "Setup Completed" wizard page
FinishedHeadingLabel=安裝完成
FinishedLabelNoIcons=安裝程式已經將 [name] 安裝在您的電腦上。
FinishedLabel=安裝程式已經將 [name] 安裝在您的電腦中，您可以選擇程式的圖示來執行該應用程式。
ClickFinish=按 [完成] 以結束安裝程式。
FinishedRestartLabel=要完成 [name] 的安裝，安裝程式必須重新啟動您的電腦。您想要現在重新啟動電腦嗎?
FinishedRestartMessage=要完成 [name] 的安裝，安裝程式必須重新啟動您的電腦。%n%n您想要現在重新啟動電腦嗎?
ShowReadmeCheck=是，我要閱讀讀我檔案。
YesRadio=是，立即重新啟動電腦(&Y)
NoRadio=否，我稍後重新啟動電腦(&N)
; used for example as 'Run MyProg.exe'
RunEntryExec=執行 %1
; used for example as 'View Readme.txt'
RunEntryShellExec=檢視 %1

; *** "Setup Needs the Next Disk" 
ChangeDiskTitle=安裝程式需要下一張磁片
SelectDiskLabel2=請插入磁片 %1，然後按 [確定]。%n%n如果檔案不在以下所顯示的資料夾之中，請輸入正確的資料夾名稱或按 [瀏覽] 選取。
PathLabel=路徑(&P):
FileNotInDir2=檔案“%1”無法在“%2”找到。請插入正確的磁片或選擇其它的資料夾。
SelectDirectoryLabel=請指定下一張磁片的位置。

; *** Installation phase messages
SetupAborted=安裝沒有完成。%n%n請更正問題後重新安裝一次。
AbortRetryIgnoreSelectAction=選取動作
AbortRetryIgnoreRetry=請再試一次 (&T)
AbortRetryIgnoreIgnore=略過錯誤並繼續 (&I)
AbortRetryIgnoreCancel=取消安裝

; *** Installation status messages
StatusClosingApplications=正在關閉應用程式...
StatusCreateDirs=正在建立資料夾...
StatusExtractFiles=正在解壓縮檔案...
StatusCreateIcons=正在建立程式集圖示...
StatusCreateIniEntries=寫入 INI 檔案的項目...
StatusCreateRegistryEntries=正在更新系統登錄...
StatusRegisterFiles=正在登錄檔案...
StatusSavingUninstall=儲存解除安裝資訊...
StatusRunProgram=正在完成安裝...
StatusRestartingApplications=正在重新開啟應用程式...
StatusRollback=正在復原變更...

; *** Misc. errors
ErrorInternal2=內部錯誤: %1
ErrorFunctionFailedNoCode=%1 失敗
ErrorFunctionFailed=%1 失敗；代碼 %2
ErrorFunctionFailedWithMessage=%1 失敗；代碼 %2.%n%3
ErrorExecutingProgram=無法執行檔案:%n%1

; *** Registry errors
ErrorRegOpenKey=無法開啟登錄鍵:%n%1\%2
ErrorRegCreateKey=無法建立登錄項目:%n%1\%2
ErrorRegWriteKey=無法變更登錄項目:%n%1\%2

; *** INI errors
ErrorIniEntry=在檔案“%1”建立 INI 項目錯誤。

; *** File copying errors
FileAbortRetryIgnoreSkipNotRecommended=略過這個檔案 (不建議) (&S)
FileAbortRetryIgnoreIgnoreNotRecommended=略過錯誤並繼續 (不建議) (&I)
SourceDoesntExist=來源檔案“%1”不存在。
SourceIsCorrupted=來源檔案已經損毀。
ExistingFileReadOnly2=無法取代現有檔案，因為檔案已標示為唯讀。
ExistingFileReadOnlyRetry=移除唯讀屬性並重試 (&R)
ExistingFileReadOnlyKeepExisting=保留現有檔案 (&K)
ErrorReadingExistingDest=讀取一個已存在的檔案時發生錯誤:
FileExists=檔案已經存在。%n%n 要讓安裝程式加以覆寫嗎?
ExistingFileNewer=存在的檔案版本比較新，建議您保留目前已存在的檔案。%n%n您要保留目前已存在的檔案嗎?
ErrorChangingAttr=在變更檔案屬性時發生錯誤:
ErrorCreatingTemp=在目的資料夾中建立檔案時發生錯誤:
ErrorReadingSource=讀取原始檔案時發生錯誤:
ErrorCopying=復制檔案時發生錯誤:
ErrorReplacingExistingFile=取代檔案時發生錯誤:
ErrorRestartReplace=重新啟動電腦後取代檔案失敗:
ErrorRenamingTemp=在目的資料夾變更檔案名稱時發生錯誤:
ErrorRegisterServer=無法注冊 DLL/OCX 檔案: %1。
ErrorRegSvr32Failed=RegSvr32 失敗；退出代碼 %1
ErrorRegisterTypeLib=無法注冊類型庫: %1。

; *** Uninstall display name markings
; used for example as 'My Program (32-bit)'
UninstallDisplayNameMark=%1 (%2)
; used for example as 'My Program (32-bit, All users)'
UninstallDisplayNameMarks=%1 (%2, %3)
UninstallDisplayNameMark32Bit=32-bit
UninstallDisplayNameMark64Bit=64-bit
UninstallDisplayNameMarkAllUsers=所有使用者
UninstallDisplayNameMarkCurrentUser=目前使用者

; *** Post-installation errors
ErrorOpeningReadme=開啟讀我檔案時發生錯誤。
ErrorRestartingComputer=安裝程式無法重新啟動電腦，請以手動方式自行重新啟動電腦。

; *** Uninstaller messages
UninstallNotFound=檔案“%1”不存在，無法移除程式。
UninstallOpenError=無法開啟檔案“%1”，無法移除程式。
UninstallUnsupportedVer=這個版本的解除安裝程式無法辨識記錄檔 “%1” 之格式，無法解除安裝。
UninstallUnknownEntry=解除安裝記錄檔中發現未知的記錄 (%1)。
ConfirmUninstall=您確定要完全移除 %1 及其相關的檔案嗎?
UninstallOnlyOnWin64=這個程式只能在 64 位元的 Windows 上解除安裝。
OnlyAdminCanUninstall=這個程式要具備系統管理員權限的使用者方可解除安裝。
UninstallStatusLabel=正在從您的電腦移除 %1 中，請稍候...
UninstalledAll=%1 已經成功從您的電腦中移除。
UninstalledMost=%1 解除安裝完成。%n%n某些檔案及元件無法移除，您可以自行刪除這些檔案。
UninstalledAndNeedsRestart=要完成 %1 的解除安裝程序，您必須重新啟動電腦。%n%n您想要現在重新啟動電腦嗎?
UninstallDataCorrupted=檔案“%1”已經損毀，無法解除安裝。

; *** Uninstallation phase messages
ConfirmDeleteSharedFileTitle=移除共用檔案
ConfirmDeleteSharedFile2=系統顯示下列共用檔案已不再被任何程式所使用，您要移除這些檔案嗎?%n%n%1%n%n倘若您移除了以上檔案但仍有程式需要使用它們，將造成這些程式無法正常執行，因此您若無法確定請選擇 [否]。保留這些檔案在您的系統中不會造成任何損害。
SharedFileNameLabel=檔案名稱:
SharedFileLocationLabel=位置:
WizardUninstalling=解除安裝狀態
StatusUninstalling=正在解除安裝 %1...

; *** Shutdown block reasons
ShutdownBlockReasonInstallingApp=正在安裝 %1.
ShutdownBlockReasonUninstallingApp=正在解除安裝 %1.

; The custom messages below aren't used by Setup itself, but if you make
; use of them in your scripts, you'll want to translate them.

[CustomMessages]

NameAndVersion=%1 版本 %2
AdditionalIcons=附加圖示:
CreateDesktopIcon=建立桌面圖示(&D)
CreateQuickLaunchIcon=建立快速啟動圖示(&Q)
ProgramOnTheWeb=%1 的網站
UninstallProgram=解除安裝 %1
LaunchProgram=啟動 %1
AssocFileExtension=將 %1 與檔案副檔名 %2 產生關聯(&A)
AssocingFileExtension=正在將 %1 與檔案副檔名 %2 產生關聯...
AutoStartProgramGroupDescription=開啟:
AutoStartProgram=自動開啟 %1
AddonHostProgramNotFound=%1 無法在您所選的資料夾中找到。%n%n您是否還要繼續？
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/messages.de.isl]---
Location: vscode-main/build/win32/i18n/messages.de.isl

```text
[CustomMessages]
AddContextMenuFiles=Aktion "Mit %1 �ffnen" dem Dateikontextmen� von Windows-Explorer hinzuf�gen
AddContextMenuFolders=Aktion "Mit %1 �ffnen" dem Verzeichniskontextmen� von Windows-Explorer hinzuf�gen
AssociateWithFiles=%1 als Editor f�r unterst�tzte Dateitypen registrieren
AddToPath=Zu PATH hinzuf�gen (nach dem Neustart verf�gbar)
RunAfter=%1 nach der Installation ausf�hren
Other=Andere:
SourceFile=%1-Quelldatei
OpenWithCodeContextMenu=Mit %1 �ffnen
UpdatingVisualStudioCode=Visual Studio Code wird aktualisiert...
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/messages.en.isl]---
Location: vscode-main/build/win32/i18n/messages.en.isl

```text
[Messages]
FinishedLabel=Setup has finished installing [name] on your computer. The application may be launched by selecting the installed shortcuts.
ConfirmUninstall=Are you sure you want to completely remove %1 and all of its components?

[CustomMessages]
AdditionalIcons=Additional icons:
CreateDesktopIcon=Create a &desktop icon
CreateQuickLaunchIcon=Create a &Quick Launch icon
AddContextMenuFiles=Add "Open with %1" action to Windows Explorer file context menu
AddContextMenuFolders=Add "Open with %1" action to Windows Explorer directory context menu
AssociateWithFiles=Register %1 as an editor for supported file types
AddToPath=Add to PATH (requires shell restart)
RunAfter=Run %1 after installation
Other=Other:
SourceFile=%1 Source File
OpenWithCodeContextMenu=Open w&ith %1
UpdatingVisualStudioCode=Updating Visual Studio Code...
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/messages.es.isl]---
Location: vscode-main/build/win32/i18n/messages.es.isl

```text
[CustomMessages]
AddContextMenuFiles=Agregar la acci�n "Abrir con %1" al men� contextual de archivo del Explorador de Windows
AddContextMenuFolders=Agregar la acci�n "Abrir con %1" al men� contextual de directorio del Explorador de Windows
AssociateWithFiles=Registrar %1 como editor para tipos de archivo admitidos
AddToPath=Agregar a PATH (disponible despu�s de reiniciar)
RunAfter=Ejecutar %1 despu�s de la instalaci�n
Other=Otros:
SourceFile=Archivo de origen %1
OpenWithCodeContextMenu=Abrir &con %1
UpdatingVisualStudioCode=Actualizando Visual Studio Code...
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/messages.fr.isl]---
Location: vscode-main/build/win32/i18n/messages.fr.isl

```text
[CustomMessages]
AddContextMenuFiles=Ajouter l'action "Ouvrir avec %1" au menu contextuel de fichier de l'Explorateur Windows
AddContextMenuFolders=Ajouter l'action "Ouvrir avec %1" au menu contextuel de r�pertoire de l'Explorateur Windows
AssociateWithFiles=Inscrire %1 en tant qu'�diteur pour les types de fichier pris en charge
AddToPath=Ajouter � PATH (disponible apr�s le red�marrage)
RunAfter=Ex�cuter %1 apr�s l'installation
Other=Autre�:
SourceFile=Fichier source %1
OpenWithCodeContextMenu=Ouvrir avec %1
UpdatingVisualStudioCode=Mise � jour de Visual Studio Code...
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/messages.hu.isl]---
Location: vscode-main/build/win32/i18n/messages.hu.isl

```text
[CustomMessages]
AddContextMenuFiles="Megnyit�s a k�vetkez�vel: %1" parancs hozz�ad�sa a f�jlok helyi men�j�hez a Windows Int�z�ben
AddContextMenuFolders="Megnyit�s a k�vetkez�vel: %1" parancs hozz�ad�sa a mapp�k helyi men�j�hez a Windows Int�z�ben
AssociateWithFiles=%1 regisztr�l�sa szerkeszt�k�nt a t�mogatott f�jlt�pusokhoz
AddToPath=Hozz�ad�s a PATH-hoz (�jraind�t�s ut�n lesz el�rhet�)
RunAfter=%1 ind�t�sa a telep�t�s ut�n
Other=Egy�b:
SourceFile=%1 forr�sf�jl
OpenWithCodeContextMenu=Megnyit�s a k�vetkez�vel: %1
UpdatingVisualStudioCode=A Visual Studio Code friss�t�se...
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/messages.it.isl]---
Location: vscode-main/build/win32/i18n/messages.it.isl

```text
[CustomMessages]
AddContextMenuFiles=Aggiungi azione "Apri con %1" al menu di scelta rapida file di Esplora risorse
AddContextMenuFolders=Aggiungi azione "Apri con %1" al menu di scelta rapida directory di Esplora risorse
AssociateWithFiles=Registra %1 come editor per i tipi di file supportati
AddToPath=Aggiungi a PATH (disponibile dopo il riavvio)
RunAfter=Esegui %1 dopo l'installazione
Other=Altro:
SourceFile=File di origine %1
OpenWithCodeContextMenu=Apri con %1
UpdatingVisualStudioCode=Aggiornamento di Visual Studio Code...
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/messages.ja.isl]---
Location: vscode-main/build/win32/i18n/messages.ja.isl

```text
[CustomMessages]
AddContextMenuFiles=�G�N�X�v���[���[�̃t�@�C�� �R���e�L�X�g ���j���[�� [%1 �ŊJ��] �A�N�V������ǉ�����
AddContextMenuFolders=�G�N�X�v���[���[�̃f�B���N�g�� �R���e�L�X�g ���j���[�� [%1 �ŊJ��] �A�N�V������ǉ�����
AssociateWithFiles=�T�|�[�g����Ă���t�@�C���̎�ނ̃G�f�B�^�[�Ƃ��āA%1 ��o�^����
AddToPath=PATH �ւ̒ǉ��i�ċN����Ɏg�p�\�j
RunAfter=�C���X�g�[����� %1 ����s����
Other=���̑�:
SourceFile=%1 �\�[�X �t�@�C��
OpenWithCodeContextMenu=%1 �ŊJ��
UpdatingVisualStudioCode=Visual Studio Code ��X�V���Ă��܂�...
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/messages.ko.isl]---
Location: vscode-main/build/win32/i18n/messages.ko.isl

```text
[CustomMessages]
AddContextMenuFiles="%1(��)�� ����" �۾��� Windows Ž���� ������ ��Ȳ�� �´� �޴��� �߰�
AddContextMenuFolders="%1(��)�� ����" �۾��� Windows Ž���� ���͸��� ��Ȳ�� �´� �޴��� �߰�
AssociateWithFiles=%1��(��) �����Ǵ� ���� ���Ŀ� ���� ������� ����մϴ�.
AddToPath=PATH�� �߰�(�ٽ� ������ �� ��� ����)
RunAfter=��ġ �� %1 ����
Other=��Ÿ:
SourceFile=%1 ���� ����
OpenWithCodeContextMenu=%1(��)�� ����
UpdatingVisualStudioCode=Visual Studio Code ������Ʈ ��...
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/messages.pt-br.isl]---
Location: vscode-main/build/win32/i18n/messages.pt-br.isl

```text
[CustomMessages]
AddContextMenuFiles=Adicione a a��o "Abrir com %1" ao menu de contexto de arquivo do Windows Explorer
AddContextMenuFolders=Adicione a a��o "Abrir com %1" ao menu de contexto de diret�rio do Windows Explorer
AssociateWithFiles=Registre %1 como um editor para tipos de arquivos suportados
AddToPath=Adicione em PATH (dispon�vel ap�s reiniciar)
RunAfter=Executar %1 ap�s a instala��o
Other=Outros:
SourceFile=Arquivo Fonte %1
OpenWithCodeContextMenu=Abrir com %1
UpdatingVisualStudioCode=Atualizando o Visual Studio Code...
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/messages.ru.isl]---
Location: vscode-main/build/win32/i18n/messages.ru.isl

```text
[CustomMessages]
AddContextMenuFiles=�������� �������� "������� � ������� %1" � ����������� ���� ����� ���������� Windows
AddContextMenuFolders=�������� �������� "������� � ������� %1" � ����������� ���� �������� ����������
AssociateWithFiles=���������������� %1 � �������� ��������� ��� �������������� ����� ������
AddToPath=�������� � PATH (�������� ����� ������������)
RunAfter=��������� %1 ����� ���������
Other=������:
SourceFile=�������� ���� %1
OpenWithCodeContextMenu=������� � ������� %1
UpdatingVisualStudioCode=���������� Visual Studio Code...
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/messages.tr.isl]---
Location: vscode-main/build/win32/i18n/messages.tr.isl

```text
[CustomMessages]
AddContextMenuFiles=Windows Gezgini ba�lam men�s�ne "%1 �le A�" eylemini ekle
AddContextMenuFolders=Windows Gezgini dizin ba�lam men�s�ne "%1 �le A�" eylemini ekle
AssociateWithFiles=%1 uygulamas�n� desteklenen dosya t�rleri i�in bir d�zenleyici olarak kay�t et
AddToPath=PATH'e ekle (yeniden ba�latt�ktan sonra kullan�labilir)
RunAfter=Kurulumdan sonra %1 uygulamas�n� �al��t�r.
Other=Di�er:
SourceFile=%1 Kaynak Dosyas�
OpenWithCodeContextMenu=%1 �le A�
UpdatingVisualStudioCode=Visual Studio Code g�ncelleniyor...
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/messages.zh-cn.isl]---
Location: vscode-main/build/win32/i18n/messages.zh-cn.isl

```text
[CustomMessages]
AddContextMenuFiles=����ͨ�� %1 �򿪡�������ӵ� Windows ��Դ�������ļ������Ĳ˵�
AddContextMenuFolders=����ͨ�� %1 �򿪡�������ӵ� Windows ��Դ������Ŀ¼�����Ĳ˵�
AssociateWithFiles=�� %1 ע��Ϊ��֧�ֵ��ļ����͵ı༭��
AddToPath=��ӵ� PATH (�������Ч)
RunAfter=��װ������ %1
Other=����:
SourceFile=%1 Դ�ļ�
OpenWithCodeContextMenu=ͨ�� %1 ��
UpdatingVisualStudioCode=���ڸ��� Visual Studio Code...
```

--------------------------------------------------------------------------------

---[FILE: build/win32/i18n/messages.zh-tw.isl]---
Location: vscode-main/build/win32/i18n/messages.zh-tw.isl

```text
[CustomMessages]
AddContextMenuFiles=�N [�H %1 �}��] �ʧ@�[�J Windows �ɮ��`���ɮת��ާ@�\����
AddContextMenuFolders=�N [�H %1 �}��] �ʧ@�[�J Windows �ɮ��`�ޥؿ����ާ@�\����
AssociateWithFiles=�w��䴩���ɮ������N %1 ���U���s�边
AddToPath=�[�J PATH �� (���s�Ұʫ�ͮ�)
RunAfter=�w�˫���� %1
Other=��L:
SourceFile=%1 �ӷ��ɮ�
OpenWithCodeContextMenu=�H %1 �}��
UpdatingVisualStudioCode=���b��s Visual Studio Code...
```

--------------------------------------------------------------------------------

---[FILE: cli/build.rs]---
Location: vscode-main/cli/build.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const FILE_HEADER: &str = "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/";

use std::{
	collections::HashMap,
	env, fs, io,
	path::{Path, PathBuf},
	process::{self},
	str::FromStr,
};

use serde::{de::DeserializeOwned, Deserialize};
use serde_json::Value;

fn main() {
	let files = enumerate_source_files().expect("expected to enumerate files");
	ensure_file_headers(&files).expect("expected to ensure file headers");
	apply_build_environment_variables();
}

fn camel_case_to_constant_case(key: &str) -> String {
	let mut output = String::new();
	let mut prev_upper = false;
	for c in key.chars() {
		if c.is_uppercase() {
			if prev_upper {
				output.push(c.to_ascii_lowercase());
			} else {
				output.push('_');
				output.push(c.to_ascii_uppercase());
			}
			prev_upper = true;
		} else if c.is_lowercase() {
			output.push(c.to_ascii_uppercase());
			prev_upper = false;
		} else {
			output.push(c);
			prev_upper = false;
		}
	}

	output
}

fn set_env_vars_from_map_keys(prefix: &str, map: impl IntoIterator<Item = (String, Value)>) {
	let mut win32_app_ids = vec![];

	for (key, value) in map {
		//#region special handling
		let value = match key.as_str() {
			"tunnelServerQualities" | "serverLicense" => {
				Value::String(serde_json::to_string(&value).unwrap())
			}
			"nameLong" => {
				if let Value::String(s) = &value {
					let idx = s.find(" - ");
					println!(
						"cargo:rustc-env=VSCODE_CLI_QUALITYLESS_PRODUCT_NAME={}",
						idx.map(|i| &s[..i]).unwrap_or(s)
					);
				}

				value
			}
			"tunnelApplicationConfig" => {
				if let Value::Object(v) = value {
					set_env_vars_from_map_keys(&format!("{}_{}", prefix, "TUNNEL"), v);
				}
				continue;
			}
			_ => value,
		};
		if key.contains("win32") && key.contains("AppId") {
			if let Value::String(s) = value {
				win32_app_ids.push(s);
				continue;
			}
		}
		//#endregion

		if let Value::String(s) = value {
			println!(
				"cargo:rustc-env={}_{}={}",
				prefix,
				camel_case_to_constant_case(&key),
				s
			);
		}
	}

	if !win32_app_ids.is_empty() {
		println!(
			"cargo:rustc-env=VSCODE_CLI_WIN32_APP_IDS={}",
			win32_app_ids.join(",")
		);
	}
}

fn read_json_from_path<T>(path: &Path) -> T
where
	T: DeserializeOwned,
{
	let mut file = fs::File::open(path).expect("failed to open file");
	serde_json::from_reader(&mut file).expect("failed to deserialize JSON")
}

fn apply_build_from_product_json(path: &Path) {
	let json: HashMap<String, Value> = read_json_from_path(path);
	set_env_vars_from_map_keys("VSCODE_CLI", json);
}

#[derive(Deserialize)]
struct PackageJson {
	pub version: String,
}

fn apply_build_environment_variables() {
	let repo_dir = env::current_dir().unwrap().join("..");
	let package_json = read_json_from_path::<PackageJson>(&repo_dir.join("package.json"));
	println!(
		"cargo:rustc-env=VSCODE_CLI_VERSION={}",
		package_json.version
	);

	match env::var("VSCODE_CLI_PRODUCT_JSON") {
		Ok(v) => {
			let path = if cfg!(windows) {
				PathBuf::from_str(&v.replace('/', "\\")).unwrap()
			} else {
				PathBuf::from_str(&v).unwrap()
			};
			println!("cargo:warning=loading product.json from <{path:?}>");
			apply_build_from_product_json(&path);
		}

		Err(_) => {
			apply_build_from_product_json(&repo_dir.join("product.json"));

			let overrides = repo_dir.join("product.overrides.json");
			if overrides.exists() {
				apply_build_from_product_json(&overrides);
			}
		}
	};
}

fn ensure_file_headers(files: &[PathBuf]) -> Result<(), io::Error> {
	let mut ok = true;

	let crlf_header_str = str::replace(FILE_HEADER, "\n", "\r\n");
	let crlf_header = crlf_header_str.as_bytes();
	let lf_header = FILE_HEADER.as_bytes();
	for file in files {
		let contents = fs::read(file)?;

		if !(contents.starts_with(lf_header) || contents.starts_with(crlf_header)) {
			eprintln!("File missing copyright header: {}", file.display());
			ok = false;
		}
	}

	if !ok {
		process::exit(1);
	}

	Ok(())
}

/// Gets all "rs" files in the source directory
fn enumerate_source_files() -> Result<Vec<PathBuf>, io::Error> {
	let mut files = vec![];
	let mut queue = vec![];

	let current_dir = env::current_dir()?.join("src");
	queue.push(current_dir);

	while !queue.is_empty() {
		for entry in fs::read_dir(queue.pop().unwrap())? {
			let entry = entry?;
			let ftype = entry.file_type()?;
			if ftype.is_dir() {
				queue.push(entry.path());
			} else if ftype.is_file() && entry.file_name().to_string_lossy().ends_with(".rs") {
				files.push(entry.path());
			}
		}
	}

	Ok(files)
}
```

--------------------------------------------------------------------------------

---[FILE: cli/Cargo.lock]---
Location: vscode-main/cli/Cargo.lock

```text
# This file is automatically @generated by Cargo.
# It is not intended for manual editing.
version = 4

[[package]]
name = "addr2line"
version = "0.21.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8a30b2e23b9e17a9f90641c7ab1549cd9b44f296d3ccbf309d2863cfe398a0cb"
dependencies = [
 "gimli",
]

[[package]]
name = "adler"
version = "1.0.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f26201604c87b1e01bd3d98f8d5d9a8fcbb815e8cedb41ffccbeb4bf593a35fe"

[[package]]
name = "aho-corasick"
version = "1.1.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8e60d3430d3a69478ad0993f19238d2df97c507009a52b3c10addcd7f6bcb916"
dependencies = [
 "memchr",
]

[[package]]
name = "android-tzdata"
version = "0.1.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e999941b234f3131b00bc13c22d06e8c5ff726d1b6318ac7eb276997bbb4fef0"

[[package]]
name = "android_system_properties"
version = "0.1.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "819e7219dbd41043ac279b19830f2efc897156490d7fd6ea916720117ee66311"
dependencies = [
 "libc",
]

[[package]]
name = "anstream"
version = "0.6.14"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "418c75fa768af9c03be99d17643f93f79bbba589895012a80e3452a19ddda15b"
dependencies = [
 "anstyle",
 "anstyle-parse",
 "anstyle-query",
 "anstyle-wincon",
 "colorchoice",
 "is_terminal_polyfill",
 "utf8parse",
]

[[package]]
name = "anstyle"
version = "1.0.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "038dfcf04a5feb68e9c60b21c9625a54c2c0616e79b72b0fd87075a056ae1d1b"

[[package]]
name = "anstyle-parse"
version = "0.2.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c03a11a9034d92058ceb6ee011ce58af4a9bf61491aa7e1e59ecd24bd40d22d4"
dependencies = [
 "utf8parse",
]

[[package]]
name = "anstyle-query"
version = "1.0.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a64c907d4e79225ac72e2a354c9ce84d50ebb4586dee56c82b3ee73004f537f5"
dependencies = [
 "windows-sys 0.52.0",
]

[[package]]
name = "anstyle-wincon"
version = "3.0.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "61a38449feb7068f52bb06c12759005cf459ee52bb4adc1d5a7c4322d716fb19"
dependencies = [
 "anstyle",
 "windows-sys 0.52.0",
]

[[package]]
name = "async-broadcast"
version = "0.5.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7c48ccdbf6ca6b121e0f586cbc0e73ae440e56c67c30fa0873b4e110d9c26d2b"
dependencies = [
 "event-listener 2.5.3",
 "futures-core",
]

[[package]]
name = "async-channel"
version = "2.3.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "89b47800b0be77592da0afd425cc03468052844aff33b84e33cc696f64e77b6a"
dependencies = [
 "concurrent-queue",
 "event-listener-strategy 0.5.2",
 "futures-core",
 "pin-project-lite",
]

[[package]]
name = "async-io"
version = "1.13.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0fc5b45d93ef0529756f812ca52e44c221b35341892d3dcc34132ac02f3dd2af"
dependencies = [
 "async-lock 2.8.0",
 "autocfg",
 "cfg-if",
 "concurrent-queue",
 "futures-lite 1.13.0",
 "log",
 "parking",
 "polling 2.8.0",
 "rustix 0.37.27",
 "slab",
 "socket2 0.4.10",
 "waker-fn",
]

[[package]]
name = "async-io"
version = "2.3.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "dcccb0f599cfa2f8ace422d3555572f47424da5648a4382a9dd0310ff8210884"
dependencies = [
 "async-lock 3.3.0",
 "cfg-if",
 "concurrent-queue",
 "futures-io",
 "futures-lite 2.3.0",
 "parking",
 "polling 3.7.0",
 "rustix 0.38.34",
 "slab",
 "tracing",
 "windows-sys 0.52.0",
]

[[package]]
name = "async-lock"
version = "2.8.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "287272293e9d8c41773cec55e365490fe034813a2f172f502d6ddcf75b2f582b"
dependencies = [
 "event-listener 2.5.3",
]

[[package]]
name = "async-lock"
version = "3.3.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d034b430882f8381900d3fe6f0aaa3ad94f2cb4ac519b429692a1bc2dda4ae7b"
dependencies = [
 "event-listener 4.0.3",
 "event-listener-strategy 0.4.0",
 "pin-project-lite",
]

[[package]]
name = "async-process"
version = "1.8.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ea6438ba0a08d81529c69b36700fa2f95837bfe3e776ab39cde9c14d9149da88"
dependencies = [
 "async-io 1.13.0",
 "async-lock 2.8.0",
 "async-signal",
 "blocking",
 "cfg-if",
 "event-listener 3.1.0",
 "futures-lite 1.13.0",
 "rustix 0.38.34",
 "windows-sys 0.48.0",
]

[[package]]
name = "async-recursion"
version = "1.1.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3b43422f69d8ff38f95f1b2bb76517c91589a924d1559a0e935d7c8ce0274c11"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "async-signal"
version = "0.2.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "afe66191c335039c7bb78f99dc7520b0cbb166b3a1cb33a03f53d8a1c6f2afda"
dependencies = [
 "async-io 2.3.2",
 "async-lock 3.3.0",
 "atomic-waker",
 "cfg-if",
 "futures-core",
 "futures-io",
 "rustix 0.38.34",
 "signal-hook-registry",
 "slab",
 "windows-sys 0.52.0",
]

[[package]]
name = "async-task"
version = "4.7.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8b75356056920673b02621b35afd0f7dda9306d03c79a30f5c56c44cf256e3de"

[[package]]
name = "async-trait"
version = "0.1.80"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c6fa2087f2753a7da8cc1c0dbfcf89579dd57458e36769de5ac750b4671737ca"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "atomic-waker"
version = "1.1.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1505bd5d3d116872e7271a6d4e16d81d0c8570876c8de68093a09ac269d8aac0"

[[package]]
name = "autocfg"
version = "1.3.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0c4b4d0bd25bd0b74681c0ad21497610ce1b7c91b1022cd21c80c6fbdd9476b0"

[[package]]
name = "backtrace"
version = "0.3.71"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "26b05800d2e817c8b3b4b54abd461726265fa9789ae34330622f2db9ee696f9d"
dependencies = [
 "addr2line",
 "cc",
 "cfg-if",
 "libc",
 "miniz_oxide",
 "object",
 "rustc-demangle",
]

[[package]]
name = "base64"
version = "0.21.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9d297deb1925b89f2ccc13d7635fa0714f12c87adce1c75356b39ca9b7178567"

[[package]]
name = "bit-vec"
version = "0.6.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "349f9b6a179ed607305526ca489b34ad0a41aed5f7980fa90eb03160b69598fb"

[[package]]
name = "bitflags"
version = "1.3.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bef38d45163c2f1dde094a7dfd33ccf595c92905c8f8f4fdc18d06fb1037718a"

[[package]]
name = "bitflags"
version = "2.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "cf4b9d6a944f767f8e5e0db018570623c85f3d925ac718db4e06d0187adb21c1"

[[package]]
name = "block-buffer"
version = "0.10.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3078c7629b62d3f0439517fa394996acacc5cbc91c5a20d8c658e77abd503a71"
dependencies = [
 "generic-array",
]

[[package]]
name = "block-padding"
version = "0.3.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a8894febbff9f758034a5b8e12d87918f56dfc64a8e1fe757d65e29041538d93"
dependencies = [
 "generic-array",
]

[[package]]
name = "blocking"
version = "1.6.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "495f7104e962b7356f0aeb34247aca1fe7d2e783b346582db7f2904cb5717e88"
dependencies = [
 "async-channel",
 "async-lock 3.3.0",
 "async-task",
 "futures-io",
 "futures-lite 2.3.0",
 "piper",
]

[[package]]
name = "bumpalo"
version = "3.16.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "79296716171880943b8470b5f8d03aa55eb2e645a4874bdbb28adb49162e012c"

[[package]]
name = "byteorder"
version = "1.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1fd0f2584146f6f2ef48085050886acf353beff7305ebd1ae69500e27c67f64b"

[[package]]
name = "bytes"
version = "1.6.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "514de17de45fdb8dc022b1a7975556c53c86f9f0aa5f534b98977b171857c2c9"

[[package]]
name = "cc"
version = "1.0.98"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "41c270e7540d725e65ac7f1b212ac8ce349719624d7bcff99f8e2e488e8cf03f"

[[package]]
name = "cfg-if"
version = "1.0.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "baf1de4339761588bc0619e3cbc0120ee582ebb74b53b4efbf79117bd2da40fd"

[[package]]
name = "chrono"
version = "0.4.38"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a21f936df1771bf62b77f047b726c4625ff2e8aa607c01ec06e5a05bd8463401"
dependencies = [
 "android-tzdata",
 "iana-time-zone",
 "num-traits",
 "serde",
 "windows-targets 0.52.5",
]

[[package]]
name = "clap"
version = "4.5.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "90bc066a67923782aa8515dbaea16946c5bcc5addbd668bb80af688e53e548a0"
dependencies = [
 "clap_builder",
 "clap_derive",
]

[[package]]
name = "clap_builder"
version = "4.5.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ae129e2e766ae0ec03484e609954119f123cc1fe650337e155d03b022f24f7b4"
dependencies = [
 "anstream",
 "anstyle",
 "clap_lex",
 "strsim",
]

[[package]]
name = "clap_derive"
version = "4.5.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "528131438037fd55894f62d6e9f068b8f45ac57ffa77517819645d10aed04f64"
dependencies = [
 "heck",
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "clap_lex"
version = "0.7.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "98cc8fbded0c607b7ba9dd60cd98df59af97e84d24e49c8557331cfc26d301ce"

[[package]]
name = "code-cli"
version = "0.1.0"
dependencies = [
 "async-trait",
 "base64",
 "bytes",
 "cfg-if",
 "chrono",
 "clap",
 "clap_lex",
 "console",
 "const_format",
 "core-foundation",
 "dialoguer",
 "dirs 5.0.1",
 "flate2",
 "futures",
 "gethostname",
 "hyper",
 "indicatif",
 "keyring",
 "lazy_static",
 "libc",
 "log",
 "open",
 "opentelemetry",
 "pin-project",
 "rand 0.8.5",
 "regex",
 "reqwest",
 "rmp-serde",
 "serde",
 "serde_bytes",
 "serde_json",
 "sha2",
 "shell-escape",
 "sysinfo",
 "tar",
 "tempfile",
 "thiserror",
 "tokio",
 "tokio-util",
 "tunnels",
 "url",
 "uuid",
 "winapi",
 "winreg 0.50.0",
 "zbus",
 "zip",
]

[[package]]
name = "colorchoice"
version = "1.0.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0b6a852b24ab71dffc585bcb46eaf7959d175cb865a7152e35b348d1b2960422"

[[package]]
name = "concurrent-queue"
version = "2.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4ca0197aee26d1ae37445ee532fefce43251d24cc7c166799f4d46817f1d3973"
dependencies = [
 "crossbeam-utils",
]

[[package]]
name = "console"
version = "0.15.8"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0e1f83fc076bd6dd27517eacdf25fef6c4dfe5f1d7448bafaaf3a26f13b5e4eb"
dependencies = [
 "encode_unicode",
 "lazy_static",
 "libc",
 "unicode-width",
 "windows-sys 0.52.0",
]

[[package]]
name = "const_format"
version = "0.2.32"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e3a214c7af3d04997541b18d432afaff4c455e79e2029079647e72fc2bd27673"
dependencies = [
 "const_format_proc_macros",
]

[[package]]
name = "const_format_proc_macros"
version = "0.2.32"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c7f6ff08fd20f4f299298a28e2dfa8a8ba1036e6cd2460ac1de7b425d76f2500"
dependencies = [
 "proc-macro2",
 "quote",
 "unicode-xid",
]

[[package]]
name = "core-foundation"
version = "0.9.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "91e195e091a93c46f7102ec7818a2aa394e1e1771c3ab4825963fa03e45afb8f"
dependencies = [
 "core-foundation-sys",
 "libc",
]

[[package]]
name = "core-foundation-sys"
version = "0.8.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "06ea2b9bc92be3c2baa9334a323ebca2d6f074ff852cd1d7b11064035cd3868f"

[[package]]
name = "cpufeatures"
version = "0.2.12"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "53fe5e26ff1b7aef8bca9c6080520cfb8d9333c7568e1829cef191a9723e5504"
dependencies = [
 "libc",
]

[[package]]
name = "crc32fast"
version = "1.4.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "58ebf8d6963185c7625d2c3c3962d99eb8936637b1427536d21dc36ae402ebad"
dependencies = [
 "cfg-if",
]

[[package]]
name = "crossbeam-channel"
version = "0.5.15"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "82b8f8f868b36967f9606790d1903570de9ceaf870a7bf9fbbd3016d636a2cb2"
dependencies = [
 "crossbeam-utils",
]

[[package]]
name = "crossbeam-utils"
version = "0.8.20"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "22ec99545bb0ed0ea7bb9b8e1e9122ea386ff8a48c0922e43f36d45ab09e0e80"

[[package]]
name = "crypto-common"
version = "0.1.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1bfb12502f3fc46cca1bb51ac28df9d618d813cdc3d2f25b9fe775a34af26bb3"
dependencies = [
 "generic-array",
 "typenum",
]

[[package]]
name = "data-encoding"
version = "2.6.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e8566979429cf69b49a5c740c60791108e86440e8be149bbea4fe54d2c32d6e2"

[[package]]
name = "deranged"
version = "0.3.11"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b42b6fa04a440b495c8b04d0e71b707c585f83cb9cb28cf8cd0d976c315e31b4"
dependencies = [
 "powerfmt",
]

[[package]]
name = "derivative"
version = "2.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "fcc3dd5e9e9c0b295d6e1e4d811fb6f157d5ffd784b8d202fc62eac8035a770b"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 1.0.109",
]

[[package]]
name = "dialoguer"
version = "0.10.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "59c6f2989294b9a498d3ad5491a79c6deb604617378e1cdc4bfc1c1361fe2f87"
dependencies = [
 "console",
 "shell-words",
 "tempfile",
 "zeroize",
]

[[package]]
name = "digest"
version = "0.10.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9ed9a281f7bc9b7576e61468ba615a66a5c8cfdff42420a70aa82701a3b1e292"
dependencies = [
 "block-buffer",
 "crypto-common",
 "subtle",
]

[[package]]
name = "dirs"
version = "4.0.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ca3aa72a6f96ea37bbc5aa912f6788242832f75369bdfdadcb0e38423f100059"
dependencies = [
 "dirs-sys 0.3.7",
]

[[package]]
name = "dirs"
version = "5.0.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "44c45a9d03d6676652bcb5e724c7e988de1acad23a711b5217ab9cbecbec2225"
dependencies = [
 "dirs-sys 0.4.1",
]

[[package]]
name = "dirs-sys"
version = "0.3.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1b1d1d91c932ef41c0f2663aa8b0ca0342d444d842c06914aa0a7e352d0bada6"
dependencies = [
 "libc",
 "redox_users",
 "winapi",
]

[[package]]
name = "dirs-sys"
version = "0.4.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "520f05a5cbd335fae5a99ff7a6ab8627577660ee5cfd6a94a6a929b52ff0321c"
dependencies = [
 "libc",
 "option-ext",
 "redox_users",
 "windows-sys 0.48.0",
]

[[package]]
name = "displaydoc"
version = "0.2.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "97369cbbc041bc366949bc74d34658d6cda5621039731c6310521892a3a20ae0"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "encode_unicode"
version = "0.3.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a357d28ed41a50f9c765dbfe56cbc04a64e53e5fc58ba79fbc34c10ef3df831f"

[[package]]
name = "encoding_rs"
version = "0.8.34"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b45de904aa0b010bce2ab45264d0631681847fa7b6f2eaa7dab7619943bc4f59"
dependencies = [
 "cfg-if",
]

[[package]]
name = "enumflags2"
version = "0.7.9"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3278c9d5fb675e0a51dabcf4c0d355f692b064171535ba72361be1528a9d8e8d"
dependencies = [
 "enumflags2_derive",
 "serde",
]

[[package]]
name = "enumflags2_derive"
version = "0.7.9"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5c785274071b1b420972453b306eeca06acf4633829db4223b58a2a8c5953bc4"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "equivalent"
version = "1.0.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5443807d6dff69373d433ab9ef5378ad8df50ca6298caf15de6e52e24aaf54d5"

[[package]]
name = "errno"
version = "0.3.9"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "534c5cf6194dfab3db3242765c03bbe257cf92f22b38f6bc0c58d59108a820ba"
dependencies = [
 "libc",
 "windows-sys 0.52.0",
]

[[package]]
name = "event-listener"
version = "2.5.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0206175f82b8d6bf6652ff7d71a1e27fd2e4efde587fd368662814d6ec1d9ce0"

[[package]]
name = "event-listener"
version = "3.1.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d93877bcde0eb80ca09131a08d23f0a5c18a620b01db137dba666d18cd9b30c2"
dependencies = [
 "concurrent-queue",
 "parking",
 "pin-project-lite",
]

[[package]]
name = "event-listener"
version = "4.0.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "67b215c49b2b248c855fb73579eb1f4f26c38ffdc12973e20e07b91d78d5646e"
dependencies = [
 "concurrent-queue",
 "parking",
 "pin-project-lite",
]

[[package]]
name = "event-listener"
version = "5.3.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6d9944b8ca13534cdfb2800775f8dd4902ff3fc75a50101466decadfdf322a24"
dependencies = [
 "concurrent-queue",
 "parking",
 "pin-project-lite",
]

[[package]]
name = "event-listener-strategy"
version = "0.4.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "958e4d70b6d5e81971bebec42271ec641e7ff4e170a6fa605f2b8a8b65cb97d3"
dependencies = [
 "event-listener 4.0.3",
 "pin-project-lite",
]

[[package]]
name = "event-listener-strategy"
version = "0.5.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0f214dc438f977e6d4e3500aaa277f5ad94ca83fbbd9b1a15713ce2344ccc5a1"
dependencies = [
 "event-listener 5.3.0",
 "pin-project-lite",
]

[[package]]
name = "fastrand"
version = "1.9.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e51093e27b0797c359783294ca4f0a911c270184cb10f85783b118614a1501be"
dependencies = [
 "instant",
]

[[package]]
name = "fastrand"
version = "2.1.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9fc0510504f03c51ada170672ac806f1f105a88aa97a5281117e1ddc3368e51a"

[[package]]
name = "filetime"
version = "0.2.23"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1ee447700ac8aa0b2f2bd7bc4462ad686ba06baa6727ac149a2d6277f0d240fd"
dependencies = [
 "cfg-if",
 "libc",
 "redox_syscall 0.4.1",
 "windows-sys 0.52.0",
]

[[package]]
name = "flate2"
version = "1.0.30"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5f54427cfd1c7829e2a139fcefea601bf088ebca651d2bf53ebc600eac295dae"
dependencies = [
 "crc32fast",
 "libz-sys",
 "miniz_oxide",
]

[[package]]
name = "fnv"
version = "1.0.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3f9eec918d3f24069decb9af1554cad7c880e2da24a9afd88aca000531ab82c1"

[[package]]
name = "foreign-types"
version = "0.3.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f6f339eb8adc052cd2ca78910fda869aefa38d22d5cb648e6485e4d3fc06f3b1"
dependencies = [
 "foreign-types-shared",
]

[[package]]
name = "foreign-types-shared"
version = "0.1.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "00b0228411908ca8685dba7fc2cdd70ec9990a6e753e89b6ac91a84c40fbaf4b"

[[package]]
name = "form_urlencoded"
version = "1.2.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e13624c2627564efccf4934284bdd98cbaa14e79b0b5a141218e507b3a823456"
dependencies = [
 "percent-encoding",
]

[[package]]
name = "futures"
version = "0.3.30"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "645c6916888f6cb6350d2550b80fb63e734897a8498abe35cfb732b6487804b0"
dependencies = [
 "futures-channel",
 "futures-core",
 "futures-executor",
 "futures-io",
 "futures-sink",
 "futures-task",
 "futures-util",
]

[[package]]
name = "futures-channel"
version = "0.3.30"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "eac8f7d7865dcb88bd4373ab671c8cf4508703796caa2b1985a9ca867b3fcb78"
dependencies = [
 "futures-core",
 "futures-sink",
]

[[package]]
name = "futures-core"
version = "0.3.30"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "dfc6580bb841c5a68e9ef15c77ccc837b40a7504914d52e47b8b0e9bbda25a1d"

[[package]]
name = "futures-executor"
version = "0.3.30"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a576fc72ae164fca6b9db127eaa9a9dda0d61316034f33a0a0d4eda41f02b01d"
dependencies = [
 "futures-core",
 "futures-task",
 "futures-util",
]

[[package]]
name = "futures-io"
version = "0.3.30"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a44623e20b9681a318efdd71c299b6b222ed6f231972bfe2f224ebad6311f0c1"

[[package]]
name = "futures-lite"
version = "1.13.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "49a9d51ce47660b1e808d3c990b4709f2f415d928835a17dfd16991515c46bce"
dependencies = [
 "fastrand 1.9.0",
 "futures-core",
 "futures-io",
 "memchr",
 "parking",
 "pin-project-lite",
 "waker-fn",
]

[[package]]
name = "futures-lite"
version = "2.3.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "52527eb5074e35e9339c6b4e8d12600c7128b68fb25dcb9fa9dec18f7c25f3a5"
dependencies = [
 "futures-core",
 "pin-project-lite",
]

[[package]]
name = "futures-macro"
version = "0.3.30"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "87750cf4b7a4c0625b1529e4c543c2182106e4dedc60a2a6455e00d212c489ac"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "futures-sink"
version = "0.3.30"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9fb8e00e87438d937621c1c6269e53f536c14d3fbd6a042bb24879e57d474fb5"

[[package]]
name = "futures-task"
version = "0.3.30"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "38d84fa142264698cdce1a9f9172cf383a0c82de1bddcf3092901442c4097004"

[[package]]
name = "futures-util"
version = "0.3.30"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3d6401deb83407ab3da39eba7e33987a73c3df0c82b4bb5813ee871c19c41d48"
dependencies = [
 "futures-channel",
 "futures-core",
 "futures-io",
 "futures-macro",
 "futures-sink",
 "futures-task",
 "memchr",
 "pin-project-lite",
 "pin-utils",
 "slab",
]

[[package]]
name = "generic-array"
version = "0.14.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "85649ca51fd72272d7821adaf274ad91c288277713d9c18820d8499a7ff69e9a"
dependencies = [
 "typenum",
 "version_check",
]

[[package]]
name = "gethostname"
version = "0.4.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0176e0459c2e4a1fe232f984bca6890e681076abb9934f6cea7c326f3fc47818"
dependencies = [
 "libc",
 "windows-targets 0.48.5",
]

[[package]]
name = "getrandom"
version = "0.1.16"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8fc3cb4d91f53b50155bdcfd23f6a4c39ae1969c2ae85982b135750cccaf5fce"
dependencies = [
 "cfg-if",
 "libc",
 "wasi 0.9.0+wasi-snapshot-preview1",
]

[[package]]
name = "getrandom"
version = "0.2.15"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c4567c8db10ae91089c99af84c68c38da3ec2f087c3f82960bcdbf3656b6f4d7"
dependencies = [
 "cfg-if",
 "libc",
 "wasi 0.11.0+wasi-snapshot-preview1",
]

[[package]]
name = "gimli"
version = "0.28.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4271d37baee1b8c7e4b708028c57d816cf9d2434acb33a549475f78c181f6253"

[[package]]
name = "h2"
version = "0.3.26"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "81fe527a889e1532da5c525686d96d4c2e74cdd345badf8dfef9f6b39dd5f5e8"
dependencies = [
 "bytes",
 "fnv",
 "futures-core",
 "futures-sink",
 "futures-util",
 "http",
 "indexmap 2.2.6",
 "slab",
 "tokio",
 "tokio-util",
 "tracing",
]

[[package]]
name = "hashbrown"
version = "0.12.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8a9ee70c43aaf417c914396645a0fa852624801b24ebb7ae78fe8272889ac888"

[[package]]
name = "hashbrown"
version = "0.14.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e5274423e17b7c9fc20b6e7e208532f9b19825d82dfd615708b70edd83df41f1"

[[package]]
name = "heck"
version = "0.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2304e00983f87ffb38b55b444b5e3b60a884b5d30c0fca7d82fe33449bbe55ea"

[[package]]
name = "hermit-abi"
version = "0.3.9"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d231dfb89cfffdbc30e7fc41579ed6066ad03abda9e567ccafae602b97ec5024"

[[package]]
name = "hex"
version = "0.4.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7f24254aa9a54b5c858eaee2f5bccdb46aaf0e486a595ed5fd8f86ba55232a70"

[[package]]
name = "hex-literal"
version = "0.3.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7ebdb29d2ea9ed0083cd8cece49bbd968021bd99b0849edb4a9a7ee0fdf6a4e0"

[[package]]
name = "hmac"
version = "0.12.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6c49c37c09c17a53d937dfbb742eb3a961d65a994e6bcdcf37e7399d0cc8ab5e"
dependencies = [
 "digest",
]

[[package]]
name = "http"
version = "0.2.12"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "601cbb57e577e2f5ef5be8e7b83f0f63994f25aa94d673e54a92d5c516d101f1"
dependencies = [
 "bytes",
 "fnv",
 "itoa",
]

[[package]]
name = "http-body"
version = "0.4.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7ceab25649e9960c0311ea418d17bee82c0dcec1bd053b5f9a66e265a693bed2"
dependencies = [
 "bytes",
 "http",
 "pin-project-lite",
]

[[package]]
name = "httparse"
version = "1.8.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d897f394bad6a705d5f4104762e116a75639e470d80901eed05a860a95cb1904"

[[package]]
name = "httpdate"
version = "1.0.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "df3b46402a9d5adb4c86a0cf463f42e19994e3ee891101b1841f30a545cb49a9"

[[package]]
name = "hyper"
version = "0.14.28"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bf96e135eb83a2a8ddf766e426a841d8ddd7449d5f00d34ea02b41d2f19eef80"
dependencies = [
 "bytes",
 "futures-channel",
 "futures-core",
 "futures-util",
 "h2",
 "http",
 "http-body",
 "httparse",
 "httpdate",
 "itoa",
 "pin-project-lite",
 "socket2 0.5.7",
 "tokio",
 "tower-service",
 "tracing",
 "want",
]

[[package]]
name = "hyper-tls"
version = "0.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d6183ddfa99b85da61a140bea0efc93fdf56ceaa041b37d553518030827f9905"
dependencies = [
 "bytes",
 "hyper",
 "native-tls",
 "tokio",
 "tokio-native-tls",
]

[[package]]
name = "iana-time-zone"
version = "0.1.60"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e7ffbb5a1b541ea2561f8c41c087286cc091e21e556a4f09a8f6cbf17b69b141"
dependencies = [
 "android_system_properties",
 "core-foundation-sys",
 "iana-time-zone-haiku",
 "js-sys",
 "wasm-bindgen",
 "windows-core",
]

[[package]]
name = "iana-time-zone-haiku"
version = "0.1.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f31827a206f56af32e590ba56d5d2d085f558508192593743f16b2306495269f"
dependencies = [
 "cc",
]

[[package]]
name = "icu_collections"
version = "1.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "db2fa452206ebee18c4b5c2274dbf1de17008e874b4dc4f0aea9d01ca79e4526"
dependencies = [
 "displaydoc",
 "yoke",
 "zerofrom",
 "zerovec",
]

[[package]]
name = "icu_locid"
version = "1.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "13acbb8371917fc971be86fc8057c41a64b521c184808a698c02acc242dbf637"
dependencies = [
 "displaydoc",
 "litemap",
 "tinystr",
 "writeable",
 "zerovec",
]

[[package]]
name = "icu_locid_transform"
version = "1.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "01d11ac35de8e40fdeda00d9e1e9d92525f3f9d887cdd7aa81d727596788b54e"
dependencies = [
 "displaydoc",
 "icu_locid",
 "icu_locid_transform_data",
 "icu_provider",
 "tinystr",
 "zerovec",
]

[[package]]
name = "icu_locid_transform_data"
version = "1.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "fdc8ff3388f852bede6b579ad4e978ab004f139284d7b28715f773507b946f6e"

[[package]]
name = "icu_normalizer"
version = "1.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "19ce3e0da2ec68599d193c93d088142efd7f9c5d6fc9b803774855747dc6a84f"
dependencies = [
 "displaydoc",
 "icu_collections",
 "icu_normalizer_data",
 "icu_properties",
 "icu_provider",
 "smallvec",
 "utf16_iter",
 "utf8_iter",
 "write16",
 "zerovec",
]

[[package]]
name = "icu_normalizer_data"
version = "1.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f8cafbf7aa791e9b22bec55a167906f9e1215fd475cd22adfcf660e03e989516"

[[package]]
name = "icu_properties"
version = "1.5.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "93d6020766cfc6302c15dbbc9c8778c37e62c14427cb7f6e601d849e092aeef5"
dependencies = [
 "displaydoc",
 "icu_collections",
 "icu_locid_transform",
 "icu_properties_data",
 "icu_provider",
 "tinystr",
 "zerovec",
]

[[package]]
name = "icu_properties_data"
version = "1.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "67a8effbc3dd3e4ba1afa8ad918d5684b8868b3b26500753effea8d2eed19569"

[[package]]
name = "icu_provider"
version = "1.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6ed421c8a8ef78d3e2dbc98a973be2f3770cb42b606e3ab18d6237c4dfde68d9"
dependencies = [
 "displaydoc",
 "icu_locid",
 "icu_provider_macros",
 "stable_deref_trait",
 "tinystr",
 "writeable",
 "yoke",
 "zerofrom",
 "zerovec",
]

[[package]]
name = "icu_provider_macros"
version = "1.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1ec89e9337638ecdc08744df490b221a7399bf8d164eb52a665454e60e075ad6"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "idna"
version = "1.0.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "686f825264d630750a544639377bae737628043f20d38bbc029e8f29ea968a7e"
dependencies = [
 "idna_adapter",
 "smallvec",
 "utf8_iter",
]

[[package]]
name = "idna_adapter"
version = "1.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "daca1df1c957320b2cf139ac61e7bd64fed304c5040df000a745aa1de3b4ef71"
dependencies = [
 "icu_normalizer",
 "icu_properties",
]

[[package]]
name = "indexmap"
version = "1.9.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bd070e393353796e801d209ad339e89596eb4c8d430d18ede6a1cced8fafbd99"
dependencies = [
 "autocfg",
 "hashbrown 0.12.3",
]

[[package]]
name = "indexmap"
version = "2.2.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "168fb715dda47215e360912c096649d23d58bf392ac62f73919e831745e40f26"
dependencies = [
 "equivalent",
 "hashbrown 0.14.5",
]

[[package]]
name = "indicatif"
version = "0.17.8"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "763a5a8f45087d6bcea4222e7b72c291a054edf80e4ef6efd2a4979878c7bea3"
dependencies = [
 "console",
 "instant",
 "number_prefix",
 "portable-atomic",
 "unicode-width",
]

[[package]]
name = "inout"
version = "0.1.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a0c10553d664a4d0bcff9f4215d0aac67a639cc68ef660840afe309b807bc9f5"
dependencies = [
 "block-padding",
 "generic-array",
]

[[package]]
name = "instant"
version = "0.1.13"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e0242819d153cba4b4b05a5a8f2a7e9bbf97b6055b2a002b395c96b5ff3c0222"
dependencies = [
 "cfg-if",
]

[[package]]
name = "io-lifetimes"
version = "1.0.11"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "eae7b9aee968036d54dce06cebaefd919e4472e753296daccd6d344e3e2df0c2"
dependencies = [
 "hermit-abi",
 "libc",
 "windows-sys 0.48.0",
]

[[package]]
name = "ipnet"
version = "2.9.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8f518f335dce6725a761382244631d86cf0ccb2863413590b31338feb467f9c3"

[[package]]
name = "is-docker"
version = "0.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "928bae27f42bc99b60d9ac7334e3a21d10ad8f1835a4e12ec3ec0464765ed1b3"
dependencies = [
 "once_cell",
]

[[package]]
name = "is-wsl"
version = "0.4.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "173609498df190136aa7dea1a91db051746d339e18476eed5ca40521f02d7aa5"
dependencies = [
 "is-docker",
 "once_cell",
]

[[package]]
name = "is_terminal_polyfill"
version = "1.70.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f8478577c03552c21db0e2724ffb8986a5ce7af88107e6be5d2ee6e158c12800"

[[package]]
name = "itoa"
version = "1.0.11"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "49f1f14873335454500d59611f1cf4a4b0f786f9ac11f4312a78e4cf2566695b"

[[package]]
name = "js-sys"
version = "0.3.69"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "29c15563dc2726973df627357ce0c9ddddbea194836909d655df6a75d2cf296d"
dependencies = [
 "wasm-bindgen",
]

[[package]]
name = "keyring"
version = "2.3.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "363387f0019d714aa60cc30ab4fe501a747f4c08fc58f069dd14be971bd495a0"
dependencies = [
 "byteorder",
 "lazy_static",
 "linux-keyutils",
 "secret-service",
 "security-framework",
 "windows-sys 0.52.0",
]

[[package]]
name = "lazy_static"
version = "1.4.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e2abad23fbc42b3700f2f279844dc832adb2b2eb069b2df918f455c4e18cc646"

[[package]]
name = "libc"
version = "0.2.155"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "97b3888a4aecf77e811145cadf6eef5901f4782c53886191b2f693f24761847c"

[[package]]
name = "libredox"
version = "0.1.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c0ff37bd590ca25063e35af745c343cb7a0271906fb7b37e4813e8f79f00268d"
dependencies = [
 "bitflags 2.5.0",
 "libc",
]

[[package]]
name = "libz-sys"
version = "1.1.16"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5e143b5e666b2695d28f6bca6497720813f699c9602dd7f5cac91008b8ada7f9"
dependencies = [
 "cc",
 "pkg-config",
 "vcpkg",
]

[[package]]
name = "linux-keyutils"
version = "0.2.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "761e49ec5fd8a5a463f9b84e877c373d888935b71c6be78f3767fe2ae6bed18e"
dependencies = [
 "bitflags 2.5.0",
 "libc",
]

[[package]]
name = "linux-raw-sys"
version = "0.3.8"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ef53942eb7bf7ff43a617b3e2c1c4a5ecf5944a7c1bc12d7ee39bbb15e5c1519"

[[package]]
name = "linux-raw-sys"
version = "0.4.14"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "78b3ae25bc7c8c38cec158d1f2757ee79e9b3740fbc7ccf0e59e4b08d793fa89"

[[package]]
name = "litemap"
version = "0.7.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4ee93343901ab17bd981295f2cf0026d4ad018c7c31ba84549a4ddbb47a45104"

[[package]]
name = "lock_api"
version = "0.4.12"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "07af8b9cdd281b7915f413fa73f29ebd5d55d0d3f0155584dade1ff18cea1b17"
dependencies = [
 "autocfg",
 "scopeguard",
]

[[package]]
name = "log"
version = "0.4.21"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "90ed8c1e510134f979dbc4f070f87d4313098b704861a105fe34231c70a3901c"

[[package]]
name = "md5"
version = "0.7.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "490cc448043f947bae3cbee9c203358d62dbee0db12107a74be5c30ccfd09771"

[[package]]
name = "memchr"
version = "2.7.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6c8640c5d730cb13ebd907d8d04b52f55ac9a2eec55b440c8892f40d56c76c1d"

[[package]]
name = "memoffset"
version = "0.7.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5de893c32cde5f383baa4c04c5d6dbdd735cfd4a794b0debdb2bb1b421da5ff4"
dependencies = [
 "autocfg",
]

[[package]]
name = "memoffset"
version = "0.9.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "488016bfae457b036d996092f6cb448677611ce4449e970ceaf42695203f218a"
dependencies = [
 "autocfg",
]

[[package]]
name = "mime"
version = "0.3.17"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6877bb514081ee2a7ff5ef9de3281f14a4dd4bceac4c09388074a6b5df8a139a"

[[package]]
name = "miniz_oxide"
version = "0.7.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "87dfd01fe195c66b572b37921ad8803d010623c0aca821bea2302239d155cdae"
dependencies = [
 "adler",
]

[[package]]
name = "mio"
version = "0.8.11"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a4a650543ca06a924e8b371db273b2756685faae30f8487da1b56505a8f78b0c"
dependencies = [
 "libc",
 "wasi 0.11.0+wasi-snapshot-preview1",
 "windows-sys 0.48.0",
]

[[package]]
name = "native-tls"
version = "0.2.11"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "07226173c32f2926027b63cce4bcd8076c3552846cbe7925f3aaffeac0a3b92e"
dependencies = [
 "lazy_static",
 "libc",
 "log",
 "openssl",
 "openssl-probe",
 "openssl-sys",
 "schannel",
 "security-framework",
 "security-framework-sys",
 "tempfile",
]

[[package]]
name = "nix"
version = "0.26.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "598beaf3cc6fdd9a5dfb1630c2800c7acd31df7aaf0f565796fba2b53ca1af1b"
dependencies = [
 "bitflags 1.3.2",
 "cfg-if",
 "libc",
 "memoffset 0.7.1",
]

[[package]]
name = "ntapi"
version = "0.4.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e8a3895c6391c39d7fe7ebc444a87eb2991b2a0bc718fdabd071eec617fc68e4"
dependencies = [
 "winapi",
]

[[package]]
name = "num"
version = "0.4.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "35bd024e8b2ff75562e5f34e7f4905839deb4b22955ef5e73d2fea1b9813cb23"
dependencies = [
 "num-bigint",
 "num-complex",
 "num-integer",
 "num-iter",
 "num-rational",
 "num-traits",
]

[[package]]
name = "num-bigint"
version = "0.4.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c165a9ab64cf766f73521c0dd2cfdff64f488b8f0b3e621face3462d3db536d7"
dependencies = [
 "num-integer",
 "num-traits",
 "rand 0.8.5",
]

[[package]]
name = "num-complex"
version = "0.4.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "73f88a1307638156682bada9d7604135552957b7818057dcef22705b4d509495"
dependencies = [
 "num-traits",
]

[[package]]
name = "num-conv"
version = "0.1.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "51d515d32fb182ee37cda2ccdcb92950d6a3c2893aa280e540671c2cd0f3b1d9"

[[package]]
name = "num-integer"
version = "0.1.46"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7969661fd2958a5cb096e56c8e1ad0444ac2bbcd0061bd28660485a44879858f"
dependencies = [
 "num-traits",
]

[[package]]
name = "num-iter"
version = "0.1.45"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1429034a0490724d0075ebb2bc9e875d6503c3cf69e235a8941aa757d83ef5bf"
dependencies = [
 "autocfg",
 "num-integer",
 "num-traits",
]

[[package]]
name = "num-rational"
version = "0.4.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f83d14da390562dca69fc84082e73e548e1ad308d24accdedd2720017cb37824"
dependencies = [
 "num-bigint",
 "num-integer",
 "num-traits",
]

[[package]]
name = "num-traits"
version = "0.2.19"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "071dfc062690e90b734c0b2273ce72ad0ffa95f0c74596bc250dcfd960262841"
dependencies = [
 "autocfg",
]

[[package]]
name = "num_cpus"
version = "1.16.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4161fcb6d602d4d2081af7c3a45852d875a03dd337a6bfdd6e06407b61342a43"
dependencies = [
 "hermit-abi",
 "libc",
]

[[package]]
name = "number_prefix"
version = "0.4.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "830b246a0e5f20af87141b25c173cd1b609bd7779a4617d6ec582abaf90870f3"

[[package]]
name = "object"
version = "0.32.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a6a622008b6e321afc04970976f62ee297fdbaa6f95318ca343e3eebb9648441"
dependencies = [
 "memchr",
]

[[package]]
name = "once_cell"
version = "1.19.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3fdb12b2476b595f9358c5161aa467c2438859caa136dec86c26fdd2efe17b92"

[[package]]
name = "open"
version = "4.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3a083c0c7e5e4a8ec4176346cf61f67ac674e8bfb059d9226e1c54a96b377c12"
dependencies = [
 "is-wsl",
 "libc",
 "pathdiff",
]

[[package]]
name = "openssl"
version = "0.10.72"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "fedfea7d58a1f73118430a55da6a286e7b044961736ce96a16a17068ea25e5da"
dependencies = [
 "bitflags 2.5.0",
 "cfg-if",
 "foreign-types",
 "libc",
 "once_cell",
 "openssl-macros",
 "openssl-sys",
]

[[package]]
name = "openssl-macros"
version = "0.1.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a948666b637a0f465e8564c73e89d4dde00d72d4d473cc972f390fc3dcee7d9c"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "openssl-probe"
version = "0.1.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ff011a302c396a5197692431fc1948019154afc178baf7d8e37367442a4601cf"

[[package]]
name = "openssl-sys"
version = "0.9.107"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8288979acd84749c744a9014b4382d42b8f7b2592847b5afb2ed29e5d16ede07"
dependencies = [
 "cc",
 "libc",
 "pkg-config",
 "vcpkg",
]

[[package]]
name = "opentelemetry"
version = "0.19.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5f4b8347cc26099d3aeee044065ecc3ae11469796b4d65d065a23a584ed92a6f"
dependencies = [
 "opentelemetry_api",
 "opentelemetry_sdk",
]

[[package]]
name = "opentelemetry_api"
version = "0.19.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ed41783a5bf567688eb38372f2b7a8530f5a607a4b49d38dd7573236c23ca7e2"
dependencies = [
 "futures-channel",
 "futures-util",
 "indexmap 1.9.3",
 "once_cell",
 "pin-project-lite",
 "thiserror",
 "urlencoding",
]

[[package]]
name = "opentelemetry_sdk"
version = "0.19.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8b3a2a91fdbfdd4d212c0dcc2ab540de2c2bcbbd90be17de7a7daf8822d010c1"
dependencies = [
 "async-trait",
 "crossbeam-channel",
 "futures-channel",
 "futures-executor",
 "futures-util",
 "once_cell",
 "opentelemetry_api",
 "percent-encoding",
 "rand 0.8.5",
 "thiserror",
 "tokio",
 "tokio-stream",
]

[[package]]
name = "option-ext"
version = "0.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "04744f49eae99ab78e0d5c0b603ab218f515ea8cfe5a456d7629ad883a3b6e7d"

[[package]]
name = "ordered-stream"
version = "0.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9aa2b01e1d916879f73a53d01d1d6cee68adbb31d6d9177a8cfce093cced1d50"
dependencies = [
 "futures-core",
 "pin-project-lite",
]

[[package]]
name = "os_info"
version = "3.8.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ae99c7fa6dd38c7cafe1ec085e804f8f555a2f8659b0dbe03f1f9963a9b51092"
dependencies = [
 "log",
 "windows-sys 0.52.0",
]

[[package]]
name = "parking"
version = "2.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bb813b8af86854136c6922af0598d719255ecb2179515e6e7730d468f05c9cae"

[[package]]
name = "parking_lot"
version = "0.12.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7e4af0ca4f6caed20e900d564c242b8e5d4903fdacf31d3daf527b66fe6f42fb"
dependencies = [
 "lock_api",
 "parking_lot_core",
]

[[package]]
name = "parking_lot_core"
version = "0.9.10"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1e401f977ab385c9e4e3ab30627d6f26d00e2c73eef317493c4ec6d468726cf8"
dependencies = [
 "cfg-if",
 "libc",
 "redox_syscall 0.5.1",
 "smallvec",
 "windows-targets 0.52.5",
]

[[package]]
name = "paste"
version = "1.0.15"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "57c0d7b74b563b49d38dae00a0c37d4d6de9b432382b2892f0574ddcae73fd0a"

[[package]]
name = "pathdiff"
version = "0.2.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8835116a5c179084a830efb3adc117ab007512b535bc1a21c991d3b32a6b44dd"

[[package]]
name = "percent-encoding"
version = "2.3.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e3148f5046208a5d56bcfc03053e3ca6334e51da8dfb19b6cdc8b306fae3283e"

[[package]]
name = "pin-project"
version = "1.1.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b6bf43b791c5b9e34c3d182969b4abb522f9343702850a2e57f460d00d09b4b3"
dependencies = [
 "pin-project-internal",
]

[[package]]
name = "pin-project-internal"
version = "1.1.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2f38a4412a78282e09a2cf38d195ea5420d15ba0602cb375210efbc877243965"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "pin-project-lite"
version = "0.2.14"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bda66fc9667c18cb2758a2ac84d1167245054bcf85d5d1aaa6923f45801bdd02"

[[package]]
name = "pin-utils"
version = "0.1.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8b870d8c151b6f2fb93e84a13146138f05d02ed11c7e7c54f8826aaaf7c9f184"

[[package]]
name = "piper"
version = "0.2.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "464db0c665917b13ebb5d453ccdec4add5658ee1adc7affc7677615356a8afaf"
dependencies = [
 "atomic-waker",
 "fastrand 2.1.0",
 "futures-io",
]

[[package]]
name = "pkg-config"
version = "0.3.30"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d231b230927b5e4ad203db57bbcbee2802f6bce620b1e4a9024a07d94e2907ec"

[[package]]
name = "polling"
version = "2.8.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4b2d323e8ca7996b3e23126511a523f7e62924d93ecd5ae73b333815b0eb3dce"
dependencies = [
 "autocfg",
 "bitflags 1.3.2",
 "cfg-if",
 "concurrent-queue",
 "libc",
 "log",
 "pin-project-lite",
 "windows-sys 0.48.0",
]

[[package]]
name = "polling"
version = "3.7.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "645493cf344456ef24219d02a768cf1fb92ddf8c92161679ae3d91b91a637be3"
dependencies = [
 "cfg-if",
 "concurrent-queue",
 "hermit-abi",
 "pin-project-lite",
 "rustix 0.38.34",
 "tracing",
 "windows-sys 0.52.0",
]

[[package]]
name = "portable-atomic"
version = "1.6.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7170ef9988bc169ba16dd36a7fa041e5c4cbeb6a35b76d4c03daded371eae7c0"

[[package]]
name = "powerfmt"
version = "0.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "439ee305def115ba05938db6eb1644ff94165c5ab5e9420d1c1bcedbba909391"

[[package]]
name = "ppv-lite86"
version = "0.2.17"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5b40af805b3121feab8a3c29f04d8ad262fa8e0561883e7653e024ae4479e6de"

[[package]]
name = "proc-macro-crate"
version = "1.3.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7f4c021e1093a56626774e81216a4ce732a735e5bad4868a03f3ed65ca0c3919"
dependencies = [
 "once_cell",
 "toml_edit",
]

[[package]]
name = "proc-macro2"
version = "1.0.83"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0b33eb56c327dec362a9e55b3ad14f9d2f0904fb5a5b03b513ab5465399e9f43"
dependencies = [
 "unicode-ident",
]

[[package]]
name = "quote"
version = "1.0.36"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0fa76aaf39101c457836aec0ce2316dbdc3ab723cdda1c6bd4e6ad4208acaca7"
dependencies = [
 "proc-macro2",
]

[[package]]
name = "rand"
version = "0.7.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6a6b1679d49b24bbfe0c803429aa1874472f50d9b363131f0e89fc356b544d03"
dependencies = [
 "getrandom 0.1.16",
 "libc",
 "rand_chacha 0.2.2",
 "rand_core 0.5.1",
 "rand_hc",
]

[[package]]
name = "rand"
version = "0.8.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "34af8d1a0e25924bc5b7c43c079c942339d8f0a8b57c39049bef581b46327404"
dependencies = [
 "libc",
 "rand_chacha 0.3.1",
 "rand_core 0.6.4",
]

[[package]]
name = "rand_chacha"
version = "0.2.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f4c8ed856279c9737206bf725bf36935d8666ead7aa69b52be55af369d193402"
dependencies = [
 "ppv-lite86",
 "rand_core 0.5.1",
]

[[package]]
name = "rand_chacha"
version = "0.3.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e6c10a63a0fa32252be49d21e7709d4d4baf8d231c2dbce1eaa8141b9b127d88"
dependencies = [
 "ppv-lite86",
 "rand_core 0.6.4",
]

[[package]]
name = "rand_core"
version = "0.5.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "90bde5296fc891b0cef12a6d03ddccc162ce7b2aff54160af9338f8d40df6d19"
dependencies = [
 "getrandom 0.1.16",
]

[[package]]
name = "rand_core"
version = "0.6.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ec0be4795e2f6a28069bec0b5ff3e2ac9bafc99e6a9a7dc3547996c5c816922c"
dependencies = [
 "getrandom 0.2.15",
]

[[package]]
name = "rand_hc"
version = "0.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ca3129af7b92a17112d59ad498c6f81eaf463253766b90396d39ea7a39d6613c"
dependencies = [
 "rand_core 0.5.1",
]

[[package]]
name = "redox_syscall"
version = "0.4.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4722d768eff46b75989dd134e5c353f0d6296e5aaa3132e776cbdb56be7731aa"
dependencies = [
 "bitflags 1.3.2",
]

[[package]]
name = "redox_syscall"
version = "0.5.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "469052894dcb553421e483e4209ee581a45100d31b4018de03e5a7ad86374a7e"
dependencies = [
 "bitflags 2.5.0",
]

[[package]]
name = "redox_users"
version = "0.4.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bd283d9651eeda4b2a83a43c1c91b266c40fd76ecd39a50a8c630ae69dc72891"
dependencies = [
 "getrandom 0.2.15",
 "libredox",
 "thiserror",
]

[[package]]
name = "regex"
version = "1.10.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c117dbdfde9c8308975b6a18d71f3f385c89461f7b3fb054288ecf2a2058ba4c"
dependencies = [
 "aho-corasick",
 "memchr",
 "regex-automata",
 "regex-syntax",
]

[[package]]
name = "regex-automata"
version = "0.4.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "86b83b8b9847f9bf95ef68afb0b8e6cdb80f498442f5179a29fad448fcc1eaea"
dependencies = [
 "aho-corasick",
 "memchr",
 "regex-syntax",
]

[[package]]
name = "regex-syntax"
version = "0.8.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "adad44e29e4c806119491a7f06f03de4d1af22c3a680dd47f1e6e179439d1f56"

[[package]]
name = "reqwest"
version = "0.11.27"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "dd67538700a17451e7cba03ac727fb961abb7607553461627b97de0b89cf4a62"
dependencies = [
 "base64",
 "bytes",
 "encoding_rs",
 "futures-core",
 "futures-util",
 "h2",
 "http",
 "http-body",
 "hyper",
 "hyper-tls",
 "ipnet",
 "js-sys",
 "log",
 "mime",
 "native-tls",
 "once_cell",
 "percent-encoding",
 "pin-project-lite",
 "rustls-pemfile",
 "serde",
 "serde_json",
 "serde_urlencoded",
 "sync_wrapper",
 "system-configuration",
 "tokio",
 "tokio-native-tls",
 "tokio-util",
 "tower-service",
 "url",
 "wasm-bindgen",
 "wasm-bindgen-futures",
 "wasm-streams",
 "web-sys",
 "winreg 0.50.0",
]

[[package]]
name = "rmp"
version = "0.8.14"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "228ed7c16fa39782c3b3468e974aec2795e9089153cd08ee2e9aefb3613334c4"
dependencies = [
 "byteorder",
 "num-traits",
 "paste",
]

[[package]]
name = "rmp-serde"
version = "1.3.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "52e599a477cf9840e92f2cde9a7189e67b42c57532749bf90aea6ec10facd4db"
dependencies = [
 "byteorder",
 "rmp",
 "serde",
]

[[package]]
name = "russh"
version = "0.37.1"
source = "git+https://github.com/microsoft/vscode-russh?branch=main#fd4f608a83753f9f3e137f95600faffede71cf65"
dependencies = [
 "async-trait",
 "bitflags 1.3.2",
 "byteorder",
 "digest",
 "flate2",
 "futures",
 "generic-array",
 "hex-literal",
 "hmac",
 "log",
 "num-bigint",
 "once_cell",
 "openssl",
 "rand 0.8.5",
 "russh-cryptovec",
 "russh-keys",
 "sha1",
 "sha2",
 "subtle",
 "thiserror",
 "tokio",
 "tokio-util",
]

[[package]]
name = "russh-cryptovec"
version = "0.7.0"
source = "git+https://github.com/microsoft/vscode-russh?branch=main#fd4f608a83753f9f3e137f95600faffede71cf65"
dependencies = [
 "libc",
 "winapi",
]

[[package]]
name = "russh-keys"
version = "0.37.1"
source = "git+https://github.com/microsoft/vscode-russh?branch=main#fd4f608a83753f9f3e137f95600faffede71cf65"
dependencies = [
 "bit-vec",
 "byteorder",
 "data-encoding",
 "dirs 4.0.0",
 "futures",
 "inout",
 "log",
 "md5",
 "num-bigint",
 "num-integer",
 "openssl",
 "rand 0.7.3",
 "rand_core 0.5.1",
 "russh-cryptovec",
 "serde",
 "sha2",
 "thiserror",
 "tokio",
 "tokio-stream",
 "yasna",
]

[[package]]
name = "rustc-demangle"
version = "0.1.24"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "719b953e2095829ee67db738b3bfa9fa368c94900df327b3f07fe6e794d2fe1f"

[[package]]
name = "rustix"
version = "0.37.27"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "fea8ca367a3a01fe35e6943c400addf443c0f57670e6ec51196f71a4b8762dd2"
dependencies = [
 "bitflags 1.3.2",
 "errno",
 "io-lifetimes",
 "libc",
 "linux-raw-sys 0.3.8",
 "windows-sys 0.48.0",
]

[[package]]
name = "rustix"
version = "0.38.34"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "70dc5ec042f7a43c4a73241207cecc9873a06d45debb38b329f8541d85c2730f"
dependencies = [
 "bitflags 2.5.0",
 "errno",
 "libc",
 "linux-raw-sys 0.4.14",
 "windows-sys 0.52.0",
]

[[package]]
name = "rustls-pemfile"
version = "1.0.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1c74cae0a4cf6ccbbf5f359f08efdf8ee7e1dc532573bf0db71968cb56b1448c"
dependencies = [
 "base64",
]

[[package]]
name = "ryu"
version = "1.0.18"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f3cb5ba0dc43242ce17de99c180e96db90b235b8a9fdc9543c96d2209116bd9f"

[[package]]
name = "schannel"
version = "0.1.23"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "fbc91545643bcf3a0bbb6569265615222618bdf33ce4ffbbd13c4bbd4c093534"
dependencies = [
 "windows-sys 0.52.0",
]

[[package]]
name = "scopeguard"
version = "1.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "94143f37725109f92c262ed2cf5e59bce7498c01bcc1502d7b9afe439a4e9f49"

[[package]]
name = "secret-service"
version = "3.0.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5da1a5ad4d28c03536f82f77d9f36603f5e37d8869ac98f0a750d5b5686d8d95"
dependencies = [
 "futures-util",
 "generic-array",
 "num",
 "once_cell",
 "openssl",
 "rand 0.8.5",
 "serde",
 "zbus",
]

[[package]]
name = "security-framework"
version = "2.11.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c627723fd09706bacdb5cf41499e95098555af3c3c29d014dc3c458ef6be11c0"
dependencies = [
 "bitflags 2.5.0",
 "core-foundation",
 "core-foundation-sys",
 "libc",
 "security-framework-sys",
]

[[package]]
name = "security-framework-sys"
version = "2.11.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "317936bbbd05227752583946b9e66d7ce3b489f84e11a94a510b4437fef407d7"
dependencies = [
 "core-foundation-sys",
 "libc",
]

[[package]]
name = "serde"
version = "1.0.202"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "226b61a0d411b2ba5ff6d7f73a476ac4f8bb900373459cd00fab8512828ba395"
dependencies = [
 "serde_derive",
]

[[package]]
name = "serde_bytes"
version = "0.11.14"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8b8497c313fd43ab992087548117643f6fcd935cbf36f176ffda0aacf9591734"
dependencies = [
 "serde",
]

[[package]]
name = "serde_derive"
version = "1.0.202"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6048858004bcff69094cd972ed40a32500f153bd3be9f716b2eed2e8217c4838"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "serde_json"
version = "1.0.117"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "455182ea6142b14f93f4bc5320a2b31c1f266b66a4a5c858b013302a5d8cbfc3"
dependencies = [
 "itoa",
 "ryu",
 "serde",
]

[[package]]
name = "serde_repr"
version = "0.1.19"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6c64451ba24fc7a6a2d60fc75dd9c83c90903b19028d4eff35e88fc1e86564e9"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "serde_urlencoded"
version = "0.7.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d3491c14715ca2294c4d6a88f15e84739788c1d030eed8c110436aafdaa2f3fd"
dependencies = [
 "form_urlencoded",
 "itoa",
 "ryu",
 "serde",
]

[[package]]
name = "sha1"
version = "0.10.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e3bf829a2d51ab4a5ddf1352d8470c140cadc8301b2ae1789db023f01cedd6ba"
dependencies = [
 "cfg-if",
 "cpufeatures",
 "digest",
]

[[package]]
name = "sha2"
version = "0.10.8"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "793db75ad2bcafc3ffa7c68b215fee268f537982cd901d132f89c6343f3a3dc8"
dependencies = [
 "cfg-if",
 "cpufeatures",
 "digest",
]

[[package]]
name = "shell-escape"
version = "0.1.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "45bb67a18fa91266cc7807181f62f9178a6873bfad7dc788c42e6430db40184f"

[[package]]
name = "shell-words"
version = "1.1.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "24188a676b6ae68c3b2cb3a01be17fbf7240ce009799bb56d5b1409051e78fde"

[[package]]
name = "signal-hook-registry"
version = "1.4.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a9e9e0b4211b72e7b8b6e85c807d36c212bdb33ea8587f7569562a84df5465b1"
dependencies = [
 "libc",
]

[[package]]
name = "slab"
version = "0.4.9"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8f92a496fb766b417c996b9c5e57daf2f7ad3b0bebe1ccfca4856390e3d3bb67"
dependencies = [
 "autocfg",
]

[[package]]
name = "smallvec"
version = "1.13.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3c5e1a9a646d36c3599cd173a41282daf47c44583ad367b8e6837255952e5c67"

[[package]]
name = "socket2"
version = "0.4.10"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9f7916fc008ca5542385b89a3d3ce689953c143e9304a9bf8beec1de48994c0d"
dependencies = [
 "libc",
 "winapi",
]

[[package]]
name = "socket2"
version = "0.5.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ce305eb0b4296696835b71df73eb912e0f1ffd2556a501fcede6e0c50349191c"
dependencies = [
 "libc",
 "windows-sys 0.52.0",
]

[[package]]
name = "stable_deref_trait"
version = "1.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a8f112729512f8e442d81f95a8a7ddf2b7c6b8a1a6f509a95864142b30cab2d3"

[[package]]
name = "static_assertions"
version = "1.1.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a2eb9349b6444b326872e140eb1cf5e7c522154d69e7a0ffb0fb81c06b37543f"

[[package]]
name = "strsim"
version = "0.11.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7da8b5736845d9f2fcb837ea5d9e2628564b3b043a70948a3f0b778838c5fb4f"

[[package]]
name = "subtle"
version = "2.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "81cdd64d312baedb58e21336b31bc043b77e01cc99033ce76ef539f78e965ebc"

[[package]]
name = "syn"
version = "1.0.109"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "72b64191b275b66ffe2469e8af2c1cfe3bafa67b529ead792a6d0160888b4237"
dependencies = [
 "proc-macro2",
 "quote",
 "unicode-ident",
]

[[package]]
name = "syn"
version = "2.0.65"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d2863d96a84c6439701d7a38f9de935ec562c8832cc55d1dde0f513b52fad106"
dependencies = [
 "proc-macro2",
 "quote",
 "unicode-ident",
]

[[package]]
name = "sync_wrapper"
version = "0.1.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2047c6ded9c721764247e62cd3b03c09ffc529b2ba5b10ec482ae507a4a70160"

[[package]]
name = "synstructure"
version = "0.13.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c8af7666ab7b6390ab78131fb5b0fce11d6b7a6951602017c35fa82800708971"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "sysinfo"
version = "0.29.11"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "cd727fc423c2060f6c92d9534cef765c65a6ed3f428a03d7def74a8c4348e666"
dependencies = [
 "cfg-if",
 "core-foundation-sys",
 "libc",
 "ntapi",
 "once_cell",
 "winapi",
]

[[package]]
name = "system-configuration"
version = "0.5.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ba3a3adc5c275d719af8cb4272ea1c4a6d668a777f37e115f6d11ddbc1c8e0e7"
dependencies = [
 "bitflags 1.3.2",
 "core-foundation",
 "system-configuration-sys",
]

[[package]]
name = "system-configuration-sys"
version = "0.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a75fb188eb626b924683e3b95e3a48e63551fcfb51949de2f06a9d91dbee93c9"
dependencies = [
 "core-foundation-sys",
 "libc",
]

[[package]]
name = "tar"
version = "0.4.40"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b16afcea1f22891c49a00c751c7b63b2233284064f11a200fc624137c51e2ddb"
dependencies = [
 "filetime",
 "libc",
 "xattr",
]

[[package]]
name = "tempfile"
version = "3.10.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "85b77fafb263dd9d05cbeac119526425676db3784113aa9295c88498cbf8bff1"
dependencies = [
 "cfg-if",
 "fastrand 2.1.0",
 "rustix 0.38.34",
 "windows-sys 0.52.0",
]

[[package]]
name = "thiserror"
version = "1.0.61"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c546c80d6be4bc6a00c0f01730c08df82eaa7a7a61f11d656526506112cc1709"
dependencies = [
 "thiserror-impl",
]

[[package]]
name = "thiserror-impl"
version = "1.0.61"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "46c3384250002a6d5af4d114f2845d37b57521033f30d5c3f46c4d70e1197533"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "time"
version = "0.3.36"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5dfd88e563464686c916c7e46e623e520ddc6d79fa6641390f2e3fa86e83e885"
dependencies = [
 "deranged",
 "num-conv",
 "powerfmt",
 "serde",
 "time-core",
]

[[package]]
name = "time-core"
version = "0.1.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ef927ca75afb808a4d64dd374f00a2adf8d0fcff8e7b184af886c3c87ec4a3f3"

[[package]]
name = "tinystr"
version = "0.7.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9117f5d4db391c1cf6927e7bea3db74b9a1c1add8f7eda9ffd5364f40f57b82f"
dependencies = [
 "displaydoc",
 "zerovec",
]

[[package]]
name = "tokio"
version = "1.38.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "68722da18b0fc4a05fdc1120b302b82051265792a1e1b399086e9b204b10ad3d"
dependencies = [
 "backtrace",
 "bytes",
 "libc",
 "mio",
 "num_cpus",
 "parking_lot",
 "pin-project-lite",
 "signal-hook-registry",
 "socket2 0.5.7",
 "tokio-macros",
 "tracing",
 "windows-sys 0.48.0",
]

[[package]]
name = "tokio-macros"
version = "2.3.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5f5ae998a069d4b5aba8ee9dad856af7d520c3699e6159b185c2acd48155d39a"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "tokio-native-tls"
version = "0.3.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bbae76ab933c85776efabc971569dd6119c580d8f5d448769dec1764bf796ef2"
dependencies = [
 "native-tls",
 "tokio",
]

[[package]]
name = "tokio-stream"
version = "0.1.15"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "267ac89e0bec6e691e5813911606935d77c476ff49024f98abcea3e7b15e37af"
dependencies = [
 "futures-core",
 "pin-project-lite",
 "tokio",
]

[[package]]
name = "tokio-tungstenite"
version = "0.20.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "212d5dcb2a1ce06d81107c3d0ffa3121fe974b73f068c8282cb1c32328113b6c"
dependencies = [
 "futures-util",
 "log",
 "native-tls",
 "tokio",
 "tokio-native-tls",
 "tungstenite",
]

[[package]]
name = "tokio-util"
version = "0.7.11"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9cf6b47b3771c49ac75ad09a6162f53ad4b8088b76ac60e8ec1455b31a189fe1"
dependencies = [
 "bytes",
 "futures-core",
 "futures-io",
 "futures-sink",
 "pin-project-lite",
 "tokio",
]

[[package]]
name = "toml_datetime"
version = "0.6.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4badfd56924ae69bcc9039335b2e017639ce3f9b001c393c1b2d1ef846ce2cbf"

[[package]]
name = "toml_edit"
version = "0.19.15"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1b5bb770da30e5cbfde35a2d7b9b8a2c4b8ef89548a7a6aeab5c9a576e3e7421"
dependencies = [
 "indexmap 2.2.6",
 "toml_datetime",
 "winnow",
]

[[package]]
name = "tower-service"
version = "0.3.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b6bc1c9ce2b5135ac7f93c72918fc37feb872bdc6a5533a8b85eb4b86bfdae52"

[[package]]
name = "tracing"
version = "0.1.40"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c3523ab5a71916ccf420eebdf5521fcef02141234bbc0b8a49f2fdc4544364ef"
dependencies = [
 "pin-project-lite",
 "tracing-attributes",
 "tracing-core",
]

[[package]]
name = "tracing-attributes"
version = "0.1.27"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "34704c8d6ebcbc939824180af020566b01a7c01f80641264eba0999f6c2b6be7"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "tracing-core"
version = "0.1.32"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c06d3da6113f116aaee68e4d601191614c9053067f9ab7f6edbcb161237daa54"
dependencies = [
 "once_cell",
]

[[package]]
name = "try-lock"
version = "0.2.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e421abadd41a4225275504ea4d6566923418b7f05506fbc9c0fe86ba7396114b"

[[package]]
name = "tungstenite"
version = "0.20.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9e3dac10fd62eaf6617d3a904ae222845979aec67c615d1c842b4002c7666fb9"
dependencies = [
 "byteorder",
 "bytes",
 "data-encoding",
 "http",
 "httparse",
 "log",
 "native-tls",
 "rand 0.8.5",
 "sha1",
 "thiserror",
 "url",
 "utf-8",
]

[[package]]
name = "tunnels"
version = "0.1.0"
source = "git+https://github.com/microsoft/dev-tunnels?rev=8cae9b2a24c65c6c1958f5a0e77d72b23b5c6c30#8cae9b2a24c65c6c1958f5a0e77d72b23b5c6c30"
dependencies = [
 "async-trait",
 "chrono",
 "futures",
 "hyper",
 "log",
 "os_info",
 "rand 0.8.5",
 "reqwest",
 "russh",
 "russh-keys",
 "serde",
 "serde_json",
 "thiserror",
 "tokio",
 "tokio-tungstenite",
 "tokio-util",
 "tungstenite",
 "url",
 "urlencoding",
 "uuid",
 "winreg 0.8.0",
]

[[package]]
name = "typenum"
version = "1.17.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "42ff0bf0c66b8238c6f3b578df37d0b7848e55df8577b3f74f92a69acceeb825"

[[package]]
name = "uds_windows"
version = "1.1.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "89daebc3e6fd160ac4aa9fc8b3bf71e1f74fbf92367ae71fb83a037e8bf164b9"
dependencies = [
 "memoffset 0.9.1",
 "tempfile",
 "winapi",
]

[[package]]
name = "unicode-ident"
version = "1.0.12"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3354b9ac3fae1ff6755cb6db53683adb661634f67557942dea4facebec0fee4b"

[[package]]
name = "unicode-width"
version = "0.1.12"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "68f5e5f3158ecfd4b8ff6fe086db7c8467a2dfdac97fe420f2b7c4aa97af66d6"

[[package]]
name = "unicode-xid"
version = "0.2.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f962df74c8c05a667b5ee8bcf162993134c104e96440b663c8daa176dc772d8c"

[[package]]
name = "url"
version = "2.5.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "32f8b686cadd1473f4bd0117a5d28d36b1ade384ea9b5069a1c40aefed7fda60"
dependencies = [
 "form_urlencoded",
 "idna",
 "percent-encoding",
]

[[package]]
name = "urlencoding"
version = "2.1.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "daf8dba3b7eb870caf1ddeed7bc9d2a049f3cfdfae7cb521b087cc33ae4c49da"

[[package]]
name = "utf-8"
version = "0.7.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "09cc8ee72d2a9becf2f2febe0205bbed8fc6615b7cb429ad062dc7b7ddd036a9"

[[package]]
name = "utf16_iter"
version = "1.0.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c8232dd3cdaed5356e0f716d285e4b40b932ac434100fe9b7e0e8e935b9e6246"

[[package]]
name = "utf8_iter"
version = "1.0.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b6c140620e7ffbb22c2dee59cafe6084a59b5ffc27a8859a5f0d494b5d52b6be"

[[package]]
name = "utf8parse"
version = "0.2.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "711b9620af191e0cdc7468a8d14e709c3dcdb115b36f838e601583af800a370a"

[[package]]
name = "uuid"
version = "1.8.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a183cf7feeba97b4dd1c0d46788634f6221d87fa961b305bed08c851829efcc0"
dependencies = [
 "getrandom 0.2.15",
 "serde",
]

[[package]]
name = "vcpkg"
version = "0.2.15"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "accd4ea62f7bb7a82fe23066fb0957d48ef677f6eeb8215f372f52e48bb32426"

[[package]]
name = "version_check"
version = "0.9.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "49874b5167b65d7193b8aba1567f5c7d93d001cafc34600cee003eda787e483f"

[[package]]
name = "waker-fn"
version = "1.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "317211a0dc0ceedd78fb2ca9a44aed3d7b9b26f81870d485c07122b4350673b7"

[[package]]
name = "want"
version = "0.3.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bfa7760aed19e106de2c7c0b581b509f2f25d3dacaf737cb82ac61bc6d760b0e"
dependencies = [
 "try-lock",
]

[[package]]
name = "wasi"
version = "0.9.0+wasi-snapshot-preview1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "cccddf32554fecc6acb585f82a32a72e28b48f8c4c1883ddfeeeaa96f7d8e519"

[[package]]
name = "wasi"
version = "0.11.0+wasi-snapshot-preview1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9c8d87e72b64a3b4db28d11ce29237c246188f4f51057d65a7eab63b7987e423"

[[package]]
name = "wasm-bindgen"
version = "0.2.92"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4be2531df63900aeb2bca0daaaddec08491ee64ceecbee5076636a3b026795a8"
dependencies = [
 "cfg-if",
 "wasm-bindgen-macro",
]

[[package]]
name = "wasm-bindgen-backend"
version = "0.2.92"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "614d787b966d3989fa7bb98a654e369c762374fd3213d212cfc0251257e747da"
dependencies = [
 "bumpalo",
 "log",
 "once_cell",
 "proc-macro2",
 "quote",
 "syn 2.0.65",
 "wasm-bindgen-shared",
]

[[package]]
name = "wasm-bindgen-futures"
version = "0.4.42"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "76bc14366121efc8dbb487ab05bcc9d346b3b5ec0eaa76e46594cabbe51762c0"
dependencies = [
 "cfg-if",
 "js-sys",
 "wasm-bindgen",
 "web-sys",
]

[[package]]
name = "wasm-bindgen-macro"
version = "0.2.92"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a1f8823de937b71b9460c0c34e25f3da88250760bec0ebac694b49997550d726"
dependencies = [
 "quote",
 "wasm-bindgen-macro-support",
]

[[package]]
name = "wasm-bindgen-macro-support"
version = "0.2.92"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e94f17b526d0a461a191c78ea52bbce64071ed5c04c9ffe424dcb38f74171bb7"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
 "wasm-bindgen-backend",
 "wasm-bindgen-shared",
]

[[package]]
name = "wasm-bindgen-shared"
version = "0.2.92"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "af190c94f2773fdb3729c55b007a722abb5384da03bc0986df4c289bf5567e96"

[[package]]
name = "wasm-streams"
version = "0.4.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b65dc4c90b63b118468cf747d8bf3566c1913ef60be765b5730ead9e0a3ba129"
dependencies = [
 "futures-util",
 "js-sys",
 "wasm-bindgen",
 "wasm-bindgen-futures",
 "web-sys",
]

[[package]]
name = "web-sys"
version = "0.3.69"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "77afa9a11836342370f4817622a2f0f418b134426d91a82dfb48f532d2ec13ef"
dependencies = [
 "js-sys",
 "wasm-bindgen",
]

[[package]]
name = "winapi"
version = "0.3.9"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5c839a674fcd7a98952e593242ea400abe93992746761e38641405d28b00f419"
dependencies = [
 "winapi-i686-pc-windows-gnu",
 "winapi-x86_64-pc-windows-gnu",
]

[[package]]
name = "winapi-i686-pc-windows-gnu"
version = "0.4.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ac3b87c63620426dd9b991e5ce0329eff545bccbbb34f3be09ff6fb6ab51b7b6"

[[package]]
name = "winapi-x86_64-pc-windows-gnu"
version = "0.4.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "712e227841d057c1ee1cd2fb22fa7e5a5461ae8e48fa2ca79ec42cfc1931183f"

[[package]]
name = "windows-core"
version = "0.52.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "33ab640c8d7e35bf8ba19b884ba838ceb4fba93a4e8c65a9059d08afcfc683d9"
dependencies = [
 "windows-targets 0.52.5",
]

[[package]]
name = "windows-sys"
version = "0.48.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "677d2418bec65e3338edb076e806bc1ec15693c5d0104683f2efe857f61056a9"
dependencies = [
 "windows-targets 0.48.5",
]

[[package]]
name = "windows-sys"
version = "0.52.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "282be5f36a8ce781fad8c8ae18fa3f9beff57ec1b52cb3de0789201425d9a33d"
dependencies = [
 "windows-targets 0.52.5",
]

[[package]]
name = "windows-targets"
version = "0.48.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9a2fa6e2155d7247be68c096456083145c183cbbbc2764150dda45a87197940c"
dependencies = [
 "windows_aarch64_gnullvm 0.48.5",
 "windows_aarch64_msvc 0.48.5",
 "windows_i686_gnu 0.48.5",
 "windows_i686_msvc 0.48.5",
 "windows_x86_64_gnu 0.48.5",
 "windows_x86_64_gnullvm 0.48.5",
 "windows_x86_64_msvc 0.48.5",
]

[[package]]
name = "windows-targets"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6f0713a46559409d202e70e28227288446bf7841d3211583a4b53e3f6d96e7eb"
dependencies = [
 "windows_aarch64_gnullvm 0.52.5",
 "windows_aarch64_msvc 0.52.5",
 "windows_i686_gnu 0.52.5",
 "windows_i686_gnullvm",
 "windows_i686_msvc 0.52.5",
 "windows_x86_64_gnu 0.52.5",
 "windows_x86_64_gnullvm 0.52.5",
 "windows_x86_64_msvc 0.52.5",
]

[[package]]
name = "windows_aarch64_gnullvm"
version = "0.48.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2b38e32f0abccf9987a4e3079dfb67dcd799fb61361e53e2882c3cbaf0d905d8"

[[package]]
name = "windows_aarch64_gnullvm"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7088eed71e8b8dda258ecc8bac5fb1153c5cffaf2578fc8ff5d61e23578d3263"

[[package]]
name = "windows_aarch64_msvc"
version = "0.48.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "dc35310971f3b2dbbf3f0690a219f40e2d9afcf64f9ab7cc1be722937c26b4bc"

[[package]]
name = "windows_aarch64_msvc"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9985fd1504e250c615ca5f281c3f7a6da76213ebd5ccc9561496568a2752afb6"

[[package]]
name = "windows_i686_gnu"
version = "0.48.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a75915e7def60c94dcef72200b9a8e58e5091744960da64ec734a6c6e9b3743e"

[[package]]
name = "windows_i686_gnu"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "88ba073cf16d5372720ec942a8ccbf61626074c6d4dd2e745299726ce8b89670"

[[package]]
name = "windows_i686_gnullvm"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "87f4261229030a858f36b459e748ae97545d6f1ec60e5e0d6a3d32e0dc232ee9"

[[package]]
name = "windows_i686_msvc"
version = "0.48.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8f55c233f70c4b27f66c523580f78f1004e8b5a8b659e05a4eb49d4166cca406"

[[package]]
name = "windows_i686_msvc"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "db3c2bf3d13d5b658be73463284eaf12830ac9a26a90c717b7f771dfe97487bf"

[[package]]
name = "windows_x86_64_gnu"
version = "0.48.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "53d40abd2583d23e4718fddf1ebec84dbff8381c07cae67ff7768bbf19c6718e"

[[package]]
name = "windows_x86_64_gnu"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4e4246f76bdeff09eb48875a0fd3e2af6aada79d409d33011886d3e1581517d9"

[[package]]
name = "windows_x86_64_gnullvm"
version = "0.48.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0b7b52767868a23d5bab768e390dc5f5c55825b6d30b86c844ff2dc7414044cc"

[[package]]
name = "windows_x86_64_gnullvm"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "852298e482cd67c356ddd9570386e2862b5673c85bd5f88df9ab6802b334c596"

[[package]]
name = "windows_x86_64_msvc"
version = "0.48.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ed94fce61571a4006852b7389a063ab983c02eb1bb37b47f8272ce92d06d9538"

[[package]]
name = "windows_x86_64_msvc"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bec47e5bfd1bff0eeaf6d8b485cc1074891a197ab4225d504cb7a1ab88b02bf0"

[[package]]
name = "winnow"
version = "0.5.40"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f593a95398737aeed53e489c785df13f3618e41dbcd6718c6addbf1395aa6876"
dependencies = [
 "memchr",
]

[[package]]
name = "winreg"
version = "0.8.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d107f8c6e916235c4c01cabb3e8acf7bea8ef6a63ca2e7fa0527c049badfc48c"
dependencies = [
 "winapi",
]

[[package]]
name = "winreg"
version = "0.50.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "524e57b2c537c0f9b1e69f1965311ec12182b4122e45035b1508cd24d2adadb1"
dependencies = [
 "cfg-if",
 "windows-sys 0.48.0",
]

[[package]]
name = "write16"
version = "1.0.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d1890f4022759daae28ed4fe62859b1236caebfc61ede2f63ed4e695f3f6d936"

[[package]]
name = "writeable"
version = "0.5.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1e9df38ee2d2c3c5948ea468a8406ff0db0b29ae1ffde1bcf20ef305bcc95c51"

[[package]]
name = "xattr"
version = "1.3.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8da84f1a25939b27f6820d92aed108f83ff920fdf11a7b19366c27c4cda81d4f"
dependencies = [
 "libc",
 "linux-raw-sys 0.4.14",
 "rustix 0.38.34",
]

[[package]]
name = "xdg-home"
version = "1.1.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "21e5a325c3cb8398ad6cf859c1135b25dd29e186679cf2da7581d9679f63b38e"
dependencies = [
 "libc",
 "winapi",
]

[[package]]
name = "yasna"
version = "0.5.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e17bb3549cc1321ae1296b9cdc2698e2b6cb1992adfa19a8c72e5b7a738f44cd"
dependencies = [
 "bit-vec",
 "num-bigint",
]

[[package]]
name = "yoke"
version = "0.7.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "120e6aef9aa629e3d4f52dc8cc43a015c7724194c97dfaf45180d2daf2b77f40"
dependencies = [
 "serde",
 "stable_deref_trait",
 "yoke-derive",
 "zerofrom",
]

[[package]]
name = "yoke-derive"
version = "0.7.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2380878cad4ac9aac1e2435f3eb4020e8374b5f13c296cb75b4620ff8e229154"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
 "synstructure",
]

[[package]]
name = "zbus"
version = "3.15.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "675d170b632a6ad49804c8cf2105d7c31eddd3312555cffd4b740e08e97c25e6"
dependencies = [
 "async-broadcast",
 "async-process",
 "async-recursion",
 "async-trait",
 "byteorder",
 "derivative",
 "enumflags2",
 "event-listener 2.5.3",
 "futures-core",
 "futures-sink",
 "futures-util",
 "hex",
 "nix",
 "once_cell",
 "ordered-stream",
 "rand 0.8.5",
 "serde",
 "serde_repr",
 "sha1",
 "static_assertions",
 "tokio",
 "tracing",
 "uds_windows",
 "winapi",
 "xdg-home",
 "zbus_macros",
 "zbus_names",
 "zvariant",
]

[[package]]
name = "zbus_macros"
version = "3.15.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7131497b0f887e8061b430c530240063d33bf9455fa34438f388a245da69e0a5"
dependencies = [
 "proc-macro-crate",
 "proc-macro2",
 "quote",
 "regex",
 "syn 1.0.109",
 "zvariant_utils",
]

[[package]]
name = "zbus_names"
version = "2.6.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "437d738d3750bed6ca9b8d423ccc7a8eb284f6b1d6d4e225a0e4e6258d864c8d"
dependencies = [
 "serde",
 "static_assertions",
 "zvariant",
]

[[package]]
name = "zerofrom"
version = "0.1.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "cff3ee08c995dee1859d998dea82f7374f2826091dd9cd47def953cae446cd2e"
dependencies = [
 "zerofrom-derive",
]

[[package]]
name = "zerofrom-derive"
version = "0.1.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "595eed982f7d355beb85837f651fa22e90b3c044842dc7f2c2842c086f295808"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
 "synstructure",
]

[[package]]
name = "zeroize"
version = "1.7.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "525b4ec142c6b68a2d10f01f7bbf6755599ca3f81ea53b8431b7dd348f5fdb2d"

[[package]]
name = "zerovec"
version = "0.10.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "aa2b893d79df23bfb12d5461018d408ea19dfafe76c2c7ef6d4eba614f8ff079"
dependencies = [
 "yoke",
 "zerofrom",
 "zerovec-derive",
]

[[package]]
name = "zerovec-derive"
version = "0.10.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6eafa6dfb17584ea3e2bd6e76e0cc15ad7af12b09abdd1ca55961bed9b1063c6"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.65",
]

[[package]]
name = "zip"
version = "0.6.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "760394e246e4c28189f19d488c058bf16f564016aefac5d32bb1f3b51d5e9261"
dependencies = [
 "byteorder",
 "crc32fast",
 "crossbeam-utils",
 "flate2",
 "time",
]

[[package]]
name = "zvariant"
version = "3.15.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4eef2be88ba09b358d3b58aca6e41cd853631d44787f319a1383ca83424fb2db"
dependencies = [
 "byteorder",
 "enumflags2",
 "libc",
 "serde",
 "static_assertions",
 "zvariant_derive",
]

[[package]]
name = "zvariant_derive"
version = "3.15.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "37c24dc0bed72f5f90d1f8bb5b07228cbf63b3c6e9f82d82559d4bae666e7ed9"
dependencies = [
 "proc-macro-crate",
 "proc-macro2",
 "quote",
 "syn 1.0.109",
 "zvariant_utils",
]

[[package]]
name = "zvariant_utils"
version = "1.0.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7234f0d811589db492d16893e3f21e8e2fd282e6d01b0cddee310322062cc200"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 1.0.109",
]
```

--------------------------------------------------------------------------------

---[FILE: cli/Cargo.toml]---
Location: vscode-main/cli/Cargo.toml

```toml
[package]
name = "code-cli"
version = "0.1.0"
edition = "2021"
default-run = "code"

[lib]
name = "cli"
path = "src/lib.rs"

[[bin]]
name = "code"

[dependencies]
futures = "0.3.28"
clap = { version = "4.3.0", features = ["derive", "env"] }
open = "4.1.0"
reqwest = { version = "0.11.22", default-features = false, features = ["json", "stream", "native-tls"] }
tokio = { version = "1.38.2", features = ["full"] }
tokio-util = { version = "0.7.8", features = ["compat", "codec"] }
flate2 = { version = "1.0.26", default-features = false, features = ["zlib"] }
zip = { version = "0.6.6", default-features = false, features = ["time", "deflate-zlib"] }
regex = "1.8.3"
lazy_static = "1.4.0"
sysinfo = { version = "0.29.0", default-features = false }
serde = { version = "1.0.163", features = ["derive"] }
serde_json = "1.0.96"
rmp-serde = "1.1.1"
uuid = { version = "1.4", features = ["serde", "v4"] }
dirs = "5.0.1"
rand = "0.8.5"
opentelemetry = { version = "0.19.0", features = ["rt-tokio"] }
serde_bytes = "0.11.9"
chrono = { version = "0.4.26", features = ["serde", "std", "clock"], default-features = false }
gethostname = "0.4.3"
libc = "0.2.144"
tunnels = { git = "https://github.com/microsoft/dev-tunnels", rev = "8cae9b2a24c65c6c1958f5a0e77d72b23b5c6c30", default-features = false, features = ["connections"] }
keyring = { version = "2.0.3", default-features = false, features = ["linux-secret-service-rt-tokio-crypto-openssl", "platform-windows", "platform-macos", "linux-keyutils"] }
dialoguer = "0.10.4"
hyper = { version = "0.14.26", features = ["server", "http1", "runtime"] }
indicatif = "0.17.4"
tempfile = "3.5.0"
clap_lex = "0.7.0"
url = "2.5.4"
async-trait = "0.1.68"
log = "0.4.18"
const_format = "0.2.31"
sha2 = "0.10.6"
base64 = "0.21.2"
shell-escape = "0.1.5"
thiserror = "1.0.40"
cfg-if = "1.0.0"
pin-project = "1.1.0"
console = "0.15.7"
bytes = "1.4.0"
tar = "0.4.38"

[build-dependencies]
serde = { version="1.0.163", features = ["derive"] }
serde_json = "1.0.96"

[target.'cfg(windows)'.dependencies]
winreg = "0.50.0"
winapi = "0.3.9"

[target.'cfg(target_os = "macos")'.dependencies]
core-foundation = "0.9.3"

[target.'cfg(target_os = "linux")'.dependencies]
zbus = { version = "3.13.1", default-features = false, features = ["tokio"] }

[patch.crates-io]
russh = { git = "https://github.com/microsoft/vscode-russh", branch = "main" }
russh-cryptovec = { git = "https://github.com/microsoft/vscode-russh", branch = "main" }
russh-keys = { git = "https://github.com/microsoft/vscode-russh", branch = "main" }

[profile.release]
strip = true
lto = true

[features]
default = []
vsda = []
vscode-encrypt = []
```

--------------------------------------------------------------------------------

---[FILE: cli/CONTRIBUTING.md]---
Location: vscode-main/cli/CONTRIBUTING.md

```markdown
# Setup

0. Clone, and then run `git submodule update --init --recursive`
1. Get the extensions: [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) and [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb)
2. Ensure your workspace is set to the `launcher` folder being the root.

## Building the CLI on Windows

For the moment, we require OpenSSL on Windows, where it is not usually installed by default. To install it:

1. Follow steps 1 and 2 of [Set up vcpkg](https://learn.microsoft.com/en-us/vcpkg/get_started/get-started-msbuild?pivots=shell-powershell#1---set-up-vcpkg) to obtain the executable.
1. Add the location of the `vcpkg` directory to your system or user PATH.
1. Run`vcpkg install openssl:x64-windows-static-md` (after restarting your terminal for PATH changes to apply)
1. You should be able to then `cargo build` successfully

OpenSSL is needed for the key exchange we do when forwarding Basis tunnels. When all interested Basis clients support ED25519, we would be able to solely use libsodium. At the time of writing however, there is [no active development](https://chromestatus.com/feature/4913922408710144) on this in Chromium.

# Debug

1. You can use the Debug tasks already configured to run the launcher.
```

--------------------------------------------------------------------------------

---[FILE: cli/rustfmt.toml]---
Location: vscode-main/cli/rustfmt.toml

```toml
hard_tabs = true
```

--------------------------------------------------------------------------------

````
