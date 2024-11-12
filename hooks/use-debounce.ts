import debounce from "@/lib/helpers/debounce";
import { useCallback } from "react";

export default function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const debouncedCallback = useCallback(debounce(callback, delay), [callback, delay]);

  return debouncedCallback;
}


  