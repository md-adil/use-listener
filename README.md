Demo [CodeSandbox](https://codesandbox.io/s/wonderful-franklin-zpck1)

# useListener

A powerful and flexible React hook for attaching and managing event listeners on DOM elements with built-in support for **debouncing** and **throttling**.

## 🚀 Features

- ✅ **Declarative event listener management**
- ✅ **Supports debouncing and throttling**
- ✅ **Works with refs and direct DOM elements**
- ✅ **Automatic cleanup to prevent memory leaks**
- ✅ **Flexible options: capture, passive, once**

## 📦 Installation

```sh
npm install react-use-listener
```

or

```sh
yarn add react-use-listener
```

## 🔧 Usage

### Basic Example

```tsx
import { useRef } from "react";
import { useListener } from "react-use-listener";

function App() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useListener(buttonRef, "click", () => {
    console.log("Button clicked!");
  });

  return <button ref={buttonRef}>Click Me</button>;
}
```

### Un bind listener

```tsx
import { useRef } from "react";
import { useListener } from "react-use-listener";

function App() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const unListen = useListener(buttonRef, "click", () => {
    console.log("Button clicked!");
    unListen(); // click event won't fired again.
  });

  return <button ref={buttonRef}>Click Me</button>;
}
```

### Using Debounce and Throttle

```tsx
import { useListener } from "react-use-listener";

function WindowBox() {
  useListener(
    window,
    "resize",
    () => {
      console.log("Resized!");
    },
    { throttle: 200 }
  );

  return <div>Resize the window</div>;
}
```

## 📜 API Reference

### `useListener`

```ts
useListener(el, event, callback, options);
```

#### Parameters:

| Parameter  | Type                       | Description                           |
| ---------- | -------------------------- | ------------------------------------- |
| `el`       | `EventTarget`              | Target element or a React ref         |
| `event`    | `string`                   | Event name (e.g., `click`, `keydown`) |
| `callback` | `(...args: any[]) => void` | Function to execute when event fires  |
| `options`  | `Options` (optional)       | Additional settings (see below)       |

#### Options:

| Option     | Type      | Default     | Description                                           |
| ---------- | --------- | ----------- | ----------------------------------------------------- |
| `debounce` | `number`  | `undefined` | Delay execution after inactivity (ms)                 |
| `throttle` | `number`  | `undefined` | Limit execution rate (ms)                             |
| `enabled`  | `boolean` | `true`      | Enable or disable the event listener                  |
| `once`     | `boolean` | `false`     | Remove listener after the first execution             |
| `capture`  | `boolean` | `false`     | Use event capturing instead of bubbling               |
| `passive`  | `boolean` | `false`     | Optimize performance by preventing `preventDefault()` |

## 🎯 Best Practices

- **Use refs for dynamically created elements** to ensure proper listener management.
- **Use `enabled: false` when the listener is not needed** to avoid unnecessary event bindings.
- **Prefer `throttle` for performance-sensitive events** like `scroll` and `resize`.
- **Prefer `debounce` for user input events** like `keyup` and `search`.

## 🛠 Contributing

1. Clone the repository:
   ```sh
   git clone https://github.com/md-adil/use-listener.git
   ```
2. Install dependencies:
   ```sh
   cd use-listener
   npm install
   ```
3. Run tests:
   ```sh
   npm test
   ```

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
