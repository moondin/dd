---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 385
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 385 of 851)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - ImageMagick-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/ImageMagick-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: encoder_fuzzer.cc]---
Location: ImageMagick-main/oss-fuzz/encoder_fuzzer.cc

```cpp
/*
  Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#include <cstdint>
#include <cstring>

#include <Magick++/Blob.h>
#include <Magick++/Image.h>

#include "utils.cc"

#define FUZZ_ENCODER_STRING_LITERAL_X(name) FUZZ_ENCODER_STRING_LITERAL(name)
#define FUZZ_ENCODER_STRING_LITERAL(name) #name

#ifndef FUZZ_ENCODER
#define FUZZ_ENCODER FUZZ_ENCODER_STRING_LITERAL_X(FUZZ_IMAGEMAGICK_ENCODER)
#endif

#ifndef FUZZ_IMAGEMAGICK_INITIALIZER
#define FUZZ_IMAGEMAGICK_INITIALIZER ""
#endif
#define FUZZ_ENCODER_INITIALIZER FUZZ_ENCODER_STRING_LITERAL_X(FUZZ_IMAGEMAGICK_INITIALIZER)

static ssize_t EncoderInitializer(const uint8_t *Data,const size_t magick_unused(Size),Magick::Image &image)
{
  magick_unreferenced(Size);

  if (strcmp(FUZZ_ENCODER_INITIALIZER,"interlace") == 0)
    {
      Magick::InterlaceType
        interlace=(Magick::InterlaceType) *reinterpret_cast<const char *>(Data);

      if (interlace > Magick::PNGInterlace)
        return(-1);
      image.interlaceType(interlace);
      return(1);
    }
  if (strcmp(FUZZ_ENCODER_INITIALIZER,"png") == 0)
    image.defineValue("png","ignore-crc","1");
  return(0);
}

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *Data,size_t Size)
{
  Magick::Image
    image;

  ssize_t
    offset;

  std::string
    encoder=FUZZ_ENCODER;

  if (IsInvalidSize(Size))
    return(0);
  offset=EncoderInitializer(Data,Size,image);
  if (offset < 0)
    return(0);
  image.magick(encoder);
  image.fileName(std::string(encoder)+":");
  try
  {
    const Magick::Blob
      blob(Data+offset,Size-offset);

#if defined(BUILD_MAIN)
    std::string
      image_data;

    image_data=blob.base64();
#endif

    image.read(blob);
  }
#if defined(BUILD_MAIN)
  catch (Magick::Exception &e)
  {
    std::cout << "Exception when reading: " << e.what() << std::endl;
    return(0);
  }
#else
  catch (Magick::Exception)
  {
    return(0);
  }
#endif

#if FUZZ_IMAGEMAGICK_ENCODER_WRITE || defined(BUILD_MAIN)
  try
  {
    Magick::Blob
      outBlob;

    image.write(&outBlob,encoder);
  }
#if defined(BUILD_MAIN)
  catch (Magick::Exception &e)
  {
    std::cout << "Exception when writing: " << e.what() << std::endl;
  }
#else
  catch (Magick::Exception)
  {
  }
#endif
#endif
  return(0);
}
```

--------------------------------------------------------------------------------

---[FILE: encoder_gradient_fuzzer.cc]---
Location: ImageMagick-main/oss-fuzz/encoder_gradient_fuzzer.cc

```cpp
/*
  Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#include <cstdint>

#include <Magick++/Blob.h>
#include <Magick++/Image.h>

#include "utils.cc"
#include "encoder_utils.cc"

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *Data,size_t Size)
{
  return(fuzzEncoderWithStringFileName("gradient",Data,Size));
}
```

--------------------------------------------------------------------------------

---[FILE: encoder_label_fuzzer.cc]---
Location: ImageMagick-main/oss-fuzz/encoder_label_fuzzer.cc

```cpp
/*
  Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#include <cstdint>

#include <Magick++/Blob.h>
#include <Magick++/Image.h>

#include "utils.cc"
#include "encoder_utils.cc"

static bool validateFileName(const std::string &fileName)
{
  return (fileName.length() <= 64);
}

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *Data,size_t Size)
{
  return(fuzzEncoderWithStringFileName("label",Data,Size,validateFileName));
}
```

--------------------------------------------------------------------------------

---[FILE: encoder_list.cc]---
Location: ImageMagick-main/oss-fuzz/encoder_list.cc

```cpp
/*
  Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#include <iostream>
#include <list>
#include <algorithm>

#include <Magick++/Image.h>
#include <Magick++/Functions.h>
#include <Magick++/STL.h>

static std::string getInitializer(const std::string magick_module)
{
  if ((magick_module == "BGR") || (magick_module == "CMYK") || (magick_module =="RGB") || (magick_module =="YUV"))
    return "interlace";
  if (magick_module == "PNG")
    return "png";
  return "";
}

int main()
{
  Magick::InitializeMagick((const char *) NULL);

  std::list<Magick::CoderInfo> coderList;
  coderInfoList(&coderList, Magick::CoderInfo::TrueMatch, Magick::CoderInfo::AnyMatch, Magick::CoderInfo::AnyMatch);

  std::list<std::string> allowedNames;
  allowedNames.push_back("BGR");
  allowedNames.push_back("BMP");
  allowedNames.push_back("CMYK");
  allowedNames.push_back("DDS");
  allowedNames.push_back("EPT");
  allowedNames.push_back("FAX");
  allowedNames.push_back("HTML");
  allowedNames.push_back("JP2");
  allowedNames.push_back("JPEG");
  allowedNames.push_back("PCD");
  allowedNames.push_back("PCD");
  allowedNames.push_back("PDF");
  allowedNames.push_back("PNG");
  allowedNames.push_back("PS");
  allowedNames.push_back("PS2");
  allowedNames.push_back("PS3");
  allowedNames.push_back("RGB");
  allowedNames.push_back("SVG");
  allowedNames.push_back("TIFF");
  allowedNames.push_back("TXT");
  allowedNames.push_back("YCBCR");

  std::list<std::string> excludeList;
  excludeList.push_back("GRADIENT");
  excludeList.push_back("LABEL");
  excludeList.push_back("NULL");
  excludeList.push_back("PATTERN");
  excludeList.push_back("PLASMA");
  excludeList.push_back("SCREENSHOT");
  excludeList.push_back("TXT");
  excludeList.push_back("XC");

  for (std::list<Magick::CoderInfo>::iterator it = coderList.begin(); it != coderList.end(); it++)
  {
    std::string module=(*it).module();
    if (std::find(excludeList.begin(), excludeList.end(), module) != excludeList.end())
      continue;

    if ((*it).name() == module)
      std::cout << ((*it).isWritable() ? "+" : "-") << module << ":" << getInitializer(module) << std::endl;
    else if (std::find(allowedNames.begin(), allowedNames.end(), module) != allowedNames.end())
      std::cout << ((*it).isWritable() ? "+" : "-") << (*it).name() << ":" << getInitializer(module) << std::endl;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: encoder_pattern_fuzzer.cc]---
Location: ImageMagick-main/oss-fuzz/encoder_pattern_fuzzer.cc

```cpp
/*
  Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#include <cstdint>

#include <Magick++/Blob.h>
#include <Magick++/Image.h>

#include "utils.cc"
#include "encoder_utils.cc"

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *Data,size_t Size)
{
  return(fuzzEncoderWithStringFileName("pattern",Data,Size));
}
```

--------------------------------------------------------------------------------

---[FILE: encoder_plasma_fuzzer.cc]---
Location: ImageMagick-main/oss-fuzz/encoder_plasma_fuzzer.cc

```cpp
/*
  Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#include <cstdint>

#include <Magick++/Blob.h>
#include <Magick++/Image.h>

#define FUZZ_MAX_SIZE 128

#include "utils.cc"
#include "encoder_utils.cc"

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *Data,size_t Size)
{
  return(fuzzEncoderWithStringFileName("plasma",Data,Size));
}
```

--------------------------------------------------------------------------------

---[FILE: encoder_radial-gradient_fuzzer.cc]---
Location: ImageMagick-main/oss-fuzz/encoder_radial-gradient_fuzzer.cc

```cpp
/*
  Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#include <cstdint>

#include <Magick++/Blob.h>
#include <Magick++/Image.h>

#include "utils.cc"
#include "encoder_utils.cc"

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *Data,size_t Size)
{
  return(fuzzEncoderWithStringFileName("radial-gradient",Data,Size));
}
```

--------------------------------------------------------------------------------

---[FILE: encoder_utils.cc]---
Location: ImageMagick-main/oss-fuzz/encoder_utils.cc

```cpp
/*
  Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

static int fuzzEncoderWithStringFileName(const std::string encoder,
  const uint8_t *data,size_t size,bool (*validate)(const std::string &) = NULL)
{
  std::string
    fileName;

  if (IsInvalidSize(size))
    return(0);
  fileName=std::string(reinterpret_cast<const char*>(data), size);
  // Can be used to deny specific file names
  if ((validate != NULL) && (validate(fileName) == false))
    return(0);
  try
  {
    Magick::Image
      image;

    image.read(encoder + ":" + fileName);
  }
#if defined(BUILD_MAIN)
  catch (Magick::Exception &e)
  {
    std::cout << "Exception when reading: " << e.what() << std::endl;
  }
#else
  catch (Magick::Exception)
  {
  }
#endif
  return(0);
}
```

--------------------------------------------------------------------------------

---[FILE: encoder_xc_fuzzer.cc]---
Location: ImageMagick-main/oss-fuzz/encoder_xc_fuzzer.cc

```cpp
/*
  Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#include <cstdint>

#include <Magick++/Blob.h>
#include <Magick++/Image.h>

#include "utils.cc"
#include "encoder_utils.cc"

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *Data,size_t Size)
{
  return(fuzzEncoderWithStringFileName("xc",Data,Size));
}
```

--------------------------------------------------------------------------------

---[FILE: huffman_decode_fuzzer.cc]---
Location: ImageMagick-main/oss-fuzz/huffman_decode_fuzzer.cc

```cpp
/*
  Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#include <cstdint>

#include <Magick++/Image.h>

#include "utils.cc"

namespace MagickCore
{
  extern "C" void AttachBlob(BlobInfo *,const void *,const size_t);
}

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *Data,size_t Size)
{
  Magick::ExceptionInfo
    *exceptionInfo;

  Magick::Image
    image;

  if (IsInvalidSize(Size))
    return(0);
  MagickCore::AttachBlob(image.image()->blob,(const void *) Data,Size);
  exceptionInfo=MagickCore::AcquireExceptionInfo();
  (void) HuffmanDecodeImage(image.image(),exceptionInfo);
  (void) MagickCore::DestroyExceptionInfo(exceptionInfo);
  return(0);
}
```

--------------------------------------------------------------------------------

---[FILE: main.cc]---
Location: ImageMagick-main/oss-fuzz/main.cc

```cpp
/*
  Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.
  
  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at
  
    https://imagemagick.org/script/license.php
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#include <windows.h>
#include <fileapi.h>
#include <fstream>
#include <stdint.h>

#include <Magick++/Functions.h>

#include "encoder_format.h"

extern EncoderFormat encoderFormat;
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *Data,size_t Size);

class FuzzingDebugger
{
public:
  bool load(const wstring fileName)
  {
    ifstream
      file;

    streampos
      size;

    file=ifstream(fileName,ios::in|ios::binary|ios::ate);
    if (!file.is_open())
      return(false);
    size=file.tellg();
    if (size < 1)
      return(false);
    _size=size;
    _data=new char[_size];
    file.seekg(0,ios::beg);
    file.read(_data,size);
    file.close();
    encoderFormat.set(fileName);
    return(true);
  }

  void start()
  {
    const uint8_t
      *data;

    data=reinterpret_cast<const uint8_t *>(_data);
    LLVMFuzzerTestOneInput(data,_size);
    delete _data;
  }


private:
  char *_data;
  size_t _size;
};

int wmain(int argc, wchar_t *argv[])
{
  FuzzingDebugger
    debugger;

  int
    debug;

  wstring
    fileName;

  if (argc == 1)
    {
      wcerr << L"Filename must be specified as the first argument";
      return(1);
    }
  fileName=wstring(argv[1]);
  if (!debugger.load(fileName))
    {
      wcerr << L"Unable to load " << fileName;
      cin.get();
      return(1);
    }
  debug=_CrtSetDbgFlag(_CRTDBG_REPORT_FLAG);
  debug |= _CRTDBG_DELAY_FREE_MEM_DF;
  debug |= _CRTDBG_LEAK_CHECK_DF;
  (void) _CrtSetDbgFlag(debug);
  //_CrtSetBreakAlloc(42);
  debugger.start();
  Magick::TerminateMagick();
  _CrtCheckMemory();
  return(0);
}
```

--------------------------------------------------------------------------------

---[FILE: ping_fuzzer.cc]---
Location: ImageMagick-main/oss-fuzz/ping_fuzzer.cc

```cpp
/*
  Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#include <cstdint>
#include <cstring>

#include <Magick++/Blob.h>
#include <Magick++/Image.h>

#include "utils.cc"

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *Data, size_t Size)
{
  if (IsInvalidSize(Size,1))
    return(0);
  try
  {
    const Magick::Blob
      blob(Data, Size);

    Magick::Image
      image;

    image.ping(blob);
  }
#if defined(BUILD_MAIN)
  catch (Magick::Exception &e)
  {
    std::cout << "Exception when reading: " << e.what() << std::endl;
  }
#else
  catch (Magick::Exception)
  {
  }
#endif
  return(0);
}
```

--------------------------------------------------------------------------------

---[FILE: utils.cc]---
Location: ImageMagick-main/oss-fuzz/utils.cc

```cpp
/*
  Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#include <Magick++/Functions.h>
#include <Magick++/ResourceLimits.h>
#include <Magick++/SecurityPolicy.h>

#ifndef FUZZ_MAX_SIZE
#define FUZZ_MAX_SIZE 2048
#endif

static bool IsInvalidSize(const size_t size,const size_t min = 1)
{
  if (size < min)
    return(true);
  if (size > 8192)
    return(true);
  return(false);
}

class FuzzingInitializer
{
public:
  FuzzingInitializer()
  {
    // Disable SIMD in jpeg turbo.
    (void) putenv(const_cast<char *>("JSIMD_FORCENONE=1"));

    Magick::InitializeMagick((const char *) NULL);
    Magick::SecurityPolicy::anonymousCacheMemoryMap();
    Magick::SecurityPolicy::anonymousSystemMemoryMap();
    Magick::SecurityPolicy::maxMemoryRequest(128000000);
    Magick::ResourceLimits::memory(1000000000);
    Magick::ResourceLimits::map(500000000);
    Magick::ResourceLimits::width(FUZZ_MAX_SIZE);
    Magick::ResourceLimits::height(FUZZ_MAX_SIZE);
    Magick::ResourceLimits::listLength(16);
  }
};

FuzzingInitializer fuzzingInitializer;

#if defined(BUILD_MAIN)
#include "encoder_format.h"

EncoderFormat encoderFormat;

#define FUZZ_ENCODER encoderFormat.get()
#endif
```

--------------------------------------------------------------------------------

---[FILE: mvg.dict]---
Location: ImageMagick-main/oss-fuzz/dictionaries/mvg.dict

```text
"100"
"200"
"300"
"400"
"500"
"600"
"700"
"800"
"900"
"Center"
"East"
"North"
"NorthEast"
"NorthWest"
"South"
"SouthEast"
"SouthWest"
"West"
"add"
"affine"
"all"
"arc"
"bevel"
"bezier"
"black"
"bold"
"border-color"
"butt"
"change-mask"
"circle"
"clear"
"clip-path"
"clip-rule"
"clip-units"
"color"
"color-burn"
"color-dodge"
"condensed"
"darken"
"decorate"
"difference"
"dst"
"dst-atop"
"dst-in"
"dst-out"
"dst-over"
"ellipse"
"evenodd"
"exclusion"
"expanded"
"extra-condensed"
"extra-expanded"
"fill"
"fill-opacity"
"fill-rule"
"filltoborder"
"floodfill"
"font"
"font-family"
"font-size"
"font-stretch"
"font-style"
"font-weight"
"fuchsia"
"gradient-units"
"gravity"
"hard-light"
"image"
"interline-spacing"
"interword-spacing"
"italic"
"kerning"
"lighten"
"line"
"line-through"
"linear-light"
"matte"
"minus"
"miter"
"multiply"
"none"
"nonzero"
"normal"
"objectBoundingBox"
"oblique"
"offset"
"opacity"
"overlay"
"overline"
"path"
"plus"
"point"
"polygon"
"polyline"
"pop clip-path"
"pop defs"
"pop gradient"
"pop graphic-context"
"pop pattern"
"push clip-path"
"push defs"
"push gradient"
"push graphic-context"
"push pattern"
"rectangle"
"replace"
"reset"
"rotate"
"round"
"roundrectangle"
"scale"
"screen"
"semi-condensed"
"semi-expanded"
"skewX"
"skewY"
"soft-light"
"square"
"src"
"src-atop"
"src-in"
"src-out"
"src-over"
"stop-color"
"stroke"
"stroke-antialias"
"stroke-dasharray"
"stroke-dashoffset"
"stroke-linecap"
"stroke-linejoin"
"stroke-miterlimit"
"stroke-opacity"
"stroke-width"
"subtract"
"text"
"text-antialias"
"text-undercolor"
"translate"
"ultra-condensed"
"ultra-expanded"
"underline"
"userSpace"
"userSpaceOnUse"
"viewbox"
"xor"
"yellow"
```

--------------------------------------------------------------------------------

---[FILE: Changelog]---
Location: ImageMagick-main/PerlMagick/Changelog

```text
2021-01-26  7.0.10 Cristy  <quetzlzacatenango@image...>
  * if info has undefined orientation, return the image orientation.

2021-01-16  7.0.10 Cristy  <quetzlzacatenango@image...>
  * requires ImageMagick 7.0.10 or above.

2014-11-05  7.0.3 Cristy  <quetzlzacatenango@image...>
  * Add support for $image->Colorspace() (reference
    https://imagemagick.org/discourse-server/viewtopic.php?f=7&t=30980).

2011-08-01  7.0.0 Cristy  <quetzlzacatenango@image...>
  * New version 7.00.
```

--------------------------------------------------------------------------------

---[FILE: check.sh.in]---
Location: ImageMagick-main/PerlMagick/check.sh.in

```text
#!/bin/sh
#  Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization
#  dedicated to making software imaging solutions freely available.
#
#  You may not use this file except in compliance with the License.  You may
#  obtain a copy of the License at
#
#    https://imagemagick.org/script/license.php
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
# 
#  Copyright (C) 2003 - 2009 GraphicsMagick Group
#
#  Check script for building PerlMagick.

echo "LD_LIBRARY_PATH='${LD_LIBRARY_PATH}'"
echo "MAGICK_CODER_MODULE_PATH='${MAGICK_CODER_MODULE_PATH}'"
echo "MAGICK_CONFIGURE_PATH='${MAGICK_CONFIGURE_PATH}'"
echo "MAGICK_FILTER_MODULE_PATH='${MAGICK_FILTER_MODULE_PATH}'"
echo "MAKE='${MAKE}'"
echo "MAKEFLAGS='${MAKEFLAGS}'"
echo "MEMCHECK='${MEMCHECK}'"
echo "PATH='${PATH}'"
echo "SRCDIR='${SRCDIR}'"
echo "srcdir='${srcdir}'"

set -x

SRCDIR=`dirname $0`
SRCDIR=`cd $SRCDIR && pwd`
TOPSRCDIR=`cd $srcdir && pwd`

cd PerlMagick || exit 1

if test -z "${MAKE}" ; then
  MAKE=make
fi

if test -x PerlMagick -a -f Makefile.aperl ; then
  # Static build test incantation
  ${MAKE} -f Makefile.aperl CC='@CC@' TEST_VERBOSE=1 test
elif test -f Makefile -a -f Magick.o; then
  # Shared build test incantation
  ${MAKE} CC='@CC@' TEST_VERBOSE=1 test
else
  echo 'PerlMagick has not been built!'
  exit 1
fi
```

--------------------------------------------------------------------------------

---[FILE: Magick.pm]---
Location: ImageMagick-main/PerlMagick/Magick.pm

```text
package Image::Magick;

#  Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization
#  dedicated to making software imaging solutions freely available.
#
#  You may not use this file except in compliance with the License.  You may
#  obtain a copy of the License at
#
#    https://imagemagick.org/script/license.php
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#
#  Initial version, written by Kyle Shorter.


use strict;
use Carp;
use vars qw($VERSION @ISA @EXPORT $AUTOLOAD);

require 5.002;
require Exporter;
require DynaLoader;
require AutoLoader;

@ISA = qw(Exporter DynaLoader);
# Items to export into callers namespace by default. Note: do not export
# names by default without a very good reason. Use EXPORT_OK instead.
# Do not simply export all your public functions/methods/constants.
@EXPORT =
  qw(
      Success Transparent Opaque QuantumDepth QuantumRange MaxRGB
      WarningException ResourceLimitWarning TypeWarning OptionWarning
      DelegateWarning MissingDelegateWarning CorruptImageWarning
      FileOpenWarning BlobWarning StreamWarning CacheWarning CoderWarning
      ModuleWarning DrawWarning ImageWarning XServerWarning RegistryWarning
      ConfigureWarning ErrorException ResourceLimitError TypeError
      OptionError DelegateError MissingDelegateError CorruptImageError
      FileOpenError BlobError StreamError CacheError CoderError
      ModuleError DrawError ImageError XServerError RegistryError
      ConfigureError FatalErrorException
    );

$VERSION = '7.1.2';

sub AUTOLOAD {
    # This AUTOLOAD is used to 'autoload' constants from the constant()
    # XS function.  If a constant is not found then control is passed
    # to the AUTOLOAD in AutoLoader.
    no warnings;

    my $constname;
    ($constname = $AUTOLOAD) =~ s/.*:://;
    die "&${AUTOLOAD} not defined. The required ImageMagick libraries are not installed or not installed properly.\n" if $constname eq 'constant';
    my $val = constant($constname, @_ ? $_[0] : 0);
    if ($! != 0) {
    	if ($! =~ /Invalid/) {
	        $AutoLoader::AUTOLOAD = $AUTOLOAD;
	        goto &AutoLoader::AUTOLOAD;
    	}
    	else {
	        my($pack,$file,$line) = caller;
	        die "Your vendor has not defined PerlMagick macro $pack\:\:$constname, used at $file line $line.\n";
    	}
    }
    eval "sub $AUTOLOAD { $val }";
    goto &$AUTOLOAD;
}

bootstrap Image::Magick $VERSION;

# Preloaded methods go here.

sub new
{
    my $this = shift;
    my $class = ref($this) || $this || "Image::Magick";
    my $self = [ ];
    bless $self, $class;
    $self->set(@_) if @_;
    return $self;
}

sub New
{
    my $this = shift;
    my $class = ref($this) || $this || "Image::Magick";
    my $self = [ ];
    bless $self, $class;
    $self->set(@_) if @_;
    return $self;
}

# Autoload methods go after =cut, and are processed by the autosplit program.

END { UNLOAD () };

1;
__END__

=head1 NAME

Image::Magick - objected-oriented Perl interface to ImageMagick. Use it to read, manipulate, or write an image or image sequence from within a Perl script.

=head1 SYNOPSIS

  use Image::Magick;
  $p = new Image::Magick;
  $p->Read("imagefile");
  $p->Set(attribute => value, ...)
  ($a, ...) = $p->Get("attribute", ...)
  $p->routine(parameter => value, ...)
  $p->Mogrify("Routine", parameter => value, ...)
  $p->Write("filename");

=head1 DESCRIPTION

This Perl extension allows the reading, manipulation and writing of
a large number of image file formats using the ImageMagick library.
It was originally developed to be used by CGI scripts for Web pages.

A web page has been set up for this extension. See:

   https://imagemagick.org/script/perl-magick.php

If you have problems, go to

   https://github.com/ImageMagick/ImageMagick/issues

=head1 AUTHOR

Kyle Shorter	magick-users@imagemagick.org

=head1 BUGS

Has all the bugs of ImageMagick and much, much more!

=head1 SEE ALSO

perl(1).

=cut
```

--------------------------------------------------------------------------------

````
