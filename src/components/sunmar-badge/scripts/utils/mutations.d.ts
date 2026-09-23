export type MutationWaitOptions = {
  observerOptions?: MutationObserverInit;
  predicate?: (records: MutationRecord[]) => boolean;
  signal?: AbortSignal;
  timeoutMs?: number;
};

export type ElementWaitOptions = {
  root?: Node & ParentNode;
  signal?: AbortSignal;
  timeoutMs?: number;
};

export function observeMutations$(
  target: Node,
  observerOptions?: MutationObserverInit,
): import('rxjs').Observable<MutationRecord[]>;

export function waitForMutation(
  target: Node,
  options?: MutationWaitOptions,
): Promise<MutationRecord[]>;

export function waitForElement<T extends Element = Element>(
  selector: string,
  options?: ElementWaitOptions,
): Promise<T>;
