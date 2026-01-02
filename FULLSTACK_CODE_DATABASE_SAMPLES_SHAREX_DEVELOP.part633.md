---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:48Z
part: 633
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 633 of 650)

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

---[FILE: ImageShackUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/ImageUploaders/ImageShackUploader.cs

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
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX.UploadersLib.ImageUploaders
{
    public class ImageShackImageUploaderService : ImageUploaderService
    {
        public override ImageDestination EnumValue { get; } = ImageDestination.ImageShack;

        public override Icon ServiceIcon => Resources.ImageShack;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.ImageShackSettings != null && !string.IsNullOrEmpty(config.ImageShackSettings.Auth_token);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new ImageShackUploader(APIKeys.ImageShackKey, config.ImageShackSettings);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpImageShack;
    }

    public sealed class ImageShackUploader : ImageUploader
    {
        private const string URLAPI = "https://api.imageshack.com/v2/";
        private const string URLAccessToken = URLAPI + "user/login";
        private const string URLUpload = URLAPI + "images";

        public ImageShackOptions Config { get; set; }

        private string APIKey;

        public ImageShackUploader(string developerKey, ImageShackOptions config)
        {
            APIKey = developerKey;
            Config = config;
        }

        public bool GetAccessToken()
        {
            if (!string.IsNullOrEmpty(Config.Username) && !string.IsNullOrEmpty(Config.Password))
            {
                Dictionary<string, string> args = new Dictionary<string, string>();
                args.Add("user", Config.Username);
                args.Add("password", Config.Password);

                string response = SendRequestMultiPart(URLAccessToken, args);

                if (!string.IsNullOrEmpty(response))
                {
                    ImageShackLoginResponse resp = JsonConvert.DeserializeObject<ImageShackLoginResponse>(response);

                    if (resp != null && resp.result != null && !string.IsNullOrEmpty(resp.result.auth_token))
                    {
                        Config.Auth_token = resp.result.auth_token;
                        return true;
                    }
                }
            }

            return false;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            Dictionary<string, string> arguments = new Dictionary<string, string>();
            arguments.Add("api_key", APIKey);
            arguments.Add("auth_token", Config.Auth_token);
            arguments.Add("public", Config.IsPublic ? "y" : "n");

            UploadResult result = SendRequestFile(URLUpload, stream, fileName, "file", arguments);

            if (!string.IsNullOrEmpty(result.Response))
            {
                JToken jsonResponse = JToken.Parse(result.Response);

                if (jsonResponse != null)
                {
                    bool isSuccess = jsonResponse["success"].Value<bool>();

                    if (isSuccess)
                    {
                        ImageShackUploadResult uploadResult = jsonResponse["result"].ToObject<ImageShackUploadResult>();

                        if (uploadResult != null && uploadResult.images.Count > 0)
                        {
                            ImageShackImage image = uploadResult.images[0];
                            result.URL = string.Format("https://imagizer.imageshack.com/a/img{0}/{1}/{2}", image.server, image.bucket, image.filename);
                            result.ThumbnailURL = string.Format("https://imagizer.imageshack.us/v2/{0}x{1}q90/{2}/{3}",
                                Config.ThumbnailWidth, Config.ThumbnailHeight, image.server, image.filename);
                        }
                    }
                    else
                    {
                        ImageShackErrorInfo errorInfo = jsonResponse["error"].ToObject<ImageShackErrorInfo>();
                        Errors.Add(errorInfo.ToString());
                    }
                }
            }

            return result;
        }

        public class ImageShackErrorInfo
        {
            public int error_code { get; set; }
            public string error_message { get; set; }

            public override string ToString()
            {
                return string.Format("Error message: {0}\r\nError code: {1}", error_message, error_code);
            }
        }

        public class ImageShackLoginResponse
        {
            public bool success { get; set; }
            public int process_time { get; set; }
            public ImageShackLogin result { get; set; }
        }

        public class ImageShackLogin
        {
            public string auth_token { get; set; }
            public int user_id { get; set; }
            public string email { get; set; }
            public string username { get; set; }
            public ImageShackeUserAvatar avatar { get; set; }
            public string membership { get; set; }
            public string membership_item_number { get; set; }
            public string membership_cookie { get; set; }
        }

        public class ImageShackUser
        {
            public bool is_owner { get; set; }
            public int cache_version { get; set; }
            public string username { get; set; }
            public string description { get; set; }
            public int creation_date { get; set; }
            public string location { get; set; }
            public string first_name { get; set; }
            public string last_name { get; set; }
            public ImageShackeUserAvatar Avatar { get; set; }
        }

        public class ImageShackeUserAvatar
        {
            public int image_id { get; set; }
            public int server { get; set; }
            public string filename { get; set; }
        }

        public class ImageShackUploadResponse
        {
            public bool success { get; set; }
            public int process_time { get; set; }
            public ImageShackUploadResult result { get; set; }
        }

        public class ImageShackUploadResult
        {
            public int max_filesize { get; set; }
            public int space_limit { get; set; }
            public int space_used { get; set; }
            public int space_left { get; set; }
            public int passed { get; set; }
            public int failed { get; set; }
            public int total { get; set; }
            public List<ImageShackImage> images { get; set; }
        }

        public class ImageShackImage
        {
            public string id { get; set; }
            public int server { get; set; }
            public int bucket { get; set; }
            public string lp_hash { get; set; }
            public string filename { get; set; }
            public string original_filename { get; set; }
            public string direct_link { get; set; }
            public object title { get; set; }
            public object description { get; set; }
            public List<string> tags { get; set; }
            public int likes { get; set; }
            public bool liked { get; set; }
            public int views { get; set; }
            public int comments_count { get; set; }
            public bool comments_disabled { get; set; }
            public int filter { get; set; }
            public int filesize { get; set; }
            public int creation_date { get; set; }
            public int width { get; set; }
            public int height { get; set; }
            public bool @public { get; set; }
            public bool is_owner { get; set; }
            public ImageShackUser owner { get; set; }
            public List<ImageShackImage> next_images { get; set; }
            public List<ImageShackImage> prev_images { get; set; }
            public object related_images { get; set; }
        }
    }

    public class ImageShackOptions
    {
        public string Username { get; set; }
        [JsonEncrypt]
        public string Password { get; set; }
        public bool IsPublic { get; set; }
        public string Auth_token { get; set; }
        public int ThumbnailWidth { get; set; } = 256;
        public int ThumbnailHeight { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Img1Uploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/ImageUploaders/Img1Uploader.cs

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

using System.IO;

namespace ShareX.UploadersLib.ImageUploaders
{
    public sealed class Img1Uploader : ImageUploader
    {
        private const string uploadURL = "http://img1.us/?app";

        public override UploadResult Upload(Stream stream, string fileName)
        {
            UploadResult result = SendRequestFile(uploadURL, stream, fileName, "fileup");

            if (result.IsSuccess)
            {
                string lastLine = result.Response.Remove(0, result.Response.LastIndexOf('\n') + 1).Trim();
                result.URL = lastLine;
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Imgur.cs]---
Location: ShareX-develop/ShareX.UploadersLib/ImageUploaders/Imgur.cs

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

namespace ShareX.UploadersLib.ImageUploaders
{
    public enum ImgurThumbnailType // Localized
    {
        Small_Square,
        Big_Square,
        Small_Thumbnail,
        Medium_Thumbnail,
        Large_Thumbnail,
        Huge_Thumbnail
    }

    public class ImgurImageUploaderService : ImageUploaderService
    {
        public override ImageDestination EnumValue { get; } = ImageDestination.Imgur;

        public override Icon ServiceIcon => Resources.Imgur;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.ImgurAccountType == AccountType.Anonymous || OAuth2Info.CheckOAuth(config.ImgurOAuth2Info);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            if (config.ImgurOAuth2Info == null)
            {
                config.ImgurOAuth2Info = new OAuth2Info(APIKeys.ImgurClientID, APIKeys.ImgurClientSecret);
            }

            string albumID = null;

            if (config.ImgurUploadSelectedAlbum && config.ImgurSelectedAlbum != null)
            {
                albumID = config.ImgurSelectedAlbum.id;
            }

            return new Imgur(config.ImgurOAuth2Info)
            {
                UploadMethod = config.ImgurAccountType,
                DirectLink = config.ImgurDirectLink,
                ThumbnailType = config.ImgurThumbnailType,
                UseGIFV = config.ImgurUseGIFV,
                UploadAlbumID = albumID
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpImgur;
    }

    public sealed class Imgur : ImageUploader, IOAuth2
    {
        public AccountType UploadMethod { get; set; }
        public OAuth2Info AuthInfo { get; set; }
        public ImgurThumbnailType ThumbnailType { get; set; }
        public string UploadAlbumID { get; set; }
        public bool DirectLink { get; set; }
        public bool UseGIFV { get; set; }

        public Imgur(OAuth2Info oauth)
        {
            AuthInfo = oauth;
        }

        public string GetAuthorizationURL()
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("client_id", AuthInfo.Client_ID);
            args.Add("response_type", "pin");

            return URLHelpers.CreateQueryString("https://api.imgur.com/oauth2/authorize", args);
        }

        public bool GetAccessToken(string pin)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("client_id", AuthInfo.Client_ID);
            args.Add("client_secret", AuthInfo.Client_Secret);
            args.Add("grant_type", "pin");
            args.Add("pin", pin);

            string response = SendRequestMultiPart("https://api.imgur.com/oauth2/token", args);

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
                args.Add("refresh_token", AuthInfo.Token.refresh_token);
                args.Add("client_id", AuthInfo.Client_ID);
                args.Add("client_secret", AuthInfo.Client_Secret);
                args.Add("grant_type", "refresh_token");

                string response = SendRequestMultiPart("https://api.imgur.com/oauth2/token", args);

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
            }

            return false;
        }

        private NameValueCollection GetAuthHeaders()
        {
            NameValueCollection headers = new NameValueCollection();
            headers.Add("Authorization", "Bearer " + AuthInfo.Token.access_token);
            return headers;
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
                Errors.Add("Imgur login is required.");
                return false;
            }

            return true;
        }

        public List<ImgurAlbumData> GetAlbums(int maxPage = 10, int perPage = 100)
        {
            List<ImgurAlbumData> albums = new List<ImgurAlbumData>();

            for (int i = 0; i < maxPage; i++)
            {
                List<ImgurAlbumData> tempAlbums = GetAlbumsPage(i, perPage);

                if (tempAlbums != null && tempAlbums.Count > 0)
                {
                    albums.AddRange(tempAlbums);

                    if (tempAlbums.Count < perPage)
                    {
                        break;
                    }
                }
                else
                {
                    break;
                }
            }

            return albums;
        }

        private List<ImgurAlbumData> GetAlbumsPage(int page, int perPage)
        {
            if (CheckAuthorization())
            {
                Dictionary<string, string> args = new Dictionary<string, string>();
                args.Add("page", page.ToString()); // default: 0
                args.Add("perPage", perPage.ToString()); // default: 50, max: 100

                string response = SendRequest(HttpMethod.GET, "https://api.imgur.com/3/account/me/albums", args, GetAuthHeaders());

                ImgurResponse imgurResponse = JsonConvert.DeserializeObject<ImgurResponse>(response);

                if (imgurResponse != null)
                {
                    if (imgurResponse.success && imgurResponse.status == 200)
                    {
                        return ((JArray)imgurResponse.data).ToObject<List<ImgurAlbumData>>();
                    }
                    else
                    {
                        HandleErrors(imgurResponse);
                    }
                }
            }

            return null;
        }

        public List<ImgurImageData> GetAlbumImages(string albumID)
        {
            if (CheckAuthorization())
            {
                string response = SendRequest(HttpMethod.GET, $"https://api.imgur.com/3/album/{albumID}/images", headers: GetAuthHeaders());

                ImgurResponse imgurResponse = JsonConvert.DeserializeObject<ImgurResponse>(response);

                if (imgurResponse != null)
                {
                    if (imgurResponse.success && imgurResponse.status == 200)
                    {
                        return ((JArray)imgurResponse.data).ToObject<List<ImgurImageData>>();
                    }
                    else
                    {
                        HandleErrors(imgurResponse);
                    }
                }
            }

            return null;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            return InternalUpload(stream, fileName, true);
        }

        private UploadResult InternalUpload(Stream stream, string fileName, bool refreshTokenOnError)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            NameValueCollection headers;

            if (UploadMethod == AccountType.User)
            {
                if (!CheckAuthorization())
                {
                    return null;
                }

                if (!string.IsNullOrEmpty(UploadAlbumID))
                {
                    args.Add("album", UploadAlbumID);
                }

                headers = GetAuthHeaders();
            }
            else
            {
                headers = new NameValueCollection();
                headers.Add("Authorization", "Client-ID " + AuthInfo.Client_ID);
            }

            ReturnResponseOnError = true;

            string fileFormName;

            if (FileHelpers.IsVideoFile(fileName))
            {
                fileFormName = "video";
            }
            else
            {
                fileFormName = "image";
            }

            UploadResult result = SendRequestFile("https://api.imgur.com/3/upload", stream, fileName, fileFormName, args, headers);

            if (!string.IsNullOrEmpty(result.Response))
            {
                ImgurResponse imgurResponse = JsonConvert.DeserializeObject<ImgurResponse>(result.Response);

                if (imgurResponse != null)
                {
                    if (imgurResponse.success && imgurResponse.status == 200)
                    {
                        ImgurImageData imageData = ((JObject)imgurResponse.data).ToObject<ImgurImageData>();

                        if (imageData != null && !string.IsNullOrEmpty(imageData.link))
                        {
                            if (DirectLink)
                            {
                                if (UseGIFV && !string.IsNullOrEmpty(imageData.gifv))
                                {
                                    result.URL = imageData.gifv;
                                }
                                else
                                {
                                    // webm uploads returns link with dot at the end
                                    result.URL = imageData.link.TrimEnd('.');
                                }
                            }
                            else
                            {
                                result.URL = $"https://imgur.com/{imageData.id}";
                            }

                            string thumbnail = "";

                            switch (ThumbnailType)
                            {
                                case ImgurThumbnailType.Small_Square:
                                    thumbnail = "s";
                                    break;
                                case ImgurThumbnailType.Big_Square:
                                    thumbnail = "b";
                                    break;
                                case ImgurThumbnailType.Small_Thumbnail:
                                    thumbnail = "t";
                                    break;
                                case ImgurThumbnailType.Medium_Thumbnail:
                                    thumbnail = "m";
                                    break;
                                case ImgurThumbnailType.Large_Thumbnail:
                                    thumbnail = "l";
                                    break;
                                case ImgurThumbnailType.Huge_Thumbnail:
                                    thumbnail = "h";
                                    break;
                            }

                            result.ThumbnailURL = $"https://i.imgur.com/{imageData.id}{thumbnail}.jpg"; // Imgur thumbnails always jpg
                            result.DeletionURL = $"https://imgur.com/delete/{imageData.deletehash}";
                        }
                    }
                    else
                    {
                        ImgurErrorData errorData = ParseError(imgurResponse);

                        if (errorData != null)
                        {
                            if (UploadMethod == AccountType.User && refreshTokenOnError &&
                                ((string)errorData.error).Equals("The access token provided is invalid.", StringComparison.OrdinalIgnoreCase) &&
                                RefreshAccessToken())
                            {
                                DebugHelper.WriteLine("Imgur access token refreshed, reuploading image.");

                                return InternalUpload(stream, fileName, false);
                            }

                            Errors.AddFirst($"Imgur upload failed: ({imgurResponse.status}) {errorData.error}");
                        }
                    }
                }
            }

            return result;
        }

        private void HandleErrors(ImgurResponse response)
        {
            ImgurErrorData errorData = ParseError(response);

            if (errorData != null)
            {
                Errors.Add($"Status: {response.status}, Request: {errorData.request}, Error: {errorData.error}");
            }
        }

        private ImgurErrorData ParseError(ImgurResponse response)
        {
            ImgurErrorData errorData = ((JObject)response.data).ToObject<ImgurErrorData>();

            if (errorData != null && !(errorData.error is string))
            {
                errorData.error = ((JObject)errorData.error).ToObject<ImgurError>().message;
            }

            return errorData;
        }
    }

    internal class ImgurResponse
    {
        public object data { get; set; }
        public bool success { get; set; }
        public int status { get; set; }
    }

    internal class ImgurErrorData
    {
        public object error { get; set; }
        public string request { get; set; }
        public string method { get; set; }
    }

    internal class ImgurError
    {
        public int code { get; set; }
        public string message { get; set; }
        public string type { get; set; }
        //public string[] exception { get; set; }
    }

    public class ImgurImageData
    {
        public string id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public int datetime { get; set; }
        public string type { get; set; }
        public bool animated { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public int size { get; set; }
        public int views { get; set; }
        public long bandwidth { get; set; }
        public string deletehash { get; set; }
        public string name { get; set; }
        public string section { get; set; }
        public string link { get; set; }
        public string gifv { get; set; }
        public string mp4 { get; set; }
        public string webm { get; set; }
        public bool looping { get; set; }
        public bool favorite { get; set; }
        public bool? nsfw { get; set; }
        public string vote { get; set; }
        public string comment_preview { get; set; }
    }

    public class ImgurAlbumData
    {
        public string id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public int datetime { get; set; }
        public string cover { get; set; }
        public string cover_width { get; set; }
        public string cover_height { get; set; }
        public string account_url { get; set; }
        public long? account_id { get; set; }
        public string privacy { get; set; }
        public string layout { get; set; }
        public int views { get; set; }
        public string link { get; set; }
        public bool favorite { get; set; }
        public bool? nsfw { get; set; }
        public string section { get; set; }
        public int order { get; set; }
        public string deletehash { get; set; }
        public int images_count { get; set; }
        public ImgurImageData[] images { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImmioUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/ImageUploaders/ImmioUploader.cs

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
using System.IO;

namespace ShareX.UploadersLib.ImageUploaders
{
    public sealed class ImmioUploader : ImageUploader
    {
        public override UploadResult Upload(Stream stream, string fileName)
        {
            UploadResult result = SendRequestFile("http://imm.io/store/", stream, fileName, "image");
            if (result.IsSuccess)
            {
                ImmioResponse response = JsonConvert.DeserializeObject<ImmioResponse>(result.Response);
                if (response != null) result.URL = response.Payload.Uri;
            }
            return result;
        }

        private class ImmioResponse
        {
            public bool Success { get; set; }
            public ImmioPayload Payload { get; set; }
        }

        private class ImmioPayload
        {
            public string Uid { get; set; }
            public string Uri { get; set; }
            public string Link { get; set; }
            public string Name { get; set; }
            public string Format { get; set; }
            public string Ext { get; set; }
            public int Width { get; set; }
            public int Height { get; set; }
            public string Size { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Photobucket.cs]---
Location: ShareX-develop/ShareX.UploadersLib/ImageUploaders/Photobucket.cs

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
using System.Collections.Specialized;
using System.Drawing;
using System.IO;
using System.Windows.Forms;
using System.Xml.Linq;

namespace ShareX.UploadersLib.ImageUploaders
{
    public class PhotobucketImageUploaderService : ImageUploaderService
    {
        public override ImageDestination EnumValue { get; } = ImageDestination.Photobucket;

        public override Icon ServiceIcon => Resources.Photobucket;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.PhotobucketAccountInfo != null && OAuthInfo.CheckOAuth(config.PhotobucketOAuthInfo);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Photobucket(config.PhotobucketOAuthInfo, config.PhotobucketAccountInfo);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpPhotobucket;
    }

    public sealed class Photobucket : ImageUploader, IOAuth
    {
        private const string URLRequestToken = "http://api.photobucket.com/login/request";
        private const string URLAuthorize = "http://photobucket.com/apilogin/login";
        private const string URLAccessToken = "http://api.photobucket.com/login/access";

        public OAuthInfo AuthInfo { get; set; }
        public PhotobucketAccountInfo AccountInfo { get; set; }

        public Photobucket(OAuthInfo oauth)
        {
            AuthInfo = oauth;
            AccountInfo = new PhotobucketAccountInfo();
        }

        public Photobucket(OAuthInfo oauth, PhotobucketAccountInfo accountInfo)
        {
            AuthInfo = oauth;
            AccountInfo = accountInfo;
        }

        public string GetAuthorizationURL()
        {
            return GetAuthorizationURL(URLRequestToken, URLAuthorize, AuthInfo, null, HttpMethod.POST);
        }

        public bool GetAccessToken(string verificationCode)
        {
            AuthInfo.AuthVerifier = verificationCode;

            NameValueCollection nv = GetAccessTokenEx(URLAccessToken, AuthInfo, HttpMethod.POST);

            if (nv != null)
            {
                AccountInfo.Subdomain = nv["subdomain"];
                AccountInfo.AlbumID = nv["username"];
                return !string.IsNullOrEmpty(AccountInfo.Subdomain);
            }

            return false;
        }

        public PhotobucketAccountInfo GetAccountInfo()
        {
            return AccountInfo;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            return UploadMedia(stream, fileName, AccountInfo.ActiveAlbumPath);
        }

        public UploadResult UploadMedia(Stream stream, string fileName, string albumID)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("id", albumID); // Album identifier.
            args.Add("type", "image"); // Media type. Options are image, video, or base64.

            /*
            // Optional
            args.Add("title", ""); // Searchable title to set on the media. Maximum 250 characters.
            args.Add("description", ""); // Searchable description to set on the media. Maximum 2048 characters.
            args.Add("scramble", "false"); // Indicates if the filename should be scrambled. Options are true or false.
            args.Add("degrees", ""); // Degrees of rotation in 90 degree increments.
            args.Add("size", ""); // Size to resize an image to. (Images can only be made smaller.)
            */

            string url = "http://api.photobucket.com/album/!/upload";
            string query = OAuthManager.GenerateQuery(url, args, HttpMethod.POST, AuthInfo);
            query = FixURL(query);

            UploadResult result = SendRequestFile(query, stream, fileName, "uploadfile");

            if (result.IsSuccess)
            {
                XDocument xd = XDocument.Parse(result.Response);
                XElement xe;

                if ((xe = xd.GetNode("response/content")) != null)
                {
                    result.URL = xe.GetElementValue("url");
                    result.ThumbnailURL = xe.GetElementValue("thumb");
                }
            }

            return result;
        }

        public bool CreateAlbum(string albumID, string albumName)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("id", albumID); // Album identifier.
            args.Add("name", albumName); // Name of result. Must be between 2 and 50 characters. Valid characters are letters, numbers, underscore ( _ ), hyphen (-), and space.

            string url = "http://api.photobucket.com/album/!";
            string query = OAuthManager.GenerateQuery(url, args, HttpMethod.POST, AuthInfo);
            query = FixURL(query);

            string response = SendRequestMultiPart(query, args);

            if (!string.IsNullOrEmpty(response))
            {
                XDocument xd = XDocument.Parse(response);
                XElement xe;

                if ((xe = xd.GetNode("response")) != null)
                {
                    string status = xe.GetElementValue("status");

                    return !string.IsNullOrEmpty(status) && status == "OK";
                }
            }

            return false;
        }

        private string FixURL(string url)
        {
            return url.Replace("api.photobucket.com", AccountInfo.Subdomain);
        }
    }

    public class PhotobucketAccountInfo
    {
        public string Subdomain { get; set; }

        public string AlbumID { get; set; }

        public List<string> AlbumList = new List<string>();
        public int ActiveAlbumID = 0;

        public string ActiveAlbumPath
        {
            get
            {
                return AlbumList[ActiveAlbumID];
            }
        }
    }
}
```

--------------------------------------------------------------------------------

````
