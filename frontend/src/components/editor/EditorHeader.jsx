import { RotateCcw } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Tooltip } from '../ui/Tooltip';

export function EditorHeader({ weapon, isDirty, onRevert }) {
  const { t } = useTranslation();
  const teamLabel =
    weapon.team === 'both'
      ? t('arsenal.shared_section')
      : weapon.team === 'CT'
      ? t('arsenal.ct_section')
      : t('arsenal.t_section');

  return (
    <div className="flex items-start justify-between gap-4 p-4 border-b border-subtle">
      <div>
        <h2 className="font-display font-bold text-2xl tracking-tight">{weapon.displayName}</h2>
        <p className="text-xs text-faint uppercase tracking-wider">
          {weapon.category} · {teamLabel}
        </p>
      </div>
      {isDirty && (
        <Tooltip content={t('editor.revert')}>
          <button
            type="button"
            onClick={onRevert}
            className="h-9 w-9 flex items-center justify-center rounded-md text-muted hover:text-danger hover:bg-danger/10 transition-colors"
            aria-label={t('editor.revert')}
          >
            <RotateCcw size={18} />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
