"use strict";
(() => {
if (window.__qusaInjected) return;
window.__qusaInjected = true;
/**
 * Custom Color, Wallpaper, Telemetry, Reversible RU Localization & Model Renamer for Antigravity
 * Persists all settings & local wallpapers to disk via window.qusaPersist (independent of localhost port).
 */

const PRESETS = [
  { name: 'Оригинал', color: '#121212' },
  { name: 'OLED Чёрный', color: '#050505' },
  { name: 'Полночь', color: '#0f172a' },
  { name: 'Глубокий синий', color: '#0c1624' },
  { name: 'Изумруд', color: '#0d1d1a' },
  { name: 'Фиолет', color: '#171226' },
  { name: 'Бордо', color: '#211118' },
  { name: 'Графит', color: '#1c1f26' },
  { name: 'Кофе', color: '#1b1613' },
  { name: 'Хвойный', color: '#111d15' },
];

const KNOWN_MODELS = [
  'Gemini 4 Neon',
  'Gemini 4 Argon',
  'Gemini 4 Hydrogen',
  'Orchestrator (Neon)',
  'Orchestrator (Argon)',
  'Gemini 3.8 Flash',
  'Claude Opus 5.5',
  'Claude Sonnet 5.5',
  'GPT-OSS 120B (Medium)',
  'Gemini 4 Carbon',
];

const RU_DICT = {
  'Antigravity': 'Antigravity',
  'Workspace': 'Проекты',
  'Workspaces': 'Проекты',
  'View': 'Вид',
  'Window': 'Окно',
  'File': 'Файл',
  'Edit': 'Правка',
  'Help': 'Справка',
  'New Conversation': 'Новый чат',
  '+ New Conversation': '+ Новый чат',
  'Automations': 'Автоматизации',
  'Customizations': 'Кастомизация',
  'Pinned Conversations': 'Закреплённые чаты',
  'Projects': 'Проекты',
  'Conversations': 'Чаты',
  'Settings': 'Настройки',
  'Ask anything, @ to mention, / for actions': 'Спроси что угодно, @ — упомянуть, / — команды',
  'Ask anything...': 'Спроси что угодно...',
  'Planning': 'План',
  'Fast': 'Быстро',
  'Turbo': 'Турбо',
  'Working': 'Работаю...',
  'Working...': 'Работаю...',
  'Thinking...': 'Думаю...',
  'Thought for': 'Размышлял',
  'Show more': 'Показать ещё',
  'Show less': 'Свернуть',
  'Copy': 'Копировать',
  'Copied': 'Скопировано',
  'Retry': 'Повторить',
  'Regenerate': 'Перегенерировать',
  'Cancel': 'Отмена',
  'Save': 'Сохранить',
  'Delete': 'Удалить',
  'Rename': 'Переименовать',
  'Pin': 'Закрепить',
  'Unpin': 'Открепить',
  'Close': 'Закрыть',
  'Open': 'Открыть',
  'Open Folder': 'Открыть папку',
  'Open Workspace': 'Открыть проект',
  'No active workspace': 'Нет активного проекта',
  'Search': 'Поиск',
  'Search conversations...': 'Поиск по чатам...',
  'History': 'История',
  'Files': 'Файлы',
  'Terminal': 'Терминал',
  'Browser': 'Браузер',
  'Plugins': 'Плагины',
  'Skills': 'Навыки',
  'Rules': 'Правила',
  'Agents': 'Агенты',
  'Model': 'Модель',
  'Models': 'Модели',
  'Model Selection': 'Выбор модели',
  'View Usage': 'Использование',
  'Theme': 'Тема',
  'Appearance': 'Внешний вид',
  'Language': 'Язык',
  'General': 'Основные',
  'Account': 'Аккаунт',
  'Sign in': 'Войти',
  'Sign out': 'Выйти',
  'New Tab': 'Новая вкладка',
  'New Window': 'Новое окно',
  'Check for Updates': 'Проверить обновления',
  'Docs': 'Документация',
  'Send': 'Отправить',
  'Stop': 'Стоп',
  'Attach': 'Прикрепить',
  'Upload': 'Загрузить',
  'Download': 'Скачать',
  'Refresh': 'Обновить',
  'Reload': 'Перезагрузить',
  'Clear': 'Очистить',
  'Back': 'Назад',
  'Forward': 'Вперёд',
  'Done': 'Готово',
  'Error': 'Ошибка',
  'Warning': 'Предупреждение',
  'Loading...': 'Загрузка...',
  'Enable': 'Включить',
  'Disable': 'Выключить',
  'Enabled': 'Включено',
  'Disabled': 'Выключено',
  'Installed': 'Установлено',
  'Marketplace': 'Маркетплейс',
  'MCP Servers': 'MCP-серверы',
  'Workflows': 'Воркфлоу',
  'Low': 'Низкий',
  'Medium': 'Средний',
  'High': 'Высокий',
  'Always allow': 'Всегда разрешать',
  'Allow': 'Разрешить',
  'Deny': 'Отклонить',
  'Reject': 'Отклонить',
  'Accept': 'Принять',
  'Apply': 'Применить',
  'Reset': 'Сбросить',
  'Archive': 'Архивировать',
  'Split': 'Разделить',
  'Split Right': 'Разделить вправо',
  'Split Down': 'Разделить вниз',
  'Replace with New': 'Заменить новым',
  'Conversation Name': 'Название чата',
  'Conversation ID': 'ID чата',
  'Project Name': 'Название проекта',
  'Search or enter a URL': 'Поиск или введите URL',
  'Review': 'Обзор изменений',
  'Open File': 'Открыть файл',
  'Background Tasks': 'Фоновые задачи',
  'See all': 'Показать все',
  'See less': 'Свернуть',
  'Local Permissions': 'Локальные разрешения',
  'Request Review': 'Запрашивать подтверждение',
  'Every command requires approval.': 'Каждая команда требует подтверждения.',
  'Default': 'По умолчанию',
  'Ask before sensitive operations.': 'Спрашивать перед важными операциями.',
  'Auto': 'Авто',
  'Automatically decide if commands run.': 'Автоматически решать, запускать ли команды.',
  'Run all commands without restrictions.': 'Запускать все команды без ограничений.',
  'Add Context': 'Добавить контекст',
  'Folder': 'Папка',
  'Mentions': 'Упоминания',
  'Actions': 'Действия',
  'Log in': 'Войти',
  'Main Agent': 'Главный агент',
  'Open in Antigravity IDE': 'Открыть в Antigravity IDE',
  'now': 'сейчас',
  'Now': 'Сейчас',
  'just now': 'только что',
  'Just now': 'Только что',
  'Just Now': 'Только что',
  '<1m': '<1м.',
  '< 1m': '<1м.',
};

const STORAGE_KEY = 'qusa_custom_ui_v2';

const DEFAULT_CONFIG = {
  colorEnabled: true,
  baseColor: '#121212',
  separateSidebar: false,
  sidebarColor: '#181818',
  detachedSidebar: true,
  glassStyle: 'frosted',
  panelContrast: 1.0,
  wallpaperUrl: '',
  wallpaperLocalName: '',
  wallpaperDim: 0.42,
  wallpaperBlur: 0,
  panelAlpha: 0.68,
  ruEnabled: false,
  translateThoughts: false,
  customAccountName: '',
  modelRenames: {},
  fabHidden: false,
  fabHotkey: 'Alt+KeyS',
  fabLeft: null,
  fabTop: null,
  antyEnabled: true,
  antyCharacter: 'anty',
  antyRoam: true,
  antySize: 58,
  weatherEffect: 'none',
  weatherIntensity: 1.0,
  weatherSpeed: 1.0,
  spotifyIsland: true,
  spotifyAutoWidth: true,
  lyricsFontMode: 'custom',
  lyricsFontName: '',
};

let activeLocalBlobUrl = '';
let activeLocalMime = '';
let saveDiskTimer = null;

function mergeConfig(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    return { ...DEFAULT_CONFIG, modelRenames: {} };
  }
  return {
    ...DEFAULT_CONFIG,
    ...parsed,
    modelRenames: { ...(parsed.modelRenames || {}) },
  };
}

async function loadConfigAsync() {
  try {
    if (window.qusaPersist && typeof window.qusaPersist.loadConfig === 'function') {
      const diskCfg = await window.qusaPersist.loadConfig();
      if (diskCfg && typeof diskCfg === 'object') {
        return mergeConfig(diskCfg);
      }
    }
  } catch (err) {
    console.error('[Qusa] Disk config load failed:', err);
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const cfg = mergeConfig(JSON.parse(raw));
      saveConfig(cfg, true);
      return cfg;
    }
  } catch {}
  return { ...DEFAULT_CONFIG, modelRenames: {} };
}

function saveConfig(cfg, immediate = false) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {}
  if (window.qusaPersist && typeof window.qusaPersist.saveConfig === 'function') {
    const flush = () => {
      saveDiskTimer = null;
      void window.qusaPersist.saveConfig(cfg).catch((err) => {
        console.error('[Qusa] Disk config save failed:', err);
      });
    };
    if (immediate) {
      if (saveDiskTimer) clearTimeout(saveDiskTimer);
      flush();
    } else {
      if (saveDiskTimer) clearTimeout(saveDiskTimer);
      saveDiskTimer = setTimeout(flush, 120);
    }
  }
}

async function saveLocalWallpaper(file) {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  if (window.qusaPersist && typeof window.qusaPersist.saveWallpaper === 'function') {
    await window.qusaPersist.saveWallpaper({
      bytes,
      name: file.name,
      type: file.type || 'application/octet-stream',
    });
  }
}

async function loadLocalWallpaper() {
  try {
    if (window.qusaPersist && typeof window.qusaPersist.loadWallpaper === 'function') {
      const res = await window.qusaPersist.loadWallpaper();
      if (res && res.bytes && res.bytes.length > 0) {
        const blob = new Blob([res.bytes], { type: res.type || 'image/jpeg' });
        return { blob, name: res.name || 'локальные обои', type: res.type || '' };
      }
    }
  } catch (err) {
    console.error('[Qusa] Disk wallpaper load failed:', err);
  }
  return null;
}

async function clearLocalWallpaper() {
  try {
    if (window.qusaPersist && typeof window.qusaPersist.clearWallpaper === 'function') {
      await window.qusaPersist.clearWallpaper();
    }
  } catch {}
  if (activeLocalBlobUrl) {
    URL.revokeObjectURL(activeLocalBlobUrl);
    activeLocalBlobUrl = '';
    activeLocalMime = '';
  }
}

let activeLyricsFontFace = null;

async function loadAndApplyLyricsFont(cfg) {
  const root = document.documentElement;
  const setSystemVars = () => {
    root.style.setProperty('--qusa-lyrics-font', 'system-ui, -apple-system, sans-serif');
    root.style.setProperty('--qusa-lf-weight', '600');
    root.style.setProperty('--qusa-lf-fs-weight', '700');
    root.style.setProperty('--qusa-lf-spacing', '0em');
    root.style.setProperty('--qusa-lf-fs-spacing', '-0.01em');
    root.style.setProperty('--qusa-lf-mini-size', '12px');
    root.style.setProperty('--qusa-lf-exp-size', '13px');
    root.style.setProperty('--qusa-lf-fs-size', '28px');
  };
  const setCustomVars = () => {
    root.style.setProperty('--qusa-lyrics-font', "'QusaLyricsFont', system-ui, -apple-system, sans-serif");
    root.style.setProperty('--qusa-lf-weight', '400');
    root.style.setProperty('--qusa-lf-fs-weight', '400');
    root.style.setProperty('--qusa-lf-spacing', '0.07em');
    root.style.setProperty('--qusa-lf-fs-spacing', '0.055em');
    root.style.setProperty('--qusa-lf-mini-size', '14.5px');
    root.style.setProperty('--qusa-lf-exp-size', '17px');
    root.style.setProperty('--qusa-lf-fs-size', '36px');
  };
  if (cfg.lyricsFontMode === 'system') {
    setSystemVars();
    const st = document.getElementById('qusa-lyrics-font-status');
    if (st) st.textContent = 'Активный шрифт: Системный';
    return;
  }
  if (!window.qusaPersist || typeof window.qusaPersist.loadLyricsFont !== 'function') {
    setSystemVars();
    return;
  }
  try {
    const res = await window.qusaPersist.loadLyricsFont();
    if (res && res.bytes && res.bytes.length > 0) {
      if (activeLyricsFontFace) {
        try { document.fonts.delete(activeLyricsFontFace); } catch {}
        activeLyricsFontFace = null;
      }
      const buf = res.bytes.buffer.slice(res.bytes.byteOffset, res.bytes.byteOffset + res.bytes.byteLength);
      const face = new FontFace('QusaLyricsFont', buf);
      await face.load();
      document.fonts.add(face);
      activeLyricsFontFace = face;
      setCustomVars();
      const label = res.builtin ? `${res.name || 'aahigherup.ttf'} (встроенный)` : (res.name || cfg.lyricsFontName || 'custom.ttf');
      const st = document.getElementById('qusa-lyrics-font-status');
      if (st) st.textContent = `Активный шрифт: ${label}`;
      return;
    }
  } catch (err) {
    console.error('[Qusa] Lyrics font load failed:', err);
  }
  setSystemVars();
  const st = document.getElementById('qusa-lyrics-font-status');
  if (st) st.textContent = 'Активный шрифт: Системный';
}

function hasActiveWallpaper(cfg) {
  return Boolean((cfg.wallpaperUrl && cfg.wallpaperUrl.trim()) || activeLocalBlobUrl);
}

function hexToRgb(hex) {
  const clean = String(hex || '').trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(clean)) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  if (/^[0-9a-f]{6}$/i.test(clean)) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  }
  return null;
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function shiftRgb(rgb, delta) {
  return [
    clamp(Math.round(rgb[0] + delta), 0, 255),
    clamp(Math.round(rgb[1] + delta), 0, 255),
    clamp(Math.round(rgb[2] + delta), 0, 255),
  ];
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function eventToHotkey(e) {
  if (!e || !e.code) return '';
  const parts = [];
  if (e.ctrlKey) parts.push('Ctrl');
  if (e.altKey) parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');
  if (e.metaKey) parts.push('Meta');
  parts.push(e.code);
  return parts.join('+');
}

function formatHotkey(combo) {
  if (!combo) return 'Не задано';
  return combo
    .split('+')
    .map((p) => p.replace(/^Key/, '').replace(/^Digit/, ''))
    .join(' + ');
}

function updateWallpaperLayer(cfg) {
  const wpActive = hasActiveWallpaper(cfg);
  let layer = document.getElementById('qusa-bg-layer');

  if (!wpActive) {
    if (layer) layer.remove();
    return;
  }

  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'qusa-bg-layer';
    layer.innerHTML = '<div id="qusa-bg-media-host"></div><div id="qusa-bg-dim"></div>';
    document.body.appendChild(layer);
  }

  const host = document.getElementById('qusa-bg-media-host');
  if (!host) return;

  const url = (cfg.wallpaperUrl || '').trim() || activeLocalBlobUrl;
  const isVideo = /\.(mp4|webm)(\?|$)/i.test(url) || (url === activeLocalBlobUrl && activeLocalMime.startsWith('video/'));
  const currentSrc = host.getAttribute('data-src') || '';

  if (currentSrc !== url) {
    host.setAttribute('data-src', url);
    host.innerHTML = '';
    if (isVideo) {
      const vid = document.createElement('video');
      vid.id = 'qusa-bg-media';
      vid.src = url;
      vid.autoplay = true;
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.setAttribute('muted', '');
      vid.setAttribute('autoplay', '');
      vid.setAttribute('loop', '');
      vid.setAttribute('playsinline', '');
      vid.onerror = () => {
        const st = document.getElementById('qusa-wp-status');
        if (st) st.textContent = '⚠️ Не удалось воспроизвести видео (Electron часто не поддерживает MP4/H.264 — используй WebM или GIF)';
      };
      host.appendChild(vid);
      void vid.play().catch((err) => {
        console.warn('[Qusa] Video autoplay/codec warning:', err);
        const st = document.getElementById('qusa-wp-status');
        if (st && vid.error) {
          st.textContent = '⚠️ Кодек видео не поддерживается Electron — конвертируй в WebM или GIF';
        }
      });
    } else {
      const img = document.createElement('img');
      img.id = 'qusa-bg-media';
      img.src = url;
      img.alt = '';
      img.onerror = () => {
        img.style.display = 'none';
        const st = document.getElementById('qusa-wp-status');
        if (st) st.textContent = '⚠️ Не удалось загрузить изображение обоев';
      };
      host.appendChild(img);
    }
  }
}

function ensureLiquidGlassFilter() {
  if (document.getElementById('qusa-liquid-svg')) return;
  const wrap = document.createElement('div');
  wrap.id = 'qusa-liquid-svg';
  wrap.style.cssText = 'position:fixed;width:0;height:0;overflow:hidden;pointer-events:none;';
  wrap.innerHTML = `
    <svg width="0" height="0" aria-hidden="true">
      <defs>
        <filter id="qusa-liquid-glass" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="4" result="smoothNoise" />
          <feDisplacementMap in="SourceGraphic" in2="smoothNoise" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  `;
  document.body.appendChild(wrap);
}

function injectStyles(cfg) {
  let styleEl = document.getElementById('qusa-custom-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'qusa-custom-styles';
    document.head.appendChild(styleEl);
  }

  const baseRgb = hexToRgb(cfg.baseColor) || [18, 18, 18];
  const wpActive = hasActiveWallpaper(cfg);
  const isLiquid = cfg.glassStyle === 'liquid';
  const isCustomColor = Boolean(cfg.colorEnabled && cfg.baseColor.toLowerCase() !== '#121212');
  const modalBg = shiftRgb(baseRgb, 10);
  const btnBg = shiftRgb(baseRgb, 16);
  const wpBlur = Number(cfg.wallpaperBlur || 0);
  const wpDim = Number(cfg.wallpaperDim ?? 0.42);
  const glassFilter = isLiquid
    ? 'url(#qusa-liquid-glass) blur(14px) saturate(175%) brightness(1.03)'
    : 'blur(20px) saturate(155%)';
  const sidebarGlassFilter = isLiquid
    ? 'blur(20px) saturate(135%) brightness(0.96)'
    : 'blur(20px) saturate(155%)';
  const glassBorder = isLiquid ? 'rgba(255, 255, 255, 0.26)' : 'rgba(255, 255, 255, 0.14)';
  const sidebarGlassBorder = isLiquid ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.14)';
  const glassShadow = isLiquid
    ? '0 14px 36px rgba(0, 0, 0, 0.40), inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.48), inset 1px 0 1px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.28)'
    : '0 10px 30px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.08)';
  const sidebarGlassShadow = isLiquid
    ? '0 12px 32px rgba(0, 0, 0, 0.38), inset 0 1px 1px 0 rgba(255, 255, 255, 0.22), inset 1px 0 1px 0 rgba(255, 255, 255, 0.10), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.24)'
    : '0 10px 30px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.08)';
  const liquidSheen = isLiquid
    ? 'background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.02) 45%, rgba(255, 255, 255, 0.08) 100%) !important;'
    : '';
  const sidebarLiquidSheen = isLiquid
    ? 'background-image: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 45%, rgba(255, 255, 255, 0.03) 100%) !important;'
    : '';

  styleEl.textContent = `
    ${wpActive ? `
    html, body, #root, #app, #root > div, #root > div > div, main, [class*="chat"], [class*="Chat"], [class*="conversation"] {
      background-color: transparent !important;
      background: transparent !important;
    }
    [class*="bg-gradient-to-"], [class*="bg-linear-to-"], [class*="from-background"], [class*="from-sidebar"], [class*="from-muted"] {
      background-image: none !important;
      background-color: transparent !important;
    }
    [data-qusa-no-bg="1"],
    [data-qusa-no-bg="1"]::before,
    [data-qusa-no-bg="1"]::after {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }
    ${cfg.detachedSidebar !== false ? `
    ${wpActive ? `
    [data-qusa-role="header"] {
      background-color: transparent !important;
      border-bottom: none !important;
    }
    ` : `
    [data-qusa-role="header"] {
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    }
    `}
    [data-qusa-sidebar-root="1"] {
      margin: 2px 4px 8px 8px !important;
      height: calc(100% - 10px) !important;
      box-sizing: border-box !important;
      border-radius: ${isLiquid ? '16px' : '12px'} !important;
      border: 1px solid ${sidebarGlassBorder} !important;
      backdrop-filter: ${sidebarGlassFilter} !important;
      -webkit-backdrop-filter: ${sidebarGlassFilter} !important;
      box-shadow: ${sidebarGlassShadow} !important;
      ${sidebarLiquidSheen}
      overflow: hidden !important;
    }
    iframe[src^="plugin://"], iframe[src^="http://localhost:"], iframe[src^="http://127.0.0.1:"] {
      background: transparent !important;
      background-color: transparent !important;
      color-scheme: dark;
    }
    [data-qusa-sidecar-pane="1"] {
      margin: 2px 8px 8px 4px !important;
      height: calc(100% - 10px) !important;
      box-sizing: border-box !important;
      border-radius: ${isLiquid ? '16px' : '12px'} !important;
      border: 1px solid ${sidebarGlassBorder} !important;
      backdrop-filter: ${sidebarGlassFilter} !important;
      -webkit-backdrop-filter: ${sidebarGlassFilter} !important;
      box-shadow: ${sidebarGlassShadow} !important;
      ${sidebarLiquidSheen}
      overflow: hidden !important;
    }
    ` : ''}
    [role="menu"], [role="listbox"], [role="dialog"] {
      backdrop-filter: ${glassFilter} !important;
      -webkit-backdrop-filter: ${glassFilter} !important;
      border-color: ${glassBorder} !important;
      box-shadow: ${glassShadow} !important;
      ${isLiquid ? 'border-radius: 16px !important;' : ''}
      ${liquidSheen}
    }
    [data-qusa-composer="1"] {
      backdrop-filter: ${glassFilter} !important;
      -webkit-backdrop-filter: ${glassFilter} !important;
      border-color: ${glassBorder} !important;
      box-shadow: ${glassShadow} !important;
      ${liquidSheen}
    }
    #qusa-bg-layer {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none !important;
      overflow: hidden;
      background: ${cfg.baseColor};
    }
    #qusa-bg-layer * {
      pointer-events: none !important;
    }
    #qusa-bg-media {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      ${wpBlur > 0 ? `filter: blur(${wpBlur}px); transform: scale(1.04);` : ''}
    }
    #qusa-bg-dim {
      position: absolute;
      inset: 0;
      background: rgba(5, 7, 12, ${wpDim});
    }
    ` : (isCustomColor ? `
    html, body {
      background-color: ${cfg.baseColor} !important;
    }
    [class*="bg-gradient-to-"], [class*="bg-linear-to-"], [class*="from-background"], [class*="from-sidebar"], [class*="from-muted"] {
      background-image: none !important;
      background-color: transparent !important;
    }
    [data-qusa-no-bg="1"],
    [data-qusa-no-bg="1"]::before,
    [data-qusa-no-bg="1"]::after {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }
    ${cfg.detachedSidebar !== false ? `
    ${wpActive ? `
    [data-qusa-role="header"] {
      background-color: transparent !important;
      border-bottom: none !important;
    }
    ` : `
    [data-qusa-role="header"] {
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    }
    `}
    [data-qusa-sidebar-root="1"] {
      margin: 2px 4px 8px 8px !important;
      height: calc(100% - 10px) !important;
      box-sizing: border-box !important;
      border-radius: ${isLiquid ? '16px' : '12px'} !important;
      border: 1px solid ${sidebarGlassBorder} !important;
      backdrop-filter: ${sidebarGlassFilter} !important;
      -webkit-backdrop-filter: ${sidebarGlassFilter} !important;
      box-shadow: ${sidebarGlassShadow} !important;
      ${sidebarLiquidSheen}
      overflow: hidden !important;
    }
    iframe[src^="plugin://"], iframe[src^="http://localhost:"], iframe[src^="http://127.0.0.1:"] {
      background: transparent !important;
      background-color: transparent !important;
      color-scheme: dark;
    }
    [data-qusa-sidecar-pane="1"] {
      margin: 2px 8px 8px 4px !important;
      height: calc(100% - 10px) !important;
      box-sizing: border-box !important;
      border-radius: ${isLiquid ? '16px' : '12px'} !important;
      border: 1px solid ${sidebarGlassBorder} !important;
      backdrop-filter: ${sidebarGlassFilter} !important;
      -webkit-backdrop-filter: ${sidebarGlassFilter} !important;
      box-shadow: ${sidebarGlassShadow} !important;
      ${sidebarLiquidSheen}
      overflow: hidden !important;
    }
    ` : ''}
    [role="menu"], [role="listbox"], [role="dialog"] {
      backdrop-filter: ${glassFilter} !important;
      -webkit-backdrop-filter: ${glassFilter} !important;
      border-color: ${glassBorder} !important;
      box-shadow: ${glassShadow} !important;
      ${isLiquid ? 'border-radius: 16px !important;' : ''}
      ${liquidSheen}
    }
    [data-qusa-composer="1"] {
      backdrop-filter: ${glassFilter} !important;
      -webkit-backdrop-filter: ${glassFilter} !important;
      border-color: ${glassBorder} !important;
      box-shadow: ${glassShadow} !important;
      ${liquidSheen}
    }
    ` : '')}

    /* Compact Style Button (docked next to Settings in sidebar, fallback bottom-left) */
    #qusa-style-fab {
      display: ${cfg.fabHidden ? 'none' : 'inline-flex'};
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: ${isLiquid ? '999px' : '8px'};
      background: rgba(${btnBg[0]}, ${btnBg[1]}, ${btnBg[2]}, ${isLiquid ? '0.32' : '0.54'});
      backdrop-filter: ${glassFilter};
      -webkit-backdrop-filter: ${glassFilter};
      color: #e2e8f0;
      border: 1px solid ${glassBorder};
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      user-select: none;
      flex-shrink: 0;
      box-shadow: ${isLiquid ? '0 4px 14px rgba(0,0,0,0.32), inset 0 1px 1px rgba(255,255,255,0.42)' : '0 2px 10px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.08)'};
      ${liquidSheen}
      transition: border-color 0.15s ease, background-color 0.15s ease, transform 0.12s ease;
    }
    #qusa-style-fab.qusa-fab-floating {
      position: fixed;
      left: 14px;
      bottom: 12px;
      z-index: 99998;
    }
    #qusa-style-fab.qusa-fab-docked {
      position: static;
      margin-left: auto;
      z-index: 5;
    }
    #qusa-style-fab:hover {
      border-color: rgba(255, 255, 255, 0.36);
      transform: translateY(-0.5px);
    }
    #qusa-fab-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${cfg.baseColor};
      border: 1px solid rgba(255, 255, 255, 0.35);
      display: inline-block;
    }

    /* Customizer Modal */
    #qusa-theme-modal {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(4px);
      font-family: system-ui, -apple-system, sans-serif;
      color: #e2e8f0;
    }
    #qusa-theme-modal.open {
      display: flex;
    }
    .qusa-modal-card {
      width: 470px;
      max-width: 94vw;
      max-height: 88vh;
      overflow-y: auto;
      background: rgba(${modalBg[0]}, ${modalBg[1]}, ${modalBg[2]}, ${isLiquid ? '0.48' : '0.72'});
      backdrop-filter: ${glassFilter};
      -webkit-backdrop-filter: ${glassFilter};
      border: 1px solid ${glassBorder};
      border-radius: ${isLiquid ? '20px' : '14px'};
      padding: 18px 20px;
      box-shadow: ${glassShadow};
      ${liquidSheen}
    }
    .qusa-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .qusa-modal-title {
      font-size: 15px;
      font-weight: 600;
      color: #f8fafc;
    }
    .qusa-close-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
      border-radius: 8px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
    }
    .qusa-close-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }
    .qusa-preset-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin: 10px 0 14px;
    }
    .qusa-preset-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 10px;
      border-radius: 9px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.09);
      cursor: pointer;
      font-size: 12px;
      color: #e2e8f0;
      transition: background-color 0.12s ease, border-color 0.12s ease;
    }
    .qusa-preset-item:hover {
      background: rgba(255, 255, 255, 0.09);
    }
    .qusa-preset-item.active {
      border-color: rgba(255, 255, 255, 0.45);
      background: rgba(255, 255, 255, 0.11);
    }
    .qusa-swatch {
      width: 16px;
      height: 16px;
      border-radius: 5px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      flex-shrink: 0;
    }
    .qusa-field {
      margin-bottom: 12px;
    }
    .qusa-field label {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #cbd5e1;
      margin-bottom: 6px;
    }
    .qusa-color-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .qusa-color-row input[type="color"] {
      width: 40px;
      height: 32px;
      padding: 2px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: transparent;
      cursor: pointer;
    }
    .qusa-input {
      flex: 1;
      min-width: 0;
      padding: 6px 9px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(0, 0, 0, 0.28);
      color: #f8fafc;
      font-size: 12px;
      outline: none;
    }
    .qusa-input:focus {
      border-color: rgba(255, 255, 255, 0.38);
    }
    .qusa-input-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .qusa-field input[type="range"] {
      width: 100%;
      accent-color: #94a3b8;
    }
    .qusa-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 0;
      font-size: 13px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .qusa-details {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 8px;
      margin-top: 2px;
    }
    .qusa-details summary {
      cursor: pointer;
      font-size: 13px;
      color: #e2e8f0;
      user-select: none;
      padding: 4px 0;
    }
    .qusa-wp-box {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .qusa-wp-status {
      font-size: 11.5px;
      color: #94a3b8;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .qusa-models-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-top: 10px;
    }
    .qusa-model-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .qusa-model-orig {
      width: 165px;
      flex-shrink: 0;
      font-size: 11.5px;
      color: #94a3b8;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .qusa-custom-add {
      display: flex;
      gap: 6px;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px dashed rgba(255, 255, 255, 0.10);
    }
    .qusa-footer {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* Spotify Dynamic Island */
    #qusa-spotify-island {
      position: fixed;
      top: 4px;
      left: 50%;
      transform: translateX(-50%) translateY(-10px) scaleX(0.32) scaleY(0.55);
      transform-origin: top center;
      z-index: 99995;
      display: flex;
      flex-direction: column;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      filter: blur(6px);
      background: rgba(14, 18, 26, ${isLiquid ? '0.32' : '0.50'});
      backdrop-filter: ${glassFilter};
      -webkit-backdrop-filter: ${glassFilter};
      border: 1px solid ${glassBorder};
      border-radius: ${isLiquid ? '22px' : '18px'};
      padding: 4px 10px;
      color: #f1f5f9;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: ${glassShadow};
      ${liquidSheen}
      will-change: transform, opacity, width;
      transition: transform 0.46s cubic-bezier(0.4, 0, 0.2, 1),
                  opacity 0.32s cubic-bezier(0.4, 0, 0.2, 1),
                  filter 0.34s ease,
                  visibility 0s linear 0.46s,
                  width 0.42s cubic-bezier(0.32, 0.72, 0, 1),
                  padding 0.42s cubic-bezier(0.32, 0.72, 0, 1),
                  border-radius 0.42s cubic-bezier(0.32, 0.72, 0, 1),
                  border-color 0.32s ease,
                  box-shadow 0.32s ease;
      width: 278px;
      max-width: 90vw;
      overflow: hidden;
      user-select: none;
      -webkit-app-region: no-drag;
    }
    #qusa-spotify-island.visible {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      filter: blur(0px);
      transform: translateX(-50%) translateY(0) scaleX(1) scaleY(1);
      transition: transform 0.54s cubic-bezier(0.16, 1, 0.3, 1),
                  opacity 0.36s ease,
                  filter 0.36s ease,
                  visibility 0s linear 0s,
                  width 0.42s cubic-bezier(0.32, 0.72, 0, 1),
                  padding 0.42s cubic-bezier(0.32, 0.72, 0, 1),
                  border-radius 0.42s cubic-bezier(0.32, 0.72, 0, 1),
                  border-color 0.32s ease,
                  box-shadow 0.32s ease;
    }
    #qusa-spotify-island.playing {
      border-color: rgba(29, 185, 84, 0.38);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.48), 0 0 14px rgba(29, 185, 84, 0.14);
    }
    #qusa-spotify-island.visible:hover, #qusa-spotify-island.visible.expanded {
      width: 326px;
      padding: 8px 12px 10px;
      border-radius: ${isLiquid ? '20px' : '16px'};
    }
    .qsp-compact {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 22px;
    }
    .qsp-art {
      width: 22px;
      height: 22px;
      border-radius: 6px;
      background: rgba(29, 185, 84, 0.16);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
      transition: width 0.40s cubic-bezier(0.32, 0.72, 0, 1),
                  height 0.40s cubic-bezier(0.32, 0.72, 0, 1),
                  border-radius 0.40s cubic-bezier(0.32, 0.72, 0, 1);
    }
    #qusa-spotify-island.visible:hover .qsp-art, #qusa-spotify-island.visible.expanded .qsp-art {
      width: 34px;
      height: 34px;
      border-radius: 8px;
    }
    .qsp-art img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .qsp-meta {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }
    .qsp-title {
      font-size: 11.5px;
      font-weight: 600;
      color: #f8fafc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .qsp-artist {
      font-size: 10px;
      color: #94a3b8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .qsp-mini-btns {
      display: flex;
      align-items: center;
      gap: 2px;
      flex-shrink: 0;
      max-width: 82px;
      opacity: 1;
      overflow: hidden;
      transition: max-width 0.36s cubic-bezier(0.32, 0.72, 0, 1),
                  opacity 0.24s ease;
    }
    #qusa-spotify-island.visible:hover .qsp-mini-btns, #qusa-spotify-island.visible.expanded .qsp-mini-btns {
      max-width: 0;
      opacity: 0;
      pointer-events: none;
    }
    .qsp-btn {
      background: transparent;
      border: none;
      color: #cbd5e1;
      width: 24px;
      height: 24px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
      padding: 0;
      transition: background-color 0.14s ease, color 0.14s ease, transform 0.12s ease;
    }
    .qsp-btn:hover {
      background: rgba(255, 255, 255, 0.10);
      color: #ffffff;
    }
    .qsp-btn:active {
      transform: scale(0.92);
    }
    .qsp-btn.primary {
      background: #1db954;
      color: #07120a;
      width: 28px;
      height: 28px;
      font-weight: 700;
    }
    .qsp-btn.primary:hover {
      background: #1ed760;
      color: #051008;
    }
    .qsp-btn.active {
      color: #1db954;
    }
    .qsp-btn.liked {
      color: #ff6ba9;
    }
    .qsp-expand-wrap {
      display: grid;
      grid-template-rows: 0fr;
      margin-top: 0;
      opacity: 0;
      pointer-events: none;
      transition: grid-template-rows 0.42s cubic-bezier(0.32, 0.72, 0, 1),
                  margin-top 0.42s cubic-bezier(0.32, 0.72, 0, 1),
                  opacity 0.28s cubic-bezier(0.32, 0.72, 0, 1);
    }
    #qusa-spotify-island.visible:hover .qsp-expand-wrap, #qusa-spotify-island.visible.expanded .qsp-expand-wrap {
      grid-template-rows: 1fr;
      margin-top: 8px;
      opacity: 1;
      pointer-events: auto;
    }
    .qsp-expand {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 0;
      overflow: hidden;
      padding-top: 0;
      border-top: 1px solid transparent;
      transform: translateY(-6px) scale(0.97);
      transition: padding-top 0.42s cubic-bezier(0.32, 0.72, 0, 1),
                  transform 0.42s cubic-bezier(0.32, 0.72, 0, 1),
                  border-color 0.30s ease;
    }
    #qusa-spotify-island.visible:hover .qsp-expand, #qusa-spotify-island.visible.expanded .qsp-expand {
      padding-top: 8px;
      border-top-color: rgba(255, 255, 255, 0.08);
      transform: translateY(0) scale(1);
    }
    .qsp-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .qsp-quick {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 6px;
    }
    .qsp-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 5px 6px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.09);
      color: #e2e8f0;
      font-size: 10.5px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: background-color 0.14s ease, border-color 0.14s ease;
    }
    .qsp-chip:hover {
      background: rgba(29, 185, 84, 0.16);
      border-color: rgba(29, 185, 84, 0.42);
      color: #ffffff;
    }
    .qsp-chip.has-lyrics {
      border-color: rgba(255, 255, 255, 0.22);
      color: #f8fafc;
    }
    .qsp-live-bar {
      display: none;
      font-family: var(--qusa-lyrics-font, 'QusaLyricsFont', system-ui, -apple-system, sans-serif);
      font-size: var(--qusa-lf-mini-size, 14.5px);
      font-weight: var(--qusa-lf-weight, 400);
      font-synthesis: none;
      letter-spacing: var(--qusa-lf-spacing, 0.07em);
      line-height: 1.25;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 10px 8px;
      margin: -10px -8px;
      color: rgba(226, 232, 240, 0.45);
      cursor: pointer;
    }
    #qusa-spotify-island.auto-width.has-live-lyric:not(:hover):not(.expanded) {
      width: var(--qsp-dyn-w, 278px);
    }
    #qusa-spotify-island.has-live-lyric:not(:hover):not(.expanded) .qsp-meta-text {
      display: none;
    }
    #qusa-spotify-island.has-live-lyric:not(:hover):not(.expanded) .qsp-live-bar {
      display: block;
    }
    .qsp-expand-lyric {
      display: none;
      font-family: var(--qusa-lyrics-font, 'QusaLyricsFont', system-ui, -apple-system, sans-serif);
      text-align: center;
      font-size: var(--qusa-lf-exp-size, 17px);
      font-weight: var(--qusa-lf-weight, 400);
      font-synthesis: none;
      letter-spacing: var(--qusa-lf-spacing, 0.07em);
      line-height: 1.4;
      color: rgba(226, 232, 240, 0.46);
      padding: 2px 4px;
      cursor: pointer;
    }
    .qsp-expand-lyric.show {
      display: block;
    }
    .qsp-w {
      display: inline-block;
      margin-right: 0.28em;
      padding: 0;
      color: inherit;
      transform-origin: center bottom;
      transition: color 0.16s ease,
                  transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
                  padding 0.22s cubic-bezier(0.22, 1, 0.36, 1),
                  text-shadow 0.18s ease;
    }
    .qsp-w:first-child {
      transform-origin: left bottom;
    }
    .qsp-w:last-child {
      margin-right: 0;
    }
    .qsp-w.past {
      color: rgba(255, 255, 255, 0.88);
    }
    .qsp-w.cur {
      color: #ffffff;
      padding: 0 0.24em;
      transform: scale(1.07) translateY(-0.5px);
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.58);
    }
    .qsp-w.cur:first-child {
      padding-left: 0;
      padding-right: 0.34em;
    }
    .qsp-fs-line.active {
      color: rgba(255, 255, 255, 0.46);
      transform: scale(1.02);
      text-shadow: none;
    }
    .qsp-fs-line.active .qsp-w.past {
      color: rgba(255, 255, 255, 0.90);
      text-shadow: 0 0 12px rgba(255, 255, 255, 0.22);
    }
    .qsp-fs-line.active .qsp-w.cur {
      color: #ffffff;
      padding: 0 0.28em;
      transform: scale(1.09) translateY(-1.5px);
      text-shadow: 0 0 26px rgba(255, 255, 255, 0.85);
    }
    .qsp-fs-line.active .qsp-w.cur:first-child {
      padding-left: 0;
      padding-right: 0.40em;
    }
    .qsp-progress-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 2px 2px 0;
    }
    .qsp-progress-track {
      position: relative;
      height: 14px;
      display: flex;
      align-items: center;
      cursor: pointer;
      touch-action: none;
    }
    .qsp-progress-track::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 4px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
      transition: height 0.14s ease, background-color 0.14s ease;
    }
    .qsp-progress-track:hover::before,
    .qsp-progress-track.dragging::before {
      height: 5px;
      background: rgba(255, 255, 255, 0.26);
    }
    .qsp-progress-fill {
      position: relative;
      height: 4px;
      width: 0%;
      border-radius: 999px;
      background: #ffffff;
      pointer-events: none;
      transition: width 0.10s linear, height 0.14s ease;
    }
    .qsp-progress-track:hover .qsp-progress-fill,
    .qsp-progress-track.dragging .qsp-progress-fill {
      height: 5px;
      background: #1ed760;
    }
    .qsp-progress-track.dragging .qsp-progress-fill {
      transition: none;
    }
    .qsp-progress-fill::after {
      content: '';
      position: absolute;
      right: -5px;
      top: 50%;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.55);
      transform: translateY(-50%) scale(0.4);
      opacity: 0;
      transition: transform 0.14s ease, opacity 0.14s ease;
    }
    .qsp-progress-track:hover .qsp-progress-fill::after,
    .qsp-progress-track.dragging .qsp-progress-fill::after {
      transform: translateY(-50%) scale(1);
      opacity: 1;
    }
    .qsp-times {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
      color: rgba(226, 232, 240, 0.78);
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.01em;
    }
    .qsp-eq {
      display: inline-flex;
      align-items: flex-end;
      gap: 2px;
      height: 14px;
      margin-left: 2px;
      flex-shrink: 0;
    }
    .qsp-eq i {
      width: 2.5px;
      background: #1db954;
      border-radius: 1.5px;
      height: 3px;
      display: block;
      transition: height 85ms ease-out;
    }

    /* Fullscreen Live Lyrics Overlay */
    #qusa-lyrics-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: scale(1.03);
      transition: opacity 0.36s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.38s cubic-bezier(0.22, 1, 0.36, 1),
                  visibility 0s linear 0.38s;
      font-family: system-ui, -apple-system, sans-serif;
      color: #f8fafc;
      user-select: none;
      -webkit-app-region: no-drag;
      overflow: hidden;
      background: #090b10;
    }
    #qusa-lyrics-overlay.open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: scale(1);
      transition: opacity 0.36s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.40s cubic-bezier(0.16, 1, 0.3, 1),
                  visibility 0s linear 0s;
    }
    #qsp-fs-bg {
      position: absolute;
      inset: -12%;
      background-size: cover;
      background-position: center;
      filter: blur(84px) saturate(185%) brightness(0.42);
      transform: scale(1.12);
      transition: background-image 0.6s ease;
      pointer-events: none;
    }
    #qsp-fs-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 30% 45%, rgba(15, 20, 30, 0.12) 0%, rgba(5, 7, 12, 0.72) 100%);
      pointer-events: none;
    }
    #qsp-fs-close {
      position: absolute;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 5;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: rgba(255, 255, 255, 0.85);
      width: 44px;
      height: 26px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(12px);
      transition: background-color 0.16s ease, transform 0.16s ease;
    }
    #qsp-fs-close:hover {
      background: rgba(255, 255, 255, 0.18);
      transform: translateX(-50%) translateY(1px);
    }
    .qsp-fs-body {
      position: relative;
      z-index: 2;
      width: min(1060px, 92vw);
      height: min(640px, 82vh);
      display: grid;
      grid-template-columns: 310px 1fr;
      gap: 56px;
      align-items: center;
    }
    @media (max-width: 780px) {
      .qsp-fs-body {
        grid-template-columns: 1fr;
        gap: 24px;
        height: 86vh;
      }
    }
    .qsp-fs-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .qsp-fs-art {
      width: 264px;
      height: 264px;
      border-radius: 18px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.06);
      box-shadow: 0 26px 64px rgba(0, 0, 0, 0.58), 0 0 0 1px rgba(255, 255, 255, 0.10);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qsp-fs-art img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .qsp-fs-meta {
      width: 100%;
      text-align: center;
    }
    .qsp-fs-title {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .qsp-fs-artist {
      font-size: 13.5px;
      color: rgba(226, 232, 240, 0.72);
      margin-top: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .qsp-fs-left .qsp-progress-wrap {
      width: 100%;
    }
    .qsp-fs-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 2px;
    }
    .qsp-fs-controls .qsp-btn {
      width: 36px;
      height: 36px;
      font-size: 16px;
    }
    .qsp-fs-controls .qsp-btn.primary {
      width: 44px;
      height: 44px;
      font-size: 17px;
      background: rgba(255, 255, 255, 0.94);
      color: #090b10;
    }
    .qsp-fs-controls .qsp-btn.primary:hover {
      background: #ffffff;
      transform: scale(1.05);
    }
    .qsp-fs-right {
      height: 100%;
      overflow-y: auto;
      padding: 28vh 26px;
      scrollbar-width: none;
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%);
      mask-image: linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%);
    }
    .qsp-fs-right::-webkit-scrollbar {
      display: none;
    }
    .qsp-fs-line {
      font-family: var(--qusa-lyrics-font, 'QusaLyricsFont', system-ui, -apple-system, sans-serif);
      font-size: var(--qusa-lf-fs-size, 36px);
      font-weight: var(--qusa-lf-fs-weight, 400);
      font-synthesis: none;
      line-height: 1.38;
      letter-spacing: var(--qusa-lf-fs-spacing, 0.055em);
      padding: 10px 0;
      color: rgba(255, 255, 255, 0.36);
      transform-origin: left center;
      transform: scale(0.97);
      cursor: pointer;
      transition: color 0.32s ease,
                  transform 0.36s cubic-bezier(0.22, 1, 0.36, 1),
                  text-shadow 0.32s ease,
                  opacity 0.32s ease;
    }
    .qsp-fs-line:hover {
      color: rgba(255, 255, 255, 0.72);
    }
    .qsp-fs-line.past {
      color: rgba(255, 255, 255, 0.28);
    }
    .qsp-fs-line.plain {
      color: rgba(241, 245, 249, 0.82);
      transform: none;
      cursor: default;
      font-size: 22px;
      padding: 7px 0;
    }
    .qsp-fs-empty {
      font-size: 20px;
      font-weight: 600;
      color: rgba(226, 232, 240, 0.48);
      padding-top: 40px;
    }

    /* Weather Physics Overlay Canvas */
    #qusa-weather-canvas {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 99985;
      pointer-events: none !important;
      display: ${cfg.weatherEffect && cfg.weatherEffect !== 'none' ? 'block' : 'none'};
    }
    .qusa-seg-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }
    .qusa-seg-btn {
      padding: 6px 8px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.10);
      color: #cbd5e1;
      font-size: 12px;
      cursor: pointer;
      text-align: center;
      transition: background-color 0.12s ease, border-color 0.12s ease;
    }
    .qusa-seg-btn:hover {
      background: rgba(255, 255, 255, 0.09);
    }
    .qusa-seg-btn.active {
      background: rgba(255, 255, 255, 0.14);
      border-color: rgba(255, 255, 255, 0.45);
      color: #ffffff;
      font-weight: 600;
    }

    /* Anty Mascot */
    #qusa-anty {
      position: fixed;
      z-index: 99990;
      width: ${cfg.antySize || 58}px;
      height: ${cfg.antySize || 58}px;
      display: ${cfg.antyEnabled !== false && cfg.antyCharacter !== 'rei' ? 'block' : 'none'};
      user-select: none;
      cursor: grab;
      pointer-events: auto;
      will-change: left, top;
      filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45));
    }
    #qusa-anty:active {
      cursor: grabbing;
    }
    #qusa-anty-flip {
      width: 100%;
      height: 100%;
      transition: transform 0.16s ease;
    }
    #qusa-anty[data-dir="left"] #qusa-anty-flip {
      transform: scaleX(-1);
    }
    #qusa-anty-sprite {
      width: 100%;
      height: 100%;
      transform-origin: center bottom;
    }
    #qusa-anty-sprite svg {
      width: 100%;
      height: 100%;
      display: block;
      image-rendering: pixelated;
    }
    #qusa-anty[data-state="idle"] #qusa-anty-sprite {
      animation: none;
    }
    #qusa-anty[data-state="walking"] #qusa-anty-sprite {
      animation: qusa-anty-walk 0.36s steps(2, end) infinite;
    }
    #qusa-anty[data-state="walking"] .anty-leg-l {
      animation: qusa-anty-step-l 0.36s steps(2, end) infinite;
    }
    #qusa-anty[data-state="walking"] .anty-leg-r {
      animation: qusa-anty-step-r 0.36s steps(2, end) infinite;
    }
    #qusa-anty[data-state="walking"] .anty-arm-l {
      animation: qusa-anty-arm-l 0.36s steps(2, end) infinite;
    }
    #qusa-anty[data-state="walking"] .anty-arm-r {
      animation: qusa-anty-arm-r 0.36s steps(2, end) infinite;
    }
    #qusa-anty[data-state="walking"] .anty-tail {
      animation: qusa-anty-tail 0.36s steps(2, end) infinite;
    }
    #qusa-anty[data-state="working"] #qusa-anty-sprite {
      animation: qusa-anty-work 0.45s ease-in-out infinite;
    }
    #qusa-anty[data-state="asking"] #qusa-anty-sprite {
      animation: qusa-anty-curious 1.8s ease-in-out infinite;
    }
    #qusa-anty[data-state="completed"] #qusa-anty-sprite {
      animation: qusa-anty-happy 0.55s ease-in-out infinite;
    }
    #qusa-anty[data-state="sleeping"] #qusa-anty-sprite {
      animation: qusa-anty-sleep 3.2s ease-in-out infinite;
    }
    #qusa-anty[data-state="petting"] #qusa-anty-sprite {
      animation: qusa-anty-pet 0.38s ease-in-out infinite;
    }
    .qusa-anty-heart {
      position: absolute;
      pointer-events: none;
      font-size: 13px;
      line-height: 1;
      color: #ff75bd;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
      animation: qusa-anty-heart-rise 0.95s ease-out forwards;
      z-index: 2;
    }
    #qusa-anty-bubble {
      position: absolute;
      bottom: calc(100% + 2px);
      left: 50%;
      transform: translateX(-50%) translateY(4px);
      background: rgba(16, 18, 28, 0.92);
      color: #f1f5f9;
      border: 1px solid rgba(182, 108, 255, 0.38);
      border-radius: 10px;
      padding: 3px 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.18s ease, transform 0.18s ease;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
    }
    #qusa-anty-bubble.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    @keyframes qusa-anty-walk {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    @keyframes qusa-anty-step-l {
      0%, 100% { transform: translate(-6px, -10px); }
      50% { transform: translate(7px, 0); }
    }
    @keyframes qusa-anty-step-r {
      0%, 100% { transform: translate(7px, 0); }
      50% { transform: translate(-6px, -10px); }
    }
    @keyframes qusa-anty-arm-l {
      0%, 100% { transform: translate(5px, -4px); }
      50% { transform: translate(-5px, 3px); }
    }
    @keyframes qusa-anty-arm-r {
      0%, 100% { transform: translate(-5px, 3px); }
      50% { transform: translate(5px, -4px); }
    }
    @keyframes qusa-anty-tail {
      0%, 100% { transform: translateY(-5px); }
      50% { transform: translateY(3px); }
    }
    @keyframes qusa-anty-work {
      0%, 100% { transform: translateY(0) rotate(-1.5deg); }
      50% { transform: translateY(-2px) rotate(1.5deg); }
    }
    @keyframes qusa-anty-curious {
      0%, 100% { transform: rotate(-4deg) translateY(0); }
      50% { transform: rotate(4deg) translateY(-2px); }
    }
    @keyframes qusa-anty-happy {
      0%, 100% { transform: translateY(0) scale(1); }
      45% { transform: translateY(-9px) scale(1.06); }
    }
    @keyframes qusa-anty-sleep {
      0%, 100% { transform: scaleY(1) scaleX(1); }
      50% { transform: scaleY(0.95) scaleX(1.03); }
    }
    @keyframes qusa-anty-pet {
      0%, 100% { transform: scaleX(1.06) scaleY(0.91) rotate(-4deg); }
      50% { transform: scaleX(1.08) scaleY(0.89) rotate(4deg); }
    }
    @keyframes qusa-anty-heart-rise {
      0% { opacity: 1; transform: translate(-50%, 0) scale(0.8); }
      100% { opacity: 0; transform: translate(-50%, -32px) scale(1.25); }
    }
  `;

  const dot = document.getElementById('qusa-fab-dot');
  if (dot) dot.style.background = cfg.baseColor;
}

const INTERACTIVE_SELECTOR = 'button, a, input, select, [role="button"], [role="menuitem"], [role="option"], [role="tab"]';

let _colorCanvasCtx = null;
const _colorParseCache = new Map();

function parseAnyCssColor(cssStr) {
  if (!cssStr || cssStr === 'transparent' || cssStr === 'rgba(0, 0, 0, 0)') return null;
  if (_colorParseCache.has(cssStr)) return _colorParseCache.get(cssStr);

  const m = cssStr.match(/^rgba?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  if (m) {
    let a = 1;
    if (m[4] !== undefined) {
      a = m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    }
    const res = [Math.round(parseFloat(m[1])), Math.round(parseFloat(m[2])), Math.round(parseFloat(m[3])), a];
    _colorParseCache.set(cssStr, res);
    return res;
  }

  try {
    if (!_colorCanvasCtx) {
      const c = document.createElement('canvas');
      c.width = 1;
      c.height = 1;
      _colorCanvasCtx = c.getContext('2d', { willReadFrequently: true });
    }
    _colorCanvasCtx.clearRect(0, 0, 1, 1);
    _colorCanvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    _colorCanvasCtx.fillStyle = cssStr;
    _colorCanvasCtx.fillRect(0, 0, 1, 1);
    const d = _colorCanvasCtx.getImageData(0, 0, 1, 1).data;
    const res = [d[0], d[1], d[2], d[3] / 255];
    _colorParseCache.set(cssStr, res);
    return res;
  } catch {
    _colorParseCache.set(cssStr, null);
    return null;
  }
}

function applySurfaceColors(cfg) {
  const baseRgb = hexToRgb(cfg.baseColor) || [18, 18, 18];
  const sidebarRgb = hexToRgb(cfg.sidebarColor) || [24, 24, 24];
  const contrast = Number.isFinite(cfg.panelContrast) ? cfg.panelContrast : 1.0;
  const wpActive = hasActiveWallpaper(cfg);
  const pAlpha = Number.isFinite(cfg.panelAlpha) ? cfg.panelAlpha : 0.68;

  const shouldApply = Boolean(
    wpActive ||
    (cfg.colorEnabled &&
      (cfg.baseColor.toLowerCase() !== '#121212' || (cfg.separateSidebar && cfg.sidebarColor.toLowerCase() !== '#181818') || contrast !== 1.0))
  );

  const els = document.querySelectorAll('div, main, section, aside, nav, header, footer, pre, form');
  for (const el of els) {
    if (el.id && el.id.startsWith('qusa-')) continue;
    if (el.closest('#qusa-theme-modal, #qusa-style-fab, #qusa-telemetry-bar, #qusa-bg-layer, #qusa-anty, #qusa-rei-pet, #qusa-spotify-island, #qusa-lyrics-overlay')) continue;
    if (el.matches(INTERACTIVE_SELECTOR)) continue;

    let origStr = el.getAttribute('data-qusa-orig-bg');
    let role = el.getAttribute('data-qusa-role');

    if (!origStr) {
      const rect = el.getBoundingClientRect();
      // Clean dark gradient/solid backdrop boxes in the top-right bar (including narrow fade strips next to icons)
      if (shouldApply && rect.top <= 88 && rect.height >= 12 && rect.height <= 56 && rect.right >= window.innerWidth - 360 && rect.width >= 6 && rect.width <= 320) {
        const csTop = getComputedStyle(el);
        const csTopB = getComputedStyle(el, '::before');
        const csTopA = getComputedStyle(el, '::after');
        const hasTopGrad = (csTop.backgroundImage && csTop.backgroundImage !== 'none') ||
          (csTopB.backgroundImage && csTopB.backgroundImage !== 'none') ||
          (csTopA.backgroundImage && csTopA.backgroundImage !== 'none');
        const pTop = parseAnyCssColor(csTop.backgroundColor);
        const isTopDarkBox = rect.right >= window.innerWidth - 120 && pTop && pTop[3] >= 0.5 && pTop[0] <= 68 && pTop[1] <= 68 && pTop[2] <= 68;
        if (hasTopGrad || isTopDarkBox) {
          el.setAttribute('data-qusa-no-bg', '1');
          continue;
        }
      }
      const inSidebar = Boolean(el.closest('[data-qusa-role="sidebar"], [data-qusa-sidebar-root="1"]'));
      if (inSidebar && shouldApply && rect.width >= 20 && rect.height >= 12 && rect.height <= 140) {
        const csSide = getComputedStyle(el);
        if (csSide.backgroundImage && csSide.backgroundImage.includes('gradient')) {
          el.style.setProperty('background-image', 'none', 'important');
          el.style.setProperty('background-color', 'transparent', 'important');
          continue;
        }
      }
      if (rect.width < 80 || rect.height < 18) continue;
      const cs = getComputedStyle(el);

      if (shouldApply && rect.width > 260 && rect.height > 12 && rect.height <= 140 && cs.backgroundImage && cs.backgroundImage.includes('gradient') && el.innerText.trim() === '') {
        el.style.setProperty('background-image', 'none', 'important');
        el.style.setProperty('background-color', 'transparent', 'important');
        continue;
      }

      const parsed = parseAnyCssColor(cs.backgroundColor);
      if (!parsed) continue;
      const [r, g, b, a] = parsed;

      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      if (a < 0.85 || spread > 18 || r > 68 || g > 68 || b > 68) continue;

      origStr = `${r},${g},${b},${a}`;
      el.setAttribute('data-qusa-orig-bg', origStr);

      const isPopup = Boolean(el.matches('[role="listbox"], [role="menu"], [role="dialog"]') || el.closest('[role="listbox"], [role="menu"], [role="dialog"]'));
      const clsStr = typeof el.className === 'string' ? el.className : '';
      const isHeader = !isPopup && (
        el.tagName === 'HEADER' ||
        (rect.top <= 42 && rect.height <= 48 && rect.width > window.innerWidth * 0.4)
      );
      const isInsideSidebar = !isHeader && Boolean(el.parentElement && el.parentElement.closest('[data-qusa-role="sidebar"]'));
      const isSidebarItem = !isPopup && !isHeader && (
        (isInsideSidebar && rect.height <= 56) ||
        (rect.left <= 36 && rect.right <= 390 && rect.width >= 100 && rect.height >= 18 && rect.height <= 56 && rect.top >= 48)
      );
      const isSidebar = !isPopup && !isHeader && !isSidebarItem && (
        el.tagName === 'ASIDE' ||
        el.tagName === 'NAV' ||
        Boolean(el.closest('aside, nav, [data-qusa-role="sidebar"]')) ||
        /sidebar/i.test(clsStr) ||
        (rect.left <= 24 && rect.right <= 390 && rect.width >= 140 && rect.height > window.innerHeight * 0.35)
      );
      const borderRad = parseFloat(cs.borderRadius) || 0;
      const isCard = !isPopup && !isSidebar && !isSidebarItem && !isHeader && (
        el.tagName === 'PRE' ||
        el.tagName === 'FORM' ||
        (borderRad >= 8 && rect.width < window.innerWidth * 0.72 && rect.height < window.innerHeight * 0.75)
      );
      role = isPopup ? 'popup' : isHeader ? 'header' : isSidebarItem ? 'sidebar-item' : isSidebar ? 'sidebar' : isCard ? 'card' : 'canvas';
      el.setAttribute('data-qusa-role', role);
      if (role === 'sidebar' && rect.height > window.innerHeight * 0.5 && !(el.parentElement && el.parentElement.closest('[data-qusa-sidebar-root="1"]'))) {
        el.setAttribute('data-qusa-sidebar-root', '1');
      }
    }

    if (!shouldApply) {
      el.style.removeProperty('background-color');
      continue;
    }

    if (wpActive && (role === 'canvas' || role === 'sidebar-item' || role === 'header')) {
      el.style.setProperty('background-color', 'transparent', 'important');
      continue;
    }
    if (wpActive && role === 'sidebar' && el.getAttribute('data-qusa-sidebar-root') !== '1' && el.closest('[data-qusa-sidebar-root="1"]')) {
      el.style.setProperty('background-color', 'transparent', 'important');
      continue;
    }

    const parts = origStr.split(',').map(Number);
    const origLum = (parts[0] + parts[1] + parts[2]) / 3;
    const origA = parts[3];

    let targetRgb = cfg.colorEnabled ? baseRgb : [18, 18, 18];
    let refLum = 18;
    if (cfg.colorEnabled && cfg.separateSidebar && (role === 'sidebar' || role === 'sidebar-item')) {
      targetRgb = sidebarRgb;
      refLum = 24;
    }

    const delta = (origLum - refLum) * (cfg.colorEnabled ? contrast : 1.0);
    const shifted = shiftRgb(targetRgb, delta);

    let outAlpha = origA;
    const isLiquid = cfg.glassStyle === 'liquid';
    if (wpActive) {
      if (role === 'popup') {
        outAlpha = isLiquid ? Math.min(0.46, Math.max(0.28, pAlpha * 0.72)) : Math.min(0.68, Math.max(0.45, pAlpha));
      } else if (role === 'sidebar') {
        outAlpha = isLiquid ? Math.max(0.38, pAlpha * 0.90) : pAlpha;
      } else {
        outAlpha = isLiquid ? Math.max(0.22, pAlpha * 0.72) : pAlpha;
      }
    } else if (role === 'popup') {
      outAlpha = isLiquid ? 0.52 : 0.72;
    }

    const colorVal = outAlpha < 1
      ? `rgba(${shifted[0]}, ${shifted[1]}, ${shifted[2]}, ${outAlpha})`
      : `rgb(${shifted[0]}, ${shifted[1]}, ${shifted[2]})`;
    el.style.setProperty('background-color', colorVal, 'important');
  }

  // Style sidecar plugin panes (e.g. Swarm in Antigravity 2.35+) as matching floating glass panels
  const sidecarIframes = document.querySelectorAll('iframe[src^="plugin://"], iframe[src^="http://localhost:"], iframe[src^="http://127.0.0.1:"]');
  const isLiquidSide = cfg.glassStyle === 'liquid';
  const sideRgb = cfg.colorEnabled ? baseRgb : [18, 18, 18];
  const sideAlpha = wpActive ? (isLiquidSide ? Math.max(0.36, pAlpha * 0.86) : pAlpha) : 0.96;
  for (const ifr of sidecarIframes) {
    const rI = ifr.getBoundingClientRect();
    if (rI.width < 180 || rI.height < 180) continue;
    ifr.style.setProperty('background', 'transparent', 'important');
    ifr.style.setProperty('background-color', 'transparent', 'important');
    const pane = ifr.parentElement;
    if (pane && pane !== document.body) {
      if (shouldApply) {
        pane.setAttribute('data-qusa-sidecar-pane', '1');
        pane.style.setProperty('background-color', `rgba(${sideRgb[0]}, ${sideRgb[1]}, ${sideRgb[2]}, ${sideAlpha})`, 'important');
      } else {
        pane.removeAttribute('data-qusa-sidecar-pane');
        pane.style.removeProperty('background-color');
      }
    }
  }

  // Clean solid dark-gray backgrounds on project folder headers/buttons inside sidebar
  const sidebarRoot = document.querySelector('[data-qusa-sidebar-root="1"]');
  if (sidebarRoot) {
    const sbButtons = sidebarRoot.querySelectorAll('button, [role="button"], div');
    for (const btn of sbButtons) {
      if (btn.id === 'qusa-style-fab' || btn.closest('#qusa-style-fab')) continue;
      if (btn === sidebarRoot) continue;
      if (!shouldApply || !wpActive) {
        if (btn.getAttribute('data-qusa-sb-clean') === '1') {
          btn.style.removeProperty('background-color');
          btn.style.removeProperty('background-image');
          btn.removeAttribute('data-qusa-sb-clean');
        }
        continue;
      }
      const csB = getComputedStyle(btn);
      if (csB.backgroundImage && csB.backgroundImage.includes('gradient')) {
        btn.style.setProperty('background-image', 'none', 'important');
        btn.style.setProperty('background-color', 'transparent', 'important');
        btn.setAttribute('data-qusa-sb-clean', '1');
        continue;
      }
      const pB = parseAnyCssColor(csB.backgroundColor);
      if (!pB) continue;
      const [br, bg, bb, ba] = pB;
      const bSpread = Math.max(br, bg, bb) - Math.min(br, bg, bb);
      if (ba >= 0.72 && bSpread <= 18 && br <= 68 && bg <= 68 && bb <= 68) {
        btn.style.setProperty('background-color', 'rgba(255, 255, 255, 0.04)', 'important');
        btn.setAttribute('data-qusa-sb-clean', '1');
      }
    }
  }
}

// --- Reversible Text Transforms (Model Renaming + Russian Translation) ---

const origTextMap = new WeakMap();
const lastAppliedMap = new WeakMap();
const thoughtTransCache = new Map();
const pendingThoughtNodes = new Map(); // trimmed -> Set<Text>
let thoughtFlushTimer = null;
let detectedAccountName = '';

const THOUGHT_STEP_RE = /^(?:Worked for|Thought for|Thinking|Working|Ran|Running|Edited|Editing|Edit|Created|Creating|Create|Read|Reading|Viewed|Viewing|View|Deleted|Deleting|Delete|Removed|Removing|Remove|Updated|Updating|Update|Checked|Checking|Check|Searched|Searching|Search|Listed|Listing|List|Found|Finding|Find|Analyzed|Analyzing|Analyze|Inspected|Inspecting|Inspect|Built|Building|Build|Validated|Validating|Validate|Verified|Verifying|Verify|Fixed|Fixing|Fix|Added|Adding|Add|Installed|Installing|Install|Fetched|Fetching|Fetch|Downloaded|Downloading|Download|Uploaded|Uploading|Upload|Patched|Patching|Patch|Repacked|Repacking|Repack|Committed|Commit|Pushed|Pushing|Push|Published|Publishing|Publish|Tested|Testing|Test|Parsed|Parsing|Parse|Extracted|Extracting|Extract|Copied|Copying|Copy|Moved|Moving|Move|Renamed|Renaming|Rename|Wrote|Writing|Write|Saved|Saving|Save|Loaded|Loading|Load|Opened|Opening|Open|Started|Starting|Start|Stopped|Stopping|Stop|Restarted|Restarting|Restart|Called|Calling|Call|Queried|Querying|Query|Looked up|Looking up|Diagnosed|Diagnosing|Diagnose|Rebuilt|Rebuilding|Rebuild|Init|Initialize)\b/i;

const SINGLE_STEP_WORDS = {
  Ran: 'Выполнено',
  Running: 'Выполняется',
  Edited: 'Изменён',
  Editing: 'Изменение',
  Created: 'Создан',
  Creating: 'Создание',
  Read: 'Прочитан',
  Reading: 'Чтение',
  Viewed: 'Просмотрен',
  Viewing: 'Просмотр',
  Deleted: 'Удалён',
  Removed: 'Удалён',
  Updated: 'Обновлён',
  Saved: 'Сохранён',
  Searched: 'Поиск',
  Searching: 'Поиск...',
  Thinking: 'Думаю',
  Working: 'Работаю',
};

const MODEL_IGNORE_RE = /^(?:Gemini|Claude|GPT-OSS|Orchestrator|Main Agent|Remote Control|Open IDE|Local Checkout)\b/i;

function translateThoughtFastLocal(trimmed) {
  if (SINGLE_STEP_WORDS[trimmed]) return SINGLE_STEP_WORDS[trimmed];
  let m = trimmed.match(/^Worked for\s+(.+)$/i);
  if (m) {
    const dur = m[1].replace(/(\d+)\s*h\b/gi, '$1ч').replace(/(\d+)\s*m\b/gi, '$1м').replace(/(\d+)\s*s\b/gi, '$1с');
    return `Работал ${dur}`;
  }
  m = trimmed.match(/^Thought for\s+(.+)$/i);
  if (m) {
    const dur = m[1].replace(/(\d+)\s*h\b/gi, '$1ч').replace(/(\d+)\s*m\b/gi, '$1м').replace(/(\d+)\s*s\b/gi, '$1с');
    return `Думал ${dur}`;
  }
  // Exact single-filename actions like "Edited qusaCustomUI.js", "Read README.md", "Created patch_asar.py"
  m = trimmed.match(/^(Edited|Created|Read|Viewed|Deleted|Removed|Updated|Saved|Opened)\s+([^\s]+\.[A-Za-z0-9]{1,8}(?:\s*.*)?)$/);
  if (m && !/[A-Za-z]{3,}\s+[A-Za-z]{3,}/.test(m[2])) {
    return `${SINGLE_STEP_WORDS[m[1]] || m[1]} ${m[2]}`;
  }
  return null;
}

function isThoughtHeaderNode(trimmed, parentEl) {
  if (!trimmed || trimmed.length < 3 || trimmed.length > 260) return false;
  if (trimmed.includes('\n')) return false;
  if (!/[A-Za-z]{3,}/.test(trimmed)) return false;
  if (MODEL_IGNORE_RE.test(trimmed)) return false;
  if (RU_DICT[trimmed]) return false;
  if (!parentEl) return false;
  // Never translate sidebar chat titles, topbar, composer, tooltips, modals, or code/terminal outputs
  if (parentEl.closest('[data-qusa-role="sidebar"], [data-qusa-sidebar-root="1"], [data-qusa-role="header"], [data-qusa-composer="1"], form, pre, code, .prose, [role="menu"], [role="listbox"], [role="dialog"], [role="tooltip"]')) {
    return false;
  }
  // Never translate buttons inside the bottom composer area
  const pr = parentEl.getBoundingClientRect();
  if (pr.bottom > window.innerHeight - 150 && parentEl.closest('button')) return false;
  if (THOUGHT_STEP_RE.test(trimmed) || /\bfinished$/i.test(trimmed)) return true;
  // Also allow collapsible thought summary buttons inside the chat stream
  const btn = parentEl.closest('button, summary');
  if (btn && btn.getBoundingClientRect().left > 220 && btn.getBoundingClientRect().top > 60) {
    if (trimmed.length >= 12 && /\s/.test(trimmed)) return true;
  }
  return false;
}

function queueThoughtTranslation(node, trimmed, cfg) {
  const hasBatch = window.qusaPersist && typeof window.qusaPersist.translateBatch === 'function';
  const hasSingle = window.qusaPersist && typeof window.qusaPersist.translateText === 'function';
  if (!hasBatch && !hasSingle) return;
  if (!pendingThoughtNodes.has(trimmed)) {
    pendingThoughtNodes.set(trimmed, new Set());
  }
  pendingThoughtNodes.get(trimmed).add(node);
  if (thoughtFlushTimer) return;

  thoughtFlushTimer = setTimeout(async () => {
    thoughtFlushTimer = null;
    const batch = Array.from(pendingThoughtNodes.entries());
    pendingThoughtNodes.clear();
    if (!cfg.translateThoughts || batch.length === 0) return;

    const keys = batch.map(([k]) => k).filter((k) => !thoughtTransCache.has(k));
    if (keys.length > 0) {
      try {
        if (hasBatch) {
          const map = await window.qusaPersist.translateBatch(keys);
          if (map && typeof map === 'object') {
            for (const [k, v] of Object.entries(map)) {
              if (v && v !== k) thoughtTransCache.set(k, v);
            }
          }
        } else {
          for (const k of keys) {
            const v = await window.qusaPersist.translateText(k);
            if (v && v !== k) thoughtTransCache.set(k, v);
          }
        }
      } catch {}
    }

    if (!cfg.translateThoughts) return;
    for (const [srcText, nodes] of batch) {
      let translated = thoughtTransCache.get(srcText);
      if (!translated || translated === srcText) continue;
      if (/^Ran\s+/i.test(translated)) {
        translated = translated.replace(/^Ran\s+/i, 'Выполнено: ');
      }
      for (const n of nodes) {
        if (!n.isConnected) continue;
        const base = origTextMap.has(n) ? origTextMap.get(n) : (n.nodeValue || '');
        if (base.trim() !== srcText) continue;
        const next = base.replace(srcText, translated);
        if (!origTextMap.has(n)) origTextMap.set(n, base);
        lastAppliedMap.set(n, next);
        if (n.nodeValue !== next) n.nodeValue = next;
      }
    }
  }, 650);
}

const GREETING_PATTERNS = [
  // "Hey <name>, what are we building?" / "Hi <name>, ..."
  /^(\s*(?:Hey|Hi|Hello|Yo|Привет|Здорово)\s+)([^.!?,:\n]{1,40})([,!?.]\s*.*)$/i,
  // "Welcome back, <name>. ..." / "Good to see you, <name>. ..."
  /^(\s*(?:Welcome(?: back)?|Good (?:to see you|morning|afternoon|evening)|Hello|Hey|Hi|Nice to see you|Glad (?:you're|to see you) back|Ready(?: when you are)?|Back again|What(?:'s| is) on your mind|How can I help(?: you)?|Let(?:'s| us) (?:build|get started)|С возвращением|Привет|Рад видеть),\s*)([^.!?,:\n]{1,40})([.!?,\s]*.*)$/i,
];

function applyAccountNameToString(raw, customName, parentEl) {
  if (!raw || !customName) return raw;
  for (const re of GREETING_PATTERNS) {
    const m = raw.match(re);
    if (m) {
      if (!detectedAccountName && m[2]) detectedAccountName = m[2].trim();
      return `${m[1]}${customName}${m[3]}`;
    }
  }
  // Safe fallback for any other hero greeting: only replace a single-token handle right after a comma
  if (parentEl && (parentEl.matches('h1, h2, h3') || parseFloat(getComputedStyle(parentEl).fontSize) >= 20)) {
    const gm = raw.match(/^(\s*[A-Za-zА-Яа-яЁё'\s]{3,36},\s*)([^\s.!?,]{1,32})([.!?].*)$/);
    if (gm) {
      if (!detectedAccountName && gm[2]) detectedAccountName = gm[2].trim();
      return `${gm[1]}${customName}${gm[3]}`;
    }
  }
  if (detectedAccountName && raw.trim() === detectedAccountName) {
    return raw.replace(detectedAccountName, customName);
  }
  return raw;
}

function shouldSkipTextNode(el) {
  if (!el) return true;
  if (el.closest && el.closest('pre, code, .prose, [contenteditable="true"], [data-lexical-editor], [data-testid*="drag"], [data-qusa-skip], #qusa-theme-modal, #qusa-style-fab, #qusa-telemetry-bar, #qusa-anty, #qusa-rei-pet, #qusa-spotify-island, #qusa-lyrics-overlay')) {
    return true;
  }
  return false;
}

function getActiveModelPairs(cfg) {
  const map = cfg.modelRenames || {};
  return Object.entries(map)
    .map(([from, to]) => [String(from).trim(), String(to).trim()])
    .filter(([from, to]) => from.length > 0 && to.length > 0 && from !== to)
    .sort((a, b) => b[0].length - a[0].length);
}

function applyModelRenamesToString(raw, pairs) {
  if (!raw || pairs.length === 0) return raw;
  let out = raw;
  for (const [from, to] of pairs) {
    if (out.toLowerCase().includes(from.toLowerCase())) {
      out = out.replace(new RegExp(escapeRegExp(from), 'gi'), to);
    }
  }
  return out;
}

function translateTextValue(raw) {
  if (!raw) return raw;
  const trimmed = raw.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  if (!trimmed) return raw;
  if (RU_DICT[trimmed]) return raw.replace(trimmed, RU_DICT[trimmed]);
  if (/^now$/i.test(trimmed)) return raw.replace(trimmed, trimmed[0] === 'N' ? 'Сейчас' : 'сейчас');
  if (/^just\s+now$/i.test(trimmed)) return raw.replace(trimmed, trimmed[0] === 'J' ? 'Только что' : 'только что');
  // Compact sidebar relative timestamps: "5s", "2m", "3h", "1d", "2w", "2mo", "1y"
  const shortTime = trimmed.match(/^(\d+)\s*(mo|s|m|h|d|w|y)$/i);
  if (shortTime) {
    const u = shortTime[2].toLowerCase();
    const uMap = { s: 'с.', m: 'м.', h: 'ч.', d: 'д.', w: 'нед.', mo: 'мес.', y: 'г.' };
    return raw.replace(trimmed, `${shortTime[1]}${uMap[u]}`);
  }
  if (/^[a-z0-9-]+$/.test(trimmed)) return raw;
  const agoMatch = trimmed.match(/^(\d+)([smhdwy])\s+ago$/i);
  if (agoMatch) {
    const unitMap = { s: 'с назад', m: 'м назад', h: 'ч назад', d: 'д назад', w: 'нед назад', y: 'г назад' };
    return raw.replace(trimmed, `${agoMatch[1]}${unitMap[agoMatch[2].toLowerCase()]}`);
  }
  if (trimmed.startsWith('Thought for ')) return raw.replace('Thought for ', 'Думал ');
  if (trimmed.startsWith('Running ')) return raw.replace('Running ', 'Выполняю: ');
  if (trimmed.startsWith('Ran ')) return raw.replace('Ran ', 'Выполнено: ');
  return raw;
}

function processSingleTextNode(node, cfg, pairs) {
  const parent = node.parentElement;
  if (!parent || shouldSkipTextNode(parent)) return;

  const cur = node.nodeValue || '';
  let base;
  if (origTextMap.has(node)) {
    if (cur !== lastAppliedMap.get(node)) {
      base = cur;
      origTextMap.set(node, base);
    } else {
      base = origTextMap.get(node);
    }
  } else {
    base = cur;
  }

  let result = base;
  const customAcc = (cfg.customAccountName || '').trim();
  if (customAcc) {
    result = applyAccountNameToString(result, customAcc, parent);
  }
  if (pairs.length > 0) {
    result = applyModelRenamesToString(result, pairs);
  }
  let handledThought = false;
  if (cfg.translateThoughts) {
    const trimmed = base.trim();
    if (isThoughtHeaderNode(trimmed, parent)) {
      handledThought = true;
      const fast = translateThoughtFastLocal(trimmed);
      if (fast) {
        result = base.replace(trimmed, fast);
      } else if (thoughtTransCache.has(trimmed)) {
        result = base.replace(trimmed, thoughtTransCache.get(trimmed));
      } else {
        queueThoughtTranslation(node, trimmed, cfg);
      }
    }
  }
  if (cfg.ruEnabled && !handledThought) {
    result = translateTextValue(result);
  }

  if (result !== base) {
    if (!origTextMap.has(node)) origTextMap.set(node, base);
    lastAppliedMap.set(node, result);
    if (cur !== result) node.nodeValue = result;
  } else if (origTextMap.has(node)) {
    origTextMap.delete(node);
    lastAppliedMap.delete(node);
    if (cur !== base) node.nodeValue = base;
  }
}

function processElementAttrs(el, cfg, pairs) {
  if (shouldSkipTextNode(el)) return;
  for (const attr of ['placeholder', 'aria-label', 'title']) {
    const dataAttr = `data-qusa-orig-${attr}`;
    const hasSaved = el.hasAttribute(dataAttr);
    const curVal = el.getAttribute(attr);
    if (!hasSaved && !curVal) continue;

    const base = hasSaved ? el.getAttribute(dataAttr) : curVal;
    let next = base || '';
    if (pairs.length > 0) {
      next = applyModelRenamesToString(next, pairs);
    }
    if (cfg.ruEnabled && RU_DICT[next.trim()]) {
      next = RU_DICT[next.trim()];
    }

    if (next !== base) {
      if (!hasSaved) el.setAttribute(dataAttr, base);
      if (curVal !== next) el.setAttribute(attr, next);
    } else if (hasSaved) {
      if (curVal !== base) el.setAttribute(attr, base);
      el.removeAttribute(dataAttr);
    }
  }
}

function applyTextTransforms(root, cfg) {
  if (!root) return;
  const el = root.nodeType === 1 ? root : root.parentElement;
  if (!el || shouldSkipTextNode(el)) return;
  const pairs = getActiveModelPairs(cfg);

  if (root.nodeType === Node.TEXT_NODE) {
    processSingleTextNode(root, cfg, pairs);
    return;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let node = walker.currentNode;
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      processSingleTextNode(node, cfg, pairs);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      processElementAttrs(node, cfg, pairs);
    }
    node = walker.nextNode();
  }
}

// --- Settings UI ---

function dockStyleButtonInSidebar() {
  const fab = document.getElementById('qusa-style-fab');
  if (!fab) return;
  // Find the "Settings" / "Настройки" button at the bottom of the sidebar
  const candidates = document.querySelectorAll('button, a, [role="button"]');
  let settingsBtn = null;
  for (const el of candidates) {
    if (el.id === 'qusa-style-fab' || el.closest('#qusa-theme-modal, #qusa-spotify-island, #qusa-lyrics-overlay')) continue;
    const txt = (el.textContent || '').trim();
    if (txt !== 'Settings' && txt !== 'Настройки') continue;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.left <= 60 && r.right <= 360 && r.bottom >= window.innerHeight - 100) {
      settingsBtn = el;
      break;
    }
  }
  if (settingsBtn && settingsBtn.parentElement) {
    const host = settingsBtn.parentElement;
    const otherChildren = Array.from(host.children).filter((c) => c !== fab);
    if (otherChildren.length === 1 && otherChildren[0] === settingsBtn) {
      host.style.setProperty('display', 'flex', 'important');
      host.style.setProperty('flex-direction', 'row', 'important');
      host.style.setProperty('align-items', 'center', 'important');
      host.style.setProperty('justify-content', 'space-between', 'important');
      host.style.setProperty('gap', '6px', 'important');
      settingsBtn.style.setProperty('flex', '1 1 auto', 'important');
      settingsBtn.style.setProperty('width', 'auto', 'important');
      settingsBtn.style.setProperty('min-width', '0', 'important');
      if (fab.parentElement !== host) host.appendChild(fab);
      fab.classList.remove('qusa-fab-floating');
      fab.classList.add('qusa-fab-docked');
      fab.style.position = '';
      fab.style.left = '';
      fab.style.top = '';
      fab.style.right = '';
      fab.style.transform = '';
    } else {
      const hostPos = window.getComputedStyle(host).position;
      if (hostPos === 'static') host.style.position = 'relative';
      if (fab.parentElement !== host) host.appendChild(fab);
      fab.classList.remove('qusa-fab-floating');
      fab.classList.add('qusa-fab-docked');
      const btnCenterY = settingsBtn.offsetTop + settingsBtn.offsetHeight / 2;
      fab.style.position = 'absolute';
      fab.style.right = '10px';
      fab.style.top = `${Math.round(btnCenterY)}px`;
      fab.style.left = '';
      fab.style.transform = 'translateY(-50%)';
    }
  } else if (fab.parentElement !== document.body) {
    document.body.appendChild(fab);
    fab.classList.remove('qusa-fab-docked');
    fab.classList.add('qusa-fab-floating');
    fab.style.position = '';
    fab.style.left = '';
    fab.style.top = '';
    fab.style.right = '';
    fab.style.transform = '';
  }
}

function createStyleUI(cfg) {
  if (!document.getElementById('qusa-style-fab')) {
    const fab = document.createElement('button');
    fab.id = 'qusa-style-fab';
    fab.className = 'qusa-fab-floating';
    fab.type = 'button';
    fab.title = 'Настройки стиля (Alt+S — скрыть/показать)';
    fab.innerHTML = `<span id="qusa-fab-dot"></span><span>Стиль</span>`;
    fab.addEventListener('click', (e) => {
      e.stopPropagation();
      const modal = document.getElementById('qusa-theme-modal');
      if (modal) modal.classList.add('open');
    });
    document.body.appendChild(fab);
    dockStyleButtonInSidebar();
  }

  if (!document.getElementById('qusa-theme-modal')) {
    const modal = document.createElement('div');
    modal.id = 'qusa-theme-modal';
    modal.innerHTML = `
      <div class="qusa-modal-card">
        <div class="qusa-modal-header">
          <div class="qusa-modal-title">Настройка интерфейса Antigravity</div>
          <button class="qusa-close-btn" id="qusa-modal-close">Закрыть</button>
        </div>

        <div class="qusa-row" style="border-top:none;padding-top:0;">
          <span>Включить свой цвет</span>
          <input type="checkbox" id="qusa-color-enabled" />
        </div>

        <div class="qusa-field">
          <label><span>Основной цвет</span></label>
          <div class="qusa-color-row">
            <input type="color" id="qusa-base-picker" />
            <input type="text" class="qusa-input qusa-input-mono" id="qusa-base-hex" placeholder="#121212" />
          </div>
        </div>

        <div class="qusa-preset-grid" id="qusa-preset-grid"></div>

        <div class="qusa-row">
          <span>Отдельный цвет сайдбара</span>
          <input type="checkbox" id="qusa-sep-sidebar" />
        </div>

        <div class="qusa-row">
          <span>Отделить сайдбар от верхней полосы</span>
          <input type="checkbox" id="qusa-detached-sidebar" />
        </div>

        <div class="qusa-field" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:10px;margin-top:4px;">
          <label><span>Стиль стекла</span></label>
          <div class="qusa-seg-row" id="qusa-glass-seg" style="grid-template-columns:1fr 1fr;">
            <button type="button" class="qusa-seg-btn" data-glass="frosted">🌫 Frosted Glass</button>
            <button type="button" class="qusa-seg-btn" data-glass="liquid">💧 Liquid Glass</button>
          </div>
        </div>

        <div class="qusa-field" id="qusa-sidebar-field" style="display:none;margin-top:6px;">
          <div class="qusa-color-row">
            <input type="color" id="qusa-sidebar-picker" />
            <input type="text" class="qusa-input qusa-input-mono" id="qusa-sidebar-hex" placeholder="#181818" />
          </div>
        </div>

        <div class="qusa-field" style="margin-top:8px;">
          <label><span>Контраст панелей и карточек</span><span id="qusa-contrast-val"></span></label>
          <input type="range" id="qusa-contrast-range" min="0" max="2" step="0.1" />
        </div>

        <details class="qusa-details" id="qusa-wp-details">
          <summary>Обои на задний фон (картинка / GIF / видео)</summary>
          <div class="qusa-wp-box">
            <div class="qusa-color-row">
              <button class="qusa-close-btn" id="qusa-wp-file-btn" type="button">Выбрать файл с ПК...</button>
              <button class="qusa-close-btn" id="qusa-wp-clear-btn" type="button">Убрать обои</button>
              <input type="file" id="qusa-wp-file-input" accept="image/*,video/mp4,video/webm" style="display:none;" />
            </div>
            <div class="qusa-wp-status" id="qusa-wp-status"></div>
            <div class="qusa-field" style="margin-bottom:0;">
              <label><span>Или прямая ссылка (URL: JPG / PNG / GIF / MP4)</span></label>
              <input type="text" class="qusa-input" id="qusa-wp-url" placeholder="https://..." />
            </div>
            <div class="qusa-field" style="margin-bottom:0;">
              <label><span>Затемнение обоев</span><span id="qusa-wp-dim-val"></span></label>
              <input type="range" id="qusa-wp-dim-range" min="0" max="0.92" step="0.02" />
            </div>
            <div class="qusa-field" style="margin-bottom:0;">
              <label><span>Прозрачность панелей поверх обоев</span><span id="qusa-wp-alpha-val"></span></label>
              <input type="range" id="qusa-wp-alpha-range" min="0.10" max="0.95" step="0.02" />
            </div>
            <div class="qusa-field" style="margin-bottom:0;">
              <label><span>Размытие обоев (Blur)</span><span id="qusa-wp-blur-val"></span></label>
              <input type="range" id="qusa-wp-blur-range" min="0" max="20" step="1" />
            </div>
          </div>
        </details>

        <div class="qusa-row">
          <span>Перевод интерфейса на русский</span>
          <input type="checkbox" id="qusa-ru-toggle" />
        </div>

        <div class="qusa-row">
          <span>Перевод мыслей и шагов (Google Translate)</span>
          <input type="checkbox" id="qusa-thoughts-ru-toggle" />
        </div>

        <div class="qusa-row">
          <span>Островок Spotify (если запущен)</span>
          <input type="checkbox" id="qusa-spotify-toggle" />
        </div>

        <div class="qusa-row">
          <span>Растягивать островок под длину текста</span>
          <input type="checkbox" id="qusa-spotify-autowidth-toggle" />
        </div>

        <div class="qusa-field" style="padding-top:6px;">
          <label><span>Шрифт текста песен (.ttf / .otf / .woff2)</span></label>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="qusa-close-btn" id="qusa-lyrics-font-pick" type="button">Выбрать .ttf</button>
            <button class="qusa-close-btn" id="qusa-lyrics-font-default" type="button">Встроенный</button>
            <button class="qusa-close-btn" id="qusa-lyrics-font-system" type="button">Системный</button>
            <input type="file" id="qusa-lyrics-font-file" accept=".ttf,.otf,.woff,.woff2" style="display:none;" />
          </div>
          <div id="qusa-lyrics-font-status" style="font-size:11px;color:#94a3b8;margin-top:4px;">Активный шрифт: aahigherup.ttf (встроенный)</div>
        </div>

        <div class="qusa-row">
          <span>Скрыть кнопку «Стиль»</span>
          <input type="checkbox" id="qusa-fab-hidden-toggle" />
        </div>

        <div class="qusa-field" style="padding-top:4px;">
          <label><span>Клавиша показа / скрытия кнопки «Стиль»</span></label>
          <div class="qusa-color-row">
            <button class="qusa-close-btn" id="qusa-hotkey-btn" type="button" style="flex:1;text-align:left;"></button>
            <button class="qusa-close-btn" id="qusa-hotkey-reset-btn" type="button">Alt+S</button>
          </div>
        </div>

        <div class="qusa-field" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:10px;margin-top:4px;">
          <label><span>Имя аккаунта в главном меню (визуально)</span></label>
          <div class="qusa-color-row">
            <input type="text" class="qusa-input" id="qusa-account-name" placeholder="Оставить оригинальное..." />
            <button class="qusa-close-btn" id="qusa-account-reset-btn" type="button">Вернуть</button>
          </div>
        </div>

        <details class="qusa-details" id="qusa-weather-details">
          <summary>Погодные эффекты (дождь / снег)</summary>
          <div class="qusa-wp-box">
            <div class="qusa-seg-row" id="qusa-weather-seg">
              <button type="button" class="qusa-seg-btn" data-weather="none">Выкл</button>
              <button type="button" class="qusa-seg-btn" data-weather="rain">🌧 Дождь</button>
              <button type="button" class="qusa-seg-btn" data-weather="snow">❄ Снег</button>
            </div>
            <div class="qusa-field" style="margin-bottom:0;">
              <label><span>Интенсивность</span><span id="qusa-weather-int-val"></span></label>
              <input type="range" id="qusa-weather-int-range" min="0.4" max="2.0" step="0.1" />
            </div>
            <div class="qusa-field" style="margin-bottom:0;">
              <label><span>Скорость падения</span><span id="qusa-weather-spd-val"></span></label>
              <input type="range" id="qusa-weather-spd-range" min="0.3" max="2.5" step="0.1" />
            </div>
          </div>
        </details>

        <details class="qusa-details" id="qusa-anty-details">
          <summary>Питомец (Anty / Rei — сидит на промпте и гуляет)</summary>
          <div class="qusa-wp-box">
            <div class="qusa-row" style="border-top:none;padding-top:0;">
              <span>Включить питомца</span>
              <input type="checkbox" id="qusa-anty-toggle" />
            </div>
            <div class="qusa-field" style="margin-top:4px;">
              <label><span>Персонаж</span></label>
              <div class="qusa-seg-row" style="grid-template-columns:1fr 1fr;">
                <button class="qusa-seg-btn" data-pet-char="anty" type="button">👾 Anty</button>
                <button class="qusa-seg-btn" data-pet-char="rei" type="button">❄️ Rei</button>
              </div>
            </div>
            <div class="qusa-row">
              <span>Гулять по интерфейсу</span>
              <input type="checkbox" id="qusa-anty-roam-toggle" />
            </div>
            <div class="qusa-field" style="margin-bottom:0;">
              <label><span>Размер питомца</span><span id="qusa-anty-size-val"></span></label>
              <input type="range" id="qusa-anty-size-range" min="36" max="96" step="2" />
            </div>
          </div>
        </details>

        <details class="qusa-details" id="qusa-models-details">
          <summary>Переименование моделей (визуально)</summary>
          <div class="qusa-models-list" id="qusa-models-list"></div>
          <div class="qusa-custom-add">
            <input type="text" class="qusa-input" id="qusa-custom-from" placeholder="Оригинал (напр. Gemini 4 ...)" />
            <input type="text" class="qusa-input" id="qusa-custom-to" placeholder="Новое название" />
            <button class="qusa-close-btn" id="qusa-custom-add-btn" type="button">+</button>
          </div>
        </details>

        <div class="qusa-footer">
          <button class="qusa-close-btn" id="qusa-reset-models-btn" type="button">Сбросить имена</button>
          <button class="qusa-close-btn" id="qusa-reset-btn" type="button">Сбросить цвет</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
    document.getElementById('qusa-modal-close').addEventListener('click', () => {
      modal.classList.remove('open');
    });

    const colorEnabledEl = document.getElementById('qusa-color-enabled');
    const basePicker = document.getElementById('qusa-base-picker');
    const baseHex = document.getElementById('qusa-base-hex');
    const sepSidebarEl = document.getElementById('qusa-sep-sidebar');
    const detachedSidebarEl = document.getElementById('qusa-detached-sidebar');
    const glassSeg = document.getElementById('qusa-glass-seg');
    const sidebarField = document.getElementById('qusa-sidebar-field');
    const sidebarPicker = document.getElementById('qusa-sidebar-picker');
    const sidebarHex = document.getElementById('qusa-sidebar-hex');
    const contrastRange = document.getElementById('qusa-contrast-range');
    const contrastVal = document.getElementById('qusa-contrast-val');
    const wpFileBtn = document.getElementById('qusa-wp-file-btn');
    const wpFileInput = document.getElementById('qusa-wp-file-input');
    const wpClearBtn = document.getElementById('qusa-wp-clear-btn');
    const wpStatus = document.getElementById('qusa-wp-status');
    const wpUrl = document.getElementById('qusa-wp-url');
    const wpDimRange = document.getElementById('qusa-wp-dim-range');
    const wpDimVal = document.getElementById('qusa-wp-dim-val');
    const wpAlphaRange = document.getElementById('qusa-wp-alpha-range');
    const wpAlphaVal = document.getElementById('qusa-wp-alpha-val');
    const wpBlurRange = document.getElementById('qusa-wp-blur-range');
    const wpBlurVal = document.getElementById('qusa-wp-blur-val');
    const ruToggle = document.getElementById('qusa-ru-toggle');
    const thoughtsRuToggle = document.getElementById('qusa-thoughts-ru-toggle');
    const spotifyToggle = document.getElementById('qusa-spotify-toggle');
    const spotifyAutoWidthToggle = document.getElementById('qusa-spotify-autowidth-toggle');
    const lyricsFontPick = document.getElementById('qusa-lyrics-font-pick');
    const lyricsFontDefault = document.getElementById('qusa-lyrics-font-default');
    const lyricsFontSystem = document.getElementById('qusa-lyrics-font-system');
    const lyricsFontFile = document.getElementById('qusa-lyrics-font-file');
    const lyricsFontStatus = document.getElementById('qusa-lyrics-font-status');
    const fabHiddenToggle = document.getElementById('qusa-fab-hidden-toggle');
    const hotkeyBtn = document.getElementById('qusa-hotkey-btn');
    const hotkeyResetBtn = document.getElementById('qusa-hotkey-reset-btn');
    const accountNameInput = document.getElementById('qusa-account-name');
    const accountResetBtn = document.getElementById('qusa-account-reset-btn');
    const antyToggle = document.getElementById('qusa-anty-toggle');
    const antyRoamToggle = document.getElementById('qusa-anty-roam-toggle');
    const antySizeRange = document.getElementById('qusa-anty-size-range');
    const antySizeVal = document.getElementById('qusa-anty-size-val');
    const weatherSeg = document.getElementById('qusa-weather-seg');
    const weatherIntRange = document.getElementById('qusa-weather-int-range');
    const weatherIntVal = document.getElementById('qusa-weather-int-val');
    const weatherSpdRange = document.getElementById('qusa-weather-spd-range');
    const weatherSpdVal = document.getElementById('qusa-weather-spd-val');
    const resetBtn = document.getElementById('qusa-reset-btn');
    const resetModelsBtn = document.getElementById('qusa-reset-models-btn');
    const customFrom = document.getElementById('qusa-custom-from');
    const customTo = document.getElementById('qusa-custom-to');
    const customAddBtn = document.getElementById('qusa-custom-add-btn');

    const updateWpStatusText = () => {
      if (cfg.wallpaperUrl && cfg.wallpaperUrl.trim()) {
        wpStatus.textContent = `Активна ссылка: ${cfg.wallpaperUrl.trim()}`;
      } else if (activeLocalBlobUrl) {
        wpStatus.textContent = `Активен файл: ${cfg.wallpaperLocalName || 'локальные обои'}`;
      } else {
        wpStatus.textContent = 'Обои не выбраны (сплошной цвет)';
      }
    };

    const applyAll = (immediate = false) => {
      saveConfig(cfg, immediate);
      injectStyles(cfg);
      updateWallpaperLayer(cfg);
      applySurfaceColors(cfg);
      updateWpStatusText();
    };

    const renderModelsList = () => {
      const list = document.getElementById('qusa-models-list');
      list.innerHTML = '';
      const allKeys = [...KNOWN_MODELS];
      for (const k of Object.keys(cfg.modelRenames || {})) {
        if (!allKeys.includes(k)) allKeys.push(k);
      }
      for (const origName of allKeys) {
        const row = document.createElement('div');
        row.className = 'qusa-model-row';

        const label = document.createElement('span');
        label.className = 'qusa-model-orig';
        label.textContent = origName;
        label.title = origName;

        const inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'qusa-input';
        inp.placeholder = origName;
        inp.value = (cfg.modelRenames && cfg.modelRenames[origName]) || '';
        inp.addEventListener('input', () => {
          const v = inp.value.trim();
          if (v) {
            cfg.modelRenames[origName] = v;
          } else {
            delete cfg.modelRenames[origName];
          }
          saveConfig(cfg, false);
          applyTextTransforms(document.body, cfg);
        });

        row.appendChild(label);
        row.appendChild(inp);

        if (!KNOWN_MODELS.includes(origName)) {
          const del = document.createElement('button');
          del.type = 'button';
          del.className = 'qusa-close-btn';
          del.textContent = '×';
          del.addEventListener('click', () => {
            delete cfg.modelRenames[origName];
            saveConfig(cfg, true);
            renderModelsList();
            applyTextTransforms(document.body, cfg);
          });
          row.appendChild(del);
        }
        list.appendChild(row);
      }
    };

    const renderPresets = () => {
      const grid = document.getElementById('qusa-preset-grid');
      grid.innerHTML = '';
      for (const p of PRESETS) {
        const btn = document.createElement('div');
        btn.className = 'qusa-preset-item' + (cfg.baseColor.toLowerCase() === p.color.toLowerCase() ? ' active' : '');
        btn.innerHTML = `<span class="qusa-swatch" style="background:${p.color}"></span><span>${p.name}</span>`;
        btn.addEventListener('click', () => {
          cfg.colorEnabled = true;
          cfg.baseColor = p.color;
          syncControls();
          applyAll(true);
        });
        grid.appendChild(btn);
      }
    };

    const syncControls = () => {
      colorEnabledEl.checked = Boolean(cfg.colorEnabled);
      basePicker.value = cfg.baseColor;
      baseHex.value = cfg.baseColor;
      sepSidebarEl.checked = Boolean(cfg.separateSidebar);
      detachedSidebarEl.checked = cfg.detachedSidebar !== false;
      const curGlass = cfg.glassStyle === 'liquid' ? 'liquid' : 'frosted';
      glassSeg.querySelectorAll('.qusa-seg-btn').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-glass') === curGlass);
      });
      sidebarField.style.display = cfg.separateSidebar ? 'block' : 'none';
      sidebarPicker.value = cfg.sidebarColor;
      sidebarHex.value = cfg.sidebarColor;
      contrastRange.value = String(cfg.panelContrast);
      contrastVal.textContent = `${Math.round(cfg.panelContrast * 100)}%`;
      wpUrl.value = cfg.wallpaperUrl || '';
      wpDimRange.value = String(cfg.wallpaperDim ?? 0.42);
      wpDimVal.textContent = `${Math.round((cfg.wallpaperDim ?? 0.42) * 100)}%`;
      wpAlphaRange.value = String(cfg.panelAlpha ?? 0.68);
      wpAlphaVal.textContent = `${Math.round((cfg.panelAlpha ?? 0.68) * 100)}%`;
      wpBlurRange.value = String(cfg.wallpaperBlur || 0);
      wpBlurVal.textContent = `${cfg.wallpaperBlur || 0}px`;
      ruToggle.checked = Boolean(cfg.ruEnabled);
      thoughtsRuToggle.checked = Boolean(cfg.translateThoughts);
      spotifyToggle.checked = cfg.spotifyIsland !== false;
      spotifyAutoWidthToggle.checked = cfg.spotifyAutoWidth !== false;
      fabHiddenToggle.checked = Boolean(cfg.fabHidden);
      hotkeyBtn.textContent = formatHotkey(cfg.fabHotkey || 'Alt+KeyS');
      accountNameInput.value = cfg.customAccountName || '';
      antyToggle.checked = cfg.antyEnabled !== false;
      antyRoamToggle.checked = cfg.antyRoam !== false;
      antySizeRange.value = String(cfg.antySize || 58);
      antySizeVal.textContent = `${cfg.antySize || 58}px`;
      const activeChar = cfg.antyCharacter === 'rei' ? 'rei' : 'anty';
      document.querySelectorAll('#qusa-anty-details [data-pet-char]').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-pet-char') === activeChar);
      });
      const curWeather = cfg.weatherEffect || 'none';
      weatherSeg.querySelectorAll('.qusa-seg-btn').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-weather') === curWeather);
      });
      const wInt = Number(cfg.weatherIntensity || 1.0);
      weatherIntRange.value = String(wInt);
      weatherIntVal.textContent = `${Math.round(wInt * 100)}%`;
      const wSpd = Number(cfg.weatherSpeed || 1.0);
      weatherSpdRange.value = String(wSpd);
      weatherSpdVal.textContent = `${Math.round(wSpd * 100)}%`;
      renderPresets();
      renderModelsList();
      updateWpStatusText();
    };

    syncControls();
    window.__qusaSyncWpStatus = updateWpStatusText;

    colorEnabledEl.addEventListener('change', () => {
      cfg.colorEnabled = colorEnabledEl.checked;
      applyAll(true);
    });

    basePicker.addEventListener('input', () => {
      cfg.colorEnabled = true;
      cfg.baseColor = basePicker.value;
      colorEnabledEl.checked = true;
      baseHex.value = cfg.baseColor;
      renderPresets();
      applyAll(false);
    });

    baseHex.addEventListener('change', () => {
      let val = baseHex.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (hexToRgb(val)) {
        cfg.colorEnabled = true;
        cfg.baseColor = val;
        syncControls();
        applyAll(true);
      } else {
        baseHex.value = cfg.baseColor;
      }
    });

    sepSidebarEl.addEventListener('change', () => {
      cfg.separateSidebar = sepSidebarEl.checked;
      sidebarField.style.display = cfg.separateSidebar ? 'block' : 'none';
      applyAll(true);
    });

    detachedSidebarEl.addEventListener('change', () => {
      cfg.detachedSidebar = detachedSidebarEl.checked;
      applyAll(true);
    });

    glassSeg.querySelectorAll('.qusa-seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        cfg.glassStyle = btn.getAttribute('data-glass') === 'liquid' ? 'liquid' : 'frosted';
        glassSeg.querySelectorAll('.qusa-seg-btn').forEach((b) => {
          b.classList.toggle('active', b === btn);
        });
        applyAll(true);
      });
    });

    sidebarPicker.addEventListener('input', () => {
      cfg.sidebarColor = sidebarPicker.value;
      sidebarHex.value = cfg.sidebarColor;
      applyAll(false);
    });

    sidebarHex.addEventListener('change', () => {
      let val = sidebarHex.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (hexToRgb(val)) {
        cfg.sidebarColor = val;
        sidebarPicker.value = val;
        applyAll(true);
      } else {
        sidebarHex.value = cfg.sidebarColor;
      }
    });

    contrastRange.addEventListener('input', () => {
      cfg.panelContrast = parseFloat(contrastRange.value);
      contrastVal.textContent = `${Math.round(cfg.panelContrast * 100)}%`;
      applyAll(false);
    });

    wpFileBtn.addEventListener('click', () => wpFileInput.click());

    wpFileInput.addEventListener('change', async () => {
      const file = wpFileInput.files && wpFileInput.files[0];
      if (!file) return;
      try {
        await saveLocalWallpaper(file);
        if (activeLocalBlobUrl) URL.revokeObjectURL(activeLocalBlobUrl);
        activeLocalBlobUrl = URL.createObjectURL(file);
        activeLocalMime = file.type || '';
        cfg.wallpaperLocalName = file.name;
        cfg.wallpaperUrl = '';
        wpUrl.value = '';
        applyAll(true);
      } catch (err) {
        console.error('[Qusa] Failed to save wallpaper:', err);
      }
      wpFileInput.value = '';
    });

    wpClearBtn.addEventListener('click', async () => {
      cfg.wallpaperUrl = '';
      cfg.wallpaperLocalName = '';
      wpUrl.value = '';
      await clearLocalWallpaper();
      applyAll(true);
    });

    wpUrl.addEventListener('change', () => {
      cfg.wallpaperUrl = wpUrl.value.trim();
      applyAll(true);
    });

    wpDimRange.addEventListener('input', () => {
      cfg.wallpaperDim = parseFloat(wpDimRange.value);
      wpDimVal.textContent = `${Math.round(cfg.wallpaperDim * 100)}%`;
      applyAll(false);
    });

    wpAlphaRange.addEventListener('input', () => {
      cfg.panelAlpha = parseFloat(wpAlphaRange.value);
      wpAlphaVal.textContent = `${Math.round(cfg.panelAlpha * 100)}%`;
      applyAll(false);
    });

    wpBlurRange.addEventListener('input', () => {
      cfg.wallpaperBlur = parseInt(wpBlurRange.value, 10);
      wpBlurVal.textContent = `${cfg.wallpaperBlur}px`;
      applyAll(false);
    });

    ruToggle.addEventListener('change', () => {
      cfg.ruEnabled = ruToggle.checked;
      saveConfig(cfg, true);
      applyTextTransforms(document.body, cfg);
    });

    thoughtsRuToggle.addEventListener('change', () => {
      cfg.translateThoughts = thoughtsRuToggle.checked;
      saveConfig(cfg, true);
      applyTextTransforms(document.body, cfg);
    });

    spotifyToggle.addEventListener('change', () => {
      cfg.spotifyIsland = spotifyToggle.checked;
      saveConfig(cfg, true);
      if (window.__qusaUpdateSpotify) window.__qusaUpdateSpotify(cfg);
    });

    spotifyAutoWidthToggle.addEventListener('change', () => {
      cfg.spotifyAutoWidth = spotifyAutoWidthToggle.checked;
      saveConfig(cfg, true);
      if (window.__qusaUpdateSpotify) window.__qusaUpdateSpotify(cfg);
    });

    lyricsFontPick.addEventListener('click', () => { lyricsFontFile.click(); });
    lyricsFontFile.addEventListener('change', async () => {
      const f = lyricsFontFile.files && lyricsFontFile.files[0];
      if (!f) return;
      try {
        const buf = await f.arrayBuffer();
        const bytes = new Uint8Array(buf);
        if (window.qusaPersist && typeof window.qusaPersist.saveLyricsFont === 'function') {
          await window.qusaPersist.saveLyricsFont({ bytes, name: f.name });
        }
        cfg.lyricsFontMode = 'custom';
        cfg.lyricsFontName = f.name;
        saveConfig(cfg, true);
        await loadAndApplyLyricsFont(cfg);
      } catch (err) {
        console.error('[Qusa] Font save failed:', err);
        if (lyricsFontStatus) lyricsFontStatus.textContent = '⚠️ Не удалось загрузить файл шрифта';
      }
      lyricsFontFile.value = '';
    });
    lyricsFontDefault.addEventListener('click', async () => {
      if (window.qusaPersist && typeof window.qusaPersist.clearLyricsFont === 'function') {
        await window.qusaPersist.clearLyricsFont();
      }
      cfg.lyricsFontMode = 'custom';
      cfg.lyricsFontName = '';
      saveConfig(cfg, true);
      await loadAndApplyLyricsFont(cfg);
    });
    lyricsFontSystem.addEventListener('click', async () => {
      cfg.lyricsFontMode = 'system';
      saveConfig(cfg, true);
      await loadAndApplyLyricsFont(cfg);
    });

    fabHiddenToggle.addEventListener('change', () => {
      cfg.fabHidden = fabHiddenToggle.checked;
      applyAll(true);
    });

    let recordingHotkey = false;
    hotkeyBtn.addEventListener('click', () => {
      recordingHotkey = true;
      hotkeyBtn.textContent = 'Нажмите клавишу или комбинацию... (Esc — отмена)';
    });

    hotkeyResetBtn.addEventListener('click', () => {
      recordingHotkey = false;
      cfg.fabHotkey = 'Alt+KeyS';
      hotkeyBtn.textContent = formatHotkey(cfg.fabHotkey);
      saveConfig(cfg, true);
    });

    window.addEventListener('keydown', (e) => {
      if (recordingHotkey) {
        e.preventDefault();
        e.stopPropagation();
        if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;
        if (e.code === 'Escape') {
          recordingHotkey = false;
          hotkeyBtn.textContent = formatHotkey(cfg.fabHotkey || 'Alt+KeyS');
          return;
        }
        const combo = eventToHotkey(e);
        if (combo) {
          cfg.fabHotkey = combo;
          saveConfig(cfg, true);
        }
        recordingHotkey = false;
        hotkeyBtn.textContent = formatHotkey(cfg.fabHotkey || 'Alt+KeyS');
        return;
      }

      const targetHotkey = cfg.fabHotkey || 'Alt+KeyS';
      if (!targetHotkey) return;
      const curCombo = eventToHotkey(e);
      if (curCombo !== targetHotkey) return;

      const hasModifier = e.ctrlKey || e.altKey || e.metaKey;
      const isFuncKey = /^F\d{1,2}$/.test(e.code || '');
      const activeEl = document.activeElement;
      const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
      if (isTyping && !hasModifier && !isFuncKey) return;

      e.preventDefault();
      cfg.fabHidden = !cfg.fabHidden;
      fabHiddenToggle.checked = Boolean(cfg.fabHidden);
      applyAll(true);
    }, true);

    accountNameInput.addEventListener('input', () => {
      cfg.customAccountName = accountNameInput.value.trim();
      saveConfig(cfg, false);
      applyTextTransforms(document.body, cfg);
    });

    accountResetBtn.addEventListener('click', () => {
      cfg.customAccountName = '';
      accountNameInput.value = '';
      saveConfig(cfg, true);
      applyTextTransforms(document.body, cfg);
    });

    antyToggle.addEventListener('change', () => {
      cfg.antyEnabled = antyToggle.checked;
      applyAll(true);
      if (window.__qusaUpdateAnty) window.__qusaUpdateAnty(cfg);
      if (window.__qusaUpdateRei) window.__qusaUpdateRei(cfg);
    });

    document.querySelectorAll('#qusa-anty-details [data-pet-char]').forEach((btn) => {
      btn.addEventListener('click', () => {
        cfg.antyCharacter = btn.getAttribute('data-pet-char') === 'rei' ? 'rei' : 'anty';
        document.querySelectorAll('#qusa-anty-details [data-pet-char]').forEach((b) => {
          b.classList.toggle('active', b === btn);
        });
        applyAll(true);
        if (window.__qusaUpdateAnty) window.__qusaUpdateAnty(cfg);
        if (window.__qusaUpdateRei) window.__qusaUpdateRei(cfg);
      });
    });

    antyRoamToggle.addEventListener('change', () => {
      cfg.antyRoam = antyRoamToggle.checked;
      saveConfig(cfg, true);
      if (window.__qusaUpdateAnty) window.__qusaUpdateAnty(cfg);
      if (window.__qusaUpdateRei) window.__qusaUpdateRei(cfg);
    });

    antySizeRange.addEventListener('input', () => {
      cfg.antySize = parseInt(antySizeRange.value, 10);
      antySizeVal.textContent = `${cfg.antySize}px`;
      applyAll(false);
      if (window.__qusaUpdateAnty) window.__qusaUpdateAnty(cfg);
      if (window.__qusaUpdateRei) window.__qusaUpdateRei(cfg);
    });

    weatherSeg.querySelectorAll('.qusa-seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        cfg.weatherEffect = btn.getAttribute('data-weather') || 'none';
        weatherSeg.querySelectorAll('.qusa-seg-btn').forEach((b) => {
          b.classList.toggle('active', b === btn);
        });
        applyAll(true);
        if (window.__qusaUpdateWeather) window.__qusaUpdateWeather(cfg);
      });
    });

    weatherIntRange.addEventListener('input', () => {
      cfg.weatherIntensity = parseFloat(weatherIntRange.value);
      weatherIntVal.textContent = `${Math.round(cfg.weatherIntensity * 100)}%`;
      saveConfig(cfg, false);
      if (window.__qusaUpdateWeather) window.__qusaUpdateWeather(cfg);
    });

    weatherSpdRange.addEventListener('input', () => {
      cfg.weatherSpeed = parseFloat(weatherSpdRange.value);
      weatherSpdVal.textContent = `${Math.round(cfg.weatherSpeed * 100)}%`;
      saveConfig(cfg, false);
      if (window.__qusaUpdateWeather) window.__qusaUpdateWeather(cfg);
    });

    customAddBtn.addEventListener('click', () => {
      const from = customFrom.value.trim();
      const to = customTo.value.trim();
      if (!from || !to) return;
      cfg.modelRenames[from] = to;
      customFrom.value = '';
      customTo.value = '';
      saveConfig(cfg, true);
      renderModelsList();
      applyTextTransforms(document.body, cfg);
    });

    resetModelsBtn.addEventListener('click', () => {
      cfg.modelRenames = {};
      saveConfig(cfg, true);
      renderModelsList();
      applyTextTransforms(document.body, cfg);
    });

    resetBtn.addEventListener('click', () => {
      cfg.colorEnabled = true;
      cfg.baseColor = DEFAULT_CONFIG.baseColor;
      cfg.separateSidebar = false;
      cfg.sidebarColor = DEFAULT_CONFIG.sidebarColor;
      cfg.panelContrast = 1.0;
      syncControls();
      applyAll(true);
    });
  }
}

// --- Anty Mascot (Clawd-style animated companion) ---

const ANTY_SVGS = {
  idle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" shape-rendering="crispEdges"><defs><linearGradient id="anty-acc-idle" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b66cff"/><stop offset="1" stop-color="#55d9ff"/></linearGradient><linearGradient id="anty-ear-idle" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a86bff"/><stop offset="1" stop-color="#78cfff"/></linearGradient></defs><path d="M166 174h22v-10h18v10h10v18h-10v18h-18v10h-20v-10h-10v-18h10z" fill="#242131" stroke="#090812" stroke-width="6"/><path d="M184 178h18v12h-10v16h-14v-12h6z" fill="url(#anty-acc-idle)"/><path d="M63 83V43h22V29h22v14h20v-9h22v12h22v37h13v45h-13v22h-18v13H79v-13H61v-22H48V96h15z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M73 76V48h14v-9h12v20h12v17z" fill="url(#anty-ear-idle)"/><path d="M143 76V59h12V39h13v10h12v27z" fill="url(#anty-ear-idle)"/><path d="M76 101h104v42h-13v13H88v-13H76z" fill="#090812"/><rect x="99" y="112" width="9" height="20" fill="#b98aff"/><rect x="148" y="112" width="9" height="20" fill="#8bdcff"/><path d="M79 158h98v18h18v53h-20v12H81v-12H61v-53h18z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M103 159h50v17h-10v18h-30v-18h-10z" fill="#171522" stroke="#090812" stroke-width="5"/><path d="M116 198h12v-10h10v10h12v10h-12v10h-10v-10h-12z" fill="url(#anty-acc-idle)"/><path d="M68 178H53v39h15v10h20v-18H78v-20H68zM177 178h15v39h-15v10h-20v-18h10v-20h10z" fill="#242131" stroke="#090812" stroke-width="6"/><path d="M88 220h28v18H82v-8h6zM143 220h28v18h-34v-8h6z" fill="#242131" stroke="#090812" stroke-width="6"/></svg>`,
  walking: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" shape-rendering="crispEdges"><defs><linearGradient id="anty-acc-walk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b66cff"/><stop offset="1" stop-color="#55d9ff"/></linearGradient><linearGradient id="anty-ear-walk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a86bff"/><stop offset="1" stop-color="#78cfff"/></linearGradient></defs><g class="anty-tail"><path d="M166 174h22v-10h18v10h10v18h-10v18h-18v10h-20v-10h-10v-18h10z" fill="#242131" stroke="#090812" stroke-width="6"/><path d="M184 178h18v12h-10v16h-14v-12h6z" fill="url(#anty-acc-walk)"/></g><g class="anty-leg-l"><path d="M88 220h28v18H82v-8h6z" fill="#242131" stroke="#090812" stroke-width="6"/></g><g class="anty-leg-r"><path d="M143 220h28v18h-34v-8h6z" fill="#242131" stroke="#090812" stroke-width="6"/></g><path d="M63 83V43h22V29h22v14h20v-9h22v12h22v37h13v45h-13v22h-18v13H79v-13H61v-22H48V96h15z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M73 76V48h14v-9h12v20h12v17z" fill="url(#anty-ear-walk)"/><path d="M143 76V59h12V39h13v10h12v27z" fill="url(#anty-ear-walk)"/><path d="M76 101h104v42h-13v13H88v-13H76z" fill="#090812"/><rect x="99" y="112" width="9" height="20" fill="#b98aff"/><rect x="148" y="112" width="9" height="20" fill="#8bdcff"/><path d="M79 158h98v18h18v53h-20v12H81v-12H61v-53h18z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M103 159h50v17h-10v18h-30v-18h-10z" fill="#171522" stroke="#090812" stroke-width="5"/><path d="M116 198h12v-10h10v10h12v10h-12v10h-10v-10h-12z" fill="url(#anty-acc-walk)"/><g class="anty-arm-l"><path d="M68 178H53v39h15v10h20v-18H78v-20H68z" fill="#242131" stroke="#090812" stroke-width="6"/></g><g class="anty-arm-r"><path d="M177 178h15v39h-15v10h-20v-18h10v-20h10z" fill="#242131" stroke="#090812" stroke-width="6"/></g></svg>`,
  sleeping: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" shape-rendering="crispEdges"><defs><linearGradient id="anty-acc-sleep" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b66cff"/><stop offset="1" stop-color="#55d9ff"/></linearGradient><linearGradient id="anty-ear-sleep" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a86bff"/><stop offset="1" stop-color="#78cfff"/></linearGradient></defs><path d="M163 174h22v-12h18v12h13v19h-10v20h-18v10h-25v-10h-12v-20h12z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M181 178h18v13h-10v16h-17v-12h9z" fill="url(#anty-acc-sleep)"/><path d="M71 164h104v18h20v34h-15v16H84v-10H64v-38h7z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M65 103V65h20V48h24v17h39V48h24v17h18v38h13v40h-16v15H68v-15H52v-40z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M77 91V69h13V57h12v34zM157 91V57h12v12h13v22z" fill="url(#anty-ear-sleep)"/><path d="M92 122h16v8H92zM145 122h16v8h-16z" fill="#b98aff"/><path d="M119 139h10v8h-10z" fill="#8bdcff"/><path d="M76 180h32v17H91v10H76zM143 180h32v17h-17v10h-15z" fill="#171522" stroke="#090812" stroke-width="5"/><path d="M193 54h20v7h-11v7h11v7h-20v-7h11v-7h-11z" fill="url(#anty-acc-sleep)"/><path d="M215 34h13v5h-7v5h7v5h-13v-5h7v-5h-7z" fill="#b98aff"/></svg>`,
  working: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" shape-rendering="crispEdges"><defs><linearGradient id="anty-acc-work" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b66cff"/><stop offset="1" stop-color="#55d9ff"/></linearGradient><linearGradient id="anty-ear-work" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a86bff"/><stop offset="1" stop-color="#78cfff"/></linearGradient></defs><path d="M174 177h18v-10h17v10h12v19h-12v17h-18v10h-20v-10h-9v-19h12z" fill="#242131" stroke="#090812" stroke-width="6"/><path d="M189 180h14v13h-8v15h-13v-12h7z" fill="url(#anty-acc-work)"/><path d="M74 156h104v18h16v44h-17v15H81v-12H63v-47h11z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M67 91V54h21V38h22v16h40V38h23v16h17v37h13v40h-15v17H69v-17H53V91z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M79 81V59h13V47h12v34zM157 81V47h12v12h13v22z" fill="url(#anty-ear-work)"/><rect x="91" y="103" width="10" height="20" fill="#b98aff"/><rect x="151" y="103" width="10" height="20" fill="#8bdcff"/><path d="M91 158h93v57H91z" fill="#11101a" stroke="#090812" stroke-width="7"/><path d="M99 166h77v40H99z" fill="#29243d"/><path d="M125 179h12v-8h10v8h12v9h-12v9h-10v-9h-12z" fill="url(#anty-acc-work)"/><path d="M78 216h122l-10 12H89z" fill="#38334b" stroke="#090812" stroke-width="5"/><path d="M81 198h22v15H88v8H75v-14h6zM173 198h22v15h-15v8h-13v-14h6z" fill="#242131" stroke="#090812" stroke-width="5"/><path d="M38 73h10v10H38zM28 83h10v10H28zM213 67h10v10h-10zM223 57h10v10h-10z" fill="url(#anty-acc-work)"/></svg>`,
  asking: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" shape-rendering="crispEdges"><defs><linearGradient id="anty-acc-ask" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b66cff"/><stop offset="1" stop-color="#55d9ff"/></linearGradient><linearGradient id="anty-ear-ask" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a86bff"/><stop offset="1" stop-color="#78cfff"/></linearGradient></defs><path d="M65 102V64h20V47h24v17h39V47h24v17h18v38h13v40h-16v15H68v-15H52v-40z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M77 91V68h13V56h12v35zM157 91V56h12v12h13v23z" fill="url(#anty-ear-ask)"/><rect x="91" y="111" width="10" height="19" fill="#b98aff"/><rect x="151" y="111" width="10" height="19" fill="#8bdcff"/><path d="M118 139h19v8h-19z" fill="#090812"/><path d="M78 158h100v18h18v48h-20v12H81v-12H61v-48h17z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M112 180h32v11h-10v14h-12v-14h-10z" fill="url(#anty-acc-ask)"/><path d="M61 176h19v15h10v18H70v-9H57v-16h4zM176 176h19v8h5v16h-13v9h-20v-18h9z" fill="#242131" stroke="#090812" stroke-width="6"/><path d="M186 23h48v39h-15v14h-15V62h-18z" fill="#171522" stroke="#090812" stroke-width="6"/><path d="M201 36h18v8h-8v7h-10v-8h8v-2h-8zM205 54h10v7h-10z" fill="url(#anty-acc-ask)"/></svg>`,
  completed: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" shape-rendering="crispEdges"><defs><linearGradient id="anty-acc-done" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b66cff"/><stop offset="1" stop-color="#55d9ff"/></linearGradient><linearGradient id="anty-ear-done" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a86bff"/><stop offset="1" stop-color="#78cfff"/></linearGradient></defs><path d="M190 47h12V35h18v12h12v18h-12v12h-18V65h-12z" fill="#ff75bd" stroke="#090812" stroke-width="5"/><path d="M201 48h8v-6h7v8h8v8h-8v8h-7v-8h-8z" fill="#ffc0e1"/><path d="M165 178h20v-10h18v10h12v19h-12v18h-18v10h-20v-10h-10v-19h10z" fill="#242131" stroke="#090812" stroke-width="6"/><path d="M184 181h15v13h-9v14h-14v-12h8z" fill="url(#anty-acc-done)"/><path d="M79 157h99v18h18v44h-20v14H84v-12H63v-46h16z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M65 95V58h20V42h24v16h39V42h24v16h18v37h13v40h-16v16H68v-16H52V95z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M77 84V62h13V50h12v34zM157 84V50h12v12h13v22z" fill="url(#anty-ear-done)"/><path d="M91 111h10v7h10v8H99v-7h-8zM145 126h-10v-8h10v-7h10v8h-10z" fill="#b98aff"/><path d="M91 174h28v16h-10v12H91zM137 174h28v28h-18v-12h-10z" fill="#171522" stroke="#090812" stroke-width="5"/></svg>`,
};

function initAntyMascot(cfg) {
  if (document.getElementById('qusa-anty')) return;

  const root = document.createElement('div');
  root.id = 'qusa-anty';
  root.setAttribute('data-state', 'idle');
  root.setAttribute('data-dir', 'right');
  root.title = 'Anty (клик — погладить, перетащить — переместить, двойной клик — вернуть на промпт)';
  root.innerHTML = `<div id="qusa-anty-bubble"></div><div id="qusa-anty-flip"><div id="qusa-anty-sprite">${ANTY_SVGS.idle}</div></div>`;
  document.body.appendChild(root);

  const spriteEl = document.getElementById('qusa-anty-sprite');
  const bubbleEl = document.getElementById('qusa-anty-bubble');

  let curState = 'idle';
  let curSvgKey = 'idle';
  let posX = window.innerWidth * 0.6;
  let posY = window.innerHeight - 160;
  let targetX = posX;
  let targetY = posY;
  let mode = 'perch'; // 'perch' | 'roam' | 'pinned'
  let perchRatio = 0.78;
  let isWalking = false;
  let isDragging = false;
  let dragMoved = false;
  let lastActivityTs = Date.now();
  let typingUntilTs = 0;
  let celebrateUntilTs = 0;
  let pettingUntilTs = 0;
  let hoverStartTs = 0;
  let isHovered = false;
  let lastPetX = 0;
  let lastPetDir = 0;
  let petDistance = 0;
  let petReversals = 0;
  let lastHeartTs = 0;
  let wasWorking = false;
  let nextActionTs = Date.now() + 9000;
  let roamReturnTs = 0;
  let bubbleTimer = null;

  const getSize = () => Number(cfg.antySize || 58);

  const setBubble = (text, ms = 2200) => {
    if (!bubbleEl) return;
    bubbleEl.textContent = text;
    bubbleEl.classList.add('show');
    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
      bubbleEl.classList.remove('show');
    }, ms);
  };

  const setState = (state, svgKey) => {
    if (curState !== state) {
      curState = state;
      root.setAttribute('data-state', state);
    }
    const key = svgKey || state;
    if (curSvgKey !== key && ANTY_SVGS[key]) {
      curSvgKey = key;
      spriteEl.innerHTML = ANTY_SVGS[key];
    }
  };

  const getComposerRect = () => {
    const editors = document.querySelectorAll('[contenteditable="true"], textarea');
    let editor = null;
    for (const ed of editors) {
      if (ed.closest('#qusa-theme-modal')) continue;
      const r = ed.getBoundingClientRect();
      if (r.width >= 150 && r.height >= 16) {
        editor = ed;
        break;
      }
    }
    if (!editor) return null;
    let cur = editor;
    let best = null;
    for (let i = 0; i < 8 && cur && cur !== document.body; i++) {
      const r = cur.getBoundingClientRect();
      if (r.width >= 260 && r.width <= window.innerWidth * 0.92 && r.height >= 44 && r.height <= 340) {
        const cs = getComputedStyle(cur);
        const br = parseFloat(cs.borderRadius) || 0;
        if (cur.tagName === 'FORM' || br >= 10 || (cs.borderTopWidth && parseFloat(cs.borderTopWidth) >= 1)) {
          best = r;
        }
      }
      cur = cur.parentElement;
    }
    return best || editor.getBoundingClientRect();
  };

  const getPerchPoint = (ratio) => {
    const sz = getSize();
    const cr = getComposerRect();
    if (!cr) {
      return {
        x: clamp(window.innerWidth - sz - 36, 16, window.innerWidth - sz - 16),
        y: clamp(window.innerHeight - sz - 24, 48, window.innerHeight - sz - 8),
      };
    }
    const pad = 16;
    const minX = cr.left + pad;
    const maxX = Math.max(minX, cr.right - sz - pad);
    const x = minX + (maxX - minX) * clamp(ratio, 0, 1);
    const y = Math.max(44, cr.top - sz + Math.round(sz * 0.14));
    return { x, y };
  };

  const placeAt = (x, y) => {
    const sz = getSize();
    posX = clamp(x, 6, Math.max(6, window.innerWidth - sz - 6));
    posY = clamp(y, 40, Math.max(40, window.innerHeight - sz - 4));
    root.style.left = `${Math.round(posX)}px`;
    root.style.top = `${Math.round(posY)}px`;
  };

  const snapToPerch = () => {
    const p = getPerchPoint(perchRatio);
    targetX = p.x;
    targetY = p.y;
    placeAt(p.x, p.y);
  };

  const isAgentWorking = () => {
    return Boolean(document.querySelector('[aria-label*="Stop"], button[title*="Stop"], [aria-label*="Cancel generation"]'));
  };

  // Drag & pet interaction
  let startMX = 0, startMY = 0, origX = 0, origY = 0;
  root.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    dragMoved = false;
    startMX = e.clientX;
    startMY = e.clientY;
    origX = posX;
    origY = posY;
    lastActivityTs = Date.now();
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startMX;
    const dy = e.clientY - startMY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragMoved = true;
    if (dragMoved) {
      mode = 'pinned';
      isWalking = false;
      placeAt(origX + dx, origY + dy);
      targetX = posX;
      targetY = posY;
    }
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    if (dragMoved) {
      // If dropped close to composer top edge, re-attach to perch
      const cr = getComposerRect();
      const sz = getSize();
      if (cr && posX >= cr.left - 30 && posX <= cr.right + 30 && Math.abs((posY + sz) - cr.top) < 70) {
        mode = 'perch';
        const span = Math.max(1, cr.width - sz - 32);
        perchRatio = clamp((posX - (cr.left + 16)) / span, 0, 1);
      } else {
        roamReturnTs = Date.now() + 25000;
      }
    }
  });

  const PET_LINES = ['♥', 'Anty!', 'мур~', '✨', 'готов помочь!', '⚡'];
  const PURR_LINES = ['мур~ ♥', 'приятно~', 'муррр ♥', 'ещё! ♥', 'хехе ♥'];

  const spawnHeart = (relX) => {
    const h = document.createElement('span');
    h.className = 'qusa-anty-heart';
    h.textContent = Math.random() < 0.75 ? '♥' : '✨';
    const xPct = clamp(relX, 18, 82);
    h.style.left = `${xPct}%`;
    h.style.top = '4px';
    root.appendChild(h);
    setTimeout(() => h.remove(), 980);
  };

  let hoverLeaveTimer = null;

  root.addEventListener('pointerenter', (e) => {
    if (hoverLeaveTimer) {
      clearTimeout(hoverLeaveTimer);
      hoverLeaveTimer = null;
    }
    if (!isHovered) {
      isHovered = true;
      if (!hoverStartTs) hoverStartTs = Date.now();
      lastPetX = e.clientX;
      lastPetDir = 0;
      petDistance = 0;
      petReversals = 0;
    }
    // Pause walking immediately so Anty stays under your cursor
    if (isWalking) {
      targetX = posX;
      targetY = posY;
      isWalking = false;
    }
  });

  root.addEventListener('pointerleave', () => {
    isHovered = false;
    // Grace period so rubbing slightly past Anty's 58px edge doesn't reset the 2s timer
    if (hoverLeaveTimer) clearTimeout(hoverLeaveTimer);
    hoverLeaveTimer = setTimeout(() => {
      hoverLeaveTimer = null;
      if (!isHovered) {
        hoverStartTs = 0;
        petDistance = 0;
        petReversals = 0;
      }
    }, 900);
  });

  window.addEventListener('pointermove', (e) => {
    if (isDragging || cfg.antyEnabled === false) return;
    const r = root.getBoundingClientRect();
    const pad = 22;
    const nearAnty = e.clientX >= r.left - pad && e.clientX <= r.right + pad && e.clientY >= r.top - pad && e.clientY <= r.bottom + pad;
    if (!isHovered && !nearAnty) return;

    const now = Date.now();
    if (!hoverStartTs) {
      hoverStartTs = now;
      lastPetX = e.clientX;
      return;
    }
    if (now - hoverStartTs < 2000) {
      lastPetX = e.clientX;
      return;
    }
    const dx = e.clientX - lastPetX;
    if (Math.abs(dx) < 2) return;
    lastPetX = e.clientX;
    const dir = dx > 0 ? 1 : -1;
    if (lastPetDir !== 0 && dir !== lastPetDir) {
      petReversals++;
    }
    lastPetDir = dir;
    petDistance += Math.abs(dx);

    if (petReversals >= 1 || petDistance >= 10) {
      const wasPetting = now < pettingUntilTs;
      pettingUntilTs = now + 950;
      lastActivityTs = now;
      setState('petting', 'completed');
      if (!wasPetting) {
        setBubble(PURR_LINES[Math.floor(Math.random() * PURR_LINES.length)], 1800);
      }
      if (now - lastHeartTs >= 240) {
        lastHeartTs = now;
        const relX = r.width > 0 ? ((e.clientX - r.left) / r.width) * 100 : 50;
        spawnHeart(relX);
      }
    }
  }, true);

  root.addEventListener('click', () => {
    if (dragMoved) return;
    lastActivityTs = Date.now();
    celebrateUntilTs = Date.now() + 2600;
    setState('completed', 'completed');
    setBubble(PET_LINES[Math.floor(Math.random() * PET_LINES.length)], 2000);
  });

  root.addEventListener('dblclick', () => {
    mode = 'perch';
    const p = getPerchPoint(0.78);
    perchRatio = 0.78;
    targetX = p.x;
    targetY = p.y;
    isWalking = true;
    setBubble('На базу!', 1400);
  });

  // React to user typing in prompt box
  document.addEventListener('keydown', (e) => {
    lastActivityTs = Date.now();
    const t = e.target;
    if (t && t.nodeType === 1 && !t.closest('#qusa-theme-modal') && (t.isContentEditable || t.tagName === 'TEXTAREA')) {
      typingUntilTs = Date.now() + 3500;
      if (mode !== 'perch') {
        mode = 'perch';
        const p = getPerchPoint(perchRatio);
        targetX = p.x;
        targetY = p.y;
      }
    }
  }, true);

  document.addEventListener('pointerdown', () => {
    lastActivityTs = Date.now();
  }, true);

  // Initial placement
  snapToPerch();
  setTimeout(snapToPerch, 700);
  setTimeout(snapToPerch, 1800);

  window.__qusaUpdateAnty = (newCfg) => {
    cfg = newCfg;
    const sz = getSize();
    root.style.width = `${sz}px`;
    root.style.height = `${sz}px`;
    root.style.display = (cfg.antyEnabled !== false && cfg.antyCharacter !== 'rei') ? 'block' : 'none';
    if (!cfg.antyRoam && mode === 'roam') {
      mode = 'perch';
    }
    if (mode === 'perch') snapToPerch();
  };

  // Smooth animation & behavior loop (~30fps)
  const SPEED = 2.4;
  setInterval(() => {
    if (document.hidden || cfg.antyEnabled === false || cfg.antyCharacter === 'rei' || isDragging) return;
    const now = Date.now();
    const working = isAgentWorking();

    if (wasWorking && !working) {
      celebrateUntilTs = now + 5500;
      setBubble('Готово! ♥', 2600);
    }
    wasWorking = working;

    // Keep anchored to composer when perched
    if (mode === 'perch' && !isWalking) {
      const p = getPerchPoint(perchRatio);
      if (Math.hypot(p.x - posX, p.y - posY) > 6) {
        targetX = p.x;
        targetY = p.y;
      }
    }

    // If working or typing, always return to composer
    if ((working || now < typingUntilTs) && mode !== 'perch') {
      mode = 'perch';
      const p = getPerchPoint(perchRatio);
      targetX = p.x;
      targetY = p.y;
    }

    // Return from roam/pin after timer expires
    if ((mode === 'roam' || mode === 'pinned') && roamReturnTs > 0 && now > roamReturnTs && !working) {
      mode = 'perch';
      roamReturnTs = 0;
      const p = getPerchPoint(perchRatio);
      targetX = p.x;
      targetY = p.y;
    }

    // Decide next stroll when idle (don't walk away while cursor is hovering/petting)
    if (!isHovered && now > pettingUntilTs && !working && now > typingUntilTs && now > celebrateUntilTs && now > nextActionTs && now - lastActivityTs < 42000) {
      nextActionTs = now + 11000 + Math.random() * 14000;
      const sz = getSize();
      if (mode === 'perch') {
        const shouldRoam = cfg.antyRoam !== false && Math.random() < 0.28;
        if (shouldRoam) {
          mode = 'roam';
          roamReturnTs = now + 10000 + Math.random() * 7000;
          const pickEdge = Math.random();
          if (pickEdge < 0.65) {
            // Walk along bottom edge of window
            targetX = 280 + Math.random() * Math.max(80, window.innerWidth - 360 - sz);
            targetY = window.innerHeight - sz - 8;
          } else {
            // Peek near sidebar/top area
            targetX = 270 + Math.random() * Math.max(80, window.innerWidth - 420 - sz);
            targetY = 64 + Math.random() * 80;
          }
        } else {
          // Stroll along top edge of prompt box
          perchRatio = 0.08 + Math.random() * 0.84;
          const p = getPerchPoint(perchRatio);
          targetX = p.x;
          targetY = p.y;
        }
      }
    }

    // Move smoothly toward target
    const dx = targetX - posX;
    const dy = targetY - posY;
    const dist = Math.hypot(dx, dy);

    if (dist > 3) {
      isWalking = true;
      const step = Math.min(dist, SPEED * (dist > 140 ? 1.8 : 1.0));
      placeAt(posX + (dx / dist) * step, posY + (dy / dist) * step);
      if (Math.abs(dx) > 1.5) {
        root.setAttribute('data-dir', dx < 0 ? 'left' : 'right');
      }
      setState('walking', 'walking');
      return;
    }

    isWalking = false;

    // Choose stationary state
    if (now < pettingUntilTs) {
      setState('petting', 'completed');
    } else if (working) {
      setState('working', 'working');
    } else if (now < celebrateUntilTs) {
      setState('completed', 'completed');
    } else if (now < typingUntilTs) {
      setState('asking', 'asking');
    } else if (now - lastActivityTs >= 45000) {
      setState('sleeping', 'sleeping');
    } else {
      setState('idle', 'idle');
    }
  }, 33);
}

// --- Weather Physics Effect (Realistic Rain & Crystalline Snow with UI collisions) ---

function buildSnowflakeSprites() {
  const sprites = [];
  const size = 48;
  const cx = size / 2;
  const cy = size / 2;

  for (let variant = 0; variant < 3; variant++) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const g = c.getContext('2d');
    if (!g) continue;

    g.translate(cx, cy);
    g.strokeStyle = 'rgba(240, 249, 255, 0.96)';
    g.fillStyle = 'rgba(240, 249, 255, 0.96)';
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.shadowColor = 'rgba(186, 230, 253, 0.65)';
    g.shadowBlur = 4;

    const R = 18;
    for (let arm = 0; arm < 6; arm++) {
      g.save();
      g.rotate((arm * Math.PI) / 3);

      // Main crystal stem
      g.lineWidth = variant === 1 ? 2.1 : 1.7;
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(0, -R);
      g.stroke();

      if (variant === 0) {
        // Classic dendrite snowflake (two V-branches per arm)
        g.lineWidth = 1.45;
        for (const [y, len] of [[-7.5, 5.2], [-13, 4.4]]) {
          g.beginPath();
          g.moveTo(0, y);
          g.lineTo(-len, y - len * 0.72);
          g.moveTo(0, y);
          g.lineTo(len, y - len * 0.72);
          g.stroke();
        }
      } else if (variant === 1) {
        // Ornate starry crystal with hexagonal inner plate & forked tips
        g.lineWidth = 1.4;
        g.beginPath();
        g.moveTo(0, -11);
        g.lineTo(-4.8, -14.8);
        g.moveTo(0, -11);
        g.lineTo(4.8, -14.8);
        g.moveTo(0, -6.2);
        g.lineTo(-3.6, -8.5);
        g.moveTo(0, -6.2);
        g.lineTo(3.6, -8.5);
        g.stroke();
        g.beginPath();
        g.arc(0, -R, 1.6, 0, Math.PI * 2);
        g.fill();
      } else {
        // Delicate fern-like crystal with three fine barbs
        g.lineWidth = 1.25;
        for (const [y, len] of [[-5.5, 3.6], [-10.5, 5.4], [-14.8, 3.2]]) {
          g.beginPath();
          g.moveTo(0, y);
          g.lineTo(-len, y - len * 0.65);
          g.moveTo(0, y);
          g.lineTo(len, y - len * 0.65);
          g.stroke();
        }
      }
      g.restore();
    }

    // Center crystal core
    g.beginPath();
    g.arc(0, 0, variant === 1 ? 3.0 : 2.1, 0, Math.PI * 2);
    g.fill();

    sprites.push(c);
  }
  return sprites;
}

function initWeatherEffect(cfg) {
  if (document.getElementById('qusa-weather-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'qusa-weather-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const snowSprites = buildSnowflakeSprites();

  let width = window.innerWidth;
  let height = window.innerHeight;
  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  };
  resize();
  window.addEventListener('resize', resize);

  let mode = cfg.weatherEffect || 'none';
  let intensity = Number(cfg.weatherIntensity || 1.0);
  let speedMul = Number(cfg.weatherSpeed || 1.0);
  let particles = [];
  let resting = [];
  let sliding = [];
  let splashes = [];
  let rings = [];
  let colliders = [];
  let lastColliderScan = 0;
  let rafId = null;

  const scanColliders = () => {
    const out = [];
    // 1. Open popup menus / dropdowns (e.g. Model Picker, Permissions, Context menu)
    const popups = document.querySelectorAll('[role="menu"], [role="listbox"], [role="dialog"]');
    for (const pop of popups) {
      if (pop.closest('#qusa-theme-modal')) continue;
      const pr = pop.getBoundingClientRect();
      if (pr.width >= 120 && pr.height >= 60 && pr.width < width * 0.9 && pr.height < height * 0.9) {
        out.push({ left: pr.left, right: pr.right, top: pr.top, bottom: pr.bottom });
      }
    }
    // 2. Prompt composer box
    const editors = document.querySelectorAll('[contenteditable="true"], textarea');
    for (const ed of editors) {
      if (ed.closest('#qusa-theme-modal')) continue;
      const er = ed.getBoundingClientRect();
      if (er.width < 150 || er.height < 16) continue;
      let cur = ed;
      let best = null;
      let bestEl = null;
      for (let i = 0; i < 8 && cur && cur !== document.body; i++) {
        const r = cur.getBoundingClientRect();
        if (r.width >= 260 && r.width <= width * 0.92 && r.height >= 44 && r.height <= 340) {
          const cs = getComputedStyle(cur);
          const br = parseFloat(cs.borderRadius) || 0;
          if (cur.tagName === 'FORM' || br >= 10 || (cs.borderTopWidth && parseFloat(cs.borderTopWidth) >= 1)) {
            best = r;
            bestEl = cur;
          }
        }
        cur = cur.parentElement;
      }
      if (best) {
        if (bestEl) bestEl.setAttribute('data-qusa-composer', '1');
        out.push({ left: best.left, right: best.right, top: best.top, bottom: best.bottom });
      }
      break;
    }
    // 3. Sidebar panel
    const sb = document.querySelector('[data-qusa-sidebar-root="1"]') || document.querySelector('[data-qusa-role="sidebar"]');
    if (sb) {
      const sr = sb.getBoundingClientRect();
      if (sr.width >= 120 && sr.height >= 200) {
        out.push({ left: sr.left, right: sr.right, top: sr.top, bottom: sr.bottom });
      }
    }
    colliders = out;
  };

  const spawnParticle = (randomY = false) => {
    const depth = 0.48 + Math.random() * 0.72; // parallax depth
    if (mode === 'rain') {
      return {
        x: Math.random() * (width + 240) - 40,
        y: randomY ? Math.random() * height : -30 - Math.random() * 110,
        depth,
        vxBase: -(1.5 + Math.random() * 1.1) * depth,
        vyBase: (11.5 + Math.random() * 6.5) * depth,
        len: (12 + Math.random() * 13) * depth,
        thick: 0.75 + depth * 0.75,
        alpha: 0.16 + depth * 0.34,
      };
    }
    return {
      x: Math.random() * (width + 80) - 40,
      y: randomY ? Math.random() * height : -24 - Math.random() * 70,
      depth,
      size: (8 + Math.random() * 11) * depth,
      vyBase: (0.75 + Math.random() * 1.15) * depth,
      phase: Math.random() * Math.PI * 2,
      swayAmp: (0.35 + Math.random() * 0.65) * depth,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.032,
      variant: Math.floor(Math.random() * Math.max(1, snowSprites.length)),
      alpha: 0.35 + depth * 0.52,
    };
  };

  const syncParticleCount = () => {
    if (mode === 'none') {
      particles = [];
      resting = [];
      sliding = [];
      splashes = [];
      rings = [];
      return;
    }
    const baseCount = mode === 'rain' ? 76 : 56;
    const target = Math.max(18, Math.round(baseCount * clamp(intensity, 0.4, 2.0)));
    while (particles.length < target) particles.push(spawnParticle(true));
    if (particles.length > target) particles.length = target;
  };

  const step = (ts) => {
    if (mode === 'none') {
      rafId = null;
      ctx.clearRect(0, 0, width, height);
      return;
    }
    rafId = requestAnimationFrame(step);
    if (document.hidden) return;

    if (ts - lastColliderScan > 400) {
      lastColliderScan = ts;
      scanColliders();
    }

    ctx.clearRect(0, 0, width, height);
    const now = Date.now();
    const spd = clamp(speedMul, 0.3, 2.5);
    // Natural wind gusts
    const wind = Math.sin(ts * 0.00045) * 0.75 + Math.sin(ts * 0.00125) * 0.35;

    // 1. Update & draw falling particles + check UI collisions
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const prevX = p.x;
      const prevY = p.y;
      let curVx = 0;
      let curVy = 0;

      if (mode === 'rain') {
        curVx = (p.vxBase + wind * 0.9 * p.depth) * spd;
        curVy = p.vyBase * spd;
        p.x += curVx;
        p.y += curVy;
      } else {
        p.phase += 0.022 * Math.sqrt(spd);
        curVx = (Math.sin(p.phase) * p.swayAmp + wind * 0.55 * p.depth) * spd;
        curVy = p.vyBase * spd;
        p.x += curVx;
        p.y += curVy;
        p.rot += p.rotSpeed * Math.sqrt(spd);
      }

      // Only mid/foreground drops collide with UI surfaces for realistic depth
      let hit = false;
      if (p.depth >= 0.62) {
        for (const box of colliders) {
          // Top edge hit -> rest on top edge (+ crown splash & ripple for rain)
          if (prevY <= box.top + 3 && p.y >= box.top && p.x >= box.left + 8 && p.x <= box.right - 8) {
            hit = true;
            if (resting.length < 78) {
              resting.push({
                x: p.x,
                y: box.top,
                r: mode === 'rain' ? (1.9 + Math.random() * 1.6) : (p.size * 0.42),
                rot: p.rot || 0,
                variant: p.variant || 0,
                born: now,
                life: mode === 'rain' ? (2600 + Math.random() * 3200) : (5000 + Math.random() * 5200),
                kind: mode,
              });
            }
            if (mode === 'rain') {
              if (splashes.length < 52) {
                const count = 2 + Math.floor(Math.random() * 2);
                for (let s = 0; s < count; s++) {
                  splashes.push({
                    x: p.x,
                    y: box.top,
                    vx: (Math.random() - 0.5) * 3.2 * Math.sqrt(spd),
                    vy: -(1.5 + Math.random() * 2.1) * Math.sqrt(spd),
                    r: 0.8 + Math.random() * 0.7,
                    alpha: 0.72,
                  });
                }
              }
              if (rings.length < 22) {
                rings.push({ x: p.x, y: box.top, rx: 1.5, maxRx: 7 + Math.random() * 5, alpha: 0.52 });
              }
            }
            break;
          }
          // Side edge hit (left or right border of composer/sidebar) -> stick-slip slide down the side!
          if (p.y > box.top + 6 && p.y < box.bottom - 8) {
            const hitRight = prevX >= box.right - 3 && p.x <= box.right + 3 && curVx < 0;
            const hitLeft = prevX <= box.left + 3 && p.x >= box.left - 3 && curVx > 0;
            if (hitRight || hitLeft) {
              hit = true;
              if (sliding.length < 38) {
                sliding.push({
                  x: hitRight ? box.right : box.left,
                  y: p.y,
                  vy: mode === 'rain' ? (0.35 + Math.random() * 0.5) : (0.2 + Math.random() * 0.3),
                  r: mode === 'rain' ? (2.1 + Math.random() * 1.2) : (p.size * 0.44),
                  rot: p.rot || 0,
                  variant: p.variant || 0,
                  bottomY: box.bottom,
                  detached: false,
                  trailY: p.y,
                  stickTimer: mode === 'rain' ? Math.random() * 18 : 0,
                  kind: mode,
                });
              }
              break;
            }
          }
        }
      }

      if (hit || p.y > height + 30 || p.x < -80 || p.x > width + 260) {
        particles[i] = spawnParticle(false);
        continue;
      }

      // Draw falling particle
      if (mode === 'rain') {
        const tailX = p.x - (curVx / Math.max(1, curVy)) * p.len;
        const tailY = p.y - p.len;
        const grad = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
        grad.addColorStop(0, 'rgba(186, 230, 253, 0)');
        grad.addColorStop(0.65, `rgba(186, 230, 253, ${p.alpha * 0.7})`);
        grad.addColorStop(1, `rgba(224, 242, 254, ${Math.min(0.92, p.alpha * 1.45)})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = p.thick;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      } else {
        const sp = snowSprites[p.variant];
        if (sp) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.drawImage(sp, -p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      }
    }

    // 2. Draw expanding impact ripples on top edges (rain)
    for (let i = rings.length - 1; i >= 0; i--) {
      const rg = rings[i];
      rg.rx += 0.45 * Math.sqrt(spd);
      rg.alpha -= 0.032;
      if (rg.alpha <= 0 || rg.rx >= rg.maxRx) {
        rings.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = `rgba(224, 242, 254, ${rg.alpha})`;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.ellipse(rg.x, rg.y, rg.rx, rg.rx * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. Draw resting drops / crystalline snowflakes on top edges
    for (let i = resting.length - 1; i >= 0; i--) {
      const d = resting[i];
      const age = now - d.born;
      if (age >= d.life) {
        resting.splice(i, 1);
        continue;
      }
      const fade = age > d.life * 0.72 ? 1 - (age - d.life * 0.72) / (d.life * 0.28) : 1;
      if (d.kind === 'rain') {
        // Subtle contact shadow + glassy dome + specular highlight
        ctx.fillStyle = `rgba(0, 0, 0, ${0.28 * fade})`;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y + 0.6, d.r * 1.3, d.r * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        const dg = ctx.createRadialGradient(d.x - d.r * 0.3, d.y - d.r * 0.6, 0.3, d.x, d.y - d.r * 0.2, d.r * 1.4);
        dg.addColorStop(0, `rgba(255, 255, 255, ${0.88 * fade})`);
        dg.addColorStop(0.45, `rgba(186, 230, 253, ${0.58 * fade})`);
        dg.addColorStop(1, `rgba(125, 211, 252, ${0.18 * fade})`);
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y - d.r * 0.28, d.r * 1.32, d.r * 0.78, 0, Math.PI, 0, false);
        ctx.fill();
      } else {
        const sp = snowSprites[d.variant];
        if (sp) {
          const sz = d.r * 2.1 * (0.75 + 0.25 * fade);
          ctx.save();
          ctx.globalAlpha = 0.85 * fade;
          ctx.translate(d.x, d.y - sz * 0.22);
          ctx.rotate(d.rot);
          ctx.drawImage(sp, -sz / 2, -sz / 2, sz, sz);
          ctx.restore();
        }
      }
    }

    // 4. Update & draw side-sliding drops/snowflakes (with stick-slip physics) that detach at bottom corner
    for (let i = sliding.length - 1; i >= 0; i--) {
      const s = sliding[i];
      if (!s.detached) {
        if (s.kind === 'rain') {
          // Stick-slip surface tension: brief hesitation then micro-burst slide
          if (s.stickTimer > 0) {
            s.stickTimer -= 1;
            s.y += 0.08 * spd;
          } else {
            s.vy = Math.min(2.6, s.vy + 0.028);
            s.y += s.vy * spd;
            if (Math.random() < 0.04) {
              s.stickTimer = 6 + Math.random() * 14;
              s.vy *= 0.45;
            }
          }
          // Fading wet streak along panel side
          const tg = ctx.createLinearGradient(s.x, Math.max(s.trailY, s.y - 34), s.x, s.y);
          tg.addColorStop(0, 'rgba(186, 230, 253, 0)');
          tg.addColorStop(1, 'rgba(186, 230, 253, 0.34)');
          ctx.strokeStyle = tg;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(s.x, Math.max(s.trailY, s.y - 34));
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
        } else {
          s.vy = Math.min(0.85, s.vy + 0.005);
          s.y += s.vy * spd;
          s.rot += 0.012 * spd;
        }
        if (s.y >= s.bottomY) {
          s.detached = true;
          s.vy = Math.max(s.vy, s.kind === 'rain' ? 1.4 : 0.6);
        }
      } else {
        s.vy += (s.kind === 'rain' ? 0.36 : 0.07) * spd;
        s.y += s.vy * spd;
      }

      if (s.y > height + 20) {
        sliding.splice(i, 1);
        continue;
      }

      if (s.kind === 'rain') {
        const stretch = s.detached ? 1.65 : (1.25 + Math.min(0.45, s.vy * 0.18));
        ctx.fillStyle = 'rgba(186, 230, 253, 0.78)';
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.r * 0.8, s.r * stretch, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
        ctx.beginPath();
        ctx.arc(s.x - s.r * 0.22, s.y - s.r * 0.35, Math.max(0.6, s.r * 0.3), 0, Math.PI * 2);
        ctx.fill();
      } else {
        const sp = snowSprites[s.variant];
        if (sp) {
          const sz = s.r * 2.2;
          ctx.save();
          ctx.globalAlpha = 0.86;
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rot);
          ctx.drawImage(sp, -sz / 2, -sz / 2, sz, sz);
          ctx.restore();
        }
      }
    }

    // 5. Update & draw crown splash droplets
    for (let i = splashes.length - 1; i >= 0; i--) {
      const sp = splashes[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vy += 0.22 * Math.sqrt(spd);
      sp.alpha -= 0.042;
      if (sp.alpha <= 0) {
        splashes.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(224, 242, 254, ${sp.alpha})`;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  window.__qusaUpdateWeather = (newCfg) => {
    const nextMode = newCfg.weatherEffect || 'none';
    const modeChanged = nextMode !== mode;
    mode = nextMode;
    intensity = Number(newCfg.weatherIntensity || 1.0);
    speedMul = Number(newCfg.weatherSpeed || 1.0);
    canvas.style.display = mode !== 'none' ? 'block' : 'none';
    if (modeChanged) {
      particles = [];
      resting = [];
      sliding = [];
      splashes = [];
      rings = [];
    }
    syncParticleCount();
    if (mode !== 'none' && !rafId) {
      scanColliders();
      rafId = requestAnimationFrame(step);
    }
  };

  if (mode !== 'none') {
    scanColliders();
    syncParticleCount();
    rafId = requestAnimationFrame(step);
  }
}

// --- Spotify Dynamic Island ---

const SPOTIFY_LOGO_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="#1db954"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 14.42c-.18.3-.56.39-.86.21-2.35-1.44-5.31-1.76-8.8-.96-.34.08-.68-.13-.76-.47-.08-.34.13-.68.47-.76 3.82-.87 7.1-.5 9.74 1.12.3.18.39.56.21.86zm1.22-2.72c-.23.37-.71.49-1.08.26-2.69-1.65-6.79-2.13-9.97-1.17-.42.13-.86-.11-.99-.53-.13-.42.11-.86.53-.99 3.63-1.1 8.14-.57 11.24 1.34.37.23.49.71.27 1.09zm.11-2.83C14.69 8.95 9.37 8.77 6.29 9.71c-.5.15-1.02-.13-1.17-.62-.15-.5.13-1.02.62-1.17 3.53-1.07 9.41-.86 13.12 1.34.45.27.59.84.33 1.29-.27.44-.84.59-1.27.32z"/></svg>`;

const QSP_ICON_REPEAT = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>`;
const QSP_ICON_REPEAT_LIST = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/><circle cx="12" cy="22" r="1.4" fill="currentColor" stroke="none"/></svg>`;
const QSP_ICON_REPEAT_ONE = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/><path d="M11 10h1v4"/></svg>`;

const QSP_ICON_LYRICS = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`;
const QSP_ICON_HEART_SM = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
const QSP_ICON_DJ = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>`;

function parseLrcLyrics(lrcStr) {
  if (!lrcStr || typeof lrcStr !== 'string') return [];
  const out = [];
  const lines = lrcStr.split(/\r?\n/);
  const tagRe = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
  for (const rawLine of lines) {
    const times = [];
    let m;
    tagRe.lastIndex = 0;
    while ((m = tagRe.exec(rawLine)) !== null) {
      const min = parseInt(m[1], 10) || 0;
      const sec = parseInt(m[2], 10) || 0;
      const fracRaw = m[3] || '0';
      const frac = fracRaw.length === 3 ? parseInt(fracRaw, 10) / 1000 : parseInt(fracRaw, 10) / 100;
      times.push(min * 60 + sec + frac);
    }
    const text = rawLine.replace(tagRe, '').trim();
    if (times.length > 0) {
      const isBreak = !text || /^[♪♫🎵🎶•·.\-\s]+$/.test(text);
      for (const t of times) out.push({ time: t, text: isBreak ? '' : text, instrumental: isBreak });
    }
  }
  out.sort((a, b) => a.time - b.time);
  return out;
}

function formatTrackTime(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? '0' : ''}${r}`;
}

function initSpotifyIsland(cfg) {
  if (document.getElementById('qusa-spotify-island')) return;
  if (!window.qusaPersist || typeof window.qusaPersist.spotifyState !== 'function') return;

  const el = document.createElement('div');
  el.id = 'qusa-spotify-island';
  el.innerHTML = `
    <div class="qsp-compact">
      <div class="qsp-art" id="qsp-art" title="Открыть полноэкранный плеер с текстом">${SPOTIFY_LOGO_SVG}</div>
      <div class="qsp-meta">
        <div class="qsp-meta-text">
          <div class="qsp-title" id="qsp-title">Spotify</div>
          <div class="qsp-artist" id="qsp-artist">Ожидание трека...</div>
        </div>
        <div class="qsp-live-bar" id="qsp-live-bar" title="Открыть текст песни"></div>
      </div>
      <div class="qsp-eq" id="qsp-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="qsp-mini-btns">
        <button class="qsp-btn" id="qsp-mini-prev" type="button" title="Предыдущий">⏮</button>
        <button class="qsp-btn" id="qsp-mini-play" type="button" title="Пауза / Воспроизвести">▶</button>
        <button class="qsp-btn" id="qsp-mini-next" type="button" title="Следующий">⏭</button>
      </div>
    </div>
    <div class="qsp-expand-wrap">
      <div class="qsp-expand">
        <div class="qsp-expand-lyric" id="qsp-expand-lyric" title="Открыть полноэкранный текст"></div>
        <div class="qsp-progress-wrap" id="qsp-mini-prog-wrap" style="display:none;">
          <div class="qsp-progress-track" id="qsp-mini-prog-track"><div class="qsp-progress-fill" id="qsp-mini-prog-fill"></div></div>
          <div class="qsp-times"><span id="qsp-mini-cur">0:00</span><span id="qsp-mini-dur">0:00</span></div>
        </div>
        <div class="qsp-controls">
          <button class="qsp-btn" id="qsp-btn-repeat" type="button" title="Повтор (Выкл / Плейлист / Трек)">${QSP_ICON_REPEAT}</button>
          <button class="qsp-btn" id="qsp-btn-prev" type="button" title="Предыдущий трек">⏮</button>
          <button class="qsp-btn primary" id="qsp-btn-play" type="button" title="Пауза / Воспроизвести">▶</button>
          <button class="qsp-btn" id="qsp-btn-next" type="button" title="Следующий трек">⏭</button>
          <button class="qsp-btn" id="qsp-btn-like" type="button" title="Добавить текущий трек в Избранное">♡</button>
        </div>
        <div class="qsp-quick">
          <button class="qsp-chip" id="qsp-open-lyrics" type="button" title="Полноэкранный плеер и текст песни">${QSP_ICON_LYRICS}<span>Текст</span></button>
          <button class="qsp-chip" id="qsp-open-liked" type="button" title="Открыть Избранное в Spotify">${QSP_ICON_HEART_SM}<span>Лайки</span></button>
          <button class="qsp-chip" id="qsp-open-dj" type="button" title="Запустить Spotify DJ">${QSP_ICON_DJ}<span>DJ</span></button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(el);

  const fsEl = document.createElement('div');
  fsEl.id = 'qusa-lyrics-overlay';
  fsEl.innerHTML = `
    <div id="qsp-fs-bg"></div>
    <div id="qsp-fs-vignette"></div>
    <button id="qsp-fs-close" type="button" title="Свернуть (Esc)">⌄</button>
    <div class="qsp-fs-body">
      <div class="qsp-fs-left">
        <div class="qsp-fs-art" id="qsp-fs-art">${SPOTIFY_LOGO_SVG}</div>
        <div class="qsp-fs-meta">
          <div class="qsp-fs-title" id="qsp-fs-title">Spotify</div>
          <div class="qsp-fs-artist" id="qsp-fs-artist"></div>
        </div>
        <div class="qsp-progress-wrap" id="qsp-fs-prog-wrap">
          <div class="qsp-progress-track" id="qsp-fs-prog-track"><div class="qsp-progress-fill" id="qsp-fs-prog-fill"></div></div>
          <div class="qsp-times"><span id="qsp-fs-cur">0:00</span><span id="qsp-fs-dur">0:00</span></div>
        </div>
        <div class="qsp-fs-controls">
          <button class="qsp-btn" id="qsp-fs-repeat" type="button" title="Повтор">${QSP_ICON_REPEAT}</button>
          <button class="qsp-btn" id="qsp-fs-prev" type="button" title="Предыдущий трек">⏮</button>
          <button class="qsp-btn primary" id="qsp-fs-play" type="button" title="Пауза / Воспроизвести">▶</button>
          <button class="qsp-btn" id="qsp-fs-next" type="button" title="Следующий трек">⏭</button>
          <button class="qsp-btn" id="qsp-fs-like" type="button" title="В Избранное">♡</button>
        </div>
      </div>
      <div class="qsp-fs-right" id="qsp-fs-lyrics">
        <div class="qsp-fs-empty">Поиск текста песни...</div>
      </div>
    </div>
  `;
  document.body.appendChild(fsEl);

  const artEl = document.getElementById('qsp-art');
  const titleEl = document.getElementById('qsp-title');
  const artistEl = document.getElementById('qsp-artist');
  const liveBarEl = document.getElementById('qsp-live-bar');
  const expandLyricEl = document.getElementById('qsp-expand-lyric');
  const miniProgWrap = document.getElementById('qsp-mini-prog-wrap');
  const miniProgTrack = document.getElementById('qsp-mini-prog-track');
  const miniProgFill = document.getElementById('qsp-mini-prog-fill');
  const miniCurEl = document.getElementById('qsp-mini-cur');
  const miniDurEl = document.getElementById('qsp-mini-dur');
  const btnOpenLyrics = document.getElementById('qsp-open-lyrics');
  const miniPlay = document.getElementById('qsp-mini-play');
  const btnPlay = document.getElementById('qsp-btn-play');
  const btnRepeat = document.getElementById('qsp-btn-repeat');
  const btnLike = document.getElementById('qsp-btn-like');
  const eqBars = Array.from(document.querySelectorAll('#qsp-eq i'));

  const fsBgEl = document.getElementById('qsp-fs-bg');
  const fsArtEl = document.getElementById('qsp-fs-art');
  const fsTitleEl = document.getElementById('qsp-fs-title');
  const fsArtistEl = document.getElementById('qsp-fs-artist');
  const fsProgTrack = document.getElementById('qsp-fs-prog-track');
  const fsProgFill = document.getElementById('qsp-fs-prog-fill');
  const fsCurEl = document.getElementById('qsp-fs-cur');
  const fsDurEl = document.getElementById('qsp-fs-dur');
  const fsPlayBtn = document.getElementById('qsp-fs-play');
  const fsRepeatBtn = document.getElementById('qsp-fs-repeat');
  const fsLikeBtn = document.getElementById('qsp-fs-like');
  const fsLyricsBox = document.getElementById('qsp-fs-lyrics');

  let lastCover = '';
  let webCover = '';
  let gsmtcCover = '';
  let isScrubbing = false;
  let scrubPos = 0;
  let currentTrackKey = '';
  let currentTrackMetaKey = '';
  const likedTracks = new Set(Array.isArray(cfg.spotifyLiked) ? cfg.spotifyLiked : []);
  let pollBusy = false;

  const applyCoverArt = () => {
    const covMini = gsmtcCover || webCover || '';
    const covFull = webCover || gsmtcCover || '';
    if (covMini !== lastCover) {
      lastCover = covMini;
      artEl.innerHTML = covMini ? `<img src="${covMini}" alt="" />` : SPOTIFY_LOGO_SVG;
    }
    fsArtEl.innerHTML = covFull ? `<img src="${covFull}" alt="" />` : SPOTIFY_LOGO_SVG;
    fsBgEl.style.backgroundImage = covFull ? `url("${covFull}")` : 'none';
  };

  // Live timeline & lyrics state
  let basePosition = 0;
  let basePositionAt = Date.now();
  let trackDuration = 0;
  let timelineSyncedOnce = false;
  let lyricsFetchedWithDur = false;
  let syncedLines = [];
  let plainLines = [];
  let activeLineIdx = -1;
  let fsLineNodes = new Map();
  let userManualScrollUntil = 0;
  let lyricsReqId = 0;

  fsLyricsBox.addEventListener('wheel', () => { userManualScrollUntil = Date.now() + 3500; }, { passive: true });
  fsLyricsBox.addEventListener('touchstart', () => { userManualScrollUntil = Date.now() + 3500; }, { passive: true });

  const openFullscreen = () => {
    if (!isCurrentlyVisible) return;
    fsEl.classList.add('open');
    const curNode = activeLineIdx >= 0 ? fsLineNodes.get(activeLineIdx) : null;
    if (curNode) {
      setTimeout(() => {
        const top = curNode.offsetTop - fsLyricsBox.clientHeight * 0.42 + curNode.clientHeight / 2;
        fsLyricsBox.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }, 60);
    }
  };
  const closeFullscreen = () => {
    fsEl.classList.remove('open');
  };

  document.getElementById('qsp-fs-close').addEventListener('click', closeFullscreen);
  fsEl.addEventListener('click', (e) => {
    if (e.target === fsEl || e.target === fsBgEl || e.target.id === 'qsp-fs-vignette') closeFullscreen();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fsEl.classList.contains('open')) closeFullscreen();
  });
  artEl.addEventListener('click', (e) => { e.stopPropagation(); openFullscreen(); });
  liveBarEl.addEventListener('click', (e) => { e.stopPropagation(); openFullscreen(); });
  expandLyricEl.addEventListener('click', (e) => { e.stopPropagation(); openFullscreen(); });
  btnOpenLyrics.addEventListener('click', () => { openFullscreen(); });

  let liveBarWords = [];
  let expandWords = [];
  let fsWordMap = new Map();
  let lastCurWordIdx = -1;
  const lyricMeasureCanvas = document.createElement('canvas');
  const lyricMeasureCtx = lyricMeasureCanvas.getContext('2d');

  const syncAutoWidthClass = () => {
    el.classList.toggle('auto-width', cfg.spotifyAutoWidth !== false);
  };
  syncAutoWidthClass();

  const updateDynamicWidth = (text) => {
    if (cfg.spotifyAutoWidth === false || !text) {
      el.style.removeProperty('--qsp-dyn-w');
      return;
    }
    let textW = 0;
    if (liveBarWords && liveBarWords.length > 0) {
      const firstRect = liveBarWords[0].el.getBoundingClientRect();
      const lastRect = liveBarWords[liveBarWords.length - 1].el.getBoundingClientRect();
      if (lastRect.right > firstRect.left) {
        textW = lastRect.right - firstRect.left;
      } else {
        for (let i = 0; i < liveBarWords.length; i++) {
          textW += liveBarWords[i].el.getBoundingClientRect().width + 6;
        }
      }
      // Headroom for active word scale + padding (0.48em) + glow padding (16px)
      textW += 44;
    }
    if (textW < 20 && lyricMeasureCtx) {
      const isSys = cfg.lyricsFontMode === 'system';
      const activeFamily = isSys
        ? 'system-ui, -apple-system, sans-serif'
        : "'QusaLyricsFont', system-ui, -apple-system, sans-serif";
      lyricMeasureCtx.font = `${isSys ? '600 12px' : '400 14.5px'} ${activeFamily}`;
      textW = lyricMeasureCtx.measureText(text).width * (isSys ? 1.18 : 1.38) + 44;
    }
    // Fixed chrome: art (22) + eq (18) + mini btns (76) + gaps/paddings (52) = 168px
    const maxW = Math.min(680, Math.round(window.innerWidth * 0.72));
    const targetW = Math.max(278, Math.min(maxW, Math.ceil(textW + 172)));
    el.style.setProperty('--qsp-dyn-w', `${targetW}px`);
  };

  const buildWordSpans = (container, text) => {
    container.innerHTML = '';
    const tokens = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];
    const weights = tokens.map((w) => {
      const base = Math.max(1.6, w.replace(/[.,!?;:—\-«»"']/g, '').length);
      const pause = /[,;:—]$/.test(w) ? 1.8 : /[.!?]$/.test(w) ? 2.4 : 0;
      return base + pause;
    });
    const totalW = weights.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    const out = [];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < tokens.length; i++) {
      const span = document.createElement('span');
      span.className = 'qsp-w';
      span.textContent = tokens[i];
      frag.appendChild(span);
      const start = acc / totalW;
      acc += weights[i];
      const end = acc / totalW;
      out.push({ el: span, start, end });
    }
    container.appendChild(frag);
    return out;
  };

  const applyWordHighlight = (words, ratio) => {
    if (!words || words.length === 0) return -1;
    let curIdx = words.length - 1;
    for (let i = 0; i < words.length; i++) {
      if (ratio < words[i].end) {
        curIdx = i;
        break;
      }
    }
    for (let i = 0; i < words.length; i++) {
      const wEl = words[i].el;
      wEl.classList.toggle('past', i < curIdx);
      wEl.classList.toggle('cur', i === curIdx);
    }
    return curIdx;
  };

  const clearWordHighlight = (words) => {
    if (!words) return;
    for (let i = 0; i < words.length; i++) {
      words[i].el.classList.remove('past', 'cur');
    }
  };

  const renderFsLyricsDom = (statusMsg) => {
    fsLineNodes = new Map();
    fsWordMap = new Map();
    activeLineIdx = -1;
    lastCurWordIdx = -1;
    const hasRealSynced = syncedLines.some((item) => !item.instrumental && item.text);
    if (hasRealSynced) {
      fsLyricsBox.innerHTML = '';
      const frag = document.createDocumentFragment();
      syncedLines.forEach((item, idx) => {
        if (item.instrumental || !item.text) return;
        const div = document.createElement('div');
        div.className = 'qsp-fs-line';
        const wItems = buildWordSpans(div, item.text);
        div.addEventListener('click', () => {
          basePosition = item.time;
          basePositionAt = Date.now();
          userManualScrollUntil = 0;
          void runAction(`seek:${item.time.toFixed(2)}`);
        });
        fsLineNodes.set(idx, div);
        fsWordMap.set(idx, wItems);
        frag.appendChild(div);
      });
      fsLyricsBox.appendChild(frag);
      btnOpenLyrics.classList.add('has-lyrics');
    } else if (plainLines.length > 0) {
      fsLyricsBox.innerHTML = '';
      const frag = document.createDocumentFragment();
      plainLines.forEach((txt) => {
        const div = document.createElement('div');
        div.className = 'qsp-fs-line plain';
        div.textContent = txt;
        frag.appendChild(div);
      });
      fsLyricsBox.appendChild(frag);
      btnOpenLyrics.classList.add('has-lyrics');
    } else {
      fsLyricsBox.innerHTML = `<div class="qsp-fs-empty">${statusMsg || 'Текст песни не найден'}</div>`;
      btnOpenLyrics.classList.remove('has-lyrics');
    }
  };

  let coverReqId = 0;
  const fetchCoverForTrack = async (artist, title) => {
    const reqId = ++coverReqId;
    if (!window.qusaPersist || typeof window.qusaPersist.spotifyCover !== 'function') return;
    try {
      const res = await window.qusaPersist.spotifyCover({ artist, title });
      if (reqId !== coverReqId) return;
      if (res && res.cover) {
        webCover = res.cover;
        applyCoverArt();
      }
      if (res && typeof res.duration === 'number' && res.duration > 1 && trackDuration <= 1) {
        trackDuration = res.duration;
        timelineSyncedOnce = true;
      }
    } catch {}
  };

  const fetchLyricsForTrack = async (artist, title, duration) => {
    const reqId = ++lyricsReqId;
    syncedLines = [];
    plainLines = [];
    el.classList.remove('has-live-lyric');
    expandLyricEl.classList.remove('show');
    expandLyricEl.textContent = '';
    liveBarEl.textContent = '';
    renderFsLyricsDom('Поиск текста песни...');
    if (!window.qusaPersist || typeof window.qusaPersist.spotifyLyrics !== 'function') {
      renderFsLyricsDom('Текст недоступен');
      return;
    }
    try {
      const res = await window.qusaPersist.spotifyLyrics({ artist, title, duration });
      if (reqId !== lyricsReqId) return;
      if (res && res.cover) {
        webCover = res.cover;
        applyCoverArt();
      }
      if (res && typeof res.duration === 'number' && res.duration > 1 && trackDuration <= 1) {
        trackDuration = res.duration;
        timelineSyncedOnce = true;
      }
      if (res && res.synced) {
        syncedLines = parseLrcLyrics(res.synced);
      }
      if (syncedLines.length === 0 && res && res.plain) {
        plainLines = String(res.plain).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
      }
      renderFsLyricsDom('Для этого трека текст не найден');
    } catch {
      if (reqId !== lyricsReqId) return;
      renderFsLyricsDom('Не удалось загрузить текст');
    }
  };

  const getLivePos = () => {
    let pos = basePosition;
    if (isCurrentlyPlaying) {
      pos += (Date.now() - basePositionAt) / 1000;
    }
    if (pos < 0) pos = 0;
    if (trackDuration > 0 && pos > trackDuration) pos = trackDuration;
    return pos;
  };

  const tickLiveLyrics = () => {
    if (!isCurrentlyVisible) return;
    const pos = isScrubbing ? scrubPos : getLivePos();
    const dur = trackDuration;
    const pct = dur > 0 ? Math.min(100, Math.max(0, (pos / dur) * 100)) : 0;

    if (dur > 0) {
      miniProgWrap.style.display = 'flex';
      miniProgFill.style.width = `${pct.toFixed(2)}%`;
      miniCurEl.textContent = `${formatTrackTime(pos)} / ${formatTrackTime(dur)}`;
      miniDurEl.textContent = '';
      fsProgFill.style.width = `${pct.toFixed(2)}%`;
      fsCurEl.textContent = formatTrackTime(pos);
      fsDurEl.textContent = formatTrackTime(dur);
    } else {
      miniProgWrap.style.display = 'none';
      fsProgFill.style.width = '0%';
      fsCurEl.textContent = '0:00';
      fsDurEl.textContent = '0:00';
    }

    if (syncedLines.length === 0 || !timelineSyncedOnce) {
      el.classList.remove('has-live-lyric');
      expandLyricEl.classList.remove('show');
      return;
    }

    // Strict sync with LRC timestamps (no artificial lookahead so text never appears early)
    const t = pos;
    let idx = -1;
    for (let i = 0; i < syncedLines.length; i++) {
      if (syncedLines[i].time <= t) idx = i;
      else break;
    }

    const curLine = idx >= 0 ? syncedLines[idx] : null;
    const nextTime = idx >= 0 && idx + 1 < syncedLines.length
      ? syncedLines[idx + 1].time
      : (curLine && dur > curLine.time ? dur : (curLine ? curLine.time + 5 : 0));
    const gap = curLine ? Math.max(0.5, nextTime - curLine.time) : 0;
    const elapsedInLine = curLine ? (t - curLine.time) : 0;
    // Hide lyric during intro (idx < 0), explicit instrumental LRC markers, or long instrumental breaks (>11s gap after 7.5s)
    const isSilentBreak = !curLine || curLine.instrumental || !curLine.text || (gap > 11.0 && elapsedInLine > 7.5);

    if (!isSilentBreak) {
      const displaySpan = Math.min(gap, 7.0);
      const lineRatio = Math.min(0.999, Math.max(0, elapsedInLine / Math.max(0.4, displaySpan)));

      el.classList.toggle('has-live-lyric', isCurrentlyPlaying);
      if (idx !== activeLineIdx) {
        if (activeLineIdx >= 0) clearWordHighlight(fsWordMap.get(activeLineIdx));
        activeLineIdx = idx;
        lastCurWordIdx = -1;
        liveBarWords = buildWordSpans(liveBarEl, curLine.text);
        expandWords = buildWordSpans(expandLyricEl, curLine.text);
        expandLyricEl.classList.add('show');
        updateDynamicWidth(curLine.text);

        fsLineNodes.forEach((n, lineIdx) => {
          n.classList.toggle('active', lineIdx === idx);
          n.classList.toggle('past', lineIdx < idx);
        });
        const curNode = fsLineNodes.get(idx);
        if (fsEl.classList.contains('open') && Date.now() > userManualScrollUntil && curNode) {
          const top = curNode.offsetTop - fsLyricsBox.clientHeight * 0.42 + curNode.clientHeight / 2;
          fsLyricsBox.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
      }

      const wIdx = applyWordHighlight(liveBarWords, lineRatio);
      if (wIdx !== lastCurWordIdx) {
        lastCurWordIdx = wIdx;
        applyWordHighlight(expandWords, lineRatio);
        applyWordHighlight(fsWordMap.get(idx), lineRatio);
      }
    } else {
      el.classList.remove('has-live-lyric');
      el.style.removeProperty('--qsp-dyn-w');
      expandLyricEl.classList.remove('show');
      if (activeLineIdx !== -1) {
        clearWordHighlight(fsWordMap.get(activeLineIdx));
        activeLineIdx = -1;
        lastCurWordIdx = -1;
        fsLineNodes.forEach((n, lineIdx) => {
          n.classList.remove('active');
          n.classList.toggle('past', idx >= 0 && lineIdx <= idx);
        });
      }
    }
  };

  const bindSeekScrubber = (trackEl, keepIslandOpen) => {
    const calcSec = (clientX) => {
      const rect = trackEl.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / Math.max(1, rect.width)));
      return ratio * trackDuration;
    };
    const onMove = (e) => {
      if (!isScrubbing || trackDuration <= 0) return;
      scrubPos = calcSec(e.clientX);
      tickLiveLyrics();
    };
    const onUp = (e) => {
      if (!isScrubbing) return;
      isScrubbing = false;
      trackEl.classList.remove('dragging');
      if (keepIslandOpen) el.classList.remove('expanded');
      try { trackEl.releasePointerCapture(e.pointerId); } catch {}
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (trackDuration > 0) {
        const targetSec = calcSec(e.clientX);
        basePosition = targetSec;
        basePositionAt = Date.now();
        tickLiveLyrics();
        void runAction(`seek:${targetSec.toFixed(2)}`);
      }
    };
    trackEl.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || trackDuration <= 0) return;
      e.stopPropagation();
      e.preventDefault();
      isScrubbing = true;
      trackEl.classList.add('dragging');
      if (keepIslandOpen) el.classList.add('expanded');
      try { trackEl.setPointerCapture(e.pointerId); } catch {}
      scrubPos = calcSec(e.clientX);
      tickLiveLyrics();
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    });
  };
  bindSeekScrubber(miniProgTrack, true);
  bindSeekScrubber(fsProgTrack, false);

  const syncLikeBtn = () => {
    const isLiked = Boolean(currentTrackKey && likedTracks.has(currentTrackKey));
    btnLike.classList.toggle('liked', isLiked);
    btnLike.textContent = isLiked ? '♥' : '♡';
    btnLike.title = isLiked ? 'Убрать трек из Избранного' : 'Добавить текущий трек в Избранное';
    fsLikeBtn.classList.toggle('liked', isLiked);
    fsLikeBtn.textContent = isLiked ? '♥' : '♡';
    fsLikeBtn.title = btnLike.title;
  };
  let peakBusy = false;
  let actionBusy = false;
  let isCurrentlyPlaying = false;
  let isCurrentlyVisible = false;
  let smoothBars = [3, 3, 3, 3];

  const updateEqBars = (peaks) => {
    if (!eqBars.length) return;
    if (!isCurrentlyPlaying || !Array.isArray(peaks) || peaks.length === 0) {
      for (let i = 0; i < eqBars.length; i++) {
        smoothBars[i] = 3;
        eqBars[i].style.height = '3px';
      }
      return;
    }
    const l = Number(peaks[0] || 0);
    const m = Number(peaks[1] || l);
    const r = Number(peaks[2] || l);
    const toH = (v, jitter) => {
      const norm = Math.min(1, Math.pow(Math.max(0, v * 1.45), 0.68) * jitter);
      return Math.max(3, Math.min(14, Math.round(3 + norm * 11)));
    };
    const rawTargets = [
      toH(l, 0.92 + Math.random() * 0.16),
      toH(m, 1.02 + Math.random() * 0.14),
      toH((l + r) * 0.5, 0.88 + Math.random() * 0.22),
      toH(r, 0.95 + Math.random() * 0.15),
    ];
    for (let i = 0; i < eqBars.length; i++) {
      const target = rawTargets[i] || 3;
      smoothBars[i] = target >= smoothBars[i] ? target : Math.max(3, smoothBars[i] * 0.6 + target * 0.4);
      eqBars[i].style.height = `${Math.round(smoothBars[i])}px`;
    }
  };

  const renderState = (st) => {
    if (cfg.spotifyIsland === false) {
      isCurrentlyVisible = false;
      isCurrentlyPlaying = false;
      el.classList.remove('visible', 'playing', 'expanded', 'has-live-lyric');
      closeFullscreen();
      updateEqBars(null);
      return;
    }
    if (!st) return;
    if (!st.running) {
      isCurrentlyVisible = false;
      isCurrentlyPlaying = false;
      el.classList.remove('visible', 'playing', 'expanded', 'has-live-lyric');
      closeFullscreen();
      updateEqBars(null);
      return;
    }
    isCurrentlyVisible = true;
    el.classList.add('visible');
    isCurrentlyPlaying = st.status === 'Playing';
    el.classList.toggle('playing', isCurrentlyPlaying);

    const playGlyph = isCurrentlyPlaying ? '⏸' : '▶';
    miniPlay.textContent = playGlyph;
    btnPlay.textContent = playGlyph;
    fsPlayBtn.textContent = playGlyph;

    if (st.hasSession && (st.title || st.artist)) {
      const tStr = st.title || 'Без названия';
      const aStr = st.artist || 'Spotify';
      titleEl.textContent = tStr;
      artistEl.textContent = aStr;
      fsTitleEl.textContent = tStr;
      fsArtistEl.textContent = aStr;

      const nextKey = (st.title || st.artist || '').trim().toLowerCase();
      if (nextKey !== currentTrackKey) {
        currentTrackKey = nextKey;
        syncLikeBtn();
      }
      const nextMetaKey = `${aStr}|${tStr}`.toLowerCase();
      const hasValidTl = Boolean(st.timelineValid && typeof st.duration === 'number' && st.duration > 1);
      if (nextMetaKey !== currentTrackMetaKey) {
        currentTrackMetaKey = nextMetaKey;
        webCover = '';
        gsmtcCover = st.cover || '';
        lastCover = '';
        applyCoverArt();
        timelineSyncedOnce = hasValidTl;
        basePosition = hasValidTl ? Number(st.position || 0) : 0;
        basePositionAt = Date.now();
        trackDuration = hasValidTl ? Number(st.duration || 0) : 0;
        lyricsFetchedWithDur = hasValidTl;
        void fetchCoverForTrack(aStr, tStr);
        void fetchLyricsForTrack(aStr, tStr, trackDuration);
      } else if (hasValidTl) {
        trackDuration = st.duration;
        const reported = Number(st.position || 0);
        const curLive = getLivePos();
        if (!timelineSyncedOnce || !isCurrentlyPlaying || Math.abs(reported - curLive) > 0.35) {
          timelineSyncedOnce = true;
          basePosition = reported;
          basePositionAt = Date.now();
        }
        if (!lyricsFetchedWithDur && trackDuration > 1) {
          lyricsFetchedWithDur = true;
          void fetchLyricsForTrack(aStr, tStr, trackDuration);
        }
      }
    } else {
      titleEl.textContent = 'Spotify открыт';
      artistEl.textContent = 'Выбери Избранное или DJ';
      fsTitleEl.textContent = 'Spotify открыт';
      fsArtistEl.textContent = '';
      trackDuration = 0;
      if (currentTrackKey) {
        currentTrackKey = '';
        currentTrackMetaKey = '';
        syncedLines = [];
        plainLines = [];
        el.classList.remove('has-live-lyric');
        syncLikeBtn();
      }
    }

    const rep = st.repeat || 'None';
    const repIcon = rep === 'Track' ? QSP_ICON_REPEAT_ONE : rep === 'List' ? QSP_ICON_REPEAT_LIST : QSP_ICON_REPEAT;
    const repTitle = rep === 'Track' ? 'Повтор: 1 трек' : rep === 'List' ? 'Повтор: плейлист' : 'Повтор: выкл';
    btnRepeat.classList.toggle('active', rep !== 'None');
    btnRepeat.innerHTML = repIcon;
    btnRepeat.title = repTitle;
    fsRepeatBtn.classList.toggle('active', rep !== 'None');
    fsRepeatBtn.innerHTML = repIcon;
    fsRepeatBtn.title = repTitle;

    if (st.peaks) updateEqBars(st.peaks);

    const cov = st.cover || '';
    if (cov !== gsmtcCover) {
      gsmtcCover = cov;
      applyCoverArt();
    }
  };

  const poll = async () => {
    if (document.hidden || cfg.spotifyIsland === false || pollBusy || actionBusy) return;
    pollBusy = true;
    try {
      const st = await window.qusaPersist.spotifyState();
      if (st) renderState(st);
    } catch {}
    pollBusy = false;
  };

  const pollPeak = async () => {
    if (document.hidden || cfg.spotifyIsland === false || !isCurrentlyVisible || !isCurrentlyPlaying || peakBusy || pollBusy || actionBusy) return;
    if (typeof window.qusaPersist.spotifyPeak !== 'function') return;
    peakBusy = true;
    try {
      const res = await window.qusaPersist.spotifyPeak();
      if (res && res.peaks) updateEqBars(res.peaks);
    } catch {}
    peakBusy = false;
  };

  const runAction = async (cmd) => {
    actionBusy = true;
    try {
      const st = await window.qusaPersist.spotifyAction(cmd);
      if (st) renderState(st);
      if (cmd === 'next' || cmd === 'prev' || cmd === 'playpause' || cmd.startsWith('seek:')) {
        setTimeout(() => { void poll(); }, 280);
        setTimeout(() => { void poll(); }, 700);
      }
    } catch {}
    actionBusy = false;
  };

  const toggleLike = async () => {
    if (!currentTrackKey) return;
    if (likedTracks.has(currentTrackKey)) {
      likedTracks.delete(currentTrackKey);
    } else {
      likedTracks.add(currentTrackKey);
      if (likedTracks.size > 300) {
        const first = likedTracks.values().next().value;
        if (first) likedTracks.delete(first);
      }
    }
    cfg.spotifyLiked = Array.from(likedTracks);
    saveConfig(cfg, true);
    syncLikeBtn();
    await runAction('like');
  };

  document.getElementById('qsp-mini-prev').addEventListener('click', (e) => { e.stopPropagation(); void runAction('prev'); });
  document.getElementById('qsp-mini-play').addEventListener('click', (e) => { e.stopPropagation(); void runAction('playpause'); });
  document.getElementById('qsp-mini-next').addEventListener('click', (e) => { e.stopPropagation(); void runAction('next'); });
  document.getElementById('qsp-btn-prev').addEventListener('click', () => { void runAction('prev'); });
  document.getElementById('qsp-btn-play').addEventListener('click', () => { void runAction('playpause'); });
  document.getElementById('qsp-btn-next').addEventListener('click', () => { void runAction('next'); });
  document.getElementById('qsp-btn-repeat').addEventListener('click', () => { void runAction('repeat'); });
  btnLike.addEventListener('click', () => { void toggleLike(); });

  document.getElementById('qsp-fs-prev').addEventListener('click', () => { void runAction('prev'); });
  fsPlayBtn.addEventListener('click', () => { void runAction('playpause'); });
  document.getElementById('qsp-fs-next').addEventListener('click', () => { void runAction('next'); });
  fsRepeatBtn.addEventListener('click', () => { void runAction('repeat'); });
  fsLikeBtn.addEventListener('click', () => { void toggleLike(); });

  document.getElementById('qsp-open-liked').addEventListener('click', () => {
    void window.qusaPersist.spotifyOpen('spotify:collection:tracks');
  });

  document.getElementById('qsp-open-dj').addEventListener('click', () => {
    void window.qusaPersist.spotifyOpen('spotify:playlist:37i9dQZF1EYkqdzj48dyYq');
  });

  window.__qusaUpdateSpotify = (newCfg) => {
    cfg = newCfg;
    syncAutoWidthClass();
    if (cfg.spotifyAutoWidth === false) el.style.removeProperty('--qsp-dyn-w');
    else if (activeLineIdx >= 0 && syncedLines[activeLineIdx]) updateDynamicWidth(syncedLines[activeLineIdx].text);
    if (cfg.spotifyIsland === false) {
      isCurrentlyVisible = false;
      isCurrentlyPlaying = false;
      el.classList.remove('visible', 'playing', 'expanded', 'has-live-lyric');
      closeFullscreen();
    } else {
      void poll();
    }
  };

  void poll();
  setInterval(() => { void poll(); }, 300);
  setInterval(() => { void pollPeak(); }, 95);
  setInterval(() => { tickLiveLyrics(); }, 80);
}

function initReiPet(cfg) {
  if (document.getElementById('qusa-rei-pet')) return;

  const EMOTIONS = ['❤️', '💻', '✨', '❄️', '💙', '🎵', '⚡', '💤'];
  const REI_WEBP = 'data:image/webp;base64,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';

  const pet = document.createElement('div');
  pet.id = 'qusa-rei-pet';
  pet.title = 'Rei — потяни мышкой, кликни для эмоции или погладь курсором (2 сек)';
  pet.style.cssText = 'position:fixed;left:0;top:0;z-index:99992;cursor:grab;user-select:none;touch-action:none;will-change:transform;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.65));';

  const getDims = () => {
    const h = Math.max(36, Math.min(96, Number(cfg.antySize || 58)));
    const w = Math.round(h * (102 / 160));
    return { w, h };
  };

  const applySizeAndVis = () => {
    const { w, h } = getDims();
    pet.style.width = `${w}px`;
    pet.style.height = `${h}px`;
    const svg = pet.querySelector('svg');
    if (svg) {
      svg.setAttribute('width', String(w));
      svg.setAttribute('height', String(h));
    }
    pet.style.display = (cfg.antyEnabled !== false && cfg.antyCharacter === 'rei') ? 'block' : 'none';
  };

  const initDims = getDims();
  pet.innerHTML = `
    <div id="qusa-rei-emo" style="position:absolute;left:50%;top:-18px;transform:translate(-50%,0);opacity:0;transition:opacity .2s,transform .2s;font-size:13px;pointer-events:none;">❄️</div>
    <div id="qusa-rei-wrap" style="transform-origin:center center;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 160" width="${initDims.w}" height="${initDims.h}" style="overflow:visible;display:block;">
        <defs>
          <image id="qusaReiStandImg" x="0" y="0" width="102" height="156" href="${REI_WEBP}"/>
          <clipPath id="qusaReiStandUp"><rect x="0" y="0" width="102" height="131"/></clipPath>
          <clipPath id="qusaReiStandL"><rect x="26" y="127" width="27" height="30"/></clipPath>
          <clipPath id="qusaReiStandR"><rect x="53" y="127" width="25" height="30"/></clipPath>
          <radialGradient id="qusaReiStandSh" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(8,14,28,0.58)"/><stop offset="100%" stop-color="rgba(8,14,28,0)"/>
          </radialGradient>
        </defs>
        <ellipse id="qusa-rei-sh" cx="51" cy="156" rx="22" ry="4" fill="url(#qusaReiStandSh)" style="transform-origin:51px 156px;"/>
        <g id="qusa-rei-body" style="transform-origin:51px 132px;">
          <g id="qusa-rei-leg-l" clip-path="url(#qusaReiStandL)" style="transform-origin:42px 129px;"><use href="#qusaReiStandImg"/></g>
          <g id="qusa-rei-leg-r" clip-path="url(#qusaReiStandR)" style="transform-origin:62px 129px;"><use href="#qusaReiStandImg"/></g>
          <g clip-path="url(#qusaReiStandUp)"><use href="#qusaReiStandImg"/></g>
        </g>
      </svg>
    </div>`;
  document.body.appendChild(pet);
  applySizeAndVis();

  const emo = pet.querySelector('#qusa-rei-emo');
  const wrap = pet.querySelector('#qusa-rei-wrap');
  const legL = pet.querySelector('#qusa-rei-leg-l');
  const legR = pet.querySelector('#qusa-rei-leg-r');
  const body = pet.querySelector('#qusa-rei-body');
  const sh = pet.querySelector('#qusa-rei-sh');

  let emoT = null;
  const say = (e) => {
    emo.textContent = e;
    emo.style.opacity = '1';
    emo.style.transform = 'translate(-50%,-6px)';
    clearTimeout(emoT);
    emoT = setTimeout(() => {
      emo.style.opacity = '0';
      emo.style.transform = 'translate(-50%,0)';
    }, 1500);
  };

  const spawnHeart = () => {
    const h = document.createElement('span');
    h.className = 'qusa-anty-heart';
    h.textContent = Math.random() < 0.5 ? '💙' : '♥';
    h.style.left = `${30 + Math.random() * 40}%`;
    h.style.top = `${4 + Math.random() * 14}%`;
    pet.appendChild(h);
    setTimeout(() => h.remove(), 950);
  };

  const getSurfaceBounds = () => {
    const comp = document.querySelector('[data-qusa-composer="1"]');
    const { w, h } = getDims();
    if (comp) {
      const r = comp.getBoundingClientRect();
      if (r.width >= 160 && r.height >= 40 && r.top > h + 20 && r.bottom <= window.innerHeight + 10) {
        return {
          minX: r.left + 12,
          maxX: Math.max(r.left + 20, r.right - w - 12),
          groundY: r.top - h + 4,
        };
      }
    }
    return {
      minX: 280,
      maxX: Math.max(300, window.innerWidth - w - 24),
      groundY: window.innerHeight - h - 10,
    };
  };

  const initB = getSurfaceBounds();
  const st = {
    x: initB.minX + Math.min(120, (initB.maxX - initB.minX) * 0.25),
    yOffset: 0,
    vx: 22,
    vy: 0,
    dir: 1,
    phase: 0,
    squash: 0,
    drag: false,
    fall: false,
    pauseUntil: 0,
    nextEmo: performance.now() + 5000,
    hoverStart: 0,
    lastPetHeart: 0,
  };

  pet.addEventListener('pointerenter', () => { st.hoverStart = Date.now(); });
  pet.addEventListener('pointerleave', () => { st.hoverStart = 0; });
  pet.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    st.drag = true;
    st.fall = false;
    st.vy = 0;
    st.sx = e.clientX;
    st.sy = e.clientY;
    st.ox = st.x;
    st.oy = st.yOffset;
    st.moved = false;
    pet.style.cursor = 'grabbing';
    say('😮');
    try { pet.setPointerCapture(e.pointerId); } catch {}
  });
  pet.addEventListener('pointermove', (e) => {
    if (st.drag) {
      const dx = e.clientX - st.sx;
      const dy = e.clientY - st.sy;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) st.moved = true;
      const b = getSurfaceBounds();
      st.x = Math.max(8, Math.min(window.innerWidth - getDims().w - 8, st.ox + dx));
      st.yOffset = Math.min(window.innerHeight - b.groundY - getDims().h, st.oy + dy);
      if (dx !== 0) st.dir = dx > 0 ? 1 : -1;
      return;
    }
    if (st.hoverStart && Date.now() - st.hoverStart >= 1800) {
      const nowMs = Date.now();
      if (nowMs - st.lastPetHeart > 420) {
        st.lastPetHeart = nowMs;
        spawnHeart();
        say('💙');
      }
    }
  });
  const rel = (e) => {
    if (!st.drag) return;
    st.drag = false;
    pet.style.cursor = 'grab';
    try { pet.releasePointerCapture(e.pointerId); } catch {}
    if (!st.moved) {
      st.fall = true;
      st.vy = -240;
      say(EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]);
    } else if (st.yOffset < -2) {
      st.fall = true;
      st.vy = 0;
    } else {
      st.yOffset = 0;
      say('✨');
    }
  };
  pet.addEventListener('pointerup', rel);
  pet.addEventListener('pointercancel', rel);

  window.__qusaUpdateRei = (newCfg) => {
    cfg = newCfg;
    applySizeAndVis();
  };

  let last = performance.now();
  function step(now) {
    if (!pet.isConnected) return;
    requestAnimationFrame(step);
    if (document.hidden || cfg.antyEnabled === false || cfg.antyCharacter !== 'rei') return;
    if (now - last < 32) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    const b = getSurfaceBounds();
    if (!st.drag) {
      if (st.x < b.minX) st.x = b.minX;
      if (st.x > b.maxX) st.x = b.maxX;
    }

    let walking = false;
    if (st.drag) {
      // dangling while held
    } else if (st.fall) {
      st.vy += 1600 * dt;
      st.yOffset += st.vy * dt;
      if (st.yOffset >= 0) {
        st.yOffset = 0;
        st.squash = 0.7;
        if (Math.abs(st.vy) > 130) st.vy = -st.vy * 0.34;
        else { st.vy = 0; st.fall = false; say('✨'); }
      }
    } else if (cfg.antyRoam !== false && now > st.pauseUntil) {
      walking = true;
      st.phase += dt * 17.5;
      st.x += st.vx * (0.72 + 0.45 * Math.abs(Math.sin(st.phase))) * dt;
      if (st.x <= b.minX) { st.x = b.minX; st.vx = Math.abs(st.vx); st.dir = 1; }
      else if (st.x >= b.maxX) { st.x = b.maxX; st.vx = -Math.abs(st.vx); st.dir = -1; }
      if (Math.random() < 0.006) st.pauseUntil = now + 1400 + Math.random() * 1800;
    }

    st.squash = Math.max(0, st.squash - dt * 6);
    if (now > st.nextEmo && !st.drag && !st.fall) {
      st.nextEmo = now + 7000 + Math.random() * 6000;
      say(EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]);
    }

    const drawY = b.groundY + st.yOffset;
    pet.style.transform = `translate3d(${st.x.toFixed(1)}px, ${drawY.toFixed(1)}px, 0)`;
    wrap.style.transform = `scaleX(${st.dir})`;
    if (st.drag) {
      const d = Math.sin(now * 0.016) * 11;
      legL.style.transform = `rotate(${d.toFixed(1)}deg)`;
      legR.style.transform = `rotate(${(-d).toFixed(1)}deg)`;
      body.style.transform = 'translateY(0px)';
      sh.style.opacity = '0.18';
    } else if (walking) {
      const s = Math.sin(st.phase), c = Math.cos(st.phase);
      legL.style.transform = `translateY(${(Math.max(0, -c) * -3.5).toFixed(1)}px) rotate(${(s * 10.5).toFixed(1)}deg)`;
      legR.style.transform = `translateY(${(Math.max(0, c) * -3.5).toFixed(1)}px) rotate(${(-s * 10.5).toFixed(1)}deg)`;
      body.style.transform = `translateY(${(-Math.abs(s) * 2.2).toFixed(1)}px) rotate(${(c * 1.6).toFixed(1)}deg)`;
      sh.style.opacity = '0.88';
      sh.style.transform = `scale(${(1 - 0.08 * Math.abs(s)).toFixed(2)},1)`;
    } else {
      const breath = -Math.abs(Math.sin(now * 0.0024)) * 1.0;
      legL.style.transform = 'rotate(0deg)';
      legR.style.transform = 'rotate(0deg)';
      body.style.transform = `translateY(${breath.toFixed(1)}px) scale(${(1 + st.squash * 0.1).toFixed(3)},${(1 - st.squash * 0.12).toFixed(3)})`;
      const af = st.yOffset < -2 ? Math.max(0.15, 1 + st.yOffset / 140) : 1;
      sh.style.opacity = af.toFixed(2);
      sh.style.transform = `scale(${af.toFixed(2)},1)`;
    }
  }
  requestAnimationFrame(step);
}

function initQusaCustomUI() {
  const boot = async () => {
    if (!document.head || !document.body) return;
    const cfg = await loadConfigAsync();

    const savedLocal = await loadLocalWallpaper();
    if (savedLocal && savedLocal.blob) {
      activeLocalBlobUrl = URL.createObjectURL(savedLocal.blob);
      activeLocalMime = savedLocal.type || '';
      if (!cfg.wallpaperLocalName && savedLocal.name) {
        cfg.wallpaperLocalName = savedLocal.name;
      }
    }

    ensureLiquidGlassFilter();
    injectStyles(cfg);
    updateWallpaperLayer(cfg);
    createStyleUI(cfg);
    void loadAndApplyLyricsFont(cfg);
    initAntyMascot(cfg);
    initReiPet(cfg);
    initWeatherEffect(cfg);
    initSpotifyIsland(cfg);
    if (window.__qusaSyncWpStatus) window.__qusaSyncWpStatus();
    applySurfaceColors(cfg);
    applyTextTransforms(document.body, cfg);
    dockStyleButtonInSidebar();
    setTimeout(() => {
      applySurfaceColors(cfg);
      applyTextTransforms(document.body, cfg);
      dockStyleButtonInSidebar();
    }, 600);
    setTimeout(() => {
      applySurfaceColors(cfg);
      applyTextTransforms(document.body, cfg);
      dockStyleButtonInSidebar();
    }, 1800);

    window.addEventListener('beforeunload', () => {
      saveConfig(cfg, true);
    });

    // Clean solid/gradient hover-action overlays (including ::before/::after & React-mounted icons) inside sidebar rows
    const cleanSidebarRow = (row) => {
      if (!row || !row.isConnected) return;
      const rowRect = row.getBoundingClientRect();
      const kids = row.querySelectorAll('*');
      for (const k of kids) {
        if (k.tagName === 'SVG' || k.tagName === 'PATH' || k.tagName === 'CIRCLE' || k.tagName === 'LINE' || k.tagName === 'RECT' || k.tagName === 'POLYLINE') continue;
        const kr = k.getBoundingClientRect();
        if (kr.width === 0 || kr.height === 0) continue;
        const cs = getComputedStyle(k);
        const csB = getComputedStyle(k, '::before');
        const csA = getComputedStyle(k, '::after');
        const hasGrad = (cs.backgroundImage && cs.backgroundImage !== 'none') ||
          (csB.backgroundImage && csB.backgroundImage !== 'none') ||
          (csA.backgroundImage && csA.backgroundImage !== 'none');
        const isAbs = cs.position === 'absolute';
        const isRightActionBox = kr.width < rowRect.width * 0.85 && kr.left > rowRect.left + 30 && kr.right >= rowRect.right - 24;
        if (hasGrad || isAbs || isRightActionBox) {
          k.setAttribute('data-qusa-no-bg', '1');
        }
      }
    };

    document.addEventListener('pointerover', (e) => {
      if (!hasActiveWallpaper(cfg) && !(cfg.colorEnabled && cfg.baseColor.toLowerCase() !== '#121212')) return;
      if (e.clientX > 390) return;
      const target = e.target;
      if (!target || target.nodeType !== 1) return;
      if (target.closest('#qusa-theme-modal, #qusa-style-fab')) return;
      let row = target;
      let bestRow = null;
      while (row && row !== document.body) {
        const r = row.getBoundingClientRect();
        if (r.left <= 40 && r.height >= 20 && r.height <= 56 && r.width >= 100 && r.width <= 385) {
          bestRow = row;
        }
        row = row.parentElement;
      }
      if (!bestRow) return;
      cleanSidebarRow(bestRow);
      requestAnimationFrame(() => cleanSidebarRow(bestRow));
      setTimeout(() => cleanSidebarRow(bestRow), 60);
    }, true);

    let recolorTimer = null;
    const observer = new MutationObserver((mutations) => {
      if (!recolorTimer) {
        recolorTimer = setTimeout(() => {
          recolorTimer = null;
          applySurfaceColors(cfg);
          dockStyleButtonInSidebar();
        }, 800);
      }
      const pairs = getActiveModelPairs(cfg);
      const hasAcc = Boolean((cfg.customAccountName || '').trim());
      if (!cfg.ruEnabled && !cfg.translateThoughts && pairs.length === 0 && !hasAcc) return;

      for (const m of mutations) {
        if (m.type === 'characterData') {
          processSingleTextNode(m.target, cfg, pairs);
        } else if (m.type === 'childList') {
          for (const added of m.addedNodes) {
            if (added.nodeType === Node.ELEMENT_NODE || added.nodeType === Node.TEXT_NODE) {
              applyTextTransforms(added, cfg);
            }
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => { void boot(); }, { once: true });
  } else {
    void boot();
  }
}

initQusaCustomUI();
})();
