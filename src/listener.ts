import { useEffect, useRef } from "react";
import { createDebounce, createThrottle } from "./utils.js";

export interface UseListenerOptions {
  debounce?: number;
  throttle?: number;
  enabled?: boolean;
  once?: boolean;
  capture?: boolean;
  passive?: boolean;
}

interface EventTargetWithListener extends EventTarget {
  addEventListener<K extends keyof GlobalEventHandlersEventMap>(
    type: K,
    listener: (event: GlobalEventHandlersEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof GlobalEventHandlersEventMap>(
    type: K,
    listener: (event: GlobalEventHandlersEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

type Callback = (...args: any[]) => any;

export function useListener<
  T extends EventTargetWithListener,
  E extends keyof GlobalEventHandlersEventMap
>(
  el: T | { current: T | null } | null | undefined,
  evt: E,
  cb: Callback,
  opts: UseListenerOptions = {}
) {
  const listenerRef = useRef<[evt: E, listener?: EventListener]>([evt]);
  const { enabled = true, debounce, throttle } = opts;
  const callbackRef = useRef(cb);

  useEffect(() => {
    callbackRef.current = cb; // Always update the reference to the latest function
  }, [cb]);

  useEffect(() => {
    const element = el && "current" in el ? el.current : el;
    if (!element) return;
    let handler = (...args: any[]) => callbackRef.current(...args);

    if (throttle) {
      handler = createThrottle(handler, throttle);
    }
    if (debounce) {
      handler = createDebounce(handler, debounce);
    }

    const [prevEvt, prevHandler] = listenerRef.current;

    if (prevHandler) {
      element.removeEventListener(prevEvt, prevHandler);
    }

    if (!enabled) {
      listenerRef.current = [evt];
      return;
    }

    listenerRef.current = [evt, handler];
    element.addEventListener(evt, handler, {
      capture: opts.capture,
      passive: opts.passive,
      once: opts.once,
    });

    return () => {
      element.removeEventListener(evt, handler);
    };
  }, [
    el,
    enabled,
    evt,
    debounce,
    throttle,
    opts.capture,
    opts.passive,
    opts.once,
  ]);

  return () => {
    const element = el && "current" in el ? el.current : el;
    const [, handler] = listenerRef.current;
    if (element && handler) {
      element.removeEventListener(evt, handler);
      listenerRef.current = [evt];
    }
  };
}
