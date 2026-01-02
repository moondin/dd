---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 321
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 321 of 851)

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

---[FILE: splay-tree.h]---
Location: ImageMagick-main/MagickCore/splay-tree.h

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

  MagickCore splay-tree methods.
*/
#ifndef MAGICKCORE_SPLAY_H
#define MAGICKCORE_SPLAY_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef struct _SplayTreeInfo
  SplayTreeInfo;

extern MagickExport MagickBooleanType
  AddValueToSplayTree(SplayTreeInfo *,const void *,const void *),
  DeleteNodeByValueFromSplayTree(SplayTreeInfo *,const void *),
  DeleteNodeFromSplayTree(SplayTreeInfo *,const void *);

extern MagickExport const void
  *GetNextKeyInSplayTree(SplayTreeInfo *),
  *GetNextValueInSplayTree(SplayTreeInfo *),
  *GetRootValueFromSplayTree(SplayTreeInfo *),
  *GetValueFromSplayTree(SplayTreeInfo *,const void *);

extern MagickExport int
  CompareSplayTreeString(const void *,const void *),
  CompareSplayTreeStringInfo(const void *,const void *);

extern MagickExport SplayTreeInfo
  *CloneSplayTree(SplayTreeInfo *,void *(*)(void *),void *(*)(void *)),
  *DestroySplayTree(SplayTreeInfo *),
  *NewSplayTree(int (*)(const void *,const void *),void *(*)(void *),
    void *(*)(void *));

extern MagickExport size_t
  GetNumberOfNodesInSplayTree(const SplayTreeInfo *);

extern MagickExport void
  *RemoveNodeByValueFromSplayTree(SplayTreeInfo *,const void *),
  *RemoveNodeFromSplayTree(SplayTreeInfo *,const void *),
  ResetSplayTree(SplayTreeInfo *),
  ResetSplayTreeIterator(SplayTreeInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: static.c]---
Location: ImageMagick-main/MagickCore/static.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                  SSSSS  TTTTT   AAA   TTTTT  IIIII   CCCC                   %
%                  SS       T    A   A    T      I    C                       %
%                   SSS     T    AAAAA    T      I    C                       %
%                     SS    T    A   A    T      I    C                       %
%                  SSSSS    T    A   A    T    IIIII   CCCC                   %
%                                                                             %
%                                                                             %
%                          MagickCore Static Methods                          %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                                 March 2000                                  %
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
%
*/

/*
  Include declarations.
*/
#include "MagickCore/studio.h"
#include "MagickCore/coder.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/module.h"
#include "MagickCore/policy.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "coders/coders.h"

/*
  Define declarations.
*/
#define AddMagickCoder(coder)  { #coder, MagickFalse, \
  Register ## coder ## Image, Unregister ## coder ## Image },

/*
  ImageMagick module stub.
*/
ModuleExport size_t RegisterUndefinedImage(void)
{
  return(MagickImageCoderSignature);
}

ModuleExport void UnregisterUndefinedImage(void)
{
}

/*
  ImageMagick modules.
*/
static struct
{
  const char
    *module;

  MagickBooleanType
    registered;

  size_t
    (*register_module)(void);

  void
    (*unregister_module)(void);
} MagickModules[] = {
#if !defined(MAGICKCORE_BUILD_MODULES)
  #include "coders/coders-list.h"
#endif
  { (const char *) NULL, MagickFalse, RegisterUndefinedImage, UnregisterUndefinedImage }
};

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   I n v o k e S t a t i c I m a g e F i l t e r                             %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  InvokeStaticImageFilter() invokes a static image filter.
%
%  The format of the InvokeStaticImageFilter method is:
%
%      MagickBooleanType InvokeStaticImageFilter(const char *tag,Image **image,
%        const int argc,const char **argv)
%
%  A description of each parameter follows:
%
%    o tag: the module tag.
%
%    o image: the image.
%
%    o argc: the number of elements in the argument vector.
%
%    o argv: A text array containing the command line arguments.
%
%    o argv: A text array containing the command line arguments.
%
%    o exception: return any errors or warnings in this structure.
%
*/
#if defined(MAGICKCORE_MODULES_SUPPORT)
MagickExport MagickBooleanType InvokeStaticImageFilter(const char *tag,
  Image **image,const int argc,const char **argv,ExceptionInfo *exception)
{
  PolicyRights
    rights;

  assert(image != (Image **) NULL);
  assert((*image)->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",(*image)->filename);
  rights=ReadPolicyRights;
  if (IsRightsAuthorized(FilterPolicyDomain,rights,tag) == MagickFalse)
    {
      errno=EPERM;
      (void) ThrowMagickException(exception,GetMagickModule(),PolicyError,
        "NotAuthorized","`%s'",tag);
      return(MagickFalse);
    }
#if defined(MAGICKCORE_MODULES_SUPPORT)
  (void) tag;
  (void) argc;
  (void) argv;
  (void) exception;
#else
  {
    extern size_t
      analyzeImage(Image **,const int,char **,ExceptionInfo *);

    ImageFilterHandler
      *image_filter;

    image_filter=(ImageFilterHandler *) NULL;
    if (LocaleCompare("analyze",tag) == 0)
      image_filter=(ImageFilterHandler *) analyzeImage;
    if (image_filter == (ImageFilterHandler *) NULL)
      (void) ThrowMagickException(exception,GetMagickModule(),ModuleError,
        "UnableToLoadModule","`%s'",tag);
    else
      {
        size_t
          signature;

        if ((*image)->debug != MagickFalse)
          (void) LogMagickEvent(TransformEvent,GetMagickModule(),
            "Invoking \"%s\" static image filter",tag);
        signature=image_filter(image,argc,argv,exception);
        if ((*image)->debug != MagickFalse)
          (void) LogMagickEvent(TransformEvent,GetMagickModule(),
            "\"%s\" completes",tag);
        if (signature != MagickImageFilterSignature)
          {
            (void) ThrowMagickException(exception,GetMagickModule(),ModuleError,
              "ImageFilterSignatureMismatch","'%s': %8lx != %8lx",tag,
              (unsigned long) signature,(unsigned long)
              MagickImageFilterSignature);
            return(MagickFalse);
          }
      }
  }
#endif
  return(MagickTrue);
}
#endif

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r S t a t i c M o d u l e                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterStaticModule() statically registers a module.
%
%  The format of the RegisterStaticModule method is:
%
%      MagickBooleanType RegisterStaticModule(const char module,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o module: the want to register.
%
%    o exception: return any errors or warnings in this structure.
%
*/
MagickExport MagickBooleanType RegisterStaticModule(const char *module,
  ExceptionInfo *exception)
{
  char
    module_name[MagickPathExtent];

  PolicyRights
    rights;

  const CoderInfo
    *p;

  size_t
    extent;

  ssize_t
    i;

  /*
    Assign module name from alias.
  */
  assert(module != (const char *) NULL);
  (void) CopyMagickString(module_name,module,MagickPathExtent);
  p=GetCoderInfo(module,exception);
  if (p != (CoderInfo *) NULL)
    (void) CopyMagickString(module_name,p->name,MagickPathExtent);
  rights=(PolicyRights) (ReadPolicyRights | WritePolicyRights);
  if (IsRightsAuthorized(ModulePolicyDomain,rights,module_name) == MagickFalse)
    {
      errno=EPERM;
      (void) ThrowMagickException(exception,GetMagickModule(),PolicyError,
        "NotAuthorized","`%s'",module);
      return(MagickFalse);
    }
  extent=sizeof(MagickModules)/sizeof(MagickModules[0]);
  for (i=0; i < (ssize_t) extent; i++)
    if (LocaleCompare(MagickModules[i].module,module_name) == 0)
      {
        if (MagickModules[i].registered == MagickFalse)
          {
            (void) (MagickModules[i].register_module)();
            MagickModules[i].registered=MagickTrue;
          }
        return(MagickTrue);
      }
  return(MagickFalse);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r S t a t i c M o d u l e s                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterStaticModules() statically registers all the available module
%  handlers.
%
%  The format of the RegisterStaticModules method is:
%
%      (void) RegisterStaticModules(void)
%
*/
MagickExport void RegisterStaticModules(void)
{
  PolicyRights
    rights;

  size_t
    extent;

  ssize_t
    i;

  rights=(PolicyRights) (ReadPolicyRights | WritePolicyRights);
  extent=sizeof(MagickModules)/sizeof(MagickModules[0]);
  for (i=0; i < (ssize_t) extent; i++)
  {
    if (MagickModules[i].registered == MagickFalse)
      {
        if (IsRightsAuthorized(ModulePolicyDomain,rights,MagickModules[i].module) == MagickFalse)
          continue;
        (void) (MagickModules[i].register_module)();
        MagickModules[i].registered=MagickTrue;
      }
  }
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r S t a t i c M o d u l e                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterStaticModule() statically unregisters the named module.
%
%  The format of the UnregisterStaticModule method is:
%
%      MagickBooleanType UnregisterStaticModule(const char *module)
%
%  A description of each parameter follows:
%
%    o module: the module we want to unregister.
%
*/
MagickExport MagickBooleanType UnregisterStaticModule(const char *module)
{
  size_t
    extent;

  ssize_t
    i;

  extent=sizeof(MagickModules)/sizeof(MagickModules[0]);
  for (i=0; i < (ssize_t) extent; i++)
    if (LocaleCompare(MagickModules[i].module,module) == 0)
      {
        if (MagickModules[i].registered != MagickFalse)
          {
            (MagickModules[i].unregister_module)();
            MagickModules[i].registered=MagickFalse;
          }
        return(MagickTrue);
      }
  return(MagickFalse);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r S t a t i c M o d u l e s                             %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterStaticModules() statically unregisters all the available module
%  handlers.
%
%  The format of the UnregisterStaticModules method is:
%
%      UnregisterStaticModules(void)
%
*/
MagickExport void UnregisterStaticModules(void)
{
  size_t
    extent;

  ssize_t
    i;

  extent=sizeof(MagickModules)/sizeof(MagickModules[0]);
  for (i=0; i < (ssize_t) extent; i++)
  {
    if (MagickModules[i].registered != MagickFalse)
      {
        (MagickModules[i].unregister_module)();
        MagickModules[i].registered=MagickFalse;
      }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: static.h]---
Location: ImageMagick-main/MagickCore/static.h

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

  MagickCore static coder registration methods.
*/
#ifndef MAGICKCORE_STATIC_H
#define MAGICKCORE_STATIC_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern MagickExport MagickBooleanType
  InvokeStaticImageFilter(const char *,Image **,const int,const char **,
    ExceptionInfo *),
  RegisterStaticModule(const char *,ExceptionInfo *exception),
  UnregisterStaticModule(const char *);

extern MagickExport void
  RegisterStaticModules(void),
  UnregisterStaticModules(void);

extern ModuleExport size_t
  RegisterAAIImage(void),
  RegisterARTImage(void),
  RegisterASHLARImage(void),
  RegisterAVSImage(void),
  RegisterBAYERImage(void),
  RegisterBGRImage(void),
  RegisterBMPImage(void),
  RegisterBRAILLEImage(void),
  RegisterCALSImage(void),
  RegisterCAPTIONImage(void),
  RegisterCINImage(void),
  RegisterCIPImage(void),
  RegisterCLIPImage(void),
  RegisterCLIPBOARDImage(void),
  RegisterCMYKImage(void),
  RegisterCUBEImage(void),
  RegisterCUTImage(void),
  RegisterDCMImage(void),
  RegisterDDSImage(void),
  RegisterDEBUGImage(void),
  RegisterDIBImage(void),
  RegisterDJVUImage(void),
  RegisterDNGImage(void),
  RegisterDPSImage(void),
  RegisterDPXImage(void),
  RegisterEMFImage(void),
  RegisterEPTImage(void),
  RegisterEXRImage(void),
  RegisterFARBFELDImage(void),
  RegisterFAXImage(void),
  RegisterFITSImage(void),
  RegisterFL32Image(void),
  RegisterFLIFImage(void),
  RegisterFPXImage(void),
  RegisterFTXTImage(void),
  RegisterGIFImage(void),
  RegisterGRADIENTImage(void),
  RegisterGRAYImage(void),
  RegisterHALDImage(void),
  RegisterHDRImage(void),
  RegisterHEICImage(void),
  RegisterHISTOGRAMImage(void),
  RegisterHRZImage(void),
  RegisterHTMLImage(void),
  RegisterICONImage(void),
  RegisterINFOImage(void),
  RegisterINLINEImage(void),
  RegisterIPLImage(void),
  RegisterJBIGImage(void),
  RegisterJNXImage(void),
  RegisterJPEGImage(void),
  RegisterJSONImage(void),
  RegisterJP2Image(void),
  RegisterJXLImage(void),
  RegisterLABELImage(void),
  RegisterMACImage(void),
  RegisterMAGICKImage(void),
  RegisterMAPImage(void),
  RegisterMASKImage(void),
  RegisterMATImage(void),
  RegisterMATTEImage(void),
  RegisterMETAImage(void),
  RegisterMIFFImage(void),
  RegisterMONOImage(void),
  RegisterMPCImage(void),
  RegisterMPRImage(void),
  RegisterMSLImage(void),
  RegisterMTVImage(void),
  RegisterMVGImage(void),
  RegisterNULLImage(void),
  RegisterORAImage(void),
  RegisterOTBImage(void),
  RegisterPALMImage(void),
  RegisterPANGOImage(void),
  RegisterPATTERNImage(void),
  RegisterPCDImage(void),
  RegisterPCLImage(void),
  RegisterPCXImage(void),
  RegisterPDBImage(void),
  RegisterPDFImage(void),
  RegisterPESImage(void),
  RegisterPGXImage(void),
  RegisterPICTImage(void),
  RegisterPIXImage(void),
  RegisterPLASMAImage(void),
  RegisterPNGImage(void),
  RegisterPNMImage(void),
  RegisterPSImage(void),
  RegisterPS2Image(void),
  RegisterPS3Image(void),
  RegisterPSDImage(void),
  RegisterPWPImage(void),
  RegisterQOIImage(void),
  RegisterRAWImage(void),
  RegisterRGBImage(void),
  RegisterRGFImage(void),
  RegisterRLAImage(void),
  RegisterRLEImage(void),
  RegisterSCRImage(void),
  RegisterSCREENSHOTImage(void),
  RegisterSCTImage(void),
  RegisterSF3Image(void),
  RegisterSFWImage(void),
  RegisterSGIImage(void),
  RegisterSIXELImage(void),
  RegisterSTEGANOImage(void),
  RegisterSTRIMGImage(void),
  RegisterSUNImage(void),
  RegisterSVGImage(void),
  RegisterTGAImage(void),
  RegisterTHUMBNAILImage(void),
  RegisterTIFFImage(void),
  RegisterTILEImage(void),
  RegisterTIMImage(void),
  RegisterTIM2Image(void),
  RegisterTTFImage(void),
  RegisterTXTImage(void),
  RegisterUHDRImage(void),
  RegisterUILImage(void),
  RegisterURLImage(void),
  RegisterUYVYImage(void),
  RegisterVICARImage(void),
  RegisterVIDImage(void),
  RegisterVIDEOImage(void),
  RegisterVIFFImage(void),
  RegisterVIPSImage(void),
  RegisterWBMPImage(void),
  RegisterWEBPImage(void),
  RegisterWMFImage(void),
  RegisterWPGImage(void),
  RegisterXImage(void),
  RegisterXBMImage(void),
  RegisterXCImage(void),
  RegisterXCFImage(void),
  RegisterXPMImage(void),
  RegisterXPSImage(void),
  RegisterXWDImage(void),
  RegisterYAMLImage(void),
  RegisterYCBCRImage(void),
  RegisterYUVImage(void);

extern ModuleExport void
  UnregisterAAIImage(void),
  UnregisterARTImage(void),
  UnregisterASHLARImage(void),
  UnregisterAVSImage(void),
  UnregisterBAYERImage(void),
  UnregisterBGRImage(void),
  UnregisterBMPImage(void),
  UnregisterBRAILLEImage(void),
  UnregisterCALSImage(void),
  UnregisterCAPTIONImage(void),
  UnregisterCINImage(void),
  UnregisterCIPImage(void),
  UnregisterCLIPImage(void),
  UnregisterCLIPBOARDImage(void),
  UnregisterCMYKImage(void),
  UnregisterCUBEImage(void),
  UnregisterCUTImage(void),
  UnregisterDCMImage(void),
  UnregisterDDSImage(void),
  UnregisterDEBUGImage(void),
  UnregisterDIBImage(void),
  UnregisterDJVUImage(void),
  UnregisterDNGImage(void),
  UnregisterDPSImage(void),
  UnregisterDPXImage(void),
  UnregisterEMFImage(void),
  UnregisterEPTImage(void),
  UnregisterEXRImage(void),
  UnregisterFARBFELDImage(void),
  UnregisterFAXImage(void),
  UnregisterFITSImage(void),
  UnregisterFL32Image(void),
  UnregisterFLIFImage(void),
  UnregisterFPXImage(void),
  UnregisterFTXTImage(void),
  UnregisterGIFImage(void),
  UnregisterGRADIENTImage(void),
  UnregisterGRAYImage(void),
  UnregisterHALDImage(void),
  UnregisterHDRImage(void),
  UnregisterHEICImage(void),
  UnregisterHISTOGRAMImage(void),
  UnregisterHRZImage(void),
  UnregisterHTMLImage(void),
  UnregisterICONImage(void),
  UnregisterINFOImage(void),
  UnregisterINLINEImage(void),
  UnregisterIPLImage(void),
  UnregisterJBIGImage(void),
  UnregisterJNXImage(void),
  UnregisterJPEGImage(void),
  UnregisterJP2Image(void),
  UnregisterJSONImage(void),
  UnregisterJXLImage(void),
  UnregisterLABELImage(void),
  UnregisterMACImage(void),
  UnregisterMAGICKImage(void),
  UnregisterMAPImage(void),
  UnregisterMASKImage(void),
  UnregisterMATImage(void),
  UnregisterMATTEImage(void),
  UnregisterMETAImage(void),
  UnregisterMIFFImage(void),
  UnregisterMONOImage(void),
  UnregisterMPCImage(void),
  UnregisterMPRImage(void),
  UnregisterMSLImage(void),
  UnregisterMTVImage(void),
  UnregisterMVGImage(void),
  UnregisterNULLImage(void),
  UnregisterORAImage(void),
  UnregisterOTBImage(void),
  UnregisterPALMImage(void),
  UnregisterPANGOImage(void),
  UnregisterPATTERNImage(void),
  UnregisterPCDImage(void),
  UnregisterPCLImage(void),
  UnregisterPCXImage(void),
  UnregisterPDBImage(void),
  UnregisterPDFImage(void),
  UnregisterPESImage(void),
  UnregisterPGXImage(void),
  UnregisterPICTImage(void),
  UnregisterPIXImage(void),
  UnregisterPLASMAImage(void),
  UnregisterPNGImage(void),
  UnregisterPNMImage(void),
  UnregisterPSImage(void),
  UnregisterPS2Image(void),
  UnregisterPS3Image(void),
  UnregisterPSDImage(void),
  UnregisterPWPImage(void),
  UnregisterQOIImage(void),
  UnregisterRAWImage(void),
  UnregisterRGBImage(void),
  UnregisterRGFImage(void),
  UnregisterRLAImage(void),
  UnregisterRLEImage(void),
  UnregisterSCRImage(void),
  UnregisterSCREENSHOTImage(void),
  UnregisterSCTImage(void),
  UnregisterSF3Image(void),
  UnregisterSFWImage(void),
  UnregisterSGIImage(void),
  UnregisterSIXELImage(void),
  UnregisterSTEGANOImage(void),
  UnregisterSTRIMGImage(void),
  UnregisterSUNImage(void),
  UnregisterSVGImage(void),
  UnregisterTGAImage(void),
  UnregisterTHUMBNAILImage(void),
  UnregisterTIFFImage(void),
  UnregisterTILEImage(void),
  UnregisterTIMImage(void),
  UnregisterTIM2Image(void),
  UnregisterTTFImage(void),
  UnregisterTXTImage(void),
  UnregisterUHDRImage(void),
  UnregisterUILImage(void),
  UnregisterURLImage(void),
  UnregisterUYVYImage(void),
  UnregisterVICARImage(void),
  UnregisterVIDImage(void),
  UnregisterVIDEOImage(void),
  UnregisterVIFFImage(void),
  UnregisterVIPSImage(void),
  UnregisterWBMPImage(void),
  UnregisterWEBPImage(void),
  UnregisterWMFImage(void),
  UnregisterWPGImage(void),
  UnregisterXImage(void),
  UnregisterXBMImage(void),
  UnregisterXCImage(void),
  UnregisterXCFImage(void),
  UnregisterXPMImage(void),
  UnregisterXPSImage(void),
  UnregisterXWDImage(void),
  UnregisterYAMLImage(void),
  UnregisterYCBCRImage(void),
  UnregisterYUVImage(void);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: statistic-private.h]---
Location: ImageMagick-main/MagickCore/statistic-private.h

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

  MagickCore private graphic gems methods.
*/
#ifndef MAGICKCORE_STATISTIC_PRIVATE_H
#define MAGICKCORE_STATISTIC_PRIVATE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

static inline MagickBooleanType MagickSafeSignificantError(const double error,
  const double fuzz)
{
  double threshold = (fuzz > 0.0 ? fuzz : MagickEpsilon)*(1.0+MagickEpsilon);
  return(error > threshold ? MagickTrue : MagickFalse);
}

static inline double MagickSafeLog10(const double x)
{
  if (x < MagickEpsilon)
    return(log10(MagickEpsilon));
  if (fabs(x-1.0) < MagickEpsilon)
    return(0.0);
  return(log10(x));
}

static inline double MagickSafeReciprocal(const double x)
{
  if ((x > -MagickEpsilon) && (x < MagickEpsilon))
    return(1.0/MagickEpsilon);
  return(1.0/x);
}

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````
