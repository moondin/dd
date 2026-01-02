---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 558
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 558 of 650)

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

---[FILE: FTPAccount.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/FTPAccount.cs

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
    public class FTPAccount : ICloneable
    {
        [Category("FTP"), Description("Shown in the list as: Name - Server:Port")]
        public string Name { get; set; }

        [Category("Account"), Description("Connection protocol"), DefaultValue(FTPProtocol.FTP)]
        public FTPProtocol Protocol { get; set; }

        [Category("FTP"), Description("Host, e.g. google.com")]
        public string Host { get; set; }

        [Category("FTP"), Description("Port number"), DefaultValue(21)]
        public int Port { get; set; }

        [Category("FTP")]
        public string Username { get; set; }

        [Category("FTP"), PasswordPropertyText(true), JsonEncrypt]
        public string Password { get; set; }

        [Category("FTP"), Description("Set true for active or false for passive"), DefaultValue(false)]
        public bool IsActive { get; set; }

        [Category("FTP"), Description("FTP sub folder path, example: Screenshots.\r\nYou can use name parsing: %y = year, %mo = month.")]
        public string SubFolderPath { get; set; }

        [Category("FTP"), Description("Choose an appropriate protocol to be accessed by the browser"), DefaultValue(BrowserProtocol.http)]
        public BrowserProtocol BrowserProtocol { get; set; }

        [Category("FTP"), Description("URL = HttpHomePath + SubFolderPath + FileName\r\nIf HttpHomePath is empty then URL = Host + SubFolderPath + FileName\r\n%host = Host")]
        public string HttpHomePath { get; set; }

        [Category("FTP"), Description("Automatically add sub folder path to end of http home path"), DefaultValue(false)]
        public bool HttpHomePathAutoAddSubFolderPath { get; set; }

        [Category("FTP"), Description("Don't add file extension to URL"), DefaultValue(false)]
        public bool HttpHomePathNoExtension { get; set; }

        [Category("FTP"), Description("Protocol://Host:Port"), Browsable(false)]
        public string FTPAddress
        {
            get
            {
                if (string.IsNullOrEmpty(Host))
                {
                    return "";
                }

                string serverProtocol;

                switch (Protocol)
                {
                    default:
                    case FTPProtocol.FTP:
                        serverProtocol = "ftp://";
                        break;
                    case FTPProtocol.FTPS:
                        serverProtocol = "ftps://";
                        break;
                    case FTPProtocol.SFTP:
                        serverProtocol = "sftp://";
                        break;
                }

                return string.Format("{0}{1}:{2}", serverProtocol, Host, Port);
            }
        }

        private string exampleFileName = "example.png";

        [Category("FTP"), Description("Preview of the FTP path based on the settings above")]
        public string PreviewFtpPath => GetFtpPath(exampleFileName);

        [Category("FTP"), Description("Preview of the HTTP path based on the settings above")]
        public string PreviewHttpPath
        {
            get
            {
                try
                {
                    return GetUriPath(exampleFileName);
                }
                catch
                {
                    return "";
                }
            }
        }

        [Category("FTPS"), Description("Type of SSL to use. Explicit is TLS, Implicit is SSL."), DefaultValue(FTPSEncryption.Explicit)]
        public FTPSEncryption FTPSEncryption { get; set; }

        [Category("FTPS"), Description("Certificate file location. Optional setting.")]
        [Editor(typeof(CertFileNameEditor), typeof(UITypeEditor))]
        public string FTPSCertificateLocation { get; set; }

        [Category("SFTP"), Description("Key location")]
        [Editor(typeof(KeyFileNameEditor), typeof(UITypeEditor))]
        public string Keypath { get; set; }

        [Category("SFTP"), Description("OpenSSH key passphrase"), PasswordPropertyText(true), JsonEncrypt]
        public string Passphrase { get; set; }

        public FTPAccount()
        {
            Name = "New account";
            Protocol = FTPProtocol.FTP;
            Host = "";
            Port = 21;
            IsActive = false;
            SubFolderPath = "";
            BrowserProtocol = BrowserProtocol.http;
            HttpHomePath = "";
            HttpHomePathAutoAddSubFolderPath = true;
            HttpHomePathNoExtension = false;
            FTPSEncryption = FTPSEncryption.Explicit;
            FTPSCertificateLocation = "";
        }

        public string GetSubFolderPath(string fileName = null, NameParserType nameParserType = NameParserType.URL)
        {
            string path = NameParser.Parse(nameParserType, SubFolderPath.Replace("%host", Host));
            return URLHelpers.CombineURL(path, fileName);
        }

        public string GetHttpHomePath()
        {
            string homePath = HttpHomePath.Replace("%host", Host);

            ShareXCustomUploaderSyntaxParser parser = new ShareXCustomUploaderSyntaxParser();
            parser.UseNameParser = true;
            parser.NameParserType = NameParserType.URL;
            return parser.Parse(homePath);
        }

        public string GetUriPath(string fileName, string subFolderPath = null)
        {
            if (string.IsNullOrEmpty(Host))
            {
                return "";
            }

            if (HttpHomePathNoExtension)
            {
                fileName = Path.GetFileNameWithoutExtension(fileName);
            }

            fileName = URLHelpers.URLEncode(fileName);

            if (subFolderPath == null)
            {
                subFolderPath = GetSubFolderPath();
            }

            UriBuilder httpHomeUri;

            string httpHomePath = GetHttpHomePath();

            if (string.IsNullOrEmpty(httpHomePath))
            {
                string url = Host;

                if (url.StartsWith("ftp."))
                {
                    url = url.Substring(4);
                }

                if (HttpHomePathAutoAddSubFolderPath)
                {
                    url = URLHelpers.CombineURL(url, subFolderPath);
                }

                url = URLHelpers.CombineURL(url, fileName);

                httpHomeUri = new UriBuilder(url);
                httpHomeUri.Port = -1; //Since httpHomePath is not set, it's safe to erase UriBuilder's assumed port number
            }
            else
            {
                //Parse HttpHomePath in to host, port, path and query components
                int firstSlash = httpHomePath.IndexOf('/');
                string httpHome = firstSlash >= 0 ? httpHomePath.Substring(0, firstSlash) : httpHomePath;
                int portSpecifiedAt = httpHome.LastIndexOf(':');

                string httpHomeHost = portSpecifiedAt >= 0 ? httpHome.Substring(0, portSpecifiedAt) : httpHome;
                int httpHomePort = -1;
                string httpHomePathAndQuery = firstSlash >= 0 ? httpHomePath.Substring(firstSlash + 1) : "";
                int querySpecifiedAt = httpHomePathAndQuery.LastIndexOf('?');
                string httpHomeDir = querySpecifiedAt >= 0 ? httpHomePathAndQuery.Substring(0, querySpecifiedAt) : httpHomePathAndQuery;
                string httpHomeQuery = querySpecifiedAt >= 0 ? httpHomePathAndQuery.Substring(querySpecifiedAt + 1) : "";

                if (portSpecifiedAt >= 0)
                    int.TryParse(httpHome.Substring(portSpecifiedAt + 1), out httpHomePort);

                //Build URI
                httpHomeUri = new UriBuilder { Host = httpHomeHost, Path = httpHomeDir, Query = httpHomeQuery };
                if (portSpecifiedAt >= 0)
                {
                    httpHomeUri.Port = httpHomePort;
                }

                if (httpHomeUri.Query.EndsWith("="))
                {
                    //Setting URIBuilder.Query automatically prepends a ? so we must trim it first.
                    if (HttpHomePathAutoAddSubFolderPath)
                    {
                        httpHomeUri.Query = URLHelpers.CombineURL(httpHomeUri.Query.Substring(1), subFolderPath, fileName);
                    }
                    else
                    {
                        httpHomeUri.Query = httpHomeUri.Query.Substring(1) + fileName;
                    }
                }
                else
                {
                    if (HttpHomePathAutoAddSubFolderPath)
                    {
                        httpHomeUri.Path = URLHelpers.CombineURL(httpHomeUri.Path, subFolderPath);
                    }

                    httpHomeUri.Path = URLHelpers.CombineURL(httpHomeUri.Path, fileName);
                }
            }

            httpHomeUri.Scheme = BrowserProtocol.GetDescription();
            return httpHomeUri.Uri.OriginalString;
        }

        public string GetFtpPath(string fileName)
        {
            if (string.IsNullOrEmpty(FTPAddress))
            {
                return "";
            }

            return URLHelpers.CombineURL(FTPAddress, GetSubFolderPath(fileName, NameParserType.FilePath));
        }

        public override string ToString()
        {
            return $"{Name} ({Host}:{Port})";
        }

        public FTPAccount Clone()
        {
            return MemberwiseClone() as FTPAccount;
        }

        object ICloneable.Clone()
        {
            return Clone();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: GoogleCloudStorage.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/GoogleCloudStorage.cs

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
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class GoogleCloudStorageNewFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.GoogleCloudStorage;

        public override Icon ServiceIcon => Resources.GoogleCloud;

        public override bool CheckConfig(UploadersConfig config)
        {
            return OAuth2Info.CheckOAuth(config.GoogleCloudStorageOAuth2Info) && !string.IsNullOrEmpty(config.GoogleCloudStorageBucket);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new GoogleCloudStorage(config.GoogleCloudStorageOAuth2Info)
            {
                Bucket = config.GoogleCloudStorageBucket,
                Domain = config.GoogleCloudStorageDomain,
                Prefix = config.GoogleCloudStorageObjectPrefix,
                RemoveExtensionImage = config.GoogleCloudStorageRemoveExtensionImage,
                RemoveExtensionText = config.GoogleCloudStorageRemoveExtensionText,
                RemoveExtensionVideo = config.GoogleCloudStorageRemoveExtensionVideo,
                SetPublicACL = config.GoogleCloudStorageSetPublicACL
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpGoogleCloudStorage;
    }

    public sealed class GoogleCloudStorage : FileUploader, IOAuth2
    {
        public GoogleOAuth2 OAuth2 { get; private set; }
        public OAuth2Info AuthInfo => OAuth2.AuthInfo;
        public string Bucket { get; set; }
        public string Domain { get; set; }
        public string Prefix { get; set; }
        public bool RemoveExtensionImage { get; set; }
        public bool RemoveExtensionText { get; set; }
        public bool RemoveExtensionVideo { get; set; }
        public bool SetPublicACL { get; set; }

        public GoogleCloudStorage(OAuth2Info oauth)
        {
            OAuth2 = new GoogleOAuth2(oauth, this)
            {
                Scope = "https://www.googleapis.com/auth/devstorage.read_write https://www.googleapis.com/auth/userinfo.profile"
            };
        }

        public bool RefreshAccessToken()
        {
            return OAuth2.RefreshAccessToken();
        }

        public bool CheckAuthorization()
        {
            return OAuth2.CheckAuthorization();
        }

        public string GetAuthorizationURL()
        {
            return OAuth2.GetAuthorizationURL();
        }

        public bool GetAccessToken(string code)
        {
            return OAuth2.GetAccessToken(code);
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            if (!CheckAuthorization()) return null;

            string uploadPath = GetUploadPath(fileName);

            OnEarlyURLCopyRequested(GenerateURL(uploadPath));

            GoogleCloudStorageMetadata googleCloudStorageMetadata = new GoogleCloudStorageMetadata
            {
                name = uploadPath
            };

            if (SetPublicACL)
            {
                googleCloudStorageMetadata.acl = new GoogleCloudStorageAcl[]
                {
                    new GoogleCloudStorageAcl
                    {
                        entity = "allUsers",
                        role = "READER"
                    }
                };
            }

            string serializedGoogleCloudStorageMetadata = JsonConvert.SerializeObject(googleCloudStorageMetadata);

            UploadResult result = SendRequestFile($"https://www.googleapis.com/upload/storage/v1/b/{Bucket}/o?uploadType=multipart&fields=name", stream, fileName, null, headers: OAuth2.GetAuthHeaders(), contentType: "multipart/related", relatedData: serializedGoogleCloudStorageMetadata);

            GoogleCloudStorageResponse googleCloudStorageResponse = JsonConvert.DeserializeObject<GoogleCloudStorageResponse>(result.Response);

            result.URL = GenerateURL(googleCloudStorageResponse.name);

            return result;
        }

        private string GetUploadPath(string fileName)
        {
            string uploadPath = NameParser.Parse(NameParserType.FilePath, Prefix.Trim('/'));

            if ((RemoveExtensionImage && FileHelpers.IsImageFile(fileName)) ||
                (RemoveExtensionText && FileHelpers.IsTextFile(fileName)) ||
                (RemoveExtensionVideo && FileHelpers.IsVideoFile(fileName)))
            {
                fileName = Path.GetFileNameWithoutExtension(fileName);
            }

            return URLHelpers.CombineURL(uploadPath, fileName);
        }

        public string GenerateURL(string uploadPath)
        {
            if (string.IsNullOrEmpty(Bucket))
            {
                return "";
            }

            if (string.IsNullOrEmpty(Domain))
            {
                Domain = URLHelpers.CombineURL("storage.googleapis.com", Bucket);
            }

            uploadPath = URLHelpers.URLEncode(uploadPath, true, HelpersOptions.URLEncodeIgnoreEmoji);

            string url = URLHelpers.CombineURL(Domain, uploadPath);

            return URLHelpers.FixPrefix(url);
        }

        public string GetPreviewURL()
        {
            string uploadPath = GetUploadPath("example.png");
            return GenerateURL(uploadPath);
        }

        private class GoogleCloudStorageResponse
        {
            public string name { get; set; }
        }

        private class GoogleCloudStorageMetadata
        {
            public string name { get; set; }
            public GoogleCloudStorageAcl[] acl { get; set; }
        }

        private class GoogleCloudStorageAcl
        {
            public string entity { get; set; }
            public string role { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: GoogleDrive.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/GoogleDrive.cs

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
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Drawing;
using System.IO;
using System.Web;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class GoogleDriveFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.GoogleDrive;

        public override Icon ServiceIcon => Resources.GoogleDrive;

        public override bool CheckConfig(UploadersConfig config)
        {
            return OAuth2Info.CheckOAuth(config.GoogleDriveOAuth2Info);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new GoogleDrive(config.GoogleDriveOAuth2Info)
            {
                IsPublic = config.GoogleDriveIsPublic,
                DirectLink = config.GoogleDriveDirectLink,
                FolderID = config.GoogleDriveUseFolder ? config.GoogleDriveFolderID : null,
                DriveID = config.GoogleDriveSelectedDrive?.id
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpGoogleDrive;
    }

    public enum GoogleDrivePermissionRole
    {
        owner, reader, writer, organizer, commenter
    }

    public enum GoogleDrivePermissionType
    {
        user, group, domain, anyone
    }

    public sealed class GoogleDrive : FileUploader, IOAuth2
    {
        public GoogleOAuth2 OAuth2 { get; private set; }
        public OAuth2Info AuthInfo => OAuth2.AuthInfo;
        public bool IsPublic { get; set; }
        public bool DirectLink { get; set; }
        public string FolderID { get; set; }
        public string DriveID { get; set; }

        public static GoogleDriveSharedDrive MyDrive = new GoogleDriveSharedDrive
        {
            id = "", // empty defaults to user drive
            name = Resources.GoogleDrive_MyDrive_My_drive
        };

        public GoogleDrive(OAuth2Info oauth)
        {
            OAuth2 = new GoogleOAuth2(oauth, this)
            {
                Scope = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile"
            };
        }

        public bool RefreshAccessToken()
        {
            return OAuth2.RefreshAccessToken();
        }

        public bool CheckAuthorization()
        {
            return OAuth2.CheckAuthorization();
        }

        public string GetAuthorizationURL()
        {
            return OAuth2.GetAuthorizationURL();
        }

        public bool GetAccessToken(string code)
        {
            return OAuth2.GetAccessToken(code);
        }

        private string GetMetadata(string name, string parentID, string driveID = "")
        {
            object metadata;

            // If there's no parent folder, the drive behaves as parent
            if (string.IsNullOrEmpty(parentID))
            {
                parentID = driveID;
            }

            if (!string.IsNullOrEmpty(parentID))
            {
                metadata = new
                {
                    name = name,
                    driveId = driveID,
                    parents = new[]
                    {
                        parentID
                    }
                };
            }
            else
            {
                metadata = new
                {
                    name = name
                };
            }

            return JsonConvert.SerializeObject(metadata);
        }

        private void SetPermissions(string fileID, GoogleDrivePermissionRole role, GoogleDrivePermissionType type, bool allowFileDiscovery)
        {
            if (!CheckAuthorization()) return;

            string url = string.Format("https://www.googleapis.com/drive/v3/files/{0}/permissions?supportsAllDrives=true", fileID);

            string json = JsonConvert.SerializeObject(new
            {
                role = role.ToString(),
                type = type.ToString(),
                allowFileDiscovery = allowFileDiscovery.ToString()
            });

            SendRequest(HttpMethod.POST, url, json, RequestHelpers.ContentTypeJSON, null, OAuth2.GetAuthHeaders());
        }

        public List<GoogleDriveFile> GetFolders(string driveID = "", bool trashed = false, bool writer = true)
        {
            if (!CheckAuthorization()) return null;

            string query = "mimeType = 'application/vnd.google-apps.folder'";

            if (!trashed)
            {
                query += " and trashed = false";
            }

            if (writer && string.IsNullOrEmpty(driveID))
            {
                query += " and 'me' in writers";
            }

            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("q", query);
            args.Add("fields", "nextPageToken,files(id,name,description)");
            if (!string.IsNullOrEmpty(driveID))
            {
                args.Add("driveId", driveID);
                args.Add("corpora", "drive");
                args.Add("supportsAllDrives", "true");
                args.Add("includeItemsFromAllDrives", "true");
            }

            List<GoogleDriveFile> folders = new List<GoogleDriveFile>();
            string pageToken = "";

            // Make sure we get all the pages of results
            do
            {
                args["pageToken"] = pageToken;
                string response = SendRequest(HttpMethod.GET, "https://www.googleapis.com/drive/v3/files", args, OAuth2.GetAuthHeaders());
                pageToken = "";

                if (!string.IsNullOrEmpty(response))
                {
                    GoogleDriveFileList fileList = JsonConvert.DeserializeObject<GoogleDriveFileList>(response);

                    if (fileList != null)
                    {
                        folders.AddRange(fileList.files);
                        pageToken = fileList.nextPageToken;
                    }
                }
            }
            while (!string.IsNullOrEmpty(pageToken));

            return folders;
        }

        public List<GoogleDriveSharedDrive> GetDrives()
        {
            if (!CheckAuthorization()) return null;

            Dictionary<string, string> args = new Dictionary<string, string>();
            List<GoogleDriveSharedDrive> drives = new List<GoogleDriveSharedDrive>();
            string pageToken = "";

            // Make sure we get all the pages of results
            do
            {
                args["pageToken"] = pageToken;
                string response = SendRequest(HttpMethod.GET, "https://www.googleapis.com/drive/v3/drives", args, OAuth2.GetAuthHeaders());
                pageToken = "";

                if (!string.IsNullOrEmpty(response))
                {
                    GoogleDriveSharedDriveList driveList = JsonConvert.DeserializeObject<GoogleDriveSharedDriveList>(response);

                    if (driveList != null)
                    {
                        drives.AddRange(driveList.drives);
                        pageToken = driveList.nextPageToken;
                    }
                }
            }
            while (!string.IsNullOrEmpty(pageToken));

            return drives;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            if (!CheckAuthorization()) return null;

            string metadata = GetMetadata(fileName, FolderID, DriveID);

            UploadResult result = SendRequestFile("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink&supportsAllDrives=true",
                stream, fileName, "file", headers: OAuth2.GetAuthHeaders(), contentType: "multipart/related", relatedData: metadata);

            if (!string.IsNullOrEmpty(result.Response))
            {
                GoogleDriveFile upload = JsonConvert.DeserializeObject<GoogleDriveFile>(result.Response);

                if (upload != null)
                {
                    AllowReportProgress = false;

                    if (IsPublic)
                    {
                        SetPermissions(upload.id, GoogleDrivePermissionRole.reader, GoogleDrivePermissionType.anyone, false);
                    }

                    if (DirectLink)
                    {
                        Uri webContentLink = new Uri(upload.webContentLink);

                        string leftPart = webContentLink.GetLeftPart(UriPartial.Path);

                        NameValueCollection queryString = HttpUtility.ParseQueryString(webContentLink.Query);
                        queryString.Remove("export");

                        result.URL = $"{leftPart}?{queryString}";
                    }
                    else
                    {
                        result.URL = upload.webViewLink;
                    }
                }
            }

            return result;
        }
    }

    public class GoogleDriveFile
    {
        public string id { get; set; }
        public string webViewLink { get; set; }
        public string webContentLink { get; set; }
        public string name { get; set; }
        public string description { get; set; }
    }

    public class GoogleDriveFileList
    {
        public List<GoogleDriveFile> files { get; set; }
        public string nextPageToken { get; set; }
    }

    public class GoogleDriveSharedDrive
    {
        public string id { get; set; }
        public string name { get; set; }

        public override string ToString()
        {
            return name;
        }
    }

    public class GoogleDriveSharedDriveList
    {
        public List<GoogleDriveSharedDrive> drives { get; set; }
        public string nextPageToken { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Hostr.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Hostr.cs

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
using System.Collections.Specialized;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class HostrFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Localhostr;

        public override Icon ServiceIcon => Resources.Hostr;

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.LocalhostrEmail) && !string.IsNullOrEmpty(config.LocalhostrPassword);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Hostr(config.LocalhostrEmail, config.LocalhostrPassword)
            {
                DirectURL = config.LocalhostrDirectURL
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpHostr;
    }

    public sealed class Hostr : FileUploader
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool DirectURL { get; set; }

        public Hostr(string email, string password)
        {
            Email = email;
            Password = password;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            UploadResult result = null;

            if (!string.IsNullOrEmpty(Email) && !string.IsNullOrEmpty(Password))
            {
                NameValueCollection headers = RequestHelpers.CreateAuthenticationHeader(Email, Password);
                result = SendRequestFile("https://api.hostr.co/file", stream, fileName, "file", headers: headers);

                if (result.IsSuccess)
                {
                    HostrFileUploadResponse response = JsonConvert.DeserializeObject<HostrFileUploadResponse>(result.Response);

                    if (response != null)
                    {
                        if (DirectURL && response.direct != null)
                        {
                            result.URL = string.Format("http://hostr.co/file/{0}/{1}", response.id, response.name);
                            result.ThumbnailURL = response.direct.direct_150x;
                        }
                        else
                        {
                            result.URL = response.href;
                        }
                    }
                }
            }

            return result;
        }

        public class HostrFileUploadResponse
        {
            public string added { get; set; }
            public string name { get; set; }
            public string href { get; set; }
            public int size { get; set; }
            public string type { get; set; }
            public HostrFileUploadResponseDirect direct { get; set; }
            public string id { get; set; }
        }

        public class HostrFileUploadResponseDirect
        {
            [JsonProperty("150x")]
            public string direct_150x { get; set; }

            [JsonProperty("930x")]
            public string direct_930x { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Lambda.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Lambda.cs

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
    public class LambdaFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Lambda;

        public override Icon ServiceIcon => Resources.Lambda;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.LambdaSettings != null && !string.IsNullOrEmpty(config.LambdaSettings.UserAPIKey);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            // Correct old URLs
            if (config.LambdaSettings != null && config.LambdaSettings.UploadURL == "https://λ.pw/")
            {
                config.LambdaSettings.UploadURL = "https://lbda.net/";
            }

            return new Lambda(config.LambdaSettings);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpLambda;
    }

    public sealed class Lambda : FileUploader
    {
        public LambdaSettings Config { get; private set; }

        public Lambda(LambdaSettings config)
        {
            Config = config;
        }

        private const string uploadUrl = "https://lbda.net/api/upload";

        public static string[] UploadURLs = new string[] { "https://lbda.net/", "https://lambda.sx/" };

        public override UploadResult Upload(Stream stream, string fileName)
        {
            Dictionary<string, string> arguments = new Dictionary<string, string>();
            arguments.Add("api_key", Config.UserAPIKey);
            UploadResult result = SendRequestFile(uploadUrl, stream, fileName, "file", arguments, method: HttpMethod.PUT);

            if (result.Response == null)
            {
                Errors.Add("Upload failed for unknown reason. Check your API key.");
                return result;
            }

            LambdaResponse response = JsonConvert.DeserializeObject<LambdaResponse>(result.Response);
            if (result.IsSuccess)
            {
                result.URL = Config.UploadURL + response.url;
            }
            else
            {
                foreach (string e in response.errors)
                {
                    Errors.Add(e);
                }
            }

            return result;
        }

        internal class LambdaResponse
        {
            public string url { get; set; }
            public List<string> errors { get; set; }
        }

        internal class LambdaFile
        {
            public string url { get; set; }
        }
    }

    public class LambdaSettings
    {
        [JsonEncrypt]
        public string UserAPIKey { get; set; } = "";
        public string UploadURL { get; set; } = "https://lbda.net/";
    }
}
```

--------------------------------------------------------------------------------

````
