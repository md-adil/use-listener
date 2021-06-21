interface Options {
    debounce?: number;
    throttle?: number;
    enabled?: boolean;
}
interface Element {
    addEventListener(...args: any[]): any;
    removeEventListener(...args: any[]): any;
}
export declare function useListener<T extends (...args: any[]) => void>(el: Element | undefined, evt: string, cb: T, opts?: Options): () => void;
export {};
