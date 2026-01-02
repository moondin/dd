---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 190
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 190 of 851)

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

---[FILE: Montage.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/Montage.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002, 2003
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Definition of Montage class used to specify montage options.
//

#if !defined(Magick_Montage_header)
#define Magick_Montage_header

#include "Magick++/Include.h"
#include <string>
#include "Magick++/Color.h"
#include "Magick++/Geometry.h"

//
// Basic (Un-framed) Montage
//
namespace Magick
{
  class MagickPPExport Montage
  {
  public:

    Montage(void);
    virtual ~Montage(void);

    // Color that thumbnails are composed on
    void backgroundColor(const Color &backgroundColor_);
    Color backgroundColor(void) const;

    // Composition algorithm to use (e.g. ReplaceCompositeOp)
    void compose(CompositeOperator compose_);
    CompositeOperator compose(void) const;

    // Filename to save montages to
    void fileName(const std::string &fileName_);
    std::string fileName(void) const;

    // Fill color
    void fillColor(const Color &fill_);
    Color fillColor(void) const;

    // Label font
    void font(const std::string &font_);
    std::string font(void) const;

    // Thumbnail width & height plus border width & height
    void geometry(const Geometry &geometry_);
    Geometry geometry(void) const;

    // Thumbnail position (e.g. SouthWestGravity)
    void gravity(GravityType gravity_);
    GravityType gravity(void) const;

    // Thumbnail label (applied to image prior to montage)
    void label(const std::string &label_);
    std::string label(void) const;

    // Font point size
    void pointSize(size_t pointSize_);
    size_t pointSize(void) const;

    // Enable drop-shadows on thumbnails
    void shadow(bool shadow_);
    bool shadow(void) const;

    // Outline color
    void strokeColor(const Color &stroke_);
    Color strokeColor(void) const;

    // Background texture image
    void texture(const std::string &texture_);
    std::string texture(void) const;

    // Thumbnail rows and columns
    void tile(const Geometry &tile_);
    Geometry tile(void) const;

    // Montage title
    void title(const std::string &title_);
    std::string title(void) const;

    // Transparent color
    void transparentColor(const Color &transparentColor_);
    Color transparentColor(void) const;

    //
    // Implementation methods/members
    //

    // Update elements in existing MontageInfo structure
    virtual void updateMontageInfo(MagickCore::MontageInfo &montageInfo_) const;

  private:

    Color _backgroundColor;
    std::string _fileName;
    Color _fill;
    std::string _font;
    Geometry _geometry;
    GravityType _gravity;
    std::string _label;
    size_t _pointSize;
    bool _shadow;
    Color _stroke;
    std::string _texture;
    Geometry _tile;
    std::string _title;
    Color _transparentColor;
  };

  //
  // Montage With Frames (Extends Basic Montage)
  //
  class MagickPPExport MontageFramed : public Montage
  {
  public:

    MontageFramed(void);
    ~MontageFramed(void);

    // Frame foreground color
    void matteColor(const Color &matteColor_);
    Color matteColor(void) const;

    // Frame border color
    void borderColor(const Color &borderColor_);
    Color borderColor(void) const;

    // Pixels between thumbnail and surrounding frame
    void borderWidth(size_t borderWidth_);
    size_t borderWidth(void) const;

    // Frame geometry (width & height frame thickness)
    void frameGeometry(const Geometry &frame_);
    Geometry frameGeometry(void) const;

    //
    // Implementation methods/members
    //

    // Update elements in existing MontageInfo structure
    void updateMontageInfo(MagickCore::MontageInfo &montageInfo_) const;

  private:

    Color _matteColor;
    Color _borderColor;
    size_t _borderWidth;
    Geometry _frame;
  };
} // namespace Magick

#endif // Magick_Montage_header
```

--------------------------------------------------------------------------------

---[FILE: Options.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/Options.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002, 2003
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Definition of Options
//
// Options which may be applied to an image. These options are the
// equivalent of options supplied to ImageMagick utilities.
//
// This is an internal implementation class and is not part of the
// Magick++ API
//

#if !defined(Magick_Options_header)
#define Magick_Options_header

#include "Magick++/Include.h"
#include <string>
#include "Magick++/Color.h"
#include "Magick++/Geometry.h"
#include "Magick++/Drawable.h"

namespace Magick
{
  class Image;

  class Options
  {
  public:

    // Default constructor
    Options(void);

    // Copy constructor
    Options(const Options& options_);

    // Destructor
    ~Options();

    // Join images into a single multi-image file
    void adjoin(const bool flag_);
    bool adjoin(void) const;

    // Transparent color
    void matteColor(const Color &matteColor_);
    Color matteColor(void) const;

    // Image background color
    void backgroundColor(const Color &color_);
    Color backgroundColor(void) const;

    // Name of texture image to tile onto the image background
    void backgroundTexture(const std::string &backgroundTexture_);
    std::string backgroundTexture(void) const;

    // Image border color
    void borderColor(const Color &color_);
    Color borderColor(void) const;

    // Text bounding-box base color (default none)
    void boxColor(const Color &boxColor_);
    Color boxColor(void) const;

    // Colors within this distance are considered equal
    void colorFuzz(const double fuzz_);
    double colorFuzz(void) const;

    // Image colorspace scheme
    void colorspaceType(const ColorspaceType colorspace_);
    ColorspaceType colorspaceType(void) const;

    // Compression type ( NoCompression, BZipCompression,
    // FaxCompression, JPEGCompression, LZWCompression,
    // RLECompression, or ZipCompression )
    void compressType(const CompressionType compressType_);
    CompressionType compressType(void) const;

    // Enable printing of debug messages from ImageMagick
    void debug(const bool flag_);
    bool debug(void) const;

    // Vertical and horizontal resolution in pixels of the image
    void density(const Point &density_);
    Point density(void) const;

    // Image depth (8 or 16)
    void depth(const size_t depth_);
    size_t depth(void) const;

    // Endianness (little like Intel or big like SPARC) for image
    // formats which support endian-specific options.
    void endian(const EndianType endian_);
    EndianType endian(void) const;

    // Image filename to read or write
    void file(FILE *file_);
    FILE *file(void) const;

    // Image filename to read or write
    void fileName(const std::string &fileName_);
    std::string fileName(void) const;

    // Color to use when filling drawn objects
    void fillColor(const Color &fillColor_);
    Color fillColor(void) const;

    // Fill pattern
    void fillPattern(const MagickCore::Image *fillPattern_);
    const MagickCore::Image *fillPattern(void) const;

    // Rule to use when filling drawn objects
    void fillRule(const FillRule &fillRule_);
    FillRule fillRule(void) const;

    // Font name
    void font(const std::string &font_);
    std::string font(void) const;

    // Font name
    void fontFamily(const std::string &family_);
    std::string fontFamily(void) const;

    // Font point size
    void fontPointsize(const double pointSize_);
    double fontPointsize(void) const;

    // Font style
    void fontStyle(const StyleType style_);
    StyleType fontStyle(void) const;

    // Font weight
    void fontWeight(const size_t weight_);
    size_t fontWeight(void) const;

    std::string format(void) const;

    // Image interlace scheme
    void interlaceType(const InterlaceType interlace_);
    InterlaceType interlaceType(void) const;

   // Image format to write or read
    void magick(const std::string &magick_);
    std::string magick(void) const;

   // Write as a monochrome image
    void monochrome(const bool monochromeFlag_);
    bool monochrome(void) const;

    // Preferred size and location of an image canvas.
    void page(const Geometry &pageSize_);
    Geometry page(void) const;

    // Desired image quality factor
    void quality(const size_t quality_);
    size_t quality(void) const;

    // Maximum number of colors to quantize to
    void quantizeColors(const size_t colors_);
    size_t quantizeColors(void) const;

    // Colorspace to quantize in.
    void quantizeColorSpace(const ColorspaceType colorSpace_);
    ColorspaceType quantizeColorSpace(void) const;

    // Dither image during quantization.
    void quantizeDither(const bool ditherFlag_);
    bool quantizeDither(void) const;
    void quantizeDither(const DitherMethod ditherMethod_);

    // Dither method
    void quantizeDitherMethod(const DitherMethod ditherMethod_);
    DitherMethod quantizeDitherMethod(void) const;

    // Quantization tree-depth
    void quantizeTreeDepth(const size_t treeDepth_);
    size_t quantizeTreeDepth(void) const;

    // Suppress all warning messages. Error messages are still reported.
    void quiet(const bool quiet_);
    bool quiet(void) const;

    // Units of resolution to interpret density
    void resolutionUnits(const ResolutionType resolutionUnits_);
    ResolutionType resolutionUnits(void) const;

    // Image sampling factor
    void samplingFactor(const std::string &samplingFactor_);
    std::string samplingFactor(void) const;

    // Image size (required for raw formats)
    void size(const Geometry &geometry_);
    Geometry size(void) const;

    // enabled/disable stroke anti-aliasing
    void strokeAntiAlias(const bool flag_);
    bool strokeAntiAlias(void) const ;

    // Color to use when drawing object outlines
    void strokeColor(const Color &strokeColor_);
    Color strokeColor(void) const;

    // Control the pattern of dashes and gaps used to stroke
    // paths. The strokeDashArray represents a list of numbers that
    // specify the lengths of alternating dashes and gaps in user
    // units. If an odd number of values is provided, then the list of
    // values is repeated to yield an even number of values.
    void strokeDashArray(const double *strokeDashArray_);
    const double *strokeDashArray(void) const;

    // While drawing using strokeDashArray, specify distance into the dash
    // pattern to start the dash (default 0).
    void strokeDashOffset(const double strokeDashOffset_);
    double strokeDashOffset(void) const;

    // Specify the shape to be used at the end of open subpaths when
    // they are stroked. Values of LineCap are UndefinedCap, ButtCap,
    // RoundCap, and SquareCap.
    void strokeLineCap(const LineCap lineCap_);
    LineCap strokeLineCap(void) const;

    // Specify the shape to be used at the corners of paths (or other
    // vector shapes) when they are stroked. Values of LineJoin are
    // UndefinedJoin, MiterJoin, RoundJoin, and BevelJoin.
    void strokeLineJoin(const LineJoin lineJoin_);
    LineJoin strokeLineJoin(void) const;

    // Specify miter limit. When two line segments meet at a sharp
    // angle and miter joins have been specified for 'lineJoin', it is
    // possible for the miter to extend far beyond the thickness of
    // the line stroking the path. The miterLimit' imposes a limit on
    // the ratio of the miter length to the 'stroke_width'. The default
    // value of this parameter is 4.
    void strokeMiterLimit(const size_t miterLimit_);
    size_t strokeMiterLimit(void) const;

    // Pattern image to use for stroked outlines
    void strokePattern(const MagickCore::Image *strokePattern_);
    const MagickCore::Image *strokePattern(void) const;

   // Stroke width for drawing vector objects (default one)
    void strokeWidth(const double strokeWidth_);
    double strokeWidth(void) const;

    void subImage(const size_t subImage_);
    size_t subImage(void) const;

    // Sub-frame number to return
    void subRange(const size_t subRange_);
    size_t subRange(void) const;

    // Remove pixel aliasing
    void textAntiAlias(const bool flag_);
    bool textAntiAlias(void) const;

    // Render text right-to-left or left-to-right.
    void textDirection(const DirectionType direction_);
    DirectionType textDirection() const;

    // Annotation text encoding (e.g. "UTF-16")
    void textEncoding(const std::string &encoding_);
    std::string textEncoding(void) const;

    // Text gravity.
    void textGravity(const GravityType gravity_);
    GravityType textGravity() const;

    // Text inter-line spacing
    void textInterlineSpacing(const double spacing_);
    double textInterlineSpacing(void) const;

    // Text inter-word spacing
    void textInterwordSpacing(const double spacing_);
    double textInterwordSpacing(void) const;

    // Text inter-character kerning
    void textKerning(const double kerning_);
    double textKerning(void) const;

    // Text undercolor box
    void textUnderColor(const Color &underColor_);
    Color textUnderColor(void) const;

    // Origin of coordinate system to use when annotating with text or drawing
    void transformOrigin(const double tx_,const double ty_);

    // Reset transformation parameters to default
    void transformReset(void);

    // Rotation to use when annotating with text or drawing
    void transformRotation(const double angle_);

    // Scale to use when annotating with text or drawing
    void transformScale(const double sx_,const double sy_);

    // Skew to use in X axis when annotating with text or drawing
    void transformSkewX(const double skewx_);

    // Skew to use in Y axis when annotating with text or drawing
    void transformSkewY(const double skewy_);

    // Image representation type
    void type(const ImageType type_);
    ImageType type(void) const;

    // Return verbose information about an image, or an operation
    void verbose(const bool verboseFlag_);
    bool verbose(void) const;

    // X11 display name
    void x11Display(const std::string &display_);
    std::string x11Display(void) const;

    //
    // Internal implementation methods.  Please do not use.
    //

    MagickCore::DrawInfo *drawInfo(void);
    MagickCore::ImageInfo *imageInfo(void);
    MagickCore::QuantizeInfo *quantizeInfo(void);

    // Construct using raw structures
    Options(const MagickCore::ImageInfo *imageInfo_,
      const MagickCore::QuantizeInfo *quantizeInfo_,
      const MagickCore::DrawInfo *drawInfo_);

  private:

    // Assignment not supported
    Options& operator=(const Options&);

    void setOption(const char *name,const Color &value_);

    void setOption(const char *name,const double value_);

    MagickCore::ImageInfo    *_imageInfo;
    MagickCore::QuantizeInfo *_quantizeInfo;
    MagickCore::DrawInfo     *_drawInfo;
    bool                     _quiet;
  };
} // namespace Magick

#endif // Magick_Options_header
```

--------------------------------------------------------------------------------

---[FILE: Pixels.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/Pixels.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Representation of a pixel view.
//

#if !defined(Magick_Pixels_header)
#define Magick_Pixels_header

#include "Magick++/Include.h"
#include "Magick++/Color.h"
#include "Magick++/Image.h"

namespace Magick
{
  class MagickPPExport Pixels
  {
  public:

    // Construct pixel view using specified image.
    Pixels(Magick::Image &image_);

    // Destroy pixel view
    ~Pixels(void);

    // Transfer pixels from the image to the pixel view as defined by
    // the specified region. Modified pixels may be subsequently
    // transferred back to the image via sync.
    Quantum *get(const ::ssize_t x_,const ::ssize_t y_,
      const size_t columns_,const size_t rows_);

    // Transfer read-only pixels from the image to the pixel view as
    // defined by the specified region.
    const Quantum *getConst(const ::ssize_t x_,const ::ssize_t y_,
      const size_t columns_,const size_t rows_);

    // Return pixel metacontent
    void *metacontent(void);

    // Returns the offset for the specified channel.
    ssize_t offset(PixelChannel channel) const;

    // Allocate a pixel view region to store image pixels as defined
    // by the region rectangle.  This area is subsequently transferred
    // from the pixel view to the image via sync.
    Quantum *set(const ::ssize_t x_,const ::ssize_t y_,const size_t columns_,
      const size_t rows_ );

    // Transfers the image view pixels to the image.
    void sync(void);

    // Left ordinate of view
    ::ssize_t x(void) const;

    // Top ordinate of view
    ::ssize_t y(void) const;

    // Width of view
    size_t columns(void) const;

    // Height of view
    size_t rows(void) const;

  private:

    // Copying and assigning Pixels is not supported.
    Pixels(const Pixels& pixels_);
    const Pixels& operator=(const Pixels& pixels_);

    Magick::Image             _image;     // Image reference
    MagickCore::CacheView     *_view;     // Image view handle
    ::ssize_t                 _x;         // Left ordinate of view
    ::ssize_t                 _y;         // Top ordinate of view
    size_t                    _columns;   // Width of view
    size_t                    _rows;      // Height of view

  }; // class Pixels

  class MagickPPExport PixelData
  {
  public:

    // Construct pixel data using specified image
    PixelData(Magick::Image &image_,std::string map_,const StorageType type_);

    // Construct pixel data using specified image
    PixelData(Magick::Image &image_,const ::ssize_t x_,const ::ssize_t y_,
      const size_t width_,const size_t height_,std::string map_,
      const StorageType type_);

    // Destroy pixel data
    ~PixelData(void);

    // Pixel data buffer
    const void *data(void) const;

    // Length of the buffer
    ::ssize_t length(void) const;

    // Size of the buffer in bytes
    ::ssize_t size(void) const;

  private:

    // Copying and assigning PixelData is not supported
    PixelData(const PixelData& pixels_);
    const PixelData& operator=(const PixelData& pixels_);

    void init(Magick::Image &image_,const ::ssize_t x_,const ::ssize_t y_,
      const size_t width_,const size_t height_,std::string map_,
      const StorageType type_);

    void relinquish(void) throw();

    void      *_data;  // The pixel data
    ::ssize_t _length; // Length of the data
    ::ssize_t _size;   // Size of the data
  }; // class PixelData

} // Magick namespace

//
// Inline methods
//

// Left ordinate of view
inline ::ssize_t Magick::Pixels::x(void) const
{
  return _x;
}

// Top ordinate of view
inline ::ssize_t Magick::Pixels::y(void) const
{
  return _y;
}

// Width of view
inline size_t Magick::Pixels::columns(void) const
{
  return _columns;
}

// Height of view
inline size_t Magick::Pixels::rows(void) const
{
  return _rows;
}

#endif // Magick_Pixels_header
```

--------------------------------------------------------------------------------

---[FILE: ResourceLimits.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/ResourceLimits.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Definition of resource limits.
//

#if !defined(Magick_ResourceLimits_header)
#define Magick_ResourceLimits_header

#include "Magick++/Include.h"

namespace Magick
{
  class MagickPPExport ResourceLimits
  {
  public:

    // Pixel cache limit in bytes. Requests for memory above this limit
    // are automagically allocated on disk.
    static void area(const MagickSizeType limit_);
    static MagickSizeType area(void);

    // Pixel cache limit in bytes. Requests for memory above this limit
    // will fail.
    static void disk(const MagickSizeType limit_);
    static MagickSizeType disk(void);

    // The maximum number of open pixel cache files. When this limit is
    // exceeded, any subsequent pixels cached to disk are closed and reopened
    // on demand. This behavior permits a large number of images to be accessed
    // simultaneously on disk, but with a speed penalty due to repeated
    // open/close calls.
    static void file(const MagickSizeType limit_);
    static MagickSizeType file(void);

    // The maximum height of an image.
    static void height(const MagickSizeType limit_);
    static MagickSizeType height(void);

    // The maximum number of images in an image list.
    static void listLength(const MagickSizeType limit_);
    static MagickSizeType listLength();

    // Pixel cache limit in bytes.  Once this memory limit is exceeded,
    // all subsequent pixels cache operations are to/from disk.
    static void map(const MagickSizeType limit_);
    static MagickSizeType map(void);

    // Pixel cache limit in bytes. Once this memory limit is exceeded,
    // all subsequent pixels cache operations are to/from disk or to/from
    // memory mapped files.
    static void memory(const MagickSizeType limit_);
    static MagickSizeType memory(void);

    // Limits the number of threads used in multithreaded operations.
    static void thread(const MagickSizeType limit_);
    static MagickSizeType thread(void);

    // Periodically yield the CPU for at least the time specified in
    // milliseconds.
    static void throttle(const MagickSizeType limit_);
    static MagickSizeType throttle(void);

    // The maximum width of an image.
    static void width(const MagickSizeType limit_);
    static MagickSizeType width(void);

  private:
    ResourceLimits(void);

  }; // class ResourceLimits

} // Magick namespace

#endif // Magick_ResourceLimits_header
```

--------------------------------------------------------------------------------

---[FILE: SecurityPolicy.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/SecurityPolicy.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Definition of the security policy.
//

#if !defined(Magick_SecurityPolicy_header)
#define Magick_SecurityPolicy_header

#include "Magick++/Include.h"
#include <string>

namespace Magick
{
  class MagickPPExport SecurityPolicy
  {
  public:

    // The maximum number of significant digits to be printed.
    static bool precision(const int precision_);

    // Enables anonymous mapping for pixel cache.
    static bool anonymousCacheMemoryMap();

    // Enables anonymous virtual memory.
    static bool anonymousSystemMemoryMap();

    // The memory request limit in bytes.
    static bool maxMemoryRequest(const MagickSizeType limit_);

    // The maximum size of a profile in bytes.
    static bool maxProfileSize(const MagickSizeType limit_);

    // The number of passes to use when shredding files.
    static bool shred(const int passes_);

  private:
    SecurityPolicy(void);

    static bool setValue(const PolicyDomain domain_, const std::string name_,
      const std::string value_);

    template <typename T>
    static std::string toString(const T& value);

  }; // class SecurityPolicy

} // Magick namespace

#endif // Magick_SecurityPolicy_header
```

--------------------------------------------------------------------------------

---[FILE: Statistic.h]---
Location: ImageMagick-main/Magick++/lib/Magick++/Statistic.h

```c
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Definition of channel moments.
//

#if !defined (Magick_ChannelMoments_header)
#define Magick_ChannelMoments_header

#include "Magick++/Include.h"
#include <vector>

namespace Magick
{
  class Image;

  class MagickPPExport ChannelMoments
  {
  public:

    // Default constructor
    ChannelMoments(void);

    // Copy constructor
    ChannelMoments(const ChannelMoments &channelMoments_);

    // Destroy channel moments
    ~ChannelMoments(void);

    // X position of centroid
    double centroidX(void) const;

    // Y position of centroid
    double centroidY(void) const;

    // The channel
    PixelChannel channel(void) const;

    // X position of ellipse axis
    double ellipseAxisX(void) const;

    // Y position of ellipse axis
    double ellipseAxisY(void) const;

    // Ellipse angle
    double ellipseAngle(void) const;

    // Ellipse eccentricity
    double ellipseEccentricity(void) const;

    // Ellipse intensity
    double ellipseIntensity(void) const;

    // Hu invariants (valid range for index is 0-7)
    double huInvariants(const size_t index_) const;

    // Does object contain valid channel moments?
    bool isValid() const;

    //
    // Implementation methods
    //

    ChannelMoments(const PixelChannel channel_,
      const MagickCore::ChannelMoments *channelMoments_);

  private:
    PixelChannel _channel;
    std::vector<double> _huInvariants;
    double _centroidX;
    double _centroidY;
    double _ellipseAxisX;
    double _ellipseAxisY;
    double _ellipseAngle;
    double _ellipseEccentricity;
    double _ellipseIntensity;
  };

  class MagickPPExport ChannelPerceptualHash
  {
  public:

    // Default constructor
    ChannelPerceptualHash(void);

    // Copy constructor
    ChannelPerceptualHash(const ChannelPerceptualHash &channelPerceptualHash_);

    // Constructor using the specified hash string
    ChannelPerceptualHash(const PixelChannel channel_,
      const std::string &hash_);

    // Destroy channel perceptual hash
    ~ChannelPerceptualHash(void);

    // Return hash string
    operator std::string() const;

    // The channel
    PixelChannel channel(void) const;

    // Does object contain valid channel perceptual hash?
    bool isValid() const;

    // Returns the sum squared difference between this hash and the other hash
    double sumSquaredDifferences(
      const ChannelPerceptualHash &channelPerceptualHash_);

    // SRGB hu preceptual hash (valid range for index is 0-6)
    double srgbHuPhash(const size_t index_) const;

    // HCLp hu preceptual hash (valid range for index is 0-6)
    double hclpHuPhash(const size_t index_) const;

    //
    // Implementation methods
    //

    ChannelPerceptualHash(const PixelChannel channel_,
      const MagickCore::ChannelPerceptualHash *channelPerceptualHash_);

  private:
    PixelChannel _channel;
    std::vector<double> _srgbHuPhash;
    std::vector<double> _hclpHuPhash;
  };

  // Obtain image statistics. Statistics are normalized to the range
  // of 0.0 to 1.0 and are output to the specified ImageStatistics
  // structure.
  class MagickPPExport ChannelStatistics
  {
  public:

    // Default constructor
    ChannelStatistics(void);

    // Copy constructor
    ChannelStatistics(const ChannelStatistics &channelStatistics_);

    // Destroy channel statistics
    ~ChannelStatistics(void);

    // Area
    double area() const;

    // The channel
    PixelChannel channel(void) const;

    // Depth
    size_t depth() const;

    // Entropy
    double entropy() const;

    // Does object contain valid channel statistics?
    bool isValid() const;

    // Kurtosis
    double kurtosis() const;

    // Minimum value observed
    double maxima() const;

    // Average (mean) value observed
    double mean() const;

    // Maximum value observed
    double minima() const;

    // Skewness
    double skewness() const;

    // Standard deviation, sqrt(variance)
    double standardDeviation() const;

    // Sum
    double sum() const;

    // Sum cubed
    double sumCubed() const;

    // Sum fourth power
    double sumFourthPower() const;

    // Sum squared
    double sumSquared() const;

    // Variance
    double variance() const;

    //
    // Implementation methods
    //

    ChannelStatistics(const PixelChannel channel_,
      const MagickCore::ChannelStatistics *channelStatistics_);

  private:
    PixelChannel _channel;
    double _area;
    size_t _depth;
    double _entropy;
    double _kurtosis;
    double _maxima;
    double _mean;
    double _minima;
    double _skewness;
    double _standardDeviation;
    double _sum;
    double _sumCubed;
    double _sumFourthPower;
    double _sumSquared;
    double _variance;
  };

  class MagickPPExport ImageMoments
  {
  public:

    // Default constructor
    ImageMoments(void);

    // Copy constructor
    ImageMoments(const ImageMoments &imageMoments_);

    // Destroy image moments
    ~ImageMoments(void);

    // Returns the moments for the specified channel
    ChannelMoments channel(const PixelChannel channel_) const;

    //
    // Implementation methods
    //
    ImageMoments(const Image &image_);

  private:
    std::vector<ChannelMoments> _channels;
  };

  class MagickPPExport ImagePerceptualHash
  {
  public:

    // Default constructor
    ImagePerceptualHash(void);

    // Copy constructor
    ImagePerceptualHash(const ImagePerceptualHash &imagePerceptualHash_);

    // Constructor using the specified hash string
    ImagePerceptualHash(const std::string &hash_);

    // Destroy image perceptual hash
    ~ImagePerceptualHash(void);

    // Return hash string
    operator std::string() const;

    // Returns the perceptual hash for the specified channel
    ChannelPerceptualHash channel(const PixelChannel channel_) const;

    // Does object contain valid perceptual hash?
    bool isValid() const;

    // Returns the sum squared difference between this hash and the other hash
    double sumSquaredDifferences(
      const ImagePerceptualHash &channelPerceptualHash_);

    //
    // Implementation methods
    //
    ImagePerceptualHash(const Image &image_);

  private:
    std::vector<ChannelPerceptualHash> _channels;
  };

  class MagickPPExport ImageStatistics
  {
  public:

    // Default constructor
    ImageStatistics(void);

    // Copy constructor
    ImageStatistics(const ImageStatistics &imageStatistics_);

    // Destroy image statistics
    ~ImageStatistics(void);

    // Returns the statistics for the specified channel
    ChannelStatistics channel(const PixelChannel channel_) const;

    //
    // Implementation methods
    //
    ImageStatistics(const Image &image_);

  private:
    std::vector<ChannelStatistics> _channels;
  };
}

#endif // Magick_ChannelMoments_header
```

--------------------------------------------------------------------------------

````
