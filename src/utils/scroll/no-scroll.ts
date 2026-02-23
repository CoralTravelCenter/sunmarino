import { disablePageScroll, enablePageScroll } from '@fluejs/noscroll';

let lockCount = 0;

export function acquirePageScrollLock(): void {
  if (typeof document === 'undefined') {
    return;
  }

  lockCount += 1;
  if (lockCount === 1) {
    disablePageScroll();
  }
}

export function releasePageScrollLock(): void {
  if (typeof document === 'undefined' || lockCount === 0) {
    return;
  }

  lockCount -= 1;
  if (lockCount === 0) {
    enablePageScroll();
  }
}

export function getPageScrollLockCount(): number {
  return lockCount;
}
