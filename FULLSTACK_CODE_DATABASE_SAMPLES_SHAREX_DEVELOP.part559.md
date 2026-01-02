---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 559
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 559 of 650)

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

---[FILE: LobFile.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/LobFile.cs

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
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class LobFileFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Lithiio;

        public override Image ServiceImage => Resources.LobFile;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.LithiioSettings != null && !string.IsNullOrEmpty(config.LithiioSettings.UserAPIKey);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new LobFile(config.LithiioSettings);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpLithiio;
    }

    public sealed class LobFile : FileUploader
    {
        public LobFileSettings Config { get; private set; }

        public LobFile()
        {
        }

        public LobFile(LobFileSettings config)
        {
            Config = config;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("api_key", Config.UserAPIKey);

            UploadResult result = SendRequestFile("https://lobfile.com/api/v3/upload", stream, fileName, "file", args);

            if (result.IsSuccess)
            {
                LobFileUploadResponse uploadResponse = JsonConvert.DeserializeObject<LobFileUploadResponse>(result.Response);

                if (uploadResponse.Success)
                {
                    result.URL = uploadResponse.URL;
                }
                else
                {
                    Errors.Add(uploadResponse.Error);
                }
            }

            return result;
        }

        public string FetchAPIKey(string email, string password)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("email", email);
            args.Add("password", password);

            string response = SendRequestMultiPart("https://lobfile.com/api/v3/fetch-api-key", args);

            if (!string.IsNullOrEmpty(response))
            {
                LobFileFetchAPIKeyResponse apiKeyResponse = JsonConvert.DeserializeObject<LobFileFetchAPIKeyResponse>(response);

                if (apiKeyResponse.Success)
                {
                    return apiKeyResponse.API_Key;
                }
                else
                {
                    throw new Exception(apiKeyResponse.Error);
                }
            }

            return null;
        }

        private class LobFileResponse
        {
            public bool Success { get; set; }
            public string Error { get; set; }
        }

        private class LobFileUploadResponse : LobFileResponse
        {
            public string URL { get; set; }
        }

        private class LobFileFetchAPIKeyResponse : LobFileResponse
        {
            public string API_Key { get; set; }
        }
    }

    public class LobFileSettings
    {
        [JsonEncrypt]
        public string UserAPIKey { get; set; } = "";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: LocalhostAccount.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/LocalhostAccount.cs

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
using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.IO;

namespace ShareX.UploadersLib
{
    public class LocalhostAccount : ICloneable
    {
        [Category("Localhost"), Description("Shown in the list as: Name - LocalhostRoot:Port")]
        public string Name { get; set; }

        [Category("Localhost"), Description(@"Root folder, e.g. C:\Inetpub\wwwroot")]
        [Editor(typeof(DirectoryNameEditor), typeof(UITypeEditor))]
        public string LocalhostRoot { get; set; }

        [Category("Localhost"), Description("Port Number"), DefaultValue(80)]
        public int Port { get; set; }

        [Category("Localhost")]
        public string UserName { get; set; }

        [Category("Localhost"), PasswordPropertyText(true), JsonEncrypt]
        public string Password { get; set; }

        [Category("Localhost"), Description("Localhost Sub-folder Path, e.g. screenshots, %y = year, %mo = month. SubFolderPath will be automatically appended to HttpHomePath if HttpHomePath does not start with @")]
        public string SubFolderPath { get; set; }

        [Category("Localhost"), Description("HTTP Home Path, %host = Host e.g. google.com without http:// because you choose that in Remote Protocol.\nURL = HttpHomePath + SubFolderPath + FileName\nURL = Host + SubFolderPath + FileName (if HttpHomePath is empty)")]
        public string HttpHomePath { get; set; }

        [Category("Localhost"), Description("Automatically add sub folder path to end of http home path"), DefaultValue(true)]
        public bool HttpHomePathAutoAddSubFolderPath { get; set; }

        [Category("Localhost"), Description("Don't add file extension to URL"), DefaultValue(false)]
        public bool HttpHomePathNoExtension { get; set; }

        [Category("Localhost"), Description("Choose an appropriate protocol to be accessed by the browser. Use 'file' for Shared Folders. RemoteProtocol will always be 'file' if HTTP Home Path is empty. "), DefaultValue(BrowserProtocol.file)]
        public BrowserProtocol RemoteProtocol { get; set; }

        [Category("Localhost"), Description("file://Host:Port"), Browsable(false)]
        public string LocalUri
        {
            get
            {
                if (string.IsNullOrEmpty(LocalhostRoot))
                {
                    return "";
                }

                return new Uri(FileHelpers.ExpandFolderVariables(LocalhostRoot)).AbsoluteUri;
            }
        }

        private string exampleFileName = "screenshot.jpg";

        [Category("Localhost"), Description("Preview of the Localhost Path based on the settings above")]
        public string PreviewLocalPath
        {
            get
            {
                return GetLocalhostUri(exampleFileName);
            }
        }

        [Category("Localhost"), Description("Preview of the HTTP Path based on the settings above")]
        public string PreviewRemotePath
        {
            get
            {
                return GetUriPath(exampleFileName);
            }
        }

        public LocalhostAccount()
        {
            Name = "New account";
            LocalhostRoot = "";
            Port = 80;
            SubFolderPath = "";
            HttpHomePath = "";
            HttpHomePathAutoAddSubFolderPath = true;
            HttpHomePathNoExtension = false;
            RemoteProtocol = BrowserProtocol.file;
        }

        public string GetSubFolderPath()
        {
            return NameParser.Parse(NameParserType.URL, SubFolderPath.Replace("%host", FileHelpers.ExpandFolderVariables(LocalhostRoot)));
        }

        public string GetHttpHomePath()
        {
            // @ deprecated
            if (HttpHomePath.StartsWith("@"))
            {
                HttpHomePath = HttpHomePath.Substring(1);
                HttpHomePathAutoAddSubFolderPath = false;
            }

            HttpHomePath = URLHelpers.RemovePrefixes(HttpHomePath);

            return NameParser.Parse(NameParserType.URL, HttpHomePath.Replace("%host", FileHelpers.ExpandFolderVariables(LocalhostRoot)));
        }

        public string GetUriPath(string fileName)
        {
            if (string.IsNullOrEmpty(LocalhostRoot))
            {
                return "";
            }

            if (HttpHomePathNoExtension)
            {
                fileName = Path.GetFileNameWithoutExtension(fileName);
            }

            fileName = URLHelpers.URLEncode(fileName);

            string subFolderPath = GetSubFolderPath();
            subFolderPath = URLHelpers.URLEncode(subFolderPath, true);

            string httpHomePath = GetHttpHomePath();

            string path;

            if (string.IsNullOrEmpty(httpHomePath))
            {
                RemoteProtocol = BrowserProtocol.file;
                path = LocalUri.Replace("file://", "");
            }
            else
            {
                path = URLHelpers.URLEncode(httpHomePath, true);
            }

            if (Port != 80)
            {
                path = string.Format("{0}:{1}", path, Port);
            }

            if (HttpHomePathAutoAddSubFolderPath)
            {
                path = URLHelpers.CombineURL(path, subFolderPath);
            }

            path = URLHelpers.CombineURL(path, fileName);

            string remoteProtocol = RemoteProtocol.GetDescription();

            if (!path.StartsWith(remoteProtocol))
            {
                path = remoteProtocol + path;
            }

            return path;
        }

        public string GetLocalhostPath(string fileName)
        {
            if (string.IsNullOrEmpty(LocalhostRoot))
            {
                return "";
            }

            return Path.Combine(Path.Combine(FileHelpers.ExpandFolderVariables(LocalhostRoot), GetSubFolderPath()), fileName);
        }

        public string GetLocalhostUri(string fileName)
        {
            string localhostAddress = LocalUri;

            if (string.IsNullOrEmpty(localhostAddress))
            {
                return "";
            }

            return URLHelpers.CombineURL(localhostAddress, GetSubFolderPath(), fileName);
        }

        public override string ToString()
        {
            return string.Format("{0} - {1}:{2}", Name, FileHelpers.GetVariableFolderPath(LocalhostRoot), Port);
        }

        public LocalhostAccount Clone()
        {
            return MemberwiseClone() as LocalhostAccount;
        }

        object ICloneable.Clone()
        {
            return Clone();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MediaFire.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/MediaFire.cs

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
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class MediaFireFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.MediaFire;

        public override Icon ServiceIcon => Resources.MediaFire;

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.MediaFireUsername) && !string.IsNullOrEmpty(config.MediaFirePassword);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new MediaFire(APIKeys.MediaFireAppId, APIKeys.MediaFireApiKey, config.MediaFireUsername, config.MediaFirePassword)
            {
                UploadPath = NameParser.Parse(NameParserType.URL, config.MediaFirePath),
                UseLongLink = config.MediaFireUseLongLink
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpMediaFire;
    }

    public sealed class MediaFire : FileUploader
    {
        public string UploadPath { get; set; }
        public bool UseLongLink { get; set; }

        private static readonly string apiUrl = "https://www.mediafire.com/api/";
        private static readonly int pollInterval = 1000;
        private readonly string appId, apiKey, user, pasw;
        private string sessionToken, signatureTime;
        private int signatureKey;

        public MediaFire(string appId, string apiKey, string user, string pasw)
        {
            this.appId = appId;
            this.apiKey = apiKey;
            this.user = user;
            this.pasw = pasw;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            AllowReportProgress = false;
            GetSessionToken();
            AllowReportProgress = true;
            string key = SimpleUpload(stream, fileName);
            AllowReportProgress = false;
            string url;
            while ((url = PollUpload(key, fileName)) == null)
            {
                Thread.Sleep(pollInterval);
            }
            return new UploadResult() { IsSuccess = true, URL = url };
        }

        private void GetSessionToken()
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("email", user);
            args.Add("password", pasw);
            args.Add("application_id", appId);
            args.Add("token_version", "2");
            args.Add("response_format", "json");
            args.Add("signature", GetInitSignature());
            string respStr = SendRequestMultiPart(apiUrl + "user/get_session_token.php", args);
            GetSessionTokenResponse resp = DeserializeResponse<GetSessionTokenResponse>(respStr);
            EnsureSuccess(resp);
            if (resp.session_token == null || resp.time == null || resp.secret_key == null)
                throw new IOException("Invalid response");
            sessionToken = resp.session_token;
            signatureTime = resp.time;
            signatureKey = (int)resp.secret_key;
        }

        private string SimpleUpload(Stream stream, string fileName)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("session_token", sessionToken);
            args.Add("path", UploadPath);
            args.Add("response_format", "json");
            args.Add("signature", GetSignature("upload/simple.php", args));
            string url = URLHelpers.CreateQueryString(apiUrl + "upload/simple.php", args);
            UploadResult res = SendRequestFile(url, stream, fileName, "Filedata");
            if (!res.IsSuccess) throw new IOException(res.ErrorsToString());
            SimpleUploadResponse resp = DeserializeResponse<SimpleUploadResponse>(res.Response);
            EnsureSuccess(resp);
            if (resp.doupload.result != 0 || resp.doupload.key == null) throw new IOException("Invalid response");
            return resp.doupload.key;
        }

        private string PollUpload(string uploadKey, string fileName)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("session_token", sessionToken);
            args.Add("key", uploadKey);
            args.Add("filename", fileName);
            args.Add("response_format", "json");
            args.Add("signature", GetSignature("upload/poll_upload.php", args));
            string respStr = SendRequestMultiPart(apiUrl + "upload/poll_upload.php", args);
            PollUploadResponse resp = DeserializeResponse<PollUploadResponse>(respStr);
            EnsureSuccess(resp);
            if (resp.doupload.result == null || resp.doupload.status == null) throw new IOException("Invalid response");
            if (resp.doupload.result != 0 || resp.doupload.fileerror != null)
            {
                throw new IOException(string.Format("Couldn't upload the file: {0}", resp.doupload.description ?? "Unknown error"));
            }
            if (resp.doupload.status == 99)
            {
                if (resp.doupload.quickkey == null) throw new IOException("Invalid response");

                string url = URLHelpers.CombineURL("http://www.mediafire.com/view", resp.doupload.quickkey);
                if (UseLongLink) url = URLHelpers.CombineURL(url, URLHelpers.URLEncode(resp.doupload.filename));
                return url;
            }
            return null;
        }

        private void EnsureSuccess(MFResponse resp)
        {
            if (resp.result != "Success")
                throw new IOException(string.Format("Couldn't upload the file: {0}", resp.message ?? "Unknown error"));
            if (resp.new_key == "yes") NextSignatureKey();
        }

        private string GetInitSignature()
        {
            string signatureStr = user + pasw + appId + apiKey;
            byte[] signatureBytes = Encoding.ASCII.GetBytes(signatureStr);
            SHA1 sha1Gen = SHA1.Create();
            byte[] sha1Bytes = sha1Gen.ComputeHash(signatureBytes);
            return BytesToString(sha1Bytes);
        }

        private string GetSignature(string urlSuffix, Dictionary<string, string> args)
        {
            string keyStr = (signatureKey % 256).ToString(CultureInfo.InvariantCulture);
            string urlStr = CreateNonEscapedQuery("/api/" + urlSuffix, args);
            string signatureStr = keyStr + signatureTime + urlStr;
            byte[] signatureBytes = Encoding.ASCII.GetBytes(signatureStr);
            MD5 md5gen = MD5.Create();
            byte[] md5Bytes = md5gen.ComputeHash(signatureBytes);
            return BytesToString(md5Bytes);
        }

        private void NextSignatureKey()
        {
            signatureKey = (int)(((long)signatureKey * 16807) % 2147483647);
        }

        private T DeserializeResponse<T>(string s) where T : new()
        {
            var refObj = new { response = new T() };
            object obj = JsonConvert.DeserializeObject(s, refObj.GetType());
            return (T)obj.GetType().GetProperty("response").GetValue(obj, null);
        }

        private static char IntToChar(int x)
        {
            if (x < 10) return (char)(x + '0');
            return (char)(x - 10 + 'a');
        }

        private static string BytesToString(byte[] b)
        {
            char[] res = new char[b.Length * 2];
            for (int i = 0; i < b.Length; ++i)
            {
                res[2 * i] = IntToChar(b[i] >> 4);
                res[(2 * i) + 1] = IntToChar(b[i] & 0xf);
            }
            return new string(res);
        }

        private static string CreateNonEscapedQuery(string url, Dictionary<string, string> args)
        {
            if (args != null && args.Count > 0)
                return url + "?" + string.Join("&", args.Select(x => x.Key + "=" + x.Value).ToArray());
            return url;
        }

        private class MFResponse
        {
            public string result { get; set; }
            public int? error { get; set; }
            public string message { get; set; }
            public string new_key { get; set; }
        }

        private class GetSessionTokenResponse : MFResponse
        {
            public string session_token { get; set; }
            public int? secret_key { get; set; }
            public string time { get; set; }
        }

        private class SimpleUploadResponse : MFResponse
        {
            public DoUpload doupload { get; set; }

            public class DoUpload
            {
                public int? result { get; set; }
                public string key { get; set; }
            }
        }

        private class PollUploadResponse : MFResponse
        {
            public DoUpload doupload { get; set; }

            public class DoUpload
            {
                public int? result { get; set; }
                public int? status { get; set; }
                public string description { get; set; }
                public int? fileerror { get; set; }
                public string quickkey { get; set; }
                public string filename { get; set; }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Mega.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Mega.cs

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

using CG.Web.MegaApiClient;
using ShareX.UploadersLib.Properties;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class MegaFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Mega;

        public override Icon ServiceIcon => Resources.Mega;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.MegaAuthInfos != null && config.MegaAuthInfos.Email != null && config.MegaAuthInfos.Hash != null &&
                config.MegaAuthInfos.PasswordAesKey != null;
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Mega(config.MegaAuthInfos?.GetMegaApiClientAuthInfos(), config.MegaParentNodeId);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpMega;
    }

    public sealed class Mega : FileUploader, IWebClient
    {
        // Pack all chunks in a single upload fragment
        // (by default, MegaApiClient splits files in 1MB fragments and do multiple uploads)
        // It allows to have a consistent upload progression in ShareX
        private const int UploadChunksPackSize = -1;

        private readonly MegaApiClient megaClient;
        private readonly MegaApiClient.AuthInfos authInfos;
        private readonly string parentNodeId;

        public Mega() : this(null, null)
        {
        }

        public Mega(MegaApiClient.AuthInfos authInfos) : this(authInfos, null)
        {
        }

        public Mega(MegaApiClient.AuthInfos authInfos, string parentNodeId)
        {
            AllowReportProgress = false;
            Options options = new Options(chunksPackSize: UploadChunksPackSize);
            megaClient = new MegaApiClient(options, this);
            this.authInfos = authInfos;
            this.parentNodeId = parentNodeId;
        }

        public bool TryLogin()
        {
            try
            {
                Login();
                return true;
            }
            catch (ApiException)
            {
                return false;
            }
        }

        private void Login()
        {
            if (authInfos == null)
            {
                megaClient.LoginAnonymous();
            }
            else
            {
                megaClient.Login(authInfos);
            }
        }

        internal IEnumerable<DisplayNode> GetDisplayNodes()
        {
            IEnumerable<INode> nodes = megaClient.GetNodes().Where(n => n.Type == NodeType.Directory || n.Type == NodeType.Root).ToArray();
            List<DisplayNode> displayNodes = new List<DisplayNode>();

            foreach (INode node in nodes)
            {
                displayNodes.Add(new DisplayNode(node, nodes));
            }

            displayNodes.Sort((x, y) => string.Compare(x.DisplayName, y.DisplayName, StringComparison.CurrentCultureIgnoreCase));
            displayNodes.Insert(0, DisplayNode.EmptyNode);

            return displayNodes;
        }

        public INode GetParentNode()
        {
            if (authInfos == null || parentNodeId == null)
            {
                return megaClient.GetNodes().SingleOrDefault(n => n.Type == NodeType.Root);
            }

            return megaClient.GetNodes().SingleOrDefault(n => n.Id == parentNodeId);
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            Login();

            INode createdNode = megaClient.Upload(stream, fileName, GetParentNode());

            UploadResult res = new UploadResult();
            res.IsURLExpected = true;
            res.URL = megaClient.GetDownloadLink(createdNode).ToString();

            return res;
        }

        #region IWebClient

        public Stream GetRequestRaw(Uri url)
        {
            throw new NotImplementedException();
        }

        public string PostRequestJson(Uri url, string jsonData)
        {
            return SendRequest(HttpMethod.POST, url.ToString(), jsonData, RequestHelpers.ContentTypeJSON);
        }

        public string PostRequestJson(Uri url, string jsonData, string hashcash)
        {
            throw new NotImplementedException();
        }

        public string PostRequestRaw(Uri url, Stream dataStream)
        {
            try
            {
                AllowReportProgress = true;
                return SendRequest(HttpMethod.POST, url.ToString(), dataStream, "application/octet-stream");
            }
            finally
            {
                AllowReportProgress = false;
            }
        }

        public Stream PostRequestRawAsStream(Uri url, Stream dataStream)
        {
            throw new NotImplementedException();
        }

        #endregion IWebClient

        internal class DisplayNode
        {
            public static readonly DisplayNode EmptyNode = new DisplayNode();

            private DisplayNode()
            {
                DisplayName = "[Select a folder]";
            }

            public DisplayNode(INode node, IEnumerable<INode> nodes)
            {
                Node = node;
                DisplayName = GenerateDisplayName(node, nodes);
            }

            public INode Node { get; private set; }

            public string DisplayName { get; private set; }

            private string GenerateDisplayName(INode node, IEnumerable<INode> nodes)
            {
                List<string> nodesTree = new List<string>();

                INode parent = node;
                do
                {
                    if (parent.Type == NodeType.Directory)
                    {
                        nodesTree.Add(parent.Name);
                    }
                    else
                    {
                        nodesTree.Add(parent.Type.ToString());
                    }

                    parent = nodes.FirstOrDefault(n => n.Id == parent.ParentId);
                }
                while (parent != null);

                nodesTree.Reverse();
                return string.Join(@"\", nodesTree.ToArray());
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MegaAuthInfos.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/MegaAuthInfos.cs

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

using CG.Web.MegaApiClient;
using ShareX.HelpersLib;
using System;

namespace ShareX.UploadersLib
{
    public class MegaAuthInfos
    {
        public string Email { get; set; }
        [JsonEncrypt]
        public string Hash { get; set; }
        [JsonEncrypt]
        public string PasswordAesKey { get; set; }

        public MegaAuthInfos()
        {
        }

        public MegaAuthInfos(MegaApiClient.AuthInfos authInfos)
        {
            Email = authInfos.Email;
            Hash = authInfos.Hash;
            PasswordAesKey = Convert.ToBase64String(authInfos.PasswordAesKey);
        }

        public MegaApiClient.AuthInfos GetMegaApiClientAuthInfos()
        {
            byte[] passwordAesKey = null;

            if (!string.IsNullOrEmpty(PasswordAesKey))
            {
                passwordAesKey = Convert.FromBase64String(PasswordAesKey);
            }

            return new MegaApiClient.AuthInfos(Email, Hash, passwordAesKey);
        }
    }
}
```

--------------------------------------------------------------------------------

````
