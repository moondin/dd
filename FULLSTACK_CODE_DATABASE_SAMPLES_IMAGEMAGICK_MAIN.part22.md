---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 22
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 22 of 851)

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

---[FILE: cmyk.h]---
Location: ImageMagick-main/coders/cmyk.h

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

#define MagickCMYKHeaders

#define MagickCMYKAliases \
  MagickCoderAlias("CMYK", "CMYKA")

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(CMYK)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: coders-list.h]---
Location: ImageMagick-main/coders/coders-list.h

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

AddMagickCoder(AAI)
AddMagickCoder(ART)
AddMagickCoder(ASHLAR)
AddMagickCoder(AVS)
AddMagickCoder(BAYER)
AddMagickCoder(BGR)
AddMagickCoder(BMP)
AddMagickCoder(BRAILLE)
AddMagickCoder(CALS)
AddMagickCoder(CAPTION)
AddMagickCoder(CIN)
AddMagickCoder(CIP)
#if defined(MAGICKCORE_WINGDI32_DELEGATE)
  AddMagickCoder(CLIPBOARD)
#endif
AddMagickCoder(CLIP)
AddMagickCoder(CMYK)
AddMagickCoder(CUBE)
AddMagickCoder(CUT)
AddMagickCoder(DCM)
AddMagickCoder(DDS)
AddMagickCoder(DEBUG)
AddMagickCoder(DIB)
#if defined(MAGICKCORE_DJVU_DELEGATE)
  AddMagickCoder(DJVU)
#endif
AddMagickCoder(DNG)
#if defined(MAGICKCORE_GVC_DELEGATE)
  AddMagickCoder(DOT)
#endif
#if defined(MAGICKCORE_DPS_DELEGATE)
  AddMagickCoder(DPS)
#endif
AddMagickCoder(DPX)
#if defined(MAGICKCORE_WINGDI32_DELEGATE)
  AddMagickCoder(EMF)
#endif
#if defined(MAGICKCORE_TIFF_DELEGATE)
  AddMagickCoder(EPT)
#endif
#if defined(MAGICKCORE_OPENEXR_DELEGATE)
  AddMagickCoder(EXR)
#endif
AddMagickCoder(FARBFELD)
AddMagickCoder(FAX)
AddMagickCoder(FITS)
AddMagickCoder(FL32)
#if defined(MAGICKCORE_FLIF_DELEGATE)
  AddMagickCoder(FLIF)
#endif
#if defined(MAGICKCORE_FPX_DELEGATE)
  AddMagickCoder(FPX)
#endif
AddMagickCoder(FTXT)
AddMagickCoder(GIF)
AddMagickCoder(GRADIENT)
AddMagickCoder(GRAY)
AddMagickCoder(HALD)
AddMagickCoder(HDR)
#if defined(MAGICKCORE_HEIC_DELEGATE)
  AddMagickCoder(HEIC)
#endif
AddMagickCoder(HISTOGRAM)
AddMagickCoder(HRZ)
AddMagickCoder(HTML)
AddMagickCoder(ICON)
AddMagickCoder(INFO)
AddMagickCoder(INLINE)
AddMagickCoder(IPL)
#if defined(MAGICKCORE_JBIG_DELEGATE)
  AddMagickCoder(JBIG)
#endif
AddMagickCoder(JNX)
#if defined(MAGICKCORE_JP2_DELEGATE) || defined(MAGICKCORE_LIBOPENJP2_DELEGATE)
  AddMagickCoder(JP2)
#endif
#if defined(MAGICKCORE_JPEG_DELEGATE)
  AddMagickCoder(JPEG)
#endif
AddMagickCoder(JSON)
#if defined(MAGICKCORE_JXL_DELEGATE)
  AddMagickCoder(JXL)
#endif
AddMagickCoder(LABEL)
AddMagickCoder(MAC)
AddMagickCoder(MAGICK)
AddMagickCoder(MAP)
AddMagickCoder(MASK)
AddMagickCoder(MAT)
AddMagickCoder(MATTE)
AddMagickCoder(META)
AddMagickCoder(MIFF)
AddMagickCoder(MONO)
AddMagickCoder(MPC)
AddMagickCoder(MPR)
AddMagickCoder(MSL)
AddMagickCoder(MTV)
AddMagickCoder(MVG)
AddMagickCoder(NULL)
AddMagickCoder(ORA)
AddMagickCoder(OTB)
AddMagickCoder(PALM)
AddMagickCoder(PANGO)
AddMagickCoder(PATTERN)
AddMagickCoder(PCD)
AddMagickCoder(PCL)
AddMagickCoder(PCX)
AddMagickCoder(PDB)
AddMagickCoder(PDF)
AddMagickCoder(PES)
AddMagickCoder(PGX)
AddMagickCoder(PICT)
AddMagickCoder(PIX)
AddMagickCoder(PLASMA)
#if defined(MAGICKCORE_PNG_DELEGATE)
  AddMagickCoder(PNG)
#endif
AddMagickCoder(PNM)
AddMagickCoder(PS2)
AddMagickCoder(PS3)
AddMagickCoder(PS)
AddMagickCoder(PSD)
AddMagickCoder(PWP)
AddMagickCoder(QOI)
AddMagickCoder(RAW)
AddMagickCoder(RGB)
AddMagickCoder(RGF)
AddMagickCoder(RLA)
AddMagickCoder(RLE)
AddMagickCoder(SCR)
AddMagickCoder(SCREENSHOT)
AddMagickCoder(SCT)
AddMagickCoder(SF3)
AddMagickCoder(SFW)
AddMagickCoder(SGI)
AddMagickCoder(SIXEL)
AddMagickCoder(STEGANO)
AddMagickCoder(STRIMG)
AddMagickCoder(SUN)
AddMagickCoder(SVG)
AddMagickCoder(TGA)
AddMagickCoder(THUMBNAIL)
#if defined(MAGICKCORE_TIFF_DELEGATE)
  AddMagickCoder(TIFF)
#endif
AddMagickCoder(TILE)
AddMagickCoder(TIM)
AddMagickCoder(TIM2)
#if defined(MAGICKCORE_FREETYPE_DELEGATE)
  AddMagickCoder(TTF)
#endif
AddMagickCoder(TXT)
#if defined(MAGICKCORE_UHDR_DELEGATE)
  AddMagickCoder(UHDR)
#endif
AddMagickCoder(UIL)
AddMagickCoder(URL)
AddMagickCoder(UYVY)
AddMagickCoder(VICAR)
AddMagickCoder(VID)
AddMagickCoder(VIDEO)
AddMagickCoder(VIFF)
AddMagickCoder(VIPS)
AddMagickCoder(WBMP)
#if defined(MAGICKCORE_WEBP_DELEGATE)
  AddMagickCoder(WEBP)
#endif
#if defined(MAGICKCORE_WMF_DELEGATE) || defined(MAGICKCORE_WMFLITE_DELEGATE)
  AddMagickCoder(WMF)
#endif
AddMagickCoder(WPG)
AddMagickCoder(XBM)
#if defined(MAGICKCORE_X11_DELEGATE)
  AddMagickCoder(X)
#endif
AddMagickCoder(XC)
AddMagickCoder(XCF)
AddMagickCoder(XPM)
AddMagickCoder(XPS)
#if defined(MAGICKCORE_X11_DELEGATE)
  AddMagickCoder(XWD)
#endif
AddMagickCoder(YAML)
AddMagickCoder(YCBCR)
AddMagickCoder(YUV)
```

--------------------------------------------------------------------------------

---[FILE: coders-private.h]---
Location: ImageMagick-main/coders/coders-private.h

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
#ifndef MAGICK_CODERS_PRIVATE_H
#define MAGICK_CODERS_PRIVATE_H

#include "MagickCore/attribute.h"
#include "MagickCore/colorspace-private.h"
#include "MagickCore/property.h"
#include "MagickCore/string_.h"

#define MagickCoderHeader(coder,offset,magic) \
  { coder, offset, (const unsigned char *) (magic), sizeof(magic)-1, MagickFalse },

#define MagickExtendedCoderHeader(coder,offset,magic,skip_spaces) \
  { coder, offset, (const unsigned char *) (magic), sizeof(magic)-1, skip_spaces },

#define MagickCoderAlias(coder,alias)  { alias, coder },

#define MagickCoderExports(coder) \
extern ModuleExport size_t \
  Register ## coder ## Image(void); \
extern ModuleExport void \
  Unregister ## coder ## Image(void);

static inline ImageType IdentifyImageCoderType(const Image *image,
  ExceptionInfo *exception)
{
  const char
    *value;

  value=GetImageProperty(image,"colorspace:auto-grayscale",exception);
  if (IsStringFalse(value) != MagickFalse)
    return(image->type);
  return(IdentifyImageType(image,exception));
}

static inline ImageType IdentifyImageCoderGrayType(const Image *image,
  ExceptionInfo *exception)
{
  const char
    *value;

  value=GetImageProperty(image,"colorspace:auto-grayscale",exception);
  if (IsStringFalse(value) != MagickFalse)
    return(UndefinedType);
  return(IdentifyImageGray(image,exception));
}

static inline MagickBooleanType IdentifyImageCoderGray(const Image *image,
  ExceptionInfo *exception)
{
  ImageType
    type;

  type=IdentifyImageCoderGrayType(image,exception);
  return(IsGrayImageType(type));
}

static inline MagickBooleanType SetImageCoderGray(Image *image,
  ExceptionInfo *exception)
{
  ImageType
    type;

  if (IsImageGray(image) != MagickFalse)
    return(MagickTrue);
  type=IdentifyImageCoderGrayType(image,exception);
  if (IsGrayImageType(type) == MagickFalse)
    return(MagickFalse);
  image->type=type;
  return(SetImageColorspace(image,GRAYColorspace,exception));
}

#endif
```

--------------------------------------------------------------------------------

---[FILE: coders.h]---
Location: ImageMagick-main/coders/coders.h

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

/*
  Include declarations.
*/
#include "coders/aai.h"
#include "coders/art.h"
#include "coders/ashlar.h"
#include "coders/avs.h"
#include "coders/bayer.h"
#include "coders/bgr.h"
#include "coders/bmp.h"
#include "coders/braille.h"
#include "coders/cals.h"
#include "coders/caption.h"
#include "coders/cin.h"
#include "coders/cip.h"
#if defined(MAGICKCORE_WINGDI32_DELEGATE)
  #include "coders/clipboard.h"
#endif
#include "coders/clip.h"
#include "coders/cmyk.h"
#include "coders/cube.h"
#include "coders/cut.h"
#include "coders/dcm.h"
#include "coders/dds.h"
#include "coders/debug.h"
#include "coders/dib.h"
#if defined(MAGICKCORE_DJVU_DELEGATE)
  #include "coders/djvu.h"
#endif
#include "coders/dng.h"
#if defined(MAGICKCORE_GVC_DELEGATE)
#include "coders/dot.h"
#endif
#if defined(MAGICKCORE_DPS_DELEGATE)
  #include "coders/dps.h"
#endif
#include "coders/dpx.h"
#if defined(MAGICKCORE_WINGDI32_DELEGATE)
  #include "coders/emf.h"
#endif
#if defined(MAGICKCORE_TIFF_DELEGATE)
  #include "coders/ept.h"
#endif
#if defined(MAGICKCORE_OPENEXR_DELEGATE)
  #include "coders/exr.h"
#endif
#include "coders/farbfeld.h"
#include "coders/fax.h"
#include "coders/fits.h"
#include "coders/fl32.h"
#if defined(MAGICKCORE_FLIF_DELEGATE)
  #include "coders/flif.h"
#endif
#include "coders/fpx.h"
#include "coders/ftxt.h"
#include "coders/gif.h"
#include "coders/gradient.h"
#include "coders/gray.h"
#include "coders/hald.h"
#include "coders/hdr.h"
#if defined(MAGICKCORE_HEIC_DELEGATE)
  #include "coders/heic.h"
#endif
#include "coders/histogram.h"
#include "coders/hrz.h"
#include "coders/html.h"
#include "coders/icon.h"
#include "coders/info.h"
#include "coders/inline.h"
#include "coders/ipl.h"
#if defined(MAGICKCORE_JBIG_DELEGATE)
  #include "coders/jbig.h"
#endif
#include "coders/jnx.h"
#if defined(MAGICKCORE_JP2_DELEGATE) || defined(MAGICKCORE_LIBOPENJP2_DELEGATE)
  #include "coders/jp2.h"
#endif
#if defined(MAGICKCORE_JPEG_DELEGATE)
  #include "coders/jpeg.h"
#endif
#include "coders/json.h"
#if defined(MAGICKCORE_JXL_DELEGATE)
  #include "coders/jxl.h"
#endif
#include "coders/kernel.h"
#include "coders/label.h"
#include "coders/mac.h"
#include "coders/magick.h"
#include "coders/map.h"
#include "coders/mask.h"
#include "coders/mat.h"
#include "coders/matte.h"
#include "coders/meta.h"
#include "coders/miff.h"
#include "coders/mono.h"
#include "coders/mpc.h"
#include "coders/mpr.h"
#include "coders/msl.h"
#include "coders/mtv.h"
#include "coders/mvg.h"
#include "coders/null.h"
#include "coders/ora.h"
#include "coders/otb.h"
#include "coders/palm.h"
#include "coders/pango.h"
#include "coders/pattern.h"
#include "coders/pcd.h"
#include "coders/pcl.h"
#include "coders/pcx.h"
#include "coders/pdb.h"
#include "coders/pdf.h"
#include "coders/pes.h"
#include "coders/pgx.h"
#include "coders/pict.h"
#include "coders/pix.h"
#include "coders/plasma.h"
#if defined(MAGICKCORE_PNG_DELEGATE)
  #include "coders/png.h"
#endif
#include "coders/pnm.h"
#include "coders/ps2.h"
#include "coders/ps3.h"
#include "coders/ps.h"
#include "coders/psd.h"
#include "coders/pwp.h"
#include "coders/qoi.h"
#include "coders/raw.h"
#include "coders/rgb.h"
#include "coders/rgf.h"
#include "coders/rla.h"
#include "coders/rle.h"
#include "coders/scr.h"
#include "coders/screenshot.h"
#include "coders/sct.h"
#include "coders/sf3.h"
#include "coders/sfw.h"
#include "coders/sgi.h"
#include "coders/sixel.h"
#include "coders/stegano.h"
#include "coders/strimg.h"
#include "coders/sun.h"
#include "coders/svg.h"
#include "coders/tga.h"
#include "coders/thumbnail.h"
#if defined(MAGICKCORE_TIFF_DELEGATE)
  #include "coders/tiff.h"
#endif
#include "coders/tile.h"
#include "coders/tim.h"
#include "coders/tim2.h"
#if defined(MAGICKCORE_FREETYPE_DELEGATE)
  #include "coders/ttf.h"
#endif
#include "coders/txt.h"
#if defined(MAGICKCORE_UHDR_DELEGATE)
  #include "coders/uhdr.h"
#endif
#include "coders/uil.h"
#include "coders/url.h"
#include "coders/uyvy.h"
#include "coders/vicar.h"
#include "coders/vid.h"
#include "coders/video.h"
#include "coders/viff.h"
#include "coders/vips.h"
#include "coders/wbmp.h"
#if defined(MAGICKCORE_WEBP_DELEGATE)
  #include "coders/webp.h"
#endif
#if defined(MAGICKCORE_WMF_DELEGATE) || defined(MAGICKCORE_WMFLITE_DELEGATE)
  #include "coders/wmf.h"
#endif
#include "coders/wpg.h"
#include "coders/xbm.h"
#if defined(MAGICKCORE_X11_DELEGATE)
  #include "coders/x.h"
#endif
#include "coders/xc.h"
#include "coders/xcf.h"
#include "coders/xpm.h"
#include "coders/xps.h"
#if defined(MAGICKCORE_X11_DELEGATE)
  #include "coders/xwd.h"
#endif
#include "coders/yaml.h"
#include "coders/ycbcr.h"
#include "coders/yuv.h"
```

--------------------------------------------------------------------------------

---[FILE: cube.c]---
Location: ImageMagick-main/coders/cube.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                         CCCC  U   U  BBBB   EEEEE                           %
%                        C      U   U  B   B  E                               %
%                        C      U   U  BBBB   EEE                             %
%                        C      U   U  B   B  E                               %
%                         CCCC   UUU   BBBB   EEEEE                           %
%                                                                             %
%                                                                             %
%                           Cube LUT Image Format                             %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                                 July 2018                                   %
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
% See Cube LUT specification 1.0 @
% https://wwwimages2.adobe.com/content/dam/acom/en/products/speedgrade/cc/pdfs/cube-lut-specification-1.0.pdf
%
*/

/*
  Include declarations.
*/
#include "MagickCore/studio.h"
#include "MagickCore/blob.h"
#include "MagickCore/blob-private.h"
#include "MagickCore/cache.h"
#include "MagickCore/colorspace.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/module.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/property.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/resource_.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/string-private.h"
#include "MagickCore/thread-private.h"
#include "MagickCore/token.h"

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d C U B E I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadCUBEImage() creates a Cube color lookup table image and returns it.  It
%  allocates the memory necessary for the new Image structure and returns a
%  pointer to the new image.
%
%  The format of the ReadCUBEImage method is:
%
%      Image *ReadCUBEImage(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadCUBEImage(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
#define FlattenCube(level,b,g,r)  \
  ((ssize_t) ((b)*(level)*(level)+(g)*(level)+(r)))

  typedef struct _CubePixel
  {
    float
      r,
      g,
      b;
  } CubePixel;

  char
    *buffer,
    token[MagickPathExtent],
    value[MagickPathExtent];

  CubePixel
    *cube;

  Image
    *image;

  MagickBooleanType
    status;

  MemoryInfo
    *cube_info;

  char
    *p;

  size_t
    cube_level,
    hald_level;

  ssize_t
    b,
    i,
    n;

  /*
    Read CUBE color lookup table.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(exception != (ExceptionInfo *) NULL);
  assert(exception->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",
      image_info->filename);
  image=AcquireImage(image_info,exception);
  status=OpenBlob(image_info,image,ReadBinaryBlobMode,exception);
  if (status == MagickFalse)
    {
      image=DestroyImageList(image);
      return((Image *) NULL);
    }
  cube_level=0;
  cube_info=(MemoryInfo *) NULL;
  cube=(CubePixel *) NULL;
  n=0;
  buffer=AcquireString("");
  *buffer='\0';
  p=buffer;
  while (ReadBlobString(image,p) != (char *) NULL)
  {
    const char
      *q;

    q=p;
    (void) GetNextToken(q,&q,MagickPathExtent,token);
    if ((*token == '#') || (*token == '\0'))
      continue;
    if (((LocaleCompare(token,"LUT_1D_SIZE") == 0) ||
         (LocaleCompare(token,"LUT_3D_SIZE") == 0)) &&
        (cube_info == (MemoryInfo *) NULL))
      {
        (void) GetNextToken(q,&q,MagickPathExtent,value);
        cube_level=(size_t) StringToLong(value);
        if (LocaleCompare(token,"LUT_1D_SIZE") == 0)
          cube_level=(size_t) ceil(pow((double) cube_level,1.0/3.0));
        if ((cube_level < 2) || (cube_level > 256))
          {
            buffer=DestroyString(buffer);
            ThrowReaderException(CorruptImageError,"ImproperImageHeader");
          }
        cube_info=AcquireVirtualMemory(cube_level*cube_level,cube_level*
          sizeof(*cube));
        if (cube_info == (MemoryInfo *) NULL)
          {
            buffer=DestroyString(buffer);
            ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
          }
        cube=(CubePixel *) GetVirtualMemoryBlob(cube_info);
        (void) memset(cube,0,cube_level*cube_level*cube_level*sizeof(*cube));
      }
    else
      if (LocaleCompare(token,"TITLE ") == 0)
        {
          (void) GetNextToken(q,&q,MagickPathExtent,value);
          (void) SetImageProperty(image,"title",value,exception);
        }
      else
        if (cube_level != 0)
          {
            char
              *r;

            if (n >= (ssize_t) (cube_level*cube_level*cube_level))
              break;
            r=buffer;
            cube[n].r=StringToFloat(r,&r);
            cube[n].g=StringToFloat(r,&r);
            cube[n].b=StringToFloat(r,&r);
            n++;
          }
        else
          if (('+' < *buffer) && (*buffer < ':'))
            break;
  }
  buffer=DestroyString(buffer);
  if (cube_level == 0)
    {
      if (cube_info != (MemoryInfo *) NULL)
        cube_info=RelinquishVirtualMemory(cube_info);
      ThrowReaderException(CorruptImageError,"ImproperImageHeader");
    }
  /*
    Convert CUBE image to HALD.
  */
  status=MagickTrue;
  hald_level=image_info->scene;
  if ((hald_level < 2) || (hald_level > 256))
    hald_level=8;
  image->columns=(size_t) (hald_level*hald_level*hald_level);
  image->rows=(size_t) (hald_level*hald_level*hald_level);
  status=SetImageExtent(image,image->columns,image->rows,exception);
  if (status == MagickFalse)
    {
      cube_info=RelinquishVirtualMemory(cube_info);
      return(DestroyImageList(image));
    }
  for (b=0; b < (ssize_t) (hald_level*hald_level); b++)
  {
    ssize_t
      g;

    if (status == MagickFalse)
      continue;
    for (g=0; g < (ssize_t) (hald_level*hald_level); g++)
    {
      Quantum
        *magick_restrict q;

      ssize_t
        r;

      if (status == MagickFalse)
        continue;
      q=QueueAuthenticPixels(image,(g % (ssize_t) hald_level)*((ssize_t)
        hald_level*(ssize_t) hald_level),(b*(ssize_t) hald_level)+((g/(ssize_t)
        hald_level) % ((ssize_t) hald_level*(ssize_t) hald_level)),
        hald_level*hald_level,1,exception);
      if (q == (Quantum *) NULL)
        {
          status=MagickFalse;
          continue;
        }
      for (r=0; r < (ssize_t) (hald_level*hald_level); r++)
      {
        CubePixel
          index,
          next,
          offset,
          scale;

        offset.r=(float) ((MagickSafeReciprocal(((double) hald_level*hald_level)-1.0)*
          r)*(cube_level-1.0));
        index.r=floorf(offset.r);
        scale.r=offset.r-index.r;
        next.r=index.r+1;
        if ((size_t) index.r == (cube_level-1))
          next.r=index.r;
        offset.g=(float) ((MagickSafeReciprocal(((double) hald_level*hald_level)-1.0)*
          g)*(cube_level-1.0));
        index.g=floorf(offset.g);
        scale.g=offset.g-index.g;
        next.g=index.g+1;
        if ((size_t) index.g == (cube_level-1))
          next.g=index.g;
        offset.b=(float) ((MagickSafeReciprocal(((double) hald_level*hald_level)-1.0)*
          b)*(cube_level-1.0));
        index.b=floorf(offset.b);
        scale.b=offset.b-index.b;
        next.b=index.b+1;
        if ((size_t) index.b == (cube_level-1))
          next.b=index.b;
        SetPixelRed(image,ClampToQuantum(QuantumRange*(
          cube[FlattenCube(cube_level,index.b,index.g,index.r)].r+scale.r*(
          cube[FlattenCube(cube_level,index.b,index.g,next.r)].r-
          cube[FlattenCube(cube_level,index.b,index.g,index.r)].r))),q);
        SetPixelGreen(image,ClampToQuantum(QuantumRange*(
          cube[FlattenCube(cube_level,index.b,index.g,index.r)].g+scale.g*(
          cube[FlattenCube(cube_level,index.b,next.g,index.r)].g-
          cube[FlattenCube(cube_level,index.b,index.g,index.r)].g))),q);
        SetPixelBlue(image,ClampToQuantum(QuantumRange*(
          cube[FlattenCube(cube_level,index.b,index.g,index.r)].b+scale.b*(
          cube[FlattenCube(cube_level,next.b,index.g,index.r)].b-
          cube[FlattenCube(cube_level,index.b,index.g,index.r)].b))),q);
        q+=(ptrdiff_t) GetPixelChannels(image);
      }
      if (SyncAuthenticPixels(image,exception) == MagickFalse)
        status=MagickFalse;
    }
  }
  cube_info=RelinquishVirtualMemory(cube_info);
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  if (status == MagickFalse)
    return(DestroyImageList(image));
  if (image_info->scene != 0)
    for (i=0; i < (ssize_t) image_info->scene; i++)
      AppendImageToList(&image,CloneImage(image,0,0,MagickTrue,exception));
  return(GetFirstImageInList(image));
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r H A L D I m a g e                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterCUBEImage() adds attributes for the Hald color lookup table image
%  format to the list of supported formats.  The attributes include the image
%  format tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob, whether
%  the format supports native in-memory I/O, and a brief description of the
%  format.
%
%  The format of the RegisterCUBEImage method is:
%
%      size_t RegisterCUBEImage(void)
%
*/
ModuleExport size_t RegisterCUBEImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("CUBE","CUBE","Cube LUT");
  entry->decoder=(DecodeImageHandler *) ReadCUBEImage;
  entry->flags^=CoderAdjoinFlag;
  entry->format_type=ImplicitFormatType;
  entry->flags|=CoderRawSupportFlag;
  entry->flags|=CoderEndianSupportFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r H A L D I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterCUBEImage() removes format registrations made by the
%  CUBE module from the list of supported formats.
%
%  The format of the UnregisterCUBEImage method is:
%
%      UnregisterCUBEImage(void)
%
*/
ModuleExport void UnregisterCUBEImage(void)
{
  (void) UnregisterMagickInfo("CUBE");
}
```

--------------------------------------------------------------------------------

---[FILE: cube.h]---
Location: ImageMagick-main/coders/cube.h

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

#define MagickCUBEHeaders

#define MagickCUBEAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(CUBE)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

````
