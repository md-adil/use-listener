import type { Timeout } from "./types.js";

export function createDebounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function createThrottle<T extends (...args: any[]) => void>(fn: T, limit: number) {
  let timer: Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timer) return;
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, limit);
  };
}
