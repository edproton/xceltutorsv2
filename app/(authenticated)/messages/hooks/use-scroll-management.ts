import { useState, useEffect, RefObject } from 'react';

export default function useScrollManagement(scrollAreaRef: RefObject<HTMLDivElement>) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current;
    if (scrollContainer) {
      const handleScroll = () => {
        const isNearBottom =
          scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight - 20;
        setShowScrollButton(!isNearBottom);
        setIsScrolledToBottom(isNearBottom);
      };

      scrollContainer.addEventListener("scroll", handleScroll);

      // Initial scroll to bottom
      if (isScrolledToBottom) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [scrollAreaRef, isScrolledToBottom]);

  const scrollToBottom = () => {
    const scrollContainer = scrollAreaRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      setIsScrolledToBottom(true);
    }
  };

  return { showScrollButton, isScrolledToBottom, scrollToBottom };
}