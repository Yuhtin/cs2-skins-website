// Tiny i18n core: ~60 lines, zero dependencies.
// Supports string interpolation via {{name}} placeholders.
// Subscribe/unsubscribe pattern lets React components re-render on locale change.

const LOCALES = {
  en: () => import('../locales/en.json'),
  'pt-BR': () => import('../locales/pt-BR.json'),
  pl: () => import('../locales/pl.json'),
};

let currentLocale = 'en';
let currentDict = {};
const listeners = new Set();
let loadSeq = 0;

export async function setLocale(code) {
  if (!(code in LOCALES)) code = 'en';
  const mySeq = ++loadSeq;
  const mod = await LOCALES[code]();
  if (mySeq !== loadSeq) return; // newer setLocale call superseded this one
  currentLocale = code;
  currentDict = mod.default;
  try {
    localStorage.setItem('locale', code);
  } catch {
    /* private mode */
  }
  listeners.forEach((l) => l());
}

export function t(key, params = {}) {
  const str = currentDict[key] || key;
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k] ?? `{{${k}}}`);
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getLocale() {
  return currentLocale;
}

export function resolveInitialLocale() {
  try {
    const stored = localStorage.getItem('locale');
    if (stored && stored in LOCALES) return stored;
  } catch {
    /* ignore */
  }
  const nav = (typeof navigator !== 'undefined' ? navigator.language : 'en').toLowerCase();
  if (nav.startsWith('pt')) return 'pt-BR';
  if (nav.startsWith('pl')) return 'pl';
  return 'en';
}
