---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 32
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 32 of 851)

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

---[FILE: dot.c]---
Location: ImageMagick-main/coders/dot.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                            DDDD    OOO   TTTTT                              %
%                            D   D  O   O    T                                %
%                            D   D  O   O    T                                %
%                            D   D  O   O    T                                %
%                            DDDD    OOO     T                                %
%                                                                             %
%                                                                             %
%                      Read/Write Graphviz DOT Format                         %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                                 July 1992                                   %
%                                                                             %
%                                                                             %
%  Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization         %
%  dedicated to making software imaging solutions freely available.           %
%                                                                             %
%  You may not use this file except in compliance with the License.  You may  %
%  obtain a copy of the License at                                            %
%                                                                             %
%    https://imagemagick.org/script/license.php                               %
%                                                                             %
%  Unless required by applicable law or agreed to in writing, software        %
%  distributed under the License is distributed on an "AS IS" BASIS,          %
%  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   %
%  See the License for the specific language governing permissions and        %
%  limitations under the License.                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%
*/

/*
  Include declarations.
*/
#include "MagickCore/studio.h"
#include "MagickCore/blob.h"
#include "MagickCore/blob-private.h"
#include "MagickCore/client.h"
#include "MagickCore/constitute.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/option.h"
#include "MagickCore/resource_.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"
#include "MagickCore/utility.h"
#include "MagickCore/xwindow-private.h"
#if defined(MAGICKCORE_GVC_DELEGATE)
#undef HAVE_CONFIG_H
#include <gvc.h>
static GVC_t
  *graphic_context = (GVC_t *) NULL;
#endif

#if defined(MAGICKCORE_GVC_DELEGATE)
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d D O T I m a g e                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadDOTImage() reads a Graphviz image file and returns it.  It allocates
%  the memory necessary for the new Image structure and returns a pointer to
%  the new image.
%
%  The format of the ReadDOTImage method is:
%
%      Image *ReadDOTImage(const ImageInfo *image_info,ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadDOTImage(const ImageInfo *image_info,ExceptionInfo *exception)
{
  char
    command[MagickPathExtent];

  const char
    *option;

  graph_t
    *graph;

  Image
    *image;

  ImageInfo
    *read_info;

  MagickBooleanType
    status;

  /*
    Open image file.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(exception != (ExceptionInfo *) NULL);
  assert(exception->signature == MagickCoreSignature);
  assert(graphic_context != (GVC_t *) NULL);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",
      image_info->filename);
  image=AcquireImage(image_info,exception);
  status=OpenBlob(image_info,image,ReadBinaryBlobMode,exception);
  if (status == MagickFalse)
    return(DestroyImageList(image));
  read_info=CloneImageInfo(image_info);
  SetImageInfoBlob(read_info,(void *) NULL,0);
  (void) CopyMagickString(read_info->magick,"SVG",MagickPathExtent);
  (void) AcquireUniqueFilename(read_info->filename);
  (void) FormatLocaleString(command,MagickPathExtent,"-Tsvg -o%s %s",
    read_info->filename,image_info->filename);
#if !defined(WITH_CGRAPH)
  graph=agread(GetBlobFileHandle(image));
#else
  graph=agread(GetBlobFileHandle(image),(Agdisc_t *) NULL);
#endif
  if (graph == (graph_t *) NULL)
    {
      (void) RelinquishUniqueFileResource(read_info->filename);
      read_info=DestroyImageInfo(read_info);
      return(DestroyImageList(image));
    }
  option=GetImageOption(image_info,"dot:layout-engine");
  if (option == (const char *) NULL)
    gvLayout(graphic_context,graph,(char *) "dot");
  else
    gvLayout(graphic_context,graph,(char *) option);
  gvRenderFilename(graphic_context,graph,(char *) "svg",read_info->filename);
  gvFreeLayout(graphic_context,graph);
  agclose(graph);
  image=DestroyImageList(image);
  /*
    Read SVG graph.
  */
  (void) CopyMagickString(read_info->magick,"SVG",MagickPathExtent);
  image=ReadImage(read_info,exception);
  (void) RelinquishUniqueFileResource(read_info->filename);
  read_info=DestroyImageInfo(read_info);
  if (image == (Image *) NULL)
    return((Image *) NULL);
  return(GetFirstImageInList(image));
}
#endif

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r D O T I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterDOTImage() adds attributes for the Display Postscript image
%  format to the list of supported formats.  The attributes include the image
%  format tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterDOTImage method is:
%
%      size_t RegisterDOTImage(void)
%
*/
ModuleExport size_t RegisterDOTImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("DOT","DOT","Graphviz");
#if defined(MAGICKCORE_GVC_DELEGATE)
  entry->decoder=(DecodeImageHandler *) ReadDOTImage;
#endif
  entry->flags^=CoderBlobSupportFlag;
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("DOT","GV","Graphviz");
#if defined(MAGICKCORE_GVC_DELEGATE)
  entry->decoder=(DecodeImageHandler *) ReadDOTImage;
#endif
  entry->flags^=CoderBlobSupportFlag;
  (void) RegisterMagickInfo(entry);
#if defined(MAGICKCORE_GVC_DELEGATE)
  graphic_context=gvContext();
#endif
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r D O T I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterDOTImage() removes format registrations made by the
%  DOT module from the list of supported formats.
%
%  The format of the UnregisterDOTImage method is:
%
%      UnregisterDOTImage(void)
%
*/
ModuleExport void UnregisterDOTImage(void)
{
  (void) UnregisterMagickInfo("GV");
  (void) UnregisterMagickInfo("DOT");
#if defined(MAGICKCORE_GVC_DELEGATE)
  if (graphic_context != (GVC_t *) NULL)
    {
      gvFreeContext(graphic_context);
      graphic_context=(GVC_t *) NULL;
    }
#endif
}
```

--------------------------------------------------------------------------------

---[FILE: dot.h]---
Location: ImageMagick-main/coders/dot.h

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

#define MagickDOTHeaders \
  MagickCoderHeader("DOT", 0, "digraph")

#define MagickDOTAliases \
  MagickCoderAlias("DOT", "GV")

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(DOT)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: dps.c]---
Location: ImageMagick-main/coders/dps.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                            DDDD   PPPP   SSSSS                              %
%                            D   D  P   P  SS                                 %
%                            D   D  PPPP    SSS                               %
%                            D   D  P         SS                              %
%                            DDDD   P      SSSSS                              %
%                                                                             %
%                                                                             %
%            Read Postscript Using the Display Postscript System.             %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                                 July 1992                                   %
%                                                                             %
%                                                                             %
%  Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization         %
%  dedicated to making software imaging solutions freely available.           %
%                                                                             %
%  You may not use this file except in compliance with the License.  You may  %
%  obtain a copy of the License at                                            %
%                                                                             %
%    https://imagemagick.org/script/license.php                               %
%                                                                             %
%  Unless required by applicable law or agreed to in writing, software        %
%  distributed under the License is distributed on an "AS IS" BASIS,          %
%  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   %
%  See the License for the specific language governing permissions and        %
%  limitations under the License.                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%
*/

/*
  Include declarations.
*/
#include "MagickCore/studio.h"
#include "MagickCore/blob.h"
#include "MagickCore/blob-private.h"
#include "MagickCore/client.h"
#include "MagickCore/colormap.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"
#include "MagickCore/utility.h"
#include "MagickCore/xwindow-private.h"
#if defined(MAGICKCORE_DPS_DELEGATE)
#include <DPS/dpsXclient.h>
#include <DPS/dpsXpreview.h>
#endif

#if defined(MAGICKCORE_DPS_DELEGATE)
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d D P S I m a g e                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadDPSImage() reads a Adobe Postscript image file and returns it.  It
%  allocates the memory necessary for the new Image structure and returns a
%  pointer to the new image.
%
%  The format of the ReadDPSImage method is:
%
%      Image *ReadDPSImage(const ImageInfo *image_info,ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadDPSImage(const ImageInfo *image_info,ExceptionInfo *exception)
{
  const char
    *client_name;

  Display
    *display;

  float
    pixels_per_point;

  Image
    *image;

  int
    sans,
    status;

  Pixmap
    pixmap;

  ssize_t
    i;

  Quantum
    *q;

  size_t
    pixel;

  Screen
    *screen;

  ssize_t
    x,
    y;

  XColor
    *colors;

  XImage
    *dps_image;

  XRectangle
    page,
    bits_per_pixel;

  XResourceInfo
    resource_info;

  XrmDatabase
    resource_database;

  XStandardColormap
    *map_info;

  XVisualInfo
    *visual_info;

  /*
    Open X server connection.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(exception != (ExceptionInfo *) NULL);
  assert(exception->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",
      image_info->filename);
  display=XOpenDisplay(image_info->server_name);
  if (display == (Display *) NULL)
    return((Image *) NULL);
  /*
    Set our forgiving exception handler.
  */
  (void) XSetErrorHandler(XError);
  /*
    Open image file.
  */
  image=AcquireImage(image_info,exception);
  status=OpenBlob(image_info,image,ReadBinaryBlobMode,exception);
  if (status == MagickFalse)
    {
      image=DestroyImageList(image);
      return((Image *) NULL);
    }
  /*
    Get user defaults from X resource database.
  */
  client_name=GetClientName();
  resource_database=XGetResourceDatabase(display,client_name);
  XGetResourceInfo(image_info,resource_database,client_name,&resource_info);
  /*
    Allocate standard colormap.
  */
  map_info=XAllocStandardColormap();
  visual_info=(XVisualInfo *) NULL;
  if (map_info == (XStandardColormap *) NULL)
    ThrowReaderException(ResourceLimitError,"UnableToCreateStandardColormap")
  else
    {
      /*
        Initialize visual info.
      */
      (void) CloneString(&resource_info.visual_type,"default");
      visual_info=XBestVisualInfo(display,map_info,&resource_info);
      map_info->colormap=(Colormap) NULL;
    }
  if ((map_info == (XStandardColormap *) NULL) ||
      (visual_info == (XVisualInfo *) NULL))
    {
      image=DestroyImage(image);
      XFreeResources(display,visual_info,map_info,(XPixelInfo *) NULL,
        (XFontStruct *) NULL,&resource_info,(XWindowInfo *) NULL);
      return((Image *) NULL);
    }
  /*
    Create a pixmap the appropriate size for the image.
  */
  screen=ScreenOfDisplay(display,visual_info->screen);
  pixels_per_point=XDPSPixelsPerPoint(screen);
  if ((image->resolution.x != 0.0) && (image->resolution.y != 0.0))
    pixels_per_point=MagickMin(image->resolution.x,image->resolution.y)/
      DefaultResolution;
  status=XDPSCreatePixmapForEPSF((DPSContext) NULL,screen,
    GetBlobFileHandle(image),visual_info->depth,pixels_per_point,&pixmap,
    &bits_per_pixel,&page);
  if ((status == dps_status_failure) || (status == dps_status_no_extension))
    {
      image=DestroyImage(image);
      XFreeResources(display,visual_info,map_info,(XPixelInfo *) NULL,
        (XFontStruct *) NULL,&resource_info,(XWindowInfo *) NULL);
      return((Image *) NULL);
    }
  /*
    Rasterize the file into the pixmap.
  */
  status=XDPSImageFileIntoDrawable((DPSContext) NULL,screen,pixmap,
    GetBlobFileHandle(image),(int) bits_per_pixel.height,visual_info->depth,
    &page,-page.x,-page.y,pixels_per_point,MagickTrue,MagickFalse,MagickTrue,
    &sans);
  if (status != dps_status_success)
    {
      image=DestroyImage(image);
      XFreeResources(display,visual_info,map_info,(XPixelInfo *) NULL,
        (XFontStruct *) NULL,&resource_info,(XWindowInfo *) NULL);
      return((Image *) NULL);
    }
  /*
    Initialize DPS X image.
  */
  dps_image=XGetImage(display,pixmap,0,0,bits_per_pixel.width,
    bits_per_pixel.height,AllPlanes,ZPixmap);
  (void) XFreePixmap(display,pixmap);
  if (dps_image == (XImage *) NULL)
    {
      image=DestroyImage(image);
      XFreeResources(display,visual_info,map_info,(XPixelInfo *) NULL,
        (XFontStruct *) NULL,&resource_info,(XWindowInfo *) NULL);
      return((Image *) NULL);
    }
  /*
    Get the colormap colors.
  */
  colors=(XColor *) AcquireQuantumMemory(visual_info->colormap_size,
    sizeof(*colors));
  if (colors == (XColor *) NULL)
    {
      image=DestroyImage(image);
      XDestroyImage(dps_image);
      XFreeResources(display,visual_info,map_info,(XPixelInfo *) NULL,
        (XFontStruct *) NULL,&resource_info,(XWindowInfo *) NULL);
      return((Image *) NULL);
    }
  if ((visual_info->klass != DirectColor) && (visual_info->klass != TrueColor))
    for (i=0; i < visual_info->colormap_size; i++)
    {
      colors[i].pixel=(size_t) i;
      colors[i].pad=0;
    }
  else
    {
      size_t
        blue,
        blue_bit,
        green,
        green_bit,
        red,
        red_bit;

      /*
        DirectColor or TrueColor visual.
      */
      red=0;
      green=0;
      blue=0;
      red_bit=visual_info->red_mask & (~(visual_info->red_mask)+1);
      green_bit=visual_info->green_mask & (~(visual_info->green_mask)+1);
      blue_bit=visual_info->blue_mask & (~(visual_info->blue_mask)+1);
      for (i=0; i < visual_info->colormap_size; i++)
      {
        colors[i].pixel=red | green | blue;
        colors[i].pad=0;
        red+=red_bit;
        if (red > visual_info->red_mask)
          red=0;
        green+=green_bit;
        if (green > visual_info->green_mask)
          green=0;
        blue+=blue_bit;
        if (blue > visual_info->blue_mask)
          blue=0;
      }
    }
  (void) XQueryColors(display,XDefaultColormap(display,visual_info->screen),
    colors,visual_info->colormap_size);
  /*
    Convert X image to MIFF format.
  */
  if ((visual_info->klass != TrueColor) && (visual_info->klass != DirectColor))
    image->storage_class=PseudoClass;
  image->columns=(size_t) dps_image->width;
  image->rows=(size_t) dps_image->height;
  if (image_info->ping != MagickFalse)
    {
      (void) CloseBlob(image);
      colors=(XColor *) RelinquishMagickMemory(colors);
      XDestroyImage(dps_image);
      XFreeResources(display,visual_info,map_info,(XPixelInfo *) NULL,
        (XFontStruct *) NULL,&resource_info,(XWindowInfo *) NULL);
      return(GetFirstImageInList(image));
    }
  status=SetImageExtent(image,image->columns,image->rows,exception);
  if (status == MagickFalse)
    {
      colors=(XColor *) RelinquishMagickMemory(colors);
      XDestroyImage(dps_image);
      XFreeResources(display,visual_info,map_info,(XPixelInfo *) NULL,
        (XFontStruct *) NULL,&resource_info,(XWindowInfo *) NULL);
      return(DestroyImageList(image));
    }
  switch (image->storage_class)
  {
    case DirectClass:
    default:
    {
      size_t
        color,
        index;

      size_t
        blue_mask,
        blue_shift,
        green_mask,
        green_shift,
        red_mask,
        red_shift;

      /*
        Determine shift and mask for red, green, and blue.
      */
      red_mask=visual_info->red_mask;
      red_shift=0;
      while ((red_mask != 0) && ((red_mask & 0x01) == 0))
      {
        red_mask>>=1;
        red_shift++;
      }
      green_mask=visual_info->green_mask;
      green_shift=0;
      while ((green_mask != 0) && ((green_mask & 0x01) == 0))
      {
        green_mask>>=1;
        green_shift++;
      }
      blue_mask=visual_info->blue_mask;
      blue_shift=0;
      while ((blue_mask != 0) && ((blue_mask & 0x01) == 0))
      {
        blue_mask>>=1;
        blue_shift++;
      }
      /*
        Convert X image to DirectClass packets.
      */
      if ((visual_info->colormap_size > 0) &&
          (visual_info->klass == DirectColor))
        for (y=0; y < (ssize_t) image->rows; y++)
        {
          q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
          if (q == (Quantum *) NULL)
            break;
          for (x=0; x < (ssize_t) image->columns; x++)
          {
            pixel=XGetPixel(dps_image,x,y);
            index=(pixel >> red_shift) & red_mask;
            SetPixelRed(image,ScaleShortToQuantum(colors[index].red),q);
            index=(pixel >> green_shift) & green_mask;
            SetPixelGreen(image,ScaleShortToQuantum(colors[index].green),q);
            index=(pixel >> blue_shift) & blue_mask;
            SetPixelBlue(image,ScaleShortToQuantum(colors[index].blue),q);
            q+=(ptrdiff_t) GetPixelChannels(image);
          }
          if (SyncAuthenticPixels(image,exception) == MagickFalse)
            break;
          if (SetImageProgress(image,LoadImageTag,y,image->rows) == MagickFalse)
            break;
        }
      else
        for (y=0; y < (ssize_t) image->rows; y++)
        {
          q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
          if (q == (Quantum *) NULL)
            break;
          for (x=0; x < (ssize_t) image->columns; x++)
          {
            pixel=XGetPixel(dps_image,x,y);
            color=(pixel >> red_shift) & red_mask;
            color=(color*65535L)/red_mask;
            SetPixelRed(image,ScaleShortToQuantum((unsigned short) color),q);
            color=(pixel >> green_shift) & green_mask;
            color=(color*65535L)/green_mask;
            SetPixelGreen(image,ScaleShortToQuantum((unsigned short) color),q);
            color=(pixel >> blue_shift) & blue_mask;
            color=(color*65535L)/blue_mask;
            SetPixelBlue(image,ScaleShortToQuantum((unsigned short) color),q);
            q+=(ptrdiff_t) GetPixelChannels(image);
          }
          if (SyncAuthenticPixels(image,exception) == MagickFalse)
            break;
          if (SetImageProgress(image,LoadImageTag,y,image->rows) == MagickFalse)
            break;
        }
      break;
    }
    case PseudoClass:
    {
      /*
        Create colormap.
      */
      if (AcquireImageColormap(image,(size_t) visual_info->colormap_size,exception) == MagickFalse)
        {
          image=DestroyImage(image);
          colors=(XColor *) RelinquishMagickMemory(colors);
          XDestroyImage(dps_image);
          XFreeResources(display,visual_info,map_info,(XPixelInfo *) NULL,
            (XFontStruct *) NULL,&resource_info,(XWindowInfo *) NULL);
          return((Image *) NULL);
        }
      for (i=0; i < (ssize_t) image->colors; i++)
      {
        image->colormap[colors[i].pixel].red=ScaleShortToQuantum(colors[i].red);
        image->colormap[colors[i].pixel].green=
          ScaleShortToQuantum(colors[i].green);
        image->colormap[colors[i].pixel].blue=
          ScaleShortToQuantum(colors[i].blue);
      }
      /*
        Convert X image to PseudoClass packets.
      */
      for (y=0; y < (ssize_t) image->rows; y++)
      {
        q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
        if (q == (Quantum *) NULL)
          break;
        for (x=0; x < (ssize_t) image->columns; x++)
        {
          SetPixelIndex(image,(unsigned short) XGetPixel(dps_image,x,y),q);
          q+=(ptrdiff_t) GetPixelChannels(image);
        }
        if (SyncAuthenticPixels(image,exception) == MagickFalse)
          break;
        if (SetImageProgress(image,LoadImageTag,y,image->rows) == MagickFalse)
          break;
      }
      break;
    }
  }
  colors=(XColor *) RelinquishMagickMemory(colors);
  XDestroyImage(dps_image);
  if (image->storage_class == PseudoClass)
    (void) SyncImage(image,exception);
  /*
    Rasterize matte image.
  */
  status=XDPSCreatePixmapForEPSF((DPSContext) NULL,screen,
    GetBlobFileHandle(image),1,pixels_per_point,&pixmap,&bits_per_pixel,&page);
  if ((status != dps_status_failure) && (status != dps_status_no_extension))
    {
      status=XDPSImageFileIntoDrawable((DPSContext) NULL,screen,pixmap,
        GetBlobFileHandle(image),(int) bits_per_pixel.height,1,&page,-page.x,
        -page.y,pixels_per_point,MagickTrue,MagickTrue,MagickTrue,&sans);
      if (status == dps_status_success)
        {
          XImage
            *matte_image;

          /*
            Initialize image matte.
          */
          matte_image=XGetImage(display,pixmap,0,0,bits_per_pixel.width,
            bits_per_pixel.height,AllPlanes,ZPixmap);
          (void) XFreePixmap(display,pixmap);
          if (matte_image != (XImage *) NULL)
            {
              image->storage_class=DirectClass;
              image->alpha_trait=BlendPixelTrait;
              for (y=0; y < (ssize_t) image->rows; y++)
              {
                q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
                if (q == (Quantum *) NULL)
                  break;
                for (x=0; x < (ssize_t) image->columns; x++)
                {
                  SetPixelAlpha(image,OpaqueAlpha,q);
                  if (XGetPixel(matte_image,x,y) == 0)
                    SetPixelAlpha(image,TransparentAlpha,q);
                  q+=(ptrdiff_t) GetPixelChannels(image);
                }
                if (SyncAuthenticPixels(image,exception) == MagickFalse)
                  break;
              }
              XDestroyImage(matte_image);
            }
        }
    }
  /*
    Relinquish resources.
  */
  XFreeResources(display,visual_info,map_info,(XPixelInfo *) NULL,
    (XFontStruct *) NULL,&resource_info,(XWindowInfo *) NULL);
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  if (status == MagickFalse)
    return(DestroyImageList(image));
  return(GetFirstImageInList(image));
}
#endif

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r D P S I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterDPSImage() adds attributes for the Display Postscript image
%  format to the list of supported formats.  The attributes include the image
%  format tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterDPSImage method is:
%
%      size_t RegisterDPSImage(void)
%
*/
ModuleExport size_t RegisterDPSImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("DPS","DPS","Display Postscript Interpreter");
#if defined(MAGICKCORE_DPS_DELEGATE)
  entry->decoder=(DecodeImageHandler *) ReadDPSImage;
#endif
  entry->flags^=CoderBlobSupportFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r D P S I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterDPSImage() removes format registrations made by the
%  DPS module from the list of supported formats.
%
%  The format of the UnregisterDPSImage method is:
%
%      UnregisterDPSImage(void)
%
*/
ModuleExport void UnregisterDPSImage(void)
{
  (void) UnregisterMagickInfo("DPS");
}
```

--------------------------------------------------------------------------------

---[FILE: dps.h]---
Location: ImageMagick-main/coders/dps.h

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

#define MagickDPSHeaders

#define MagickDPSAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(DPS)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

````
