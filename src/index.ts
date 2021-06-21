import { useCallback, useEffect, useRef } from "react"

interface Options {
    debounce?: number;
    throttle?: number;
    enabled?: boolean;
}

interface Element {
    addEventListener(...args: any[]): any;
    removeEventListener(...args: any[]): any;
}

export function useListener<T extends (...args: any[]) => void>(el: Element | undefined, evt: string, cb: T, opts: Options = {}) {
    const timer = useRef<any>()
    const listener = useCallback<T>(((...args: any[]) => {
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
    }) as T, []);
    useEffect(() => {
        if (!el) {
            return;
        }
        if (!(opts.enabled ?? true)) {
            el.removeEventListener(evt, listener);
            return;
        }
        el.addEventListener(evt, listener);
        return () => {
            el.removeEventListener(evt, listener);
        }
    }, [el, opts.enabled])
    return () => {
        el?.removeEventListener(evt, listener);
    }
}