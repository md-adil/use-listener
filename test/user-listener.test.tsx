import React, {useState} from "react";
import {act, cleanup, fireEvent, render} from "@testing-library/react";
import { useRef } from "react";
import { useListener } from "../";

beforeEach(() => {
    jest.useFakeTimers();
})

afterEach(() => {
    cleanup()
    jest.useRealTimers();
});

it("debounce", () => {
    function App() {
        const [count, setCount] = useState(0);
        const el = useRef<HTMLButtonElement>(null);
        useListener(el, "click", () => setCount(x => x + 1), {
            debounce: 300
        })
        return (
            <>
                <div role="count">{count}</div>
                <button ref={el} role="btn">Click</button>
            </>
        );
    }
    const screen = render(<App />);
    expect(screen.getByRole("count").innerHTML).toBe('0');
    fireEvent.click(screen.getByRole("btn"));
    act(() => {
        jest.advanceTimersByTime(300)
    });
    for (let _ of new Array(10)) {
        fireEvent.click(screen.getByRole("btn"));
    }
    act(() => {
        jest.advanceTimersByTime(300);
    });
    expect(screen.getByRole("count").innerHTML).toBe('2');
});


it("should call app", () => {
    function App() {
        const [count, setCount] = useState(0);
        const el = useRef<HTMLButtonElement>(null);
        useListener(el, "click", () => setCount(x => x + 1))
        return (
            <>
                <div role="count">{count}</div>
                <button ref={el} role="btn">Click</button>
            </>
        );
    }
    const screen = render(<App />);
    expect(screen.getByRole("count").innerHTML).toBe('0');
    fireEvent.click(screen.getByRole("btn"));
    expect(screen.getByRole("count").innerHTML).toBe('1');
    for (let _ of Array(10)) {
        fireEvent.click(screen.getByRole("btn"));
    }
    expect(screen.getByRole("count").innerHTML).toBe('11');
});

it("debouncing with custom timing", () => {
    jest.useFakeTimers();
    function App() {
        const [count, setCount] = useState(0);
        const el = useRef<HTMLButtonElement>(null);
        useListener(window, "click", () => setCount(x => x + 1), {
            debounce: 300
        })
        return (
            <>
                <div role="count">{count}</div>
                <button ref={el} role="btn">Click</button>
            </>
        );
    }
    const screen = render(<App />);
    fireEvent.click(screen.getByRole("btn"));
    expect(screen.getByRole("count").innerHTML).toBe('0');
    act(() => {
        jest.advanceTimersByTime(300);
    })
    expect(screen.getByRole("count").innerHTML).toBe('1');
    jest.useFakeTimers();
});

it("throttling", () => {
    function App() {
        const [count, setCount] = useState(0);
        const el = useRef<HTMLButtonElement>(null);
        useListener(window, "click", () => setCount(x => x + 1), {
            debounce: 300
        })
        return (
            <>
                <div role="count">{count}</div>
                <button ref={el} role="btn">Click</button>
            </>
        );
    }
    const screen = render(<App />);
    fireEvent.click(screen.getByRole("btn"));
    expect(screen.getByRole("count").innerHTML).toBe('0');
    act(() => {
        jest.advanceTimersByTime(300);
    })
    expect(screen.getByRole("count").innerHTML).toBe('1');
});

it("unmounted", () => {
    const removedFn = jest.fn();
    const listenFn = jest.fn();
    const customListener = {
        removeEventListener: removedFn,
        addEventListener: listenFn
    };


    function App(props: any) {
        useListener(customListener, "click", () => {});
        return (<></>);
    }
    const screen = render(<App />);
    screen.rerender(<App count={1} />);
    screen.rerender(<App count={2} />);
    screen.rerender(<App count={3} />);
    screen.unmount();
    expect(removedFn.mock.calls.length).toBe(1);
    expect(listenFn.mock.calls.length).toBe(1);
});
