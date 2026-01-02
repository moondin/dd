---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 256
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 256 of 650)

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

---[FILE: StringExtensions.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Extensions/StringExtensions.cs

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
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace ShareX.HelpersLib
{
    public static class StringExtensions
    {
        public static bool Contains(this string str, string value, StringComparison comparisonType)
        {
            return str.IndexOf(value, comparisonType) >= 0;
        }

        public static string Left(this string str, int length)
        {
            if (length < 1) return "";
            if (length < str.Length) return str.Substring(0, length);
            return str;
        }

        public static string Right(this string str, int length)
        {
            if (length < 1) return "";
            if (length < str.Length) return str.Substring(str.Length - length);
            return str;
        }

        public static string RemoveLeft(this string str, int length)
        {
            if (length < 1) return "";
            if (length < str.Length) return str.Remove(0, length);
            return str;
        }

        public static string RemoveRight(this string str, int length)
        {
            if (length < 1) return "";
            if (length < str.Length) return str.Remove(str.Length - length);
            return str;
        }

        public static string Between(this string text, string first, string last, bool isFirstMatchForEnd = false, bool includeFirstAndLast = false)
        {
            int start = text.IndexOf(first);
            if (start < 0) return null;
            if (!includeFirstAndLast) start += first.Length;
            text = text.Substring(start);

            int end = isFirstMatchForEnd ? text.IndexOf(last) : text.LastIndexOf(last);
            if (end < 0) return null;
            if (includeFirstAndLast) end += last.Length;
            return text.Remove(end);
        }

        public static string Repeat(this string str, int count)
        {
            if (!string.IsNullOrEmpty(str) && count > 0)
            {
                StringBuilder sb = new StringBuilder(str.Length * count);

                for (int i = 0; i < count; i++)
                {
                    sb.Append(str);
                }

                return sb.ToString();
            }

            return null;
        }

        public static string Replace(this string str, string oldValue, string newValue, StringComparison comparison)
        {
            if (string.IsNullOrEmpty(str) || string.IsNullOrEmpty(oldValue))
            {
                return str;
            }

            StringBuilder sb = new StringBuilder();

            int previousIndex = 0;
            int index = str.IndexOf(oldValue, comparison);
            while (index != -1)
            {
                sb.Append(str.Substring(previousIndex, index - previousIndex));
                sb.Append(newValue);
                index += oldValue.Length;

                previousIndex = index;
                index = str.IndexOf(oldValue, index, comparison);
            }
            sb.Append(str.Substring(previousIndex));

            return sb.ToString();
        }

        public static string ReplaceWith(this string str, string search, string replace,
            int occurrence = 0, StringComparison comparison = StringComparison.OrdinalIgnoreCase)
        {
            if (!string.IsNullOrEmpty(search))
            {
                int count = 0, location;

                while (occurrence == 0 || occurrence > count)
                {
                    location = str.IndexOf(search, comparison);
                    if (location < 0) break;
                    count++;
                    str = str.Remove(location, search.Length).Insert(location, replace);
                }
            }

            return str;
        }

        public static bool ReplaceFirst(this string text, string search, string replace, out string result)
        {
            int location = text.IndexOf(search);

            if (location < 0)
            {
                result = text;
                return false;
            }

            result = text.Remove(location, search.Length).Insert(location, replace);
            return true;
        }

        public static string ReplaceAll(this string text, string search, Func<string> replace)
        {
            while (true)
            {
                int location = text.IndexOf(search);

                if (location < 0) break;

                text = text.Remove(location, search.Length).Insert(location, replace());
            }

            return text;
        }

        public static string BatchReplace(this string text, Dictionary<string, string> replace, StringComparison comparisonType = StringComparison.CurrentCulture)
        {
            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < text.Length; i++)
            {
                string current = text.Substring(i);

                bool replaced = false;

                foreach (KeyValuePair<string, string> entry in replace)
                {
                    if (current.StartsWith(entry.Key, comparisonType))
                    {
                        if (!string.IsNullOrEmpty(entry.Value))
                        {
                            sb.Append(entry.Value);
                        }

                        i += entry.Key.Length - 1;
                        replaced = true;
                        break;
                    }
                }

                if (!replaced)
                {
                    sb.Append(text[i]);
                }
            }

            return sb.ToString();
        }

        public static string RemoveWhiteSpaces(this string str)
        {
            return new string(str.Where(c => !char.IsWhiteSpace(c)).ToArray());
        }

        public static string Reverse(this string str)
        {
            char[] chars = str.ToCharArray();
            Array.Reverse(chars);
            return new string(chars);
        }

        public static string Truncate(this string str, int maxLength)
        {
            if (!string.IsNullOrEmpty(str) && str.Length > maxLength)
            {
                return str.Substring(0, maxLength);
            }

            return str;
        }

        public static string Truncate(this string str, int maxLength, string endings, bool truncateFromRight = true)
        {
            if (!string.IsNullOrEmpty(str) && str.Length > maxLength)
            {
                int length = maxLength - endings.Length;

                if (length > 0)
                {
                    if (truncateFromRight)
                    {
                        str = str.Left(length) + endings;
                    }
                    else
                    {
                        str = endings + str.Right(length);
                    }
                }
            }

            return str;
        }

        public static byte[] HexToBytes(this string hex)
        {
            byte[] bytes = new byte[hex.Length / 2];
            for (int i = 0; i < bytes.Length; i++)
            {
                bytes[i] = Convert.ToByte(hex.Substring(i * 2, 2), 16);
            }
            return bytes;
        }

        public static string ParseQuoteString(this string str)
        {
            str = str.Trim();

            int firstQuote = str.IndexOf('"');

            if (firstQuote >= 0)
            {
                str = str.Substring(firstQuote + 1);

                int secondQuote = str.IndexOf('"');

                if (secondQuote >= 0)
                {
                    str = str.Remove(secondQuote);
                }
            }

            return str;
        }

        public static bool IsNumber(this string text)
        {
            return int.TryParse(text, out _);
        }

        public static string[] Lines(this string text)
        {
            return text.Split(new string[] { "\r\n", "\n" }, StringSplitOptions.None);
        }

        public static string ReplaceNewLines(this string text, string replacement = "\r\n")
        {
            return Regex.Replace(text, @"\r\n?|\n", replacement);
        }

        public static IEnumerable<Tuple<string, string>> ForEachBetween(this string text, string front, string back)
        {
            int f = 0;
            int b;
            while (text.Length > f && (f = text.IndexOf(front, f)) >= 0 && (b = text.IndexOf(back, f + front.Length)) >= 0)
            {
                string result = text.Substring(f, (b + back.Length) - f);
                yield return new Tuple<string, string>(result, result.Substring(front.Length, (result.Length - back.Length) - front.Length));
                f += front.Length;
            }
        }

        public static int FromBase(this string text, int radix, string digits)
        {
            if (string.IsNullOrEmpty(digits))
            {
                throw new ArgumentNullException("digits", string.Format("Digits must contain character value representations"));
            }

            radix = Math.Abs(radix);
            if (radix > digits.Length || radix < 2)
            {
                throw new ArgumentOutOfRangeException("radix", radix, string.Format("Radix has to be > 2 and < {0}", digits.Length));
            }

            // Convert to Base 10
            int value = 0;
            if (!string.IsNullOrEmpty(text))
            {
                for (int i = text.Length - 1; i >= 0; --i)
                {
                    int temp = digits.IndexOf(text[i]) * (int)Math.Pow(radix, text.Length - (i + 1));
                    if (temp < 0)
                    {
                        throw new IndexOutOfRangeException("Text contains characters not found in digits.");
                    }
                    value += temp;
                }
            }
            return value;
        }

        public static string ToBase(this string text, int fromRadix, string fromDigits, int toRadix, string toDigits)
        {
            return text.FromBase(fromRadix, fromDigits).ToBase(toRadix, toDigits);
        }

        public static string ToBase(this string text, int from, int to, string digits)
        {
            return text.FromBase(from, digits).ToBase(to, digits);
        }

        public static string PadCenter(this string str, int totalWidth, char paddingChar = ' ')
        {
            int padding = totalWidth - str.Length;
            int padLeft = (padding / 2) + str.Length;
            return str.PadLeft(padLeft, paddingChar).PadRight(totalWidth, paddingChar);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: XMLExtensions.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Extensions/XMLExtensions.cs

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
using System.Xml;
using System.Xml.Linq;

namespace ShareX.HelpersLib
{
    public static class XMLExtensions
    {
        public static XElement GetNode(this XContainer element, string path)
        {
            path = path.Trim().Trim('/');

            if (element != null && !string.IsNullOrEmpty(path))
            {
                XContainer lastElement = element;

                string[] splitPath = path.Split('/');

                if (splitPath.Length > 0)
                {
                    foreach (string name in splitPath)
                    {
                        if (name.Contains('|'))
                        {
                            string[] splitName = name.Split('|');

                            XContainer lastElement2 = null;

                            foreach (string name2 in splitName)
                            {
                                lastElement2 = lastElement.Element(name2);
                                if (lastElement2 != null) break;
                            }

                            lastElement = lastElement2;
                        }
                        else
                        {
                            lastElement = lastElement.Element(name);
                        }

                        if (lastElement == null) return null;
                    }

                    return (XElement)lastElement;
                }
            }

            return null;
        }

        public static XElement[] GetNodes(this XContainer element, string path)
        {
            path = path.Trim().Trim('/');

            if (element != null && !string.IsNullOrEmpty(path))
            {
                int index = path.LastIndexOf('/');

                if (index > -1)
                {
                    string leftPath = path.Left(index);
                    string lastPath = path.RemoveLeft(index + 1);

                    XElement lastNode = element.GetNode(leftPath);

                    if (lastNode != null)
                    {
                        return lastNode.Elements(lastPath).Where(x => x != null).ToArray();
                    }
                }
            }

            return null;
        }

        public static string GetValue(this XContainer element, string path, string defaultValue = null)
        {
            XElement xe = element.GetNode(path);

            if (xe != null) return xe.Value;

            return defaultValue;
        }

        public static XElement GetElement(this XElement xe, params string[] elements)
        {
            XElement result = null;

            if (xe != null && elements != null && elements.Length > 0)
            {
                result = xe;

                foreach (string element in elements)
                {
                    result = result.Element(element);
                    if (result == null) break;
                }
            }

            return result;
        }

        public static XElement GetElement(this XDocument xd, params string[] elements)
        {
            if (xd != null && elements != null && elements.Length > 0)
            {
                XElement result = xd.Root;

                if (result.Name == elements[0])
                {
                    for (int i = 1; i < elements.Length; i++)
                    {
                        result = result.Element(elements[i]);
                        if (result == null) break;
                    }

                    return result;
                }
            }

            return null;
        }

        public static string GetElementValue(this XElement xe, XName name)
        {
            if (xe != null)
            {
                XElement xeItem = xe.Element(name);
                if (xeItem != null) return xeItem.Value;
            }

            return "";
        }

        public static string GetAttributeValue(this XElement xe, string name)
        {
            if (xe != null)
            {
                XAttribute xaItem = xe.Attribute(name);
                if (xaItem != null) return xaItem.Value;
            }

            return "";
        }

        public static string GetAttributeFirstValue(this XElement xe, params string[] names)
        {
            string value;
            foreach (string name in names)
            {
                value = xe.GetAttributeValue(name);
                if (!string.IsNullOrEmpty(value))
                {
                    return value;
                }
            }

            return "";
        }

        public static XmlNode AppendElement(this XmlNode parent, string tagName)
        {
            return parent.AppendElement(tagName, null, false);
        }

        public static XmlNode AppendElement(this XmlNode parent, string tagName, string textContent, bool checkTextContent = true)
        {
            if (!checkTextContent || !string.IsNullOrEmpty(textContent))
            {
                XmlDocument xd;

                if (parent is XmlDocument document)
                {
                    xd = document;
                }
                else
                {
                    xd = parent.OwnerDocument;
                }

                XmlNode node = xd.CreateElement(tagName);
                parent.AppendChild(node);

                if (textContent != null)
                {
                    XmlNode content = xd.CreateTextNode(textContent);
                    node.AppendChild(content);
                }

                return node;
            }

            return null;
        }

        public static XmlNode PrependElement(this XmlNode parent, string tagName)
        {
            return parent.PrependElement(tagName, null, false);
        }

        public static XmlNode PrependElement(this XmlNode parent, string tagName, string textContent, bool checkTextContent = true)
        {
            if (!checkTextContent || !string.IsNullOrEmpty(textContent))
            {
                XmlDocument xd;

                if (parent is XmlDocument document)
                {
                    xd = document;
                }
                else
                {
                    xd = parent.OwnerDocument;
                }

                XmlNode node = xd.CreateElement(tagName);
                parent.PrependChild(node);

                if (textContent != null)
                {
                    XmlNode content = xd.CreateTextNode(textContent);
                    node.PrependChild(content);
                }

                return node;
            }

            return null;
        }

        public static void WriteElementIfNotEmpty(this XmlTextWriter writer, string name, string value)
        {
            if (!string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(value))
            {
                writer.WriteElementString(name, value);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ClipboardViewerForm.ar-YE.resx]---
Location: ShareX-develop/ShareX.HelpersLib/Forms/ClipboardViewerForm.ar-YE.resx

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
  <data name="btnRefresh.Text" xml:space="preserve">
    <value>تحديث</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - عارض الحافظة</value>
  </data>
  <data name="btnClearClipboard.Text" xml:space="preserve">
    <value>مسح الحافظة</value>
  </data>
  <data name="chFormat.Text" xml:space="preserve">
    <value>البيانات</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: ClipboardViewerForm.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Forms/ClipboardViewerForm.cs

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
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public partial class ClipboardViewerForm : Form
    {
        public DataObject CurrentDataObject { get; private set; }

        public ClipboardViewerForm()
        {
            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);
        }

        private void ClipboardViewerForm_Load(object sender, EventArgs e)
        {
            RefreshClipboardContentList();
        }

        private void RefreshClipboardContentList()
        {
            ResetSelected();

            lvClipboardContentList.Items.Clear();

            try
            {
                CurrentDataObject = (DataObject)Clipboard.GetDataObject();
                if (CurrentDataObject != null)
                {
                    string[] formats = CurrentDataObject.GetFormats();
                    if (formats != null && formats.Length > 0)
                    {
                        foreach (string format in formats)
                        {
                            ListViewItem lvi = new ListViewItem(format);
                            lvClipboardContentList.Items.Add(lvi);
                        }

                        lvClipboardContentList.Items[0].Selected = true;
                    }
                }
            }
            catch (Exception e)
            {
                e.ShowError();
            }
        }

        private void UpdateSelectedClipboardContent()
        {
            ResetSelected();

            if (lvClipboardContentList.SelectedItems.Count > 0)
            {
                ListViewItem lvi = lvClipboardContentList.SelectedItems[0];
                string format = lvi.Text;

                if (CurrentDataObject != null)
                {
                    object data = CurrentDataObject.GetData(format);

                    if (data != null)
                    {
                        try
                        {
                            switch (data)
                            {
                                case MemoryStream ms:
                                    if (format.Equals(ClipboardHelpers.FORMAT_PNG, StringComparison.OrdinalIgnoreCase))
                                    {
                                        using (Bitmap bmp = new Bitmap(ms))
                                        {
                                            Bitmap clonedImage = ClipboardHelpersEx.CloneImage(bmp);
                                            LoadImage(clonedImage);
                                        }
                                    }
                                    else if (format.Equals(DataFormats.Dib, StringComparison.OrdinalIgnoreCase))
                                    {
                                        Bitmap bmp = ClipboardHelpersEx.ImageFromClipboardDib(ms.ToArray());
                                        LoadImage(bmp);
                                    }
                                    else if (format.Equals(ClipboardHelpers.FORMAT_17, StringComparison.OrdinalIgnoreCase))
                                    {
                                        Bitmap bmp = ClipboardHelpersEx.DIBV5ToBitmap(ms.ToArray());
                                        LoadImage(bmp);
                                    }
                                    else
                                    {
                                        LoadText(data.ToString());
                                    }
                                    break;
                                case Bitmap bmp:
                                    LoadImage(bmp);
                                    break;
                                default:
                                    LoadText(data.ToString());
                                    break;
                            }
                        }
                        catch (Exception e)
                        {
                            e.ShowError();
                        }
                    }
                }
            }
        }

        private void ResetSelected()
        {
            txtSelectedClipboardContent.Visible = false;
            txtSelectedClipboardContent.Clear();

            pbSelectedClipboardContent.Visible = false;
            pbSelectedClipboardContent.Reset();
        }

        private void LoadImage(Bitmap bmp)
        {
            pbSelectedClipboardContent.LoadImage(bmp);
            pbSelectedClipboardContent.Visible = true;
        }

        private void LoadText(string text)
        {
            txtSelectedClipboardContent.Text = text;
            txtSelectedClipboardContent.Visible = true;
        }

        private void btnRefresh_Click(object sender, EventArgs e)
        {
            RefreshClipboardContentList();
        }

        private void btnClearClipboard_Click(object sender, EventArgs e)
        {
            ClipboardHelpers.Clear();
            RefreshClipboardContentList();
        }

        private void lvClipboardContentList_SelectedIndexChanged(object sender, EventArgs e)
        {
            UpdateSelectedClipboardContent();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ClipboardViewerForm.de.resx]---
Location: ShareX-develop/ShareX.HelpersLib/Forms/ClipboardViewerForm.de.resx

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
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Zwischenablage-Betrachter</value>
  </data>
  <data name="btnRefresh.Text" xml:space="preserve">
    <value>Aktualisieren</value>
  </data>
  <data name="btnClearClipboard.Text" xml:space="preserve">
    <value>Leeren</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
