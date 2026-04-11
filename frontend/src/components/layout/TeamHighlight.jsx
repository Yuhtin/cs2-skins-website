import clsx from 'clsx';
import { IconCtShield } from '../ui/IconCtShield';
import { IconTShield } from '../ui/IconTShield';
import { useTeamHighlight } from '../../hooks/useTeamHighlight';

export function TeamHighlightSwitch() {
  const { highlight, setHighlight } = useTeamHighlight();

  const toggle = (team) => {
    setHighlight(highlight === team ? null : team);
  };

  return (
    <div className="inline-flex items-center gap-1 bg-surface border border-subtle rounded-md p-0.5">
      <button
        type="button"
        onClick={() => toggle('CT')}
        className={clsx(
          'h-8 w-8 flex items-center justify-center rounded',
          highlight === 'CT'
            ? 'bg-accent2/20 text-accent2'
            : 'text-muted hover:text-fg',
        )}
        aria-pressed={highlight === 'CT'}
        aria-label="Highlight Counter-Terrorist"
      >
        <IconCtShield size={18} />
      </button>
      <button
        type="button"
        onClick={() => toggle('T')}
        className={clsx(
          'h-8 w-8 flex items-center justify-center rounded',
          highlight === 'T'
            ? 'bg-accent/20 text-accent'
            : 'text-muted hover:text-fg',
        )}
        aria-pressed={highlight === 'T'}
        aria-label="Highlight Terrorist"
      >
        <IconTShield size={18} />
      </button>
    </div>
  );
}
