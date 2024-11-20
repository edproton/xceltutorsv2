import { Message } from "@/lib/types";
import { useEffect, useRef, useCallback } from "react";

export default function useMessageObserver(
  messages: Message[],
  onMessageInView: (messageId: number) => void
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const visibleMessagesRef = useRef<Set<number>>(new Set());

  const debouncedOnMessageInView = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      visibleMessagesRef.current.forEach((id) => onMessageInView(id));
      visibleMessagesRef.current.clear();
    }, 300);
  }, [onMessageInView]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let hasChanges = false;
        entries.forEach((entry) => {
          const messageId = parseInt(entry.target.id.split("-")[1]);
          if (entry.isIntersecting) {
            if (!visibleMessagesRef.current.has(messageId)) {
              visibleMessagesRef.current.add(messageId);
              hasChanges = true;
            }
          } else {
            if (visibleMessagesRef.current.has(messageId)) {
              visibleMessagesRef.current.delete(messageId);
              hasChanges = true;
            }
          }
        });
        if (hasChanges) {
          debouncedOnMessageInView();
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
