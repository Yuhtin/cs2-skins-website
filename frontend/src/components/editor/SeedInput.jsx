import { Dices } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Input } from '../ui/Input';
import { Tooltip } from '../ui/Tooltip';

export function SeedInput({ value, onChange }) {
  const { t } = useTranslation();

  const randomize = () => {
    onChange(Math.floor(Math.random() * 1000));
  };

  return (
    <div className="p-4 border-b border-subtle">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
        {t('editor.seed_label')}
      </label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          max={1000}
          value={value}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (Number.isNaN(n)) {
              onChange(0);
              return;
            }
            onChange(Math.min(1000, Math.max(0, n)));
          }}
          className="tabular font-mono flex-1"
        />
        <Tooltip content={t('editor.seed_random')}>
          <button
            type="button"
            onClick={randomize}
            className="h-10 w-10 flex items-center justify-center rounded-md bg-surface border border-subtle text-muted hover:bg-elevated hover:text-fg transition-colors"
            aria-label={t('editor.seed_random')}
          >
            <Dices size={18} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
