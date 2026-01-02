---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 253
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 253 of 650)

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

---[FILE: BlackStyleProgressBar.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/BlackStyle/BlackStyleProgressBar.cs

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
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class BlackStyleProgressBar : Control
    {
        [DefaultValue(0)]
        public int Minimum
        {
            get
            {
                return minimum;
            }
            set
            {
                if (minimum != value)
                {
                    if (value < 0)
                    {
                        throw new ArgumentOutOfRangeException(nameof(Minimum));
                    }

                    if (maximum < value)
                    {
                        maximum = value;
                    }

                    minimum = value;

                    if (this.value < minimum)
                    {
                        this.value = minimum;
                    }

                    Invalidate();
                }
            }
        }

        private int minimum;

        [DefaultValue(100)]
        public int Maximum
        {
            get
            {
                return maximum;
            }
            set
            {
                if (maximum != value)
                {
                    if (value < 0)
                    {
                        throw new ArgumentOutOfRangeException(nameof(Maximum));
                    }

                    if (minimum > value)
                    {
                        minimum = value;
                    }

                    maximum = value;

                    if (this.value > maximum)
                    {
                        this.value = maximum;
                    }

                    Invalidate();
                }
            }
        }

        private int maximum;

        [DefaultValue(0)]
        public int Value
        {
            get
            {
                return value;
            }
            set
            {
                if (this.value != value)
                {
                    if (value < minimum || value > maximum)
                    {
                        throw new ArgumentOutOfRangeException(nameof(Value));
                    }

                    this.value = value;

                    Invalidate();
                }
            }
        }

        private int value;

        [DefaultValue(false)]
        public bool ShowPercentageText
        {
            get
            {
                return showPercentageText;
            }
            set
            {
                if (showPercentageText != value)
                {
                    showPercentageText = value;

                    Invalidate();
                }
            }
        }

        private bool showPercentageText;

        public override string Text
        {
            get
            {
                return text;
            }
            set
            {
                if (text != value)
                {
                    text = value;

                    Invalidate();
                }
            }
        }

        private string text;

        public BlackStyleProgressBar()
        {
            SetStyle(ControlStyles.UserPaint | ControlStyles.AllPaintingInWmPaint | ControlStyles.ResizeRedraw | ControlStyles.OptimizedDoubleBuffer | ControlStyles.SupportsTransparentBackColor, true);

            minimum = 0;
            maximum = 100;
            value = 0;
        }

        protected override void OnPaint(PaintEventArgs pe)
        {
            base.OnPaint(pe);

            Graphics g = pe.Graphics;

            DrawBackground(g);

            if (Value > Minimum && Value <= Maximum)
            {
                DrawProgressBar(g);

                if (!string.IsNullOrEmpty(Text))
                {
                    DrawText(g, Text);
                }
                else if (ShowPercentageText)
                {
                    DrawText(g, Value + "%");
                }
            }
        }

        private void DrawBackground(Graphics g)
        {
            using (LinearGradientBrush backgroundBrush = new LinearGradientBrush(new Rectangle(1, 1, ClientSize.Width - 2, ClientSize.Height - 2),
                Color.FromArgb(50, 50, 50), Color.FromArgb(60, 60, 60), LinearGradientMode.Vertical))
            {
                g.FillRectangle(backgroundBrush, new Rectangle(1, 1, ClientSize.Width - 2, ClientSize.Height - 2));
            }

            using (Pen borderShadowPen = new Pen(Color.FromArgb(45, 45, 45)))
            {
                g.DrawLine(borderShadowPen, new Point(1, 1), new Point(ClientSize.Width - 2, 1));
                g.DrawLine(borderShadowPen, new Point(ClientSize.Width - 2, 1), new Point(ClientSize.Width - 2, ClientSize.Height - 2));
            }

            using (Pen borderPen = new Pen(Color.FromArgb(30, 30, 30)))
            {
                g.DrawRectangle(borderPen, new Rectangle(0, 0, ClientSize.Width - 1, ClientSize.Height - 1));
            }
        }

        private void DrawProgressBar(Graphics g)
        {
            double progressBarSize = (double)Value / Maximum * (ClientSize.Width - 2);
            Rectangle progressBarRect = new Rectangle(1, 1, (int)progressBarSize, ClientSize.Height - 2);

            using (LinearGradientBrush progressBarBrush = new LinearGradientBrush(progressBarRect, Color.Black, Color.Black, LinearGradientMode.Vertical))
            {
                ColorBlend cb = new ColorBlend();
                cb.Positions = new float[] { 0, 0.49f, 0.50f, 1 };
                cb.Colors = new Color[] { Color.FromArgb(102, 163, 226), Color.FromArgb(83, 135, 186), Color.FromArgb(75, 121, 175), Color.FromArgb(56, 93, 135) };
                progressBarBrush.InterpolationColors = cb;

                g.FillRectangle(progressBarBrush, progressBarRect);
            }

            using (LinearGradientBrush innerBorderBrush = new LinearGradientBrush(progressBarRect, Color.FromArgb(133, 192, 241), Color.FromArgb(76, 119, 163), LinearGradientMode.Vertical))
            using (Pen innerBorderPen = new Pen(innerBorderBrush))
            {
                g.DrawRectangle(innerBorderPen, new Rectangle(progressBarRect.X, progressBarRect.Y, progressBarRect.Width - 1, progressBarRect.Height - 1));
            }
        }

        private void DrawText(Graphics g, string text)
        {
            TextRenderer.DrawText(g, text, Font, ClientRectangle.LocationOffset(0, 1), Color.Black, TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter);
            TextRenderer.DrawText(g, text, Font, ClientRectangle, ForeColor, TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Crc32.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Cryptographic/Crc32.cs

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

using System.Security.Cryptography;

namespace ShareX.HelpersLib
{
    // http://damieng.com/blog/2006/08/08/calculating_crc32_in_c_and_net
    public class Crc32 : HashAlgorithm
    {
        public const uint DefaultPolynomial = 0xedb88320;
        public const uint DefaultSeed = 0xffffffff;

        private uint hash;
        private uint seed;
        private uint[] table;
        private static uint[] defaultTable;

        public Crc32()
        {
            table = InitializeTable(DefaultPolynomial);
            seed = DefaultSeed;
            Initialize();
        }

        public Crc32(uint polynomial, uint seed)
        {
            table = InitializeTable(polynomial);
            this.seed = seed;
            Initialize();
        }

        public override void Initialize()
        {
            hash = seed;
        }

        protected override void HashCore(byte[] buffer, int start, int length)
        {
            hash = CalculateHash(table, hash, buffer, start, length);
        }

        protected override byte[] HashFinal()
        {
            byte[] hashBuffer = uintToBigEndianBytes(~hash);
            HashValue = hashBuffer;
            return hashBuffer;
        }

        public override int HashSize
        {
            get
            {
                return 32;
            }
        }

        public static uint Compute(byte[] buffer)
        {
            return ~CalculateHash(InitializeTable(DefaultPolynomial), DefaultSeed, buffer, 0, buffer.Length);
        }

        public static uint Compute(uint seed, byte[] buffer)
        {
            return ~CalculateHash(InitializeTable(DefaultPolynomial), seed, buffer, 0, buffer.Length);
        }

        public static uint Compute(uint polynomial, uint seed, byte[] buffer)
        {
            return ~CalculateHash(InitializeTable(polynomial), seed, buffer, 0, buffer.Length);
        }

        private static uint[] InitializeTable(uint polynomial)
        {
            if (polynomial == DefaultPolynomial && defaultTable != null)
            {
                return defaultTable;
            }

            uint[] createTable = new uint[256];
            for (int i = 0; i < 256; i++)
            {
                uint entry = (uint)i;
                for (int j = 0; j < 8; j++)
                {
                    if ((entry & 1) == 1)
                    {
                        entry = (entry >> 1) ^ polynomial;
                    }
                    else
                    {
                        entry >>= 1;
                    }
                }
                createTable[i] = entry;
            }

            if (polynomial == DefaultPolynomial)
            {
                defaultTable = createTable;
            }

            return createTable;
        }

        private static uint CalculateHash(uint[] table, uint seed, byte[] buffer, int start, int size)
        {
            uint crc = seed;
            for (int i = start; i < size; i++)
            {
                unchecked
                {
                    crc = (crc >> 8) ^ table[buffer[i] ^ crc & 0xff];
                }
            }
            return crc;
        }

        private byte[] uintToBigEndianBytes(uint x)
        {
            return new byte[]
            {
                (byte)((x >> 24) & 0xff),
                (byte)((x >> 16) & 0xff),
                (byte)((x >> 8) & 0xff),
                (byte)(x & 0xff)
            };
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DPAPI.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Cryptographic/DPAPI.cs

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

namespace ShareX.HelpersLib
{
    // https://en.wikipedia.org/wiki/Data_Protection_API
    public static class DPAPI
    {
        public static string Encrypt(string stringToEncrypt, string optionalEntropy = null, DataProtectionScope scope = DataProtectionScope.CurrentUser)
        {
            byte[] data = Encoding.UTF8.GetBytes(stringToEncrypt);
            return Encrypt(data, optionalEntropy, scope);
        }

        public static string Encrypt(byte[] data, string optionalEntropy = null, DataProtectionScope scope = DataProtectionScope.CurrentUser)
        {
            byte[] entropyData = null;
            if (optionalEntropy != null)
            {
                entropyData = Encoding.UTF8.GetBytes(optionalEntropy);
            }
            return Encrypt(data, entropyData, scope);
        }

        public static string Encrypt(byte[] data, byte[] optionalEntropy = null, DataProtectionScope scope = DataProtectionScope.CurrentUser)
        {
            byte[] encryptedData = ProtectedData.Protect(data, optionalEntropy, scope);
            return Convert.ToBase64String(encryptedData);
        }

        public static string Decrypt(string encryptedString, string optionalEntropy = null, DataProtectionScope scope = DataProtectionScope.CurrentUser)
        {
            byte[] encryptedData = Convert.FromBase64String(encryptedString);
            return Decrypt(encryptedData, optionalEntropy, scope);
        }

        public static string Decrypt(byte[] encryptedData, string optionalEntropy = null, DataProtectionScope scope = DataProtectionScope.CurrentUser)
        {
            byte[] entropyData = null;
            if (optionalEntropy != null)
            {
                entropyData = Encoding.UTF8.GetBytes(optionalEntropy);
            }
            return Decrypt(encryptedData, entropyData, scope);
        }

        public static string Decrypt(byte[] encryptedData, byte[] optionalEntropy = null, DataProtectionScope scope = DataProtectionScope.CurrentUser)
        {
            byte[] decryptedData = ProtectedData.Unprotect(encryptedData, optionalEntropy, scope);
            return Encoding.UTF8.GetString(decryptedData);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HashChecker.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Cryptographic/HashChecker.cs

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
using System.Diagnostics;
using System.IO;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;

namespace ShareX.HelpersLib
{
    public class HashChecker
    {
        public bool IsWorking { get; private set; }

        public delegate void ProgressChanged(float progress);
        public event ProgressChanged FileCheckProgressChanged;

        private CancellationTokenSource cts;

        private void OnProgressChanged(float percentage)
        {
            FileCheckProgressChanged?.Invoke(percentage);
        }

        public async Task<string> Start(string filePath, HashType hashType)
        {
            string result = null;

            if (!IsWorking && !string.IsNullOrEmpty(filePath) && File.Exists(filePath))
            {
                IsWorking = true;

                Progress<float> progress = new Progress<float>(OnProgressChanged);

                using (cts = new CancellationTokenSource())
                {
                    result = await Task.Run(() =>
                    {
                        try
                        {
                            return HashCheckThread(filePath, hashType, progress, cts.Token);
                        }
                        catch (OperationCanceledException)
                        {
                        }

                        return null;
                    }, cts.Token);
                }

                IsWorking = false;
            }

            return result;
        }

        public void Stop()
        {
            cts?.Cancel();
        }

        private string HashCheckThread(string filePath, HashType hashType, IProgress<float> progress, CancellationToken ct)
        {
            using (FileStream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
            using (HashAlgorithm hash = GetHashAlgorithm(hashType))
            using (CryptoStream cs = new CryptoStream(stream, hash, CryptoStreamMode.Read))
            {
                long bytesRead, totalRead = 0;
                byte[] buffer = new byte[8192];
                Stopwatch timer = Stopwatch.StartNew();

                while ((bytesRead = cs.Read(buffer, 0, buffer.Length)) > 0 && !ct.IsCancellationRequested)
                {
                    totalRead += bytesRead;

                    if (timer.ElapsedMilliseconds > 200)
                    {
                        float percentage = (float)totalRead / stream.Length * 100;
                        progress.Report(percentage);

                        timer.Reset();
                        timer.Start();
                    }
                }

                if (ct.IsCancellationRequested)
                {
                    progress.Report(0);

                    ct.ThrowIfCancellationRequested();
                }
                else
                {
                    progress.Report(100);

                    string[] hex = TranslatorHelper.BytesToHexadecimal(hash.Hash);
                    return string.Concat(hex);
                }
            }

            return null;
        }

        public static HashAlgorithm GetHashAlgorithm(HashType hashType)
        {
            switch (hashType)
            {
                case HashType.CRC32:
                    return new Crc32();
                case HashType.MD5:
                    return MD5.Create();
                case HashType.SHA1:
                    return SHA1.Create();
                case HashType.SHA256:
                    return SHA256.Create();
                case HashType.SHA384:
                    return SHA384.Create();
                case HashType.SHA512:
                    return SHA512.Create();
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Translator.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Cryptographic/Translator.cs

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

using System.Text;

namespace ShareX.HelpersLib
{
    public class Translator
    {
        // http://en.wikipedia.org/wiki/UTF-8
        public string Text { get; private set; }

        // http://en.wikipedia.org/wiki/Binary_numeral_system
        public string[] Binary { get; private set; }

        public string BinaryText
        {
            get
            {
                if (Binary != null && Binary.Length > 0)
                {
                    return Binary.Join();
                }

                return null;
            }
        }

        // http://en.wikipedia.org/wiki/Hexadecimal
        public string[] Hexadecimal { get; private set; }

        public string HexadecimalText
        {
            get
            {
                if (Hexadecimal != null && Hexadecimal.Length > 0)
                {
                    return Hexadecimal.Join().ToUpperInvariant();
                }

                return null;
            }
        }

        // http://en.wikipedia.org/wiki/ASCII
        public byte[] ASCII { get; private set; }

        public string ASCIIText
        {
            get
            {
                if (ASCII != null && ASCII.Length > 0)
                {
                    return ASCII.Join();
                }

                return null;
            }
        }

        // http://en.wikipedia.org/wiki/Base64
        public string Base64 { get; private set; }

        // https://en.wikipedia.org/wiki/Cyclic_redundancy_check
        public string CRC32 { get; private set; }

        // http://en.wikipedia.org/wiki/MD5
        public string MD5 { get; private set; }

        // http://en.wikipedia.org/wiki/SHA-1
        public string SHA1 { get; private set; }

        // http://en.wikipedia.org/wiki/SHA-2
        public string SHA256 { get; private set; }
        public string SHA384 { get; private set; }
        public string SHA512 { get; private set; }

        public void Clear()
        {
            Text = Base64 = CRC32 = MD5 = SHA1 = SHA256 = SHA384 = SHA512 = null;
            Binary = null;
            Hexadecimal = null;
            ASCII = null;
        }

        public bool EncodeText(string text)
        {
            try
            {
                Clear();

                if (!string.IsNullOrEmpty(text))
                {
                    Text = text;
                    Binary = TranslatorHelper.TextToBinary(text);
                    Hexadecimal = TranslatorHelper.TextToHexadecimal(text);
                    ASCII = TranslatorHelper.TextToASCII(text);
                    Base64 = TranslatorHelper.TextToBase64(text);
                    CRC32 = TranslatorHelper.TextToHash(text, HashType.CRC32, true);
                    MD5 = TranslatorHelper.TextToHash(text, HashType.MD5, true);
                    SHA1 = TranslatorHelper.TextToHash(text, HashType.SHA1, true);
                    SHA256 = TranslatorHelper.TextToHash(text, HashType.SHA256, true);
                    SHA384 = TranslatorHelper.TextToHash(text, HashType.SHA384, true);
                    SHA512 = TranslatorHelper.TextToHash(text, HashType.SHA512, true);
                    return true;
                }
            }
            catch
            {
            }

            return false;
        }

        public bool DecodeBinary(string binary)
        {
            try
            {
                Text = TranslatorHelper.BinaryToText(binary);
                return !string.IsNullOrEmpty(Text);
            }
            catch
            {
            }

            Text = null;
            return false;
        }

        public bool DecodeHex(string hex)
        {
            try
            {
                Text = TranslatorHelper.HexadecimalToText(hex);
                return !string.IsNullOrEmpty(Text);
            }
            catch
            {
            }

            Text = null;
            return false;
        }

        public bool DecodeASCII(string ascii)
        {
            try
            {
                Text = TranslatorHelper.ASCIIToText(ascii);
                return !string.IsNullOrEmpty(Text);
            }
            catch
            {
            }

            Text = null;
            return false;
        }

        public bool DecodeBase64(string base64)
        {
            try
            {
                Text = TranslatorHelper.Base64ToText(base64);
                return !string.IsNullOrEmpty(Text);
            }
            catch
            {
            }

            Text = null;
            return false;
        }

        public string HashToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine($"CRC-32: {CRC32}");
            sb.AppendLine($"MD5: {MD5}");
            sb.AppendLine($"SHA-1: {SHA1}");
            sb.AppendLine($"SHA-256: {SHA256}");
            sb.AppendLine($"SHA-384: {SHA384}");
            sb.AppendLine($"SHA-512: {SHA512}");
            return sb.ToString();
        }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine($"Text: {Text}");
            sb.AppendLine($"Binary: {BinaryText}");
            sb.AppendLine($"Hexadecimal: {HexadecimalText}");
            sb.AppendLine($"ASCII: {ASCIIText}");
            sb.AppendLine($"Base64: {Base64}");
            sb.Append(HashToString());
            return sb.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TranslatorHelper.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Cryptographic/TranslatorHelper.cs

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
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace ShareX.HelpersLib
{
    public static class TranslatorHelper
    {
        #region Text to ...

        public static string[] TextToBinary(string text)
        {
            string[] result = new string[text.Length];

            for (int i = 0; i < text.Length; i++)
            {
                result[i] = ByteToBinary((byte)text[i]);
            }

            return result;
        }

        public static string[] TextToHexadecimal(string text)
        {
            return BytesToHexadecimal(Encoding.UTF8.GetBytes(text));
        }

        public static byte[] TextToASCII(string text)
        {
            return Encoding.ASCII.GetBytes(text);
        }

        public static string TextToBase64(string text)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(text);
            return Convert.ToBase64String(bytes);
        }

        public static string TextToHash(string text, HashType hashType, bool uppercase = false)
        {
            using (HashAlgorithm hash = HashChecker.GetHashAlgorithm(hashType))
            {
                byte[] bytes = hash.ComputeHash(Encoding.UTF8.GetBytes(text));
                string[] hex = BytesToHexadecimal(bytes);
                string result = string.Concat(hex);
                if (uppercase) result = result.ToUpperInvariant();
                return result;
            }
        }

        #endregion Text to ...

        #region Binary to ...

        public static byte BinaryToByte(string binary)
        {
            return Convert.ToByte(binary, 2);
        }

        public static string BinaryToText(string binary)
        {
            binary = Regex.Replace(binary, @"[^01]", "");

            using (MemoryStream stream = new MemoryStream())
            {
                for (int i = 0; i + 8 <= binary.Length; i += 8)
                {
                    stream.WriteByte(BinaryToByte(binary.Substring(i, 8)));
                }

                return Encoding.UTF8.GetString(stream.ToArray());
            }
        }

        #endregion Binary to ...

        #region Byte to ...

        public static string ByteToBinary(byte b)
        {
            char[] result = new char[8];
            int pos = 7;

            for (int i = 0; i < 8; i++)
            {
                if ((b & (1 << i)) != 0)
                {
                    result[pos] = '1';
                }
                else
                {
                    result[pos] = '0';
                }

                pos--;
            }

            return new string(result);
        }

        public static string[] BytesToHexadecimal(byte[] bytes)
        {
            string[] result = new string[bytes.Length];

            for (int i = 0; i < bytes.Length; i++)
            {
                result[i] = bytes[i].ToString("x2");
            }

            return result;
        }

        #endregion Byte to ...

        #region Hexadecimal to ...

        public static byte HexadecimalToByte(string hex)
        {
            return Convert.ToByte(hex, 16);
        }

        public static string HexadecimalToText(string hex)
        {
            hex = Regex.Replace(hex, @"[^0-9a-fA-F]", "");

            using (MemoryStream stream = new MemoryStream())
            {
                for (int i = 0; i + 2 <= hex.Length; i += 2)
                {
                    stream.WriteByte(HexadecimalToByte(hex.Substring(i, 2)));
                }

                return Encoding.UTF8.GetString(stream.ToArray());
            }
        }

        #endregion Hexadecimal to ...

        #region Base64 to ...

        public static string Base64ToText(string base64)
        {
            byte[] bytes = Convert.FromBase64String(base64);
            return Encoding.UTF8.GetString(bytes);
        }

        #endregion Base64 to ...

        #region ASCII to ...

        public static string ASCIIToText(string ascii)
        {
            string[] numbers = Regex.Split(ascii, @"\D+");

            using (MemoryStream stream = new MemoryStream())
            {
                foreach (string number in numbers)
                {
                    if (byte.TryParse(number, out byte b))
                    {
                        stream.WriteByte(b);
                    }
                }

                return Encoding.ASCII.GetString(stream.ToArray());
            }
        }

        #endregion ASCII to ...
    }
}
```

--------------------------------------------------------------------------------

---[FILE: EnumExtensions.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Extensions/EnumExtensions.cs

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

using ShareX.HelpersLib.Properties;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Resources;

namespace ShareX.HelpersLib
{
    public static class EnumExtensions
    {
        public const string HotkeyType_Category_Upload = "Upload";
        public const string HotkeyType_Category_ScreenCapture = "ScreenCapture";
        public const string HotkeyType_Category_ScreenRecord = "ScreenRecord";
        public const string HotkeyType_Category_Tools = "Tools";
        public const string HotkeyType_Category_Other = "Other";

        public static string GetDescription(this Enum value)
        {
            FieldInfo fi = value.GetType().GetField(value.ToString());

            if (fi != null)
            {
                DescriptionAttribute[] attributes = (DescriptionAttribute[])fi.GetCustomAttributes(typeof(DescriptionAttribute), false);

                if (attributes.Length > 0)
                {
                    return attributes[0].Description;
                }
            }

            return value.ToString();
        }

        public static string GetLocalizedDescription(this Enum value)
        {
            return value.GetLocalizedDescription(Resources.ResourceManager);
        }

        public static string GetLocalizedDescription(this Enum value, ResourceManager resourceManager)
        {
            string resourceName = value.GetType().Name + "_" + value;
            string description = resourceManager.GetString(resourceName);

            if (string.IsNullOrEmpty(description))
            {
                description = value.GetDescription();
            }

            return description;
        }

        public static string GetLocalizedCategory(this Enum value)
        {
            return value.GetLocalizedCategory(Resources.ResourceManager);
        }

        public static string GetLocalizedCategory(this Enum value, ResourceManager resourceManager)
        {
            string category = null;

            FieldInfo fi = value.GetType().GetField(value.ToString());

            if (fi != null)
            {
                CategoryAttribute[] attributes = (CategoryAttribute[])fi.GetCustomAttributes(typeof(CategoryAttribute), false);

                if (attributes.Length > 0)
                {
                    string resourceName = $"{value.GetType().Name}_Category_{attributes[0].Category}";
                    category = resourceManager.GetString(resourceName);
                }
            }

            return category;
        }

        public static int GetIndex(this Enum value)
        {
            Array values = Enum.GetValues(value.GetType());
            return Array.IndexOf(values, value);
        }

        public static IEnumerable<T> GetFlags<T>(this T value) where T : Enum
        {
            return Helpers.GetEnums<T>().Where(x => Convert.ToUInt64(x) != 0 && value.HasFlag(x));
        }

        public static bool HasFlag<T>(this Enum value, params T[] flags)
        {
            ulong keysVal = Convert.ToUInt64(value);
            ulong flagVal = flags.Select(x => Convert.ToUInt64(x)).Aggregate((x, next) => x | next);
            return (keysVal & flagVal) == flagVal;
        }

        public static bool HasFlagAny<T>(this Enum value, params T[] flags)
        {
            return flags.Any(x => value.HasFlag(x));
        }

        public static T Add<T>(this Enum value, params T[] flags)
        {
            ulong keysVal = Convert.ToUInt64(value);
            ulong flagVal = flags.Select(x => Convert.ToUInt64(x)).Aggregate(keysVal, (x, next) => x | next);
            return (T)Enum.ToObject(typeof(T), flagVal);
        }

        public static T Remove<T>(this Enum value, params T[] flags)
        {
            ulong keysVal = Convert.ToUInt64(value);
            ulong flagVal = flags.Select(x => Convert.ToUInt64(x)).Aggregate((x, next) => x | next);
            return (T)Enum.ToObject(typeof(T), keysVal & ~flagVal);
        }

        public static T Swap<T>(this Enum value, params T[] flags)
        {
            ulong keysVal = Convert.ToUInt64(value);
            ulong flagVal = flags.Select(x => Convert.ToUInt64(x)).Aggregate((x, next) => x | next);
            return (T)Enum.ToObject(typeof(T), keysVal ^ flagVal);
        }

        public static T Next<T>(this Enum value)
        {
            Array values = Enum.GetValues(value.GetType());
            int i = Array.IndexOf(values, value) + 1;
            return i == values.Length ? (T)values.GetValue(0) : (T)values.GetValue(i);
        }

        public static T Previous<T>(this Enum value)
        {
            Array values = Enum.GetValues(value.GetType());
            int i = Array.IndexOf(values, value) - 1;
            return i == -1 ? (T)values.GetValue(values.Length - 1) : (T)values.GetValue(i);
        }
    }
}
```

--------------------------------------------------------------------------------

````
