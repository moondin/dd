---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 341
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 341 of 933)

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

---[FILE: use-chat-streaming.ts]---
Location: sim-main/apps/sim/app/chat/hooks/use-chat-streaming.ts
Signals: React

```typescript
'use client'

import { useRef, useState } from 'react'
import { isUserFile } from '@/lib/core/utils/display-filters'
import { createLogger } from '@/lib/logs/console/logger'
import type { ChatFile, ChatMessage } from '@/app/chat/components/message/message'
import { CHAT_ERROR_MESSAGES } from '@/app/chat/constants'

const logger = createLogger('UseChatStreaming')

function extractFilesFromData(
  data: any,
  files: ChatFile[] = [],
  seenIds = new Set<string>()
): ChatFile[] {
  if (!data || typeof data !== 'object') {
    return files
  }

  if (isUserFile(data)) {
    if (!seenIds.has(data.id)) {
      seenIds.add(data.id)
      files.push({
        id: data.id,
        name: data.name,
        url: data.url,
        key: data.key,
        size: data.size,
        type: data.type,
        context: data.context,
      })
    }
    return files
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      extractFilesFromData(item, files, seenIds)
    }
    return files
  }

  for (const value of Object.values(data)) {
    extractFilesFromData(value, files, seenIds)
  }

  return files
}

export interface VoiceSettings {
  isVoiceEnabled: boolean
  voiceId: string
  autoPlayResponses: boolean
  voiceFirstMode?: boolean
  textStreamingInVoiceMode?: 'hidden' | 'synced' | 'normal'
  conversationMode?: boolean
}

export interface StreamingOptions {
  voiceSettings?: VoiceSettings
  onAudioStart?: () => void
  onAudioEnd?: () => void
  audioStreamHandler?: (text: string) => Promise<void>
  outputConfigs?: Array<{ blockId: string; path?: string }>
}

export function useChatStreaming() {
  const [isStreamingResponse, setIsStreamingResponse] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const accumulatedTextRef = useRef<string>('')
  const lastStreamedPositionRef = useRef<number>(0)
  const audioStreamingActiveRef = useRef<boolean>(false)
  const lastDisplayedPositionRef = useRef<number>(0) // Track displayed text in synced mode

  const stopStreaming = (setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>) => {
    if (abortControllerRef.current) {
      // Abort the fetch request
      abortControllerRef.current.abort()
      abortControllerRef.current = null

      // Add a message indicating the response was stopped
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1]

        // Only modify if the last message is from the assistant (as expected)
        if (lastMessage && lastMessage.type === 'assistant') {
          // Append a note that the response was stopped
          const updatedContent =
            lastMessage.content +
            (lastMessage.content
              ? '\n\n_Response stopped by user._'
              : '_Response stopped by user._')

          return [
            ...prev.slice(0, -1),
            { ...lastMessage, content: updatedContent, isStreaming: false },
          ]
        }

        return prev
      })

      // Reset streaming state immediately
      setIsStreamingResponse(false)
      accumulatedTextRef.current = ''
      lastStreamedPositionRef.current = 0
      lastDisplayedPositionRef.current = 0
      audioStreamingActiveRef.current = false
    }
  }

  const handleStreamedResponse = async (
    response: Response,
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    scrollToBottom: () => void,
    userHasScrolled?: boolean,
    streamingOptions?: StreamingOptions
  ) => {
    logger.info('[useChatStreaming] handleStreamedResponse called')
    // Set streaming state
    setIsStreamingResponse(true)
    abortControllerRef.current = new AbortController()

    // Check if we should stream audio
    const shouldPlayAudio =
      streamingOptions?.voiceSettings?.isVoiceEnabled &&
      streamingOptions?.voiceSettings?.autoPlayResponses &&
      streamingOptions?.audioStreamHandler

    const reader = response.body?.getReader()
    if (!reader) {
      setIsLoading(false)
      setIsStreamingResponse(false)
      return
    }

    const decoder = new TextDecoder()
    let accumulatedText = ''
    let lastAudioPosition = 0

    // Track which blocks have streamed content (like chat panel)
    const messageIdMap = new Map<string, string>()
    const messageId = crypto.randomUUID()
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        content: '',
        type: 'assistant',
        timestamp: new Date(),
        isStreaming: true,
      },
    ])

    setIsLoading(false)

    try {
      while (true) {
        // Check if aborted
        if (abortControllerRef.current === null) {
          break
        }

        const { done, value } = await reader.read()

        if (done) {
          // Stream any remaining text for TTS
          if (
            shouldPlayAudio &&
            streamingOptions?.audioStreamHandler &&
            accumulatedText.length > lastAudioPosition
          ) {
            const remainingText = accumulatedText.substring(lastAudioPosition).trim()
            if (remainingText) {
              try {
                await streamingOptions.audioStreamHandler(remainingText)
              } catch (error) {
                logger.error('TTS error for remaining text:', error)
              }
            }
          }
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6)

            if (data === '[DONE]') {
              continue
            }

            try {
              const json = JSON.parse(data)
              const { blockId, chunk: contentChunk, event: eventType } = json

              if (eventType === 'error' || json.event === 'error') {
                const errorMessage = json.error || CHAT_ERROR_MESSAGES.GENERIC_ERROR
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === messageId
                      ? {
                          ...msg,
                          content: errorMessage,
                          isStreaming: false,
                          type: 'assistant' as const,
                        }
                      : msg
                  )
                )
                setIsLoading(false)
                return
              }

              if (eventType === 'final' && json.data) {
                const finalData = json.data as {
                  success: boolean
                  error?: string | { message?: string }
                  output?: Record<string, Record<string, any>>
                }

                const outputConfigs = streamingOptions?.outputConfigs
                const formattedOutputs: string[] = []
                let extractedFiles: ChatFile[] = []

                const formatValue = (value: any): string | null => {
                  if (value === null || value === undefined) {
                    return null
                  }

                  if (isUserFile(value)) {
                    return null
                  }

                  if (Array.isArray(value) && value.length === 0) {
                    return null
                  }

                  if (typeof value === 'string') {
                    return value
                  }

                  if (typeof value === 'object') {
                    try {
                      return `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``
                    } catch {
                      return String(value)
                    }
                  }

                  return String(value)
                }

                const getOutputValue = (blockOutputs: Record<string, any>, path?: string) => {
                  if (!path || path === 'content') {
                    if (blockOutputs.content !== undefined) return blockOutputs.content
                    if (blockOutputs.result !== undefined) return blockOutputs.result
                    return blockOutputs
                  }

                  if (blockOutputs[path] !== undefined) {
                    return blockOutputs[path]
                  }

                  if (path.includes('.')) {
                    return path.split('.').reduce<any>((current, segment) => {
                      if (current && typeof current === 'object' && segment in current) {
                        return current[segment]
                      }
                      return undefined
                    }, blockOutputs)
                  }

                  return undefined
                }

                if (outputConfigs?.length && finalData.output) {
                  for (const config of outputConfigs) {
                    const blockOutputs = finalData.output[config.blockId]
                    if (!blockOutputs) continue

                    const value = getOutputValue(blockOutputs, config.path)

                    if (isUserFile(value)) {
                      extractedFiles.push({
                        id: value.id,
                        name: value.name,
                        url: value.url,
                        key: value.key,
                        size: value.size,
                        type: value.type,
                        context: value.context,
                      })
                      continue
                    }

                    const nestedFiles = extractFilesFromData(value)
                    if (nestedFiles.length > 0) {
                      extractedFiles = [...extractedFiles, ...nestedFiles]
                      continue
                    }

                    const formatted = formatValue(value)
                    if (formatted) {
                      formattedOutputs.push(formatted)
                    }
                  }
                }

                let finalContent = accumulatedText

                if (formattedOutputs.length > 0) {
                  const trimmedStreamingContent = accumulatedText.trim()

                  const uniqueOutputs = formattedOutputs.filter((output) => {
                    const trimmedOutput = output.trim()
                    if (!trimmedOutput) return false

                    // Skip outputs that exactly match the streamed content to avoid duplication
                    if (trimmedStreamingContent && trimmedOutput === trimmedStreamingContent) {
                      return false
                    }

                    return true
                  })

                  if (uniqueOutputs.length > 0) {
                    const combinedOutputs = uniqueOutputs.join('\n\n')
                    finalContent = finalContent
                      ? `${finalContent.trim()}\n\n${combinedOutputs}`
                      : combinedOutputs
                  }
                }

                if (!finalContent && extractedFiles.length === 0) {
                  if (finalData.error) {
                    if (typeof finalData.error === 'string') {
                      finalContent = finalData.error
                    } else if (typeof finalData.error?.message === 'string') {
                      finalContent = finalData.error.message
                    }
                  } else if (finalData.success && finalData.output) {
                    const fallbackOutput = Object.values(finalData.output)
                      .map((block) => formatValue(block)?.trim())
                      .filter(Boolean)[0]
                    if (fallbackOutput) {
                      finalContent = fallbackOutput
                    }
                  }
                }

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === messageId
                      ? {
                          ...msg,
                          isStreaming: false,
                          content: finalContent ?? msg.content,
                          files: extractedFiles.length > 0 ? extractedFiles : undefined,
                        }
                      : msg
                  )
                )

                accumulatedTextRef.current = ''
                lastStreamedPositionRef.current = 0
                lastDisplayedPositionRef.current = 0
                audioStreamingActiveRef.current = false

                return
              }

              if (blockId && contentChunk) {
                if (!messageIdMap.has(blockId)) {
                  messageIdMap.set(blockId, messageId)
                }

                accumulatedText += contentChunk
                logger.debug('[useChatStreaming] Received chunk', {
                  blockId,
                  chunkLength: contentChunk.length,
                  totalLength: accumulatedText.length,
                  messageId,
                  chunk: contentChunk.substring(0, 20),
                })
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === messageId ? { ...msg, content: accumulatedText } : msg
                  )
                )

                // Real-time TTS for voice mode
                if (shouldPlayAudio && streamingOptions?.audioStreamHandler) {
                  const newText = accumulatedText.substring(lastAudioPosition)
                  const sentenceEndings = ['. ', '! ', '? ', '.\n', '!\n', '?\n', '.', '!', '?']
                  let sentenceEnd = -1

                  for (const ending of sentenceEndings) {
                    const index = newText.indexOf(ending)
                    if (index > 0) {
                      sentenceEnd = index + ending.length
                      break
                    }
                  }

                  if (sentenceEnd > 0) {
                    const sentence = newText.substring(0, sentenceEnd).trim()
                    if (sentence && sentence.length >= 3) {
                      try {
                        await streamingOptions.audioStreamHandler(sentence)
                        lastAudioPosition += sentenceEnd
                      } catch (error) {
                        logger.error('TTS error:', error)
                      }
                    }
                  }
                }
              } else if (blockId && eventType === 'end') {
                setMessages((prev) =>
                  prev.map((msg) => (msg.id === messageId ? { ...msg, isStreaming: false } : msg))
                )
              }
            } catch (parseError) {
              logger.error('Error parsing stream data:', parseError)
            }
          }
        }
      }
    } catch (error) {
      logger.error('Error processing stream:', error)
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, isStreaming: false } : msg))
      )
    } finally {
      setIsStreamingResponse(false)
      abortControllerRef.current = null

      if (!userHasScrolled) {
        setTimeout(() => {
          scrollToBottom()
        }, 300)
      }

      if (shouldPlayAudio) {
        streamingOptions?.onAudioEnd?.()
      }
    }
  }

  return {
    isStreamingResponse,
    setIsStreamingResponse,
    abortControllerRef,
    stopStreaming,
    handleStreamedResponse,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: chat.tsx]---
Location: sim-main/apps/sim/app/chat/[identifier]/chat.tsx
Signals: React

```typescript
'use client'

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { noop } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { getFormattedGitHubStars } from '@/app/(landing)/actions/github'
import {
  ChatErrorState,
  ChatHeader,
  ChatInput,
  ChatLoadingState,
  type ChatMessage,
  ChatMessageContainer,
  EmailAuth,
  PasswordAuth,
  SSOAuth,
  VoiceInterface,
} from '@/app/chat/components'
import { CHAT_ERROR_MESSAGES, CHAT_REQUEST_TIMEOUT_MS } from '@/app/chat/constants'
import { useAudioStreaming, useChatStreaming } from '@/app/chat/hooks'

const logger = createLogger('ChatClient')

interface ChatConfig {
  id: string
  title: string
  description: string
  customizations: {
    primaryColor?: string
    logoUrl?: string
    imageUrl?: string
    welcomeMessage?: string
    headerText?: string
  }
  authType?: 'public' | 'password' | 'email' | 'sso'
  outputConfigs?: Array<{ blockId: string; path?: string }>
}

interface AudioStreamingOptions {
  voiceId: string
  chatId?: string
  onError: (error: Error) => void
}

const DEFAULT_VOICE_SETTINGS = {
  voiceId: 'EXAVITQu4vr4xnSDxMaL', // Default ElevenLabs voice (Bella)
}

/**
 * Converts a File object to a base64 data URL
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Creates an audio stream handler for text-to-speech conversion
 * @param streamTextToAudio - Function to stream text to audio
 * @param voiceId - The voice ID to use for TTS
 * @param chatId - Optional chat ID for deployed chat authentication
 * @returns Audio stream handler function or undefined
 */
function createAudioStreamHandler(
  streamTextToAudio: (text: string, options: AudioStreamingOptions) => Promise<void>,
  voiceId: string,
  chatId?: string
) {
  return async (text: string) => {
    try {
      await streamTextToAudio(text, {
        voiceId,
        chatId,
        onError: (error: Error) => {
          logger.error('Audio streaming error:', error)
        },
      })
    } catch (error) {
      logger.error('TTS error:', error)
    }
  }
}

function throttle<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null
  let lastExecTime = 0

  return ((...args: Parameters<T>) => {
    const currentTime = Date.now()

    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    } else {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(
        () => {
          func(...args)
          lastExecTime = Date.now()
        },
        delay - (currentTime - lastExecTime)
      )
    }
  }) as T
}

export default function ChatClient({ identifier }: { identifier: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatConfig, setChatConfig] = useState<ChatConfig | null>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [starCount, setStarCount] = useState('19.4k')
  const [conversationId, setConversationId] = useState('')

  const [showScrollButton, setShowScrollButton] = useState(false)
  const [userHasScrolled, setUserHasScrolled] = useState(false)
  const isUserScrollingRef = useRef(false)

  const [authRequired, setAuthRequired] = useState<'password' | 'email' | 'sso' | null>(null)

  const [isVoiceFirstMode, setIsVoiceFirstMode] = useState(false)
  const { isStreamingResponse, abortControllerRef, stopStreaming, handleStreamedResponse } =
    useChatStreaming()
  const audioContextRef = useRef<AudioContext | null>(null)
  const { isPlayingAudio, streamTextToAudio, stopAudio } = useAudioStreaming(audioContextRef)

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const scrollToMessage = useCallback(
    (messageId: string, scrollToShowOnlyMessage = false) => {
      const messageElement = document.querySelector(`[data-message-id="${messageId}"]`)
      if (messageElement && messagesContainerRef.current) {
        const container = messagesContainerRef.current
        const containerRect = container.getBoundingClientRect()
        const messageRect = messageElement.getBoundingClientRect()

        if (scrollToShowOnlyMessage) {
          const scrollTop = container.scrollTop + messageRect.top - containerRect.top

          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
          })
        } else {
          const scrollTop = container.scrollTop + messageRect.top - containerRect.top - 80

          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
          })
        }
      }
    },
    [messagesContainerRef]
  )

  const handleScroll = useCallback(
    throttle(() => {
      const container = messagesContainerRef.current
      if (!container) return

      const { scrollTop, scrollHeight, clientHeight } = container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      setShowScrollButton(distanceFromBottom > 100)

      // Track if user is manually scrolling during streaming
      if (isStreamingResponse && !isUserScrollingRef.current) {
        setUserHasScrolled(true)
      }
    }, 100),
    [isStreamingResponse]
  )

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Reset user scroll tracking when streaming starts
  useEffect(() => {
    if (isStreamingResponse) {
      // Reset userHasScrolled when streaming starts
      setUserHasScrolled(false)

      // Give a small delay to distinguish between programmatic scroll and user scroll
      isUserScrollingRef.current = true
      setTimeout(() => {
        isUserScrollingRef.current = false
      }, 1000)
    }
  }, [isStreamingResponse])

  const fetchChatConfig = async () => {
    try {
      const response = await fetch(`/api/chat/${identifier}`, {
        credentials: 'same-origin',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      })

      if (!response.ok) {
        // Check if auth is required
        if (response.status === 401) {
          const errorData = await response.json()

          if (errorData.error === 'auth_required_password') {
            setAuthRequired('password')
            return
          }
          if (errorData.error === 'auth_required_email') {
            setAuthRequired('email')
            return
          }
          if (errorData.error === 'auth_required_sso') {
            setAuthRequired('sso')
            return
          }
        }

        throw new Error(`Failed to load chat configuration: ${response.status}`)
      }

      // Reset auth required state when authentication is successful
      setAuthRequired(null)

      const data = await response.json()

      setChatConfig(data)

      if (data?.customizations?.welcomeMessage) {
        setMessages([
          {
            id: 'welcome',
            content: data.customizations.welcomeMessage,
            type: 'assistant',
            timestamp: new Date(),
            isInitialMessage: true,
          },
        ])
      }
    } catch (error) {
      logger.error('Error fetching chat config:', error)
      setError(CHAT_ERROR_MESSAGES.CHAT_UNAVAILABLE)
    }
  }

  // Fetch chat config on mount and generate new conversation ID
  useEffect(() => {
    fetchChatConfig()
    setConversationId(uuidv4())

    getFormattedGitHubStars()
      .then((formattedStars) => {
        setStarCount(formattedStars)
      })
      .catch((err) => {
        logger.error('Failed to fetch GitHub stars:', err)
      })
  }, [identifier])

  const refreshChat = () => {
    fetchChatConfig()
  }

  const handleAuthSuccess = () => {
    setAuthRequired(null)
    setTimeout(() => {
      refreshChat()
    }, 800)
  }

  // Handle sending a message
  const handleSendMessage = async (
    messageParam?: string,
    isVoiceInput = false,
    files?: Array<{
      id: string
      name: string
      size: number
      type: string
      file: File
      dataUrl?: string
    }>
  ) => {
    const messageToSend = messageParam ?? inputValue
    if ((!messageToSend.trim() && (!files || files.length === 0)) || isLoading) return

    logger.info('Sending message:', {
      messageToSend,
      isVoiceInput,
      conversationId,
      filesCount: files?.length,
    })

    // Reset userHasScrolled when sending a new message
    setUserHasScrolled(false)

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: messageToSend || (files && files.length > 0 ? `Sent ${files.length} file(s)` : ''),
      type: 'user',
      timestamp: new Date(),
      attachments: files?.map((file) => ({
        id: file.id,
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: file.dataUrl || '',
      })),
    }

    // Add the user's message to the chat
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Scroll to show only the user's message and loading indicator
    setTimeout(() => {
      scrollToMessage(userMessage.id, true)
    }, 100)

    // Create abort controller for request cancellation
    const abortController = new AbortController()
    const timeoutId = setTimeout(() => {
      abortController.abort()
    }, CHAT_REQUEST_TIMEOUT_MS)

    try {
      // Send structured payload to maintain chat context
      const payload: any = {
        input:
          typeof userMessage.content === 'string'
            ? userMessage.content
            : JSON.stringify(userMessage.content),
        conversationId,
      }

      // Add files if present (convert to base64 for JSON transmission)
      if (files && files.length > 0) {
        payload.files = await Promise.all(
          files.map(async (file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            data: file.dataUrl || (await fileToBase64(file.file)),
          }))
        )
      }

      logger.info('API payload:', {
        ...payload,
        files: payload.files ? `${payload.files.length} files` : undefined,
      })

      const response = await fetch(`/api/chat/${identifier}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
        signal: abortController.signal,
      })

      // Clear timeout since request succeeded
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        logger.error('API error response:', errorData)
        throw new Error(errorData.error || 'Failed to get response')
      }

      if (!response.body) {
        throw new Error('Response body is missing')
      }

      // Use the streaming hook with audio support
      const shouldPlayAudio = isVoiceInput || isVoiceFirstMode
      const audioHandler = shouldPlayAudio
        ? createAudioStreamHandler(
            streamTextToAudio,
            DEFAULT_VOICE_SETTINGS.voiceId,
            chatConfig?.id
          )
        : undefined

      logger.info('Starting to handle streamed response:', { shouldPlayAudio })

      await handleStreamedResponse(
        response,
        setMessages,
        setIsLoading,
        scrollToBottom,
        userHasScrolled,
        {
          voiceSettings: {
            isVoiceEnabled: shouldPlayAudio,
            voiceId: DEFAULT_VOICE_SETTINGS.voiceId,
            autoPlayResponses: shouldPlayAudio,
          },
          audioStreamHandler: audioHandler,
          outputConfigs: chatConfig?.outputConfigs,
        }
      )
    } catch (error: any) {
      // Clear timeout in case of error
      clearTimeout(timeoutId)

      if (error.name === 'AbortError') {
        logger.info('Request aborted by user or timeout')
        setIsLoading(false)
        return
      }

      logger.error('Error sending message:', error)
      setIsLoading(false)
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: CHAT_ERROR_MESSAGES.GENERIC_ERROR,
        type: 'assistant',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  // Stop audio when component unmounts or when streaming is stopped
  useEffect(() => {
    return () => {
      stopAudio()
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [stopAudio])

  // Voice interruption - stop audio when user starts speaking
  const handleVoiceInterruption = useCallback(() => {
    stopAudio()

    // Stop any ongoing streaming response
    if (isStreamingResponse) {
      stopStreaming(setMessages)
    }
  }, [isStreamingResponse, stopStreaming, setMessages, stopAudio])

  // Handle voice mode activation
  const handleVoiceStart = useCallback(() => {
    setIsVoiceFirstMode(true)
  }, [])

  // Handle exiting voice mode
  const handleExitVoiceMode = useCallback(() => {
    setIsVoiceFirstMode(false)
    stopAudio() // Stop any playing audio when exiting
  }, [stopAudio])

  // Handle voice transcript from voice-first interface
  const handleVoiceTranscript = useCallback(
    (transcript: string) => {
      logger.info('Received voice transcript:', transcript)
      handleSendMessage(transcript, true)
    },
    [handleSendMessage]
  )

  // If error, show error message using the extracted component
  if (error) {
    return <ChatErrorState error={error} starCount={starCount} />
  }

  // If authentication is required, use the extracted components
  if (authRequired) {
    // Get title and description from the URL params or use defaults
    const title = new URLSearchParams(window.location.search).get('title') || 'chat'
    const primaryColor =
      new URLSearchParams(window.location.search).get('color') || 'var(--brand-primary-hover-hex)'

    if (authRequired === 'password') {
      return (
        <PasswordAuth
          identifier={identifier}
          onAuthSuccess={handleAuthSuccess}
          title={title}
          primaryColor={primaryColor}
        />
      )
    }
    if (authRequired === 'email') {
      return (
        <EmailAuth
          identifier={identifier}
          onAuthSuccess={handleAuthSuccess}
          title={title}
          primaryColor={primaryColor}
        />
      )
    }
    if (authRequired === 'sso') {
      return (
        <SSOAuth
          identifier={identifier}
          onAuthSuccess={handleAuthSuccess}
          title={title}
          primaryColor={primaryColor}
        />
      )
    }
  }

  // Loading state while fetching config using the extracted component
  if (!chatConfig) {
    return <ChatLoadingState />
  }

  // Voice-first mode interface
  if (isVoiceFirstMode) {
    return (
      <VoiceInterface
        onCallEnd={handleExitVoiceMode}
        onVoiceTranscript={handleVoiceTranscript}
        onVoiceStart={noop}
        onVoiceEnd={noop}
        onInterrupt={handleVoiceInterruption}
        isStreaming={isStreamingResponse}
        isPlayingAudio={isPlayingAudio}
        audioContextRef={audioContextRef}
        messages={messages.map((msg) => ({
          content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
          type: msg.type,
        }))}
      />
    )
  }

  // Standard text-based chat interface
  return (
    <div className='fixed inset-0 z-[100] flex flex-col bg-background text-foreground'>
      {/* Header component */}
      <ChatHeader chatConfig={chatConfig} starCount={starCount} />

      {/* Message Container component */}
      <ChatMessageContainer
        messages={messages}
        isLoading={isLoading}
        showScrollButton={showScrollButton}
        messagesContainerRef={messagesContainerRef as RefObject<HTMLDivElement>}
        messagesEndRef={messagesEndRef as RefObject<HTMLDivElement>}
        scrollToBottom={scrollToBottom}
        scrollToMessage={scrollToMessage}
        chatConfig={chatConfig}
      />

      {/* Input area (free-standing at the bottom) */}
      <div className='relative p-3 pb-4 md:p-4 md:pb-6'>
        <div className='relative mx-auto max-w-3xl md:max-w-[748px]'>
          <ChatInput
            onSubmit={(value, isVoiceInput, files) => {
              void handleSendMessage(value, isVoiceInput, files)
            }}
            isStreaming={isStreamingResponse}
            onStopStreaming={() => stopStreaming(setMessages)}
            onVoiceStart={handleVoiceStart}
          />
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/chat/[identifier]/page.tsx

```typescript
import ChatClient from '@/app/chat/[identifier]/chat'

export default async function ChatPage({ params }: { params: Promise<{ identifier: string }> }) {
  const { identifier } = await params
  return <ChatClient identifier={identifier} />
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/invite/components/index.ts

```typescript
export { default as InviteLayout } from './layout'
export { InviteStatusCard } from './status-card'
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: sim-main/apps/sim/app/invite/components/layout.tsx

```typescript
'use client'

import Nav from '@/app/(landing)/components/nav/nav'

interface InviteLayoutProps {
  children: React.ReactNode
}

export default function InviteLayout({ children }: InviteLayoutProps) {
  return (
    <div className='bg-white'>
      <Nav variant='auth' />
      <div className='flex min-h-[calc(100vh-120px)] items-center justify-center px-4'>
        <div className='w-full max-w-[410px]'>{children}</div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
