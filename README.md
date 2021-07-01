## useListener
attach native event without and don't care about bind / unbind

Demo [CodeSandbox](https://codesandbox.io/s/wonderful-franklin-zpck1)

## Installing

    npm i react-use-listener

## Import
    import { useListener } from "react-use-listener";

### Usage

1. bind resize event

```ts
import {useState} from "react";
function App() {
    const [width, setWidth] = useState(0)
    useListener(window, "resize", () => {
        setWidth(window.innerWidth);
    });
    return (
        <div>Width: {width}</div>
    )
}
```

2. cancel binding

```ts
import {useState} from "react";
function App() {
    const [width, setWidth] = useState(0)
    const listener = useListener(window, "resize", () => {
        setWidth(window.innerWidth);
        if (window.innerWidth < 1000) {
            listener();
        }
    });
    return (
        <div>Width: {width}</div>
    )
}
```

3. conditionally bind event

```ts
import {useState} from "react";
function App() {
    const [enabled, setEnabled] = useState(false);
    const [width, setWidth] = useState(0)
    useListener(window, "resize", () => {
        setWidth(window.innerWidth);
    }, {
        enabled
    });
    return (
        <div>
            <div>Width: {width}</div>
            <button onClick={() => setEnabled(!enabled)}>Bind resize</button>
        </div>
    )
}
```


4. debounce

```ts
import {useState, useRef} from "react";
function App() {
    const ref = useRef();
    useListener(ref, "keyup", (e) => {
        // set width after 300 milliseconds when stopped resizing
        console.log(e.target.value);
    }, {
        debounce: 300
    });
    return (
        <div>
            <input ref={ref} />
        </div>
    )
}
```

5. throttle

```ts
import {useState} from "react";
function App() {
    const [width, setWidth] = useState(0)
    useListener(window, "resize", () => {
        // trigger after 300 milliseconds
        setWidth(window.innerWidth);
    }, {
        throttle: 300
    });
    return (
        <div>
            <div>Width: {width}</div>
        </div>
    )
}
```

### Reference

```ts
   const listener = useListener(element, event, callback, option);
```
* `element` `: Element | Document | Window | ref` element to attache event
* `event` `: string` event name to bind
* `callback` `: (e) => void` callback
* `option`:

    * `enabled` `: boolean` weather to listen or not, default `true`
    * `throttle` `: number` to throttle event, default `undefined`
    * `debounce` `: number` debounce event, default `undefined`
    * `capture` `: boolean` native flag
    * `passive` `: boolean` native flag
    * `once` `: boolean` native flag