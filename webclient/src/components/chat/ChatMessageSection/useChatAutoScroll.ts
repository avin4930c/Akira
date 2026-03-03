import { useCallback, useEffect, useRef } from 'react'
import { StreamingMessage } from '@/types/chat'

export const useChatAutoScroll = (
  messagesLength: number,
  streamingMessage?: StreamingMessage | null,
) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const autoScrollRef = useRef<boolean>(true)

  const ensureViewport = useCallback(() => {
    if (viewportRef.current) {
      return viewportRef.current
    }

    const viewport = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    ) as HTMLDivElement | null

    if (viewport) {
      viewportRef.current = viewport
    }

    return viewportRef.current
  }, [])

  const isUserNearBottom = useCallback(() => {
    const viewport = ensureViewport()
    if (!viewport) return true

    const { scrollTop, scrollHeight, clientHeight } = viewport
    return scrollHeight - (scrollTop + clientHeight) < 120
  }, [ensureViewport])

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const viewport = ensureViewport()
      if (!viewport) return

      viewport.scrollTo({ top: viewport.scrollHeight, behavior })
    },
    [ensureViewport],
  )

  const tryAutoScroll = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      if (!autoScrollRef.current) return
      scrollToBottom(behavior)
    },
    [scrollToBottom],
  )

  useEffect(() => {
    const viewport = ensureViewport()
    if (!viewport) return

    const handleScroll = () => {
      autoScrollRef.current = isUserNearBottom()
    }

    handleScroll()

    viewport.addEventListener('scroll', handleScroll)
    return () => viewport.removeEventListener('scroll', handleScroll)
  }, [ensureViewport, isUserNearBottom])

  useEffect(() => {
    tryAutoScroll('auto')
  }, [tryAutoScroll])

  useEffect(() => {
    tryAutoScroll('smooth')
  }, [messagesLength, tryAutoScroll])

  useEffect(() => {
    if (!streamingMessage) return
    tryAutoScroll('auto')
  }, [streamingMessage?.content, streamingMessage?.id, tryAutoScroll])

  return { scrollAreaRef, scrollToBottom, isNearBottom: isUserNearBottom }
}