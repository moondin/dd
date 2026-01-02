---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 556
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 556 of 650)

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

---[FILE: Copy.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Copy.cs

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
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;

namespace ShareX.UploadersLib.FileUploaders
{
    public sealed class Copy : FileUploader, IOAuth
    {
        public OAuthInfo AuthInfo { get; set; }
        public CopyAccountInfo AccountInfo { get; set; }
        public string UploadPath { get; set; }
        public CopyURLType URLType { get; set; }

        private const string APIVersion = "1";

        private const string URLAPI = "https://api.copy.com/rest";

        private const string URLAccountInfo = URLAPI + "/user";
        private const string URLFiles = URLAPI + "/files";
        private const string URLMetaData = URLAPI + "/meta/";
        private const string URLLinks = URLAPI + "/links";

        private const string URLRequestToken = "https://api.copy.com/oauth/request";
        private const string URLAuthorize = "https://www.copy.com/applications/authorize";
        private const string URLAccessToken = "https://api.copy.com/oauth/access";

        private readonly NameValueCollection APIHeaders = new NameValueCollection { { "X-Api-Version", APIVersion } };

        public Copy(OAuthInfo oauth)
        {
            AuthInfo = oauth;
        }

        public Copy(OAuthInfo oauth, CopyAccountInfo accountInfo) : this(oauth)
        {
            AccountInfo = accountInfo;
        }

        // https://developers.copy.com/documentation#authentication/oauth-handshake
        // https://developers.copy.com/console
        public string GetAuthorizationURL()
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("oauth_callback", Links.Callback);

            return GetAuthorizationURL(URLRequestToken, URLAuthorize, AuthInfo, args);
        }

        public bool GetAccessToken(string verificationCode = null)
        {
            AuthInfo.AuthVerifier = verificationCode;
            return GetAccessToken(URLAccessToken, AuthInfo);
        }

        #region Copy accounts

        // https://developers.copy.com/documentation#api-calls/profile
        public CopyAccountInfo GetAccountInfo()
        {
            CopyAccountInfo account = null;

            if (OAuthInfo.CheckOAuth(AuthInfo))
            {
                string query = OAuthManager.GenerateQuery(URLAccountInfo, null, HttpMethod.GET, AuthInfo);

                string response = SendRequest(HttpMethod.GET, query, null, APIHeaders);

                if (!string.IsNullOrEmpty(response))
                {
                    account = JsonConvert.DeserializeObject<CopyAccountInfo>(response);

                    if (account != null)
                    {
                        AccountInfo = account;
                    }
                }
            }

            return account;
        }

        #endregion Copy accounts

        #region Files and metadata

        // https://developers.copy.com/documentation#api-calls/filesystem - Download Raw File Conents
        // GET https://api.copy.com/rest/files/PATH/TO/FILE
        public bool DownloadFile(string path, Stream downloadStream)
        {
            if (!string.IsNullOrEmpty(path) && OAuthInfo.CheckOAuth(AuthInfo))
            {
                string url = URLHelpers.CombineURL(URLFiles, URLHelpers.URLEncode(path, true));
                string query = OAuthManager.GenerateQuery(url, null, HttpMethod.GET, AuthInfo);
                return SendRequestDownload(HttpMethod.GET, query, downloadStream);
            }

            return false;
        }

        // https://developers.copy.com/documentation#api-calls/filesystem - Create File or Directory
        // POST https://api.copy.com/rest/files/PATH/TO/FILE?overwrite=true
        public UploadResult UploadFile(Stream stream, string path, string fileName)
        {
            if (!OAuthInfo.CheckOAuth(AuthInfo))
            {
                Errors.Add("Copy login is required.");
                return null;
            }

            string url = URLHelpers.CombineURL(URLFiles, URLHelpers.URLEncode(path, true));

            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("overwrite", "true");

            string query = OAuthManager.GenerateQuery(url, args, HttpMethod.POST, AuthInfo);

            // There's a 1GB and 5 hour(max time for a single upload) limit to all uploads through the API.
            UploadResult result = SendRequestFile(query, stream, fileName, "file", headers: APIHeaders);

            if (result.IsSuccess)
            {
                CopyUploadInfo content = JsonConvert.DeserializeObject<CopyUploadInfo>(result.Response);

                if (content != null && content.objects != null && content.objects.Length > 0)
                {
                    AllowReportProgress = false;
                    result.URL = CreatePublicURL(content.objects[0].path, URLType);
                }
            }

            return result;
        }

        // https://developers.copy.com/documentation#api-calls/filesystem - Read Root Directory
        // GET https://api.copy.com/rest/meta/copy
        public CopyContentInfo GetMetadata(string path)
        {
            CopyContentInfo contentInfo = null;

            if (OAuthInfo.CheckOAuth(AuthInfo))
            {
                string url = URLHelpers.CombineURL(URLMetaData, URLHelpers.URLEncode(path, true));

                string query = OAuthManager.GenerateQuery(url, null, HttpMethod.GET, AuthInfo);

                string response = SendRequest(HttpMethod.GET, query);

                if (!string.IsNullOrEmpty(response))
                {
                    contentInfo = JsonConvert.DeserializeObject<CopyContentInfo>(response);
                }
            }

            return contentInfo;
        }

        #endregion Files and metadata

        public override UploadResult Upload(Stream stream, string fileName)
        {
            return UploadFile(stream, UploadPath, fileName);
        }

        public string GetLinkURL(CopyLinksInfo link, string path, CopyURLType urlType = CopyURLType.Default)
        {
            string fileName = URLHelpers.URLEncode(URLHelpers.GetFileName(path));

            switch (urlType)
            {
                default:
                case CopyURLType.Default:
                    return string.Format("https://www.copy.com/s/{0}/{1}", link.id, fileName);
                case CopyURLType.Shortened:
                    return string.Format("https://copy.com/{0}", link.id);
                case CopyURLType.Direct:
                    return string.Format("https://copy.com/{0}/{1}", link.id, fileName);
            }
        }

        public string CreatePublicURL(string path, CopyURLType urlType = CopyURLType.Default)
        {
            path = path.Trim('/');

            string url = URLHelpers.CombineURL(URLLinks, URLHelpers.URLEncode(path, true));

            string query = OAuthManager.GenerateQuery(url, null, HttpMethod.POST, AuthInfo);

            CopyLinkRequest publicLink = new CopyLinkRequest();
            publicLink.@public = true;
            publicLink.name = "ShareX";
            publicLink.paths = new string[] { path };

            string content = JsonConvert.SerializeObject(publicLink);

            string response = SendRequest(HttpMethod.POST, query, content, headers: APIHeaders);

            if (!string.IsNullOrEmpty(response))
            {
                CopyLinksInfo link = JsonConvert.DeserializeObject<CopyLinksInfo>(response);

                return GetLinkURL(link, path, urlType);
            }

            return "";
        }

        public string GetPublicURL(string path, CopyURLType urlType = CopyURLType.Default)
        {
            path = path.Trim('/');

            CopyContentInfo fileInfo = GetMetadata(path);
            foreach (CopyLinksInfo link in fileInfo.links)
            {
                if (!link.expired && link.@public)
                {
                    return GetLinkURL(link, path, urlType);
                }
            }

            return "";
        }

        public static string TidyUploadPath(string uploadPath)
        {
            if (!string.IsNullOrEmpty(uploadPath))
            {
                return uploadPath.Trim().Replace('\\', '/').Trim('/') + "/";
            }

            return "";
        }
    }

    public enum CopyURLType
    {
        Default,
        Shortened,
        Direct
    }

    public class CopyAccountInfo
    {
        public long id { get; set; } // The user's unique Copy ID.
        public string first_name { get; set; } // The user's first name.
        public string last_name { get; set; } // The user's last name.
        public CopyStorageInfo storage { get; set; }
        public string email { get; set; }
    }

    public class CopyStorageInfo
    {
        public long used { get; set; } // The user's used quota outside of shared folders (bytes).
        public long quota { get; set; } // The user's total quota allocation (bytes).
        public long saved { get; set; } // The user's saved quota through shared folders (bytes).
    }

    public class CopyLinkRequest
    {
        public bool @public { get; set; }
        public string name { get; set; }
        public string[] paths { get; set; }
    }

    public class CopyLinksInfo
    {
        public string id { get; set; }
        public string name { get; set; }
        public bool @public { get; set; }
        public bool expires { get; set; }
        public bool expired { get; set; }
        public string url { get; set; }
        public string url_short { get; set; }
        public string creator_id { get; set; }
        public string company_id { get; set; }
        public bool confirmation_required { get; set; }
        public string status { get; set; }
        public string permissions { get; set; }
    }

    public class CopyContentInfo // https://api.copy.com/rest/meta also works on 'rest/files'
    {
        public string id { get; set; } // Internal copy name
        public string path { get; set; } // file path
        public string name { get; set; } // Human readable (Filesystem) folder name
        public string type { get; set; } // "inbox", "root", "copy", "dir", "file"?
        public bool stub { get; set; } // 'The stub attribute you see on all of the nodes represents if the specified node is incomplete, that is, if the children have not all been delivered to you. Basically, they will always be a stub, unless you are looking at that item directly.'
        public long? size { get; set; } // Filesizes (size attributes) are measured in bytes. If an item displayed in the filesystem is a directory or an otherwise special location which doesn't represent a file, the size attribute will be null.
        public long date_last_synced { get; set; }
        public bool @public { get; set; } // is available to public; isnt everything private but shared in copy???
        public string url { get; set; } // web access url (private)
        public long revision_id { get; set; } // Revision of content
        public CopyLinksInfo[] links { get; set; } // links array
        public CopyContentInfo[] children { get; set; } // Children
    }

    public class CopyUploadInfo
    {
        public CopyContentInfo[] objects { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomFileUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/CustomFileUploader.cs

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
using System;
using System.Drawing;
using System.IO;

namespace ShareX.UploadersLib.FileUploaders
{
    public class CustomFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.CustomFileUploader;

        public override Image ServiceImage => Resources.globe_network;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.CustomUploadersList != null && config.CustomUploadersList.IsValidIndex(config.CustomFileUploaderSelected);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            int index;

            if (taskInfo.OverrideCustomUploader)
            {
                index = taskInfo.CustomUploaderIndex.BetweenOrDefault(0, config.CustomUploadersList.Count - 1);
            }
            else
            {
                index = config.CustomFileUploaderSelected;
            }

            CustomUploaderItem customUploader = config.CustomUploadersList.ReturnIfValidIndex(index);

            if (customUploader != null)
            {
                return new CustomFileUploader(customUploader);
            }

            return null;
        }
    }

    public sealed class CustomFileUploader : FileUploader
    {
        private CustomUploaderItem uploader;

        public CustomFileUploader(CustomUploaderItem customUploaderItem)
        {
            uploader = customUploaderItem;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            UploadResult result = new UploadResult();
            CustomUploaderInput input = new CustomUploaderInput(fileName, "");

            if (uploader.Body == CustomUploaderBody.MultipartFormData)
            {
                result = SendRequestFile(uploader.GetRequestURL(input), stream, fileName, uploader.GetFileFormName(), uploader.GetArguments(input),
                    uploader.GetHeaders(input), null, uploader.RequestMethod);
            }
            else if (uploader.Body == CustomUploaderBody.Binary)
            {
                result.Response = SendRequest(uploader.RequestMethod, uploader.GetRequestURL(input), stream, MimeTypes.GetMimeTypeFromFileName(fileName), null,
                    uploader.GetHeaders(input));
            }
            else
            {
                throw new Exception("Unsupported request format: " + uploader.Body);
            }

            uploader.TryParseResponse(result, LastResponseInfo, Errors, input);

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Dropbox.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Dropbox.cs

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
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class DropboxFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Dropbox;

        public override Icon ServiceIcon => Resources.Dropbox;

        public override bool CheckConfig(UploadersConfig config)
        {
            return OAuth2Info.CheckOAuth(config.DropboxOAuth2Info);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Dropbox(config.DropboxOAuth2Info)
            {
                UploadPath = NameParser.Parse(NameParserType.Default, Dropbox.VerifyPath(config.DropboxUploadPath)),
                AutoCreateShareableLink = config.DropboxAutoCreateShareableLink,
                UseDirectLink = config.DropboxUseDirectLink
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpDropbox;
    }

    public sealed class Dropbox : FileUploader, IOAuth2Basic
    {
        private const string APIVersion = "2";

        private const string URLWEB = "https://www.dropbox.com";
        private const string URLAPIBase = "https://api.dropboxapi.com";
        private const string URLAPI = URLAPIBase + "/" + APIVersion;
        private const string URLContent = "https://content.dropboxapi.com/" + APIVersion;
        private const string URLNotify = "https://notify.dropboxapi.com/" + APIVersion;

        private const string URLOAuth2Authorize = URLWEB + "/oauth2/authorize";
        private const string URLOAuth2Token = URLAPIBase + "/oauth2/token";

        private const string URLGetCurrentAccount = URLAPI + "/users/get_current_account";
        private const string URLDownload = URLContent + "/files/download";
        private const string URLUpload = URLContent + "/files/upload";
        private const string URLGetMetadata = URLAPI + "/files/get_metadata";
        private const string URLCreateSharedLink = URLAPI + "/sharing/create_shared_link_with_settings";
        private const string URLListSharedLinks = URLAPI + "/sharing/list_shared_links";
        private const string URLCopy = URLAPI + "/files/copy";
        private const string URLCreateFolder = URLAPI + "/files/create_folder";
        private const string URLDelete = URLAPI + "/files/delete";
        private const string URLMove = URLAPI + "/files/move";

        private const string URLShareDirect = "https://dl.dropboxusercontent.com/scl/fi/";

        public OAuth2Info AuthInfo { get; set; }
        public string UploadPath { get; set; }
        public bool AutoCreateShareableLink { get; set; }
        public bool UseDirectLink { get; set; }

        public Dropbox(OAuth2Info oauth)
        {
            AuthInfo = oauth;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            return UploadFile(stream, UploadPath, fileName, AutoCreateShareableLink, UseDirectLink);
        }

        public string GetAuthorizationURL()
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("response_type", "code");
            args.Add("client_id", AuthInfo.Client_ID);

            return URLHelpers.CreateQueryString(URLOAuth2Authorize, args);
        }

        public bool GetAccessToken(string code)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("client_id", AuthInfo.Client_ID);
            args.Add("client_secret", AuthInfo.Client_Secret);
            args.Add("grant_type", "authorization_code");
            args.Add("code", code);

            string response = SendRequestMultiPart(URLOAuth2Token, args);

            if (!string.IsNullOrEmpty(response))
            {
                OAuth2Token token = JsonConvert.DeserializeObject<OAuth2Token>(response);

                if (token != null && !string.IsNullOrEmpty(token.access_token))
                {
                    AuthInfo.Token = token;
                    return true;
                }
            }

            return false;
        }

        private NameValueCollection GetAuthHeaders()
        {
            NameValueCollection headers = new NameValueCollection();
            headers.Add("Authorization", "Bearer " + AuthInfo.Token.access_token);
            return headers;
        }

        public static string VerifyPath(string path, string fileName = null)
        {
            if (!string.IsNullOrEmpty(path))
            {
                path = path.Trim().Replace('\\', '/').Trim('/');
                path = URLHelpers.AddSlash(path, SlashType.Prefix);

                if (!string.IsNullOrEmpty(fileName))
                {
                    path = URLHelpers.CombineURL(path, fileName);
                }

                return path;
            }

            if (!string.IsNullOrEmpty(fileName))
            {
                return fileName;
            }

            return "";
        }

        public DropboxAccount GetCurrentAccount()
        {
            if (OAuth2Info.CheckOAuth(AuthInfo))
            {
                string response = SendRequest(HttpMethod.POST, URLGetCurrentAccount, "null", RequestHelpers.ContentTypeJSON, null, GetAuthHeaders());

                if (!string.IsNullOrEmpty(response))
                {
                    return JsonConvert.DeserializeObject<DropboxAccount>(response);
                }
            }

            return null;
        }

        public bool DownloadFile(string path, Stream downloadStream)
        {
            if (!string.IsNullOrEmpty(path) && OAuth2Info.CheckOAuth(AuthInfo))
            {
                string json = JsonConvert.SerializeObject(new
                {
                    path = VerifyPath(path)
                });

                Dictionary<string, string> args = new Dictionary<string, string>();
                args.Add("arg", json);

                return SendRequestDownload(HttpMethod.POST, URLDownload, downloadStream, args, GetAuthHeaders(), null, RequestHelpers.ContentTypeJSON);
            }

            return false;
        }

        public UploadResult UploadFile(Stream stream, string path, string fileName, bool createShareableLink = false, bool useDirectLink = false)
        {
            if (stream.Length > 150000000)
            {
                Errors.Add("There's a 150MB limit to uploads through the API.");
                return null;
            }

            string json = JsonConvert.SerializeObject(new
            {
                path = VerifyPath(path, fileName),
                mode = "overwrite",
                autorename = false,
                mute = true
            });

            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("arg", json);

            string response = SendRequest(HttpMethod.POST, URLUpload, stream, RequestHelpers.ContentTypeOctetStream, args, GetAuthHeaders());

            UploadResult ur = new UploadResult(response);

            if (!string.IsNullOrEmpty(ur.Response))
            {
                DropboxMetadata metadata = JsonConvert.DeserializeObject<DropboxMetadata>(ur.Response);

                if (metadata != null)
                {
                    if (createShareableLink)
                    {
                        AllowReportProgress = false;

                        ur.URL = CreateShareableLink(metadata.path_display, useDirectLink);
                    }
                    else
                    {
                        ur.IsURLExpected = false;
                    }
                }
            }

            return ur;
        }

        public DropboxMetadata GetMetadata(string path)
        {
            DropboxMetadata metadata = null;

            if (path != null && OAuth2Info.CheckOAuth(AuthInfo))
            {
                string json = JsonConvert.SerializeObject(new
                {
                    path = VerifyPath(path),
                    include_media_info = false,
                    include_deleted = false,
                    include_has_explicit_shared_members = false
                });

                string response = SendRequest(HttpMethod.POST, URLGetMetadata, json, RequestHelpers.ContentTypeJSON, null, GetAuthHeaders());

                if (!string.IsNullOrEmpty(response))
                {
                    metadata = JsonConvert.DeserializeObject<DropboxMetadata>(response);
                }
            }

            return metadata;
        }

        public bool IsExists(string path)
        {
            DropboxMetadata metadata = GetMetadata(path);

            return metadata != null && !metadata.tag.Equals("deleted", StringComparison.OrdinalIgnoreCase);
        }

        public string CreateShareableLink(string path, bool directLink)
        {
            if (!string.IsNullOrEmpty(path) && OAuth2Info.CheckOAuth(AuthInfo))
            {
                string json = JsonConvert.SerializeObject(new
                {
                    path = VerifyPath(path),
                    settings = new
                    {
                        requested_visibility = "public" // Anyone who has received the link can access it. No login required.
                    }
                });

                string response = SendRequest(HttpMethod.POST, URLCreateSharedLink, json, RequestHelpers.ContentTypeJSON, null, GetAuthHeaders());

                DropboxLinkMetadata linkMetadata = null;

                if (!string.IsNullOrEmpty(response))
                {
                    linkMetadata = JsonConvert.DeserializeObject<DropboxLinkMetadata>(response);
                }
                else if (IsError && Errors.Errors[Errors.Count - 1].Text.Contains("\"shared_link_already_exists\"")) // Ugly workaround
                {
                    DropboxListSharedLinksResult result = ListSharedLinks(path, true);

                    if (result != null && result.links != null && result.links.Length > 0)
                    {
                        linkMetadata = result.links[0];
                    }
                }

                if (linkMetadata != null)
                {
                    if (directLink)
                    {
                        return GetDirectShareableURL(linkMetadata.url);
                    }
                    else
                    {
                        return linkMetadata.url;
                    }
                }
            }

            return null;
        }

        public DropboxListSharedLinksResult ListSharedLinks(string path, bool directOnly = false)
        {
            DropboxListSharedLinksResult result = null;

            if (path != null && OAuth2Info.CheckOAuth(AuthInfo))
            {
                string json = JsonConvert.SerializeObject(new
                {
                    path = VerifyPath(path),
                    direct_only = directOnly
                });

                string response = SendRequest(HttpMethod.POST, URLListSharedLinks, json, RequestHelpers.ContentTypeJSON, null, GetAuthHeaders());

                if (!string.IsNullOrEmpty(response))
                {
                    result = JsonConvert.DeserializeObject<DropboxListSharedLinksResult>(response);
                }
            }

            return result;
        }

        public DropboxMetadata Copy(string fromPath, string toPath)
        {
            DropboxMetadata metadata = null;

            if (!string.IsNullOrEmpty(fromPath) && !string.IsNullOrEmpty(toPath) && OAuth2Info.CheckOAuth(AuthInfo))
            {
                string json = JsonConvert.SerializeObject(new
                {
                    from_path = VerifyPath(fromPath),
                    to_path = VerifyPath(toPath)
                });

                string response = SendRequest(HttpMethod.POST, URLCopy, json, RequestHelpers.ContentTypeJSON, null, GetAuthHeaders());

                if (!string.IsNullOrEmpty(response))
                {
                    metadata = JsonConvert.DeserializeObject<DropboxMetadata>(response);
                }
            }

            return metadata;
        }

        public DropboxMetadata CreateFolder(string path)
        {
            DropboxMetadata metadata = null;

            if (!string.IsNullOrEmpty(path) && OAuth2Info.CheckOAuth(AuthInfo))
            {
                string json = JsonConvert.SerializeObject(new
                {
                    path = VerifyPath(path)
                });

                string response = SendRequest(HttpMethod.POST, URLCreateFolder, json, RequestHelpers.ContentTypeJSON, null, GetAuthHeaders());

                if (!string.IsNullOrEmpty(response))
                {
                    metadata = JsonConvert.DeserializeObject<DropboxMetadata>(response);
                }
            }

            return metadata;
        }

        public DropboxMetadata Delete(string path)
        {
            DropboxMetadata metadata = null;

            if (!string.IsNullOrEmpty(path) && OAuth2Info.CheckOAuth(AuthInfo))
            {
                string json = JsonConvert.SerializeObject(new
                {
                    path = VerifyPath(path)
                });

                string response = SendRequest(HttpMethod.POST, URLDelete, json, RequestHelpers.ContentTypeJSON, null, GetAuthHeaders());

                if (!string.IsNullOrEmpty(response))
                {
                    metadata = JsonConvert.DeserializeObject<DropboxMetadata>(response);
                }
            }

            return metadata;
        }

        public DropboxMetadata Move(string fromPath, string toPath)
        {
            DropboxMetadata metadata = null;

            if (!string.IsNullOrEmpty(fromPath) && !string.IsNullOrEmpty(toPath) && OAuth2Info.CheckOAuth(AuthInfo))
            {
                string json = JsonConvert.SerializeObject(new
                {
                    from_path = VerifyPath(fromPath),
                    to_path = VerifyPath(toPath)
                });

                string response = SendRequest(HttpMethod.POST, URLMove, json, RequestHelpers.ContentTypeJSON, null, GetAuthHeaders());

                if (!string.IsNullOrEmpty(response))
                {
                    metadata = JsonConvert.DeserializeObject<DropboxMetadata>(response);
                }
            }

            return metadata;
        }

        private static string GetDirectShareableURL(string url)
        {
            string find = "dropbox.com/scl/fi/";
            int index = url.IndexOf(find);

            if (index > -1)
            {
                string path = url.Remove(0, index + find.Length);

                if (!string.IsNullOrEmpty(path))
                {
                    return URLHelpers.CombineURL(URLShareDirect, path);
                }
            }

            return null;
        }
    }

    public class DropboxAccount
    {
        public string account_id { get; set; }
        public DropboxAccountName name { get; set; }
        public string email { get; set; }
        public bool email_verified { get; set; }
        public bool disabled { get; set; }
        public string locale { get; set; }
        public string referral_link { get; set; }
        public bool is_paired { get; set; }
        public DropboxAccountType account_type { get; set; }
        public string profile_photo_url { get; set; }
        public string country { get; set; }
    }

    public class DropboxAccountName
    {
        public string given_name { get; set; }
        public string surname { get; set; }
        public string familiar_name { get; set; }
        public string display_name { get; set; }
    }

    public class DropboxAccountType
    {
        [JsonProperty(".tag")]
        public string tag { get; set; }
    }

    public class DropboxMetadata
    {
        [JsonProperty(".tag")]
        public string tag { get; set; }
        public string name { get; set; }
        public string id { get; set; }
        public string client_modified { get; set; }
        public string server_modified { get; set; }
        public string rev { get; set; }
        public int size { get; set; }
        public string path_lower { get; set; }
        public string path_display { get; set; }
        public DropboxMetadataSharingInfo sharing_info { get; set; }
        public List<DropboxMetadataPropertyGroup> property_groups { get; set; }
        public bool has_explicit_shared_members { get; set; }
    }

    public class DropboxMetadataSharingInfo
    {
        public bool read_only { get; set; }
        public string parent_shared_folder_id { get; set; }
        public string modified_by { get; set; }
    }

    public class DropboxMetadataPropertyGroup
    {
        public string template_id { get; set; }
        public List<DropboxMetadataPropertyGroupField> fields { get; set; }
    }

    public class DropboxMetadataPropertyGroupField
    {
        public string name { get; set; }
        public string value { get; set; }
    }

    public class DropboxLinkMetadata
    {
        [JsonProperty(".tag")]
        public string tag { get; set; }
        public string url { get; set; }
        public string name { get; set; }
        public DropboxLinkMetadataPermissions link_permissions { get; set; }
        public string client_modified { get; set; }
        public string server_modified { get; set; }
        public string rev { get; set; }
        public int size { get; set; }
        public string id { get; set; }
        public string path_lower { get; set; }
        public DropboxLinkMetadataTeamMemberInfo team_member_info { get; set; }
    }

    public class DropboxLinkMetadataPermissions
    {
        public bool can_revoke { get; set; }
        public DropboxLinkMetadataResolvedVisibility resolved_visibility { get; set; }
        public DropboxLinkMetadataRevokeFailureReason revoke_failure_reason { get; set; }
    }

    public class DropboxLinkMetadataResolvedVisibility
    {
        [JsonProperty(".tag")]
        public string tag { get; set; }
    }

    public class DropboxLinkMetadataRevokeFailureReason
    {
        [JsonProperty(".tag")]
        public string tag { get; set; }
    }

    public class DropboxLinkMetadataTeamMemberInfo
    {
        public DropboxLinkMetadataTeamInfo team_info { get; set; }
        public string display_name { get; set; }
        public string member_id { get; set; }
    }

    public class DropboxLinkMetadataTeamInfo
    {
        public string id { get; set; }
        public string name { get; set; }
    }

    public class DropboxListSharedLinksResult
    {
        public DropboxLinkMetadata[] links { get; set; }
        public bool has_more { get; set; }
        public string cursor { get; set; }
    }
}
```

--------------------------------------------------------------------------------

````
