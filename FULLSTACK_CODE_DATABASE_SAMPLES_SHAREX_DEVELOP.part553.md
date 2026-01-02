---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 553
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 553 of 650)

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

---[FILE: CustomUploaderItem.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/CustomUploaderItem.cs

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
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace ShareX.UploadersLib
{
    public class CustomUploaderItem
    {
        [DefaultValue("")]
        public string Version { get; set; }

        [DefaultValue("")]
        public string Name { get; set; }

        public bool ShouldSerializeName() => !string.IsNullOrEmpty(Name) && Name != URLHelpers.GetHostName(RequestURL);

        [DefaultValue(CustomUploaderDestinationType.None)]
        public CustomUploaderDestinationType DestinationType { get; set; }

        [DefaultValue(HttpMethod.POST), JsonProperty(DefaultValueHandling = DefaultValueHandling.Include)]
        public HttpMethod RequestMethod { get; set; } = HttpMethod.POST;

        [DefaultValue("")]
        public string RequestURL { get; set; }

        [DefaultValue(null)]
        public Dictionary<string, string> Parameters { get; set; }

        public bool ShouldSerializeParameters() => Parameters != null && Parameters.Count > 0;

        [DefaultValue(null)]
        public Dictionary<string, string> Headers { get; set; }

        public bool ShouldSerializeHeaders() => Headers != null && Headers.Count > 0;

        [DefaultValue(CustomUploaderBody.None)]
        public CustomUploaderBody Body { get; set; }

        [DefaultValue(null)]
        public Dictionary<string, string> Arguments { get; set; }

        public bool ShouldSerializeArguments() => (Body == CustomUploaderBody.MultipartFormData || Body == CustomUploaderBody.FormURLEncoded) &&
            Arguments != null && Arguments.Count > 0;

        [DefaultValue("")]
        public string FileFormName { get; set; }

        public bool ShouldSerializeFileFormName() => Body == CustomUploaderBody.MultipartFormData && !string.IsNullOrEmpty(FileFormName);

        [DefaultValue("")]
        public string Data { get; set; }

        public bool ShouldSerializeData() => (Body == CustomUploaderBody.JSON || Body == CustomUploaderBody.XML) && !string.IsNullOrEmpty(Data);

        [DefaultValue("")]
        public string URL { get; set; }

        [DefaultValue("")]
        public string ThumbnailURL { get; set; }

        [DefaultValue("")]
        public string DeletionURL { get; set; }

        [DefaultValue("")]
        public string ErrorMessage { get; set; }

        private CustomUploaderItem()
        {
        }

        public static CustomUploaderItem Init()
        {
            return new CustomUploaderItem()
            {
                Version = Helpers.GetApplicationVersion(),
                RequestMethod = HttpMethod.POST,
                Body = CustomUploaderBody.MultipartFormData
            };
        }

        public override string ToString()
        {
            if (!string.IsNullOrEmpty(Name))
            {
                return Name;
            }

            string name = URLHelpers.GetHostName(RequestURL);

            if (!string.IsNullOrEmpty(name))
            {
                return name;
            }

            return "Name";
        }

        public string GetFileName()
        {
            return ToString() + ".sxcu";
        }

        public string GetRequestURL(CustomUploaderInput input)
        {
            if (string.IsNullOrEmpty(RequestURL))
            {
                throw new Exception(Resources.CustomUploaderItem_GetRequestURL_RequestURLMustBeConfigured);
            }

            ShareXCustomUploaderSyntaxParser parser = new ShareXCustomUploaderSyntaxParser(input);
            parser.URLEncode = true;
            string url = parser.Parse(RequestURL);

            url = URLHelpers.FixPrefix(url);

            Dictionary<string, string> parameters = GetParameters(input);
            return URLHelpers.CreateQueryString(url, parameters);
        }

        public Dictionary<string, string> GetParameters(CustomUploaderInput input)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            if (Parameters != null)
            {
                ShareXCustomUploaderSyntaxParser parser = new ShareXCustomUploaderSyntaxParser(input);
                parser.UseNameParser = true;

                foreach (KeyValuePair<string, string> parameter in Parameters)
                {
                    parameters.Add(parameter.Key, parser.Parse(parameter.Value));
                }
            }

            return parameters;
        }

        public string GetContentType()
        {
            switch (Body)
            {
                case CustomUploaderBody.MultipartFormData:
                    return RequestHelpers.ContentTypeMultipartFormData;
                case CustomUploaderBody.FormURLEncoded:
                    return RequestHelpers.ContentTypeURLEncoded;
                case CustomUploaderBody.JSON:
                    return RequestHelpers.ContentTypeJSON;
                case CustomUploaderBody.XML:
                    return RequestHelpers.ContentTypeXML;
                case CustomUploaderBody.Binary:
                    return RequestHelpers.ContentTypeOctetStream;
            }

            return null;
        }

        public string GetData(CustomUploaderInput input)
        {
            NameParser nameParser = new NameParser(NameParserType.Text);
            string result = nameParser.Parse(Data);

            Dictionary<string, string> replace = new Dictionary<string, string>();
            replace.Add("{input}", EncodeBodyData(input.Input));
            replace.Add("{filename}", EncodeBodyData(input.FileName));
            result = result.BatchReplace(replace, StringComparison.OrdinalIgnoreCase);

            return result;
        }

        private string EncodeBodyData(string input)
        {
            if (!string.IsNullOrEmpty(input))
            {
                if (Body == CustomUploaderBody.JSON)
                {
                    return URLHelpers.JSONEncode(input);
                }
                else if (Body == CustomUploaderBody.XML)
                {
                    return URLHelpers.XMLEncode(input);
                }
            }

            return input;
        }

        public string GetFileFormName()
        {
            if (string.IsNullOrEmpty(FileFormName))
            {
                throw new Exception(Resources.CustomUploaderItem_GetFileFormName_FileFormNameMustBeConfigured);
            }

            return FileFormName;
        }

        public Dictionary<string, string> GetArguments(CustomUploaderInput input)
        {
            Dictionary<string, string> arguments = new Dictionary<string, string>();

            if (Arguments != null)
            {
                ShareXCustomUploaderSyntaxParser parser = new ShareXCustomUploaderSyntaxParser(input);
                parser.UseNameParser = true;

                foreach (KeyValuePair<string, string> arg in Arguments)
                {
                    arguments.Add(arg.Key, parser.Parse(arg.Value));
                }
            }

            return arguments;
        }

        public NameValueCollection GetHeaders(CustomUploaderInput input)
        {
            if (Headers != null && Headers.Count > 0)
            {
                NameValueCollection collection = new NameValueCollection();

                ShareXCustomUploaderSyntaxParser parser = new ShareXCustomUploaderSyntaxParser(input);
                parser.UseNameParser = true;

                foreach (KeyValuePair<string, string> header in Headers)
                {
                    collection.Add(header.Key, parser.Parse(header.Value));
                }

                return collection;
            }

            return null;
        }

        public void ParseResponse(UploadResult result, ResponseInfo responseInfo, UploaderErrorManager errors, CustomUploaderInput input, bool isShortenedURL = false)
        {
            if (result != null && responseInfo != null)
            {
                result.ResponseInfo = responseInfo;

                if (responseInfo.ResponseText == null)
                {
                    responseInfo.ResponseText = "";
                }

                ShareXCustomUploaderSyntaxParser parser = new ShareXCustomUploaderSyntaxParser()
                {
                    FileName = input.FileName,
                    ResponseInfo = responseInfo,
                    URLEncode = true
                };

                if (responseInfo.IsSuccess)
                {
                    string url;

                    if (!string.IsNullOrEmpty(URL))
                    {
                        url = parser.Parse(URL);

                        if (string.IsNullOrEmpty(url) && !string.IsNullOrEmpty(URL) && URL.Contains("{output:"))
                        {
                            result.IsURLExpected = false;
                        }
                    }
                    else
                    {
                        url = parser.ResponseInfo.ResponseText;
                    }

                    if (isShortenedURL)
                    {
                        result.ShortenedURL = url;
                    }
                    else
                    {
                        result.URL = url;
                    }

                    result.ThumbnailURL = parser.Parse(ThumbnailURL);
                    result.DeletionURL = parser.Parse(DeletionURL);
                }
                else
                {
                    if (!string.IsNullOrEmpty(ErrorMessage))
                    {
                        string parsedErrorMessage = parser.Parse(ErrorMessage);

                        if (!string.IsNullOrEmpty(parsedErrorMessage))
                        {
                            errors.AddFirst(parsedErrorMessage);
                        }
                    }
                }
            }
        }

        public void TryParseResponse(UploadResult result, ResponseInfo responseInfo, UploaderErrorManager errors, CustomUploaderInput input, bool isShortenedURL = false)
        {
            try
            {
                ParseResponse(result, responseInfo, errors, input, isShortenedURL);
            }
            catch (JsonReaderException e)
            {
                string hostName = URLHelpers.GetHostName(RequestURL);
                errors.AddFirst($"Invalid response content is returned from host ({hostName}), expected response content is JSON." +
                    Environment.NewLine + Environment.NewLine + e);
            }
            catch (Exception e)
            {
                string hostName = URLHelpers.GetHostName(RequestURL);
                errors.AddFirst($"Unable to parse response content returned from host ({hostName})." +
                    Environment.NewLine + Environment.NewLine + e);
            }
        }

        public void CheckBackwardCompatibility()
        {
            if (string.IsNullOrEmpty(Version) || Helpers.CompareVersion(Version, "12.3.1") <= 0)
            {
                throw new Exception("Unsupported custom uploader" + ": " + ToString());
            }

            CheckRequestURL();

            if (Helpers.CompareVersion(Version, "13.7.1") <= 0)
            {
                RequestURL = MigrateOldSyntax(RequestURL);

                if (Parameters != null)
                {
                    foreach (string key in Parameters.Keys.ToList())
                    {
                        Parameters[key] = MigrateOldSyntax(Parameters[key]);
                    }
                }

                if (Headers != null)
                {
                    foreach (string key in Headers.Keys.ToList())
                    {
                        Headers[key] = MigrateOldSyntax(Headers[key]);
                    }
                }

                if (Arguments != null)
                {
                    foreach (string key in Arguments.Keys.ToList())
                    {
                        Arguments[key] = MigrateOldSyntax(Arguments[key]);
                    }
                }

                if (Data != null)
                {
                    Data = Data.Replace("$input$", "{input}", StringComparison.OrdinalIgnoreCase).
                        Replace("$filename$", "{filename}", StringComparison.OrdinalIgnoreCase);
                }

                URL = MigrateOldSyntax(URL);
                ThumbnailURL = MigrateOldSyntax(ThumbnailURL);
                DeletionURL = MigrateOldSyntax(DeletionURL);
                ErrorMessage = MigrateOldSyntax(ErrorMessage);

                Version = Helpers.GetApplicationVersion();
            }
        }

        private string MigrateOldSyntax(string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return input;
            }

            StringBuilder sbInput = new StringBuilder();

            bool start = true;

            for (int i = 0; i < input.Length; i++)
            {
                if (input[i] == '$')
                {
                    sbInput.Append(start ? '{' : '}');
                    start = !start;
                    continue;
                }
                else if (input[i] == '\\')
                {
                    i++;
                    continue;
                }
                else if (input[i] == '{' || input[i] == '}')
                {
                    sbInput.Append('\\');
                }

                sbInput.Append(input[i]);
            }

            return sbInput.ToString();
        }

        private void CheckRequestURL()
        {
            if (!string.IsNullOrEmpty(RequestURL))
            {
                NameValueCollection nvc = URLHelpers.ParseQueryString(RequestURL);

                if (nvc != null && nvc.Count > 0)
                {
                    if (Parameters == null)
                    {
                        Parameters = new Dictionary<string, string>();
                    }

                    foreach (string key in nvc)
                    {
                        if (key == null)
                        {
                            foreach (string value in nvc.GetValues(key))
                            {
                                if (!Parameters.ContainsKey(value))
                                {
                                    Parameters.Add(value, "");
                                }
                            }
                        }
                        else if (!Parameters.ContainsKey(key))
                        {
                            string value = nvc[key];
                            Parameters.Add(key, value);
                        }
                    }

                    RequestURL = URLHelpers.RemoveQueryString(RequestURL);
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShareXCustomUploaderSyntaxParser.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/ShareXCustomUploaderSyntaxParser.cs

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
    public class ShareXCustomUploaderSyntaxParser : ShareXSyntaxParser
    {
        private static IEnumerable<CustomUploaderFunction> Functions = Helpers.GetInstances<CustomUploaderFunction>();

        public string FileName { get; set; }
        public string Input { get; set; }
        public ResponseInfo ResponseInfo { get; set; }
        public bool URLEncode { get; set; } // Only URL encodes file name and input
        public bool UseNameParser { get; set; }
        public NameParserType NameParserType { get; set; } = NameParserType.Text;

        public ShareXCustomUploaderSyntaxParser()
        {
        }

        public ShareXCustomUploaderSyntaxParser(CustomUploaderInput input)
        {
            FileName = input.FileName;
            Input = input.Input;
        }

        public override string Parse(string text)
        {
            if (UseNameParser && !string.IsNullOrEmpty(text))
            {
                NameParser nameParser = new NameParser(NameParserType);
                EscapeHelper escapeHelper = new EscapeHelper();
                escapeHelper.KeepEscapeCharacter = true;
                text = escapeHelper.Parse(text, nameParser.Parse);
            }

            return base.Parse(text);
        }

        protected override string CallFunction(string functionName, string[] parameters = null)
        {
            if (string.IsNullOrEmpty(functionName))
            {
                throw new Exception("Function name cannot be empty.");
            }

            foreach (CustomUploaderFunction function in Functions)
            {
                if (function.Name.Equals(functionName, StringComparison.OrdinalIgnoreCase) ||
                    (function.Aliases != null && function.Aliases.Any(x => x.Equals(functionName, StringComparison.OrdinalIgnoreCase))))
                {
                    if (function.MinParameterCount > 0 && (parameters == null || parameters.Length < function.MinParameterCount))
                    {
                        throw new Exception($"Minimum parameter count for function \"{function.Name}\" is {function.MinParameterCount}.");
                    }

                    return function.Call(this, parameters);
                }
            }

            throw new Exception("Invalid function name: " + functionName);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShareXSyntaxParser.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/ShareXSyntaxParser.cs

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

using System.Collections.Generic;
using System.Text;

namespace ShareX.UploadersLib
{
    public abstract class ShareXSyntaxParser
    {
        public virtual char SyntaxStart { get; } = '{';
        public virtual char SyntaxEnd { get; } = '}';
        public virtual char SyntaxParameterStart { get; } = ':';
        public virtual char SyntaxParameterDelimiter { get; } = '|';
        public virtual char SyntaxEscape { get; } = '\\';

        public virtual string Parse(string text)
        {
            if (string.IsNullOrEmpty(text))
            {
                return "";
            }

            return Parse(text, false, 0, out _);
        }

        private string Parse(string text, bool isFunction, int startPosition, out int endPosition)
        {
            StringBuilder sbOutput = new StringBuilder();
            bool escape = false;
            int i;

            for (i = startPosition; i < text.Length; i++)
            {
                char c = text[i];

                if (!escape)
                {
                    if (c == SyntaxStart)
                    {
                        string parsed = Parse(text, true, i + 1, out i);
                        sbOutput.Append(parsed);
                        continue;
                    }
                    else if (c == SyntaxEnd || c == SyntaxParameterDelimiter)
                    {
                        break;
                    }
                    else if (c == SyntaxEscape)
                    {
                        escape = true;
                        continue;
                    }
                    else if (isFunction && c == SyntaxParameterStart)
                    {
                        List<string> parameters = new List<string>();

                        do
                        {
                            string parsed = Parse(text, false, i + 1, out i);
                            parameters.Add(parsed);
                        } while (i < text.Length && text[i] == SyntaxParameterDelimiter);

                        endPosition = i;

                        return CallFunction(sbOutput.ToString(), parameters.ToArray());
                    }
                }

                escape = false;
                sbOutput.Append(c);
            }

            endPosition = i;

            if (isFunction)
            {
                return CallFunction(sbOutput.ToString());
            }

            return sbOutput.ToString();
        }

        protected abstract string CallFunction(string functionName, string[] parameters = null);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomUploaderFunction.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunction.cs

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
    internal abstract class CustomUploaderFunction
    {
        public abstract string Name { get; }

        public virtual string[] Aliases { get; }

        public virtual int MinParameterCount { get; } = 0;

        public abstract string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomUploaderFunctionBase64.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunctionBase64.cs

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
    // Example: Basic {base64:username:password}
    internal class CustomUploaderFunctionBase64 : CustomUploaderFunction
    {
        public override string Name { get; } = "base64";

        public override int MinParameterCount { get; } = 1;

        public override string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters)
        {
            string text = parameters[0];

            if (!string.IsNullOrEmpty(text))
            {
                return TranslatorHelper.TextToBase64(text);
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomUploaderFunctionFileName.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunctionFileName.cs

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
    // Example: {filename}
    internal class CustomUploaderFunctionFileName : CustomUploaderFunction
    {
        public override string Name { get; } = "filename";

        public override string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters)
        {
            if (parser.URLEncode)
            {
                return URLHelpers.URLEncode(parser.FileName);
            }

            return parser.FileName;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomUploaderFunctionHeader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunctionHeader.cs

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
    // Example: {header:Location}
    internal class CustomUploaderFunctionHeader : CustomUploaderFunction
    {
        public override string Name { get; } = "header";

        public override int MinParameterCount { get; } = 1;

        public override string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters)
        {
            string header = parameters[0];

            if (parser.ResponseInfo.Headers != null)
            {
                return parser.ResponseInfo.Headers[header];
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomUploaderFunctionInput.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunctionInput.cs

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
    // Example: {input}
    internal class CustomUploaderFunctionInput : CustomUploaderFunction
    {
        public override string Name { get; } = "input";

        public override string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters)
        {
            if (parser.URLEncode)
            {
                return URLHelpers.URLEncode(parser.Input);
            }

            return parser.Input;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomUploaderFunctionInputBox.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunctionInputBox.cs

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
    // Example: {inputbox}
    // Example: {inputbox:title}
    // Example: {inputbox:title|default text}
    internal class CustomUploaderFunctionInputBox : CustomUploaderFunction
    {
        public override string Name { get; } = "inputbox";

        public override string[] Aliases { get; } = new string[] { "prompt" };

        public override string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters)
        {
            string title = "Input";
            string defaultText = "";

            if (parameters != null && parameters.Length > 0)
            {
                title = parameters[0];

                if (parameters.Length > 1)
                {
                    defaultText = parameters[1];
                }
            }

            return InputBox.Show(title, defaultText);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomUploaderFunctionJson.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunctionJson.cs

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

namespace ShareX.UploadersLib
{
    // Example: {json:files[0].url}
    // Example: {json:{response}|files[0].url}
    internal class CustomUploaderFunctionJson : CustomUploaderFunction
    {
        public override string Name { get; } = "json";

        public override int MinParameterCount { get; } = 1;

        public override string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters)
        {
            // https://goessner.net/articles/JsonPath/
            string input, jsonPath;

            if (parameters.Length > 1)
            {
                // {json:input|jsonPath}
                input = parameters[0];
                jsonPath = parameters[1];
            }
            else
            {
                // {json:jsonPath}
                input = parser.ResponseInfo.ResponseText;
                jsonPath = parameters[0];
            }

            if (!string.IsNullOrEmpty(input) && !string.IsNullOrEmpty(jsonPath))
            {
                if (!jsonPath.StartsWith("$."))
                {
                    jsonPath = "$." + jsonPath;
                }

                return (string)JToken.Parse(input).SelectToken(jsonPath);
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomUploaderFunctionOutputBox.cs]---
Location: ShareX-develop/ShareX.UploadersLib/CustomUploader/Functions/CustomUploaderFunctionOutputBox.cs

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
    // Example: {outputbox:text}
    // Example: {outputbox:title|text}
    internal class CustomUploaderFunctionOutputBox : CustomUploaderFunction
    {
        public override string Name { get; } = "outputbox";

        public override int MinParameterCount { get; } = 1;

        public override string Call(ShareXCustomUploaderSyntaxParser parser, string[] parameters)
        {
            string text, title = null;

            if (parameters.Length > 1)
            {
                title = parameters[0];
                text = parameters[1];
            }
            else
            {
                text = parameters[0];
            }

            if (!string.IsNullOrEmpty(text))
            {
                if (string.IsNullOrEmpty(title))
                {
                    title = "Output";
                }

                OutputBox.Show(text, title);
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

````
