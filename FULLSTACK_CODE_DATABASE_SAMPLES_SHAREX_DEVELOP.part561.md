---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 561
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 561 of 650)

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

---[FILE: Pushbullet.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Pushbullet.cs

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
    public class PushbulletFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Pushbullet;

        public override Icon ServiceIcon => Resources.Pushbullet;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.PushbulletSettings != null && !string.IsNullOrEmpty(config.PushbulletSettings.UserAPIKey) &&
                config.PushbulletSettings.DeviceList != null && config.PushbulletSettings.DeviceList.IsValidIndex(config.PushbulletSettings.SelectedDevice);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Pushbullet(config.PushbulletSettings);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpPushbullet;
    }

    public sealed class Pushbullet : FileUploader
    {
        public PushbulletSettings Config { get; private set; }

        public Pushbullet(PushbulletSettings config)
        {
            Config = config;
        }

        private const string
            wwwPushesURL = "https://www.pushbullet.com/pushes",
            apiURL = "https://api.pushbullet.com/v2",
            apiGetDevicesURL = apiURL + "/devices",
            apiSendPushURL = apiURL + "/pushes",
            apiRequestFileUploadURL = apiURL + "/upload-request";

        public UploadResult PushFile(Stream stream, string fileName)
        {
            NameValueCollection headers = RequestHelpers.CreateAuthenticationHeader(Config.UserAPIKey, "");

            Dictionary<string, string> pushArgs, upArgs = new Dictionary<string, string>();

            upArgs.Add("file_name", fileName);

            string uploadRequest = SendRequestMultiPart(apiRequestFileUploadURL, upArgs, headers);

            if (uploadRequest == null) return null;

            PushbulletResponseFileUpload fileInfo = JsonConvert.DeserializeObject<PushbulletResponseFileUpload>(uploadRequest);

            if (fileInfo == null) return null;

            pushArgs = upArgs;

            upArgs = new Dictionary<string, string>();

            upArgs.Add("awsaccesskeyid", fileInfo.data.awsaccesskeyid);
            upArgs.Add("acl", fileInfo.data.acl);
            upArgs.Add("key", fileInfo.data.key);
            upArgs.Add("signature", fileInfo.data.signature);
            upArgs.Add("policy", fileInfo.data.policy);
            upArgs.Add("content-type", fileInfo.data.content_type);

            UploadResult uploadResult = SendRequestFile(fileInfo.upload_url, stream, fileName, "file", upArgs);

            if (uploadResult == null) return null;

            pushArgs.Add("device_iden", Config.CurrentDevice.Key);
            pushArgs.Add("type", "file");
            pushArgs.Add("file_url", fileInfo.file_url);
            pushArgs.Add("body", "Sent via ShareX");
            pushArgs.Add("file_type", fileInfo.file_type);

            string pushResult = SendRequestMultiPart(apiSendPushURL, pushArgs, headers);

            if (pushResult == null) return null;

            PushbulletResponsePush push = JsonConvert.DeserializeObject<PushbulletResponsePush>(pushResult);

            if (push != null)
                uploadResult.URL = wwwPushesURL + "?push_iden=" + push.iden;

            return uploadResult;
        }

        private string Push(string pushType, string valueType, string value, string title)
        {
            NameValueCollection headers = RequestHelpers.CreateAuthenticationHeader(Config.UserAPIKey, "");

            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("device_iden", Config.CurrentDevice.Key);
            args.Add("type", pushType);
            args.Add("title", title);
            args.Add(valueType, value);

            if (valueType != "body")
            {
                if (pushType == "link")
                    args.Add("body", value);
                else
                    args.Add("body", "Sent via ShareX");
            }

            string response = SendRequestMultiPart(apiSendPushURL, args, headers);

            if (response == null) return null;

            PushbulletResponsePush push = JsonConvert.DeserializeObject<PushbulletResponsePush>(response);

            if (push != null)
                return wwwPushesURL + "?push_iden=" + push.iden;

            return null;
        }

        public string PushNote(string note, string title)
        {
            return Push("note", "body", note, title);
        }

        public string PushLink(string link, string title)
        {
            return Push("link", "url", link, title);
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            if (string.IsNullOrEmpty(Config.UserAPIKey)) throw new Exception("Missing API key.");
            if (Config.CurrentDevice == null) throw new Exception("No device set to push to.");
            if (string.IsNullOrEmpty(Config.CurrentDevice.Key)) throw new Exception("Missing device key.");

            return PushFile(stream, fileName);
        }

        public List<PushbulletDevice> GetDeviceList()
        {
            NameValueCollection headers = RequestHelpers.CreateAuthenticationHeader(Config.UserAPIKey, "");

            string response = SendRequest(HttpMethod.GET, apiGetDevicesURL, headers: headers);

            PushbulletResponseDevices devicesResponse = JsonConvert.DeserializeObject<PushbulletResponseDevices>(response);

            if (devicesResponse != null && devicesResponse.devices != null)
            {
                return devicesResponse.devices.Where(x => !string.IsNullOrEmpty(x.nickname)).Select(x1 => new PushbulletDevice { Key = x1.iden, Name = x1.nickname }).ToList();
            }

            return new List<PushbulletDevice>();
        }

        private class PushbulletResponseDevices
        {
            public List<PushbulletResponseDevice> devices { get; set; }
        }

        private class PushbulletResponseDevice
        {
            public string iden { get; set; }
            public string nickname { get; set; }
        }

        private class PushbulletResponsePush
        {
            public string iden { get; set; }
            public string device_iden { get; set; }
            public PushbulletResponsePushData data { get; set; }
            public long created { get; set; }
        }

        private class PushbulletResponsePushData
        {
            public string type { get; set; }
            public string title { get; set; }
            public string body { get; set; }
        }

        private class PushbulletResponseFileUpload
        {
            public string file_type { get; set; }
            public string file_name { get; set; }
            public string file_url { get; set; }
            public string upload_url { get; set; }
            public PushbulletResponseFileUploadData data { get; set; }
        }

        private class PushbulletResponseFileUploadData
        {
            public string awsaccesskeyid { get; set; }
            public string acl { get; set; }
            public string key { get; set; }
            public string signature { get; set; }
            public string policy { get; set; }
            [JsonProperty("content-type")]
            public string content_type { get; set; }
        }
    }

    public class PushbulletDevice
    {
        public string Key { get; set; }
        public string Name { get; set; }
    }

    public class PushbulletSettings
    {
        [JsonEncrypt]
        public string UserAPIKey { get; set; } = "";
        public List<PushbulletDevice> DeviceList { get; set; } = new List<PushbulletDevice>();
        public int SelectedDevice { get; set; } = 0;

        public PushbulletDevice CurrentDevice
        {
            get
            {
                if (DeviceList.IsValidIndex(SelectedDevice))
                {
                    return DeviceList[SelectedDevice];
                }

                return null;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Puush.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Puush.cs

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
using System.IO;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class PuushFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Puush;

        public override Icon ServiceIcon => Resources.puush;

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.PuushAPIKey);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Puush(config.PuushAPIKey);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpPuush;
    }

    public class Puush : FileUploader
    {
        public const string PuushURL = "https://puush.me";
        public const string PuushRegisterURL = PuushURL + "/register";
        public const string PuushResetPasswordURL = PuushURL + "/reset_password";

        private const string PuushAPIURL = PuushURL + "/api";
        private const string PuushAPIAuthenticationURL = PuushAPIURL + "/auth";
        private const string PuushAPIUploadURL = PuushAPIURL + "/up";
        private const string PuushAPIDeletionURL = PuushAPIURL + "/del";
        private const string PuushAPIHistoryURL = PuushAPIURL + "/hist";
        private const string PuushAPIThumbnailURL = PuushAPIURL + "/thumb";

        public string APIKey { get; set; }

        public Puush()
        {
        }

        public Puush(string apiKey)
        {
            APIKey = apiKey;
        }

        public string Login(string email, string password)
        {
            Dictionary<string, string> arguments = new Dictionary<string, string>();
            arguments.Add("e", email);
            arguments.Add("p", password);
            arguments.Add("z", ShareXResources.UserAgent);

            // Successful: status,apikey,expire,usage
            // Failed: status
            string response = SendRequestMultiPart(PuushAPIAuthenticationURL, arguments);

            if (!string.IsNullOrEmpty(response))
            {
                string[] values = response.Split(',');

                if (values.Length > 1 && int.TryParse(values[0], out int status) && status >= 0)
                {
                    return values[1];
                }
            }

            return null;
        }

        public bool DeleteFile(string id)
        {
            Dictionary<string, string> arguments = new Dictionary<string, string>();
            arguments.Add("k", APIKey);
            arguments.Add("i", id);
            arguments.Add("z", ShareXResources.UserAgent);

            // Successful: status\nlist of history items
            // Failed: status
            string response = SendRequestMultiPart(PuushAPIDeletionURL, arguments);

            if (!string.IsNullOrEmpty(response))
            {
                string[] lines = response.Lines();

                if (lines.Length > 0)
                {
                    return int.TryParse(lines[0], out int status) && status >= 0;
                }
            }

            return false;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            Dictionary<string, string> arguments = new Dictionary<string, string>();
            arguments.Add("k", APIKey);
            arguments.Add("z", ShareXResources.UserAgent);

            // Successful: status,url,id,usage
            // Failed: status
            UploadResult result = SendRequestFile(PuushAPIUploadURL, stream, fileName, "f", arguments);

            if (result.IsSuccess)
            {
                string[] values = result.Response.Split(',');

                if (values.Length > 0)
                {
                    if (!int.TryParse(values[0], out int status))
                    {
                        status = -2;
                    }

                    if (status < 0)
                    {
                        switch (status)
                        {
                            case -1:
                                Errors.Add("Authentication failure.");
                                break;
                            default:
                            case -2:
                                Errors.Add("Connection error.");
                                break;
                            case -3:
                                Errors.Add("Checksum error.");
                                break;
                            case -4:
                                Errors.Add("Insufficient account storage remaining.");
                                break;
                        }
                    }
                    else if (values.Length > 1)
                    {
                        result.URL = values[1];
                    }
                }
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Seafile.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Seafile.cs

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
using System.Web;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class SeafileFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Seafile;

        public override Image ServiceImage => Resources.Seafile;

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.SeafileAPIURL) && !string.IsNullOrEmpty(config.SeafileAuthToken) && !string.IsNullOrEmpty(config.SeafileRepoID);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Seafile(config.SeafileAPIURL, config.SeafileAuthToken, config.SeafileRepoID)
            {
                Path = config.SeafilePath,
                IsLibraryEncrypted = config.SeafileIsLibraryEncrypted,
                EncryptedLibraryPassword = config.SeafileEncryptedLibraryPassword,
                ShareDaysToExpire = config.SeafileShareDaysToExpire,
                SharePassword = config.SeafileSharePassword,
                CreateShareableURL = config.SeafileCreateShareableURL,
                CreateShareableURLRaw = config.SeafileCreateShareableURLRaw
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpSeafile;
    }

    public sealed class Seafile : FileUploader
    {
        public string APIURL { get; set; }
        public string AuthToken { get; set; }
        public string RepoID { get; set; }
        public string Path { get; set; }
        public bool IsLibraryEncrypted { get; set; }
        public string EncryptedLibraryPassword { get; set; }
        public int ShareDaysToExpire { get; set; }
        public string SharePassword { get; set; }
        public bool CreateShareableURL { get; set; }
        public bool CreateShareableURLRaw { get; set; }

        public Seafile(string apiurl, string authtoken, string repoid)
        {
            APIURL = apiurl;
            AuthToken = authtoken;
            RepoID = repoid;
        }

        #region SeafileAuth

        public string GetAuthToken(string username, string password)
        {
            string url = URLHelpers.FixPrefix(APIURL);
            url = URLHelpers.CombineURL(url, "auth-token/?format=json");

            Dictionary<string, string> args = new Dictionary<string, string>
            {
                { "username", username },
                { "password", password }
            };

            string response = SendRequestMultiPart(url, args);

            if (!string.IsNullOrEmpty(response))
            {
                SeafileAuthResponse AuthResult = JsonConvert.DeserializeObject<SeafileAuthResponse>(response);

                return AuthResult.token;
            }

            return "";
        }

        #endregion SeafileAuth

        #region SeafileChecks

        public bool CheckAPIURL()
        {
            string url = URLHelpers.FixPrefix(APIURL);
            url = URLHelpers.CombineURL(url, "ping/?format=json");

            string response = SendRequest(HttpMethod.GET, url);

            if (!string.IsNullOrEmpty(response))
            {
                if (response == "\"pong\"")
                {
                    return true;
                }
            }

            return false;
        }

        public bool CheckAuthToken()
        {
            string url = URLHelpers.FixPrefix(APIURL);
            url = URLHelpers.CombineURL(url, "auth/ping/?format=json");

            NameValueCollection headers = new NameValueCollection();
            headers.Add("Authorization", "Token " + AuthToken);

            string response = SendRequest(HttpMethod.GET, url, null, headers);

            if (!string.IsNullOrEmpty(response))
            {
                if (response == "\"pong\"")
                {
                    return true;
                }
            }

            return false;
        }

        #endregion SeafileChecks

        #region SeafileAccountInformation

        public SeafileCheckAccInfoResponse GetAccountInfo()
        {
            string url = URLHelpers.FixPrefix(APIURL);
            url = URLHelpers.CombineURL(url, "account/info/?format=json");

            NameValueCollection headers = new NameValueCollection();
            headers.Add("Authorization", "Token " + AuthToken);

            string response = SendRequest(HttpMethod.GET, url, null, headers);

            if (!string.IsNullOrEmpty(response))
            {
                SeafileCheckAccInfoResponse AccInfoResponse = JsonConvert.DeserializeObject<SeafileCheckAccInfoResponse>(response);

                return AccInfoResponse;
            }

            return null;
        }

        #endregion SeafileAccountInformation

        #region SeafileLibraries

        public string GetOrMakeDefaultLibrary(string authtoken = null)
        {
            string url = URLHelpers.FixPrefix(APIURL);
            url = URLHelpers.CombineURL(url, "default-repo/?format=json");

            NameValueCollection headers = new NameValueCollection();
            headers.Add("Authorization", "Token " + (authtoken ?? AuthToken));

            string response = SendRequest(HttpMethod.GET, url, null, headers);

            if (!string.IsNullOrEmpty(response))
            {
                SeafileDefaultLibraryObj JsonResponse = JsonConvert.DeserializeObject<SeafileDefaultLibraryObj>(response);

                return JsonResponse.repo_id;
            }

            return null;
        }

        public List<SeafileLibraryObj> GetLibraries()
        {
            string url = URLHelpers.FixPrefix(APIURL);
            url = URLHelpers.CombineURL(url, "repos/?format=json");

            NameValueCollection headers = new NameValueCollection();
            headers.Add("Authorization", "Token " + AuthToken);

            string response = SendRequest(HttpMethod.GET, url, null, headers);

            if (!string.IsNullOrEmpty(response))
            {
                List<SeafileLibraryObj> JsonResponse = JsonConvert.DeserializeObject<List<SeafileLibraryObj>>(response);

                return JsonResponse;
            }

            return null;
        }

        public bool ValidatePath(string path)
        {
            string url = URLHelpers.FixPrefix(APIURL);
            url = URLHelpers.CombineURL(url, "repos/" + RepoID + "/dir/?p=" + path + "&format=json");

            NameValueCollection headers = new NameValueCollection();
            headers.Add("Authorization", "Token " + AuthToken);

            string response = SendRequest(HttpMethod.GET, url, null, headers);

            if (!string.IsNullOrEmpty(response))
            {
                return true;
            }

            return false;
        }

        #endregion SeafileLibraries

        #region SeafileEncryptedLibrary

        public bool DecryptLibrary(string libraryPassword)
        {
            string url = URLHelpers.FixPrefix(APIURL);
            url = URLHelpers.CombineURL(url, "repos/" + RepoID + "/?format=json");

            NameValueCollection headers = new NameValueCollection();
            headers.Add("Authorization", "Token " + AuthToken);

            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("password", libraryPassword);

            string response = SendRequestMultiPart(url, args, headers);

            if (!string.IsNullOrEmpty(response))
            {
                if (response == "\"success\"")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }

            return false;
        }

        #endregion SeafileEncryptedLibrary

        #region SeafileUpload

        public override UploadResult Upload(Stream stream, string fileName)
        {
            if (string.IsNullOrEmpty(APIURL))
            {
                throw new Exception("Seafile API URL is empty.");
            }

            if (string.IsNullOrEmpty(AuthToken))
            {
                throw new Exception("Seafile Authentication Token is empty.");
            }

            if (string.IsNullOrEmpty(Path))
            {
                Path = "/";
            }
            else
            {
                char pathLast = Path[Path.Length - 1];
                if (pathLast != '/')
                {
                    Path += "/";
                }
            }

            string url = URLHelpers.FixPrefix(APIURL);
            url = URLHelpers.CombineURL(url, "repos/" + RepoID + "/upload-link/?format=json");

            NameValueCollection headers = new NameValueCollection();
            headers.Add("Authorization", "Token " + AuthToken);

            string response = SendRequest(HttpMethod.GET, url, null, headers);

            string responseURL = response.Trim('"');

            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("filename", fileName);
            args.Add("parent_dir", Path);

            UploadResult result = SendRequestFile(responseURL, stream, fileName, "file", args, headers);

            if (!IsError)
            {
                if (CreateShareableURL && !IsLibraryEncrypted)
                {
                    AllowReportProgress = false;
                    result.URL = ShareFile(Path + fileName);

                    if (CreateShareableURLRaw)
                    {
                        UriBuilder uriBuilder = new UriBuilder(result.URL);
                        NameValueCollection query = HttpUtility.ParseQueryString(uriBuilder.Query);
                        query["raw"] = "1";
                        uriBuilder.Query = query.ToString();
                        result.URL = $"{uriBuilder.Scheme}://{uriBuilder.Host}{uriBuilder.Path}{uriBuilder.Query}";
                    }
                }
                else
                {
                    result.IsURLExpected = false;
                }
            }

            return result;
        }

        public string ShareFile(string path)
        {
            string url = URLHelpers.FixPrefix(APIURL);
            url = URLHelpers.CombineURL(url, "repos", RepoID, "file/shared-link/");

            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("p", path);
            args.Add("share_type", "download");
            if (!string.IsNullOrEmpty(SharePassword)) args.Add("password", SharePassword);
            if (ShareDaysToExpire > 0) args.Add("expire", ShareDaysToExpire.ToString());

            NameValueCollection headers = new NameValueCollection();
            headers.Add("Authorization", "Token " + AuthToken);

            SendRequestURLEncoded(HttpMethod.PUT, url, args, headers);
            return LastResponseInfo.Headers["Location"];
        }

        #endregion SeafileUpload
    }

    public class SeafileAuthResponse
    {
        public string token { get; set; }
    }

    public class SeafileCheckAccInfoResponse
    {
        public long usage { get; set; }
        public long total { get; set; }
        public string email { get; set; }
    }

    public class SeafileLibraryObj
    {
        public string permission { get; set; }
        public bool encrypted { get; set; }
        public long mtime { get; set; }
        public string owner { get; set; }
        public string id { get; set; }
        public long size { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        [JsonProperty("virtual")]
        public string _virtual { get; set; }
        public string desc { get; set; }
        public string root { get; set; }
    }

    public class SeafileDefaultLibraryObj
    {
        public string repo_id { get; set; }
        public bool exists { get; set; }
    }
}
```

--------------------------------------------------------------------------------

````
