---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 539
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 539 of 650)

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

---[FILE: Enums.cs]---
Location: ShareX-develop/ShareX.UploadersLib/Enums.cs

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

using System;
using System.ComponentModel;

namespace ShareX.UploadersLib
{
    [Description("Image uploaders"), DefaultValue(Imgur)]
    public enum ImageDestination
    {
        [Description("Imgur")]
        Imgur,
        [Description("ImageShack")]
        ImageShack,
        [Description("Flickr")]
        Flickr,
        [Description("Photobucket")]
        Photobucket,
        [Description("Chevereto")]
        Chevereto,
        [Description("vgy.me")]
        Vgyme,
        CustomImageUploader, // Localized
        FileUploader // Localized
    }

    [Description("Text uploaders"), DefaultValue(Pastebin)]
    public enum TextDestination
    {
        [Description("Pastebin")]
        Pastebin,
        [Description("Paste2")]
        Paste2,
        [Description("Slexy")]
        Slexy,
        [Description("Paste.ee")]
        Paste_ee,
        [Description("GitHub Gist")]
        Gist,
        [Description("uPaste")]
        Upaste,
        [Description("Hastebin")]
        Hastebin,
        [Description("OneTimeSecret")]
        OneTimeSecret,
        [Description("Pastie")]
        Pastie,
        CustomTextUploader, // Localized
        FileUploader // Localized
    }

    [Description("File uploaders"), DefaultValue(Dropbox)]
    public enum FileDestination
    {
        [Description("Dropbox")]
        Dropbox,
        [Description("FTP")]
        FTP,
        [Description("OneDrive")]
        OneDrive,
        [Description("Google Drive")]
        GoogleDrive,
        [Description("puush")]
        Puush,
        [Description("Box")]
        Box,
        [Description("MEGA")]
        Mega,
        [Description("Amazon S3")]
        AmazonS3,
        [Description("Google Cloud Storage")]
        GoogleCloudStorage,
        [Description("Azure Storage")]
        AzureStorage,
        [Description("Backblaze B2")]
        BackblazeB2,
        [Description("ownCloud / Nextcloud")]
        OwnCloud,
        [Description("MediaFire")]
        MediaFire,
        [Description("Pushbullet")]
        Pushbullet,
        [Description("SendSpace")]
        SendSpace,
        [Description("Hostr")]
        Localhostr,
        [Description("Lambda")]
        Lambda,
        [Description("Pomf")]
        Pomf,
        [Description("Uguu")]
        Uguu,
        [Description("Seafile")]
        Seafile,
        [Description("Streamable")]
        Streamable,
        [Description("s-ul")]
        Sul,
        [Description("LobFile")]
        Lithiio,
        [Description("transfer.sh")]
        Transfersh,
        [Description("Plik")]
        Plik,
        [Description("YouTube")]
        YouTube,
        [Description("Vault.ooo")]
        Vault_ooo,
        SharedFolder, // Localized
        Email, // Localized
        CustomFileUploader // Localized
    }

    [Description("URL shorteners"), DefaultValue(BITLY)]
    public enum UrlShortenerType
    {
        [Description("bit.ly")]
        BITLY,
        [Description("is.gd")]
        ISGD,
        [Description("v.gd")]
        VGD,
        [Description("tinyurl.com")]
        TINYURL,
        [Description("turl.ca")]
        TURL,
        [Description("yourls.org")]
        YOURLS,
        [Description("qr.net")]
        QRnet,
        [Description("vurl.com")]
        VURL,
        [Description("2.gp")]
        TwoGP,
        [Description("Polr")]
        Polr,
        [Description("Firebase Dynamic Links")]
        FirebaseDynamicLinks,
        [Description("Kutt")]
        Kutt,
        [Description("Zero Width Shortener")]
        ZeroWidthShortener,
        CustomURLShortener // Localized
    }

    [Description("URL sharing services"), DefaultValue(Email)]
    public enum URLSharingServices
    {
        Email, // Localized
        [Description("Facebook")]
        Facebook,
        [Description("Reddit")]
        Reddit,
        [Description("Pinterest")]
        Pinterest,
        [Description("Tumblr")]
        Tumblr,
        [Description("LinkedIn")]
        LinkedIn,
        [Description("StumbleUpon")]
        StumbleUpon,
        [Description("Delicious")]
        Delicious,
        [Description("VK")]
        VK,
        [Description("Pushbullet")]
        Pushbullet,
        GoogleImageSearch, // Localized
        BingVisualSearch, // Localized
        CustomURLSharingService // Localized
    }

    public enum HttpMethod
    {
        GET,
        POST,
        PUT,
        PATCH,
        DELETE
    }

    public enum FTPProtocol
    {
        [Description("FTP")]
        FTP,
        [Description("FTPS (FTP over SSL)")]
        FTPS,
        [Description("SFTP (SSH FTP)")]
        SFTP
    }

    public enum BrowserProtocol
    {
        [Description("http://")]
        http,
        [Description("https://")]
        https,
        [Description("ftp://")]
        ftp,
        [Description("ftps://")]
        ftps,
        [Description("file://")]
        file,
        [Description("sftp://")]
        sftp
    }

    public enum Privacy
    {
        Public,
        Private
    }

    public enum AccountType
    {
        [Description("Anonymous")]
        Anonymous,
        [Description("User")]
        User
    }

    public enum LinkFormatEnum
    {
        [Description("Full URL")]
        URL,
        [Description("Full Image for Forums")]
        ForumImage,
        [Description("Full Image as HTML")]
        HTMLImage,
        [Description("Full Image for Wiki")]
        WikiImage,
        [Description("Shortened URL")]
        ShortenedURL,
        [Description("Linked Thumbnail for Forums")]
        ForumLinkedImage,
        [Description("Linked Thumbnail as HTML")]
        HTMLLinkedImage,
        [Description("Linked Thumbnail for Wiki")]
        WikiLinkedImage,
        [Description("Thumbnail")]
        ThumbnailURL,
        [Description("Local File path")]
        LocalFilePath,
        [Description("Local File path as URI")]
        LocalFilePathUri
    }

    public enum CustomUploaderBody
    {
        [Description("No body")]
        None,
        [Description("Form data (multipart/form-data)")]
        MultipartFormData,
        [Description("Form URL encoded (application/x-www-form-urlencoded)")]
        FormURLEncoded,
        [Description("JSON (application/json)")]
        JSON,
        [Description("XML (application/xml)")]
        XML,
        [Description("Binary")]
        Binary
    }

    [Flags]
    public enum CustomUploaderDestinationType
    {
        [Description("None")]
        None = 0,
        ImageUploader = 1, // Localized
        TextUploader = 1 << 1, // Localized
        FileUploader = 1 << 2, // Localized
        URLShortener = 1 << 3, // Localized
        URLSharingService = 1 << 4 // Localized
    }

    public enum FTPSEncryption
    {
        /// <summary>
        /// Connection starts in plain text and encryption is enabled with the AUTH command immediately after the server greeting.
        /// </summary>
        Explicit,
        /// <summary>
        /// Encryption is used from the start of the connection, port 990
        /// </summary>
        Implicit
    }

    public enum OAuthLoginStatus
    {
        LoginRequired,
        LoginSuccessful,
        LoginFailed
    }

    public enum YouTubeVideoPrivacy // Localized
    {
        Public,
        Unlisted,
        Private
    }

    public enum BoxShareAccessLevel
    {
        [Description("Public - People with the link")]
        Open,
        [Description("Company - People in your company")]
        Company,
        [Description("Collaborators - Invited people only")]
        Collaborators
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShareX.UploadersLib.csproj]---
Location: ShareX-develop/ShareX.UploadersLib/ShareX.UploadersLib.csproj

```text
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0-windows</TargetFramework>
    <OutputType>Library</OutputType>
    <PlatformTarget>x64</PlatformTarget>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    <UseWindowsForms>true</UseWindowsForms>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="FluentFTP" Version="53.0.2" />
    <PackageReference Include="MegaApiClient" Version="1.10.5" />
    <PackageReference Include="Newtonsoft.Json" Version="13.0.4" />
    <PackageReference Include="SSH.NET" Version="2025.1.0" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\ShareX.HelpersLib\ShareX.HelpersLib.csproj" />
  </ItemGroup>
  <ItemGroup>
    <Content Include="Resources\OAuthCallbackPage.html" />
  </ItemGroup>
</Project>
```

--------------------------------------------------------------------------------

---[FILE: UploaderFactory.cs]---
Location: ShareX-develop/ShareX.UploadersLib/UploaderFactory.cs

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
using System.Collections.Generic;
using System.Linq;

namespace ShareX.UploadersLib
{
    public static class UploaderFactory
    {
        public static List<IUploaderService> AllServices { get; } = new List<IUploaderService>();
        public static List<IGenericUploaderService> AllGenericUploaderServices { get; } = new List<IGenericUploaderService>();
        public static Dictionary<ImageDestination, ImageUploaderService> ImageUploaderServices { get; } = CacheServices<ImageDestination, ImageUploaderService>();
        public static Dictionary<TextDestination, TextUploaderService> TextUploaderServices { get; } = CacheServices<TextDestination, TextUploaderService>();
        public static Dictionary<FileDestination, FileUploaderService> FileUploaderServices { get; } = CacheServices<FileDestination, FileUploaderService>();
        public static Dictionary<UrlShortenerType, URLShortenerService> URLShortenerServices { get; } = CacheServices<UrlShortenerType, URLShortenerService>();
        public static Dictionary<URLSharingServices, URLSharingService> URLSharingServices { get; } = CacheServices<URLSharingServices, URLSharingService>();

        private static Dictionary<T, T2> CacheServices<T, T2>() where T2 : UploaderService<T>
        {
            IEnumerable<T2> instances = Helpers.GetInstances<T2>();

            AllServices.AddRange(instances.OfType<IUploaderService>());
            AllGenericUploaderServices.AddRange(instances.OfType<IGenericUploaderService>());

            return instances.ToDictionary(x => x.EnumValue, x => x);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: UploaderFilter.cs]---
Location: ShareX-develop/ShareX.UploadersLib/UploaderFilter.cs

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
using System.Collections.Generic;
using System.Linq;

namespace ShareX.UploadersLib
{
    public class UploaderFilter
    {
        public string Uploader { get; set; }
        public List<string> Extensions { get; set; } = new List<string>();
        //public long Size { get; set; }

        public UploaderFilter()
        {
        }

        public UploaderFilter(string uploader, params string[] extensions)
        {
            Uploader = uploader;
            Extensions = extensions.ToList();
        }

        public bool IsValidFilter(string fileName)
        {
            string extension = FileHelpers.GetFileNameExtension(fileName);

            return !string.IsNullOrEmpty(extension) && Extensions.Any(x => x.TrimStart('.').Equals(extension, StringComparison.OrdinalIgnoreCase));
        }

        public IGenericUploaderService GetUploaderService()
        {
            return UploaderFactory.AllGenericUploaderServices.FirstOrDefault(x => x.ServiceIdentifier.Equals(Uploader, StringComparison.OrdinalIgnoreCase));
        }

        public void SetExtensions(string extensions)
        {
            if (!string.IsNullOrEmpty(extensions))
            {
                Extensions = extensions.Split(',').Select(x => x.Trim()).Where(x => !string.IsNullOrEmpty(x)).ToList();
            }
            else
            {
                Extensions = new List<string>();
            }
        }

        public string GetExtensions()
        {
            return string.Join(", ", Extensions);
        }

        public override string ToString()
        {
            return Uploader;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: UploadersConfig.cs]---
Location: ShareX-develop/ShareX.UploadersLib/UploadersConfig.cs

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
using ShareX.UploadersLib.FileUploaders;
using ShareX.UploadersLib.ImageUploaders;
using ShareX.UploadersLib.TextUploaders;
using ShareX.UploadersLib.URLShorteners;
using System.Collections.Generic;

namespace ShareX.UploadersLib
{
    public class UploadersConfig : SettingsBase<UploadersConfig>
    {
        #region Image uploaders

        #region Imgur

        public AccountType ImgurAccountType { get; set; } = AccountType.Anonymous;
        public bool ImgurDirectLink { get; set; } = true;
        public ImgurThumbnailType ImgurThumbnailType { get; set; } = ImgurThumbnailType.Medium_Thumbnail;
        public bool ImgurUseGIFV { get; set; } = true;
        public OAuth2Info ImgurOAuth2Info { get; set; } = null;
        public bool ImgurUploadSelectedAlbum { get; set; } = false;
        public ImgurAlbumData ImgurSelectedAlbum { get; set; } = null;
        public List<ImgurAlbumData> ImgurAlbumList { get; set; } = null;

        #endregion Imgur

        #region ImageShack

        public ImageShackOptions ImageShackSettings { get; set; } = new ImageShackOptions();

        #endregion ImageShack

        #region Flickr

        public OAuthInfo FlickrOAuthInfo { get; set; } = null;
        public FlickrSettings FlickrSettings { get; set; } = new FlickrSettings();

        #endregion Flickr

        #region Photobucket

        public OAuthInfo PhotobucketOAuthInfo { get; set; } = null;
        public PhotobucketAccountInfo PhotobucketAccountInfo { get; set; } = null;

        #endregion Photobucket

        #region Chevereto

        public CheveretoUploader CheveretoUploader { get; set; } = new CheveretoUploader();
        public bool CheveretoDirectURL { get; set; } = true;

        #endregion Chevereto

        #region vgy.me

        [JsonEncrypt]
        public string VgymeUserKey { get; set; } = "";

        #endregion vgy.me

        #endregion Image uploaders

        #region Text uploaders

        #region Pastebin

        public PastebinSettings PastebinSettings { get; set; } = new PastebinSettings();

        #endregion Pastebin

        #region Paste.ee

        [JsonEncrypt]
        public string Paste_eeUserKey { get; set; } = "";
        public bool Paste_eeEncryptPaste { get; set; } = false;

        #endregion Paste.ee

        #region Gist

        public OAuth2Info GistOAuth2Info { get; set; } = null;
        public bool GistPublishPublic { get; set; } = false;
        public bool GistRawURL { get; set; } = false;
        public string GistCustomURL { get; set; } = "";

        #endregion Gist

        #region uPaste

        [JsonEncrypt]
        public string UpasteUserKey { get; set; } = "";
        public bool UpasteIsPublic { get; set; } = false;

        #endregion uPaste

        #region Hastebin

        public string HastebinCustomDomain { get; set; } = "https://hastebin.com";
        public string HastebinSyntaxHighlighting { get; set; } = "hs";
        public bool HastebinUseFileExtension { get; set; } = true;

        #endregion Hastebin

        #region OneTimeSecret

        public string OneTimeSecretAPIUsername { get; set; } = "";
        [JsonEncrypt]
        public string OneTimeSecretAPIKey { get; set; } = "";

        #endregion OneTimeSecret

        #region Pastie

        public bool PastieIsPublic { get; set; } = false;

        #endregion Pastie

        #endregion Text uploaders

        #region File uploaders

        #region Dropbox

        public OAuth2Info DropboxOAuth2Info { get; set; } = null;
        public string DropboxUploadPath { get; set; } = "ShareX/%y/%mo";
        public bool DropboxAutoCreateShareableLink { get; set; } = true;
        public bool DropboxUseDirectLink { get; set; } = false;

        #endregion Dropbox

        #region FTP

        public List<FTPAccount> FTPAccountList { get; set; } = new List<FTPAccount>();
        public int FTPSelectedImage { get; set; } = 0;
        public int FTPSelectedText { get; set; } = 0;
        public int FTPSelectedFile { get; set; } = 0;

        #endregion FTP

        #region OneDrive

        public OAuth2Info OneDriveV2OAuth2Info { get; set; } = null;
        public OneDriveFileInfo OneDriveV2SelectedFolder { get; set; } = OneDrive.RootFolder;
        public bool OneDriveAutoCreateShareableLink { get; set; } = true;
        public bool OneDriveUseDirectLink { get; set; } = false;

        #endregion OneDrive

        #region Google Drive

        public OAuth2Info GoogleDriveOAuth2Info { get; set; } = null;
        public OAuthUserInfo GoogleDriveUserInfo { get; set; } = null;
        public bool GoogleDriveIsPublic { get; set; } = true;
        public bool GoogleDriveDirectLink { get; set; } = false;
        public bool GoogleDriveUseFolder { get; set; } = false;
        public string GoogleDriveFolderID { get; set; } = "";
        public GoogleDriveSharedDrive GoogleDriveSelectedDrive { get; set; } = GoogleDrive.MyDrive;

        #endregion Google Drive

        #region puush

        [JsonEncrypt]
        public string PuushAPIKey { get; set; } = "";

        #endregion puush

        #region SendSpace

        public AccountType SendSpaceAccountType { get; set; } = AccountType.Anonymous;
        public string SendSpaceUsername { get; set; } = "";
        [JsonEncrypt]
        public string SendSpacePassword { get; set; } = "";

        #endregion SendSpace

        #region Box

        public OAuth2Info BoxOAuth2Info { get; set; } = null;
        public BoxFileEntry BoxSelectedFolder { get; set; } = Box.RootFolder;
        public bool BoxShare { get; set; } = true;
        public BoxShareAccessLevel BoxShareAccessLevel { get; set; } = BoxShareAccessLevel.Open;

        #endregion Box

        #region Localhostr

        public string LocalhostrEmail { get; set; } = "";
        [JsonEncrypt]
        public string LocalhostrPassword { get; set; } = "";
        public bool LocalhostrDirectURL { get; set; } = true;

        #endregion Localhostr

        #region Shared folder

        public List<LocalhostAccount> LocalhostAccountList { get; set; } = new List<LocalhostAccount>();
        public int LocalhostSelectedImages { get; set; } = 0;
        public int LocalhostSelectedText { get; set; } = 0;
        public int LocalhostSelectedFiles { get; set; } = 0;

        #endregion Shared folder

        #region Email

        public string EmailSmtpServer { get; set; } = "smtp.gmail.com";
        public int EmailSmtpPort { get; set; } = 587;
        public string EmailFrom { get; set; } = "...@gmail.com";
        [JsonEncrypt]
        public string EmailPassword { get; set; } = "";
        public bool EmailRememberLastTo { get; set; } = true;
        public string EmailLastTo { get; set; } = "";
        public string EmailDefaultSubject { get; set; } = "Sending email from ShareX";
        public string EmailDefaultBody { get; set; } = "Screenshot is attached.";
        public bool EmailAutomaticSend { get; set; } = false;
        public string EmailAutomaticSendTo { get; set; } = "";

        #endregion Email

        #region Mega

        public MegaAuthInfos MegaAuthInfos { get; set; } = null;
        public string MegaParentNodeId { get; set; } = null;

        #endregion Mega

        #region Amazon S3

        public AmazonS3Settings AmazonS3Settings { get; set; } = new AmazonS3Settings()
        {
            ObjectPrefix = "ShareX/%y/%mo"
        };

        #endregion Amazon S3

        #region ownCloud / Nextcloud

        public string OwnCloudHost { get; set; } = "";
        public string OwnCloudUsername { get; set; } = "";
        [JsonEncrypt]
        public string OwnCloudPassword { get; set; } = "";
        public string OwnCloudPath { get; set; } = "/";
        public int OwnCloudExpiryTime { get; set; } = 7;
        public bool OwnCloudCreateShare { get; set; } = true;
        public bool OwnCloudDirectLink { get; set; } = false;
        public bool OwnCloud81Compatibility { get; set; } = true;
        public bool OwnCloudUsePreviewLinks { get; set; } = false;
        public bool OwnCloudAppendFileNameToURL { get; set; } = false;
        public bool OwnCloudAutoExpire { get; set; } = false;

        #endregion ownCloud / Nextcloud

        #region MediaFire

        public string MediaFireUsername { get; set; } = "";
        [JsonEncrypt]
        public string MediaFirePassword { get; set; } = "";
        public string MediaFirePath { get; set; } = "";
        public bool MediaFireUseLongLink { get; set; } = false;

        #endregion MediaFire

        #region Pushbullet

        public PushbulletSettings PushbulletSettings { get; set; } = new PushbulletSettings();

        #endregion Pushbullet

        #region Lambda

        public LambdaSettings LambdaSettings { get; set; } = new LambdaSettings();

        #endregion Lambda

        #region LobFile

        public LobFileSettings LithiioSettings { get; set; } = new LobFileSettings();

        #endregion

        #region Pomf

        public PomfUploader PomfUploader { get; set; } = new PomfUploader();

        #endregion Pomf

        #region s-ul

        [JsonEncrypt]
        public string SulAPIKey { get; set; } = "";

        #endregion s-ul

        #region Seafile

        public string SeafileAPIURL { get; set; } = "";
        [JsonEncrypt]
        public string SeafileAuthToken { get; set; } = "";
        public string SeafileRepoID { get; set; } = "";
        public string SeafilePath { get; set; } = "/";
        public bool SeafileIsLibraryEncrypted { get; set; } = false;
        [JsonEncrypt]
        public string SeafileEncryptedLibraryPassword { get; set; } = "";
        public bool SeafileCreateShareableURL { get; set; } = true;
        public bool SeafileCreateShareableURLRaw { get; set; } = false;
        public int SeafileShareDaysToExpire { get; set; } = 0;
        [JsonEncrypt]
        public string SeafileSharePassword { get; set; } = "";
        public string SeafileAccInfoEmail { get; set; } = "";
        public string SeafileAccInfoUsage { get; set; } = "";

        #endregion Seafile

        #region Streamable

        public string StreamableUsername { get; set; } = "";
        [JsonEncrypt]
        public string StreamablePassword { get; set; } = "";
        public bool StreamableUseDirectURL { get; set; } = false;

        #endregion Streamable

        #region Azure Storage

        public string AzureStorageAccountName { get; set; } = "";
        [JsonEncrypt]
        public string AzureStorageAccountAccessKey { get; set; } = "";
        public string AzureStorageContainer { get; set; } = "";
        public string AzureStorageEnvironment { get; set; } = "blob.core.windows.net";
        public string AzureStorageCustomDomain { get; set; } = "";
        public string AzureStorageUploadPath { get; set; } = "";
        public string AzureStorageCacheControl { get; set; } = "";

        #endregion Azure Storage

        #region Backblaze B2

        public string B2ApplicationKeyId { get; set; } = "";
        [JsonEncrypt]
        public string B2ApplicationKey { get; set; } = "";
        public string B2BucketName { get; set; } = "";
        public string B2UploadPath { get; set; } = "ShareX/%y/%mo";
        public bool B2UseCustomUrl { get; set; } = false;
        public string B2CustomUrl { get; set; } = "https://example.com";

        #endregion Backblaze B2

        #region Plik

        public PlikSettings PlikSettings { get; set; } = new PlikSettings();

        #endregion Plik

        #region YouTube

        public OAuth2Info YouTubeOAuth2Info { get; set; } = null;
        public OAuthUserInfo YouTubeUserInfo { get; set; } = null;
        public YouTubeVideoPrivacy YouTubePrivacyType { get; set; } = YouTubeVideoPrivacy.Public;
        public bool YouTubeUseShortenedLink { get; set; } = false;
        public bool YouTubeShowDialog { get; set; } = false;

        #endregion YouTube

        #region Google Cloud Storage

        public OAuth2Info GoogleCloudStorageOAuth2Info { get; set; } = null;
        public OAuthUserInfo GoogleCloudStorageUserInfo { get; set; } = null;
        public string GoogleCloudStorageBucket { get; set; } = "";
        public string GoogleCloudStorageDomain { get; set; } = "";
        public string GoogleCloudStorageObjectPrefix { get; set; } = "ShareX/%y/%mo";
        public bool GoogleCloudStorageRemoveExtensionImage { get; set; } = false;
        public bool GoogleCloudStorageRemoveExtensionVideo { get; set; } = false;
        public bool GoogleCloudStorageRemoveExtensionText { get; set; } = false;
        public bool GoogleCloudStorageSetPublicACL { get; set; } = true;

        #endregion Google Cloud Storage

        #endregion File uploaders

        #region URL shorteners

        #region bit.ly

        public OAuth2Info BitlyOAuth2Info { get; set; } = null;
        public string BitlyDomain { get; set; } = "";

        #endregion bit.ly

        #region yourls.org

        public string YourlsAPIURL { get; set; } = "http://yoursite.com/yourls-api.php";
        [JsonEncrypt]
        public string YourlsSignature { get; set; } = "";
        public string YourlsUsername { get; set; } = "";
        [JsonEncrypt]
        public string YourlsPassword { get; set; } = "";

        #endregion yourls.org

        #region polr

        public string PolrAPIHostname { get; set; } = "";
        [JsonEncrypt]
        public string PolrAPIKey { get; set; } = "";
        public bool PolrIsSecret { get; set; } = false;
        public bool PolrUseAPIv1 { get; set; } = false;

        #endregion polr

        #region Firebase Dynamic Links

        [JsonEncrypt]
        public string FirebaseWebAPIKey { get; set; } = "";
        public string FirebaseDynamicLinkDomain { get; set; } = "";
        public bool FirebaseIsShort { get; set; } = false;

        #endregion Firebase Dynamic Links

        #region Kutt

        public KuttSettings KuttSettings { get; set; } = new KuttSettings();

        #endregion Kutt

        #region Zero Width Shortener

        public string ZeroWidthShortenerURL { get; set; } = "https://api.zws.im";
        public string ZeroWidthShortenerToken { get; set; } = "";

        #endregion

        #endregion URL shorteners

        #region Other uploaders

        #region Custom uploaders

        public List<CustomUploaderItem> CustomUploadersList { get; set; } = new List<CustomUploaderItem>();
        public int CustomImageUploaderSelected { get; set; } = 0;
        public int CustomTextUploaderSelected { get; set; } = 0;
        public int CustomFileUploaderSelected { get; set; } = 0;
        public int CustomURLShortenerSelected { get; set; } = 0;
        public int CustomURLSharingServiceSelected { get; set; } = 0;

        #endregion Custom uploaders

        #endregion Other uploaders
    }
}
```

--------------------------------------------------------------------------------

---[FILE: UploadersConfigValidator.cs]---
Location: ShareX-develop/ShareX.UploadersLib/UploadersConfigValidator.cs

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

using System;

namespace ShareX.UploadersLib
{
    public static class UploadersConfigValidator
    {
        public static bool Validate<T>(int index, UploadersConfig config)
        {
            Enum destination = (Enum)Enum.ToObject(typeof(T), index);

            switch (destination)
            {
                case ImageDestination imageDestination:
                    return Validate(imageDestination, config);
                case TextDestination textDestination:
                    return Validate(textDestination, config);
                case FileDestination fileDestination:
                    return Validate(fileDestination, config);
                case UrlShortenerType urlShortenerType:
                    return Validate(urlShortenerType, config);
                case URLSharingServices urlSharingServices:
                    return Validate(urlSharingServices, config);
            }

            return true;
        }

        public static bool Validate(ImageDestination destination, UploadersConfig config)
        {
            if (destination == ImageDestination.FileUploader) return true;
            return UploaderFactory.ImageUploaderServices[destination].CheckConfig(config);
        }

        public static bool Validate(TextDestination destination, UploadersConfig config)
        {
            if (destination == TextDestination.FileUploader) return true;
            return UploaderFactory.TextUploaderServices[destination].CheckConfig(config);
        }

        public static bool Validate(FileDestination destination, UploadersConfig config)
        {
            return UploaderFactory.FileUploaderServices[destination].CheckConfig(config);
        }

        public static bool Validate(UrlShortenerType destination, UploadersConfig config)
        {
            return UploaderFactory.URLShortenerServices[destination].CheckConfig(config);
        }

        public static bool Validate(URLSharingServices destination, UploadersConfig config)
        {
            return UploaderFactory.URLSharingServices[destination].CheckConfig(config);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: UploadResult.cs]---
Location: ShareX-develop/ShareX.UploadersLib/UploadResult.cs

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
using System.Text;

namespace ShareX.UploadersLib
{
    public class UploadResult
    {
        public string URL { get; set; }
        public string ThumbnailURL { get; set; }
        public string DeletionURL { get; set; }
        public string ShortenedURL { get; set; }

        private bool isSuccess;

        public bool IsSuccess
        {
            get
            {
                return isSuccess && !string.IsNullOrEmpty(Response);
            }
            set
            {
                isSuccess = value;
            }
        }

        public string Response { get; set; }
        public UploaderErrorManager Errors { get; set; }
        public bool IsURLExpected { get; set; }

        public bool IsError
        {
            get
            {
                return Errors != null && Errors.Count > 0 && (!IsURLExpected || string.IsNullOrEmpty(URL));
            }
        }

        public ResponseInfo ResponseInfo { get; set; }

        public UploadResult()
        {
            Errors = new UploaderErrorManager();
            IsURLExpected = true;
        }

        public UploadResult(string source, string url = null) : this()
        {
            Response = source;
            URL = url;
        }

        public void ForceHTTPS()
        {
            URL = URLHelpers.ForcePrefix(URL);
            ThumbnailURL = URLHelpers.ForcePrefix(ThumbnailURL);
            DeletionURL = URLHelpers.ForcePrefix(DeletionURL);
            ShortenedURL = URLHelpers.ForcePrefix(ShortenedURL);
        }

        public override string ToString()
        {
            if (!string.IsNullOrEmpty(ShortenedURL))
            {
                return ShortenedURL;
            }

            if (!string.IsNullOrEmpty(URL))
            {
                return URL;
            }

            return "";
        }

        public string ErrorsToString()
        {
            if (IsError)
            {
                return Errors.ToString();
            }

            return null;
        }

        public string ToSummaryString()
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("URL: " + URL);
            sb.AppendLine("Thumbnail URL: " + ThumbnailURL);
            sb.AppendLine("Shortened URL: " + ShortenedURL);
            sb.AppendLine("Deletion URL: " + DeletionURL);
            return sb.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

````
