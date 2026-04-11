import { useSyncExternalStore } from 'react';
import { t, subscribe, getLocale, setLocale } from '../lib/i18n';

export function useTranslation() {
  // Re-render whenever locale changes via subscribe/notify.
  useSyncExternalStore(subscribe, getLocale, getLocale);
  return { t, locale: getLocale(), setLocale };
}
