---
source_txt: FULLSTACK_CODE_DATABASE_PART22_OPENH264_PUBLIC_API_USAGE.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART22 OPENH264 PUBLIC API USAGE

## Verbatim Content

```text
FULLSTACK CODE DATABASE — PART 22 (OPENH264)
PUBLIC API USAGE PATTERNS (ENCODER/DECODER INTEGRATION)

PRIMARY REFERENCE
- openh264-master/openh264-master/codec/api/wels/codec_api.h
- Related enums/structs:
  - codec_def.h (formats, return codes)
  - codec_app_def.h (options, decoding state, error concealment)

NOTE
Avoid copying large header blocks; below is a reusable “integration recipe” distilled from the API.


1) API SHAPE (REUSABLE DESIGN)
- The library exposes both:
  - C++ interfaces (`ISVCEncoder`, `ISVCDecoder`)
  - C vtable structs for C consumers
- Explicit Create/Destroy functions:
  - `WelsCreateSVCEncoder`, `WelsDestroySVCEncoder`
  - `WelsCreateDecoder`, `WelsDestroyDecoder`
- Runtime option system:
  - Encoder: `SetOption(ENCODER_OPTION, void*)` / `GetOption(...)`
  - Decoder: `SetOption(DECODER_OPTION, void*)` / `GetOption(...)`

This is a strong, reusable pattern for C/C++ libs:
- stable ABI (void* options)
- forward-compatible extension points (new option ids)


2) ENCODER INTEGRATION (MINIMAL FLOW)

A) Create encoder
Pseudo:
- create encoder handle
- check rv

B) Initialize with base params or extended params
Two common patterns:
- Base init (`SEncParamBase`) for simple usage
- Extended init (`SEncParamExt`) via `GetDefaultParams(&param)` then mutate

C) Set runtime options
Common options include:
- data format (typically I420)
- trace level / trace callback
- bitrate / max bitrate
- framerate
- IDR interval

D) Encode loop
- Fill `SSourcePicture`:
  - width/height
  - color format (e.g. I420)
  - stride array
  - planes pointers
- Call `EncodeFrame(&pic, &frameInfo)` per frame.
- If output is not “skip frame”, handle NAL units from `SFrameBSInfo`.

E) Tear down
- `Uninitialize()`
- `WelsDestroySVCEncoder()`


3) DECODER INTEGRATION (DECODE / NO-DELAY / PARSE-ONLY)

A) Create + Initialize decoder
- Create decoder
- Set `SDecodingParam`:
  - choose bitstream type (AVC vs SVC)
  - optionally enable parse-only mode
- `decoder->Initialize(&param)`

B) Decode modes
- Recommended low-latency path:
  - `DecodeFrameNoDelay(pSrc, len, yuvPlanes, &bufferInfo)`
- Alternative / legacy:
  - `DecodeFrame2(pSrc, len, yuvPlanes, &bufferInfo)`
  - “flush” behavior can be achieved by calling DecodeFrame2(NULL, 0, ...) depending on mode.

C) Output validity contract
- Decoding functions may return errors; output frame validity is indicated by:
  - `bufferInfo.iBufferStatus == 1`
- Always check this before consuming `pDst` planes.

D) Parse-only mode
- Uses `DecodeParser(pSrc, len, &parserInfo)`
- Intended for workflows such as:
  - rewrite / transcode SVC syntax to AVC
  - feeding to HW decode pipelines

E) Options and performance tuning
- Use decoder options to configure:
  - thread count (if supported)
  - error concealment strategy
  - log level / callback


4) ERROR / STATUS MODEL
- Many APIs return:
  - `CM_RETURN` (encoder) or `DECODING_STATE` (decoder)
- Decoder `DECODING_STATE` includes flags for:
  - “need more data”
  - bitstream errors
  - out-of-memory
  - output buffer too small

Reusable integration rule:
- Treat return codes as “control plane”
- Treat buffer status and out structs as “data plane”


5) DATA FORMAT / COLOR FORMAT ENUMS
- `EVideoFormatType` includes common RGB and YUV formats.
- Typical integration uses I420 for both encoder input and decoder output.


6) LOGGING HOOKS (HOST INTEGRATION)
- Both encoder and decoder offer:
  - trace level option
  - optional trace callback + context pointer

This is a reusable pattern for libraries embedded in large products:
- host owns logging
- library pushes structured messages


7) PRACTICAL CONSUMER EXAMPLES IN REPO
- CLI readme: openh264-master/openh264-master/testbin/CmdLineReadMe
  - shows encoder/decoder CLI invocation with config files
- Browser integration example:
  - openh264-master/openh264-master/module/gmp-openh264.cpp

END PART 22

```
