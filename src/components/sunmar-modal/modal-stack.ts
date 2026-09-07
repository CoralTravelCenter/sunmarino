// Each document owns one stack and one snapshot of the background it changes.
interface ModalStack {
  items: HTMLElement[];
  inert: Map<HTMLElement, boolean>;
  observer?: MutationObserver;
}
const stacks = new WeakMap<Document, ModalStack>();

function stackFor(document: Document): ModalStack {
  let stack = stacks.get(document);
  if (!stack) {
    stack = { items: [], inert: new Map() };
    stacks.set(document, stack);
  }
  return stack;
}

export function topModal(document: Document): HTMLElement | undefined {
  const items = stackFor(document).items;
  return items[items.length - 1];
}

function syncBackground(stack: ModalStack): void {
  for (const [element, inert] of stack.inert) element.inert = inert;
  stack.inert.clear();
  stack.items.forEach((item, index) => {
    item.style.setProperty('--sunmarino-modal-stack-index', String(index));
  });
  let branch: Element | undefined = stack.items[stack.items.length - 1];
  while (branch) {
    const parent: ParentNode | null = branch.parentNode;
    if (!(parent instanceof HTMLElement || parent instanceof ShadowRoot)) break;
    for (const sibling of Array.from(parent.children)) {
      if (sibling === branch || !(sibling instanceof HTMLElement)) continue;
      stack.inert.set(sibling, sibling.inert);
      sibling.inert = true;
    }
    branch = parent instanceof ShadowRoot ? parent.host : parent;
  }
}

export function pushModal(modal: HTMLElement): void {
  const stack = stackFor(modal.ownerDocument);
  if (stack.items.includes(modal)) return;
  stack.items.push(modal);
  syncBackground(stack);
  stack.observer ??= new MutationObserver(() => syncBackground(stack));
  stack.observer.observe(modal.ownerDocument, { childList: true, subtree: true });
}

export function removeModal(modal: HTMLElement): boolean {
  const stack = stackFor(modal.ownerDocument);
  const wasTop = topModal(modal.ownerDocument) === modal;
  stack.items = stack.items.filter((item) => item !== modal);
  modal.style.removeProperty('--sunmarino-modal-stack-index');
  syncBackground(stack);
  if (!stack.items.length) stack.observer?.disconnect();
  return wasTop;
}
