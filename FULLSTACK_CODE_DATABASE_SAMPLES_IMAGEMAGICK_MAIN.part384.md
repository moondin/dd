---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 384
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 384 of 851)

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

---[FILE: add_last.c]---
Location: ImageMagick-main/MagickWand/tests/add_last.c

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
    *output;

  MagickBooleanType
    status;

  printf("Check append when using 'LastIterator' on empty wand\n");
  printf("Result should be: 0123\n");

  MagickWandGenesis();

  wand = NewMagickWand();

  MagickSetLastIterator(wand);  /* to empty wand */

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

---[FILE: add_last_lists.c]---
Location: ImageMagick-main/MagickWand/tests/add_last_lists.c

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

  printf("Add 3 sets of images after setting 'last' on empty wand\n");
  printf("Result should be: 012 345 678\n");

  MagickWandGenesis();

  wand = NewMagickWand();
  input = NewMagickWand();

  MagickSetLastIterator(wand);

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
  input=DestroyMagickWand(input);

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

---[FILE: add_mixed.c]---
Location: ImageMagick-main/MagickWand/tests/add_mixed.c

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
    *wand,    /* red image wand */
    *output;

  MagickBooleanType
    status;

  printf("Read 3 sets of 3 Images, each set with settings: none, first, last\n");
  printf("Result should be: 543 012 678\n");

  MagickWandGenesis();

  /* read in the red image */
  wand = NewMagickWand();

  /* add test from empty wand */
  status = MagickReadImage(wand, "font_0.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  status = MagickReadImage(wand, "font_1.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  status = MagickReadImage(wand, "font_2.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  /* add test to start */
  MagickSetFirstIterator(wand);
  status = MagickReadImage(wand, "font_3.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  status = MagickReadImage(wand, "font_4.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  status = MagickReadImage(wand, "font_5.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  /* add test to end */
  MagickSetLastIterator(wand);
  status = MagickReadImage(wand, "font_6.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  status = MagickReadImage(wand, "font_7.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);

  status = MagickReadImage(wand, "font_8.gif" );
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

---[FILE: add_mixed_lists.c]---
Location: ImageMagick-main/MagickWand/tests/add_mixed_lists.c

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
    *wand,    /* red image wand */
    *input,    /* red image wand */
    *output;

  MagickBooleanType
    status;

  printf("Add 3 sets of image using settings: none, first, last\n");
  printf("Result should be: 345 012 678\n");

  MagickWandGenesis();

  wand = NewMagickWand();
  input = NewMagickWand();

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

  MagickSetFirstIterator(wand);
  status = MagickAddImage(wand, input);
  if (status == MagickFalse)
    ThrowWandException(wand);

  ClearMagickWand(input);
  status = MagickReadImage(input, "font_6.gif" )
        && MagickReadImage(input, "font_7.gif" )
        && MagickReadImage(input, "font_8.gif" );
  if (status == MagickFalse)
    ThrowWandException(input);

  MagickSetLastIterator(wand);
  status = MagickAddImage(wand, input);
  if (status == MagickFalse)
    ThrowWandException(wand);
  input=DestroyMagickWand(input);

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

---[FILE: add_norm.c]---
Location: ImageMagick-main/MagickWand/tests/add_norm.c

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
    *output;

  MagickBooleanType
    status;

  printf("Just read images one at a time, no settings\n");
  printf("Result should be: 0123\n");

  MagickWandGenesis();

  wand = NewMagickWand();

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

---[FILE: add_norm_lists.c]---
Location: ImageMagick-main/MagickWand/tests/add_norm_lists.c

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

  printf("Just read images in three groups, no settings used\n");
  printf("Result should be: 012 345 678\n");

  MagickWandGenesis();

  wand = NewMagickWand();
  input = NewMagickWand();

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

  ClearMagickWand(input);
  status = MagickReadImage(input, "font_6.gif" )
        && MagickReadImage(input, "font_7.gif" )
        && MagickReadImage(input, "font_8.gif" );
  if (status == MagickFalse)
    ThrowWandException(input);

  status = MagickAddImage(wand, input);
  if (status == MagickFalse)
    ThrowWandException(wand);
  input=DestroyMagickWand(input);

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

---[FILE: loop_over_lists.c]---
Location: ImageMagick-main/MagickWand/tests/loop_over_lists.c

```c
#include <stdio.h>
#include <MagickWand/MagickWand.h>

/* set this to true to test loops methods with a empty wand */
#define TEST_EMPTY_WAND 0

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
    *output;

  MagickBooleanType
    status;

  MagickWandGenesis();

  printf("Read in a list of 6 images...\n");

  wand = NewMagickWand();
#if !TEST_EMPTY_WAND
  status = MagickReadImage(wand, "font_0.gif" )
        && MagickReadImage(wand, "font_1.gif" )
        && MagickReadImage(wand, "font_2.gif" )
        && MagickReadImage(wand, "font_3.gif" )
        && MagickReadImage(wand, "font_4.gif" )
        && MagickReadImage(wand, "font_5.gif" );
  if (status == MagickFalse)
    ThrowWandException(wand);
#endif

  printf("I actually read in %u images\n",
             (unsigned) MagickGetNumberImages(wand) );
  printf("\n");

  printf("After reading current image is #%d \"%s\"\n",
              (unsigned) MagickGetIteratorIndex(wand),
              MagickGetImageFilename(wand) );
  printf("\n");

  // Note that using MagickGetIteratorIndex() is slower than just
  // keeping track of the current image index yourself! But not a great cost.

  printf("Standard 'Reset while Next' loop through images\n");
  // keeping track of it to start with!
  MagickResetIterator(wand);
  while (MagickNextImage(wand) != MagickFalse)
    printf("image #%u \"%s\"\n",
              (unsigned) MagickGetIteratorIndex(wand),
              MagickGetImageFilename(wand) );
  printf("\n");

  printf("At this point, any image 'added' to wand will be appended!\n");
  printf("This special condition can be set by using either\n");
  printf("just         MagickSetLastIterator(w)\n");
  printf("or           MagickSetIteratorIndex(w,-1)\n");
  printf("\n");

  printf("Now that we are at the end, lets loop backward using 'Previous'\n");
  while (MagickPreviousImage(wand) != MagickFalse)
    printf("image #%u \"%s\"\n",
              (unsigned) MagickGetIteratorIndex(wand),
              MagickGetImageFilename(wand) );
  printf("\n");


  printf("Note at this point, any image 'added' to wand will be prepended!\n");
  printf("This special condition can be set by using either\n");
  printf("just         MagickSetFirstIterator(w)\n");
  printf("Or      MagickResetIterator(w); MagickPreviousImage(w);\n");
  printf("The latter method being the cause of the current condition\n");
  printf("\n");


  printf("Directly loop though images backward using 'Last, while Previous'\n");
  MagickSetLastIterator(wand);
  while ( MagickPreviousImage(wand) != MagickFalse )
    printf("image #%u \"%s\"\n",
              (unsigned) MagickGetIteratorIndex(wand),
              MagickGetImageFilename(wand) );
  printf("\n");


  printf("Loop through images using Indexes, in a weird flip-flop way!\n");
  printf("Note that indexing using a negative number, indexes from end \n");
  { ssize_t  i;
    ssize_t  n = (ssize_t) MagickGetNumberImages(wand);

    for ( i=0; i!=n;  i= (i>=0) ? -(i+1):-i ) {
      (void) MagickSetIteratorIndex(wand,i);
         /* Note that a return of MagickFalse by the above is not actually an
          * error (no exception will be generated).  It just means that the
          * index value used (positive or negative) is too large for the
          * size of the current image list  (EG: range error: -n <= i < n )
          * When it does happen, no change is made to the current image
          */
      printf("index %2d -> #%u \"%s\"\n", (int) i,
                (unsigned) MagickGetIteratorIndex(wand),
                MagickGetImageFilename(wand) );
    }
  }
  printf("\n");


  wand=DestroyMagickWand(wand);

  MagickWandTerminus();
}
```

--------------------------------------------------------------------------------

---[FILE: Makefile]---
Location: ImageMagick-main/MagickWand/tests/Makefile

```text

# get includes and libraries from source directory
SRC=$(shell pwd )/../..
CFLAGS=-I$(SRC) -L$(SRC)/MagickWand/.libs -L$(SRC)/MagickCore/.libs

# get includes and libraries from installed ImageMagick-devel Package
#CFLAGS=-I/usr/include/ImageMagick

LDLIBS=-lMagickWand -lMagickCore

files=$(wildcard *.c)
tests=$(files:%.c=%)

all: $(tests)

script-token-test: script-token-test.c ../script-token.[ch]
	$(CC) -o script-token-test script-token-test.c

clean:
	rm -f $(tests)

test_script:
	script-token-test.sh | diff script-token-test-results.txt -
```

--------------------------------------------------------------------------------

---[FILE: README]---
Location: ImageMagick-main/MagickWand/tests/README

```text

These file provide simple examples and testing of aspects of the
MagickWand API.

Specifically
  + MagickAddImage() (also use by MagickReadImage() ) in various situations
    with a single images, or a list of images.  Study of the examples
    details exactly what the API does.

  + GetScriptToken ()  doing low level testing of the tokenization (argument
    separation) the "magick" command applies when reading command options
    from a script, or pipeline. The Tokenization is designed specifically to
    emulate the BASH shell. In this way you would write scripts in exactly the
    same way you would write BASH shell command line arguments.

    Tests include quoting, mixed quoting, backslash escapes, line
    continuation, extremely long tokens, and various error conditions.
```

--------------------------------------------------------------------------------

---[FILE: script-token-test-data.txt]---
Location: ImageMagick-main/MagickWand/tests/script-token-test-data.txt

```text
#
# Comments should be ignored
#
: Shell script launcher comment ignore
@ DOS script launcher comment ignore


-option key  # end of line comment
+reset   imbedded#hash   # <- not a comment, thought this is

This\ is' a 'single" token"

And\\\ \''even '\'\""more \""complex

"Backslash chars \n are returned as is"
'regardless \n of quoting'

'Single quote escapes'
\' "'"

"Double quote escapes"
\" '"' "\""

Back\ slash\ escapes
\\ '\'  "\\"       # NOTE that backslash in single quotes are literal!

'Space Character Escapes'
\  ' '  " "

'Empty Tokens, using quotes'
''   ""

"Unicode characters are handled"
"° ' ²  ³  ` ´"
"µ  ¶  ⨀  ⨁  ⨂"
测试用的汉字

Line__\
__Continuation

"Double_Quoted_Line__\
__Continuation"

'Single_Quoted_Line__\
__Continuation_NOT!'

"double_quoted_newlines__
__are_part_of_token"

'single_quoted_newlines__
__are_part_of_token'

"Last Token before EOF"
```

--------------------------------------------------------------------------------

---[FILE: script-token-test-results.txt]---
Location: ImageMagick-main/MagickWand/tests/script-token-test-results.txt

```text
l=8, c=1, stat=0, len=64, token="-option"
l=8, c=9, stat=0, len=64, token="key"
l=9, c=1, stat=0, len=64, token="+reset"
l=9, c=10, stat=0, len=64, token="imbedded#hash"
l=11, c=1, stat=0, len=64, token="This is a single token"
l=13, c=1, stat=0, len=64, token="And\ 'even '"more "complex"
l=15, c=1, stat=0, len=64, token="Backslash chars \n are returned as is"
l=16, c=1, stat=0, len=64, token="regardless \n of quoting"
l=18, c=1, stat=0, len=64, token="Single quote escapes"
l=19, c=2, stat=0, len=64, token="'"
l=19, c=4, stat=0, len=64, token="'"
l=21, c=1, stat=0, len=64, token="Double quote escapes"
l=22, c=2, stat=0, len=64, token="""
l=22, c=4, stat=0, len=64, token="""
l=22, c=8, stat=0, len=64, token="""
l=24, c=1, stat=0, len=64, token="Back slash escapes"
l=25, c=2, stat=0, len=64, token="\"
l=25, c=4, stat=0, len=64, token="\"
l=25, c=9, stat=0, len=64, token="\"
l=27, c=1, stat=0, len=64, token="Space Character Escapes"
l=28, c=2, stat=0, len=64, token=" "
l=28, c=4, stat=0, len=64, token=" "
l=28, c=9, stat=0, len=64, token=" "
l=30, c=1, stat=0, len=64, token="Empty Tokens, using quotes"
l=31, c=1, stat=0, len=64, token=""
l=31, c=6, stat=0, len=64, token=""
l=33, c=1, stat=0, len=64, token="Unicode characters are handled"
l=34, c=1, stat=0, len=64, token="° ' ²  ³  ` ´"
l=35, c=1, stat=0, len=64, token="µ  ¶  ⨀  ⨁  ⨂"
l=36, c=1, stat=0, len=64, token="测试用的汉字"
l=38, c=1, stat=0, len=64, token="Line____Continuation"
l=41, c=1, stat=0, len=64, token="Double_Quoted_Line____Continuation"
l=44, c=1, stat=0, len=64, token="Single_Quoted_Line__\
__Continuation_NOT!"
l=47, c=1, stat=0, len=64, token="double_quoted_newlines__
__are_part_of_token"
l=50, c=1, stat=0, len=64, token="single_quoted_newlines__
__are_part_of_token"
l=53, c=1, stat=0, len=64, token="Last Token before EOF"
EOF Found

l=1, c=1, stat=0, len=64, token="Next token bad quotes"
Bad Quotes l=1, c=25  token="unfinished quotes ->"

l=1, c=1, stat=0, len=64, token="Binary input follows"
Binary Char at l=2, c=4

l=1, c=1, stat=0, len=64, token="Very BIG Token Tests"
l=2, c=1, stat=0, len=256, token="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa..."
l=3, c=1, stat=0, len=1024, token="bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb..."
l=4, c=1, stat=0, len=4096, token="cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc..."
l=5, c=1, stat=0, len=8192, token="dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd..."
l=6, c=1, stat=0, len=12288, token="eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee..."
l=7, c=1, stat=0, len=16384, token="ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff..."
l=8, c=1, stat=0, len=8392704, token="eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee..."
l=9, c=1, stat=0, len=8392704, token="and all is well!"
EOF Found
```

--------------------------------------------------------------------------------

---[FILE: script-token-test.c]---
Location: ImageMagick-main/MagickWand/tests/script-token-test.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%    SSS    CCC  RRRR   III  PPPP  TTTTT    TTTTT  OOO   K  K  EEEE  N   N    %
%   S      C     R   R   I   P   P   T        T   O   O  K K   E     NN  N    %
%    SSS   C     RRRR    I   PPPP    T        T   O   O  KK    EEE   N N N    %
%       S  C     R R     I   P       T        T   O   O  K K   E     N  NN    %
%   SSSS    CCC  R  RR  III  P       T        T    OOO   K  K  EEEE  N   N    %
%                                                                             %
%                         TTTTT  EEEEE  SSSSS  TTTTT                          %
%                           T    E      SS       T                            %
%                           T    EEE     SSS     T                            %
%                           T    E         SS    T                            %
%                           T    EEEEE  SSSSS    T                            %
%                                                                             %
%       Perform "Magick" on Images via the Command Line Interface             %
%                                                                             %
%                             Dragon Computing                                %
%                             Anthony Thyssen                                 %
%                               January 2012                                  %
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
%  Test the raw tokenization of the  ScriptToken Subroutines
%
%  This actually uses very little of the magic core functions
%  and in fact creates a completely stand-alone program by substituting
%  required MagickCore with direct system equivalents.
%
%  Build
%     cc     script-token-test.c   -o script-token-test
%
%  For testing see  script-token-test.sh
%
*/

/* System Replacement for MagickWand includes */
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <assert.h>
#include <errno.h>

/* Defines to replace MagickWand / MagickCore definitions */
#define MagickPathExtent     4096
#define MagickFalse       0
#define MagickTrue        1
#define MagickBooleanType int

#define AcquireMagickMemory(s)    malloc(s)
#define RelinquishMagickMemory(p) (free(p),NULL)
#define ResizeMagickMemory(p,s)   realloc(p,s)
#define ResetMagickMemory(p,b,s)  memset(p,b,s)
#define StringToLong(s)           strtol(s,(char **) NULL,10)
#define LocaleCompare(p,q)        strcasecmp(p,q)
#define LocaleNCompare(p,q,l)     strncasecmp(p,q,l)
#define WandSignature             0xabacadabUL
#define fopen_utf8(p,q)           fopen(p,q)
#define WandExport

/* Include the actual code for ScriptToken functions */
#define SCRIPT_TOKEN_TESTING  1 /* Prevent MagickWand Includes */
#include "../script-token.h"
#include "../script-token.c"

/* Test program to report what tokens it finds in given input file/stream */

int main(int argc, char *argv[])
{
  ScriptTokenInfo
     *token_info;

  token_info = AcquireScriptTokenInfo( (argc>1) ? argv[1] : "-" );
  if (token_info == (ScriptTokenInfo *) NULL) {
    printf("Script Open Failure : %s\n", strerror(errno));
    return(1);
  }

  while (1) {
    if( GetScriptToken(token_info) == MagickFalse )
      break;

    if( strlen(token_info->token) > INITAL_TOKEN_LENGTH-1 ) {
      token_info->token[INITAL_TOKEN_LENGTH-4] = '.';
      token_info->token[INITAL_TOKEN_LENGTH-3] = '.';
      token_info->token[INITAL_TOKEN_LENGTH-2] = '.';
      token_info->token[INITAL_TOKEN_LENGTH-1] = '\0';
    }
    printf("l=%d, c=%d, stat=%d, len=%d, token=\"%s\"\n",
         token_info->token_line, token_info->token_column,
         token_info->status, token_info->length, token_info->token);
  }

  switch( token_info->status ) {
    case TokenStatusOK:
      break;
    case TokenStatusEOF:
      printf("EOF Found\n");
      break;
    case TokenStatusBadQuotes:
      /* Ensure last token has a sane length for error report */
      if( strlen(token_info->token) > INITAL_TOKEN_LENGTH-1 ) {
        token_info->token[INITAL_TOKEN_LENGTH-4] = '.';
        token_info->token[INITAL_TOKEN_LENGTH-3] = '.';
        token_info->token[INITAL_TOKEN_LENGTH-2] = '.';
        token_info->token[INITAL_TOKEN_LENGTH-1] = '\0';
      }
      printf("Bad Quotes l=%d, c=%d  token=\"%s\"\n",
           token_info->token_line,token_info->token_column, token_info->token);
      break;
    case TokenStatusMemoryFailed: /* token is invalid */
      printf("Out of Memory  l=%d, c=%d\n",
           token_info->token_line,token_info->token_column);
      break;
    case TokenStatusBinary:       /* token is invalid */
      printf("Binary Char at l=%d, c=%d\n",
           token_info->curr_line,token_info->curr_column);
      break;
  }

  /* Clean up */
  token_info = DestroyScriptTokenInfo(token_info);

  return(0);
}
```

--------------------------------------------------------------------------------

---[FILE: script-token-test.sh]---
Location: ImageMagick-main/MagickWand/tests/script-token-test.sh

```bash
#!/bin/sh
#
# Basic testing of ScriptToken parser.
#
#    script-token-test.sh | diff - script-token-test-results.txt
#
./script-token-test script-token-test-data.txt
echo ""

echo -n "\"Next token bad quotes\" \"unfinished quotes ->" |\
   ./script-token-test
echo ""

perl -e 'print "\"Binary input follows\"\n", "abc\006xyz\n"' |\
   ./script-token-test
echo ""

( echo '"Very BIG Token Tests"'
  dd if=/dev/zero bs=80   count=1    2>/dev/null | tr '\0' 'a'; echo ""
  dd if=/dev/zero bs=500  count=1    2>/dev/null | tr '\0' 'b'; echo ""
  dd if=/dev/zero bs=4000 count=1    2>/dev/null | tr '\0' 'c'; echo ""
  dd if=/dev/zero bs=5000 count=1    2>/dev/null | tr '\0' 'd'; echo ""
  dd if=/dev/zero bs=10k  count=1    2>/dev/null | tr '\0' 'e'; echo ""
  dd if=/dev/zero bs=13k  count=1    2>/dev/null | tr '\0' 'f'; echo ""
  dd if=/dev/zero bs=8k   count=1024 2>/dev/null | tr '\0' 'e'; echo ""
  echo '"and all is well!"'
) | ./script-token-test
echo ""
```

--------------------------------------------------------------------------------

---[FILE: build.sh]---
Location: ImageMagick-main/oss-fuzz/build.sh

```bash
#!/bin/bash -eu

MAGICK_COMPILER=$CXX
MAGICK_COMPILER_FLAGS=$CXXFLAGS
MAGICK_INCLUDE="$WORK/include/ImageMagick-7"
MAGICK_SRC="$SRC/imagemagick/oss-fuzz"
MAGICK_LIBS_NO_FUZZ="$WORK/lib/libMagick++-7.Q16HDRI.a $WORK/lib/libMagickWand-7.Q16HDRI.a $WORK/lib/libMagickCore-7.Q16HDRI.a $WORK/lib/libpng.a $WORK/lib/libtiff.a $WORK/lib/libheif.a $WORK/lib/libde265.a $WORK/lib/libopenjp2.a $WORK/lib/libwebp.a $WORK/lib/libwebpmux.a $WORK/lib/libwebpdemux.a $WORK/lib/libsharpyuv.a $WORK/lib/libhwy.a $WORK/lib/libbrotlicommon.a $WORK/lib/libbrotlidec.a $WORK/lib/libbrotlienc.a $WORK/lib/libjxl_threads.a $WORK/lib/libjxl_cms.a $WORK/lib/libjxl.a $WORK/lib/libturbojpeg.a $WORK/lib/libjpeg.a $WORK/lib/libfreetype.a $WORK/lib/libraw.a $WORK/lib/liblzma.a $WORK/lib/liblcms2.a $WORK/lib/libdeflate.a $WORK/lib/libz.a"
MAGICK_LIBS="$LIB_FUZZING_ENGINE $MAGICK_LIBS_NO_FUZZ"
MAGICK_OUTPUT=$OUT
MAGICK_FAST_BUILD=0

. $MAGICK_SRC/build_dependencies.sh
. $MAGICK_SRC/build_imagemagick.sh
. $MAGICK_SRC/build_fuzzers.sh

echo '#!/bin/sh' > $OUT/gs
chmod +x $OUT/gs

mkdir afl_testcases
(cd afl_testcases; tar xvf "$SRC/afl_testcases.tgz")
for format in gif jpg png bmp ico webp tif; do
    mkdir $format
    find afl_testcases -type f -name '*.'$format -exec mv -n {} $format/ \;
    zip -rj $format.zip $format/
    cp $format.zip "$OUT/encoder_${format}_fuzzer_seed_corpus.zip"
done
```

--------------------------------------------------------------------------------

---[FILE: build_dependencies.sh]---
Location: ImageMagick-main/oss-fuzz/build_dependencies.sh

```bash
#!/bin/bash -eu

# build zlib
pushd "$SRC/zlib"
cmake . -DCMAKE_INSTALL_PREFIX=$WORK -DLIBDEFLATE_BUILD_SHARED_LIB=off
make -j$(nproc) CFLAGS="$CFLAGS -fPIC"
make install
popd

# build deflate
pushd "$SRC/libdeflate"
cmake . -DCMAKE_INSTALL_PREFIX=$WORK -DLIBDEFLATE_BUILD_SHARED_LIB=off -DLIBDEFLATE_BUILD_GZIP=off
make -j$(nproc)
make install
popd

# Build xz
pushd "$SRC/xz"
./autogen.sh --no-po4a --no-doxygen
./configure --disable-xz --disable-xzdec --disable-lzmadec --disable-lzmainfo --disable-lzma-links --disable-ifunc --disable-scripts --disable-doc --disable-shared --with-pic=yes --prefix="$WORK"
make -j$(nproc)
make install
popd

# Build png
pushd "$SRC/libpng"
cmake . -DCMAKE_INSTALL_PREFIX=$WORK -DPNG_SHARED=off
make -j$(nproc)
make install
popd

# Build libjpeg-turbo
pushd "$SRC/libjpeg-turbo"
CFLAGS="$CFLAGS -fPIC" cmake . -DCMAKE_INSTALL_PREFIX=$WORK -DENABLE_STATIC=on -DENABLE_SHARED=off
make -j$(nproc)
make install
popd

# Build libtiff
pushd "$SRC/libtiff"
autoreconf -fiv
./configure --disable-shared --prefix="$WORK" CFLAGS="$CFLAGS -I$WORK/include" LIBS="-L$WORK/lib"
make -j$(nproc)
make install
popd

# Build liblcms2
pushd "$SRC/Little-CMS"
autoreconf -fiv
./configure --disable-shared --prefix="$WORK"
make -j$(nproc)
make install
popd

# build libraw
pushd "$SRC/libraw"
autoreconf -fiv
./configure --prefix="$WORK" --disable-shared --with-pic=yes --disable-examples PKG_CONFIG_PATH="$WORK/lib/pkgconfig" CXXFLAGS="$CXXFLAGS -DLIBRAW_USE_CALLOC_INSTEAD_OF_MALLOC=on"
make -j$(nproc)
make install
popd

# Build freetype2
pushd "$SRC/freetype"
./autogen.sh
./configure --prefix="$WORK" --disable-shared PKG_CONFIG_PATH="$WORK/lib/pkgconfig"
make -j$(nproc)
make install
popd

# Build libde265
pushd "$SRC/libde265"
cmake . -DCMAKE_INSTALL_PREFIX=$WORK -DBUILD_SHARED_LIBS=off -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)
make install
popd

# Build libheif
pushd "$SRC/libheif"
cmake . -DCMAKE_INSTALL_PREFIX=$WORK -DBUILD_SHARED_LIBS=off -DBUILD_TESTING=off -DWITH_EXAMPLES=off -DENABLE_PLUGIN_LOADING=off -DWITH_JPEG_DECODER=off -DWITH_JPEG_ENCODER=off -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)
make install
popd

# Build webp
pushd "$SRC/libwebp"
./autogen.sh
./configure --disable-shared  --disable-png --disable-jpeg --disable-tiff --prefix="$WORK"
make -j$(nproc)
make install
popd

# Build openjpg
pushd "$SRC/openjpeg"
cmake . -DCMAKE_INSTALL_PREFIX=$WORK -DBUILD_SHARED_LIBS=off -DBUILD_CODEC=off -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)
make install
popd

# Build libjxl
pushd "$SRC/libjxl"
cmake . -DCMAKE_INSTALL_PREFIX=$WORK -DBUILD_SHARED_LIBS=off -DBUILD_TESTING=false  -DJPEGXL_ENABLE_TOOLS=false -DJPEGXL_ENABLE_SKCMS=false -DJPEGXL_ENABLE_DOXYGEN=false -DJPEGXL_ENABLE_MANPAGES=false -DJPEGXL_ENABLE_SJPEG=false -DJPEGXL_ENABLE_EXAMPLES=false -DJPEGXL_ENABLE_BENCHMARK=false -DJPEGXL_ENABLE_FUZZERS=false -DJPEGXL_BUNDLE_LIBPNG=false -DJPEGXL_ENABLE_JPEGLI_LIBJPEG=false -DCMAKE_C_FLAGS="$CFLAGS" -DCMAKE_CXX_FLAGS="$CXXFLAGS"
make -j$(nproc)
make install
popd
```

--------------------------------------------------------------------------------

---[FILE: build_fuzzers.sh]---
Location: ImageMagick-main/oss-fuzz/build_fuzzers.sh

```bash
#!/bin/bash -eu

MAGICK_COMPILER_FLAGS="$MAGICK_COMPILER_FLAGS -fuse-ld=lld -DMAGICKCORE_HDRI_ENABLE=1 -DMAGICKCORE_QUANTUM_DEPTH=16"

$MAGICK_COMPILER $MAGICK_COMPILER_FLAGS -std=c++11 -I$MAGICK_INCLUDE "$MAGICK_SRC/encoder_list.cc" \
    -o "$MAGICK_SRC/encoder_list" $MAGICK_LIBS_NO_FUZZ

for f in $MAGICK_SRC/*_fuzzer.cc; do
    fuzzer=$(basename "$f" _fuzzer.cc)
    # encoder_fuzzer is special
    if [ "$fuzzer" == "encoder" ]; then
        continue
    fi
    $MAGICK_COMPILER $MAGICK_COMPILER_FLAGS -std=c++11 -I$MAGICK_INCLUDE \
        "$f" -o "$MAGICK_OUTPUT/${fuzzer}_fuzzer" $MAGICK_LIBS
    echo -e "[libfuzzer]\nclose_fd_mask=3" > "$MAGICK_OUTPUT/${fuzzer}_fuzzer.options"
done

for item in $("$MAGICK_SRC/encoder_list"); do
    info=${item:1}
    encoder=${info%:*}
    initializer=${info##*:}
    encoder_flags="-DFUZZ_IMAGEMAGICK_ENCODER=$encoder"
    if [ "$initializer" != "" ]; then
      encoder_flags="$encoder_flags -DFUZZ_IMAGEMAGICK_ENCODER_INITIALIZER=$initializer"
    fi

    if [ "${item:0:1}" == "+" ]; then
        encoder_flags="$encoder_flags -DFUZZ_IMAGEMAGICK_ENCODER_WRITE=1"
    fi

    $MAGICK_COMPILER $MAGICK_COMPILER_FLAGS -std=c++11 -I$MAGICK_INCLUDE \
        "$MAGICK_SRC/encoder_fuzzer.cc" -o "$MAGICK_OUTPUT/encoder_${encoder,,}_fuzzer" \
         $encoder_flags $MAGICK_LIBS

    echo -e "[libfuzzer]\nclose_fd_mask=3" > "$MAGICK_OUTPUT/encoder_${encoder,,}_fuzzer.options"

    if [ -f "$MAGICK_SRC/dictionaries/${encoder,,}.dict" ]; then
        cp "$MAGICK_SRC/dictionaries/${encoder,,}.dict" "$MAGICK_OUTPUT/encoder_${encoder,,}_fuzzer.dict"
    fi

    if [ $MAGICK_FAST_BUILD -eq 1 ]; then
        break
    fi
done
```

--------------------------------------------------------------------------------

---[FILE: build_imagemagick.sh]---
Location: ImageMagick-main/oss-fuzz/build_imagemagick.sh

```bash
#!/bin/bash -eu

autoreconf -fiv
./configure --prefix="$WORK" --disable-shared --disable-docs --with-jxl CFLAGS="$CFLAGS -I$WORK/include" LIBS="-L$WORK/lib -lbrotlidec -lbrotlienc -lbrotlicommon -lde265" PKG_CONFIG_PATH="$WORK/lib/pkgconfig"
make "-j$(nproc)"
make install
```

--------------------------------------------------------------------------------

---[FILE: encoder_format.h]---
Location: ImageMagick-main/oss-fuzz/encoder_format.h

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

#include <string.h>
#include <iostream>
using namespace std;

class EncoderFormat
{
public:
  const string get()
  {
    return(string(_format.begin(),_format.end()));
  }

  void set(const wstring fileName)
  {
    wstring
      format;

    size_t
      index;

    if (fileName.find(L"clusterfuzz-testcase-") == -1)
      return;

    format=fileName;
    index=format.find(L"_", 0);
    if (index == wstring::npos)
      return;

    format=format.substr(index+1);
    index=format.find(L"_",0);
    if (index != wstring::npos)
      _format=format.substr(0, index);
  }
private:
  wstring _format=L".notset";
};
```

--------------------------------------------------------------------------------

````
