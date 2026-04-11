import { useTranslation } from '../../hooks/useTranslation';
import { Input } from '../ui/Input';

export function NametagInput({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="p-4 border-b border-subtle">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
        {t('editor.nametag_label')}
      </label>
      <Input
        type="text"
        maxLength={20}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('editor.nametag_placeholder')}
      />
    </div>
  );
}
