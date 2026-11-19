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
};

const STORAGE_KEY = 'qusa_custom_ui_v2';

const DEFAULT_CONFIG = {
  colorEnabled: true,
  baseColor: '#121212',
  separateSidebar: false,
  sidebarColor: '#181818',
  panelContrast: 1.0,
  wallpaperUrl: '',
  wallpaperLocalName: '',
  wallpaperDim: 0.42,
  wallpaperBlur: 0,
  panelAlpha: 0.68,
  ruEnabled: false,
  customAccountName: '',
  modelRenames: {},
  fabHidden: false,
  fabHotkey: 'Alt+KeyS',
  fabLeft: null,
  fabTop: null,
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

function injectStyles(cfg) {
  let styleEl = document.getElementById('qusa-custom-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'qusa-custom-styles';
    document.head.appendChild(styleEl);
  }

  const baseRgb = hexToRgb(cfg.baseColor) || [18, 18, 18];
  const wpActive = hasActiveWallpaper(cfg);
  const isCustomColor = Boolean(cfg.colorEnabled && cfg.baseColor.toLowerCase() !== '#121212');
  const modalBg = shiftRgb(baseRgb, 10);
  const btnBg = shiftRgb(baseRgb, 16);
  const wpBlur = Number(cfg.wallpaperBlur || 0);
  const wpDim = Number(cfg.wallpaperDim ?? 0.42);

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
    ` : '')}

    /* Compact Native-Style Draggable Button */
    #qusa-style-fab {
      position: fixed;
      right: 215px;
      top: 42px;
      z-index: 99998;
      display: ${cfg.fabHidden ? 'none' : 'flex'};
      align-items: center;
      gap: 6px;
      padding: 5px 11px;
      border-radius: 8px;
      background: rgb(${btnBg[0]}, ${btnBg[1]}, ${btnBg[2]});
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.12);
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 12px;
      font-weight: 500;
      cursor: grab;
      user-select: none;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
      transition: border-color 0.15s ease, background-color 0.15s ease;
    }
    #qusa-style-fab:active {
      cursor: grabbing;
    }
    #qusa-style-fab:hover {
      border-color: rgba(255, 255, 255, 0.28);
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
      background: rgb(${modalBg[0]}, ${modalBg[1]}, ${modalBg[2]});
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
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
    if (el.closest('#qusa-theme-modal, #qusa-style-fab, #qusa-telemetry-bar, #qusa-bg-layer')) continue;
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
      const inSidebar = Boolean(el.closest('[data-qusa-role="sidebar"]'));
      if (inSidebar && shouldApply && rect.width >= 24 && rect.height >= 16 && rect.height <= 48) {
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
      const isInsideSidebar = Boolean(el.parentElement && el.parentElement.closest('[data-qusa-role="sidebar"]'));
      const isSidebarItem = !isPopup && (
        (isInsideSidebar && rect.height <= 56) ||
        (rect.left <= 36 && rect.right <= 390 && rect.width >= 100 && rect.height >= 18 && rect.height <= 56 && rect.top >= 48)
      );
      const isSidebar = !isPopup && !isSidebarItem && (
        el.tagName === 'ASIDE' ||
        el.tagName === 'NAV' ||
        Boolean(el.closest('aside, nav, [data-qusa-role="sidebar"]')) ||
        /sidebar/i.test(clsStr) ||
        (rect.left <= 24 && rect.right <= 390 && rect.width >= 140 && rect.height > window.innerHeight * 0.35)
      );
      const isHeader = !isPopup && !isSidebar && !isSidebarItem && (
        el.tagName === 'HEADER' ||
        (rect.top <= 48 && rect.height <= 64 && rect.width > window.innerWidth * 0.4)
      );
      const borderRad = parseFloat(cs.borderRadius) || 0;
      const isCard = !isPopup && !isSidebar && !isSidebarItem && !isHeader && (
        el.tagName === 'PRE' ||
        el.tagName === 'FORM' ||
        (borderRad >= 8 && rect.width < window.innerWidth * 0.72 && rect.height < window.innerHeight * 0.75)
      );
      role = isPopup ? 'popup' : isSidebarItem ? 'sidebar-item' : isSidebar ? 'sidebar' : isHeader ? 'header' : isCard ? 'card' : 'canvas';
      el.setAttribute('data-qusa-role', role);
    }

    if (!shouldApply) {
      el.style.removeProperty('background-color');
      continue;
    }

    if (wpActive && (role === 'canvas' || role === 'sidebar-item')) {
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
    if (wpActive) {
      if (role === 'popup') {
        outAlpha = Math.max(0.92, pAlpha);
      } else {
        outAlpha = pAlpha;
      }
    }

    const colorVal = outAlpha < 1
      ? `rgba(${shifted[0]}, ${shifted[1]}, ${shifted[2]}, ${outAlpha})`
      : `rgb(${shifted[0]}, ${shifted[1]}, ${shifted[2]})`;
    el.style.setProperty('background-color', colorVal, 'important');
  }
}

// --- Reversible Text Transforms (Model Renaming + Russian Translation) ---

const origTextMap = new WeakMap();
const lastAppliedMap = new WeakMap();
let detectedAccountName = '';

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
  if (el.closest && el.closest('pre, code, .prose, [contenteditable="true"], [data-lexical-editor], [data-testid*="drag"], [data-qusa-skip], #qusa-theme-modal, #qusa-style-fab, #qusa-telemetry-bar')) {
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
  const trimmed = raw.trim();
  if (!trimmed || /^[a-z0-9-]+$/.test(trimmed)) return raw;
  if (RU_DICT[trimmed]) return raw.replace(trimmed, RU_DICT[trimmed]);
  const agoMatch = trimmed.match(/^(\d+)([mhd])\s+ago$/);
  if (agoMatch) {
    const unitMap = { m: 'м назад', h: 'ч назад', d: 'д назад' };
    return raw.replace(trimmed, `${agoMatch[1]}${unitMap[agoMatch[2]]}`);
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
  if (cfg.ruEnabled) {
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

function createStyleUI(cfg) {
  if (!document.getElementById('qusa-style-fab')) {
    const fab = document.createElement('button');
    fab.id = 'qusa-style-fab';
    fab.type = 'button';
    fab.innerHTML = `<span id="qusa-fab-dot"></span><span>Стиль</span>`;
    if (cfg.fabLeft !== null && cfg.fabTop !== null) {
      fab.style.left = `${cfg.fabLeft}px`;
      fab.style.top = `${cfg.fabTop}px`;
      fab.style.right = 'auto';
    }
    let isDragging = false;
    let moved = false;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0;
    fab.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      moved = false;
      const rect = fab.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      origLeft = rect.left;
      origTop = rect.top;
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      if (moved) {
        const nextLeft = Math.max(4, Math.min(window.innerWidth - fab.offsetWidth - 4, origLeft + dx));
        const nextTop = Math.max(4, Math.min(window.innerHeight - fab.offsetHeight - 4, origTop + dy));
        fab.style.left = `${nextLeft}px`;
        fab.style.top = `${nextTop}px`;
        fab.style.right = 'auto';
      }
    });
    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      if (moved) {
        const rect = fab.getBoundingClientRect();
        cfg.fabLeft = Math.round(rect.left);
        cfg.fabTop = Math.round(rect.top);
        saveConfig(cfg, true);
      }
    });
    fab.addEventListener('click', () => {
      if (moved) return;
      const modal = document.getElementById('qusa-theme-modal');
      if (modal) modal.classList.add('open');
    });
    document.body.appendChild(fab);
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
    const fabHiddenToggle = document.getElementById('qusa-fab-hidden-toggle');
    const hotkeyBtn = document.getElementById('qusa-hotkey-btn');
    const hotkeyResetBtn = document.getElementById('qusa-hotkey-reset-btn');
    const accountNameInput = document.getElementById('qusa-account-name');
    const accountResetBtn = document.getElementById('qusa-account-reset-btn');
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
      fabHiddenToggle.checked = Boolean(cfg.fabHidden);
      hotkeyBtn.textContent = formatHotkey(cfg.fabHotkey || 'Alt+KeyS');
      accountNameInput.value = cfg.customAccountName || '';
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

    injectStyles(cfg);
    updateWallpaperLayer(cfg);
    createStyleUI(cfg);
    if (window.__qusaSyncWpStatus) window.__qusaSyncWpStatus();
    applySurfaceColors(cfg);
    applyTextTransforms(document.body, cfg);
    setTimeout(() => {
      applySurfaceColors(cfg);
      applyTextTransforms(document.body, cfg);
    }, 600);
    setTimeout(() => {
      applySurfaceColors(cfg);
      applyTextTransforms(document.body, cfg);
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
        }, 800);
      }
      const pairs = getActiveModelPairs(cfg);
      const hasAcc = Boolean((cfg.customAccountName || '').trim());
      if (!cfg.ruEnabled && pairs.length === 0 && !hasAcc) return;

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
