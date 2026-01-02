---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 188
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 188 of 851)

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

---[FILE: ImageRef.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/ImageRef.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Definition of an Image reference
//
// This is a private implementation class which should never be
// referenced by any user code.
//

#if !defined(Magick_ImageRef_header)
#define Magick_ImageRef_header

#include "Magick++/Include.h"
#include "Magick++/Thread.h"
#include <string>

namespace Magick
{
  class Options;

  //
  // Reference counted access to Image *
  //
  class MagickPPExport ImageRef
  {
  public:

    // Construct with null image and default options
    ImageRef(void);

    // Construct with an image pointer and default options
    ImageRef(MagickCore::Image *image_);

    // Destroy image and options
    ~ImageRef(void);

    // Decreases reference count and return the new count
    size_t decrease();

    // Retrieve image from reference
    MagickCore::Image *&image(void);

    // Increases reference count
    void increase();

    // Returns true if the reference count is more than one
    bool isShared();

    // Retrieve Options from reference
    void options(Options *options_);
    Options *options(void);

    // Tries to replaces the images with the specified image, returns
    // a new instance when the current image is shared.
    static ImageRef *replaceImage(ImageRef *imgRef,
      MagickCore::Image *replacement_);

    // Image signature. Set force_ to true in order to re-calculate
    // the signature regardless of whether the image data has been
    // modified.
    std::string signature(const bool force_=false);

  private:

    // Construct with an image pointer and options
    ImageRef(MagickCore::Image *image_,const Options *options_);

    // Copy constructor and assignment are not supported
    ImageRef(const ImageRef&);

    ImageRef& operator=(const ImageRef&);

    MagickCore::Image *_image;    // ImageMagick Image
    MutexLock         _mutexLock; // Mutex lock
    Options           *_options;  // User-specified options
    ::ssize_t         _refCount;  // Reference count
  };

} // end of namespace Magick

#endif // Magick_ImageRef_header
```

--------------------------------------------------------------------------------

````
