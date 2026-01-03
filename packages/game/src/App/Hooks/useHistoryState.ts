import { useState, useEffect, useCallback } from "preact/hooks";

/**
 * useHistoryState - like useState, but synced to browser history
 * @param key Key to namespace state in history.state
 * @param initial Initial value or lazy initializer function
 */
export function useHistoryState<T>(
    key: string,
    initial: T | (() => T)
): [T, (value: T) => void] {
    const [state, setState] = useState<T>(() => {
        const current = history.state?.[key];
        if (current !== undefined) return current;

        // support lazy initializer function
        return typeof initial === "function"
            ? (initial as () => T)()
            : initial;
    });

    // Listen for back/forward navigation
    useEffect(() => {
        // initialize current history entry with your key if it's missing
        if (!history.state || history.state[key] === undefined) {
            const initialState = typeof initial === "function" ? (initial as () => T)() : initial;
            history.replaceState({ ...history.state, [key]: initialState }, "");
        }

        const onPopState = (event: PopStateEvent) => {
            const val = event.state?.[key];
            if (val !== undefined) setState(val);
        };

        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, [key]);

    const setHistoryState = useCallback(
        (value: T) => {
            setState(value);
            const newState = { ...history.state, [key]: value };
            window.history.pushState(newState, "");
        },
        [key]
    );

    return [state, setHistoryState];
}
