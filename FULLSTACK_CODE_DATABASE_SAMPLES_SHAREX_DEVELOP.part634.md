---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:48Z
part: 634
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 634 of 650)

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

---[FILE: UploadScreenshot.cs]---
Location: ShareX-develop/ShareX.UploadersLib/ImageUploaders/UploadScreenshot.cs

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
using System.IO;
using System.Xml.Linq;

namespace ShareX.UploadersLib.ImageUploaders
{
    public class UploadScreenshot : ImageUploader
    {
        private string APIKey { get; set; }

        public UploadScreenshot(string key)
        {
            APIKey = key;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            Dictionary<string, string> arguments = new Dictionary<string, string>();
            arguments.Add("apiKey", APIKey);
            arguments.Add("xmlOutput", "1");
            //arguments.Add("testMode", "1");

            UploadResult result = SendRequestFile("http://img1.uploadscreenshot.com/api-upload.php", stream, fileName, "userfile", arguments);

            return ParseResult(result);
        }

        private UploadResult ParseResult(UploadResult result)
        {
            if (result.IsSuccess)
            {
                XDocument xdoc = XDocument.Parse(result.Response);
                XElement xele = xdoc.Root.Element("upload");

                string error = xele.GetElementValue("errorCode");
                if (!string.IsNullOrEmpty(error))
                {
                    string errorMessage;

                    switch (error)
                    {
                        case "1":
                            errorMessage = "The MD5 sum that you provided did not match the MD5 sum that we calculated for the uploaded image file." +
                                           " There may of been a network interruption during upload. Suggest that you try the upload again.";
                            break;
                        case "2":
                            errorMessage = "The apiKey that you provided does not exist or has been banned. Please contact us for more information.";
                            break;
                        case "3":
                            errorMessage = "The file that you provided was not a png or jpg.";
                            break;
                        case "4":
                            errorMessage = "The file that you provided was too large, currently the limit per file is 50MB.";
                            break;
                        case "99":
                        default:
                            errorMessage = "An unkown error occured, please contact the admin and include a copy of the file that you were trying to upload.";
                            break;
                    }

                    Errors.Add(errorMessage);
                }
                else
                {
                    result.URL = xele.GetElementValue("original");
                    result.ThumbnailURL = xele.GetElementValue("small");
                    result.DeletionURL = xele.GetElementValue("deleteurl");
                }
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: VgymeUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/ImageUploaders/VgymeUploader.cs

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
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX.UploadersLib.ImageUploaders
{
    public class VgymeImageUploaderService : ImageUploaderService
    {
        public override ImageDestination EnumValue { get; } = ImageDestination.Vgyme;

        public override Icon ServiceIcon => Resources.Vgyme;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new VgymeUploader()
            {
                UserKey = config.VgymeUserKey
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpVgyme;
    }

    public sealed class VgymeUploader : ImageUploader
    {
        public string UserKey { get; set; }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            if (!string.IsNullOrEmpty(UserKey)) args.Add("userkey", UserKey);

            UploadResult result = SendRequestFile("https://vgy.me/upload", stream, fileName, "file", args);

            if (result.IsSuccess)
            {
                VgymeResponse response = JsonConvert.DeserializeObject<VgymeResponse>(result.Response);

                if (response != null && !response.Error)
                {
                    result.URL = response.Image;
                    result.DeletionURL = response.Delete;
                }
            }

            return result;
        }

        private class VgymeResponse
        {
            public bool Error { get; set; }
            public string URL { get; set; }
            public string Image { get; set; }
            public long Size { get; set; }
            public string Filename { get; set; }
            public string Ext { get; set; }
            public string Delete { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: GoogleOAuth2.cs]---
Location: ShareX-develop/ShareX.UploadersLib/OAuth/GoogleOAuth2.cs

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

namespace ShareX.UploadersLib
{
    public class GoogleOAuth2 : IOAuth2Loopback
    {
        private const string AuthorizationEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
        private const string TokenEndpoint = "https://oauth2.googleapis.com/token";
        private const string UserInfoEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo";

        public OAuth2Info AuthInfo { get; private set; }
        private Uploader GoogleUploader { get; set; }
        public string RedirectURI { get; set; }
        public string State { get; set; }
        public string Scope { get; set; }

        public GoogleOAuth2(OAuth2Info oauth, Uploader uploader)
        {
            AuthInfo = oauth;
            GoogleUploader = uploader;
        }

        public string GetAuthorizationURL()
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("response_type", "code");
            args.Add("client_id", AuthInfo.Client_ID);
            args.Add("redirect_uri", RedirectURI);
            args.Add("state", State);
            args.Add("scope", Scope);

            return URLHelpers.CreateQueryString(AuthorizationEndpoint, args);
        }

        public bool GetAccessToken(string code)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("code", code);
            args.Add("client_id", AuthInfo.Client_ID);
            args.Add("client_secret", AuthInfo.Client_Secret);
            args.Add("redirect_uri", RedirectURI);
            args.Add("grant_type", "authorization_code");

            string response = GoogleUploader.SendRequestURLEncoded(HttpMethod.POST, TokenEndpoint, args);

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

                string response = GoogleUploader.SendRequestURLEncoded(HttpMethod.POST, TokenEndpoint, args);

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
                    GoogleUploader.Errors.Add("Refresh access token failed.");
                    return false;
                }
            }
            else
            {
                GoogleUploader.Errors.Add("Login is required.");
                return false;
            }

            return true;
        }

        public NameValueCollection GetAuthHeaders()
        {
            NameValueCollection headers = new NameValueCollection();
            headers.Add("Authorization", "Bearer " + AuthInfo.Token.access_token);
            return headers;
        }

        public OAuthUserInfo GetUserInfo()
        {
            string response = GoogleUploader.SendRequest(HttpMethod.GET, UserInfoEndpoint, null, GetAuthHeaders());

            if (!string.IsNullOrEmpty(response))
            {
                return JsonConvert.DeserializeObject<OAuthUserInfo>(response);
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: IOAuth.cs]---
Location: ShareX-develop/ShareX.UploadersLib/OAuth/IOAuth.cs

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

namespace ShareX.UploadersLib
{
    public interface IOAuth : IOAuthBase
    {
        OAuthInfo AuthInfo { get; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: IOAuth2.cs]---
Location: ShareX-develop/ShareX.UploadersLib/OAuth/IOAuth2.cs

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

namespace ShareX.UploadersLib
{
    public interface IOAuth2 : IOAuth2Basic
    {
        bool RefreshAccessToken();

        bool CheckAuthorization();
    }
}
```

--------------------------------------------------------------------------------

---[FILE: IOAuth2Basic.cs]---
Location: ShareX-develop/ShareX.UploadersLib/OAuth/IOAuth2Basic.cs

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

namespace ShareX.UploadersLib
{
    public interface IOAuth2Basic : IOAuthBase
    {
        OAuth2Info AuthInfo { get; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: IOauth2Loopback.cs]---
Location: ShareX-develop/ShareX.UploadersLib/OAuth/IOauth2Loopback.cs

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

namespace ShareX.UploadersLib
{
    public interface IOAuth2Loopback : IOAuth2
    {
        OAuthUserInfo GetUserInfo();

        string RedirectURI { get; set; }
        string State { get; set; }
        string Scope { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: IOAuthBase.cs]---
Location: ShareX-develop/ShareX.UploadersLib/OAuth/IOAuthBase.cs

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

namespace ShareX.UploadersLib
{
    public interface IOAuthBase
    {
        string GetAuthorizationURL();

        bool GetAccessToken(string code);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OAuth2Info.cs]---
Location: ShareX-develop/ShareX.UploadersLib/OAuth/OAuth2Info.cs

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

namespace ShareX.UploadersLib
{
    public class OAuth2Info
    {
        public string Client_ID { get; set; }
        public string Client_Secret { get; set; }
        public OAuth2Token Token { get; set; }
        public OAuth2ProofKey Proof { get; set; }

        public OAuth2Info(string client_id, string client_secret)
        {
            Client_ID = client_id;
            Client_Secret = client_secret;
        }

        public static bool CheckOAuth(OAuth2Info oauth)
        {
            return oauth != null && !string.IsNullOrEmpty(oauth.Client_ID) && !string.IsNullOrEmpty(oauth.Client_Secret) &&
                oauth.Token != null && !string.IsNullOrEmpty(oauth.Token.access_token);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OAuth2ProofKey.cs]---
Location: ShareX-develop/ShareX.UploadersLib/OAuth/OAuth2ProofKey.cs

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
using System.Security.Cryptography;
using System.Text;

namespace ShareX.UploadersLib
{
    public enum OAuth2ChallengeMethod
    {
        Plain, SHA256
    }

    public class OAuth2ProofKey
    {
        public string CodeVerifier { get; private set; }
        public string CodeChallenge { get; private set; }
        private OAuth2ChallengeMethod Method;
        public string ChallengeMethod
        {
            get
            {
                switch (Method)
                {
                    case OAuth2ChallengeMethod.Plain: return "plain";
                    case OAuth2ChallengeMethod.SHA256: return "S256";
                }
                return "";
            }
        }

        public OAuth2ProofKey(OAuth2ChallengeMethod method)
        {
            Method = method;

            byte[] buffer = new byte[32];

            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(buffer);
            }
            CodeVerifier = CleanBase64(buffer);
            CodeChallenge = CodeVerifier;

            if (Method == OAuth2ChallengeMethod.SHA256)
            {
                using (SHA256 sha = SHA256.Create())
                {
                    sha.ComputeHash(Encoding.UTF8.GetBytes(CodeVerifier));
                    CodeChallenge = CleanBase64(sha.Hash);
                }
            }
        }

        private string CleanBase64(byte[] buffer)
        {
            StringBuilder sb = new StringBuilder(Convert.ToBase64String(buffer));
            sb.Replace('+', '-');
            sb.Replace('/', '_');
            sb.Replace("=", "");
            return sb.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OAuth2Token.cs]---
Location: ShareX-develop/ShareX.UploadersLib/OAuth/OAuth2Token.cs

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
using System;

namespace ShareX.UploadersLib
{
    public class OAuth2Token
    {
        [JsonEncrypt]
        public string access_token { get; set; }
        [JsonEncrypt]
        public string refresh_token { get; set; }
        public int expires_in { get; set; }
        public string token_type { get; set; }
        public string scope { get; set; }

        public DateTime ExpireDate { get; set; }

        [JsonIgnore]
        public bool IsExpired
        {
            get
            {
                return ExpireDate == DateTime.MinValue || DateTime.UtcNow > ExpireDate;
            }
        }

        public void UpdateExpireDate()
        {
            ExpireDate = DateTime.UtcNow + TimeSpan.FromSeconds(expires_in - 10);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OAuthInfo.cs]---
Location: ShareX-develop/ShareX.UploadersLib/OAuth/OAuthInfo.cs

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
using System.ComponentModel;

namespace ShareX.UploadersLib
{
    public class OAuthInfo : ICloneable
    {
        public enum OAuthInfoSignatureMethod
        {
            HMAC_SHA1,
            RSA_SHA1
        }

        public string Description { get; set; }

        [Browsable(false)]
        public string OAuthVersion { get; set; }

        [Browsable(false)]
        public string ConsumerKey { get; set; }

        // Used for HMAC_SHA1 signature
        [Browsable(false)]
        public string ConsumerSecret { get; set; }

        // Used for RSA_SHA1 signature
        [Browsable(false)]
        public string ConsumerPrivateKey { get; set; }

        [Browsable(false)]
        public OAuthInfoSignatureMethod SignatureMethod { get; set; }

        [Browsable(false)]
        public string AuthToken { get; set; }

        [Browsable(false), JsonEncrypt]
        public string AuthSecret { get; set; }

        [JsonEncrypt, Description("Verification Code from the Authorization Page")]
        public string AuthVerifier { get; set; }

        [Browsable(false)]
        public string UserToken { get; set; }

        [Browsable(false), JsonEncrypt]
        public string UserSecret { get; set; }

        public OAuthInfo()
        {
            Description = Resources.OAuthInfo_OAuthInfo_New_account;
            OAuthVersion = "1.0";
        }

        public OAuthInfo(string consumerKey) : this()
        {
            ConsumerKey = consumerKey;
        }

        public OAuthInfo(string consumerKey, string consumerSecret) : this()
        {
            ConsumerKey = consumerKey;
            ConsumerSecret = consumerSecret;
        }

        public OAuthInfo(string consumerKey, string consumerSecret, string userToken, string userSecret) : this(consumerKey, consumerSecret)
        {
            UserToken = userToken;
            UserSecret = userSecret;
        }

        public static bool CheckOAuth(OAuthInfo oauth)
        {
            return oauth != null && !string.IsNullOrEmpty(oauth.ConsumerKey) &&
                ((oauth.SignatureMethod == OAuthInfoSignatureMethod.HMAC_SHA1 && !string.IsNullOrEmpty(oauth.ConsumerSecret)) ||
                (oauth.SignatureMethod == OAuthInfoSignatureMethod.RSA_SHA1 && !string.IsNullOrEmpty(oauth.ConsumerPrivateKey))) &&
                !string.IsNullOrEmpty(oauth.UserToken) && !string.IsNullOrEmpty(oauth.UserSecret);
        }

        public OAuthInfo Clone()
        {
            return MemberwiseClone() as OAuthInfo;
        }

        object ICloneable.Clone()
        {
            return Clone();
        }

        public override string ToString()
        {
            return Description;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OAuthListener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/OAuth/OAuthListener.cs

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
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace ShareX.UploadersLib
{
    public class OAuthListener : IDisposable
    {
        public IOAuth2Loopback OAuth { get; private set; }

        private HttpListener listener;

        public OAuthListener(IOAuth2Loopback oauth)
        {
            OAuth = oauth;
        }

        public void Dispose()
        {
            if (listener != null)
            {
                listener.Close();
                listener = null;
            }
        }

        public async Task<bool> ConnectAsync()
        {
            Dispose();

            IPAddress ip = IPAddress.Loopback;
            int port = WebHelpers.GetRandomUnusedPort();
            string redirectURI = string.Format($"http://{ip}:{port}/");
            string state = Helpers.GetRandomAlphanumeric(32);

            OAuth.RedirectURI = redirectURI;
            OAuth.State = state;
            string url = OAuth.GetAuthorizationURL();

            if (!string.IsNullOrEmpty(url))
            {
                URLHelpers.OpenURL(url);
                DebugHelper.WriteLine("Authorization URL is opened: " + url);
            }
            else
            {
                DebugHelper.WriteLine("Authorization URL is empty.");
                return false;
            }

            string queryCode = null;
            string queryState = null;

            try
            {
                listener = new HttpListener();
                listener.Prefixes.Add(redirectURI);
                listener.Start();

                HttpListenerContext context = await listener.GetContextAsync();
                queryCode = context.Request.QueryString.Get("code");
                queryState = context.Request.QueryString.Get("state");

                using (HttpListenerResponse response = context.Response)
                {
                    string status;

                    if (queryState != state)
                    {
                        status = "Invalid state parameter.";
                    }
                    else if (!string.IsNullOrEmpty(queryCode))
                    {
                        status = "Authorization completed successfully.";
                    }
                    else
                    {
                        status = "Authorization did not succeed.";
                    }

                    string responseText = Resources.OAuthCallbackPage.Replace("{0}", status);
                    byte[] buffer = Encoding.UTF8.GetBytes(responseText);
                    response.ContentLength64 = buffer.Length;
                    response.KeepAlive = false;

                    using (Stream responseOutput = response.OutputStream)
                    {
                        await responseOutput.WriteAsync(buffer, 0, buffer.Length);
                        await responseOutput.FlushAsync();
                    }
                }
            }
            catch (ObjectDisposedException)
            {
            }
            finally
            {
                Dispose();
            }

            if (queryState == state && !string.IsNullOrEmpty(queryCode))
            {
                return await Task.Run(() => OAuth.GetAccessToken(queryCode));
            }

            return false;
        }
    }
}
```

--------------------------------------------------------------------------------

````
