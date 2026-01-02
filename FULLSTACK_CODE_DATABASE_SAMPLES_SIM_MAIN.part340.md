---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 340
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 340 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: voice-interface.tsx]---
Location: sim-main/apps/sim/app/chat/components/voice-interface/voice-interface.tsx
Signals: React

```typescript
'use client'

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { ParticlesVisualization } from '@/app/chat/components/voice-interface/components/particles'

const logger = createLogger('VoiceInterface')

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic
    webkitSpeechRecognition?: SpeechRecognitionStatic
  }
}

interface VoiceInterfaceProps {
  onCallEnd?: () => void
  onVoiceTranscript?: (transcript: string) => void
  onVoiceStart?: () => void
  onVoiceEnd?: () => void
  onInterrupt?: () => void
  isStreaming?: boolean
  isPlayingAudio?: boolean
  audioContextRef?: RefObject<AudioContext | null>
  messages?: Array<{ content: string; type: 'user' | 'assistant' }>
  className?: string
}

export function VoiceInterface({
  onCallEnd,
  onVoiceTranscript,
  onVoiceStart,
  onVoiceEnd,
  onInterrupt,
  isStreaming = false,
  isPlayingAudio = false,
  audioContextRef: sharedAudioContextRef,
  messages = [],
  className,
}: VoiceInterfaceProps) {
  const [state, setState] = useState<'idle' | 'listening' | 'agent_speaking'>('idle')
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(200).fill(0))
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>(
    'prompt'
  )
  const [currentTranscript, setCurrentTranscript] = useState('')

  const currentStateRef = useRef<'idle' | 'listening' | 'agent_speaking'>('idle')
  const isCallEndedRef = useRef(false)

  useEffect(() => {
    currentStateRef.current = state
  }, [state])

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isMutedRef = useRef(false)
  const responseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isSupported =
    typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

  const setResponseTimeout = useCallback(() => {
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current)
    }

    responseTimeoutRef.current = setTimeout(() => {
      if (currentStateRef.current === 'listening') {
        setState('idle')
      }
    }, 5000)
  }, [])

  const clearResponseTimeout = useCallback(() => {
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current)
      responseTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isPlayingAudio && state !== 'agent_speaking') {
      clearResponseTimeout()
      setState('agent_speaking')
      setCurrentTranscript('')

      setIsMuted(true)
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = false
        })
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (error) {
          logger.debug('Error aborting speech recognition:', error)
        }
      }
    } else if (!isPlayingAudio && state === 'agent_speaking') {
      setState('idle')
      setCurrentTranscript('')

      setIsMuted(false)
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = true
        })
      }
    }
  }, [isPlayingAudio, state, clearResponseTimeout])

  const setupAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      })

      setPermissionStatus('granted')
      mediaStreamRef.current = stream

      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        audioContextRef.current = new AudioContext()
      }

      const audioContext = audioContextRef.current
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8

      source.connect(analyser)
      analyserRef.current = analyser

      const updateVisualization = () => {
        if (!analyserRef.current) return

        const bufferLength = analyserRef.current.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyserRef.current.getByteFrequencyData(dataArray)

        const levels = []
        for (let i = 0; i < 200; i++) {
          const dataIndex = Math.floor((i / 200) * bufferLength)
          const value = dataArray[dataIndex] || 0
          levels.push((value / 255) * 100)
        }

        setAudioLevels(levels)
        animationFrameRef.current = requestAnimationFrame(updateVisualization)
      }

      updateVisualization()
      setIsInitialized(true)
      return true
    } catch (error) {
      logger.error('Error setting up audio:', error)
      setPermissionStatus('denied')
      return false
    }
  }, [])

  const setupSpeechRecognition = useCallback(() => {
    if (!isSupported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {}

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const currentState = currentStateRef.current

      if (isMutedRef.current || currentState !== 'listening') {
        return
      }

      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript

        if (result.isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setCurrentTranscript(interimTranscript || finalTranscript)

      if (finalTranscript.trim()) {
        setCurrentTranscript('')

        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop()
          } catch (error) {
            // Ignore
          }
        }

        setResponseTimeout()

        onVoiceTranscript?.(finalTranscript)
      }
    }

    recognition.onend = () => {
      if (isCallEndedRef.current) return

      const currentState = currentStateRef.current

      if (currentState === 'listening' && !isMutedRef.current) {
        setTimeout(() => {
          if (isCallEndedRef.current) return

          if (
            recognitionRef.current &&
            currentStateRef.current === 'listening' &&
            !isMutedRef.current
          ) {
            try {
              recognitionRef.current.start()
            } catch (error) {
              logger.debug('Error restarting speech recognition:', error)
            }
          }
        }, 1000)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'aborted') {
        return
      }

      if (event.error === 'not-allowed') {
        setPermissionStatus('denied')
      }
    }

    recognitionRef.current = recognition
  }, [isSupported, onVoiceTranscript, setResponseTimeout])

  const startListening = useCallback(() => {
    if (!isInitialized || isMuted || state !== 'idle') {
      return
    }

    setState('listening')
    setCurrentTranscript('')

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        logger.error('Error starting recognition:', error)
      }
    }
  }, [isInitialized, isMuted, state])

  const stopListening = useCallback(() => {
    setState('idle')
    setCurrentTranscript('')

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        // Ignore
      }
    }
  }, [])

  const handleInterrupt = useCallback(() => {
    if (state === 'agent_speaking') {
      onInterrupt?.()
      setState('listening')
      setCurrentTranscript('')

      setIsMuted(false)
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = true
        })
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch (error) {
          logger.error('Could not start recognition after interrupt:', error)
        }
      }
    }
  }, [state, onInterrupt])

  const handleCallEnd = useCallback(() => {
    isCallEndedRef.current = true

    setState('idle')
    setCurrentTranscript('')
    setIsMuted(false)

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch (error) {
        logger.error('Error stopping speech recognition:', error)
      }
    }

    clearResponseTimeout()
    onInterrupt?.()
    onCallEnd?.()
  }, [onCallEnd, onInterrupt, clearResponseTimeout])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        handleInterrupt()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleInterrupt])

  const toggleMute = useCallback(() => {
    if (state === 'agent_speaking') {
      handleInterrupt()
      return
    }

    const newMutedState = !isMuted
    setIsMuted(newMutedState)

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !newMutedState
      })
    }

    if (newMutedState) {
      stopListening()
    } else if (state === 'idle') {
      startListening()
    }
  }, [isMuted, state, handleInterrupt, stopListening, startListening])

  useEffect(() => {
    if (isSupported) {
      setupSpeechRecognition()
      setupAudio()
    }
  }, [isSupported, setupSpeechRecognition, setupAudio])

  useEffect(() => {
    if (isInitialized && !isMuted && state === 'idle') {
      startListening()
    }
  }, [isInitialized, isMuted, state, startListening])

  useEffect(() => {
    return () => {
      isCallEndedRef.current = true

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (_e) {
          // Ignore
        }
        recognitionRef.current = null
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
        mediaStreamRef.current = null
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current)
        responseTimeoutRef.current = null
      }
    }
  }, [])

  const getStatusText = () => {
    switch (state) {
      case 'listening':
        return 'Listening...'
      case 'agent_speaking':
        return 'Press Space or tap to interrupt'
      default:
        return isInitialized ? 'Ready' : 'Initializing...'
    }
  }

  const getButtonContent = () => {
    if (state === 'agent_speaking') {
      return (
        <svg className='h-6 w-6' viewBox='0 0 24 24' fill='currentColor'>
          <rect x='6' y='6' width='12' height='12' rx='2' />
        </svg>
      )
    }
    return isMuted ? <MicOff className='h-6 w-6' /> : <Mic className='h-6 w-6' />
  }

  return (
    <div className={cn('fixed inset-0 z-[100] flex flex-col bg-white text-gray-900', className)}>
      <div className='flex flex-1 flex-col items-center justify-center px-8'>
        <div className='relative mb-16'>
          <ParticlesVisualization
            audioLevels={audioLevels}
            isListening={state === 'listening'}
            isPlayingAudio={state === 'agent_speaking'}
            isStreaming={isStreaming}
            isMuted={isMuted}
            className='h-80 w-80 md:h-96 md:w-96'
          />
        </div>

        <div className='mb-16 flex h-24 items-center justify-center'>
          {currentTranscript && (
            <div className='max-w-2xl px-8'>
              <p className='overflow-hidden text-center text-gray-700 text-xl leading-relaxed'>
                {currentTranscript}
              </p>
            </div>
          )}
        </div>

        <p className='mb-8 text-center text-gray-600 text-lg'>
          {getStatusText()}
          {isMuted && <span className='ml-2 text-gray-400 text-sm'>(Muted)</span>}
        </p>
      </div>

      <div className='px-8 pb-12'>
        <div className='flex items-center justify-center space-x-12'>
          <Button
            onClick={handleCallEnd}
            variant='outline'
            size='icon'
            className='h-14 w-14 rounded-full border-gray-300 hover:bg-gray-50'
          >
            <Phone className='h-6 w-6 rotate-[135deg]' />
          </Button>

          <Button
            onClick={toggleMute}
            variant='outline'
            size='icon'
            disabled={!isInitialized}
            className={cn(
              'h-14 w-14 rounded-full border-gray-300 bg-transparent hover:bg-gray-50',
              isMuted ? 'text-gray-400' : 'text-gray-600'
            )}
          >
            {getButtonContent()}
          </Button>
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: particles.tsx]---
Location: sim-main/apps/sim/app/chat/components/voice-interface/components/particles.tsx
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('Particles')

interface ShaderUniforms {
  u_time: { type: string; value: number }
  u_frequency: { type: string; value: number }
  u_red: { type: string; value: number }
  u_green: { type: string; value: number }
  u_blue: { type: string; value: number }
}

interface ParticlesProps {
  audioLevels: number[]
  isListening: boolean
  isPlayingAudio: boolean
  isStreaming: boolean
  isMuted: boolean
  isProcessingInterruption?: boolean
  className?: string
}

class SimpleBloomComposer {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.Camera
  private bloomScene: THREE.Scene
  private bloomMaterial: THREE.ShaderMaterial
  private renderTarget: THREE.WebGLRenderTarget
  private quad: THREE.Mesh

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer = renderer
    this.scene = scene
    this.camera = camera

    this.bloomScene = new THREE.Scene()

    this.renderTarget = new THREE.WebGLRenderTarget(
      renderer.domElement.width,
      renderer.domElement.height,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    )

    this.bloomMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        strength: { value: 1.5 },
        threshold: { value: 0.3 },
        radius: { value: 0.8 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float strength;
        uniform float threshold;
        uniform float radius;
        varying vec2 vUv;
        
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          
          // Simple bloom effect
          float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          if (brightness > threshold) {
            color.rgb *= strength;
          }
          
          gl_FragColor = color;
        }
      `,
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    this.quad = new THREE.Mesh(geometry, this.bloomMaterial)
    this.bloomScene.add(this.quad)
  }

  render() {
    this.renderer.setRenderTarget(this.renderTarget)
    this.renderer.render(this.scene, this.camera)

    this.bloomMaterial.uniforms.tDiffuse.value = this.renderTarget.texture
    this.renderer.setRenderTarget(null)
    this.renderer.render(this.bloomScene, new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1))
  }

  setSize(width: number, height: number) {
    this.renderTarget.setSize(width, height)
  }

  dispose() {
    this.renderTarget.dispose()
    this.bloomMaterial.dispose()
  }
}

const vertexShader = `
vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float pnoise(vec3 P, vec3 rep)
{
  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

uniform float u_time;
uniform float u_frequency;

void main() {
  float noise = 5. * pnoise(position + u_time, vec3(10.));

  float displacement = (u_frequency / 30.) * (noise / 10.);

  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`

const fragmentShader = `
uniform float u_red;
uniform float u_blue;
uniform float u_green;

void main() {
    gl_FragColor = vec4(vec3(u_red, u_green, u_blue), 1.0);
}
`

export function ParticlesVisualization({
  audioLevels,
  isListening,
  isPlayingAudio,
  isStreaming,
  isMuted,
  isProcessingInterruption,
  className,
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const uniformsRef = useRef<ShaderUniforms | null>(null)
  const clockRef = useRef<THREE.Clock | null>(null)
  const bloomComposerRef = useRef<SimpleBloomComposer | null>(null)
  const animationFrameRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const isInitializedRef = useRef(false)

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = 0
    }

    if (bloomComposerRef.current) {
      bloomComposerRef.current.dispose()
      bloomComposerRef.current = null
    }

    if (rendererRef.current) {
      if (rendererRef.current.domElement?.parentNode) {
        rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current.dispose()
      rendererRef.current = null
    }

    sceneRef.current = null
    cameraRef.current = null
    meshRef.current = null
    uniformsRef.current = null
    clockRef.current = null
    isInitializedRef.current = false
  }, [])

  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return

    const container = containerRef.current
    const containerWidth = 400
    const containerHeight = 400

    isInitializedRef.current = true

    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerWidth, containerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 0.1, 1000)
    camera.position.set(0, -2, 14)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const uniforms = {
      u_time: { type: 'f', value: 0.0 },
      u_frequency: { type: 'f', value: 0.0 },
      u_red: { type: 'f', value: 0.8 },
      u_green: { type: 'f', value: 0.6 },
      u_blue: { type: 'f', value: 1.0 },
    }
    uniformsRef.current = uniforms

    let mat: THREE.Material
    try {
      mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      })
    } catch (error) {
      logger.error('❌ Shader compilation error, using fallback material:', error)
      mat = new THREE.MeshBasicMaterial({
        color: 0xb794f6, // Light purple color
        wireframe: true,
      })
    }

    const geo = new THREE.IcosahedronGeometry(4, 30) // Match tutorial: radius 4, subdivisions 30
    const mesh = new THREE.Mesh(geo, mat)

    if (mat instanceof THREE.ShaderMaterial || mat instanceof THREE.MeshBasicMaterial) {
      mat.wireframe = true
    }

    scene.add(mesh)
    meshRef.current = mesh

    const bloomComposer = new SimpleBloomComposer(renderer, scene, camera)
    bloomComposerRef.current = bloomComposer

    const clock = new THREE.Clock()
    clockRef.current = clock

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const windowHalfX = containerWidth / 2
      const windowHalfY = containerHeight / 2
      mouseRef.current.x = (e.clientX - rect.left - windowHalfX) / 100
      mouseRef.current.y = (e.clientY - rect.top - windowHalfY) / 100
    }

    container.addEventListener('mousemove', handleMouseMove)

    const updateCameraPosition = () => {
      if (!camera || !scene) return
      camera.position.x += (mouseRef.current.x - camera.position.x) * 0.05
      camera.position.y += (-mouseRef.current.y - camera.position.y) * 0.5
      camera.lookAt(scene.position)
    }

    const calculateAudioIntensity = (elapsedTime: number, avgLevel: number) => {
      const baselineIntensity = 8 + Math.sin(elapsedTime * 0.5) * 3
      let audioIntensity = baselineIntensity

      if (isMuted) {
        // When muted, only show minimal baseline animation
        audioIntensity = baselineIntensity * 0.2
      } else if (isProcessingInterruption) {
        // Special pulsing effect during interruption processing
        audioIntensity = 35 + Math.sin(elapsedTime * 4) * 10
      } else if (isPlayingAudio) {
        // Strong animation when AI is speaking - use simulated levels + enhancement
        const aiIntensity = 60 + Math.sin(elapsedTime * 3) * 20
        audioIntensity = Math.max(avgLevel * 0.8, aiIntensity)
      } else if (isStreaming) {
        // Pulsing animation when AI is thinking/streaming
        audioIntensity = 40 + Math.sin(elapsedTime * 2) * 15
      } else if (isListening && avgLevel > 0) {
        // Scale user input more dramatically for better visual feedback
        const userVoiceIntensity = avgLevel * 2.5 // Amplify user voice significantly
        audioIntensity = Math.max(userVoiceIntensity, baselineIntensity * 1.5)

        // Add some dynamic variation based on audio levels
        const variationFactor = Math.min(avgLevel / 20, 1) // Cap at reasonable level
        audioIntensity += Math.sin(elapsedTime * 8) * (10 * variationFactor)
      } else {
        // Idle state - subtle breathing animation
        audioIntensity = baselineIntensity
      }

      // Clamp to reasonable range
      audioIntensity = Math.max(audioIntensity, 3) // Never completely still
      audioIntensity = Math.min(audioIntensity, 120) // Prevent excessive animation

      return audioIntensity
    }

    const updateShaderColors = (
      uniforms: ShaderUniforms,
      elapsedTime: number,
      avgLevel: number
    ) => {
      if (isMuted) {
        // Muted: dim purple-gray
        uniforms.u_red.value = 0.25
        uniforms.u_green.value = 0.1
        uniforms.u_blue.value = 0.5
      } else if (isProcessingInterruption) {
        // Interruption: bright purple
        uniforms.u_red.value = 0.6
        uniforms.u_green.value = 0.2
        uniforms.u_blue.value = 0.9
      } else if (isPlayingAudio) {
        // AI speaking: brand purple (#701FFC)
        uniforms.u_red.value = 0.44
        uniforms.u_green.value = 0.12
        uniforms.u_blue.value = 0.99
      } else if (isListening && avgLevel > 10) {
        // User speaking: lighter purple with intensity-based variation
        const intensity = Math.min(avgLevel / 50, 1)
        uniforms.u_red.value = 0.35 + intensity * 0.15
        uniforms.u_green.value = 0.1 + intensity * 0.1
        uniforms.u_blue.value = 0.8 + intensity * 0.2
      } else if (isStreaming) {
        // AI thinking: pulsing brand purple
        const pulse = (Math.sin(elapsedTime * 2) + 1) / 2
        uniforms.u_red.value = 0.35 + pulse * 0.15
        uniforms.u_green.value = 0.08 + pulse * 0.08
        uniforms.u_blue.value = 0.95 + pulse * 0.05
      } else {
        // Default idle: soft brand purple
        uniforms.u_red.value = 0.4
        uniforms.u_green.value = 0.15
        uniforms.u_blue.value = 0.9
      }
    }

    const animate = () => {
      if (!camera || !clock || !scene || !bloomComposer || !isInitializedRef.current) return

      updateCameraPosition()

      if (uniforms) {
        const elapsedTime = clock.getElapsedTime()
        const avgLevel = audioLevels.reduce((sum, level) => sum + level, 0) / audioLevels.length

        uniforms.u_time.value = elapsedTime

        const audioIntensity = calculateAudioIntensity(elapsedTime, avgLevel)
        updateShaderColors(uniforms, elapsedTime, avgLevel)

        uniforms.u_frequency.value = audioIntensity
      }

      bloomComposer.render()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      cleanup()
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (
        rendererRef.current &&
        cameraRef.current &&
        bloomComposerRef.current &&
        containerRef.current
      ) {
        const containerWidth = 400
        const containerHeight = 400

        cameraRef.current.aspect = containerWidth / containerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(containerWidth, containerHeight)
        bloomComposerRef.current.setSize(containerWidth, containerHeight)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '400px',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/chat/hooks/index.ts

```typescript
export { useAudioStreaming } from './use-audio-streaming'
export { useChatStreaming } from './use-chat-streaming'
```

--------------------------------------------------------------------------------

---[FILE: use-audio-streaming.ts]---
Location: sim-main/apps/sim/app/chat/hooks/use-audio-streaming.ts
Signals: React

```typescript
'use client'

import { type RefObject, useCallback, useRef, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('UseAudioStreaming')

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

interface AudioStreamingOptions {
  voiceId: string
  modelId?: string
  chatId?: string
  onAudioStart?: () => void
  onAudioEnd?: () => void
  onError?: (error: Error) => void
}

interface AudioQueueItem {
  text: string
  options: AudioStreamingOptions
}

export function useAudioStreaming(sharedAudioContextRef?: RefObject<AudioContext | null>) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const localAudioContextRef = useRef<AudioContext | null>(null)
  const audioContextRef = sharedAudioContextRef || localAudioContextRef
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const audioQueueRef = useRef<AudioQueueItem[]>([])
  const isProcessingQueueRef = useRef(false)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext
      if (!AudioContextConstructor) {
        throw new Error('AudioContext is not supported in this browser')
      }
      audioContextRef.current = new AudioContextConstructor()
    }
    return audioContextRef.current
  }, [])

  const stopAudio = useCallback(() => {
    abortControllerRef.current?.abort()

    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop()
      } catch (e) {
        // Already stopped
      }
      currentSourceRef.current = null
    }

    audioQueueRef.current = []
    isProcessingQueueRef.current = false

    setIsPlayingAudio(false)
  }, [])

  const processAudioQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || audioQueueRef.current.length === 0) {
      return
    }

    isProcessingQueueRef.current = true
    const item = audioQueueRef.current.shift()

    if (!item) {
      isProcessingQueueRef.current = false
      return
    }

    const { text, options } = item
    const {
      voiceId,
      modelId = 'eleven_turbo_v2_5',
      chatId,
      onAudioStart,
      onAudioEnd,
      onError,
    } = options

    try {
      const audioContext = getAudioContext()

      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }
      const response = await fetch('/api/proxy/tts/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId,
          modelId,
          chatId,
        }),
        signal: abortControllerRef.current?.signal,
      })

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.destination)
      source.onended = () => {
        currentSourceRef.current = null
        onAudioEnd?.()

        isProcessingQueueRef.current = false

        if (audioQueueRef.current.length === 0) {
          setIsPlayingAudio(false)
        }

        setTimeout(() => processAudioQueue(), 0)
      }

      currentSourceRef.current = source
      source.start(0)
      setIsPlayingAudio(true)
      onAudioStart?.()
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        logger.error('Audio streaming error:', error)
        onError?.(error)
      }

      isProcessingQueueRef.current = false
      setTimeout(() => processAudioQueue(), 0)
    }
  }, [getAudioContext])

  const streamTextToAudio = useCallback(
    async (text: string, options: AudioStreamingOptions) => {
      if (!text.trim()) {
        return
      }

      if (!abortControllerRef.current || abortControllerRef.current.signal.aborted) {
        abortControllerRef.current = new AbortController()
      }

      audioQueueRef.current.push({ text, options })
      processAudioQueue()
    },
    [processAudioQueue]
  )

  return {
    isPlayingAudio,
    streamTextToAudio,
    stopAudio,
  }
}
```

--------------------------------------------------------------------------------

````
