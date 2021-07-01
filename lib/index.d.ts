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
declare type Callback<T extends Element> = (...args: any[]) => any;
export declare function useListener<T extends Element>(el: T | {
    current: T;
}, evt: string, cb: Callback<T>, opts?: Options): () => void;
export {};
