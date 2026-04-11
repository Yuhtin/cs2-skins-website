import clsx from 'clsx';
import { IconCtShield } from '../ui/IconCtShield';
import { IconTShield } from '../ui/IconTShield';
import { useTranslation } from '../../hooks/useTranslation';

export function TeamToggle({ team, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="inline-flex items-center gap-3 p-1 bg-surface/80 backdrop-blur-sm border border-subtle rounded-lg">
      <button
        type="button"
        onClick={() => onChange('CT')}
        className={clsx(
          'flex items-center gap-2 px-5 py-2.5 rounded-md font-display font-bold uppercase tracking-[0.15em] text-sm transition-all duration-200',
          team === 'CT'
            ? 'bg-[#5BA3FF]/15 text-[#5BA3FF] shadow-[0_0_0_2px_#5BA3FF,0_0_28px_rgba(91,163,255,0.35),inset_0_1px_0_rgba(255,255,255,0.1)]'
            : 'text-muted hover:text-fg hover:bg-surface',
        )}
        aria-pressed={team === 'CT'}
      >
        <IconCtShield size={20} />
        {t('loadout.equip_ct')}
      </button>
      <button
        type="button"
        onClick={() => onChange('T')}
        className={clsx(
          'flex items-center gap-2 px-5 py-2.5 rounded-md font-display font-bold uppercase tracking-[0.15em] text-sm transition-all duration-200',
          team === 'T'
            ? 'bg-[#D4A02A]/15 text-[#D4A02A] shadow-[0_0_0_2px_#D4A02A,0_0_28px_rgba(212,160,42,0.35),inset_0_1px_0_rgba(255,255,255,0.1)]'
            : 'text-muted hover:text-fg hover:bg-surface',
        )}
        aria-pressed={team === 'T'}
      >
        <IconTShield size={20} />
        {t('loadout.equip_t')}
      </button>
    </div>
  );
}
