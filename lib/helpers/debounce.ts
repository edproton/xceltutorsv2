const debounce = <T extends (...args: unknown[]) => void>(func: T, wait: number): T => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function (this: unknown, ...args: Parameters<T>) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    } as T;
};

export default debounce;