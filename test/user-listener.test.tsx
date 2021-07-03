import 'babel-regenerator-runtime';
import React, {useState} from "react";
import {act, cleanup, fireEvent, render} from "@testing-library/react";
import { useRef } from "react";
import { useListener } from "../";

afterEach(cleanup);
function sleep(n: number) {
    return new Promise<void>(x => setTimeout(x, n));
}
function *range(n: number) {
    for (let i = 0; i < n; i++) {
        yield i;
    }
}

it("debouncing", async () => {
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
    expect(screen.getByRole("count").innerHTML).toBe('0');
    fireEvent.click(screen.getByRole("btn"));
    await act( () => sleep(300));
    for (let _ of new Array(10)) {
        fireEvent.click(screen.getByRole("btn"));
    }
    await act(() => sleep(300));
    expect(screen.getByRole("count").innerHTML).toBe('2');
});


it("should call app", () => {
    function App() {
        const [count, setCount] = useState(0);
        const el = useRef<HTMLButtonElement>(null);
        useListener(window, "click", () => setCount(x => x + 1))
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
    for (let _ of range(10)) {
        fireEvent.click(screen.getByRole("btn"));
    }
    expect(screen.getByRole("count").innerHTML).toBe('11');
});
