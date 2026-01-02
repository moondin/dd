---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 383
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 383 of 851)

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

---[FILE: wand-view.h]---
Location: ImageMagick-main/MagickWand/wand-view.h

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

  MagickWand wand view methods.
*/
#ifndef MAGICKWAND_WAND_VIEW_H
#define MAGICKWAND_WAND_VIEW_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef struct _WandView
  WandView;

typedef MagickBooleanType
  (*DuplexTransferWandViewMethod)(const WandView *,const WandView *,WandView *,
    const ssize_t,const int,void *),
  (*GetWandViewMethod)(const WandView *,const ssize_t,const int,void *),
  (*SetWandViewMethod)(WandView *,const ssize_t,const int,void *),
  (*TransferWandViewMethod)(const WandView *,WandView *,const ssize_t,
    const int,void *),
  (*UpdateWandViewMethod)(WandView *,const ssize_t,const int,void *);

extern WandExport char
  *GetWandViewException(const WandView *,ExceptionType *);

extern WandExport MagickBooleanType
  DuplexTransferWandViewIterator(WandView *,WandView *,WandView *,
    DuplexTransferWandViewMethod,void *),
  GetWandViewIterator(WandView *,GetWandViewMethod,void *),
  IsWandView(const WandView *),
  SetWandViewIterator(WandView *,SetWandViewMethod,void *),
  TransferWandViewIterator(WandView *,WandView *,TransferWandViewMethod,void *),
  UpdateWandViewIterator(WandView *,UpdateWandViewMethod,void *);

extern WandExport MagickWand
  *GetWandViewWand(const WandView *);

extern WandExport PixelWand
  **GetWandViewPixels(const WandView *);

extern WandExport RectangleInfo
  GetWandViewExtent(const WandView *);

extern WandExport void
  SetWandViewDescription(WandView *,const char *),
  SetWandViewThreads(WandView *,const size_t);

extern WandExport WandView
  *CloneWandView(const WandView *),
  *DestroyWandView(WandView *),
  *NewWandView(MagickWand *),
  *NewWandViewExtent(MagickWand *,const ssize_t,const ssize_t,const size_t,
    const size_t);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: wand.c]---
Location: ImageMagick-main/MagickWand/wand.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                         W   W   AAA   N   N  DDDD                           %
%                         W   W  A   A  NN  N  D   D                          %
%                         W W W  AAAAA  N N N  D   D                          %
%                         WW WW  A   A  N  NN  D   D                          %
%                         W   W  A   A  N   N  DDDD                           %
%                                                                             %
%                                                                             %
%                         MagickWand Support Methods                          %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                                  May 2004                                   %
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
% Assign unique ID's to each magick wand.  We store the ID's in a splay-tree
% to track which ID's persist and which were destroyed.
%
%
*/

/*
  Include declarations.
*/
#include "MagickWand/studio.h"
#include "MagickWand/MagickWand.h"
#include "MagickWand/magick-wand-private.h"
#include "MagickWand/wand.h"

static SplayTreeInfo
  *wand_ids = (SplayTreeInfo *) NULL;

static MagickBooleanType
  instantiate_wand = MagickFalse;

static SemaphoreInfo
  *wand_semaphore = (SemaphoreInfo *) NULL;

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   A c q u i r e W a n d I d                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  AcquireWandId() returns a unique wand id.
%
%  The format of the AcquireWandId() method is:
%
%      size_t AcquireWandId()
%
*/
WandExport size_t AcquireWandId(void)
{
  MagickAddressType
    wand_id;

  static size_t
    id = 0;

  if (wand_semaphore == (SemaphoreInfo *) NULL)
    ActivateSemaphoreInfo(&wand_semaphore);
  LockSemaphoreInfo(wand_semaphore);
  if (wand_ids == (SplayTreeInfo *) NULL)
    wand_ids=NewSplayTree((int (*)(const void *,const void *)) NULL,
      (void *(*)(void *)) NULL,(void *(*)(void *)) NULL);
  wand_id=id++;
  (void) AddValueToSplayTree(wand_ids,(const void *) wand_id,(const void *)
    wand_id);
  instantiate_wand=MagickTrue;
  UnlockSemaphoreInfo(wand_semaphore);
  return((size_t) wand_id);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%    D e s t r o y W a n d I d s                                              %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  DestroyWandIds() deallocates memory associated with the wand id's.
%
%  The format of the DestroyWandIds() method is:
%
%      void DestroyWandIds(void)
%
%  A description of each parameter follows:
%
*/
WandExport void DestroyWandIds(void)
{
  if (wand_semaphore == (SemaphoreInfo *) NULL)
    ActivateSemaphoreInfo(&wand_semaphore);
  LockSemaphoreInfo(wand_semaphore);
  if (wand_ids != (SplayTreeInfo *) NULL)
    wand_ids=DestroySplayTree(wand_ids);
  instantiate_wand=MagickFalse;
  UnlockSemaphoreInfo(wand_semaphore);
  RelinquishSemaphoreInfo(&wand_semaphore);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%    R e l i n q u i s h W a n d I d                                          %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RelinquishWandId() relinquishes a unique wand id.
%
%  The format of the RelinquishWandId() method is:
%
%      void RelinquishWandId(const size_t *id)
%
%  A description of each parameter follows:
%
%    o id: a unique wand id.
%
*/
WandExport void RelinquishWandId(const size_t id)
{
  MagickAddressType
    wand_id = (MagickAddressType) id;

  LockSemaphoreInfo(wand_semaphore);
  if (wand_ids != (SplayTreeInfo *) NULL)
    (void) DeleteNodeFromSplayTree(wand_ids,(const void *) wand_id);
  UnlockSemaphoreInfo(wand_semaphore);
}
```

--------------------------------------------------------------------------------

---[FILE: wand.h]---
Location: ImageMagick-main/MagickWand/wand.h

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

  ImageMagick wand support methods.
*/
#ifndef MAGICKWAND_WAND_H
#define MAGICKWAND_WAND_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern WandExport size_t
  AcquireWandId(void);

extern WandExport void
  DestroyWandIds(void),
  RelinquishWandId(const size_t);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: wandcli-private.h]---
Location: ImageMagick-main/MagickWand/wandcli-private.h

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

  ImageMagick pixel wand API.
*/
#ifndef MAGICKWAND_WANDCLI_PRIVATE_H
#define MAGICKWAND_WANDCLI_PRIVATE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#define CLIWandException(severity,tag,option) \
  (void) CLIThrowException(cli_wand,GetMagickModule(),severity,tag, \
       "`%s'",option)

#define CLIWandExceptionArg(severity,tag,option,arg) \
  (void) CLIThrowException(cli_wand,GetMagickModule(),severity,tag, \
       "'%s' '%s'",option, arg)

#define CLIWandWarnReplaced(message) \
  if ( (cli_wand->process_flags & ProcessWarnDeprecated) != 0 ) \
    (void) CLIThrowException(cli_wand,GetMagickModule(),OptionWarning, \
       "ReplacedOption", "'%s', use \"%s\"",option,message)

#define CLIWandExceptionFile(severity,tag,context) \
{ char *message=GetExceptionMessage(errno); \
  (void) CLIThrowException(cli_wand,GetMagickModule(),severity,tag, \
       "'%s': %s",context,message); \
  message=DestroyString(message); \
}

#define CLIWandExceptionBreak(severity,tag,option) \
  { CLIWandException(severity,tag,option); break; }

#define CLIWandExceptionReturn(severity,tag,option) \
  { CLIWandException(severity,tag,option); return; }

#define CLIWandExceptArgBreak(severity,tag,option,arg) \
  { CLIWandExceptionArg(severity,tag,option,arg); break; }

#define CLIWandExceptArgReturn(severity,tag,option,arg) \
  { CLIWandExceptionArg(severity,tag,option,arg); return; }



/* Define how options should be processed */
typedef enum
{
  /* General Option Handling */
  ProcessImplicitRead          = 0x0001,  /* Non-options are image reads.
                                            If not set then skip implied read
                                            without producing an error.
                                            For use with "mogrify" handling */
  ProcessInterpretProperties = 0x0010,  /* allow general escapes in args */

  /* Special Option Handling */
  ProcessExitOption           = 0x0100,  /* allow '-exit' use */
  ProcessScriptOption         = 0x0200,  /* allow '-script' use */
  ProcessReadOption           = 0x0400,  /* allow '-read' use */
  ProcessWarnDeprecated       = 0x0800,  /* warn about deprecated options */

  /* Option Processing Flags */
  ProcessOneOptionOnly        = 0x4000,  /* Process one option only */
  ProcessImplicitWrite         = 0x8000,  /* Last arg is an implicit write */

  /* Flag Groups for specific Situations */
  MagickCommandOptionFlags    = 0x8FFF,  /* Magick Command Flags */
  ConvertCommandOptionFlags   = 0x800F,  /* Convert Command Flags */
  MagickScriptArgsFlags       = 0x000F,  /* Script CLI Process Args Flags */
} ProcessOptionFlags;


/* Define a generic stack linked list, for pushing and popping
   user defined ImageInfo settings, and Image lists.
   See '(' ')' and '-clone' CLI options.
*/
typedef struct _CLIStack
{
  struct _CLIStack  *next;
  void           *data;
} CLIStack;

/* Note this defines an extension to the normal MagickWand
   Which adds extra elements specific to the Shell API interface
   while still allowing the Wand to be passed to MagickWand API
   for specific operations.
*/
struct _MagickCLI       /* CLI interface version of MagickWand */
{
  struct _MagickWand    /* This must be the first structure */
     wand;              /* The Image List and Global Option Settings */

  QuantizeInfo
    *quantize_info;     /* for CLI API usage, not used by MagickWand API */

  DrawInfo
    *draw_info;         /* for CLI API usage, not used by MagickWand API */

  ProcessOptionFlags
    process_flags;      /* When handling CLI, what options do we process? */

  const OptionInfo
    *command;           /* The option entry that is being processed */

  CLIStack
    *image_list_stack,  /* Stacks of Image Lists and Image Info settings */
    *image_info_stack;

  const char            /* Location of option being processed for exception */
    *location,          /* location format string for exception reports */
    *filename;          /* "CLI", "unknown", or the script filename */

  size_t
    line,               /* location of current option from source */
    column;             /* note: line also used for cli argument count */

  size_t
    signature;
};



#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: wandcli.c]---
Location: ImageMagick-main/MagickWand/wandcli.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                W     W  AA  N   N DDD   CCC L    III                        %
%                W     W A  A NN  N D  D C    L     I                         %
%                W  W  W AAAA N N N D  D C    L     I                         %
%                 W W W  A  A N  NN D  D C    L     I                         %
%                  W W   A  A N   N DDD   CCC LLLL III                        %
%                                                                             %
%                         WandCLI Structure Methods                           %
%                                                                             %
%                              Dragon Computing                               %
%                              Anthony Thyssen                                %
%                                 April 2011                                  %
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
% General methods for handling the WandCLI structure used for Command Line.
%
% Anthony Thyssen, April 2011
*/

/*
  Include declarations.
*/
#include "MagickWand/studio.h"
#include "MagickWand/MagickWand.h"
#include "MagickWand/wand.h"
#include "MagickWand/magick-wand-private.h"
#include "MagickWand/wandcli.h"
#include "MagickWand/wandcli-private.h"
#include "MagickCore/exception.h"

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   A c q u i r e W a n d C L I                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  AcquireMagickCLI() creates a new CLI wand (an expanded form of Magick
%  Wand). The given image_info and exception is included as is if provided.
%
%  Use DestroyMagickCLI() to dispose of the CLI wand when it is no longer
%  needed.
%
%  The format of the NewMagickWand method is:
%
%      MagickCLI *AcquireMagickCLI(ImageInfo *image_info,
%           ExceptionInfo *exception)
%
*/
WandExport MagickCLI *AcquireMagickCLI(ImageInfo *image_info,
    ExceptionInfo *exception)
{
  MagickCLI
    *cli_wand;

  CheckMagickCoreCompatibility();
  cli_wand=(MagickCLI *) AcquireCriticalMemory(sizeof(*cli_wand));
  cli_wand->wand.id=AcquireWandId();
  (void) FormatLocaleString(cli_wand->wand.name,MagickPathExtent,
           "%s-%.20g","MagickWandCLI", (double) cli_wand->wand.id);
  cli_wand->wand.images=NewImageList();
  if ( image_info == (ImageInfo *) NULL)
    cli_wand->wand.image_info=AcquireImageInfo();
  else
    cli_wand->wand.image_info=image_info;
  if ( exception == (ExceptionInfo *) NULL)
    cli_wand->wand.exception=AcquireExceptionInfo();
  else
    cli_wand->wand.exception=exception;
  cli_wand->wand.debug=IsEventLogging();
  cli_wand->wand.signature=MagickWandSignature;

  /* Initialize CLI Part of MagickCLI */
  cli_wand->draw_info=CloneDrawInfo(cli_wand->wand.image_info,(DrawInfo *) NULL);
  cli_wand->quantize_info=AcquireQuantizeInfo(cli_wand->wand.image_info);
  cli_wand->process_flags=MagickCommandOptionFlags;  /* assume "magick" CLI */
  cli_wand->command=(const OptionInfo *) NULL;     /* no option at this time */
  cli_wand->image_list_stack=(CLIStack *) NULL;
  cli_wand->image_info_stack=(CLIStack *) NULL;

  /* default exception location...
     EG: sprintf(location, filename, line, column);
  */
  cli_wand->location="from \"%s\"";   /* location format using arguments: */
                                      /*      filename, line, column */
  cli_wand->filename="unknown";       /* script filename, unknown source */
  cli_wand->line=0;                   /* line from script OR CLI argument */
  cli_wand->column=0;                 /* column from script */

  cli_wand->signature=MagickWandSignature;
  if (cli_wand->wand.debug != MagickFalse)
    (void) LogMagickEvent(WandEvent,GetMagickModule(),"%s",cli_wand->wand.name);
  return(cli_wand);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   D e s t r o y W a n d C L I                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  DestroyMagickCLI() destroys everything in a CLI wand, including image_info
%  and any exceptions, if still present in the wand.
%
%  The format of the NewMagickWand method is:
%
%    MagickWand *DestroyMagickCLI()
%            Exception *exception)
%
*/
WandExport MagickCLI *DestroyMagickCLI(MagickCLI *cli_wand)
{
  CLIStack
    *node;

  assert(cli_wand != (MagickCLI *) NULL);
  assert(cli_wand->signature == MagickWandSignature);
  assert(cli_wand->wand.signature == MagickWandSignature);
  if (cli_wand->wand.debug != MagickFalse)
    (void) LogMagickEvent(WandEvent,GetMagickModule(),"%s",cli_wand->wand.name);

  /* Destroy CLI part of MagickCLI */
  if (cli_wand->draw_info != (DrawInfo *) NULL )
    cli_wand->draw_info=DestroyDrawInfo(cli_wand->draw_info);
  if (cli_wand->quantize_info != (QuantizeInfo *) NULL )
    cli_wand->quantize_info=DestroyQuantizeInfo(cli_wand->quantize_info);
  while(cli_wand->image_list_stack != (CLIStack *) NULL)
    {
      node=cli_wand->image_list_stack;
      cli_wand->image_list_stack=node->next;
      (void) DestroyImageList((Image *)node->data);
      (void) RelinquishMagickMemory(node);
    }
  while(cli_wand->image_info_stack != (CLIStack *) NULL)
    {
      node=cli_wand->image_info_stack;
      cli_wand->image_info_stack=node->next;
      (void) DestroyImageInfo((ImageInfo *)node->data);
      (void) RelinquishMagickMemory(node);
    }
  cli_wand->signature=(~MagickWandSignature);

  /* Destroy Wand part MagickCLI */
  cli_wand->wand.images=DestroyImageList(cli_wand->wand.images);
  if (cli_wand->wand.image_info != (ImageInfo *) NULL )
    cli_wand->wand.image_info=DestroyImageInfo(cli_wand->wand.image_info);
  if (cli_wand->wand.exception != (ExceptionInfo *) NULL )
    cli_wand->wand.exception=DestroyExceptionInfo(cli_wand->wand.exception);
  RelinquishWandId(cli_wand->wand.id);
  cli_wand->wand.signature=(~MagickWandSignature);
  cli_wand=(MagickCLI *) RelinquishMagickMemory(cli_wand);
  return((MagickCLI *) NULL);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   C L I C a t c h E x c e p t i o n                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  CLICatchException() will report exceptions, either just non-fatal warnings
%  only, or all errors, according to 'all_exceptions' boolean argument.
%
%  The function returns true if errors are fatal, in which case the caller
%  should abort and re-call with an 'all_exceptions' argument of true before
%  quitting.
%
%  The cut-off level between fatal and non-fatal may be controlled by options
%  (FUTURE), but defaults to 'Error' exceptions.
%
%  The format of the CLICatchException method is:
%
%    MagickBooleanType CLICatchException(MagickCLI *cli_wand,
%              const MagickBooleanType all_exceptions );
%
%  Arguments are
%
%    o cli_wand:   The Wand CLI that holds the exception Information
%
%    o all_exceptions:   Report all exceptions, including the fatal one
%
*/
WandExport MagickBooleanType CLICatchException(MagickCLI *cli_wand,
  const MagickBooleanType all_exceptions)
{
  MagickBooleanType
    status;

  assert(cli_wand != (MagickCLI *) NULL);
  assert(cli_wand->signature == MagickWandSignature);
  assert(cli_wand->wand.signature == MagickWandSignature);
  if (cli_wand->wand.debug != MagickFalse)
    (void) LogMagickEvent(WandEvent,GetMagickModule(),"%s",cli_wand->wand.name);

  /*
    FUTURE: '-regard_warning' should make this more sensitive.
    Note pipelined options may like more control over this level
  */

  status=cli_wand->wand.exception->severity > ErrorException ? MagickTrue :
    MagickFalse;

  if ((status == MagickFalse) || (all_exceptions != MagickFalse))
    CatchException(cli_wand->wand.exception); /* output and clear exceptions */

  return(status);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   C L I L o g E v e n t                                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% CLILogEvent() is a wrapper around LogMagickEvent(), adding to it the
% location of the option that is (about) to be executed.
%
*/
WandExport MagickBooleanType CLILogEvent(MagickCLI *cli_wand,
     const LogEventType type,const char *magick_module,const char *function,
     const size_t line,const char *format,...)
{
  char
    new_format[MagickPathExtent];

  MagickBooleanType
    status;

  va_list
    operands;

  if (IsEventLogging() == MagickFalse)
    return(MagickFalse);

  /* HACK - prepend the CLI location to format string.
     The better way would be add more arguments to the 'va' operands
     list, but that does not appear to be possible! So we do some
     pre-formatting of the location info here.
  */
  (void) FormatLocaleString(new_format,MagickPathExtent,cli_wand->location,
       cli_wand->filename, cli_wand->line, cli_wand->column);
  (void) ConcatenateMagickString(new_format," ",MagickPathExtent);
  (void) ConcatenateMagickString(new_format,format,MagickPathExtent);

  va_start(operands,format);
  status=LogMagickEventList(type,magick_module,function,line,new_format,
    operands);
  va_end(operands);

  return(status);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   C L I T h r o w E x c e p t i o n                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% CLIThrowException() is a wrapper around ThrowMagickException(), adding to
% it the location of the option that caused the exception to occur.
*/
WandExport MagickBooleanType CLIThrowException(MagickCLI *cli_wand,
  const char *magick_module,const char *function,const size_t line,
  const ExceptionType severity,const char *tag,const char *format,...)
{
  char
    new_format[MagickPathExtent];

  size_t
    len;

  MagickBooleanType
    status;

  va_list
    operands;

  /* HACK - append location to format string.
     The better way would be add more arguments to the 'va' operands
     list, but that does not appear to be possible! So we do some
     pre-formatting of the location info here.
  */
  (void) CopyMagickString(new_format,format,MagickPathExtent);
  (void) ConcatenateMagickString(new_format," ",MagickPathExtent);

  len=strlen(new_format);
  (void) FormatLocaleString(new_format+len,MagickPathExtent-len,
    cli_wand->location,cli_wand->filename,cli_wand->line,cli_wand->column);

  va_start(operands,format);
  status=ThrowMagickExceptionList(cli_wand->wand.exception,magick_module,
    function,line,severity,tag,new_format,operands);
  va_end(operands);
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: wandcli.h]---
Location: ImageMagick-main/MagickWand/wandcli.h

```c
/*
  Copyright @ 2011 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  MagickWand command-line option process.
*/
#ifndef MAGICKWAND_WAND_CLI_H
#define MAGICKWAND_WAND_CLI_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef struct _MagickCLI
  MagickCLI;

extern WandExport MagickCLI
  *AcquireMagickCLI(ImageInfo *,ExceptionInfo *),
  *DestroyMagickCLI(MagickCLI *);

extern WandExport MagickBooleanType
  CLICatchException(MagickCLI *,const MagickBooleanType),
  CLILogEvent(MagickCLI *,const LogEventType,const char *,const char *,
    const size_t,const char *,...)
    magick_attribute((__format__ (__printf__,6,7))),
  CLIThrowException(MagickCLI *,const char *,const char *,const size_t,
    const ExceptionType,const char *,const char *,...)
    magick_attribute((__format__ (__printf__,7,8)));

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: add_first.c]---
Location: ImageMagick-main/MagickWand/tests/add_first.c

```c
#include <stdio.h>
#include <MagickWand/MagickWand.h>

/* Simplify the exception handling
 * technically we should abort the program if
 *      severity >= ErrorException
 */
void ThrowWandException(MagickWand *wand)
{ char
  *description;

  ExceptionType
  severity;

  description=MagickGetException(wand,&severity);
  (void) fprintf(stderr,"%s %s %lu %s\n",GetMagickModule(),description);
  description=(char *) MagickRelinquishMemory(description);
}

/* useful function especially after appending two wands together */
#define SwapWands(a,b) { MagickWand *tmp=a; a=b; b=tmp; }

int main(int argc, char *argv[])
{
  MagickWand
    *wand,
    *input,
    *output;

  MagickBooleanType
    status;

  printf("Check prepend when using 'FirstIterator' on empty wand\n");
  printf("Result should be: 3210\n");

  MagickWandGenesis();

  wand = NewMagickWand();

  MagickSetFirstIterator(wand);    /* set first iterator to empty wand */

  status = MagickReadImage(wand, "font_0.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  status = MagickReadImage(wand, "font_1.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  status = MagickReadImage(wand, "font_2.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  status = MagickReadImage(wand, "font_3.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  /* append all images together to create the output wand */
  MagickResetIterator(wand); /* append all images */
  output = MagickAppendImages(wand,MagickFalse);
  wand = DestroyMagickWand(wand);  /* finished - could swap here */

  /* Final output */
  status = MagickWriteImage(output,"show:");
  if (status == MagickFalse)
    ThrowWandException(output);

  output = DestroyMagickWand(output);

  MagickWandTerminus();
}
```

--------------------------------------------------------------------------------

---[FILE: add_first_lists.c]---
Location: ImageMagick-main/MagickWand/tests/add_first_lists.c

```c
#include <stdio.h>
#include <MagickWand/MagickWand.h>

/* Simplify the exception handling
 * technically we should abort the program if
 *      severity >= ErrorException
 */
void ThrowWandException(MagickWand *wand)
{ char
  *description;

  ExceptionType
  severity;

  description=MagickGetException(wand,&severity);
  (void) fprintf(stderr,"%s %s %lu %s\n",GetMagickModule(),description);
  description=(char *) MagickRelinquishMemory(description);
}

/* useful function especially after appending two wands together */
#define SwapWands(a,b) { MagickWand *tmp=a; a=b; b=tmp; }

int main(int argc, char *argv[])
{
  MagickWand
    *wand,
    *input,
    *output;

  MagickBooleanType
    status;

  printf("Add 3 sets of images after setting 'first' on empty wand\n");
  printf("Result should be: 678 345 012\n");

  MagickWandGenesis();

  wand = NewMagickWand();
  input = NewMagickWand();

  MagickSetFirstIterator(wand);

  status = MagickReadImage(input, "font_0.gif" )
        && MagickReadImage(input, "font_1.gif" )
        && MagickReadImage(input, "font_2.gif" );
  if (status == MagickFalse)
    ThrowWandException(input);

  status = MagickAddImage(wand, input);
  if (status == MagickFalse)
    ThrowWandException(wand);

  ClearMagickWand(input);
  status = MagickReadImage(input, "font_3.gif" )
        && MagickReadImage(input, "font_4.gif" )
        && MagickReadImage(input, "font_5.gif" );
  if (status == MagickFalse)
    ThrowWandException(input);

  status = MagickAddImage(wand, input);
  if (status == MagickFalse)
    ThrowWandException(wand);

  ClearMagickWand(input);
  status = MagickReadImage(input, "font_6.gif" )
        && MagickReadImage(input, "font_7.gif" )
        && MagickReadImage(input, "font_8.gif" );
  if (status == MagickFalse)
    ThrowWandException(input);


  status = MagickAddImage(wand, input);
  if (status == MagickFalse)
    ThrowWandException(wand);
  input=DestroyMagickWand(input);  /* finished */

  /* append all images together to create the output wand */
  MagickResetIterator(wand); /* append all images */
  output = MagickAppendImages(wand,MagickFalse);
  wand = DestroyMagickWand(wand);  /* finished - could swap here */

  /* Final output */
  status = MagickWriteImage(output,"show:");
  if (status == MagickFalse)
    ThrowWandException(output);

  output = DestroyMagickWand(output);

  MagickWandTerminus();
}
```

--------------------------------------------------------------------------------

---[FILE: add_index.c]---
Location: ImageMagick-main/MagickWand/tests/add_index.c

```c
#include <stdio.h>
#include <MagickWand/MagickWand.h>

/* Simplify the exception handling
 * technically we should abort the program if
 *      severity >= ErrorException
 */
void ThrowWandException(MagickWand *wand)
{ char
  *description;

  ExceptionType
  severity;

  description=MagickGetException(wand,&severity);
  (void) fprintf(stderr,"%s %s %lu %s\n",GetMagickModule(),description);
  description=(char *) MagickRelinquishMemory(description);
}

/* useful function especially after appending two wands together */
#define SwapWands(a,b) { MagickWand *tmp=a; a=b; b=tmp; }

int main(int argc, char *argv[])
{
  MagickWand
    *wand,
    *input,
    *output;

  MagickBooleanType
    status;

  printf("Read 4 images, then set index 1 and read more individual images\n");
  printf("Result should be: 01 654 23\n");

  MagickWandGenesis();

  wand = NewMagickWand();
  input = NewMagickWand();

  status = MagickReadImage(input, "font_0.gif" )
        && MagickReadImage(input, "font_1.gif" )
        && MagickReadImage(input, "font_2.gif" )
        && MagickReadImage(input, "font_3.gif" );
  if (status == MagickFalse)
    ThrowWandException(input);

  status = MagickAddImage(wand, input);
  if (status == MagickFalse)
    ThrowWandException(wand);
  input=DestroyMagickWand(input);  /* finished */

  MagickSetIteratorIndex(wand, 1);

  status = MagickReadImage(wand, "font_4.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  status = MagickReadImage(wand, "font_5.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  status = MagickReadImage(wand, "font_6.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  /* append all images together to create the output wand */
  MagickResetIterator(wand); /* append all images */
  output = MagickAppendImages(wand,MagickFalse);
  wand = DestroyMagickWand(wand);  /* finished - could swap here */

  /* Final output */
  status = MagickWriteImage(output,"show:");
  if (status == MagickFalse)
    ThrowWandException(output);

  output = DestroyMagickWand(output);

  MagickWandTerminus();
}
```

--------------------------------------------------------------------------------

````
