import { useEffect, useRef } from "react";
import { createDebounce, createThrottle } from "./utils.js";

interface Options {
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

export function useListener<T extends EventTargetWithListener, E extends keyof GlobalEventHandlersEventMap>(
  el: T | { current: T | null } | null | undefined,
  evt: E,
  cb: Callback,
  opts: Options = {}
) {
  const listenerRef = useRef<EventListener>(null);
  const { enabled = true, debounce, throttle } = opts;
  const element = el && "current" in el ? el.current : el;
  const callbackRef = useRef(cb);

  useEffect(() => {
    callbackRef.current = cb; // Always update the reference to the latest function
  }, [cb]);

  useEffect(() => {
    if (!element) return;
    let handler = (...args: any[]) => callbackRef.current(...args);

    if (throttle) {
      handler = createThrottle(handler, throttle);
    }
    if (debounce) {
      handler = createDebounce(handler, debounce);
    }

    if (listenerRef.current) {
      element.removeEventListener(evt, listenerRef.current);
    }

    if (!enabled) {
      listenerRef.current = null;
      return;
    }

    listenerRef.current = handler;
    element.addEventListener(evt, handler, {
      capture: opts.capture,
      passive: opts.passive,
      once: opts.once,
    });

    return () => {
      element.removeEventListener(evt, handler);
    };
  }, [element, enabled, evt, debounce, throttle, opts.capture, opts.passive, opts.once]);

  return () => {
    if (element && listenerRef.current) {
      element.removeEventListener(evt, listenerRef.current);
      listenerRef.current = null;
    }
  };
}
