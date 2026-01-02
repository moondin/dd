---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 846
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 846 of 851)

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

---[FILE: incantation.msl]---
Location: ImageMagick-main/www/source/incantation.msl

```text
<?xml version="1.0" encoding="UTF-8"?>
<image size="400x400">
  <read filename="image.gif" />
  <get width="base-width" height="base-height" />
  <resize geometry="%[dimensions]" />
  <get width="width" height="height" />
  <print output="Image sized from %[base-width]x%[base-height] to %[width]x%[height].\n" />
  <write filename="image.png" />
</image>
```

--------------------------------------------------------------------------------

---[FILE: locale.xml]---
Location: ImageMagick-main/www/source/locale.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE localemap [
  <!ELEMENT localemap (include)+>
  <!ATTLIST localemap xmlns CDATA #FIXED ''>
  <!ELEMENT include EMPTY>
  <!ATTLIST include xmlns CDATA #FIXED '' file NMTOKEN #REQUIRED
    locale NMTOKEN #REQUIRED>
]>
<localemap>
  <include locale="no_NO.ISO-8859-1" file="bokmal.xml"/>
  <include locale="ca_ES.ISO-8859-1" file="catalan.xml"/>
  <include locale="hr_HR.ISO-8859-2" file="croatian.xml"/>
  <include locale="cs_CZ.ISO-8859-2" file="czech.xml"/>
  <include locale="da_DK.ISO-8859-1" file="danish.xml"/>
  <include locale="de_DE.ISO-8859-1" file="deutsch.xml"/>
  <include locale="nl_NL.ISO-8859-1" file="dutch.xml"/>
  <include locale="C" file="english.xml"/>
  <include locale="et_EE.ISO-8859-1" file="estonian.xml"/>
  <include locale="fi_FI.ISO-8859-1" file="finnish.xml"/>
  <include locale="fr_FR.ISO-8859-1" file="francais.xml"/>
  <include locale="fr_FR.ISO-8859-1" file="francais.xml"/>
  <include locale="fr_FR.UTF-8" file="francais.xml"/>
  <include locale="gl_ES.ISO-8859-1" file="galego.xml"/>
  <include locale="gl_ES.ISO-8859-1" file="galician.xml"/>
  <include locale="de_DE.ISO-8859-1" file="german.xml"/>
  <include locale="el_GR.ISO-8859-7" file="greek.xml"/>
  <include locale="en_US.UTF-8" file="english.xml"/>
  <include locale="iw_IL.ISO-8859-8" file="hebrew.xml"/>
  <include locale="hr_HR.ISO-8859-2" file="hrvatski.xml"/>
  <include locale="hu_HU.ISO-8859-2" file="hungarian.xml"/>
  <include locale="is_IS.ISO-8859-1" file="icelandic.xml"/>
  <include locale="it_IT.ISO-8859-1" file="italian.xml"/>
  <include locale="ja_JP.eucJP" file="japanese.xml"/>
  <include locale="ko_KR.eucKR" file="korean.xml"/>
  <include locale="lt_LT.ISO-8859-13" file="lithuanian.xml"/>
  <include locale="no_NO.ISO-8859-1" file="norwegian.xml"/>
  <include locale="nn_NO.ISO-8859-1" file="nynorsk.xml"/>
  <include locale="pl_PL.ISO-8859-2" file="polish.xml"/>
  <include locale="pt_PT.ISO-8859-1" file="portuguese.xml"/>
  <include locale="ro_RO.ISO-8859-2" file="romanian.xml"/>
  <include locale="ru_RU.ISO-8859-5" file="russian.xml"/>
  <include locale="sk_SK.ISO-8859-2" file="slovak.xml"/>
  <include locale="sl_SI.ISO-8859-2" file="slovene.xml"/>
  <include locale="es_ES.ISO-8859-1" file="spanish.xml"/>
  <include locale="sv_SE.ISO-8859-1" file="swedish.xml"/>
  <include locale="th_TH.TIS-620" file="thai.xml"/>
  <include locale="tr_TR.ISO-8859-9" file="turkish.xml"/>
</localemap>
```

--------------------------------------------------------------------------------

---[FILE: log.xml]---
Location: ImageMagick-main/www/source/log.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE logmap [
<!ELEMENT logmap (log)+>
<!ELEMENT log (#PCDATA)>
<!ATTLIST log events CDATA #IMPLIED>
<!ATTLIST log output CDATA #IMPLIED>
<!ATTLIST log filename CDATA #IMPLIED>
<!ATTLIST log generations CDATA #IMPLIED>
<!ATTLIST log limit CDATA #IMPLIED>
<!ATTLIST log format CDATA #IMPLIED>
]>
<!--
  Configure ImageMagick logger.

  Choose from one or more these events separated by a comma:
    all
    accelerate
    annotate
    blob
    cache
    coder
    command
    configure
    deprecate
    draw
    exception
    locale
    module
    none
    pixel
    policy
    resource
    trace
    transform
    user
    wand
    x11

  Choose one output handler:
    console
    debug
    event
    file
    none
    stderr
    stdout

  When output is to a file, specify the filename.  Embed %g in the filename to
  support log generations.  Generations is the number of log files to retain.
  Limit is the number of logging events before generating a new log generation.

  The format of the log is defined by embedding special format characters:

    %c   client
    %d   domain
    %e   event
    %f   function
    %g   generation
    %i   thread id
    %l   line
    %m   module
    %n   log name
    %p   process id
    %r   real CPU time
    %t   wall clock time
    %u   user CPU time
    %v   version
    %%   percent sign
    \n   newline
    \r   carriage return
    xml
-->
<logmap>
  <log events="None"/>
  <log output="console"/>
  <log filename="Magick-%g.log"/>
  <log generations="3"/>
  <log limit="2000"/>
  <log format="%t %r %u %v %d %c[%p]: %m/%f/%l/%d\n  %e"/>
</logmap>
```

--------------------------------------------------------------------------------

---[FILE: magic.xml]---
Location: ImageMagick-main/www/source/magic.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE magicmap [
<!ELEMENT magicmap (magic)+>
<!ELEMENT magic (#PCDATA)>
<!ATTLIST magic name CDATA #REQUIRED>
<!ATTLIST magic offset CDATA "0">
<!ATTLIST magic target CDATA #REQUIRED>
]>
<!--
  Associate an image format with a unique identifier. 

  Many image formats have identifiers that uniquely identify a particular
  image format. For example, the GIF image format always begins with GIF8
  as the first 4 characters of the image. ImageMagick uses this information
  to quickly determine the type of image it is dealing with when it reads
  an image.
-->
<magicmap>
  <!-- <magic name="GIF" offset="0" target="GIF8"/> -->
  <!-- <magic name="JPEG" offset="0" target="\377\330\377"/> -->
  <!-- <magic name="PNG" offset="0" target="\211PNG\r\n\032\n"/> -->
  <!-- <magic name="TIFF" offset="0" target="\115\115\000\052"/> -->
</magicmap>
```

--------------------------------------------------------------------------------

---[FILE: mgk.c]---
Location: ImageMagick-main/www/source/mgk.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                            M   M   GGGG  K   K                              %
%                            MM MM  G      K  K                               %
%                            M M M  G  GG  KKK                                %
%                            M   M  G   G  K  K                               %
%                            M   M   GGG   K   K                              %
%                                                                             %
%                                                                             %
%                        Read/Write MGK Image Format.                         %
%                                                                             %
%                              Software Design                                %
%                                John Cristy                                  %
%                                 July 1992                                   %
%                                                                             %
%                                                                             %
%  Copyright 1999 ImageMagick Studio LLC, a non-profit organization           %
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
#include <MagickCore/studio.h>
#include <MagickCore/blob.h>
#include <MagickCore/cache.h>
#include <MagickCore/colorspace.h>
#include <MagickCore/exception.h>
#include <MagickCore/image.h>
#include <MagickCore/list.h>
#include <MagickCore/magick.h>
#include <MagickCore/memory_.h>
#include <MagickCore/monitor.h>
#include <MagickCore/pixel-accessor.h>
#include <MagickCore/string_.h>
#include <MagickCore/module.h>

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteMGKImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   I s M G K                                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  IsMGK() returns MagickTrue if the image format type, identified by the
%  magick string, is MGK.
%
%  The format of the IsMGK method is:
%
%      MagickBooleanType IsMGK(const unsigned char *magick,const size_t length)
%
%  A description of each parameter follows:
%
%    o magick: This string is generally the first few bytes of an image file
%      or blob.
%
%    o length: Specifies the length of the magick string.
%
*/
static MagickBooleanType IsMGK(const unsigned char *magick,const size_t length)
{
  if (length < 7)
    return(MagickFalse);
  if (LocaleNCompare((char *) magick,"id=mgk",7) == 0)
    return(MagickTrue);
  return(MagickFalse);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d M G K I m a g e                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadMGKImage() reads a MGK image file and returns it.  It allocates the
%  memory necessary for the new Image structure and returns a pointer to the
%  new image.
%
%  The format of the ReadMGKImage method is:
%
%      Image *ReadMGKImage(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadMGKImage(const ImageInfo *image_info,ExceptionInfo *exception)
{
  char
    buffer[MaxTextExtent];

  Image
    *image;

  long
    y;

  MagickBooleanType
    status;

  register long
    x;

  register Quantum
    *q;

  register unsigned char
    *p;

  ssize_t
    count;

  unsigned char
    *pixels;

  unsigned long
    columns,
    rows;

  /*
    Open image file.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  if (image_info->debug != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",
      image_info->filename);
  assert(exception != (ExceptionInfo *) NULL);
  assert(exception->signature == MagickCoreSignature);
  image=AcquireImage(image_info,exception);
  status=OpenBlob(image_info,image,ReadBinaryBlobMode,exception);
  if (status == MagickFalse)
    {
      image=DestroyImageList(image);
      return((Image *) NULL);
    }
  /*
    Read MGK image.
  */
  (void) ReadBlobString(image,buffer);  /* read magic number */
  if (IsMGK(buffer,7) == MagickFalse)
    ThrowReaderException(CorruptImageError,"ImproperImageHeader");
  (void) ReadBlobString(image,buffer);
  count=(ssize_t) sscanf(buffer,"%lu %lu\n",&columns,&rows);
  if (count <= 0)
    ThrowReaderException(CorruptImageError,"ImproperImageHeader");
  do
  {
    /*
      Initialize image structure.
    */
    image->columns=columns;
    image->rows=rows;
    image->depth=8;
    if ((image_info->ping != MagickFalse) && (image_info->number_scenes != 0))
      if (image->scene >= (image_info->scene+image_info->number_scenes-1))
        break;
    /*
      Convert MGK raster image to pixel packets.
    */
    if (SetImageExtent(image,image->columns,image->rows,exception) == MagickFalse)
      return(DestroyImageList(image));
    pixels=(unsigned char *) AcquireQuantumMemory((size_t) image->columns,
      3UL*sizeof(*pixels));
    if (pixels == (unsigned char *) NULL)
      ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
    for (y=0; y < (ssize_t) image->rows; y++)
    {
      count=(ssize_t) ReadBlob(image,(size_t) (3*image->columns),pixels);
      if (count != (ssize_t) (3*image->columns))
        ThrowReaderException(CorruptImageError,"UnableToReadImageData");
      p=pixels;
      q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
      if (q == (Quantum *) NULL)
        break;
      for (x=0; x < (ssize_t) image->columns; x++)
      {
        SetPixelRed(image,ScaleCharToQuantum(*p++),q);
        SetPixelGreen(image,ScaleCharToQuantum(*p++),q);
        SetPixelBlue(image,ScaleCharToQuantum(*p++),q);
        q+=GetPixelChannels(image);
      }
      if (SyncAuthenticPixels(image,exception) == MagickFalse)
        break;
      if (image->previous == (Image *) NULL)
        if ((image->progress_monitor != (MagickProgressMonitor) NULL) &&
            (QuantumTick(y,image->rows) != MagickFalse))
          {
            status=image->progress_monitor(LoadImageTag,y,image->rows,
              image->client_data);
            if (status == MagickFalse)
              break;
          }
    }
    pixels=(unsigned char *) RelinquishMagickMemory(pixels);
    if (EOFBlob(image) != MagickFalse)
      {
        ThrowFileException(exception,CorruptImageError,"UnexpectedEndOfFile",
          image->filename);
        break;
      }
    /*
      Proceed to next image.
    */
    if (image_info->number_scenes != 0)
      if (image->scene >= (image_info->scene+image_info->number_scenes-1))
        break;
    *buffer='\0';
    (void) ReadBlobString(image,buffer);
    count=(ssize_t) sscanf(buffer,"%lu %lu\n",&columns,&rows);
    if (count > 0)
      {
        /*
          Allocate next image structure.
        */
        AcquireNextImage(image_info,image,exception);
        if (GetNextImageInList(image) == (Image *) NULL)
          {
            status=MagickFalse;
            break;
          }
        image=SyncNextImageInList(image);
        if (image->progress_monitor != (MagickProgressMonitor) NULL)
          {
            status=SetImageProgress(image,LoadImageTag,TellBlob(image),
              GetBlobSize(image));
            if (status == MagickFalse)
              break;
          }
      }
  } while (count > 0);
  (void) CloseBlob(image);
  if (status == MagickFalse)
    return(DestroyImageList(image));
  return(GetFirstImageInList(image));
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r M G K I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterMGKImage() adds attributes for the MGK image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterMGKImage method is:
%
%      unsigned long RegisterMGKImage(void)
%
*/
ModuleExport unsigned long RegisterMGKImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("MGK","MGK","MGK image");
  entry->decoder=(DecodeImageHandler *) ReadMGKImage;
  entry->encoder=(EncodeImageHandler *) WriteMGKImage;
  entry->magick=(IsImageFormatHandler *) IsMGK;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r M G K I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterMGKImage() removes format registrations made by the
%  MGK module from the list of supported formats.
%
%  The format of the UnregisterMGKImage method is:
%
%      UnregisterMGKImage(void)
%
*/
ModuleExport void UnregisterMGKImage(void)
{
  (void) UnregisterMagickInfo("MGK");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e M G K I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteMGKImage() writes an image to a file in red, green, and blue MGK
%  rasterfile format.
%
%  The format of the WriteMGKImage method is:
%
%      MagickBooleanType WriteMGKImage(const ImageInfo *image_info,
%        Image *image)
%
%  A description of each parameter follows.
%
%    o image_info: the image info.
%
%    o image:  The image.
%
%    o exception:  return any errors or warnings in this structure.
%
*/
static MagickBooleanType WriteMGKImage(const ImageInfo *image_info,Image *image,
  ExceptionInfo *exception)
{
  char
    buffer[MaxTextExtent];

  long
    y;

  MagickBooleanType
    status;

  MagickOffsetType
    scene;

  register const Quantum
    *p;

  register long
    x;

  register unsigned char
    *q;

  unsigned char
    *pixels;

  /*
    Open output image file.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  if (image->debug != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",image->filename);
  status=OpenBlob(image_info,image,WriteBinaryBlobMode,exception);
  if (status == MagickFalse)
    return(status);
  scene=0;
  do
  {
    /*
      Allocate memory for pixels.
    */
    if (image->colorspace != RGBColorspace)
      (void) SetImageColorspace(image,RGBColorspace,exception);
    pixels=(unsigned char *) AcquireQuantumMemory((size_t) image->columns,
      3UL*sizeof(*pixels));
    if (pixels == (unsigned char *) NULL)
      ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
    /*
      Initialize raster file header.
    */
    (void) WriteBlobString(image,"id=mgk\n");
    (void) FormatLocaleString(buffer,MaxTextExtent,"%lu %lu\n",image->columns,
       image->rows);
    (void) WriteBlobString(image,buffer);
    for (y=0; y < (ssize_t) image->rows; y++)
    {
      p=GetVirtualPixels(image,0,y,image->columns,1,exception);
      if (p == (const Quantum *) NULL)
        break;
      q=pixels;
      for (x=0; x < (ssize_t) image->columns; x++)
      {
        *q++=ScaleQuantumToChar(GetPixelRed(image,p));
        *q++=ScaleQuantumToChar(GetPixelGreen(image,p));
        *q++=ScaleQuantumToChar(GetPixelBlue(image,p));
        p+=GetPixelChannels(image);
      }
      (void) WriteBlob(image,(size_t) (q-pixels),pixels);
      if (image->previous == (Image *) NULL)
        if ((image->progress_monitor != (MagickProgressMonitor) NULL) &&
            (QuantumTick(y,image->rows) != MagickFalse))
          {
            status=image->progress_monitor(SaveImageTag,y,image->rows,
              image->client_data);
            if (status == MagickFalse)
              break;
          }
    }
    pixels=(unsigned char *) RelinquishMagickMemory(pixels);
    if (GetNextImageInList(image) == (Image *) NULL)
      break;
    image=SyncNextImageInList(image);
    status=SetImageProgress(image,SaveImagesTag,scene,
      GetImageListLength(image));
    if (status == MagickFalse)
      break;
    scene++;
  } while (image_info->adjoin != MagickFalse);
  (void) CloseBlob(image);
  return(MagickTrue);
}
```

--------------------------------------------------------------------------------

````
