---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:48Z
part: 637
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 637 of 650)

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

---[FILE: OAuthManager.cs]---
Location: ShareX-develop/ShareX.UploadersLib/OAuth/OAuthManager.cs

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
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace ShareX.UploadersLib
{
    public static class OAuthManager
    {
        private const string ParameterConsumerKey = "oauth_consumer_key";
        private const string ParameterSignatureMethod = "oauth_signature_method";
        private const string ParameterSignature = "oauth_signature";
        private const string ParameterTimestamp = "oauth_timestamp";
        private const string ParameterNonce = "oauth_nonce";
        private const string ParameterVersion = "oauth_version";
        private const string ParameterToken = "oauth_token";
        private const string ParameterTokenSecret = "oauth_token_secret";
        private const string ParameterVerifier = "oauth_verifier";
        internal const string ParameterCallback = "oauth_callback";

        private const string PlainTextSignatureType = "PLAINTEXT";
        private const string HMACSHA1SignatureType = "HMAC-SHA1";
        private const string RSASHA1SignatureType = "RSA-SHA1";

        public static string GenerateQuery(string url, Dictionary<string, string> args, HttpMethod httpMethod, OAuthInfo oauth)
        {
            return GenerateQuery(url, args, httpMethod, oauth, out _);
        }

        public static string GenerateQuery(string url, Dictionary<string, string> args, HttpMethod httpMethod, OAuthInfo oauth, out Dictionary<string, string> parameters)
        {
            if (string.IsNullOrEmpty(oauth.ConsumerKey) ||
                (oauth.SignatureMethod == OAuthInfo.OAuthInfoSignatureMethod.HMAC_SHA1 && string.IsNullOrEmpty(oauth.ConsumerSecret)) ||
                (oauth.SignatureMethod == OAuthInfo.OAuthInfoSignatureMethod.RSA_SHA1 && string.IsNullOrEmpty(oauth.ConsumerPrivateKey)))
            {
                throw new Exception("ConsumerKey or ConsumerSecret or ConsumerPrivateKey empty.");
            }

            parameters = new Dictionary<string, string>();
            parameters.Add(ParameterVersion, oauth.OAuthVersion);
            parameters.Add(ParameterNonce, GenerateNonce());
            parameters.Add(ParameterTimestamp, GenerateTimestamp());
            parameters.Add(ParameterConsumerKey, oauth.ConsumerKey);
            switch (oauth.SignatureMethod)
            {
                case OAuthInfo.OAuthInfoSignatureMethod.HMAC_SHA1:
                    parameters.Add(ParameterSignatureMethod, HMACSHA1SignatureType);
                    break;
                case OAuthInfo.OAuthInfoSignatureMethod.RSA_SHA1:
                    parameters.Add(ParameterSignatureMethod, RSASHA1SignatureType);
                    break;
                default:
                    throw new NotImplementedException("Unsupported signature method");
            }

            string secret = null;

            if (!string.IsNullOrEmpty(oauth.UserToken) && !string.IsNullOrEmpty(oauth.UserSecret))
            {
                secret = oauth.UserSecret;
                parameters.Add(ParameterToken, oauth.UserToken);
            }
            else if (!string.IsNullOrEmpty(oauth.AuthToken) && !string.IsNullOrEmpty(oauth.AuthSecret))
            {
                secret = oauth.AuthSecret;
                parameters.Add(ParameterToken, oauth.AuthToken);

                if (!string.IsNullOrEmpty(oauth.AuthVerifier))
                {
                    parameters.Add(ParameterVerifier, oauth.AuthVerifier);
                }
            }

            if (args != null)
            {
                foreach (KeyValuePair<string, string> arg in args)
                {
                    parameters[arg.Key] = arg.Value;
                }
            }

            string normalizedUrl = NormalizeUrl(url);
            string normalizedParameters = NormalizeParameters(parameters);
            string signatureBase = GenerateSignatureBase(httpMethod, normalizedUrl, normalizedParameters);
            byte[] signatureData;
            switch (oauth.SignatureMethod)
            {
                case OAuthInfo.OAuthInfoSignatureMethod.HMAC_SHA1:
                    signatureData = GenerateSignature(signatureBase, oauth.ConsumerSecret, secret);
                    break;
                case OAuthInfo.OAuthInfoSignatureMethod.RSA_SHA1:
                    signatureData = GenerateSignatureRSASHA1(signatureBase, oauth.ConsumerPrivateKey);
                    break;
                default:
                    throw new NotImplementedException("Unsupported signature method");
            }

            string signature = Convert.ToBase64String(signatureData);
            parameters[ParameterSignature] = signature;

            return string.Format("{0}?{1}&{2}={3}", normalizedUrl, normalizedParameters, ParameterSignature, URLHelpers.URLEncode(signature));
        }

        public static string GetAuthorizationURL(string requestTokenResponse, OAuthInfo oauth, string authorizeURL, string callback = null)
        {
            string url = null;

            NameValueCollection args = HttpUtility.ParseQueryString(requestTokenResponse);

            if (args[ParameterToken] != null)
            {
                oauth.AuthToken = args[ParameterToken];
                url = string.Format("{0}?{1}={2}", authorizeURL, ParameterToken, oauth.AuthToken);

                if (!string.IsNullOrEmpty(callback))
                {
                    url += string.Format("&{0}={1}", ParameterCallback, URLHelpers.URLEncode(callback));
                }

                if (args[ParameterTokenSecret] != null)
                {
                    oauth.AuthSecret = args[ParameterTokenSecret];
                }
            }

            return url;
        }

        public static NameValueCollection ParseAccessTokenResponse(string accessTokenResponse, OAuthInfo oauth)
        {
            NameValueCollection args = HttpUtility.ParseQueryString(accessTokenResponse);

            if (args != null && args[ParameterToken] != null)
            {
                oauth.UserToken = args[ParameterToken];

                if (args[ParameterTokenSecret] != null)
                {
                    oauth.UserSecret = args[ParameterTokenSecret];

                    return args;
                }
            }

            return null;
        }

        private static string GenerateSignatureBase(HttpMethod httpMethod, string normalizedUrl, string normalizedParameters)
        {
            StringBuilder signatureBase = new StringBuilder();
            signatureBase.AppendFormat("{0}&", httpMethod.ToString());
            signatureBase.AppendFormat("{0}&", URLHelpers.URLEncode(normalizedUrl));
            signatureBase.AppendFormat("{0}", URLHelpers.URLEncode(normalizedParameters));
            return signatureBase.ToString();
        }

        private static byte[] GenerateSignature(string signatureBase, string consumerSecret, string userSecret = null)
        {
            using (HMACSHA1 hmacsha1 = new HMACSHA1())
            {
                string key = string.Format("{0}&{1}", Uri.EscapeDataString(consumerSecret),
                    string.IsNullOrEmpty(userSecret) ? "" : Uri.EscapeDataString(userSecret));

                hmacsha1.Key = Encoding.ASCII.GetBytes(key);

                byte[] dataBuffer = Encoding.ASCII.GetBytes(signatureBase);
                return hmacsha1.ComputeHash(dataBuffer);
            }
        }

        private static byte[] GenerateSignatureRSASHA1(string signatureBase, string privateKey)
        {
            byte[] dataBuffer = Encoding.ASCII.GetBytes(signatureBase);

            using (HashAlgorithm sha1 = GenerateSha1Hash(dataBuffer))
            using (AsymmetricAlgorithm algorithm = new RSACryptoServiceProvider())
            {
                algorithm.FromXmlString(privateKey);
                RSAPKCS1SignatureFormatter formatter = new RSAPKCS1SignatureFormatter(algorithm);
                formatter.SetHashAlgorithm("MD5");
                return formatter.CreateSignature(sha1);
            }
        }

        private static HashAlgorithm GenerateSha1Hash(byte[] dataBuffer)
        {
            HashAlgorithm sha1 = SHA1.Create();

            using (CryptoStream cs = new CryptoStream(Stream.Null, sha1, CryptoStreamMode.Write))
            {
                cs.Write(dataBuffer, 0, dataBuffer.Length);
            }

            return sha1;
        }

        private static string GenerateTimestamp()
        {
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return Convert.ToInt64(ts.TotalSeconds).ToString();
        }

        private static string GenerateNonce()
        {
            return Helpers.GetRandomAlphanumeric(12);
        }

        private static string NormalizeUrl(string url)
        {
            if (Uri.TryCreate(url, UriKind.Absolute, out Uri uri))
            {
                string port = "";

                if ((uri.Scheme == "http" && uri.Port != 80) ||
                    (uri.Scheme == "https" && uri.Port != 443) ||
                    (uri.Scheme == "ftp" && uri.Port != 20))
                {
                    port = ":" + uri.Port;
                }

                url = uri.Scheme + "://" + uri.Host + port + uri.AbsolutePath;
            }

            return url;
        }

        private static string NormalizeParameters(Dictionary<string, string> parameters)
        {
            return string.Join("&", parameters.OrderBy(x => x.Key).ThenBy(x => x.Value).Select(x => x.Key + "=" + URLHelpers.URLEncode(x.Value)).ToArray());
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OAuthUserInfo.cs]---
Location: ShareX-develop/ShareX.UploadersLib/OAuth/OAuthUserInfo.cs

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
    public class OAuthUserInfo
    {
        public string sub { get; set; }
        public string name { get; set; }
        public string given_name { get; set; }
        public string picture { get; set; }
        public string locale { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Resources.ar-YE.resx]---
Location: ShareX-develop/ShareX.UploadersLib/Properties/Resources.ar-YE.resx

```text
<?xml version="1.0" encoding="utf-8"?>
<root>
  <!--
    Microsoft ResX Schema

    Version 2.0

    The primary goals of this format is to allow a simple XML format
    that is mostly human readable. The generation and parsing of the
    various data types are done through the TypeConverter classes
    associated with the data types.

    Example:

    ... ado.net/XML headers & schema ...
    <resheader name="resmimetype">text/microsoft-resx</resheader>
    <resheader name="version">2.0</resheader>
    <resheader name="reader">System.Resources.ResXResourceReader, System.Windows.Forms, ...</resheader>
    <resheader name="writer">System.Resources.ResXResourceWriter, System.Windows.Forms, ...</resheader>
    <data name="Name1"><value>this is my long string</value><comment>this is a comment</comment></data>
    <data name="Color1" type="System.Drawing.Color, System.Drawing">Blue</data>
    <data name="Bitmap1" mimetype="application/x-microsoft.net.object.binary.base64">
        <value>[base64 mime encoded serialized .NET Framework object]</value>
    </data>
    <data name="Icon1" type="System.Drawing.Icon, System.Drawing" mimetype="application/x-microsoft.net.object.bytearray.base64">
        <value>[base64 mime encoded string representing a byte array form of the .NET Framework object]</value>
        <comment>This is a comment</comment>
    </data>

    There are any number of "resheader" rows that contain simple
    name/value pairs.

    Each data row contains a name, and value. The row also contains a
    type or mimetype. Type corresponds to a .NET class that support
    text/value conversion through the TypeConverter architecture.
    Classes that don't support this are serialized and stored with the
    mimetype set.

    The mimetype is used for serialized objects, and tells the
    ResXResourceReader how to depersist the object. This is currently not
    extensible. For a given mimetype the value must be set accordingly:

    Note - application/x-microsoft.net.object.binary.base64 is the format
    that the ResXResourceWriter will generate, however the reader can
    read any of the formats listed below.

    mimetype: application/x-microsoft.net.object.binary.base64
    value   : The object must be serialized with
            : System.Runtime.Serialization.Formatters.Binary.BinaryFormatter
            : and then encoded with base64 encoding.

    mimetype: application/x-microsoft.net.object.soap.base64
    value   : The object must be serialized with
            : System.Runtime.Serialization.Formatters.Soap.SoapFormatter
            : and then encoded with base64 encoding.

    mimetype: application/x-microsoft.net.object.bytearray.base64
    value   : The object must be serialized into a byte array
            : using a System.ComponentModel.TypeConverter
            : and then encoded with base64 encoding.
    -->
  <xsd:schema id="root" xmlns="" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xsd:import namespace="http://www.w3.org/XML/1998/namespace" />
    <xsd:element name="root" msdata:IsDataSet="true">
      <xsd:complexType>
        <xsd:choice maxOccurs="unbounded">
          <xsd:element name="metadata">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" />
              </xsd:sequence>
              <xsd:attribute name="name" use="required" type="xsd:string" />
              <xsd:attribute name="type" type="xsd:string" />
              <xsd:attribute name="mimetype" type="xsd:string" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="assembly">
            <xsd:complexType>
              <xsd:attribute name="alias" type="xsd:string" />
              <xsd:attribute name="name" type="xsd:string" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="data">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
                <xsd:element name="comment" type="xsd:string" minOccurs="0" msdata:Ordinal="2" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" msdata:Ordinal="1" />
              <xsd:attribute name="type" type="xsd:string" msdata:Ordinal="3" />
              <xsd:attribute name="mimetype" type="xsd:string" msdata:Ordinal="4" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="resheader">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" />
            </xsd:complexType>
          </xsd:element>
        </xsd:choice>
      </xsd:complexType>
    </xsd:element>
  </xsd:schema>
  <resheader name="resmimetype">
    <value>text/microsoft-resx</value>
  </resheader>
  <resheader name="version">
    <value>2.0</value>
  </resheader>
  <resheader name="reader">
    <value>System.Resources.ResXResourceReader, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <resheader name="writer">
    <value>System.Resources.ResXResourceWriter, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <data name="UploadersConfigForm_MegaConfigureTab_Configured" xml:space="preserve">
    <value>تم الإعداد</value>
  </data>
  <data name="Connect" xml:space="preserve">
    <value>اتصال...</value>
  </data>
  <data name="UploadersConfigForm_TestFTPAccount_Connected_" xml:space="preserve">
    <value>تم الاتصال!</value>
  </data>
  <data name="UploadersConfigForm_TestFTPAccount_Connected_Created_folders" xml:space="preserve">
    <value>تم الاتصال!
المجلد الذي تم إنشاءه:</value>
  </data>
  <data name="DeletionURL" xml:space="preserve">
    <value>عنوان الحذف</value>
  </data>
  <data name="Disconnect" xml:space="preserve">
    <value>قطع الاتصال</value>
  </data>
  <data name="DuplicateNameNotAllowed" xml:space="preserve">
    <value>لا يٌسمح بتكرار الاسم.</value>
  </data>
  <data name="UploadersConfigForm_Error" xml:space="preserve">
    <value>خطأ</value>
  </data>
  <data name="Error" xml:space="preserve">
    <value>خطأ</value>
  </data>
  <data name="UploadersConfigForm_TestCustomUploader_Error__Result_is_empty_" xml:space="preserve">
    <value>خطأ: لا توجد نتيجة.</value>
  </data>
  <data name="ExportFailed" xml:space="preserve">
    <value>خطأ في تصدير البيانات.</value>
  </data>
  <data name="Headers" xml:space="preserve">
    <value>الرؤوس</value>
  </data>
  <data name="UploadersConfigForm_oAuthJira_RefreshButtonClicked_Refresh_authorization_is_not_supported_" xml:space="preserve">
    <value>تحديث المصادقة غير مدعوم.</value>
  </data>
  <data name="UploadersConfigForm_ListFolders_Authentication_required_" xml:space="preserve">
    <value>يجب المصادقة أولًا.</value>
  </data>
  <data name="LoggedInAs0" xml:space="preserve">
    <value>مسجل للدخول كـ {0}.</value>
  </data>
  <data name="OAuthControl_Status_LoggedIn" xml:space="preserve">
    <value>مسجل للدخول.</value>
  </data>
  <data name="UploadersConfigForm_UpdatePastebinStatus_LoggedIn" xml:space="preserve">
    <value>مسجل للدخول.</value>
  </data>
  <data name="UploadersConfigForm_Login_failed" xml:space="preserve">
    <value>تسجيل الدخول لم ينجح.</value>
  </data>
  <data name="OAuthControl_Status_LoginFailed" xml:space="preserve">
    <value>تسجيل الدخول لم ينجح.</value>
  </data>
  <data name="UploadersConfigForm_Login_successful" xml:space="preserve">
    <value>تم تسجيل الدخول.</value>
  </data>
  <data name="OAuthInfo_OAuthInfo_New_account" xml:space="preserve">
    <value>حساب جديد</value>
  </data>
  <data name="UploadersConfigForm_MegaConfigureTab_Not_configured" xml:space="preserve">
    <value>غير مهيأ</value>
  </data>
  <data name="UploadersConfigForm_UpdatePastebinStatus_NotLoggedIn" xml:space="preserve">
    <value>غير مسجل للخول.</value>
  </data>
  <data name="OAuthControl_Status_NotLoggedIn" xml:space="preserve">
    <value>غير مسجل للخول.</value>
  </data>
  <data name="UploadersConfigForm_LoadSettings_Parent_album_path_e_g_" xml:space="preserve">
    <value>مسار الألبوم الأب، مثلًا:</value>
  </data>
  <data name="OAuthControl_OAuthControl_PasteVerificationCodeHere" xml:space="preserve">
    <value>قم بلصق رمز التحقق هنا</value>
  </data>
  <data name="UploadersConfigForm_OneDriveAddFolder_Querying_folders___" xml:space="preserve">
    <value>مجلدات البحث...</value>
  </data>
  <data name="UploadersConfigForm_Remove_all_custom_uploaders_Confirmation" xml:space="preserve">
    <value>سيتم حذف جميع الرافعين المخصصين؟</value>
  </data>
  <data name="OneDrive_RootFolder_Root_folder" xml:space="preserve">
    <value>المجلد الجذر</value>
  </data>
  <data name="UploadersConfigForm_LoadSettings_Selected_folder_" xml:space="preserve">
    <value>المجلد المحدد:</value>
  </data>
  <data name="URL" xml:space="preserve">
    <value>عنوان URL</value>
  </data>
  <data name="UploadersConfigForm_FTPOpenClient_Unable_to_find_valid_FTP_account_" xml:space="preserve">
    <value>لم يتم العثور على حساب FTPصالح.</value>
  </data>
  <data name="TwitterTweetForm_SendTweet_Tweet_error" xml:space="preserve">
    <value>خطأ في التغريدة</value>
  </data>
  <data name="ThumbnailURL" xml:space="preserve">
    <value>عنوان URL للصورة المصغرة</value>
  </data>
  <data name="StatusCode" xml:space="preserve">
    <value>رمز الاستجابة</value>
  </data>
  <data name="ShortenedURL" xml:space="preserve">
    <value>عنوان URL المختصر</value>
  </data>
  <data name="UploadersConfigForm_SendSpaceRegister_SendSpace_Registration___" xml:space="preserve">
    <value>التسجيل في SendSpace</value>
  </data>
  <data name="ResponseText" xml:space="preserve">
    <value>نص استجابة HTTP</value>
  </data>
  <data name="ResponseURL" xml:space="preserve">
    <value>عنوان استجابة HTTP</value>
  </data>
  <data name="UploadersConfigForm_ConnectSFTPAccount_Key_file_not_found" xml:space="preserve">
    <value>لم يتم العثور على ملف المفتاح.</value>
  </data>
  <data name="UploadersConfigForm_LoadSettings_Invalid_device_name" xml:space="preserve">
    <value>اسم الجهاز غير صالح</value>
  </data>
  <data name="UploadersConfigForm_MegaConfigureTab_Invalid_authentication" xml:space="preserve">
    <value>مصادقة غير صالحة</value>
  </data>
  <data name="FormattingFailed_XML" xml:space="preserve">
    <value>خطأ أثناء التنسيق.</value>
  </data>
  <data name="FormattingFailed_JSON" xml:space="preserve">
    <value>خطأ أثناء التنسيق.</value>
  </data>
  <data name="UploadersConfigForm_MegaConfigureTab_Click_refresh_button" xml:space="preserve">
    <value>انقر زر التحديث</value>
  </data>
  <data name="KeyFileNameEditor_EditValue_Browse_for_a_key_file___" xml:space="preserve">
    <value>استعراض واختيار ملف مفتاح...</value>
  </data>
  <data name="CertFileNameEditor_EditValue_Browse_for_a_certificate_file___" xml:space="preserve">
    <value>استعراض واختيار ملف الشهادة...</value>
  </data>
  <data name="UploadersConfigForm_BoxListFolders_Box_refresh_folders_list_failed" xml:space="preserve">
    <value>خطأ في تحديث مربع قائمة مجلدات</value>
  </data>
  <data name="txtB2BucketWatermark" xml:space="preserve">
    <value>(اختياري) يُستخدم فقط إذا لم تقم بتحديد مجموعة عند توليد المفتاح</value>
  </data>
  <data name="CustomUploaderItem_GetRequestURL_RequestURLMustBeConfigured" xml:space="preserve">
    <value>يجب تكوين "عنوان URL للطلب".</value>
  </data>
  <data name="UploadersConfigForm_eiCustomUploaders_ExportRequested_RequestURLMustBeConfigured" xml:space="preserve">
    <value>يجب تكوين "عنوان URL للطلب".</value>
  </data>
  <data name="CustomUploaderItem_GetFileFormName_FileFormNameMustBeConfigured" xml:space="preserve">
    <value>يجب تكوين "اسم نموذج الملف".</value>
  </data>
  <data name="UploadersConfigForm_eiCustomUploaders_ExportRequested_DestinationTypeMustBeConfigured" xml:space="preserve">
    <value>يجب تكوين "نوع الوجهة".</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: Resources.de.resx]---
Location: ShareX-develop/ShareX.UploadersLib/Properties/Resources.de.resx

```text
<?xml version="1.0" encoding="utf-8"?>
<root>
  <!-- 
    Microsoft ResX Schema 
    
    Version 2.0
    
    The primary goals of this format is to allow a simple XML format 
    that is mostly human readable. The generation and parsing of the 
    various data types are done through the TypeConverter classes 
    associated with the data types.
    
    Example:
    
    ... ado.net/XML headers & schema ...
    <resheader name="resmimetype">text/microsoft-resx</resheader>
    <resheader name="version">2.0</resheader>
    <resheader name="reader">System.Resources.ResXResourceReader, System.Windows.Forms, ...</resheader>
    <resheader name="writer">System.Resources.ResXResourceWriter, System.Windows.Forms, ...</resheader>
    <data name="Name1"><value>this is my long string</value><comment>this is a comment</comment></data>
    <data name="Color1" type="System.Drawing.Color, System.Drawing">Blue</data>
    <data name="Bitmap1" mimetype="application/x-microsoft.net.object.binary.base64">
        <value>[base64 mime encoded serialized .NET Framework object]</value>
    </data>
    <data name="Icon1" type="System.Drawing.Icon, System.Drawing" mimetype="application/x-microsoft.net.object.bytearray.base64">
        <value>[base64 mime encoded string representing a byte array form of the .NET Framework object]</value>
        <comment>This is a comment</comment>
    </data>
                
    There are any number of "resheader" rows that contain simple 
    name/value pairs.
    
    Each data row contains a name, and value. The row also contains a 
    type or mimetype. Type corresponds to a .NET class that support 
    text/value conversion through the TypeConverter architecture. 
    Classes that don't support this are serialized and stored with the 
    mimetype set.
    
    The mimetype is used for serialized objects, and tells the 
    ResXResourceReader how to depersist the object. This is currently not 
    extensible. For a given mimetype the value must be set accordingly:
    
    Note - application/x-microsoft.net.object.binary.base64 is the format 
    that the ResXResourceWriter will generate, however the reader can 
    read any of the formats listed below.
    
    mimetype: application/x-microsoft.net.object.binary.base64
    value   : The object must be serialized with 
            : System.Runtime.Serialization.Formatters.Binary.BinaryFormatter
            : and then encoded with base64 encoding.
    
    mimetype: application/x-microsoft.net.object.soap.base64
    value   : The object must be serialized with 
            : System.Runtime.Serialization.Formatters.Soap.SoapFormatter
            : and then encoded with base64 encoding.

    mimetype: application/x-microsoft.net.object.bytearray.base64
    value   : The object must be serialized into a byte array 
            : using a System.ComponentModel.TypeConverter
            : and then encoded with base64 encoding.
    -->
  <xsd:schema id="root" xmlns="" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xsd:import namespace="http://www.w3.org/XML/1998/namespace" />
    <xsd:element name="root" msdata:IsDataSet="true">
      <xsd:complexType>
        <xsd:choice maxOccurs="unbounded">
          <xsd:element name="metadata">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" />
              </xsd:sequence>
              <xsd:attribute name="name" use="required" type="xsd:string" />
              <xsd:attribute name="type" type="xsd:string" />
              <xsd:attribute name="mimetype" type="xsd:string" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="assembly">
            <xsd:complexType>
              <xsd:attribute name="alias" type="xsd:string" />
              <xsd:attribute name="name" type="xsd:string" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="data">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
                <xsd:element name="comment" type="xsd:string" minOccurs="0" msdata:Ordinal="2" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" msdata:Ordinal="1" />
              <xsd:attribute name="type" type="xsd:string" msdata:Ordinal="3" />
              <xsd:attribute name="mimetype" type="xsd:string" msdata:Ordinal="4" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="resheader">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" />
            </xsd:complexType>
          </xsd:element>
        </xsd:choice>
      </xsd:complexType>
    </xsd:element>
  </xsd:schema>
  <resheader name="resmimetype">
    <value>text/microsoft-resx</value>
  </resheader>
  <resheader name="version">
    <value>2.0</value>
  </resheader>
  <resheader name="reader">
    <value>System.Resources.ResXResourceReader, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <resheader name="writer">
    <value>System.Resources.ResXResourceWriter, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <data name="CertFileNameEditor_EditValue_Browse_for_a_certificate_file___" xml:space="preserve">
    <value>Durchsuche für eine Zertifikatdatei...</value>
  </data>
  <data name="UploadersConfigForm_oAuthJira_RefreshButtonClicked_Refresh_authorization_is_not_supported_" xml:space="preserve">
    <value>Aktualisiere Autorisierung ist nicht unterstützt.</value>
  </data>
  <data name="UploadersConfigForm_LoadSettings_Invalid_device_name" xml:space="preserve">
    <value>Ungültiger Gerätename</value>
  </data>
  <data name="UploadersConfigForm_BoxListFolders_Box_refresh_folders_list_failed" xml:space="preserve">
    <value>Box Aktualisierung der Ordnerliste fehlgeschlagen</value>
  </data>
  <data name="UploadersConfigForm_Error" xml:space="preserve">
    <value>Fehler</value>
  </data>
  <data name="OneDrive_RootFolder_Root_folder" xml:space="preserve">
    <value>Rootordner</value>
  </data>
  <data name="JiraUpload_ValidateIssueId_Issue_not_found" xml:space="preserve">
    <value>Ausgabe nicht gefunden</value>
  </data>
  <data name="KeyFileNameEditor_EditValue_Browse_for_a_key_file___" xml:space="preserve">
    <value>Durchsuche für eine Keydatei...</value>
  </data>
  <data name="OAuthInfo_OAuthInfo_New_account" xml:space="preserve">
    <value>Neues Konto</value>
  </data>
  <data name="TwitterTweetForm_SendTweet_Tweet_error" xml:space="preserve">
    <value>Tweet-Fehler</value>
  </data>
  <data name="UploadersConfigForm_LoadSettings_Parent_album_path_e_g_" xml:space="preserve">
    <value>Übergeordneter Albumpfad, zum Beispiel:</value>
  </data>
  <data name="UploadersConfigForm_LoadSettings_Selected_folder_" xml:space="preserve">
    <value>Ausgewählter Ordner:</value>
  </data>
  <data name="UploadersConfigForm_Login_failed" xml:space="preserve">
    <value>Einloggen fehlgeschlagen.</value>
  </data>
  <data name="UploadersConfigForm_Login_successful" xml:space="preserve">
    <value>Einloggen erfolgreich.</value>
  </data>
  <data name="UploadersConfigForm_MegaConfigureTab_Click_refresh_button" xml:space="preserve">
    <value>Klicke Aktualisierungsknopf</value>
  </data>
  <data name="UploadersConfigForm_MegaConfigureTab_Configured" xml:space="preserve">
    <value>Konfiguriert</value>
  </data>
  <data name="UploadersConfigForm_MegaConfigureTab_Invalid_authentication" xml:space="preserve">
    <value>Ungültige Authentifizierung</value>
  </data>
  <data name="UploadersConfigForm_MegaConfigureTab_Not_configured" xml:space="preserve">
    <value>Nicht konfiguriert</value>
  </data>
  <data name="UploadersConfigForm_PhotobucketCreateAlbum__0__successfully_created_" xml:space="preserve">
    <value>{0} erfolgreich erstellt.</value>
  </data>
  <data name="UploadersConfigForm_SendSpaceRegister_SendSpace_Registration___" xml:space="preserve">
    <value>SendSpace Registrierung</value>
  </data>
  <data name="UploadersConfigForm_TestCustomUploader_Error__Result_is_empty_" xml:space="preserve">
    <value>Fehler: Ergebnis ist leer.</value>
  </data>
  <data name="UploadersConfigForm_TestFTPAccount_Connected_" xml:space="preserve">
    <value>Verbunden!</value>
  </data>
  <data name="UploadersConfigForm_TestFTPAccount_Connected_Created_folders" xml:space="preserve">
    <value>Verbunden!
Hergestellte Ordner:</value>
  </data>
  <data name="UploadersConfigForm_ListFolders_Authentication_required_" xml:space="preserve">
    <value>Authentifizierung erfoderlich.</value>
  </data>
  <data name="UploadersConfigForm_OneDriveAddFolder_Querying_folders___" xml:space="preserve">
    <value>Ordner abfragen...</value>
  </data>
  <data name="UploadersConfigForm_FTPOpenClient_Unable_to_find_valid_FTP_account_" xml:space="preserve">
    <value>Kann kein gültiges FTP-Konto finden.</value>
  </data>
  <data name="OAuthControl_Status_NotLoggedIn" xml:space="preserve">
    <value>Nicht angemeldet.</value>
  </data>
  <data name="OAuthControl_Status_LoggedIn" xml:space="preserve">
    <value>Angemeldet.</value>
  </data>
  <data name="OAuthControl_Status_LoginFailed" xml:space="preserve">
    <value>Anmeldung fehlgeschlagen.</value>
  </data>
  <data name="UploadersConfigForm_UpdatePastebinStatus_LoggedIn" xml:space="preserve">
    <value>Angemeldet.</value>
  </data>
  <data name="UploadersConfigForm_UpdatePastebinStatus_NotLoggedIn" xml:space="preserve">
    <value>Nicht angemeldet.</value>
  </data>
  <data name="UploadersConfigForm_Remove_all_custom_uploaders_Confirmation" xml:space="preserve">
    <value>Alle benutzerdefinierten Uploader entfernen?</value>
  </data>
  <data name="OAuthControl_OAuthControl_PasteVerificationCodeHere" xml:space="preserve">
    <value>Verifizierungscode hier einfügen</value>
  </data>
  <data name="UploadersConfigForm_ConnectSFTPAccount_Key_file_not_found" xml:space="preserve">
    <value>Die Schlüsseldatei ist nicht vorhanden.</value>
  </data>
  <data name="UploadersConfigForm_eiCustomUploaders_ExportRequested_RequestURLMustBeConfigured" xml:space="preserve">
    <value>Die „Anfragen-URL“ muss konfiguriert werden.</value>
  </data>
  <data name="UploadersConfigForm_eiCustomUploaders_ExportRequested_DestinationTypeMustBeConfigured" xml:space="preserve">
    <value>Der „Zieltyp“ muss konfiguriert werden.</value>
  </data>
  <data name="CustomUploaderItem_GetRequestURL_RequestURLMustBeConfigured" xml:space="preserve">
    <value>Die „Anfragen-URL“ muss konfiguriert werden.</value>
  </data>
  <data name="CustomUploaderItem_GetFileFormName_FileFormNameMustBeConfigured" xml:space="preserve">
    <value>„Dateiformatname“ muss konfiguriert werden.</value>
  </data>
  <data name="txtB2BucketWatermark" xml:space="preserve">
    <value>(Optional) Wird nur verwendet, wenn Sie beim Erstellen des Schlüssels keinen Bucket festgelegt haben</value>
  </data>
  <data name="DuplicateNameNotAllowed" xml:space="preserve">
    <value>Doppelte Namen sind nicht erlaubt.</value>
  </data>
  <data name="GoogleDrive_MyDrive_My_drive" xml:space="preserve">
    <value>Mein Laufwerk</value>
  </data>
  <data name="ExportFailed" xml:space="preserve">
    <value>Export fehlgeschlagen.</value>
  </data>
  <data name="LoggedInAs0" xml:space="preserve">
    <value>Eingeloggt als {0}.</value>
  </data>
  <data name="FormattingFailed_JSON" xml:space="preserve">
    <value>Formatierung fehlgeschlagen.</value>
  </data>
  <data name="FormattingFailed_XML" xml:space="preserve">
    <value>Formatierung fehlgeschlagen.</value>
  </data>
  <data name="ShortenedURL" xml:space="preserve">
    <value>Gekürzte URL</value>
  </data>
  <data name="ThumbnailURL" xml:space="preserve">
    <value>Thumbnail-URL</value>
  </data>
  <data name="DeletionURL" xml:space="preserve">
    <value>Löschungs-URL</value>
  </data>
  <data name="StatusCode" xml:space="preserve">
    <value>Statuscode</value>
  </data>
  <data name="ResponseURL" xml:space="preserve">
    <value>Antwort-URL</value>
  </data>
  <data name="ResponseText" xml:space="preserve">
    <value>Antworttext</value>
  </data>
  <data name="Error" xml:space="preserve">
    <value>Fehler</value>
  </data>
  <data name="Disconnect" xml:space="preserve">
    <value>Trennen</value>
  </data>
  <data name="Connect" xml:space="preserve">
    <value>Verbinden...</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
