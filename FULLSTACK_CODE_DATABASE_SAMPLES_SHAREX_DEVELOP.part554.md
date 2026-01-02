---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 554
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 554 of 650)

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

---[FILE: CustomUploaderFunctionRandom.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunctionRandom.cs

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

namespace ShareX.UploadersLib
{
    // Example: {random:domain1.com|domain2.com}
    internal class CustomUploaderFunctionRandom : CustomUploaderFunction
    {
        public override string Name { get; } = "random";

        public override int MinParameterCount { get; } = 2;

        public override string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters)
        {
            return RandomFast.Pick(parameters);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomUploaderFunctionRegex.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunctionRegex.cs

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

using System.Text.RegularExpressions;

namespace ShareX.UploadersLib
{
    // Example: {regex:(?<=href=").+(?=")}
    // Example: {regex:href="(.+)"|1}
    // Example: {regex:href="(?<url>.+)"|url}
    // Example: {regex:{response}|href="(.+)"|1}
    internal class CustomUploaderFunctionRegex : CustomUploaderFunction
    {
        public override string Name { get; } = "regex";

        public override int MinParameterCount { get; } = 1;

        public override string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters)
        {
            string input, pattern, group = "";

            if (parameters.Length > 2)
            {
                // {regex:input|pattern|group}
                input = parameters[0];
                pattern = parameters[1];
                group = parameters[2];
            }
            else
            {
                // {regex:pattern}
                input = parser.ResponseInfo.ResponseText;
                pattern = parameters[0];

                if (parameters.Length > 1)
                {
                    // {regex:pattern|group}
                    group = parameters[1];
                }
            }

            if (!string.IsNullOrEmpty(input) && !string.IsNullOrEmpty(pattern))
            {
                Match match = Regex.Match(input, pattern);

                if (match.Success)
                {
                    if (!string.IsNullOrEmpty(group))
                    {
                        if (int.TryParse(group, out int groupNumber))
                        {
                            return match.Groups[groupNumber].Value;
                        }
                        else
                        {
                            return match.Groups[group].Value;
                        }
                    }

                    return match.Value;
                }
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomUploaderFunctionResponse.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunctionResponse.cs

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
    // Example: {response}
    internal class CustomUploaderFunctionResponse : CustomUploaderFunction
    {
        public override string Name { get; } = "response";

        public override string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters)
        {
            return parser.ResponseInfo.ResponseText;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomUploaderFunctionResponseURL.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunctionResponseURL.cs

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
    // Example: {responseurl}
    internal class CustomUploaderFunctionResponseURL : CustomUploaderFunction
    {
        public override string Name { get; } = "responseurl";

        public override string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters)
        {
            return parser.ResponseInfo.ResponseURL;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomUploaderFunctionSelect.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunctionSelect.cs

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

using System.Linq;

namespace ShareX.UploadersLib
{
    // Example: {select:domain1.com|domain2.com}
    internal class CustomUploaderFunctionSelect : CustomUploaderFunction
    {
        public override string Name { get; } = "select";

        public override int MinParameterCount { get; } = 1;

        public override string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters)
        {
            string[] values = parameters.Where(x => !string.IsNullOrEmpty(x)).ToArray();

            if (values.Length > 0)
            {
                using (ParserSelectForm form = new ParserSelectForm(values))
                {
                    form.ShowDialog();
                    return form.SelectedText;
                }
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomUploaderFunctionXml.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunctionXml.cs

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
using System.Xml.XPath;

namespace ShareX.UploadersLib
{
    // Example: {xml:/files/file[1]/url}
    // Example: {xml:{response}|/files/file[1]/url}
    internal class CustomUploaderFunctionXml : CustomUploaderFunction
    {
        public override string Name { get; } = "xml";

        public override int MinParameterCount { get; } = 1;

        public override string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters)
        {
            // https://www.w3schools.com/xml/xpath_syntax.asp
            string input, xpath;

            if (parameters.Length > 1)
            {
                // {xml:input|xpath}
                input = parameters[0];
                xpath = parameters[1];
            }
            else
            {
                // {xml:xpath}
                input = parser.ResponseInfo.ResponseText;
                xpath = parameters[0];
            }

            if (!string.IsNullOrEmpty(input) && !string.IsNullOrEmpty(xpath))
            {
                using (StringReader sr = new StringReader(input))
                {
                    XPathDocument doc = new XPathDocument(sr);
                    XPathNavigator nav = doc.CreateNavigator();
                    XPathNavigator node = nav.SelectSingleNode(xpath);

                    if (node != null)
                    {
                        return node.Value;
                    }
                }
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: AmazonS3.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/AmazonS3.cs

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
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public enum AmazonS3StorageClass
    {
        [Description("Amazon S3 Standard")]
        STANDARD,
        [Description("Amazon S3 Standard-Infrequent Access")]
        STANDARD_IA,
        [Description("Amazon S3 One Zone-Infrequent Access")]
        ONEZONE_IA,
        [Description("Amazon S3 Intelligent-Tiering")]
        INTELLIGENT_TIERING,
        //[Description("Amazon S3 Glacier")]
        //GLACIER,
        //[Description("Amazon S3 Glacier Deep Archive")]
        //DEEP_ARCHIVE
    }

    public class AmazonS3NewFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.AmazonS3;

        public override Icon ServiceIcon => Resources.AmazonS3;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.AmazonS3Settings != null && !string.IsNullOrEmpty(config.AmazonS3Settings.AccessKeyID) &&
                !string.IsNullOrEmpty(config.AmazonS3Settings.SecretAccessKey) && !string.IsNullOrEmpty(config.AmazonS3Settings.Endpoint) &&
                !string.IsNullOrEmpty(config.AmazonS3Settings.Bucket);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new AmazonS3(config.AmazonS3Settings);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpAmazonS3;
    }

    public sealed class AmazonS3 : FileUploader
    {
        private const string DefaultRegion = "us-east-1";

        // http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region
        public static List<AmazonS3Endpoint> Endpoints { get; } = new List<AmazonS3Endpoint>()
        {
            new AmazonS3Endpoint("Asia Pacific (Hong Kong)", "s3.ap-east-1.amazonaws.com", "ap-east-1"),
            new AmazonS3Endpoint("Asia Pacific (Mumbai)", "s3.ap-south-1.amazonaws.com", "ap-south-1"),
            new AmazonS3Endpoint("Asia Pacific (Seoul)", "s3.ap-northeast-2.amazonaws.com", "ap-northeast-2"),
            new AmazonS3Endpoint("Asia Pacific (Singapore)", "s3.ap-southeast-1.amazonaws.com", "ap-southeast-1"),
            new AmazonS3Endpoint("Asia Pacific (Sydney)", "s3.ap-southeast-2.amazonaws.com", "ap-southeast-2"),
            new AmazonS3Endpoint("Asia Pacific (Tokyo)", "s3.ap-northeast-1.amazonaws.com", "ap-northeast-1"),
            new AmazonS3Endpoint("Canada (Central)", "s3.ca-central-1.amazonaws.com", "ca-central-1"),
            new AmazonS3Endpoint("China (Beijing)", "s3.cn-north-1.amazonaws.com.cn", "cn-north-1"),
            new AmazonS3Endpoint("China (Ningxia)", "s3.cn-northwest-1.amazonaws.com.cn", "cn-northwest-1"),
            new AmazonS3Endpoint("EU (Frankfurt)", "s3.eu-central-1.amazonaws.com", "eu-central-1"),
            new AmazonS3Endpoint("EU (Ireland)", "s3.eu-west-1.amazonaws.com", "eu-west-1"),
            new AmazonS3Endpoint("EU (London)", "s3.eu-west-2.amazonaws.com", "eu-west-2"),
            new AmazonS3Endpoint("EU (Paris)", "s3.eu-west-3.amazonaws.com", "eu-west-3"),
            new AmazonS3Endpoint("EU (Stockholm)", "s3.eu-north-1.amazonaws.com", "eu-north-1"),
            new AmazonS3Endpoint("Middle East (Bahrain)", "s3.me-south-1.amazonaws.com", "me-south-1"),
            new AmazonS3Endpoint("South America (São Paulo)", "s3.sa-east-1.amazonaws.com", "sa-east-1"),
            new AmazonS3Endpoint("US East (N. Virginia)", "s3.amazonaws.com", "us-east-1"),
            new AmazonS3Endpoint("US East (Ohio)", "s3.us-east-2.amazonaws.com", "us-east-2"),
            new AmazonS3Endpoint("US West (N. California)", "s3.us-west-1.amazonaws.com", "us-west-1"),
            new AmazonS3Endpoint("US West (Oregon)", "s3.us-west-2.amazonaws.com", "us-west-2"),
            new AmazonS3Endpoint("DreamObjects", "objects-us-east-1.dream.io"),
            new AmazonS3Endpoint("DigitalOcean (Amsterdam)", "ams3.digitaloceanspaces.com", "ams3"),
            new AmazonS3Endpoint("DigitalOcean (New York)", "nyc3.digitaloceanspaces.com", "nyc3"),
            new AmazonS3Endpoint("DigitalOcean (San Francisco)", "sfo2.digitaloceanspaces.com", "sfo2"),
            new AmazonS3Endpoint("DigitalOcean (Singapore)", "sgp1.digitaloceanspaces.com", "sgp1"),
            new AmazonS3Endpoint("Wasabi", "s3.wasabisys.com")
        };

        private AmazonS3Settings Settings { get; set; }

        public AmazonS3(AmazonS3Settings settings)
        {
            Settings = settings;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            bool isPathStyleRequest = Settings.UsePathStyle;

            if (!isPathStyleRequest && Settings.Bucket.Contains("."))
            {
                isPathStyleRequest = true;
            }

            string scheme = URLHelpers.GetPrefix(Settings.Endpoint);
            string endpoint = URLHelpers.RemovePrefixes(Settings.Endpoint);
            string host = isPathStyleRequest ? endpoint : $"{Settings.Bucket}.{endpoint}";
            string algorithm = "AWS4-HMAC-SHA256";
            string credentialDate = DateTime.UtcNow.ToString("yyyyMMdd", CultureInfo.InvariantCulture);
            string region = GetRegion();
            string scope = URLHelpers.CombineURL(credentialDate, region, "s3", "aws4_request");
            string credential = URLHelpers.CombineURL(Settings.AccessKeyID, scope);
            string timeStamp = DateTime.UtcNow.ToString("yyyyMMddTHHmmssZ", CultureInfo.InvariantCulture);
            string contentType = MimeTypes.GetMimeTypeFromFileName(fileName);
            string hashedPayload;

            if (Settings.SignedPayload)
            {
                hashedPayload = Helpers.BytesToHex(Helpers.ComputeSHA256(stream));
            }
            else
            {
                hashedPayload = "UNSIGNED-PAYLOAD";
            }

            string uploadPath = GetUploadPath(fileName);
            string resultURL = GenerateURL(uploadPath);

            OnEarlyURLCopyRequested(resultURL);

            NameValueCollection headers = new NameValueCollection
            {
                ["Host"] = host,
                ["Content-Length"] = stream.Length.ToString(),
                ["Content-Type"] = contentType,
                ["x-amz-date"] = timeStamp,
                ["x-amz-content-sha256"] = hashedPayload,
                // If you don't specify, S3 Standard is the default storage class. Amazon S3 supports other storage classes.
                // Valid Values: STANDARD | REDUCED_REDUNDANCY | STANDARD_IA | ONEZONE_IA | INTELLIGENT_TIERING | GLACIER | DEEP_ARCHIVE
                // https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html
                ["x-amz-storage-class"] = Settings.StorageClass.ToString()
            };

            if (Settings.SetPublicACL)
            {
                // The canned ACL to apply to the object. For more information, see Canned ACL.
                // https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl
                headers["x-amz-acl"] = "public-read";
            }

            string canonicalURI = uploadPath;
            if (isPathStyleRequest) canonicalURI = URLHelpers.CombineURL(Settings.Bucket, canonicalURI);
            canonicalURI = URLHelpers.AddSlash(canonicalURI, SlashType.Prefix);
            canonicalURI = URLHelpers.URLEncode(canonicalURI, true);
            string canonicalQueryString = "";
            string canonicalHeaders = CreateCanonicalHeaders(headers);
            string signedHeaders = GetSignedHeaders(headers);

            string canonicalRequest = "PUT" + "\n" +
                canonicalURI + "\n" +
                canonicalQueryString + "\n" +
                canonicalHeaders + "\n" +
                signedHeaders + "\n" +
                hashedPayload;

            string stringToSign = algorithm + "\n" +
                timeStamp + "\n" +
                scope + "\n" +
                Helpers.BytesToHex(Helpers.ComputeSHA256(canonicalRequest));

            byte[] dateKey = Helpers.ComputeHMACSHA256(credentialDate, "AWS4" + Settings.SecretAccessKey);
            byte[] dateRegionKey = Helpers.ComputeHMACSHA256(region, dateKey);
            byte[] dateRegionServiceKey = Helpers.ComputeHMACSHA256("s3", dateRegionKey);
            byte[] signingKey = Helpers.ComputeHMACSHA256("aws4_request", dateRegionServiceKey);

            string signature = Helpers.BytesToHex(Helpers.ComputeHMACSHA256(stringToSign, signingKey));

            headers["Authorization"] = algorithm + " " +
                "Credential=" + credential + "," +
                "SignedHeaders=" + signedHeaders + "," +
                "Signature=" + signature;

            headers.Remove("Host");
            headers.Remove("Content-Type");

            string url = URLHelpers.CombineURL(scheme + host, canonicalURI);
            url = URLHelpers.FixPrefix(url);

            SendRequest(HttpMethod.PUT, url, stream, contentType, null, headers);

            if (LastResponseInfo != null && LastResponseInfo.IsSuccess)
            {
                return new UploadResult
                {
                    IsSuccess = true,
                    URL = resultURL
                };
            }

            Errors.Add("Upload to Amazon S3 failed.");
            return null;
        }

        private string GetRegion()
        {
            if (!string.IsNullOrEmpty(Settings.Region))
            {
                return Settings.Region;
            }

            string url = Settings.Endpoint;

            int delimIndex = url.IndexOf("//", StringComparison.Ordinal);
            if (delimIndex >= 0)
            {
                url = url.Substring(delimIndex + 2);
            }

            if (url.EndsWith("/", StringComparison.Ordinal))
            {
                url = url.Substring(0, url.Length - 1);
            }

            int awsIndex = url.IndexOf(".amazonaws.com", StringComparison.Ordinal);
            if (awsIndex < 0)
            {
                return DefaultRegion;
            }

            string serviceAndRegion = url.Substring(0, awsIndex);
            if (serviceAndRegion.StartsWith("s3-", StringComparison.Ordinal))
            {
                serviceAndRegion = "s3." + serviceAndRegion.Substring(3);
            }

            int separatorIndex = serviceAndRegion.LastIndexOf('.');
            if (separatorIndex == -1)
            {
                return DefaultRegion;
            }

            return serviceAndRegion.Substring(separatorIndex + 1);
        }

        private string GetUploadPath(string fileName)
        {
            string path = NameParser.Parse(NameParserType.FilePath, Settings.ObjectPrefix.Trim('/'));

            if ((Settings.RemoveExtensionImage && FileHelpers.IsImageFile(fileName)) ||
                (Settings.RemoveExtensionText && FileHelpers.IsTextFile(fileName)) ||
                (Settings.RemoveExtensionVideo && FileHelpers.IsVideoFile(fileName)))
            {
                fileName = Path.GetFileNameWithoutExtension(fileName);
            }

            return URLHelpers.CombineURL(path, fileName);
        }

        public string GenerateURL(string uploadPath)
        {
            if (!string.IsNullOrEmpty(Settings.Endpoint) && !string.IsNullOrEmpty(Settings.Bucket))
            {
                uploadPath = URLHelpers.URLEncode(uploadPath, true, HelpersOptions.URLEncodeIgnoreEmoji);

                string url;

                if (Settings.UseCustomCNAME && !string.IsNullOrEmpty(Settings.CustomDomain))
                {
                    ShareXCustomUploaderSyntaxParser parser = new ShareXCustomUploaderSyntaxParser();
                    string parsedDomain = parser.Parse(Settings.CustomDomain);
                    url = URLHelpers.CombineURL(parsedDomain, uploadPath);
                }
                else
                {
                    url = URLHelpers.CombineURL(Settings.Endpoint, Settings.Bucket, uploadPath);
                }

                return URLHelpers.FixPrefix(url);
            }

            return "";
        }

        public string GetPreviewURL()
        {
            string uploadPath = GetUploadPath("example.png");
            return GenerateURL(uploadPath);
        }

        private string CreateCanonicalHeaders(NameValueCollection headers)
        {
            return headers.AllKeys.OrderBy(key => key).Select(key => key.ToLowerInvariant() + ":" + headers[key].Trim() + "\n").
                Aggregate((result, next) => result + next);
        }

        private string GetSignedHeaders(NameValueCollection headers)
        {
            return string.Join(";", headers.AllKeys.OrderBy(key => key).Select(key => key.ToLowerInvariant()));
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: AmazonS3Endpoint.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/AmazonS3Endpoint.cs

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

namespace ShareX.UploadersLib.FileUploaders
{
    public class AmazonS3Endpoint
    {
        public string Name { get; set; }
        public string Endpoint { get; set; }
        public string Region { get; set; }

        public AmazonS3Endpoint(string name, string endpoint)
        {
            Name = name;
            Endpoint = endpoint;
        }

        public AmazonS3Endpoint(string name, string endpoint, string region)
        {
            Name = name;
            Endpoint = endpoint;
            Region = region;
        }

        public override string ToString()
        {
            return Name;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: AmazonS3Settings.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/AmazonS3Settings.cs

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
    public class AmazonS3Settings
    {
        public string AccessKeyID { get; set; }
        [JsonEncrypt]
        public string SecretAccessKey { get; set; }
        public string Endpoint { get; set; }
        public string Region { get; set; }
        public bool UsePathStyle { get; set; }
        public string Bucket { get; set; }
        public string ObjectPrefix { get; set; }
        public bool UseCustomCNAME { get; set; }
        public string CustomDomain { get; set; }
        public AmazonS3StorageClass StorageClass { get; set; }
        public bool SetPublicACL { get; set; } = true;
        public bool SignedPayload { get; set; }
        public bool RemoveExtensionImage { get; set; }
        public bool RemoveExtensionVideo { get; set; }
        public bool RemoveExtensionText { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: AzureStorage.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/AzureStorage.cs

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
using System.Collections.Specialized;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class AzureStorageUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.AzureStorage;

        public override Image ServiceImage => Resources.AzureStorage;

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.AzureStorageAccountName) &&
                !string.IsNullOrEmpty(config.AzureStorageAccountAccessKey) &&
                !string.IsNullOrEmpty(config.AzureStorageContainer);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new AzureStorage(config.AzureStorageAccountName, config.AzureStorageAccountAccessKey, config.AzureStorageContainer,
                config.AzureStorageEnvironment, config.AzureStorageCustomDomain, config.AzureStorageUploadPath, config.AzureStorageCacheControl);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpAzureStorage;
    }

    public sealed class AzureStorage : FileUploader
    {
        private const string APIVersion = "2016-05-31";

        public string AzureStorageAccountName { get; private set; }
        public string AzureStorageAccountAccessKey { get; private set; }
        public string AzureStorageContainer { get; private set; }
        public string AzureStorageEnvironment { get; private set; }
        public string AzureStorageCustomDomain { get; private set; }
        public string AzureStorageUploadPath { get; private set; }
        public string AzureStorageCacheControl { get; private set; }

        public AzureStorage(string azureStorageAccountName, string azureStorageAccessKey, string azureStorageContainer, string azureStorageEnvironment,
            string customDomain, string uploadPath, string cacheControl)
        {
            AzureStorageAccountName = azureStorageAccountName;
            AzureStorageAccountAccessKey = azureStorageAccessKey;
            AzureStorageContainer = azureStorageContainer;
            AzureStorageEnvironment = (!string.IsNullOrEmpty(azureStorageEnvironment)) ? azureStorageEnvironment : "blob.core.windows.net";
            AzureStorageCustomDomain = customDomain;
            AzureStorageUploadPath = uploadPath;
            AzureStorageCacheControl = cacheControl;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            if (string.IsNullOrEmpty(AzureStorageAccountName)) Errors.Add("'Account Name' must not be empty");
            if (string.IsNullOrEmpty(AzureStorageAccountAccessKey)) Errors.Add("'Access key' must not be empty");
            if (string.IsNullOrEmpty(AzureStorageContainer)) Errors.Add("'Container' must not be empty");

            if (IsError)
            {
                return null;
            }

            string date = DateTime.UtcNow.ToString("R", CultureInfo.InvariantCulture);
            string uploadPath = GetUploadPath(fileName);
            string requestURL = GenerateURL(uploadPath, true);
            string resultURL = GenerateURL(uploadPath);

            OnEarlyURLCopyRequested(resultURL);

            string contentType = MimeTypes.GetMimeTypeFromFileName(fileName);

            NameValueCollection requestHeaders = new NameValueCollection();
            requestHeaders["x-ms-date"] = date;
            requestHeaders["x-ms-version"] = APIVersion;
            requestHeaders["x-ms-blob-type"] = "BlockBlob";

            string canonicalizedHeaders = $"x-ms-blob-type:BlockBlob\nx-ms-date:{date}\nx-ms-version:{APIVersion}\n";

            if (!string.IsNullOrEmpty(AzureStorageCacheControl))
            {
                requestHeaders["x-ms-blob-cache-control"] = AzureStorageCacheControl;

                canonicalizedHeaders = $"x-ms-blob-cache-control:{AzureStorageCacheControl}\n{canonicalizedHeaders}";
            }

            string canonicalizedResource = $"/{AzureStorageAccountName}/{AzureStorageContainer}/{uploadPath}";
            string stringToSign = GenerateStringToSign(canonicalizedHeaders, canonicalizedResource, stream.Length.ToString(), contentType);

            requestHeaders["Authorization"] = $"SharedKey {AzureStorageAccountName}:{stringToSign}";

            SendRequest(HttpMethod.PUT, requestURL, stream, contentType, null, requestHeaders);

            if (LastResponseInfo != null && LastResponseInfo.IsSuccess)
            {
                return new UploadResult
                {
                    IsSuccess = true,
                    URL = resultURL
                };
            }

            Errors.Add("Upload failed.");
            return null;
        }

        private string GenerateStringToSign(string canonicalizedHeaders, string canonicalizedResource, string contentLength = "", string contentType = "")
        {
            string stringToSign = "PUT" + "\n" +
                "\n" +
                "\n" +
                (contentLength ?? "") + "\n" +
                "\n" +
                (contentType ?? "") + "\n" +
                "\n" +
                "\n" +
                "\n" +
                "\n" +
                "\n" +
                "\n" +
                canonicalizedHeaders +
                canonicalizedResource;

            return HashRequest(stringToSign);
        }

        private string HashRequest(string stringToSign)
        {
            string hashedString;

            using (HashAlgorithm hashAlgorithm = new HMACSHA256(Convert.FromBase64String(AzureStorageAccountAccessKey)))
            {
                byte[] messageBuffer = Encoding.UTF8.GetBytes(stringToSign);
                hashedString = Convert.ToBase64String(hashAlgorithm.ComputeHash(messageBuffer));
            }

            return hashedString;
        }

        private string GetUploadPath(string fileName)
        {
            string uploadPath;

            if (!string.IsNullOrEmpty(AzureStorageUploadPath))
            {
                string path = NameParser.Parse(NameParserType.FilePath, AzureStorageUploadPath.Trim('/'));
                uploadPath = URLHelpers.CombineURL(path, fileName);
            }
            else
            {
                uploadPath = fileName;
            }

            return Uri.EscapeDataString(uploadPath);
        }

        public string GenerateURL(string uploadPath, bool isRequest = false)
        {
            string url;

            if (!isRequest && !string.IsNullOrEmpty(AzureStorageCustomDomain))
            {
                url = URLHelpers.CombineURL(AzureStorageCustomDomain, uploadPath);
                url = URLHelpers.FixPrefix(url);
            }
            else if (!isRequest && AzureStorageContainer == "$root")
            {
                url = $"https://{AzureStorageAccountName}.{AzureStorageEnvironment}/{uploadPath}";
            }
            else
            {
                url = $"https://{AzureStorageAccountName}.{AzureStorageEnvironment}/{AzureStorageContainer}/{uploadPath}";
            }

            return url;
        }

        public string GetPreviewURL()
        {
            string uploadPath = GetUploadPath("example.png");
            return GenerateURL(uploadPath);
        }
    }
}
```

--------------------------------------------------------------------------------

````
