import { useEffect, useRef, useCallback } from 'react';
import { Message } from '../messages';

export default function useMessageObserver(messages: Message[], onMessageInView: (messageId: number) => void) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedOnMessageInView = useCallback((messageIds: number[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      messageIds.forEach(id => onMessageInView(id));
    }, 300);
  }, [onMessageInView]);

  useEffect(() => {
    const messageIds: number[] = [];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = parseInt(entry.target.id.split("-")[1]);
            if (!messageIds.includes(messageId)) {
              messageIds.push(messageId);
            }
          }
        });
        if (messageIds.length > 0) {
          debouncedOnMessageInView(messageIds);
        }
      },
      { threshold: 0.5 }
    );

    messages.forEach((message) => {
      const element = document.getElementById(`message-${message.id}`);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [messages, debouncedOnMessageInView]);
}