---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 184
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 184 of 851)

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

---[FILE: Thread.cpp]---
Location: ImageMagick-main/Magick++/lib/Thread.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Implementation of thread support
//

#define MAGICKCORE_IMPLEMENTATION  1
#define MAGICK_PLUSPLUS_IMPLEMENTATION 1

#include "Magick++/Thread.h"
#include "Magick++/Exception.h"

#include <string.h>

// Default constructor
Magick::MutexLock::MutexLock(void)
#if defined(MAGICKCORE_HAVE_PTHREAD)
  // POSIX threads
  : _mutex()
{
  ::pthread_mutexattr_t
    attr;

  int
    sysError;

  if ((sysError=::pthread_mutexattr_init(&attr)) == 0)
    if ((sysError=::pthread_mutex_init(&_mutex,&attr)) == 0)
      {
        ::pthread_mutexattr_destroy(&attr);
        return;
      }
  throwExceptionExplicit(MagickCore::OptionError,"mutex initialization failed",
    strerror(sysError));
}
#else
#if defined(_VISUALC_) && defined(_MT)
// Win32 threads
{
  SECURITY_ATTRIBUTES
    security;

  /* Allow the semaphore to be inherited */
  security.nLength=sizeof(security);
  security.lpSecurityDescriptor=(LPVOID) NULL;
  security.bInheritHandle=TRUE;

  /* Create the semaphore, with initial value signaled */
  _mutex=::CreateSemaphore(&security,1,1,(LPCSTR) NULL);
  if (_mutex != (HANDLE) NULL)
    return;
  throwExceptionExplicit(MagickCore::OptionError,
    "mutex initialization failed");
}
#else
// Threads not supported
{
}
#endif
#endif

// Destructor
Magick::MutexLock::~MutexLock(void)
{
#if defined(MAGICKCORE_HAVE_PTHREAD)
  (void) ::pthread_mutex_destroy(&_mutex);
#endif
#if defined(_MT) && defined(_VISUALC_)
  (void) ::CloseHandle(_mutex);
#endif
}

// Lock mutex
void Magick::MutexLock::lock(void)
{
#if defined(MAGICKCORE_HAVE_PTHREAD)
  int
    sysError;

  if ((sysError=::pthread_mutex_lock(&_mutex)) == 0)
    return;
  throwExceptionExplicit(MagickCore::OptionError,"mutex lock failed",
    strerror(sysError));
#endif
#if defined(_MT) && defined(_VISUALC_)
  if (WaitForSingleObject(_mutex,INFINITE) != WAIT_FAILED)
    return;
  throwExceptionExplicit(MagickCore::OptionError,"mutex lock failed");
#endif
}

// Unlock mutex
void Magick::MutexLock::unlock(void)
{
#if defined(MAGICKCORE_HAVE_PTHREAD)
  int
    sysError;

  if ((sysError=::pthread_mutex_unlock(&_mutex)) == 0)
    return;
  throwExceptionExplicit(MagickCore::OptionError,"mutex unlock failed",
    strerror(sysError));
#endif
#if defined(_MT) && defined(_VISUALC_)
  if (ReleaseSemaphore(_mutex,1,(LPLONG) NULL) == TRUE)
    return;
  throwExceptionExplicit(MagickCore::OptionError,"mutex unlock failed");
#endif
}
```

--------------------------------------------------------------------------------

---[FILE: TypeMetric.cpp]---
Location: ImageMagick-main/Magick++/lib/TypeMetric.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 2001
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// TypeMetric implementation
//

#define MAGICKCORE_IMPLEMENTATION  1
#define MAGICK_PLUSPLUS_IMPLEMENTATION 1

#include "Magick++/TypeMetric.h"
#include "Magick++/Drawable.h"
#include <string.h>

Magick::TypeMetric::TypeMetric(void)
{
  memset(&_typeMetric,0,sizeof(_typeMetric));
}

Magick::TypeMetric::~TypeMetric(void)
{
}

double Magick::TypeMetric::ascent(void) const
{
  return(_typeMetric.ascent);
}

Magick::Geometry Magick::TypeMetric::bounds(void) const
{
  return(Geometry((size_t) (_typeMetric.bounds.x2-_typeMetric.bounds.x1),
    (size_t) (_typeMetric.bounds.y2-_typeMetric.bounds.y1),(ssize_t)
    _typeMetric.bounds.x1,(ssize_t) _typeMetric.bounds.y1));
}

double Magick::TypeMetric::descent(void) const
{
  return(_typeMetric.descent);
}

double Magick::TypeMetric::maxHorizontalAdvance(void) const
{
  return(_typeMetric.max_advance);
}

Magick::Coordinate Magick::TypeMetric::origin(void) const
{
  return(Coordinate(_typeMetric.origin.x,_typeMetric.origin.y));
}

Magick::Coordinate Magick::TypeMetric::pixelsPerEm(void) const
{
  return(Coordinate(_typeMetric.pixels_per_em.x,_typeMetric.pixels_per_em.y));
}

double Magick::TypeMetric::textHeight(void) const
{
  return(_typeMetric.height);
}

double Magick::TypeMetric::textWidth(void) const
{
  return(_typeMetric.width);
}

double Magick::TypeMetric::underlinePosition(void) const
{
  return(_typeMetric.underline_position);
}

double Magick::TypeMetric::underlineThickness(void) const
{
  return(_typeMetric.underline_thickness);
}
```

--------------------------------------------------------------------------------

---[FILE: Blob.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/Blob.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002
//
// Copyright @ 2015 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Reference counted container class for Binary Large Objects (BLOBs)
//

#if !defined(Magick_BlobRef_header)
#define Magick_BlobRef_header

#include "Magick++/Include.h"
#include <string>

namespace Magick
{
  // Forward decl
  class BlobRef;

  class MagickPPExport Blob
  {
  public:

    enum Allocator
    {
      MallocAllocator,
      NewAllocator
    };

    // Default constructor
    Blob(void);

    // Construct object with data, making a copy of the supplied data.
    Blob(const void* data_,const size_t length_);

    // Copy constructor (reference counted)
    Blob(const Blob& blob_);

    // Destructor (reference counted)
    virtual ~Blob();

    // Assignment operator (reference counted)
    Blob& operator=(const Blob& blob_);

    // Update object contents from Base64-encoded string representation.
    void base64(const std::string base64_);
    // Return Base64-encoded string representation.
    std::string base64(void) const;

    // Obtain pointer to data. The user should never try to modify or
    // free this data since the Blob class manages its own data. The
    // user must be finished with the data before allowing the Blob to
    // be destroyed since the pointer is invalid once the Blob is
    // destroyed.
    const void* data(void) const;

    // Obtain data length.
    size_t length(void) const;

    // Update object contents, making a copy of the supplied data.
    // Any existing data in the object is deallocated.
    void update(const void* data_,const size_t length_);

    // Update object contents, using supplied pointer directly (no
    // copy). Any existing data in the object is deallocated.  The user
    // must ensure that the pointer supplied is not deleted or
    // otherwise modified after it has been supplied to this method.
    // Specify allocator_ as "MallocAllocator" if memory is allocated
    // via the C language malloc() function, or "NewAllocator" if
    // memory is allocated via C++ 'new'.
    void updateNoCopy(void* data_,const size_t length_,
      const Allocator allocator_=NewAllocator);

  private:
    BlobRef *_blobRef;
  };

} // namespace Magick

#endif // Magick_BlobRef_header
```

--------------------------------------------------------------------------------

---[FILE: BlobRef.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/BlobRef.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Blob reference class
//
// This is an internal implementation class that should not be
// accessed by users.
//

#if !defined(Magick_Blob_header)
#define Magick_Blob_header

#include "Magick++/Include.h"
#include "Magick++/Thread.h"
#include "Magick++/Blob.h"

namespace Magick
{
  class BlobRef
  {
  public:

    // Construct with data, making private copy of data
    BlobRef(const void* data_,const size_t length_);

    // Destructor (actually destroys data)
    ~BlobRef(void);

    // Decreases reference count and return the new count
    size_t decrease();

    // Increases reference count
    void increase();

    Blob::Allocator allocator; // Memory allocation system in use
    size_t          length;    // Blob length
    void*           data;      // Blob data

  private:
    // Copy constructor and assignment are not supported
    BlobRef(const BlobRef&);
    BlobRef& operator=(const BlobRef&);

    MutexLock _mutexLock; // Mutex lock
    size_t    _refCount;  // Reference count
  };

} // namespace Magick

#endif // Magick_Blob_header
```

--------------------------------------------------------------------------------

---[FILE: CoderInfo.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/CoderInfo.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 2001, 2002
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// CoderInfo Definition
//
// Container for image format support information.
//

#if !defined (Magick_CoderInfo_header)
#define Magick_CoderInfo_header  1

#include "Magick++/Include.h"
#include <string>

namespace Magick
{
  class MagickPPExport CoderInfo
  {
  public:

    enum MatchType {
      AnyMatch,  // match any coder
      TrueMatch, // match coder if true
      FalseMatch // match coder if false
    };

    // Default constructor
    CoderInfo(void);

    // Copy constructor
    CoderInfo(const CoderInfo &coder_);

    // Construct with coder name
    CoderInfo(const std::string &name_);

    // Destructor
    ~CoderInfo(void);

    // Assignment operator
    CoderInfo& operator=(const CoderInfo &coder_);

    // Format can read multi-threaded
    bool canReadMultithreaded(void) const;

    // Format can write multi-threaded
    bool canWriteMultithreaded(void) const;

    // Format description
    std::string description(void) const;

    // Format supports multiple frames
    bool isMultiFrame(void) const;

    // Format is readable
    bool isReadable(void) const;

    // Format is writeable
    bool isWritable(void) const;

    // Format mime type
    std::string mimeType(void) const;

    // Name of the module
    std::string module(void) const;

    // Format name
    std::string name(void) const;

    // Unregisters this coder
    bool unregister(void) const;

  private:
    bool        _decoderThreadSupport;
    std::string _description;
    bool        _encoderThreadSupport;
    bool        _isMultiFrame;
    bool        _isReadable;
    bool        _isWritable;
    std::string _mimeType;
    std::string _module;
    std::string _name;
  };

} // namespace Magick

#endif // Magick_CoderInfo_header
```

--------------------------------------------------------------------------------

---[FILE: Color.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/Color.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002, 2003, 2008
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Color Implementation
//
#if !defined (Magick_Color_header)
#define Magick_Color_header

#include "Magick++/Include.h"
#include <string>

namespace Magick
{
  class MagickPPExport Color;

  // Compare two Color objects regardless of LHS/RHS
  MagickPPExport int operator ==
    (const Magick::Color& left_,const Magick::Color& right_);
  MagickPPExport int operator !=
    (const Magick::Color& left_,const Magick::Color& right_);
  MagickPPExport int operator >
    (const Magick::Color& left_,const Magick::Color& right_);
  MagickPPExport int operator <
    (const Magick::Color& left_,const Magick::Color& right_);
  MagickPPExport int operator >=
    (const Magick::Color& left_,const Magick::Color& right_);
  MagickPPExport int operator <=
    (const Magick::Color& left_,const Magick::Color& right_);

  // Base color class stores RGBA components scaled to fit Quantum
  // All double arguments have a valid range of 0.0 - 1.0.
  class MagickPPExport Color
  {
  public:

    // PixelType specifies the interpretation of PixelInfo members
    // CMYKPixel:
    //   Cyan     = red
    //   Magenta  = green
    //   Yellow   = blue
    //   Black(K) = black
    // CMYKPixel:
    //   Cyan     = red
    //   Magenta  = green
    //   Yellow   = blue
    //   Black(K) = black
    //   Alpha    = alpha
    // RGBPixel:
    //   Red      = red;
    //   Green    = green;
    //   Blue     = blue;
    // RGBAPixel:
    //   Red      = red;
    //   Green    = green;
    //   Blue     = blue;
    //   Alpha    = alpha;
    enum PixelType
    {
      CMYKPixel,
      CMYKAPixel,
      RGBPixel,
      RGBAPixel
    };

    // Default constructor
    Color(void);

    // Construct Color using the specified RGB values
    Color(const Magick::Quantum red_,const Magick::Quantum green_,
      const Magick::Quantum blue_);

    // Construct Color using the specified RGBA values
    Color(const Magick::Quantum red_,const Magick::Quantum green_,
      const Magick::Quantum blue_,const Magick::Quantum alpha_);

    // Construct Color using the specified CMYKA values
    Color(const Magick::Quantum cyan_,const Magick::Quantum magenta_,
      const Magick::Quantum yellow_,const Magick::Quantum black_,
      const Magick::Quantum alpha_);

    // Construct Color using the specified color string
    Color(const char *color_);

    // Copy constructor
    Color(const Color &color_);

    // Construct color via ImageMagick PixelInfo
    Color(const PixelInfo &color_);

    // Constructor Color using the specified color string
    Color(const std::string &color_);

    // Destructor
    virtual ~Color(void);

    // Assignment operator
    Color& operator=(const Color &color_);

    // Set color via X11 color specification string
    const Color& operator=(const char *color);

    // Set color via ImageMagick PixelInfo
    const Color& operator=(const PixelInfo &color_);

    // Set color via color specification string
    const Color& operator=(const std::string &color);

    // Return ImageMagick PixelInfo
    operator PixelInfo() const;

    // Return color specification string
    operator std::string() const;

    // Returns true if the distance between the other color is less than the
    // specified distance in a linear three(or four) % dimensional color space.
    bool isFuzzyEquivalent(const Color &color_,const double fuzz_) const;

    // Does object contain valid color?
    void isValid(const bool valid_);
    bool isValid(void) const;

    // Returns pixel type of the color
    Magick::Color::PixelType pixelType(void) const;

    // Alpha level (range OpaqueAlpha=0 to TransparentAlpha=QuantumRange)
    void quantumAlpha(const Quantum alpha_);
    Quantum quantumAlpha(void) const;

    // Black color (range 0 to QuantumRange)
    void quantumBlack(const Quantum black_);
    Quantum quantumBlack(void) const;

    // Blue/Yellow color (range 0 to QuantumRange)
    void quantumBlue(const Quantum blue_);
    Quantum quantumBlue(void) const;

    // Green/Magenta color (range 0 to QuantumRange)
    void quantumGreen(const Quantum green_);
    Quantum quantumGreen(void) const;

    // Red/Cyan color (range 0 to QuantumRange)
    void quantumRed(const Quantum red_);
    Quantum quantumRed(void) const;

  protected:

    // Constructor to construct with PixelInfo*
    // Used to point Color at a pixel in an image
    Color(PixelInfo *rep_,PixelType pixelType_);

    // Constructor to construct with PixelType
    Color(PixelType pixelType_);

    // Set pixel
    // Used to point Color at a pixel in an image
    void pixel(PixelInfo *rep_,PixelType pixelType_);

    // Scale a value expressed as a double (0-1) to Quantum range (0-QuantumRange)
    static Quantum scaleDoubleToQuantum(const double double_);

    // Scale a value expressed as a Quantum (0-QuantumRange) to double range (0-1)
    static double scaleQuantumToDouble(const Quantum quantum_);

    // PixelInfo represents a color pixel:
    //  red     = red   (range 0 to QuantumRange)
    //  green   = green (range 0 to QuantumRange)
    //  blue    = blue  (range 0 to QuantumRange)
    //  alpha   = alpha (range OpaqueAlpha=0 to TransparentAlpha=QuantumRange)
    //  index   = PseudoColor colormap index
    PixelInfo *_pixel;

  private:

    bool _isValid; // Set true if pixel is "valid"
    bool _pixelOwn; // Set true if we allocated pixel
    PixelType _pixelType; // Color type supported by _pixel

    // Common initializer for PixelInfo representation
    void initPixel();

    void setAlpha(const Magick::Quantum alpha_);

    // Sets the pixel type using the specified PixelInfo.
    void setPixelType(const PixelInfo &color_);
  };

  class MagickPPExport ColorCMYK: public Color
  {
  public:

    // Default constructor
    ColorCMYK(void);

    // Copy constructor
    ColorCMYK(const Color &color_);

    // Construct ColorCMYK using the specified CMYK values
    ColorCMYK(const double cyan_,const double magenta_,const double yellow_,
      const double black_);

    // Construct ColorCMYK using the specified CMYKA values
    ColorCMYK(const double cyan_,const double magenta_,const double yellow_,
      const double black_,const double alpha_);

    // Destructor
    ~ColorCMYK(void);

    // Assignment operator from base class
    ColorCMYK& operator=(const Color& color_);

    // Alpha level (range 0 to 1.0)
    void alpha(const double alpha_);
    double alpha(void) const;

    // Black/Key color (range 0 to 1.0)
    void black(const double black_);
    double black(void) const;

    // Black/Key color (range 0.0 to 1.0)
    void cyan(const double cyan_);
    double cyan(void) const;

    // Magenta color (range 0 to 1.0)
    void magenta(const double magenta_);
    double magenta(void) const;

    // Yellow color (range 0 to 1.0)
    void yellow(const double yellow_);
    double yellow(void) const;

  protected:

    // Constructor to construct with PixelInfo*
    ColorCMYK(PixelInfo *rep_,PixelType pixelType_);
  };

  //
  // Grayscale RGB color
  //
  // Grayscale is simply RGB with equal parts of red, green, and blue
  // All double arguments have a valid range of 0.0 - 1.0.
  class MagickPPExport ColorGray: public Color
  {
  public:

    // Default constructor
    ColorGray(void);

    // Copy constructor
    ColorGray(const Color &color_);

    // Construct ColorGray using the specified shade
    ColorGray(const double shade_);

    // Destructor
    ~ColorGray();

    // Shade
    void shade(const double shade_);
    double shade(void) const;

    // Assignment operator from base class
    ColorGray& operator=(const Color& color_);

  protected:

    // Constructor to construct with PixelInfo*
    ColorGray(PixelInfo *rep_,PixelType pixelType_);
  };

  //
  // HSL Colorspace colors
  //
  // All double arguments have a valid range of 0.0 - 1.0.
  class MagickPPExport ColorHSL: public Color
  {
  public:

    // Default constructor
    ColorHSL(void);

    // Copy constructor
    ColorHSL(const Color &color_);

    // Construct ColorHSL using the specified HSL values
    ColorHSL(const double hue_,const double saturation_,
      const double lightness_);

    // Destructor
    ~ColorHSL();

    // Assignment operator from base class
    ColorHSL& operator=(const Color& color_);

    // Hue color
    void hue(const double hue_);
    double hue(void) const;

    // Lightness color
    void lightness(const double lightness_);
    double lightness(void) const;

    // Saturation color
    void saturation(const double saturation_);
    double saturation(void) const;

  protected:

    // Constructor to construct with PixelInfo*
    ColorHSL(PixelInfo *rep_,PixelType pixelType_);
  };

  //
  // Monochrome color
  //
  // Color arguments are constrained to 'false' (black pixel) and 'true'
  // (white pixel)
  class MagickPPExport ColorMono: public Color
  {
  public:

    // Default constructor
    ColorMono(void);

    // Construct ColorMono (false=black, true=white)
    ColorMono(const bool mono_);

    // Copy constructor
    ColorMono(const Color &color_);

    // Destructor
    ~ColorMono();

    // Assignment operator from base class
    ColorMono& operator=(const Color& color_);

    // Mono color
    void mono(const bool mono_);
    bool mono(void) const;

  protected:

    // Constructor to construct with PixelInfo*
    ColorMono(PixelInfo* rep_,PixelType pixelType_);
  };

  class MagickPPExport ColorRGB: public Color
  {
  public:

    // Default constructor
    ColorRGB(void);

    // Copy constructor
    ColorRGB(const Color &color_);

    // Construct ColorRGB using the specified RGB values
    ColorRGB(const double red_,const double green_,const double blue_);

    // Construct ColorRGB using the specified RGBA values
    ColorRGB(const double red_,const double green_,const double blue_,
      const double alpha_);

    // Destructor
    ~ColorRGB(void);

    // Assignment operator from base class
    ColorRGB& operator=(const Color& color_);

    // Alpha level (range 0 to 1.0)
    void alpha(const double alpha_);
    double alpha(void) const;

    // Blue color (range 0.0 to 1.0)
    void blue(const double blue_);
    double blue(void) const;

    // Green color (range 0 to 1.0)
    void green(const double green_);
    double green(void) const;

    // Red color (range 0 to 1.0)
    void red(const double red_);
    double red(void) const;

  protected:

    // Constructor to construct with PixelInfo*
    ColorRGB(PixelInfo *rep_,PixelType pixelType_);
  };

  //
  // YUV Colorspace color
  //
  // Argument ranges:
  //        Y:  0.0 through 1.0
  //        U: -0.5 through 0.5
  //        V: -0.5 through 0.5
  class MagickPPExport ColorYUV: public Color
  {
  public:

    // Default constructor
    ColorYUV(void);

    // Copy constructor
    ColorYUV(const Color &color_);

    // Construct ColorYUV using the specified YUV values
    ColorYUV(const double y_,const double u_,const double v_);

    // Destructor
    ~ColorYUV(void);

    // Assignment operator from base class
    ColorYUV& operator=(const Color& color_);

    // Color U (0.0 through 1.0)
    void u(const double u_);
    double u(void) const;

    // Color V (-0.5 through 0.5)
    void v(const double v_);
    double v(void) const;

    // Color Y (-0.5 through 0.5)
    void y(const double y_);
    double y(void) const;

  protected:

    // Constructor to construct with PixelInfo*
    ColorYUV(PixelInfo *rep_,PixelType pixelType_);

  private:

    void convert(const double y_,const double u_,const double v_);

  };
} // namespace Magick

#endif // Magick_Color_header
```

--------------------------------------------------------------------------------

````
