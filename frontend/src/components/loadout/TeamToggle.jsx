import clsx from 'clsx';
import { IconCtShield } from '../ui/IconCtShield';
import { IconTShield } from '../ui/IconTShield';
import { useTranslation } from '../../hooks/useTranslation';

export function TeamToggle({ team, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange('CT')}
        className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-md font-display font-bold uppercase tracking-wider text-sm transition-all duration-200',
          team === 'CT'
            ? 'bg-[#5BA3FF]/20 text-[#5BA3FF] shadow-[0_0_0_1px_#5BA3FF,0_0_20px_rgba(91,163,255,0.25)]'
            : 'text-muted hover:text-fg hover:bg-surface',
        )}
        aria-pressed={team === 'CT'}
      >
        <IconCtShield size={18} />
        {t('loadout.equip_ct')}
      </button>
      <button
        type="button"
        onClick={() => onChange('T')}
        className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-md font-display font-bold uppercase tracking-wider text-sm transition-all duration-200',
          team === 'T'
            ? 'bg-[#D4A02A]/20 text-[#D4A02A] shadow-[0_0_0_1px_#D4A02A,0_0_20px_rgba(212,160,42,0.25)]'
            : 'text-muted hover:text-fg hover:bg-surface',
        )}
        aria-pressed={team === 'T'}
      >
        <IconTShield size={18} />
        {t('loadout.equip_t')}
      </button>
    </div>
  );
}
