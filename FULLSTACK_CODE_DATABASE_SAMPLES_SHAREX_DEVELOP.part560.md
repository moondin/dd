---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 560
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 560 of 650)

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

---[FILE: OneDrive.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/OneDrive.cs

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
using System.ComponentModel;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class OneDriveFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.OneDrive;

        public override Icon ServiceIcon => Resources.OneDrive;

        public override bool CheckConfig(UploadersConfig config)
        {
            return OAuth2Info.CheckOAuth(config.OneDriveV2OAuth2Info);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new OneDrive(config.OneDriveV2OAuth2Info)
            {
                FolderID = config.OneDriveV2SelectedFolder.id,
                AutoCreateShareableLink = config.OneDriveAutoCreateShareableLink,
                UseDirectLink = config.OneDriveUseDirectLink
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpOneDrive;
    }

    public sealed class OneDrive : FileUploader, IOAuth2
    {
        private const string AuthorizationEndpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
        private const string TokenEndpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
        private const int MaxSegmentSize = 64 * 1024 * 1024; // 64 MiB

        public OAuth2Info AuthInfo { get; set; }
        public string FolderID { get; set; }
        public bool AutoCreateShareableLink { get; set; }
        public bool UseDirectLink { get; set; }

        public static OneDriveFileInfo RootFolder = new OneDriveFileInfo
        {
            id = "", // empty defaults to root
            name = Resources.OneDrive_RootFolder_Root_folder
        };

        public OneDrive(OAuth2Info authInfo)
        {
            AuthInfo = authInfo;
        }

        public string GetAuthorizationURL()
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("client_id", AuthInfo.Client_ID);
            args.Add("scope", "offline_access files.readwrite");
            args.Add("response_type", "code");
            args.Add("redirect_uri", Links.Callback);
            if (AuthInfo.Proof != null)
            {
                args.Add("code_challenge", AuthInfo.Proof.CodeChallenge);
                args.Add("code_challenge_method", AuthInfo.Proof.ChallengeMethod);
            }

            return URLHelpers.CreateQueryString(AuthorizationEndpoint, args);
        }

        public bool GetAccessToken(string code)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("client_id", AuthInfo.Client_ID);
            args.Add("redirect_uri", Links.Callback);
            args.Add("client_secret", AuthInfo.Client_Secret);
            args.Add("code", code);
            args.Add("grant_type", "authorization_code");
            if (AuthInfo.Proof != null)
            {
                args.Add("code_verifier", AuthInfo.Proof.CodeVerifier);
            }

            string response = SendRequestURLEncoded(HttpMethod.POST, TokenEndpoint, args);

            if (!string.IsNullOrEmpty(response))
            {
                OAuth2Token token = JsonConvert.DeserializeObject<OAuth2Token>(response);

                if (token != null && !string.IsNullOrEmpty(token.access_token))
                {
                    token.UpdateExpireDate();
                    AuthInfo.Token = token;
                    return true;
                }
            }

            return false;
        }

        public bool RefreshAccessToken()
        {
            if (OAuth2Info.CheckOAuth(AuthInfo) && !string.IsNullOrEmpty(AuthInfo.Token.refresh_token))
            {
                Dictionary<string, string> args = new Dictionary<string, string>();
                args.Add("client_id", AuthInfo.Client_ID);
                args.Add("client_secret", AuthInfo.Client_Secret);
                args.Add("refresh_token", AuthInfo.Token.refresh_token);
                args.Add("grant_type", "refresh_token");

                string response = SendRequestURLEncoded(HttpMethod.POST, TokenEndpoint, args);

                if (!string.IsNullOrEmpty(response))
                {
                    OAuth2Token token = JsonConvert.DeserializeObject<OAuth2Token>(response);

                    if (token != null && !string.IsNullOrEmpty(token.access_token))
                    {
                        token.UpdateExpireDate();
                        string refresh_token = AuthInfo.Token.refresh_token;
                        AuthInfo.Token = token;
                        AuthInfo.Token.refresh_token = refresh_token;
                        return true;
                    }
                }
            }

            return false;
        }

        public bool CheckAuthorization()
        {
            if (OAuth2Info.CheckOAuth(AuthInfo))
            {
                if (AuthInfo.Token.IsExpired && !RefreshAccessToken())
                {
                    Errors.Add("Refresh access token failed.");
                    return false;
                }
            }
            else
            {
                Errors.Add("Login is required.");
                return false;
            }

            return true;
        }

        private NameValueCollection GetAuthHeaders()
        {
            NameValueCollection headers = new NameValueCollection();
            headers.Add("Authorization", "Bearer " + AuthInfo.Token.access_token);
            return headers;
        }

        private string GetFolderUrl(string folderID)
        {
            string folderPath;

            if (!string.IsNullOrEmpty(folderID))
            {
                folderPath = URLHelpers.CombineURL("me/drive/items", folderID);
            }
            else
            {
                folderPath = "me/drive/root";
            }

            return folderPath;
        }

        private string CreateSession(string fileName)
        {
            string json = JsonConvert.SerializeObject(new
            {
                item = new Dictionary<string, string>
                {
                    { "@microsoft.graph.conflictBehavior", "replace" }
                }
            });

            string folderPath = GetFolderUrl(FolderID);

            string url = URLHelpers.BuildUri("https://graph.microsoft.com", $"/v1.0/{folderPath}:/{fileName}:/createUploadSession");

            AllowReportProgress = false;
            string response = SendRequest(HttpMethod.POST, url, json, RequestHelpers.ContentTypeJSON, headers: GetAuthHeaders());
            AllowReportProgress = true;

            OneDriveUploadSession session = JsonConvert.DeserializeObject<OneDriveUploadSession>(response);

            if (session != null)
            {
                return session.uploadUrl;
            }

            return null;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            if (!CheckAuthorization()) return null;

            UploadResult result;
            string sessionUrl = CreateSession(fileName);
            long position = 0;

            do
            {
                result = SendRequestFileRange(sessionUrl, stream, fileName, position, MaxSegmentSize);

                if (result.IsSuccess)
                {
                    position += MaxSegmentSize;
                }
                else
                {
                    SendRequest(HttpMethod.DELETE, sessionUrl);
                    break;
                }
            }
            while (position < stream.Length);

            if (result.IsSuccess)
            {
                OneDriveFileInfo uploadInfo = JsonConvert.DeserializeObject<OneDriveFileInfo>(result.Response);

                if (AutoCreateShareableLink)
                {
                    AllowReportProgress = false;

                    result.URL = CreateShareableLink(uploadInfo.id, UseDirectLink ? OneDriveLinkType.Embed : OneDriveLinkType.Read);
                }
                else
                {
                    result.URL = uploadInfo.webUrl;
                }
            }

            return result;
        }

        public string CreateShareableLink(string id, OneDriveLinkType linkType = OneDriveLinkType.Read)
        {
            string linkTypeValue;

            switch (linkType)
            {
                case OneDriveLinkType.Embed:
                    linkTypeValue = "embed";
                    break;
                default:
                case OneDriveLinkType.Read:
                    linkTypeValue = "view";
                    break;
                case OneDriveLinkType.Edit:
                    linkTypeValue = "edit";
                    break;
            }

            string json = JsonConvert.SerializeObject(new
            {
                type = linkTypeValue,
                scope = "anonymous"
            });

            string response = SendRequest(HttpMethod.POST, $"https://graph.microsoft.com/v1.0/me/drive/items/{id}/createLink", json, RequestHelpers.ContentTypeJSON,
                headers: GetAuthHeaders());

            OneDrivePermission permissionInfo = JsonConvert.DeserializeObject<OneDrivePermission>(response);

            if (permissionInfo != null && permissionInfo.link != null)
            {
                return permissionInfo.link.webUrl;
            }

            return null;
        }

        public OneDriveFileList GetPathInfo(string id)
        {
            if (!CheckAuthorization()) return null;

            string folderPath = GetFolderUrl(id);

            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("select", "id,name");
            args.Add("filter", "folder ne null");

            string response = SendRequest(HttpMethod.GET, $"https://graph.microsoft.com/v1.0/{folderPath}/children", args, GetAuthHeaders());

            if (response != null)
            {
                OneDriveFileList pathInfo = JsonConvert.DeserializeObject<OneDriveFileList>(response);
                return pathInfo;
            }

            return null;
        }
    }

    public class OneDriveFileInfo
    {
        public string id { get; set; }
        public string name { get; set; }
        public string webUrl { get; set; }
    }

    public class OneDrivePermission
    {
        public OneDriveShareableLink link { get; set; }
    }

    public class OneDriveShareableLink
    {
        public string webUrl { get; set; }
        public string webHtml { get; set; }
    }

    public class OneDriveFileList
    {
        public OneDriveFileInfo[] value { get; set; }
    }

    public class OneDriveUploadSession
    {
        public string uploadUrl { get; set; }
        public string[] nextExpectedRanges { get; set; }
    }

    public enum OneDriveLinkType
    {
        [Description("An embedded link, which is an HTML code snippet that you can insert into a webpage to provide an interactive view of the corresponding file.")]
        Embed,
        [Description("A read-only link, which is a link to a read-only version of the folder or file.")]
        Read,
        [Description("A read-write link, which is a link to a read-write version of the folder or file.")]
        Edit
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OwnCloud.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/OwnCloud.cs

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
using Newtonsoft.Json.Linq;
using ShareX.HelpersLib;
using ShareX.UploadersLib.Properties;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class OwnCloudFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.OwnCloud;

        public override Image ServiceImage => Resources.OwnCloud;

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.OwnCloudHost) && !string.IsNullOrEmpty(config.OwnCloudUsername) && !string.IsNullOrEmpty(config.OwnCloudPassword);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new OwnCloud(config.OwnCloudHost, config.OwnCloudUsername, config.OwnCloudPassword)
            {
                Path = config.OwnCloudPath,
                CreateShare = config.OwnCloudCreateShare,
                DirectLink = config.OwnCloudDirectLink,
                PreviewLink = config.OwnCloudUsePreviewLinks,
                AppendFileNameToURL = config.OwnCloudAppendFileNameToURL,
                IsCompatibility81 = config.OwnCloud81Compatibility,
                AutoExpireTime = config.OwnCloudExpiryTime,
                AutoExpire = config.OwnCloudAutoExpire
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpOwnCloud;
    }

    public sealed class OwnCloud : FileUploader
    {
        public string Host { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Path { get; set; }
        public int AutoExpireTime { get; set; }
        public bool CreateShare { get; set; }
        public bool AppendFileNameToURL { get; set; }
        public bool DirectLink { get; set; }
        public bool PreviewLink { get; set; }
        public bool IsCompatibility81 { get; set; }
        public bool AutoExpire { get; set; }

        public OwnCloud(string host, string username, string password)
        {
            Host = host;
            Username = username;
            Password = password;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            if (string.IsNullOrEmpty(Host))
            {
                throw new Exception("ownCloud Host is empty.");
            }

            if (string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password))
            {
                throw new Exception("ownCloud Username or Password is empty.");
            }

            if (string.IsNullOrEmpty(Path))
            {
                Path = "/";
            }

            // Original, unencoded path. Necessary for shared files
            string path = URLHelpers.CombineURL(Path, fileName);
            // Encoded path, necessary when sent in the URL
            string encodedPath = URLHelpers.CombineURL(Path, URLHelpers.URLEncode(fileName));

            string url = URLHelpers.CombineURL(Host, "remote.php/webdav", encodedPath);
            url = URLHelpers.FixPrefix(url);

            NameValueCollection headers = RequestHelpers.CreateAuthenticationHeader(Username, Password);
            headers["OCS-APIREQUEST"] = "true";

            string response = SendRequest(HttpMethod.PUT, url, stream, MimeTypes.GetMimeTypeFromFileName(fileName), null, headers);

            UploadResult result = new UploadResult(response);

            if (!IsError)
            {
                if (CreateShare)
                {
                    AllowReportProgress = false;
                    result.URL = ShareFile(path, fileName);
                }
                else
                {
                    result.IsURLExpected = false;
                }
            }

            return result;
        }

        // https://doc.owncloud.org/server/10.0/developer_manual/core/ocs-share-api.html#create-a-new-share
        public string ShareFile(string path, string fileName)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("path", path); // path to the file/folder which should be shared
            args.Add("shareType", "3"); // ‘0’ = user; ‘1’ = group; ‘3’ = public link
            // args.Add("shareWith", ""); // user / group id with which the file should be shared
            // args.Add("publicUpload", "false"); // allow public upload to a public shared folder (true/false)
            // args.Add("password", ""); // password to protect public link Share with
            args.Add("permissions", "1"); // 1 = read; 2 = update; 4 = create; 8 = delete; 16 = share; 31 = all (default: 31, for public shares: 1)

            if (AutoExpire)
            {
                if (AutoExpireTime == 0)
                {
                    throw new Exception("ownCloud Auto Epxire Time is not valid.");
                }
                else
                {
                    try
                    {
                        DateTime expireTime = DateTime.UtcNow.AddDays(AutoExpireTime);
                        args.Add("expireDate", $"{expireTime.Year}-{expireTime.Month}-{expireTime.Day}");
                    }
                    catch
                    {
                        throw new Exception("ownCloud Auto Expire time is invalid");
                    }
                }
            }

            string url = URLHelpers.CombineURL(Host, "ocs/v1.php/apps/files_sharing/api/v1/shares?format=json");
            url = URLHelpers.FixPrefix(url);

            NameValueCollection headers = RequestHelpers.CreateAuthenticationHeader(Username, Password);
            headers["OCS-APIREQUEST"] = "true";

            string response = SendRequestMultiPart(url, args, headers);

            if (!string.IsNullOrEmpty(response))
            {
                OwnCloudShareResponse result = JsonConvert.DeserializeObject<OwnCloudShareResponse>(response);

                if (result != null && result.ocs != null && result.ocs.meta != null)
                {
                    if (result.ocs.data != null && result.ocs.meta.statuscode == 100)
                    {
                        OwnCloudShareResponseData data = ((JObject)result.ocs.data).ToObject<OwnCloudShareResponseData>();
                        string link = data.url;

                        if (PreviewLink && FileHelpers.IsImageFile(path))
                        {
                            link += "/preview";
                        }
                        else if (DirectLink)
                        {
                            if (IsCompatibility81)
                            {
                                link += "/download";
                            }
                            else
                            {
                                link += "&download";
                            }

                            if (AppendFileNameToURL)
                            {
                                link = URLHelpers.CombineURL(link, URLHelpers.URLEncode(fileName));
                            }
                        }

                        return link;
                    }
                    else
                    {
                        Errors.Add(string.Format("Status: {0}\r\nStatus code: {1}\r\nMessage: {2}", result.ocs.meta.status, result.ocs.meta.statuscode, result.ocs.meta.message));
                    }
                }
            }

            return null;
        }

        public class OwnCloudShareResponse
        {
            public OwnCloudShareResponseOcs ocs { get; set; }
        }

        public class OwnCloudShareResponseOcs
        {
            public OwnCloudShareResponseMeta meta { get; set; }
            public object data { get; set; }
        }

        public class OwnCloudShareResponseMeta
        {
            public string status { get; set; }
            public int statuscode { get; set; }
            public string message { get; set; }
        }

        public class OwnCloudShareResponseData
        {
            public int id { get; set; }
            public string url { get; set; }
            public string token { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Plik.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Plik.cs

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
using System.Collections.Specialized;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class PlikFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Plik;

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Plik(config.PlikSettings);
        }

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.PlikSettings.URL) && !string.IsNullOrEmpty(config.PlikSettings.APIKey);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpPlik;

        public override Icon ServiceIcon => Resources.Plik;
    }

    public sealed class Plik : FileUploader
    {
        public PlikSettings Settings { get; private set; }

        public Plik(PlikSettings settings)
        {
            Settings = settings;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            if (string.IsNullOrEmpty(Settings.URL))
            {
                throw new Exception("Plik Host is empty.");
            }
            NameValueCollection requestHeaders = new NameValueCollection();
            requestHeaders["X-PlikToken"] = Settings.APIKey;
            UploadMetadataRequest metaDataReq = new UploadMetadataRequest();
            metaDataReq.Files = new UploadMetadataRequestFile0();
            metaDataReq.Files.File0 = new UploadMetadataRequestFile();
            metaDataReq.Files.File0.FileName = fileName;
            metaDataReq.Files.File0.FileType = MimeTypes.GetMimeTypeFromFileName(fileName);
            metaDataReq.Files.File0.FileSize = Convert.ToInt32(stream.Length);
            metaDataReq.Removable = Settings.Removable;
            metaDataReq.OneShot = Settings.OneShot;
            if (Settings.TTLUnit != 3) // everything except the expire time -1
            {
                metaDataReq.Ttl = Convert.ToInt32(GetMultiplyIndex(2, Settings.TTLUnit) * Settings.TTL * 60);
            }
            else
            {
                metaDataReq.Ttl = -1;
            }
            if (Settings.HasComment)
            {
                metaDataReq.Comment = Settings.Comment;
            }
            if (Settings.IsSecured)
            {
                metaDataReq.Login = Settings.Login;
                metaDataReq.Password = Settings.Password;
            }
            string metaDataResp = SendRequest(HttpMethod.POST, Settings.URL + "/upload", JsonConvert.SerializeObject(metaDataReq), headers: requestHeaders);
            UploadMetadataResponse metaData = JsonConvert.DeserializeObject<UploadMetadataResponse>(metaDataResp);
            requestHeaders["x-uploadtoken"] = metaData.uploadToken;
            string url = $"{Settings.URL}/file/{metaData.id}/{metaData.files.First().Value.id}/{fileName}";
            UploadResult FileDatReq = SendRequestFile(url, stream, fileName, "file", headers: requestHeaders);

            return ConvertResult(metaData, FileDatReq);
        }

        private UploadResult ConvertResult(UploadMetadataResponse metaData, UploadResult fileDataReq)
        {
            UploadResult result = new UploadResult(fileDataReq.Response);
            //UploadMetadataResponse fileData = JsonConvert.DeserializeObject<UploadMetadataResponse>(fileDataReq.Response);
            UploadMetadataResponseFile actFile = metaData.files.First().Value;
            result.URL = $"{Settings.URL}/file/{metaData.id}/{actFile.id}/{URLHelpers.URLEncode(actFile.fileName)}";
            return result;
        }

        internal static void CalculateTTLValue(NumericUpDown nudTTL, int newUnit, int oldUnit)
        {
            if (newUnit != 3)
            {
                if (nudTTL.Value == -1)
                {
                    nudTTL.SetValue(1);
                }

                nudTTL.SetValue(nudTTL.Value * GetMultiplyIndex(newUnit, oldUnit));
                nudTTL.ReadOnly = false;
            }
            else
            {
                nudTTL.SetValue(-1);
                nudTTL.ReadOnly = true;
            }
        }

        internal static decimal GetMultiplyIndex(int newUnit, int oldUnit)
        {
            decimal multiplyValue = 1m;
            switch (newUnit)
            {
                case 0: // days
                    switch (oldUnit)
                    {
                        case 1: // hours
                            multiplyValue = 1m / 24m;
                            break;
                        case 2: // minutes
                            multiplyValue = 1m / 24m / 60m;
                            break;
                    }
                    break;
                case 1: // hours
                    switch (oldUnit)
                    {
                        case 0: // days
                            multiplyValue = 24m;
                            break;
                        case 2: // minutes
                            multiplyValue = 1m / 60m;
                            break;
                    }
                    break;
                case 2: // minutes
                    switch (oldUnit)
                    {
                        case 0: // days
                            multiplyValue = 60m * 24m;
                            break;
                        case 1: // hours
                            multiplyValue = 60m;
                            break;
                    }
                    break;
            }
            return multiplyValue;
        }
    }

    public class UploadMetadataRequestFile
    {
        [JsonProperty("fileName")]
        public string FileName { get; set; }
        [JsonProperty("fileType")]
        public string FileType { get; set; }
        [JsonProperty("fileSize")]
        public int FileSize { get; set; }
    }

    public class UploadMetadataRequestFile0
    {
        [JsonProperty("0")]
        public UploadMetadataRequestFile File0 { get; set; }
    }

    public class UploadMetadataRequest
    {
        [JsonProperty("ttl")]
        public int Ttl { get; set; }
        [JsonProperty("removable")]
        public bool Removable { get; set; }
        [JsonProperty("oneShot")]
        public bool OneShot { get; set; }
        [JsonProperty("comments")]
        public string Comment { get; set; }
        [JsonProperty("login")]
        public string Login { get; set; }
        [JsonProperty("password")]
        public string Password { get; set; }
        [JsonProperty("files")]
        public UploadMetadataRequestFile0 Files { get; set; }
    }

    public class UploadMetadataResponseFile
    {
        public string id { get; set; }
        public string fileName { get; set; }
        public string fileMd5 { get; set; }
        public string status { get; set; }
        public string fileType { get; set; }
        public int fileUploadDate { get; set; }
        public int fileSize { get; set; }
        public string reference { get; set; }
    }

    public class UploadMetadataResponse
    {
        public string id { get; set; }
        public int uploadDate { get; set; }
        public int ttl { get; set; }
        public string shortUrl { get; set; }
        public string downloadDomain { get; set; }
        public string comments { get; set; }
        public Dictionary<string, UploadMetadataResponseFile> files { get; set; }
        public string uploadToken { get; set; }
        public bool admin { get; set; }
        public bool stream { get; set; }
        public bool oneShot { get; set; }
        public bool removable { get; set; }
        public bool protectedByPassword { get; set; }
        public bool protectedByYubikey { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PlikSettings.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/PlikSettings.cs

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

namespace ShareX.UploadersLib.FileUploaders
{
    public class PlikSettings
    {
        public string URL { get; set; } = "";
        [JsonEncrypt]
        public string APIKey { get; set; } = "";
        public bool IsSecured { get; set; } = false;
        public string Login { get; set; } = "";
        [JsonEncrypt]
        public string Password { get; set; } = "";
        public bool Removable { get; set; } = false;
        public bool OneShot { get; set; } = false;
        public int TTLUnit { get; set; } = 2;
        public decimal TTL { get; set; } = 30;
        public bool HasComment { get; set; } = false;
        public string Comment { get; set; } = "";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Pomf.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Pomf.cs

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
using System.IO;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class PomfFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Pomf;

        public override Icon ServiceIcon => Resources.Pomf;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.PomfUploader != null && !string.IsNullOrEmpty(config.PomfUploader.UploadURL);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Pomf(config.PomfUploader);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpPomf;
    }

    public class Pomf : FileUploader
    {
        public PomfUploader Uploader { get; private set; }

        public Pomf(PomfUploader uploader)
        {
            Uploader = uploader;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            UploadResult result = SendRequestFile(Uploader.UploadURL, stream, fileName, "files[]");

            if (result.IsSuccess)
            {
                PomfResponse response = JsonConvert.DeserializeObject<PomfResponse>(result.Response);

                if (response.success && response.files != null && response.files.Count > 0)
                {
                    string url = response.files[0].url;

                    if (!URLHelpers.HasPrefix(url) && !string.IsNullOrEmpty(Uploader.ResultURL))
                    {
                        string resultURL = URLHelpers.FixPrefix(Uploader.ResultURL);
                        url = URLHelpers.CombineURL(resultURL, url);
                    }

                    result.URL = url;
                }
            }

            return result;
        }

        private class PomfResponse
        {
            public bool success { get; set; }
            public object error { get; set; }
            public List<PomfFile> files { get; set; }
        }

        private class PomfFile
        {
            public string hash { get; set; }
            public string name { get; set; }
            public string url { get; set; }
            public string size { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PomfUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/PomfUploader.cs

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

namespace ShareX.UploadersLib.FileUploaders
{
    public class PomfUploader
    {
        public string UploadURL { get; set; }
        public string ResultURL { get; set; }

        public PomfUploader()
        {
        }

        public PomfUploader(string uploadURL, string resultURL = null)
        {
            UploadURL = uploadURL;
            ResultURL = resultURL;
        }

        public override string ToString()
        {
            return URLHelpers.GetHostName(UploadURL);
        }
    }
}
```

--------------------------------------------------------------------------------

````
