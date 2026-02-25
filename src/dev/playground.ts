import '../index';
import { hostReactAppReady } from '../utils/dom/host-react-app-ready';

const PREVIEW_HTML = `
  <style>
    sunmar-kv::part(iframe) {
        height: 120%;
    }
    sunmar-kv::part(iframe-mob) {
        width: 150%;
    }
    .sticky-demo {
      display: grid;
      gap: 16px;
    }
    .sticky-demo__scroll {
      height: 320px;
      overflow: auto;
      border: 1px solid #d0d7de;
      border-radius: 12px;
      background: #fff;
      padding: 12px;
    }
    .sticky-demo__stack {
      display: grid;
      gap: 16px;
      min-height: 720px;
      align-content: start;
    }
    .sticky-demo__chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 36px;
      padding: 0 12px;
      border-radius: 999px;
      border: 1px solid #d0d7de;
      color: #0e2855;
      text-decoration: none;
      font: 600 14px/1 'Segoe UI', sans-serif;
      background: #fff;
    }
    .sticky-demo__section {
      display: grid;
      gap: 8px;
      padding: 16px;
      border: 1px dashed #d0d7de;
      border-radius: 12px;
      background: #fafafa;
    }
  </style>
  <div style="display:grid; gap: 24px;">
   <section class="sunmarino kv">
    <sunmar-kv
    vimeo-id-desktop="1162544497"
    vimeo-id-mobile="1162544372"
    >
      <sunmar-image
        slot="image"
        media="(min-width: 768px)"
        srcset="https://b2ccdn.sunmar.ru/content/landing-pages/rb-summer/rb-kv.jpg"
        src="https://b2ccdn.sunmar.ru/content/landing-pages/rb-summer/rb-kv-mo.jpg"
        alt=""
      ></sunmar-image>
      <span slot="title">ОчеВИДНАЯ выгода Раннего бронирования</span>
      <span slot="text">
       Скидки до 50% скидки и предоплата 20% от стоимости
      </span>
      <div slot="actions">
        <sunmar-button type="primary">Подобрать тур</sunmar-button>
      </div>
    </sunmar-kv>
    </section>
    <section class="sunmarino">
    <div class="container">
    <sunmar-lid>
      <h2 class="sunmar-h2" slot="title">Лид текст</h2>
      <p class="sunmar-text" slot="text">
       Анапа – одно из популярных летних направлений для российских туристов. Из-за того, что отдых там временно невозможен, многие задаются вопросом: куда теперь отправляться на море? В России можно найти отдых на любой вкус, в том числе и пляжный. Приморские курорты привлекают туристов со всей страны и даже из зарубежья. Каждый из них имеет яркую индивидуальность, и сейчас мы расскажем, куда можно отправиться в отпуск вместо Анапы.
      </p>
      <sunmar-button>Я кнопка</sunmar-button>
    </sunmar-lid>
    </div>
    </section>
            <sunmar-sticky-nav top-offset="81">
              <a slot="nav-link" href="#sticky-about">О проекте</a>
              <a slot="nav-link" href="#sticky-details">Детали</a>
              <a slot="nav-link" href="#sticky-faq">FAQ</a>
              <a slot="nav-link" href="#sticky-more">Еще</a>
              <a slot="nav-link" href="#sticky-more">Еще</a>
            </sunmar-sticky-nav>
  </div>
`;

function renderPreview(target: HTMLElement): void {
  target.innerHTML = PREVIEW_HTML;
  setupTabsSync(target);
}

function setupTabsSync(scope: ParentNode): void {
  const tabsA = scope.querySelector<HTMLElement & { value?: string }>('#tabs-sync-a');
  const tabsB = scope.querySelector<HTMLElement & { value?: string }>('#tabs-sync-b');

  if (!tabsA || !tabsB) {
    return;
  }

  tabsA.addEventListener('sunmar-tabs-change', ((event: Event) => {
    const customEvent = event as CustomEvent<{ value: string }>;
    tabsB.value = customEvent.detail.value;
  }) as EventListener);

  tabsB.addEventListener('sunmar-tabs-change', ((event: Event) => {
    const customEvent = event as CustomEvent<{ value: string }>;
    tabsA.value = customEvent.detail.value;
  }) as EventListener);
}

function ensureMonkeyMountPoint(): HTMLElement {
  const existing = document.querySelector<HTMLElement>('#monkey-app');
  if (existing) {
    return existing;
  }

  const host = document.createElement('div');
  host.id = 'monkey-app';
  host.style.position = 'fixed';
  host.style.left = '12px';
  host.style.right = '12px';
  host.style.top = '12px';
  host.style.bottom = '12px';
  host.style.overflow = 'auto';
  host.style.zIndex = '2147483647';
  document.body.append(host);
  return host;
}

async function bootstrapPreview(): Promise<void> {
  const localMount = document.querySelector<HTMLElement>('#app');
  if (localMount) {
    renderPreview(localMount);
    return;
  }

  await hostReactAppReady('#__next > div', 250);
  renderPreview(ensureMonkeyMountPoint());
}

void bootstrapPreview();
