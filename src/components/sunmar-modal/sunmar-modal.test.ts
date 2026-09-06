import { afterEach, describe, expect, it, vi } from 'vitest';
import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarModal } from './sunmar-modal';

registerSunmarComponents();

describe('SunmarModal', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('emits lifecycle events when its public methods change state', async () => {
    const modal = document.createElement('sunmar-modal') as SunmarModal;
    const onOpen = vi.fn();
    const onClose = vi.fn();
    modal.addEventListener('sunmar-open', onOpen);
    modal.addEventListener('sunmar-close', onClose);
    document.body.append(modal);

    modal.show();
    await modal.updateComplete;
    modal.hide();
    await modal.updateComplete;

    expect(onOpen).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
