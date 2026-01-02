---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 186
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 186 of 851)

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

---[FILE: Exception.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/Exception.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002, 2003
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Definition of Magick::Exception and derived classes
// Magick::Warning* and Magick::Error*.  Derived from C++ STD
// 'exception' class for convenience.
//
// These classes form part of the Magick++ user interface.
//

#if !defined(Magick_Exception_header)
#define Magick_Exception_header

#include "Magick++/Include.h"
#include <string>
#include <exception>

namespace Magick
{
  class MagickPPExport Exception: public std::exception
  {
  public:

    // Construct with message string
    Exception(const std::string& what_);

    // Construct with message string and nested exception
    Exception(const std::string& what_, Exception* nested_);

    // Copy constructor
    Exception(const Exception& original_);

    // Destructor
    virtual ~Exception() throw();

    // Assignment operator
    Exception& operator=(const Exception& original_);

    // Get string identifying exception
    virtual const char* what() const throw();

    // Get nested exception
    const Exception* nested() const throw();

    //////////////////////////////////////////////////////////////////////
    //
    // No user-serviceable parts beyond this point
    //
    //////////////////////////////////////////////////////////////////////

    void nested(Exception* nested_) throw();

  private:
    std::string _what;
    Exception* _nested;
  };

  //
  // Error exceptions
  //

  class MagickPPExport Error: public Exception
  {
  public:
    explicit Error(const std::string& what_);
    explicit Error(const std::string& what_,Exception *nested_);
    ~Error() throw();
  };

  class MagickPPExport ErrorBlob: public Error
  {
  public:
    explicit ErrorBlob(const std::string& what_);
    explicit ErrorBlob(const std::string& what_,Exception *nested_);
    ~ErrorBlob() throw();
  };

  class MagickPPExport ErrorCache: public Error
  {
  public:
    explicit ErrorCache(const std::string& what_);
    explicit ErrorCache(const std::string& what_,Exception *nested_);
    ~ErrorCache() throw();
  };

  class MagickPPExport ErrorCoder: public Error
  {
  public:
    explicit ErrorCoder(const std::string& what_);
    explicit ErrorCoder(const std::string& what_,Exception *nested_);
    ~ErrorCoder() throw();
  };

  class MagickPPExport ErrorConfigure: public Error
  {
  public:
    explicit ErrorConfigure(const std::string& what_);
    explicit ErrorConfigure(const std::string& what_,Exception *nested_);
    ~ErrorConfigure() throw();
  };

  class MagickPPExport ErrorCorruptImage: public Error
  {
  public:
    explicit ErrorCorruptImage(const std::string& what_);
    explicit ErrorCorruptImage(const std::string& what_,Exception *nested_);
    ~ErrorCorruptImage() throw();
  };

  class MagickPPExport ErrorDelegate: public Error
  {
  public:
    explicit ErrorDelegate(const std::string& what_);
    explicit ErrorDelegate(const std::string& what_,Exception *nested_);
    ~ErrorDelegate() throw();
  };

  class MagickPPExport ErrorDraw: public Error
  {
  public:
    explicit ErrorDraw(const std::string& what_);
    explicit ErrorDraw(const std::string& what_,Exception *nested_);
    ~ErrorDraw() throw();
  };

  class MagickPPExport ErrorFileOpen: public Error
  {
  public:
    explicit ErrorFileOpen(const std::string& what_);
    explicit ErrorFileOpen(const std::string& what_,Exception *nested_);
    ~ErrorFileOpen() throw();
  };

  class MagickPPExport ErrorImage: public Error
  {
  public:
    explicit ErrorImage(const std::string& what_);
    explicit ErrorImage(const std::string& what_,Exception *nested_);
    ~ErrorImage() throw();
  };

  class MagickPPExport ErrorMissingDelegate: public Error
  {
  public:
    explicit ErrorMissingDelegate(const std::string& what_);
    explicit ErrorMissingDelegate(const std::string& what_,Exception *nested_);
    ~ErrorMissingDelegate() throw();
  };

  class MagickPPExport ErrorModule: public Error
  {
  public:
    explicit ErrorModule(const std::string& what_);
    explicit ErrorModule(const std::string& what_,Exception *nested_);
    ~ErrorModule() throw();
  };

  class MagickPPExport ErrorMonitor: public Error
  {
  public:
    explicit ErrorMonitor(const std::string& what_);
    explicit ErrorMonitor(const std::string& what_,Exception *nested_);
    ~ErrorMonitor() throw();
  };

  class MagickPPExport ErrorOption: public Error
  {
  public:
    explicit ErrorOption(const std::string& what_);
    explicit ErrorOption(const std::string& what_,Exception *nested_);
    ~ErrorOption() throw();
  };

  class MagickPPExport ErrorPolicy: public Error
  {
  public:
    explicit ErrorPolicy(const std::string& what_);
    explicit ErrorPolicy(const std::string& what_,Exception *nested_);
    ~ErrorPolicy() throw();
  };

  class MagickPPExport ErrorRegistry: public Error
  {
  public:
    explicit ErrorRegistry(const std::string& what_);
    explicit ErrorRegistry(const std::string& what_,Exception *nested_);
    ~ErrorRegistry() throw();
  };

  class MagickPPExport ErrorResourceLimit: public Error
  {
  public:
    explicit ErrorResourceLimit(const std::string& what_);
    explicit ErrorResourceLimit(const std::string& what_,Exception *nested_);
    ~ErrorResourceLimit() throw();
  };

  class MagickPPExport ErrorStream: public Error
  {
  public:
    explicit ErrorStream(const std::string& what_);
    explicit ErrorStream(const std::string& what_,Exception *nested_);
    ~ErrorStream() throw();
  };

  class MagickPPExport ErrorType: public Error
  {
  public:
    explicit ErrorType(const std::string& what_);
    explicit ErrorType(const std::string& what_,Exception *nested_);
    ~ErrorType() throw();
  };

  class MagickPPExport ErrorUndefined: public Error
  {
  public:
    explicit ErrorUndefined(const std::string& what_);
    explicit ErrorUndefined(const std::string& what_,Exception *nested_);
    ~ErrorUndefined() throw();
  };

  class MagickPPExport ErrorXServer: public Error
  {
  public:
    explicit ErrorXServer(const std::string& what_);
    explicit ErrorXServer(const std::string& what_,Exception *nested_);
    ~ErrorXServer() throw();
  };

  //
  // Warnings
  //

  class MagickPPExport Warning: public Exception
  {
  public:
    explicit Warning(const std::string& what_);
    explicit Warning(const std::string& what_,Exception *nested_);
    ~Warning() throw();
  };

  class MagickPPExport WarningBlob: public Warning
  {
  public:
    explicit WarningBlob(const std::string& what_);
    explicit WarningBlob(const std::string& what_,Exception *nested_);
    ~WarningBlob() throw();
  };

  class MagickPPExport WarningCache: public Warning
  {
  public:
    explicit WarningCache(const std::string& what_);
    explicit WarningCache(const std::string& what_,Exception *nested_);
    ~WarningCache() throw();
  };

  class MagickPPExport WarningCoder: public Warning
  {
  public:
    explicit WarningCoder(const std::string& what_);
    explicit WarningCoder(const std::string& what_,Exception *nested_);
    ~WarningCoder() throw();
  };

  class MagickPPExport WarningConfigure: public Warning
  {
  public:
    explicit WarningConfigure(const std::string& what_);
    explicit WarningConfigure(const std::string& what_,Exception *nested_);
    ~WarningConfigure() throw();
  };

  class MagickPPExport WarningCorruptImage: public Warning
  {
  public:
    explicit WarningCorruptImage(const std::string& what_);
    explicit WarningCorruptImage(const std::string& what_,Exception *nested_);
    ~WarningCorruptImage() throw();
  };

  class MagickPPExport WarningDelegate: public Warning
  {
  public:
    explicit WarningDelegate(const std::string& what_);
    explicit WarningDelegate(const std::string& what_,Exception *nested_);
    ~WarningDelegate() throw();
  };

  class MagickPPExport WarningDraw : public Warning
  {
  public:
    explicit WarningDraw(const std::string& what_);
    explicit WarningDraw(const std::string& what_,Exception *nested_);
    ~WarningDraw() throw();
  };

  class MagickPPExport WarningFileOpen: public Warning
  {
  public:
    explicit WarningFileOpen(const std::string& what_);
    explicit WarningFileOpen(const std::string& what_,Exception *nested_);
    ~WarningFileOpen() throw();
  };

  class MagickPPExport WarningImage: public Warning
  {
  public:
    explicit WarningImage(const std::string& what_);
    explicit WarningImage(const std::string& what_,Exception *nested_);
    ~WarningImage() throw();
  };

  class MagickPPExport WarningMissingDelegate: public Warning
  {
  public:
    explicit WarningMissingDelegate(const std::string& what_);
    explicit WarningMissingDelegate(const std::string& what_,
      Exception *nested_);
    ~WarningMissingDelegate() throw();
  };

  class MagickPPExport WarningModule: public Warning
  {
  public:
    explicit WarningModule(const std::string& what_);
    explicit WarningModule(const std::string& what_,Exception *nested_);
    ~WarningModule() throw();
  };

  class MagickPPExport WarningMonitor: public Warning
  {
  public:
    explicit WarningMonitor(const std::string& what_);
    explicit WarningMonitor(const std::string& what_,Exception *nested_);
    ~WarningMonitor() throw();
  };

  class MagickPPExport WarningOption: public Warning
  {
  public:
    explicit WarningOption(const std::string& what_);
    explicit WarningOption(const std::string& what_,Exception *nested_);
    ~WarningOption() throw();
  };

  class MagickPPExport WarningPolicy: public Warning
  {
  public:
    explicit WarningPolicy(const std::string& what_);
    explicit WarningPolicy(const std::string& what_,Exception *nested_);
    ~WarningPolicy() throw();
  };

  class MagickPPExport WarningRegistry: public Warning
  {
  public:
    explicit WarningRegistry(const std::string& what_);
    explicit WarningRegistry(const std::string& what_,Exception *nested_);
    ~WarningRegistry() throw();
  };

  class MagickPPExport WarningResourceLimit: public Warning
  {
  public:
    explicit WarningResourceLimit(const std::string& what_);
    explicit WarningResourceLimit(const std::string& what_,Exception *nested_);
    ~WarningResourceLimit() throw();
  };

  class MagickPPExport WarningStream: public Warning
  {
  public:
    explicit WarningStream(const std::string& what_);
    explicit WarningStream(const std::string& what_,Exception *nested_);
    ~WarningStream() throw();
  };

  class MagickPPExport WarningType: public Warning
  {
  public:
    explicit WarningType(const std::string& what_);
    explicit WarningType(const std::string& what_,Exception *nested_);
    ~WarningType() throw();
  };

  class MagickPPExport WarningUndefined: public Warning
  {
  public:
    explicit WarningUndefined(const std::string& what_);
    explicit WarningUndefined(const std::string& what_,Exception *nested_);
    ~WarningUndefined() throw();
  };

  class MagickPPExport WarningXServer: public Warning
  {
  public:
    explicit WarningXServer(const std::string& what_);
    explicit WarningXServer(const std::string& what_,Exception *nested_);
    ~WarningXServer() throw();
  };

  //
  // No user-serviceable components beyond this point.
  //

  std::string formatExceptionMessage(
    const MagickCore::ExceptionInfo *exception_);

  Exception* createException(const MagickCore::ExceptionInfo *exception_);

  // Throw exception based on raw data
  extern MagickPPExport void throwExceptionExplicit(
    const MagickCore::ExceptionType severity_,const char* reason_,
    const char* description_=(char *) NULL);

  // Thow exception based on ImageMagick's ExceptionInfo
  extern MagickPPExport void throwException(
    MagickCore::ExceptionInfo *exception_,const bool quiet_=false);

} // namespace Magick

#endif // Magick_Exception_header
```

--------------------------------------------------------------------------------

---[FILE: Functions.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/Functions.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2003
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Simple C++ function wrappers for often used or otherwise
// inconvenient ImageMagick equivalents
//

#if !defined(Magick_Functions_header)
#define Magick_Functions_header

#include "Magick++/Include.h"
#include <string>

namespace Magick
{
  // Clone C++ string as allocated C string, de-allocating any existing string
  MagickPPExport void CloneString(char **destination_,
    const std::string &source_);

  // Disable OpenCL acceleration (only works when build with OpenCL support)
  MagickPPExport void DisableOpenCL(void);

  // Enable OpenCL acceleration (only works when build with OpenCL support)
  MagickPPExport bool EnableOpenCL(void);

  // C library initialization routine
  MagickPPExport void InitializeMagick(const char *path_);

  // Seed a new sequence of pseudo-random numbers
  MagickPPExport void SetRandomSeed(const unsigned long seed);

  // Set the ImageMagick security policy.
  MagickPPExport bool SetSecurityPolicy(const std::string &policy_);

  // C library de-initialize routine
  MagickPPExport void TerminateMagick();

  // Constructor to initialize the Magick++ environment
  class MagickPPExport MagickPlusPlusGenesis
  {
  public:

    // Constructor to initialize Magick++
    MagickPlusPlusGenesis(const char *path_)
    {
      InitializeMagick( path_ );
    }

    // Destructor to de-initialize Magick++
    ~MagickPlusPlusGenesis()
    {
      TerminateMagick();
    }

  private:

  };
}
#endif // Magick_Functions_header
```

--------------------------------------------------------------------------------

---[FILE: Geometry.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/Geometry.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Geometry Definition
//
// Representation of an ImageMagick geometry specification
// X11 geometry specification plus hints

#if !defined (Magick_Geometry_header)
#define Magick_Geometry_header

#include "Magick++/Include.h"
#include <string>

namespace Magick
{
  class MagickPPExport Geometry;

  // Compare two Geometry objects regardless of LHS/RHS
  MagickPPExport int operator ==
    (const Magick::Geometry& left_,const Magick::Geometry& right_);
  MagickPPExport int operator !=
    (const Magick::Geometry& left_,const Magick::Geometry& right_);
  MagickPPExport int operator >
    (const Magick::Geometry& left_,const Magick::Geometry& right_);
  MagickPPExport int operator <
    (const Magick::Geometry& left_,const Magick::Geometry& right_);
  MagickPPExport int operator >=
    (const Magick::Geometry& left_,const Magick::Geometry& right_);
  MagickPPExport int operator <=
    (const Magick::Geometry& left_,const Magick::Geometry& right_);

  class MagickPPExport Geometry
  {
  public:

    // Default constructor
    Geometry();

    // Construct Geometry from specified string
    Geometry(const char *geometry_);

    // Copy constructor
    Geometry(const Geometry &geometry_);

    // Construct Geometry from specified string
    Geometry(const std::string &geometry_);

    // Construct Geometry from specified dimensions
    Geometry(size_t width_,size_t height_,::ssize_t xOff_=0,
      ::ssize_t yOff_=0);

    // Destructor
    ~Geometry(void);

    // Set via geometry string
    const Geometry& operator=(const char *geometry_);

    // Assignment operator
    Geometry& operator=(const Geometry& Geometry_);

    // Set via geometry string
    const Geometry& operator=(const std::string &geometry_);

    // Return geometry string
    operator std::string() const;

    // Resize without preserving aspect ratio (!)
    void aspect(bool aspect_);
    bool aspect(void) const;

    // Resize the image based on the smallest fitting dimension (^)
    void fillArea(bool fillArea_);
    bool fillArea(void) const;

    // Resize if image is greater than size (>)
    void greater(bool greater_);
    bool greater(void) const;

    // Height
    void height(size_t height_);
    size_t height(void) const;

    // Does object contain valid geometry?
    void isValid(bool isValid_);
    bool isValid(void) const;

    // Resize if image is less than size (<)
    void less(bool less_);
    bool less(void) const;

    // Resize using a pixel area count limit (@)
    void limitPixels(bool limitPixels_);
    bool limitPixels(void) const;

    // Width and height are expressed as percentages
    void percent(bool percent_);
    bool percent(void) const;

    // Width
    void width(size_t width_);
    size_t width(void) const;

    // X offset from origin
    void xOff(::ssize_t xOff_);
    ::ssize_t xOff(void) const;

    // Y offset from origin
    void yOff(::ssize_t yOff_);
    ::ssize_t yOff(void) const;

    //
    // Public methods below this point are for Magick++ use only.
    //

    // Construct from RectangleInfo
    Geometry(const MagickCore::RectangleInfo &rectangle_);

    // Set via RectangleInfo
    const Geometry& operator=(const MagickCore::RectangleInfo &rectangle_);

    // Return an ImageMagick RectangleInfo struct
    operator MagickCore::RectangleInfo() const;

  private:
    size_t _width;
    size_t _height;
    ::ssize_t _xOff;
    ::ssize_t _yOff;
    bool _isValid;
    bool _percent;     // Interpret width & height as percentages (%)
    bool _aspect;      // Force exact size (!)
    bool _greater;     // Resize only if larger than geometry (>)
    bool _less;        // Resize only if smaller than geometry (<)
    bool _fillArea;    // Resize the image based on the smallest fitting dimension (^)
    bool _limitPixels; // Resize using a pixel area count limit (@)
  };

  class MagickPPExport Offset;

  // Compare two Offset objects
  MagickPPExport int operator ==
    (const Magick::Offset& left_,const Magick::Offset& right_);
  MagickPPExport int operator !=
    (const Magick::Offset& left_,const Magick::Offset& right_);

  class MagickPPExport Offset
  {
  public:

    // Default constructor
    Offset();

    // Construct Offset from specified string
    Offset(const char *offset_);

    // Copy constructor
    Offset(const Offset &offset_);

    // Construct Offset from specified string
    Offset(const std::string &offset_);

    // Construct Offset from specified x and y
    Offset(ssize_t x_,ssize_t y_);

    // Destructor
    ~Offset(void);

    // Set via offset string
    const Offset& operator=(const char *offset_);

    // Assignment operator
    Offset& operator=(const Offset& offset_);

    // Set via offset string
    const Offset& operator=(const std::string &offset_);

    // X offset from origin
    ssize_t x(void) const;

    // Y offset from origin
    ssize_t y(void) const;

    //
    // Public methods below this point are for Magick++ use only.
    //

    // Return an ImageMagick OffsetInfo struct
    operator MagickCore::OffsetInfo() const;

  private:
    ssize_t _x;
    ssize_t _y;
  };

  class MagickPPExport Point;

  // Compare two Point objects
  MagickPPExport int operator ==
    (const Magick::Point& left_,const Magick::Point& right_);
  MagickPPExport int operator !=
    (const Magick::Point& left_,const Magick::Point& right_);

  class MagickPPExport Point
  {
  public:

    // Default constructor
    Point();

    // Construct Point from specified string
    Point(const char *point_);

    // Copy constructor
    Point(const Point &point_);

    // Construct Point from specified string
    Point(const std::string &point_);

    // Construct Point from specified x and y
    Point(double x_,double y_);

    // Construct Point from specified x y
    Point(double xy_);

    // Destructor
    ~Point(void);

    // Set via point string
    const Point& operator=(const char *point_);

    // Set via double value
    const Point& operator=(double xy_);

    // Assignment operator
    Point& operator=(const Point& point_);

    // Set via point string
    const Point& operator=(const std::string &point_);

    // Return point string
    operator std::string() const;

    // Does object contain valid point?
    bool isValid() const;

    // X offset from origin
    double x(void) const;

    // Y offset from origin
    double y(void) const;

  private:
    double _x;
    double _y;
  };
} // namespace Magick

#endif // Magick_Geometry_header
```

--------------------------------------------------------------------------------

````
