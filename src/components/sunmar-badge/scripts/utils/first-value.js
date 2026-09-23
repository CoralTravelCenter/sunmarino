import {
    TimeoutError,
    filter,
    firstValueFrom,
    fromEvent,
    mergeMap,
    race,
    throwError,
    timeout,
} from "rxjs";

/** @param {AbortSignal} signal */
export function abortReason(signal) {
    return signal.reason ?? new DOMException("Aborted", "AbortError");
}

/**
 * @template T
 * @param {import("rxjs").Observable<T>} source$
 * @param {{predicate?: (value: T) => boolean, signal?: AbortSignal, timeoutMessage: string, timeoutMs?: number}} options
 * @returns {Promise<T>}
 */
export function waitForFirst(source$, options) {
    const {
        predicate = () => true,
        signal,
        timeoutMessage,
        timeoutMs = 10000,
    } = options;

    if (signal?.aborted) {
        return Promise.reject(abortReason(signal));
    }

    let result$ = source$.pipe(filter(predicate));

    if (signal) {
        const abort$ = fromEvent(signal, "abort").pipe(
            mergeMap(() => throwError(() => abortReason(signal))),
        );
        result$ = race(result$, abort$);
    }

    if (timeoutMs > 0) {
        result$ = result$.pipe(timeout({ first: timeoutMs }));
    }

    return firstValueFrom(result$).catch((error) => {
        if (error instanceof TimeoutError) {
            throw new Error(timeoutMessage);
        }

        throw error;
    });
}
