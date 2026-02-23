import { preloadScript } from '../dom/preload-script';

type VimeoPlayerInstance = {
  element?: Element;
  on(eventName: string, handler: (...args: unknown[]) => void): void;
  play(): Promise<unknown> | void;
  pause(): Promise<unknown> | void;
  destroy?(): Promise<unknown> | void;
};

type VimeoPlayerCtor = new (
  target: Element,
  options: Record<string, unknown>
) => VimeoPlayerInstance;

type VimeoGlobal = {
  Player: VimeoPlayerCtor;
};

declare global {
  interface Window {
    Vimeo?: VimeoGlobal;
  }
}

type VimeoObservedTarget = HTMLElement & {
  dataset: DOMStringMap & {
    vimeoVid?: string;
  };
};

export type VimeoAutoPlayOptions = {
  root?: ParentNode;
  selector?: string;
  onPlaybackStart?: (target: HTMLElement, player: VimeoPlayerInstance) => void;
};

export async function vimeoAutoPlay(options: VimeoAutoPlayOptions = {}): Promise<() => void> {
  const { root = document, selector = '.vimeo-video-box [data-vimeo-vid]', onPlaybackStart } =
    options;

  const targets = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (el): el is VimeoObservedTarget => Boolean(el.dataset.vimeoVid)
  );

  if (!targets.length) {
    return () => {};
  }

  await preloadScript('https://player.vimeo.com/api/player.js');

  const VimeoCtor = window.Vimeo?.Player;
  if (!VimeoCtor) {
    return () => {};
  }

  const players = new WeakMap<VimeoObservedTarget, VimeoPlayerInstance>();

  for (const target of targets) {
    const player = new VimeoCtor(target, {
      id: target.dataset.vimeoVid,
      background: 1,
      playsinline: 1,
      autopause: 0,
      title: 0,
      byline: 0,
      portrait: 0,
      autoplay: 1,
      muted: 1,
    });

    player.on('play', () => {
      target.parentElement?.classList.add('playback');
      onPlaybackStart?.(target, player);
    });

    players.set(target, player);
    void player.play();
  }

  return () => {
    for (const target of targets) {
      const player = players.get(target);
      if (player?.destroy) {
        void player.destroy();
      }
    }
  };
}
