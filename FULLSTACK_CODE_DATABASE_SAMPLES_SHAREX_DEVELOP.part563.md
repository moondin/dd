---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 563
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 563 of 650)

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

---[FILE: SharedFolderUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/SharedFolderUploader.cs

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
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class SharedFolderFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.SharedFolder;

        public override Image ServiceImage => Resources.server_network;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.LocalhostAccountList != null && config.LocalhostAccountList.IsValidIndex(config.LocalhostSelectedFiles);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            int index;

            switch (taskInfo.DataType)
            {
                case EDataType.Image:
                    index = config.LocalhostSelectedImages;
                    break;
                case EDataType.Text:
                    index = config.LocalhostSelectedText;
                    break;
                default:
                case EDataType.File:
                    index = config.LocalhostSelectedFiles;
                    break;
            }

            LocalhostAccount account = config.LocalhostAccountList.ReturnIfValidIndex(index);

            if (account != null)
            {
                return new SharedFolderUploader(account);
            }

            return null;
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpSharedFolder;
    }

    public class SharedFolderUploader : FileUploader
    {
        private LocalhostAccount account;

        public SharedFolderUploader(LocalhostAccount account)
        {
            this.account = account;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            UploadResult result = new UploadResult();

            string filePath = account.GetLocalhostPath(fileName);

            FileHelpers.CreateDirectoryFromFilePath(filePath);

            using (FileStream fs = new FileStream(filePath, FileMode.Create))
            {
                if (TransferData(stream, fs))
                {
                    result.URL = account.GetUriPath(Path.GetFileName(fileName));
                }
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Streamable.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Streamable.cs

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
using System.Collections.Specialized;
using System.Drawing;
using System.IO;
using System.Threading;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class StreamableFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Streamable;

        public override Icon ServiceIcon => Resources.Streamable;

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.StreamableUsername) && !string.IsNullOrEmpty(config.StreamablePassword);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Streamable(config.StreamableUsername, config.StreamablePassword)
            {
                UseDirectURL = config.StreamableUseDirectURL
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpStreamable;
    }

    public class Streamable : FileUploader
    {
        private const string Host = "https://api.streamable.com";

        public string Email { get; private set; }
        public string Password { get; private set; }
        public bool UseDirectURL { get; set; }

        public Streamable(string email, string password)
        {
            Email = email;
            Password = password;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            NameValueCollection headers = null;

            if (!string.IsNullOrEmpty(Email) && !string.IsNullOrEmpty(Password))
            {
                headers = RequestHelpers.CreateAuthenticationHeader(Email, Password);
            }

            string url = URLHelpers.CombineURL(Host, "upload");
            UploadResult result = SendRequestFile(url, stream, fileName, "file", headers: headers);

            TranscodeFile(result);

            return result;
        }

        private void TranscodeFile(UploadResult result)
        {
            StreamableTranscodeResponse transcodeResponse = JsonConvert.DeserializeObject<StreamableTranscodeResponse>(result.Response);

            if (!string.IsNullOrEmpty(transcodeResponse.Shortcode))
            {
                ProgressManager progress = new ProgressManager(100);
                OnProgressChanged(progress);

                while (!StopUploadRequested)
                {
                    string statusJson = SendRequest(HttpMethod.GET, URLHelpers.CombineURL(Host, "videos", transcodeResponse.Shortcode));
                    StreamableStatusResponse response = JsonConvert.DeserializeObject<StreamableStatusResponse>(statusJson);

                    if (response.status > 2)
                    {
                        Errors.Add(response.message);
                        result.IsSuccess = false;
                        break;
                    }
                    else if (response.status == 2)
                    {
                        progress.UpdateProgress(100 - progress.Position);
                        OnProgressChanged(progress);

                        result.IsSuccess = true;

                        if (UseDirectURL && response.files != null && response.files.mp4 != null && !string.IsNullOrEmpty(response.files.mp4.url))
                        {
                            result.URL = URLHelpers.ForcePrefix(response.files.mp4.url);
                        }
                        else
                        {
                            result.URL = URLHelpers.ForcePrefix(response.url);
                        }

                        break;
                    }

                    progress.UpdateProgress(response.percent - progress.Position);
                    OnProgressChanged(progress);

                    Thread.Sleep(1000);
                }
            }
            else
            {
                Errors.Add("Could not create video");
                result.IsSuccess = false;
            }
        }
    }

    public class StreamableTranscodeResponse
    {
        public string Shortcode { get; set; }
        public int Status { get; set; }
    }

    public class StreamableStatusResponse
    {
        public int status { get; set; }
        public StreamableStatusResponseFiles files { get; set; }
        //public string url_root { get; set; }
        public string thumbnail_url { get; set; }
        //public string[] formats { get; set; }
        public string url { get; set; }
        public string message { get; set; }
        public string title { get; set; }
        public long percent { get; set; }
    }

    public class StreamableStatusResponseFiles
    {
        public StreamableStatusResponseVideo mp4 { get; set; }
    }

    public class StreamableStatusResponseVideo
    {
        public int status { get; set; }
        public string url { get; set; }
        public int framerate { get; set; }
        public int height { get; set; }
        public int width { get; set; }
        public long bitrate { get; set; }
        public long size { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Sul.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Sul.cs

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

using Newtonsoft.Json.Linq;
using ShareX.HelpersLib;
using ShareX.UploadersLib.Properties;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class SulFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Sul;

        public override Image ServiceImage => Resources.Sul;

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.SulAPIKey);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new SulUploader(config.SulAPIKey);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpSul;
    }

    public sealed class SulUploader : FileUploader
    {
        private string APIKey { get; set; }

        public SulUploader(string apiKey)
        {
            APIKey = apiKey;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("wizard", "true");
            args.Add("key", APIKey);
            args.Add("client", "sharex-native");

            string url = "https://s-ul.eu";
            string upload_url = URLHelpers.CombineURL(url, "api/v1/upload");

            UploadResult result = SendRequestFile(upload_url, stream, fileName, "file", args);

            if (result.IsSuccess)
            {
                JToken jsonResponse = JToken.Parse(result.Response);

                string protocol = "";
                string domain = "";
                string file = "";
                string extension = "";
                string error = "";

                if (jsonResponse != null)
                {
                    protocol = (string)jsonResponse.SelectToken("protocol");
                    domain = (string)jsonResponse.SelectToken("domain");
                    file = (string)jsonResponse.SelectToken("filename");
                    extension = (string)jsonResponse.SelectToken("extension");
                    error = (string)jsonResponse.SelectToken("error");
                }

                if (!string.IsNullOrEmpty(error) || string.IsNullOrEmpty(protocol))
                {
                    if (string.IsNullOrEmpty(error))
                    {
                        Errors.Add("Generic error occurred, please contact support@s-ul.eu");
                    }
                    else
                    {
                        Errors.Add(error);
                    }
                }
                else
                {
                    result.URL = protocol + domain + "/" + file + extension;
                    result.DeletionURL = URLHelpers.CombineURL(url, "delete.php?key=" + APIKey + "&file=" + file);
                }
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Transfersh.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Transfersh.cs

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

namespace ShareX.UploadersLib.FileUploaders
{
    public class TransfershFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Transfersh;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Transfersh();
        }
    }

    public sealed class Transfersh : FileUploader
    {
        public override UploadResult Upload(Stream stream, string fileName)
        {
            UploadResult result = SendRequestFile("https://transfer.sh", stream, fileName, "file");

            if (result.IsSuccess)
            {
                result.URL = result.Response.Trim();
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Uguu.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Uguu.cs

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

namespace ShareX.UploadersLib.FileUploaders
{
    public class UguuFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Uguu;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Uguu();
        }
    }

    public class Uguu : FileUploader
    {
        public override UploadResult Upload(Stream stream, string fileName)
        {
            UploadResult result = SendRequestFile("https://uguu.se/upload.php?output=text", stream, fileName, "files[]");

            if (result.IsSuccess)
            {
                result.URL = result.Response;
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Vault_ooo.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/Vault_ooo.cs

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
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace ShareX.UploadersLib.FileUploaders
{
    public class Vault_oooFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.Vault_ooo;

        public override bool CheckConfig(UploadersConfig config)
        {
            return true;
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Vault_ooo();
        }
    }

    public sealed class Vault_ooo : FileUploader
    {
        private const string APIURL = "https://vault.ooo";
        private const int PBKDF2_ITERATIONS = 10000;
        private const int AES_KEY_SIZE = 256; // Bits
        private const int AES_BLOCK_SIZE = 128; // Bits
        private const int BYTE_CHUNK_SIZE = 256 * 1024 * 381; // Copied from web client (99 MB)
        private static readonly DateTime ORIGIN_TIME = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);

        public override UploadResult Upload(Stream stream, string fileName)
        {
            #region Calculating sizes

            long fileSize = stream.Length;
            int chunks = (int)Math.Ceiling((double)fileSize / BYTE_CHUNK_SIZE);
            long fullUploadSize = 16; // 16 bytes header

            List<long> uploadSizes = new List<long>();
            uploadSizes.Add(0);
            LoopStartEnd((chunkStart, chunkEnd, i) =>
            {
                int chunkLength = chunkEnd - chunkStart;
                fullUploadSize += chunkLength + 16 - (chunkLength % 16);
                uploadSizes.Add(fullUploadSize);
            }, chunks, fileSize);

            #endregion

            string randomKey = GenerateRandomKey();
            byte[] randomKeyBytes = Encoding.UTF8.GetBytes(randomKey);
            Vault_oooCryptoData cryptoData = DeriveCryptoData(randomKeyBytes);

            #region Building filename

            byte[] fileNameBytes = Encoding.UTF8.GetBytes(fileName);
            string encryptedFileName;
            using (MemoryStream ms = new MemoryStream()) // Encrypting file name
            {
                ms.Write(cryptoData.Salt, 0, cryptoData.Salt.Length);
                byte[] encryptedFn = EncryptBytes(cryptoData, fileNameBytes);
                ms.Write(encryptedFn, 0, encryptedFn.Length);
                encryptedFileName = Helpers.BytesToHex(ms.ToArray());
            }
            string bytesLengthHex = fullUploadSize.ToString("X4"); // To Hex
            DateTime expiryTime = DateTime.UtcNow.AddDays(30); // Defaults from the web client
            string expiryTimeHex = ((long)(expiryTime - ORIGIN_TIME).TotalSeconds).ToString("X4"); // Expiry date in UNIX seconds in hex
            string fullFileName = $"{expiryTimeHex}-b-{bytesLengthHex}-{encryptedFileName}".ToLower();

            #endregion

            Dictionary<string, string> requestHeaders = new Dictionary<string, string>();
            requestHeaders.Add("X-Get-Raw-File", "1");
            Dictionary<string, long> postRequestJson = new Dictionary<string, long>();
            postRequestJson.Add("chunks", chunks);
            postRequestJson.Add("fileLength", fullUploadSize);

            string postResult = SendRequest(HttpMethod.POST, URLHelpers.CombineURL(APIURL, fullFileName), JsonConvert.SerializeObject(postRequestJson), RequestHelpers.ContentTypeJSON, requestHeaders);
            Vault_oooMetaInfo metaInfo = JsonConvert.DeserializeObject<Vault_oooMetaInfo>(postResult);

            if (string.IsNullOrEmpty(metaInfo.UrlPathName))
                throw new InvalidOperationException("No correct metaInfo returned");

            #region Upload in chunks

            List<byte> dumpStash = new List<byte>();
            LoopStartEnd((chunkStart, chunkEnd, i) =>
            {
                int chunkLength = chunkEnd - chunkStart;
                byte[] plainBytes = new byte[chunkLength];
                stream.ReadExactly(plainBytes);

                byte[] encryptedBytes = EncryptBytes(cryptoData, plainBytes);

                int prependSize = 0;
                if (dumpStash.Count > 0)
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        ms.Write(dumpStash.ToArray(), 0, dumpStash.Count);
                        ms.Write(encryptedBytes, 0, encryptedBytes.Length);
                        encryptedBytes = ms.ToArray();
                    }

                    prependSize = dumpStash.Count;
                    dumpStash.Clear();
                }

                if (encryptedBytes.Length + (i == 0 ? 16 : 0) > BYTE_CHUNK_SIZE) // 16 bytes for the salt header
                {
                    dumpStash.AddRange(encryptedBytes.Skip(BYTE_CHUNK_SIZE - (i == 0 ? 16 : 0)));
                    encryptedBytes = encryptedBytes.Take(BYTE_CHUNK_SIZE - (i == 0 ? 16 : 0)).ToArray();
                }

                using (MemoryStream ms = new MemoryStream())
                {
                    if (i == 0)
                    {
                        ms.Write(Encoding.UTF8.GetBytes("Salted__"), 0, 8); // Write header
                        ms.Write(cryptoData.Salt, 0, cryptoData.Salt.Length); // 8 bytes
                        ms.Write(encryptedBytes, 0, encryptedBytes.Length);
                    }
                    else
                    {
                        ms.Write(encryptedBytes, 0, encryptedBytes.Length); // Write encrypted bytes
                    }

                    NameValueCollection headers = new NameValueCollection();
                    headers.Add("X-Get-Raw-File", "1");
                    int uploadChunkStart = (int)(uploadSizes[i] - prependSize);
                    headers.Add("X-Put-Chunk-Start", uploadChunkStart.ToString());
                    headers.Add("X-Put-Chunk-End", (uploadChunkStart + ms.Length).ToString());
                    headers.Add("X-Put-JWT", metaInfo.Token);

                    SendRequest(HttpMethod.PUT, URLHelpers.CombineURL(APIURL, metaInfo.UrlPathName), ms, "application/octet-stream", null, headers);
                }
            }, chunks, fileSize);

            #endregion

            UploadResult res = new UploadResult();
            res.IsURLExpected = true;
            res.URL = URLHelpers.CombineURL(APIURL, metaInfo.UrlPathName) + "#" + randomKey; // Full url with the encryption key

            return res;
        }

        private delegate void StartEndCallback(int chunkStart, int chunkEnd, int i);

        private static void LoopStartEnd(StartEndCallback callback, int chunks, long fileSize)
        {
            int lastChunkEnd = 0;
            for (int i = 0; i < chunks; i++)
            {
                int chunkStart, chunkEnd;

                if (i == 0)
                {
                    chunkStart = 0;
                    lastChunkEnd = chunkEnd = (int)Math.Min(fileSize, BYTE_CHUNK_SIZE);
                }
                else
                {
                    chunkStart = lastChunkEnd;
                    lastChunkEnd = chunkEnd = (int)Math.Min(fileSize, lastChunkEnd + BYTE_CHUNK_SIZE);
                }

                callback(chunkStart, chunkEnd, i);
            }
        }

        #region Crypto

        private static string GenerateRandomKey()
        {
            return Guid.NewGuid().ToString(); // The web client uses random uuids as keys
        }

        private static Vault_oooCryptoData DeriveCryptoData(byte[] key)
        {
            byte[] salt = new byte[8]; // 8 bytes salt like in the web client
            RandomNumberGenerator rng = RandomNumberGenerator.Create(); // Cryptographically secure
            rng.GetBytes(salt);

            Rfc2898DeriveBytes rfcDeriver = new Rfc2898DeriveBytes(key, salt, PBKDF2_ITERATIONS, HashAlgorithmName.SHA256);

            return new Vault_oooCryptoData
            {
                Salt = salt,
                Key = rfcDeriver.GetBytes(AES_KEY_SIZE / 8), // Derive the bytes from the rfcDeriver; Divide by 8 to input byte count
                IV = rfcDeriver.GetBytes(AES_BLOCK_SIZE / 8)
            };
        }

        private static byte[] EncryptBytes(Vault_oooCryptoData crypto, byte[] bytes)
        {
            using (SymmetricAlgorithm aes = Aes.Create())
            {
                aes.Mode = CipherMode.CBC;
                aes.KeySize = AES_KEY_SIZE;
                aes.BlockSize = AES_BLOCK_SIZE;

                aes.Key = crypto.Key;
                aes.IV = crypto.IV;

                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, aes.CreateEncryptor(crypto.Key, crypto.IV), CryptoStreamMode.Write))
                    {
                        cs.Write(bytes, 0, bytes.Length); // Write all bytes into the CryptoStream
                        cs.Close();
                        return ms.ToArray();
                    }
                }
            }
        }

        private class Vault_oooCryptoData
        {
            public byte[] Salt { get; set; }
            public byte[] Key { get; set; }
            public byte[] IV { get; set; }
        }

        #endregion

        private class Vault_oooMetaInfo
        {
            [JsonProperty("urlPathName")]
            public string UrlPathName { get; set; }

            [JsonProperty("token")]
            public string Token { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: YouTube.cs]---
Location: ShareX-develop/ShareX.UploadersLib/FileUploaders/YouTube.cs

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
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX.UploadersLib.FileUploaders
{
    public class YouTubeFileUploaderService : FileUploaderService
    {
        public override FileDestination EnumValue { get; } = FileDestination.YouTube;

        public override Image ServiceImage => Resources.YouTube;

        public override bool CheckConfig(UploadersConfig config)
        {
            return OAuth2Info.CheckOAuth(config.YouTubeOAuth2Info);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new YouTube(config.YouTubeOAuth2Info)
            {
                PrivacyType = config.YouTubePrivacyType,
                UseShortenedLink = config.YouTubeUseShortenedLink,
                ShowDialog = config.YouTubeShowDialog
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpYouTube;
    }

    public sealed class YouTube : FileUploader, IOAuth2
    {
        public GoogleOAuth2 OAuth2 { get; private set; }
        public OAuth2Info AuthInfo => OAuth2.AuthInfo;
        public YouTubeVideoPrivacy PrivacyType { get; set; }
        public bool UseShortenedLink { get; set; }
        public bool ShowDialog { get; set; }

        public YouTube(OAuth2Info oauth)
        {
            OAuth2 = new GoogleOAuth2(oauth, this)
            {
                Scope = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile"
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

            string title = Path.GetFileNameWithoutExtension(fileName);
            string description = "";
            YouTubeVideoPrivacy visibility = PrivacyType;

            if (ShowDialog)
            {
                using (YouTubeVideoOptionsForm form = new YouTubeVideoOptionsForm(title, description, visibility))
                {
                    if (form.ShowDialog() == DialogResult.OK)
                    {
                        title = form.Title;
                        description = form.Description;
                        visibility = form.Visibility;
                    }
                    else
                    {
                        return null;
                    }
                }
            }

            YouTubeVideoUpload uploadVideo = new YouTubeVideoUpload()
            {
                snippet = new YouTubeVideoSnippet()
                {
                    title = title,
                    description = description
                },
                status = new YouTubeVideoStatusUpload()
                {
                    privacyStatus = visibility
                }
            };

            string metadata = JsonConvert.SerializeObject(uploadVideo);

            UploadResult result = SendRequestFile("https://www.googleapis.com/upload/youtube/v3/videos?part=id,snippet,status", stream, fileName, "file",
                headers: OAuth2.GetAuthHeaders(), relatedData: metadata);

            if (!string.IsNullOrEmpty(result.Response))
            {
                YouTubeVideoResponse responseVideo = JsonConvert.DeserializeObject<YouTubeVideoResponse>(result.Response);

                if (responseVideo != null)
                {
                    if (UseShortenedLink)
                    {
                        result.URL = $"https://youtu.be/{responseVideo.id}";
                    }
                    else
                    {
                        result.URL = $"https://www.youtube.com/watch?v={responseVideo.id}";
                    }

                    switch (responseVideo.status.uploadStatus)
                    {
                        case YouTubeVideoStatus.UploadFailed:
                            Errors.Add("Upload failed: " + responseVideo.status.failureReason);
                            break;
                        case YouTubeVideoStatus.UploadRejected:
                            Errors.Add("Upload rejected: " + responseVideo.status.rejectionReason);
                            break;
                    }
                }
            }

            return result;
        }
    }

    public class YouTubeVideoUpload
    {
        public YouTubeVideoSnippet snippet { get; set; }
        public YouTubeVideoStatusUpload status { get; set; }
    }

    public class YouTubeVideoResponse
    {
        public string id { get; set; }
        public YouTubeVideoSnippet snippet { get; set; }
        public YouTubeVideoStatus status { get; set; }
    }

    public class YouTubeVideoSnippet
    {
        public string title { get; set; }
        public string description { get; set; }
        public string[] tags { get; set; }
    }

    public class YouTubeVideoStatus
    {
        public const string UploadFailed = "failed";
        public const string UploadRejected = "rejected";

        public YouTubeVideoPrivacy privacyStatus { get; set; }
        public string uploadStatus { get; set; }
        public string failureReason { get; set; }
        public string rejectionReason { get; set; }
    }

    public class YouTubeVideoStatusUpload
    {
        public YouTubeVideoPrivacy privacyStatus { get; set; }
    }
}
```

--------------------------------------------------------------------------------

````
