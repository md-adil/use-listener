## useListener

> useful for event binding 


Demo [CodeSandbox](https://codesandbox.io/s/wonderful-franklin-zpck1)

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
import {useState} from "react";
function App() {
    const [width, setWidth] = useState(0)
    useListener(window, "resize", () => {
        // set width after 300 milliseconds when stopped resizing
        setWidth(window.innerWidth);
    }, {
        debounce: 300
    });
    return (
        <div>
            <div>Width: {width}</div>
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