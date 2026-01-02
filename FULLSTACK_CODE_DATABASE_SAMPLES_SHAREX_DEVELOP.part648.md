---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:48Z
part: 648
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 648 of 650)

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

---[FILE: Hastebin.cs]---
Location: ShareX-develop/ShareX.UploadersLib/TextUploaders/Hastebin.cs

```csharp
#region License Information (GPL v3)

/*
    ShareX - A program that allows you to take screenshots and share any file type
    Copyright (c) 2007-2025 ShareX Team

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Optionally you can also view the license at <http://www.gnu.org/licenses/>.
*/

#endregion License Information (GPL v3)

using Newtonsoft.Json;
using ShareX.HelpersLib;
using ShareX.UploadersLib.Properties;
using System;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.UploadersLib.TextUploaders
{
    public class HastebinTextUploaderService : TextUploaderService
    {
        public override TextDestination EnumValue { get; } = TextDestination.Hastebin;

        public override Image ServiceImage => Resources.Hastebin;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Hastebin()
            {
                CustomDomain = config.HastebinCustomDomain,
                SyntaxHighlighting = config.HastebinSyntaxHighlighting,
                UseFileExtension = config.HastebinUseFileExtension
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpHastebin;
    }

    public sealed class Hastebin : TextUploader
    {
        public string CustomDomain { get; set; }
        public string SyntaxHighlighting { get; set; }
        public bool UseFileExtension { get; set; }

        public override UploadResult UploadText(string text, string fileName)
        {
            UploadResult ur = new UploadResult();

            if (!string.IsNullOrEmpty(text))
            {
                string domain;

                if (!string.IsNullOrEmpty(CustomDomain))
                {
                    domain = CustomDomain;
                }
                else
                {
                    domain = "https://hastebin.com";
                }

                ur.Response = SendRequest(HttpMethod.POST, URLHelpers.CombineURL(domain, "documents"), text);

                if (!string.IsNullOrEmpty(ur.Response))
                {
                    HastebinResponse response = JsonConvert.DeserializeObject<HastebinResponse>(ur.Response);

                    if (response != null && !string.IsNullOrEmpty(response.Key))
                    {
                        string url = URLHelpers.CombineURL(domain, response.Key);

                        string syntaxHighlighting = SyntaxHighlighting;

                        if (UseFileExtension)
                        {
                            string ext = FileHelpers.GetFileNameExtension(fileName);

                            if (!string.IsNullOrEmpty(ext) && !ext.Equals("txt", StringComparison.OrdinalIgnoreCase))
                            {
                                syntaxHighlighting = ext.ToLowerInvariant();
                            }
                        }

                        if (!string.IsNullOrEmpty(syntaxHighlighting))
                        {
                            url += "." + syntaxHighlighting;
                        }

                        ur.URL = url;
                    }
                }
            }

            return ur;
        }

        private class HastebinResponse
        {
            public string Key { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OneTimeSecret.cs]---
Location: ShareX-develop/ShareX.UploadersLib/TextUploaders/OneTimeSecret.cs

```csharp
#region License Information (GPL v3)

/*
    ShareX - A program that allows you to take screenshots and share any file type
    Copyright (c) 2007-2025 ShareX Team

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Optionally you can also view the license at <http://www.gnu.org/licenses/>.
*/

#endregion License Information (GPL v3)

using Newtonsoft.Json;
using ShareX.HelpersLib;
using ShareX.UploadersLib.Properties;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.UploadersLib.TextUploaders
{
    public class OneTimeSecretTextUploaderService : TextUploaderService
    {
        public override TextDestination EnumValue { get; } = TextDestination.OneTimeSecret;

        public override Icon ServiceIcon => Resources.OneTimeSecret;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new OneTimeSecret()
            {
                API_KEY = config.OneTimeSecretAPIKey,
                API_USERNAME = config.OneTimeSecretAPIUsername
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpOneTimeSecret;
    }

    public sealed class OneTimeSecret : TextUploader
    {
        private const string API_ENDPOINT = "https://onetimesecret.com/api/v1/share";

        public string API_KEY { get; set; }
        public string API_USERNAME { get; set; }

        public override UploadResult UploadText(string text, string fileName)
        {
            UploadResult result = new UploadResult();

            if (!string.IsNullOrEmpty(text))
            {
                Dictionary<string, string> args = new Dictionary<string, string>();
                args.Add("secret", text);

                NameValueCollection headers = null;

                if (!string.IsNullOrEmpty(API_USERNAME) && !string.IsNullOrEmpty(API_KEY))
                {
                    headers = RequestHelpers.CreateAuthenticationHeader(API_USERNAME, API_KEY);
                }

                result.Response = SendRequestMultiPart(API_ENDPOINT, args, headers);

                if (!string.IsNullOrEmpty(result.Response))
                {
                    OneTimeSecretResponse jsonResponse = JsonConvert.DeserializeObject<OneTimeSecretResponse>(result.Response);

                    if (jsonResponse != null)
                    {
                        result.URL = URLHelpers.CombineURL("https://onetimesecret.com/secret/", jsonResponse.secret_key);
                    }
                }
            }

            return result;
        }

        public class OneTimeSecretResponse
        {
            public string custid { get; set; }
            public string metadata_key { get; set; }
            public string secret_key { get; set; }
            public string ttl { get; set; }
            public string updated { get; set; }
            public string created { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Paste2.cs]---
Location: ShareX-develop/ShareX.UploadersLib/TextUploaders/Paste2.cs

```csharp
#region License Information (GPL v3)

/*
    ShareX - A program that allows you to take screenshots and share any file type
    Copyright (c) 2007-2025 ShareX Team

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Optionally you can also view the license at <http://www.gnu.org/licenses/>.
*/

#endregion License Information (GPL v3)

using System.Collections.Generic;

namespace ShareX.UploadersLib.TextUploaders
{
    public class Paste2TextUploaderService : TextUploaderService
    {
        public override TextDestination EnumValue { get; } = TextDestination.Paste2;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            Paste2Settings settings = new Paste2Settings()
            {
                TextFormat = taskInfo.TextFormat
            };

            return new Paste2(settings);
        }
    }

    public sealed class Paste2 : TextUploader
    {
        private Paste2Settings settings;

        public Paste2()
        {
            settings = new Paste2Settings();
        }

        public Paste2(Paste2Settings settings)
        {
            this.settings = settings;
        }

        public override UploadResult UploadText(string text, string fileName)
        {
            UploadResult ur = new UploadResult();

            if (!string.IsNullOrEmpty(text))
            {
                Dictionary<string, string> arguments = new Dictionary<string, string>();
                arguments.Add("code", text);
                arguments.Add("lang", settings.TextFormat);
                arguments.Add("description", settings.Description);
                arguments.Add("parent", "");

                SendRequestMultiPart("https://paste2.org/", arguments);
                ur.URL = LastResponseInfo.ResponseURL;
            }

            return ur;
        }
    }

    public class Paste2Settings
    {
        public string TextFormat { get; set; }

        public string Description { get; set; }

        public Paste2Settings()
        {
            TextFormat = "text";
            Description = "";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Pastebin.cs]---
Location: ShareX-develop/ShareX.UploadersLib/TextUploaders/Pastebin.cs

```csharp
#region License Information (GPL v3)

/*
    ShareX - A program that allows you to take screenshots and share any file type
    Copyright (c) 2007-2025 ShareX Team

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Optionally you can also view the license at <http://www.gnu.org/licenses/>.
*/

#endregion License Information (GPL v3)

using ShareX.HelpersLib;
using ShareX.UploadersLib.Properties;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;

namespace ShareX.UploadersLib.TextUploaders
{
    public class PastebinTextUploaderService : TextUploaderService
    {
        public override TextDestination EnumValue { get; } = TextDestination.Pastebin;

        public override Icon ServiceIcon => Resources.Pastebin;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            PastebinSettings settings = config.PastebinSettings;

            if (string.IsNullOrEmpty(settings.TextFormat))
            {
                settings.TextFormat = taskInfo.TextFormat;
            }

            return new Pastebin(APIKeys.PastebinKey, settings);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpPastebin;
    }

    public sealed class Pastebin : TextUploader
    {
        private string APIKey;

        public PastebinSettings Settings { get; private set; }

        public Pastebin(string apiKey)
        {
            APIKey = apiKey;
            Settings = new PastebinSettings();
        }

        public Pastebin(string apiKey, PastebinSettings settings)
        {
            APIKey = apiKey;
            Settings = settings;
        }

        public bool Login()
        {
            if (!string.IsNullOrEmpty(Settings.Username) && !string.IsNullOrEmpty(Settings.Password))
            {
                Dictionary<string, string> loginArgs = new Dictionary<string, string>();

                loginArgs.Add("api_dev_key", APIKey);
                loginArgs.Add("api_user_name", Settings.Username);
                loginArgs.Add("api_user_password", Settings.Password);

                string loginResponse = SendRequestMultiPart("https://pastebin.com/api/api_login.php", loginArgs);

                if (!string.IsNullOrEmpty(loginResponse) && !loginResponse.StartsWith("Bad API request"))
                {
                    Settings.UserKey = loginResponse;
                    return true;
                }
            }

            Settings.UserKey = null;
            Errors.Add("Pastebin login failed.");
            return false;
        }

        public override UploadResult UploadText(string text, string fileName)
        {
            UploadResult ur = new UploadResult();

            if (!string.IsNullOrEmpty(text) && Settings != null)
            {
                Dictionary<string, string> args = new Dictionary<string, string>();

                args.Add("api_dev_key", APIKey); // which is your unique API Developers Key
                args.Add("api_option", "paste"); // set as 'paste', this will indicate you want to create a new paste
                args.Add("api_paste_code", text); // this is the text that will be written inside your paste

                // Optional args
                args.Add("api_paste_name", Settings.Title); // this will be the name / title of your paste
                args.Add("api_paste_format", Settings.TextFormat); // this will be the syntax highlighting value
                args.Add("api_paste_private", GetPrivacy(Settings.Exposure)); // this makes a paste public or private, public = 0, private = 1
                args.Add("api_paste_expire_date", GetExpiration(Settings.Expiration)); // this sets the expiration date of your paste

                if (!string.IsNullOrEmpty(Settings.UserKey))
                {
                    args.Add("api_user_key", Settings.UserKey); // this paramater is part of the login system
                }

                ur.Response = SendRequestMultiPart("https://pastebin.com/api/api_post.php", args);

                if (URLHelpers.IsValidURL(ur.Response))
                {
                    if (Settings.RawURL)
                    {
                        string id = URLHelpers.GetFileName(ur.Response);
                        ur.URL = "https://pastebin.com/raw/" + id;
                    }
                    else
                    {
                        ur.URL = ur.Response;
                    }
                }
                else
                {
                    Errors.Add(ur.Response);
                }
            }

            return ur;
        }

        private string GetPrivacy(PastebinPrivacy privacy)
        {
            switch (privacy)
            {
                case PastebinPrivacy.Public:
                    return "0";
                default:
                case PastebinPrivacy.Unlisted:
                    return "1";
                case PastebinPrivacy.Private:
                    return "2";
            }
        }

        private string GetExpiration(PastebinExpiration expiration)
        {
            switch (expiration)
            {
                default:
                case PastebinExpiration.N:
                    return "N";
                case PastebinExpiration.M10:
                    return "10M";
                case PastebinExpiration.H1:
                    return "1H";
                case PastebinExpiration.D1:
                    return "1D";
                case PastebinExpiration.W1:
                    return "1W";
                case PastebinExpiration.W2:
                    return "2W";
                case PastebinExpiration.M1:
                    return "1M";
            }
        }

        public static List<PastebinSyntaxInfo> GetSyntaxList()
        {
            string syntaxList = @"4cs = 4CS
6502acme = 6502 ACME Cross Assembler
6502kickass = 6502 Kick Assembler
6502tasm = 6502 TASM/64TASS
abap = ABAP
actionscript = ActionScript
actionscript3 = ActionScript 3
ada = Ada
aimms = AIMMS
algol68 = ALGOL 68
apache = Apache Log
applescript = AppleScript
apt_sources = APT Sources
arm = ARM
asm = ASM (NASM)
asp = ASP
asymptote = Asymptote
autoconf = autoconf
autohotkey = Autohotkey
autoit = AutoIt
avisynth = Avisynth
awk = Awk
bascomavr = BASCOM AVR
bash = Bash
basic4gl = Basic4GL
dos = Batch
bibtex = BibTeX
blitzbasic = Blitz Basic
b3d = Blitz3D
bmx = BlitzMax
bnf = BNF
boo = BOO
bf = BrainFuck
c = C
c_winapi = C (WinAPI)
c_mac = C for Macs
cil = C Intermediate Language
csharp = C#
cpp = C++
cpp-winapi = C++ (WinAPI)
cpp-qt = C++ (with Qt extensions)
c_loadrunner = C: Loadrunner
caddcl = CAD DCL
cadlisp = CAD Lisp
ceylon = Ceylon
cfdg = CFDG
chaiscript = ChaiScript
chapel = Chapel
clojure = Clojure
klonec = Clone C
klonecpp = Clone C++
cmake = CMake
cobol = COBOL
coffeescript = CoffeeScript
cfm = ColdFusion
css = CSS
cuesheet = Cuesheet
d = D
dart = Dart
dcl = DCL
dcpu16 = DCPU-16
dcs = DCS
delphi = Delphi
oxygene = Delphi Prism (Oxygene)
diff = Diff
div = DIV
dot = DOT
e = E
ezt = Easytrieve
ecmascript = ECMAScript
eiffel = Eiffel
email = Email
epc = EPC
erlang = Erlang
euphoria = Euphoria
fsharp = F#
falcon = Falcon
filemaker = Filemaker
fo = FO Language
f1 = Formula One
fortran = Fortran
freebasic = FreeBasic
freeswitch = FreeSWITCH
gambas = GAMBAS
gml = Game Maker
gdb = GDB
genero = Genero
genie = Genie
gettext = GetText
go = Go
groovy = Groovy
gwbasic = GwBasic
haskell = Haskell
haxe = Haxe
hicest = HicEst
hq9plus = HQ9 Plus
html4strict = HTML
html5 = HTML 5
icon = Icon
idl = IDL
ini = INI file
inno = Inno Script
intercal = INTERCAL
io = IO
ispfpanel = ISPF Panel Definition
j = J
java = Java
java5 = Java 5
javascript = JavaScript
jcl = JCL
jquery = jQuery
json = JSON
julia = Julia
kixtart = KiXtart
kotlin = Kotlin
latex = Latex
ldif = LDIF
lb = Liberty BASIC
lsl2 = Linden Scripting
lisp = Lisp
llvm = LLVM
locobasic = Loco Basic
logtalk = Logtalk
lolcode = LOL Code
lotusformulas = Lotus Formulas
lotusscript = Lotus Script
lscript = LScript
lua = Lua
m68k = M68000 Assembler
magiksf = MagikSF
make = Make
mapbasic = MapBasic
markdown = Markdown
matlab = MatLab
mirc = mIRC
mmix = MIX Assembler
modula2 = Modula 2
modula3 = Modula 3
68000devpac = Motorola 68000 HiSoft Dev
mpasm = MPASM
mxml = MXML
mysql = MySQL
nagios = Nagios
netrexx = NetRexx
newlisp = newLISP
nginx = Nginx
nimrod = Nimrod
nsis = NullSoft Installer
oberon2 = Oberon 2
objeck = Objeck Programming Langua
objc = Objective C
ocaml-brief = OCalm Brief
ocaml = OCaml
octave = Octave
oorexx = Open Object Rexx
pf = OpenBSD PACKET FILTER
glsl = OpenGL Shading
oobas = Openoffice BASIC
oracle11 = Oracle 11
oracle8 = Oracle 8
oz = Oz
parasail = ParaSail
parigp = PARI/GP
pascal = Pascal
pawn = Pawn
pcre = PCRE
per = Per
perl = Perl
perl6 = Perl 6
php = PHP
php-brief = PHP Brief
pic16 = Pic 16
pike = Pike
pixelbender = Pixel Bender
pli = PL/I
plsql = PL/SQL
postgresql = PostgreSQL
postscript = PostScript
povray = POV-Ray
powershell = Power Shell
powerbuilder = PowerBuilder
proftpd = ProFTPd
progress = Progress
prolog = Prolog
properties = Properties
providex = ProvideX
puppet = Puppet
purebasic = PureBasic
pycon = PyCon
python = Python
pys60 = Python for S60
q = q/kdb+
qbasic = QBasic
qml = QML
rsplus = R
racket = Racket
rails = Rails
rbs = RBScript
rebol = REBOL
reg = REG
rexx = Rexx
robots = Robots
rpmspec = RPM Spec
ruby = Ruby
gnuplot = Ruby Gnuplot
rust = Rust
sas = SAS
scala = Scala
scheme = Scheme
scilab = Scilab
scl = SCL
sdlbasic = SdlBasic
smalltalk = Smalltalk
smarty = Smarty
spark = SPARK
sparql = SPARQL
sqf = SQF
sql = SQL
standardml = StandardML
stonescript = StoneScript
sclang = SuperCollider
swift = Swift
systemverilog = SystemVerilog
tsql = T-SQL
tcl = TCL
teraterm = Tera Term
thinbasic = thinBasic
typoscript = TypoScript
unicon = Unicon
uscript = UnrealScript
upc = UPC
urbi = Urbi
vala = Vala
vbnet = VB.NET
vbscript = VBScript
vedit = Vedit
verilog = VeriLog
vhdl = VHDL
vim = VIM
visualprolog = Visual Pro Log
vb = VisualBasic
visualfoxpro = VisualFoxPro
whitespace = WhiteSpace
whois = WHOIS
winbatch = Winbatch
xbasic = XBasic
xml = XML
xorg_conf = Xorg Config
xpp = XPP
yaml = YAML
z80 = Z80 Assembler
zxbasic = ZXBasic";

            List<PastebinSyntaxInfo> result = new List<PastebinSyntaxInfo>();
            result.Add(new PastebinSyntaxInfo("None", "text"));

            foreach (string line in syntaxList.Lines().Select(x => x.Trim()))
            {
                int index = line.IndexOf('=');

                if (index > 0)
                {
                    PastebinSyntaxInfo syntaxInfo = new PastebinSyntaxInfo();
                    syntaxInfo.Value = line.Remove(index).Trim();
                    syntaxInfo.Name = line.Substring(index + 1).Trim();
                    result.Add(syntaxInfo);
                }
            }

            return result;
        }
    }

    public enum PastebinPrivacy // Localized
    {
        Public,
        Unlisted,
        Private
    }

    public enum PastebinExpiration // Localized
    {
        N,
        M10,
        H1,
        D1,
        W1,
        W2,
        M1
    }

    public class PastebinSyntaxInfo
    {
        public string Name { get; set; }
        public string Value { get; set; }

        public PastebinSyntaxInfo()
        {
        }

        public PastebinSyntaxInfo(string name, string value)
        {
            Name = name;
            Value = value;
        }

        public override string ToString()
        {
            return Name;
        }
    }

    public class PastebinSettings
    {
        public string Username { get; set; }
        [JsonEncrypt]
        public string Password { get; set; }
        public PastebinPrivacy Exposure { get; set; } = PastebinPrivacy.Unlisted;
        public PastebinExpiration Expiration { get; set; } = PastebinExpiration.N;
        public string Title { get; set; }
        public string TextFormat { get; set; } = "text";
        [JsonEncrypt]
        public string UserKey { get; set; }
        public bool RawURL { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Pastebin_ca.cs]---
Location: ShareX-develop/ShareX.UploadersLib/TextUploaders/Pastebin_ca.cs

```csharp
#region License Information (GPL v3)

/*
    ShareX - A program that allows you to take screenshots and share any file type
    Copyright (c) 2007-2025 ShareX Team

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Optionally you can also view the license at <http://www.gnu.org/licenses/>.
*/

#endregion License Information (GPL v3)

using System.Collections.Generic;
using System.ComponentModel;

namespace ShareX.UploadersLib.TextUploaders
{
    public sealed class Pastebin_ca : TextUploader
    {
        private const string APIURL = "http://pastebin.ca/quiet-paste.php";

        private string APIKey;

        private PastebinCaSettings settings;

        public Pastebin_ca(string apiKey)
        {
            APIKey = apiKey;
            settings = new PastebinCaSettings();
        }

        public Pastebin_ca(string apiKey, PastebinCaSettings settings)
        {
            APIKey = apiKey;
            this.settings = settings;
        }

        public override UploadResult UploadText(string text, string fileName)
        {
            UploadResult ur = new UploadResult();

            if (!string.IsNullOrEmpty(text))
            {
                Dictionary<string, string> arguments = new Dictionary<string, string>();
                arguments.Add("api", APIKey);
                arguments.Add("content", text);
                arguments.Add("description", settings.Description);

                if (settings.Encrypt)
                {
                    arguments.Add("encrypt", "true");
                }

                arguments.Add("encryptpw", settings.EncryptPassword);
                arguments.Add("expiry", settings.ExpireTime);
                arguments.Add("name", settings.Author);
                arguments.Add("s", "Submit Post");
                arguments.Add("tags", settings.Tags);
                arguments.Add("type", settings.TextFormat);

                ur.Response = SendRequestMultiPart(APIURL, arguments);

                if (!string.IsNullOrEmpty(ur.Response))
                {
                    if (ur.Response.StartsWith("SUCCESS:"))
                    {
                        ur.URL = "http://pastebin.ca/" + ur.Response.Substring(8);
                    }
                    else if (ur.Response.StartsWith("FAIL:"))
                    {
                        Errors.Add(ur.Response.Substring(5));
                    }
                }
            }

            return ur;
        }
    }

    public class PastebinCaSettings
    {
        /// <summary>name</summary>
        [Description("Name / Title")]
        public string Author { get; set; }

        /// <summary>description</summary>
        [Description("Description / Question")]
        public string Description { get; set; }

        /// <summary>tags</summary>
        [Description("Tags (space separated, optional)")]
        public string Tags { get; set; }

        /// <summary>type</summary>
        [Description("Content Type"), DefaultValue("1")]
        public string TextFormat { get; set; }

        /// <summary>expiry</summary>
        [Description("Expire this post in ..."), DefaultValue("1 month")]
        public string ExpireTime { get; set; }

        /// <summary>encrypt</summary>
        [Description("Encrypt this paste")]
        public bool Encrypt { get; set; }

        /// <summary>encryptpw</summary>
        public string EncryptPassword { get; set; }

        public PastebinCaSettings()
        {
            Author = "";
            Description = "";
            Tags = "";
            TextFormat = "1";
            ExpireTime = "1 month";
            Encrypt = false;
            EncryptPassword = "";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Paste_ee.cs]---
Location: ShareX-develop/ShareX.UploadersLib/TextUploaders/Paste_ee.cs

```csharp
#region License Information (GPL v3)

/*
    ShareX - A program that allows you to take screenshots and share any file type
    Copyright (c) 2007-2025 ShareX Team

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Optionally you can also view the license at <http://www.gnu.org/licenses/>.
*/

#endregion License Information (GPL v3)

using Newtonsoft.Json;
using ShareX.UploadersLib.Properties;
using System;
using System.Collections.Specialized;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.UploadersLib.TextUploaders
{
    public class Paste_eeTextUploaderService : TextUploaderService
    {
        public override TextDestination EnumValue { get; } = TextDestination.Paste_ee;

        public override Image ServiceImage => Resources.document;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            string apiKey;

            if (!string.IsNullOrEmpty(config.Paste_eeUserKey))
            {
                apiKey = config.Paste_eeUserKey;
            }
            else
            {
                apiKey = APIKeys.Paste_eeApplicationKey;
            }

            return new Paste_ee(apiKey)
            {
                EncryptPaste = config.Paste_eeEncryptPaste
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpPaste_ee;
    }

    public sealed class Paste_ee : TextUploader
    {
        public string APIKey { get; private set; }
        public bool EncryptPaste { get; set; }

        public Paste_ee(string apiKey)
        {
            APIKey = apiKey;
        }

        public override UploadResult UploadText(string text, string fileName)
        {
            if (string.IsNullOrEmpty(APIKey))
            {
                throw new Exception("API key is missing.");
            }

            UploadResult ur = new UploadResult();

            if (!string.IsNullOrEmpty(text))
            {
                Paste_eeSubmitRequestBody requestBody = new Paste_eeSubmitRequestBody()
                {
                    encrypted = EncryptPaste,
                    description = "",
                    expiration = "never",
                    sections = new Paste_eeSubmitRequestBodySection[]
                    {
                        new Paste_eeSubmitRequestBodySection()
                        {
                            name = "",
                            syntax = "autodetect",
                            contents = text
                        }
                    }
                };

                string json = JsonConvert.SerializeObject(requestBody);

                NameValueCollection headers = new NameValueCollection();
                headers.Add("X-Auth-Token", APIKey);

                ur.Response = SendRequest(HttpMethod.POST, "https://api.paste.ee/v1/pastes", json, RequestHelpers.ContentTypeJSON, null, headers);

                if (!string.IsNullOrEmpty(ur.Response))
                {
                    Paste_eeSubmitResponse response = JsonConvert.DeserializeObject<Paste_eeSubmitResponse>(ur.Response);

                    ur.URL = response.link;
                }
            }

            return ur;
        }
    }

    public class Paste_eeSubmitRequestBody
    {
        public bool encrypted { get; set; }
        public string description { get; set; }
        public string expiration { get; set; }
        public Paste_eeSubmitRequestBodySection[] sections { get; set; }
    }

    public class Paste_eeSubmitRequestBodySection
    {
        public string name { get; set; }
        public string syntax { get; set; }
        public string contents { get; set; }
    }

    public class Paste_eeSubmitResponse
    {
        public string id { get; set; }
        public string link { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Pastie.cs]---
Location: ShareX-develop/ShareX.UploadersLib/TextUploaders/Pastie.cs

```csharp
#region License Information (GPL v3)

/*
    ShareX - A program that allows you to take screenshots and share any file type
    Copyright (c) 2007-2025 ShareX Team

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Optionally you can also view the license at <http://www.gnu.org/licenses/>.
*/

#endregion License Information (GPL v3)

using ShareX.UploadersLib.Properties;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.UploadersLib.TextUploaders
{
    internal class PastieTextUploaderService : TextUploaderService
    {
        public override TextDestination EnumValue { get; } = TextDestination.Pastie;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override Image ServiceImage => Resources.Pastie;

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Pastie()
            {
                IsPublic = config.PastieIsPublic
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpPastie;
    }

    public sealed class Pastie : TextUploader
    {
        public bool IsPublic { get; set; }

        public override UploadResult UploadText(string text, string fileName)
        {
            UploadResult ur = new UploadResult();

            if (!string.IsNullOrEmpty(text))
            {
                Dictionary<string, string> arguments = new Dictionary<string, string>();
                arguments.Add("paste[body]", text);
                arguments.Add("paste[restricted]", IsPublic ? "0" : "1");
                arguments.Add("paste[authorization]", "burger");

                SendRequestURLEncoded(HttpMethod.POST, "http://pastie.org/pastes", arguments);
                ur.URL = LastResponseInfo.ResponseURL;
            }

            return ur;
        }
    }
}
```

--------------------------------------------------------------------------------

````
