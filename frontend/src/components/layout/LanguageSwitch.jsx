import { useTranslation } from '../../hooks/useTranslation';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'pt-BR', label: 'PT' },
  { code: 'pl', label: 'PL' },
];

export function LanguageSwitch() {
  const { locale, setLocale } = useTranslation();
  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value)}
      className="h-9 bg-surface border border-subtle rounded-md px-2 text-xs text-fg hover:bg-elevated focus:outline-none focus:ring-2 focus:ring-accent2/30"
      aria-label="Language"
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
