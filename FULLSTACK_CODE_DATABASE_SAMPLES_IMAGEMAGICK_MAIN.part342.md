---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 342
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 342 of 851)

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

---[FILE: widget-private.h]---
Location: ImageMagick-main/MagickCore/widget-private.h

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

  MagickCore private X11 widget methods.
*/
#ifndef MAGICKCORE_WIDGET_PRIVATE_H
#define MAGICKCORE_WIDGET_PRIVATE_H

#include "MagickCore/string_.h"
#include "MagickCore/xwindow-private.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#if defined(MAGICKCORE_X11_DELEGATE)
extern MagickPrivate int
  XCommandWidget(Display *,XWindows *,const char *const *,XEvent *),
  XConfirmWidget(Display *,XWindows *,const char *,const char *),
  XDialogWidget(Display *,XWindows *,const char *,const char *,char *),
  XMenuWidget(Display *,XWindows *,const char *,const char *const *,char *);

extern MagickPrivate MagickBooleanType
  XPreferencesWidget(Display *,XResourceInfo *,XWindows *);

extern MagickPrivate void
  DestroyXWidget(void),
  XColorBrowserWidget(Display *,XWindows *,const char *,char *),
  XFileBrowserWidget(Display *,XWindows *,const char *,char *),
  XFontBrowserWidget(Display *,XWindows *,const char *,char *),
  XInfoWidget(Display *,XWindows *,const char *),
  XListBrowserWidget(Display *,XWindows *,XWindowInfo *,const char *const *,
    const char *,const char *,char *),
  XNoticeWidget(Display *,XWindows *,const char *,const char *),
  XProgressMonitorWidget(Display *,XWindows *,const char *,
    const MagickOffsetType,const MagickSizeType),
  XTextViewWidget(Display *,const XResourceInfo *,XWindows *,
    const MagickBooleanType,const char *,const char **);

static inline void XTextViewHelp(Display *display,
  const XResourceInfo *resource_info,XWindows *windows,
  const MagickBooleanType mono,const char *title,const char *help)
{
  char
    **help_list;

  ssize_t
    i;

  help_list=StringToList(help);
  if (help_list == (char **) NULL)
    return;
  XTextViewWidget(display,resource_info,windows,mono,title,(const char **)
    help_list);
  for (i=0; help_list[i] != (char *) NULL; i++)
    help_list[i]=DestroyString(help_list[i]);  
  help_list=(char **) RelinquishMagickMemory(help_list);
}

#endif

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````
