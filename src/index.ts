import { useCallback, useEffect, useRef } from "react"

interface Options {
    debounce?: number;
    throttle?: number;
    enabled?: boolean;
    once?: boolean;
    capture?: boolean;
    passive?: boolean;
}


interface Element {
    addEventListener(...args: any[]): any;
    removeEventListener(...args: any[]): any;
}
// type Callback<T extends Element> = Parameters<T["addEventListener"]>[1];
type Callback<T extends Element> = (...args: any[]) => any;

export function useListener<T extends Element>(el: T | { current: T } , evt: string, cb: Callback<T>, opts: Options = {}) {
    const timer = useRef<any>()
    const listener = useCallback<any>(((...args: any[]) => {
        if (opts.debounce) {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                cb(...args);
            }, opts.debounce);
            return;
        }
        if (opts.throttle) {
            if (timer.current) {
                return;
            }
            timer.current = setTimeout(() => {
                cb(...args);
                timer.current = undefined;
            }, opts.throttle);
            return;
        }
        cb(...args);
    }), []);
    useEffect(() => {
        if (!el) {
            return;
        }
        if ("current" in el) {
            el = el.current;
        }
        if (!(opts.enabled ?? true)) {
            el.removeEventListener(evt, listener);
            return;
        }
        el.addEventListener(evt, listener, {
            capture: opts.capture,
            passive: opts.passive,
            once: opts.once
        });
        return () => {
            (el as T).removeEventListener(evt, listener);
        }
    }, [opts.enabled])
    return () => {
        if ("current" in el) {
            el = el.current;
        }
        el.removeEventListener(evt, listener);
    }
}