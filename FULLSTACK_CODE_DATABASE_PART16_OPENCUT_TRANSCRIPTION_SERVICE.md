---
source_txt: FULLSTACK_CODE_DATABASE_PART16_OPENCUT_TRANSCRIPTION_SERVICE.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART16 OPENCUT TRANSCRIPTION SERVICE

## Verbatim Content

````text
========================================
FULLSTACK CODE DATABASE - PART 16
OPENCUT - TRANSCRIPTION MICROSERVICE (MODAL + FASTAPI + WHISPER + R2)
========================================

Source folder:
- C:\Users\CPUEX\Desktop\pj\OpenCut-main\OpenCut-main\apps\transcription

This part extracts a reusable pattern for a GPU-backed microservice that:
- Receives a request (filename + optional client encryption info)
- Downloads audio blob from object storage
- Optionally decrypts (AES-GCM) if client provided key/IV
- Runs Whisper transcription
- Deletes the blob (privacy)

========================================
1) MODAL APP + FASTAPI ENDPOINT
========================================

`apps/transcription/transcription.py` uses:
- `modal.App("opencut-transcription")`
- `@app.function(...)` to define runtime image, GPU, timeout, secrets
- `@modal.fastapi_endpoint(method="POST")` to expose HTTP endpoint

Runtime image includes:
- apt: ffmpeg
- pip: openai-whisper, boto3, fastapi[standard], pydantic, cryptography
- GPU: A10G
- timeout: 300s

Pattern:
- Define infra close to code; deploy as serverless function.

========================================
2) REQUEST CONTRACT (Pydantic)
========================================

Request model:

```py
class TranscribeRequest(BaseModel):
  filename: str
  language: str = "auto"
  decryptionKey: str = None
  iv: str = None
```

Pattern:
- Minimal contract; filename points to storage object.
- Optional encryption info enables “true ZK” uploads.

========================================
3) OBJECT STORAGE INTEGRATION (CLOUDFLARE R2 via S3 API)
========================================

The function initializes an S3 client with:
- endpoint_url: `https://{CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`
- aws_access_key_id / aws_secret_access_key
- region_name='auto'

Then:
- download_file(bucket, filename, temp_path)
- delete_object(Bucket=bucket, Key=filename)

Pattern:
- Use R2 as S3-compatible storage for ephemeral processing.

========================================
4) OPTIONAL CLIENT-SIDE AES-GCM DECRYPTION
========================================

If request includes `decryptionKey` and `iv`:
- Base64 decode key + iv
- Parse AES-GCM tag from last 16 bytes
- Decrypt ciphertext

This matches the web app’s browser-side AES-GCM utility.

Pattern:
- Client can upload encrypted blob to R2
- Server decrypts only with key user supplies
- If key never leaves client, server cannot decrypt

========================================
5) WHISPER TRANSCRIPTION
========================================

- `whisper.load_model("base")`
- `model.transcribe(temp_path)` or with explicit language

Returned payload:
- text
- segments
- language

Also applies a timing correction:
- shifts start/end earlier by 0.5s

Pattern:
- Post-processing step to correct systematic model timing skew.

========================================
6) PRIVACY / CLEANUP
========================================

- Always deletes temp file
- Deletes blob from R2 after transcription

Pattern:
- Ephemeral processing pipeline:
  upload -> process -> delete

========================================
7) DEPLOYMENT STEPS (from apps/transcription/README.md)
========================================

- create venv
- pip install -r requirements.txt
- `modal setup`
- `modal run transcription.py`
- `modal deploy transcription.py`
- configure Modal secret: `opencut-r2-secrets`

Environment required:
- CLOUDFLARE_ACCOUNT_ID
- R2_ACCESS_KEY_ID
- R2_SECRET_ACCESS_KEY
- R2_BUCKET_NAME

========================================
END OF PART 16
========================================

````
