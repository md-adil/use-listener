import React, { useState } from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { useRef } from "react";
import { useListener } from "./index.js";
import { jest } from "@jest/globals";


beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  cleanup();
  jest.useRealTimers();
});


describe('debounce', () => {
  it("debounced click", () => {
    function App() {
      const [count, setCount] = useState(0);
      useListener(document, "click", () => setCount((x) => x + 1), {
        debounce: 300,
      });
      return (
        <>
          <div role="count">{count}</div>
          <button role="btn">
            Click
          </button>
        </>
      );
    }
    const screen = render(<App />);
    expect(screen.getByRole("count").innerHTML).toBe("0");
    fireEvent.click(screen.getByRole("btn"));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    for (let _ of new Array(10)) {
      fireEvent.click(screen.getByRole("btn"));
    }
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(screen.getByRole("count").innerHTML).toBe("2");
  });

  test("debouncing with custom timing", () => {
    function App() {
      const [count, setCount] = useState(0);
      const el = useRef<HTMLButtonElement>(null);
      useListener(window, "click", () => setCount((x) => x + 1), {
        debounce: 300,
      });
      return (
        <>
          <div role="count">{count}</div>
          <button ref={el} role="btn">
            Click
          </button>
        </>
      );
    }
    const screen = render(<App />);
    fireEvent.click(screen.getByRole("btn"));
    expect(screen.getByRole("count").innerHTML).toBe("0");
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(screen.getByRole("count").innerHTML).toBe("1");
  });
})

describe('ref-object', () => {
  test("should attach click on button ref", async () => {
    function App() {
      const [count, setCount] = useState(0);
      const el = useRef<HTMLButtonElement>(null);
      useListener(el, "click", () => setCount((x) => x + 1));
      return (
        <>
          <div role="count" data-testid="count">{count}</div>
          <button ref={el} role="btn" data-testid="btn">
            Click
          </button>
        </>
      );
    }
    const screen = render(<App />);
    expect(screen.getByRole("count").innerHTML).toBe("0");
    fireEvent.click(screen.getByTestId("btn"));
    expect(screen.getByRole("count").innerHTML).toBe("1");
    for (let _ of Array(10)) {
     fireEvent.click(screen.getByRole("btn"));
    }
    expect(screen.getByRole("count").innerHTML).toBe("11");
  });
})
describe('Throttling',  () => {
  test("throttling for 3000", () => {
    function App() {
      const [count, setCount] = useState(0);
      useListener(window, "click", () => setCount((x) => x + 1), {
        throttle: 300,
      });
      return (
        <>
          <div role="count">{count}</div>
          <button role="btn">
            Click
          </button>
        </>
      );
    }
    const screen = render(<App />);
    fireEvent.click(screen.getByRole("btn"));
    expect(screen.getByRole("count").innerHTML).toBe("0");
    act(() => {
      fireEvent.click(screen.getByRole("btn"));
      fireEvent.click(screen.getByRole("btn"));
      jest.advanceTimersByTime(300);
    });
    expect(screen.getByRole("count").innerHTML).toBe("1");
    act(() => {
      jest.advanceTimersByTime(600);
    });
    expect(screen.getByRole("count").innerHTML).toBe("1");
  });
})



it("unmounted", () => {
  const removedFn = jest.fn();
  const listenFn = jest.fn();
  const customListener = {
    removeEventListener: removedFn,
    addEventListener: listenFn,
    dispatchEvent,
  };

  function App({}: any) {
    useListener(customListener, "click", () => {});
    return <></>;
  }
  const screen = render(<App />);
  screen.rerender(<App length={1} />);
  screen.rerender(<App length={2} />);
  screen.rerender(<App length={3} />);
  screen.unmount();
  expect(removedFn.mock.calls.length).toBe(1);
  expect(listenFn.mock.calls.length).toBe(1);
});
