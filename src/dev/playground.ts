import '../index';
import { hostReactAppReady } from '../utils/dom/host-react-app-ready';

const PREVIEW_HTML = `
  <style>
    sunmar-kv::part(iframe) {
        height: 120%;
    }
  </style>
  <div style="display:grid; gap: 24px;">
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

    <sunmar-shell tone="neutral">
      <span slot="title">Buttons Preview</span>
      <sunmar-button-group>
        <sunmar-button type="primary">Действие (button)</sunmar-button>
        <sunmar-button type="secondary">Узнать больше</sunmar-button>
        <sunmar-link type="neutral" href="https://www.sunmar.ru/" target="_blank">
          Перейти на Sunmar (link)
        </sunmar-link>
        <sunmar-link
          type="neutral"
          href="https://www.sunmar.ru/"
          target="_blank"
          disabled
        >
          Недоступная ссылка
        </sunmar-link>
      </sunmar-button-group>
      <span slot="loading">Кнопка и ссылка разделены на отдельные компоненты. Hover/active только через CSS.</span>
    </sunmar-shell>

    <sunmar-shell tone="neutral">
      <span slot="title">Accordion Preview</span>
      <div style="display:grid; gap: 24px;">
        <div>
          <div style="margin-bottom: 8px; font-weight: 600;">mode="single"</div>
          <sunmar-accordion mode="single">
            <sunmar-accordion-item open>
              <span slot="header">Первый вопрос</span>
              Контент первого пункта.
            </sunmar-accordion-item>
            <sunmar-accordion-item>
              <span slot="header">Второй вопрос</span>
              Контент второго пункта.
            </sunmar-accordion-item>
            <sunmar-accordion-item>
              <span slot="header">Третий вопрос</span>
              Контент третьего пункта.
            </sunmar-accordion-item>
          </sunmar-accordion>
        </div>

        <div>
          <div style="margin-bottom: 8px; font-weight: 600;">mode="multiple"</div>
          <sunmar-accordion mode="multiple">
            <sunmar-accordion-item open>
              <span slot="header">Можно открыть несколько</span>
              Первый открытый пункт.
            </sunmar-accordion-item>
            <sunmar-accordion-item open>
              <span slot="header">Второй тоже открыт</span>
              Второй открытый пункт.
            </sunmar-accordion-item>
            <sunmar-accordion-item>
              <span slot="header">Третий закрыт</span>
              Закрытый пункт.
            </sunmar-accordion-item>
          </sunmar-accordion>
        </div>
      </div>
    </sunmar-shell>

    <sunmar-shell tone="neutral">
      <span slot="title">Tabs Preview (Sync + data-attrs)</span>
      <div style="display:grid; gap: 24px;">
        <sunmar-tabs id="tabs-sync-a" value="hare">
          <sunmar-tabs-nav slot="nav">
            <sunmar-tab-trigger value="hare" data-personaj="Заяц">Заяц</sunmar-tab-trigger>
            <sunmar-tab-trigger value="wolf" data-personaj="Волк">Волк</sunmar-tab-trigger>
            <sunmar-tab-trigger value="fox" data-personaj="Лиса">Лиса</sunmar-tab-trigger>
          </sunmar-tabs-nav>

          <sunmar-tab-panel value="hare">Контент панели "Заяц"</sunmar-tab-panel>
          <sunmar-tab-panel value="wolf">Контент панели "Волк"</sunmar-tab-panel>
          <sunmar-tab-panel value="fox">Контент панели "Лиса"</sunmar-tab-panel>
        </sunmar-tabs>

        <sunmar-tabs id="tabs-sync-b" value="hare">
          <sunmar-tabs-nav slot="nav">
            <sunmar-tab-trigger value="hare" data-personaj="Заяц">Заяц (копия)</sunmar-tab-trigger>
            <sunmar-tab-trigger value="wolf" data-personaj="Волк">Волк (копия)</sunmar-tab-trigger>
            <sunmar-tab-trigger value="fox" data-personaj="Лиса">Лиса (копия)</sunmar-tab-trigger>
          </sunmar-tabs-nav>

          <sunmar-tab-panel value="hare">Синхронизированная панель "Заяц"</sunmar-tab-panel>
          <sunmar-tab-panel value="wolf">Синхронизированная панель "Волк"</sunmar-tab-panel>
          <sunmar-tab-panel value="fox">Синхронизированная панель "Лиса"</sunmar-tab-panel>
        </sunmar-tabs>
      </div>
      <span slot="loading">Переключение в одном экземпляре синхронизирует второй через внешний JS и событие sunmar-tabs-change.</span>
    </sunmar-shell>
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


