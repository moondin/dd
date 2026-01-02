---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 71
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 71 of 851)

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

---[FILE: meta.h]---
Location: ImageMagick-main/coders/meta.h

```c
/*
  Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization
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

#include "coders/coders-private.h"

#define MagickMETAHeaders \
  MagickCoderHeader("8BIMWTEXT", 0, "8\000B\000I\000M\000#") \
  MagickCoderHeader("8BIMTEXT", 0, "8BIM#") \
  MagickCoderHeader("8BIM", 0, "8BIM") \
  MagickCoderHeader("IPTCWTEXT", 0, "\062\000#\000\060\000=\000\042\000&\000#\000\060\000;\000&\000#\000\062\000;\000\042\000") \
  MagickCoderHeader("IPTCTEXT", 0, "2#0=\042&#0;&#2;\042") \
  MagickCoderHeader("IPTC", 0, "\034\002")

#define MagickMETAAliases \
  MagickCoderAlias("META", "8BIM") \
  MagickCoderAlias("META", "8BIMTEXT") \
  MagickCoderAlias("META", "8BIMWTEXT") \
  MagickCoderAlias("META", "APP1") \
  MagickCoderAlias("META", "APP1JPEG") \
  MagickCoderAlias("META", "EXIF") \
  MagickCoderAlias("META", "XMP") \
  MagickCoderAlias("META", "ICM") \
  MagickCoderAlias("META", "ICC") \
  MagickCoderAlias("META", "IPTC") \
  MagickCoderAlias("META", "IPTCTEXT") \
  MagickCoderAlias("META", "IPTCWTEXT")

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(META)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

````
