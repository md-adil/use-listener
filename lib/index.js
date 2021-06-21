"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useListener = void 0;
var react_1 = require("react");
function useListener(el, evt, cb, opts) {
    if (opts === void 0) { opts = {}; }
    var timer = react_1.useRef();
    var listener = react_1.useCallback((function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (opts.debounce) {
            clearTimeout(timer.current);
            timer.current = setTimeout(function () {
                cb.apply(void 0, args);
            }, opts.debounce);
            return;
        }
        if (opts.throttle) {
            if (timer.current) {
                return;
            }
            timer.current = setTimeout(function () {
                cb.apply(void 0, args);
                timer.current = undefined;
            }, opts.throttle);
            return;
        }
        cb.apply(void 0, args);
    }), []);
    react_1.useEffect(function () {
        var _a;
        if (!el) {
            return;
        }
        if (!((_a = opts.enabled) !== null && _a !== void 0 ? _a : true)) {
            el.removeEventListener(evt, listener);
            return;
        }
        el.addEventListener(evt, listener);
        return function () {
            el.removeEventListener(evt, listener);
        };
    }, [el, opts.enabled]);
    return function () {
        el === null || el === void 0 ? void 0 : el.removeEventListener(evt, listener);
    };
}
exports.useListener = useListener;
