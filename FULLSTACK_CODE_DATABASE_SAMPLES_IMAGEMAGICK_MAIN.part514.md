---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 514
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 514 of 851)

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

---[FILE: drawtest.c]---
Location: ImageMagick-main/tests/drawtest.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                         DDDD   RRRR    AAA   W   W                          %
%                         D   D  R   R  A   A  W   W                          %
%                         D   D  RRRR   AAAAA  W   W                          %
%                         D   D  R R    A   A  W W W                          %
%                         DDDD   R  R   A   A   W W                           %
%                                                                             %
%                         TTTTT  EEEEE  SSSSS  TTTTT                          %
%                           T    E      SS       T                            %
%                           T    EEE     SSS     T                            %
%                           T    E         SS    T                            %
%                           T    EEEEE  SSSSS    T                            %
%                                                                             %
%                                                                             %
%                         MagickWand Drawing Tests                            %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                              Bob Friesenhahn                                %
%                                March 2002                                   %
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
%
*/

#include <stdio.h>
#include <stdlib.h>
#include <locale.h>
#include <MagickWand/MagickWand.h>

#define ThrowWandException(wand) \
{ \
  char \
    *description; \
 \
  ExceptionType \
    severity; \
 \
  description=MagickGetException(wand,&severity); \
  (void) FormatLocaleFile(stderr,"%s %s %lu %s\n",GetMagickModule(), \
    description); \
  description=(char *) MagickRelinquishMemory(description); \
  exit(-1); \
}

static MagickBooleanType ScribbleImage(MagickWand *canvas)
{
  DrawingWand
    *picasso;

  PixelWand
    *color;

  picasso=NewDrawingWand();
  color=NewPixelWand();
  (void) PushDrawingWand(picasso);
  {
    DrawSetViewbox(picasso,0,0,(ssize_t) MagickGetImageWidth(canvas),
      (ssize_t) MagickGetImageHeight(canvas));
    DrawScale(picasso,1.101,1.08);
    DrawTranslate(picasso,-23.69,-22.97);
    DrawRotate(picasso,0);
    (void) PixelSetColor(color,"#ffffff");
    DrawSetFillColor(picasso,color);
    DrawRectangle(picasso,23.69,22.97,564.6,802.2);
    DrawSetFillOpacity(picasso,1.0);
    (void) PixelSetColor(color,"none");
    DrawSetFillColor(picasso,color);
    DrawSetStrokeColor(picasso,color);
    DrawSetStrokeAntialias(picasso,MagickTrue);
    DrawSetStrokeLineCap(picasso,RoundCap);
    DrawSetStrokeLineJoin(picasso,RoundJoin);
    DrawPushDefs(picasso);
    {
      DrawPushClipPath(picasso,"clip_1");
      {
        (void) PushDrawingWand(picasso);
        {
          DrawRectangle(picasso,0,0,595.3,841.9);
        }
        (void) PopDrawingWand(picasso);
      }
      DrawPopClipPath(picasso);
    }
    DrawPopDefs(picasso);
    (void) PushDrawingWand(picasso);
    {
      (void) DrawSetClipPath(picasso, "url(#clip_1)");

      (void) PushDrawingWand(picasso);
      {
        DrawSetStrokeAntialias(picasso,MagickTrue);
        DrawSetStrokeWidth(picasso,4.032);
        DrawSetStrokeLineCap(picasso,RoundCap);
        DrawSetStrokeLineJoin(picasso,RoundJoin);
        (void) DrawSetStrokeDashArray(picasso,0,(const double *) NULL);
        (void) PixelSetColor(color,"#ff0000");
        DrawSetStrokeColor(picasso,color);
        DrawSetFillRule(picasso,EvenOddRule);
        (void) PixelSetColor(color,"#ff00ff");
        DrawSetFillColor(picasso,color);
        DrawRectangle(picasso,72,72,144,144);
      }
      (void) PopDrawingWand(picasso);
      (void) PushDrawingWand(picasso);
      {
        DrawSetStrokeAntialias(picasso,MagickTrue);
        DrawSetStrokeWidth(picasso,9);
        DrawSetStrokeLineCap(picasso,RoundCap);
        DrawSetStrokeLineJoin(picasso,RoundJoin);
        (void) DrawSetStrokeDashArray(picasso,0,(const double *) NULL);
        (void) PixelSetColor(color,"#00ff00");
        DrawSetStrokeColor(picasso,color);
        DrawSetFillRule(picasso,EvenOddRule);
        (void) PixelSetColor(color,"#0080ff");
        DrawSetFillColor(picasso,color);
        DrawRoundRectangle(picasso,72,216,360,432,9,9);
      }
      (void) PopDrawingWand(picasso);
      (void) PushDrawingWand(picasso);
      {
        const PointInfo points[37] =
        {
          { 378.1,81.72 }, { 381.1,79.56 }, { 384.3,78.12 }, { 387.6,77.33 },
          { 391.1,77.11 }, { 394.6,77.62 }, { 397.8,78.77 }, { 400.9,80.57 },
          { 403.6,83.02 }, { 523.9,216.8 }, { 526.2,219.7 }, { 527.6,223 },
          { 528.4,226.4 }, { 528.6,229.8 }, { 528,233.3 },   { 526.9,236.5 },
          { 525.1,239.5 }, { 522.6,242.2 }, { 495.9,266.3 }, { 493,268.5 },
          { 489.7,269.9 }, { 486.4,270.8 }, { 482.9,270.9 }, { 479.5,270.4 },
          { 476.2,269.3 }, { 473.2,267.5 }, { 470.4,265 },   { 350,131.2 },
          { 347.8,128.3 }, { 346.4,125.1 }, { 345.6,121.7 }, {345.4,118.2 },
          { 346,114.8 },   { 347.1,111.5 }, { 348.9,108.5 }, { 351.4,105.8 },
          { 378.1,81.72 }
        };

        DrawSetStrokeAntialias(picasso,MagickTrue);
        DrawSetStrokeWidth(picasso,2.016);
        DrawSetStrokeLineCap(picasso,RoundCap);
        DrawSetStrokeLineJoin(picasso,RoundJoin);
        (void) DrawSetStrokeDashArray(picasso,0,(const double *) NULL);
        (void) PixelSetColor(color,"#000080");
        DrawSetStrokeColor(picasso,color);
        DrawSetFillRule(picasso,EvenOddRule);
        (void) PixelSetColor(color,"#c2c280");
        DrawSetFillColor(picasso,color);
        DrawPolygon(picasso,37,points);
      }
      (void) PopDrawingWand(picasso);
      (void) PushDrawingWand(picasso);
      {
        DrawSetStrokeAntialias(picasso,MagickTrue);
        DrawSetStrokeWidth(picasso,3.024);
        DrawSetStrokeLineCap(picasso,RoundCap);
        DrawSetStrokeLineJoin(picasso,RoundJoin);
        (void) DrawSetStrokeDashArray(picasso,0,(const double *) NULL);
        (void) PixelSetColor(color,"#000080");
        DrawSetStrokeColor(picasso,color);
        DrawSetFillRule(picasso,EvenOddRule);
        (void) PixelSetColor(color,"#000080");
        DrawSetFillColor(picasso,color);
        DrawEllipse(picasso,489.6,424.8,72,129.6,0,360);
      }
      (void) PopDrawingWand(picasso);
      (void) PushDrawingWand(picasso);
      {
        const PointInfo points[48] =
        {
          { 213.8,25.13},  { 216.7,24.48 }, {219.8,24.55 },  { 223.1,25.42 },
          { 226.7,27 },    { 230.3,29.3 },  { 234.1,32.26 }, { 237.9,35.86 },
          { 241.8,40.03 }, { 249.7,50.11 }, { 257.4,62.14 }, { 264.8,75.89 },
          { 271.6,91.15 }, { 277.3,106.8 }, { 281.6,121.8 }, { 284.4,135.9 },
          { 285.7,148.5 }, { 285.6,159.6 }, { 284.9,164.3 }, { 283.8,168.5 },
          { 282.5,172.1 }, { 280.7,175 },   { 278.5,177.3 }, { 275.9,178.7 },
          { 273,179.4 },   { 269.9,179.3 }, { 266.6,178.4 }, { 263.1,176.8 },
          { 259.5,174.5},  { 255.7,171.6 }, { 251.9,168 },   { 248,163.8 },
          { 244.1,159 },   { 240.1,153.7 }, { 232.3,141.7 }, { 225,127.9 },
          { 218.2,112.7 }, { 212.5,97.06 }, { 208.2,82.01 }, { 205.4,67.97 },
          { 204,55.3 },    { 204.3,44.35 }, { 204.9,39.6 },  { 205.9,35.42 },
          { 207.4,31.82 }, { 209.2,28.87 }, { 211.3,26.64},  { 213.8,25.13 }
        };

        DrawSetStrokeAntialias(picasso,MagickTrue);
        DrawSetStrokeWidth(picasso,3.024);
        DrawSetStrokeLineCap(picasso,RoundCap);
        DrawSetStrokeLineJoin(picasso,RoundJoin);
        (void) DrawSetStrokeDashArray(picasso,0,(const double *) NULL);
        (void) PixelSetColor(color,"#ff8000");
        DrawSetStrokeColor(picasso,color);
        DrawSetFillRule(picasso,EvenOddRule);
        (void) PixelSetColor(color,"#00ffff");
        DrawSetFillColor(picasso,color);
        DrawPolygon(picasso,48,points);
      }
      (void) PopDrawingWand(picasso);
      (void) PushDrawingWand(picasso);
      {
        DrawSetStrokeAntialias(picasso,MagickTrue);
        DrawSetStrokeWidth(picasso,12.02);
        DrawSetStrokeLineCap(picasso,RoundCap);
        DrawSetStrokeLineJoin(picasso,RoundJoin);
        (void) DrawSetStrokeDashArray(picasso,0,(const double *) NULL);
        (void) PixelSetColor(color,"#4000c2");
        DrawSetStrokeColor(picasso,color);
        (void) PixelSetColor(color,"none");
        DrawSetFillColor(picasso,color);
        DrawArc(picasso,360,554.4,187.2,237.6,0,90);
      }
      (void) PopDrawingWand(picasso);
      (void) PushDrawingWand(picasso);
      {
        DrawSetStrokeAntialias(picasso,MagickTrue);
        DrawSetStrokeWidth(picasso,9);
        DrawSetStrokeLineCap(picasso,RoundCap);
        DrawSetStrokeLineJoin(picasso,RoundJoin);
        (void) DrawSetStrokeDashArray(picasso,0,(const double *) NULL);
        (void) PixelSetColor(color,"#4000c2");
        DrawSetStrokeColor(picasso,color);
        DrawSetFillRule(picasso,EvenOddRule);
        (void) PixelSetColor(color,"#4000c2");
        DrawSetFillColor(picasso,color);
        DrawEllipse(picasso,388.8,626.4,100.8,122.4,0,90);
      }
      (void) PopDrawingWand(picasso);
      (void) PushDrawingWand(picasso);
      {
        const PointInfo points[6] =
        {
          { 180,504 }, { 282.7,578.6 }, { 243.5,699.4 }, { 116.5,699.4 },
          { 77.26,578.6 }, { 180,504 }
        };

        DrawSetStrokeAntialias(picasso,MagickTrue);
        DrawSetStrokeWidth(picasso,9);
        DrawSetStrokeLineCap(picasso,RoundCap);
        DrawSetStrokeLineJoin(picasso,RoundJoin);
        (void) DrawSetStrokeDashArray(picasso,0,(const double *) NULL);
        (void) PixelSetColor(color,"#4000c2");
        DrawSetStrokeColor(picasso,color);
        DrawSetFillRule(picasso,EvenOddRule);
        (void) PixelSetColor(color,"#800000");
        DrawSetFillColor(picasso,color);
        DrawPolygon(picasso,6,points);
      }
      (void) PopDrawingWand(picasso);
      (void) PushDrawingWand(picasso);
      {
        const PointInfo points[11] =
        {
          { 180,504 },     { 211.8,568.3 }, { 282.7,578.6 }, { 231.3,628.7 },
          { 243.5,699.4 }, { 180,666 },     { 116.5,699.4 }, { 128.7,628.7 },
          { 77.26,578.6 }, { 148.2,568.3 }, { 180,504 }
        };

        DrawSetStrokeAntialias(picasso,MagickTrue);
        DrawSetStrokeWidth(picasso,9);
        DrawSetStrokeLineCap(picasso,RoundCap);
        DrawSetStrokeLineJoin(picasso,RoundJoin);
        (void) DrawSetStrokeDashArray(picasso,0,(const double *) NULL);
        (void) PixelSetColor(color,"#4000c2");
        DrawSetStrokeColor(picasso,color);
        DrawSetFillRule(picasso,EvenOddRule);
        (void) PixelSetColor(color,"#800000");
        DrawSetFillColor(picasso,color);
        DrawPolygon(picasso,11,points);
      }
      (void) PopDrawingWand(picasso);
      (void) PushDrawingWand(picasso);
      {
        const PointInfo points[15] =
        {
          { 540,288 },     { 561.6,216 },   { 547.2,43.2 },  { 280.8,36 },
          { 302.4,194.4 }, { 331.2,64.8 },  { 504,64.8 },    { 475.2,115.2 },
          { 525.6,93.6 },  { 496.8,158.4 }, { 532.8,136.8 }, { 518.4,180 },
          { 540,172.8 },   { 540,223.2 },   { 540,288 }
        };

        DrawSetStrokeAntialias(picasso,MagickTrue);
        DrawSetStrokeWidth(picasso,5.976);
        DrawSetStrokeLineCap(picasso,RoundCap);
        DrawSetStrokeLineJoin(picasso,RoundJoin);
        (void) DrawSetStrokeDashArray(picasso,0,(const double *) NULL);
        (void) PixelSetColor(color,"#4000c2");
        DrawSetStrokeColor(picasso,color);
        DrawSetFillRule(picasso,EvenOddRule);
        (void) PixelSetColor(color,"#ffff00");
        DrawSetFillColor(picasso,color);
        DrawPolygon(picasso,15,points);
      }
      (void) PopDrawingWand(picasso);
      (void) PushDrawingWand(picasso);
      {
        const PointInfo points[7] =
        {
          { 57.6,640.8 }, { 57.6,784.8 }, { 194.4,799.2 }, { 259.2,777.6 },
          { 151.2,756 }, { 86.4,748.8 }, { 57.6,640.8 }
        };

        DrawSetStrokeAntialias(picasso,MagickTrue);
        DrawSetStrokeWidth(picasso,5.976);
        DrawSetStrokeLineCap(picasso,RoundCap);
        DrawSetStrokeLineJoin(picasso,RoundJoin);
        (void) DrawSetStrokeDashArray(picasso,0,(const double *) NULL);
        (void) PixelSetColor(color,"#4000c2");
        DrawSetStrokeColor(picasso,color);
        DrawSetFillRule(picasso,EvenOddRule);
        (void) PixelSetColor(color,"#ffff00");
        DrawSetFillColor(picasso,color);
        DrawPolygon(picasso,7,points);
      }
      (void) PopDrawingWand(picasso);
      (void) PushDrawingWand(picasso);
      {
        const PointInfo points[193] =
        {
          { 27.86,565.3 }, { 29.66,550.8 }, { 31.97,538.1 }, { 34.85,527.1 },
          { 38.09,517.7 }, { 41.83,509.8 }, { 45.86,503.1 }, { 50.33,497.6 },
          { 55.08,493.2 }, { 60.19,489.8 }, { 65.45,487.3 }, { 70.92,485.4 },
          { 76.61,484.2 }, { 88.42,483 },   { 100.4,482.9 }, { 108.4,482.2 },
          { 119.8,480.3 }, { 150.8,474.1 }, { 189.4,466.6 }, { 210.3,463 },
          { 231.5,459.9 }, { 252.4,457.8 }, { 272.7,456.6 }, { 291.8,456.9 },
          { 300.7,457.7 }, { 309.1,458.9 }, { 316.9,460.6 }, { 324.1,462.8 },
          { 330.7,465.6 }, { 336.4,469 },   { 341.3,473 },   { 345.3,477.7 },
          { 348.4,483.1 }, { 350.4,489.2},  { 352.4,495.4 }, { 355.2,500.9 },
          { 358.8,505.8 }, { 363,510 },     { 367.8,513.6 }, { 373,516.8 },
          { 378.6,519.6 }, { 384.3,521.8 }, { 396.4,525.4 }, { 408.2,527.9 },
          { 428,531.2 },   { 434.6,532.9 }, { 436.7,533.8 }, { 437.8,534.9 },
          { 437.8,536.2 }, { 436.8,537.8 }, { 434.5,539.6 }, { 430.9,541.8 },
          { 419.3,547.6 }, { 401.3,555.2 }, { 342.4,577.9 }, {325.2,584.9 },
          { 311,591.3 },   { 300,597.3 },   { 291.6,602.8 }, { 285.8,607.8 },
          { 282.3,612.3 }, { 281.4,614.4 }, { 280.9,616.2 }, { 281.2,619.6 },
          { 282.1,621.2 }, { 283.3,622.6 }, { 286.8,624.9 }, { 291.5,626.6 },
          { 297.1,627.8 }, { 303.6,628.3 }, { 310.5,628.3 }, { 317.9,627.6 },
          { 325.2,626.3 }, { 332.6,624.3 }, { 339.5,621.7 }, { 345.9,618.4 },
          { 351.4,614.4 }, { 353.9,612.2 }, { 356,609.8 }, { 357.9,607.1 },
          { 359.4,604.3 }, { 360.6,601.3 }, { 361.4,598.2 }, { 361.7,594.9 },
          { 361.7,591.3 }, { 361.2,587.7 }, { 360.1,583.7 }, { 358.6,579.7 },
          { 356.4,575.4 }, { 353.7,570.9 }, { 350.4,566.2 }, { 346.4,561.3 },
          { 341.8,556.2 }, { 336.5,550.9 }, { 330.6,545.5 }, { 323.8,539.8 },
          { 316.2,533.9 }, { 298.7,521.5 }, { 277.8,508.2 }, { 256.1,495.5 },
          { 236,484.5 },   { 217.7,475.1 }, { 200.8,467.1 }, { 185.6,460.7 },
          { 171.9,455.5 }, { 159.6,451.6 }, { 148.6,448.8 }, { 139,447 },
          { 130.5,446.2 }, { 123.3,446.2 }, { 117.1,446.9 }, { 112,448.3 },
          { 107.9,450.2 }, { 104.8,452.5 }, { 102.5,455.2 }, { 101,458.1 },
          { 100.2,461.2 }, { 100.2,464.3 }, { 100.7,467.4 }, { 101.8,470.3 },
          { 103.4,473 },   { 105.4,475.3 }, { 107.8,477.1 }, { 110.5,478.4 },
          { 113.4,479.1 }, { 116.5,478.9 }, { 119.7,478 },   { 123,476.2 },
          { 126.4,473.3 }, { 129.6,469.2 }, { 132.7,463.9 }, { 135.2,458.4 },
          { 136.6,453.7 }, { 137,449.9 },   { 136.6,446.8 }, { 135.4,444.5 },
          { 133.3,442.9 }, { 130.8,441.9 }, { 127.5,441.4 }, { 123.9,441.6 },
          { 119.8,442.3 }, { 110.7,445.1 }, { 101.1,449.5 }, { 91.37,455.2 },
          { 82.37,461.9 }, { 74.66,469.2 }, { 71.57,473 },   { 68.98,476.8 },
          { 67.03,480.7 }, { 65.81,484.4 }, { 65.45,488.2 }, { 65.95,491.7 },
          { 67.46,495.1 }, { 69.98,498.3 }, { 73.66,501.3 }, { 78.55,503.9 },
          { 84.82,506.3 }, { 92.38,508.2 }, { 107.1,511.6 }, { 118.2,514.8 },
          { 125.9,517.8 }, { 130.7,520.4 }, { 132.1,521.7 }, { 132.8,522.9 },
          { 133,524.2 },   { 132.6,525.3 }, { 131.8,526.5 }, { 130.5,527.5 },
          { 126.6,529.6 }, { 121.5,531.7 }, { 115.3,533.7 }, { 101.4,537.6 },
          { 87.55,541.8 }, { 81.36,544 },   { 76.25,546.3 }, { 71.64,549.5 },
          { 66.89,554.1 }, { 62.14,559.8 }, { 57.38,566.1 }, { 48.17,579.6 },
          { 39.96,591.4 }, { 36.43,595.9 }, { 34.78,597.6 }, { 33.26,598.8 },
          { 31.9,599.6 },  { 30.67,599.9 }, { 29.59,599.7 }, { 28.66,598.8 },
          { 27.86,597.4 }, { 27.29,595.2 }, { 26.64,588.7 }, { 26.86,578.8 },
          { 27.86,565.3 }
        };

        DrawSetStrokeAntialias(picasso,MagickTrue);
        DrawSetStrokeWidth(picasso,5.904);
        DrawSetStrokeLineCap(picasso,RoundCap);
        DrawSetStrokeLineJoin(picasso,RoundJoin);
        (void) DrawSetStrokeDashArray(picasso,0,(const double *) NULL);
        (void) PixelSetColor(color,"#4000c2");
        DrawSetStrokeColor(picasso,color);
        DrawSetFillRule(picasso,EvenOddRule);
        (void) PixelSetColor(color,"#ffff00");
        DrawSetFillColor(picasso,color);
        DrawPolygon(picasso,193,points);
      }
      (void) PopDrawingWand(picasso);
    }
    (void) PopDrawingWand(picasso);
  }
  (void) PopDrawingWand(picasso);
  (void) MagickDrawImage(canvas,picasso);
  color=DestroyPixelWand(color);
  picasso=DestroyDrawingWand(picasso);
  return(MagickTrue);
}

int main(int argc,char **argv)
{
  char
    filename[MagickPathExtent];

  MagickBooleanType
    status;

  MagickWand
    *canvas;

  if (argc != 2)
    {
      (void) printf ("Usage: %s filename\n",argv[0]);
      exit(1);
    }
  (void) CopyMagickString(filename,argv[1],MagickPathExtent);
  /*
    Create canvas image.
  */
  MagickWandGenesis();
  (void) setlocale(LC_ALL,"");
  (void) setlocale(LC_NUMERIC,"C");
  canvas=NewMagickWand();
  status=MagickSetSize(canvas,596,842);
  if (status == MagickFalse)
    ThrowWandException(canvas);
  status=MagickReadImage(canvas,"xc:white");
  if (status == MagickFalse)
    ThrowWandException(canvas);
  /*
    Scribble on image.
  */
  status=ScribbleImage(canvas);
  if (status == MagickFalse)
    ThrowWandException(canvas);
  /*
    Set pixel depth to 8.
  */
  status=MagickSetImageDepth(canvas,8);
  if (status == MagickFalse)
    ThrowWandException(canvas);
  /*
    Set output as RLE compressed.
  */
  status=MagickSetImageCompression(canvas,RLECompression);
  if (status == MagickFalse)
    ThrowWandException(canvas);
  /*
    Save image to file.
  */
  status=MagickWriteImage(canvas,filename);
  if (status == MagickFalse)
    ThrowWandException(canvas);
  canvas=DestroyMagickWand(canvas);
  MagickWandTerminus();
  return(0);
}
```

--------------------------------------------------------------------------------

---[FILE: drawtest.tap]---
Location: ImageMagick-main/tests/drawtest.tap

```text
#!/bin/sh
# Copyright (C) 1999-2020 ImageMagick Studio LLC
#
# This program is covered by multiple licenses, which are described in
# LICENSE. You should have received a copy of LICENSE with this
# package; otherwise see https://imagemagick.org/script/license.php.
#
. ./common.shi
. ${srcdir}/tests/common.shi
echo "1..1"

${DRAWTEST} drawtest_out.miff && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: input_truecolor.miff]---
Location: ImageMagick-main/tests/input_truecolor.miff

```text
id=ImageMagick  version=1.0
class=DirectClass  matte=False
columns=70  rows=46  depth=8

:0/-20.62/83.:3-92-80-91.80-80-7/,5-*4,)5-*5-*1-'1.'41*74-96/?:/F?3JB4LA2NB2UA2tD4�C3�A5�E=�DG�CF�=B�<@�@;�?/�?-�@-�A+�@+�?.�=,�=+�=*�?.�?3�B3�D6�F9R:/:5372172/61.30,//-0/-3,-6+-P78�IG�bn�|�lp�PHnRLauw|���z|lYVS/.,0/-50-71-81,80,6/,81-81-81.7.,4-*4,*6/+6.+3/*30*41+63-750>8-E=2H?1I>.K@/MD3iE4�@.�<-�G<�DG�BE�<A�<@�A;�?-�?+�?,�@+�?+�>.�=,�=*�;*�>-�>3�@4�D8�H;D7,95593162/62.11--1.00.5/.2*,E21xA5�Y\�}�cl�J>kK@\]^g��~lp_YWS,,,,-+0/,1.+2,(2-*0,+2,+2++2,+2,+1,+1,)3-,3-,3/,31,40,52-750:3,>6-@6-C8-H;/EE5UD4m=+�9(�E4�H=�E@�<>�>=�A0�@*�?-�>-�?,�>)�>,�=-�<-�;.�?/�B1�@8�GD�WN<?5;4193.53.14/-4.,40/3/12000.3-+I.!lMN���kq�H==1X54H>FFISIYZO,-/+-/.--/-)/*'-+(,**,**.++.++.++/++/--0,,0-./-*2.,2.+2-,30.82/<4/>4/A5-F91H>7Q<5_70y7-�;/�A3�E9�E@�HA�B/�@,�>-�=/�=-�=+�<+�<,�<.�<2�C7�G:�E@�g_��yWeWCB875+/1*.1+-0,-0//0.02./2./-24*,gcb���~��ip�Y\o`pr���|��_eQ,/2+/2..0-.--+),*++)+('(**+,*+,*+*))*()-+,.-./,+0,+.*)/++0--811<32;21>0.A2/A73B:6K62h7/�=0�>5�A3�D7�G<�?3�?,�=+�;-�<-�;,�9)�9*:.?7�G@�E>�UR��{���r�pSZG<@301(-)'2,+2,+0,*0-+0/+2*10)(eqR�������ʳ�ǰ���������YdJ.0.//-/1.21.30-3/,2-*-*+,+,*)-+(,-',+(),*)--+/-,.+*/+)4,)6/*;3.=40;1-;/.>/.>3,59/93,O,'i:-�A1�@1�;-�B2�>2�</�=.�?/�</�9,{;,v:*};0�G;�KD�QO��p������w�y\{ZN^G=:32'(/')-(+0(,2(/1+00*0+'[f@��v��v�Ɍ�Ó��~���v�pO[D23-34-53.961961:2.80-3.,300-.0/(/1)./*,1.*10*01./004/+;1+A5,C8/A90=5-;0/<1/E1-R).F*.70)R/(j9.�:7�94?5�B6�A1�>-�:+�;*v>)v8,s9-{@4�G>�NE�dVz�q{�����v�|e�gd�ePfP4=0*&#.$&+**)+,'+/''-)$"W\H~�j{�j~�o�o}�t~�{o�lLVD782782994<:5@=8B:8A95=73<75:549009//61.62.63.641973?72B90H=1J>4H=4B80@61?62<94C54A50<6*E5'c6-�=;�BA�C;�>6A5~:/y;/u>.z4)�PL�[VpJ9kS@s`IzX�f`�zr�����~��v��xo�oXiM?;)3)"%+!+/&:&*C))TN:hqRh�Wk�\n�ck�hs�tt�th�dNXC8939:4>>8A?:D?:FA<EA:E@:G?8E=4D;1C:3C:3<8095/94/<70B<0I=0OA2P@5K<4E:1A:1=<3G70�EJ�GI�C:�KH�F9�?3�C5�E1�@2�>B�CEvC9y:4�<H�EG�UPpYC`jH�lS�SZ�(H�)K�@V�M_�Yh�fn�jr�_m�Wk�Pb�FOR.(>3(G@-e^:w�\n�\m�Ys�d~�{������d}_S_G671681==8B@;FA?HC>HC>JD<MB7J=0H<-F=/E;0A91<71:7.>9,E</M?/OA0O>1K;1D:/>=17=0�B@�K]�35�;#�?5�;0�>3�D7�:(�>2�>8�8?�<<�D?�7;�.'�B:�dO�cJ�c^�;E�BC�FO�.E�,H�0T�4\�:h�:o�Ar�Go�Zx�[fa=3HC/vd�����������������Ӱ��g{eWgL330551883=<6DC9GG>JI;MI6IE7MHJH@9E;+C9-?80>83=71>94@=9IA6P@-H?-K81C745=0@?/�I@�4+�4!�A&�:$�6'�=2�A1�@2�@4�8)�1+�++�0)�6%�5!�9,�UI�UQ�AK�?A�;.�E;�AD�>H�AQ�=V�>h�>q�Ew�Jn�Wx�Y�]n�nd�����������������������҅��u�n10-/.,43/892>?5GD;OK8MK4XWW���|x�[ToF?O94462&52):9.B=-K@/P@/C;*:4)040B1-�6<�;/�<'�;%�>,�=1�;1�9*�:+�?2�3*�4,�8.�1+�/(�5 �4!�9,�?6�CA�A>�>3�9(�=-�E@�FK�DK�DX�Bb�Jt�K}�Mz�Tt�Cc�{��_T������������������������������:8163-30+74,<;2IA6VJ9TH:dar��䬲���쏏�nm�LIX@?M<99A=(BC.8A9:EQEUaFSRaG<�F7�=+�A-�;(�6*�80�:4�82�:3�;2�?7�1'�-(�-(�2(�7!�7"�5(�C<�VM�>2�:#�:)�@7�HF�GH�FJ�O\�F`�Jn�Rz�Xz�Uq�Sg�`p�KU᪤���������������������������D@5A=3;6-52(:5/F=7TG6WF7]Uj��ޫ�����������|�f\�RLs7:C:97RJN�s�����]{�KP�<'�9#�:*�;-�<3�;3�61�>9�<7�8/�D9�?4�))�++�2,�2%�<(�:*�7-�LH�C@�9$�9(�>2�QI�E>�NI�QS�Ta�Vn�No�Ux�Wo�Zi�We�OT�tn���������������������������OI;MG:F@5?90=60A=8ME5SD.WLS�����������������틍�oz�ae��N_�OW�L]�HR�;>�>>�>5�>/�?2�>4�9/�3+�7/�8/�3)�3$�9"�>0�8;�05�20�54�53�7+�>/�PJ�EI�=3�8+�<-�C2�=-�H=�NJ�\a�fv�Pm�Zu�rx�bp�{��ueVPA���������������������������WN?VM?PI:KB4F<1E@7LG5SG.VNQ����������������������v��AN�<?�;7�@1�F;�=A�9<�@:�E9�6(�2+�41�;/�7)�4!�6!�7&�5)�5+�8.�42�-5�*0�1)�5$�LA�HI�MK�8.�:(�;'�;*�</�@3�^V�nm�gp�gq�tr�ou�z���|AQ3���������������������������[PA[OAYM?TJ:TG9NG<RJ9WK4XQT����ԕ�䙢씟؈�Ї���i��=P�@:�>C�?F�>;�GF�>A�?;�=1�?0�;+�:.�93�3/�4.�8*�;+�;6�<9�9%�9!�3&�5/�7+�8&�=)�>5�@B�US�G=�9)�:*�<-�<.�:*�VG�mj�ag�bm�nq�dl�Wpu�iXnE���������������������������[N>ZN>[N=XM<ZL<WK?XL<ZL8ULGd_uwx�������{{�fm�|Rb�;F�3?�E>�CN�BG�@5�C;�41�B5�;)�9%�:%�8(�4+�13�,3�-1�.8�(>�(0�0'�8(�;2�=4�D6�6&�5)�75�./�4*�5*�J>�>1�6*�:+�7&�H>�qr�s~�r{�s{�Ve�Da��}}�g�̮��Ưʪ�������ǚ�պ������[L<[L<\L<YI;ZK;[L>^M<^P<[NAYLI^Sdme��ě~��q��@G�>+�@9�<@�BJ�<7�9(�B8�;8�D:�7$�;(�8'�4'�9.�4'�,$�)'�%2�6�'6�<D�1:�0:�+.�85�GG�64�;6�5*�8&�8+�QG�<3�91�:3�8+�8-�kk����z��r�Md�?\��^g�Q|�\a~Qe�Yy�h��t��y�����ŵ�[K:[K:YK:YI9[K:]J<^K<^O;^O;_N:_KHaWw|w���ew�4K�@F�C@�BG�C@�;.�8&�@6�8;�ME�PA�6(�4*�60�1/�19�-<�*<�-H�.W�Qc�\m�8O�05�7&�C6�SN�C@�9.�7$�;%�8)�FB�83�31�00�91�4'�\W����|��k|�Ha�>UYa7e�N��d~�m�p��o��p��o��q���ÿ�\K7\K6\K6]L7]L9]L;^M=]P=]P=aM:cG>g]q������uq�KU�?Q�=G�<=�>4�;*�>/�83�3+�9'�MA�A3�:.�79�2>�"/� -�!+�%7�;V�cp�NS�:5�6$�-�:0�86�IE�;0�8+�8+�8/�J@�3.�.1�-0�2,�4%�ME����{��Yt�?a�@SIY1p�[��o��q|�f~�f�k~�e��n������^M:^M:^M:^M:^M:_L7^N9VNAaXYo`mmdppx���ꙃ͹v|�d\�MU�9A�77�B2�:+�G>�B9�6+�6'�4.�D7�<.�03�DN�CG�/-�,(�23�>C�?C�78�3.�OJ�OQ�IG�UU�EA�B:�<7�2=�7?�>:�1*�20�.2�0.�4%�H<����q��Fh�<d�AGNb<r�Zy�cu�`v�_z�d{�d{�Z��h��vl�g_O=_O?_O>_O=_O=`P7\L9_[a}|��}�qv�|�ƚ�Ǻ��ȶ��pR�LA�HJ�79�:2�7.�I?�fX�@3�2+�1,�=1�7)�-)�55�RX�JQ�QV�V[�@B�9?�-7�JV�oz�fv�RN�53�A<�E<�40�,:�5?�63�4*�2/�.2�/-�5)�<3����bw�>c�Ad\;/L_>u�^{�co�Wr�Xx�^y�[w�V��a��he|V[M=_P@_RB`RC`R@\OBcYaww�w|�cj�zz֯�������諸���yd�lg�WZ�6:�63�:1�OA�XI�1'�><�@7�0%�-'�3*�95�SW�Vb�do�ag�/7�(6�FS�^f�T[�73�64�82�80�:5�;;�65�5+�6*�0-�/4�0/�9.�82�w��Rp�<d�J[=<&AJ0h~St�Xh�Lm�Qs�Zs�Tl�Mb�ENj4Ia4TH8YL<_RBbVD`S?f]b{y�tz�]f�lv�������������·����oje�jd�yu�ge�DA�=5�<1�B2�<-�GF�IF�70�60�9+�:&�=6�:A�[g�W^�73�BI�?F�79�56�51�30�:/�;3�65�78�64�6-�7(�1+�35�0/�4*�DB�hu�;d�@h�MGRP<EB-O_9i�Le�Dg�Kn�Uh�L^�EY}CWoB[sDDB6JE<\M>`S>e_Xzt�sp�]_�ii���ߝ�ޢ�֠�֞�Ε��pg}^VR|SH�YQ�ys��|�^Z�6-�5#�;*�:0�7,�9/�8/�<*�@1�=4�73�PL�KB�6$�/0�(:�'?�:�#8�.6�:5�<5�75�35�40�7)�9&�6&�5-�5)�4'�V\�Pk�8e�@X95#AB378!QZ4dyN_�Ac�Dl�Nh�Gc�Ic�JfIbD47-::4OD;VL=gellj�QQ�[]�y{Ή�݌�ш�͈�ҍ�ȇ��~Zj\[LpWD�SV�fk���z�;-�;#�;)�6+�;+�6(�:-�8(�:-�:/�:0�?5�:.�1'�/7�+=�*>�$:�&9�5=�:6�;4�54�48�6/�7)�8&�6$�9&�;%�=4�Wl�7c�Cjk3=#/%/4^Y2���s�`]�>m�Kp�Qk�Hi�Me�Jf�Hg�G*0&+0+975EC=Z\i\]�[Z�y|օ�낂ځ�ʃ�ҋ�ۍ��~x�sWR`_Hd_C�WP�Zc�nj�K@�7&�<'�8+�1(�>+�:(�G;�9+�:)�7(�7(�</�;0�6;�1?�-;�36�58�7;�65�85�:8�78�6;�84�8*�:)�:'�=!�<&�KM�Bg�6g�CO3648+/DN)��y�՚q�\]�=r�No�Rf�Eg�Me�Kf�Gk�J.2&+.(01+:=0LONXVmnl���ꓐ��ф�Ǎ�Ύ���w�la]^]Gf]Ij\E�YC�RQ�==�0+�7&�7&�5+�5)�=+�<+�D9�8)�:(�9(�4(�2)�;4�8<�/:�EJ�VQ�A=�82�84�88�8<�7<�59�;6�8)�=*�=*�9#�5)�P`�=_�I]K@1-3%J3'��e�Ԍ��|Kc9`=l�Id�Ge�Ck�Oi�Of�Ep�P@>0>=4<=2AE*LM:UTAecg������z�ws�z�yon_WlYGh\Kj^N_O�K<�5.�0+�4*�8$�=$�9,�;)�7&�=5�IB�9'�:)�9-�<4�;7�:8�86�HI�ZX�C=�:7�92�84�68�8>�6=�7;�?7�;+�;'�;(�6#�ID�Uh�MX�]O39"FO)u�_��i��jIT<<H,g~Cj�Fa�Ek�Kl�Po�Qm�Mv�VUM>VM?VN?VP=\RC`WBbYKmckwj|pdm]W[WUR]VGfZFn_HjdO�ZO�RG�:,�4+�7/�7.�6*�9)�:,�<+�5"�9-�<4�H:�B9�>9�<<�68�;8�=2�9*�;-�<5�6:�6:�86�92�96�88�;=�@8�;,�;(�8$�6'�YZ�TV�YR�cK`x;��qv�YO];;=.23+;C1fGo�Jj�Mm�Rj�Gq�Kx�Uq�WcZKe[Ke[Kd[Le[Mg_Jh_Hg^Mg]Lf\I`ZGQN=LH7SP>[ZF__O�aY�JL�40�=)�:*�9+�8*�7*�:+�=/�5�?)�7*�9/�49�6<�6;�5<�64�8&�9&�:)�>4�98�67�85�<3�>9�>>�@;�8+�:(�:(�7"~:*�RJ�TI�\S�n]��sScB'258176/9909C0g�Kw�Qp�Sp�Oo�Ix�Uw�Y`�Jh_Pi`Qi`Qi`Qh_PkbTjbSi`PibLibHhbK`ZFLJ6@E4@H8CJ>UM;�XO�DF�:,�7%�8)�:)�:(�9)�;/�6�9�8*�;5�@E�>;�61�:5�9-�>*�A+�<'�6)�<5�=7�?6�D9�A9�83�8*�8'�<)};(w3"�A3�SG�ZN�YS�YMAM+'2%7><KM@=;(7:/8@-h�Kv�Pq�Pp�Jy�V}�bb�I`�Li`Qi`Qi`QjaRjaQk_Zk__kaVkaTkaXlaRkbNZVDDF8<C55C1?C)�ZF�]Y�JM�;0�9+�<0�=1�>2�@:�>3�C3�HA�IE�EA�=/�F2�C1yA-�:+�<,�=,�8*�:.�;0�?1�<.�6*�7,�<,;*{;,s9*v5(�H;�OB�SN�VW�o_fvIGV4^kQKQ5:;#88/8B/i�Lw�Pp�Nr�P}�`f�Nb�Jb�Mi`Qi`Qh_PlcTkbSmbWlbUldOldPlbVmbUmcThaQVP@EA18A'�K@�>@�NO�im�NJ�C<�E?�HC�IF�GK�LK�IH�AC�BA�@=�=0�A2�<1�:3;2~;1z;/z;+{:+�8,�8,�8(�:*�<,8+{3(y6,p4)v=1�Q@�TG�QM�[SWX@Oe=`vFCW-6@*:<279/8@-_yAx�Qp�Qw�Yj�S\�Gg�Ja�Ii`QjaRlbTjaRjaRkbSkbSkbRlcSlcTpbRpaUf_RfaP_YCA@%rM<�EC�BC�ON�LL�CB�@9�E;�DE�@E�CE�DC�A>�B>�A<�9/�=/�<3�82�;/�;.:-|:.|:/{91{8/|9.z:.x9/u8.r6+o4*l2'v@6�TL�QM�UMyeOZnJUmDM_:9C(89,;=34;089)Vd>t�Tx�\r�\Z�C_�Ie�L\�GhaQibRjdSibRibRjbSkbSkbSlcTlcTmaTfZPspi������}{j7>+3<(<=/?;.^B5�HE�AE�><�DA�DD�DD�FD�F?�F=�D>�=4�=,~>/�9.�:+�:+:,~:/~:0{90y8/w9/v90t:.q6-n3+k4)e1%s=2�RN�YR_R_\HES;2?);E0BJ69A04;.49578,LW3r�S{�^`�IZ~Ca�Ia�KX|GhbRibRkcSibRibRjbSkbSlcTlcTkbRe]S��|�����������ՠ�|CJ25?+:72*0+Z?>��XU�9:�@D�BD�AB�C?�E;�B:�B8�;,=,�<+�:+}9-}9/}:0|:1w:3s8/p6,o8-n7+n6/k4,g3*`.$p8/�UQz\ONO>5@1/5,330.3+4>1;K80>.-2/54+AM/s�Yn�TTu?Z|E_�L_�IWwHhcShcShcShcShcSjcSlcTmdUmdUlbQlje�����������������̝�KO1=6)OHF����������qq�=:�@<�@@�>?�B=�@<�C<�;1�=/~<,:.{9/|90{<3z<4p;1k8-i7-h8-h8.k70i6-a0'Y+m=4vTNG@3.9)1<.7:2686280-9*6D29H616,,-"@J1z�m^�MQo<VsB\yGb�LQjEgdSgdRgdRgdRfdRicRlcUmdUmdSjaQddd���������������������rnWAJ<���������������޲��OA�80�A<�B=�E@�?;�<3�=3~<1~:.|9/|90z92v80j8/h8/f7,e7-e7,i60i70f6.h;2nLB88314,37-56+37)/9+09*.8*/8,8A2;C201$DM:o�jGj=Lk<Li;WuFb�NCV;heVheWheWheWheWieVkdZneWhfQnlh����������������������ٸpsWo{j��������������������ػj^�8+�@6�H9�E6�B7�?6�;2}92x8/u7.s7.o5+j70h70f5/g6/i70l71l</gF4�q_nk[)2(17.07-16*05,/3-/3-/4..1,.5.2?43@3@M:IX@BU8Mg@Gb9XrJ]xT4D5heVheVheVheVheVgeUkd[ndXghP}�~����������������������ҷ������������������������������ǣ��E4�9.�<9�:;@=pB<q@6q?5o?4j<2h:1q62m51j7/g91g>4fF9cJ5_M5iQYF*1(07,17-06,/3,-2-.3--2,,0+,3,)4--8-2>-2>*6C.DV;H]=^qRZlS,8.heVheVheVifWifWjeVlc\ngZhiQlup����������������������������������������������������������Լ�kS�?.�6*8,oA3r=7s?9sA;o?8n=6q94l:3d=2^>2P;+UP9]X=]]?nv\2@+27/28.39/28-/5,.3-.3-,1+*/)+0++3+*4,-5,7@59C43>,>J4\hTQ]O+4-gdUheVifWifWifWjeVnc\lhZflShwo����������������������������������������������������������������ì�u]yH1e6"e3)j90l?4i>4h>2cA7_D5YG5e]GEF/9C'EI+ppR\`G29'7=57=37>48>38<57;66;5271.3-,1+(.(*.*,1,/2/=D==J81?(BP<EPD/90ddSgdUhgWieWhfWkeVnd\lhZdkRdwo����������������Ҷƿ�������������������������������������������������������ѽ�hS;XD,]K2\L4VO:QN7MO8^gK@L0=E*GJ+igJ`YDFF5:?5:>58>49?59@8;A;:>9:@:9=87;6062,1,+/.)-.)3)6J29L38I1;K8/;.\gO_iRgkWihXlfXlgYkf[hgYelY|��������������������ɾ����������������������������������������������������������mgKRK-UO2SO3PN4LO6HO5EN.LS0]e@aeFVV=WT<UR9MI6CB5<?58A58C59A79A6:B7;C8<E<;E:9@55=66D/G`5Gb<:M8@R:H\A4B1
```

--------------------------------------------------------------------------------

---[FILE: Makefile.am]---
Location: ImageMagick-main/tests/Makefile.am

```text
# Copyright 1999 ImageMagick Studio LLC, a non-profit organization
# dedicated to making software imaging solutions freely available.
#
# You may not use this file except in compliance with the License.
# obtain a copy of the License at
#
#   https://imagemagick.org/script/license.php
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
#  Makefile for the ImageMagick validation suite.
TESTS_CPPFLAGS = $(AM_CPPFLAGS)

TESTS_CHECK_PGRMS = \
  tests/validate \
  tests/drawtest \
  tests/wandtest

tests_validate_SOURCES  = tests/validate.c tests/validate.h
tests_validate_CPPFLAGS = $(TESTS_CPPFLAGS)
tests_validate_LDFLAGS  = $(LDFLAGS)
tests_validate_LDADD    = $(MAGICKCORE_LIBS) $(MAGICKWAND_LIBS) $(MATH_LIBS)

tests_drawtest_SOURCES  = tests/drawtest.c
tests_drawtest_CPPFLAGS = $(TESTS_CPPFLAGS)
tests_drawtest_LDFLAGS  = $(LDFLAGS)
tests_drawtest_LDADD    = $(MAGICKCORE_LIBS) $(MAGICKWAND_LIBS)

tests_wandtest_SOURCES  = tests/wandtest.c
tests_wandtest_CPPFLAGS = $(TESTS_CPPFLAGS)
tests_wandtest_LDFLAGS  = $(LDFLAGS)
tests_wandtest_LDADD    = $(MAGICKCORE_LIBS) $(MAGICKWAND_LIBS)

TESTS_XFAIL_TESTS = 

TESTS_TESTS = \
  tests/cli-colorspace.tap \
  tests/cli-pipe.tap \
  tests/validate-colorspace.tap \
  tests/validate-compare.tap \
  tests/validate-composite.tap \
  tests/validate-convert.tap \
  tests/validate-formats-disk.tap \
  tests/validate-formats-map.tap \
  tests/validate-formats-memory.tap \
  tests/validate-identify.tap \
  tests/validate-import.tap \
  tests/validate-magick.tap \
  tests/validate-montage.tap \
  tests/validate-stream.tap \
  tests/drawtest.tap \
  tests/wandtest.tap

TESTS_EXTRA_DIST = \
  tests/common.shi \
  tests/rose.pnm \
  tests/input_256c.miff \
  tests/input_bilevel.miff \
  tests/input_gray.miff \
  tests/input_truecolor.miff \
  tests/sequence.miff \
  $(TESTS_TESTS)

TESTS_CLEANFILES = \
  tests/*_out.*
```

--------------------------------------------------------------------------------

````
