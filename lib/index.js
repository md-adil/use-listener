"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useListener = void 0;
const react_1 = require("react");
function useListener(el, evt, cb, opts = {}) {
    const timer = react_1.useRef();
    const listener = react_1.useCallback(((...args) => {
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
    react_1.useEffect(() => {
        var _a;
        if (!el) {
            return;
        }
        if ("current" in el) {
            el = el.current;
        }
        if (!((_a = opts.enabled) !== null && _a !== void 0 ? _a : true)) {
            el.removeEventListener(evt, listener);
            return;
        }
        el.addEventListener(evt, listener, {
            capture: opts.capture,
            passive: opts.passive,
            once: opts.once
        });
        return () => {
            el.removeEventListener(evt, listener);
        };
    }, [opts.enabled]);
    return () => {
        if ("current" in el) {
            el = el.current;
        }
        el.removeEventListener(evt, listener);
    };
}
exports.useListener = useListener;
