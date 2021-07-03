interface Options {
    debounce?: number;
    throttle?: number;
    enabled?: boolean;
    once?: boolean;
    capture?: boolean;
    passive?: boolean;
}
interface Element {
    addEventListener<K = string>(event: K, callback: (e: any) => any, opt?: any): any;
    removeEventListener(...args: any[]): any;
}
declare type Callback = (...args: any[]) => any;
export declare function useListener<T extends Element>(el: T | {
    current: T | null | undefined;
}, evt: string, cb: Callback, opts?: Options): () => void;
export {};
