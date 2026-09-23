import { Observable, filter, map } from "rxjs";

import { waitForFirst } from "./first-value.js";

export function observeMutations$(
    target,
    observerOptions = { childList: true, subtree: true },
) {
    return new Observable((subscriber) => {
        if (!target) {
            subscriber.error(
                new TypeError("observeMutations$ requires an observable target"),
            );
            return undefined;
        }

        const observer = new MutationObserver((records) => {
            subscriber.next(records);
        });
        observer.observe(target, observerOptions);

        return () => observer.disconnect();
    });
}

export function waitForMutation(target, options = {}) {
    const {
        observerOptions = { childList: true, subtree: true },
        predicate = () => true,
        signal,
        timeoutMs = 10000,
    } = options;

    if (!target) {
        return Promise.reject(
            new TypeError("waitForMutation requires an observable target"),
        );
    }

    return waitForFirst(observeMutations$(target, observerOptions), {
        predicate,
        signal,
        timeoutMs,
        timeoutMessage: `waitForMutation timed out after ${timeoutMs}ms`,
    });
}

export function waitForElement(selector, options = {}) {
    const { root = document, signal, timeoutMs = 10000 } = options;

    if (!root || typeof root.querySelector !== "function") {
        return Promise.reject(
            new TypeError("waitForElement requires a queryable root"),
        );
    }

    const current = root.querySelector(selector);
    if (current) return Promise.resolve(current);

    const target =
        root.nodeType === Node.DOCUMENT_NODE ? root.documentElement : root;
    const element$ = observeMutations$(target).pipe(
        map(() => root.querySelector(selector)),
        filter(Boolean),
    );

    return waitForFirst(element$, {
        signal,
        timeoutMs,
        timeoutMessage: `waitForElement timed out after ${timeoutMs}ms`,
    });
}
